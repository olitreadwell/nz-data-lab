import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveAucklandParkBoard } from '@/lib/live-sources';

import { AucklandParks } from './AucklandParks';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const BOARDS: LiveAucklandParkBoard[] = [
  { board: 'Franklin', parkCount: 382, areaM2: 200596395 },
  { board: 'Waitakere Ranges', parkCount: 215, areaM2: 183393521 },
  { board: 'Rodney', parkCount: 424, areaM2: 53970780 },
  { board: 'Hibiscus and Bays', parkCount: 342, areaM2: 12467372 },
  { board: 'Upper Harbour', parkCount: 273, areaM2: 9298735 },
  { board: 'Howick', parkCount: 293, areaM2: 8876845 },
];

FETCH_MOCK.mockResolvedValue(BOARDS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveAucklandParkBoards: FETCH_MOCK,
}));

describe('AucklandParks', () => {
  it('shows the park pie', async () => {
    render(<AucklandParks />);
    expect(await screen.findByText(/6 local boards, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Auckland Council park land by local board/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Franklin').length).toBeGreaterThan(0);
  });

  it('filters boards by name', async () => {
    render(<AucklandParks />);
    await screen.findByText(/6 local boards, fetched live/);
    const search = screen.getByRole('searchbox', { name: /Filter boards by name/ });
    fireEvent.change(search, { target: { value: 'howick' } });
    expect(screen.getAllByText('Howick').length).toBeGreaterThan(0);
    expect(screen.queryByText('Franklin')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AucklandParks />);
    await screen.findByText(/6 local boards, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
