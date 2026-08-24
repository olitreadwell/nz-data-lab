import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { HIDDEN_MICROSITES } from '@/lib/hidden-microsites';
import { CATEGORY_SLUGS, MICROSITES } from '@/lib/microsites';

import HomePage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

/** Category slug for a microsite slug, for link assertions. */
function categorySlugForTest(slug: string): string {
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  return microsite === undefined ? 'nope' : CATEGORY_SLUGS[microsite.category];
}

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

describe('HomePage', () => {
  it('renders the mission line and the visible microsite cards', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    expect(html).toContain('Small experiments digging through New Zealand public data');
    expect(html).toContain('national animal is in freefall');
    for (const slug of HIDDEN_MICROSITES) {
      expect(html).not.toContain(`href="/${categorySlugForTest(slug)}/${slug}"`);
    }
  });

  it('links every visible card to its story page and omits hidden ones', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    const visibleWithCards = ['sheep-index'];
    for (const slug of visibleWithCards) {
      expect(html).toContain(`href="/${categorySlugForTest(slug)}/${slug}"`);
    }
    for (const slug of HIDDEN_MICROSITES) {
      expect(html).not.toContain(`href="/${categorySlugForTest(slug)}/${slug}"`);
    }
  });

  it('shows a headline stat on each visible card', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    expect(html).toContain('23.3 million');
  });
});
