'use client';

import { useMemo, useState } from 'react';

import { formatRankOrdinal } from '@/lib/census-rank-data';
import {
  EXPORT_RANK_COUNTRIES,
  EXPORT_RANK_YEARS,
  formatExportBillions,
} from '@/lib/export-rank-data';
import type { ExportRankCountry } from '@/lib/export-rank-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 720;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 132;
const PLOT_TOP = 24;
const PLOT_BOTTOM = 36;
const ROW_HEIGHT = 36;
const MAX_RANK = 10;
const LABEL_FONT_SIZE = 12;

type TopCount = 5 | 8;

const TOP_OPTIONS = [
  ['8', 'Top 8'],
  ['5', 'Top 5'],
] as const;

const HOVER_FADE = 0.15;

function xForYear(yearIndex: number): number {
  const plotWidth = SVG_WIDTH - PLOT_LEFT - PLOT_RIGHT;
  return PLOT_LEFT + (yearIndex / (EXPORT_RANK_YEARS.length - 1)) * plotWidth;
}

function yForRank(rank: number): number {
  return PLOT_TOP + (rank - 1) * ROW_HEIGHT + ROW_HEIGHT / 2;
}

interface RankRow {
  country: string;
  y2015: string;
  y2016: string;
  y2017: string;
  y2018: string;
  y2019: string;
  y2020: string;
  exports2020: string;
}

/**
 * Rank of New Zealand's top export destinations in each year ended March
 * 2015 to 2020, drawn as a bump chart: one line per country, with rank 1 at
 * the top. Hover a line to highlight it, or toggle between the top 8 and
 * top 5 markets.
 */
export function ExportRankBump(): React.ReactElement {
  const [topCount, setTopCount] = useState<TopCount>(8);
  const [hoveredKey, setHoveredKey] = useState<string | undefined>(undefined);

  const countries = useMemo(() => EXPORT_RANK_COUNTRIES.slice(0, topCount), [topCount]);

  const plotHeight = MAX_RANK * ROW_HEIGHT;
  const chartHeight = PLOT_TOP + plotHeight + PLOT_BOTTOM;

  const chartLabel = `New Zealand goods and services export destination ranks, years ended March 2015 to 2020, top ${topCount} markets, rank 1 at the top`;

  const tableRows: RankRow[] = countries.map((country) => ({
    country: country.label,
    y2015: formatRankOrdinal(country.ranksByYear[2015]),
    y2016: formatRankOrdinal(country.ranksByYear[2016]),
    y2017: formatRankOrdinal(country.ranksByYear[2017]),
    y2018: formatRankOrdinal(country.ranksByYear[2018]),
    y2019: formatRankOrdinal(country.ranksByYear[2019]),
    y2020: formatRankOrdinal(country.ranksByYear[2020]),
    exports2020: formatExportBillions(country.exportsByYear[2020]),
  }));

  const tableColumns: ChartDataColumn<RankRow>[] = [
    { key: 'country', header: 'Market' },
    { key: 'y2015', header: '2015' },
    { key: 'y2016', header: '2016' },
    { key: 'y2017', header: '2017' },
    { key: 'y2018', header: '2018' },
    { key: 'y2019', header: '2019' },
    { key: 'y2020', header: '2020' },
    { key: 'exports2020', header: 'Exports YE Mar 2020' },
  ];

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="How many markets to show"
        className="mb-3 flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
      >
        {TOP_OPTIONS.map(([value, label], index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={topCount === Number(value)}
            onClick={() => setTopCount(Number(value) as TopCount)}
            onKeyDown={(event) =>
              handleRadioGroupKeyDown(event, index, TOP_OPTIONS, ([next]) =>
                setTopCount(Number(next) as TopCount),
              )
            }
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
          >
            {label}
          </button>
        ))}
      </div>
      <div role="img" aria-label={chartLabel}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
          className="h-auto w-full"
          aria-hidden="true"
        >
          {Array.from({ length: MAX_RANK }, (_, rankIndex) => {
            const rank = rankIndex + 1;
            const y = yForRank(rank);
            return (
              <g key={rank}>
                <line
                  x1={PLOT_LEFT}
                  y1={y}
                  x2={SVG_WIDTH - PLOT_RIGHT}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <text
                  x={PLOT_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={LABEL_FONT_SIZE}
                  fill="var(--color-muted)"
                >
                  {rank}
                </text>
              </g>
            );
          })}
          {EXPORT_RANK_YEARS.map((year, yearIndex) => {
            const x = xForYear(yearIndex);
            return (
              <text
                key={year}
                x={x}
                y={chartHeight - 12}
                textAnchor="middle"
                fontSize={LABEL_FONT_SIZE}
                fill="var(--color-muted)"
              >
                Mar {year}
              </text>
            );
          })}
          {countries.map((country: ExportRankCountry) => {
            const points = EXPORT_RANK_YEARS.map(
              (year, yearIndex) => `${xForYear(yearIndex)},${yForRank(country.ranksByYear[year])}`,
            ).join(' ');
            const highlighted = hoveredKey === country.key;
            const faded = hoveredKey !== undefined && !highlighted;
            return (
              <g
                key={country.key}
                onMouseEnter={() => setHoveredKey(country.key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                opacity={faded ? HOVER_FADE : 1}
              >
                <title>{`${country.label}: ${formatRankOrdinal(
                  country.ranksByYear[2020],
                )} in the year ended March 2020`}</title>
                <polyline
                  points={points}
                  fill="none"
                  stroke={country.color}
                  strokeWidth={highlighted ? 4 : 2.5}
                  strokeLinejoin="round"
                />
                {EXPORT_RANK_YEARS.map((year, yearIndex) => (
                  <circle
                    key={year}
                    cx={xForYear(yearIndex)}
                    cy={yForRank(country.ranksByYear[year])}
                    r={highlighted ? 5 : 3.5}
                    fill={country.color}
                  />
                ))}
                <text
                  x={SVG_WIDTH - PLOT_RIGHT + 10}
                  y={yForRank(country.ranksByYear[2020]) + 4}
                  fontSize={LABEL_FONT_SIZE}
                  fontWeight={700}
                  fill={country.color}
                >
                  {country.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        Rank 1 sits at the top. The line for each market runs from the year ended March 2015 to the
        year ended March 2020, and the label sits at the market's final rank.
      </p>
      <ChartDataTable
        summary="View the export market ranks as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
