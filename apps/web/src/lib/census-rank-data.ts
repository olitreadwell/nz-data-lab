/**
 * Census usually resident population counts by territorial authority, from
 * the Stats NZ 2023 Census release "2023 Census population counts (by ethnic
 * group, age, and Maori descent) and dwelling counts" (Table 2, published 29
 * May 2024). Counts have fixed random rounding to base 3 applied, so they may
 * not sum to the stated totals. The series is final: censuses run every five
 * years, so this snapshot does not go stale.
 */

export interface CensusTaPopulationRow {
  name: string;
  population2013: number;
  population2018: number;
  population2023: number;
  rank2013: number;
  rank2018: number;
  rank2023: number;
}

export const CENSUS_YEARS = [2013, 2018, 2023] as const;

export const CENSUS_TA_POPULATION_ROWS: CensusTaPopulationRow[] = [
  {
    name: 'Auckland',
    population2013: 1415550,
    population2018: 1571718,
    population2023: 1656486,
    rank2013: 1,
    rank2018: 1,
    rank2023: 1,
  },
  {
    name: 'Christchurch city',
    population2013: 341469,
    population2018: 369006,
    population2023: 391383,
    rank2013: 2,
    rank2018: 2,
    rank2023: 2,
  },
  {
    name: 'Wellington city',
    population2013: 190956,
    population2018: 202737,
    population2023: 202689,
    rank2013: 3,
    rank2018: 3,
    rank2023: 3,
  },
  {
    name: 'Hamilton city',
    population2013: 141612,
    population2018: 160911,
    population2023: 174741,
    rank2013: 4,
    rank2018: 4,
    rank2023: 4,
  },
  {
    name: 'Tauranga city',
    population2013: 115161,
    population2018: 137130,
    population2023: 152844,
    rank2013: 6,
    rank2018: 5,
    rank2023: 5,
  },
  {
    name: 'Dunedin city',
    population2013: 120249,
    population2018: 126255,
    population2023: 128901,
    rank2013: 5,
    rank2018: 6,
    rank2023: 6,
  },
  {
    name: 'Lower Hutt city',
    population2013: 98238,
    population2018: 104532,
    population2023: 107562,
    rank2013: 7,
    rank2018: 7,
    rank2023: 7,
  },
  {
    name: 'Whangarei district',
    population2013: 76995,
    population2018: 90960,
    population2023: 96678,
    rank2013: 9,
    rank2018: 8,
    rank2023: 8,
  },
  {
    name: 'Palmerston North city',
    population2013: 80079,
    population2018: 84639,
    population2023: 87090,
    rank2013: 8,
    rank2018: 9,
    rank2023: 9,
  },
  {
    name: 'New Plymouth district',
    population2013: 74184,
    population2018: 80679,
    population2023: 87000,
    rank2013: 10,
    rank2018: 11,
    rank2023: 10,
  },
  {
    name: 'Waikato district',
    population2013: 63378,
    population2018: 75618,
    population2023: 85968,
    rank2013: 13,
    rank2018: 12,
    rank2023: 11,
  },
  {
    name: 'Hastings district',
    population2013: 73245,
    population2018: 81537,
    population2023: 85965,
    rank2013: 11,
    rank2018: 10,
    rank2023: 12,
  },
  {
    name: 'Selwyn district',
    population2013: 44595,
    population2018: 60561,
    population2023: 78144,
    rank2013: 23,
    rank2018: 16,
    rank2023: 13,
  },
  {
    name: 'Rotorua district',
    population2013: 65280,
    population2018: 71877,
    population2023: 74058,
    rank2013: 12,
    rank2018: 13,
    rank2023: 14,
  },
  {
    name: 'Far North district',
    population2013: 55734,
    population2018: 65250,
    population2023: 71430,
    rank2013: 15,
    rank2018: 14,
    rank2023: 15,
  },
  {
    name: 'Waimakariri district',
    population2013: 49989,
    population2018: 59502,
    population2023: 66246,
    rank2013: 18,
    rank2018: 17,
    rank2023: 16,
  },
  {
    name: 'Napier city',
    population2013: 57240,
    population2018: 62241,
    population2023: 64695,
    rank2013: 14,
    rank2018: 15,
    rank2023: 17,
  },
  {
    name: 'Porirua city',
    population2013: 51717,
    population2018: 56559,
    population2023: 59445,
    rank2013: 16,
    rank2018: 18,
    rank2023: 18,
  },
  {
    name: 'Waipa district',
    population2013: 46668,
    population2018: 53241,
    population2023: 58686,
    rank2013: 21,
    rank2018: 21,
    rank2023: 19,
  },
  {
    name: 'Tasman district',
    population2013: 47157,
    population2018: 52389,
    population2023: 57807,
    rank2013: 20,
    rank2018: 22,
    rank2023: 20,
  },
  {
    name: 'Western Bay of Plenty district',
    population2013: 43323,
    population2018: 50904,
    population2023: 56184,
    rank2013: 27,
    rank2018: 23,
    rank2023: 21,
  },
  {
    name: 'Kapiti Coast district',
    population2013: 49104,
    population2018: 53673,
    population2023: 55914,
    rank2013: 19,
    rank2018: 20,
    rank2023: 22,
  },
  {
    name: 'Invercargill city',
    population2013: 51696,
    population2018: 54204,
    population2023: 55599,
    rank2013: 17,
    rank2018: 19,
    rank2023: 23,
  },
  {
    name: 'Nelson city',
    population2013: 46437,
    population2018: 50880,
    population2023: 52584,
    rank2013: 22,
    rank2018: 24,
    rank2023: 24,
  },
  {
    name: 'Gisborne district',
    population2013: 43653,
    population2018: 47517,
    population2023: 51135,
    rank2013: 25,
    rank2018: 25,
    rank2023: 25,
  },
  {
    name: 'Marlborough district',
    population2013: 43416,
    population2018: 47340,
    population2023: 49431,
    rank2013: 26,
    rank2018: 26,
    rank2023: 26,
  },
  {
    name: 'Queenstown-Lakes district',
    population2013: 28224,
    population2018: 39153,
    population2023: 47808,
    rank2013: 36,
    rank2018: 30,
    rank2023: 27,
  },
  {
    name: 'Whanganui district',
    population2013: 42153,
    population2018: 45309,
    population2023: 47619,
    rank2013: 28,
    rank2018: 28,
    rank2023: 28,
  },
  {
    name: 'Timaru district',
    population2013: 43932,
    population2018: 46296,
    population2023: 47547,
    rank2013: 24,
    rank2018: 27,
    rank2023: 29,
  },
  {
    name: 'Upper Hutt city',
    population2013: 40179,
    population2018: 43980,
    population2023: 45759,
    rank2013: 29,
    rank2018: 29,
    rank2023: 30,
  },
  {
    name: 'Taupo district',
    population2013: 32907,
    population2018: 37203,
    population2023: 40296,
    rank2013: 30,
    rank2018: 31,
    rank2023: 31,
  },
  {
    name: 'Whakatane district',
    population2013: 32691,
    population2018: 35700,
    population2023: 37149,
    rank2013: 31,
    rank2018: 32,
    rank2023: 32,
  },
  {
    name: 'Matamata-Piako district',
    population2013: 31536,
    population2018: 34404,
    population2023: 37098,
    rank2013: 32,
    rank2018: 33,
    rank2023: 33,
  },
  {
    name: 'Horowhenua district',
    population2013: 30096,
    population2018: 33261,
    population2023: 36693,
    rank2013: 34,
    rank2018: 35,
    rank2023: 34,
  },
  {
    name: 'Ashburton district',
    population2013: 31041,
    population2018: 33423,
    population2023: 34746,
    rank2013: 33,
    rank2018: 34,
    rank2023: 35,
  },
  {
    name: 'Manawatu district',
    population2013: 27459,
    population2018: 30165,
    population2023: 32415,
    rank2013: 37,
    rank2018: 37,
    rank2023: 36,
  },
  {
    name: 'Thames-Coromandel district',
    population2013: 26178,
    population2018: 29895,
    population2023: 31995,
    rank2013: 39,
    rank2018: 38,
    rank2023: 37,
  },
  {
    name: 'Southland district',
    population2013: 29613,
    population2018: 30864,
    population2023: 31833,
    rank2013: 35,
    rank2018: 36,
    rank2023: 38,
  },
  {
    name: 'South Taranaki district',
    population2013: 26580,
    population2018: 27534,
    population2023: 29025,
    rank2013: 38,
    rank2018: 39,
    rank2023: 39,
  },
  {
    name: 'Masterton district',
    population2013: 23352,
    population2018: 25557,
    population2023: 27678,
    rank2013: 40,
    rank2018: 40,
    rank2023: 40,
  },
  {
    name: 'Kaipara district',
    population2013: 18963,
    population2018: 22869,
    population2023: 25899,
    rank2013: 43,
    rank2018: 42,
    rank2023: 41,
  },
  {
    name: 'South Waikato district',
    population2013: 22071,
    population2018: 24042,
    population2023: 25044,
    rank2013: 41,
    rank2018: 41,
    rank2023: 42,
  },
  {
    name: 'Central Otago district',
    population2013: 17895,
    population2018: 21558,
    population2023: 24306,
    rank2013: 44,
    rank2018: 44,
    rank2023: 43,
  },
  {
    name: 'Waitaki district',
    population2013: 20829,
    population2018: 22308,
    population2023: 23472,
    rank2013: 42,
    rank2018: 43,
    rank2023: 44,
  },
  {
    name: 'Hauraki district',
    population2013: 17808,
    population2018: 20022,
    population2023: 21318,
    rank2013: 45,
    rank2018: 45,
    rank2023: 45,
  },
  {
    name: 'Tararua district',
    population2013: 16854,
    population2018: 17943,
    population2023: 18660,
    rank2013: 47,
    rank2018: 46,
    rank2023: 46,
  },
  {
    name: 'Clutha district',
    population2013: 16890,
    population2018: 17667,
    population2023: 18315,
    rank2013: 46,
    rank2018: 47,
    rank2023: 47,
  },
  {
    name: 'Rangitikei district',
    population2013: 14019,
    population2018: 15027,
    population2023: 15663,
    rank2013: 48,
    rank2018: 48,
    rank2023: 48,
  },
  {
    name: "Central Hawke's Bay district",
    population2013: 12717,
    population2018: 14142,
    population2023: 15480,
    rank2013: 50,
    rank2018: 49,
    rank2023: 49,
  },
  {
    name: 'Grey district',
    population2013: 13371,
    population2018: 13344,
    population2023: 14043,
    rank2013: 49,
    rank2018: 50,
    rank2023: 50,
  },
  {
    name: 'Hurunui district',
    population2013: 11529,
    population2018: 12558,
    population2023: 13608,
    rank2013: 53,
    rank2018: 51,
    rank2023: 51,
  },
  {
    name: 'Ruapehu district',
    population2013: 11844,
    population2018: 12309,
    population2023: 13095,
    rank2013: 52,
    rank2018: 53,
    rank2023: 52,
  },
  {
    name: 'Gore district',
    population2013: 12033,
    population2018: 12396,
    population2023: 12711,
    rank2013: 51,
    rank2018: 52,
    rank2023: 53,
  },
  {
    name: 'South Wairarapa district',
    population2013: 9528,
    population2018: 10575,
    population2023: 11811,
    rank2013: 55,
    rank2018: 54,
    rank2023: 54,
  },
  {
    name: 'Buller district',
    population2013: 10473,
    population2018: 9591,
    population2023: 10446,
    rank2013: 54,
    rank2018: 56,
    rank2023: 55,
  },
  {
    name: 'Ōtorohanga district',
    population2013: 9141,
    population2018: 10104,
    population2023: 10410,
    rank2013: 56,
    rank2018: 55,
    rank2023: 56,
  },
  {
    name: 'Stratford district',
    population2013: 8988,
    population2018: 9474,
    population2023: 10149,
    rank2013: 57,
    rank2018: 57,
    rank2023: 57,
  },
  {
    name: 'Carterton district',
    population2013: 8235,
    population2018: 9198,
    population2023: 10107,
    rank2013: 61,
    rank2018: 60,
    rank2023: 58,
  },
  {
    name: 'Ōpōtiki district',
    population2013: 8436,
    population2018: 9276,
    population2023: 10089,
    rank2013: 59,
    rank2018: 59,
    rank2023: 59,
  },
  {
    name: 'Waitomo district',
    population2013: 8907,
    population2018: 9303,
    population2023: 9585,
    rank2013: 58,
    rank2018: 58,
    rank2023: 60,
  },
  {
    name: 'Westland district',
    population2013: 8304,
    population2018: 8640,
    population2023: 8901,
    rank2013: 60,
    rank2018: 61,
    rank2023: 61,
  },
  {
    name: 'Wairoa district',
    population2013: 7890,
    population2018: 8367,
    population2023: 8826,
    rank2013: 62,
    rank2018: 62,
    rank2023: 62,
  },
  {
    name: 'Waimate district',
    population2013: 7536,
    population2018: 7815,
    population2023: 8121,
    rank2013: 63,
    rank2018: 63,
    rank2023: 63,
  },
  {
    name: 'Kawerau district',
    population2013: 6363,
    population2018: 7146,
    population2023: 7539,
    rank2013: 64,
    rank2018: 64,
    rank2023: 64,
  },
  {
    name: 'Mackenzie district',
    population2013: 4158,
    population2018: 4866,
    population2023: 5115,
    rank2013: 65,
    rank2018: 65,
    rank2023: 65,
  },
  {
    name: 'Kaikoura district',
    population2013: 3552,
    population2018: 3912,
    population2023: 4215,
    rank2013: 66,
    rank2018: 66,
    rank2023: 66,
  },
  {
    name: 'Chatham Islands territory',
    population2013: 600,
    population2018: 663,
    population2023: 612,
    rank2013: 67,
    rank2018: 67,
    rank2023: 67,
  },
];

/** Rank change across the 2013 and 2023 censuses (negative means climbed).
 * @param row - one territorial authority's census counts and ranks
 * @returns the 2023 rank minus the 2013 rank
 */
export function rankChange(row: CensusTaPopulationRow): number {
  return row.rank2023 - row.rank2013;
}

/** A headline rank change for the census rank shift microsite stats. */
export interface RankHighlight {
  slug: string;
  label: string;
  fromRank: number;
  toRank: number;
  change: number;
}

function findRow(name: string): CensusTaPopulationRow {
  const row = CENSUS_TA_POPULATION_ROWS.find((candidate) => candidate.name === name);
  if (row === undefined) {
    throw new Error(`Missing census row: ${name}`);
  }
  return row;
}

/** The three headline movers: Selwyn and Queenstown-Lakes climbed, Invercargill fell. */
export const CENSUS_RANK_HIGHLIGHTS: RankHighlight[] = [
  {
    slug: 'selwyn',
    label: 'Selwyn rank change',
    ...rankMoverSummary('Selwyn district'),
  },
  {
    slug: 'queenstown',
    label: 'Queenstown-Lakes rank change',
    ...rankMoverSummary('Queenstown-Lakes district'),
  },
  {
    slug: 'invercargill',
    label: 'Invercargill rank change',
    ...rankMoverSummary('Invercargill city'),
  },
];

function rankMoverSummary(name: string): Pick<RankHighlight, 'fromRank' | 'toRank' | 'change'> {
  const row = findRow(name);
  return {
    fromRank: row.rank2013,
    toRank: row.rank2023,
    change: rankChange(row),
  };
}

/** Formats a rank as an ordinal ("1st", "23rd", "27th").
 * @param rank - the rank number to format
 * @returns the rank with its ordinal suffix
 */
export function formatRankOrdinal(rank: number): string {
  const remainder10 = rank % 10;
  const remainder100 = rank % 100;
  if (remainder10 === 1 && remainder100 !== 11) {
    return `${rank}st`;
  }
  if (remainder10 === 2 && remainder100 !== 12) {
    return `${rank}nd`;
  }
  if (remainder10 === 3 && remainder100 !== 13) {
    return `${rank}rd`;
  }
  return `${rank}th`;
}
