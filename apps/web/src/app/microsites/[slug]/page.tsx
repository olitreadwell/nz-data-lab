import { Container } from '@nzlab/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ForestryChart } from '@/components/ForestryChart';
import { HorticultureChart } from '@/components/HorticultureChart';
import { LivestockChart } from '@/components/LivestockChart';
import { MicrositeStory } from '@/components/MicrositeStory';
import { SheepChart } from '@/components/SheepChart';
import { StatCard } from '@/components/StatCard';
import { env } from '@/env';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import { fetchLivestockSeries, summarizeLivestock } from '@/lib/livestock-data';
import { MICROSITES } from '@/lib/microsites';
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

  const [sheep, livestock, horticulture, forestry] = await Promise.all([
    fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchLivestockSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchHorticultureSeries(env.STATS_NZ_SUBSCRIPTION_KEY),
    fetchForestrySeries(env.STATS_NZ_SUBSCRIPTION_KEY),
  ]);

  const livestockStats = summarizeLivestock(livestock);
  const horticultureStats = summarizeHorticulture(horticulture);
  const forestryStats = summarizeForestry(forestry);
  const dairy = livestockStats.find((stat) => stat.key === 'dairyCattle');
  const wineGrapes = horticultureStats.find((stat) => stat.key === 'wineGrapes');
  const newPlanting = forestryStats.find((stat) => stat.key === 'newPlanting');

  const content = renderStoryContent(slug, {
    sheep,
    livestock,
    horticulture,
    forestry,
    dairy,
    wineGrapes,
    newPlanting,
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
  wineGrapes: { latest?: number; first?: number; changeFromFirstPercent?: number } | undefined;
  newPlanting: { latest?: number; first?: number; changeFromFirstPercent?: number } | undefined;
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
    default:
      return { chart: null, stats: null };
  }
}
