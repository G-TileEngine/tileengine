# Hand-back step-06c-checkpoint r1
Step file: docs/maker/steps/step-06-levels-win-rules.md (6c only: Behaviour, Build, smoke, Must NOT, Done when, L197–226). Blob c846699d7202cb23d01d43d8ff3b3383aa310580, sha256 a80602396f4839157d1009166e84bd629c61c2c8ba5a9a1326f73f3fb3183192. Nothing from 6a or 6b was rebuilt.
Base commit: 68a67a56787dcf439554a267a1af987479c5f745     Code head: c028fbd2012999089951cff90a7442cf675e7428     Code head tree: 2549e455247708b54ce494616d44d9a0612d764b     Branch: step/step-06c-checkpoint-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	handoff/steps/tests/s6c-checkpoint/smoke.mjs
A	tests/editor/checkpoint.test.ts

The tip adds only this folder (this note, the screenshots, and `checkpoint.tileproj/` written by the smoke). No product file outside the 6c table. No gap-fix file.

## Green
N = 3. Floor 1102 (6b's final count). `npm test` 1105/0/0/0. typecheck exit 0. lint exit 0 (`eslint --max-warnings 0`). deps exit 0 (172 modules, 492 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs.
`npm ci` (lockfile, 135 packages) was run on this checkout. `npm run green` on the code-head tree, before the product commit, exited 0. No product file changed after that.
```
# tests 1105
# pass 1105
# fail 0
# skipped 0
# todo 0
```
Named tests: `tactics checkpoint: Empty to a win`, `checkpoint win comes from the rule`, `checkpoint project loads clean`.
Line count at the code head, `git diff --shortstat 68a67a56787dcf439554a267a1af987479c5f745..c028fbd2012999089951cff90a7442cf675e7428 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6c-checkpoint/**'`: 1 file changed, 119 insertions(+). 119 + 0 = 119.
The s6c smoke is 119 lines (cap 130, outside the 400). Waits are `waitForFunction`. `locator.waitFor` remains only inside tap, press, and slide. No `waitForTimeout`.

## Smoke
`handoff/steps/tests/s0-play-input/touch-smoke.mjs` is unedited, sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. No `tools/play-stage/` file changed, so there is no export audit.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell for every smoke, including S0, s3, and s4a, whose scripts default to a Chrome path this sandbox does not have.

s6c, port 8807. `node handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` printed the same 18 ok lines and `SMOKE PASS` three times on the committed script: twice idle, once under eight `node -e 'for(;;){}'` loops. Check 8 runs while each sheet in the flow is open (resize, Add here, unit name, Hero editor, goals, ability cards, the line-shot panel, Raider editor, Add here again, the unit picker, Rules). The eight CPU loops were killed after that run.
```
ok   1 new empty @390: ok
ok   2 resize 6x6 @390: ok
ok   3 wall gap @390: ok
ok   4 hero @390: ok
ok   5 raider @390: ok
ok   6 place @390: ok
ok   7 rules on @390: ok
ok   8 victory @390: ok
ok   9 check 8 @390: ok
ok   1 new empty @360: ok
ok   2 resize 6x6 @360: ok
ok   3 wall gap @360: ok
ok   4 hero @360: ok
ok   5 raider @360: ok
ok   6 place @360: ok
ok   7 rules on @360: ok
ok   8 victory @360: ok
ok   9 check 8 @360: ok
SMOKE PASS
```

S0, port 8797, unedited, once:
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

s3, port 8798, unedited this step:
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

s4a, port 8799, unedited this step:
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

s6a, port 8805, unedited this step:
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

s6b, port 8806, unedited this step:
```
ok   1 levels off then on @390: ok
ok   2 editor rows @390: ok
ok   3 strip before @390: ok
ok   4 two moves @390: ok
ok   5 reset curve @390: ok
ok   6 turn off @390: ok
ok   7 reload @390: ok
ok   8 targets @390: ok
ok   1 levels off then on @360: ok
ok   2 editor rows @360: ok
ok   3 strip before @360: ok
ok   4 two moves @360: ok
ok   5 reset curve @360: ok
ok   6 turn off @360: ok
ok   7 reload @360: ok
ok   8 targets @360: ok
SMOKE PASS
```

## Screenshots
390×844, light, in this folder. Captions name only what is in the frame.
- `02-stage.png`: Blank. Back, View, Rules, Start new, Test. "No enemies: free roam." "No player side: Test never reaches an outcome." Six rows of Floor. Bottom button "Nothing to undo".
- `03-walls.png`: the same stage. One row is W, W, W, Floor, W, W. The rightmost W is outlined. Bottom button "Undo".
- `04-hero.png`: Hero. Name Hero. Start from a role. Health 20, Reset. Attack 2, Reset. On your team. "Starts on your team's start tiles, in this order." Abilities, and the top of a card "Line Shot (stops on first hit)" with Test and ×.
- `04b-ability.png`: the same Hero editor, scrolled so that card sits fully in the frame: "Line Shot (stops on first hit)", Test, ×. Health 20 and Attack 2 are still visible above it.
- `05-raider.png`: Raider. Name Raider. Start from a role. Health 2, Reset. Attack 1, "Same as army". On your team. "Starts on your team's start tiles, in this order." Abilities. + Add ability. "Place this unit on a stage to test it."
- `06-placed.png`: Blank stage. Top-left cell shows F, H, You, and a 1. Bottom-right cell, outlined, shows F, R, and Enemy. The wall row is W, W, W, Floor, W, W. The other cells are Floor. Bottom button "Undo".
- `07-rules.png`: the sheet "Rules · Blank" over the dimmed stage. "How is this stage won?" "Default rule". The button "Win by defeating every enemy". "Wiping all rival pieces wins". "You lose when all your units fall." Reset to default. Close.
- `08-victory.png`: dimmed board. YOUR TURN. Menu. A card: Victory, "All enemies defeated", "2 turns", Restart, Back. Hero 20/20. End turn. No level strip.

`checkpoint.tileproj/` is the 390 run's `window.__read()` dump, not a hand-written project. One Hero (Health 20, Attack 2, one Line Shot setup), one Raider (Health 2), map 6×6 with wall-block on row 2 except column 3, spawn at 0,0, enemy at 5,5. Stage `rules` is empty (the Rules toggle was left on the default). The slice behaviours are `line-shot`, `unit-roster`, and `terrain`.

## Helpers & self-review
- Helper (fight and clock, `6f2860ab-46e8-4db1-ae6b-3298d0c47f41`): `createMatch(docs, 0)`, the XP tick, wipe timing, and the wall gap. A duration of 0 does not land the move until `clock.advance(stepMs)`; omitting that tick leaves the level at 0. The killing shot sets `outcome` to `"win"` before End turn when wipe is on, and leaves it null when wipe is off. Line-shot damage is the slice default 2, not `unit_atk`. The gap at column 3 is the only open crossing; the shot itself does not read walls. A missing foe at the start would have let the Off test pass. The fight now throws if no foe is alive at the start.
- Helper (smoke, `8564df20-da04-498a-917d-128dd8c813fa`): the committed smoke against the 6c list and Check 8. Pass. Attack shown as 2 after a slide to 5 is the slice max, not a failed check. The 390 run deletes `checkpoint.tileproj/` before writing so earlier runs cannot leave extra unit files. The room toast is cleared on the project screen after resize; the unit stat wait is on the shown number and the Reset button, because the input's value is set before the save returns.
- Helper (named tests, `6c68cc3e-06e8-4fa4-ba89-3654e11251d0`): the three tests against Done when. It caught two holes in the first draft: the win path did not require the Raider to be dead, and the slice check allowed an extra behaviour as long as `sliceOf` was called with that longer id list. Both are closed: the win path asserts the foe is dead, and the id list must be exactly `line-shot`, `terrain`, `unit-roster`, `win-condition`, `xp-levels`. Attack 5 does not fail `readProject` (unit stats are not slider-range-checked). No Demo file, no direct project write, no maker import into `tools/play-stage`.
- Self-review, after those notes: Done when — green 1105/0, the three named tests, s6c three times (one under CPU), S0, s3, s4a, s6a, and s6b pass at 390 and 360, screenshots of steps 2–8 ending on Victory, count 119, the phone-baseline folder written by the smoke. No play-stage edit, so no export audit and the S0 file is untouched. Done.
- Self-review: QA G1–G10 — G1 the named tests fail if the save path, the win, the level, a living foe, an Off wipe, a non-empty report, a drifted slice, a bad D16 answer, or an extra behaviour is skipped, G2 typecheck clean, G3 no phase writes (`check:state` OK), G4 no new quoted signature, G5 S0, `behaviour-library/**`, and both catalogue files unedited, G6 only the two files in the 6c table, G7 119 with the one over-cap file named below, G8 no new dependency and no cache, G9 this note, G10 a project made from Empty in the maker plays to Victory, and the Off rule does not. Done.

## Decisions & deviations
- No product file changed. No gap fix. The checkpoint found no missing control: Empty already has terrain and an army, the stage already resizes and paints, units already take a team and a line shot, and Test already wipes when the default rule is on.
- Attack. The step says Attack 5. The Empty slice `unit_atk` max is 2 (catalogue rev 30; `catalogue.ts` and the slice were not edited). The smoke sets the slider to 5 and waits until the shown number is 2, which is what `unitClick` stores. The scripted test calls `setStat(..., "unit_atk", 5)` as the step names. `readProject` still reports nothing, because unit stats are not range-checked. The kill is line-shot damage 2 against Raider Health 2, so Attack is not what wins. The Hero frame shows 2, not 5.
- Wall row. The step says a wall-block row with a gap and does not name the cells. Row 2, columns 0, 1, 2, 4, and 5, gap at column 3. Spawn 0,0 and enemy 5,5 stay floor. The gap is the open crossing; the shot does not look at walls.
- Levels. The scripted test calls `turnOn` and `setThreshold(..., 0, 1)`. `xp_move` stays `{source:"default"}` (1). One landed move reaches level 1, which the win test requires. The smoke does not turn levels on. Victory in the shot is the default wipe, and the frame has no level strip. No level-set picker, offer, or mock offer.
- Clock. `createMatch(docs, 0)` confirms a move only after `advance(stepMs)` (10) and `sync`. The smoke flushes with 40 times `advance(400)` plus `sync` (`advance` clamps to the 100 ms frame). The win test stops at 30 of your turns. The shot's card reads "2 turns".
- The Off test writes the stage `win-condition` with `wipe_wins` false (`{source:"user", value:false, rev:1}`). A missing setup would still wipe. After the Raider falls, `outcome` stays null through End turn. The win path also asserts the Raider is dead, so a level-up alone cannot pass.
- Toast. The resize toast is cleared by waiting on the project screen before Blank is opened. The unit-stat path updates the shown number without a full repaint, so the Raider wait is the shown "2" plus Reset, not the input's value. Neither is a product change.
- Fixed test ids, not minted: project `project_01JSKIRM0000000000000000001`, Hero `unit_01JHERO0000000000000000001`, Raider `unit_01JRAID0000000000000000001`, line shot `setup_01JLINE000000000000000001A`, win `setup_01JWIN0000000000000000001A`, levels `setup_01JXP10000000000000000001A`. `NOW` is `2026-11-22T00:00:00.000Z`. The smoke mints its own ids; the dumped project is that mint.
- Count 119. Over the file cap: `tests/editor/checkpoint.test.ts` 119 against 90. The fight is in the file because the p18 intend helpers are not exported, and the D16 walk and the dead-foe asserts stayed. The run is inside 400. The smoke is 119 against 130 and is excluded. No file is near 500 lines. `home.ts` was not edited. No new dependency.

## Next step
- Step 6's three runs are done. Level-set pickers stay out of step 6.
