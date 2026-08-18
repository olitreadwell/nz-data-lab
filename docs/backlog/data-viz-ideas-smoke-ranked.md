# Data-viz ideas ranked by e2e smoke-test readiness

Ranking of the 100 specs in `data-viz-ideas.md` by how well a Playwright
`@smoke` test (the pattern in `apps/web/e2e/home.spec.ts`) could assert on the
microsite's critical data functionality. Written 2026-08-18.

## Rubric (max 13)

- **Source reliability (0-5)**: deploy-time fetch proven + fixture fallback
  exists. GeoNet = 5 (live, shipped twice). Stats NZ ADE/census = 4 (proven
  fetch + committed snapshots; ADE had transient 502s). NZOR / data.govt.nz /
  DigitalNZ / iNaturalist / GBIF / Wikipedia = 3.5 (live browser fetch,
  shipped). MBIE / Treasury / Transpower = 2 (adapter unwired, publish lag).
  NIWA = 1.5 (unwired, uneven stations). Police / FENZ / WCC / MfE / DOC /
  ECan / MoJ = 1 (recording changes, 404, or DNS fail).
- **Assertability (0-5)**: can a smoke test assert a stable plausible range
  on `data-value` (the `StatCard` pattern)? Census totals, quake stats,
  well-known economic series = 5. Volatile/ranked series = 3.5-4.5.
- **Chart-type value (0-2)**: slope is the only unused chart type (+2, the
  doc's highest-value next build). Histogram and radial have one shipped
  example each (+1). Everything else = 0.
- **Interaction testability (0-1)**: buttons, toggles, filters, sliders,
  links are Playwright-safe = 1. Hover-only or drag/brush = 0.5.

## Tier 1 - smoke-native, build next (11-12)

| #       | Idea                            | Chart           | Score | Smoke assertions                                                                                                                                                  |
| ------- | ------------------------------- | --------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| viz-073 | Quake magnitude distribution    | histogram       | 12.0  | GeoNet live; assert modal bin, bins sum to total, all magnitudes < 8.5.                                                                                           |
| viz-091 | Regional population rank change | slope           | 11.5  | Census ranks stable; assert Auckland rank 1 at both endpoints, west coast fell. Unused chart type.                                                                |
| viz-032 | Quake magnitude vs depth        | scatter         | 11.0  | GeoNet live; assert depth 0-700 km, magnitude 0-8.5, shallow quakes dominate felt set.                                                                            |
| viz-040 | Quake frequency vs magnitude    | scatter log-log | 11.0  | Gutenberg-Richter: assert count(mag>=2) > count(mag>=4) > count(mag>=6), log-log slope negative. Needs wider-magnitude GeoNet query than the felt-quakes adapter. |
| viz-074 | Age distribution                | histogram       | 11.0  | Census; assert the 50-59 bulge exceeds the 20-29 hollow; totals tie to census population.                                                                         |
| viz-090 | Quake depth distribution        | radial          | 11.0  | GeoNet live; assert shallow (< 40 km) cluster dominates, depths within 0-700 km.                                                                                  |
| viz-093 | Top export destination rank     | slope           | 11.0  | Infoshare; assert China rank 1 and Australia rank 2 at the latest endpoint. Unused chart type.                                                                    |
| viz-096 | City population rank            | slope           | 11.0  | Census; assert Tauranga 5th, Auckland 1st at latest endpoint. Unused chart type.                                                                                  |

All eight share the strongest e2e profile: the headline number is stable,
the source is already proven in this repo (GeoNet, Stats NZ census, trade
series), and the assertion is a range check on a `data-value` attribute with
no interaction required.

## Tier 2 - strong, next wave (10-10.5)

| #       | Idea                             | Chart     | Score | One-line reason                                                                   |
| ------- | -------------------------------- | --------- | ----- | --------------------------------------------------------------------------------- |
| viz-009 | Quakes per year                  | line      | 10.5  | GeoNet; assert 2011 spike exceeds other years; needs longer time-window fetch.    |
| viz-081 | Quakes by month                  | radial    | 10.5  | GeoNet; assert 12 monthly bins sum to the quake total.                            |
| viz-100 | Median age rank by region        | slope     | 10.5  | Census; east-coast regions climb age ranks; unused chart type.                    |
| viz-001 | Population since 1840            | line      | 10.0  | Assert latest 5.0-5.5 M; monotonic growth with a data note on pre-1900 estimates. |
| viz-022 | Regional population growth       | bar       | 10.0  | Census; assert Auckland positive growth, some region negative.                    |
| viz-029 | Birthplace of residents          | bar       | 10.0  | Census; assert India/China above UK in 2023.                                      |
| viz-043 | Population by ethnicity          | donut     | 10.0  | Census; European largest, multi-ethnic fastest-growing slice.                     |
| viz-050 | Religion share                   | donut     | 10.0  | Census; assert "no religion" > Christianity in 2023.                              |
| viz-053 | Population by region             | treemap   | 10.0  | Census; assert Auckland block ~ a third of total.                                 |
| viz-061 | Population density by region     | map       | 10.0  | Census; Leaflet shipped; assert Auckland density > 4x national.                   |
| viz-069 | Median age by region             | map       | 10.0  | Census; assert all regions 32-42.                                                 |
| viz-071 | House price distribution         | histogram | 10.0  | Assert long right tail: mean > median.                                            |
| viz-072 | Income distribution              | histogram | 10.0  | Assert right skew, top decile tail; note top-coding.                              |
| viz-076 | Commute time distribution        | histogram | 10.0  | Assert mode under 30 min; census wording note.                                    |
| viz-077 | Rent distribution                | histogram | 10.0  | Assert narrow band, rightward shift since 2015.                                   |
| viz-079 | Company size distribution        | histogram | 10.0  | Assert power-law: micro firms dominate count.                                     |
| viz-092 | House price rank by region       | slope     | 10.0  | Queenstown overtakes Wellington; unused chart type.                               |
| viz-094 | Income rank by region            | slope     | 10.0  | Wellington overtakes Auckland; unused chart type.                                 |
| viz-095 | Unemployment rank by region      | slope     | 10.0  | Rank churn; note wide CIs for small regions.                                      |
| viz-097 | Tourism arrivals rank by country | slope     | 10.0  | US/India climb, Japan/Korea fall; use pre-2020 endpoints.                         |

## Tier 3 - solid, one-time plumbing (9-9.5)

43 ideas. All are Stats-NZ-sourced with stable, assertable values; they only
need a data adapter/fixture pass per series. Highlights:

- **viz-003 Inflation since 1914** (9.5): assert 1970s peak > 15%, latest 2-4%; log toggle.
- **viz-007 Unemployment since 1986** (9.5): assert 1991 peak > 9%, 2020 spike > 4%.
- **viz-008 Births and deaths** (9.5): assert births ~55-65k, deaths ~35-45k, lines converging.
- **viz-021 Top export destinations** (9.5): assert China top market; year slider.
- **viz-042 Export commodity share** (9.5): dairy largest slice; combined core share shrinking.
- **viz-049 Transport mode share** (9.5): cars > 70% of commutes, barely moved.
- **viz-052 Export value by commodity** (9.5): dairy biggest block; long tail larger than any single block.
- **viz-054 Land area by region** (9.5): South Island regions huge on land, small on people.
- **viz-063 Unemployment by region** (9.5): east coast higher; 2-8% range.
- **viz-066 / viz-067 Sheep and dairy density by region** (9.5 each): east coast sheep density; Waikato/Canterbury dairy.
- **viz-075 House size distribution** (9.5): new homes cluster 150-200 m2.
- **viz-082 / viz-083 Births and tourism arrivals by month** (9.5 each): gentle seasonality; assert month ordering.
- **viz-002 Net migration swings** (9.0): assert 2023-24 inflow > 2012 exodus.
- **viz-006 Tourism arrivals since 1920** (9.0): assert 2020 cliff < 2000s levels, recovery after.
- **viz-010 Dairy export value** (9.0): milk powder biggest earner; assert > $10B recent.
- **viz-013 Population by age group** (9.0): baby-boom bulge moves up the stack.
- **viz-015 / viz-058 Emissions by sector** (9.0): agriculture dominates; methane vs CO2 note.
- **viz-016 Tourist arrivals by country** (9.0): Australia dominates stack; China/US grew fastest pre-2020.
- **viz-017 / viz-059 Employment by industry** (9.0): services swallowed manufacturing.
- **viz-020 / viz-048 Waste to landfill / composition** (9.0): construction waste the surprising leader.
- **viz-023 House price by region** (9.0): Auckland/Wellington far above rest.
- **viz-024 Top tourist source countries** (9.0): Australia top; US/India fastest-growing.
- **viz-026 Average income by region** (9.0): Wellington/Auckland lead; gap widened.
- **viz-031 House price vs income** (9.0): affordability clusters, Auckland alone.
- **viz-036 Population density vs house price** (9.0): link breaks for tourist towns.
- **viz-038 Tourism spend vs visitor numbers** (9.0): Queenstown spend-per-visitor outlier.
- **viz-039 Age vs income** (9.0): older regions not richer.
- **viz-044 Land use share** (9.0): pasture > a third of the country.
- **viz-055 Company count by industry** (9.0): construction + professional services biggest.
- **viz-056 Building consents by region** (9.0): Auckland consents dwarf others.
- **viz-057 / viz-068 Tourism spend by region** (9.0): Auckland + Queenstown concentration.
- **viz-060 Species count by class** (9.0): NZOR live; insects dominate.
- **viz-062 House price by region (map)** (9.0): Auckland/Queenstown gradient.
- **viz-086 Retail sales by month** (9.0): December spike; use raw (unadjusted) data.
- **viz-087 House sales by month** (9.0): autumn peak, winter trough.

## Tier 4 - workable, needs new source plumbing (8-8.5)

- **viz-004 House prices vs wages** (8.5): dual-axis; assert gap ratio grew; label carefully.
- **viz-012 Land use change** (8.5): paddock flip; category comparability note.
- **viz-028 Top companies by revenue** (8.5): concentration; confidentialised revenue risk.
- **viz-030 Alcohol consumption by type** (8.5): beer falls, wine/spirits rise; survey error margins.
- **viz-033 GDP per capita vs population growth** (8.5): growth-quality split; regional GDP lag.
- **viz-035 Farm size vs production** (8.5): outliers; sample-based error bars.
- **viz-037 Emissions per capita vs GDP** (8.5): decoupling question; modelled emissions.
- **viz-047 Household spending by category** (8.5): housing + food biggest slices; small volatile survey.

## Tier 5 - source gap, build after an adapter (6-7.5)

- **viz-098 Electricity price rank by region** (7.0): MBIE unwired + lag.
- **viz-005 / viz-011 / viz-019 / viz-041 / viz-045 / viz-070** (6.0-6.5): all MBIE energy; adapter needed, mix/frequency gaps.
- **viz-018 / viz-046 / viz-051** (6.5): Treasury; dense data, classification notes.
- **viz-084 Electricity demand by hour** (6.0): Transpower live but dense; aggregate to hourly first.
- **viz-027 Electricity price by region** (6.0): MBIE lag.
- **viz-080 Temperature distribution by station** (6.0): NIWA unwired.

## Tier 6 - blocked, avoid for now (<=5.5)

- **viz-025 Crime rates by region** (4.0): Police recording-standard break in 2014 poisons the series and the smoke assertion.
- **viz-088 Fires by month** (4.0): FENZ publish lag, unwired.
- **viz-034 / viz-064 / viz-065 / viz-085 / viz-089** (5.0): all NIWA; unwired adapter, uneven station coverage, no fixture fallback yet.
- **viz-099 Crime rate rank by region** (5.0): recording changes make the slope misleading; lowest-value smoke target.

## Notes

- **Stale e2e spec**: `apps/web/e2e/home.spec.ts` still asserts 7 "read the
  story" links; the site has 14. The `@smoke` data tests are unaffected, but
  `@critical` home tests fail until the count is updated.
- **GeoNet adapter extension**: viz-009 and viz-081 need a time-window query
  on `/quake`; the current adapter fetches recent felt quakes (MMI >= 3,
  3-month window). viz-040 needs a wider-magnitude query than the felt set.
- **Data tables**: other chat's issue #18 (data tables for keyboard access)
  applies to every hover-dependent chart above; the tabulated values double
  as the smoke assertion targets.
