'use client';

import { useMemo, useState } from 'react';

import { RETAIL_SALES_LAYERS, RETAIL_SALES_POINTS } from '@/lib/retail-sales-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 460;
const PLOT_LEFT = 56;
const PLOT_RIGHT = 24;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;

const LAYER_COLORS: Record<(typeof RETAIL_SALES_LAYERS)[number], string> = {
  consumables: '#0284c7',
  durables: '#d97706',
  hospitality: '#e11d48',
  apparel: '#8b5cf6',
  fuel: '#f59e0b',
  vehicles: '#059669',
  services: '#14b8a6',
  nonRetail: '#64748b',
};

const LAYER_LABELS: Record<(typeof RETAIL_SALES_LAYERS)[number], string> = {
  consumables: 'Consumables',
  durables: 'Durables',
  hospitality: 'Hospitality',
  apparel: 'Apparel',
  fuel: 'Fuel',
  vehicles: 'Vehicles',
  services: 'Services',
  nonRetail: 'Non-retail',
};

interface StreamPoint {
  label: string;
  total: number;
  values: number[];
}

const STREAM_POINTS: StreamPoint[] = RETAIL_SALES_POINTS.map((point) => ({
  label: `${point.year} ${point.month}`,
  total: point.total,
  values: RETAIL_SALES_LAYERS.map((layer) => point[layer]),
}));

function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString('en-NZ')}m`;
}

/** One layer's top and bottom profile across all months. */
interface LayerProfile {
  top: number[];
  bottom: number[];
}

function buildProfiles(visibleLayers: number[]): { profiles: LayerProfile[]; maxTotal: number } {
  const totals: number[] = [];
  for (const point of STREAM_POINTS) {
    let sum = 0;
    for (const layerIndex of visibleLayers) {
      sum += point.values[layerIndex] ?? 0;
    }
    totals.push(sum);
  }
  const maxTotal = Math.max(...totals);
  const profiles: LayerProfile[] = visibleLayers.map((layerIndex) => {
    const top: number[] = [];
    const bottom: number[] = [];
    let running = 0;
    for (const point of STREAM_POINTS) {
      const value = point.values[layerIndex] ?? 0;
      bottom.push(running);
      running += value;
      top.push(running);
    }
    return { top, bottom };
  });
  return { profiles, maxTotal };
}

function formatMonthSummary(point: StreamPoint, visibleLayers: number[]): string {
  const parts = visibleLayers.map((layerIndex) => {
    const key = RETAIL_SALES_LAYERS[layerIndex] ?? 'consumables';
    return `${LAYER_LABELS[key]} ${formatMoney(point.values[layerIndex] ?? 0)}`;
  });
  return `${point.label}: ${formatMoney(point.total)} total. ${parts.join(', ')}.`;
}

/**
 * Monthly electronic card transactions by industry drawn as a streamgraph:
 * the stacked bands surge upward every December and drop back in January.
 * Toggle layers on and off, or hover to read a month. Source: Stats NZ
 * Electronic card transactions releases (Table 1, actual values).
 */
export function RetailSalesStreamgraph(): React.ReactElement {
  const [visibleLayerIndices, setVisibleLayerIndices] = useState<Set<number>>(
    () => new Set(RETAIL_SALES_LAYERS.map((_, index) => index)),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toggleLayer = (layerIndex: number): void => {
    setVisibleLayerIndices((previous) => {
      const next = new Set(previous);
      if (next.has(layerIndex)) {
        next.delete(layerIndex);
      } else {
        next.add(layerIndex);
      }
      return next;
    });
  };

  const visibleLayers = useMemo(
    () => [...visibleLayerIndices].sort((a, b) => a - b),
    [visibleLayerIndices],
  );

  const { profiles, maxTotal } = useMemo(() => buildProfiles(visibleLayers), [visibleLayers]);

  const pointCount = STREAM_POINTS.length;
  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  const plotHeight = SVG_HEIGHT - PLOT_TOP - PLOT_BOTTOM;
  const xForIndex = (index: number): number =>
    PLOT_LEFT + (index / Math.max(pointCount - 1, 1)) * plotWidth;
  const yForTotal = (value: number): number =>
    maxTotal === 0
      ? PLOT_TOP + plotHeight / 2
      : PLOT_TOP + plotHeight / 2 - (value / maxTotal) * plotHeight * 0.9;

  const hoveredPoint = hoveredIndex === null ? undefined : STREAM_POINTS[hoveredIndex];

  const profilePoints = (profile: LayerProfile, flip: boolean): string =>
    profile.top
      .map((_, index) => {
        const yTop = yForTotal(flip ? (profile.bottom[index] ?? 0) : (profile.top[index] ?? 0));
        return `${xForIndex(index)},${yTop}`;
      })
      .join(' ');

  const tableColumns: ChartDataColumn<Record<string, number | string>>[] = [
    { key: 'label', header: 'Month' },
    { key: 'total', header: 'Total', format: (value) => formatMoney(Number(value)) },
    ...RETAIL_SALES_LAYERS.map((layer) => ({
      key: layer,
      header: LAYER_LABELS[layer],
      format: (value: number | string) => formatMoney(Number(value)),
    })),
  ];

  const tableRows = useMemo(
    () =>
      STREAM_POINTS.map((point) => {
        const row: Record<string, number | string> = {
          label: point.label,
          total: point.total,
        };
        point.values.forEach((value, index) => {
          row[RETAIL_SALES_LAYERS[index] ?? 'consumables'] = value;
        });
        return row;
      }),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1">
          {RETAIL_SALES_LAYERS.map((layer, index) => {
            const isVisible = visibleLayerIndices.has(index);
            return (
              <button
                key={layer}
                type="button"
                onClick={() => toggleLayer(index)}
                aria-pressed={isVisible}
                className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-pressed:bg-[var(--color-border)]"
              >
                {LAYER_LABELS[layer]}
              </button>
            );
          })}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          {hoveredPoint === undefined
            ? 'Each band is one industry group. The stream surges every December.'
            : formatMonthSummary(hoveredPoint, visibleLayers)}
        </p>
      </div>
      <div
        role="img"
        aria-label="Monthly electronic card transactions by industry from June 2021 to June 2025"
        className="h-[460px]"
      >
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-full w-full">
          {profiles.map((profile, profileIndex) => {
            const layerIndex = visibleLayers[profileIndex] ?? 0;
            const key = RETAIL_SALES_LAYERS[layerIndex] ?? 'consumables';
            const color = LAYER_COLORS[key];
            const topPath = profilePoints(profile, false);
            const bottomPath = profilePoints(profile, true);
            return (
              <polygon
                key={key}
                points={`${topPath} ${bottomPath.split(' ').reverse().join(' ')}`}
                fill={color}
                fillOpacity="0.75"
                stroke={color}
                strokeWidth="0.5"
                onMouseEnter={() => setHoveredIndex(null)}
              >
                <title>{LAYER_LABELS[key]}</title>
              </polygon>
            );
          })}
          {STREAM_POINTS.map((point, index) => (
            <g key={point.label}>
              <rect
                x={xForIndex(index) - 12}
                y={PLOT_TOP}
                width="24"
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                tabIndex={0}
                role="img"
                aria-label={formatMonthSummary(point, visibleLayers)}
              >
                <title>{formatMonthSummary(point, visibleLayers)}</title>
              </rect>
              {index % 6 === 0 && (
                <text
                  x={xForIndex(index)}
                  y={SVG_HEIGHT - PLOT_BOTTOM + 18}
                  textAnchor="middle"
                  className="fill-[var(--color-muted)] text-xs"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <p className="numeral-paragraph-sm mt-2 text-[var(--color-muted)]">
        Values include GST. Component series are rounded independently, so they may not sum exactly
        to the stated total.
      </p>
      <ChartDataTable
        summary="Show the data behind the chart"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
