import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('@critical renders the landing page with microsite cards', async ({ page }) => {
    // Relative URL (no leading slash) so it resolves against the baseURL path
    // (the GitHub Pages deploy serves the site under /<repo>/).
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /read the story/i })).toHaveCount(7);
  });

  test('@critical opens a microsite story from its card', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: /dairy takeover/i }).click();
    await expect(page.getByRole('img', { name: /livestock numbers/i })).toBeVisible();
    await expect(page.getByText('Sources and further reading')).toBeVisible();
  });

  test('@critical no a11y violations on the landing page', async ({ page }) => {
    await page.goto('./');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('@smoke shows a plausible live sheep count', async ({ page }) => {
    await page.goto('./microsites/sheep-index');
    const latest = await page.getAttribute('[data-testid="sheep-latest"]', 'data-value');
    expect(latest).not.toBeNull();
    const sheep = Number(latest);
    expect(Number.isFinite(sheep)).toBe(true);
    expect(sheep).toBeGreaterThan(20000000);
    expect(sheep).toBeLessThan(27000000);
  });

  test('@smoke shows plausible dairy and wine numbers', async ({ page }) => {
    await page.goto('./microsites/dairy-takeover');
    const dairy = await page.getAttribute('[data-testid="dairy-latest"]', 'data-value');
    expect(Number(dairy)).toBeGreaterThan(5000000);
    expect(Number(dairy)).toBeLessThan(7000000);
    await page.goto('./microsites/vineyard-boom');
    const wine = await page.getAttribute('[data-testid="wine-latest"]', 'data-value');
    expect(Number(wine)).toBeGreaterThan(30000);
    expect(Number(wine)).toBeLessThan(45000);
  });
});
