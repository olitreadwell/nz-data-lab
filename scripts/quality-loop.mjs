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

function codexExec(cwd, prompt) {
  return spawn(
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
      '',
      `Commit with a Conventional Commit message referencing the issue, e.g. "fix: add skip link (#${number})".`,
      'Do NOT push, do NOT merge, do NOT create a PR.',
    ].join('\n');
    jobs.push({ number, branch, worktree, child: codexExec(worktree, prompt) });
  }

  const failed = [];
  for (const job of jobs) {
    const code = await awaitExit(job.child);
    if (code !== 0) {
      failed.push(job.number);
      console.error(`worktree agent failed for #${job.number} (exit ${code})`);
    }
  }
  if (failed.length > 0) {
    throw new Error(`implementation failed for issues: ${failed.join(', ')}`);
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
      console.error(`merge failed for #${job.number}: ${error.message}`);
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

function awaitExit(child) {
  return new Promise((resolve) => {
    child.on('exit', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });
}

function reviewLoop(summary) {
  mkdirSync(SKILL_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
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
} else if (mode === 'fanout') {
  if (rest.length === 0) {
    console.error('usage: node scripts/quality-loop.mjs fanout <issue-number>...');
    process.exit(1);
  }
  await fanout(rest.map(Number));
} else if (mode === 'full') {
  const created = generateIssues(5);
  const rank = { high: 0, medium: 1, low: 2 };
  const open = JSON.parse(
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
  const pool = [
    ...created.map((number) => ({
      number,
      labels: [{ name: 'priority-low' }],
    })),
    ...open.filter((entry) => !created.includes(entry.number)),
  ];
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
  console.error('usage: node scripts/quality-loop.mjs generate|fanout|full');
  process.exit(1);
}
