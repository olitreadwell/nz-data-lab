# viz-020 Waste to landfill by material

Self-contained spec for the `[viz-020] Waste to landfill by material` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: area
- **Source**: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- **Story**: Construction and demolition waste is the biggest and fastest-growing stream.
- **Interaction**: material toggle; hover.
- **Critique**: strength is a surprising leader; risk is that waste data is patchy before 2009.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
