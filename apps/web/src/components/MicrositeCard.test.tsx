import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MicrositeCard } from './MicrositeCard';

const baseProps = {
  slug: 'sheep-index',
  categorySlug: 'agriculture',
  eyebrow: '🐑 the sheep index',
  title: 'The Sheep Index',
  description: 'How New Zealand\u2019s national animal is in freefall.',
  statLabel: 'Sheep',
  statValue: '23.2m',
  accent: 'emerald' as const,
};

describe('MicrositeCard', () => {
  it('lets the visible text be the link\u2019s accessible name', () => {
    render(<MicrositeCard {...baseProps} />);
    const link = screen.getByRole('link', { name: /How New Zealand/ });
    expect(link).not.toHaveAttribute('aria-label');
  });

  it('no longer renders a redundant "Read the story" span', () => {
    render(<MicrositeCard {...baseProps} />);
    expect(screen.queryByText('Read the story')).not.toBeInTheDocument();
  });
});
