import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveDataGovtNzDataset } from '@/lib/live-sources';

import { OpenDataSearch } from './OpenDataSearch';

expect.extend(toHaveNoViolations);

const { SEARCH_MOCK } = vi.hoisted(() => ({ SEARCH_MOCK: vi.fn() }));

const DATASETS: LiveDataGovtNzDataset[] = [
  {
    name: 'water-quality-1',
    title: 'River water quality',
    organization: 'Ministry for the Environment',
  },
  {
    name: 'water-levels-1',
    title: 'Lake water levels',
    organization: 'Ministry for the Environment',
  },
  { name: 'rainfall-1', title: 'Rainfall records', organization: 'NIWA' },
];

SEARCH_MOCK.mockResolvedValue(DATASETS);

vi.mock('@/lib/live-sources', () => ({
  searchLiveDataGovtNz: SEARCH_MOCK,
}));

describe('OpenDataSearch', () => {
  it('searches the catalogue and shows matching datasets', async () => {
    render(<OpenDataSearch initialQuery="water" />);
    expect(await screen.findByText(/3 datasets match "water"/)).toBeInTheDocument();
    expect(screen.getByText('River water quality')).toBeInTheDocument();
  });

  it('exposes the publisher counts in a keyboard-reachable table', async () => {
    const { container } = render(<OpenDataSearch initialQuery="water" />);
    await screen.findByText(/3 datasets match "water"/);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Publisher');
    expect(table).toHaveTextContent('Datasets');
    expect(table).toHaveTextContent('Ministry for the Environment');
    expect(table).toHaveTextContent('NIWA');
  });

  it('discards a stale response from an earlier search', async () => {
    let resolveFirst: (value: LiveDataGovtNzDataset[]) => void = () => {};
    const first = new Promise<LiveDataGovtNzDataset[]>((resolve) => {
      resolveFirst = resolve;
    });
    SEARCH_MOCK.mockImplementationOnce(() => first);
    SEARCH_MOCK.mockImplementationOnce(async () => [
      { name: 'sheep-counts', title: 'Sheep counts', organization: 'Stats NZ' },
    ]);
    render(<OpenDataSearch initialQuery="water" />);
    fireEvent.change(screen.getByLabelText(/Search the open data catalogue/), {
      target: { value: 'sheep' },
    });
    fireEvent.submit(screen.getByRole('button', { name: 'Search' }).closest('form') as HTMLFormElement);
    expect(await screen.findByText(/1 datasets match "sheep"/)).toBeInTheDocument();
    expect(screen.getByText('Sheep counts')).toBeInTheDocument();
    resolveFirst(DATASETS);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('River water quality')).not.toBeInTheDocument();
    expect(screen.getByText('Sheep counts')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OpenDataSearch initialQuery="water" />);
    await screen.findByText(/3 datasets match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
