# viz-069 Median age by region

Self-contained spec for the `[viz-069] Median age by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: map (choropleth)
- **Source**: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: The retirement belt runs down the east coast and up through the far north.
- **Interaction**: hover; year toggle.
- **Critique**: strength is the ageing geography; risk is that median age hides the youth share.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Census; assert all regions 32-42.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
