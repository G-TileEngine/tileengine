# Effect Designer (TileEngine)

Owner: Editor & UX Designer · 2026-11-09 · status: DRAFT r3 for the CEO (via Chief Of Staff). r3 applies project-format r9 §6.7, setup-format r8/r9 and catalogue rev 11
Mockup: `/workspace/tileengine/ui-shell/mock-effects/` (its own `index.html`, `effects.css`, `js/effects.js`; links `../css/app.css` unchanged; does not touch `ui-shell/index.html`, `js/app.js` or `mock-art/`).
Data: catalogue **rev 11** (behaviour `effect`, 30 knobs, 6 recipes). The mock reads the shared mirror `ui-shell/data/behaviours.json` (its old local copy is deleted). Formats: `data/project-format.md` r7 (§6.7 effect documents), `data/setup-format.md` (§2.10), art rules from `ux/art-upload.md`.
Source studied: Before The Fall's SkillRig booth (`g-tile-engine/src/docs/SKILLRIG.md`, `chess/skillrig/SkillRig.tsx`, `spec.ts`, `paint.ts`, and `src/bootGate.tsx`, which shows the booth only on the workshop door, never in a shipped build).

**Step 33 sync base (2026-11-13):** [`effects-sprite-sync.md`](effects-sprite-sync.md) proposes these:
- an Advanced "Sync" card: Starts when / Comes from / Follows the unit;
- a frame strip with "Hit here" under the scrubber;
- the "Behind unit" and "In front of unit" Draw-on places;
- project-ramp colour chips, with "Any colour" moving to Advanced.

The 64-frame cap in §5 is unchanged; the EA is asked to name the steps and frames caps.

## 1. Purpose
The Effect Designer is how you decide what an ability **looks like** when it plays: the picture, its colour and glow, where it starts, how it moves (up to 6 steps), the hit flash and the timing.
- It never changes what an ability **does**. Damage, pushes and targets stay in the ability's rules.
- The result is a named effect saved in the project. Any ability's **Effect** row can pick it, and one effect can serve many abilities.
- It is phone-first (390 × 844, touch targets ≥ 48 px, AA contrast) and keeps the locked clean look.
- The order is the CEO's: **presets first → a few simple controls → an advanced step timeline**.

## 2. KEEP / CUT / SIMPLIFY (SkillRig → Effect Designer)

| SkillRig feature | Verdict | Reason |
|---|---|---|
| 7 stock pictures (cut, holy, wrath, heaven, chain, feather, spike) | **KEEP**, tagged **Studio pack (pending)** | Tinted in code like the booth. CEO: BTF art is not in the v1 library, and shipping it in exports is still not allowed, so they carry the tag plus "May not ship in exported games yet. Pick a CC0 or your own picture to be safe." Built-in library pictures show **CC0**; uploads show **Yours**. |
| Click the stamp to cycle the tint | **CUT** | A hidden gesture. Replaced by 9 swatches (spec.ts `TINTS`) plus "any colour". |
| Exact hex colour | **KEEP** | Shown as the value next to "Colour". A colour word is only a reading of the hex. |
| Glow colour and size, rest angle (spin), trail | **KEEP** (Advanced → Look) | Useful, but not first-time controls. |
| Scale 0.35–2.6 | **SIMPLIFY** | With `scale_snap: whole` (the default), the Size slider moves in whole zoom steps ("×5 · 80 px"). "Any size" (`fractional`) is offered only when Advanced render is on. Otherwise it's greyed with "Turn on Advanced render". A stored `fractional` is kept, never cleared, and plays as whole. |
| Save blade (24) / Use…; saved bursts | **CUT** | Whole effects are saved instead, and Duplicate covers reuse. Two extra libraries is too much for a phone. |
| Stage tab: place you / foe / aim, grow the board 2–8 × 1–10 | **SIMPLIFY** → Advanced "Preview board" | `booth_cols` / `booth_rows` / `booth_caster` / `booth_foe` (catalogue rev 12 default: 2 × 2, caster {c:0,r:1} bottom-left, foe {c:1,r:1} bottom-right; rows run downward. Flat effects get 2 × 1, a CoS call (reversible); see §6). Columns, Rows, and tap a square to place You or the Foe. It's only for the preview; real targeting belongs to the rules. |
| Game label (any / anniversary / chess / defender), cast sprite pickers | **CUT** the pickers | TileEngine is one engine. **CoS call (reversible):** the preview uses the project's real unit sprites when it has them, and falls back to shape tokens otherwise. |
| 4 spawn choices + drop height | **KEEP** (Advanced → Where it starts) | Plain words: "Drops on the target", "On you", "Beside you", "In front of you". |
| 9 motion kinds, six-step cap | **KEEP** | Timeline blocks plus one card per step, with plain kind names. The cap is soft in rev 8: going over warns but doesn't block, and extra steps stay saved but don't play. |
| Release together / split (step 2+ on straight, swerve, bounce) | **KEEP** | Shown only where the source uses it. |
| Per-step look ramps (size, glow, opacity, colour) | **KEEP** (inside the step card) | Each ramp is a toggle that reveals its from/to fields. The colour ramp is new in rev 8 (`tint_on` / `tint_from` / `tint_to`). |
| Second motion in a step (layer) | **KEEP** | Collapsed at the bottom of the card. |
| Copies differ (jitter, start spread, size spread) | **KEEP** | Only for row, spin and free fire, as in spec.ts. |
| "Pick several" batch edit of steps | **CUT** | Multi-select is clumsy on a phone, and 6 steps is small. |
| Drag the board to set bend | **CUT** → slider | The drag fights page scroll and is imprecise on touch. |
| Draw a trace / tap bounce tiles / tap reel bodies | **SIMPLIFY** | A tap-a-tile grid inside the card numbers the tiles in order, with "Remove last" and "Clear". The path also shows on the live preview. Fields: `trace_points`, `bounce_points`, `reel_tie`, `reel_land`, `reel_links`. A **Points start from: Caster / Target** picker (`steps[].anchor`, default caster) saves `{dc, dr}` offsets that may be negative. Switching keeps the tiles where they are on screen. `rotate_with_facing` (default on) turns them with the caster's facing. |
| Snap on/off (points between tiles) | **CUT** for now | Tile fields are whole tiles (`{c, r}` ints) in rev 8, so it is always snapped. |
| Edge off / stop / clip / bounce; one ease per ability | **KEEP** (Advanced → Where it starts) | Rarely changed. |
| Hit none / nudge / knock-1 / split; tap the enemy to cycle | **KEEP** the picker, **CUT** the tap | **CoS call (reversible):** Foe reaction lives under Advanced → "Hit (looks only)" only, never in Simple. Tap-to-cycle is cut. |
| Damage 0–99 | **CUT** | Rules own damage. **CoS call (reversible):** Advanced → Hit shows the ability's damage as read-only info ("Sky Drop hits for 1 (set by the ability rules)"), and `damage_label` can show that number on the preview. |
| Impact burst colour / sparks / radius | **KEEP** | "Hit flash" on/off and its colour are in Simple; sparks and size are in Advanced. |
| Drag the red mark to set the hit time | **SIMPLIFY** | A percent slider, with the red mark shown on the timeline. |
| Scrubber, 0.25× / 0.5× / 1× / 2×, loop | **SIMPLIFY**; scrubbing **deferred (LATER)** | It always loops, with Replay and a 1× / ½× toggle. **CoS call (reversible):** drag-to-scrub comes later. |
| The English sentence above the tabs | **CUT** from the UI | Long and spec-like. Keep `describeSkill()` for accessibility text and the `describeSetup()` summary. |
| Finish: copy the `SKILLRIG v1` block for chat; Load an order (paste JSON) | **CUT** | It shows code. Save writes to the project. Booth import is a Keeper mapping (`fromSkillSpec`) and could come back as "Import from BTF booth" later. |
| Kept abilities (24) with search by name, tag or sentence | **KEEP** as the project's Effects list | Sorted by name, then id. No cap (documents). Tags (≤ 4) are project data inside the effect document: they travel with it and feed search and the plain sentence. |
| Diff against a kept order | **CUT** | "Reset" (back to the preset) plus Undo covers it. Setups already have a preset diff. |
| Undo | **KEEP**, add **Redo**, **Reset to preset**, **Duplicate** | As the brief asks. Project actions (Save & use, Use on…, Delete, Duplicate, Fork) are each **one** undo entry, offered as an Undo button in the toast. |
| Debug overlay (tile numbers, clock) | **CUT** | Developer-only. |
| Sound cue name + time | **KEEP** (Advanced → Timing & sound) | `cue_name` (free text, ≤ 32) plus `cue_at` (step 0.01, greyed while the name is empty). The preview stays silent, like the booth. |
| localStorage `bloodline-skillrig-v1` | **CUT** | Effects live in project files (`effects/<id>.json`). |
| Boot gate (Effects only when not `VITE_TOWER_SHIP`) | **KEEP** the idea | It's an editor screen. It never ships inside an exported game (same as the level-builder ruling). |
| One canvas loop for the preview | **KEEP** | One `requestAnimationFrame` drives every preview, including all the preset tiles. |
| "Spin, then fly together" / "Spin, then split" presets | **KEEP**, as one grid of 10 looks | Each look is a recipe plus a picture (rev 10: 6 recipes; "Drop onto the target" is shared by Purple Drop, Cut, Heaven Sword, Feather and Spike). Every tile shows `display_name`, a BTF tag, its picture with the recipe name as a small chip, and the `blurb`. Heaven/Feather/Spike are unchanged. |

## 3. Screen flow (hash deep links in the mock)
1. **Effects list** (`#library`, project level). The list is **sorted by name, then id**. There's no count cap; the chip reads "N in project".
   - Each row has a mini preview, "From <preset>", its step count and "Used by …" (a stage-only use reads "Line Shot (Bridge only)"), plus Edit · Use on… · Duplicate · Delete.
   - If the effect names a picture the project doesn't have, the row says "! Picture missing · draws the stock picture".
   - **Duplicate** makes "<name> copy" (then "copy 2", …) with a new id. Abilities keep pointing at the original, and the toast says so: "1 ability still uses 'Needle Storm'."
   - **Delete:** if no ability uses the effect, it goes at once, with Undo in the toast. If abilities use it, a panel opens with three choices:
     - It warns with the count: "Used by 3 abilities: Sky Drop, Arc Sweep, Lane Sweep…"
     - **Delete and switch 3 abilities to None**: one action, one undo entry.
     - **Delete, leave the warning**: those abilities show a missing-effect warning and play None.
     - **Keep it**.
   - The 10 built-in BTF looks are presets, not documents, so they never have Delete.
2. **Start from a look** (`#presets`, `#presets/<id>`). One grid of the 10 BTF looks. Each tile shows:
   - a looping mini preview on the effect's default board (2 × 2, or 2 × 1 if flat)
   - `display_name` with a BTF tag
   - its picture next to the recipe chip (e.g. "Drop onto the target", "Cone from the caster")
   - the `blurb`

   Tapping a tile plays it big at the top, and "Use <name>" goes to step 2.
3. **Designer, Simple** (`#simple`). The live preview stays pinned on top. It's the effect's own preview board (2 × 2 by default, 2 × 1 for flat effects), You → Foe, looping, with Replay and ½×. Below it are the Simple | Advanced steps tabs, then Undo · Redo · Reset · Duplicate, then these controls:
   - Name.
   - **Picture**, with its tag (Studio pack (pending) / CC0 / Yours).
   - When the picture is an uploaded or library asset, **only `blade` greys out**, driven by the catalogue's `disabled_when {knob: picture, in_docs: asset}`:
     - The reason line comes from `disabled_reason` ("Using your picture"), with the hint "Blade applies to stock pictures only" (from rev 12 `disabled_note`) under it.
     - Its action **Switch back to stock drawing** sets `picture` to "none".
     - The blade value is kept.
     - Colour, glow, glow size, size and spin stay enabled.
   - **Colour**.
   - **Speed · shortcut**.
   - **Size**: whole zoom steps, plus **Size steps: Whole | Any size**. Any size is greyed with "Turn on Advanced render", and a stored value is kept.
   - **Count · shortcut**.
   - **Hit flash**.
4. **Picture picker** (`#sprite`). Three groups:
   - **Studio pack pictures**, tagged *Studio pack (pending)*, with the info line "May not ship in exported games yet. Pick a CC0 or your own picture to be safe."
   - **Built-in library** (CC0: stand-in Arrow, Orb and Spark).
   - **Your pictures** (Yours).

   Below them is **Upload**, which runs the art-upload checks: see-through, JPG warning, strip-of-frames (first frame for now) and a ×1/×2/×3 zoom preview. Nothing is ever stretched.
5. **Designer, Advanced steps** (`#advanced`, `#step/<n>`).
   - The timeline shows blocks (width = seconds) and a red hit mark.
   - Each step card has ↑ ↓ ✕, the kind picker, length and release, then the kind's own fields:
     - Trace, bounce and reel add **Points start from: Caster / Target** and the tap-a-tile grid (sized to the preview board), which shows "Saved as offsets from the caster: (+1, −1) …". On a board of 4 squares or fewer, a hint suggests enlarging it.
     - **Picture for this step** (*proposed*; "Effect's picture" = null).
     - Look ramps, including opacity sliders 0–1.
     - "Let copies differ".
     - "Second motion".
   - **+ Add step** is never disabled.
     - At 6: "6 steps is the most that plays, in Preview and in exported games."
     - Past 6, the extra blocks turn dashed: "More than 6 steps. Preview and exported games both play only the first 6; step 7 stays saved but won't play."
   - Sections:
     - Look
     - Where it starts (includes **Turn points with facing**, with the hint "No effect for units with no facing, like the pieces in this preview")
     - **Preview board** (columns, rows, place You / Foe, Pieces: project sprites or shapes)
     - Hit (looks only): Foe reaction, plus read-only damage info ("Sky Drop hits for 1 (set by the ability rules)")
     - Library tags (each label is up to 16 characters, with a counter)
     - Timing & sound
6. **Save**.
   - Opened from the list, Save returns to the list.
   - Opened from an ability, the banner reads "Designing for Sky Drop" and the button reads **Save & use**. Creating the effect and pointing the ability at it is **one** undo entry, shown as one toast: "Saved 'Sky Wrath' and Sky Drop uses it. One undo. [Undo]".
7. **Ability → Effect row** (`#ability`, `#ability-pick`). The card shows None or a mini preview, with Pick / Change and Design new / Edit effect. The pick sheet lists **+ Design a new effect**, None, Your effects and Built-in.
8. **Use on…** (`#use-on`). The 39 abilities that can carry an effect, grouped and searchable. **Save & apply to N** is one undo entry.
9. **Preview Godmode → Effect section** (`#godmode`). The mock shows Stage 2 "Bridge", where Line Shot uses Needle Storm.
   - It has Units · Rules · **Effect** tabs (the first two are placeholders) and a live preview.
   - A header card says which effect plays and where. **Save to** offers **All stages** only; "This stage" is shown disabled, with the reason.
   - Fields shown: Colour, each step's length, Hit lands %, Sound name, Sound at. "More fields" holds sparks and size, and any other effect field can be added the same way.
   - **Save to all stages** writes the effect document.
   - **Fork for this stage** is one undo entry. It copies the effect with the tweaks as "Needle Storm (Bridge)", and points Bridge's Line Shot at the copy through a stage override. Other stages keep the original.

## 4. Which knobs show where (catalogue rev 12 ids, behaviour `effect`)

| Layer | Knob / item field ids |
|---|---|
| **Simple** | `picture` (ref asset, `"none"` = stock drawing) + `blade` (greyed via `disabled_when` while `picture` is an asset; value kept) · `tint` · **Speed** = `ui_derived.speed` → `steps.seconds` (shortcut, never stored) · `scale` + `scale_snap` (whole default; fractional only with Advanced render) · **Count** = `ui_derived.count` → `steps.row_count` / `steps.orbit_count` on the first row/orbit step (shortcut) · `impact` + `impact_colour` |
| **Advanced → Look** | `glow` · `glow_size` · `spin` · `trail` |
| **Advanced → Where it starts** | `spawn` · `drop` (drop-on-tile only) · `ease` · `edge` · `rotate_with_facing` |
| **Advanced → Preview board** | `booth_cols` · `booth_rows` · `booth_caster` · `booth_foe` |
| **Advanced → Motion steps** (`steps`, `min_items` 1, soft `max_items` 6) | every step: `kind` · `seconds` · `release` (step 2+, straight/swerve/bounce) · `picture` (asset \| null, *proposed*) · `look_ease` · `scale_on/from/to` · `glow_on/from/to` · `fade_on/from/to` (0–1, step 0.01) · point values are `{dc, dr}` from `anchor` · `tint_on/tint_from/tint_to` · `layer_kind` · `layer_delay`. By kind: straight `lock`, `pierce` (step 0.5) · swerve `bend` · trace `anchor`, `trace_points` · row `row_count`, `row_gap` · orbit `orbit_count`, `orbit_radius`, `orbit_turns` · cone `cone_rows`, `cone_angle`, `cone_ribbon` · reel `anchor`, `reel_reach`, `reel_pull`, `reel_anchor`, `reel_tie`, `reel_land`, `reel_links` · bounce `anchor`, `bounce_points` · spread `jitter` (0.02), `start_spread`, `size_spread` (0.01) |
| **Advanced → Hit (looks only)** | `hit` · `nudge` · `damage_label` · `impact` · `impact_colour` · `sparks` · `impact_radius` |
| **Advanced → Library tags** | `tags` (≤ 4 soft; `label_max_len` 16; project data) |
| **Advanced → Timing & sound** | `connect` (as %) · `cue_name` (text ≤ 32) · `cue_at` (step 0.01, greyed while `cue_name` is empty) |
| **Godmode → Effect** | any `effect` answer, shown: `tint`, `steps[].seconds`, `connect`, `cue_name`, `cue_at`, `sparks`, `scale` |
| **Ability screens** | each owner's `effect` ref (`{docs: "effect", builtin: none + 10}`) on all **39** owners |

**Not knobs:** the Effects list (project UI over `effects/<id>.json`), and Speed and Count (`ui_derived`, `stored: false`).

## 5. Placeholders
- **Pictures:** stock art is 16 px stand-ins drawn in code, and so are the 3 CC0 library pictures (Arrow, Orb, Spark). The real ones come in through the built-in art copy (P4).
- **Unit sprites:** the Archer and Rival Knight are 16 px stand-ins drawn in code. A real project uses its unit art.
- **Preview board:** booth pieces have no facing, so the preview never rotates points (identity, project-format r9 §6.7). Rotation shows only in a real game with facing units.
- **Tinting uploads:** the code tints any image (paint.ts `tintedBlade()`), but the mock preview doesn't tint uploaded or library pictures yet.
- **Frames:** an uploaded strip plays its first frame only.
- **Frame cap, 64 (Architect H4 step 25, project-format r25 §6.7 K-4):** an effect block can hold at most **64 frames**. The engine refuses a block over 64 (`fxTooManyFrames`) rather than cutting it, so the editor must stop at 64: the add-frame button greys out at 64 with "64 frames is the most an effect can hold", and an uploaded strip longer than 64 asks "Keep the first 64 frames?" (Keep 64 / Cancel). A document TileEngine saved can never trip the engine check.
- **Sound:** the preview is silent.
- **Godmode:** the Units and Rules tabs are placeholders. The Godmode screen shows one stage and one ability.
- **Undo:** project undo lives in memory and resets on reload.

## 6. Open questions for the CEO, and calls already made

### CoS calls (reversible), 2026-11-09
- **Tags:** each tag is up to 16 characters (`label_max_len`). There's a soft warning once there are more than 4 tags, and **no hard cap on the count**. The warning reads: "More than 4 tags. That's fine: nothing is blocked and every tag stays saved. Exports to the BTF booth keep only the first 4."
- **Preview pieces:** the preview uses the project's real unit sprites when there are any, and shape tokens otherwise. The mock has stand-ins (Archer for You, Rival Knight for the foe) and a mock-only "Project has unit sprites" switch under Preview board (shots 19 / 19b).
- **Size default:** whole zoom steps, with the default at **×5** (stored 1.2 tiles of a 16 px picture on a 64 px tile). Kept at ×5. On the old 2 × 1 board the start of the drop was clipped; the 2 × 2 board below fixes that (19c / 19d).
- **Default preview board (CoS call, reversible; now in catalogue rev 12):** **2 × 2**, with the caster bottom-left {c:0,r:1} and the foe bottom-right {c:1,r:1}, so drops have a row above the foe. **2 × 1** ({0,0} / {1,0}) is used only for flat effects.
  - The mock decides from the recipe. An effect is flat when it doesn't drop onto the tile, every step is a straight lock-on, reel or scratch, and no stored point is off the caster's row. Of the 6 recipes, only `reel` (Chain Hook) is flat (19e); the drop, holy-drop, cone and both spin recipes get 2 × 2.
  - The 2 × 2 defaults are read from the catalogue (rev 12 `booth_rows` 2, `booth_caster` {c:0,r:1}, `booth_foe` {c:1,r:1}), not from a local constant. The flat 2 × 1 board is derived from them by dropping to one row with r = 0. `FLAT_FALLBACK` in `js/effects.js` turns the flat rule off.
  - A board the user picked under Preview board is kept as saved.
- **Simple set:** stays as it is (picture, colour, speed, size, count, hit flash). Foe reaction is under Advanced only.
- **Damage:** shown as read-only info under Advanced → Hit: "<Ability> hits for N (set by the ability rules)". With no ability it reads "Damage comes from each ability's rules".
- **Scrubbing:** **deferred (LATER)**. Replay and ½× stay for now.

### Still open with the CEO
1. **Rotation snap:** nearest-neighbour rotation at angles that aren't 90° looks jagged. Is that OK, or should pictures snap to 45° steps?
2. **Glow default:** is the halo on by default, or only behind Advanced render?
3. **BTF art:** not in the v1 library (CEO), and shipping in exports is still not allowed. The stock BTF pictures keep the *Studio pack (pending)* tag and the line "May not ship in exported games yet. Pick a CC0 or your own picture to be safe."

### Resolved earlier
- **Fractional size:** CoS Q1, `scale_snap`.
- **Over-cap steps:** r7; Preview and Render both play the first 6.
- **`blade` with a picture set:** rev 11 `disabled_when`.

## 7. Gaps

### Resolved by r7 (project-format r7–r9 §6.7, setup-format r8–r9, catalogue rev 9–11)
- **Where saved effects live (K-1):** in `effects/<id>.json`, listed from the derived `index.effects[] {id, name, tags, referencedBy, used}`. Sorted by name, then id. No count cap. → Built.
- **Duplicate (K-1d):** a new `effect_<ULID>`, "<name> copy", fresh history and `copiedFrom`. Abilities keep the original. → Built, with a toast that says so.
- **Tags (K-1e):** project data inside the effect document, not editor-only. → Doc wording fixed.
- **Uploaded pictures (K-2, L-5, L32):** `effect.picture` (ref asset, "none" = stock `blade`) and `steps[].picture` (asset \| null = the effect's picture). An unknown id gives `unknownRef`, a warning, and draws the stock blade. → Built. The step picture field is tagged *proposed*.
- **Delete (K-3):** a plain delete warns with the count. "Delete and switch N abilities to None" is one compound action and one undo. Built-ins can't be deleted. → Built.
- **Over-cap steps (K-4):** steps 7+ are kept but inactive, and Preview and Render both play only the first 6. → Wording updated.
- **Save & use (K-5):** one compound action, one undo entry. → Built as one toast item.
- **Godmode (K-6):** saves to All stages only, plus "Fork for this stage" (duplicate with tweaks, then an L2 override → the copy), one undo. → Mock screen built.
- **Precision (L-2, L-3):** `fade_from`/`fade_to` 0.01, `cue_at` 0.01, `pierce` 0.5, `jitter` 0.02, `size_spread` 0.01. → Sliders use them; fade is now a slider.
- **Cue (rev 9):** `cue` is retired and replaced by the text knob `cue_name`. → Built.
- **Speed/Count (L-6):** `ui_derived`, never stored. → Labelled "shortcut".
- **Preset labels (L-7):** `display_name` + `blurb` on all 10. → Used. Real presets are grouped apart from the stock-picture buttons.
- **L-8** (heaven/feather/spike only change the picture): confirmed. Kept as they are.

- **Coordinate frame (L-1, rev 10 L33, project-format r9):** points are `{dc, dr}` from `steps[].anchor` (caster default, or target). `rotate_with_facing` defaults to on, and it is the identity for units with no facing (BTF and booth pieces). `points_anchor` is retired (board → caster, shifted by `booth_caster`). → Built.
- **Fractional scale (CoS Q1, `scale_snap`):** → Built. A stored fractional is kept when Advanced render is off.
- **Preview board (`booth_*`):** → Built.
- **Recipes (CoS Q3):** 10 looks from 6 recipes, with unchanged ids. → Recipe chip on each tile.
- **Blade grey-out (rev 11):** driven by `disabled_when` / `disabled_reason`. → Built.
- **Tag labels:** capped at 16 characters (`label_max_len`, L29). → A counter is shown and the input stops at 16. There's no cap on how many tags (CoS call), only the soft warning past 4.

### Still open
- **BTF art:** not in the v1 library (CEO), and shipping in exports is still not allowed (Q8). The UI keeps the tag and the warning line.
- **Effect pictures in the closure:** asset references from effect docs, including the per-step `picture` on the first 6 steps, are walked by §7.2 step 5b. Nothing is left for UX here; it's noted for Render.
- **Off-board points:** the index warns (`effectPointOffBoard`) and the runtime clamps. The editor could show that warning on the tile grid; not built yet.

## 8. Run and screenshots
```bash
cd /workspace/tileengine/ui-shell && python3 -m http.server 8765
# http://127.0.0.1:8765/mock-effects/index.html   (#library, #presets, #simple, #advanced, #step/2, #sprite, #ability, #ability-pick, #use-on, #godmode)
.venv/bin/python mock-effects/scripts/capture.py         # mock-effects/screenshots/*.png at 390x844 (DPR 2); prints ERRORS: none
```
The screenshot list is in `mock-effects/README.md`.
