# Hand-back step-06b-levels r1
Step file: docs/maker/steps/step-06-levels-win-rules.md (6b only: Behaviour, Build, smoke, Must NOT, Done when, L150–194). Blob c846699d7202cb23d01d43d8ff3b3383aa310580, sha256 a80602396f4839157d1009166e84bd629c61c2c8ba5a9a1326f73f3fb3183192. Nothing from 6c.
Base commit: 0ac31c878e99790447eaa59989e2c26d2cd7d199     Code head: 62963cea27954cd108713c3b48e9b4c030de05e3     Code head tree: 25c6542551c0625ca8b943845d1ea8f459f18881     Branch: step/step-06b-levels-r1-chatA     PR: none yet from the branch.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	handoff/steps/tests/s6b-levels/smoke.mjs
A	src/editor/rules/levels.ts
M	src/rules/behaviours/wired.ts
A	tests/editor/levels.test.ts
M	tests/editor/maker-law.test.ts
A	tests/tools/play-levels.test.ts
M	tools/maker/home.ts
A	tools/maker/levels.ts
M	tools/maker/project.ts
M	tools/play-stage/hud.ts
M	tools/play-stage/load.ts
M	tools/play-stage/match.ts
M	tools/play-stage/page.ts
M	tools/play-stage/project.ts

The tip adds only this folder (this note and the six screenshots).

## Green
N = 9. Floor 1093 (6a's final count). `npm test` 1102/0/0/0. typecheck exit 0. lint exit 0 (`eslint --max-warnings 0`). deps exit 0 (172 modules, 492 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs.
`npm ci` (lockfile, 135 packages) was run on this checkout. `npm run green` on the code head, after the product commit, exited 0. No product file changed after that.
```
# tests 1102
# pass 1102
# fail 0
# skipped 0
# todo 0
```
Named tests: `turn on levels re-cuts the slice`, `threshold edit stores the whole list`, `list length follows levels`, `turn off detaches and keeps the file`, `wired level knobs change the adapter`, `levels reach Test`, `a move pays XP in Test`, `custom curve plays in Test`, `no levels, no strip`.
Line count at the code head, `git diff --shortstat 0ac31c878e99790447eaa59989e2c26d2cd7d199..62963cea27954cd108713c3b48e9b4c030de05e3 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s6b-levels/**'`: 13 files changed, 294 insertions(+), 16 deletions(-). 294 + 16 = 310.
The s6b smoke is 93 lines (cap 130, outside the 400). Waits are `waitForFunction`. `locator.waitFor` remains only inside tap, press, slide, and the End turn tap. No `waitForTimeout`.

## Smoke
`handoff/steps/tests/s0-play-input/touch-smoke.mjs` is unedited, sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (this sandbox has no Google Chrome). `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`. `CHROME` set to that shell.

s6b, port 8806. `node handoff/steps/tests/s6b-levels/smoke.mjs . 8806` printed the same 16 ok lines and `SMOKE PASS` three times: once idle, once under eight `node -e 'for(;;){}'` loops, once idle again. Check 8 is measured with the Level curve editor open and scrolled so the Level 9 row is inside the sheet (`big()` runs then; the Levels section is on the project screen under the sheet). The eight CPU loops were killed after that run.
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

## Screenshots
390×844, light, in this folder. Captions name only what is in the frame.
- `01-levels-off.png`: My game. Wolf, Villager, Crate, Merchant, + Add unit. Heading Levels. The card "Levels: Off" and the button "Turn on levels". Test. Back and Save in the top bar.
- `02-levels-on.png`: the same project. The card reads "Levels: 9 · 112 XP to the top". Test. Back and Save.
- `03-editor-top.png`: the Levels sheet over a dimmed top bar (Back, My game, Save). Sheet Back, title Levels. "Number of levels" with the slider at 9. "XP to reach each level". Level 1, 17 XP. Level 2, 11 XP. Level 3, 13 XP. Level 4, 11 XP. The start of Level 5, 13 XP.
- `04-editor-scrolled.png`: the same sheet, scrolled. The leftover "13 XP", then Level 6, 14 XP. Level 7, 11 XP. Level 8, 11 XP. Level 9, 11 XP. Reset curve. "XP per move" with the slider at 1. ▶ Test. Turn off levels.
- `05-xp-before.png`: Test. YOUR TURN. Menu. The map. The strip "Level 0 · 0/2 XP". End turn. No unit plate.
- `06-xp-after.png`: Test after two Knight moves. Back to maker, YOUR TURN, Recentre, Menu. The strip "Level 1 · 0/11 XP". Knight, 9/9. Attack, Wait, End turn.

## Export audit
Release `build()` from `tools/play-stage/build.ts` into `/tmp/s6b-play`, and `build()` from `tools/maker/build.ts` into `/tmp/s6b-maker` (dev false, commit forty zeros). Then:
```
rg -n -e 'tools/maker' -e 'src/editor' -e 'catalogue.json.js' -e 'behaviours.json' /tmp/s6b-play /tmp/s6b-maker/play-stage
```
```
/tmp/s6b-play/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
/tmp/s6b-maker/play-stage/ec57342595a1/src/rules/behaviours/catalogue.js:4: *  behaviours.json rev 26, sha256 ea8b3302…. `table` = sha256 of the canonical JSON of {gates, xp-levels, terrain}; a test recomputes it. */
```
No `tools/maker` hit. No `src/editor` hit. No file named `catalogue.json.js` or `behaviours.json` (`find` of those names printed nothing). The two lines are a comment in the engine catalogue module. `src/rules/behaviours/registry.ts` already imported it on the base. This step does not edit that file. `playBuild` throws if a walked path includes `editor`; both builds returned.

## Helpers & self-review
- Helper (guide, `b37737ef-0852-43bc-ada3-01a0846774c6`): the 6b behaviour against `levelsOf`, the editor, and the strip. Blocker: Turn off still called `XP_LEVELS.install` because the slice still contained `xp-levels`, so Test would show the catalogue curve. Fixed: `levelsOf` returns undefined when `ruleOf` source is `"default"` and does not call `install`. It also named `tools/play-stage/page.ts` as an extra file (the board gap). Both are in Decisions.
- Helper (plants, `7a481989-164a-4482-a3bd-5d62535e2bab`): the named tests as first written. Misses: an empty `answers` object still passed the D16 walk; `setLevels(5)` did not assert the `levels` answer; the curve plant did not catch 17, 99, and 112 on their own. Tightened: every slice knob that has a default must be `{source:"default"}` and the key set must match; `list length follows levels` asserts `{source:"user", value:5, rev:1}`; `curvePlant` flags `17`, `99`, `112`, and a table starting `[17, 11`, and a positive plant of those three lines.
- Helper (UI and smoke, `a1edae81-dd52-4279-bef7-4a43b7d7ea2f`): the sheet and the smoke script. The first smoke waited on the project `h1` ("My game") and tapped the first `[data-act="test"]` (the project button under the scrim). Fixed: `[data-sheet=levels] h1`, and `tap` uses `.last()` so the sheet Test is hit. Check 6 now also requires `window.__driver.stats.draws > 0` before an empty hidden `#xp` counts, so the strip cannot pass before the first frame. The three passing s6b runs are after that.
- Helper (guide re-read, `05612cde-6343-44bf-a1af-2d55782747e0`): the committed code against 6b Behaviour and Must NOT. No blocker. Confirmed the default-source omit, the `top` precedence, `putList` / `resetCurve` / `setLevels` / reattach, the wired triple, and no catalogue literals in the two product files. It re-ran `levels.test.ts`, `play-levels.test.ts`, and the maker-law plant: 10/10.
- Helper (plant re-read, `ad9257fc-9259-4461-81f3-fa5348dcdab7`): the nine named tests and `curvePlant` on the committed tree. All CATCH. An empty `answers` object fails the D16 walk. `setLevels(5)` asserts `{source:"user", value:5, rev:1}`. Turn off then `playDocsOf` has `levels === undefined`. `curvePlant` flags 17, 99, 112, and a table starting `[17, 11`, and its positive sample fails.
- Self-review, after those notes: Done when — green 1102/0, the nine named tests, s6b three times (one under CPU) and S0, s3, s4a, s6a all pass at 390 and 360, six screenshots, count 310, export audit above. Done.
- Self-review: QA G1–G10 — G1 the named tests fail if the slice, the D16 answers, the whole threshold list, the list length, the detach, the wired knobs, the adapter, the paid move, the custom curve, or the missing strip is skipped, G2 typecheck clean, G3 no phase writes (`check:state` OK), G4 no new quoted signature, G5 S0, `behaviour-library/**`, and `catalogue.ts` unedited, G6 the extra file is `page.ts` (named below), G7 310 with every over-cap file named, G8 one undo snapshot and no new dependency, G9 this note, G10 the 6b behaviour (Levels Off/On, the curve editor, Reset, Test, Turn off, the XP strip, no offer on level-up). Done.

## Decisions & deviations
- `PlayDocs.levels` is omitted whenever `ruleOf` source is `"default"` (no attached setup). After Turn off the slice still has `xp-levels` (D11: the file stays, the slice is not cut back) but Test has no levels and no strip. Reset keeps the setup, so `{source:"default"}` still plays the slice default through `knob()`. The bundled demo never had the behaviour, so it also has no levels. This is unlike win, which still plays via `installOne` when the source is default. The strip reads `levels.state()` for level and xp, and `levels.rules.thresholds[level]` for the next cost, because `state()` has no "need". That read is display only; the engine still levels in `pay()`. A missing bar shows level 0, xp 0, need `thresholds[0]`, not Top level (`&&` binds before `||`).
- The board shortens by `XP_H` (28) only when `view().xp !== null`, in `page.ts` `place()`, before `seat()`. Extra file, not in the 6b table: the strip sits under the board (`bottom: ROW_FOOT + PLATE_H`) and the bottom row stays tappable. S0 is unchanged because `xp` is null. The strip is text, `aria-live="polite"`, `pointer-events: none`, not a 48 px target. No new CSS. Sliders use the existing `input.knob` (48 px) and `data-lvl`, not `data-knob`, so they do not go through the ability setter.
- Turn on reattaches a detached `xp-levels` file instead of minting a second setup, so reload then Turn on shows the last curve. P < B shows the 5c Update offer and writes nothing. P > B shows the newer note. No bar, kill-XP, PvP, card-hand, pool, or level-up control.
- Undo keeps one previous text (`stack` is replaced, not grown). `planSave` does not delete, so undoing the first create leaves the setup file unreferenced (D11). Level Undo is handled whenever `state.undo === "level"`, including off the project screen, so it does not fall through to a room restore. The 6s timer repaints only the project screen.
- Count 310. Over the file caps: `home.ts` 17 against 8 (the `l:` router; allowed +10, so 17 is inside that). `tools/play-stage/project.ts` 13 against 8 (`levelsOf` returns undefined on a default source, then `install`). `tools/play-stage/load.ts` 5 against 3 (the optional `levels` field; a replaced line is one insertion and one deletion). `levels.test.ts` 68 against 65 (the D16 knob walk and the `levels: 5` answer). `play-levels.test.ts` 48 against 45 (the hop helper and the Turn-off assert). `page.ts` is the extra file, 4 lines. Under the cap: `src/editor/rules/levels.ts` 62/70, `tools/maker/levels.ts` 74/90, `tools/maker/project.ts` 4/4, `wired.ts` 1/1, `maker-law.test.ts` 3/4, `match.ts` plus `hud.ts` 11/16. No file is near 500 lines (`match.ts` is 173, `home.ts` is 158). No new dependency. `behaviour-library/**`, `src/rules/behaviours/catalogue.ts`, and `tools/maker/catalogue.ts` are untouched. The setup id in the tests is the fixed string `setup_01JXP00000000000000000001A`; the UI mints one with `ulid`.

## Next step
- 6c is the tactics checkpoint. Not started.
