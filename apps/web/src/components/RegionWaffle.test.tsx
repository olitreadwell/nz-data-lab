import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { RegionWaffle } from './RegionWaffle';

expect.extend(toHaveNoViolations);

describe('RegionWaffle', () => {
  it('renders 100 cells with Auckland holding 33 at the 2023 census', () => {
    const { container } = render(<RegionWaffle />);
    const grid = container.querySelector('ul.grid');
    if (grid === null) {
      throw new Error('expected the waffle grid to render');
    }
    const cells = grid.querySelectorAll('li');
    expect(cells).toHaveLength(100);
    const aucklandCells = Array.from(cells).filter((cell) =>
      cell.getAttribute('title')?.includes('Auckland'),
    );
    expect(aucklandCells).toHaveLength(33);
  });

  it('switches census year and updates the shares', () => {
    render(<RegionWaffle />);
    fireEvent.click(screen.getByRole('radio', { name: '2013' }));
    expect(screen.getByRole('img', { name: /2013 Census/i })).toBeInTheDocument();
    expect(screen.getAllByText('33.4%').length).toBeGreaterThan(0);
  });

  it('dims regions that do not match the search', () => {
    const { container } = render(<RegionWaffle />);
    fireEvent.change(screen.getByPlaceholderText('Find a region'), {
      target: { value: 'Canterbury' },
    });
    const legendItems = Array.from(container.querySelectorAll('li'));
    const canterburyItem = legendItems.find((item) => item.textContent?.includes('Canterbury'));
    const aucklandItem = legendItems.find((item) => item.textContent?.includes('Auckland'));
    expect(canterburyItem?.className).toContain('text-[var(--color-fg)]');
    expect(aucklandItem?.className).toContain('opacity-50');
  });

  it('lists the verified counts in the data table', () => {
    const { container } = render(<RegionWaffle />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('Auckland')).toBeInTheDocument();
    expect(within(table).getByText('1,656,486')).toBeInTheDocument();
    expect(within(table).getByText('194,007')).toBeInTheDocument();
    expect(screen.getByText(/counted 4,993,290 people/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RegionWaffle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
