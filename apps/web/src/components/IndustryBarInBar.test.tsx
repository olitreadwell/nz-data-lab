import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { IndustryBarInBar } from './IndustryBarInBar';

expect.extend(toHaveNoViolations);

describe('IndustryBarInBar', () => {
  it('renders a bar pair for every industry', () => {
    const { container } = render(<IndustryBarInBar />);
    expect(container.querySelectorAll('rect')).toHaveLength(38);
  });

  it('sorts by change when toggled', () => {
    const { container } = render(<IndustryBarInBar />);
    fireEvent.click(screen.getByRole('radio', { name: 'By change' }));
    const firstRowTitle = container.querySelector('g title')?.textContent ?? '';
    expect(firstRowTitle).toContain('Financial and insurance services');
  });

  it('filters industries by search', () => {
    const { container } = render(<IndustryBarInBar />);
    fireEvent.change(screen.getByPlaceholderText('Find an industry'), {
      target: { value: 'construction' },
    });
    expect(container.querySelectorAll('rect')).toHaveLength(2);
  });

  it('lists the verified counts in the data table', () => {
    const { container } = render(<IndustryBarInBar />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('Construction')).toBeInTheDocument();
    expect(within(table).getByText('81,249')).toBeInTheDocument();
    expect(within(table).getByText('+20.8%')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<IndustryBarInBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
