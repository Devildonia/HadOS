const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for the app to be available and click the icon
    await page.waitForSelector('.desktop-icon[data-app="ragdoll-3d"]');
    await page.click('.desktop-icon[data-app="ragdoll-3d"]');
    
    // Wait for the animation list to populate
    await page.waitForSelector('#animation-list button');
    
    // Get all button texts
    const buttons = await page.$$eval('#animation-list button', btns => btns.map(b => b.textContent));
    console.log('--- ANIMATION BUTTONS ---');
    buttons.forEach(b => console.log(b));
    console.log('-------------------------');
    
    await browser.close();
})();
