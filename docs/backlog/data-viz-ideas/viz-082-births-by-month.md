# viz-082 Births by month

Self-contained spec for the `[viz-082] Births by month` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial (rose)
- **Source**: Stats NZ population (https://www.stats.govt.nz/topics/population/)
- **Story**: Births peak in spring and trough in winter, and the rose shows the seasonality.
- **Interaction**: year filter; hover.
- **Critique**: strength is a gentle seasonal pattern; risk is that the effect is small, so scale honestly.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
