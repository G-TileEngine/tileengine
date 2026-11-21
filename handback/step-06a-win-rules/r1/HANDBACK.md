# Hand-back step-06a-win-rules r1
Step file: docs/maker/steps/step-06-levels-win-rules.md (Header, Delivery, Read first, Rules this step must keep, "The play: army carry: ruled", Carries, Count command, and "6a: win rules and a playable Empty"). Nothing from 6b or 6c.
Base commit: ae968eb052cd137e025dc95446280c8546d69c67     Code head: bda2ea6c5ee790857e3967eaac93f155d88c3e10     Code head tree: 8e2a63d8fc6b255f754c371b6c1a884fd5a2e603     Branch: step/step-06a-win-rules-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
M	data/templates/empty.tileproj/catalogue/slice.json
M	data/templates/empty.tileproj/project.json
A	data/templates/empty.tileproj/setups/setup_01M7XPE6006A10000000000000.json
A	data/templates/setup.rule.json
M	handoff/steps/tests/s3-test/touch-smoke.mjs
M	handoff/steps/tests/s4a-stage-paint/smoke.mjs
A	handoff/steps/tests/s6a-win-rules/smoke.mjs
M	src/editor/project/test-gate.ts
A	src/editor/rules/rules.ts
A	src/editor/unit/team.ts
A	src/project/rule-of.ts
M	src/rules/behaviours/wired.ts
M	tests/editor/add-ability.test.ts
M	tests/editor/maker-law.test.ts
A	tests/editor/rules.test.ts
M	tests/editor/units.test.ts
M	tests/tools/play-stage-source.test.ts
M	tools/maker/home.ts
A	tools/maker/rules-panel.ts
M	tools/maker/stage.ts
M	tools/maker/test-launch.ts
M	tools/maker/unit-diagram.ts
M	tools/maker/units.ts
M	tools/play-stage/load.ts
M	tools/play-stage/match.ts
M	tools/play-stage/project.ts

## Green
N = 11. Floor 1082. `npm test` 1093/0/0/0. typecheck exit 0. lint exit 0. deps exit 0 (171 modules, 489 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs.
`npm ci` (lockfile, 135 packages) then `npm run green` was run on the tree before two test lines used `delete`. That run was tests 1093/0, typecheck exit 0, lint exit 1 (`no-dynamic-delete` in `tests/editor/rules.test.ts` and `tests/editor/add-ability.test.ts`). Those two lines now filter the object instead of deleting a key. No product file changed after that. `npm run green` on this code head: exit 0.
```
# tests 1093
# pass 1093
# fail 0
# skipped 0
# todo 0
```
Named tests: `stage rule overrides project rule`, `first rule edit re-cuts the slice`, `win rule reaches Test`, `win rule needs P = B`, `wired win knob changes the adapter`, `empty template plays`, `empty board asks for a unit`, `old empty project gets the plain sentence`, `on your team writes the loadout`, `canUpdate refuses drifted knobs`, `addable keeps goal-less primaries`.
Line count at the code head, `git diff --shortstat ae968eb052cd137e025dc95446280c8546d69c67..bda2ea6c5ee790857e3967eaac93f155d88c3e10 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6a-win-rules/**'`: 21 files changed, 362 insertions(+), 30 deletions(-). 362 + 30 = 392.
The s6a smoke is 76 lines (cap 130, outside the 400). Waits are `waitForFunction`. `locator.waitFor` remains only inside tap and press. No `waitForTimeout`.

## Smoke
`handoff/steps/tests/s0-play-input/touch-smoke.mjs` is unedited, sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell for S0, s3 and s4a, whose defaults point at Google Chrome.

s6a, port 8805. `node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805` printed the same 18 ok lines and `SMOKE PASS` three times: once idle, once under eight `node -e 'for(;;){}'` loops, once idle again. Check 8 is measured with the Rules sheet, the unit editor (On your team), and the Archer sheet open. At 360 the toast box covers no 48 px target of the open Rules sheet or the open unit editor.
```
ok   1 rules on @390: ok
ok   2 rules off @390: ok
ok   3 test off @390: ok
ok   4 reset @390: ok
ok   7 archer sheet @390: ok
ok   8 editor @390: ok
ok   5 empty hero @390: ok
ok   6 empty board @390: ok
ok   8 targets @390: ok
ok   1 rules on @360: ok
ok   2 rules off @360: ok
ok   3 test off @360: ok
ok   4 reset @360: ok
ok   7 archer sheet @360: ok
ok   8 editor @360: ok
ok   5 empty hero @360: ok
ok   6 empty board @360: ok
ok   8 targets @360: ok
SMOKE PASS
```

S0, port 8797, unedited:
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

s3, port 8798, after the one-line edit:
```
ok   1 select @390: ok
ok   2 walk @390: ok
ok   3 attack @390: ok
ok   4 pan then select @390: ok
ok   5 talk @390: ok
ok   6 end turn @390: ok
ok   7 buttons @390: ok
ok   8 back to maker @390: ok
ok   9 empty blocked @390: ok
ok   1 select @360: ok
ok   2 walk @360: ok
ok   3 attack @360: ok
ok   4 pan then select @360: ok
ok   5 talk @360: ok
ok   6 end turn @360: ok
ok   7 buttons @360: ok
ok   8 back to maker @360: ok
ok   9 empty blocked @360: ok
TOUCH SMOKE PASS
```

s4a, port 8799, after the one-line edit:
```
ok   1 grid @390: ok
ok   2 sheet @390: ok
ok   3 paint @390: ok
ok   4 occupied @390: ok
ok   5 undo @390: ok
ok   6 test @390: ok
ok   7 start new @390: ok
ok   8 reload @390: ok
ok   1 grid @360: ok
ok   2 sheet @360: ok
ok   3 paint @360: ok
ok   4 occupied @360: ok
ok   5 undo @360: ok
ok   6 test @360: ok
ok   7 start new @360: ok
ok   8 reload @360: ok
SMOKE PASS
```

Screenshots at 390×844, light, in this folder. Captions name only what is in the frame.
- `01-rules-on.png`: Rules sheet on Demo stage. "Rules · Demo stage", "How is this stage won?", "Default rule", the button "Win by defeating every enemy", "Wiping all rival pieces wins", "You lose when all your units fall.", Reset to default, Close. The grid is behind the sheet.
- `02-rules-off.png`: the same sheet with "This stage's rule" and "With this off, nobody wins: Test plays until you leave." A "Changed · Undo" toast covers the top bar.
- `03-on-your-team.png`: Hero. Health 9 and Attack 1, both "Same as army". "On your team" and "Starts on your team's start tiles, in this order." Abilities, + Add ability, "Place this unit on a stage to test it."
- `04-empty-board.png`: Blank. The banner "Place a unit on this stage to test it." with Dismiss. "No enemies: free roam." "No player side: Test never reaches an outcome." One Floor tile. A "Changed · Undo" toast at the bottom.
- `05-occupied.png`: "Archer · Your team" with Edit, Move, Delete, Test, Ground Floor, and Close. The grid is behind the sheet.

## Export audit
Release `build()` from `tools/play-stage/build.ts` into `/tmp/s6a-play`, and `build()` from `tools/maker/build.ts` into `/tmp/s6a-maker` (dev false, commit forty zeros). Then:
```
rg -n -e 'tools/maker' -e 'src/editor' -e 'catalogue.json.js' -e 'behaviours.json' /tmp/s6a-play /tmp/s6a-maker/play-stage
```
```
/tmp/s6a-play/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
/tmp/s6a-maker/play-stage/4eb4ed272938/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
```
No `tools/maker` hit. No `src/editor` hit. No file named `catalogue.json.js` or `behaviours.json` (`find` of those names printed nothing). The two lines are a comment in the engine catalogue module. `src/rules/behaviours/registry.ts` already imported it on the base. This step does not edit that file. `playBuild` throws if a walked path includes `editor`; both builds returned.

## Helpers & self-review
- Helper (win-rule model): `ruleOf`, `setStageRule`, `resetStageRule`, `setTeam`, `winOf`, `emptyBoard`, the `play: army` throw, `WIRED`, and the Empty army and slice. Found no bug. Changed nothing.
- Helper (Rules UI and routing): the Rules sheet, On your team, the stage click router, and the smoke. Found the sheet, the P = B gates, the occupied line, and check 8 in order. It read the router while rule Undo was stage-only. Changed nothing.
- Helper (named tests): looked for plants that would still pass. Too weak as first written: no stage-Off against project-On, slice equality only on the returned string, `mutual` unread, team `size` not floored at 1, an in-place `stage.loadout` would pass, delete-while-on not refused. I tightened the slice `deepEqual`, the appended `stage.rules` id, `mutual` `"last-actor-loses"`, and the team test (empty roster, size 1 after Off, stage text unchanged, delete refused while On). I did not add the other override direction or a one-side-still-plays test. The stage-On over project-Off case already fails a resolver that ignores the stage.
- Self-review, after those notes: rule Undo on the project screen was going to the room handler. The router now takes `undo` whenever `state.undo === "rule"`, and the 6s timer repaints the project screen too. Green and the three s6a runs are after that fix.
- Self-review: Done when — green 1093/0, the eleven named tests, s6a three times (one under CPU) and S0, s3, s4a all pass at 390 and 360, five screenshots, count 392, export audit above. Done.
- Self-review: QA G1–G10 — G1 the named tests fail if the rule, the slice, the outcome, the rev gate, the wired knob, Empty, the team roster, `canUpdate`, or `addable` is skipped, G2 typecheck clean, G3 no phase writes, G4 no new quoted signature, G5 S0 and `behaviour-library/**` and `catalogue.ts` unedited, G6 extras named below, G7 392 with every over-cap file named, G8 one undo snapshot and no new dependency, G9 this note, G10 the 6a behaviour (Rules, Test, On your team, playable Empty, plain sentence, no "A unit stands here" in the sheet). Done.

## Decisions & deviations
- `PlayDocs.win` is omitted when the source is default and the slice has no `win-condition`. `match.ts` then keeps `installOne`, so the demo still wipes. `install` would read a missing `wipe_wins` as false. After the first edit the slice contains the behaviour, so Reset reads the slice default true and the setup stays. The source line stays "This stage's rule".
- The open sheet builds a temporary `sliceDoc` when the saved slice lacks `win-condition`. It is not written until the toggle. P < B shows the 5c offer and writes nothing. P > B shows the newer note and Close only. No mutual, time, or tiebreak control. The toggle is `knobWidget`'s button, labelled "Win by defeating every enemy"; the slice label is the sub-line. No new CSS. Test is never disabled.
- Undo keeps one previous text. `planSave` does not delete, so undoing the first create leaves the setup file unreferenced (D11). Rule Undo is handled off the stage screen too, so Back within 6 seconds does not undo a room. The rules session is one flag, one skeleton, and that one snapshot.
- Empty's army id is `setup_01M7XPE6006A10000000000000`, generated from rev 30, listed on `project.rules`. The slice bytes equal `sliceOf` of `unit-roster` and `terrain`. Health 9, Attack 1. `team_colour`'s default is null and the answer is still `{source:"default"}`. The `play: army` throw is unchanged. An old Empty (no army, catalogueRev 1) is not migrated.
- `emptyBoard` is no chosen unit on a start tile, and no NPC, and no enemy. A stage with units on one side only still starts. The place-a-unit sentence returns before `start`.
- Frozen smokes, one line each. s3 before `7c375c0009ee9cc147b8253365d6b3194d8c33c942e410a00ff76bfea1fc6e68`, after `7d8d570e76bb88cd810fdc922bdef423d726563958b316a8d9367e56854f61e7`: `"no unit roster yet"` to `"Place a unit on this stage to test it"`. s4a before `040e601155c7f8c05cfb8cfa040ab85110a7b3884a63f511ef2808319e3dc493`, after `68a00fd3c1798b1c725c6c49251354b4c95f397ff5cac7c57c070f9c661479aa`: the occupied `note` is the sheet title containing `" · "`. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
- Count 392. Over the file caps: `rules-panel.ts` 87 against 60 (offer, newer note, display slice, save, one undo). `rules.test.ts` 102 against 60 (the eight named tests, including driving the last enemy to 0 HP). `home.ts` 19 against 10, inside the allowed +10 for the click router. `project.ts` 12 against 8 (`winOf`). `match.ts` 6 against 3 and `load.ts` 3 against 2 (the optional win field; a replaced line is one insertion and one deletion). `unit-diagram.ts` 3 against 2 (`playLine`). `maker-law.test.ts` 4 against 2, s3 2 against 1, s4a 2 against 1 (each a one-line replacement). Under the cap: `rules.ts` 54/55, `team.ts` 18/20, `rule-of.ts` 11/12, `stage.ts` 7/12, `units.ts` 5/12, `units.test.ts` 15/15, `play-stage-source.test.ts` 6/8, `add-ability.test.ts` 29/35, `test-gate.ts` plus `test-launch.ts` 6/10, `wired.ts` 1/1. No file is near 500 lines (`stage.ts` is 264). No new dependency. `behaviour-library/**` and `src/rules/behaviours/catalogue.ts` are untouched.

## Next step
- 6b is the level curve. Not started.
