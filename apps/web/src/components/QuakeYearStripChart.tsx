'use client';

import { useMemo, useState } from 'react';

import {
  filterQuakeYearsByMinMagnitude,
  QUAKE_YEAR_COUNTS,
  QUAKE_YEAR_END,
  QUAKE_YEAR_EVENTS,
  QUAKE_YEAR_START,
} from '@/lib/quake-year-data';
import type { QuakeYearEvent } from '@/lib/quake-year-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const PLOT_TOP = 16;
const PLOT_BOTTOM = 36;
const PLOT_LEFT = 20;
const PLOT_RIGHT = 12;
const DOT_RADIUS = 1.7;
const PLOT_HEIGHT = 320;
const MIN_FLOOR = 4;
const MAX_FLOOR = 7;

const MAG_COLORS = [
  { from: 4, color: '#f59e0b' },
  { from: 5, color: '#fb7185' },
  { from: 6, color: '#e11d48' },
  { from: 7, color: '#881337' },
] as const;

function magnitudeColor(magnitude: number): string {
  for (const bucket of MAG_COLORS) {
    if (magnitude >= bucket.from) {
      return bucket.color;
    }
  }
  return MAG_COLORS[0].color;
}

function formatDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

interface YearRow {
  year: number;
  count: number;
  strongest: string;
}

/** A strip chart of every quake at 4.0 or stronger, one dot per quake per year. */
export function QuakeYearStripChart(): React.ReactElement {
  const [minMagnitude, setMinMagnitude] = useState(MIN_FLOOR);

  const visibleEvents = useMemo(() => filterQuakeYearsByMinMagnitude(minMagnitude), [minMagnitude]);

  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const yearSpan = QUAKE_YEAR_END - QUAKE_YEAR_START;
  const columnWidth = plotWidth / (yearSpan + 1);
  const chartHeight = PLOT_TOP + PLOT_HEIGHT + PLOT_BOTTOM;

  const chartLabel = `Earthquakes at magnitude ${minMagnitude.toFixed(1)} or stronger by year, ${QUAKE_YEAR_START} to ${QUAKE_YEAR_END}, one dot per quake`;

  const tableRows: YearRow[] = Array.from({ length: yearSpan + 1 }, (_, index) => {
    const year = QUAKE_YEAR_START + index;
    const events = QUAKE_YEAR_EVENTS.filter((event) => event.y === year);
    const strongest = events.reduce<QuakeYearEvent | undefined>(
      (best, event) => (best === undefined || event.m > best.m ? event : best),
      undefined,
    );
    return {
      year,
      count: QUAKE_YEAR_COUNTS[year] ?? 0,
      strongest: strongest === undefined ? 'n/a' : `M ${strongest.m.toFixed(1)}`,
    };
  });

  const tableColumns: ChartDataColumn<YearRow>[] = [
    { key: 'year', header: 'Year' },
    {
      key: 'count',
      header: `Quakes at M ${minMagnitude.toFixed(1)}+`,
      format: (value) => formatCount(Number(value)),
    },
    { key: 'strongest', header: 'Strongest' },
  ];

  return (
    <figure>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="quake-min-magnitude"
          className="numeral-paragraph-sm text-[var(--color-muted)]"
        >
          Show quakes from magnitude
        </label>
        <input
          id="quake-min-magnitude"
          type="range"
          min={MIN_FLOOR}
          max={MAX_FLOOR}
          step={0.1}
          value={minMagnitude}
          onChange={(event) => setMinMagnitude(Number(event.target.value))}
          className="w-40 accent-rose-600"
        />
        <output
          htmlFor="quake-min-magnitude"
          className="numeral-paragraph-sm text-[var(--color-fg)]"
        >
          M {minMagnitude.toFixed(1)}: {formatCount(visibleEvents.length)} quakes
        </output>
      </div>
      <svg
        role="img"
        aria-label={chartLabel}
        viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
        className="h-auto w-full"
      >
        {Array.from({ length: yearSpan + 1 }, (_, index) => {
          const year = QUAKE_YEAR_START + index;
          const x = PLOT_LEFT + index * columnWidth + columnWidth / 2;
          const events = visibleEvents.filter((event) => event.y === year);
          return (
            <g key={year}>
              {events.map((event, eventIndex) => {
                const jitter = ((event.t % 997) + eventIndex * 131) % PLOT_HEIGHT;
                const y = PLOT_TOP + 4 + jitter;
                const offset = ((eventIndex % 3) - 1) * 2.2;
                return (
                  <circle
                    key={`${event.t}-${eventIndex}`}
                    cx={x + offset}
                    cy={y}
                    r={DOT_RADIUS}
                    fill={magnitudeColor(event.m)}
                  >
                    <title>{`M ${event.m.toFixed(1)}, ${event.p}, ${formatDate(event.t)}`}</title>
                  </circle>
                );
              })}
              <text
                x={x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize={10}
                fill="var(--color-muted)"
              >
                {year}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4">
        {MAG_COLORS.map((bucket) => (
          <span
            key={bucket.from}
            className="flex items-center gap-1 text-xs text-[var(--color-muted)]"
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="5" fill={bucket.color} />
            </svg>
            {bucket.from === 7 ? 'M 7.0+' : `M ${bucket.from}.0-${bucket.from + 0.9}`}
          </span>
        ))}
      </div>
      <ChartDataTable
        summary={`Quakes at M ${minMagnitude.toFixed(1)} or stronger by year, ${QUAKE_YEAR_START} to ${QUAKE_YEAR_END}`}
        columns={tableColumns}
        rows={tableRows}
      />
    </figure>
  );
}
