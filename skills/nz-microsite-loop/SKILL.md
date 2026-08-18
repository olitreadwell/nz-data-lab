# nz-microsite-loop

A 20-minute autonomous loop that turns NZ public data into a new microsite:
research, build, test, merge, deploy, changelog, then review the loop itself
and improve this skill. Versioned in the repo so every iteration can make the
next one faster.

## When to use

- The user asks to "loop", "fan out and build microsites", or "keep shipping
  data stories".
- A new NZ data source or story idea needs to become a shipped microsite.

## Loop contract (one iteration, ~20 minutes)

Aim for 2-3 microsites per loop, batched in one worktree branch with one
commit per microsite, then one merge and one deploy.

1. **Research (5 min)**: pick 2-3 open `data-viz-idea` issues
   (`gh issue list --label data-viz-idea --state open`), highest priority
   first (`priority-high`, then `priority-medium`, then `priority-low`;
   tie-break by the order in `docs/backlog/data-viz-ideas-smoke-ranked.md`).
   Read the issue's own spec doc under `docs/backlog/data-viz-ideas/`
   (`viz-0XX-<slug>.md`) for the full spec; the issue body is the summary.
   Fan out with parallel subagents when the stories need external facts.
   Verify every reference URL returns 200 before linking it. Never fabricate
   a stat.
2. **Stories (2 min)**: one short story per microsite, oli-style copy (no
   em dashes, no puffery, real verified numbers, named sources).
3. **Build (8 min)**: one new microsite per source under
   `apps/web/src/app/microsites/`. Each needs a chart type not already used
   on the site (line, area, bar, scatter, bubble, slope, timeline, map) and
   an interaction: a slider, a toggle, a search, a brush, or a filter.
   Reuse `MicrositeStory`, `StatCard`, `MicrositeReferences`, and the
   accent system. Add a unit test per new component.
4. **Verify (3 min)**: `npx tsc --noEmit` and `npx vitest run` in
   `apps/web`, lint the changed files. Fix errors before merging.
5. **Hand off (2 min)**: worktree + branch, one Conventional Commit per
   microsite, verify, then push the branch to `origin` and file one
   `microsite-review` issue per microsite instead of merging. The issue body
   names the branch, the spec doc, what was verified, and the smoke
   assertions; the quality loop reviews and merges it. Do not merge to
   `main`, do not close the `data-viz-idea` issue, do not deploy. Before
   pushing, run `git fetch origin` and rebase the branch onto `origin/main`
   if it moved while you built: the launchd quality loop commits to `main`
   concurrently, and a stale base makes the merge fight the new code. Push
   fast-forward when `origin/main` is an ancestor of your branch; only
   rebase when the tree is clean, and never rebase with unstaged changes.
   In a fresh worktree, run `npm install` before the checks: symlinking the
   main repo's `node_modules` into the worktree breaks vitest's esbuild
   with "too many levels of symbolic links". After pushing, `cd` to the
   main repo and remove the worktree so the next iteration starts clean.
   Issue template:
   `gh issue create --label microsite-review --label priority-<tier> --title "microsite-review: <slug> (<viz-id>)" --body "Branch: <branch>\nSpec: docs/backlog/data-viz-ideas/<viz-id>-<slug>.md\nVerified: tsc, vitest, lint\nSmoke: <assertions>\nReview and merge to main, curl the page for 200, then close this issue and the data-viz-idea issue."`
6. **Changelog (1 min)**: append one dated entry to `CHANGELOG.md` listing
   every microsite handed off in the loop, with its branch and issue number.
7. **Prune (1 min)**: before the wrap-up (compact), run
   `scripts/prune-loop-artifacts.sh` once. It removes merged
   `feat/microsite-loop-*` worktrees and branches and kills stale agent
   processes left inside them by stalled runs. It never touches `fix/*`
   (the quality loop's active lane) or `main`, and it skips dirty worktrees
   so a stalled agent's in-progress work is never destroyed. Make sure any
   subagents you spawned have finished before you wrap up.
8. **Review (1 min)**: read the last loop's notes, list what slowed it down,
   and update this skill with one concrete improvement. Keep the skill
   short; delete rules that no longer pay for themselves.

## Hard rules

- Every microsite must come from an open `data-viz-idea` issue; never build
  a microsite outside the issue queue.
- Microsites are handed off unmerged as `microsite-review` issues; the
  quality loop merges them. Never merge a microsite to `main` yourself.
- 2-3 microsites per loop, one chart type per microsite, no repeated chart
  types across the site unless the story demands it. Keep a running list of
  chart types used in the changelog so the next loop picks a fresh one.
- Every number in the copy must come from the data or a verified source.
- Every reference URL must return 200 (curl before commit).
- No `console.log`, no `any`, explicit return types, npm only.
- Never delete or weaken a failing test to get green.
- If a loop fails three times on the same blocker, stop, document the
  blocker in the changelog, and ask the user one precise question.

## Self-healing (the loop fixes itself)

The wrapper (`scripts/run-microsite-loop.sh`) tracks consecutive skips in
`~/Library/Logs/nz-microsite-loop-state.json`. After 3 skips in a row it
stops waiting and spawns a "heal the loop" session
(`scripts/heal-loop-prompt.txt`) that:

1. Reads the log and state file to find the blocker.
2. Fixes the root cause in the wrapper, the skill, or `.gitignore`.
3. Records the lesson in this skill.
4. Commits and pushes the fix, then runs one normal iteration if possible.

This is why the review step is not only for shipped loops: a loop that
cannot ship must still be able to improve itself. If a blocker repeats,
fix the guard or the skill rather than working around it by hand.

## Known blockers

- The quality loop appends its daily notes to
  `skills/quality-issue-loop/LOOP-NOTES.md` and does not always commit them
  before its iteration ends. An uncommitted notes entry used to make the
  dirty-main guard skip every tick; the wrapper now excludes that file (like
  `next-env.d.ts`), so notes left behind never block this loop. Git still
  refuses a merge that would overwrite a dirty file, so the safety net stays
  intact. If the loop skips for a dirty main again, the wrapper logs the
  dirty file list, so read that line before changing the guard.

## Loop review checklist (step 8)

- What took longest? (research, build, verify, deploy)
- Did the chart type repeat? Did the copy need rewriting?
- Did any reference URL 404 after deploy?
- Did the worktree/branch flow add friction? Would a script help?
- Is there a new adapter or fixture worth adding to `@nzlab/nz-sources`?
