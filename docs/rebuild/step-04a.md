# Rebuild record: step 4a, the stage editor screen and terrain painting

Original brief: [`docs/maker/steps/step-04-stage-editor.md`](../maker/steps/step-04-stage-editor.md) r6, the 4a sections and the shared run rules only (blob `35cc37db`, sha256 `d68a075a6ae2be61321afa3cf2e356e2d0b334e9cb448d759ab128ae209dab10`, 384 lines, on main `544087f4` and at the merge). Do [`step-03.md`](step-03.md) and [`step-03b.md`](step-03b.md) first; this step starts on the 03b merge. This file records exactly what shipped.

Sources: PR #83 and branches `step/step-04a-stage-paint-r1-chatA` (r1 tip `24cd2fd0`, r1 code head `479eed2b`) and `step/step-04a-stage-paint-r2-chatA` (r2 tip `f5dcd732`, r2 code head `fc1f7b2a`); `handback/step-04a-stage-paint/r1/HANDBACK.md` at `24cd2fd0` (HB1, blob `99d1d55c`, 65 lines) and `handback/step-04a-stage-paint/r2/HANDBACK.md` at `f5dcd732` (HB2, blob `999bd57d`, 65 lines); Chief Of Staff verify reports `/workspace/share/step04a-verify/report.md` (V1, sha256 `45feb27dd967aa53a1e5f8704f6986db281183c4f58b09d31575455196a7cc79`, 203 lines) and `/workspace/share/step04a-r2-verify/report.md` (V2, sha256 `04f4a270a442f84ed05138bd1c96d4d3da0aceb9209c80786e67041091899b7d`, 225 lines). `docs/qa/step-04a-review.md` (QA1, git hash-object `498fbb09`, 31 lines, already on main `544087f4`): **NOT OK**, one must-fix, the line gate 386 + 15 = 401. Local `/workspace/tileengine/docs/qa/step-04a-r2-review.md` (QA2, git hash-object `88a1d18d`, 15 lines): **OK TO OPEN PR**, gate 385 + 15 = 400. Line numbers are at the commit named. Code line cites are at merge `02efdd04` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `402699d52f7c8452d4e70eb698bd404ea9898c98`, the step 03b merge (PR #82). Floor **1051** tests (guide L17, L166: step 3's final count + N; the go-line base is the 03b merge, already 1051) |
| r1 commits | `479eed2b` maker: stage editor paints ground (code head, tree `bf9b3185`), `24cd2fd0` hand-back (tree `8ca165ad`) (V1:16-20, HB1:3). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour passed. QA **NOT OK** (QA1:3). One must-fix: G7 counts insertions plus deletions, so the official shortstat 386 + 15 = **401**, one over the 400 hard gate (QA1:8; guide L141, L166) |
| r2 commits | on `step/step-04a-stage-paint-r2-chatA`, built on the r1 tip: `fc1f7b2a` maker: merge one stage-editor line under the size gate (code head, tree `58abb5fa`), `f5dcd732` hand-back (tree `ba6b2cb8`) (V2:16-27, HB2:3, QA2:5) |
| r2 verdict | QA **OK TO OPEN PR** (QA2:3). The only product change is the `marks()` const merge at `tools/maker/stage.ts:40`. The gate is 385 + 15 = 400. Behaviour is unchanged. No test was trimmed (QA2:7-8, V2) |
| Merge | PR #83 "Step 4a: stage editor screen and terrain painting", merge commit `02efdd040ce0384c08b0a51fb310fc7737df7de5`, 2026-11-19 18:22 (UK time). Tree `6326d309a8ee1f95e886eba87215ae9fb53e111b` (the same tree CoS merged against `544087f4`; V2 §10, QA2:13). First parent `544087f4a25b7f8dc95953311810f8c67cb06bd1` (the step-03b rebuild record and QA reviews, plus the step-04a r1 QA review, all docs-only after `402699d5`), second parent `f5dcd732` |
| After the merge | main is `461596eb980f0dd9cc0caf2db8dcb358747b3695`, 2026-11-19 18:32 (UK time), tree `445a8f7e536f4acececa96e3217b9f1badb98fee`, which adds `docs/qa/step-04a-r2-review.md`, `docs/qa/rebuild-step-04a-review.md` and this record. The r2 QA review is on main. |
| Tests | 1051 + N=2 (stage-editor, placementDropped) = **1053 pass / 0 fail** (HB2:23-30, V2 §4, QA2:9) |
| Size | Accepted measure, `git diff --shortstat 402699d5..fc1f7b2a -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**'`, is 13 files, **385 insertions + 15 deletions = 400** ≤ 400 (guide L166 plus the `handback/**` exclusion accepted in r1 and r2; QA1:15, QA2:8, HB2:32). The same shortstat holds at the r2 tip `f5dcd732`. On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added four docs files after the base, 5325 insertions, which are not this step. The s4a smoke is 48 lines, under its own cap of 130 (guide L139, L166) |
| Stamp | `node tools/maker/build.ts <out>` writes `<out>/maker/index.html`, `<out>/maker/c2359142b9af/` and `<out>/play-stage/c2359142b9af/index.html` (HB2:40, QA2:11). r1's stamp was `fdb19d446efe`; it changed because `stage.ts` changed |
| Smoke | No `tools/play-stage/` change, so S0 is not required (guide L180). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` is unedited. The s4a smoke prints `SMOKE PASS` once, after checks 1–8 at 390 and at 360, under google-chrome on port 8799 (guide L143, L180; HB2:36-38; V2 §5; QA2:10) |

## (b) Files

From `git diff --name-status 402699d5..f5dcd732 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions. The same 14 product files are on the merge tree `6326d309`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/stage/paint.ts` | new | 35 (cap 40) | Pure: `paintCells(map, cells, typeId)` returns a new map doc (palette int added if missing, existing ints kept); `clearGround(map)` paints every cell Floor. No I/O, no DOM (guide L125) |
| `src/editor/stage/sheet.ts` | new | 21 (cap 30) | Pure: Add here rows from the slice's `terrain.tile_types`. The wired list is Floor, Water, Wall block. Path and Dirt are omitted (hidden, not greyed; guide L113, L126) |
| `src/editor/stage/undo.ts` | new | 6 (cap 15) | Pure session stack: `push`, `pop`, `canUndo` (guide L127) |
| `tools/maker/stage.ts` | new | 161 (cap 85) | The stage editor screen: top bar, 48×48 grid, Add here, painting chip, Undo, View, Start new warning, shared-map note, read-only, save through the store. Over the cap because the screen, the session and the save live in one file so `home.ts` stays the click router (HB2:58; guide L128, L141) |
| `tools/maker/project.ts` | edited | 5 (3+/2−, cap 15) | Stage rows on the opened-project screen, each 48 px, each opening the editor (guide L129) |
| `tools/maker/test-launch.ts` | edited | 1 (1+, cap 10) | `backScreen` also returns `"stage"`, so Back from play returns to the editor (guide L130; HB2:61) |
| `tools/maker/home.ts` | edited | 33 (24+/9−) | Extra, not in the guide table: the click router opens the stage, saves it, and passes the stage id into Test (HB2:60) |
| `tools/maker/app.css` | edited | 8 (7+/1−) | Extra: token-only rules for `.scrim` z-index, `.stage-row`, the 48×48 `.cell` grid, the chip and the dock (HB2:60) |
| `src/project/load/drops.ts` | new | 37 (cap 30) | Pure D17 reader: one `placementDropped` warning per spawn, neutral or fixed enemy on a closed cell or off the map. Over the cap because the three lists and the outside-map / closed-cell check did not fit 30 (guide L136; HB2:59) |
| `src/project/load/read-project.ts` | edited | 2 (2+, cap 5) | Import `placementDrops` and call it once next to `refs` and `warns`. No other change (guide L137) |
| `tests/editor/stage-editor.test.ts` | new | 58 (cap 60) | Paint, palette, clear, reload through the store, sheet rows (Path, Dirt and Lava absent), undo, failed Done (guide L133, L167-173) |
| `tests/project/load/placement-dropped.test.ts` | new | 28 (cap 35) | Named test `placementDropped: warns, skips in memory, writes nothing back` (guide L138, L174-177) |
| `tests/editor/maker-law.test.ts` | edited | 5 (2+/3−, cap 5) | Also scans `src/editor/stage/`. The plant dir is created under that folder (guide L135, L181) |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | new | 48 (own cap 130) | Browser smoke: New (Demo) → stage → checks 1–8 at 390 and 360, then `SMOKE PASS`. Outside the 400 (guide L139, L143-151) |

`tools/play-stage/looks.ts` and `tools/play-stage/project.ts` were not edited: Path and Dirt stay hidden (guide L113, L131), and R-E1 already shipped in step 3 (guide L102, L132), so there is no `tests/tools/play-stage-ground.test.ts` and S0 does not run. Hand-back files under `handback/step-04a-stage-paint/r1/` (HANDBACK.md and seven 390×844 shots) and `…/r2/` (HANDBACK.md only; the shots point at the r1 PNGs) are on the merge tree but are excluded from this list, as they are not product. There is no `test-output.txt`. The folders use the full step id (guide L14). The r1 folder stays on the branch next to r2; QA accepted that (QA2:15).

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `02efdd04`. To see it in git:

```
git log --oneline 402699d5..f5dcd732
git diff --stat 402699d5..f5dcd732 -- . ':!handback/**' ':!docs/**'
git diff --shortstat 402699d5..fc1f7b2a -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**'
git diff 479eed2b..fc1f7b2a -- . ':!handback/**'   # the r2 marks() merge only
git show 02efdd04:tools/maker/stage.ts
```

**The project screen lists stages as 48 px rows.** `tools/maker/project.ts:8` paints each stage as `<button type="button" class="choice stage-row" data-act="stage:…">`. `tools/maker/app.css:41` is `.stage-row { width: 100%; min-height: 48px; flex: none; }`. `stageRows` (`tools/maker/stage.ts:87-90`) reads `project.stages` and the stage name. `home.ts:30` passes those rows into `projectScreen`. `home.ts:76` handles `stage:`: it stores `state.stageId`, calls `bindStage`, and switches to the stage screen.

**The editor top bar, grid and shared-map note.** `stageScreen` (`tools/maker/stage.ts:92-113`) draws Back, the stage name, View, Start new and a primary Test (`:102`). Cells are 48×48 (`cellsHtml` at `:76-86` sets `grid-template-columns:repeat(${cols},48px)`; `app.css:42` sizes `.cell`). A shared map used by more than one stage gets the Rules 12 note at `:96-97`. Placements are marks only (`marks` at `:36-47`); 4a does not edit them.

**Path and Dirt are hidden, not greyed.** `src/editor/stage/sheet.ts:3-5` wires only `floor`, `water` and `wall-block`. `sheetRows` (`:17-20`) drops a wired id that is missing from the slice, and on an occupied tile drops closed types. There is no Path or Dirt row and no greyed "soon" row. The play stage still maps only water and wall-block besides floor (`tools/play-stage/looks.ts:46`), so `looks.ts` and a ground-frames test were left out (guide L113; HB2:57; QA1:21). An unknown palette key counts as Floor (`sheet.ts:13-14`, `drops.ts:13`, `stage.ts:48-50`; HB2:63).

**Paint writes only `logic.terrain` and, when needed, a new palette int.** `paintCells` (`src/editor/stage/paint.ts:16-28`) clones the map, adds the type under the smallest unused int if it is missing (`keyFor` at `:4-15`), and writes those cells. Existing palette ints stay. It does not touch `layers`, `background`, `edges`, `objects` or `history`. `clearGround` (`:29-35`) paints every cell `"floor"`. A painting run starts in `stageClick` at `stage.ts:152-158`: the first pick pushes one undo snapshot (`:156`) and paints the tapped tile; further `s:cell:` taps paint with the same type (`:143-148`). The chip and Done are `:110` and `:131-137`. Occupied closed tiles are refused and the sheet says "A unit stands here" (`:144-145`, `:105`).

**Start new, Undo and View.** Start new sits beside View (`:101-102`). The warning text at `:108` is the guide L118 sentence, with **Start new** (danger) and **Cancel**. Confirm (`s:fresh-go`, `:131-137`) calls `clearGround` and is one Undo step (`:134`). Undo (`:125-129`) pops newest first and saves; with an empty stack the button is disabled and says "Nothing to undo" (`:109`; guide L116). The stack is the in-session `sess.stack` (`:20-23`). View (`:107`, `:119-120`) toggles `sess.gridOn` only; `.grid.off .cell` drops the border (`app.css:43`) and `.cell.on` still outlines the selection. Grid lines are not written to the project.

**Test saves this stage and comes back to the editor.** `s:test` (`stage.ts:117`) returns `test: true`. `home.ts:56-64` `beginTest` saves through `stageCommit` first (`:59`), then `launchTest` with `from: "stage"` and the stage id (`:61`). `tools/maker/test-launch.ts:13` is `export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";`. `enterPlay` (`home.ts:44-49`) starts the match and uses `backScreen` so Back to maker restores the stage screen (`:47`). `play` passes the stage id into `openProject` (`test-launch.ts:22`). A failed save or a play error on the stage screen is shown in the banner (`home.ts:63`; HB2:65).

**Failed save and read-only.** `writeMap` (`stage.ts:55-63`) uses step 2's `planSave` / `commitWrites`. A failure keeps `dirty: true` and the typed message. The hide-save at `home.ts:97` commits the draft `writeMap` was given; `:61` clears `sess.draft` only when `sess.draft === map`, so a newer draft painted while that save was in flight is not dropped (HB2:65). A read-only project hides Start new, the sheet and Undo (`:101`, `:106`, `:109`) and still shows why in the banner.

**D17 `placementDropped`.** `src/project/load/drops.ts:5` is the warning row `{ code: "placementDropped", severity: "warning", path, detail }` with `detail` `"closedCell"` or `"outsideMap"`. `placementDrops` (`:21-36`) walks `playerSpawns`, `neutrals` and fixed `enemyPool/entries`, and builds paths `<stage file>#/playerSpawns/<i>`, `#/neutrals/<i>` or `#/enemyPool/entries/<i>` (`:25-33`). It reads only. `read-project.ts:2` imports it; `:108` is `rows.push(...placementDrops(stages, stageAt, maps, slice))`, next to `refs` at `:106` and `warns` at `:107`. No other reader change.

**The r2 size-gate fix.** At r1, `marks()` in `tools/maker/stage.ts` was two statements (`479eed2b` L40-41: `const out: Mark[] = [];` then `const team = chosen(files, stage);`). r2 merged them into one statement at merge L40: `const out: Mark[] = [], team = chosen(files, stage);`. `out` is still a fresh array. `team` is still `chosen()`. That cut one counted insertion versus the base (the new file is 161 lines instead of 162), so 386 + 15 = 401 became 385 + 15 = 400. `git diff 479eed2b..fc1f7b2a -- . ':!handback/**'` is only that change (QA2:7, V2 §2).

**Tests.** `tests/editor/stage-editor.test.ts:22-57` covers paint (only those `logic.terrain` cells, palette ints kept, other fields including `history` byte-equal, `:25-29`), a missing type under the smallest unused int (`:30-32`), `clearGround` (`:33-35`), save/reload through the store + `readProject` + `playDocsOf` (`:36-43`), sheet rows Floor / Water / Wall block with Path, Dirt and Lava absent, occupied hiding closed types (`:44-49`), undo newest first and an empty stack (`:50`), a failed Done that leaves files unchanged and shows `writeFailed` (`:51-56`), and `bindStage` on another project id dropping the undo stack (`:57`). `tests/project/load/placement-dropped.test.ts:11-27` is the named test: exactly two warnings (`…#/enemyPool/entries/0` / `closedCell`, `…#/playerSpawns/1` / `outsideMap`), `ok` stays true, no hard row, `createWorld(docsToInput(openProject(…)))` has no unit at either cell, notices include `placeClosed` and `spawnOffMap`, and the files object equals a pre-load `structuredClone` (guide L174-177). `maker-law.test.ts:25` also scans `src/editor/stage`; `:32-34` plants colour, kind and empty-catch files there.

**The s4a smoke** (`handoff/steps/tests/s4a-stage-paint/smoke.mjs`) follows the step 3 pattern on port 8799. Check 2 asserts the sheet rows are `Floor|Water|Wall block` and that no visible button is under 48×48 (`:26`). Check 6 starts Test and reads `__play.world.grid.tileTypeAt` plus the knight at 0,8, then Back to maker (`:30-37`). Both widths run, then one `SMOKE PASS` (`:46-47`).

## (d) What went wrong, in order, and the fix

1. **r1 shipped the editor, and the product checks passed.** Path and Dirt were left hidden, as the guide allows when they would not fit with the ground-frame work (guide L113). Green was 1053/0. The s4a smoke passed at 390 and 360. There was no play-stage diff. A helper review during r1 found three bugs, all fixed before the r1 hand-back (HB1:53): Undo leaked across projects that share a stage id (`bindStage` at `stage.ts:23` now resets the session when the stage id or the project id changes; the stage-editor test pins this at `:57`); Test on the stage screen dropped any error that was not a save sentence (`home.ts:63` now shows the play lines in the banner when `state.screen === "stage"`); a hide-save cleared a newer draft (`writeMap` at `stage.ts:61` clears `sess.draft` only when it is still the map that save started with). Those were not QA must-fixes.

2. **The line gate was 401, one over 400.** Guide L166's command at the r1 code head is `13 files changed, 386 insertions(+), 15 deletions(-)`. G7 (checklist L26; BUILD_GUIDE L123) counts **insertions plus deletions**, which is 386 + 15 = **401**. Precedent: step 3 counted 266 + 33 = 299, and step 2 counted 377 + 0. The guide calls 400 a hard gate (L141) and L166 says "400 or fewer". HANDBACK r1 L32 showed only the raw shortstat, and L54 said "line gate 386", so both the builder and the first CoS pass read insertions only. G7 accepts 400–500 only with a written reason in Decisions, and r1 had none (QA1:8). `stage.ts` (162 lines vs cap 85) and `drops.ts` (37 vs 30) were already explained; guide L141 allows a per-file overrun only inside 400. The official L166 command does not exclude `handback/**`; at the r1 code head that did not matter, and excluding `handback/**` is the accepted HEAD measure, as in earlier steps (QA1:15).

3. **r2 cut one counted line, and stated the sum.** The fix is the `marks()` merge in (c): two `const`s became one statement, behaviour identical, no test trimmed (QA2:7). The accepted shortstat at `fc1f7b2a` and at `f5dcd732` is 13 files, 385+/15− = **400**. Because the r2 code head is parented on the r1 tip, the plain L166 command would also count the r1 handback folder (450+/15− at the code head, 515+/15− at the tip). Excluding `handback/**` stays the accepted measure (QA2:8). HANDBACK r2 L32 (the same slot as r1 L32) writes the command with `':!handback/**'` and "385 insertions + 15 deletions = 400". L54 writes "line gate 385 insertions + 15 deletions = 400" (QA2:12, V2 §7). QA accepted r2 as OK TO OPEN PR. Merge-tree of `544087f4` and `f5dcd732` was clean at tree `6326d309`. Green is 1053/0. PR #83 merged as `02efdd04`.

## (e) Do it right first time

- Base on `402699d5` (or the go-line sha). Floor 1051, land at 1053 (N=2: the stage-editor test and the named `placementDropped` test). This is the 4a slice only: the stage editor and terrain painting. Do not start 4b placements.
- Leave Path and Dirt out (hidden, not greyed) unless the ground-frame table in `looks.ts` and `tests/tools/play-stage-ground.test.ts` also fit inside 400. If they stay out, say so in the hand-back. Do not change `tools/play-stage/` if you leave them out, and do not run a required S0 (still pin sha256 `d528795e…`). R-E1 already shipped in step 3; do not redo it.
- Count G7 as insertions plus deletions. The accepted command is `git diff --shortstat <base>..<code head> -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**'` and must be 400 or fewer. Write the sum in HANDBACK at the Green shortstat line and in the self-review line (the r1 L32 and L54 slots): "N insertions + M deletions = T ≤ 400". Caps in the file table are guidance; a file may go over if the total stays within 400 and Decisions says which file and why. Extra counted files (`home.ts`, `app.css`) must be named too.
- If a later rework is parented on an earlier hand-back tip, keep `':!handback/**'` in the measure, or the previous hand-back will land inside base..code-head.
- Ship `placementDrops` as a warning-only reader, one call from `read-project.ts`, and the named test. Do not write documents back. Do not write `layers`, `background`, `edges`, `objects` or new `history` ops.
- Every button is wired (Close, Cancel, Dismiss, Done, Undo, View, Start new, Test, Back). Undo disabled is "Nothing to undo", not a dead control. No Lava. No greyed Path or Dirt.
- Commit no raw `test-output.txt`. Put the `ℹ tests/pass/fail/…` summary in HANDBACK.md § Green. The last commit adds only the hand-back, at `handback/step-04a-stage-paint/r<N>/`.
- Run the s4a smoke at 390 and 360 on port 8799; it must print `SMOKE PASS` after checks 1–8 at both widths. `node tools/maker/build.ts` must still build. New (Demo) → stage → paint → Test must play the edited stage, and Back must return to the editor. Leave the parity golden alone (`90dde42a…`).
- Push: author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The token environment variable must hold the real token, not placeholder text. Never print or commit it.

## (f) Rebuild check

Run on the merge `02efdd04` (tree `6326d309`). `main` at this write is that merge; no later commit has been added. Re-run on 2026-11-19 at the merge tree: `npm run green` exit 0 with 1053 pass / 0 fail; the accepted shortstat at the code head is 13 files, 385 insertions and 15 deletions; the golden sha is `90dde42a…`; S0 sha256 is `d528795e…` and unedited; the s4a smoke printed 16 ok (checks 1–8 at 390 and at 360) and `SMOKE PASS`; the maker stamp is `c2359142b9af` (V2, QA2, HB2).

```
git worktree add --detach /tmp/s04a 02efdd04 && cd /tmp/s04a
npm ci && npm run green           # exit 0; tests 1053, fail 0
# Product gate. On the merge also exclude docs/**, because main added the
# step-03b record and QA reviews after 402699d5; those are not this step.
# The branch itself did not touch docs, so the same command without
# ':!docs/**' at the code head is the QA measure and is also 385 + 15 = 400.
git diff --shortstat 402699d5..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**' ':!docs/**'
#   13 files changed, 385 insertions(+), 15 deletions(-)
git diff --shortstat 402699d5..fc1f7b2a -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4a-stage-paint/**' ':!handback/**'
#   13 files changed, 385 insertions(+), 15 deletions(-)
sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --exit-code 402699d5 HEAD -- tests/tools/golden/ tools/play-stage handoff/steps/tests/s0-play-input
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
node --test --test-reporter=tap "tests/**/*.test.ts" | rg "parity: seed 24301"
#   ok 1030 - (a) parity: seed 24301 bot versus bot equals the 1a golden
node tools/maker/build.ts /tmp/s04a-out
ls /tmp/s04a-out/maker/ /tmp/s04a-out/play-stage/   # index.html + c2359142b9af/ in maker; c2359142b9af/ in play-stage
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff 02efdd04 HEAD -- src/editor/stage src/project/load/drops.ts src/project/load/read-project.ts tools/maker tests/editor/stage-editor.test.ts tests/editor/maker-law.test.ts tests/project/load/placement-dropped.test.ts handoff/steps/tests/s4a-stage-paint` must be empty. The blob table below lists the exact git blob id each file must have at `02efdd04`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA1:27-31. QA2:15 says they are unchanged. None of these blocked the PR.

1. `tools/maker/stage.ts:29-35` `chosen()` repeats play-stage's roster-to-spawn pick (`tools/play-stage/project.ts:47,55`) to show spawn initials. It is a drift risk, so share one function later (QA1:28).
2. `tests/editor/maker-law.test.ts:32-34` makes its plant dir inside `src/editor/stage/` with no `try/finally`. A failing assert would leave `law-*` in `src` (QA1:29).
3. The session undo stack keeps one full map snapshot per run with no cap (D12 is session-only). Cap it when 4b adds placements (QA1:30).
4. `stage.ts` is 161 lines at the merge (162 in r1), so guide L223's 4b split (`stage-sheets.ts` past about 150 lines) will trigger (QA1:31).
5. The r1 handback folder stays on the branch next to r2. It is not product and is outside the gate (QA2:15).

Step 2 and step 3 carries that were already open (Effect Designer code in the maker bundle, the OPFS DOM test, the bundled demo still imported for `openBundled`) are unchanged by this step. There is still no play-stage diff.

## Blob check

Each file must have exactly this git blob id at `02efdd04`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/stage/paint.ts` | `6c1516f1a913120f88395fb89c021130611106a4` | 35 |
| `src/editor/stage/sheet.ts` | `088a55d51201ad41041bb066e679b536133aa864` | 21 |
| `src/editor/stage/undo.ts` | `7d23399ebf42085f44076217ff79385420665906` | 6 |
| `tools/maker/stage.ts` | `90900caf359551ff124a5075fbb60b0f404afd99` | 161 |
| `tools/maker/project.ts` | `e6e5033dcc34f6977aabb5f3588e7927e63503b0` | 10 |
| `tools/maker/test-launch.ts` | `18e5be964ce63cba0a837264bad9d4c14889090c` | 41 |
| `tools/maker/home.ts` | `28a457846c64a08dbe3f17e7e719226cf83b52e0` | 98 |
| `tools/maker/app.css` | `6906b533e04f891fb72711b40f9d00dd39aa333b` | 46 |
| `src/project/load/drops.ts` | `d4d757198e27996dec452da7c13df60bd7015871` | 37 |
| `src/project/load/read-project.ts` | `f80276ce606a7a5730760839acf25881d149c495` | 112 |
| `tests/editor/stage-editor.test.ts` | `d7d924024383ec9438748f28abeb7f3ea33383fd` | 58 |
| `tests/project/load/placement-dropped.test.ts` | `fa92065a1fc5af5f8f2a30c32c546510c409d1d5` | 28 |
| `tests/editor/maker-law.test.ts` | `0c6f119178c8a8486040685972a306e236cde811` | 35 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | `78d1e03b7f7e0b10b0d64757528cecd00580946f` | 48 |

## Appendix: full code as merged (step 4a, PR #83)
New files are given in full. Edited files are given as the exact diff from `402699d5` to `02efdd04`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `src/editor/stage/paint.ts` (new)
`````ts
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
function keyFor(palette: Obj, typeId: string): { readonly key: string; readonly added: boolean } {
  let best: number | null = null;
  for (const [k, v] of Object.entries(palette)) {
    const n = Number(k);
    if (v === typeId && Number.isInteger(n) && n >= 0 && String(n) === k && (best === null || n < best)) best = n;
  }
  if (best !== null) return { key: String(best), added: false };
  const used = new Set<number>();
  for (const k of Object.keys(palette)) { const n = Number(k); if (Number.isInteger(n) && n >= 0 && String(n) === k) used.add(n); }
  let n = 0; while (used.has(n)) n += 1;
  return { key: String(n), added: true };
}
export function paintCells(map: Obj, cells: readonly Cell[], typeId: string): Obj {
  const next = structuredClone(map) as Obj;
  const cols = typeof next["cols"] === "number" && Number.isInteger(next["cols"]) ? next["cols"] : 0;
  const logic = isObj(next["logic"]) ? next["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? [...logic["terrain"]] : [];
  const palette: Obj = isObj(logic["palette"]) ? { ...logic["palette"] } : {};
  const got = keyFor(palette, typeId);
  if (got.added) palette[got.key] = typeId;
  const int = Number(got.key);
  for (const cell of cells) { const i = cell.r * cols + cell.c; if (Number.isInteger(i) && i >= 0 && i < terrain.length) terrain[i] = int; }
  next["logic"] = { ...logic, terrain, palette };
  return next;
}
export function clearGround(map: Obj): Obj {
  const cols = typeof map["cols"] === "number" && Number.isInteger(map["cols"]) && map["cols"] > 0 ? map["cols"] : 1;
  const logic = isObj(map["logic"]) ? map["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [];
  const cells = terrain.map((_, i) => ({ c: i % cols, r: Math.floor(i / cols) }));
  return paintCells(map, cells, "floor");
}
`````

### `src/editor/stage/sheet.ts` (new)
`````ts
type Obj = Record<string, unknown>;
export type SheetRow = { readonly group: "Ground" | "Terrain"; readonly id: string; readonly label: string };
const WIRED: readonly { readonly id: string; readonly group: "Ground" | "Terrain" }[] = [
  { id: "floor", group: "Ground" }, { id: "water", group: "Terrain" }, { id: "wall-block", group: "Terrain" },
];
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
function typesOf(slice: Obj): Map<string, { readonly label: string; readonly open: boolean }> {
  const out = new Map<string, { readonly label: string; readonly open: boolean }>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") out.set(item["id"], { label: typeof item["label"] === "string" ? item["label"] : item["id"], open: item["open"] !== false });
  return out;
}
/** A type missing from the slice is not closed (unknown counts as Floor). */
export function closedType(slice: Obj, id: string): boolean { return typesOf(slice).get(id)?.open === false; }
export function typeLabel(slice: Obj, id: string): string { return typesOf(slice).get(id)?.label ?? id; }
/** Wired rows present in the slice. Occupied tiles hide closed types. */
export function sheetRows(slice: Obj, occupied: boolean): readonly SheetRow[] {
  const types = typesOf(slice), out: SheetRow[] = [];
  for (const row of WIRED) { const hit = types.get(row.id); if (hit === undefined || (occupied && !hit.open)) continue; out.push({ group: row.group, id: row.id, label: hit.label }); }
  return out;
}
`````

### `src/editor/stage/undo.ts` (new)
`````ts
export const canUndo = (stack: readonly unknown[]): boolean => stack.length > 0;
export function push<T>(stack: readonly T[], snap: T): T[] { return [...stack, snap]; }
export function pop<T>(stack: readonly T[]): { readonly snap: T; readonly rest: T[] } | null {
  const snap = stack[stack.length - 1];
  return snap === undefined ? null : { snap, rest: stack.slice(0, -1) };
}
`````

### `tools/maker/stage.ts` (new)
`````ts
import { prefix, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { clearGround, paintCells } from "../../src/editor/stage/paint.ts";
import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import type { ProjectFiles } from "../../src/project/load/types.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string };
export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
export type StageOut = Host & { readonly leave: boolean; readonly test: boolean };
export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string };
export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type Sess = { id: string; project: string; draft: Obj | null; path: string | null; painting: string | null; label: string; stack: Obj[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null };
const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null });
let sess: Sess = blank("", "");
export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${kind}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
  return null;
}
function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
  const ids = [...list(gear["required"]), ...list(gear["roster"])].filter((id): id is string => typeof id === "string"), out: string[] = [];
  for (const id of ids) if (!out.includes(id)) out.push(id);
  const cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : out.length, list(stage["playerSpawns"]).length);
  return out.slice(0, cap);
}
function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
  const names = new Map<string, string>();
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit");
  const face = (id: string | undefined): { letter: string; name: string } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name }; };
  const out: Mark[] = [], team = chosen(files, stage);
  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name }); });
  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Foe"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Foe" : "NPC"; };
  const put = (entry: unknown, foe: boolean): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name }); };
  list(stage["neutrals"]).forEach((entry) => put(entry, false));
  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry) => put(entry, true));
  return out;
}
function tileId(map: Obj, c: number, r: number): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * cols + c], id = typeof value === "number" ? palette[String(value)] : undefined;
  return typeof id === "string" ? id : "floor";
}
function live(files: DocText): Obj | null {
  if (sess.draft !== null) return sess.draft; if (sess.path === null) return null; const parsed = parseProject(files); if (!parsed.ok) return null; const doc = parsed.files[sess.path]; return isObj(doc) ? structuredClone(doc) as Obj : null;
}
async function writeMap(io: Io, files: DocText, rev: number, map: Obj): Promise<Saved> {
  if (sess.path === null) return { ok: false, error: "writeFailed", message: "Can't open this stage", files, rev, dirty: true };
  const next = { ...files, [sess.path]: JSON.stringify(map) }, plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  const same = sess.draft === map; if (same) { sess.draft = null; sess.painting = null; sess.label = ""; sess.note = null; }
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: !same };
}
export async function stageCommit(io: Io, files: DocText, rev: number): Promise<Saved> {
  return sess.draft === null ? { ok: true, files, rev, dirty: false } : writeMap(io, files, rev, sess.draft);
}
function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFiles; readonly stage: Obj; readonly map: Obj; readonly slice: Obj } | { readonly error: string } {
  const parsed = parseProject(files); if (!parsed.ok) return { error: parsed.message };
  const stage = docAt(parsed.files, "stages", stageId); if (stage === null) return { error: "Can't open this stage" };
  const ref = stage.doc["mapRef"]; if (typeof ref !== "string") return { error: "Can't open this stage" };
  const map = docAt(parsed.files, "maps", ref); if (map === null) return { error: "Can't open this map" };
  const slice = parsed.files["catalogue/slice.json"]; if (!isObj(slice)) return { error: "Can't open: catalogue/slice.json" };
  sess.path = map.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
}
function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, rows = typeof map["rows"] === "number" ? map["rows"] : 0;
  let html = `<div class="grid${sess.gridOn ? "" : " off"}" style="grid-template-columns:repeat(${cols},48px)">`;
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
    const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
    const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}</button>`;
  }
  return `${html}</div>`;
}
export function stageRows(files: DocText): { readonly id: string; readonly name: string }[] {
  const parsed = parseProject(files); if (!parsed.ok) return [];
  const root = parsed.files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {};
  return list(project["stages"]).flatMap((id) => { if (typeof id !== "string") return []; const stage = docAt(parsed.files, "stages", id); return stage === null ? [] : [{ id, name: typeof stage.doc["name"] === "string" ? stage.doc["name"] : id }]; });
}
export function stageScreen(stageId: string, host: Host): string {
  const got = bundle(host.files, stageId);
  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
  const name = typeof got.stage["name"] === "string" ? got.stage["name"] : "Stage", placed = marks(got.parsed, got.stage);
  let users = 0; for (const [path, doc] of Object.entries(got.parsed)) if (path.startsWith("stages/") && isObj(doc) && doc["mapRef"] === got.stage["mapRef"]) users += 1;
  const note = users > 1 ? `<p class="sub">This map is used by ${users} stages. Painting changes all of them.</p>` : "";
  const code = host.banner !== null && host.banner.startsWith("Couldn't save") ? "writeFailed" : host.banner !== null && host.banner.startsWith("This project changed") ? "staleRev" : "";
  const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
  const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
  const rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)));
  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
  const stood = sess.sheet !== null && placed.some((item) => same(item, sess.sheet as Cell)) ? `<p>A unit stands here</p>` : "";
  const sheet = host.readOnly || sess.sheet === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Add here</h2><p class="sub">Tile ${sess.sheet.c},${sess.sheet.r}</p>${stood}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Start this stage's ground fresh? Every tile goes back to Floor. Units and NPCs stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
  const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
  const chip = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>${sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`}`;
  const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
  return `${bar}<div class="body stage">${banner}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${view}${confirm}`;
}
function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
  if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
  if (act === "s:test") return { ...host, leave: false, test: true };
  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; return kept(host); }
  if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
  if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
  if (host.readOnly) return kept(host);
  const got = bundle(host.files, stageId); if ("error" in got) return { ...host, banner: got.error, leave: false, test: false };
  const placed = marks(got.parsed, got.stage);
  if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
  if (act === "s:undo") {
    const item = pop(sess.stack); if (item === null) return kept(host);
    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = item.snap; const saved = await writeMap(io, host.files, host.rev, item.snap);
    if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
    return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
  }
  if (act === "s:fresh-go" || act === "s:done") {
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    const next = act === "s:fresh-go" ? clearGround(map) : map;
    if (act === "s:fresh-go") sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = next;
    const saved = await writeMap(io, host.files, host.rev, next);
    return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
  }
  if (act.startsWith("s:cell:")) {
    const [cs, rs] = act.slice(7).split(","), c = Number(cs), r = Number(rs);
    if (!Number.isInteger(c) || !Number.isInteger(r)) return kept(host);
    const cell = { c, r };
    if (sess.painting !== null) {
      const busy = placed.some((item) => same(item, cell));
      if (busy && closedType(got.slice, sess.painting)) { sess.note = "A unit stands here"; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
      sess.draft = paintCells(map, [cell], sess.painting); sess.note = null; sess.sel = cell; sess.sheet = null;
      return { ...host, dirty: true, leave: false, test: false };
    }
    sess.sheet = cell; sess.sel = cell; sess.view = false; sess.confirm = false; return kept(host);
  }
  if (act.startsWith("s:type:")) {
    const id = act.slice(7), rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => sess.sheet !== null && same(item, sess.sheet))), row = rows.find((item) => item.id === id);
    if (row === undefined || sess.sheet === null) return kept(host);
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    if (sess.painting === null) sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = row.id; sess.label = row.label; sess.draft = paintCells(map, [sess.sheet], row.id); sess.note = null; sess.sel = sess.sheet; sess.sheet = null;
    return { ...host, dirty: true, leave: false, test: false };
  }
  return kept(host);
}
`````

### `src/project/load/drops.ts` (new)
`````ts
import type { Doc, ReportRow } from "./types.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const warn = (path: string, detail: "closedCell" | "outsideMap"): ReportRow => ({ code: "placementDropped", severity: "warning", path, detail });
function closedIds(slice: Obj): ReadonlySet<string> {
  const out = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string" && item["open"] === false) out.add(item["id"]);
  return out;
}
function why(map: Obj | undefined, c: number, r: number, closed: ReadonlySet<string>): "closedCell" | "outsideMap" | null {
  if (map === undefined || typeof map["cols"] !== "number" || typeof map["rows"] !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= map["cols"] || r >= map["rows"]) return "outsideMap";
  const logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * map["cols"] + c], id = typeof value === "number" ? palette[String(value)] : "floor";
  return typeof id === "string" && closed.has(id) ? "closedCell" : null;
}
function atOf(entry: Obj, direct: boolean): { readonly c: number; readonly r: number } | null {
  const box = direct ? entry : entry["at"];
  return isObj(box) && typeof box["c"] === "number" && typeof box["r"] === "number" ? { c: box["c"], r: box["r"] } : null;
}
/** One warning per placement on a closed cell or off its map. Reads only. */
export function placementDrops(stages: Readonly<Record<string, Doc>>, stageAt: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, slice: Doc): ReportRow[] {
  const closed = closedIds(isObj(slice) ? slice : {}), rows: ReportRow[] = [];
  for (const [id, stage] of Object.entries(stages)) {
    const file = stageAt[id] ?? `stages/${id}.json`, map = typeof stage["mapRef"] === "string" ? maps[stage["mapRef"]] : undefined;
    const lists: readonly [string, boolean, readonly unknown[]][] = [
      ["playerSpawns", true, list(stage["playerSpawns"])],
      ["neutrals", false, list(stage["neutrals"])],
      ["enemyPool/entries", false, isObj(stage["enemyPool"]) && stage["enemyPool"]["mode"] === "fixed" ? list(stage["enemyPool"]["entries"]) : []],
    ];
    for (const [name, direct, entries] of lists) for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i]; if (!isObj(entry)) continue;
      const at = atOf(entry, direct), drop = at === null ? "outsideMap" : why(map, at.c, at.r, closed);
      if (drop !== null) rows.push(warn(`${file}#/${name}/${i}`, drop));
    }
  }
  return rows;
}
`````

### `tests/editor/stage-editor.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { clearGround, paintCells } from "../../src/editor/stage/paint.ts";
import { sheetRows } from "../../src/editor/stage/sheet.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import { readProject } from "../../src/project/load/index.ts";
import { memoryStore, commitWrites, readTree } from "../../tools/maker/store.ts";
import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stage_01JDAS00000000000000000001";
const NOW = "2026-11-19T00:00:00.000Z";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const logic = (map: Obj): Obj => (isObj(map["logic"]) ? map["logic"] : {});
const readDir = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } }; walk(join(root, rel), ""); return out; };
test("stage editor paints, clears, lists rows, undoes and keeps a failed save", async () => {
  const text = readDir("fixtures/demo.tileproj"), parsed = parseProject(text); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const map = structuredClone(parsed.files[MAP]) as Obj; map["history"] = { cap: 200, baseSeq: 0, ops: [{ seq: 1 }] };
  const before = structuredClone(map), water = paintCells(map, [{ c: 0, r: 0 }, { c: 4, r: 1 }], "water");
  assert.deepEqual(map, before); assert.equal(logic(water)["terrain"] instanceof Array && (logic(water)["terrain"] as number[])[0], 1);
  assert.equal((logic(water)["terrain"] as number[])[1 * 6 + 4], 1); assert.deepEqual(logic(water)["palette"], logic(before)["palette"]);
  const rest = (doc: Obj): Obj => { const copy = structuredClone(doc) as Obj, box = logic(copy); delete box["terrain"]; return copy; };
  assert.deepEqual(rest(water), rest(before));
  const added = paintCells(before, [{ c: 0, r: 0 }], "path"); assert.equal((logic(added)["palette"] as Obj)["3"], "path"); assert.equal((logic(added)["terrain"] as number[])[0], 3);
  const hole = structuredClone(before) as Obj; delete (logic(hole)["palette"] as Obj)["1"];
  const reused = paintCells(hole, [{ c: 0, r: 0 }], "water"); assert.equal((logic(reused)["palette"] as Obj)["1"], "water"); assert.equal((logic(reused)["palette"] as Obj)["0"], "floor");
  const bare = structuredClone(before) as Obj; logic(bare)["palette"] = { "2": "wall-block" }; logic(bare)["terrain"] = Array(54).fill(2);
  const cleared = clearGround(bare); assert.equal((logic(cleared)["palette"] as Obj)["0"], "floor"); assert.equal((logic(cleared)["palette"] as Obj)["2"], "wall-block");
  assert.equal((logic(cleared)["terrain"] as number[]).every((n) => n === 0), true);
  const painted = paintCells(structuredClone(parsed.files[MAP]) as Obj, [{ c: 0, r: 0 }], "water");
  const next = { ...text, [MAP]: JSON.stringify(painted) }, plan = planSave(text, next, storedRev(parsed.files), NOW); assert.equal(plan.ok, true); if (!plan.ok) return;
  const id = "project_01JDAP00000000000000000001", store = memoryStore();
  for (const [path, body] of Object.entries(text)) await store.write(`${prefix(id)}${path}`, body);
  assert.equal((await commitWrites(store, prefix(id), plan.writes)).ok, true);
  const back = parseProject(await readTree(store, prefix(id))); assert.equal(back.ok, true); if (!back.ok) return;
  const load = readProject(back.files); assert.equal(load.ok && load.report.length === 0 && load.project !== null, true); if (load.project === null) return;
  const played = playDocsOf(load.project), playedMap = played.map as Obj; assert.deepEqual(logic(playedMap)["terrain"], logic(painted)["terrain"]);
  const slice = parsed.files["catalogue/slice.json"] as Obj, rows = sheetRows(slice, false);
  assert.deepEqual(rows.map((row) => row.label), ["Floor", "Water", "Wall block"]); assert.deepEqual(rows.map((row) => row.id), ["floor", "water", "wall-block"]);
  assert.equal(rows.some((row) => row.id === "path" || row.id === "dirt" || row.id === "lava" || row.label === "Lava"), false);
  assert.deepEqual(sheetRows(slice, true).map((row) => row.id), ["floor"]);
  const slim = { behaviours: [{ id: "terrain", knobs: [{ id: "tile_types", default: [{ id: "floor", label: "Floor", open: true }, { id: "water", label: "Water", open: false }] }] }] };
  assert.deepEqual(sheetRows(slim, false).map((row) => row.id), ["floor", "water"]);
  const stack = push(push([], "older"), "newer"); const first = pop(stack); assert.equal(first?.snap, "newer"); assert.equal(pop(first?.rest ?? [])?.snap, "older"); assert.equal(canUndo([]), false); assert.equal(pop([]), null);
  bindStage(STAGE, id); const io = { store: memoryStore(), id, now: NOW }; for (const [path, body] of Object.entries(text)) await io.store.write(`${prefix(id)}${path}`, body);
  const host: Host = { files: text, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false };
  const open = await stageClick("s:cell:0,0", STAGE, host, io), pick = await stageClick("s:type:water", STAGE, open, io);
  io.store.failOn(`${prefix(id)}${MAP}.tmp`); const failed = await stageClick("s:done", STAGE, pick, io);
  assert.equal(failed.dirty, true); assert.match(failed.banner ?? "", /Couldn't save/); assert.equal(io.store.files.get(`${prefix(id)}${MAP}`), text[MAP]); assert.equal(io.store.files.get(`${prefix(id)}project.json`), text["project.json"]);
  const html = stageScreen(STAGE, failed); assert.match(html, /data-error="writeFailed"/); assert.match(html, /data-tile="water"/); assert.match(html, /class="dot"/); assert.match(html, />Undo</);
  bindStage(STAGE, "other"); assert.match(stageScreen(STAGE, host), /Nothing to undo/);
});
`````

### `tests/project/load/placement-dropped.test.ts` (new)
`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";
import { createWorld } from "../../../src/sim/world.ts";
import { docsToInput } from "../../../tools/play-stage/load.ts";
import { openProject } from "../../../tools/play-stage/project.ts";
import { loadFixture } from "../../tools/demo-fixture.ts";
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stages/stage_01JDAS00000000000000000001.json";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
test("placementDropped: warns, skips in memory, writes nothing back", () => {
  const files = loadFixture(), map = files[MAP], stage = files[STAGE];
  if (!isObj(map) || !isObj(map["logic"]) || !Array.isArray(map["logic"]["terrain"]) || !isObj(stage) || !Array.isArray(stage["playerSpawns"]) || !isObj(stage["enemyPool"]) || !Array.isArray(stage["enemyPool"]["entries"])) throw new Error("demo shape");
  const terrain = [...map["logic"]["terrain"]]; terrain[2] = 1; map["logic"]["terrain"] = terrain;
  const spawn = stage["playerSpawns"][1]; if (!isObj(spawn)) throw new Error("spawn"); spawn["c"] = 99;
  const before = structuredClone(files), got = readProject(files);
  assert.equal(got.ok, true); assert.equal(got.report.some((row) => row.severity === "hard"), false);
  assert.deepEqual(got.report.map((row) => [row.code, row.severity, row.path, row.detail]), [
    ["placementDropped", "warning", `${STAGE}#/enemyPool/entries/0`, "closedCell"],
    ["placementDropped", "warning", `${STAGE}#/playerSpawns/1`, "outsideMap"],
  ]);
  const opened = openProject(files); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const world = createWorld(docsToInput(opened.docs).input), at = world.units.all().map((unit) => `${unit.at.c},${unit.at.r}`).sort();
  assert.deepEqual(at, ["0,8", "3,0", "3,4", "4,4", "5,4"]);
  assert.equal(world.notices.some((note) => note.code === "placeClosed"), true); assert.equal(world.notices.some((note) => note.code === "spawnOffMap"), true);
  assert.deepEqual(files, before); assert.equal(spawn["c"], 99);
  const entry = stage["enemyPool"]["entries"][0]; assert.equal(isObj(entry) && isObj(entry["at"]) && entry["at"]["c"], 2);
});
`````

### `handoff/steps/tests/s4a-stage-paint/smoke.mjs` (new)
`````js
// Step 4a stage paint smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8799"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(120); return box; };
const settle = async (page, fn) => page.waitForFunction(fn, null, { timeout: 8000 });
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
const tile = (page, c, r) => page.locator(`[data-act="s:cell:${c},${r}"]`).getAttribute("data-tile");
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
    await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
    await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent), note: document.body.innerText.includes("A unit stands here") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
    await step("5 undo", async () => { await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "floor"); const a = await tile(page, 0, 0), b = await tile(page, 1, 0); if (a !== "floor" || b !== "floor") throw new Error(`${a} ${b}`); });
    await step("6 test", async () => {
      await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); await tap(page, "s:test");
      await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner());
      const live = await page.evaluate(() => { const units = window.__play.world.units.all(); const knight = units.find((u) => String(u.unitId).endsWith("000001")); return { water: window.__play.world.grid.tileTypeAt({ c: 0, r: 0 }).id, knight: knight !== undefined && knight.at.c === 0 && knight.at.r === 8, stage: new URLSearchParams(location.search).get("stage") }; });
      if (live.water !== "water" || !live.knight || live.stage !== "stage_01JDAS00000000000000000001") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); const back = await page.evaluate(() => ({ name: document.querySelector("h1")?.textContent, cells: document.querySelectorAll(".cell").length })); if (!String(back.name).includes("Demo stage") || back.cells !== 54) throw new Error(JSON.stringify(back));
    });
    await step("7 start new", async () => {
      await tap(page, "s:fresh"); await tap(page, "s:close"); if (await tile(page, 0, 0) !== "water") throw new Error("cancel painted");
      await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await settle(page, () => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); const all = await page.evaluate(() => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); if (!all) throw new Error("not floor");
      await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "water"); if (await tile(page, 0, 0) !== "water") throw new Error("undo lost water");
    });
    await step("8 reload", async () => { await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await press(page, "Demo stage"); const a = await tile(page, 0, 0); if (a !== "water") throw new Error(String(a)); });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
`````

### `tools/maker/project.ts` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index 28c48de..e6e5033 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,9 +1,10 @@
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
+export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
   const reason = "Made with a newer TileEngine. Open only.";
   const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p><div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
+  const rows = (input.rows ?? []).map((row) => `<button type="button" class="choice stage-row" data-act="stage:${esc(row.id)}">${esc(row.name)}</button>`).join("");
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
 }
`````

As merged:

`````ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
  const rows = (input.rows ?? []).map((row) => `<button type="button" class="choice stage-row" data-act="stage:${esc(row.id)}">${esc(row.name)}</button>`).join("");
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
}
`````

### `tools/maker/test-launch.ts` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index 53dde83..18e5be9 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -10,6 +10,7 @@ export type PlayReady = PlayOut & { readonly looks: Looks };
 export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
 type Start = (docs: PlayReady) => void;
 export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly start: Start };
+export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
 const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
 const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
 const showUrl = (id: string, stage: string, from: string): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}`); };
`````

As merged:

`````ts
import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { testGate, playLine } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, type PlayOut } from "../play-stage/project.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly start: Start };
export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}`); };
function play(input: LaunchBag, text: DocText): Launch {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  try { input.start(opened.docs); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from); return { ok: true, files: text, rev };
}
/** Read a saved folder and start its stage. No demo fallback. */
export async function openSaved(input: LaunchBag): Promise<Launch> {
  const text = await readTree(input.store, prefix(input.id));
  if (Object.keys(text).length === 0) return fail([`Can't open: no project ${input.id}`], text, 0);
  return play(input, text);
}
/** Save first. A failed save does not start a match. */
export async function launchTest(input: LaunchBag & { readonly stored: DocText; readonly next: DocText; readonly rev: number; readonly now: string }): Promise<Launch> {
  const plan = planSave(input.stored, input.next, input.rev, input.now);
  if (!plan.ok) return fail([plan.message], input.stored, input.rev);
  const wrote = await commitWrites(input.store, prefix(input.id), plan.writes);
  if (!wrote.ok) return fail([wrote.message], input.stored, input.rev);
  const text = await readTree(input.store, prefix(input.id));
  return play(input, text);
}
`````

### `tools/maker/home.ts` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 785f5c8..28a4578 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -2,14 +2,15 @@ import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, r
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
+import { bindStage, stageClick, stageCommit, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
-import { launchTest, openSaved, type PlayReady } from "./test-launch.ts";
+import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
-const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
@@ -25,7 +26,8 @@ function paint(): void {
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
+  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, rows: stageRows(state.files), dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -42,16 +44,23 @@ async function restore(id: string): Promise<void> { if (store === null || id ===
 function enterPlay(docs: PlayReady, scroll: number): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
   try {
-    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; const from = new URLSearchParams(location.search).get("from"); state.screen = from === "home" || from === "trash" ? from : "project"; state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
+    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
     root.hidden = true;
   } catch (e) { canvas.remove(); throw e; }
 }
+async function saveStage(): Promise<boolean> {
+  if (store === null || state.current === null) return false;
+  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
+  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
+}
 async function beginTest(): Promise<void> {
   if (store === null || state.current === null) return;
+  const stageId = state.screen === "stage" ? state.stageId : null;
+  if (stageId !== null && !await saveStage()) { paint(); return; }
   const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
-  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: "project", now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
+  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
   state.files = got.files; state.rev = got.rev;
-  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); state.banner = save ? line : null; state.problems = save ? [] : got.lines; paint(); return; }
+  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
   state.dirty = false; state.problems = [];
 }
 async function fromUrl(): Promise<void> {
@@ -60,9 +69,15 @@ async function fromUrl(): Promise<void> {
   const stage = params.get("stage"), from = params.get("from") ?? "project";
   const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
-  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = "project"; state.readOnly = false; state.dirty = false; state.problems = [];
+  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
+  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = [];
 }
 async function run(act: string): Promise<void> {
+  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; paint(); return; }
+  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
+    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso() });
+    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
+  }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
@@ -79,5 +94,5 @@ async function boot(): Promise<void> {
 }
 document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
 document.addEventListener("input", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-name")) state.name = node.value; });
-document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && state.screen === "project") void saveCurrent(); });
+document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 void boot();
`````

As merged:

`````ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindStage, stageClick, stageCommit, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
function sheet(): string {
  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
  if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
  if (state.screen !== "name" && state.screen !== "rename") return "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
}
function paint(): void {
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, rows: stageRows(state.files), dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; paint(); }
async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
function enterPlay(docs: PlayReady, scroll: number): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = state.screen === "stage" ? state.stageId : null;
  if (stageId !== null && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project";
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = [];
}
async function run(act: string): Promise<void> {
  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; paint(); return; }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso() });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
  }
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = await got.text(); }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
document.addEventListener("input", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-name")) state.name = node.value; });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
void boot();
`````

### `tools/maker/app.css` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index fbe9025..6906b53 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -20,7 +20,7 @@
 .banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
 .toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
 .toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
-.scrim { position: fixed; inset: 0; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
+.scrim { position: fixed; inset: 0; z-index: 5; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
 .sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
 .sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
 input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
@@ -38,3 +38,9 @@ input.name-field { min-height: 48px; border: 2px solid var(--line); border-radiu
 @media (max-width: 420px) {
   .app { border-radius: 0; height: 100dvh; }
 }
+.topbar.wrap { flex-wrap: wrap; } .topbar.wrap h1 { flex: 1 1 auto; min-width: 8.5rem; max-width: 100%; } .stage-row { width: 100%; min-height: 48px; flex: none; } .grid { display: grid; width: max-content; }
+.cell { box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
+.grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
+.cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
+.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
+.chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
`````

As merged:

`````css
.app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
.app[hidden] { display: none; }
.topbar { min-height: var(--header-h); display: flex; align-items: center; gap: 8px; padding: 10px 16px 8px; background: var(--surface); border-bottom: 1px solid var(--line); }
.topbar h1 { flex: 1; margin: 0; font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.body { flex: 1; min-height: 0; overflow: auto; padding: 16px 16px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 12px; }
.card, .choice { display: flex; align-items: center; gap: 10px; min-height: 72px; padding: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); text-align: left; color: var(--ink); }
.card-hit { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; flex: 1; min-height: 48px; background: transparent; color: var(--ink); border: 0; box-shadow: none; padding: 0; text-align: left; }
.card.new, .choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }
.card .grow, .choice { flex: 1; }
.card .grow { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.name { font-weight: 700; font-size: 16px; }
.sub, .hint { margin: 0; color: var(--muted); font-size: 0.82rem; line-height: 1.4; }
.btn { min-height: 48px; min-width: 48px; border-radius: 14px; border: 2px solid transparent; padding: 0 14px; font-weight: 700; background: var(--accent); color: var(--accent-ink); }
.btn.ghost { background: var(--surface); border-color: var(--line); color: var(--ink); }
.btn.soon, .btn:disabled { background: var(--soon); color: var(--soon-ink); border-color: transparent; }
.btn.danger { background: var(--danger-soft); color: var(--danger); border-color: var(--danger-line); }
.btn.icon { width: 48px; padding: 0; background: var(--surface); border-color: var(--line); color: var(--ink); }
.badge { display: inline-flex; padding: 3px 9px; border-radius: 999px; border: 1.5px solid var(--warn-line); background: var(--warn-soft); color: var(--warn); font-size: 0.78rem; font-weight: 800; }
.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
.toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
.toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
.scrim { position: fixed; inset: 0; z-index: 5; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
.test-wrap { margin-top: auto; padding-top: 24px; }
.test-wrap .btn { width: 100%; min-height: 56px; }
.dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
.project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
.project .sheet p { margin: 0; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
@media (min-width: 421px) {
  body { min-height: 100dvh; display: grid; place-items: center; }
  .app { width: 390px; height: 844px; min-height: 0; border-radius: 28px; overflow: hidden; box-shadow: var(--frame-shadow); }
  .toast { position: absolute; }
}
@media (max-width: 420px) {
  .app { border-radius: 0; height: 100dvh; }
}
.topbar.wrap { flex-wrap: wrap; } .topbar.wrap h1 { flex: 1 1 auto; min-width: 8.5rem; max-width: 100%; } .stage-row { width: 100%; min-height: 48px; flex: none; } .grid { display: grid; width: max-content; }
.cell { box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
.cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
.chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
`````

### `src/project/load/read-project.ts` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index d97f477..f80276c 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -1,4 +1,5 @@
 import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
+import { placementDrops } from "./drops.ts";
 import { migrateProject, versionRows } from "./migrate.ts";
 import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";
 
@@ -104,6 +105,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
   refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
   warns(slice, project["catalogueRev"], maps, setups, rows);
+  rows.push(...placementDrops(stages, stageAt, maps, slice));
   const hard = rows.some((r) => r.severity === "hard");
   const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
   return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
`````

As merged:

`````ts
import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
import { placementDrops } from "./drops.ts";
import { migrateProject, versionRows } from "./migrate.ts";
import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const LIMITS = { picks: 8, waveUnits: 16 } as const;
const row = (code: string, severity: Severity, path: string, detail?: string): ReportRow => (detail === undefined ? { code, severity, path } : { code, severity, path, detail });
const sort = (rows: readonly ReportRow[]): ReportRow[] => [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
const idOf = (doc: Obj): string | null => (typeof doc["id"] === "string" ? doc["id"] : null);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);

function note(res: ReadResult<unknown>, path: string, rows: ReportRow[]): void {
  if (res.ok) return;
  const stats = !res.needsMigration && res.error === "bad field stats";
  rows.push(row("invalidValue", "hard", stats ? `${path}#/stats` : path, res.needsMigration ? "needsMigration" : res.error));
}
function has(bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
  if (typeof id === "string" && !Object.hasOwn(bag, id)) rows.push(row("brokenRef", "hard", path, id));
}

function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const project = isObj(manifest["project"]) ? manifest["project"] : {};
  const gear = isObj(project["loadout"]) ? project["loadout"] : {};
  list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
  list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
  list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
  list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
  for (const [id, stage] of Object.entries(stages)) {
    const path = at[id] ?? `stages/${id}.json`;
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    has(maps, stage["mapRef"], `${path}#/mapRef`, rows);
    list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
    list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
  }
  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
}

function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
  if (typeof behaviourId !== "string") return null;
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
  return null;
}
function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
  const tiles = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
  if (slice["catalogue_rev"] !== undefined && slice["catalogue_rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", "catalogue/slice.json#/catalogue_rev"));
  for (const [id, setup] of Object.entries(setups)) {
    const path = `setups/${id}.json`, answers = isObj(setup["answers"]) ? setup["answers"] : {};
    if (isObj(setup["catalogue"]) && setup["catalogue"]["rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", `${path}#/catalogue/rev`));
    if (known.size > 0 && typeof setup["behaviourId"] === "string" && !known.has(setup["behaviourId"])) rows.push(row("unknownRef", "warning", `${path}#/behaviourId`, setup["behaviourId"]));
    const ns = isObj(answers["custom_ns"]) ? answers["custom_ns"]["value"] : undefined, ew = isObj(answers["custom_ew"]) ? answers["custom_ew"]["value"] : undefined, mode = isObj(answers["reach_mode"]) ? answers["reach_mode"]["value"] : undefined;
    if (setup["behaviourId"] === "basic-attack" && mode === "custom-cross" && typeof ns === "number" && typeof ew === "number" && ns !== ew) rows.push(row("layerNotApplied", "warning", `${path}#/answers/custom_ns`, "min(ns,ew)"));
    if (setup["behaviourId"] === "basic-attack" && isObj(answers["damage"]) && answers["damage"]["source"] !== "default" && answers["damage"]["source"] !== undefined) rows.push(row("layerNotApplied", "warning", `${path}#/answers/damage`, "unit_atk"));
    for (const key of Object.keys(answers)) {
      const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
      const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
      const value = ans["value"], type = knob["type"], where = `${path}#/answers/${key}/value`;
      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
      if (bad) rows.push(row("invalidValue", "hard", where));
      if (type === "text" && typeof value === "string" && typeof knob["max_len"] === "number" && [...value].length > knob["max_len"]) rows.push(row("outOfRange", "warning", where));
      if (type === "slider" && typeof value === "number" && ((typeof knob["min"] === "number" && value < knob["min"]) || (typeof knob["max"] === "number" && value > knob["max"]))) rows.push(row("outOfRange", "warning", where));
    }
  }
  for (const [id, map] of Object.entries(maps)) {
    const palette = isObj(map["logic"]) && isObj(map["logic"]["palette"]) ? map["logic"]["palette"] : {};
    for (const key of Object.keys(palette)) { const name = palette[key]; if (tiles.size > 0 && typeof name === "string" && !tiles.has(name)) rows.push(row("unknownRef", "warning", `maps/${id}.json#/logic/palette/${key}`, name)); }
  }
}

/** Pure project read. Never throws, never writes, never mutates `files`. */
export function readProject(files: ProjectFiles): ProjectLoad {
  if (!isObj(files) || !isObj(files["project.json"])) return { ok: false, readOnly: true, project: null, report: [row("notAProject", "hard", "project.json", "missing project.json")] };
  const gate = versionRows(files);
  if (gate.length > 0) return { ok: false, readOnly: true, project: null, report: sort(gate) };
  let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
  try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
  const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {};
  let slice: Doc = {}, manifest: Doc = {};
  for (const path of Object.keys(docs)) {
    const doc = docs[path], slot = knownKind(path);
    if (slot === null) { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
    if (!isObj(doc)) { rows.push(row("invalidValue", "hard", path, "not an object")); continue; }
    const id = idOf(doc);
    if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
    else if (slot === "catalogue-slice") slice = doc;
    else if (slot === "map") {
      if (id !== null) maps[id] = doc;
      const n = typeof doc["cols"] === "number" && typeof doc["rows"] === "number" ? doc["cols"] * doc["rows"] : -1;
      const terrain = isObj(doc["logic"]) && Array.isArray(doc["logic"]["terrain"]) ? doc["logic"]["terrain"] : null;
      const badLen = terrain !== null && terrain.length !== n;
      if (badLen && terrain !== null) rows.push(row("terrainLength", "hard", `${path}#/logic/terrain`, `found ${terrain.length}`));
      if (list(doc["layers"]).some((layer) => isObj(layer) && Array.isArray(layer["tiles"]) && layer["tiles"].length !== n)) rows.push(row("terrainLength", "hard", `${path}#/layers`));
      if (!badLen) note(readMap(doc), path, rows);
    } else if (slot === "stage") { if (id !== null) { stages[id] = doc; stageAt[id] = path; } note(readStage(doc, LIMITS), path, rows); }
    else if (slot === "unit") { if (id !== null) units[id] = doc; note(readUnit(doc), path, rows); }
    else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); }
  }
  if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
  const manifestDoc = docs["project.json"];
  const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
  warns(slice, project["catalogueRev"], maps, setups, rows);
  rows.push(...placementDrops(stages, stageAt, maps, slice));
  const hard = rows.some((r) => r.severity === "hard");
  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
  return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
}
`````

### `tests/editor/maker-law.test.ts` (edited)
Diff `402699d5..02efdd04`:

`````diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index b528912..0c6f119 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -1,6 +1,5 @@
 import assert from "node:assert/strict";
 import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
-import { tmpdir } from "node:os";
 import { join } from "node:path";
 import { test } from "node:test";
 import { fileURLToPath } from "node:url";
@@ -23,14 +22,14 @@ export function lawHits(dir: string): string[] {
 const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
 const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
 test("maker law holds, tokens match, and each plant fails", () => {
-  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []);
+  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []);
   const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
   for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
   for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
   assert.match(css, /button, input \{ font: inherit; \}/);
   const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
   assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
-  const dir = mkdtempSync(join(tmpdir(), "law-"));
+  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
   for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
   rmSync(dir, { recursive: true });
 });
`````

As merged:

`````ts
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../..", import.meta.url));
const files = (dir: string): string[] => statSync(dir).isDirectory() ? readdirSync(dir).flatMap((name) => files(join(dir, name))) : [dir];
export function lawHits(dir: string): string[] {
  const hits: string[] = [], colour = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|@import\b|@font-face\b|font-family\s*:/, empty = /catch(?:\s*\([^)]*\))?\s*\{(?:\s*\/\*[\s\S]*?\*\/|\s*\/\/[^\n]*)?\s*\}/;
  for (const path of files(dir)) {
    if (!/\.(ts|css|html)$/.test(path)) continue;
    const skip = path.endsWith("tokens.css"), ts = path.endsWith(".ts");
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      const at = `${path}:${i + 1}`;
      if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []);
  const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
  for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
  for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
  assert.match(css, /button, input \{ font: inherit; \}/);
  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
`````
