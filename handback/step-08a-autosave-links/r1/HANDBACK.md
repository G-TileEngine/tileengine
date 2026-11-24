# Hand-back step-08a-autosave-links r1
Step file: docs/maker/steps/step-08-autosave-links.md (r4, blob 73584e26ff2cdf6146bc06b397dedf1a7662cc20, sha256 354038813c96a21af5814398082eacc3f2b0ded12d7357ebc906ea0ec70b41ee, 247 lines). 8a only. 8b is not in this branch.
Base commit: 9f7f7e526bf8655b903c7722c478bfe913d77405     Code head: 3d3d253966b6ba65559dfb1fd1d020641a3f1e6d     Code head tree: ca5f1598cf07b73780984d37a86fd52517843d5e     Branch: step/step-08a-autosave-links-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	fixtures/shop-stairs/project.json
A	fixtures/shop-stairs/stages/stage_01JDES00000000000000000001.json
A	fixtures/shop-stairs/stages/stage_01JDES00000000000000000002.json
A	handoff/steps/tests/s8-autosave-links/smoke.mjs
M	src/editor/stage/links.ts
M	src/editor/stage/rooms.ts
M	src/project/load/read-project.ts
M	src/project/read/manifest.ts
A	src/project/read/session.ts
M	src/project/read/stage.ts
M	src/rules/battle/battle.ts
M	src/rules/levels/levels.ts
M	src/rules/levels/types.ts
M	src/rules/session/links.ts
A	src/rules/session/party.ts
M	src/sim/migrations/save/index.ts
M	src/types/core-types.ts
M	tests/sim/trusted-saves.test.ts
M	tests/smoke.test.ts
A	tests/tools/autosave-links.test.ts
M	tests/tools/stage-links.test.ts
M	tools/baseline/checkpoint.ts
M	tools/maker/home.ts
M	tools/maker/rooms.ts
A	tools/maker/session.ts
M	tools/maker/stage.ts
M	tools/maker/test-launch.ts
M	tools/play-stage/match.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

The tip adds only this folder (this note and the four 390 screenshots). No product file outside the step table. `tools/baseline/page.ts` and `tools/baseline/readout.ts` are untouched. Named test 6 is not in this branch.

## Green
N = 8. Floor 1114 + 8 = 1122. The Base is docs and staging only on `e801c78d` and still measures 1114/0. `npm ci` was already done on this checkout. `npm run green` on the code-head tree exited 0. No product file changed after that. `tests/project/load/one-parser.test.ts` and `tests/tools/baseline-page.test.ts` are unedited.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:85` twice). The home.ts pair is the same `behaviourId` errors. They stayed on line 85. They were not padded down to the trial's line 89. None are new.
Node's test runner prints `ok`, not `✔`.
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
`src/types/core-types.ts` sha256 `439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5`. Staged diff sha256 `74fb9ff438163b6b31026977201f1b07c32094726d48798d7ce0ff331737b0a7`. Test 8 median 1.41 ms (25 runs, drop the first 5, same body as the test, Node v22.23.3, during `npm run green`). The assert is median < 4.
Count command: `git diff --shortstat 9f7f7e526bf8655b903c7722c478bfe913d77405..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'`. At the code head that is 29 files changed, 292 insertions(+), 63 deletions(-). 292 + 63 = 355. Caps (insertions + deletions): core-types 6/6, pin 2/2, stage reader 2/2, manifest 4/6, read-project 1/1, session reader 38/38, migrations 7/8, trusted-saves 10/10, session links 17/21, party 16/19, battle 8/11, levels 12/12, level types 3/3, editor links 1/2, rooms 6/7, match 4/7, page 5/5, project.ts 29/29, maker session 23/26, test-launch 18/19, home 21/28, stage.ts 5/5, maker rooms 5/5, checkpoint 8/9, shop-stairs 3/3, stage-links tests 10/11, autosave tests 91/103. Smoke is 44 lines, its own cap 55, outside the 400.

## Smoke
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell. S0 file sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unedited. Waits are `waitForFunction`. No `waitForTimeout`. Node printed `ExperimentalWarning: stripTypeScriptTypes` while importing the builder, before the ok lines. That is not a page error.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1`
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
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`
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

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not in this sandbox. The same check was run by importing the three builders with dev false and commit `0000000000000000000000000000000000000000` (the CLI refuses a dirty checkout; the import does not). Release builds:
```
play.build(/tmp/s8-play-4taXd2, 40 zeros, root, false)
maker.build(/tmp/s8-maker-pZupXX, 40 zeros, root, false)
baseline.build(/tmp/s8-base-aUWZ4N, 40 zeros, root)
rg -n -e 'tools/maker' -e 'src/editor' -e 'tileengine/saves' -e 'session-save' /tmp/s8-play-4taXd2 /tmp/s8-maker-pZupXX/play-stage /tmp/s8-base-aUWZ4N
find /tmp/s8-play-4taXd2 /tmp/s8-maker-pZupXX/play-stage /tmp/s8-base-aUWZ4N \( -name catalogue.json.js -o -name behaviours.json \)
```
File counts: play-stage 131, maker `play-stage/` 131, baseline 145. The four-string `rg` printed nothing. `find` printed nothing. The only `behaviours.json` text is the pre-existing comment in the engine catalogue module, which this step does not edit:
```
/tmp/s8-play-4taXd2/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
/tmp/s8-maker-pZupXX/play-stage/c513dc8dd3fa/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
/tmp/s8-base-aUWZ4N/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
```

## Screenshots
390×844, device scale 1, light. Captions name only what is in the frame.
- `01-autosave-on.png`: Stage 2. The top bar reads Back, Stage 2, View, Rules, Start new, Test. Under it: "No enemies: free roam." and "This map is used by 2 stages. Painting changes all of them." One row of Floor tiles shows behind the sheet. The sheet title is "Stairs to Demo stage", Tile 2,7, with "Autosave here: On", Remove link, Ground Floor, Terrain Water, Terrain Wall block, and Close.
- `02-start-refusal.png`: Project My game. The top bar reads Back, My game, Save. Headings My game and Stages, "2 stages", cards Demo stage and Stage 2, + Add stage, Maps, and Demo 6x9 "6 × 9 · Used by 2 stages". The sheet says "Can't delete" and "The game starts here. Pick another start first." Close is under that sentence.
- `03-downstairs.png`: Play. The top bar shows YOUR TURN and Menu. The board is a dark field with a red rectangle near the top, a pale blue shape on the left, a tan square, a blue square and a tan square in a row, and a blue square lower left. End turn sits at the bottom right. No unit name is readable.
- `04-continue.png`: Play. The top bar shows YOUR TURN and Menu. The board is a dark field with a red rectangle near the top, a brown square upper left, the same pale blue shape, a tan square, a blue square and a tan square in a row, a brown rectangle below that row, and a blue square lower left. End turn sits at the bottom right. No unit name is readable.

## Helpers & self-review
- A review helper was asked to check the reader, the slot write, arrival, and the named tests for rule breaks, and to change nothing. The subagent stream closed before it started. No change came from it.
- Self-review, Done when: `npm run green` 1122/0 with `one-parser.test.ts` and `baseline-page.test.ts` unedited; tools tsc still the three base errors, home.ts at line 85; count 355 with every cap kept; s8 16 ok lines and `SMOKE PASS`; S0 14 ok lines and `TOUCH SMOKE PASS`; export audit as above; four 390 shots. Test 8 median 1.41 ms, under 4. 8b files are absent. Done.
- Self-review, QA G1–G10: G1 the eight tests fail if party hp is defaulted, a dead or second copy is carried, arrival skips the order or the bound, an autosave writes during a contest or over a refused file, the start stage deletes, a missing stage id becomes `""`, or the median is 4 ms or more. G2 root typecheck clean, no new `any`. G3 no new phase writes. G4 no quoted interface was rewritten; `SessionSave` is only the CN type. G5 `src/core` is untouched; `src/sim` changes only the session-save registry key; fixtures add only `shop-stairs/`; existing tests change only the pin, the trusted-saves literals, and the five `arriveIn` call sites. G6 only the 8a step table. G7 355 and each cap kept. G8 one clock, `driver.dispose()` still once inside `stop()`, no second rAF. G9 this note. G10 the smoke walks the new stage, the autosave toggle, the start refusal, the downstairs landing, and Continue. Done.

## Decisions & deviations
- A null `from` is searched as U+0000. That character is not a stage id, so the party lands on the spawns. `""` is not used. `fromId === ""` throws `play: stage id`.
- The arrival search stops at Manhattan 512 from the first arrival cell, even when that cell is not free. A `free` that stays false off the map cannot loop. Order is N, E, S, W.
- The enemy side on a placed pool is the existing `stage.sides?.enemyPool ?? "rival"`. This step does not add a new default. The shop case asserts `rival`.
- `tools/maker/home.ts` still reports the two `behaviourId` errors at line 85. The trial's line 89 was not chased. No line was added or padded to move them.
- `/workspace/share/s8/s8-audit.mjs` was not on disk. The check above was reproduced and not committed. The hit list for `tools/maker`, `src/editor`, `tileengine/saves`, and `session-save` is empty, and there is no `catalogue.json.js` or `behaviours.json` file.
- No 8b. `tools/baseline/page.ts` and `readout.ts` are at the base. Named test 6 is not written.
- The project toast covers Test for 6 s, so the smoke waits for `.toast` to clear on the project screen before Test and before opening Demo stage. It does not wait for a toast on the stage screen. Continue's landing check deletes `window.__play` first, so the match just left cannot satisfy it.
- Smoke context: 390 and 360 by 844, device scale 1, `isMobile`, `hasTouch`, `colorScheme: "light"`. The files are 390×844. No new dependency. Count 355. The smoke is 44 lines and is outside that 400.
