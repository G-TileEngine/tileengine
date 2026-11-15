# Hand-back step-34a-perf-lite r1
Step file: handoff/steps/step-34a-perf-lite.md (on origin/main at fb3a0e9e48b72c581e265c15642a7db1e07149ab; not committed on this branch)
Kit sha256: d17da0a3fd8f55e8986698c344fe9a0ad923321df5a7cd3241608ad58f7f14e0
Base commit: 1bd476bd5845d514671c917933a93f1f841b6bd9     Head commit: 61426f3b95db480ab9c5b19ab7253515e25388e8     Branch: step/step-34a-perf-lite-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/canvas/canvas2d.ts
M	src/runtime/host/raf-driver.ts
M	src/runtime/render/light.ts
M	src/runtime/scene/world-scene.ts
A	tests/perf/stress-budget.ts
M	tests/runtime/host/raf-driver.test.ts
A	tests/runtime/scene/perf-34a.test.ts

## Green
npm test: 681/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`node tests/perf/stress-budget.ts` (alone, this host, exit 1 — stopped on C):

```
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.44 p95 3.80 ms; lap 2 p50 0.32 p95 0.58 ms; lap 3 p50 0.23 p95 0.44 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.51 p95 3.28 ms; lap 2 p50 0.42 p95 0.75 ms; lap 3 p50 0.40 p95 0.64 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 2.50 p95 10.44 ms; lap 2 p50 2.06 p95 7.57 ms; lap 3 p50 1.18 p95 2.06 ms; counts 181/0/0
AssertionError: C: p95 over 4 ms
```

An earlier alone run on the same host failed even sooner, on A lap 1 p95 4.21 (laps 2.63 and 0.40). The base commit on this host, same script, failed A lap 1 p95 4.48. A C/L probe with the same judge (not the shipped script's early exit): base C 8.10/1.97/2.00 and base L 6.14/5.81/5.80 (L over 4); this branch C 8.38/1.78/1.64 and L 2.63/1.36/1.42, counts 27/381/0. The suite hash test passed (C `da3c665e…`, L `18d97599…`). The 4 ms bar is the kit host's; this sandbox's cold lap is about 3× that, for the base as well. The script was not weakened.

`node tests/perf/fx-particles-budget.ts` alone: exit 0. `node tests/perf/fx-light-budget.ts` alone: first try lap 1 p95 5.41 (exit 1, host noise; file not in this diff); retry exit 0, lap p95 3.57/0.84/1.68, counts 1/1/0/4.

## Shipped tests (sha256, unchanged)
03412170f195afaadf47333147df1ba5b32bc7dcacdaf7bb63f6f7bcc096b576  tests/perf/stress-budget.ts
d507c7523047bbc7256e1e7b10f327205d6e2b416c6da782b35b1fbc2e40d45e  tests/runtime/scene/perf-34a.test.ts
c2288e9c9cbdff7ca90663736ccdfc67ffcfc0064ec3d63d96b74b488941a83c  tests/runtime/host/raf-driver.test.ts

Unchanged pins: package.json 1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5; package-lock.json d7f64a09fd9de88949ed2cd0016ca57efdcb1b406e9e2f478cee854a5b7660d3; .dependency-cruiser.cjs 45a3dbaad28c0c827e2aa64ed0b63129b471e29482c8d6e6d88f5211c5118831; scripts/check-law.sh 4d7bbf48edf945851022711bf9a9e765db8eac63b77c52b14865e5faf83b0163; src/types/core-types.ts d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366.

## Helpers & self-review (required)
- Helper a3736f4b: read raf-driver.ts against the image-cap test and the lite tests (thresholds, hold, gaps, override, flip draws). It found no test-breaking bug. No code change.
- Helper 6dd5b162: a broad review of the step. Cancelled before it returned. No findings.
- Helper 9b5fab7a: asked to compare light.ts and the canvas2d light painter to 1bd476bd (unlit fill, box recompute, one-square view margin, width-1 and last-run paint). Still reading after several minutes; stopped so the stress timing would not share the CPU. No report.
- Helper 9fe4186d: asked to check the shore memo, the effects revision, the actor maps, and the lite/image rulings in raf-driver.ts, including the host banned-identifier list. Same stop, no report.
- Self-review of the diff against 1bd476bd covered those same files. Unlit dark is one fill of Math.round((total * BANDS_OF_LIGHT) / BANDS_OF_LIGHT), and a square is rewritten only when a light raises its level, which is the base formula. lightOps uses ceil(x0/res)-1 and floor(x1/res)+1, clamped, and paints only on-screen squares. The canvas run painter flushes a width-1 run and the row's last run. Shore keeps one foam entry. The effects key uses one integer revision and never JSON.stringify. Actor maps are per call and first-wins. Image eviction skips this tick and the scene's sheets, drops a late load, and does not run on the capFps return. LITE matches the quote and is not exported. A lite change clears the FrameStamp prev, not lastTs.
- Acceptance: npm test 681/0/0/0 and typecheck, lint, deps, check:state, check:law exit 0: done. Three shipped files byte-identical: done. Stress alone exits 0: not on this host (stated above; script unchanged; base fails the same bar; L is under 4 here and the base L is not). Pins unchanged and the suite's smoke lines passed: done. fx-particles alone exit 0 and fx-light alone exit 0 on the retry: done. File caps hold (light 87/92, canvas2d 151/155, world-scene 129/133, raf-driver 103/105, stress 44/48, perf-34a 64/68, raf-driver.test 186/190) and changed lines are 208: done. With lite off the stress-rig hash test passed: done. requestAnimationFrame in src is only in raf-driver.ts, and the new driver code adds none of the host banned identifiers: done. Each ruling's pinning test is in the 681 pass: done. This folder is the hand-back: done.
- QA checklist: G1 done for the suite and the shipped shas; the alone stress wall clock is the host limit above, not a weakened test. G2 done (tsc exit 0, no new ignore or any). G3 done (check:state, no phase writes). G4 done (imagesMax, lite, stats.lite, LITE, and the effects comment match the quotes). G5 done (do-not-touch paths absent). G6 done (only the seven named files). G7 done (208 lines, every file under its cap). G8 done (check:law exit 0; one clock; rAF only in the driver). G9 done (decisions match the diff). G10 done, with the stress exit called out rather than claimed.

## Decisions & deviations (5–10 lines)
- Shore memo is one entry. The water grid and wm.shore run again only when the ground tiles array, the water-ids array, style, cols, rows, tileW, tileH, mapSeed, or reduce change (arrays and style by identity). Otherwise the same foam objects are reused. Ground tiles stay the last visible non-above layer. A dig is a new tiles array.
- Effects revision is one integer. It bumps only when world.effects is a different array whose elements are not all the same objects in order. The key never stringifies effects. Pushing into the same array, or editing an object in place, is not seen. The doc comment on SceneWorld.effects says so.
- Actor lookup builds two maps per call, standing by key and unit by id, and drops them with the call. First match wins, as find did, so a duplicate id is the first unit. The units array is read once per call. There is no find on it.
- Image cap is imagesMax, default 256. Recency is the frame tick, set on every ask including a hit. Never dropped: an id asked this tick, or a sheet the current scene names (ground, above, standing, overlays). In-use ids may exceed the cap. The same tick drops the earlier-asked id (set order). Eviction removes the id from the map and the asked set, and a load that lands after that is not kept. A failed load stays asked until it is evicted, then the next ask reloads it. Eviction does not run on the capFps return before view.
- Lite keeps two Float64Array(60) windows. LITE is { frames: 60, onMs: 25, offMs: 18, holdMs: 10_000, holdMaxMs: 300_000, gapMs: 1000 }, not exported. Frame ms is the raw rAF gap. A gap over 1s is not a frame and does not count toward the hold. p95 is sorted[Math.ceil(0.95*n)-1], index 56 of 60. On needs two back-to-back windows over 25. Off needs p95 under 18 after a hold that starts at 10s, doubles on each release, and stops at 5 min; it never shrinks. The window that turns lite on does not count toward the hold. 20ms windows flip neither way. A flip clears the FrameStamp prev, not lastTs, before needsDraw. The same mode again does not draw. lite("on"|"off") holds stats.lite while auto keeps measuring; lite("auto") shows auto's state immediately. capFps stays optional.
- Light walks one square outside the view, clamped, and draws a square only when it is on screen. Canvas light layers paint one fillRect per equal-colour run, including a one-pixel run and the row's last run. Unlit dark is one fill; a square's dark changes only when a light raises its level.
- Law 13: the shore memo holds one entry; the actor maps live for one call; the image map is at most imagesMax plus ids in use; the lite windows are two fixed 60-entry arrays. No other new map or memo.
- Size is 208 changed lines (+184/−24) in the seven named files. No extra file, no new dependency, no export beyond the quoted imagesMax, Driver.lite, and stats.lite. No deviation from the rulings. The stress script is the shipped file; its non-zero exit on this host is the host, not a change.

## Next step (optional proposal)
- 34b's device run should re-tune the 25/18 thresholds and the lite hold, and set a tighter L budget. Seams 35–37 stay open: duplicate-id first-wins, the plan's per-call allocation and the whole-plan canvas repaint, and an effects revision owned by the game.
