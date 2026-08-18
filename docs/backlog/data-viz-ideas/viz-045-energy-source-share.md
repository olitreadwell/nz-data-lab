# viz-045 Energy source share

Self-contained spec for the `[viz-045] Energy source share` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: donut
- **Source**: MBIE energy statistics (https://www.mbie.govt.nz/)
- **Story**: Oil is the single biggest energy source, ahead of electricity, and most of it is petrol and diesel.
- **Interaction**: slice expand; hover.
- **Critique**: strength is the oil dependence; risk is that primary energy and electricity are easy to confuse.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
