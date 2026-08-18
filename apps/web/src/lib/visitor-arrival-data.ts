/**
 * Visitor arrivals to New Zealand by country of residence, for the years
 * ended December 2015 and 2019, from the Stats NZ release "International
 * travel: December 2019" (Table 4, visitor arrivals workbook). The 2019
 * endpoint is the last full pre-pandemic year, so the series avoids the
 * 2020-21 border-closure break. Rows are the top 20 countries of residence
 * by 2019 arrivals, verified against the release workbook.
 */

export interface VisitorArrivalRow {
  key: string;
  name: string;
  arrivals2015: number;
  arrivals2019: number;
}

export const VISITOR_ARRIVAL_YEARS = [2015, 2019] as const;

export type VisitorArrivalYear = (typeof VISITOR_ARRIVAL_YEARS)[number];

export const VISITOR_ARRIVAL_ROWS: VisitorArrivalRow[] = [
  { key: 'australia', name: 'Australia', arrivals2015: 1326800, arrivals2019: 1537988 },
  { key: 'china', name: 'China', arrivals2015: 355904, arrivals2019: 407141 },
  { key: 'united-states', name: 'United States', arrivals2015: 243104, arrivals2019: 367958 },
  { key: 'united-kingdom', name: 'United Kingdom', arrivals2015: 203952, arrivals2019: 231712 },
  { key: 'japan', name: 'Japan', arrivals2015: 87328, arrivals2019: 97682 },
  { key: 'germany', name: 'Germany', arrivals2015: 84544, arrivals2019: 98050 },
  { key: 'south-korea', name: 'South Korea', arrivals2015: 64992, arrivals2019: 88481 },
  { key: 'canada', name: 'Canada', arrivals2015: 52352, arrivals2019: 73037 },
  { key: 'singapore', name: 'Singapore', arrivals2015: 49584, arrivals2019: 64574 },
  { key: 'india', name: 'India', arrivals2015: 46000, arrivals2019: 66775 },
  { key: 'hong-kong', name: 'Hong Kong', arrivals2015: 36288, arrivals2019: 53720 },
  { key: 'malaysia', name: 'Malaysia', arrivals2015: 34240, arrivals2019: 41779 },
  { key: 'france', name: 'France', arrivals2015: 33376, arrivals2019: 40777 },
  { key: 'taiwan', name: 'Taiwan', arrivals2015: 31200, arrivals2019: 53453 },
  { key: 'fiji', name: 'Fiji', arrivals2015: 26352, arrivals2019: 33630 },
  { key: 'netherlands', name: 'Netherlands', arrivals2015: 22256, arrivals2019: 30337 },
  { key: 'thailand', name: 'Thailand', arrivals2015: 21696, arrivals2019: 28378 },
  { key: 'samoa', name: 'Samoa', arrivals2015: 21184, arrivals2019: 28654 },
  { key: 'switzerland', name: 'Switzerland', arrivals2015: 19136, arrivals2019: 21637 },
  { key: 'new-caledonia', name: 'New Caledonia', arrivals2015: 17728, arrivals2019: 20744 },
];

/** Arrivals for one country in one year, or 0 when the row is missing. */
export function arrivalsForYear(row: VisitorArrivalRow, year: VisitorArrivalYear): number {
  return year === 2015 ? row.arrivals2015 : row.arrivals2019;
}

/** Percentage change in arrivals between 2015 and 2019, rounded to whole. */
export function visitorArrivalGrowthPercent(row: VisitorArrivalRow): number {
  if (row.arrivals2015 === 0) {
    return 0;
  }
  return Math.round(((row.arrivals2019 - row.arrivals2015) / row.arrivals2015) * 100);
}

/** Total arrivals across the top 20 countries for one year. */
export function visitorArrivalTotal(year: VisitorArrivalYear): number {
  return VISITOR_ARRIVAL_ROWS.reduce((total, row) => total + arrivalsForYear(row, year), 0);
}
