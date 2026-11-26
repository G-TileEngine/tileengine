# Hand-back step-10d-builtin-effects r1
Step file: docs/maker/steps/step-10d-builtin-effects.md (r2, sha256 96e9e894ce850f7388c14f8cfacebec7e0f978afe6e3beab33b5d76fc2d46e0b, 112 lines). DSK D22/D22b/D29: handoff/dsk-rulings/2026-11-17-phase1.md L69 (sha256 90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8, 77 lines). DSK r42 (DSK to EA): none, then an effect doc id, then a bare BTF id from the slice's effect presets, else unknownRef; builtin:effect/<id> is accepted and never rewritten; writers write bare ids. Format r41 sha256 7d89c4f41bf45cd6d24927a63896fcad4a098fba49ce313115e023da0a88b06e §4 L385 and L1402. Setup-format r30 sha256 9692917753a0823b3865cd5c958b59435a289ca78f0367cb1f9b990fb5f6a9b6 L362 and L454.
Base commit: ef25669ab76a53cabb69196d05709c79a17b44ff     Code head: d0230b29fa28b1635b9104128bc4a579f5e1d54a     Code head tree: f893ebc3a7e227d4cf2a7b23ef4e58c3c127221b     Branch: step/step-10d-builtin-effects-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the docs-only tip. Its sha and tree are quoted in the hand-back message. The code head is the parent of this commit. No product file changes after the code head. The guide's trial base 08d5b2dc stands: 08d5b2dc..ef25669 is docs only, including this guide r2. 10c merged as 699bdb83 (tree d718df66). The paste commit de22e8af (docs only, placeholder token, not a product file) is the parent of the code head and was not recommitted. Main was not merged. The builder does not publish.

## Changed files
```
A	docs/maker/steps/step-10d-paste.md
A	handoff/steps/tests/s10d-builtin-effects/smoke.mjs
A	src/editor/effect/builtins.ts
A	src/project/builtin-fx.ts
A	tests/editor/effects-10d.test.ts
M	tests/project/effects-slot.test.ts
M	tools/maker/ability-panel.ts
M	tools/play-stage/board.ts
M	tools/play-stage/fx.ts
M	tools/play-stage/load.ts
M	tools/play-stage/project.ts
```
`git diff --shortstat ef25669ab76a53cabb69196d05709c79a17b44ff..d0230b29fa28b1635b9104128bc4a579f5e1d54a -- . ':!handback/**'` is `11 files changed, 264 insertions(+), 12 deletions(-)`. 264 + 12 = 276. Under 400. The paste is 12 of those insertions and is already on the branch (de22e8af). The code commit alone is 10 files, 252 insertions, 12 deletions.

Caps (insertions + deletions, code commit vs its parent): builtin-fx.ts 23/24, builtins.ts 34/40, ability-panel.ts 24+2−/26, project.ts 12+4−/24, fx.ts 10+2−/14, load.ts 1+1−/2, board.ts 1+1−/2, effects-slot.test.ts 2+2−/4, effects-10d.test.ts 77/80, smoke.mjs 68/70. No build-table file is over its cap. Nothing outside the build table was edited in the code commit.

## Green
`npm ci` (135 packages; lockfile unchanged) then `npm run green` on the code-head tree exited 0. The first green log stopped at test 685 when that process died; it was re-run, and the counts below are that completed run. Floor 1157 + 3 = 1160. Node's test runner prints `ok`, not `✔`.
```
# tests 1160
# pass 1160
# fail 0
# skipped 0
# todo 0
```
typecheck: exit 0. lint: exit 0. deps: exit 0 (no violations, 179 modules, 506 dependencies). check:state: exit 0. check:law: exit 0.
`npx tsc --noEmit -p tools/tsconfig.json` exits 2 with only the 3 base errors: effect-designer `page.ts` L101, and maker `home.ts` twice at L89. Root `tsc --noEmit -p tsconfig.json` exits 0.

## Smoke
Every smoke was run alone, then tracked `handback` files were restored (`git checkout -- handback` and untracked shots removed). Browser for every run: `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`. s6d and S0 still default to `/usr/bin/google-chrome`, which is not installed; those files were not edited. `CHROME` was set for the suite. S0 sha `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. s8 sha `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`. No retry was needed (s3 and s8c passed on the first solo run). s6c's checkpoint fixture was restored before s6d, s8c and s9c.
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
- s10d `handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1` — 8 ok (4 at 390 and 4 at 360), SMOKE PASS.
Mutations, each restored before the code commit (named tests via `node --test`; after the last restore the three 10d tests, 10b test 3 and 10b test 5 passed 5/0 and the product diff matched). The guide's "test 3" on a restored `fx.ts` / `project.ts` / unguarded swap is 10d test 3. 10b test 3 (saved-effect play) stayed green, because that path already passed on the base.
- `fx.ts` restored → 10d test 3 fail, 10b test 5 fail, 10b test 3 pass. AssertionError. pass 1, fail 2.
- `project.ts` restored → the same three outcomes. AssertionError. pass 1, fail 2.
- `ability-panel.ts` restored → 10d test 2 fail (AssertionError) and s10d steps 1–4 at both widths.
```
FAIL 1 builtins @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 2 pick undo @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 3 test @390: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 4 none stock @390: locator.waitFor: Timeout 15000ms exceeded.
FAIL 1 builtins @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 2 pick undo @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 3 test @360: page.waitForFunction: Timeout 15000ms exceeded.
FAIL 4 none stock @360: locator.waitFor: Timeout 15000ms exceeded.
SMOKE FAIL
```
- `board.ts` restored → s10d steps 1, 2 and 4 ok; step 3 FAIL at both widths (`page.waitForFunction: Timeout 15000ms exceeded`). SMOKE FAIL.
- Defaults dropped from `builtinFx` → 10d tests 1 and 3 fail. AssertionError. 10b test 5 stayed pass.
- Alias not stripped → 10d tests 1 and 3 fail. AssertionError. 10b test 5 stayed pass.
- `withFx` returns the bag without `sliceDoc` → 10d tests 1, 2 and 3 fail. AssertionError. 10b test 5 stayed pass.
- The catalogue-rev gate dropped in `withFx` → 10d test 2 fail. AssertionError.
- The row-source gate dropped (bundled used even when the catalogue rev is not "same") → 10d test 2 fail. AssertionError.
- The swap without `table.has` → 10d test 3 fail and 10b test 5 fail. AssertionError. 10b test 3 stayed pass.

## Export audit
`/workspace/share/s8/s8-audit.mjs` is not on disk. The same check was run by importing `tools/play-stage/build.ts`, `tools/baseline/build.ts` and `tools/maker/build.ts` (dev false, commit 40 zeros) and was not committed. Files were counted with `readdir` `withFileTypes` and `isFile` only. `grep` for `tools/maker`, `src/editor`, `tileengine/saves`, `session-save` and `__play`, and `find` for `catalogue.json.js` / `behaviours.json`:
```
play	134 files	grep empty	find empty
baseline	148 files	grep empty	find empty
maker play-stage directory	134 files	grep empty	find empty
loose play-stage	147 files	grep empty	find empty
AUDIT PASS
```
The guide's three-number quote is 134 / 148 / 147. One more file in each play tree than 10c: `src/project/builtin-fx.ts`. `window.__play` is absent from the release trees.

## Shipped tests (sha256)
The step file does not pin a shipped-test sha. The new test file, as committed:
```
62a494b0eb51d96d6eb90772877073cc1a9dae332c6304cf072d7d16738727ba  tests/editor/effects-10d.test.ts
```
`tests/project/effects-slot.test.ts` was edited only to re-pin 10b test 5 (title and the `fxOf` assert now name `btf-purple-drop`). Its `createPlayFx` line is unchanged and still expects stock ingest length 1. No other test was edited. s10d is the only smoke edited. s8 and S0 shas are above. The new test is 77 lines, not the trial's 61, because each statement is on its own line. Still 77/80.

## Helpers & self-review
- Helper f5e7a87d: asked to review the uncommitted product against Rules 1–6, the caps and the must-not list, and not to edit. Verdict: PASS. No must-fix. Nits left: unreachable `!isObj(sliced)` in `withFx`; test 3's basic-attack assert is piece-count only; null knob defaults are stored as written; `board.ts` and the `playDocsOf` return stay pre-existing long lines.
- Helper be284aae: asked to review the same uncommitted tree again before the code commit, and not to edit. Verdict: PASS. No must-fix. Same nits, plus: `a:fx` now requires a string `behaviourId` before the 10c none/saved write. Left, because `ability-panel.ts` is 26/26 and the row is not rendered unless that id is already a string. Named tests on that tree: 9 pass, 0 fail.
- `/tmp/s10d-allsmoke.sh` (not committed): ran the 21 smokes solo, set `CHROME`, restored `handback` after each, and retried only s3 or s8c. Neither needed a retry. `SUITE_FAIL=0`.
- `/tmp/s10d-mut.sh` (not committed): applied each mutation above, restored the tree, and checked the three 10d tests plus 10b test 3 and 10b test 5 (5/0).
- `/tmp/s10d-audit.mjs` (not committed): the export audit above. AUDIT PASS. Not a product file.
- Helper a9e95058: asked to fact-check this note against git and the green, tools-tsc, audit, smoke and mutation logs, and not to edit. Verdict: PASS. Shortstat, caps, 1160/0, the 21 smokes and the mutation lines match. 10b test 3 stayed pass on the `fx.ts`, `project.ts` and unguarded-swap mutations. No product diff after the code head.
- Self-review: Rules 1–6 done. Named tests 1–3 done (resolve bare and alias to defaults plus overrides, including tint `#f4d56a`, blade `holy`, shake 0 and a straight step; no row without `effect` in the slice; 10 BTF ids and display names under Built-in and no `te-*`; pick writes the bare id and re-slices; alias reads pressed; catalogue rev 1 offers none and writes nothing; line-shot and basic-attack play the bare id; a pick with no builtin values draws the 3-piece stock line shot; a saved effect id still plays its document). Done-when: green 1160/0 done; tools tsc only the 3 base errors done; 276 ≤ 400 done; every cap kept done; all 21 smokes PASS at the guide counts, no retry, done; mutations recorded done; export audit empty done. QA G1 the plants above fail when the matching behaviour is reverted. G2 root typecheck exit 0, no new ignore or any. G3 no new phase writes. G4 no quoted interface changed. G5 nothing in `src/core`, `src/sim`, `src/rules`, `tools/effect-designer`, data, fixtures, catalogue or format docs. `tools/play-stage` is in the build table and imports `src/project/builtin-fx.ts` only. G6 the 10 build-table files only (the paste was already committed). G7 276, every cap kept. G8 no new rAF, timer, or loop. G9 this note. G10 s10d shows Built-in with 10 `btf-*` and no `te-*`, Holy Blade stored and undone, Test playing tint `#f4d56a`, then None playing stock, at 390 and 360. Done.

## Decisions & deviations
- Knob defaults are copied as stored, nulls included (`Object.hasOwn`), then the preset's overrides. That is guide question 2, not a filter. `tint` `#f4d56a` is an override and appears only in tests and the smoke, not in `tools/maker`.
- `builtinRows` uses the slice's effect row itself as the source when that row is present. Calling `fxBehaviour` on the row would look for a nested catalogue and hide Built-in after a pick. Bundled is used only when the slice has no effect row and `addCase` is `"same"`.
- `withFx`'s `!isObj(sliced)` guard is unreachable (`sliceDoc` always returns an object), the same guard `addAbility` keeps. Left. `?? id` on a missing display name is the stated fallback (the name is the id).
- `a:fx` returns `{ keep: true }` when `behaviourId` is not a string, before the 10c none/saved write. The Effect row is not shown in that case. Splitting it out would put `ability-panel.ts` over 26. Alias acts are not in `builtinRows` and are not rewritten.
- The cast loop is one statement per line and swaps only when `table.has(next)`. The pre-existing docs `for` line in `fx.ts` was not rewritten. `board.ts` and the `playDocsOf` return only gained an argument or a spread. No new effect document, no `te-*` button, no new drawing, no CSS, no dependency.
- Test 3 checks the basic-attack draw by piece count (the house attack is also one piece). The line-shot proof is kind `straight` and 1 piece against the 3-piece stock fallback. The new test is 77 lines because the statements are not joined. No cache. 276 lines. The audit script was not committed.

## Next step
- Not this step: step 11 (export reads the same resolution) and step 33 ("Make my own from Holy blade", pictures). Built-in `blade`, `picture`, `tint`, `glow` and `spawn` are carried in the values and not drawn. The Effect row is still only on basic attack and line shot. No baseline republish: the published pages answer no built-in. The builder does not publish.
