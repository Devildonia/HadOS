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
 * Adding a service type here enables complete auto-completion and static type checks in get() and register() calls.
 */
export interface IServiceRegistry {
    // Core
    /** The Kernel OS process and package supervisor. */
    'Kernel':           IKernel;
    /** Decoupled pub-sub communication bus. */
    'EventBus':         IEventBus;
    /** Global reactive state store container. */
    'Store':            IStore;
    /** Virtual File System controller. */
    'VFS':              IVFS;
    /** System bootloader manager. */
    'BootLoader':       IBootLoader;
    /** High Dynamic Range wallpaper renderer controller. */
    'HDRManager':       IHDRManager;
    /** Resource allocation and disposal manager. */
    'ResourceManager':  IResourceManager;
    // UI
    /** System desktop windows manager. */
    'WindowManager':    IWindowManager;
    /** Windows instantiation constructor registry. */
    'WindowFactory':    IWindowFactory;
    /** Taskbar interface customization manager. */
    'TaskbarManager':   ITaskbarManager;
    /** Desktop customize controls, wallpaper, and file drag manager. */
    'DesktopManager':   IDesktopManager;
    /** WebGL desktop wallpaper shader. */
    'ShaderWallpaper':  IShaderWallpaper;
    /** Tablet/mobile gesture and click manager. */
    'TouchManager':     ITouchManager;
    /** Desktop interaction bubble physics animator class constructor. */
    'BubbleAnimator':   BubbleAnimatorCtor;
    /** Notification sound messages catalog database class constructor. */
    'MessageLibrary':   MessageLibraryCtor;
    /** User-facing notification card manager. */
    'Notify':           INotify;
    // Services & Apps
    /** Audio channels and clips dispatcher. */
    'AudioManager':     AudioManager;
    /** Global UI customization and coloring manager. */
    'ThemeManager':     ThemeManager;
    /** Localized dictionary and dynamic text translator service. */
    'i18n':             ITranslationService;
    /** Local persistent memory module tracking the Ragdoll companion. */
    'RagdollMemory':    IRagdollMemory;
    /** Isolated web explorer constructor instance. */
    'InternetExplorerApp': InstanceType<typeof InternetExplorerApp>;
    /** System-level tactile feedback controller. */
    'HapticService':    IHapticService;
    // Fallback: permite registrar servicios custom sin romper el tipado
    [key: string]:      unknown;
}

/**
 * Callback function signature executed when a requested service becomes available.
 */
export type ServiceCallback<K extends keyof IServiceRegistry = string> =
    K extends keyof IServiceRegistry
        ? (instance: IServiceRegistry[K]) => void
        : (instance: unknown) => void;

/**
 * Interface detailing the global service locator container operations.
 */
export interface IServiceContainer {
    /** Registers a service instance mapping to a key name. */
    register<K extends keyof IServiceRegistry>(name: K, instance: IServiceRegistry[K]): void;
    /** Unregisters a service instance. */
    unregister<K extends keyof IServiceRegistry>(name: K): boolean;
    /** Retrieves a registered service instance by name. Returns undefined if not found. */
    get<K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined;
    /** Checks if a service key is present in the registry. */
    has(name: string): boolean;
    /** Evaluates if a service is registered, executing the callback immediately if present, or queuing it until registered. */
    whenReady<K extends keyof IServiceRegistry>(name: K, callback: ServiceCallback<K>): void;
    /** Lists all currently registered service name keys. */
    list(): string[];
    /** Resets the container state, clearing registry and pending callbacks (for testing). */
    __reset(): void;
}

/** Active service instance registry maps. */
const _registry = new Map<string, unknown>();
/** Maps pending service keys to sets of execution callbacks waiting for registration. */
const _pendingCallbacks = new Map<string, Set<ServiceCallback<string>>>();

const Services: IServiceContainer = {
    /**
     * Register a service by name.
     */
    register<K extends keyof IServiceRegistry>(name: K, instance: IServiceRegistry[K]): void {
        if (_registry.has(name as string)) {
            if (typeof console !== 'undefined') console.warn(`[Services] Overwriting existing service: ${String(name)}`);
        }
        _registry.set(name as string, instance);

        // Fire any pending callbacks waiting for this service
        if (_pendingCallbacks.has(name as string)) {
            _pendingCallbacks.get(name as string)!.forEach(cb => cb(instance as never));
            _pendingCallbacks.delete(name as string);
        }
    },

    /**
     * Unregister a service by name (for HMR).
     */
    unregister<K extends keyof IServiceRegistry>(name: K): boolean {
        return _registry.delete(name as string);
    },

    /**
     * Get a service by name.
     */
    get<K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined {
        return _registry.get(name as string) as IServiceRegistry[K] | undefined;
    },

    /**
     * Check if a service is registered.
     */
    has(name: string): boolean {
        return _registry.has(name);
    },

    /**
     * Get a service, waiting if it hasn't been registered yet.
     */
    whenReady<K extends keyof IServiceRegistry>(name: K, callback: ServiceCallback<K>): void {
        if (_registry.has(name as string)) {
            callback(_registry.get(name as string) as IServiceRegistry[K]);
        } else {
            if (!_pendingCallbacks.has(name as string)) {
                _pendingCallbacks.set(name as string, new Set());
            }
            _pendingCallbacks.get(name as string)!.add(callback as ServiceCallback<string>);
        }
    },

    /**
     * List all registered service names (debug).
     */
    list(): string[] {
        return Array.from(_registry.keys());
    },

    /**
     * Reset container (for testing).
     */
    __reset(): void {
        _registry.clear();
        _pendingCallbacks.clear();
    }
};

export { Services };

// Freeze public API
Object.freeze(Services);

// Bridge: also expose on window for HTML onclick handlers during migration
// This can be removed once all inline handlers are migrated
if (typeof window !== 'undefined') {
    (window as Window & { Services?: IServiceContainer }).Services = Services;
}
