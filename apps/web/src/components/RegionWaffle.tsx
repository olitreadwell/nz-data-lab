'use client';

import { useMemo, useState } from 'react';

import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import {
  CENSUS_POPULATION_YEARS,
  REGION_POPULATION_TOTALS,
  REGION_POPULATIONS,
  regionSharePercent,
  regionWaffleCells,
} from '@/lib/region-waffle-data';
import type { CensusPopulationYear } from '@/lib/region-waffle-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

function formatCount(value: number): string {
  return value.toLocaleString('en-NZ');
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

interface RegionRow {
  name: string;
  y2013: number;
  y2018: number;
  y2023: number;
}

/**
 * Census usually resident population by regional council area, drawn as a
 * waffle chart: one cell per 1 percent of the census population, coloured by
 * region, for the 2013, 2018, or 2023 Census. Toggle the census year or
 * search for a region to watch its share.
 */
export function RegionWaffle(): React.ReactElement {
  const [year, setYear] = useState<CensusPopulationYear>(2023);
  const [query, setQuery] = useState('');

  const tableRows = useMemo<RegionRow[]>(
    () =>
      REGION_POPULATIONS.map((region) => ({
        name: region.name,
        y2013: region.countsByYear[2013],
        y2018: region.countsByYear[2018],
        y2023: region.countsByYear[2023],
      })),
    [],
  );

  const tableColumns: ChartDataColumn<RegionRow>[] = [
    { key: 'name', header: 'Region' },
    { key: 'y2013', header: '2013 Census', format: (value) => formatCount(Number(value)) },
    { key: 'y2018', header: '2018 Census', format: (value) => formatCount(Number(value)) },
    { key: 'y2023', header: '2023 Census', format: (value) => formatCount(Number(value)) },
  ];

  const cellCounts = useMemo(() => regionWaffleCells(year), [year]);

  const cells = useMemo(() => {
    const filled: Array<{ regionKey: string; regionName: string; share: number }> = [];
    REGION_POPULATIONS.forEach((region, index) => {
      const count = cellCounts[index] ?? 0;
      for (let cell = 0; cell < count; cell += 1) {
        filled.push({
          regionKey: region.key,
          regionName: region.name,
          share: regionSharePercent(region, year),
        });
      }
    });
    return filled;
  }, [cellCounts, year]);

  const normalizedQuery = query.trim().toLowerCase();
  const chartLabel = `New Zealand census usually resident population by region at the ${year} Census, one cell per 1 percent of the population`;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Census year to show"
          className="flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
        >
          {CENSUS_POPULATION_YEARS.map((option, index) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={year === option}
              onClick={() => setYear(option)}
              onKeyDown={(event) =>
                handleRadioGroupKeyDown(event, index, CENSUS_POPULATION_YEARS, setYear)
              }
              className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
            >
              {option}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <span className="sr-only">Find a region</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a region"
            className="w-40 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-fg)]"
          />
        </label>
      </div>
      <div role="img" aria-label={chartLabel}>
        <ul className="grid grid-cols-10 gap-1">
          {cells.map((cell, cellIndex) => {
            const region = REGION_POPULATIONS.find((candidate) => candidate.key === cell.regionKey);
            if (region === undefined) {
              return null;
            }
            const dimmed =
              normalizedQuery !== '' && !region.name.toLowerCase().includes(normalizedQuery);
            return (
              <li
                key={cellIndex}
                aria-hidden="true"
                title={`${region.name}, ${formatPercent(cell.share)} of the census population`}
                className="aspect-square rounded-[2px]"
                style={{
                  backgroundColor: region.color,
                  opacity: dimmed ? 0.15 : 1,
                }}
              />
            );
          })}
        </ul>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        Each cell is one percent of the census usually resident population count. The {year} Census
        counted {formatCount(REGION_POPULATION_TOTALS[year])} people in regional council areas.
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
        {REGION_POPULATIONS.map((region) => {
          const matches =
            normalizedQuery === '' || region.name.toLowerCase().includes(normalizedQuery);
          return (
            <li
              key={region.key}
              className={`flex items-center gap-2 text-sm ${
                matches ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)] opacity-50'
              }`}
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 rounded-[var(--radius-sm)]"
                style={{ backgroundColor: region.color }}
              />
              <span className="flex-1">{region.name}</span>
              <span className="numeral-text-eyebrow">
                {formatPercent(regionSharePercent(region, year))}
              </span>
            </li>
          );
        })}
      </ul>
      <ChartDataTable
        summary="View the regional population counts as a table"
        columns={tableColumns}
        rows={tableRows}
      />
    </div>
  );
}
