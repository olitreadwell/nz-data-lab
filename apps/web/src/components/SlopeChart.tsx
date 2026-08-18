'use client';

import { useMemo, useState } from 'react';

/** One row of a slope chart: a named series with one value per time point. */
export interface SlopeChartRow {
  name: string;
  values: number[];
}

interface SlopeChartProps {
  rows: SlopeChartRow[];
  timePoints: string[];
  highlightNames?: string[];
  moverThreshold?: number;
  chartLabel: string;
  moverSummary: (moverCount: number) => string;
  rowSummary: (row: SlopeChartRow, ranks: number[]) => string;
}

const SVG_WIDTH = 720;
const SVG_HEIGHT = 460;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 40;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const CLIMBER_COLOR = '#d97706';
const FALLER_COLOR = '#e11d48';
const QUIET_COLOR = '#cbd5e1';

type SlopeMode = 'movers' | 'all';

/**
 * Ranks each row at every time point, returned as one rank array per row
 * (row[0] holds that row's rank at each time point).
 */
function rankRowsPerSeries(rows: SlopeChartRow[]): number[][] {
  const timePointCount = rows[0]?.values.length ?? 0;
  const ranksByTimePoint: number[][] = [];
  for (let timeIndex = 0; timeIndex < timePointCount; timeIndex += 1) {
    const sorted = [...rows].sort(
      (a, b) => (b.values[timeIndex] ?? 0) - (a.values[timeIndex] ?? 0),
    );
    const rankByName = new Map(sorted.map((row, index) => [row.name, index + 1]));
    ranksByTimePoint.push(rows.map((row) => rankByName.get(row.name) ?? 0));
  }
  return rows.map((_, rowIndex) =>
    ranksByTimePoint.map((ranksAtTimePoint) => ranksAtTimePoint[rowIndex] ?? 0),
  );
}

function rankChange(ranks: number[]): number {
  const first = ranks[0] ?? 0;
  const last = ranks[ranks.length - 1] ?? 0;
  return first - last;
}

function xForTimePoint(index: number, timePointCount: number): number {
  if (timePointCount <= 1) {
    return PLOT_LEFT;
  }
  return PLOT_LEFT + (index / (timePointCount - 1)) * (SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT);
}

function yForRank(rank: number, rowCount: number): number {
  return PLOT_TOP + ((rank - 1) / (rowCount - 1)) * (SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM);
}

function linePoints(ranks: number[], rowCount: number): string {
  return ranks
    .map((rank, index) => `${xForTimePoint(index, ranks.length)},${yForRank(rank, rowCount)}`)
    .join(' ');
}

function lineColor(
  change: number,
  mode: SlopeMode,
  highlighted: boolean,
  isHighlightName: boolean,
): string {
  if (mode === 'movers') {
    if (change !== 0) {
      return change < 0 ? FALLER_COLOR : CLIMBER_COLOR;
    }
    return QUIET_COLOR;
  }
  if (highlighted || isHighlightName) {
    return change < 0 ? FALLER_COLOR : CLIMBER_COLOR;
  }
  return QUIET_COLOR;
}

function lineOpacity(
  change: number,
  mode: SlopeMode,
  highlighted: boolean,
  isHighlightName: boolean,
): number {
  if (mode === 'movers' && change === 0) {
    return 0.35;
  }
  if (highlighted || isHighlightName) {
    return 1;
  }
  return 0.8;
}

/**
 * A slope chart: one line per series, drawn between its rank at each time
 * point. Toggle between the biggest rank movers and the full field; hover a
 * line to read its path. Ranks are computed from the values, so the chart
 * shows relative position while the data table keeps the absolute values.
 */
export function SlopeChart({
  rows,
  timePoints,
  highlightNames = [],
  moverThreshold = 2,
  chartLabel,
  moverSummary,
  rowSummary,
}: SlopeChartProps): React.ReactElement {
  const [mode, setMode] = useState<SlopeMode>('movers');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const ranks = useMemo(() => rankRowsPerSeries(rows), [rows]);
  const changes = useMemo(
    () => rows.map((row, index) => rankChange(ranks[index] ?? [])),
    [rows, ranks],
  );
  const moverCount = useMemo(
    () => changes.filter((change) => Math.abs(change) >= moverThreshold).length,
    [changes, moverThreshold],
  );

  const highlightedRow = highlightedIndex === null ? undefined : rows[highlightedIndex];
  const highlightedRanks = highlightedIndex === null ? undefined : ranks[highlightedIndex];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1">
          <button
            type="button"
            onClick={() => setMode('movers')}
            aria-pressed={mode === 'movers'}
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            Biggest movers
          </button>
          <button
            type="button"
            onClick={() => setMode('all')}
            aria-pressed={mode === 'all'}
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            All {rows.length}
          </button>
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {highlightedRow === undefined || highlightedRanks === undefined
            ? moverSummary(moverCount)
            : rowSummary(highlightedRow, highlightedRanks)}
        </p>
      </div>
      <div role="img" aria-label={chartLabel} className="h-[clamp(320px,46vh,540px)]">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-full w-full"
          role="presentation"
        >
          {timePoints.map((timePoint, index) => (
            <text
              key={timePoint}
              x={xForTimePoint(index, timePoints.length)}
              y={PLOT_TOP - 8}
              textAnchor="middle"
              className="fill-[var(--color-muted)] text-xs"
            >
              {timePoint}
            </text>
          ))}
          {Array.from({ length: Math.min(rows.length, 10) }, (_, index) => {
            const rank = index + 1;
            const y = yForRank(rank, rows.length);
            return (
              <g key={rank}>
                <line
                  x1={PLOT_LEFT}
                  x2={SVG_WIDTH - PLOT_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <text
                  x={PLOT_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[var(--color-muted)] text-xs"
                >
                  #{rank}
                </text>
              </g>
            );
          })}
          {rows.map((row, index) => {
            const change = changes[index] ?? 0;
            const isHighlightName = highlightNames.includes(row.name);
            const isHighlighted = index === highlightedIndex;
            return (
              <polyline
                key={row.name}
                points={linePoints(ranks[index] ?? [], rows.length)}
                fill="none"
                stroke={lineColor(change, mode, isHighlighted, isHighlightName)}
                strokeWidth={isHighlighted ? 3 : 1.5}
                strokeOpacity={lineOpacity(change, mode, isHighlighted, isHighlightName)}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(null)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
