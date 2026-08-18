import { readFileSync } from 'node:fs';
import path from 'node:path';

/** One earthquake in the yearly GeoNet catalog snapshot, reduced to what the chart needs. */
export interface QuakeYearEvent {
  /** Calendar year of the earthquake. */
  y: number;
  /** Magnitude. */
  m: number;
  /** Depth in kilometres. */
  d: number;
  /** Time as epoch seconds. */
  t: number;
  /** GeoNet locality string, for example "15 km north-east of Culverden". */
  p: string;
}

const QUAKE_YEAR_FIXTURE_PATH = path.join(
  process.cwd(),
  'src/lib/fixtures/geonet-m4-2001-2024.json',
);

const parsed = JSON.parse(readFileSync(QUAKE_YEAR_FIXTURE_PATH, 'utf8')) as unknown;
if (!Array.isArray(parsed)) {
  throw new Error('quake year fixture is not an array');
}

/** Earthquakes at magnitude 4.0 or stronger in the New Zealand region, 2001 to 2024. */
export const QUAKE_YEAR_EVENTS: QuakeYearEvent[] = parsed.map((row) => {
  const event = row as { y?: unknown; m?: unknown; d?: unknown; t?: unknown; p?: unknown };
  if (
    typeof event.y !== 'number' ||
    typeof event.m !== 'number' ||
    typeof event.d !== 'number' ||
    typeof event.t !== 'number' ||
    typeof event.p !== 'string'
  ) {
    throw new Error('quake year fixture row is malformed');
  }
  return { y: event.y, m: event.m, d: event.d, t: event.t, p: event.p };
});

/** First and last years covered by the snapshot. */
export const QUAKE_YEAR_START = 2001;
export const QUAKE_YEAR_END = 2024;

/** Total earthquakes in the snapshot. */
export const QUAKE_YEAR_TOTAL = QUAKE_YEAR_EVENTS.length;

/** Earthquakes at magnitude 4.0 or stronger, by year. */
export const QUAKE_YEAR_COUNTS: Record<number, number> = QUAKE_YEAR_EVENTS.reduce<
  Record<number, number>
>((counts, event) => {
  counts[event.y] = (counts[event.y] ?? 0) + 1;
  return counts;
}, {});

/** The busiest year and its count. */
export const QUAKE_YEAR_PEAK = Object.entries(QUAKE_YEAR_COUNTS).reduce(
  (best, [year, count]) => (count > best.count ? { year: Number(year), count } : best),
  { year: QUAKE_YEAR_START, count: 0 },
);

/** The quietest year and its count. */
export const QUAKE_YEAR_QUIET = Object.entries(QUAKE_YEAR_COUNTS).reduce(
  (best, [year, count]) => (count < best.count ? { year: Number(year), count } : best),
  { year: QUAKE_YEAR_START, count: Number.MAX_SAFE_INTEGER },
);

/** Strongest earthquakes in the snapshot, strongest first. */
export const QUAKE_YEAR_STRONGEST = [...QUAKE_YEAR_EVENTS].sort((a, b) => b.m - a.m).slice(0, 3);

/**
 * Filters the snapshot to events at or above a magnitude floor.
 *
 * @param minMagnitude - the magnitude floor
 * @returns the matching events
 */
export function filterQuakeYearsByMinMagnitude(minMagnitude: number): QuakeYearEvent[] {
  return QUAKE_YEAR_EVENTS.filter((event) => event.m >= minMagnitude);
}
