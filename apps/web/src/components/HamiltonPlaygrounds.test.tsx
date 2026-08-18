import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveHamiltonPlayground } from '@/lib/live-sources';

import { buildPlaygroundHeatmap, HamiltonPlaygrounds } from './HamiltonPlaygrounds';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const PLAYGROUNDS: LiveHamiltonPlayground[] = [
  { parkName: 'Galloway Park', type: 'Old Neighbourhood', decade: 2000 },
  { parkName: 'Rototuna Park', type: 'Recent Neighbourhood', decade: 2010 },
  { parkName: 'Flagstaff Park', type: 'Old Neighbourhood', decade: 2000 },
  { parkName: 'Hamilton Lake', type: 'Destination', decade: 2000 },
  { parkName: 'Unknown Park', type: 'Old Neighbourhood', decade: null },
];

FETCH_MOCK.mockResolvedValue(PLAYGROUNDS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveHamiltonPlaygrounds: FETCH_MOCK,
}));

describe('buildPlaygroundHeatmap', () => {
  it('groups playgrounds into a type-by-decade grid', () => {
    const heatmap = buildPlaygroundHeatmap(PLAYGROUNDS);
    expect(heatmap.types).toEqual(['Destination', 'Old Neighbourhood', 'Recent Neighbourhood']);
    expect(heatmap.decades).toEqual([2000, 2010]);
    expect(heatmap.maxCount).toBe(2);
    const old2000 = heatmap.cells.find(
      (cell) => cell.type === 'Old Neighbourhood' && cell.decade === 2000,
    );
    expect(old2000?.count).toBe(2);
    const destination2010 = heatmap.cells.find(
      (cell) => cell.type === 'Destination' && cell.decade === 2010,
    );
    expect(destination2010?.count).toBe(0);
  });

  it('returns empty axes when there is no data', () => {
    const heatmap = buildPlaygroundHeatmap([]);
    expect(heatmap.types).toEqual([]);
    expect(heatmap.decades).toEqual([]);
    expect(heatmap.cells).toEqual([]);
  });
});

describe('HamiltonPlaygrounds', () => {
  it('shows the playground heatmap', async () => {
    render(<HamiltonPlaygrounds />);
    expect(await screen.findByText(/5 playgrounds, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /5 Hamilton playgrounds by type and decade/ }),
    ).toBeInTheDocument();
  });

  it('toggles a type off and on', async () => {
    render(<HamiltonPlaygrounds />);
    await screen.findByText(/5 playgrounds, fetched live/);
    const destinationButton = screen.getByRole('button', { name: 'Destination' });
    fireEvent.click(destinationButton);
    expect(destinationButton).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('img', { name: /4 Hamilton playgrounds by type and decade/ }),
    ).toBeInTheDocument();
    fireEvent.click(destinationButton);
    expect(destinationButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HamiltonPlaygrounds />);
    await screen.findByText(/5 playgrounds, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
