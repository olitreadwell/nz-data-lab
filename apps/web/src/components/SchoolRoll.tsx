'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveNzSchools } from '@/lib/live-sources';
import type { LiveNzSchool } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

export type SchoolType =
  'primary' | 'intermediate' | 'secondary' | 'composite' | 'special' | 'other';

export type SchoolAuthority = 'state' | 'integrated' | 'private' | 'other';

const TYPE_LABELS: Record<SchoolType, string> = {
  primary: 'Primary',
  intermediate: 'Intermediate',
  secondary: 'Secondary',
  composite: 'Composite',
  special: 'Special',
  other: 'Other',
};

const AUTHORITY_LABELS: Record<SchoolAuthority, string> = {
  state: 'State',
  integrated: 'Integrated',
  private: 'Private',
  other: 'Other',
};

const AUTHORITY_COLORS: Record<SchoolAuthority, string> = {
  state: 'var(--color-fg)',
  integrated: '#0ea5e9',
  private: '#f59e0b',
  other: 'var(--color-muted)',
};

const SCHOOL_TYPES: SchoolType[] = [
  'primary',
  'intermediate',
  'secondary',
  'composite',
  'special',
  'other',
];

const SCHOOL_AUTHORITIES: SchoolAuthority[] = ['state', 'integrated', 'private', 'other'];

/** Classifies a Ministry of Education year range into a school type. */
export function classifySchoolYears(years: string | undefined): SchoolType {
  if (years === undefined) {
    return 'other';
  }
  if (years === 'special') {
    return 'special';
  }
  const match = /^(\d+)-(\d+)$/.exec(years);
  if (match === null) {
    return 'other';
  }
  const first = Number(match[1]);
  const last = Number(match[2]);
  if (first <= 1 && last <= 8) {
    return 'primary';
  }
  if (first === 7 && last === 8) {
    return 'intermediate';
  }
  if (first >= 6 && last >= 9) {
    return 'secondary';
  }
  if (first <= 6 && last >= 9) {
    return 'composite';
  }
  return 'other';
}

/** Classifies a Ministry of Education authority tag into a bucket. */
export function classifySchoolAuthority(authority: string | undefined): SchoolAuthority {
  if (authority === 'state') {
    return 'state';
  }
  if (authority === 'integrated') {
    return 'integrated';
  }
  if (authority === 'private') {
    return 'private';
  }
  return 'other';
}

interface SchoolTypeDatum {
  type: SchoolType;
  label: string;
  state: number;
  integrated: number;
  private: number;
  other: number;
  total: number;
}

/** Counts schools by type and authority into stacked-bar rows. */
export function buildSchoolTypeData(schools: LiveNzSchool[]): SchoolTypeDatum[] {
  const counts = new Map<SchoolType, Record<SchoolAuthority, number>>();
  for (const type of SCHOOL_TYPES) {
    counts.set(type, { state: 0, integrated: 0, private: 0, other: 0 });
  }
  for (const school of schools) {
    const type = classifySchoolYears(school.years);
    const authority = classifySchoolAuthority(school.authority);
    const row = counts.get(type);
    if (row !== undefined) {
      row[authority] += 1;
    }
  }
  return SCHOOL_TYPES.map((type) => {
    const row = counts.get(type);
    const state = row?.state ?? 0;
    const integrated = row?.integrated ?? 0;
    const privateCount = row?.private ?? 0;
    const other = row?.other ?? 0;
    return {
      type,
      label: TYPE_LABELS[type],
      state,
      integrated,
      private: privateCount,
      other,
      total: state + integrated + privateCount + other,
    };
  });
}

function SchoolTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as SchoolTypeDatum | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="school-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{datum.label}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.total.toLocaleString('en-NZ')} schools
      </p>
      {SCHOOL_AUTHORITIES.map((authority) => {
        const count = datum[authority];
        if (count === 0) {
          return null;
        }
        return (
          <p key={authority} className="numeral-paragraph-sm text-[var(--color-muted)]">
            {AUTHORITY_LABELS[authority]}: {count.toLocaleString('en-NZ')}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Live OpenStreetMap school census drawn as a stacked bar: school type on
 * the x axis, authority stacked inside each bar. Type a name to filter the
 * map, or toggle an authority to hide it.
 */
export function SchoolRoll(): React.ReactElement {
  const [schools, setSchools] = useState<LiveNzSchool[]>([]);
  const [query, setQuery] = useState('');
  const [hiddenAuthorities, setHiddenAuthorities] = useState<ReadonlySet<SchoolAuthority>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchools = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setSchools(await fetchLiveNzSchools());
    } catch {
      setError('OpenStreetMap did not answer. Try again in a moment.');
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchools();
  }, [loadSchools]);

  const filteredSchools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return schools;
    }
    return schools.filter((school) => school.name.toLowerCase().includes(normalizedQuery));
  }, [schools, query]);

  const data = useMemo(() => {
    const visible = filteredSchools.filter(
      (school) => !hiddenAuthorities.has(classifySchoolAuthority(school.authority)),
    );
    return buildSchoolTypeData(visible);
  }, [filteredSchools, hiddenAuthorities]);

  const totalSchools = useMemo(() => data.reduce((sum, row) => sum + row.total, 0), [data]);

  const toggleAuthority = (authority: SchoolAuthority): void => {
    setHiddenAuthorities((previous) => {
      const next = new Set(previous);
      if (next.has(authority)) {
        next.delete(authority);
      } else {
        next.add(authority);
      }
      return next;
    });
  };

  const chartLabel =
    totalSchools === 0
      ? 'New Zealand schools by type and authority'
      : `${totalSchools.toLocaleString('en-NZ')} ${
          totalSchools === 1 ? 'school' : 'schools'
        } by type and authority`;

  const tableColumns: ChartDataColumn<SchoolTypeDatum>[] = [
    { key: 'label', header: 'Type' },
    { key: 'state', header: 'State' },
    { key: 'integrated', header: 'Integrated' },
    { key: 'private', header: 'Private' },
    { key: 'other', header: 'Other' },
    { key: 'total', header: 'Total' },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Counting the schools...'
          : (error ?? `${schools.length} schools, fetched live from OpenStreetMap.`)}
      </p>
      {!isLoading && error === null && schools.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <label
              className="numeral-paragraph-sm text-[var(--color-muted)]"
              htmlFor="school-search"
            >
              Filter by name
            </label>
            <input
              id="school-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm text-[var(--color-fg)]"
            />
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {SCHOOL_AUTHORITIES.map((authority) => {
              const hidden = hiddenAuthorities.has(authority);
              return (
                <button
                  key={authority}
                  type="button"
                  onClick={() => toggleAuthority(authority)}
                  aria-pressed={!hidden}
                  className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                    hidden
                      ? 'border-[var(--color-border)] text-[var(--color-muted)]'
                      : 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                  }`}
                >
                  {AUTHORITY_LABELS[authority]}
                </button>
              );
            })}
          </div>
          <div role="img" aria-label={chartLabel} className="h-[clamp(280px,38vh,400px)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--color-border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                  stroke="var(--color-border)"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                  stroke="var(--color-border)"
                />
                <Tooltip content={SchoolTooltip} />
                {SCHOOL_AUTHORITIES.map((authority) => (
                  <Bar
                    key={authority}
                    dataKey={authority}
                    stackId="authority"
                    fill={AUTHORITY_COLORS[authority]}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ChartDataTable
            summary="School counts by type and authority"
            columns={tableColumns}
            rows={data}
          />
        </div>
      )}
    </div>
  );
}
