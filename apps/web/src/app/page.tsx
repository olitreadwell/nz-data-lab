import { Container, Stack } from '@nzlab/ui';

import { MicrositeCard } from '@/components/MicrositeCard';
import { ReportIssueButton } from '@/components/ReportIssueButton';
import { env } from '@/env';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import {
  DIGITALNZ_GOLD_RECORDS,
  fetchCatalogueTotal,
  fetchRegisterTotal,
  GBIF_NZ_RECORDS_2024,
  INATURALIST_NZ_OBSERVATIONS,
  TRADEME_LEAF_CATEGORIES,
  WIKIPEDIA_NZ_PAGE_PEAK,
} from '@/lib/headline-stats';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import { fetchLivestockSeries, summarizeLivestock } from '@/lib/livestock-data';
import { MICROSITES } from '@/lib/microsites';
import type { MicrositeConfig } from '@/lib/microsites';
import { fetchRecentQuakes } from '@/lib/quake-data';
import { fetchRabbitSpotlightSeries } from '@/lib/rabbit-data';
import { formatRabbitsPerKm } from '@/lib/rabbit-format';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

function getMicrosite(slug: string): MicrositeConfig | undefined {
  return MICROSITES.find((candidate) => candidate.slug === slug);
}

export default async function HomePage(): Promise<React.ReactElement> {
  const [sheep, livestock, horticulture, forestry, quakes, rabbit, registerTotal, catalogueTotal] =
    await Promise.all([
      fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
      fetchLivestockSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
      fetchHorticultureSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
      fetchForestrySeries(env.STATS_NZ_SUBSCRIPTION_KEY),
      fetchRecentQuakes(),
      fetchRabbitSpotlightSeries(),
      fetchRegisterTotal(),
      fetchCatalogueTotal(),
    ]);

  const livestockStats = summarizeLivestock(livestock);
  const horticultureStats = summarizeHorticulture(horticulture);
  const forestryStats = summarizeForestry(forestry);
  const dairy = livestockStats.find((stat) => stat.key === 'dairyCattle');
  const deer = livestockStats.find((stat) => stat.key === 'deer');
  const wineGrapes = horticultureStats.find((stat) => stat.key === 'wineGrapes');
  const kiwifruit = horticultureStats.find((stat) => stat.key === 'kiwifruit');
  const newPlanting = forestryStats.find((stat) => stat.key === 'newPlanting');

  const cards = [
    {
      config: getMicrosite('sheep-index'),
      statLabel: `Sheep right now (${sheep.latest.year})`,
      statValue: formatMillionsSheep(sheep.latest.sheep),
    },
    {
      config: getMicrosite('dairy-takeover'),
      statLabel: `Dairy cattle now (${livestock.latest.year})`,
      statValue: formatMillions(dairy?.latest ?? 0),
    },
    {
      config: getMicrosite('vineyard-boom'),
      statLabel: `Wine grapes now (${horticulture.latest.year})`,
      statValue: formatHectares(wineGrapes?.latest ?? 0),
    },
    {
      config: getMicrosite('planting-bust'),
      statLabel: `New planting in ${forestry.latest.year}`,
      statValue: formatHectares(newPlanting?.latest ?? 0),
    },
    {
      config: getMicrosite('kiwifruit-overtake'),
      statLabel: `Kiwifruit now (${horticulture.latest.year})`,
      statValue: formatHectares(kiwifruit?.latest ?? 0),
    },
    {
      config: getMicrosite('deer-boom-bust'),
      statLabel: `Farmed deer now (${livestock.latest.year})`,
      statValue: formatMillions(deer?.latest ?? 0),
    },
    {
      config: getMicrosite('shake-index'),
      statLabel: 'Recent felt quakes',
      statValue: String(quakes.length),
    },
    {
      config: getMicrosite('species-register'),
      statLabel: 'Names in the register',
      statValue: registerTotal.toLocaleString('en-NZ'),
    },
    {
      config: getMicrosite('open-data-catalogue'),
      statLabel: 'Datasets in the catalogue',
      statValue: catalogueTotal.toLocaleString('en-NZ'),
    },
    {
      config: getMicrosite('digitised-memory'),
      statLabel: "Records matching 'gold'",
      statValue: DIGITALNZ_GOLD_RECORDS,
    },
    {
      config: getMicrosite('online-garage-sale'),
      statLabel: 'Leaf categories',
      statValue: TRADEME_LEAF_CATEGORIES,
    },
    {
      config: getMicrosite('backyard-species-census'),
      statLabel: 'Observations in New Zealand',
      statValue: INATURALIST_NZ_OBSERVATIONS,
    },
    {
      config: getMicrosite('species-record-ledger'),
      statLabel: 'Records in 2024',
      statValue: GBIF_NZ_RECORDS_2024,
    },
    {
      config: getMicrosite('what-the-world-reads'),
      statLabel: 'New Zealand page peak',
      statValue: WIKIPEDIA_NZ_PAGE_PEAK,
    },
    {
      config: getMicrosite('river-lengths'),
      statLabel: 'Longest river',
      statValue: '425 km',
    },
    {
      config: getMicrosite('peak-heights'),
      statLabel: 'Highest peak',
      statValue: '3,724 m',
    },
    {
      config: getMicrosite('auckland-parks'),
      statLabel: 'Parks in Auckland',
      statValue: '3,953',
    },
    {
      config: getMicrosite('open-school-map'),
      statLabel: 'Schools on OpenStreetMap',
      statValue: '2,604',
    },
    {
      config: getMicrosite('canterbury-rain'),
      statLabel: 'Wettest gauge in a day',
      statValue: '40.5 mm',
    },
    {
      config: getMicrosite('hamilton-playgrounds'),
      statLabel: 'Playgrounds in Hamilton',
      statValue: '85',
    },
    {
      config: getMicrosite('census-rank-shift'),
      statLabel: 'Selwyn rank jump',
      statValue: '+10 places',
    },
    {
      config: getMicrosite('age-pyramid'),
      statLabel: 'People, 1 July 2021',
      statValue: '5,122,600',
    },
    {
      config: getMicrosite('quake-magnitudes'),
      statLabel: 'Quakes located, 3 months',
      statValue: '5,148',
    },
    {
      config: getMicrosite('ev-charging'),
      statLabel: 'Public EV charging stations',
      statValue: '639',
    },
    {
      config: getMicrosite('road-crash-trend'),
      statLabel: 'Crashes in 2025',
      statValue: '29,017',
    },
    {
      config: getMicrosite('vehicle-fleet'),
      statLabel: 'Electric vehicles',
      statValue: '107,525',
    },
    {
      config: getMicrosite('rabbit-boom'),
      statLabel: `Rabbits per km (${rabbit.latest.year})`,
      statValue: formatRabbitsPerKm(rabbit.latest.rabbitsPerKm),
    },
    {
      config: getMicrosite('quake-years'),
      statLabel: 'Quakes at M4+, 2001-2024',
      statValue: '7,265',
    },
    {
      config: getMicrosite('region-density'),
      statLabel: 'People per km², NZ',
      statValue: '18.9',
    },
  ].filter(
    (card): card is { config: MicrositeConfig; statLabel: string; statValue: string } =>
      card.config !== undefined,
  );
  // The cards array is in ship order (oldest first); show the newest first.
  cards.reverse();

  return (
    <>
      <Container size="wide">
        <Stack className="max-w-3xl gap-4 py-[var(--spacing-2xl)]">
          <h1 className="numeral-heading-3xl">
            Small experiments digging through New Zealand public data for the weird, the funny, and
            the surprising.
          </h1>
          <p className="numeral-paragraph-lg text-[var(--color-muted)]">
            {cards.length} live microsites. Stats NZ at deploy time, plus GeoNet, NZOR,
            data.govt.nz, DigitalNZ, Trade Me, iNaturalist, GBIF, and Wikipedia live from the
            browser.
          </p>
        </Stack>
        <div className="grid gap-6 pb-[var(--spacing-3xl)] sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <MicrositeCard
              key={card.config.slug}
              slug={card.config.slug}
              eyebrow={card.config.eyebrow}
              title={card.config.title}
              description={card.config.description}
              statLabel={card.statLabel}
              statValue={card.statValue}
              accent={card.config.accent}
            />
          ))}
        </div>
      </Container>
      <ReportIssueButton />
    </>
  );
}
