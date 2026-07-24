/**
 * HadOS zero-touch demo-video pipeline.
 *
 *   ElevenLabs TTS (per scene, up front) ─┐
 *   Playwright (scenes paced to the VO) ──┤─► FFmpeg ─► burned subtitles + VO ─► mp4
 *
 * Two recording modes (MODE env):
 *   - preview (default): Playwright headless recordVideo. Deterministic, runs
 *     anywhere; smooth but variable frame rate. Review choreography/subtitles.
 *   - screen: a HEADED full-screen browser captured by `ffmpeg gdigrab` at a
 *     locked 60fps — true 60fps of the live WebGL desktop. Records the real
 *     screen, so run it on your own machine and do not touch it until it ends.
 *     It captures only the HadOS monitor's region (see captureRegion) and forces
 *     true fullscreen via CDP so nothing else is in frame.
 *
 * The narration is generated FIRST, so each scene can hold until its voiceover
 * finishes — clips never overlap. Voiceover needs ELEVENLABS_API_KEY in a
 * gitignored .env; without it the video renders silent, subtitles only.
 */
import { chromium, type Page, type Browser } from 'playwright-core';
import { spawn, ChildProcess, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateSceneAudios, hasElevenLabsKey, type GeneratedClip } from './tts-elevenlabs';

// ---- Config -----------------------------------------------------------------
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const MODE = (process.env.MODE || 'preview') as 'preview' | 'screen';
const WIDTH = Number(process.env.WIDTH || 1920);
const HEIGHT = Number(process.env.HEIGHT || 1080);
const FPS = Number(process.env.FPS || 60);
const GAP_SEC = 0.7; // silence between narration lines

const OUTPUT_DIR = path.resolve(process.cwd(), 'docs', 'videos');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const TEMP_DIR = path.join(OUTPUT_DIR, 'temp');
const SRT_PATH = path.join(OUTPUT_DIR, 'subs.srt');
const FINAL_MP4 = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p.mp4`);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const estReadSec = (text: string) => Math.max(2.5, Math.min(9, text.length * 0.06));

/** Minimal .env loader (tsx/node do not read .env). Real env vars win. */
function loadEnv(): void {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return;
    for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const k = line.slice(0, eq).trim();
        let v = line.slice(eq + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        if (k && process.env[k] === undefined) process.env[k] = v;
    }
    console.log('[demo] Loaded .env');
}

// ---- Dev server -------------------------------------------------------------
async function ensureServer(): Promise<ChildProcess | null> {
    try { if ((await fetch(BASE_URL)).ok) { console.log(`[demo] Server already running at ${BASE_URL}`); return null; } }
    catch { /* not running */ }
    console.log('[demo] Starting Vite dev server...');
    const proc = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(PORT)], { shell: true, stdio: 'pipe' });
    for (let i = 0; i < 40; i++) {
        await sleep(1000);
        try { if ((await fetch(BASE_URL)).ok) { console.log('[demo] Server ready'); return proc; } } catch { /* poll */ }
    }
    throw new Error('Failed to start dev server');
}

// ---- Scenes -----------------------------------------------------------------
interface SceneDef { id: string; text: string; run: (page: Page) => Promise<void>; }
interface SceneMark { id: string; text: string; startTimeSec: number; }

const has = async (page: Page, sel: string) => (await page.locator(sel).count()) > 0;
async function open(page: Page, iconSel: string, winSel: string): Promise<boolean> {
    if (!(await has(page, iconSel))) return false;
    await page.locator(iconSel).dblclick();
    try { await page.waitForSelector(winSel, { state: 'visible', timeout: 8000 }); } catch { return false; }
    return true;
}

/** The tour. Each `run` performs the visible actions; the driver holds the scene
 *  until its narration finishes, so audio never overlaps. */
const SCENES: SceneDef[] = [
    {
        id: 's1_boot',
        text: 'This is HadOS — a complete desktop environment that runs entirely in your browser, with a process kernel, a virtual file system, and a GPU-rendered wallpaper.',
        run: async (page) => { await page.waitForSelector('#desktop', { state: 'visible', timeout: 30000 }); },
    },
    {
        id: 's2_start',
        text: 'The start menu unifies system tools, accessories, and on-device AI apps.',
        run: async (page) => {
            await page.click('#start-button').catch(() => {});
            const sub = page.locator('#start-menu .menu-item.has-submenu').first();
            if (await sub.count()) { await sleep(700); await sub.hover(); await sleep(900); }
            await page.click('#desktop', { position: { x: 960, y: 500 } }).catch(() => {});
        },
    },
    {
        id: 's3_filex',
        text: 'FileX is a real file explorer over a persistent virtual file system, backed by IndexedDB and O-P-F-S, with genuine storage quotas.',
        run: async (page) => { await open(page, '#icon-explorer', '#win-explorer'); },
    },
    {
        id: 's4_notepad',
        text: 'Notapad edits files with find and replace, and an on-device AI menu that summarizes, rewrites, and translates — no server, no data leaving the machine.',
        run: async (page) => {
            if (!(await open(page, '#icon-notepad', '#win-notepad'))) return;
            const ta = page.locator('#win-notepad textarea, #win-notepad .notepad-editor').first();
            if (await ta.count()) { await ta.focus(); await ta.type('HadOS runs on-device AI: summarize, rewrite, translate — all local.', { delay: 22 }); }
        },
    },
    {
        id: 's5_pinta',
        text: 'Pinta is a full paint app with real canvas tools, undo, and on-device background removal.',
        run: async (page) => {
            if (!(await open(page, '#icon-paint', '#win-paint'))) return;
            const box = await page.locator('#win-paint canvas').first().boundingBox().catch(() => null);
            if (!box) return;
            const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
            await page.mouse.move(cx - 130, cy); await page.mouse.down();
            for (let a = 0; a <= 360; a += 8) { const r = (a * Math.PI) / 180; await page.mouse.move(cx + 130 * Math.cos(r), cy + 95 * Math.sin(r)); await sleep(10); }
            await page.mouse.up();
        },
    },
    {
        id: 's6_tavern',
        text: 'Tavern Chat holds a real conversation with on-device characters, running a local language model right in the browser.',
        run: async (page) => { await open(page, '#icon-messenger', '#win-messenger, [id^="win-dynamic"]'); },
    },
    {
        id: 's7_nova',
        text: 'Nova pulls live Hacker News into a clean reading view, with on-device summaries when a local model is loaded.',
        run: async (page) => { await open(page, '#icon-hnscout', '#win-hnscout, [id^="win-dynamic"]'); },
    },
    {
        id: 's8_theme',
        text: 'One click switches themes. The Modern theme reveals the HadOS grid shader — an animated technical wallpaper, drawn in Web-G-L.',
        run: async (page) => {
            await page.evaluate(() => {
                document.body.classList.remove('theme-hados');
                document.body.classList.add('theme-modern');
                document.body.setAttribute('data-theme', 'modern');
                localStorage.setItem('os-theme', 'modern');
                (window as any).Services?.get?.('ThemeManager')?.applyTheme?.('modern');
            });
        },
    },
    {
        id: 's9_outro',
        text: 'And a 3D physics ragdoll lives on the desktop. HadOS: a browser that thinks it is an operating system.',
        run: async (page) => { const b = page.locator('#ragdollToggle'); if (await b.count()) await b.click().catch(() => {}); },
    },
];

/** Runs the scenes, holding each until its narration length (or reading time)
 *  elapses, and stamps each scene's start time relative to `t0`. */
async function choreograph(page: Page, t0: number, durations: Map<string, number>): Promise<SceneMark[]> {
    const marks: SceneMark[] = [];
    for (const sc of SCENES) {
        const start = (Date.now() - t0) / 1000;
        marks.push({ id: sc.id, text: sc.text, startTimeSec: Math.max(0, start) });
        await sc.run(page);
        const elapsed = (Date.now() - t0) / 1000 - start;
        const need = (durations.get(sc.id) ?? estReadSec(sc.text)) + GAP_SEC;
        if (elapsed < need) await sleep((need - elapsed) * 1000);
    }
    return marks;
}

// ---- Subtitles (.srt) -------------------------------------------------------
function toSrtTime(sec: number): string {
    const ms = Math.max(0, Math.round(sec * 1000));
    const p = (n: number, w = 2) => String(n).padStart(w, '0');
    return `${p(Math.floor(ms / 3_600_000))}:${p(Math.floor((ms % 3_600_000) / 60_000))}:${p(Math.floor((ms % 60_000) / 1000))},${p(ms % 1000, 3)}`;
}

function writeSrt(marks: SceneMark[], durations: Map<string, number>, totalSec: number): void {
    const lines: string[] = [];
    marks.forEach((m, i) => {
        const start = m.startTimeSec;
        const nextStart = i + 1 < marks.length ? marks[i + 1]!.startTimeSec : totalSec;
        const dur = (durations.get(m.id) ?? estReadSec(m.text)) + 0.3;
        const end = Math.min(nextStart - 0.15, start + dur);
        lines.push(String(i + 1), `${toSrtTime(start)} --> ${toSrtTime(Math.max(start + 1.2, end))}`, m.text, '');
    });
    fs.writeFileSync(SRT_PATH, lines.join('\n'), 'utf8');
    console.log(`[demo] Subtitles written (${marks.length} cues)`);
}

// ---- FFmpeg composite -------------------------------------------------------
interface PlacedClip extends GeneratedClip { startTimeSec: number; }

function composite(rawVideo: string, clips: PlacedClip[]): void {
    const style = "force_style='FontName=Segoe UI,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H90000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=48'";
    const subsFilter = fs.existsSync(SRT_PATH) ? `subtitles='subs.srt':${style}` : null;

    const inputs = [`-i "${rawVideo}"`, ...clips.map(c => `-i "${c.audioPath}"`)].join(' ');
    const parts: string[] = [];
    parts.push(`[0:v]${['fps=' + FPS, subsFilter, 'format=yuv420p'].filter(Boolean).join(',')}[v]`);

    let audioMap = '';
    if (clips.length) {
        clips.forEach((c, i) => { const d = Math.round(c.startTimeSec * 1000); parts.push(`[${i + 1}:a]adelay=${d}|${d}[a${i}]`); });
        parts.push(`${clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${clips.length}:dropout_transition=0:normalize=0[a]`);
        audioMap = '-map "[a]" -c:a aac -b:a 192k';
    }

    const cmd = `ffmpeg -y ${inputs} -filter_complex "${parts.join(';')}" -map "[v]" ${audioMap} ` +
        `-c:v libx264 -preset slow -crf 18 -r ${FPS} -pix_fmt yuv420p "${FINAL_MP4}"`;
    console.log(`[demo] FFmpeg composite:\n${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: OUTPUT_DIR });
}

// ---- Capture region (screen mode) -------------------------------------------
/**
 * The screen region to capture, in PHYSICAL pixels — the HadOS monitor only, so
 * a multi-monitor desktop does not record every screen (`-i desktop` alone grabs
 * the whole virtual desktop, e.g. 8320×2320 across three monitors). Auto-detected
 * from the fullscreen window's monitor; override with CAPTURE_X/Y/W/H.
 */
async function captureRegion(page: Page): Promise<{ x: number; y: number; w: number; h: number }> {
    const auto = await page.evaluate(() => {
        const dpr = window.devicePixelRatio || 1;
        return { x: Math.round(window.screenX * dpr), y: Math.round(window.screenY * dpr), w: Math.round(window.screen.width * dpr), h: Math.round(window.screen.height * dpr) };
    });
    const num = (k: string, d: number) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
    const r = { x: num('CAPTURE_X', auto.x), y: num('CAPTURE_Y', auto.y), w: num('CAPTURE_W', auto.w), h: num('CAPTURE_H', auto.h) };
    r.w -= r.w % 2; r.h -= r.h % 2;
    return r;
}

// ---- Recording modes --------------------------------------------------------
async function recordPreview(durations: Map<string, number>): Promise<{ rawVideo: string; marks: SceneMark[]; totalSec: number }> {
    console.log(`[demo] MODE=preview — Playwright headless recordVideo @ ${WIDTH}x${HEIGHT}`);
    const browser: Browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: WIDTH, height: HEIGHT },
        recordVideo: { dir: TEMP_DIR, size: { width: WIDTH, height: HEIGHT } },
        locale: 'en-US',
    });
    const page = await context.newPage();
    const t0 = Date.now();
    await page.goto(BASE_URL);
    let marks: SceneMark[] = [];
    try { marks = await choreograph(page, t0, durations); }
    finally { await context.close(); await browser.close(); }

    const totalSec = (Date.now() - t0) / 1000;
    const webm = fs.readdirSync(TEMP_DIR).find(f => f.endsWith('.webm'));
    if (!webm) throw new Error('No recorded webm found');
    const rawVideo = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p-raw.webm`);
    fs.copyFileSync(path.join(TEMP_DIR, webm), rawVideo);
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    return { rawVideo, marks, totalSec };
}

async function recordScreen(durations: Map<string, number>): Promise<{ rawVideo: string; marks: SceneMark[]; totalSec: number }> {
    console.log(`[demo] MODE=screen — headed fullscreen + ffmpeg gdigrab @ ${FPS}fps (do NOT touch the machine)`);
    const rawVideo = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p-raw.mp4`);
    const browser = await chromium.launch({ headless: false, args: ['--start-fullscreen', '--kiosk', '--disable-infobars'] });
    const context = await browser.newContext({ viewport: null, locale: 'en-US' });
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await page.waitForSelector('#desktop', { state: 'visible', timeout: 30000 });

    // Force TRUE fullscreen (Playwright's --kiosk/--start-fullscreen is unreliable;
    // without this the browser records windowed, with the rest of the monitor in frame).
    try {
        const cdp = await context.newCDPSession(page);
        const { windowId } = await cdp.send('Browser.getWindowForTarget') as any;
        await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'fullscreen' } } as any);
    } catch (e) { console.warn('[demo] Could not force fullscreen via CDP:', e); }
    await sleep(1500);

    const reg = await captureRegion(page);
    console.log(`[demo] Capturing region ${reg.w}x${reg.h} at (${reg.x},${reg.y}) — override with CAPTURE_X/Y/W/H`);
    const ff = spawn('ffmpeg', [
        '-y', '-f', 'gdigrab', '-framerate', String(FPS),
        '-offset_x', String(reg.x), '-offset_y', String(reg.y), '-video_size', `${reg.w}x${reg.h}`, '-i', 'desktop',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-r', String(FPS), rawVideo,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    await sleep(1200);
    const t0 = Date.now();

    let marks: SceneMark[] = [];
    try { marks = await choreograph(page, t0, durations); }
    finally {
        try { ff.stdin?.write('q'); } catch { /* ignore */ }
        await new Promise<void>(res => ff.on('close', () => res()));
        await context.close(); await browser.close();
    }
    return { rawVideo, marks, totalSec: (Date.now() - t0) / 1000 };
}

// ---- Main -------------------------------------------------------------------
async function main() {
    loadEnv();
    for (const d of [OUTPUT_DIR, AUDIO_DIR]) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

    const server = await ensureServer();
    try {
        // 1) Narration first, so scenes can be paced to it (no overlap).
        const audio: GeneratedClip[] = hasElevenLabsKey()
            ? await generateSceneAudios(SCENES.map(s => ({ id: s.id, text: s.text })), AUDIO_DIR)
            : (console.warn('[demo] No ELEVENLABS_API_KEY — silent render, subtitles only.'), []);
        const durations = new Map(audio.map(c => [c.id, c.durationSec]));

        // 2) Record, holding each scene until its line finishes.
        const rec = MODE === 'screen' ? await recordScreen(durations) : await recordPreview(durations);
        console.log(`[demo] Recorded ${rec.marks.length} scenes over ${rec.totalSec.toFixed(1)}s -> ${rec.rawVideo}`);

        // 3) Place each clip at its scene's start, write subs, composite.
        const startOf = new Map(rec.marks.map(m => [m.id, m.startTimeSec]));
        const placed: PlacedClip[] = audio.map(c => ({ ...c, startTimeSec: startOf.get(c.id) ?? 0 }));
        writeSrt(rec.marks, durations, rec.totalSec);
        composite(rec.rawVideo, placed);

        console.log(`\n[demo] Done -> ${FINAL_MP4}`);
    } finally {
        if (server) server.kill();
    }
}

main().catch(err => { console.error('[demo] Pipeline failed:', err); process.exit(1); });
