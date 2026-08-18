import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The test lives at apps/web/src/lib, so the workspace root is two levels up.
const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GENERATE_CSP_SCRIPT = path.join(WEB_ROOT, 'scripts', 'generate-csp.mjs');

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

function staticHeaderValue(headers: string, key: string): string {
  const match = new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm').exec(headers);
  const value = match?.[1];
  if (value === undefined) {
    throw new Error(`_headers is missing the ${key} header`);
  }
  return value;
}

interface GeneratedCsp {
  headers: string;
  html: string;
}

/** Runs the real build-time CSP generator into a temp dir and returns its output. */
function generateCspOutput(): GeneratedCsp {
  const tmp = mkdtempSync(path.join(tmpdir(), 'csp-'));
  try {
    writeFileSync(
      path.join(tmp, 'index.html'),
      '<html><body><script>window.__cspTest = true;</script></body></html>',
    );
    execFileSync('node', [GENERATE_CSP_SCRIPT, tmp], { cwd: WEB_ROOT });
    return {
      headers: readFileSync(path.join(tmp, '_headers'), 'utf8'),
      html: readFileSync(path.join(tmp, 'index.html'), 'utf8'),
    };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

describe('security headers', () => {
  const vercelHeaders = readVercelHeaders();
  const generated = generateCspOutput();
  const csp = staticHeaderValue(generated.headers, 'Content-Security-Policy');

  it('does not allow unsafe-inline in script-src', () => {
    const scriptSrc = cspDirective(csp, 'script-src');
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it('injects a fresh nonce into the generated _headers and the inline scripts', () => {
    const scriptSrc = cspDirective(csp, 'script-src');
    const nonce = /'nonce-([^']+)'/.exec(scriptSrc)?.[1];
    if (nonce === undefined) {
      throw new Error('CSP script-src is missing a nonce');
    }
    expect(generated.html).toContain(`nonce="${nonce}"`);
  });

  it('does not commit a nonce in tracked config', () => {
    const vercelJson = readFileSync(`${WEB_ROOT}/vercel.json`, 'utf8');
    expect(vercelJson).not.toContain('nonce-');
    expect(readStaticHeaders()).not.toContain('nonce-');
  });

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
