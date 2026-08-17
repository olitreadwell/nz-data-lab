import { parseStatsNzCsv } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { buildForestrySeries, summarizeForestry } from './forestry-data';

const FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/forestry-regional-council-2025-08-17.csv',
);

function loadFixture(): ReturnType<typeof buildForestrySeries> {
  const rows = parseStatsNzCsv(readFileSync(FIXTURE_PATH, 'utf8'), {
    dataflowId: 'AGR_AGR_001',
  });
  return buildForestrySeries(rows);
}

describe('buildForestrySeries', () => {
  it('builds the national new planting and harvested area series', () => {
    const series = loadFixture();
    expect(series.first.year).toBe(2002);
    expect(series.latest.year).toBe(2018);
    expect(series.first.newPlanting).toBeCloseTo(33674, -1);
    expect(series.latest.newPlanting).toBeCloseTo(8293, -1);
    expect(series.latest.harvestedArea).toBeCloseTo(62103, -1);
  });

  it('summarizes the planting bust', () => {
    const stats = summarizeForestry(loadFixture());
    const planting = stats.find((stat) => stat.key === 'newPlanting');
    expect(planting?.changeFromFirstPercent).toBeLessThan(-70);
    const harvest = stats.find((stat) => stat.key === 'harvestedArea');
    expect(harvest?.changeFromFirstPercent).toBeGreaterThan(30);
  });
});
