'use client';

import { useEffect, useRef, useState } from 'react';

import { MICROSITES } from '@/lib/microsites';

const ISSUE_TYPES = [
  'Bug',
  'Accessibility',
  'Data or content',
  'Design',
  'Performance',
  'Other',
] as const;
const GITHUB_NEW_ISSUE_URL = 'https://github.com/olitreadwell/nz-data-lab/issues/new';
const MAX_TITLE_LENGTH = 200;
const MIN_DESCRIPTION_LENGTH = 10;
const COPY_FEEDBACK_MS = 2000;

type IssueType = (typeof ISSUE_TYPES)[number];

interface ReportIssueButtonProps {
  /** Page label shown in the prefilled issue, e.g. the microsite title. */
  pageLabel?: string;
}

/**
 * Builds the prefilled GitHub new-issue URL for a report.
 *
 * @param input - the report fields and page context to encode
 * @param input.type - the issue category, e.g. Bug or Accessibility
 * @param input.item - the site area the report is about
 * @param input.description - the reporter's free-text description
 * @param input.pageLabel - the page title the report came from
 * @param input.pageUrl - the page URL the report came from
 * @returns the GitHub new-issue URL with title and body prefilled
 */
function buildIssueUrl(input: {
  type: IssueType;
  item: string;
  description: string;
  pageLabel: string;
  pageUrl: string;
}): string {
  const title = `[${input.type}] ${input.description.split('\n')[0] ?? 'Issue report'}`.slice(
    0,
    MAX_TITLE_LENGTH,
  );
  const body = [
    '## Reported from',
    `- Page: ${input.pageLabel} (${input.pageUrl})`,
    `- Type: ${input.type}`,
    `- Item: ${input.item}`,
    `- Reported: ${new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' })} (NZST)`,
    '',
    '## Description',
    input.description,
    '',
    '<!-- filed from the report-an-issue button; the quality-issue-loop triage will spec this -->',
  ].join('\n');
  const params = new URLSearchParams({ title, body });
  return `${GITHUB_NEW_ISSUE_URL}?${params.toString()}`;
}

/**
 * Floating "report an issue" bubble on every page. Opens a small dialog that
 * prefills a GitHub issue with the current page, the reporter's context, and
 * a structured body the quality-issue-loop triage can turn into a spec.
 * Static export cannot hold a token, so the form opens GitHub's new-issue
 * form with everything prefilled instead of posting directly.
 *
 * @param props - component props
 * @param props.pageLabel - optional page label for the prefilled issue
 * @returns the report bubble and its dialog
 */
export function ReportIssueButton({ pageLabel }: ReportIssueButtonProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<IssueType>('Bug');
  const [item, setItem] = useState('Home page');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const pageUrl = typeof window === 'undefined' ? '' : window.location.href;
  const label = pageLabel ?? (typeof document === 'undefined' ? '' : document.title);

  useEffect(() => {
    if (!open) {
      return;
    }
    descriptionRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  const submit = (): void => {
    const url = buildIssueUrl({ type, item, description, pageLabel: label, pageUrl });
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const copy = async (): Promise<void> => {
    const url = buildIssueUrl({ type, item, description, pageLabel: label, pageUrl });
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Report an issue"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
      {open ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-issue-title"
          aria-describedby="report-issue-description"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        >
          <button
            type="button"
            aria-label="Close report dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="report-issue-title" className="numeral-heading-lg">
                  Report an issue
                </h2>
                <p
                  id="report-issue-description"
                  className="numeral-paragraph-sm text-[var(--color-muted)]"
                >
                  Opens a prefilled GitHub issue for this page.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-[var(--color-muted)] hover:text-[var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="size-4"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              className="grid gap-4"
            >
              <label className="grid gap-1">
                <span className="numeral-paragraph-sm text-[var(--color-muted)]">Type</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value as IssueType)}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5"
                >
                  {ISSUE_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="numeral-paragraph-sm text-[var(--color-muted)]">Item</span>
                <select
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5"
                >
                  <option>Home page</option>
                  {MICROSITES.map((microsite) => (
                    <option key={microsite.slug}>{microsite.label}</option>
                  ))}
                  <option>Other</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="numeral-paragraph-sm text-[var(--color-muted)]">
                  What happened?
                </span>
                <textarea
                  ref={descriptionRef}
                  required
                  minLength={MIN_DESCRIPTION_LENGTH}
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the problem, what you expected, and what you saw."
                  className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5"
                />
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={description.trim().length < MIN_DESCRIPTION_LENGTH}
                  className="numeral-button numeral-button-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Open GitHub issue
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void copy();
                  }}
                  className="numeral-button numeral-button-secondary"
                >
                  {copied ? 'Copied' : 'Copy link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
