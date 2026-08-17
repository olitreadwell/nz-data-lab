import { createStatsNzClient, parseStatsNzCsv } from '@nzlab/stats-nz';
import type { StatsNzObservation } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildWideSeries, summarizeWideSeries } from './stats-series';
import type { SeriesStat, WideSeries, WideSeriesPoint } from './stats-series';

// Table AGR_AGR_001 (Forestry by Regional Council). Codes verified against
// the Aotearoa Data Explorer search index: LC6050 total new area planted,
// LC6053 total exotic timber harvested (hectares).
export const FORESTRY_DATAFLOW_ID = 'AGR_AGR_001';
export const FORESTRY_CODES = {
  '6050': 'newPlanting',
  '6053': 'harvestedArea',
} as const;
export const NATIONAL_AREA_CODE = '20';

const FORESTRY_FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/forestry-regional-council-2025-08-17.csv',
);

export type ForestrySeriesKey = 'newPlanting' | 'harvestedArea';
export type ForestrySeriesPoint = WideSeriesPoint<ForestrySeriesKey>;
export type ForestrySeries = WideSeries<ForestrySeriesKey>;

export type ForestryStat = SeriesStat<ForestrySeriesKey>;

export function buildForestrySeries(rows: StatsNzObservation[]): ForestrySeries {
  return buildWideSeries(rows, {
    dimension: 'FORESTRY',
    areaCode: NATIONAL_AREA_CODE,
    codeToKey: FORESTRY_CODES,
  });
}

export function summarizeForestry(series: ForestrySeries): ForestryStat[] {
  return summarizeWideSeries(series, [
    { key: 'newPlanting', label: 'New planting', emoji: '🌱' },
    { key: 'harvestedArea', label: 'Harvested area', emoji: '🌲' },
  ]);
}

export async function fetchForestrySeries(subscriptionKey?: string): Promise<ForestrySeries> {
  const client = createStatsNzClient({
    ...(subscriptionKey === undefined ? {} : { subscriptionKey }),
    fetchImpl: (input, init) => globalThis.fetch(input, { ...init, cache: 'force-cache' }),
  });
  try {
    const rows = await client.getData({ dataflowId: FORESTRY_DATAFLOW_ID, format: 'csv' });
    return buildForestrySeries(rows);
  } catch {
    const rows = parseStatsNzCsv(readFileSync(FORESTRY_FIXTURE_PATH, 'utf8'), {
      dataflowId: FORESTRY_DATAFLOW_ID,
    });
    return buildForestrySeries(rows);
  }
}
