import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { SheepSeriesPoint } from '@/lib/sheep-data';

import { SheepChart } from './SheepChart';

expect.extend(toHaveNoViolations);

const POINTS: SheepSeriesPoint[] = [
  { year: 1994, sheep: 49466054 },
  { year: 2010, sheep: 32562612 },
  { year: 2025, sheep: 23252463 },
];

describe('SheepChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<SheepChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/1994 to 2025/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SheepChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('shows the population for the hovered year', async () => {
    render(<SheepChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('sheep-tooltip');
    expect(tooltip).toHaveTextContent('1994');
    expect(tooltip).toHaveTextContent('49.5 million sheep');
  });

  it('renders a fallback label for empty data', () => {
    render(<SheepChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/sheep numbers over time/i);
  });
});
