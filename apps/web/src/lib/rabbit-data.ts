import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * One spotlight-count transect in the Landcare Research HawkesBayRabbits
 * dataset: rabbits seen along `km` of road driven at night on one farm site
 * in one year.
 */
export interface RabbitSpotlightRow {
  site: string;
  year: number;
  rabbits: number;
  km: number;
}

/** One year of pooled Hawke's Bay spotlight counts across all monitored sites. */
export interface RabbitSpotlightPoint {
  year: number;
  sites: number;
  rabbits: number;
  km: number;
  rabbitsPerKm: number;
}

export interface RabbitSpotlightSeries {
  points: RabbitSpotlightPoint[];
  first: RabbitSpotlightPoint;
  latest: RabbitSpotlightPoint;
  peak: RabbitSpotlightPoint;
  changeFromFirstPercent: number;
}

const RABBIT_SPOTLIGHT_URL =
  'https://datastore.landcareresearch.co.nz/dataset/92db9cdc-402f-4909-9c6f-a4615d1c726a/resource/353007de-f414-4392-9a81-ece43cf374ae/download/hbspotlightcountsbyyear.csv';

const RABBIT_SPOTLIGHT_FIXTURE_PATH = path.join(
  process.cwd(),
  'src/lib/fixtures/hawkes-bay-rabbit-spotlight-2012-2021.csv',
);

function percentChange(from: number, to: number): number {
  return ((to - from) / from) * 100;
}

/**
 * Parses the HawkesBayRabbits spotlight-count CSV (columns
 * site,year,num.rabbits,km,predCtrl,rabPerKm,logKm,area) into rows, dropping
 * any row whose numbers do not parse.
 *
 * @param csv - the raw CSV text
 * @returns the parsed spotlight rows
 */
export function parseRabbitSpotlightCsv(csv: string): RabbitSpotlightRow[] {
  const lines = csv.trim().split('\n');
  const rows: RabbitSpotlightRow[] = [];
  for (const line of lines.slice(1)) {
    const cells = line.split(',');
    const site = cells[0]?.trim() ?? '';
    const year = Number(cells[1]);
    const rabbits = Number(cells[2]);
    const km = Number(cells[3]);
    if (
      site.length === 0 ||
      !Number.isFinite(year) ||
      !Number.isFinite(rabbits) ||
      !Number.isFinite(km)
    ) {
      continue;
    }
    rows.push({ site, year, rabbits, km });
  }
  return rows;
}

/**
 * Pools the per-site spotlight rows into one per-year series: rabbits per
 * kilometre is the sum of rabbits seen divided by the sum of kilometres
 * driven, so years with more monitored sites stay comparable.
 *
 * @param rows - the parsed spotlight rows
 * @returns the pooled per-year series
 */
export function buildRabbitSpotlightSeries(rows: RabbitSpotlightRow[]): RabbitSpotlightSeries {
  const byYear = new Map<number, RabbitSpotlightPoint>();
  for (const row of rows) {
    const point = byYear.get(row.year);
    if (point === undefined) {
      byYear.set(row.year, {
        year: row.year,
        sites: 1,
        rabbits: row.rabbits,
        km: row.km,
        rabbitsPerKm: row.rabbits / row.km,
      });
      continue;
    }
    point.sites += 1;
    point.rabbits += row.rabbits;
    point.km += row.km;
    point.rabbitsPerKm = point.rabbits / point.km;
  }

  const points = [...byYear.values()].sort((a, b) => a.year - b.year);
  const first = points[0];
  const latest = points[points.length - 1];
  if (first === undefined || latest === undefined) {
    throw new Error('No rabbit spotlight observations found in the Landcare Research dataset');
  }

  let peak = first;
  for (const point of points) {
    if (point.rabbitsPerKm > peak.rabbitsPerKm) {
      peak = point;
    }
  }

  return {
    points,
    first,
    latest,
    peak,
    changeFromFirstPercent: percentChange(first.rabbitsPerKm, latest.rabbitsPerKm),
  };
}

/**
 * Fetches the Hawke's Bay rabbit spotlight counts from the Landcare Research
 * datastore at deploy time, falling back to a committed snapshot of the same
 * file when the download fails. The dataset has not changed since the 2021
 * season, so the fallback is not stale.
 *
 * @returns the pooled per-year series
 */
export async function fetchRabbitSpotlightSeries(): Promise<RabbitSpotlightSeries> {
  try {
    const response = await fetch(RABBIT_SPOTLIGHT_URL, { cache: 'force-cache' });
    if (!response.ok) {
      throw new Error(`Rabbit spotlight download failed with status ${response.status}`);
    }
    return buildRabbitSpotlightSeries(parseRabbitSpotlightCsv(await response.text()));
  } catch {
    const fixture = readFileSync(RABBIT_SPOTLIGHT_FIXTURE_PATH, 'utf8');
    return buildRabbitSpotlightSeries(parseRabbitSpotlightCsv(fixture));
  }
}
