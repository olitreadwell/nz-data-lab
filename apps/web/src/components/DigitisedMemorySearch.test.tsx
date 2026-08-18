import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveDigitalNzSearchResult } from '@/lib/live-sources';

import { DigitisedMemorySearch } from './DigitisedMemorySearch';

expect.extend(toHaveNoViolations);

const { SEARCH_MOCK } = vi.hoisted(() => ({ SEARCH_MOCK: vi.fn() }));

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

SEARCH_MOCK.mockResolvedValue(RESULT);

vi.mock('@/lib/live-sources', () => ({
  searchLiveDigitalNz: SEARCH_MOCK,
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

  it('announces the decade unit via aria-valuetext on both sliders', async () => {
    render(<DigitisedMemorySearch initialQuery="gold" />);
    await screen.findByText(/1,977,021 records match/);
    const earliest = screen.getByRole('slider', { name: /Earliest decade/ });
    const latest = screen.getByRole('slider', { name: /Latest decade/ });
    expect(earliest).toHaveAttribute('aria-valuetext', '1860s');
    expect(latest).toHaveAttribute('aria-valuetext', '1900s');
    fireEvent.change(earliest, { target: { value: '1890' } });
    expect(earliest).toHaveAttribute('aria-valuetext', '1890s');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DigitisedMemorySearch initialQuery="gold" />);
    await screen.findByText(/1,977,021 records match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders an anchor only for safe http/https urls', async () => {
    SEARCH_MOCK.mockResolvedValueOnce({
      resultCount: 4,
      decades: [],
      records: [
        {
          id: 1,
          title: 'https record',
          contentPartner: '',
          url: 'https://example.com/1',
          year: null,
        },
        {
          id: 2,
          title: 'http record',
          contentPartner: '',
          url: 'http://example.com/2',
          year: null,
        },
        {
          id: 3,
          title: 'javascript record',
          contentPartner: '',
          url: 'javascript:alert(1)',
          year: null,
        },
        { id: 4, title: 'empty record', contentPartner: '', url: '', year: null },
      ],
    });
    render(<DigitisedMemorySearch initialQuery="gold" />);
    await screen.findByText('https record');

    expect(screen.getByText('https record').closest('a')).toHaveAttribute(
      'href',
      'https://example.com/1',
    );
    expect(screen.getByText('http record').closest('a')).toHaveAttribute(
      'href',
      'http://example.com/2',
    );
    expect(screen.getByText('javascript record').closest('a')).toBeNull();
    expect(screen.getByText('empty record').closest('a')).toBeNull();
  });
});
