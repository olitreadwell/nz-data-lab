/**
 * Census median age data for two microsites: the median age ranks
 * (viz-100, from published median ages) and the ageing map (viz-069,
 * medians interpolated within five-year bands). Both are merged here
 * because they share one module.
 */

/**
 * Median age by regional council, from the Stats NZ 2023 Census release
 * "2023 Census population counts (by ethnic group, age, and Maori descent)
 * and dwelling counts" (Table 7, published 29 May 2024). Median age is
 * calculated from single-year-of-age data, so the values are final and this
 * snapshot does not go stale. Ranks are computed among the 16 regions, with
 * tied medians sharing a rank.
 */

export interface MedianAgeRow {
  name: string;
  medianAge2013: number;
  medianAge2018: number;
  medianAge2023: number;
  rank2013: number;
  rank2018: number;
  rank2023: number;
}

export const MEDIAN_AGE_YEARS = [2013, 2018, 2023] as const;

const MEDIAN_AGES: Array<{
  name: string;
  medianAge2013: number;
  medianAge2018: number;
  medianAge2023: number;
}> = [
  { name: 'Northland', medianAge2013: 42.7, medianAge2018: 42.6, medianAge2023: 43.2 },
  { name: 'Auckland', medianAge2013: 35.1, medianAge2018: 34.7, medianAge2023: 35.9 },
  { name: 'Waikato', medianAge2013: 37.7, medianAge2018: 37.4, medianAge2023: 37.9 },
  { name: 'Bay of Plenty', medianAge2013: 40.6, medianAge2018: 40.2, medianAge2023: 39.7 },
  { name: 'Gisborne', medianAge2013: 37.0, medianAge2018: 37.0, medianAge2023: 36.7 },
  { name: "Hawke's Bay", medianAge2013: 40.6, medianAge2018: 40.6, medianAge2023: 40.4 },
  { name: 'Taranaki', medianAge2013: 39.9, medianAge2018: 40.0, medianAge2023: 40.4 },
  {
    name: 'Manawatu-Whanganui',
    medianAge2013: 39.3,
    medianAge2018: 39.4,
    medianAge2023: 39.7,
  },
  { name: 'Wellington', medianAge2013: 37.2, medianAge2018: 37.2, medianAge2023: 37.9 },
  { name: 'Tasman', medianAge2013: 44.2, medianAge2018: 46.0, medianAge2023: 46.8 },
  { name: 'Nelson', medianAge2013: 42.5, medianAge2018: 43.4, medianAge2023: 44.0 },
  { name: 'Marlborough', medianAge2013: 45.0, medianAge2018: 45.5, medianAge2023: 46.1 },
  { name: 'West Coast', medianAge2013: 42.8, medianAge2018: 45.7, medianAge2023: 48.1 },
  { name: 'Canterbury', medianAge2013: 39.9, medianAge2018: 38.7, medianAge2023: 39.1 },
  { name: 'Otago', medianAge2013: 39.0, medianAge2018: 38.2, medianAge2023: 38.4 },
  { name: 'Southland', medianAge2013: 39.6, medianAge2018: 39.8, medianAge2023: 40.4 },
];

function rankByYear(
  rows: Array<{
    name: string;
    medianAge2013: number;
    medianAge2018: number;
    medianAge2023: number;
  }>,
  year: 2013 | 2018 | 2023,
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b[`medianAge${year}`] - a[`medianAge${year}`]);
  const rankByName = new Map<string, number>();
  sorted.forEach((row, index) => {
    const previous = sorted[index - 1];
    const tied = previous?.[`medianAge${year}`] === row[`medianAge${year}`];
    rankByName.set(row.name, tied ? (rankByName.get(previous.name) ?? 0) : index + 1);
  });
  return rankByName;
}

const ranks2013 = rankByYear(MEDIAN_AGES, 2013);
const ranks2018 = rankByYear(MEDIAN_AGES, 2018);
const ranks2023 = rankByYear(MEDIAN_AGES, 2023);

export const MEDIAN_AGE_ROWS: MedianAgeRow[] = MEDIAN_AGES.map((row) => ({
  ...row,
  rank2013: ranks2013.get(row.name) ?? 0,
  rank2018: ranks2018.get(row.name) ?? 0,
  rank2023: ranks2023.get(row.name) ?? 0,
}));

/**
 * Census median age by regional council area, computed from the Stats NZ
 * 2023 Census release "2023 Census population counts (by ethnic group, age,
 * and Maori descent) and dwelling counts" (Table 7, age in five-year groups
 * for the census usually resident population, 2013, 2018, and 2023
 * censuses). Each median is found by linear interpolation within the
 * five-year band that holds the midpoint of the region's population, so the
 * values are estimates, not published medians. Verified against the release
 * workbook (published 29 May 2024).
 */

export interface MedianAgeRegionRow {
  key: string;
  name: string;
  column: number;
  row: number;
  median2013: number;
  median2018: number;
  median2023: number;
}

export const CENSUS_YEARS = [2013, 2018, 2023] as const;

export type CensusYear = (typeof CENSUS_YEARS)[number];

/** National median age by census year (Table 7, total row). */
export const NATIONAL_MEDIAN_AGE: Record<CensusYear, number> = {
  2013: 37.9,
  2018: 37.5,
  2023: 38.2,
};

export const MEDIAN_AGE_REGION_ROWS: MedianAgeRegionRow[] = [
  {
    key: 'northland',
    name: 'Northland',
    column: 0,
    row: 0,
    median2013: 42.7,
    median2018: 42.5,
    median2023: 43.2,
  },
  {
    key: 'auckland',
    name: 'Auckland',
    column: 1,
    row: 0,
    median2013: 35.1,
    median2018: 34.7,
    median2023: 35.9,
  },
  {
    key: 'waikato',
    name: 'Waikato',
    column: 2,
    row: 0,
    median2013: 37.6,
    median2018: 37.4,
    median2023: 38.0,
  },
  {
    key: 'bay-of-plenty',
    name: 'Bay of Plenty',
    column: 3,
    row: 0,
    median2013: 40.6,
    median2018: 40.2,
    median2023: 39.7,
  },
  {
    key: 'taranaki',
    name: 'Taranaki',
    column: 0,
    row: 1,
    median2013: 39.9,
    median2018: 40.0,
    median2023: 40.4,
  },
  {
    key: 'manawatu-whanganui',
    name: 'Manawatū-Whanganui',
    column: 1,
    row: 1,
    median2013: 39.3,
    median2018: 39.4,
    median2023: 39.8,
  },
  {
    key: 'hawkes-bay',
    name: "Hawke's Bay",
    column: 2,
    row: 1,
    median2013: 40.6,
    median2018: 40.6,
    median2023: 40.4,
  },
  {
    key: 'gisborne',
    name: 'Gisborne',
    column: 3,
    row: 1,
    median2013: 36.9,
    median2018: 37.0,
    median2023: 36.8,
  },
  {
    key: 'wellington',
    name: 'Wellington',
    column: 0,
    row: 2,
    median2013: 37.1,
    median2018: 37.3,
    median2023: 38.0,
  },
  {
    key: 'tasman',
    name: 'Tasman',
    column: 1,
    row: 2,
    median2013: 44.2,
    median2018: 46.0,
    median2023: 46.7,
  },
  {
    key: 'nelson',
    name: 'Nelson',
    column: 2,
    row: 2,
    median2013: 42.5,
    median2018: 43.2,
    median2023: 44.0,
  },
  {
    key: 'marlborough',
    name: 'Marlborough',
    column: 3,
    row: 2,
    median2013: 45.0,
    median2018: 45.5,
    median2023: 46.0,
  },
  {
    key: 'west-coast',
    name: 'West Coast',
    column: 0,
    row: 3,
    median2013: 42.8,
    median2018: 45.6,
    median2023: 47.9,
  },
  {
    key: 'canterbury',
    name: 'Canterbury',
    column: 1,
    row: 3,
    median2013: 39.9,
    median2018: 38.8,
    median2023: 39.1,
  },
  {
    key: 'otago',
    name: 'Otago',
    column: 2,
    row: 3,
    median2013: 38.9,
    median2018: 38.3,
    median2023: 38.6,
  },
  {
    key: 'southland',
    name: 'Southland',
    column: 3,
    row: 3,
    median2013: 39.6,
    median2018: 39.8,
    median2023: 40.4,
  },
];

/** Returns the median age for a region in a given census year. */
export function medianAgeForYear(row: MedianAgeRegionRow, year: CensusYear): number {
  if (year === 2013) {
    return row.median2013;
  }
  if (year === 2018) {
    return row.median2018;
  }
  return row.median2023;
}
