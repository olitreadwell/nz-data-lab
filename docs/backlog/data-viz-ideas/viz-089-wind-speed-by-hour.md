# viz-089 Wind speed by hour

Self-contained spec for the `[viz-089] Wind speed by hour` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial
- **Source**: NIWA climate data (https://niwa.co.nz/)
- **Story**: Wind peaks in the afternoon and dies overnight, and the daily ring shows the pattern.
- **Interaction**: station filter; season toggle.
- **Critique**: strength is the daily wind story; risk is that wind data is gusty, so use hourly means.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 6 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
