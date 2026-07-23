# AI phase 2 — real transcription (Whisper via transformers.js)

Phase 1 made the Messenger's conversations real. Phase 2 does the same for the
Media Player's transcript: **local files are now transcribed for real, on-device**,
with Whisper timestamps driving the karaoke highlight and click-to-seek. The
simulated title-keyword transcript is gone.

## The honest boundary: YouTube cannot be transcribed

A YouTube embed is a cross-origin iframe. Its audio stream is unreachable from
the host page — CORS and EME exist precisely to guarantee that — so **no
in-browser player can transcribe a YouTube embed**, and HadOS does not pretend
to. The transcript panel for YouTube says exactly that and points at local
files. (The old simulation fabricated lines from the video title; the audit
made us label it, this phase made us delete it.)

## The engine

[`@huggingface/transformers`](https://www.npmjs.com/package/@huggingface/transformers)
(v4) `pipeline('automatic-speech-recognition')` over **`onnx-community/whisper-base`**
(multilingual, Apache-2.0, `dtype: 'q4'` ≈ **138 MB**). Verified against the
installed types AND live in the browser:

- Call shape: `transcriber(float32Audio, { chunk_length_s: 30, stride_length_s: 5,
  return_timestamps: true, language? })` → `{ text, chunks: [{ timestamp: [start,
  end], text }] }` — the documented long-form recipe.
- `progress_callback` on `pipeline()` streams per-file download progress.
- `env.backends.onnx.wasm.wasmPaths` points onnxruntime at **self-hosted** wasm:
  node_modules in dev (Vite refuses to module-import `public/` files), and
  `public/wasm/ort/` in the build (`scripts/copy-ort-wasm.ts` copies the exact
  version transformers pins, all four variants — plain/jsep/asyncify/jspi).
  Without this, ort defaults to **jsDelivr** — and it *worked*, because a `<meta>`
  CSP does not govern workers (see known-issues); self-hosting is the real fence.

**Model/dtype choice was forced, not preferred** — verified live against
transformers 4.2.0's pinned ort (`1.26.0-dev`):

| Model, dtype | Session |
|---|---|
| `Xenova/whisper-base`, q8 | ✗ `qdq_actions.cc: Missing required scale … DequantizeLinear` |
| `onnx-community/whisper-base`, q8 | ✗ same |
| `onnx-community/whisper-base`, uint8 | ✗ same |
| `onnx-community/whisper-base`, **q4** | ✓ (and transcribes) |

The q4 decoder is 118 MB — heavier than q8 would have been (~80 MB); the price
of a session that actually opens. Re-test the cheaper dtypes when transformers
bumps its ort.

Runs on the **Wasm backend deliberately**: predictable, works without WebGPU.
Slow for long audio (the consent + status line say so); moving to WebGPU
(`device: 'webgpu'`) is the known upgrade path.

## Download policy — different from Gemma, same boundary

Whisper is **Apache-2.0**: no license gate, so it downloads like DeepLab does —
behind consent that names the size (`ai:transcribe`: *"download a speech-to-text
model (~140 MB, once) and transcribe audio entirely on your device"*). The fetch
is transformers.js's own multi-file resolution against the HF Hub, cached by it
in the browser Cache API. The model NAME (`ASR_MODEL_ID`) is pinned in code and
no caller can pass one, so apps cannot turn this into a download primitive; the
CSP pins the reachable hosts (`huggingface.co`, `*.huggingface.co`, `*.hf.co` —
the Hub redirects big files to its CDN, and every hop must be allowlisted).

## Process shape

A new process, **`asr-runtime`** — and unlike `ai-runtime` it is a **normal
module worker**: transformers.js/onnxruntime use dynamic `import()`, which
classic workers refuse, and nothing here needs LiteRT's `importScripts()` path.
(Do not merge the two workers: their loaders want opposite worlds.)

```
Media Player (host app)
  ├─ decodeTo16kMono(file)             ← main thread; workers have no AudioContext
  └─ AiService.transcribe('mediaplayer', samples, {language?}, onProgress)
       ├─ PermissionBroker.check('ai:transcribe')
       └─ asr:transcribe {requestId, audio} ──► asr-runtime worker (module)
            ├─ engine.init()                     ← downloads once, Cache API
            ◄─ asr:progress {requestId, phase: download|init|transcribe, …}
            └─ Whisper → { text, chunks[{start, end, text}] }
```

`audioDecode.ts` resamples via `OfflineAudioContext` (any container the browser
can decode → 16 kHz mono Float32, Whisper's input contract).

## Testing

`test/AiAsr.test.ts` (fake `IAsrEngine`): argument validation before the engine
is touched, honest unsupported-environment error, progress tagged by requestId,
language hint passed only when given, one engine across runs, consent denial
before any work, and the full grant → progress → chunks path over the real IPC
loopback. The Media Player specs assert the honest YouTube empty state and that
click-to-seek works over (seeded) real-shaped transcript lines.

## Known limits (v1)

- **Wasm speed**: whisper-base on CPU chews long audio slowly (a 10-minute video
  can take minutes; the request budget is 15). WebGPU is the next step.
- The VFS media dropdown (AudioStudio podcasts) doesn't offer transcription yet —
  only picker-opened local files keep their `File` handle around.
- Whisper hallucinates on music/silence (typically `[Music]` markers or repeated
  phrases) — that is the model, not a bug to fix here.
- The RAG chat tab still does keyword search over the transcript and says so; it
  now searches REAL lines for transcribed files.
