import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { HIDDEN_MICROSITES } from '@/lib/hidden-microsites';

import HomePage from './page';

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
        { year: 2010, sheep: 32562612 },
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

describe('HomePage', () => {
  it('renders the mission line and the visible microsite cards', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    expect(html).toContain('Small experiments digging through New Zealand public data');
    expect(html).toContain('national animal is in freefall');
    expect(html).toContain('paddocks flipped from wool to milk');
    expect(html).toContain('stopped planting trees');
    for (const slug of HIDDEN_MICROSITES) {
      expect(html).not.toContain(`href="/microsites/${slug}"`);
    }
  });

  it('links every visible card to its story page and omits hidden ones', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    const visibleWithCards = [
      'sheep-index',
      'dairy-takeover',
      'planting-bust',
      'kiwifruit-overtake',
      'deer-boom-bust',
      'online-garage-sale',
    ];
    for (const slug of visibleWithCards) {
      expect(html).toContain(`href="/microsites/${slug}"`);
    }
    for (const slug of HIDDEN_MICROSITES) {
      expect(html).not.toContain(`href="/microsites/${slug}"`);
    }
  });

  it('shows a headline stat on each visible card', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    expect(html).toContain('23.3 million');
    expect(html).toContain('5.8 million');
    expect(html).toContain('8,293 ha');
    expect(html).toContain('14,514 ha');
    expect(html).toContain('0.7 million');
    expect(html).toContain('5,589');
  });
});
