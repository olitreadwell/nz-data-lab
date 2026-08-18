/**
 * Population estimates by sex and 5-year age group for New Zealand on 1 July
 * 2021, from the UN Statistics Division Demographic and Social Statistics
 * (as tabulated in the Wikipedia "Demographics of New Zealand" article).
 * Estimates are provisional and rounded, so the bands may not sum to the
 * stated total of 5,122,600.
 */

export interface AgeBandPopulation {
  label: string;
  male: number;
  female: number;
  total: number;
}

export const AGE_PYRAMID_POPULATION: AgeBandPopulation[] = [
  { label: '0-4', male: 156710, female: 148800, total: 305510 },
  { label: '5-9', male: 167260, female: 158310, total: 325570 },
  { label: '10-14', male: 173620, female: 163920, total: 337540 },
  { label: '15-19', male: 161330, female: 153550, total: 314880 },
  { label: '20-24', male: 172020, female: 161240, total: 333260 },
  { label: '25-29', male: 190640, female: 181390, total: 372030 },
  { label: '30-34', male: 191640, female: 192470, total: 384110 },
  { label: '35-39', male: 168840, female: 172260, total: 341110 },
  { label: '40-44', male: 154820, female: 157780, total: 312600 },
  { label: '45-49', male: 158830, female: 164650, total: 323490 },
  { label: '50-54', male: 161590, female: 169610, total: 331200 },
  { label: '55-59', male: 157610, female: 166540, total: 324150 },
  { label: '60-64', male: 144220, female: 153870, total: 298090 },
  { label: '65-69', male: 122810, female: 130780, total: 253590 },
  { label: '70-74', male: 106650, female: 112880, total: 219540 },
  { label: '75-79', male: 71690, female: 79510, total: 151200 },
  { label: '80-84', male: 46770, female: 56990, total: 103760 },
  { label: '85-89', male: 23540, female: 32880, total: 56420 },
  { label: '90+', male: 12010, female: 22570, total: 34580 },
];
