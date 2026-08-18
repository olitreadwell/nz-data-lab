# quality-issue-loop notes

Dated history of each iteration and the skill improvements it produced.

## 2026-08-18 (iteration 1, manual)

Generated 6 issues from a11yproject, Front-End Checklist, and OWASP
checklists (#11, #13-#17). Shipped 4 fixes via worktree fan-out: favicon
(#9), quake-map default filter (#7, root cause: 63/100 live felt quakes have
magnitude < 3 but the default filter hid them), deer chart y-axis duplicate
ticks (#2), skip-to-content link (#11). All merged to main, CI build +
type-check passed, Pages deploy verified, issues closed.

Blockers found and fixed this iteration:

- launchd environment was missing OLLAMA_CLOUD_API_KEY, so every scheduled
  `codex exec` died at startup for ~6 hours before diagnosis. Fix: write the
  provider env vars into the launchd plist EnvironmentVariables.
- The Next.js build cannot run inside a git worktree (turbopack refuses to
  resolve `next` from a symlinked/absent node_modules). Fix: worktree
  verification is type-check + lint + test; the build runs in CI on merged
  main.
- `fanout()` did not await its child processes, so every agent was reported
  as failed and the run aborted. Fix: async fanout with awaited exit codes.
- Check for uncommitted changes on main before fan-out; defer fixes whose
  files are dirty (breadcrumbs issue #8 was deferred for this reason).

Skill improvements adopted: document the launchd env requirement, the
no-build-in-worktree rule, and the dirty-tree check in SKILL.md.

## 2026-08-18 (iteration 2, launchd-triggered)

Generated #23-#27 (footer count mismatch, missing <h1> on microsite pages,
deploy-time fetchers without timeout, untested browser parsers, duplicated
hardcoded headline stats). Pooled with the open backlog, prioritized by
label, and implemented 4 fixes via worktree fan-out: error boundary leak
(#19), chart data tables for keyboard users (#18), quake map keyboard
access (#22), live-search timeout/abort (#21). All merged, CI build +
type-check green, Pages deploy verified, issues closed.

Fixes to the loop itself this iteration:

- `fanout()` awaited child exit codes AFTER spawning, so a child that had
  already exited never resolved and the whole run aborted. Fix: attach exit
  listeners at spawn time and await the captured promise.
- launchd environment is a different world: provider API keys must be in
  the plist EnvironmentVariables or every codex exec dies at startup.
- Added a triage step: every pass now reviews ALL open quality-loop issues,
  refreshes bodies and priority labels, closes stale/already-fixed issues,
  and merges duplicates (e.g. two hover-tooltip issues) into one primary.
- Generation now scores findings by severity (security/a11y = high) and
  files the highest-severity ones first, so early iterations surface more
  high-priority work.

## 2026-08-17

Generated 5 issues, merged 4 fixes (#30, #14, #32, #27).

## 2026-08-18 (report-an-issue feature)

Added a floating report-an-issue bubble to every page
(apps/web/src/components/ReportIssueButton.tsx). It opens a small dialog
(type, item, description) and builds a prefilled GitHub new-issue URL with
page URL, title, timestamp, and user agent, so the reporter reviews and
submits on GitHub (a static export cannot hold a token). Triage now reviews
ALL open issues, not just quality-loop-labeled ones, so user reports get
spec'd, labeled, prioritized, and fixed by the loop. Also fixed: GitHub
Pages does not serve .well-known paths, so security.txt ships at the root.

## 2026-08-18 (hide-first rule)

New hard rule from the user: the moment a bug is filed against a microsite,
that microsite comes off the site (highest priority) and stays hidden until
the fix ships. Implemented:

- `apps/web/src/lib/hidden-microsites.ts` — `HIDDEN_MICROSITES` array plus
  `withHiddenMicrositesRemoved`; `microsites.ts` filters through it, so a
  hidden slug disappears from the home grid, the report-button item list,
  and `generateStaticParams` (direct URLs 404).
- Home page (`apps/web/src/app/page.tsx`) refactored from 14 hardcoded card
  blocks to a filtered card list so hiding one cannot crash the build.
- Loop script: triage verdicts can carry `microsite` + `hide`; the script
  hides (commit + push + deploy) immediately during triage. Fan-out agents
  un-hide as part of the fix.
- Applied: #154 (shake-index map z-index over the report dialog) -> shake-index
  hidden, verified 404 on the deployed site; fix pending in the loop.
