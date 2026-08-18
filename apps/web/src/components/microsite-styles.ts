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
  sectionBg: string;
  cardBg: string;
  cardValue: string;
  chartBorder: string;
}

const ACCENT_STYLES: Record<MicrositeAccent, MicrositeAccentStyles> = {
  amber: {
    eyebrow: 'text-amber-700',
    sectionBg: 'bg-gradient-to-b from-amber-50/80 via-transparent to-transparent',
    cardBg: 'bg-amber-50',
    cardValue: 'text-amber-700',
    chartBorder: 'border-amber-200',
  },
  sky: {
    eyebrow: 'text-sky-700',
    sectionBg: 'bg-gradient-to-b from-sky-50/80 via-transparent to-transparent',
    cardBg: 'bg-sky-50',
    cardValue: 'text-sky-700',
    chartBorder: 'border-sky-200',
  },
  purple: {
    eyebrow: 'text-purple-700',
    sectionBg: 'bg-gradient-to-b from-purple-50/80 via-transparent to-transparent',
    cardBg: 'bg-purple-50',
    cardValue: 'text-purple-700',
    chartBorder: 'border-purple-200',
  },
  emerald: {
    eyebrow: 'text-emerald-700',
    sectionBg: 'bg-gradient-to-b from-emerald-50/80 via-transparent to-transparent',
    cardBg: 'bg-emerald-50',
    cardValue: 'text-emerald-700',
    chartBorder: 'border-emerald-200',
  },
  lime: {
    eyebrow: 'text-lime-700',
    sectionBg: 'bg-gradient-to-b from-lime-50/80 via-transparent to-transparent',
    cardBg: 'bg-lime-50',
    cardValue: 'text-lime-700',
    chartBorder: 'border-lime-200',
  },
  violet: {
    eyebrow: 'text-violet-700',
    sectionBg: 'bg-gradient-to-b from-violet-50/80 via-transparent to-transparent',
    cardBg: 'bg-violet-50',
    cardValue: 'text-violet-700',
    chartBorder: 'border-violet-200',
  },
  rose: {
    eyebrow: 'text-rose-700',
    sectionBg: 'bg-gradient-to-b from-rose-50/80 via-transparent to-transparent',
    cardBg: 'bg-rose-50',
    cardValue: 'text-rose-700',
    chartBorder: 'border-rose-200',
  },
  teal: {
    eyebrow: 'text-teal-700',
    sectionBg: 'bg-gradient-to-b from-teal-50/80 via-transparent to-transparent',
    cardBg: 'bg-teal-50',
    cardValue: 'text-teal-700',
    chartBorder: 'border-teal-200',
  },
  indigo: {
    eyebrow: 'text-indigo-700',
    sectionBg: 'bg-gradient-to-b from-indigo-50/80 via-transparent to-transparent',
    cardBg: 'bg-indigo-50',
    cardValue: 'text-indigo-700',
    chartBorder: 'border-indigo-200',
  },
  cyan: {
    eyebrow: 'text-cyan-700',
    sectionBg: 'bg-gradient-to-b from-cyan-50/80 via-transparent to-transparent',
    cardBg: 'bg-cyan-50',
    cardValue: 'text-cyan-700',
    chartBorder: 'border-cyan-200',
  },
  fuchsia: {
    eyebrow: 'text-fuchsia-700',
    sectionBg: 'bg-gradient-to-b from-fuchsia-50/80 via-transparent to-transparent',
    cardBg: 'bg-fuchsia-50',
    cardValue: 'text-fuchsia-700',
    chartBorder: 'border-fuchsia-200',
  },
};

export function getMicrositeAccentStyles(accent: MicrositeAccent): MicrositeAccentStyles {
  return ACCENT_STYLES[accent];
}
