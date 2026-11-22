# Hand-back step-06d-baseline-page r1
Step file: docs/maker/steps/step-06d-baseline-page.md (r2, blob 763196206de1ad427f59073b6141c75903273161, sha256 04bc1e26a622f2f3e0e91f33884180c87c1e77db67cfdab8c0fd9535186761d0).
Base commit: cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b     Code head: b5667b30cfe01907beb1d11b23e4081f4d223bc0     Code head tree: 413afef075053f6a73c86380b60cb4ce85053313     Branch: step/step-06d-baseline-page-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	handoff/steps/tests/s6d-baseline/smoke.mjs
A	tests/tools/baseline-page.test.ts
A	tools/baseline/build.ts
A	tools/baseline/checkpoint.ts
A	tools/baseline/index.html
A	tools/baseline/page.ts
A	tools/baseline/readout.ts

The tip adds only this folder (this note and `01-baseline.png`). No product file outside the step table. No edit under `src/`, `tools/play-stage/`, `tools/maker/`, `tools/device-page/`, `fixtures/`, `data/`, `behaviour-library/`, `handback/step-06c-checkpoint/`, or any existing test.

## Green
N = 3. Floor 1105 + 3 = 1108. The Base is docs-only on `c829fcb7` (1105/0). `npm test` 1108/0/0/0. typecheck exit 0. lint exit 0 (`eslint --max-warnings 0`). deps exit 0 (172 modules, 492 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs. `npm ci` (lockfile, 135 packages) was already done on this checkout. `npm run green` on the code-head tree, before the product commit, exited 0. No product file changed after that.
`tests/project/load/one-parser.test.ts` is unedited. `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:79` twice). None are in `tools/baseline/`.
Node's test runner prints `ok`, not `✔`.
```
# tests 1108
# pass 1108
# fail 0
# skipped 0
# todo 0
```
```
ok 1018 - baseline page opens the checkpoint project
ok 1019 - baseline readout maths on a fixed frame list
ok 1020 - baseline build ships the checkpoint and no maker or editor code
```
Line count at the code head, `git diff --shortstat cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b..HEAD -- . ':!handback/**'`: 7 files changed, 162 insertions(+). 162 + 0 = 162. Caps: checkpoint 14/16, readout 18/22, page 19/24, html 7/8, build 28/28, test 38/55, smoke 38/45.

## Smoke
No `tools/play-stage/` file changed, so there is no export audit and S0 was not required.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell. Port 8808. `node handoff/steps/tests/s6d-baseline/smoke.mjs . 8808`.
The page loads from `/baseline-06c/`. Waits are `waitForFunction` (N ≥ 120, 20 s). No `waitForTimeout`. Node printed `ExperimentalWarning: stripTypeScriptTypes` while importing the builder, before the ok lines, on every run. That is not a page error: check 7 is quiet. The eight CPU loops were killed after the loaded run. No burn loop was left.
Under eight `node -e 'for(;;){}'` loops:
```
ok   1 board @390: 390x664
ok   2 frames @390: 16.6 16.8 116.6
ok   3 dropped @390: 4 1 of 126
ok   4 canvas @390: 1
ok   5 heap @390: 9.5
ok   6 gc @390: line
ok   7 quiet @390: ok
ok   1 board @360: 360x664
ok   2 frames @360: 16.6 16.8 100
ok   3 dropped @360: 5 1 of 125
ok   4 canvas @360: 0.9
ok   5 heap @360: 9.5
ok   6 gc @360: line
ok   7 quiet @360: ok
SMOKE PASS
```
Idle, first:
```
ok   1 board @390: 390x664
ok   2 frames @390: 16.6 16.7 33.4
ok   3 dropped @390: 1 0 of 122
ok   4 canvas @390: 1
ok   5 heap @390: 9.5
ok   6 gc @390: line
ok   7 quiet @390: ok
ok   1 board @360: 360x664
ok   2 frames @360: 16.6 16.7 16.8
ok   3 dropped @360: 0 0 of 122
ok   4 canvas @360: 0.9
ok   5 heap @360: 9.5
ok   6 gc @360: line
ok   7 quiet @360: ok
SMOKE PASS
```
Idle, second (this run wrote the screenshot below):
```
ok   1 board @390: 390x664
ok   2 frames @390: 16.6 16.7 33.4
ok   3 dropped @390: 1 0 of 121
ok   4 canvas @390: 1
ok   5 heap @390: 9.5
ok   6 gc @390: line
ok   7 quiet @390: ok
ok   1 board @360: 360x664
ok   2 frames @360: 16.6 16.7 33.4
ok   3 dropped @360: 1 0 of 121
ok   4 canvas @360: 0.9
ok   5 heap @360: 9.5
ok   6 gc @360: line
ok   7 quiet @360: ok
SMOKE PASS
```

## Build
`node tools/baseline/build.ts /tmp/s6d-rel/baseline-06c` on the clean code head `b5667b30cfe01907beb1d11b23e4081f4d223bc0` (tracked tree clean; the hand-back folder was still untracked, and `refuse` ignores untracked files). Exit 0. The folder holds 140 files, 661374 bytes: 139 paths in `build.json`'s `files` map, plus `build.json` itself. `build.json` sha256 `f8eb6586c6f1fef51d37c7454319b2f7dfab489ac649eb95bbf9cdce128af243`. Its `commit` is the code head, `node` is `22.23.3`, `entry` is `index.html`. Canvas MB counts on-screen canvases only: the sum of `width * height * 4` over every `<canvas>` in the document. Offscreen sprite canvases are not in the document, so they are not counted.

## Screenshot
`01-baseline.png` is the 390 shot from the second idle smoke, 390×844, light. The context is device scale 3; the file is CSS pixels (`scale: "css"`), so it is 390×844 and not 1170×2532. The check read the readout at 121 frames; the shot is a moment later, so the text in the file says 123. Caption names only what is in the frame.
- Top bar: YOUR TURN, and Menu.
- The readout: `baseline 06c · Skirmish (checkpoint.tileproj)`; `frame ms p50 16.6 p95 16.7 max 33.4`; `dropped (>25 ms) 1 over 50 ms 0 of 123`; `canvas MB 1.0 · dpr 3.0`; `heap MB peak 9.5`; `GC: n/a (browsers don't expose it)`.
- The board is a dark field with one wide gray-brown band across the lower middle. No unit name, no health number, and no level strip is readable. End turn sits at the bottom right. The page below the board is white.

## Helpers & self-review
- Helper `b1c7df77-1d3f-4313-b9a7-0b102d105baf` (boot, clock, readout): Rules 4–7 and the fixed-list maths. Pass. No change. It checked the missing `#board`, prepend, the failed-open sentence, one host-rAF wrapper before `startMatch`, the lock, `prev` at `-1`, the six readout lines, and that `play-stage/page.ts` looks up `requestAnimationFrame` at call time.
- Helper `cee93845-2d02-499a-b9f1-ff2f068a9b31` (build, tests, smoke): the eight JSON imports, release build, the three test titles and their asserts, the smoke port and checks, and the caps. Pass. No change it asked for. It counted the test at 37 lines, before the boundary asserts below.
- Self-review, after those notes: the first smoke's server logged `missing /index.html` for a request to `/` (the page is `/baseline-06c/`). The catch still returns 404, and it no longer prints. The png uses Playwright `scale: "css"` so the committed shot is 390×844. The fixed list has no gap of 25 or 50, so the readout test now also checks those edges. A first try expected `[25, 50]` to have dropped 0; 50 is dropped because it is over 25. That assert was corrected before `npm run green`.
- Self-review: Done when — green 1108/0, the three named tests, tools tsc clean for `tools/baseline/`, count 162 with every cap kept, smoke three times (one under CPU) with 14 ok lines and `SMOKE PASS`, the build on the code head, and the 390 screenshot. No play-stage edit, so no export audit. Done.
- Self-review: QA G1–G10 — G1 the named tests fail if the key list, the open, the 6×6 contest, a null outcome, the `startMatch` call, a forbidden source word, the frame maths, a `>=` threshold, the exact readout, a missing checkpoint file, maker or editor output, or a dev-only line is wrong, G2 typecheck clean and no new `any`, G3 no phase writes, G4 no new quoted signature, G5 no existing file edited, G6 only the seven files in the step table, G7 162 and each cap kept, G8 one clock and the gaps list stops at 60 s, G9 this note, G10 the page opens the dumped project and the smoke shows the readout. Done.

## Decisions & deviations
- Overlay values the step did not name: text `#f4efe2`, background `rgba(8,10,16,.72)`, padding `4px 8px`, `z-index: 5`, `box-sizing: border-box`, `left: 0`, `right: 0`, `margin: 0`. Top `48px`, full width, `pointer-events: none`, and `13px monospace` are Rule 7. The canvas is prepended, as Rule 4 says.
- Numbers: frame ms, canvas MB, heap, and dpr use one decimal. Dropped, over 50, and the frame count stay integers, because the exact string in the step is `dropped (>25 ms) 2`, not `2.0`. The guide's "five lines" under-counts: Rule 5 and smoke check 6 both require the GC line, so the readout is six content lines, seven with `DONE`.
- `prev` starts at `-1`, so the first tick records no gap even when its timestamp is 0. `t0` is taken on that first tick. Gaps are pushed only while `ts - t0 < 60 000`, then the text locks and is not rewritten. The list is one minute of frames, not a cache that grows with edits. Canvas MB is document canvases only.
- Smoke context: 390 and 360 by 844, device scale 3, `isMobile`, `hasTouch`, `colorScheme: "light"`. The screenshot scale is `css` so the file matches 390×844. A non-empty `catch` answers a missing file with 404 and does not log it.
- The readout test also pins the failed-open sentence, `prev = -1`, exactly two `requestAnimationFrame` mentions in `page.ts`, and the `>` edges at 25 and 50. The step's own list does not include 25 or 50. No assert from the step was removed.
- Count 162 against the trial's 152. The extra lines are those pins. `build.ts` is 28, the cap, not over. No new dependency. The release includes the demo fixture's `.json.js` files because `tools/play-stage/project.ts` imports them at load time; this page does not use them. No file is near 500 lines.
- No product file outside `tools/baseline/`, the new test, and the new smoke. No query flag, no `fetch`, no `JSON.parse`, no publish, no gh-pages.

## Next step
- Not this builder's gate. After merge, and only with the CEO's SEND via CoS, publish `baseline-06c/` from the merge sha. The phone numbers are still unread on the S21 Ultra and the Red Magic 9 Pro.
