# Hand-back step-11a2-ready-sheet r1
Step file: docs/maker/steps/step-11a2-ready-sheet.md (r4, sha256 10e409e05d1a11ecbda57b9ff80fa3eb16f9607de07ad7ef618b36be241cc503, 143 lines). The guide is not in this branch: it is docs-only on main after the base. QA review of the guide: docs/qa/step-11a2-r3-guide-review.md (sha256 f83b43ac309b4450). UX cell: roadmap docs/maker/roadmap.md at 90c9cb9f, sha256 5f0e95ba6fc9ea8eb3ff140934e4dcc676f1497ad2c00b4fc0088798b4032cf0, L86. DSK E5(d): handoff/dsk-rulings/2026-11-26-step11.md (sha256 b73763e657c283fbfda23eb6017edfbb3a845d0e4f0f301c6590ddba3b0799df).
Base commit: 1b34e5418efe65b8a1ffb09c29cd58b175ef1819     Code head: b7f6e5007b7c28f6de6b07e5e1399f26a22c8c1a     Code head tree: 28e1aafb093f323814607d9253ed78b991e4f3f3     Branch: step/step-11a2-ready-sheet-r1-chatA     PR: opened by Chief of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged and was not pushed. The builder does not publish.

## Changed files
```
A	handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
M	tests/tools/export-11a.test.ts
A	tests/tools/sheet-11a2.test.ts
M	tools/export/game.ts
M	tools/maker/build-sheet.ts
M	tools/maker/home.ts
```
`git diff --shortstat 1b34e5418efe65b8a1ffb09c29cd58b175ef1819..b7f6e5007b7c28f6de6b07e5e1399f26a22c8c1a -- . ':!handback/**'` is `6 files changed, 127 insertions(+), 15 deletions(-)`. 127 + 15 = 142. Under 400.

Caps (insertions + deletions against the base): build-sheet.ts 9/14, home.ts 33+6−/40, tools/export/game.ts 9+7−/20, export-11a.test.ts 2+2−/4, sheet-11a2.test.ts 15/20, smoke.mjs 59/60. No build-table file is over its cap. Nothing outside the build table was edited. export-11a.test.ts changes only the test 3 name and the banner regex.

## Green
`npm ci` (135 packages; lockfile unchanged) then `npm run green` on the code-head tree exited 0. Floor 1165 + 2 = 1167. Node's test runner prints `ok`, not `✔`.
```
# tests 1167
# pass 1167
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 179 modules, 506 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L91 (that line did not move).

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and `git clean -fd -- handback`). Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. `CHROME` was set for the suite. No retry was needed (s3 and s8c passed on the first solo run). s6c's checkpoint fixture lives under `handback` and was restored with it before s6d, s8c and s9c.
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
- s11a2 `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1` — 6 ok (3 at 390 and 3 at 360), SMOKE PASS.
Mutations, each restored before the code commit (`/tmp/s11a2-mutate.mjs`, in-memory snapshots, not `git checkout`). After the last restore the 11a and 11a2 tests passed and `git diff --stat` matched the code commit.
- M16 Share always shown: caught (test 1; smoke 1 shows Share, then 2 and 3 time out).
- M17 error sheet without Try again: caught (test 2; smoke 2 times out on Try again).
- M20 ready sheet never opens: caught (smoke 2–3, SMOKE FAIL).
- M21 error sheet never opens: caught (11a test 3; smoke 2–3, SMOKE FAIL).
- M22 `share()` handed no file: caught (smoke 2 times out waiting for the zip name, smoke 3 fails).
- M23 ready text says unzip: caught (test 1; smoke 1 shows the word unzip).
- M24 a dismissed share (`AbortError`) opens the error sheet: caught (smoke 3, both widths, SMOKE FAIL).
- M25 a refused share swallowed: caught (smoke 3, both widths, SMOKE FAIL).
- M31 `built = null;` removed from `buildNow`: caught by smoke 2 (the 1 s check), 3 runs of 3, SMOKE FAIL each time.
- M26 `forgetBuild` keeps the zip: survived, by design (EA ruling 6). Tests pass, s11a2 SMOKE PASS.
- M27 opening a project keeps the build: survived, by design (EA ruling 6). Tests pass, s11a2 SMOKE PASS.
- M28 `markPage` names another module: caught (11a gameZip, # fail 1; s11a 2–3, SMOKE FAIL).
- M29 the module zipped under another name: caught (11a tests, # fail 3; s11a SMOKE FAIL).
- M30 a missing `build.json` read as `""` again: survived, equivalent (the commit regex then fails and the same `Can't build: build.json` throws). Tests pass.

## Export audit
Written and run as `/tmp/s11a2-audit.mjs` (not committed). Three builders, commit `"0".repeat(40)`, dev false: `tools/play-stage/build.ts` `build(out, commit, root, false)` all files; `tools/baseline/build.ts` `build(out, commit, root)` all files; `tools/maker/build.ts` `build(out, commit, root, false)` only paths that start with `play/` or contain `play-stage`. Walk: no file name matching `tools/maker`, `src/editor`, `catalogue.json.js` or `behaviours.json`, and no file content matching `tools/maker`, `src/editor`, `tileengine/saves` or `session-save`.
```
play	135 files	hits 0
baseline	149 files	hits 0
maker	149 files	hits 0
135 / 149 / 149
AUDIT PASS
```
11a2 adds no play file. Same counts as the base.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. As committed:
```
c23f39193095c76b787c85e9d29ae8e9f3ca64d13de2426a665a2aa2d13ac5bb  tests/tools/sheet-11a2.test.ts
412a00d263c93327091e0c0ca3ad06e68abf8c7a3e0ef45501fa4f8bc9971c4f  tests/tools/export-11a.test.ts
21a3d99d613a77f79a273e305e99aec36f05a2204e5b88dbe85745339dafba83  handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
```
The new test is 15 lines. The new smoke is 59 lines. No other test or smoke was edited.

## Helpers & self-review
- Helper eab48dd4: asked to review the uncommitted diff against Rules 1–5, the caps, and the must-not list, and not to edit. Verdict: PASS. The six build-table files only, esc literals, `built = null` before the busy paint, FILES and the sorted zip path, the two export-11a edits, the sheet-test titles, and the smoke order (download listener, then the 1 s sheet-gone / Building check, then the download; scrim-first tap; AbortError vs NotAllowedError). It changed nothing.
- `/tmp/s11a2-allsmoke.sh` (not committed): ran the 23 smokes solo, set `CHROME`, restored `handback` after each. `SUITE_FAIL=0`. No retry.
- `/tmp/s11a2-audit.mjs` (not committed): the export audit above. AUDIT PASS. Not a product file.
- `/tmp/s11a2-mutate.mjs` (not committed): applied each mutation above and restored the file from an in-memory snapshot. `MUTATIONS DONE`. Restored tests passed. An earlier draft of this script used `git checkout`, which put `build-sheet.ts` back to the base; that file was rewritten to the reviewed source and the sheet tests were re-run before this successful pass. The script was not committed.
- Self-review: Rules 1–5 done. Named tests 1–2 done (ready sheet names the file in UX's words, Share only when share is true, Done, no unzip or index.html, `buildSheet(null)` is empty; error sheet title, escaped reason `Can&#39;t build: &lt;build.json&gt;`, Try again pinned as `data-act="build">Try again`). 11a tests 1–5 still pass, including the moved banner pin. Done-when: green 1167/0 done; tools tsc only the 3 base errors done; 142 ≤ 400 done; every cap kept done; all 23 smokes PASS at the guide counts, no retry, done; mutations recorded done; export audit 135/149/149 done. QA G1 the plants above fail when the matching behaviour is reverted. G2 root typecheck exit 0. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in src/, tools/play-stage, tools/maker/export.ts, tools/export/zip.ts, tools/maker/app.css, tools/apk, data, fixtures or the format docs. G6 no new dependency. G7 142 counted lines. G8 lint, deps, check:state and check:law exit 0. G9 the decisions below match the diff. G10 no token in the repo, no main push, no tag, no PR.

## Decisions & deviations
- The sheet title is not escaped, so Couldn't stays a raw apostrophe and the tests can match it. The file name and the error reason go through `esc`. The five replacements are the literal entities, not `String.fromCharCode`.
- Sheet buttons carry `type="button"`, the same as the other maker sheets. The guide's sketch did not spell that attribute. It does not add CSS.
- `download` still uses the base's second body line (href, `file.name`, click, revoke). The caller builds the `File` with type `application/zip`. The first line is one `const` for the object URL and the anchor, which is what is left of the base line once the `File` moved out. No new statement was joined onto that revoke line.
- `let built` and `let builtFile` sit after the `behaviourId` line, so the known tools-tsc error stays at home.ts L91. `paint` closes over those lets. `built = null` is its own line immediately before the busy paint.
- If `navigator.share` is missing, `shareBuild` throws `Couldn't share your game.` inside the try, so the error sheet opens. Only an `AbortError` returns without painting. Any other rejection uses the error's message, or that same fallback when the message is empty.
- The smoke's `tap` looks inside an open scrim first. Try again and Build game share `data-act="build"`, and the first match on the page is the covered Build game button. The rest of the tap is the s10c layout. Port 8822. `hold` delays or 404s only `play-stage/.../build.json`.
- Share is rendered only when `navigator.canShare?.({ files: [builtFile] }) === true`. Done calls `forgetBuild`, which drops the zip. Opening a project calls `forgetBuild` from `run`, not from inside `openId`.
- Counted size is 142. home.ts is 39/40, the smoke is 59/60, and export-11a.test.ts is 4/4. No line was wrapped, split or joined to fit a cap. Zip bytes and order are unchanged (11a tests 1–4 and s11a).

## Next step
- 11b is the debug APK. It bases on the 11a2 merge. No publish is part of 11a2.
