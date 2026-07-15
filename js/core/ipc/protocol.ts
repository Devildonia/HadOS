/**
 * PROCESS IPC PROTOCOL (v1)
 * The wire contract between the host (Kernel) and an isolated process runtime
 * (Web Worker now, iframe later). Kept transport-agnostic so the same messages
 * flow over a Worker's postMessage or an iframe MessagePort. Phase 1 of the
 * Web OS roadmap — see docs/webos-roadmap.
 */

export const IPC_VERSION = 1;

/** Handshake message the host posts to a new iframe process to hand over the
 *  dedicated MessagePort. The guest must accept it only from `window.parent`. */
export const IFRAME_CONNECT_TYPE = 'sys:connect';

/** System-channel messages: lifecycle + liveness (used by the watchdog). */
export type SysMessage =
    | { ch: 'sys'; type: 'ready' }
    | { ch: 'sys'; type: 'ping'; id: number }
    | { ch: 'sys'; type: 'pong'; id: number };

/** App-channel messages: request/response correlated by `id`. */
export interface AppMessage {
    ch: 'app';
    type: string;
    /** Correlation id for matching a response to its request. */
    id?: number;
    payload?: unknown;
    /** Present on a response when the request failed. */
    error?: string;
}

export type ProcMessage = SysMessage | AppMessage;

export function isSysMessage(m: unknown): m is SysMessage {
    return !!m && typeof m === 'object' && (m as ProcMessage).ch === 'sys';
}

export function isAppMessage(m: unknown): m is AppMessage {
    return !!m && typeof m === 'object' && (m as ProcMessage).ch === 'app';
}
