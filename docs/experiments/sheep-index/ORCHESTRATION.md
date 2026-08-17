# ORCHESTRATION.md — sheep-index

Built 2025-08-17 to prove out `@nzlab/stats-nz` end to end.

- TDD: package tests written first (unit/integration/perf/security/adversarial), then the
  client; same loop for `sheep-data.ts` (transform) and `SheepChart` (a11y).
- Live smoke tests run explicitly: `RUN_SMOKE=1 npm run test:smoke -w @nzlab/stats-nz`.
- Two real findings surfaced by the tests: the SDMX catalogue nests dataflows under
  `Structure/Structures/Dataflows`, and the keyless gateway path requires the explicit
  published version (`1.0`) in the data URL. Both fixed and pinned by regression tests.

2026-08-17 follow-up: spliced in a single 1990 historical anchor point (sourced from a
different Stats NZ indicator release, not AGR_AGR_003) ahead of the regular series, and
gave `SheepChart`/`LivestockChart` a dashed lead-in segment so the lower-resolution
pre-1994 point reads as a citation rather than annual data. Researched further back
(1982 peak, 1984 subsidy removal) via web search, but found no single clean official
table for a full pre-1990 annual series, so that context is prose-only in the page copy,
not plotted. Applied the same "verified anchor or prose-only, never fabricated" rule to
the vineyard-boom and planting-bust sections, which got narrative context (1986 vine-pull
scheme, NZ ETS/NEFD forestry history) with no numeric backfill since no equivalent
single-source figure was found for those two.
