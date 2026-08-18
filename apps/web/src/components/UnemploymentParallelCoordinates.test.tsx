import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { UnemploymentParallelCoordinates } from './UnemploymentParallelCoordinates';

expect.extend(toHaveNoViolations);

describe('UnemploymentParallelCoordinates', () => {
  it('renders the parallel coordinates chart with the movers mode on by default', () => {
    render(<UnemploymentParallelCoordinates />);
    expect(screen.getByRole('img', { name: /biggest movers highlighted/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByText(/7 regions moved 3 or more rank places/i)).toBeInTheDocument();
  });

  it('switches to showing every region', () => {
    render(<UnemploymentParallelCoordinates />);
    fireEvent.click(screen.getByRole('radio', { name: 'All 12 regions' }));
    expect(screen.getByRole('img', { name: /all 12 regions/i })).toBeInTheDocument();
    expect(screen.getByText(/Rank 1 is the highest unemployment rate/i)).toBeInTheDocument();
  });

  it('shows a legend mapping line colors to mover categories', () => {
    render(<UnemploymentParallelCoordinates />);
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('Worse');
    expect(legend).toHaveTextContent('Improved');
    expect(legend).toHaveTextContent('Little change');
  });

  it('lists the verified rates and ranks in the data table', () => {
    const { container } = render(<UnemploymentParallelCoordinates />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    const aucklandRow = within(table).getByRole('row', { name: /Auckland/ });
    expect(within(aucklandRow).getByText('#5')).toBeInTheDocument();
    expect(within(aucklandRow).getByText('#1')).toBeInTheDocument();
    expect(within(aucklandRow).getByText('-4')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<UnemploymentParallelCoordinates />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
