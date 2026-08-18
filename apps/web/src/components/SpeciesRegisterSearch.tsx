'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { searchLiveNzorNames } from '@/lib/live-sources';
import type { LiveNzorName } from '@/lib/live-sources';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';

interface SpeciesRegisterSearchProps {
  initialQuery: string;
}

interface ClassDatum {
  className: string;
  count: number;
}

const CLASS_COLORS = [
  '#22c55e',
  '#0ea5e9',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f43f5e',
  '#84cc16',
  '#6366f1',
  '#eab308',
];

const MAX_NAMES_SHOWN = 20;

function groupByClass(names: LiveNzorName[]): ClassDatum[] {
  const counts = new Map<string, number>();
  for (const name of names) {
    const className = name.className === '' ? 'Unclassified' : name.className;
    counts.set(className, (counts.get(className) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([className, count]) => ({ className, count }))
    .sort((a, b) => b.count - a.count);
}

function ClassTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as ClassDatum | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="species-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.className}: {datum.count}
      </p>
    </div>
  );
}

/**
 * Live search over the NZ Organisms Register: type a species name and the
 * register answers from the browser (the API allows cross-origin requests).
 * A donut shows the classes the matches belong to.
 */
export function SpeciesRegisterSearch({
  initialQuery,
}: SpeciesRegisterSearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [names, setNames] = useState<LiveNzorName[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(async (searchQuery: string) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);
    try {
      const next = await searchLiveNzorNames(searchQuery);
      if (requestIdRef.current !== requestId) {
        return;
      }
      setNames(next);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setError('The register did not answer. Try again in a moment.');
      setNames([]);
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  const byClass = groupByClass(names);
  const label = `NZ organism names matching "${submittedQuery}": ${names.length} shown by class`;

  return (
    <div>
      <form
        className="mb-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query);
          void runSearch(query);
        }}
      >
        <label className="sr-only" htmlFor="species-search">
          Search the species register
        </label>
        <input
          id="species-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try kiwi, weta, tuatara, kauri"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] hover:bg-[var(--color-muted)]/10"
        >
          Search
        </button>
      </form>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Searching the register...'
          : (error ?? `${names.length} names match "${submittedQuery}".`)}
      </p>
      {!isLoading && error === null && names.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="h-[clamp(200px,28vh,300px)]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart role="img" aria-label={label}>
                  <Pie
                    data={byClass}
                    dataKey="count"
                    nameKey="className"
                    isAnimationActive={!prefersReducedMotion}
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {byClass.map((datum, index) => (
                      <Cell
                        key={datum.className}
                        fill={CLASS_COLORS[index % CLASS_COLORS.length] ?? '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={(props) => <ClassTooltip {...props} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 mb-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Chart legend">
              {byClass.map((datum, index) => (
                <li
                  key={datum.className}
                  className="flex items-center gap-2 text-sm text-[var(--color-fg)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-[var(--radius-sm)]"
                    style={{
                      backgroundColor: CLASS_COLORS[index % CLASS_COLORS.length] ?? '#94a3b8',
                    }}
                  />
                  {datum.className}
                </li>
              ))}
            </ul>
            <ChartDataTable
              summary="View species by class as a table"
              columns={[
                { key: 'className', header: 'Class' },
                { key: 'count', header: 'Names' },
              ]}
              rows={byClass}
            />
          </div>
          <ul className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {names.slice(0, MAX_NAMES_SHOWN).map((name) => (
              <li key={name.nameId} className="numeral-paragraph-sm text-[var(--color-muted)]">
                <span className="text-[var(--color-fg)] italic">{name.fullName}</span>
                {name.className === '' ? '' : ` (${name.className})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
