# Hand-back step-08b-stair-baseline r1
Step file: docs/maker/steps/step-08b-stair-baseline.md (r2, sha256 6bd10c7543f03c6037f4b727fa64d74dacdb2bb2fd66be633701a8d06528dfb2, 112 lines).
Base commit: ecd22d8052d55e2367ccb9bb527e203e73cc11fe     Code head: 6562653a3cc823a6bb1516ed95250f89c0cb9b8c     Code head tree: 04bcf371553bacbaeeb5e47bec909afba41bd4fe     Branch: step/step-08b-stair-baseline-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head.

## Changed files
`git diff --name-status ecd22d8052d55e2367ccb9bb527e203e73cc11fe..6562653a3cc823a6bb1516ed95250f89c0cb9b8c -- . ':!handback'`
```
M	src/rules/session/links.ts
M	tests/tools/autosave-links.test.ts
M	tools/baseline/page.ts
M	tools/baseline/readout.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/load.ts
M	tools/play-stage/match.ts
M	tools/play-stage/project.ts
```
Nothing else. `tests/project/load/one-parser.test.ts`, `tests/tools/baseline-page.test.ts` and `tests/tools/play-stage-p19.test.ts` are unedited. 8a's nine named tests and step 7's six are unedited, including test 2's expected cells. The smoke files are unedited.

## Green
`npm ci` then `npm run green` on this code head exited 0. Floor 1125. Node's test runner prints `ok`, not `✔`.
```
# tests 1125
# pass 1125
# fail 0
# skipped 0
# todo 0
```
```
ok 1026 - step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame
ok 1027 - step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip
ok 1028 - step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row
```
The two readout rows from test 6, on swaps `[2, 5]` over `[16, 16, 40, 61, 16, 16, 30]`:
```
stage changes 2
worst ms in 3 frames after a swap 61.0
```
That readout still has `over 50 ms 1 of 7`. Without `swaps` there are no extra rows, and the title stays `baseline 06c · Skirmish (checkpoint.tileproj)`. `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three base errors only: `tools/effect-designer/page.ts(101,28)`, `tools/maker/home.ts(85,221)` and `tools/maker/home.ts(85,266)`. No new error. eslint, deps (176 modules, 500 dependencies), check:state and check:law exited 0.
Count command: `git diff --shortstat ecd22d8052d55e2367ccb9bb527e203e73cc11fe..HEAD -- . ':!handback/**'`. 8 files changed, 66 insertions(+), 28 deletions(-). 66 + 28 = 94. Under 400. Caps kept (insertions + deletions): links.ts 6/8, project.ts 4/5, load.ts 2/2, match.ts 4/8, hud.ts 8/9, page.ts 14/18, readout.ts 6/6, autosave-links.test.ts 50/50 (43 +, 7 −). Imports are one statement per line. No line was joined to fit a cap.

## Smoke
s8 file sha256 `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1 step-08b-stair-baseline`
```
ok   1 new @390: ok
ok   2 upstairs @390: ok
ok   3 stairs down, autosave on @390: ok
ok   4 game starts upstairs, stairs up @390: ok
ok   5 start can't be deleted @390: ok
ok   6 test starts upstairs, stairs autosave @390: ok
ok   7 continue @390: ok
ok   8 targets @390: ok
ok   1 new @360: ok
ok   2 upstairs @360: ok
ok   3 stairs down, autosave on @360: ok
ok   4 game starts upstairs, stairs up @360: ok
ok   5 start can't be deleted @360: ok
ok   6 test starts upstairs, stairs autosave @360: ok
ok   7 continue @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
S0 file sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unedited. `node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
TOUCH SMOKE PASS
```
The four s8 shots landed in this folder and were deleted before this commit. They are not in the tree. 8a's four shots stay on main. Browser: the chrome path above. Waits are `waitForFunction`. No `waitForTimeout`.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk (sha `8bfef76b…` was not available). The same check was run from `/tmp/s8b-audit.mjs` and not committed. Release builds, dev false, commit 40 zeros, via the builders' functions (the CLI refuses a dirty tree):
```
play.build(/tmp/s8b-play-wUZELg)                 131 files
baseline.build(/tmp/s8b-base-oggcF8)             145 files
maker.build play-stage tree                     131 files
rg -n -e 'tools/maker' -e 'src/editor' -e 'tileengine/saves' -e 'session-save' <those three>
find <those three> \( -name catalogue.json.js -o -name behaviours.json \)
```
rg exit 1, empty hit list. find printed nothing.

## Helpers & self-review
- Helper `cc0006a4-b0df-441f-8647-7abfc623edb7`: reviewed the eight-file diff against Rules 1–3 and tests 6, 10 and 11, including the arrival flood, the bench, the note row, and the shop travel. Found no bug. It noted that travel removes `#board` and `#hud` before `arriveIn`, so a null docs (the project did not open) leaves the page blank. The shop fixture does not take that path, and a party that does not fit is never that path.
- Helper `f3183b95-70e8-4aba-8c8e-fdf203ba7040`: reviewed the swap index against Rules 1 and `baseline-page.test.ts`. Confirmed `swaps.push(gaps.length)` is the first gap after the swap, the one that includes the synchronous rebuild, and that those gaps stay in the percentile counts. Default scene, the two `requestAnimationFrame` hits, and the unchanged skirmish string all match.
- Self-review, Done when: green 1125/0. The three named tests passed. one-parser, baseline-page and play-stage-p19 are unedited. Tools tsc shows only the three base errors. Count 94, every cap kept. s8 is 16 ok and `SMOKE PASS`. S0 is 14 ok and `TOUCH SMOKE PASS`. Export audit is an empty hit list. No edit under `src/core`, `src/sim`, `src/types`, `data/`, `fixtures/`, `tools/maker/`, painter-proto or ui-shell. No new rAF, timer or loop (`requestAnimationFrame` is still two hits; the banner's existing 1260 ms timer is untouched). No new notice code, no formatVersion bump, no save-shape change. No game word shop or home under `src/` or `tools/play-stage/`. Shots are not committed. Done.

## Decisions & deviations
- `arrival`'s new `inside` argument defaults to `free`, so test 2's cells stay `(2,2) (3,2) (2,3)` and a closed stair at `(2,1)` still falls through to the spawn. `arriveIn` passes `inside = grid !== null && grid.inBounds`, so the fill can cross a wall to a free cell. A null grid accepts nothing. The Manhattan 512 guard stays. Cells are still taken N, then E, then S, then W.
- `bench` is `party.members.slice(next.length)`: only the members still without a cell, which is when the stage has no free walkable cell left. It is omitted from the docs when empty. `chosen` is still every member, so `resolvePlacements` raises the existing `notPlaced` once. No new notice or report code. `PlayDocs.bench` is play-stage docs only. The save file is unchanged; the member is kept by being in `party.members`.
- `party()` is the on-board party, then each bench member not already in it, in order, with the hp stored on the bench. The array from `partyOf` is not mutated. `view().note` is `Not placed: N of your team had no free cell. They stay with the party.` when `bench` is non-empty, else null. N is `bench.length`. The note has no close button and stays for the stage.
- The note element is `<div id="note" role="status">` immediately after `#top`. Its CSS is appended after `#hud #banner{pointer-events:none}`, not inside the `#top{…}` rule, so the play-stage-p19 regexes still match. It is `position:absolute`, `top` at `HUD_TOP`, `display:none` until `render` shows it. No new timer.
- The swap mark is `gaps.length` at travel time. `note()` has already pushed the gap that ended on this frame, so that index is the first of the three frames after the swap and it includes the rebuild. Those gaps stay in p50, p95, max, dropped and over-50. `?scene=shop` passes `swaps` and `scene: "shop"`; the default scene passes neither, so its readout string is unchanged. The shop title is `baseline 06c · Shop stairs (?scene=shop)`.
- Travel always calls `arriveIn(shopFiles(), from, to, party)` and then `startMatch` when docs opened. It does not refuse a link because the party does not fit. The host rAF wrapper is the only clock. The builder did not publish the baseline page.
- The test file's old joined imports are one statement per line (19 lines, including `readout` and `openShop` on the checkpoint line). `nook` sets terrain 0 only at the given indices of the shared 6×6 map and a fixed raider on S2 at `(1,4)`. No other test body was edited.
- The trial audit script was missing, so the check above was run by hand and not committed. The stair phone check is CoS's after merge, not this hand-back.

## Next step (optional proposal)
- None from the builder. After merge, CoS serves `?scene=shop` for the phone check in `docs/qa/baseline-06c-phones.md`.
