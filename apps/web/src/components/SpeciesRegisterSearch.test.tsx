import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveNzorName } from '@/lib/live-sources';

import { SpeciesRegisterSearch } from './SpeciesRegisterSearch';

expect.extend(toHaveNoViolations);

const NAMES: LiveNzorName[] = [
  { nameId: '1', className: 'Aves', fullName: 'Apteryx mantelli' },
  { nameId: '2', className: 'Aves', fullName: 'Apteryx australis' },
  { nameId: '3', className: 'Insecta', fullName: 'Deinacrida heteracantha' },
];

vi.mock('@/lib/live-sources', () => ({
  searchLiveNzorNames: vi.fn(async () => NAMES),
}));

describe('SpeciesRegisterSearch', () => {
  it('searches the register and shows matching names', async () => {
    render(<SpeciesRegisterSearch initialQuery="kiwi" />);
    expect(await screen.findByText(/3 names match "kiwi"/)).toBeInTheDocument();
    expect(screen.getByText('Apteryx mantelli')).toBeInTheDocument();
  });

  it('exposes the class counts in a keyboard-reachable table', async () => {
    const { container } = render(<SpeciesRegisterSearch initialQuery="kiwi" />);
    await screen.findByText(/3 names match "kiwi"/);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Class');
    expect(table).toHaveTextContent('Names');
    expect(table).toHaveTextContent('Aves');
    expect(table).toHaveTextContent('Insecta');
  });

  it('shows a legend pairing each class with its color', async () => {
    render(<SpeciesRegisterSearch initialQuery="kiwi" />);
    await screen.findByText(/3 names match "kiwi"/);
    const legend = screen.getByRole('list', { name: 'Chart legend' });
    expect(legend).toHaveTextContent('Aves');
    expect(legend).toHaveTextContent('Insecta');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SpeciesRegisterSearch initialQuery="kiwi" />);
    await screen.findByText(/3 names match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
