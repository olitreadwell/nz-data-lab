'use client';

import { Area, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatHectares } from '@/lib/format';
import type { HorticultureSeriesPoint } from '@/lib/horticulture-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';
import { EmojiActiveDot, SeriesTooltip } from './chart-utils';
import type { ChartSeriesDef } from './chart-utils';

interface HorticultureChartProps {
  points: HorticultureSeriesPoint[];
}

const SERIES: ChartSeriesDef[] = [
  { key: 'wineGrapes', label: 'Wine grapes', emoji: '🍇', color: '#a855f7' },
  { key: 'kiwifruit', label: 'Kiwifruit', emoji: '🥝', color: '#22c55e' },
  { key: 'apples', label: 'Apples', emoji: '🍎', color: '#ef4444' },
  { key: 'avocados', label: 'Avocados', emoji: '🥑', color: '#84cc16' },
];

export function HorticultureChart({ points }: HorticultureChartProps): React.ReactElement {
  const firstYear = points[0]?.year;
  const lastYear = points[points.length - 1]?.year;
  const label =
    points.length === 0
      ? 'Horticulture area over time'
      : `Horticulture area, ${firstYear ?? ''} to ${lastYear ?? ''}: wine grapes overtook every other crop`;
  const tableColumns: ChartDataColumn<HorticultureSeriesPoint>[] = [
    { key: 'year', header: 'Year' },
    ...SERIES.map((definition) => ({
      key: definition.key as keyof HorticultureSeriesPoint,
      header: definition.label,
      format: formatHectares,
    })),
  ];

  if (points.length === 0) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 720 260" className="h-auto w-full">
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
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            role="img"
            aria-label={label}
            data={points}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="wineGrapesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <YAxis
              width={56}
              tickLine={false}
              axisLine={false}
              domain={['dataMin', 'dataMax']}
              padding={{ top: 16, bottom: 8 }}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={formatHectares}
            />
            <Tooltip
              content={(props) => (
                <SeriesTooltip
                  {...props}
                  series={SERIES}
                  formatValue={formatHectares}
                  testId="horticulture-tooltip"
                />
              )}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="wineGrapes"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#wineGrapesFill)"
              dot={false}
              activeDot={<EmojiActiveDot emoji="🍇" />}
            />
            {SERIES.filter((definition) => definition.key !== 'wineGrapes').map((definition) => (
              <Line
                key={definition.key}
                type="monotone"
                dataKey={definition.key}
                stroke={definition.color}
                strokeWidth={2}
                dot={false}
                activeDot={<EmojiActiveDot emoji={definition.emoji} />}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View horticulture area as a table"
        columns={tableColumns}
        rows={points}
      />
    </div>
  );
}
