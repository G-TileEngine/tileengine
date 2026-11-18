# Learn from keeps — plan only (on top of r72)

**Status:** PLAN ONLY. **Not accepted for build.** Nothing is built into the live shell. A build needs the CEO's own SEND.  
**Hold (G8, 14:55 Europe/London):** no build after this quality pass. Wait until the results are much closer to `target-weapon-tiers.jpg`, and keep iterating on quality.  
**Owner:** Editor & UX Designer  
**Live base:** gh-pages `536279b` (r72). This plan sits on top of that.  
**CEO direction:** 2026-11-12 14:04, 'learn from keeps' for Sprite Studio's built-in generator; standing direction at 14:27 (game maker first, also a 2D asset tool, no 3D); quality note at 14:47 ('Further improvements are needed to the quality of the sprites.'); answers to the plan questions at 14:55 Europe/London (see §17A); quality keeps at 15:07, 15:14, 15:15, 15:26, 15:27, 15:29, 15:41, 15:43, 15:45 and 16:03 Europe/London (see §17A CEO keeps).  
**Prototype:** `ui-shell/mock-gen-learn/proto.py` (v1 baseline / Icon style), `quality_v2.py`, `quality_v3.py`, `quality_v4.py`, `quality_v5.py`, `quality_v6.py`, `quality_v7.py` (offline Python, no AI). Default `python3 proto.py` runs v7; `v1`, `v2`, `v3`, `v4`, `v5`, `v6`, and `icon` replay those frozen passes.  
**Mocks:** `ui-shell/mock-gen-learn/index.html` (standalone, 390×844)  
**Shots:** `ui-shell/screenshots/73g-*.png` (v1 and UI mocks), `73g2-*.png` (v2), `73g3-*.png` (v3), `73g4-*.png` (v4 and Icon style), `73g5-*.png` (v5), `73g6-*.png` (v6), `73g7-*.png` (v7).  
**Does not touch:** `ui-shell/js`, `ui-shell/css`, `ui-shell/index.html`. Nothing is published.

---

## 1. Goal

Every sprite the maker **Keeps** from the built-in generator can teach an on-device style library: silhouette, colour ramps and part pieces. The next Generate remixes and varies those keeps, so the output drifts toward their style. Importing a picture (the converter) stays the better path for painted detail. Generation should be a worthy alternative: offline, no AI model, nothing leaves the device.

TileEngine stays a **game maker first**. The same Studio should also work as a **2D asset tool** for people who never open a stage: sprites that animate properly, an instant preview while they tweak, and an export that works on its own in another editor. No 3D, ever, in this plan.

The CEO's target (`/workspace/share/gen-learn/target-weapon-tiers.jpg`) is the quality bar for weapon tiers: an axe and a crimson sword, each in three growing tiers (bigger head, extra flanges and ornament, richer shading), at small pixel sizes with a clean outline.

## 2. Current state (r72)

Sprite Studio's "generator" today is `buildHero()` in `ui-shell/js/sprite-studio.js`: fixed ready-made parts (3 bodies, 4 hairs, 3 outfits, 4 weapons). Weapons are a 1-pixel sword, staff or bow, upright in the hand. There is no item or weapon generator. Item still starts as a 16×16 "small pickup" to draw over.

Keep today does three different jobs, and none of them teach a style library:

- Converter **Keep** brings a picture into the editor.
- **Save to project sprites** bakes the drawing to pixels (history is not included in games).
- r69 **Keep** can create a project asset.

House style, already locked and reused here: 1px dark-hue outline, 3-step shading, light from the top left, at most 16 colours, hue-shifted shadows. Outline and shade are render rules, never baked into the drawing slots. Crisp is the default look. Basic adds zero extra taps; Advanced holds the extra sliders.

Walk today (r68): one drawing, four directions (Down, Up, Side, Left = Side mirrored), default 4-frame walk, body-map regions, "Weapon stays in the same hand". This plan does not replace that. It requires generated and learned sprites to stay consistent with it.

## 3. Locked rules

- Phone-first. Thin top bar, bottom rail, sheets at most 40% of the screen, canvas at least 75%, except the library manager and the export result, which may be full-height (same exception as the r70 inbox).
- 48 px+ touch targets. AA contrast, light and dark. Calm r62 look. All code hidden. Short, plain words.
- Offline only. No AI. Nothing leaves the device. The hub upload already on the Save sheet stays a later, separate opt-in.
- Basic adds zero extra taps once "More like my keeps" is on: **Generate** and **Keep** are enough. **Make tiers** is one more tap when they want a set.
- The library is device-local. It is not part of a game export, and it does not sync to the cloud. It may be backed up only inside the project Download file (G7).

## 4. How a keep is recorded

A Keep is recorded from the pure-generation path (a generated sprite, or one they then edited with the pencil). **Imported pictures he then Keeps also teach the library** (G2, 14:55). The source is stored as `imported` so Advanced can still filter, but the silhouette, parts and ramps go in like any other keep.

### What is extracted

From the sprite on the canvas, at the moment they tap Keep, with learning on:

| Piece | What we store | Why |
|---|---|---|
| Kind and family | `item` + `axe` / `sword` / later others | Remix only inside a family |
| Size | width × height | Tiers may grow the canvas |
| Angle and anchors | icon pose, socket / guard / pommel | So swapped parts line up |
| Silhouette | packed 1-bit mask | For mutation and readability checks |
| Parts | packed map: axe `head / haft / wrap / pommel / ornament`; sword `blade / guard / grip / pommel / ornament` | Part swaps |
| Palette ramps | 3-step colours + line, optional 4th highlight, per part, total ≤ 16 | Ramp swaps, stable across frames and tiers |
| Outline and shade | thickness 1, dark-hue, 3 steps, light from the top left | House bake, never a baked outline in the mask |
| A 32×32 preview | tiny indexed picture, for the library UI only | So they can recognise a keep |
| Provenance | source (`generated` / `edited`), time, a weight (recent + how often it was kept) | Mixing |

The drawing stays in palette slots (part + tone), not raw RGB, the same as Studio today.

### Where it is stored

A new device-local document, proposed name `gen-style-library`, owned by the Data & Save Keeper (K1–K4). It is **not** inside the shipped game and it does **not** sync to the cloud. The only backup path is inside the **project Download file** (G7, 14:55) — no separate cloud backup. IndexedDB or OPFS, not localStorage: a keep is about 1.8 KB packed in the prototype (masks + ramps + a 32×32 preview). A cap of **80 keeps** is about 150 KB, with room to spare. When the cap or the device quota is hit, evict the oldest unused keeps, never a project sprite, and say so in plain words (r72 quota pattern).

### Consent

- Basic has one toggle: **More like my keeps**. Off means Generate uses only the built-in seeds, and Keep does not write to the library.
- The first time they would write a keep, a one-line note: "This stays on your phone. Nothing is uploaded."
- Default: **off**, until he turns it on (G1, 14:55; same privacy posture as the social toggles).
- Reset learning and Forget do not need a second consent; they only remove what was already granted.

## 5. How the generator remixes and varies keeps

Keeps are bucketed by kind + family. An axe never remixes with a sword or a hero.

On **Generate**, with the toggle on:

1. Pick one or two keeps, weighted toward **recent** and **frequent** keeps, with a small floor so older keeps are not forgotten.
2. **Part swap** — for example the head of keep A on the haft of keep B, lined up on the socket or guard.
3. **Ramp swap** — recolour a part with another keep's ramp, still hue-shifted, still ≤ 16 colours.
4. **Silhouette mutation** — 1–2 px thicken or thin, a little length change, a small flange added or removed. Stronger when Variety is up.
5. **Silhouette blend** — only inside the same family and a similar pose; then Tidy. This stays Advanced, and is easy to get wrong, so v1 can ship without it.
6. **Novelty** — a reserved slice (about 20% at default Variety) leans on the built-in seeds or a stronger mutation, so the library cannot collapse to one look.
7. Every result is baked with the house rules (1px dark-hue outline, 3-step top-left shade, ≤ 16 colours) and passed through Tidy.

With the toggle off, Generate only uses the built-in seeds (a steel axe, an iron axe, a crimson sword in this prototype; more families later).

A locked seed stays still while sliders move (§10). A new Generate tap draws a new seed.

## 6. Tier growth — one 'Make tiers' button

From the sprite on the canvas, one tap builds a three-tier set in the same family and the same palette lineage. Canvas sizes are decided (G3, 14:55), matching the target and this prototype:

| Tier | Canvas | What changes |
|---|---|---|
| T1 | 32×32 | Compact, simple head or blade, 3-step shade, no extra ornament |
| T2 | 48×48 | Head (or blade and guard) scales about 1.4×, one small flange or wrap, slightly richer mid-tone, still 3-step shade |
| T3 | 64×64 | Head scales about 1.8–2×, opposing flanges or guard curls, a wrap and a fuller pommel, a 4th highlight on the main metal, a richer ramp, then a colour-merge so the set stays at 16 colours |

The three sit on the canvas, on a dark presentation ground, at the **same integer zoom**, so T3 is clearly larger. A short 40% sheet offers **Keep all three** or **Pick one**. A tier set is saved as a set (same lineage id); Pick one stays available (G4, 14:55). If learning is on, record the T1 as the style keep so the library is not flooded with three near-copies.

Items sit at 45°, like the target and this prototype. Held weapons stand upright in the hero's hand (G9, 14:55). The item generator does not rotate a held weapon; the hero path, when it comes, draws an upright variant from the same parts and ramps.

## 7. Animation that works

This is the 14:27 bar: generated and learned sprites must animate properly, not only look fine as a still.

**Characters (when this path reaches heroes and enemies):** one drawing, four directions, default 4-frame walk, same as r68. Parts, ramps and the outline rule are shared across all 4×4 frames. The walk moves body-map regions; it must not invent a new palette, a new outline colour, or a drifted part. Left stays a mirror of Side, and the weapon stays in the same hand.

**Weapon and item tiers:** they do not walk. Consistency is across the three tiers instead: the same ramp slots, the same outline rule, the same anchors (the haft still meets the socket, the blade still meets the guard). T2 and T3 may add parts (wrap, flanges) but they may not retint T1's steel or thicken the outline.

**No drifting pixels.** The same seed, the same bake, integer positions. No sub-pixel offsets between frames or tiers. Same outline on every frame of a sheet.

**Honest checks before export** (§12, §14). If a frame's palette does not match, or an outline gap appears only on one frame, we say so in plain words and do not pretend the sheet is clean.

The first build, when it is allowed, covers **items and weapons only**. Heroes and enemies come later (G5, 14:55). The part-slot and shared-ramp design is the same one heroes will need, so we do not have to redo it.

## 8. Undo, forget, and the library

- After Keep: a short chip, **"Kept. It will shape new ones. Undo"** — this is undo last keep (removes it from the style library; the project or downloaded file is asked about only if we also just saved it).
- **Forget** on each keep in the library manager.
- **Reset learning** — a confirm sheet: "Clear every learned keep on this phone? Sprites you already saved or exported stay." One undo until they leave the screen.
- The library is visible in Advanced, and from Basic by a "My keeps" link that opens the same full-height screen. Each row is a preview, a name, Forget, and how recently it was used.

Forget and Reset clear **only the library** (G6, 14:55). They never delete a project asset or a file they already downloaded.

## 9. Basic vs Advanced

**Basic** (default):

- One toggle: **More like my keeps**.
- **Generate** — a new variant. **Keep** — save it, and teach the library if the toggle is on. **Make tiers** — the set in §6.
- Colour and Pencil stay on the rail, so they can still touch up.
- Zero extra taps if they leave the toggle as it is.
- **Proposed (CEO keep, 15:15 Europe/London), not built:** a **Style: Detailed / Icon** toggle in Basic. **Detailed** is the target-matching tier set (v4 and later). **Icon** is the frozen v1 look from the 'Proto T2' column of `73g-compare-target.png`, for inventory and UI icons. The Icon pixels must not change when Detailed is iterated.

**Advanced**:

- **Learn** slider — how heavily keeps weigh against the built-in seeds (0% = seeds only, 100% = almost only their keeps).
- **Variety** slider — how wild the mutations are.
- **Per-part locks** — lock the blade, reroll the guard, and so on.
- The **library manager** (§8).
- Family, size and seed, if they want them.
- Export scales beyond the Basic default (§12).

The drawing is the same data in both modes.

## 10. Instant preview

Advanced sliders (Learn, Variety, and the tier-growth feel) must update a preview **while the finger is still moving**, not after they lift. The prototype bake is well under 50 ms on a 64×64 sprite, so this can run on the main thread.

Phone pattern, to keep the canvas at 75% and the sheet at 40%:

- The sheet holds the sliders and **three live thumbs** (new variants, or T1 / T2 / T3).
- The canvas shows the chosen one at full size, integer zoom, house bake.
- While a slider moves, the seed stays locked, so the picture morphs instead of jumping to a new random sprite. A new Generate tap (or lifting the slider and tapping again) draws a new seed.

Reduced-motion: no tween, just the snapped stills. The same for the Make tiers row.

## 11. 'Make assets' — Studio without a project

A new Home entry, **Make assets**, opens Sprite Studio with no project, no stage, and no game settings. The top bar says **Make assets**. Save to a project is hidden until they pick a project; **Export** is the primary action.

Placement is decided (G10, 15:03 Europe/London): a new **ninth option** on the Home globe, next to Standalone engine, labelled **Make assets**. This does not replace New project. TileEngine is still a game maker first.

From Make assets they can still **Add to a project** later (a picker of projects on this device). Until then, keeps and unsaved work live on the device in the style library and a small asset inbox (K11), and anything they care about should be exported.

## 12. Standalone export

Export must work **on its own, outside a game**. Today's Save sheet only says "Save to project sprites" and "Baked to pixels". Make assets users, and makers who want a file for Godot, Unity 2D, Aseprite or a shop listing, need a real download.

Basic export is one tap, after the checks in §14, and downloads a zip:

- A transparent **PNG** of the current sprite, 1×, no checker, no outline baked twice.
- A **sprite sheet** PNG, also transparent, integer-packed (no half pixels, no gap padding other than a 0 or 1 px agreed in the map).
- A **JSON frame map** beside it, in plain words and plain keys, so another tool can slice the sheet. Proposed shape (Keeper: K12):

```json
{
  "name": "Steel axe",
  "image": "steel-axe-sheet.png",
  "frame": { "w": 32, "h": 32 },
  "scale": 1,
  "origin": { "x": 16, "y": 28 },
  "animations": {
    "idle": { "frames": [0], "ms": 0 }
  },
  "frames": [{ "x": 0, "y": 0, "w": 32, "h": 32 }]
}
```

For a walking character the sheet is 4 frames across and 4 directions down (Down, Side, Up, Left), and `animations` lists `walk-down`, `walk-side`, `walk-up`, `walk-left`. For a weapon tier set, the zip also has:

- The three PNGs (`…-t1.png`, `…-t2.png`, `…-t3.png`) at their own sizes.
- A **tier set sheet** (the three in a row, same integer zoom, transparent), plus a `tiers` list in the JSON.

Integer scales: Basic is **1× and 2×** by default. 3× and 4× (and 8× if they want a shop thumbnail) live in Advanced. A tier set downloads as **one zip** (G11, 14:55).

A standalone asset export never includes the style library or the drawing history. The library may be backed up only inside the **project Download file**. No cloud (G7, 14:55).

## 13. Quality checks

Run after every Generate, every Make tiers, and again just before Export:

- 1 px outline is complete: no gaps, no 2 px clumps.
- At most 16 colours. If a richer T3 ramp would go over, merge the rarest colours (the prototype already does this) and say "trimmed to 16 colours".
- The silhouette still reads when a 48 or 64 is shown at 32 px. No 1 px-only features that vanish.
- Contrast between parts (blade vs haft, head vs haft).
- One connected silhouette (Tidy already drops stray pixels).
- **Across frames and tiers:** the same palette, the same outline colour and thickness, no drifted anchors, no frame-only holes.

If a check fails: try Tidy once, or one silent regenerate. If it still fails, say so ("The outline has a gap on the left frame") and offer Tidy or Generate again. Before Export, a failed **palette or outline** check is a hard stop with a fix; a weak-readability check is a warning they can go past, so we never ship a lying sheet quietly.

## 14. Performance on phones

- All CPU, no WASM, no model. Same bake as `sprite-studio.js`.
- A Generate or a slider tick should stay under 50 ms at 64×64 with a full library. The prototype is well under that.
- Library loads once, as packed typed arrays. Previews are 32×32.
- Studio is already lazy-loaded in r72; this path stays inside that load.
- Reduced-motion skips only the tween, not the result.

## 15. Build phases and effort

Plan-only this round. **Not accepted for build.** G8 (14:55 Europe/London): wait, no build after this pass, until the sprites are much closer to the target. A later build still needs its own SEND.

| Phase | What ships | Effort (rough) |
|---|---|---|
| P1 | Item / weapon generator with built-in seeds, house bake, Generate, Keep, Colour, Pencil. No learning yet. | 2–3 days |
| P2 | Record keeps, the Basic toggle, remix, library manager, Undo / Forget / Reset. Instant preview on the Advanced sliders. | 2–3 days |
| P3 | Make tiers, the 32 / 48 / 64 rules, Keep all or Pick one, consistency checks across the set. | 2 days |
| P4 | Standalone export (PNG, sheet, JSON, tier sheet, 1× and 2× default, tier set as one zip), the pre-export checks, **Make assets** on Home (9th globe option, next to Standalone engine). | 2 days |
| P5 | More families (bow, staff, potion), optional silhouette blend, hero/enemy learning and a 4×4 walk sheet that stays consistent. | 2–3 days, later |

First build, **when it is allowed**, is **P1–P4, items and weapons only** (G5). Heroes and enemies stay in P5. That scope is unchanged. Quality iteration on the prototype continues first; it is not a new live-shell phase, and it does not raise the P1–P4 day count. The calendar is on hold until G8 is lifted.

## 16. Risks

- **Quality gap vs the target.** v2 is closer than v1 (sculpted crescent bits, a long three-band blade glow, hue-shifted ramps, selout) but it is still not close enough for a build (G8). The baroque claw guard, the finest axe flanges, and soft bloom still fall short. See §19–§20. Import stays the better path for painted detail until this gap closes.
- **Mode collapse.** Too much Learn and too little Variety, and every Generate looks the same. The novelty floor and the Variety slider are the guard.
- **Bad segmentation** on a heavily pencil-edited keep. Fall back to "Keep as one piece" and still learn the ramp and silhouette.
- **Imports teaching the library** (G2: they do, once he Keeps them). A stock or Imagine picture can steer the generator; the `imported` source tag lets Advanced filter later if needed.
- **Canvas growth** (32 → 64) vs a 32 px project tile. The asset is honest about its size; a game can still use T1 at 32, or pad T3.
- **Make assets without a project** is a new save place. It must use the r72 quota and Download path, or work will vanish (K11).
- **Export confusion.** "Save to project" and "Export a zip" must stay two clearly named actions.
- **Animation drift** if a later hero path bakes outline per frame. Outline stays a rule, never baked into the slots.

## 17. Questions for the CEO

1. Should "More like my keeps" start off, until they turn it on, or on by default the first time they Generate and Keep? (Social settings were off by default.)
2. Should a picture they import and Keep also teach the library, or only sprites they generated (and then maybe edited)?
3. When they tap Make tiers, should T2 and T3 grow the canvas (32 → 48 → 64, as in the target and this prototype), or stay at 32 px and add detail inside the same box?
4. After Make tiers, should Keep save all three as a set, or keep them one at a time?
5. Is the first build for Items and weapons only (the target), or should heroes and enemies learn in the same round?
6. If they Forget a keep or Reset learning, the style library clears. Sprites they already saved or exported stay. Is that right?
7. The style library stays on this phone and never syncs, even if they later sign in or back up a project. A future opt-in backup would be a separate decision. Is that right?
8. The prototype gets the family, the 45° pose, the house outline and shade, and the growth. It does not match the target's sculpted curves, baroque guard, or many-step crimson glow. Is that close enough for a first build, with import still the better path for painted detail?
9. Generated items use a 45° icon pose, like the target. Hero-held weapons in the current ready-made hero stay upright in the hand. Should v1 stay that way?
10. For people who only want assets, what should the Home entry say: "Asset only" or "Make assets"? And should it be a new ninth option on the globe, next to Standalone engine?
11. Standalone export: is 1× plus 2× the default scale set (with 3× and 4× in Advanced), and should a tier set download as one sheet plus the three PNGs, in a zip?

## 17A. CEO answers (14:55 Europe/London)

The eleven questions in §17 were answered at 14:55, except Q10, which was answered at 15:03 Europe/London. The plan is **not accepted for build** (G8 still holds).

| # | Answer |
|---|---|
| G1 | **"More like my keeps" is OFF until he turns it on.** |
| G2 | **Imported pictures he Keeps also teach the library.** |
| G3 | **Tiers grow the canvas to 32, 48 and 64 px.** The prototype uses T1 32, T2 48, T3 64. |
| G4 | **A tier set is saved as a set, and Pick one is still available.** |
| G5 | **The first build covers items and weapons only.** Heroes and enemies come later. |
| G6 | **Forget and Reset clear only the library.** |
| G7 | **The library can be backed up only inside the project Download file. No cloud.** |
| G8 | **WAIT. No build after this pass.** Hold until the results are much closer to `target-weapon-tiers.jpg`, and keep iterating on quality. |
| G9 | **Items sit at 45 degrees, held weapons stand upright.** |
| G10 | **The label is "Make assets", added as the 9th Home globe option next to Standalone engine.** (15:03 Europe/London) |
| G11 | **Export 1× and 2× by default, and a tier set downloads as one zip.** |

### CEO keeps (quality iteration, 15:07–16:03 Europe/London)

The plan is still **not accepted for build** (G8 still holds). These are keeps from the quality iteration, not a lift of the hold.

- **15:07 Europe/London**, on v2: *"Yes the swords are a step in the right direction. The axes need more attention as they've drifted a bit."* Swords stay frozen at the v3 render (apart from a tiny 1× cleanup that was not needed). Axes in v4 are retraced against `target-weapon-tiers.jpg`, not against v1.
- **15:14 Europe/London:** *"The handle on t3 64 is good."* Keep the T3 64 px handle exactly as in v3, for **both** the axe and the sword: axe haft + wrap + pommel, sword grip + pommel. If the axe head needs to sit differently, move the head, not the handle. v4 stamps those v3 handle pixels bit-exact (verified in `quality_v4.py`).
- **15:15 Europe/London:** *"Proto T2 while not a match was good for icons and such."* Confirmed against the CEO's screenshot `/workspace/share/gen-learn/ceo-proto-t2-icon-keep.jpg` (phone shot, status bar 15:14, labels **Proto T2** and **Target T2** for the axe and the sword). That sheet is the **v1** prototype, `ui-shell/screenshots/73g-compare-target.png` — the only compare that uses a "Proto" column (v2/v3/v4 label the pass number). The T2 sprites are `grow_tiers` from the steel-axe and crimson-sword seeds in `proto.py`. Frozen as **Icon style** for inventory and UI icons: `python3 proto.py icon`, shot `ui-shell/screenshots/73g4-icon-style.png`, 1×/4×/8× under `mock-gen-learn/out/icon-style/`. Later quality passes must not alter these pixels. Proposed UX: a **Style: Detailed / Icon** toggle in Basic (§9).
- **15:26 Europe/London:** *"Axes have seen a massive improvement especially in 64."* Confirmed against `/workspace/share/gen-learn/ceo-v4-axe-64-keep.jpg` (phone shot of the v4 compare, T3 64 axe labelled "v4 1× / 8×"). The **v4 axe set, especially T3 64, is the baseline.** Snapshot: `mock-gen-learn/out/keep-v4/` (1×/8× PNGs, `.npz` arrays, manifest). Replay: `python3 proto.py v4`. v5 may only finish the axe (socket plate, 1 px cream, sharper fang) — do not retrace or reshape the head. Silhouette pixel-diff vs the snapshot must be reported and should be zero or nearly zero.
- **15:27 and 15:29 Europe/London, swords:** *"The swords blade however have drifted. V2 had the better blade and should've been improved from that. The new swords seem to have a glow around the edges... could just be the background not been trimmed out correctly."* Then, with `/workspace/share/gen-learn/ceo-sword-halo-note.jpg` (the 73g4 compare, Sword T2/T3, Target | v2 | v3 | v4): *"It might truly just be a background. Because if you look at the blade itself, there is clear visible improvement with each iteration but the red glow or whatever it is remains the same."* v5 uses the **v2 blade** as the baseline for every tier, keeps the **v3 handle/grip** (T3 64 handle remains a keep), and puts the v5 crab guard on without changing the blade. Halo diagnosis is in §20 v5 and `73g5-sword-halo-8x.png`.

- **15:41 Europe/London**, on v5 ("It's an improvement"), screenshot `/workspace/share/gen-learn/ceo-v5-guard-asym.jpg`: a guard piece touches the handle on the left with nothing matching on the right. T2/T3 guards must be **mirror-symmetric** (or deliberately balanced) across the blade axis, with a clear **1 px gap** from the grip/handle. Verify with a mirror diff. He also said 16 px is "really behind" while 64 is "miles ahead" — see 15:43 / 15:45 for the size clarification.
- **15:43 Europe/London:** by "16" he meant the smallest tier (**T1, 32 px**); by "64" he meant **T3**. Put the small-size effort into T1 32 and bring it up toward T3 quality. A 16 px icon is secondary (dropped in v6, not nearly free once T1/T2 took the budget). `73g6-small-sizes.png` leads with target T1 | v5 T1 | v6 T1 | v6 T3.
- **15:45 Europe/London:** *"Tier 2 as well is struggling to keep up with tier 3, just not as bad as tier 1."* T2 (48 px) gets the same per-size hand-tuned treatment as T1. Do T1 first, then T2. Leave T3 untouched apart from the guard symmetry fix. The small-sizes sheet adds a T2 row: target T2 | v5 T2 | v6 T2 | v6 T3.

- **16:03 Europe/London** (via CoS), on v6: T1 and T2 swords are a huge improvement — keep that direction; leave T1 as it is unless there is an obvious flaw. T2 currently reads as a bigger T1 and should be a **true midpoint** ("medium setting in a video game"): borrow more of T3's detail, shading and shape language, scaled down, not an upscaled T1. Axes are the **main focus**; T1 32 and T2 48 still need major work to reach T3. T3 axes and the 64 handles stay frozen and bit-exact. Use the §19A approach (per-size templates, per-size palette, stray-pixel cleanup). Fix the listed gaps: sharp flared wings like T3, a crab/claw read, and the cream lip, plate and fang in reduced form. T3 sword is frozen except a cheap purple-core lengthening is allowed. The eye rubric matters more than IoU (§19A bias).

## 18. Questions for the Data & Save Keeper

1. Is a new device-local document kind `gen-style-library` (formatVersion 1, stable id + rev, not a project document, not in a game export, not synced) the right home for keeps?
2. Should that document live in its own IndexedDB or OPFS key, not inside `player-profile` or `editor-prefs`? The only pref we need is the consent toggle.
3. Does the record shape in §4 (kind, family, size, angle, anchors, packed silhouette, packed parts, ramps, outline and shade rules, 32×32 preview, source, stamps, weight) look right, or should previews be derived and never stored?
4. Cap of 80 keeps, evict oldest unused on cap or quota, never evict a project asset — agreed?
5. Where does the consent toggle live: device-local `editor-prefs.genLearn.enabled`, or a profile pref? Recommended: device-local, because the library itself does not sync.
6. Reset learning: confirm, no automatic backup, one Undo until they leave the screen — enough?
7. If the source project sprite is deleted, the library entry remains (it is style, not the asset) — agreed?
8. Damaged file and quota: same r72 pattern (keep the last good copy, say the device is full, offer a Download, do not wipe silently)?
9. For a generated sprite that is also saved into a project, may we set `origin.kind = "procedural"` with `learnedFrom` as keep content hashes only, never the library bytes?
10. Make assets has no project. Where do in-progress assets live until Export or "Add to a project"? A sibling device-local `asset-library`, or only in memory? Can adding to a project later reuse the same pixels without a second copy?
11. Is the standalone export JSON a new small public sidecar the Keeper owns, or an EUX-owned file that is not a TileEngine document kind? It has to work in tools that have never heard of TileEngine.

## 19. Quality techniques

Research that shaped the v2 prototype, and how it is implemented. This is still a grammar-based offline generator, not a learned model and not a hand-painted copy of the target.

### Sources

- **Shape and part grammars.** Stiny-style shape grammars, applied as a weapon part grammar: axe is pommel → haft → wrap → socket / langet → two bits → centre spike; sword is pommel → grip → guard hub and claw arms → blade. Parts stay the same across T1–T3; later tiers add length, flare and extra arms rather than new species. Same idea as Dave Bollinger's *Pixel Spaceships* (symmetry, masks, adjacency rules) and compact procedural sprite generators such as zfedoran's `pixel-sprite-generator`. Modular weapon generators (segmented pommel / grip / guard / blade kits) use the same part-swap idea this plan already had for remix.
- **Curves and pixel-perfect lines.** Quadratic and cubic Béziers sampled densely, then rasterised. Pixel-perfect line rules from Zingl's rasterising (monotonic segments, no double pixels) and Tom Cantwell's Bézier-for-pixel-art notes: no 4-connected L-corners on a 1 px stroke (the L is replaced by a diagonal), consistent slopes, judge the line at 1×. The prototype's `thin_stroke` drops consecutive 4-connected steps; thick strokes use a circular brush along the curve.
- **Manual AA.** Pixel Parmesan, Lospec outline and AA notes, and the usual 1× rule: put a mid colour in the notch of a 2:1 (or shallower) stair, never on a 45° run, and never as a smear. Judge at 1×, not only at 8×. The prototype's `apply_selout_and_aa` does this with colours already in the ramp, so the 16-colour cap is not broken.
- **Selective outline (selout).** Pixel Logic (Michafrar), Pixor's selout write-ups, Saint11, and Lospec's outline articles: 1 px, no doubles, hue-matched to the part, darker on the shadow side, lighter or omitted on the lit side so a highlight can be the edge. The house 1 px dark-hue outline is the default; selout is how that rule is applied, not a second outline.
- **Hue-shifted ramps.** Saint11's colour theory and Slynyrd's Pixelblog 1 (palettes): 5–7 steps; value rises toward the light; hue shifts warm in the highlights and cool in the shadows; saturation peaks in the mid-tones and drops at the top (so the shine is almost cream, not a chalky white). Steel, wood, crimson (7 steps, with a purple core), teal and navy-grip are shared across a family so T1–T3 stay consistent. Axe T3 v2 uses 12 colours, sword T3 stays at the 16 cap after a merge.
- **Specular and rim.** Tight specular on surfaces that face the light (a high power on the Lambert term), plus a short rim on thin edges. Axe cutting edges get a 1 px cream bevel on the outer reach only, so the bit body stays mid steel. Sword blades get a three-band paint (pink-white lit edge, purple core, hot-red shadow edge) rather than Lambert alone, because a flat blade would not hold a long glow.
- **Glow.** A long crimson glow is an outer AA / fringe band plus an additive-looking tint, not a blur. Lit edge: pale pink-white. Shadow edge: hot red. Just outside the silhouette: a 1 px wine or hot-red fringe. The soft bloom in the target screenshot is still richer than this.
- **Symmetry with deliberate asymmetry.** The two axe bits share a grammar; the top bit is scaled about 1.06 so it is not a perfect mirror. Sword claw arms are paired left/right with mirrored hook signs, then the lengths differ slightly by side.
- **Tools reviewed, not required.** Lospec articles; Pixel Logic (Michafrar); Saint11; Slynyrd's Pixelblog; PyxelEdit and Aseprite habits (1× judgement, pixel-perfect lines, limited palettes, outline tools). Procedural references: Bollinger's pixel spaceships; compact JS pixel-sprite generators; kit-style weapon generators. None of these run in the prototype; they informed the rules above.

### Generator architecture changes (v1 → v2)

- Geometry moved from parametric wedges (which read as hammers) to **Bézier crescent ribbons** (bowed cutting-edge spine, tapered to two points, plus a neck and a langet at the socket) and **bounded claw arms** (bearing + length + hook angle, hard pixel caps so a curl cannot run off the canvas).
- Lighting is a chamfer distance field and outward normals, then part-specific passes: axe bevel, sword three-band glow, selout, manual AA, outer glow band.
- Placement uses the 45° diagonal of the T1 32 / T2 48 / T3 64 canvas (G3, G9), so a T3 fills the box the way the target does.
- Remix still jitters the same grammar (span, thickness, tip, arm hook, angle). Variants stay cousins, not new species.
- `cap16` still merges the rarest colour into the nearest if a bake would go over 16. No ramp was relaxed past 16 in this pass.

### What still falls short, and why

- **Axe T3 flanges and socket.** The bits now read as crescents with a cream rim, but the top bit is still a little too fan-like, the centre spike is messy, and the socket collects stray shade pixels. A ribbon-plus-neck is a good start; it is not yet the target's sculpted, slightly serrated inner edge or the long sharp ears.
- **Sword guard.** T1's four short arms are in the right family. T2/T3 grow more arms, but they still read as a radial splat of short teal sticks, not the target's thin baroque S-curve claws. A single hook on a tapered stroke is not enough at this size; the curls need tighter local drawing or a two-segment S, and thinner tips.
- **Glow bloom and blade core.** The three-band paint (pink / purple / hot red) is the right model and is the biggest sword gain, but the purple core is shorter than the target's, the red body is a bit flat, and the outer fringe is only 1 px, not a soft bloom. A true additive bloom would need extra colours or a display-only layer; the 16-colour cap fights a wide fringe.
- **Edges and AA.** Selout and 2:1 stair AA are present, but 1× still shows jaggies and a harder outline on the blade than the target (the target often lets the glow replace a dark line). JPEG softness in the reference also makes the target look more anti-aliased than a clean pixel grid.
- **Why not closer still, this pass.** The generator is a grammar, not a painter. Closing the last gap means either more hand-authored part shapes (especially the T3 guard and the T3 axe ears) or accepting that import remains the better path for that last painted detail. The v3 pass closes some of this (S-curve claws, a longer core, a dithered bloom, sharper axe ears) but not enough to lift G8. See §20.

## 19A. Why small sizes trail the large ones (root cause, 15:41–15:45 Europe/London)

The CEO's eye on v5: 64 (T3) is "miles ahead," 16 (he meant T1 32) is "really behind," and T2 48 is "struggling to keep up with tier 3, just not as bad as tier 1." This is not just a scoring quirk. It is how the generator and the converter have been built so far.

Likely causes, in both the built-in generator and the picture converter:

1. **The same grammar and detail budget at every size.** T3 ornaments (crab claws, socket plate, fang, a long cream rim, a 7-step crimson ramp) are also asked of 32 and 48 px. At those sizes the extra parts collapse into single-pixel noise and a muddy silhouette, instead of being dropped or simplified.
2. **Downsampling or averaging.** The converter shrinks a large painting with a box or bilinear filter. Neighbouring colours mix, outlines go soft, and "almost-transparent" fringes appear. The same happens if a 64 px generator output is naively scaled down to 32 or 16.
3. **A fixed 1 px outline eats a larger share of the sprite.** On a 64 px canvas a 1 px ring is a small rim. On 32 px it is already a big fraction of the silhouette; on 16 px it would eat the shape. Selective outline has to be authored per size, not applied as a fixed-width post-process.
4. **The ramp collapses.** A 6–7 step steel or crimson ramp becomes two muddy mid-tones when there are not enough interior pixels for a highlight, a core, and a shadow. Highlights and the purple core disappear unless the ramp is reduced on purpose (3 steps plus a cream or wine lip, 6–8 colours in total).
5. **IoU and the rubric have been tuned on 64.** Quality work and the recovered-mask score follow the size that already looks good. A JPEG-traced T1/T2 silhouette can post a high IoU against that same recovered mask and still read as blocky at 1×. Visual quality at 32 and 48 needs a size-specific pass, not a better score on the 64-shaped mask.

Proposed fix, for the plan (not built):

- **Per-size templates, or a size-aware grammar.** 32 and 48 px get their own clusters: a simpler, slightly exaggerated bit and blade, ornaments dropped or reduced, 1 px selective outline, at most 6–8 colours, no downscaled T3 detail and no single-pixel noise. 64 px keeps the richer grammar. v6 is a prototype of this for T1 then T2; T3 stays the v5 baseline.
- **A cluster cleanup pass** after every size: drop 1 px islands, forbid 2×2 blobs on thin features, keep a minimum 2 px body except for the outline.
- **For the converter:** a size-specific requantise (pick a 6–8 colour ramp for 32/48, not "shrink then keep 16") plus **manual-AA / selective-outline rules**, instead of plain downscaling. Never leave mid-alpha. The item sprite stays alpha 0 or 255; glow belongs to Effects.

G8 still holds: this is diagnosis and a prototype direction, not a build.

## 20. How close the prototype gets to the target

Method, applied to every tier of both weapons, after looking at 1× and 8× nearest-neighbour renders against the zoomed target crops (`/tmp/gen-learn-zoom/*-4x.png`):

1. **Eye rubric, 0–10 each:** silhouette, guard/ornament, ramp/shading, glow (or bevel shine on the axe), edges/AA. Overall = mean / 10.
2. **Silhouette IoU** against a background-keyed mask of the sharp zoom crop, fitted to the same 32 / 48 / 64 canvas, best score in a ±10 px translation window. The recovered mask is a guide, not a hand-traced gold master (T1 hafts are dark and the source is a photograph of pixel art).
3. **Palette distance:** mean CIE76 ΔE from each prototype pixel to the nearest colour in that target crop.

v1 was first reported with looser "cousin" headlines (axe T1 ~2/3, axe T3 ~1/2, sword T3 ~2/5). The table below also rescores v1 on the same rubric so old vs new is like-for-like.

| Sprite | v1 old headline | v1 rubric | v1 IoU | v1 ΔE | v2 overall (IoU, ΔE) | v3 rubric (sil, orn, ramp, glow, AA) | v3 overall | v3 IoU | v3 ΔE | v3 colours |
|---|---|---|---|---|---|---|---|---|---|---|
| Axe T1 | ~2/3 | 0.36 | 0.60 | 9.4 | 0.60 (0.73, 2.1) | 7, 5, 7, 6, 5 | **0.60** | **0.64** | 2.4 | 9 |
| Axe T2 | — | 0.38 | 0.51 | 7.3 | 0.62 (0.65, 2.2) | 6, 6, 7, 6, 5 | **0.60** | **0.58** | 2.4 | 14 |
| Axe T3 | ~1/2 (to 3/5) | 0.38 | 0.44 | 7.0 | 0.60 (0.57, 1.8) | 7, 6, 7, 6, 5 | **0.62** | **0.52** | 1.9 | 14 |
| Sword T1 | — | 0.40 | 0.47 | 5.6 | 0.64 (0.60, 6.2) | 7, 7, 7, 7, 6 | **0.68** | **0.55** | 6.4 | 16 |
| Sword T2 | — | 0.38 | 0.28 | 4.5 | 0.62 (0.65, 4.5) | 7, 6, 7, 8, 6 | **0.68** | **0.56** | 4.9 | 16 |
| Sword T3 | ~2/5 | 0.38 | 0.22 | 5.8 | 0.62 (0.63, 2.7) | 7, 6, 8, 8, 6 | **0.70** | **0.59** | 2.8 | 16 |

v3 IoU uses the same translation search as v2, but the prototype mask is the solid sprite plus a 1 px AA/selout ring — the 2–3 px dithered bloom is excluded, otherwise the fringe would punish a better glow. On that same solid+1 px mask, v2 sword IoU is 0.54 / 0.60 / 0.59 (the v2 column above keeps the previously published baked-mask figures).

**v3 vs v2, in short:** the sword is the real gain. T3 overall goes from 0.62 to 0.70, from a longer purple core, a dithered (less flat) red body, a 2–3 px bloom, a softer blade outline, and hand-authored S-curve claws that no longer read as a radial splat. Axe T3 overall edges up 0.60 → 0.62: the ears are more pointed and the head is more of a piece, but the socket and inner edges are still messy, and IoU is a little worse than v2 (the bits are a deeper C, so they overlap the target less). All v3 tiers stay at 16 colours or fewer. **This is still not "much closer" in the G8 sense.** The remaining gaps below are why the plan stays unaccepted.

v3 remaining gaps: the T3 axe socket and spike are cleaner than v2 but not yet a crisp plate and fang; some inner-edge bites remain on T2/T3 bits; the T3 claws are open hooks, not the target's thin organic crab; the bloom is a stepped dither, not a photographic soft blur; 1× still has some jaggies.

### Quality pass v4 (axes, 15:07–15:15 Europe/London)

CEO 15:07: swords are a step in the right direction; axes had drifted. v4 retraces all three axe tiers from `target-weapon-tiers.jpg` (zoomed crops, hand-traced silhouettes, house grey/cream ramp, cream on the outer cutting edge only). Swords stay at v3, bit-exact. T3 64 handles stay at v3, bit-exact (CEO keep, 15:14); the T3 axe head is translated to sit on that haft. Axe IoU is scored on the same recovered-mask method as the published v2 figures (0.73, 0.65, 0.57), ±10 px. Sword IoU uses the v3 solid+1 px mask (bloom excluded), so the frozen swords match the published v3 row.

| Sprite | v2 overall (IoU, ΔE) | v3 overall (IoU, ΔE) | v4 rubric (sil, orn, ramp, glow, AA) | v4 overall | v4 IoU | v4 ΔE | v4 colours |
|---|---|---|---|---|---|---|---|
| Axe T1 | 0.60 (0.73, 2.1) | 0.60 (0.64, 2.4) | 8, 6, 7, 7, 6 | **0.68** | **0.88** | 2.7 | 10 |
| Axe T2 | 0.62 (0.65, 2.2) | 0.60 (0.58, 2.4) | 8, 7, 7, 7, 6 | **0.70** | **0.87** | 2.3 | 9 |
| Axe T3 | 0.60 (0.57, 1.8) | 0.62 (0.52, 1.9) | 8, 7, 7, 7, 6 | **0.70** | **0.72** | 0.9 | 16 |
| Sword T1 | 0.64 (0.60, 6.2) | 0.68 (0.55, 6.4) | 7, 7, 7, 7, 6 (frozen) | **0.68** | **0.55** | 6.4 | 16 |
| Sword T2 | 0.62 (0.65, 4.5) | 0.68 (0.56, 4.9) | 7, 6, 7, 8, 6 (frozen) | **0.68** | **0.56** | 4.9 | 16 |
| Sword T3 | 0.62 (0.63, 2.7) | 0.70 (0.59, 2.8) | 7, 6, 8, 8, 6 (frozen) | **0.70** | **0.59** | 2.8 | 16 |

**v4 vs v3 / v2, in short:** the axe is the gain. Silhouettes go back to the target's shallow wings; the deep C-curve and fan-like top bit from v2/v3 are gone; inner-edge bites are largely closed. Axe IoU is up on every tier versus v2: **0.88 / 0.87 / 0.72** against **0.73 / 0.65 / 0.57**. T2 and T3 rubric reach 0.70; T1 is 0.68 (cream on one bit is still a little thick, and the JPEG trace leaves the 32 px bits a bit blocky). T3 IoU is the smallest of the three gains because the T3 64 handle is the v3 keep: the head was moved to that haft, so the pose is slightly off the target even though the head shape is closer. All v4 tiers stay at 16 colours or fewer. Icon style is a separate, frozen v1 track (see §17A). **This is still not "much closer" in the G8 sense.** The remaining gaps below are why the plan stays unaccepted.

v4 remaining gaps: the T3 cream rim is still weaker and less continuous than the target's 1 px highlight; the T3 socket reads as mid-grey rather than a crisp distinct plate; the fang is cleaner than v3 but not as sharp as the target; T1 cream and bit corners still show the JPEG-trace softness; T3 pose is slightly off because the handle is frozen; the sword guard is still the v3 open hook, not the target's thin organic crab; the bloom is still a stepped dither; 1× still has some jaggies.

### Quality pass v5 (15:26–15:29 Europe/London)

CEO 15:26: the v4 axes, especially T3 64, are a keep — snapshot in `out/keep-v4/`, replay with `python3 proto.py v4`. v5 only finishes colours on that silhouette (T3 plate with a 3-step ramp and 1 px dark rim, a sharper fang, a 1 px cream rim; T1 cream thinned). Silhouette pixel-diff vs the snapshot is **0 / 0 / 0** for T1 / T2 / T3. T3 64 handles stay bit-exact with v3 on both weapons. T2 axe pixels are unchanged from v4.

CEO 15:27 / 15:29: the v3/v4 sword blade had drifted; start again from the **v2 blade**. The red edge glow is **not** a bad trim, leftover target background, or a sheet tint: 73g4 compare cells are pixel-identical to the raw sprites; every pass has alpha only 0 or 255; no baked pixel matches the matte/background colour. The halo is baked into the sprite — v2's tight wine/hot glow, then the fatter 2–3 px dithered bloom added in v3 and frozen into v4. The target column's soft aura is the target artwork's own painted glow, and so looks the same in every compare. v5 drops the outer bloom from the item sprite (glow belongs to Effects) and also shows a tight 1 px optional glow in `73g5-sword-halo-8x.png`. v5 swords = v2 blade + v3 handle + v5 crab-claw guard (T2/T3), with the guard never overwriting the blade or the handle.

| Sprite | v3 overall (IoU, ΔE) | v4 overall (IoU, ΔE) | v5 rubric (sil, orn, ramp, glow, AA) | v5 overall | v5 IoU | v5 ΔE | v5 colours |
|---|---|---|---|---|---|---|---|
| Axe T1 | 0.60 (0.64, 2.4) | 0.68 (0.88, 2.7) | 8, 6, 7, 7, 6 | **0.68** | **0.88** | 2.7 | 10 |
| Axe T2 | 0.60 (0.58, 2.4) | 0.70 (0.87, 2.3) | 8, 7, 7, 7, 6 | **0.70** | **0.87** | 2.3 | 9 |
| Axe T3 | 0.62 (0.52, 1.9) | 0.70 (0.72, 0.9) | 8, 7, 8, 7, 6 | **0.72** | **0.72** | 0.9 | 16 |
| Sword T1 | 0.68 (0.55, 6.4) | 0.68 (0.55, 6.4) | 7, 7, 7, 6, 6 | **0.66** | **0.56** | 4.9 | 16 |
| Sword T2 | 0.68 (0.56, 4.9) | 0.68 (0.56, 4.9) | 7, 7, 7, 6, 6 | **0.66** | **0.65** | 4.1 | 16 |
| Sword T3 | 0.70 (0.59, 2.8) | 0.70 (0.59, 2.8) | 7, 8, 8, 6, 6 | **0.70** | **0.67** | 2.8 | 16 |

**v5 vs v4, in short:** axes barely move on purpose (silhouette unchanged; T3 plate/cream/fang are a colour finish; T3 overall 0.70 → 0.72). Swords go back to the v2 tapered blade, lose the v3/v4 edge bloom, and pick up a crab-claw guard on T2/T3. Sword IoU rises on T2 (0.56 → 0.65) and T3 (0.59 → 0.67); the glow score is a point lower because the outer bloom is no longer on the item. All tiers stay at 16 colours or fewer. Icon style and the v4 axe snapshot stay frozen. **G8 still holds.**

v5 remaining gaps: the T3 axe cream and plate are closer but still not a painted match for the target; T1 bits still show some JPEG-trace softness (silhouette was not chiselled, by the 15:26 keep); T3 axe pose is still slightly off because the handle is frozen; the v5 crab guard is the right family but still a little blocky from the JPEG trace, and it sits on the v3 hub so the overlay shows a pose offset; the v2 blade is the right baseline but is still short of the target's long purple core and soft painted glow (that glow now belongs to Effects); 1× still has some jaggies.

### Quality pass v6 (15:41–15:45 Europe/London)

v5 was snapshotted first to `out/keep-v5/` (1×/8× PNGs, `.npz`, manifest). Replay: `python3 proto.py v5`. Icon style stays frozen. T3 64 handles stay bit-exact with v3 on both weapons. T3 axes are untouched (silhouette pixel-diff **0**; SHA matches the snapshot). T3 swords are untouched apart from the **guard symmetry fix** (v2/v5 blade occupancy is unchanged: **0** blade pixels added or removed).

CEO 15:41 / `ceo-v5-guard-asym.jpg`: the v5 T2/T3 crab had a piece touching the handle on the left with nothing matching on the right. v6 authors one side of thin tapered fingers, mirrors them across the blade axis, and enforces a Chebyshev ≥ 2 gap (at least 1 empty pixel) from the grip/handle; guard selout is not allowed to fill that gap. Mirror unmatched pixels: **v5 39 / 21 → v6 0 / 0** (T2 / T3). Min handle gap: **v5 1 / 1 → v6 2 / 2**. The v5 blade is kept on T3; glow stays off the item (optional 1 px glow still exists as an alternative).

CEO 15:43 / 15:45: "16" meant T1 32, "64" meant T3; T2 is also behind, just less so. T1 then T2 get a **per-size hand-tuned pass** (clusters drawn for 32 / 48, a simpler readable silhouette, exaggerated bit and blade, ornaments dropped or reduced, 1 px selective outline, ≤ 8 colours, no downscaled T3 detail, no 1 px noise). The 16 px icon was dropped (not nearly free). `73g6-small-sizes.png` is target T | v5 T | v6 T | v6 T3, for T1 and T2, both weapons, 1× and 8×.

| Sprite | v5 rubric (sil, orn, ramp, glow, AA) | v5 overall | v5 IoU | v5 ΔE | v5 colours | v6 rubric (sil, orn, ramp, glow, AA) | v6 overall | v6 IoU | v6 ΔE | v6 colours |
|---|---|---|---|---|---|---|---|---|---|---|
| Axe T1 | 8, 6, 7, 7, 6 | **0.68** | **0.88** | 2.7 | 10 | 8, 6, 8, 7, 7 | **0.72** | **0.69** | 2.5 | 8 |
| Axe T2 | 8, 7, 7, 7, 6 | **0.70** | **0.87** | 2.3 | 9 | 8, 7, 8, 7, 6 | **0.72** | **0.63** | 1.6 | 8 |
| Axe T3 | 8, 7, 8, 7, 6 | **0.72** | **0.72** | 0.9 | 16 | 8, 7, 8, 7, 6 (frozen) | **0.72** | **0.72** | 0.9 | 16 |
| Sword T1 | 7, 7, 7, 6, 6 | **0.66** | **0.56** | 4.9 | 16 | 7, 7, 8, 6, 7 | **0.70** | **0.48** | 4.4 | 7 |
| Sword T2 | 7, 7, 7, 6, 6 | **0.66** | **0.65** | 4.1 | 16 | 7, 8, 8, 6, 7 | **0.72** | **0.63** | 3.2 | 7 |
| Sword T3 | 7, 8, 8, 6, 6 | **0.70** | **0.67** | 2.8 | 16 | 7, 8, 8, 6, 6 | **0.70** | **0.62** | 3.1 | 15 |

Sword outline vs v5 (solid + 1 px selout; blade occupancy in parentheses): T1 **63** (blade **0**), T2 **133** (blade **0**), T3 **233** (blade **0**). The outline change is the new guard (and, on T1/T2, the size-aware handle recolour's selout). Axe outline vs v5: T1 **87**, T2 **239**, T3 **0**.

**v6 vs v5, in short:** T3 axes do not move. T3 swords only fix the asymmetric, handle-touching guard — the blade is the v5/v2 blade, the T3 handle is bit-exact, and the new claws are thinner, mirrored, and gapped. T1 and T2 were redrawn for their own size: cleaner two-bit axes and a readable 3-band sword with a longer purple core, at 8 / 7 colours. Eye scores on T1 and T2 rise toward T3 (axes 0.68 / 0.70 → **0.72 / 0.72**; swords 0.66 / 0.66 → **0.70 / 0.72**). IoU on the hand-tuned tiers falls (axes 0.88 / 0.87 → 0.69 / 0.63; swords 0.56 / 0.65 → 0.48 / 0.63) because the recovered target mask follows the JPEG-traced v5 silhouette, and a size-aware redraw is not a pixel match for that mask — this is the scoring bias in §19A, not a regression of 1× readability. All tiers stay at 16 colours or fewer; T1/T2 stay at 8 or fewer. **G8 still holds.**

v6 remaining gaps: T1/T2 axe wings are cleaner than the JPEG trace but still more rounded/"pill" than T3's sharp flared cutting corners, and they do not yet paint-match the target; T3 axe cream, plate, fang, and frozen-handle pose are unchanged; T1 sword's guard is a simple balanced cross (right for 32, not the target's small organic cluster); T2/T3 claws are symmetric and gapped but still a little more "hook" than the target's tight crab; the v2/v5 T3 blade still falls short of the target's long painted purple core (left untouched on T3 by the 15:45 instruction); glow stays off the item, so the target's soft aura is still an Effects job; 1× still has some jaggies, especially on T2's rounded bits.

### Quality pass v7 (16:03 Europe/London)

v6 was snapshotted first to `out/keep-v6/` (1×/8× PNGs, `.npz`, manifest). Replay: `python3 proto.py v6`. Icon style stays frozen. T3 axes stay bit-exact with v6/v5 (SHA `ffa247186d5d1b15`, outline change **0**). T3 64 handles stay bit-exact with v3 on both weapons. T1 swords stay bit-exact with v6 (SHA match, outline **0**, blade **0**). T3 swords keep the v6 silhouette and handle (outline **0**, blade occupancy **0**); the only change is a cheap ramp-only lengthening of the purple core.

Axes are the main focus. T1 and T2 were redrawn from per-size templates in T3's shape language: sharp flared wing tips instead of v6's rounded/"pill" bits, a claw inner edge, a 1 px cream lip, and a reduced plate and fang (a dark socket block and a tiny spike on T1; a 3-step plate and a short fang on T2). T2 is a midpoint, not a scaled T1. Palettes are per-size (T1 8 colours, T2 9, T3 frozen at 16). A stray-pixel pass drops 1 px islands and nibbles 2×2 blobs on thin features.

T2 sword is the midpoint the CEO asked for: reduced T3 crab claws (still mirror-symmetric, Chebyshev ≥ 2 handle gap), a 7-step crimson ramp with a visible purple core and more red body than v6 T2, and the richer v3 handle colours. T1 sword is left at v6.

The **eye rubric matters more than IoU** (§19A). The recovered target mask follows the JPEG-traced silhouette, so a cleaner size-aware redraw can lose IoU while reading better at 1×.

| Sprite | v6 rubric (sil, orn, ramp, glow, AA) | v6 overall | v6 IoU | v6 ΔE | v6 colours | v7 rubric (sil, orn, ramp, glow, AA) | v7 overall | v7 IoU | v7 ΔE | v7 colours |
|---|---|---|---|---|---|---|---|---|---|---|
| Axe T1 | 8, 6, 8, 7, 7 | **0.72** | **0.69** | 2.5 | 8 | 8, 7, 8, 7, 6 | **0.72** | **0.67** | 2.5 | 8 |
| Axe T2 | 8, 7, 8, 7, 6 | **0.72** | **0.63** | 1.6 | 8 | 8, 7, 8, 7, 6 | **0.72** | **0.63** | 1.9 | 9 |
| Axe T3 | 8, 7, 8, 7, 6 | **0.72** | **0.72** | 0.9 | 16 | 8, 7, 8, 7, 6 (frozen) | **0.72** | **0.72** | 0.9 | 16 |
| Sword T1 | 7, 7, 8, 6, 7 | **0.70** | **0.48** | 4.4 | 7 | 7, 7, 8, 6, 7 (frozen) | **0.70** | **0.48** | 4.4 | 7 |
| Sword T2 | 7, 8, 8, 6, 7 | **0.72** | **0.63** | 3.2 | 7 | 7, 8, 8, 6, 7 | **0.72** | **0.56** | 5.7 | 15 |
| Sword T3 | 7, 8, 8, 6, 6 | **0.70** | **0.62** | 3.1 | 15 | 7, 8, 8, 6, 6 | **0.70** | **0.62** | 3.3 | 15 |

Outline vs v6 (solid + 1 px selout; blade occupancy in parentheses): axes T1 **46**, T2 **126**, T3 **0**; swords T1 **0 (0)**, T2 **69 (0)**, T3 **0 (0)**. T2/T3 sword guards: mirror unmatched **0 / 0**, min handle gap **2 / 2**.

**v7 vs v6, in short:** the overall eye numbers stay in the T3 band on purpose — T1 and T2 still trail T3's painted finish, and the rubric is not used to claim they have caught up. What changed is the shape language. T1/T2 axes no longer read as rounded pills: they have flared points, a claw waist, a cream lip, and a reduced plate and fang, and T2 is clearly the midpoint between T1 and T3 rather than a bigger T1. T2 sword borrows T3's claws and 7-step ramp (more red body, still a purple core) instead of the flatter 7-colour v6 T2. T3 sword's purple core is a little longer, with no outline or handle change. IoU is flat or slightly down (axe T1 0.69 → 0.67; sword T2 0.63 → 0.56); that is the §19A bias, not a 1× regression. All tiers stay at 16 colours or fewer. **G8 still holds.**

v7 remaining gaps: T1/T2 axe wings are in T3's family but still a little shorter and less sharp than T3, and the cream lip is weaker and less continuous than the target's; the reduced plate and fang read at 8× but are not a painted match for T3; T3 axe cream, plate, fang and frozen-handle pose are unchanged; T1 sword's guard is still the simple v6 cross; T2/T3 claws are symmetric and gapped but still more "hook" than the target's tight organic crab; the T3 purple core is longer than v6 but still short of the target's painted core; glow stays off the item; 1× still has some jaggies.

## 21. Files and shots

Prototype and algorithm:

- `ui-shell/mock-gen-learn/proto.py` — v1 extract, remix, Make tiers, house bake, quality gate (`python3 proto.py v1`)
- `ui-shell/mock-gen-learn/quality_v2.py` — v2 grammar, lighting, selout, AA, glow, scoring (`python3 proto.py` or `python3 quality_v2.py`)
- `ui-shell/mock-gen-learn/assets/` — baked PNGs used by the UI mock
- `ui-shell/mock-gen-learn/out/library-preview.json` — a sample library record for the Keeper
- `ui-shell/mock-gen-learn/out/quality-report.json` — v1
- `ui-shell/mock-gen-learn/out/quality-v2-report.json` — v2 rubric, IoU, ΔE

Algorithm and comparison shots:

- `ui-shell/screenshots/73g-target-reference.png` — the CEO's target, mid-band only
- `ui-shell/screenshots/73g-seed-keeps.png` — three hand-made keeps (steel axe, iron axe, crimson sword)
- `ui-shell/screenshots/73g-generated-variants.png` — remixed 32×32 variants
- `ui-shell/screenshots/73g-tiers-axe.png` — Make tiers, axe T1–T3
- `ui-shell/screenshots/73g-tiers-sword.png` — Make tiers, sword T1–T3
- `ui-shell/screenshots/73g-compare-target.png` — v1 prototype vs target, with the earlier honest note

Quality-pass shots (target | old v1 | new v2, 1× and 8× nearest-neighbour):

- `ui-shell/screenshots/73g2-compare-target.png`
- `ui-shell/screenshots/73g2-tiers-axe.png`
- `ui-shell/screenshots/73g2-tiers-sword.png`
- `ui-shell/screenshots/73g2-variants.png`

Quality-pass v3 shots (target | v1 | v2 | v3, 1× and 8× nearest-neighbour):

- `ui-shell/screenshots/73g3-compare-target.png`
- `ui-shell/screenshots/73g3-tiers-axe.png`
- `ui-shell/screenshots/73g3-tiers-sword.png`
- `ui-shell/mock-gen-learn/quality_v3.py` — v3 grammar, hand-authored guards, bloom, 1× cleanup (`python3 proto.py v3`)
- `ui-shell/mock-gen-learn/out/quality-v3-report.json`

Quality-pass v4 shots (target | v2 | v3 | v4, 1× and 8× nearest-neighbour; swords frozen at v3):

- `ui-shell/screenshots/73g4-compare-target.png`
- `ui-shell/screenshots/73g4-tiers-axe.png`
- `ui-shell/screenshots/73g4-axe-overlay.png` — axe-only, target mask vs v4 mask, overlap cream, target-only green, v4-only red; as-placed and best ±10 aligned
- `ui-shell/screenshots/73g4-icon-style.png` — frozen Icon style (v1 Proto T2 keep)
- `ui-shell/mock-gen-learn/quality_v4.py` — traced axe heads, T3 handle freeze, v3 swords (`python3 proto.py v4`)
- `ui-shell/mock-gen-learn/out/keep-v4/` — frozen v4 axe PNGs and `.npz` arrays (CEO keep, 15:26)
- `ui-shell/mock-gen-learn/out/quality-v4-report.json`
- `ui-shell/mock-gen-learn/out/icon-style/` — frozen 1× / 4× / 8× Icon PNGs
- `ui-shell/mock-gen-learn/templates/axe-t{1,2,3}-trace.png` — v4 traces
- CEO confirmation shot: `/workspace/share/gen-learn/ceo-proto-t2-icon-keep.jpg`

Quality-pass v5 shots (target | v3 | v4 | v5, 1× and 8× nearest-neighbour):

- `ui-shell/screenshots/73g5-compare-target.png`
- `ui-shell/screenshots/73g5-tiers-axe.png`
- `ui-shell/screenshots/73g5-tiers-sword.png`
- `ui-shell/screenshots/73g5-sword-guard-overlay.png` — T2/T3 target | v3/v4 | v5 | guard-mask diff
- `ui-shell/screenshots/73g5-sword-blades.png` — target | v2 blade | v5 blade, 1× and 8×
- `ui-shell/screenshots/73g5-sword-halo-8x.png` — T3 edge 8×, v3/v4 bloom before, v5 after, on checker and mid-grey, plus optional tight glow
- `ui-shell/mock-gen-learn/quality_v5.py` — v5 (`python3 proto.py`; `python3 proto.py v4` / `icon` still replay those keeps)
- `ui-shell/mock-gen-learn/out/quality-v5-report.json`
- CEO confirmation shots: `/workspace/share/gen-learn/ceo-v4-axe-64-keep.jpg`, `ceo-sword-halo-note.jpg`
- Copies of the 73g5 shots also in `/workspace/share/gen-learn/`

Quality-pass v6 shots (target | v2 | v5 | v6, 1× and 8× nearest-neighbour):

- `ui-shell/screenshots/73g6-compare-target.png`
- `ui-shell/screenshots/73g6-tiers-axe.png`
- `ui-shell/screenshots/73g6-tiers-sword.png`
- `ui-shell/screenshots/73g6-small-sizes.png` — target T1/T2 | v5 T1/T2 | v6 T1/T2 | v6 T3, both weapons, 1× and 8×
- `ui-shell/screenshots/73g6-guard-mirror.png` — T2/T3, v5 vs v6, plus a tinted mirror-diff (cream = matched, red/green = unmatched)
- `ui-shell/mock-gen-learn/quality_v6.py` — v6 (`python3 proto.py` or `python3 proto.py v6`; `python3 proto.py v5` / `v4` / `icon` still replay those keeps)
- `ui-shell/mock-gen-learn/out/keep-v5/` — frozen v5 axe and sword PNGs and `.npz` arrays
- `ui-shell/mock-gen-learn/out/quality-v6-report.json`
- CEO confirmation shot: `/workspace/share/gen-learn/ceo-v5-guard-asym.jpg`
- Copies of the 73g6 shots also in `/workspace/share/gen-learn/`

Quality-pass v7 shots (target | v6 | v7 on the small-sizes sheet; target | v5 | v6 | v7 on the compare; tiers with a target row):

- `ui-shell/screenshots/73g7-small-sizes.png` — FIRST: target T1/T2 | v6 T1/T2 | v7 T1/T2, both weapons, 1× and 8×
- `ui-shell/screenshots/73g7-tiers-axe.png` — T1 | T2 | T3 side by side, target row and v7 row, 1× and 8×
- `ui-shell/screenshots/73g7-tiers-sword.png` — same layout for swords
- `ui-shell/screenshots/73g7-compare-target.png` — target | v5 | v6 | v7, 1× and 8×
- `ui-shell/mock-gen-learn/quality_v7.py` — v7 (`python3 proto.py` or `python3 proto.py v7`; `python3 proto.py v6` still replays the v6 keep)
- `ui-shell/mock-gen-learn/out/keep-v6/` — frozen v6 axe and sword PNGs and `.npz` arrays
- `ui-shell/mock-gen-learn/out/quality-v7-report.json`
- Copies of the 73g7 shots also in `/workspace/share/gen-learn/`

UI mocks (390×844, light and dark):

- `ui-shell/screenshots/73g-basic-generate-light.png` / `73g-basic-generate-dark.png`
- `ui-shell/screenshots/73g-tiers-sheet-light.png` / `73g-tiers-sheet-dark.png`
- `ui-shell/screenshots/73g-library-advanced-light.png` / `73g-library-advanced-dark.png`

A build still needs the CEO's own SEND. This plan is not accepted. This folder is not for gh-pages.

## 22. Later UX to-do (parked at v7, CEO 2026-11-12 16:41 London)

Not scheduled. Pick these up only when the CEO or CoS restarts sprite work.

1. **Bring back v1 as a separate style.** The v1 sword look (chunky cyan claw guard, the left column in ceo-1639-sword-v1-style.jpg) is to be kept as an alternative style option, next to the frozen Icon style. CEO 17:05 clarification: the v1 look itself was fine. The problem was a dark diagonal smudge drawn by mistake across the grip just below the guard (white arrow in ceo-1705-v1-smudge-arrow.jpg). When this style comes back, remove that smudge so the grip reads cleanly, and check that the other tiers don't carry the same artefact.
2. **Connect the axe handle to the axe head on the 64 px (T3) axe.** In ceo-1639-axe-handle-gap.jpg the shaft stops short of the head, so the axe reads as two parts. Run the shaft up into the socket. This is a deliberate exception to the "64 handle bit-exact" keep.
3. Already parked from v8: the T1/T2 axes (wing sharpness and length, cream lip, plate and fang), the T3 sword guard to match the target, and the T1 sword kept as is.

Screenshots: /workspace/share/gen-learn/ceo-1639-axe-handle-gap.jpg, ceo-1639-sword-v1-style.jpg
