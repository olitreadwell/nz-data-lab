import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { MedianAgeRankSlope } from './MedianAgeRankSlope';

expect.extend(toHaveNoViolations);

describe('MedianAgeRankSlope', () => {
  it('renders the slope chart with the movers mode on by default', () => {
    render(<MedianAgeRankSlope />);
    expect(
      screen.getByRole('img', { name: /Regional council median age ranks/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(
      screen.getByText(/regions moved median age rank between 2013 and 2023/),
    ).toBeInTheDocument();
  });

  it('switches to showing every region', () => {
    render(<MedianAgeRankSlope />);
    fireEvent.click(screen.getByRole('button', { name: 'All 16' }));
    expect(screen.getByRole('button', { name: 'All 16' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MedianAgeRankSlope />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
