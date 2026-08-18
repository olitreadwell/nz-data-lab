/* global fetch, process, setTimeout */
// Verifies a deployed URL serves every security header the site is meant to
// carry, and that the served CSP actually permits the inline scripts in the
// served HTML to run (the per-build nonce round-trips from markup to header).
// Exits non-zero when any header is missing or an inline script is blocked so
// a host that cannot serve them fails loudly instead of silently passing.
const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'X-Frame-Options',
  'Permissions-Policy',
];

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 5000;

const url = process.argv[2];
if (!url) {
  process.stderr.write('Usage: node scripts/check-deployed-security-headers.mjs <url>\n');
  process.exit(2);
}

let response;
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
  try {
    response = await fetch(url);
    break;
  } catch {
    if (attempt === MAX_ATTEMPTS) {
      process.stderr.write(`Could not reach ${url} after ${MAX_ATTEMPTS} attempts\n`);
      process.exit(1);
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }
}

const missing = REQUIRED_HEADERS.filter((header) => !response.headers.has(header));
if (missing.length > 0) {
  process.stderr.write(`Deployed URL ${url} is missing security headers: ${missing.join(', ')}\n`);
  process.exit(1);
}

const csp = response.headers.get('Content-Security-Policy') ?? '';
const html = await response.text();
const scriptSrc = /script-src\s+([^;]+)/.exec(csp)?.[1] ?? '';
const inlineNonces = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*\snonce="([^"]+)"/g)].map(
  (match) => match[1],
);

const blocked = inlineNonces.filter((nonce) => !scriptSrc.includes(`'nonce-${nonce}'`));
if (blocked.length > 0) {
  process.stderr.write(
    `Deployed URL ${url} serves a CSP that blocks inline scripts with nonce(s): ${blocked.join(', ')}\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `Deployed URL ${url} serves all security headers and permits its inline scripts.\n`,
);
