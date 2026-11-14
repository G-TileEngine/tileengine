# Hand-back step-33i-motion-shore-live r1
Step file: handoff/steps/step-33i-motion-shore-live.md
Kit file sha256: a5d50c75973e069228b0528d6d1bff0f1a906e4d65bf0927209a0c25cefaf7f3
Base commit: 6eacd03ca2701dbc0e7fd7a974ff737b031af006     Head commit: c9fdc7f9a2d72fc40f8c8613d0132cfad2f99538     Branch: step/step-33i-motion-shore-live-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/canvas/canvas2d.ts
M	src/runtime/host/raf-driver.ts
M	src/runtime/render/chunk-plan.ts
M	src/runtime/render/dirty.ts
M	src/runtime/render/draw-list.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/index.ts
M	src/runtime/render/motion.ts
M	src/runtime/render/types.ts
M	src/runtime/render/water.ts
A	src/runtime/render/world-motion.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/scene/motion-shore-live.test.ts

## Green
npm test: 628/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Shipped tests (sha256, unchanged)
b8a05b0a52ccc4fffe9cf7206ac7141443237d88163b7135625b3384aa6f0313  tests/runtime/scene/motion-shore-live.test.ts

## Decisions & deviations (5–10 lines)
- Tiles call `motionAt` with xArt 0 and hash 0, so one kind shares one pose. Objects pass xArt `c·tileW + dx` and `hash32(mapSeed, sheet id, c, r)`. Sway adds `waveOffsetMs(xArt, n·ms)` (45 px/s) and ignores the hash; other parts add `hash % (n·ms)`. `nextMs` is the next pose boundary. A non-finite clock is pose 0 and `dueMs` `Infinity`. An animated cell warns `ANIM_HINT` and attaches nothing, the same early return as `bakeMotion`.
- The atlas id is `<sheet id>~m<tile>~<hash>s<fw>x<fh>`. Objects use tile 0. The hash is `hash32(0, JSON.stringify([motion, ramps ?? null]), 0, 0)`. Ramps are in that string only when the asset is `styled`. Frames are one row. The plan LRU holds 1024 recipes. Motion warnings are once per owner, code, and message, and the set stops at 1024.
- Shore ids are `shore~<rev>~<cx>,<cy>`. `rev` starts at 0 and increments when geometry, `foamPx`, frame count, colours, or the water bytes change. Each chunk includes neighbour land within `SHORE_MAX` (32 px) and passes that window's origin as `shoreDistance`'s `ox, oy`. Reduce attaches no motion and draws foam at frame 0 with no clip. `shoreInvalid` is the plain code; the message names the field. Water is the last visible ground layer's tiles listed in `waterTiles[tileset]`.
- A strip warns once per clip object per sheet id: 64 ids are stored on a `WeakMap`, the next new id warns and marks the clip full, and later ids are silent. Link notices dedupe by code and message across `scene()` calls, keep repeats inside one call, and stop at `NOTICES_MAX` 1024. The seen set is filled at the end of the call and never cleared.
- `present`'s `after` runs before `endFrame`. The driver passes `View.lights` there and bumps `rev` when the plan object changes. `pixels` is tried before `images`. A generated image is one canvas per id, counted in `stats.bytes`, and dropped after 120 unused frames. `frame` treats `image.width / fw` as the column count. `createSceneLink()` with no source still plans through an empty frame source, so 33h behaviour holds when nothing asks for pixels.
- Diff vs `6eacd03c` is 13 files, 338 insertions and 60 deletions (398 changed lines), handback excluded. Caps: world-motion 74/80, motion 78/82, types 34/38, water 33/37, chunk-plan 38/42, dirty 18/22, draw-list 68/74, fx-live 74/78, index 16/20, world-scene 114/120, canvas2d 150/150, raf-driver 88/90, shipped test 162/166. Bake bytes stop at 32 MiB. One shore state. `main` was not committed to.

## Next step (optional proposal)
- Step 34 can cut the canopy as a chunk overlay, bound the driver's image map, and re-bake only the dirty shore chunk after a dig instead of bumping `rev` for the whole map.
