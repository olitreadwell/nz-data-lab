# viz-056 Building consents by region

Self-contained spec for the `[viz-056] Building consents by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: treemap
- **Source**: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- **Story**: Auckland consents dwarf every other region, and the block grows with each housing cycle.
- **Interaction**: drill-down by region; year slider.
- **Critique**: strength is the housing supply story; risk is that consents are not completions.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
