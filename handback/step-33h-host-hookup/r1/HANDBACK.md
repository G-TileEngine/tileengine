# Hand-back step-33h-host-hookup r1
Step file: handoff/steps/step-33h-host-hookup.md
Kit file sha256: eba81f347701001f6a5f4ae37275676e80ea7623d8cbb2155b4119196938ef5a
Base commit: 49af2cb2fdd88d45f24662a1dca13cb1245de046     Head commit: e701936a22f656e75c2fab5257c645ca3104b6d8     Branch: step/step-33h-host-hookup-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/runtime/render/fx-live.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/scene/host-hookup.test.ts

## Green
npm test: 614/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Shipped tests (sha256, unchanged)
e1dc7ffdda04067ac9d67a2d94d5491dcc3a7bfef6d549c44a6d69400b14f1d8  tests/runtime/scene/host-hookup.test.ts

## Decisions & deviations (5–10 lines)
- The tile foot is `(c * tileW + Math.round(tileW / 2), (r + 1) * tileH)`. `Math.round` matches `px` for a positive tile size. `anchor: "target"` uses the target unit, otherwise `at`; no unit and no `at` draws nothing and warns nothing. `"screen"` and the default caster use the caster's cell. The screen centre stays in 33b.
- Events sort by time, then `fx:start`, `clip:event` (list order), `fx:release`, `fx:hit`, `fx:end`, `fx:loop`. Clip events are at `castMs + frameStart`. `fx:release` is the release clip's time and is omitted when that clip event is absent. `fx:hit` is `hitOffsetMs` from the effect start, else the contact time, else `lungePeakMs`, else cast, all through `hitAt`. `fx:end` is the start plus the greatest finite `at + ms` (0 when that is negative) and is omitted while `loopMs` is finite and greater than 0.
- The one lap is `start + k * loopMs`, `k = floor((tMs - start) / loopMs)`, only when `k >= 1` and that time is inside `(last finite tMs, tMs]`. `crossed` is never asked for laps. A missing, non-finite, or `<= 0` `loopMs` plays once and fires `fx:end`. A non-finite `castMs` is skipped. A non-finite piece `at` or `ms` is not drawn and is left out of the length. `views[id]` is set only when `commitMs` is given and `viewHitMs` is finite.
- Spawn keeps the anchor from the step's first live pose, and that snap is cleared on each new lap. Follow uses the unit now. Follow plus `detach: "hit"` follows until the first pose at or after `hitAt`, then freezes. The store is one entry per effect id still in the list (a map of those snaps) and drops an id the frame it leaves. Clip points sit in a `WeakMap` keyed by the clip; strip warnings sit in a `WeakSet` keyed by the clip object. Both shrink when the world drops those objects.
- `fired` and `views` are replaced on every `scene()` call. A non-finite `tMs` draws nothing, fires nothing, clears the views, and does not move the last finite time. The scene cache adds `poseMs`, `stepMs`, `lite`, and `JSON.stringify` of `effects` only while a finite clock has effects, so one pose keeps one scene object and the string is not kept across frames. `createSeeThrough` runs on the uncut scene, so a flag change rebuilds from the uncut layers.
- `SceneAsset.box` is one box for every frame; absent means the whole frame. `facesAway` is facing `"N"`. `clipIndex` is the frame index, and a 1-frame clip or a non-finite clock returns 0. A step that starts between poses appears on the next pose (up to 29 ms late, 59 in lite); events, hits, and views use the exact clock.
- Diff vs `49af2cb2` is 5 files, 240 insertions and 13 deletions (253 changed lines), handback excluded. Caps: fx-live 75/77, world-scene 103/105, types 31/35, index 15/19. `npm test` is 614/0/0/0. `npm run sim` prints the base lines (`afc89d56…`, `b8007292…`). Motion and shore stay in 33i. Nothing from 33b is built. `fx-player.ts` is unchanged. `main` was not committed to.

## Next step (optional proposal)
- `step-33i-motion-shore-live` should load motion and shore pixels, pass one `foamPx` into both shore calls, bake the shore per chunk, and key strip and loader warnings by asset id plus clip name. 33b stays after that.
