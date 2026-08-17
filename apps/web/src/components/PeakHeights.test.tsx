import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveWikidataPeak } from '@/lib/live-sources';

import { PeakHeights } from './PeakHeights';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const PEAKS: LiveWikidataPeak[] = [
  { name: 'Aoraki / Mount Cook', elevationM: 3724 },
  { name: 'Mount Tasman', elevationM: 3497 },
  { name: 'Mount Dampier', elevationM: 3440 },
  { name: 'Mount Vancouver', elevationM: 3309 },
  { name: 'Silberhorn', elevationM: 3300 },
  { name: 'Hodgson', elevationM: 3257 },
];

FETCH_MOCK.mockResolvedValue(PEAKS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveWikidataPeaks: FETCH_MOCK,
}));

describe('PeakHeights', () => {
  it('shows the peak funnel', async () => {
    render(<PeakHeights />);
    expect(await screen.findByText(/6 peaks, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /The 10 highest New Zealand peaks/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Aoraki / Mount Cook').length).toBeGreaterThan(0);
  });

  it('changes the top-N list with the toggle', async () => {
    render(<PeakHeights />);
    await screen.findByText(/6 peaks, fetched live/);
    const topFive = screen.getByRole('button', { name: 'Top 5' });
    fireEvent.click(topFive);
    expect(topFive).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('img', { name: /The 5 highest New Zealand peaks/ }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PeakHeights />);
    await screen.findByText(/6 peaks, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
