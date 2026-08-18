/**
 * Employees by industry (ANZSIC06 division) at February 2020 and February
 * 2025, from the Stats NZ releases "New Zealand business demography
 * statistics: At February 2020" and "...At February 2025" (Table 1,
 * enterprises, geographic units, and employee count by industry). The
 * February 2025 counts are provisional and have noise added or subtracted
 * to protect individual businesses.
 */
export interface EmploymentIndustryRow {
  key: string;
  name: string;
  employees2020: number;
  employees2025: number;
}

export const EMPLOYMENT_INDUSTRY_ROWS: EmploymentIndustryRow[] = [
  {
    key: 'agriculture-forestry-fishing',
    name: 'Agriculture, forestry, and fishing',
    employees2020: 120800,
    employees2025: 118000,
  },
  { key: 'mining', name: 'Mining', employees2020: 5700, employees2025: 6500 },
  { key: 'manufacturing', name: 'Manufacturing', employees2020: 235200, employees2025: 231100 },
  {
    key: 'electricity-gas-water-waste',
    name: 'Electricity, gas, water, and waste services',
    employees2020: 18900,
    employees2025: 22500,
  },
  { key: 'construction', name: 'Construction', employees2020: 183300, employees2025: 199700 },
  { key: 'wholesale-trade', name: 'Wholesale trade', employees2020: 116700, employees2025: 122700 },
  { key: 'retail-trade', name: 'Retail trade', employees2020: 221500, employees2025: 227900 },
  {
    key: 'accommodation-food-services',
    name: 'Accommodation and food services',
    employees2020: 174300,
    employees2025: 177300,
  },
  {
    key: 'transport-postal-warehousing',
    name: 'Transport, postal, and warehousing',
    employees2020: 98500,
    employees2025: 101700,
  },
  {
    key: 'information-media-telecommunications',
    name: 'Information media and telecommunications',
    employees2020: 32200,
    employees2025: 31400,
  },
  {
    key: 'financial-insurance-services',
    name: 'Financial and insurance services',
    employees2020: 58100,
    employees2025: 68200,
  },
  {
    key: 'rental-hiring-real-estate',
    name: 'Rental, hiring, and real estate services',
    employees2020: 34900,
    employees2025: 37400,
  },
  {
    key: 'professional-scientific-technical',
    name: 'Professional, scientific, and technical services',
    employees2020: 189000,
    employees2025: 202200,
  },
  {
    key: 'administrative-support-services',
    name: 'Administrative and support services',
    employees2020: 123500,
    employees2025: 112300,
  },
  {
    key: 'public-administration-safety',
    name: 'Public administration and safety',
    employees2020: 137300,
    employees2025: 157100,
  },
  {
    key: 'education-training',
    name: 'Education and training',
    employees2020: 195600,
    employees2025: 207700,
  },
  {
    key: 'health-care-social-assistance',
    name: 'Health care and social assistance',
    employees2020: 250100,
    employees2025: 293600,
  },
  {
    key: 'arts-recreation-services',
    name: 'Arts and recreation services',
    employees2020: 44600,
    employees2025: 48500,
  },
  { key: 'other-services', name: 'Other services', employees2020: 76600, employees2025: 84800 },
];

/** Employees across all industries, from the Table 1 total rows. */
export const EMPLOYMENT_TOTAL_2020 = 2317000;
export const EMPLOYMENT_TOTAL_2025 = 2450600;

/** An industry's share of all employees as a percentage. */
export function employmentShare2025(row: EmploymentIndustryRow): number {
  return (row.employees2025 / EMPLOYMENT_TOTAL_2025) * 100;
}

/** Employee count change between February 2020 and February 2025. */
export function employmentChange(row: EmploymentIndustryRow): number {
  return row.employees2025 - row.employees2020;
}
