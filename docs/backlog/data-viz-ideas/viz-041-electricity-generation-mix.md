# viz-041 Electricity generation mix

Self-contained spec for the `[viz-041] Electricity generation mix` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: donut
- **Source**: MBIE energy statistics (https://www.mbie.govt.nz/)
- **Story**: Hydro is still the biggest slice, but renewables together now pass half of generation.
- **Interaction**: slice expand; year slider.
- **Critique**: strength is the renewables share; risk is that a donut hides the time dimension, so pair with viz-011.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
