import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { AgePyramid } from './AgePyramid';

expect.extend(toHaveNoViolations);

describe('AgePyramid', () => {
  it('renders the pyramid with both sexes by default', () => {
    render(<AgePyramid />);
    expect(screen.getByRole('img', { name: /by sex and 5-year age group/i })).toBeInTheDocument();
    expect(screen.getAllByText('30-34').length).toBeGreaterThan(0);
    expect(screen.getAllByText('90+').length).toBeGreaterThan(0);
  });

  it('switches to a single sex view', () => {
    render(<AgePyramid />);
    fireEvent.click(screen.getByRole('button', { name: 'Male only' }));
    expect(
      screen.getByRole('img', { name: /New Zealand male population by 5-year age group/i }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AgePyramid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
