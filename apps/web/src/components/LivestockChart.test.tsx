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

  it('does not announce the hover tooltip as a live region', async () => {
    render(<LivestockChart points={POINTS} />);
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('livestock-tooltip');
    expect(tooltip).not.toHaveAttribute('role', 'status');
    expect(tooltip).not.toHaveAttribute('aria-live');
  });

  it('exposes all four species in a keyboard-reachable table', () => {
    const { container } = render(<LivestockChart points={POINTS} />);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Year');
    expect(table).toHaveTextContent('Sheep');
    expect(table).toHaveTextContent('Dairy cattle');
    expect(table).toHaveTextContent('Beef cattle');
    expect(table).toHaveTextContent('Deer');
    expect(table).toHaveTextContent('1994');
    expect(table).toHaveTextContent('49.5 million');
  });

  it('drops sheep from the data table when toggled off', () => {
    const { container } = render(<LivestockChart points={POINTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide sheep' }));
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Dairy cattle');
    expect(table).not.toHaveTextContent('Sheep');
  });

  it('hides sheep from the chart and tooltip when toggled off', async () => {
    render(<LivestockChart points={POINTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hide sheep' }));
    expect(screen.getByRole('button', { name: 'Show sheep' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.mouseMove(screen.getByRole('img'), { clientX: 100, clientY: 100 });
    const tooltip = await screen.findByTestId('livestock-tooltip');
    expect(tooltip).toHaveTextContent('Dairy cattle');
    expect(tooltip).not.toHaveTextContent('Sheep');
  });

  it('renders a fallback label for empty data', () => {
    render(<LivestockChart points={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/livestock numbers over time/i);
  });
});
