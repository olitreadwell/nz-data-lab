import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { RabbitSpotlightPoint } from '@/lib/rabbit-data';

import { RabbitChart } from './RabbitChart';

expect.extend(toHaveNoViolations);

const POINTS: RabbitSpotlightPoint[] = [
  { year: 2012, sites: 5, rabbits: 263, km: 112, rabbitsPerKm: 2.35 },
  { year: 2016, sites: 5, rabbits: 945, km: 123, rabbitsPerKm: 7.68 },
  { year: 2021, sites: 10, rabbits: 3102, km: 234, rabbitsPerKm: 13.26 },
];

describe('RabbitChart', () => {
  it('renders an accessible chart with the year range', () => {
    render(<RabbitChart points={POINTS} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/2012 to 2021/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RabbitChart points={POINTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exposes the data in a keyboard-reachable table', () => {
    const { container } = render(<RabbitChart points={POINTS} />);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rabbits per km' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2012' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '2.4 per km' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2021' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '13.3 per km' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '3,102' })).toBeInTheDocument();
  });

  it('shows the rate for the hovered year', async () => {
    render(<RabbitChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 600, clientY: 100 });
    const tooltip = await screen.findByTestId('rabbit-tooltip');
    expect(tooltip).toHaveTextContent('2021');
    expect(tooltip).toHaveTextContent('13.3 per km');
  });

  it('renders a fallback label for empty data', () => {
    render(<RabbitChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/rabbit spotlight counts over time/i);
  });
});
