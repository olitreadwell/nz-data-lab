# sheep-index — The Sheep Index

## Pitch

New Zealand's national animal is in freefall: the sheep flock has nearly halved since 1994
(49.5 million then, 23.3 million in 2025). Why would anyone be surprised by the decline of
sheep? Because it is the biggest single-number story in NZ agriculture, and the ADE API makes
it fetchable live.

## Data source

Stats NZ Aotearoa Data Explorer, table `AGR_AGR_003` (Livestock Numbers by Regional Council),
fetched at deploy time as `format=csv` via `@nzlab/stats-nz`. The page filters the national
sheep series (livestock code `6731`, area code `20` = New Zealand total). GitHub Pages is
static-only, so the page is a build-time snapshot; the deploy workflow runs daily to keep the
numbers fresh. If the Stats NZ gateway blocks the build runner (GitHub Actions IPs get 401 on
the keyless path), the build falls back to the committed snapshot of the same table in
`packages/stats-nz/src/fixtures/`.

The code-to-label mapping is pinned in `sheep-data.ts` and was verified against published Stats
NZ figures (49.5m sheep in 1994, 32.6m in 2010, 23.3m in 2025). The proper codelist endpoint
(`/codelist/...`) requires a free subscription key, so the mapping gets replaced by a live
codelist fetch once `STATS_NZ_SUBSCRIPTION_KEY` is set.

### 1990 historical anchor

`AGR_AGR_003` only goes back to 1994. `SHEEP_HISTORICAL_ANCHOR` in `sheep-data.ts` splices in one
earlier point — 57.9 million sheep in 1990 — cited from a _separate_ Stats NZ release,
[Livestock numbers: Data to 2023](https://www.stats.govt.nz/indicators/livestock-numbers-data-to-2023/),
not from AGR_AGR_003 itself. `SheepChart` renders the 1990–1994 segment dashed
(`withLeadMainSplit` in `chart-utils.tsx`) to signal it's a single spliced-in citation, not annual
data, so nobody mistakes it for a continuous series.

New Zealand's real historical peak was higher still — 70.3 million in 1982, per
[Te Ara](https://teara.govt.nz/en/farming-in-the-economy/page-8) — but that figure isn't part of
any single Stats NZ table we could confirm and pull cleanly, so it's mentioned in the page copy as
narrative context only and is not plotted. If a genuine pre-1990 annual series turns up (e.g. from
Stats NZ's Agricultural Production Statistics archive), extend `SHEEP_HISTORICAL_ANCHOR` or add a
second anchor rather than interpolating between citations.

## Verdict

**alive** — the data is real and the numbers are exactly the surprising story the pitch
promises. The page refreshes on each deploy rather than on each request.

## What it looks like

Four stat cards (sheep now, peak flock, change since peak, back in 1994) above an SVG line
chart of the full national series, with a data-source footnote.
