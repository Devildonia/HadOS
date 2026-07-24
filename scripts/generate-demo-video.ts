/**
 * HadOS zero-touch demo-video pipeline.
 *
 *   Playwright (scripted scenes)  ->  raw video
 *              |                           |
 *   scene timeline (id, text, t)    ElevenLabs TTS (optional)
 *              |                           |
 *              +----------- FFmpeg --------+  -> burned subtitles + mixed VO -> final mp4
 *
 * Two recording modes (MODE env):
 *   - preview (default): Playwright headless recordVideo. Deterministic, runs
 *     anywhere (CI, this workspace). Smooth but variable frame rate — use it to
 *     review choreography, subtitles and pacing.
 *   - screen: a HEADED, full-screen (kiosk) browser captured by `ffmpeg gdigrab`
 *     at a locked 60fps. True 60fps of the live WebGL desktop, but it records the
 *     real screen: run it on your own machine, full-screen, and do not touch the
 *     machine until it finishes. gdigrab must grab the *desktop*, not the window
 *     title — GPU/WebGL windows capture black under title mode.
 *
 * Voiceover needs ELEVENLABS_API_KEY in a gitignored .env; without it the video
 * is rendered silent with subtitles only.
 */
import { chromium, type Page, type Browser } from 'playwright-core';
import { spawn, ChildProcess, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateSceneAudios, hasElevenLabsKey, type SceneSpeech, type GeneratedClip } from './tts-elevenlabs';

// ---- Config -----------------------------------------------------------------
const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const MODE = (process.env.MODE || 'preview') as 'preview' | 'screen';
const WIDTH = Number(process.env.WIDTH || 1920);
const HEIGHT = Number(process.env.HEIGHT || 1080);
const FPS = Number(process.env.FPS || 60);

const OUTPUT_DIR = path.resolve(process.cwd(), 'docs', 'videos');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const TEMP_DIR = path.join(OUTPUT_DIR, 'temp');
const SRT_PATH = path.join(OUTPUT_DIR, 'subs.srt');
const FINAL_MP4 = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p.mp4`);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Minimal .env loader (no dependency). tsx/node do not read .env on their own,
 * so without this a key placed in .env would be silently ignored and the video
 * would render mute. Real env vars already set win over the file.
 */
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
    try {
        if ((await fetch(BASE_URL)).ok) {
            console.log(`[demo] Server already running at ${BASE_URL}`);
            return null;
        }
    } catch { /* not running */ }

    console.log('[demo] Starting Vite dev server...');
    const proc = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(PORT)], { shell: true, stdio: 'pipe' });
    for (let i = 0; i < 40; i++) {
        await sleep(1000);
        try { if ((await fetch(BASE_URL)).ok) { console.log('[demo] Server ready'); return proc; } } catch { /* keep polling */ }
    }
    throw new Error('Failed to start dev server');
}

// ---- Scene choreography -----------------------------------------------------
/**
 * Drives the OS and records a scene timeline. `mark` stamps the current elapsed
 * time (seconds since recording start) with the narration for that beat. Every
 * app open is guarded so a missing app skips its scene rather than failing.
 */
async function choreograph(page: Page, t0: number): Promise<SceneSpeech[]> {
    const scenes: SceneSpeech[] = [];
    const mark = (id: string, text: string) => {
        scenes.push({ id, text, startTimeSec: Math.max(0, (Date.now() - t0) / 1000) });
    };
    const has = async (sel: string) => (await page.locator(sel).count()) > 0;
    const open = async (iconSel: string, winSel: string) => {
        if (!(await has(iconSel))) return false;
        await page.locator(iconSel).dblclick();
        try { await page.waitForSelector(winSel, { state: 'visible', timeout: 8000 }); } catch { return false; }
        return true;
    };

    // 1 — Boot & the technical-grid desktop (starts on the glass HadOS theme).
    mark('s1_boot', 'This is HadOS — a complete desktop environment that runs entirely in your browser, with a process kernel, a virtual file system, and a GPU-rendered wallpaper.');
    await page.waitForSelector('#desktop', { state: 'visible', timeout: 30000 });
    await sleep(4500);

    // 2 — Start menu.
    mark('s2_start', 'The start menu unifies system tools, accessories, and on-device AI apps.');
    await page.click('#start-button').catch(() => {});
    await sleep(1400);
    const sub = page.locator('#start-menu .menu-item.has-submenu').first();
    if (await sub.count()) { await sub.hover(); await sleep(1800); }
    await page.click('#desktop', { position: { x: 960, y: 500 } }).catch(() => {});
    await sleep(900);

    // 3 — FileX explorer & the virtual file system.
    mark('s3_filex', 'FileX is a real file explorer over a persistent virtual file system, backed by IndexedDB and O-P-F-S, with genuine storage quotas.');
    if (await open('#icon-explorer', '#win-explorer')) await sleep(2600);

    // 4 — Notapad with on-device AI.
    mark('s4_notepad', 'Notapad edits files with find and replace, and an on-device AI menu that summarizes, rewrites, and translates — no server, no data leaving the machine.');
    if (await open('#icon-notepad', '#win-notepad')) {
        const ta = page.locator('#win-notepad textarea, #win-notepad .notepad-editor').first();
        if (await ta.count()) {
            await ta.focus();
            await ta.type('HadOS runs on-device AI: summarize, rewrite, translate — all local.', { delay: 22 });
        }
        await sleep(2400);
    }

    // 5 — Pinta drawing on canvas.
    mark('s5_pinta', 'Pinta is a full paint app with real canvas tools, undo, and on-device background removal.');
    if (await open('#icon-paint', '#win-paint')) {
        const canvas = page.locator('#win-paint canvas').first();
        const box = await canvas.boundingBox().catch(() => null);
        if (box) {
            const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
            await page.mouse.move(cx - 130, cy);
            await page.mouse.down();
            for (let a = 0; a <= 360; a += 8) {
                const r = (a * Math.PI) / 180;
                await page.mouse.move(cx + 130 * Math.cos(r), cy + 95 * Math.sin(r));
                await sleep(12);
            }
            await page.mouse.up();
        }
        await sleep(1800);
    }

    // 6 — Tavern Chat: on-device conversational AI.
    mark('s6_tavern', 'Tavern Chat holds a real conversation with on-device characters, running a local language model right in the browser.');
    if (await open('#icon-messenger', '#win-messenger, [id^="win-dynamic"]')) await sleep(2600);

    // 7 — Nova: live Hacker News reader (on-device summaries when a model is loaded).
    mark('s7_nova', 'Nova pulls live Hacker News into a clean reading view, with on-device summaries when a local model is loaded.');
    if (await open('#icon-hnscout', '#win-hnscout, [id^="win-dynamic"]')) await sleep(2600);

    // 8 — Switch to the Modern theme: the HadOS grid shader.
    mark('s8_theme', 'One click switches themes. The Modern theme reveals the HadOS grid shader — an animated technical wallpaper, drawn in Web-G-L.');
    await page.evaluate(() => {
        document.body.classList.remove('theme-hados');
        document.body.classList.add('theme-modern');
        document.body.setAttribute('data-theme', 'modern');
        localStorage.setItem('os-theme', 'modern');
        (window as any).Services?.get?.('ThemeManager')?.applyTheme?.('modern');
    });
    await sleep(4500);

    // 9 — Ragdoll physics pet & outro.
    mark('s9_outro', 'And a 3D physics ragdoll lives on the desktop. HadOS: a browser that thinks it is an operating system.');
    const ragBtn = page.locator('#ragdollToggle');
    if (await ragBtn.count()) { await ragBtn.click().catch(() => {}); await sleep(3500); }
    else await sleep(2500);

    return scenes;
}

// ---- Subtitles (.srt) -------------------------------------------------------
function toSrtTime(sec: number): string {
    const ms = Math.max(0, Math.round(sec * 1000));
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1000);
    const mmm = ms % 1000;
    const p = (n: number, w = 2) => String(n).padStart(w, '0');
    return `${p(h)}:${p(m)}:${p(s)},${p(mmm, 3)}`;
}

/**
 * End of each cue. With a voiceover, run for the VO's length; without one, run
 * for an estimated reading time — either way capped to just before the next
 * scene, so a slow (e.g. headless) gap never leaves a subtitle lingering.
 */
function writeSrt(scenes: SceneSpeech[], clips: GeneratedClip[], totalSec: number): void {
    const durOf = new Map(clips.map(c => [c.id, c.durationSec]));
    const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
    const lines: string[] = [];
    scenes.forEach((sc, i) => {
        const start = sc.startTimeSec;
        const nextStart = i + 1 < scenes.length ? scenes[i + 1]!.startTimeSec : totalSec;
        const vo = durOf.get(sc.id) || 0;
        const readTime = clamp(sc.text.length * 0.06, 2.5, 8); // ~word-per-sec fallback
        const baseDur = vo > 0 ? vo + 0.3 : readTime;
        const end = Math.min(nextStart - 0.15, start + baseDur);
        lines.push(String(i + 1));
        lines.push(`${toSrtTime(start)} --> ${toSrtTime(Math.max(start + 1.2, end))}`);
        lines.push(sc.text);
        lines.push('');
    });
    fs.writeFileSync(SRT_PATH, lines.join('\n'), 'utf8');
    console.log(`[demo] Subtitles written: ${SRT_PATH} (${scenes.length} cues)`);
}

// ---- FFmpeg composite -------------------------------------------------------
/** Burn subtitles + mix delayed per-scene VO onto the raw recording -> mp4. */
function composite(rawVideo: string, clips: GeneratedClip[]): void {
    // Subtitles are referenced by basename with cwd=OUTPUT_DIR, dodging Windows
    // path/colon escaping inside the filter graph.
    const style = "force_style='FontName=Segoe UI,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H90000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=48'";
    const subsFilter = fs.existsSync(SRT_PATH) ? `subtitles='subs.srt':${style}` : null;

    const inputs = [`-i "${rawVideo}"`, ...clips.map(c => `-i "${c.audioPath}"`)].join(' ');
    const parts: string[] = [];

    // Video chain: force 60fps + burn subs, yuv420p for universal playback.
    const vChain = ['fps=' + FPS, subsFilter, 'format=yuv420p'].filter(Boolean).join(',');
    parts.push(`[0:v]${vChain}[v]`);

    // Audio chain: delay each VO to its scene start, then mix.
    let audioMap = '';
    if (clips.length) {
        clips.forEach((c, i) => {
            const d = Math.round(c.startTimeSec * 1000);
            parts.push(`[${i + 1}:a]adelay=${d}|${d}[a${i}]`);
        });
        parts.push(`${clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${clips.length}:dropout_transition=0:normalize=0[a]`);
        audioMap = '-map "[a]" -c:a aac -b:a 192k';
    }

    const cmd = `ffmpeg -y ${inputs} -filter_complex "${parts.join(';')}" -map "[v]" ${audioMap} ` +
        `-c:v libx264 -preset slow -crf 18 -r ${FPS} -pix_fmt yuv420p "${FINAL_MP4}"`;

    console.log(`[demo] FFmpeg composite:\n${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: OUTPUT_DIR });
}

// ---- Recording modes --------------------------------------------------------
async function recordPreview(): Promise<{ rawVideo: string; scenes: SceneSpeech[]; totalSec: number }> {
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

    let scenes: SceneSpeech[] = [];
    try { scenes = await choreograph(page, t0); }
    finally { await context.close(); await browser.close(); }

    const totalSec = (Date.now() - t0) / 1000;
    const webm = fs.readdirSync(TEMP_DIR).find(f => f.endsWith('.webm'));
    if (!webm) throw new Error('No recorded webm found');
    const rawVideo = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p-raw.webm`);
    fs.copyFileSync(path.join(TEMP_DIR, webm), rawVideo);
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    return { rawVideo, scenes, totalSec };
}

async function recordScreen(): Promise<{ rawVideo: string; scenes: SceneSpeech[]; totalSec: number }> {
    console.log(`[demo] MODE=screen — headed kiosk + ffmpeg gdigrab @ ${FPS}fps (do not touch the machine)`);
    const rawVideo = path.join(OUTPUT_DIR, `hados-demo-${HEIGHT}p-raw.mp4`);
    const browser = await chromium.launch({
        headless: false,
        args: ['--start-fullscreen', '--kiosk', '--disable-infobars', `--window-size=${WIDTH},${HEIGHT}`],
    });
    const context = await browser.newContext({ viewport: null, locale: 'en-US' });
    const page = await context.newPage();
    await page.goto(BASE_URL);
    await page.waitForSelector('#desktop', { state: 'visible', timeout: 30000 });
    await sleep(1500); // let the window settle full-screen

    // Capture the whole desktop (GPU/WebGL content only composites there).
    const ff = spawn('ffmpeg', [
        '-y', '-f', 'gdigrab', '-framerate', String(FPS), '-i', 'desktop',
        '-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-r', String(FPS), rawVideo,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });
    await sleep(1200); // let the recorder spin up
    const t0 = Date.now();

    let scenes: SceneSpeech[] = [];
    try { scenes = await choreograph(page, t0); }
    finally {
        try { ff.stdin?.write('q'); } catch { /* ignore */ }
        await new Promise<void>(res => ff.on('close', () => res()));
        await context.close(); await browser.close();
    }
    const totalSec = (Date.now() - t0) / 1000;
    return { rawVideo, scenes, totalSec };
}

// ---- Main -------------------------------------------------------------------
async function main() {
    loadEnv();
    for (const d of [OUTPUT_DIR, AUDIO_DIR]) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

    const server = await ensureServer();
    try {
        const { rawVideo, scenes, totalSec } = MODE === 'screen' ? await recordScreen() : await recordPreview();
        console.log(`[demo] Recorded ${scenes.length} scenes over ${totalSec.toFixed(1)}s -> ${rawVideo}`);

        const clips = hasElevenLabsKey()
            ? await generateSceneAudios(scenes, AUDIO_DIR)
            : (console.warn('[demo] No ELEVENLABS_API_KEY — silent render, subtitles only.'), [] as GeneratedClip[]);

        writeSrt(scenes, clips, totalSec);
        composite(rawVideo, clips);

        console.log(`\n[demo] Done -> ${FINAL_MP4}`);
    } finally {
        if (server) server.kill();
    }
}

main().catch(err => { console.error('[demo] Pipeline failed:', err); process.exit(1); });
