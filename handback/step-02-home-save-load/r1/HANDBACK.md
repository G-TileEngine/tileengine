# Hand-back step-02-home-save-load r1
Step file: docs/maker/steps/step-02-home-save-load.md
Base commit: 772f7aa27e0e27333ef54bf9dd68641a952b959c     Code head: d797b8b9d0211f32567fa3db65a26d7f4d437715     Tree: 4a9348908d3723b4ad2a9d0f1d9b6ec69bb4feca     Branch: step/step-02-home-save-load-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	data/templates/demo.tileproj/catalogue/slice.json
A	data/templates/demo.tileproj/maps/map_01JDAM00000000000000000001.json
A	data/templates/demo.tileproj/project.json
A	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000001.json
A	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000002.json
A	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000003.json
A	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000004.json
A	data/templates/demo.tileproj/setups/setup_01JDAT00000000000000000005.json
A	data/templates/demo.tileproj/stages/stage_01JDAS00000000000000000001.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000001.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000002.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000003.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000004.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000005.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000006.json
A	data/templates/demo.tileproj/units/unit_01JDAN00000000000000000007.json
A	data/templates/empty.tileproj/catalogue/slice.json
A	data/templates/empty.tileproj/maps/map_01JDEM00000000000000000002.json
A	data/templates/empty.tileproj/project.json
A	data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json
A	src/editor/project/home.ts
A	src/editor/project/save.ts
A	tests/editor/maker-law.test.ts
A	tests/editor/project-home.test.ts
A	tests/tools/maker-build.test.ts
A	tools/maker/app.css
A	tools/maker/build.ts
A	tools/maker/home.ts
A	tools/maker/index.html
A	tools/maker/project-files.ts
A	tools/maker/project.ts
A	tools/maker/store.ts
A	tools/maker/tokens.css

## Green
npm test: 1039/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
N = 3 new tests (project-home, maker-law, maker-build). Floor 1036 + 3 = 1039. Carries A and B moved to step 02b. Line gate on this code head, excluding templates, fixtures and tokens.css, with app.css counted: 377 insertions + 0 deletions = 377.
```
# tests 1039
# pass 1039
# fail 0
# skipped 0
# todo 0
```

## Smoke
sha256 of handoff/steps/tests/s0-play-input/touch-smoke.mjs: d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941 (matches the frozen kit; not edited). Re-run after the play-stage revert:
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

## Shipped tests (sha256, unchanged)
This step ships no frozen test files and lists no test sha256 to copy. The three new tests are written here. Play-stage carries moved to step 02b, so there is no carry test in this step.

## Helpers & self-review (required)
- Helper review (r1): found empty OPFS directories after delete, so Home showed a fake "Newer version" card and Undo duplicated; a missing project.json was badged newer; formatNewer was checked before expectedRev; a failed rename does not roll back earlier renames; the toast was cleared before Undo finished. Fixed the directory drop, the empty-tree skip, "Can't open: project.json missing", rev-then-readOnly, and clearing the toast only after a successful restore.
- QA rework: layout rules moved from uncounted tokens.css into counted tools/maker/app.css. Carries A and B moved to step 02b (play-stage files and touch-play.test.ts match the base; play-stage-carries.test.ts removed).
- Self-review Done when: gates 1039/0 and both check scripts, done. S0 smoke PASS at 390 and 360, done. Model tests (save, rename, duplicate, trash, stale, failed write, rev, v7, corrupt), done. Both templates load with an empty report and ULID paths; demo is byte-equal to the fixture; two new ids differ, done. Greyed Test is disabled, uses --soon, and has no handler, done. Build stamp, collision, cleanup, no-cache, files.json and export audit, done. Carry A and carry B are not in this step; they moved to step 02b. Plants for colour, document literals and empty catch, done. Openable page `node tools/maker/build.ts /tmp/maker-out4` writes `/tmp/maker-out4/maker/index.html` and `maker/701bc957035c/` (JS, tokens.css, app.css, templates); served on 127.0.0.1, done. Look uses style-spec tokens at 390 px; targets are at least 48 px (Test is 56), done. Five light screenshots below, done. QA checklist G1–G10: done (G6 extra file app.css named below; G7 file caps over plan, total 377, named below).

## Decisions & deviations (5–10 lines)
- Base is 772f7aa27e0e27333ef54bf9dd68641a952b959c, not the guide's 9fc49890: same code, plus later docs-only commits. No project index is stored (an extra index key is indexIgnored and would dirty the report). catalogue/slice.json is rewritten only when its text changed. Create and duplicate use asWrites, so they do not bump rev again. Duplicate keeps project.rev and createdAt, sets updatedAt, the new id, the name and copiedFrom. "X copy" then "X copy 2" is not trimmed back to 40.
- A name over 40 code points says "Use 40 characters or fewer" (the spec quotes only the empty-name sentence). Relative time is "just now" under 60s, then "N min ago", "N h ago", "N d ago"; empty or invalid is "Edited unknown". Rows sort by updatedAt descending, empty last, id ascending on a tie. The list type is Row, not Card, because check-law bans Card/Deck names in src. ULID matches tools/effect-designer/ulid.ts (10 time chars, then each of 16 random bytes mod 32), not a packed 80-bit random.
- Layout CSS is tools/maker/app.css (39 lines, counted). tokens.css keeps only the token block through the body font stack and `font: inherit` (lines 1–80) and is still the only colour-literal file. index.html links tokens.css then app.css. build.json is <out>/build.json, same place as the play-stage build, not under maker/. OPFS rename uses FileSystemFileHandle.move when the browser has it, otherwise read, write and remove. JSON.parse of project text also lives in the pure model and the write plan; the only folder-to-ProjectFiles parse is tools/maker/project-files.ts. Nothing in this step sets dirty. Only the latest delete is undoable from the toast. No cache grows with edits.
- Carries A and B moved to step 02b. tools/play-stage and tests/tools/touch-play.test.ts match the base. tests/tools/play-stage-carries.test.ts is not in this step. Maker's own JSON modules still escape U+2028 and U+2029 and do not parse the JSON.
- After a move, empty directories are removed and a folder with no files is not listed, so Undo does not treat the leftover id as taken. A folder with files but no project.json is "Can't open: project.json missing", not "Newer version". Over the plan caps, total 377: tools/maker/build.ts 34/25, tools/maker/store.ts 32/30, tests/editor/project-home.test.ts 46/45, tests/editor/maker-law.test.ts 34/25, tests/tools/maker-build.test.ts 30/15, and tools/maker/app.css 39 (the counted layout file from this rework). A rename that fails after an earlier file has already been renamed can leave those docs new while project.json stays last; the tested failure is the tmp write, which deletes the tmps and leaves every live file unchanged.

## Screenshots
Light theme, 390×844, deviceScaleFactor 1, html data-theme=light. Command: `node tools/maker/build.ts /tmp/maker-out4`. Tree: `/tmp/maker-out4/maker/index.html` (only unstamped file), `/tmp/maker-out4/maker/701bc957035c/` (JS, tokens.css, app.css, templates, templates/files.json), `/tmp/maker-out4/build.json` commit d797b8b9d0211f32567fa3db65a26d7f4d437715. The layout rules moved into app.css without changing them.
- Home with one project: [01-home-one.png](01-home-one.png)
- Home empty: [02-home-empty.png](02-home-empty.png)
- Opened project, greyed Test: [03-project.png](03-project.png)
- Undo toast: [04-undo.png](04-undo.png)
- Trash (Restore, no Empty trash): [05-trash.png](05-trash.png)

## Next step (optional proposal)
- Step 02b takes the play-stage carries (per-load recipe map, frozen RECIPES, U+2028/U+2029 escape). Step 3 can wire the greyed Test button. It is disabled and has no handler in this step.
