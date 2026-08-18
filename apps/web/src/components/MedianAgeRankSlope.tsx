'use client';

import { useMemo } from 'react';

import { MEDIAN_AGE_ROWS, MEDIAN_AGE_YEARS } from '@/lib/median-age-data';
import type { MedianAgeRow } from '@/lib/median-age-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

const HIGHLIGHT_REGIONS = ['West Coast', 'Auckland', 'Southland'];

function toSlopeRows(rows: MedianAgeRow[]): SlopeChartRow[] {
  return rows.map((row) => ({
    name: row.name,
    values: [row.medianAge2013, row.medianAge2018, row.medianAge2023],
  }));
}

function formatRegionSummary(row: SlopeChartRow, ranks: number[]): string {
  const firstRank = ranks[0] ?? 0;
  const lastRank = ranks[ranks.length - 1] ?? 0;
  const change = firstRank - lastRank;
  const direction = change === 0 ? 'held' : change < 0 ? 'fell' : 'climbed';
  const firstYear = MEDIAN_AGE_YEARS[0];
  const lastYear = MEDIAN_AGE_YEARS[MEDIAN_AGE_YEARS.length - 1];
  const movement =
    change === 0
      ? 'held rank'
      : `${direction} ${Math.abs(change)} place${Math.abs(change) === 1 ? '' : 's'}`;
  const firstValue = row.values[0] ?? 0;
  const lastValue = row.values[row.values.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (${firstYear}) to rank ${lastRank} (${lastYear}), ${movement}. Median age ${firstValue} to ${lastValue} years.`;
}

/**
 * Median age ranks by regional council across the 2013, 2018, and 2023
 * censuses, drawn as a slope chart. Toggle between the biggest rank movers
 * and the full field; hover a line to read its path. Source: Stats NZ 2023
 * Census population counts release (Table 7).
 */
export function MedianAgeRankSlope(): React.ReactElement {
  const slopeRows = useMemo(() => toSlopeRows(MEDIAN_AGE_ROWS), []);

  const tableColumns: ChartDataColumn<MedianAgeRow>[] = [
    { key: 'name', header: 'Region' },
    { key: 'medianAge2013', header: '2013 median age', format: (value) => `${value} years` },
    { key: 'medianAge2023', header: '2023 median age', format: (value) => `${value} years` },
    { key: 'rank2013', header: '2013 rank', format: (value) => `#${value}` },
    { key: 'rank2023', header: '2023 rank', format: (value) => `#${value}` },
  ];

  return (
    <div>
      <SlopeChart
        rows={slopeRows}
        timePoints={MEDIAN_AGE_YEARS.map(String)}
        highlightNames={HIGHLIGHT_REGIONS}
        moverThreshold={1}
        chartLabel="Regional council median age ranks across the 2013, 2018, and 2023 censuses"
        moverSummary={(moverCount) => `${moverCount} regions moved median age rank between 2013 and 2023.`}
        rowSummary={formatRegionSummary}
      />
      <ChartDataTable
        summary="View the median age rank changes as a table"
        columns={tableColumns}
        rows={MEDIAN_AGE_ROWS}
      />
    </div>
  );
}
