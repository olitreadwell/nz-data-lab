import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { VisitorArrivalDotPlot } from './VisitorArrivalDotPlot';

expect.extend(toHaveNoViolations);

describe('VisitorArrivalDotPlot', () => {
  it('renders the dot plot with both years on by default', () => {
    render(<VisitorArrivalDotPlot />);
    expect(screen.getByRole('img', { name: /both years/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Both years' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getAllByText('Australia').length).toBeGreaterThan(0);
    expect(screen.getAllByText('New Caledonia').length).toBeGreaterThan(0);
  });

  it('switches to showing 2015 only', () => {
    render(<VisitorArrivalDotPlot />);
    fireEvent.click(screen.getByRole('radio', { name: '2015 only' }));
    expect(screen.getByRole('img', { name: /2015 only/i })).toBeInTheDocument();
  });

  it('filters countries by name', () => {
    render(<VisitorArrivalDotPlot />);
    const chart = screen.getByRole('img', { name: /both years/i });
    fireEvent.change(screen.getByPlaceholderText('Country name'), {
      target: { value: 'india' },
    });
    expect(within(chart).getByText('India')).toBeInTheDocument();
    expect(within(chart).queryByText('Australia')).not.toBeInTheDocument();
  });

  it('shows a legend mapping dot colors to years', () => {
    render(<VisitorArrivalDotPlot />);
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('2015');
    expect(legend).toHaveTextContent('2019');
  });

  it('lists the verified arrivals in the data table', () => {
    const { container } = render(<VisitorArrivalDotPlot />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    const australiaRow = within(table).getByRole('row', { name: /Australia/ });
    expect(within(australiaRow).getByText('1,326,800')).toBeInTheDocument();
    expect(within(australiaRow).getByText('1,537,988')).toBeInTheDocument();
    expect(within(australiaRow).getByText('+16%')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VisitorArrivalDotPlot />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
