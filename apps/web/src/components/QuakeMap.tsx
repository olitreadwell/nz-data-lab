'use client';

import type { GeoNetQuake } from '@nzlab/nz-sources';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';

import { MMI_BANDS } from '@/lib/quake-utils';

interface QuakeMapProps {
  quakes: GeoNetQuake[];
}

const DEFAULT_MIN_MAGNITUDE = 3;
const DEFAULT_MAX_DEPTH_KM = 100;
const MIN_MAGNITUDE_LIMIT = 2;
const MAX_MAGNITUDE_LIMIT = 6;
const MIN_DEPTH_LIMIT = 0;
const MAX_DEPTH_LIMIT = 100;
const DEPTH_STEP = 5;
const MAGNITUDE_STEP = 0.1;

const LeafletMap = dynamic(() => import('./LeafletQuakeMap').then((m) => m.LeafletQuakeMap), {
  ssr: false,
});

/**
 * Recent felt quakes on a Leaflet map of New Zealand: bubble size by
 * magnitude, colour by felt intensity (MMI). Two sliders filter the minimum
 * magnitude and maximum depth, and the map redraws live. The Leaflet map
 * itself is loaded client-side only, so prerender stays server-safe.
 */
export function QuakeMap({ quakes }: QuakeMapProps): React.ReactElement {
  const [minMagnitude, setMinMagnitude] = useState(DEFAULT_MIN_MAGNITUDE);
  const [maxDepthKm, setMaxDepthKm] = useState(DEFAULT_MAX_DEPTH_KM);

  const visible = useMemo(
    () => quakes.filter((quake) => quake.magnitude >= minMagnitude && quake.depthKm <= maxDepthKm),
    [quakes, minMagnitude, maxDepthKm],
  );

  const label =
    quakes.length === 0
      ? 'Recent felt quakes on a map of New Zealand'
      : `Recent felt quakes on a map of New Zealand: ${visible.length} of ${quakes.length} shown, magnitude ${minMagnitude.toFixed(1)} or stronger, shallower than ${maxDepthKm} km`;

  return (
    <div>
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">
            Minimum magnitude: <strong>{minMagnitude.toFixed(1)}</strong>
          </span>
          <input
            type="range"
            min={MIN_MAGNITUDE_LIMIT}
            max={MAX_MAGNITUDE_LIMIT}
            step={MAGNITUDE_STEP}
            value={minMagnitude}
            onChange={(event) => setMinMagnitude(Number(event.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="numeral-paragraph-sm text-[var(--color-muted)]">
            Maximum depth: <strong>{maxDepthKm} km</strong>
          </span>
          <input
            type="range"
            min={MIN_DEPTH_LIMIT}
            max={MAX_DEPTH_LIMIT}
            step={DEPTH_STEP}
            value={maxDepthKm}
            onChange={(event) => setMaxDepthKm(Number(event.target.value))}
            className="w-full"
          />
        </label>
      </div>
      <p className="numeral-paragraph-sm mb-2 text-[var(--color-muted)]" aria-live="polite">
        Showing {visible.length} of {quakes.length} recent quakes.
      </p>
      <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
        {MMI_BANDS.map((band) => (
          <li key={band.band} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{ backgroundColor: band.color }}
              aria-hidden="true"
            />
            <span className="numeral-paragraph-sm text-[var(--color-muted)]">{band.label}</span>
          </li>
        ))}
      </ul>
      <LeafletMap quakes={visible} label={label} />
    </div>
  );
}
