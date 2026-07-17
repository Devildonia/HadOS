# AI — Phase 0: the LiteRT substrate + Paint "remove background"

The first slice of on-device AI in HadOS. It builds the reusable substrate every later
feature needs (an inference process, mediated syscalls, a gated capability, a cached model
store) and proves it end-to-end with one visible feature: **remove background / subject cutout
in Pinta**.

## Locked decisions

| Decision | Choice |
|---|---|
| First feature | **Pinta: remove background / image segmentation** — self-contained, visual, exercises load→infer→result without mic/camera |
| Model delivery | **Download on first use → cache in OPFS** (repo stays lean; needs a `connect-src` entry for the model host) |
| Integration depth | **`ai-runtime` Kernel worker process + `ai.*` syscalls + `ai:infer` capability** — consistent with the rest of the system |
| Backend | **WebGPU with a WASM fallback** |
| LLM / Copilot | **Out of scope** — a separate later milestone (LiteRT-LM) |

## Architecture

```
 Pinta (host app)            isolated app (worker/iframe)
      │                              │
      │ AI.segment(image)            │ syscall 'ai.infer'
      ▼                              ▼
   AI service facade  ◀── ai:infer capability (PermissionBroker consent) ──┐
      │                              ▲                                      │
      │ postMessage                  │  SyscallBroker maps ai.* → ai:infer  │
      ▼                              │                                      │
   ai-runtime  (Kernel worker process)                                     │
      │  owns the LiteRT runtime + loaded models                           │
      │  WebGPU → WASM fallback                                            │
      ▼                                                                     │
   AiModelCache (OPFS)  ── fetch(url) once, cache bytes, reuse ────────────┘
```

- **`ai-runtime`** — a Kernel worker process (`spawnWorker`), so inference never blocks the
  desktop and the watchdog can kill a hung model. It owns the LiteRT runtime and the loaded
  models, and answers `loadModel` / `infer` requests over its authenticated `MessagePort`.
- **AI service facade** (`js/ai/AiService.ts`) — the one entry point host apps call
  (`AI.segment(imageData)`). It checks the `ai:infer` capability via the PermissionBroker,
  forwards to the `ai-runtime` worker, and returns the result. Host apps do not touch the worker
  directly.
- **`ai.*` syscalls** — for *isolated* processes, `ai.loadModel` / `ai.infer` are real syscalls
  through `SyscallBroker`, mapped to the `ai:infer` capability exactly like `fs.write` → `fs:write`.
  Same consent path, same per-(app, capability) memory.
- **`ai:infer` capability** — added to `PermissionBroker`'s `CAP_LABELS` ("run on-device AI").
  First use prompts; the decision is remembered.
- **`AiModelCache`** (`js/ai/AiModelCache.ts`) — downloads a model once, caches the bytes in
  **OPFS** (the same durable store `VFSBlobStore` already uses), and serves them on later loads.
  Runtime-independent and unit-testable.

### The model registry is a security boundary

`ai.loadModel` is a syscall an isolated app can call. An app that could pass its **own URL**
would hold a download primitive running on the OS's origin: arbitrary bytes into the user's
storage, a filled disk, or the request itself as a beacon to a third-party host.

So apps name a model by **id**, and `js/ai/models.ts` is the allowlist that resolves ids to
URLs. **A URL never crosses the syscall boundary.** Adding a model means adding its host to the
CSP — a test holds the two together.

### The runtime adapter seam

The only LiteRT-specific code lives behind one interface (`js/ai/InferenceRuntime.ts`), inside
the `ai-runtime` worker — so the substrate builds and tests without a GPU, a download, or LiteRT
itself, and a runtime swap touches one file:

```ts
interface IInferenceRuntime {
    init(backend: 'webgpu' | 'wasm'): Promise<void>;
    loadModel(id: string, bytes: ArrayBuffer): Promise<IModelInfo>;
    infer(id: string, input: Float32Array, shape: number[]): Promise<{ data: Float32Array; shape: number[] }>;
    dispose(id: string): void;
    readonly backend: Backend | null;
}
```

`FakeInferenceRuntime` is not a permissive stub: it enforces the same contract (init before
load, load before infer, input length must match the model's declared shape) and returns a
deterministic function of its input, so a passing test has exercised a protocol rather than a
mock that agrees with everything.

### Timeouts

`WorkerProcess.request` defaults to 10s. A first load downloads 2.65 MB and then compiles it —
seconds of Wasm/GPU work — so `AiService` gives loads **180s** and inference **60s**. The default
would abort a healthy cold start on a slow connection.

## First slice — Pinta "remove background"

1. Read the Pinta canvas → an `ImageData`.
2. `AI.segment(imageData)` → the `ai-runtime` runs the segmentation model → a per-pixel mask.
3. Apply the mask as alpha: subject kept, background cleared (or replaced).
4. A toolbar/menu action "Quitar fondo" with a progress state (model download on first use can
   take seconds — reuse the splash-style "working" affordance, never a frozen UI).

## Verified (2026-07-17)

Everything below was confirmed against the package's own type definitions
(`@litertjs/core@2.5.2`) and live HTTP, not guessed from prose.

### 1. The LiteRT web runtime — `@litertjs/core@2.5.2`

```ts
loadLiteRt(path: UrlString, options?): Promise<LiteRt>   // path = a DIRECTORY of wasm files
loadAndCompile(model: string | URL | Uint8Array | ReadableStreamDefaultReader,
               opts?: { accelerator?: 'wasm'|'webgpu'|'webnn' | Array<…>, gpuOptions?, webNNOptions? })
               : Promise<CompiledModel>
new Tensor(data: TypedArray, shape?: Dimensions)
model.run(input: Tensor | Tensor[]): Promise<Tensor[]>
tensor.data(): Promise<TypedArray>;  tensor.delete();  model.getInputDetails()
isWebGPUSupported(): boolean;  setWebGpuDevice(d);  unloadLiteRt()
```

Two findings that shaped the design:

- **`loadAndCompile` accepts a `Uint8Array`.** This is what makes `AiModelCache` viable — the
  cached bytes go straight in, with no `blob:` URL detour.
- **`accelerator` accepts an array**, so `['webgpu', 'wasm']` expresses the fallback natively.

### 2. The model — DeepLab v3, pinned

| | |
|---|---|
| URL | `…/mediapipe-models/image_segmenter/deeplab_v3/float32/**1**/deeplab_v3.tflite` |
| bytes | `2780176` |
| sha256 | `ff36e24d40547fe9e645e2f4e8745d1876d6e38b332d39a82f0bf0f5d1d561b3` |
| input | 257×257×3, 21 PASCAL VOC classes out |

Chosen over MediaPipe's Selfie Segmenter (249,537 bytes — 10x smaller) because **the selfie
model only knows people**, and Pinta opens arbitrary images: a photo of a dog would come back
with an empty mask. 2.65 MB is a fair price for a general subject cutout.

The URL is the versioned `/1/` path, not `/latest/`. Both serve identical bytes today
(same ETag), but `latest` can be republished — which would break the pinned hash and hard-fail
every load. **Pinned bytes need a pinned URL.**

### 3. CSP — done

`connect-src` now includes `https://storage.googleapis.com` (`index.html`). A test asserts every
`MODEL_HOSTS` entry appears there, because that drift is invisible until a user in production
clicks the button and the browser silently blocks the fetch.

The **runtime wasm is self-hosted**, so it needs no CSP entry at all: the CDN option
(`loadLiteRt('https://cdn.jsdelivr.net/…')`) would need `connect-src` + `script-src` for a
third party and would break the PWA offline.

### 4. COOP/COEP — not required

`loadLiteRt(dir)` **feature-detects and picks the compatible build itself** from the four in
`node_modules/@litertjs/core/wasm/` (plain / threaded / JSPI / compat). Without cross-origin
isolation it loads the non-threaded build. No headers needed; threads are an optimisation to
revisit, not a prerequisite.

> ⚠️ **The wasm is 8.5 MB per build, ~36 MB for all four.** It must be copied from
> `node_modules` at build time (never committed — see the 21 MB zip incident) **and excluded
> from the Workbox precache**, which today is 276 entries / 15.5 MB. Precaching 36 MB of wasm
> would make every install pay for AI it may never use.

## Build order

1. ✅ `AiModelCache` (OPFS/IDB download-once cache, pinned-hash integrity, in-flight dedupe,
   progress) + the model registry allowlist. `test/AiModelCache.test.ts` — 20 tests.
2. ✅ `ai:infer` capability in `PermissionBroker`; `ai.loadModel`/`ai.infer` in `SyscallBroker`
   mapped to it, forwarding to `AiService`.
3. ✅ `ai-runtime` worker (`js/workers/ai.worker.ts`, behaviour in `ai/aiRuntimeHandlers.ts` so
   it is testable in jsdom) + the `IInferenceRuntime` seam + `FakeInferenceRuntime`.
4. ✅ `AiService` facade (consent gate, process lifetime, progress fan-out, respawn).
   `test/AiSubstrate.test.ts` — 21 tests over the real IPC protocol via a loopback transport.
5. ✅ **`LiteRtRuntime`** (`js/ai/LiteRtRuntime.ts`) — the real binding, and the only file that
   knows LiteRT exists. `ai.worker.ts` now runs it instead of the fake.
   `npm i @litertjs/core@2.5.2` (lock fully regenerated; `npm ci` verified) +
   `scripts/copy-litert-wasm.js` self-hosts the wasm. `test/LiteRtRuntime.test.ts` — 17 tests.
6. ⬜ Pinta "Quitar fondo" UI + integration. *(needs 5)*
7. ✅ Browser verification of a real inference — see below.

### Verified end to end in the browser

Real LiteRT, real wasm, real model, no fakes:

```
loadModel  → { inputShape: [1,257,257,3], outputShape: [1,257,257,21],
               backend: 'webgpu' }                                   821 ms
infer      → 1,387,029 finite floats, shape [1,257,257,21]            17 ms
argmax     → class 0 (background) 99.3% · class 15 (person) 0.6% · class 13 0.1%
```

The shapes come from `getInputDetails()` on the **compiled graph**, not from the registry's
hint — independent confirmation that the pinned bytes really are 257×257×3 → 21 classes, and
that `backgroundClass: 0` is right (background dominates a synthetic non-photo, as it should).
A cold restart after `shutdown()` reloads from OPFS in **24 ms** with no refetch.

### Three integration failures that only the browser could find

Every one of these passed typecheck, lint, 864 unit tests and the production build. The tests
mock `@litertjs/core` — which is the point of the seam, and also its blind spot.

1. **LiteRT cannot run in a module worker.** `@litertjs/wasm-utils`'s `runScript` has two paths:
   `importScripts()` if it exists, else a `document.createElement('script')` needing a DOM. In a
   module worker `importScripts` *is* defined, so the feature check passes — and then calling it
   throws `Module scripts don't support importScripts()`. So LiteRT runs on the main thread or in
   a **classic** worker, and inference does not belong on the main thread.
2. **Vite dev does not bundle classic workers.** It serves `new Worker(new URL(...))` as raw
   transformed TS at `?worker_file&type=classic`, so the ES `import`s are an instant syntax error.
   Hence `vite.ai-worker.config.js` — the same answer, for a related reason, as
   `vite.guest.config.js`: prebuild one self-contained IIFE into `public/`.
3. **emscripten resolved the .wasm against the worker's URL.** LiteRT importScripts()es the loader
   from `WASM_DIR` but sets no `locateFile`, so emscripten fell back to `self.location` —
   `/ai-runtime.js` → the origin root — and fetched `/litert_wasm_internal.wasm`. The dev server
   answers unknown paths with index.html at **200**, so this surfaced as
   `expected magic word 00 61 73 6d, found 3c 21 44 4f`; those bytes are `<!DO`. Fixed by seeding
   `self.Module = { locateFile }` before `loadLiteRt` — the package's own documented seam.

### The wasm hosting step

`scripts/copy-litert-wasm.js` copies `node_modules/@litertjs/core/wasm/` → `public/wasm/litert/`
on `predev` and `build`. The directory is **gitignored** (~36 MB) and regenerated from the
lockfile, so the repo stays lean and the bytes always match the pinned version.

`vite.config.js` adds `globIgnores: ['**/wasm/litert/**']`. The `.wasm` files were already
outside `globPatterns` and over the 5 MB cap, but their loader `.js` siblings matched — verified
after the change: **the precache stays at 276 entries / 15.5 MB**, unchanged by LiteRT, while
`dist/wasm/litert` (36 MB) is served on demand.

### What LiteRT's types corrected

Written from the docs, `LiteRtRuntime` had two bugs that the typecheck caught before it ever ran:

- A **model's** shape is `TensorDetails.shape` (an `Int32Array`); a **live tensor's** is
  `type.layout.dimensions`. Different fields, not interchangeable.
- `Dimensions = Int32Array | number[]` — spreading it assuming `number[]` is wrong. Both paths
  normalise through `Array.from`.

Which is the argument for reading a package's `.d.ts` over its documentation.

### Still open for step 5/6

- The **exact tensor convention** for DeepLab v3 under LiteRT: input normalisation (`[0,1]` vs
  `[-1,1]`) and layout (NHWC vs NCHW). `model.getInputDetails()` reports the truth at runtime —
  read it rather than hardcoding, and let it disagree with the registry's `inputSize` hint.
- The output is 21 per-pixel class scores; "remove background" is `argmax != backgroundClass`.
  Whether it needs a softmax first depends on the graph's final op.

## How it plugs into the existing safety net

- The substrate (cache, capability, syscalls, facade, worker protocol) is covered by Vitest with a
  **fake `IInferenceRuntime`** — deterministic, no model download, no GPU.
- The real model + WebGPU path is verified in the browser (Playwright can drive it; the shader
  screenshots stay masked as before).
- `AiModelCache` gets the same treatment as `VFSBlobStore`: fake-indexeddb / OPFS shims in tests.
