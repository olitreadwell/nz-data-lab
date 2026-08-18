# rabbit-boom — The Rabbit Boom

## Pitch

New Zealand's sheep flock keeps falling, but the rabbits in Hawke's Bay are doing fine:
night spotlight counts rose from 2.35 rabbits per kilometre in 2012 to 13.26 in 2021, a
fivefold boom in a decade. The bunnies are one of the country's oldest and most expensive
pests, and the only national-scale count series we have is the one Landcare Research keeps.

## Data source

Manaaki Whenua Landcare Research, `HawkesBayRabbits` dataset, published on data.govt.nz
(CC-BY-4.0): spotlight counts by farm site and year for Hawke's Bay monitoring transects,
downloaded at deploy time from the Landcare Research datastore
(`hbspotlightcountsbyyear.csv`). The page pools the per-site rows into one rate per year:
rabbits seen divided by kilometres driven, summed across all monitored sites, so years
with more sites stay comparable. The committed snapshot in
`apps/web/src/lib/fixtures/hawkes-bay-rabbit-spotlight-2012-2021.csv` backs the build when
the datastore is unreachable.

The dataset backs the 2024 Wildlife Research paper "A test of whether rabbit abundance
increases following predator control in a rural landscape" (DOI 10.1071/wr24043).

## Verdict

**alive** — the data is real, published, and the fivefold rise is exactly the surprising
story the pitch promises. The count is an index of abundance (rabbits seen per km at
night), not a census, and the page says so.

## What it looks like

Three stat cards (rabbits per km now, back in 2012, change since) above a bar chart of
the pooled rabbits-per-kilometre series 2012-2021, with a data-source footnote and a
table view of the same numbers.
