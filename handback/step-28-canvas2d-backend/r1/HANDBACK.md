# Hand-back step-28-canvas2d-backend r1
Step file: handoff/steps/step-28-canvas2d-backend.md
Base commit: 6ccd014f74f5af384a2a09b2f0eb66efdf6aeeee     Head commit: 754bdcec3f7239d61679ab5c955329efff49d7f0     Branch: step/step-28-canvas2d-backend-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/runtime/canvas/canvas2d.ts
A	src/runtime/render/chunk-plan.ts
M	src/runtime/render/dirty.ts
M	src/runtime/render/draw-list.ts
M	src/runtime/render/index.ts
A	tests/runtime/canvas/canvas2d.test.ts
A	tests/runtime/canvas/fake-canvas.ts
M	tests/runtime/render/render-core.test.ts

## Green
npm test: 537/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- A glow overlay is always `add`, even when it sets `op: "normal"`. The step 27 draw-list test now sets that and still expects `add`. Every other band keeps `op ?? "normal"`.
- The byte budget is in this step: real `w·h·4`, default 32 MiB, host-settable via `budgetBytes`. Eviction uses `stats.bytes > budgetBytes`, so a cache that only equals the budget stays. A chunk drawn this frame is never evicted. Evicted canvases, canvases cleared on `contextrestored`, and a stale canvas replaced by a rebuild are set to 0×0.
- `present()` draws inside `try/finally`, so `endFrame()` still runs when a draw throws. `beginFrame` restores a clip the previous frame left open before it does anything else. A flip and a `lighter` op each restore in their own `finally`. A missing sprite or chunk image skips that draw and keeps `busy()` true.
- No `phase` under `src/runtime`. No host loop and no slice 29: no `dispose()`, no rAF, no image loading. `chunkedList` is pure and imports only `./<file>.ts`. Canvas files import only `../render/index.ts` or a `./` sibling.
- A visible cell-sized chunk with no static tile is not emitted. Animated tiles stay live draws, and `dueMs` is the minimum of those parts. Off-size layers are not chunked; they go through `buildDrawList`, so the tile-range widening still applies. The new widening assertion is on `buildDrawList` itself.
- A chunk canvas whose `getContext("2d")` is null counts as a missing image (`busy()`, not cached), not a throw. The host canvas's null context still throws `canvas2d: no 2d context`. The fake samples the nearest source pixel with `floor(lx * sw / dw)` and places it at `floor` of the two transformed device edges; `lighter` adds channels and clamps at 255.
- The r2 prototype `8b67eb5` is not in this clone, so this is not a byte copy of it. 8 files, 331 insertions and 4 deletions (335 changed lines), each file within its cap. Kit blob `3ccf5d55…` (`3ccf5d55d7f17cbc21baf60c59d560cb19e3495b`); kit file sha256 `5f55b314f525e96b…`. `npm run sim` is the base's two lines. `main` was not committed to.

## Next step (optional proposal)
- Step 29 should call `world()` before `chunkedList`, bump `rev` on image load, and stop a sheet that never loads from keeping `busy()` true (a failed load should settle to 0 draws a second). Add `dispose()` for the context listeners. The stale-canvas 0×0 swap is implemented here but not asserted (QA r2 nit).
