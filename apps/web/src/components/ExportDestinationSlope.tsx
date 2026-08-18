'use client';

import { useMemo } from 'react';

import { EXPORT_DESTINATION_ROWS, EXPORT_DESTINATION_YEARS } from '@/lib/export-destination-data';
import type { ExportDestinationRow } from '@/lib/export-destination-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { SlopeChart } from './SlopeChart';
import type { SlopeChartRow } from './SlopeChart';

const HIGHLIGHT_COUNTRIES = ['China', 'Australia'];

function toSlopeRows(rows: ExportDestinationRow[]): SlopeChartRow[] {
  return rows.map((row) => ({
    name: row.name,
    values: [row.exports2015, row.exports2020, row.exports2026],
  }));
}

function formatBillions(value: number): string {
  return `$${value.toFixed(1)}b`;
}

function formatCountrySummary(row: SlopeChartRow, ranks: number[]): string {
  const firstRank = ranks[0] ?? 0;
  const lastRank = ranks[ranks.length - 1] ?? 0;
  const change = firstRank - lastRank;
  const direction = change === 0 ? 'held' : change < 0 ? 'fell' : 'climbed';
  const firstYear = EXPORT_DESTINATION_YEARS[0];
  const lastYear = EXPORT_DESTINATION_YEARS[EXPORT_DESTINATION_YEARS.length - 1];
  const movement =
    change === 0
      ? 'held rank'
      : `${direction} ${Math.abs(change)} place${Math.abs(change) === 1 ? '' : 's'}`;
  const firstValue = row.values[0] ?? 0;
  const lastValue = row.values[row.values.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (${firstYear}) to rank ${lastRank} (${lastYear}), ${movement}. Goods exports ${formatBillions(firstValue)} to ${formatBillions(lastValue)}.`;
}

/**
 * New Zealand goods exports by destination country, drawn as a slope chart
 * of each country's rank among the top ten markets in the years ended March
 * 2015, 2020, and 2026. Toggle between the biggest rank movers and the full
 * field; hover a line to read its path. Source: Stats NZ goods and services
 * trade by country releases.
 */
export function ExportDestinationSlope(): React.ReactElement {
  const slopeRows = useMemo(() => toSlopeRows(EXPORT_DESTINATION_ROWS), []);

  const tableColumns: ChartDataColumn<ExportDestinationRow>[] = [
    { key: 'name', header: 'Destination' },
    {
      key: 'exports2015',
      header: '2015 exports',
      format: (value) => formatBillions(Number(value)),
    },
    {
      key: 'exports2026',
      header: '2026 exports',
      format: (value) => formatBillions(Number(value)),
    },
    { key: 'rank2015', header: '2015 rank', format: (value) => `#${value}` },
    { key: 'rank2026', header: '2026 rank', format: (value) => `#${value}` },
  ];

  return (
    <div>
      <SlopeChart
        rows={slopeRows}
        timePoints={EXPORT_DESTINATION_YEARS.map(String)}
        highlightNames={HIGHLIGHT_COUNTRIES}
        moverThreshold={1}
        chartLabel="Goods export destination ranks across the years ended March 2015, 2020, and 2026"
        moverSummary={(moverCount) =>
          `${moverCount} destinations moved rank between 2015 and 2026.`
        }
        rowSummary={formatCountrySummary}
      />
      <ChartDataTable
        summary="View the export destination rank changes as a table"
        columns={tableColumns}
        rows={EXPORT_DESTINATION_ROWS}
      />
    </div>
  );
}
