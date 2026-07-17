import type { IWindowOptions } from '../ui/WindowFactory';

/**
 * Metadata defining an application's identity and properties within the OS environment.
 */
export interface IAppMetadata {
    /** The display name of the application. */
    name: string;
    /** Path or name of the icon associated with the application. */
    icon: string;
    /** A brief description explaining what the application does. */
    description?: string;
    /** If true, only a single instance of the application can run concurrently. */
    singleton?: boolean;
    /** Indicates if the application is loaded dynamically as a plugin. */
    isPlugin?: boolean;
}

/**
 * Interface representing a dynamically loaded application plugin.
 */
export interface IAppPlugin {
    /** Unique identifier for the plugin application. */
    readonly id: string;
    /** Metadata detailing the plugin's properties. */
    readonly metadata: IAppMetadata;
    /** The constructor function used to instantiate the application component. */
    readonly component: IWindowsAppConstructor;
    /** Optional default configuration options for the application's window container. */
    readonly windowDef?: IWindowOptions;
}

/**
 * Interface that all running desktop applications must implement.
 */
export interface IWindowsApp {
    /** The unique ID of the window containing the application, if any. */
    windowId?: string | null;
    /** Optional cleanup hook invoked when the application process is terminated. */
    terminate?: () => void;
}

/**
 * Represents an active operating system process tracking a running application.
 */
export interface IProcess {
    /** Unique Process Identifier assigned by the Kernel. */
    pid: number;
    /** The identifier of the application package being run. */
    appId: string;
    /** The instantiated application instance. */
    instance: IWindowsApp;
    /** The ID of the window managed by this process, if any. */
    windowId: string | null;
    /** Current execution status of the process. */
    status: 'running' | 'terminated';
    /** 
     * The process virtualization mode:
     * - 'app': Runs directly in the Kernel realm (default context).
     * - 'worker': Execution is isolated in a background Web Worker.
     * - 'iframe': Isolated sandboxed iframe communicating via a MessagePort.
     */
    kind?: 'app' | 'worker' | 'iframe';
}

/**
 * Represents the constructor signature of a desktop application component.
 */
export interface IWindowsAppConstructor {
    new (params?: Record<string, unknown>): IWindowsApp;
}

/**
 * Type-safe map of global Store keys to their respective value types.
 */
export interface IStoreStateMap {
    /** Path or description of the current desktop wallpaper image. */
    wallpaper: string;
    /** CSS color or class name for the system taskbar. */
    taskbarColor: string;
    /** Selected language code (e.g., 'en', 'es'). */
    lang: string;
    /** Flag indicating whether the system boot sequence has successfully finished. */
    bootComplete: boolean;
    /** Current display mode or screen state. */
    screen: string;
    [key: string]: unknown; // Fallback interactivo
}

/**
 * Type-safe map of EventBus event names to their exact payload structures.
 */
export interface IEventPayloadMap {
    /** Emitted when a new process is registered and started by the Kernel. */
    'process-started': IProcess;
    /** Emitted when an active process has stopped or been terminated. */
    'process-stopped': IProcess;
    /** Emitted when a key/value pair is modified in the global state store. */
    'store:changed': [string, unknown, unknown]; // tuple: [key, new, old]
    /** Custom event emitted for generic 2D ragdoll actions. */
    'ragdoll:action': [string, ...unknown[]]; // [actionType, ...args]
    /** Toggles the active state of the 2D ragdoll companion. */
    'ragdoll:toggle': [];
    /** Reports the current active state of the 2D ragdoll. */
    'ragdoll:state': [boolean]; // [isActive]
    /** Toggles the active state of the 3D ragdoll companion. */
    'ragdoll3d:toggle': [];
    /** Reports the current active state of the 3D ragdoll. */
    'ragdoll3d:state': [boolean];
}

/**
 * Utility type to extract and normalize the payload tuple for a given EventBus event key.
 */
export type EventPayload<K extends string> = K extends keyof IEventPayloadMap
    ? IEventPayloadMap[K] extends any[]
        ? IEventPayloadMap[K]
        : [IEventPayloadMap[K]]
    : unknown[];
