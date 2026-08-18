import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { AgeDistributionHistogram } from './AgeDistributionHistogram';

expect.extend(toHaveNoViolations);

describe('AgeDistributionHistogram', () => {
  it('renders the 2023 histogram by default', () => {
    render(<AgeDistributionHistogram />);
    expect(
      screen.getByRole('img', { name: /Age distribution in the 2023 census/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4,993,923 people counted in the 2023 census/)).toBeInTheDocument();
  });

  it('moves the slider to an earlier census year', () => {
    render(<AgeDistributionHistogram />);
    const slider = screen.getByRole('slider', { name: 'Census year' });
    fireEvent.change(slider, { target: { value: '0' } });
    expect(
      screen.getByRole('img', { name: /Age distribution in the 2013 census/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4,242,048 people counted in the 2013 census/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AgeDistributionHistogram />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
