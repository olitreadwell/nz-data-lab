import { Container, Stack } from '@nzlab/ui';

import { MicrositeCard } from '@/components/MicrositeCard';
import { env } from '@/env';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import { fetchLivestockSeries, summarizeLivestock } from '@/lib/livestock-data';
import { MICROSITES } from '@/lib/microsites';
import type { MicrositeConfig } from '@/lib/microsites';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

function getMicrosite(slug: string): MicrositeConfig {
  const microsite = MICROSITES.find((candidate) => candidate.slug === slug);
  if (microsite === undefined) {
    throw new Error(`Unknown microsite: ${slug}`);
  }
  return microsite;
}

export default async function HomePage(): Promise<React.ReactElement> {
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

  const sheepConfig = getMicrosite('sheep-index');
  const dairyConfig = getMicrosite('dairy-takeover');
  const vineyardConfig = getMicrosite('vineyard-boom');
  const plantingConfig = getMicrosite('planting-bust');

  return (
    <main>
      <Container size="wide">
        <Stack className="max-w-3xl gap-4 py-[var(--spacing-2xl)]">
          <h1 className="numeral-heading-3xl">
            Small experiments digging through New Zealand public data for the weird, the funny, and
            the surprising.
          </h1>
          <p className="numeral-paragraph-lg text-[var(--color-muted)]">
            Four live microsites. All numbers come from Stats NZ at deploy time.
          </p>
        </Stack>
        <div className="grid gap-6 pb-[var(--spacing-3xl)] sm:grid-cols-2 lg:grid-cols-4">
          <MicrositeCard
            slug={sheepConfig.slug}
            eyebrow={sheepConfig.eyebrow}
            title={sheepConfig.title}
            description={sheepConfig.description}
            statLabel={`Sheep right now (${sheep.latest.year})`}
            statValue={formatMillionsSheep(sheep.latest.sheep)}
            accent={sheepConfig.accent}
          />
          <MicrositeCard
            slug={dairyConfig.slug}
            eyebrow={dairyConfig.eyebrow}
            title={dairyConfig.title}
            description={dairyConfig.description}
            statLabel={`Dairy cattle now (${livestock.latest.year})`}
            statValue={formatMillions(dairy?.latest ?? 0)}
            accent={dairyConfig.accent}
          />
          <MicrositeCard
            slug={vineyardConfig.slug}
            eyebrow={vineyardConfig.eyebrow}
            title={vineyardConfig.title}
            description={vineyardConfig.description}
            statLabel={`Wine grapes now (${horticulture.latest.year})`}
            statValue={formatHectares(wineGrapes?.latest ?? 0)}
            accent={vineyardConfig.accent}
          />
          <MicrositeCard
            slug={plantingConfig.slug}
            eyebrow={plantingConfig.eyebrow}
            title={plantingConfig.title}
            description={plantingConfig.description}
            statLabel={`New planting in ${forestry.latest.year}`}
            statValue={formatHectares(newPlanting?.latest ?? 0)}
            accent={plantingConfig.accent}
          />
        </div>
      </Container>
    </main>
  );
}
