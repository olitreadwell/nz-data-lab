import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { ExportRankBump } from './ExportRankBump';

expect.extend(toHaveNoViolations);

describe('ExportRankBump', () => {
  it('renders one line per market in the top 8 by default', () => {
    const { container } = render(<ExportRankBump />);
    expect(container.querySelectorAll('polyline')).toHaveLength(8);
    expect(screen.getByRole('img', { name: /top 8 markets/i })).toBeInTheDocument();
  });

  it('narrows to the top 5 markets', () => {
    const { container } = render(<ExportRankBump />);
    fireEvent.click(screen.getByRole('radio', { name: 'Top 5' }));
    expect(container.querySelectorAll('polyline')).toHaveLength(5);
    expect(screen.getByRole('img', { name: /top 5 markets/i })).toBeInTheDocument();
  });

  it('lists the verified ranks in the data table', () => {
    const { container } = render(<ExportRankBump />);
    const summary = container.querySelector('summary');
    if (summary !== null) {
      fireEvent.click(summary);
    }
    const table = screen.getByRole('table');
    expect(within(table).getByText('China')).toBeInTheDocument();
    expect(within(table).getAllByText('1st').length).toBeGreaterThanOrEqual(3);
    expect(within(table).getAllByText('2nd').length).toBeGreaterThanOrEqual(3);
    expect(within(table).getByText('$19.9b')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ExportRankBump />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
