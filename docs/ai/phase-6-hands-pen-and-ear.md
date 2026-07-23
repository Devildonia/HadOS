# AI phase 6 — hands, pen and ear (the last harvest)

Third and final pass over the agent-app ecosystem survey. Three patterns
remained adaptable; after this, the well is dry — anything further is original
design, not adaptation.

## 🧚 Hada gets hands (the tool-use pattern, tamed)

The MCP/function-calling category is inapplicable directly (different runtime),
but its essence — a model that can ACT — ports safely:

- One Gemma call decides **intent or conversation**: the persona
  (`buildIntentPrompt`) offers the Kernel's live app registry as an allowlist
  and ONE strict JSON shape: `{"action":"launch","app":"<id>"}`.
- **`parseIntent` is the security boundary**: only the first `{...}` block is
  considered, `action` must be exactly `launch`, `app` must be in the
  allowlist. Malformed JSON, unknown actions (`delete`, `eval`), out-of-list
  apps (`"rm -rf /"`, `"terminal"`-not-offered) — all degrade to plain speech.
  **A wrong guess can only ever produce words, never actions.** Never eval.
- Validated intent → `Kernel.launch(id)` + a spoken confirmation; a failed
  launch says so. "Hada, abre Pinta" now actually opens Pinta.

## 📝 Notapad gets a pen (the writing-assistant pattern)

An **AI menu**: Summarize / Rewrite clearer / Translate / Suggest title, over
the selection (or the whole note). `buildWritingPrompt` instructs
work-with-the-text-only and caps the source at 2400 chars (the 1280-token
budget), flagging truncation honestly. The result streams into a dialog and
**only the user's click applies it** — Reemplazar / Insertar al final /
Descartar; the model never touches the note directly. Without a model, a
notification points at Tavern Chat's import. Multi-window safe: dialog lookups
are scoped per window.

## 🎼 Voxcribe gets an ear (the music-generation pattern, honest version)

A third tab, **Melody Lab**: Gemma composes in a constrained notation
(`C4:q E4:e G4:h R:q` — note+octave:duration, R = rest) and the local Web Audio
oscillator plays it (triangle wave, soft envelopes, ~120 bpm). `parseMelody`
validates token by token — a rambling model cannot break playback — and caps at
64 notes. The tab's own copy sets expectations: *"generación real, on-device…
y con el gusto musical de un modelo de 1B. Puede sonar raro; es parte del
encanto."* The AudioStudio tab system was refactored from a two-tab if/else to
a table loop on the way (it did not survive the third tab).

## Testing

`AiPhase6.test.ts` (15): the intent boundary (valid launch + speech stripping,
out-of-allowlist rejection, non-launch actions, malformed JSON, first-block
rule), writing prompts (text-only instruction, truncation), melody parsing
(A4=440, accidentals, octave doubling, invalid-token skipping, the cap) and
prompt grammar. Plus live verification of the three honest no-model states.

## The survey, closed

| Adopted (10) | Rejected with cause (6) |
|---|---|
| RAG · voice agent · memory · briefing · always-on radar · multi-doc · data analysis · tool-use · writing assistant · music generation | multi-agent teams (1B theatre) · MCP (runtime) · generative UI (eval) · chat-with-YouTube (CORS/EME) · agent skills (no git) · vision-heavy & cloud-API agents |
