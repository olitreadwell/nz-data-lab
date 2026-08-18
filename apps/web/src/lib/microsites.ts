import type { MicrositeAccent } from '@/components/microsite-styles';
import type { MicrositeReference } from '@/components/MicrositeReferences';

import { withHiddenMicrositesRemoved } from './hidden-microsites';

/** Who publishes the underlying data for a microsite story. */
export type MicrositeDataSource =
  | 'Stats NZ'
  | 'GeoNet'
  | 'NZ Organisms Register (NZOR)'
  | 'data.govt.nz'
  | 'DigitalNZ (National Library)'
  | 'Trade Me'
  | 'iNaturalist'
  | 'GBIF'
  | 'Wikipedia & Wikidata'
  | 'United Nations'
  | 'Auckland Council'
  | 'OpenStreetMap'
  | 'Environment Canterbury'
  | 'Hamilton City Council'
  | 'NZ Transport Agency (NZTA)'
  | 'Landcare Research';

/** The main visualisation used by a microsite story. */
export type MicrositeChartType =
  | 'Line chart'
  | 'Bar chart'
  | 'Rank / slope'
  | 'Map'
  | 'Search & table'
  | 'Tree'
  | 'Pyramid'
  | 'Histogram'
  | 'Scatter'
  | 'Rose / polar'
  | 'Sunburst'
  | 'Streamgraph'
  | 'Cycle plot'
  | 'Dumbbell'
  | 'Ridgeline'
  | 'Waffle'
  | 'Parallel coordinates'
  | 'Tile grid'
  | 'Dot plot'
  | 'Choropleth'
  | 'Marimekko'
  | 'Pareto'
  | 'Heatmap'
  | 'Strip chart'
  | 'Bar-in-bar';

/** The subject area a microsite story belongs to. */
export type MicrositeCategory =
  | 'Agriculture & farming'
  | 'Earthquakes & geology'
  | 'Biodiversity & nature'
  | 'Environment & geography'
  | 'Census & population'
  | 'Economy & business'
  | 'Tourism & travel'
  | 'Transport'
  | 'Education'
  | 'Open data & digital'
  | 'Society & community';

export interface MicrositeConfig {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: string[];
  accent: MicrositeAccent;
  dataSource: MicrositeDataSource;
  chartType: MicrositeChartType;
  category: MicrositeCategory;
  dataNote: string;
  references: MicrositeReference[];
}

export const MICROSITES: MicrositeConfig[] = withHiddenMicrositesRemoved([
  {
    slug: 'sheep-index',
    label: 'Sheep index',
    eyebrow: '🐑 the sheep index',
    title: "New Zealand's national animal is in freefall.",
    description:
      'The national sheep flock has nearly halved since 1994, dropping from 49.5 million to 23.3 million by 2025. The series starts in 1994, the year the flock peaked. This page shows the real series, pulled from the Stats NZ Aotearoa Data Explorer at deploy time.',
    paragraphs: [
      'The real peak came earlier. In 1982 New Zealand counted 70 million sheep, more than 20 for every person. The flock has shrunk in almost every year since.',
      'In 2016 there were still six sheep for every person. By 2024 that was down to about four.',
    ],
    accent: 'amber',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional Council), national sheep total, fetched at deploy time via @nzlab/stats-nz, falling back to a committed snapshot when the API blocks the build runner; the site redeploys daily. Hover or drag across the chart to read the flock at any year.',
    references: [
      {
        label: 'Sheep number falls to six for each person (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/sheep-number-falls-to-six-for-each-person/',
        kind: 'data',
      },
      {
        label: 'Fewer sheep and dairy cattle in 2022 (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/fewer-sheep-and-dairy-cattle-in-2022/',
        kind: 'data',
      },
      {
        label: 'Sheep farming (Te Ara)',
        url: 'https://teara.govt.nz/en/sheep-farming',
        kind: 'history',
      },
      {
        label: 'The 1980s (NZ History)',
        url: 'https://nzhistory.govt.nz/culture/the-1980s',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'dairy-takeover',
    label: 'Dairy takeover',
    eyebrow: '🐄 the dairy takeover',
    title: 'The paddocks flipped from wool to milk.',
    description:
      'The sheep flock nearly halved while dairy cattle nearly doubled. The same paddocks that once grew wool now grow milk. The beef herd and deer herd shrank too.',
    paragraphs: [
      'The flip started in 1984, when the government stopped subsidising farming. Sheep farming lost its safety net. Dairy paid better, so paddocks switched.',
      "Canterbury led the way. The region's lamb flock gave way to dairy cows, and the same story played out across the country.",
    ],
    accent: 'sky',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional Council), national totals for sheep, dairy cattle, beef cattle, and deer. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'Canterbury lamb gives way to dairy (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/canterbury-lamb-gives-way-to-dairy/',
        kind: 'news',
      },
      {
        label: 'Dairy cattle numbers dip again (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/dairy-cattle-numbers-dip-again/',
        kind: 'data',
      },
      {
        label: 'Dairying and dairy products (Te Ara)',
        url: 'https://teara.govt.nz/en/dairying-and-dairy-products',
        kind: 'history',
      },
      {
        label: 'Government and agriculture (Te Ara)',
        url: 'https://teara.govt.nz/en/government-and-agriculture',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'vineyard-boom',
    label: 'Vineyard boom',
    eyebrow: '🍇 the vineyard boom',
    title: 'Wine grapes took over the orchard.',
    description:
      'In 1994 wine grapes covered 7,160 hectares. By 2024 that was 37,627 hectares, a five-fold boom. Wine grapes now cover more land than apples, kiwifruit, and avocados combined.',
    paragraphs: [
      'Sauvignon Blanc, with its grassy smell, put New Zealand wine in the international spotlight in the 1980s. Wine exports have boomed since.',
      'For decades, tough licensing laws and a taste for fortified wine kept the industry small. Sauvignon Blanc changed that.',
    ],
    accent: 'purple',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_002 (Horticulture by Regional Council), national area in hectares for wine grapes, kiwifruit, apples, and avocados. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'Volume of wine on the rise (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/volume-of-wine-on-the-rise/',
        kind: 'news',
      },
      {
        label: 'Livestock numbers fall while fruit area increases (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/livestock-numbers-fall-over-the-last-10-years-while-area-planted-in-fruit-increases/',
        kind: 'data',
      },
      {
        label: 'Wine (Te Ara)',
        url: 'https://teara.govt.nz/en/wine',
        kind: 'history',
      },
      {
        label: 'Farming in the economy (Te Ara)',
        url: 'https://teara.govt.nz/en/farming-in-the-economy',
        kind: 'culture',
      },
    ],
  },
  {
    slug: 'planting-bust',
    label: 'Planting bust',
    eyebrow: '🌲 the planting bust',
    title: 'We stopped planting trees, but kept chopping them down.',
    description:
      'New planting collapsed from 33,674 hectares in 2002 to 8,293 by 2018, down 75%. The harvested area kept climbing to 62,103 hectares. The forest is being eaten faster than it is being grown.',
    paragraphs: [
      'The trees that feed the mills are radiata pine, planted in vast forests from the 1920s. The government sold most of its forests in 1990.',
      'Some forest land is now being converted back to farms. The One Billion Trees programme is trying to reverse the trend.',
    ],
    accent: 'emerald',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_001 (Forestry by Regional Council), national new planting and exotic timber harvested area in hectares. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'More land on Māori farms used for forest plantation (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/more-land-on-maori-farms-used-for-forest-plantation/',
        kind: 'data',
      },
      {
        label: 'One Billion Trees Programme (MPI)',
        url: 'https://www.mpi.govt.nz/forestry/funding-and-programmes/one-billion-trees-programme/',
        kind: 'news',
      },
      {
        label: 'Exotic forestry (Te Ara)',
        url: 'https://teara.govt.nz/en/exotic-forestry',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'kiwifruit-overtake',
    label: 'Kiwifruit overtake',
    eyebrow: '🥝 the kiwifruit overtake',
    title: 'Kiwifruit overtook the apple.',
    description:
      'In 1994 apples covered 15,257 hectares and kiwifruit 12,174. By 2024 kiwifruit covered 14,514 hectares while apples had fallen to 9,522. The orchard flipped.',
    paragraphs: [
      'Kiwifruit vines came to New Zealand in 1904, when Isabel Fraser brought seeds back from China. The first commercial orchards appeared in the 1930s, and the green-fleshed Hayward variety became the export standard.',
      'The apple orchard shrank as land moved to kiwifruit and other crops. The kiwifruit boom survived a bacterial disease, PSA, that hit green vines in 2010 and pushed growers into the gold variety.',
    ],
    accent: 'lime',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_002 (Horticulture by Regional Council), national area in hectares for kiwifruit, apples, and avocados. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'Kiwifruit (Te Ara)',
        url: 'https://teara.govt.nz/en/kiwifruit',
        kind: 'history',
      },
      {
        label: 'Livestock numbers fall while fruit area increases (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/livestock-numbers-fall-over-the-last-10-years-while-area-planted-in-fruit-increases/',
        kind: 'data',
      },
      {
        label: 'Horticulture (Te Ara)',
        url: 'https://teara.govt.nz/en/horticulture',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'deer-boom-bust',
    label: 'Deer boom and bust',
    eyebrow: '🦌 the deer boom and bust',
    title: 'The deer herd boomed, then bust.',
    description:
      'Farmed deer went from 1.23 million in 1994 to a peak of 1.76 million in 2004, then fell to 712,000 by 2025. The herd has more than halved from its peak.',
    paragraphs: [
      'Deer farming began in the 1970s, when farmers rounded up wild deer for velvet and venison. The industry grew fast through the 1990s as venison exports to Europe and velvet exports to Asia took off.',
      'The bust came as returns fell and paddocks switched to dairy. The deer herd has now shrunk for two decades straight.',
    ],
    accent: 'violet',
    dataSource: 'Stats NZ',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional Council), national farmed deer total. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'Deer farming (Te Ara)',
        url: 'https://teara.govt.nz/en/deer-farming',
        kind: 'history',
      },
      {
        label: 'Sheep number falls to six for each person (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/sheep-number-falls-to-six-for-each-person/',
        kind: 'data',
      },
      {
        label: 'Farming in the economy (Te Ara)',
        url: 'https://teara.govt.nz/en/farming-in-the-economy',
        kind: 'culture',
      },
    ],
  },
  {
    slug: 'shake-index',
    label: 'Shake index',
    eyebrow: '🌏 the shake index',
    title: 'New Zealand shakes 20,000 times a year.',
    description:
      'GeoNet locates around 20,000 earthquakes in and around New Zealand each year. Most are too small to feel. This page shows the recent felt quakes from the GeoNet API, fetched at deploy time.',
    paragraphs: [
      'Around 250 quakes a year are big enough to be felt. The biggest known quake in New Zealand was the 1855 Wairarapa earthquake, magnitude 8.2, which shifted around 5,000 square kilometres of land.',
      'Each bubble on the map is one recent quake. Drag the sliders to set the smallest magnitude and the deepest quake you want to see. Colour shows how strongly the quake was felt.',
    ],
    accent: 'rose',
    dataSource: 'GeoNet',
    chartType: 'Map',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet API (api.geonet.org.nz/quake?MMI=3), recent felt quakes, fetched at deploy time via @nzlab/nz-sources, falling back to a committed snapshot when the API blocks the build runner. The site redeploys daily.',
    references: [
      {
        label: 'Earthquake FAQ (GeoNet)',
        url: 'https://www.geonet.org.nz/earthquake/faq',
        kind: 'data',
      },
      {
        label: 'Quakes (GeoNet)',
        url: 'https://www.geonet.org.nz/earthquake',
        kind: 'data',
      },
      {
        label: 'Earthquakes (Te Ara)',
        url: 'https://teara.govt.nz/en/earthquakes',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'species-register',
    label: 'Species register',
    eyebrow: '🦎 the species register',
    title: "New Zealand's species register holds 170,151 names.",
    description:
      'The NZ Organisms Register is the national list of scientific names for every known species in New Zealand. Search it live: the register answers from the browser.',
    paragraphs: [
      'Every species has a scientific name, and New Zealand keeps them all in one register. The register holds 170,151 names, from kiwi to kauri.',
      'Type a name and the register returns the matches, grouped by class. The donut shows which groups they belong to.',
    ],
    accent: 'teal',
    dataSource: 'NZ Organisms Register (NZOR)',
    chartType: 'Search & table',
    category: 'Biodiversity & nature',
    dataNote:
      'Data: NZ Organisms Register (data.nzor.org.nz), searched live from the browser. The register holds 170,151 names.',
    references: [
      {
        label: 'NZ Organisms Register (NZOR)',
        url: 'https://www.nzor.org.nz/',
        kind: 'data',
      },
      {
        label: 'Native animals (DOC)',
        url: 'https://www.doc.govt.nz/nature/native-animals/',
        kind: 'data',
      },
      {
        label: 'Native plants and animals (Te Ara)',
        url: 'https://teara.govt.nz/en/native-plants-and-animals',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'open-data-catalogue',
    label: 'Open data catalogue',
    eyebrow: '📂 the open data catalogue',
    title: "The government's open data catalogue holds 31,915 datasets.",
    description:
      'data.govt.nz is the national catalogue of open government data. Search it live: the catalogue answers from the browser.',
    paragraphs: [
      'Agencies publish thousands of datasets, from water quality to weather to health. The catalogue holds 31,915 of them.',
      'Type a topic and the catalogue returns matching datasets. The treemap shows which agencies publish them.',
    ],
    accent: 'indigo',
    dataSource: 'data.govt.nz',
    chartType: 'Search & table',
    category: 'Open data & digital',
    dataNote:
      'Data: data.govt.nz CKAN API (catalogue.data.govt.nz), searched live from the browser. The catalogue holds 31,915 datasets.',
    references: [
      {
        label: 'data.govt.nz',
        url: 'https://data.govt.nz/',
        kind: 'data',
      },
      {
        label: 'data.govt.nz catalogue',
        url: 'https://catalogue.data.govt.nz/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'digitised-memory',
    label: 'Digitised memory',
    eyebrow: '📜 the digitised memory',
    title: "Search 'gold' and the 1890s light up.",
    description:
      "DigitalNZ is the search engine for New Zealand's digitised collections. It searches records from libraries, museums, and archives. This page shows which decades the matches come from.",
    paragraphs: [
      'The collection is built from newspapers, photos, audio, and maps. Papers Past alone holds millions of pages of old newspapers, which is why the 1860s to 1920s dominate so many searches.',
      "Search 'gold' and the histogram peaks in the 1890s, with 427,164 matching records. The 1860s, 1870s, and 1880s each hold more than 100,000 matching records too.",
    ],
    accent: 'cyan',
    dataSource: 'DigitalNZ (National Library)',
    chartType: 'Search & table',
    category: 'Open data & digital',
    dataNote:
      "Data: DigitalNZ (National Library) v3 API, searched live from the browser. 'gold' matches 1,977,021 records; the 1890s hold 427,164 of them. Drag the sliders to narrow the decades.",
    references: [
      {
        label: 'DigitalNZ',
        url: 'https://www.digitalnz.org/',
        kind: 'data',
      },
      {
        label: 'National Library of New Zealand',
        url: 'https://natlib.govt.nz/',
        kind: 'data',
      },
      {
        label: 'Papers Past',
        url: 'https://paperspast.natlib.govt.nz/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'online-garage-sale',
    label: 'Online garage sale',
    eyebrow: '🛒 the online garage sale',
    title: "Trade Me's category tree has 5,589 leaf categories.",
    description:
      "Trade Me is New Zealand's online marketplace. Its category tree organises every listing, from cars to collectables. This page shows the tree, fetched live from the Trade Me API.",
    paragraphs: [
      'Home & living is the biggest branch with 581 leaf categories. Motors is close behind with 560, and Sports has 535.',
      'Type to filter the tree, or click a branch to expand it. The radial chart shows the top-level branches by leaf count.',
    ],
    accent: 'fuchsia',
    dataSource: 'Trade Me',
    chartType: 'Tree',
    category: 'Open data & digital',
    dataNote:
      'Data: Trade Me public category tree (api.trademe.co.nz/v1/Categories.json), fetched live from the browser. The tree holds 5,589 leaf categories.',
    references: [
      {
        label: 'Trade Me',
        url: 'https://www.trademe.co.nz/',
        kind: 'data',
      },
      {
        label: 'About Trade Me',
        url: 'https://www.trademe.co.nz/about',
        kind: 'history',
      },
      {
        label: 'Trade Me Motors',
        url: 'https://www.trademe.co.nz/motors',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'backyard-species-census',
    label: 'Backyard species census',
    eyebrow: '🐦 the backyard census',
    title: 'New Zealanders have logged 4.3 million observations of 23,828 species.',
    description:
      'iNaturalist is a citizen science network. In New Zealand, people have logged 4,342,223 observations of 23,828 species, from kākā to kauri. This page shows the live counts by group.',
    paragraphs: [
      'Plants lead the census with 9,840 species and 2,025,138 observations. Insects are second with 5,605 species and 800,635 observations.',
      'Birds punch above their weight: 657 species drew 544,818 observations, the most per species of any group.',
    ],
    accent: 'emerald',
    dataSource: 'iNaturalist',
    chartType: 'Bar chart',
    category: 'Biodiversity & nature',
    dataNote:
      'Data: iNaturalist API, New Zealand place (id 6803), fetched live from the browser. Bubble size shows how many observers logged each group.',
    references: [
      {
        label: 'iNaturalist API docs',
        url: 'https://api.inaturalist.org/v1/docs/',
        kind: 'data',
      },
      {
        label: 'iNaturalist New Zealand place',
        url: 'https://api.inaturalist.org/v1/places/6803',
        kind: 'data',
      },
      {
        label: 'Native animals (DOC)',
        url: 'https://www.doc.govt.nz/nature/native-animals/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'species-record-ledger',
    label: 'Species record ledger',
    eyebrow: '🧬 the species record ledger',
    title: 'The record ledger flipped from fungi to animals.',
    description:
      'GBIF is the global species record database. New Zealand contributed 748,744 records in 2014 and 1,920,171 in 2024. The mix flipped: fungi fell from 61% of records to 5%, while animals rose to 78%.',
    paragraphs: [
      'Fungi dominated the 2014 ledger with 458,989 records, 61% of the total. By 2024 that had fallen to 98,269 records, 5%.',
      'Animal records grew from 208,004 to 1,496,447, a 7.2-fold rise, as museums and citizen science projects digitised their collections.',
    ],
    accent: 'indigo',
    dataSource: 'GBIF',
    chartType: 'Bar chart',
    category: 'Biodiversity & nature',
    dataNote:
      'Data: GBIF occurrence search API, country NZ, records by kingdom for 2014 and 2024, fetched live from the browser.',
    references: [
      {
        label: 'GBIF occurrence API',
        url: 'https://techdocs.gbif.org/en/openapi/v1/occurrence',
        kind: 'data',
      },
      {
        label: 'GBIF New Zealand occurrence search',
        url: 'https://api.gbif.org/v1/occurrence/search?country=NZ',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'what-the-world-reads',
    label: 'What the world reads',
    eyebrow: '🌏 what the world reads',
    title: 'The world reads about New Zealand up to 21,562 times a day.',
    description:
      'The English Wikipedia page for New Zealand gets up to 21,562 views in a day. This page shows the daily view ranges for 12 New Zealand topics, fetched live from Wikipedia.',
    paragraphs: [
      'The Lord of the Rings (film series) is the second most-read topic, with up to 10,438 daily views. Jacinda Ardern peaked at 8,429.',
      'Drag the slider to widen or narrow the window. The dot marks the latest day.',
    ],
    accent: 'sky',
    dataSource: 'Wikipedia & Wikidata',
    chartType: 'Bar chart',
    category: 'Open data & digital',
    dataNote:
      'Data: English Wikipedia pageviews API, last 60 days, fetched live from the browser. Each line spans the lowest to highest daily views in the window.',
    references: [
      {
        label: 'New Zealand (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/New_Zealand',
        kind: 'data',
      },
      {
        label: 'Wikipedia pageviews',
        url: 'https://en.wikipedia.org/wiki/Wikipedia:Pageviews',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'river-lengths',
    label: 'River lengths',
    eyebrow: '🏞️ the river lengths',
    title: "The Waikato is New Zealand's longest river at 425 km.",
    description:
      'Wikidata lists the length of every named New Zealand river. The Waikato tops the list at 425 km, and the ten longest rivers stretch 2,603 km end to end.',
    paragraphs: [
      'The Clutha is second at 338 km, and the Whanganui third at 290 km. Six of the top ten rivers are in the South Island.',
      'The waterfall chart adds each river to the running total. Toggle the top-N buttons to widen or narrow the list.',
    ],
    accent: 'cyan',
    dataSource: 'Wikipedia & Wikidata',
    chartType: 'Bar chart',
    category: 'Environment & geography',
    dataNote:
      'Data: Wikidata SPARQL query for New Zealand rivers (P31 river, P17 New Zealand, P2043 length), fetched live from the browser. Values outside 50-500 km are dropped as bad entries. The top-10 total is 2,603 km.',
    references: [
      {
        label: 'Wikidata river length query',
        url: 'https://query.wikidata.org/sparql?query=SELECT%20%3Friver%20%3FriverLabel%20%3Flength%20WHERE%20%7B%20%3Friver%20wdt%3AP31%20wd%3AQ4022%3B%20wdt%3AP17%20wd%3AQ664%3B%20wdt%3AP2043%20%3Flength.%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%20%7D%20ORDER%20BY%20DESC(%3Flength)%20LIMIT%2020',
        kind: 'data',
      },
      {
        label: 'Freshwater and estuaries (NIWA)',
        url: 'https://niwa.co.nz/freshwater-and-estuaries',
        kind: 'data',
      },
      {
        label: 'Rivers (Te Ara)',
        url: 'https://teara.govt.nz/en/rivers',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'peak-heights',
    label: 'Peak heights',
    eyebrow: '⛰️ the peak heights',
    title: "Aoraki is New Zealand's highest peak at 3,724 m.",
    description:
      "Wikidata lists the elevation of New Zealand's named peaks. Aoraki / Mount Cook tops the list at 3,724 m, and the ten highest peaks are all in the Southern Alps.",
    paragraphs: [
      'Mount Tasman is second at 3,497 m, and Mount Dampier third at 3,440 m. Six peaks rise above 3,200 m.',
      'The funnel narrows from the highest peak down. Toggle the top-N buttons to widen or narrow the list.',
    ],
    accent: 'violet',
    dataSource: 'Wikipedia & Wikidata',
    chartType: 'Bar chart',
    category: 'Environment & geography',
    dataNote:
      'Data: Wikidata SPARQL query for New Zealand peaks (P31 mountain, P17 New Zealand, P2044 elevation), fetched live from the browser. Values outside 1,000-4,000 m are dropped as bad entries. The top-10 total is 33,278 m.',
    references: [
      {
        label: 'Wikidata peak elevation query',
        url: 'https://query.wikidata.org/sparql?query=SELECT%20%3Fpeak%20%3FpeakLabel%20%3Felevation%20WHERE%20%7B%20%3Fpeak%20wdt%3AP31%20wd%3AQ8502%3B%20wdt%3AP17%20wd%3AQ664%3B%20wdt%3AP2044%20%3Felevation.%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%20%7D%20ORDER%20BY%20DESC(%3Felevation)%20LIMIT%2020',
        kind: 'data',
      },
      {
        label: 'Places to go (DOC)',
        url: 'https://www.doc.govt.nz/parks-and-recreation/places-to-go/',
        kind: 'data',
      },
      {
        label: 'Mountains (Te Ara)',
        url: 'https://teara.govt.nz/en/mountains',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'auckland-parks',
    label: 'Auckland parks',
    eyebrow: '🌳 the auckland parks',
    title: 'Auckland has 3,953 parks covering 53,677 hectares.',
    description:
      'Auckland Council maps every park it owns or maintains. The 3,953 parks cover 53,677 hectares, and two local boards hold most of the land.',
    paragraphs: [
      'Franklin holds 20,060 hectares of park land and Waitākere Ranges 18,339 hectares. Together they cover 72% of the total.',
      "The pie shows each local board's share. Toggle the top-N buttons to widen the view, or type to filter boards by name.",
    ],
    accent: 'emerald',
    dataSource: 'Auckland Council',
    chartType: 'Bar chart',
    category: 'Environment & geography',
    dataNote:
      'Data: Auckland Council Park Extents dataset (ArcGIS REST service), grouped by local board, fetched live from the browser. Park land is the maintained extent, not the legal reserve boundary.',
    references: [
      {
        label: 'Park Extents dataset (Auckland Council)',
        url: 'https://data-aucklandcouncil.opendata.arcgis.com/datasets/3135043373ba48b7a9b5240370cb53ac',
        kind: 'data',
      },
      {
        label: 'Auckland Council open data',
        url: 'https://data-aucklandcouncil.opendata.arcgis.com/',
        kind: 'data',
      },
      {
        label: 'Population (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/population/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'open-school-map',
    label: 'Open school map',
    eyebrow: '🏫 the open school map',
    title: 'New Zealand has 2,604 schools mapped on OpenStreetMap.',
    description:
      'OpenStreetMap maps 2,604 schools in New Zealand, from kura to universities. Most carry Ministry of Education tags, so the map reads like a school directory.',
    paragraphs: [
      'Primary schools lead with 1,713. Secondary schools number 323, and 131 composite schools span both primary and secondary years.',
      'State schools dominate with 2,075. Another 324 are state-integrated and 96 are private. Type a name to filter the map, or toggle an authority to hide it.',
    ],
    accent: 'amber',
    dataSource: 'OpenStreetMap',
    chartType: 'Bar chart',
    category: 'Education',
    dataNote:
      'Data: OpenStreetMap via the Overpass API, amenity=school in New Zealand, fetched live from the browser. 2,309 of the 2,604 schools carry Ministry of Education year tags (MOE:years).',
    references: [
      {
        label: 'OpenStreetMap',
        url: 'https://www.openstreetmap.org/',
        kind: 'data',
      },
      {
        label: 'Overpass API',
        url: 'https://overpass-api.de/',
        kind: 'data',
      },
      {
        label: 'School tag (OpenStreetMap wiki)',
        url: 'https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dschool',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'canterbury-rain',
    label: 'Canterbury rain',
    eyebrow: '🌧️ the canterbury rain',
    title: "Canterbury's rain gauges caught up to 40.5 mm in a day.",
    description:
      'Environment Canterbury runs 109 rain gauges across the region. The wettest gauge, Mount Byrne, recorded 40.5 mm in the last day and 86 mm in total.',
    paragraphs: [
      'The box plot shows the spread across all gauges for each of the last eight days. The box holds the middle half of gauges, the line is the median, and the whiskers reach the wettest and driest.',
      'Most of the region stayed dry today. The rain came two and three days ago, when the median gauge caught 1.6 mm and 2.5 mm.',
    ],
    accent: 'sky',
    dataSource: 'Environment Canterbury',
    chartType: 'Bar chart',
    category: 'Environment & geography',
    dataNote:
      'Data: Environment Canterbury open data (Canterbury - Rain last hour), fetched live from the browser. Values are millimetres of rain in the last day.',
    references: [
      {
        label: 'Environment Canterbury open data',
        url: 'https://opendata.canterburymaps.govt.nz/',
        kind: 'data',
      },
      {
        label: 'Rainfall data (Environment Canterbury)',
        url: 'https://www.ecan.govt.nz/data/rainfall-data/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'hamilton-playgrounds',
    label: 'Hamilton playgrounds',
    eyebrow: '🛝 the hamilton playgrounds',
    title: 'Hamilton has 85 playgrounds.',
    description:
      'Hamilton City Council maps every playground it owns. The 85 playgrounds range from basic neighbourhood swings to destination playgrounds.',
    paragraphs: [
      'Most are neighbourhood playgrounds: 33 old, 23 basic, and 21 recent. The 2000s were the busiest decade, with 35 playgrounds built.',
      'Destination playgrounds only appeared in the 2000s. Toggle a type to hide it, and the heatmap recalculates.',
    ],
    accent: 'emerald',
    dataSource: 'Hamilton City Council',
    chartType: 'Heatmap',
    category: 'Society & community',
    dataNote:
      'Data: Hamilton City Council open data (Playgrounds), fetched live from the browser. The heatmap shows playground type by installation decade.',
    references: [
      {
        label: 'Playgrounds dataset (Hamilton City Council)',
        url: 'https://data-hcc.opendata.arcgis.com/datasets/f518a92384b1438eb848f839ca4262bd',
        kind: 'data',
      },
      {
        label: 'Hamilton City Council open data',
        url: 'https://data-hcc.opendata.arcgis.com/',
        kind: 'data',
      },
      {
        label: 'Hamilton City Council',
        url: 'https://www.hamilton.govt.nz/',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'census-rank-shift',
    label: 'Census rank shift',
    eyebrow: '📈 the census rank shift',
    title: 'Selwyn and Queenstown raced up the census ranks.',
    description:
      'Between the 2013 and 2023 censuses, Selwyn district jumped 10 places to become the 13th-biggest territorial authority. Queenstown-Lakes jumped 9 places to 27th.',
    paragraphs: [
      "Selwyn's usual residents grew from 44,595 in 2013 to 78,144 in 2023, up 75%. Queenstown-Lakes grew from 28,224 to 47,808, up 69%.",
      'At the other end, Invercargill fell 6 places to 23rd and Timaru fell 5 places to 29th. Wellington held 3rd place, but its count dipped from 202,737 in 2018 to 202,689 in 2023.',
    ],
    accent: 'amber',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ, "2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts", Table 2, census usually resident population count by territorial authority, 2013, 2018, and 2023 Censuses. Counts have fixed random rounding to base 3 applied, so they may not sum to stated totals. The series is final, so this snapshot does not go stale.',
    references: [
      {
        label: '2023 Census population counts (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
      {
        label: '2023 New Zealand census (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/2023_New_Zealand_census',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'age-pyramid',
    label: 'Age pyramid',
    eyebrow: '👥 the age pyramid',
    title: 'Women outnumber men from age 30 up.',
    description:
      "New Zealand's population estimates for 1 July 2021 put 5,122,600 people in the country. The biggest five-year band is 30-34 with 384,110 people, and women outnumber men in every band from 30 up.",
    paragraphs: [
      'The gap widens with age. In the 85-89 band there are 32,880 women to 23,540 men, and at 90+ it is 22,570 women to 12,010 men.',
      'Below 30 the numbers flip. The 25-29 band has 190,640 men against 181,390 women.',
    ],
    accent: 'cyan',
    dataSource: 'United Nations',
    chartType: 'Pyramid',
    category: 'Census & population',
    dataNote:
      'Data: UN Statistics Division Demographic and Social Statistics, population estimates by sex and age group for 1 July 2021 (provisional, rounded), as tabulated in the Wikipedia "Demographics of New Zealand" article. Because of rounding, the bands may not sum to the stated total.',
    references: [
      {
        label: 'UNSD Demographic and Social Statistics',
        url: 'https://unstats.un.org/unsd/demographic-social/products/dyb/#statistics',
        kind: 'data',
      },
      {
        label: 'Demographics of New Zealand (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/Demographics_of_New_Zealand',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'quake-magnitudes',
    label: 'Quake magnitudes',
    eyebrow: '📉 the quake magnitudes',
    title: 'Small quakes drown out the big ones.',
    description:
      'In the three months to 18 August 2026, GeoNet located 5,148 earthquakes of magnitude 1 or stronger. 2,436 came in under magnitude 2, and just 10 reached 5 or more.',
    paragraphs: [
      'From magnitude 2 up, each step holds roughly a quarter of the quakes of the step below: 2,159 quakes measured 2 to 3, 452 measured 3 to 4, and 91 measured 4 to 5.',
      'The biggest was a 6.3 on 16 July 2026, 45 km north of Te Anau. GeoNet also located a 6.2 north of Te Araroa and a 5.9 near Taumarunui in the same three months.',
    ],
    accent: 'rose',
    dataSource: 'GeoNet',
    chartType: 'Histogram',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service (service.geonet.org.nz), earthquakes of magnitude 1 or stronger in the three months to 18 August 2026, fetched at build time and falling back to a committed snapshot of that catalog. The site redeploys daily.',
    references: [
      {
        label: 'GeoNet FDSN event service',
        url: 'https://service.geonet.org.nz/fdsnws/event/1/',
        kind: 'data',
      },
      {
        label: 'GeoNet FDSN usage',
        url: 'https://www.geonet.org.nz/data/tools/FDSN',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'quake-months',
    label: 'Quake months',
    eyebrow: '📅 the quake months',
    title: 'Quakes of magnitude 3+ cluster in autumn.',
    description:
      'In the two years to 19 August 2026, GeoNet located 4,150 earthquakes of magnitude 3 or stronger. April was the busiest month with 436, August the quietest with 272.',
    paragraphs: [
      'The seasonal swing is real but modest: the busiest month runs about 60% higher than the quietest. In the full year 2025, April had 188 quakes of magnitude 3 or stronger and September just 131.',
      'The autumn tilt holds at magnitude 4 and stronger, where April is again the busiest month (108) and November the quietest (44). At magnitude 5 and stronger the pattern shifts: October was the busiest month with 16, while November stayed the quietest with 2.',
    ],
    accent: 'rose',
    dataSource: 'GeoNet',
    chartType: 'Rose / polar',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service (service.geonet.org.nz), earthquakes of magnitude 3 or stronger in the two years to 19 August 2026, fetched at build time and falling back to a committed snapshot of that catalog. The site redeploys daily.',
    references: [
      {
        label: 'GeoNet FDSN event service',
        url: 'https://service.geonet.org.nz/fdsnws/event/1/',
        kind: 'data',
      },
      {
        label: 'GeoNet FDSN usage',
        url: 'https://www.geonet.org.nz/data/tools/FDSN',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'quake-depth-scatter',
    label: 'Quake depth scatter',
    eyebrow: '📉 the quake depth scatter',
    title: 'Shallow quakes are the ones people feel.',
    description:
      'In the three months to 18 August 2026, GeoNet located 5,148 earthquakes of magnitude 1 or stronger. 3,408 of them, 66%, ruptured shallower than 40 km. The deepest reached 600 km.',
    paragraphs: [
      'Shallow quakes release their energy close to the surface, which is why they are the ones people feel. Of the 101 quakes of magnitude 4 or stronger in the same three months, 55 were shallower than 40 km.',
      'Each dot is one quake. Depth runs down the chart, so the shallow quakes sit at the top. Use the day buttons to narrow the window, and hover a dot to read its magnitude and depth.',
    ],
    accent: 'rose',
    dataSource: 'GeoNet',
    chartType: 'Scatter',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service (service.geonet.org.nz), earthquakes of magnitude 1 or stronger in the three months to 18 August 2026, fetched at build time and falling back to a committed snapshot of that catalog. The site redeploys daily.',
    references: [
      {
        label: 'GeoNet FDSN event service',
        url: 'https://service.geonet.org.nz/fdsnws/event/1/',
        kind: 'data',
      },
      {
        label: 'GeoNet FDSN usage',
        url: 'https://www.geonet.org.nz/data/tools/FDSN',
        kind: 'data',
      },
      {
        label: 'Earthquake FAQ (GeoNet)',
        url: 'https://www.geonet.org.nz/earthquake/faq',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'quake-frequency-magnitude',
    label: 'Quake frequency by magnitude',
    eyebrow: '📉 the quake frequency',
    title: 'Small quakes vastly outnumber big ones.',
    description:
      'In the three months to 18 August 2026, GeoNet located 5,148 earthquakes of magnitude 1 or stronger. 2,712 were magnitude 2 or stronger, 101 were magnitude 4 or stronger, and just 2 reached magnitude 6.',
    paragraphs: [
      'The pattern is the Gutenberg-Richter law, named for the seismologists who first described it. The count falls steeply with each step up in magnitude: 2,712 quakes of magnitude 2 or stronger, 552 of 3 or stronger, 101 of 4 or stronger, 10 of 5 or stronger, and 2 of 6 or stronger.',
      'The log view draws the law as a straight line. Toggle between linear and log to see how the small quakes dominate the count.',
    ],
    accent: 'indigo',
    dataSource: 'GeoNet',
    chartType: 'Bar chart',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service (service.geonet.org.nz), earthquakes of magnitude 1 or stronger in the three months to 18 August 2026, fetched at build time and falling back to a committed snapshot of that catalog. The site redeploys daily.',
    references: [
      {
        label: 'GeoNet FDSN event service',
        url: 'https://service.geonet.org.nz/fdsnws/event/1/',
        kind: 'data',
      },
      {
        label: 'GeoNet FDSN usage',
        url: 'https://www.geonet.org.nz/data/tools/FDSN',
        kind: 'data',
      },
      {
        label: 'Gutenberg-Richter law (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/Gutenberg%E2%80%93Richter_law',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'quake-depth-distribution',
    label: 'Quake depth distribution',
    eyebrow: '🌋 the quake depth distribution',
    title: 'Deep quakes cluster under the North Island.',
    description:
      'In the three months to 18 August 2026, GeoNet located 5,148 earthquakes of magnitude 1 or stronger. 3,408 of them, 66%, ruptured shallower than 40 km. The deep quakes sit almost entirely under the North Island.',
    paragraphs: [
      "The Pacific plate dives beneath the North Island's east coast, so quakes there can rupture hundreds of kilometres down. 1,031 of the 1,037 quakes deeper than 100 km were under the North Island.",
      "The South Island's quakes are almost all shallow: 697 of 870, 80%, ruptured shallower than 40 km. The radial chart shows the depth bands. Use the magnitude buttons to filter.",
    ],
    accent: 'teal',
    dataSource: 'GeoNet',
    chartType: 'Histogram',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service (service.geonet.org.nz), earthquakes of magnitude 1 or stronger in the three months to 18 August 2026, fetched at build time and falling back to a committed snapshot of that catalog. The site redeploys daily.',
    references: [
      {
        label: 'GeoNet FDSN event service',
        url: 'https://service.geonet.org.nz/fdsnws/event/1/',
        kind: 'data',
      },
      {
        label: 'GeoNet FDSN usage',
        url: 'https://www.geonet.org.nz/data/tools/FDSN',
        kind: 'data',
      },
      {
        label: 'Hikurangi Trough (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/Hikurangi_Trough',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'ev-charging',
    label: 'EV charging',
    eyebrow: '🔌 the ev charging map',
    title: 'New Zealand has 639 public EV charging stations.',
    description:
      'The NZTA EV Roam register lists every public EV charging station in New Zealand. ChargeNet runs 307 of them, more than any other operator.',
    paragraphs: [
      'The register counts 639 stations, from fast DC chargers on the main highways to slow AC chargers in town centres. 566 stations offer DC charging.',
      'ChargeNet runs 307 stations, Meridian 104, and Z Energy 63. Toggle the view to see the stations by current type, or type to filter operators by name.',
    ],
    accent: 'emerald',
    dataSource: 'NZ Transport Agency (NZTA)',
    chartType: 'Bar chart',
    category: 'Transport',
    dataNote:
      'Data: NZTA EV Roam charging stations (ArcGIS REST service), grouped by operator and current type, fetched live from the browser. The register holds 639 stations.',
    references: [
      {
        label: 'EV Roam charging stations (NZTA)',
        url: 'https://opendata-nzta.opendata.arcgis.com/datasets/NZTA::ev-roam-charging-stations',
        kind: 'data',
      },
      {
        label: 'EV Roam (NZTA)',
        url: 'https://www.nzta.govt.nz/vehicles/electric-vehicles/ev-roam/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'road-crash-trend',
    label: 'Road crash trend',
    eyebrow: '🚗 the road crash trend',
    title: 'Road crashes fell 27% from 2006 to 2025.',
    description:
      'The NZTA Crash Analysis System records every reported crash on New Zealand roads. Crashes fell from 39,778 in 2006 to 29,017 in 2025, down 27%.',
    paragraphs: [
      'The heatmap shows crashes by region and year. Auckland leads every year, with 235,352 crashes across the series, more than the next three regions combined.',
      'Fatal crashes tell a similar story: 350 in 2006, 259 in 2025. Toggle between all crashes and fatal crashes, or drag the slider to narrow the year window.',
    ],
    accent: 'rose',
    dataSource: 'NZ Transport Agency (NZTA)',
    chartType: 'Heatmap',
    category: 'Transport',
    dataNote:
      'Data: NZTA Crash Analysis System (CAS) public dataset (ArcGIS REST service), crashes by region and year, fetched live from the browser. The series covers 2006 to 2026 and holds 705,609 crashes.',
    references: [
      {
        label: 'Crash Analysis System data (NZTA)',
        url: 'https://opendata-nzta.opendata.arcgis.com/datasets/NZTA::crash-analysis-system-cas-data-1',
        kind: 'data',
      },
      {
        label: 'Road safety data (NZTA)',
        url: 'https://www.nzta.govt.nz/safety/data/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'vehicle-fleet',
    label: 'Vehicle fleet',
    eyebrow: '🚙 the vehicle fleet',
    title: "New Zealand's fleet has 107,525 electric vehicles.",
    description:
      'The NZTA Motor Vehicle Register lists every vehicle in New Zealand. The fleet holds 5.9 million vehicles, and 107,525 of them are electric.',
    paragraphs: [
      'Petrol still dominates with 3.18 million vehicles, and diesel adds 1.23 million. Hybrids are the fast-growing middle: 420,013 petrol hybrids and 50,321 plug-in hybrids.',
      'The sunburst shows the fleet by fuel or by vehicle type. Passenger cars and vans make up 3.69 million of the 5.9 million vehicles.',
    ],
    accent: 'sky',
    dataSource: 'NZ Transport Agency (NZTA)',
    chartType: 'Sunburst',
    category: 'Transport',
    dataNote:
      'Data: NZTA Motor Vehicle Register (ArcGIS REST service), grouped by motive power and vehicle type, fetched live from the browser. 882,333 vehicles have no motive power recorded; 881,263 of them are trailers or caravans, grouped as Unknown.',
    references: [
      {
        label: 'Motor Vehicle Register (NZTA)',
        url: 'https://opendata-nzta.opendata.arcgis.com/datasets/NZTA::motor-vehicle-register',
        kind: 'data',
      },
      {
        label: 'New Zealand Motor Vehicle Register statistics (NZTA)',
        url: 'https://www.nzta.govt.nz/resources/new-zealand-motor-vehicle-register-statistics/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'rabbit-boom',
    label: 'Rabbit boom',
    eyebrow: '🐇 the rabbit boom',
    title: "The bunnies are winning in Hawke's Bay.",
    description:
      "Night spotlight counts of rabbits in Hawke's Bay rose from 2.35 to 13.26 rabbits per kilometre between 2012 and 2021, a fivefold boom in a decade. The counts are an index of abundance, not a total population.",
    paragraphs: [
      "Landcare Research has driven the same night transects across Hawke's Bay farm sites since 2012, counting rabbits seen per kilometre. The pooled rate across all monitored sites rose almost every year.",
      'Counts wobble with control operations and rabbit disease, but the decade trend is unambiguous: from 2.35 rabbits per kilometre in 2012 to a peak of 13.26 in 2021. The dataset backs a 2024 Wildlife Research study on whether rabbit abundance rises after predator control.',
    ],
    accent: 'emerald',
    dataSource: 'Landcare Research',
    chartType: 'Line chart',
    category: 'Agriculture & farming',
    dataNote:
      'Data: Manaaki Whenua Landcare Research HawkesBayRabbits dataset (data.govt.nz, CC-BY-4.0), spotlight counts by farm site and year, pooled into rabbits per kilometre, fetched at deploy time with a committed snapshot fallback. Hover or drag across the chart to read any year.',
    references: [
      {
        label: 'HawkesBayRabbits spotlight counts (data.govt.nz)',
        url: 'https://catalogue.data.govt.nz/dataset/hawkesbayrabbits',
        kind: 'data',
      },
      {
        label: 'Rabbit abundance after predator control (Wildlife Research)',
        url: 'https://doi.org/10.1071/wr24043',
        kind: 'data',
      },
      {
        label: 'Rabbits (Te Ara)',
        url: 'https://teara.govt.nz/en/rabbits',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'regional-population-ranks',
    label: 'Regional population ranks',
    eyebrow: '🗺️ the regional population ranks',
    title: 'The regional pecking order is frozen.',
    description:
      'Between the 2013 and 2023 censuses, not one of the 16 regions changed rank. Auckland stayed first with 1,656,486 people, and the West Coast stayed last with 33,390.',
    paragraphs: [
      'The ranks are stable because the regions grow at similar rates. The West Coast was the only region whose population shrank between 2013 and 2018, from 32,148 to 31,575, before growing again to 33,390 by 2023.',
      'Ranks hide absolute change, so the table keeps the counts. Every region grew between 2018 and 2023, and Tasman grew fastest at 10.3 percent.',
    ],
    accent: 'teal',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts release (Table 1, published 29 May 2024), usually resident population counts by regional council. Counts have fixed random rounding to base 3 applied. The series is final: censuses run every five years.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: 'First results from the 2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/first-results-from-the-2023-census-older-more-diverse-population-and-an-extra-300000-people-between-censuses/',
        kind: 'news',
      },
    ],
  },
  {
    slug: 'export-destination-ranks',
    label: 'Export destination ranks',
    eyebrow: '🚢 the export destination ranks',
    title: 'China overtook Australia as the top export market.',
    description:
      "In the year ended March 2015, Australia was still New Zealand's biggest goods export market at $8.6 billion, just ahead of China's $8.6 billion. By 2026 China's lead was $9.3 billion.",
    paragraphs: [
      'China took the top spot in 2016 and has held it since. In the year ended March 2026, goods exports to China reached $19.7 billion, more than Australia ($10.5 billion) and the United States ($9.3 billion) combined.',
      "The slope chart ranks the top ten destinations in 2015, 2020, and 2026. The order has barely moved since 2015; the story is the size of China's lead, not the ranking.",
    ],
    accent: 'indigo',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ goods and services trade by country releases. The 2015 and 2020 figures are from the year ended March 2020 release; the 2026 figures are aggregated from the monthly series in the International trade: December 2025 quarter release (April 2025 to March 2026). Goods exports, NZ$ millions.',
    references: [
      {
        label: 'Goods and services trade by country: Year ended March 2020 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/goods-and-services-trade-by-country-year-ended-march-2020/',
        kind: 'data',
      },
      {
        label: 'International trade: December 2025 quarter (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-trade-december-2025-quarter/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'city-population-ranks',
    label: 'City population ranks',
    eyebrow: '🏙️ the city population ranks',
    title: 'Tauranga passed Dunedin to become the fifth-biggest city.',
    description:
      'Between the 2013 and 2018 censuses, Tauranga overtook Dunedin. By 2023 Tauranga counted 152,844 people and Dunedin 128,901.',
    paragraphs: [
      'Auckland stayed the biggest city at 1,656,486, with Christchurch (391,383) and Wellington (202,689) next. Hamilton held fourth place at 174,741.',
      'The ranks below are among the ten biggest city councils, not all 67 territorial authorities. City boundaries changed little over the three censuses, so the comparison is consistent.',
    ],
    accent: 'cyan',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts release (Table 2, published 29 May 2024), usually resident population counts by territorial authority, ranked among the ten biggest city councils. Counts have fixed random rounding to base 3 applied.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: 'First results from the 2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/first-results-from-the-2023-census-older-more-diverse-population-and-an-extra-300000-people-between-censuses/',
        kind: 'news',
      },
    ],
  },

  {
    slug: 'age-distribution',
    label: 'Age distribution',
    eyebrow: '👵 the age distribution',
    title: 'The baby boom bulge moved up the age ladder.',
    description:
      'In the 2013 census the 50-59 band held 560,178 people, more than the 20-29 band (548,826). By 2023 the biggest ten-year band was 30-39 at 719,616, and the baby boomers sat in 60-69.',
    paragraphs: [
      'New Zealand counted 4,993,923 people in the 2023 census, up from 4,242,048 in 2013. The median age moved only slightly, from 38.0 to 38.1 years.',
      'The bulge aged in step with the census. The 60-69 band of 2023 held 548,910 people, nearly the same as the 50-59 band of 2013. The 20-29 band of 2013 (548,826) became the 30-39 band of 2023, the largest ten-year band of all.',
      'The 25-34 band was the hollow in 2013 at 514,689 people, the smallest ten-year band between 20 and 49. Drag the slider to follow the bands across the three censuses.',
    ],
    accent: 'teal',
    dataSource: 'Stats NZ',
    chartType: 'Histogram',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ "2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts", Table 6, census usually resident population count by five-year age group, 2013, 2018, and 2023 Censuses. Counts have fixed random rounding to base 3 applied, so the bands may not sum to the stated total. The series is final, so this snapshot does not go stale.',
    references: [
      {
        label: '2023 Census population counts (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'median-age-ranks',
    label: 'Median age ranks',
    eyebrow: '📊 the median age ranks',
    title: 'The upper South Island is where New Zealand ages fastest.',
    description:
      'West Coast was the oldest region in the 2023 census, at a median age of 48.1 years. Tasman (46.8), Marlborough (46.1) and Nelson (44.0) followed. Auckland stayed the youngest in all three censuses, at 35.9.',
    paragraphs: [
      'West Coast climbed from 3rd-oldest in 2013 to oldest in 2023. Southland climbed 4 places to 6th-oldest, and Taranaki and Manawatu-Whanganui each climbed 2.',
      'Marlborough went the other way, from oldest in 2013 (45.0) to 3rd in 2023 (46.1). Canterbury and Bay of Plenty each fell 3 places. The whole range is small: 35.9 to 48.1 years.',
    ],
    accent: 'amber',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ "2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts", Table 7, median age by regional council area, 2013, 2018, and 2023 Censuses. Median age is calculated using single-year-of-age data. Ranks are computed among the 16 regions, with tied medians sharing a rank.',
    references: [
      {
        label: '2023 Census population counts (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'visitor-arrival-ranks',
    label: 'Visitor arrival ranks',
    eyebrow: '✈️ the visitor arrival ranks',
    title: 'Indonesia and the Philippines climbed the visitor ranks.',
    description:
      'Australia, China, the United States and the United Kingdom held the top four spots for visitor arrivals in 2015 and 2019. The churn happened below them: Indonesia rose from 24th to 19th and the Philippines from 25th to 20th.',
    paragraphs: [
      'India overtook Singapore for 9th place, with 66,775 arrivals in the December 2019 year against 64,574. Germany and Japan swapped 5th and 6th.',
      'New Caledonia fell 5 places to 25th and Switzerland fell 4 to 23rd. Total visitor arrivals reached 3,888,473 in the December 2019 year, the last full year before the border closed.',
    ],
    accent: 'sky',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Tourism & travel',
    dataNote:
      'Data: Stats NZ, International travel: December 2019, Table 4, visitor arrivals by country of residence, years ended December 2015 and 2019. Ranks are computed among the top 30 countries of residence. The 2019 endpoint is the last full pre-pandemic year.',
    references: [
      {
        label: 'International travel: December 2019 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-travel-december-2019/',
        kind: 'data',
      },
      {
        label: 'Tourism (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/tourism/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'company-size-distribution',
    label: 'Company size distribution',
    eyebrow: '🏢 the company size distribution',
    title: 'Most businesses have no staff at all.',
    description:
      "Of the 617,334 economically significant enterprises in New Zealand at February 2025, 455,730 had no paid employees. Just 2,838 enterprises employed 100 or more people, and those giants employed half of the country's paid workforce.",
    paragraphs: [
      'The business register is a power law. Enterprises with no employees make up 74% of the total, and the 1-5 band adds another 16%, so nine in ten enterprises employ five people or fewer.',
      'The shape flips for employment. The 2,838 enterprises with 100 or more employees employed 1,209,700 people, half of the 2,443,400 paid employees in the register.',
      'The register counts economically significant enterprises, mostly those with GST turnover over $30,000 a year, and it counts dormant companies too. Pick an industry to see the shape change: rental, hiring, and real estate is almost all no-employee firms, while education and health lean the other way.',
    ],
    accent: 'amber',
    dataSource: 'Stats NZ',
    chartType: 'Pareto',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ "New Zealand business demography statistics: At February 2025", Table 1, enterprises and employee count by industry (ANZSIC06) and employee count size group. Counts are provisional and have noise added or subtracted to protect individual businesses, so bands may not sum to the stated totals.',
    references: [
      {
        label: 'New Zealand business demography statistics: At February 2025 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2025/',
        kind: 'data',
      },
      {
        label: 'Business demography statistics (DataInfo+)',
        url: 'https://datainfoplus.stats.govt.nz/Item/nz.govt.stats/bdb02aa2-866e-418f-83e8-342234867a0f',
        kind: 'data',
      },
      {
        label: 'Business (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/business/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'tourism-arrivals-by-month',
    label: 'Tourism arrivals by month',
    eyebrow: '✈️ the tourism arrivals by month',
    title: 'Visitors flood in every summer.',
    description:
      'Overseas visitor arrivals peak every December and more than halve by the winter trough. In 2019, December brought 528,219 visitors against 213,536 in June, the deepest month of the year.',
    paragraphs: [
      'The summer peak is the same shape in every year on the chart: December is always the biggest month, and May or June is always the smallest.',
      'The 2020 to 2022 years are missing because border restrictions closed the country. The recovery is still incomplete: December 2024 brought 469,842 visitors, 11% below December 2019.',
      'Toggle the year buttons to compare the summer peak month by month. The 2017 and 2025 lines are partial years.',
    ],
    accent: 'sky',
    dataSource: 'Stats NZ',
    chartType: 'Cycle plot',
    category: 'Tourism & travel',
    dataNote:
      'Data: Stats NZ "International travel" releases, Table 2, estimated short-term travel, overseas visitor arrivals by month. The 2017-2019 months come from the December 2018 and December 2019 releases; the 2023-2025 months come from the June 2025 release. Arrivals are counted by month of arrival.',
    references: [
      {
        label: 'International travel: June 2025 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-travel-june-2025/',
        kind: 'data',
      },
      {
        label: 'International travel: December 2019 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-travel-december-2019/',
        kind: 'data',
      },
      {
        label: 'Tourism (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/tourism/',
        kind: 'data',
      },
    ],
  },
  {
    slug: 'retail-sales-by-month',
    label: 'Retail sales by month',
    eyebrow: '🛍️ the retail sales by month',
    title: 'Card spending peaks every December.',
    description:
      'Stats NZ does not publish monthly retail sales, so this page uses the closest monthly retail pulse: electronic card transactions. December 2024 brought $11,392 million of card spending, the biggest month on record, up 12% from November.',
    paragraphs: [
      'The December bump is a wave that repeats every year: December 2021, 2022, 2023, and 2024 were each the biggest month of their year, and every one beat the previous month by at least 9%. January then drops back as the wave passes.',
      'The durables layer, the durable-goods stores behind the December peak, is the one that surges hardest: $2,448 million in December 2024 against $1,522 million the following September.',
      'Toggle the industry layers to watch the Christmas wave travel through the stream. Values include GST.',
    ],
    accent: 'rose',
    dataSource: 'Stats NZ',
    chartType: 'Streamgraph',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ "Electronic card transactions" releases, Table 1, actual monthly values by industry (series ECTM). The June 2023 release covers June 2021 to June 2023 and the June 2025 release covers June 2023 to June 2025. The retail trade survey itself is quarterly, so the card series is used for the monthly pulse. Component series are rounded independently and may not sum to the stated total.',
    references: [
      {
        label: 'Electronic card transactions: June 2025 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/electronic-card-transactions-june-2025/',
        kind: 'data',
      },
      {
        label: 'Electronic card transactions: June 2023 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/electronic-card-transactions-june-2023/',
        kind: 'data',
      },
      {
        label: 'Business (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/business/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'regional-population-growth',
    label: 'Regional population growth',
    eyebrow: '🗺️ the growth gap',
    title: 'The top of the country is growing faster than the bottom.',
    description:
      'Every region grew between the 2013 and 2023 censuses, but the growth piled up in the north. Northland grew the fastest at 27.9 percent, Auckland added the most people at 240,936, and the West Coast grew the slowest at 3.9 percent.',
    paragraphs: [
      'The four fastest-growing regions are all in the top of the North Island. Northland, Waikato, and Bay of Plenty all grew by more than 23 percent, and together with Auckland they added 444,783 people, about 59 percent of the national gain of 751,875.',
      'The bottom of the country grew much more slowly. The West Coast added 1,242 people in the decade, and Southland grew 7.3 percent. Canterbury was the exception to the south: it added 111,594 people, the second-largest gain of any region.',
    ],
    accent: 'emerald',
    dataSource: 'Stats NZ',
    chartType: 'Dumbbell',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts, Table 1 (census usually resident population count by regional council area, 2013 and 2023 censuses). The chart plots population on a log scale, so the gap between the dots shows the growth rate. Hover a row to read both counts.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
      {
        label: 'Population (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/population',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'age-bulge',
    label: 'Age bulge',
    eyebrow: '👶 the age bulge',
    title: 'The biggest five-year band in the country is 30 to 34.',
    description:
      'At the 2023 Census, 374,079 people were aged 30 to 34, the largest five-year band in the country. It is the echo of the baby boom, and it has been marching up the age stack with every census.',
    paragraphs: [
      'In 2013 the largest five-year band was 40 to 44, at 305,754 people. By 2023 the largest was 30 to 34, at 374,079, bigger than any band the original baby boom ever put in a single five-year group.',
      'The original baby boom is now in its 60s and 70s. People aged 65 and over grew from 607,035 in 2013 to 828,585 in 2023, and their share of everyone rose from 14.3 to 16.6 percent. The median age moved from 38.0 to 38.1 years.',
    ],
    accent: 'cyan',
    dataSource: 'Stats NZ',
    chartType: 'Ridgeline',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts, Table 6 (usually resident population by five-year age group, 2013, 2018, and 2023 censuses). Each ridge is one census year; hover or tap a band to read the count in all three years. Census counts have fixed random rounding applied, so the bands can differ from the published total by a few people.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
      {
        label: 'Population (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/population',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'ethnic-mix',
    label: 'Ethnic mix',
    eyebrow: '🧬 the ethnic mix',
    title: 'European is still the biggest group, but the mix is changing fast.',
    description:
      'At the 2023 Census, 67.8 percent of people who stated an ethnicity identified as European. The Asian share has nearly doubled in a decade, from 11.8 percent in 2013 to 17.3 percent in 2023.',
    paragraphs: [
      'The chart rows add past 100 because people can identify with more than one ethnic group. The filled cells in each row add past 100: 111 cells for every 100 people who stated an ethnicity in 2013 and 115 in 2023, because people can identify with more than one group. That growing overlap is the multi-identity share.',
      'The diversity is concentrated. Auckland is the only region where fewer than half of people stated a European ethnicity: 49.8 percent in 2023, against 67.8 percent nationally. Gisborne is next lowest at 56.5 percent.',
    ],
    accent: 'fuchsia',
    dataSource: 'Stats NZ',
    chartType: 'Waffle',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts, Table 4 (ethnic group grouped total responses by regional council area, 2013, 2018, and 2023 censuses). Each row of the chart is 100 people who stated an ethnicity, and the filled cells show how many identified with that group. Rows add past 100 because people can choose more than one ethnic group. In 2013, 5.4 percent of people did not state an ethnicity, so that year is measured against the 94.6 percent who did.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: 'Census results reflect Aotearoa New Zealands diversity (Stats NZ)',
        url: 'https://www.stats.govt.nz/news/census-results-reflect-aotearoa-new-zealands-diversity/',
        kind: 'news',
      },
      {
        label: 'Ethnicity (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/ethnicity',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'population-waffle',
    label: 'Population by region',
    eyebrow: '🧱 the population grid',
    title: "Auckland is a third of the country's population.",
    description:
      'At the 2023 Census, 1,656,486 of the 4,993,290 people counted in regional council areas lived in Auckland, 33.2 percent of the country. The waffle chart draws one cell per 1 percent of the census population, so Auckland fills a third of the grid.',
    paragraphs: [
      'The North Island holds most of the rest. Its 3,808,005 people are 76.3 percent of the total, and the South Island has 1,185,282, 23.7 percent.',
      'Canterbury is the second-biggest region with 651,027 people, 13.0 percent of the country, and Wellington third with 520,971, 10.4 percent. Auckland has held near a third through every census since 2013: 33.4 percent in 2013, 33.2 percent in 2023.',
    ],
    accent: 'teal',
    dataSource: 'Stats NZ',
    chartType: 'Waffle',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts, Table 1 (census usually resident population count by regional council area, 2013, 2018, and 2023 censuses). Each cell is one percent of the census usually resident population count, allocated so the grid always sums to 100 cells. Counts have fixed random rounding to base 3 applied. Hover a cell, search for a region, or toggle the census year.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
      {
        label: 'Population (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/population',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'export-market-bump',
    label: 'Top export markets',
    eyebrow: '🚢 the export handover',
    title: 'China overtook Australia as the top export market.',
    description:
      "In the year ended March 2015, Australia was New Zealand's biggest export market at $12.9 billion, ahead of China at $10.8 billion. By the year ended March 2018, China had taken the top spot, and by March 2020 it bought $19.9 billion of New Zealand goods and services.",
    paragraphs: [
      'The United States held third place in every year of the series. Japan and the United Kingdom held fourth and fifth, and below them the ranks churned: Singapore and Germany traded places at the edge of the top ten.',
      'The numbers are total exports of goods and services in New Zealand dollars, so the ranks move with exchange rates as well as volumes.',
    ],
    accent: 'sky',
    dataSource: 'Stats NZ',
    chartType: 'Rank / slope',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ "Goods and services trade by country: Year ended March 2020" (map data table), total exports of goods and services by destination country in NZ$ millions for the years ended March 2015 to 2020. Ranks are computed from the full country list in that table. Hover a line to highlight it, or toggle between the top 8 and top 5 markets.',
    references: [
      {
        label: 'Goods and services trade by country release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/goods-and-services-trade-by-country-year-ended-march-2020/',
        kind: 'data',
      },
      {
        label: 'International trade: December 2025 quarter (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-trade-december-2025-quarter',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'enterprise-bar-in-bar',
    label: 'Business register',
    eyebrow: '🏢 the business register',
    title: 'Rental and real estate is the biggest block of the business register.',
    description:
      'At February 2025, New Zealand had 617,334 economically significant enterprises. Rental, hiring, and real estate services led with 129,120, construction was second with 81,249, and professional, scientific, and technical services third with 70,938.',
    paragraphs: [
      'The register grew 10.7 percent from February 2020, when it held 557,685 enterprises. Financial and insurance services grew fastest at 25.8 percent, health care and social assistance grew 22.1 percent, and construction grew 20.8 percent.',
      'Two industries shrank: agriculture, forestry, and fishing fell 3.9 percent and wholesale trade fell 3.2 percent. The register counts every economically significant business, so the biggest block mixes active traders with companies that still file but do little.',
    ],
    accent: 'indigo',
    dataSource: 'Stats NZ',
    chartType: 'Bar-in-bar',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ "New Zealand business demography statistics" releases, Table 1, enterprises by industry (ANZSIC06) at February 2020 (published 29 October 2020) and February 2025 (published 30 October 2025). The 2025 counts are provisional and have noise added or subtracted to protect individual businesses. Hover a row, search for an industry, or toggle the sort order.',
    references: [
      {
        label: 'Business demography: At February 2025 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2025/',
        kind: 'data',
      },
      {
        label: 'Business demography: At February 2020 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2020/',
        kind: 'data',
      },
      {
        label: 'Business (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/business',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'unemployment-ranks',
    label: 'Unemployment ranks',
    eyebrow: '📈 the unemployment shuffle',
    title: 'The unemployment pecking order reshuffles every year.',
    description:
      'Between December 2023 and December 2025, Auckland went from the fifth-highest regional unemployment rate to the highest, and Wellington from ninth to third. Otago stayed the tightest labour market in the country throughout.',
    paragraphs: [
      'The national unemployment rate rose from 4.0 percent in December 2023 to 5.3 percent in December 2025. Auckland moved most, from 4.2 to 6.4 percent, and its rank climbed from fifth to first. Wellington went from 3.3 to 5.8 percent.',
      'Northland, Waikato, and Manawat\u016b-Whanganui swapped the top spots early in the period. Taranaki drifted the other way, from the seventh-highest rate to the tenth, while its rate barely moved.',
      "The Household Labour Force Survey is a sample, so small regions carry wide margins of error. Northland's December 2025 rate of 5.2 percent has a sampling error of about 2.7 percentage points.",
    ],
    accent: 'rose',
    dataSource: 'Stats NZ',
    chartType: 'Parallel coordinates',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ Household Labour Force Survey, December 2025 quarter (Table 6, people employed, unemployed, and not in the labour force, by regional council area), unadjusted quarterly unemployment rates for December 2023 to December 2025. Rank 1 is the highest unemployment rate that quarter; ties keep workbook order. Regional estimates carry wide sampling errors, especially for smaller regions.',
    references: [
      {
        label: 'Labour market statistics: December 2025 quarter (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/labour-market-statistics-december-2025-quarter/',
        kind: 'data',
      },
      {
        label: 'HLFS regional tables workbook (Stats NZ)',
        url: 'https://www.stats.govt.nz/assets/Uploads/Labour-market-statistics/Labour-market-statistics-December-2025-quarter/Download-data/household-labour-force-survey-december-2025-quarter.xlsx',
        kind: 'data',
      },
      {
        label: 'Unemployment (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/labour-market/',
        kind: 'history',
      },
    ],
  },
  {
    slug: 'median-age-by-region',
    label: 'The ageing map',
    eyebrow: '🧓 the ageing map',
    title: 'The West Coast aged five years in one decade.',
    description:
      'The median age in the West Coast region rose from 42.8 in 2013 to 47.9 in 2023, the biggest jump of any region. Auckland stayed the youngest at 35.9.',
    paragraphs: [
      'The national median age was 37.9 in 2013 and 38.2 in 2023, a movement of less than half a year. The map underneath moved far more. West Coast, Tasman, and Marlborough are the three oldest regions, and all three passed 46 by 2023.',
      'The other direction is smaller. Bay of Plenty, Otago, and Canterbury were each younger in 2023 than in 2013, and Gisborne barely moved.',
    ],
    accent: 'indigo',
    dataSource: 'Stats NZ',
    chartType: 'Tile grid',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ 2023 Census release "2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts", Table 7 (age in five-year groups for the census usually resident population by regional council area). Median ages are interpolated within the five-year band holding the midpoint of each regional population, so they are estimates, not published medians.',
    references: [
      {
        label: '2023 Census population counts release (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: 'Population counts workbook (Stats NZ)',
        url: 'https://www.stats.govt.nz/assets/Uploads/2023-Census-population-counts-by-ethnic-group-age-and-Maori-descent-and-dwelling-counts/Downloads/2023-Census-national-and-subnational-usually-resident-population-counts-and-dwelling-counts.xlsx',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'tourist-arrivals',
    label: 'Tourist arrivals',
    eyebrow: '✈️ the tourist arrivals',
    title: 'Australia sends more visitors than the next nine countries combined.',
    description:
      'In the year ended December 2019, 1.54 million visitors arrived from Australia. China was second with 407,141, and the United States third with 367,958.',
    paragraphs: [
      'The gap was already there in 2015, when Australia sent 1.33 million visitors, again more than the next nine countries combined.',
      'The fastest growers were the United States, up 51 percent from 2015 to 2019, and India, up 45 percent. Japan grew 12 percent and the United Kingdom 14 percent.',
      '2019 is the last full year before the border closed. The series stops there on purpose, so the pandemic does not distort the rankings.',
    ],
    accent: 'sky',
    dataSource: 'Stats NZ',
    chartType: 'Dot plot',
    category: 'Tourism & travel',
    dataNote:
      'Data: Stats NZ International travel: December 2019 (Table 4, visitor arrivals by country of residence, years ended December 2015 and 2019). 2019 is the last full pre-pandemic year, so the series stops before the 2020-21 border closures.',
    references: [
      {
        label: 'International travel: December 2019 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-travel-december-2019/',
        kind: 'data',
      },
      {
        label: 'International travel: December 2024 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/international-travel-december-2024/',
        kind: 'data',
      },
      {
        label: 'Tourism (Stats NZ)',
        url: 'https://www.stats.govt.nz/topics/tourism/',
        kind: 'history',
      },
    ],
  },

  {
    slug: 'quake-years',
    label: 'Quake years',
    eyebrow: '🌋 the quake years',
    title: "2016 was New Zealand's busiest quake year since 2001.",
    description:
      'GeoNet located 7,265 earthquakes at magnitude 4.0 or stronger between 2001 and 2024. The busiest year was 2016, when the 7.8 Kaikoura earthquake and its aftershocks brought 772.',
    paragraphs: [
      'The quietest year was 2018 with 118. Most years land between 150 and 500, so the peak years stand out: 2003 (561) around the Fiordland 7.1, 2009 (487) around the Dusky Sound 7.8, and 2021 (483) around the Te Araroa 7.2.',
      'The 6.3 Christchurch earthquake of February 2011 made 2011 a busy year too, with 447 quakes at 4.0 or stronger. Drag the slider to 6.0 and only the biggest shakes remain.',
    ],
    accent: 'rose',
    dataSource: 'GeoNet',
    chartType: 'Strip chart',
    category: 'Earthquakes & geology',
    dataNote:
      'Data: GeoNet FDSN event service, earthquakes of magnitude 4.0 or stronger located in the New Zealand region (latitude -50 to -29, longitude 166 to 180, plus the Kermadec arc from -180 to -175), 1 January 2001 to 31 December 2024. The counts are a committed snapshot of the GeoNet catalog taken 19 August 2026.',
    references: [
      {
        label: 'GeoNet',
        url: 'https://www.geonet.org.nz/',
        kind: 'data',
      },
      {
        label: 'Earthquake FAQ (GeoNet)',
        url: 'https://www.geonet.org.nz/earthquake/faq',
        kind: 'data',
      },
      {
        label: 'Kaikōura earthquake, 13 November 2016 (GeoNet)',
        url: 'https://www.geonet.org.nz/earthquake/2016p858000',
        kind: 'news',
      },
    ],
  },

  {
    slug: 'region-density',
    label: 'Region density',
    eyebrow: '🗺️ the region density',
    title: 'Auckland holds a third of the people on 2% of the land.',
    description:
      "New Zealand's 16 regional councils cover 264,091 square kilometres of land. At the 2023 census, Auckland held 1,656,486 people, a third of the country, on 4,941 square kilometres, under 2% of it.",
    paragraphs: [
      'The 2023 census counted 4,993,923 people by regional council, about 18.9 per square kilometre. Auckland runs at 335.3 per square kilometre, more than 17 times the national density.',
      'Nelson is the next busiest council at 124.6 per square kilometre, a pocket of 52,584 people on just 422 square kilometres. The West Coast is the emptiest at 1.4 people per square kilometre. Toggle the census year to watch the 2013 to 2023 shift.',
    ],
    accent: 'indigo',
    dataSource: 'Stats NZ',
    chartType: 'Choropleth',
    category: 'Census & population',
    dataNote:
      'Data: Stats NZ "2023 Census population counts (by ethnic group, age, and Maori descent) and dwelling counts", Table 1, usually resident population by regional council area, 2013, 2018, and 2023 Censuses. Land areas are Stats NZ regional council land areas as tabulated on Wikipedia\'s "Regions of New Zealand" page, which cites the Stats NZ "Regional Council 2020 Clipped (generalised)" boundary layer. Boundaries shown are the 2023 regional council areas. Counts have fixed random rounding to base 3 applied.',
    references: [
      {
        label: '2023 Census population counts (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/2023-census-population-counts-by-ethnic-group-age-and-maori-descent-and-dwelling-counts/',
        kind: 'data',
      },
      {
        label: '2023 Census (Stats NZ)',
        url: 'https://www.stats.govt.nz/2023-census/',
        kind: 'data',
      },
      {
        label: 'Regions of New Zealand (Wikipedia)',
        url: 'https://en.wikipedia.org/wiki/Regions_of_New_Zealand',
        kind: 'data',
      },
      {
        label: 'Regional Council 2020 Clipped (generalised) (Stats NZ)',
        url: 'https://datafinder.stats.govt.nz/layer/104253-regional-council-2020-clipped-generalised/',
        kind: 'data',
      },
    ],
  },

  {
    slug: 'industry-employment',
    label: 'Industry employment',
    eyebrow: '🏭 the industry employment',
    title: "Health care is New Zealand's biggest employer.",
    description:
      "Stats NZ counted 293,600 employees in health care and social assistance at February 2025, 12% of the 2,450,600 employees covered by the business demography statistics. It is the country's biggest industry employer, ahead of manufacturing.",
    paragraphs: [
      'Manufacturing still employed 231,100 people, but its share slipped from 10.2% at February 2020 to 9.4% at February 2025. Retail trade sits close behind at 227,900.',
      "The marimekko scales each column to that year's employee total and each block's height to an industry's share. Hover a block to read an industry across both years, or switch to equal columns to compare shares directly.",
    ],
    accent: 'violet',
    dataSource: 'Stats NZ',
    chartType: 'Marimekko',
    category: 'Economy & business',
    dataNote:
      'Data: Stats NZ "New Zealand business demography statistics: At February 2020" and "...At February 2025", Table 1, enterprises, geographic units, and employee count by industry (ANZSIC06). The February 2025 counts are provisional and have noise added or subtracted to protect individual businesses, so industry counts can differ from the published total by a few employees.',
    references: [
      {
        label: 'New Zealand business demography statistics: At February 2025 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2025/',
        kind: 'data',
      },
      {
        label: 'New Zealand business demography statistics: At February 2020 (Stats NZ)',
        url: 'https://www.stats.govt.nz/information-releases/new-zealand-business-demography-statistics-at-february-2020/',
        kind: 'data',
      },
    ],
  },
]);
