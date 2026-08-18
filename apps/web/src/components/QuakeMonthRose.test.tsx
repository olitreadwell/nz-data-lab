import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { QuakeCatalogEvent } from '@/lib/quake-catalog';

import { QuakeMonthRose } from './QuakeMonthRose';

expect.extend(toHaveNoViolations);

function epochUtc(year: number, month: number, day = 15): number {
  return Date.UTC(year, month - 1, day) / 1000;
}

const EVENTS: QuakeCatalogEvent[] = [
  { timeEpochSec: epochUtc(2025, 1), magnitude: 3.2, depthKm: 12 },
  { timeEpochSec: epochUtc(2025, 1), magnitude: 3.4, depthKm: 24 },
  { timeEpochSec: epochUtc(2025, 4), magnitude: 3.1, depthKm: 8 },
  { timeEpochSec: epochUtc(2025, 4), magnitude: 4.2, depthKm: 41 },
  { timeEpochSec: epochUtc(2025, 4), magnitude: 3.6, depthKm: 15 },
  { timeEpochSec: epochUtc(2025, 11), magnitude: 3.3, depthKm: 30 },
  { timeEpochSec: epochUtc(2026, 4), magnitude: 3.5, depthKm: 18 },
  { timeEpochSec: epochUtc(2026, 4), magnitude: 3.0, depthKm: 6 },
];

describe('QuakeMonthRose', () => {
  it('renders the rose and counts quakes in the default view', () => {
    render(<QuakeMonthRose events={EVENTS} />);
    expect(screen.getByText(/8 quakes of magnitude 3 or stronger/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Earthquakes of magnitude 3 or stronger by month/ }),
    ).toBeInTheDocument();
  });

  it('filters to a single year', () => {
    render(<QuakeMonthRose events={EVENTS} />);
    fireEvent.click(screen.getByRole('button', { name: '2025' }));
    expect(screen.getByText(/6 quakes of magnitude 3 or stronger in 2025/)).toBeInTheDocument();
  });

  it('raises the magnitude floor', () => {
    render(<QuakeMonthRose events={EVENTS} />);
    fireEvent.click(screen.getByRole('button', { name: 'M4+' }));
    expect(screen.getByText(/1 quakes of magnitude 4 or stronger/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeMonthRose events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
