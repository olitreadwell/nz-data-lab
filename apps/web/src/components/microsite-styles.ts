/** Accent identities for the microsite hub: one color story per experiment. */
export type MicrositeAccent = 'amber' | 'sky' | 'purple' | 'emerald' | 'lime' | 'violet';

export interface MicrositeAccentStyles {
  eyebrow: string;
  sectionBg: string;
  cardBg: string;
  cardValue: string;
  chartBorder: string;
}

const ACCENT_STYLES: Record<MicrositeAccent, MicrositeAccentStyles> = {
  amber: {
    eyebrow: 'text-amber-600',
    sectionBg: 'bg-gradient-to-b from-amber-50/80 via-transparent to-transparent',
    cardBg: 'bg-amber-50',
    cardValue: 'text-amber-700',
    chartBorder: 'border-amber-200',
  },
  sky: {
    eyebrow: 'text-sky-600',
    sectionBg: 'bg-gradient-to-b from-sky-50/80 via-transparent to-transparent',
    cardBg: 'bg-sky-50',
    cardValue: 'text-sky-700',
    chartBorder: 'border-sky-200',
  },
  purple: {
    eyebrow: 'text-purple-600',
    sectionBg: 'bg-gradient-to-b from-purple-50/80 via-transparent to-transparent',
    cardBg: 'bg-purple-50',
    cardValue: 'text-purple-700',
    chartBorder: 'border-purple-200',
  },
  emerald: {
    eyebrow: 'text-emerald-600',
    sectionBg: 'bg-gradient-to-b from-emerald-50/80 via-transparent to-transparent',
    cardBg: 'bg-emerald-50',
    cardValue: 'text-emerald-700',
    chartBorder: 'border-emerald-200',
  },
  lime: {
    eyebrow: 'text-lime-600',
    sectionBg: 'bg-gradient-to-b from-lime-50/80 via-transparent to-transparent',
    cardBg: 'bg-lime-50',
    cardValue: 'text-lime-700',
    chartBorder: 'border-lime-200',
  },
  violet: {
    eyebrow: 'text-violet-600',
    sectionBg: 'bg-gradient-to-b from-violet-50/80 via-transparent to-transparent',
    cardBg: 'bg-violet-50',
    cardValue: 'text-violet-700',
    chartBorder: 'border-violet-200',
  },
};

export function getMicrositeAccentStyles(accent: MicrositeAccent): MicrositeAccentStyles {
  return ACCENT_STYLES[accent];
}
