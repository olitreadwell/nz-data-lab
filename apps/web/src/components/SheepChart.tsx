'use client';

import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { SheepSeriesPoint } from '@/lib/sheep-data';
import { formatMillions } from '@/lib/sheep-format';

import { withLeadMainSplit } from './chart-utils';

interface SheepChartProps {
  points: SheepSeriesPoint[];
  /**
   * Year of a spliced-in earlier data point (e.g. 1990), if `points[0]` is
   * one. When set, the segment from that point to the next one is rendered
   * dashed to signal it's a single historical citation, not annual data.
   */
  historicalAnchorYear?: number;
}

const CHART_HEIGHT = 240;
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
  const entry = payload.find((item) => typeof item.value === 'number');
  if (entry === undefined || typeof entry.value !== 'number') {
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
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">{formatMillions(entry.value)}</p>
    </div>
  );
}

export function SheepChart({ points, historicalAnchorYear }: SheepChartProps): React.ReactElement {
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

  const boundaryYear =
    historicalAnchorYear !== undefined && firstYear === historicalAnchorYear
      ? points[1]?.year
      : undefined;
  const chartData = withLeadMainSplit(points, ['sheep'], boundaryYear);

  return (
    <LineChart
      width="100%"
      height={CHART_HEIGHT}
      responsive
      role="img"
      title={label}
      data={chartData}
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
      {boundaryYear !== undefined && (
        <Line
          type="monotone"
          dataKey="sheepLead"
          stroke="var(--color-muted)"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
      )}
      <Line
        type="monotone"
        dataKey={boundaryYear !== undefined ? 'sheepMain' : 'sheep'}
        stroke="var(--color-fg)"
        strokeWidth={2}
        dot={false}
        connectNulls
        activeDot={<SheepActiveDot />}
      />
    </LineChart>
  );
}
