# viz-039 Age vs income by region

Self-contained spec for the `[viz-039] Age vs income by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: scatter
- **Source**: Stats NZ income and 2023 census (https://www.stats.govt.nz/topics/income/)
- **Story**: Older regions are not richer ones, and the scatter shows the retirement belt.
- **Interaction**: hover; region highlight.
- **Critique**: strength is the ageing-vs-income split; risk is that median age hides the working-age share.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
