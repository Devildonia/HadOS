import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e',
    timeout: 60 * 1000,
    expect: {
        timeout: 10000,
        toHaveScreenshot: {
            maxDiffPixels: 5000,
            maxDiffPixelRatio: 0.15,
            threshold: 0.3,
        }
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 2,
    reporter: 'html',
    use: {
        actionTimeout: 0,
        baseURL: 'http://127.0.0.1:4173',
        trace: 'on-first-retry',
        viewport: { width: 1280, height: 720 },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
    webServer: {
        command: 'npm run dev -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
