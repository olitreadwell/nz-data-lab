import { describe, expect, it } from 'vitest';

import {
  getMicrositeAccentStyles,
  type MicrositeAccent,
  type MicrositeAccentStyles,
} from './microsite-styles';

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

// Tailwind CSS v4 default palette (oklch), from the installed tailwindcss
// default-theme. Only the shades the accent styles reference are included.
const PALETTE: Record<string, Oklch> = {
  'amber-50': { lightness: 98.7, chroma: 0.022, hue: 95.277 },
  'amber-700': { lightness: 55.5, chroma: 0.163, hue: 48.998 },
  'sky-50': { lightness: 97.7, chroma: 0.013, hue: 236.62 },
  'sky-700': { lightness: 50.0, chroma: 0.134, hue: 242.749 },
  'purple-50': { lightness: 97.7, chroma: 0.014, hue: 308.299 },
  'purple-700': { lightness: 49.6, chroma: 0.265, hue: 301.924 },
  'emerald-50': { lightness: 97.9, chroma: 0.021, hue: 166.113 },
  'emerald-700': { lightness: 50.8, chroma: 0.118, hue: 165.612 },
  'lime-50': { lightness: 98.6, chroma: 0.031, hue: 120.757 },
  'lime-700': { lightness: 53.2, chroma: 0.157, hue: 131.589 },
  'violet-50': { lightness: 96.9, chroma: 0.016, hue: 293.756 },
  'violet-700': { lightness: 49.1, chroma: 0.27, hue: 292.581 },
  'rose-50': { lightness: 96.9, chroma: 0.015, hue: 12.422 },
  'rose-700': { lightness: 51.4, chroma: 0.222, hue: 16.935 },
  'teal-50': { lightness: 98.4, chroma: 0.014, hue: 180.72 },
  'teal-700': { lightness: 51.1, chroma: 0.096, hue: 186.391 },
  'indigo-50': { lightness: 96.2, chroma: 0.018, hue: 272.314 },
  'indigo-700': { lightness: 45.7, chroma: 0.24, hue: 277.023 },
  'cyan-50': { lightness: 98.4, chroma: 0.019, hue: 200.873 },
  'cyan-700': { lightness: 52.0, chroma: 0.105, hue: 223.128 },
  'fuchsia-50': { lightness: 97.7, chroma: 0.017, hue: 320.058 },
  'fuchsia-700': { lightness: 51.8, chroma: 0.253, hue: 323.949 },
};

const WHITE: Rgb = { red: 1, green: 1, blue: 1 };

const LUMINANCE_WEIGHTS = { red: 0.2126, green: 0.7152, blue: 0.0722 };
const CONTRAST_OFFSET = 0.05;

function clampChannel(channel: number): number {
  return Math.min(1, Math.max(0, channel));
}

function oklchToLinearRgb(color: Oklch): Rgb {
  const radianHue = (color.hue * Math.PI) / 180;
  const a = (color.chroma / 100) * Math.cos(radianHue);
  const b = (color.chroma / 100) * Math.sin(radianHue);
  const lightness = color.lightness / 100;

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

function blendOverWhite(color: Rgb, alpha: number): Rgb {
  return {
    red: color.red * alpha + WHITE.red * (1 - alpha),
    green: color.green * alpha + WHITE.green * (1 - alpha),
    blue: color.blue * alpha + WHITE.blue * (1 - alpha),
  };
}

interface ParsedClass {
  accent: string;
  shade: string;
}

function parseShade(className: string, prefix: string): ParsedClass {
  const match = new RegExp(`${prefix}(\\w+)-(\\d+)`).exec(className);
  const accent = match?.[1];
  const shade = match?.[2];
  if (accent === undefined || shade === undefined) {
    throw new Error(`Could not parse color shade from ${className}`);
  }
  return { accent, shade };
}

function colorFor(parsed: ParsedClass): Oklch {
  const color = PALETTE[`${parsed.accent}-${parsed.shade}`];
  if (color === undefined) {
    throw new Error(`No palette entry for ${parsed.accent}-${parsed.shade}`);
  }
  return color;
}

function assertEyebrowContrast(styles: MicrositeAccentStyles): void {
  const eyebrow = colorFor(parseShade(styles.eyebrow, 'text-'));
  const cardBg = colorFor(parseShade(styles.cardBg, 'bg-'));
  const sectionMatch = /from-(\w+)-(\d+)\/(\d+)/.exec(styles.sectionBg);
  const sectionAccent = sectionMatch?.[1];
  const sectionShade = sectionMatch?.[2];
  const sectionAlphaRaw = sectionMatch?.[3];
  if (sectionAccent === undefined || sectionShade === undefined || sectionAlphaRaw === undefined) {
    throw new Error(`Could not parse section background from ${styles.sectionBg}`);
  }
  const sectionBg = colorFor({ accent: sectionAccent, shade: sectionShade });
  const sectionAlpha = Number(sectionAlphaRaw) / 100;

  const eyebrowRgb = oklchToLinearRgb(eyebrow);
  expect(contrastRatio(eyebrowRgb, oklchToLinearRgb(cardBg))).toBeGreaterThanOrEqual(
    MIN_CONTRAST_AA,
  );
  expect(
    contrastRatio(eyebrowRgb, blendOverWhite(oklchToLinearRgb(sectionBg), sectionAlpha)),
  ).toBeGreaterThanOrEqual(MIN_CONTRAST_AA);
}

describe('microsite accent styles', () => {
  it.each(ACCENTS)(
    '%s eyebrow meets a 4.5:1 contrast ratio on its tinted backgrounds',
    (accent) => {
      assertEyebrowContrast(getMicrositeAccentStyles(accent));
    },
  );
});
