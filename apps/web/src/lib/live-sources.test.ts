import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  LIVE_SEARCH_TIMEOUT_MS,
  parseAucklandParkBoards,
  parseGbifKingdomFacet,
  parseInaturalistTotal,
  parseNzorNamesXml,
  parseWikidataPeaks,
  parseWikidataRivers,
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

describe('parseNzorNamesXml', () => {
  it('parses the /names/search response shape', () => {
    const payload = `<?xml version="1.0"?>
<NamesSearchResponse>
  <Total>2</Total>
  <Results>
    <NameSearchResult>
      <Name>
        <NameId>8c0e6c60-2e1d-4280-b129-0e687d2dbb79</NameId>
        <Class>Scientific Name</Class>
        <FullName>Anzacladius kiwi Cranston, 2009</FullName>
      </Name>
    </NameSearchResult>
    <NameSearchResult>
      <Name>
        <NameId>071b096a-724f-4b46-9a96-3c11a9950618</NameId>
        <Class>Scientific Name</Class>
        <FullName>Kiwi Khalaim and Ward, 2019</FullName>
      </Name>
    </NameSearchResult>
  </Results>
</NamesSearchResponse>`;
    const names = parseNzorNamesXml(payload);
    expect(names).toHaveLength(2);
    expect(names[0]).toEqual({
      nameId: '8c0e6c60-2e1d-4280-b129-0e687d2dbb79',
      className: 'Scientific Name',
      fullName: 'Anzacladius kiwi Cranston, 2009',
    });
    expect(names[1]?.fullName).toBe('Kiwi Khalaim and Ward, 2019');
  });

  it('returns an empty list when there are no results', () => {
    const payload = `<?xml version="1.0"?>
<NamesSearchResponse>
  <Total>0</Total>
  <Results />
</NamesSearchResponse>`;
    expect(parseNzorNamesXml(payload)).toEqual([]);
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

describe('parseWikidataRivers', () => {
  it('parses rivers sorted by length, dropping noise and duplicates', () => {
    const payload = {
      results: {
        bindings: [
          { riverLabel: { value: 'Waikato River' }, length: { value: '425' } },
          { riverLabel: { value: 'Kākānui Stream' }, length: { value: '900' } },
          { riverLabel: { value: 'Taieri River' }, length: { value: '200' } },
          { riverLabel: { value: 'Taieri River' }, length: { value: '288' } },
          { riverLabel: { value: 'Clutha River / Mata-Au' }, length: { value: '338' } },
        ],
      },
    };
    expect(parseWikidataRivers(payload)).toEqual([
      { name: 'Waikato River', lengthKm: 425 },
      { name: 'Clutha River / Mata-Au', lengthKm: 338 },
      { name: 'Taieri River', lengthKm: 288 },
    ]);
  });

  it('returns an empty list when there are no bindings', () => {
    expect(parseWikidataRivers({ results: { bindings: [] } })).toEqual([]);
  });
});

describe('parseWikidataPeaks', () => {
  it('parses peaks sorted by elevation, dropping noise and duplicates', () => {
    const payload = {
      results: {
        bindings: [
          { peakLabel: { value: 'Aoraki / Mount Cook' }, elevation: { value: '3724' } },
          { peakLabel: { value: 'Mole' }, elevation: { value: '4656' } },
          { peakLabel: { value: 'Mount Tasman' }, elevation: { value: '3497' } },
          { peakLabel: { value: 'Mount Tasman' }, elevation: { value: '3000' } },
        ],
      },
    };
    expect(parseWikidataPeaks(payload)).toEqual([
      { name: 'Aoraki / Mount Cook', elevationM: 3724 },
      { name: 'Mount Tasman', elevationM: 3497 },
    ]);
  });

  it('returns an empty list when there are no bindings', () => {
    expect(parseWikidataPeaks({ results: { bindings: [] } })).toEqual([]);
  });
});

describe('parseAucklandParkBoards', () => {
  it('parses local-board rows sorted by area, dropping blank boards', () => {
    const payload = {
      features: [
        { attributes: { LOCALBOARD: 'Franklin', count: 382, totalArea: 200596395 } },
        { attributes: { LOCALBOARD: 'Rodney', count: 424, totalArea: 53970780 } },
        { attributes: { LOCALBOARD: 'None', count: 20, totalArea: 120335 } },
        { attributes: { LOCALBOARD: 'NOT SUPPLIED', count: 6, totalArea: 1479983 } },
      ],
    };
    expect(parseAucklandParkBoards(payload)).toEqual([
      { board: 'Franklin', parkCount: 382, areaM2: 200596395 },
      { board: 'Rodney', parkCount: 424, areaM2: 53970780 },
    ]);
  });

  it('returns an empty list when there are no features', () => {
    expect(parseAucklandParkBoards({ features: [] })).toEqual([]);
  });
});
