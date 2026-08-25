#!/usr/bin/env node
// Syncs the vendored packages/stats-nz from a checkout of
// https://github.com/olitreadwell/nz-open-data-connectors.
//
// This site is an example of using the connectors repo. npm git dependencies
// cannot target a subpackage inside a workspace monorepo, so the single
// package the site uses is vendored here and kept in sync with this script.
//
// Usage:
//   node scripts/sync-connectors.mjs                      uses ../nz-open-data-connectors
//   node scripts/sync-connectors.mjs --from /path/to/repo
//   node scripts/sync-connectors.mjs --help
import { cpSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const CONNECTORS_PACKAGE_DIR = 'packages/stats-nz';
const DEFAULT_FROM = resolve(REPO_ROOT, '..', 'nz-open-data-connectors');
const SYNCED_FILES = [
  'README.md',
  'eslint.config.mjs',
  'package.json',
  'tsconfig.json',
  'vitest.config.ts',
  'src',
];

function usage() {
  console.log('Usage: node scripts/sync-connectors.mjs [--from <connectors-checkout>]');
}

function parseArgs(argv) {
  const args = { from: DEFAULT_FROM };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--help') {
      usage();
      process.exit(0);
    }
    if (argv[index] === '--from') {
      args.from = resolve(argv[index + 1]);
      index += 1;
    }
  }
  return args;
}

function readPackageName(packageJsonPath) {
  return JSON.parse(readFileSync(packageJsonPath, 'utf8')).name;
}

const args = parseArgs(process.argv.slice(2));
const connectorsRoot = args.from;
const connectorsPackage = join(connectorsRoot, CONNECTORS_PACKAGE_DIR);

if (!existsSync(join(connectorsPackage, 'package.json'))) {
  console.error(`No ${CONNECTORS_PACKAGE_DIR}/package.json found at ${connectorsRoot}.`);
  usage();
  process.exit(1);
}

if (readPackageName(join(connectorsPackage, 'package.json')) !== '@nzlab/stats-nz') {
  console.error(`${connectorsPackage} is not the @nzlab/stats-nz package.`);
  process.exit(1);
}

for (const entry of SYNCED_FILES) {
  const source = join(connectorsPackage, entry);
  if (!existsSync(source)) {
    console.error(`Missing ${source} in the connectors checkout.`);
    process.exit(1);
  }
  cpSync(source, join(REPO_ROOT, CONNECTORS_PACKAGE_DIR, entry), { recursive: true });
}

console.log(`Synced ${CONNECTORS_PACKAGE_DIR} from ${connectorsRoot}.`);
console.log('Review the diff, then run npm run check.');
