# Hand-back step-29-frame-driver r1
Step file: handoff/steps/step-29-frame-driver.md
Base commit: 4d9d872b34fc8b375df152d4873c607673e3475c     Head commit: b9dc4577f3cdb9ddc34dc33af05773b2efa2ee9c     Branch: step/step-29-frame-driver-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/core/clock/types.ts
M	src/runtime/canvas/canvas2d.ts
A	src/runtime/host/raf-driver.ts
M	tests/runtime/canvas/canvas2d.test.ts
M	tests/runtime/canvas/fake-canvas.ts
A	tests/runtime/host/raf-driver.test.ts

## Green
npm test: 548/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Placement is `src/runtime/host/raf-driver.ts`, the only rAF owner, no CN. `env` is injected and the driver names no DOM global. It imports only the clock index, the canvas backend, and the render index. `src/index.ts` is unchanged.
- Frame order: request the next rAF first, then the clock (the fractional millisecond is carried; a gap above `stallMs` 100 uses `skip`), then the cap (off unless `capFps` is set, 2 ms slack, the clock still advances), `view()` once, sizing, the `rev` bumps, the dirty gate, `world()` before `chunkedList`, and the stamp recorded before `present`.
- A sheet is loaded once per id and never retried. `stats.failed` does not count a rejection after `dispose()`. `stats.missing` and `stats.capped` are the frame just ended. `capped` is set only when a chunk whose image is already loaded is deferred past `buildsPerFrame`. A restore sets `stats.missing` false. `busy()` is false while the context is lost. A load, a new scene object, and `touch()` bump `rev`.
- A throwing `view()` is counted in `stats.errors`, then retried at most once a second of rAF time, or at once if `rev` changes. A successful `view()` clears that backoff. `dispose()` on the backend and the driver is idempotent: listeners, the observer, the rAF handle, the chunk cache, and the sheet maps all go.
- Hiding the page cancels rAF and forgets the frame time, so the hidden gap is not replayed. `Clock.skip` jumps between due timers when nothing is subscribed, walks tick by tick once a subscriber appears (and calls that subscriber for the tick it joined), applies `timeScale`, leaves the accumulator alone, drops the sub-tick remainder, and does nothing while paused.
- `makeCanvas` uses `OffscreenCanvas` when the env has one, otherwise `document.createElement("canvas")`. The observer asks for `device-pixel-content-box` and, if `observe` throws, observes with no box. Exact backing size comes from `devicePixelContentBoxSize`; otherwise it is css size times `devicePixelRatio`. Clear defaults to `#000000`. `buildsPerFrame` stays the backend's 2.
- The r1–r3 prototypes (`6df65b1`, `4487e82`, `187ae98`) are not in this clone, so this was written from the step and the r3 review, not copied. The tests use a 24×16 map of 16 px tiles, a 160×96 view, ground colour `0x224466` and above `0x88aa44` on 64×16 rasters, and a scene object that stays the same across frames. Salt also moves the above tiles so a new scene zeroes every previous chunk canvas. Fake rgba is stored unsigned (`>>> 0`) so it matches a `Uint32Array` read.
- 7 files, 263 insertions and 9 deletions (272 changed lines), each file within its cap. `npm test` is 548/0/0/0. `npm run sim` is the base's two lines. Pins are unchanged. `main` was not committed to.
- Test-only fix, no `src` change. The hidden test runs 0.5 s before hiding, and `dispose` asserts the rAF queue is empty before the next second. `raf-driver.test.ts` stays 146 lines. Kit file sha256 `8b0b7ec5f6c9e9b724879f0c44896be63a535a91d09b6b5ddcdc5d3c838c6fb5` (`handoff/steps/step-29-frame-driver.md` on origin/main, not copied onto this branch).

## Next step (optional proposal)
- Step 30 should keep one scene object between world revisions (a new object every frame bumps `rev` every frame) and move the step 28 water tile under an above hole so the chunk pixel test sees the animation.
