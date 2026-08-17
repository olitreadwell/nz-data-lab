import { Container } from '@nzlab/ui';

export default function Loading(): React.ReactElement {
  return (
    <Container size="default" className="py-[var(--spacing-3xl)]">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-neutral-200)]" />
        <div className="h-10 w-full max-w-lg animate-pulse rounded bg-[var(--color-neutral-200)]" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded bg-[var(--color-neutral-200)]" />
      </div>
    </Container>
  );
}
