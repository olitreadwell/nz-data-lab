import { freshCspNonce } from './scripts/csp-nonce.mjs';

// Vercel evaluates vercel.ts at build time, so the CSP it serves can carry a
// fresh per-build nonce. The same nonce is persisted by freshCspNonce and read
// back by scripts/generate-csp.mjs, which stamps it into the exported HTML's
// inline scripts. Keeping script-src strict (no 'unsafe-inline') means only the
// scripts this build emitted are allowed to run. The same nonce is stamped
// into every inline style attribute, so style-src can stay strict too.
const nonce = freshCspNonce();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src 'self' data: blob: https://tile.openstreetmap.org; connect-src 'self' https://data.nzor.org.nz https://catalogue.data.govt.nz https://api.digitalnz.org https://api.trademe.co.nz https://api.inaturalist.org https://api.gbif.org https://en.wikipedia.org https://query.wikidata.org https://services1.arcgis.com https://services.arcgis.com https://overpass-api.de; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
  },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
];

const config = {
  buildCommand: 'next build && node scripts/generate-csp.mjs',
  headers: [{ source: '/(.*)', headers: securityHeaders }],
};

export default config;
