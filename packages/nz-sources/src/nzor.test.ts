import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { NzSourceParseError } from './errors';
import { parseNzorNames } from './nzor';

const FIXTURE = readFileSync(path.join(process.cwd(), 'src/fixtures/nzor-names-kiwi.xml'), 'utf8');

describe('parseNzorNames', () => {
  it('parses the NZOR fixture into a search result', () => {
    const result = parseNzorNames(FIXTURE);
    expect(result.total).toBeGreaterThan(0);
    expect(result.names.length).toBeGreaterThan(0);
    expect(result.names[0]?.fullName?.length).toBeGreaterThan(0);
  });

  it('returns an empty result for an empty payload', () => {
    expect(() => parseNzorNames('not xml')).toThrow(NzSourceParseError);
  });
});
