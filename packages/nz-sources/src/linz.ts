import { z } from 'zod';

import { NzSourceApiError, NzSourceParseError } from './errors';
import { readFixtureJson } from './fixtures';
import type { NzDataAdapter } from './types';

/** One feature from a LINZ Data Service layer. */
export interface LinzFeature {
  id: string;
  properties: Record<string, string | number | boolean | null>;
}

const LINZ_FEATURE_SCHEMA = z.object({
  type: z.literal('Feature'),
  id: z.union([z.string(), z.number()]),
  properties: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

const LINZ_RESPONSE_SCHEMA = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(LINZ_FEATURE_SCHEMA),
});

/** Parses a LINZ Data Service GeoJSON payload into features. */
export function parseLinzFeatures(payload: unknown): LinzFeature[] {
  const parsed = LINZ_RESPONSE_SCHEMA.safeParse(payload);
  if (!parsed.success) {
    throw new NzSourceParseError('LINZ', parsed.error.message);
  }
  return parsed.data.features.map((feature) => ({
    id: String(feature.id),
    properties: feature.properties,
  }));
}

/**
 * Fetches features for a LINZ Data Service layer (e.g. 50772 NZ Property
 * Titles List). Requires an API key from data.linz.govt.nz; callers fall
 * back to a committed fixture when the key is missing or the API fails.
 */
export async function fetchLinzLayerFeatures(
  layerId: number,
  apiKey: string,
  fetchImpl: typeof globalThis.fetch = globalThis.fetch,
): Promise<LinzFeature[]> {
  const response = await fetchImpl(
    `https://data.linz.govt.nz/services/api/v1/layers/${layerId}/features/`,
    { headers: { 'x-api-key': apiKey } },
  );
  if (!response.ok) {
    throw new NzSourceApiError('LINZ', `HTTP ${response.status}`);
  }
  return parseLinzFeatures(await response.json());
}

/** LINZ adapter: property titles layer, requires an API key. */
export const linzAdapter: NzDataAdapter<LinzFeature[]> = {
  id: 'linz',
  name: 'LINZ Data Service',
  auth: 'key',
  description: 'NZ Property Titles List (layer 50772) features.',
  fetchLive: (options) => {
    if (options?.apiKey === undefined) {
      throw new NzSourceApiError('LINZ', 'missing API key');
    }
    return fetchLinzLayerFeatures(50772, options.apiKey, options?.fetchImpl);
  },
  parse: parseLinzFeatures,
  loadFixture: () => parseLinzFeatures(readFixtureJson('linz-property-titles.json')),
};
