import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveCanterburyRainGauge } from '@/lib/live-sources';

import { buildRainBoxStats, buildRainTicks, CanterburyRain } from './CanterburyRain';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const GAUGES: LiveCanterburyRainGauge[] = [
  { siteName: 'Mount Byrne', rainByDayAgoMm: [40.5, 0, 1.6, 2.5, 0, 0.5, 1, 0.4], totalRainfallMm: 86 },
  { siteName: 'Carrington', rainByDayAgoMm: [21, 0, 2, 3, 0, 1, 2, 0.5], totalRainfallMm: 59 },
  { siteName: 'Dry Gully', rainByDayAgoMm: [0, 0, 0.5, 1, 0, 0, 0, 0], totalRainfallMm: 5 },
  { siteName: 'Wet Peak', rainByDayAgoMm: [5, 1, 4, 6, 0, 2, 3, 1], totalRainfallMm: 30 },
];

FETCH_MOCK.mockResolvedValue(GAUGES);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveCanterburyRainGauges: FETCH_MOCK,
}));

describe('buildRainBoxStats', () => {
  it('computes min, quartiles, median, and max per day', () => {
    const stats = buildRainBoxStats(GAUGES);
    const today = stats[0];
    expect(today).toEqual({
      day: 0,
      min: 0,
      q1: 3.75,
      median: 13,
      q3: 25.875,
      max: 40.5,
      count: 4,
    });
  });

  it('returns zero boxes when no gauge has readings', () => {
    const stats = buildRainBoxStats([{ siteName: 'Empty', rainByDayAgoMm: [null, null, null, null, null, null, null, null], totalRainfallMm: null }]);
    expect(stats[0]).toEqual({ day: 0, min: 0, q1: 0, median: 0, q3: 0, max: 0, count: 0 });
  });
});

describe('buildRainTicks', () => {
  it('builds round gridline values covering the max', () => {
    expect(buildRainTicks(40.5)).toEqual([0, 10, 20, 30, 40]);
  });

  it('returns a single zero tick for an empty chart', () => {
    expect(buildRainTicks(0)).toEqual([0]);
  });
});

describe('CanterburyRain', () => {
  it('shows the rain box plot', async () => {
    render(<CanterburyRain />);
    expect(await screen.findByText(/4 gauges, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Canterbury rainfall across 4 gauges/ }),
    ).toBeInTheDocument();
  });

  it('filters gauges by name', async () => {
    render(<CanterburyRain />);
    await screen.findByText(/4 gauges, fetched live/);
    const search = screen.getByLabelText('Filter by gauge');
    fireEvent.change(search, { target: { value: 'mount byrne' } });
    expect(
      screen.getByRole('img', { name: /Canterbury rainfall across 1 gauge/ }),
    ).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CanterburyRain />);
    await screen.findByText(/4 gauges, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
