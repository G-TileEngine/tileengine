# Hand-back step-08c-baseline-walk r1
Step file: docs/maker/steps/step-08c-baseline-walk.md (r1, sha256 484f4546b6b619223cfaad6e9d333f7f01296eba6e538fb90be7ebf598b3da30, 69 lines). Finding: docs/qa/baseline-08b-shop-no-unit.md (sha256 79452cc2d2d4aaa166e9abfb64780f36ae86d8d9743a281f5503ed3f2d5d96d9).
Base commit: 02a0a9c560366777549f395cf97003500d238b1d     Code head: 96a50e04a19ad152c9349f3992d70bf19abbb62c     Code head tree: af2f75249bd797dfa48e396f4f0b2588a5367e4c     Branch: step/step-08c-baseline-walk-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged.

## Changed files
```
A	handoff/steps/tests/s8c-baseline-walk/smoke.mjs
A	tests/tools/baseline-walk.test.ts
M	tools/play-stage/looks.ts
```
`git diff --shortstat 02a0a9c560366777549f395cf97003500d238b1d..96a50e04a19ad152c9349f3992d70bf19abbb62c -- . ':!handback/**' ':!node_modules' ':!handoff/steps/tests/s8c-baseline-walk/**'` is `2 files changed, 21 insertions(+), 1 deletion(-)`. 21 + 1 = 22. Under the counted cap 44 and the hard gate 400. The smoke is outside that count: 45 lines, cap 60. looks.ts is 1+/1−, cap 4. The named test is 20 lines, cap 40.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1135 (base 1134 + named test 1). Node's test runner prints `ok`, not `✔`.
```
# tests 1135
# pass 1135
# fail 0
# skipped 0
# todo 0
```
```
ok 1041 - step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe
```
The same test on the unfixed L40 fails: `undefined !== 32`. `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three base errors only: `tools/effect-designer/page.ts(101,28)`, `tools/maker/home.ts(85,221)` and `tools/maker/home.ts(85,266)`. No new error. typecheck exit 0, lint exit 0, deps exit 0 (176 modules, 500 dependencies), check:state exit 0, check:law exit 0.

## Smoke
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1`
```
ok   1 shop hero @390: 4096px hook false ok
ok   2 shop select @390: Hero 20/20 ok
ok   3 shop walk @390: stage changes 1 | worst ms in 3 frames after a swap 16.6 ok
ok   4 skirmish @390: 4096px Hero 20/20 ok
ok   1 shop hero @360: 2304px hook false ok
ok   2 shop select @360: Hero 20/20 ok
ok   3 shop walk @360: stage changes 1 | worst ms in 3 frames after a swap 16.6 ok
ok   4 skirmish @360: 2304px Hero 20/20 ok
SMOKE PASS
```
s6d file unedited. `node handoff/steps/tests/s6d-baseline/smoke.mjs . 8808`
```
ok   1 board @390: 390x664
ok   2 frames @390: 16.6 16.7 100
ok   3 dropped @390: 2 1 of 126
ok   4 canvas @390: 1
ok   5 heap @390: 9.5
ok   6 gc @390: line
ok   7 quiet @390: ok
ok   1 board @360: 360x664
ok   2 frames @360: 16.6 16.8 283.3
ok   3 dropped @360: 4 2 of 126
ok   4 canvas @360: 0.9
ok   5 heap @360: 9.5
ok   6 gc @360: line
ok   7 quiet @360: ok
SMOKE PASS
```
s8 file sha256 `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited. `node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1 scratch-s8c-regress`
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
Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. Shots were not committed.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run from `/tmp/s8c-audit.mjs` (not committed). Release builds, dev false, commit 40 zeros. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save`, and `find` for `catalogue.json.js` / `behaviours.json`. `window.__play` is absent.
```
play	132 files	grep empty	find empty
baseline	146 files	grep empty	find empty
maker play-stage	132 files	grep empty	find empty
```
AUDIT PASS

## Shipped tests (sha256)
The step file does not pin a shipped test. The new test file, as committed:
```
cc0496db201a01e659d5154be15d7fcabc946716ed4e69ed37634372f1764ca7  tests/tools/baseline-walk.test.ts
```
No existing test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper 1d0e2f18: `dressPx` L40 against the accept rule, operator precedence, unknown side, missing `@`, and that `dress()` was not touched → PASS. `!(recipe || starter:unknown-) || !TEAM` is the reject. `animPx` width stays 32.
- Helper 613b929b: the named test against the guide sentence, both scenes, the three `dressPx` calls, DOM-free, one import per line, 20 lines, strict indexing → PASS. Root `tsc` exits 0.
- Helper b6dd456c: the committed smoke against steps 1–4 → PASS. Release build into a temp dir on 8812, dsf 1, blue box before the select tap, square so idle frame 0, Hero 20/20, two taps then waitForFunction, skirmish with no query, `__play` only asserted absent, 8 checks, 45 lines.
- Self-review: Rules done. Named test 1 done (fails on the old L40, passes with the fix). Done-when: green 1135/0 done; tools tsc only the 3 base errors done; 22 ≤ 44 and 45 ≤ 60 and every cap kept done; s8c 8 ok SMOKE PASS done; s6d 14 ok SMOKE PASS done; s8 16 ok SMOKE PASS done; S0 14 ok TOUCH SMOKE PASS done; export audit empty done. QA G1 tests green done; G2 src typecheck exit 0, no new ignore/any done; G3 check:state done; G4 no new quoted interface done; G5 no src, tools/baseline, data, fixtures, painter-proto, ui-shell, or existing test/smoke edit done; G6 only the build-table files done; G7 22 counted, smoke outside, under 400 done; G8 check:law and one-clock done (no new rAF, timer, or loop); G9 decisions below done; G10 acceptance lines done.

## Decisions & deviations
- The reject stays one line. A sheet is dressed when its recipe id is a starter recipe or starts with `starter:unknown-`, and the side is still an own key of `TEAM`. An unknown side stays `undefined`. A missing `@` still paints neutral, because that was already the paint default and `neutral` is a `TEAM` key. `dress()` is untouched.
- The smoke calls a pixel blue when `b > r + 40`, `b > g + 20`, `g > r + 20`, `b > 100` and `r < 80`. Night wash is darkness 9/32 over `rgba(3,8,26)`, so `TEAM.player` `47,111,173` lands near `35,82,132` and the washed floor near `27,37,56` does not match. The box is taken before the select tap, so the reach fill `0x3b82f6` is not in it.
- The smoke waits until that box is square. Idle frame 1 drops the top art row (3840 px at scale 4). The square sample is frame 0: 4096 px at 390 (cell 64) and 2304 px at 360 (cell 48). The stair taps move one box-width right. Device scale stays 1. The headless scale-3 question is not this step.
- The release build is `tools/baseline/build.ts` with dev false and commit 40 zeros, served from the temp dir root, so `/?scene=shop` is the shop and `/` is the skirmish. The hero check fails if `window.__play` is present. No new cache, timer, loop, or dependency. Nothing in `src/` or `tools/baseline/` changes.
- Counted diff is 22 lines (the test 20, looks.ts 1+/1−). The smoke is 45 and is left out of that count, as the build table says. Shots, the audit script, and the regression scratch folder are not committed. No runtime memo was added; `dressPx` still builds the strip on each call, the same as a starter unit.

## Next step
- After this merges, the baseline page is republished only once CoS has the CEO's typed OK. QA's post-publish walk check runs at device scale 1, then the phones. A guard in `raf-driver.ts` for headless scale 3 is its own step if a phone shows an oversized board. It is not in this diff.
