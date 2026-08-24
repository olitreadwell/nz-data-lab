'use client';

import type { ReactNode } from 'react';
import { ReferenceLine } from 'recharts';

import type { ChartEventMarker } from '@/lib/event-markers';

/**
 * Dashed vertical lines for dated events, drawn on top of a time-series
 * chart. Each line gets a small number so the legend below the chart can
 * say which event is which. Contextual, never causal.
 */
export function EventReferenceLines({
  events,
}: {
  events: ChartEventMarker[];
}): React.ReactElement {
  return (
    <>
      {events.map((event, index) => (
        <ReferenceLine
          key={`${String(event.x)}-${event.label}`}
          x={event.x}
          stroke="var(--color-muted)"
          strokeDasharray="4 4"
          strokeWidth={1.5}
          label={{
            value: index + 1,
            position: 'insideTopRight',
            fontSize: 10,
            fontWeight: 700,
            fill: 'var(--color-muted)',
          }}
        />
      ))}
    </>
  );
}

/**
 * Numbered list of the events drawn on the chart, with a short citation for
 * each. The numbers match the flags on the chart.
 */
export function EventMarkerLegend({
  heading,
  events,
}: {
  heading: string;
  events: ChartEventMarker[];
}): React.ReactElement {
  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
      <p className="numeral-text-eyebrow text-[var(--color-muted)]">{heading}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {events.map((event) => (
          <li
            key={`${String(event.x)}-${event.label}`}
            className="numeral-paragraph-sm text-[var(--color-muted)]"
          >
            <span className="text-[var(--color-fg)]">{event.label}</span>. {event.citation}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Plain-language note on how to read a chart. One idea per sentence, no
 * jargon, so the chart works for an AuDHD or ESL reader of any age.
 */
export function ChartExplain({
  heading = 'How to read this chart',
  children,
}: {
  heading?: string;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="mt-6 max-w-3xl">
      <p className="numeral-text-eyebrow text-[var(--color-muted)]">{heading}</p>
      <p className="numeral-paragraph-md mt-2 text-[var(--color-muted)]">{children}</p>
    </div>
  );
}
