import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import MicrositePage, { generateMetadata } from './page';

const notFoundMock = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: (): never => {
    notFoundMock();
    throw new Error('NEXT_NOT_FOUND');
  },
}));

vi.mock('@/lib/headline-stats', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/headline-stats')>();
  return {
    ...actual,
    fetchRegisterTotal: vi.fn().mockResolvedValue(170151),
    fetchCatalogueTotal: vi.fn().mockResolvedValue(31915),
  };
});

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
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'sheep-index' }) })).resolves.toEqual(
      { title: 'Sheep index - nz-data-lab' },
    );
  });

  it('returns a generic title for an unknown microsite', async () => {
    await expect(generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })).resolves.toEqual({
      title: 'nz-data-lab',
    });
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

it('calls notFound for a hidden microsite (digitised-memory)', async () => {
  notFoundMock.mockClear();
  await expect(
    renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'digitised-memory' })} />,
    ),
  ).rejects.toThrow();
  expect(notFoundMock).toHaveBeenCalled();
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

it('calls notFound for a hidden microsite (species-register)', async () => {
  notFoundMock.mockClear();
  await expect(
    renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'species-register' })} />,
    ),
  ).rejects.toThrow();
  expect(notFoundMock).toHaveBeenCalled();
});

it('calls notFound for a hidden microsite (open-data-catalogue)', async () => {
  notFoundMock.mockClear();
  await expect(
    renderToReadableStream(
      <MicrositePage params={Promise.resolve({ slug: 'open-data-catalogue' })} />,
    ),
  ).rejects.toThrow();
  expect(notFoundMock).toHaveBeenCalled();
});
