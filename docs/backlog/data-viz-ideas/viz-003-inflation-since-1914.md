# viz-003 Inflation since 1914

Self-contained spec for the `[viz-003] Inflation since 1914` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: Stats NZ consumers price index (https://www.stats.govt.nz/topics/consumers-price-index/)
- **Story**: The 1970s inflation spike dwarfs the 2020s one, and the 1990s disinflation is the quietest revolution in the series.
- **Interaction**: log-scale toggle; hover.
- **Critique**: strength is a century of data; risk is index rebasing and methodology changes across the period.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
