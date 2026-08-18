'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveCasCrashes } from '@/lib/live-sources';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import type { LiveCasCrashCell } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 480;
const CHART_LEFT = 150;
const CHART_RIGHT = 16;
const CHART_TOP = 24;
const CHART_BOTTOM = 44;
const MIN_YEAR = 2006;
const MAX_YEAR = 2026;

type CrashMode = 'all' | 'fatal';

const CRASH_OPTIONS = ['all', 'fatal'] as const;

interface HeatmapCell {
  region: string;
  year: number;
  count: number;
}

interface HeatmapCellRow {
  region: string;
  year: number;
  count: number;
}

/**
 * Live NZTA Crash Analysis System data drawn as a heatmap of crashes by
 * region and year. Toggle between all crashes and fatal crashes, or drag the
 * slider to narrow the year window.
 */
export function RoadCrashTrend(): React.ReactElement {
  const [allCells, setAllCells] = useState<LiveCasCrashCell[]>([]);
  const [fatalCells, setFatalCells] = useState<LiveCasCrashCell[]>([]);
  const [mode, setMode] = useState<CrashMode>('all');
  const [endYear, setEndYear] = useState<number>(MAX_YEAR);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCrashes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allRows, fatalRows] = await Promise.all([
        fetchLiveCasCrashes(false),
        fetchLiveCasCrashes(true),
      ]);
      setAllCells(allRows);
      setFatalCells(fatalRows);
    } catch {
      setError('NZTA did not answer. Try again in a moment.');
      setAllCells([]);
      setFatalCells([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCrashes();
  }, [loadCrashes]);

  const cells = mode === 'all' ? allCells : fatalCells;

  const regionTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const cell of cells) {
      totals.set(cell.region, (totals.get(cell.region) ?? 0) + cell.count);
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([region]) => region);
  }, [cells]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = MIN_YEAR; year <= endYear; year += 1) {
      list.push(year);
    }
    return list;
  }, [endYear]);

  const grid = useMemo<HeatmapCell[][]>(() => {
    const lookup = new Map(cells.map((cell) => [`${cell.region}|${cell.year}`, cell.count]));
    return regionTotals.map((region) =>
      years.map((year) => ({ region, year, count: lookup.get(`${region}|${year}`) ?? 0 })),
    );
  }, [cells, regionTotals, years]);

  const maxCount = useMemo(() => Math.max(...cells.map((cell) => cell.count), 1), [cells]);
  const windowTotal = useMemo(
    () => grid.reduce((sum, row) => sum + row.reduce((rowSum, cell) => rowSum + cell.count, 0), 0),
    [grid],
  );
  const plotWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const plotHeight = SVG_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const cellWidth = years.length === 0 ? 0 : plotWidth / years.length;
  const cellHeight = regionTotals.length === 0 ? 0 : plotHeight / regionTotals.length;
  const chartLabel =
    mode === 'all'
      ? `Crashes by region and year, ${MIN_YEAR} to ${endYear}`
      : `Fatal crashes by region and year, ${MIN_YEAR} to ${endYear}`;

  const tableRows = useMemo<HeatmapCellRow[]>(
    () => grid.flatMap((row) => row.map((cell) => ({ ...cell }))),
    [grid],
  );

  const tableColumns: ChartDataColumn<HeatmapCellRow>[] = [
    { key: 'region', header: 'Region' },
    { key: 'year', header: 'Year' },
    { key: 'count', header: 'Crashes', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Counting the crashes...'
          : (error ??
            `${windowTotal.toLocaleString('en-NZ')} crashes in view, fetched live from the NZTA Crash Analysis System.`)}
      </p>
      {!isLoading && error === null && allCells.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <div role="radiogroup" aria-label="Crash type" className="flex items-center gap-2">
              {CRASH_OPTIONS.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={mode === option}
                  onClick={() => setMode(option)}
                  onKeyDown={(event) =>
                    handleRadioGroupKeyDown(event, index, CRASH_OPTIONS, setMode)
                  }
                  className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                    mode === option
                      ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                      : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                  }`}
                >
                  {option === 'all' ? 'All crashes' : 'Fatal crashes'}
                </button>
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm text-[var(--color-muted)]">
              Up to year
              <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={endYear}
                onChange={(event) => setEndYear(Number(event.target.value))}
                className="accent-[var(--color-fg)]"
              />
              <span className="numeral-paragraph-sm text-[var(--color-fg)]">{endYear}</span>
            </label>
          </div>
          <svg
            role="img"
            aria-label={chartLabel}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="h-auto w-full"
          >
            <title>{chartLabel}</title>
            {years.map((year, columnIndex) => {
              const x = CHART_LEFT + columnIndex * cellWidth;
              const showLabel = year % 2 === 0 || columnIndex === years.length - 1;
              return (
                <g key={year}>
                  {showLabel && (
                    <text
                      x={x + cellWidth / 2}
                      y={SVG_HEIGHT - CHART_BOTTOM + 16}
                      textAnchor="middle"
                      fontSize={9}
                      fill="var(--color-muted)"
                    >
                      {year}
                    </text>
                  )}
                </g>
              );
            })}
            {grid.map((row, rowIndex) => {
              const y = CHART_TOP + rowIndex * cellHeight;
              return (
                <g key={row[0]?.region ?? rowIndex}>
                  <text
                    x={CHART_LEFT - 8}
                    y={y + cellHeight / 2 + 3}
                    textAnchor="end"
                    fontSize={9}
                    fill="var(--color-muted)"
                  >
                    {row[0]?.region.replace(' Region', '') ?? ''}
                  </text>
                  {row.map((cell, columnIndex) => {
                    const x = CHART_LEFT + columnIndex * cellWidth;
                    const intensity = cell.count / maxCount;
                    return (
                      <rect
                        key={`${cell.region}-${cell.year}`}
                        x={x + 0.5}
                        y={y + 0.5}
                        width={Math.max(cellWidth - 1, 1)}
                        height={Math.max(cellHeight - 1, 1)}
                        fill="var(--color-fg)"
                        fillOpacity={0.06 + 0.94 * intensity}
                        rx={1}
                      >
                        <title>
                          {cell.region}, {cell.year}: {cell.count.toLocaleString('en-NZ')}{' '}
                          {mode === 'fatal' ? 'fatal crashes' : 'crashes'}
                        </title>
                      </rect>
                    );
                  })}
                </g>
              );
            })}
          </svg>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Darker cells mean more {mode === 'fatal' ? 'fatal crashes' : 'crashes'}. Open the table
            below to read the exact count for each region and year.
          </p>
          <ChartDataTable
            summary={`View the ${mode === 'fatal' ? 'fatal crashes' : 'crashes'} by region and year as a table`}
            columns={tableColumns}
            rows={tableRows}
          />
        </div>
      )}
    </div>
  );
}
