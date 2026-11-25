# Hand-back step-10b-effect-data r1
Step file: docs/maker/steps/step-10b-effect-data.md (r2, sha256 8a5ecad2c7bae1848e0465afd73e80f164a649f716c33cffbd27df4705eb771a, 112 lines). DSK D22/D22b/D29: handoff/dsk-rulings/2026-11-17-phase1.md L69 (sha256 90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8, 77 lines). Format r41 sha256 7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e.
Base commit: 0673be7eb7e7ea6cfb8a59a10ff620ed19397abe     Code head: 66aabd543387fa81123d2125f7ac13ce5f680a64     Code head tree: f209da261240e311b7265575b130f862707d0de6     Branch: step/step-10b-effect-data-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. Main was not merged. The r2 guide text is on origin/main 12b31b1fbd73d45a71cbf0022d20a1b95401fa47 and was not committed (not in the Build table). This branch's copy of the step file is the base r1 text (sha256 b38b56ccd19f74387912ac9e2f44e92cce7a07eeaba7aa0554abcf7d4658679a, 110 lines).

## Changed files
```
A	handoff/steps/tests/s10b-effect-data/smoke.mjs
M	src/project/load/read-project.ts
M	src/project/load/types.ts
M	tests/editor/art-upload.test.ts
A	tests/project/effects-slot.test.ts
M	tools/maker/art.ts
M	tools/maker/asset-check.ts
M	tools/play-stage/board.ts
M	tools/play-stage/fx.ts
M	tools/play-stage/load.ts
M	tools/play-stage/project.ts
```
`git diff --shortstat 0673be7eb7e7ea6cfb8a59a10ff620ed19397abe..66aabd543387fa81123d2125f7ac13ce5f680a64 -- . ':!handback/**'` is `11 files changed, 134 insertions(+), 20 deletions(-)`. 134 + 20 = 154. Under 400, and under the caps' sum of 184.

Caps (insertions + deletions, cap in the guide): types.ts 3+3−/6, read-project.ts 8+6−/16, project.ts 7+2−/12, load.ts 1+1−/2, fx.ts 2+2−/6, board.ts 1+1−/2, art.ts 3+3−/6, art-upload.test.ts 1+1−/2, asset-check.ts 1+1−/2, effects-slot.test.ts 60/60, smoke.mjs 47/70. No file is over its cap.

## Green
`npm ci` (135 packages) then `npm run green` on this code head exited 0. Floor 1152. Node's test runner prints `ok`, not `✔`.
```
# tests 1152
# pass 1152
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0. check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L88. `behaviourId` was not moved.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback`) and untracked shots removed. Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. S0 sha `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. s8 sha `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`.
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
- s6c `handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807` — 18 ok, SMOKE PASS. The checkpoint fixture was restored before the later smokes that read it.
- s6d `handoff/steps/tests/s6d-baseline/smoke.mjs . 8808` — 14 ok, SMOKE PASS.
- s7 `handoff/steps/tests/s7-stage-links/smoke.mjs . 8809` — 20 ok, SMOKE PASS.
- s8 `handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1` — 16 ok, SMOKE PASS.
- s9 `handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1` — 12 ok, SMOKE PASS.
- s8c `handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1` — 8 ok, SMOKE PASS.
- s9b `handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1` — 14 ok, SMOKE PASS.
- s9c `handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1` — 6 ok, SMOKE PASS.
- s10b `handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1` — 8 ok, SMOKE PASS (4 at 390 and 4 at 360). Re-run after `drop()` was added; the earlier run of this file failed steps 3 and 4 on a stale match.
Mutations, each file restored before the code commit:
- `types.ts` restored → tests 1–3 fail (pass 3, fail 3).
- `read-project.ts` restored → tests 1–3, 5 and 6 fail (pass 1, fail 5). s10b, on the shipped smoke: step 1 ok at both widths; steps 2–4 fail at both widths. SMOKE FAIL.
```
FAIL 2 saved @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 3 legacy @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 4 missing @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 2 saved @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 3 legacy @360: locator.waitFor: Timeout 15000ms exceeded.
FAIL 4 missing @360: locator.waitFor: Timeout 15000ms exceeded.
SMOKE FAIL
```
- Only the built-in check removed (`if (!builtins.has(bare))` so the warning always pushes) → tests 5 and 6 fail.
- `project.ts` restored → test 3 only (pass 5, fail 1). Dropping only the basic-attack map in `pickFx` → test 3 only.
- `fx.ts` restored → test 3 only (pass 5, fail 1).
- `asset-check.ts` restored → test 4 only (pass 5, fail 1).
- `art.ts` restored → art-upload test 3 fails (pass 5, fail 1).

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing `tools/play-stage/build.ts`, `tools/baseline/build.ts` and `tools/maker/build.ts` (dev false, commit 40 zeros) and was not committed. Files were counted with `readdir` `withFileTypes` and `isFile` only. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` and `__play`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	133 files	grep empty	find empty
baseline	147 files	grep empty	find empty
maker play-stage directory	133 files	grep empty	find empty
```
The loose path filter (any maker-build path containing `play-stage`, the count the trial's script prints) is 146 files, also grep empty. AUDIT PASS. No new built file. `window.__play` is absent from the release trees.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. The new test file, as committed:
```
f669526fd7ad23d769e2772e2561d7458d7f944a46e5f56df5de3e96a252969b  tests/project/effects-slot.test.ts
```
art-upload test 3 was re-pinned to the `uploadTooLarge` row. No other test or smoke was edited. s8 and S0 shas are above.

## Helpers & self-review
- Helper 66d8edff: asked to review Rules 1–7, the caps, and whether tests 1–6 fail when their behaviour is removed. It found one must-fix: Back to maker leaves `window.__docs`, `__play` and `__fx`, so steps 3 and 4 read the previous match. Fixed with `drop()` before those Tests, then s10b was re-run (8 ok, SMOKE PASS). Product Rules 1–7 were already right.
- Helper 6db2d799: asked to review the final diff against r2 Rules 1–8, the caps, the smoke, and the must-not list, and not to edit. Verdict: no must-fix. Caps 154/400, only the 11 build-table files, eslint clean, named tests plus art-upload 12/0. Nits, not changed: `pickFx` does not special-case the token `none` (Rule 4 is `Object.hasOwn`); smoke step 2 folds the deleted id and the non-effect id into one flag.
- Helpers 6f54837c and 8f913177 were leftover from earlier steps. They returned no 10b findings.
- Self-review: Rules 1–8 done. Named tests 1–6 done (slot, legacy and bad ids, deleted skip, unknownRef, built-in and alias, play timing 150 vs 484, asset row). Done-when: green 1152/0 done; tools tsc only the 3 base errors done; 154 ≤ 400 and every cap kept done; all 19 smokes PASS at the guide counts done; mutations recorded done; export audit empty done. QA G1 the six named tests fail when the slot, the answer rule, the play map, the swap, the asset row, or the built-in check is reverted. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface changed (`PlayDocs` gained the optional `fxOf` the guide names; `createPlayFx` gained the optional `pick` the guide names). G5 nothing in src/core, src/sim, src/rules, data, fixtures, or format docs. G6 only the build-table files. G7 154 and each cap kept. G8 no new rAF, timer, or loop. G9 this note. G10 s10b shows a saved effect, a legacy id, and a missing id still opening Test, at 390 and 360. Done.

## Decisions & deviations
- The smoke writes each effect file and the answer to OPFS (`tileengine/projects/<id>/<rel>`) and then `__write`. `beginTest` calls `planSave` with the same file map twice, so a memory-only `__write` is not saved and `readTree` reloads disk.
- `drop()` deletes `__play`, `__docs` and `__fx` before steps 3 and 4. Back to maker does not reload the page, so the previous match would still answer. Step 3 waits until `fxOf` is the legacy id. Step 4 waits until the new docs exist and that key is missing.
- `fxOf` is left off the play docs when it has no keys. A loaded effect id is the only thing that fills it. `none`, a bare preset, the `builtin:effect/` alias, and a missing id play stock. `effectRef` stays `"line-shot"`.
- `builtin:effect/` is stripped only for the preset lookup (15 characters). The stored answer is not rewritten. `unknownRef` detail is the id as stored. Nothing in `effects/` is re-id'd or written back.
- `uploadTooLarge` detail is `JSON.stringify({ w, h, max: MAX_SIDE })`. `MAX_SIDE` is 4096. The sentence is unchanged. `fileName` is the path. The asset-check catch returns one hard `invalidValue` row (`project.json`, `"unreadable"`) and is not an empty catch.
- `board.ts` passes a `pick` that reads `body.fxOf` by the cue's `unitId`. It returns undefined when the unit or `fxOf` is missing. The smoke never casts. Test 3 builds its own pick. `fx.ts` does not import `project.ts`.
- No new dependency, no new code outside the table, no new rAF, timer, or loop. 154 lines. The test file is 60 (the cap; the trial was 52) and the smoke is 47 (the trial was 42). No line was wrapped, split, or joined to fit a cap.
- `/workspace/share/s8/s8-audit.mjs` is not on disk. The check above was reproduced and not committed. Direct counts stay 133 / 147 / 133. The loose maker play-stage filter is 146, grep empty. The r2 guide was read from origin/main and was not added to this branch.

## Next step
- Not this step: 10c (the Effect row and effect Duplicate) and 10d (the built-ins picker and library). Format docs were not edited. No baseline republish: the baseline projects have no `effects/` docs. The builder does not publish.
