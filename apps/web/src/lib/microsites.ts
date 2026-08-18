import type { MicrositeAccent } from '@/components/microsite-styles';
import type { MicrositeReference } from '@/components/MicrositeReferences';

import { withHiddenMicrositesRemoved } from './hidden-microsites';

export interface MicrositeConfig {
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: string[];
  accent: MicrositeAccent;
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
]);
