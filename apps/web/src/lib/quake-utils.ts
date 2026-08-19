/** Shared helpers for the shake index map, kept free of Leaflet imports so
 * the map module only loads in the browser. */

export const MMI_BANDS: { band: string; label: string; color: string }[] = [
  { band: 'weak', label: 'Weak (MMI 3-4)', color: '#56B4E9' },
  { band: 'moderate', label: 'Moderate (MMI 5-6)', color: '#E69F00' },
  { band: 'strong', label: 'Strong (MMI 7+)', color: '#D55E00' },
];

export const BAND_COLORS: Record<string, string> = {
  weak: '#56B4E9',
  moderate: '#E69F00',
  strong: '#D55E00',
};

const MIN_BUBBLE_RADIUS = 4;
const RADIUS_PER_MAGNITUDE = 3;
const BASE_MAGNITUDE = 2;

/** Short, human-readable date for a quake's ISO time, e.g. "17 Aug".
 * @param iso - ISO 8601 timestamp of the quake.
 * @returns a short locale-formatted date, or the raw string when the
 * timestamp is not a valid date.
 */
export function formatQuakeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
}

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
