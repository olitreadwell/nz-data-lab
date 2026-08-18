'use client';

import { useMemo, useState } from 'react';

import { AGE_PYRAMID_POPULATION } from '@/lib/age-pyramid-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';
import type { AgeBandPopulation } from '@/lib/age-pyramid-data';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const MALE_COLOR = '#0284c7';
const FEMALE_COLOR = '#e11d48';

type SexView = 'both' | 'male' | 'female';

const SEX_OPTIONS = [
  ['both', 'Male and female'],
  ['male', 'Male only'],
  ['female', 'Female only'],
] as const;

/** The widest band sets the bar scale for the whole pyramid. */
const MAX_BAND_TOTAL = Math.max(...AGE_PYRAMID_POPULATION.map((band) => band.total));

function barWidth(count: number): number {
  return Math.round((count / MAX_BAND_TOTAL) * 100);
}

/**
 * Population estimates by sex and 5-year age group for 1 July 2021 (UNSD
 * Demographic and Social Statistics), drawn as a population pyramid: male
 * bars extend left from the centre, female bars right. Toggle to view one
 * sex at a time.
 */
export function AgePyramid(): React.ReactElement {
  const [view, setView] = useState<SexView>('both');

  const bands = useMemo(() => [...AGE_PYRAMID_POPULATION].reverse(), []);

  const chartLabel =
    view === 'both'
      ? 'New Zealand population by sex and 5-year age group, 1 July 2021 estimates'
      : `New Zealand ${view} population by 5-year age group, 1 July 2021 estimates`;

  const tableColumns: ChartDataColumn<AgeBandPopulation>[] = [
    { key: 'label', header: 'Age group' },
    { key: 'male', header: 'Male', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'female', header: 'Female', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'total', header: 'Total', format: (value) => value.toLocaleString('en-NZ') },
  ];

  const legendItems = (
    [
      ['male', 'Male', MALE_COLOR],
      ['female', 'Female', FEMALE_COLOR],
    ] as const
  ).filter(([sex]) => view === 'both' || view === sex);

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Sex to display"
        className="mb-3 flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
      >
        {SEX_OPTIONS.map(([value, label], index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={view === value}
            tabIndex={view === value ? 0 : -1}
            onClick={() => setView(value)}
            onKeyDown={(event) =>
              handleRadioGroupKeyDown(event, index, SEX_OPTIONS, ([value]) => setView(value))
            }
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mb-3 flex gap-4" aria-label="Chart legend">
        {legendItems.map(([sex, label, color]) => (
          <li key={sex} className="flex items-center gap-2 text-sm text-[var(--color-fg)]">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-[var(--radius-sm)]"
              style={{ backgroundColor: color }}
            />
            {label}
          </li>
        ))}
      </ul>
      <div role="img" aria-label={chartLabel}>
        <ul className="space-y-1">
          {bands.map((band) => {
            const maleWidth = view === 'female' ? 0 : barWidth(band.male);
            const femaleWidth = view === 'male' ? 0 : barWidth(band.female);
            return (
              <li key={band.label} className="grid grid-cols-[1fr_5rem_1fr] items-center gap-2">
                <div className="flex justify-end">
                  <div
                    className="h-5 rounded-r-[var(--radius-sm)]"
                    style={{ width: `${maleWidth}%`, backgroundColor: MALE_COLOR }}
                  />
                </div>
                <p className="numeral-text-eyebrow text-center text-[var(--color-muted)]">
                  {band.label}
                </p>
                <div className="flex justify-start">
                  <div
                    className="h-5 rounded-l-[var(--radius-sm)]"
                    style={{ width: `${femaleWidth}%`, backgroundColor: FEMALE_COLOR }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <ChartDataTable
        summary="View the age pyramid as a table"
        columns={tableColumns}
        rows={AGE_PYRAMID_POPULATION}
      />
    </div>
  );
}
