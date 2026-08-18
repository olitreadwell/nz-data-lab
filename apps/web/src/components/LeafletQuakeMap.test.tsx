import type { GeoNetQuake } from '@nzlab/nz-sources';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LeafletQuakeMap } from './LeafletQuakeMap';

vi.mock('react-leaflet', () => ({
  MapContainer: ({
    children,
    className,
    ref,
  }: {
    children: React.ReactNode;
    className?: string;
    ref: React.Ref<{ getContainer: () => HTMLElement }>;
  }) => {
    const setDiv = (node: HTMLElement | null): void => {
      if (node === null) {
        return;
      }
      const map = { getContainer: () => node };
      if (typeof ref === 'function') {
        ref(map);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: unknown }).current = map;
      }
    };
    return (
      <div ref={setDiv} data-testid="map-container" className={className}>
        {children}
      </div>
    );
  },
  TileLayer: () => <div data-testid="tile-layer" />,
  CircleMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="quake-marker">{children}</div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const QUAKE: GeoNetQuake = {
  publicId: '2026p617265',
  time: '2026-08-17T09:19:00.000Z',
  depthKm: 10.2,
  magnitude: 3.4,
  mmi: 4,
  locality: '20 km north-west of Taihape',
  quality: 'best',
  latitude: -39.5,
  longitude: 175.6,
};

describe('LeafletQuakeMap', () => {
  it('marks the map as a browse-safe region, not an application', () => {
    render(<LeafletQuakeMap quakes={[QUAKE]} label="Recent felt quakes on a map of New Zealand" />);
    const container = screen.getByTestId('map-container');
    expect(container.getAttribute('role')).toBe('region');
    expect(container.getAttribute('role')).not.toBe('application');
    expect(container.getAttribute('aria-label')).toBe('Recent felt quakes on a map of New Zealand');
  });

  it('shows a visible focus-visible outline on the map container', () => {
    render(<LeafletQuakeMap quakes={[QUAKE]} label="Recent felt quakes on a map of New Zealand" />);
    const container = screen.getByTestId('map-container');
    expect(container.className).toContain('focus-visible:outline-2');
    expect(container.className).toContain('focus-visible:outline-offset-2!');
    expect(container.className).toContain('focus-visible:outline-[var(--color-border)]');
  });
});
