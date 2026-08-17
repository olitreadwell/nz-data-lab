/** Minimal site footer — mission line, no link farm. */
export function SiteFooter(): React.ReactElement {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto w-full max-w-[var(--layout-wide)] px-[var(--layout-outside-space)] py-6">
        <p className="numeral-paragraph-sm text-[var(--color-muted)]">
          nz-data-lab — small experiments in New Zealand public data. Every attempt stays listed,
          alive or dead.
        </p>
      </div>
    </footer>
  );
}
