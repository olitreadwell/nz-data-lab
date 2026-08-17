import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import ExperimentsPage from './page';

expect.extend(toHaveNoViolations);

describe('ExperimentsPage', () => {
  it('renders the heading', () => {
    render(<ExperimentsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('lists shipped experiments as cards', () => {
    render(<ExperimentsPage />);
    expect(screen.getByRole('link', { name: /the sheep index/i })).toHaveAttribute(
      'href',
      '/experiments/sheep-index',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ExperimentsPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
