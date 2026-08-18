# viz-012 Land use change

Self-contained spec for the `[viz-012] Land use change` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: area
- **Source**: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- **Story**: Sheep land gave way to dairy and forestry, and the stacked area shows the paddock flip.
- **Interaction**: brush; hover.
- **Critique**: strength is the land-use flip; risk is that land-use categories are not directly comparable across years.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 4 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
