# viz-071 House price distribution

Self-contained spec for the `[viz-071] House price distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: histogram
- **Source**: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- **Story**: House prices are a long right tail, with the bulk of sales far below the headline average.
- **Interaction**: bin slider; region filter.
- **Critique**: strength is the mean-vs-median lesson; risk is that sales data is not the same as the price index.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Assert long right tail: mean > median.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
