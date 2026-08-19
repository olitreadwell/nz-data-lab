'use client';

import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ForestrySeriesPoint } from '@/lib/forestry-data';
import { formatAreaKm2 } from '@/lib/format';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { EmojiActiveDot, SeriesTooltip } from './chart-utils';
import type { ChartSeriesDef } from './chart-utils';
import { ChartDataTable } from './ChartDataTable';

interface ForestryChartProps {
  points: ForestrySeriesPoint[];
}

const SERIES: ChartSeriesDef[] = [
  { key: 'newPlanting', label: 'New planting', emoji: '🌱', color: '#009E73' },
  { key: 'harvestedArea', label: 'Harvested area', emoji: '🌲', color: '#E69F00' },
];

function formatAxisTick(value: number): string {
  return `${Math.round(value / 1000)}k`;
}

export function ForestryChart({ points }: ForestryChartProps): React.ReactElement {
  const prefersReducedMotion = usePrefersReducedMotion();
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const label =
    points.length === 0
      ? 'Forestry planting and harvest over time'
      : `Forestry planting and harvest, ${firstYear ?? ''} to ${lastYear ?? ''}: new planting collapsed while harvesting kept climbing`;

  if (points.length === 0) {
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
      <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        {SERIES.map((definition) => (
          <li key={definition.key} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: definition.color }}
              aria-hidden="true"
            />
            <span className="numeral-paragraph-sm text-[var(--color-muted)]">
              {definition.emoji} {definition.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="h-[clamp(200px,30vh,320px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            role="img"
            aria-label={label}
            data={points}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="newPlantingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#009E73" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#009E73" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="harvestedAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E69F00" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#E69F00" stopOpacity={0.02} />
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
              content={(props) => (
                <SeriesTooltip
                  {...props}
                  series={SERIES}
                  formatValue={formatAreaKm2}
                  testId="forestry-tooltip"
                />
              )}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            <ReferenceLine
              y={0}
              stroke="var(--color-border)"
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
            <Area
              type="monotone"
              dataKey="newPlanting"
              isAnimationActive={!prefersReducedMotion}
              stroke="#009E73"
              strokeWidth={2.5}
              fill="url(#newPlantingFill)"
              dot={false}
              activeDot={<EmojiActiveDot emoji="🌱" />}
            />
            <Area
              type="monotone"
              dataKey="harvestedArea"
              isAnimationActive={!prefersReducedMotion}
              stroke="#E69F00"
              strokeWidth={2.5}
              fill="url(#harvestedAreaFill)"
              dot={false}
              activeDot={<EmojiActiveDot emoji="🌲" />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View forestry planting and harvest as a table"
        columns={[
          { key: 'year', header: 'Year' },
          { key: 'newPlanting', header: 'New planting', format: formatAreaKm2 },
          { key: 'harvestedArea', header: 'Harvested area', format: formatAreaKm2 },
        ]}
        rows={points}
      />
    </div>
  );
}
