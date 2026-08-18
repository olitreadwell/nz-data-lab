# viz-025 Crime rates by region

Self-contained spec for the `[viz-025] Crime rates by region` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: bar
- **Source**: Police statistics (https://www.police.govt.nz/)
- **Story**: Crime rates vary more than threefold across regions, and the ranking is not what most people expect.
- **Interaction**: offence-type filter; sort toggle.
- **Critique**: strength is the counterintuitive ranking; risk is that Police data changed recording standards in 2014.

## Priority and smoke-test readiness

- **Priority**: priority-low (Tier 6 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
