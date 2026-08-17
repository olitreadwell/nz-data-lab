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
  return (
    <div
      data-testid={testId}
      role="status"
      aria-live="polite"
      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1"
    >
      <p className="numeral-text-eyebrow text-[10px] text-[var(--color-muted)]">{label}</p>
      {payload.map((entry) => {
        const definition = series.find((candidate) => candidate.key === entry.dataKey);
        if (definition === undefined || typeof entry.value !== 'number') {
          return null;
        }
        return (
          <p key={definition.key} className="numeral-paragraph-sm text-[var(--color-fg)]">
            {definition.emoji} {definition.label}: {formatValue(entry.value)}
          </p>
        );
      })}
    </div>
  );
}
