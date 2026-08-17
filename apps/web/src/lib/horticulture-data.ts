import { createStatsNzClient, parseStatsNzCsv } from '@nzlab/stats-nz';
import type { StatsNzObservation } from '@nzlab/stats-nz';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { buildWideSeries, summarizeWideSeries } from './stats-series';
import type { SeriesStat, WideSeries, WideSeriesPoint } from './stats-series';

// Table AGR_AGR_002 (Horticulture by Regional Council). Codes verified
// against the Aotearoa Data Explorer search index: LC8500 total apples,
// LC8555 total kiwifruit, LC8570 total avocados, LC8600 total wine grapes.
export const HORTICULTURE_DATAFLOW_ID = 'AGR_AGR_002';
export const HORTICULTURE_CODES = {
  '8600': 'wineGrapes',
  '8555': 'kiwifruit',
  '8500': 'apples',
  '8570': 'avocados',
} as const;
export const NATIONAL_AREA_CODE = '20';

const HORTICULTURE_FIXTURE_PATH = path.join(
  process.cwd(),
  '../../packages/stats-nz/src/fixtures/horticulture-regional-council-2025-08-17.csv',
);

export type HorticultureSeriesKey = 'wineGrapes' | 'kiwifruit' | 'apples' | 'avocados';
export type HorticultureSeriesPoint = WideSeriesPoint<HorticultureSeriesKey>;
export type HorticultureSeries = WideSeries<HorticultureSeriesKey>;

export type HorticultureStat = SeriesStat<HorticultureSeriesKey>;

export function buildHorticultureSeries(rows: StatsNzObservation[]): HorticultureSeries {
  return buildWideSeries(rows, {
    dimension: 'HORTICULTURE',
    areaCode: NATIONAL_AREA_CODE,
    codeToKey: HORTICULTURE_CODES,
  });
}

export function summarizeHorticulture(series: HorticultureSeries): HorticultureStat[] {
  return summarizeWideSeries(series, [
    { key: 'wineGrapes', label: 'Wine grapes', emoji: '🍇' },
    { key: 'kiwifruit', label: 'Kiwifruit', emoji: '🥝' },
    { key: 'apples', label: 'Apples', emoji: '🍎' },
    { key: 'avocados', label: 'Avocados', emoji: '🥑' },
  ]);
}

export async function fetchHorticultureSeries(
  subscriptionKey?: string,
): Promise<HorticultureSeries> {
  const client = createStatsNzClient({
    ...(subscriptionKey === undefined ? {} : { subscriptionKey }),
    fetchImpl: (input, init) => globalThis.fetch(input, { ...init, cache: 'force-cache' }),
  });
  try {
    const rows = await client.getData({ dataflowId: HORTICULTURE_DATAFLOW_ID, format: 'csv' });
    return buildHorticultureSeries(rows);
  } catch {
    const rows = parseStatsNzCsv(readFileSync(HORTICULTURE_FIXTURE_PATH, 'utf8'), {
      dataflowId: HORTICULTURE_DATAFLOW_ID,
    });
    return buildHorticultureSeries(rows);
  }
}
