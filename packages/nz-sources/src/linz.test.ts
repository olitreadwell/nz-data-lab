import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { NzSourceParseError } from './errors';
import { parseLinzFeatures } from './linz';

const FIXTURE = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/fixtures/linz-property-titles.json'), 'utf8'),
) as unknown;

describe('parseLinzFeatures', () => {
  it('parses the LINZ GeoJSON fixture into features', () => {
    const features = parseLinzFeatures(FIXTURE);
    expect(features.length).toBe(2);
    expect(features[0]?.properties.title_reference).toBe('OT12/345');
    expect(features[1]?.properties.land_district).toBe('Wellington');
  });

  it('rejects a payload that is not a FeatureCollection', () => {
    expect(() => parseLinzFeatures({ type: 'Point' })).toThrow(NzSourceParseError);
  });
});
