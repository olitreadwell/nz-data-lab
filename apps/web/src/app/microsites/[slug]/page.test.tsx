import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { HIDDEN_MICROSITES } from '@/lib/hidden-microsites';

import MicrositePage, { generateMetadata } from './page';

const notFoundMock = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: (): never => {
    notFoundMock();
    throw new Error('NEXT_NOT_FOUND');
  },
}));

const { QUAKE_MOCK_EVENTS } = vi.hoisted(() => ({
  QUAKE_MOCK_EVENTS: [
    { y: 2016, m: 7.8, d: 15.1, t: 1478988176, p: '15 km north-east of Culverden' },
    { y: 2018, m: 4.2, d: 40, t: 1515000000, p: '30 km south of Seddon' },
  ],
}));

vi.mock('@/lib/quake-year-data', () => ({
  QUAKE_YEAR_START: 2001,
  QUAKE_YEAR_END: 2024,
  QUAKE_YEAR_EVENTS: QUAKE_MOCK_EVENTS,
  QUAKE_YEAR_COUNTS: { 2016: 1, 2018: 1 },
  QUAKE_YEAR_TOTAL: 7265,
  QUAKE_YEAR_PEAK: { year: 2016, count: 772 },
  QUAKE_YEAR_QUIET: { year: 2018, count: 118 },
  filterQuakeYearsByMinMagnitude: (minMagnitude: number) =>
    QUAKE_MOCK_EVENTS.filter((event) => event.m >= minMagnitude),
}));

vi.mock('@/lib/quake-catalog', () => ({
  fetchRecentQuakeCatalog: vi.fn().mockResolvedValue([
    { timeEpochSec: 1780000000, magnitude: 1.4 },
    { timeEpochSec: 1780000001, magnitude: 2.2 },
    { timeEpochSec: 1780000002, magnitude: 6.3 },
  ]),
}));

vi.mock('@/lib/headline-stats', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/headline-stats')>();
  return {
    ...actual,
    fetchRegisterTotal: vi.fn().mockResolvedValue(170151),
    fetchCatalogueTotal: vi.fn().mockResolvedValue(31915),
  };
});

vi.mock('@/lib/rabbit-data', () => ({
  fetchRabbitSpotlightSeries: vi.fn().mockResolvedValue({
    points: [
      { year: 2012, sites: 5, rabbits: 263, km: 112, rabbitsPerKm: 2.35 },
      { year: 2021, sites: 10, rabbits: 3102, km: 234, rabbitsPerKm: 13.26 },
    ],
    first: { year: 2012, sites: 5, rabbits: 263, km: 112, rabbitsPerKm: 2.35 },
    latest: { year: 2021, sites: 10, rabbits: 3102, km: 234, rabbitsPerKm: 13.26 },
    peak: { year: 2021, sites: 10, rabbits: 3102, km: 234, rabbitsPerKm: 13.26 },
    changeFromFirstPercent: 464,
  }),
}));

vi.mock('@/lib/sheep-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/sheep-data')>();
  return {
    ...actual,
    fetchSheepSeries: vi.fn().mockResolvedValue({
      points: [
        { year: 1994, sheep: 49466054 },
        { year: 2025, sheep: 23252463 },
      ],
      first: { year: 1994, sheep: 49466054 },
      peak: { year: 1994, sheep: 49466054 },
      latest: { year: 2025, sheep: 23252463 },
      changeFromFirstPercent: -53,
      changeFromPeakPercent: -53,
    }),
  };
});

vi.mock('@/lib/livestock-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/livestock-data')>();
  return {
    ...actual,
    fetchLivestockSeries: vi.fn().mockResolvedValue({
      points: [
        { year: 1994, sheep: 49466054, dairyCattle: 3840000, beefCattle: 5050000, deer: 1230000 },
        { year: 2025, sheep: 23252463, dairyCattle: 5750000, beefCattle: 3830000, deer: 710000 },
      ],
      first: {
        year: 1994,
        sheep: 49466054,
        dairyCattle: 3840000,
        beefCattle: 5050000,
        deer: 1230000,
      },
      latest: {
        year: 2025,
        sheep: 23252463,
        dairyCattle: 5750000,
        beefCattle: 3830000,
        deer: 710000,
      },
    }),
  };
});

vi.mock('@/lib/horticulture-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/horticulture-data')>();
  return {
    ...actual,
    fetchHorticultureSeries: vi.fn().mockResolvedValue({
      points: [
        { year: 1994, wineGrapes: 7160, kiwifruit: 12174, apples: 15257, avocados: 1375 },
        { year: 2024, wineGrapes: 37627, kiwifruit: 14514, apples: 9522, avocados: 4337 },
      ],
      first: { year: 1994, wineGrapes: 7160, kiwifruit: 12174, apples: 15257, avocados: 1375 },
      latest: { year: 2024, wineGrapes: 37627, kiwifruit: 14514, apples: 9522, avocados: 4337 },
    }),
  };
});

vi.mock('@/lib/forestry-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/forestry-data')>();
  return {
    ...actual,
    fetchForestrySeries: vi.fn().mockResolvedValue({
      points: [
        { year: 2002, newPlanting: 33674, harvestedArea: 46658 },
        { year: 2018, newPlanting: 8293, harvestedArea: 62103 },
      ],
      first: { year: 2002, newPlanting: 33674, harvestedArea: 46658 },
      latest: { year: 2018, newPlanting: 8293, harvestedArea: 62103 },
    }),
  };
});

describe('MicrositePage', () => {
  it('renders the sheep story with narrative, chart, and sources', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'sheep-index' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('national animal is in freefall');
    expect(html).toContain('70 million sheep');
    expect(html).toContain('Sources and further reading');
    expect(html).toContain('Sheep number falls to six for each person');
    expect(html).toContain('All microsites');
    expect(html.match(/<h1[^>]*>/g) ?? []).toHaveLength(1);
  });

  it('renders exactly one h1 with the microsite title before any h2', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'sheep-index' })} />,
    );
    const html = await new Response(stream).text();
    const h1s = html.match(/<h1[^>]*>(.*?)<\/h1>/g) ?? [];
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toContain('national animal is in freefall');
    const headingIndexes = ['<h1', '<h2', '<h3', '<h4', '<h5', '<h6']
      .map((tag) => html.indexOf(tag))
      .filter((index) => index !== -1);
    expect(Math.min(...headingIndexes)).toBe(html.indexOf('<h1'));
  });

  it('returns a unique document title for the sheep microsite', async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ slug: 'sheep-index' }) }),
    ).resolves.toEqual({ title: 'Sheep index - nz-data-lab' });
  });

  it('returns a generic title for an unknown microsite', async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })).resolves.toEqual({
      title: 'nz-data-lab',
    });
  });

  it('renders the census rank shift story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'census-rank-shift' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Selwyn and Queenstown raced up the census ranks');
    expect(html).toContain('23rd to 13th');
    expect(html).toContain('Sources and further reading');
  });

  it('renders the age pyramid story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'age-pyramid' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Women outnumber men from age 30 up');
    expect(html).toContain('5,122,600');
  });

  it('renders the quake years story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'quake-years' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('busiest quake year since 2001');
    expect(html).toContain('7,265');
    expect(html).toContain('Quakes at M4+, 2001-2024');
  });

  it('renders the quake magnitudes story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'quake-magnitudes' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Small quakes drown out the big ones');
    expect(html).toContain('Quakes located, 3 months');
  });

  it('renders the rabbit boom story with the spotlight chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'rabbit-boom' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('bunnies are winning');
    expect(html).toContain('13.3 per km');
    expect(html).toContain('HawkesBayRabbits spotlight counts (data.govt.nz)');
  });
  it('renders the dairy story with the livestock chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'dairy-takeover' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('paddocks flipped from wool to milk');
    expect(html).toContain('Canterbury lamb gives way to dairy');
  });
});

it('renders the online garage sale story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve({ slug: 'online-garage-sale' })} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('5,589 leaf categories');
  expect(html).toContain('Trade Me');
  expect(html).toContain('Home &amp; living');
});

it.skipIf(HIDDEN_MICROSITES.includes('species-register'))(
  'renders the species register with the live register total',
  async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'species-register' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('170,151');
    expect(html).toContain('Names in the register');
  },
);

it.skipIf(HIDDEN_MICROSITES.includes('open-data-catalogue'))(
  'renders the open data catalogue with the live catalogue total',
  async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'open-data-catalogue' })} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('31,915');
    expect(html).toContain('Datasets in the catalogue');
  },
);

it('renders the EV charging story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve({ slug: 'ev-charging' })} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('639 public EV charging stations');
  expect(html).toContain('ChargeNet runs 307');
  expect(html).toContain('EV Roam charging stations (NZTA)');
});

it('renders the road crash trend story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve({ slug: 'road-crash-trend' })} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Road crashes fell 27%');
  expect(html).toContain('39,778 in 2006');
  expect(html).toContain('Crash Analysis System data (NZTA)');
});

it('renders the vehicle fleet story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve({ slug: 'vehicle-fleet' })} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('107,525 electric vehicles');
  expect(html).toContain('3.18 million');
  expect(html).toContain('Motor Vehicle Register (NZTA)');
});
