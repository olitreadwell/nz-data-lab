'use client';

import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatMillions } from '@/lib/format';
import type { LivestockSeriesPoint } from '@/lib/livestock-data';

import { EmojiActiveDot, SeriesTooltip } from './chart-utils';
import type { ChartSeriesDef } from './chart-utils';

interface LivestockChartProps {
  points: LivestockSeriesPoint[];
}

const SERIES: ChartSeriesDef[] = [
  { key: 'sheep', label: 'Sheep', emoji: '🐑', color: '#f59e0b' },
  { key: 'dairyCattle', label: 'Dairy cattle', emoji: '🐄', color: '#0ea5e9' },
  { key: 'beefCattle', label: 'Beef cattle', emoji: '🐂', color: '#f43f5e' },
  { key: 'deer', label: 'Deer', emoji: '🦌', color: '#8b5cf6' },
];

function formatAxisTick(value: number): string {
  return `${Math.round(value / 1000000)}m`;
}

export function LivestockChart({ points }: LivestockChartProps): React.ReactElement {
  const [sheepVisible, setSheepVisible] = useState(true);
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const label =
    points.length === 0
      ? 'Livestock numbers over time'
      : sheepVisible
        ? `Livestock numbers, ${firstYear ?? ''} to ${lastYear ?? ''}: sheep fell while dairy cattle rose`
        : `Livestock numbers, ${firstYear ?? ''} to ${lastYear ?? ''}: dairy cattle, beef cattle, and deer`;

  const visibleSeries = sheepVisible
    ? SERIES
    : SERIES.filter((definition) => definition.key !== 'sheep');
  const chartPoints = sheepVisible
    ? points
    : points.map((point) => ({
        year: point.year,
        dairyCattle: point.dairyCattle,
        beefCattle: point.beefCattle,
        deer: point.deer,
      }));

  if (points.length === 0) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 720 260" className="h-auto w-full">
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {visibleSeries.map((definition) => (
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
        <button
          type="button"
          onClick={() => setSheepVisible((visible) => !visible)}
          aria-pressed={!sheepVisible}
          className="numeral-paragraph-sm rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          {sheepVisible ? 'Hide sheep' : 'Show sheep'}
        </button>
      </div>
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            role="img"
            aria-label={label}
            data={chartPoints}
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
              tickFormatter={formatAxisTick}
            />
            <Tooltip
              content={(props) => (
                <SeriesTooltip
                  {...props}
                  series={visibleSeries}
                  formatValue={formatMillions}
                  testId="livestock-tooltip"
                />
              )}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            {visibleSeries.map((definition) => (
              <Line
                key={definition.key}
                type="monotone"
                dataKey={definition.key}
                stroke={definition.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={<EmojiActiveDot emoji={definition.emoji} />}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
