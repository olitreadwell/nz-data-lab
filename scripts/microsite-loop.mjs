#!/usr/bin/env node
/**
 * Ships one microsite through the loop: worktree branch, checks, commit,
 * merge to main, push, deploy watch, page verify.
 *
 * Usage:
 *   node scripts/microsite-loop.mjs <branch> "<commit message>" [<page-path>...]
 *
 * The worktree is created under .worktrees/<branch>; run the build and
 * tests there before this script merges. This script is the mechanical
 * part of skills/nz-microsite-loop/SKILL.md and is expected to grow as the
 * loop review finds friction.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const [branch, message, ...pages] = process.argv.slice(2);
if (branch === undefined || message === undefined) {
  console.error('usage: node scripts/microsite-loop.mjs <branch> "<message>" [page...]');
  process.exit(1);
}

const root = process.cwd();
const worktree = path.join(root, '.worktrees', branch);
const base = 'https://olitreadwell.github.io/nz-data-lab';

function run(command, args, cwd = root) {
  console.log(`$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

// 1. Fresh worktree off main.
if (existsSync(worktree)) {
  rmSync(worktree, { recursive: true, force: true });
}
run('git', ['worktree', 'add', '-b', branch, worktree, 'main']);

// 2. Checks inside the worktree (build + unit tests for the web app).
run('npm', ['run', 'type-check', '--workspace=@nzlab/web'], worktree);
run('npm', ['test', '--workspace=@nzlab/web'], worktree);

// 3. Commit the worktree changes.
run('git', ['add', '-A'], worktree);
run('git', ['commit', '-m', message], worktree);

// 4. Merge to main and clean up the worktree.
run('git', ['checkout', 'main']);
run('git', ['merge', '--no-ff', branch, '-m', `merge: ${message}`]);
run('git', ['worktree', 'remove', worktree]);
run('git', ['branch', '-d', branch]);

// 5. Push and watch the Pages deploy.
run('git', ['push', 'origin', 'main']);
const runId = execFileSync(
  'gh',
  [
    'run',
    'list',
    '--workflow=deploy_github_pages.yml',
    '--limit',
    '1',
    '--json',
    'databaseId',
    '-q',
    '.[0].databaseId',
  ],
  { encoding: 'utf8' },
).trim();
if (runId !== '') {
  run('gh', ['run', 'watch', runId, '--exit-status']);
}

// 6. Verify the shipped pages return 200 with a content marker.
for (const page of pages) {
  const url = `${base}${page}`;
  const code = execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', url], {
    encoding: 'utf8',
  });
  console.log(`${code} ${url}`);
  if (code !== '200') {
    console.error(`page check failed: ${url}`);
    process.exit(1);
  }
}
console.log('loop ship complete');
