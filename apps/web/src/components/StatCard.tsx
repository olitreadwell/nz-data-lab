import { getMicrositeAccentStyles } from './microsite-styles';
import type { MicrositeAccent } from './microsite-styles';

interface StatCardProps {
  label: string;
  value: string;
  accent: MicrositeAccent;
  testId?: string;
  dataValue?: number | undefined;
}

/** A colorful headline stat card for a microsite. */
export function StatCard({
  label,
  value,
  accent,
  testId,
  dataValue,
}: StatCardProps): React.ReactElement {
  const styles = getMicrositeAccentStyles(accent);
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6 ${styles.cardBg}`}
    >
      <dt className="numeral-text-eyebrow text-[var(--color-muted)]">{label}</dt>
      <dd
        className={`numeral-heading-2xl mt-2 ${styles.cardValue}`}
        data-testid={testId}
        data-value={dataValue}
      >
        {value}
      </dd>
    </div>
  );
}
