# viz-076 Commute time distribution

Self-contained spec for the `[viz-076] Commute time distribution` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: histogram
- **Source**: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: Most commutes are under 30 minutes, but the long tail of 60-plus minute commutes is growing.
- **Interaction**: bin slider; region filter.
- **Critique**: strength is the commute story; risk is that the census question changed wording in 2018.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Assert mode under 30 min; census wording note.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
