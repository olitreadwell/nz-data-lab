'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveInaturalistTaxa } from '@/lib/live-sources';
import type { LiveInaturalistTaxon } from '@/lib/live-sources';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const TAXON_COLORS: Record<string, string> = {
  Aves: '#E69F00',
  Mammalia: '#D55E00',
  Reptilia: '#009E73',
  Actinopterygii: '#0072B2',
  Insecta: '#CC79A7',
  Arachnida: '#F0E442',
  Mollusca: '#56B4E9',
  Plantae: '#E69F00',
  Fungi: '#D55E00',
};

const COMPACT_FORMATTER = new Intl.NumberFormat('en-NZ', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  return COMPACT_FORMATTER.format(value);
}

function TaxonTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as LiveInaturalistTaxon | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="taxon-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{datum.taxon}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.speciesCount.toLocaleString('en-NZ')} species,{' '}
        {datum.observationCount.toLocaleString('en-NZ')} observations
      </p>
      <p className="numeral-paragraph-sm text-[var(--color-muted)]">
        {datum.observerCount.toLocaleString('en-NZ')} observers
      </p>
    </div>
  );
}

/**
 * Live iNaturalist census of New Zealand: species, observations, and
 * observers per iconic taxon, drawn as a bubble chart. Click a taxon button
 * to hide or show its bubble.
 */
export function BackyardSpeciesCensus(): React.ReactElement {
  const [taxa, setTaxa] = useState<LiveInaturalistTaxon[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hiddenTaxa, setHiddenTaxa] = useState<ReadonlySet<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTaxa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTaxa(await fetchLiveInaturalistTaxa());
    } catch {
      setError('iNaturalist did not answer. Try again in a moment.');
      setTaxa([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTaxa();
  }, [loadTaxa]);

  const visibleTaxa = useMemo(
    () => taxa.filter((taxon) => !hiddenTaxa.has(taxon.taxon)),
    [taxa, hiddenTaxa],
  );

  const toggleTaxon = useCallback((taxon: string) => {
    setHiddenTaxa((current) => {
      const next = new Set(current);
      if (next.has(taxon)) {
        next.delete(taxon);
      } else {
        next.add(taxon);
      }
      return next;
    });
  }, []);

  const chartLabel = useMemo(() => {
    const base = 'New Zealand species by observations, species, and observers on iNaturalist';
    if (hiddenTaxa.size === 0) {
      return base;
    }
    const hidden = [...hiddenTaxa].sort().join(', ');
    return `${base}. Hidden: ${hidden}`;
  }, [hiddenTaxa]);
  const tableColumns: ChartDataColumn<LiveInaturalistTaxon>[] = [
    { key: 'taxon', header: 'Group' },
    { key: 'speciesCount', header: 'Species', format: (value) => value.toLocaleString('en-NZ') },
    {
      key: 'observationCount',
      header: 'Observations',
      format: (value) => value.toLocaleString('en-NZ'),
    },
    { key: 'observerCount', header: 'Observers', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Counting the backyard census...'
          : (error ?? `${taxa.length} iconic groups, fetched live from iNaturalist.`)}
      </p>
      {!isLoading && error === null && taxa.length > 0 && (
        <div>
          <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
            {taxa.map((taxon) => {
              const isHidden = hiddenTaxa.has(taxon.taxon);
              return (
                <li key={taxon.taxon}>
                  <button
                    type="button"
                    onClick={() => toggleTaxon(taxon.taxon)}
                    aria-pressed={!isHidden}
                    className="numeral-paragraph-sm flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                  >
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{
                        backgroundColor: isHidden
                          ? 'var(--color-muted)'
                          : TAXON_COLORS[taxon.taxon],
                      }}
                      aria-hidden="true"
                    />
                    {taxon.taxon}
                  </button>
                </li>
              );
            })}
          </ul>
          <div role="img" aria-label={chartLabel} className="h-[clamp(240px,34vh,360px)]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
                <XAxis
                  type="number"
                  dataKey="speciesCount"
                  name="Species"
                  tickFormatter={formatCount}
                  stroke="var(--color-muted)"
                />
                <YAxis
                  type="number"
                  dataKey="observationCount"
                  name="Observations"
                  tickFormatter={formatCount}
                  stroke="var(--color-muted)"
                />
                <ZAxis type="number" dataKey="observerCount" range={[80, 500]} name="Observers" />
                <Tooltip
                  content={(props) => <TaxonTooltip {...props} />}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                {visibleTaxa.map((taxon) => (
                  <Scatter
                    key={taxon.taxon}
                    data={[taxon]}
                    isAnimationActive={!prefersReducedMotion}
                    fill={TAXON_COLORS[taxon.taxon] ?? '#999999'}
                    name={taxon.taxon}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <ChartDataTable
            summary="View the census as a table"
            columns={tableColumns}
            rows={visibleTaxa}
          />
        </div>
      )}
    </div>
  );
}
