import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { QuakeMagnitudeHistogram } from './QuakeMagnitudeHistogram';

expect.extend(toHaveNoViolations);

const DAY = 24 * 60 * 60;
const NOW = Date.now() / 1000;

const EVENTS: QuakeCatalogEvent[] = [
  { timeEpochSec: NOW - 5 * DAY, magnitude: 1.2 },
  { timeEpochSec: NOW - 10 * DAY, magnitude: 1.8 },
  { timeEpochSec: NOW - 20 * DAY, magnitude: 2.3 },
  { timeEpochSec: NOW - 40 * DAY, magnitude: 3.1 },
  { timeEpochSec: NOW - 70 * DAY, magnitude: 4.6 },
];

describe('QuakeMagnitudeHistogram', () => {
  it('renders the histogram and counts the quakes in the default window', () => {
    render(<QuakeMagnitudeHistogram events={EVENTS} />);
    expect(screen.getByText(/5 quakes in the last 90 days/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Earthquakes of magnitude 1 or stronger/ }),
    ).toBeInTheDocument();
  });

  it('narrows the window to 30 days', () => {
    render(<QuakeMagnitudeHistogram events={EVENTS} />);
    fireEvent.click(screen.getByRole('radio', { name: '30 days' }));
    expect(screen.getByText(/3 quakes in the last 30 days/)).toBeInTheDocument();
  });

  it('exposes the time window selector as a radio group with one checked option', () => {
    render(<QuakeMagnitudeHistogram events={EVENTS} />);
    const group = screen.getByRole('radiogroup', { name: 'Time window' });
    expect(group).toBeInTheDocument();
    const checked = screen
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('aria-checked') === 'true');
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent('90 days');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeMagnitudeHistogram events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
