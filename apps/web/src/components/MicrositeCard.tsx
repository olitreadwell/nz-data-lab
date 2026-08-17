import Link from 'next/link';

import { getMicrositeAccentStyles } from './microsite-styles';
import type { MicrositeAccent } from './microsite-styles';

interface MicrositeCardProps {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  statLabel: string;
  statValue: string;
  accent: MicrositeAccent;
}

/** One microsite teaser card on the hub page, linking to its full story. */
export function MicrositeCard({
  slug,
  eyebrow,
  title,
  description,
  statLabel,
  statValue,
  accent,
}: MicrositeCardProps): React.ReactElement {
  const styles = getMicrositeAccentStyles(accent);
  return (
    <Link
      href={`/microsites/${slug}`}
      className={`flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 ${styles.cardBg} transition-colors hover:border-[var(--color-fg)]`}
    >
      <p className={`numeral-text-eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
      <h2 className="numeral-heading-xl">{title}</h2>
      <p className="numeral-paragraph-md text-[var(--color-muted)]">{description}</p>
      <dl className="mt-auto">
        <dt className="numeral-text-eyebrow text-[var(--color-muted)]">{statLabel}</dt>
        <dd className={`numeral-heading-2xl ${styles.cardValue}`}>{statValue}</dd>
      </dl>
      <span className="numeral-paragraph-sm underline">Read the story</span>
    </Link>
  );
}
