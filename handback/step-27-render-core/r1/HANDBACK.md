# Hand-back step-27-render-core r1
Step file: handoff/steps/step-27-render-core.md
Base commit: 2da0d02d584c45f3cbf7002b9d914d1583de0042     Head commit: 17c6852dd1fb306a726e8ed634129538d84dd3b4     Branch: step/step-27-render-core-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/runtime/render/camera.ts
A	src/runtime/render/dirty.ts
A	src/runtime/render/draw-list.ts
A	src/runtime/render/fit.ts
A	src/runtime/render/frames.ts
A	src/runtime/render/index.ts
A	src/runtime/render/types.ts
A	tests/runtime/render/fake-renderer.ts
A	tests/runtime/render/render-core.test.ts

## Green
npm test: 529/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Prototype commits `6d9799f` and `e9dda3d` are not in this clone, on origin, or on Drive, so the source was written from the step and the published r2 review instead of copied byte-for-byte from r1. This branch does not claim byte identity with `6d9799f`.
- `px` is `floor(v + 0.5) + 0` (half up, never `-0`). The odd letterbox pixel is `floor(remainder / 2)`, so it sits on the right and the bottom. `snapScale` rounds, then clamps into `[sMin, sMax]`. `sMin` is `ceil` of the fill ratio, then clamped to `[1, zoomMax]`.
- `easeCamera` is the smoothstep `t * t * (3 - 2 * t)`. `easeMs <= 0`, or a finished span, returns the target. `clipMs` uses `ms[i]`, else `1000 / (fps ?? 8)`, half-up onto a whole `stepMs`, at least one step (fps 6 at a 16 ms step is 160). `frameAt`'s `nextMs` stays on the caller's `tMs` timeline; a looping negative time wraps; `loop: false` past the end holds the last frame with `nextMs` Infinity.
- `hash32` is FNV-1a 32-bit (offset 2166136261, prime 16777619): seed, `c` and `r` as 4 little-endian bytes (`>>> 0`), then each UTF-16 unit low byte then high. The pin is `hash32(7, "tree", 3, 4) === 1909584459`. `instanceOffset` is that hash modulo the loop. Tiles use offset 0.
- A glow overlay with no `op` is `"add"`; every other overlay is `"normal"` unless `op` is set. An overlay's `dueMs` is `startMs` plus the local `nextMs`. The cull window is `floor(dev / s)` through `+ art + 1`, and `frameAt` runs only after that test. Standing things still pay `anchorPx` and `instanceOffset` before the cull.
- The sort key is `(footY, c, kind, z ?? 0, input index)`, object before unit, even when the unit's `z` is `-1`. An absent or `"auto"` anchor is bottom-centre. `norm` multiplies by the frame size; `px` is already pixels. The foot point is `(c * tileW + px(tileW / 2) + dx, (r + 1) * tileH + dy)`.
- `needsDraw` treats `rev` with `!==` (a rev going down redraws), redraws when `tMs >= dueMs`, and redraws when the clock goes backwards. The own-folder fence is this step's test: a string-aware comment strip, `import(` forbidden, specifiers only `./<file>.ts`, and the step's banned-name list with nothing added. No depcruise rule and no CN. `main` was not committed to.
- 9 files, 368 insertions and 0 deletions, each file within its cap (frames 44/44, fake renderer 34/34, test 123/134). This chat uploads `step-27-render-core-r1-chatB.bundle` and `HAND-BACK-step-27-render-core-r1-chatB.md`. No other Drive file is moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 28 should clip draws to the art rect (a partial edge tile currently paints into the 1 px letterbox) and set `imageSmoothingEnabled = false` after every resize. The next pin CN should add `render-imports-only-own-folder` and say who may import render. Repo-wide, check-law still misses `setImmediate` and `process.hrtime`.

## Kit files used
- The step paste was supplied as an attachment. `handoff/steps/step-27-render-core.md` is not in the base tree, so it was not copied onto this branch.
