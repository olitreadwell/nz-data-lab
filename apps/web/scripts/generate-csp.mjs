import { randomBytes } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WEB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(WEB_ROOT, 'out');
const VERCEL_JSON_PATH = path.join(WEB_ROOT, 'vercel.json');
const STATIC_HEADERS_PATH = path.join(WEB_ROOT, 'public', '_headers');
const OUT_HEADERS_PATH = path.join(OUT_DIR, '_headers');

// A fresh nonce per build lets the strict script-src allow only the inline
// scripts Next.js emits for this build (bootstrap + self.__next_f flight data).
const nonce = randomBytes(16).toString('base64');

function htmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...htmlFiles(full));
    } else if (full.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

// Add the nonce to every inline <script> (a script tag without a src attribute).
const INLINE_SCRIPT_OPEN = /<script(?![^>]*\bsrc=)([^>]*)>/g;
function injectNonce(html) {
  return html.replace(INLINE_SCRIPT_OPEN, (match, attrs) => {
    const cleanAttrs = attrs.replace(/\s+nonce="[^"]*"/g, '').trim();
    return cleanAttrs ? `<script nonce="${nonce}" ${cleanAttrs}>` : `<script nonce="${nonce}">`;
  });
}

for (const file of htmlFiles(OUT_DIR)) {
  writeFileSync(file, injectNonce(readFileSync(file, 'utf8')));
}

// Point script-src at the nonce instead of 'unsafe-inline' in every CSP copy.
const SCRIPT_SRC = /(script-src\s+'self'\s+)(?:'unsafe-inline'|'nonce-[^']*')/;
function withNonce(csp) {
  return csp.replace(SCRIPT_SRC, `$1'nonce-${nonce}'`);
}

function updateCspFile(filePath) {
  const text = readFileSync(filePath, 'utf8');
  writeFileSync(filePath, withNonce(text));
}

updateCspFile(VERCEL_JSON_PATH);
updateCspFile(STATIC_HEADERS_PATH);
updateCspFile(OUT_HEADERS_PATH);
