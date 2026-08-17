import Link from 'next/link';

/** Sticky, blurred site header — wordmark + primary nav link. */
export function SiteHeader(): React.ReactElement {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/70">
      <div className="mx-auto flex h-14 w-full max-w-[var(--layout-wide)] items-center justify-between px-[var(--layout-outside-space)]">
        <Link href="/" className="numeral-text-mono text-sm font-medium tracking-tight">
          nz-data-lab
        </Link>
        <nav>
          <Link
            href="#sheep-index"
            className="numeral-paragraph-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            the sheep index
          </Link>
        </nav>
      </div>
    </header>
  );
}
