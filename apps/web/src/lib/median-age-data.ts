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
    const tied = previous !== undefined && previous[`medianAge${year}`] === row[`medianAge${year}`];
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
