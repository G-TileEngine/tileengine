# docs/rebuild: how each step was actually built

## What this folder is for

A brand-new AI (or a new chat with no history) can point at this repo, start at `baseline.md`, and follow the files here in order. Doing so recreates the engine exactly as it was merged on `main`: the same files, the same code, the same test count, and every bug fix found along the way, already applied.

The rebuild doesn't start from an empty repo. Before the maker steps, the engine already had about 7,300 lines of engine code in `src/` (19,378 lines across `src/`, `tools/`, `tests/` and `scripts/`). `baseline.md` names that commit, lists every file in it, and shows how to check it. Each step file then starts from where the previous one ended.

The step briefs in `docs/maker/steps/` say what each step had to build *before* it was built. They stay as they were. The files here are the record of what happened *after*.

## Order

| # | File | Step brief | Starts on | Ends on |
|---|---|---|---|---|
| 0 | `baseline.md` | none | `1b834c31` (tree `12f833ed`), 1014 tests | same |
| 1 | `step-00.md` S0 touch play | `docs/maker/steps/step-00-play-input.md` | `1b834c31` | PR #76, merge `9a9ca90e`, 1023 tests |
| 2 | `step-01a.md` S1a project reader | `docs/maker/steps/step-01-project-format.md` §1a | `f137ca26` (main after S0, with the ui-shell lint ignore `8a737c5f` and the step 1 brief) | PR #77, merge `aa158fda`, 1034 tests |
| 3 | `step-01b.md` S1b play stage loads the project | `docs/maker/steps/step-01-project-format.md` §1b | `aa158fda` | PR #78, merge `57af7135`, 1036 tests; smoke refreeze `9fc49890` |
| 4 | `step-02.md` Home, save and load | `docs/maker/steps/step-02-home-save-load.md` | `772f7aa2` (smoke-refreeze `9fc49890` plus one docs-only commit) | PR #79, merge `34fda674`, 1039 tests |
| 5 | `step-02b.md` play-stage carries A and B | `docs/maker/steps/step-02b-play-stage-carries.md` | `34fda674` | PR #80, merge `fdf29002`, 1041 tests |
| 6 | `step-03.md` Test plays the project | `docs/maker/steps/step-03-test.md` | `fdf29002` | PR #81, merge `b8f2b480`, 1049 tests |
| 7 | `step-03b.md` slice r29 | `docs/maker/steps/step-03b-slice-r29.md` | `fdb7ad56` (main after the step 3 r2b QA review) | PR #82, merge `402699d5`, 1051 tests |
| 8 | `step-04a.md` stage editor and terrain painting | `docs/maker/steps/step-04-stage-editor.md` §4a | `402699d5` | PR #83, merge `02efdd04`, 1053 tests |
| 9 | `step-00b.md` sides from data | `docs/maker/steps/step-00b-sides-from-data.md` | `02efdd04` (the 4a merge; 00b was built after 4a) | PR #84, merge `d62f87bc`, 1060 tests |
| 10 | `step-04b.md` stage place | `docs/maker/steps/step-04-stage-editor.md` §4b | `d62f87bc` | PR #85, merge `a85ae665`, 1063 tests |
| 11 | `step-04c.md` stages and maps | `docs/maker/steps/step-04-stage-editor.md` §4c | `a85ae665` | PR #86, merge `9bbd115a`, 1065 tests |
| 12 | `step-05a.md` units list and editor | `docs/maker/steps/step-05-units.md` §5a | `37f42de3` (04 guide L166 erratum after the 4c merge) | PR #87, merge `b8c1084e`, 1070 tests |
| 13 | `step-05b.md` abilities | `docs/maker/steps/step-05-units.md` §5b | `0dc2c588` (5a r2 QA recheck on main) | PR #88, merge `c66760b7`, 1074 tests |
| 14 | `step-05c.md` + Add ability | `docs/maker/steps/step-05-units.md` §5c | `88a6ac93` | PR #89, merge `5a2c8e79`, 1082 tests |
| 15 | `step-06a.md` win rules, Rules panel, On your team | `docs/maker/steps/step-06-levels-win-rules.md` §6a | `ae968eb0` | PR #90, merge `23b5755f`, 1093 tests |
| 16 | `step-06b.md` levels, Level curve editor, XP strip | `docs/maker/steps/step-06-levels-win-rules.md` §6b | `0ac31c87` | PR #91, merge `be8ce821`, 1102 tests |
| 17 | `step-06c.md` tactics checkpoint, Empty to a win | `docs/maker/steps/step-06-levels-win-rules.md` §6c | `68a67a56` | PR #92, merge `be4f47e1`, 1105 tests |
| 18 | `step-06d.md` phone baseline page | `docs/maker/steps/step-06d-baseline-page.md` | `cbe0dc8a` | PR #93, merge `aa2ef7e3`, 1108 tests |
| 19 | `step-07.md` stage links and the two-floor shop | `docs/maker/steps/step-07-stage-links.md` | `33538c89` | PR #94, merge `24ab0250`, 1114 tests |
| 20 | `step-08a.md` autosave at links and the session start | `docs/maker/steps/step-08-autosave-links.md` §8a | `9f7f7e52` (step 8 guide r4 with QA reviews and cn-session staging) | PR #96, merge `a0c1dad2`, 1122 tests |
| 21 | `step-08b.md` stair phone check and no silent party drop | `docs/maker/steps/step-08b-stair-baseline.md` | `ecd22d80` (8b guide r2 with QA recheck, docs-only on the 8a merge) | PR #98, merge `42cc84b4`, 1125 tests |
| 22 | `step-09a.md` map backgrounds from project data | `docs/maker/steps/step-09-art-backgrounds.md` | `6e9d624f` (later main after the 9a guide r2 and 08b phone reviews, docs-only over D29 `8ab22996`) | PR #99, merge `ab64d4fb`, 1134 tests |
| 23 | `step-08c.md` baseline walk draws units | `docs/maker/steps/step-08c-baseline-walk.md` | `02a0a9c5` (9a r1 QA review on the 9a merge; the 8c go-line after 9a) | PR #100, merge `cd48ebdc`, 1135 tests |
| 24 | `step-09b.md` background upload editor | `docs/maker/steps/step-09b-art-upload.md` | `8572cd05` (9b r2 and 9c r1 guides + QA review, docs-only on `2a6146ae`) | PR #101, merge `a1d01698`, 1141 tests |
| 25 | `step-09c.md` link markers on the play board | `docs/maker/steps/step-09c-link-markers.md` | `21763070` (9b r1 QA review on the 9b merge; the 9c go-line). Merge first parent `df771fef` | PR #102, merge `9088feb2`, 1142 tests |
| 26 | `step-10a.md` carries before the engine effect path | `docs/maker/steps/step-10a-carries.md` | `31f4c0c4` (10a r2 guide + QA reviews; the 10a go-line). Merge first parent `751994a7` | PR #103, merge `c3e056ff`, 1146 tests |
| 27 | `step-10b.md` effect data (the effects/ slot and Test plays a saved effect) | `docs/maker/steps/step-10b-effect-data.md` | `0673be7e` (the 10b go-line; 10a r1 review). Merge first parent `12b31b1f` | PR #104, merge `10ab12d6`, 1152 tests |
| 28 | `step-10c.md` the maker's effect editor (Effects list, edit, Duplicate, delete into .deleted/, the Effect row, effectNotRule) | `docs/maker/steps/step-10c-effect-editor.md` | `76fd7502` (the 10c go-line; 10b record). Merge first parent `4f9eb79c` | PR #105, merge `699bdb83`, 1157 tests |
| 29 | `step-10d.md` built-in effects in the Effect row (the 10 BTF presets, picked by bare id and played in Test) | `docs/maker/steps/step-10d-builtin-effects.md` | `ef25669a` (the 10d go-line; 10d guide r2, after the 10c record). Merge first parent `de22e8af` | PR #106, merge `a8f2e2fd`, 1160 tests |
| 30 | `step-11a.md` export MVP (Build game downloads the saved project as a playable static web build: the play tree, the saved docs verbatim as project/files.js, the pictures) | `docs/maker/steps/step-11a-export-mvp.md` | `7460ed7a` (the 11a go-line; 11a guide r2 and QA's reviews). Merge first parent `1e5ae398` | PR #107, merge `7d73c74b`, 1165 tests |
| 31 | `step-11a2.md` the Build game sheets (Your game is ready with Share when the zip can be shared, and Couldn't build your game with Try again; QA's 11a export carries) | `docs/maker/steps/step-11a2-ready-sheet.md` | `1b34e541` (the 11a2 go-line base; docs-only on the 11a merge `7d73c74b`, guide r4 on `761f36a7`). Merge first parent `761f36a7` | PR #108, merge `0d683870`, 1167 tests |
| 32 | `step-11b.md` a debug APK of an exported game (one command packs a release 11a export, or the demo, into the pinned Capacitor 6 wrapper: minSdk 26, portrait, no INTERNET, debug key only; pinned JDK and SDK setup) | `docs/maker/steps/step-11b-debug-apk.md` | `773eb8c8` (the 11b go-line base; docs-only on the 11a2 merge `0d683870`, guide r3 on `773eb8c8`). r1 PR #109 superseded by r2. Merge first parent `24603347` | PR #110, merge `71bc22db`, 1170 tests |
| 33 | `step-11c1.md` budgets as project data (option A budgets in the templates and fixture; the reader's budgetNear / budgetOver / budgetInvalid rows; budgetOver blocks Test and Build game with UX's lines; the project screen's Budgets row) | `docs/maker/steps/step-11c1-budgets.md` | `b7acc899` (the 11c1 go-line base: guide base `4c6d1c40` plus the guide r2, paste, DSK step11c rulings and staged CN-029, not applied). r1 PR #111 superseded by r2. Merge first parent `c1baf1db` | PR #112, merge `f784e678`, 1175 tests |
| 34 | `step-f0c.md` carries (CN-029's budget types land in core-types byte for byte and replace 11c1's local copies; one `PLAY_LIMITS` pair for play, the sim and the gate, so Test and Build game refuse a weighted or waves pool with one line naming the stage) | `docs/maker/steps/step-f0c-carries.md` | `49db9f47` (the F0c go-line base: QA's F0c kit r1 review, docs-only on the 11c1 record `b2cb571f`; the kit r2 guide, shipped test and plants reached main after it at `3fe48a8d`). Merge first parent `664f8303` | PR #113, merge `bde1e737`, 1180 tests |
| 35 | `step-f1.md` the look kit (every maker button names its role with one primary per screen or sheet and red danger buttons; UX's 16 line icons in `tools/maker/icons.ts`; `.pick` chips; two-option framed-pill toggles; 48 px card thumbnails; the floating Undo chip) | `docs/maker/steps/step-f1-look-kit.md` | `04dadacf` (the F1 go-line base: the kit r3b guide, shipped test, plants and QA's kit reviews r1–r3b, docs and handoff only on the F0c record `e0455199`). r1 not merged (QA NOT OK, M1 icons); r2 per QA's go-line. Merge first parent `bf07a227` | PR #114, merge `b6c3da0e`, 1188 tests |
| 36 | `step-art1a.md` the art bake core (ART0 ruled: B r6b is the baseline and its Python recipes are ported to JavaScript; `tools/art-bake/` with its own no-dependency package: the pixel-mode sprite, sel-out outline, one palette file, PNG writer, runner and manifest; the r6 crate pixel-exact with the Python bake at 32 and 48 px) | `docs/maker/steps/step-art1a-bake-core.md` | `4912a973` (the ART1a go-line base: the plan's ART1a re-size, docs-only on the kit push `62fbaa65`, which is on `fea3098b`, the guide's trial base). r1 then r2 on one branch (QA NOT OK, R1 Rule 8 chained headers; r2 caps re-stated to 400). Merge first parent `dad319a0` | PR #115, merge `5e668961`, 1194 tests |
| 37 | `step-f2a1.md` the F1 carries (every framed-pill toggle's On option is `{label}: On`, matching Off; `app.css` drops the dead `.card.new`; the Budgets row leads with UX's budgets icon; the stage error Back, the unit-page rename button and the read-only levels card get the icon or thumb F1 named) | `docs/maker/steps/step-f2a1-carries.md` | `77a64648` (the F2a1 go-line and kit-push base: the guide, the 3-file kit, QA's kit review and the plan's F2a split, docs and handoff only on the ART1a record `6ac84b5d`). One round, no rework. Merge first parent `77a64648` | PR #116, merge `1ae71d48`, 1198 tests |
| 38 | `step-f2a2a.md` the game menu kit (six icons, the sheet/row/eyebrow/grabber CSS, and `tools/maker/game-menu.ts`: the ☰ game menu, the stage switcher, the section sheets, menuView/menuSet; nothing imports the module except the shipped test) | `docs/maker/steps/step-f2a2a-menu-kit.md` | `fa401c88` (the F2a2a go-line and kit-push base: the guide, the 3-file kit and QA's kit review, docs and handoff only on the F2a1 record `ce848f57`). One round, no rework. Merge first parent `fa401c88` | PR #117, merge `1a6d16a4`, 1203 tests |
| 39 | `step-f2a2b.md` land on the map (opening a game lands on the stage editor; ☰ and the stage switcher are wired from F2a2a's `game-menu.ts`; the project page is deleted; Budgets and Build game move into ☰) | `docs/maker/steps/step-f2a2b-land-on-map.md` | `fd87b913` (the F2a2b go-line and kit-push base: the r2 guide, the 3-file kit and QA's r2 kit review, docs and handoff only on the F2a2a merge `1a6d16a4`). One builder round, no rework (the kit r2 already cleared QA's 3 must-fixes). Merge first parent `44fb5842` | PR #118, merge `79fb46f6`, 1204 tests |

Follow them strictly in order (rebuild order, not numeric: step 00b starts on the 4a merge, so it sits after `step-04a.md`). Between steps, main also gained docs-only commits; a step's start commit is always the one named in its file.

## How each step file is laid out

Each step file stands alone and links to its original brief. It has the same parts:

- (a) start base and merge commit, PR and test count
- (b) every file added or changed, one line each
- (c) the key code explained, plus the git commands for the full diff
- (d) what went wrong, in order, and the fix
- (e) "do it right first time": the rules that stop those failures repeating
- (f) rebuild check: the commands that prove the result matches
- Blob check: the exact git blob id every shipped file must have at the merge
- Appendix: the full code as merged. New files in full; edited files as the exact diff from the step's base, then in full

Facts are cited by commit sha or `file:line` at the commit named.

## Keeping it current

Each step's file is written right after that step merges and passes QA's post-merge check, and before the next step's go-line goes out. A step isn't finished until its rebuild file is on `main`. When a new record lands, add a row to the Order table in this file.

## Rules for every step (from the briefs and QA reviews)

- Work on a branch `step/<step-id>-r<N>-chatA` from the named base. Never commit to main, never force-push, never delete a branch.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). The last commit adds only `handback/<step-id>/r<N>/HANDBACK.md`.
- Gate: `npm ci && npm run green` exits 0 at floor + N (at the baseline and in S0, only the known ui-shell lint fails; see `baseline.md` (d)). `npm test` alone isn't enough.
- 400 changed lines or fewer per run, counted the way the brief says.
- After any play-stage change, run the S0 touch smoke unchanged and paste its result.
- Never print, log, commit or store a token. The push command reads it from an environment variable that must hold the real value, not the placeholder text (see `step-01a.md` (d) 6).
