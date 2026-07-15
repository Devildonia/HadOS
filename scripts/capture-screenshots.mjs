/**
 * Capture README screenshots of the desktop in both themes.
 * Usage: node scripts/capture-screenshots.mjs   (expects dev server on SHOT_URL)
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
import path from 'path';

const BASE = process.env.SHOT_URL || 'http://localhost:4173';
const OUT = path.resolve('docs/screenshots');
mkdirSync(OUT, { recursive: true });

async function bootReady(page) {
    await page.waitForFunction(() => {
        const boot = document.getElementById('boot-screen');
        const desk = document.getElementById('desktop');
        const bootHidden = !boot || getComputedStyle(boot).display === 'none' || boot.offsetParent === null;
        const deskVisible = desk && desk.offsetParent !== null;
        return bootHidden && deskVisible;
    }, { timeout: 25000 });
    await page.waitForTimeout(2800); // let shaders / icon swap / animations settle
}

async function setTheme(page, theme) {
    await page.evaluate((t) => localStorage.setItem('os-theme', t), theme);
}

(async () => {
    const browser = await chromium.launch({
        args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']
    });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    // Initial load to gain same-origin access to localStorage
    await page.goto(BASE);
    await bootReady(page);

    // --- Classic Win95 desktop ---
    await setTheme(page, 'win95');
    await page.reload();
    await bootReady(page);
    await page.screenshot({ path: path.join(OUT, 'desktop-win95.png') });
    console.log('captured desktop-win95.png');

    // --- Classic Win95 Start Menu open ---
    await page.click('#start-button');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT, 'start-menu-win95.png') });
    console.log('captured start-menu-win95.png');
    await page.keyboard.press('Escape').catch(() => {});
    await page.mouse.click(760, 420).catch(() => {});
    await page.waitForTimeout(300);

    // --- Showcase: Task Manager + MS-DOS Prompt windows ---
    await page.dblclick('#icon-taskmanager').catch(() => {});
    await page.waitForTimeout(900);
    await page.dblclick('#icon-terminal').catch(() => {});
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, 'apps-win95.png') });
    console.log('captured apps-win95.png');

    // --- Modern (Windows UI) desktop ---
    await setTheme(page, 'modern');
    await page.reload();
    await bootReady(page);
    await page.screenshot({ path: path.join(OUT, 'desktop-modern.png') });
    console.log('captured desktop-modern.png');

    await browser.close();
    console.log('ALL DONE');
})().catch((e) => { console.error(e); process.exit(1); });
