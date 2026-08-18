'use client';

import { useMemo } from 'react';

import { REGIONAL_CENSUS_ROWS, REGIONAL_CENSUS_YEARS } from '@/lib/regional-census-data';
import type { RegionalCensusRow } from '@/lib/regional-census-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

const HIGHLIGHT_REGIONS = ['Auckland', 'West Coast'];

function toSlopeRows(rows: RegionalCensusRow[]): SlopeChartRow[] {
  return rows.map((row) => ({
    name: row.name,
    values: [row.population2013, row.population2018, row.population2023],
  }));
}

function formatRegionSummary(row: SlopeChartRow, ranks: number[]): string {
  const firstRank = ranks[0] ?? 0;
  const lastRank = ranks[ranks.length - 1] ?? 0;
  const change = firstRank - lastRank;
  const direction = change === 0 ? 'held' : change < 0 ? 'fell' : 'climbed';
  const firstYear = REGIONAL_CENSUS_YEARS[0];
  const lastYear = REGIONAL_CENSUS_YEARS[REGIONAL_CENSUS_YEARS.length - 1];
  const movement =
    change === 0
      ? 'held rank'
      : `${direction} ${Math.abs(change)} place${Math.abs(change) === 1 ? '' : 's'}`;
  const firstValue = row.values[0] ?? 0;
  const lastValue = row.values[row.values.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (${firstYear}) to rank ${lastRank} (${lastYear}), ${movement}. Population ${firstValue.toLocaleString('en-NZ')} to ${lastValue.toLocaleString('en-NZ')}.`;
}

/**
 * Census usually resident population ranks by regional council across the
 * 2013, 2018, and 2023 censuses, drawn as a slope chart. Toggle between the
 * biggest rank movers and the full field; hover a line to read its path.
 * Source: Stats NZ 2023 Census population counts release (Table 1).
 */
export function RegionalRankSlope(): React.ReactElement {
  const slopeRows = useMemo(() => toSlopeRows(REGIONAL_CENSUS_ROWS), []);

  const tableColumns: ChartDataColumn<RegionalCensusRow>[] = [
    { key: 'name', header: 'Region' },
    {
      key: 'population2013',
      header: '2013 census',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    {
      key: 'population2023',
      header: '2023 census',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    { key: 'rank2013', header: '2013 rank', format: (value) => `#${value}` },
    { key: 'rank2023', header: '2023 rank', format: (value) => `#${value}` },
  ];

  return (
    <div>
      <SlopeChart
        rows={slopeRows}
        timePoints={REGIONAL_CENSUS_YEARS.map(String)}
        highlightNames={HIGHLIGHT_REGIONS}
        moverThreshold={1}
        chartLabel="Regional council population ranks across the 2013, 2018, and 2023 censuses"
        moverSummary={(moverCount) => `${moverCount} regions moved rank between 2013 and 2023.`}
        rowSummary={formatRegionSummary}
      />
      <ChartDataTable
        summary="View the regional rank changes as a table"
        columns={tableColumns}
        rows={REGIONAL_CENSUS_ROWS}
      />
    </div>
  );
}
