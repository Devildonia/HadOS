/**
 * SYSCALL BROKER (host side)
 * Mediates an isolated process's access to real system services over its
 * dedicated IPC channel. A process can't touch the VFS/Notify directly (it runs
 * in a Worker/iframe); it issues syscalls (`fs.read`, `fs.write`, `notify`,
 * `sys.log`) which the broker executes on the host after a guard check.
 *
 * Guards (Fase 2): a per-process capability set (which syscalls are allowed) and
 * an `fsRoot` that confines fs.* paths. Fase 3 replaces the static set with a
 * capability/consent broker and per-app home directories. Phase 2 of the roadmap.
 */

import { Utils } from '../utils';
import { Services } from './ServiceContainer';
import { VFS } from './VFS';
import { PermissionBroker } from './PermissionBroker';
import { AiService, AI_CAPABILITY } from '../ai/AiService';
import { toFloat32 } from '../ai/aiRuntimeHandlers';
import type { WorkerProcess } from './WorkerProcess';

/**
 * Represents the execution context tracking isolated process credentials during syscall execution.
 */
export interface SyscallContext {
    /** Target app package identifier. */
    appId: string;
    /** Process Identifier. */
    pid: number;
    /** Virtual root path confining all filesystem operations (app home dir). */
    fsRoot: string;
}

/** The default system calls served by the broker. */
export const DEFAULT_SYSCALLS = ['sys.log', 'notify', 'fs.read', 'fs.list', 'fs.write', 'ai.loadModel', 'ai.infer'] as const;

/**
 * Capability required by each syscall. `null` = always allowed (no consent).
 * fs.read/fs.list share `fs:read`; fs.write is `fs:write`. Consent is per capability.
 * ai.loadModel/ai.infer share `ai:infer` — loading is what downloads the model, so
 * splitting them would prompt twice for one user-visible action.
 */
const SYSCALL_CAPABILITY: Record<string, string | null> = {
    'sys.log': null,
    'notify': 'notify',
    'fs.read': 'fs:read',
    'fs.list': 'fs:read',
    'fs.write': 'fs:write',
    'ai.loadModel': AI_CAPABILITY,
    'ai.infer': AI_CAPABILITY,
};

type Args = Record<string, unknown>;

/**
 * Coerces an unknown argument property value into a string.
 * @param v Input value.
 */
function asString(v: unknown): string {
    return typeof v === 'string' ? v : '';
}

/** Notification levels a process may request. Anything else is refused so a
 *  guest can't reach prototype members via `notify[level]`. */
const NOTIFY_LEVELS = new Set(['info', 'success', 'warn', 'error']);

/**
 * Enforces VFS root confinement constraints, preventing directory traversal escapes.
 * @param path Canonical VFS path to evaluate.
 * @param ctx Target execution context.
 */
function assertInRoot(path: string, ctx: SyscallContext): void {
    if (Utils.hasTraversal(path)) {
        throw new Error(`fs access denied (path traversal): ${path}`);
    }
    const norm = Utils.normalizeVfsPath(path);
    const root = Utils.normalizeVfsPath(ctx.fsRoot);
    if (norm !== root && !norm.startsWith(root + '\\')) {
        throw new Error(`fs access denied outside ${ctx.fsRoot}: ${path}`);
    }
}

/** Syscall handlers implementation dictionary mapping syscall keys to execution functions. */
const HANDLERS: Record<string, (args: Args, ctx: SyscallContext) => unknown | Promise<unknown>> = {
    /** Logs messages output from isolated processes onto the system logger. */
    'sys.log': (args, ctx) => {
        Utils.Logger.log(`[proc ${ctx.pid} ${ctx.appId}] ${asString(args.message)}`);
        return true;
    },
    /** Generates system notifications requested by guest applications. */
    'notify': (args) => {
        const notify = Services.get('Notify');
        if (!notify) return true;
        const requested = asString(args.level);
        // Allow-list the level: an arbitrary string would let a guest reach
        // prototype members (constructor, toString…) through the index access.
        const level = NOTIFY_LEVELS.has(requested) ? requested : 'info';
        (notify as unknown as Record<string, (m: string) => void>)[level]!(asString(args.message));
        return true;
    },
    /** Reads file contents requested by guest applications. Confined to fsRoot. */
    'fs.read': (args, ctx) => {
        const path = asString(args.path);
        assertInRoot(path, ctx);
        return VFS.readFileAsync(path);
    },
    /** Lists directory entries requested by guest applications. Confined to fsRoot. */
    'fs.list': (args, ctx) => {
        const path = asString(args.path);
        assertInRoot(path, ctx);
        return VFS.listDir(path);
    },
    /** Writes data contents requested by guest applications. Confined to fsRoot. */
    'fs.write': async (args, ctx) => {
        const dir = asString(args.path);
        const name = asString(args.name);
        assertInRoot(dir, ctx);
        const ok = await VFS.writeFileAsync(dir, name, args.content as string | Blob);
        return ok;
    },
    /**
     * ai.* run the app's work on the shared `ai-runtime` process.
     *
     * The guest names a model by id, never by URL: `AiService` resolves it against
     * the registry allowlist. Handing a guest control of the URL would turn this
     * syscall into a download primitive on the OS's origin.
     */
    /** Triggers AI model loading routine for the calling app. */
    'ai.loadModel': (args, ctx) => AiService.loadModel(ctx.appId, asString(args.id)),
    /** Runs model inference work against inputs for the calling app. */
    'ai.infer': async (args, ctx) => {
        const input = toFloat32(args.input);
        const shape = Array.isArray(args.shape) ? args.shape.map(Number) : [];
        const out = await AiService.infer(ctx.appId, asString(args.id), input, shape);
        return { data: out.data, shape: out.shape };
    },
};

/**
 * Registers the syscall handlers on a process handle. Every call is guarded by
 * the context's capability set before dispatch.
 * @param proc Target isolated worker process handle.
 * @param ctx Context credentials tracking app package details.
 */
export function attachSyscalls(proc: WorkerProcess, ctx: SyscallContext): void {
    for (const name of Object.keys(HANDLERS)) {
        proc.onRequest(name, async (payload) => {
            // Consent gate: capability-bearing syscalls require a user grant
            // (prompted on first use, then remembered) via the PermissionBroker.
            const cap = SYSCALL_CAPABILITY[name];
            if (cap && !(await PermissionBroker.check(ctx.appId, cap))) {
                throw new Error(`permission denied: ${cap}`);
            }
            return HANDLERS[name]!((payload ?? {}) as Args, ctx);
        });
    }
}
