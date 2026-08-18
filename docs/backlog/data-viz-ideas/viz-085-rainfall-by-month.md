# viz-085 Rainfall by month

Self-contained spec for the `[viz-085] Rainfall by month` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial (rose)
- **Source**: NIWA climate data (https://niwa.co.nz/)
- **Story**: Rainfall is winter-heavy in the north and summer-heavy in the south, and the roses show the flip.
- **Interaction**: station filter; hover.
- **Critique**: strength is the climate contrast; risk is that station coverage is uneven.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 6 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
