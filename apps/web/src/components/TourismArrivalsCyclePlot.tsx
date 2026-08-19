'use client';

import { useMemo, useState } from 'react';

import { TOURISM_ARRIVALS_YEARS, TOURISM_MONTHS } from '@/lib/tourism-arrivals-data';
import type { TourismArrivalsYear } from '@/lib/tourism-arrivals-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 440;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 24;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const MAX_ARRIVALS = 600000;

const YEAR_COLORS: Record<number, string> = {
  2017: '#CC79A7',
  2018: '#E69F00',
  2019: '#D55E00',
  2023: '#56B4E9',
  2024: '#0072B2',
  2025: '#009E73',
};

interface MonthPoint {
  month: string;
  arrivals: number | null;
}

function yearPoints(yearRow: TourismArrivalsYear): MonthPoint[] {
  return TOURISM_MONTHS.map((month, index) => ({
    month,
    arrivals: yearRow.arrivals[index] ?? null,
  }));
}

function hasValue(point: MonthPoint): point is MonthPoint & { arrivals: number } {
  return point.arrivals !== null;
}

function pointsWithValues(yearRow: TourismArrivalsYear): Array<MonthPoint & { arrivals: number }> {
  return yearPoints(yearRow).filter(hasValue);
}

function formatYearSummary(yearRow: TourismArrivalsYear): string {
  const points = pointsWithValues(yearRow);
  const first = points[0];
  if (first === undefined) {
    return `${yearRow.year}: no data.`;
  }
  let peak = first;
  let trough = first;
  for (const point of points) {
    if (point.arrivals > peak.arrivals) {
      peak = point;
    }
    if (point.arrivals < trough.arrivals) {
      trough = point;
    }
  }
  return `${yearRow.year}: peak ${peak.month} with ${peak.arrivals.toLocaleString('en-NZ')} visitor arrivals, trough ${trough.month} with ${trough.arrivals.toLocaleString('en-NZ')}.`;
}

/**
 * Monthly overseas visitor arrivals drawn as a cycle plot: one line per year
 * across the twelve months, so the summer peak and winter trough line up
 * month for month. Toggle years on and off; hover a line to read its path.
 * Source: Stats NZ International travel releases (Table 2).
 */
export function TourismArrivalsCyclePlot(): React.ReactElement {
  const [visibleYears, setVisibleYears] = useState<Set<number>>(() => new Set([2018, 2019, 2024]));
  const [highlightedYear, setHighlightedYear] = useState<number | null>(null);

  const toggleYear = (year: number): void => {
    setVisibleYears((previous) => {
      const next = new Set(previous);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const plotHeight = SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
  const xForMonth = (monthIndex: number): number =>
    PLOT_LEFT + (monthIndex / (TOURISM_MONTHS.length - 1)) * plotWidth;
  const yForArrivals = (arrivals: number): number =>
    PLOT_TOP + plotHeight - (arrivals / MAX_ARRIVALS) * plotHeight;

  const highlightedRow = TOURISM_ARRIVALS_YEARS.find((yearRow) => yearRow.year === highlightedYear);

  const tableColumns: ChartDataColumn<{ year: number } & Record<string, number | null>>[] = [
    { key: 'year', header: 'Year' },
    ...TOURISM_MONTHS.map((month) => ({
      key: month,
      header: month,
      format: (value: number | null) => (value === null ? '..' : value.toLocaleString('en-NZ')),
    })),
  ];

  const tableRows = useMemo(
    () =>
      TOURISM_ARRIVALS_YEARS.map((yearRow) => {
        const row: { year: number } & Record<string, number | null> = { year: yearRow.year };
        TOURISM_MONTHS.forEach((month, index) => {
          row[month] = yearRow.arrivals[index] ?? null;
        });
        return row;
      }),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1">
          {TOURISM_ARRIVALS_YEARS.map((yearRow) => {
            const isVisible = visibleYears.has(yearRow.year);
            return (
              <button
                key={yearRow.year}
                type="button"
                onClick={() => toggleYear(yearRow.year)}
                aria-pressed={isVisible}
                className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
              >
                {yearRow.year}
              </button>
            );
          })}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {highlightedRow === undefined
            ? 'Toggle years to compare the summer peak and winter trough month by month.'
            : formatYearSummary(highlightedRow)}
        </p>
      </div>
      <div
        role="img"
        aria-label="Monthly overseas visitor arrivals by year, one line per year"
        className="h-[clamp(320px,44vh,520px)]"
      >
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-full w-full">
          {Array.from({ length: 6 }, (_, index) => {
            const arrivals = (index / 5) * MAX_ARRIVALS;
            const y = yForArrivals(arrivals);
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
                  {Math.round(arrivals / 1000)}k
                </text>
              </g>
            );
          })}
          {TOURISM_MONTHS.map((month, index) => (
            <g key={month}>
              <text
                x={xForMonth(index)}
                y={SVG_HEIGHT - PLOT_BOTTOM + 18}
                textAnchor="middle"
                className="fill-[var(--color-muted)] text-xs"
              >
                {month}
              </text>
              <line
                x1={xForMonth(index)}
                x2={xForMonth(index)}
                y1={PLOT_TOP + plotHeight}
                y2={PLOT_TOP + plotHeight + 4}
                stroke="var(--color-border)"
                strokeWidth="1"
              />
            </g>
          ))}
          {TOURISM_ARRIVALS_YEARS.map((yearRow) => {
            const color = YEAR_COLORS[yearRow.year] ?? '#999999';
            const isVisible = visibleYears.has(yearRow.year);
            const isHighlighted = highlightedYear === yearRow.year;
            const points = yearPoints(yearRow);
            const segments: Array<Array<MonthPoint & { arrivals: number }>> = [];
            let current: Array<MonthPoint & { arrivals: number }> = [];
            points.forEach((point, index) => {
              if (hasValue(point)) {
                current.push(point);
              }
              if (current.length > 0 && (!hasValue(point) || index === points.length - 1)) {
                segments.push(current);
                current = [];
              }
            });
            if (!isVisible) {
              return null;
            }
            return (
              <g
                key={yearRow.year}
                onMouseEnter={() => setHighlightedYear(yearRow.year)}
                onMouseLeave={() => setHighlightedYear(null)}
                onFocus={() => setHighlightedYear(yearRow.year)}
                onBlur={() => setHighlightedYear(null)}
              >
                {segments.map((segment, segmentIndex) => {
                  const linePoints = segment
                    .map((point) => {
                      const monthIndex = (TOURISM_MONTHS as readonly string[]).indexOf(point.month);
                      return `${xForMonth(monthIndex)},${yForArrivals(point.arrivals)}`;
                    })
                    .join(' ');
                  return (
                    <polyline
                      key={segmentIndex}
                      points={linePoints}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHighlighted ? 3 : 1.8}
                      strokeOpacity={isHighlighted ? 1 : 0.75}
                      strokeDasharray={
                        yearRow.year === 2017 || yearRow.year === 2025 ? '5 3' : undefined
                      }
                    />
                  );
                })}
                {pointsWithValues(yearRow).map((point) => {
                  const monthIndex = (TOURISM_MONTHS as readonly string[]).indexOf(point.month);
                  return (
                    <circle
                      key={point.month}
                      cx={xForMonth(monthIndex)}
                      cy={yForArrivals(point.arrivals)}
                      r={isHighlighted ? 4 : 2.5}
                      fill={color}
                    >
                      <title>{`${yearRow.year} ${point.month}: ${point.arrivals.toLocaleString('en-NZ')}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="numeral-paragraph-sm mt-2 text-[var(--color-muted)]">
        Dashed lines are partial years. The 2020 to 2022 years are missing because border
        restrictions broke the series; the 2023 line is December only.
      </p>
      <ChartDataTable
        summary="Show the data behind the chart"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
