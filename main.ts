/**
 * WINDOWS 95 APP CENTER - VITE ENTRY POINT
 * ES Modules architecture — explicit dependency graph
 * Version: 3.0
 */

// Import Styles
import './style.css';

// === Layer 0: Foundation (no deps) ===
import { Services } from './js/core/ServiceContainer';
import { CONFIG } from './js/config';

// === Layer 1: Utilities (depends on CONFIG) ===
import { Utils } from './js/utils';

// === Layer 2: Core Services (depends on Utils) ===
import { EventBus, Store } from './js/core/EventBus';
import { VFS } from './js/core/VFS';
import { Kernel } from './js/core/Kernel';
import { SessionManager } from './js/core/SessionManager';
import { BootLoader } from './js/core/BootLoader';
import { HDRManager } from './js/core/HDRManager';
import { ResourceManager } from './js/core/ResourceManager';
import { HapticService } from './js/services/HapticService';

Services.register('HapticService', new HapticService());

// === Sprint 2: Error Boundary — must be registered ASAP, before any UI ===
import { initErrorBoundary } from './js/core/ErrorBoundary';
initErrorBoundary();

// === Layer 3: UI Modules (depends on Utils, Core) ===
import { WindowManager } from './js/ui/WindowManager';
import { WindowFactory } from './js/ui/WindowFactory';
import { TaskbarManager } from './js/ui/TaskbarManager';
import { DesktopManager } from './js/ui/DesktopManager';
import { ShaderWallpaper } from './js/ui/ShaderWallpaper';
import { TouchManager } from './js/ui/TouchManager';
import { MessageLibrary } from './js/ui/MessageLibrary';
import { BubbleAnimator } from './js/ui/BubbleAnimator';

// === Layer 4: Systems ===
import { AudioManager } from './js/audio/AudioManager';
import { RagdollMemory } from './js/RagdollMemory';
import { i18n } from './js/services/i18n';
import { Notify } from './js/ui/NotificationManager';

// === Layer 5: Apps (auto-register via Vite glob) ===
const appModules = import.meta.glob('./js/apps/*.ts', { eager: true });
Utils.Logger.log(`[Kernel] Auto-loaded ${Object.keys(appModules).length} applications`);


// === Layer 6: Engine & Listeners (orchestration) ===
import './js/core/os_engine';
import './js/core/event_listeners';

// === Layer 7: Ragdoll Pet (independent subsystem) ===
import { RagdollSystem } from './js/core/RagdollSystem';

const ragdollSystem = new RagdollSystem();
ragdollSystem.init();

// Ragdoll 3D — lazy loaded: Three.js + Rapier3D (~2MB) se cargan sólo cuando
// el usuario activa el pet 3D por primera vez, no en el bundle inicial.
let ragdoll3dSystem: { init(): void } | null = null;

async function initRagdoll3D(): Promise<void> {
    if (ragdoll3dSystem) return; // ya inicializado
    const { Ragdoll3DSystem } = await import('./js/core/Ragdoll3DSystem');
    ragdoll3dSystem = new Ragdoll3DSystem();
    ragdoll3dSystem.init();
}

// Inicializar en el primer toggle del usuario, o inmediatamente si estaba activo
if (localStorage.getItem('ragdoll3DPetActive') === 'true') {
    // Activo desde la sesión anterior — diferir hasta después del boot
    window.addEventListener('load', () => { initRagdoll3D().catch(console.error); }, { once: true });
} else {
    // Esperar al primer click del usuario en spawn-ragdoll-3d
    document.addEventListener('click', function onFirstRagdoll3DClick(e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('#spawn-ragdoll-3d') || target.closest('[data-ragdoll3d]')) {
            document.removeEventListener('click', onFirstRagdoll3DClick);
            initRagdoll3D().then(() => {
                EventBus.emit('ragdoll3d:toggle');
            }).catch(console.error);
        }
    });
}

// Initialization
console.log(`[VITE] Windows 95 App Center v${CONFIG.APP.VERSION} — ES Modules loaded`);

// Hydrate the VFS (async, IndexedDB-backed) BEFORE booting the OS so the file
// system is ready by the time any app can read it. VFS.init() is idempotent.
async function boot(): Promise<void> {
    try {
        await VFS.init();
    } catch (err) {
        console.error('[Kernel] VFS init failed, booting with defaults:', err);
    }
    if (window.initOS) window.initOS();

    // Fase 5: keep the session up to date and resume the previous one (open apps
    // + window layout). No saved session -> restore() is a no-op.
    try {
        SessionManager.init();
        await SessionManager.restore();
    } catch (err) {
        console.error('[Kernel] Session restore failed:', err);
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', () => { void boot(); });
} else {
    void boot();
}

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[Kernel] SW Registered'))
            .catch(err => console.error('[Kernel] SW Registration failed', err));
    });
}

