/**
 * WINDOWS 95 APP CENTER - INTERNET EXPLORER
 * Web browser simulation
 * Version: 4.3 (TypeScript)
 *
 * Changelog v4.3:
 *  - FIX: navigateIE() global ahora delega a instance.navigate() — elimina
 *    la doble validación incompleta que era un vector de bypass de seguridad.
 *  - FIX: EventBus listeners movidos al constructor y almacenados para cleanup.
 *  - NEW: terminate() implementado — limpia todos los listeners y referencias.
 *  - NEW: Services.register() registra la instancia activa para que navigateIE
 *    pueda resolverla sin globals adicionales.
 */

import { Utils } from '../utils.js';
import { Kernel } from '../core/Kernel.js';
import { EventBus } from '../core/EventBus.js';
import { Services } from '../core/ServiceContainer.js';
import { WindowApp } from '../core/WindowApp.js';

export interface IIEParams {
    [key: string]: any;
}

const IE_BODY_HTML = `
    <!-- IE Toolbar -->
    <div class="ie-toolbar">
        <div class="ie-menu-bar">
            <span><u>F</u>ile</span>
            <span><u>E</u>dit</span>
            <span><u>V</u>iew</span>
            <span><u>G</u>o</span>
            <span><u>F</u>favorites</span>
            <span><u>H</u>elp</span>
        </div>
        <div class="ie-button-bar">
            <button class="ie-btn" title="Back" data-action="ie-back">⬅ Back</button>
            <button class="ie-btn" title="Forward" data-action="ie-forward">➡ Forward</button>
            <button class="ie-btn" title="Stop" data-action="ie-stop">❌ Stop</button>
            <button class="ie-btn" title="Refresh" data-action="ie-refresh">♻ Refresh</button>
            <button class="ie-btn" title="Home" data-action="ie-home">🏠 Home</button>
        </div>
        <div class="ie-address-bar">
            <span data-i18n="folder.address">Address:</span>
            <input type="text" id="ie-address-input" value="https://www.google.com/webhp?igu=1">
            <button class="ie-go-btn" data-action="ie-go">Go</button>
        </div>
    </div>
    <!-- Content Area -->
    <div class="ie-content">
        <iframe id="ie-frame" src="about:blank"
            sandbox="allow-scripts allow-forms allow-popups"
            style="width: 100%; height: 100%; border: none; background: white;"></iframe>
    </div>
    <div class="window-statusbar">
        <span id="ie-status">Done</span>
    </div>
`;

class InternetExplorerApp extends WindowApp {
    public windowId: string = 'win-internet-explorer';
    private frameId: string = 'ie-frame';
    private inputId: string = 'ie-address-input';
    private statusId: string = 'ie-status';

    constructor(params: IIEParams = {}) {
        super();
        this._ensureWindow();
        this._setupAddressBarListener();
        this._setupEventBusListeners();

        // Registrar instancia activa para que navigateIE() pueda delegarle
        Services.register('InternetExplorerApp', this);

        // Navegar a home si no hay URL inicial
        this.navigate(params.url || 'https://www.google.com/webhp?igu=1');
    }

    private _ensureWindow(): void {
        if (document.getElementById(this.windowId)) return;
        const wf = Services.get('WindowFactory');
        if (!wf) return;
        wf.create({
            id: this.windowId,
            title: 'The Internet',
            width: 800,
            height: 600,
            icon: '🌐'
        });
        const body = wf.getBody(this.windowId);
        if (body) {
            body.setAttribute('style', 'display: flex; flex-direction: column; height: 100%; padding: 0;');
            body.innerHTML = IE_BODY_HTML;
        }
    }

    // ─── Listeners ────────────────────────────────────────────────────────────

    private _setupAddressBarListener(): void {
        const input = document.getElementById(this.inputId) as HTMLInputElement;
        if (!input || input.dataset.listening) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Enter') this.navigate((e.target as HTMLInputElement).value);
        };
        input.addEventListener('keypress', handler);
        input.dataset.listening = 'true';

        this.addCleanup(() => {
            input.removeEventListener('keypress', handler);
            delete input.dataset.listening;
        });
    }

    private _setupEventBusListeners(): void {
        // Cada EventBus.on() devuelve una función de unsubscribe — la guardamos
        const unsubs = [
            EventBus.on('action:ie-back', () => {
                const frame = document.getElementById(this.frameId) as HTMLIFrameElement;
                try { frame?.contentWindow?.history.back(); } catch (_) { }
            }),
            EventBus.on('action:ie-forward', () => {
                const frame = document.getElementById(this.frameId) as HTMLIFrameElement;
                try { frame?.contentWindow?.history.forward(); } catch (_) { }
            }),
            EventBus.on('action:ie-stop', () => {
                const frame = document.getElementById(this.frameId) as HTMLIFrameElement;
                // eslint-disable-next-line no-self-assign
                if (frame) frame.src = frame.src;
            }),
            EventBus.on('action:ie-refresh', () => {
                const frame = document.getElementById(this.frameId) as HTMLIFrameElement;
                try { frame?.contentWindow?.location.reload(); } catch (_) { }
            }),
            EventBus.on('action:ie-home', () => {
                this.navigate('https://www.google.com/webhp?igu=1');
            }),
            EventBus.on('action:ie-go', () => {
                const input = document.getElementById(this.inputId) as HTMLInputElement;
                if (input) this.navigate(input.value);
            })
        ];
        unsubs.forEach(unsub => this.addCleanup(unsub));
    }

    // ─── URL Validation ───────────────────────────────────────────────────────

    /**
     * Valida y normaliza una URL. Retorna null si es peligrosa.
     * Única fuente de verdad — navigateIE() delega aquí.
     */
    private validateUrl(url: string): string | null {
        if (!url || typeof url !== 'string') return null;

        const trimmed = url.trim();
        if (!trimmed) return null;

        // Bloquear protocolos peligrosos (vectores XSS)
        const dangerousProtocols = /^(javascript|data|vbscript|blob):/i;
        if (dangerousProtocols.test(trimmed)) {
            return null;
        }

        // Añadir https:// si no tiene protocolo
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            return 'https://' + trimmed;
        }

        return trimmed;
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    public navigate(url: string): void {
        const frame = document.getElementById(this.frameId) as HTMLIFrameElement;
        const input = document.getElementById(this.inputId) as HTMLInputElement;
        const status = document.getElementById(this.statusId);

        if (!frame || !input) return;

        const safeUrl = this.validateUrl(url);
        if (!safeUrl) {
            if (status) status.textContent = 'Blocked: dangerous protocol';
            Utils.Logger.warn('[IE] Blocked navigation to: ' + url);
            return;
        }

        input.value = safeUrl;
        if (status) status.textContent = 'Opening page...';

        try {
            frame.src = safeUrl;
        } catch (e) {
            if (status) status.textContent = 'Error loading page';
        }

        frame.onload = () => {
            if (status) status.textContent = 'Done';
        };
    }

    // ─── Lifecycle ────────────────────────────────────────────────────────────

    public override terminate(): void {
        super.terminate();
        Utils.Logger.log('[IE] Terminated — all listeners removed');
    }
}

// ─── Global wrapper ───────────────────────────────────────────────────────────
// FIX v4.3: Delega a la instancia registrada en ServiceContainer.
// Ya no hay validación duplicada ni lógica de iframe dispersa aquí.
window.navigateIE = (url: string): void => {
    const ie = Services.get('InternetExplorerApp');
    if (ie?.navigate) {
        ie.navigate(url);
    } else {
        Utils.Logger.warn('[IE] navigateIE called before app was launched');
    }
};

// ─── Kernel registration ──────────────────────────────────────────────────────
Kernel.registerApp('internet-explorer', InternetExplorerApp, {
    name: 'Internet Explorer',
    icon: 'assets/icons/iexplorer.webp',
    singleton: true
});

export { InternetExplorerApp };
