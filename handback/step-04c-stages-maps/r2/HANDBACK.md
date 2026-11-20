# Hand-back step-04c-stages-maps r2
Step file: docs/maker/steps/step-04-stage-editor.md (the 4c sections and the shared run rules). Rework of QA `docs/qa/step-04c-review.md` (main `a98f1b79`).
Base commit: a85ae665cbb4db53b958be6e29b2f68ec56c4d60     Code head: faa74a07bb59ab54cfcfab6a864410a85579ca93     Code head tree: d140607fda576551266a7dbd49e297fc7db8c1f7     Branch: step/step-04c-stages-maps-r2-chatA
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
From r1 tip `4c2f4cb81cc4cefd99c68f62ce5b9e03d497f870` (tree `0695ed7ff3644cf18a49f5f62ca0e098c86efeb2`). This file is the r2 tip commit. Its sha and tree are quoted in the hand-back message. No product file changed.

## Changed files
A	handoff/steps/tests/s4c-stages-maps/smoke.mjs
A	src/editor/stage/resize.ts
A	src/editor/stage/rooms.ts
M	src/project/load/drops.ts
M	src/project/load/read-project.ts
A	tests/editor/stage-rooms.test.ts
A	tests/project/load/map-entry-dropped.test.ts
M	tools/maker/home.ts
M	tools/maker/project.ts
A	tools/maker/rooms.ts

## Green
N = 2. Floor 1065. Product files are the r1 tree; this round changes only the smoke.
`npm test` this round: 1065/0/0/0. r1 `npm ci && npm run green` was exit 0 on that product (typecheck, lint, deps, check:state, check:law all exit 0).
```
# tests 1065
# pass 1065
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat a85ae665cbb4db53b958be6e29b2f68ec56c4d60..faa74a07bb59ab54cfcfab6a864410a85579ca93 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4c-stages-maps/**' ':!handback/**'`: 9 files changed, 382 insertions(+), 12 deletions(-). 382 insertions + 12 deletions = 394.
The smoke script is 73 lines.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome`. This sandbox has no `/usr/bin/google-chrome`.
Solo run, guide L35. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` printed:
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
That is one of three runs. Runs 1 and 2 were solo. Run 3 ran while 8 `node -e 'for(;;){}'` loops were burning CPU. All three printed `SMOKE PASS`, with checks 1–7 and `8 targets` ok at 390 and at 360.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed `SMOKE PASS`. Checks 1–8 were ok at 390 and at 360.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` printed `SMOKE PASS`. Checks 1–8 were ok at 390 and at 360.
Waits after a save use `waitForFunction` on the expected label or text. No fixed pause.
Screenshots at 390, in this folder: `01-project.png` (Stages and Maps), `02-add.png` (Add stage), `03-rename.png`, `04-resize.png` (drop list), `05-refuse.png` (Used by), `06-play.png` (Test on the new stage).

## Shipped tests (sha256)
The step file ships no frozen test hash for these files. They are new. Unchanged from r1.
```
431a83b1e5a3017191bab276cf446424fc899a52d5e2d4750c2d74689e922d62  tests/editor/stage-rooms.test.ts
ae29e2cd04665185f1f4baf5e679cb6ab6dbe8cf3930a7012da05aecef62de04  tests/project/load/map-entry-dropped.test.ts
```
Named test present: `mapEntryDropped: warns, skips in memory, writes nothing back`.

## Helpers & self-review
- No helper this round. The three must-fixes are in QA `docs/qa/step-04c-review.md`. Product code was not edited.
- Self-review: § Smoke pastes the solo run's ok lines and `SMOKE PASS` (guide L35), and still notes the three runs and the CPU-burn run, done. § Decisions names `resize.ts` and `read-project.ts` over their caps, done. Check 8 calls `big()` after Add (`r:add`), each `r:menu:*`, Rename (`r:rename`), the resize steppers (`r:resize`, which shows Apply) and the `will go` list, and prints `8 targets @<width>` at 390 and at 360, done. Smoke is 73 lines, done. No `waitForTimeout`. The r1 PR line is not on line 3, done.
- Self-review: Acceptance carried from r1 (add, rename, `refsTo`, last stage, delete, resize rows, shared map, lanes, palette, named D21 test, Test on the new stage), done. `tools/maker/stage.ts:31` pin unchanged, done. QA G1–G10 carried; G7 still 382 + 12 = 394. G6 extra file `tools/maker/home.ts` still named below. G9 this note.

## Decisions & deviations
- A new stage copies the first listed stage's numeric seed when one exists (the demo copies 24301) so Test can start. No `kind` or `formatVersion` literal. Other fills are the new id, the name, and `mapRef`. Names are "Stage N" and "Stage N map", N = listed stages + 1. An empty-only project still has no seed.
- `refsTo(id)` returns names of stages in `project.stages` whose `mapRef` is that id. Orphan stage files are ignored: their files stay (D11), and counting them would make a map undeletable. Step 7 extends `refsTo` with link targets (C3a/C3b).
- An unused map is not removed from disk. `planSave` cannot omit a file, and hard delete is forbidden. Delete hides that map id for this session; Undo puts it back; a reload lists the file again. Stage delete writes `project.json` only. `excludedStages` is filtered only when it is already an array.
- One undo snapshot, the latest action, not a stack that grows with edits. The only control is the toast for 6 s ("Changed · Undo" on add, rename and resize; "Deleted · Undo" on delete). Add opens the editor at once, so its toast shows on the project screen if the user comes back within 6 s. Undo of that add also hides the new map id for the session.
- Rename uses `checkName`: empty is "Give your game a name", over 40 code points is "Use 40 characters or fewer". The id and the file name do not change.
- The resize sheet lists `playerSpawns 0 at 0,8 will go` and `Edge i will go`. After confirm the project screen shows `placementDropped <list> <index> outsideMap` and `mapEntryDropped edges <index> outsideMap`. Those rows are not a new file. New terrain cells use the smallest palette int whose value is `"floor"`, or the smallest unused non-negative int if floor is missing. An existing key is not overwritten. Lanes, when present, crop like terrain with `0` in new cells and no row. Above 256 the sheet says "Big maps may stutter on phones" and does not block.
- Extra file `tools/maker/home.ts`: it is the click router, the 6 s toast, and the open of the new stage. `project.ts` only paints the stage row and a tail slot. `tools/maker/rooms.ts` is 136 lines against a 60-line guide cap. The step says those caps are guidance and the hard gate is 400. No new dependency. Session state is one record, one snapshot, and the hidden map ids. Nothing grows per frame.
- `src/editor/stage/resize.ts` is 63 lines against a 60 cap (crop, floor key and three placement lists in one pure pass). `src/project/load/read-project.ts` is 4+/4- against a 3 cap (the `mapAt` path map the D21 row needs). Total 394 ≤ 400.
- `tools/maker/stage.ts` was not edited, so the stage-place pin at `tools/maker/stage.ts:31` (`kind: string`) still matches. No `tools/play-stage/` file changed.

## Next step
- Step 7 (C3a/C3b) should extend `refsTo` with link targets and refuse delete while a link points at the stage or map. 4c does not add a link field.
