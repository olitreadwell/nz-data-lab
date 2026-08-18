# viz-090 Quake depth distribution

Self-contained spec for the `[viz-090] Quake depth distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: Quakes cluster at shallow depths under the North Island and deep under the South Island.
- **Interaction**: magnitude filter; hover.
- **Critique**: strength is the subduction story; risk is that depth estimates are uncertain for small quakes.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: GeoNet live; assert shallow (< 40 km) cluster dominates, depths within 0-700 km.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
