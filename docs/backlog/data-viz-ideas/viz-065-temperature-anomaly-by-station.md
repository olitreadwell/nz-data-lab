# viz-065 Temperature anomaly by station

Self-contained spec for the `[viz-065] Temperature anomaly by station` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: map (bubble by anomaly)
- **Source**: NIWA climate data (https://niwa.co.nz/)
- **Story**: Nearly every station is warmer than its 1981-2010 average, and the north is warming fastest.
- **Interaction**: year slider; hover.
- **Critique**: strength is the warming geography; risk is that anomalies need a long baseline to be meaningful.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 6 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
