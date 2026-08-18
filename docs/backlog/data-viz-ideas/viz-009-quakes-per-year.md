# viz-009 Quakes per year

Self-contained spec for the `[viz-009] Quakes per year` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: The 2010-11 Canterbury sequence and the 2016 Kaikoura quake are visible as spikes in annual counts.
- **Interaction**: magnitude filter; hover.
- **Critique**: strength is a live source that updates daily; risk is that detection thresholds changed over time.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.5/13
- **Smoke assertions**: GeoNet; assert 2011 spike exceeds other years; needs longer time-window fetch.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
