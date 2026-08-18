'use client';

import { useMemo, useState } from 'react';

import {
  COMPANY_SIZE_BANDS,
  COMPANY_SIZE_INDUSTRY_ROWS,
  NATIONAL_EMPLOYEE_COUNT,
  NATIONAL_EMPLOYEE_TOTAL,
  NATIONAL_ENTERPRISE_TOTAL,
  NATIONAL_ENTERPRISES,
} from '@/lib/company-size-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 440;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 52;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const BAR_GAP = 14;
const BAR_COLOR = '#d97706';
const CUMULATIVE_COLOR = '#be123c';

type Measure = 'enterprises' | 'employeeCount';

const MEASURE_LABELS: Record<Measure, string> = {
  enterprises: 'enterprises',
  employeeCount: 'paid employees',
};

interface ParetoRow {
  name: string;
  values: number[];
  total: number;
}

function formatBandSummary(
  row: ParetoRow,
  measure: Measure,
  bandIndex: number,
  cumulativePercent: number,
): string {
  const band = COMPANY_SIZE_BANDS[bandIndex] ?? '';
  const value = row.values[bandIndex] ?? 0;
  const share = Math.round((value / row.total) * 1000) / 10;
  return `${row.name}: ${value.toLocaleString('en-NZ')} ${MEASURE_LABELS[measure]} with ${band} employees (${share}% of the total), cumulative ${cumulativePercent}%.`;
}

/**
 * Enterprises by employment size group, drawn as a Pareto chart: the bars
 * fall steeply from the no-employee majority to the 100+ giants while the
 * cumulative line climbs. Pick an industry to reshape the bars, or switch
 * the measure from enterprises to paid employees. Source: Stats NZ business
 * demography statistics, February 2025 (Table 1).
 */
export function CompanySizePareto(): React.ReactElement {
  const [measure, setMeasure] = useState<Measure>('enterprises');
  const [industry, setIndustry] = useState<string>('All industries');
  const [hoveredBand, setHoveredBand] = useState<number | null>(null);

  const rows = useMemo<ParetoRow[]>(
    () => [
      {
        name: 'All industries',
        values: measure === 'enterprises' ? NATIONAL_ENTERPRISES : NATIONAL_EMPLOYEE_COUNT,
        total: measure === 'enterprises' ? NATIONAL_ENTERPRISE_TOTAL : NATIONAL_EMPLOYEE_TOTAL,
      },
      ...COMPANY_SIZE_INDUSTRY_ROWS.map((row) => ({
        name: row.name,
        values: measure === 'enterprises' ? row.enterprises : row.employeeCount,
        total: measure === 'enterprises' ? row.totalEnterprises : row.totalEmployees,
      })),
    ],
    [measure],
  );

  const selectedRow = rows.find((row) => row.name === industry);
  if (selectedRow === undefined) {
    throw new Error(`Unknown industry: ${industry}`);
  }
  const total = selectedRow.total;

  const maxValue = Math.max(...selectedRow.values);
  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const plotHeight = SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
  const bandWidth = plotWidth / COMPANY_SIZE_BANDS.length;
  const barWidth = bandWidth - BAR_GAP;

  let runningTotal = 0;
  const cumulativeShares = selectedRow.values.map((value) => {
    runningTotal += value;
    return total === 0 ? 0 : (runningTotal / total) * 100;
  });

  const xForBand = (index: number): number => PLOT_LEFT + bandWidth * index + bandWidth / 2;
  const yForValue = (value: number): number =>
    maxValue === 0
      ? PLOT_TOP + plotHeight
      : PLOT_TOP + plotHeight - (value / maxValue) * plotHeight;

  const hoveredShare = hoveredBand === null ? undefined : cumulativeShares[hoveredBand];

  const tableRows = useMemo(
    () =>
      selectedRow.values.map((value, index) => ({
        band: COMPANY_SIZE_BANDS[index] ?? '',
        value,
        share: total === 0 ? 0 : (value / total) * 100,
        cumulative: cumulativeShares[index] ?? 0,
      })),
    [selectedRow, total, cumulativeShares],
  );

  const tableColumns: ChartDataColumn<{
    band: string;
    value: number;
    share: number;
    cumulative: number;
  }>[] = [
    { key: 'band', header: 'Employee count size group' },
    {
      key: 'value',
      header: measure === 'enterprises' ? 'Enterprises' : 'Paid employees',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    { key: 'share', header: 'Share', format: (value) => `${Number(value).toFixed(1)}%` },
    {
      key: 'cumulative',
      header: 'Cumulative share',
      format: (value) => `${Number(value).toFixed(1)}%`,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1">
          <button
            type="button"
            onClick={() => setMeasure('enterprises')}
            aria-pressed={measure === 'enterprises'}
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            Enterprises
          </button>
          <button
            type="button"
            onClick={() => setMeasure('employeeCount')}
            aria-pressed={measure === 'employeeCount'}
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            Paid employees
          </button>
        </div>
        <label
          htmlFor="company-size-industry"
          className="numeral-paragraph-sm text-[var(--color-muted)]"
        >
          Industry
        </label>
        <select
          id="company-size-industry"
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-fg)]"
        >
          {rows.map((row) => (
            <option key={row.name} value={row.name}>
              {row.name}
            </option>
          ))}
        </select>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {hoveredBand === null || hoveredShare === undefined
            ? `${selectedRow.name}: ${total.toLocaleString('en-NZ')} ${MEASURE_LABELS[measure]} across all size groups.`
            : formatBandSummary(selectedRow, measure, hoveredBand, Math.round(hoveredShare))}
        </p>
      </div>
      <div
        role="img"
        aria-label={`${MEASURE_LABELS[measure]} by employment size group for ${selectedRow.name}, with cumulative share`}
        className="h-[440px]"
      >
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-full w-full">
          {Array.from({ length: 5 }, (_, index) => {
            const fraction = index / 4;
            const value = Math.round((maxValue * fraction) / 1000) * 1000;
            const y = yForValue(value);
            return (
              <g key={index}>
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
                  {value.toLocaleString('en-NZ')}
                </text>
              </g>
            );
          })}
          {COMPANY_SIZE_BANDS.map((band, index) => {
            const value = selectedRow.values[index] ?? 0;
            const x = xForBand(index);
            const barX = x - barWidth / 2;
            const barY = yForValue(value);
            const isHovered = hoveredBand === index;
            return (
              <g key={band}>
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={Math.max(PLOT_TOP + plotHeight - barY, 0)}
                  fill={BAR_COLOR}
                  fillOpacity={isHovered ? 1 : 0.85}
                  rx="2"
                  onMouseEnter={() => setHoveredBand(index)}
                  onMouseLeave={() => setHoveredBand(null)}
                  onFocus={() => setHoveredBand(index)}
                  onBlur={() => setHoveredBand(null)}
                  tabIndex={0}
                >
                  <title>{`${band} employees: ${value.toLocaleString('en-NZ')}`}</title>
                </rect>
                <text
                  x={x}
                  y={SVG_HEIGHT - PLOT_BOTTOM + 18}
                  textAnchor="middle"
                  className="fill-[var(--color-muted)] text-xs"
                >
                  {band}
                </text>
                <line
                  x1={x}
                  x2={x}
                  y1={PLOT_TOP + plotHeight}
                  y2={PLOT_TOP + plotHeight + 4}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
              </g>
            );
          })}
          <polyline
            points={cumulativeShares
              .map((share, index) => `${xForBand(index)},${yForValue((share / 100) * maxValue)}`)
              .join(' ')}
            fill="none"
            stroke={CUMULATIVE_COLOR}
            strokeWidth="2"
          />
          {cumulativeShares.map((share, index) => (
            <circle
              key={index}
              cx={xForBand(index)}
              cy={yForValue((share / 100) * maxValue)}
              r="3"
              fill={CUMULATIVE_COLOR}
            />
          ))}
        </svg>
      </div>
      <p className="numeral-paragraph-sm mt-2 text-[var(--color-muted)]">
        Bars show {MEASURE_LABELS[measure]}; the red line is the cumulative share of the total.
      </p>
      <ChartDataTable
        summary="Show the data behind the chart"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
