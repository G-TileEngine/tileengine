# Hand-back step-10c-effect-editor r1
Step file: docs/maker/steps/step-10c-effect-editor.md (r2, sha256 5702669dae880fbd1ab45ffe487aabc48178f3723b978010de8c3b9826174593, 110 lines). DSK D22/D22b/D29: handoff/dsk-rulings/2026-11-17-phase1.md L69 (sha256 90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8, 77 lines). DSK r42 effectNotRule is quoted in the guide. Format r41 sha256 7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e §6.7.
Base commit: 76fd750256e5342f3e6ff691b73b261fd62f3661     Code head: 780eb650f015beceb9dce5da2e73d49c9e448ca1     Code head tree: 585d1d0cf5e0fb21f587906e71d4d7b0438b75d6     Branch: step/step-10c-effect-editor-r1-chatA     PR: none yet; CoS opens it
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. The earlier code commit on this branch is 1fcb138d378667b04573faf910badc5c9c1eacba (tree c377cca8db0d68c82f829814d6f226c1b7428a99). The fix commit is 2d2e4064a1ce280af2f11eefa2d48b7b5be91566. The line-split commit is the code head of this hand-back: 780eb650f015beceb9dce5da2e73d49c9e448ca1 (tree 585d1d0cf5e0fb21f587906e71d4d7b0438b75d6). The tip sha and tip tree of this docs commit are quoted in the hand-back message, not written here. Main was not merged. The r2 guide is already on the base (blob from 12b31b1) and was not edited. 10a and 10b are merged as 10ab12d629af2604e7ed828d134eff8aafd9caf7 (PR #104); the go-line base is the later docs commit 76fd7502.

## Changed files
```
A	handoff/steps/tests/s10c-effect-editor/smoke.mjs
A	src/editor/effect/list.ts
M	src/project/load/read-project.ts
A	tests/editor/effects-10c.test.ts
M	tools/maker/ability-panel.ts
M	tools/maker/asset-check.ts
A	tools/maker/effects.ts
M	tools/maker/home.ts
```
`git diff --shortstat 76fd750256e5342f3e6ff691b73b261fd62f3661..780eb650f015beceb9dce5da2e73d49c9e448ca1 -- . ':!handback/**'` is `8 files changed, 316 insertions(+), 13 deletions(-)`. 316 + 13 = 329. Under 400. Code head 2d2e406 was 314 + 13 = 327. The two added insertions are the two statement splits and nothing else.

Caps (insertions + deletions): read-project.ts 9+6−/20, list.ts 52/60, effects.ts 90/90, ability-panel.ts 4+1−/10, home.ts 12+5−/24, effects-10c.test.ts 92/92, smoke.mjs 56/70. `asset-check.ts` is not in the build table: 1+1−. EA ruling 2026-11-26: "the cap for tests/editor/effects-10c.test.ts rises from 90 to 92, only so the two joined lines (`type Obj`+`isObj`, `steps`+`hist`) can be split into one statement per line, as guide L65 requires. No other change: effects.ts stays at 90, every other cap stays as written, and the 400 hard gate stays." No build-table file is over its cap.

## Green
`npm ci` (135 packages; lockfile unchanged) then `npm run green` on code head 780eb650f015beceb9dce5da2e73d49c9e448ca1 exited 0. Floor 1152 + 5 = 1157. Node's test runner prints `ok`, not `✔`. Re-run after the two-line split.
```
# tests 1157
# pass 1157
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 177 modules, 503 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L89. Re-checked after the split: still only those 3. `behaviourId` was not moved. Root `tsc --noEmit -p tsconfig.json` exits 0.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback`) and untracked shots removed. Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. `CHROME` was set for those two. S0 sha `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. s8 sha `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`. No retry was needed (s3 step 9 and s8c steps 1–3 passed on the first solo run). s6c's checkpoint fixture was restored before s6d, s8c and s9c. The other 19 were re-run after the s10c fix, still first try, same counts.
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
- s10c `handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1` — 8 ok, SMOKE PASS (4 at 390 and 4 at 360). After the fix it was run solo five times in a row, 8 ok every time, no retry:
```
run 1 SMOKE PASS
run 2 SMOKE PASS
run 3 SMOKE PASS
run 4 SMOKE PASS
run 5 SMOKE PASS
```
After the two-line split, s10c was run solo once on port 8816: 8 ok (4 at 390 and 4 at 360), SMOKE PASS, no retry.
CoS (Node v24) saw 6/2 then 4/4: the timeout was `tap a:test:` after `a:shut`, with the ability panel still open (Test exists only on the closed list) and, at 390, a unit Rename sheet open. Cause: `a:fx` saves, then `paint()` replaces `#app` and the unit `.body` scroll returns to the top. The old `tap` had already measured `a:shut`. The touch then hit `u:rename` (the first control in the unit body at 390), so `a:shut` never ran and step 4 failed because step 3 did. The smoke now waits until the shake answer is pressed, lets the bogus `a:fx` id paint, and only then taps `a:shut` when that button is the element under its own centre and no scrim is up. It waits until `a:shut` is gone, no scrim (no Rename sheet), and `a:test:` is in the DOM, then taps Test. Timeouts were not lengthened. No app file in the build table needed a change.
Mutations, each file restored before the first code commit (named tests via `node --test`; the shipped files were byte-compared back and the five named tests passed 5/0):
- `read-project.ts` restored → test 4 (pass 0, fail 1, AssertionError).
- The pointer cut back to the doc path (`path.split("#")[0]`) → test 4 (pass 0, fail 1, AssertionError).
- `ability-panel.ts` restored → test 5 (pass 0, fail 1, AssertionError).
- The `a:fx:` `effectRows` check removed → test 5 (pass 0, fail 1, AssertionError) and s10c steps 3–4 at both widths. Steps 1–2 stayed ok.
```
FAIL 3 row and test @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 4 dup delete undo @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 3 row and test @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 4 dup delete undo @360: locator.waitFor: Timeout 15000ms exceeded.
SMOKE FAIL
```
- `home.ts` restored → s10c steps 1–4 at both widths.
```
FAIL 1 empty @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 2 new shake @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 3 row and test @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 4 dup delete undo @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 1 empty @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 2 new shake @360: locator.waitFor: Timeout 15000ms exceeded.
FAIL 3 row and test @360: locator.waitFor: Timeout 15000ms exceeded.
FAIL 4 dup delete undo @360: locator.waitFor: Timeout 15000ms exceeded.
SMOKE FAIL
```
- Duplicate without `copiedFrom` → test 1 (pass 0, fail 1, AssertionError).
- List left unsorted → test 1 (pass 0, fail 1, AssertionError).
- New without the seed step → tests 1 and 2 (pass 0, fail 2, AssertionError).
- Edit that skips the writer → tests 2 and 5 (pass 0, fail 2, AssertionError).
- The `FX_KNOBS` guard removed → test 2 (pass 0, fail 1, AssertionError).
- `toNone` ignored → test 3 (pass 0, fail 1, AssertionError).
- Gone files not removed (`store.remove` dropped) → test 5 (pass 0, fail 1, AssertionError).
- Undo that doesn't remove the trash → test 5 (pass 0, fail 1, AssertionError).

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing `tools/play-stage/build.ts`, `tools/baseline/build.ts` and `tools/maker/build.ts` (dev false, commit 40 zeros) and was not committed. Files were counted with `readdir` `withFileTypes` and `isFile` only. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` and `__play`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	133 files	grep empty	find empty
baseline	147 files	grep empty	find empty
maker play-stage directory	133 files	grep empty	find empty
loose play-stage	146 files	grep empty	find empty
AUDIT PASS
```
Re-run after the line split, on the same tree: the same four counts, grep empty, find empty, AUDIT PASS. No new built file. `window.__play` is absent from the release trees.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. The new test file, as committed:
```
b1f6beb41949a76819ef744b4edc349d8f625005c81ce9466f1cd1c924457bff  tests/editor/effects-10c.test.ts
```
No other test was edited. s10c is the only smoke edited. s8 and S0 shas are above. The sha changed only because `type Obj` / `isObj` and `steps` / `hist` are each one statement on their own line.

## Helpers & self-review
- Helper 8ac2d3eb: asked to review Rules 1–7, the caps, the must-not list, and the effectNotRule pointer, and not to edit. Verdict: no must-fix. Nits left on purpose (caps were already tight): `a:fx:` does not re-check `aimKind` (the row is hidden when `aimKind` is undefined); the sheet mode is set before the save resolves; the one-ability delete warning still says "they'll".
- Helper 5cd4eb8e: asked to review the named tests and the smoke against every mutation in the guide, and not to edit. Verdict: no must-fix. The mutations above were then run and each failed the test the guide names.
- A sheet and toggle lookup that used `path.startsWith("effects/")` could also match `effects/.deleted/`. Both lines now require no further slash after `effects/`. That change is in the code head. Green was re-run after it (1157/0).
- Helper 0aeada01: asked to check the s10c race against `paint`, `a:shut`, and `u:rename`, and not to edit. Verdict: no must-fix. The waits close the in-flight paint. A later paint between the hit-test and the touch is not in flight here. Do not preserve scroll in `paint()`.
- Helper 32888914: asked to check the caps, the two joins, and the `asset-check.ts` carry, and not to edit. Verdict: leaving the joins was the correct stop against the caps as then written (91 and 92 would have been over). The carry is behavior-preserving. Running total then 327. Law 12 and the migrated hard row still pass.
- Helper 97b9c27e: asked to review the uncommitted two-line split against the raised cap and not to edit. Verdict: PASS. Only `type Obj` / `isObj` and `steps` / `hist` moved onto their own lines. Statement text unchanged. `effects.ts` stayed 90 and out of the diff. Shortstat 316 + 13 = 329. No other hunk.
- Self-review: Rules 1–7 done. Named tests 1–5 done (sort and users, stamp, duplicate `copiedFrom` / rev 1 / empty changes / " copy", writer rev and play shake 2, reset, picture and bad names, delete to `.deleted/` with unknownRef and stock ingest, toNone, effectNotRule at the four full pointers plus a missing id as brokenRef, maker New / slider / delete / undo, Effect row None plus saved, unknown `a:fx` writes nothing). Done-when: green 1157/0 done; tools tsc only the 3 base errors at page.ts L101 and home.ts L89 done; 329 ≤ 400 done; effects.ts stays 90/90; the test file is 92/92 under the EA ruling; every other cap kept done; all 20 smokes PASS at the guide counts done; s10c 5/5 after the fix done; s10c solo 8 ok after the split done; mutations recorded done; export audit empty done. QA G1 the plants above fail when the matching behaviour is reverted. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in src/core, src/sim, src/rules, tools/play-stage, tools/effect-designer, data, fixtures, or format docs. G6 the build-table files plus `asset-check.ts`, the one line the fix go-line named. G7 329, test cap 92 by the ruling, effects.ts 90, every other cap kept. G8 no new rAF, timer, or loop. G9 this note. G10 s10c shows an empty list, a new effect with shake 2, Test playing it, then Duplicate, delete-to-none, and Undo, at 390 and 360, five times. Done.

## Decisions & deviations
- The name field is `data-fxname` (the guide spelling) and saves on `change`, not `input`. `applyBag` rebuilds the text map instead of `delete`, because eslint `@typescript-eslint/no-dynamic-delete` rejects that. Same line count.
- `effects.ts` still inlines the prefix-plus-1 id function at the three writer calls and stays 90/90. QA accepts that. Putting `mint` back would be 91 against a cap of 90, so it stays inlined. The earlier stop (the test file still sharing `type Obj` with `isObj`, and `steps` with `hist`) was against the old cap of 90. EA ruling 2026-11-26, quoted in Changed files, raises only that file's cap to 92 so those two lines can be one statement each. They are split in the code head. No other line in that file was touched, and no other file changed in the line-split commit. Total 316 insertions + 13 deletions = 329. The five titles and their asserts are the guide's.
- `effectNotRule` uses the full pointer `brokenRef` would use (`stages/<id>.json#/rules/<i>`, and the same shape for project rules, unit setupIds, and neutral setupIds). Detail is the id. An id that is not an own key of `effects` still goes to `has`.
- Duplicate's history op is `{seq: 1, at, kind: "set", changes: [], note: "duplicate"}` (EA ruling). `copiedFrom` is `{setupId, rev, at}` of the original. The name uses `copyName` (" copy" / " copy 2"). A source or new id that is not `effect_<ULID>` returns null. Undo is one deep (`stack = [host.files]`, not pushed), so undoing a delete restores the live file and the answer and leaves the copy.
- Gone paths stay in the `planSave` plan with their old text, then `store.remove` after `commitWrites`. `planSave` would otherwise write `""`. Effects docs already have the writer rev; `planSave` does not bump effect rev (its doc regex is maps, stages, units, setups). Setups still get that extra bump.
- The smoke's step 3 still dispatches a synthetic `a:fx:` id that is not in `effectRows` (`dispatchEvent`, so it does not focus or scroll), then waits for that paint before `a:shut`. `LINE` is the setup id `setup_01JDAT00000000000000000005`, not the path. New project stays on the project screen. `u:back` runs before the menu because Back to maker leaves the unit editor open. `tap` refuses a control that is not the element under its own centre, and it refuses a control outside an open scrim.
- `tools/maker/asset-check.ts` drops the dead `let docs = files`. `docs` is assigned only from `migrateProject(files).files`. A throw still returns the one hard `invalidValue` row and never reads `docs`. Success still uses the migrated clone. 1+1−. The Law 12 test and the migrated hard-asset row still pass.
- Sheet and toggle skip any `effects/` path with another slash, so `effects/.deleted/` is not painted. The one-ability warning still says "they'll" (one sentence for 1 and for N). `a:fx:` does not re-check `aimKind`. No new dependency, CSS, rAF, timer, or loop. The toast is the existing 6s "Changed · Undo" / "Deleted · Undo". 329 lines. The audit script was not committed.

## Next step
- Not this step: 10d (the built-in effect library and the Effect row's built-in buttons). Format docs were not edited. No baseline republish: audit counts are unchanged (133 / 147 / 133, loose 146). The builder does not publish.
