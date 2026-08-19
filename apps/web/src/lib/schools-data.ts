import { readFileSync } from 'node:fs';
import path from 'node:path';

import { fetchLiveSchools } from './live-sources';
import type { LiveNzSchool } from './live-sources';

const SCHOOLS_FIXTURE_PATH = path.join(process.cwd(), 'src/lib/fixtures/osm-nz-schools.json');

let cachedSchools: Promise<LiveNzSchool[]> | null = null;

/** Loads the committed OpenStreetMap schools snapshot from disk. */
function loadSchoolsFixture(): LiveNzSchool[] {
  const parsed = JSON.parse(readFileSync(SCHOOLS_FIXTURE_PATH, 'utf8')) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error('OSM schools fixture is not an array');
  }
  return parsed.map((row) => {
    const record = row as { name?: unknown; years?: unknown; authority?: unknown };
    return {
      name: typeof record.name === 'string' ? record.name : '',
      years: typeof record.years === 'string' ? record.years : undefined,
      authority: typeof record.authority === 'string' ? record.authority : undefined,
    };
  });
}

/**
 * New Zealand schools from OpenStreetMap, fetched once per build and reused
 * across every story page. Falls back to the committed snapshot when the
 * Overpass API is slow or down, so the page always renders.
 */
export function fetchSchoolsForBuild(): Promise<LiveNzSchool[]> {
  cachedSchools ??= fetchLiveSchools().catch(() => loadSchoolsFixture());
  return cachedSchools;
}
