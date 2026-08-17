'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Funnel, FunnelChart, LabelList, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveWikidataPeaks } from '@/lib/live-sources';
import type { LiveWikidataPeak } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const TOP_OPTIONS = [5, 10, 15] as const;
const DEFAULT_TOP_N = 10;

interface FunnelDatum {
  name: string;
  elevationM: number;
}

/** Tooltip shown while hovering a funnel segment. */
function PeakTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const name = payload[0]?.name;
  const value = payload[0]?.value;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{name}</p>
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {value.toLocaleString('en-NZ')} m
      </p>
    </div>
  );
}

/**
 * Live Wikidata peak elevations drawn as a funnel: the highest peak is the
 * widest segment, and each lower peak narrows the funnel. Toggle the top-N
 * buttons to widen or narrow the list.
 */
export function PeakHeights(): React.ReactElement {
  const [peaks, setPeaks] = useState<LiveWikidataPeak[]>([]);
  const [topN, setTopN] = useState<number>(DEFAULT_TOP_N);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPeaks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPeaks(await fetchLiveWikidataPeaks());
    } catch {
      setError('Wikidata did not answer. Try again in a moment.');
      setPeaks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPeaks();
  }, [loadPeaks]);

  const data = useMemo<FunnelDatum[]>(
    () => peaks.slice(0, topN).map((peak) => ({ name: peak.name, elevationM: peak.elevationM })),
    [peaks, topN],
  );
  const chartLabel =
    data.length === 0
      ? 'New Zealand peak elevations'
      : `The ${topN} highest New Zealand peaks, from ${data[0]?.name ?? 'the top'} down`;

  const tableColumns: ChartDataColumn<FunnelDatum>[] = [
    { key: 'name', header: 'Peak' },
    {
      key: 'elevationM',
      header: 'Elevation (m)',
      format: (value) => value.toLocaleString('en-NZ'),
    },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Measuring the peaks...'
          : (error ?? `${peaks.length} peaks, fetched live from Wikidata.`)}
      </p>
      {!isLoading && error === null && peaks.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {TOP_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTopN(option)}
                aria-pressed={topN === option}
                className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                  topN === option
                    ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                Top {option}
              </button>
            ))}
          </div>
          <div className="h-[320px]">
            <FunnelChart width={720} height={320} role="img" aria-label={chartLabel}>
              <Tooltip content={PeakTooltip} />
              <Funnel dataKey="elevationM" nameKey="name" data={data} isAnimationActive={false}>
                <LabelList
                  position="right"
                  fill="var(--color-fg)"
                  stroke="none"
                  dataKey="name"
                  fontSize={11}
                />
              </Funnel>
            </FunnelChart>
          </div>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            The widest segment is the highest peak. Each lower peak narrows the funnel.
          </p>
          <ChartDataTable
            summary="View the peak elevations as a table"
            columns={tableColumns}
            rows={data}
          />
        </div>
      )}
    </div>
  );
}
