import { render, screen } from '@testing-library/react';
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

  it('has no accessibility violations', async () => {
    const { container } = render(<SpeciesRegisterSearch initialQuery="kiwi" />);
    await screen.findByText(/3 names match/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
