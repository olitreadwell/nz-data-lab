'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveAucklandParkBoards } from '@/lib/live-sources';
import type { LiveAucklandParkBoard } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const TOP_OPTIONS = [5, 10, 0] as const;
const DEFAULT_TOP_N = 5;
const PIE_COLORS = [
  'var(--color-fg)',
  'var(--color-muted)',
  'var(--color-border)',
  '#f59e0b',
  '#0ea5e9',
  '#8b5cf6',
  '#10b981',
  '#f43f5e',
  '#14b8a6',
  '#f97316',
  '#6366f1',
];

interface PieDatum {
  name: string;
  areaM2: number;
}

function formatHectares(areaM2: string | number): string {
  return `${Math.round(Number(areaM2) / 10000).toLocaleString('en-NZ')} ha`;
}

/** Tooltip shown while hovering a pie segment. */
function ParkTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
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
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">{formatHectares(value)}</p>
    </div>
  );
}

/**
 * Live Auckland Council park extents drawn as a pie of local-board shares.
 * Toggle the top-N buttons to widen the view, or type to filter boards by
 * name.
 */
export function AucklandParks(): React.ReactElement {
  const [boards, setBoards] = useState<LiveAucklandParkBoard[]>([]);
  const [topN, setTopN] = useState<number>(DEFAULT_TOP_N);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBoards(await fetchLiveAucklandParkBoards());
    } catch {
      setError('Auckland Council did not answer. Try again in a moment.');
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  const filteredBoards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return boards;
    }
    return boards.filter((board) => board.board.toLowerCase().includes(normalizedQuery));
  }, [boards, query]);

  const data = useMemo<PieDatum[]>(() => {
    const visible = topN === 0 ? filteredBoards : filteredBoards.slice(0, topN);
    const rest = topN === 0 ? [] : filteredBoards.slice(topN);
    const restArea = rest.reduce((sum, board) => sum + board.areaM2, 0);
    const rows = visible.map((board) => ({ name: board.board, areaM2: board.areaM2 }));
    if (restArea > 0) {
      rows.push({ name: 'Other boards', areaM2: restArea });
    }
    return rows;
  }, [filteredBoards, topN]);

  const totalAreaM2 = useMemo(
    () => filteredBoards.reduce((sum, board) => sum + board.areaM2, 0),
    [filteredBoards],
  );
  const chartLabel =
    data.length === 0
      ? 'Auckland Council park land by local board'
      : `Auckland Council park land by local board, ${formatHectares(totalAreaM2)} total`;

  const tableColumns: ChartDataColumn<PieDatum>[] = [
    { key: 'name', header: 'Local board' },
    { key: 'areaM2', header: 'Park land', format: formatHectares },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Measuring the parks...'
          : (error ?? `${boards.length} local boards, fetched live from Auckland Council.`)}
      </p>
      {!isLoading && error === null && boards.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
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
                {option === 0 ? 'All boards' : `Top ${option}`}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-sm text-[var(--color-muted)]">
              Filter boards by name
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Board name"
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[var(--color-fg)]"
              />
            </label>
          </div>
          <div className="h-[320px]">
            <PieChart width={720} height={320} role="img" aria-label={chartLabel}>
              <Tooltip content={ParkTooltip} />
              <Pie
                data={data}
                dataKey="areaM2"
                nameKey="name"
                isAnimationActive={false}
                outerRadius="80%"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length] ?? 'var(--color-fg)'}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each slice is one local board's share of the park land shown.
          </p>
          <ChartDataTable
            summary="View the park land by local board as a table"
            columns={tableColumns}
            rows={data}
          />
        </div>
      )}
    </div>
  );
}
