import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { QuakeDepthScatter } from './QuakeDepthScatter';

expect.extend(toHaveNoViolations);

const DAY = 24 * 60 * 60;
const NOW = Date.now() / 1000;

const EVENTS: QuakeCatalogEvent[] = [
  { timeEpochSec: NOW - 5 * DAY, magnitude: 1.2, depthKm: 10 },
  { timeEpochSec: NOW - 10 * DAY, magnitude: 1.8, depthKm: 25 },
  { timeEpochSec: NOW - 20 * DAY, magnitude: 2.3, depthKm: 40 },
  { timeEpochSec: NOW - 40 * DAY, magnitude: 3.1, depthKm: 100 },
  { timeEpochSec: NOW - 70 * DAY, magnitude: 4.6, depthKm: 200 },
];

describe('QuakeDepthScatter', () => {
  it('renders the scatter and counts the quakes in the default window', () => {
    render(<QuakeDepthScatter events={EVENTS} />);
    expect(screen.getByText(/5 quakes in the last 90 days/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /Earthquakes of magnitude 1 or stronger by magnitude and depth/,
      }),
    ).toBeInTheDocument();
  });

  it('narrows the window to 30 days', () => {
    render(<QuakeDepthScatter events={EVENTS} />);
    fireEvent.click(screen.getByRole('button', { name: '30 days' }));
    expect(screen.getByText(/3 quakes in the last 30 days/)).toBeInTheDocument();
  });

  it('summarizes the depth bands for the window', () => {
    render(<QuakeDepthScatter events={EVENTS} />);
    expect(screen.getByText('0-40 km')).toBeInTheDocument();
    expect(screen.getByText('300-700 km')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeDepthScatter events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
