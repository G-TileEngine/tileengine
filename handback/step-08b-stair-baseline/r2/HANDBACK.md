# Hand-back step-08b-stair-baseline r2
Step file: docs/maker/steps/step-08b-stair-baseline.md (r2, sha256 6bd10c7543f03c6037f4b727fa64d74dacdb2bb2fd66be633701a8d06528dfb2).
Review: docs/qa/step-08b-r1-review.md on main 5d2b30c9b587e3b0240efe3ac9fb6a64e7042d7a (read, not merged).
Base commit: ecd22d8052d55e2367ccb9bb527e203e73cc11fe     Code head: 38ee278c0d01b6a839b7888e61854a9d555e56f1     Code head tree: 1e1bc50edbecb057219e64081932b17b1c0058ef     Branch: step/step-08b-stair-baseline-r2-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. The r2 code head is the parent of this commit. r1's hand-back stays in history. No product file changes after the code head. Main was not merged.

## Changed files
Against the r1 code head `6562653a3cc823a6bb1516ed95250f89c0cb9b8c`, excluding `handback/**` (the r1 hand-back already sits on this branch, because r2 was cut from the r1 tip):
```
M	tools/baseline/page.ts
```
`git diff --stat 6562653a3cc823a6bb1516ed95250f89c0cb9b8c..38ee278c0d01b6a839b7888e61854a9d555e56f1 -- . ':!handback/**'` is `tools/baseline/page.ts | 4 ++--`. One source line, the `travel` callback, plus the restored trailing newline. Nothing else.

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
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three base errors only: `tools/effect-designer/page.ts(101,28)`, `tools/maker/home.ts(85,221)` and `tools/maker/home.ts(85,266)`. No new error. eslint, deps (176 modules, 500 dependencies), check:state and check:law exited 0.
Count command: `git diff --shortstat ecd22d8052d55e2367ccb9bb527e203e73cc11fe..HEAD -- . ':!handback/**'`. 8 files changed, 65 insertions(+), 27 deletions(-). 65 + 27 = 92. Under 400. Caps: links.ts 6/8, project.ts 4/5, load.ts 2/2, match.ts 4/8, hud.ts 8/9, page.ts 12/18, readout.ts 6/6, autosave-links.test.ts 50/50. page.ts dropped by 2 against the base because the closing brace now has its newline, so it is no longer a changed line. No source line was added.

## Smoke
`node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r2 step-08b-stair-baseline`
Smoke file sha256 `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited.
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
Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. Shots were not committed.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run from `/tmp/s8b-audit.mjs` and not committed. Release builds, dev false, commit 40 zeros:
```
play	131 files	rg empty	find empty
baseline	145 files	rg empty	find empty
maker play-stage	131 files	rg empty	find empty
```
rg patterns: `tools/maker`, `src/editor`, `tileengine/saves`, `session-save`. find: `catalogue.json.js` or `behaviours.json`. Empty hit list.

## Helpers & self-review
- Helper `8de50f56-2df8-4bb3-8d7c-12155e48b94b`: reviewed the travel line against the must-fix. Pass. `arriveIn` is first; a null `docs` writes `got.error` and returns before the swap, the removals, the new canvas and `startMatch`. The callback is still one line. The file ends with one newline. `requestAnimationFrame` is still twice, and the default scene is still `startMatch(opened.docs)`. `got.docs` is narrowed. A failed `arriveIn` cannot blank the page.
- Helper `040a5534-8b4a-4496-bc02-94c8bbd0ce1b`: checked the dirty tree, the caps and the newline byte. Pass. Only `tools/baseline/page.ts` is dirty versus the r1 tip. Versus `6562653a` with `handback/**` excluded, only that file. Churn 92, every cap held. The file ends in `0x0a`. No token in the diff.
- Self-review, must-fix: Law 12. The board and HUD stay up when `arriveIn` returns no docs, and `read.textContent` is `got.error`. The swap index is pushed only after that open succeeds, so a failed change is not counted. The trailing newline is restored. No other file, no test edit. Done.
- Self-review, r2 floor: green 1125/0, the three tsc errors only, s8 16 ok and `SMOKE PASS`, S0 14 ok and `TOUCH SMOKE PASS`, audit empty, count 92, every cap kept. Done.

## Decisions & deviations
- The error text is `got.error` alone. The checkpoint sentence (`baseline: the checkpoint did not open`) stays on the first open. QA named `read.textContent = got.error`, so no prefix was added.
- `swaps.push` stays where it was relative to the rebuild: after a successful `arriveIn`, at `gaps.length`, which is still the first post-swap gap. A failed open does not push.
- `play-stage` still calls `stop()` before `travel`. That file was not in the must-fix. On failure the stopped board remains and the error shows; the page is not blank. On success the board and HUD are removed and the next match starts, as before.
- Restoring the newline does not add a source line. It removes the closing `}` from the diff against the base, so page.ts is 7 insertions and 5 deletions (12, cap 18) and the step total is 92. r1 was 94.
- This branch starts at the r1 tip `dca1d1e6`. Main `5d2b30c9` was fetched and read, not merged. The audit script is still not committed.

## Next step
- The stair phone check stays CoS's, after merge. Not run here.
