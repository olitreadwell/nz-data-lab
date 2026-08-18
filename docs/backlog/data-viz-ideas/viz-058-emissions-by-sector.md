# viz-058 Emissions by sector

Self-contained spec for the `[viz-058] Emissions by sector` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: treemap
- **Source**: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- **Story**: Agriculture is the single biggest emissions block, ahead of transport and energy.
- **Interaction**: drill-down by sector; hover.
- **Critique**: strength is the agriculture dominance; risk is that methane and CO2 are different gases, so note the metric.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
