# viz-043 Population by ethnicity

Self-contained spec for the `[viz-043] Population by ethnicity` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: donut
- **Source**: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: European is still the largest group, but the multi-ethnic share is the fastest-growing slice.
- **Interaction**: slice expand; year toggle.
- **Critique**: strength is the identity story; risk is that ethnicity totals exceed 100 percent because people identify with more than one.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Census; European largest, multi-ethnic fastest-growing slice.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
