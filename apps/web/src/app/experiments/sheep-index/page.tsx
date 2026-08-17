import { Container, Section, Stack } from '@nzlab/ui';

import { env } from '@/env';

import { fetchSheepSeries } from './sheep-data';
import { SheepChart } from './SheepChart';

function formatMillions(value: number): string {
  return `${(value / 1000000).toFixed(1)} million sheep`;
}

export default async function SheepIndexPage(): Promise<React.ReactElement> {
  const series = await fetchSheepSeries(env.STATS_NZ_SUBSCRIPTION_KEY);

  return (
    <main>
      <Section>
        <Container>
          <Stack className="max-w-3xl gap-6">
            <p className="numeral-text-eyebrow text-[var(--color-muted)]">
              experiments / sheep-index
            </p>
            <h1 className="numeral-heading-3xl">
              The Sheep Index: New Zealand&apos;s national animal is in freefall.
            </h1>
            <p className="numeral-paragraph-lg text-[var(--color-muted)]">
              The national sheep flock has nearly halved since 1994, dropping from 49.5 million to
              23.3 million by 2025. This page shows the real series, pulled from the Stats NZ
              Aotearoa Data Explorer at deploy time.
            </p>
          </Stack>

          <dl className="mt-12 grid gap-6 sm:grid-cols-2">
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

          <div className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
            <SheepChart points={series.points} />
          </div>

          <p className="numeral-paragraph-sm mt-8 max-w-3xl text-[var(--color-muted)]">
            Data: Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional
            Council), national sheep total, fetched at deploy time via @nzlab/stats-nz, falling back
            to a committed snapshot when the API blocks the build runner; the site redeploys daily.
            Table link:{' '}
            <a className="underline" href="https://www.stats.govt.nz/tools/aotearoa-data-explorer/">
              aotearoa data explorer
            </a>
            .
          </p>
        </Container>
      </Section>
    </main>
  );
}
