# viz-036 Population density vs house price

Self-contained spec for the `[viz-036] Population density vs house price` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter
- **Source**: Stats NZ housing and 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: Denser places are pricier, but the relationship breaks down for tourist towns.
- **Interaction**: hover; region highlight.
- **Critique**: strength is the density-price link; risk is that tourist towns break the pattern and need explaining.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
