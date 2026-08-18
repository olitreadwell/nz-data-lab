'use client';

import { useMemo, useState } from 'react';

import {
  EMPLOYMENT_INDUSTRY_ROWS,
  EMPLOYMENT_TOTAL_2020,
  EMPLOYMENT_TOTAL_2025,
  employmentChange,
  employmentShare2025,
} from '@/lib/employment-data';
import type { EmploymentIndustryRow } from '@/lib/employment-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 44;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 44;
const COLUMN_GAP = 30;
const PLOT_HEIGHT = 320;

const INDUSTRY_COLORS = [
  '#4338ca',
  '#7c3aed',
  '#db2777',
  '#e11d48',
  '#ea580c',
  '#d97706',
  '#65a30d',
  '#059669',
  '#0d9488',
  '#0891b2',
] as const;

const WIDTH_OPTIONS = [
  ['proportional', 'By employees'],
  ['equal', 'Equal columns'],
] as const;

type WidthMode = (typeof WIDTH_OPTIONS)[number][0];

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function formatSignedCount(value: number): string {
  return value > 0 ? `+${formatCount(value)}` : formatCount(value);
}

interface EmploymentTableRow {
  name: string;
  employees2020: number;
  employees2025: number;
  share: string;
}

/**
 * Employees by industry at February 2020 and February 2025 as a marimekko:
 * each column's width is the total employee count and each block's height
 * is an industry's share. Hover a block to highlight that industry in both
 * years, or switch the columns to equal width to compare shares directly.
 */
export function EmploymentMarimekko(): React.ReactElement {
  const [widthMode, setWidthMode] = useState<WidthMode>('proportional');
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);

  const sortedRows = useMemo(
    () => [...EMPLOYMENT_INDUSTRY_ROWS].sort((a, b) => b.employees2025 - a.employees2025),
    [],
  );

  const focused = sortedRows.find((row) => row.key === focusedKey);

  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const proportionalWidth =
    (EMPLOYMENT_TOTAL_2020 / (EMPLOYMENT_TOTAL_2020 + EMPLOYMENT_TOTAL_2025)) * plotWidth;
  const column2020Width =
    widthMode === 'proportional' ? proportionalWidth : plotWidth / 2 - COLUMN_GAP / 2;
  const column2025Width =
    widthMode === 'proportional' ? plotWidth - proportionalWidth : plotWidth / 2 - COLUMN_GAP / 2;
  const column2025X = PLOT_LEFT + column2020Width + COLUMN_GAP;
  const chartHeight = PLOT_TOP + PLOT_HEIGHT + PLOT_BOTTOM;

  const chartLabel =
    widthMode === 'proportional'
      ? 'Employee count by industry at February 2020 and February 2025, column width scaled to employee count'
      : 'Employee count by industry at February 2020 and February 2025, equal column widths to compare shares';

  const rows: EmploymentTableRow[] = sortedRows.map((row) => ({
    name: row.name,
    employees2020: row.employees2020,
    employees2025: row.employees2025,
    share: `${employmentShare2025(row).toFixed(1)}%`,
  }));

  const tableColumns: ChartDataColumn<EmploymentTableRow>[] = [
    { key: 'name', header: 'Industry' },
    {
      key: 'employees2020',
      header: 'Feb 2020',
      format: (value) => formatCount(Number(value)),
    },
    {
      key: 'employees2025',
      header: 'Feb 2025',
      format: (value) => formatCount(Number(value)),
    },
    { key: 'share', header: 'Share of Feb 2025' },
  ];

  return (
    <figure>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Column widths" className="flex items-end gap-1">
          {WIDTH_OPTIONS.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={widthMode === value}
              tabIndex={widthMode === value ? 0 : -1}
              onClick={() => setWidthMode(value)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(
                  event,
                  index,
                  WIDTH_OPTIONS.map(([optionValue]) => optionValue),
                  setWidthMode,
                )
              }
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {focused === undefined
            ? 'Hover a block to read an industry across both years.'
            : `${focused.name}: ${formatCount(focused.employees2020)} in Feb 2020, ${formatCount(
                focused.employees2025,
              )} in Feb 2025 (${formatSignedCount(employmentChange(focused))})`}
        </p>
      </div>
      <svg
        role="img"
        aria-label={chartLabel}
        viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
        className="h-auto w-full"
      >
        <g>
          {renderColumn(2020, PLOT_LEFT, column2020Width, sortedRows, focusedKey, setFocusedKey)}
          {renderColumn(2025, column2025X, column2025Width, sortedRows, focusedKey, setFocusedKey)}
        </g>
        <text
          x={PLOT_LEFT + column2020Width / 2}
          y={chartHeight - 12}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted)"
        >
          February 2020 · {formatCount(EMPLOYMENT_TOTAL_2020)} employees
        </text>
        <text
          x={column2025X + column2025Width / 2}
          y={chartHeight - 12}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-muted)"
        >
          February 2025 · {formatCount(EMPLOYMENT_TOTAL_2025)} employees
        </text>
      </svg>
      <ChartDataTable
        summary="View employee counts by industry as a table"
        columns={tableColumns}
        rows={rows}
      />
    </figure>
  );
}

function renderColumn(
  year: 2020 | 2025,
  x: number,
  width: number,
  sortedRows: readonly EmploymentIndustryRow[],
  focusedKey: string | undefined,
  setFocusedKey: (key: string | undefined) => void,
): React.ReactElement {
  const total = year === 2020 ? EMPLOYMENT_TOTAL_2020 : EMPLOYMENT_TOTAL_2025;
  const yearLabel = year === 2020 ? 'February 2020' : 'February 2025';
  let y = PLOT_TOP;
  return (
    <g key={year}>
      {sortedRows.map((row, index) => {
        const employees = year === 2020 ? row.employees2020 : row.employees2025;
        const height = (employees / total) * PLOT_HEIGHT;
        const block = (
          <rect
            key={row.key}
            x={x}
            y={y}
            width={width}
            height={Math.max(height, 0.5)}
            fill={INDUSTRY_COLORS[index % INDUSTRY_COLORS.length]}
            stroke="#ffffff"
            strokeWidth={0.4}
            opacity={focusedKey === undefined || focusedKey === row.key ? 1 : 0.35}
            onMouseEnter={() => setFocusedKey(row.key)}
            onMouseLeave={() => setFocusedKey(undefined)}
          >
            <title>{`${row.name}: ${formatCount(employees)} employees (${(
              (employees / total) *
              100
            ).toFixed(1)}%), ${yearLabel}`}</title>
          </rect>
        );
        y += height;
        return block;
      })}
    </g>
  );
}
