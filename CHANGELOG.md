# Changelog

Every microsite loop appends a dated entry here. Format:

## YYYY-MM-DD HH:MM (NZST) - loop N

- Shipped: <microsite slug> - <one line>
- Sources: <data source + references>
- Loop review: <what slowed the loop, what changed in the skill>

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
