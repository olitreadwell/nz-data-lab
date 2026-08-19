'use client';

import { useMemo, useState } from 'react';
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const MAGNITUDE_FILTERS = [1, 2, 3, 4] as const;
const DEFAULT_MIN_MAGNITUDE = 1;
const DEPTH_BANDS = [
  { label: '0-40 km', low: 0, high: 40 },
  { label: '40-100 km', low: 40, high: 100 },
  { label: '100-300 km', low: 100, high: 300 },
  { label: '300-700 km', low: 300, high: 700 },
] as const;

interface DepthBandRow {
  label: string;
  count: number;
  sharePercent: number;
}

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function DepthBandTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const band = payload[0]?.payload as DepthBandRow | undefined;
  if (band === undefined) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
        {band.label} deep
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {formatCount(band.count)} quakes ({band.sharePercent}%)
      </p>
    </div>
  );
}

/** Builds the depth-band rows for the quakes at or above the magnitude floor. */
export function buildDepthDistribution(
  events: QuakeCatalogEvent[],
  minMagnitude: number,
): DepthBandRow[] {
  const inFilter = events.filter((event) => event.magnitude >= minMagnitude);
  return DEPTH_BANDS.map((band) => {
    const count = inFilter.filter(
      (event) => event.depthKm >= band.low && event.depthKm < band.high,
    ).length;
    const sharePercent = inFilter.length === 0 ? 0 : Math.round((count / inFilter.length) * 100);
    return { label: band.label, count, sharePercent };
  });
}

/**
 * Recent GeoNet catalog earthquakes by depth band, drawn as a radial bar
 * chart. Filter by minimum magnitude with the buttons and hover a bar to
 * read its count.
 */
export function QuakeDepthDistribution({
  events,
}: {
  events: QuakeCatalogEvent[];
}): React.ReactElement {
  const [minMagnitude, setMinMagnitude] = useState<number>(DEFAULT_MIN_MAGNITUDE);

  const bands = useMemo(() => buildDepthDistribution(events, minMagnitude), [events, minMagnitude]);
  const total = useMemo(() => bands.reduce((sum, band) => sum + band.count, 0), [bands]);

  const chartLabel = `Earthquakes of magnitude ${minMagnitude} or stronger by depth band, ${total.toLocaleString('en-NZ')} quakes`;

  const tableColumns: ChartDataColumn<DepthBandRow>[] = [
    { key: 'label', header: 'Depth band' },
    { key: 'count', header: 'Quakes', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'sharePercent', header: 'Share', format: (value) => `${value}%` },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {total.toLocaleString('en-NZ')} {total === 1 ? 'quake' : 'quakes'} of magnitude{' '}
        {minMagnitude} or stronger.
      </p>
      <div className="mb-3 flex items-end gap-1">
        {MAGNITUDE_FILTERS.map((magnitude) => (
          <button
            key={magnitude}
            type="button"
            onClick={() => setMinMagnitude(magnitude)}
            aria-pressed={minMagnitude === magnitude}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
          >
            M{magnitude}+
          </button>
        ))}
      </div>
      <div role="img" aria-label={chartLabel} className="h-[clamp(200px,28vh,300px)]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={bands}
            innerRadius="15%"
            outerRadius="100%"
            barSize={16}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <PolarAngleAxis
              type="category"
              dataKey="label"
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <RadialBar dataKey="count" fill="#661100" background={{ fill: 'var(--color-muted)' }} />
            <Tooltip content={(props) => <DepthBandTooltip {...props} />} />
          </RadialBarChart>
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
