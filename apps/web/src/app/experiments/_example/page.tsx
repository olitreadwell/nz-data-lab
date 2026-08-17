// REFERENCE TEMPLATE — not a route (underscore-prefixed folders are private
// in Next.js App Router). Copy this whole folder, drop the underscore, pick
// a real slug, and fill in real content. See README.md in this folder for
// the full checklist.
import { Container, Section, Stack } from '@nzlab/ui';

interface ExampleStat {
  label: string;
  value: string;
}

// Replace with a real fetch/import from your actual data source. Never fake
// a stat here — if the data isn't in yet, show a loading or empty state
// instead of a placeholder number that looks real.
const stats: ExampleStat[] = [
  { label: 'placeholder metric', value: '—' },
  { label: 'placeholder metric', value: '—' },
];

export default function ExampleExperimentPage(): React.ReactElement {
  return (
    <main>
      <Section>
        <Container>
          <Stack className="max-w-3xl gap-6">
            <p className="numeral-text-eyebrow text-[var(--color-muted)]">experiments / _example</p>
            <h1 className="numeral-heading-3xl">One-sentence pitch goes here.</h1>
            <p className="numeral-paragraph-lg text-[var(--color-muted)]">
              A short paragraph on what question this experiment asks, and why it might turn up
              something weird, funny, or surprising. Cite the real data source by name — never a
              source you haven&apos;t actually pulled from.
            </p>
          </Stack>

          <dl className="mt-12 grid gap-6 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6"
              >
                <dt className="numeral-text-eyebrow text-[var(--color-muted)]">{stat.label}</dt>
                <dd className="numeral-heading-2xl mt-2">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </main>
  );
}
