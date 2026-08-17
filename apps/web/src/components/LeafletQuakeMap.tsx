'use client';

import type { GeoNetQuake } from '@nzlab/nz-sources';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';

import { BAND_COLORS, bandOf, radiusFor } from '@/lib/quake-utils';

interface LeafletQuakeMapProps {
  quakes: GeoNetQuake[];
  label: string;
}

const BUBBLE_FILL_OPACITY = 0.7;
const NZ_CENTER: [number, number] = [-41.5, 173.2];
const DEFAULT_ZOOM = 5;
const MIN_ZOOM = 4;
const MAX_ZOOM = 9;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' });
}

/** The Leaflet map itself, split out so it only loads in the browser. */
export function LeafletQuakeMap({ quakes, label }: LeafletQuakeMapProps): React.ReactElement {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    mapRef.current?.getContainer()?.setAttribute('aria-label', label);
  }, [label]);

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)] sm:h-[380px] lg:h-[440px]">
      <MapContainer
        ref={mapRef}
        center={NZ_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {quakes.map((quake) => (
          <CircleMarker
            key={quake.publicId}
            center={[quake.latitude, quake.longitude]}
            radius={radiusFor(quake.magnitude)}
            pathOptions={{
              color: BAND_COLORS[bandOf(quake.mmi)] ?? '#94a3b8',
              fillColor: BAND_COLORS[bandOf(quake.mmi)] ?? '#94a3b8',
              fillOpacity: BUBBLE_FILL_OPACITY,
              weight: 1,
            }}
          >
            <Tooltip>
              M {quake.magnitude.toFixed(1)} at {quake.depthKm.toFixed(0)} km, {quake.locality},{' '}
              {formatDate(quake.time)}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
