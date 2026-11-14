# Hand-back step-33b2-light-colour r1
Step file: handoff/steps/step-33b2-light-colour.md
Kit file sha256: 7b7159b91f7cf6fbbbd63a9b3098e15f14f77395a555c4b177a84e15e5450612
Base commit: 88c9061ac2deb6fd40459312106ddc8fd20e6966     Head commit: 3a992de14a5af7881109224277c11277f110ed52     Branch: step/step-33b2-light-colour-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/canvas/canvas2d.ts
M	src/runtime/host/raf-driver.ts
M	src/runtime/render/dirty.ts
M	src/runtime/render/draw-list.ts
A	src/runtime/render/fx-light.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/fx-player.ts
M	src/runtime/render/index.ts
M	src/runtime/render/light.ts
M	src/runtime/render/types.ts
M	src/runtime/scene/world-scene.ts
A	tests/perf/fx-light-budget.ts
A	tests/runtime/scene/fx-light-qa-r4.test.ts
A	tests/runtime/scene/fx-light-qa.test.ts
A	tests/runtime/scene/fx-light.test.ts

## Green
npm test: 657/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
`tests 657 pass 657 fail 0 cancelled 0 skipped 0 todo 0` (also with `--test-concurrency=1`: 657/0/0/0).
`node tests/perf/fx-light-budget.ts` (alone): `fx-light budget (limit 4 ms p95 every lap): lap 1 p50 0.61 p95 3.81 max 7.37 ms (187 frames); lap 2 p50 0.28 p95 0.51 max 2.18 ms (187 frames); lap 3 p50 0.28 p95 0.56 max 3.54 ms (188 frames); counts 1/1/0/4`

## Shipped tests (sha256, unchanged)
b676249220b6ed40cb6469bf4a4869c35b6813fde4a28bd94fe118b8b639b6ba  tests/runtime/scene/fx-light.test.ts
ec38825f89cd07783b80b8cd63c47d28e0c5fd1265183d098a3f95c87d7cc52b  tests/runtime/scene/fx-light-qa.test.ts
5d2deb03de479afa935e45ab874d02d87f32eee97ccdee20c8f2b65903d9bba3  tests/runtime/scene/fx-light-qa-r4.test.ts
dca2f6d81266eebe1db7132edafb6898aa32437b887c6b8bc2798a0516f8f1d6  tests/perf/fx-light-budget.ts
e19576f4ef858334b231d2aa828336b71db4e10f1c65822040e61911855c1113  tests/runtime/scene/feel-shake.test.ts
8e8f601af686467a58a9617f421296d5299500bbc3a8491010d69366a90bae74  tests/runtime/scene/feel-shake-qa.test.ts
7f77be9b0c9ba3eb3637f3c53825d9f745d1b5ee35b085d3644d0f3762702542  tests/runtime/scene/feel-shake-ab-qa.test.ts
b8a05b0a52ccc4fffe9cf7206ac7141443237d88163b7135625b3384aa6f0313  tests/runtime/scene/motion-shore-live.test.ts
74260affe6574bd2865a15aa0cee3cdb20e5374762da05cc734eac8d58084887  tests/runtime/scene/motion-shore-live-qa.test.ts
e1dc7ffdda04067ac9d67a2d94d5491dcc3a7bfef6d549c44a6d69400b14f1d8  tests/runtime/scene/host-hookup.test.ts
e57e2ce854e84596d98d2680020bd42737c215ff60b8ed20ce0b19d54eb72a1a  tests/runtime/render/light.test.ts
6c42bf5b844912212517e45dd48b07fc5276aa18be64a0bc691bd6ca67efbee8  tests/runtime/canvas/light-canvas.test.ts

## Decisions & deviations (5–10 lines)
- Ramps are host `world.style.ramps`, dark to light, lightest last. `rampOf` takes the first key the host has; a missing key is reported and skipped. Light colour is the lightest step of `light_ramp`, else the step `tint_ramp`, else the effect `tint_ramp`, else `#ffb048`. `fxRampMissing` (message = effect id) is once per effect. `snapToRamp` keeps the colour unless `tint_snap` is `"ramp"`, then the nearest RGB step of the step ramp, else the effect ramp, else every host ramp; a tie keeps the earlier step. No export name contains "tint". No game words.
- Radius is tiles 0.5–6 on half-tile steps (`Math.round(stored*2)/2`). Absent is 2 and silent. A snap that stays in range is not a flag. Out of range clamps and flags `outOfRange` / `light_radius`; a non-number plays as 2 and flags. Pop radius steps with `halfCeil` = `Math.ceil(v*2 - 1e-6)/2` over thirds of the step, then 0. The window is `[at, at+ms)`. Lite: one light per effect, and a pop plays as steady. Under reduce flashes a pop that `popIsFlash(R, 64)` counts plays as steady of radius R; a smaller pop still pops. The flash test always uses 64 px, not the art tile.
- The light sits at the placed piece's centre in art px. Unit-layer pieces use the draw-list position (foot, unit dx/dy, ox/oy, anchor) so it matches `drawn.dx+fw/2`. Radius is tiles times `tileW`. `keepInDim` is true. Hold state comes from `unitOf`, never `LiveOut.holds` (still always `{}`). Caps: 2 lit steps per effect in step order (counted even off screen; the 3rd warns `fxLightsOverCap` once), then 4 effect lights in effect order (later ones drop silently).
- The 10 Hz gate keeps one light set. A changed set replaces that object only at 100 ms, or at once when time goes back; until then `dueMs` is the gate (`shownAt+100`). An unchanged set is never re-issued. With no effect light, every clocked frame shares one module-level empty `{ lights: [] }`. A clockless scene returns a fresh empty set. A pop re-plans at most five times. Self-lit pieces moving do not touch the set.
- At night (`present` given `after`) non-self-lit commands draw until the first `ui` command, then `after`, then the held self-lit commands in list order, then `ui`. By day nothing moves. raf-driver passes `after` only when `view.lights` is defined. fx-live marks `ownLight` (`lit` anything but `"scene"`): overlays get `selfLit`; unit-layer pieces omit `sceneLit` unless scene-lit. The draw list copies `DrawCmd.selfLit` only for `fxAir` / `glow` / `flash` and unswapped `fxFront` that no later non-self-lit standing command overlaps (device rects). A later self-lit piece does not demote. Canopy is not checked (seam 23). Behind, ground, face-swapped and covered pieces keep their slot.
- The plan halves torches in the dim; `fullyDark` torches go out; `keepInDim` stays full size. `allDark` during the dim puts out every light without `keepInDim` and does nothing outside the dim; it is not stored. Cache identity is world, torches, wash, dim, res, fx, and `allDark===true` (undefined and false share). Each cell takes its brightest light (`lv > level`); a tie keeps the earlier light. `tint` is 1-based into `colours` (`"r,g,b"`); 0 is the warm glow `255,176,72`. A repeated colour keeps its first index. With no coloured lights the plan keys are exactly `res, w, h, dark, level`. Glow stays the three bands (alpha 2/32, 4/32, 6/32).
- Law 13: one light set (no map); at most 4 lights per call; the plan cache is one entry; the canvas keeps one light-canvas pair; notices go through the link's dedupe, capped at 1024. The water mask is allocated only when a water id list exists; `shore` still runs whenever `style` is set, so a missing water ramp still warns. The overlap scan skips a standing command that is not self-lit.
- Budget split (M-C a): `npm test` checks the rig's counts (1 plan, 1 light-canvas build, 0 fills after the first frame, 4 lights), `judge`, and `PERF`. The 4 ms p95 is only `node tests/perf/fx-light-budget.ts` run alone.
- Diff against `88c9061a` is 15 files, 392 insertions and 65 deletions (457 changed lines), handback excluded. Over 400 because the shipped QA r4 file and the serial perf rig sit outside the proto's suite file (the proto was 417 for that reason) and the live loop inlines the timeline gate instead of building a throwaway event list. Caps: fx-light 49/59, fx-live 100/100, light 86/88, dirty 20/25, draw-list 74/74, types 34/38, raf-driver 89/93, fx-player 106/110, index 18/22, world-scene 122/126, canvas2d 150/154, tests 129/133, 48/53, 33/37, perf 34/38. No new dependency. `main` was not committed to.

## Next step (optional proposal)
- 33b-3 can call `snapToRamp`, `brightPixels` and `cuesSuppressed` for the hit-white recolour. Seam 22 can surface the gate's `dueMs` on `SceneLink`. Seam 23 can give covered self-lit pieces a depth-aware full-colour pass.
