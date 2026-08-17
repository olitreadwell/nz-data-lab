import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('sheep-index experiment', () => {
  test('@critical renders the sheep index with a chart', async ({ page }) => {
    await page.goto('/experiments/sheep-index');
    await expect(page.getByRole('heading', { level: 1, name: /sheep index/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /sheep numbers/i })).toBeVisible();
  });

  test('@critical no a11y violations on the sheep index', async ({ page }) => {
    await page.goto('/experiments/sheep-index');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('@smoke shows a plausible live sheep count', async ({ page }) => {
    await page.goto('/experiments/sheep-index');
    const latest = await page.getAttribute('[data-sheep-latest]', 'data-sheep-latest');
    expect(latest).not.toBeNull();
    const sheep = Number(latest);
    expect(Number.isFinite(sheep)).toBe(true);
    expect(sheep).toBeGreaterThan(20000000);
    expect(sheep).toBeLessThan(27000000);
  });
});
