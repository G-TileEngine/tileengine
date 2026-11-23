# Hand-back step-07-stage-links r1
Step file: docs/maker/steps/step-07-stage-links.md (r4, blob d482f594266b9a2255d0ce885df982d623d0b5aa, sha256 07ed93ed1d89b1b9d4116455b451e36d8349a19ab2fed8582778dcf263d36016).
Base commit: 33538c8995f2ff57d4b1c3abd1c4a11803363105     Code head: 1192825996a72198a66e16f63e1fbcb45bf13c03     Code head tree: 4cc920afb88bfea23dbf07b5ed971287d8238af2     Branch: step/step-07-stage-links-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	handoff/steps/tests/s7-stage-links/smoke.mjs
A	src/editor/stage/links.ts
M	src/editor/stage/resize.ts
M	src/editor/stage/rooms.ts
M	src/project/load/drops.ts
M	src/project/load/read-project.ts
M	src/project/read/stage.ts
A	src/rules/session/links.ts
M	src/types/core-types.ts
M	tests/smoke.test.ts
A	tests/tools/stage-links.test.ts
M	tools/maker/home.ts
M	tools/maker/stage-sheets.ts
M	tools/maker/stage.ts
M	tools/maker/test-launch.ts
M	tools/play-stage/load.ts
M	tools/play-stage/match.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

The tip adds only this folder (this note and the five 390 screenshots). No product file outside the step table.

## Green
N = 6. Floor 1108 + 6 = 1114. The Base is docs and staging only on `ce4ded7e` and still measures 1108/0. `npm test` 1114/0/0/0. typecheck exit 0. lint exit 0 (`eslint --max-warnings 0`). deps exit 0 (174 modules, 495 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs. `npm ci` was already done on this checkout. `npm run green` on the code-head tree exited 0. No product file changed after that.
`tests/project/load/one-parser.test.ts` is unedited. `npx tsc --noEmit -p tools/tsconfig.json` exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:78` twice). The home.ts pair is the same `behaviourId` errors; the edit moved them from line 79 to line 78. None are new.
Node's test runner prints `ok`, not `✔`.
```
# tests 1114
# pass 1114
# fail 0
# skipped 0
# todo 0
```
```
ok 1100 - stage link: landing on stairs takes the party to the linked stage, arriving on the stairs back
ok 1101 - stage link rebuild fits the frame budget
ok 1102 - stage link: the reader warns on a link off the map and refuses a link to a missing stage, to itself, or malformed
ok 1103 - stage link: a stage a link leads to can't be deleted until the link is removed
ok 1104 - stage link: a resize drops a link cell outside the map with a placementDropped row
ok 1105 - stage link: arrival is the target's first link back to the source, in array order
```
`src/types/core-types.ts` sha256 `fd27de06c035ab8c3767a31ad0cf2bf75fa74ca200487a6e2ea762f2d90e747d`. Staged diff sha256 `1428ec8c0e7c60d3042c0d5c39192c3795541ab7c49a719ba4ccf7ddb6b664d2`. Test 2 median 1.189 ms (25 runs, drop the first 5, even-count median of the rest, same body as the test, Node v22.23.3, after `npm run green`). The assert is median < 4.
Count command: `git diff --shortstat 33538c8995f2ff57d4b1c3abd1c4a11803363105..HEAD -- . ':!handback/**' ':!handoff/steps/tests/s7-stage-links/**'`. At the code head that is 18 files changed, 226 insertions(+), 39 deletions(-). 226 + 39 = 265. Caps: core-types 7/7, pin 2/2, stage reader 13/16, session links 14/18, editor links 15/18, rooms 4/8, resize 6/8, read-project 1/3, drops 1/3, project.ts 16/18, load 4/4, match 5/8, page 14/16, test-launch 8/10, home 15/16, stage.ts 32/34, stage-sheets 3/8, tests 105/105. Smoke is 47 lines, its own cap 90, outside the 400.

## Smoke
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell. S0 file sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unedited. Waits are `waitForFunction`. No `waitForTimeout`. Node printed `ExperimentalWarning: stripTypeScriptTypes` while importing the builder, before the ok lines. That is not a page error.
`node handoff/steps/tests/s7-stage-links/smoke.mjs . 8809`
```
ok   1 new @390: ok
ok   2 upstairs @390: ok
ok   3 stairs down @390: ok
ok   4 stairs up @390: ok
ok   5 refuse delete @390: ok
ok   6 go up @390: ok
ok   7 go down @390: ok
ok   8 back to maker @390: ok
ok   9 resize listeners flat @390: {"maker":0,"play":1,"up":1,"down":1,"back":0}
ok   10 targets @390: ok
ok   1 new @360: ok
ok   2 upstairs @360: ok
ok   3 stairs down @360: ok
ok   4 stairs up @360: ok
ok   5 refuse delete @360: ok
ok   6 go up @360: ok
ok   7 go down @360: ok
ok   8 back to maker @360: ok
ok   9 resize listeners flat @360: {"maker":0,"play":1,"up":1,"down":1,"back":0}
ok   10 targets @360: ok
SMOKE PASS
```
`node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`
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
On the clean code head `1192825996a72198a66e16f63e1fbcb45bf13c03` (hand-back folder still untracked; `refuse` ignores untracked files). Release builds, dev false:
```
node tools/play-stage/build.ts /tmp/s7-play
node tools/maker/build.ts /tmp/s7-maker
rg -n -e 'tools/maker' -e 'src/editor' -e 'catalogue.json.js' -e 'behaviours.json' /tmp/s7-play /tmp/s7-maker/play-stage
```
Both builds exited 0. `tools/maker`: no hits. `src/editor`: no hits. `find` of `catalogue.json.js` and `behaviours.json` printed nothing. The only `rg` lines are the pre-existing comment in the engine catalogue module, which this step does not edit:
```
/tmp/s7-play/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
/tmp/s7-maker/play-stage/cd5aa0757428/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
```

## Screenshots
390×844, device scale 1, `scale: "css"`, light. Captions name only what is in the frame.
- `01-goes-to.png`: Stage 2. The Add here sheet for Tile 2,7 shows Your team start, NPC, Enemy, a Link group (Stairs, Door, Gate), and Ground Floor. In front, "Stairs goes to" offers Demo stage and Close. The top bar reads Back, Stage 2, View, Rules, Start new, Test.
- `02-placed-link.png`: Stage 2. The sheet title is "Stairs to Demo stage", Tile 2,7, with Remove link, Ground Floor, Terrain Water, Terrain Wall block, and Close. Above the sheet: "No enemies: free roam.", "No player side: Test never reaches an outcome.", and "This map is used by 2 stages. Painting changes all of them." Two rows of Floor tiles show behind the sheet.
- `03-refusal.png`: Project My game, 2 stages (Demo stage and Stage 2), + Add stage, map Demo 6x9 "6 × 9 · Used by 2 stages". The sheet says "Can't delete" and "A link on Demo stage leads here. Remove it first." Close is under that sentence.
- `04-upstairs.png`: Play. The top bar shows YOUR TURN and Menu. The board is a dark field with a pale blue shape on the left, one blue square, and two brown rectangles. End turn sits at the bottom right. No unit name is readable.
- `05-back-down.png`: Play. The top bar shows YOUR TURN and Menu. The board is a dark field with a red rectangle near the top, a tan square, a blue square and a tan square in a row, a blue square lower left, and the same pale blue shape. End turn sits at the bottom right. No unit name is readable.

## Helpers & self-review
- Helper `2e8fb727-e482-4648-ad5c-8a6304247997`: asked to review the rules, the one reader, delete refusal, Law 13, `arriveIn`, the placer, and the six named tests, and to report only concrete bugs with file and line. It was still running with no report when the gates had already passed, so it was stopped. No change came from it.
- Self-review, Done when: `npm run green` 1114/0 with `one-parser.test.ts` unedited; tools tsc still the three base errors; count 265 with every cap kept; s7 20 ok lines and `SMOKE PASS` (check 9 `{"maker":0,"play":1,"up":1,"down":1,"back":0}` at both widths); S0 14 ok lines and `TOUCH SMOKE PASS`; export audit as above; five 390 shots. Test 2 median 1.189 ms, under 4. Done.
- Self-review, QA G1–G10: G1 the six tests fail if arrival order, the landing link, the off-map warning, a missing or self `to`, a bad `type`, the delete sentence, the resize drop, or a second `driver.dispose()` is wrong. G2 root typecheck clean, no new `any`. G3 no new phase writes. G4 no quoted interface was rewritten. G5 `src/core`, `src/sim`, fixtures, data, behaviour-library, painter-proto, ui-shell, and existing tests other than the pin are untouched. G6 only the step table. G7 265 and each cap kept. G8 one clock, the driver still the only rAF caller, and `stop()` removes the window resize listener on travel, Back, and Restart. G9 this note. G10 the smoke walks the two-floor shop both ways and the refusal. Done.

## Decisions & deviations
- `const stop` cannot be named in the earlier Restart closure (it is declared after `createHud`). `end.go` starts as `location.reload` and is then set to `stop(); if (back !== undefined) back();`. Restart calls `end.go()` when `back` is set, and `location.reload()` when it is not. Travel and the Back to maker button call `stop()` themselves. `driver.dispose()` appears once, inside `const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };`.
- The plain-tile assert is `assert.deepEqual(got.slice(), [])`. A direct `deepEqual(got, [])` makes tsc narrow `got` to `never`, so the later `got[0]` checks would not typecheck. The value compared is still an empty list.
- A cell tap does not clear `sess.link`. The goes-to scrim covers the grid. `s:close` and undo do clear it. `linksTo` uses `"Stage"` when a live stage has no string name, and joins names with `", "` in object-entry order.
- Facing is copied only when an original spawn on that same cell has `facing !== undefined`. A new arrival cell has none. `chosen` is `from.chosen.slice(0, playerSpawns.length)`. Party hp, xp and level are not carried (step 8). No autosave read or write, no session field, no link id, no arrival field, no formatVersion bump.
- Smoke context: 390 and 360 by 844, device scale 1, `isMobile`, `hasTouch`, `colorScheme: "light"`. Screenshot scale is `css`, so the files are 390×844. No new dependency. No file is near 500 lines. Count 265. The smoke is 47 lines and is outside that 400.

## Next step
- Not this builder's gate. CoS runs the phone check (S21 Ultra and Red Magic 9 Pro): the stair swap plus first draw should fit one frame. Party hp, xp and level across a link belong to step 8. Do not pre-warm from here.
