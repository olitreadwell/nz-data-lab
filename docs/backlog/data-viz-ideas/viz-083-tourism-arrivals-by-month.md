# viz-083 Tourism arrivals by month

Self-contained spec for the `[viz-083] Tourism arrivals by month` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial (rose)
- **Source**: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- **Story**: Visitors peak in summer and trough in winter, and the rose shows the seasonality.
- **Interaction**: year filter; source-country filter.
- **Critique**: strength is the seasonal tourism story; risk is that the 2020-21 years break the pattern, so mark them.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
