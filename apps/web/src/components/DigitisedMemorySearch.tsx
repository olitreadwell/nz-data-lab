'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { searchLiveDigitalNz } from '@/lib/live-sources';
import type { LiveDigitalNzSearchResult } from '@/lib/live-sources';

interface DigitisedMemorySearchProps {
  initialQuery: string;
}

const DECADE_COLOR = '#06b6d4';
const DECADE_STEP = 10;
const MAX_RECORDS_SHOWN = 20;
const COMPACT_FORMATTER = new Intl.NumberFormat('en-NZ', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

function decadeOfYear(year: number): number {
  return Math.floor(year / DECADE_STEP) * DECADE_STEP;
}

function DecadeTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as { decade: number; count: number } | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="decade-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.decade}s: {datum.count.toLocaleString('en-NZ')}
      </p>
    </div>
  );
}

/**
 * Live search over the DigitalNZ (National Library) collection: type a query
 * and the API answers from the browser (CORS is open). A histogram shows the
 * decade facet of the matches, and two sliders narrow the records list.
 */
export function DigitisedMemorySearch({
  initialQuery,
}: DigitisedMemorySearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [result, setResult] = useState<LiveDigitalNzSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minDecade, setMinDecade] = useState<number | null>(null);
  const [maxDecade, setMaxDecade] = useState<number | null>(null);

  const runSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const next = await searchLiveDigitalNz(searchQuery);
      setResult(next);
      setMinDecade(next.decades[0]?.decade ?? null);
      setMaxDecade(next.decades[next.decades.length - 1]?.decade ?? null);
    } catch {
      setError('The collection did not answer. Try again in a moment.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  const visibleRecords = useMemo(() => {
    if (result === null || minDecade === null || maxDecade === null) {
      return result?.records ?? [];
    }
    return result.records.filter((record) => {
      if (record.year === null) {
        return true;
      }
      const decade = decadeOfYear(record.year);
      return decade >= minDecade && decade <= maxDecade;
    });
  }, [result, minDecade, maxDecade]);

  const decades = result?.decades ?? [];
  const firstDecade = decades[0]?.decade ?? 0;
  const lastDecade = decades[decades.length - 1]?.decade ?? 0;
  const hasDecades = decades.length > 0;
  const chartLabel = `Records matching "${submittedQuery}" by decade`;

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
        <label className="sr-only" htmlFor="digitised-search">
          Search the digitised collection
        </label>
        <input
          id="digitised-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try gold, sheep, kiwi, weta"
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
          ? 'Searching the collection...'
          : (error ??
            `${(result?.resultCount ?? 0).toLocaleString('en-NZ')} records match "${submittedQuery}".`)}
      </p>
      {!isLoading && error === null && result !== null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div role="img" aria-label={chartLabel} className="h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={decades}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                  <XAxis
                    dataKey="decade"
                    tickFormatter={(value: number) => `${value}s`}
                    stroke="var(--color-muted)"
                  />
                  <YAxis tickFormatter={formatCount} stroke="var(--color-muted)" />
                  <Tooltip content={(props) => <DecadeTooltip {...props} />} />
                  <Bar dataKey="count" fill={DECADE_COLOR} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {hasDecades && minDecade !== null && maxDecade !== null && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="numeral-paragraph-sm text-[var(--color-muted)]">
                  Earliest decade
                  <input
                    type="range"
                    min={firstDecade}
                    max={lastDecade}
                    step={DECADE_STEP}
                    value={minDecade}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setMinDecade(Math.min(value, maxDecade));
                    }}
                    className="w-full"
                  />
                  <span className="numeral-text-eyebrow">{minDecade}s</span>
                </label>
                <label className="numeral-paragraph-sm text-[var(--color-muted)]">
                  Latest decade
                  <input
                    type="range"
                    min={firstDecade}
                    max={lastDecade}
                    step={DECADE_STEP}
                    value={maxDecade}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setMaxDecade(Math.max(value, minDecade));
                    }}
                    className="w-full"
                  />
                  <span className="numeral-text-eyebrow">{maxDecade}s</span>
                </label>
              </div>
            )}
          </div>
          <ul className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {visibleRecords.slice(0, MAX_RECORDS_SHOWN).map((record) => (
              <li key={record.id} className="numeral-paragraph-sm text-[var(--color-muted)]">
                {record.url === '' ? (
                  <span className="text-[var(--color-fg)]">{record.title}</span>
                ) : (
                  <a className="text-[var(--color-fg)] underline" href={record.url}>
                    {record.title}
                  </a>
                )}
                {record.contentPartner === '' ? '' : ` (${record.contentPartner})`}
                {record.year === null ? ' [undated]' : ` [${decadeOfYear(record.year)}s]`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
