import { cn } from '@nzlab/ui';
import Link from 'next/link';

import type { Experiment } from '@/lib/experiments';

interface ExperimentCardProps {
  experiment: Experiment;
  /** Draw a right border — omit on the last column so the grid's outer edge stays single-width. */
  showRightBorder?: boolean;
}

/** One cell in the notion-style bordered experiment grid on `/experiments`. */
export function ExperimentCard({
  experiment,
  showRightBorder = true,
}: ExperimentCardProps): React.ReactElement {
  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      className={cn(
        "group relative block before:absolute before:top-0 before:-left-px before:h-full before:w-px before:bg-[var(--color-border)] before:content-[''] after:absolute after:-top-px after:left-0 after:h-px after:w-full after:bg-[var(--color-border)] after:content-['']",
        showRightBorder && 'border-b-0 md:border-r md:border-[var(--color-border)]',
      )}
    >
      <div className="flex flex-col gap-2 p-6">
        <span className="numeral-text-eyebrow text-[var(--color-muted)]">
          {experiment.status === 'alive' ? 'alive' : 'dead'} · {experiment.dataSource}
        </span>
        <h2 className="numeral-heading-md group-hover:underline group-hover:underline-offset-4">
          {experiment.title}
        </h2>
        <p className="numeral-paragraph-sm text-[var(--color-muted)]">{experiment.pitch}</p>
      </div>
    </Link>
  );
}
