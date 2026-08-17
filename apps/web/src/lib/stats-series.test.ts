import { describe, expect, it } from 'vitest';

import { withHistoricalAnchor } from './stats-series';
import type { WideSeries } from './stats-series';

type Key = 'sheep' | 'dairyCattle';

const SERIES: WideSeries<Key> = {
  points: [
    { year: 1994, sheep: 49466054, dairyCattle: 3840000 },
    { year: 2025, sheep: 23252463, dairyCattle: 5750000 },
  ],
  first: { year: 1994, sheep: 49466054, dairyCattle: 3840000 },
  latest: { year: 2025, sheep: 23252463, dairyCattle: 5750000 },
};

const ANCHOR = {
  year: 1990,
  values: { sheep: 57_900_000, dairyCattle: 3_400_000 },
  source: { label: 'Stats NZ, Livestock numbers: Data to 2023', url: 'https://example.com' },
};

describe('withHistoricalAnchor', () => {
  it('prepends the anchor point and updates first, leaving latest untouched', () => {
    const result = withHistoricalAnchor(SERIES, ANCHOR);
    expect(result.points[0]).toEqual({ year: 1990, sheep: 57_900_000, dairyCattle: 3_400_000 });
    expect(result.points).toHaveLength(3);
    expect(result.first).toEqual({ year: 1990, sheep: 57_900_000, dairyCattle: 3_400_000 });
    expect(result.latest).toBe(SERIES.latest);
  });

  it('leaves the series untouched when it already reaches back to or past the anchor year', () => {
    const olderSeries: WideSeries<Key> = {
      ...SERIES,
      points: [{ year: 1985, sheep: 60000000, dairyCattle: 3000000 }, ...SERIES.points],
      first: { year: 1985, sheep: 60000000, dairyCattle: 3000000 },
    };
    const result = withHistoricalAnchor(olderSeries, ANCHOR);
    expect(result).toBe(olderSeries);
  });
});
