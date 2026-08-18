'use client';

import { useMemo, useState } from 'react';

import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import {
  isUnemploymentMover,
  UNEMPLOYMENT_QUARTERS,
  UNEMPLOYMENT_RANK_ROWS,
  unemploymentRankChange,
} from '@/lib/unemployment-rank-data';
import type { UnemploymentRankRow } from '@/lib/unemployment-rank-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 460;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 40;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const ROW_COUNT = UNEMPLOYMENT_RANK_ROWS.length;
const MOVER_THRESHOLD = 3;
const WORSE_COLOR = '#e11d48';
const IMPROVED_COLOR = '#0d9488';
const QUIET_COLOR = 'var(--color-muted)';
const FONT_SIZE = 12;

type Mode = 'movers' | 'all';

const MODE_OPTIONS = [
  ['movers', 'Biggest movers'],
  ['all', 'All 12 regions'],
] as const;

const AXIS_LABELS = UNEMPLOYMENT_QUARTERS.map((quarter) => {
  const [month, year] = quarter.split(' ');
  return `${month} ${year?.slice(-2) ?? ''}`;
});

function plotWidth(): number {
  return SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
}

function xForAxis(axisIndex: number): number {
  return PLOT_LEFT + (axisIndex / (UNEMPLOYMENT_QUARTERS.length - 1)) * plotWidth();
}

function yForRank(rank: number): number {
  return PLOT_TOP + ((rank - 1) / (ROW_COUNT - 1)) * (SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM);
}

function linePoints(row: UnemploymentRankRow): string {
  return row.ranks.map((rank, axisIndex) => `${xForAxis(axisIndex)},${yForRank(rank)}`).join(' ');
}

function lineColor(row: UnemploymentRankRow, mode: Mode, highlighted: boolean): string {
  if (mode === 'movers') {
    if (isUnemploymentMover(row)) {
      return unemploymentRankChange(row) < 0 ? WORSE_COLOR : IMPROVED_COLOR;
    }
    return QUIET_COLOR;
  }
  return highlighted ? WORSE_COLOR : QUIET_COLOR;
}

function lineOpacity(row: UnemploymentRankRow, mode: Mode, highlighted: boolean): number {
  if (mode === 'movers' && !isUnemploymentMover(row)) {
    return 0.3;
  }
  return highlighted ? 1 : 0.75;
}

function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** Tooltip line for one region under the chart. */
function formatRowSummary(row: UnemploymentRankRow): string {
  const firstRank = row.ranks[0] ?? 0;
  const lastRank = row.ranks[row.ranks.length - 1] ?? 0;
  const change = unemploymentRankChange(row);
  const direction = change === 0 ? 'held' : change < 0 ? 'climbed' : 'fell';
  const firstRate = row.rates[0] ?? 0;
  const lastRate = row.rates[row.rates.length - 1] ?? 0;
  return `${row.name}: rank ${firstRank} (Dec 2023) to rank ${lastRank} (Dec 2025), ${direction} ${Math.abs(change)} places. Rate ${firstRate.toFixed(1)}% to ${lastRate.toFixed(1)}%.`;
}

/**
 * Regional unemployment ranks across the nine quarters from December 2023
 * to December 2025, drawn as a parallel coordinates chart: one vertical
 * axis per quarter, one line per region, rank 1 (highest unemployment) at
 * the top. Toggle between the biggest rank movers and the full field, or
 * hover a line to read its path. Source: Stats NZ HLFS, December 2025
 * quarter (Table 6).
 */
export function UnemploymentParallelCoordinates(): React.ReactElement {
  const [mode, setMode] = useState<Mode>('movers');
  const [highlightedKey, setHighlightedKey] = useState<string | undefined>(undefined);

  const movers = useMemo(
    () => UNEMPLOYMENT_RANK_ROWS.filter((row) => isUnemploymentMover(row)),
    [],
  );

  const highlightedRow =
    highlightedKey === undefined
      ? undefined
      : UNEMPLOYMENT_RANK_ROWS.find((row) => row.key === highlightedKey);

  const chartLabel = `Regional unemployment ranks from December 2023 to December 2025${
    mode === 'movers' ? ', biggest movers highlighted' : ', all 12 regions'
  }`;

  const tableRows = UNEMPLOYMENT_RANK_ROWS.map((row) => ({
    name: row.name,
    firstRate: row.rates[0] ?? 0,
    lastRate: row.rates[row.rates.length - 1] ?? 0,
    firstRank: row.ranks[0] ?? 0,
    lastRank: row.ranks[row.ranks.length - 1] ?? 0,
    change: unemploymentRankChange(row),
  }));

  const tableColumns: ChartDataColumn<(typeof tableRows)[number]>[] = [
    { key: 'name', header: 'Region' },
    { key: 'firstRate', header: 'Rate, Dec 2023', format: (value) => formatRate(Number(value)) },
    { key: 'lastRate', header: 'Rate, Dec 2025', format: (value) => formatRate(Number(value)) },
    { key: 'firstRank', header: 'Rank, Dec 2023', format: (value) => `#${value}` },
    { key: 'lastRank', header: 'Rank, Dec 2025', format: (value) => `#${value}` },
    {
      key: 'change',
      header: 'Change',
      format: (value) => (Number(value) > 0 ? `+${value}` : String(value)),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Which regions to show"
          className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
        >
          {MODE_OPTIONS.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => setMode(value)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(event, index, MODE_OPTIONS, ([next]) => setMode(next))
              }
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]">
          {mode === 'movers'
            ? `${movers.length} regions moved ${MOVER_THRESHOLD} or more rank places`
            : 'Rank 1 is the highest unemployment rate'}
        </p>
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-auto w-full"
          aria-hidden="true"
        >
          {UNEMPLOYMENT_QUARTERS.map((quarter, axisIndex) => {
            const x = xForAxis(axisIndex);
            return (
              <g key={quarter}>
                <line
                  x1={x}
                  y1={PLOT_TOP}
                  x2={x}
                  y2={SVG_HEIGHT - PLOT_BOTTOM}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={SVG_HEIGHT - PLOT_BOTTOM + 18}
                  textAnchor="middle"
                  fontSize={FONT_SIZE}
                  fill="var(--color-muted)"
                >
                  {AXIS_LABELS[axisIndex]}
                </text>
              </g>
            );
          })}
          {[1, 4, 8, 12].map((rank) => (
            <text
              key={rank}
              x={PLOT_LEFT - 8}
              y={yForRank(rank) + 4}
              textAnchor="end"
              fontSize={FONT_SIZE}
              fill="var(--color-muted)"
            >
              {rank}
            </text>
          ))}
          {UNEMPLOYMENT_RANK_ROWS.map((row) => {
            const highlighted = row.key === highlightedKey;
            return (
              <g
                key={row.key}
                onMouseEnter={() => setHighlightedKey(row.key)}
                onMouseLeave={() => setHighlightedKey(undefined)}
                className="cursor-pointer"
              >
                <polyline
                  points={linePoints(row)}
                  fill="none"
                  stroke={lineColor(row, mode, highlighted)}
                  strokeWidth={highlighted ? 3 : 2}
                  opacity={lineOpacity(row, mode, highlighted)}
                >
                  <title>{formatRowSummary(row)}</title>
                </polyline>
              </g>
            );
          })}
        </svg>
      </div>
      <p aria-live="polite" className="numeral-paragraph-sm mt-2 min-h-5 text-[var(--color-muted)]">
        {highlightedRow === undefined
          ? 'Hover a line to read a region path.'
          : formatRowSummary(highlightedRow)}
      </p>
      <div className="mt-1 flex flex-wrap gap-4">
        <ul role="list" aria-label="Chart legend" className="flex flex-wrap gap-4 text-sm">
          <li className="flex items-center gap-2 text-[var(--color-muted)]">
            <span
              className="inline-block h-2 w-4 rounded"
              style={{ backgroundColor: WORSE_COLOR }}
            />
            Worse
          </li>
          <li className="flex items-center gap-2 text-[var(--color-muted)]">
            <span
              className="inline-block h-2 w-4 rounded"
              style={{ backgroundColor: IMPROVED_COLOR }}
            />
            Improved
          </li>
          <li className="flex items-center gap-2 text-[var(--color-muted)]">
            <span className="inline-block h-2 w-4 rounded bg-[var(--color-border)]" />
            Little change
          </li>
        </ul>
      </div>
      <ChartDataTable
        summary="Show the regional rates and ranks as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
