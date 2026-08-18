# viz-001 Population since 1840

Self-contained spec for the `[viz-001] Population since 1840` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: Stats NZ population estimates and census counts (https://www.stats.govt.nz/topics/population/)
- **Story**: New Zealand went from a few thousand settlers to 5.3 million people, with the growth curve bending at every migration wave.
- **Interaction**: hover to read any year; toggle census vs estimate series.
- **Critique**: strength is the long arc and the 1840-1900 estimates are the risk, they are rough and need a data note.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Assert latest 5.0-5.5 M; monotonic growth with a data note on pre-1900 estimates.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
