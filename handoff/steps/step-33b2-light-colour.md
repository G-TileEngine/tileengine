# step-33b2-light-colour: effect lights, ramp colour and the te-flash@3 pop rule (renderer plan slice 33, part 33b-2; CEO renderer answers; CN-015)

Step id: step-33b2-light-colour          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`88c9061a`** (main after PR #44, the step 33b-1 merge; tree `4c03ddad`; verified 640/0). Branch: `step/step-33b2-light-colour-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`.
The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-33b2-light-colour-r<N>.bundle <Base>..step/step-33b2-light-colour-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33b2-light-colour/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 prefix in it.
Depends on: step 33b-1, merged `88c9061a` (`world-scene.ts` `createSceneLink`, `applyFeel`, `SceneLink.shake`; `fx-live.ts` `warp` of the effect clock); step 33h (`fx-live.ts` `createFxLive`, `LiveFx`, `LiveGrid`, `LiveOut`); step 33a (`fx-player.ts` `FxPiece`, `placeStep`, `ownLight`); step 33i (`ShoreStyle.ramps`, the host's resolved ramps); step 32 (`Canvas2D.lights`, the light canvases); step 31 (`light.ts` `createLighting`, `lightOps`, `createMoonlit`, the hybrid torch dim). Formats: **CN-015** (`2c9dd25c…`, ACCEPTED, on main since PR #44): `light_mode` (and the reader alias `light`), `light_radius`, `light_ramp`, `tint_ramp`, `tint_snap`, `hit_white_mode: "bright"`; the te-flash@3 pop rule; `keepInDim`, `fullyDark`, `Light.colour`, the light budgets and the `clip_cues` suppression are runtime only. **No new CN; no import line moves.**
Read first: BUILD_GUIDE.md §3 (runtime import lines), §7, law 13; `handoff/change-notices/CN-015-effects-feel-format.md` (`2c9dd25c…`; Fields, Detector, "Not in the format"); `data/setup-format.md` r25 §2.10.3.2–2.10.3.3 (field rows, ramp resolution, detector, reader alias); `ux/effects-sprite-sync.md` (`4e72b97e…`) §3 "Recommendation" 1–5 and 7, §4 "Recommendation" 1, §10 answers 3, 5, 6; `/workspace/scratch-ea/s33b-split-proposal.md` (`f56060dc…`; the 33b-2 row, CEO-approved 2026-11-14); `/workspace/scratch-ea/integration-seams.md` seams 18–23 (`7e555ef7…`); step-31 Rulings on the torch dim; QA's r2 review `docs/qa/step-33b2-review.md` (`14036a9e…`).
Kit: kit-1 r5 (guide-3), 2026-11-14: r5 follows QA's r4 NOT OK (review addendum `dc5b85d2…`: M-A depth, M-B G1, M-C budget flake) and the user's r5 rulings (M-A accepted: QA's qfix `e233d202` fast-forwarded; M-B G6 for `fx-light-qa-r4.test.ts`; M-C option (a): the 4 ms p95 runs alone in a perf script). Earlier: r3 followed QA's r2 NOT OK (`docs/qa/step-33b2-review.md` `14036a9e…`: M-1 test-only, M-2 perf) and the user's r3 rulings (M-2(b) self-lit pass, budget, O-1, notes O-2/O-4/D-1); r4 added the user's self-lit depth ruling (Ruling 8, seam 23). Engine Architect. Prototyped on Node 24.22.1: branch `r33b2` r5 = **`7b56a7b2f5cdb26557bd8de3d5a41908e8f17687`** (tree `fa7aaf27`). History on `88c9061a`: r1 `830c646e` → r2 `86a087e2` → QA's qfix applied with `git am` from `s33b2-qfix-r2.patch` (`063af01c…`, checked): `4b455a8` (QA test) and `3a8ebed` (the `light.ts` box loop; tree `46491c9d`, the same as QA's `fb34222b`) → EA r3 `d6164e59` (tree `d998dff8`) → EA r4 `404ecb04` (tree `6ee32767`) → QA's r4 qfix `e233d202` (tree `15faa9d0`, fetched from `refs/cmp/s33b2-qfix-r4` and fast-forwarded, so the sha is QA's; its `format-patch` is byte-identical to `s33b2-qfix-r4.patch` `a66d74ab…`) → EA r5 `7b56a7b2`. `npm ci && npm run green` exits 0 with `tests 657 pass 657 fail 0 cancelled 0 skipped 0 todo 0` (640 + 10 EA + 4 QA + 3 QA r4); `npm test` passed 5 parallel runs and 3 serial runs (`--test-concurrency=1`), all 657/0; `tsc` 0; lint, deps, check:state and check:law pass; the four fence tests pass unchanged. Sims unchanged (stage-fixed 48/2 `afc89d56…`, stage-weighted 22/28 `b8007292…`); the 21 smoke lines are byte-identical to the Base, heap line included. Plants: EA `/workspace/scratch-ea/s33b2-plants-r5.py` **95/95 caught, all 95 catching tests fail on the Base**; QA's original runner (`/workspace/scratch-ea/s33b2-qa/qa-plants-33b2-r4.py`, `3eaafe32…`) **25/27** (A21 and A27 missed, outside the rules, as in r2); QA's 20 new r4 plants (`qa-plants-33b2-r4-new.py`, `7e6cbc2a…`) **20/20**. Full test titles. Bundle copy: `/workspace/scratch-ea/r33b2-r5.bundle` (`88c9061a..r33b2`, verified); patch `/workspace/scratch-ea/s33b2-backup/r5.patch`. Kit sha list (with both shas): `/workspace/scratch-ea/kit-backup-r33b2/r5-kit-sha256.txt`.
Carries: **no new CN.** No core-types change (`61fad786…`); `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) unchanged.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist (`docs/qa/handback-checklist.md`) before hand-back (see BUILD_GUIDE).

## Goal
After this step an effect can light the world. A lit step adds a steady or pop light at its piece, coloured from its palette ramp; the effect's own light keeps its size in the stage dim while torches halve. Self-lit effect pieces draw at full colour above the night darkness, wherever they are on that frame. The light set is re-planned at most 10 times a second, and the light canvases are rebuilt only when it really changes; every cell glows in stepped bands in its brightest light's colour, and the HUD is never darkened. The render core also gains the ramp rules the colour features need (`tint_snap`, `bright`, the `clip_cues` suppression) and te-flash@3's one added rule: a big enough pop is a flash start (and, under reduce flashes, plays as steady).

## Rulings
All rulings are EA (this kit) on the CEO's renderer answers, CN-015 and the user's 33b-2 rulings (2026-11-14) unless a source is named. Every one is pinned.
1. **Ramps come resolved from the host** (EA ruling, CN-015 `2c9dd25c`; like shore colours): the runtime reads `world.style.ramps` (`ShoreStyle.ramps`, key → hex steps, dark → light, lightest last) and never reads `paintStyleDefault` or palette files.
   - `rampOf(keys, ramps)`: the first key the host's ramps have wins. A key it lacks is reported and **plays as absent** (the next key is tried).
   - **The light colour** is the lightest step of `light_ramp`, else the step's `tint_ramp`, else the effect's `tint_ramp`; else `"#ffb048"` (the `lightSource` default).
   - A missing key warns **`fxRampMissing`** with the effect id as the message, so the link's deduped notices give it once per effect.
   - Pinned by: "ramp colour: …(step 33b-2)" and "live effect lights: …(step 33b-2)".
2. **`tint_snap`** (CN-015; rule N): `snapToRamp(hex, step, fxRamp, ramps)`. `"rgb"` or absent keeps the colour (today). `"ramp"` snaps it to the nearest step (RGB distance) of the step's `tint_ramp`, else the effect's, else of every ramp the host passed (the style palette).
   - **Basic uses ramp colours only and Advanced allows any colour** (CEO): that's the editor's choice of what to write; the runtime plays both.
   - The runtime has no tint painter yet, so the rule is exported for it. No render export is named like a tint mode: step 31's "no tint mode" pin holds (see Ruling 9).
   - Pinned by: "ramp colour: …".
3. **`hit_white_mode: "bright"` and the `clip_cues` suppression** (CN-015; UX §5 rec. 6): `hitWhiteMode` reads `white | tint | black | bright`, anything else is `"white"`. `brightPixels(img, ramps)` moves each opaque pixel 2 steps up its own ramp (clamped at the lightest); a pixel on no ramp draws white; alpha is kept and the source is never changed. `cuesSuppressed(hit_white_ms)` is true for a number > 0.
   - The runtime has no hit-white recolour and no `clip_cues` player yet (neither was built in 33a, 33h or 33b-1), so these ship as rules. **The recolour (about 40 lines) is 33b-3** (user ruling on r1 Q1; seam 19).
   - Pinned by: "ramp colour: …".
4. **Light mode, radius and the pop** (CN-015; UX §3 rec. 1):
   - `lightMode(step)`: `light_mode` wins; the draft `light` is a reader alias; anything else is `"off"`.
   - `lightRadius(stored)`: tiles 0.5–6 on half-tile steps, absent 2. Out of range is clamped and flagged (`outOfRange` with message `light_radius`); not a number plays as 2, flagged.
   - `litTiles`: a **pop** steps R → ⌈R·⅔⌉ → ⌈R·⅓⌉ in whole half-tiles over the thirds of its step, then 0. A **steady** light holds R over the step. Off is 0.
   - Pinned by: "light rules: …(step 33b-2)".
5. **Live effect lights** (UX §3 rec. 1, 2, 7; EA §10 answer 3):
   - Each lit step lights the **centre of its placed piece** (art px; unit-layer pieces use the draw list's position: foot, the unit's `dx`/`dy`, `ox`/`oy`, anchor), radius = tiles × `tileW`, colour from Ruling 1, and **`keepInDim: true`** (the effect usually causes the dim, so its own light doesn't halve).
   - The light follows the effect's draw time, so **a pop freezes during hit-stop** with the effect.
   - **Hold state comes from the scene link, never `LiveOut.holds`** (user ruling; seam 18): the piece is placed from `unitOf`, which the scene link answers with the held and late poses. Nothing here reads `LiveOut.holds`.
   - **Caps:** at most **2 lit steps per effect** in step order (counted whether or not the piece is on screen); the 3rd and later draw no light and warn **`fxLightsOverCap`** (message: the effect id; once per effect). At most **4 effect lights** in total (effect order). **Lite:** one light per effect, and a pop plays as steady.
   - The scene link exposes the set as **`SceneLink.lit`** (`FxLit = { lights }`); empty with no clock.
   - Pinned by: "live effect lights: …" and QA's "a unit-layer piece's light sits at the centre of …" and "the 10 Hz gate lets a change through at once …".
6. **At most 10 light re-plans a second** (UX §3 rec. 7; EA §10 answer 3): fx-live keeps **one** light set (which lights, their radius and colour). A changed set replaces it only when 100 ms have passed since the last change (at exactly 100 ms, or at once when time went back); until then the old set (same object) stays, and `LiveOut.dueMs` asks for a frame when the gate opens. An unchanged set is never re-issued, so `createLighting` keeps its cached plan and `Canvas2D.lights` keeps its canvases. A pop re-plans at most 5 times over its life (0, R, ⌈⅔R⌉, ⌈⅓R⌉, 0). With no effect light, every frame shares one empty set. Self-lit pieces moving never touch the light set.
   - Pinned by: "re-plans: …(step 33b-2)", "self-lit pass: …(step 33b-2)" and QA's gate test.
7. **The light plan** (`createLighting().plan(world, lights, wash, dim, res, fx?, allDark?)`; CEO: torches keep a half-size glow during stage dim, with a per-ability fully-dark option):
   - Torches (the host's `lights`) halve in the dim as in step 31; `fullyDark` torches go out. **`keepInDim` lights keep their full radius.**
   - **`allDark`** is the ability's fully-dark option: during the dim, every light without `keepInDim` goes out. It does nothing outside the dim (Ruling 13).
   - The plan is cached on the world, torches, wash, dim, res, `fx` and `allDark` (one entry; identity for the arrays). Each light walks only the plan cells in its own box (QA's M-2 part 1; the same plan, so a 128×128 map at res 4 plans in about 1 ms).
   - **Colour:** each cell glows in its brightest light's colour (`LightPlan.tint` indexes `LightPlan.colours`, `"r,g,b"`; a repeated colour keeps its first index; host torches' colours count); cells lit only by uncoloured lights keep the step 31 warm glow. `lightOps` and `Canvas2D.lights` both read it.
   - **Stepped pixel glow, not a soft blur** (CEO): the glow stays step 31's 3 bands at art-res cells (alpha 2/32, 4/32, 6/32), in `lightOps` and on the canvas; there's no blur or soft falloff.
   - With no effect lights the plan has exactly step 31's shape (`res, w, h, dark, level`).
   - Pinned by: "light plan: …(step 33b-2)" and QA's "the darkness draws once …" and "each cell takes its own brightest light's colour …".
8. **`lit: self` pieces draw in their own pass above the night darkness** (CN-014 rule 1; UX §9 band 8; user ruling M-2(b), replacing r2's cut-outs):
   - fx-live marks every placed piece with `ownLight` (`lit` absent or anything but `"scene"`): an overlay gets `selfLit: true`; a unit-layer piece (`kind` `fxFront`/`fxBehind`) is self-lit unless it carries `sceneLit: true` (the flag is on the `lit: "scene"` ones because 33h's shipped test pins the exact shape of self-lit fx standing). The draw list copies it to `DrawCmd.selfLit` only for pieces drawn over units (Depth, below). Units and objects are never self-lit.
   - **At night** (`present` given an `after`): every command draws in order except the self-lit ones; just before the first `ui` command (or last) `present` runs `after` (the darkness and glow), then draws the self-lit commands in list order, then the `ui` band. So a moving self-lit piece is at full colour where it's drawn on every frame, and the spot it left is dark.
   - **Depth (user ruling, r4; seam 23):** a piece must never draw over a unit it should sit behind. Only self-lit pieces drawn over units take the night pass: overlays in `fxAir`, `glow` and `flash`, and `fxFront` standing that isn't face-swapped. Self-lit `fxBehind`, face-swapped `fxFront` and `fxGround` pieces keep their normal depth slot at night and are lit only by the light map. **Overlap (QA r4 M-A, user ruling r5):** after the standing loop, a self-lit standing command that a later non-self-lit standing command (a unit, an object or a scene-lit piece) overlaps loses `selfLit`, so it keeps its depth slot (the covered pixel is the darkened unit, `ff000000` in QA's probe, not the spark). A self-lit piece covered only by another self-lit piece stays in the pass (both draw in list order). Canopy tiles (`above`) are not checked (O-5, seam 23). fx-live still marks them (`ownLight`); the draw list decides (`DrawCmd.selfLit`), from the band and the standing rank. A depth-aware full-colour pass for them is seam 23 (group diagnosis).
   - **By day** (no `after`): nothing moves; the list draws in order as before. raf-driver passes `after` only when the view has lights.
   - **Nothing is cut out of the darkness**, so the plan and the light canvases never change because a piece moved (QA M-2: no full-map canvas rebuild while pieces move).
   - Pinned by: "self-lit pass: …(step 33b-2)", "self-lit depth at night: …(step 33b-2, seam 23)", QA's "QA 33b-2 r4: a self-lit fxFront piece that a unit one row in front covers …" and "QA 33b-2 r4: at night the self-lit pass draws right after the darkness …", "live effect lights: …", "the HUD never darkens: …" and "budget: …".
9. **Moonlit is a colour swap plus the night layer, with no tint mode** (CEO; unchanged): `createMoonlit` and step 31's pin "moonlit swaps in the paired night sheets, keeps the scene stable, and has no tint mode (step 31)" are untouched; the new exports avoid the word "tint". Moonlit still swaps self-lit effect pieces to their night sheets (user ruling on r1 Q3: accepted for 33b-2; keeping their day sheet is seam 20, for the group diagnosis).
10. **te-flash@3: the pop-light rule only** (user ruling, option A; H2 is merged): `popIsFlash(tiles, tilePx)` is π(R·T)² / (390 × 844) ≥ 25%; `popFlashStarts(steps, tilePx, startMs)` lists the pop steps that count, at their pops. Steady lights never count. The @1/@2 detector stays where it is; whoever owns @2 adds this rule.
    - **D-1:** the exact threshold at 64 px is R ≈ 2.53 tiles (2.5 tiles is 24.4%), so **3 tiles is the first allowed half-tile step that counts**. CN-015 and setup-format §2.10.3.2 say "≈ 2.5 tiles at 64 px"; DSK may want "3 tiles and up at 64 px (threshold ≈ 2.53)" (non-blocking, DSK's docs).
    - Pinned by: "te-flash@3 pop rule: …(step 33b-2)".
11. **The 4 ms p95 budget** (EA §10 answer 3; user rulings on QA M-2 and, r5, M-C option (a)): a 128×128 map at 16 px tiles, res 4 (512×512 plan cells), 16 torches, 80 units and 40 looping effects, each with a steady lamp on its caster (4 lights after the cap) and a self-lit piece following its target, which moves every frame. Each frame runs `link.scene`, `plan`, `buildDrawList` and `present` with `Canvas2D.lights` on a counting canvas (no-op 2D context that counts fills).
    - The rig lives in `tests/perf/fx-light-budget.ts` (outside the `npm test` glob `tests/**/*.test.ts`, still type-checked and linted; no pin changes): `budgetRig()` (one frame = scene, plan, draw list, present and the light canvases), `judge(laps)` and `PERF = { limitMs: 4, laps: 3, lapMs: 3000, frameMs: 16 }`.
    - **In `npm test` (no wall clock):** the rig runs 3 s and must give **1 plan, 1 light-canvas build, 0 light fills after the first frame and 4 lights** (no rebuild while only self-lit pieces move; bounded); `judge` is checked on fixed laps (every lap's p95 = sorted[floor(0.95 n)] ≤ 4 ms, exactly 4 passes, no laps fails) and `PERF` is pinned.
    - **Alone (QA runs it by itself, never inside the suite):** `node tests/perf/fx-light-budget.ts` runs three 3 s laps and exits non-zero unless **every lap's p95 ≤ 4 ms** and the counts are 1/1/0/4; it prints p50/p95/max per lap. r5 measures (3 runs alone): p50 0.28–0.62 ms, p95 0.51–1.31 ms, max ≤ 2.43 ms. Under the parallel suite the old in-suite timing failed 1 run in 5–20 (QA M-C); that's why it moved.
    - Pinned by: "budget: …(step 33b-2)".
12. **The HUD never darkens** (user ruling on r1 Q2; like the HUD never shaking in 33b-1): `present` runs `after` once, just before the first `ui` command, or after every command when there is none. Every world band stays under the darkness (except the self-lit pass, Ruling 8); the `ui` band sits on top. Seam 1 is closed for the HUD.
    - Pinned by: "the HUD never darkens: …(step 33b-2)" and QA's "the darkness draws once, before the first ui command …".
13. **`allDark` is passed by the host on each `plan` call, and nothing is stored** (user ruling on r1 Q5; CN-015 "runtime only").
14. **Reduce flashes: a flash-sized pop plays as steady** (user ruling on QA O-1): with reduce flashes on (`SceneClock.reduceFlashes`, `LiveGrid.flashes`), a pop step that te-flash@3 counts (`popIsFlash(R, FX_LIGHT.flashTilePx)`, 64 px, the detector's reference tile) plays as a steady light of radius R; a smaller pop still pops. Hit-stop under reduce flashes is unchanged (33b-1).
    - Pinned by: "te-flash@3 pop rule: …(step 33b-2)".
15. **Notes for hosts and later steps** (user ruling, r3):
    - **Known behaviour, O-6 (QA r4):** a steady light shorter than its effect's loop turns off and on once per loop; each change legitimately re-plans and rebuilds the light canvases, at most 10 Hz (the gate). The budget assumes a steady light spanning its loop.
    - **O-4:** hosts pass a **stable torch array** (the plan cache keys on its identity; a new array each frame re-plans each frame, step 31's cache). **More than 255 distinct light colours is out of range** (`LightPlan.tint` is a `Uint8Array`; the 256th colour wraps).
    - **O-2:** the gate's due time (`LiveOut.dueMs`, including a held light change) is not exposed to the host yet (`SceneLink` has no due time since 33h); it works today because raf-driver calls `view()` every rAF. That is **seam 22**.

## Files to create or change
- create `src/runtime/render/fx-light.ts` (≤ 59; the pure light and ramp rules: `FX_LIGHT`, `lightMode`, `lightRadius`, `litTiles`, `rampOf`, `lightColour`, `snapToRamp`, `hitWhiteMode`, `cuesSuppressed`, `brightPixels`, `popIsFlash`, `popFlashStarts`)
- create `tests/runtime/scene/fx-light.test.ts` (≤ 133; the shipped EA test, verbatim)
- create `tests/runtime/scene/fx-light-qa.test.ts` (≤ 53, G6 granted; the shipped QA test, verbatim)
- create `tests/runtime/scene/fx-light-qa-r4.test.ts` (≤ 37, G6 granted r5; QA's r4 test, verbatim)
- create `tests/perf/fx-light-budget.ts` (≤ 38; the shipped budget rig and serial perf script, verbatim)
- change `src/runtime/render/fx-live.ts` (≤ 100; lit steps, caps, the 10 Hz light gate, the self-lit marks, reduce-flashes pops, `LiveOut.lit`, `LiveGrid.ramps`, `LiveFx.tint_ramp`)
- change `src/runtime/render/light.ts` (≤ 88; `Light.colour` / `keepInDim`, `FxLit`, `plan(…, fx, allDark)`, the per-light box walk, per-cell colour in the plan and `lightOps`)
- change `src/runtime/render/dirty.ts` (≤ 25; `present` draws `after` and then the self-lit pass under the `ui` band)
- change `src/runtime/render/draw-list.ts` (≤ 74; copies the self-lit mark to `DrawCmd.selfLit` only for pieces drawn over units: `fxAir`, `glow`, `flash` overlays and unswapped `fxFront` standing that no later non-self-lit standing command overlaps)
- change `src/runtime/render/types.ts` (≤ 38; `Standing.sceneLit`, `Overlay.selfLit`, `DrawCmd.selfLit`)
- change `src/runtime/host/raf-driver.ts` (≤ 93; passes `after` only when the view has lights)
- change `src/runtime/render/fx-player.ts` (≤ 110; `FxPiece` light and ramp fields only)
- change `src/runtime/render/index.ts` (≤ 22; exports)
- change `src/runtime/scene/world-scene.ts` (≤ 126; ramps into the grid, `SceneLink.lit`)
- change `src/runtime/canvas/canvas2d.ts` (≤ 154; the glow canvas reads the cell colour)

Size: 150–400 changed lines normally; 400–500 with a stated reason. The proto changes **417** lines (+370/−47) in 15 files. Reason for the 17 over 400: QA's r4 qfix brings 36 (M-A, M-B) and M-C's serial perf script has to carry its own 34-line rig outside the suite (the suite file shrank by 8).

| File | Base → proto / cap | Changes |
|---|---|---|
| `src/runtime/render/fx-light.ts` | 0 → 55/59 | +55 |
| `src/runtime/render/fx-live.ts` | 81 → 96/100 | +24/−9 |
| `src/runtime/render/light.ts` | 80 → 84/88 | +19/−15 |
| `src/runtime/render/dirty.ts` | 18 → 21/25 | +6/−3 |
| `src/runtime/render/draw-list.ts` | 69 → 70/74 | +6/−5 |
| `src/runtime/render/types.ts` | 34 → 34/38 | +3/−3 |
| `src/runtime/host/raf-driver.ts` | 89 → 89/93 | +1/−1 |
| `src/runtime/render/fx-player.ts` | 106 → 106/110 | +1/−1 |
| `src/runtime/render/index.ts` | 17 → 18/22 | +2/−1 |
| `src/runtime/scene/world-scene.ts` | 122 → 122/126 | +8/−8 |
| `src/runtime/canvas/canvas2d.ts` | 150 → 150/154 | +1/−1 |
| `tests/runtime/scene/fx-light.test.ts` | 0 → 129/133 | +129 |
| `tests/runtime/scene/fx-light-qa.test.ts` | 0 → 48/53 (G6) | +48 |
| `tests/runtime/scene/fx-light-qa-r4.test.ts` | 0 → 33/37 (G6) | +33 |
| `tests/perf/fx-light-budget.ts` | 0 → 34/38 | +34 |

## Interfaces to match (quoted exactly)
```ts
// render/fx-light.ts
export const FX_LIGHT = { radiusMin: 0.5, radiusMax: 6, radiusDefault: 2, perEffect: 2, onScreen: 4, replanMs: 100, flashShare: 0.25, flashTilePx: 64, screenW: 390, screenH: 844, colour: "#ffb048" } as const;
export type Ramps = Readonly<Record<string, readonly string[]>>;
export type LightMode = "off" | "steady" | "pop";
export type HitWhiteMode = "white" | "tint" | "black" | "bright";
export type LitStep = { readonly at: number; readonly ms?: number; readonly light_mode?: string; readonly light?: string; readonly light_radius?: unknown; readonly light_ramp?: string; readonly tint_ramp?: string; readonly tint_snap?: string };
export const lightMode: (step: LitStep) => LightMode;
export function lightRadius(stored: unknown): { tiles: number; bad: boolean };
export const litTiles: (mode: LightMode, tiles: number, tMs: number, at: number, ms: number) => number;
export function rampOf(keys: readonly (string | undefined)[], ramps: Ramps | undefined): { ramp: readonly string[] | null; missing: string[] };
export const lightColour: (step: LitStep, fxRamp: string | undefined, ramps: Ramps | undefined) => { colour: string; missing: string[] };
export function snapToRamp(hex: string, step: LitStep, fxRamp: string | undefined, ramps: Ramps | undefined): string;
export const hitWhiteMode: (stored: unknown) => HitWhiteMode;
export const cuesSuppressed: (hitWhiteMs: unknown) => boolean;
export function brightPixels(img: Pixels, ramps: Ramps | undefined): Pixels;
export const popIsFlash: (tiles: number, tilePx: number) => boolean;
export const popFlashStarts: (steps: readonly LitStep[], tilePx: number, startMs?: number) => number[];
// render/light.ts
export type Light = { readonly x: number; readonly y: number; readonly radius: number; readonly fullyDark?: boolean; readonly colour?: string; readonly keepInDim?: boolean };
export type FxLit = { readonly lights: readonly Light[] };
export type LightPlan = { readonly res: number; readonly w: number; readonly h: number; readonly dark: Uint8Array; readonly level: Uint8Array; readonly tint?: Uint8Array; readonly colours?: readonly string[] };
export function createLighting(): { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number, fx?: FxLit, allDark?: boolean): LightPlan; readonly stats: { plans: number; masks: { computed: number } } };
// render/types.ts — Standing gains: readonly sceneLit?: boolean; Overlay gains: readonly selfLit?: boolean; DrawCmd gains: readonly selfLit?: boolean
// render/fx-player.ts — FxPiece gains: light_mode?, light?, light_radius?: unknown, light_ramp?, tint_ramp?, tint_snap? (strings unless noted)
// render/fx-live.ts — LiveFx gains: readonly tint_ramp?: string; LiveGrid gains: readonly ramps?: Ramps; LiveOut gains: readonly lit: FxLit
// scene/world-scene.ts — SceneLink gains: readonly lit: FxLit
// render/dirty.ts — present(renderer, fit, list, clear, after?) keeps its signature; with `after`, self-lit commands are held back and drawn right after it, before the first ui command (or last)
```
Nothing comes from `src/types/core-types.ts` (the effect unions and `te-flash@3` in core-types are still CN-only candidates). The game maps the effect step's stored fields onto `FxPiece` under the same names, the effect's `tint_ramp` onto `LiveFx`, the resolved ramps onto `world.style.ramps`, and passes `link.lit` as `plan(…, fx)` with the dimming ability's fully-dark choice as `allDark` and a stable torch array.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) are identical, and the 21 smoke lines are byte-identical to the Base, heap line included (the heap delta is measurement noise if it moves).

## Existing tests changed by ruling (and only these)
None. (33h's `host-hookup.test.ts` pins the exact shape of self-lit fx standing; that is why unit-layer pieces carry `sceneLit` on the scene-lit ones instead of `selfLit` on the self-lit ones.)

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-33b2-light-colour/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/fx-light.test.ts` | `tests/runtime/scene/fx-light.test.ts` | `b676249220b6ed40cb6469bf4a4869c35b6813fde4a28bd94fe118b8b639b6ba` |
| `tests/runtime/scene/fx-light-qa.test.ts` (QA, G6) | `tests/runtime/scene/fx-light-qa.test.ts` | `ec38825f89cd07783b80b8cd63c47d28e0c5fd1265183d098a3f95c87d7cc52b` |
| `tests/runtime/scene/fx-light-qa-r4.test.ts` (QA r4, G6) | `tests/runtime/scene/fx-light-qa-r4.test.ts` | `5d2deb03de479afa935e45ab874d02d87f32eee97ccdee20c8f2b65903d9bba3` |
| `tests/perf/fx-light-budget.ts` (rig + perf script) | `tests/perf/fx-light-budget.ts` | `dca2f6d81266eebe1db7132edafb6898aa32437b887c6b8bc2798a0516f8f1d6` |

`fx-light-qa.test.ts` is QA's qfix file (`77932447…`, 49 lines) with three changes the M-2(b) ruling forces (6 lines in, 7 out): the colour test drops `holes: []` and its cut-out rounding assertion (there are no cut-outs), and the unit-layer test checks the light centre and the draw list's `selfLit` instead of a cut-out box (one fresh `createFxLive` per `dx`, since the light set is gated). The HUD, glow, colour, gate and cap assertions are QA's, unchanged. `fx-light-qa-r4.test.ts` is QA's r4 qfix file byte for byte (`5d2deb03…`, 33 lines; no edit was needed).

Titles (exact), EA file:
- "ramp colour: the step's ramp beats the effect's, a missing key is reported (fxRampMissing) and plays as absent, the light is the ramp's lightest step else #ffb048; tint_snap ramp snaps to the nearest step (every ramp with no tint_ramp), rgb or absent keeps the colour; bright moves 2 steps up its own ramp, off-ramp pixels go white; no render export is a tint mode (step 33b-2)"
- "light rules: light_mode off/steady/pop (the draft light is an alias, light_mode wins), light_radius 0.5-6 tiles on half steps (absent 2, clamped and flagged); a pop steps R, ceil(2R/3), ceil(R/3) in half tiles over thirds of its step, then 0; steady holds R (step 33b-2)"
- "live effect lights: a lit step lights its piece's centre (tiles x tileW, the lightest ramp step, keepInDim), the pop freezes in hit-stop, self-lit pieces are marked for the pass above the darkness and lit scene pieces aren't; 2 lit steps per effect (fxLightsOverCap), 4 on screen, lite gives one steady light; a missing ramp warns once (step 33b-2)": the set at 1020; radii over the pop; hit-stop; the self-lit marks on an overlay and a unit-layer piece and none on `lit: "scene"` ones; a unit-layer light at (88, 28); a clockless call; the caps and notices; lite; `fxRampMissing` and `outOfRange`.
- "re-plans: the light set is re-planned at most every 100 ms (10 Hz) and a pop re-plans at most 5 times over its life (0, R, 2R/3, R/3, 0); no effect leaves one shared empty set (step 33b-2)": the held change at 1110, exactly 5 plans, the gate opening at exactly 1120, the shared empty set, `dueMs` 1120.
- "light plan: effect lights keep their radius in the stage dim while torches halve, the ability's fully-dark option puts out torches only, each cell glows in its brightest light's colour in stepped bands (never a blur), and with no effect light the plan is unchanged (step 33b-2)"
- "te-flash@3 pop rule: a pop step is one flash start at its pop when pi(R*T)^2/(390*844) >= 25% (3 tiles at 64 px, not 2.5); steady lights never count; under reduce flashes a pop that counts plays as steady (step 33b-2)": thresholds, `popFlashStarts`, a 3-tile pop at 1140 and 1260 holding 48 px under reduce flashes (32/16 without), a 2.5-tile pop still popping.
- "budget: on a 128x128 map at res 4 with 16 torches and 40 effects whose self-lit pieces move every frame, moving pieces never re-plan or rebuild the light canvases and the lights stay capped at 4; the 4 ms p95 is judged on every lap, run alone (tests/perf/fx-light-budget.ts, never in npm test) (step 33b-2)": the rig's counts 1/1/0/4 over 3 s; `judge` on fixed laps; `PERF` pinned.
- "self-lit pass: a moving self-lit piece draws at full colour above the night darkness where it's drawn on every frame, the spot it left is dark, the light set keeps its 10 Hz gate, and moving pieces never re-plan or rebuild the light canvases (step 33b-2)": a lamp on the caster and a self-lit piece following a target over 4 frames on `canvas2d`; each frame 4 draws (each piece once, darkness, glow), only the 2 effect pieces self-lit, the piece's pixel at full colour, the old spot dark, the light at x 40, 1 plan, 1 canvas build.
- "the HUD never darkens: the night darkness is drawn under the ui band, so a ui pixel is the same at night as by day and the world under it is dark; by day nothing moves (step 33b-2)": a ui pixel day and night; the darkness with no ui command; by day a self-lit command stays under a later command.
- "self-lit depth at night: a self-lit fxBehind, fxGround or face-swapped fxFront piece under a unit keeps its depth slot and never draws over the unit's pixels, while self-lit fxFront pieces, even overlapping each other, still draw at full colour above the darkness (step 33b-2, seam 23)": on `canvas2d` at night, an `fxBehind`, an `fxGround` and a face-swapped `fxFront` piece under a unit facing N, and two overlapping `fxFront` pieces on the caster; all marked by fx-live, only the 2 caster ones `DrawCmd.selfLit`; the unit's pixel is the same with or without the 3 pieces under it, and the front piece is at full colour.

Titles (exact), QA files (`fx-light-qa.test.ts`, then `fx-light-qa-r4.test.ts`):
- "QA 33b-2: the darkness draws once, before the first ui command, so every HUD command stays as bright as by day; the canvas glow has only the 3 top bands"
- "QA 33b-2: each cell takes its own brightest light's colour (a repeated colour keeps its index, host torches' colours count)"
- "QA 33b-2: the 10 Hz gate lets a change through at once when time goes back; the 3rd lit step in step order never lights, even when it plays alone"
- "QA 33b-2: a unit-layer piece's light sits at the centre of where the draw list draws it (self-lit), with the unit's dx and the anchor point's ox"
- "QA 33b-2 r4: at night the self-lit pass draws right after the darkness, in list order, and before every ui command"
- "QA 33b-2 r4: a self-lit fxFront piece that a unit one row in front covers keeps its depth slot at night, as do an uncovered fxBehind or face-swapped piece; an uncovered fxFront piece takes the pass"
- "QA 33b-2 r4: raf-driver passes no after when the view has no lights, so by day a self-lit piece stays under a later command"
(You may add tests. The hand-back lists all four shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s33b2-plants-r5.py <clone> <base clone>` (result `s33b2-plants-r5-result.txt`) runs 95 plants against the three shipped test files (the perf file is imported), matching **full test titles** (the runner's line loses only its trailing duration, never text at " ("):
- C1–C30: colour, light rules and te-flash@3, as in r2 (V5 and V10 re-aimed at the reduce-flashes line).
- L1–L5 and L8–L14, the plan: effect lights ignored or halving, the dark option ignored, acting outside the dim or on effect lights, the cache ignoring the effect set or the option, no per-cell colour, the plan shape changed, `lightOps` and the canvas ignoring the colour, a soft glow. (r2's L6, L7 and L15 targeted the cut-out pass, which is gone.)
- V1–V20, live: as in r2, with V11 (a `lit: "scene"` unit-layer piece drawn above the darkness), V12 (a self-lit overlay not marked) and V20 re-aimed.
- W1–W3, the link.
- Q2a–Q2c, the HUD.
- S1–S9, the self-lit pass: never drawn at night, drawn twice, drawn before the darkness, moved by day, the draw list dropping the mark, overlays never marked, unit-layer pieces never marked, units marked, moving pieces changing the light set.
- F1–F3, reduce flashes: ignored, every pop steady, the art tile used instead of 64 px.
- D1–D4, self-lit depth (r4): an `fxBehind`, `fxGround` or face-swapped `fxFront` piece taking the night pass, and no `fxFront` piece taking it. S6–S8 search the r4 draw-list lines. Since the overlap rule, D1 and D3 are caught by QA's r4 depth test (its lone pieces); the pieces under the unit in EA's depth test are covered anyway.
- O1–O3, the overlap rule (r5): removed, looking at earlier commands, a later self-lit piece also demoting.
- P1–P7, the perf move (r5): the limit at 8 ms, the best lap instead of every lap, the median for p95, a p95 exactly at the limit failing, a run with no laps passing, the rig never drawing the light canvases, the rig counting the first frame's fills.
- B1, the light canvases rebuilt every frame.

Expected: **95/95 caught, and all 95 catching tests fail on the Base.** No equivalent plants.

QA's original plants (`/workspace/scratch-ea/s33b2-qa/qa-plants-33b2-r4.py` `3eaafe32…`, the r3 adaptation of QA's `6d3b6795…`, run with both QA files; result `qa-plants-r5-result.txt`): **25/27**, A21 and A27 missed as in r2 (outside the rules, as QA ruled), so all 25 rule plants are caught (A15 by step 32's light-canvas test). A12 and A13 (cut-out rounding) no longer apply since r3 and are replaced by A12r and A13r; A2 and A3 break the light anchor. QA's 20 new r4 plants (`qa-plants-33b2-r4-new.py` `7e6cbc2a…`, N1–N13 with N13 the overlap rule; result `qa-new-plants-r5-result.txt`): **20/20**.

## Example
A mage casts a bolt at a slime at 1000 ms at night (wash 0.5, a torch nearby). The bolt's step has `light_mode: "pop"`, `light_radius: 3`, `light_ramp: "bloom"`, and the ability dims the stage:
- From pose 1020 the bolt lights a 3-tile circle at its centre in the bloom ramp's lightest pink; at 1110 the change to 2 tiles waits for 1120 (10 Hz), then 1 tile from 1200, then none from 1300.
- The torch glows at half size in the dim (none if the ability is fully dark); the bolt's light keeps its 3 tiles.
- The bolt itself is drawn at full colour above the darkness on every frame, even while it flies (it's in `fxAir`; a self-lit aura behind the mage stays behind the mage, lit only by the light map); a `lit: "scene"` smoke piece next to it is darkened. The light canvases aren't rebuilt as the bolt moves.
- The HUD on top stays exactly as bright as by day.
- With hit-stop on the hit, the pop holds its size while everything is frozen.
- A 3-tile pop at 64 px counts as one te-flash@3 flash start; a 2.5-tile pop or any steady light doesn't. With reduce flashes on, the 3-tile pop plays as a steady 3-tile light; a 2.5-tile pop still pops.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 657 tests passing and none failing, in the normal parallel run and with `--test-concurrency=1`,, cancelled, skipped or todo.
- [ ] `tests/runtime/scene/fx-light.test.ts` is byte-identical to sha256 `b6762492…`, `fx-light-qa.test.ts` to `ec38825f…`, `fx-light-qa-r4.test.ts` to `5d2deb03…` and `tests/perf/fx-light-budget.ts` to `dca2f6d8…`; `node tests/perf/fx-light-budget.ts`, run alone, exits 0 (every lap's p95 ≤ 4 ms). These existing tests are unchanged and pass: `feel-shake.test.ts` (`e19576f4…`), `feel-shake-qa.test.ts` (`8e8f601a…`), `feel-shake-ab-qa.test.ts` (`7f77be9b…`), `motion-shore-live.test.ts` (`b8a05b0a…`), `motion-shore-live-qa.test.ts` (`74260aff…`), `host-hookup.test.ts` (33h), `tests/runtime/render/light.test.ts` (`e57e2ce8…`, step 31) and `tests/runtime/canvas/light-canvas.test.ts` (`6c42bf5b…`, step 32).
- [ ] Sims and every pin above unchanged; the smoke lines byte-identical (the heap delta excepted if it moves); the four fence tests unchanged and passing.
- [ ] Each file within its cap; 150–400 changed lines in total (up to 500 with a reason in the hand-back; the proto is 417, reason in the size table).
- [ ] No import line changes outside the fences. `fx-light.ts` imports only `./bakes.ts` (type). `fx-live.ts` adds only render-layer imports (`./camera.ts`, `./draw-list.ts`, `./fx-light.ts`, `./light.ts` type). `world-scene.ts` still imports only `../render/index.ts` and `../../core/notice.ts`. `dirty.ts` adds only the `DrawCmd` type from `./types.ts`. The imports of `canvas2d.ts`, `draw-list.ts`, `types.ts` and `raf-driver.ts` are unchanged.
- [ ] With no light or ramp fields, no `fx`, no `allDark` and no lights in the view, everything behaves as in 33b-1 (all earlier tests pass; the plan keeps step 31's shape; `present` with no `after` draws the list in order).
- [ ] Nothing reads `LiveOut.holds` (seam 18).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location above.

## Not in this step (carries, with their target step)
- **33b-3 (after DSK's particle CN):** particles (a pool of 96, soft cap 48 per effect), `pixel_scale`, `outline` (it will reuse `rampOf`), RotSprite with the 16 MB LRU, and the draw budgets.
- **33b-3 (user ruling on r1 Q1; seam 19):** the hit-white recolour itself (`hit_white_ms`, `hit_white_target`, all four modes, about 40 lines), with the `clip_cues` player and a tint painter that calls `snapToRamp`.
- **Seam 20 (group diagnosis; user ruling on r1 Q3):** self-lit effect pieces keeping their day sheet under moonlit.
- **Seam 21 (already logged):** effects following a unit track its tile but not its draw offset (33h).
- **Seam 22 (user ruling on QA O-2):** exposing the gate's due time (`LiveOut.dueMs`) through `SceneLink` to the host.
- **Seam 23 (user rulings r4, r5):** a depth-aware full-colour pass for self-lit pieces that keep their slot at night: `fxBehind`, `fxGround`, face-swapped `fxFront`, and `fxFront` pieces a later standing command covers (M-A); plus O-5, a self-lit piece under a canopy tile draws over the canopy at night (group diagnosis).
- **Seam 18 (group diagnosis):** `LiveOut.holds` is always `{}`; fill it from the scene link or drop it.
- **s34 (perf):** seams 14, 15 and 17 in `/workspace/scratch-ea/integration-seams.md`. (Seam 1's HUD part is fixed here, Ruling 12.)
- **The game side:** passing the step fields on `FxPiece`, the effect's `tint_ramp` on `LiveFx`, the resolved ramps on `world.style.ramps`, `link.lit` to `plan(…, fx)`, a stable torch array and the ability's fully-dark choice as `allDark`; @2's owner calls `popFlashStarts` for te-flash@3. Game rules stay out of the engine.

## Decisions note: what to name
Name these in the hand-back's Decisions note:
- The ramp convention (dark → light, lightest last, as the shore ramps) and that keys play as absent when missing.
- The light anchor (the placed piece's centre, art px, the draw list's position for unit-layer pieces).
- The 10 Hz gate: one light set kept, replaced at 100 ms or when time goes back, `dueMs` at the gate, one shared empty set.
- The self-lit pass: how pieces are marked (`Overlay.selfLit`, `Standing.sceneLit`, `DrawCmd.selfLit`) and where `present` draws them (after `after`, before the first `ui` command; never by day); which pieces take the pass (only those drawn over units and not covered by a later standing command; behind, ground, face-swapped and covered pieces keep their slot, seam 23).
- The budget split (M-C (a)): counts in `npm test`, the 4 ms p95 only in `node tests/perf/fx-light-budget.ts` run alone.
- Law 13 bounds: fx-live keeps one light set (no map); lights ≤ 4 per call; the plan cache is one entry; the canvas keeps one light-canvas pair; notices go through the link's ≤ 1024 deduped notices.
- Reserved words: no export named with "tint" (step 31's pin); no game words in the render files.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `feel.ts`; `needsDraw` in `dirty.ts`; the rest of `raf-driver.ts` (one line, `after`); `bakes.ts`; `canopy.ts`; `motion.ts`; `water.ts`; `world-motion.ts`; `src/core/**`; `src/fx/**`; the sim; every existing test file; plus BUILD_GUIDE §7's never-edit list.

## Out of scope
Game rules. Format changes. core-types changes (`HitWhiteMode` += `bright`, `FxLightMode`, `te-flash@3` stay CN-only). The @1/@2 detector code. Soft or blurred glow. A screen blend. Particles. The hit-white recolour (33b-3). Moonlit day sheets for self-lit pieces (seam 20). Cutting holes in the darkness. A depth-aware self-lit pass (seam 23). Repainting only changed light-canvas cells.

## Kit files to push
All under `/workspace/tileengine`, with their full sha256 in `/workspace/scratch-ea/kit-backup-r33b2/r5-kit-sha256.txt`:
- `handoff/steps/step-33b2-light-colour.md` (this file)
- `handoff/steps/tests/step-33b2-light-colour/tests/runtime/scene/fx-light.test.ts` (`b6762492…`)
- `handoff/steps/tests/step-33b2-light-colour/tests/runtime/scene/fx-light-qa.test.ts` (`ec38825f…`, QA's, adapted as above)
- `handoff/steps/tests/step-33b2-light-colour/tests/runtime/scene/fx-light-qa-r4.test.ts` (`5d2deb03…`, QA's r4, verbatim)
- `handoff/steps/tests/step-33b2-light-colour/tests/perf/fx-light-budget.ts` (`dca2f6d8…`)
- `handoff/README.md`, `docs/core-spine-slices.md`

## Open questions
None.

r1's five questions and QA's r2 points are ruled: Q1 33b-3 (seam 19); Q2 HUD above the darkness (Ruling 12); Q3 seam 20; Q4 superseded by M-2(b) (Ruling 8); Q5 Ruling 13; M-1 QA test (G6); M-2 Rulings 7, 8 and 11; O-1 Ruling 14; O-2 seam 22; O-3 kept (conservative, matches CN-015); O-4 and D-1 noted (Rulings 15 and 10); r3's depth question ruled in r4 (Ruling 8, seam 23); QA's r4 M-A, M-B and M-C ruled in r5 (Rulings 8 and 11, G6); O-5 seam 23; O-6 known behaviour (Ruling 15).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 657 passing and 0 failing** (`tests ≥657 pass ≥657 fail 0 cancelled 0 skipped 0 todo 0`). Paste the summary line into HANDBACK.md.
- All four shipped files are **byte-identical** to the sha256s above (`fx-light.test.ts` `b676249220b6ed40cb6469bf4a4869c35b6813fde4a28bd94fe118b8b639b6ba`, `fx-light-qa.test.ts` `ec38825f89cd07783b80b8cd63c47d28e0c5fd1265183d098a3f95c87d7cc52b`, `fx-light-qa-r4.test.ts` `5d2deb03de479afa935e45ab874d02d87f32eee97ccdee20c8f2b65903d9bba3`, `tests/perf/fx-light-budget.ts` `dca2f6d81266eebe1db7132edafb6898aa32437b887c6b8bc2798a0516f8f1d6`), and so is every existing test file named in Acceptance. List each sha256 in HANDBACK.md, and paste the output of `node tests/perf/fx-light-budget.ts` run alone.
- The bundle is `<Base 88c9061a>..step/step-33b2-light-colour-r<N>` and passes `git bundle verify`. Each file stays within its cap in the size table (proto count + 4; the QA files 53 and 37 under G6), and the total is 150–400 changed lines (up to 500 with a stated reason).
