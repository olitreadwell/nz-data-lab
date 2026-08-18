/**
 * New Zealand exports of goods and services by destination country, in NZ$
 * millions, for the years ended March 2015 to 2020, from the Stats NZ
 * release "Goods and services trade by country: Year ended March 2020"
 * (map data table). The rank for each year is computed from the full
 * country list in that table, so a country outside this set can sit between
 * these eight. The release has since been superseded, but the numbers are
 * final for the years they cover.
 */

export const EXPORT_RANK_YEARS = [2015, 2016, 2017, 2018, 2019, 2020] as const;

export type ExportRankYear = (typeof EXPORT_RANK_YEARS)[number];

export interface ExportRankCountry {
  key: string;
  label: string;
  color: string;
  exportsByYear: Record<ExportRankYear, number>;
  ranksByYear: Record<ExportRankYear, number>;
}

export const EXPORT_RANK_COUNTRIES: ExportRankCountry[] = [
  {
    key: 'china',
    label: 'China',
    color: '#e11d48',
    exportsByYear: {
      2015: 10762.0,
      2016: 11730.5,
      2017: 12762.8,
      2018: 15595.7,
      2019: 18025.7,
      2020: 19888.1,
    },
    ranksByYear: { 2015: 2, 2016: 2, 2017: 2, 2018: 1, 2019: 1, 2020: 1 },
  },
  {
    key: 'australia',
    label: 'Australia',
    color: '#2563eb',
    exportsByYear: {
      2015: 12888.6,
      2016: 13074.7,
      2017: 13037.1,
      2018: 13971.2,
      2019: 14216.6,
      2020: 14166.6,
    },
    ranksByYear: { 2015: 1, 2016: 1, 2017: 1, 2018: 2, 2019: 2, 2020: 2 },
  },
  {
    key: 'united-states',
    label: 'United States',
    color: '#059669',
    exportsByYear: {
      2015: 7522.3,
      2016: 8584.7,
      2017: 8371.1,
      2018: 8835.6,
      2019: 9055.0,
      2020: 9873.3,
    },
    ranksByYear: { 2015: 3, 2016: 3, 2017: 3, 2018: 3, 2019: 3, 2020: 3 },
  },
  {
    key: 'japan',
    label: 'Japan',
    color: '#d97706',
    exportsByYear: {
      2015: 3676.6,
      2016: 3768.2,
      2017: 3865.2,
      2018: 4232.9,
      2019: 4498.4,
      2020: 4564.2,
    },
    ranksByYear: { 2015: 4, 2016: 4, 2017: 4, 2018: 4, 2019: 4, 2020: 4 },
  },
  {
    key: 'united-kingdom',
    label: 'United Kingdom',
    color: '#7c3aed',
    exportsByYear: {
      2015: 2875.3,
      2016: 3183.4,
      2017: 2779.8,
      2018: 3030.0,
      2019: 3065.9,
      2020: 3183.5,
    },
    ranksByYear: { 2015: 5, 2016: 5, 2017: 5, 2018: 5, 2019: 5, 2020: 5 },
  },
  {
    key: 'south-korea',
    label: 'South Korea',
    color: '#0d9488',
    exportsByYear: {
      2015: 2176.8,
      2016: 2145.9,
      2017: 1940.2,
      2018: 2159.4,
      2019: 2311.6,
      2020: 2289.0,
    },
    ranksByYear: { 2015: 6, 2016: 6, 2017: 6, 2018: 6, 2019: 6, 2020: 6 },
  },
  {
    key: 'singapore',
    label: 'Singapore',
    color: '#0891b2',
    exportsByYear: {
      2015: 1510.3,
      2016: 1573.5,
      2017: 1275.5,
      2018: 1658.2,
      2019: 1635.1,
      2020: 1759.4,
    },
    ranksByYear: { 2015: 7, 2016: 8, 2017: 10, 2018: 8, 2019: 10, 2020: 7 },
  },
  {
    key: 'germany',
    label: 'Germany',
    color: '#be185d',
    exportsByYear: {
      2015: 1298.8,
      2016: 1506.7,
      2017: 1441.7,
      2018: 1572.4,
      2019: 1729.5,
      2020: 1706.8,
    },
    ranksByYear: { 2015: 9, 2016: 9, 2017: 8, 2018: 10, 2019: 7, 2020: 8 },
  },
];

/** Formats an export value in NZ$ millions as billions, e.g. 19888.1 -> "$19.9b". */
export function formatExportBillions(valueInMillions: number): string {
  return `$${(valueInMillions / 1000).toFixed(1)}b`;
}
