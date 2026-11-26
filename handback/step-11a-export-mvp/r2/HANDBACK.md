# Hand-back step-11a-export-mvp r2
Step file: docs/maker/steps/step-11a-export-mvp.md (r2, sha256 d44951f205c6294133a99f73526d9d184c4274722a8d120060f19b6ac4e7b39e, 142 lines). DSK E5–E7: handoff/dsk-rulings/2026-11-26-step11.md (sha256 b73763e657c283fbfda23eb6017edfbb3a845d0e4f0f301c6590ddba3b0799df). Format r41 sha256 7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e L283, L296, L298, L1392–1425, L1551. The ready and error sheets are 11a2. The APK is 11b.
Base commit: 7460ed7ac17748f6a22a9ebda13946ee276d2565     Code head: 8e3a697b97d073a0c1e8ad4fa308659c608d3e9f     Code head tree: 4e4d5b43a092a69e242b523f0086a551f8dd3c14     Branch: step/step-11a-export-mvp-r2-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. The guide's trial base 90c9cb9fa2ab932b9db07d4a3e3ff01233fae269 stands: 90c9cb9f..7460ed7 is docs only, including this guide r2. 10d tip 07f12d8d878c7af6ce62be321728ec578e0afc39 is an ancestor of the base. Main was not merged and was not pushed. The builder does not publish.

## Changed files
```
A	handoff/steps/tests/s11a-export-mvp/smoke.mjs
A	tests/tools/export-11a.test.ts
A	tools/export/game.ts
A	tools/export/zip.ts
M	tools/maker/app.css
A	tools/maker/build-sheet.ts
A	tools/maker/export.ts
M	tools/maker/home.ts
A	tools/play-stage/game.ts
M	tools/play-stage/page.ts
```
`git diff --shortstat 7460ed7ac17748f6a22a9ebda13946ee276d2565..8e3a697b97d073a0c1e8ad4fa308659c608d3e9f -- . ':!handback/**'` is `10 files changed, 385 insertions(+), 5 deletions(-)`. 385 + 5 = 390. Under 400.

Caps (insertions + deletions against the base; new files are their line counts): zip.ts 66/66, game.ts 27/36, play-stage/game.ts 2/4, page.ts 27+2−/31, maker/export.ts 47/47, home.ts 22+3−/34, build-sheet.ts 5/8, app.css 1/1, export-11a.test.ts 130/130, smoke.mjs 58/58. No build-table file is over its cap. Nothing outside the build table was edited.

## Green
`npm ci` (135 packages; lockfile unchanged) then `npm run green` on the code-head tree exited 0. Floor 1160 + 5 = 1165. Node's test runner prints `ok`, not `✔`. The first green run died at root `tsc` on `as BufferSource` in `tools/export/game.ts` (the tools tsconfig has that DOM name; the root tsconfig, which typechecks this file through the new test, does not). The digest now takes `data.slice()` and that run was discarded. The counts below are the completed re-run.
```
# tests 1165
# pass 1165
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 179 modules, 506 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L91.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and `git clean -fd -- handback`). Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. `CHROME` was set for the suite. No retry was needed (s3 and s8c passed on the first solo run). s6c's checkpoint fixture was restored before s6d, s8c and s9c.
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
- s11a `handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS.
Mutations, each restored before the code commit (`/tmp/s11a-mutate.mjs`). After the last restore the five 11a tests passed 5/0 and `git diff --stat` matched the code commit. M16, M17 and M20–M23 are 11a2.
- M1 the `data-game` boot skipped → s11a SMOKE FAIL.
- M2 `shipped` keeps everything → tests 2 and 4 fail. # fail 2.
- M3 `markPage` returns the page as is → test 2 fail and s11a SMOKE FAIL. # fail 1.
- M4 Test's gate dropped → test 3 fail. # fail 1.
- M5 the Build game button's act renamed → test 5 fail and s11a SMOKE FAIL. # fail 1.
- M6 a wrong CRC polynomial → test 1 fail. # fail 1.
- M7 `.deleted` kept out only under `effects/` → test 2 fail. # fail 1.
- M8 `safe()` back (U+2028 escaped) → test 4 fail. # fail 1.
- M9 non-JSON text shipped → test 2 fail. # fail 1.
- M10 `if (state.dirty) return;` removed → test 3 fail. # fail 1.
- M11 the `emptyBoard` refusal dropped → test 3 fail. # fail 1.
- M12 a null `readBlob` skipped → test 3 fail. # fail 1.
- M13 the `/maker/` check dropped → test 3 fail. # fail 1.
- M14 the `build.json` shape check dropped → test 3 fail. # fail 1.
- M15 a file writer (`tools/maker/store.ts`) imported into the play page → the 11a test file failed at file level and P2 failed (`play-stage does not import maker`). # fail 2.
- M18 a `.deleted/` picture zipped → test 2 fail. # fail 1.
- M19 the interim banner line dropped → test 3 fail. # fail 1.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by `/tmp/s11a-audit.mjs` (not committed) importing `tools/play-stage/build.ts`, `tools/baseline/build.ts` and `tools/maker/build.ts` (dev false, commit 40 zeros). Files were counted with `readdir` `withFileTypes` and `isFile` only. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` and `__play`, and a name check for `catalogue.json.js` / `behaviours.json`:
```
play	135 files	grep empty	find empty
baseline	149 files	grep empty	find empty
maker play-stage directory	135 files	grep empty	find empty
loose play-stage	149 files	grep empty	find empty
135 / 149 / 149
AUDIT PASS
```
The guide's three-number quote is 135 / 149 / 149. One more file in each play tree than 10d: `tools/play-stage/game.js`. The loose maker count is 149 because that file is also copied into the maker stamp (`home.ts` imports `page.ts`, which imports `game.ts`). `window.__play` is absent from the release trees. Re-run on the restored tree after the mutations, before the code commit.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. The new test file, as committed:
```
4ef7cd7d95f595a1bd0ed193c3834db4d147ca6ceebfa9b0b9afc764a5c392a5  tests/tools/export-11a.test.ts
```
No other test was edited. s11a is the only smoke edited. The new test is 130 lines. The new smoke is 58 lines.
```
4f5c47ca1e9c2a090a065f476d4f9af956ab842c7ddbc8e9c95388789cd7927f  handoff/steps/tests/s11a-export-mvp/smoke.mjs
```

## Helpers & self-review
- Helper 6f54837c (still running at the start of this turn, from before the 11a implementation): asked earlier to review an s8c smoke. Output was an unfinished note on plate and readout. It changed nothing in this step.
- Helper 8f913177 (same): asked earlier to review a Step 10a diff. Output stopped after reading the guide and a stat. It changed nothing in this step.
- Helper ef4c485e: asked to check the uncommitted 11a diff against the build-table caps, JSON.parse, play-stage imports, the home.ts L91 error, and the five test titles, and not to edit. Verdict: no cap breach. Total 385+5=390. Diff is only the 10 build-table files. No JSON.parse in tools/play-stage or tools/maker except the existing `project-files.ts` line. page.ts and game.ts do not import tools/maker, tools/export or src/editor. behaviourId is still home.ts L91. All five titles match the guide.
- Helper 27290037: asked to review the same uncommitted tree against Rules 1–7 and the must-not list, and not to edit. It was still running with no report after 11 minutes and was stopped. No finding, no edit.
- `/tmp/s11a-allsmoke.sh` (not committed): ran the 22 smokes solo, set `CHROME`, restored `handback` after each. `SUITE_FAIL=0`. No retry.
- `/tmp/s11a-mutate.mjs` (not committed): applied each mutation above, restored the file, and printed CAUGHT for all 17. `MUTATIONS CAUGHT`.
- `/tmp/s11a-audit.mjs` (not committed): the export audit above. AUDIT PASS. Not a product file.
- Self-review: Rules 1–7 done. Named tests 1–5 done (stored zip and zlib CRC; deleted, notes, sprite-recipes, non-JSON and a deleted picture stay out; ours() and the APK www checks; Test's gate including a missing picture, a newer format and an empty board; null readBlob, bad build.json and a page not under /maker/ throw; save-stop and the banner are pinned on home.ts; verbatim U+2028 and a v4 map play the same as Test; the button is the full-width secondary with the busy spinner). Done-when: green 1165/0 done; tools tsc only the 3 base errors done; 390 ≤ 400 done; every cap kept done; all 22 smokes PASS at the guide counts, no retry, done; mutations recorded done; export audit 135/149/149 done. QA G1 the plants above fail when the matching behaviour is reverted. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in src/core, src/sim, src/rules, tools/effect-designer, tools/apk, tools/baseline, data, fixtures or the format docs. G6 no new dependency. G7 390 counted lines. G8 lint, deps, check:state and check:law exit 0. G9 the decisions below match the diff. G10 no token, no main push, no tag, no PR.

## Decisions & deviations
- `filesModule` puts each saved document in as the raw text. Only the path is `JSON.stringify`'d. There is no `safe()` and no U+2028/U+2029 escape (DSK E7). A v4 map ships verbatim and is read up in memory by the existing `load/migrate.js`.
- `build.json` commit and node are taken with the same pretty-print shape `ours()` already checks. The maker does not add a second `JSON.parse`. `isTree` then requires commit and node to be strings and `files` to be an object of strings. The written file has only those keys plus `entry`.
- `sha256` hashes `data.slice()`, a copy of that view only. Naming `BufferSource` does not typecheck in the root program. `slice()` typechecks in both programs. No cast was added.
- `zip.ts` `concat` updates the write offset with one expression statement, `(out.set(p, at), p.length)`. A second statement would make the file 67 lines. The CRC polynomial is `0xedb88320`. Headers are lists of `[offset, bits, value]`.
- `home.ts` and `page.ts` stay in those files' dense style. The two new imports sit above the old line 89, so the known `behaviourId` error stays at L91. `buildNow` saves, returns while `state.dirty` is still set, then shows the disabled Building… button. A refusal sets `state.problems`. A throw sets `state.banner` to the plain message. No sheet and no Share.
- The spinner is one `.spin` rule and its `@keyframes` on that same CSS line. The busy label uses U+2026. `playBase` maps the first `/maker/<stamp>/` to `/play-stage/<stamp>/` and throws `Can't build: /maker/` when `/maker/` is absent.
- A listed asset whose name is `.deleted` is skipped (`list` is one level). `gameZip` also drops any asset key that has a `.deleted` segment. A listed name whose `readBlob` is null throws `Can't build: assets/<name>`.
- `tools/play-stage/game.ts` exports `PROJECT` and `FILES`. The page reads `data-game` from the board and uses `PROJECT` for pictures. `FILES` is the module path the page attribute names; nothing else imports it. Lint does not flag the export.
- Counted size is 390. Five files sit on their cap (zip.ts, maker/export.ts, app.css, the test, the smoke). No file was wrapped or split to get under a cap.

## Next step
- 11a2 replaces the banner interim with the ready sheet and the couldn't-build sheet. 11b wraps this zip as a debug APK. Neither is in this commit.
