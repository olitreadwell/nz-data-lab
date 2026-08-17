import { describe, expect, it } from 'vitest';

import { probeAllNzDataSources } from './registry';

const RUN_SMOKE = process.env.RUN_SMOKE === '1';

describe.skipIf(!RUN_SMOKE)('live access smoke test', () => {
  it('reaches every keyless source and reports a probe for keyed ones', async () => {
    const probes = await probeAllNzDataSources({
      ...(process.env.DIGITAL_NZ_API_KEY === undefined
        ? {}
        : { apiKey: process.env.DIGITAL_NZ_API_KEY }),
    });
    for (const probe of probes) {
      if (probe.auth === 'none') {
        expect(probe.ok, `${probe.name}: ${probe.status}`).toBe(true);
      }
    }
    const keyed = probes.filter((probe) => probe.auth !== 'none');
    expect(keyed.length).toBeGreaterThan(0);
  });
});
