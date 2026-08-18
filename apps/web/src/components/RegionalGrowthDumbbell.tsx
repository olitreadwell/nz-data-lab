'use client';

import { useMemo, useState } from 'react';

import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import { REGIONAL_POPULATION_ROWS, regionalGain } from '@/lib/regional-growth-data';
import type { RegionalPopulationRow } from '@/lib/regional-growth-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const ROW_HEIGHT = 26;
const PLOT_TOP = 20;
const PLOT_LEFT = 178;
const PLOT_RIGHT = 12;
const PLOT_BOTTOM = 44;
const LABEL_FONT_SIZE = 12;
const X_MIN = 20000;
const X_MAX = 2000000;
const START_COLOR = '#64748b';
const END_COLOR = '#059669';

type SortMode = 'growth' | 'size';

const SORT_OPTIONS = [
  ['growth', 'By growth'],
  ['size', 'By 2023 population'],
] as const;

const AXIS_TICKS = [50000, 100000, 200000, 500000, 1000000, 2000000] as const;

function formatTick(value: number): string {
  if (value >= 1000000) {
    return `${value / 1000000}m`;
  }
  return `${value / 1000}k`;
}

function xForPopulation(population: number): number {
  const logMin = Math.log10(X_MIN);
  const logMax = Math.log10(X_MAX);
  const ratio = (Math.log10(population) - logMin) / (logMax - logMin);
  return PLOT_LEFT + ratio * (SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT);
}

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

/**
 * Sorts rows for display.
 *
 * @param rows - the rows to sort
 * @param mode - growth sorts by growth rate, size by 2023 population
 * @returns a new array sorted by the requested mode
 */
function sortRows(rows: RegionalPopulationRow[], mode: SortMode): RegionalPopulationRow[] {
  const sorted = [...rows];
  if (mode === 'growth') {
    sorted.sort((a, b) => b.growthPercent - a.growthPercent);
  } else {
    sorted.sort((a, b) => b.population2023 - a.population2023);
  }
  return sorted;
}

/**
 * Regional council population in the 2013 and 2023 censuses, drawn as a
 * dumbbell chart: each region is a row with a dot at its 2013 population and
 * a dot at its 2023 population, on a log scale so the gap between the dots
 * shows the growth rate. Toggle to sort by growth or by 2023 population.
 */
export function RegionalGrowthDumbbell(): React.ReactElement {
  const [sortMode, setSortMode] = useState<SortMode>('growth');
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);

  const sortedRows = useMemo(() => sortRows(REGIONAL_POPULATION_ROWS, sortMode), [sortMode]);

  const plotHeight = sortedRows.length * ROW_HEIGHT;
  const chartHeight = PLOT_TOP + plotHeight + PLOT_BOTTOM;

  const chartLabel = `New Zealand regional council population in 2013 and 2023, ${
    sortMode === 'growth' ? 'sorted by growth' : 'sorted by 2023 population'
  }, log scale`;

  const tableColumns: ChartDataColumn<RegionalPopulationRow>[] = [
    { key: 'name', header: 'Region' },
    {
      key: 'population2013',
      header: '2013 Census',
      format: (value) => Number(value).toLocaleString('en-NZ'),
    },
    {
      key: 'population2023',
      header: '2023 Census',
      format: (value) => Number(value).toLocaleString('en-NZ'),
    },
    {
      key: 'growthPercent',
      header: 'Growth',
      format: (value) => `+${Number(value).toFixed(1)}%`,
    },
  ];

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="How to sort the regions"
        className="mb-3 flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
      >
        {SORT_OPTIONS.map(([value, label], index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={sortMode === value}
            onClick={() => setSortMode(value)}
            onKeyDown={(event) =>
              handleRadioGroupKeyDown(event, index, SORT_OPTIONS, ([value]) => setSortMode(value))
            }
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
          >
            {label}
          </button>
        ))}
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
          className="mx-auto h-auto max-h-[clamp(320px,46vh,560px)] w-full"
          aria-hidden="true"
        >
          {AXIS_TICKS.map((tick) => {
            const x = xForPopulation(tick);
            return (
              <g key={tick}>
                <line
                  x1={x}
                  y1={PLOT_TOP}
                  x2={x}
                  y2={PLOT_TOP + plotHeight}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <text
                  x={x}
                  y={PLOT_TOP + plotHeight + 18}
                  textAnchor="middle"
                  fontSize={LABEL_FONT_SIZE}
                  fill="var(--color-muted)"
                >
                  {formatTick(tick)}
                </text>
              </g>
            );
          })}
          {sortedRows.map((row, index) => {
            const y = PLOT_TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2;
            const xStart = xForPopulation(row.population2013);
            const xEnd = xForPopulation(row.population2023);
            const highlighted = hoveredIndex === index;
            const growth = regionalGain(row);
            return (
              <g
                key={row.name}
                data-region={row.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(undefined)}
              >
                <title>{`${row.name}: ${formatCount(row.population2013)} in 2013, ${formatCount(
                  row.population2023,
                )} in 2023, +${row.growthPercent.toFixed(1)}%`}</title>
                <text
                  x={PLOT_LEFT - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={LABEL_FONT_SIZE}
                  fill="var(--color-fg)"
                >
                  {row.name}
                </text>
                <line
                  x1={xStart}
                  y1={y}
                  x2={xEnd}
                  y2={y}
                  stroke={END_COLOR}
                  strokeWidth={highlighted ? 3 : 1.5}
                  opacity={highlighted ? 1 : 0.75}
                />
                <circle
                  cx={xStart}
                  cy={y}
                  r={4}
                  fill="var(--color-bg)"
                  stroke={START_COLOR}
                  strokeWidth={2}
                />
                <circle cx={xEnd} cy={y} r={5} fill={END_COLOR} />
                <text
                  x={xEnd + 8}
                  y={y + 4}
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={700}
                  fill={END_COLOR}
                >
                  +{row.growthPercent.toFixed(1)}%
                </text>
                <text
                  x={SVG_WIDTH - PLOT_RIGHT}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={LABEL_FONT_SIZE}
                  fill="var(--color-muted)"
                >
                  +{formatCount(growth)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        The chart plots population on a log scale, so the gap between the dots shows the growth
        rate, not the raw gain. The right-hand number is the gain in people.
      </p>
      <ChartDataTable
        summary="View the regional population figures as a table"
        columns={tableColumns}
        rows={sortedRows}
      />
    </div>
  );
}
