/**
 * New Zealand goods exports by destination country, in NZ$ millions, for the
 * years ended March 2015, 2020, and 2026. The 2015 and 2020 figures come
 * from the Stats NZ release "Goods and services trade by country: Year ended
 * March 2020" (map data table); the 2026 figures are aggregated from the
 * monthly series in the Stats NZ release "International trade: December 2025
 * quarter" (April 2025 to March 2026). The series is annual and updates each
 * quarter, so the latest endpoint will move as new releases land.
 */

export interface ExportDestinationRow {
  name: string;
  exports2015: number;
  exports2020: number;
  exports2026: number;
  rank2015: number;
  rank2020: number;
  rank2026: number;
}

export const EXPORT_DESTINATION_YEARS = [2015, 2020, 2026] as const;

const EXPORT_VALUES: Array<{
  name: string;
  exports2015: number;
  exports2020: number;
  exports2026: number;
}> = [
  { name: 'China', exports2015: 8581.1, exports2020: 16779.0, exports2026: 19747.5 },
  { name: 'Australia', exports2015: 8647.8, exports2020: 8694.2, exports2026: 10497.7 },
  { name: 'United States', exports2015: 5133.4, exports2020: 5858.6, exports2026: 9338.9 },
  { name: 'Japan', exports2015: 2955.1, exports2020: 3622.3, exports2026: 3989.5 },
  { name: 'South Korea', exports2015: 1732.8, exports2020: 1716.2, exports2026: 2712.0 },
  { name: 'United Kingdom', exports2015: 1525.0, exports2020: 1504.6, exports2026: 2197.5 },
  { name: 'Taiwan', exports2015: 1019.1, exports2020: 1232.6, exports2026: 1880.4 },
  { name: 'Singapore', exports2015: 1140.4, exports2020: 1209.5, exports2026: 1755.5 },
  { name: 'Netherlands', exports2015: 874.9, exports2020: 750.5, exports2026: 1702.9 },
  { name: 'Indonesia', exports2015: 878.5, exports2020: 1104.1, exports2026: 1689.1 },
];

function rankByYear(
  rows: Array<{ name: string; exports2015: number; exports2020: number; exports2026: number }>,
  year: 2015 | 2020 | 2026,
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => b[`exports${year}`] - a[`exports${year}`]);
  return new Map(sorted.map((row, index) => [row.name, index + 1]));
}

const ranks2015 = rankByYear(EXPORT_VALUES, 2015);
const ranks2020 = rankByYear(EXPORT_VALUES, 2020);
const ranks2026 = rankByYear(EXPORT_VALUES, 2026);

export const EXPORT_DESTINATION_ROWS: ExportDestinationRow[] = EXPORT_VALUES.map((row) => ({
  ...row,
  rank2015: ranks2015.get(row.name) ?? 0,
  rank2020: ranks2020.get(row.name) ?? 0,
  rank2026: ranks2026.get(row.name) ?? 0,
}));
