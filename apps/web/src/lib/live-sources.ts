import { XMLParser } from 'fast-xml-parser';

/**
 * Browser-side fetchers for the live-search microsites. The nz-sources
 * package is server-oriented (its fixtures read from disk), so these two
 * fetchers talk to the same public APIs directly from the browser. The
 * parse shapes mirror the nz-sources adapters; a future refactor could
 * split that package into server and client entries to remove the overlap.
 */

export interface LiveNzorName {
  nameId: string;
  className: string;
  fullName: string;
}

const NZOR_XML_PARSER = new XMLParser({ ignoreAttributes: false, parseTagValue: false });

/** How long a browser live-search request may take before it is aborted. */
export const LIVE_SEARCH_TIMEOUT_MS = 10_000;

/** Creates an AbortController that aborts after the live-search timeout.
 * @returns the controller whose signal is passed to fetch.
 */
function createLiveSearchAbortController(): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), LIVE_SEARCH_TIMEOUT_MS);
  return controller;
}

/** Parses an NZOR /names XML payload into name records. */
export function parseNzorNamesXml(payload: string): LiveNzorName[] {
  const parsed = NZOR_XML_PARSER.parse(payload) as {
    Response?: { Names?: { Name?: unknown[] } };
  };
  const rawNames = parsed.Response?.Names?.Name ?? [];
  const names = (Array.isArray(rawNames) ? rawNames : [rawNames]).map((raw) => {
    const name = raw as { NameId?: string; Class?: string; FullName?: string };
    return {
      nameId: name.NameId ?? '',
      className: name.Class ?? '',
      fullName: name.FullName ?? '',
    };
  });
  return names;
}

/** Searches the NZ Organisms Register from the browser (CORS is open). */
export async function searchLiveNzorNames(query: string): Promise<LiveNzorName[]> {
  const controller = createLiveSearchAbortController();
  const response = await fetch(`https://data.nzor.org.nz/names?q=${encodeURIComponent(query)}`, {
    signal: controller.signal,
  });
  if (!response.ok) {
    throw new Error(`NZOR HTTP ${response.status}`);
  }
  return parseNzorNamesXml(await response.text());
}

export interface LiveDataGovtNzDataset {
  name: string;
  title: string;
  organization: string | undefined;
}

/** Parses a data.govt.nz CKAN package_search payload into datasets. */
export function parseDataGovtNzSearch(payload: unknown): LiveDataGovtNzDataset[] {
  const result = (payload as { result?: { results?: unknown[] } }).result;
  const rows = result?.results ?? [];
  return rows.map((row) => {
    const dataset = row as { name?: string; title?: string; organization?: { title?: string } };
    return {
      name: dataset.name ?? '',
      title: dataset.title ?? '',
      organization: dataset.organization?.title,
    };
  });
}

/** Searches the data.govt.nz catalogue from the browser (CORS is open). */
export async function searchLiveDataGovtNz(query: string): Promise<LiveDataGovtNzDataset[]> {
  const controller = createLiveSearchAbortController();
  const response = await fetch(
    `https://catalogue.data.govt.nz/api/3/action/package_search?q=${encodeURIComponent(query)}&rows=20`,
    { signal: controller.signal },
  );
  if (!response.ok) {
    throw new Error(`data.govt.nz HTTP ${response.status}`);
  }
  return parseDataGovtNzSearch(await response.json());
}

export interface LiveDigitalNzRecord {
  id: number;
  title: string;
  contentPartner: string;
  url: string;
  year: number | null;
}

export interface LiveDigitalNzDecade {
  decade: number;
  count: number;
}

export interface LiveDigitalNzSearchResult {
  resultCount: number;
  decades: LiveDigitalNzDecade[];
  records: LiveDigitalNzRecord[];
}

/** Extracts a year from a DigitalNZ record's date fields, or null when absent. */
function parseDigitalNzRecordYear(record: {
  date?: string[];
  display_date?: string | null;
}): number | null {
  const isoDate = record.date?.[0];
  if (isoDate !== undefined) {
    const parsedDate = new Date(isoDate);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.getUTCFullYear();
    }
  }
  const displayMatch = record.display_date?.match(/\b(1[5-9]\d\d|20\d\d)\b/);
  if (displayMatch !== undefined && displayMatch !== null) {
    return Number(displayMatch[1]);
  }
  return null;
}

/** Parses a DigitalNZ v3 records payload with decade facets into a search result. */
export function parseDigitalNzSearch(payload: unknown): LiveDigitalNzSearchResult {
  const search = (
    payload as {
      search?: {
        result_count?: number;
        facets?: { decade?: Record<string, number> };
        results?: unknown[];
      };
    }
  ).search;
  const resultCount = search?.result_count ?? 0;
  const decadeFacet = search?.facets?.decade ?? {};
  const decades = Object.entries(decadeFacet)
    .map(([decade, count]) => ({ decade: Number(decade), count }))
    .filter((entry) => Number.isFinite(entry.decade))
    .sort((a, b) => a.decade - b.decade);
  const records = (search?.results ?? []).map((row) => {
    const record = row as {
      id?: number;
      title?: string;
      display_content_partner?: string | null;
      landing_url?: string | null;
      date?: string[];
      display_date?: string | null;
    };
    return {
      id: record.id ?? 0,
      title: record.title ?? '',
      contentPartner: record.display_content_partner ?? '',
      url: record.landing_url ?? '',
      year: parseDigitalNzRecordYear(record),
    };
  });
  return { resultCount, decades, records };
}

/**
 * Searches the DigitalNZ (National Library) collection from the browser
 * (CORS is open), asking for the decade facet alongside the records.
 */
export async function searchLiveDigitalNz(query: string): Promise<LiveDigitalNzSearchResult> {
  const controller = createLiveSearchAbortController();
  const url = new URL('https://api.digitalnz.org/v3/records.json');
  url.searchParams.set('text', query);
  url.searchParams.set('per_page', '20');
  url.searchParams.set('facets', 'decade');
  url.searchParams.set('facet_fields', 'decade:100');
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) {
    throw new Error(`DigitalNZ HTTP ${response.status}`);
  }
  return parseDigitalNzSearch(await response.json());
}

export interface LiveTradeMeCategory {
  name: string;
  number: string;
  path: string;
  isLeaf: boolean;
  subcategories: LiveTradeMeCategory[];
}

interface RawTradeMeCategory {
  Name: string;
  Number: string;
  Path: string;
  IsLeaf: boolean;
  Subcategories: RawTradeMeCategory[];
}

function isRawTradeMeCategory(value: unknown): value is RawTradeMeCategory {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.Name === 'string' &&
    typeof record.Number === 'string' &&
    typeof record.Path === 'string' &&
    (record.IsLeaf === undefined || typeof record.IsLeaf === 'boolean') &&
    (record.Subcategories === undefined || Array.isArray(record.Subcategories))
  );
}

function toLiveTradeMeCategory(category: RawTradeMeCategory): LiveTradeMeCategory {
  return {
    name: category.Name,
    number: category.Number,
    path: category.Path,
    isLeaf: category.IsLeaf,
    subcategories: (category.Subcategories ?? []).map(toLiveTradeMeCategory),
  };
}

/** Parses a Trade Me Categories.json payload into a category tree. */
export function parseTradeMeTree(payload: unknown): LiveTradeMeCategory {
  if (!isRawTradeMeCategory(payload)) {
    throw new Error('Trade Me: invalid category payload');
  }
  return toLiveTradeMeCategory(payload);
}

/** Fetches the Trade Me category tree from the browser (CORS is open). */
export async function fetchLiveTradeMeTree(): Promise<LiveTradeMeCategory> {
  const controller = createLiveSearchAbortController();
  const response = await fetch('https://api.trademe.co.nz/v1/Categories.json', {
    signal: controller.signal,
  });
  if (!response.ok) {
    throw new Error(`Trade Me HTTP ${response.status}`);
  }
  return parseTradeMeTree(await response.json());
}

export interface LiveInaturalistTaxon {
  taxon: string;
  speciesCount: number;
  observationCount: number;
  observerCount: number;
}

/** Iconic taxa shown on the backyard-species-census bubble chart. */
export const INATURALIST_TAXA = [
  'Aves',
  'Mammalia',
  'Reptilia',
  'Actinopterygii',
  'Insecta',
  'Arachnida',
  'Mollusca',
  'Plantae',
  'Fungi',
] as const;

/** The iNaturalist place id for New Zealand. */
export const INATURALIST_NZ_PLACE_ID = 6803;

/** Extracts the total_results count from an iNaturalist list payload. */
export function parseInaturalistTotal(payload: unknown): number {
  const total = (payload as { total_results?: number }).total_results;
  return typeof total === 'number' && Number.isFinite(total) ? total : 0;
}

/**
 * Fetches per-taxon species, observation, and observer counts for New
 * Zealand from iNaturalist (CORS is open). Three small list calls per taxon,
 * all in parallel.
 */
export async function fetchLiveInaturalistTaxa(): Promise<LiveInaturalistTaxon[]> {
  const results = await Promise.all(
    INATURALIST_TAXA.map(async (taxon) => {
      const base = 'https://api.inaturalist.org/v1/observations';
      const placeQuery = `place_id=${INATURALIST_NZ_PLACE_ID}`;
      const [species, observations, observers] = await Promise.all([
        fetchJson(
          `${base}/species_counts?${placeQuery}&hrank=species&iconic_taxa=${taxon}&per_page=1`,
        ),
        fetchJson(`${base}?${placeQuery}&iconic_taxa=${taxon}&per_page=1`),
        fetchJson(`${base}/observers?${placeQuery}&iconic_taxa=${taxon}&per_page=1`),
      ]);
      return {
        taxon,
        speciesCount: parseInaturalistTotal(species),
        observationCount: parseInaturalistTotal(observations),
        observerCount: parseInaturalistTotal(observers),
      };
    }),
  );
  return results;
}

export interface LiveGbifKingdom {
  kingdom: string;
  count2014: number;
  count2024: number;
}

/** GBIF kingdom keys mapped to their names. */
const GBIF_KINGDOM_NAMES: Record<string, string> = {
  '1': 'Animalia',
  '6': 'Plantae',
  '3': 'Fungi',
  '4': 'Protozoa',
  '5': 'Chromista',
  '2': 'Archaea',
  '7': 'Bacteria',
  '8': 'Viruses',
  '0': 'Unknown',
};

/** Extracts the KINGDOM_KEY facet counts from a GBIF occurrence search. */
export function parseGbifKingdomFacet(payload: unknown): Record<string, number> {
  const facets = (payload as { facets?: unknown[] }).facets ?? [];
  const kingdomFacet = facets.find((facet) => {
    const candidate = facet as { field?: string };
    return candidate.field === 'KINGDOM_KEY';
  }) as { counts?: Array<{ name: string; count: number }> } | undefined;
  const counts: Record<string, number> = {};
  for (const entry of kingdomFacet?.counts ?? []) {
    counts[entry.name] = entry.count;
  }
  return counts;
}

/**
 * Fetches New Zealand occurrence records by kingdom for 2014 and 2024 from
 * GBIF (CORS is open), for the species-record-ledger slope chart.
 */
export async function fetchLiveGbifKingdoms(): Promise<LiveGbifKingdom[]> {
  const [counts2014, counts2024] = await Promise.all([
    fetchGbifKingdomCounts(2014),
    fetchGbifKingdomCounts(2024),
  ]);
  const keys = new Set([...Object.keys(counts2014), ...Object.keys(counts2024)]);
  return [...keys]
    .map((key) => ({
      kingdom: GBIF_KINGDOM_NAMES[key] ?? key,
      count2014: counts2014[key] ?? 0,
      count2024: counts2024[key] ?? 0,
    }))
    .filter((entry) => entry.kingdom !== 'Unknown')
    .sort((a, b) => b.count2024 - a.count2024);
}

async function fetchGbifKingdomCounts(year: number): Promise<Record<string, number>> {
  const url = new URL('https://api.gbif.org/v1/occurrence/search');
  url.searchParams.set('country', 'NZ');
  url.searchParams.set('year', String(year));
  url.searchParams.set('facet', 'kingdomKey');
  url.searchParams.set('limit', '0');
  const controller = createLiveSearchAbortController();
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) {
    throw new Error(`GBIF HTTP ${response.status}`);
  }
  return parseGbifKingdomFacet(await response.json());
}

export interface LiveWikipediaPage {
  title: string;
  dailyViews: number[];
}

/** NZ topics tracked on the what-the-world-reads timeline. */
export const WIKIPEDIA_NZ_PAGES = [
  'New Zealand',
  'Auckland',
  'Wellington',
  'Christchurch',
  'All Blacks',
  'Kiwi',
  'Māori people',
  'Rugby union in New Zealand',
  'The Lord of the Rings (film series)',
  'Jacinda Ardern',
  'Queenstown, New Zealand',
  'Hobbiton Movie Set',
] as const;

/** Parses a Wikipedia pageviews query payload into per-page daily view series. */
export function parseWikipediaPageviews(payload: unknown): LiveWikipediaPage[] {
  const pages = (
    payload as {
      query?: {
        pages?: Record<string, { title?: string; pageviews?: Record<string, number | null> }>;
      };
    }
  ).query?.pages;
  if (pages === undefined) {
    return [];
  }
  return Object.values(pages).map((page) => {
    const views = page.pageviews ?? {};
    const dailyViews = Object.entries(views)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([, count]) => count ?? 0);
    return { title: page.title ?? '', dailyViews };
  });
}

/**
 * Fetches the last 60 days of daily pageviews for the tracked NZ topics from
 * the English Wikipedia API (CORS is open).
 */
export async function fetchLiveWikipediaPageviews(): Promise<LiveWikipediaPage[]> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', WIKIPEDIA_NZ_PAGES.join('|'));
  url.searchParams.set('prop', 'pageviews');
  url.searchParams.set('format', 'json');
  const controller = createLiveSearchAbortController();
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) {
    throw new Error(`Wikipedia HTTP ${response.status}`);
  }
  return parseWikipediaPageviews(await response.json());
}

/** Fetches a JSON payload with the shared live-search timeout. */
async function fetchJson(url: string): Promise<unknown> {
  const controller = createLiveSearchAbortController();
  const response = await fetch(url, { signal: controller.signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
