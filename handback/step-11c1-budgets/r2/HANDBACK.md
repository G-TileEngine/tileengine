# Hand-back step-11c1-budgets r2
Step file: docs/maker/steps/step-11c1-budgets.md (r2, sha256 d876765fab4fcdabe691f74421076541e5e0a13ab02f5f501b572e865dcf6215, 164 lines). Paste: docs/maker/steps/step-11c1-paste.md. QA review: docs/qa/step-11c1-r1-review.md on main c1baf1db1bae434454479a29b72f3c65111f25cc (sha256 c805565e1b5c019cb5eec398d49031da4207542729354205c1f6729ec90d496e, 52 lines).
Base commit: b7acc899fbf6f90cb0e43b21633d20c3bdf06ac2     Code head: 537479d4280916093346d9e7a5315d00025679ce     Code head tree: af8ea0ee292edf5c206ff4cbd1ce202ddffbf57b     Branch: step/step-11c1-budgets-r2-chatA     PR: opened by Chief Of Staff from the branch
Started from the r1 tip 9976ac6b9a6e2ae59fe7d9fc831f0dfc3f328ab8 (r1 code head c57e9bf23c6fbde936d0771ce257e216e2e1babf). New commits only. No rebase and no force-push.
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish.

## Changed files
Against the r1 code head, only the two files QA named. `git diff --name-status c57e9bf23c6fbde936d0771ce257e216e2e1babf..537479d4280916093346d9e7a5315d00025679ce` is:
```
M	tests/project/budgets-11c1.test.ts
M	tools/maker/test-launch.ts
```
Every other file is byte-identical to c57e9bf23c6fbde936d0771ce257e216e2e1babf. Against the base, the same 14 build-table files as r1. `git diff --shortstat b7acc899fbf6f90cb0e43b21633d20c3bdf06ac2..537479d4280916093346d9e7a5315d00025679ce -- . ':!handback/**'` is `14 files changed, 390 insertions(+), 10 deletions(-)`. 390 + 10 = 400.

Caps against the base (insertions + deletions), unchanged from r1 because the test file is still 133 lines and the import is still one line: budgets.ts 112/112, read-project.ts 2 + index.ts 1 = 3/4, test-gate.ts 25+2/32, test-launch.ts 2+2/4, export.ts 2+2/4, tools/maker/budgets.ts 39/42, home.ts 3+1/6, app.css 1/1, each project.json 7+1/8, tests 133/135, smoke 49/60.

## Green
`npm ci` (135 packages) then `npm run green` exited 0 on this code head. Floor 1175. Node's test runner prints `ok`, not `✔`.
```
# tests 1175
# pass 1175
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 180 modules, 509 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L92.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored. Browser: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. `CHROME` was set.
- S0 `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797` — 14 ok, TOUCH SMOKE PASS.
- s3 `handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` — first run 17 ok, TOUCH SMOKE FAIL. Step 9 at 390 missed (`empty blocked`, board false, text empty). Step 9 at 360 passed. Known flake. Solo re-run: 18 ok, TOUCH SMOKE PASS.
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
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS. No flake.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
- s10b `handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1` — 8 ok, SMOKE PASS.
- s10c `handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1` — 8 ok, SMOKE PASS.
- s10d `handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1` — 8 ok, SMOKE PASS.
- s11a `handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1` — 6 ok, SMOKE PASS.
- s11a2 `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1` — 6 ok, SMOKE PASS.
- s11b `handoff/steps/tests/s11b-debug-apk/smoke.mjs . 8820 r1` — 6 ok, SMOKE PASS.
- s11c1 `handoff/steps/tests/s11c1-budgets/smoke.mjs . 8823 r2` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS.
Mutations, one at a time, restored from an in-memory snapshot (`/tmp/mutate-11c1.py`). C20 is QA's plant `const me = "player"`, not the r1 pool-side plant. After the last restore, budgets.ts matches c57e9bf2 and the five tests passed. C19 wrote shots under `handback/step-11c1-budgets/mut`, which was deleted.
- C1 `budgetOver` before `hard`: caught (test 2).
- C2 over never hard: caught (tests 2–4; smoke 3).
- C3 near starts above warn, C4 over at the limit: caught (test 2).
- C5 team ignores the loadout size: caught (test 1, units stays 7 not 6).
- C6 neutrals ignore `sides.neutrals`: caught (test 1, activeAi 3 becomes 1).
- C7 effects counted per setup, C8 alias prefix kept, C9 a `"default"` answer read as its stored value: caught (test 1).
- C10 a broken entry skipped, C11 warn 0 accepted: caught (test 3).
- C12 weighted picks not capped by spawns, C13 waves counted as 0, C21 `allowRepeats: false` ignored, C22 waves summed, C23 only the first wave, C24 wave units left out of effects, C25 waves left out of activeAi: caught (test 1).
- C14 the generic sentence, C15 Test drops the stage names: caught (test 4).
- C16 Build game drops the stage names: caught (test 4, `callCount() === 0` still holds and the lines do not).
- C17 `budgetsTap` does not flip `open`: caught (test 5).
- C18 near counted as over, C26 near suffix missing, C27 over says near, C28 meter not `aria-hidden`: caught (test 5).
- C19 Rule 6's CSS line removed: caught (smoke 3, sheet height 0 at 390 and at 360).
- C20 `const me = "player"`: caught (test 1). Proof, applied and restored: expected `units:7 activeAi:3 effects:0 stageTiles:54:6x9`, actual `units:7 activeAi:4 effects:0 stageTiles:54:6x9`. Pass 4, fail 1. Restored. The same plant leaves the untouched demo at activeAi 2, which is why r1's `"player"` loadout side never failed.

## Export audit
`/tmp/self-audit.mjs` (not committed). Three builders, commit `"0".repeat(40)`: play-stage `build(out, commit, root, false)` all files; baseline `build(out, commit, root)` all files; maker `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. No file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	136 files	hits 0
baseline	150 files	hits 0
maker	150 files	hits 0
AUDIT PASS
```

## Shots
390×844, from the s11c1 r2 run, committed beside this file:
- `01-budgets-collapsed.png` (39773 bytes)
- `02-budgets-expanded.png` (45492 bytes)
- `03-gate-budget.png` (48988 bytes)

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. As committed at the code head:
```
99d0d3767ff22f73346605d9bc592fdcb81d1580115fe5be7a22e2397a0c5cf3  tests/project/budgets-11c1.test.ts
e8ca15c2d6ece002e69ff1deb74e18af083832c1d768dff91685193a628c78a9  handoff/steps/tests/s11c1-budgets/smoke.mjs
```
The test is 133 lines. The smoke was not edited.

## Helpers & self-review
- Helper (must-fix review): read the test file, the import, and `git diff` against c57e9bf2. Found must-fixes 1–3 pass, and no remaining multi-binding line, comma probe, or second statement on a line. No edit.
- Helper (mutation review): judged C1–C28 against the rewritten assertions. C1–C18 and C20–C28 caught by the named tests. C19 is not in this file (smoke 3). It also counted a one-statement arrow body on the same line as two statements (the r1 helpers `setBudgets`, `effectBehaviour`, `answer`, and the two `start` callbacks, plus the new `kept` callbacks). The new `kept` callbacks were then rewritten as expression arrows. The r1 helpers and `start` callbacks were left, because splitting them adds lines past 133 and QA did not must-fix that shape.
- `/tmp/mutate-11c1.py` (not committed): C1–C28. C20 retargeted to `const me = "player"`. C19 smoke rev `mut`, folder deleted. In-memory restore, not `git checkout` of the product tree. All 28 caught.
- `/tmp/allsmoke-11c1.sh` (not committed): the 25 smokes solo, `CHROME` set, `handback` restored after each. s3's first run failed step 9 at 390; the script itself does not re-run flakes.
- Solo re-run, not a file: `node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798` with `CHROME` set. 18 ok, TOUCH SMOKE PASS.
- `/tmp/self-audit.mjs` (not committed): the export audit. AUDIT PASS.
- Self-review: must-fix 1 done (one binding per line for SID, STAGE, MAP, AT, PID, NOW, S1–S5, docs, and store; probe is `mock.fn` and `callCount() === 0`; file 133). Must-fix 2 done (loadout and enemyPool are `"heroes"`; the plant fails test 1 and was restored). Must-fix 3 done (import is `testGate, playLine, emptyBoard, stageNames` only). No other line of test-launch.ts differs from c57e9bf2. No other product file differs from c57e9bf2. Green 1175/0 done. Tools tsc only the 3 base errors done. 400 not over done. All 25 smokes PASS, with s3's flake and its re-run recorded, s8c no flake, s6a 18 done. C1–C28 caught, C20 re-proven done. Export audit 136/150/150 done. QA checklist: G1 done, G2 done, G3 not touched, G4 no new interface, G5 do-not-touch held, G6 only the two named files, G7 400, G8 no new law surface, G9 this note, G10 the three must-fixes. No token in the repo, no main push, no tag, no PR.

## Decisions & deviations
- The AI case sets `sides.loadout` and `sides.enemyPool` to `"heroes"` and leaves `neutrals` as `"wolves"`. The demo merchant is stored on side `"player"`, so with a loadout side of `"heroes"` that neutral counts as AI. activeAi is 3, then still 3 after the size-1 loadout. Units stay 7, then 6. The plant `const me = "player"` counts the heroes pool and not the merchant, so activeAi is 4.
- Setup trimmed to stay at 133, not by joining lines: `isObj` is inlined into `bag`; `kept` builds the bag and returns it, so tests 2 and 3 do not repeat that setup; `save` checks `commitWrites` in one `if`. The `kept` callbacks are single expressions.
- `setBudgets`, `effectBehaviour`, `answer`, and the two `start` callbacks stay one-line arrows with one statement in the body. That is the r1 shape. Giving each body its own line would pass 133.
- The test-launch import keeps the base order and adds `stageNames` at the end. The `testGate` call on the dense line is unchanged from r1.
- Counted size against the base is still 400. No product file outside the two QA named was edited. No line was wrapped, split, or joined to move the count.

## Next step
- 11c2 is unchanged by this rework (stage chip, Budgets sheet, phone-like Test). QA's carries stand: neutral setupIds not counted, a pool on the neutral side still counted as AI, `"none"` counted as an effect, the summary's first stage instead of the busiest, and `required` not covered by a test. No publish is part of 11c1.
