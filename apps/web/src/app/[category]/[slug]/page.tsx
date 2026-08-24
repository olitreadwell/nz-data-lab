import { Container } from '@nzlab/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MicrositeStory } from '@/components/MicrositeStory';
import { ReportIssueButton } from '@/components/ReportIssueButton';
import { SheepChart } from '@/components/SheepChart';
import { StatCard } from '@/components/StatCard';
import { env } from '@/env';
import {
  categorySlugFor,
  freshnessLabelFor,
  micrositePathFor,
  MICROSITES,
  relatedMicrositesFor,
} from '@/lib/microsites';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

interface MicrositePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams(): { category: string; slug: string }[] {
  return MICROSITES.map((microsite) => ({
    category: categorySlugFor(microsite),
    slug: microsite.slug,
  }));
}

export async function generateMetadata({ params }: MicrositePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined || categorySlugFor(microsite) !== category) {
    return { title: 'nz-data-lab' };
  }
  const path = micrositePathFor(microsite);
  return {
    title: `${microsite.label} - nz-data-lab`,
    description: microsite.description,
    openGraph: {
      title: `${microsite.label} - nz-data-lab`,
      description: microsite.description,
      url: path,
      type: 'article',
    },
  };
}

export default async function MicrositePage({
  params,
}: MicrositePageProps): Promise<React.ReactElement> {
  const { category, slug } = await params;
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined || categorySlugFor(microsite) !== category) {
    notFound();
  }

  const [sheep] = await Promise.all([fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY)]);

  const related = relatedMicrositesFor(microsite).map((candidate) => ({
    label: candidate.label,
    href: micrositePathFor(candidate),
  }));

  const content = renderStoryContent(slug, { sheep });

  return (
    <>
      <Container size="wide">
        <nav aria-label="Breadcrumb" className="py-[var(--spacing-2xl)]">
          <ol className="numeral-paragraph-sm flex flex-wrap items-center gap-2 text-[var(--color-muted)]">
            <li>
              <Link href="/" className="underline hover:text-[var(--color-fg)]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/${categorySlugFor(microsite)}/`}
                className="underline hover:text-[var(--color-fg)]"
              >
                {microsite.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-fg)]">
              {microsite.label}
            </li>
          </ol>
        </nav>
      </Container>
      <MicrositeStory
        id={microsite.slug}
        eyebrow={microsite.eyebrow}
        title={microsite.title}
        description={microsite.description}
        paragraphs={microsite.paragraphs}
        keyFacts={microsite.keyFacts}
        howToRead={microsite.howToRead}
        sourceUrl={microsite.sourceUrl}
        updatedLabel={freshnessLabelFor(microsite)}
        related={related}
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
    default:
      return { chart: null, stats: null };
  }
}
