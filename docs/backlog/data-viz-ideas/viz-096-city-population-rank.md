# viz-096 City population rank

Self-contained spec for the `[viz-096] City population rank` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: slope
- **Source**: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- **Story**: Tauranga overtook Dunedin and Hamilton to become the fifth-biggest city.
- **Interaction**: hover; city highlight.
- **Critique**: strength is the urban growth story; risk is that city boundaries changed, so use consistent definitions.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: Census; assert Tauranga 5th, Auckland 1st at latest endpoint. Unused chart type.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
