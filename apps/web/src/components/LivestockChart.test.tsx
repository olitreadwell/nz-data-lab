import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { LivestockSeriesPoint } from '@/lib/livestock-data';

import { LivestockChart } from './LivestockChart';

expect.extend(toHaveNoViolations);

const POINTS: LivestockSeriesPoint[] = [
  { year: 1994, sheep: 49466054, dairyCattle: 3840000, beefCattle: 5050000, deer: 1230000 },
  { year: 2010, sheep: 32562612, dairyCattle: 5000000, beefCattle: 4200000, deer: 1000000 },
  { year: 2025, sheep: 23252463, dairyCattle: 5750000, beefCattle: 3830000, deer: 710000 },
];

describe('LivestockChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<LivestockChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 to 2025/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LivestockChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows all four species for the hovered year', async () => {
    render(<LivestockChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('livestock-tooltip');
    expect(tooltip).toHaveTextContent('1994');
    expect(tooltip).toHaveTextContent('Sheep');
    expect(tooltip).toHaveTextContent('Dairy cattle');
    expect(tooltip).toHaveTextContent('Beef cattle');
    expect(tooltip).toHaveTextContent('Deer');
  });

  it('renders a fallback label for empty data', () => {
    render(<LivestockChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/livestock numbers over time/i);
  });
});
