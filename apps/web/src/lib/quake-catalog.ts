import { NzSourceApiError, NzSourceParseError } from '@nzlab/nz-sources';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/** One earthquake in the GeoNet catalog, reduced to what the chart needs. */
export interface QuakeCatalogEvent {
  timeEpochSec: number;
  magnitude: number;
}

const FDSN_EVENT_QUERY_URL = 'https://service.geonet.org.nz/fdsnws/event/1/query';

const QUAKE_CATALOG_FIXTURE_PATH = path.join(
  process.cwd(),
  'src/lib/fixtures/geonet-catalog-3mo.json',
);

/**
 * Parses the GeoNet FDSN event text format (pipe-delimited, header on the
 * first line) into catalog events. Only rows typed as earthquakes are kept:
 * the catalog also lists quarry blasts, landslides, and global events
 * outside GeoNet's network interest.
 */
/** Parses a GeoNet FDSN event text payload into catalog events.
 * @param payload - the pipe-delimited FDSN event text
 * @returns the earthquake events with time and magnitude
 */
export function parseGeoNetFdsnEvents(payload: string): QuakeCatalogEvent[] {
  const lines = payload.trim().split('\n');
  const header = lines[0];
  if (header?.includes('EventID') !== true) {
    throw new NzSourceParseError('GeoNet FDSN', 'missing event header');
  }
  const columns = header.split('|').map((column) => column.trim());
  const timeIndex = columns.indexOf('Time');
  const magnitudeIndex = columns.indexOf('Magnitude');
  const eventTypeIndex = columns.indexOf('EventType');
  if (timeIndex < 0 || magnitudeIndex < 0 || eventTypeIndex < 0) {
    throw new NzSourceParseError('GeoNet FDSN', 'missing expected columns');
  }
  const events: QuakeCatalogEvent[] = [];
  for (const line of lines.slice(1)) {
    const cells = line.split('|');
    if ((cells[eventTypeIndex] ?? '').trim() !== 'earthquake') {
      continue;
    }
    const magnitude = Number(cells[magnitudeIndex]);
    const timeEpochSec = Date.parse(cells[timeIndex] ?? '') / 1000;
    if (!Number.isFinite(magnitude) || !Number.isFinite(timeEpochSec)) {
      continue;
    }
    events.push({ timeEpochSec, magnitude });
  }
  return events;
}

/**
 * Fetches earthquake events of magnitude 1 or stronger from GeoNet's FDSN
 * event service for the last `months` months, falling back to a committed
 * snapshot of the 18 August 2026 catalog when the service blocks the build
 * runner. The site redeploys daily, so the histogram refreshes with the
 * latest catalog.
 */
/** Fetches the recent earthquake catalog from GeoNet's FDSN service.
 * @param months - how many months of history to fetch
 * @returns the catalog events, or the committed snapshot when the fetch fails
 */
export async function fetchRecentQuakeCatalog(months: number): Promise<QuakeCatalogEvent[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setUTCMonth(start.getUTCMonth() - months);
    const params = new URLSearchParams({
      starttime: start.toISOString(),
      endtime: end.toISOString(),
      minmagnitude: '1',
      format: 'text',
    });
    const response = await fetch(`${FDSN_EVENT_QUERY_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new NzSourceApiError('GeoNet FDSN', `HTTP ${response.status}`);
    }
    return parseGeoNetFdsnEvents(await response.text());
  } catch {
    return loadQuakeCatalogFixture();
  }
}

/** Loads the committed 3-month GeoNet catalog snapshot.
 * @returns the catalog events from the fixture
 */
export function loadQuakeCatalogFixture(): QuakeCatalogEvent[] {
  const parsed = JSON.parse(readFileSync(QUAKE_CATALOG_FIXTURE_PATH, 'utf8')) as unknown;
  if (!Array.isArray(parsed)) {
    throw new NzSourceParseError('GeoNet FDSN', 'catalog fixture is not an array');
  }
  return parsed.map((row) => {
    const event = row as { t?: unknown; m?: unknown };
    if (typeof event.t !== 'number' || typeof event.m !== 'number') {
      throw new NzSourceParseError('GeoNet FDSN', 'catalog fixture row is malformed');
    }
    return { timeEpochSec: event.t, magnitude: event.m };
  });
}
