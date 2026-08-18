'use client';

import { useMemo } from 'react';

import { VISITOR_RANK_ROWS, VISITOR_RANK_YEARS } from '@/lib/visitor-rank-data';
import type { VisitorRankRow } from '@/lib/visitor-rank-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

const HIGHLIGHT_COUNTRIES = ['India', 'Japan', 'United States', 'Indonesia', 'Philippines'];

function toSlopeRows(rows: VisitorRankRow[]): SlopeChartRow[] {
  return rows.map((row) => ({
    name: row.name,
    values: [row.arrivals2015, row.arrivals2019],
  }));
}

function formatCountrySummary(row: SlopeChartRow, ranks: number[]): string {
  const firstRank = ranks[0] ?? 0;
  const lastRank = ranks[ranks.length - 1] ?? 0;
  const change = firstRank - lastRank;
  const direction = change === 0 ? 'held' : change < 0 ? 'fell' : 'climbed';
  const firstYear = VISITOR_RANK_YEARS[0];
  const lastYear = VISITOR_RANK_YEARS[VISITOR_RANK_YEARS.length - 1];
  const movement =
    change === 0
      ? 'held rank'
      : `${direction} ${Math.abs(change)} place${Math.abs(change) === 1 ? '' : 's'}`;
  const firstValue = row.values[0] ?? 0;
  const lastValue = row.values[row.values.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (${firstYear}) to rank ${lastRank} (${lastYear}), ${movement}. Arrivals ${firstValue.toLocaleString('en-NZ')} to ${lastValue.toLocaleString('en-NZ')}.`;
}

/**
 * Visitor arrival ranks by country of residence for the years ended
 * December 2015 and 2019, drawn as a slope chart. Toggle between the
 * biggest rank movers and the full field; hover a line to read its path.
 * Source: Stats NZ International travel: December 2019 release (Table 4).
 */
export function VisitorRankSlope(): React.ReactElement {
  const slopeRows = useMemo(() => toSlopeRows(VISITOR_RANK_ROWS), []);

  const tableColumns: ChartDataColumn<VisitorRankRow>[] = [
    { key: 'name', header: 'Country of residence' },
    {
      key: 'arrivals2015',
      header: '2015 arrivals',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    {
      key: 'arrivals2019',
      header: '2019 arrivals',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    { key: 'rank2015', header: '2015 rank', format: (value) => `#${value}` },
    { key: 'rank2019', header: '2019 rank', format: (value) => `#${value}` },
  ];

  return (
    <div>
      <SlopeChart
        rows={slopeRows}
        timePoints={VISITOR_RANK_YEARS.map(String)}
        highlightNames={HIGHLIGHT_COUNTRIES}
        moverThreshold={1}
        chartLabel="Visitor arrival ranks by country of residence for 2015 and 2019"
        moverSummary={(moverCount) =>
          `${moverCount} countries moved visitor arrival rank between 2015 and 2019.`
        }
        rowSummary={formatCountrySummary}
      />
      <ChartDataTable
        summary="View the visitor arrival rank changes as a table"
        columns={tableColumns}
        rows={VISITOR_RANK_ROWS}
      />
    </div>
  );
}
