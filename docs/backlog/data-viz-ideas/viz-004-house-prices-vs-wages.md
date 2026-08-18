# viz-004 House prices vs wages

Self-contained spec for the `[viz-004] House prices vs wages` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: line
- **Source**: Stats NZ housing and income (https://www.stats.govt.nz/topics/housing/)
- **Story**: House prices have grown far faster than wages since the 1990s, and the gap is the affordability story in one chart.
- **Interaction**: dual-axis toggle; brush.
- **Critique**: strength is the headline gap; risk is dual-axis charts misleading readers, so label axes carefully.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 4 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
