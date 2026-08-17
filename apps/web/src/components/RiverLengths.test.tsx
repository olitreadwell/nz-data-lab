import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveWikidataRiver } from '@/lib/live-sources';

import { buildRiverWaterfallBars, RiverLengths } from './RiverLengths';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const RIVERS: LiveWikidataRiver[] = [
  { name: 'Waikato River', lengthKm: 425 },
  { name: 'Clutha River / Mata-Au', lengthKm: 338 },
  { name: 'Whanganui River', lengthKm: 290 },
  { name: 'Taieri River', lengthKm: 288 },
  { name: 'Rangitīkei River', lengthKm: 240 },
  { name: 'Robinson River', lengthKm: 235 },
];

FETCH_MOCK.mockResolvedValue(RIVERS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveWikidataRivers: FETCH_MOCK,
}));

describe('buildRiverWaterfallBars', () => {
  it('builds cumulative bars plus a total', () => {
    const bars = buildRiverWaterfallBars(RIVERS, 3);
    expect(bars).toEqual([
      { name: 'Waikato River', value: 425, cumulative: 425, isTotal: false },
      { name: 'Clutha River / Mata-Au', value: 338, cumulative: 763, isTotal: false },
      { name: 'Whanganui River', value: 290, cumulative: 1053, isTotal: false },
      { name: 'Total', value: 1053, cumulative: 1053, isTotal: true },
    ]);
  });
});

describe('RiverLengths', () => {
  it('shows the river waterfall', async () => {
    render(<RiverLengths />);
    expect(await screen.findByText(/6 rivers, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /The 10 longest New Zealand rivers/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Waikato River').length).toBeGreaterThan(0);
  });

  it('changes the top-N list with the toggle', async () => {
    render(<RiverLengths />);
    await screen.findByText(/6 rivers, fetched live/);
    const topFive = screen.getByRole('button', { name: 'Top 5' });
    fireEvent.click(topFive);
    expect(topFive).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', { name: /The 5 longest New Zealand rivers/ }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RiverLengths />);
    await screen.findByText(/6 rivers, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
