import type { MicrositeAccent } from '@/components/microsite-styles';
import type { MicrositeReference } from '@/components/MicrositeReferences';

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

export const MICROSITES: MicrositeConfig[] = [
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
];
