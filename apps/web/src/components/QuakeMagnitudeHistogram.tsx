'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const MIN_MAGNITUDE = 1;
const BIN_SIZES = [0.5, 1, 2] as const;
const DAY_OPTIONS = [30, 60, 90] as const;
const DEFAULT_BIN_SIZE = 0.5;
const DEFAULT_DAYS = 90;

interface MagnitudeBin {
  label: string;
  low: number;
  high: number;
  count: number;
}

/** Builds histogram bins over the events that fall inside the time window. */
export function buildMagnitudeBins(
  events: QuakeCatalogEvent[],
  binSize: number,
  maxDays: number,
): MagnitudeBin[] {
  const cutoff = Date.now() / 1000 - maxDays * 24 * 60 * 60;
  const inWindow = events.filter((event) => event.timeEpochSec >= cutoff);
  const maxMagnitude = Math.max(...inWindow.map((event) => event.magnitude), MIN_MAGNITUDE);
  const high = Math.ceil(maxMagnitude * 10) / 10;
  const bins: MagnitudeBin[] = [];
  for (let low = MIN_MAGNITUDE; low < high; low += binSize) {
    const count = inWindow.filter(
      (event) => event.magnitude >= low && event.magnitude < low + binSize,
    ).length;
    bins.push({
      label: `${low.toFixed(1)}-${(low + binSize).toFixed(1)}`,
      low,
      high: low + binSize,
      count,
    });
  }
  return bins;
}

const COMPACT_FORMATTER = new Intl.NumberFormat('en-NZ', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

/** Tooltip shown while hovering a magnitude bin. */
function BinTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const bin = payload[0]?.payload as MagnitudeBin | undefined;
  if (bin === undefined) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
        Magnitude {bin.low.toFixed(1)} to {bin.high.toFixed(1)}
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {bin.count.toLocaleString('en-NZ')} quakes
      </p>
    </div>
  );
}

/**
 * Recent GeoNet catalog earthquakes by magnitude, drawn as a histogram.
 * Widen or narrow the bins with the slider and the time window with the
 * day buttons. Data is fetched at build time from GeoNet's FDSN event
 * service, falling back to a committed snapshot.
 */
export function QuakeMagnitudeHistogram({
  events,
}: {
  events: QuakeCatalogEvent[];
}): React.ReactElement {
  const [binSize, setBinSize] = useState<number>(DEFAULT_BIN_SIZE);
  const [maxDays, setMaxDays] = useState<number>(DEFAULT_DAYS);

  const bins = useMemo(
    () => buildMagnitudeBins(events, binSize, maxDays),
    [events, binSize, maxDays],
  );
  const totalInWindow = useMemo(() => bins.reduce((sum, bin) => sum + bin.count, 0), [bins]);

  const chartLabel = `Earthquakes of magnitude ${MIN_MAGNITUDE} or stronger by magnitude bin, last ${maxDays} days, ${totalInWindow} quakes`;

  const tableColumns: ChartDataColumn<MagnitudeBin>[] = [
    { key: 'label', header: 'Magnitude range' },
    { key: 'count', header: 'Quakes', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {totalInWindow.toLocaleString('en-NZ')} quakes in the last {maxDays} days.
      </p>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="numeral-paragraph-sm text-[var(--color-muted)]">
          Bin size
          <input
            type="range"
            min={BIN_SIZES[0]}
            max={BIN_SIZES[BIN_SIZES.length - 1]}
            step={0.5}
            value={binSize}
            onChange={(event) => setBinSize(Number(event.target.value))}
            className="w-full"
          />
          <span className="numeral-text-eyebrow">{binSize.toFixed(1)} magnitude</span>
        </label>
        <div className="flex items-end gap-1">
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
      </div>
      <div role="img" aria-label={chartLabel} className="h-[220px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
            <XAxis dataKey="label" stroke="var(--color-muted)" />
            <YAxis tickFormatter={formatCount} stroke="var(--color-muted)" />
            <Tooltip content={(props) => <BinTooltip {...props} />} />
            <Bar dataKey="count" fill="#be123c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View the magnitude bins as a table"
        columns={tableColumns}
        rows={bins}
      />
    </div>
  );
}
