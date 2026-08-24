import { describe, expect, it } from 'vitest';

import { getMicrositeAccentStyles, type MicrositeAccent } from './microsite-styles';

const ACCENTS: MicrositeAccent[] = [
  'amber',
  'sky',
  'purple',
  'emerald',
  'lime',
  'violet',
  'rose',
  'teal',
  'indigo',
  'cyan',
  'fuchsia',
];

interface Oklch {
  lightness: number;
  chroma: number;
  hue: number;
}

interface Rgb {
  red: number;
  green: number;
  blue: number;
}

// WCAG 1.4.3 AA minimum contrast ratio for normal-size text.
const MIN_CONTRAST_AA = 4.5;

// Design tokens from packages/ui/src/tokens/tokens.css, mirrored here so a
// change that breaks the contrast guarantee fails the test.
const ACCENT_TOKENS: Record<MicrositeAccent, Oklch> = {
  amber: { lightness: 0.45, chroma: 0.13, hue: 70 },
  sky: { lightness: 0.45, chroma: 0.13, hue: 240 },
  purple: { lightness: 0.45, chroma: 0.13, hue: 290 },
  emerald: { lightness: 0.45, chroma: 0.13, hue: 150 },
  lime: { lightness: 0.45, chroma: 0.13, hue: 120 },
  violet: { lightness: 0.45, chroma: 0.13, hue: 330 },
  rose: { lightness: 0.45, chroma: 0.13, hue: 25 },
  teal: { lightness: 0.45, chroma: 0.13, hue: 190 },
  indigo: { lightness: 0.45, chroma: 0.13, hue: 265 },
  cyan: { lightness: 0.45, chroma: 0.13, hue: 225 },
  fuchsia: { lightness: 0.45, chroma: 0.13, hue: 310 },
};

// Page and card backgrounds: light mode (:root) and dark mode (.dark).
const LIGHT_PAGE_BG: Oklch = { lightness: 0.985, chroma: 0, hue: 0 };
const LIGHT_CARD_BG: Oklch = { lightness: 0.97, chroma: 0.02, hue: 0 };
const DARK_PAGE_BG: Oklch = { lightness: 0.12, chroma: 0, hue: 0 };
const DARK_CARD_BG: Oklch = { lightness: 0.21, chroma: 0.03, hue: 0 };

const LUMINANCE_WEIGHTS = { red: 0.2126, green: 0.7152, blue: 0.0722 };
const CONTRAST_OFFSET = 0.05;

function clampChannel(channel: number): number {
  return Math.min(1, Math.max(0, channel));
}

function oklchToLinearRgb(color: Oklch): Rgb {
  const radianHue = (color.hue * Math.PI) / 180;
  const a = color.chroma * Math.cos(radianHue);
  const b = color.chroma * Math.sin(radianHue);
  const lightness = color.lightness;

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    red: clampChannel(red),
    green: clampChannel(green),
    blue: clampChannel(blue),
  };
}

function relativeLuminance(color: Rgb): number {
  return (
    LUMINANCE_WEIGHTS.red * color.red +
    LUMINANCE_WEIGHTS.green * color.green +
    LUMINANCE_WEIGHTS.blue * color.blue
  );
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET);
}

/** The accent foreground color in a given mode (light or dark). */
function accentFg(accent: MicrositeAccent, dark: boolean): Oklch {
  const base = ACCENT_TOKENS[accent];
  return dark ? { ...base, lightness: 0.82 } : base;
}

/** The accent card background color in a given mode. */
function accentBg(dark: boolean): Oklch {
  return dark ? DARK_CARD_BG : LIGHT_CARD_BG;
}

describe('microsite accent styles', () => {
  it.each(ACCENTS)('%s styles reference the accent design tokens', (accent) => {
    const styles = getMicrositeAccentStyles(accent);
    expect(styles.eyebrow).toBe(`text-[var(--accent-${accent}-fg)]`);
    expect(styles.cardValue).toBe(`text-[var(--accent-${accent}-fg)]`);
    expect(styles.cardBg).toBe(`bg-[var(--accent-${accent}-bg)]`);
    expect(styles.chartBorder).toBe(`border-[var(--accent-${accent}-border)]`);
  });

  it.each(ACCENTS)('%s accent text keeps 4.5:1 contrast in light mode', (accent) => {
    const fg = oklchToLinearRgb(accentFg(accent, false));
    expect(contrastRatio(fg, oklchToLinearRgb(LIGHT_CARD_BG))).toBeGreaterThanOrEqual(
      MIN_CONTRAST_AA,
    );
    expect(contrastRatio(fg, oklchToLinearRgb(LIGHT_PAGE_BG))).toBeGreaterThanOrEqual(
      MIN_CONTRAST_AA,
    );
  });

  it.each(ACCENTS)('%s accent text keeps 4.5:1 contrast in dark mode', (accent) => {
    const fg = oklchToLinearRgb(accentFg(accent, true));
    expect(contrastRatio(fg, oklchToLinearRgb(DARK_CARD_BG))).toBeGreaterThanOrEqual(
      MIN_CONTRAST_AA,
    );
    expect(contrastRatio(fg, oklchToLinearRgb(DARK_PAGE_BG))).toBeGreaterThanOrEqual(
      MIN_CONTRAST_AA,
    );
  });
});
