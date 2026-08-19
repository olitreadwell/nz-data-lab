import { Container, Stack } from '@nzlab/ui';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { MicrositeGallery } from '@/components/MicrositeGallery';
import type { MicrositeGalleryCard } from '@/components/MicrositeGallery';
import { CATEGORY_SLUGS, MICROSITES } from '@/lib/microsites';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams(): { category: string }[] {
  return Object.values(CATEGORY_SLUGS).map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0];
  return { title: categoryLabel === undefined ? 'nz-data-lab' : `${categoryLabel} - nz-data-lab` };
}

function toGalleryCard(config: (typeof MICROSITES)[number]): MicrositeGalleryCard {
  return {
    slug: config.slug,
    eyebrow: config.eyebrow,
    title: config.title,
    description: config.description,
    accent: config.accent,
    dataSource: config.dataSource,
    chartType: config.chartType,
    category: config.category,
    categorySlug: CATEGORY_SLUGS[config.category],
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps): Promise<React.ReactElement> {
  const { category } = await params;
  const categoryLabel = Object.entries(CATEGORY_SLUGS).find(([, slug]) => slug === category)?.[0];
  if (categoryLabel === undefined) {
    notFound();
  }
  const microsites = MICROSITES.filter((microsite) => microsite.category === categoryLabel);
  const cards = microsites.map(toGalleryCard);

  return (
    <Container size="wide">
      <Stack className="max-w-3xl gap-4 py-[var(--spacing-2xl)]">
        <h1 className="numeral-heading-3xl">{categoryLabel}</h1>
        <p className="numeral-paragraph-lg text-[var(--color-muted)]">
          {cards.length} microsites about {categoryLabel.toLowerCase()}.
        </p>
      </Stack>
      <div className="pb-[var(--spacing-3xl)]">
        <MicrositeGallery cards={cards} title={null} />
      </div>
    </Container>
  );
}
