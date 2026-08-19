/** Accent identities for the microsite hub: one color story per experiment. */
export type MicrositeAccent =
  | 'amber'
  | 'sky'
  | 'purple'
  | 'emerald'
  | 'lime'
  | 'violet'
  | 'rose'
  | 'teal'
  | 'indigo'
  | 'cyan'
  | 'fuchsia';

export interface MicrositeAccentStyles {
  eyebrow: string;
  cardBg: string;
  cardValue: string;
  chartBorder: string;
}

const ACCENT_STYLES: Record<MicrositeAccent, MicrositeAccentStyles> = {
  amber: {
    eyebrow: 'text-[var(--accent-amber-fg)]',
    cardBg: 'bg-[var(--accent-amber-bg)]',
    cardValue: 'text-[var(--accent-amber-fg)]',
    chartBorder: 'border-[var(--accent-amber-border)]',
  },
  sky: {
    eyebrow: 'text-[var(--accent-sky-fg)]',
    cardBg: 'bg-[var(--accent-sky-bg)]',
    cardValue: 'text-[var(--accent-sky-fg)]',
    chartBorder: 'border-[var(--accent-sky-border)]',
  },
  purple: {
    eyebrow: 'text-[var(--accent-purple-fg)]',
    cardBg: 'bg-[var(--accent-purple-bg)]',
    cardValue: 'text-[var(--accent-purple-fg)]',
    chartBorder: 'border-[var(--accent-purple-border)]',
  },
  emerald: {
    eyebrow: 'text-[var(--accent-emerald-fg)]',
    cardBg: 'bg-[var(--accent-emerald-bg)]',
    cardValue: 'text-[var(--accent-emerald-fg)]',
    chartBorder: 'border-[var(--accent-emerald-border)]',
  },
  lime: {
    eyebrow: 'text-[var(--accent-lime-fg)]',
    cardBg: 'bg-[var(--accent-lime-bg)]',
    cardValue: 'text-[var(--accent-lime-fg)]',
    chartBorder: 'border-[var(--accent-lime-border)]',
  },
  violet: {
    eyebrow: 'text-[var(--accent-violet-fg)]',
    cardBg: 'bg-[var(--accent-violet-bg)]',
    cardValue: 'text-[var(--accent-violet-fg)]',
    chartBorder: 'border-[var(--accent-violet-border)]',
  },
  rose: {
    eyebrow: 'text-[var(--accent-rose-fg)]',
    cardBg: 'bg-[var(--accent-rose-bg)]',
    cardValue: 'text-[var(--accent-rose-fg)]',
    chartBorder: 'border-[var(--accent-rose-border)]',
  },
  teal: {
    eyebrow: 'text-[var(--accent-teal-fg)]',
    cardBg: 'bg-[var(--accent-teal-bg)]',
    cardValue: 'text-[var(--accent-teal-fg)]',
    chartBorder: 'border-[var(--accent-teal-border)]',
  },
  indigo: {
    eyebrow: 'text-[var(--accent-indigo-fg)]',
    cardBg: 'bg-[var(--accent-indigo-bg)]',
    cardValue: 'text-[var(--accent-indigo-fg)]',
    chartBorder: 'border-[var(--accent-indigo-border)]',
  },
  cyan: {
    eyebrow: 'text-[var(--accent-cyan-fg)]',
    cardBg: 'bg-[var(--accent-cyan-bg)]',
    cardValue: 'text-[var(--accent-cyan-fg)]',
    chartBorder: 'border-[var(--accent-cyan-border)]',
  },
  fuchsia: {
    eyebrow: 'text-[var(--accent-fuchsia-fg)]',
    cardBg: 'bg-[var(--accent-fuchsia-bg)]',
    cardValue: 'text-[var(--accent-fuchsia-fg)]',
    chartBorder: 'border-[var(--accent-fuchsia-border)]',
  },
};

export function getMicrositeAccentStyles(accent: MicrositeAccent): MicrositeAccentStyles {
  return ACCENT_STYLES[accent];
}
