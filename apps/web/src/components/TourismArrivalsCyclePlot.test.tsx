import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { TourismArrivalsCyclePlot } from './TourismArrivalsCyclePlot';

expect.extend(toHaveNoViolations);

describe('TourismArrivalsCyclePlot', () => {
  it('renders the cycle plot with the complete years visible', () => {
    render(<TourismArrivalsCyclePlot />);
    expect(
      screen.getByRole('img', {
        name: 'Monthly overseas visitor arrivals by year, one line per year',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2018' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '2017' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles a year off and on', () => {
    render(<TourismArrivalsCyclePlot />);
    const button = screen.getByRole('button', { name: '2019' });
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TourismArrivalsCyclePlot />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
