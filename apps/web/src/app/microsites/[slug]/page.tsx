import { summarizeGeoNetQuakes } from '@nzlab/nz-sources';
import { Container } from '@nzlab/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { DeerBoomBustChart } from '@/components/DeerBoomBustChart';
import { DigitisedMemorySearch } from '@/components/DigitisedMemorySearch';
import { ForestryChart } from '@/components/ForestryChart';
import { HorticultureChart } from '@/components/HorticultureChart';
import { KiwifruitOvertakeChart } from '@/components/KiwifruitOvertakeChart';
import { LivestockChart } from '@/components/LivestockChart';
import { MicrositeStory } from '@/components/MicrositeStory';
import { OpenDataSearch } from '@/components/OpenDataSearch';
import { QuakeMap } from '@/components/QuakeMap';
import { SheepChart } from '@/components/SheepChart';
import { SpeciesRegisterSearch } from '@/components/SpeciesRegisterSearch';
import { StatCard } from '@/components/StatCard';
import { TradeMeTree } from '@/components/TradeMeTree';
import { env } from '@/env';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import { fetchLivestockSeries, summarizeLivestock } from '@/lib/livestock-data';
import { MICROSITES } from '@/lib/microsites';
import { fetchRecentQuakes } from '@/lib/quake-data';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

interface MicrositePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return MICROSITES.map((microsite) => ({ slug: microsite.slug }));
}

export default async function MicrositePage({
  params,
}: MicrositePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined) {
    notFound();
  }

  const [sheep, livestock, horticulture, forestry, quakes] = await Promise.all([
    fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchLivestockSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchHorticultureSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchForestrySeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchRecentQuakes(),
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
  });

  return (
    <main>
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
    </main>
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
}

function renderStoryContent(
  slug: string,
  data: StoryData,
): { chart: React.ReactNode; stats: React.ReactNode } {
  switch (slug) {
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
            <StatCard label="Names in the register" value="170,151" accent="teal" />
            <StatCard label="Native freshwater fish" value="51" accent="teal" />
            <StatCard label="Native frog species" value="4" accent="teal" />
          </dl>
        ),
      };
    case 'open-data-catalogue':
      return {
        chart: <OpenDataSearch initialQuery="water" />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Datasets in the catalogue" value="31,915" accent="indigo" />
            <StatCard label="Datasets matching 'water'" value="4,236" accent="indigo" />
            <StatCard label="Datasets matching 'climate'" value="865" accent="indigo" />
          </dl>
        ),
      };
    case 'digitised-memory':
      return {
        chart: <DigitisedMemorySearch initialQuery="gold" />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Records matching 'gold'" value="1,977,021" accent="cyan" />
            <StatCard label="1890s records matching 'gold'" value="427,164" accent="cyan" />
            <StatCard label="Peak decade" value="1890s" accent="cyan" />
          </dl>
        ),
      };
    case 'online-garage-sale':
      return {
        chart: <TradeMeTree />,
        stats: (
          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard label="Leaf categories" value="5,589" accent="fuchsia" />
            <StatCard label="Home & living leaves" value="581" accent="fuchsia" />
            <StatCard label="Motors leaves" value="560" accent="fuchsia" />
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
            <StatCard label="Felt quakes per year" value="~250" accent="rose" />
          </dl>
        ),
      };
    }
    default:
      return { chart: null, stats: null };
  }
}
