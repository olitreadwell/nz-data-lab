import { fetchGeoNetFeltQuakes, geonetAdapter } from '@nzlab/nz-sources';
import type { GeoNetQuake } from '@nzlab/nz-sources';

/**
 * Fetches recent felt quakes from the public GeoNet API, falling back to a
 * committed snapshot when the API blocks the build runner. The site redeploys
 * daily, so the chart refreshes with the latest quakes.
 */
export async function fetchRecentQuakes(): Promise<GeoNetQuake[]> {
  try {
    return await fetchGeoNetFeltQuakes(3);
  } catch {
    return geonetAdapter.loadFixture();
  }
}
