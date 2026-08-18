'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchLiveEvChargingCurrentTypes, fetchLiveEvChargingOperators } from '@/lib/live-sources';
import type { LiveEvChargingCurrentType, LiveEvChargingOperator } from '@/lib/live-sources';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const SVG_WIDTH = 760;
const SVG_HEIGHT = 420;
const CHART_LEFT = 190;
const CHART_RIGHT = 76;
const CHART_TOP = 16;
const CHART_BOTTOM = 28;

type ViewMode = 'operator' | 'currentType';

interface LollipopDatum {
  label: string;
  count: number;
}

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, maxLength - 1)}…`;
}

/**
 * Live NZTA EV Roam charging stations drawn as a lollipop chart: one line
 * per operator or current type, with a dot at the count. Toggle the view, or
 * type to filter operators by name.
 */
export function EvCharging(): React.ReactElement {
  const [operators, setOperators] = useState<LiveEvChargingOperator[]>([]);
  const [currentTypes, setCurrentTypes] = useState<LiveEvChargingCurrentType[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('operator');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [operatorRows, currentTypeRows] = await Promise.all([
        fetchLiveEvChargingOperators(),
        fetchLiveEvChargingCurrentTypes(),
      ]);
      setOperators(operatorRows);
      setCurrentTypes(currentTypeRows);
    } catch {
      setError('NZTA did not answer. Try again in a moment.');
      setOperators([]);
      setCurrentTypes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStations();
  }, [loadStations]);

  const data = useMemo<LollipopDatum[]>(() => {
    const rows =
      viewMode === 'operator'
        ? operators.map((row) => ({ label: row.operator, count: row.count }))
        : currentTypes.map((row) => ({ label: row.currentType, count: row.count }));
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery === '') {
      return rows;
    }
    return rows.filter((row) => row.label.toLowerCase().includes(normalizedQuery));
  }, [operators, currentTypes, viewMode, query]);

  const totalStations = useMemo(
    () => operators.reduce((sum, row) => sum + row.count, 0),
    [operators],
  );
  const maxCount = useMemo(() => Math.max(...data.map((row) => row.count), 1), [data]);
  const plotWidth = SVG_WIDTH - CHART_LEFT - CHART_RIGHT;
  const plotHeight = SVG_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const rowHeight = data.length === 0 ? plotHeight : plotHeight / data.length;
  const scaleX = (count: number): number => CHART_LEFT + (count / maxCount) * plotWidth;
  const chartLabel =
    data.length === 0
      ? "New Zealand's public EV charging stations"
      : `${viewMode === 'operator' ? 'Operators' : 'Current types'} of New Zealand's ${totalStations} public EV charging stations`;

  const tableColumns: ChartDataColumn<LollipopDatum>[] = [
    { key: 'label', header: viewMode === 'operator' ? 'Operator' : 'Current type' },
    { key: 'count', header: 'Stations', format: (value) => value.toLocaleString('en-NZ') },
  ];

  return (
    <div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Counting the chargers...'
          : (error ?? `${totalStations} stations, fetched live from NZTA EV Roam.`)}
      </p>
      {!isLoading && error === null && operators.length > 0 && (
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {(['operator', 'currentType'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                className={`rounded-[var(--radius-sm)] border px-3 py-1 text-sm ${
                  viewMode === mode
                    ? 'border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]'
                    : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-fg)]'
                }`}
              >
                {mode === 'operator' ? 'By operator' : 'By current type'}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-sm text-[var(--color-muted)]">
              Filter
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Operator name"
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[var(--color-fg)]"
              />
            </label>
          </div>
          <svg
            role="img"
            aria-label={chartLabel}
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="h-auto w-full"
          >
            <title>{chartLabel}</title>
            {data.map((row, index) => {
              const y = CHART_TOP + index * rowHeight + rowHeight / 2;
              const xEnd = scaleX(row.count);
              return (
                <g key={row.label}>
                  <line
                    x1={CHART_LEFT}
                    y1={y}
                    x2={xEnd}
                    y2={y}
                    stroke="var(--color-fg)"
                    strokeWidth={2}
                  />
                  <circle cx={xEnd} cy={y} r={5} fill="var(--color-fg)" />
                  <text
                    x={CHART_LEFT - 8}
                    y={y + 3}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--color-muted)"
                  >
                    {truncateLabel(row.label, 24)}
                  </text>
                  <text x={xEnd + 8} y={y + 3} fontSize={10} fill="var(--color-fg)">
                    {row.count.toLocaleString('en-NZ')}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="numeral-paragraph-sm mt-1 text-[var(--color-muted)]">
            Each line is one {viewMode === 'operator' ? 'operator' : 'current type'}; the dot marks
            how many stations it runs.
          </p>
          <ChartDataTable
            summary="View the charging stations as a table"
            columns={tableColumns}
            rows={data}
          />
        </div>
      )}
    </div>
  );
}
