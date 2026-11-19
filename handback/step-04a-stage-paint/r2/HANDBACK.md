# Hand-back step-04a-stage-paint r2
Step file: docs/maker/steps/step-04-stage-editor.md (r6, 4a sections and the shared run rules only)
Base commit: 402699d52f7c8452d4e70eb698bd404ea9898c98     Code head: fc1f7b2a58b4cc1cb7cb442fc2df4783e6c4dada     Tree: 58abb5fae513ce9bbdc732bfe4363d6045ef5b8f     Branch: step/step-04a-stage-paint-r2-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	handoff/steps/tests/s4a-stage-paint/smoke.mjs
A	src/editor/stage/paint.ts
A	src/editor/stage/sheet.ts
A	src/editor/stage/undo.ts
A	src/project/load/drops.ts
M	src/project/load/read-project.ts
M	tests/editor/maker-law.test.ts
A	tests/editor/stage-editor.test.ts
A	tests/project/load/placement-dropped.test.ts
M	tools/maker/app.css
M	tools/maker/home.ts
M	tools/maker/project.ts
A	tools/maker/stage.ts
M	tools/maker/test-launch.ts

## Green
`npm ci && npm run green` exits 0. N = 2 new tests. Floor 1051 + 2 = 1053.
npm test: 1053/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
```
# tests 1053
# pass 1053
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat 402699d52f7c8452d4e70eb698bd404ea9898c98..fc1f7b2a58b4cc1cb7cb442fc2df4783e6c4dada -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**'`: 13 files changed, 385 insertions(+), 15 deletions(-). 385 insertions + 15 deletions = 400.
The smoke script is 48 lines.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome` (this sandbox has no `/usr/bin/google-chrome`).
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed `SMOKE PASS` once, after the 390 run and the 360 run. Checks 1–8 were ok at both widths.
Named test `placementDropped: warns, skips in memory, writes nothing back` is in the green run.
Build output: `/tmp/s4a-maker-build-r2` (`maker/index.html`, `maker/c2359142b9af/`, `play-stage/c2359142b9af/index.html`). `build.json` commit is the code head.

## Screenshots
390×844, deviceScaleFactor 1, light, Chrome. The r1 shots still match: this round only merged two consts. Taken after the YOUR TURN banner is hidden on the play shot.
- `handback/step-04a-stage-paint/r1/01-project.png` opened project, stage row
- `handback/step-04a-stage-paint/r1/02-stage.png` stage editor
- `handback/step-04a-stage-paint/r1/03-add-here.png` Add here
- `handback/step-04a-stage-paint/r1/04-chip.png` painting chip
- `handback/step-04a-stage-paint/r1/05-view.png` View menu, grid lines off, selection still shown
- `handback/step-04a-stage-paint/r1/06-start-new.png` Start new warning
- `handback/step-04a-stage-paint/r1/07-play.png` play stage opened by Test

## Helpers & self-review
- Helper: r2 review of the `marks()` merge against `479eed2b`. It confirmed the only product diff is that one statement, `out` is still a fresh array, `team` is still `chosen()`, no test was trimmed, and the gate is 385 insertions + 15 deletions = 400. The r1 review's three bug fixes still stand.
- Self-review: stage rows and the editor screen done; Add here lists Floor, Water, Wall block (Path and Dirt hidden) done; paint run, chip, Done, one Undo step done; occupied tile hides closed types and says "A unit stands here" done; View grid lines session-only done; Start new warning, Floor clear, one Undo step done; Test saves and returns to this stage done; failed save keeps the edit and the typed error done; read-only hides the sheet, Start new, and Undo done; placementDropped warns, skips in memory, writes nothing back done; no play-stage change, no S0 edit done; line gate 385 insertions + 15 deletions = 400 and smoke 48 done.

## Decisions & deviations
- Path and Dirt are hidden, not greyed. The play stage still draws only water and wall-block besides floor, so `looks.ts` and the ground-frame test are unchanged. 4b can add them. Add here lists Floor, Water, and Wall block.
- `tools/maker/stage.ts` is 161 lines, over the 85 cap, because the screen, the session, and the save live in one file so `home.ts` stays the click router. r2 merges the two consts in `marks()` into one statement. Behaviour is unchanged.
- `src/project/load/drops.ts` is 37 lines, over the 30 cap. The three placement lists and the outside-map / closed-cell check did not fit 30.
- Extra counted files, not in the guide table: `tools/maker/home.ts` (the router has to open the stage and pass the stage id into Test) and `tools/maker/app.css` (token-only rules for the grid, the chip, and the rows).
- `tools/maker/test-launch.ts` changes by one line: `backScreen` returns `stage` when `from` is stage, so Back from play returns to the editor.
- A cell shows the full slice label when that label is 5 characters or fewer and no unit stands there; otherwise the first letter. Wall block shows W. Pills: You for a player spawn or side player, Foe for a fixed enemy or any other side that is not neutral, NPC otherwise. A spawn with no unit shows ?.
- Occupied means a player spawn, a neutral, or a fixed enemyPool entry on that cell. A non-object list item is skipped. A cell that is not a whole number, is off the map, or whose map is missing is outsideMap. Only `enemyPool` mode fixed is checked. An unknown palette key or unknown id counts as Floor, which is open.
- Add here and View have Close. Start new's other button says Cancel. The undo stack is one snapshot per run, newest first, dropped when the project id or the stage id changes or the page reloads. It is not written into the project. Grid lines are session-only.
- A hide-save commits the draft it started with and does not drop a newer draft painted while that save was in flight. A failed Test on the stage screen shows those sentences in the banner. No new dependency.
