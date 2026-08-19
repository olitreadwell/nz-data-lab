import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchLiveGbifKingdoms,
  fetchLiveInaturalistTaxa,
  fetchLiveSchools,
  INATURALIST_CENSUS_DEADLINE_MS,
  LIVE_SEARCH_TIMEOUT_MS,
  OVERPASS_SCHOOLS_TIMEOUT_MS,
  parseAucklandParkBoards,
  parseCanterburyRainGauges,
  parseCasCrashCells,
  parseDataGovtNzSearch,
  parseDigitalNzSearch,
  parseEvChargingCurrentTypes,
  parseEvChargingOperators,
  parseGbifKingdomFacet,
  parseHamiltonPlaygrounds,
  parseInaturalistTotal,
  parseMvrFleetRows,
  parseNzorNamesXml,
  parseNzSchools,
  parseWikidataPeaks,
  parseWikidataRivers,
  parseWikipediaPageviews,
  searchLiveDataGovtNz,
  searchLiveNzorNames,
} from './live-sources';

function stubHangingFetch(): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
    return new Promise<Response>((_resolve, reject) => {
      if (init?.signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
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

describe('fetchLiveInaturalistTaxa', () => {
  it('aborts the whole census at the overall deadline', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const census = fetchLiveInaturalistTaxa();
    const expectation = expect(census).rejects.toThrow(
      'iNaturalist census hit its overall deadline',
    );
    await vi.advanceTimersByTimeAsync(INATURALIST_CENSUS_DEADLINE_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalled();
  });

  it('keeps other taxa when one sub-request rejects', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (url.includes('iconic_taxa=Aves')) {
        return Promise.reject(new Error('rate limited'));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ total_results: 42 }),
      } as Response);
    });
    vi.stubGlobal('fetch', fetchMock);

    const results = await fetchLiveInaturalistTaxa();
    const aves = results.find((entry) => entry.taxon === 'Aves');
    expect(aves?.speciesCount).toBe(0);
    expect(aves?.observationCount).toBe(0);
    expect(aves?.observerCount).toBe(0);
    const others = results.filter((entry) => entry.taxon !== 'Aves');
    expect(others.length).toBeGreaterThan(0);
    expect(others.every((entry) => entry.speciesCount === 42)).toBe(true);
  });
});

describe('fetchLiveGbifKingdoms', () => {
  it('keeps the other year when one year fetch rejects', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (url.includes('year=2014')) {
        return Promise.reject(new Error('gbif down'));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          facets: [
            {
              field: 'KINGDOM_KEY',
              counts: [{ name: '1', count: 100 }],
            },
          ],
        }),
      } as Response);
    });
    vi.stubGlobal('fetch', fetchMock);

    const results = await fetchLiveGbifKingdoms();
    expect(results).toHaveLength(1);
    expect(results[0]?.kingdom).toBe('Animalia');
    expect(results[0]?.count2014).toBe(0);
    expect(results[0]?.count2024).toBe(100);
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

describe('parseDataGovtNzSearch', () => {
  it('parses CKAN package_search results with the real total count', () => {
    const search = parseDataGovtNzSearch({
      result: {
        count: 4236,
        results: [
          { name: 'water-quality', title: 'Water quality', organization: { title: 'MfE' } },
          { name: 'rainfall', title: 'Rainfall', organization: null },
        ],
      },
    });
    expect(search.totalCount).toBe(4236);
    expect(search.datasets).toEqual([
      { name: 'water-quality', title: 'Water quality', organization: 'MfE' },
      { name: 'rainfall', title: 'Rainfall', organization: undefined },
    ]);
  });

  it('surfaces the total count even when the returned rows are capped', () => {
    const search = parseDataGovtNzSearch({
      result: {
        count: 4236,
        results: [
          { name: 'water-quality', title: 'Water quality', organization: { title: 'MfE' } },
          { name: 'rainfall', title: 'Rainfall', organization: null },
        ],
      },
    });
    expect(search.datasets.length).toBe(2);
    expect(search.totalCount).toBe(4236);
  });

  it('returns an empty list when there are no results', () => {
    expect(parseDataGovtNzSearch({ result: { results: [] } })).toEqual({
      datasets: [],
      totalCount: 0,
    });
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

describe('parseNzSchools', () => {
  it('parses Overpass convert rows with name, years, and authority', () => {
    const payload = {
      elements: [
        {
          type: 'school',
          id: 1,
          tags: { name: 'Burnside High School', years: '9-13', authority: 'state' },
        },
        { type: 'school', id: 2, tags: { name: 'Kura Kaupapa Māori o Te Rau Aroha' } },
      ],
    };
    expect(parseNzSchools(payload)).toEqual([
      { name: 'Burnside High School', years: '9-13', authority: 'state' },
      { name: 'Kura Kaupapa Māori o Te Rau Aroha', years: undefined, authority: undefined },
    ]);
  });

  it('returns an empty list when there are no elements', () => {
    expect(parseNzSchools({ elements: [] })).toEqual([]);
  });
});

describe('parseCanterburyRainGauges', () => {
  it('parses gauge rows with the last eight days of rain', () => {
    const payload = {
      features: [
        {
          attributes: {
            SITENAME: 'Mount Byrne',
            RAIN_TODAY: 40.5,
            RAIN_1_DAY_AGO: 0,
            RAIN_2_DAYS_AGO: 1.6,
            RAIN_3_DAYS_AGO: 2.5,
            RAIN_4_DAYS_AGO: 0,
            RAIN_5_DAYS_AGO: 0.5,
            RAIN_6_DAYS_AGO: 1,
            RAIN_7_DAYS_AGO: 0.4,
            TOTAL_RAINFALL: 86,
          },
        },
      ],
    };
    expect(parseCanterburyRainGauges(payload)).toEqual([
      {
        siteName: 'Mount Byrne',
        rainByDayAgoMm: [40.5, 0, 1.6, 2.5, 0, 0.5, 1, 0.4],
        totalRainfallMm: 86,
      },
    ]);
  });

  it('treats missing readings as null', () => {
    const payload = { features: [{ attributes: { SITENAME: 'Dry' } }] };
    expect(parseCanterburyRainGauges(payload)).toEqual([
      {
        siteName: 'Dry',
        rainByDayAgoMm: [null, null, null, null, null, null, null, null],
        totalRainfallMm: null,
      },
    ]);
  });
});

describe('parseHamiltonPlaygrounds', () => {
  it('parses playground rows with type and decade', () => {
    const payload = {
      features: [
        { attributes: { Park_Name: 'Galloway Park', Type: 'Old Neighbourhood', Decade: 2000 } },
        { attributes: { Park_Name: 'Unknown Park', Type: null, Decade: null } },
      ],
    };
    expect(parseHamiltonPlaygrounds(payload)).toEqual([
      { parkName: 'Galloway Park', type: 'Old Neighbourhood', decade: 2000 },
      { parkName: 'Unknown Park', type: 'Unknown', decade: null },
    ]);
  });

  it('returns an empty list when there are no features', () => {
    expect(parseHamiltonPlaygrounds({ features: [] })).toEqual([]);
  });
});

describe('parseEvChargingOperators', () => {
  it('parses operator rows sorted by count, dropping blank operators', () => {
    const payload = {
      features: [
        { attributes: { operator: 'ChargeNet NZ', count: 307 } },
        { attributes: { operator: 'JOLT', count: 47 } },
        { attributes: { operator: '', count: 3 } },
      ],
    };
    expect(parseEvChargingOperators(payload)).toEqual([
      { operator: 'ChargeNet NZ', count: 307 },
      { operator: 'JOLT', count: 47 },
    ]);
  });

  it('returns an empty list when there are no features', () => {
    expect(parseEvChargingOperators({ features: [] })).toEqual([]);
  });
});

describe('parseEvChargingCurrentTypes', () => {
  it('parses current-type rows sorted by count', () => {
    const payload = {
      features: [
        { attributes: { currentType: 'DC', count: 566 } },
        { attributes: { currentType: 'AC', count: 44 } },
        { attributes: { currentType: 'Mixed', count: 29 } },
      ],
    };
    expect(parseEvChargingCurrentTypes(payload)).toEqual([
      { currentType: 'DC', count: 566 },
      { currentType: 'AC', count: 44 },
      { currentType: 'Mixed', count: 29 },
    ]);
  });
});

describe('parseCasCrashCells', () => {
  it('parses region-by-year cells sorted by year then region', () => {
    const payload = {
      features: [
        { attributes: { region: 'Auckland Region', crashYear: 2007, count: 41661 } },
        { attributes: { region: 'Auckland Region', crashYear: 2006, count: 39778 } },
        { attributes: { region: null, crashYear: 2006, count: 108 } },
      ],
    };
    expect(parseCasCrashCells(payload)).toEqual([
      { region: 'Auckland Region', year: 2006, count: 39778 },
      { region: 'Auckland Region', year: 2007, count: 41661 },
    ]);
  });
});

describe('parseMvrFleetRows', () => {
  it('parses motive-power rows sorted by count, grouping blanks as Unknown', () => {
    const payload = {
      features: [
        { attributes: { MOTIVE_POWER: 'PETROL', count: 3178101 } },
        { attributes: { MOTIVE_POWER: null, count: 882333 } },
        { attributes: { MOTIVE_POWER: 'ELECTRIC', count: 107525 } },
      ],
    };
    expect(parseMvrFleetRows(payload, 'MOTIVE_POWER')).toEqual([
      { label: 'PETROL', count: 3178101 },
      { label: 'Unknown', count: 882333 },
      { label: 'ELECTRIC', count: 107525 },
    ]);
  });

  it('parses vehicle-type rows', () => {
    const payload = {
      features: [
        { attributes: { VEHICLE_TYPE: 'PASSENGER CAR/VAN', count: 3687148 } },
        { attributes: { VEHICLE_TYPE: 'MOTORCYCLE', count: 191097 } },
      ],
    };
    expect(parseMvrFleetRows(payload, 'VEHICLE_TYPE')).toEqual([
      { label: 'PASSENGER CAR/VAN', count: 3687148 },
      { label: 'MOTORCYCLE', count: 191097 },
    ]);
  });
});

describe('fetchLiveSchools', () => {
  const OVERpass_QUERY_TIMEOUT_MS = 60_000;

  it('uses a timeout at least as long as the Overpass [timeout:60] query', () => {
    expect(OVERPASS_SCHOOLS_TIMEOUT_MS).toBeGreaterThanOrEqual(OVERpass_QUERY_TIMEOUT_MS);
  });

  it('aborts the Overpass fetch after the long timeout', async () => {
    vi.useFakeTimers();
    const fetchMock = stubHangingFetch();

    const promise = fetchLiveSchools();
    const expectation = expect(promise).rejects.toThrow('Aborted');
    await vi.advanceTimersByTimeAsync(OVERPASS_SCHOOLS_TIMEOUT_MS);

    await expectation;
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});

describe('parseDigitalNzSearch', () => {
  it('prefers the ISO date array over the display date', () => {
    const payload = {
      search: {
        results: [
          {
            id: 1,
            title: 'A',
            display_content_partner: 'P',
            landing_url: 'u',
            date: ['1908-01-01T00:00:00.000Z'],
            display_date: 'Reproduced from a 1908 original, scanned 2021',
          },
        ],
      },
    };
    expect(parseDigitalNzSearch(payload).records).toEqual([
      expect.objectContaining({ year: 1908 }),
    ]);
  });

  it('uses the leading display year and ignores a trailing scan year', () => {
    const payload = {
      search: {
        results: [
          {
            id: 1,
            title: 'A',
            display_content_partner: 'P',
            landing_url: 'u',
            display_date: 'Reproduced from a 1908 original, scanned 2021',
          },
        ],
      },
    };
    expect(parseDigitalNzSearch(payload).records).toEqual([
      expect.objectContaining({ year: 1908 }),
    ]);
  });

  it('returns null when no leading year exists in the display date', () => {
    const payload = {
      search: {
        results: [
          {
            id: 1,
            title: 'A',
            display_content_partner: 'P',
            landing_url: 'u',
            display_date: 'This record has no leading date but mentions scanned 2021',
          },
        ],
      },
    };
    expect(parseDigitalNzSearch(payload).records).toEqual([
      expect.objectContaining({ year: null }),
    ]);
  });

  it('keeps decade faceting consistent with the parsed records', () => {
    const payload = {
      search: {
        result_count: 1,
        facets: { decade: { 1900: 1 } },
        results: [
          {
            id: 1,
            title: 'A',
            display_content_partner: 'P',
            landing_url: 'u',
            display_date: '1900-1950',
          },
        ],
      },
    };
    const result = parseDigitalNzSearch(payload);
    expect(result.decades).toEqual([{ decade: 1900, count: 1 }]);
    expect(result.records).toEqual([expect.objectContaining({ year: 1900 })]);
  });
});
