# viz-032 Quake magnitude vs depth

Self-contained spec for the `[viz-032] Quake magnitude vs depth` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: Shallow quakes are the ones people feel, and the scatter shows the depth-magnitude trade-off.
- **Interaction**: time filter; hover.
- **Critique**: strength is a live dataset; risk is that the API caps results, so fetch by time window.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: GeoNet live; assert depth 0-700 km, magnitude 0-8.5, shallow quakes dominate felt set.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
