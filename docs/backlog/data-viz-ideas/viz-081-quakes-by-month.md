# viz-081 Quakes by month

Self-contained spec for the `[viz-081] Quakes by month` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial (rose)
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: Quakes cluster in certain months, and the rose shows the seasonal pattern.
- **Interaction**: year filter; magnitude filter.
- **Critique**: strength is the seasonal question; risk is that the pattern may be noise, so show confidence.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.5/13
- **Smoke assertions**: GeoNet; assert 12 monthly bins sum to the quake total.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
