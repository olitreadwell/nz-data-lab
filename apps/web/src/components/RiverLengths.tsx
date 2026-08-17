'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveWikidataRivers } from '@/lib/live-sources';
import type { LiveWikidataRiver } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 420;
const CHART_LEFT = 44;
const CHART_RIGHT = 16;
const CHART_TOP = 28;
const CHART_BOTTOM = 52;
const TOP_OPTIONS = [5, 10, 15] as const;
const DEFAULT_TOP_N = 10;
const BAR_COLOR = 'var(--color-fg)';
const TOTAL_COLOR = 'var(--color-muted)';

interface WaterfallBar {
  name: string;
  value: number;
  cumulative: number;
  isTotal: boolean;
}

/** Builds the cumulative waterfall bars for the top N rivers plus a total. */
export function buildRiverWaterfallBars(rivers: LiveWikidataRiver[], topN: number): WaterfallBar[] {
  const selected = rivers.slice(0, topN);
  let cumulative = 0;
  const bars: WaterfallBar[] = [];
  for (const river of selected) {
    cumulative += river.lengthKm;
    bars.push({ name: river.name, value: river.lengthKm, cumulative, isTotal: false });
  }
  bars.push({ name: 'Total', value: cumulative, cumulative, isTotal: true });
  return bars;
}

/** Picks round gridline values that cover the max value with ~6 ticks. */
export function buildNiceTicks(maxValue: number): number[] {
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

function truncateName(name: string, maxLength: number): string {
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.slice(0, maxLength - 1)}…`;
}

/**
 * Live Wikidata river lengths drawn as a cumulative waterfall: each bar adds
 * one river's length, and the final bar is the total. Toggle the top-N
 * buttons to widen or narrow the list.
 */
export function RiverLengths(): React.ReactElement {
  const [rivers, setRivers] = useState<LiveWikidataRiver[]>([]);
  const [topN, setTopN] = useState<number>(DEFAULT_TOP_N);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRivers(await fetchLiveWikidataRivers());
    } catch {
      setError('Wikidata did not answer. Try again in a moment.');
      setRivers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRivers();
  }, [loadRivers]);

  const bars = useMemo(() => buildRiverWaterfallBars(rivers, topN), [rivers, topN]);
  const maxCumulative = bars[bars.length - 1]?.cumulative ?? 0;
  const ticks = useMemo(() => buildNiceTicks(maxCumulative), [maxCumulative]);
  const plotWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const plotHeight = SVG_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const barSlot = plotWidth / bars.length;
  const barWidth = barSlot * 0.66;
  const chartLabel =
    bars.length === 0
      ? 'New Zealand river lengths'
      : `The ${topN} longest New Zealand rivers, cumulative length: ${maxCumulative.toLocaleString('en-NZ')} km`;

  const scaleY = (value: number): number =>
    CHART_TOP + plotHeight - (value / maxCumulative) * plotHeight;

  const tableColumns: ChartDataColumn<WaterfallBar>[] = [
    { key: 'name', header: 'River' },
    { key: 'value', header: 'Length (km)', format: (value) => value.toLocaleString('en-NZ') },
    {
      key: 'cumulative',
      header: 'Cumulative (km)',
      format: (value) => value.toLocaleString('en-NZ'),
    },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Measuring the rivers...'
          : (error ?? `${rivers.length} rivers, fetched live from Wikidata.`)}
      </p>
      {!isLoading && error === null && rivers.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {TOP_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTopN(option)}
                aria-pressed={topN === option}
                className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                  topN === option
                    ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                Top {option}
              </button>
            ))}
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
            {bars.map((bar, index) => {
              const x = CHART_LEFT + index * barSlot + (barSlot - barWidth) / 2;
              const yTop = scaleY(bar.cumulative);
              const yBottom = bar.isTotal ? scaleY(0) : scaleY(bar.cumulative - bar.value);
              const barHeight = yBottom - yTop;
              return (
                <g key={`${bar.name}-${index}`}>
                  <rect
                    x={x}
                    y={yTop}
                    width={barWidth}
                    height={barHeight}
                    fill={bar.isTotal ? TOTAL_COLOR : BAR_COLOR}
                    rx={2}
                  />
                  <text
                    x={x + barWidth / 2}
                    y={yTop - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--color-fg)"
                  >
                    {bar.value.toLocaleString('en-NZ')}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={SVG_HEIGHT - CHART_BOTTOM + 16}
                    textAnchor="middle"
                    fontSize={8}
                    fill="var(--color-muted)"
                  >
                    {bar.isTotal ? 'Total' : truncateName(bar.name, 9)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each bar adds one river to the running total. The last bar is the combined length of the
            top {topN}.
          </p>
          <ChartDataTable
            summary="View the river lengths as a table"
            columns={tableColumns}
            rows={bars}
          />
        </div>
      )}
    </div>
  );
}
