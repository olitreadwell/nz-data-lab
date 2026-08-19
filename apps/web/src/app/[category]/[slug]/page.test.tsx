import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { HIDDEN_MICROSITES } from '@/lib/hidden-microsites';
import { CATEGORY_SLUGS, MICROSITES } from '@/lib/microsites';

import MicrositePage, { generateMetadata } from './page';

/** Builds the category/slug params for a microsite, or a miss for unknown slugs. */
function paramsFor(slug: string): { category: string; slug: string } {
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  return {
    category: microsite === undefined ? 'nope' : CATEGORY_SLUGS[microsite.category],
    slug,
  };
}

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
    { timeEpochSec: 1780000000, magnitude: 1.4, depthKm: 12 },
    { timeEpochSec: 1780000001, magnitude: 2.2, depthKm: 30 },
    { timeEpochSec: 1780000002, magnitude: 6.3, depthKm: 45 },
  ]),
}));

vi.mock('@/lib/quake-month-data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/quake-month-data')>();
  return {
    ...actual,
    fetchQuakeMonthCatalog: vi.fn().mockResolvedValue([
      { timeEpochSec: 1780000000, magnitude: 3.2 },
      { timeEpochSec: 1780000001, magnitude: 4.1 },
    ]),
  };
});

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
      <MicrositePage params={Promise.resolve(paramsFor('sheep-index'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('national animal is in freefall');
    expect(html).toContain('70 million sheep');
    expect(html).toContain('Sources and further reading');
    expect(html).toContain('Sheep number falls to six for each person');
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('href="/agriculture"');
    expect(html).toContain('Sheep index');
    expect(html.match(/<h1[^>]*>/g) ?? []).toHaveLength(1);
  });

  it('renders exactly one h1 with the microsite title before any h2', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('sheep-index'))} />,
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
      generateMetadata({ params: Promise.resolve(paramsFor('sheep-index')) }),
    ).resolves.toEqual({ title: 'Sheep index - nz-data-lab' });
  });

  it('returns a generic title for an unknown microsite', async () => {
    await expect(generateMetadata({ params: Promise.resolve(paramsFor('nope')) })).resolves.toEqual(
      {
        title: 'nz-data-lab',
      },
    );
  });

  it('renders the census rank shift story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('census-rank-shift'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Selwyn and Queenstown raced up the census ranks');
    expect(html).toContain('23rd to 13th');
    expect(html).toContain('Sources and further reading');
  });

  it('renders the age pyramid story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('age-pyramid'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Women outnumber men from age 30 up');
    expect(html).toContain('5,122,600');
  });

  it('renders the regional population ranks story with the growth dumbbell', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('regional-population-ranks'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('The regional pecking order is frozen.');
    expect(html).toContain('240,936');
    expect(html).toContain('Sources and further reading');
  });

  it('renders the industry employment story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('industry-employment'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('biggest employer');
    expect(html).toContain('2,450,600');
    expect(html).toContain('Health care (Feb 2025)');
  });

  it('renders the region density story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('region-density'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Auckland holds a third of the people');
    expect(html).toContain('People per km², NZ (2023)');
    expect(html).toContain('West Coast (2023)');
  });

  it('renders the quake years story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('quake-years'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('busiest quake year since 2001');
    expect(html).toContain('7,265');
    expect(html).toContain('Quakes at M4+, 2001-2024');
  });

  it('renders the quake magnitudes story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('quake-magnitudes'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Small quakes drown out the big ones');
    expect(html).toContain('Quakes located, 3 months');
  });

  it('renders the quake months story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('quake-months'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Quakes of magnitude 3+ cluster in autumn');
    expect(html).toContain('Quakes M3+, 2 years');
  });

  it('renders the ethnic mix story', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('ethnic-mix'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('European is still the biggest group, but the mix is changing fast.');
    expect(html).toContain('67.8%');
    expect(html).toContain('Sources and further reading');
  });

  it('renders the rabbit boom story with the spotlight chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('rabbit-boom'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('bunnies are winning');
    expect(html).toContain('13.3 per km');
    expect(html).toContain('HawkesBayRabbits spotlight counts (data.govt.nz)');
  });
  it('renders the quake depth scatter story with the depth distribution chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('quake-depth-scatter'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Shallow quakes are the ones people feel');
    expect(html).toContain('Share shallower than 40 km');
    expect(html).toContain('Depth distribution');
  });

  it('renders the quake magnitudes story with the frequency chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('quake-magnitudes'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('Small quakes drown out the big ones');
    expect(html).toContain('Magnitude 4 or stronger');
    expect(html).toContain('Frequency by magnitude');
  });

  it('renders the dairy story with the livestock chart', async () => {
    const stream = await renderToReadableStream(
      <MicrositePage params={Promise.resolve(paramsFor('dairy-takeover'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('paddocks flipped from wool to milk');
    expect(html).toContain('Canterbury lamb gives way to dairy');
  });
});

it('renders the online garage sale story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('online-garage-sale'))} />,
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
      <MicrositePage params={Promise.resolve(paramsFor('species-register'))} />,
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
      <MicrositePage params={Promise.resolve(paramsFor('open-data-catalogue'))} />,
    );
    const html = await new Response(stream).text();
    expect(html).toContain('31,915');
    expect(html).toContain('Datasets in the catalogue');
  },
);

it('renders the company size distribution story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('company-size-distribution'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Most businesses have no staff at all.');
  expect(html).toContain('455,730');
  expect(html).toContain('Sources and further reading');
});

it('renders the tourism arrivals by month story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('tourism-arrivals-by-month'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Visitors flood in every summer.');
  expect(html).toContain('528,219');
  expect(html).toContain('Sources and further reading');
});

it('renders the retail sales by month story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('retail-sales-by-month'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Card spending peaks every December.');
  expect(html).toContain('$11,392m');
  expect(html).toContain('Sources and further reading');
});

it('renders the EV charging story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('ev-charging'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('639 public EV charging stations');
  expect(html).toContain('ChargeNet runs 307');
  expect(html).toContain('EV Roam charging stations (NZTA)');
});

it('renders the road crash trend story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('road-crash-trend'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Road crashes fell 27%');
  expect(html).toContain('39,778 in 2006');
  expect(html).toContain('Crash Analysis System data (NZTA)');
});

it('renders the vehicle fleet story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('vehicle-fleet'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('107,525 electric vehicles');
  expect(html).toContain('3.18 million');
  expect(html).toContain('Motor Vehicle Register (NZTA)');
});

it('renders the age distribution story with the ridgeline', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('age-distribution'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('The baby boom bulge moved up the age ladder.');
  expect(html).toContain('4,993,923');
  expect(html).toContain('data-value="4993923"');
  expect(html).toContain('Aged 65 and over, 2023');
  expect(html).toContain('Sources and further reading');
});

it('renders the median age ranks story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('median-age-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('The upper South Island is where New Zealand ages fastest.');
  expect(html).toContain('West Coast, 48.1 years');
  expect(html).toContain('data-value="48.1"');
  expect(html).toContain('Sources and further reading');
});

it('renders the visitor arrival ranks story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('visitor-arrival-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Indonesia and the Philippines climbed the visitor ranks.');
  expect(html).toContain('3,888,473');
  expect(html).toContain('data-value="3888473"');
  expect(html).toContain('Sources and further reading');
});

it('renders the region density story with the population waffle', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('region-density'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Auckland holds a third of the people on 2% of the land.');
  expect(html).toContain('4,993,290');
  expect(html).toContain('2023 Census population counts');
});

it('renders the export destination ranks story with the market bump', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('export-destination-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('China overtook Australia as the top export market');
  expect(html).toContain('$19.9b');
  expect(html).toContain('Goods and services trade by country: Year ended March 2020');
});

it('renders the business register story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('enterprise-bar-in-bar'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Rental and real estate is the biggest block of the business register');
  expect(html).toContain('617,334');
  expect(html).toContain('Business demography: At February 2025 (Stats NZ)');
});

it('renders the unemployment ranks story', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('unemployment-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('The unemployment pecking order reshuffles every year');
  expect(html).toContain('National unemployment rate (Dec 2025)');
  expect(html).toContain('Labour market statistics: December 2025 quarter (Stats NZ)');
});

it('renders the median age ranks story with the tile grid', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('median-age-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('The upper South Island is where New Zealand ages fastest.');
  expect(html).toContain('National median age (2023)');
  expect(html).toContain('2023 Census population counts');
});

it('renders the visitor arrival ranks story with the dot plot', async () => {
  const stream = await renderToReadableStream(
    <MicrositePage params={Promise.resolve(paramsFor('visitor-arrival-ranks'))} />,
  );
  const html = await new Response(stream).text();
  expect(html).toContain('Indonesia and the Philippines climbed the visitor ranks.');
  expect(html).toContain('Visitors from Australia (2019)');
  expect(html).toContain('International travel: December 2019 (Stats NZ)');
});
