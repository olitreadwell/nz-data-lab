import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveMvrFleetRow } from '@/lib/live-sources';

import { VehicleFleet } from './VehicleFleet';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const MOTIVE_POWER: LiveMvrFleetRow[] = [
  { label: 'PETROL', count: 3178101 },
  { label: 'DIESEL', count: 1232189 },
  { label: 'Unknown', count: 882333 },
  { label: 'PETROL HYBRID', count: 420013 },
  { label: 'ELECTRIC', count: 107525 },
  { label: 'PLUGIN PETROL HYBRID', count: 50321 },
  { label: 'DIESEL HYBRID', count: 14983 },
  { label: 'PETROL ELECTRIC HYBRID', count: 11508 },
  { label: 'LPG', count: 3513 },
];

const VEHICLE_TYPES: LiveMvrFleetRow[] = [
  { label: 'PASSENGER CAR/VAN', count: 3687148 },
  { label: 'GOODS VAN/TRUCK/UTILITY', count: 928609 },
  { label: 'TRAILER/CARAVAN', count: 881275 },
  { label: 'MOTORCYCLE', count: 191097 },
];

FETCH_MOCK.mockImplementation(async (labelField: 'MOTIVE_POWER' | 'VEHICLE_TYPE') =>
  labelField === 'MOTIVE_POWER' ? MOTIVE_POWER : VEHICLE_TYPES,
);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveMvrFleet: FETCH_MOCK,
}));

describe('VehicleFleet', () => {
  it('shows the motive-power sunburst', async () => {
    render(<VehicleFleet />);
    expect(await screen.findByText(/5,900,486 vehicles, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /New Zealand's vehicle fleet by motive power/ }),
    ).toBeInTheDocument();
  });

  it('toggles to the vehicle-type view', async () => {
    render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    fireEvent.click(screen.getByRole('button', { name: 'By vehicle type' }));
    expect(
      screen.getByRole('img', { name: /New Zealand's vehicle fleet by type/ }),
    ).toBeInTheDocument();
  });

  it('groups small rows into Other', async () => {
    render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    expect(screen.getAllByText('Other').length).toBeGreaterThan(0);
  });

  it('shows a visible legend mapping each sector colour to its label', async () => {
    render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    const legend = screen.getByRole('list', { name: 'Sector colours legend' });
    expect(legend).toBeInTheDocument();
    expect(within(legend).getByText('PETROL')).toBeInTheDocument();
    expect(within(legend).getByText('DIESEL')).toBeInTheDocument();
  });

  it('lists every sector and count in a visible table', async () => {
    render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    const table = screen.getByRole('table');
    expect(table).toBeVisible();
    expect(screen.getByRole('cell', { name: '3,178,101' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '1,232,189' })).toBeInTheDocument();
  });

  it('no longer tells users to hover for the count', async () => {
    render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    expect(screen.queryByText(/Hover a sector to read the count/)).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VehicleFleet />);
    await screen.findByText(/5,900,486 vehicles, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
