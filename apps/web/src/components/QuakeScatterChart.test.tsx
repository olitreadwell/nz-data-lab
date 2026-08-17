import type { GeoNetQuake } from '@nzlab/nz-sources';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { QuakeScatterChart } from './QuakeScatterChart';

expect.extend(toHaveNoViolations);

const QUAKES: GeoNetQuake[] = [
  {
    publicId: '2026p617265',
    time: '2026-08-17T09:19:00.000Z',
    depthKm: 10.2,
    magnitude: 3.4,
    mmi: 4,
    locality: '20 km north-west of Taihape',
    quality: 'best',
    latitude: -39.5,
    longitude: 175.6,
  },
  {
    publicId: '2026p614475',
    time: '2026-08-16T12:00:00.000Z',
    depthKm: 44.9,
    magnitude: 4.2,
    mmi: 4,
    locality: '45 km north-west of Te Anau',
    quality: 'best',
    latitude: -45.1,
    longitude: 167.4,
  },
  {
    publicId: '2026p613127',
    time: '2026-08-15T08:00:00.000Z',
    depthKm: 10,
    magnitude: 5.9,
    mmi: 7,
    locality: '5 km south-east of Hunterville',
    quality: 'best',
    latitude: -40.0,
    longitude: 175.5,
  },
];

describe('QuakeScatterChart', () => {
  it('renders an accessible chart with the visible count', () => {
    render(<QuakeScatterChart quakes={QUAKES} />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/3 of 3 shown/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuakeScatterChart quakes={QUAKES} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('filters quakes when the magnitude slider moves', () => {
    render(<QuakeScatterChart quakes={QUAKES} />);
    const slider = screen.getByRole('slider', { name: /minimum magnitude/i });
    fireEvent.change(slider, { target: { value: '5' } });
    expect(screen.getByText(/Showing 1 of 3 recent quakes/)).toBeInTheDocument();
  });

  it('renders a fallback label for empty data', () => {
    render(<QuakeScatterChart quakes={[]} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/recent felt quakes/i);
  });
});
