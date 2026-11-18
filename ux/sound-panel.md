# In-editor Sound panel — DRAFT

Status: **DRAFT** for Editor UX. CEO ask 2026-11-09 via CoS. Nothing public.
Companion (Architect): `/workspace/tileengine/docs/audio-module.md` (in progress). Authoring companion referenced there as `audio-authoring.md` (not yet present in this tree).

Engine Architect owns `@te/audio`. All data fields and runtime hooks below are **proposed** unless marked as Architect rulings. Coordinate with Architect + DSK before locking.

---

## Architect rulings (2026-11-09) — applied in this mock

Cited from CoS → Editor brief; design detail in `docs/audio-module.md`.

### 1) Procedural SFX recipe

- Stored as `{ generator: "sfxr@N", params, seed }` with the **version pinned**; upgrades are **opt-in**.
- **Deterministic:** same recipe → same sound.
- Export setting `audio.procedural`: **Live** (default) or **Bake** (writes **ogg + m4a**).
- The **6 sliders** are a friendly view over the full parameter set. An **Advanced** fold exposes the rest.

Mock generator id: `sfxr@1`. Friendly sliders map onto a subset of `params`; Advanced edits the remainder without leaving the sheet.

### 2) Formats and size

- **Import** accepts: wav, ogg, mp3, m4a.
- **Export** always writes **both** ogg and m4a (runtime probes; see audio-module §2.7).
- **Warn only, never block:**
  - SFX over **3 s** or **300 KB** (suggest mono).
  - Music over about **3 min** per track; decoded audio ≈ **10 MB per stereo minute**.
- Long tracks get a plain **Streamed** flag in the row.

### 3) Event list (bindings = project data, DSK)

Use these ids; plain labels in the UI:

| id | UI label | overridable on unit/ability |
|---|---|---|
| `unit.move` | Move | no |
| `ability.cast` | Cast | yes |
| `ability.hit` | Hit (ability) | yes |
| `unit.hurt` | Hurt | yes |
| `unit.death` | Death | yes |
| `landedOn` | Landed on | no |
| `pushBlocked` | Push blocked | no |
| `turn.start` | Turn start | no |
| `ui.tap` | UI tap | no |
| `ui.confirm` | UI confirm | no |
| `ui.cancel` | UI cancel | no |
| `stage.music` | Stage music | no |
| `stinger.victory` | Victory | no |
| `stinger.defeat` | Defeat | no |
| `stinger.draw` | Draw | no |

### 4) Phones need a tap before sound plays

- One-time chip: **Tap to enable sound**. Any panel tap (including **Try it**) unlocks audio (`AudioContext.resume` + silent buffer; see audio-module §2.2).
- Hint when the **device** (iOS silent switch / ringer) has muted audio — not the app mix. Best-effort; WebView cannot always detect the switch (audio-module §2.2).
- Screenshot: unlock chip on the Sound sheet.

---

## UX rulings (Editor, 2026-11-09)

Applied on top of Architect docs (`docs/audio-module.md`, `docs/audio-authoring.md` sketch — EUX redesigns the panel).

1. **Bottom sheet only** — uses the locked lean contextual sheet. Not docked with any card hand.
2. **Stage music** is edited **only** in the Sound panel. Stage inspector / project settings show the bound track **read-only** with a **Change in Sound** link that opens this sheet on Assign → `stage.music`.
3. Effect Designer **`cue_name`** opens the **same sound picker** (shared component). Note + one screenshot; full Effect Designer rework stays in mock-effects later.
4. **Randomise** changes **params AND rolls a new seed**. Each friendly slider has a **48px lock** toggle; locked values survive Randomise and Randomise a little.

Canonical event ids: Architect list (CoS 2026-11-09 / aligned with CoreEvent + UI + stingers). Authoring.md §4 examples (`unit.attack`, `ui.click`) are illustrative only — **do not use** those names in the panel.

## Why

Makers need to audition and assign SFX/music inside the editor without launching a full play session (CEO: wiring audio into BTF meant reopening the game to test every sound).

## UI (locked lean layout)

- Contextual **bottom sheet** ≤ 40% height (same rules as Paint / Units).
- Entry: rail **More → Sound**, and from a **unit** sheet (**Sounds**).
- Tabs: **Library** (built-in) · **Made here** (procedural / project).
- Filters per tab: **SFX** · **Music**.
- Every row: label + licence/Streamed tags + **48px play/stop** audition.
- Sub-panels in the sheet: **Make a sound**, **Assign to events**, **Try it**.
- **Tap to enable sound** chip until unlocked; then dismisses.

## Procedural SFX editor (mock)

Presets: Hit, Swing, Coin, Jump, Explosion, Magic, Click.

Friendly sliders (map into `params`):

| Control | Maps to (proposed) | Range |
|---|---|---|
| Pitch | `p_base_freq` (friendly) | 0.5–2.0 display |
| Length | `p_env_sustain` + release | 0.05–1.2 s display |
| Punch | `p_env_attack` inverse + `p_pha_offset` | 0–1 |
| Wobble | `p_lpf_freq` / vibrato depth | 0–1 |
| Noise | `wave_type` noise mix / `p_noise` | 0–1 |
| Volume | `sound_vol` | 0–1 |

**Advanced** fold (full set, proposed names aligned with sfxr-style): `wave_type`, `p_base_freq`, `p_freq_limit`, `p_freq_ramp`, `p_freq_dramp`, `p_duty`, `p_duty_ramp`, `p_vib_strength`, `p_vib_speed`, `p_env_attack`, `p_env_sustain`, `p_env_decay`, `p_env_punch`, `p_lpf_freq`, `p_lpf_ramp`, `p_lpf_resonance`, `p_hpf_freq`, `p_hpf_ramp`, `p_pha_offset`, `p_pha_ramp`, `p_repeat_speed`, `p_arp_speed`, `p_arp_mod`, `sound_vol`.

- **Randomise** / **Randomise a little**: change unlocked params **and** roll a new `seed` (deterministic for generator+params+seed). Locked sliders keep their value.
- Play on every change (after unlock).
- **Save as project sound** → Made here.
- Project export toggle (Settings / Sound): `audio.procedural` = Live | Bake.

## Event assignment

Tap event → tap sound → upserts a **default** (no `match`) row in `project.audio.bindings[]`. Show current sound + audition + Clear.
Per-unit Own sound writes `match.unit`. Per-ability Own sound writes `match.ability` (setup id).

**Own sound picker:** **Make a sound** / **Upload file** / **Built-in**, or **Use shared sound** (removes that ability's override bindings).

## Preview in place

- **Try it:** attack/cast → hurt → death sequence on the selected unit with resolved sounds + small pulse. Does **not** enter Play. Counts as an unlock gesture.
- Stage music loops quietly while the Sound sheet is open; mute toggle in the sheet.

## Library audio

v1: **CC0 only** (Kenney audio packs). Offline mock uses **procedural placeholders** labelled `Placeholder · procedural (CC0 recipe)`.

## Proposed data (Architect / DSK)

```json
{
  "audio": {
    "kind": "audio",
    "formatVersion": 1,
    "procedural": "live",
    "bindings": [
      { "id": "bind_default_cast", "event": "ability.cast", "soundId": "snd_made_coin" },
      { "id": "bind_heaven_cast", "event": "tactics.attack", "soundId": "snd_made_coin", "match": { "ability": "setup_heaven_sword" } },
      { "id": "bind_u1_hurt", "event": "unit.hurt", "soundId": "snd_made_coin", "match": { "unit": "u1" } }
    ],
    "music": { "title": null, "menu": null, "battle": null }
  },
  "sounds": {
    "snd_made_coin": {
      "id": "snd_made_coin",
      "name": "Coin (made)",
      "kind": "sfx",
      "origin": { "kind": "procedural-audio", "generator": "sfxr@1", "params": { "sound_vol": 0.8 }, "seed": 42 },
      "credit": { "license": "own", "author": "maker" }
    }
  }
}
```

| Proposed field | Owner | Notes |
|---|---|---|
| `audio.procedural` | Architect + DSK | `live` \| `bake`; bake emits ogg+m4a |
| `sounds[].origin.kind` | Architect | `procedural-audio` \| `upload` \| `builtin` |
| `sounds[].streamed` | DSK + Architect | plain flag for long / stream beds |
| `project.audio.bindings[]` | DSK | event defaults + Own sound (`match.*`); §3.2 / §3.7 |
| Unlock / silent-switch hint | Architect | `@te/audio` unlockFromGesture; UI chip is Editor |

## Own sound overrides — DECIDED (CEO 2026-11-10); store = audio-format r1 §3.7 (**PROPOSED**)

Makers can choose a sound for **most actions**. Default is the shared project event binding. An optional **Own sound** toggle (default **off**) unlocks a picker:

1. **Make a sound** — writes a `kind: "audio"` asset with origin **`procedural-audio`** (`sfxr@N` + params + seed)
2. **Upload file** — writes an **`upload`** origin asset (wav / ogg / mp3 / m4a; size warnings warn-only)
3. **Built-in** — library / Made here list

**One store:** `project.audio.bindings[]` only. **No** parallel `abilities` / `soundOverrides` map in the project.

Own sound **upserts** a binding:

```json
{ "id": "bind_…", "event": "tactics.attack", "soundId": "asset_…", "match": { "ability": "setup_…" } }
```

`match` may use `ability` (behaviour-setup id), `action` (`ActionKind`), and/or `unit` / `side`. Present fields are ANDed.

**Resolution:** ability > action > unit|side > event default; same tier → **last in `bindings[]` wins**.

**Unknown ids:** binding kept **inactive** with `_state: "unknownRef"` — UI shows a calm **“Sound missing, pick another”** row (never auto-deleted).

**Legacy:** `units[].soundOverrides` / `ability.soundOverrides` are **read once on load**, converted to bindings (§3.7), **never written back**.

Upload flow: large **Choose audio file** control; warn chips; Save into Made here.

## Hub shop generative / community (see `coins-library-chart.md`)

Shop offers **Made with code** (JS generative sounds/art) and **From the community** (user submissions, review before listing). Earn-only coins. **Submit yours** is proposed.

## Open questions

1. DSK: exact project-format section for `sounds` / `soundEvents` (sibling of §6.2 art vs under assets)?
2. Architect: friendly↔full param mapping table freeze for `sfxr@1`?
3. Architect: how does the editor detect “device muted” vs bus muted for the hint copy?
4. ~~CEO: ability-level Own sound?~~ **DECIDED in** (2026-11-10).
5. Bake-on-export: do Live recipes still ship recipe JSON as source (parity with code tiles)?
6. Size meters: when do streamed beds count toward decoded vs download only?
7. Community submit review SLA / licence gates for hub listings?
