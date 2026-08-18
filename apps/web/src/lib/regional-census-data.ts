/**
 * Census usually resident population counts by regional council, from the
 * Stats NZ 2023 Census release "2023 Census population counts (by ethnic
 * group, age, and Maori descent) and dwelling counts" (Table 1, published 29
 * May 2024). Counts have fixed random rounding to base 3 applied, so they
 * may not sum to the stated totals. The series is final: censuses run every
 * five years, so this snapshot does not go stale.
 */

export interface RegionalCensusRow {
  name: string;
  population2013: number;
  population2018: number;
  population2023: number;
  rank2013: number;
  rank2018: number;
  rank2023: number;
}

export const REGIONAL_CENSUS_YEARS = [2013, 2018, 2023] as const;

const REGIONAL_POPULATIONS: Array<{
  name: string;
  population2013: number;
  population2018: number;
  population2023: number;
}> = [
  { name: 'Northland', population2013: 151689, population2018: 179076, population2023: 194007 },
  { name: 'Auckland', population2013: 1415550, population2018: 1571718, population2023: 1656486 },
  { name: 'Waikato', population2013: 403641, population2018: 458202, population2023: 498771 },
  { name: 'Bay of Plenty', population2013: 267741, population2018: 308499, population2023: 334140 },
  { name: 'Gisborne', population2013: 43653, population2018: 47517, population2023: 51135 },
  { name: "Hawke's Bay", population2013: 151179, population2018: 166368, population2023: 175074 },
  { name: 'Taranaki', population2013: 109608, population2018: 117561, population2023: 126015 },
  {
    name: 'Manawatu-Whanganui',
    population2013: 222672,
    population2018: 238797,
    population2023: 251412,
  },
  { name: 'Wellington', population2013: 471315, population2018: 506814, population2023: 520971 },
  { name: 'Tasman', population2013: 47157, population2018: 52389, population2023: 57807 },
  { name: 'Nelson', population2013: 46437, population2018: 50880, population2023: 52584 },
  { name: 'Marlborough', population2013: 43416, population2018: 47340, population2023: 49431 },
  { name: 'West Coast', population2013: 32148, population2018: 31575, population2023: 33390 },
  { name: 'Canterbury', population2013: 539433, population2018: 599694, population2023: 651027 },
  { name: 'Otago', population2013: 202470, population2018: 225186, population2023: 240900 },
  { name: 'Southland', population2013: 93342, population2018: 97467, population2023: 100143 },
];

function rankByYear(
  rows: Array<{
    name: string;
    population2013: number;
    population2018: number;
    population2023: number;
  }>,
  year: 2013 | 2018 | 2023,
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b[`population${year}`] - a[`population${year}`]);
  return new Map(sorted.map((row, index) => [row.name, index + 1]));
}

const ranks2013 = rankByYear(REGIONAL_POPULATIONS, 2013);
const ranks2018 = rankByYear(REGIONAL_POPULATIONS, 2018);
const ranks2023 = rankByYear(REGIONAL_POPULATIONS, 2023);

export const REGIONAL_CENSUS_ROWS: RegionalCensusRow[] = REGIONAL_POPULATIONS.map((row) => ({
  ...row,
  rank2013: ranks2013.get(row.name) ?? 0,
  rank2018: ranks2018.get(row.name) ?? 0,
  rank2023: ranks2023.get(row.name) ?? 0,
}));
