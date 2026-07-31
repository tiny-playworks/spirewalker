import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: {
    command: 'pnpm e2e:serve',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: [/responsiveSmoke\.spec\.ts/, /mobilePortrait\.spec\.ts/],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile-landscape',
      testMatch: /responsiveSmoke\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 844, height: 390 },
        screen: { width: 844, height: 390 },
      },
    },
    {
      name: 'mobile-portrait',
      testMatch: /mobilePortrait\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
        screen: { width: 390, height: 844 },
      },
    },
  ],
});
