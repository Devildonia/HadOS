import { test, expect } from '@playwright/test';

/**
 * CSS BASELINE — the safety net for refactoring the stylesheets.
 *
 * The unit suite never evaluates CSS: jsdom does not load external stylesheets,
 * so style.css could be deleted outright and 704 tests would still pass. This
 * spec is the only thing standing between a stylesheet refactor and a silently
 * broken desktop.
 *
 * It pins three levels, cheapest and most exact first:
 *
 *   1. CSSOM fingerprint — every rule the browser actually parsed, in cascade
 *      order. If the same rules land in the same order with the same
 *      declarations, rendering is identical by construction. This catches a
 *      dropped @import, a 404'd partial, or a reordering that changes which
 *      duplicate selector wins.
 *   2. Computed styles — what those rules resolve to on the real components.
 *      Guards against anything the rule dump cannot see, e.g. @media evaluation.
 *   3. Screenshots — the human-visible check of last resort.
 *
 * Determinism: the wallpaper shader animates and the pet moves, so both are
 * hidden before measuring. Nothing else in the chrome is time-dependent.
 */

const BOOT_TIMEOUT = 20000;

/** Properties a stylesheet refactor could plausibly break. */
const TRACKED_PROPS = [
    'display', 'position', 'z-index', 'overflow', 'visibility', 'opacity',
    'width', 'height', 'min-height', 'max-height', 'padding', 'margin',
    'top', 'left', 'right', 'bottom',
    'color', 'background-color', 'background-image',
    'border-width', 'border-style', 'border-color', 'border-radius',
    'box-shadow', 'outline',
    'font-family', 'font-size', 'font-weight', 'letter-spacing', 'line-height',
    'text-align', 'text-transform', 'text-shadow', 'white-space',
    'flex-direction', 'justify-content', 'align-items', 'gap', 'flex',
    'transform', 'transition', 'animation-name', 'backdrop-filter', 'cursor',
];

/**
 * One representative of every chrome surface. A fixed list rather than a DOM
 * walk: the walk would drag in JS-positioned, randomised elements and flake.
 */
const TRACKED_SELECTORS = [
    'body', '#desktop',
    '#taskbar', '#taskbar-apps', '#start-button', '#start-button .start-text',
    '#start-menu-btn-icon', '#start-menu-btn-icon img',
    '#start-menu', '.start-sidebar', '.menu-items-container',
    '#start-menu .menu-item', '#start-menu .menu-separator', '#start-menu .submenu',
    '#system-icons', '#icon-mycomputer', '#icon-mycomputer .icon-box', '#icon-mycomputer span',
    '.win95-window', '.window-header', '.window-header span', '.window-controls',
    '.window-btn', '.window-body', '.window-resize-handle',
    '.win95-btn', '#splash-screen', '.splash-title', '.splash-progress', '.splash-progress-bar',
];

/** Freezes everything that moves, so measurements are reproducible. */
async function settle(page) {
    await expect(page.locator('#boot-screen')).toBeHidden({ timeout: BOOT_TIMEOUT });
    await expect(page.locator('#desktop')).toBeVisible();

    // toBeVisible() resolves the moment the desktop is displayed, but it then
    // fades in over 1s (#desktop has opacity:0 + a transition). Measuring on that
    // ramp reads back a random opacity, so wait for the animation to actually
    // land rather than sleeping and hoping.
    await page.waitForFunction(() => {
        const d = document.getElementById('desktop');
        return d !== null && getComputedStyle(d).opacity === '1';
    }, null, { timeout: BOOT_TIMEOUT });

    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
            /* The shader wallpaper and the pet are the only moving parts left. */
            #shader-wallpaper, #ragdoll-container, #ragdoll-3d-container { visibility: hidden !important; }
        `,
    });
    // One frame for the freeze to take effect.
    await page.evaluate(() => new Promise(requestAnimationFrame));
}

/** Serialises every parsed rule in cascade order. Same-origin sheets only. */
async function cssomFingerprint(page) {
    return page.evaluate(() => {
        const lines = [];
        const walk = (rules, sheetName, depth) => {
            for (const rule of rules) {
                const pad = '  '.repeat(depth);
                if (rule.media) {
                    lines.push(`${pad}@media ${rule.conditionText || rule.media.mediaText} {`);
                    walk(rule.cssRules, sheetName, depth + 1);
                    lines.push(`${pad}}`);
                } else if (rule.selectorText) {
                    // style.cssText normalises shorthands, so this is stable across
                    // formatting changes but sensitive to real declaration changes.
                    lines.push(`${pad}${rule.selectorText} { ${rule.style.cssText} }`);
                } else if (rule.cssText) {
                    lines.push(`${pad}${rule.cssText.replace(/\s+/g, ' ').trim()}`);
                }
            }
        };
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue; // cross-origin, not ours
            }
            // The sheet's own URL is irrelevant to the cascade and changes when
            // files are split; only its content and position matter.
            walk(rules, '', 0);
        }
        return lines.join('\n');
    });
}

async function computedStyles(page, selectors, props) {
    return page.evaluate(({ selectors, props }) => {
        const out = [];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (!el) { out.push(`${sel}\n  <absent>`); continue; }
            const cs = getComputedStyle(el);
            const decls = props.map(p => `  ${p}: ${cs.getPropertyValue(p)}`);
            out.push(`${sel}\n${decls.join('\n')}`);
        }
        return out.join('\n\n');
    }, { selectors, props });
}

test.describe('CSS baseline', () => {

    test('CSSOM fingerprint is unchanged (hados theme)', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        expect(await cssomFingerprint(page)).toMatchSnapshot('cssom-hados.txt');
    });

    test('CSSOM fingerprint is unchanged (modern theme)', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'modern'));
        await page.goto('/');
        await settle(page);

        expect(await cssomFingerprint(page)).toMatchSnapshot('cssom-modern.txt');
    });

    test('computed styles are unchanged, chrome and an open window', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        // Bring the surfaces that are hidden at rest into the DOM: a window, the
        // Start menu and its flyout.
        await page.locator('#icon-notepad').dblclick();
        await expect(page.locator('#win-notepad')).toBeVisible();
        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        // The Programs flyout is a CSS :hover, so it needs a real pointer. Waiting
        // on the flyout itself — not a fixed delay — is what makes this stable.
        await page.locator('#start-menu .menu-item.has-submenu').first().hover();
        await expect(page.locator('#start-menu .submenu').first()).toBeVisible();

        const styles = await computedStyles(page, TRACKED_SELECTORS, TRACKED_PROPS);
        expect(styles).toMatchSnapshot('computed-hados.txt');
    });

    test('computed styles are unchanged (modern theme)', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'modern'));
        await page.goto('/');
        await settle(page);

        await page.locator('#icon-notepad').dblclick();
        await expect(page.locator('#win-notepad')).toBeVisible();
        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        const styles = await computedStyles(page, TRACKED_SELECTORS, TRACKED_PROPS);
        expect(styles).toMatchSnapshot('computed-modern.txt');
    });

    test('the desktop looks unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        await expect(page).toHaveScreenshot('desktop-hados.png');
    });

    test('the start menu and a window look unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        await page.locator('#icon-notepad').dblclick();
        await expect(page.locator('#win-notepad')).toBeVisible();
        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        await expect(page).toHaveScreenshot('start-menu-and-window-hados.png');
    });
});
