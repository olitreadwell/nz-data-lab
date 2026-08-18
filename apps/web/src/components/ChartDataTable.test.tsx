import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChartDataTable } from './ChartDataTable';

interface Row {
  decade: string;
  count: number;
}

const COLUMNS = [
  { key: 'decade' as const, header: 'Decade' },
  { key: 'count' as const, header: 'Count' },
];

const ROWS: Row[] = [
  { decade: '1890s', count: 12 },
  { decade: '1900s', count: 34 },
];

describe('ChartDataTable', () => {
  it('renders the first cell of each row as a row header', () => {
    render(<ChartDataTable summary="Records by decade" columns={COLUMNS} rows={ROWS} />);
    const rowHeaders = screen.getAllByRole('rowheader');
    expect(rowHeaders).toHaveLength(ROWS.length);
    expect(rowHeaders[0]).toHaveTextContent('1890s');
    expect(rowHeaders[1]).toHaveTextContent('1900s');
    expect(rowHeaders[0]).toHaveAttribute('scope', 'row');
    expect(rowHeaders[1]).toHaveAttribute('scope', 'row');
  });

  it('renders the remaining cells as data cells', () => {
    render(<ChartDataTable summary="Records by decade" columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByRole('cell', { name: '12' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '34' })).toBeInTheDocument();
  });
});
