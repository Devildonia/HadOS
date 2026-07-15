/**
 * CHARACTERIZATION TESTS: WindowManager — Fase 0 (red de seguridad)
 *
 * Bloquean el comportamiento observable de las rutas NO cubiertas por
 * WindowManager.test.js ANTES de descomponer el IIFE en colaboradores
 * (z-stack, interacciones, iframes, puente legacy, controles).
 *
 * Cubre: terminación/restauración de iframes, sonidos por tema, atributos ARIA
 * y delegación de clicks en initializeControls, restauración de foco al cerrar,
 * y la ruta WindowFactory.destroy.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WindowManager } from '../js/ui/WindowManager.js';
import { Services } from '../js/core/ServiceContainer.js';

function buildDesktop() {
    document.body.innerHTML = `
        <div id="desktop">
            <div id="win-alpha" class="win95-window" style="display:none;">
                <div class="window-header">
                    <span>Alpha</span>
                    <div class="window-controls">
                        <button class="window-btn minimize-btn">_</button>
                        <button class="window-btn maximize-btn">□</button>
                        <button class="window-btn close-btn">×</button>
                    </div>
                </div>
                <div class="window-body"><input id="alpha-input" /></div>
            </div>
            <div id="win-frame" class="win95-window" style="display:none;">
                <div class="window-header"><span>Frame</span></div>
                <div class="window-body"><iframe id="the-frame" src="about:blank"></iframe></div>
            </div>
        </div>
    `;
}

beforeEach(() => {
    vi.resetAllMocks();
    Services.__reset();
    Services.register('WindowManager', WindowManager);

    const mockProcesses = [];
    Services.register('Kernel', {
        getRegistry: () => ({ apps: {}, processes: mockProcesses }),
        kill: vi.fn(),
    });
    Services.register('AudioManager', { play: vi.fn(), loadSound: vi.fn(), init: vi.fn() });

    buildDesktop();
});

afterEach(() => {
    WindowManager.destroy();
    vi.restoreAllMocks();
});

// ── Terminación / restauración de iframes ───────────────────────────────────
describe('WindowManager (caracterización) — iframes', () => {
    it('al cerrar guarda el src en data-src y descarga a about:blank', () => {
        const iframe = document.getElementById('the-frame');
        iframe.src = 'https://example.com/game';

        WindowManager.open('win-frame');
        WindowManager.close('win-frame');

        expect(iframe.getAttribute('data-src')).toContain('example.com');
        expect(iframe.src).toContain('about:blank');
    });

    it('al reabrir restaura el src desde data-src', () => {
        const iframe = document.getElementById('the-frame');
        iframe.setAttribute('data-src', 'https://example.com/restored');
        // src en about:blank simula proceso previamente descargado

        WindowManager.open('win-frame');

        expect(iframe.src).toContain('example.com/restored');
    });
});

// ── Sonidos por tema (modern) ───────────────────────────────────────────────
describe('WindowManager (caracterización) — sonidos por tema', () => {
    it('con tema modern reproduce open_window_modern al abrir', () => {
        Services.register('ThemeManager', { currentTheme: 'modern' });
        const audio = Services.get('AudioManager');

        WindowManager.open('win-alpha');

        expect(audio.play).toHaveBeenCalledWith('open_window_modern', { volume: 0.7 });
    });

    it('con tema modern reproduce close_window_modern al cerrar', () => {
        Services.register('ThemeManager', { currentTheme: 'modern' });
        const audio = Services.get('AudioManager');

        WindowManager.open('win-alpha');
        audio.play.mockClear();
        WindowManager.close('win-alpha');

        expect(audio.play).toHaveBeenCalledWith('close_window_modern', { volume: 0.7 });
    });

    it('sin tema modern NO reproduce sonido de ventana', () => {
        Services.register('ThemeManager', { currentTheme: 'classic' });
        const audio = Services.get('AudioManager');

        WindowManager.open('win-alpha');

        expect(audio.play).not.toHaveBeenCalled();
    });
});

// ── initializeControls: ARIA + delegación de clicks ─────────────────────────
describe('WindowManager (caracterización) — initializeControls', () => {
    it('asigna role=dialog, aria-labelledby y aria-labels a los botones', () => {
        WindowManager.initializeControls();

        const win = document.getElementById('win-alpha');
        expect(win.getAttribute('role')).toBe('dialog');
        expect(win.getAttribute('aria-labelledby')).toBeTruthy();
        expect(win.querySelector('.minimize-btn').getAttribute('aria-label')).toBe('Minimize');
        expect(win.querySelector('.maximize-btn').getAttribute('aria-label')).toBe('Maximize');
        expect(win.querySelector('.close-btn').getAttribute('aria-label')).toBe('Close');
    });

    it('es idempotente: segunda llamada no re-inicializa', () => {
        WindowManager.initializeControls();
        // Segunda llamada no debe lanzar ni duplicar
        expect(() => WindowManager.initializeControls()).not.toThrow();
    });

    it('un click en close-btn (delegado) cierra la ventana', () => {
        WindowManager.open('win-alpha');
        WindowManager.initializeControls();

        const closeBtn = document.querySelector('#win-alpha .close-btn');
        closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(document.getElementById('win-alpha').style.display).toBe('none');
        expect(WindowManager.getActive()).not.toContain('win-alpha');
    });

    it('un click en minimize-btn (delegado) minimiza la ventana', () => {
        WindowManager.open('win-alpha');
        WindowManager.initializeControls();

        const minBtn = document.querySelector('#win-alpha .minimize-btn');
        minBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(document.getElementById('win-alpha').style.display).toBe('none');
        // minimizar conserva la ventana en la lista activa
        expect(WindowManager.getActive()).toContain('win-alpha');
    });

    it('un click en maximize-btn (delegado) alterna maximized', () => {
        WindowManager.open('win-alpha');
        WindowManager.initializeControls();

        const maxBtn = document.querySelector('#win-alpha .maximize-btn');
        maxBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(document.getElementById('win-alpha').classList.contains('maximized')).toBe(true);
    });
});

// ── Restauración de foco al cerrar ──────────────────────────────────────────
describe('WindowManager (caracterización) — foco al cerrar', () => {
    it('si el foco estaba dentro, lo devuelve al icono lanzador (.icon[data-launch])', () => {
        // El fallback preferente es el icono del escritorio cuyo data-launch
        // coincide con el appId (windowId sin el prefijo "win-").
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.setAttribute('data-launch', 'alpha');
        icon.setAttribute('tabindex', '0');
        document.getElementById('desktop').appendChild(icon);

        WindowManager.open('win-alpha');
        const input = document.getElementById('alpha-input');
        input.focus();
        expect(document.activeElement).toBe(input);

        WindowManager.close('win-alpha');

        expect(document.activeElement).toBe(icon);
    });
});

// ── Ruta WindowFactory.destroy ──────────────────────────────────────────────
describe('WindowManager (caracterización) — WindowFactory.destroy', () => {
    it('cierra vía WindowFactory.destroy cuando la ventana dinámica tiene _onCloseCallback', () => {
        const destroy = vi.fn();
        Services.register('WindowFactory', {
            destroy,
            getCreated: () => new Set(['win-alpha']),
        });

        const win = document.getElementById('win-alpha');
        win._onCloseCallback = () => {};

        WindowManager.open('win-alpha');
        WindowManager.close('win-alpha');

        expect(destroy).toHaveBeenCalledWith('win-alpha');
    });
});
