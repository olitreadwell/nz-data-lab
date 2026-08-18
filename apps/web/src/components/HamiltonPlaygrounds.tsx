'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveHamiltonPlaygrounds } from '@/lib/live-sources';
import type { LiveHamiltonPlayground } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 360;
const CHART_LEFT = 190;
const CHART_RIGHT = 16;
const CHART_TOP = 28;
const CHART_BOTTOM = 48;
const CELL_GAP = 3;
const MAX_CELL_COLOR = '#10b981';

/**
 * Resolved `--color-bg` in each theme (the `--neutral-50` token from
 * `packages/ui/src/tokens/tokens.css`). Used to compute the concrete cell
 * fill for the label's contrast decision; the rendered fill itself stays a
 * `color-mix(...)` against `var(--color-bg)`.
 */
export const HEATMAP_BG = {
  light: '#fafafa',
  dark: '#060606',
};

/** Relative luminance of an sRGB hex color, per the WCAG 2.2 formula. */
function relativeLuminance(hex: string): number {
  const channel = (index: number): number => parseInt(hex.slice(index, index + 2), 16) / 255;
  const linearize = (value: number): number =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return (
    0.2126 * linearize(channel(1)) + 0.7152 * linearize(channel(3)) + 0.0722 * linearize(channel(5))
  );
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixSrgbColor(from: string, to: string, amount: number): string {
  const channel = (fromValue: number, toValue: number): number =>
    Math.round(fromValue + (toValue - fromValue) * amount);
  const fromRgb = [1, 3, 5].map((index) => parseInt(from.slice(index, index + 2), 16));
  const toRgb = [1, 3, 5].map((index) => parseInt(to.slice(index, index + 2), 16));
  const channels = fromRgb.map((fromValue, index) =>
    channel(fromValue, toRgb[index] ?? 0)
      .toString(16)
      .padStart(2, '0'),
  );
  return `#${channels.join('')}`;
}

/**
 * Concrete mixed fill for a heatmap cell, mirroring the rendered
 * `color-mix(in srgb, #10b981 <intensity>%, var(--color-bg))`.
 */
export function cellFillColor(count: number, maxCount: number, bgColor: string): string {
  if (count === 0 || maxCount === 0) {
    return bgColor;
  }
  return mixSrgbColor(bgColor, MAX_CELL_COLOR, count / maxCount);
}

/**
 * Cell-number color that keeps at least 4.5:1 (WCAG 1.4.3 AA) contrast
 * against its own fill for every possible count in both light and dark
 * themes. Picks the lighter of white or black against the concrete fill,
 * mirroring `getOrgLabelColor` in OpenDataSearch.
 */
export function cellTextColor(count: number, maxCount: number, bgColor: string): string {
  const fill = cellFillColor(count, maxCount, bgColor);
  return contrastRatio(fill, '#ffffff') >= contrastRatio(fill, '#000000') ? '#ffffff' : '#000000';
}

export interface PlaygroundHeatCell {
  type: string;
  decade: number;
  count: number;
}

export interface PlaygroundHeatmap {
  types: string[];
  decades: number[];
  cells: PlaygroundHeatCell[];
  maxCount: number;
}

/** Groups playgrounds into a type-by-decade grid of counts. */
export function buildPlaygroundHeatmap(playgrounds: LiveHamiltonPlayground[]): PlaygroundHeatmap {
  const types = [...new Set(playgrounds.map((playground) => playground.type))].sort();
  const decades = [
    ...new Set(
      playgrounds
        .map((playground) => playground.decade)
        .filter((decade): decade is number => decade !== null),
    ),
  ].sort((a, b) => a - b);
  const cells: PlaygroundHeatCell[] = [];
  let maxCount = 0;
  for (const type of types) {
    for (const decade of decades) {
      const count = playgrounds.filter(
        (playground) => playground.type === type && playground.decade === decade,
      ).length;
      maxCount = Math.max(maxCount, count);
      cells.push({ type, decade, count });
    }
  }
  return { types, decades, cells, maxCount };
}

function formatDecade(value: string | number): string {
  return `${value}s`;
}

/**
 * Live Hamilton City Council playgrounds drawn as a heatmap: playground type
 * on the y axis, installation decade on the x axis, cell colour by count.
 * Toggle a type to hide it, and the grid recalculates.
 */
export function HamiltonPlaygrounds(): React.ReactElement {
  const [playgrounds, setPlaygrounds] = useState<LiveHamiltonPlayground[]>([]);
  const [hiddenTypes, setHiddenTypes] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const loadPlaygrounds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPlaygrounds(await fetchLiveHamiltonPlaygrounds());
    } catch {
      setError('Hamilton City Council did not answer. Try again in a moment.');
      setPlaygrounds([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPlaygrounds();
  }, [loadPlaygrounds]);

  useEffect(() => {
    // Effects only run in the browser, so `document` is always available here.
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const allTypes = useMemo(
    () => [...new Set(playgrounds.map((playground) => playground.type))].sort(),
    [playgrounds],
  );

  const visiblePlaygrounds = useMemo(
    () => playgrounds.filter((playground) => !hiddenTypes.has(playground.type)),
    [playgrounds, hiddenTypes],
  );

  const heatmap = useMemo(() => buildPlaygroundHeatmap(visiblePlaygrounds), [visiblePlaygrounds]);

  const toggleType = (type: string): void => {
    setHiddenTypes((previous) => {
      const next = new Set(previous);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const plotWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const plotHeight = SVG_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const cellWidth = plotWidth / Math.max(1, heatmap.decades.length);
  const cellHeight = plotHeight / Math.max(1, heatmap.types.length);
  const chartLabel =
    visiblePlaygrounds.length === 0
      ? 'Hamilton playgrounds by type and decade'
      : `${visiblePlaygrounds.length} Hamilton playgrounds by type and decade`;

  const cellColor = (count: number): string => {
    if (count === 0 || heatmap.maxCount === 0) {
      return 'var(--color-border)';
    }
    const intensity = count / heatmap.maxCount;
    return `color-mix(in srgb, ${MAX_CELL_COLOR} ${Math.round(intensity * 100)}%, var(--color-bg))`;
  };

  const tableColumns: ChartDataColumn<PlaygroundHeatCell>[] = [
    { key: 'type', header: 'Type' },
    { key: 'decade', header: 'Decade', format: formatDecade },
    { key: 'count', header: 'Playgrounds' },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Mapping the playgrounds...'
          : (error ??
            `${playgrounds.length} playgrounds, fetched live from Hamilton City Council.`)}
      </p>
      {!isLoading && error === null && playgrounds.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {allTypes.map((type) => {
              const hidden = hiddenTypes.has(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  aria-pressed={!hidden}
                  className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                    hidden
                      ? 'border-[var(--color-border)] text-[var(--color-muted)]'
                      : 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <svg
            role="img"
            aria-label={chartLabel}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="mx-auto h-auto max-h-[clamp(320px,46vh,560px)] w-full"
          >
            <title>{chartLabel}</title>
            {heatmap.types.map((type, rowIndex) => (
              <text
                key={type}
                x={CHART_LEFT - 8}
                y={CHART_TOP + rowIndex * cellHeight + cellHeight / 2 + 3}
                textAnchor="end"
                fontSize={11}
                fill="var(--color-muted)"
              >
                {type}
              </text>
            ))}
            {heatmap.decades.map((decade, columnIndex) => (
              <text
                key={decade}
                x={CHART_LEFT + columnIndex * cellWidth + cellWidth / 2}
                y={SVG_HEIGHT - CHART_BOTTOM + 18}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted)"
              >
                {formatDecade(decade)}
              </text>
            ))}
            {heatmap.cells.map((cell) => {
              const rowIndex = heatmap.types.indexOf(cell.type);
              const columnIndex = heatmap.decades.indexOf(cell.decade);
              const x = CHART_LEFT + columnIndex * cellWidth + CELL_GAP / 2;
              const y = CHART_TOP + rowIndex * cellHeight + CELL_GAP / 2;
              return (
                <g key={`${cell.type}-${cell.decade}`}>
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(1, cellWidth - CELL_GAP)}
                    height={Math.max(1, cellHeight - CELL_GAP)}
                    fill={cellColor(cell.count)}
                    rx={2}
                  />
                  <text
                    x={x + (cellWidth - CELL_GAP) / 2}
                    y={y + (cellHeight - CELL_GAP) / 2 + 3}
                    textAnchor="middle"
                    fontSize={11}
                    fill={
                      cell.count === 0
                        ? 'var(--color-muted)'
                        : cellTextColor(
                            cell.count,
                            heatmap.maxCount,
                            HEATMAP_BG[isDark ? 'dark' : 'light'],
                          )
                    }
                  >
                    {cell.count}
                  </text>
                </g>
              );
            })}
          </svg>
          <ChartDataTable
            summary="Hamilton playground counts by type and decade"
            columns={tableColumns}
            rows={heatmap.cells}
          />
        </div>
      )}
    </div>
  );
}
