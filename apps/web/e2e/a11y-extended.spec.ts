import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('extended a11y coverage', () => {
  test('@a11y report dialog opens, passes axe, and returns focus to the trigger on close', async ({
    page,
  }) => {
    await page.goto('./');
    const trigger = page.getByRole('button', { name: 'Report an issue' });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: 'Report an issue' });
    await expect(dialog).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('@a11y no axe violations on the 404 route', async ({ page }) => {
    await page.goto('./this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('@a11y no axe violations on the error route', async ({ page }) => {
    // The root error boundary only renders when a page throws at runtime. In
    // the static export served by CI there is no server to throw, so force a
    // 500 on the document request to surface the error page.
    await page.route('**/agriculture/sheep-index/', (route) =>
      route.fulfill({ status: 500, body: '' }),
    );
    await page.goto('./agriculture/sheep-index');
    await expect(page.getByRole('heading', { name: 'An unexpected error occurred' })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('@a11y waits for live-search content before running axe', async ({ page }) => {
    await page.goto('./biodiversity/species-register');
    await expect(page.getByText(/names match "kiwi"/i)).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('@a11y keyboard-only tab-through shows visible focus and no trap', async ({ page }) => {
    await page.goto('./earthquakes/shake-index');
    await expect(page.getByRole('main')).toBeVisible();

    const focusedTags: string[] = [];
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      const active = await page.evaluate(() => {
        const element = document.activeElement;
        if (element === null || element === document.body) {
          return null;
        }
        const style = window.getComputedStyle(element);
        const hasVisibleFocus =
          style.outlineStyle !== 'none' &&
          style.outlineWidth !== '0px' &&
          style.outlineColor !== 'transparent';
        return { tag: element.tagName, hasVisibleFocus };
      });
      if (active !== null) {
        focusedTags.push(active.tag);
        expect(active.hasVisibleFocus).toBe(true);
      }
    }

    // The tab-through must not be trapped: it should reach the report button
    // (the last focusable element in the layout) and keep moving.
    expect(focusedTags.length).toBeGreaterThan(3);
    expect(focusedTags).toContain('BUTTON');
  });

  test('@a11y loading route announces to screen readers', async ({ page }) => {
    // Delay the RSC payload for a microsite so the streaming loading boundary
    // stays visible long enough to assert on it. Set up before navigating so
    // any prefetch is also delayed.
    await page.route('**/census/census-rank-shift/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });
    await page.goto('./');
    // Wait for the client-side router to be ready before clicking, otherwise
    // the click can race hydration and skip the loading boundary.
    await page.waitForLoadState('networkidle');
    await page.locator('a[href="/census/census-rank-shift/"]').click();

    const loading = page.getByRole('status');
    await expect(loading).toBeVisible();
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading).toContainText('Loading');

    // Content resolves once the delayed RSC payload arrives.
    await expect(page.getByRole('heading', { name: /Selwyn and Queenstown/i })).toBeVisible();
  });
});
