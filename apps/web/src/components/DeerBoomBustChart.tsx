'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { formatMillions } from '@/lib/format';
import type { LivestockSeriesPoint } from '@/lib/livestock-data';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

interface DeerBoomBustChartProps {
  points: LivestockSeriesPoint[];
}

const DEER_COLOR = '#CC79A7';
const DEER_GRADIENT_ID = 'deerAreaFill';
const GRADIENT_TOP_OPACITY = 0.4;
const GRADIENT_BOTTOM_OPACITY = 0.05;
const ACTIVE_DOT_RADIUS = 5;

function formatAxisTick(value: number): string {
  const millions = value / 1_000_000;
  const rounded = Math.round(millions * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}m`;
}

function DeerTooltip({ active, label, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const value = payload[0]?.value;
  if (typeof value !== 'number') {
    return null;
  }
  return (
    <div
      data-testid="deer-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{label}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        🦌 Deer: {formatMillions(value)}
      </p>
    </div>
  );
}

/**
 * Filled area for the farmed deer herd, so the rise to the 2004 peak and the
 * long fall since reads as one shape.
 */
export function DeerBoomBustChart({ points }: DeerBoomBustChartProps): React.ReactElement {
  const prefersReducedMotion = usePrefersReducedMotion();
  const data = points.map((point) => ({ year: point.year, deer: point.deer }));
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const label =
    data.length === 0
      ? 'Farmed deer over time'
      : `Farmed deer, ${firstYear ?? ''} to ${lastYear ?? ''}: the herd boomed to 2004, then more than halved`;
  const tableColumns: ChartDataColumn<LivestockSeriesPoint>[] = [
    { key: 'year', header: 'Year' },
    { key: 'deer', header: 'Deer', format: formatMillions },
  ];

  if (data.length === 0) {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 720 260"
        className="mx-auto h-auto max-h-[clamp(320px,46vh,560px)] w-full"
      >
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <div>
      <div className="h-[clamp(200px,30vh,320px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            role="img"
            aria-label={label}
            data={data}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={DEER_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={DEER_COLOR} stopOpacity={GRADIENT_TOP_OPACITY} />
                <stop offset="95%" stopColor={DEER_COLOR} stopOpacity={GRADIENT_BOTTOM_OPACITY} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <YAxis
              width={36}
              tickLine={false}
              axisLine={false}
              domain={['dataMin', 'dataMax']}
              padding={{ top: 16, bottom: 8 }}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip
              content={(props) => <DeerTooltip {...props} />}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="deer"
              isAnimationActive={!prefersReducedMotion}
              stroke={DEER_COLOR}
              strokeWidth={2.5}
              fill={`url(#${DEER_GRADIENT_ID})`}
              activeDot={{ r: ACTIVE_DOT_RADIUS }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View farmed deer numbers as a table"
        columns={tableColumns}
        rows={points}
      />
    </div>
  );
}
