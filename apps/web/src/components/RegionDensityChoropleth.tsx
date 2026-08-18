'use client';

import { useState } from 'react';

import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import {
  CENSUS_YEARS,
  DENSITY_BUCKETS,
  densityBucketIndex,
  densityFor,
  nationalDensity,
  REGION_DENSITY_ROWS,
  REGION_MAP_VIEW,
  REGION_SHAPES,
} from '@/lib/region-density-data';
import type { CensusYear, RegionDensityRow } from '@/lib/region-density-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const MAP_PADDING = 8;

function formatDensity(value: number): string {
  return `${value.toFixed(1)} per km²`;
}

interface DensityRow {
  name: string;
  population: number;
  density: number;
}

function populationOf(row: RegionDensityRow, year: CensusYear): number {
  return year === 2013 ? row.pop2013 : year === 2018 ? row.pop2018 : row.pop2023;
}

/** Regional council population density as a choropleth, with a census-year toggle. */
export function RegionDensityChoropleth(): React.ReactElement {
  const [year, setYear] = useState<CensusYear>(2023);
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);

  const densityByKey = new Map<string, number>(
    REGION_DENSITY_ROWS.map((row) => [row.key, densityFor(row, year)]),
  );
  const rowByKey = new Map<string, RegionDensityRow>(
    REGION_DENSITY_ROWS.map((row) => [row.key, row]),
  );

  const rows: DensityRow[] = REGION_DENSITY_ROWS.map((row) => ({
    name: row.name,
    population: populationOf(row, year),
    density: densityFor(row, year),
  }));

  const tableColumns: ChartDataColumn<DensityRow>[] = [
    { key: 'name', header: 'Regional council' },
    {
      key: 'population',
      header: 'Population',
      format: (value) => Number(value).toLocaleString('en-NZ'),
    },
    { key: 'density', header: 'Density', format: (value) => formatDensity(Number(value)) },
  ];

  return (
    <figure>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Census year" className="flex items-end gap-1">
          {CENSUS_YEARS.map((option, index) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={year === option}
              tabIndex={year === option ? 0 : -1}
              onClick={() => setYear(option)}
              onKeyDown={(event) => handleRadioGroupKeyDown(event, index, CENSUS_YEARS, setYear)}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-indigo-600 aria-checked:text-white"
            >
              {option}
            </button>
          ))}
        </div>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
          New Zealand: {nationalDensity(year).toFixed(1)} people per km²
        </p>
      </div>
      <svg
        role="img"
        aria-label={`Choropleth map of population density by regional council, ${year} census, people per square kilometre`}
        viewBox={`0 0 ${REGION_MAP_VIEW.width + MAP_PADDING * 2} ${REGION_MAP_VIEW.height + MAP_PADDING * 2}`}
        className="h-auto w-full"
      >
        {REGION_SHAPES.map((shape) => {
          const density = densityByKey.get(shape.key);
          const row = rowByKey.get(shape.key);
          const bucketIndex = densityBucketIndex(density ?? 0);
          const bucket = DENSITY_BUCKETS[bucketIndex];
          const isFocused = focusedKey === shape.key;
          return (
            <g
              key={shape.key}
              opacity={focusedKey === undefined || isFocused ? 1 : 0.45}
              onMouseEnter={() => setFocusedKey(shape.key)}
              onMouseLeave={() => setFocusedKey(undefined)}
              onFocus={() => setFocusedKey(shape.key)}
              onBlur={() => setFocusedKey(undefined)}
            >
              {shape.paths.map((d, pathIndex) => (
                <path
                  key={pathIndex}
                  d={d}
                  fill={bucket?.color ?? DENSITY_BUCKETS[0].color}
                  stroke={isFocused ? '#1e1b4b' : '#ffffff'}
                  strokeWidth={isFocused ? 1.5 : 0.6}
                  transform={`translate(${MAP_PADDING} ${MAP_PADDING})`}
                >
                  <title>{`${shape.name}: ${formatDensity(density ?? 0)}, ${year} census`}</title>
                </path>
              ))}
              <text
                x={shape.centroid.x + MAP_PADDING}
                y={shape.centroid.y + MAP_PADDING}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fill="#312e81"
                pointerEvents="none"
              >
                {row === undefined ? shape.name : row.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-3">
        {DENSITY_BUCKETS.map((bucket) => (
          <span
            key={bucket.color}
            className="flex items-center gap-1 text-xs text-[var(--color-muted)]"
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
              <rect width="12" height="12" fill={bucket.color} />
            </svg>
            {bucket.label}
          </span>
        ))}
      </div>
      <ChartDataTable
        summary={`Population density by regional council, ${year} census`}
        columns={tableColumns}
        rows={rows}
      />
    </figure>
  );
}
