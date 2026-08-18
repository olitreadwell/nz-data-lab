# viz-011 Electricity generation by source

Self-contained spec for the `[viz-011] Electricity generation by source` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: area (streamgraph)
- **Source**: MBIE energy statistics (https://www.mbie.govt.nz/)
- **Story**: The generation stack shows hydro holding the base while gas, wind, and solar trade places on top.
- **Interaction**: source toggle; hover.
- **Critique**: strength is the stacked composition story; risk is that small sources become unreadable, so cap the stack.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
