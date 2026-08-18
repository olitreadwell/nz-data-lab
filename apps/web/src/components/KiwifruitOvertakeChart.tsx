'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { formatHectares } from '@/lib/format';
import type { HorticultureSeriesPoint } from '@/lib/horticulture-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

interface KiwifruitOvertakeChartProps {
  points: HorticultureSeriesPoint[];
}

interface BeforeAfterDatum {
  crop: string;
  emoji: string;
  firstYear: number;
  latestYear: number;
  first: number;
  latest: number;
}

const FIRST_BAR_COLOR = '#f59e0b';
const LATEST_BAR_COLOR = '#22c55e';
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];
const BAR_GAP = 4;
const CURSOR_OPACITY = 0.2;

function buildBeforeAfterData(points: HorticultureSeriesPoint[]): BeforeAfterDatum[] {
  const first = points[0];
  const latest = points[points.length - 1];
  if (first === undefined || latest === undefined) {
    return [];
  }
  return [
    {
      crop: 'Kiwifruit',
      emoji: '🥝',
      firstYear: first.year,
      latestYear: latest.year,
      first: first.kiwifruit,
      latest: latest.kiwifruit,
    },
    {
      crop: 'Apples',
      emoji: '🍎',
      firstYear: first.year,
      latestYear: latest.year,
      first: first.apples,
      latest: latest.apples,
    },
    {
      crop: 'Avocados',
      emoji: '🥑',
      firstYear: first.year,
      latestYear: latest.year,
      first: first.avocados,
      latest: latest.avocados,
    },
  ];
}

function formatAxisTick(value: number): string {
  return `${Math.round(value / 1000)}k`;
}

function BeforeAfterTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as BeforeAfterDatum | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="kiwifruit-overtake-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
        {datum.emoji} {datum.crop}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.firstYear}: {formatHectares(datum.first)}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.latestYear}: {formatHectares(datum.latest)}
      </p>
    </div>
  );
}

/**
 * Before-and-after bars for the orchard crops: the first year of the series
 * against the latest, so the kiwifruit overtake of apples reads at a glance.
 */
export function KiwifruitOvertakeChart({
  points,
}: KiwifruitOvertakeChartProps): React.ReactElement {
  const data = buildBeforeAfterData(points);
  const firstYear = points[0]?.year;
  const latestYear = points[points.length - 1]?.year;
  const label =
    data.length === 0
      ? 'Orchard area before and after'
      : `Orchard area, ${firstYear ?? ''} and ${latestYear ?? ''}: kiwifruit overtook apples`;
  const tableColumns: ChartDataColumn<BeforeAfterDatum>[] = [
    { key: 'crop', header: 'Crop' },
    {
      key: 'first',
      header: firstYear === undefined ? '' : String(firstYear),
      format: (value) => formatHectares(Number(value)),
    },
    {
      key: 'latest',
      header: latestYear === undefined ? '' : String(latestYear),
      format: (value) => formatHectares(Number(value)),
    },
  ];

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
        <li className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ backgroundColor: FIRST_BAR_COLOR }}
            aria-hidden="true"
          />
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">{firstYear}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ backgroundColor: LATEST_BAR_COLOR }}
            aria-hidden="true"
          />
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">{latestYear}</span>
        </li>
      </ul>
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            role="img"
            aria-label={label}
            data={data}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
            barGap={BAR_GAP}
          >
            <XAxis
              dataKey="crop"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <YAxis
              width={36}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              tickFormatter={formatAxisTick}
            />
            <Tooltip
              content={(props) => <BeforeAfterTooltip {...props} />}
              cursor={{ fill: 'var(--color-border)', opacity: CURSOR_OPACITY }}
            />
            <Bar dataKey="first" fill={FIRST_BAR_COLOR} radius={BAR_RADIUS} />
            <Bar dataKey="latest" fill={LATEST_BAR_COLOR} radius={BAR_RADIUS} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View orchard areas as a table"
        columns={tableColumns}
        rows={data}
      />
    </div>
  );
}
