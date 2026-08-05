import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx pnpm dev',
    url: `${baseURL}/en/portfolios/minimalist`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
