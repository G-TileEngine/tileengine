# step-27-render-core: the pure render core (CEO order 2026-11-12 20:03; plan approved 2026-11-13 00:42, slice 27 of `docs/research/renderer-research.md` §11). A new folder `src/runtime/render/` of pure functions and types: whole-number scale fit in device pixels (bigger phones see more tiles; the odd letterbox pixel goes right/bottom), a pixel-snapped camera (world positions snap to art px, the camera to device px), frame selection from the engine's `clockMs` (per-frame ms, loop, tiles in step, a derived per-instance offset from `hash32(mapSeed, assetId, c, r)`), a draw-list builder (fixed bands base → wash → fxAir → glow → ui; standing things y-sorted by feet), the draw-adapter `Renderer` interface and the dirty-flag check. No DOM, no canvas, no wall time, no rAF; everything runs in Node. The fake backend lives in `tests/` (QA ruling 2).

Step id: step-27-render-core          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `2da0d02d584c45f3cbf7002b9d914d1583de0042` (main, the step 26 merge: PR #33). Branch: `step/step-27-render-core-r<N>`, created from `2da0d02`. The PR targets `main`. Never commit to `main`.
The diff is always `2da0d02..<head>`.
Delivery (CN-003): `git bundle create step-27-render-core-r<N>.bundle 2da0d02..step/step-27-render-core-r<N>`; `git bundle verify`; upload it plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-27-render-core/r<N>/` (HAND-BACK.md), committed as the branch's last commit.
Depends on: step 26 (Base), core/clock (`stepMs` default 10, `TickInfo.simMs`), project-format §6.2/§6.3 (AssetMeta `clips[]`, `anchor`, `tileProps.anim`, `noMirror`, well-known clip names), ARCHITECTURE-v0 §12.1–12.5.
Read first: `docs/research/renderer-research.md` (§1–3, §5–7, §10–11), `docs/qa/renderer-test-research.md` (R1.2, R1.4, R3.1, R4.3), `docs/ARCHITECTURE-v0.md` §12.1, §12.2, §12.4, §12.5, `ux/effects-v2-plan.md` §13.1 and §13.8, `.dependency-cruiser.cjs`, `scripts/check-state.sh` (the reserved word `phase`).

Kit: kit-2, 2026-11-13 (r2 of the kit after QA's NOT OK on r1, `docs/qa/step-27-review.md`; test-only fixes, `src/` unchanged). Engine Architect. Prototyped and run on Node 24.22.1: branch `r2`, head `e9dda3d` = `r1` (`6d9799f`, the code) + one test commit, on `2da0d02` (`npm ci && npm run green` exit 0: `tests 529 pass 529 fail 0`; sim and all 20 smoke lines unchanged; 22/22 plants caught, and QA's extra plants 30/31 graded, the one left being X6d, a step 30 carry). Bundle copy: `/workspace/scratch-ea/r27-r2.bundle` (`2da0d02..r2`, verified).
Carries: **no CN** (see "Placement"), no new format field, no dependency, no new number in the engine. core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`) unchanged. No document format changes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
At the base:
- The engine has no renderer. `src/runtime/` holds only `input/`. Nothing turns world and project data into pixels, and nothing in the engine chooses an animation frame (the painter prototype does it on wall time; Sprite Studio uses its own `setInterval(160)`).
- ARCH §12 rules the look (integer path, whole-pixel camera, 16×16 chunks, Canvas2D behind an interface) but no code holds those rules, so nothing tests them.

This step adds the pure core every later renderer slice reads from. It draws nothing itself: it returns plain draw lists that a backend (step 28) replays.

Rulings in this step (Engine Architect, 2026-11-13):
- **Placement: `src/runtime/render/`, no CN.** `.dependency-cruiser.cjs` puts no rule on `src/runtime/**` except `runtime/input`, so the folder passes every pinned gate as is. `check-law.sh` (one clock, one frame loop, seeded RNG, no network or storage) and the eslint `src/**` rules already cover it. The tighter fence (the render core imports only its own folder) is a **test** in this step, so no pinned file changes. A depcruise rule can join the next CN that touches that pin (carry).
- **The word `phase` is reserved** (`check-state.sh`, QA G3: no direct phase writes). Animation offsets are named `offsetMs` and `instanceOffset` throughout. Do not name anything `phase`.
- **Backing store in device px** (QA [M]: a CSS-sized store gives 5/6-px art pixels at DPR 2.625/2.75). `backingSize` takes the exact device box when the host has one (`devicePixelContentBoxSize`), else `round(css × dpr)`. `fitView` takes a whole `s` (`trunc`, min 1), `artW = floor(devW / s)`, `padX = floor((devW − artW·s) / 2)`, so the odd pixel goes right/bottom (QA R5 ruling 3). `tilesW/H` are whole tiles that fit: a bigger phone sees more tiles at the same `s`.
- **Zoom steps (ARCH §12.2):** `scaleRange` gives `sMin` = the lowest whole step at which the map fills at least one axis (`ceil(min(devW/mapW, devH/mapH))`, at least 1, at most `sMax`), and `sMax` = `zoomMax` (6). `snapScale` rounds a pinch or stored zoom to the nearest step inside the range.
- **One rounding rule:** `px(v) = floor(v + 0.5)` (half up, never `-0`), used for art px and device px alike. `snapCamera` gives `devX = px(x × s)`. A draw position is `px(artX) × s − devX + padX`. World positions snap to **art px first**, so sprites and tiles share one art grid (no mixels), and only the camera moves in device-px steps (renderer-research §2).
- **Camera:** `clampCamera` keeps the view on the map and centres a smaller map; `easeCamera` is the ARCH §12.2 smoothstep on clock ms (`easeMs ≤ 0` or done means the target).
- **Frames from the one clock:** `tMs` is the engine's `clockMs`; the renderer never reads time on its own. `clipMs` takes `ms[i]`, else `1000 / fps` (fps 8 when absent, §6.2), rounded half up to whole `stepMs`, at least one step (QA/EUX: previews show the tick rounding). `frameAt` returns the sheet frame and `nextMs`, the clock ms when it next changes (`Infinity` for a static, single-frame or finished `loop: false` clip). A missing clip or empty `frames` is static frame 0 (§6.2).
- **Tiles in step, things out of step.** Every tile of one `tileProps.anim` clip uses offset 0, so water seams line up. Every standing thing with a clip (props and units) gets `instanceOffset = hash32(mapSeed, assetId, c, r) mod loopMs`: derived, stable per cell, spread over the whole loop (the Godot PR #77257 / #86210 lessons). There is **no stored field**. This is the CEO's Q3 default ("subtle sway on everything leafy, an offset per instance"). Which art sways is the art's own clip; a maker override is a DSK CN later (slice 32).
- **`hash32`** is FNV-1a 32-bit over the seed, `c` and `r` as 4 little-endian bytes each, then each UTF-16 unit of `assetId` as 2 bytes (low, high). `hash32(7, "tree", 3, 4) === 1909584459` (checked by an independent Python copy).
- **Bands and order.** `BANDS = base, wash, fxAir, glow, ui`, drawn in that order (renderer-research §6; the parent order base → wash/dim → fx air → glow → UI). `base` is ground tile layers (row-major), then the **standing band**, then the `above` tile layers (roofs, canopies; ARCH §12.1 step 5). Overlays carry their band and are sorted by band, then input order. `wash` is reserved for the night wash and stage dim (slice 31), so torches' half-size glow during dim and a per-ability "fully dark" (CEO Q2) can land there without a shape change. Glow draws carry `op: "add"`. Whether glow art is stepped (CEO Q1, final: **stepped**) is a property of the glow sprites in slice 31; nothing here depends on it.
- **Y-sort by feet.** Standing things sort by `(footY, c, kind, z, input index)`. `footY = (r + 1) × tileH + dy` (the visual foot in art px, so a walking unit sorts by where its feet are now); then the column; at a tie an object draws before a unit (ARCH §12.1); then `z`; then input order (total and stable). A sprite's anchor lands on the foot point `(c × tileW + round(tileW / 2) + dx, footY)`. The anchor is AssetMeta `anchor` (`norm` or `px`); absent or `"auto"` means bottom-centre (§6.2 default; slice 30 resolves `"auto"`).
- **Culling first.** A draw outside the view (plus one art px) is skipped *before* its frame is chosen, so an off-screen anim never sets `dueMs` and never wakes an idle frame.
- **Dirty flag (QA R5 ruling 4).** `buildDrawList` returns `dueMs`, the earliest `nextMs` of any visible anim. `needsDraw(prev, prevDueMs, next)` is true for the first frame, or when `rev` (the host's world/project revision; wired in step 29), `s`, the device size, or the snapped camera changes, or when `tMs ≥ prevDueMs`, or when the clock went back (a replay seek). An idle scene draws nothing.
- **The adapter is ARCH §12.4's `Renderer`** (`beginFrame, drawImage, fillRect, endFrame`). `drawImage` takes the sheet's asset id (the backend resolves images), the 8 integer rects, `op` and `flipX`. `present` replays a list in order. `flipX` comes from the clip fallback's mirror step in slice 30, which honours `noMirror`; here it is only passed through.
- **Per-tile commands for now.** Static tiles become chunk blits in step 28 (the backend owns the cache). The draw list here is the reference the chunked path must match.

## Files to create or change
- create `src/runtime/render/types.ts` (≤ 33), `fit.ts` (≤ 28), `camera.ts` (≤ 29), `frames.ts` (≤ 44), `draw-list.ts` (≤ 64), `dirty.ts` (≤ 17), `index.ts` (≤ 7)
- create `tests/runtime/render/fake-renderer.ts` (≤ 34): the recording test backend plus a nearest blitter for chosen device rows, and `runs()`
- create `tests/runtime/render/render-core.test.ts` (≤ 134)

Size: ≤ 400 changed lines, counting insertions + deletions (handback excluded). The per-file caps add up to 390. The prototype has 373 lines in 9 files (373+/0−), each file 1–4 under its cap (`index.ts` 6/7 and the test 133/134 are 1 under). If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/runtime/render/types.ts (the whole file)
/** Render core types (step 27). Pure data: the renderer reads these and never mutates engine state. */
/** One clip, in the project-format §6.2 AssetMeta `clips[]` shape. */
export type Clip = { readonly name: string; readonly frames: readonly number[]; readonly fps?: number; readonly ms?: readonly number[]; readonly loop?: boolean };
/** AssetMeta `anchor` (§6.2). Absent, or "auto" until slice 30 resolves it, means bottom-centre. */
export type Anchor = { readonly x: number; readonly y: number; readonly units: "px" | "norm" } | "auto";
/** A frame sheet: an asset id plus its grid. `fw`/`fh` are the frame (or tile) size in art px. */
export type Sheet = { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number; readonly anchor?: Anchor };
export type Fit = { readonly s: number; readonly devW: number; readonly devH: number; readonly artW: number; readonly artH: number; readonly padX: number; readonly padY: number; readonly tilesW: number; readonly tilesH: number };
export type Cam = { readonly x: number; readonly y: number; readonly devX: number; readonly devY: number };
/** Fixed bands, drawn in this order. "wash" holds the night wash and stage dim (slice 31). */
export const BANDS = ["base", "wash", "fxAir", "glow", "ui"] as const;
export type Band = (typeof BANDS)[number];
export type DrawOp = "normal" | "add";
export type DrawCmd = { readonly band: Band; readonly sheet: string; readonly sx: number; readonly sy: number; readonly sw: number; readonly sh: number; readonly dx: number; readonly dy: number; readonly dw: number; readonly dh: number; readonly op: DrawOp; readonly flipX: boolean };
/** A tile layer. `anims` is `tileProps.anim` resolved to clips: tile index → clip. Tiles share one offsetMs. */
export type TileLayer = { readonly sheet: Sheet; readonly tiles: readonly (number | null)[]; readonly anims?: Readonly<Record<number, Clip>> };
/** A unit or prop in the standing band. `dx`/`dy` are the art-px move offset; `flipX` comes from the clip fallback (slice 30, `noMirror`). */
export type Standing = { readonly kind: "object" | "unit"; readonly sheet: Sheet; readonly c: number; readonly r: number; readonly dx?: number; readonly dy?: number; readonly z?: number; readonly frame?: number; readonly clip?: Clip; readonly flipX?: boolean };
/** Anything drawn above the world: wash, effect air, glow or UI. `x`/`y` are top-left in world art px. */
export type Overlay = { readonly band: Exclude<Band, "base">; readonly sheet: Sheet; readonly x: number; readonly y: number; readonly frame?: number; readonly clip?: Clip; readonly startMs?: number; readonly op?: DrawOp };
export type RenderScene = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly ground: readonly TileLayer[]; readonly above: readonly TileLayer[]; readonly standing: readonly Standing[]; readonly overlays: readonly Overlay[] };
export type DrawList = { readonly cmds: readonly DrawCmd[]; readonly dueMs: number };
/** The draw adapter (ARCH §12.4). Canvas2D (step 28) and WebGL2 (later) implement it; the test backend lives in tests/. */
export interface Renderer {
  beginFrame(fit: Fit, clear: string): void;
  drawImage(sheet: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, op: DrawOp, flipX: boolean): void;
  fillRect(x: number, y: number, w: number, h: number, colour: string): void;
  endFrame(): void;
}
/** What the last drawn frame depended on. `rev` is the host's world/project revision. */
export type FrameStamp = { readonly rev: number; readonly tMs: number; readonly s: number; readonly devW: number; readonly devH: number; readonly camDevX: number; readonly camDevY: number };
// fit.ts
export function backingSize(cssW: number, cssH: number, dpr: number, exact?: { readonly w: number; readonly h: number }): { w: number; h: number };
export function fitView(devW: number, devH: number, s: number, tileW: number, tileH: number): Fit;
export function scaleRange(devW: number, devH: number, mapW: number, mapH: number, zoomMax = 6): { sMin: number; sMax: number };
export function snapScale(z: number, range: { readonly sMin: number; readonly sMax: number }): number;
// camera.ts
export const px = (v: number): number => Math.floor(v + 0.5) + 0;
export function clampCamera(x: number, y: number, fit: Fit, mapW: number, mapH: number): { x: number; y: number };
export function snapCamera(x: number, y: number, s: number): Cam;
export function easeCamera(from: number, to: number, elapsedMs: number, easeMs: number): number;
export function toDevice(artX: number, artY: number, cam: Cam, fit: Fit): { x: number; y: number };
// frames.ts
export function clipMs(clip: Clip, stepMs: number): number[];
export function frameAt(clip: Clip | undefined, tMs: number, stepMs: number, offsetMs = 0): { frame: number; nextMs: number };
export function hash32(mapSeed: number, assetId: string, c: number, r: number): number;
export function instanceOffset(clip: Clip | undefined, stepMs: number, mapSeed: number, assetId: string, c: number, r: number): number;
// draw-list.ts
export function buildDrawList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number, stepMs: number): DrawList;
// dirty.ts
export function needsDraw(prev: FrameStamp | null, prevDueMs: number, next: FrameStamp): boolean;
export function present(renderer: Renderer, fit: Fit, list: DrawList, clear: string): void;
// index.ts re-exports all of the above (and every type in types.ts); the engine root (src/index.ts) is NOT changed.
```
`src/runtime/render/**` imports only `./<file>.ts` siblings (type-only or value). It names no DOM or host global (`document`, `window`, `globalThis`, `HTMLCanvasElement`, `CanvasRenderingContext2D`, `OffscreenCanvas`, `Image`), no wall time (`Date`, `performance`), no frame loop or timer, no `Math.random`, and none of `setImmediate`, `process`, `eval`, `Function`, `Intl`, `Temporal`, `global`, `self`, `require` or `import(` (r2, QA fix 1).

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`stage-fixed seeds 1-50: win 48 lose 2 … afc89d56…`, `stage-weighted seeds 1-50: win 22 lose 28 … b8007292…`), and all 20 smoke lines are byte-identical to `2da0d02`.

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
New `tests/runtime/render/render-core.test.ts`, eight tests whose titles start exactly so (QA renderer L1 items that fit a pure core, R1.2 / R1.4 / R3.1 / R4.3):
- **"the backing store is device pixels and art pixels are s wide at DPR 1, 2, 2.625, 2.75 and 3 (step 27)":** `backingSize(390, 844, 2.625)` is `{1024, 2216}` and the exact box wins. For each DPR × CSS size (390×844, 411×731, 731×411) × `s` 1–4: right pad − left pad **and** bottom pad − top pad are each 0 or 1. A 1-px checker tileset is drawn through `present` into the fake backend (camera at 0.37 art px). The map row has **no unpainted pixel** between `padX` and `min(padX + artW·s, map right edge)` (view coverage), and every interior colour run is exactly `s` device px.
- **"bigger phones see more tiles at the same whole scale; zoom snaps to steps (step 27)":** 1170×2532 at `s` 3 gives 390×844 art px, 6×13 tiles of 64; 1290×2796 gives 6×14 at the same `s`; odd-pixel `padX` 0 / 1 (1171 / 1172 wide) **and `padY` 0 / 1 (1171 / 1172 high)**; `s` 2.7 → 2; `scaleRange(1170, 2532, 384, 576)` is `{4, 6}`; `snapScale` 2.6 → 4, 5.4 → 5, 9 → 6.
- **"the camera snaps to device pixels and nothing is drawn at half a pixel (step 27)":** half-up snaps on **both axes** (`devX` and `devY` of 0.5 at `s` 1 are 1) with no `-0`; an eased 120 ms pan at 2 ms ticks moves at most one device px per frame. Every draw has integer `dx, dy, dw, dh` with `dw = sw × s`. A unit at a fractional offset (10.5, 0.4 art px) stays a whole multiple of `s` from the tiles. Clamp and centring.
- **"frames follow clockMs with per-frame ms, fps and loop (step 27)":** water@2 (8 × 200 ms) at 0/199/200/1599/1600/3405 ms; `nextMs` 400 at 250; `loop: false` holds its last frame with `nextMs` `Infinity`; a missing `ms[i]` falls back to fps; fps 8 → 130 ms and fps 6 → 170 ms at a 10 ms step (160 at 16); missing, empty and one-frame clips are static.
- **"shared tiles stay in step and each prop gets a stable derived offset (step 27)":** every water cell shows one frame at 0/450/1234 ms; `hash32` is stable, pinned (`1909584459`), and changes with the cell and the seed; 12 offsets spread over the loop; a row of swaying trees is not in lockstep.
- **"the draw list keeps the band order and y-sorts by feet with stable ties (step 27)":** overlays given as ui, glow, wash, fxAir come out after all base draws as wash, fxAir, glow, ui; glow is `add`. Standing order: row before row, then column, an object before a unit on its own tile **even when the unit has `z: -1`** (kind sorts before `z`), then `z`, then input order; a unit walking down (dy 20) sorts by its feet. `above` layers draw after the standing band. The anchor default, `"auto"`, `norm` and `px`.
- **"the dirty flag redraws on state, camera, size and anim ticks, and skips idle frames (step 27)":** `dueMs` 400 with water on screen; `Infinity` with no anim, and with an anim tile, an anim prop **and an anim overlay** off screen. An overlay clip runs from its `startMs` (start 100, clock 350 → frame 9, `dueMs` 500). `needsDraw` is false for an idle frame before `dueMs` and for a static scene, and true on the first frame and on each of: `rev` up **or down**, `tMs ≥ dueMs`, clock back, `s`, `devW`, `devH`, `camDevX`, `camDevY`. `present` calls begin, one draw per command, end.
- **"the render core stays pure: no DOM, no wall time, no frame loop, imports only its own folder (step 27)":** `src/runtime/render/` holds only flat `.ts` files (a subfolder is a named failure, not an `EISDIR` crash). Each file is read with comments stripped **string-aware** (a `"//"` inside a string does not hide the rest of the line). Every `from`/`import` specifier in `"`, `'` or a backtick must be `./<file>.ts`; **`import(` is forbidden outright**. The forbidden names are the list above plus `setImmediate`, `process` (covers `process.hrtime` and `process.getBuiltinModule`), `eval` (covers indirect `(0, eval)`), `Function`, `Intl`, `Temporal`, `global`, `self`, `require`.

## How a planted bug is caught (for QA; prototype `e9dda3d`; reverted after each; `/workspace/scratch-ea/s27-plants.py <clone>` and QA's `/workspace/qa-runs/step-27-review/tools/extra-plants.py <clone>`)
| Plant (intent) | Named test |
|---|---|
| F1 the backing store is sized in CSS px (no DPR); F2 the exact device box is ignored | the backing store is device pixels … |
| F3 the odd letterbox pixel goes left/top | bigger phones …; the backing store … |
| F4 a fractional scale is allowed | bigger phones … |
| C1 the camera keeps half device px | the camera snaps … |
| C2 sprites skip the art-px snap (device px = round(artX × s)), giving mixels | the camera snaps … |
| A1 per-frame `ms` is ignored | frames follow …; the dirty flag … |
| A2 `loop: false` still loops | frames follow … |
| A3 shared tiles get a per-cell offset | shared tiles stay in step …; the dirty flag … |
| A4 props sway in lockstep (offset 0); A5 the hash ignores the map seed | shared tiles stay in step … |
| Y1 the y-sort ignores the column; Y2 a unit draws before the object on its tile; Y3 the last tiebreak is reversed; Y4 overlays are not sorted into bands; Y5 a `norm` anchor is read as px | the draw list keeps the band order … |
| D1 a state change (`rev`) does not mark dirty (QA b); D2 an anim tick does not mark dirty (QA b); D3 the draw list drops its due time; D4 an off-screen anim wakes the frame (frame picked before the cull) | the dirty flag … |
| U1 a host global in the core; U2 an import from outside the folder | the render core stays pure … |
| **QA extras (r2):** X1 `rev` going back is not a redraw; X2 the anim tick is off by one (`>` due); X3 an idle frame draws; X7 an overlay frame is picked before the cull; X7b the cull is off; X8 an overlay's `startMs` is ignored; X10 a clock going back is not a redraw | the dirty flag … |
| X4 camera Y is not snapped | the camera snaps … |
| X5 the odd letterbox pixel goes top; X5b … left | bigger phones …; the backing store … |
| X7c the cull is one tile too tight on the right (unpainted strip) | the backing store … (view coverage) |
| X6 `z` sorts before kind; X6b the y-sort ignores `z`; X6c `footY` ignores `dy`; X9 `above` drawn before the standing band | the draw list keeps the band order … |
| U3 a `"//"` string hides an outside import; U4 a backtick dynamic `import()`; U6 a type-only import from core; U7 a re-export through index; U8 a multi-line `from`; U9 a `./../` path; U10 a subfolder; U11 `self`; U12 `process.hrtime`; U13 `setImmediate`; U14 `process.getBuiltinModule`; U15 `Intl` date; U16 indirect `eval`; U17 rAF; U18 `performance.now`; U20 src imports the fake renderer | the render core stays pure … (U11/U17/U18/U20 also by tsc, eslint, check:law or depcruise) |
| U5 `import x = require(…)` | the test file fails to load; tsc and eslint (`erasableSyntaxOnly`) fail green |

All 22 official plants fail their named tests (22/22). QA's extras on `e9dda3d`: **30/31** graded caught, plus probes X7c and X8 (now tests) and U5 (caught by tsc/eslint). **Not caught by design:** X6d (`dx` breaks ties before the column), which is not a bug against this file (step 30 carry). Probes U19 (core imports render: depcruise + eslint) and U21 (sim imports render: allowed today; next pin CN). QA's repro `export const sep = "//"; import "../../core/plain.ts";` in `camera.ts` makes green fail (exit 1, the purity test) on `e9dda3d`; it passed green on r1. **Greps:** `rg -n -w phase src/runtime/render` prints nothing; `rg -n 'from "\.\./' src/runtime/render` prints nothing; `git diff --name-status 2da0d02..<head> -- . ':!handback'` lists exactly the 9 `A` files; pins unchanged.

## Example
```ts
const dev = backingSize(390, 844, 2.625);                        // { w: 1024, h: 2216 }: device px, never CSS px
const fit = fitView(dev.w, dev.h, 3, 16, 16);                    // artW 341, artH 738, padX 0 (odd px right), padY 1
const cam = snapCamera(10.37, 0, fit.s);                         // devX 31: the camera moves in device px
frameAt(water, 3405, 10);                                        // { frame: 9, nextMs: 3600 }: from clockMs only
const list = buildDrawList(scene, fit, cam, clockMs, 10);        // { cmds: [base…, wash…, fxAir…, glow…, ui…], dueMs }
if (needsDraw(prev, prevDueMs, stamp)) present(backend, fit, list, "#000");   // idle frames draw nothing
```

## Decisions note: what to name
- That the folder is `src/runtime/render/` with no CN, because no pinned rule covers it, and that the own-folder fence is a test (a depcruise rule is a carry for the next pin CN).
- That `phase` is reserved by `check:state`, so offsets are `offsetMs` / `instanceOffset`.
- The rounding rule (half up, art px first, then the camera in device px), the odd letterbox pixel (right/bottom), and the `sMin` reading.
- The defaults: tiles in step; every standing clip offset by `hash32` (CEO Q3); fps 8; ms rounded to whole steps.
- That no format field was added: `Clip` is the §6.2 `clips[]` shape; `anchor` is §6.2; `TileLayer.anims` is `tileProps.anim` already resolved to clips (slice 30); `flipX` is the output of the `noMirror`-aware fallback (slice 30).
- That `wash` is a reserved band (slice 31), and glow is only `op: "add"` here (stepped glow, CEO Q1, is slice 31's art).
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- Everything outside the 9 new files: `src/**` (including `src/index.ts`, `src/runtime/input/**`, core, clock), `tests/**` other than `tests/runtime/render/`, `docs/**`, `handoff/**`, `scripts/**`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `BUILD_GUIDE.md`, `tsconfig.json`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**` (including `ui-shell/` and `painter-proto/`), `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 529 (521 + the 8 new tests). `src/runtime/render/**` is byte-identical to r1 (`6d9799f`): r2 changes only the test file.
- [ ] `npm run sim` prints exactly the base's two lines; all 20 smoke lines are byte-identical to `2da0d02`. Pins unchanged (`61fad786…`, `1e5dd82c…`, `45a3dbaa…`, `4d7bbf48…`, `d7f64a09…`).
- [ ] `git diff --name-status 2da0d02..<head> -- . ':!handback'` lists exactly the 9 files above, all `A`. ≤ 400 changed lines, each file within its cap.
- [ ] The eight titles above exist verbatim and pass; with each plant in the table applied (revert after), its named test fails.
- [ ] The bundle verifies; the tip is the hand-back commit; nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
- **Step 28, the Canvas2D backend:** the `Renderer` implementation, 1× chunks (static tiles become chunk blits matching this step's list), the LRU, `imageSmoothingEnabled = false` after every resize (QA [M]), context-loss rebuild. **Clip drawing to the art rect** (QA r1 carry: partial edge tiles paint into the 1-px letterbox, e.g. devW 1172, `s` 3, padX 1, camera devX 1 → a tile at dx 0); `imageSmoothingEnabled = false` after every resize. QA L2/L3 tools live in their own folder and package, outside the main `package.json` (QA ruling 1).
- **Step 29, the host frame driver:** `raf-driver.ts` maps the rAF time to engine ticks (the core never sees rAF; QA ruling 5); the `rev` counter for `needsDraw`; dirty-driven drawing on rAF with an optional host cap at 60 and no cap by default (QA ruling 7); visibility pause; debug timing via the host/`DebugPort`; the **bulk clock step** (step 25 clock pile-up carry). QA done-means (a): the device run at the panel's real rate (120 Hz, 8.3 ms) and with the 60 cap.
- **Step 30, the world → scene adapter:** builds `RenderScene` from world and project data (read only): `tileProps.anim` → `anims`, AssetMeta `anchor` (resolving `"auto"`), the ARCH §12.9 clip fallback (mirror → `flipX`, honouring `noMirror`), move offsets. Whether a walking unit's offset key is its current cell (as here) or a stable key such as its spawn cell is decided there.
- **Step 31, light and glow:** the darkness buffer in the `wash` band (moonlit wash + stage dim, combined cap), light holes, emissive punches. **CEO Q1 final: stepped pixel glow, not a soft blur.** **CEO Q2:** torches keep a half-size glow during stage dim by default, and an ability can choose fully dark; where that per-ability flag lives may need a DSK CN. **CEO Q5:** moonlit is a colour swap plus the night layer, with no tint. QA done-means (c): the palette check exempts only the named fade / see-through ops at the fixed alpha steps.
- **Step 32, animated-world extras:** colour-cycle and river-scroll bakes, sway bake, a maker offset override (**DSK CN**), the Layer chip (**DSK CN**), canopy see-through as a named op (**CEO Q4: OFF by default**).
- **Next pin CN (Architect):** a depcruise rule `render-imports-only-own-folder` (today enforced by this step's test; deliberately obfuscated code can beat any grep test), and say who may import render (today `sim → render` is allowed, QA probe U21). **Repo-wide check-law / eslint (same CN):** the one-clock lists miss `setImmediate` and `process.hrtime` / `process.uptime`.
- **Step 30 (QA r1 carries):** build `standing` in a stable documented order (units by id, objects by document index), because the last sort key is input order; decide the walking-unit offset key (keyed to the current cell, a unit's animation jumps when it crosses a cell); decide whether `dx` breaks ties before `c` for units walking sideways (QA X6d); define an overlay before its `startMs` (today a looping clip wraps a negative time and plays as if started: not drawn, or frame 0).
- **Step 31:** the palette-exemption rule (only the named fade / see-through ops at the fixed alpha steps).
- **Step 34, perf:** frame-build allocation budgets: `clipMs` allocates an array per `frameAt` call (cache per clip), and culled standing things still pay `anchorPx` + `instanceOffset` before the cull (QA nits 1 and 3).
- **Effects v2:** the §13.1 "dim draws before units" wording, to be updated for the shared wash band (renderer-research §6); QA's particle caps vs §13.3 (pool 96, 48 per effect).
- **UX (outside the repo):** Sprite Studio's night preview (multiply tint `#6a7cb4`, `setInterval(160)`) moves to the one engine player and the moonlit swap (Effects v2 §13.8).

## Out of scope
- Any DOM, canvas, image decoding, chunk cache, host loop or input; any change to the clock, core-types, project reader or a format; any game rule; any glow look, light model or palette work; atlas packing, map-editor decor props, autotiles (parked).
