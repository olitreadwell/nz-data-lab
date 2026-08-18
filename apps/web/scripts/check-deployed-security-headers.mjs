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
    `Deployed URL ${url} serves a CSP that blocks script nonce(s): ${blocked.join(', ')}\n`,
  );
  process.exit(1);
}

// A strict style-src needs every inline style attribute to carry the same
// per-build nonce the CSP serves. The nonce is stamped right after the tag
// name, so the style attribute always follows it.
const styleSrc = /style-src\s+([^;]+)/.exec(csp)?.[1] ?? '';
if (styleSrc.includes("'unsafe-inline'")) {
  process.stderr.write(`Deployed URL ${url} still serves 'unsafe-inline' in style-src.\n`);
  process.exit(1);
}
const styledElements = [...html.matchAll(/<[a-z][a-z0-9-]*[^>]*\sstyle="/g)].length;
const noncedStyledElements = [...html.matchAll(/<[a-z][a-z0-9-]* nonce="[^"]+"[^>]*\sstyle="/g)]
  .length;
if (styledElements > 0 && styledElements !== noncedStyledElements) {
  process.stderr.write(
    `Deployed URL ${url} has ${styledElements} inline style attributes but only ${noncedStyledElements} carry the nonce.\n`,
  );
  process.exit(1);
}
for (const match of html.matchAll(/<[a-z][a-z0-9-]* nonce="([^"]+)"[^>]*\sstyle="/g)) {
  if (!styleSrc.includes(`'nonce-${match[1]}'`)) {
    process.stderr.write(`Deployed URL ${url} serves a CSP that blocks style nonce ${match[1]}.\n`);
    process.exit(1);
  }
}

process.stdout.write(
  `Deployed URL ${url} serves all security headers and permits its inline scripts and styles.\n`,
);
