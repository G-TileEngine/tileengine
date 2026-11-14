# step-33i-motion-shore-live: water motion, plant sway and shore foam on the live screen (renderer plan slice 33, host hookup part 2; CEO 2026-11-13 23:12; no CN)

Step id: step-33i-motion-shore-live          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`6eacd03ca2701dbc0e7fd7a974ff737b031af006`** (main after PR #42, the step 33h merge onto `71f43099`; tree `3ca432dd`; verified PASS 618/0, `/workspace/scratch-ea/s33h-verify-report.txt`). Branch: `step/step-33i-motion-shore-live-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`.
The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-33i-motion-shore-live-r<N>.bundle <Base>..step/step-33i-motion-shore-live-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33i-motion-shore-live/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 prefix in it.
Depends on: step 33h, merged `6eacd03` (`fx-live.ts`, `world-scene.ts` `createSceneLink`, `SceneClock`); step 32 (`motion.ts` `bakeMotion`, `motionCell`, `pickMotion`, `shoreSettings`; `water.ts` `shoreDistance`, `shoreFrames`, `SHORE_MAX`; `bakes.ts` `waveOffsetMs`, `Pixels`; step-32 "Host shell (s33)" carries); step 31 (`light.ts` `createMoonlit`, `Canvas2D.lights`); step 29 (`raf-driver.ts`); step 28 (`canvas2d.ts`, chunk cache); step 27 (`draw-list.ts`, `chunk-plan.ts` `isStatic`, `dirty.ts` `present`, `frames.ts` `hash32`). Formats: CN-012 (`6a10fc48…`; `motion` on assets, `tileProps[i]`, `objects[]`), CN-013 (`b4f812f6…`; style `ramps`, `liquidEdge`, `shore`). **No new CN; no import line moves.**
Read first: BUILD_GUIDE.md §3 (runtime import lines), §7, law 13; `docs/qa/step-33h-review.md` (`8c2d60aa…`; N-7); `docs/qa/step-33h-ab.md` (`35c6403c…`); `docs/qa/step-33i-review.md` (`f97a266a…`; r1 review: M-1–M-3, G1, S-1–S-4; r2 addendum: M-4; r3 addendum: RM4g); step-32-animated-extras.md Rulings and "Host shell (s33)"; step-33h-host-hookup.md "Not in this step" (a)–(h).
Kit: kit-1 r4 (guide-3), 2026-11-14: r3 plus QA's test-only qfix r3 (G1 gap RM4g, `docs/qa/step-33i-review.md` r3 addendum). Engine Architect. Prototyped on Node 24.22.1: branch `r33i` = **`e6c70c1f4727355de58f43054ff7277ab6bbb6ac`** (tree `d47c89c8`) on `6eacd03c`: r1 `a32764a`, QA qfix `1ab3a87` (G1), r2 `8a7d647` (M-1 recipe key holds the frame size; M-2 strip ids stop at 64 and the warned set at 1024; M-3 plain `shoreInvalid`), r3 `b1308df` (M-4: link notices deduped by code+message across calls, ≤ 1024, stop never clear), QA qfix r3 `e6c70c1` (`refs/cmp/s33i-qfix-r3`, patch `s33i-qfix-r3.patch` `e0524d31…`; one test: repeats inside one call count toward the cap). `npm ci && npm run green` exits 0 with `tests 628 pass 628 fail 0 skipped 0 todo 0` (618 + 10); `tsc` 0; the four fence tests pass unchanged. Sims unchanged; the smoke lines are byte-identical to the Base except the heap delta. QA's probes (r3 code, unchanged in r4): `probe-r2.ts` P2d and P2e `1,0,0,0,0`; `probe-33i.ts` P1 bush 64x16 / tree 128x48, P2a 100 notices, P2b `65,0,0,0`, P2c `64,0,0`, P5 `["shoreInvalid"]`. Plants: `/workspace/scratch-ea/s33i-plants-r4.py` (`f35b2ce1…`), **55/55 caught, all 55 catching tests fail on the Base (+2 equivalent)**; QA's sets all counted rule plants caught (r3: RM4g now caught by the shipped test; RM4d equivalent through the API; RM4f caught by 33h's test). Bundle copy: `/workspace/scratch-ea/r33i-r4.bundle` (`6eacd03..r33i`, verified, sha256 `c42613ab…`). Kit sha list: `/workspace/scratch-ea/kit-backup-r33i/r4-kit-sha256.txt`. (r3: `b1308df`, bundle `350242d6…`; r2: `8a7d647`, bundle `61307856…`; r1: `a32764a`, bundle `327c427c…`.)
Carries: **no CN.** No core-types change (`61fad786…`); `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) unchanged.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist (`docs/qa/handback-checklist.md`) before hand-back (see BUILD_GUIDE).

## Goal
After this step the live screen shows step 32's motion through the host: rivers scroll, leafy plants sway in the wind, and water edges carry animated shore foam. A new pure `world-motion.ts` plans each motion at load (once per asset, warnings once), bakes motion atlases and shore chunks lazily into pixels under one byte budget, and the canvas backend turns those pixels into images. The draw list draws motion cells from the atlas with a finite clock; the frame driver draws the night layer inside the open frame. It closes step 33h's carries (a)–(h).

## Rulings
All rulings are EA (this kit) on CEO 23:12 scope unless a source is named. Every one is pinned.
1. **River scroll** (CEO 23:12): a scroll part with `step: 1` and the default `ms` 200 moves **1 px per 0.2 s**. Tiles draw from the motion atlas, sheet id `<sheet id>~m<tile>~<recipe key>`, `n` frames in one row; every tile of a kind shows the **same pose**: **tiles share one motion clock** (offset 0, so a river reads as one stream). This **narrows s32 ruling 9 for tiles only** (CEO 👍, closing r1's OQ2); objects keep the per-instance `hash32(mapSeed, sheet id, c, r)` offset; motion tiles are never baked into a chunk (`isStatic` is false for them); `dueMs` is the next pose boundary. Pinned by: "river scroll: a scroll tile draws its motion atlas 1 px per 0.2 s, every tile on the same pose, never baked into a chunk, and moonlit swaps carry it to the night sheet (step 33i)".
2. **Sway** (CEO 23:12): sway is a **1.6 s loop** (4 poses × 400 ms) and lags downwind by `waveOffsetMs(xArt, 1600, 45)`, gusts about **45 px/s** (a plant 45 art px further on lags one second). `xArt` is the plant's art x (`c·tileW + dx`). Pinned by: "sway: a leafy plant loops 4 poses in 1.6 s and a plant 45 px further downwind lags one second (gusts about 45 px/s); objects[].motion overrides or clears it (step 33i)".
3. **Sway per plant** (CEO 23:12, "per plant via the leafy tag"; **no CN-017: the leafy tag is `motion.sway`**, CEO 👍 23:37): sway comes from the asset's `motion.sway` (the leafy plant asset), and `objects[i].motion` overrides it per placement; `null` clears it (`pickMotion` order: placement, tile, asset). Pinned by: the Ruling 2 test.
4. **Shore foam on by default** (CEO 23:12; CN-013): water edges get animated foam whenever the style has a water ramp and `liquidEdge` is absent or `"foam"`; makers turn it off with `shore: false` or any `liquidEdge` other than `"foam"` (e.g. `"ice"`; the test uses `"none"`). Foam is one `fxGround` overlay per chunk that holds water, sheet id `shore~<rev>~<cx>,<cy>`, with a clip of all its frames at `shore.ms`. Water cells are the top ground layer's tiles listed in `SceneWorld.waterTiles[tileset]`. Pinned by: "shore: water edges get animated foam on fxGround by default; shore: false or liquidEdge none turns it off; reduce shows frame 0 and no motion (step 33i)".
5. **Reduce motion** (s32 ruling; CN-012 `reduce_motion`): `SceneClock.reduce: true` attaches no motion to tiles or objects and draws each shore chunk at frame 0; a change of `reduce` rebuilds the layers. Pinned by: the Ruling 4 test.
6. **Moonlit** (CEO 23:12): moonlit is the colour swap plus the night layer. `createMoonlit`'s sheet swap carries motion unchanged because atlas ids start with the layer or object sheet id, so the night sheet's frames are baked under the night id; the host passes the style body in use (day or night ramps), and the recipe key includes the ramps. The night layer (`Canvas2D.lights`) draws **inside** `present`'s open frame through `present(…, after)`, which the driver calls with `View.lights`. **This replaces step 32 "Host shell (s33)": "`Canvas2D.lights` after `present`"** (after `endFrame` the frame is closed, so it could not draw). Pinned by: the Ruling 1 test (night sheet) and "bounds and host: baked pixels stay under BAKE_BUDGET; the canvas turns pixels into images and decodes frames; the night layer draws inside the open frame; a strip warns once per clip per asset id (step 33i)".
7. **Same foamPx, chunked bake, no seams** (s32 carries c, d): each shore chunk bakes its own cells plus the neighbours' land within `SHORE_MAX` (32 px), with the map's noise origin (`shoreDistance(…, ox, oy)`), and the same `foamPx` goes to `shoreDistance` and `shoreFrames`; a chunk equals the matching part of one whole-map bake. Pinned by: "shore bake: chunks match one whole-map bake with the same foamPx (no seams), and a stale, off-map or malformed window bakes nothing (step 33i)".
8. **Window check before a re-bake** (s32 carry f): a shore id bakes only if its `rev` is the current map's, its chunk is on the map with whole, non-negative coordinates, and the water grid has `cols·rows` cells; otherwise `pixels` returns `undefined` and never throws. A dig (changed water) bumps `rev`. Pinned by: the Ruling 7 test.
9. **Motion warnings once per asset** (s32 carry b): `motionInvalid` / `motionTooLarge` are pushed once per asset (owner = tileset or asset id) per code and message; a cell that already plays a clip gets the ANIM hint ("…set anim: null to use motion") once; rebuilt worlds repeat nothing. `shoreInvalid` is pushed with the **plain code `shoreInvalid`**, once per field, and its message names the field (QA M-3). Pinned by: "warnings and clocks: a bad or clip-covered motion warns once per asset across tiles and rebuilds; a non-finite clock draws pose 0 with no due time (step 33i)" and "M-1, M-2 and M-3: one motion on two frame sizes bakes each at its own size; one strip clip under 65 asset ids warns 65 times once, then never; shoreInvalid is the plain code once per field, naming the field; the warned set stops at 1024 (step 33i r2)".
10. **Finite clock** (s32 carry e): a NaN or infinite `tMs` draws pose 0 and gives `dueMs` `Infinity` (`motionAt`). Pinned by: the Ruling 9 test.
11. **Bounded bakes** (law 13): baked pixels live in one LRU capped at `BAKE_BUDGET` = 32 MiB; plans and recipes in one LRU of `PLANS_MAX` = 1024, keyed by recipe **plus frame size** (the key is `<hash>s<fw>x<fh>`, so one `motion` on a 16×16 bush and a 32×48 tree bakes each at its own size; QA M-1); the warned set **stops adding** at 1024 keys (never clears); one shore state (the latest map). The canvas keeps one image per generated id, counted in `stats.bytes`, dropped after 120 unused frames. **The scene link keeps ≤ 1024 notices (`NOTICES_MAX`), deduped by code+message** (QA M-4): a notice whose code and message were already pushed in an earlier `scene()` call is dropped (repeats inside one call stay, as 33h's shipped test pins two equal clip copies warning twice); at 1024 the list and its seen map stop adding and never clear. So a clip or asset rebuilt every frame from the same data warns once, and 20k throwaway clips leave at most 1024 notices. Pinned by: the Ruling 6 bounds test, QA's qfix test ("QA qfix: anchors, …"), the M-1/M-2/M-3 test, "QA r3 qfix: repeats inside one scene() call count toward the 1024 cap …" and "M-4: link notices dedupe by code and message across frames and stop at 1024: a bad clip or a bad-ms asset rebuilt every frame warns once; more distinct notices than the cap stop at exactly 1024 (step 33i r3)".
12. **Pixels to images** (s32 carry a): `canvas2d({ pixels })` turns a generated sheet into a canvas (`createImageData` / `putImageData`) before falling back to `images`; `Canvas2D.frame(id, frame, fw, fh)` decodes one loaded sheet cell (`getImageData`) for the bake source. Pinned by: the Ruling 6 bounds test.
13. **Strip warnings per clip object plus asset id, capped** (s32/33h carry h, **closed**; QA N-7, M-2): `fxTooManyFrames` for a step strip warns once per clip object **per asset (sheet) id**; a clip keeps **≤ 64 ids per live clip (`WeakMap`)**: at 64 it stops adding ids, the next new id warns once and marks the clip full, and after that the clip is silent (65 or 70 ids give 65, 0, 0, 0 per frame). 33h's shipped test keeps equal copies apart, so the key keeps clip identity. Pinned by: the Ruling 6 bounds test and the M-1/M-2/M-3 test.
14. **Event order** (33h Ruling 5, carried, reworded): one call's events go out in global time order; ties go by effect order in the call, then timeline events before `fx:loop`; a missing caster falls back to the effect's `at` cell. Pinned by (33h, unchanged): "events on screen: each event fires once across frames by the crossing rule, tagged with its effect, in timeline order; start_on and hitAt come from the caster's clip (step 33h)".

## Files to create or change
- create `src/runtime/render/world-motion.ts` (≤ 80; plans, warnings, lazy motion and shore bakes, the byte LRU)
- create `tests/runtime/scene/motion-shore-live.test.ts` (≤ 166, re-based; the shipped test, verbatim)
- change `src/runtime/render/types.ts` (≤ 38; `TileMotion`, `TileLayer.motion`, `Standing.motion`)
- change `src/runtime/render/motion.ts` (≤ 82; `motionAt`)
- change `src/runtime/render/water.ts` (≤ 37; `shoreDistance` noise origin `ox`, `oy`)
- change `src/runtime/render/chunk-plan.ts` (≤ 42; motion tiles are not static)
- change `src/runtime/render/dirty.ts` (≤ 22; `present(…, after)`)
- change `src/runtime/render/draw-list.ts` (≤ 74; motion cells from the atlas)
- change `src/runtime/render/fx-live.ts` (≤ 78; strip warning key)
- change `src/runtime/render/index.ts` (≤ 20; exports)
- change `src/runtime/scene/world-scene.ts` (≤ 120; motion maps, shore overlays, `pixels`, `reduce`, the notices bound)
- change `src/runtime/canvas/canvas2d.ts` (≤ 150; `pixels` option, `frame`)
- change `src/runtime/host/raf-driver.ts` (≤ 90; `pixels` option, `View.lights`)

Size: 150–400 changed lines. The proto changes **386** lines (+332/−54) in 13 files (r1 295; QA's qfix +45; r2 +15; r3 +23/−8 in world-scene and the test; QA qfix r3 +4):

| File | Base → proto / cap |
|---|---|
| `src/runtime/render/world-motion.ts` | 0 → 76/80 |
| `src/runtime/render/types.ts` | 31 → 34/38 |
| `src/runtime/render/motion.ts` | 71 → 78/82 |
| `src/runtime/render/water.ts` | 33 → 33/37 |
| `src/runtime/render/chunk-plan.ts` | 38 → 38/42 |
| `src/runtime/render/dirty.ts` | 17 → 18/22 |
| `src/runtime/render/draw-list.ts` | 67 → 70/74 |
| `src/runtime/render/fx-live.ts` | 74 → 74/78 |
| `src/runtime/render/index.ts` | 15 → 16/20 |
| `src/runtime/scene/world-scene.ts` | 103 → 116/120 |
| `src/runtime/canvas/canvas2d.ts` | 134 → 146/150 |
| `src/runtime/host/raf-driver.ts` | 86 → 86/90 |
| `tests/runtime/scene/motion-shore-live.test.ts` | 0 → 162/166 (re-based from 91: QA's G1 test, the M-1, M-2, M-3 and M-4 pins, and QA's same-call-repeat cap test, RM4g) |

## Interfaces to match (quoted exactly)
```ts
// render/types.ts
export type TileMotion = { readonly key: string; readonly n: number; readonly parts: readonly MotionPart[] };
// TileLayer gains: readonly motion?: Readonly<Record<number, TileMotion>>;  Standing gains: readonly motion?: TileMotion;
// render/motion.ts
export function motionAt(parts: readonly MotionPart[], tMs: number, xArt: number, hash: number): { frame: number; nextMs: number };
// render/water.ts
export function shoreDistance(land: ArrayLike<number | boolean>, w: number, h: number, seed = 0, max = SHORE_MAX, foamPx = FOAM_PX, ox = 0, oy = 0): Uint8Array;
// render/dirty.ts
export function present(renderer: Renderer, fit: Fit, list: DrawList, clear: string, after?: () => void): void;
// render/world-motion.ts
export const BAKE_BUDGET = 32 * 1024 * 1024, PLANS_MAX = 1024;
export type FrameSource = (sheetId: string, frame: number, fw: number, fh: number) => Pixels | undefined;
export type WorldNote = { readonly code: string; readonly message: string };
export type ShoreMap = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly water: Uint8Array };
export type WorldMotion = { plan(m: Motion | null, ramps: ShoreStyle["ramps"], animated: boolean, fw: number, fh: number, owner: string): TileMotion | null; shore(map: ShoreMap | null, style: ShoreStyle | undefined, reduce: boolean): Overlay[]; pixels(id: string): Pixels | undefined; readonly notes: WorldNote[]; readonly bytes: () => number };
export function createWorldMotion(source: FrameSource): WorldMotion;
// scene/world-scene.ts
// SceneAsset gains: readonly motion?: Motion | null; readonly styled?: boolean; tileProps[i] gains readonly motion?: Motion | null
// SceneObject gains: readonly motion?: Motion | null
// SceneWorld gains: readonly style?: ShoreStyle; readonly waterTiles?: Readonly<Record<string, readonly number[]>>;
// SceneClock gains: readonly reduce?: boolean;  SceneLink gains: pixels(id: string): Pixels | undefined;
export const NOTICES_MAX = 1024;
export function createSceneLink(source?: FrameSource): SceneLink;
// canvas/canvas2d.ts
// Canvas2DOptions gains: readonly pixels?: (id: string) => Pixels | undefined;  Ctx2D gains optional createImageData, putImageData, getImageData
// Canvas2D gains: frame(id: string, frame: number, fw: number, fh: number): Pixels | undefined;
// host/raf-driver.ts
// View gains: readonly lights?: LightPlan;  DriverOptions gains: readonly pixels?: (id: string) => Pixels | undefined;
```
Nothing comes from `src/types/core-types.ts`.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) are identical and the smoke lines are byte-identical to the Base except the heap delta (measurement noise, e.g. +0.69 vs +0.70 MiB).

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-33i-motion-shore-live/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/motion-shore-live.test.ts` | `tests/runtime/scene/motion-shore-live.test.ts` | `b8a05b0a52ccc4fffe9cf7206ac7141443237d88163b7135625b3384aa6f0313` |
Titles they hold (exact):
- "river scroll: a scroll tile draws its motion atlas 1 px per 0.2 s, every tile on the same pose, never baked into a chunk, and moonlit swaps carry it to the night sheet (step 33i)": poses at 0/199/200/1000 ms, `dueMs` 200, atlas pixels equal `bakeMotion`'s frames in one row, the night sheet id and its bake source.
- "sway: a leafy plant loops 4 poses in 1.6 s and a plant 45 px further downwind lags one second (gusts about 45 px/s); objects[].motion overrides or clears it (step 33i)": parts `sway:4x400`, the 1 s lag, drawn poses at 16 and 64 art px.
- "shore: water edges get animated foam on fxGround by default; shore: false or liquidEdge none turns it off; reduce shows frame 0 and no motion (step 33i)": one overlay per wet chunk, off switches, reduce, reduce in the reuse key.
- "shore bake: chunks match one whole-map bake with the same foamPx (no seams), and a stale, off-map or malformed window bakes nothing (step 33i)": `foamPx: 4` on a two-chunk map against a whole-map bake; five bad ids.
- "warnings and clocks: a bad or clip-covered motion warns once per asset across tiles and rebuilds; a non-finite clock draws pose 0 with no due time (step 33i)".
- "bounds and host: baked pixels stay under BAKE_BUDGET; the canvas turns pixels into images and decodes frames; the night layer draws inside the open frame; a strip warns once per clip per asset id (step 33i)".
- "QA qfix: anchors, object offsets and the pickMotion order; shore chunks on every row, shore.ms, waterTiles per tileset, ramps in the key, digs and warnings; image and plan bounds; the driver passes lights and pixels (step 33i)" (QA G1): atlas anchor and cell size, object offsets, placement and tile overrides, shore on every chunk row with `shore.ms` and this tileset's water, ramps in the key, vertical and non-square seams, digs bump `rev`, `shoreInvalid` once, one image per id and the 120-frame drop, plans within `PLANS_MAX`, LRU touch, the driver passes `View.lights` (a new plan redraws) and `pixels`.
- "M-1, M-2 and M-3: one motion on two frame sizes bakes each at its own size; one strip clip under 65 asset ids warns 65 times once, then never; shoreInvalid is the plain code once per field, naming the field; the warned set stops at 1024 (step 33i r2)" (QA M-1–M-3).
- "M-4: link notices dedupe by code and message across frames and stop at 1024: a bad clip or a bad-ms asset rebuilt every frame warns once; more distinct notices than the cap stop at exactly 1024 (step 33i r3)" (QA M-4): 1,0,0,0,0 for a rebuilt bad strip clip and a rebuilt bad-`ms` asset; 1800 distinct notices over three calls stop at exactly 1024, and world-motion warns `shoreInvalid` once per field on its own.
- "QA r3 qfix: repeats inside one scene() call count toward the 1024 cap: 2 equal strip copies warn twice, then never; 1100 copies stop at exactly 1024, then never (step 33i r3)" (QA RM4g): 2,0,0 and 1024,0,0.
(You may add tests. The hand-back lists the shipped file's sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s33i-plants-r4.py <clone> <base clone>`: the 42 r1 plants over Rulings 1–14, 7 for QA's M-1–M-3 (M1a recipe key without the frame size, M1b bake at a fixed size, M2a strip ids clear at 64, M2b no overflow mark, M2c the warned set clears at 1024, M3a the code carries the field, M3b the message drops the field) and 5 for M-4 (M4a no dedupe across frames, M4b no cap, M4c clear instead of stop, M4d cap 1025, M4e dedupe by code only) and QA's RM4g (a same-call repeat let through after the cap). Expected: **55/55 caught, all 55 catching tests fail on the Base (+2 equivalent)**. Listed, not counted (equivalent): B7 (the shore id regex admits only digits), C1 (`plan` caches per recipe key). QA's sets via `run.py`: **all counted rule plants caught: `qa33i-plants.py` 30/32 as written + Q35/Q41 via `qa33i-plants-r2anchors.py` (`61bc95e8…`) 2/2, and QA's r2 set `qa33i-plants-r2.py` (`ceb7f631…`) 36/38 (Q5, Q34 equivalent)**; Q5 (the draw list reads the anchor from the source sheet) and Q34 (`plan` caches per recipe) are equivalent, as QA ruled. QA's r3 set: RM4g is caught by the shipped test (QA qfix r3); RM4f (within-call repeats dropped) is caught by 33h's `host-hookup.test.ts`; RM4d (the seen map also records refused notices) is equivalent through the API (only memory differs).

## Example
A river map: tiles 1 are water with `motion: { scroll: { step: 1 } }` on `tileProps["1"]`, `waterTiles: { river: [1] }`, and a style with `ramps.water`. Every water cell draws `river~m1~<key>` and steps one pixel every 200 ms; where water meets land, a `shore~1~0,0` overlay plays four foam frames at 250 ms on `fxGround`. A tree asset with `motion: { sway: { trunkFrom: 24 } }` sways on a 1.6 s loop; the tree 45 px to its right lags one second. At night the game swaps sheets with `createMoonlit` and passes `View.lights`; the river keeps scrolling on `river-night~m1~<key>` and the darkness draws over it in the same frame. With reduce motion on, nothing moves and the foam holds frame 0.

## Decisions note: what to name
Name: tile offset 0 (river reads as one stream; objects keep the `hash32(mapSeed, sheet id, c, r)` offset for non-sway parts); the atlas id form and that the moonlit swap carries it; the recipe key (`hash32` of `JSON.stringify([motion, ramps])`, cached per motion object); the shore id form and `rev`; the chunk margin `ceil(SHORE_MAX / tile size)`; the noise origin; where `waterTiles` comes from (the host loader); `present`'s `after` hook. Law 13 bounds: `BAKE_BUDGET` byte LRU; `PLANS_MAX` plans and warned keys; one shore state; the canvas's generated images (one per id, 120-frame idle drop, counted in `stats.bytes`); **≤ 1024 link notices; deduped by code+message** (across `scene()` calls; stop at 1024, never clear; the seen map is bounded by the list); strip ids **≤ 64 ids per live clip (`WeakMap`)** plus one overflow mark, then the clip is silent (no clearing); the world-motion warned set stops adding at `PLANS_MAX` = 1024 keys (no clearing); the recipe key holds the frame size (`<hash>s<fw>x<fh>`); the link keeps one previous scene. Reserved words: `self`, `phase`; no game words in the scene file.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `fx-player.ts`; `bakes.ts`; `canopy.ts`; `light.ts`; `src/core/**`; `src/fx/**`; the sim; every existing test file; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 628 tests passing and none failing, skipped or todo.
- [ ] `tests/runtime/scene/motion-shore-live.test.ts` is byte-identical to sha256 `b8a05b0a…`; 33h's `host-hookup.test.ts` (`e1dc7ffd…`) is unchanged and passes.
- [ ] Sims and every pin above unchanged; the smoke lines byte-identical except the heap delta; the four fence tests unchanged and passing.
- [ ] Each file within its cap; 150–400 changed lines in total.
- [ ] No import line changes outside the fences: `world-motion.ts` imports only `./x.ts`; `canvas2d.ts` only `../render/index.ts`; `raf-driver.ts` only the clock, `../canvas/canvas2d.ts` and `../render/index.ts`; `world-scene.ts` only `../render/index.ts` and `../../core/notice.ts`.
- [ ] `createSceneLink()` with no source behaves as in 33h (all 33h tests pass).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location above.

## Not in this step (carries, with their target step)
- **s34 (perf):** the canopy cut as a chunk overlay instead of one chunk rebuild per unit step (33h carry g: 33h already cuts the canopy through `createSeeThrough`, which QA called fine, so 33i keeps it); the light repaint, full-map plan scan and view-bounded plan (s32 carries); the driver's `images` map keyed by every asked id (generated ids now go through `pixels` first, but the map itself is unbounded); ~~the scene link's `notices` array (unbounded across a session)~~ (closed by M-4 in r3: ≤ 1024, deduped by code+message); a shore re-bake by dirty chunk after a dig instead of a full `rev` bump; a whole-system diagnosis (CEO, after s34; seams list in `/workspace/scratch-ea/integration-seams.md`).
- **33b (CN-015):** as listed in step-33-effects-sync.md (particles, lights, Feel, shake, `pixel_scale`, tint ramps, RotSprite, budgets, the screen-centre anchor); 33b effects share the `fxGround` band with shore foam (foam draws first, as it is added before effects).
- **The game side:** passing the style body in use (day or night) as `SceneWorld.style` — **a stable style object** (a fresh object each frame rebuilds the layers, QA P9; S-4) — the water tiles per tileset, `reduce` from settings, `View.lights`, and wiring `createSceneLink((id, f, fw, fh) => driver.backend.frame(id, f, fw, fh))` with `createDriver({ pixels: (id) => link.pixels(id) })`. Game rules stay out of the engine.

## Out of scope
Game rules. Format changes. core-types changes. New motion kinds. Shore on lava or other liquids.

## Open questions
1. DSK/UX: `waterTiles` and `styled` are host hints the loader derives (which tile slots are water; whether an asset's ramps come from the style). Confirm no format field is needed; otherwise CN-017.
2. UX: under moonlit, cycle ramps come from the style body the game passes (night ramps at night). Confirm night water should cycle night colours.

(r1's OQ1 is closed as Ruling 3: no CN-017, the leafy tag is `motion.sway` (CEO 👍 23:37). r1's OQ2 is closed as Ruling 1: tiles share one clock, narrowing s32 ruling 9 for tiles only (CEO 👍). r1's OQ3 is closed as Ruling 13: clip object plus asset id, capped (QA M-2).)
