#!/usr/bin/env node
/**
 * Quality-issue loop mechanics: generate issues, fan out fixes across git
 * worktrees, verify, merge, deploy, close. The LLM work (issue writing,
 * prioritization, implementation, loop review) is done by `codex exec`; this
 * script is the mechanical part of skills/quality-issue-loop/SKILL.md.
 *
 * Usage:
 *   node scripts/quality-loop.mjs generate [--count N]
 *   node scripts/quality-loop.mjs fanout <issue-number>...
 *   node scripts/quality-loop.mjs full
 */
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const WORKTREES = path.join(ROOT, '.worktrees');
const REPO = 'olitreadwell/nz-data-lab';
const DEPLOY_WORKFLOW = 'deploy_github_pages.yml';
const SKILL_DIR = path.join(ROOT, 'skills', 'quality-issue-loop');
const NOTES_FILE = path.join(SKILL_DIR, 'LOOP-NOTES.md');
const CHECKLIST_URLS = [
  'https://www.a11yproject.com/checklist/',
  'https://devchecklists.com/en',
  'https://github.com/thedaviddias/Front-End-Checklist',
  'https://github.com/shieldfy/API-Security-Checklist',
  'https://github.com/huyingjie/Checklist-Checklist',
  'https://github.com/thedaviddias/Front-End-Performance-Checklist',
  'https://github.com/Az0x7/vulnerability-Checklist',
  'https://github.com/tanprathan/OWASP-Testing-Checklist',
  'https://github.com/thedaviddias/Front-End-Design-Checklist',
  'https://github.com/Heydon/inclusive-design-checklist',
  'https://frontendchecklist.io/',
  'https://github.com/antarestupin/performance-checklist',
  'https://github.com/0xRadi/OWASP-Web-Checklist',
];

function run(command, args, cwd = ROOT) {
  console.log(`$ ${command} ${args.join(' ')}`);
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function runCapture(command, args, cwd = ROOT) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Labels the loop must never touch: curated backlogs, not bugs. */
const PROTECTED_LABELS = ['data-viz-idea', 'data-tutorial', 'microsite-review'];

const HIDDEN_FILE = path.join(ROOT, 'apps/web/src/lib/hidden-microsites.ts');

function readHiddenSlugs() {
  const source = readFileSync(HIDDEN_FILE, 'utf8');
  const match = source.match(/HIDDEN_MICROSITES: string\[\] = \[([^\]]*)\]/);
  if (match === null) {
    throw new Error('cannot parse hidden-microsites.ts');
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
}

function writeHiddenSlugs(slugs) {
  const source = readFileSync(HIDDEN_FILE, 'utf8');
  const body = slugs.length > 0 ? `\n${slugs.map((slug) => `  '${slug}',`).join('\n')}\n` : ' ';
  const next = source.replace(
    /HIDDEN_MICROSITES: string\[\] = \[[^\]]*\]/,
    `HIDDEN_MICROSITES: string[] = [${body}]`,
  );
  writeFileSync(HIDDEN_FILE, next);
}

/** Hide-first rule: a microsite with an open bug is taken off the site now. */
function hideMicrosite(slugsCsv) {
  const micrositesSource = readFileSync(path.join(ROOT, 'apps/web/src/lib/microsites.ts'), 'utf8');
  const validSlugs = [...micrositesSource.matchAll(/slug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
  const requested = slugsCsv
    .split(',')
    .map((slug) => slug.trim())
    .filter((slug) => validSlugs.includes(slug));
  if (requested.length === 0) {
    console.log(`hide skipped: no valid microsite slug in "${slugsCsv}"`);
    return;
  }
  const slugs = readHiddenSlugs();
  const added = requested.filter((slug) => !slugs.includes(slug));
  if (added.length === 0) {
    console.log(`already hidden: ${requested.join(', ')}`);
    return;
  }
  writeHiddenSlugs([...slugs, ...added]);
  run('git', ['add', 'apps/web/src/lib/hidden-microsites.ts']);
  run('git', ['commit', '-m', `fix: hide ${added.join(',')} microsite while its bug is open`]);
  run('git', ['push', 'origin', 'main']);
  console.log(`HIDDEN microsite: ${added.join(', ')}`);
}

/** Removes worktrees whose branch is already merged into main and whose tree is clean. */
function pruneMergedWorktrees() {
  const lines = runCapture('git', ['worktree', 'list', '--porcelain']).split('\n');
  const entries = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('worktree ')) {
      current = { path: line.slice('worktree '.length) };
      entries.push(current);
    } else if (line.startsWith('branch ')) {
      current.branch = line.slice('branch refs/heads/'.length);
    }
  }
  let pruned = 0;
  for (const entry of entries) {
    if (entry.path === ROOT || entry.branch === undefined) {
      continue;
    }
    let merged = false;
    try {
      runCapture('git', ['merge-base', '--is-ancestor', entry.branch, 'main']);
      merged = true;
    } catch {
      merged = false;
    }
    if (!merged) {
      continue;
    }
    const dirty = runCapture('git', ['-C', entry.path, 'status', '--porcelain']).length > 0;
    if (dirty) {
      console.log(`skip prune ${entry.branch}: worktree has uncommitted changes`);
      continue;
    }
    run('git', ['worktree', 'remove', '--force', entry.path]);
    run('git', ['branch', '-d', entry.branch]);
    pruned += 1;
    console.log(`pruned merged worktree: ${entry.branch}`);
  }
  if (pruned === 0) {
    console.log('no merged worktrees to prune');
  }
}

function codexExec(cwd, prompt) {
  const child = spawn(
    'codex',
    [
      'exec',
      '-C',
      cwd,
      '--ephemeral',
      '-s',
      'danger-full-access',
      '--dangerously-bypass-approvals-and-sandbox',
      prompt,
    ],
    { stdio: 'inherit' },
  );
  const exited = new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
  return { child, exited };
}

function ghIssue(number) {
  const json = runCapture('gh', [
    'issue',
    'view',
    String(number),
    '--repo',
    REPO,
    '--json',
    'title,body',
  ]);
  return JSON.parse(json);
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function createIssue(title, body, priority) {
  const args = [
    'issue',
    'create',
    '--repo',
    REPO,
    '--title',
    title,
    '--body',
    body,
    '--label',
    'quality-loop',
  ];
  if (priority !== undefined) {
    args.push('--label', `priority-${priority}`);
  }
  const url = runCapture('gh', args);
  const number = url.match(/\/(\d+)$/)?.[1];
  console.log(`created #${number}: ${title}`);
  return number;
}

function generateIssues(count) {
  const prompt = [
    `You are the issue generator for the quality-issue-loop in the nz-data-lab repo at ${ROOT}.`,
    'Scan the actual repo code (apps/web, packages/ui, packages/nz-sources, configs, workflows).',
    'Apply these checklists to find real, verifiable gaps:',
    ...CHECKLIST_URLS.map((url) => `- ${url}`),
    '- 12-factor app (https://12factor.net), clean code, and testing practices',
    '',
    'First run `gh issue list --repo olitreadwell/nz-data-lab --state open --json title`',
    'and skip any finding that is already an open issue (avoid duplicates).',
    'Also make sure the issues you write do not overlap each other: one root cause',
    'gets one issue, even if it shows up in several files.',
    'Score every candidate finding by severity and file the highest-severity ones:',
    'security and accessibility findings are high priority, correctness/robustness',
    'and performance are medium, polish/docs/tests are low. Early iterations should',
    'surface mostly high and medium findings.',
    `Write exactly ${count} detailed GitHub issues. Each issue must:`,
    '- name the exact file(s) and line(s) the finding is in (verify by reading the code)',
    '- state the checklist item it maps to and the URL',
    '- give repro steps or the failing check',
    '- give concrete acceptance criteria',
    '- be small enough for one agent to fix in one worktree',
    '',
    'Output ONLY a JSON array, no prose, no markdown fences:',
    '[{"title": "...", "body": "...", "priority": "high|medium|low"}]',
  ].join('\n');
  const out = runCapture('codex', [
    'exec',
    '-C',
    ROOT,
    '--ephemeral',
    '-s',
    'danger-full-access',
    '--dangerously-bypass-approvals-and-sandbox',
    prompt,
  ]);
  const start = out.indexOf('[');
  const end = out.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error(`codex exec did not return a JSON array:\n${out.slice(0, 500)}`);
  }
  const issues = JSON.parse(out.slice(start, end + 1));
  const created = [];
  for (const issue of issues) {
    created.push(createIssue(issue.title, issue.body, issue.priority));
  }
  return created;
}

async function triageIssues() {
  const open = JSON.parse(
    runCapture('gh', [
      'issue',
      'list',
      '--repo',
      REPO,
      '--state',
      'open',
      '--json',
      'number,title,body,labels',
    ]),
  );
  if (open.length === 0) {
    console.log('no open quality-loop issues to triage');
    return;
  }
  const compact = open.map((issue) => ({
    number: issue.number,
    title: issue.title,
    labels: (issue.labels ?? []).map((label) => label.name),
    body: (issue.body ?? '').split('\n').slice(0, 6).join(' | ').slice(0, 400),
  }));
  const prompt = [
    `You are the triage agent for the quality-issue-loop in the nz-data-lab repo at ${ROOT}.`,
    'Below is a COMPACT summary of every open issue (body truncated). Run',
    '`gh issue view <number> --repo olitreadwell/nz-data-lab --json body` to read',
    'the full body of any issue you need to judge deeply.',
    'For EACH issue:',
    '- NEVER touch issues carrying a protected label (data-viz-idea,',
    '  data-tutorial): they are curated backlogs, not bugs. Do not close,',
    '  edit, or relabel them.',
    '- skip bot/dependency-dashboard issues (e.g. renovate, Dependency Dashboard)',
    '- read the code it references and decide whether the finding is STILL VALID',
    '- if it is already fixed, obsolete, or out of scope, mark action "close"',
    '- otherwise refresh the body into a fixable spec: current file/line references,',
    '  what the code does today, and updated acceptance criteria. Do not invent findings.',
    '- reassign priority: security and accessibility = "high",',
    '  correctness/robustness/perf = "medium", polish/docs/tests = "low"',
    '- propose a fresh TITLE: short, specific, lowercase-first, no issue number,',
    '  e.g. "add robots.txt and sitemap.xml" or "fix deer chart y-axis labels"',
    '',
    'Then find DUPLICATES: issues with the same root cause or overlapping files.',
    'For each duplicate group pick one primary issue (broadest, clearest scope),',
    'merge every group member acceptance criterion into its body (action "update"),',
    'and close the rest (action "close", reason "Duplicate of #<primary number>").',
    '',
    `Issues: ${JSON.stringify(compact)}`,
    '',
    'For any issue whose bug makes a specific microsite broken or unsafe',
    '  (rendering bugs, wrong or missing data, security), add',
    '  "microsite": "<slug-or-comma-separated-slugs>" and "hide": true',
    '  (hide-first rule). NEVER hide for enhancements, a11y improvements,',
    '  perf, or polish issues: those get fixed in place.',
    'Output ONLY a JSON array, no prose, no fences:',
    '[{"number": 13, "action": "update|close", "title": "...", "body": "...", "priority": "high|medium|low", "microsite": "shake-index", "hide": true, "reason": "..."}]',
  ].join('\n');
  const out = runCapture('codex', [
    'exec',
    '-C',
    ROOT,
    '--ephemeral',
    '-s',
    'danger-full-access',
    '--dangerously-bypass-approvals-and-sandbox',
    prompt,
  ]);
  const start = out.indexOf('[');
  const end = out.lastIndexOf(']');
  if (start === -1 || end === -1) {
    throw new Error(`triage codex exec did not return a JSON array:\n${out.slice(0, 500)}`);
  }
  const verdicts = JSON.parse(out.slice(start, end + 1));
  for (const verdict of verdicts) {
    const number = String(verdict.number);
    const issueLabels = open.find((issue) => String(issue.number) === number)?.labels ?? [];
    if (issueLabels.some((label) => PROTECTED_LABELS.includes(label.name))) {
      console.log(
        `skip #${number}: protected label ${PROTECTED_LABELS.filter((name) => issueLabels.some((label) => label.name === name)).join('/')} is never touched`,
      );
      continue;
    }
    if (verdict.action === 'close') {
      run('gh', [
        'issue',
        'close',
        number,
        '--repo',
        REPO,
        '--comment',
        `Triage: ${verdict.reason ?? 'no longer valid'}`,
      ]);
      console.log(`triage closed #${number}: ${verdict.reason ?? 'stale'}`);
      continue;
    }
    const editArgs = [
      'issue',
      'edit',
      number,
      '--repo',
      REPO,
      '--body',
      verdict.body,
      '--add-label',
      'quality-loop',
    ];
    if (verdict.title !== undefined) {
      editArgs.push('--title', verdict.title);
    }
    run('gh', editArgs);
    if (verdict.priority !== undefined) {
      const target = `priority-${verdict.priority}`;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        run('gh', [
          'issue',
          'edit',
          number,
          '--repo',
          REPO,
          '--remove-label',
          'priority-high',
          '--remove-label',
          'priority-medium',
          '--remove-label',
          'priority-low',
          '--add-label',
          target,
        ]);
        const labels = JSON.parse(
          runCapture('gh', ['issue', 'view', number, '--repo', REPO, '--json', 'labels']),
        ).labels.map((label) => label.name);
        if (labels.includes(target)) {
          break;
        }
        await sleep(2000);
      }
    }
    console.log(`triage updated #${number} (priority-${verdict.priority ?? 'unchanged'})`);
    if (verdict.hide === true && verdict.microsite !== undefined) {
      hideMicrosite(verdict.microsite);
    }
  }
}

async function fanout(issueNumbers) {
  mkdirSync(WORKTREES, { recursive: true });
  const jobs = [];
  for (const number of issueNumbers) {
    const issue = ghIssue(number);
    const branch = `fix/${slugify(issue.title)}`;
    const worktree = path.join(WORKTREES, branch);
    if (existsSync(worktree)) {
      run('git', ['worktree', 'remove', '--force', worktree]);
    }
    run('git', ['worktree', 'add', '-b', branch, worktree, 'main']);
    const prompt = [
      `You are implementing GitHub issue #${number} in this git worktree (${worktree}).`,
      `Title: ${issue.title}`,
      `Body: ${issue.body ?? ''}`,
      '',
      'Repo rules: npm only (never pnpm/bun/yarn), no console.log, no `any`,',
      'explicit return types on exported functions, single quotes, 2-space indent,',
      '100-char lines. Never delete or weaken a failing test to get green.',
      '',
      'Implement the fix. Then verify in this worktree:',
      '  npm run type-check --workspace=@nzlab/web',
      '  npm run lint --workspace=@nzlab/web',
      '  npm test --workspace=@nzlab/web',
      'The Next.js build cannot run inside a git worktree (turbopack cannot',
      'resolve `next` from a worktree), so skip `npm run build` here; CI runs the',
      'build on the merged main. Fix any failures. Add or update a unit test when',
      'the fix changes behavior.',
      'If this issue names a microsite and that slug is listed in',
      'apps/web/src/lib/hidden-microsites.ts, remove it from that array as',
      'part of the fix (the fix makes the microsite safe to show again).',
      '',
      `Commit with a Conventional Commit message referencing the issue, e.g. "fix: add skip link (#${number})".`,
      'Do NOT push, do NOT merge, do NOT create a PR.',
    ].join('\n');
    jobs.push({ number, branch, worktree, ...codexExec(worktree, prompt) });
  }

  const failed = [];
  for (const job of jobs) {
    const code = await job.exited;
    if (code !== 0) {
      failed.push(job.number);
      console.error(`worktree agent failed for #${job.number} (exit ${code})`);
    }
  }
  if (failed.length > 0) {
    throw new Error(`implementation failed for issues: ${failed.join(', ')}`);
  }

  /** Parses the hidden microsite slugs out of hidden-microsites.ts source. */
  function parseHiddenSlugs(source) {
    return [...source.matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
  }

  /**
   * Resolves a merge conflict in hidden-microsites.ts as the 3-way union of
   * changes: slugs kept by both sides stay, slugs removed by either side go,
   * slugs added by a side come back. Every fan-out fix that un-hides a
   * microsite edits this same list, so sequential merges of same-base branches
   * always collide here. Returns true when the conflict was resolved and the
   * merge completed; false (after aborting cleanly) otherwise.
   */
  function resolveHiddenMicrositesConflict() {
    const status = runCapture('git', ['status', '--porcelain']);
    if (!status.includes('UU apps/web/src/lib/hidden-microsites.ts')) {
      return false;
    }
    const baseSource = runCapture('git', ['show', ':1:apps/web/src/lib/hidden-microsites.ts']);
    const ours = new Set(
      parseHiddenSlugs(runCapture('git', ['show', ':2:apps/web/src/lib/hidden-microsites.ts'])),
    );
    const theirs = new Set(
      parseHiddenSlugs(runCapture('git', ['show', ':3:apps/web/src/lib/hidden-microsites.ts'])),
    );
    const base = new Set(parseHiddenSlugs(baseSource));
    const resolved = [...new Set([...ours, ...theirs])].filter((slug) => {
      if (base.has(slug)) {
        return ours.has(slug) && theirs.has(slug);
      }
      return ours.has(slug) || theirs.has(slug);
    });
    const body =
      resolved.length > 0 ? `\n${resolved.map((slug) => `  '${slug}',`).join('\n')}\n` : ' ';
    const next = baseSource.replace(
      /HIDDEN_MICROSITES: string\[\] = \[[^\]]*\]/,
      `HIDDEN_MICROSITES: string[] = [${body}]`,
    );
    writeFileSync(HIDDEN_FILE, next);
    run('git', ['add', HIDDEN_FILE]);
    const remaining = runCapture('git', ['status', '--porcelain'])
      .split('\n')
      .filter((line) => line.startsWith('UU '));
    if (remaining.length > 0) {
      run('git', ['merge', '--abort']);
      console.error(
        `merge conflict beyond hidden-microsites.ts in: ${remaining.join(', ')}; aborted`,
      );
      return false;
    }
    run('git', ['commit', '--no-edit']);
    console.log('auto-resolved hidden-microsites.ts merge conflict');
    return true;
  }

  // Belt-and-braces verify, then merge sequentially.
  const merged = [];
  for (const job of jobs) {
    try {
      run('npm', ['run', 'type-check', '--workspace=@nzlab/web'], job.worktree);
      run('npm', ['test', '--workspace=@nzlab/web'], job.worktree);
    } catch (error) {
      console.error(`verify failed for #${job.number}: ${error.message}`);
      continue;
    }
    try {
      run('git', ['checkout', 'main']);
      run('git', ['merge', '--no-ff', job.branch, '-m', `merge: fix #${job.number}`]);
      const sha = runCapture('git', ['rev-parse', 'HEAD']);
      run('git', ['worktree', 'remove', job.worktree]);
      run('git', ['branch', '-d', job.branch]);
      merged.push({ number: job.number, sha });
    } catch (error) {
      if (resolveHiddenMicrositesConflict()) {
        const sha = runCapture('git', ['rev-parse', 'HEAD']);
        run('git', ['worktree', 'remove', job.worktree]);
        run('git', ['branch', '-d', job.branch]);
        merged.push({ number: job.number, sha });
      } else {
        console.error(`merge failed for #${job.number}: ${error.message}`);
      }
    }
  }
  if (merged.length === 0) {
    throw new Error('no issues merged');
  }

  run('git', ['push', 'origin', 'main']);
  const runId = runCapture('gh', [
    'run',
    'list',
    '--workflow',
    DEPLOY_WORKFLOW,
    '--limit',
    '1',
    '--json',
    'databaseId',
    '-q',
    '.[0].databaseId',
  ]);
  if (runId !== '') {
    run('gh', ['run', 'watch', runId, '--exit-status']);
  }

  for (const { number, sha } of merged) {
    run('gh', ['issue', 'close', String(number), '--repo', REPO, '--comment', `Fixed in ${sha}.`]);
  }
  return merged;
}

function reviewLoop(summary) {
  mkdirSync(SKILL_DIR, { recursive: true });
  const date = new Date().toLocaleDateString('en-CA');
  const entry = `\n## ${date}\n\n${summary}\n`;
  if (!existsSync(NOTES_FILE)) {
    writeFileSync(
      NOTES_FILE,
      `# quality-issue-loop notes\n\nDated history of each iteration and the skill improvements it produced.\n`,
    );
  }
  appendFileSync(NOTES_FILE, entry);
  console.log(`appended loop notes to ${NOTES_FILE}`);
}

const [mode, ...rest] = process.argv.slice(2);
if (mode === 'generate') {
  const countIndex = rest.indexOf('--count');
  const count = countIndex !== -1 ? Number(rest[countIndex + 1]) : 5;
  generateIssues(count);
} else if (mode === 'triage') {
  await triageIssues();
} else if (mode === 'prune') {
  pruneMergedWorktrees();
} else if (mode === 'fanout') {
  if (rest.length === 0) {
    console.error('usage: node scripts/quality-loop.mjs fanout <issue-number>...');
    process.exit(1);
  }
  await fanout(rest.map(Number));
} else if (mode === 'full') {
  pruneMergedWorktrees();
  const created = generateIssues(5);
  await triageIssues();
  const rank = { high: 0, medium: 1, low: 2 };
  const pool = JSON.parse(
    runCapture('gh', [
      'issue',
      'list',
      '--repo',
      REPO,
      '--label',
      'quality-loop',
      '--state',
      'open',
      '--json',
      'number,labels',
    ]),
  ).map((issue) => ({ number: issue.number, labels: issue.labels ?? [] }));
  const prioritized = pool
    .map((entry) => {
      const label = (entry.labels ?? []).find((candidate) =>
        candidate.name.startsWith('priority-'),
      );
      const priority = label?.name.replace('priority-', '') ?? 'low';
      return { number: entry.number, priority };
    })
    .sort((a, b) => (rank[a.priority] ?? 2) - (rank[b.priority] ?? 2))
    .map((entry) => entry.number);
  const merged = await fanout(prioritized.slice(0, 4));
  reviewLoop(
    `Generated ${created.length} issues, merged ${merged.length} fixes (${merged
      .map((m) => `#${m.number}`)
      .join(', ')}).`,
  );
} else {
  console.error('usage: node scripts/quality-loop.mjs generate|triage|prune|fanout|full');
  process.exit(1);
}
