/**
 * Visitor arrivals to New Zealand by country of residence, for the years
 * ended December 2015 and 2019, from the Stats NZ release "International
 * travel: December 2019" (Table 4, visitor arrivals workbook). The 2019
 * endpoint is the last full pre-pandemic year, so the series avoids the
 * 2020-21 border-closure break. Ranks are computed among the top 30
 * countries of residence listed in the release.
 */

export interface VisitorRankRow {
  name: string;
  arrivals2015: number;
  arrivals2019: number;
  rank2015: number;
  rank2019: number;
}

export const VISITOR_RANK_YEARS = [2015, 2019] as const;

const VISITOR_ARRIVALS: Array<{
  name: string;
  arrivals2015: number;
  arrivals2019: number;
}> = [
  { name: 'Australia', arrivals2015: 1326800, arrivals2019: 1537988 },
  { name: 'China', arrivals2015: 355904, arrivals2019: 407141 },
  { name: 'United States', arrivals2015: 243104, arrivals2019: 367958 },
  { name: 'United Kingdom', arrivals2015: 203952, arrivals2019: 231712 },
  { name: 'Japan', arrivals2015: 87328, arrivals2019: 97682 },
  { name: 'Germany', arrivals2015: 84544, arrivals2019: 98050 },
  { name: 'South Korea', arrivals2015: 64992, arrivals2019: 88481 },
  { name: 'Canada', arrivals2015: 52352, arrivals2019: 73037 },
  { name: 'Singapore', arrivals2015: 49584, arrivals2019: 64574 },
  { name: 'India', arrivals2015: 46000, arrivals2019: 66775 },
  { name: 'Hong Kong', arrivals2015: 36288, arrivals2019: 53720 },
  { name: 'Malaysia', arrivals2015: 34240, arrivals2019: 41779 },
  { name: 'France', arrivals2015: 33376, arrivals2019: 40777 },
  { name: 'Taiwan', arrivals2015: 31200, arrivals2019: 53453 },
  { name: 'Fiji', arrivals2015: 26352, arrivals2019: 33630 },
  { name: 'Netherlands', arrivals2015: 22256, arrivals2019: 30337 },
  { name: 'Thailand', arrivals2015: 21696, arrivals2019: 28378 },
  { name: 'Samoa', arrivals2015: 21184, arrivals2019: 28654 },
  { name: 'Switzerland', arrivals2015: 19136, arrivals2019: 21637 },
  { name: 'New Caledonia', arrivals2015: 17728, arrivals2019: 20744 },
  { name: 'Tonga', arrivals2015: 17600, arrivals2019: 21354 },
  { name: 'South Africa', arrivals2015: 17008, arrivals2019: 26296 },
  { name: 'French Polynesia', arrivals2015: 16912, arrivals2019: 26291 },
  { name: 'Indonesia', arrivals2015: 16176, arrivals2019: 27697 },
  { name: 'Philippines', arrivals2015: 14016, arrivals2019: 27505 },
  { name: 'Sweden', arrivals2015: 13920, arrivals2019: 14533 },
  { name: 'Brazil', arrivals2015: 13152, arrivals2019: 16566 },
  { name: 'Cook Islands', arrivals2015: 10560, arrivals2019: 14036 },
  { name: 'Spain', arrivals2015: 10144, arrivals2019: 14172 },
  { name: 'Argentina', arrivals2015: 5392, arrivals2019: 14095 },
];

function rankByYear(
  rows: Array<{ name: string; arrivals2015: number; arrivals2019: number }>,
  year: 2015 | 2019,
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b[`arrivals${year}`] - a[`arrivals${year}`]);
  return new Map(sorted.map((row, index) => [row.name, index + 1]));
}

const ranks2015 = rankByYear(VISITOR_ARRIVALS, 2015);
const ranks2019 = rankByYear(VISITOR_ARRIVALS, 2019);

export const VISITOR_RANK_ROWS: VisitorRankRow[] = VISITOR_ARRIVALS.map((row) => ({
  ...row,
  rank2015: ranks2015.get(row.name) ?? 0,
  rank2019: ranks2019.get(row.name) ?? 0,
}));
