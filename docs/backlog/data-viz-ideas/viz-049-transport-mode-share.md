# viz-049 Transport mode share

Self-contained spec for the `[viz-049] Transport mode share` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: donut
- **Source**: Stats NZ transport (https://www.stats.govt.nz/topics/transport/)
- **Story**: Cars carry most commuters, and the share has barely moved in 20 years.
- **Interaction**: slice expand; year toggle.
- **Critique**: strength is the car dominance; risk is that the census commute question changed wording.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
