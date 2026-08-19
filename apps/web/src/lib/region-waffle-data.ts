/**
 * Census usually resident population count by regional council area for the
 * 2013, 2018, and 2023 Censuses, from Stats NZ "2023 Census population
 * counts (by ethnic group, age, and Maori descent) and dwelling counts"
 * (Table 1, published 29 May 2024). Counts have fixed random rounding to
 * base 3 applied, so region counts can differ from the published total by
 * a few people. The values are final census counts, so this snapshot does
 * not go stale.
 */

export const CENSUS_POPULATION_YEARS = [2013, 2018, 2023] as const;

export type CensusPopulationYear = (typeof CENSUS_POPULATION_YEARS)[number];

export interface RegionPopulation {
  key: string;
  name: string;
  color: string;
  countsByYear: Record<CensusPopulationYear, number>;
}

export const REGION_POPULATIONS: RegionPopulation[] = [
  {
    key: 'northland',
    name: 'Northland',
    color: '#0072B2',
    countsByYear: { 2013: 151689, 2018: 179076, 2023: 194007 },
  },
  {
    key: 'auckland',
    name: 'Auckland',
    color: '#D55E00',
    countsByYear: { 2013: 1415550, 2018: 1571718, 2023: 1656486 },
  },
  {
    key: 'waikato',
    name: 'Waikato',
    color: '#009E73',
    countsByYear: { 2013: 403641, 2018: 458202, 2023: 498771 },
  },
  {
    key: 'bay-of-plenty',
    name: 'Bay of Plenty',
    color: '#E69F00',
    countsByYear: { 2013: 267741, 2018: 308499, 2023: 334140 },
  },
  {
    key: 'gisborne',
    name: 'Gisborne',
    color: '#CC79A7',
    countsByYear: { 2013: 43653, 2018: 47517, 2023: 51135 },
  },
  {
    key: 'hawkes-bay',
    name: "Hawke's Bay",
    color: '#56B4E9',
    countsByYear: { 2013: 151179, 2018: 166368, 2023: 175074 },
  },
  {
    key: 'taranaki',
    name: 'Taranaki',
    color: '#661100',
    countsByYear: { 2013: 109608, 2018: 117561, 2023: 126015 },
  },
  {
    key: 'manawatu-whanganui',
    name: 'Manawatū-Whanganui',
    color: '#F0E442',
    countsByYear: { 2013: 222672, 2018: 238797, 2023: 251412 },
  },
  {
    key: 'wellington',
    name: 'Wellington',
    color: '#000000',
    countsByYear: { 2013: 471315, 2018: 506814, 2023: 520971 },
  },
  {
    key: 'tasman',
    name: 'Tasman',
    color: '#88CCEE',
    countsByYear: { 2013: 47157, 2018: 52389, 2023: 57807 },
  },
  {
    key: 'nelson',
    name: 'Nelson',
    color: '#117733',
    countsByYear: { 2013: 46437, 2018: 50880, 2023: 52584 },
  },
  {
    key: 'marlborough',
    name: 'Marlborough',
    color: '#DDCC77',
    countsByYear: { 2013: 43416, 2018: 47340, 2023: 49431 },
  },
  {
    key: 'west-coast',
    name: 'West Coast',
    color: '#AA4499',
    countsByYear: { 2013: 32148, 2018: 31575, 2023: 33390 },
  },
  {
    key: 'canterbury',
    name: 'Canterbury',
    color: '#999999',
    countsByYear: { 2013: 539433, 2018: 599694, 2023: 651027 },
  },
  {
    key: 'otago',
    name: 'Otago',
    color: '#8B7D6B',
    countsByYear: { 2013: 202470, 2018: 225186, 2023: 240900 },
  },
  {
    key: 'southland',
    name: 'Southland',
    color: '#661100',
    countsByYear: { 2013: 93342, 2018: 97467, 2023: 100143 },
  },
];

/** Published usually resident population total for regional council areas. */
export const REGION_POPULATION_TOTALS: Record<CensusPopulationYear, number> = {
  2013: 4241448,
  2018: 4699089,
  2023: 4993290,
};

/** Share of the census usually resident population, rounded to one decimal. */
export function regionSharePercent(region: RegionPopulation, year: CensusPopulationYear): number {
  return Math.round((region.countsByYear[year] / REGION_POPULATION_TOTALS[year]) * 1000) / 10;
}

/**
 * Cells for each region in a 100-cell waffle: one cell per 1 percent of the
 * census population, allocated by largest remainder so the grid always sums
 * to exactly 100 cells.
 *
 * @param year - the census year to draw
 * @returns the cell counts in the same order as REGION_POPULATIONS
 */
export function regionWaffleCells(year: CensusPopulationYear): number[] {
  const total = REGION_POPULATION_TOTALS[year];
  const exactShares = REGION_POPULATIONS.map((region) => (region.countsByYear[year] / total) * 100);
  const cells = exactShares.map(Math.floor);
  let remainder = 100 - cells.reduce((sum, cell) => sum + cell, 0);
  const byFraction = exactShares
    .map((share, index) => ({ index, fraction: share - Math.floor(share) }))
    .sort((a, b) => b.fraction - a.fraction);
  for (const candidate of byFraction) {
    if (remainder === 0) {
      break;
    }
    cells[candidate.index] = (cells[candidate.index] ?? 0) + 1;
    remainder = remainder - 1;
  }
  return cells;
}
