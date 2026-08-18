'use client';

import { useMemo, useState } from 'react';

import { ENTERPRISE_INDUSTRY_ROWS, enterpriseChangePercent } from '@/lib/enterprise-bar-data';
import type { EnterpriseIndustryRow } from '@/lib/enterprise-bar-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const ROW_HEIGHT = 26;
const PLOT_TOP = 20;
const PLOT_LEFT = 224;
const PLOT_RIGHT = 96;
const PLOT_BOTTOM = 44;
const LABEL_FONT_SIZE = 12;
const X_MAX = 135000;
const BAR_2020_HEIGHT = 14;
const BAR_2025_HEIGHT = 6;
const BAR_2020_COLOR = '#cbd5e1';
const BAR_2025_COLOR = '#4f46e5';
const HOVER_FADE = 0.35;

type SortMode = 'size' | 'change';

const SORT_OPTIONS = [
  ['size', 'By Feb 2025 count'],
  ['change', 'By change'],
] as const;

const AXIS_TICKS = [0, 25000, 50000, 75000, 100000, 125000] as const;

function formatTick(value: number): string {
  if (value === 0) {
    return '0';
  }
  return `${value / 1000}k`;
}

function xForCount(count: number): number {
  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  return PLOT_LEFT + (count / X_MAX) * plotWidth;
}

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function formatChange(value: number): string {
  if (value > 0) {
    return `+${value.toFixed(1)}%`;
  }
  return `${value.toFixed(1)}%`;
}

/**
 * Sorts the industry rows for display.
 *
 * @param rows - the rows to sort
 * @param mode - size sorts by February 2025 count, change by growth rate
 * @returns a new array sorted by the requested mode
 */
function sortRows(rows: EnterpriseIndustryRow[], mode: SortMode): EnterpriseIndustryRow[] {
  const sorted = [...rows];
  if (mode === 'change') {
    sorted.sort((a, b) => enterpriseChangePercent(b) - enterpriseChangePercent(a));
  } else {
    sorted.sort((a, b) => b.enterprises2025 - a.enterprises2025);
  }
  return sorted;
}

interface IndustryRow {
  name: string;
  enterprises2020: number;
  enterprises2025: number;
  changePercent: number;
}

/**
 * Economically significant enterprises by industry at February 2020 and
 * February 2025, drawn as a bar-in-bar chart: the wider bar is the February
 * 2020 count and the narrower bar inside it is the February 2025 count.
 * Toggle the sort order or search for an industry.
 */
export function IndustryBarInBar(): React.ReactElement {
  const [sortMode, setSortMode] = useState<SortMode>('size');
  const [query, setQuery] = useState('');
  const [hoveredKey, setHoveredKey] = useState<string | undefined>(undefined);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleRows = useMemo(() => {
    const filtered = ENTERPRISE_INDUSTRY_ROWS.filter(
      (row) => normalizedQuery === '' || row.name.toLowerCase().includes(normalizedQuery),
    );
    return sortRows(filtered, sortMode);
  }, [normalizedQuery, sortMode]);

  const plotHeight = visibleRows.length * ROW_HEIGHT;
  const chartHeight = PLOT_TOP + plotHeight + PLOT_BOTTOM;

  const chartLabel = `New Zealand enterprises by industry at February 2020 and February 2025, ${
    sortMode === 'change' ? 'sorted by change' : 'sorted by February 2025 count'
  }`;

  const tableRows: IndustryRow[] = ENTERPRISE_INDUSTRY_ROWS.map((row) => ({
    name: row.name,
    enterprises2020: row.enterprises2020,
    enterprises2025: row.enterprises2025,
    changePercent: enterpriseChangePercent(row),
  }));

  const tableColumns: ChartDataColumn<IndustryRow>[] = [
    { key: 'name', header: 'Industry' },
    {
      key: 'enterprises2020',
      header: 'Feb 2020',
      format: (value) => formatCount(Number(value)),
    },
    {
      key: 'enterprises2025',
      header: 'Feb 2025',
      format: (value) => formatCount(Number(value)),
    },
    {
      key: 'changePercent',
      header: 'Change',
      format: (value) => formatChange(Number(value)),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="How to sort the industries"
          className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
        >
          {SORT_OPTIONS.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={sortMode === value}
              onClick={() => setSortMode(value)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(event, index, SORT_OPTIONS, ([next]) => setSortMode(next))
              }
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <span className="sr-only">Find an industry</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find an industry"
            className="w-44 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-fg)]"
          />
        </label>
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
          className="mx-auto h-auto max-h-[clamp(320px,46vh,560px)] w-full"
          aria-hidden="true"
        >
          {AXIS_TICKS.map((tick) => {
            const x = xForCount(tick);
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
          {visibleRows.map((row, index) => {
            const y = PLOT_TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2;
            const x2020 = xForCount(row.enterprises2020);
            const x2025 = xForCount(row.enterprises2025);
            const highlighted = hoveredKey === row.key;
            const faded = hoveredKey !== undefined && !highlighted;
            const change = enterpriseChangePercent(row);
            return (
              <g
                key={row.key}
                onMouseEnter={() => setHoveredKey(row.key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                opacity={faded ? HOVER_FADE : 1}
              >
                <title>{`${row.name}: ${formatCount(row.enterprises2020)} at February 2020, ${formatCount(
                  row.enterprises2025,
                )} at February 2025, ${formatChange(change)}`}</title>
                <text
                  x={PLOT_LEFT - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={LABEL_FONT_SIZE}
                  fill="var(--color-fg)"
                >
                  {row.name}
                </text>
                <rect
                  x={PLOT_LEFT}
                  y={y - BAR_2020_HEIGHT / 2}
                  width={x2020 - PLOT_LEFT}
                  height={BAR_2020_HEIGHT}
                  fill={BAR_2020_COLOR}
                  rx={3}
                />
                <rect
                  x={PLOT_LEFT}
                  y={y - BAR_2025_HEIGHT / 2}
                  width={x2025 - PLOT_LEFT}
                  height={BAR_2025_HEIGHT}
                  fill={BAR_2025_COLOR}
                  rx={3}
                />
                <text
                  x={SVG_WIDTH - PLOT_RIGHT + 8}
                  y={y + 4}
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={700}
                  fill="var(--color-fg)"
                >
                  {formatCount(row.enterprises2025)}
                </text>
                <text
                  x={SVG_WIDTH - PLOT_RIGHT + 8}
                  y={y - 6}
                  fontSize={10}
                  fill="var(--color-muted)"
                >
                  {formatChange(change)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        The wide bar is the February 2020 count and the narrow bar inside it is the February 2025
        count. The figure on the right is the 2025 count, with the percentage change above it.
      </p>
      <ChartDataTable
        summary="View the enterprise counts by industry as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
