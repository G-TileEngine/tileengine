# Hand-back step-f1-look-kit r1
Step file: docs/maker/steps/step-f1-look-kit.md (r3b, sha256 9d7ecff25ed21e5b0cddbf5117ae1e584341ca6ed41f7565c11ee85661e3227c)
Base commit: 04dadacfc40d81d17b21df8f96ef1e11f9d2dbaa     Head commit: d0689c2c92d32cca0b7ef339633d7b08f814d874     Tree: 567d755a7c79f0a4fd8a614f68e63e06a578c195     Branch: step/step-f1-look-kit-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1

## Changed files
```
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
```
Counted lines (base..code head, `git diff --numstat` excluding `handback/**` and `package-lock.json`): 289 insertions + 85 deletions = 374. Cap 380. 27 files. Every file is at or under its trial cap.

## Green
npm ci && npm run green: exit 0. npm test: 1188 pass / 0 fail / 0 skipped / 0 todo (floor 1188). typecheck (`npm run typecheck`): exit 0. lint: exit 0. deps: exit 0. check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json`: exit 2, only the 3 base errors. `tools/effect-designer/page.ts` L101 TS18047. `tools/maker/home.ts` L93 TS7053 twice (L92 on the base; one new import line above it).

## Plants
`python3 handoff/steps/tests/step-f1-look-kit/plants-f1.py` from the repo root: 29/29 caught (P1–P29).

## Smoke
All 25 smokes PASS solo at 390 and 360. Ports are the ones in each smoke's header; s11b on 8840. Ok counts: s0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6.
Edits are only the lines the guide's Smoke lines name, in eight smokes: s4a L26 and L28, s4b L28, s9b L27, s5a L33 and L41, s5b L73, s6a L31 L38 and L45, s6c L81, s8 L34 (both replacements on that one line). 12+ 12−.
First solo pass of s6d, s8c and s9c failed with ENOENT on `handback/step-06c-checkpoint/r1/checkpoint.tileproj/setups/setup_01M81X2F2HQQ17D2CWYR72DC9B.json` because s6c rewrites that checkpoint project. Tracked handback files were restored and those three were re-run solo: PASS (14, 8 and 6 ok). Not an F1 product miss.

## Export audit
`/tmp/f1-audit.mjs` builds three trees with commit `0`×40. play-stage release 136 files, baseline 150, maker play tree (paths starting `play/` or containing `play-stage`) 150. 0 hits on the name and content patterns in the 11c1 guide. AUDIT PASS. Same as the base.

## Tap-path shots
Viewport shots at 390×844 and 360, in this folder, beside copies of `docs/maker/shots/f01-stage-editor.png` and `f04-paint.png`:
- (a) stage editor on landing: `a-stage-390.png`, `a-stage-360.png`
- (b) after painting one tile, Undo chip: `b-undo-390.png`, `b-undo-360.png`
- (c) tile sheet, Water ringed: `c-tile-390.png`, `c-tile-360.png`
- (d) project page, thumbs then blue Test: `d-project-390.png`, `d-project-360.png`, `d-project-test-390.png`, `d-project-test-360.png`
- (e) unit page, On your team Off | On and blue Test: `e-unit-390.png`, `e-unit-360.png`
- (f) My games, New project ghost row: `f-my-games-390.png`, `f-my-games-360.png`
- (g) View, Grid lines On then Off: `g-grid-on-390.png`, `g-grid-off-390.png`, `g-grid-on-360.png`, `g-grid-off-360.png`

F6 tap-path row this step adds: Look kit (F1) | stage editor: Test is the only primary; Undo chip after a paint; tile → picked terrain chip; View → Grid lines Off | On | 0–1

## Shipped tests (sha256, unchanged)
83ef2acf241e6c1aa9117b19d778cea27745a9219e259817735faeec50df45f5  tests/tools/f1-look-kit.test.ts

## Helpers & self-review
- Helper agent (review, no edits): read the guide rulings and `git diff 04dadacf` and checked the 12 review points (roles, seg markup, undo condition, Rule 8, the one home import, plus rows, danger, smoke hunks, caps, app.css, icons, cell narrowing). Found no Acceptance, plant, smoke or QA failure. Noted the two cap-forced omissions already named below.
- `/tmp/f1-audit.mjs`: the three-builder export audit. Result 136 / 150 / 150, 0 hits, AUDIT PASS.
- `/tmp/f1-shots.mjs`: built the maker and took the tap-path shots (a)–(g) at 390 and 360, including the second project frame so Test is on screen.
- `/tmp/f1-smokes.sh`: ran all 25 smokes solo. First pass 22 PASS; s6d, s8c and s9c failed on the checkpoint file s6c had rewritten. Restored tracked handback files and re-ran those three: PASS.
- `handoff/steps/tests/step-f1-look-kit/plants-f1.py`: 29/29 caught. The script is the kit's; it was run, not edited.
- Self-review: Acceptance — green 1188 done; tools tsc only the 3 base errors done; shipped test sha unchanged and plants 29/29 done; `rg class="btn"` and `rg '[⋯▶]'` in tools/maker empty done; tokens.css diff empty and app.css is only the L51 undo drop plus L59–L74 done; file caps and 374 ≤ 380 done; Rule 8 done (new lines are imports, `seg`, and `const goes` / `over` / `undo`); 25 smokes PASS with only the named edits done; export audit 136/150/150 done; tap-path shots (a)–(g) including both Grid states, beside f01 and f04, done; this hand-back done. QA checklist G1–G10 done (G2 is `npm run typecheck` exit 0; the 3 tools errors are the base; G6 no file outside the Files list; G7 374 inside 150–400 and every file cap).

## Decisions & deviations
- Primaries are Ruling 2's table. `primary` is a marker only: no `.btn.primary` CSS. The class is `pick`, not `chip`, because `.chip` is the status strip.
- The Undo chip is a transparent 48 px button (`min-height: 48px; padding: 4px`) around a 40 px pill, `z-index: 4` under `.scrim` (5). `.float` is height 0 after `.body.stage`, so the pill sits 12 px above the stage body's bottom edge plus the safe area, not on the grid. It renders only when not read-only, undo is possible, and `over` is empty.
- `over` joins the stage's own sheets (tile, links/goes, pick, ask, view, start-new, rules). The Background sheet is painted by `home.ts` and covers the chip with its scrim.
- `seg()` puts the label outside the frame, Off then On, exactly one pressed. Only the option that isn't set carries `data-act`. The On option's `aria-label` is the label itself. The only new button words are Off and On.
- Icons sit beside words a smoke presses. The four plus rows drop the "+" character for the plus icon. "+ Add ability" keeps its "+". s5a and s5b were edited on the named lines only. `icon()` builds a string per render and keeps no cache.
- At the file caps, three additions were left off: the error-state stage Back (`stage.ts` L142) has no back icon (14+ 10−); the unit name button (`u:rename`) has no edit icon (9+ 8−); the read-only/newer levels card, which has no button, has no thumb (5+ 4−). Rooms Rename and the unit sheet Edit do have the edit icon.
- Trial commit `8ac4e693` is not on the remote, so the 16 icon paths are 24 px strokes that satisfy the shipped test and plants (undo starts `M9 14L4 9l5-5`, edit contains the pinned path, fill only on play and more). `icons.ts` is 22 lines (cap 24). `widgets.ts` is 8+ 4− (cap 9+ 4−). Smokes are 12+ 12− because s8's two replacements share one line (cap 13+ 13−).
- Shot (d) is two viewport frames so the thumbs and the blue Test are both on screen. `f01-stage-editor.png` and `f04-paint.png` in this folder are copies of the style-spec shots, placed beside the tap-path shots.

## Next step
None proposed. F2a still owns the Budgets icon, eyebrows, and the On aria-label `{label}: On`.
