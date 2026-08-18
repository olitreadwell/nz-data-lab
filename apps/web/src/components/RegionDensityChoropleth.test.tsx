import { fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { densityFor, nationalDensity, regionDensityRowByKey } from '@/lib/region-density-data';

import { RegionDensityChoropleth } from './RegionDensityChoropleth';

expect.extend(toHaveNoViolations);

describe('RegionDensityChoropleth', () => {
  it('renders an accessible choropleth naming the census year', () => {
    render(<RegionDensityChoropleth />);
    const chart = screen.getByRole('img');
    expect(chart).toHaveAccessibleName(/2023 census/);
    expect(chart).toHaveAccessibleName(/population density by regional council/);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RegionDensityChoropleth />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('switches the map and table to another census year', () => {
    const { container } = render(<RegionDensityChoropleth />);
    fireEvent.click(screen.getByRole('radio', { name: '2013' }));
    expect(screen.getByRole('img')).toHaveAccessibleName(/2013 census/);
    const summary = container.querySelector('summary');
    if (summary === null) {
      throw new Error('Expected a chart data table summary');
    }
    fireEvent.click(summary);
    expect(
      screen.getByRole('cell', {
        name: `${densityFor(regionDensityRowByKey('auckland'), 2013).toFixed(1)} per km²`,
      }),
    ).toBeInTheDocument();
  });

  it('exposes the national density readout', () => {
    render(<RegionDensityChoropleth />);
    expect(
      screen.getByText(`New Zealand: ${nationalDensity(2023).toFixed(1)} people per km²`),
    ).toBeInTheDocument();
  });
});
