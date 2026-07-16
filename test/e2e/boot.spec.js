import { test, expect } from '@playwright/test';

test.describe('OS Boot Sequence', () => {

    test('should boot successfully and reach the desktop', async ({ page }) => {
        // Go to the main page
        await page.goto('/');

        // 1. Check BIOS boot screen is visible
        const bootScreen = page.locator('#boot-screen');
        await expect(bootScreen).toBeVisible();

        // 2. Wait for the BIOS to disappear — which hands over to the splash, not
        //    to the desktop.
        await expect(bootScreen).toBeHidden({ timeout: 15000 });

        // 3. Desktop should be visible. The splash holds for at least 4s after the
        //    BIOS goes, so this needs a real timeout rather than the default 5s —
        //    otherwise it is a coin flip under parallel load.
        const desktop = page.locator('#desktop');
        await expect(desktop).toBeVisible({ timeout: 15000 });

        // 4. Ensure Start button is visible
        const startBtn = page.locator('#start-button');
        await expect(startBtn).toBeVisible();
    });

    test('should open the Start menu on click', async ({ page }) => {
        await page.goto('/');

        // Wait for boot to finish
        await expect(page.locator('#boot-screen')).toBeHidden({ timeout: 15000 });

        const startBtn = page.locator('#start-button');
        const startMenu = page.locator('#start-menu');

        // Menu starts hidden
        await expect(startMenu).toBeHidden();

        // Click the Start button
        await startBtn.click();

        // Menu should now be visible
        await expect(startMenu).toBeVisible();
    });
});
