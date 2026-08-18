/**
 * Pure month-binning helpers for the quake month rose, kept free of node:fs
 * so the client chart can import them without dragging server-only modules
 * into the browser bundle.
 */
import type { QuakeCatalogEvent } from './quake-catalog';

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
