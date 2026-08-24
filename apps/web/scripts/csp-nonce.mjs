import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// The per-build CSP nonce is shared between vercel.ts (which runs first and
// writes it) and generate-csp.mjs (which reads it back to stamp the inline
// scripts and out/_headers), so the CSP Vercel serves matches the markup.
export const CSP_NONCE_PATH = path.join(WEB_ROOT, '.vercel', 'csp-nonce');

/** Generates a fresh nonce for this build and persists it for the rest of it. */
export function freshCspNonce() {
  const nonce = randomBytes(16).toString('base64');
  writeCspNonce(nonce);
  return nonce;
}

/** Returns the nonce written earlier in the build, generating one if absent. */
export function readCspNonce() {
  try {
    return readFileSync(CSP_NONCE_PATH, 'utf8');
  } catch {
    const nonce = randomBytes(16).toString('base64');
    writeCspNonce(nonce);
    return nonce;
  }
}

function writeCspNonce(nonce) {
  mkdirSync(path.dirname(CSP_NONCE_PATH), { recursive: true });
  writeFileSync(CSP_NONCE_PATH, nonce);
}
