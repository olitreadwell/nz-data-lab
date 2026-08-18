import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveCasCrashCell } from '@/lib/live-sources';

import { RoadCrashTrend } from './RoadCrashTrend';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const ALL_CELLS: LiveCasCrashCell[] = [
  { region: 'Auckland Region', year: 2006, count: 13763 },
  { region: 'Auckland Region', year: 2007, count: 14000 },
  { region: 'Canterbury Region', year: 2006, count: 4210 },
  { region: 'Canterbury Region', year: 2007, count: 4300 },
  { region: 'Otago Region', year: 2006, count: 2145 },
  { region: 'Otago Region', year: 2007, count: 2200 },
];

const FATAL_CELLS: LiveCasCrashCell[] = [
  { region: 'Auckland Region', year: 2006, count: 350 },
  { region: 'Auckland Region', year: 2007, count: 375 },
  { region: 'Canterbury Region', year: 2006, count: 120 },
  { region: 'Canterbury Region', year: 2007, count: 130 },
];

FETCH_MOCK.mockImplementation(async (fatalOnly: boolean) => (fatalOnly ? FATAL_CELLS : ALL_CELLS));

vi.mock('@/lib/live-sources', () => ({
  fetchLiveCasCrashes: FETCH_MOCK,
}));

describe('RoadCrashTrend', () => {
  it('shows the crash heatmap', async () => {
    render(<RoadCrashTrend />);
    expect(await screen.findByText(/40,618 crashes in view/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /Crashes by region and year, 2006 to 2026/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Auckland').length).toBeGreaterThan(0);
  });

  it('toggles to fatal crashes', async () => {
    render(<RoadCrashTrend />);
    await screen.findByText(/40,618 crashes in view/);
    fireEvent.click(screen.getByRole('button', { name: 'Fatal crashes' }));
    expect(
      screen.getByRole('img', { name: /Fatal crashes by region and year, 2006 to 2026/ }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/975 crashes in view/)).toBeInTheDocument();
  });

  it('narrows the year window with the slider', async () => {
    render(<RoadCrashTrend />);
    await screen.findByText(/40,618 crashes in view/);
    const slider = screen.getByRole('slider', { name: /Up to year/ });
    fireEvent.change(slider, { target: { value: '2006' } });
    expect(await screen.findByText(/20,118 crashes in view/)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RoadCrashTrend />);
    await screen.findByText(/40,618 crashes in view/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
