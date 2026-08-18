// REFERENCE TEMPLATE — copy alongside page.tsx. Next.js scopes error.tsx to
// its own route segment, so a broken experiment fails here without taking
// down the rest of the site.
'use client';

import { Button, Container, Stack } from '@nzlab/ui';
import Link from 'next/link';

interface ExperimentErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ExperimentError({
  error,
  reset,
}: ExperimentErrorProps): React.ReactElement {
  // Log the real error for debugging, but never render its message to the
  // user: it can leak internal/API details such as request URLs.
  console.error(error);
  return (
    <Container size="narrow" className="py-[var(--spacing-3xl)] text-center">
      <Stack className="items-center gap-6">
        <p className="numeral-text-eyebrow text-[var(--color-danger)]">This experiment broke</p>
        <h1 className="numeral-heading-2xl">Something went wrong</h1>
        <p className="numeral-paragraph-md text-[var(--color-muted)]">
          This experiment hit an error. The rest of the site is unaffected.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/experiments"
            className="numeral-button numeral-button-secondary numeral-button-lg"
          >
            Back to experiments
          </Link>
        </div>
      </Stack>
    </Container>
  );
}
