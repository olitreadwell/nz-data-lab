import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { QuakeYearStripChart } from './QuakeYearStripChart';

expect.extend(toHaveNoViolations);

const { MOCK_EVENTS } = vi.hoisted(() => ({
  MOCK_EVENTS: [
    { y: 2016, m: 7.8, d: 15.1, t: 1478988176, p: '15 km north-east of Culverden' },
    { y: 2016, m: 5.1, d: 30, t: 1478990000, p: '25 km north of Kaikoura' },
    { y: 2016, m: 4.4, d: 18, t: 1478991000, p: '10 km east of Seddon' },
    { y: 2018, m: 4.2, d: 40, t: 1515000000, p: '30 km south of Seddon' },
    { y: 2018, m: 6.1, d: 20, t: 1516000000, p: '20 km east of Waipukurau' },
  ],
}));

vi.mock('@/lib/quake-year-data', () => ({
  QUAKE_YEAR_START: 2001,
  QUAKE_YEAR_END: 2024,
  QUAKE_YEAR_EVENTS: MOCK_EVENTS,
  QUAKE_YEAR_COUNTS: { 2016: 3, 2018: 2 },
  QUAKE_YEAR_TOTAL: 5,
  QUAKE_YEAR_PEAK: { year: 2016, count: 3 },
  QUAKE_YEAR_QUIET: { year: 2018, count: 2 },
  filterQuakeYearsByMinMagnitude: (minMagnitude: number) =>
    MOCK_EVENTS.filter((event) => event.m >= minMagnitude),
}));

describe('QuakeYearStripChart', () => {
  it('renders an accessible chart naming the year range and magnitude floor', () => {
    render(<QuakeYearStripChart />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/2001 to 2024/);
    expect(chart).toHaveAccessibleName(/magnitude 4.0 or stronger/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeYearStripChart />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exposes the yearly counts in a keyboard-reachable table', () => {
    const { container } = render(<QuakeYearStripChart />);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Quakes at M 4.0+' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2016' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '3' })).toBeInTheDocument();
  });

  it('filters dots when the magnitude floor rises', () => {
    render(<QuakeYearStripChart />);
    const slider = screen.getByRole('slider', { name: /show quakes from magnitude/i });
    fireEvent.change(slider, { target: { value: '5' } });
    const output = screen.getByText(/M 5\.0:/i);
    expect(output).toHaveTextContent('3');
  });
});
