import { Container, Stack } from '@nzlab/ui';
import Link from 'next/link';

import { ClickToReveal } from '@/components/ClickToReveal';
import { FlickeringGrid } from '@/components/FlickeringGrid';
import { ForestryChart } from '@/components/ForestryChart';
import { HorticultureChart } from '@/components/HorticultureChart';
import { LivestockChart } from '@/components/LivestockChart';
import { MicrositeSection } from '@/components/MicrositeSection';
import { SheepChart } from '@/components/SheepChart';
import { StatCard } from '@/components/StatCard';
import { env } from '@/env';
import { fetchForestrySeries, summarizeForestry } from '@/lib/forestry-data';
import { formatHectares, formatMillions } from '@/lib/format';
import { fetchHorticultureSeries, summarizeHorticulture } from '@/lib/horticulture-data';
import {
  fetchLivestockSeries,
  LIVESTOCK_HISTORICAL_ANCHOR,
  summarizeLivestock,
} from '@/lib/livestock-data';
import { fetchSheepSeries, SHEEP_HISTORICAL_ANCHOR } from '@/lib/sheep-data';
import { formatMillions as formatMillionsSheep } from '@/lib/sheep-format';

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

  return (
    <main>
      <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-gradient-to-br from-amber-100 via-rose-50 to-violet-100 py-[var(--spacing-3xl)]">
        <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_top,transparent_10%,black_95%)]">
          <FlickeringGrid className="size-full" />
        </div>
        <Container size="wide" className="relative z-10">
          <Stack className="max-w-3xl gap-6">
            <p className="numeral-text-eyebrow text-[var(--color-muted)]">nz-data-lab</p>
            <h1 className="numeral-heading-3xl">
              Small experiments digging through New Zealand public data for the weird, the funny,
              and the surprising.
            </h1>
            <p className="numeral-paragraph-lg text-[var(--color-muted)]">
              Four live microsites: sheep in freefall, the dairy takeover, the vineyard boom, and
              the planting bust. All numbers come from Stats NZ at deploy time.
            </p>
            <div className="flex gap-3">
              <Link
                href="#sheep-index"
                className="numeral-button numeral-button-primary numeral-button-lg"
              >
                See the microsites
              </Link>
            </div>
          </Stack>
        </Container>
      </div>

      <MicrositeSection
        id="sheep-index"
        eyebrow="🐑 the sheep index"
        title="New Zealand's national animal is in freefall."
        description="The national sheep flock has nearly halved since 1994, dropping from 49.5 million to 23.3 million by 2025 — and it's fallen even further from where it really stood before this table begins. New Zealand's true high-water mark was 70.3 million sheep in 1982, propped up by a government price-floor scheme; when the Lange government abolished those subsidies overnight in 1984, lamb and wool returns fell by roughly half in a single season, and the flock has been shrinking ever since. The dashed lead-in on the chart is a single 1990 data point (57.9 million) cited from a separate Stats NZ release, spliced in ahead of the regular 1994–2025 series pulled from the Aotearoa Data Explorer at deploy time."
        accent="amber"
      >
        <ClickToReveal buttonLabel="Reveal the sheep index" hideLabel="Hide the sheep index">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
            <SheepChart points={sheep.points} historicalAnchorYear={SHEEP_HISTORICAL_ANCHOR.year} />
          </div>

          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Sheep right now (${sheep.latest.year})`}
              value={formatMillionsSheep(sheep.latest.sheep)}
              accent="amber"
              testId="sheep-latest"
              dataValue={sheep.latest.sheep}
            />
            <StatCard
              label={`Peak flock (${sheep.peak.year})`}
              value={formatMillionsSheep(sheep.peak.sheep)}
              accent="amber"
            />
            <StatCard
              label="Change since peak"
              value={`${Math.round(sheep.changeFromPeakPercent)}%`}
              accent="amber"
              testId="sheep-change"
              dataValue={Math.round(sheep.changeFromPeakPercent)}
            />
          </dl>

          <p className="numeral-paragraph-sm max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional
            Council), national sheep total, fetched at deploy time via @nzlab/stats-nz, falling back
            to a committed snapshot when the API blocks the build runner; the site redeploys daily.
            The dashed 1990 point is a separate citation from Stats NZ&apos;s{' '}
            <a
              className="underline"
              href="https://www.stats.govt.nz/indicators/livestock-numbers-data-to-2023/"
            >
              Livestock numbers: Data to 2023
            </a>{' '}
            indicator, not part of AGR_AGR_003 — it&apos;s a lower-resolution lead-in, not annual
            data. Hover or drag across the chart to read the flock at any year. Table link:{' '}
            <a className="underline" href="https://www.stats.govt.nz/tools/aotearoa-data-explorer/">
              aotearoa data explorer
            </a>
            .
          </p>
        </ClickToReveal>
      </MicrositeSection>

      <MicrositeSection
        id="dairy-takeover"
        eyebrow="🐄 the dairy takeover"
        title="The paddocks flipped from wool to milk."
        description="While the sheep flock nearly halved, dairy cattle nearly doubled. The same paddocks that once grew wool now grow milk — and the beef herd and deer herd shrank too. Four livestock lines, one quiet revolution, now traceable back to a spliced-in 1990 baseline (dashed on the chart) from a separate Stats NZ release. The shift got a big structural push in 2001, when the Dairy Industry Restructuring Act merged the country's regional dairy co-operatives into Fonterra, a single national exporter processing around 96% of NZ milk."
        accent="sky"
      >
        <ClickToReveal buttonLabel="Reveal the dairy takeover" hideLabel="Hide the dairy takeover">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
            <LivestockChart
              points={livestock.points}
              historicalAnchorYear={LIVESTOCK_HISTORICAL_ANCHOR.year}
            />
          </div>

          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Dairy cattle now (${livestock.latest.year})`}
              value={formatMillions(dairy?.latest ?? 0)}
              accent="sky"
              testId="dairy-latest"
              dataValue={dairy?.latest}
            />
            <StatCard
              label={`Dairy cattle in ${livestock.first.year}`}
              value={formatMillions(dairy?.first ?? 0)}
              accent="sky"
            />
            <StatCard
              label={`Change since ${livestock.first.year}`}
              value={`${Math.round(dairy?.changeFromFirstPercent ?? 0)}%`}
              accent="sky"
              testId="dairy-change"
              dataValue={Math.round(dairy?.changeFromFirstPercent ?? 0)}
            />
          </dl>

          <p className="numeral-paragraph-sm max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional
            Council), national totals for sheep, dairy cattle, beef cattle, and deer. The dashed
            1990 point for all four species is a separate citation from Stats NZ&apos;s Livestock
            numbers: Data to 2023 indicator, not part of AGR_AGR_003. Hover or drag across the chart
            to read any year.
          </p>
        </ClickToReveal>
      </MicrositeSection>

      <MicrositeSection
        id="vineyard-boom"
        eyebrow="🍇 the vineyard boom"
        title="Wine grapes took over the orchard."
        description="In 1994 wine grapes covered 7,160 hectares. By 2024 that was 37,627 — a five-fold boom that left apples, kiwifruit, and avocados in the dust. New Zealand didn't just start making wine; it started growing it everywhere. The run-up to this chart has a strange footnote: in 1986, facing a glut of low-quality wine, the government paid growers $6,000 a hectare to uproot vines, and it took until 1993 — the year before this chart's data begins — for the national vineyard area to regrow back to its pre-uproot size. There's no requirement on what growers did with the cleared land, so some replanted with Sauvignon Blanc the next day, which is part of how Marlborough became the region it is today."
        accent="purple"
      >
        <ClickToReveal buttonLabel="Reveal the vineyard boom" hideLabel="Hide the vineyard boom">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
            <HorticultureChart points={horticulture.points} />
          </div>

          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`Wine grapes now (${horticulture.latest.year})`}
              value={formatHectares(wineGrapes?.latest ?? 0)}
              accent="purple"
              testId="wine-latest"
              dataValue={wineGrapes?.latest}
            />
            <StatCard
              label={`Wine grapes in ${horticulture.first.year}`}
              value={formatHectares(wineGrapes?.first ?? 0)}
              accent="purple"
            />
            <StatCard
              label="Change since 1994"
              value={`+${Math.round(wineGrapes?.changeFromFirstPercent ?? 0)}%`}
              accent="purple"
              testId="wine-change"
              dataValue={Math.round(wineGrapes?.changeFromFirstPercent ?? 0)}
            />
          </dl>

          <p className="numeral-paragraph-sm max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_002 (Horticulture by Regional
            Council), national area in hectares for wine grapes, kiwifruit, apples, and avocados.
            The 1986 vine-pull and 1993 recovery notes above are narrative context only — from Te
            Ara&apos;s history of NZ wine, not from this table — so they aren&apos;t plotted on the
            chart. Hover or drag across the chart to read any year.
          </p>
        </ClickToReveal>
      </MicrositeSection>

      <MicrositeSection
        id="planting-bust"
        eyebrow="🌲 the planting bust"
        title="We stopped planting trees, but kept chopping them down."
        description="New planting collapsed from 33,674 hectares in 2002 to 8,293 by 2018 — down 75% — while the harvested area kept climbing to 62,103 hectares. The forest is being eaten faster than it is being grown. It's not the country's first planting boom-and-bust either — an earlier one ran from 1925 to 1935 — but this cycle has a clear trigger: the NZ Emissions Trading Scheme launched in 2008 and tied new planting's economics to a carbon price that then sat near a policy-imposed ceiling for most of the following decade. By 2014 some seedlings planted when prices were briefly higher were being mulched because planting had turned uneconomic before they were ready. The One Billion Trees Programme launched in 2018, right at this chart's last data point, as an explicit attempt to reverse the trend — whether it worked is a question for the next data refresh."
        accent="emerald"
      >
        <ClickToReveal buttonLabel="Reveal the planting bust" hideLabel="Hide the planting bust">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
            <ForestryChart points={forestry.points} />
          </div>

          <dl className="grid gap-6 py-[var(--spacing-2xl)] sm:grid-cols-3">
            <StatCard
              label={`New planting in ${forestry.first.year}`}
              value={formatHectares(newPlanting?.first ?? 0)}
              accent="emerald"
              testId="planting-first"
              dataValue={newPlanting?.first}
            />
            <StatCard
              label={`New planting in ${forestry.latest.year}`}
              value={formatHectares(newPlanting?.latest ?? 0)}
              accent="emerald"
              testId="planting-latest"
              dataValue={newPlanting?.latest}
            />
            <StatCard
              label="Change since 2002"
              value={`${Math.round(newPlanting?.changeFromFirstPercent ?? 0)}%`}
              accent="emerald"
              testId="planting-change"
              dataValue={Math.round(newPlanting?.changeFromFirstPercent ?? 0)}
            />
          </dl>

          <p className="numeral-paragraph-sm max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_001 (Forestry by Regional Council),
            national new planting and exotic timber harvested area in hectares. The ETS and One
            Billion Trees notes above are narrative context only — from MPI&apos;s National Exotic
            Forest Description and Motu&apos;s ETS research, not from this table — so they
            aren&apos;t plotted on the chart. Hover or drag across the chart to read any year.
          </p>
        </ClickToReveal>
      </MicrositeSection>
    </main>
  );
}
