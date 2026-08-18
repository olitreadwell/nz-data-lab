/**
 * Census usually resident population by five-year age group for the 2013,
 * 2018, and 2023 censuses, from Stats NZ "2023 Census population counts (by
 * ethnic group, age, and Maori descent) and dwelling counts" (Table 6,
 * published 29 May 2024). The values are final census counts, so this
 * snapshot does not go stale.
 */

export const AGE_BULGE_BANDS = [
  '0-4',
  '5-9',
  '10-14',
  '15-19',
  '20-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50-54',
  '55-59',
  '60-64',
  '65-69',
  '70-74',
  '75-79',
  '80-84',
  '85-89',
  '90+',
] as const;

export interface AgeBulgeYear {
  year: 2013 | 2018 | 2023;
  counts: number[];
}

export const AGE_BULGE_YEARS: AgeBulgeYear[] = [
  {
    year: 2013,
    counts: [
      292044, 286758, 286830, 295755, 290691, 258135, 256554, 267516, 305754, 301638, 299994,
      260184, 233163, 196020, 150114, 106557, 81027, 49026, 24291,
    ],
  },
  {
    year: 2018,
    counts: [
      294921, 322635, 305847, 301824, 317403, 344463, 317037, 295395, 291348, 321483, 308592,
      302745, 260901, 229032, 183633, 132792, 85362, 53979, 30372,
    ],
  },
  {
    year: 2023,
    counts: [
      288387, 311736, 336174, 320637, 311952, 335715, 374079, 345537, 315765, 302220, 322635,
      304074, 296418, 252492, 213438, 163632, 107991, 57939, 33093,
    ],
  },
];

export const AGE_BULGE_MEDIAN_AGE: Record<2013 | 2018 | 2023, number> = {
  2013: 38,
  2018: 37.4,
  2023: 38.1,
};

/** The widest count across all years and bands, for the chart scale. */
export const AGE_BULGE_MAX_COUNT = Math.max(
  ...AGE_BULGE_YEARS.map((year) => Math.max(...year.counts)),
);

/** Counts of people aged 65 and over, by census year. */
export function ageBulgeSixtyFivePlus(year: 2013 | 2018 | 2023): number {
  const row = AGE_BULGE_YEARS.find((candidate) => candidate.year === year);
  if (row === undefined) {
    return 0;
  }
  const startIndex = AGE_BULGE_BANDS.indexOf('65-69');
  return row.counts.slice(startIndex).reduce((total, count) => total + count, 0);
}
