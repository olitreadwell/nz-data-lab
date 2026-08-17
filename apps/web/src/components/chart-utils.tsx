'use client';

import type { TooltipContentProps } from 'recharts';

/** One series in a multi-series chart: key, label, emoji, and stroke color. */
export interface ChartSeriesDef {
  key: string;
  label: string;
  emoji: string;
  color: string;
}

/** Active point marker: an emoji instead of a plain dot. */
export function EmojiActiveDot({
  cx,
  cy,
  emoji,
}: {
  cx?: number;
  cy?: number;
  emoji: string;
}): React.ReactElement {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={18}
      pointerEvents="none"
      aria-hidden="true"
    >
      {emoji}
    </text>
  );
}

interface SeriesTooltipProps extends TooltipContentProps {
  series: ChartSeriesDef[];
  formatValue: (value: number) => string;
  testId: string;
}

const LEAD_SUFFIX = 'Lead';
const MAIN_SUFFIX = 'Main';

/** Strips the `Lead`/`Main` split suffix a chart's dataKey may carry back to its base series key. */
function baseSeriesKey(dataKey: string): string {
  if (dataKey.endsWith(LEAD_SUFFIX)) {
    return dataKey.slice(0, -LEAD_SUFFIX.length);
  }
  if (dataKey.endsWith(MAIN_SUFFIX)) {
    return dataKey.slice(0, -MAIN_SUFFIX.length);
  }
  return dataKey;
}

/** Tooltip shown while hovering (mouse) or scrubbing (touch) a multi-series chart. */
export function SeriesTooltip({
  active,
  label,
  payload,
  series,
  formatValue,
  testId,
}: SeriesTooltipProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }
  // A lead/main split renders two <Line>s per series, so keep only the first
  // numeric entry per base key (the boundary year would otherwise repeat).
  const seenKeys = new Set<string>();
  return (
    <div
      data-testid={testId}
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{label}</p>
      {payload.map((entry) => {
        const key = baseSeriesKey(String(entry.dataKey));
        const definition = series.find((candidate) => candidate.key === key);
        if (definition === undefined || typeof entry.value !== 'number' || seenKeys.has(key)) {
          return null;
        }
        seenKeys.add(key);
        return (
          <p key={definition.key} className="numeral-paragraph-sm text-[var(--color-fg)]">
            {definition.emoji} {definition.label}: {formatValue(entry.value)}
          </p>
        );
      })}
    </div>
  );
}

/** One row of data ready to feed a lead/main-split line chart. */
export type LeadMainPoint = { year: number } & Record<string, number | undefined>;

/**
 * Splits each key's values into `${key}Lead` (years up to and including
 * `boundaryYear`) and `${key}Main` (years from `boundaryYear` onward), so a
 * chart can render the earlier segment dashed to signal it's a single
 * spliced-in historical data point rather than part of the regular annual
 * series. Returns `points` unchanged when there's no boundary to split at.
 */
export function withLeadMainSplit<K extends string>(
  points: Array<{ year: number } & Record<K, number>>,
  keys: readonly K[],
  boundaryYear: number | undefined,
): LeadMainPoint[] {
  return points.map((point) => {
    const row: LeadMainPoint = { year: point.year };
    for (const key of keys) {
      const value = point[key];
      if (boundaryYear === undefined) {
        row[key] = value;
        continue;
      }
      row[`${key}${LEAD_SUFFIX}`] = point.year <= boundaryYear ? value : undefined;
      row[`${key}${MAIN_SUFFIX}`] = point.year >= boundaryYear ? value : undefined;
    }
    return row;
  });
}
