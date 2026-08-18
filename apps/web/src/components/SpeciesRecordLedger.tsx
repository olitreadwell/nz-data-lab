'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveGbifKingdoms } from '@/lib/live-sources';
import type { LiveGbifKingdom } from '@/lib/live-sources';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const KINGDOM_COLORS: Record<string, string> = {
  Animalia: '#f59e0b',
  Plantae: '#10b981',
  Fungi: '#8b5cf6',
  Protozoa: '#0ea5e9',
  Chromista: '#14b8a6',
  Archaea: '#f97316',
  Bacteria: '#ef4444',
  Viruses: '#d946ef',
};

const COMPACT_FORMATTER = new Intl.NumberFormat('en-NZ', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

function KingdomTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const year = payload[0]?.payload as { year: string } | undefined;
  if (year === undefined) {
    return null;
  }
  return (
    <div
      data-testid="kingdom-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{year.year}</p>
      {payload.map((entry) => {
        if (typeof entry.value !== 'number') {
          return null;
        }
        return (
          <p key={String(entry.dataKey)} className="numeral-paragraph-sm text-[var(--color-fg)]">
            {String(entry.dataKey)}: {entry.value.toLocaleString('en-NZ')}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Live GBIF ledger of New Zealand species records: occurrence counts by
 * kingdom in 2014 and 2024, drawn as a slope chart. Click a kingdom button to
 * hide or show its line.
 */
export function SpeciesRecordLedger(): React.ReactElement {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [kingdoms, setKingdoms] = useState<LiveGbifKingdom[]>([]);
  const [hiddenKingdoms, setHiddenKingdoms] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKingdoms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setKingdoms(await fetchLiveGbifKingdoms());
    } catch {
      setError('GBIF did not answer. Try again in a moment.');
      setKingdoms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKingdoms();
  }, [loadKingdoms]);

  const visibleKingdoms = useMemo(
    () => kingdoms.filter((kingdom) => !hiddenKingdoms.has(kingdom.kingdom)),
    [kingdoms, hiddenKingdoms],
  );

  const toggleKingdom = useCallback((kingdom: string) => {
    setHiddenKingdoms((current) => {
      const next = new Set(current);
      if (next.has(kingdom)) {
        next.delete(kingdom);
      } else {
        next.add(kingdom);
      }
      return next;
    });
  }, []);

  const chartData = useMemo(() => {
    const first: Record<string, number | string> = { year: '2014' };
    const second: Record<string, number | string> = { year: '2024' };
    for (const kingdom of visibleKingdoms) {
      first[kingdom.kingdom] = kingdom.count2014;
      second[kingdom.kingdom] = kingdom.count2024;
    }
    return [first, second];
  }, [visibleKingdoms]);

  const chartLabel = useMemo(() => {
    const base = 'New Zealand species records by kingdom, 2014 to 2024, from GBIF';
    if (hiddenKingdoms.size === 0) {
      return base;
    }
    const hidden = [...hiddenKingdoms].sort().join(', ');
    return `${base}. Hidden: ${hidden}`;
  }, [hiddenKingdoms]);
  const tableColumns: ChartDataColumn<LiveGbifKingdom>[] = [
    { key: 'kingdom', header: 'Kingdom' },
    { key: 'count2014', header: '2014 records', format: (value) => value.toLocaleString('en-NZ') },
    { key: 'count2024', header: '2024 records', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Reading the record ledger...'
          : (error ?? `${kingdoms.length} kingdoms, fetched live from GBIF.`)}
      </p>
      {!isLoading && error === null && kingdoms.length > 0 && (
        <div>
          <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
            {kingdoms.map((kingdom) => {
              const isHidden = hiddenKingdoms.has(kingdom.kingdom);
              return (
                <li key={kingdom.kingdom}>
                  <button
                    type="button"
                    onClick={() => toggleKingdom(kingdom.kingdom)}
                    aria-pressed={!isHidden}
                    className="numeral-paragraph-sm flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                  >
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{
                        backgroundColor: isHidden
                          ? 'var(--color-muted)'
                          : KINGDOM_COLORS[kingdom.kingdom],
                      }}
                      aria-hidden="true"
                    />
                    {kingdom.kingdom}
                  </button>
                </li>
              );
            })}
          </ul>
          <div role="img" aria-label={chartLabel} className="h-[clamp(220px,30vh,320px)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                <XAxis dataKey="year" stroke="var(--color-muted)" />
                <YAxis tickFormatter={formatCount} stroke="var(--color-muted)" />
                <Tooltip content={(props) => <KingdomTooltip {...props} />} />
                {visibleKingdoms.map((kingdom) => (
                  <Line
                    key={kingdom.kingdom}
                    type="linear"
                    dataKey={kingdom.kingdom}
                    isAnimationActive={!prefersReducedMotion}
                    stroke={KINGDOM_COLORS[kingdom.kingdom] ?? '#64748b'}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ChartDataTable
            summary="View the ledger as a table"
            columns={tableColumns}
            rows={visibleKingdoms}
          />
        </div>
      )}
    </div>
  );
}
