import { describe, expect, it } from 'vitest';

import {
  filterQuakeYearsByMinMagnitude,
  QUAKE_YEAR_COUNTS,
  QUAKE_YEAR_EVENTS,
  QUAKE_YEAR_PEAK,
  QUAKE_YEAR_QUIET,
  QUAKE_YEAR_TOTAL,
} from './quake-year-data';

describe('quake-year-data', () => {
  it('matches the committed GeoNet snapshot totals', () => {
    expect(QUAKE_YEAR_TOTAL).toBe(7265);
    expect(QUAKE_YEAR_COUNTS[2016]).toBe(772);
    expect(QUAKE_YEAR_COUNTS[2011]).toBe(447);
    expect(QUAKE_YEAR_COUNTS[2018]).toBe(118);
  });

  it('names the busiest and quietest years', () => {
    expect(QUAKE_YEAR_PEAK).toEqual({ year: 2016, count: 772 });
    expect(QUAKE_YEAR_QUIET).toEqual({ year: 2018, count: 118 });
  });

  it('filters the snapshot by magnitude floor', () => {
    const atSix = filterQuakeYearsByMinMagnitude(6);
    expect(atSix.length).toBeGreaterThan(0);
    expect(atSix.every((event) => event.m >= 6)).toBe(true);
    const atSeven = filterQuakeYearsByMinMagnitude(7);
    expect(atSeven.length).toBeGreaterThan(0);
  });

  it('every event falls inside the 2001 to 2024 window', () => {
    expect(QUAKE_YEAR_EVENTS.every((event) => event.y >= 2001 && event.y <= 2024)).toBe(true);
  });
});
