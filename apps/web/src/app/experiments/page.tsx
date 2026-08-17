import { Container, Stack } from '@nzlab/ui';

import { ExperimentCard } from '@/components/ExperimentCard';
import { experiments } from '@/lib/experiments';

const GRID_COLUMNS_LG = 3;

export default function ExperimentsPage(): React.ReactElement {
  return (
    <main>
      <div className="border-b border-[var(--color-border)] py-[var(--spacing-2xl)]">
        <Container size="wide">
          <Stack className="max-w-3xl gap-4">
            <p className="numeral-text-eyebrow text-[var(--color-muted)]">experiments</p>
            <h1 className="numeral-heading-3xl">Every experiment, alive or dead.</h1>
            <p className="numeral-paragraph-lg text-[var(--color-muted)]">
              Nothing shipped yet. This page lists every experiment we run against New Zealand
              public data — the ones that turned up something worth sharing, and the ones that
              didn&apos;t. Check back once the first one lands.
            </p>
          </Stack>
        </Container>
      </div>

      <Container size="wide">
        {experiments.length > 0 ? (
          <div className="grid grid-cols-1 border-x border-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment, index) => (
              <ExperimentCard
                key={experiment.slug}
                experiment={experiment}
                showRightBorder={(index + 1) % GRID_COLUMNS_LG !== 0}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 border-x border-b border-[var(--color-border)] md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: GRID_COLUMNS_LG }, (_, index) => (
              <div
                key={`empty-slot-${index}`}
                className="flex min-h-40 items-center justify-center border-[var(--color-border)] p-6 md:border-r last:md:border-r-0"
              >
                <p className="numeral-paragraph-sm text-center text-[var(--color-muted)]">
                  {index === 0 ? 'The first experiment to ship goes here.' : 'Nothing here yet.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
