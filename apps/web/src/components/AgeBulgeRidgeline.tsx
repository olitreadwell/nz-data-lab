'use client';

import { useMemo, useState } from 'react';

import { AGE_BULGE_BANDS, AGE_BULGE_MAX_COUNT, AGE_BULGE_YEARS } from '@/lib/age-bulge-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const PLOT_LEFT = 52;
const PLOT_RIGHT = 8;
const PLOT_TOP = 20;
const RIDGE_HEIGHT = 96;
const RIDGE_GAP = 10;
const X_LABEL_HEIGHT = 40;
const BAND_COUNT = AGE_BULGE_BANDS.length;
const MAX_RIDGE_COUNT = AGE_BULGE_MAX_COUNT;
const BAND_WIDTH = (SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT) / (BAND_COUNT - 1);

type RidgeMode = 'all' | 2013 | 2018 | 2023;

const MODE_OPTIONS = [
  ['all', 'All three censuses'],
  [2013, '2013 only'],
  [2018, '2018 only'],
  [2023, '2023 only'],
] as const;

const YEAR_COLORS: Record<2013 | 2018 | 2023, string> = {
  2013: '#cbd5e1',
  2018: '#f59e0b',
  2023: '#0ea5e9',
};

const COUNTS_BY_YEAR: Record<2013 | 2018 | 2023, number[]> = {
  2013: AGE_BULGE_YEARS[0]?.counts ?? [],
  2018: AGE_BULGE_YEARS[1]?.counts ?? [],
  2023: AGE_BULGE_YEARS[2]?.counts ?? [],
};

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function visibleYears(mode: RidgeMode): Array<2013 | 2018 | 2023> {
  if (mode === 'all') {
    return [2013, 2018, 2023];
  }
  return [mode];
}

function bandCenter(index: number): number {
  return PLOT_LEFT + index * BAND_WIDTH;
}

function bandCount(year: 2013 | 2018 | 2023, bandIndex: number): number {
  return COUNTS_BY_YEAR[year][bandIndex] ?? 0;
}

function peakCountForYear(year: 2013 | 2018 | 2023): number {
  return Math.max(...COUNTS_BY_YEAR[year]);
}

/**
 * Census population by five-year age group in 2013, 2018, and 2023, drawn as
 * a ridgeline chart: one filled ridge per census year, sharing the age axis,
 * so the biggest band of each census is easy to compare. Hover a band to
 * read the count in every visible year.
 */
export function AgeBulgeRidgeline(): React.ReactElement {
  const [mode, setMode] = useState<RidgeMode>('all');
  const [hoveredBand, setHoveredBand] = useState<number | undefined>(undefined);

  const years = useMemo(() => visibleYears(mode), [mode]);

  const chartHeight =
    PLOT_TOP + years.length * RIDGE_HEIGHT + (years.length - 1) * RIDGE_GAP + X_LABEL_HEIGHT;

  const chartLabel =
    mode === 'all'
      ? 'New Zealand population by five-year age group, 2013, 2018, and 2023 censuses'
      : `New Zealand population by five-year age group, ${String(mode)} census`;

  const tableRows = AGE_BULGE_BANDS.map((band, index) => ({
    band,
    y2013: COUNTS_BY_YEAR[2013][index] ?? 0,
    y2018: COUNTS_BY_YEAR[2018][index] ?? 0,
    y2023: COUNTS_BY_YEAR[2023][index] ?? 0,
  }));

  const tableColumns: ChartDataColumn<(typeof tableRows)[number]>[] = [
    { key: 'band', header: 'Age group' },
    { key: 'y2013', header: '2013 Census', format: (value) => formatCount(Number(value)) },
    { key: 'y2018', header: '2018 Census', format: (value) => formatCount(Number(value)) },
    { key: 'y2023', header: '2023 Census', format: (value) => formatCount(Number(value)) },
  ];

  const hoveredBandLabel = hoveredBand === undefined ? undefined : AGE_BULGE_BANDS[hoveredBand];
  const readout =
    hoveredBand === undefined || hoveredBandLabel === undefined
      ? 'Hover a band to read its count in each census.'
      : `${hoveredBandLabel}: ${years
          .map((year) => `${formatCount(bandCount(year, hoveredBand))} (${year})`)
          .join(', ')}`;

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Which census years to show"
        className="mb-3 flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
      >
        {MODE_OPTIONS.map(([value, label], index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            onKeyDown={(event) =>
              handleRadioGroupKeyDown(event, index, MODE_OPTIONS, ([value]) => setMode(value))
            }
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mb-3 flex gap-4" aria-label="Chart legend">
        {years.map((year) => (
          <li key={year} className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-[var(--radius-sm)]"
              style={{ backgroundColor: YEAR_COLORS[year] }}
            />
            {year}
          </li>
        ))}
      </ul>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
          className="mx-auto h-auto max-h-[clamp(320px,46vh,560px)] w-full"
          aria-hidden="true"
        >
          {AGE_BULGE_BANDS.map((band, index) => {
            if (index % 2 === 1) {
              return null;
            }
            const x = bandCenter(index);
            return (
              <text
                key={band}
                x={x}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize={11}
                fill="var(--color-muted)"
              >
                {band}
              </text>
            );
          })}
          {years.map((year, ridgeIndex) => {
            const baseY = PLOT_TOP + ridgeIndex * (RIDGE_HEIGHT + RIDGE_GAP) + RIDGE_HEIGHT;
            const points = AGE_BULGE_BANDS.map((_, index) => {
              const count = bandCount(year, index);
              return `${bandCenter(index)},${baseY - (count / MAX_RIDGE_COUNT) * RIDGE_HEIGHT}`;
            });
            const ridgePath = `M ${PLOT_LEFT},${baseY} L ${points.join(' L ')} L ${
              SVG_WIDTH - PLOT_RIGHT
            },${baseY} Z`;
            return (
              <g key={year}>
                <path d={ridgePath} fill={YEAR_COLORS[year]} opacity={0.85} />
                <text
                  x={PLOT_LEFT - 6}
                  y={baseY - 4}
                  textAnchor="end"
                  fontSize={12}
                  fontWeight={700}
                  fill="var(--color-fg)"
                >
                  {year}
                </text>
                <text
                  x={SVG_WIDTH - PLOT_RIGHT}
                  y={baseY - 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="var(--color-muted)"
                >
                  peak {formatCount(peakCountForYear(year))}
                </text>
              </g>
            );
          })}
          {hoveredBand !== undefined ? (
            <line
              x1={bandCenter(hoveredBand)}
              y1={PLOT_TOP}
              x2={bandCenter(hoveredBand)}
              y2={PLOT_TOP + years.length * RIDGE_HEIGHT + (years.length - 1) * RIDGE_GAP}
              stroke="var(--color-fg)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ) : null}
          <rect
            x={PLOT_LEFT}
            y={PLOT_TOP}
            width={SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT}
            height={years.length * RIDGE_HEIGHT + (years.length - 1) * RIDGE_GAP}
            fill="transparent"
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const relativeX = event.clientX - rect.left;
              const bandIndex = Math.round((relativeX - PLOT_LEFT) / BAND_WIDTH);
              setHoveredBand(Math.max(0, Math.min(BAND_COUNT - 1, bandIndex)));
            }}
            onMouseLeave={() => setHoveredBand(undefined)}
          />
        </svg>
      </div>
      <p
        className="numeral-paragraph-sm text-[var(--color-muted)]"
        aria-live="polite"
        data-testid="age-bulge-readout"
      >
        {readout}
      </p>
      <ChartDataTable
        summary="View the age band figures as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
