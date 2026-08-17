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
