import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { ForestrySeriesPoint } from '@/lib/forestry-data';

import { ForestryChart } from './ForestryChart';

expect.extend(toHaveNoViolations);

const POINTS: ForestrySeriesPoint[] = [
  { year: 2002, newPlanting: 33674, harvestedArea: 46658 },
  { year: 2010, newPlanting: 15000, harvestedArea: 55000 },
  { year: 2018, newPlanting: 8293, harvestedArea: 62103 },
];

describe('ForestryChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<ForestryChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/2002 to 2018/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ForestryChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exposes the data in a keyboard-reachable table', () => {
    const { container } = render(<ForestryChart points={POINTS} />);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Year');
    expect(table).toHaveTextContent('New planting');
    expect(table).toHaveTextContent('Harvested area');
    expect(table).toHaveTextContent('2002');
    expect(table).toHaveTextContent('336.7 km²');
    expect(table).toHaveTextContent('466.6 km²');
  });

  it('shows planting and harvest for the hovered year', async () => {
    render(<ForestryChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('forestry-tooltip');
    expect(tooltip).toHaveTextContent('New planting');
    expect(tooltip).toHaveTextContent('Harvested area');
  });

  it('renders a fallback label for empty data', () => {
    render(<ForestryChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(
      /forestry planting and harvest over time/i,
    );
  });
});
