import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { RegionalGrowthDumbbell } from './RegionalGrowthDumbbell';

expect.extend(toHaveNoViolations);

function firstRegionLabel(container: HTMLElement): string | undefined {
  const firstRow = container.querySelector('[data-region]');
  const label = firstRow?.querySelector('text');
  return label?.textContent ?? undefined;
}

describe('RegionalGrowthDumbbell', () => {
  it('renders every region in growth order by default', () => {
    const { container } = render(<RegionalGrowthDumbbell />);
    expect(screen.getByRole('img', { name: /sorted by growth/i })).toBeInTheDocument();
    expect(firstRegionLabel(container)).toBe('Northland');
    expect(screen.getAllByText('West Coast').length).toBeGreaterThan(0);
  });

  it('re-sorts by 2023 population when asked', () => {
    const { container } = render(<RegionalGrowthDumbbell />);
    fireEvent.click(screen.getByRole('radio', { name: 'By 2023 population' }));
    expect(screen.getByRole('img', { name: /sorted by 2023 population/i })).toBeInTheDocument();
    expect(firstRegionLabel(container)).toBe('Auckland');
  });

  it('exposes the sort selector as a radio group with one checked option', () => {
    render(<RegionalGrowthDumbbell />);
    const group = screen.getByRole('radiogroup', { name: 'How to sort the regions' });
    expect(group).toBeInTheDocument();
    const checked = within(group)
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('By growth');
  });

  it('lists the verified census figures in the data table', () => {
    const { container } = render(<RegionalGrowthDumbbell />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('Northland')).toBeInTheDocument();
    expect(within(table).getByText('194,007')).toBeInTheDocument();
    expect(within(table).getByText('+27.9%')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RegionalGrowthDumbbell />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
