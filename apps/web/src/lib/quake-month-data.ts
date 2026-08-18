import { NzSourceApiError, NzSourceParseError } from '@nzlab/nz-sources';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parseGeoNetFdsnEvents } from './quake-catalog';
import type { QuakeCatalogEvent } from './quake-catalog';

const FDSN_EVENT_QUERY_URL = 'https://service.geonet.org.nz/fdsnws/event/1/query';

const MONTHS_OF_HISTORY = 24;
const MIN_MAGNITUDE = 3;

const MONTH_FIXTURE_PATH = path.join(process.cwd(), 'src/lib/fixtures/geonet-catalog-m3-24mo.json');

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** One month of the quake calendar: the 1-12 month number and its count. */
export interface QuakeMonthBin {
  month: number;
  label: string;
  count: number;
}

/** Rolled-up facts about the monthly quake pattern. */
export interface QuakeMonthSummary {
  total: number;
  busiest: QuakeMonthBin;
  quietest: QuakeMonthBin;
}

/**
 * Bins catalog events into the 12 calendar months, optionally filtered.
 * @param events - the catalog events to bin
 * @param year - the year to keep, or 'all' for every year
 * @param minMagnitude - only count events at or above this magnitude
 * @returns the 12 month bins with their counts
 */
export function buildQuakeMonthBins(
  events: QuakeCatalogEvent[],
  year: number | 'all',
  minMagnitude: number,
): QuakeMonthBin[] {
  const bins: QuakeMonthBin[] = MONTH_LABELS.map((label, index) => ({
    month: index + 1,
    label,
    count: 0,
  }));
  for (const event of events) {
    if (event.magnitude < minMagnitude) {
      continue;
    }
    const date = new Date(event.timeEpochSec * 1000);
    if (year !== 'all' && date.getUTCFullYear() !== year) {
      continue;
    }
    const bin = bins[date.getUTCMonth()];
    if (bin !== undefined) {
      bin.count += 1;
    }
  }
  return bins;
}

/**
 * Summarizes the monthly pattern: total, busiest month, quietest month.
 * @param bins - the 12 month bins
 * @returns the total and the busiest and quietest months
 */
export function summarizeQuakeMonths(bins: QuakeMonthBin[]): QuakeMonthSummary {
  const total = bins.reduce((sum, bin) => sum + bin.count, 0);
  const first = bins[0];
  if (first === undefined) {
    return {
      total: 0,
      busiest: { month: 1, label: 'Jan', count: 0 },
      quietest: { month: 1, label: 'Jan', count: 0 },
    };
  }
  const busiest = bins.reduce((best, bin) => (bin.count > best.count ? bin : best), first);
  const quietest = bins.reduce((best, bin) => (bin.count < best.count ? bin : best), first);
  return { total, busiest, quietest };
}

/**
 * Loads the committed 24-month M3+ GeoNet catalog snapshot.
 * @returns the catalog events from the fixture
 */
export function loadQuakeMonthFixture(): QuakeCatalogEvent[] {
  const parsed = JSON.parse(readFileSync(MONTH_FIXTURE_PATH, 'utf8')) as unknown;
  if (!Array.isArray(parsed)) {
    throw new NzSourceParseError('GeoNet FDSN', 'month fixture is not an array');
  }
  return parsed.map((row) => {
    const event = row as { t?: unknown; m?: unknown; d?: unknown };
    if (typeof event.t !== 'number' || typeof event.m !== 'number' || typeof event.d !== 'number') {
      throw new NzSourceParseError('GeoNet FDSN', 'month fixture row is malformed');
    }
    return { timeEpochSec: event.t, magnitude: event.m, depthKm: event.d };
  });
}

/**
 * Fetches earthquakes of magnitude 3 or stronger from GeoNet's FDSN event
 * service for the last 24 months, falling back to a committed snapshot of
 * the 19 August 2026 catalog when the service blocks the build runner. The
 * site redeploys daily, so the rose refreshes with the latest catalog.
 */
/**
 * Fetches the 24-month M3+ catalog from GeoNet's FDSN service.
 * @returns the catalog events, or the committed snapshot when the fetch fails
 */
export async function fetchQuakeMonthCatalog(): Promise<QuakeCatalogEvent[]> {
  try {
    const end = new Date();
    const start = new Date();
    start.setUTCMonth(start.getUTCMonth() - MONTHS_OF_HISTORY);
    const params = new URLSearchParams({
      starttime: start.toISOString(),
      endtime: end.toISOString(),
      minmagnitude: String(MIN_MAGNITUDE),
      format: 'text',
    });
    const response = await fetch(`${FDSN_EVENT_QUERY_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new NzSourceApiError('GeoNet FDSN', `HTTP ${response.status}`);
    }
    return parseGeoNetFdsnEvents(await response.text());
  } catch {
    return loadQuakeMonthFixture();
  }
}
