# viz-033 GDP per capita vs population growth

Self-contained spec for the `[viz-033] GDP per capita vs population growth` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter
- **Source**: Stats NZ GDP and population (https://www.stats.govt.nz/topics/gross-domestic-product/)
- **Story**: Fast-growing regions are not the richest ones, and the scatter shows the split.
- **Interaction**: hover; year slider.
- **Critique**: strength is the growth-quality question; risk is that regional GDP is published with a long lag.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 4 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
