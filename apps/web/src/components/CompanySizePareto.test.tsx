import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { CompanySizePareto } from './CompanySizePareto';

expect.extend(toHaveNoViolations);

describe('CompanySizePareto', () => {
  it('renders the all-industries pareto by default', () => {
    render(<CompanySizePareto />);
    expect(
      screen.getByRole('img', {
        name: /enterprises by employment size group for All industries/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/617,334 enterprises across all size groups/)).toBeInTheDocument();
  });

  it('switches the measure to paid employees', () => {
    render(<CompanySizePareto />);
    fireEvent.click(screen.getByRole('button', { name: 'Paid employees' }));
    expect(
      screen.getByRole('img', {
        name: /paid employees by employment size group for All industries/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/2,443,400 paid employees across all size groups/)).toBeInTheDocument();
  });

  it('filters to a single industry', () => {
    render(<CompanySizePareto />);
    fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'Construction' } });
    expect(
      screen.getByRole('img', {
        name: /enterprises by employment size group for Construction/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/81,249 enterprises across all size groups/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CompanySizePareto />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
