import { renderToReadableStream } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import HomePage from './page';

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
  it('renders the hero and the sheep index teaser on one page', async () => {
    const stream = await renderToReadableStream(<HomePage />);
    const html = await new Response(stream).text();
    expect(html).toContain('Small experiments digging through New Zealand public data');
    expect(html).toContain('national animal is in freefall');
    expect(html).toContain('Reveal the sheep index');
  });
});
