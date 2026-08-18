# viz-027 Electricity price by region

Self-contained spec for the `[viz-027] Electricity price by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: bar
- **Source**: MBIE energy statistics (https://www.mbie.govt.nz/)
- **Story**: Electricity prices vary by region, and the gap between cheapest and priciest is a full third of the average bill.
- **Interaction**: sort toggle; year slider.
- **Critique**: strength is a cost-of-living angle; risk is that regional price data is published with a lag.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
