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

const MAGNITUDE_STEPS = [1, 2, 3, 4, 5, 6] as const;

interface FrequencyPoint {
  magnitude: number;
  count: number;
}

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function FrequencyTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const point = payload[0]?.payload as FrequencyPoint | undefined;
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
        Magnitude {point.magnitude} or stronger
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {formatCount(point.count)} quakes
      </p>
    </div>
  );
}

/** Builds the cumulative count of quakes at or above each magnitude step. */
export function buildFrequencyPoints(events: QuakeCatalogEvent[]): FrequencyPoint[] {
  return MAGNITUDE_STEPS.map((magnitude) => ({
    magnitude,
    count: events.filter((event) => event.magnitude >= magnitude).length,
  }));
}

/**
 * The Gutenberg-Richter relationship: how many quakes sit at or above each
 * magnitude step. The log view draws the law as a straight line; toggle to
 * linear to see how the small quakes dominate the count.
 */
export function QuakeFrequencyMagnitude({
  events,
}: {
  events: QuakeCatalogEvent[];
}): React.ReactElement {
  const [logScale, setLogScale] = useState<boolean>(true);

  const points = useMemo(() => buildFrequencyPoints(events), [events]);
  const total = points[0]?.count ?? 0;

  const chartLabel = `Earthquakes of magnitude 1 or stronger by magnitude threshold, ${total.toLocaleString('en-NZ')} quakes total`;

  const tableColumns: ChartDataColumn<FrequencyPoint>[] = [
    { key: 'magnitude', header: 'Magnitude', format: (value) => `${value} or stronger` },
    { key: 'count', header: 'Quakes', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {total.toLocaleString('en-NZ')} {total === 1 ? 'quake' : 'quakes'} of magnitude 1 or
        stronger.
      </p>
      <div className="mb-3 flex items-end gap-1">
        <button
          type="button"
          onClick={() => setLogScale(true)}
          aria-pressed={logScale}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
        >
          Log scale
        </button>
        <button
          type="button"
          onClick={() => setLogScale(false)}
          aria-pressed={!logScale}
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
        >
          Linear scale
        </button>
      </div>
      <div role="img" aria-label={chartLabel} className="h-[clamp(200px,28vh,300px)]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
            <XAxis
              type="number"
              dataKey="magnitude"
              name="Magnitude"
              domain={[0, 7]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="count"
              name="Quakes"
              scale={logScale ? 'log' : 'linear'}
              domain={[1, 'dataMax']}
              tickFormatter={formatCount}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
            />
            <Tooltip content={(props) => <FrequencyTooltip {...props} />} />
            <Scatter data={points} fill="#4f46e5" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ChartDataTable
        summary="View the quake counts by magnitude threshold as a table"
        columns={tableColumns}
        rows={points}
      />
    </div>
  );
}
