import Link from 'next/link';

import { getMicrositeAccentStyles } from './microsite-styles';
import type { MicrositeAccent } from './microsite-styles';
import { MicrositeEyebrow } from './MicrositeEyebrow';

interface MicrositeCardProps {
  slug: string;
  categorySlug: string;
  eyebrow: string;
  title: string;
  description: string;
  statLabel?: string;
  statValue?: string;
  accent: MicrositeAccent;
}

/** One microsite teaser card on the hub page, linking to its full story. */
export function MicrositeCard({
  slug,
  categorySlug,
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
      href={`/${categorySlug}/${slug}`}
      className={`flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 ${styles.cardBg} transition-colors hover:border-[var(--color-fg)]`}
    >
      <MicrositeEyebrow className={`numeral-text-eyebrow ${styles.eyebrow}`} eyebrow={eyebrow} />
      <h2 className="numeral-heading-xl">{title}</h2>
      <p className="numeral-paragraph-md text-[var(--color-muted)]">{description}</p>
      {statLabel !== undefined && statValue !== undefined ? (
        <dl className="mt-auto">
          <dt className="numeral-text-eyebrow text-[var(--color-muted)]">{statLabel}</dt>
          <dd className={`numeral-heading-2xl ${styles.cardValue}`}>{statValue}</dd>
        </dl>
      ) : null}
    </Link>
  );
}
