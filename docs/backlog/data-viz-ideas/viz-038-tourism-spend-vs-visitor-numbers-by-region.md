# viz-038 Tourism spend vs visitor numbers by region

Self-contained spec for the `[viz-038] Tourism spend vs visitor numbers by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter (bubble by spend)
- **Source**: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- **Story**: Queenstown pulls far more spend per visitor than anywhere else.
- **Interaction**: hover; region highlight.
- **Critique**: strength is the spend-per-visitor outlier; risk is that regional tourism data is modelled.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
