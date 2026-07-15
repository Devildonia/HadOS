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

type BubbleAnimatorCtor = new () => IBubbleAnimator;
type MessageLibraryCtor = new () => IMessageLibrary;

/**
 * Registro centralizado de todos los servicios del sistema.
 * Añadir aquí un nuevo servicio activa la inferencia de tipos en get() y register().
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
    // Fallback: permite registrar servicios custom sin romper el tipado
    [key: string]:      unknown;
}

export type ServiceCallback<K extends keyof IServiceRegistry = string> =
    K extends keyof IServiceRegistry
        ? (instance: IServiceRegistry[K]) => void
        : (instance: unknown) => void;

export interface IServiceContainer {
    register<K extends keyof IServiceRegistry>(name: K, instance: IServiceRegistry[K]): void;
    unregister<K extends keyof IServiceRegistry>(name: K): boolean;
    get<K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined;
    has(name: string): boolean;
    whenReady<K extends keyof IServiceRegistry>(name: K, callback: ServiceCallback<K>): void;
    list(): string[];
    __reset(): void;
}

const _registry = new Map<string, unknown>();
const _pendingCallbacks = new Map<string, Set<ServiceCallback<string>>>();

const Services: IServiceContainer = {
    /**
     * Register a service by name — tipo inferido de IServiceRegistry
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
     * Unregister a service by name (for HMR)
     */
    unregister<K extends keyof IServiceRegistry>(name: K): boolean {
        return _registry.delete(name as string);
    },

    /**
     * Get a service by name — retorna el tipo correcto sin `as any`
     */
    get<K extends keyof IServiceRegistry>(name: K): IServiceRegistry[K] | undefined {
        return _registry.get(name as string) as IServiceRegistry[K] | undefined;
    },

    /**
     * Check if a service is registered
     */
    has(name: string): boolean {
        return _registry.has(name);
    },

    /**
     * Get a service, waiting if it hasn't been registered yet.
     * Callback recibe el tipo correcto según IServiceRegistry.
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
     * List all registered service names (debug)
     */
    list(): string[] {
        return Array.from(_registry.keys());
    },

    /**
     * Reset container (for testing)
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
