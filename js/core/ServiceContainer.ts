/**
 * WINDOWS 95 APP CENTER - SERVICE CONTAINER
 * Centralized dependency registry replacing window.* globals.
 * v2.0 — Typed registry
 *
 * Changelog v2.0:
 *  - NEW: IServiceRegistry — mapa de nombre→tipo para todos los servicios registrados.
 *  - NEW: get<K>() y register<K>() inferidos del registro — cero `as any` en consumers.
 *  - NEW: whenReady<K>() tipado al callback con la instancia correcta.
 *  - COMPAT: La API pública es backwards-compatible — código existente no cambia.
 *
 * El registro dejó de llevar `[key: string]: unknown` (v1.0.0-rc.1): con el índice
 * abierto, un nombre mal escrito tipaba igual de bien que uno correcto. Cada
 * servicio se declara ahora explícitamente; la sobrecarga `get<T>(name: string)`
 * cubre los pocos consumidores que resuelven por nombre dinámico.
 *
 * Usage:
 *   Services.register('Kernel', Kernel);          // tipo inferido de IServiceRegistry
 *   const kernel = Services.get('Kernel');         // tipo: IKernel | undefined  ✅
 *   kernel?.launch('notepad');                     // intellisense completo
 *   Services.whenReady('AudioManager', (audio) => audio.play('blip')); // tipo inferido
 */

// ─── Lazy imports: sólo tipos, sin cargar los módulos ─────────────────────────
// Usamos `import type` para evitar dependencias circulares y side effects.
import type { IKernel } from './Kernel';
import type { IEventBus, IStore } from './EventBus';
import type { IBootLoader } from './BootLoader';
import type { IHDRManager } from './HDRManager';
import type { IVFS } from './VFS';
import type { IResourceManager } from './ResourceManager';
import type { IWindowManager } from '../ui/WindowManager';
import type { IWindowFactory } from '../ui/WindowFactory';
import type { ITaskbarManager } from '../ui/TaskbarManager';
import type { IDesktopManager } from '../ui/DesktopManager';
import type { IShaderWallpaper } from '../ui/ShaderWallpaper';
import type { ITouchManager } from '../ui/TouchManager';
import type { IBubbleAnimator } from '../ui/BubbleAnimator';
import type { IMessageLibrary } from '../ui/MessageLibrary';
import type { INotify } from '../ui/NotificationManager';
import type { ITranslationService } from '../services/i18n';
import type { IRagdollMemory } from '../RagdollMemory';
import type { InternetExplorerApp } from '../apps/InternetExplorer';
import type { AudioManager } from '../audio/AudioManager';
import type { ThemeManager } from './ThemeManager';
import type { IHapticService } from '../services/HapticService';

/** Constructor signature for the BubbleAnimator UI utility. */
type BubbleAnimatorCtor = new () => IBubbleAnimator;
/** Constructor signature for the MessageLibrary database helper. */
type MessageLibraryCtor = new () => IMessageLibrary;

/**
 * Centralized registry mapping service identifier names to their implementation interfaces.
 */
export interface IServiceRegistry {
    // Core
    'Kernel':           IKernel;
    'EventBus':         IEventBus;
    'Store':            IStore;
    'VFS':              IVFS;
    'BootLoader':       IBootLoader;
    'HDRManager':       IHDRManager;
    'ResourceManager':  IResourceManager;
    // UI
    'WindowManager':    IWindowManager;
    'WindowFactory':    IWindowFactory;
    'TaskbarManager':   ITaskbarManager;
    'DesktopManager':   IDesktopManager;
    'ShaderWallpaper':  IShaderWallpaper;
    'TouchManager':     ITouchManager;
    'BubbleAnimator':   BubbleAnimatorCtor;
    'MessageLibrary':   MessageLibraryCtor;
    'Notify':           INotify;
    // Services & Apps
    'AudioManager':     AudioManager;
    'ThemeManager':     ThemeManager;
    'i18n':             ITranslationService;
    'RagdollMemory':    IRagdollMemory;
    'InternetExplorerApp': InstanceType<typeof InternetExplorerApp>;
    'HapticService':    IHapticService;
    'RagdollPet':       unknown;
    'ProcessManager':   unknown;
    'SystemBridge':     unknown;
}

/**
 * Callback function signature executed when a requested service becomes available.
 */
export type ServiceCallback<K extends keyof IServiceRegistry = keyof IServiceRegistry> =
    (instance: IServiceRegistry[K]) => void;

/**
 * Interface detailing the global service locator container operations.
 */
export interface IServiceContainer {
    /** Registers a service instance mapping to a key name. */
    register<K extends keyof IServiceRegistry>(name: K, instance: IServiceRegistry[K]): void;
    register<T>(name: string, instance: T): void;
    /** Unregisters a service instance. */
    unregister(name: string): boolean;
    /** Retrieves a registered service instance by name. Returns undefined if not found. */
    get<K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined;
    get<T>(name: string): T | undefined;
    /** Checks if a service key is present in the registry. */
    has(name: string): boolean;
    /** Evaluates if a service is registered, executing the callback immediately if present, or queuing it until registered. */
    whenReady<K extends keyof IServiceRegistry>(name: K, callback: (instance: IServiceRegistry[K]) => void): void;
    whenReady<T>(name: string, callback: (instance: T) => void): void;
    /** Lists all currently registered service name keys. */
    list(): string[];
    /** Resets the container state, clearing registry and pending callbacks (for testing). */
    __reset(): void;
}

/** Active service instance registry maps. */
const _registry = new Map<string, unknown>();
/** Maps pending service keys to sets of execution callbacks waiting for registration. */
const _pendingCallbacks = new Map<string, Set<(inst: unknown) => void>>();

const Services: IServiceContainer = {
    register(name: string, instance: unknown): void {
        if (_registry.has(name)) {
            if (typeof console !== 'undefined') console.warn(`[Services] Overwriting existing service: ${name}`);
        }
        _registry.set(name, instance);

        if (_pendingCallbacks.has(name)) {
            _pendingCallbacks.get(name)!.forEach(cb => cb(instance));
            _pendingCallbacks.delete(name);
        }
    },

    unregister(name: string): boolean {
        return _registry.delete(name);
    },

    get(name: string): unknown {
        return _registry.get(name);
    },

    has(name: string): boolean {
        return _registry.has(name);
    },

    whenReady(name: string, callback: (instance: unknown) => void): void {
        if (_registry.has(name)) {
            callback(_registry.get(name));
        } else {
            if (!_pendingCallbacks.has(name)) {
                _pendingCallbacks.set(name, new Set());
            }
            _pendingCallbacks.get(name)!.add(callback);
        }
    },

    list(): string[] {
        return Array.from(_registry.keys());
    },

    __reset(): void {
        _registry.clear();
        _pendingCallbacks.clear();
    }
};

export { Services };

Object.freeze(Services);

if (typeof window !== 'undefined') {
    (window as Window & { Services?: IServiceContainer }).Services = Services;
}
