'use client';

import { useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';
import { buildQuakeMonthBins, summarizeQuakeMonths } from '@/lib/quake-month-data';
import type { QuakeMonthBin } from '@/lib/quake-month-data';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const MAGNITUDE_OPTIONS = [3, 4, 5] as const;
const DEFAULT_MAGNITUDE = 3;
const ROSE_COLOR = '#be123c';

type YearFilter = number | 'all';

/** Tooltip shown while hovering a month wedge of the rose. */
function MonthTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const bin = payload[0]?.payload as QuakeMonthBin | undefined;
  if (bin === undefined) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{bin.label}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {bin.count.toLocaleString('en-NZ')} quakes
      </p>
    </div>
  );
}

/**
 * Earthquakes of magnitude 3 or stronger by calendar month, drawn as a
 * radial rose so the seasonal pattern reads at a glance. Filter by year and
 * by magnitude floor. Data is fetched at build time from GeoNet's FDSN
 * event service, falling back to a committed snapshot.
 * @param root0 - the component props
 * @param root0.events - the catalog events to chart
 * @returns the rose chart with its filters and data table
 */
export function QuakeMonthRose({ events }: { events: QuakeCatalogEvent[] }): React.ReactElement {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [year, setYear] = useState<YearFilter>('all');
  const [minMagnitude, setMinMagnitude] = useState<number>(DEFAULT_MAGNITUDE);

  const years = useMemo(() => {
    const found = new Set<number>();
    for (const event of events) {
      found.add(new Date(event.timeEpochSec * 1000).getUTCFullYear());
    }
    return [...found].sort();
  }, [events]);

  const activeYear: YearFilter = year === 'all' || years.includes(year) ? year : 'all';

  const bins = useMemo(
    () => buildQuakeMonthBins(events, activeYear, minMagnitude),
    [events, activeYear, minMagnitude],
  );
  const summary = useMemo(() => summarizeQuakeMonths(bins), [bins]);

  const chartLabel = `Earthquakes of magnitude ${minMagnitude} or stronger by month${
    activeYear === 'all' ? '' : ` in ${activeYear}`
  }, ${summary.total} quakes`;

  const tableColumns: ChartDataColumn<QuakeMonthBin>[] = [
    { key: 'label', header: 'Month' },
    { key: 'count', header: 'Quakes', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {summary.total.toLocaleString('en-NZ')} quakes of magnitude {minMagnitude} or stronger
        {activeYear === 'all' ? '' : ` in ${activeYear}`}. Busiest month: {summary.busiest.label} (
        {summary.busiest.count.toLocaleString('en-NZ')}). Quietest: {summary.quietest.label} (
        {summary.quietest.count.toLocaleString('en-NZ')}).
      </p>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="flex items-end gap-1">
          {(['all', ...years] as YearFilter[]).map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => setYear(option)}
              aria-pressed={activeYear === option}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
            >
              {option === 'all' ? 'All years' : String(option)}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-1">
          {MAGNITUDE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMinMagnitude(option)}
              aria-pressed={minMagnitude === option}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
            >
              M{option}+
            </button>
          ))}
        </div>
      </div>
      <div role="img" aria-label={chartLabel} className="h-[260px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={bins}
            innerRadius="18%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarGrid stroke="var(--color-muted)" />
            <PolarAngleAxis
              type="category"
              dataKey="label"
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            />
            <Tooltip content={(props) => <MonthTooltip {...props} />} />
            <RadialBar
              dataKey="count"
              fill={ROSE_COLOR}
              cornerRadius={2}
              isAnimationActive={!prefersReducedMotion}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View the quakes by month as a table"
        columns={tableColumns}
        rows={bins}
      />
    </div>
  );
}
