import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveDigitalNzSearchResult } from '@/lib/live-sources';

import { DigitisedMemorySearch } from './DigitisedMemorySearch';

expect.extend(toHaveNoViolations);

const RESULT: LiveDigitalNzSearchResult = {
  resultCount: 1977021,
  decades: [
    { decade: 1860, count: 108375 },
    { decade: 1890, count: 427164 },
    { decade: 1900, count: 420259 },
  ],
  records: [
    {
      id: 1,
      title: 'Gold rush photo',
      contentPartner: 'Puke Ariki',
      url: 'https://example.com/1',
      year: 1892,
    },
    {
      id: 2,
      title: 'Gold Coast cartoon',
      contentPartner: 'Alexander Turnbull Library',
      url: 'https://example.com/2',
      year: 1902,
    },
  ],
};

vi.mock('@/lib/live-sources', () => ({
  searchLiveDigitalNz: vi.fn(async () => RESULT),
}));

describe('DigitisedMemorySearch', () => {
  it('searches the collection and shows the decade histogram', async () => {
    render(<DigitisedMemorySearch initialQuery="gold" />);
    expect(await screen.findByText(/1,977,021 records match "gold"/)).toBeInTheDocument();
    expect(screen.getByText('Gold rush photo')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Records matching "gold" by decade/ }),
    ).toBeInTheDocument();
  });

  it('filters records by decade with the sliders', async () => {
    render(<DigitisedMemorySearch initialQuery="gold" />);
    await screen.findByText(/1,977,021 records match/);
    const earliest = screen.getByRole('slider', { name: /Earliest decade/ });
    fireEvent.change(earliest, { target: { value: '1900' } });
    expect(screen.queryByText('Gold rush photo')).not.toBeInTheDocument();
    expect(screen.getByText('Gold Coast cartoon')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DigitisedMemorySearch initialQuery="gold" />);
    await screen.findByText(/1,977,021 records match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
