'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveWikipediaPageviews } from '@/lib/live-sources';
import type { LiveWikipediaPage } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 480;
const ROW_HEIGHT = 40;
const TITLE_WIDTH = 150;
const CHART_LEFT = TITLE_WIDTH + 8;
const CHART_RIGHT = 16;
const CHART_TOP = 24;
const CHART_BOTTOM = 32;
const MIN_WINDOW_DAYS = 7;
const MAX_WINDOW_DAYS = 60;
const DEFAULT_WINDOW_DAYS = 30;
const LOG_BASE = 10;

interface TimelineRow {
  title: string;
  min: number;
  max: number;
  latest: number;
}

function computeRows(pages: LiveWikipediaPage[], windowDays: number): TimelineRow[] {
  return pages
    .map((page) => {
      const values = page.dailyViews.slice(-windowDays).filter((count) => count > 0);
      if (values.length === 0) {
        return null;
      }
      return {
        title: page.title,
        min: Math.min(...values),
        max: Math.max(...values),
        latest: values[values.length - 1] ?? 0,
      };
    })
    .filter((row): row is TimelineRow => row !== null)
    .sort((a, b) => b.latest - a.latest);
}

function logPosition(value: number, maxValue: number, chartWidth: number): number {
  const logMin = Math.log(1) / Math.log(LOG_BASE);
  const logMax = Math.log(maxValue) / Math.log(LOG_BASE);
  const logValue = Math.log(Math.max(value, 1)) / Math.log(LOG_BASE);
  return ((logValue - logMin) / (logMax - logMin)) * chartWidth;
}

function formatTick(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }
  return String(value);
}

/**
 * Live Wikipedia readership of New Zealand topics: for each tracked page, the
 * range of daily views over the selected window, drawn as a horizontal
 * timeline. Drag the slider to widen or narrow the window.
 */
export function WhatTheWorldReads(): React.ReactElement {
  const [pages, setPages] = useState<LiveWikipediaPage[]>([]);
  const [windowDays, setWindowDays] = useState(DEFAULT_WINDOW_DAYS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPages(await fetchLiveWikipediaPageviews());
    } catch {
      setError('Wikipedia did not answer. Try again in a moment.');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);

  const rows = useMemo(() => computeRows(pages, windowDays), [pages, windowDays]);
  const maxValue = useMemo(() => Math.max(...rows.map((row) => row.max), 1), [rows]);
  const chartWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const chartLabel = `Daily Wikipedia views of New Zealand topics over the last ${windowDays} days`;

  const ticks = useMemo(() => {
    const tickValues = [10, 100, 1000, 10000, 100000].filter((value) => value <= maxValue);
    return tickValues.map((value) => ({
      value,
      x: CHART_LEFT + logPosition(value, maxValue, chartWidth),
    }));
  }, [maxValue, chartWidth]);

  const tableColumns: ChartDataColumn<TimelineRow>[] = [
    { key: 'title', header: 'Page' },
    { key: 'min', header: 'Lowest daily views', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'max', header: 'Highest daily views', format: (value) => value.toLocaleString('en-NZ') },
    {
      key: 'latest',
      header: 'Latest daily views',
      format: (value) => value.toLocaleString('en-NZ'),
    },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Reading the pageview logs...'
          : (error ?? `${pages.length} pages, fetched live from Wikipedia.`)}
      </p>
      {!isLoading && error === null && pages.length > 0 && (
        <div>
          <label className="numeral-paragraph-sm mb-2 block text-[var(--color-muted)]">
            Window
            <input
              type="range"
              min={MIN_WINDOW_DAYS}
              max={MAX_WINDOW_DAYS}
              step={1}
              value={windowDays}
              onChange={(event) => setWindowDays(Number(event.target.value))}
              className="mt-1 w-full"
            />
            <span className="numeral-text-eyebrow">last {windowDays} days</span>
          </label>
          <svg
            role="img"
            aria-label={chartLabel}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="h-auto w-full"
          >
            <title>{chartLabel}</title>
            {ticks.map((tick) => (
              <g key={tick.value}>
                <line
                  x1={tick.x}
                  y1={CHART_TOP}
                  x2={tick.x}
                  y2={SVG_HEIGHT - CHART_BOTTOM}
                  stroke="var(--color-border)"
                  strokeDasharray="2 4"
                />
                <text
                  x={tick.x}
                  y={SVG_HEIGHT - CHART_BOTTOM + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--color-muted)"
                >
                  {formatTick(tick.value)}
                </text>
              </g>
            ))}
            {rows.map((row, index) => {
              const y = CHART_TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2;
              const xMin = CHART_LEFT + logPosition(row.min, maxValue, chartWidth);
              const xMax = CHART_LEFT + logPosition(row.max, maxValue, chartWidth);
              const xLatest = CHART_LEFT + logPosition(row.latest, maxValue, chartWidth);
              return (
                <g key={row.title}>
                  <text
                    x={CHART_LEFT - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={11}
                    fill="var(--color-fg)"
                  >
                    {row.title}
                  </text>
                  <line
                    x1={xMin}
                    y1={y}
                    x2={xMax}
                    y2={y}
                    stroke="var(--color-muted)"
                    strokeWidth={2}
                  />
                  <circle cx={xLatest} cy={y} r={4} fill="var(--color-fg)" />
                </g>
              );
            })}
          </svg>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each line spans the lowest to highest daily views in the window. The dot marks the
            latest day.
          </p>
          <ChartDataTable
            summary="View the pageview ranges as a table"
            columns={tableColumns}
            rows={rows}
          />
        </div>
      )}
    </div>
  );
}
