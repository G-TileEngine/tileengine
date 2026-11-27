# Hand-back step-f1-look-kit r2
Step file: docs/maker/steps/step-f1-look-kit.md (r3b, sha256 9d7ecff25ed21e5b0cddbf5117ae1e584341ca6ed41f7565c11ee85661e3227c)
Base commit: 04dadacfc40d81d17b21df8f96ef1e11f9d2dbaa     Head commit: f4f952d755ff62a2336bb6e645dc0550a75e211c     Tree: b9676b64899b3cbe727d9e69032472ed73309415     Branch: step/step-f1-look-kit-r2-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

Answers QA r1 (docs/qa/step-f1-handback-review.md): one must-fix, M1. r1 code commit d0689c2c was cherry-picked onto 04dadacf and the icon swap was folded into that same code commit. No other code file changed.

## Changed files
M	handoff/steps/tests/s4a-stage-paint/smoke.mjs
M	handoff/steps/tests/s4b-stage-place/smoke.mjs
M	handoff/steps/tests/s5a-units/smoke.mjs
M	handoff/steps/tests/s5b-abilities/smoke.mjs
M	handoff/steps/tests/s6a-win-rules/smoke.mjs
M	handoff/steps/tests/s6c-checkpoint/smoke.mjs
M	handoff/steps/tests/s8-autosave-links/smoke.mjs
M	handoff/steps/tests/s9b-art-upload/smoke.mjs
M	tests/editor/project-home.test.ts
M	tests/editor/stage-editor.test.ts
A	tests/tools/f1-look-kit.test.ts
M	tools/maker/ability-panel.ts
M	tools/maker/add-ability.ts
M	tools/maker/app.css
M	tools/maker/art.ts
M	tools/maker/build-sheet.ts
M	tools/maker/effects.ts
M	tools/maker/home.ts
A	tools/maker/icons.ts
M	tools/maker/levels.ts
M	tools/maker/project.ts
M	tools/maker/rooms.ts
M	tools/maker/rules-panel.ts
M	tools/maker/stage-sheets.ts
M	tools/maker/stage.ts
M	tools/maker/units.ts
M	tools/maker/widgets.ts

## Green
npm test: 1188/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Code head: f4f952d755ff62a2336bb6e645dc0550a75e211c
Code tree: b9676b64899b3cbe727d9e69032472ed73309415
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(93,221) TS7053
- tools/maker/home.ts(93,266) TS7053
Counted lines vs base: 289 additions + 85 deletions = 374 (cap 380). icons.ts stays 22 lines (cap 24). `git diff d0689c2c --stat` is only tools/maker/icons.ts, 16+/16−.

## Plants
handoff/steps/tests/step-f1-look-kit/plants-f1.py: 29/29 caught.

## Smoke
All 25 smokes PASS solo at 390 and 360. No smoke file changed in r2. After each smoke, tracked handback files were restored (`git checkout -- handback` and `git clean -fd -- handback`) so s6c's rewrite of the checkpoint project did not fail s6d, s8c or s9c. s11b on 8840.

| Smoke | Ok lines |
|---|---|
| s0 | 14 |
| s3 | 18 |
| s4a | 16 |
| s4b | 16 |
| s4c | 16 |
| s5a | 16 |
| s5b | 16 |
| s5c | 16 |
| s6a | 18 |
| s6b | 16 |
| s6c | 18 |
| s6d | 14 |
| s7 | 20 |
| s8 | 16 |
| s9 | 12 |
| s8c | 8 |
| s9b | 14 |
| s9c | 6 |
| s10b | 8 |
| s10c | 8 |
| s10d | 8 |
| s11a | 6 |
| s11a2 | 6 |
| s11b | 6 |
| s11c1 | 6 |

## Export audit
/tmp/f1-audit.mjs. play-stage release 136, baseline 150, maker play tree 150, 0 hits. AUDIT PASS.

## Shipped tests (sha256, unchanged)
83ef2acf241e6c1aa9117b19d778cea27745a9219e259817735faeec50df45f5  tests/tools/f1-look-kit.test.ts

## Tap-path shots
Retaken at 390×844 and 360 because the icons changed. Beside f01 (f01-stage-editor.png, copy of docs/maker/shots/f01-stage-editor.png) and f04 (f04-paint.png). (d) is two frames so the thumbs and the blue Test are both on screen. (g) is Grid lines On and Off.

| Shot | 390 | 360 |
|---|---|---|
| (a) stage editor on landing | a-stage-390.png | a-stage-360.png |
| (b) after one paint, Undo chip | b-undo-390.png | b-undo-360.png |
| (c) tile sheet, current terrain ringed | c-tile-390.png | c-tile-360.png |
| (d) project page, thumbs | d-project-390.png | d-project-360.png |
| (d) project page, blue Test | d-project-test-390.png | d-project-test-360.png |
| (e) unit page, On your team, blue Test | e-unit-390.png | e-unit-360.png |
| (f) My games, New project ghost row | f-my-games-390.png | f-my-games-360.png |
| (g) View, Grid lines On | g-grid-on-390.png | g-grid-on-360.png |
| (g) View, Grid lines Off | g-grid-off-390.png | g-grid-off-360.png |

Rules is a flag, Build game is a down arrow into a tray, units are one person, levels is a star, View is a 3×3 grid. That is M1.

F6 tap-path row (not written into style-spec; F6 owns that table):

| Look kit (F1) | stage editor: Test is the only primary; Undo chip after a paint; tile → picked terrain chip; View → Grid lines Off \| On | 0–1 |

## Helpers & self-review
- Helper review (subagent, read-only): checked the r2 code commit against M1. PASS: tree b9676b64899b3cbe727d9e69032472ed73309415; diff vs d0689c2 is only icons.ts 16+/16−; lines 2–17 byte-identical to the 16 PATHS lines in the QA review; lines 1 and 18–22 unchanged; numstat 289+85; no other file differs from the r1 code commit.
- Script /tmp/f1-audit.mjs: export audit, 136/150/150, 0 hits, AUDIT PASS.
- Script /tmp/f1-smokes.sh: all 25 smokes solo, restore handback after each. SMOKE_FAILS 0. Ok counts in § Smoke.
- Script /tmp/f1-shots.mjs: retook (a)–(g) at 390 and 360 into this folder. SHOTS PASS.
- Kit script handoff/steps/tests/step-f1-look-kit/plants-f1.py: 29/29 caught.
- Self-review: Acceptance done. npm run green 1188/0. tools tsc only the 3 base errors. Shipped test sha unchanged. Plants 29/29. No bare class="btn", no ⋯ or ▶ in tools/maker (unchanged from r1; not re-broken). tokens.css untouched; app.css not in the r2 diff. Every file still inside its cap; 374 ≤ 380. Rule 8 unchanged (no new statement). Smokes PASS with no new smoke edits. Export audit 136/150/150. Shots (a)–(g) retaken, g in both states, beside f01 and f04. QA checklist: G1 done (shipped sha, plants 29/29). G2 done (npm run typecheck exit 0; tools tsc still only the 3 base errors). G3 done (src untouched). G4 done (icon/thumb/seg signatures unchanged). G5 done (r2 diff is icons.ts only; do-not-touch paths not in the code diff). G6 done (no new code file). G7 done (374, within 150–400 and 380). G8 done (no src, clock, or export change). G9 done (M1 named below). G10 done (the r2 done-line: tree, green, tsc, plants, smokes, audit, 374, shots).

## Decisions & deviations
- M1 only. tools/maker/icons.ts lines 2–17 are UX's trial PATHS, byte for byte, in the guide's order. The rest of that file, and every other code file, is the r1 code commit.
- The code tree is b9676b64899b3cbe727d9e69032472ed73309415, the tree QA named for d0689c2 plus this swap. Counted lines stay 289+85 = 374.
- Shots were retaken. (d) is still two viewport frames (thumbs, then blue Test). f01 and f04 in this folder are copies of docs/maker/shots so they sit beside the new shots.
- The three placements QA F-b named (error-state stage Back, the unit name button's edit icon, the read-only/newer levels card thumb) are still absent. The trial lacks them too, and the file caps cannot fit them. Not touched in r2. Carry to F2a, with the On aria-label and the Budgets icon.
- icon() still returns a new string on each call and keeps no cache. Nothing retained grows with edits.
- No new dependency, no format change, no smoke edit in r2.

## Next step
- F2a, as the guide and QA r1 already carry: On aria-label `{label}: On`, the Budgets icon, and F-b's three placements.
