/**
 * Enterprises and employee count by employment size group, from the Stats NZ
 * release "New Zealand business demography statistics: At February 2025" (Table 1,
 * published 30 October 2025). Counts are provisional and have noise added or
 * subtracted to protect individual businesses, so bands may not sum to the
 * stated totals.
 */

export const COMPANY_SIZE_BANDS = ['0', '1-5', '6-9', '10-19', '20-49', '50-99', '100+'] as const;

export interface CompanySizeIndustryRow {
  name: string;
  enterprises: number[];
  employeeCount: number[];
  totalEnterprises: number;
  totalEmployees: number;
}

export const COMPANY_SIZE_INDUSTRY_ROWS: CompanySizeIndustryRow[] = [
  {
    name: 'Agriculture, forestry, & fishing',
    enterprises: [44157, 13017, 2229, 1302, 636, 168, 90],
    employeeCount: [0, 30600, 15800, 17200, 18800, 11400, 23400],
    totalEnterprises: 61593,
    totalEmployees: 117200,
  },
  {
    name: 'Mining',
    enterprises: [465, 117, 42, 39, 27, 12, 9],
    employeeCount: [0, 260, 310, 530, 880, 810, 3650],
    totalEnterprises: 714,
    totalEmployees: 6400,
  },
  {
    name: 'Manufacturing',
    enterprises: [11706, 5454, 1806, 1731, 1215, 426, 339],
    employeeCount: [0, 14000, 13100, 23400, 36800, 28600, 128100],
    totalEnterprises: 22680,
    totalEmployees: 244100,
  },
  {
    name: 'Electricity, gas, water, & waste services',
    enterprises: [732, 312, 66, 78, 45, 21, 39],
    employeeCount: [0, 690, 500, 1050, 1300, 1300, 18600],
    totalEnterprises: 1290,
    totalEmployees: 23500,
  },
  {
    name: 'Construction',
    enterprises: [54774, 18861, 3549, 2553, 1131, 249, 135],
    employeeCount: [0, 43400, 25600, 33800, 33600, 16600, 45400],
    totalEnterprises: 81249,
    totalEmployees: 198400,
  },
  {
    name: 'Wholesale trade',
    enterprises: [9105, 4020, 1158, 1056, 711, 246, 162],
    employeeCount: [0, 10000, 8400, 14300, 21700, 16700, 50600],
    totalEnterprises: 16458,
    totalEmployees: 121700,
  },
  {
    name: 'Retail trade',
    enterprises: [15696, 8451, 2253, 1674, 831, 249, 354],
    employeeCount: [0, 21800, 16400, 22500, 24400, 17700, 119600],
    totalEnterprises: 29505,
    totalEmployees: 222400,
  },
  {
    name: 'Accommodation & food services',
    enterprises: [11370, 6894, 3156, 3018, 1257, 234, 144],
    employeeCount: [0, 19500, 23100, 40600, 35300, 15500, 40800],
    totalEnterprises: 26070,
    totalEmployees: 174700,
  },
  {
    name: 'Transport, postal, & warehousing',
    enterprises: [11700, 3552, 654, 573, 351, 120, 147],
    employeeCount: [0, 7900, 4750, 7800, 10700, 8100, 63900],
    totalEnterprises: 17097,
    totalEmployees: 103100,
  },
  {
    name: 'Information media & telecommunications',
    enterprises: [6507, 852, 162, 162, 96, 27, 36],
    employeeCount: [0, 1900, 1200, 2150, 2800, 1950, 18100],
    totalEnterprises: 7842,
    totalEmployees: 28100,
  },
  {
    name: 'Financial & insurance services',
    enterprises: [48291, 1863, 324, 207, 132, 42, 81],
    employeeCount: [0, 4050, 2350, 2750, 3900, 3000, 54000],
    totalEnterprises: 50940,
    totalEmployees: 70100,
  },
  {
    name: 'Rental, hiring, & real estate',
    enterprises: [123276, 4665, 570, 345, 192, 42, 36],
    employeeCount: [0, 9400, 4100, 4550, 5500, 2800, 12000],
    totalEnterprises: 129120,
    totalEmployees: 38400,
  },
  {
    name: 'Professional, scientific, & technical',
    enterprises: [53673, 11784, 1998, 1896, 1059, 306, 225],
    employeeCount: [0, 25200, 14400, 25300, 31700, 20700, 67100],
    totalEnterprises: 70938,
    totalEmployees: 184300,
  },
  {
    name: 'Administrative & support services',
    enterprises: [15468, 4605, 780, 633, 444, 153, 177],
    employeeCount: [0, 10200, 5700, 8500, 13600, 10900, 59900],
    totalEnterprises: 22266,
    totalEmployees: 108900,
  },
  {
    name: 'Public administration & safety',
    enterprises: [738, 288, 90, 69, 78, 54, 141],
    employeeCount: [0, 730, 650, 940, 2500, 3900, 161000],
    totalEnterprises: 1464,
    totalEmployees: 169700,
  },
  {
    name: 'Education & training',
    enterprises: [5049, 1479, 900, 1245, 1350, 525, 300],
    employeeCount: [0, 3950, 6700, 17300, 43300, 35500, 100400],
    totalEnterprises: 10854,
    totalEmployees: 207200,
  },
  {
    name: 'Health care & social assistance',
    enterprises: [17658, 3999, 1275, 1320, 855, 321, 327],
    employeeCount: [0, 9600, 9300, 17800, 25800, 22100, 208900],
    totalEnterprises: 25752,
    totalEmployees: 293600,
  },
  {
    name: 'Arts & recreation services',
    enterprises: [8949, 2010, 459, 432, 258, 78, 48],
    employeeCount: [0, 4750, 3350, 5900, 7700, 5100, 18400],
    totalEnterprises: 12237,
    totalEmployees: 45200,
  },
  {
    name: 'Other services',
    enterprises: [16419, 9027, 2040, 1224, 432, 75, 54],
    employeeCount: [0, 22600, 14600, 15800, 12300, 5200, 15700],
    totalEnterprises: 29268,
    totalEmployees: 86300,
  },
];

export const NATIONAL_ENTERPRISES = [455730, 101253, 23511, 19557, 11100, 3342, 2838];
export const NATIONAL_ENTERPRISE_TOTAL = 617334;
export const NATIONAL_EMPLOYEE_COUNT = [0, 240700, 170400, 262400, 332600, 227700, 1209700];
export const NATIONAL_EMPLOYEE_TOTAL = 2443400;
