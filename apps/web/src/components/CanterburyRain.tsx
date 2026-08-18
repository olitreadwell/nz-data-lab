'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveCanterburyRainGauges } from '@/lib/live-sources';
import type { LiveCanterburyRainGauge } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 420;
const CHART_LEFT = 44;
const CHART_RIGHT = 16;
const CHART_TOP = 28;
const CHART_BOTTOM = 52;
const DAYS = 8;
const BOX_COLOR = 'var(--color-fg)';
const MEDIAN_COLOR = 'var(--color-bg)';
const WHISKER_COLOR = 'var(--color-muted)';

const DAY_LABELS = [
  'Today',
  '1 day ago',
  '2 days ago',
  '3 days ago',
  '4 days ago',
  '5 days ago',
  '6 days ago',
  '7 days ago',
];

export interface RainBoxStats {
  day: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  count: number;
}

/** Linear-interpolated percentile of a sorted value list. */
function percentile(sorted: number[], proportion: number): number {
  if (sorted.length === 0) {
    return 0;
  }
  const index = (sorted.length - 1) * proportion;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const lowerValue = sorted[lower] ?? 0;
  const upperValue = sorted[upper] ?? 0;
  if (lower === upper) {
    return lowerValue;
  }
  return lowerValue + (upperValue - lowerValue) * (index - lower);
}

/** Builds one box of min, quartiles, and max per day across the gauges. */
export function buildRainBoxStats(gauges: LiveCanterburyRainGauge[]): RainBoxStats[] {
  return [0, 1, 2, 3, 4, 5, 6, 7].map((day) => {
    const values = gauges
      .map((gauge) => gauge.rainByDayAgoMm[day])
      .filter((value): value is number => value !== null);
    if (values.length === 0) {
      return { day, min: 0, q1: 0, median: 0, q3: 0, max: 0, count: 0 };
    }
    const sorted = [...values].sort((a, b) => a - b);
    return {
      day,
      min: sorted[0] ?? 0,
      q1: percentile(sorted, 0.25),
      median: percentile(sorted, 0.5),
      q3: percentile(sorted, 0.75),
      max: sorted[sorted.length - 1] ?? 0,
      count: values.length,
    };
  });
}

/** Picks round gridline values that cover the max value with ~6 ticks. */
export function buildRainTicks(maxValue: number): number[] {
  if (maxValue <= 0) {
    return [0];
  }
  const rawStep = maxValue / 6;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  let step: number;
  if (normalized <= 1) {
    step = 1;
  } else if (normalized <= 2) {
    step = 2;
  } else if (normalized <= 5) {
    step = 5;
  } else {
    step = 10;
  }
  step *= magnitude;
  const ticks: number[] = [];
  for (let value = 0; value <= maxValue; value += step) {
    ticks.push(value);
  }
  return ticks;
}

/**
 * Live Environment Canterbury rain gauges drawn as a box plot: one box per
 * day, showing the spread of rainfall across the region's gauges. Type a
 * gauge name to filter the boxes.
 */
export function CanterburyRain(): React.ReactElement {
  const [gauges, setGauges] = useState<LiveCanterburyRainGauge[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGauges = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setGauges(await fetchLiveCanterburyRainGauges());
    } catch {
      setError('Environment Canterbury did not answer. Try again in a moment.');
      setGauges([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGauges();
  }, [loadGauges]);

  const filteredGauges = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return gauges;
    }
    return gauges.filter((gauge) => gauge.siteName.toLowerCase().includes(normalizedQuery));
  }, [gauges, query]);

  const stats = useMemo(() => buildRainBoxStats(filteredGauges), [filteredGauges]);
  const maxValue = useMemo(
    () => Math.max(0, ...stats.map((box) => box.max)),
    [stats],
  );
  const ticks = useMemo(() => buildRainTicks(maxValue), [maxValue]);
  const plotWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const plotHeight = SVG_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const slotWidth = plotWidth / DAYS;
  const boxWidth = slotWidth * 0.5;
  const chartLabel =
    filteredGauges.length === 0
      ? 'Canterbury rainfall across gauges'
      : `Canterbury rainfall across ${filteredGauges.length} gauges, last 8 days`;

  const scaleY = (value: number): number =>
    CHART_TOP + plotHeight - (value / maxValue) * plotHeight;

  const tableColumns: ChartDataColumn<RainBoxStats>[] = [
    { key: 'day', header: 'Day', format: (value) => DAY_LABELS[value] ?? String(value) },
    { key: 'min', header: 'Min (mm)', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'q1', header: 'Lower quartile (mm)', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'median', header: 'Median (mm)', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'q3', header: 'Upper quartile (mm)', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'max', header: 'Max (mm)', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'count', header: 'Gauges' },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Reading the gauges...'
          : (error ?? `${gauges.length} gauges, fetched live from Environment Canterbury.`)}
      </p>
      {!isLoading && error === null && gauges.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <label className="numeral-paragraph-sm text-[var(--color-muted)]" htmlFor="gauge-search">
              Filter by gauge
            </label>
            <input
              id="gauge-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-fg)]"
            />
          </div>
          <svg
            role="img"
            aria-label={chartLabel}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="h-auto w-full"
          >
            <title>{chartLabel}</title>
            {ticks.map((tick) => {
              const y = scaleY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={CHART_LEFT}
                    y1={y}
                    x2={SVG_WIDTH - CHART_RIGHT}
                    y2={y}
                    stroke="var(--color-border)"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={CHART_LEFT - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--color-muted)"
                  >
                    {tick.toLocaleString('en-NZ')}
                  </text>
                </g>
              );
            })}
            {stats.map((box, index) => {
              const centerX = CHART_LEFT + index * slotWidth + slotWidth / 2;
              const boxLeft = centerX - boxWidth / 2;
              const yMax = scaleY(box.max);
              const yQ3 = scaleY(box.q3);
              const yMedian = scaleY(box.median);
              const yQ1 = scaleY(box.q1);
              const yMin = scaleY(box.min);
              return (
                <g key={box.day}>
                  <line
                    x1={centerX}
                    y1={yMax}
                    x2={centerX}
                    y2={yMin}
                    stroke={WHISKER_COLOR}
                    strokeWidth={1}
                  />
                  <line
                    x1={centerX - boxWidth / 2}
                    y1={yMax}
                    x2={centerX + boxWidth / 2}
                    y2={yMax}
                    stroke={WHISKER_COLOR}
                    strokeWidth={1}
                  />
                  <line
                    x1={centerX - boxWidth / 2}
                    y1={yMin}
                    x2={centerX + boxWidth / 2}
                    y2={yMin}
                    stroke={WHISKER_COLOR}
                    strokeWidth={1}
                  />
                  <rect
                    x={boxLeft}
                    y={yQ3}
                    width={boxWidth}
                    height={Math.max(1, yQ1 - yQ3)}
                    fill={BOX_COLOR}
                    rx={2}
                  />
                  <line
                    x1={boxLeft}
                    y1={yMedian}
                    x2={boxLeft + boxWidth}
                    y2={yMedian}
                    stroke={MEDIAN_COLOR}
                    strokeWidth={2}
                  />
                  <text
                    x={centerX}
                    y={SVG_HEIGHT - CHART_BOTTOM + 18}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--color-muted)"
                  >
                    {DAY_LABELS[box.day]}
                  </text>
                </g>
              );
            })}
          </svg>
          <ChartDataTable
            summary="Daily rainfall spread across Canterbury gauges"
            columns={tableColumns}
            rows={stats}
          />
        </div>
      )}
    </div>
  );
}
