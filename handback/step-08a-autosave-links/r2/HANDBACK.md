# Hand-back step-08a-autosave-links r2
Step file: docs/maker/steps/step-08-autosave-links.md (r4, blob 73584e26ff2cdf6146bc06b397dedf1a7662cc20, sha256 354038813c96a21af5814398082eacc3f2b0ded12d7357ebc906ea0ec70b41ee).
Review: docs/qa/step-08a-r1-review.md on main 5034dd7ae3739c065ff8cb24b5d7825c8894284e (sha256 03a1ebaaf83e33ee03eb233bf7e06e1fb6c7a9c02c293c9b3c54cb7e0972b77b, 83 lines).
Base commit: 9f7f7e526bf8655b903c7722c478bfe913d77405     Code head: 4f662831aa36258c0a2b51103f77b40d21f060bd     Code head tree: f1664e09a56665b5c3da114f346ca93bee28cc33     Branch: step/step-08a-autosave-links-r2-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. The r2 code head is the parent of this commit. r1's hand-back stays in history. No product file changes after the code head.

## Changed files
Against the r1 code head `3d3d253966b6ba65559dfb1fd1d020641a3f1e6d`, only the three must-fix files:
```
M	src/rules/session/links.ts
M	tools/maker/home.ts
M	tools/maker/test-launch.ts
```
Nothing else. `tests/project/load/one-parser.test.ts` and `tests/tools/baseline-page.test.ts` are unedited. Test 2 and test 9 were not edited.

## Green
`npm ci` then `npm run green` on this code head exited 0. Floor 1122. Node's test runner prints `ok`, not `✔`.
```
# tests 1122
# pass 1122
# fail 0
# skipped 0
# todo 0
```
```
ok 1018 - step 8 party: hp and the side bar cross a link, capped at max; dead members and second copies stay behind; a kept offer is open again
ok 1019 - step 8 occupied arrival: taken or closed cells are skipped and the party fills the nearest free cells, N E S W
ok 1020 - step 8 autosave: only an autosave link outside a battle saves; the session save round-trips; nothing is written over a refused or unreadable file, or for a party the reader refuses
ok 1021 - step 8 session start: read and checked, a new game starts there, and the start stage can't be deleted
ok 1022 - step 8 link sheet: autosave on writes true, off drops the key, and readStage keeps it
ok 1023 - step 8 link event: a stage with no string id throws instead of sending an empty from
ok 1024 - step 8 link rebuild with the party carry and the autosave write fits the step 7 budget
ok 1025 - step 8 session save (D28): v1 only, migrated first by migrateSave, mismatches are notices, bad parties refused, dangling refs dropped
ok 1108 - stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back
ok 1109 - stage link rebuild fits the frame budget
ok 1110 - stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed
ok 1111 - stage link: a stage a link leads to can't be deleted until the link is removed
ok 1112 - stage link: a resize drops a link cell outside the map with a placementDropped row
ok 1113 - stage link: arrival is the target's first link back to the source, in array order
```
Test 8 median `step 8 rebuild median 1.30 ms` (printed once). `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three base errors only: `tools/effect-designer/page.ts(101,28)`, `tools/maker/home.ts(85,221)` and `tools/maker/home.ts(85,266)`. The home.ts pair stayed on line 85. No new error. eslint, deps (176 modules, 500 dependencies), check:state and check:law exited 0.
Count command: `git diff --shortstat 9f7f7e526bf8655b903c7722c478bfe913d77405..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'`. 29 files changed, 294 insertions(+), 62 deletions(-). 294 + 62 = 356. Under 400. Caps kept: links.ts 17/21, test-launch.ts 19/19 (13 +, 6 −, one import per line, no join), home.ts 21/28. The smoke is 44 lines, its own cap 55, outside the 400.

## Smoke
`node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r2`
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
Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. Waits are `waitForFunction`. No `waitForTimeout`.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run here and not committed. Release builds, dev false, commit 40 zeros, via the builders' functions (the CLI refuses a dirty tree):
```
play.build(/tmp/s8r2-play-vZF3Uq)          131 files
maker.build play-stage tree                131 files
baseline.build(/tmp/s8r2-base-KZUwZi)      145 files
rg -n -e 'tools/maker' -e 'src/editor' -e 'tileengine/saves' -e 'session-save' <those three>
find <those three> \( -name catalogue.json.js -o -name behaviours.json \)
```
rg exit 1, empty hit list. find printed nothing.

## QA arrival repro
Script copied out of the review to `/tmp/qa-arrival-repro.mjs` (not committed). `node --experimental-strip-types qa-arrival-repro.mjs /workspace/step-08a-r2`.
One shot in a fresh process: A 0.2 ms (`[{"c":0,"r":0}]`). A cold `arriveIn` on this box is about 6.7 ms even for the stock shop, so the script's first B call (6.6–12.4 ms) is that cold start, not the old 525k-cell walk. The same three bodies, 21 runs, median: A 0.003 ms, B 0.901 ms (`spawns [{"c":0,"r":4}]`), C 0.715 ms. A and B are under 4 ms. Test 2's expected cells are unchanged and that test passed.

## Screenshots
Not retaken. The UI did not change. The four 390 shots remain on the r1 tip.

## Helpers & self-review
- Helper `76212772-0eb6-4529-9601-d045a8aa1dff`: asked to review arrival, the resume walk, and the banner, and to report only concrete bugs. It was still running with no report when the gates had already passed. No change came from it.
- Self-review, must-fixes: arrival no longer queues a cell `free` rejects, and named test 2 still expects `(2,2) (3,2) (2,3)` plus the shop cells `(0,4)` and `(1,3)`. test-launch L4–8 are one import each and the diff is 19 with no joined import. The banner names the stage it was going to, the stage it came from, or the unit. Test 9 still passes. Done.
- Self-review, r2 floor: green 1122/0, the three tsc errors only, s8 16 ok and `SMOKE PASS`, S0 14 ok and `TOUCH SMOKE PASS`, audit empty, count 356, every cap kept. Only the three files differ from the r1 code head. Done.

## Decisions & deviations
- A neighbour is queued only when `free` accepts it. The search still starts at the first arrival cell when that cell is not free, so an occupied stair still looks N, then E, then S, then W. Cells `free` rejects are not queued, so a wall, a taken cell, or a cell off the map cannot grow the walk out to Manhattan 512. The 512 bound stays for a `free` that is true everywhere, which would otherwise not stop.
- The resume walk is still one line, the line r1 already used for it, in the same shape as `showUrl` in this file. The file-level `isObj` helper is gone. Its check is local to that line. Imports are one per line. The diff against the product base is 13 insertions and 6 deletions, 19, the cap. No import was joined to fit it.
- A `saveRefDropped` note still carries the bare id. The banner reads the save: the id equal to `to` is the stage it was going to, the id equal to `from` is the stage it came from, and any other id stays `dropped unitId`. Test 9 was not edited. home.ts gained no line, and its two tsc errors stayed on line 85.
- Shots were not retaken. The export-audit script from the trial is still missing, so the check above was run by hand and not committed. No 8b. The EA carry at the end of the review (a party larger than the free cells) was not changed.
