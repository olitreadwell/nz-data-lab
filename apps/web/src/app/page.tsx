import { Container, Stack } from '@nzlab/ui';
import Link from 'next/link';

import { FlickeringGrid } from '@/components/FlickeringGrid';
import { SheepChart } from '@/components/SheepChart';
import { env } from '@/env';
import { fetchSheepSeries } from '@/lib/sheep-data';
import { formatMillions } from '@/lib/sheep-format';

export default async function HomePage(): Promise<React.ReactElement> {
  const series = await fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY);

  return (
    <main>
      <div className="relative overflow-hidden border-b border-[var(--color-border)] py-[var(--spacing-3xl)]">
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
              One live experiment: the Sheep Index — New Zealand&apos;s national animal in freefall.
            </p>
            <div className="flex gap-3">
              <Link
                href="#sheep-index"
                className="numeral-button numeral-button-primary numeral-button-lg"
              >
                See the sheep index
              </Link>
            </div>
          </Stack>
        </Container>
      </div>

      <section id="sheep-index" className="scroll-mt-16 border-b border-[var(--color-border)]">
        <Container size="wide">
          <Stack className="max-w-3xl gap-6 py-[var(--spacing-2xl)]">
            <p className="numeral-text-eyebrow text-[var(--color-muted)]">the sheep index</p>
            <h2 className="numeral-heading-2xl">
              New Zealand&apos;s national animal is in freefall.
            </h2>
            <p className="numeral-paragraph-lg text-[var(--color-muted)]">
              The national sheep flock has nearly halved since 1994, dropping from 49.5 million to
              23.3 million by 2025. This page shows the real series, pulled from the Stats NZ
              Aotearoa Data Explorer at deploy time.
            </p>
          </Stack>

          <dl className="grid gap-6 pb-[var(--spacing-2xl)] sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
              <dt className="numeral-text-eyebrow text-[var(--color-muted)]">
                Sheep right now ({series.latest.year})
              </dt>
              <dd className="numeral-heading-2xl mt-2" data-sheep-latest={series.latest.sheep}>
                {formatMillions(series.latest.sheep)}
              </dd>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
              <dt className="numeral-text-eyebrow text-[var(--color-muted)]">
                Peak flock ({series.peak.year})
              </dt>
              <dd className="numeral-heading-2xl mt-2">{formatMillions(series.peak.sheep)}</dd>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
              <dt className="numeral-text-eyebrow text-[var(--color-muted)]">Change since peak</dt>
              <dd
                className="numeral-heading-2xl mt-2"
                data-sheep-change={Math.round(series.changeFromPeakPercent)}
              >
                {Math.round(series.changeFromPeakPercent)}%
              </dd>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
              <dt className="numeral-text-eyebrow text-[var(--color-muted)]">
                Back in {series.first.year}
              </dt>
              <dd className="numeral-heading-2xl mt-2">{formatMillions(series.first.sheep)}</dd>
            </div>
          </dl>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
            <SheepChart points={series.points} />
          </div>

          <p className="numeral-paragraph-sm mt-8 max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional
            Council), national sheep total, fetched at deploy time via @nzlab/stats-nz, falling back
            to a committed snapshot when the API blocks the build runner; the site redeploys daily.
            Hover or drag across the chart to read the flock at any year. Table link:{' '}
            <a className="underline" href="https://www.stats.govt.nz/tools/aotearoa-data-explorer/">
              aotearoa data explorer
            </a>
            .
          </p>
        </Container>
      </section>
    </main>
  );
}
