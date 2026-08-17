# quality-issue-loop

A 10-minute autonomous loop that turns quality checklists into shipped
fixes: generate detailed GitHub issues, prioritize, fan out implementation
across git worktrees, verify, merge with passing build and CI into `main`,
deploy, close the issues, then improve this skill. Versioned in the repo so
every iteration makes the next one faster.

## When to use

- The user asks to "loop quality issues", "fan out and fix issues", "keep
  improving the app", or "run the quality loop".
- A checklist-driven improvement backlog needs to become shipped fixes.

## Research sources (the issue generator's checklists)

- https://www.a11yproject.com/checklist/
- https://devchecklists.com/en
- https://github.com/thedaviddias/Front-End-Checklist
- https://github.com/shieldfy/API-Security-Checklist
- https://github.com/huyingjie/Checklist-Checklist
- https://github.com/thedaviddias/Front-End-Performance-Checklist
- https://github.com/Az0x7/vulnerability-Checklist
- https://github.com/tanprathan/OWASP-Testing-Checklist
- https://github.com/thedaviddias/Front-End-Design-Checklist
- https://github.com/Heydon/inclusive-design-checklist
- https://frontendchecklist.io/
- https://github.com/antarestupin/performance-checklist
- https://github.com/0xRadi/OWASP-Web-Checklist
- 12-factor app (https://12factor.net), clean code, and testing practices

## Loop contract (one iteration, ~10 minutes)

1. **Generate (2 min)**: scan the repo against the checklists, write detailed
   issues (repro steps, checklist reference, acceptance criteria), create
   them with `gh issue create --label quality-loop`. Never fabricate a
   finding: verify each one against real code or a live check.
2. **Prioritize (1 min)**: security > accessibility > correctness > perf >
   polish. Small, high-value, single-file fixes first. Pick 3-4 per batch.
   Skip issues whose files have uncommitted changes on `main` (concurrent
   work) or defer them to a later loop.
3. **Fan out (4 min)**: one worktree + feature branch per issue, one
   `codex exec` per worktree in parallel. Each agent implements, verifies,
   and commits. `node scripts/quality-loop.mjs fanout <issue-number>...`
   drives the mechanics.
4. **Verify (1 min)**: type-check, lint, unit tests, and build per worktree
   before merge. Never merge a failing worktree.
5. **Merge (1 min)**: sequential `--no-ff` merges to `main`, push, watch the
   Pages deploy, curl the touched pages for 200.
6. **Close (1 min)**: close each issue with the merge commit SHA.
7. **Review (1 min)**: read the last loop's notes, list what slowed it down,
   and update this skill with one concrete improvement. Keep the skill
   short; delete rules that no longer pay for themselves.

## Hard rules

- npm only, never pnpm/bun/yarn. No `console.log`, no `any`, explicit return
  types, single quotes, 2-space indent, 100-char lines.
- Never run `npm run build` inside a worktree: Next.js turbopack cannot
  resolve `next` from a worktree. Worktree verification is type-check, lint,
  and unit tests; the build runs in CI on merged main.
- The launchd plist must pass the model provider env vars
  (OLLAMA_CLOUD_API_KEY etc.) or every `codex exec` dies before doing work.
- Fan-out agents run in parallel worktrees and must be awaited with their
  real exit codes; an un-awaited child looks like a failed agent.
- Never delete or weaken a failing test to get green.
- Never fabricate a data source, a stat, or a "this worked" claim.
- Every reference URL in an issue or fix must return 200 (curl before
  commit).
- Check `git status` on `main` before fan-out. If the working tree is dirty,
  only touch files that are clean; defer fixes that would clobber concurrent
  work.
- If a loop fails three times on the same blocker, stop, document the
  blocker in `LOOP-NOTES.md`, and ask the user one precise question.

## Loop review checklist (step 7)

- What took longest? (generate, fan out, verify, merge, deploy)
- Did any issue turn out to be unfixable or already fixed? Why?
- Did any worktree merge conflict or clobber concurrent work?
- Did the checks catch anything before CI? Did CI catch anything after?
- Is there a new checklist item or a new script improvement worth adding?

## Loop notes

See `LOOP-NOTES.md` for the dated history of each iteration and the skill
improvements it produced.
