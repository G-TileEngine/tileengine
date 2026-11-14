# Hand-back step-33b1-feel-shake r1
Step file: handoff/steps/step-33b1-feel-shake.md
Kit file sha256: 09f1905c4ad8d9899aaddb9f7ae43d9af41851affa81dc96df51a4ccb48ba69a
Base commit: fa920c56f822ac1e909491234bad8ec009e588f6     Head commit: 5ba62d111304590823da50e1c58426bbad09f579     Branch: step/step-33b1-feel-shake-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/host/raf-driver.ts
M	src/runtime/render/draw-list.ts
A	src/runtime/render/feel.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/scene/feel-shake-qa.test.ts
A	tests/runtime/scene/feel-shake.test.ts

## Green
npm test: 638/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Shipped tests (sha256, unchanged)
e19576f4ef858334b231d2aa828336b71db4e10f1c65822040e61911855c1113  tests/runtime/scene/feel-shake.test.ts
8e8f601af686467a58a9617f421296d5299500bbc3a8491010d69366a90bae74  tests/runtime/scene/feel-shake-qa.test.ts
74260affe6574bd2865a15aa0cee3cdb20e5374762da05cc734eac8d58084887  tests/runtime/scene/motion-shore-live-qa.test.ts

## Decisions & deviations (5–10 lines)
- View time only. `fx:hit`, `fx:end` and the view-hit stay on the timeline. The effect draws through `warp` and stays due until `end + stop`. Units drop their clip and freeze on the frame at the hold start, then resume from that pose with `lagMs` increased by the hold length. A non-positive `stepMs` is treated as 1 ms when rounding a stop up to ticks.
- Holds, the shiver and squash are judged on the pose grid (30 ms, 60 in lite), so the pose-keyed scene cache is not stale. `reduceFlashes` is in that key (`:true` / `:false`). Shake is sampled at raw `tMs`, stored on the link, and recomputed on every clocked `scene()`, including a cache hit. No clock leaves shake at `{0, 0}`.
- The squash id is `<sheet>~sq<cell>~<fw>x<fh>`. `pixels()` nearest-resamples from the bottom row up. The draw list uses `(fw+2)×(fh−2)`, one column, so the auto anchor keeps the feet (1 px left, 2 px down). `fh ≤ 2` and reduce motion skip it. Images stay in the canvas per-id cache and its 120-frame idle drop. A squash alone starts no lag.
- The shake seed is `hash32(mapSeed, effect id, 0, 0)`. Amplitude is `px·(1−u)²` at each 30 ms step aligned to `hitAt`. The largest kick wins; an equal amplitude keeps the earlier kick; then `round` caps the step at 3. Step 0 is `sign(dx)·mag` and `sign(dy)·mag` on both axes. Later steps use `hash32(seed, "shake", step, axis)` per axis. `shake_dir: "none"` forces `dx = dy = 0`. An absent length is 0/120/200/300 by strength. A stored length clamps to 80–400; a non-number plays 80 and notices. Undefined shake px is 0 and silent; any other bad value plays the truncated px (4 or more as 3, negative as 0) and notices.
- The player setting: reduce motion or `"off"` is 0; `"low"` stays 0 when px is 0, otherwise `max(1, floor(px / 2))`; absent or unknown is full. Reduce flashes does not change the shake. `mergeHolds` drops `to ≤ from`, sorts by start then end, and ends a run at the latest end capped 150 ms after its first start.
- The driver builds the draw list and the night layer with `shakeCam` (device px = whole art px times the scale). A camera already past a map edge is not pushed further; an interior camera stops at the far edge, in device px. `steadyUi` adds that delta back onto `ui` commands only, and returns the same list when the delta is 0. The new `camDev` makes `needsDraw` redraw.
- Law 13: one `{ clip, lag, from, ms }` per unit, pruned each clocked `scene()` to the units on screen, and dropped when the clip object changes or the unit leaves (`lagged()` is that size). The same hold (`from` unchanged) is not added twice; a later hold adds the previous length and freezes on the late pose. `mergeHolds` and the kicks are rebuilt each call from the effect list. No new cache. Shake notices use the link's existing dedupe, `code` + NUL + message, capped at 1024.
- Deviation: `LiveOut.holds` is always `{}`. The scene owns unit holds, the shiver, squash and the late offset. The player owns the effect warp, the late end, the shake, `dueMs` and the `outOfRange` notes. `unitOf` is given the raw standing, clip kept, at the frozen then late time, so a follow piece does not follow the shiver. A standing with no clip draws `st.frame ?? 0`.
- Diff against `fa920c56` is 9 files, 303 insertions and 49 deletions (352 changed lines), handback excluded. Caps: feel 67/76, fx-live 81/91, types 34/38, draw-list 69/73, index 17/21, world-scene 122/122, raf-driver 89/93, shipped tests 136/140 and 33/37. No new dependency. The 33i object-sway comment is unchanged. `main` was not committed to.

## Next step (optional proposal)
- Step 33b-2 can pass the resolved tint ramps, `hit_white_mode: "bright"`, and the light radius and ramp, still in view time, without touching this hold or shake clock.
