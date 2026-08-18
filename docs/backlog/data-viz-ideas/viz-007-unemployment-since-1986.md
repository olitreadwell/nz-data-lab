# viz-007 Unemployment since 1986

Self-contained spec for the `[viz-007] Unemployment since 1986` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: Stats NZ labour market (https://www.stats.govt.nz/topics/labour-market/)
- **Story**: The 1991 peak, the 2008-09 rise, and the 2020 lockdown spike are the three shocks in the series.
- **Interaction**: hover; recession shading.
- **Critique**: strength is a familiar series with clear shocks; risk is that the HLFS methodology changed in 2016.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
