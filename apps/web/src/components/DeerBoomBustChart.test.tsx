import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { LivestockSeriesPoint } from '@/lib/livestock-data';

import { DeerBoomBustChart } from './DeerBoomBustChart';

expect.extend(toHaveNoViolations);

const POINTS: LivestockSeriesPoint[] = [
  { year: 1994, sheep: 49466054, dairyCattle: 3840000, beefCattle: 5050000, deer: 1231109 },
  { year: 2004, sheep: 39200000, dairyCattle: 5100000, beefCattle: 4400000, deer: 1756888 },
  { year: 2025, sheep: 23252463, dairyCattle: 5750000, beefCattle: 3830000, deer: 712165 },
];

describe('DeerBoomBustChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<DeerBoomBustChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 to 2025/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DeerBoomBustChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a fallback label for empty data', () => {
    render(<DeerBoomBustChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/farmed deer over time/i);
  });
});
