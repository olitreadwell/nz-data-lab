# viz-084 Electricity demand by hour

Self-contained spec for the `[viz-084] Electricity demand by hour` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial
- **Source**: Transpower (https://www.transpower.co.nz/)
- **Story**: Demand peaks at 7pm and troughs at 4am, and the daily ring shows the shape.
- **Interaction**: day filter; hover.
- **Critique**: strength is a live dataset; risk is that Transpower data is dense, so aggregate to hourly.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
