import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { QuakeFrequencyMagnitude } from './QuakeFrequencyMagnitude';

expect.extend(toHaveNoViolations);

const EVENTS: QuakeCatalogEvent[] = [
  { timeEpochSec: 1, magnitude: 1.2, depthKm: 10 },
  { timeEpochSec: 2, magnitude: 1.8, depthKm: 25 },
  { timeEpochSec: 3, magnitude: 2.3, depthKm: 40 },
  { timeEpochSec: 4, magnitude: 3.1, depthKm: 100 },
  { timeEpochSec: 5, magnitude: 4.6, depthKm: 200 },
];

describe('QuakeFrequencyMagnitude', () => {
  it('counts quakes at or above each magnitude step', () => {
    render(<QuakeFrequencyMagnitude events={EVENTS} />);
    expect(screen.getByText(/5 quakes of magnitude 1 or stronger/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /Earthquakes of magnitude 1 or stronger by magnitude threshold/,
      }),
    ).toBeInTheDocument();
  });

  it('toggles between log and linear scale', () => {
    render(<QuakeFrequencyMagnitude events={EVENTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'Linear scale' }));
    expect(screen.getByRole('button', { name: 'Linear scale' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Log scale' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeFrequencyMagnitude events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
