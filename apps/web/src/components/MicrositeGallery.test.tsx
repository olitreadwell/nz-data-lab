import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MicrositeGallery } from './MicrositeGallery';
import type { MicrositeGalleryCard } from './MicrositeGallery';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const cards: MicrositeGalleryCard[] = [
  {
    slug: 'sheep-index',
    categorySlug: 'agriculture',
    eyebrow: '🐑 the sheep index',
    title: 'The Sheep Index',
    description: 'The national flock is in freefall.',
    statLabel: 'Sheep',
    statValue: '23.2m',
    accent: 'amber',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
  },
  {
    slug: 'shake-index',
    categorySlug: 'earthquakes',
    eyebrow: '🌏 the shake index',
    title: 'The Shake Index',
    description: 'Felt quakes across New Zealand.',
    statLabel: 'Quakes',
    statValue: '5,148',
    accent: 'sky',
    dataSource: 'GeoNet',
    chartType: 'Map',
    category: 'Earthquakes & geology',
  },
  {
    slug: 'retail-sales-by-month',
    categorySlug: 'economy',
    eyebrow: '🛍️ retail sales',
    title: 'Retail Sales',
    description: 'Card transactions by industry.',
    statLabel: 'Spend',
    statValue: '$6.2b',
    accent: 'purple',
    dataSource: 'Stats NZ',
    chartType: 'Streamgraph',
    category: 'Economy & business',
  },
];

function renderMicrosites(): void {
  render(<MicrositeGallery cards={cards} />);
}

describe('MicrositeGallery', () => {
  it('shows every card when no filter is selected', () => {
    renderMicrosites();
    expect(screen.getByRole('link', { name: /The Sheep Index/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /The Shake Index/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Retail Sales/ })).toBeInTheDocument();
    expect(screen.getByText('Showing 3 of 3 microsites.')).toBeInTheDocument();
  });

  it('filters by data source alone', async () => {
    renderMicrosites();
    await userEvent.selectOptions(screen.getByLabelText('Data source'), 'GeoNet');
    expect(screen.getByRole('link', { name: /The Shake Index/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /The Sheep Index/ })).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 3 microsites.')).toBeInTheDocument();
  });

  it('filters by chart type alone', async () => {
    renderMicrosites();
    await userEvent.selectOptions(screen.getByLabelText('Chart type'), 'Streamgraph');
    expect(screen.getByRole('link', { name: /Retail Sales/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /The Sheep Index/ })).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 3 microsites.')).toBeInTheDocument();
  });

  it('filters by category alone', async () => {
    renderMicrosites();
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Agriculture & farming');
    expect(screen.getByRole('link', { name: /The Sheep Index/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /The Shake Index/ })).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 3 microsites.')).toBeInTheDocument();
  });

  it('combines filters across all three dimensions', async () => {
    renderMicrosites();
    await userEvent.selectOptions(screen.getByLabelText('Data source'), 'Stats NZ');
    await userEvent.selectOptions(screen.getByLabelText('Chart type'), 'Line chart');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'Agriculture & farming');
    expect(screen.getByRole('link', { name: /The Sheep Index/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Retail Sales/ })).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 3 microsites.')).toBeInTheDocument();
  });

  it('shows an empty state when no card matches and reset restores the grid', async () => {
    renderMicrosites();
    await userEvent.selectOptions(screen.getByLabelText('Data source'), 'GeoNet');
    await userEvent.selectOptions(screen.getByLabelText('Chart type'), 'Streamgraph');
    expect(screen.getByText(/No microsites match those filters/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('Showing 3 of 3 microsites.')).toBeInTheDocument();
  });

  it('preselects the category filter on a category page', () => {
    render(<MicrositeGallery cards={cards} title={null} initialCategory="Census & population" />);
    const category = screen.getByLabelText<HTMLSelectElement>('Category');
    expect(category.value).toBe('Census & population');
    expect(screen.getByRole('option', { name: 'Census & population' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /All categories/ })).not.toBeInTheDocument();
  });

  it('reset on a category page navigates back to the hub with every filter cleared', async () => {
    render(<MicrositeGallery cards={cards} title={null} initialCategory="Census & population" />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(pushMock).toHaveBeenCalledWith('/');
    expect(screen.getByLabelText('Data source')).toHaveValue('all');
    expect(screen.getByLabelText('Chart type')).toHaveValue('all');
  });
});

describe('MicrositeGallery cards without headline stats', () => {
  it('still renders a card and links to the story', () => {
    const statless: MicrositeGalleryCard = {
      slug: 'retail-sales-by-month',
      categorySlug: 'economy',
      eyebrow: '🛍️ retail sales',
      title: 'Retail Sales by Month',
      description: 'A streamgraph of card transactions.',
      accent: 'purple',
      dataSource: 'Stats NZ',
      chartType: 'Streamgraph',
      category: 'Economy & business',
    };
    render(<MicrositeGallery cards={[statless]} />);
    expect(screen.getByRole('link', { name: /Retail Sales by Month/ })).toBeInTheDocument();
    expect(screen.queryByText('Showing 1 of 1 microsites.')).toBeInTheDocument();
  });
});
