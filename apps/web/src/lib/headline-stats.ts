import { searchDataGovtNzDatasets, searchNzorNames } from '@nzlab/nz-sources';

/**
 * Headline figures for the home page cards and microsite stat blocks.
 *
 * The register and catalogue totals are derived from the live APIs at deploy
 * time (see fetchRegisterTotal / fetchCatalogueTotal). Every other figure is
 * pinned here as a single source of truth so the two pages cannot drift
 * apart; each pinned value cites its source and the date it was captured.
 */

/** NZ Organisms Register total, from the live /names Total field (2026-08-18). */
export const REGISTER_TOTAL_FALLBACK = 170_151;

/** data.govt.nz catalogue total, from CKAN package_search with an empty query (2026-08-18). */
export const CATALOGUE_TOTAL_FALLBACK = 31_915;

/** data.govt.nz datasets matching 'water' (2026-08-18). */
export const CATALOGUE_WATER_MATCHES = '4,236';

/** data.govt.nz datasets matching 'climate' (2026-08-18). */
export const CATALOGUE_CLIMATE_MATCHES = '865';

/** DigitalNZ records matching 'gold' (2026-08-18). */
export const DIGITALNZ_GOLD_RECORDS = '1,977,021';

/** DigitalNZ 1890s records matching 'gold' (2026-08-18). */
export const DIGITALNZ_GOLD_1890S_RECORDS = '427,164';

/** Trade Me leaf categories (2026-08-18). */
export const TRADEME_LEAF_CATEGORIES = '5,589';

/** Trade Me 'Home & living' leaf categories (2026-08-18). */
export const TRADEME_HOME_LIVING_LEAVES = '581';

/** Trade Me 'Motors' leaf categories (2026-08-18). */
export const TRADEME_MOTORS_LEAVES = '560';

/** NZ native freshwater fish species (2026-08-18). */
export const NATIVE_FRESHWATER_FISH = '51';

/** NZ native frog species (2026-08-18). */
export const NATIVE_FROG_SPECIES = '4';

/** GeoNet felt quakes per year, a rough long-run average (2026-08-18). */
export const FELT_QUAKES_PER_YEAR = '~250';

/**
 * Fetches the NZ Organisms Register total from the live API, falling back to
 * a pinned value when the API blocks the build runner.
 * @returns the total number of names in the register.
 */
export async function fetchRegisterTotal(): Promise<number> {
  try {
    return (await searchNzorNames('kiwi')).total;
  } catch {
    return REGISTER_TOTAL_FALLBACK;
  }
}

/**
 * Fetches the data.govt.nz catalogue total from the live CKAN API, falling
 * back to a pinned value when the API blocks the build runner.
 * @returns the total number of datasets in the catalogue.
 */
export async function fetchCatalogueTotal(): Promise<number> {
  try {
    return (await searchDataGovtNzDatasets('')).count;
  } catch {
    return CATALOGUE_TOTAL_FALLBACK;
  }
}
