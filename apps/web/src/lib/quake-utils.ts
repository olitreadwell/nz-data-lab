/** Shared helpers for the shake index map, kept free of Leaflet imports so
 * the map module only loads in the browser. */

export const MMI_BANDS: { band: string; label: string; color: string }[] = [
  { band: 'weak', label: 'Weak (MMI 3-4)', color: '#38bdf8' },
  { band: 'moderate', label: 'Moderate (MMI 5-6)', color: '#f59e0b' },
  { band: 'strong', label: 'Strong (MMI 7+)', color: '#ef4444' },
];

export const BAND_COLORS: Record<string, string> = {
  weak: '#38bdf8',
  moderate: '#f59e0b',
  strong: '#ef4444',
};

const MIN_BUBBLE_RADIUS = 4;
const RADIUS_PER_MAGNITUDE = 3;
const BASE_MAGNITUDE = 2;

/** Maps a felt intensity (MMI) value to a colour band. */
export function bandOf(mmi: number): string {
  if (mmi >= 7) {
    return 'strong';
  }
  if (mmi >= 5) {
    return 'moderate';
  }
  return 'weak';
}

/** Bubble radius in pixels for a quake magnitude. */
export function radiusFor(magnitude: number): number {
  return MIN_BUBBLE_RADIUS + (magnitude - BASE_MAGNITUDE) * RADIUS_PER_MAGNITUDE;
}
