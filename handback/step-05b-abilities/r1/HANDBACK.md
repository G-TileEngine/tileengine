# Hand-back step-05b-abilities r1
Step file: docs/maker/steps/step-05-units.md (Header, Delivery, Rules, the count command, and "5b: abilities on a unit").
Base commit: 0dc2c58839131c48e5b30d9d0a3a61ff419f0072     Code head: 4e58c3908239d0ce8029aac10888ae3e654b041e     Code head tree: 537c3227c9acee5ecb8feb9c62a60b0f17ae5927     Branch: step/step-05b-abilities-r1-chatA     PR: none yet from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	handoff/steps/tests/s5b-abilities/smoke.mjs
A	src/editor/unit/panel.ts
M	src/rules/behaviours/index.ts
A	src/rules/behaviours/wired.ts
A	tests/editor/ability-panel.test.ts
M	tests/editor/stage-place.test.ts
A	tests/fixtures/maker/big-ability.json
A	tests/rules/wired.test.ts
A	tests/tools/ability-panel-layout.test.ts
A	tools/maker/ability-panel.ts
M	tools/maker/app.css
M	tools/maker/home.ts
M	tools/maker/stage-sheets.ts
M	tools/maker/stage.ts
M	tools/maker/test-launch.ts
M	tools/maker/units.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

## Green
N = 4. Floor 1070. `npm test` 1074/0/0/0. typecheck exit 0. lint exit 0. deps exit 0 (166 modules). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs. `npm ci` was not re-run here; `node_modules` was already installed from the lockfile. The only edit after green was CSS and one smoke wait: `z-index: 6` moved from `.toast` onto `.toast.above`, and the Spare name wait became `waitForFunction`. The layout test was re-run after the CSS edit and passed.
```
# tests 1074
# pass 1074
# fail 0
# skipped 0
# todo 0
```
Named tests: `wired list matches the play adapter`, `panel layout: 18 knobs, 7 questions, 5 in one, at 360`, `unknown knob type is read-only`. Model test: `ability panel`.
Line count at the code head, `git diff --shortstat 0dc2c58839131c48e5b30d9d0a3a61ff419f0072..4e58c3908239d0ce8029aac10888ae3e654b041e -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5b-abilities/**'`: 17 files changed, 350 insertions(+), 44 deletions(-). 350 + 44 = 394.
The s5b smoke is 84 lines (cap 130). New waits are `waitForFunction`. `locator.waitFor` remains only inside tap and press, the same as the frozen smokes. No `waitForTimeout`.

## Smoke
`handoff/steps/tests/s0-play-input/touch-smoke.mjs` is unedited, sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. s4a, s4b, s4c and s5a smokes are unedited.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (HeadlessChrome/156.0.8078.4). This sandbox has no Google Chrome. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`.
`tools/play-stage/board.ts` is not in the diff.

s5b, port 8803, on the code head (the Spare wait is `waitForFunction`). `node handoff/steps/tests/s5b-abilities/smoke.mjs . 8803` printed:
```
ok   1 sheet @390: ok
ok   2 list @390: ok
ok   3 range @390: ok
ok   4 test aim @390: ok
ok   5 undo @390: ok
ok   6 whole @390: ok
ok   7 nowhere @390: ok
ok   8 targets @390: ok
ok   1 sheet @360: ok
ok   2 list @360: ok
ok   3 range @360: ok
ok   4 test aim @360: ok
ok   5 undo @360: ok
ok   6 whole @360: ok
ok   7 nowhere @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
The same 16 ok lines and `SMOKE PASS` printed three times before the last CSS move (the third under eight `node -e 'for(;;){}'` loops), and once more after `z-index` moved onto `.toast.above` only. Check 8 is measured with the unit sheet, the ability list, and an open panel.

S0, port 8797. `node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` printed:
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
S0 was run on the tree before the toast z-index move. `tools/play-stage/page.ts` did not change after that run.

s5a, port 8802, on the code head:
```
ok   1 units @390: ok
ok   2 add @390: ok
ok   3 role @390: ok
ok   4 health @390: ok
ok   5 delete @390: ok
ok   6 refuse @390: ok
ok   7 reload @390: ok
ok   8 targets @390: ok
ok   1 units @360: ok
ok   2 add @360: ok
ok   3 role @360: ok
ok   4 health @360: ok
ok   5 delete @360: ok
ok   6 refuse @360: ok
ok   7 reload @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
s4c, port 8801, on the code head:
```
ok   1 add @390: ok
ok   2 rename @390: ok
ok   3 resize @390: ok
ok   4 refuse map @390: ok
ok   5 test @390: ok
ok   6 undo @390: ok
ok   7 last stage @390: ok
ok   8 targets @390: ok
ok   1 add @360: ok
ok   2 rename @360: ok
ok   3 resize @360: ok
ok   4 refuse map @360: ok
ok   5 test @360: ok
ok   6 undo @360: ok
ok   7 last stage @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
s4b, port 8800, on the code head:
```
ok   1 add here @390: ok
ok   2 what @390: ok
ok   3 talk @390: ok
ok   4 enemy @390: ok
ok   5 move @390: ok
ok   6 test @390: ok
ok   7 undo @390: ok
ok   8 roam @390: ok
ok   1 add here @360: ok
ok   2 what @360: ok
ok   3 talk @360: ok
ok   4 enemy @360: ok
ok   5 move @360: ok
ok   6 test @360: ok
ok   7 undo @360: ok
ok   8 roam @360: ok
SMOKE PASS
```
s4a, port 8799, on the code head:
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

Screenshots at 390×844, light, in this folder: `01-unit-sheet.png` (Archer · Your team, Edit, Move, Delete, Test), `02-ability-list.png` (both abilities, Test and ×, ▶ Test; ✦2 is on the cell under the sheet, which check 2 reads), `03-ability-panel.png` (Range and Damage), `04-test-start.png` (Archer selected, spell aim open).

## Helpers & self-review
- Helper (ability panel model): rules 1–7 hold in `panel.ts` and `ability-panel.ts`. `openId` is which setup is open, not a reach or badge cache. It named tests that would still pass if empty sections were emitted, if Reset was only tried on an answer that was already default, or if detach's other fields were not compared. I read those paths: empty sections are omitted, Reset writes `{source:"default"}` with no value, detach copies the unit and replaces only `setupIds`. No test lines were added.
- Helper (play start): boot `startMatch(docs)` stays valid, whole-unit Test selects without opening an aim, a `noTarget` choose still enters targeting and fills orthogonal aims, a non-player unit is centred, play-stage does not import maker or editor, the URL unit and ability come back through `aimKind`, and `unit_hp` / `unit_atk` stay on `u:stat`.
- Helper (smoke and frozen kits): s5b was 84 lines, check 8 measures the three open sheets, s0 sha matches, s4a and s4b keep their short `waitForTimeout` inside tap and press, and "A unit stands here" is still in the sheet. It noted that Test and × are asserted on the line shot, not also on the basic attack, and that the Spare name used `locator.waitFor`. That wait is now `waitForFunction`, and s5b was run again.
- Helper (toast and Back): hiding the toast on the project screen while the unit editor is open does not drop a 5b undo. Stage Undo stays above the bottom sheet. After that, s4c failed because `z-index: 6` on every toast covered Cancel. The z-index now lives only on `.toast.above`. s4c then passed.
- Helper (guide audit of the diff): claims A–J and the missing-behaviour check passed. It failed the Spare `locator.waitFor`, which is the fix above. `board.ts` is untouched.
- An earlier line-count pass reported 399 before the toast and z-index fixes. The code head is 394.
- Self-review: Done when — green 1074/0, the four named or model tests, s5b and S0 and s5a and s4c and s4b and s4a pass at 390 and 360, screenshots of the four screens, count 394. Done.
- Self-review: QA G1–G10 — G1 tests green and the named tests ran, G2 typecheck clean, G3 no phase writes, G4 no new quoted signature, G5 S0 kit unedited, G6 extras named below, G7 394 with the over-cap files named, G8 no reach or badge cache and no new dependency, G9 this note, G10 the 5b behaviour (sheet, list, panel, ×, ✦N, Test). Done.

## Decisions & deviations
- The occupied sheet still says "A unit stands here". Frozen s4a check 4 requires that sentence and Floor-only `.choice` rows. Edit, Move, Delete, Test, and an NPC's "What do they do?" are `.btn`. The guide said the sheet replaces that block. The paint rows under it are unchanged.
- Hold is 500 ms, from pointerup minus pointerdown on the same `s:cell`, with no timer. A short tap still uses click. The two events share the one action gate. The threshold is the guide's 500 ms.
- On the project screen the Undo toast is not drawn while the unit editor is open, as in 5a, so Back stays tappable. On the stage, while that editor is open, the toast is `.toast.above` (top 16 px, z-index 6) so it sits above the bottom sheet and does not cover it. A toast without that class has no z-index, so a project sheet stays above it. Undo closes the editor. `openId` is session UI.
- If `choose` returns noTarget, Test still enters targeting and fills the aims with `inOrthogonalReach` cells at that reach. The demo archer has no enemy on a straight orthogonal line. Spell reach is the first ability reach, else `DEFAULT_SPELL_REACH` (3). Basic reach is the unit reach, else `match.step.reach`. The aim is on the start options because the play docs have no setup ids. `board.ts` was not edited. Health and Attack stay on `u:stat` and update in place.
- `project.ts` matches the slice option `orth-only-1`. That one-line replace is 2 lines against a cap of 1. `stage-place.test.ts` L53 expects `[]`, 2 lines against a cap of 1.
- Over the file caps, total 394: `stage.ts` 30 against 25 (✦N, the sheet title, `stageFor`, `s:edit` / `s:try`, and the `folder` rename). `test-launch.ts` 11 against 10 (the aim through the bag, the start function, and the URL). `page.ts` 24 against 15 (`board.ts` is 0). Within cap: `wired.ts` 7/13, `wired.test.ts` 36/40, `panel.ts` 54/70, `ability-panel.ts` 84/85, `stage-sheets.ts` 2/4, `ability-panel.test.ts` 42/60, layout test plus fixture 22/55. Extras: `home.ts` 49, `units.ts` 22, `app.css` 6, `index.ts` 1 (the WIRED re-export the guide asked for).
- This headless shell does not hide a closed `<details>`, so `details.ability:not([open]) > :not(summary) { display: none }` is in `app.css`. The wrapper is a `div.ability`, so the rule is only on `details`. Closed section height was checked at 0. A value equal to the default stores `{source:"default"}` with no value. Reset does the same. × removes that id from `setupIds` only. One undo snapshot per save. No + Add ability, no goal table, no catalogue read. No new dependency.

## Next step
- 5c is + Add ability, after catalogue rev 30 is on main. This run does not show that button.
