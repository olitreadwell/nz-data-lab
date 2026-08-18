/**
 * Regional unemployment rates from the Stats NZ Household Labour Force
 * Survey (HLFS), December 2025 quarter release (Table 6, People employed,
 * unemployed, and not in the labour force, by regional council area,
 * published 4 February 2026). Rates are unadjusted quarterly percentages
 * for the nine quarters from December 2023 to December 2025, verified
 * against the release workbook. Rank 1 is the highest unemployment rate in
 * that quarter; ties keep the order they appear in the workbook.
 */

export interface UnemploymentRegionRow {
  key: string;
  name: string;
  rates: number[];
}

export interface UnemploymentRankRow extends UnemploymentRegionRow {
  ranks: number[];
}

export const UNEMPLOYMENT_QUARTERS = [
  'Dec 2023',
  'Mar 2024',
  'Jun 2024',
  'Sep 2024',
  'Dec 2024',
  'Mar 2025',
  'Jun 2025',
  'Sep 2025',
  'Dec 2025',
] as const;

/** National unemployment rate for the December 2025 quarter (HLFS Table 1). */
export const NATIONAL_UNEMPLOYMENT_RATE = 5.3;

export const UNEMPLOYMENT_REGION_ROWS: UnemploymentRegionRow[] = [
  { key: 'northland', name: 'Northland', rates: [4.8, 4.9, 5.1, 6.7, 6.7, 5.8, 5.4, 6.3, 5.2] },
  { key: 'auckland', name: 'Auckland', rates: [4.2, 4.8, 4.6, 5.2, 5.4, 6.5, 6.1, 6.1, 6.4] },
  { key: 'waikato', name: 'Waikato', rates: [4.7, 5.7, 5.5, 5.0, 6.6, 5.6, 5.4, 6.2, 5.9] },
  {
    key: 'bay-of-plenty',
    name: 'Bay of Plenty',
    rates: [4.6, 5.2, 5.7, 5.2, 4.8, 6.0, 4.9, 5.0, 5.7],
  },
  {
    key: 'gisborne-hawkes-bay',
    name: "Gisborne / Hawke's Bay",
    rates: [3.8, 4.6, 4.1, 3.4, 3.4, 5.7, 3.5, 5.9, 4.8],
  },
  { key: 'taranaki', name: 'Taranaki', rates: [3.7, 3.4, 5.0, 4.0, 3.8, 5.1, 4.2, 4.3, 4.3] },
  {
    key: 'manawatu-whanganui',
    name: 'Manawatū-Whanganui',
    rates: [4.7, 4.4, 4.5, 4.0, 4.9, 4.8, 5.0, 3.9, 5.1],
  },
  { key: 'wellington', name: 'Wellington', rates: [3.3, 4.7, 4.3, 4.2, 4.9, 5.2, 4.2, 4.3, 5.8] },
  {
    key: 'tasman-nelson-marlborough-west-coast',
    name: 'Tasman / Nelson / Marlborough / West Coast',
    rates: [3.2, 3.1, 3.8, 4.4, 3.0, 3.8, 3.9, 3.2, 4.5],
  },
  { key: 'canterbury', name: 'Canterbury', rates: [3.6, 4.6, 4.2, 4.8, 4.7, 4.9, 5.0, 4.7, 3.7] },
  { key: 'otago', name: 'Otago', rates: [2.5, 4.6, 3.0, 3.1, 3.1, 2.7, 3.0, 2.5, 2.3] },
  { key: 'southland', name: 'Southland', rates: [3.3, 3.3, 3.7, 5.4, 6.0, 4.5, 4.1, 3.7, 4.4] },
];

/**
 * Ranks every region for every quarter. Rank 1 is the highest unemployment
 * rate; ties keep the order the regions appear in the source workbook.
 *
 * @param rows - the region rows with rates
 * @returns the same rows with a parallel ranks array
 */
export function rankUnemploymentRegions(rows: UnemploymentRegionRow[]): UnemploymentRankRow[] {
  return rows.map((row, rowIndex) => {
    const ranks = UNEMPLOYMENT_QUARTERS.map((_, quarterIndex) => {
      let rank = 1;
      for (let otherIndex = 0; otherIndex < rows.length; otherIndex += 1) {
        if (otherIndex === rowIndex) {
          continue;
        }
        const otherRate = rows[otherIndex]?.rates[quarterIndex] ?? 0;
        const ownRate = row.rates[quarterIndex] ?? 0;
        if (otherRate > ownRate || (otherRate === ownRate && otherIndex < rowIndex)) {
          rank += 1;
        }
      }
      return rank;
    });
    return { ...row, ranks };
  });
}

export const UNEMPLOYMENT_RANK_ROWS: UnemploymentRankRow[] =
  rankUnemploymentRegions(UNEMPLOYMENT_REGION_ROWS);

/**
 * Rank movement across the whole window.
 *
 * @param row - the ranked region row
 * @returns last rank minus first rank; negative means the region climbed the ranking
 */
export function unemploymentRankChange(row: UnemploymentRankRow): number {
  const first = row.ranks[0] ?? 0;
  const last = row.ranks[row.ranks.length - 1] ?? 0;
  return last - first;
}

/**
 * Whether a region moved three or more rank places across the window.
 *
 * @param row - the ranked region row
 * @returns true when the absolute rank change is three or more
 */
export function isUnemploymentMover(row: UnemploymentRankRow): boolean {
  return Math.abs(unemploymentRankChange(row)) >= 3;
}
