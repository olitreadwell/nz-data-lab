import { beforeEach, describe, expect, it } from 'vitest';

import { HIDDEN_MICROSITES, withHiddenMicrositesRemoved } from './hidden-microsites';

const MICROSITES_FIXTURE = [
  { slug: 'sheep-index' },
  { slug: 'shake-index' },
  { slug: 'deer-boom-bust' },
];

beforeEach(() => {
  HIDDEN_MICROSITES.length = 0;
});

describe('withHiddenMicrositesRemoved', () => {
  it('keeps every microsite when nothing is hidden', () => {
    expect(withHiddenMicrositesRemoved(MICROSITES_FIXTURE)).toHaveLength(3);
  });

  it('drops hidden microsites', () => {
    HIDDEN_MICROSITES.push('shake-index');
    const visible = withHiddenMicrositesRemoved(MICROSITES_FIXTURE);
    expect(visible.map((microsite) => microsite.slug)).toEqual(['sheep-index', 'deer-boom-bust']);
  });

  it('removes every listed slug from the site list', () => {
    HIDDEN_MICROSITES.push('shake-index', 'sheep-index');
    const visible = withHiddenMicrositesRemoved(MICROSITES_FIXTURE);
    expect(visible.map((microsite) => microsite.slug)).toEqual(['deer-boom-bust']);
  });
});
