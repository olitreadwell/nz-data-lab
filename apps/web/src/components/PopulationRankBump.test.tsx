import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { PopulationRankBump } from './PopulationRankBump';

expect.extend(toHaveNoViolations);

describe('PopulationRankBump', () => {
  it('renders the bump chart with the movers mode on by default', () => {
    render(<PopulationRankBump />);
    expect(screen.getByRole('img', { name: /biggest movers highlighted/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/territories moved 3 or more rank places/i)).toBeInTheDocument();
  });

  it('switches to showing every territory', () => {
    render(<PopulationRankBump />);
    fireEvent.click(screen.getByRole('button', { name: 'All 67 territories' }));
    expect(
      screen.getByRole('img', { name: /Territorial authority population ranks/ }),
    ).toHaveAccessibleName(/All 67 territories/i);
  });

  it('shows a legend mapping line colors to mover categories', () => {
    render(<PopulationRankBump />);
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('Climbed');
    expect(legend).toHaveTextContent('Fell');
    expect(legend).toHaveTextContent('Little change');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PopulationRankBump />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
