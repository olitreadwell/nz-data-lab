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
