# Hand-back step-05a-units r1
Step file: docs/maker/steps/step-05-units.md (Delivery, the 4c carries, and the 5a sections).
Base commit: 37f42de36a65be7157ed6a68c74b89d5dc315735     Code head: aeedd130eafd738e9e65c0cae02040bc9081a67b     Code head tree: f7f224a6533ed41ab15e3a7931798a10ac15540c     Branch: step/step-05a-units-r1-chatA     PR: none yet from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
M	data/templates/empty.tileproj/stages/stage_01JDEM00000000000000000003.json
A	data/templates/unit.json
M	handoff/steps/tests/s4c-stages-maps/smoke.mjs
A	handoff/steps/tests/s5a-units/smoke.mjs
A	src/editor/unit/units.ts
M	tests/editor/maker-law.test.ts
M	tests/editor/stage-rooms.test.ts
A	tests/editor/units.test.ts
A	tests/tools/knob-widgets.test.ts
M	tools/maker/app.css
M	tools/maker/home.ts
M	tools/maker/project.ts
M	tools/maker/rooms.ts
A	tools/maker/units.ts
A	tools/maker/widgets.ts

## Green
N = 5. Floor 1065. `npm test` 1070/0/0/0. typecheck exit 0. lint exit 0. deps exit 0. check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs. `npm ci` was not re-run here; `node_modules` was already installed from the lockfile.
```
# tests 1070
# pass 1070
# fail 0
# skipped 0
# todo 0
```
Line count at the code head, `git diff --shortstat 37f42de36a65be7157ed6a68c74b89d5dc315735..aeedd130eafd738e9e65c0cae02040bc9081a67b -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5a-units/**'`: 12 files changed, 338 insertions(+), 20 deletions(-). 338 + 20 = 358.
The s5a smoke is 74 lines (cap 130). No `waitForTimeout`.

## Smoke
No file under `tools/play-stage/` changed, so S0 was not run. `handoff/steps/tests/s0-play-input/touch-smoke.mjs` is still sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`.
Browser: Google Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome`. This sandbox has no `/usr/bin/google-chrome`.
`tools/maker/stage.ts:31` did not move. The stage-place pin still reads `function docAt(files: ProjectFiles, kind: string, id: string): …`.
Solo run. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s5a-units/smoke.mjs . 8802` printed:
```
ok   1 units @390: ok
ok   2 add @390: ok
ok   3 role @390: ok
ok   4 health @390: ok
ok   5 delete @390: ok
ok   6 refuse @390: ok
ok   7 reload @390: ok
ok   8 targets @390: ok
ok   1 units @360: ok
ok   2 add @360: ok
ok   3 role @360: ok
ok   4 health @360: ok
ok   5 delete @360: ok
ok   6 refuse @360: ok
ok   7 reload @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
That is one of three runs. Runs 1 and 2 were solo. Run 3 ran while 8 `node -e 'for(;;){}'` loops were burning CPU. All three printed `SMOKE PASS`, with checks 1–8 ok at 390 and at 360. Check 8 is the list of visible buttons and inputs under 48 px, collected while the name sheet, the editor, the role sheet and the delete refusal are open.
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801` printed:
```
ok   1 add @390: ok
ok   2 rename @390: ok
ok   3 resize @390: ok
ok   4 refuse map @390: ok
ok   5 test @390: ok
ok   6 undo @390: ok
ok   7 last stage @390: ok
ok   8 targets @390: ok
ok   1 add @360: ok
ok   2 rename @360: ok
ok   3 resize @360: ok
ok   4 refuse map @360: ok
ok   5 test @360: ok
ok   6 undo @360: ok
ok   7 last stage @360: ok
ok   8 targets @360: ok
SMOKE PASS
```
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800` printed:
```
ok   1 add here @390: ok
ok   2 what @390: ok
ok   3 talk @390: ok
ok   4 enemy @390: ok
ok   5 move @390: ok
ok   6 test @390: ok
ok   7 undo @390: ok
ok   8 roam @390: ok
ok   1 add here @360: ok
ok   2 what @360: ok
ok   3 talk @360: ok
ok   4 enemy @360: ok
ok   5 move @360: ok
ok   6 test @360: ok
ok   7 undo @360: ok
ok   8 roam @360: ok
SMOKE PASS
```
`PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ CHROME=/usr/local/bin/google-chrome node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799` printed:
```
ok   1 grid @390: ok
ok   2 sheet @390: ok
ok   3 paint @390: ok
ok   4 occupied @390: ok
ok   5 undo @390: ok
ok   6 test @390: ok
ok   7 start new @390: ok
ok   8 reload @390: ok
ok   1 grid @360: ok
ok   2 sheet @360: ok
ok   3 paint @360: ok
ok   4 occupied @360: ok
ok   5 undo @360: ok
ok   6 test @360: ok
ok   7 start new @360: ok
ok   8 reload @360: ok
SMOKE PASS
```
s4b measures buttons under 48 px while the cell sheet is open (check 1). s4a does the same while "Add here" is open (check 2). Both passed at 390 and at 360. New waits are `waitForFunction` only; the inherited s4a/s4b tap and press helpers keep their short waitForTimeout.
Screenshots at 390, light, in this folder: `01-units.png` (the seven demo units), `02-name.png` (+ Add unit), `03-editor.png` (Health and Attack, Same as army), `04-roles.png` (the four roles), `05-refuse.png` (Wolf, used by Demo stage).

The s4c smoke edit is deliberate. Only the waits at L27 and L48 changed. sha256 before `ea0d674fd2cbbf3ca8c4e36d8996a0fde227556380185ad808481f26f73148d5`. sha256 after `d885c3e8f895c3c67635d48defb5edeb38039e3429c93e497640b3b55aa7e5ab`.
```
-    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will go"); sheetTiny.push(...await big()); };
+    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will be removed"); sheetTiny.push(...await big()); };
-      await tap(page, "r:anyway"); await waitText(page, "placementDropped"); await press(page, "Demo stage");
+      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await press(page, "Demo stage");
```

## Shipped tests (sha256)
The step file ships no frozen hash for these tests. They are new, except the two edited files.
```
4bb489dac9536a1556f18801d79fc487f9eb1049c28607c311ac6fcc465fd9c9  tests/editor/units.test.ts
1204e03217b33ee03e6df865373e9ee98c0f15af4027f46158e7b4fc72a70f01  tests/tools/knob-widgets.test.ts
5b29c2749f0994bf5f4451fe6c1ab657b1e1f45cbf82acb0c884b476e0e9f2cb  tests/editor/stage-rooms.test.ts
ad018c92b1832890753825810924aab0a7841ec0520d858ebf6b36ca18c2ba85  tests/editor/maker-law.test.ts
```
Named tests present: `unit skeleton loads`, `empty template stage has a seed`, `resize rows use plain words`. Model test: `units`. Widget test: `knob widgets`.

## Helpers & self-review
- Helper (review of the units model, the maker screens, the smoke and the 4c carries): no miss on the refusal strings, `say()`, the stat shape through `playDocsOf`, the role filter, file-keeping delete, the law scan, or the smoke waits. It did flag two residuals. Delete is session-only, which is the 4c rule and is what the guide asks (the file stays; a reload lists it again). A slider `input` rebuilt the editor and could overlap two saves on the same rev. Fixed before the smokes: saves run one at a time, and a Health or Attack tick updates the number and Reset in place instead of rebuilding the page.
- A second review was started on the same questions and cancelled after it returned no report.
- Self-review: Done when — gates 1070/0 and the five check scripts exit 0, done. Named tests, the model test (new id, rename keeps every other field, role writes only `per_unit` keys, Reset then `playDocsOf` returns army 9, used unit refused with both lines, Undo restores the card) and the wired stat, done. s5a and s4c `SMOKE PASS` at 390 and 360, done. No play-stage file, done. Screenshots of the five screens, done. Count 358 ≤ 400, done.
- Self-review: QA G1–G10 — G1 tests green, G2 typecheck clean, G3 no phase writes, G4 no quoted signature to match, G5 play-stage and the frozen kits untouched apart from the two s4c waits, G6 extra `home.ts` and `app.css` named below, G7 358 with the four over-cap files named, G8 no cache and no new dependency, G9 this note, G10 the 5a behaviour (list, add, rename, delete, role, Health, Attack, Reset, seven widgets), done.

## Decisions & deviations
- A stat is `{value, rev: 1}`, matching the demo units and project-format §17.3. Reset copies the other keys (no `delete`). A slider write is clamped to the slice min, max and step; a missing step is 1. "Same as army" shows only while that key is absent, so a role that stores the army numbers hides the phrase.
- An unused unit is hidden for this session. The file stays, because `planSave` cannot drop a path. Undo puts the card back. A reload lists the file again. One snapshot, the latest action. The toast lasts 6 seconds and is not drawn on the unit editor, so it does not cover the sheet. Slider ticks are saved one at a time and do not rebuild the editor.
- Colour chips use the style tokens `--accent`, `--ink`, `--danger`, `--ok` and `--warn`. No project palette is wired, and there is no colour literal. An empty project has no `unit-roster`, so it shows no role and no Health or Attack rather than a made-up 9. A new unit keeps the skeleton's `createdAt` until `planSave` bumps `rev` and `updatedAt`. Units are listed by id. `who()` names `playerSpawns`, `neutrals` and `enemyPool`; any other list would read "Enemy".
- The s4c smoke edit is deliberate: only L27 and L48, hashes in § Smoke. `tools/maker/stage.ts:31` did not move. No `tools/play-stage/` file changed, so S0 was not run.
- Over the guide caps, still inside 400: `tools/maker/units.ts` is 162 lines against 90 (the list, the editor, the sheets, save and undo are one job). `tests/editor/stage-rooms.test.ts` is +11 against 10 (the import plus the named wording test). `tools/maker/rooms.ts` is 5 insertions and 4 deletions against 8 (the wording, plus a `Record<string, string>` so `tsc` accepts the undo write once a test imports `say`). `tests/editor/maker-law.test.ts` is 2 insertions and 2 deletions against a 3 cap (the stage-or-unit doc scan at L16, and the `lawHits(…/src/editor/unit)` assert at L26). Extra files: `tools/maker/home.ts` (the click router, the same slot as 4c) and `tools/maker/app.css` (one rule so the slider is 48 px). No new dependency. Nothing is cached.

## Next step
- 5b should add the unit sheet on the stage, the ability list and the panel, and only then show Test. 5a leaves Test off. Empty projects still throw `play: army` until the empty template grows a `unit-roster` setup.
