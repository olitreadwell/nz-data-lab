import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { HorticultureSeriesPoint } from '@/lib/horticulture-data';

import { HorticultureChart } from './HorticultureChart';

expect.extend(toHaveNoViolations);

const POINTS: HorticultureSeriesPoint[] = [
  { year: 1994, wineGrapes: 7160, kiwifruit: 12174, apples: 15257, avocados: 1375 },
  { year: 2010, wineGrapes: 20000, kiwifruit: 13000, apples: 11000, avocados: 3000 },
  { year: 2024, wineGrapes: 37627, kiwifruit: 14514, apples: 9522, avocados: 4337 },
];

describe('HorticultureChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<HorticultureChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 to 2024/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HorticultureChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows wine grapes for the hovered year', async () => {
    render(<HorticultureChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('horticulture-tooltip');
    expect(tooltip).toHaveTextContent('Wine grapes');
    expect(tooltip).toHaveTextContent('Kiwifruit');
  });

  it('renders a fallback label for empty data', () => {
    render(<HorticultureChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/horticulture area over time/i);
  });
});
