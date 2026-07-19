import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * CSS BASELINE — the safety net for refactoring the stylesheets.
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
 * One representative of every chrome surface.
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
    '#system-tray', '#clock', '#ragdollToggle', '#hdr-toggle', '.ragdoll-text',
    '.window-menu', '.window-menu .window-menu-item',
    '.paint-tool-btn', '.paint-toolbar',
];

/** Freezes everything that moves, so measurements are reproducible. */
async function settle(page: Page): Promise<void> {
    await expect(page.locator('#boot-screen')).toBeHidden({ timeout: BOOT_TIMEOUT });
    await expect(page.locator('#desktop')).toBeVisible({ timeout: BOOT_TIMEOUT });

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
            #shader-wallpaper, #ragdoll-canvas, #ragdoll-3d-canvas { visibility: hidden !important; }
        `,
    });
    await page.evaluate(() => new Promise(requestAnimationFrame));
}

/** Serialises every parsed rule in cascade order. Same-origin sheets only. */
async function cssomFingerprint(page: Page): Promise<string> {
    return page.evaluate(() => {
        const lines: string[] = [];
        const walk = (rules: CSSRuleList, sheetName: string, depth: number) => {
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (!rule) continue;
                const pad = '  '.repeat(depth);
                if (rule instanceof CSSMediaRule) {
                    lines.push(`${pad}@media ${rule.conditionText || rule.media.mediaText} {`);
                    walk(rule.cssRules, sheetName, depth + 1);
                    lines.push(`${pad}}`);
                } else if (rule instanceof CSSStyleRule && rule.selectorText) {
                    lines.push(`${pad}${rule.selectorText} { ${rule.style.cssText} }`);
                } else if (rule.cssText) {
                    lines.push(`${pad}${rule.cssText.replace(/\s+/g, ' ').trim()}`);
                }
            }
        };
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            if (!sheet) continue;
            let rules: CSSRuleList;
            try {
                rules = sheet.cssRules;
            } catch {
                continue; // cross-origin, not ours
            }
            walk(rules, '', 0);
        }
        return lines.join('\n');
    });
}

async function computedStyles(page: Page, selectors: string[], props: string[]): Promise<string> {
    return page.evaluate(({ selectors, props }) => {
        const out: string[] = [];
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

        await page.locator('#icon-notepad').dblclick();
        await expect(page.locator('#win-notepad')).toBeVisible();
        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

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

        await page.locator('#icon-paint').dblclick();
        await expect(page.locator('#win-paint')).toBeVisible();

        const hovered: string[] = [];
        const capture = async (sel: string) => {
            const el = page.locator(sel).first();
            if (!(await el.count())) { hovered.push(`${sel} :hover\n  <absent>`); return; }
            await el.hover();
            const styles = await computedStyles(page, [sel], TRACKED_PROPS);
            hovered.push(styles.replace(sel, `${sel} :hover`));
        };

        await capture('#ragdollToggle');
        await capture('#hdr-toggle');
        await capture('.window-menu .window-menu-item');

        await page.locator('#start-button').click();
        await expect(page.locator('#start-menu')).toBeVisible();

        const rest = await computedStyles(page, TRACKED_SELECTORS, TRACKED_PROPS);
        expect.soft(rest).toMatchSnapshot('states-rest.txt');

        await capture('#start-menu .menu-item');
        expect.soft(hovered.join('\n\n')).toMatchSnapshot('states-hover.txt');

        const classStates = await page.evaluate((props) => {
            const out: string[] = [];
            for (const [sel, cls] of [['#ragdollToggle', 'active'], ['#ragdollToggle', 'disabled'], ['#hdr-toggle', 'active']] as const) {
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

    test('computed styles are unchanged at a phone viewport', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await settle(page);

        const mobileSelectors = [
            ...TRACKED_SELECTORS,
            '#win-flappy-neon', '#win-flappy-neon .window-body',
            '#win-football-rush', '#win-football-rush .window-body',
            '.ragdoll-pet-btn', '.taskbar-button', '.icon',
            '#icon-mycomputer .icon-box', '.main-app .icon-box',
        ];
        expect(await computedStyles(page, mobileSelectors, TRACKED_PROPS))
            .toMatchSnapshot('computed-mobile.txt');
    });

    test('the wallpaper takes its palette from the theme tokens', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        const sample: any = await page.evaluate(async () => {
            const shaderPath = '/js/ui/ThemeShaders.ts';
            const { buildHadosShader, readShaderPalette, hexToVec3 } = (await import(shaderPath)) as any;

            const render = (src: string) => {
                const c = document.createElement('canvas');
                c.width = 120; c.height = 90;
                const gl = c.getContext('webgl', { preserveDrawingBuffer: true });
                if (!gl) return { error: 'No WebGL' };
                const vs = gl.createShader(gl.VERTEX_SHADER);
                if (!vs) return { error: 'VS create fail' };
                gl.shaderSource(vs, 'attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }');
                gl.compileShader(vs);
                const fs = gl.createShader(gl.FRAGMENT_SHADER);
                if (!fs) return { error: 'FS create fail' };
                gl.shaderSource(fs, src);
                gl.compileShader(fs);
                if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return { error: gl.getShaderInfoLog(fs) };
                const pr = gl.createProgram();
                if (!pr) return { error: 'Program create fail' };
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
                gl.readPixels(60, 45, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
                return { mark: [px[0], px[1], px[2]] };
            };

            const shipped = render(buildHadosShader());
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

        if (!sample.shipped.mark || !sample.recoloured.mark) {
            throw new Error('WebGL rendering failed');
        }

        expect(sample.shipped.error).toBeUndefined();
        expect(sample.shipped.mark[2]).toBeGreaterThan(sample.shipped.mark[0] + 40);

        expect(sample.recoloured.error).toBeUndefined();
        expect(sample.recoloured.mark[0]).toBeGreaterThan(sample.shipped.mark[0] + 30);
        expect(sample.recoloured.mark[2]).toBeLessThan(sample.shipped.mark[2]);
    });

    test('the desktop looks unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

        await expect(page).toHaveScreenshot('desktop-hados.png', {
            mask: [page.locator('#taskbar-clock')],
        });
    });

    test('the in-app menu bar looks unchanged', async ({ page }) => {
        await page.addInitScript(() => localStorage.setItem('os-theme', 'hados'));
        await page.goto('/');
        await settle(page);

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
