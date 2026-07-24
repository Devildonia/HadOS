import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './test/e2e',
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
        toHaveScreenshot: {
            maxDiffPixels: 250,
            maxDiffPixelRatio: 0.02,
            threshold: 0.2,
        }
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    // Capped deliberately. Every spec boots the whole OS, and each page brings up
    // a WebGL shader wallpaper plus a physics pet; at Playwright's default (half
    // the CPU count — 12 here) the concurrent contexts starve each other and the
    // boot itself times out, failing specs that have nothing to do with the
    // change under test. Two is comfortably under the cliff.
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
    },
});
