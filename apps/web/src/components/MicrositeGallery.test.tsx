import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { MicrositeGallery } from './MicrositeGallery';
import type { MicrositeGalleryCard } from './MicrositeGallery';

const cards: MicrositeGalleryCard[] = [
  {
    slug: 'sheep-index',
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
});
