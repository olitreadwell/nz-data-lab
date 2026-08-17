import { Container, Stack } from '@nzlab/ui';
import Link from 'next/link';

import { FlickeringGrid } from '@/components/FlickeringGrid';
import { experiments } from '@/lib/experiments';

export default function HomePage(): React.ReactElement {
  const aliveCount = experiments.filter((e) => e.status === 'alive').length;

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
              {aliveCount === 0
                ? 'No experiments shipped yet.'
                : `${aliveCount} experiment${aliveCount === 1 ? '' : 's'} live.`}{' '}
              Every attempt, alive or dead, stays listed.
            </p>
            <div className="flex gap-3">
              <Link
                href="/experiments"
                className="numeral-button numeral-button-primary numeral-button-lg"
              >
                See experiments
              </Link>
            </div>
          </Stack>
        </Container>
      </div>
    </main>
  );
}
