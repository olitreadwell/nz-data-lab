# viz-021 Top export destinations

Self-contained spec for the `[viz-021] Top export destinations` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: bar
- **Source**: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- **Story**: China overtook Australia as the top export market, and the bar chart shows the handover.
- **Interaction**: year slider; sort toggle.
- **Critique**: strength is the China story; risk is that rankings flip with exchange rates, so note the currency.

## Priority and smoke-test readiness

- **Priority**: priority-medium (Tier 3 of 6)
- **Smoke-test score**: see `docs/backlog/data-viz-ideas-smoke-ranked.md`

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
