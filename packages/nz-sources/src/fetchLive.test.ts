import { afterEach, describe, expect, it, vi } from 'vitest';

import { dataGovtNzAdapter } from './dataGovtNz';
import { digitalNzAdapter } from './digitalNz';
import { readFixtureJson, readFixtureText } from './fixtures';
import { geonetAdapter } from './geonet';
import { linzAdapter } from './linz';
import { nzorAdapter } from './nzor';
import { tradeMeAdapter } from './tradeMe';

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200 });
}

function textResponse(payload: string): Response {
  return new Response(payload, { status: 200 });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('adapter fetchLive paths', () => {
  it('fetches and parses GeoNet quakes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(readFixtureJson('geonet-quakes-mmi3.json'))),
    );
    const quakes = await geonetAdapter.fetchLive();
    expect(quakes.length).toBeGreaterThan(0);
    expect(quakes[0]?.locality.length).toBeGreaterThan(0);
  });

  it('fetches and parses data.govt.nz datasets', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(readFixtureJson('data-govt-nz-search-sheep.json'))),
    );
    const result = await dataGovtNzAdapter.fetchLive();
    expect(result.count).toBeGreaterThan(0);
    expect(result.datasets.length).toBeGreaterThan(0);
    expect(result.datasets[0]?.title.length).toBeGreaterThan(0);
  });

  it('fetches and parses DigitalNZ records', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(readFixtureJson('digitalnz-search-sheep.json'))),
    );
    const records = await digitalNzAdapter.fetchLive();
    expect(records.length).toBeGreaterThan(0);
    expect(records[0]?.title.length).toBeGreaterThan(0);
  });

  it('fetches and parses Trade Me categories', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(readFixtureJson('trademe-categories.json'))),
    );
    const categories = await tradeMeAdapter.fetchLive();
    expect(categories.name.length).toBeGreaterThan(0);
  });

  it('fetches and parses NZOR names', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => textResponse(readFixtureText('nzor-names-kiwi.xml'))),
    );
    const result = await nzorAdapter.fetchLive();
    expect(result.total).toBeGreaterThan(0);
    expect(result.names.length).toBeGreaterThan(0);
  });

  it('requires an API key for LINZ', async () => {
    expect(() => linzAdapter.fetchLive()).toThrow(/API key/);
  });

  it('fetches LINZ features when an API key is provided', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(readFixtureJson('linz-property-titles.json'))),
    );
    const features = await linzAdapter.fetchLive({ apiKey: 'test-key' });
    expect(features.length).toBeGreaterThan(0);
  });
});
