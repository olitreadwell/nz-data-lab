import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { EmploymentMarimekko } from './EmploymentMarimekko';

expect.extend(toHaveNoViolations);

describe('EmploymentMarimekko', () => {
  it('renders an accessible marimekko naming both years', () => {
    render(<EmploymentMarimekko />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/February 2020/);
    expect(chart).toHaveAccessibleName(/February 2025/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EmploymentMarimekko />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exposes the employee counts in a keyboard-reachable table', () => {
    const { container } = render(<EmploymentMarimekko />);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    expect(screen.getByRole('columnheader', { name: 'Industry' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Feb 2020' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Feb 2025' })).toBeInTheDocument();
    expect(
      screen.getByRole('rowheader', { name: 'Health care and social assistance' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '293,600' })).toBeInTheDocument();
  });

  it('switches the columns to equal width', () => {
    render(<EmploymentMarimekko />);
    fireEvent.click(screen.getByRole('radio', { name: 'Equal columns' }));
    expect(screen.getByRole('img')).toHaveAccessibleName(/equal column widths/i);
  });

  it('reads the focused industry across both years', () => {
    const { container } = render(<EmploymentMarimekko />);
    const firstBlock = container.querySelector('rect');
    if (firstBlock === null) {
      throw new Error('Expected a marimekko block');
    }
    fireEvent.mouseEnter(firstBlock);
    expect(screen.getByText(/250,100 in Feb 2020, 293,600 in Feb 2025/)).toBeInTheDocument();
  });
});
