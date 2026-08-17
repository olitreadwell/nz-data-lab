import { createStatsNzClient, parseStatsNzCsv } from '@nzlab/stats-nz';
import type { StatsNzObservation } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildWideSeries, summarizeWideSeries, withHistoricalAnchor } from './stats-series';
import type { HistoricalAnchor, SeriesStat, WideSeries, WideSeriesPoint } from './stats-series';

// Table AGR_AGR_003 (Livestock Numbers by Regional Council). Codes verified
// against the Stats NZ "Agriculture Published Variables (v. 2023)" data
// dictionary: LC6731 total sheep, LC7193 total dairy cattle, LC7077 total
// beef cattle, LC7699 total deer.
export const LIVESTOCK_DATAFLOW_ID = 'AGR_AGR_003';
export const LIVESTOCK_CODES = {
  '6731': 'sheep',
  '7193': 'dairyCattle',
  '7077': 'beefCattle',
  '7699': 'deer',
} as const;
export const NATIONAL_AREA_CODE = '20';

const LIVESTOCK_FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/agricultural-livestock-regional-council-2025-08-17.csv',
);

export type LivestockSeriesKey = 'sheep' | 'dairyCattle' | 'beefCattle' | 'deer';
export type LivestockSeriesPoint = WideSeriesPoint<LivestockSeriesKey>;
export type LivestockSeries = WideSeries<LivestockSeriesKey>;

export type LivestockStat = SeriesStat<LivestockSeriesKey>;

// AGR_AGR_003 only goes back to 1994. This 1990 point for all four species is
// a separate citation from Stats NZ's own "Livestock numbers: Data to 2023"
// indicator release — see withHistoricalAnchor and LivestockChart's dashed
// pre-1994 segment.
export const LIVESTOCK_HISTORICAL_ANCHOR: HistoricalAnchor<LivestockSeriesKey> = {
  year: 1990,
  values: {
    sheep: 57_900_000,
    dairyCattle: 3_400_000,
    beefCattle: 4_600_000,
    deer: 976_000,
  },
  source: {
    label: 'Stats NZ, Livestock numbers: Data to 2023',
    url: 'https://www.stats.govt.nz/indicators/livestock-numbers-data-to-2023/',
  },
};

export function buildLivestockSeries(rows: StatsNzObservation[]): LivestockSeries {
  return buildWideSeries(rows, {
    dimension: 'LIVESTOCK',
    areaCode: NATIONAL_AREA_CODE,
    codeToKey: LIVESTOCK_CODES,
  });
}

export function summarizeLivestock(series: LivestockSeries): LivestockStat[] {
  return summarizeWideSeries(series, [
    { key: 'sheep', label: 'Sheep', emoji: '🐑' },
    { key: 'dairyCattle', label: 'Dairy cattle', emoji: '🐄' },
    { key: 'beefCattle', label: 'Beef cattle', emoji: '🐂' },
    { key: 'deer', label: 'Deer', emoji: '🦌' },
  ]);
}

export async function fetchLivestockSeries(subscriptionKey?: string): Promise<LivestockSeries> {
  const client = createStatsNzClient({
    ...(subscriptionKey === undefined ? {} : { subscriptionKey }),
    fetchImpl: (input, init) => globalThis.fetch(input, { ...init, cache: 'force-cache' }),
  });
  try {
    const rows = await client.getData({ dataflowId: LIVESTOCK_DATAFLOW_ID, format: 'csv' });
    return withHistoricalAnchor(buildLivestockSeries(rows), LIVESTOCK_HISTORICAL_ANCHOR);
  } catch {
    const rows = parseStatsNzCsv(readFileSync(LIVESTOCK_FIXTURE_PATH, 'utf8'), {
      dataflowId: LIVESTOCK_DATAFLOW_ID,
    });
    return withHistoricalAnchor(buildLivestockSeries(rows), LIVESTOCK_HISTORICAL_ANCHOR);
  }
}
