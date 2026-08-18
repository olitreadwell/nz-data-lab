'use client';

import { useMemo } from 'react';

import { CITY_RANK_ROWS, CITY_RANK_YEARS } from '@/lib/city-rank-data';
import type { CityRankRow } from '@/lib/city-rank-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

const HIGHLIGHT_CITIES = ['Auckland', 'Tauranga city', 'Dunedin city'];

function toSlopeRows(rows: CityRankRow[]): SlopeChartRow[] {
  return rows.map((row) => ({
    name: row.name,
    values: [row.population2013, row.population2018, row.population2023],
  }));
}

function formatCitySummary(row: SlopeChartRow, ranks: number[]): string {
  const firstRank = ranks[0] ?? 0;
  const lastRank = ranks[ranks.length - 1] ?? 0;
  const change = firstRank - lastRank;
  const direction = change === 0 ? 'held' : change < 0 ? 'fell' : 'climbed';
  const firstYear = CITY_RANK_YEARS[0];
  const lastYear = CITY_RANK_YEARS[CITY_RANK_YEARS.length - 1];
  const movement =
    change === 0
      ? 'held rank'
      : `${direction} ${Math.abs(change)} place${Math.abs(change) === 1 ? '' : 's'}`;
  const firstValue = row.values[0] ?? 0;
  const lastValue = row.values[row.values.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (${firstYear}) to rank ${lastRank} (${lastYear}), ${movement}. Population ${firstValue.toLocaleString('en-NZ')} to ${lastValue.toLocaleString('en-NZ')}.`;
}

/**
 * Census usually resident population ranks for the main city territorial
 * authorities across the 2013, 2018, and 2023 censuses, drawn as a slope
 * chart. Toggle between the biggest rank movers and the full field; hover a
 * line to read its path. Source: Stats NZ 2023 Census population counts
 * release (Table 2).
 */
export function CityRankSlope(): React.ReactElement {
  const slopeRows = useMemo(() => toSlopeRows(CITY_RANK_ROWS), []);

  const tableColumns: ChartDataColumn<CityRankRow>[] = [
    { key: 'name', header: 'City' },
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
        timePoints={CITY_RANK_YEARS.map(String)}
        highlightNames={HIGHLIGHT_CITIES}
        moverThreshold={1}
        chartLabel="City population ranks across the 2013, 2018, and 2023 censuses"
        moverSummary={(moverCount) => `${moverCount} cities moved rank between 2013 and 2023.`}
        rowSummary={formatCitySummary}
      />
      <ChartDataTable
        summary="View the city rank changes as a table"
        columns={tableColumns}
        rows={CITY_RANK_ROWS}
      />
    </div>
  );
}
