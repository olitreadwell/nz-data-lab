import { parseStatsNzCsv } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildLivestockSeries, summarizeLivestock } from './livestock-data';

const FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/agricultural-livestock-regional-council-2025-08-17.csv',
);

function loadFixture(): ReturnType<typeof buildLivestockSeries> {
  const rows = parseStatsNzCsv(readFileSync(FIXTURE_PATH, 'utf8'), {
    dataflowId: 'AGR_AGR_003',
  });
  return buildLivestockSeries(rows);
}

describe('buildLivestockSeries', () => {
  it('builds the national sheep, dairy, beef, and deer series from the fixture', () => {
    const series = loadFixture();
    expect(series.points).toHaveLength(25);
    expect(series.first.year).toBe(1994);
    expect(series.latest.year).toBe(2025);
    expect(series.first.sheep).toBeCloseTo(49466054, -3);
    expect(series.latest.sheep).toBeCloseTo(23252463, -3);
    expect(series.latest.dairyCattle).toBeCloseTo(5750000, -4);
    expect(series.latest.beefCattle).toBeCloseTo(3830000, -4);
    expect(series.latest.deer).toBeCloseTo(710000, -4);
  });

  it('summarizes per-species peaks and changes', () => {
    const stats = summarizeLivestock(loadFixture());
    const dairy = stats.find((stat) => stat.key === 'dairyCattle');
    expect(dairy?.peakYear).toBe(2014);
    expect(dairy?.changeFromFirstPercent).toBeGreaterThan(40);
    const sheep = stats.find((stat) => stat.key === 'sheep');
    expect(sheep?.peakYear).toBe(1994);
    expect(sheep?.changeFromPeakPercent).toBeLessThan(-50);
  });
});
