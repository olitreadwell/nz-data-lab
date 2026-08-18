# viz-074 Age distribution

Self-contained spec for the `[viz-074] Age distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: histogram
- **Source**: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: The population pyramid has a bulge at 50-60 and a hollow at 20-30 where Kiwis left.
- **Interaction**: year slider; sex toggle.
- **Critique**: strength is the pyramid shape; risk is that census years are irregular, so mark the gaps.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: Census; assert the 50-59 bulge exceeds the 20-29 hollow; totals tie to census population.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
