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
    '.hados-window', '.window-header', '.window-header span', '.window-controls',
    '.window-btn', '.window-body', '.window-resize-handle',
    '.hados-btn', '#splash-screen', '.splash-title', '.splash-progress', '.splash-progress-bar',
    // Tray buttons and the in-app menu bar: both are served by selectors that are
    // declared in three partials each, so they are the ones a consolidation can
    // most easily change by accident.
    '#system-tray', '#clock', '#ragdollToggle', '#hdr-toggle', '.ragdoll-text',
    '.window-menu', '.window-menu .window-menu-item',
    // Paint's tool squares: 24x24 icon buttons that have to escape the OS-wide
    // button rules. Nothing covered them before, which is why their !important
    // could not be touched.
    '.paint-tool-btn', '.paint-toolbar',
];

/**
 * Interactive states. Rest styles alone would miss a consolidation that gets
 * :hover or :active wrong, and those are exactly where the duplicated blocks
 * disagree with each other (#d4d4d4 vs #d0d0d0, and so on).
 */
const HOVER_TARGETS = [
    '#ragdollToggle', '#hdr-toggle', '#start-menu .menu-item', '.window-menu .window-menu-item',
];

/** Freezes everything that moves, so measurements are reproducible. */
async function settle(page) {
    await expect(page.locator('#boot-screen')).toBeHidden({ timeout: BOOT_TIMEOUT });
    // The BIOS hiding does not mean the desktop is up — the splash sits between
    // them for at least 4s (SPLASH_MIN_MS), longer if the OS is slow to report
    // ready. The default 5s expect timeout was just barely enough, and lost the
    // race under parallel load.
    await expect(page.locator('#desktop')).toBeVisible({ timeout: BOOT_TIMEOUT });

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
            /* The shader wallpaper is the only thing still moving: the physics pet
               is a canvas that only mounts when ragdollPetActive is set, which a
               fresh test profile never has. Note #ragdoll-container is NOT the pet
               — it wraps the tray button, and hiding it makes that button
               unhoverable. */
            #shader-wallpaper, #ragdoll-canvas, #ragdoll-3d-canvas { visibility: hidden !important; }
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

    test('interactive states are unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        // Paint carries the in-app menu bar (.window-menu > .menu-item spans);
        // Notepad's bar uses its own markup, so it would not cover this.
        await page.locator('#icon-paint').dblclick();
        await expect(page.locator('#win-paint')).toBeVisible();

        const hovered = [];
        const capture = async (sel) => {
            const el = page.locator(sel).first();
            if (!(await el.count())) { hovered.push(`${sel} :hover\n  <absent>`); return; }
            await el.hover();
            const styles = await computedStyles(page, [sel], TRACKED_PROPS);
            hovered.push(styles.replace(sel, `${sel} :hover`));
        };

        // Tray buttons and the app menu bar first: the Start menu sits at z-index
        // 10000 and would cover them, so hovering would never land.
        await capture('#ragdollToggle');
        await capture('#hdr-toggle');
        await capture('.window-menu .window-menu-item');

        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        const rest = await computedStyles(page, TRACKED_SELECTORS, TRACKED_PROPS);
        expect.soft(rest).toMatchSnapshot('states-rest.txt');

        await capture('#start-menu .menu-item');
        expect.soft(hovered.join('\n\n')).toMatchSnapshot('states-hover.txt');

        // Class-driven states. .active is applied persistently by the toggles and
        // is styled by rules that :hover never exercises, so without this a
        // consolidation could quietly drop it.
        const classStates = await page.evaluate((props) => {
            const out = [];
            for (const [sel, cls] of [['#ragdollToggle', 'active'], ['#ragdollToggle', 'disabled'], ['#hdr-toggle', 'active']]) {
                const el = document.querySelector(sel);
                if (!el) { out.push(`${sel}.${cls}\n  <absent>`); continue; }
                el.classList.add(cls);
                const cs = getComputedStyle(el);
                out.push(`${sel}.${cls}\n` + props.map(p => `  ${p}: ${cs.getPropertyValue(p)}`).join('\n'));
                el.classList.remove(cls);
            }
            return out.join('\n\n');
        }, TRACKED_PROPS);
        expect.soft(classStates).toMatchSnapshot('states-class.txt');
    });

    /**
     * Mobile. responsive.css and touch.css only exist below 768px, so a desktop
     * viewport measures none of them — and several `!important`s in the app
     * partials are there specifically to out-rank those media queries. Without
     * this, removing one would look perfectly safe and break only on phones.
     */
    test('computed styles are unchanged at a phone viewport', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await settle(page);

        const mobileSelectors = [
            ...TRACKED_SELECTORS,
            // Game windows are built by WindowRegistry at boot, so they are in the
            // DOM (hidden) without opening one. Their bodies carry the overrides
            // that fight the mobile rules.
            '#win-flappy-neon', '#win-flappy-neon .window-body',
            '#win-football-rush', '#win-football-rush .window-body',
            '.ragdoll-pet-btn', '.taskbar-button', '.icon',
            // The mobile icon sizes are the only thing responsive.css's !important
            // guards; without these two the removal would look free.
            '#icon-mycomputer .icon-box', '.main-app .icon-box',
        ];
        expect(await computedStyles(page, mobileSelectors, TRACKED_PROPS))
            .toMatchSnapshot('computed-mobile.txt');
    });

    /**
     * The wallpaper's blues used to be hand-copied GLSL literals duplicating the
     * theme's CSS tokens, with nothing to catch them drifting apart. They are now
     * injected from those tokens at compile time; this proves the wiring by
     * moving a token and watching the pixels follow.
     */
    test('the wallpaper takes its palette from the theme tokens', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        const sample = await page.evaluate(async () => {
            const { buildHadosShader, readShaderPalette, hexToVec3 } = await import('/js/ui/ThemeShaders.ts');

            const render = (src) => {
                const c = document.createElement('canvas');
                c.width = 120; c.height = 90;
                const gl = c.getContext('webgl', { preserveDrawingBuffer: true });
                const vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }');
                gl.compileShader(vs);
                const fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, src);
                gl.compileShader(fs);
                if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return { error: gl.getShaderInfoLog(fs) };
                const pr = gl.createProgram();
                gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr); gl.useProgram(pr);
                const b = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, b);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
                const loc = gl.getAttribLocation(pr, 'p');
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
                gl.uniform2f(gl.getUniformLocation(pr, 'iResolution'), 120, 90);
                gl.uniform1f(gl.getUniformLocation(pr, 'iTime'), 0);
                gl.viewport(0, 0, 120, 90);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                const px = new Uint8Array(4);
                // Dead centre: the crossbar of the mark.
                gl.readPixels(60, 45, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
                return { mark: [px[0], px[1], px[2]] };
            };

            const shipped = render(buildHadosShader());
            // Swap the token the way a theme edit would, and rebuild.
            document.body.style.setProperty('--hados-blue', '#e03b3b');
            const recoloured = render(buildHadosShader(readShaderPalette()));
            document.body.style.removeProperty('--hados-blue');

            return {
                hexParsing: hexToVec3('#0b5ed7'),
                rejectsGarbage: hexToVec3('not-a-colour'),
                shipped,
                recoloured,
            };
        });

        expect(sample.hexParsing).toBe('vec3(0.0431, 0.3686, 0.8431)');
        expect(sample.rejectsGarbage).toBeNull();

        // Shipped palette: the mark is blue.
        expect(sample.shipped.error).toBeUndefined();
        expect(sample.shipped.mark[2]).toBeGreaterThan(sample.shipped.mark[0] + 40);

        // Token moved to red: the mark follows. Asserted as a shift rather than an
        // absolute colour — the surface mixes three blues with a specular, so
        // moving one token tints the result, it does not repaint it.
        expect(sample.recoloured.error).toBeUndefined();
        expect(sample.recoloured.mark[0]).toBeGreaterThan(sample.shipped.mark[0] + 30);
        expect(sample.recoloured.mark[2]).toBeLessThan(sample.shipped.mark[2]);
    });

    test('the desktop looks unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        // Mask the taskbar clock: it shows HH:MM and ticks each minute, so a run
        // that crosses a minute boundary from when the baseline was captured
        // differs by ~750px — a latent flake unrelated to any change under test.
        await expect(page).toHaveScreenshot('desktop-hados.png', {
            mask: [page.locator('#taskbar-clock')],
        });
    });

    test('the in-app menu bar looks unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        // Paint is the only app with a .window-menu bar, and no other screenshot
        // covers it — which is exactly how a change there would slip through.
        await page.locator('#icon-paint').dblclick();
        await expect(page.locator('#win-paint')).toBeVisible();

        await expect(page.locator('#win-paint .window-menu')).toHaveScreenshot('window-menu-bar-hados.png');
    });

    test('the start menu and a window look unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        await page.locator('#icon-notepad').dblclick();
        await expect(page.locator('#win-notepad')).toBeVisible();
        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        await expect(page).toHaveScreenshot('start-menu-and-window-hados.png', {
            mask: [page.locator('#taskbar-clock')],
        });
    });
});
