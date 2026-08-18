import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { EthnicityWaffle } from './EthnicityWaffle';

expect.extend(toHaveNoViolations);

describe('EthnicityWaffle', () => {
  it('renders every ethnic group at the 2013 census by default', () => {
    render(<EthnicityWaffle />);
    expect(screen.getByRole('img', { name: /2013 Census/i })).toBeInTheDocument();
    expect(screen.getAllByText('European').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Asian').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pacific peoples').length).toBeGreaterThan(0);
  });

  it('switches census year and updates the shares', () => {
    render(<EthnicityWaffle />);
    fireEvent.click(screen.getByRole('radio', { name: '2023' }));
    expect(screen.getByRole('img', { name: /2023 Census/i })).toBeInTheDocument();
    expect(screen.getAllByText('67.8%').length).toBeGreaterThan(0);
  });

  it('fills one cell per person in 100 for the selected year', () => {
    const { container } = render(<EthnicityWaffle />);
    const europeanRow = container.querySelector('ul[aria-label*="European, 74.0%"]');
    if (europeanRow === null) {
      throw new Error('expected the European row to render');
    }
    const cells = europeanRow.querySelectorAll('li');
    expect(cells).toHaveLength(100);
    const filled = Array.from(cells).filter((cell) =>
      cell.getAttribute('style')?.includes('rgb(14, 165, 233)'),
    );
    expect(filled).toHaveLength(74);
  });

  it('lists the verified shares in the data table', () => {
    const { container } = render(<EthnicityWaffle />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('Asian')).toBeInTheDocument();
    expect(within(table).getByText('17.3%')).toBeInTheDocument();
    expect(within(table).getByText('11.8%')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EthnicityWaffle />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
