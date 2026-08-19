'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const DAY_OPTIONS = [30, 60, 90] as const;
const DEFAULT_DAYS = 90;
const MAX_DEPTH_KM = 700;
const MAX_MAGNITUDE = 8.5;
const DEPTH_BANDS = [
  { label: '0-40 km', low: 0, high: 40 },
  { label: '40-100 km', low: 40, high: 100 },
  { label: '100-300 km', low: 100, high: 300 },
  { label: '300-700 km', low: 300, high: 700 },
] as const;

interface DepthPoint {
  magnitude: number;
  depthKm: number;
}

interface DepthBandRow {
  label: string;
  count: number;
  sharePercent: number;
}

function formatDepth(value: number): string {
  return `${value.toLocaleString('en-NZ')} km`;
}

function DepthTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const point = payload[0]?.payload as DepthPoint | undefined;
  if (point === undefined) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
        Magnitude {point.magnitude.toFixed(1)}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {formatDepth(point.depthKm)} deep
      </p>
    </div>
  );
}

/** Builds the depth-band summary rows for the current time window. */
export function buildDepthBands(events: QuakeCatalogEvent[], maxDays: number): DepthBandRow[] {
  const cutoff = Date.now() / 1000 - maxDays * 24 * 60 * 60;
  const inWindow = events.filter((event) => event.timeEpochSec >= cutoff);
  return DEPTH_BANDS.map((band) => {
    const count = inWindow.filter(
      (event) => event.depthKm >= band.low && event.depthKm < band.high,
    ).length;
    const sharePercent = inWindow.length === 0 ? 0 : Math.round((count / inWindow.length) * 100);
    return { label: band.label, count, sharePercent };
  });
}

/**
 * Recent GeoNet catalog earthquakes plotted by magnitude and depth. Depth
 * runs down the chart, so the shallow quakes sit at the top. Narrow the
 * time window with the day buttons and hover a dot to read its values.
 */
export function QuakeDepthScatter({ events }: { events: QuakeCatalogEvent[] }): React.ReactElement {
  const [maxDays, setMaxDays] = useState<number>(DEFAULT_DAYS);

  const points = useMemo(() => {
    const cutoff = Date.now() / 1000 - maxDays * 24 * 60 * 60;
    return events
      .filter((event) => event.timeEpochSec >= cutoff)
      .map((event) => ({ magnitude: event.magnitude, depthKm: event.depthKm }));
  }, [events, maxDays]);

  const bands = useMemo(() => buildDepthBands(events, maxDays), [events, maxDays]);

  const chartLabel = `Earthquakes of magnitude 1 or stronger by magnitude and depth, last ${maxDays} days, ${points.length} quakes`;

  const tableColumns: ChartDataColumn<DepthBandRow>[] = [
    { key: 'label', header: 'Depth band' },
    { key: 'count', header: 'Quakes', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'sharePercent', header: 'Share', format: (value) => `${value}%` },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {points.length.toLocaleString('en-NZ')} {points.length === 1 ? 'quake' : 'quakes'} in the
        last {maxDays} days.
      </p>
      <div className="mb-3 flex items-end gap-1">
        {DAY_OPTIONS.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setMaxDays(days)}
            aria-pressed={maxDays === days}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            {days} days
          </button>
        ))}
      </div>
      <div role="img" aria-label={chartLabel} className="h-[clamp(200px,28vh,300px)]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
            <XAxis
              type="number"
              dataKey="magnitude"
              name="Magnitude"
              domain={[0, MAX_MAGNITUDE]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="depthKm"
              name="Depth"
              reversed
              domain={[0, MAX_DEPTH_KM]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <Tooltip content={(props) => <DepthTooltip {...props} />} />
            <Scatter data={points} fill="#D55E00" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View the quakes by depth band as a table"
        columns={tableColumns}
        rows={bands}
      />
    </div>
  );
}
