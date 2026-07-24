import { chromium } from 'playwright-core';
import { spawn, ChildProcess, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { generateSceneAudios, SceneSpeech } from './tts-elevenlabs';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs', 'videos');
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const RAW_WEBM_PATH = path.join(OUTPUT_DIR, 'hados-demo-1080p-raw.webm');
const FINAL_MP4_PATH = path.join(OUTPUT_DIR, 'hados-demo-1080p.mp4');

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureServer(): Promise<ChildProcess | null> {
    try {
        const res = await fetch(BASE_URL);
        if (res.ok) {
            console.log(`[Demo 1080p] Server already running at ${BASE_URL}`);
            return null;
        }
    } catch {
        // Server not running, start it
    }

    console.log('[Demo 1080p] Starting Vite dev server...');
    const serverProcess = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(PORT)], {
        shell: true,
        stdio: 'pipe',
    });

    for (let i = 0; i < 30; i++) {
        await sleep(1000);
        try {
            const res = await fetch(BASE_URL);
            if (res.ok) {
                console.log(`[Demo 1080p] Server ready at ${BASE_URL}`);
                return serverProcess;
            }
        } catch {}
    }
    throw new Error('Failed to start dev server');
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

    const server = await ensureServer();

    console.log('[Demo 1080p] Stage 1: Launching Chromium at 1920x1080 Full HD...');
    const browser = await chromium.launch({ headless: true });

    const tempVideoDir = path.join(OUTPUT_DIR, 'temp-1080p');
    if (!fs.existsSync(tempVideoDir)) fs.mkdirSync(tempVideoDir, { recursive: true });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
        recordVideo: {
            dir: tempVideoDir,
            size: { width: 1920, height: 1080 },
        },
    });

    const page = await context.newPage();
    const startTime = Date.now();

    const getElapsedSec = () => Math.round((Date.now() - startTime) / 1000);

    const scenes: SceneSpeech[] = [];

    try {
        console.log('[Demo 1080p] Scene 1: OS Boot & Technical Grid Shader Desktop...');
        scenes.push({
            id: 'scene1_boot',
            text: 'Bienvenidos a HadOS, un sistema operativo web moderno inspirado en la arquitectura clásica, con kernel aislado y renderizado acelerado por GPU.',
            startTimeSec: getElapsedSec() + 1,
        });

        await page.goto(BASE_URL);
        await page.waitForSelector('#desktop', { state: 'visible', timeout: 30000 });
        await sleep(4000); // Allow splash screen & webgl grid shader animation to play

        console.log('[Demo 1080p] Scene 2: Start Menu & Retro App Launcher...');
        scenes.push({
            id: 'scene2_start',
            text: 'Su menú de inicio unifica herramientas del sistema, accesorios y juegos retro con una fluidez de sesenta cuadros por segundo.',
            startTimeSec: getElapsedSec() + 1,
        });

        await page.click('#start-button');
        await sleep(1500);

        const subMenuItem = page.locator('#start-menu .menu-item.has-submenu').first();
        if (await subMenuItem.count() > 0) {
            await subMenuItem.hover();
            await sleep(2000);
        }

        await page.click('#desktop', { position: { x: 800, y: 400 } });
        await sleep(1200);

        console.log('[Demo 1080p] Scene 3: Notepad App & VFS Storage...');
        scenes.push({
            id: 'scene3_notepad',
            text: 'El sistema integra un sistema de archivos virtual VFS persistente apoyado en IndexedDB y OPFS para almacenamiento de alta velocidad.',
            startTimeSec: getElapsedSec() + 1,
        });

        const notepadIcon = page.locator('#icon-notepad');
        if (await notepadIcon.count() > 0) {
            await notepadIcon.dblclick();
            await page.waitForSelector('#win-notepad', { state: 'visible', timeout: 10000 });
            await sleep(1200);

            const textarea = page.locator('#win-notepad textarea, #win-notepad .notepad-editor').first();
            if (await textarea.count() > 0) {
                await textarea.focus();
                await textarea.fill('Welcome to HadOS v1.0.0-rc.1 (1080p Full HD)\n\nKey System Highlights:\n- Isolated Process Architecture & Syscall Broker\n- IndexedDB & OPFS Async Virtual File System\n- High-Performance WebGL Shaders & Canvas Engine\n- Multi-theme support with glassmorphic aesthetics');
                await sleep(3000);
            }
        }

        console.log('[Demo 1080p] Scene 4: Paint App & Interactive Drawing...');
        scenes.push({
            id: 'scene4_paint',
            text: 'Incluye aplicaciones creativas completas como Paint, con aceleración gráfica de dibujo y manipulación directa de canvas.',
            startTimeSec: getElapsedSec() + 1,
        });

        const paintIcon = page.locator('#icon-paint');
        if (await paintIcon.count() > 0) {
            await paintIcon.dblclick();
            await page.waitForSelector('#win-paint', { state: 'visible', timeout: 10000 });
            await sleep(1500);

            const canvas = page.locator('#win-paint canvas').first();
            if (await canvas.count() > 0) {
                const box = await canvas.boundingBox();
                if (box) {
                    const cx = box.x + box.width / 2;
                    const cy = box.y + box.height / 2;

                    await page.mouse.move(cx - 120, cy);
                    await page.mouse.down();
                    for (let i = 0; i <= 360; i += 10) {
                        const rad = (i * Math.PI) / 180;
                        const x = cx + 120 * Math.cos(rad);
                        const y = cy + 90 * Math.sin(rad);
                        await page.mouse.move(x, y);
                        await sleep(15);
                    }
                    await page.mouse.up();
                    await sleep(2000);
                }
            }
        }

        console.log('[Demo 1080p] Scene 5: Modern Glass Dark Theme & GLSL Shaders...');
        scenes.push({
            id: 'scene5_modern_theme',
            text: 'Con un solo click, HadOS se transforma mediante temas dinámicos con efectos glassmorphism y shaders animados en WebGL.',
            startTimeSec: getElapsedSec() + 1,
        });

        await page.evaluate(() => {
            document.body.classList.remove('theme-hados');
            document.body.classList.add('theme-modern');
            document.body.setAttribute('data-theme', 'modern');
            localStorage.setItem('os-theme', 'modern');
        });
        await sleep(4000); // Enjoy the modern dark glass shader wallpaper

        console.log('[Demo 1080p] Scene 6: Window Management & Outro...');
        scenes.push({
            id: 'scene6_outro',
            text: 'HadOS: potencia, nostalgia y arquitectura web de vanguardia en tu navegador.',
            startTimeSec: getElapsedSec() + 1,
        });

        const taskbarButtons = page.locator('.taskbar-button');
        const count = await taskbarButtons.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await taskbarButtons.nth(i).click();
            await sleep(1000);
        }

        await sleep(3000); // Final desktop hold
        console.log('[Demo 1080p] Recording finished!');

    } finally {
        await context.close();
        await browser.close();

        if (server) server.kill();
    }

    // Save 1080p raw WebM video
    const files = fs.readdirSync(tempVideoDir);
    const videoFile = files.find(f => f.endsWith('.webm'));
    if (!videoFile) {
        throw new Error('No recorded video file found from Playwright');
    }

    const rawRecordedWebm = path.join(tempVideoDir, videoFile);
    fs.copyFileSync(rawRecordedWebm, RAW_WEBM_PATH);
    fs.rmSync(tempVideoDir, { recursive: true, force: true });
    console.log(`[Demo 1080p] Stage 1 Complete: Recorded video saved to ${RAW_WEBM_PATH}`);

    // Stage 2 & 3: ElevenLabs Audio Generation
    console.log('[Demo 1080p] Stage 2 & 3: Generating ElevenLabs Voiceover Audio Clips...');
    const generatedAudioClips = await generateSceneAudios(scenes, AUDIO_DIR);

    // Stage 4: FFmpeg Audio-Video Compositing Engine
    console.log('[Demo 1080p] Stage 4: Compositing 1080p Video + ElevenLabs Voiceover via FFmpeg...');
    compositeVideoAndAudio(RAW_WEBM_PATH, generatedAudioClips, FINAL_MP4_PATH);

    console.log(`[Demo 1080p] 🎉 ZERO-TOUCH PIPELINE COMPLETE! Master 1080p Video generated at: ${FINAL_MP4_PATH}`);
}

function compositeVideoAndAudio(videoPath: string, audioClips: Array<{ id: string; audioPath: string; startTimeSec: number }>, outputPath: string) {
    if (audioClips.length === 0) {
        console.warn('[FFmpeg] No audio clips generated, encoding video only...');
        execSync(`ffmpeg -y -i "${videoPath}" -c:v libx264 -crf 18 -preset slow "${outputPath}"`, { stdio: 'inherit' });
        return;
    }

    // Build FFmpeg complex filter graph with adelay and amix
    const inputArgs = audioClips.map(clip => `-i "${clip.audioPath}"`).join(' ');
    
    const filterDelays = audioClips.map((clip, index) => {
        const delayMs = Math.round(clip.startTimeSec * 1000);
        const inputIdx = index + 1; // 0 is video
        return `[${inputIdx}:a]adelay=${delayMs}|${delayMs}[a${inputIdx}]`;
    }).join('; ');

    const mixInputs = audioClips.map((_, index) => `[a${index + 1}]`).join('');
    const filterMix = `${mixInputs}amix=inputs=${audioClips.length}:dropout_transition=2[outa]`;

    const filterGraph = `${filterDelays}; ${filterMix}`;

    const ffmpegCmd = `ffmpeg -y -i "${videoPath}" ${inputArgs} -filter_complex "${filterGraph}" -map 0:v -map "[outa]" -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k "${outputPath}"`;

    console.log(`[FFmpeg] Executing compositing command:\n${ffmpegCmd}`);
    execSync(ffmpegCmd, { stdio: 'inherit' });
}

main().catch(err => {
    console.error('[Demo 1080p] Pipeline failed:', err);
    process.exit(1);
});
