# Data tutorial docs (how to build a microsite from a source)

Backlog spec for the `data-tutorial` issue queue: human-readable how-to docs
so someone can read a microsite, then connect to the same data source and
build a similar site themselves.

## Why

The microsites run on roughly a dozen public NZ data sources. The connection
knowledge (endpoint, auth, query, adapter, chart recipe) currently lives in
code and in the loop skill, not in docs a reader can follow. A reader of a
story has no path from "here is the chart" to "here is how to fetch that
data yourself."

## Shape

One doc per data source under `docs/how-to/<source>.md`, plus an index at
`docs/how-to/README.md`. Per-source, not per-microsite: multiple microsites
share each source, and the connection knowledge is per source. A
per-microsite how-to would be ~90% duplicated boilerplate.

Each doc covers:

- What the source is and what it offers
- Access: endpoint, auth (API key or none), rate limits
- The exact query the microsite uses (concrete URL/params)
- The adapter in this repo (`@nzlab/nz-sources` or
  `apps/web/src/lib/live-sources.ts`) and how to call it
- A minimal copy-paste example: fetch, parse, render a chart
- Which microsites use it

## Sources to cover

Stats NZ Aotearoa Data Explorer, GeoNet, NZOR, data.govt.nz CKAN, DigitalNZ,
TradeMe, iNaturalist, GBIF, Wikipedia pageviews, Wikidata SPARQL, ArcGIS
(MfE), LINZ.

## Definition of done

- `docs/how-to/README.md` index
- One doc per source above, each with a working fetch example
- Each microsite's spec doc and `dataNote` link the source how-to
