import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { LivestockSeriesPoint } from '@/lib/livestock-data';

import { DairyTakeoverScatter } from './DairyTakeoverScatter';

expect.extend(toHaveNoViolations);

const POINTS: LivestockSeriesPoint[] = [
  { year: 1994, sheep: 49466054, dairyCattle: 3840000, beefCattle: 5050000, deer: 1230000 },
  { year: 2010, sheep: 32562612, dairyCattle: 5000000, beefCattle: 4200000, deer: 1000000 },
  { year: 2025, sheep: 23252463, dairyCattle: 5750000, beefCattle: 3830000, deer: 710000 },
];

describe('DairyTakeoverScatter', () => {
  it('renders an accessible chart with the year range', () => {
    render(<DairyTakeoverScatter points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 to 2025/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DairyTakeoverScatter points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a fallback label for empty data', () => {
    render(<DairyTakeoverScatter points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/sheep against dairy cattle over time/i);
  });
});
