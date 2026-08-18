/**
 * Economically significant enterprises by industry (ANZSIC06 division), at
 * February 2020 and February 2025, from the Stats NZ releases "New Zealand
 * business demography statistics: At February 2020" (Table 1, published 29
 * October 2020) and "...At February 2025" (Table 1, published 30 October
 * 2025). The February 2025 counts are provisional and have noise added or
 * subtracted to protect individual businesses, so industry counts can
 * differ from the published total by a few enterprises.
 */

export interface EnterpriseIndustryRow {
  key: string;
  name: string;
  enterprises2020: number;
  enterprises2025: number;
}

export const ENTERPRISE_INDUSTRY_ROWS: EnterpriseIndustryRow[] = [
  {
    key: 'agriculture-forestry-fishing',
    name: 'Agriculture, forestry, and fishing',
    enterprises2020: 64125,
    enterprises2025: 61593,
  },
  { key: 'mining', name: 'Mining', enterprises2020: 687, enterprises2025: 714 },
  {
    key: 'manufacturing',
    name: 'Manufacturing',
    enterprises2020: 21429,
    enterprises2025: 22680,
  },
  {
    key: 'electricity-gas-water-waste',
    name: 'Electricity, gas, water, and waste services',
    enterprises2020: 1146,
    enterprises2025: 1290,
  },
  {
    key: 'construction',
    name: 'Construction',
    enterprises2020: 67239,
    enterprises2025: 81249,
  },
  {
    key: 'wholesale-trade',
    name: 'Wholesale trade',
    enterprises2020: 17004,
    enterprises2025: 16458,
  },
  { key: 'retail-trade', name: 'Retail trade', enterprises2020: 27627, enterprises2025: 29505 },
  {
    key: 'accommodation-food-services',
    name: 'Accommodation and food services',
    enterprises2020: 23319,
    enterprises2025: 26070,
  },
  {
    key: 'transport-postal-warehousing',
    name: 'Transport, postal, and warehousing',
    enterprises2020: 16290,
    enterprises2025: 17097,
  },
  {
    key: 'information-media-telecommunications',
    name: 'Information media and telecommunications',
    enterprises2020: 6594,
    enterprises2025: 7842,
  },
  {
    key: 'financial-insurance-services',
    name: 'Financial and insurance services',
    enterprises2020: 40491,
    enterprises2025: 50940,
  },
  {
    key: 'rental-hiring-real-estate',
    name: 'Rental, hiring, and real estate services',
    enterprises2020: 121506,
    enterprises2025: 129120,
  },
  {
    key: 'professional-scientific-technical',
    name: 'Professional, scientific, and technical services',
    enterprises2020: 64005,
    enterprises2025: 70938,
  },
  {
    key: 'administrative-support-services',
    name: 'Administrative and support services',
    enterprises2020: 19071,
    enterprises2025: 22266,
  },
  {
    key: 'public-administration-safety',
    name: 'Public administration and safety',
    enterprises2020: 1254,
    enterprises2025: 1464,
  },
  {
    key: 'education-training',
    name: 'Education and training',
    enterprises2020: 9279,
    enterprises2025: 10854,
  },
  {
    key: 'health-care-social-assistance',
    name: 'Health care and social assistance',
    enterprises2020: 21093,
    enterprises2025: 25752,
  },
  {
    key: 'arts-recreation-services',
    name: 'Arts and recreation services',
    enterprises2020: 10527,
    enterprises2025: 12237,
  },
  {
    key: 'other-services',
    name: 'Other services',
    enterprises2020: 24993,
    enterprises2025: 29268,
  },
];

/** Published total of economically significant enterprises for each year. */
export const ENTERPRISE_TOTALS: { year2020: number; year2025: number } = {
  year2020: 557685,
  year2025: 617334,
};

/** Change from February 2020 to February 2025, as a percentage. */
export function enterpriseChangePercent(row: EnterpriseIndustryRow): number {
  return (
    Math.round(((row.enterprises2025 - row.enterprises2020) / row.enterprises2020) * 1000) / 10
  );
}
