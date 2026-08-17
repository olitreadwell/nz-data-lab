import { searchDataGovtNzDatasets, searchNzorNames } from '@nzlab/nz-sources';
import { describe, expect, it, vi } from 'vitest';

import {
  CATALOGUE_TOTAL_FALLBACK,
  fetchCatalogueTotal,
  fetchRegisterTotal,
  REGISTER_TOTAL_FALLBACK,
} from './headline-stats';

vi.mock('@nzlab/nz-sources', () => ({
  searchNzorNames: vi.fn(),
  searchDataGovtNzDatasets: vi.fn(),
}));

const searchNzorNamesMock = vi.mocked(searchNzorNames);
const searchDataGovtNzDatasetsMock = vi.mocked(searchDataGovtNzDatasets);

// Live values returned by the APIs on 2026-08-18.
const LIVE_REGISTER_TOTAL = 170151;
const LIVE_CATALOGUE_TOTAL = 31915;

describe('headline-stats fetchers', () => {
  it('returns the live NZOR total when the API answers', async () => {
    searchNzorNamesMock.mockResolvedValue({ total: LIVE_REGISTER_TOTAL, names: [] });
    await expect(fetchRegisterTotal()).resolves.toBe(LIVE_REGISTER_TOTAL);
  });

  it('falls back to the pinned register total when the API fails', async () => {
    searchNzorNamesMock.mockRejectedValue(new Error('down'));
    await expect(fetchRegisterTotal()).resolves.toBe(REGISTER_TOTAL_FALLBACK);
  });

  it('returns the live catalogue count when the API answers', async () => {
    searchDataGovtNzDatasetsMock.mockResolvedValue({ count: LIVE_CATALOGUE_TOTAL, datasets: [] });
    await expect(fetchCatalogueTotal()).resolves.toBe(LIVE_CATALOGUE_TOTAL);
  });

  it('falls back to the pinned catalogue total when the API fails', async () => {
    searchDataGovtNzDatasetsMock.mockRejectedValue(new Error('down'));
    await expect(fetchCatalogueTotal()).resolves.toBe(CATALOGUE_TOTAL_FALLBACK);
  });
});
