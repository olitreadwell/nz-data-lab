import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveGbifKingdom } from '@/lib/live-sources';

import { SpeciesRecordLedger } from './SpeciesRecordLedger';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const KINGDOMS: LiveGbifKingdom[] = [
  { kingdom: 'Animalia', count2014: 208004, count2024: 1496447 },
  { kingdom: 'Plantae', count2014: 37149, count2024: 259434 },
  { kingdom: 'Fungi', count2014: 458989, count2024: 98269 },
];

FETCH_MOCK.mockResolvedValue(KINGDOMS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveGbifKingdoms: FETCH_MOCK,
}));

describe('SpeciesRecordLedger', () => {
  it('shows the ledger and the slope chart', async () => {
    render(<SpeciesRecordLedger />);
    expect(await screen.findByText(/3 kingdoms, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /New Zealand species records by kingdom, 2014 to 2024/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Animalia/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fungi/ })).toBeInTheDocument();
  });

  it('hides a kingdom when its button is toggled off', async () => {
    render(<SpeciesRecordLedger />);
    await screen.findByText(/3 kingdoms, fetched live/);
    const fungiButton = screen.getByRole('button', { name: /Fungi/ });
    expect(fungiButton).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(fungiButton);
    expect(fungiButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SpeciesRecordLedger />);
    await screen.findByText(/3 kingdoms, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
