import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { QuakeDepthDistribution } from './QuakeDepthDistribution';

expect.extend(toHaveNoViolations);

const EVENTS: QuakeCatalogEvent[] = [
  { timeEpochSec: 1, magnitude: 1.2, depthKm: 10 },
  { timeEpochSec: 2, magnitude: 1.8, depthKm: 25 },
  { timeEpochSec: 3, magnitude: 2.3, depthKm: 40 },
  { timeEpochSec: 4, magnitude: 3.1, depthKm: 100 },
  { timeEpochSec: 5, magnitude: 4.6, depthKm: 200 },
];

describe('QuakeDepthDistribution', () => {
  it('renders the radial chart and counts the quakes in the default filter', () => {
    render(<QuakeDepthDistribution events={EVENTS} />);
    expect(screen.getByText(/5 quakes of magnitude 1 or stronger/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /Earthquakes of magnitude 1 or stronger by depth band/,
      }),
    ).toBeInTheDocument();
  });

  it('filters to magnitude 4 or stronger', () => {
    render(<QuakeDepthDistribution events={EVENTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'M4+' }));
    expect(screen.getByText(/1 quake of magnitude 4 or stronger/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeDepthDistribution events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
