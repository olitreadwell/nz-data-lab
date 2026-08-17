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

1. **Research (5 min)**: pick one NZ data source from `@nzlab/nz-sources`
   adapters (GeoNet, DigitalNZ, data.govt.nz, TradeMe, NZOR, LINZ) or a
   Stats NZ table already wired in `apps/web/src/lib/`. Fan out with parallel
   subagents when the story needs external facts. Verify every reference URL
   returns 200 before linking it. Never fabricate a stat.
2. **Story (2 min)**: one short story, oli-style copy (no em dashes, no
   puffery, real verified numbers, named sources). One microsite per loop.
3. **Build (8 min)**: a new microsite under `apps/web/src/app/microsites/`
   with a chart type not already used on the site (line, area, bar, scatter,
   bubble, slope, timeline, map). Make it interactive or adjustable: a
   slider, a toggle, a search, a brush, or a filter. Reuse
   `MicrositeStory`, `StatCard`, `MicrositeReferences`, and the accent
   system. Add a unit test per new component.
4. **Verify (3 min)**: `npx tsc --noEmit` and `npx vitest run` in
   `apps/web`, lint the changed files. Fix errors before merging.
5. **Ship (2 min)**: worktree + branch, commit with a Conventional Commit
   message, merge to `main`, push, watch the Pages deploy, curl the new
   page for 200 and for a content marker.
6. **Changelog (1 min)**: append a dated entry to `CHANGELOG.md` in the
   same commit as the microsite.
7. **Review (1 min)**: read the last loop's notes, list what slowed it down,
   and update this skill with one concrete improvement. Keep the skill
   short; delete rules that no longer pay for themselves.

## Hard rules

- One microsite per loop, one chart type per microsite, no repeated chart
  types across the site unless the story demands it.
- Every number in the copy must come from the data or a verified source.
- Every reference URL must return 200 (curl before commit).
- No `console.log`, no `any`, explicit return types, npm only.
- Never delete or weaken a failing test to get green.
- If a loop fails three times on the same blocker, stop, document the
  blocker in the changelog, and ask the user one precise question.

## Loop review checklist (step 7)

- What took longest? (research, build, verify, deploy)
- Did the chart type repeat? Did the copy need rewriting?
- Did any reference URL 404 after deploy?
- Did the worktree/branch flow add friction? Would a script help?
- Is there a new adapter or fixture worth adding to `@nzlab/nz-sources`?
