import { describe, expect, it } from 'vitest';

import { MICROSITES } from './microsites';

describe('MICROSITES taxonomy', () => {
  it('gives every microsite a data source, chart type, and category', () => {
    for (const microsite of MICROSITES) {
      expect(microsite.dataSource.length, microsite.slug).toBeGreaterThan(0);
      expect(microsite.chartType.length, microsite.slug).toBeGreaterThan(0);
      expect(microsite.category.length, microsite.slug).toBeGreaterThan(0);
    }
  });

  it('has unique slugs', () => {
    const slugs = MICROSITES.map((microsite) => microsite.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps every filter dimension selectable', () => {
    const sources = new Set(MICROSITES.map((microsite) => microsite.dataSource));
    const chartTypes = new Set(MICROSITES.map((microsite) => microsite.chartType));
    const categories = new Set(MICROSITES.map((microsite) => microsite.category));
    expect(sources.size).toBeGreaterThan(1);
    expect(chartTypes.size).toBeGreaterThan(1);
    expect(categories.size).toBeGreaterThan(1);
  });
});
