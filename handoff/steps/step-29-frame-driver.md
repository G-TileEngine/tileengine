# step-29-frame-driver: the host frame driver (renderer plan slice 29, `docs/research/renderer-research.md` §11 row 29; CEO-approved 2026-11-13 00:42). One new file, `src/runtime/host/raf-driver.ts`, is the only owner of `requestAnimationFrame`. It turns rAF time into engine ticks, draws only when the frame is dirty (`needsDraw || busy()`), and pauses while the page is hidden. It has a 60 fps cap (off by default), a bulk clock step for rAF pile-ups, `OffscreenCanvas` and `devicePixelContentBoxSize` with fallbacks, a sheet loader that bumps `rev`, and a `dispose()` that removes every listener. It also folds in QA's step 28 must-fix: a sheet that never loads no longer keeps a `needsDraw || busy()` host redrawing forever. And QA's A-pick carry: `busy()` is false while the context is lost.

Step id: step-29-frame-driver          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `4d9d872b34fc8b375df152d4873c607673e3475c` (main, the step 28 merge: PR #36, build A, code `754bdce`). Branch: `step/step-29-frame-driver-r<N>`, created from `4d9d872`. The PR targets `main`. Never commit to `main`.
The diff is always `4d9d872..<head>`.
Delivery (CN-003): `git bundle create step-29-frame-driver-r<N>.bundle 4d9d872..step/step-29-frame-driver-r<N>`; `git bundle verify`; upload it plus a copy of HAND-BACK.md to the CEO's Drive. HAND-BACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-29-frame-driver/r<N>/` (HAND-BACK.md), committed as the branch's last commit. Quote this step file's sha256 prefix in HAND-BACK.md.
Depends on: step 28 (Base; `src/runtime/canvas/canvas2d.ts`), step 27 (`src/runtime/render/**`: `needsDraw`, `present`, `backingSize`, `fitView`, `snapCamera`, `chunkedList`), the clock (`src/core/clock/**`, CN-001), BUILD_GUIDE §2 law 1 (one clock; rAF only in `src/runtime/host/raf-driver.ts`, already in eslint `RAF_DRIVER` and check-law `one-frame-loop`).
Read first: `docs/research/renderer-research.md` (§1, §2 "Clock pile-up carry", §11 row 29), `docs/qa/step-28-review.md` (step 29 carries, the missing-image busy-loop at :212), `docs/qa/step-28-ab.md` ("The s29 must-fix and the :63 nit", "Must-fix for A"), `handoff/steps/step-28-canvas2d-backend.md` (Rulings, Carries), `src/core/clock/clock.ts`, `eslint.config.mjs` (`RAF_DRIVER`), `scripts/check-law.sh`.

Kit: kit-3, 2026-11-13. Kit-2 followed QA's r1 NOT OK (`docs/qa/step-29-review.md`: F-1, F-2, F-3; Q1 ruled YES; nits N-5 and N-6 taken). Kit-3 follows QA's r2 NOT OK: F-4, a freeze after one `view()` throw; F-2 ruled accepted as specced. Engine Architect. Prototyped and run on Node 24.22.1: branch `r3`, head `187ae98` = r2 (`4487e82`) + one commit = r1 (`6df65b1`) + two, on `4d9d872`. `npm ci && npm run green` exit 0: `tests 548 pass 548 fail 0`. Sim and all 20 smoke lines unchanged. 47/47 EA plants caught. Bundle copy: `/workspace/scratch-ea/r29-r3.bundle` (`4d9d872..r3`, verified, sha256 `bafe8860…`).
Carries: **no CN**, no new format field, no dependency, no `tsconfig` change. `Clock.skip` is a `src/core/clock/types.ts` addition. That file is not the pinned `core-types.ts`, and renderer-research §2 calls it an engineering call. core-types (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) are unchanged. No document format changes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
At the base:
- The render core (step 27) and the Canvas2D backend (step 28) can draw a frame, but nothing calls them. There is no rAF loop and no `rev` counter. No image loader exists, and nothing builds `makeCanvas`.
- A sheet that never loads (a 404 or a renamed asset) keeps `busy()` true. A `needsDraw || busy()` host then redraws at the panel rate forever: 600 of 600 ticks, and a missing sprite sheet costs 3978 draw calls a frame (QA r2 MUST FIX).
- Build A's `busy()` is `hold || missing || capped`. Restore the context, then lose it again before a frame, and `hold` never clears. The host then presents 600 of 600 ticks with 0 draws (QA A-pick).
- The backend's `contextlost` / `contextrestored` listeners are never removed.
- `clock.advance` clamps a frame to 100 ms. A long rAF gap (jank, a debugger pause) loses sim time, and a long host duration steps tick by tick (the step 25 pile-up carry).

This step adds the driver and the bulk clock step, and closes those two backend gaps. It still has no world → scene adapter (step 30) and no WebGL.

Rulings in this step (Engine Architect, 2026-11-13):
- **Placement: `src/runtime/host/raf-driver.ts`, no CN.** This is the file that eslint's `RAF_DRIVER` and check-law's `one-frame-loop` already name. It is the only file in `src/runtime/host/`. It imports only `../../core/clock/index.ts`, `../canvas/canvas2d.ts` and `../render/index.ts`. A test pins the folder and the imports.
- **No DOM lib, everything injected.** The host passes `env`, a structural `HostEnv` with:
  - `requestAnimationFrame` and `cancelAnimationFrame`;
  - `devicePixelRatio`;
  - `document`: `visibilityState`, add/remove listener and `createElement("canvas")`;
  - optional `OffscreenCanvas` and `ResizeObserver`.

  A real `window` fits this type, and so does the test fake. The driver names no global: no `window`, `globalThis`, `Date` or `performance`. The rAF timestamp is its only time source.
- **The DOM-name walk is widened.** The step 28 canvas fence test (an existing test, changed by ruling) now allows the DOM names in two files: `canvas2d.ts` and `raf-driver.ts`. The render purity fence (step 27) and the canvas folder fence are unchanged.
- **Frame order.** Each rAF callback runs these steps in order:
  1. Clear the handle. If disposed, stop.
  2. Request the next frame first, so a throwing draw cannot kill the loop.
  3. Count the frame.
  4. Advance the clock by the whole ms since the last frame, carrying the fraction, so 120 Hz (8.33 ms) does not lose 4% of sim time. A gap above `stallMs` (default 100, the clock's own `maxFrameMs` clamp, so a 101–250 ms jank frame loses no sim time; r2, F-2) goes through `clock.skip`. The first frame after `start` or after a hidden page advances nothing.
  5. Apply the cap (below).
  6. Read `view()` once: the scene, the camera in art px and the wanted scale. If `view()` throws, count it in `stats.errors` and stop. While the rev is the same, `view()` is retried at most once every 1000 ms of rAF time; any `rev` change retries it at once (r3, F-4; r2 waited for a `rev` change only, and since only `view()` can bring a new scene, one transient throw froze the screen). A view that keeps throwing costs about one throw a second; a transient throw recovers within about 1 s. Time comes from the rAF `ts`, never a wall clock.
  7. Size the canvas: `backingSize(clientWidth, clientHeight, devicePixelRatio, exact)`. `fitView`, then `snapCamera`.
  8. If `view().scene` is a new object, bump `rev`.
  9. Build the stamp. Stop if `!needsDraw(prev, due, stamp)`, unless `busy() && (!stats.missing || stats.capped)` (r2, Q1).
  10. Call `backend.world(scene, rev)`, **before** `chunkedList` and never between `beginFrame` and `endFrame`. Then call `chunkedList`.
  11. Record the stamp, `dueMs` and the draw before calling `present`. `present` already ends the frame in a `finally` (step 28). So a throw in a draw is not retried every frame.
- **`rev`.** `rev` is bumped by:
  - a sheet load;
  - a new `view().scene` object;
  - the host calling `touch()` (any world change it makes in place).

  The backend re-checks chunk signatures only when `rev` changes (step 28).
- **The missing-sheet rule (QA r2 MUST FIX): back off until a load event.**
  - `images(id)` asks `load(id)` once per id and returns `undefined` until the load resolves. A resolved load stores the image and bumps `rev`, which redraws.
  - A rejected or never-settling load is never retried (`stats.failed` counts rejections, but not after `dispose()`; r2, N-5).
  - The backend now reports `stats.missing`, meaning the last frame skipped a draw for a missing image. The driver does not redraw on `busy()` while `stats.missing` is true, unless `stats.capped` (r2, Q1 ruled YES: the backend reports `stats.capped`, so chunk builds past the per-frame limit still finish while a sheet is missing). So a scene with a dead sheet draws 0 times a second once it has settled, and a late load still redraws at once.
  - **A restore clears `stats.missing` (r2, F-1).** `onRestored` sets `stats.missing = false`, so the `hold` redraw after `contextrestored` is not blocked by a missing flag left from the last frame. On r1 the cleared canvas stayed black (QA: 15360/15360 px).
  - A placeholder image was the other option. It was not taken, because it needs an art asset and a format answer.
- **`busy()` is false while lost (QA A-pick).** In `canvas2d.ts`: `busy: () => !lost && (hold || missing || capped)`. While lost, a `needsDraw || busy()` host makes no frames. The next `contextrestored` sets `hold` and redraws.
- **`dispose()`.**
  - The backend's `dispose()` removes both context listeners by reference, zeroes and drops every chunk canvas, and forgets the scene. `CanvasLike` gains an optional `removeEventListener`.
  - The driver's `dispose()` cancels the pending rAF and removes the `visibilitychange` listener. It disconnects the `ResizeObserver`, calls `backend.dispose()` and clears the sheets.
  - Calling `dispose()` twice is safe. After it, no frame runs.
- **Visibility pause.** When the page is hidden, the driver cancels the rAF and resets the frame time. When it is shown again, it requests a frame, and the first frame advances nothing. So the clock freezes while hidden and never replays the hidden gap.
- **60 cap, off by default (QA ruling 7).** With `capFps` set, a frame draws only if `ts − lastDraw ≥ 1000 / capFps − 2`. The 2 ms is slack for rAF jitter. The clock still advances every frame. So 120 Hz with `capFps: 60` draws every other frame. 60 Hz with the cap draws every frame.
- **Bulk clock step, `Clock.skip(ms)` (step 25 pile-up carry).** This is an addition to `src/core/clock`:
  - It runs the ticks that `ms` of host time is worth, with `timeScale` applied and the accumulator untouched.
  - With no tick subscriber, it jumps straight to the next due timer, or to the end. Timers fire in the same order and at the same `now()` as stepping does. A timer that subscribes mid-skip switches the rest of the skip to tick by tick.
  - It calls one render at the end. While paused, it does nothing. A non-integer or negative `ms` throws a `RangeError`, the same as `advance`.
  - The driver uses it for gaps above `stallMs`, and the host can call `catchUp(ms)` directly.
- **Canvas factory.** `makeCanvas` builds `new env.OffscreenCanvas(w, h)` when the env has one (iOS 16.4+). Otherwise it uses `document.createElement("canvas")` with `width`/`height` set (older WebKit).
- **Sizing.**
  - With a `ResizeObserver`, the driver observes `{ box: "device-pixel-content-box" }` and uses `devicePixelContentBoxSize[0]` as the exact backing size.
  - If `observe` throws on that box (Safari), it observes plainly and falls back to the css size × `devicePixelRatio`.
  - With no observer, it always uses that fallback.
- **The QA :63 nit.** A test asserts that a stale chunk canvas replaced by a rebuild ends 0×0, and that `stats.bytes` equals the live tally.
- **L2 in a real browser (QA ruling 1): a gate note only.** No Playwright in this step. It needs its own package and lock (a dependency change). See Carries.

## Files to create or change
- create `src/runtime/host/raf-driver.ts` (≤ 92)
- change `src/core/clock/clock.ts` (≤ 142; `skip` only)
- change `src/core/clock/types.ts` (≤ 35; the `skip` member and its doc line)
- change `src/runtime/canvas/canvas2d.ts` (≤ 116: the `busy` line, `dispose`, `stats.missing` and `stats.capped`, the restore reset, named listeners, optional `removeEventListener`)
- change `tests/runtime/canvas/fake-canvas.ts` (≤ 50; `removeEventListener` and a `listeners` count)
- change `tests/runtime/canvas/canvas2d.test.ts` (≤ 136; the DOM-walk ruling only)
- create `tests/runtime/host/raf-driver.test.ts` (≤ 153; **cap re-based in kit-2** from 143: the r2 fixes add 10 lines)

Size: ≤ 400 changed lines, counting insertions plus deletions (handback excluded). The r3 prototype changes 278 lines (+270/−8) in 7 files:

| File | Lines / cap |
|---|---|
| `raf-driver.ts` | 90/92 |
| `clock.ts` | 138/142 |
| `types.ts` (clock) | 31/35 |
| `canvas2d.ts` | 112/116 |
| `fake-canvas.ts` | 46/50 |
| `canvas2d.test.ts` | 132/136 |
| `raf-driver.test.ts` | 153/153 (re-based in kit-2; at cap in r3) |

Caps are the r1 proto + 4; `raf-driver.test.ts` is re-based to the r2 proto + 4. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
```ts
// src/core/clock/types.ts, Clock (added after step())
  /** Step 29: runs the ticks `ms` of host time is worth (timeScale applied) at once (rAF pile-up, tab return). With no tick subscriber it jumps straight between due timers; timers fire in the same order as advance. No-op while paused. */
  skip(ms: number): void;
// src/runtime/canvas/canvas2d.ts (changed exports)
export type CanvasLike = { width: number; height: number; getContext(id: "2d"): Ctx2D | null; addEventListener?(type: string, fn: () => void): void; removeEventListener?(type: string, fn: () => void): void };
export type Canvas2D = Renderer & { world(scene: RenderScene, rev: number): void; busy(): boolean; dispose(): void; readonly stats: { builds: number; bytes: number; lost: boolean; missing: boolean; capped: boolean } };
busy: () => !lost && (hold || missing || capped),
// src/runtime/host/raf-driver.ts (exports)
export type HostCanvas = CanvasLike & { readonly clientWidth: number; readonly clientHeight: number };
export type HostEnv = {
  requestAnimationFrame(cb: (ts: number) => void): number;
  cancelAnimationFrame(id: number): void;
  readonly devicePixelRatio: number;
  readonly document: Listen & { readonly visibilityState: string; createElement(tag: "canvas"): CanvasLike };
  readonly OffscreenCanvas?: new (w: number, h: number) => CanvasLike;
  readonly ResizeObserver?: new (cb: (entries: readonly Resized[]) => void) => { observe(target: object, opts?: { box: string }): void; disconnect(): void };
};
export type View = { readonly scene: RenderScene; readonly x: number; readonly y: number; readonly s: number };
export type DriverOptions = {
  readonly env: HostEnv; readonly canvas: HostCanvas; readonly clock: Clock; readonly view: () => View;
  readonly load: (id: string) => Promise<object>;
  readonly clear?: string; readonly buildsPerFrame?: number; readonly budgetBytes?: number;
  readonly capFps?: number;
  readonly stallMs?: number;
};
export type Driver = { start(): void; touch(): void; catchUp(ms: number): void; dispose(): void; readonly backend: Canvas2D; readonly stats: { frames: number; draws: number; rev: number; failed: number; errors: number } };
export function createDriver(o: DriverOptions): Driver;
// private: type Listen = { addEventListener(type, fn); removeEventListener(type, fn) }; type Resized = { devicePixelContentBoxSize?: readonly { inlineSize; blockSize }[] }
```
`src/index.ts` (the engine root) is NOT changed; the host imports the driver by path. `clear` defaults to `"#000000"`. `stats` is the host's debug timing feed (`DebugPort` wiring is carried).

## Smoke lines
None move. `npm run sim` prints exactly the base's two lines (`stage-fixed seeds 1-50: win 48 lose 2 … afc89d56…`, `stage-weighted seeds 1-50: win 22 lose 28 … b8007292…`), and all 20 smoke lines are byte-identical to `4d9d872`. Nothing in the sim calls `skip`.

## Existing tests changed by ruling (and only these)
- `tests/runtime/canvas/canvas2d.test.ts`: the test "the canvas lives only in the backend file, which imports only the render core (step 28)" is renamed to **"the canvas lives only in the backend and the host driver; the backend imports only the render core (steps 28, 29)"**. Its DOM-walk expectation becomes `["runtime/canvas/canvas2d.ts", "runtime/host/raf-driver.ts"].map((f) => join(root, f)).includes(file)`, anchored to the full path under `src/` (r2, F-3; a nested `src/x/src/runtime/host/raf-driver.ts` is no longer allowed). Nothing else in it changes.

## Tests that prove it is done
New `tests/runtime/host/raf-driver.test.ts`: eleven tests whose titles start exactly as given below.

The fixture:
- A fake env: a rAF queue that a `run(seconds, hz)` loop drives from ts 1000, a document with listeners and `visibilityState`, an optional `OffscreenCanvas` subclass of the step 28 `FakeCanvas`, and an optional `ResizeObserver` (`"picky"` throws on a `box` option).
- A `FakeCanvas` view with `clientWidth` 160 and `clientHeight` 96.
- A real `createClock()` (step 10).
- A 24×16 map of 16-px tiles: a ground layer (water `[4, 5]` × 200 ms on one tile when animated) and a sparse `above` layer.
- `load` resolves from a raster bank. `flush()` waits one `setImmediate` (tests only).
- References are drawn per tile with `buildDrawList` into a fresh backend.

The tests:
- **"idle: a static scene draws once after its sheets load, then 0 a second; one water tile draws 5 a second (step 29)":** half a second, then a flush. The next second draws 1 frame, which equals the reference; the second after that draws 0. With water: 5 draws a second at 60 Hz and again at 120 Hz.
- **"a 120 Hz panning view draws 120 a second, 60 with capFps 60, and the clock keeps time either way (step 29)":** a view whose x moves by 1 art px on each call, at 120 Hz:
  - no cap: 120 draws in 1 s;
  - `capFps: 60`: 60 draws;
  - both: the clock moves 1000 ± 10 ms.

  A static scene with `capFps: 60` at 60 Hz draws 1 frame, then 0.
- **"a sheet that never loads, or fails, settles to 0 draws a second; a late load bumps rev and redraws (step 29 must-fix)":** three loaders: every sheet never settles; every sheet rejects; only the ground sheet rejects. In each case, after 2 s, the third second draws **0** frames while `busy()` and `stats.missing` are true, and `load` was called exactly twice (once per sheet). **Q1 (r2):** `buildsPerFrame: 1`, the camera at x 200 (two ground chunks visible), and the `above` sheet never loads: both ground chunks get built (`stats.builds` 2), then the next second draws 0 and `stats.capped` is false.
- **"a late sheet load bumps rev and redraws the real picture (step 29)":** the ground sheet resolves only after 2 s. `rev` goes up by exactly 1, the next second draws 1 frame equal to the reference, and the second after that draws 0.
- **"busy() is false while lost, even after restore-then-lose; a restore redraws, then settles (QA A-pick carry)":** after the frames, the canvas fires `contextrestored` and then `contextlost`.
  - `busy()` is false, and 1 s draws 0 (QA's 600/600 becomes 0).
  - Another `contextrestored`: `busy()` is true, at least one draw follows, then 0 a second, and the picture equals the reference.
  - **F-1 repro (r2):** the ground sheet never loads and the frames settle; `contextlost`, the canvas is cleared, `contextrestored`. Exactly 1 draw, then 0 a second, and the canvas is not all black.
- **"world() runs before the plan: a new scene object bumps rev, and a replaced stale chunk canvas ends 0x0 (step 29, QA :63)":**
  - After the first picture, `view()` returns a new scene with every tile changed. The next second draws 1 frame equal to the new reference.
  - Every chunk canvas made before the change is 0×0.
  - `stats.bytes` equals the live `w·h·4` tally.
  - `touch()` draws 1 more frame.
- **"dispose removes every listener and stops the loop; canvas factory and sizing fall back cleanly (step 29)":**
  - **With an observer:** it observed `"device-pixel-content-box"`. A resize entry of 333×201 makes the canvas exactly 333×201. Every chunk canvas came from `OffscreenCanvas`. The view has 2 listeners and the document has 1.
  - **After `dispose()` twice:** 0 view listeners, 0 document listeners, an empty rAF queue, 1 disconnect, `stats.bytes` 0, every chunk canvas 0×0, and no frames after 1 s more.
  - **Bare env** (no `OffscreenCanvas`, a picky observer, `devicePixelRatio` 2): it observed with no box, the canvas is 320×192, and every chunk canvas came from `createElement`.
  - **Nits (r2):** a load rejected after `dispose()` leaves `stats.failed` at 0 (N-5). **F-4 / N-6 (r3), retried at most once a second and recovers without a rev bump:** a `view()` that always throws is called 3–4 times in 3 s (no throw escapes, no busy loop, 0 draws, `stats.errors` = calls), and `touch()` retries it on the next frame. QA's repro: a panning view with one water tile draws 60 a second; `view()` throws once; after 1.1 s the next second draws 60 again, with `stats.errors` 1 and `rev` unchanged (no `touch()`).
- **"hidden cancels rAF and freezes the clock; showing again does not replay the gap (step 29)":** on hidden, the rAF queue is empty. After a 60 s gap, the page is shown again and runs 0.5 s; the clock moved ≤ 510 ms in total.
- **"a rAF pile-up goes through one bulk clock.skip: no 100 ms clamp, timers fire in order (step 29)":**
  - Two timers (+5000 and +2000). A 9 s rAF gap moves the clock ≥ 9000 ms, and they fire at exactly t0+2000 and then t0+5000.
  - `catchUp(1000)` adds 1000 more.
  - **F-2 (r2):** 150 ms and 200 ms gaps (one frame each) move the clock by the gap within one 10 ms tick. On r1 a 200 ms gap gave 100 ms.
- **"clock.skip matches stepping tick for tick, honours timeScale and pause, and jumps big gaps fast (step 29)":**
  - **Matches stepping:** a trace with timers at 35, 999 (which subscribes to ticks until 1030), and 1500 (which schedules +10) is identical for `skip(2000)` and 200 × `step()`.
  - **timeScale and pause:** at timeScale 0.5, `skip(2000)` gives 1000; paused, it gives 0.
  - **Speed:** `skip(1e9)` with one timer at 5e8 takes < 250 ms of real time, fires at 5e8 and ends at 1e9.
  - **Bad input:** −1 and 1.5 throw `RangeError`.
- **"the host folder holds only the driver; it imports only the clock, backend and render index, and reads no wall time or globals (step 29)":** `src/runtime/host/` is exactly `["raf-driver.ts"]`. Its imports are only the three allowed paths. With comments stripped by the canvas fence's string-aware rule (r2, F-3), it names none of `Date`, `performance`, timers, `setImmediate`, `queueMicrotask`, `globalThis`, `global`, `window`, `navigator`, `self`, `process`, `eval`, `Function`, `Intl`, `Temporal`, `require`, `Math.random` or `import(`. The import check accepts `"`, `'` and backtick quotes. QA's three evasions, each appended to the real file text, must be caught: `const a = "//"; void globalThis;`, `const b = "//"; import "../input/index.ts";` and `void new Intl.DateTimeFormat();`.

All step 27 and step 28 titles are unchanged and pass, except the one renamed above.

## How a planted bug is caught (for QA; prototype r3 `187ae98`; reverted after each; `/workspace/scratch-ea/s29-plants-r3.py <clone>`; the older `s29-plants.py` and `s29-plants-r2.py` match r1 and r2 strings only)
| Plant (intent) | Named test |
|---|---|
| H1 draws every frame (the dirty gate is gone) | idle: … (and others) |
| H2 `busy()` never asks for a redraw | busy() is false while lost … |
| H3 must-fix reverted: a missing sheet keeps `busy()` looping | a sheet that never loads … |
| H4 a sheet load does not bump rev | a late sheet load … (and others) |
| H5 a failed sheet is re-requested every frame | a sheet that never loads … |
| H6 `world()` after `present` (a stale scene is drawn); H7 a new scene object does not bump rev; H8 `touch()` does not bump rev | world() runs before the plan … |
| H9 dispose leaves the backend listeners and cache; H10 it leaves the visibility listener; H11 it leaves a rAF queued | dispose removes every listener … |
| H12 the 60 cap is ignored; H13 the cap is always on; H14 a capped frame skips the clock; H15 the fractional rAF carry is dropped | a 120 Hz panning view … |
| H16 hidden does not cancel rAF; H17 showing again replays the hidden gap | hidden cancels rAF … |
| H18 no bulk step: a pile-up is clamped to 100 ms | a rAF pile-up … |
| H19 `OffscreenCanvas` is never used; H20 `devicePixelContentBoxSize` is ignored; H21 an observer without the device-pixel box breaks sizing; H22 the css fallback ignores `devicePixelRatio` | dispose removes every listener … |
| C1 QA A-pick reverted: `busy()` true while lost | busy() is false while lost … |
| C2 backend dispose keeps its canvas listeners; C3 it keeps the chunk cache | dispose removes every listener … |
| C4 `stats.missing` is never set | a sheet that never loads … |
| C5 a replaced stale chunk canvas is not zeroed (QA :63 / Q3c) | world() runs before the plan … |
| K1 skip walks tick by tick (no jump); K2 skip ignores timeScale; K3 skip runs while paused; K4 skip jumps past due timers | clock.skip matches … (K4 also a rAF pile-up …) |
| F1 wall time in the driver; F2 the driver imports past the render index | the host folder holds only the driver … |
| F3 a DOM name in the pure render core | the canvas lives only in the backend and the host driver … |
| **r2:** R2-F1 a restore keeps the stale `stats.missing` (stays black) | busy() is false while lost … |
| R2-Q1a the gate ignores `capped` while a sheet is missing; R2-Q1b `stats.capped` is never set | a sheet that never loads … |
| R2-F2 the `stallMs` default goes back to 250 (jank loses sim time) | a rAF pile-up … |
| R2-E1 a `"//"` string hides `globalThis`; R2-E2 a `"//"` string hides `import "../input/index.ts"`; R2-E3 `new Intl.DateTimeFormat()` | the host folder holds only the driver … |
| R2-E4 a nested `src/x/src/runtime/host/raf-driver.ts` with a DOM name | the canvas lives only in the backend and the host driver … |
| R2-N5 `stats.failed` counts after dispose; R2-N6a a throwing `view()` is retried every frame (not at most once a second); R2-N6b a throwing `view()` is not caught | dispose removes every listener … |
| **r3:** R3-F4 a throwing `view()` waits for a `rev` change (the r2 freeze); R3-F4b the once-a-second retry ignores a `rev` change | dispose removes every listener … |

47/47 plants fail their named tests on r3 (r1's 34 and r2's 11, strings adapted, plus 2 for r3). QA's fence probes H2, H3 and H4 (fence29.py) are R2-E1 to E3. The step 28 suites still pass unchanged (the backend changes are additive, apart from the `busy` line). **Greps:**
- `requestAnimationFrame|cancelAnimationFrame` appear only in `raf-driver.ts` (check-law `one-frame-loop`, eslint `RAF_DRIVER`).
- `getContext` appears only in `canvas2d.ts`.
- `OffscreenCanvas|document` appear only in `canvas2d.ts` and `raf-driver.ts`.

## Example
```ts
// the host page (outside src/, or a later app shell)
const clock = createClock();
const driver = createDriver({ env: window, canvas: el, clock, view: () => ({ scene, x: camX, y: camY, s: zoom }),
  load: (id) => fetchImageBitmap(id) /* host side; network stays out of src/runtime */, ...(settings.cap60 ? { capFps: 60 } : {}) });
driver.start();
onWorldEdit(() => driver.touch());            // an in-place world change; a new scene object is seen on its own
onUnmount(() => { driver.dispose(); clock.dispose(); });
```

## Decisions note: what to name
- The placement (`src/runtime/host/raf-driver.ts`, the only rAF owner, no CN), with `env` injected and no DOM lib.
- The frame order: rAF first, then the clock (fraction carried, pile-up via `skip`), then the cap, `view()` once, sizing, the `rev` bumps, the dirty gate, `world()` before `chunkedList`, and the stamp recorded before `present`.
- The missing-sheet rule: one load per id, back off on failure, `stats.missing` blocks busy redraws unless `stats.capped`, a restore clears `stats.missing`, and a load bumps `rev`.
- `stallMs` 100 (the clock's clamp; the sub-tick remainder a `skip` drops is accepted as specced, QA F-2 ruling) and the `view()` throw back-off (retry at most once a second of rAF time, or on any `rev` change).
- `busy()` false while lost.
- `dispose()` on both the backend and the driver.
- The visibility pause with no replay.
- The 60 cap: off by default, with 2 ms slack, and the clock still advancing.
- `Clock.skip`: jump between timers, walk per tick with subscribers, timeScale applied, no-op while paused.
- The canvas factory and sizing fallbacks.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- Everything outside the 7 files, including:
  - the rest of `src/**`: `src/index.ts`, `src/runtime/render/**`, `src/runtime/input/**`, the rest of core, sim and state;
  - `tests/**` other than the 3 test files above;
  - `docs/**`, `handoff/**`, `scripts/**`;
  - `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `eslint.config.mjs`, `BUILD_GUIDE.md`, `tsconfig.json`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**` (including `ui-shell/` and `painter-proto/`), `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 548 (537 + the 11 new tests).
- [ ] `npm run sim` prints exactly the base's two lines, and all 20 smoke lines are byte-identical to `4d9d872`. Pins are unchanged (`61fad786…`, `1e5dd82c…`, `45a3dbaa…`, `4d7bbf48…`, `d7f64a09…`).
- [ ] `git diff --name-status 4d9d872..<head> -- . ':!handback'` lists exactly the 7 files above. ≤ 400 changed lines, and each file is within its cap.
- [ ] The eleven titles above exist verbatim and pass. The renamed step 28 title passes. With each plant in the table applied (and reverted after), its named test fails.
- [ ] The bundle verifies, the tip is the hand-back commit, and nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target
- **L2 real-browser gate (QA ruling 1; before the step 31 look work):** Playwright plus pixelmatch in their own package and lock under `tools/` or a sibling repo, which is a dependency decision. It should prove:
  - the 1× chunk scale-up is pixel-exact;
  - smoothing stays off after a resize;
  - the 120 Hz and 60-cap draw counts hold on a real panel (QA done-means (a));
  - `devicePixelContentBoxSize` matches the backing store at DPR 2.625, 2.75 and 3;
  - a context loss and restore in Chrome redraws.
- **Host shell (QA r1 review):**
  - `DebugPort` wiring (renderer-research row 29): `Driver.stats` (frames, draws, rev, failed, errors) is the feed.
  - Sheet retry: a failed id is never asked again for the driver's life (no engine API; a `forget(id)` if ever needed).
  - The real loader (`createImageBitmap`), outside `src/runtime` (network law).
  - Loaded sheets are never evicted, and a failed id is pinned: dispose and make a new driver on a project switch.
- **Step 28 test gap (EA merge verify):** plant K2 (animated tiles baked into chunks) is caught by "the chunk plan keeps the anim due time …" and not by its named test "chunks draw the same pixels …". In build A's `stage()`, the only water tile (cell 1,1) sits under an opaque `above` tile. Step 30 or 31 should move the water tile under an `above` hole, so the equality test sees animated pixels.
- **Step 30, the world → scene adapter:**
  - It builds `RenderScene` from world and project data. It must keep the scene object **stable** between world revisions (a new object every frame bumps `rev` every frame: 60 draws a second, QA r1) and hand over a new one per revision, or call `touch()`.
  - K2 (below): move the step 28 water tile under an `above` hole.
  - The odd-width anchor rounding test (QA A/B carry 4).
  - The stable `standing` order, the walking-unit offset key, and X6d.
  - Padding `ms[]` if DSK keeps the format rule.
  - A real sheet loader (`createImageBitmap`) lives in the host shell, outside `src/runtime`, because of the network law.
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
  - canopy see-through as a named op (**CEO Q4: OFF by default**).
- **Step 34, perf (QA):**
  - Tune `budgetBytes` and `buildsPerFrame` on devices. Budget 2 chunked layers at 64-px tiles (about 96 MiB on screen).
  - Decide (ARCH) whether chunks are sized in art px (about 256 px) instead of 16 cells.
  - `world()` recomputes every cached chunk's signature on each rev (N-6).
  - The array LRU's O(n) `find` / `indexOf` (A nit).
  - The step 27 allocation carries.
  - The `skip` upper bound (open question 2): with per-tick subscribers a long stall walks every tick.
  - Stop rAF when idle (QA N-3): today rAF calls back at the panel rate with a cheap early return; stop on idle and restart on `touch`, load, visibility or `busy()`.
  - Cap timing (QA N-1): `capFps: 60` gives 45 fps at 90 Hz and 48 at 144 Hz (60 at 60/120 Hz). An accumulating deadline (`next += 1000 / cap`) would give 60.
  - About 5 empty presents a second while lost with animation (QA N-4): `needsDraw` fires on `dueMs` and the backend no-ops. Harmless.
  - **Optional:** fold the `skip` sub-tick remainder into the accumulator losslessly (`accQ += (ms·scaleQ) mod stepQ`, against today's "accumulator untouched" rule), only if device tests show drift. QA measured < 10 ms per stall, about 0.2–0.6 % of stalled time; replay is unaffected (F-2 ruled accepted as specced).
- **Not pinned by a test (QA mutations, harmless today):**
  - E4: chunk canvases set smoothing off, but 1× blits don't depend on it.
  - E9: `beginFrame` resets the composite op, but the draw-level `finally` already guarantees `source-over`.
- **DSK (unchanged):**
  - clip `ms[]` padding vs the fps fallback;
  - the off-size tile clip (`project-format.md:395`);
  - `fps ≤ 0`.
- **Next pin CN (Architect):**
  - depcruise rules for `render`, `canvas` and now `host`: host imports only clock, canvas and render, and nothing imports host;
  - ban `globalThis` / `self` / `window` and `setImmediate` / `process` outside the two DOM files (`canvas2d.ts`, `raf-driver.ts`); a grep cannot see `globalThis["request" + "AnimationFrame"]` in another file (QA);
  - anchor check-law's `one-frame-loop` glob (`!**/runtime/host/raf-driver.ts`) to `src/runtime/host/raf-driver.ts`, so a `src/platform/runtime/host/raf-driver.ts` lookalike is not exempt (QA N-7);
  - **AST-level fences (QA r2 evasions; not chased in step 29):** a depcruise host import rule; eslint `no-restricted-globals` for `globalThis` / `self` / `window` outside the two DOM files (eslint decodes `\u` escapes); possibly a `ts.createSourceFile`-based fence test. QA's examples that the grep fence cannot see: `globalTh\u0069s`; a regex literal `/\/\//` hiding the rest of the line (`globalThis`, or `import "../input/index.ts"`); runtime-built access such as `env["glob" + "alThis"]`, `Object["s" + "elf"]` or `({}).constructor.constructor("return this")()`.

## Out of scope
- The world → scene adapter, image decoding or fetching (network law), input, WebGL2, any light or glow look, palette work, the app shell, Playwright; any change to core-types, the project reader or a format; atlas packing, map-editor decor props, autotiles (parked).

## Open questions (EA → CoS/QA)
1. ~~Expose `stats.capped`?~~ **Ruled YES (r2)**, done.
2. `skip` has no upper bound. A non-hidden 1-hour stall (a debugger pause) runs the full gap. With no tick subscribers that is cheap (it jumps between timers). With the sim's per-tick subscribers it walks every tick. Carried to step 34.
3. Should a failed sheet ever be retried? Carried to the host shell (today never).
