import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, retries: 0, timeout: 45000,
  reporter: 'line', forbidOnly: !!process.env.CI,
  use: { baseURL: 'http://127.0.0.1:4312', trace: 'off', screenshot: 'off', video: 'off' },
  webServer: { command: 'node scripts/serve-test-dist.js', url: 'http://127.0.0.1:4312', reuseExistingServer: false },
});
