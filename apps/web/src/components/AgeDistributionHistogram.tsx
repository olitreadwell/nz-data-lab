'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import {
  AGE_BAND_ROWS,
  AGE_DISTRIBUTION_TOTALS,
  AGE_DISTRIBUTION_YEARS,
} from '@/lib/age-distribution-data';
import type { AgeBandRow } from '@/lib/age-distribution-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const COMPACT_FORMATTER = new Intl.NumberFormat('en-NZ', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

interface BandTooltipProps extends TooltipContentProps {
  year: number;
}

/** Tooltip shown while hovering an age band. */
function BandTooltip({ active, payload, year }: BandTooltipProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const band = payload[0]?.payload as { band: string; population: number } | undefined;
  if (band === undefined) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">Age {band.band}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {band.population.toLocaleString('en-NZ')} people in {year}
      </p>
    </div>
  );
}

/**
 * National age distribution in five-year bands across the 2013, 2018, and
 * 2023 censuses, drawn as a histogram. Drag the year slider to move the
 * bulge up the age ladder. Source: Stats NZ 2023 Census population counts
 * release (Table 6).
 */
export function AgeDistributionHistogram(): React.ReactElement {
  const [yearIndex, setYearIndex] = useState(2);
  const year = AGE_DISTRIBUTION_YEARS[yearIndex] ?? 2023;

  const chartRows = useMemo(
    () =>
      AGE_BAND_ROWS.map((row) => ({
        band: row.band,
        population: row[`population${year}`],
      })),
    [year],
  );

  const tableColumns: ChartDataColumn<AgeBandRow>[] = [
    { key: 'band', header: 'Age band' },
    {
      key: 'population2013',
      header: '2013 census',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    {
      key: 'population2018',
      header: '2018 census',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    {
      key: 'population2023',
      header: '2023 census',
      format: (value) => value.toLocaleString('en-NZ'),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label
          htmlFor="age-distribution-year"
          className="numeral-paragraph-sm text-[var(--color-muted)]"
        >
          Census year
        </label>
        <input
          id="age-distribution-year"
          type="range"
          min={0}
          max={AGE_DISTRIBUTION_YEARS.length - 1}
          step={1}
          value={yearIndex}
          aria-valuetext={String(year)}
          onChange={(event) => setYearIndex(Number(event.target.value))}
          className="w-40"
        />
        <span className="numeral-paragraph-sm text-[var(--color-fg)]">{year}</span>
      </div>
      <div role="img" aria-label={`Age distribution in the ${year} census`} className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartRows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="band"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatCount}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            />
            <Tooltip
              content={(props) => <BandTooltip {...props} year={year} />}
              cursor={{ fill: 'var(--color-border)' }}
            />
            <Bar dataKey="population" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]" aria-live="polite">
        {AGE_DISTRIBUTION_TOTALS[year].toLocaleString('en-NZ')} people counted in the {year} census.
      </p>
      <ChartDataTable
        summary="View the age distribution as a table"
        columns={tableColumns}
        rows={AGE_BAND_ROWS}
      />
    </div>
  );
}
