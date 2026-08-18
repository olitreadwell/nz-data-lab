'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { RabbitSpotlightPoint } from '@/lib/rabbit-data';
import { formatRabbitCount, formatRabbitsPerKm } from '@/lib/rabbit-format';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

interface RabbitChartProps {
  points: RabbitSpotlightPoint[];
}

const RABBIT_COLOR = '#10b981';

/** Tooltip shown while hovering (mouse) or scrubbing (touch) the chart. */
function RabbitTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const point = payload[0]?.payload as RabbitSpotlightPoint | undefined;
  if (point === undefined) {
    return null;
  }
  return (
    <div
      data-testid="rabbit-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{point.year}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        🐇 {formatRabbitsPerKm(point.rabbitsPerKm)} ({formatRabbitCount(point.rabbits)} rabbits over{' '}
        {point.km.toFixed(0)} km, {point.sites} sites)
      </p>
    </div>
  );
}

/**
 * Hawke's Bay rabbit spotlight counts, pooled across the monitored farm
 * sites and drawn as bars so the fivefold rise reads at a glance.
 */
export function RabbitChart({ points }: RabbitChartProps): React.ReactElement {
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const firstRate = points[0]?.rabbitsPerKm;
  const lastRate = points[points.length - 1]?.rabbitsPerKm;
  const label =
    points.length === 0
      ? 'Rabbit spotlight counts over time'
      : `Hawke's Bay rabbit spotlight counts, ${firstYear ?? ''} to ${lastYear ?? ''}: rabbits per kilometre rose from ${firstRate?.toFixed(2) ?? ''} to ${lastRate?.toFixed(2) ?? ''}`;

  const tableColumns: ChartDataColumn<RabbitSpotlightPoint>[] = [
    { key: 'year', header: 'Year' },
    { key: 'rabbitsPerKm', header: 'Rabbits per km', format: formatRabbitsPerKm },
    { key: 'sites', header: 'Sites' },
    { key: 'rabbits', header: 'Rabbits seen', format: formatRabbitCount },
    { key: 'km', header: 'Km driven', format: (value) => value.toFixed(0) },
  ];

  if (points.length === 0) {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 720 240"
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
          <BarChart
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
              domain={[0, 'dataMax']}
              padding={{ top: 16, bottom: 8 }}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={(value: number) => value.toFixed(0)}
            />
            <Tooltip
              content={(props) => <RabbitTooltip {...props} />}
              cursor={{ fill: 'var(--color-border)', opacity: 0.2 }}
            />
            <Bar dataKey="rabbitsPerKm" fill={RABBIT_COLOR} radius={[3, 3, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View rabbit spotlight counts as a table"
        columns={tableColumns}
        rows={points}
      />
    </div>
  );
}
