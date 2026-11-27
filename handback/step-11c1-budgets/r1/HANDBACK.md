# Hand-back step-11c1-budgets r1
Step file: docs/maker/steps/step-11c1-budgets.md (r2, sha256 d876765fab4fcdabe691f74421076541e5e0a13ab02f5f501b572e865dcf6215, 164 lines). DSK: handoff/dsk-rulings/2026-11-26-step11c.md (sha256 e997db7299ca56d56c81462a0ec0e48b34277b5a954b549f31dfcbce8ad89daa, 47 lines), E8–E10 and E10a. CN-029 is staged in data/staging/cn-budgets/ and is not applied.
Base commit: b7acc899fbf6f90cb0e43b21633d20c3bdf06ac2     Code head: c57e9bf23c6fbde936d0771ce257e216e2e1babf     Code head tree: 5a9ba777b4220b9ebaa3350d6a652146dabf571a     Branch: step/step-11c1-budgets-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish.

## Changed files
Against the base, the Build table only. `git diff --shortstat b7acc899fbf6f90cb0e43b21633d20c3bdf06ac2..c57e9bf23c6fbde936d0771ce257e216e2e1babf -- . ':!handback/**'` is `14 files changed, 390 insertions(+), 10 deletions(-)`. 390 + 10 = 400.
```
M	data/templates/demo.tileproj/project.json
M	data/templates/empty.tileproj/project.json
M	fixtures/demo.tileproj/project.json
A	handoff/steps/tests/s11c1-budgets/smoke.mjs
M	src/editor/project/test-gate.ts
A	src/project/load/budgets.ts
M	src/project/load/index.ts
M	src/project/load/read-project.ts
A	tests/project/budgets-11c1.test.ts
M	tools/maker/app.css
A	tools/maker/budgets.ts
M	tools/maker/export.ts
M	tools/maker/home.ts
M	tools/maker/test-launch.ts
```
Caps (insertions + deletions against the base): load `budgets.ts` 112/112, `read-project.ts` 2 + `index.ts` 1 = 3/4, `test-gate.ts` 25+2− = 27/32, `test-launch.ts` 2+2− and `export.ts` 2+2− (cap 4+4), maker `budgets.ts` 39/42, `home.ts` 3+1− = 4/6, `app.css` 1/1, each `project.json` 7+1− = 8/8, tests 133/135, smoke 49/60. Total 400. On the hard gate, not over. `fixtures/demo.tileproj/project.json` is byte-equal to `data/templates/demo.tileproj/project.json`.

## Green
`npm run green` exited 0 on this code head. Floor 1170 + 5 = 1175. Node's test runner prints `ok`, not `✔`. `npm ci` was run earlier in this build; node_modules was already installed, so it was not repeated for this confirmation.
```
# tests 1175
# pass 1175
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 180 modules, 509 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L92 (the new import shifts the old L91 errors).

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and `git clean -fd -- handback`). The three s11c1 shots were copied aside first and put back after the last smoke. Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6a–s11c1 default to that path. S0, s3, s4a, s4b, s4c, s5a, s5b, s5c and s6d look for `/usr/bin/google-chrome` or `/usr/local/bin/google-chrome`. The first pass of those nine had no `CHROME` set, so the browser never launched (oks=0). That is an environment miss, not a product flake. The same scripts were re-run with `CHROME` set to the path above and passed. s3 and s8c did not need a product re-run. s6a was 18 ok, including 390.
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS.
- s3 `handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` — 18 ok, TOUCH SMOKE PASS.
- s4a `handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` — 16 ok, SMOKE PASS.
- s4b `handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` — 16 ok, SMOKE PASS.
- s4c `handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` — 16 ok, SMOKE PASS.
- s5a `handoff/steps/tests/s5a-units/smoke.mjs . 8802` — 16 ok, SMOKE PASS.
- s5b `handoff/steps/tests/s5b-abilities/smoke.mjs . 8803` — 16 ok, SMOKE PASS.
- s5c `handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804` — 16 ok, SMOKE PASS.
- s6a `handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805` — 18 ok, SMOKE PASS.
- s6b `handoff/steps/tests/s6b-levels/smoke.mjs . 8806` — 16 ok, SMOKE PASS.
- s6c `handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` — 18 ok, SMOKE PASS.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808` — 14 ok, SMOKE PASS.
- s7 `handoff/steps/tests/s7-stage-links/smoke.mjs . 8809` — 20 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS.
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
- s10b `handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1` — 8 ok, SMOKE PASS.
- s10c `handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1` — 8 ok, SMOKE PASS.
- s10d `handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1` — 8 ok, SMOKE PASS.
- s11a `handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1` — 6 ok, SMOKE PASS.
- s11a2 `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1` — 6 ok, SMOKE PASS.
- s11b `handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8820 r1` — 6 ok, SMOKE PASS.
- s11c1 `handoff/steps/tests/s11c1-budgets/smoke.mjs . 8823 r1` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS.
Mutations, one at a time, restored from an in-memory snapshot (not `git checkout` of the work tree). C17 deletes `open = !open` inside `budgetsTap`. A plant that only skips the home.ts act line is the wrong site: test 5 calls `budgetsTap` and would miss it; smoke steps 1–2 cover the button. After the last restore the diff was still 390 insertions and 10 deletions.
- C1 `budgetOver` pushed before `hard`: caught (test 2).
- C2 over never hard: caught (tests 2–4; smoke 3).
- C3 near starts above warn: caught (test 2).
- C4 over at the limit: caught (test 2).
- C5 team ignores the loadout size: caught (test 1).
- C6 neutrals ignore `sides.neutrals`: caught (test 1).
- C7 effects counted per setup: caught (test 1).
- C8 alias prefix kept: caught (test 1).
- C9 a `"default"` answer read as its stored value: caught (test 1).
- C10 a broken entry skipped: caught (test 3).
- C11 warn 0 accepted: caught (test 3).
- C12 weighted picks not capped by spawns: caught (test 1).
- C13 waves counted as 0: caught (test 1).
- C14 the gate uses the generic sentence: caught (test 4; smoke 3).
- C15 Test drops the stage names: caught (test 4).
- C16 Build game drops the stage names: caught (test 4).
- C17 `budgetsTap` does not flip `open`: caught (test 5; smoke 1–2).
- C18 near counted as over: caught (test 5; smoke 2).
- C19 Rule 6's CSS line removed: caught (smoke 3, sheet height 0 at 390 and at 360).
- C20 AI ignores the loadout side: caught (test 1).
- C21 `allowRepeats: false` ignored: caught (test 1).
- C22 waves summed over all waves: caught (test 1).
- C23 only the first wave counted: caught (test 1).
- C24 wave units left out of effects: caught (test 1).
- C25 waves left out of activeAi: caught (test 1).
- C26 near rows lose the suffix: caught (test 5; smoke 2).
- C27 over rows say near: caught (test 5; smoke 2).
- C28 meter not `aria-hidden`: caught (test 5; smoke 2).

## Export audit
Written and run as `/tmp/self-audit.mjs` (not committed), from the repo, after the code was in place. Three builders, commit `"0".repeat(40)`: `tools/play-stage/build.ts` `build(out, commit, root, false)` all files; `tools/baseline/build.ts` `build(out, commit, root)` all files; `tools/maker/build.ts` `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. No file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	136 files	hits 0
baseline	150 files	hits 0
maker	150 files	hits 0
136 / 150 / 150
AUDIT PASS
```

## Shots
Committed next to this file. CSS pixels, 390×844, from s11c1 at width 390 only.
- `01-budgets-collapsed.png` — 390×844, 39773 bytes. Summary `Budgets: 1 over the limit`.
- `02-budgets-expanded.png` — 390×844, 45492 bytes. `7 of 9 · near limit` and `2 of 1 · over limit`.
- `03-gate-budget.png` — 390×844, 48988 bytes. Can't play yet, with the active-AI block line, sheet taller than 0.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. As committed at the code head:
```
c6b4f65da35780f2b5e919bbb3801d0cb44de6cc9bd29c9bea9af4fbeb12a4bb  tests/project/budgets-11c1.test.ts
e8ca15c2d6ece002e69ff1deb74e18af083832c1d768dff91685193a628c78a9  handoff/steps/tests/s11c1-budgets/smoke.mjs
```
The test is 133 lines. The smoke is 49 lines, in the s10c packed layout. No existing test or smoke was edited.

## Helpers & self-review
- Implementation review subagent (this hand-back, read-only): counting (E10/E10a), rows, the push after `hard`, gate copy, the Budgets row, the three JSON files, and the must-not list. One defect: the new test's Build-game probe packed two statements on one line (Rule 8). Fixed to one expression before the code commit. No other defect.
- Test review subagent (this hand-back, read-only): the five titles, the guide's expected counts, row order, `kept()`, the four UX lines, and C1–C28. Correct C17 is `budgetsTap` not flipping `open` (test 5 catches it; the home.ts act line would not). No missed plant. Same Rule 8 note, fixed as above.
- `/tmp/mutate-11c1.py` (not committed): plants C1–C28 and restores the eight source files from memory. C17 was retargeted onto `budgetsTap` before this run. All 28 caught. C19 is the only smoke plant.
- `/tmp/allsmoke-11c1.sh` (not committed): the 25 smokes solo, then restores tracked `handback`. First nine browser-less exits are the missing `CHROME`, recorded above; the rerun with `CHROME` set is the pass list.
- `/tmp/self-audit.mjs` (not committed): the export audit above. AUDIT PASS, re-run on this tree.
- Self-review: Done when — green 1175/0 done; tools tsc only the 3 base errors at home.ts L92 done; 25 smokes PASS with the guide's ok counts done; three shots at 390×844 done; export audit 136/150/150 and 0 hits done; C1–C28 recorded done. Rules 1–8 done (local CN-029 types; rows after `hard`; four UX lines wired at test-launch L31 and export L28; Budgets row is `btn ghost stage-row` with the · suffixes and an `aria-hidden` meter; one CSS line; option A only in the three `project.json` files; one statement per line in the new files, and the only dense-line edits are the two the guide names). Must-not list done (no core-types edit, no `src/core` / sim / runtime / rules, no play-stage / export / apk / stage.ts, no existing test or smoke edit, no budget number in code, no default when `budgets` is absent, no migration, no write on save, `ok` and `readOnly` unchanged, no stage chip, no extra CSS, no new dependency). QA checklist: G1 done (1175/0, five named tests, plants C1–C28 caught, no `.only` / skip). G2 done. G3 done (check:state OK, no new phase write). G4 done (no quoted interface in this step; the three local types match CN-029's readonly shapes). G5 done. G6 done (Build table only). G7 done (400, every file cap held). G8 done (no clock, no new pipe, no editor import into runtime, export audit 0 hits, one job per new file: `budgets.ts` counts and rows, maker `budgets.ts` paints the row). G9 done (the note below matches the diff). G10 done (the Done when lines above).

## Decisions & deviations
- CN-029's `BudgetKey`, `BudgetLimit` and `ProjectBudgets` are declared in `src/project/load/budgets.ts`. `src/types/core-types.ts` is untouched. The staged diff is not applied. EA ruling 2.
- Option A (units 40/80, activeAi 12/24, effects 8/12, stageTiles 16384/65536) is only in the three `project.json` files. No budget number in product code. No default when `budgets` is absent, and save does not write it.
- `budgetRows` is pushed after `hard` is computed, so `budgetOver` does not change `ok` or `readOnly`. The gate is the only block, through `testGate`.
- `overLine` reads the detail with one regex and does not call `JSON.parse`. Key order is `budget`, `used`, `limit`, then `w` and `h` for stage size. `stageNames` uses the id when `name` is not a string. `testGate`'s third argument defaults to `{}` so older callers stay unedited.
- The step counts 400 (390+10), the hard gate. `src/project/load/budgets.ts` is 112, its file cap. No line was wrapped or joined to hide a line. The Build-game probe in the new test is one arrow expression, `(fetched = true, Promise.resolve(""))`, so that line is one statement.
- The sandbox node is v22.23.3. `.nvmrc` says 24, and no Node 24 binary is installed. Green was run on v22. Not a product change.
- The maker row's `open` flag is one module binding for the project screen, as the guide's `budgetsTap` is written. No per-project memory was specified.
- Waves count the largest single wave. A weighted pool is `min(picks, spawns, entries)` when `allowRepeats` is false, otherwise `min(picks, spawns)`. `stage.overrides.setups` are not read. DSK E10a.

## Next step
- 11c2 is the stage chip and the "Budgets for this stage" sheet, the phone-like Test, and the warn/error meter colours. CN-029 lands on that branch and replaces the three local type lines with one import. Nothing public is part of 11c1.
