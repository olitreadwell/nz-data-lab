'use client';

import { useMemo, useState } from 'react';

import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import { VISITOR_ARRIVAL_ROWS, visitorArrivalGrowthPercent } from '@/lib/visitor-arrival-data';
import type { VisitorArrivalRow } from '@/lib/visitor-arrival-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 480;
const PLOT_LEFT = 150;
const PLOT_RIGHT = 48;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 40;
const ROW_COUNT = VISITOR_ARRIVAL_ROWS.length;
const MAX_ARRIVALS = 1600000;
const FONT_SIZE = 12;
const YEAR_2015_COLOR = 'var(--color-muted)';
const YEAR_2019_COLOR = '#0284c7';

type YearMode = 'both' | '2015' | '2019';

const YEAR_OPTIONS = [
  ['both', 'Both years'],
  ['2015', '2015 only'],
  ['2019', '2019 only'],
] as const;

const X_TICKS = [0, 400000, 800000, 1200000, 1600000];

function plotWidth(): number {
  return SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
}

function rowHeight(): number {
  return (SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM) / ROW_COUNT;
}

function xForArrivals(arrivals: number): number {
  return PLOT_LEFT + (arrivals / MAX_ARRIVALS) * plotWidth();
}

function yForIndex(index: number): number {
  return PLOT_TOP + (index + 0.5) * rowHeight();
}

function formatTick(value: number): string {
  if (value === 0) {
    return '0';
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}m`;
  }
  return `${value / 1000}k`;
}

function formatArrivals(value: number): string {
  return value.toLocaleString('en-NZ');
}

/** Tooltip line for one country under the chart. */
function formatRowSummary(row: VisitorArrivalRow): string {
  const growth = visitorArrivalGrowthPercent(row);
  return `${row.name}: ${formatArrivals(row.arrivals2015)} in 2015, ${formatArrivals(
    row.arrivals2019,
  )} in 2019, up ${growth} percent.`;
}

/**
 * Visitor arrivals by country of residence for the years ended December
 * 2015 and 2019, drawn as a Cleveland dot plot: one row per country, a
 * muted dot at the 2015 value and a sky dot at the 2019 value. Toggle
 * between years, type to filter countries by name, or hover a dot to read
 * its value. Source: Stats NZ International travel: December 2019 (Table 4).
 */
export function VisitorArrivalDotPlot(): React.ReactElement {
  const [yearMode, setYearMode] = useState<YearMode>('both');
  const [query, setQuery] = useState('');
  const [highlightedKey, setHighlightedKey] = useState<string | undefined>(undefined);

  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized === '') {
      return VISITOR_ARRIVAL_ROWS;
    }
    return VISITOR_ARRIVAL_ROWS.filter((row) => row.name.toLowerCase().includes(normalized));
  }, [query]);

  const highlightedRow =
    highlightedKey === undefined
      ? undefined
      : VISITOR_ARRIVAL_ROWS.find((row) => row.key === highlightedKey);

  const chartLabel = `Visitor arrivals by country of residence, years ended December 2015 and 2019${
    yearMode === 'both' ? ', both years' : `, ${yearMode} only`
  }`;

  const tableRows = VISITOR_ARRIVAL_ROWS.map((row) => ({
    name: row.name,
    arrivals2015: row.arrivals2015,
    arrivals2019: row.arrivals2019,
    growth: visitorArrivalGrowthPercent(row),
  }));

  const tableColumns: ChartDataColumn<(typeof tableRows)[number]>[] = [
    { key: 'name', header: 'Country of residence' },
    {
      key: 'arrivals2015',
      header: 'Arrivals, 2015',
      format: (value) => formatArrivals(Number(value)),
    },
    {
      key: 'arrivals2019',
      header: 'Arrivals, 2019',
      format: (value) => formatArrivals(Number(value)),
    },
    {
      key: 'growth',
      header: 'Change',
      format: (value) => (Number(value) > 0 ? `+${value}%` : `${value}%`),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Which years to show"
          className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
        >
          {YEAR_OPTIONS.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={yearMode === value}
              onClick={() => setYearMode(value)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(event, index, YEAR_OPTIONS, ([next]) => setYearMode(next))
              }
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <span>Filter</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Country name"
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-transparent px-2 py-1 text-sm text-[var(--color-fg)]"
          />
        </label>
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-auto w-full"
          aria-hidden="true"
        >
          {X_TICKS.map((tick) => {
            const x = xForArrivals(tick);
            return (
              <g key={tick}>
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
                  {formatTick(tick)}
                </text>
              </g>
            );
          })}
          {visibleRows.map((row, index) => {
            const y = yForIndex(index);
            const show2015 = yearMode === 'both' || yearMode === '2015';
            const show2019 = yearMode === 'both' || yearMode === '2019';
            return (
              <g
                key={row.key}
                onMouseEnter={() => setHighlightedKey(row.key)}
                onMouseLeave={() => setHighlightedKey(undefined)}
                className="cursor-pointer"
              >
                <text
                  x={PLOT_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={FONT_SIZE}
                  fill="var(--color-muted)"
                >
                  {row.name}
                </text>
                {show2015 ? (
                  <circle cx={xForArrivals(row.arrivals2015)} cy={y} r={5} fill={YEAR_2015_COLOR}>
                    <title>{`${row.name}, 2015: ${formatArrivals(row.arrivals2015)}`}</title>
                  </circle>
                ) : null}
                {show2019 ? (
                  <circle cx={xForArrivals(row.arrivals2019)} cy={y} r={5} fill={YEAR_2019_COLOR}>
                    <title>{`${row.name}, 2019: ${formatArrivals(row.arrivals2019)}`}</title>
                  </circle>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
      <p aria-live="polite" className="numeral-paragraph-sm mt-2 min-h-5 text-[var(--color-muted)]">
        {highlightedRow === undefined
          ? 'Hover a dot to read a country value.'
          : formatRowSummary(highlightedRow)}
      </p>
      <div className="mt-1 flex flex-wrap gap-4">
        <ul role="list" aria-label="Chart legend" className="flex flex-wrap gap-4 text-sm">
          <li className="flex items-center gap-2 text-[var(--color-muted)]">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: YEAR_2015_COLOR }}
            />
            2015
          </li>
          <li className="flex items-center gap-2 text-[var(--color-muted)]">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: YEAR_2019_COLOR }}
            />
            2019
          </li>
        </ul>
      </div>
      <ChartDataTable
        summary="Show the visitor arrivals by country as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
