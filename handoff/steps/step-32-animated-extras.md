# step-32-animated-extras: animated-world extras (renderer plan slice 32, `docs/research/renderer-research.md` §8 and §11 row 32; CEO-approved 2026-11-13 00:42; formats **CN-012** and **CN-013**, project-format **r35**). Authored **motion** baked at load in the pure render core: **colour cycle**, **slow scroll** for rivers and a subtle **leafy sway** (SpriteCook tree-wind idea, our own code), combined into one atlas (capped at 64 frames) whose cell the runtime picks from each part's own clock; **reduce_motion** draws frame 0. A **distance-field shoreline** (SpriteCook idea 4, our own code), on by default under `liquidEdge: "foam"`. A **see-through canopy**, per map, OFF by default. On the backend, step 31's light fills are painted once per plan into a reused offscreen pair and blitted in **two draws a frame** (QA N-3), glow is **additive** (`lighter`), and a NaN wash or dim counts as 0 and **drops the glow** (QA N-4). Painted water frames stay the default (CEO). No game rules, no loader.

Step id: step-32-animated-extras          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: `6e117f02ea669296d796580c871a93702abd298b` (main, the step 31 merge: PR #39, chatB plus QA fix `9b30ae8`, tree `bf758d8f`; verified PASS 573/0, `/workspace/scratch-ea/s31-verify-report.txt` sha256 `7eb7e636…`). Branch: `step/step-32-animated-extras-r<N>`, created from `6e117f0`. The PR targets `main`. Never commit to `main`.
The diff is always `6e117f0..<head>`.
Delivery (CN-003): `git bundle create step-32-animated-extras-r<N>.bundle 6e117f0..step/step-32-animated-extras-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-32-animated-extras/r<N>/` (HAND-BACK.md), committed as the branch's last commit. Quote this step file's sha256 prefix in HAND-BACK.md.
Depends on: step 31 (Base; `light.ts` `lightOps`, `LightPlan`, `darkness`), step 28/29 (`src/runtime/canvas/canvas2d.ts`), step 27 (`frames.ts` `hash32`, `types.ts` `RenderScene`, `TileLayer`); formats `handoff/change-notices/CN-012-motion-format.md` (sha256 `6a10fc48…`), `handoff/change-notices/CN-013-shore-canopy-format.md` (`b4f812f6…`), `data/project-format.md` **r35** (`ce7e9f53…`; changelog line 12; §6.2 `motion` row, §6.4 `seeThroughCanopy` and `objects[].motion`, the paint-style `shore` (incl. `ms`) and water `anim` rows, §13 `motionInvalid` and `shoreInvalid` rows). r35 carries the two 18:36 rulings this kit builds: `shore: null` = absent, and the missing-water-ramp warning (Rulings 11); profile-format r13 §3.3 (`accessibility.reduce_motion`).
Read first: CN-012, CN-013 and the project-format r33/r34 changelog; `docs/qa/step-32-review.md` (sha256 `7fd085fa…`; r1 NOT OK: F-1–F-4, nits N-1–N-6; r2 NOT OK on tests only: F-5, interpretation nits 9(a)/(b), r3 gaps 1–3, r34/CN gaps A–E, carries); `docs/research/renderer-research.md` §7–§8; `/workspace/share/renderer-refs/spritecook-tree-wind.md` and `spritecook-blog-readthrough.md` idea 4 (**ideas only; the blog code has no stated licence, write your own**).

Kit: kit-3, 2026-11-13. Engine Architect. Kit-3 follows QA's r2 NOT OK on tests only (`docs/qa/step-32-review.md`, sha256 `7fd085fa…`): it folds both QA qfixes **as is** and closes the r34 gaps. Prototyped and run on Node 24.22.1: branch `r32` = r1 `c827f9f` → QA qfix `4e43b645` (tree `5753319f`) → r2 `3e0a4c4` (tree `e1a13788`) → QA qfix-r2 `5cc03149` (tree `1488849e`; QA's own commit, fast-forwarded from its `qfix2` clone, patch-id identical to `s32-qfix-r2.patch` 85afe581) → r3 `fd1150ac` (tree `c1b94556`). `npm ci && npm run green` exits 0 with `tests 586 pass 586 fail 0`. Sim and all 20 smoke lines are unchanged. 96/96 EA plants (`s32-plants-r3.py`) are caught, and all 96 catching tests fail on the merge base. Bundle copy: `/workspace/scratch-ea/r32-r3.bundle` (`6e117f0..r32`, verified, sha256 `66794a29…`).
Carries: **no new CN in this step.** The fields are already filed (CN-012, CN-013; project-format r33–r35, issued by DSK as text and warning rulings). No core-types change (`61fad786…`); `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) are unchanged. CN-011 stays reserved for the scene-pin draft. Every function takes the **parsed** meta and params; nothing reads a project file (the host loader is the s33 carry).

> Working style: use your helper agents, take your time, and self-review against Acceptance and the QA checklist before hand-back (see BUILD_GUIDE).

## Goal
Water shimmers, rivers flow and trees breathe without hand-animating every tile, and the shoreline hugs every cove, all as frames baked once at load and picked per frame from each part's own clock (no per-frame pixel work). Night light costs two draws a frame. Players who ask for less motion see frame 0.

## Rulings
1. **Colour cycle** (`cycleFrames(img, colours)`, CN-012 `cycle`, r33 (5)): one frame per ramp colour; in frame n every opaque pixel of colour `ramp[i]` becomes `ramp[(i + n) mod len]`. Transparent pixels (alpha 0) and off-ramp pixels never change. No in-between colours. Fewer than 2 colours or a repeat bakes no cycle. Frame 0 is the input object.
2. **Ramp forms** (`bakeMotion`): under a paint style (`ctx.ramps` present) only the index form `{name, steps}` is valid: 2–8 unique 0-based indexes into the style's `ramps[name]` (dark → light), resolved to colours here. On an unstyled asset only `"#rrggbb"[]` (2–8 unique colours) is valid. Anything else is `motionInvalid`.
3. **Slow scroll** (`scrollFrames`): `size / step` frames, frame n shifted `n × step` px downstream (+x or +y), wrapping, seamless. Valid `step`: a whole number 1..size that divides the size (step = size is one frame); `axis` `"x"`|`"y"`.
4. **Leafy sway** (`swayFrames(img, trunkFrom, edge)`; r33 (7)): four poses on a one-pixel loop (rest, up, up-right, right). Rows `≥ trunkFrom` never change. Above it only outer leaves move: opaque pixels within `edge` px (4-neighbour) of a transparent pixel, **the frame border counting as transparent** (QA N-1). The still sprite stays underneath, so a moved clump never opens a hole.
5. **Motion pick** (`pickMotion(asset, tile, placement)`, CN-012): a tile's `motion` replaces the asset's whole; a placement's `objects[].motion` replaces either whole; `null` = no motion; absent (`undefined`) = inherit.
6. **Combined bake** (`bakeMotion(img, motion, ctx)`, r33 (2)): parts bake cycle → scroll → sway into one atlas, row-major, cycle outermost: cell = `(c·nScroll + s)·nSway + w`. Each part keeps its own `ms`: cycle 50–1000 (default 150), scroll 50–1000 (200), sway 100–1000 (400). Sway `trunkFrom` int ≥ 0, `edge` int 1–4 (default 2).
7. **motionInvalid** (once per asset; the host dedups by asset): a bad or out-of-range part is skipped, the other parts still bake. **Clip wins at load, per drawn cell** (r33 (1)): when `ctx.animated` (a tileset tile whose `tileProps[i].anim`, stored or derived, names a clip, including a styled water slot unless its `anim` is `null`; or a sprite with a non-empty `clips[]`; image assets never), motion is ignored on that cell and `motionInvalid` is returned with `message: ANIM_HINT`, which tells the maker to set `anim: null` (r34 (2): warn, don't block). The stored meta is never rewritten.
8. **motionTooLarge**: if the product of the valid parts' frame counts passes `MOTION_CAP` 64, all motion is skipped and the cell draws as painted (`[img]`, no parts). Exactly 64 bakes.
9. **Motion cell** (`motionCell(parts, tMs, reduce, offsets)`, r33 (2)(3)): each part's pose is `floor((t + offset) / ms) mod n` (true modulo, so negative times work); no shared tick. Sway's offset is `waveOffsetMs`, the others the instance hash (host). `reduce = true` (`accessibility.reduce_motion`) returns 0 for every part, including the shore (`kind: "shore"`, its `ms` from `shore.ms`; `SHORE_MS` = the default 250).
10. **Traveling wave** (`waveOffsetMs(xArt, loopMs, pxPerS = 45)`): the pose lags by how far downwind the plant stands: `(loopMs − (floor(x·1000/pxPerS) mod loopMs)) mod loopMs`, true modulo for negative x (QA N-6). Non-finite x, `loopMs ≤ 0` or `pxPerS ≤ 0` give 0.
11. **Shore settings** (`shoreSettings({liquidEdge, shore, ramps})` → `{on, notices}`; CN-013 `b4f812f6`, r34 (1)(3), r35 18:36 rulings): on by default when `liquidEdge` is `"foam"` (absent = `"foam"`); `shore: false` or any other edge = off (`on: null`, no warning). **`shore: null` = absent**: on with the defaults, no warning. Fields `foamPx` 1–4 (2), `shallowPx` 2–12 (6), `waveGap` 4–16 (8), `frames` 2–8 (4), **`ms` int 50–1000 (250)**, which drives the shore part (`on.part = {kind: "shore", n: frames, ms}`). Every problem is **`shoreInvalid`**, one notice `{code, field, message}` naming the field (replaces r2's `badFields`): each bad field, once, and that field uses its default; a whole value that is neither `false`, `null` nor a plain object (`true`, `[]`, a number, a string) → field `"shore"`, on with the defaults; `waveGap` not a whole multiple of `frames` → once per body, field `"waveGap"`, both use 8 and 4; **no usable water ramp** (absent, empty or a bad hex) → once per body, field `"ramps.water"`, message "no water ramp: the shore is off", and the shore is off. Colours: foam = lightest water step, wave 1 and shallow 2 steps from light; a ramp under 3 steps uses the lightest for all three.
12. **Shore distance** (`shoreDistance(land, w, h, seed, max = 32, foamPx = 2)`): chamfer 3-4 distance in px to the nearest land pixel (land 0, water ≥ 1, capped at `max`), plus up to 2 px of smooth seeded noise **only beyond the foam band** (QA F-3). `land.length` must be `w × h`, else `RangeError` (QA N-4).
13. **Shore frames** (`shoreFrames(dist, w, h, colours, opts)`): foam where `d ≤ max(1, foamPx − (f mod 2))` (it breathes, never vanishes), wave rings every `waveGap` px moving `waveGap / frames` whole px toward land per frame, shallows where `d ≤ shallowPx`; land and deep water transparent. Frame 0 is the reduce_motion frame and keeps the full foam line.
14. **See-through canopy** (`createSeeThrough()(scene, map.seeThroughCanopy)`, CN-013): per map, set by makers only, default false (absent = false). Off returns the same scene. On: above-layer tiles at each **unit's** cell and the cell above it become `null`, per tile, only for on-map cells. Stable per scene.
15. **N-3 light canvas** (`Canvas2D.lights(plan, fit, cam)`): once per plan identity, paint the plan at one px per square into two `plan.w × plan.h` canvases (darkness, glow), **reused** when the size is unchanged and **shrunk to 0** when replaced, on context restore and on dispose (QA F-1); blit both each frame (two `drawImage`s, glow `lighter`, smoothing off, scaled by `res × s`, offset by pad − camera). Only inside an open frame and not while lost. The pair's bytes (`w·h·8`) count in `stats.bytes` and the budget (QA N-2). A missing 2D context marks `missing` once per plan, not every frame (QA N-5); a failed attempt shrinks both canvases to 0, and a reused pair whose context is missing is released with its plan key, so returning to that plan repaints darkness (QA r2 nits 9(a)/(b)). **The light pair takes from the chunk budget** (`budgetBytes`, default 32 MB): 8 B per plan sample, about 230 KB on the phone map and about 8 of 32 MB on a 256×256-tile map at res 4; it is the live frame's darkness, so it is never evicted (step 34's view-bounded plan caps it).
16. **Glow** fills carry `op: "add"`, marked by the glow pass, not by colour (QA N-3 nit). **N-4**: a non-finite wash or dim counts as 0 in `darkness` and lights nothing; the plan memo compares wash and dim with `Object.is`, so a NaN input does not replan every frame (QA F-2).
17. **Purity**: flat `./x.ts` render modules, no DOM, wall time or globals. Pixels are `Uint8ClampedArray` RGBA; the host turns frames into images (s33).

## Files to create or change
- create `src/runtime/render/bakes.ts` (≤ 78)
- create `src/runtime/render/water.ts` (≤ 50)
- create `src/runtime/render/canopy.ts` (≤ 23)
- create `src/runtime/render/motion.ts` (≤ 71)
- change `src/runtime/render/index.ts` (≤ 17)
- change `src/runtime/render/light.ts` (≤ 84; rewrites in place only, no growth)
- change `src/runtime/canvas/canvas2d.ts` (≤ 134)
- create `tests/runtime/render/animated-extras.test.ts` (≤ 65)
- create `tests/runtime/render/motion.test.ts` (≤ 49)
- create `tests/runtime/canvas/light-canvas.test.ts` (≤ 34)

Nothing else changes: `types.ts`, `draw-list.ts`, `frames.ts`, `visibility.ts`, `world-scene.ts`, `raf-driver.ts` and every existing test stay as they are.

Size: 150–400 changed lines, counting insertions plus deletions (handback excluded). Kit-3 changes **390** lines (+378/−12) in 10 files; r3 alone on the qfix-r2 is +35/−34 in 6 files, nearly all in place. Caps are the qfix-r2 counts + 4 (no re-base this round). With 400 tight, kit-3 added no test: every r3 rule is asserted inside the existing four `motion.test.ts` and two `light-canvas.test.ts` tests (test verbosity was trimmed, not rules).

| File | Base → kit-3 / cap |
|---|---|
| `bakes.ts` | new → 74/78 |
| `water.ts` | new → 46/50 |
| `canopy.ts` | new → 19/23 |
| `motion.ts` | new → 68/71 |
| `index.ts` (render) | 9 → 13/17 |
| `light.ts` | 80 → 80/84 |
| `canvas2d.ts` | 111 → 130/134 |
| `animated-extras.test.ts` | new → 61/65 |
| `motion.test.ts` | new → 45/49 |
| `light-canvas.test.ts` | new → 30/34 |

If the work does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/runtime/render/bakes.ts
export type Pixels = { readonly w: number; readonly h: number; readonly data: Uint8ClampedArray };
export const SWAY_LOOP = [[0, 0], [0, -1], [1, -1], [1, 0]] as const;
export const SWAY_EDGE_PX = 2, WIND_PX_PER_S = 45;
export function cycleFrames(img: Pixels, ramp: readonly number[]): Pixels[];          // 0xRRGGBB
export function scrollFrames(img: Pixels, step: number, axis?: "x" | "y"): Pixels[];
export function swayFrames(img: Pixels, trunkFrom: number, edge?: number): Pixels[];
export function waveOffsetMs(xArt: number, loopMs: number, pxPerS?: number): number;
// src/runtime/render/water.ts
export const FOAM_PX = 2, SHALLOW_PX = 6, WAVE_GAP = 8, SHORE_MAX = 32;
export type ShoreColours = { readonly foam: number; readonly shallow: number; readonly wave: number };
export type ShoreOpts = { readonly foamPx: number; readonly shallowPx: number; readonly waveGap: number; readonly frames: number; readonly ms?: number };
export const SHORE_DEFAULTS: Required<ShoreOpts> = { foamPx: FOAM_PX, shallowPx: SHALLOW_PX, waveGap: WAVE_GAP, frames: 4, ms: 250 };
export function shoreDistance(land: ArrayLike<number | boolean>, w: number, h: number, seed?: number, max?: number, foamPx?: number): Uint8Array;
export function shoreFrames(dist: Uint8Array, w: number, h: number, colours: ShoreColours, opts?: ShoreOpts): Pixels[];
// src/runtime/render/motion.ts
export type Ramp = readonly string[] | { readonly name: string; readonly steps: readonly number[] };
export type Motion = { readonly cycle?: { readonly ramp: Ramp; readonly ms?: number }; readonly scroll?: { readonly step: number; readonly axis?: "x" | "y"; readonly ms?: number }; readonly sway?: { readonly trunkFrom: number; readonly edge?: number; readonly ms?: number } };
export type MotionCtx = { readonly ramps?: Readonly<Record<string, readonly string[]>>; readonly animated: boolean };
export type MotionPart = { readonly kind: "cycle" | "scroll" | "sway" | "shore"; readonly n: number; readonly ms: number };
export type MotionBake = { readonly frames: readonly Pixels[]; readonly parts: readonly MotionPart[]; readonly notices: readonly ("motionInvalid" | "motionTooLarge")[]; readonly message?: string };
export const MOTION_CAP = 64, SHORE_MS = SHORE_DEFAULTS.ms, ANIM_HINT = "motionInvalid: this cell already plays a clip, so its motion is ignored; set anim: null to use motion";
export const pickMotion = (asset?: Motion | null, tile?: Motion | null, placement?: Motion | null): Motion | null => …;
export function bakeMotion(img: Pixels, m: Motion | null, ctx: MotionCtx): MotionBake;
export function motionCell(parts: readonly MotionPart[], tMs: number, reduce?: boolean, offsets?: readonly number[]): number;
export type ShoreStyle = { readonly liquidEdge?: string; readonly shore?: unknown; readonly ramps?: Readonly<Record<string, readonly string[]>> };
export type ShoreNotice = { readonly code: "shoreInvalid"; readonly field: string; readonly message: string };
export type ShorePlan = { readonly on: { readonly opts: Required<ShoreOpts>; readonly colours: ShoreColours; readonly part: MotionPart } | null; readonly notices: readonly ShoreNotice[] };
export function shoreSettings(style: ShoreStyle): ShorePlan;
// src/runtime/render/canopy.ts
export const SEE_THROUGH_DEFAULT = false;
export function createSeeThrough(): (scene: RenderScene, on?: boolean) => RenderScene;
// src/runtime/render/light.ts (changed type)
export type FillOp = { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly colour: string; readonly op?: "add" };
// src/runtime/canvas/canvas2d.ts (changed type)
export type Canvas2D = Renderer & { world(scene: RenderScene, rev: number): void; lights(plan: LightPlan, fit: Fit, cam: Cam): void; busy(): boolean; dispose(): void; readonly stats: { builds: number; bytes: number; lost: boolean; missing: boolean; capped: boolean; lightBuilds: number } };
```
The render index re-exports all of the above. The `Renderer` interface does not change.

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56…`, `… win 22 lose 28 … b8007292…`), and all 20 smoke lines are byte-identical to `6e117f0`.

## Existing tests changed by ruling (and only these)
None outside this step's own files.

## Tests that prove it is done
Thirteen tests, titles starting exactly as below.
`tests/runtime/render/animated-extras.test.ts` (seven):
- **"colour cycle bake: one frame per ramp step, ramp colours rotate, other and transparent pixels never change, a bad ramp bakes no cycle (step 32)"**
- **"slow scroll bake: size/step frames, each shifted step px downstream and wrapping, so the loop is seamless; a bad step bakes no scroll (step 32)"** (incl. QA's y-direction strip)
- **"leafy sway bake: four whole-pixel poses, the trunk rows never move, no hole opens, only outer leaves move, and the frame edge counts as transparent (step 32)"**: a fully opaque 4×4 block with edge 1 sways its border and keeps its 2×2 core still (N-1).
- **"traveling wave: a plant's pose lags by how far downwind it stands, so a gust rolls across the map (step 32)"**
- **"distance-field shore: distance to land per pixel with at most 2 px of seeded smooth noise; foam breathes, waves roll toward land, shallows near shore, deep and land transparent (step 32)"** (incl. QA's single-land-pixel map for both chamfer passes, cost 3-4 and the cap, and foam on every shoreline pixel for seeds 1–6)
- **"see-through canopy is off by default; when on, it cuts the above tiles over a unit and the cell above it, per tile, and keeps the scene stable (step 32)"** (incl. QA's off-map unit)
- **"N-4 and additive glow: a NaN wash or dim counts as 0 and drops the glow; glow fills are marked add, darkness fills are not (step 32)"**
`tests/runtime/render/motion.test.ts` (four):
- **"motion: a placement replaces the motion whole (null = none, absent = inherit); parts bake into one cycle × scroll × sway atlas, each with its own ms (step 32)"**: pick table; a 2×2×4 atlas, parts `[cycle 2 @150, scroll 2 @200, sway 4 @250]`, cell (1,1,3) equals the hand-composed bake; the index ramp `{water, [1,0]}` resolves; exactly 64 frames bake; step = size is one frame; the input meta is not mutated.
- **"motionInvalid skips a bad part (every range, the ramp forms) and an animated cell ignores motion, telling the maker to set anim: null; motionTooLarge past 64 frames draws as painted (step 32)"**: 18 bad parts (cycle ms 49/1001, 1 or 9 colours, a repeat, a bad hex, an index ramp unstyled; scroll 0, 3, 1.5, axis z, ms 49; sway trunkFrom −1/1.5, edge 0/5, ms 99/1001) each give `["motionInvalid"]` and keep the good part; on a styled asset a colour list, an index past the ramp, an unknown ramp and a repeated index are invalid; `animated` → painted with `motionInvalid` and `message: ANIM_HINT`, which says "set anim: null"; 8 × 16 frames → `["motionInvalid", "motionTooLarge"]`, painted.
- **"motion cell: each part advances on its own ms with its own offset; reduce_motion draws frame 0, the shore included, whose frame 0 keeps the foam line (step 32)"**: t 0/150/450/799 → 0/16/25/29; a sway offset of 400 → 1; t −150 → 31; reduce → 0 at any t and for the shore; frame 0 foam at d 1 and 2; `waveOffsetMs(−45)` = `waveOffsetMs(−117)` = 1000.
- **"shore settings: on by default under liquidEdge foam (null = absent), off with shore false or another edge; shoreInvalid names each bad field (ms included) or a bad whole value, which use their defaults, a waveGap not a multiple of frames, or no water ramp, which turns the shore off (step 32)"**: defaults incl. `ms` 250 and the shore part, colours `{foam: step 3, wave: 2, shallow: 1}`; `shore: null` equals absent (QA plant R6); `false` and `liquidEdge: "ice"` off with no notice; no water ramp or a bad hex → off, field `ramps.water`; `foamPx` 9 and `shallowPx` 1 default with fields `[foamPx, shallowPx]` and a message naming the field, `ms` 400 reaches opts and the part; `ms` 49, 1001, 2.5, "400" → 250, field `ms`; frames 3 / waveGap 8 → 4 and 8, field `waveGap`; `true`, `[]`, 3, "yes" → defaults, field `shore`; a 2-step ramp uses the lightest; `#abc` is invalid (QA qfix-r2); foamPx 1 keeps foam on frame 1 (qfix-r2); waveGap 12 / frames 4 rings `[12,24]`, `[9,21]`, `[6,18]`, `[3,15]`; a short land array throws; an absent `seeThroughCanopy` keeps the scene.
`tests/runtime/canvas/light-canvas.test.ts` (two):
- **"N-3: light fills are painted once per plan into one offscreen pair and blitted in two draws a frame, glow with lighter, inside the 300-draw budget (step 32)"** (QA's qfix: reuse, the s = 2 blit rect at camera (16,8), smoothing off, mid-frame loss, restore, NaN build once, size change and dispose zero the pair)
- **"light canvases count in the memory budget, a missing 2D context is not retried every frame and leaves no sized canvas or stale plan, and glow is tagged by pass, not colour (step 32)"** (incl. QA qfix-r2: retried after `contextrestored`; kit-3: a failed attempt leaves both canvases 0×0, and a reused pair that loses its context drops its plan, so returning to that plan repaints)

## How a planted bug is caught (for QA; kit-3 prototype `fd1150ac`; each plant reverted after its run; `/workspace/scratch-ea/s32-plants-r3.py <r3 clone> <base clone>`; result `/workspace/scratch-ea/s32-plants-r3-result.txt`; **expected 96/96 caught, and 96/96 catching tests fail on the merge base**, a test file that cannot load on the base counting as failing every test in it)
The script holds 96 plants by group: cycle C1–C3; scroll S1–S4 (S4 = QA Q16); sway W1–W3, W5, W6 (N-1); wave T1–T3 (T3 = N-6); shore D1–D13 (D8 = F-3, D9/D10/D11 = QA Q9/Q10/Q11, D12 = N-4, D13 opts ignored); canopy K1–K6 (K6 = QA Q8); light N4a, N4b, G1, G2 (by-pass tag), F2 (QA F-2); light canvas X1–X13 (X5–X9 = QA Q1–Q5, X10/X11 = F-1, X12 = N-2, X13 = N-5); motion M1–M17; shore settings H1–H7 (H2, H4, H5 re-anchored to r3); QA r2 plants R5 (`#abc`), R10 (`free()` keeps the no-context mark), R12 (`shoreDistance` ignores `foamPx`), R13 (no 1-px foam floor), R14 (sway border left/right only); kit-3 J1–J15: `shore.ms` ignored, unranged, or not on the part (J1–J3); the animated-cell message missing or without `anim: null` (J4, J5); **`shore: null` treated as off (J6 = QA R6, now settled by a test)**; a bad whole value turns the shore off, passes as an array, or is silent (J7–J9); no water ramp silent (J10); notices not naming the field (J11, J13); the multiple rule silent (J12); a failed attempt leaving sized canvases (J14 = QA 9(a)); a cleared reused pair keeping its plan key (J15 = QA 9(b)). Each line names its catching test.

## Example
A styled river tile (`anim: null`, `motion: {cycle: {ramp: {name: "water", steps: [3, 4, 5]}}, scroll: {step: 1}}`) on a 16-px tile bakes 3 × 16 = 48 frames; the cycle steps every 150 ms and the scroll every 200 ms, independently. The same tile with the style's default `anim` is animated, so motion is ignored (`motionInvalid`). An oak with `motion: {sway: {trunkFrom: 36}}` bakes 4 poses at 400 ms; one placement with `objects[].motion: null` stands still. A lake under `liquidEdge: "foam"` gets a 2-px foam line round every cove and rings that walk in to shore over 4 frames of 250 ms (`shore: {ms: 400}` slows them); `shore: {frames: 3}` warns `shoreInvalid` (field `waveGap`) and uses 4 and 8; with reduce_motion on, everything shows frame 0 and the foam line stays. At night 4 torches cost 2 draws a frame.

## Decisions note: what to name
`motion` (not `bake`; CN-012), `bakeMotion`, `pickMotion`, `motionCell`, `MOTION_CAP`, `shoreSettings`, `SHORE_DEFAULTS`, `SHORE_MS`, `ANIM_HINT`, `ShoreNotice`, warning codes `motionInvalid`, `motionTooLarge`, `shoreInvalid` (exact). Do not use `phase` (reserved by `check:state`); "pose" and "offset" are used instead.

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/project-format.md`; `src/runtime/render/types.ts`; `frames.ts`; `draw-list.ts`; `visibility.ts`; `src/runtime/scene/**`; `src/runtime/host/**`; `src/core/**`; the sim; every existing test.

## Acceptance
`npm ci && npm run green` exits 0 with at least 586 tests passing and none failing. Sims and all 20 smoke lines are unchanged. Every pin above is unchanged. Each file is within its cap, the total is 150–400 changed lines, and the thirteen tests pass with the exact titles. Render-core purity holds. QA's plants are caught.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
**Host shell (s33):** the **host loader** that reads CN-012/CN-013 fields (asset, `tileProps[i]`, `objects[]` motion; style `ramps`, `liquidEdge`, `shore`; map `seeThroughCanopy`), decides `ctx.animated` per drawn cell, maps `notices` to warnings, turns `Pixels` into images, passes `reduce_motion` and part offsets to `motionCell`, and calls `Canvas2D.lights` after `present`. QA's host carries: **pass the same `foamPx` to `shoreDistance` and `shoreFrames`** (the default distance with foamPx 4 frames leaves 172/1000 band pixels without foam); **chunked shore bake** (a whole-map RGBA bake is 4 × W × H × 4 bytes, about 268 MB on a 256×256-tile map, and foam is on by default; bake per chunk with the neighbours' land within `SHORE_MAX`); **dedup the motion warnings to once per asset** (`motionInvalid`, `motionTooLarge`; `shoreInvalid` per body or field as ruled); **feed `motionCell` a finite clock** (`motionCell(NaN)` returns NaN, which indexes no frame); **validate the window before a dig re-bake** (`shoreDistance` throws on a wrong-length land array; the raf-driver would catch it, but the host should not rely on that). **Live canopy cut**: today one chunk rebuild per unit cell step under the canopy (QA: fine); a live cut overlay later.
**Step 34 (perf):** **the light repaint** on plan change (a moving light repaints the whole plan: about 1.0 / 3.3 ms of `lightOps` plus 792 / 1648 offscreen fills at res 8 / 4; a dirty-box repaint), **the step 31 full-map plan scan per light** (bound each light's loop to its box), and **bounding the plan to the view** (which also caps the light pair's share of the chunk budget). Also N-3 (chunk signature), N-8, the skip bound, idle rAF stop, host rev.
**Later:** gusts and spring sway (tree-wind gust patches), pine tiers, a symmetric line-of-sight variant for fog of war (`visibleCells` does not move a light out of a wall).
**DSK (r35, done):** the two 18:36 rulings kit-3 builds (`shore: null` = absent; `true`, `[]`, numbers and strings → `shoreInvalid` field `shore`, on with defaults; no usable water ramp → `shoreInvalid` "no water ramp" once per body, shore off). QA's r34/CN doc gaps A (CN-012 cite and `anim: null` message rule) and B (CN-013 pose-repeat wording) are closed in r35. Open for DSK, non-blocking: N-r3-1 (`{ms: null}` inside `shore` warns while a whole `shore: null` is absent) and N-r3-2 (with no water ramp, a bad whole value only warns `ramps.water`).

## Out of scope
Game rules. Format changes. Shaders and WebGL. Per-pixel canopy fades. Live (per-frame) pixel work.

## Answered since kit-1 (CEO 18:04 via CoS; DSK r32/r33/r34; 18:36 rulings for r35)
No `leafy` tag: tools write `motion.sway`, and makers switch it per plant with `objects[].motion`. River 1 px per 0.2 s (scroll `step` 1, `ms` 200). Sway timing as is (400 ms poses, 45 px/s wave). Foam on by default under `liquidEdge: "foam"`, off with `shore: false`. See-through canopy is per map, makers only, default false. r34: `shore.ms` is a field (int 50–1000, default 250); motion on styled water with a derived clip keeps warning `motionInvalid`, and the message says to set `anim: null`; `shoreInvalid` names each bad field. r35: `shore: null` = absent; a bad whole value and a missing water ramp are as in Rulings 11.

## Open questions
None for the CEO. DSK's r35 confirms the two shore rulings above unchanged.
