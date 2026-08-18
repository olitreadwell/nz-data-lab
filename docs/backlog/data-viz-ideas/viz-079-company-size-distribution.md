# viz-079 Company size distribution

Self-contained spec for the `[viz-079] Company size distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: histogram
- **Source**: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- **Story**: The business register is a power law, with a handful of giants and a long tail of micro firms.
- **Interaction**: bin slider; industry filter.
- **Critique**: strength is the power-law shape; risk is that the register counts dormant companies.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Assert power-law: micro firms dominate count.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
