# step-33b1-feel-shake: hit-stop, the victim shiver, squash and screen shake (renderer plan slice 33, part 33b-1; CEO 18:35 rulings; CN-015)

Step id: step-33b1-feel-shake          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`fa920c56`** (main after PR #43, the step 33i merge; tree `b2589922`; verified PASS 630/0). Branch: `step/step-33b1-feel-shake-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`.
The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-33b1-feel-shake-r<N>.bundle <Base>..step/step-33b1-feel-shake-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33b1-feel-shake/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 prefix in it.
Depends on: step 33i, merged `fa920c56` (`world-scene.ts` `createSceneLink`, `SceneClock.reduce`, `pixels`; `raf-driver.ts` `View.lights`; `present(…, after)`); step 33h (`fx-live.ts` `createFxLive`, `LiveFx`, `LiveGrid`); step 33a (`fx-player.ts` `hitAt`, `poseMs`, `nextChangeMs`, `FX_PLAYER`); step 31 (`Canvas2D.lights`); step 27 (`draw-list.ts`, `frames.ts` `frameAt`, `instanceOffset`, `hash32`). Formats: **CN-015** (`2c9dd25c…`, the ACCEPTED text DSK filed 2026-11-14 02:28 after the EA confirmed all 7 rulings, with DSK's 03:22 wording fix to ruling 5 (Low: 0 px stays 0); it replaces DSK's `2d63ecc5…`; main still has the pending text `01aaba1f…`; **this accepted text replaces `01aaba1f` on main and is pushed with this kit**, see "Kit files to push"): `shake`, `shake_ms`, `shake_dir`, `squash`, `screen_shake`; `hit_stop_ms` (setup-format effect knob, 0–150). **No new CN; no import line moves.**
Read first: BUILD_GUIDE.md §3 (runtime import lines), §7, law 13; `handoff/change-notices/CN-015-effects-feel-format.md` (`2c9dd25c…`; rulings 2, 3, 5); `ux/effects-sprite-sync.md` (`4e72b97e…`) §5 "Recommendation" 1–5 and 7, §10 answers 7; `/workspace/scratch-ea/s33b-split-proposal.md` (`f56060dc…`; the 33b-1 row, CEO-approved 2026-11-14); step-33i-motion-shore-live.md Rulings 1, 5, 6.
Kit: kit-1 r3 (guide-3), 2026-11-14. Engine Architect. r3 folds in QA's r2 test-only qfix (G1: 8 plant misses; G6 granted by the EA for its new test file) and fixes kit wording (D-1, D-2, the Low wording); the code is r2's. Prototyped on Node 24.22.1: branch `r33b1` = **`b2041fb761750eb648ac94d5c332e13bd708be32`** (tree `5d325d14`; QA's `refs/cmp/s33b1-qfix-r2`, author QA) on r2 `1903b6e` on r1 `c5c4b62` on `fa920c56`. `npm ci && npm run green` exits 0 with `tests 638 pass 638 fail 0 skipped 0 todo 0` (630 + 8); `tsc` 0; the four fence tests pass unchanged. Sims unchanged (stage-fixed 48/2 `afc89d56…`, stage-weighted 22/28 `b8007292…`); the 20 smoke lines are byte-identical to the Base except the heap delta. Plants: `/workspace/scratch-ea/s33b1-plants-r3.py` (`6143bed6…`), **74/74 caught (r2's 66 plus QA's 8), all 74 catching tests fail on the Base**. Bundle copy: `/workspace/scratch-ea/r33b1-r3.bundle` (`fa920c56..r33b1`, verified, sha256 `bbdece8c…`); patch `/workspace/scratch-ea/s33b1-backup/r3.patch` (`1861ae89…`). Kit sha list: `/workspace/scratch-ea/kit-backup-r33b1/r3-kit-sha256.txt`. (r2: `1903b6e`, tree `6fffdadf`, 636/0, 317 lines, plants 66/66, bundle `4b2632db…`. r1: `c5c4b62`, 635/0, 282 lines, 53/53.)
Carries: **no new CN** (CN-015's accepted text `2c9dd25c…` is pushed with this kit). No core-types change (`61fad786…`); `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) unchanged.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist (`docs/qa/handback-checklist.md`) before hand-back (see BUILD_GUIDE).

## Goal
After this step a hit feels like a hit on the live screen, in view time only. At `hitAt` the effect, the attacker and the victim hold for `hit_stop_ms`. While they hold, the victim shivers 1 px, and a `squash` effect squashes the victim for one 60 ms frame. A `shake` effect shakes the world camera 1–3 px, scaled by the player's Off / Low / Full setting. The HUD (`ui` band) never shakes. A new pure `feel.ts` holds the rules. After a hold, held units resume from the pose they froze on, running late until their clip changes. The live player (`fx-live.ts`) applies them per effect. The scene link puts them on the units and exposes the shake. The frame driver builds the world with the shaken camera, so the world is drawn out to the screen edges and stops at map edges. The night layer moves with it, and only the `ui` band is moved back. Rules, the log and the camera state are never touched.

## Rulings
All rulings are EA (this kit) on the CEO's 18:35 rulings and CN-015 unless a source is named. Every one is pinned.
1. **Hit-stop** (UX §5, accepted; `hit_stop_ms` 0–150): from `hitAt`, the effect, its caster and its target **hold** for `stopMs(hit_stop_ms)`: rounded up to ticks, capped at 150; reduce motion gives 0; reduce flashes (`SceneClock.reduceFlashes`) caps it at 50. Absent, ≤ 0 or not a number gives 0.
   - **The effect** holds its `hitAt` pose (`warp`), then plays on `stop` ms late: its pieces end `stop` ms later and it stays due until then.
   - **Units** draw the frame of their clip at the hold start, with no clip, until the hold ends, then resume from that pose, running late (Ruling 9). Pieces that follow a held unit read the held, then the late, pose (`unitOf(id, tMs)` minus the unit's lag).
   - **Events are not shifted.** `fx:hit`, `fx:end` and the view-hit times stay on the timeline (33a/33h): the rules and the log commit at command time.
   - **Overlaps** (max, then cap; never add): a unit's overlapping holds end at the latest end, capped at 150 ms past the first start (`mergeHolds`).
   - Holds, the shiver and squash are judged on the **pose grid** (`poseMs`, 30 ms or 60 ms in lite), so the scene cache (keyed by pose) never shows a stale hold. `reduceFlashes` is in the scene key.
   - Pinned by: "hit-stop: the effect, attacker and victim hold at hitAt for hit_stop_ms (view time only), then the effect plays on late; 0-150 on ticks, reduce motion 0, reduce flashes 50; overlaps end at the latest end capped 150 ms past the first start (step 33b-1)".
2. **The victim shivers 1 px during hit-stop** (CEO 18:35 Q4; CN-015 ruling 3: always on, no `hit_stop_jitter` field): while a unit is held as an effect's **target**, it draws `ox` ±1 art px, flipping each pose step (30 ms; 60 in lite). `ox` moves the drawing, never the sort. The attacker and the effect stay still: effect pieces do not follow the shiver. There's none under reduce motion, because the stop is 0. Pinned by: "shiver: during hit-stop the victim moves ±1 art px every 30 ms pose step (60 in lite); the attacker and the effect stay still; none under reduce motion (step 33b-1)".
3. **Squash** (UX §5 rec. 7; CN-015 `squash`, absent = false): with `squash: true`, the target draws **one 60 ms frame from `hitAt`**, 2 px wider and 2 px shorter, with its feet kept.
   - The pixels are nearest-resampled **at art res** (`squashed`), from the bottom row up. The draw list draws the sheet `<sheet id>~sq<cell>~<fw>x<fh>` at `(fw+2)×(fh−2)`, moved 1 px left and 2 px down, so the anchor (feet) stays put.
   - The scene link's `pixels(id)` makes it from the frame source, and the canvas caches the image (one per id, the 120-frame idle drop of 33i). Moonlit swaps carry it, because the id starts with the standing's sheet id.
   - It's skipped under reduce motion, and for sprites 2 px tall or less.
   - Pinned by: "squash: with squash on, the victim draws one 60 ms frame 2 px wider and 2 px shorter with its feet kept, nearest at art res; off by default and under reduce motion (step 33b-1)".
4. **Shake** (CEO 18:35 Q1: 1–3 px on big hits; CN-015 ruling 2; UX §5 rec. 2):
   - **Strength:** `shake` 0–3 art px. A stored 4 or more plays as 3, a negative or fraction is truncated into range, and each gives `outOfRange` (`shake`); the stored value is never rewritten.
   - **Length:** `shake_ms` 80–400, clamped with `outOfRange` (`shake_ms`). Absent gives 120 / 200 / 300 ms by strength.
   - **Curve:** each hit is a kick at `hitAt` with amplitude `px · (1 − u)²` (trauma², peak = the strength). The amplitude is sampled at the start of each 30 ms step, so a step holds one offset.
   - **Overlaps:** the largest kick wins, then the cap of 3 applies (max, then cap; never add).
   - **Offsets:** whole art px from seeded integer noise (`hash32(seed, "shake", step, axis)`, seed = `hash32(mapSeed, effect id, 0, 0)`), so it replays exactly.
   - **Direction:** the first step kicks along the hit, from the caster's cell to the target's (`shake_dir: "hit"`, also for unknown values); `"none"` gives noise only.
   - **No rotation.** The live player stays due (`dueMs`) until the shake ends.
   - Pinned by: "shake: 0-3 art px (4+ plays as 3, negative as 0, outOfRange), 120/200/300 ms by strength or shake_ms 80-400; trauma² peaking at the strength, max then cap 3; whole px, seeded, stepped every 30 ms, first step along the hit; player Off/Low/Full and reduce motion (step 33b-1)".
5. **Player setting** (CEO 18:35; CN-015 `screen_shake`, ruling 5): `SceneClock.shake` is `"off" | "low" | "full"`. Absent or unknown = full; low: **a 0 px shake stays 0**, otherwise `max(1, floor(px / 2))` (CN-015 `2c9dd25c` ruling 5); off gives 0. **Reduce motion forces off.** Reduce flashes does not touch the shake: shake is motion, not brightness, and it never counts as a flash. Pinned by: the Ruling 4 test.
6. **The HUD never shakes** (CEO 18:35; CN-015 ruling 2):
   - The scene link exposes `shake` (whole art px; 0 with no clock). The game passes it as `View.shake`.
   - **Overscan** (EA ruling on r1 Q2): the driver builds the draw list with the **shaken camera** (`shakeCam`: the camera moved by `shake × s` device px). The world is culled and drawn for the shaken view, so its pixels reach every screen edge and **no edge pixel shows the clear colour**, even at the 3 px max.
   - **Map edges:** the shaken camera never goes past a map edge it was not already past, so at a map edge the shake stops at the edge instead of showing the void.
   - The **`ui` band** is moved back by the camera shake (`steadyUi`), so it never moves. The night layer moves with the world (`lights` gets the shaken camera).
   - A shake change counts as a camera move, so it redraws.
   - The HUD, editor UI and Effect Designer controls are not drawn by the world driver, so they cannot move.
   - Pinned by: "HUD never shakes: the driver builds the world with the shaken camera (whole art px times the scale, never past a map edge), so no edge pixel shows the clear colour at max shake; the night layer shakes with it; the ui band stays put; a shake change redraws (step 33b-1 r2)".
7. **Ruling 9 wording** (carry from the 33i A/B review, EA ruling 2; it rewords 33i Ruling 9): **object sway is blocked only while a clip is actually playing.** Objects play no clip yet, so an object whose asset has clips still sways, with no ANIM hint. A tile cell covered by a `tileProps` `anim` clip does play that clip, so it keeps the ANIM hint once per asset, as before. Pinned by (QA, unchanged, now a 33b-1 shipped test): "an object whose asset has clips still sways when sway is on; with sway off (objects[].motion null) it stays static, with no ANIM hint (EA ruling 2 on 33i A/B, QA 33i A/B)".
8. **Absent = today** (CN-015 "every field optional"): with no `hit_stop_ms`, `shake` or `squash` on an effect, and no `View.shake`, the scene, the draw list and the frame are exactly as in 33i. Pinned by: every 33h and 33i shipped test, unchanged and passing.
9. **Held units run late** (EA ruling on r1 Q1): a hold freezes the attacker and the victim, and they **resume from the pose they froze on** instead of jumping ahead.
   - After a hold, the unit's clip clock runs late by the hold length (`Standing.lagMs`; the draw list subtracts it from the instance offset).
   - A later hold on the same clip adds its length, and freezes on the late pose.
   - **The offset drops** when the unit's clip changes (a new action or facing picks another clip object), and when the unit leaves the scene.
   - Units that were never held stay on their own clock. A squash alone is no hold, so it starts no offset.
   - **Law 13:** one offset per held unit (`{ clip, lag, from, ms }`), pruned each clocked `scene()` call to the units on screen whose clip is unchanged, so the map is never larger than the shown units. `SceneLink.lagged()` reports its size.
   - Pinned by: "run late: a held unit resumes on the pose it froze on, its clip running late by the hold until its clip changes; units never held keep their own clock; one offset per held unit, none kept for gone units (step 33b-1 r2)". It checks that the victim resumes on the held pose, and that the offset clears on the next clip.

## Files to create or change
- create `src/runtime/render/feel.ts` (≤ 76; the Feel rules: `stopMs`, `mergeHolds`, `warp`, `shiver`, `shakePx`, `shakeLen`, `playerPx`, `shakeAt`, `shakeCam`, `steadyUi`, `squashed`)
- create `tests/runtime/scene/feel-shake.test.ts` (≤ 140, re-based in r2; the shipped test, verbatim)
- create `tests/runtime/scene/feel-shake-qa.test.ts` (≤ 37 = 33 + 4; QA's shipped G1 test, verbatim; G6 granted by the EA in r3)
- change `src/runtime/render/fx-live.ts` (≤ 91; Feel knobs on `LiveFx`, settings on `LiveGrid`, holds and shake in `LiveOut`, `unitOf(id, tMs?)`)
- change `src/runtime/render/types.ts` (≤ 38; `Standing.squash`, `Standing.lagMs`)
- change `src/runtime/render/draw-list.ts` (≤ 73; the squash sheet, `lagMs`)
- change `src/runtime/render/index.ts` (≤ 21; exports)
- change `src/runtime/scene/world-scene.ts` (≤ 122; holds on units, the late offsets, `shake`, `lagged`, squash pixels, clock settings, the ruling 9 comment)
- change `src/runtime/host/raf-driver.ts` (≤ 93; `View.shake`, the shaken camera)

Size: 150–400 changed lines. The proto changes **350** lines (+308/−42) in 9 files (r1 282; r2 +35; r3 +33, QA's test):

| File | Base → proto / cap |
|---|---|
| `src/runtime/render/feel.ts` | 0 → 74/76 |
| `src/runtime/render/fx-live.ts` | 74 → 87/91 |
| `src/runtime/render/types.ts` | 34 → 34/38 |
| `src/runtime/render/draw-list.ts` | 68 → 69/73 |
| `src/runtime/render/index.ts` | 16 → 17/21 |
| `src/runtime/scene/world-scene.ts` | 114 → 121/122 |
| `src/runtime/host/raf-driver.ts` | 88 → 89/93 |
| `tests/runtime/scene/feel-shake-qa.test.ts` | 0 → 33/37 (new in r3, QA; count + 4) |
| `tests/runtime/scene/feel-shake.test.ts` | 0 → 136/140 (re-based from 114: r2's pins for the late clock (victim resumes on the held pose; offset clears on the next clip; bounded) and for overscan (no clear edge pixel at max shake, map-edge clamp)) |

## Interfaces to match (quoted exactly)
```ts
// render/feel.ts
export const FEEL = { stopMaxMs: 150, stopFlashMs: 50, squashMs: 60, shakeGridMs: 30, shakeMax: 3, shakeMs: [0, 120, 200, 300], shakeMsMin: 80, shakeMsMax: 400 } as const;
export type ShakeSetting = "off" | "low" | "full";
export type Hold = { readonly from: number; readonly to: number };
export type Kick = { readonly at: number; readonly px: number; readonly ms: number; readonly dx: number; readonly dy: number; readonly seed: number };
export type Shake = { readonly x: number; readonly y: number; readonly nextMs: number };
export function stopMs(stored: unknown, stepMs: number, reduce: boolean, flashes: boolean): number;
export function mergeHolds(rows: readonly Hold[]): Hold[];
export const warp: (tMs: number, hold: Hold | null) => number;
export const shiver: (poseMs: number, fromMs: number, gridMs: number) => number;
export function shakePx(stored: unknown): { px: number; bad: boolean };
export function shakeLen(stored: unknown, px: number): { ms: number; bad: boolean };
export const playerPx: (px: number, setting: string | undefined, reduce: boolean) => number;
export function shakeAt(kicks: readonly Kick[], tMs: number): Shake;
export const shakeCam: (cam: Cam, dx: number, dy: number, mapW: number, mapH: number, fit: Fit) => Cam;
export const steadyUi: (list: DrawList, dx: number, dy: number) => DrawList;
export function squashed(id: string, source: (sheetId: string, frame: number, fw: number, fh: number) => Pixels | undefined): Pixels | undefined;
// render/fx-live.ts
// LiveFx gains: readonly hit_stop_ms?: number; readonly shake?: number; readonly shake_ms?: number; readonly shake_dir?: string; readonly squash?: boolean
// LiveGrid gains: readonly reduce?: boolean; readonly flashes?: boolean; readonly shake?: ShakeSetting
export type LiveHold = { readonly at: number; readonly ms: number; readonly ox: number; readonly squash: boolean };
// LiveOut gains: readonly holds: Readonly<Record<string, LiveHold>>; readonly shake: { readonly x: number; readonly y: number }
// FxLive.frame's unitOf becomes (id: string, tMs?: number) => LiveUnit | null (a one-argument function still fits)
// render/types.ts — Standing gains: readonly squash?: boolean; readonly lagMs?: number
// scene/world-scene.ts
// SceneClock gains: readonly shake?: ShakeSetting; readonly reduceFlashes?: boolean;  SceneLink gains: readonly shake: { readonly x: number; readonly y: number }; readonly lagged: () => number
// host/raf-driver.ts — View gains: readonly shake?: { readonly x: number; readonly y: number }
```
Nothing comes from `src/types/core-types.ts`. The game maps the effect's stored knobs onto `LiveFx` under the same names, and the profile's `screen_shake`, `reduce_motion` and `reduce_flashes` onto `SceneClock`.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) are identical, and the 20 smoke lines are byte-identical to the Base except the heap delta (measurement noise; identical in the proto run).

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-33b1-feel-shake/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/feel-shake.test.ts` | `tests/runtime/scene/feel-shake.test.ts` | `e19576f4ef858334b231d2aa828336b71db4e10f1c65822040e61911855c1113` |
| `tests/runtime/scene/feel-shake-qa.test.ts` (QA's G1 test from the 33b-1 r2 review; G6 granted in r3) | `tests/runtime/scene/feel-shake-qa.test.ts` | `8e8f601af686467a58a9617f421296d5299500bbc3a8491010d69366a90bae74` |
| `tests/runtime/scene/motion-shore-live-qa.test.ts` (QA's G6 test from 33i A/B, folded in; already on main) | `tests/runtime/scene/motion-shore-live-qa.test.ts` (unchanged) | `74260affe6574bd2865a15aa0cee3cdb20e5374762da05cc734eac8d58084887` |

Titles they hold (exact):
- "hit-stop: the effect, attacker and victim hold at hitAt for hit_stop_ms (view time only), then the effect plays on late; 0-150 on ticks, reduce motion 0, reduce flashes 50; overlaps end at the latest end capped 150 ms past the first start (step 33b-1)": the effect frame held at 3 for poses 1320–1380, then 100 ms late; both units' held frames; their own clock again after; the effect ends 100 ms late and stays due (1980 vs `Infinity`); reduce motion; `stopMs` cases; reduce flashes 50 and in the key; `mergeHolds` latest end and the 150 cap; a second effect's stop merged; holds start on the pose grid.
- "shiver: during hit-stop the victim moves ±1 art px every 30 ms pose step (60 in lite); the attacker and the effect stay still; none under reduce motion (step 33b-1)": `ox` −1, 1, −1, 1; the attacker 0; the effect unmoved; lite steps; a follow piece reads the held attacker pose.
- "squash: with squash on, the victim draws one 60 ms frame 2 px wider and 2 px shorter with its feet kept, nearest at art res; off by default and under reduce motion (step 33b-1)": the held cell, the `~sq` draw command 18×14 at −1/+2, the resampled rows (feet kept), bad ids and sources, `pixels` through the link.
- "shake: 0-3 art px (4+ plays as 3, negative as 0, outOfRange), 120/200/300 ms by strength or shake_ms 80-400; trauma² peaking at the strength, max then cap 3; whole px, seeded, stepped every 30 ms, first step along the hit; player Off/Low/Full and reduce motion (step 33b-1)": clamps and notices, defaults, player settings, kick and noise, max not sum, cap, trauma², through the link (dir east, low, off, reduce, none), `outOfRange` once per field, no clock → 0, `dueMs` after the effect.
- "run late: a held unit resumes on the pose it froze on, its clip running late by the hold until its clip changes; units never held keep their own clock; one offset per held unit, none kept for gone units (step 33b-1 r2)": `lagMs` 100 on the attacker and victim and none on a third unit; the drawn victim cell at 1400 equals the held cell, then follows the clip 100 ms late; a second hold freezes on the late pose and makes 200; a follow piece reads the late pose; a clip change clears the offset for good; `lagged()` 2, then 0; gone units leave nothing.
- "HUD never shakes: the driver builds the world with the shaken camera (whole art px times the scale, never past a map edge), so no edge pixel shows the clear colour at max shake; the night layer shakes with it; the ui band stays put; a shake change redraws (step 33b-1 r2)": `steadyUi`; `shakeCam` cases (middle, both map corners); a 20×20-tile map at s = 2 with shake ±3: no canvas pixel is the clear colour; the fxAir piece moves 6 device px and the HUD stays at 8,8; lights get the shaken camera; at the map corner the shake stops at the edge; a shake change alone redraws; no change, no draw.
- QA G1 (33b-1 r2 review, `feel-shake-qa.test.ts`): "QA 33b-1 (G1 r2): non-finite hit_stop_ms is no stop; only the victim squashes, also with a stop; no squash for sprites 2 px tall or less (step 33b-1)" and "QA 33b-1 (G1 r2): only the first 30 ms step kicks along the hit; x and y noise use their own axis; the seed is the effect's own; shake 0 is none on Low; the far map edge is in device px (step 33b-1)".
- QA G6 (33i A/B): "tiles share one motion clock: sway and scroll tiles of one kind show the same pose in every column (ruling 1, QA 33i A/B)" and "an object whose asset has clips still sways when sway is on; with sway off (objects[].motion null) it stays static, with no ANIM hint (EA ruling 2 on 33i A/B, QA 33i A/B)".
(You may add tests. The hand-back lists all three shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s33b1-plants-r3.py <clone> <base clone>` (`6143bed6…`) runs 74 plants over Rulings 1–6 and 9:
- HS1–HS15, hit-stop: stop ignored, no warp, no late end, no cap, no flash cap, reduce kept, no ticks, overlaps added, overlaps uncapped, holds dropped, clock frame, unheld actor, clock not pose, flashes not in the key, clip kept.
- SV1–SV4, shiver: none, the attacker shivers, no lite grid, dropped by the link.
- SQ1–SQ9, squash: none, under reduce, 90 ms, the attacker squashed, the draw list ignores it, feet not kept, sampled from the top, pixels unreachable, wrong-size source.
- SK1–SK20, shake: no clamp, no notice, wrong defaults, `shake_ms` unclamped, Low gives 0, reduce kept, stacking adds, no cap, no kick, not stepped, linear, the player drops the notice, the setting lost, reduce lost, flashes lost, the shake not exposed, the kick reversed, `none` ignored, kept with no clock, `dueMs` ignores it.
- HU1–HU6 and OS1–OS3, HUD and overscan: the `ui` band shakes, the driver ignores the shake, lights not moved, no redraw, not scaled, the `ui` band not steadied, the list built with the unshaken camera (clear edges), past the near map edge, past the far map edge.
- RL1–RL9, run late: no late clock, the draw list ignores `lagMs`, the offset survives a clip change, offsets never pruned, a second hold not added, a held frame ignoring the earlier lag, one lag for every unit, effects reading the unlagged actor, a squash alone starting an offset.

- QA-F3, F20, F24, F32, F54, F56, F59, F60 (QA's r2 misses): non-finite `hit_stop_ms` held, the shake seed not per effect, the far map edge not in device px, the attacker squashing with a stop, squash for sprites 2 px tall, Low with 0 px giving 1, x and y noise sharing an axis, the hit kick lasting two steps.

Expected: **74/74 caught, and all 74 catching tests fail on the Base** (the shipped files cannot load there). No equivalent plants.

## Example
A hero (west) hits a slime (east) with `hit_stop_ms: 100, shake: 2, squash: true`, and the contact lands at 1300 ms:
- From pose 1320 to 1380, the slash holds its 1300 ms pose. The hero holds its attack frame, and the slime holds its idle frame and shivers 1 px left and right.
- The slime draws squashed (18×14) until pose 1350.
- The world kicks 2 px east at 1300, then shakes in whole pixels on 30 ms steps until 1500. The HUD stays still.
- At 1410 everyone moves again from the pose they froze on: the hero and the slime run 100 ms late until their clips change (the hero's next action, say), and the slash finishes 100 ms late.
- While the world shakes, the screen edges show more map, never the clear colour; at a map edge the shake stops at the edge.
- With Screen shake on Low, the kick is 1 px. With reduce motion on, there's no stop, no shiver, no squash and no shake.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 638 tests passing and none failing, skipped or todo.
- [ ] `tests/runtime/scene/feel-shake.test.ts` is byte-identical to sha256 `e19576f4…`, `feel-shake-qa.test.ts` to `8e8f601a…`, and `motion-shore-live-qa.test.ts` to `74260aff…`; 33h's `host-hookup.test.ts` (`e1dc7ffd…`) and 33i's `motion-shore-live.test.ts` (`b8a05b0a…`) are unchanged and pass.
- [ ] Sims and every pin above unchanged; the smoke lines byte-identical except the heap delta; the four fence tests unchanged and passing.
- [ ] Each file within its cap; 150–400 changed lines in total.
- [ ] No import line changes outside the fences: `feel.ts` imports only `./x.ts`; `world-scene.ts` only `../render/index.ts` and `../../core/notice.ts`; `raf-driver.ts` only the clock, `../canvas/canvas2d.ts` and `../render/index.ts`.
- [ ] With no Feel fields and no `View.shake`, everything behaves as in 33i (all 33h and 33i tests pass).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location above.

## Not in this step (carries, with their target step)
- **33b-2 (CN-015):** ramp colours (`tint_ramp`, `tint_snap`, hosts pass resolved ramps; no CN), `hit_white_mode: "bright"` and the `clip_cues` suppression, `light_mode` / `light_radius` / `light_ramp`, the light budgets, stepped pixel glow, the `lit: self` punch-out, torches at half size in stage dim with a per-ability `fullyDark`, the te-flash@3 pop-light rule only (EA Q2 option A), and the 4 ms p95 budget test.
- **33b-3 (after DSK's particle CN):** particles (a pool of 96, soft cap 48 per effect; 32 is only the editor's note), `pixel_scale`, `outline`, RotSprite with the 16 MB LRU, and the draw budgets.
- **s34 (perf):** `/workspace/scratch-ea/integration-seams.md` items 14 (the water grid and shore check rebuilt on every moving frame) and 15 (motion warnings keyed by sheet id, not asset id), plus the earlier carries.
- **The game side:** passing the effect's Feel knobs on `LiveFx`, `screen_shake` / `reduce_motion` / `reduce_flashes` on `SceneClock`, and `link.shake` as `View.shake`. Game rules stay out of the engine.

## Decisions note: what to name
Name these in the hand-back's Decisions note:
- View time only: events and rules are not shifted. The effect's draw time warps; units hold, then run late by the hold until their clip changes.
- Holds, the shiver and squash are judged on the pose grid; `reduceFlashes` is in the scene key.
- The squash id form `<sheet>~sq<cell>~<fw>x<fh>`, built on demand, with the canvas caching the image.
- The shake seed (`hash32(mapSeed, effect id, 0, 0)`), the step-start sampling, the shaken camera (overscan by building the list with it, clamped at map edges), and that only the `ui` band is moved back.
- Law 13 bounds: one late offset per held unit, pruned each clocked call to the shown units with an unchanged clip (`lagged()`); `mergeHolds` and the kicks are per call, bounded by the effect list; there's no new cache (squash images live in the canvas's per-id cache with its 120-frame idle drop); shake notices go through the link's ≤ 1024 deduped notices.
- Reserved words: `self`, `phase`; no game words in the render files.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `fx-player.ts`; `bakes.ts`; `canopy.ts`; `light.ts`; `motion.ts`; `water.ts`; `world-motion.ts`; `canvas2d.ts`; `src/core/**`; `src/fx/**`; the sim; every existing test file; plus BUILD_GUIDE §7's never-edit list.

## Out of scope
Game rules. Format changes. core-types changes. Shake rotation. Knockback `nudge` (looks only; not in CN-015). A hit-stop opt-out for the shiver (it would need an additive CN).

## Kit files to push
All under `/workspace/tileengine`, with their full sha256 in `/workspace/scratch-ea/kit-backup-r33b1/r3-kit-sha256.txt`:
- `handoff/steps/step-33b1-feel-shake.md` (this file)
- `handoff/steps/tests/step-33b1-feel-shake/tests/runtime/scene/feel-shake.test.ts` (`e19576f4…`)
- `handoff/steps/tests/step-33b1-feel-shake/tests/runtime/scene/feel-shake-qa.test.ts` (`8e8f601a…`, QA)
- `handoff/steps/tests/step-33b1-feel-shake/tests/runtime/scene/motion-shore-live-qa.test.ts` (`74260aff…`)
- `handoff/change-notices/CN-015-effects-feel-format.md` (`2c9dd25c…`, ACCEPTED, DSK's; replaces the pending `01aaba1f…` on main)
- Not pushed with this kit: DSK's wording revs `data/profile-format.md` r15 and `data/setup-format.md` r25, because `data/` is not tracked on `fa920c56`.
- `handoff/README.md`, `docs/core-spine-slices.md`

## Open questions
None. (r1's Q1 is closed as Ruling 9: held units run late until their clip changes. r1's Q2 is closed in Ruling 6: overscan, so there are no clear edges. r1's Q3: the accepted CN-015 (now `2c9dd25c`) is pushed and replaces `01aaba1f` on main.)
