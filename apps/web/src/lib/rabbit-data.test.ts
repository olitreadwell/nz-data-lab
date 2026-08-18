import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildRabbitSpotlightSeries,
  fetchRabbitSpotlightSeries,
  parseRabbitSpotlightCsv,
} from './rabbit-data';

const FIXTURE_PATH = path.join(
  process.cwd(),
  'src/lib/fixtures/hawkes-bay-rabbit-spotlight-2012-2021.csv',
);

function loadFixture(): ReturnType<typeof buildRabbitSpotlightSeries> {
  return buildRabbitSpotlightSeries(parseRabbitSpotlightCsv(readFileSync(FIXTURE_PATH, 'utf8')));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('parseRabbitSpotlightCsv', () => {
  it('parses the real HawkesBayRabbits fixture into 65 site-year rows', () => {
    const rows = parseRabbitSpotlightCsv(readFileSync(FIXTURE_PATH, 'utf8'));
    expect(rows).toHaveLength(65);
    expect(rows[0]).toEqual({ site: 'Clifton Stn', year: 2016, rabbits: 574, km: 29 });
  });

  it('drops malformed rows instead of crashing', () => {
    const csv = ['site,year,num.rabbits,km', 'Farm A,2021,10,5', 'Broken,not-a-year,1,1', ''].join(
      '\n',
    );
    const rows = parseRabbitSpotlightCsv(csv);
    expect(rows).toEqual([{ site: 'Farm A', year: 2021, rabbits: 10, km: 5 }]);
  });
});

describe('buildRabbitSpotlightSeries', () => {
  it('pools the fixture into one point per year, sorted, with pooled rates', () => {
    const series = loadFixture();
    expect(series.points).toHaveLength(10);
    expect(series.points.map((point) => point.year)).toEqual([
      2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
    ]);
    expect(series.first.year).toBe(2012);
    expect(series.first.rabbitsPerKm).toBeCloseTo(2.35, 1);
    expect(series.latest.year).toBe(2021);
    expect(series.latest.rabbitsPerKm).toBeCloseTo(13.26, 1);
    expect(series.latest.sites).toBe(10);
  });

  it('flags the latest year as the peak and measures the change', () => {
    const series = loadFixture();
    expect(series.peak.year).toBe(2021);
    expect(Math.round(series.changeFromFirstPercent)).toBe(465);
  });

  it('throws when no observations exist', () => {
    expect(() => buildRabbitSpotlightSeries([])).toThrow(
      'No rabbit spotlight observations found in the Landcare Research dataset',
    );
  });
});

describe('fetchRabbitSpotlightSeries', () => {
  it('parses the live download when the datastore answers', async () => {
    const csv = ['site,year,num.rabbits,km', 'Farm A,2020,20,10'].join('\n');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => csv }));
    const series = await fetchRabbitSpotlightSeries();
    expect(series.points).toEqual([{ year: 2020, sites: 1, rabbits: 20, km: 10, rabbitsPerKm: 2 }]);
  });

  it('falls back to the committed fixture when the download fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const series = await fetchRabbitSpotlightSeries();
    expect(series.points).toHaveLength(10);
    expect(series.latest.year).toBe(2021);
    expect(series.latest.rabbitsPerKm).toBeCloseTo(13.26, 1);
  });
});
