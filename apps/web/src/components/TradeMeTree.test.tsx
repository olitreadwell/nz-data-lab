import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveTradeMeCategory } from '@/lib/live-sources';

import { TradeMeTree } from './TradeMeTree';

expect.extend(toHaveNoViolations);

const TREE: LiveTradeMeCategory = {
  name: 'Root',
  number: '',
  path: '',
  isLeaf: false,
  subcategories: [
    {
      name: 'Trade Me Motors',
      number: '0001-',
      path: '/Trade-Me-Motors',
      isLeaf: false,
      subcategories: [
        {
          name: 'Cars',
          number: '0001-0268-',
          path: '/Trade-Me-Motors/Cars',
          isLeaf: false,
          subcategories: [
            {
              name: 'Alfa Romeo',
              number: '0001-0268-0269-',
              path: '/Trade-Me-Motors/Cars/Alfa-Romeo',
              isLeaf: true,
              subcategories: [],
            },
          ],
        },
      ],
    },
    {
      name: 'Home & living',
      number: '0002-',
      path: '/Home-living',
      isLeaf: false,
      subcategories: [
        {
          name: 'Furniture',
          number: '0002-0001-',
          path: '/Home-living/Furniture',
          isLeaf: true,
          subcategories: [],
        },
        {
          name: 'Kitchen',
          number: '0002-0002-',
          path: '/Home-living/Kitchen',
          isLeaf: true,
          subcategories: [],
        },
      ],
    },
  ],
};

vi.mock('@/lib/live-sources', () => ({
  fetchLiveTradeMeTree: vi.fn(async () => TREE),
}));

describe('TradeMeTree', () => {
  it('loads the tree and shows top-level categories', async () => {
    render(<TradeMeTree />);
    expect(await screen.findByText(/categories in the tree/)).toBeInTheDocument();
    expect(screen.getAllByText(/Trade Me Motors/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Home & living/).length).toBeGreaterThan(0);
  });

  it('renders a data table of top-level categories and leaf counts', async () => {
    render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    expect(
      screen.getAllByText('View top-level categories by leaf count as a table').length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole('cell', { name: 'Home & living' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Trade Me Motors' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '1' })).toBeInTheDocument();
  });

  it('expands a category to show its subcategories', async () => {
    render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    fireEvent.click(screen.getByRole('button', { name: /Trade Me Motors/ }));
    expect(screen.getByText(/Cars/)).toBeInTheDocument();
  });

  it('filters categories by search', async () => {
    render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    fireEvent.change(screen.getByLabelText(/Filter Trade Me categories/), {
      target: { value: 'furniture' },
    });
    const results = within(screen.getByRole('list'));
    expect(results.getByText('Furniture')).toBeInTheDocument();
    expect(results.queryByText('Trade Me Motors')).not.toBeInTheDocument();
  });

  it('announces the filtered result count in the live region', async () => {
    render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    fireEvent.change(screen.getByLabelText(/Filter Trade Me categories/), {
      target: { value: 'furniture' },
    });
    expect(screen.getByText('1 category matches your filter.')).toBeInTheDocument();
  });

  it('announces the total count when no filter is active', async () => {
    render(<TradeMeTree />);
    expect(await screen.findByText('7 categories in the tree.')).toBeInTheDocument();
  });

  it('exposes the top categories in a keyboard-reachable table', async () => {
    const { container } = render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Category');
    expect(table).toHaveTextContent('Leaf count');
    expect(table).toHaveTextContent('Home & living');
    expect(table).toHaveTextContent('Trade Me Motors');
    expect(table).toHaveTextContent('2');
    expect(table).toHaveTextContent('1');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TradeMeTree />);
    await screen.findByText(/categories in the tree/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
