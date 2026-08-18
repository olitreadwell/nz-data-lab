# viz-093 Top export destination rank

Self-contained spec for the `[viz-093] Top export destination rank` data-viz-idea issue. Implement the microsite from this doc alone; the master list is `docs/backlog/data-viz-ideas.md` and the ranking is `docs/backlog/data-viz-ideas-smoke-ranked.md`.

## Spec

- **Chart**: slope
- **Source**: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- **Story**: China climbed from nowhere to the top export market, overtaking Australia and the US.
- **Interaction**: hover; country highlight.
- **Critique**: strength is the China rise; risk is that commodity price swings distort the ranking.

## Priority and smoke-test readiness

- **Priority**: priority-high (Tier 1 of 6)
- **Smoke-test score**: 11.0/13
- **Smoke assertions**: Infoshare; assert China rank 1 and Australia rank 2 at the latest endpoint. Unused chart type.

## Definition of done

- Microsite under `apps/web/src/app/microsites/` with the chart type, interaction, and a `StatCard` exposing the headline value via `data-value` for the e2e smoke test.
- Oli-style copy: no em dashes, no puffery, real verified numbers, named sources; every reference URL returns 200.
- Unit test per new component; `npx tsc --noEmit` and `npx vitest run` pass in `apps/web`.
- Close the issue with a comment linking the shipped microsite.
