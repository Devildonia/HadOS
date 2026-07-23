# AI phase 4 — Hada (voice), front-page briefings, conversation memory

Three features inspired by surveying the agent-app ecosystem (the patterns in
[awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) and
similar collections), rebuilt the HadOS way: **no cloud, no backend, every
piece on-device and behind a consented capability**. Notably, every "voice AI
agent" in that ecosystem needs Gemini Live or OpenAI Realtime — Hada needs a
microphone.

## 🧚 Hada — the voice assistant (new app)

Push-to-talk over the whole substrate at once:

```
🎙️ mic (MediaRecorder)            mic:record       ← new capability
   └─ decodeTo16kMono (main thread, WebAudio)
       └─ Whisper (asr-runtime)    ai:transcribe
           └─ Gemma (ai-runtime)   ai:chat          — streamed into the bubble
               └─ speechSynthesis (browser, local)  — 🔊 toggleable
```

- **`mic:record`** joins the broker: *"record audio from your microphone for
  on-device processing (nothing is sent anywhere)"*. Our per-app consent runs
  first, the browser's own mic prompt second — two explicit gates.
- The conversation is **session-only** (in memory, 12-turn window): a voice
  session is ephemeral by design.
- **Honest-state contract, pinned by tests**: the requirements panel lists
  exactly which pieces are missing (no Gemma → a CTA pointing at Tavern Chat's
  import; no `MediaRecorder`; no WebGPU) and the mic stays disabled until the
  stack is real. jsdom — which has none of those — doubles as the perfect
  test environment for that contract.
- Model output and transcripts render via `textContent` only, as everywhere.

## 🗞️ Nova — front-page briefing

One on-device digest of the whole front page. **Headlines and metrics only** —
twelve threads' worth of comments cannot fit Gemma's 1280-token budget, so the
persona is told it has NOT read the articles and the panel says "headlines
only". The button exists **only in AI mode**: a scripted digest would be the
exact theatre the audit banned. `buildHnBriefingPrompt` caps at
`MAX_BRIEFING_STORIES` (12) and strips turn markers from titles (remote,
untrusted).

## 🧠 Tavern Chat — compressed long-term memory

The prompt window is 12 turns; friendships are longer. Once a conversation
outgrows `MEMORY_TRIGGER` (24 messages), the tail that fell out of the window
is folded — **by Gemma itself** (`buildMemoryPrompt`) — into a memory note
bounded at `MEMORY_MAX_CHARS` (900), which then conditions the persona:
*"Recuerdas de conversaciones anteriores: …"*.

- The **visible history is untouched** — only the model's context is
  compressed. A folded-count marker (`messenger-memfolded-<id>`) prevents
  re-compressing the same messages after every reply.
- Compression runs **after** the reply the user is waiting for,
  fire-and-forget; a failure costs nothing but memory and retries next time.
- Honesty surface: a 🧠 badge in the chat header whose tooltip shows **the
  exact note** the character remembers. Clear chat clears the memory with it.

## Testing

- `AiGrounded.test.ts` grows the phase-4 builders: briefing framing +
  story cap + title injection defence; memory trigger threshold, old-memory
  folding, first-compression shape, marker stripping + truncation.
- `HadOSVoiceAssistant.test.ts`: layout, the honest-requirements contract
  (every missing piece named, mic disabled), the on-device greeting, and a
  no-crash no-fake-state mic click in an unsupported environment.

## Ideas surveyed and rejected (for the record)

- **Multi-agent teams** — personas debating on a 1B model is theatre; against
  policy.
- **MCP / generative-UI agents** — different runtime model entirely.
- **"Chat with YouTube"** — the embed's audio is unreachable (phase 2 settled
  this honestly).
