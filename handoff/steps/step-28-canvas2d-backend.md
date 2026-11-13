# step-28-canvas2d-backend: the Canvas2D backend and the chunk cache (renderer plan slice 28, `docs/research/renderer-research.md` §5 and §11; CEO-approved 2026-11-13 00:42). One backend file, `src/runtime/canvas/canvas2d.ts`, implements step 27's `Renderer` on a 2D canvas: the backing store in device px at a whole scale, `imageSmoothingEnabled = false` after every resize, drawing clipped to the art rect (edge tiles never paint the letterbox), `'lighter'` for additive glow, mirrored `flipX`, and draw state that survives a throwing draw. It holds a cache of 16×16-tile static chunks at 1× in offscreen canvases: invalidated on a new revision by tiles, sheet grid or image identity; at most 2 builds per frame, with chunks past the limit drawn tile by tile (no holes, no stale pixels); a 32 MiB byte budget that never evicts a chunk drawn this frame and zeroes what it drops; everything rebuilt after `contextrestored`. A pure planner, `src/runtime/render/chunk-plan.ts`, gives the same picture as `buildDrawList` with static tiles turned into chunk blits. Two step 27 carries from QA's A/B: glow is always `add`, and the tile-range widening gets a test. Tests use a fake 2D canvas in `tests/`; no browser.

Step id: step-28-canvas2d-backend          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `6ccd014f74f5af384a2a09b2f0eb66efdf6aeeee` (main, the step 27 merge: PR #35, build B). Branch: `step/step-28-canvas2d-backend-r<N>`, created from `6ccd014`. The PR targets `main`. Never commit to `main`.
The diff is always `6ccd014..<head>`.
Delivery (CN-003): `git bundle create step-28-canvas2d-backend-r<N>.bundle 6ccd014..step/step-28-canvas2d-backend-r<N>`; `git bundle verify`; upload it plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-28-canvas2d-backend/r<N>/` (HAND-BACK.md), committed as the branch's last commit. Quote this step file's sha256 prefix in HAND-BACK.md (QA A/B process nit).
Depends on: step 27 (Base; `src/runtime/render/**`), ARCHITECTURE-v0 §12.3 (16×16 chunks at 1×), §12.4 (the `Renderer` adapter), project-format §6.2 (`tile {w,h}`, `tileProps.anim`).
Read first: `docs/research/renderer-research.md` (§1, §5, §11 row 28), `docs/qa/renderer-test-research.md` (R1.2: smoothing reset on resize; R4.3), `docs/qa/step-27-ab.md` ("Build law", "Carries"), `docs/qa/step-28-review.md` (the r1 review), `handoff/steps/step-27-render-core.md` (Rulings, Carries), `tsconfig.json` (`lib: ["ES2022"]`, no DOM lib).

Kit: kit-2, 2026-11-13 (r2 of the kit after QA's NOT OK on r1, `docs/qa/step-28-review.md`: F-1 to F-4 plus nits; EA ruling on (a): the byte budget goes in this step). Engine Architect. Prototyped and run on Node 24.22.1: branch `r2`, head `8b67eb5` = r1 (`858dda6`) + one commit, on `6ccd014` (`npm ci && npm run green` exit 0: `tests 537 pass 537 fail 0`; sim and all 20 smoke lines unchanged; 33/33 EA plants; QA's mutations 24/31 caught by a test plus 5 by tsc/eslint/depcruise only (window, document, new OffscreenCanvas, createImageBitmap, core imports canvas), leaving E4 and E9 (see Carries); step 27's 22 plants 22/22). Bundle copy: `/workspace/scratch-ea/r28-r2.bundle` (`6ccd014..r2`, verified).
Carries: **no CN**, no new format field, no dependency, no `tsconfig` change. core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`) unchanged. No document format changes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
At the base:
- `src/runtime/render/` (step 27) builds a banded, culled draw list and replays it into any `Renderer`, but nothing implements `Renderer` except the test fake. Nothing draws to a canvas.
- Every static tile is one draw per frame (~1,000 calls on a phone screen at 16 px). ARCH §12.3's 1× chunk cache does not exist.
- QA's A/B on build B found two gaps. A glow overlay with an explicit `op: "normal"` passes through, though the step 27 kit says glow is only `add`. B's tile-range widening (`draw-list.ts:35`) is untested (QA probe XW passes).

This step adds the first real backend and the chunk cache. It still has no host loop (step 29) and no world adapter (step 30).

Rulings in this step (Engine Architect, 2026-11-13; r2 rulings marked):
- **Placement: `src/runtime/canvas/canvas2d.ts`, no CN.** No pinned rule covers `src/runtime/**` except `runtime/input`. The file sits outside `src/runtime/render/`, so the step 27 purity fence (flat `.ts` files, no DOM names) is untouched and keeps passing. Every file under `src/runtime/canvas/` imports only `../render/index.ts` or a `./` sibling (r2, N-4).
- **No DOM lib.** `tsconfig.json` has `lib: ["ES2022"]` and is not changed. The backend declares the small structural types it uses (`Ctx2D`, `CanvasLike`). A real `HTMLCanvasElement` or `OffscreenCanvas` fits them, and so does the test fake. The host injects the canvas, an image lookup and a canvas factory (`makeCanvas`, which the host builds as `new OffscreenCanvas(w, h)`). So the backend names no global and reads no wall time.
- **The DOM lives in one file.** Canvas members (`getContext`, `addEventListener`, `imageSmoothingEnabled`, `globalCompositeOperation`) and DOM names (`OffscreenCanvas`, `HTMLCanvasElement`, `document`, `window`, `navigator`) appear in `src/**` only in `canvas2d.ts`; a test walks `src/` to prove it, with strings and comments stripped. The canvas files must also not name `Date`, `performance`, rAF, timers, `setImmediate`, `queueMicrotask`, `Math.random`, `globalThis`, `window`, `document`, `navigator`, `self`, `process`, `eval`, `Function`, `Intl`, `Temporal`, `global`, `require` or `import(`. Comments are stripped with the step 27 string-aware rule (r2, N-4).
- **Frame.** `beginFrame(fit, clear)` runs these steps in order:
  1. Count the frame and reset the per-frame build count and `pending`.
  2. If the last frame never ended, `restore()` its clip (r2, F-1).
  3. If the context is lost, stop here.
  4. Set `canvas.width/height` to `fit.devW/devH`, only when they differ (device px; `fit.s` is already whole).
  5. Then, every frame, set `imageSmoothingEnabled = false` (setting `width` resets it, QA [M]) and `globalCompositeOperation = "source-over"`.
  6. Fill the whole canvas with `clear` (the letterbox colour).
  7. `save()`, then clip to `(padX, padY, artW·s, artH·s)`.

  `endFrame()` restores only if this frame's `beginFrame` saved, then runs the budget eviction.
- **Draws survive a throw (r2, F-1).** When the context is lost, `drawImage` does nothing. It resolves `sheet` through `images(id)`, or through the chunk cache for ids starting `chunk:`. `op: "add"` switches to `"lighter"`, and a `finally` switches back to `"source-over"`. `flipX` mirrors in place: `save(); try { translate(dx + dw, dy); scale(-1, 1); drawImage(…, 0, 0, dw, dh) } finally { restore() }`. `present()` (`dirty.ts`) calls `endFrame()` in a `finally`. A throwing image therefore leaves no flip, no `lighter` and no clip behind, and the next frame is pixel-correct. `fillRect` sets `fillStyle` and fills, except while lost.
- **A missing image keeps `busy()` true (r2, N-7).** If `images(id)` gives `undefined` for a sprite or a chunk, the draw is skipped and `busy()` returns true, so the host draws again next frame and the art appears once it loads. It is the simplest rule and needs no host contract. Step 29 still bumps `rev` on image load (so chunks rebuild) and may throttle these frames.
- **Glow is always `add`** (QA A/B, `draw-list.ts:58`): `o.band === "glow" ? "add" : o.op ?? "normal"`. Other bands keep their own `op`. Stepped glow (CEO Q1 final) is slice 31's art.
- **Chunks.** `CHUNK = 16` cells per side (ARCH §12.3; it stays 16, per renderer-research's open engineering list). `chunkedList(scene, fit, cam, tMs, stepMs)` (pure, in `render/`) returns the **same picture** as `buildDrawList`, built in this order:
  1. For each ground layer: one `band: "base"` blit per visible chunk (id `chunk:g<layer>:<cx>,<cy>`; source rect at 1×, clipped to the map edge; `dw = sw·s`; placed with `toDevice`), then that layer's animated tiles as live draws.
  2. The standing band.
  3. Each `above` layer, the same way as ground (`chunk:a…`).
  4. Overlays.

  `dueMs` is the minimum over the parts (pinned by a test, r2 F-3). A tile is static when it has no `anims` entry (`isStatic`). Animated tiles are never baked (renderer-research §5).
- **Only cell-sized layers are chunked.** A layer whose sheet `fw/fh` differs from `tileW/tileH` is drawn live through `buildDrawList` (B's widening still applies) and still matches pixel for pixel (pinned, r2 F-3). Off-size tiles and the format's "clipped to the cell" rule are a DSK carry.
- **Invalidation (r2, F-2).** A chunk canvas is `min(16, cols − c0)·tileW × min(16, rows − r0)·tileH` art px (256×256 for 16-px tiles), drawn tile by tile at 1× with smoothing off. Each entry keeps three things: a signature (`<sheet id>/<columns>`, then the chunk's static tiles), the image object it was built from, and the frame it was last drawn. `world(scene, rev)` stores the scene. When `rev` differs from the last one, an entry is marked stale if its signature changed (tile, sheet id or sheet grid) **or** `images(sheet.id) !== entry.img` (art re-imported under the same id). A revision with no change rebuilds nothing. A change without a new `rev` is not seen (the host bumps `rev`; step 29).
- **Per-frame build limit, no holes (r2, N-1 / N-2).** `buildsPerFrame` (default 2) counts **every** build, cold or stale. A chunk that is missing or stale is built while the frame has builds left. Past the limit, its static tiles are drawn **one by one** from the current scene this frame (the same pixels as the chunk would give), and `busy()` returns true. So a visible chunk is never blank and never shows stale pixels. This covers a map switch, animated tiles turning static (the old one-frame hole), and the cold rebuild after a restore (now limited too).
- **Byte budget (r2, F-4; EA ruling 2026-11-13: this step).**
  - `budgetBytes` (default 32 MiB = `32 · 2^20`; the host can change it) limits the real `w·h·4` bytes of all chunk canvases, so edge chunks count smaller. `stats.bytes` is the live total.
  - The cache is in LRU order: drawing a chunk moves it to the end.
  - At `endFrame`, chunks are evicted oldest first while `stats.bytes > budgetBytes`, stopping at the first chunk drawn this frame. **A chunk drawn this frame is never evicted**, so the budget only limits off-screen chunks and cannot thrash. When the visible set alone is over budget, the cache overshoots and `stats.bytes` shows it.
  - Evicted canvases, and every canvas cleared on `contextrestored`, are set to 0×0, which frees iOS canvas memory at once (N-3).
  - The loop breaks early.
- **Context loss.** On `contextlost`, every draw and fill is a no-op (`stats.lost`). On `contextrestored`, every chunk is dropped (zeroed), `busy()` is true, and the next frames rebuild within the per-frame limit. Canvas2D support for these events varies (renderer-research §5); where they never fire, nothing changes.
- **Numbers.** 16 (ARCH §12.3), `buildsPerFrame` 2 (renderer-research), `budgetBytes` 32 MiB (QA measured the visible set on a 1290×2796 phone at `s` 1: 18 MiB per layer at 16/32-px tiles and 32 MiB at 64 px; step 34 tunes on devices). ARCH §12.3's "LRU 96 MB" was written for 16-px tiles; r1's 384-chunk count is gone.

## Files to create or change
- create `src/runtime/canvas/canvas2d.ts` (≤ 113)
- create `src/runtime/render/chunk-plan.ts` (≤ 38)
- change `src/runtime/render/dirty.ts` (≤ 21; `present` calls `endFrame` in a `finally`)
- change `src/runtime/render/draw-list.ts` (≤ 65; one line, `:58`, glow forced `add`)
- change `src/runtime/render/index.ts` (≤ 11; one added line re-exporting `CHUNK, chunkId, chunkedList, isStatic`)
- create `tests/runtime/canvas/fake-canvas.ts` (≤ 51), a fake 2D canvas with:
  - a full Uint32 raster (0 = transparent), nearest blits, clip, a flip transform, and `lighter` as a sum;
  - `width`/`height` setters that reset the raster, the state stack and `imageSmoothingEnabled = true` (as the spec does);
  - event listeners, and a draw log with the smoothing flag and composite op;
  - an `unbalanced` count of restores with an empty stack.
- create `tests/runtime/canvas/canvas2d.test.ts` (≤ 137)
- change `tests/runtime/render/render-core.test.ts` (≤ 129): the glow overlay gets `op: "normal"`; one widening helper plus one assertion.

Size: ≤ 400 changed lines, counting insertions + deletions (handback excluded). The r2 prototype changes 335 lines (331+/4−) in 8 files:

| File | Lines / cap |
|---|---|
| `canvas2d.ts` | 109/113 |
| `chunk-plan.ts` | 34/38 |
| `dirty.ts` | 17/21 |
| `draw-list.ts` | 61/65 |
| `index.ts` | 7/11 |
| `fake-canvas.ts` | 47/51 |
| `canvas2d.test.ts` | 133/137 |
| `render-core.test.ts` | 125/129 |

Caps are proto + 4. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/runtime/canvas/canvas2d.ts (exports)
export type Ctx2D = {
  imageSmoothingEnabled: boolean; globalCompositeOperation: string; fillStyle: unknown;
  save(): void; restore(): void; beginPath(): void; rect(x: number, y: number, w: number, h: number): void; clip(): void;
  fillRect(x: number, y: number, w: number, h: number): void; translate(x: number, y: number): void; scale(x: number, y: number): void;
  drawImage(img: object, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
};
export type CanvasLike = { width: number; height: number; getContext(id: "2d"): Ctx2D | null; addEventListener?(type: string, fn: () => void): void };
export type Canvas2DOptions = { readonly images: (id: string) => object | undefined; readonly makeCanvas: (w: number, h: number) => CanvasLike; readonly buildsPerFrame?: number; readonly budgetBytes?: number };
export type Canvas2D = Renderer & { world(scene: RenderScene, rev: number): void; busy(): boolean; readonly stats: { builds: number; bytes: number; lost: boolean } };
export function canvas2d(canvas: CanvasLike, opts: Canvas2DOptions): Canvas2D;   // throws Error("canvas2d: no 2d context") if getContext("2d") is null
// src/runtime/render/chunk-plan.ts
export const CHUNK = 16;
export const chunkId = (above: boolean, layer: number, cx: number, cy: number): string => `chunk:${above ? "a" : "g"}${layer}:${cx},${cy}`;
export const isStatic = (layer: TileLayer, tile: number | null | undefined): tile is number => tile !== null && tile !== undefined && layer.anims?.[tile] === undefined;
export function chunkedList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number, stepMs: number): DrawList;
// src/runtime/render/draw-list.ts:58, the overlay op
o.band === "glow" ? "add" : o.op ?? "normal"
// src/runtime/render/dirty.ts, present
renderer.beginFrame(fit, clear);
try { for (const cmd of list.cmds) renderer.drawImage(…); } finally { renderer.endFrame(); }
```
`chunk-plan.ts` is pure and obeys the step 27 fence (imports only `./<file>.ts`). The engine root (`src/index.ts`) is NOT changed. Host use (step 29): `r.world(scene, rev); if (needsDraw(…) || r.busy()) present(r, fit, chunkedList(scene, fit, cam, clockMs, stepMs), clear)`. `world()` goes before `chunkedList`, and never between `beginFrame` and `endFrame`.

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`stage-fixed seeds 1-50: win 48 lose 2 … afc89d56…`, `stage-weighted seeds 1-50: win 22 lose 28 … b8007292…`), and all 20 smoke lines are byte-identical to `6ccd014`.

## Existing tests changed by ruling (and only these)
- `tests/runtime/render/render-core.test.ts`, "the draw list keeps the band order and y-sorts by feet with stable ties (step 27)":
  - The glow overlay gets `op: "normal"`, so the existing `op === "add"` check proves glow is forced (QA A/B).
  - One helper and one assertion are added: a 32×32 tile on a 16×16 grid at cell (0,0) is still drawn when the camera is at (16,0), (0,16) or (16,16) and only its overhang is on screen, and it is not drawn at (32,0).
  - The title is unchanged.

## Tests that prove it is done
New `tests/runtime/canvas/canvas2d.test.ts`, eight tests whose titles start exactly so. The scene is a 40×20 map of 16-px tiles: a ground layer with animated water tiles (`water`, 2 × 200 ms), an `above` layer with holes, and in some tests a flipped unit and glow overlays. Frames run at `tMs` 250, step 10. Reference pictures are drawn per tile from `buildDrawList`.
- **"chunks draw the same pixels as per-tile drawing, from 1x 16x16-tile canvases (step 28)":** with no build limit, at 200×120 s1, 301×203 s2 (camera 37.4, 11.6), 390×250 s3, 97×61 s4 and the real **DPR 2.625** box 1024×2216 s3 (r2, N-5):
  - the canvas is exactly `devW × devH`;
  - the chunked raster equals the reference pixel for pixel;
  - every chunk canvas is at most 256×256, and some are exactly that.
- **"the chunk plan keeps the anim due time and leaves off-size layers live (step 28)"** (r2, F-3, N-7):
  - `chunkedList(...).dueMs` equals `buildDrawList(...).dueMs` (400).
  - With no images at all, a frame leaves `busy()` true.
  - A 32×32-tile layer on the 16 grid gets no `chunk:` blit and matches the reference at 301×203 s2.
- **"smoothing is off after every resize, the letterbox is never painted, glow is lighter and flips mirror (step 28)":** across sizes 34×30, 35×33, 35×33 and 66×30 at s4 with a fractional camera:
  - smoothing is false after each frame, and every draw was made with it false;
  - every pixel outside the art rect is the clear colour, and every pixel inside is not;
  - some draw used `lighter`, and the op is `source-over` after the frame;
  - two glows on the clear (one with `op: "normal"`) sum onto it, and a ui draw after them is plain;
  - a flipped unit's first column shows its last source column.
- **"a draw that throws leaves no clip, flip or lighter behind (step 28)"** (r2, F-1): the scene has two images that each throw once, under a flipped unit and under a glow.
  - The first frame throws inside the flipped draw; the second throws inside the `lighter` draw. After that, the op is `source-over`.
  - The third frame equals the reference.
  - On r1 the next frame was 9728 px wrong (QA repro).
- **"a tile or image change rebuilds only its chunks, a few per frame, never showing a hole or stale pixels (step 28)"** (r2, F-2, N-1, N-2), at 640×320, which shows 12 chunks:
  - **First frame:** 2 builds, `busy()` true, and the picture already equals the reference. After settling: 12 chunks, `busy()` false.
  - **No change:** revisions with no change rebuild nothing. A changed tile with the same `rev` is not checked; with a new `rev`, exactly one chunk rebuilds.
  - **Five edits** in four chunks (one turns an animated water tile static): the first frame makes 2 builds, `busy()` is true and the picture is already right. Settled, 4 builds.
  - **Sheet and image changes:** each of these rebuilds its layer's 6 chunks, and the picture equals the reference drawn with the new image or grid:
    - swapping the `above` layer's sheet id;
    - a new image object under the same id (on r1, 204800 px stayed wrong forever: QA repro);
    - the same id and image with a different `columns`.
- **"the chunk cache keeps a byte budget, never evicts what is on screen and zeroes what it drops (step 28)"** (r2, F-4). A byte-tallying fake factory counts the live `w·h·4` of every canvas it made.
  - **Over budget, no thrash:** 16-px tiles, a 512 KiB budget, 6 visible chunks (800 KiB with smaller edge chunks). Three identical frames make 6 builds in total (0 after the first), and `stats.bytes` = tally = 819200 (overshoot reported).
  - **Pan away:** a 1 MiB budget, 3 chunks visible, then a pan 768 px right. 6 built; the 2 oldest are evicted and 0×0; bytes = tally = 1 MiB.
  - **Pan back:** a pan to 256 px evicts the least recently drawn chunk (number 5 built), not the first built.
  - **64-px tiles, default budget:** a 512×512 view pans across 10 chunks of 4 MiB. Bytes = tally = 32 MiB, and 2 canvases are 0×0.
- **"a lost context skips drawing and a restored one rebuilds every chunk (step 28)":**
  - **While lost:** a frame makes no draw; `fillRect` paints nothing; there is no unmatched `restore`; `stats.lost` is true.
  - **After a resize and `contextrestored`:** `busy()` is true, `stats.bytes` is 0 and every old canvas is 0×0.
  - **The next frame:** builds every chunk again, `busy()` is false, smoothing is off and the width is back at `devW`.
- **"the canvas lives only in the backend file, which imports only the render core (step 28)":** the DOM-name walk and the banned list above, run on every file under `src/runtime/canvas/` (imports `../render/index.ts` or `./x.ts` only).

The step 27 purity test still passes with `chunk-plan.ts` in `render/`.

## How a planted bug is caught (for QA; prototype `8b67eb5`; reverted after each; `/workspace/scratch-ea/s28-plants-r2.py <clone>` and QA's mutations, strings adapted to r2: `/workspace/scratch-ea/s28-qa-extra-r2.py <clone>`)
| Plant (intent) | Named test |
|---|---|
| B1 smoothing is not reset after a resize | smoothing is off …; a lost context … |
| B2 the backing store is art px, not device px | chunks draw the same …; smoothing is off … |
| B3 no clip (edge tiles paint the letterbox); B4 the clip is the whole canvas | smoothing is off … |
| B5 glow drawn `source-over`; B6 `lighter` leaks into later draws | smoothing is off … |
| B7 a flip mirrors about the wrong edge | smoothing is off … |
| B8 glow `op` passes through (`draw-list.ts:58` reverted to B) | the draw list keeps the band order … (step 27); smoothing is off … |
| B9 the tile-range widening is removed (QA probe XW) | the draw list keeps the band order … (step 27) |
| K1 chunks of 8 tiles; K2 animated tiles baked into chunks; K3 a chunk's tiles placed at the map offset; K4 the chunk cull drops the last partial chunk | chunks draw the same … (and others) |
| K5 a tile change never invalidates; K6 every revision rebuilds every chunk; K7 no per-frame build limit; K8 an over-limit chunk is a hole; K9 the signature ignores the sheet grid; K10 an over-limit stale chunk shows stale pixels | a tile or image change … |
| K11 the byte budget is ignored; K12 a chunk drawn this frame is evicted (thrash); K13 evicted canvases are not zeroed; K14 built bytes are not counted; K15 the LRU never moves a reused chunk (FIFO) | the chunk cache keeps a byte budget … |
| L1 `contextlost` ignored; L2 a restore keeps the old chunks; L3 a restore does not ask for a redraw | a lost context … |
| R1 fix 1 reverted (no begin guard, no `finally` in the flip, the `lighter` switch or `present`) | a draw that throws … |
| R2 fix 2 reverted (image identity ignored) | a tile or image change … |
| R3 a missing image does not ask for a redraw | the chunk plan keeps … |
| U1 a canvas call in the pure core; U2 the backend imports past the render index; U3 wall time in the backend | the canvas lives only in the backend file … |
| **QA mutations (r1 review, adapted):** E1 `endFrame` restores unconditionally; E6 `contextlost` does not stop draws; E7 a restore keeps `pending` false; E8 `fillRect` ignores lost | a lost context … |
| E2 FIFO LRU; E3 the byte budget off by one | the chunk cache keeps a byte budget … |
| E5 `chunkedList` drops the anim `dueMs`; E11 off-size layers chunked anyway (both F-3) | the chunk plan keeps … |
| E10 `world` checks only the first chunk | a tile or image change … |
| F3 `self`; F4 `navigator`; F5 `process.hrtime`; F6 `setImmediate`; F7 indirect `eval`; F8 `new Function`; F9 `Intl`; F12 a `"//"` string hides an import; F13 a template `import()`; F14 a type import from core; F15 a second canvas file imports core + `globalThis`; F18 an import past `index.ts`; F19 `queueMicrotask`; F20 `globalThis` | the canvas lives only in the backend file … (F19 also eslint + check:law) |
| F16 render imports canvas | the render core stays pure … (step 27) + depcruise |
| F1 `window`, F2 `document`, F10 `new OffscreenCanvas`, F11 `createImageBitmap` | tsc (no DOM lib) |
| F17 core imports canvas | eslint + depcruise |

All 33 EA plants fail their named tests (33/33). QA's 31 mutations on `8b67eb5` (QA's r2 recheck count): 26 caught by a test (the fence now also catches F1 and F2), 3 by gates only (F10, F11 by tsc, F17 by eslint and depcruise), 2 not caught (E4, E9; see Carries). On r1 they caught 4/11 behaviour and 15/20 fence. Step 27's 22 plants still catch 22/22. **QA repros:** r2's tests run on r1's code fail the throw test, the tile/image test, the budget test and the lost test (green exit 1). QA's probe script on r2: flip-throw next frame 0 px wrong (r1: 9728); gco after a `lighter` throw `source-over` (r1: `lighter`); image swap under the same id 0 px wrong (r1: 204800); map switch 0 px wrong in every frame (r1: 64512 then 21504); maxChunks-4 thrash gone (builds 2, 2, 2, 0 under the per-frame limit); a missing image keeps `busy()` true; DPR 2.625, 2.75 and 3 at phone sizes all equal. **Greps:** `rg -n -w phase src/runtime` prints nothing; `rg -l 'getContext|OffscreenCanvas' src` prints only `canvas2d.ts`; `git diff --name-status 6ccd014..<head> -- . ':!handback'` lists exactly the 8 files above (4 `A`, 4 `M`); pins unchanged.

## Example
```ts
const r = canvas2d(canvasEl, { images: (id) => sheets.get(id), makeCanvas: (w, h) => new OffscreenCanvas(w, h) }); // host side (step 29); budgetBytes 32 MiB default
const fit = fitView(dev.w, dev.h, s, 16, 16), cam = snapCamera(camX, camY, fit.s);
r.world(scene, rev);                                                // a new rev re-checks signatures and images
if (needsDraw(prev, prevDueMs, stamp) || r.busy()) present(r, fit, chunkedList(scene, fit, cam, clockMs, 10), "#000");
```

## Decisions note: what to name
- That the backend is `src/runtime/canvas/canvas2d.ts` with no CN, typed structurally (no DOM lib, no `tsconfig` change), with the canvas, images and canvas factory injected.
- That `chunkedList` is pure, lives in `render/`, and must match `buildDrawList` pixel for pixel; that only cell-sized layers are chunked.
- The invalidation rule (`rev` change, then the signature with sheet id and grid, plus image identity).
- The per-frame limit: 2 builds of any kind, past it tile-by-tile drawing and `busy()`. A visible chunk is never blank or stale.
- The byte budget: real `w·h·4`, default 32 MiB, host-settable; never evict a chunk drawn this frame; overshoot shown in `stats.bytes`; 0×0 on evict and on restore.
- The throw rule (`finally` in the flip, the `lighter` switch and `present`; `beginFrame` closes an unclosed frame).
- The missing-image rule (`busy()` stays true).
- That glow is forced `add` and other bands keep their `op`.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- Everything outside the 8 files, including:
  - the rest of `src/**`: `src/index.ts`, `src/runtime/input/**`, the other `src/runtime/render/*` files, core, the clock;
  - `tests/**` other than the 3 test files above;
  - `docs/**`, `handoff/**`, `scripts/**`;
  - `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `BUILD_GUIDE.md`, `tsconfig.json`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**` (including `ui-shell/` and `painter-proto/`), `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 537 (529 + the 8 new tests).
- [ ] `npm run sim` prints exactly the base's two lines; all 20 smoke lines are byte-identical to `6ccd014`. Pins unchanged (`61fad786…`, `1e5dd82c…`, `45a3dbaa…`, `4d7bbf48…`, `d7f64a09…`).
- [ ] `git diff --name-status 6ccd014..<head> -- . ':!handback'` lists exactly the 8 files above. ≤ 400 changed lines, each file within its cap.
- [ ] The eight titles above exist verbatim and pass, and the step 27 titles are unchanged and pass. With each plant in the table applied (revert after), its named test fails.
- [ ] The bundle verifies; the tip is the hand-back commit; nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
- **DSK (format clashes from QA's A/B; the CEO's office is asking DSK):**
  1. **Clip `ms[]`:** project-format §6.2 (`data/project-format.md:402`) pads a short `ms[]` with the last value, while the step 27 kit and code fall back to `fps`.
  2. **Off-size tiles (`:395`):** the format says they are "drawn at native size from the cell's top-left and clipped", but step 27 draws the full `fw×fh`, and B widens the cell range for it. This step leaves off-size layers unchunked and unclipped.
  3. **`fps ≤ 0`:** no defined meaning (B shows the last frame forever).
- **Step 29, the host frame driver (QA r1 review carries):**
  - Call `world()` before `chunkedList` and never between `beginFrame` and `endFrame` (a mid-frame `world` mixes two maps).
  - Bump `rev` on image load and on any world change.
  - Draw when `needsDraw || r.busy()`, and decide whether to throttle `busy()` frames while an image is missing.
  - Add a `dispose()` that removes the `contextlost` / `contextrestored` listeners and zeroes the cache.
  - Build `images` and `makeCanvas` (`OffscreenCanvas`, iOS 16.4+, with a fallback for older WebKit); use `devicePixelContentBoxSize` for `backingSize`.
  - The real-browser L2 check (QA ruling 1: Playwright/pixelmatch in their own package): the 1× chunk scale-up is pixel-exact, and smoothing stays off after a resize.
  - The restore rebuild is already limited per frame here (r2), so nothing is left for it in step 29.
  - **MUST FIX (QA r2):** a sheet that never loads keeps `busy()` true, so a `needsDraw || busy()` host redraws at ~60 fps forever (600/600 ticks; a missing sprite sheet is 3978 draw calls a frame). On a failed load, map the id to a placeholder image and bump `rev`, or stop retrying until a load event. Test: a failed sheet settles to 0 draws a second.
  - QA r2 nit: assert that the stale canvas replaced at `canvas2d.ts:63` ends 0×0 (plant: swap `drop(id, hit)` for a bare delete).
- **Step 30:** the odd-width anchor rounding test (QA A/B carry 4); the stable `standing` order, the walking-unit offset key, X6d; padding `ms[]` if DSK keeps the format rule.
- **Step 31:** stepped glow (CEO Q1 final), the darkness buffer and light holes in `wash`, torches' half glow in stage dim (CEO Q2), the moonlit swap (CEO Q5); an even-odd chunk clip for roof fade (renderer-research §6).
- **Step 34, perf (QA):**
  - Tune `budgetBytes` and `buildsPerFrame` on devices; budget 2 chunked layers at 64-px tiles (about 96 MiB on screen).
  - Decide (ARCH) whether chunks are sized in art px (about 256 px) instead of 16 cells, which would cap the visible set at about 20 MiB per layer.
  - `world()` recomputes every cached chunk's signature on each rev (N-6).
  - The step 27 allocation carries.
- **Not pinned by a test (QA mutations, harmless today):**
  - E4: chunk canvases set smoothing off, but 1× blits don't depend on it.
  - E9: `beginFrame` resets the composite op, but the draw-level `finally` already guarantees `source-over`. It stays as defence in depth.
- **Next pin CN (Architect):** depcruise rules for `render` (imports only its own folder; who may import it: today `sim → render` is allowed) and `canvas` (imports only `render`; nothing below runtime imports it); `setImmediate` / `process.hrtime` in check-law and eslint.

## Out of scope
- The host loop, rAF, visibility, input, image decoding or loading, the world → scene adapter, WebGL2, any light or glow look, palette work; any change to the clock, core-types, project reader or a format; atlas packing, map-editor decor props, autotiles (parked).
