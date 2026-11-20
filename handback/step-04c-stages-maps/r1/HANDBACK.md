# Hand-back step-04c-stages-maps r1
Step file: docs/maker/steps/step-04-stage-editor.md (the 4c sections and the shared run rules)
Base commit: a85ae665cbb4db53b958be6e29b2f68ec56c4d60     Code head: 73ac4720955e419d4696ca22845f4d38384011c5     Tree: cde99f9dbfd7fa41d6a5fd3615fbfdfedff3ee99     Branch: step/step-04c-stages-maps-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

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
`npm ci && npm run green` exits 0. N = 2. Floor 1063.
npm test: 1065/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
```
# tests 1065
# pass 1065
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat a85ae665cbb4db53b958be6e29b2f68ec56c4d60..73ac4720955e419d4696ca22845f4d38384011c5 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4c-stages-maps/**' ':!handback/**'`: 9 files changed, 382 insertions(+), 12 deletions(-). 382 insertions + 12 deletions = 394.
The smoke script is 69 lines.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome`. This sandbox has no `/usr/bin/google-chrome`.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` printed `SMOKE PASS` on 3 runs. Checks 1–7 were ok at 390 and at 360 each time. Run 3 ran while 8 `node -e 'for(;;){}'` loops were burning CPU. It still printed `SMOKE PASS`.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed `SMOKE PASS`. Checks 1–8 were ok at 390 and at 360.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` printed `SMOKE PASS`. Checks 1–8 were ok at 390 and at 360.
Waits after a save use `waitForFunction` on the expected label or text. No fixed pause.
Screenshots at 390, in this folder: `01-project.png` (Stages and Maps), `02-add.png` (Add stage), `03-rename.png`, `04-resize.png` (drop list), `05-refuse.png` (Used by), `06-play.png` (Test on the new stage).

## Shipped tests (sha256)
The step file ships no frozen test hash for these files. They are new.
```
431a83b1e5a3017191bab276cf446424fc899a52d5e2d4750c2d74689e922d62  tests/editor/stage-rooms.test.ts
ae29e2cd04665185f1f4baf5e679cb6ab6dbe8cf3930a7012da05aecef62de04  tests/project/load/map-entry-dropped.test.ts
```
Named test present: `mapEntryDropped: warns, skips in memory, writes nothing back`.

## Helpers & self-review
- Helper (draft review): delete and undo. It said undo must not call `store.remove`, and delete must not create `render.excludedStages` when that array is absent. Both were applied. It also said not to copy a seed. That was not applied: Test throws `play: seed` with no numeric seed, and Done when requires Test on a new stage. The first listed numeric seed is copied. `tools/play-stage/` was not edited.
- Helper (final pass): started on the staged tree and cancelled after it returned no report.
- Self-review: undo of add-with-a-new-map pushed the new map id onto `sess.hidden` and then replaced that list with the snapshot, so the new map stayed listed. The snapshot is assigned first, then the new map id is pushed. `npm ci && npm run green` and the smokes were run again after that fix.
- Self-review: Acceptance — add with a new map and with an existing map, done. Rename keeps id, path and every other field, done. `refsTo` names the live stages; a used map is refused; the last stage is refused, done. Delete drops the id from `project.stages` and from `excludedStages` when that array exists, and the file stays, done. Resize keeps the top-left, Floor and `null` in new cells, one D17 row per dropped placement, one D21 row per dropped edge, lanes cropped with `0` and no row, shared map drops both stages, done. Resized project loads with no hard row and `playDocsOf` plays it, done. Palette `{"0":"water"}` grows floor at `"1"` and does not clobber `0`, done. Named `mapEntryDropped` test: one warning, `edgeOffMap` at 99,1, in-map edge still blocks, files deep-equal the clone, done. Smokes, done. Look reuses the step 2 cards, sheets and 48px targets, done. `tools/maker/stage.ts:31` pin unchanged, done.
- Self-review: QA G1 done (new tests, no shipped hash to copy). G2 done. G3 done (`check:state` exit 0). G4 no quoted interface in 4c. G5 no frozen S0 edit, no play-stage edit. G6 extra file `tools/maker/home.ts` named below. G7 382 + 12 = 394; file guide caps over on `tools/maker/rooms.ts` named below. G8 gates exit 0. G9 this note. G10 the Done-when lines above.

## Decisions & deviations
- A new stage copies the first listed stage's numeric seed when one exists (the demo copies 24301) so Test can start. No `kind` or `formatVersion` literal. Other fills are the new id, the name, and `mapRef`. Names are "Stage N" and "Stage N map", N = listed stages + 1. An empty-only project still has no seed.
- `refsTo(id)` returns names of stages in `project.stages` whose `mapRef` is that id. Orphan stage files are ignored: their files stay (D11), and counting them would make a map undeletable. Step 7 extends `refsTo` with link targets (C3a/C3b).
- An unused map is not removed from disk. `planSave` cannot omit a file, and hard delete is forbidden. Delete hides that map id for this session; Undo puts it back; a reload lists the file again. Stage delete writes `project.json` only. `excludedStages` is filtered only when it is already an array.
- One undo snapshot, the latest action, not a stack that grows with edits. The only control is the toast for 6 s ("Changed · Undo" on add, rename and resize; "Deleted · Undo" on delete). Add opens the editor at once, so its toast shows on the project screen if the user comes back within 6 s. Undo of that add also hides the new map id for the session.
- Rename uses `checkName`: empty is "Give your game a name", over 40 code points is "Use 40 characters or fewer". The id and the file name do not change.
- The resize sheet lists `playerSpawns 0 at 0,8 will go` and `Edge i will go`. After confirm the project screen shows `placementDropped <list> <index> outsideMap` and `mapEntryDropped edges <index> outsideMap`. Those rows are not a new file. New terrain cells use the smallest palette int whose value is `"floor"`, or the smallest unused non-negative int if floor is missing. An existing key is not overwritten. Lanes, when present, crop like terrain with `0` in new cells and no row. Above 256 the sheet says "Big maps may stutter on phones" and does not block.
- Extra file `tools/maker/home.ts`: it is the click router, the 6 s toast, and the open of the new stage. `project.ts` only paints the stage row and a tail slot. `tools/maker/rooms.ts` is 136 lines against a 60-line guide cap. The step says those caps are guidance and the hard gate is 400. No new dependency. Session state is one record, one snapshot, and the hidden map ids. Nothing grows per frame.
- `tools/maker/stage.ts` was not edited, so the stage-place pin at `tools/maker/stage.ts:31` (`kind: string`) still matches. No `tools/play-stage/` file changed.

## Next step
- Step 7 (C3a/C3b) should extend `refsTo` with link targets and refuse delete while a link points at the stage or map. 4c does not add a link field.
