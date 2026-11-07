import { defineConfig, devices } from '@playwright/test'

/**
 * Read-only smoke tests. Point BASE_URL at any deployment, e.g.
 * `BASE_URL=https://freq-nine.vercel.app npm run test:smoke`. Defaults to the
 * local dev server (start it first with `npm run dev`).
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3001',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
