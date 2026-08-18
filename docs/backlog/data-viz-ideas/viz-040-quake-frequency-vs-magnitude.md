# viz-040 Quake frequency vs magnitude

Self-contained spec for the `[viz-040] Quake frequency vs magnitude` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter (log-log)
- **Source**: GeoNet API (https://api.geonet.org.nz/)
- **Story**: Small quakes vastly outnumber big ones, and the log-log line is the Gutenberg-Richter law in action.
- **Interaction**: log toggle; hover.
- **Critique**: strength is a real scientific law visible in data; risk is that the smallest magnitudes are under-detected.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: Gutenberg-Richter: assert count(mag>=2) > count(mag>=4) > count(mag>=6), log-log slope negative. Needs wider-magnitude GeoNet query than the felt-quakes adapter.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
