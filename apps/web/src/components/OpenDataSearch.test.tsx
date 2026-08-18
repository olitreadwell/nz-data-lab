import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveDataGovtNzDataset, LiveDataGovtNzSearchResult } from '@/lib/live-sources';

import { getOrgLabelColor, OpenDataSearch, ORG_COLORS } from './OpenDataSearch';

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

SEARCH_MOCK.mockResolvedValue({ datasets: DATASETS, totalCount: 3 });

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
    let resolveFirst: (value: LiveDataGovtNzSearchResult) => void = () => undefined;
    const first = new Promise<LiveDataGovtNzSearchResult>((resolve) => {
      resolveFirst = resolve;
    });
    SEARCH_MOCK.mockImplementationOnce(() => first);
    SEARCH_MOCK.mockImplementationOnce(async () => ({
      datasets: [{ name: 'sheep-counts', title: 'Sheep counts', organization: 'Stats NZ' }],
      totalCount: 1,
    }));
    render(<OpenDataSearch initialQuery="water" />);
    fireEvent.change(screen.getByLabelText(/Search the open data catalogue/), {
      target: { value: 'sheep' },
    });
    const form = screen.getByRole('button', { name: 'Search' }).closest('form');
    if (form === null) {
      throw new Error('Expected a search form');
    }
    fireEvent.submit(form);
    expect(await screen.findByText(/1 datasets match "sheep"/)).toBeInTheDocument();
    expect(screen.getByText('Sheep counts')).toBeInTheDocument();
    resolveFirst({ datasets: DATASETS, totalCount: 3 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText('River water quality')).not.toBeInTheDocument();
    expect(screen.getByText('Sheep counts')).toBeInTheDocument();
  });

  it('shows the real total match count, not the capped row count', async () => {
    SEARCH_MOCK.mockImplementationOnce(async () => ({
      datasets: DATASETS,
      totalCount: 4236,
    }));
    render(<OpenDataSearch initialQuery="water" />);
    expect(
      await screen.findByText(/4,236 datasets match "water"; showing the first 20/),
    ).toBeInTheDocument();
    expect(screen.getByText('River water quality')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<OpenDataSearch initialQuery="water" />);
    await screen.findByText(/3 datasets match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('keeps label contrast at 4.5:1 against every org fill', () => {
    for (const fill of ORG_COLORS) {
      expect(contrastRatio(fill, getOrgLabelColor(fill))).toBeGreaterThanOrEqual(4.5);
    }
  });
});

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const linearR = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  const linearG = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  const linearB = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}
