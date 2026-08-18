import { defineConfig } from '@playwright/test';

const CI = !!process.env.CI;
// Normalized to end with "/" so relative page.goto() URLs resolve against the
// baseURL path (the site may be served under a base path rather than at the
// origin root).
const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3000').replace(/\/?$/, '/');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 4 : undefined,
  reporter: CI ? 'github' : 'html',
  snapshotDir: './e2e/__snapshots__',
  timeout: 60_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 812 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Mobile',
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'laptop',
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  webServer: {
    // CI serves the static export (the workflow builds first); local dev
    // uses the dev server. The repo is npm-only, so no pnpm.
    command: CI ? 'npx serve out -l 3000' : 'npm run dev',
    port: 3000,
    reuseExistingServer: !CI,
  },
});
