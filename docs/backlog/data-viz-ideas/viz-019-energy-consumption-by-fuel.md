# viz-019 Energy consumption by fuel

Self-contained spec for the `[viz-019] Energy consumption by fuel` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: area
- **Source**: MBIE energy statistics (https://www.mbie.govt.nz/)
- **Story**: Oil and gas dominate energy use while electricity's share stays flat.
- **Interaction**: fuel toggle; hover.
- **Critique**: strength is the fuel mix; risk is that consumption and generation are easy to confuse, so label clearly.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 5 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
