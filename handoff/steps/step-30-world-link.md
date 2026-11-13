# step-30-world-link: the world → picture link (renderer plan slice 30, `docs/research/renderer-research.md` §11 row 30; CEO-approved 2026-11-13 00:42). One new pure file, `src/runtime/scene/world-scene.ts`, turns world state (map layers, units, objects, overlays) plus loaded assets into the render core's `RenderScene`, and keeps that scene object **stable** while nothing changed, so a still picture settles to 0 draws a second. It also folds in the format rulings **project-format r27** (off-size tiles bottom-left anchored, not clipped; CEO 13:20, direct), **r26** (clip `ms[]` and `fps`; DSK), **r28** (the warning names `clipMsLength` and `clipFpsIgnored`) and **r29** (an invalid `ms[]` is ignored whole, warning `clipMsInvalid`; DSK), and the step 29 carries from `docs/qa/step-29-ab.md`.

Step id: step-30-world-link          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `09f3028e6c3e7b6058d1ed8f0f836a73c30ddc32` (main, the step 29 merge: PR #37, chatB, code `b9dc457`; verified PASS 548/0). Branch: `step/step-30-world-link-r<N>`, created from `09f3028`. The PR targets `main`. Never commit to `main`.
The diff is always `09f3028..<head>`.
Delivery (CN-003): `git bundle create step-30-world-link-r<N>.bundle 09f3028..step/step-30-world-link-r<N>`; `git bundle verify`; upload it plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-30-world-link/r<N>/` (HAND-BACK.md), committed as the branch's last commit. Quote this step file's sha256 prefix in HAND-BACK.md.
Depends on: step 29 (Base; `src/runtime/host/raf-driver.ts`, `Clock.skip`), step 28 (`src/runtime/canvas/canvas2d.ts`, the chunk cache), step 27 (`src/runtime/render/**`), `src/core/notice.ts` (`Notice`), project-format **r29** (`data/project-format.md` sha256 `c7cd04f4…`; r27 `343a72e9…` and r28 `e45d6932…` are earlier revisions of the same file: §6.2 `tile {w, h}` row and `clips[]` row, §7.3 clip fallback, §8 `layers[]`).
Read first: `data/project-format.md` (revision log r26–r29; §6.2 rows `tile {w, h}` and `clips[]`; §7.3), `docs/qa/step-30-review.md` (r1: F-1, F-2, nits N-1–N-8), `docs/qa/step-29-ab.md` (nits and the s30 carry), `handoff/steps/step-29-frame-driver.md` (Carries → Step 30), `src/runtime/render/draw-list.ts`, `src/runtime/render/chunk-plan.ts`, `src/runtime/render/frames.ts`, `src/runtime/host/raf-driver.ts`.

Kit: kit-2, 2026-11-13. Kit-2 follows QA's r1 NOT OK (`docs/qa/step-30-review.md`: F-1 notices repeated on every assets rebuild; F-2 test gaps in the chunk gate, the culling widen and the stable-scene key) and DSK's r29 ruling on invalid `ms[]` entries. Engine Architect. Prototyped and run on Node 24.22.1: branch `r2`, head `e04de4a` = r1 (`ca27193`) + one commit, on `09f3028`. `npm ci && npm run green` exit 0: `tests 563 pass 563 fail 0`. Sim and all 20 smoke lines unchanged. 74/74 EA plants caught. Bundle copy: `/workspace/scratch-ea/r30-r2.bundle` (`09f3028..r2`, verified, sha256 `22d88068…`).
Carries: **no CN**, no new format field, no dependency, no `tsconfig` change. r26, r27, r28 and r29 are text-only format rulings (render rules; no field, type or version change). core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) are unchanged. The project reader is unchanged.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
At the base:
- Nothing builds a `RenderScene` from the world. A host that builds a new scene object every frame bumps `rev` every frame: 60 draws a second on a still picture (step 29 carry, QA r1).
- Off-size tiles are drawn top-left and their rows are not culled for overflow. **project-format r27** (CEO 13:20, direct; replaces r26's top-left confirmation and K1's clip) rules: an off-size tile is drawn at native size with its **bottom-left corner on the cell's bottom-left**, never stretched and **never clipped**; a taller tile overflows up into the rows above, a wider one right; per layer, rows are drawn top to bottom and left to right within a row, so a lower row covers an upper row's overflow (Tiled's right-down order).
- `clipMs` falls back to fps for frames past a short `ms[]`; an empty `ms[]` or a bad `fps` is not handled. **project-format r26** (DSK) rules: (1) a short `ms[]` pads with its last value, a long one is cut to `frames.length`, an empty one counts as absent (fps); (3) `fps` is any finite number > 0 (fractions allowed, e.g. 2.5), absent means 8; 0, negative, non-finite or non-number gives warning `clipFpsInvalid` (never an error, never fails the load), the clip plays at 8, and the stored value is kept as-is.
- An overlay before its `startMs` is drawn (clip frame 0). A walking unit's animation phase is keyed by its cell, so it jumps each time the unit changes cell.
- Step 29 nits (`docs/qa/step-29-ab.md`): a `visibilitychange` before `start()` starts the loop; the `skip` RangeError says "advance"; the sub-ms carry (`frac`) survives a hide; `clock.ts` is at its 142 cap. The dtMs a `skip` reports to render subscribers is unpinned.

This step adds the link and closes those gaps. It has no game rules, no image decoding, no WebGL and no light look.

Rulings in this step (Engine Architect, 2026-11-13, unless marked):
- **Placement: `src/runtime/scene/world-scene.ts`, no CN.** A new folder; it imports only `../render/index.ts` and the type `Notice` from `../../core/notice.ts`. No depcruise rule covers `src/runtime/scene/**` yet (carried to the next pin CN). It must not import sim, state or any game module; it takes **structural inputs** only (`SceneWorld`). Game rules stay out: no hp, cost, phase, damage or deck words; the host decides which `action` a unit is showing.
- **Inputs.** `SceneWorld` = map size, tile size, `mapSeed`; `assets` (id → `SceneAsset`: a host-built `Sheet`, `clips`, `tileProps`, `noMirror`); `layers` (§8 shape: `tileset`, `aboveUnits`, `visible`, `tiles`); `units` (the `UnitState` fields plus `sprite` and an optional `action`); `objects` (`assetId`, `at`, optional `z`); `overlays` (render `Overlay`, passed through). The **host builds `Sheet` geometry** (columns, frame size, a resolved `"auto"` anchor) from AssetMeta plus the decoded image; the link does not measure images.
- **Layers.** `visible: false` and `tileset: null` (or an unknown tileset) drop. `aboveUnits` goes to `above`, the rest to `ground`, in document order. `tileProps[tile].anim` names a clip of the same asset; it becomes the layer's `anims[tile]`.
- **Stable scene (the 60 draws carry).** `createSceneLink()` keeps the previous `RenderScene` and returns **the same object** when nothing it depends on changed: the `assets` and `layers` objects (identity), the `objects` and `overlays` arrays (identity; **two empty arrays count as equal**, so a host passing a fresh `[]` each frame still settles, r2 N-2), and a units key: each shown unit's `[id, sprite, c, r, dx, dy, facing, action]` as `JSON.stringify` (so ids containing `|`, `,` or `;` cannot alias another world, r2 N-1), joined after the map size, tile size and seed. A new `layers` or `assets` identity always rebuilds the layers and the scene. Layers are rebuilt only when `layers` or `assets` changes identity, so a moving unit reuses the same `ground`/`above` arrays (and the backend's chunk cache keeps its signatures). The host keeps those identities stable between world revisions; a still world then gives 0 draws a second through the step 29 driver.
- **Standing order (stable).** Objects in document order, then shown units sorted by `id` (code-unit order). The render core then y-sorts by feet with its existing ties (`c`, kind, `z`, index). **X6d: `dx` does not break ties before `c`.** Two standings on the same feet row order by cell column, even when a walking unit's `dx` has moved it past its neighbour; this keeps the order from flickering mid-walk.
- **Walking-unit offset key.** A unit's standing carries `key: id`. When `key` is set, the render core seeds the animation offset from `sheet.id + "#" + key` (cell 0,0) instead of the cell, so a unit keeps its animation phase across cells. Objects and tiles keep the cell seed. `Standing.key?: string` is the only render type change.
- **Unit offset.** `offset` is in tile fractions (`UnitState`); the link writes `dx = offset.dx · tileW`, `dy = offset.dy · tileH` in art px.
- **Shown units.** `alive` units, plus a not-alive unit whose `action` is `"die"` (so the die clip can play); others drop. A unit whose `sprite` is not in `assets` drops.
- **Clip fallback (format §7.3), `pickClip(asset, action, facing)`.** Facing `N/E/S/W` maps to `up/right/down/left` (`null` → down). For each action in the chain (`action`, then `idle`; `die` → `hit` → `idle`; `idle` alone): (1) exact `action-facing`, and for `move` also the bare facing name; (2) the mirrored side (`left` ↔ `right`) with `flipX`, unless the asset has `noMirror`; (3) `action-down`, bare `action`, `action-left`, `action-right`, `action-up`. If nothing matches: the first frame of the first clip, or frame 0. **§7.3 step 5's runtime fade and step 7's procedural stand-in token are host presentation and are carried.** Any action without clips falls back to idle (open question 2).
- **r26 clip rules (DSK, project-format r26; the 'pending DSK' marks are dropped).** `clipMs` in `frames.ts`: `fps` is used only if it is a finite number > 0, else 8; `ms[]` is used only if non-empty and valid (r29, below); frame `i` uses `ms[min(i, ms.length − 1)]`; the map is over `frames`, so a long `ms[]` is cut. The link emits warnings into `notices` **once per asset object**, tracked in a `WeakSet<SceneAsset>`, so a host that rebuilds the `assets` record as sheets load does not repeat them (r2, QA F-1: 20 rebuilds give 1 warning): `clipFpsInvalid` (r26), `clipMsLength` when a non-empty `ms[]` length ≠ `frames.length`, and `clipFpsIgnored` when a non-empty `ms[]` and `fps` are both set (names: **project-format r28**). An empty `ms[]` raises neither (it counts as absent). `Notice.code` is a string, so no CN. Clips are passed through **unchanged** (the stored value is kept); the render core applies the fallback. The stored `ms[]` is never rewritten. r28 allows the padding at play time in the render core; moving it (and the warnings) into the project reader is a later carry. The project reader is not changed.
- **r29 invalid `ms[]` (DSK, project-format r29 `c7cd04f4`).** If any `ms[]` entry is not a whole number ≥ 1 (NaN, non-finite, 0 or below, fractional, or a non-number), the whole `ms[]` is ignored and the clip plays by `fps` (8 if `fps` is missing or invalid). One predicate, `badMs(ms)` in `frames.ts` (exported through `render/index.ts`), is used by both `clipMs` and the link. The link warns **`clipMsInvalid` once per clip object** (a `WeakSet<Clip>`, so the editor can point at the clip; the same clip in a rebuilt or second asset does not warn again), and checks it **before** the length check: an invalid `ms[]` raises neither `clipMsLength` nor `clipFpsIgnored`. `clipFpsInvalid` is independent. The stored value is never rewritten.
- **r27 off-size tiles (CEO, project-format r27).** In `draw-list.ts`: a tile's y is `(r + 1) · tileH − sheet.fh` and its x is `c · tileW`, at native size. Culling widens to the **rows below** (`r1 = ceil((viewY1 + fh) / tileH)`) and keeps the **columns to the left** (`c0 = floor((viewX0 − fw) / tileW)`), so a tile whose cell is offscreen still draws its overflow. Rows run top to bottom, columns left to right.
- **Chunk-edge overflow: off-size layers are never chunked (chosen; no code change).** `chunkedList` already draws any layer whose sheet size ≠ the tile size live through `buildDrawList`, and a layer has one sheet, so a layer is either all cell-sized (chunked, no overflow possible) or all off-size (live, overflow drawn across any chunk edge). The alternative, padding chunk canvases by the overflow and drawing neighbours' overflow into each chunk, needs cross-chunk signatures and draw-order stitching between chunks; it is a perf question for step 34 (off-size tiles are rare: the Warn row in §6.2). A test pins the live path across a chunk edge.
- **Odd-width anchor rounding (QA A/B carry 4).** The r27 anchor is exact integer art px (no rounding): a 17×21 tile at cell (2,3) on 15-px tiles is at art (30, 24), device (60, 78) at s 2. A standing sprite centred on an odd tile lands on a half art px (`c·tileW + px(tileW/2) − fw/2`), which `toDevice` rounds half up in **art px before scaling**: a 15-px sprite at cell (0,0) on 15-px tiles is at device x 2 at s 2. The test pins both.
- **K2 (step 28 test gap).** Animated tiles are never baked into chunks (`isStatic`). The new test puts water in uncovered cells (no opaque `above` tile over them), checks the chunked picture equals the live one at t 0 and t 200, and checks the water pixel changes frame.
- **Overlay before `startMs`.** Not drawn. If it is on screen, it lowers `dueMs` to `startMs` so the driver wakes for it; an offscreen one does not (r2, QA N-4).
- **Step 29 carries (QA A/B).**
  - `raf-driver.ts`: a `live` flag set by `start()`; `onVis` requests a frame only if `live`, so a `visibilitychange` before `start()` does not start the loop.
  - On hide, `frac = 0` as well as `lastTs = null`.
  - The view back-off also expires when `ts < brokeAt` (a backwards rAF clock), not only after 1000 ms (R3-N1 itself is already in the merged build: `broken = NaN` after a good `view()`).
  - `clock.ts`: the `skip` RangeError says `"skip: ms must be an integer >= 0"`. **dtMs after a skip (user ruling): render subscribers get the skipped host time** (`render(ms)`, not clamped to `maxFrameMs`); a comment and a test pin it.
  - **`clock.ts` cap: trimmed, not re-based.** The `tell` helper is folded to one line: 142 → 139 lines.

## Files to create or change
- create `src/runtime/scene/world-scene.ts` (≤ 88; **cap re-based in kit-2** from 86: the r29 `clipMsInvalid` line and the empty-array rule)
- change `src/runtime/render/draw-list.ts` (≤ 66; r27 anchor and culling, the standing key, overlay before start)
- change `src/runtime/render/frames.ts` (≤ 50; `clipMs` and the r29 `badMs` predicate; **cap re-based in kit-2** from 48)
- change `src/runtime/render/index.ts` (≤ 11; export `badMs` only; added in kit-2)
- change `src/runtime/render/types.ts` (≤ 35; `Standing.key` only)
- change `src/runtime/host/raf-driver.ts` (≤ 90; `live`, `frac` on hide, `ts >= brokeAt`)
- change `src/core/clock/clock.ts` (≤ 142; the `skip` message, the dtMs comment, the folded `tell`)
- change `tests/runtime/render/render-core.test.ts` (≤ 129; the two lines changed by ruling only)
- change `tests/runtime/host/raf-driver.test.ts` (≤ 157; **cap re-based** from 153: the rig gains an optional `clock` and one new test pins the step 30 driver and clock carries)
- create `tests/runtime/scene/world-scene.test.ts` (≤ 140; **cap re-based in kit-2** from 128: QA's 4 F-2 lines filled the r1 cap, then the r29 test (5 lines) and the N-1/N-2 lines (2) were added; the other nit checks share existing lines)

Size: ≤ 400 changed lines, counting insertions plus deletions (handback excluded). The kit-2 prototype changes 273 lines (+250/−23) in 10 files (r2 alone: +33/−17 in 5 files):

| File | Lines / cap |
|---|---|
| `world-scene.ts` | 84/88 (re-based) |
| `draw-list.ts` | 62/66 |
| `frames.ts` | 46/50 (re-based) |
| `index.ts` (render) | 7/11 |
| `types.ts` (render) | 31/35 |
| `raf-driver.ts` | 86/90 |
| `clock.ts` | 139/142 (trimmed from 142; cap unchanged) |
| `render-core.test.ts` | 125/129 |
| `raf-driver.test.ts` | 153/157 (re-based, reason above) |
| `world-scene.test.ts` | 136/140 (re-based) |

Caps are the proto + 4, except `clock.ts`, which keeps its step 29 cap. Kit-2 re-bases `world-scene.ts`, `frames.ts` and `world-scene.test.ts` to the r2 proto + 4 (reasons above). If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/runtime/scene/world-scene.ts (exports)
export type SceneAsset = { readonly sheet: Sheet; readonly clips?: readonly Clip[]; readonly tileProps?: Readonly<Record<string, { readonly anim?: string }>>; readonly noMirror?: boolean };
export type SceneLayer = { readonly tileset: string | null; readonly aboveUnits: boolean; readonly visible: boolean; readonly tiles: readonly (number | null)[] };
export type SceneUnit = { readonly id: string; readonly sprite: string; readonly at: { readonly c: number; readonly r: number }; readonly offset: { readonly dx: number; readonly dy: number } | null; readonly facing: "N" | "E" | "S" | "W" | null; readonly alive: boolean; readonly action?: string };
export type SceneObject = { readonly assetId: string; readonly at: { readonly c: number; readonly r: number }; readonly z?: number };
export type SceneWorld = {
  readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number;
  readonly assets: Readonly<Record<string, SceneAsset>>; readonly layers: readonly SceneLayer[];
  readonly units: readonly SceneUnit[]; readonly objects: readonly SceneObject[]; readonly overlays: readonly Overlay[];
};
export type SceneLink = { scene(world: SceneWorld): RenderScene; readonly notices: readonly Notice[] };
export function pickClip(asset: SceneAsset, action: string, facing: SceneUnit["facing"]): { readonly clip?: Clip; readonly frame?: number; readonly flipX: boolean };
export function createSceneLink(): SceneLink;
// src/runtime/render/types.ts (changed)
export type Standing = { readonly kind: "object" | "unit"; readonly sheet: Sheet; readonly c: number; readonly r: number; readonly dx?: number; readonly dy?: number; readonly z?: number; readonly frame?: number; readonly clip?: Clip; readonly flipX?: boolean; readonly key?: string };
// src/runtime/render/index.ts (changed line)
export { badMs, clipMs, frameAt, hash32, instanceOffset } from "./frames.ts";
// src/runtime/render/frames.ts (new export, r29; re-exported from render/index.ts)
export const badMs = (ms: readonly unknown[] | undefined): boolean => ms !== undefined && ms.some((v) => !(Number.isInteger(v) && (v as number) >= 1));
// src/runtime/render/frames.ts, clipMs body
  const fps = typeof clip.fps === "number" && Number.isFinite(clip.fps) && clip.fps > 0 ? clip.fps : 8, ms = clip.ms !== undefined && clip.ms.length > 0 && !badMs(clip.ms) ? clip.ms : null;
  return clip.frames.map((_, i) => Math.max(1, px((ms === null ? 1000 / fps : ms[Math.min(i, ms.length - 1)] ?? 0) / stepMs)) * stepMs);
// src/core/clock/clock.ts, skip
  throw new RangeError("skip: ms must be an integer >= 0");
  render(ms); // step 30 ruling: render subscribers get the skipped host time as dtMs (not clamped to maxFrameMs)
```
`src/index.ts` (the engine root) is NOT changed; the host imports the link by path. The driver's public types are unchanged.

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`stage-fixed seeds 1-50: win 48 lose 2 … afc89d56…`, `stage-weighted seeds 1-50: win 22 lose 28 … b8007292…`), and all 20 smoke lines are byte-identical to `09f3028`.

## Existing tests changed by ruling (and only these)
- `tests/runtime/render/render-core.test.ts`, "frames follow clockMs with per-frame ms, fps and loop (step 27)": `clipMs(mixed, 10)` (a 3-frame clip with `ms: [200]`) expects **`[200, 200, 200]`** (was `[200, 130, 130]`; r26 pads with the last value).
- Same file, "the draw list keeps the band order and y-sorts by feet with stable ties (step 27)": the `wide` helper's 32×32 tile moves from cell index 0 to index 4 (`[null, null, null, null, 1, ...11 nulls]`, cell (0,1)). The expectation `[true, true, true, false]` is unchanged; under the r27 bottom-left anchor it now pins the left-column widening (a tile at row 0 would overflow above the map).
Nothing else in either test changes.

## Tests that prove it is done
New `tests/runtime/scene/world-scene.test.ts`: fourteen tests whose titles start exactly as given below, plus one new test at the end of `tests/runtime/host/raf-driver.test.ts`.

The fixture: sheet rasters where every pixel is unique (sheet salt, frame index, x and y in the frame), so a wrong frame, offset or flip shows; a `picture()` helper that draws one frame through the real `canvas2d` on a `FakeCanvas`, either chunked (`chunkedList`, like the driver) or live (`buildDrawList`); a 20×20 map of 16-px tiles.

- **"K2: animated tiles are never baked into chunks; uncovered water animates and matches the live picture (step 30)":** water `[8, 9]` × 200 ms in columns 0–2, two opaque `above` tiles elsewhere. Chunked = live at t 0 and t 200; the uncovered water pixel shows frame 8, then 9.
- **"r27: an off-size tile sits bottom-left on its cell at native size, unclipped, overflowing up and right (step 30)":** a 24×32 tile at (1,2): the command is dx 16, dy 16, 24×32; the picture shows its top-right pixel at (39,16) and bottom-left at (16,47).
- **"r27: draw order is rows top to bottom then left to right, so a lower row covers an upper row's overflow (step 30)":** tiles at (1,1), (1,2), (2,2); command order and pixels show (1,2) over (1,1)'s overflow and (2,2) over (1,2)'s right overflow.
- **"r27: culling widens to rows below and columns to the left, so offscreen tiles still draw their overflow (step 30)":** a 40×40 tile whose cell (0,8) is left of and below a 96×112 view at x 32 still draws; chunked = live. **r2 (QA F-2):** a 40×8 and an 8×40 layer: a 40×64 view at (64,16) equals the same crop of a whole-map picture.
- **"r27: overflow crosses chunk edges because off-size layers are drawn live, never chunked (step 30)":** a 24×32 tile at (15,16) over a full cell-sized ground layer; its cell is in chunk (0,1) and it overflows up into chunk (0,0); viewed at (160,192), chunked = live and pixels on both sides of the chunk row edge (art y 242 and 258) show the tile. **r2 (QA F-2):** a tall-only 16×40 and a wide-only 40×16 layer at the same cell: chunked = live.
- **"odd sizes: the r27 bottom-left anchor is exact (no rounding); a sprite centred on an odd tile lands on a half art px that rounds up before scaling (step 30)":** the two values in Rulings.
- **"r26 clips: short ms[] pads with its last value, long ms[] is cut, empty ms[] means fps; fps may be fractional, a bad fps plays at 8 (step 30)":** `[100, 300, 300]`, `[100, 200]`, `[250, 250]`, `[400]` (2.5 fps), `[2000]` (0.5 fps, r2), `[130]` (absent), and `[130]` for 0, −2, NaN, Infinity and `"8"`.
- **"r26 clips: a bad fps warns clipFpsInvalid once and never fails the load (ms[] length and ms-over-fps warn too); the stored clip is passed on unchanged (step 30)":** the clips also hold an empty `ms[]` with fps and a 0.5 fps clip (neither warns, r2); two scenes from the same assets, then a third with a **rebuilt assets record** holding the same asset objects (QA F-1), give exactly `["clipFpsInvalid", "clipMsLength", "clipFpsIgnored"]`; the standing's clip is the stored object and its `fps` is still 0.
- **"r29 clips: an ms[] with any entry that is not a whole number >= 1 is ignored whole; clipMsInvalid once per clip, before clipMsLength and clipFpsIgnored (step 30)":** for NaN, 0, −5, 2.5, `"9"` and Infinity, `clipMs` plays by fps (`[250, 250]` at 4 fps, `[130]` without) and `badMs` is true; five bad clips (one also too short and with fps) across two assets records and a second asset sharing a clip give exactly one `clipMsInvalid` per clip and no `clipMsLength` / `clipFpsIgnored`; the stored NaN is kept.
- **"the link maps layers, units, objects and overlays: aboveUnits goes above, hidden or tileset-less layers drop, tileProps.anim becomes anims (step 30)":** ground `["g"]`, above `["ga"]`, `anims[8]` is the water clip, overlays passed through; standing kinds, keys, cells, art-px offsets (`0.5, −0.25` → `8, −4`) and `z`; a dead unit drops, a dying one stays.
- **"a stable scene: the same world rebuilt each frame returns the same scene object, so a still picture settles to 0 draws a second (step 30)":** a rebuilt units array with the same content returns the same scene; a moved unit returns a new scene that shares `ground`; through `createDriver` on a fake env, after loads settle, 60 frames draw 0. **r2 (QA F-2 and nits):** from a settled link, a change in facing, action, offset, sprite, seed, cols or tileW, or a new non-empty `objects` / `overlays` array, gives a new scene; a later `assets` record makes a tileset-less layer appear; fresh empty `objects` and `overlays` arrays keep the scene (N-2); the same two units in a new order keep it, and one unit whose id is `a|hero|2,2|0,0|S|idle;b` does not alias them (N-1).
- **"standing order is stable: objects in document order then units by id; a walking unit keeps its animation phase across cells; dx does not break c ties (step 30)":** the same frame at six times for cells 2 and 5; a unit at c 1 with dx 20 still draws before an object at c 2; order `["r", "h", "a", "m", "z"]`.
- **"an overlay is not drawn before its startMs and wakes the frame loop at startMs (step 30)":** at 499: no command, `dueMs` 500; at 500: one command, `dueMs` 600. The same overlay at x 900 (offscreen) before start: `dueMs` Infinity (r2, N-4).
- **"§7.3 clip fallback: exact, bare facing for move, mirror unless noMirror, down then bare then left/right/up, idle, die→hit→idle, first frame (step 30)":** fourteen picks, including `idle-down` before bare `idle` for facing N (step 3 order; r2, N-6).
- `raf-driver.test.ts`: **"step 30 driver and clock carries: no loop before start(), a backwards timestamp clears the view back-off, hide drops the sub-ms carry, skip reports its own dtMs and name":** a show before `start()` queues nothing; after a throw at ts 1000, a frame at ts −3984 calls `view()`; with a 1-ms-step clock, 25.7 ms, hide, show, 25.4 ms gives exactly 50; `skip(60000)` reports dtMs 60000 and `skip(-1)` throws `RangeError: skip:`.

## How a planted bug is caught (for QA; prototype `e04de4a`; reverted after each; `/workspace/scratch-ea/s30-plants-r2.py <clone>`; result `/workspace/scratch-ea/s30-plants-r2-result.txt`, 74/74; the r1 script `s30-plants.py` matches `ca27193`)
| Plant (intent) | Named test |
|---|---|
| S1 animated tiles baked into chunks (`isStatic` ignores `anims`) | K2: animated tiles |
| S2 no culling widening to rows below | r27: culling widens |
| S3 no culling widening to columns left | r27: culling widens |
| S4 anchor back to top-left | r27: an off-size tile sits |
| S5 rows drawn bottom to top | r27: draw order |
| S6 columns drawn right to left | r27: draw order |
| S7 off-size layers chunked | r27: overflow crosses chunk |
| S8 anchor height rounded to even | odd sizes |
| S9 rounding after scaling | odd sizes |
| S10 a short `ms[]` falls back to fps | r26 clips: short ms |
| S11 a long `ms[]` not cut | r26 clips: short ms |
| S12 an empty `ms[]` not treated as absent | r26 clips: short ms |
| S13 a bad fps not defaulted to 8 | r26 clips: short ms |
| S14 fractional fps truncated | r26 clips: short ms |
| S15 `clipFpsInvalid` not emitted | r26 clips: a bad fps |
| S16 (retargeted, F-1) the `WeakSet` guard removed: warnings repeat on an assets rebuild | r26 clips: a bad fps |
| S17 the stored fps rewritten | r26 clips: a bad fps |
| S18 `clipMsLength` not emitted | r26 clips: a bad fps |
| S18b `clipFpsIgnored` not emitted | r26 clips: a bad fps |
| S19 stable-scene cache off | a stable scene |
| S20 the units key ignores the cell | a stable scene |
| S21 layers rebuilt every scene | a stable scene |
| S22 units not sorted by id | standing order is stable |
| S23 the link sets no unit key | standing order is stable |
| S24 the draw list ignores the key | standing order is stable |
| S25 X6d: dx breaks ties before c | standing order is stable |
| S26 overlay drawn before `startMs` | an overlay is not drawn |
| S27 overlay before `startMs` does not wake the loop | an overlay is not drawn |
| S28 mirror ignores `noMirror` | §7.3 clip fallback |
| S29 mirrored clip not flipped | §7.3 clip fallback |
| S30 die skips hit | §7.3 clip fallback |
| S31 an unknown action does not fall back to idle | §7.3 clip fallback |
| S32 move ignores the bare facing name | §7.3 clip fallback |
| S33 `aboveUnits` swapped | the link maps |
| S34 hidden layers drawn | the link maps |
| S35 unit offset not scaled to art px | the link maps |
| S36 dead units drawn | the link maps |
| S37 `tileProps.anim` dropped | the link maps |
| S38 `visibilitychange` before `start()` starts the loop | step 30 driver and clock carries |
| S39 the sub-ms carry survives a hide | step 30 driver and clock carries |
| S40 a backwards timestamp keeps the view back-off | step 30 driver and clock carries |
| S41 the skip RangeError says advance | step 30 driver and clock carries |
| S42 skip renders a clamped dtMs | step 30 driver and clock carries |
| Q4 culling widen: columns use `fh` (F-2) | r27: culling widens |
| Q5 culling widen: rows use `fw` (F-2) | r27: culling widens |
| Q6 chunk gate checks width only: a tall-only layer is chunked (F-2) | r27: overflow crosses chunk |
| Q7 chunk gate checks height only (F-2) | r27: overflow crosses chunk |
| Q8 key misses facing (F-2) | a stable scene |
| Q9 key misses action (F-2) | a stable scene |
| Q10 key misses offset (F-2) | a stable scene |
| Q11 key misses sprite (F-2) | a stable scene |
| Q12 key misses the seed (F-2) | a stable scene |
| Q13 `objects` identity not compared (F-2) | a stable scene |
| Q14 `overlays` identity not compared (F-2) | a stable scene |
| Q15 a new assets record keeps the old layers (F-2) | a stable scene |
| Q16 new layers keep the old scene (F-2) | a stable scene |
| N1 key fields joined with `\|` `,` `;` (collision) | a stable scene |
| N2 a fresh empty `objects` / `overlays` gives a new scene | a stable scene |
| N4 an offscreen overlay before `startMs` wakes the loop | an overlay is not drawn |
| N6a an empty `ms[]` warns `clipMsLength` | r26 clips: a bad fps |
| N6b an empty `ms[]` warns `clipFpsIgnored` | r26 clips: a bad fps |
| N6c §7.3 step 3: bare name before `a-down` | §7.3 clip fallback |
| N6d fps between 0 and 1 played at 8 (render) | r26 clips: short ms |
| N6e fps between 0 and 1 warns (link) | r26 clips: a bad fps |
| R29a a NaN entry accepted | r29 clips |
| R29b a 0 entry accepted | r29 clips |
| R29c a negative entry accepted | r29 clips |
| R29d a fractional entry accepted | r29 clips |
| R29e a string entry accepted | r29 clips |
| R29f an Infinity entry accepted | r29 clips |
| R29g the render core plays an invalid `ms[]` | r29 clips |
| R29h `clipMsInvalid` not emitted | r29 clips |
| R29i `clipMsInvalid` once per asset, not per clip | r29 clips |
| R29j an invalid `ms[]` also warns `clipMsLength` / `clipFpsIgnored` | r29 clips |

## Example
```ts
// the host page (outside src/, or a later app shell)
const link = createSceneLink();
let world: SceneWorld = buildWorld(project, matchState);     // host side: Sheets from AssetMeta + decoded images
const driver = createDriver({ env: window, canvas: el, clock, view: () => ({ scene: link.scene(world), x: camX, y: camY, s: zoom }), load });
onRevision(() => { world = { ...world, units: unitsFrom(matchState) }; });   // layers/assets/objects/overlays keep identity unless they changed
for (const n of link.notices) debug.warn(n.code, n.message);
```

## Decisions note: what to name
- The placement (`src/runtime/scene/world-scene.ts`, structural inputs, no sim import, no CN) and that the host builds `Sheet` geometry.
- The stable-scene rule: what is compared by identity and what by the units key; layers rebuilt only on `layers`/`assets` change.
- The standing order (objects, then units by id), the unit `key`, X6d (dx does not break c ties), and which units are shown.
- The clip fallback chain, including what is carried (§7.3 steps 5 and 7) and "any action → idle".
- The r26/r28 rules (render core pads; warnings once per asset object via a `WeakSet`, even across assets-record rebuilds; stored clips untouched) and the r29 rule (`badMs`, the whole `ms[]` ignored, `clipMsInvalid` once per clip object, checked before the length and fps-ignored warnings).
- The units key encoding (`JSON.stringify` per unit) and the empty-array rule for `objects` / `overlays`.
- The r27 anchor, culling and draw order, and the chunk-edge choice (off-size layers are drawn live, never chunked).
- The step 29 carries, including the dtMs-after-skip ruling and the `clock.ts` trim.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- Everything outside the 10 files, including:
  - the rest of `src/**`: `src/index.ts`, `src/runtime/canvas/**`, `src/runtime/render/` files other than the four above (`chunk-plan.ts` is unchanged), `src/runtime/input/**`, the rest of core, the project reader, sim and state;
  - `tests/**` other than the 3 test files above;
  - `docs/**`, `handoff/**`, `scripts/**`, `data/**`;
  - `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `BUILD_GUIDE.md`, `tsconfig.json`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**` (including `ui-shell/` and `painter-proto/`), `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 563 (548 + the 15 new tests).
- [ ] `npm run sim` prints exactly the base's two lines, and all 20 smoke lines are byte-identical to `09f3028`. Pins are unchanged (`61fad786…`, `1e5dd82c…`, `45a3dbaa…`, `4d7bbf48…`, `d7f64a09…`).
- [ ] `git diff --name-status 09f3028..<head> -- . ':!handback'` lists exactly the 10 files above. ≤ 400 changed lines, and each file is within its cap.
- [ ] The fifteen titles above exist verbatim and pass. The two changed step 27 assertions pass. With each plant in the table applied (and reverted after), its named test fails.
- [ ] The bundle verifies, the tip is the hand-back commit, and nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
- **L2 real-browser gate (QA ruling 1; before the step 31 look work):** Playwright plus pixelmatch in their own package and lock under `tools/` or a sibling repo, which is a dependency decision. It should prove:
  - the 1× chunk scale-up is pixel-exact;
  - smoothing stays off after a resize;
  - the 120 Hz and 60-cap draw counts hold on a real panel (QA done-means (a));
  - `devicePixelContentBoxSize` matches the backing store at DPR 2.625, 2.75 and 3;
  - a context loss and restore in Chrome redraws;
  - **(step 30)** an r27 overflowing tile and a still world (0 draws a second) on a real panel.
- **Host shell:**
  - `DebugPort` wiring (renderer-research row 29): `Driver.stats` (frames, draws, rev, failed, errors) is the feed; **(step 30)** `SceneLink.notices` joins it.
  - Sheet retry: a failed id is never asked again for the driver's life (no engine API; a `forget(id)` if ever needed).
  - The real loader (`createImageBitmap`), outside `src/runtime` (network law).
  - Loaded sheets are never evicted, and a failed id is pinned: dispose and make a new driver on a project switch.
  - **(step 30)** Build `Sheet` from AssetMeta plus the decoded image: `columns` and frame size from the image and the grid, and the anchor `"auto"` measurement (the render core treats `"auto"` as bottom-centre until then).
  - **(step 30)** Build `SceneWorld` from the project and match state with stable identities (layers, assets, objects, overlays) between revisions; choose each unit's `action` (move while walking, attack, hit, die).
  - **(step 30)** §7.3 step 5's die fade and step 7's procedural stand-in token (a missing or unloadable sprite).
- **Step 31, light and glow:**
  - stepped glow (CEO Q1 final);
  - the darkness buffer and light holes in `wash`;
  - torches' half glow in stage dim (CEO Q2);
  - the moonlit swap (CEO Q5);
  - an even-odd chunk clip for roof fade (renderer-research §6);
  - QA done-means (c): the palette check exempts only the named fade and see-through ops.
- **Step 32, animated-world extras:**
  - colour-cycle and river-scroll bakes, and the sway bake;
  - the maker offset override (**DSK CN**);
  - the Layer chip (**DSK CN**);
  - canopy see-through as a named op (**CEO Q4: OFF by default**);
  - **(step 30)** autotile layers (`autotile?` in §8) and map-editor decor props stay parked.
- **Step 34, perf (QA):**
  - Tune `budgetBytes` and `buildsPerFrame` on devices. Budget 2 chunked layers at 64-px tiles (about 96 MiB on screen).
  - Decide (ARCH) whether chunks are sized in art px (about 256 px) instead of 16 cells.
  - `world()` recomputes every cached chunk's signature on each rev (N-6).
  - The array LRU's O(n) `find` / `indexOf` (A nit).
  - The step 27 allocation carries.
  - The `skip` upper bound: with per-tick subscribers a long stall walks every tick.
  - Stop rAF when idle (QA N-3): today rAF calls back at the panel rate with a cheap early return; stop on idle and restart on `touch`, load, visibility or `busy()`.
  - Cap timing (QA N-1): `capFps: 60` gives 45 fps at 90 Hz and 48 at 144 Hz (60 at 60/120 Hz). An accumulating deadline (`next += 1000 / cap`) would give 60.
  - About 5 empty presents a second while lost with animation (QA N-4): `needsDraw` fires on `dueMs` and the backend no-ops. Harmless.
  - **Optional:** fold the `skip` sub-tick remainder into the accumulator losslessly (`accQ += (ms·scaleQ) mod stepQ`, against today's "accumulator untouched" rule), only if device tests show drift (F-2 ruled accepted as specced).
  - **(step 30)** The units key string is rebuilt and compared every frame: O(units) string work per frame (cheap at match sizes; a revision counter from the host would remove it).
  - **(step 30)** Off-size layers are drawn live every dirty frame; if a big off-size layer shows up on devices, pad chunk canvases by the overflow instead (cross-chunk signatures and stitched order).
  - **(step 30, QA N-3, from step 28)** The chunk signature ignores the tile size and the frame size: if the map tile size changes while a sheet keeps its id, image and columns, an old-size chunk is reused (QA P3b: 3584 px wrong). Add both sizes to the signature, or keep the host-shell rule "a new driver on a project switch".
  - **(step 30, QA N-8)** A walking unit bumps `rev` 60 times a second, so `world()` re-signs every cached chunk each frame (same as N-6 above).
- **Not pinned by a test (QA mutations, harmless today):**
  - E4: chunk canvases set smoothing off, but 1× blits don't depend on it.
  - E9: `beginFrame` resets the composite op, but the draw-level `finally` already guarantees `source-over`.
- **DSK:** r26 rulings (1) `ms[]` and (3) `fps` are **done**; r27 replaces ruling (2); r28 names `clipMsLength` and `clipFpsIgnored` (done); r29 invalid `ms[]` entries (`clipMsInvalid`) is **done** in kit-2. Later (reader carry): move the `ms[]` padding and the clip warnings into the project reader; the stored `ms[]` stays unrewritten either way.
- **Next pin CN (Architect):**
  - depcruise rules for `render`, `canvas`, `host` and now **`scene`**: scene imports only `render/index.ts` and `core/notice.ts`, and nothing in `core`, `sim` or `render` imports scene; host imports only clock, canvas and render, and nothing imports host;
  - ban `globalThis` / `self` / `window` and `setImmediate` / `process` outside the two DOM files (`canvas2d.ts`, `raf-driver.ts`); a grep cannot see `globalThis["request" + "AnimationFrame"]` in another file (QA);
  - anchor check-law's `one-frame-loop` glob (`!**/runtime/host/raf-driver.ts`) to `src/runtime/host/raf-driver.ts`, so a `src/platform/runtime/host/raf-driver.ts` lookalike is not exempt (QA N-7);
  - **AST-level fences (QA r2 evasions):** a depcruise host import rule; eslint `no-restricted-globals` for `globalThis` / `self` / `window` outside the two DOM files (eslint decodes `\u` escapes); possibly a `ts.createSourceFile`-based fence test. QA's examples that the grep fence cannot see: `globalTh\u0069s`; a regex literal `/\/\//` hiding the rest of the line (`globalThis`, or `import "../input/index.ts"`); runtime-built access such as `env["glob" + "alThis"]`, `Object["s" + "elf"]` or `({}).constructor.constructor("return this")()`;
  - **(step 30, QA N-7)** fence `src/runtime/scene/**`: block imports of `state`, `host` (and `sim`, already blocked), and of anything but `render/index.ts` and `core/notice.ts`; ban game-rule words (`hp`, `mana`, `cost`, `deck`, `damage`, `cards`, `phase`), DOM names and wall time there. Today `import "../../state/index.ts"`, `import "../host/raf-driver.ts"` or an `hp` word in world-scene.ts pass every gate.

## Out of scope
- Image decoding or fetching (network law), `Sheet` measurement, input, WebGL2, any light or glow look, palette work, the app shell, Playwright; any change to core-types, the project reader or a format; atlas packing, map-editor decor props, autotiles (parked); game rules of any kind.

## Open questions (EA → CoS/QA/DSK)
1. ~~X6d~~ QA agrees: dx does not break c ties (no mid-walk flicker).
2. ~~Unknown action → idle~~ QA: fine.
3. ~~Units key string~~ QA: fine for now; the key is now collision-proof (N-1). A host revision counter is the step 34 path.
4. ~~Warning names~~ Answered by project-format r28 (`clipMsLength`, `clipFpsIgnored`); r29 adds `clipMsInvalid`.
5. Move the `ms[]` padding and the clip warnings into the project reader: later (QA agrees), with the r29 check. r28 allows play-time padding meanwhile; the stored `ms[]` is never rewritten.
