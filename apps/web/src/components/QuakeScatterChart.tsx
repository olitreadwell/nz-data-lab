'use client';

import type { GeoNetQuake } from '@nzlab/nz-sources';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

interface QuakeScatterChartProps {
  quakes: GeoNetQuake[];
}

interface QuakeDatum {
  publicId: string;
  time: string;
  magnitude: number;
  depthKm: number;
  mmi: number;
  locality: string;
  band: string;
}

const MMI_BANDS: { band: string; label: string; color: string }[] = [
  { band: 'weak', label: 'Weak (MMI 3-4)', color: '#38bdf8' },
  { band: 'moderate', label: 'Moderate (MMI 5-6)', color: '#f59e0b' },
  { band: 'strong', label: 'Strong (MMI 7+)', color: '#ef4444' },
];

const BUBBLE_RANGE: [number, number] = [30, 160];
const BUBBLE_FILL_OPACITY = 0.75;
const DEFAULT_MIN_MAGNITUDE = 3;
const DEFAULT_MAX_DEPTH_KM = 100;
const MIN_MAGNITUDE_LIMIT = 2;
const MAX_MAGNITUDE_LIMIT = 6;
const MIN_DEPTH_LIMIT = 0;
const MAX_DEPTH_LIMIT = 100;
const DEPTH_STEP = 5;
const MAGNITUDE_STEP = 0.1;

function bandOf(mmi: number): string {
  if (mmi >= 7) {
    return 'strong';
  }
  if (mmi >= 5) {
    return 'moderate';
  }
  return 'weak';
}

function buildQuakeData(quakes: GeoNetQuake[]): QuakeDatum[] {
  return quakes.map((quake) => ({
    publicId: quake.publicId,
    time: quake.time,
    magnitude: quake.magnitude,
    depthKm: quake.depthKm,
    mmi: quake.mmi,
    locality: quake.locality,
    band: bandOf(quake.mmi),
  }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
}

function formatMagnitudeTick(value: number): string {
  return `M${value.toFixed(1)}`;
}

function formatDepthTick(value: number): string {
  return `${value} km`;
}

function QuakeTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as QuakeDatum | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="quake-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
        {formatDate(datum.time)}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        M {datum.magnitude.toFixed(1)} at {datum.depthKm.toFixed(0)} km
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">{datum.locality}</p>
    </div>
  );
}

/**
 * Recent felt quakes as a bubble chart: magnitude across, depth down, colour
 * by felt intensity (MMI), bubble size by magnitude. Two sliders filter the
 * minimum magnitude and maximum depth, and the chart rescales live.
 */
export function QuakeScatterChart({ quakes }: QuakeScatterChartProps): React.ReactElement {
  const [minMagnitude, setMinMagnitude] = useState(DEFAULT_MIN_MAGNITUDE);
  const [maxDepthKm, setMaxDepthKm] = useState(DEFAULT_MAX_DEPTH_KM);

  const data = useMemo(() => buildQuakeData(quakes), [quakes]);
  const visible = useMemo(
    () => data.filter((datum) => datum.magnitude >= minMagnitude && datum.depthKm <= maxDepthKm),
    [data, minMagnitude, maxDepthKm],
  );

  const label =
    data.length === 0
      ? 'Recent felt quakes'
      : `Recent felt quakes: ${visible.length} of ${data.length} shown, magnitude ${minMagnitude.toFixed(1)} or stronger, shallower than ${maxDepthKm} km`;

  if (data.length === 0) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 720 260" className="h-auto w-full">
        <title>{label}</title>
      </svg>
    );
  }

  return (
    <div>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">
            Minimum magnitude: <strong>{minMagnitude.toFixed(1)}</strong>
          </span>
          <input
            type="range"
            min={MIN_MAGNITUDE_LIMIT}
            max={MAX_MAGNITUDE_LIMIT}
            step={MAGNITUDE_STEP}
            value={minMagnitude}
            onChange={(event) => setMinMagnitude(Number(event.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">
            Maximum depth: <strong>{maxDepthKm} km</strong>
          </span>
          <input
            type="range"
            min={MIN_DEPTH_LIMIT}
            max={MAX_DEPTH_LIMIT}
            step={DEPTH_STEP}
            value={maxDepthKm}
            onChange={(event) => setMaxDepthKm(Number(event.target.value))}
            className="w-full"
          />
        </label>
      </div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        Showing {visible.length} of {data.length} recent quakes.
      </p>
      <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        {MMI_BANDS.map((band) => (
          <li key={band.band} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: band.color }}
              aria-hidden="true"
            />
            <span className="numeral-paragraph-sm text-[var(--color-muted)]">{band.label}</span>
          </li>
        ))}
      </ul>
      <div className="h-[220px] sm:h-[260px] lg:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            role="img"
            aria-label={label}
            margin={{ top: 16, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="magnitude"
              type="number"
              name="Magnitude"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              domain={[MIN_MAGNITUDE_LIMIT, MAX_MAGNITUDE_LIMIT]}
              tickFormatter={formatMagnitudeTick}
            />
            <YAxis
              dataKey="depthKm"
              type="number"
              name="Depth"
              reversed
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              domain={[MIN_DEPTH_LIMIT, MAX_DEPTH_LIMIT]}
              tickFormatter={formatDepthTick}
              width={44}
            />
            <ZAxis dataKey="magnitude" range={BUBBLE_RANGE} />
            <Tooltip
              content={(props) => <QuakeTooltip {...props} />}
              cursor={{ stroke: 'var(--color-border)', strokeDasharray: '4 4' }}
            />
            {MMI_BANDS.map((band) => (
              <Scatter
                key={band.band}
                data={visible.filter((datum) => datum.band === band.band)}
                fill={band.color}
                fillOpacity={BUBBLE_FILL_OPACITY}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
