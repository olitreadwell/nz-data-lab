import { describe, expect, it } from 'vitest';

import { loadQuakeCatalogFixture, parseGeoNetFdsnEvents } from './quake-catalog';

const FDSN_TEXT = `#EventID | Time | Latitude | Longitude | Depth/km | Author | Catalog | Contributor | ContributorID | MagType | Magnitude | MagAuthor | EventLocationName | EventType
2026p518423|2026-07-11T19:35:55|-38.209|176.001|185.3|GNS|GNS|GNS|2026p518423|MLv|2.5|GNS|10 km east of Tokoroa|earthquake
2026p518493|2026-07-11T20:13:06|-41.416|174.427|21.3|GNS|GNS|GNS|2026p518493|MLv|1.5|GNS|30 km south-west of Wellington|earthquake
2026p520001|2026-07-12T00:00:00|0|0|0|GNS|GNS|GNS|2026p520001|ML|0.0|GNS|outside|outside of network interest
2026p520002|2026-07-12T01:00:00|-37|175|5|GNS|GNS|GNS|2026p520002|ML|2.2|GNS|Quarry|quarry blast
`;

describe('parseGeoNetFdsnEvents', () => {
  it('keeps only earthquake rows and extracts time, magnitude, and depth', () => {
    const events = parseGeoNetFdsnEvents(FDSN_TEXT);
    expect(events).toHaveLength(2);
    expect(events[0]?.magnitude).toBe(2.5);
    expect(events[1]?.magnitude).toBe(1.5);
    expect(events[0]?.timeEpochSec).toBe(Date.parse('2026-07-11T19:35:55') / 1000);
    expect(events[0]?.depthKm).toBe(185.3);
    expect(events[1]?.depthKm).toBe(21.3);
  });

  it('rejects a payload without the expected header', () => {
    expect(() => parseGeoNetFdsnEvents('no header here')).toThrow();
  });
});

describe('loadQuakeCatalogFixture', () => {
  it('loads the committed snapshot of the 3-month catalog', () => {
    const events = loadQuakeCatalogFixture();
    expect(events.length).toBeGreaterThan(1000);
    expect(events.every((event) => event.magnitude >= 1)).toBe(true);
  });
});
