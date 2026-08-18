import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { CityRankSlope } from './CityRankSlope';

expect.extend(toHaveNoViolations);

describe('CityRankSlope', () => {
  it('renders the slope chart with the movers mode on by default', () => {
    render(<CityRankSlope />);
    expect(screen.getByRole('img', { name: /City population ranks/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/cities moved rank between 2013 and 2023/)).toBeInTheDocument();
  });

  it('switches to showing every city', () => {
    render(<CityRankSlope />);
    fireEvent.click(screen.getByRole('button', { name: 'All 10' }));
    expect(screen.getByRole('button', { name: 'All 10' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CityRankSlope />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
