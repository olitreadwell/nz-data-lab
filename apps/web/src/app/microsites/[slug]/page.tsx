import { summarizeGeoNetQuakes } from '@nzlab/nz-sources';
import { Container } from '@nzlab/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AgeDistributionHistogram } from '@/components/AgeDistributionHistogram';
import { AgePyramid } from '@/components/AgePyramid';
import { AucklandParks } from '@/components/AucklandParks';
import { BackyardSpeciesCensus } from '@/components/BackyardSpeciesCensus';
import { CanterburyRain } from '@/components/CanterburyRain';
import { CityRankSlope } from '@/components/CityRankSlope';
import { DeerBoomBustChart } from '@/components/DeerBoomBustChart';
import { DigitisedMemorySearch } from '@/components/DigitisedMemorySearch';
import { EvCharging } from '@/components/EvCharging';
import { ExportDestinationSlope } from '@/components/ExportDestinationSlope';
import { ForestryChart } from '@/components/ForestryChart';
import { HamiltonPlaygrounds } from '@/components/HamiltonPlaygrounds';
import { HorticultureChart } from '@/components/HorticultureChart';
import { KiwifruitOvertakeChart } from '@/components/KiwifruitOvertakeChart';
import { LivestockChart } from '@/components/LivestockChart';
import { MedianAgeRankSlope } from '@/components/MedianAgeRankSlope';
import { MicrositeStory } from '@/components/MicrositeStory';
import { OpenDataSearch } from '@/components/OpenDataSearch';
import { PeakHeights } from '@/components/PeakHeights';
import { PopulationRankBump } from '@/components/PopulationRankBump';
import { QuakeDepthDistribution } from '@/components/QuakeDepthDistribution';
import { QuakeDepthScatter } from '@/components/QuakeDepthScatter';
import { QuakeFrequencyMagnitude } from '@/components/QuakeFrequencyMagnitude';
import { QuakeMagnitudeHistogram } from '@/components/QuakeMagnitudeHistogram';
import { QuakeMap } from '@/components/QuakeMap';
import { QuakeMonthRose } from '@/components/QuakeMonthRose';
import { RabbitChart } from '@/components/RabbitChart';
import { RegionalRankSlope } from '@/components/RegionalRankSlope';
import { ReportIssueButton } from '@/components/ReportIssueButton';
import { RiverLengths } from '@/components/RiverLengths';
import { RoadCrashTrend } from '@/components/RoadCrashTrend';
import { SchoolRoll } from '@/components/SchoolRoll';
import { SheepChart } from '@/components/SheepChart';
import { SpeciesRecordLedger } from '@/components/SpeciesRecordLedger';
import { SpeciesRegisterSearch } from '@/components/SpeciesRegisterSearch';
import { StatCard } from '@/components/StatCard';
import { TradeMeTree } from '@/components/TradeMeTree';
import { VehicleFleet } from '@/components/VehicleFleet';
import { VisitorRankSlope } from '@/components/VisitorRankSlope';
import { WhatTheWorldReads } from '@/components/WhatTheWorldReads';
import { env } from '@/env';
import { CENSUS_RANK_HIGHLIGHTS, formatRankOrdinal } from '@/lib/census-rank-data';
import { CITY_RANK_ROWS } from '@/lib/city-rank-data';
import { EXPORT_DESTINATION_ROWS } from '@/lib/export-destination-data';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import {
  CATALOGUE_CLIMATE_MATCHES,
  CATALOGUE_WATER_MATCHES,
  DIGITALNZ_GOLD_1890S_RECORDS,
  DIGITALNZ_GOLD_RECORDS,
  FELT_QUAKES_PER_YEAR,
  fetchCatalogueTotal,
  fetchRegisterTotal,
  NATIVE_FRESHWATER_FISH,
  NATIVE_FROG_SPECIES,
  TRADEME_HOME_LIVING_LEAVES,
  TRADEME_LEAF_CATEGORIES,
  TRADEME_MOTORS_LEAVES,
} from '@/lib/headline-stats';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import { fetchLivestockSeries, summarizeLivestock } from '@/lib/livestock-data';
import { MICROSITES } from '@/lib/microsites';
import { fetchRecentQuakeCatalog } from '@/lib/quake-catalog';
import type { QuakeCatalogEvent } from '@/lib/quake-catalog';
import { fetchRecentQuakes } from '@/lib/quake-data';
import {
  buildQuakeMonthBins,
  fetchQuakeMonthCatalog,
  summarizeQuakeMonths,
} from '@/lib/quake-month-data';
import { fetchRabbitSpotlightSeries } from '@/lib/rabbit-data';
import type { RabbitSpotlightSeries } from '@/lib/rabbit-data';
import { formatRabbitsPerKm } from '@/lib/rabbit-format';
import { REGIONAL_CENSUS_ROWS } from '@/lib/regional-census-data';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

interface MicrositePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return MICROSITES.map((microsite) => ({ slug: microsite.slug }));
}

export async function generateMetadata({ params }: MicrositePageProps): Promise<Metadata> {
  const { slug } = await params;
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined) {
    return { title: 'nz-data-lab' };
  }
  return { title: `${microsite.label} - nz-data-lab` };
}

export default async function MicrositePage({
  params,
}: MicrositePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined) {
    notFound();
  }

  const [
    sheep,
    livestock,
    horticulture,
    forestry,
    quakes,
    rabbit,
    registerTotal,
    catalogueTotal,
    quakeCatalog,
    quakeMonthCatalog,
  ] = await Promise.all([
    fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchLivestockSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchHorticultureSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchForestrySeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchRecentQuakes(),
    fetchRabbitSpotlightSeries(),
    fetchRegisterTotal(),
    fetchCatalogueTotal(),
    fetchRecentQuakeCatalog(3),
    fetchQuakeMonthCatalog(),
  ]);

  const livestockStats = summarizeLivestock(livestock);
  const horticultureStats = summarizeHorticulture(horticulture);
  const forestryStats = summarizeForestry(forestry);
  const dairy = livestockStats.find((stat) => stat.key === 'dairyCattle');
  const deer = livestockStats.find((stat) => stat.key === 'deer');
  const wineGrapes = horticultureStats.find((stat) => stat.key === 'wineGrapes');
  const kiwifruit = horticultureStats.find((stat) => stat.key === 'kiwifruit');
  const apples = horticultureStats.find((stat) => stat.key === 'apples');
  const newPlanting = forestryStats.find((stat) => stat.key === 'newPlanting');

  const content = renderStoryContent(slug, {
    sheep,
    livestock,
    horticulture,
    forestry,
    dairy,
    deer,
    wineGrapes,
    kiwifruit,
    apples,
    newPlanting,
    quakes,
    rabbit,
    quakeCatalog,
    quakeMonthCatalog,
    registerTotal,
    catalogueTotal,
  });

  return (
    <>
      <Container size="wide">
        <Link
          href="/"
          className="numeral-paragraph-sm inline-block py-[var(--spacing-2xl)] text-[var(--color-muted)] underline hover:text-[var(--color-fg)]"
        >
          All microsites
        </Link>
      </Container>
      <MicrositeStory
        id={microsite.slug}
        eyebrow={microsite.eyebrow}
        title={microsite.title}
        description={microsite.description}
        paragraphs={microsite.paragraphs}
        accent={microsite.accent}
        chart={content.chart}
        stats={content.stats}
        dataNote={microsite.dataNote}
        references={microsite.references}
      />
      <ReportIssueButton pageLabel={microsite.label} />
    </>
  );
}

interface StoryData {
  sheep: Awaited<ReturnType<typeof fetchSheepSeries>>;
  livestock: Awaited<ReturnType<typeof fetchLivestockSeries>>;
  horticulture: Awaited<ReturnType<typeof fetchHorticultureSeries>>;
  forestry: Awaited<ReturnType<typeof fetchForestrySeries>>;
  dairy: { latest?: number; first?: number; changeFromFirstPercent?: number } | undefined;
  deer:
    | { latest?: number; peak?: number; peakYear?: number; changeFromPeakPercent?: number }
    | undefined;
  wineGrapes: { latest?: number; first?: number; changeFromFirstPercent?: number } | undefined;
  kiwifruit: { latest?: number; first?: number } | undefined;
  apples: { latest?: number } | undefined;
  newPlanting: { latest?: number; first?: number; changeFromFirstPercent?: number } | undefined;
  quakes: Awaited<ReturnType<typeof fetchRecentQuakes>>;
  rabbit: RabbitSpotlightSeries;
  quakeCatalog: QuakeCatalogEvent[];
  quakeMonthCatalog: QuakeCatalogEvent[];
  registerTotal: number;
  catalogueTotal: number;
}

function renderStoryContent(
  slug: string,
  data: StoryData,
): { chart: React.ReactNode; stats: React.ReactNode } {
  switch (slug) {
    case 'rabbit-boom':
      return {
        chart: <RabbitChart points={data.rabbit.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Rabbits per km (${data.rabbit.latest.year})`}
              value={formatRabbitsPerKm(data.rabbit.latest.rabbitsPerKm)}
              accent="emerald"
              testId="rabbit-latest"
              dataValue={data.rabbit.latest.rabbitsPerKm}
            />
            <StatCard
              label={`Rabbits per km (${data.rabbit.first.year})`}
              value={formatRabbitsPerKm(data.rabbit.first.rabbitsPerKm)}
              accent="emerald"
            />
            <StatCard
              label={`Change since ${data.rabbit.first.year}`}
              value={`+${Math.round(data.rabbit.changeFromFirstPercent)}%`}
              accent="emerald"
              testId="rabbit-change"
              dataValue={Math.round(data.rabbit.changeFromFirstPercent)}
            />
          </dl>
        ),
      };
    case 'sheep-index':
      return {
        chart: <SheepChart points={data.sheep.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Sheep right now (${data.sheep.latest.year})`}
              value={formatMillionsSheep(data.sheep.latest.sheep)}
              accent="amber"
              testId="sheep-latest"
              dataValue={data.sheep.latest.sheep}
            />
            <StatCard
              label={`Peak flock (${data.sheep.peak.year})`}
              value={formatMillionsSheep(data.sheep.peak.sheep)}
              accent="amber"
            />
            <StatCard
              label="Change since peak"
              value={`${Math.round(data.sheep.changeFromPeakPercent)}%`}
              accent="amber"
              testId="sheep-change"
              dataValue={Math.round(data.sheep.changeFromPeakPercent)}
            />
          </dl>
        ),
      };
    case 'dairy-takeover':
      return {
        chart: <LivestockChart points={data.livestock.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Dairy cattle now (${data.livestock.latest.year})`}
              value={formatMillions(data.dairy?.latest ?? 0)}
              accent="sky"
              testId="dairy-latest"
              dataValue={data.dairy?.latest}
            />
            <StatCard
              label={`Dairy cattle in ${data.livestock.first.year}`}
              value={formatMillions(data.dairy?.first ?? 0)}
              accent="sky"
            />
            <StatCard
              label="Change since 1994"
              value={`${Math.round(data.dairy?.changeFromFirstPercent ?? 0)}%`}
              accent="sky"
              testId="dairy-change"
              dataValue={Math.round(data.dairy?.changeFromFirstPercent ?? 0)}
            />
          </dl>
        ),
      };
    case 'vineyard-boom':
      return {
        chart: <HorticultureChart points={data.horticulture.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Wine grapes now (${data.horticulture.latest.year})`}
              value={formatHectares(data.wineGrapes?.latest ?? 0)}
              accent="purple"
              testId="wine-latest"
              dataValue={data.wineGrapes?.latest}
            />
            <StatCard
              label={`Wine grapes in ${data.horticulture.first.year}`}
              value={formatHectares(data.wineGrapes?.first ?? 0)}
              accent="purple"
            />
            <StatCard
              label="Change since 1994"
              value={`+${Math.round(data.wineGrapes?.changeFromFirstPercent ?? 0)}%`}
              accent="purple"
              testId="wine-change"
              dataValue={Math.round(data.wineGrapes?.changeFromFirstPercent ?? 0)}
            />
          </dl>
        ),
      };
    case 'planting-bust':
      return {
        chart: <ForestryChart points={data.forestry.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`New planting in ${data.forestry.first.year}`}
              value={formatHectares(data.newPlanting?.first ?? 0)}
              accent="emerald"
              testId="planting-first"
              dataValue={data.newPlanting?.first}
            />
            <StatCard
              label={`New planting in ${data.forestry.latest.year}`}
              value={formatHectares(data.newPlanting?.latest ?? 0)}
              accent="emerald"
              testId="planting-latest"
              dataValue={data.newPlanting?.latest}
            />
            <StatCard
              label="Change since 2002"
              value={`${Math.round(data.newPlanting?.changeFromFirstPercent ?? 0)}%`}
              accent="emerald"
              testId="planting-change"
              dataValue={Math.round(data.newPlanting?.changeFromFirstPercent ?? 0)}
            />
          </dl>
        ),
      };
    case 'kiwifruit-overtake':
      return {
        chart: <KiwifruitOvertakeChart points={data.horticulture.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Kiwifruit now (${data.horticulture.latest.year})`}
              value={formatHectares(data.kiwifruit?.latest ?? 0)}
              accent="lime"
              testId="kiwifruit-latest"
              dataValue={data.kiwifruit?.latest}
            />
            <StatCard
              label={`Apples now (${data.horticulture.latest.year})`}
              value={formatHectares(data.apples?.latest ?? 0)}
              accent="lime"
              testId="apples-latest"
              dataValue={data.apples?.latest}
            />
            <StatCard
              label={`Kiwifruit in ${data.horticulture.first.year}`}
              value={formatHectares(data.kiwifruit?.first ?? 0)}
              accent="lime"
            />
          </dl>
        ),
      };
    case 'deer-boom-bust':
      return {
        chart: <DeerBoomBustChart points={data.livestock.points} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Farmed deer now (${data.livestock.latest.year})`}
              value={formatMillions(data.deer?.latest ?? 0)}
              accent="violet"
              testId="deer-latest"
              dataValue={data.deer?.latest}
            />
            <StatCard
              label={`Peak herd (${data.deer?.peakYear ?? ''})`}
              value={formatMillions(data.deer?.peak ?? 0)}
              accent="violet"
            />
            <StatCard
              label="Change since peak"
              value={`${Math.round(data.deer?.changeFromPeakPercent ?? 0)}%`}
              accent="violet"
              testId="deer-change"
              dataValue={Math.round(data.deer?.changeFromPeakPercent ?? 0)}
            />
          </dl>
        ),
      };
    case 'species-register':
      return {
        chart: <SpeciesRegisterSearch initialQuery="kiwi" />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Names in the register"
              value={data.registerTotal.toLocaleString('en-NZ')}
              accent="teal"
            />
            <StatCard label="Native freshwater fish" value={NATIVE_FRESHWATER_FISH} accent="teal" />
            <StatCard label="Native frog species" value={NATIVE_FROG_SPECIES} accent="teal" />
          </dl>
        ),
      };
    case 'open-data-catalogue':
      return {
        chart: <OpenDataSearch initialQuery="water" />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Datasets in the catalogue"
              value={data.catalogueTotal.toLocaleString('en-NZ')}
              accent="indigo"
            />
            <StatCard
              label="Datasets matching 'water'"
              value={CATALOGUE_WATER_MATCHES}
              accent="indigo"
            />
            <StatCard
              label="Datasets matching 'climate'"
              value={CATALOGUE_CLIMATE_MATCHES}
              accent="indigo"
            />
          </dl>
        ),
      };
    case 'digitised-memory':
      return {
        chart: <DigitisedMemorySearch initialQuery="gold" />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Records matching 'gold'"
              value={DIGITALNZ_GOLD_RECORDS}
              accent="cyan"
            />
            <StatCard
              label="1890s records matching 'gold'"
              value={DIGITALNZ_GOLD_1890S_RECORDS}
              accent="cyan"
            />
            <StatCard label="Peak decade" value="1890s" accent="cyan" />
          </dl>
        ),
      };
    case 'online-garage-sale':
      return {
        chart: <TradeMeTree />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Leaf categories" value={TRADEME_LEAF_CATEGORIES} accent="fuchsia" />
            <StatCard
              label="Home & living leaves"
              value={TRADEME_HOME_LIVING_LEAVES}
              accent="fuchsia"
            />
            <StatCard label="Motors leaves" value={TRADEME_MOTORS_LEAVES} accent="fuchsia" />
          </dl>
        ),
      };
    case 'backyard-species-census':
      return {
        chart: <BackyardSpeciesCensus />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Observations in New Zealand" value="4,342,223" accent="emerald" />
            <StatCard label="Species logged" value="23,828" accent="emerald" />
            <StatCard label="Observers" value="65,569" accent="emerald" />
          </dl>
        ),
      };
    case 'species-record-ledger':
      return {
        chart: <SpeciesRecordLedger />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Records in 2014" value="748,744" accent="indigo" />
            <StatCard label="Records in 2024" value="1,920,171" accent="indigo" />
            <StatCard label="Animal share in 2024" value="78%" accent="indigo" />
          </dl>
        ),
      };
    case 'what-the-world-reads':
      return {
        chart: <WhatTheWorldReads />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="New Zealand page peak" value="21,562" accent="sky" />
            <StatCard label="Lord of the Rings peak" value="10,438" accent="sky" />
            <StatCard label="Jacinda Ardern peak" value="8,429" accent="sky" />
          </dl>
        ),
      };
    case 'river-lengths':
      return {
        chart: <RiverLengths />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Longest river" value="Waikato, 425 km" accent="cyan" />
            <StatCard label="Top 10 total" value="2,603 km" accent="cyan" />
            <StatCard label="Rivers over 200 km" value="7" accent="cyan" />
          </dl>
        ),
      };
    case 'peak-heights':
      return {
        chart: <PeakHeights />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Highest peak" value="Aoraki, 3,724 m" accent="violet" />
            <StatCard label="Top 10 total" value="33,278 m" accent="violet" />
            <StatCard label="Peaks above 3,200 m" value="6" accent="violet" />
          </dl>
        ),
      };
    case 'auckland-parks':
      return {
        chart: <AucklandParks />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Parks in Auckland" value="3,953" accent="emerald" />
            <StatCard label="Park land" value="53,677 ha" accent="emerald" />
            <StatCard label="Franklin + Waitākere share" value="72%" accent="emerald" />
          </dl>
        ),
      };
    case 'open-school-map':
      return {
        chart: <SchoolRoll />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Schools mapped" value="2,604" accent="amber" />
            <StatCard label="Primary schools" value="1,713" accent="amber" />
            <StatCard label="State schools" value="2,075" accent="amber" />
          </dl>
        ),
      };
    case 'canterbury-rain':
      return {
        chart: <CanterburyRain />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Rain gauges" value="109" accent="sky" />
            <StatCard label="Wettest gauge today" value="40.5 mm" accent="sky" />
            <StatCard label="Wettest gauge total" value="86 mm" accent="sky" />
          </dl>
        ),
      };
    case 'hamilton-playgrounds':
      return {
        chart: <HamiltonPlaygrounds />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Playgrounds" value="85" accent="emerald" />
            <StatCard label="Neighbourhood playgrounds" value="77" accent="emerald" />
            <StatCard label="Built in the 2000s" value="35" accent="emerald" />
          </dl>
        ),
      };
    case 'census-rank-shift': {
      return {
        chart: <PopulationRankBump />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            {CENSUS_RANK_HIGHLIGHTS.map((highlight) => (
              <StatCard
                key={highlight.slug}
                label={highlight.label}
                value={`${formatRankOrdinal(highlight.fromRank)} to ${formatRankOrdinal(highlight.toRank)}`}
                accent="amber"
                testId={`${highlight.slug}-rank-change`}
                dataValue={highlight.change}
              />
            ))}
          </dl>
        ),
      };
    }
    case 'age-pyramid': {
      return {
        chart: <AgePyramid />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="People, 1 July 2021 estimates"
              value="5,122,600"
              accent="cyan"
              testId="pyramid-total"
              dataValue={5122600}
            />
            <StatCard
              label="Women at 90 and over"
              value="22,570"
              accent="cyan"
              testId="pyramid-women-90"
              dataValue={22570}
            />
            <StatCard
              label="Men at 90 and over"
              value="12,010"
              accent="cyan"
              testId="pyramid-men-90"
              dataValue={12010}
            />
          </dl>
        ),
      };
    }
    case 'quake-depth-scatter': {
      const shallow = data.quakeCatalog.filter((event) => event.depthKm < 40).length;
      const shallowPercent =
        data.quakeCatalog.length === 0 ? 0 : Math.round((shallow / data.quakeCatalog.length) * 100);
      const deepest = data.quakeCatalog.reduce<QuakeCatalogEvent | undefined>(
        (best, event) => (best === undefined || event.depthKm > best.depthKm ? event : best),
        undefined,
      );
      return {
        chart: <QuakeDepthScatter events={data.quakeCatalog} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Quakes located, 3 months"
              value={data.quakeCatalog.length.toLocaleString('en-NZ')}
              accent="rose"
              testId="quake-depth-total"
              dataValue={data.quakeCatalog.length}
            />
            <StatCard
              label="Share shallower than 40 km"
              value={`${shallowPercent}%`}
              accent="rose"
              testId="quake-depth-shallow-percent"
              dataValue={shallowPercent}
            />
            <StatCard
              label="Deepest located"
              value={
                deepest === undefined ? 'n/a' : `${deepest.depthKm.toLocaleString('en-NZ')} km`
              }
              accent="rose"
              testId="quake-depth-deepest"
              dataValue={deepest?.depthKm}
            />
          </dl>
        ),
      };
    }
    case 'quake-frequency-magnitude': {
      const atLeastFour = data.quakeCatalog.filter((event) => event.magnitude >= 4).length;
      const atLeastSix = data.quakeCatalog.filter((event) => event.magnitude >= 6).length;
      return {
        chart: <QuakeFrequencyMagnitude events={data.quakeCatalog} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Quakes located, 3 months"
              value={data.quakeCatalog.length.toLocaleString('en-NZ')}
              accent="indigo"
              testId="quake-frequency-total"
              dataValue={data.quakeCatalog.length}
            />
            <StatCard
              label="Magnitude 4 or stronger"
              value={atLeastFour.toLocaleString('en-NZ')}
              accent="indigo"
              testId="quake-frequency-at-least-four"
              dataValue={atLeastFour}
            />
            <StatCard
              label="Magnitude 6 or stronger"
              value={atLeastSix.toLocaleString('en-NZ')}
              accent="indigo"
              testId="quake-frequency-at-least-six"
              dataValue={atLeastSix}
            />
          </dl>
        ),
      };
    }
    case 'quake-depth-distribution': {
      const shallow = data.quakeCatalog.filter((event) => event.depthKm < 40).length;
      const shallowPercent =
        data.quakeCatalog.length === 0 ? 0 : Math.round((shallow / data.quakeCatalog.length) * 100);
      const deepest = data.quakeCatalog.reduce<QuakeCatalogEvent | undefined>(
        (best, event) => (best === undefined || event.depthKm > best.depthKm ? event : best),
        undefined,
      );
      return {
        chart: <QuakeDepthDistribution events={data.quakeCatalog} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Quakes located, 3 months"
              value={data.quakeCatalog.length.toLocaleString('en-NZ')}
              accent="teal"
              testId="quake-depth-distribution-total"
              dataValue={data.quakeCatalog.length}
            />
            <StatCard
              label="Share shallower than 40 km"
              value={`${shallowPercent}%`}
              accent="teal"
              testId="quake-depth-distribution-shallow-percent"
              dataValue={shallowPercent}
            />
            <StatCard
              label="Deepest located"
              value={
                deepest === undefined ? 'n/a' : `${deepest.depthKm.toLocaleString('en-NZ')} km`
              }
              accent="teal"
              testId="quake-depth-distribution-deepest"
              dataValue={deepest?.depthKm}
            />
          </dl>
        ),
      };
    }
    case 'quake-magnitudes': {
      const underTwo = data.quakeCatalog.filter((event) => event.magnitude < 2).length;
      const strongest = data.quakeCatalog.reduce<QuakeCatalogEvent | undefined>(
        (best, event) => (best === undefined || event.magnitude > best.magnitude ? event : best),
        undefined,
      );
      const underTwoPercent =
        data.quakeCatalog.length === 0
          ? 0
          : Math.round((underTwo / data.quakeCatalog.length) * 100);
      return {
        chart: <QuakeMagnitudeHistogram events={data.quakeCatalog} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Quakes located, 3 months"
              value={data.quakeCatalog.length.toLocaleString('en-NZ')}
              accent="rose"
              testId="quake-catalog-total"
              dataValue={data.quakeCatalog.length}
            />
            <StatCard
              label="Share under magnitude 2"
              value={`${underTwoPercent}%`}
              accent="rose"
              testId="quake-under-two-percent"
              dataValue={underTwoPercent}
            />
            <StatCard
              label="Biggest located"
              value={strongest === undefined ? 'n/a' : `M ${strongest.magnitude.toFixed(1)}`}
              accent="rose"
              testId="quake-catalog-strongest"
              dataValue={strongest?.magnitude}
            />
          </dl>
        ),
      };
    }
    case 'quake-months': {
      const monthBins = buildQuakeMonthBins(data.quakeMonthCatalog, 'all', 3);
      const monthSummary = summarizeQuakeMonths(monthBins);
      return {
        chart: <QuakeMonthRose events={data.quakeMonthCatalog} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Quakes M3+, 2 years"
              value={monthSummary.total.toLocaleString('en-NZ')}
              accent="rose"
              testId="quake-months-total"
              dataValue={monthSummary.total}
            />
            <StatCard
              label="Busiest month"
              value={`${monthSummary.busiest.label} (${monthSummary.busiest.count.toLocaleString('en-NZ')})`}
              accent="rose"
              testId="quake-months-busiest"
              dataValue={monthSummary.busiest.count}
            />
            <StatCard
              label="Quietest month"
              value={`${monthSummary.quietest.label} (${monthSummary.quietest.count.toLocaleString('en-NZ')})`}
              accent="rose"
              testId="quake-months-quietest"
              dataValue={monthSummary.quietest.count}
            />
          </dl>
        ),
      };
    }
    case 'ev-charging':
      return {
        chart: <EvCharging />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Public charging stations" value="639" accent="emerald" />
            <StatCard label="ChargeNet share" value="307" accent="emerald" />
            <StatCard label="DC stations" value="566" accent="emerald" />
          </dl>
        ),
      };
    case 'road-crash-trend':
      return {
        chart: <RoadCrashTrend />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Crashes in 2006" value="39,778" accent="rose" />
            <StatCard label="Crashes in 2025" value="29,017" accent="rose" />
            <StatCard label="Change" value="-27%" accent="rose" />
          </dl>
        ),
      };
    case 'vehicle-fleet':
      return {
        chart: <VehicleFleet />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Vehicles in the register" value="5.9 M" accent="sky" />
            <StatCard label="Electric vehicles" value="107,525" accent="sky" />
            <StatCard label="Petrol vehicles" value="3.18 M" accent="sky" />
          </dl>
        ),
      };
    case 'shake-index': {
      const summary = summarizeGeoNetQuakes(data.quakes);
      const strongest = summary.strongest;
      return {
        chart: <QuakeMap quakes={data.quakes} />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Recent felt quakes"
              value={String(summary.total)}
              accent="rose"
              testId="quake-total"
              dataValue={summary.total}
            />
            <StatCard
              label={
                strongest === undefined ? 'Strongest recent' : `Strongest: ${strongest.locality}`
              }
              value={strongest === undefined ? 'n/a' : `M ${strongest.magnitude.toFixed(1)}`}
              accent="rose"
              testId="quake-strongest"
              dataValue={strongest?.magnitude}
            />
            <StatCard label="Felt quakes per year" value={FELT_QUAKES_PER_YEAR} accent="rose" />
          </dl>
        ),
      };
    }
    case 'regional-population-ranks': {
      const auckland = REGIONAL_CENSUS_ROWS.find((row) => row.name === 'Auckland');
      const westCoast = REGIONAL_CENSUS_ROWS.find((row) => row.name === 'West Coast');
      return {
        chart: <RegionalRankSlope />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Auckland region, 2023 census"
              value={auckland?.population2023.toLocaleString('en-NZ') ?? ''}
              accent="teal"
              testId="auckland-region-population"
              dataValue={auckland?.population2023}
            />
            <StatCard
              label="Auckland rank, 2013 and 2023"
              value="#1 both censuses"
              accent="teal"
              testId="auckland-region-rank"
              dataValue={auckland?.rank2023}
            />
            <StatCard
              label="West Coast rank, 2023"
              value="#16"
              accent="teal"
              testId="west-coast-rank"
              dataValue={westCoast?.rank2023}
            />
          </dl>
        ),
      };
    }
    case 'export-destination-ranks': {
      const china = EXPORT_DESTINATION_ROWS.find((row) => row.name === 'China');
      const australia = EXPORT_DESTINATION_ROWS.find((row) => row.name === 'Australia');
      return {
        chart: <ExportDestinationSlope />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="China rank, 2026"
              value="#1"
              accent="indigo"
              testId="china-rank"
              dataValue={china?.rank2026}
            />
            <StatCard
              label="Australia rank, 2026"
              value="#2"
              accent="indigo"
              testId="australia-rank"
              dataValue={australia?.rank2026}
            />
            <StatCard
              label="China exports, year ended March 2026"
              value={`$${(china?.exports2026 ?? 0).toFixed(1)}b`}
              accent="indigo"
              testId="china-exports"
              dataValue={china?.exports2026}
            />
          </dl>
        ),
      };
    }
    case 'city-population-ranks': {
      const tauranga = CITY_RANK_ROWS.find((row) => row.name === 'Tauranga city');
      const aucklandCity = CITY_RANK_ROWS.find((row) => row.name === 'Auckland');
      const dunedin = CITY_RANK_ROWS.find((row) => row.name === 'Dunedin city');
      return {
        chart: <CityRankSlope />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Tauranga rank, 2023"
              value="#5"
              accent="cyan"
              testId="tauranga-rank"
              dataValue={tauranga?.rank2023}
            />
            <StatCard
              label="Auckland rank, 2023"
              value="#1"
              accent="cyan"
              testId="auckland-city-rank"
              dataValue={aucklandCity?.rank2023}
            />
            <StatCard
              label="Dunedin rank, 2023"
              value="#6"
              accent="cyan"
              testId="dunedin-rank"
              dataValue={dunedin?.rank2023}
            />
          </dl>
        ),
      };
    }
    case 'age-distribution':
      return {
        chart: <AgeDistributionHistogram />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="People counted, 2023 census"
              value="4,993,923"
              accent="teal"
              testId="age-total-2023"
              dataValue={4993923}
            />
            <StatCard
              label="Biggest band, 2023"
              value="30-39: 719,616"
              accent="teal"
              testId="age-biggest-band-2023"
              dataValue={719616}
            />
            <StatCard
              label="50-59 band, 2013"
              value="560,178"
              accent="teal"
              testId="age-bulge-2013"
              dataValue={560178}
            />
          </dl>
        ),
      };
    case 'median-age-ranks':
      return {
        chart: <MedianAgeRankSlope />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Oldest region, 2023"
              value="West Coast, 48.1 years"
              accent="amber"
              testId="oldest-region-median-age"
              dataValue={48.1}
            />
            <StatCard
              label="Youngest region, 2023"
              value="Auckland, 35.9 years"
              accent="amber"
              testId="youngest-region-median-age"
              dataValue={35.9}
            />
            <StatCard
              label="Biggest rank climb"
              value="Southland, 10th to 6th"
              accent="amber"
              testId="median-age-biggest-climb"
              dataValue={4}
            />
          </dl>
        ),
      };
    case 'visitor-arrival-ranks':
      return {
        chart: <VisitorRankSlope />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label="Visitor arrivals, Dec 2019 year"
              value="3,888,473"
              accent="sky"
              testId="visitor-arrivals-2019"
              dataValue={3888473}
            />
            <StatCard
              label="Top source, 2019"
              value="Australia, 1,537,988"
              accent="sky"
              testId="visitor-top-source"
              dataValue={1537988}
            />
            <StatCard
              label="Biggest rank climbers"
              value="Indonesia and Philippines, 5 places"
              accent="sky"
              testId="visitor-biggest-climbers"
              dataValue={5}
            />
          </dl>
        ),
      };
    default:
      return { chart: null, stats: null };
  }
}
