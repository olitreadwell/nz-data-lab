import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveWikipediaPage } from '@/lib/live-sources';

import { WhatTheWorldReads } from './WhatTheWorldReads';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const PAGES: LiveWikipediaPage[] = [
  {
    title: 'New Zealand',
    dailyViews: [8000, 8500, 9000, 21562, 7000, 7500, 7190],
  },
  {
    title: 'Auckland',
    dailyViews: [1500, 1600, 1400, 2678, 1550, 1526, 1526],
  },
  {
    title: 'All Blacks',
    dailyViews: [82, 90, 100, 445, 60, 70, 70],
  },
];

FETCH_MOCK.mockResolvedValue(PAGES);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveWikipediaPageviews: FETCH_MOCK,
}));

describe('WhatTheWorldReads', () => {
  it('shows the pageview timeline', async () => {
    render(<WhatTheWorldReads />);
    expect(await screen.findByText(/3 pages, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Daily Wikipedia views of New Zealand topics/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('New Zealand').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Auckland').length).toBeGreaterThan(0);
  });

  it('changes the window with the slider', async () => {
    render(<WhatTheWorldReads />);
    await screen.findByText(/3 pages, fetched live/);
    const slider = screen.getByRole('slider', { name: /Window/ });
    expect(slider).toHaveValue('30');
    fireEvent.change(slider, { target: { value: '7' } });
    expect(slider).toHaveValue('7');
    expect(screen.getAllByText(/last 7 days/).length).toBeGreaterThan(0);
  });

  it('announces the window unit via aria-valuetext', async () => {
    render(<WhatTheWorldReads />);
    await screen.findByText(/3 pages, fetched live/);
    const slider = screen.getByRole('slider', { name: /Window/ });
    expect(slider).toHaveAttribute('aria-valuetext', '30 days');
    fireEvent.change(slider, { target: { value: '7' } });
    expect(slider).toHaveAttribute('aria-valuetext', '7 days');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<WhatTheWorldReads />);
    await screen.findByText(/3 pages, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
