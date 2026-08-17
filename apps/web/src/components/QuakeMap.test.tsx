import type { GeoNetQuake } from '@nzlab/nz-sources';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { bandOf, radiusFor } from '@/lib/quake-utils';

import { QuakeMap } from './QuakeMap';

expect.extend(toHaveNoViolations);

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  CircleMarker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="quake-marker">{children}</div>
  ),
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const QUAKES: GeoNetQuake[] = [
  {
    publicId: '2026p617265',
    time: '2026-08-17T09:19:00.000Z',
    depthKm: 10.2,
    magnitude: 3.4,
    mmi: 4,
    locality: '20 km north-west of Taihape',
    quality: 'best',
    latitude: -39.5,
    longitude: 175.6,
  },
  {
    publicId: '2026p614475',
    time: '2026-08-16T09:00:00.000Z',
    depthKm: 44.9,
    magnitude: 4.2,
    mmi: 4,
    locality: '45 km north-west of Te Anau',
    quality: 'best',
    latitude: -45.1,
    longitude: 167.4,
  },
  {
    publicId: '2026p613127',
    time: '2026-08-15T08:00:00.000Z',
    depthKm: 10,
    magnitude: 5.9,
    mmi: 7,
    locality: '5 km south-east of Hunterville',
    quality: 'best',
    latitude: -40.0,
    longitude: 175.5,
  },
];

describe('QuakeMap', () => {
  it('renders the map with the visible count', async () => {
    render(<QuakeMap quakes={QUAKES} />);
    expect(screen.getByText(/Showing 3 of 3 recent quakes/)).toBeInTheDocument();
    expect(await screen.findAllByTestId('quake-marker')).toHaveLength(3);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeMap quakes={QUAKES} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('filters quakes when the magnitude slider moves', async () => {
    render(<QuakeMap quakes={QUAKES} />);
    const slider = screen.getByRole('slider', { name: /minimum magnitude/i });
    fireEvent.change(slider, { target: { value: '5' } });
    expect(screen.getByText(/Showing 1 of 3 recent quakes/)).toBeInTheDocument();
    expect(await screen.findAllByTestId('quake-marker')).toHaveLength(1);
  });

  it('lists every visible quake with its data for keyboard users', () => {
    render(<QuakeMap quakes={QUAKES} />);
    const table = screen.getByRole('table', { name: /visible quakes/i });
    expect(table).toBeInTheDocument();
    // One header row plus one row per visible quake.
    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(within(table).getByText('20 km north-west of Taihape')).toBeInTheDocument();
    expect(within(table).getByText('M 3.4')).toBeInTheDocument();
    expect(within(table).getByText('45 km')).toBeInTheDocument();
    expect(within(table).getByText('17 Aug')).toBeInTheDocument();
  });

  it('keeps the table in sync with the sliders', () => {
    render(<QuakeMap quakes={QUAKES} />);
    const slider = screen.getByRole('slider', { name: /minimum magnitude/i });
    fireEvent.change(slider, { target: { value: '5' } });
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('5 km south-east of Hunterville')).toBeInTheDocument();
    expect(screen.queryByText('20 km north-west of Taihape')).not.toBeInTheDocument();
  });

  it('maps MMI to bands and magnitude to bubble radius', () => {
    expect(bandOf(3)).toBe('weak');
    expect(bandOf(6)).toBe('moderate');
    expect(bandOf(7)).toBe('strong');
    expect(radiusFor(5.9)).toBeGreaterThan(radiusFor(3.4));
  });
});
