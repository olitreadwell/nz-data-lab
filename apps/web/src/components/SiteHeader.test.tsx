import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from './SiteHeader';

expect.extend(toHaveNoViolations);

describe('SiteHeader', () => {
  it('links home and to experiments', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'nz-data-lab' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'experiments' })).toHaveAttribute(
      'href',
      '/experiments',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SiteHeader />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
