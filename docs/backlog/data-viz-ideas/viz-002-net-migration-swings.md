# viz-002 Net migration swings

Self-contained spec for the `[viz-002] Net migration swings` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: Stats NZ migration (https://www.stats.govt.nz/topics/migration/)
- **Story**: The Kiwi exodus of 2012 and the record 2023-24 inflow are the two biggest swings in the series.
- **Interaction**: toggle arrivals and departures; brush to zoom.
- **Critique**: strength is the dramatic reversals; risk is that migration numbers get revised heavily after release.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
