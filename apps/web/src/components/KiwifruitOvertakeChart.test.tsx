import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { HorticultureSeriesPoint } from '@/lib/horticulture-data';

import { KiwifruitOvertakeChart } from './KiwifruitOvertakeChart';

expect.extend(toHaveNoViolations);

const POINTS: HorticultureSeriesPoint[] = [
  { year: 1994, wineGrapes: 7160, kiwifruit: 12174, apples: 15257, avocados: 1375 },
  { year: 2024, wineGrapes: 37627, kiwifruit: 14514, apples: 9522, avocados: 4337 },
];

describe('KiwifruitOvertakeChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<KiwifruitOvertakeChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 and 2024/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<KiwifruitOvertakeChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a fallback label for empty data', () => {
    render(<KiwifruitOvertakeChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/orchard area before and after/i);
  });
});
