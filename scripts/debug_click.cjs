const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.text().includes('[Ragdoll3D]')) {
            console.log('CONSOLE:', msg.text());
        }
    });

    try {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('.desktop-icon[data-app="ragdoll-3d"]');
        await page.click('.desktop-icon[data-app="ragdoll-3d"]');
        
        // Wait for Ready
        await page.waitForFunction(() => {
            const status = document.getElementById('ragdoll-3d-status');
            return status && status.textContent.includes('Ready');
        }, { timeout: 10000 });

        console.log('App ready. Clicking canvas center...');

        const canvas = await page.waitForSelector('#ragdoll-3d-canvas-container canvas');
        const box = await canvas.boundingBox();
        
        // Click in the middle of the canvas
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        
        // Wait a bit to capture logs
        await page.waitForTimeout(2000);

    } catch (e) {
        console.error('Test failed:', e);
    } finally {
        await browser.close();
    }
})();
