# viz-073 Quake magnitude distribution

Self-contained spec for the `[viz-073] Quake magnitude distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: histogram
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: The magnitude histogram is a smooth decay curve, with a bump where the Canterbury sequence added thousands of small quakes.
- **Interaction**: bin slider; time filter.
- **Critique**: strength is a live dataset; risk is that the smallest magnitudes are under-detected.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 12.0/13
- **Smoke assertions**: GeoNet live; assert modal bin, bins sum to total, all magnitudes < 8.5.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
