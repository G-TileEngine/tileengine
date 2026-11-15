# Hand-back step-g1-render-tidy r1
Step file: handoff/steps/step-g1-render-tidy.md (sha256 7143a93459a19a213c842689002a4eaa8fcc93b5f70d882c3587173427eaa5e2)
Base commit: e9b8056b16d2afffb9a096f72e47ad559f230472     Head commit: 926ab593f999114ad60d33da5324d6ea2946e755     Branch: step/step-g1-render-tidy-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/render/draw-list.ts
M	src/runtime/render/frames.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/fx-look.ts
M	src/runtime/render/fx-player.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
M	src/runtime/render/world-motion.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/render/render-tidy.test.ts
M	tests/runtime/scene/fx-particles.test.ts
M	tests/runtime/scene/host-hookup.test.ts

## Green
npm test: 712/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` exited 0 and did not change the lock. `npm run green` on the final tree exited 0. Summary from test-output.txt: tests 712, pass 712, fail 0, cancelled 0, skipped 0, todo 0. depcruise: 106 modules, 334 dependencies, no violations.

## Shipped tests (sha256, unchanged)
151e87eff3acf47101759f0e41bec52d182658b504c329565606c95e1c4c62e1  tests/runtime/render/render-tidy.test.ts
28657f7adffd09fe2a973a94e7fb6d82686b66a38f65d496ad07e6f9783be13a  tests/runtime/scene/host-hookup.test.ts
9b934bc902d05f9e23e44ee240907f16f000d4912cfa2b74db40164f14bbc421  tests/runtime/scene/fx-particles.test.ts

## Sims, smoke, pixel suite, stress L
`npm run sim` (unchanged histories):
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
The smoke lines the suite asserts passed inside the 712. Heap line is report-only.

`node tools/pixel-suite/smoke.ts` printed `smoke: 0 failed`. `node tools/pixel-suite/run.ts` matched the pinned L1 hashes (the Base's lines): `chromium L2 frame 1 equals L1 1:150x98:04b5748d`, frame 2 `2:150x98:6865666d`, frame 3 `3:150x98:846e2223`, then `pixel suite: 0 failed; skipped (not installed): firefox, webkit`.

`node tests/perf/stress-budget.ts` exited 0. Stress L, every lap under 2 ms, counts 27/373/0:
```
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.14 p95 1.49 ms; lap 2 p50 1.13 p95 1.50 ms; lap 3 p50 1.13 p95 1.42 ms; counts 27/373/0
```
`tests/runtime/perf-34b.test.ts` was not edited and passed in the 712.

## Helpers & self-review (required)
- Helper "Review G1 rulings vs diff": read the step file and the src/tests diff against rulings 1–9 and the quoted signatures. PASS. footAt is the only tile-foot maths; lookBox/lookId feed the draw list; LiveHold is gone; rgbOf serves hit-white, outline and dots; warning names and the cached-plan re-warn match ruling 5; the wake is ceiled onto the pose grid and merged with fx-live dueMs; dots use hit(); depth order is unchanged; no tools edits. Residual notes, not ruling breaks: turned() still has its own hypot (left as on the Base); clip notices still dedupe per asset object (two distinct objects on one sheet still warn twice); a bake with no parts is not stored, and the next owner re-bakes and still warns.
- Helper "Review dueMs and warning bugs": checked the scene cache, motion tell(), footAt/mid positions, rgbOf, and the per-file caps. Found one bug: a cache hit returned the old scene whenever dueMs was still after the clock, so a rewind or a clockless call kept a light-gate wake of 1200 after the gate had already cleared. Fixed before this hand-back: the cache is used only when the wake just computed equals the cached dueMs, and a dueMs at or before the clock still forces a rebuild. A probe after the fix: 1150 and 1160 share one scene with dueMs 1200; 1200 drops the key; a rewind to 1000 drops it too. Motion warnings, foot positions and rgbOf had no other failures. Caps stayed inside the table (212 total, fx-particles.ts untouched).
- Self-review: Acceptance — green 712/0/0/0 and typecheck, lint, deps, check:law, check:state exit 0: done. Three shipped files byte-identical to the step sha256s: done. Sims 48/2 and 22/28 and the suite's smoke pins unchanged; `git diff e9b8056b --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/core src/sim tools` empty: done. smoke.ts `smoke: 0 failed`; run.ts L1 hashes are the fixture's pinned Base lines: done. Changed lines 212 (150–400); per file frames 2/8, draw-list 23/40, fx-player 5/8, fx-live 21/30, fx-look 8/20, types 2/4, index 6/8, world-motion 13/14, world-scene 33/50, fx-particles 0: done. perf-34b passed unchanged; stress L p95 1.49/1.50/1.42 ms, counts 27/373/0: done. Each ruling's pin is in the shipped render-tidy file and passed: done. This hand-back is the branch's last commit: done. QA G1–G10: G1 shipped hashes and 712/0, plants script not on this machine (`/workspace/scratch-ea` absent); G2 tsc 0, no new ignore/any; G3 check:state OK, no state edits; G4 quoted signatures match; G5 do-not-touch diff empty; G6 only the step's 12 files; G7 212 lines, every file under its stated cap; G8 check:law OK; G9 decisions below match the diff; G10 acceptance lines above: done.

## Decisions & deviations (5–10 lines)
- The depth key is `footAt(...).y`, computed once per standing before the sort, then column, rank, z and the original index. That is the old `(r+1)*tileH+dy` expression, so draw order stays byte-equal and the comparator does not call footAt.
- `px` (`floor(v+0.5)`) replaces `Math.round` at the at-cell point. They are equal for every tile width ≥ 0. `footAt` is the only copy of that maths in `src/runtime`.
- The warning name is built in `world-scene.ts` (`who`): the `world.assets` key, `#tile` only when that tile's `tileProps` has its own motion or anim, and ` (sheet <id>)` only when the sheet id differs. `world-motion.ts` `tell` writes that name, or `name: <hint>` when the bake or the animated path has a hint. A cached plan stores its notices and warns again for a new owner. Shore warnings stay on the old `warn` path. Clip notices still dedupe on the asset object, as on the Base.
- The hit-white edge uses `hitWhiteMs().ms` unrounded. The wake is the first pose at or after that edge: `Math.ceil(edge / grid) * grid`, where grid is `FX_PLAYER.gridMs` (30) or `liteGridMs` (60), the same constants `poseMs` uses. It is merged with fx-live's dueMs by taking the earlier finite time. The key is omitted when the result is not finite.
- A cached scene is rebuilt when its dueMs is at or before the clock, and also when the wake just computed is not the cached one (a rewind or a clockless call must not keep a gate time the player has already cleared). A future wake that is still the one just computed keeps the same scene object.
- Light colours and motion ramps stay 6-digit only (`fx-light.ts`, `light.ts`, `motion.ts` untouched). Dots use the sprite `hit()` box, so a dot partly on screen draws. No new cache: plan notes sit on the existing plan map (already capped at PLANS_MAX). No deviation from the file list, and no new dependency.

## Next step (optional proposal)
- G2b is the next named carry (`pixScale`, `Standing.op`, light centre times scale, particle fields, looks on squashed sprites, ui-band dots). Not started here.
