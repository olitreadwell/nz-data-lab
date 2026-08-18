import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { VisitorRankSlope } from './VisitorRankSlope';

expect.extend(toHaveNoViolations);

describe('VisitorRankSlope', () => {
  it('renders the slope chart with the movers mode on by default', () => {
    render(<VisitorRankSlope />);
    expect(
      screen.getByRole('img', { name: /Visitor arrival ranks by country/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByText(/countries moved visitor arrival rank between 2015 and 2019/),
    ).toBeInTheDocument();
  });

  it('switches to showing every country', () => {
    render(<VisitorRankSlope />);
    fireEvent.click(screen.getByRole('button', { name: 'All 30' }));
    expect(screen.getByRole('button', { name: 'All 30' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VisitorRankSlope />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
