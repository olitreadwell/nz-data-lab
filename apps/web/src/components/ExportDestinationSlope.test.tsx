import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { ExportDestinationSlope } from './ExportDestinationSlope';

expect.extend(toHaveNoViolations);

describe('ExportDestinationSlope', () => {
  it('renders the slope chart with the movers mode on by default', () => {
    render(<ExportDestinationSlope />);
    expect(screen.getByRole('img', { name: /Goods export destination ranks/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Biggest movers' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/destinations moved rank between 2015 and 2026/)).toBeInTheDocument();
  });

  it('switches to showing every destination', () => {
    render(<ExportDestinationSlope />);
    fireEvent.click(screen.getByRole('button', { name: 'All 10' }));
    expect(screen.getByRole('button', { name: 'All 10' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ExportDestinationSlope />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
