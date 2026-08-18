'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ResponsiveContainer, Treemap } from 'recharts';

import { searchLiveDataGovtNz } from '@/lib/live-sources';
import type { LiveDataGovtNzDataset } from '@/lib/live-sources';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';

interface OpenDataSearchProps {
  initialQuery: string;
}

interface OrgDatum {
  name: string;
  size: number;
  [key: string]: string | number;
}

export const ORG_COLORS = [
  '#0ea5e9',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f43f5e',
  '#84cc16',
  '#6366f1',
  '#eab308',
];

/**
 * Relative luminance of a hex color, per the WCAG 2.2 formula.
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearR = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  const linearG = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  const linearB = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Label color that keeps at least 4.5:1 contrast against a treemap fill,
 * satisfying WCAG 1.4.3 AA.
 */
export function getOrgLabelColor(fill: string): string {
  return contrastRatio(fill, '#ffffff') >= contrastRatio(fill, '#000000') ? '#ffffff' : '#000000';
}

const MAX_DATASETS_SHOWN = 20;

function groupByOrganization(datasets: LiveDataGovtNzDataset[]): OrgDatum[] {
  const counts = new Map<string, number>();
  for (const dataset of datasets) {
    const org = dataset.organization ?? 'Unknown publisher';
    counts.set(org, (counts.get(org) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, size]) => ({ name, size }))
    .sort((a, b) => b.size - a.size);
}

/**
 * Live search over the data.govt.nz open data catalogue: type a topic and
 * the CKAN API answers from the browser (cross-origin allowed). A treemap
 * shows which agencies publish the matches.
 */
export function OpenDataSearch({ initialQuery }: OpenDataSearchProps): React.ReactElement {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [datasets, setDatasets] = useState<LiveDataGovtNzDataset[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const runSearch = useCallback(async (searchQuery: string) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);
    try {
      const next = await searchLiveDataGovtNz(searchQuery);
      if (requestIdRef.current !== requestId) {
        return;
      }
      setDatasets(next.datasets);
      setTotalCount(next.totalCount);
    } catch {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setError('The catalogue did not answer. Try again in a moment.');
      setDatasets([]);
      setTotalCount(0);
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  const byOrg = groupByOrganization(datasets);
  const label = `Open data datasets matching "${submittedQuery}": ${datasets.length} shown by publisher`;
  const matchLabel =
    totalCount > MAX_DATASETS_SHOWN
      ? `${totalCount.toLocaleString('en-NZ')} datasets match "${submittedQuery}"; showing the first ${MAX_DATASETS_SHOWN}.`
      : `${totalCount} datasets match "${submittedQuery}".`;

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
        <label className="sr-only" htmlFor="opendata-search">
          Search the open data catalogue
        </label>
        <input
          id="opendata-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try water, climate, health, sheep"
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
        {isLoading ? 'Searching the catalogue...' : (error ?? matchLabel)}
      </p>
      {!isLoading && error === null && datasets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div role="img" aria-label={label} className="h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={byOrg}
                  dataKey="size"
                  nameKey="name"
                  isAnimationActive={!prefersReducedMotion}
                  stroke="var(--color-bg)"
                  fill="#0ea5e9"
                  content={(props) => {
                    const { x, y, width, height, index, name } = props as {
                      x: number;
                      y: number;
                      width: number;
                      height: number;
                      index?: number;
                      name?: string;
                    };
                    const color = ORG_COLORS[(index ?? 0) % ORG_COLORS.length] ?? '#94a3b8';
                    return (
                      <g>
                        <rect x={x} y={y} width={width} height={height} fill={color} rx={2} />
                        {width > 40 && height > 20 && (
                          <text
                            x={x + 4}
                            y={y + 14}
                            fill={getOrgLabelColor(color)}
                            fontSize={11}
                            fontWeight={600}
                          >
                            {name}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 mb-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Chart legend">
              {byOrg.map((datum, index) => (
                <li
                  key={datum.name}
                  className="flex items-center gap-2 text-sm text-[var(--color-fg)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-[var(--radius-sm)]"
                    style={{
                      backgroundColor: ORG_COLORS[index % ORG_COLORS.length] ?? '#94a3b8',
                    }}
                  />
                  {datum.name}
                </li>
              ))}
            </ul>
            <ChartDataTable
              summary="View datasets by publisher as a table"
              columns={[
                { key: 'name', header: 'Publisher' },
                { key: 'size', header: 'Datasets' },
              ]}
              rows={byOrg}
            />
          </div>
          <ul className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {datasets.slice(0, MAX_DATASETS_SHOWN).map((dataset) => (
              <li key={dataset.name} className="numeral-paragraph-sm text-[var(--color-muted)]">
                <span className="text-[var(--color-fg)]">{dataset.title}</span>
                {dataset.organization === undefined ? '' : ` (${dataset.organization})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
