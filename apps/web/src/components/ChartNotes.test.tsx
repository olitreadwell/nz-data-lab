import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import type { ChartEventMarker } from '@/lib/event-markers';

import { ChartExplain, EventMarkerLegend } from './ChartNotes';

expect.extend(toHaveNoViolations);

const EVENTS: ChartEventMarker[] = [
  { x: 'Mar 2020', label: 'Border closed', citation: 'The border closed on 19 March 2020.' },
  { x: 'Dec 2021', label: 'OCR rises', citation: 'The rate rose in October 2021.' },
];

describe('ChartExplain', () => {
  it('renders the heading and the plain-language note', () => {
    render(<ChartExplain>Up means more people.</ChartExplain>);
    expect(screen.getByText('How to read this chart')).toBeInTheDocument();
    expect(screen.getByText('Up means more people.')).toBeInTheDocument();
  });
});

describe('EventMarkerLegend', () => {
  it('numbers the events in order with citations', () => {
    render(<EventMarkerLegend heading="Events on this chart" events={EVENTS} />);
    expect(screen.getByText('Events on this chart')).toBeInTheDocument();
    expect(screen.getByText('Border closed')).toBeInTheDocument();
    expect(screen.getByText('OCR rises')).toBeInTheDocument();
    expect(screen.getByText(/19 March 2020/)).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EventMarkerLegend heading="Events" events={EVENTS} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
