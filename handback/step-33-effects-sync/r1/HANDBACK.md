# Hand-back step-33-effects-sync r1
Step file: handoff/steps/step-33-effects-sync.md
Kit file sha256: a2ac03051e291c6b7bc9ecc16cbed42722e4ebc617018426b3d971897783beea
Shipped test sha256: 33ce473acf8c6ba32eeb2b2ef947d02170c8a354ca5fb6b90d3f9c006e31c7d4
Base commit: 6f62eb17d5193519f9432a9792749b9f77a18756     Head commit: 5f3f83a3457aba5ae3205ef8ae08e34f26b0a64f     Branch: step/step-33-effects-sync-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/fx/order/read.ts
M	src/runtime/render/draw-list.ts
A	src/runtime/render/fx-player.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
A	tests/runtime/render/fx-player.test.ts

## Green
npm test: 597/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- `FX_PLAYER` is eventCap 16, frameCap 64, lagMaxMs 500, gridMs 30, liteGridMs 60. `toTick` rounds up only when `stepMs > 0`. A note's message is its code, except the two refusal strings.
- Derived contact is the first frame whose poseDelta is strictly greater than the best so far (zero never wins), else `floor(frames / 2)`. Release is that same frame, returned before contact. A non-list that is not null or undefined warns `clipEventInvalid` once and is absent. Over 16 valid entries, the first 16 are kept and `clipEventsOverCap` warns once.
- Centre is `(x + floor(w / 2), y + floor(h / 2))` and head is `(x + floor(w / 2), y)`. Hand and tip use a stored centre when that frame has one. A flipped unit, including foot (the sheet anchor from `anchorPx`), uses `x' = fw - 1 - x`. A point list whose length is not 1 and not `frames` (including an empty list) pads with the last entry or is cut, with one `clipPointsInvalid`. A stored null stays silent.
- A step draws on `[effectStart + at, start + ms)`. A non-finite `stepMs` draws nothing, so the argument is read. Spawn samples the step start; follow samples now; follow plus detach `"hit"` samples `hitAt`; detach is ignored on spawn. A missing unit falls back to the step-start unit, then the caller's tile.
- `tile`, an unknown point, `anchor: "screen"`, or no unit plays at the tile as an overlay. `ground` is `fxGround`, `overlay` is `flash`, and air, unknown, or absent is `fxAir`. `behind-unit` and `front-unit` with no unit, or with a tile, screen, or unknown anchor, are `fxAir` overlays. A unit-attached step is standing `fxBehind` or `fxFront` at the unit's `c`, `r`, `dx`, `dy`, with `ox`/`oy` equal to the point minus the unit anchor (omitted at 0). The drawable frame is always 0. `faceSwap` is set only for `front-unit` when `depth_by_facing` is not false and the unit faces away. `ownLight` is true unless `lit` is `"scene"`.
- `KIND` is object 0, fxBehind 1, unit 2, fxFront 3. `faceSwap` sorts `fxFront` as `fxBehind` and does not change `kind`. `BANDS` is base, fxGround, wash, fxAir, glow, flash, ui. `fxGround` overlays paint after the ground and before standing; the other overlays paint after above. `ox`/`oy` move the drawing only.
- Crossing keeps `t1 < at ≤ t2`, ordered by time then list order. `fx:loop` is `from + k·lapMs` for `k` from `max(1, floor((t1 - from) / lapMs) + 1)` through `floor((t2 - from) / lapMs)`. `lapMs ≤ 0` adds none. A list event at the same time sorts before `fx:loop`. `viewHitMs` does not clamp a negative effect length.
- `readFxOrder` over 64 frames returns `order: null` and `{subject: steps, count: N, limit: 64}`. `stripNote` uses `{subject: strip, count: N, limit: 64, assetId: <id>}` and a refused strip draws nothing. Nothing from 33b is built. N-1 through N-4 are left to the host.
- Diff vs `6f62eb1` is 6 files, 244 insertions and 18 deletions (262 changed lines), handback excluded. Caps: fx-player 107/111, types 31/36, draw-list 67/69, index 14/18, read 114/118, fx-player.test 113/115. `npm test` is 597/0/0/0. `npm run sim` prints the base's two lines (`afc89d56…`, `b8007292…`). `src/index.ts` is unchanged. `main` was not committed to.

## Next step (optional proposal)
- The host hookup step should call `placeStep` and `crossed` each frame, build `FxActor` from the scene, and map `FxNote` onto warnings. 33b (shake, pixel scale, ramps, hit-stop shiver, light punch-out, RotSprite, draw budgets) stays after that.
