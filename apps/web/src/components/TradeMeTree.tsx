'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { TooltipContentProps } from 'recharts';

import { fetchLiveTradeMeTree } from '@/lib/live-sources';
import type { LiveTradeMeCategory } from '@/lib/live-sources';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

import { ChartDataTable } from './ChartDataTable';
import type { ChartDataColumn } from './ChartDataTable';

const RADIAL_COLOR = '#d946ef';
const RADIAL_BAR_SIZE = 10;
const TOP_CATEGORIES_SHOWN = 12;
const MAX_SEARCH_RESULTS = 20;

function countLeafCategories(category: LiveTradeMeCategory): number {
  if (category.subcategories.length === 0) {
    return 1;
  }
  let total = 0;
  for (const sub of category.subcategories) {
    total += countLeafCategories(sub);
  }
  return total;
}

interface FlatCategory {
  name: string;
  path: string;
  leafCount: number;
  depth: number;
}

function flattenCategories(
  category: LiveTradeMeCategory,
  depth: number,
  out: FlatCategory[],
): FlatCategory[] {
  out.push({
    name: category.name,
    path: category.path,
    leafCount: countLeafCategories(category),
    depth,
  });
  for (const sub of category.subcategories) {
    flattenCategories(sub, depth + 1, out);
  }
  return out;
}

function CategoryTooltip({ active, payload }: TooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload as { name: string; leafCount: number } | undefined;
  if (datum === undefined) {
    return null;
  }
  return (
    <div
      data-testid="category-tooltip"
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-paragraph-sm text-[var(--color-fg)]">
        {datum.name}: {datum.leafCount} leaf categories
      </p>
    </div>
  );
}

interface CategoryListProps {
  categories: LiveTradeMeCategory[];
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
}

function CategoryList({
  categories,
  expandedPaths,
  onToggle,
}: CategoryListProps): React.ReactElement {
  return (
    <ul className="space-y-1">
      {categories.map((category) => {
        const leafCount = countLeafCategories(category);
        const isExpanded = expandedPaths.has(category.path);
        const hasChildren = category.subcategories.length > 0;
        return (
          <li key={category.path}>
            <div className="flex items-baseline gap-2">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => onToggle(category.path)}
                  aria-expanded={isExpanded}
                  className="numeral-paragraph-sm text-[var(--color-fg)] underline"
                >
                  {isExpanded ? '−' : '+'} {category.name}
                </button>
              ) : (
                <span className="numeral-paragraph-sm text-[var(--color-fg)]">{category.name}</span>
              )}
              <span className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">
                {leafCount} {leafCount === 1 ? 'leaf' : 'leaves'}
              </span>
            </div>
            {isExpanded && hasChildren && (
              <div className="pl-4">
                <CategoryList
                  categories={category.subcategories}
                  expandedPaths={expandedPaths}
                  onToggle={onToggle}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Live view of the Trade Me category tree: the API answers from the browser
 * (CORS is open). A radial chart shows the top-level branches by leaf count,
 * a search box filters the whole tree, and clicking a branch expands it.
 */
export function TradeMeTree(): React.ReactElement {
  const [tree, setTree] = useState<LiveTradeMeCategory | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const loadTree = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTree(await fetchLiveTradeMeTree());
    } catch {
      setError('Trade Me did not answer. Try again in a moment.');
      setTree(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTree();
  }, [loadTree]);

  const flat = useMemo(() => (tree === null ? [] : flattenCategories(tree, 0, [])), [tree]);

  const topCategories = useMemo(
    () =>
      flat
        .filter((category) => category.depth === 1)
        .sort((a, b) => b.leafCount - a.leafCount)
        .slice(0, TOP_CATEGORIES_SHOWN),
    [flat],
  );

  const topLevel = useMemo(
    () =>
      [...(tree?.subcategories ?? [])].sort(
        (a, b) => countLeafCategories(b) - countLeafCategories(a),
      ),
    [tree],
  );

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') {
      return null;
    }
    return flat
      .filter((category) => category.name.toLowerCase().includes(trimmed))
      .slice(0, MAX_SEARCH_RESULTS);
  }, [flat, query]);

  const filteredCount = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') {
      return null;
    }
    return flat.filter((category) => category.name.toLowerCase().includes(trimmed)).length;
  }, [flat, query]);

  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((current) => {
      const next = new Set(current);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const chartLabel = 'Top-level Trade Me categories by leaf count';
  const topCategoryColumns: ChartDataColumn<FlatCategory>[] = [
    { key: 'name', header: 'Category' },
    {
      key: 'leafCount',
      header: 'Leaf categories',
      format: (value) => value.toLocaleString('en-NZ'),
    },
  ];

  return (
    <div>
      <form
        className="mb-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <label className="sr-only" htmlFor="trademe-search">
          Filter Trade Me categories
        </label>
        <input
          id="trademe-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter categories, e.g. cars, books, pets"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm"
        />
      </form>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        {isLoading
          ? 'Loading the category tree...'
          : (error ??
            (filteredCount === null
              ? `${flat.length} categories in the tree.`
              : `${filteredCount} ${
                  filteredCount === 1 ? 'category matches' : 'categories match'
                } your filter.`))}
      </p>
      {!isLoading && error === null && tree !== null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div role="img" aria-label={chartLabel} className="h-[220px] sm:h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={topCategories}
                  innerRadius="15%"
                  outerRadius="100%"
                  barSize={RADIAL_BAR_SIZE}
                >
                  <RadialBar
                    dataKey="leafCount"
                    isAnimationActive={!prefersReducedMotion}
                    fill={RADIAL_COLOR}
                    background={{ fill: 'var(--color-muted)' }}
                  />
                  <Tooltip content={(props) => <CategoryTooltip {...props} />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <ChartDataTable
            summary="View top-level categories by leaf count as a table"
            columns={topCategoryColumns}
            rows={topCategories}
          />
          <div className="max-h-[260px] overflow-y-auto pr-1">
            {searchResults === null ? (
              <CategoryList
                categories={topLevel}
                expandedPaths={expandedPaths}
                onToggle={toggleExpanded}
              />
            ) : (
              <ul className="space-y-1">
                {searchResults.map((category) => (
                  <li
                    key={category.path}
                    className="numeral-paragraph-sm text-[var(--color-muted)]"
                  >
                    <span className="text-[var(--color-fg)]">{category.name}</span>
                    <span className="text-[var(--color-muted)]"> ({category.path})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
