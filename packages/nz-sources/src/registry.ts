import { dataGovtNzAdapter } from './dataGovtNz';
import { digitalNzAdapter } from './digitalNz';
import { geonetAdapter } from './geonet';
import { linzAdapter } from './linz';
import { nzorAdapter } from './nzor';
import { tradeMeAdapter } from './tradeMe';
import type { NzDataAdapter, NzFetchOptions, NzSourceProbe } from './types';

/** Every NZ data source behind the uniform adapter interface. */
export const NZ_DATA_SOURCES: NzDataAdapter<unknown>[] = [
  geonetAdapter,
  dataGovtNzAdapter,
  digitalNzAdapter,
  tradeMeAdapter,
  nzorAdapter,
  linzAdapter,
];

/** Looks up a source adapter by id. */
export function getNzDataSource<T>(id: string): NzDataAdapter<T> | undefined {
  return NZ_DATA_SOURCES.find((source) => source.id === id) as NzDataAdapter<T> | undefined;
}

/** Probes one source with a live fetch and reports the outcome. */
export async function probeNzDataSource<T>(
  adapter: NzDataAdapter<T>,
  options?: { apiKey?: string },
): Promise<NzSourceProbe> {
  try {
    const fetchOptions: NzFetchOptions =
      options?.apiKey === undefined ? {} : { apiKey: options.apiKey };
    const data = await adapter.fetchLive(fetchOptions);
    return {
      id: adapter.id,
      name: adapter.name,
      auth: adapter.auth,
      ok: true,
      status: 'ok',
      sample: JSON.stringify(data).slice(0, 120),
    };
  } catch (error) {
    return {
      id: adapter.id,
      name: adapter.name,
      auth: adapter.auth,
      ok: false,
      status: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Probes every registered source in parallel. */
export async function probeAllNzDataSources(options?: {
  apiKey?: string;
}): Promise<NzSourceProbe[]> {
  return Promise.all(NZ_DATA_SOURCES.map((source) => probeNzDataSource(source, options)));
}
