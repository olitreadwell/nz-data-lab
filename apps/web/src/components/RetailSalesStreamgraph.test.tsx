import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { RetailSalesStreamgraph } from './RetailSalesStreamgraph';

expect.extend(toHaveNoViolations);

describe('RetailSalesStreamgraph', () => {
  it('renders the streamgraph with every layer visible', () => {
    render(<RetailSalesStreamgraph />);
    expect(
      screen.getByRole('img', {
        name: 'Monthly electronic card transactions by industry from June 2021 to June 2025',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Durables' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('toggles a layer off and on', () => {
    render(<RetailSalesStreamgraph />);
    const button = screen.getByRole('button', { name: 'Hospitality' });
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RetailSalesStreamgraph />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
