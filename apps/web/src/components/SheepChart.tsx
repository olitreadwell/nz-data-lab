'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { SheepSeriesPoint } from '@/lib/sheep-data';
import { formatMillions } from '@/lib/sheep-format';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';

interface SheepChartProps {
  points: SheepSeriesPoint[];
}

const ACTIVE_DOT_FONT_SIZE = 18;

/** Active point marker: a sheep emoji instead of a plain dot. */
function SheepActiveDot({ cx, cy }: { cx?: number; cy?: number }): React.ReactElement {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={ACTIVE_DOT_FONT_SIZE}
      pointerEvents="none"
      aria-hidden="true"
    >
      🐑
    </text>
  );
}

/** Tooltip shown while hovering (mouse) or scrubbing (touch) the chart. */
function SheepTooltip({ active, label, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const value = payload[0]?.value;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return (
    <div
      data-testid="sheep-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{label}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">{formatMillions(value)}</p>
    </div>
  );
}

export function SheepChart({ points }: SheepChartProps): React.ReactElement {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sheepValues = points.map((point) => point.sheep);
  const minSheep = Math.min(...sheepValues);
  const maxSheep = Math.max(...sheepValues);
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;

  const label =
    points.length === 0
      ? 'Sheep numbers over time'
      : `Sheep numbers, ${firstYear ?? ''} to ${lastYear ?? ''}: peaked at ${Math.round(maxSheep).toLocaleString()} and fell to ${Math.round(minSheep).toLocaleString()}`;

  if (points.length === 0) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 720 240" className="h-auto w-full">
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <div className="h-[clamp(180px,28vh,300px)]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          role="img"
          aria-label={label}
          data={points}
          margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
        >
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
            tickFormatter={(value: number) => `${Math.round(value / 1000000)}m`}
          />
          <Tooltip
            content={SheepTooltip}
            cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
          />
          <Line
            type="monotone"
            dataKey="sheep"
            isAnimationActive={!prefersReducedMotion}
            stroke="var(--color-fg)"
            strokeWidth={2}
            dot={false}
            activeDot={<SheepActiveDot />}
          />
        </LineChart>
      </ResponsiveContainer>
      <ChartDataTable
        summary="View sheep numbers as a table"
        columns={[
          { key: 'year', header: 'Year' },
          { key: 'sheep', header: 'Sheep', format: formatMillions },
        ]}
        rows={points}
      />
    </div>
  );
}
