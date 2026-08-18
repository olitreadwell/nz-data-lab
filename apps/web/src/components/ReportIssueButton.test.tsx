import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReportIssueButton } from './ReportIssueButton';

expect.extend(toHaveNoViolations);

const OPEN_URL = 'https://github.com/olitreadwell/nz-data-lab/issues/new';

afterEach(() => {
  vi.restoreAllMocks();
  window.history.pushState({}, '', '/');
});

describe('ReportIssueButton', () => {
  it('opens a dialog with the report form', () => {
    render(<ReportIssueButton pageLabel="Sheep index" />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    expect(screen.getByRole('dialog', { name: 'Report an issue' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /what happened/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /what did you expect/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /severity/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /item/i })).toBeInTheDocument();
  });

  it('associates the helper paragraph with the dialog via aria-describedby', () => {
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    const dialog = screen.getByRole('dialog');
    const description = screen.getByText("Prefills a GitHub issue with this page's context.");
    expect(dialog).toHaveAttribute('aria-describedby', 'report-issue-description');
    expect(description).toHaveAttribute('id', 'report-issue-description');
  });

  it('opens a prefilled GitHub issue with page context on submit', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ReportIssueButton pageLabel="Sheep index" />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    fireEvent.change(screen.getByRole('textbox', { name: /what happened/i }), {
      target: { value: 'The sheep chart shows the wrong year range.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open GitHub issue' }));

    expect(open).toHaveBeenCalledTimes(1);
    const url = open.mock.calls[0]?.[0] as string;
    expect(url.startsWith(OPEN_URL)).toBe(true);
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    expect(params.get('title')).toContain('[Bug]');
    expect(params.get('body')).toContain('Sheep index');
    expect(params.get('body')).toContain('The sheep chart shows the wrong year range.');
    expect(params.get('body')).toContain('## Environment');
    expect(params.get('body')).toContain('Severity: Not sure');
  });

  it('preselects the current microsite from the URL', () => {
    window.history.pushState({}, '', '/microsites/sheep-index');
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    expect(screen.getByRole('combobox', { name: /item/i })).toHaveValue('Sheep index');
  });

  it('includes the microsite data note when a microsite is selected', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    fireEvent.change(screen.getByRole('combobox', { name: /item/i }), {
      target: { value: 'Sheep index' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /what happened/i }), {
      target: { value: 'The sheep chart shows the wrong year range.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open GitHub issue' }));

    const url = open.mock.calls[0]?.[0] as string;
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    expect(params.get('body')).toContain('## Data context');
    expect(params.get('body')).toContain('Stats NZ Aotearoa Data Explorer');
  });

  it('includes the expected field when filled', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    fireEvent.change(screen.getByRole('textbox', { name: /what happened/i }), {
      target: { value: 'The sheep chart shows the wrong year range.' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /what did you expect/i }), {
      target: { value: 'The chart should start in 1994.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open GitHub issue' }));

    const url = open.mock.calls[0]?.[0] as string;
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    expect(params.get('body')).toContain('## Expected');
    expect(params.get('body')).toContain('The chart should start in 1994.');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<ReportIssueButton />);
    const trigger = screen.getByRole('button', { name: 'Report an issue' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders the backdrop as a non-focusable, aria-hidden element', () => {
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    expect(screen.queryByRole('button', { name: 'Close report dialog' })).not.toBeInTheDocument();
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.firstElementChild;
    expect(backdrop).not.toBeNull();
    expect(backdrop).not.toBeInstanceOf(HTMLButtonElement);
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations when open', async () => {
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    const dialog = screen.getByRole('dialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});
