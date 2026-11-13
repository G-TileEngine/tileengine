# Hand-back step-30-world-link r1
Step file: handoff/steps/step-30-world-link.md
Kit file sha256: 589d931c33db27e9762981b4339b6d6f351c061d8e5576de81c5acd061db6054
Base commit: 09f3028e6c3e7b6058d1ed8f0f836a73c30ddc32     Head commit: b9f9cba5703bb726edb4c33187e174253ca21ed4     Branch: step/step-30-world-link-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/runtime/host/raf-driver.ts
M	src/runtime/render/draw-list.ts
M	src/runtime/render/frames.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
A	src/runtime/scene/world-scene.ts
M	tests/runtime/host/raf-driver.test.ts
M	tests/runtime/render/render-core.test.ts
A	tests/runtime/scene/world-scene.test.ts

## Green
npm test: 563/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Placement is `src/runtime/scene/world-scene.ts`. It imports only `../render/index.ts` and the type `Notice` from `../../core/notice.ts`. No sim, state, or game-rule words. `src/index.ts` is unchanged. No CN. The host still builds `Sheet` geometry; the link does not measure images.
- A scene is reused when `assets` and `layers` are the same objects, `objects` and `overlays` are the same arrays (a length-0 array is treated as one shared empty array, so a fresh `[]` still hits), and the units key matches. The key is `JSON.stringify` of `[cols, rows, tileW, tileH, mapSeed]` plus each shown unit, sorted by id, as its own `JSON.stringify([id, sprite, c, r, dx, dy, facing, action])`. A missing offset is stored as null, null. Layers are rebuilt only when `assets` or `layers` changes identity.
- Warnings: `clipFpsInvalid`, `clipMsLength`, and `clipFpsIgnored` once per `SceneAsset` object (`WeakSet`), message `sheet.id`. `clipMsInvalid` once per `Clip` object, message the clip name, checked before the length and fps-ignored warnings. An empty `ms[]` warns for neither. Stored clips are not rewritten. A finite `fps` above 0, including 0.5, is valid and does not warn.
- Off-size tiles sit at `x = c·tileW`, `y = (r+1)·tileH − fh`, native size, rows top to bottom and columns left to right. Culling widens left by `fw` and down by `fh`. The brief's "art (30, 24)" disagrees with that formula and with device (60, 78); the formula wins, so art y is 39. Off-size layers stay unchunked. `chunk-plan.ts` is unchanged.
- Standing order is objects in document order, then shown units sorted by id (UTF-16 code units). A unit standing always sets `key` to its id, so the phase seed is `sheet.id + "#" + key` at cell 0,0. `dx` does not break a feet tie before `c`. Offset fractions become art px (`dx·tileW`, `dy·tileH`). Shown units are the alive ones, plus a not-alive unit whose action is `die`, and only when `sprite` is in `assets`.
- `pickClip`: a null facing is down. The chain is the action then idle, except `die` is die→hit→idle and `idle` is idle only. Inside an action: the exact name, the bare facing only for `move`, then the mirrored side unless `noMirror`, then down, bare, left, right, up. If nothing matches: the first frame of the first clip, or frame 0. §7.3 steps 5 and 7 stay with the host.
- The driver sets `live` only in `start()`, so a show before start does not request a frame. Hide clears `frac` and `lastTs`. The view back-off also ends when `ts < brokeAt`. `skip` throws `RangeError: skip: ms must be an integer >= 0` and passes that host ms to render subscribers unclamped. The `tell` helper is inlined; `clock.ts` is 139 lines.
- QA test-only commit `b9f9cba` on `1bce7c2`, no `src` change. The r29 check matches the clip name anywhere in the notice message. The empty-`ms[]` clip and the 0.5 fps clip sit on their own asset. One settled world uses `tileH` 8, and a new `layers` array is a new scene. `world-scene.test.ts` is 136 lines. Diff vs `09f3028` is 10 files, 254 insertions and 24 deletions (278 changed lines). `npm test` is 563/0/0/0. `npm run sim` is the base's two lines. The 20 smoke lines are unchanged. Pins are unchanged. `main` was not committed to.

## Next step (optional proposal)
- The next pin CN should fence `src/runtime/scene/**`: imports only `render/index.ts` and `core/notice.ts`, and no game-rule words. Moving `ms[]` padding and the clip warnings into the project reader can wait; play-time padding stays until then.
