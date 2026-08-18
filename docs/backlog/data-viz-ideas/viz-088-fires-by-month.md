# viz-088 Fires by month

Self-contained spec for the `[viz-088] Fires by month` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: radial (rose)
- **Source**: Fire and Emergency NZ (https://fireandemergency.nz/)
- **Story**: Vegetation fires peak in summer while structure fires peak in winter, and the roses show both.
- **Interaction**: fire-type filter; hover.
- **Critique**: strength is the two-season story; risk is that incident data is published with a lag.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 6 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
