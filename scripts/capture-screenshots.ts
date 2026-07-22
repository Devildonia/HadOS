/**
 * Captures the README screenshots (and the hero video for the GIF) against a
 * RUNNING dev server on http://localhost:3000.
 *
 *   npx tsx scripts/capture-screenshots.ts            # stills → docs/screenshots/
 *   npx tsx scripts/capture-screenshots.ts --gif      # hero video → scratch (convert with ffmpeg)
 *
 * Why a script and not a spec: these are marketing shots, not assertions — no
 * snapshots to compare, and we WANT the animated wallpaper, not the frozen one
 * the css-baseline uses.
 */
import { chromium } from '@playwright/test';
import type { Page, Browser } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:3000';
const OUT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');
const BOOT_TIMEOUT = 30000;

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Boots the OS and waits until the desktop is actually interactive. */
async function boot(page: Page): Promise<void> {
    await page.goto(BASE_URL);
    await page.locator('#boot-screen').waitFor({ state: 'hidden', timeout: BOOT_TIMEOUT });
    // The splash sits between the BIOS and the desktop for ≥4s (see known-issues) —
    // the desktop reaches opacity 1 BEHIND it, so wait for the splash explicitly.
    await page.locator('#splash-screen').waitFor({ state: 'hidden', timeout: BOOT_TIMEOUT });
    await page.locator('#desktop').waitFor({ state: 'visible', timeout: BOOT_TIMEOUT });
    await page.waitForFunction(() => {
        const d = document.getElementById('desktop');
        return d !== null && getComputedStyle(d).opacity === '1';
    }, null, { timeout: BOOT_TIMEOUT });
    // Let the shader wallpaper render a few frames.
    await wait(2500);
}

/** Positions a window by inline style — the same mechanism the WM itself uses. */
async function placeWindow(page: Page, windowId: string, x: number, y: number, w?: number, h?: number): Promise<void> {
    await page.evaluate(({ windowId, x, y, w, h }) => {
        const el = document.getElementById(windowId);
        if (!el) return;
        el.style.transform = 'none'; // windows spawn with a centering transform — clear it like the WM does
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        if (w) el.style.width = `${w}px`;
        if (h) el.style.height = `${h}px`;
    }, { windowId, x, y, w, h });
}

/** Returns the id of the most recently opened visible window. */
async function lastWindowId(page: Page): Promise<string> {
    return page.evaluate(() => {
        const wins = [...document.querySelectorAll<HTMLElement>('.hados-window')]
            .filter(el => el.style.display !== 'none');
        return wins.length ? wins[wins.length - 1].id : '';
    });
}

async function closeAllWindows(page: Page): Promise<void> {
    await page.evaluate(() => {
        document.querySelectorAll<HTMLElement>('.hados-window .window-btn.close-btn')
            .forEach(btn => btn.click());
    });
    await wait(600);
}

async function shot(page: Page, name: string): Promise<void> {
    const file = path.join(OUT_DIR, name);
    await page.screenshot({ path: file });
    console.log(`  📸 ${name}`);
}

async function captureStills(browser: Browser, only: string[]): Promise<void> {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const want = (step: string) => only.length === 0 || only.includes(step);

    // ---- HadOS theme session ----
    // en-US: the README is in English, so the shots should be too.
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, locale: 'en-US' });
    const hadosSteps = ['desktop', 'startmenu', 'thispc', 'system', 'media', 'ragdoll', 'games'];
    if (hadosSteps.some(want)) {
        await boot(page);
    }

    // 1. Clean desktop
    if (want('desktop')) await shot(page, 'desktop-hados.png');

    // 2. Start menu
    if (want('startmenu')) {
        await page.click('#start-button');
        await page.locator('#start-menu').waitFor({ state: 'visible' });
        await wait(400);
        await shot(page, 'start-menu.png');
        await page.keyboard.press('Escape');
        await page.mouse.click(1400, 200); // make sure it closed
        await wait(400);
    }

    // 3. This PC explorer
    if (want('thispc')) {
        await page.dblclick('#icon-mycomputer');
        await wait(1200); // storage.estimate() + render
        const explorerId = await lastWindowId(page);
        if (explorerId) await placeWindow(page, explorerId, 380, 150);
        await wait(300);
        await shot(page, 'explorer-thispc.png');
        await closeAllWindows(page);
    }

    // 4. Task Manager + Terminal
    if (want('system')) {
        await page.dblclick('#icon-taskmanager');
        await wait(900);
        const tmId = await lastWindowId(page);
        await page.dblclick('#icon-terminal');
        await wait(900);
        const termId = await lastWindowId(page);
        if (tmId) await placeWindow(page, tmId, 120, 120);
        if (termId && termId !== tmId) await placeWindow(page, termId, 780, 260);
        await wait(400);
        await shot(page, 'apps-system.png');
        await closeAllWindows(page);
    }

    // 5. Media Player (YouTube postMessage embed) + Hacker News Scout (live feed)
    if (want('media')) {
        await page.dblclick('#icon-mediaplayer');
        await wait(900);
        const mpId = await lastWindowId(page);
        await page.fill('#mediaplayer-yt-input', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        await page.click('#mediaplayer-yt-btn');
        await wait(2500); // embed + noembed title
        await page.dblclick('#icon-hnscout');
        await wait(2500); // live firebase fetch
        const hnId = await lastWindowId(page);
        if (mpId) await placeWindow(page, mpId, 90, 110);
        if (hnId && hnId !== mpId) await placeWindow(page, hnId, 830, 240);
        await wait(400);
        await shot(page, 'apps-media.png');
        await closeAllWindows(page);
    }

    // 6. 3D ragdoll
    if (want('ragdoll')) {
        await page.click('#ragdollToggle');
        await page.click('#spawn-ragdoll-3d');
        await wait(5000); // Rapier world + model + a few AI steps
        await shot(page, 'ragdoll-3d.png');
        await page.click('#ragdollToggle');
        const spawn3d = page.locator('#spawn-ragdoll-3d');
        if (await spawn3d.isVisible()) await spawn3d.click(); // toggle back off
        await wait(800);
    }

    // 7. Games arcade — through the unified explorer (Games icon → FileX at C:\GAMES)
    if (want('games')) {
        await page.dblclick('#icon-games-folder');
        await wait(1200); // FileX opens at C:\GAMES
        const gameIcon = page.locator('.explorer-icon', { hasText: /chapas/i }).first();
        if (await gameIcon.isVisible()) {
            await gameIcon.dblclick();
            await wait(1200);
            // The game folder window holds the exe icon
            const exe = page.locator('#icon-chapas-exe');
            if (await exe.isVisible()) {
                await exe.dblclick();
                await wait(7000); // sandboxed iframe + Three.js boot
                await shot(page, 'games-arcade.png');
            } else {
                console.warn('  ⚠️ #icon-chapas-exe not visible — skipping games-arcade.png');
            }
        } else {
            console.warn('  ⚠️ Chapas not found in the C:\\GAMES grid — skipping games-arcade.png');
        }
        await closeAllWindows(page);
    }
    await page.close();

    // ---- Modern theme session ----
    if (want('modern')) {
        const page2 = await browser.newPage({ viewport: { width: 1600, height: 900 }, locale: 'en-US' });
        await page2.addInitScript(() => localStorage.setItem('os-theme', 'modern'));
        await boot(page2);
        await shot(page2, 'desktop-modern.png');
        await page2.close();
    }
}

async function captureHeroVideo(browser: Browser): Promise<void> {
    const videoDir = path.resolve(__dirname, '..', '.hero-video');
    fs.mkdirSync(videoDir, { recursive: true });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
        recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } },
    });
    const page = await context.newPage();
    await boot(page);
    await wait(1000);

    // Beat 1 — start menu open/close
    await page.click('#start-button');
    await wait(1400);
    await page.keyboard.press('Escape');
    await page.mouse.click(1100, 200);
    await wait(600);

    // Beat 2 — drag the taskbar to the left edge (magnetic snap), then back.
    // Self-verifying: read data-edge after each drag and log it, so a bad take
    // is visible in stdout instead of only in the rendered GIF.
    const readEdge = () => page.evaluate(() => document.getElementById('taskbar')?.dataset.edge || '(none)');
    const dragBarTo = async (endX: number, endY: number) => {
        const b = await page.locator('#taskbar').boundingBox();
        if (!b) return;
        // grab an empty zone: 60px in along the bar's long axis
        const horizontal = b.width >= b.height;
        const gx = horizontal ? b.x + 60 : b.x + b.width / 2;
        const gy = horizontal ? b.y + b.height / 2 : b.y + 60;
        await page.mouse.move(gx, gy);
        await page.mouse.down();
        await page.mouse.move((gx + endX) / 2, (gy + endY) / 2, { steps: 20 });
        await page.mouse.move(endX, endY, { steps: 20 });
        await page.mouse.up();
    };
    await dragBarTo(30, 400); // → left
    await wait(1500);
    console.log('  edge after drag #1 (want left):', await readEdge());
    await dragBarTo(640, 700); // → bottom
    await wait(1000);
    let edge = await readEdge();
    console.log('  edge after drag #2 (want bottom):', edge);
    if (edge !== 'bottom') { // one retry — the GIF must end on a docked-bottom bar
        await dragBarTo(640, 710);
        await wait(1000);
        edge = await readEdge();
        console.log('  edge after retry (want bottom):', edge);
    }
    await wait(800);

    // Beat 3 — spawn the 3D ragdoll and toss it around
    await page.click('#ragdollToggle');
    // After the taskbar round-trip the popup can sit off-viewport at 720p —
    // dispatch the click directly instead of failing Playwright's hit test.
    await page.evaluate(() => (document.getElementById('spawn-ragdoll-3d') as HTMLElement | null)?.click());
    await wait(4500);
    console.log('  ragdoll container visible:', await page.evaluate(() => {
        const c = document.getElementById('ragdoll3d-desktop-canvas-container');
        return c ? getComputedStyle(c).display !== 'none' : false;
    }));
    // Try to grab it: sweep the lower-center area where it spawns/wanders.
    await page.mouse.move(640, 500);
    await page.mouse.down();
    await page.mouse.move(400, 300, { steps: 20 });
    await page.mouse.move(900, 350, { steps: 25 });
    await page.mouse.move(640, 520, { steps: 20 });
    await page.mouse.up();
    await wait(2500);

    await page.close();
    await context.close();
    const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
    console.log(`  🎬 video saved: ${files.map(f => path.join(videoDir, f)).join(', ')}`);
}

async function main(): Promise<void> {
    const gif = process.argv.includes('--gif');
    const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
    const browser = await chromium.launch({ headless: true });
    try {
        if (gif) {
            console.log('Recording hero video…');
            await captureHeroVideo(browser);
        } else {
            console.log(`Capturing stills${only.length ? ` (${only.join(', ')})` : ''}…`);
            await captureStills(browser, only);
        }
    } finally {
        await browser.close();
    }
}

main().catch(err => { console.error(err); process.exit(1); });
