import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { MedianAgeTileGrid } from './MedianAgeTileGrid';

expect.extend(toHaveNoViolations);

describe('MedianAgeTileGrid', () => {
  it('renders a tile for every regional council area with the 2023 census on by default', () => {
    const { container } = render(<MedianAgeTileGrid />);
    expect(container.querySelectorAll('rect')).toHaveLength(16);
    expect(
      screen.getByRole('img', { name: 'Median age by regional council area, 2023 census' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2023 census' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('switches to the 2013 census', () => {
    render(<MedianAgeTileGrid />);
    fireEvent.click(screen.getByRole('radio', { name: '2013 census' }));
    expect(
      screen.getByRole('img', { name: 'Median age by regional council area, 2013 census' }),
    ).toBeInTheDocument();
  });

  it('shows the West Coast as the oldest region and Auckland as the youngest in 2023', () => {
    const { container } = render(<MedianAgeTileGrid />);
    const textNodes = Array.from(container.querySelectorAll('text')).map(
      (node) => node.textContent ?? '',
    );
    expect(textNodes).toContain('West Coast');
    expect(textNodes).toContain('Auckland');
    expect(textNodes).toContain('47.9');
    expect(textNodes).toContain('35.9');
  });

  it('lists the verified medians in the data table', () => {
    const { container } = render(<MedianAgeTileGrid />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('West Coast')).toBeInTheDocument();
    expect(within(table).getByText('47.9 years')).toBeInTheDocument();
    expect(within(table).getByText('+5.1')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MedianAgeTileGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
