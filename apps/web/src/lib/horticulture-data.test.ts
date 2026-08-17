import { parseStatsNzCsv } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildHorticultureSeries, summarizeHorticulture } from './horticulture-data';

const FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/horticulture-regional-council-2025-08-17.csv',
);

function loadFixture(): ReturnType<typeof buildHorticultureSeries> {
  const rows = parseStatsNzCsv(readFileSync(FIXTURE_PATH, 'utf8'), {
    dataflowId: 'AGR_AGR_002',
  });
  return buildHorticultureSeries(rows);
}

describe('buildHorticultureSeries', () => {
  it('builds the national wine grape, kiwifruit, apple, and avocado series', () => {
    const series = loadFixture();
    expect(series.first.year).toBe(1994);
    expect(series.latest.year).toBe(2024);
    expect(series.first.wineGrapes).toBeCloseTo(7160, -1);
    expect(series.latest.wineGrapes).toBeCloseTo(37627, -1);
    expect(series.latest.kiwifruit).toBeCloseTo(14514, -1);
    expect(series.latest.apples).toBeCloseTo(9522, -1);
    expect(series.latest.avocados).toBeCloseTo(4337, -1);
  });

  it('summarizes the wine grape boom', () => {
    const stats = summarizeHorticulture(loadFixture());
    const wine = stats.find((stat) => stat.key === 'wineGrapes');
    expect(wine?.changeFromFirstPercent).toBeGreaterThan(400);
    const apples = stats.find((stat) => stat.key === 'apples');
    expect(apples?.changeFromFirstPercent).toBeLessThan(0);
  });
});
