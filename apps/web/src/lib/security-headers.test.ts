import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Vitest runs with the workspace root (apps/web) as cwd.
const WEB_ROOT = process.cwd();

/** Browser API hosts the app fetches from (see src/lib/live-sources.ts). */
const LIVE_API_HOSTS = [
  'data.nzor.org.nz',
  'catalogue.data.govt.nz',
  'api.digitalnz.org',
  'api.trademe.co.nz',
  'api.inaturalist.org',
  'api.gbif.org',
  'en.wikipedia.org',
  'query.wikidata.org',
  'services1.arcgis.com',
];

const TILE_HOST = 'tile.openstreetmap.org';

interface SecurityHeader {
  key: string;
  value: string;
}

function readVercelHeaders(): SecurityHeader[] {
  const config = JSON.parse(readFileSync(`${WEB_ROOT}/vercel.json`, 'utf8')) as {
    headers: Array<{ source: string; headers: SecurityHeader[] }>;
  };
  return config.headers[0]?.headers ?? [];
}

function readStaticHeaders(): string {
  return readFileSync(`${WEB_ROOT}/public/_headers`, 'utf8');
}

function cspDirective(csp: string, name: string): string {
  const match = new RegExp(`${name}\\s+([^;]+)`).exec(csp);
  const value = match?.[1];
  if (value === undefined) {
    throw new Error(`CSP is missing the ${name} directive`);
  }
  return value;
}

describe('security headers', () => {
  const vercelHeaders = readVercelHeaders();
  const csp = vercelHeaders.find((header) => header.key === 'Content-Security-Policy')?.value ?? '';

  it('allows every live API host in connect-src', () => {
    const connectSrc = cspDirective(csp, 'connect-src');
    for (const host of LIVE_API_HOSTS) {
      expect(connectSrc).toContain(`https://${host}`);
    }
  });

  it('allows the OpenStreetMap tile host in img-src', () => {
    expect(cspDirective(csp, 'img-src')).toContain(`https://${TILE_HOST}`);
  });

  it('ships the other security headers on Vercel', () => {
    const keys = vercelHeaders.map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'X-Frame-Options',
        'Permissions-Policy',
      ]),
    );
  });

  it('mirrors the headers in the static _headers file', () => {
    const staticHeaders = readStaticHeaders();
    for (const header of vercelHeaders) {
      expect(staticHeaders).toContain(`${header.key}: ${header.value}`);
    }
  });
});
