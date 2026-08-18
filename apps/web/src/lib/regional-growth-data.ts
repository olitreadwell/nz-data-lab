/**
 * Census usually resident population by regional council area for the 2013
 * and 2023 censuses, from Stats NZ "2023 Census population counts (by
 * ethnic group, age, and Maori descent) and dwelling counts" (Table 1,
 * published 29 May 2024). The values are final census counts, so this
 * snapshot does not go stale. Growth percent is the 2013 to 2023 change.
 */

export interface RegionalPopulationRow {
  name: string;
  population2013: number;
  population2023: number;
  growthPercent: number;
}

const REGIONAL_POPULATIONS: Array<{
  name: string;
  population2013: number;
  population2023: number;
  growthPercent: number;
}> = [
  { name: 'Northland', population2013: 151689, population2023: 194007, growthPercent: 27.9 },
  { name: 'Auckland', population2013: 1415550, population2023: 1656486, growthPercent: 17 },
  { name: 'Waikato', population2013: 403641, population2023: 498771, growthPercent: 23.6 },
  { name: 'Bay of Plenty', population2013: 267741, population2023: 334140, growthPercent: 24.8 },
  { name: 'Gisborne', population2013: 43653, population2023: 51135, growthPercent: 17.1 },
  { name: "Hawke's Bay", population2013: 151179, population2023: 175074, growthPercent: 15.8 },
  { name: 'Taranaki', population2013: 109608, population2023: 126015, growthPercent: 15 },
  {
    name: 'Manawatū-Whanganui',
    population2013: 222672,
    population2023: 251412,
    growthPercent: 12.9,
  },
  { name: 'Wellington', population2013: 471315, population2023: 520971, growthPercent: 10.5 },
  { name: 'Tasman', population2013: 47157, population2023: 57807, growthPercent: 22.6 },
  { name: 'Nelson', population2013: 46437, population2023: 52584, growthPercent: 13.2 },
  { name: 'Marlborough', population2013: 43416, population2023: 49431, growthPercent: 13.9 },
  { name: 'West Coast', population2013: 32148, population2023: 33390, growthPercent: 3.9 },
  { name: 'Canterbury', population2013: 539433, population2023: 651027, growthPercent: 20.7 },
  { name: 'Otago', population2013: 202470, population2023: 240900, growthPercent: 19 },
  { name: 'Southland', population2013: 93342, population2023: 100143, growthPercent: 7.3 },
];

function toRegionalPopulationRow(row: {
  name: string;
  population2013: number;
  population2023: number;
  growthPercent: number;
}): RegionalPopulationRow {
  return {
    name: row.name,
    population2013: row.population2013,
    population2023: row.population2023,
    growthPercent: row.growthPercent,
  };
}

export const REGIONAL_POPULATION_ROWS: RegionalPopulationRow[] =
  REGIONAL_POPULATIONS.map(toRegionalPopulationRow);

/**
 * The population gain between the two censuses, in people.
 *
 * @param row - one regional council row
 * @returns the 2013 to 2023 population gain
 */
export function regionalGain(row: RegionalPopulationRow): number {
  return row.population2023 - row.population2013;
}
