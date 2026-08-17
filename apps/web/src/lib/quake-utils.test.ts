import { describe, expect, it } from 'vitest';

import { formatQuakeDate } from './quake-utils';

describe('formatQuakeDate', () => {
  it('formats a valid ISO date', () => {
    expect(formatQuakeDate('2026-08-17T03:00:00.000Z')).toBe('17 Aug');
  });

  it('returns the raw string for an invalid date', () => {
    expect(formatQuakeDate('not-a-date')).toBe('not-a-date');
  });
});
