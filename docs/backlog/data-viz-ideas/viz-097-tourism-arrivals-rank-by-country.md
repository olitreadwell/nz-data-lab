# viz-097 Tourism arrivals rank by country

Self-contained spec for the `[viz-097] Tourism arrivals rank by country` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: slope
- **Source**: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- **Story**: India and the US climbed the visitor ranks while Japan and Korea fell.
- **Interaction**: hover; country highlight.
- **Critique**: strength is the source-market churn; risk is that 2020-21 breaks the series, so use pre-2020 endpoints.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: US/India climb, Japan/Korea fall; use pre-2020 endpoints.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
