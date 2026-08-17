import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveDataGovtNzDataset } from '@/lib/live-sources';

import { OpenDataSearch } from './OpenDataSearch';

expect.extend(toHaveNoViolations);

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

vi.mock('@/lib/live-sources', () => ({
  searchLiveDataGovtNz: vi.fn(async () => DATASETS),
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

  it('has no accessibility violations', async () => {
    const { container } = render(<OpenDataSearch initialQuery="water" />);
    await screen.findByText(/3 datasets match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
