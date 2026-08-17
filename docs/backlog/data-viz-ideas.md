# 100 data-viz microsite ideas

Ten chart types, ten ideas each. Every idea names a real NZ public data source
(URLs verified 200 on 2026-08-18), a story, an interaction, and a critique
(why it works, what could sink it). Backlog issues reference the IDs below.

Chart types: line, area, bar, scatter, donut, treemap, map, histogram, radial,
slope. The site has already shipped line, area, bar, scatter, donut, treemap,
map, histogram, and radial; slope is the only unused type, so it is the
highest-value next build.

## Line

### viz-001 Population since 1840

- Chart: line
- Source: Stats NZ population estimates and census counts (https://www.stats.govt.nz/topics/population/)
- Story: New Zealand went from a few thousand settlers to 5.3 million people, with the growth curve bending at every migration wave.
- Interaction: hover to read any year; toggle census vs estimate series.
- Critique: strength is the long arc and the 1840-1900 estimates are the risk, they are rough and need a data note.

### viz-002 Net migration swings

- Chart: line
- Source: Stats NZ migration (https://www.stats.govt.nz/topics/migration/)
- Story: The Kiwi exodus of 2012 and the record 2023-24 inflow are the two biggest swings in the series.
- Interaction: toggle arrivals and departures; brush to zoom.
- Critique: strength is the dramatic reversals; risk is that migration numbers get revised heavily after release.

### viz-003 Inflation since 1914

- Chart: line
- Source: Stats NZ consumers price index (https://www.stats.govt.nz/topics/consumers-price-index/)
- Story: The 1970s inflation spike dwarfs the 2020s one, and the 1990s disinflation is the quietest revolution in the series.
- Interaction: log-scale toggle; hover.
- Critique: strength is a century of data; risk is index rebasing and methodology changes across the period.

### viz-004 House prices vs wages

- Chart: line
- Source: Stats NZ housing and income (https://www.stats.govt.nz/topics/housing/)
- Story: House prices have grown far faster than wages since the 1990s, and the gap is the affordability story in one chart.
- Interaction: dual-axis toggle; brush.
- Critique: strength is the headline gap; risk is dual-axis charts misleading readers, so label axes carefully.

### viz-005 Electricity generation mix

- Chart: line
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Hydro has always led, but wind and solar are the only lines still climbing.
- Interaction: source toggle; hover.
- Critique: strength is the clean energy transition visible in one chart; risk is data frequency differences between sources.

### viz-006 Tourism arrivals since 1920

- Chart: line
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Visitor arrivals show the 1990s boom, the 2020 border shutdown, and the fastest recovery in the series.
- Interaction: brush to zoom; hover.
- Critique: strength is the COVID cliff; risk is definitional changes in how visitors are counted.

### viz-007 Unemployment since 1986

- Chart: line
- Source: Stats NZ labour market (https://www.stats.govt.nz/topics/labour-market/)
- Story: The 1991 peak, the 2008-09 rise, and the 2020 lockdown spike are the three shocks in the series.
- Interaction: hover; recession shading.
- Critique: strength is a familiar series with clear shocks; risk is that the HLFS methodology changed in 2016.

### viz-008 Births and deaths

- Chart: line
- Source: Stats NZ population (https://www.stats.govt.nz/topics/population/)
- Story: Births are falling while deaths are rising, and the two lines are converging on each other.
- Interaction: toggle births and deaths; hover.
- Critique: strength is the natural-increase story; risk is that the lines are close and need clear labels.

### viz-009 Quakes per year

- Chart: line
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: The 2010-11 Canterbury sequence and the 2016 Kaikoura quake are visible as spikes in annual counts.
- Interaction: magnitude filter; hover.
- Critique: strength is a live source that updates daily; risk is that detection thresholds changed over time.

### viz-010 Dairy export value

- Chart: line
- Source: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- Story: Milk powder went from a rounding error to the country's biggest export earner.
- Interaction: commodity toggle; hover.
- Critique: strength is the commodity story; risk is that export values swing with world prices, not volumes.

## Area

### viz-011 Electricity generation by source

- Chart: area (streamgraph)
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: The generation stack shows hydro holding the base while gas, wind, and solar trade places on top.
- Interaction: source toggle; hover.
- Critique: strength is the stacked composition story; risk is that small sources become unreadable, so cap the stack.

### viz-012 Land use change

- Chart: area
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Sheep land gave way to dairy and forestry, and the stacked area shows the paddock flip.
- Interaction: brush; hover.
- Critique: strength is the land-use flip; risk is that land-use categories are not directly comparable across years.

### viz-013 Population by age group

- Chart: area
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: The baby boom bulge is visible moving up the age stack over time.
- Interaction: year slider; hover.
- Critique: strength is the ageing story; risk is that census years are irregular, so interpolate or mark gaps.

### viz-014 Migration arrivals vs departures

- Chart: area
- Source: Stats NZ migration (https://www.stats.govt.nz/topics/migration/)
- Story: Arrivals and departures cross over repeatedly, and the gap between them is net migration.
- Interaction: toggle; hover.
- Critique: strength is the crossing lines; risk is the same revision problem as viz-002.

### viz-015 Emissions by sector

- Chart: area
- Source: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- Story: Agriculture and transport dominate the emissions stack, and their shares have barely moved.
- Interaction: sector toggle; hover.
- Critique: strength is the sector composition; risk is that emissions accounting methods change between inventories.

### viz-016 Tourist arrivals by country

- Chart: area
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Australia dominates the visitor stack, but China and the US grew fastest before 2020.
- Interaction: country filter; hover.
- Critique: strength is the source-market mix; risk is that small countries are invisible in the stack.

### viz-017 Employment by industry

- Chart: area
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: Services swallowed manufacturing's share of jobs over 30 years.
- Interaction: industry toggle; hover.
- Critique: strength is the structural shift; risk is industry classification changes in 1996 and 2006.

### viz-018 Government spending by category

- Chart: area
- Source: Treasury (https://www.treasury.govt.nz/)
- Story: Health and superannuation are the two fastest-growing slices of government spending.
- Interaction: category toggle; hover.
- Critique: strength is the fiscal story; risk is that Treasury data is dense and needs a plain-language data note.

### viz-019 Energy consumption by fuel

- Chart: area
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Oil and gas dominate energy use while electricity's share stays flat.
- Interaction: fuel toggle; hover.
- Critique: strength is the fuel mix; risk is that consumption and generation are easy to confuse, so label clearly.

### viz-020 Waste to landfill by material

- Chart: area
- Source: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- Story: Construction and demolition waste is the biggest and fastest-growing stream.
- Interaction: material toggle; hover.
- Critique: strength is a surprising leader; risk is that waste data is patchy before 2009.

## Bar

### viz-021 Top export destinations

- Chart: bar
- Source: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- Story: China overtook Australia as the top export market, and the bar chart shows the handover.
- Interaction: year slider; sort toggle.
- Critique: strength is the China story; risk is that rankings flip with exchange rates, so note the currency.

### viz-022 Regional population growth

- Chart: bar
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Auckland and the Bay of Plenty grew while some regions shrank between censuses.
- Interaction: sort toggle; hover.
- Critique: strength is the regional divide; risk is that census-to-census change hides within-region moves.

### viz-023 House price by region

- Chart: bar
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: Auckland and Wellington prices sit far above the rest, and the gap widened after 2015.
- Interaction: sort toggle; year slider.
- Critique: strength is the regional gap; risk is that median prices hide what is actually selling.

### viz-024 Top tourist source countries

- Chart: bar
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Australia sends the most visitors, but the US and India are the fastest-growing sources.
- Interaction: year slider; sort toggle.
- Critique: strength is the source-market ranking; risk is that 2020-21 rows are near zero and need a note.

### viz-025 Crime rates by region

- Chart: bar
- Source: Police statistics (https://www.police.govt.nz/)
- Story: Crime rates vary more than threefold across regions, and the ranking is not what most people expect.
- Interaction: offence-type filter; sort toggle.
- Critique: strength is the counterintuitive ranking; risk is that Police data changed recording standards in 2014.

### viz-026 Average income by region

- Chart: bar
- Source: Stats NZ income (https://www.stats.govt.nz/topics/income/)
- Story: Wellington and Auckland lead median incomes, and the gap to the regions has widened.
- Interaction: sort toggle; hover.
- Critique: strength is the regional divide; risk is that medians hide the distribution, so pair with viz-042.

### viz-027 Electricity price by region

- Chart: bar
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Electricity prices vary by region, and the gap between cheapest and priciest is a full third of the average bill.
- Interaction: sort toggle; year slider.
- Critique: strength is a cost-of-living angle; risk is that regional price data is published with a lag.

### viz-028 Top companies by revenue

- Chart: bar
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: A handful of companies earn more than the rest of the top 50 combined.
- Interaction: sort toggle; hover.
- Critique: strength is the concentration story; risk is that revenue data is confidentialised for large firms.

### viz-029 Birthplace of residents

- Chart: bar
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: India and China have overtaken the UK as the most common overseas birthplaces.
- Interaction: year toggle; sort toggle.
- Critique: strength is the migration story; risk is that birthplace categories changed between censuses.

### viz-030 Alcohol consumption by type

- Chart: bar
- Source: Stats NZ health (https://www.stats.govt.nz/topics/health/)
- Story: Beer has fallen for decades while wine and spirits rose, and the total has barely moved.
- Interaction: sort toggle; year slider.
- Critique: strength is the taste shift; risk is that consumption data comes from surveys with wide error margins.

## Scatter

### viz-031 House price vs income by region

- Chart: scatter (bubble by population)
- Source: Stats NZ housing and income (https://www.stats.govt.nz/topics/housing/)
- Story: Regions cluster into affordable and unaffordable groups, with Auckland alone in the corner.
- Interaction: hover; region highlight.
- Critique: strength is the affordability clusters; risk is that two variables from different surveys need a data note.

### viz-032 Quake magnitude vs depth

- Chart: scatter
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: Shallow quakes are the ones people feel, and the scatter shows the depth-magnitude trade-off.
- Interaction: time filter; hover.
- Critique: strength is a live dataset; risk is that the API caps results, so fetch by time window.

### viz-033 GDP per capita vs population growth

- Chart: scatter
- Source: Stats NZ GDP and population (https://www.stats.govt.nz/topics/gross-domestic-product/)
- Story: Fast-growing regions are not the richest ones, and the scatter shows the split.
- Interaction: hover; year slider.
- Critique: strength is the growth-quality question; risk is that regional GDP is published with a long lag.

### viz-034 Temperature vs rainfall by station

- Chart: scatter
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: The driest stations are the warmest, and the scatter shows the climate gradient from north to south.
- Interaction: station filter; hover.
- Critique: strength is the climate gradient; risk is that station records have different start dates.

### viz-035 Farm size vs production

- Chart: scatter
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Bigger farms do not always produce more, and the scatter shows the outliers.
- Interaction: hover; commodity filter.
- Critique: strength is the outlier story; risk is that farm surveys are sample-based with big error bars.

### viz-036 Population density vs house price

- Chart: scatter
- Source: Stats NZ housing and 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Denser places are pricier, but the relationship breaks down for tourist towns.
- Interaction: hover; region highlight.
- Critique: strength is the density-price link; risk is that tourist towns break the pattern and need explaining.

### viz-037 Emissions per capita vs GDP

- Chart: scatter
- Source: Stats NZ environment and GDP (https://www.stats.govt.nz/topics/environment/)
- Story: Richer regions emit more per person, but the relationship is weaker than people expect.
- Interaction: hover; year slider.
- Critique: strength is the decoupling question; risk is that regional emissions data is estimated, not measured.

### viz-038 Tourism spend vs visitor numbers by region

- Chart: scatter (bubble by spend)
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Queenstown pulls far more spend per visitor than anywhere else.
- Interaction: hover; region highlight.
- Critique: strength is the spend-per-visitor outlier; risk is that regional tourism data is modelled.

### viz-039 Age vs income by region

- Chart: scatter
- Source: Stats NZ income and 2023 census (https://www.stats.govt.nz/topics/income/)
- Story: Older regions are not richer ones, and the scatter shows the retirement belt.
- Interaction: hover; region highlight.
- Critique: strength is the ageing-vs-income split; risk is that median age hides the working-age share.

### viz-040 Quake frequency vs magnitude

- Chart: scatter (log-log)
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: Small quakes vastly outnumber big ones, and the log-log line is the Gutenberg-Richter law in action.
- Interaction: log toggle; hover.
- Critique: strength is a real scientific law visible in data; risk is that the smallest magnitudes are under-detected.

## Donut

### viz-041 Electricity generation mix

- Chart: donut
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Hydro is still the biggest slice, but renewables together now pass half of generation.
- Interaction: slice expand; year slider.
- Critique: strength is the renewables share; risk is that a donut hides the time dimension, so pair with viz-011.

### viz-042 Export commodity share

- Chart: donut
- Source: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- Story: Dairy, meat, and forestry are still the export core, but their combined share is shrinking.
- Interaction: slice expand; year slider.
- Critique: strength is the commodity mix; risk is that the top slices dwarf the rest, so cap the legend.

### viz-043 Population by ethnicity

- Chart: donut
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: European is still the largest group, but the multi-ethnic share is the fastest-growing slice.
- Interaction: slice expand; year toggle.
- Critique: strength is the identity story; risk is that ethnicity totals exceed 100 percent because people identify with more than one.

### viz-044 Land use share

- Chart: donut
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Pasture covers more than a third of the country, more than any other land use.
- Interaction: slice expand; hover.
- Critique: strength is the pasture dominance; risk is that land-use categories overlap, so define them in the note.

### viz-045 Energy source share

- Chart: donut
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Oil is the single biggest energy source, ahead of electricity, and most of it is petrol and diesel.
- Interaction: slice expand; hover.
- Critique: strength is the oil dependence; risk is that primary energy and electricity are easy to confuse.

### viz-046 Government revenue by source

- Chart: donut
- Source: Treasury (https://www.treasury.govt.nz/)
- Story: Income tax is more than half of government revenue, and GST is the second-biggest slice.
- Interaction: slice expand; year slider.
- Critique: strength is the tax mix; risk is that Treasury classifications change, so pin the year.

### viz-047 Household spending by category

- Chart: donut
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: Housing and food take the biggest slices of household spending, and their share keeps growing.
- Interaction: slice expand; year slider.
- Critique: strength is the cost-of-living angle; risk is that the spending survey is small and volatile.

### viz-048 Waste composition

- Chart: donut
- Source: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- Story: Construction waste is the biggest slice of landfill, ahead of household rubbish.
- Interaction: slice expand; hover.
- Critique: strength is the surprising leader; risk is that waste categories changed in 2016.

### viz-049 Transport mode share

- Chart: donut
- Source: Stats NZ transport (https://www.stats.govt.nz/topics/transport/)
- Story: Cars carry most commuters, and the share has barely moved in 20 years.
- Interaction: slice expand; year toggle.
- Critique: strength is the car dominance; risk is that the census commute question changed wording.

### viz-050 Religion share

- Chart: donut
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: No religion is now the largest group, overtaking Christianity for the first time.
- Interaction: slice expand; year toggle.
- Critique: strength is the secular shift; risk is that the religion question changed between censuses.

## Treemap

### viz-051 Government spending by department

- Chart: treemap
- Source: Treasury (https://www.treasury.govt.nz/)
- Story: Health, education, and social security are the three giant blocks of government spending.
- Interaction: drill-down by department; hover.
- Critique: strength is the budget scale; risk is that department names change, so use the current year.

### viz-052 Export value by commodity

- Chart: treemap
- Source: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- Story: Dairy is the biggest block, but the long tail of commodities is bigger than any single one.
- Interaction: drill-down by category; hover.
- Critique: strength is the long tail; risk is that commodity codes change, so aggregate to category level.

### viz-053 Population by region

- Chart: treemap
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Auckland is a third of the country's population, visible as one giant block.
- Interaction: drill-down by territorial authority; hover.
- Critique: strength is the Auckland dominance; risk is that small regions become unreadable slivers.

### viz-054 Land area by region

- Chart: treemap
- Source: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- Story: The South Island regions are huge on the map but hold a fraction of the people.
- Interaction: drill-down; hover.
- Critique: strength is the land-vs-people contrast; risk is that it invites comparison with viz-053, so pair them.

### viz-055 Company count by industry

- Chart: treemap
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: Construction and professional services are the biggest blocks of the business register.
- Interaction: drill-down by industry; hover.
- Critique: strength is the business mix; risk is that the register counts dormant companies too.

### viz-056 Building consents by region

- Chart: treemap
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: Auckland consents dwarf every other region, and the block grows with each housing cycle.
- Interaction: drill-down by region; year slider.
- Critique: strength is the housing supply story; risk is that consents are not completions.

### viz-057 Tourism spend by region

- Chart: treemap
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Auckland and Queenstown take the biggest blocks of tourism spend.
- Interaction: drill-down by region; hover.
- Critique: strength is the regional concentration; risk is that tourism spend is modelled, not counted.

### viz-058 Emissions by sector

- Chart: treemap
- Source: Stats NZ environment (https://www.stats.govt.nz/topics/environment/)
- Story: Agriculture is the single biggest emissions block, ahead of transport and energy.
- Interaction: drill-down by sector; hover.
- Critique: strength is the agriculture dominance; risk is that methane and CO2 are different gases, so note the metric.

### viz-059 Employment by industry

- Chart: treemap
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: Health and retail are the biggest employment blocks, and manufacturing keeps shrinking.
- Interaction: drill-down by industry; hover.
- Critique: strength is the jobs mix; risk is that industry classification changes break the time series.

### viz-060 Species count by class

- Chart: treemap
- Source: NZOR (https://www.nzor.org.nz/)
- Story: Insects dominate the species register, outnumbering every other class combined.
- Interaction: drill-down by class; search.
- Critique: strength is the biodiversity mix; risk is that the register is incomplete for some groups, so note coverage.

## Map

### viz-061 Population density by region

- Chart: map (choropleth)
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: The map is mostly empty, with density concentrated in Auckland, Wellington, and Christchurch.
- Interaction: hover; density scale toggle.
- Critique: strength is the empty-map story; risk is that regional choropleths hide the urban-rural split.

### viz-062 House price by region

- Chart: map (choropleth)
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: The price map is a gradient from Auckland and Queenstown outward.
- Interaction: hover; year slider.
- Critique: strength is the price geography; risk is that regional medians hide local variation.

### viz-063 Unemployment by region

- Chart: map (choropleth)
- Source: Stats NZ labour market (https://www.stats.govt.nz/topics/labour-market/)
- Story: Unemployment is highest in the east coast regions and lowest in the main cities.
- Interaction: hover; year slider.
- Critique: strength is the regional divide; risk is that small regions have wide confidence intervals.

### viz-064 Rainfall by station

- Chart: map (bubble)
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: The west coast of the South Island is the wettest place in the country, visible as giant bubbles.
- Interaction: station filter; hover.
- Critique: strength is the rain shadow; risk is that station coverage is sparse in the far north.

### viz-065 Temperature anomaly by station

- Chart: map (bubble by anomaly)
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: Nearly every station is warmer than its 1981-2010 average, and the north is warming fastest.
- Interaction: year slider; hover.
- Critique: strength is the warming geography; risk is that anomalies need a long baseline to be meaningful.

### viz-066 Sheep density by region

- Chart: map (choropleth)
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Sheep density is highest in the east coast regions, not the South Island as people assume.
- Interaction: hover; year slider.
- Critique: strength is the counterintuitive geography; risk is that density needs a land-area denominator, so state it.

### viz-067 Dairy cow density by region

- Chart: map (choropleth)
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Waikato and Canterbury carry the dairy herd, and the map shows the two clusters.
- Interaction: hover; year slider.
- Critique: strength is the dairy geography; risk is that it invites comparison with viz-066, so pair them.

### viz-068 Tourism spend by region

- Chart: map (choropleth)
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Tourism spend is concentrated in a few regions, and the map shows the tourist belt.
- Interaction: hover; year slider.
- Critique: strength is the regional concentration; risk is that modelled spend needs a confidence note.

### viz-069 Median age by region

- Chart: map (choropleth)
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: The retirement belt runs down the east coast and up through the far north.
- Interaction: hover; year toggle.
- Critique: strength is the ageing geography; risk is that median age hides the youth share.

### viz-070 Electricity generation by region

- Chart: map (bubble by capacity)
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: Hydro stations cluster in the South Island and the central North Island, and the bubbles show it.
- Interaction: source filter; hover.
- Critique: strength is the generation geography; risk is that station-level data is published with a lag.

## Histogram

### viz-071 House price distribution

- Chart: histogram
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: House prices are a long right tail, with the bulk of sales far below the headline average.
- Interaction: bin slider; region filter.
- Critique: strength is the mean-vs-median lesson; risk is that sales data is not the same as the price index.

### viz-072 Income distribution

- Chart: histogram
- Source: Stats NZ income (https://www.stats.govt.nz/topics/income/)
- Story: Income is a right-skewed curve, and the top decile is a long thin tail.
- Interaction: bin slider; region filter.
- Critique: strength is the inequality shape; risk is that income data is top-coded for privacy.

### viz-073 Quake magnitude distribution

- Chart: histogram
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: The magnitude histogram is a smooth decay curve, with a bump where the Canterbury sequence added thousands of small quakes.
- Interaction: bin slider; time filter.
- Critique: strength is a live dataset; risk is that the smallest magnitudes are under-detected.

### viz-074 Age distribution

- Chart: histogram
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: The population pyramid has a bulge at 50-60 and a hollow at 20-30 where Kiwis left.
- Interaction: year slider; sex toggle.
- Critique: strength is the pyramid shape; risk is that census years are irregular, so mark the gaps.

### viz-075 House size distribution

- Chart: histogram
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: New houses cluster at 150-200 square metres, and the cluster has shifted up over time.
- Interaction: bin slider; year filter.
- Critique: strength is the McMansion story; risk is that size data only covers new consents.

### viz-076 Commute time distribution

- Chart: histogram
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Most commutes are under 30 minutes, but the long tail of 60-plus minute commutes is growing.
- Interaction: bin slider; region filter.
- Critique: strength is the commute story; risk is that the census question changed wording in 2018.

### viz-077 Rent distribution

- Chart: histogram
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: Rents cluster in a narrow band, and the whole curve has shifted right since 2015.
- Interaction: bin slider; region filter.
- Critique: strength is the rent squeeze; risk is that rent data comes from bond records, not all tenancies.

### viz-078 Farm size distribution

- Chart: histogram
- Source: Stats NZ agriculture (https://www.stats.govt.nz/topics/agriculture/)
- Story: Most farms are small, but the biggest farms hold most of the land.
- Interaction: bin slider; farm-type filter.
- Critique: strength is the land concentration; risk is that farm surveys are sample-based.

### viz-079 Company size distribution

- Chart: histogram
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: The business register is a power law, with a handful of giants and a long tail of micro firms.
- Interaction: bin slider; industry filter.
- Critique: strength is the power-law shape; risk is that the register counts dormant companies.

### viz-080 Temperature distribution by station

- Chart: histogram
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: Daily temperatures are a bell curve that shifts and widens from south to north.
- Interaction: station filter; season toggle.
- Critique: strength is the climate shape; risk is that station records have different lengths.

## Radial

### viz-081 Quakes by month

- Chart: radial (rose)
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: Quakes cluster in certain months, and the rose shows the seasonal pattern.
- Interaction: year filter; magnitude filter.
- Critique: strength is the seasonal question; risk is that the pattern may be noise, so show confidence.

### viz-082 Births by month

- Chart: radial (rose)
- Source: Stats NZ population (https://www.stats.govt.nz/topics/population/)
- Story: Births peak in spring and trough in winter, and the rose shows the seasonality.
- Interaction: year filter; hover.
- Critique: strength is a gentle seasonal pattern; risk is that the effect is small, so scale honestly.

### viz-083 Tourism arrivals by month

- Chart: radial (rose)
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: Visitors peak in summer and trough in winter, and the rose shows the seasonality.
- Interaction: year filter; source-country filter.
- Critique: strength is the seasonal tourism story; risk is that the 2020-21 years break the pattern, so mark them.

### viz-084 Electricity demand by hour

- Chart: radial
- Source: Transpower (https://www.transpower.co.nz/)
- Story: Demand peaks at 7pm and troughs at 4am, and the daily ring shows the shape.
- Interaction: day filter; hover.
- Critique: strength is a live dataset; risk is that Transpower data is dense, so aggregate to hourly.

### viz-085 Rainfall by month

- Chart: radial (rose)
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: Rainfall is winter-heavy in the north and summer-heavy in the south, and the roses show the flip.
- Interaction: station filter; hover.
- Critique: strength is the climate contrast; risk is that station coverage is uneven.

### viz-086 Retail sales by month

- Chart: radial (rose)
- Source: Stats NZ business (https://www.stats.govt.nz/topics/business/)
- Story: Retail sales spike in December and trough in January, and the rose shows the Christmas bump.
- Interaction: year filter; industry filter.
- Critique: strength is the Christmas story; risk is that seasonal adjustment removes the very pattern you want, so use raw data.

### viz-087 House sales by month

- Chart: radial (rose)
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: House sales follow the school year, peaking in autumn and troughing in winter.
- Interaction: year filter; hover.
- Critique: strength is the seasonal rhythm; risk is that the pattern shifts with market cycles.

### viz-088 Fires by month

- Chart: radial (rose)
- Source: Fire and Emergency NZ (https://fireandemergency.nz/)
- Story: Vegetation fires peak in summer while structure fires peak in winter, and the roses show both.
- Interaction: fire-type filter; hover.
- Critique: strength is the two-season story; risk is that incident data is published with a lag.

### viz-089 Wind speed by hour

- Chart: radial
- Source: NIWA climate data (https://niwa.co.nz/)
- Story: Wind peaks in the afternoon and dies overnight, and the daily ring shows the pattern.
- Interaction: station filter; season toggle.
- Critique: strength is the daily wind story; risk is that wind data is gusty, so use hourly means.

### viz-090 Quake depth distribution

- Chart: radial
- Source: GeoNet API (https://api.geonet.org.nz/)
- Story: Quakes cluster at shallow depths under the North Island and deep under the South Island.
- Interaction: magnitude filter; hover.
- Critique: strength is the subduction story; risk is that depth estimates are uncertain for small quakes.

## Slope

### viz-091 Regional population rank change

- Chart: slope
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Auckland and Queenstown climbed the population ranks while the west coast fell.
- Interaction: hover; region highlight.
- Critique: strength is the rank-change story; risk is that ranks hide absolute change, so show both.

### viz-092 House price rank by region

- Chart: slope
- Source: Stats NZ housing (https://www.stats.govt.nz/topics/housing/)
- Story: Queenstown overtook Wellington for the second-priciest region, and the slope shows the crossing.
- Interaction: hover; region highlight.
- Critique: strength is the overtaking story; risk is that rank changes are noisy for mid-ranked regions.

### viz-093 Top export destination rank

- Chart: slope
- Source: Stats NZ international trade via Infoshare (https://infoshare.stats.govt.nz/)
- Story: China climbed from nowhere to the top export market, overtaking Australia and the US.
- Interaction: hover; country highlight.
- Critique: strength is the China rise; risk is that commodity price swings distort the ranking.

### viz-094 Income rank by region

- Chart: slope
- Source: Stats NZ income (https://www.stats.govt.nz/topics/income/)
- Story: Wellington overtook Auckland for the top median income, and the slope shows the swap.
- Interaction: hover; region highlight.
- Critique: strength is the capital-vs-city story; risk is that median income is volatile for small regions.

### viz-095 Unemployment rank by region

- Chart: slope
- Source: Stats NZ labour market (https://www.stats.govt.nz/topics/labour-market/)
- Story: Regions swap unemployment ranks every cycle, and the slope shows the churn.
- Interaction: hover; region highlight.
- Critique: strength is the churn story; risk is that small regions have wide confidence intervals.

### viz-096 City population rank

- Chart: slope
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: Tauranga overtook Dunedin and Hamilton to become the fifth-biggest city.
- Interaction: hover; city highlight.
- Critique: strength is the urban growth story; risk is that city boundaries changed, so use consistent definitions.

### viz-097 Tourism arrivals rank by country

- Chart: slope
- Source: Stats NZ tourism (https://www.stats.govt.nz/topics/tourism/)
- Story: India and the US climbed the visitor ranks while Japan and Korea fell.
- Interaction: hover; country highlight.
- Critique: strength is the source-market churn; risk is that 2020-21 breaks the series, so use pre-2020 endpoints.

### viz-098 Electricity price rank by region

- Chart: slope
- Source: MBIE energy statistics (https://www.mbie.govt.nz/)
- Story: South Island regions fell down the price ranks as transmission costs rose.
- Interaction: hover; region highlight.
- Critique: strength is the price geography shift; risk is that regional price data is published with a lag.

### viz-099 Crime rate rank by region

- Chart: slope
- Source: Police statistics (https://www.police.govt.nz/)
- Story: Some regions climbed the crime ranks sharply after 2014 recording changes.
- Interaction: hover; region highlight.
- Critique: strength is the rank churn; risk is that recording-standard changes make the slope misleading, so note them.

### viz-100 Median age rank by region

- Chart: slope
- Source: Stats NZ 2023 census (https://www.stats.govt.nz/2023-census/)
- Story: The east coast regions climbed the age ranks while Auckland stayed young.
- Interaction: hover; region highlight.
- Critique: strength is the ageing geography; risk is that census-to-census change is small, so scale honestly.
