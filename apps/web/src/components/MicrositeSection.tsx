import { Container, Stack } from '@nzlab/ui';

import { getMicrositeAccentStyles } from './microsite-styles';
import type { MicrositeAccent } from './microsite-styles';
import { MicrositeEyebrow } from './MicrositeEyebrow';

interface MicrositeSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: MicrositeAccent;
  children: React.ReactNode;
}

/** One microsite on the hub page: tinted section, eyebrow, headline, and content. */
export function MicrositeSection({
  id,
  eyebrow,
  title,
  description,
  accent,
  children,
}: MicrositeSectionProps): React.ReactElement {
  const styles = getMicrositeAccentStyles(accent);
  return (
    <section id={id} className="scroll-mt-16 border-b border-[var(--color-border)]">
      <Container size="wide">
        <Stack className="max-w-3xl gap-6 py-[var(--spacing-2xl)]">
          <MicrositeEyebrow
            className={`numeral-text-eyebrow ${styles.eyebrow}`}
            eyebrow={eyebrow}
          />
          <h2 className="numeral-heading-2xl">{title}</h2>
          <p className="numeral-paragraph-lg text-[var(--color-muted)]">{description}</p>
        </Stack>
        {children}
      </Container>
    </section>
  );
}
