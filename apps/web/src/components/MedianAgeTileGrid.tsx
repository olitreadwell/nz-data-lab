'use client';

import { useMemo, useState } from 'react';

import { CENSUS_YEARS, MEDIAN_AGE_REGION_ROWS, medianAgeForYear } from '@/lib/median-age-data';
import type { CensusYear, MedianAgeRegionRow } from '@/lib/median-age-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const SVG_HEIGHT = 380;
const PLOT_LEFT = 24;
const PLOT_TOP = 20;
const TILE_WIDTH = 156;
const TILE_HEIGHT = 76;
const TILE_GAP_X = 14;
const TILE_GAP_Y = 12;
const FONT_SIZE = 12;
const MIN_MEDIAN = 34;
const MAX_MEDIAN = 49;
const YOUNG_FILL = '#e0f2fe';
const OLD_FILL = '#c4b5fd';
const YOUNG_TEXT = '#075985';
const OLD_TEXT = '#5b21b6';
const HIGHLIGHT_STROKE = '#1e293b';

const YEAR_OPTIONS = CENSUS_YEARS.map(
  (year) => [String(year), `${year} census`] as [string, string],
);

function medianT(median: number): number {
  return Math.min(1, Math.max(0, (median - MIN_MEDIAN) / (MAX_MEDIAN - MIN_MEDIAN)));
}

/** Interpolates between two hex colors by a fraction in [0, 1]. */
function mixColors(from: string, to: string, t: number): string {
  const fromValue = Number.parseInt(from.slice(1), 16);
  const toValue = Number.parseInt(to.slice(1), 16);
  const channel = (shift: number): number => {
    const fromChannel = (fromValue >> shift) & 0xff;
    const toChannel = (toValue >> shift) & 0xff;
    return Math.round(fromChannel + (toChannel - fromChannel) * t);
  };
  const red = channel(16);
  const green = channel(8);
  const blue = channel(0);
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function tileX(column: number): number {
  return PLOT_LEFT + column * (TILE_WIDTH + TILE_GAP_X);
}

function tileY(row: number): number {
  return PLOT_TOP + row * (TILE_HEIGHT + TILE_GAP_Y);
}

function formatMedian(value: number): string {
  return `${value.toFixed(1)} years`;
}

/** Tooltip line for one region under the chart. */
function formatRowSummary(row: MedianAgeRegionRow, year: CensusYear): string {
  const median = medianAgeForYear(row, year);
  const change = median - row.median2013;
  const direction = change === 0 ? 'unchanged' : change > 0 ? 'up' : 'down';
  return `${row.name}: median age ${median.toFixed(1)} in ${year}, ${direction} ${Math.abs(change).toFixed(1)} years since 2013.`;
}

/**
 * Census median age by regional council area across the 2013, 2018, and
 * 2023 censuses, drawn as a tile grid map: each region is a tile in a grid
 * that reads north to south, coloured by median age. Toggle the census
 * year or hover a tile to read its value. Source: Stats NZ 2023 Census
 * population counts release (Table 7).
 */
export function MedianAgeTileGrid(): React.ReactElement {
  const [year, setYear] = useState<CensusYear>(2023);
  const [highlightedKey, setHighlightedKey] = useState<string | undefined>(undefined);

  const highlightedRow =
    highlightedKey === undefined
      ? undefined
      : MEDIAN_AGE_REGION_ROWS.find((row) => row.key === highlightedKey);

  const chartLabel = `Median age by regional council area, ${year} census`;

  const tableRows = MEDIAN_AGE_REGION_ROWS.map((row) => ({
    name: row.name,
    median2013: row.median2013,
    median2018: row.median2018,
    median2023: row.median2023,
    change: row.median2023 - row.median2013,
  }));

  const tableColumns: ChartDataColumn<(typeof tableRows)[number]>[] = [
    { key: 'name', header: 'Region' },
    { key: 'median2013', header: '2013', format: (value) => formatMedian(Number(value)) },
    { key: 'median2018', header: '2018', format: (value) => formatMedian(Number(value)) },
    { key: 'median2023', header: '2023', format: (value) => formatMedian(Number(value)) },
    {
      key: 'change',
      header: 'Change 2013-2023',
      format: (value) => {
        const change = Number(value);
        return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
      },
    },
  ];

  const orderedRows = useMemo(
    () => [...MEDIAN_AGE_REGION_ROWS].sort((a, b) => a.row - b.row || a.column - b.column),
    [],
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Which census year to show"
          className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
        >
          {YEAR_OPTIONS.map(([value, label], index) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={year === Number(value)}
              onClick={() => setYear(Number(value) as CensusYear)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(event, index, YEAR_OPTIONS, ([next]) =>
                  setYear(Number(next) as CensusYear),
                )
              }
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]">
          Lighter tiles are younger regions, darker tiles are older
        </p>
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-auto w-full"
          aria-hidden="true"
        >
          {orderedRows.map((row) => {
            const median = medianAgeForYear(row, year);
            const t = medianT(median);
            const highlighted = row.key === highlightedKey;
            return (
              <g
                key={row.key}
                onMouseEnter={() => setHighlightedKey(row.key)}
                onMouseLeave={() => setHighlightedKey(undefined)}
                className="cursor-pointer"
              >
                <rect
                  x={tileX(row.column)}
                  y={tileY(row.row)}
                  width={TILE_WIDTH}
                  height={TILE_HEIGHT}
                  rx={8}
                  fill={mixColors(YOUNG_FILL, OLD_FILL, t)}
                  stroke={highlighted ? HIGHLIGHT_STROKE : 'var(--color-border)'}
                  strokeWidth={highlighted ? 2 : 1}
                >
                  <title>{formatRowSummary(row, year)}</title>
                </rect>
                <text
                  x={tileX(row.column) + 12}
                  y={tileY(row.row) + 26}
                  fontSize={FONT_SIZE}
                  fontWeight={600}
                  fill={mixColors(YOUNG_TEXT, OLD_TEXT, t)}
                >
                  {row.name}
                </text>
                <text
                  x={tileX(row.column) + 12}
                  y={tileY(row.row) + 50}
                  fontSize={18}
                  fontWeight={700}
                  fill={mixColors(YOUNG_TEXT, OLD_TEXT, t)}
                >
                  {median.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p aria-live="polite" className="numeral-paragraph-sm mt-2 min-h-5 text-[var(--color-muted)]">
        {highlightedRow === undefined
          ? 'Hover a tile to read a region.'
          : formatRowSummary(highlightedRow, year)}
      </p>
      <ChartDataTable
        summary="Show the median ages for every region as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
