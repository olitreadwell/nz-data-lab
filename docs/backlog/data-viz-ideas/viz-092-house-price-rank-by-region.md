# viz-092 House price rank by region

Self-contained spec for the `[viz-092] House price rank by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: slope
- **Source**: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- **Story**: Queenstown overtook Wellington for the second-priciest region, and the slope shows the crossing.
- **Interaction**: hover; region highlight.
- **Critique**: strength is the overtaking story; risk is that rank changes are noisy for mid-ranked regions.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 2 of 6)
- **Smoke-test score**: 10.0/13
- **Smoke assertions**: Queenstown overtakes Wellington; unused chart type.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
