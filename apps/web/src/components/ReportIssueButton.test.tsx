import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReportIssueButton } from './ReportIssueButton';

expect.extend(toHaveNoViolations);

const OPEN_URL = 'https://github.com/olitreadwell/nz-data-lab/issues/new';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ReportIssueButton', () => {
  it('opens a dialog with the report form', () => {
    render(<ReportIssueButton pageLabel="Sheep index" />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    expect(screen.getByRole('dialog', { name: 'Report an issue' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /what happened/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /item/i })).toBeInTheDocument();
  });

  it('associates the helper paragraph with the dialog via aria-describedby', () => {
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    const dialog = screen.getByRole('dialog');
    const description = screen.getByText('Opens a prefilled GitHub issue for this page.');
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

  it('has no accessibility violations when open', async () => {
    render(<ReportIssueButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Report an issue' }));
    const dialog = screen.getByRole('dialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});
