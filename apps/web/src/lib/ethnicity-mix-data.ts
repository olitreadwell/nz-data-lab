/**
 * Ethnic group (grouped total responses) for the census usually resident
 * population, from Stats NZ "2023 Census population counts (by ethnic
 * group, age, and Maori descent) and dwelling counts" (Table 4, published
 * 29 May 2024). People can identify with more than one ethnic group, so the
 * group counts add to more than the population. Shares are of the people
 * who stated at least one ethnicity, matching the percentages Stats NZ
 * publishes. The values are final census counts, so this snapshot does not
 * go stale.
 */

export const ETHNICITY_MIX_YEARS = [2013, 2018, 2023] as const;

export type EthnicityMixYear = (typeof ETHNICITY_MIX_YEARS)[number];

export interface EthnicityGroupMix {
  key: string;
  label: string;
  color: string;
  countsByYear: Record<EthnicityMixYear, number>;
}

export const ETHNICITY_GROUPS: EthnicityGroupMix[] = [
  {
    key: 'european',
    label: 'European',
    color: '#0072B2',
    countsByYear: { 2013: 2969391, 2018: 3297864, 2023: 3383742 },
  },
  {
    key: 'maori',
    label: 'Māori',
    color: '#009E73',
    countsByYear: { 2013: 598602, 2018: 775836, 2023: 887493 },
  },
  {
    key: 'pacific',
    label: 'Pacific peoples',
    color: '#E69F00',
    countsByYear: { 2013: 295941, 2018: 381642, 2023: 442632 },
  },
  {
    key: 'asian',
    label: 'Asian',
    color: '#D55E00',
    countsByYear: { 2013: 471708, 2018: 707598, 2023: 861576 },
  },
  {
    key: 'melaa',
    label: 'Middle Eastern/Latin American/African',
    color: '#CC79A7',
    countsByYear: { 2013: 46953, 2018: 70332, 2023: 92760 },
  },
  {
    key: 'other',
    label: 'Other ethnicity',
    color: '#999999',
    countsByYear: { 2013: 67752, 2018: 58053, 2023: 56133 },
  },
];

/** People who stated at least one ethnicity, by census year. */
export const ETHNICITY_MIX_STATED: Record<EthnicityMixYear, number> = {
  2013: 4011399,
  2018: 4699755,
  2023: 4993923,
};

/** Total ethnic answers per 100 people who stated an ethnicity. */
export function ethnicityAnswersPerHundred(year: EthnicityMixYear): number {
  const responses = ETHNICITY_GROUPS.reduce((total, group) => total + group.countsByYear[year], 0);
  return Math.round((responses / ETHNICITY_MIX_STATED[year]) * 1000) / 10;
}

/** Share of people who stated that ethnicity, as a percentage. */
export function ethnicitySharePercent(group: EthnicityGroupMix, year: EthnicityMixYear): number {
  return Math.round((group.countsByYear[year] / ETHNICITY_MIX_STATED[year]) * 1000) / 10;
}
