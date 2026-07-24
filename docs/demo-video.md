# Demo-video pipeline

Zero-touch generator for the HadOS demo reel: Playwright drives a scripted tour
of the OS, ElevenLabs narrates it, and FFmpeg burns subtitles and mixes the
voiceover into a final `.mp4`.

```
Playwright (scripted scenes) ──► raw video
        │                            │
   scene timeline (id, text, t)   ElevenLabs TTS (optional)
        │                            │
        └──────────── FFmpeg ────────┘  → burned subtitles + mixed VO → docs/videos/hados-demo-<H>p.mp4
```

Everything under `docs/videos/` is gitignored (large, regenerable).

## Setup

1. Rotate/create an ElevenLabs key and put it in a gitignored `.env` (see
   `.env.example`). Without a key the video still renders — silent, subtitles only.

   ```
   ELEVENLABS_API_KEY=your_key_here
   ```

2. FFmpeg must be on `PATH` (`ffmpeg -version`).

## Run

**Preview** (default) — Playwright headless recording. Runs anywhere, smooth but
variable frame rate. Use it to review the choreography, subtitles and pacing.

```bash
npm run generate:demo-video
```

**Screen / 60fps master** — a full-screen (kiosk) browser captured by
`ffmpeg gdigrab` at a locked 60fps. This records the **real desktop**, so:

- Run it on your own machine, at 1920×1080 or higher.
- Do **not** touch the machine until it finishes (any overlay is recorded).
- It records only the HadOS monitor's region, auto-detected from the fullscreen
  window (GPU/WebGL windows capture black under gdigrab window-title mode, so it
  grabs a *region of the desktop* instead). On a multi-monitor setup, if the
  region is wrong, pin it with `CAPTURE_X/Y/W/H` (physical pixels) — e.g. a
  1920×1080 primary monitor at the top-left is `CAPTURE_X=0 CAPTURE_Y=0
  CAPTURE_W=1920 CAPTURE_H=1080`.

PowerShell:

```powershell
$env:MODE="screen"; $env:WIDTH="1920"; $env:HEIGHT="1080"; $env:FPS="60"; npm run generate:demo-video
```

bash:

```bash
MODE=screen WIDTH=1920 HEIGHT=1080 FPS=60 npm run generate:demo-video
```

## Knobs (env)

| Var | Default | Notes |
| --- | --- | --- |
| `MODE` | `preview` | `preview` (headless) or `screen` (gdigrab 60fps) |
| `WIDTH` / `HEIGHT` | `1920` / `1080` | recording resolution |
| `FPS` | `60` | output frame rate |
| `CAPTURE_X` / `CAPTURE_Y` | auto | screen mode: top-left of the capture region, physical px |
| `CAPTURE_W` / `CAPTURE_H` | auto | screen mode: capture size, physical px |
| `ELEVENLABS_API_KEY` | — | required for voiceover; silent + subtitles without it |
| `ELEVENLABS_VOICE_ID` | Adam | any ElevenLabs voice id |
| `ELEVENLABS_MODEL_ID` | `eleven_multilingual_v2` | TTS model |

Narration and subtitles are English, authored per scene in
`scripts/generate-demo-video.ts` (`choreograph`). Edit that function to change
the tour or the script.
