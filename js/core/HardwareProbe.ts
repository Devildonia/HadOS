/**
 * HARDWARE PROBE
 * Reads what the browser is willing to tell us about the real machine, so the
 * POST screen reports this PC instead of a hardcoded 1995 fantasy.
 *
 * Everything here is best-effort and read-only:
 *   - No API is required. Each probe degrades to 'Unknown' / 'Not reported'
 *     rather than throwing, because a BIOS screen must never block the boot.
 *   - The values stay on the machine; nothing is sent anywhere.
 *
 * Accuracy caveats worth knowing when reading the screen:
 *   - navigator.deviceMemory is deliberately coarse and CAPPED AT 8 GB by the
 *     spec (anti-fingerprinting), so a 32 GB PC honestly reports 8 GB. Chromium
 *     only; Firefox and Safari do not implement it at all.
 *   - There is no clock-speed API. We do not invent one.
 *   - The GPU string comes from WEBGL_debug_renderer_info, which some browsers
 *     (and privacy modes) mask or omit.
 */

export interface HardwareReport {
    cpu: string;
    memory: string;
    gpu: string;
    display: string;
    storage: string;
    network: string;
    pointer: string;
    host: string;
}

/** Chromium-only UA Client Hints — typed loosely; absent elsewhere. */
interface UADataValues {
    architecture?: string;
    bitness?: string;
    platform?: string;
    platformVersion?: string;
    model?: string;
}

interface NavigatorUAData {
    platform?: string;
    getHighEntropyValues?(hints: string[]): Promise<UADataValues>;
}

/** Nothing here may hang the boot: a probe that stalls resolves to a fallback. */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
    return Promise.race([
        promise.catch(() => fallback),
        new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
    ]);
}

function bytesToUnit(bytes: number): string {
    const gb = bytes / 1024 ** 3;
    if (gb >= 1) return `${gb.toFixed(gb >= 10 ? 0 : 1)}GB`;
    return `${Math.round(bytes / 1024 ** 2)}MB`;
}

/**
 * Chromium reports Windows through UA Client Hints as a compatibility number
 * ("15.0.0"), not a marketing one. 13+ means Windows 11; 1-12 means Windows 10.
 * https://learn.microsoft.com/microsoft-edge/web-platform/how-to-detect-win11
 */
function prettyPlatform(platform: string, version: string): string {
    if (platform === 'Windows' && version) {
        const major = parseInt(version.split('.')[0] ?? '', 10);
        if (!Number.isNaN(major)) {
            if (major >= 13) return `Windows 11 (${version})`;
            if (major >= 1) return `Windows 10 (${version})`;
            return `Windows 8.1 or earlier (${version})`;
        }
    }
    return version ? `${platform} ${version}` : platform;
}

/**
 * ANGLE wraps the adapter name in scaffolding:
 *   "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)"
 * Only the middle field names the card.
 */
function tidyRenderer(raw: string): string {
    const angle = raw.match(/^ANGLE \(([^,]*),\s*(.+),\s*([^,]*)\)$/);
    let name = angle?.[2] ?? raw;
    name = name
        .replace(/\s+Direct3D\d+.*$/i, '')
        .replace(/\s+vs_\d+_\d+.*$/i, '')
        .replace(/\s+\(0x[0-9A-Fa-f]+\)/, '')
        .trim();
    return name || raw;
}

function detectGPU(): string {
    try {
        const canvas = document.createElement('canvas');
        const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
        if (!gl) return 'None (WebGL unavailable)';

        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        const raw = dbg
            ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER);

        // Probing must not cost a live GL context — the desktop shader needs one.
        gl.getExtension('WEBGL_lose_context')?.loseContext();

        return raw ? tidyRenderer(String(raw)) : 'Unknown';
    } catch {
        return 'Unknown';
    }
}

function detectDisplay(): string {
    try {
        const dpr = window.devicePixelRatio || 1;
        const depth = screen.colorDepth || 24;
        const native = `${Math.round(screen.width * dpr)}x${Math.round(screen.height * dpr)}`;
        const scale = dpr !== 1 ? ` @${dpr}x` : '';
        return `${native}${scale}, ${depth}-bit`;
    } catch {
        return 'Unknown';
    }
}

function detectPointer(): string {
    const touch = navigator.maxTouchPoints ?? 0;
    if (touch > 0) return `Touch digitizer (${touch} points)`;
    return 'Mouse detected';
}

function detectNetwork(): string {
    if (!navigator.onLine) return 'Offline';
    const conn = (navigator as unknown as { connection?: { effectiveType?: string, downlink?: number } }).connection;
    if (!conn?.effectiveType) return 'Online';
    const speed = typeof conn.downlink === 'number' ? `, ~${conn.downlink}Mbps` : '';
    return `Online (${conn.effectiveType.toUpperCase()}${speed})`;
}

async function detectStorage(): Promise<string> {
    if (!navigator.storage?.estimate) return 'Quota not reported';
    const est = await navigator.storage.estimate();
    if (typeof est.quota !== 'number') return 'Quota not reported';
    const used = typeof est.usage === 'number' ? bytesToUnit(est.usage) : '?';
    return `${bytesToUnit(est.quota)} quota, ${used} used`;
}

async function detectCPUAndHost(): Promise<{ cpu: string, host: string }> {
    const cores = navigator.hardwareConcurrency;
    const coreText = cores ? `${cores} logical processors` : 'core count not reported';

    const uaData = (navigator as unknown as { userAgentData?: NavigatorUAData }).userAgentData;

    if (uaData?.getHighEntropyValues) {
        const hints = await uaData.getHighEntropyValues(['architecture', 'bitness', 'platform', 'platformVersion', 'model']);
        const arch = hints.architecture
            ? `${hints.architecture}${hints.bitness ? `-${hints.bitness}` : ''}`
            : 'Unknown architecture';
        const model = hints.model ? ` ${hints.model}` : '';
        return {
            cpu: `${arch}${model}, ${coreText}`,
            host: prettyPlatform(hints.platform ?? uaData.platform ?? 'Unknown', hints.platformVersion ?? ''),
        };
    }

    // Firefox / Safari: no UA-CH. navigator.platform is deprecated but still the
    // only thing on offer, and a BIOS line is exactly the low-stakes use for it.
    const legacy = (navigator as unknown as { platform?: string }).platform;
    return { cpu: coreText, host: legacy || 'Unknown' };
}

function detectMemory(): string {
    const gb = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (typeof gb !== 'number') return 'Not reported';
    // Rendered in KB for the POST-screen look. Capped at 8GB by the spec.
    return `${(gb * 1024 * 1024).toLocaleString('en-US').replace(/,/g, '')}KB OK`;
}

/** Fallbacks used when a probe is unavailable or the whole thing goes wrong. */
const UNKNOWN: HardwareReport = {
    cpu: 'Unknown',
    memory: 'Not reported',
    gpu: 'Unknown',
    display: 'Unknown',
    storage: 'Quota not reported',
    network: 'Unknown',
    pointer: 'Unknown',
    host: 'Unknown',
};

/**
 * Collects the report. Never rejects, and never takes longer than `budgetMs`:
 * the POST screen would rather print 'Unknown' than keep the user waiting.
 */
export async function probeHardware(budgetMs = 1500): Promise<HardwareReport> {
    try {
        const [cpuHost, storage] = await Promise.all([
            withTimeout(detectCPUAndHost(), budgetMs, { cpu: UNKNOWN.cpu, host: UNKNOWN.host }),
            withTimeout(detectStorage(), budgetMs, UNKNOWN.storage),
        ]);

        return {
            cpu: cpuHost.cpu,
            host: cpuHost.host,
            storage,
            memory: detectMemory(),
            gpu: detectGPU(),
            display: detectDisplay(),
            network: detectNetwork(),
            pointer: detectPointer(),
        };
    } catch {
        return { ...UNKNOWN };
    }
}
