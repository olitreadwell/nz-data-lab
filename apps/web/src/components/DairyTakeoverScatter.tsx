'use client';

import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { formatMillions } from '@/lib/format';
import type { LivestockSeriesPoint } from '@/lib/livestock-data';

interface DairyTakeoverScatterProps {
  points: LivestockSeriesPoint[];
}

interface ScatterDatum {
  year: number;
  sheep: number;
  dairyCattle: number;
  total: number;
  decade: string;
}

const DECADE_COLORS: Record<string, string> = {
  '1990': '#38bdf8',
  '2000': '#0ea5e9',
  '2010': '#6366f1',
  '2020': '#8b5cf6',
};

const BUBBLE_RANGE: [number, number] = [40, 200];
const BUBBLE_FILL_OPACITY = 0.7;

function decadeOf(year: number): string {
  return String(Math.floor(year / 10) * 10);
}

function buildScatterData(points: LivestockSeriesPoint[]): ScatterDatum[] {
  return points.map((point) => ({
    year: point.year,
    sheep: point.sheep,
    dairyCattle: point.dairyCattle,
    total: point.sheep + point.dairyCattle + point.beefCattle + point.deer,
    decade: decadeOf(point.year),
  }));
}

function formatAxisTick(value: number): string {
  return `${Math.round(value / 1000000)}m`;
}

function ScatterTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as ScatterDatum | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="dairy-scatter-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{datum.year}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        🐑 Sheep: {formatMillions(datum.sheep)}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        🐄 Dairy cattle: {formatMillions(datum.dairyCattle)}
      </p>
    </div>
  );
}

/**
 * Plots the same livestock years as a path: each bubble is one year, with
 * sheep on the vertical axis and dairy cattle on the horizontal. Colour
 * shows the decade and bubble size shows total livestock, so the flip from
 * wool to milk reads as a single diagonal move.
 */
export function DairyTakeoverScatter({ points }: DairyTakeoverScatterProps): React.ReactElement {
  const data = buildScatterData(points);
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const label =
    data.length === 0
      ? 'Sheep against dairy cattle over time'
      : `Sheep against dairy cattle, ${firstYear ?? ''} to ${lastYear ?? ''}: each bubble is one year, moving from wool to milk`;

  if (data.length === 0) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 720 260" className="h-auto w-full">
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <div>
      <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(DECADE_COLORS).map(([decade, color]) => (
          <li key={decade} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="numeral-paragraph-sm text-[var(--color-muted)]">{decade}s</span>
          </li>
        ))}
      </ul>
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            role="img"
            aria-label={label}
            data={data}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="dairyCattle"
              type="number"
              name="Dairy cattle"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={formatAxisTick}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              dataKey="sheep"
              type="number"
              name="Sheep"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={formatAxisTick}
              domain={['dataMin', 'dataMax']}
              width={36}
            />
            <ZAxis dataKey="total" range={BUBBLE_RANGE} />
            <Tooltip
              content={(props) => <ScatterTooltip {...props} />}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            {Object.entries(DECADE_COLORS).map(([decade, color]) => (
              <Scatter
                key={decade}
                data={data.filter((datum) => datum.decade === decade)}
                fill={color}
                fillOpacity={BUBBLE_FILL_OPACITY}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
