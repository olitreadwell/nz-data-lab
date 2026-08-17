import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveInaturalistTaxon } from '@/lib/live-sources';

import { BackyardSpeciesCensus } from './BackyardSpeciesCensus';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const TAXA: LiveInaturalistTaxon[] = [
  { taxon: 'Aves', speciesCount: 657, observationCount: 544818, observerCount: 23504 },
  { taxon: 'Plantae', speciesCount: 9840, observationCount: 2025138, observerCount: 38926 },
  { taxon: 'Insecta', speciesCount: 5605, observationCount: 800635, observerCount: 23494 },
];

FETCH_MOCK.mockResolvedValue(TAXA);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveInaturalistTaxa: FETCH_MOCK,
}));

describe('BackyardSpeciesCensus', () => {
  it('shows the census and the bubble chart', async () => {
    render(<BackyardSpeciesCensus />);
    expect(await screen.findByText(/3 iconic groups, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /New Zealand species by observations, species, and observers/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Aves/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plantae/ })).toBeInTheDocument();
  });

  it('hides a taxon when its button is toggled off', async () => {
    render(<BackyardSpeciesCensus />);
    await screen.findByText(/3 iconic groups, fetched live/);
    const avesButton = screen.getByRole('button', { name: /Aves/ });
    expect(avesButton).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(avesButton);
    expect(avesButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BackyardSpeciesCensus />);
    await screen.findByText(/3 iconic groups, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
