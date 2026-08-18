import { Container } from '@nzlab/ui';

export default function Loading(): React.ReactElement {
  return (
    <Container size="default" className="py-[var(--spacing-3xl)]">
      <div role="status" aria-busy="true" className="space-y-4">
        <p className="sr-only">Loading…</p>
        <div className="h-4 w-24 motion-safe:animate-pulse rounded bg-[var(--color-neutral-200)]" />
        <div className="h-10 w-full max-w-lg motion-safe:animate-pulse rounded bg-[var(--color-neutral-200)]" />
        <div className="h-5 w-full max-w-xl motion-safe:animate-pulse rounded bg-[var(--color-neutral-200)]" />
      </div>
    </Container>
  );
}
