import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import type { LiveHamiltonPlayground } from '@/lib/live-sources';

import {
  buildPlaygroundHeatmap,
  cellFillColor,
  cellTextColor,
  HamiltonPlaygrounds,
  HEATMAP_BG,
} from './HamiltonPlaygrounds';

expect.extend(toHaveNoViolations);

const { FETCH_MOCK } = vi.hoisted(() => ({ FETCH_MOCK: vi.fn() }));

const PLAYGROUNDS: LiveHamiltonPlayground[] = [
  { parkName: 'Galloway Park', type: 'Old Neighbourhood', decade: 2000 },
  { parkName: 'Rototuna Park', type: 'Recent Neighbourhood', decade: 2010 },
  { parkName: 'Flagstaff Park', type: 'Old Neighbourhood', decade: 2000 },
  { parkName: 'Hamilton Lake', type: 'Destination', decade: 2000 },
  { parkName: 'Unknown Park', type: 'Old Neighbourhood', decade: null },
];

FETCH_MOCK.mockResolvedValue(PLAYGROUNDS);

vi.mock('@/lib/live-sources', () => ({
  fetchLiveHamiltonPlaygrounds: FETCH_MOCK,
}));

describe('buildPlaygroundHeatmap', () => {
  it('groups playgrounds into a type-by-decade grid', () => {
    const heatmap = buildPlaygroundHeatmap(PLAYGROUNDS);
    expect(heatmap.types).toEqual(['Destination', 'Old Neighbourhood', 'Recent Neighbourhood']);
    expect(heatmap.decades).toEqual([2000, 2010]);
    expect(heatmap.maxCount).toBe(2);
    const old2000 = heatmap.cells.find(
      (cell) => cell.type === 'Old Neighbourhood' && cell.decade === 2000,
    );
    expect(old2000?.count).toBe(2);
    const destination2010 = heatmap.cells.find(
      (cell) => cell.type === 'Destination' && cell.decade === 2010,
    );
    expect(destination2010?.count).toBe(0);
  });

  it('returns empty axes when there is no data', () => {
    const heatmap = buildPlaygroundHeatmap([]);
    expect(heatmap.types).toEqual([]);
    expect(heatmap.decades).toEqual([]);
    expect(heatmap.cells).toEqual([]);
  });
});

describe('HamiltonPlaygrounds', () => {
  it('shows the playground heatmap', async () => {
    render(<HamiltonPlaygrounds />);
    expect(await screen.findByText(/5 playgrounds, fetched live/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /5 Hamilton playgrounds by type and decade/ }),
    ).toBeInTheDocument();
  });

  it('toggles a type off and on', async () => {
    render(<HamiltonPlaygrounds />);
    await screen.findByText(/5 playgrounds, fetched live/);
    const destinationButton = screen.getByRole('button', { name: 'Destination' });
    fireEvent.click(destinationButton);
    expect(destinationButton).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('img', { name: /4 Hamilton playgrounds by type and decade/ }),
    ).toBeInTheDocument();
    fireEvent.click(destinationButton);
    expect(destinationButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HamiltonPlaygrounds />);
    await screen.findByText(/5 playgrounds, fetched live/);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

const MIN_CONTRAST_AA = 4.5;

/** Relative luminance of an sRGB hex color, per the WCAG 2.2 formula. */
function relativeLuminance(hex: string): number {
  const channel = (index: number): number => parseInt(hex.slice(index, index + 2), 16) / 255;
  const linearize = (value: number): number =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return (
    0.2126 * linearize(channel(1)) + 0.7152 * linearize(channel(3)) + 0.0722 * linearize(channel(5))
  );
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('cellFillColor', () => {
  it('mixes toward the max color as the count rises', () => {
    expect(cellFillColor(0, 10, '#fafafa')).toBe('#fafafa');
    expect(cellFillColor(10, 10, '#fafafa')).toBe('#10b981');
  });
});

describe('cellTextColor', () => {
  it('keeps at least 4.5:1 contrast against its own fill for every count in both themes', () => {
    const maxCounts = [2, 3, 5, 10, 20, 50];
    for (const theme of ['light', 'dark'] as const) {
      const bgColor = HEATMAP_BG[theme];
      for (const maxCount of maxCounts) {
        for (let count = 1; count <= maxCount; count += 1) {
          const fill = cellFillColor(count, maxCount, bgColor);
          const text = cellTextColor(count, maxCount, bgColor);
          expect(contrastRatio(fill, text)).toBeGreaterThanOrEqual(MIN_CONTRAST_AA);
        }
      }
    }
  });
});
