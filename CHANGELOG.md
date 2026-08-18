## 2026-08-18 22:20 (NZST) - loop 7

- Handed off (unmerged, awaiting review): regional-population-ranks (viz-091,
  branch feat/microsite-loop-7, review issue #202), export-destination-ranks
  (viz-093, branch feat/microsite-loop-7, review issue #203), and
  city-population-ranks (viz-096, branch feat/microsite-loop-7, review issue
  #204). All three are slope charts with a movers/all toggle and hover
  highlight, built on a shared SlopeChart component.
- Sources: Stats NZ 2023 Census population counts release (Table 1 regional,
  Table 2 territorial authority) and Stats NZ goods and services trade by
  country releases (year ended March 2015/2020 map data, International trade
  December 2025 quarter monthly series for 2026). All reference URLs return 200. Chart types used so far: line, area, bar, scatter, donut, treemap,
  map, histogram, radial, bubble, slope, timeline, funnel, waterfall,
  sunburst, lollipop, heatmap.
- Loop review: the smoke-ranked doc says slope is the only unused chart
  type, but loop 5's species-record-ledger already drew a two-point slope
  with a LineChart, so the changelog registry and the smoke-ranked doc
  disagree. The loop built three slope microsites anyway because slope is
  the highest-value next build per the smoke-ranked doc. The viz-091 spec
  story (Queenstown climbed) is TA-level, but the region-level ranks are
  frozen across all three censuses, so the copy tells the honest
  frozen-pecking-order story. Data sourcing took longest: the ADE needs a
  subscription key for census and trade tables, so the numbers were pulled
  from Stats NZ release Excel/CSV downloads instead.

# Changelog

## 2026-08-18 10:35 (NZST) - loop 5

- Shipped: backyard-species-census (live iNaturalist census, bubble chart by
  species, observations, and observers per group with taxon toggles),
  species-record-ledger (live GBIF occurrence search, slope chart by kingdom
  2014 vs 2024 with kingdom toggles), and what-the-world-reads (live Wikipedia
  pageviews, range timeline of daily views per NZ topic with a window slider).
- Sources: iNaturalist API (New Zealand place 6803), GBIF occurrence search
  (country NZ), and English Wikipedia pageviews API, all live from the
  browser (CORS open). Chart types used so far: line, area, bar, scatter,
  donut, treemap, map, histogram, radial, bubble, slope, timeline.
- Loop review: the launchd quality loop committed to main mid-run again, so
  the worktree branch was based on a stale main; the rebase onto origin/main
  went cleanly this time. The bigger slowdown was node_modules: symlinking
  the main repo's node_modules into the worktree breaks vitest's esbuild
  ("too many levels of symbolic links"), so a full npm install in the
  worktree was needed (~70s). The skill now says to run npm install in a
  fresh worktree instead of symlinking.

## 2026-08-18 09:45 (NZST) - loop 4

- Shipped: digitised-memory (live DigitalNZ search, histogram by decade with
  decade-range sliders) and online-garage-sale (live Trade Me category tree,
  radial bar by leaf count with search and expand).
- Sources: DigitalNZ (National Library) v3 API and Trade Me public category
  tree, both live from the browser (CORS open). Chart types used so far:
  line, area, bar, scatter, donut, treemap, map, histogram, radial.
- Loop review: the launchd quality loop committed to main mid-run (live-search
  timeout fix), so the worktree branch was based on a stale main and the new
  fetchers had to be reconciled with the timeout pattern. The skill now says
  to fetch origin and rebase onto the latest main before merging. Splitting
  shared infra (fetchers, accents) across per-microsite commits is fiddly;
  commit it with the first microsite.

Every microsite loop appends a dated entry here. Format:

## YYYY-MM-DD HH:MM (NZST) - loop N

- Shipped: <microsite slug> - <one line>
- Sources: <data source + references>
- Loop review: <what slowed the loop, what changed in the skill>

## 2026-08-18 01:55 (NZST) - loop 3

- Shipped: species-register (live NZOR search, donut by class) and
  open-data-catalogue (live data.govt.nz search, treemap by publisher).
  Both search from the browser (CORS open), so no build-time snapshot.
- Sources: NZOR (170,151 names) and data.govt.nz CKAN (31,915 datasets);
  DOC and Te Ara references.
- Loop review: client components cannot import @nzlab/nz-sources (its
  fixtures read node:fs, which breaks the client bundle), so the browser
  fetchers live in apps/web/src/lib/live-sources.ts. A future refactor
  should split nz-sources into server and client entries to remove the
  parse overlap. Chart types used so far: line, area, bar, scatter, donut,
  treemap, map.

## 2026-08-18 00:40 (NZST) - loop 2

- Shipped: shake-index reworked from a scatter chart to a Leaflet map of
  New Zealand (OpenStreetMap tiles, bubble size by magnitude, colour by felt
  intensity, magnitude and depth sliders).
- Sources: GeoNet API; react-leaflet v5 + leaflet 1.9.4 (client-side only
  via next/dynamic ssr:false so the static export stays server-safe).
- Loop review: the first Leaflet attempt broke prerender (window at module
  load); the fix was splitting the map into a dynamic client-only module
  and keeping shared helpers Leaflet-free. Chart-type registry still needs
  building.

## 2026-08-18 00:05 (NZST) - loop 1

- Shipped: shake-index - recent felt quakes as an adjustable bubble chart
  (magnitude and depth sliders, colour by felt intensity).
- Sources: GeoNet API via @nzlab/nz-sources (first non-Stats-NZ microsite);
  GeoNet FAQ and Te Ara references.
- Loop review: first worktree run. npm install in a fresh worktree is slow
  (node_modules rebuild); the runner script should reuse the main
  node_modules or document the cost. Chart type repeated (scatter) because
  the story demanded it; the skill needs a chart-type registry to make that
  a conscious choice.

## 2026-08-17 23:40 (NZST) - loop 0

- Shipped: kiwifruit-overtake, deer-boom-bust, dairy-takeover scatter view
  (the batch that preceded the loop).
- Sources: Stats NZ AGR_AGR_002 / AGR_AGR_003.
- Loop review: loop skill created; first run will test the worktree flow.
