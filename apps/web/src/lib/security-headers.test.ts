import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { CSP_NONCE_PATH } from '../../scripts/csp-nonce.mjs';
import vercelConfig from '../../vercel';

// The test lives at apps/web/src/lib, so the workspace root is two levels up.
const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const GENERATE_CSP_SCRIPT = path.join(WEB_ROOT, 'scripts', 'generate-csp.mjs');

/** The security headers every served response must carry. */
const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'X-Frame-Options',
  'Permissions-Policy',
];

interface SecurityHeader {
  key: string;
  value: string;
}

interface HeaderRule {
  path: string;
  headers: Record<string, string>;
}

function readVercelHeaders(): SecurityHeader[] {
  const rules = vercelConfig.headers[0];
  return rules?.headers ?? [];
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

interface GeneratedCsp {
  dir: string;
  headers: string;
  html: string;
}

/**
 * Runs the real build-time CSP generator into a temp dir and returns its output.
 *
 * @returns the generated `_headers` contents, the rewritten HTML, and the temp dir
 */
function generateCspOutput(): GeneratedCsp {
  const dir = mkdtempSync(path.join(tmpdir(), 'csp-'));
  writeFileSync(
    path.join(dir, 'index.html'),
    '<html><body><script>window.__cspTest = true;</script></body></html>',
  );
  execFileSync('node', [GENERATE_CSP_SCRIPT, dir], { cwd: WEB_ROOT });
  return {
    dir,
    headers: readFileSync(path.join(dir, '_headers'), 'utf8'),
    html: readFileSync(path.join(dir, 'index.html'), 'utf8'),
  };
}

/**
 * Parses a Netlify-style `_headers` file into path -> header rules. Path lines
 * start at column zero; header lines are indented beneath their path.
 *
 * @param content - the raw `_headers` file contents
 * @returns the parsed path -> header rules
 */
function parseHeadersFile(content: string): HeaderRule[] {
  const rules: HeaderRule[] = [];
  let current: HeaderRule | null = null;
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      current = { path: trimmed, headers: {} };
      rules.push(current);
    } else if (current) {
      const colon = trimmed.indexOf(':');
      if (colon === -1) continue;
      current.headers[trimmed.slice(0, colon).trim()] = trimmed.slice(colon + 1).trim();
    }
  }
  return rules;
}

interface ServedSite {
  url: string;
  close: () => Promise<void>;
}

/**
 * Serves a static directory over HTTP, applying its `_headers` file the way a
 * `_headers`-aware host (Netlify, Cloudflare Pages) would.
 *
 * @param root - the static directory to serve
 * @returns the served site URL and a close handle
 */
function serveStaticSite(root: string): Promise<ServedSite> {
  const rules = parseHeadersFile(readFileSync(path.join(root, '_headers'), 'utf8'));
  return new Promise((resolve) => {
    const server: Server = createServer((req, res) => {
      const urlPath = new URL(req.url ?? '/', 'http://localhost').pathname;
      const rule = rules.find((candidate) => candidate.path === '/*' || candidate.path === urlPath);
      if (rule) {
        for (const [key, value] of Object.entries(rule.headers)) {
          res.setHeader(key, value);
        }
      }
      const filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
      try {
        res.statusCode = 200;
        res.end(readFileSync(filePath));
      } catch {
        res.statusCode = 404;
        res.end('Not found');
      }
    });
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        resolve({
          url: `http://127.0.0.1:${address.port}`,
          close: () => new Promise((done) => server.close(() => done())),
        });
      }
    });
  });
}

describe('security headers', () => {
  const vercelHeaders = readVercelHeaders();
  const generated = generateCspOutput();
  let servedCsp: string;

  beforeAll(async () => {
    const served = await serveStaticSite(generated.dir);
    try {
      const response = await fetch(served.url);
      servedCsp = response.headers.get('Content-Security-Policy') ?? '';
    } finally {
      await served.close();
    }
  });

  afterAll(() => {
    rmSync(generated.dir, { recursive: true, force: true });
    rmSync(CSP_NONCE_PATH, { force: true });
  });

  it('serves every security header in the HTTP response', async () => {
    const served = await serveStaticSite(generated.dir);
    try {
      const response = await fetch(served.url);
      for (const header of REQUIRED_HEADERS) {
        expect(response.headers.get(header), `missing ${header}`).not.toBeNull();
      }
    } finally {
      await served.close();
    }
  });

  it('does not allow unsafe-inline in script-src', () => {
    const scriptSrc = cspDirective(servedCsp, 'script-src');
    expect(scriptSrc).not.toContain("'unsafe-inline'");
  });

  it('injects a fresh nonce into the generated _headers and the inline scripts', () => {
    const scriptSrc = cspDirective(servedCsp, 'script-src');
    const nonce = /'nonce-([^']+)'/.exec(scriptSrc)?.[1];
    if (nonce === undefined) {
      throw new Error('CSP script-src is missing a nonce');
    }
    expect(generated.html).toContain(`nonce="${nonce}"`);
  });

  it('serves a CSP on Vercel whose nonce permits the inline scripts', () => {
    const vercelCsp =
      vercelHeaders.find((header) => header.key === 'Content-Security-Policy')?.value ?? '';
    const scriptSrc = cspDirective(vercelCsp, 'script-src');
    const nonce = /'nonce-([^']+)'/.exec(scriptSrc)?.[1];
    if (nonce === undefined) {
      throw new Error('vercel.ts CSP script-src is missing a nonce');
    }
    expect(generated.html).toContain(`nonce="${nonce}"`);
  });

  it('does not commit a nonce in tracked config', () => {
    const vercelTs = readFileSync(`${WEB_ROOT}/vercel.ts`, 'utf8');
    expect(vercelTs).not.toMatch(/nonce-[A-Za-z0-9+/=]{12,}/);
    expect(readStaticHeaders()).not.toContain('nonce-');
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

  it('carries CSP and HSTS on Vercel', () => {
    const keys = vercelHeaders.map((header) => header.key);
    expect(keys).toEqual(
      expect.arrayContaining(['Content-Security-Policy', 'Strict-Transport-Security']),
    );
  });

  it('mirrors the headers in the static _headers file', () => {
    const staticHeaders = readStaticHeaders();
    const stripNonce = (csp: string) => csp.replace(/\s+'nonce-[^']*'/, '');
    for (const header of vercelHeaders) {
      const staticLine = staticHeaders
        .split('\n')
        .find((line) => line.trim().startsWith(`${header.key}:`));
      const staticValue = staticLine?.trim().slice(`${header.key}:`.length).trim() ?? '';
      if (header.key === 'Content-Security-Policy') {
        // The committed CSP carries no nonce; vercel.ts adds the per-build one.
        expect(stripNonce(staticValue)).toBe(stripNonce(header.value));
      } else {
        expect(staticValue).toBe(header.value);
      }
    }
  });
});
