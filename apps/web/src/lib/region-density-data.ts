import regionShapeFixture from './fixtures/regional-council-2023-simplified.json';

/** One regional council row: census populations and Stats NZ land area. */
export interface RegionDensityRow {
  key: string;
  name: string;
  areaKm2: number;
  pop2013: number;
  pop2018: number;
  pop2023: number;
}

/** Census years covered by the choropleth toggle. */
export const CENSUS_YEARS = [2013, 2018, 2023] as const;

export type CensusYear = (typeof CENSUS_YEARS)[number];

/** Population density in people per square kilometre for a region and year. */
export function densityFor(row: RegionDensityRow, year: CensusYear): number {
  const population = year === 2013 ? row.pop2013 : year === 2018 ? row.pop2018 : row.pop2023;
  return population / row.areaKm2;
}

/**
 * Regional council land areas and census usually resident population
 * counts. Populations are from the Stats NZ release "2023 Census
 * population counts (by ethnic group, age, and Maori descent) and dwelling
 * counts", Table 1, regional council areas, 2013, 2018, and 2023 Censuses.
 * Land areas are Stats NZ regional council land areas as tabulated on
 * Wikipedia's "Regions of New Zealand" page, which cites the Stats NZ
 * "Regional Council 2020 Clipped (generalised)" boundary layer.
 */
export const REGION_DENSITY_ROWS: RegionDensityRow[] = [
  {
    key: 'northland',
    name: 'Northland',
    areaKm2: 12504,
    pop2013: 151689,
    pop2018: 179076,
    pop2023: 194007,
  },
  {
    key: 'auckland',
    name: 'Auckland',
    areaKm2: 4941,
    pop2013: 1415550,
    pop2018: 1571718,
    pop2023: 1656486,
  },
  {
    key: 'waikato',
    name: 'Waikato',
    areaKm2: 23900,
    pop2013: 403641,
    pop2018: 458202,
    pop2023: 498771,
  },
  {
    key: 'bay-of-plenty',
    name: 'Bay of Plenty',
    areaKm2: 12072,
    pop2013: 267741,
    pop2018: 308499,
    pop2023: 334140,
  },
  {
    key: 'gisborne',
    name: 'Gisborne',
    areaKm2: 8385,
    pop2013: 43653,
    pop2018: 47517,
    pop2023: 51135,
  },
  {
    key: 'hawkes-bay',
    name: "Hawke's Bay",
    areaKm2: 14138,
    pop2013: 151179,
    pop2018: 166368,
    pop2023: 175074,
  },
  {
    key: 'taranaki',
    name: 'Taranaki',
    areaKm2: 7254,
    pop2013: 109608,
    pop2018: 117561,
    pop2023: 126015,
  },
  {
    key: 'manawatu-whanganui',
    name: 'Manawatū-Whanganui',
    areaKm2: 22221,
    pop2013: 222672,
    pop2018: 238797,
    pop2023: 251412,
  },
  {
    key: 'wellington',
    name: 'Wellington',
    areaKm2: 8049,
    pop2013: 471315,
    pop2018: 506814,
    pop2023: 520971,
  },
  { key: 'tasman', name: 'Tasman', areaKm2: 9616, pop2013: 47157, pop2018: 52389, pop2023: 57807 },
  { key: 'nelson', name: 'Nelson', areaKm2: 422, pop2013: 46437, pop2018: 50880, pop2023: 52584 },
  {
    key: 'marlborough',
    name: 'Marlborough',
    areaKm2: 10458,
    pop2013: 43416,
    pop2018: 47340,
    pop2023: 49431,
  },
  {
    key: 'west-coast',
    name: 'West Coast',
    areaKm2: 23245,
    pop2013: 32148,
    pop2018: 31575,
    pop2023: 33390,
  },
  {
    key: 'canterbury',
    name: 'Canterbury',
    areaKm2: 44504,
    pop2013: 539433,
    pop2018: 599694,
    pop2023: 651027,
  },
  {
    key: 'otago',
    name: 'Otago',
    areaKm2: 31186,
    pop2013: 202470,
    pop2018: 225186,
    pop2023: 240900,
  },
  {
    key: 'southland',
    name: 'Southland',
    areaKm2: 31196,
    pop2013: 93342,
    pop2018: 97467,
    pop2023: 100143,
  },
];

/**
 * Looks up a regional council row by its stable key.
 *
 * @param key - the row key, for example "auckland"
 * @returns the row
 */
export function regionDensityRowByKey(key: string): RegionDensityRow {
  const row = REGION_DENSITY_ROWS.find((candidate) => candidate.key === key);
  if (row === undefined) {
    throw new Error(`missing region density row: ${key}`);
  }
  return row;
}

/** Total land area of the 16 regional councils, in square kilometres. */
export const REGIONAL_LAND_AREA_KM2 = REGION_DENSITY_ROWS.reduce(
  (sum, row) => sum + row.areaKm2,
  0,
);

/** Census usually resident population count for New Zealand by regional council, by census. */
export const NATIONAL_POPULATION: Record<CensusYear, number> = {
  2013: 4242048,
  2018: 4699755,
  2023: 4993923,
};

/** People per square kilometre for all of New Zealand, by census. */
export function nationalDensity(year: CensusYear): number {
  return NATIONAL_POPULATION[year] / REGIONAL_LAND_AREA_KM2;
}

/** Density buckets for the choropleth fill, lightest to darkest. */
export const DENSITY_BUCKETS = [
  { max: 5, color: '#e0e7ff', label: 'Fewer than 5' },
  { max: 10, color: '#c7d2fe', label: '5 to 10' },
  { max: 25, color: '#a5b4fc', label: '10 to 25' },
  { max: 60, color: '#818cf8', label: '25 to 60' },
  { max: 150, color: '#6366f1', label: '60 to 150' },
  { max: Number.POSITIVE_INFINITY, color: '#4338ca', label: '150 or more' },
] as const;

/** The bucket index for a density value, 0 being lightest. */
export function densityBucketIndex(density: number): number {
  const index = DENSITY_BUCKETS.findIndex((bucket) => density < bucket.max);
  return index === -1 ? DENSITY_BUCKETS.length - 1 : index;
}

/** An SVG-drawable region shape, projected from lon/lat to x/y. */
export interface RegionShape {
  key: string;
  name: string;
  paths: string[];
  /** Average of the outer ring's points, for a map label anchor. */
  centroid: { x: number; y: number };
}

const REF_TO_KEY: Record<string, string> = {
  NTL: 'northland',
  AUK: 'auckland',
  WKO: 'waikato',
  BOP: 'bay-of-plenty',
  GIS: 'gisborne',
  HKB: 'hawkes-bay',
  TKI: 'taranaki',
  MWT: 'manawatu-whanganui',
  WGN: 'wellington',
  TAS: 'tasman',
  NSN: 'nelson',
  MBH: 'marlborough',
  WTC: 'west-coast',
  CAN: 'canterbury',
  OTA: 'otago',
  STL: 'southland',
};

interface Shape {
  x: number;
  y: number;
}

const PROJECTION_WIDTH = 520;

/** Projected bounds, width, and height of the region map. */
export const REGION_MAP_VIEW: { width: number; height: number } = {
  width: PROJECTION_WIDTH,
  height: 0,
};

/** One SVG path string per region, projected from lon/lat to x/y. */
export const REGION_SHAPES: RegionShape[] = buildRegionShapes();

function parseFixtureFeatures(): { name: string; ref: string; rings: Shape[][] }[] {
  const parsed: unknown = regionShapeFixture;
  const features =
    (
      parsed as {
        features?: {
          properties?: { name?: unknown; ref?: unknown };
          geometry?: { coordinates?: unknown };
        }[];
      }
    ).features ?? [];
  const shapes: { name: string; ref: string; rings: Shape[][] }[] = [];
  for (const feature of features) {
    const name = typeof feature.properties?.name === 'string' ? feature.properties.name : '';
    const ref = typeof feature.properties?.ref === 'string' ? feature.properties.ref : '';
    const coordinates = feature.geometry?.coordinates as number[][][][][] | undefined;
    const rings: Shape[][] = [];
    for (const polygon of coordinates ?? []) {
      for (const ring of polygon) {
        const points: Shape[] = [];
        for (const [lon, lat] of ring) {
          if (typeof lon === 'number' && typeof lat === 'number') {
            points.push({ x: lon, y: lat });
          }
        }
        if (points.length > 0) {
          rings.push(points);
        }
      }
    }
    shapes.push({ name, ref, rings });
  }
  return shapes;
}

function buildRegionShapes(): RegionShape[] {
  const shapes = parseFixtureFeatures();
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  for (const shape of shapes) {
    for (const ring of shape.rings) {
      for (const point of ring) {
        minLon = Math.min(minLon, point.x);
        maxLon = Math.max(maxLon, point.x);
        minLat = Math.min(minLat, point.y);
        maxLat = Math.max(maxLat, point.y);
      }
    }
  }
  const middleLatitude = (minLat + maxLat) / 2;
  const scale = PROJECTION_WIDTH / (maxLon - minLon);
  const cosMiddle = Math.cos((middleLatitude * Math.PI) / 180);
  const xForLon = (lon: number): number => (lon - minLon) * scale;
  const yForLat = (lat: number): number => (maxLat - lat) * scale * cosMiddle;
  const height = (maxLat - minLat) * scale * cosMiddle;
  REGION_MAP_VIEW.height = height;
  return shapes.map((shape) => {
    const firstRing = shape.rings[0] ?? [];
    const cx =
      firstRing.reduce((sum, point) => sum + xForLon(point.x), 0) / Math.max(1, firstRing.length);
    const cy =
      firstRing.reduce((sum, point) => sum + yForLat(point.y), 0) / Math.max(1, firstRing.length);
    return {
      key: REF_TO_KEY[shape.ref] ?? shape.ref.toLowerCase(),
      name: shape.name,
      centroid: { x: cx, y: cy },
      paths: shape.rings.map((ring) => {
        const d = ring
          .map(
            (point, index) =>
              `${index === 0 ? 'M' : 'L'}${xForLon(point.x).toFixed(1)},${yForLat(point.y).toFixed(1)}`,
          )
          .join(' ');
        return `${d} Z`;
      }),
    };
  });
}
