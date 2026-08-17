import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LIVE_SEARCH_TIMEOUT_MS,
  parseGbifKingdomFacet,
  parseInaturalistTotal,
  parseWikipediaPageviews,
  searchLiveDataGovtNz,
  searchLiveNzorNames,
} from './live-sources';

function stubHangingFetch(): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('live-sources fetchers', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('aborts the NZOR fetch after the timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const promise = searchLiveNzorNames('kiwi');
    const expectation = expect(promise).rejects.toThrow('Aborted');
    await vi.advanceTimersByTimeAsync(LIVE_SEARCH_TIMEOUT_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('data.nzor.org.nz'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('aborts the data.govt.nz fetch after the timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const promise = searchLiveDataGovtNz('water');
    const expectation = expect(promise).rejects.toThrow('Aborted');
    await vi.advanceTimersByTimeAsync(LIVE_SEARCH_TIMEOUT_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('catalogue.data.govt.nz'),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});

describe('parseInaturalistTotal', () => {
  it('extracts the total_results count', () => {
    expect(parseInaturalistTotal({ total_results: 4342223 })).toBe(4342223);
  });

  it('returns zero for a missing or invalid count', () => {
    expect(parseInaturalistTotal({})).toBe(0);
    expect(parseInaturalistTotal({ total_results: 'many' })).toBe(0);
  });
});

describe('parseGbifKingdomFacet', () => {
  it('extracts the KINGDOM_KEY facet counts', () => {
    const payload = {
      count: 748744,
      facets: [
        { field: 'YEAR', counts: [{ name: '2014', count: 748744 }] },
        {
          field: 'KINGDOM_KEY',
          counts: [
            { name: '1', count: 208004 },
            { name: '6', count: 37149 },
          ],
        },
      ],
    };
    expect(parseGbifKingdomFacet(payload)).toEqual({ '1': 208004, '6': 37149 });
  });

  it('returns an empty map when the facet is absent', () => {
    expect(parseGbifKingdomFacet({ facets: [] })).toEqual({});
  });
});

describe('parseWikipediaPageviews', () => {
  it('parses per-page daily views sorted by date', () => {
    const payload = {
      query: {
        pages: {
          '1': {
            title: 'New Zealand',
            pageviews: { '2026-07-20': 8000, '2026-07-19': 7000, '2026-07-18': null },
          },
        },
      },
    };
    expect(parseWikipediaPageviews(payload)).toEqual([
      { title: 'New Zealand', dailyViews: [0, 7000, 8000] },
    ]);
  });

  it('returns an empty list when the query has no pages', () => {
    expect(parseWikipediaPageviews({ query: {} })).toEqual([]);
  });
});
