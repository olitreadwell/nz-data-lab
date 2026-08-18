/**
 * National age distribution in five-year bands, from the Stats NZ 2023
 * Census release "2023 Census population counts (by ethnic group, age, and
 * Maori descent) and dwelling counts" (Table 6, published 29 May 2024).
 * Counts have fixed random rounding to base 3 applied, so the bands may not
 * sum to the stated total. The series is final: censuses run every five
 * years, so this snapshot does not go stale.
 */

export interface AgeBandRow {
  band: string;
  population2013: number;
  population2018: number;
  population2023: number;
}

export const AGE_DISTRIBUTION_YEARS = [2013, 2018, 2023] as const;

export const AGE_BAND_ROWS: AgeBandRow[] = [
  { band: '0-4', population2013: 292044, population2018: 294921, population2023: 288387 },
  { band: '5-9', population2013: 286758, population2018: 322635, population2023: 311736 },
  { band: '10-14', population2013: 286830, population2018: 305847, population2023: 336174 },
  { band: '15-19', population2013: 295755, population2018: 301824, population2023: 320637 },
  { band: '20-24', population2013: 290691, population2018: 317403, population2023: 311952 },
  { band: '25-29', population2013: 258135, population2018: 344463, population2023: 335715 },
  { band: '30-34', population2013: 256554, population2018: 317037, population2023: 374079 },
  { band: '35-39', population2013: 267516, population2018: 295395, population2023: 345537 },
  { band: '40-44', population2013: 305754, population2018: 291348, population2023: 315765 },
  { band: '45-49', population2013: 301638, population2018: 321483, population2023: 302220 },
  { band: '50-54', population2013: 299994, population2018: 308592, population2023: 322635 },
  { band: '55-59', population2013: 260184, population2018: 302745, population2023: 304074 },
  { band: '60-64', population2013: 233163, population2018: 260901, population2023: 296418 },
  { band: '65-69', population2013: 196020, population2018: 229032, population2023: 252492 },
  { band: '70-74', population2013: 150114, population2018: 183633, population2023: 213438 },
  { band: '75-79', population2013: 106557, population2018: 132792, population2023: 163632 },
  { band: '80-84', population2013: 81027, population2018: 85362, population2023: 107991 },
  { band: '85-89', population2013: 49026, population2018: 53979, population2023: 57939 },
  { band: '90+', population2013: 24291, population2018: 30372, population2023: 33093 },
];

export const AGE_DISTRIBUTION_TOTALS: Record<(typeof AGE_DISTRIBUTION_YEARS)[number], number> = {
  2013: 4242048,
  2018: 4699755,
  2023: 4993923,
};
