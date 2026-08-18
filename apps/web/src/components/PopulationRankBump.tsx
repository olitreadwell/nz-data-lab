'use client';

import { useMemo, useState } from 'react';

import { CENSUS_TA_POPULATION_ROWS, CENSUS_YEARS, rankChange } from '@/lib/census-rank-data';
import type { CensusTaPopulationRow } from '@/lib/census-rank-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 460;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 40;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const ROW_COUNT = CENSUS_TA_POPULATION_ROWS.length;
const MOVER_THRESHOLD = 3;
const CLIMBER_COLOR = '#d97706';
const FALLER_COLOR = '#e11d48';
const QUIET_COLOR = 'var(--color-muted)';

type BumpMode = 'movers' | 'all';

const YEAR_X: Record<number, number> = {
  [CENSUS_YEARS[0]]: PLOT_LEFT,
  [CENSUS_YEARS[1]]: Math.round(PLOT_LEFT + (SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT) / 2),
  [CENSUS_YEARS[2]]: SVG_WIDTH - PLOT_RIGHT,
};

function yForRank(rank: number): number {
  return PLOT_TOP + ((rank - 1) / (ROW_COUNT - 1)) * (SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM);
}

function isMover(row: CensusTaPopulationRow): boolean {
  return Math.abs(rankChange(row)) >= MOVER_THRESHOLD;
}

function linePoints(row: CensusTaPopulationRow): string {
  return CENSUS_YEARS.map((year) => {
    const rank = year === 2013 ? row.rank2013 : year === 2018 ? row.rank2018 : row.rank2023;
    return `${YEAR_X[year]},${yForRank(rank)}`;
  }).join(' ');
}

function lineColor(row: CensusTaPopulationRow, mode: BumpMode, highlighted: boolean): string {
  if (mode === 'movers') {
    if (isMover(row)) {
      return rankChange(row) < 0 ? CLIMBER_COLOR : FALLER_COLOR;
    }
    return QUIET_COLOR;
  }
  return highlighted ? CLIMBER_COLOR : QUIET_COLOR;
}

function lineOpacity(row: CensusTaPopulationRow, mode: BumpMode, highlighted: boolean): number {
  if (mode === 'movers' && !isMover(row)) {
    return 0.35;
  }
  return highlighted ? 1 : 0.8;
}

/** Tooltip line for one territory under the chart. */
function formatRowSummary(row: CensusTaPopulationRow): string {
  const change = rankChange(row);
  const direction = change === 0 ? 'held' : change < 0 ? 'climbed' : 'fell';
  return `${row.name}: rank ${row.rank2013} (2013) to rank ${row.rank2023} (2023), ${direction} ${Math.abs(change)} places. Population ${row.population2013.toLocaleString('en-NZ')} to ${row.population2023.toLocaleString('en-NZ')}.`;
}

/**
 * Census usually resident population ranks by territorial authority across
 * the 2013, 2018, and 2023 censuses, drawn as a bump chart. Toggle between
 * the biggest rank movers and the full field; hover a line to read its
 * path. Source: Stats NZ 2023 Census population counts release (Table 2).
 */
export function PopulationRankBump(): React.ReactElement {
  const [mode, setMode] = useState<BumpMode>('movers');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const movers = useMemo(() => CENSUS_TA_POPULATION_ROWS.filter((row) => isMover(row)), []);

  const highlightedRow =
    highlightedIndex === null ? undefined : CENSUS_TA_POPULATION_ROWS[highlightedIndex];

  const chartLabel = `Territorial authority population ranks across the 2013, 2018, and 2023 censuses${
    mode === 'movers' ? ', biggest movers highlighted' : ', all 67 territories'
  }`;

  const tableColumns: ChartDataColumn<CensusTaPopulationRow>[] = [
    { key: 'name', header: 'Territorial authority' },
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
            All {ROW_COUNT} territories
          </button>
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {highlightedRow === undefined
            ? `${movers.length} territories moved ${MOVER_THRESHOLD} or more rank places between 2013 and 2023.`
            : formatRowSummary(highlightedRow)}
        </p>
      </div>
      <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Chart legend">
        <li className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-[var(--radius-sm)]"
            style={{ backgroundColor: CLIMBER_COLOR }}
          />
          Climbed
        </li>
        <li className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-[var(--radius-sm)]"
            style={{ backgroundColor: FALLER_COLOR }}
          />
          Fell
        </li>
        <li className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-[var(--radius-sm)]"
            style={{ backgroundColor: QUIET_COLOR }}
          />
          Little change
        </li>
      </ul>
      <div role="img" aria-label={chartLabel} className="h-[clamp(320px,46vh,540px)]">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-full w-full"
          role="presentation"
        >
          {CENSUS_YEARS.map((year) => (
            <text
              key={year}
              x={YEAR_X[year]}
              y={PLOT_TOP - 8}
              textAnchor="middle"
              className="fill-[var(--color-muted)] text-xs"
            >
              {year}
            </text>
          ))}
          {Array.from({ length: 7 }, (_, index) => {
            const rank = index * 10 + 1;
            const y = yForRank(rank);
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
          {CENSUS_TA_POPULATION_ROWS.map((row, index) => (
            <polyline
              key={row.name}
              points={linePoints(row)}
              fill="none"
              stroke={lineColor(row, mode, index === highlightedIndex)}
              strokeWidth={index === highlightedIndex ? 3 : 1.5}
              strokeOpacity={lineOpacity(row, mode, index === highlightedIndex)}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(null)}
            />
          ))}
        </svg>
      </div>
      <ChartDataTable
        summary="View the rank changes as a table"
        columns={tableColumns}
        rows={CENSUS_TA_POPULATION_ROWS}
      />
    </div>
  );
}
