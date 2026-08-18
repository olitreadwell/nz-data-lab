/**
 * Census usually resident population counts for the main city territorial
 * authorities, derived from the Stats NZ 2023 Census release "2023 Census
 * population counts (by ethnic group, age, and Maori descent) and dwelling
 * counts" (Table 2, published 29 May 2024). Ranks are computed among the
 * cities listed here, not among all 67 territorial authorities. Counts have
 * fixed random rounding to base 3 applied.
 */
import { CENSUS_TA_POPULATION_ROWS } from './census-rank-data';

export interface CityRankRow {
  name: string;
  population2013: number;
  population2018: number;
  population2023: number;
  rank2013: number;
  rank2018: number;
  rank2023: number;
}

export const CITY_RANK_YEARS = [2013, 2018, 2023] as const;

const CITY_NAMES = [
  'Auckland',
  'Christchurch city',
  'Wellington city',
  'Hamilton city',
  'Tauranga city',
  'Dunedin city',
  'Lower Hutt city',
  'Palmerston North city',
  'Napier city',
  'Porirua city',
];

const CITY_ROWS = CENSUS_TA_POPULATION_ROWS.filter((row) => CITY_NAMES.includes(row.name));

function rankByYear(rows: typeof CITY_ROWS, year: 2013 | 2018 | 2023): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b[`population${year}`] - a[`population${year}`]);
  return new Map(sorted.map((row, index) => [row.name, index + 1]));
}

const ranks2013 = rankByYear(CITY_ROWS, 2013);
const ranks2018 = rankByYear(CITY_ROWS, 2018);
const ranks2023 = rankByYear(CITY_ROWS, 2023);

export const CITY_RANK_ROWS: CityRankRow[] = CITY_ROWS.map((row) => ({
  name: row.name,
  population2013: row.population2013,
  population2018: row.population2018,
  population2023: row.population2023,
  rank2013: ranks2013.get(row.name) ?? 0,
  rank2018: ranks2018.get(row.name) ?? 0,
  rank2023: ranks2023.get(row.name) ?? 0,
}));
