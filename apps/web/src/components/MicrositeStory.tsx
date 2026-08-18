import { Container, Stack } from '@nzlab/ui';

import { getMicrositeAccentStyles } from './microsite-styles';
import type { MicrositeAccent } from './microsite-styles';
import { MicrositeEyebrow } from './MicrositeEyebrow';
import { MicrositeReferences } from './MicrositeReferences';
import type { MicrositeReference } from './MicrositeReferences';

interface MicrositeStoryProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  paragraphs: string[];
  accent: MicrositeAccent;
  chart: React.ReactNode;
  stats: React.ReactNode;
  dataNote: string;
  references: MicrositeReference[];
}

/** One microsite story: narrative, chart, headline stats, and sources. */
export function MicrositeStory({
  id,
  eyebrow,
  title,
  description,
  paragraphs,
  accent,
  chart,
  stats,
  dataNote,
  references,
}: MicrositeStoryProps): React.ReactElement {
  const styles = getMicrositeAccentStyles(accent);
  return (
    <section
      id={id}
      className={`scroll-mt-16 border-b border-[var(--color-border)] ${styles.sectionBg}`}
    >
      <Container size="wide">
        <Stack className="max-w-3xl gap-6 py-[var(--spacing-2xl)]">
          <MicrositeEyebrow
            className={`numeral-text-eyebrow ${styles.eyebrow}`}
            eyebrow={eyebrow}
          />
          <h1 className="numeral-heading-2xl">{title}</h1>
          <p className="numeral-paragraph-lg text-[var(--color-muted)]">{description}</p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="numeral-paragraph-md text-[var(--color-muted)]">
              {paragraph}
            </p>
          ))}
        </Stack>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:p-6">
          {chart}
        </div>
        {stats}
        <p className="numeral-paragraph-sm max-w-3xl pb-[var(--spacing-2xl)] text-[var(--color-muted)]">
          {dataNote}
        </p>
        <MicrositeReferences references={references} />
      </Container>
    </section>
  );
}
