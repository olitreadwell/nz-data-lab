'use client';

import { useMemo, useState } from 'react';

import { ETHNICITY_GROUPS, ETHNICITY_MIX_YEARS } from '@/lib/ethnicity-mix-data';
import type { EthnicityMixYear } from '@/lib/ethnicity-mix-data';
import { ethnicitySharePercent } from '@/lib/ethnicity-mix-data';
import { handleRadioGroupKeyDown } from '@/lib/radio-group';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const CELL_COUNT = 100;

function shareToCells(sharePercent: number): number {
  return Math.round(sharePercent);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

interface EthnicityRow {
  group: string;
  y2013: number;
  y2018: number;
  y2023: number;
}

/**
 * Ethnic group for the census usually resident population in 2013, 2018,
 * and 2023, drawn as a unit chart: one row of 100 cells per ethnic group,
 * with one cell filled for each person in 100 who identified with that
 * group. The rows add past 100 because people can identify with more than
 * one group. Toggle the census year to watch the mix shift.
 */
export function EthnicityWaffle(): React.ReactElement {
  const [year, setYear] = useState<EthnicityMixYear>(2013);

  const rows = useMemo<EthnicityRow[]>(
    () =>
      ETHNICITY_GROUPS.map((group) => ({
        group: group.label,
        y2013: ethnicitySharePercent(group, 2013),
        y2018: ethnicitySharePercent(group, 2018),
        y2023: ethnicitySharePercent(group, 2023),
      })),
    [],
  );

  const tableColumns: ChartDataColumn<EthnicityRow>[] = [
    { key: 'group', header: 'Ethnic group' },
    { key: 'y2013', header: '2013 Census', format: (value) => formatPercent(Number(value)) },
    { key: 'y2018', header: '2018 Census', format: (value) => formatPercent(Number(value)) },
    { key: 'y2023', header: '2023 Census', format: (value) => formatPercent(Number(value)) },
  ];

  const chartLabel = `New Zealand ethnic group shares at the ${year} Census, out of every 100 people who stated an ethnicity`;

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Census year to show"
        className="mb-3 flex gap-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] p-1"
      >
        {ETHNICITY_MIX_YEARS.map((option, index) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={year === option}
            onClick={() => setYear(option)}
            onKeyDown={(event) =>
              handleRadioGroupKeyDown(event, index, ETHNICITY_MIX_YEARS, setYear)
            }
            className="rounded-[var(--radius-sm)] px-2 py-1 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] aria-checked:bg-[var(--color-border)]"
          >
            {option}
          </button>
        ))}
      </div>
      <div role="img" aria-label={chartLabel}>
        <ul className="space-y-4">
          {ETHNICITY_GROUPS.map((group) => {
            const share = ethnicitySharePercent(group, year);
            const filled = shareToCells(share);
            return (
              <li key={group.key}>
                <p className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2 text-[var(--color-fg)]">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-[var(--radius-sm)]"
                      style={{ backgroundColor: group.color }}
                    />
                    {group.label}
                  </span>
                  <span className="numeral-text-eyebrow text-[var(--color-muted)]">
                    {formatPercent(share)}
                  </span>
                </p>
                <ul
                  className="flex flex-wrap"
                  aria-label={`${group.label}, ${formatPercent(share)} of people at the ${year} Census`}
                >
                  {Array.from({ length: CELL_COUNT }, (_, cellIndex) => (
                    <li
                      key={cellIndex}
                      aria-hidden="true"
                      className="m-px h-2.5 w-2.5 rounded-[1px]"
                      style={{
                        backgroundColor: cellIndex < filled ? group.color : 'var(--color-border)',
                      }}
                    />
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        Each row is 100 people who stated an ethnicity, and the filled cells show how many
        identified with that group. The rows add past 100 because people can identify with more than
        one ethnic group.
      </p>
      <ChartDataTable
        summary="View the ethnic group shares as a table"
        columns={tableColumns}
        rows={rows}
      />
    </div>
  );
}
