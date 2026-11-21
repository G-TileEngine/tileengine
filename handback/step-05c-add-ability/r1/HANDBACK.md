# Hand-back step-05c-add-ability r1
Step file: docs/maker/steps/step-05-units.md (Header, Delivery, Rules 10, 11 and 13, the count command, Shots, and "5c: + Add ability").
Base commit: 88a6ac931100ce13cc0c460f921d9734ddb554c9     Code head: cb1b0ff85797b929ea209b4b9812f4e1217ba32f     Code head tree: 192f86a7df798503ede9fbaa47c49a22dcca3f31     Branch: step/step-05c-add-ability-r1-chatA     PR: none yet from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)
This file is the tip commit. Its sha and tree are quoted in the hand-back message. No product file changes after the code head.

## Changed files
A	data/templates/setup.ability.json
A	handoff/steps/tests/s5c-add-ability/smoke.mjs
M	src/editor/project/save.ts
A	src/editor/unit/add.ts
A	src/project/slice-of.ts
A	tests/editor/add-ability.test.ts
M	tests/editor/maker-law.test.ts
M	tests/tools/maker-build.test.ts
M	tools/maker/ability-panel.ts
A	tools/maker/add-ability.ts
M	tools/maker/app.css
M	tools/maker/build.ts
A	tools/maker/catalogue.json
A	tools/maker/catalogue.ts
A	tools/maker/dev.ts
M	tools/maker/home.ts
A	tools/maker/unit-diagram.ts
M	tools/maker/units.ts
M	tools/project/slice-of.ts

## Green
N = 7. Floor 1074. `npm test` 1081/0/0/0. typecheck exit 0. lint exit 0. deps exit 0 (168 modules, 485 dependencies). check:state exit 0. check:law exit 0. These are the six scripts `npm run green` runs. Green was run again after the diagram before-pass fix below, still 1081/0/0/0. `npm ci` was not re-run; `node_modules` was already installed from the lockfile. No product file changed after that second green.
```
# tests 1081
# pass 1081
# fail 0
# skipped 0
# todo 0
```
Named tests, all in `tests/editor/add-ability.test.ts`: `rev case same: add re-cuts the slice`, `rev case older: offer first, no rev-B entry`, `rev case newer: add is off`, `remove doesn't prune`, `missing goal goes to Other`, `only wired primaries are offered`, `diagram comes from the engine`.
Line count at the code head, `git diff --shortstat 88a6ac931100ce13cc0c460f921d9734ddb554c9..cb1b0ff85797b929ea209b4b9812f4e1217ba32f -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5c-add-ability/**'`: 17 files changed, 341 insertions(+), 38 deletions(-). 341 + 38 = 379.
The s5c smoke is 86 lines (cap 130). New waits are `waitForFunction`. `locator.waitFor` remains only inside tap and press, the same as the frozen smokes. No `waitForTimeout`.

## Smoke
`handoff/steps/tests/s0-play-input/touch-smoke.mjs` is unedited, sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`. No `tools/play-stage/` file is in the diff, so S0 was not run.
Browser: Playwright headless shell at `/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell` (HeadlessChrome/156.0.8078.4). This sandbox has no Google Chrome. `PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/`.

s5c, port 8804. `node handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804` printed the same 16 ok lines and `SMOKE PASS` three times on the tree before the before-pass slice fix, and once more on the code head. The second of the three was under eight `node -e 'for(;;){}'` loops. The fix is a no-op when the behaviour is already in the slice, which is the demo the smoke opens. Check 8 is measured with + Add ability (the goal sheet), a goal's card list, and the update offer open.
```
ok   1 goals @390: ok
ok   2 diagrams @390: ok
ok   3 add @390: ok
ok   4 test aim @390: ok
ok   5 again @390: ok
ok   6 offer @390: ok
ok   7 newer @390: ok
ok   8 targets @390: ok
ok   1 goals @360: ok
ok   2 diagrams @360: ok
ok   3 add @360: ok
ok   4 test aim @360: ok
ok   5 again @360: ok
ok   6 offer @360: ok
ok   7 newer @360: ok
ok   8 targets @360: ok
SMOKE PASS
```

s5b, port 8803, on `7893dc6` (before the one-line diagram fix; that fix does nothing when the behaviour is already in the slice):
```
ok   1 sheet @390: ok
ok   2 list @390: ok
ok   3 range @390: ok
ok   4 test aim @390: ok
ok   5 undo @390: ok
ok   6 whole @390: ok
ok   7 nowhere @390: ok
ok   8 targets @390: ok
ok   1 sheet @360: ok
ok   2 list @360: ok
ok   3 range @360: ok
ok   4 test aim @360: ok
ok   5 undo @360: ok
ok   6 whole @360: ok
ok   7 nowhere @360: ok
ok   8 targets @360: ok
SMOKE PASS
```

s5a, port 8802, on `7893dc6` (no play-stage or unit-list change after that run):
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

Screenshots at 390×844, light, in this folder: `01-goals.png` (Browse by goal, Attack with count 2, Close), `02-cards.png` (Attack cards, diagrams, the search hint, Back), `03-panel.png` (Line Shot panel after add, Range 3, diagram under the knobs), `04-offer.png` (the update offer), `05-newer.png` (the newer-project note, no + Add ability).

## Helpers & self-review
- Helper (build and law, before the last green): the catalogue is a symlink and the build special-cases it; release strips the dev-only lines; the maker-build assert looks at the stamp before the dirty rebuild; `behaviour-library/**` is not edited; the play-stage build does not import maker or the catalogue; `setup.ability.json` is remembered and not copied into demo or empty. Verdict: clean.
- Helper (model against the guide, before the last green): three real bugs, all fixed before green. The diagram was blank when the behaviour was not already in the slice (the preview now re-cuts with `sliceDoc` for that draw only). The word "reach" overflowed 16 px cells (cells are 36×16). `addAbility` did not refuse a behaviour already on the unit (it now returns `missing`). Rev cases, goal order, `g:` routing, slice bytes, and the absent Suggested / role / Browse-all chips were confirmed.
- Helper (smoke and tests, before the last green): the same-rev test and the smoke could pass because the demo slice already contains line-shot. The same-rev test now strips line-shot first, checks the D16 key set, and a second add returns `missing`. Remove goes through `abilityAct` `a:drop` and the setup file stays. The diagram test still marks reach 3 after line-shot is removed from the slice. The smoke compares the slice text before and after × and checks a setups file still contains line-shot.
- Helper (build and law, this hand-back): CLEAN. Count under 400. S0 hash unchanged. No play-stage diff. `add.ts` imports `src/project/slice-of.ts`, not tools. No `JSON.parse` of the catalogue. No `kind` or `formatVersion` literal under `tools/maker` or `src/editor/unit`. No empty catch, no `?? {}`. Both over-cap files named below.
- Helper (UI and smoke, this hand-back): CLEAN on the sheet flow, before the before-pass fix. `g:` keep hits paint. Cards close with Back, then goals Close. New waits are `waitForFunction`. Check 8 runs with the goal sheet, the card list, and the offer open. Diagram is 7×7 from `{c:3,r:3}` and says "reach". `display:block` is only on the summary. Drop does not rewrite the slice. `planSave` stores the slice text unchanged. Offer and newer sentences match. Smoke is 86 lines.
- Helper (model, this hand-back): MUST-FIX, then fixed before the tip. The diagram's before pass did not re-cut the slice. If another unit still held the behaviour with `{source:"default"}` answers and the slice did not, `playDocsOf` threw and the grid was blank. The before pass now calls `withSlice` too. The diagram test sets the archer's range and damage to `{source:"default"}` after stripping line-shot; that assertion fails (0 marks) without the fix and passes with it. `canUpdate` refuses a change of knob id, type, default, options, min, max, step, or max_len. A second add of a behaviour already on the unit returns `missing`. After Update the slice bytes equal `sliceOf` of the used ids.
- Self-review: Done when — green 1081/0, the seven named tests, s5c three times (one under CPU) plus one more on the code head, and s5b and s5a pass at 390 and 360, five screenshots, count 379. S0 not required. Done.
- Self-review: QA G1–G10 — G1 tests green and each named test fails if its rule is skipped, G2 typecheck clean, G3 no phase writes, G4 no new quoted signature, G5 S0 kit and `behaviour-library/**` unedited, G6 extras named below, G7 379 with both over-cap files named, G8 no reach cache and no new dependency, G9 this note, G10 the 5c behaviour (goals, cards, add, offer, newer, diagram, no prune). Done.

## Decisions & deviations
- `addable` takes `files` so a setup id can be mapped to a behaviour id. `addAbility` takes `behaviourId`. The rev field is `mode`, not `kind`. A second add of a behaviour already on the unit returns `missing`.
- `sliceOf` moved to `src/project/slice-of.ts` because src cannot import tools. `tools/project/slice-of.ts` re-exports it, so the byte path is still one function. `planSave` writes `catalogue/slice.json` unchanged.
- The catalogue is the symlink `tools/maker/catalogue.json` plus one line in the maker build. No `JSON.parse` of it in maker code. The maker-build test copies `behaviour-library` and checks the stamp before the dirty rebuild.
- A new setup stores `{source:"default"}` only, for every knob that has a default and no `no_default_reason`.
- The diagram is 7×7 from `{c:3,r:3}`. Range 4 marks the same cells as Range 3, so the named test changes Range from 3 to 2. Cells are 36×16 so the word "reach" fits. If the behaviour is not in the slice, both the before and after draws re-cut a temporary slice with `sliceDoc` and do not store it. An unplayable project draws an unmarked grid. Empty still throws `play: army` at `tools/play-stage/project.ts:33-34`. Left as an open carry.
- `display:block` is only on `.ability summary`. On `details.ability` the open section dropped its height and the diagram overlapped the Range slider. Goal cards are the maker's single-column `.card`, not the prototype two-column icon grid. Only Attack is offered on the Knight. The card list closes with Back, then the goal sheet closes. Search filters in the DOM so the box keeps focus. `.toast` has no z-index; `.toast.above` is unchanged.
- Over the file caps, total 379: `unit-diagram.ts` 34 against 30 (the temporary slice on both draws, so a card still draws when the behaviour is not in the project yet). `add-ability.test.ts` 93 against 80 (the re-cut, the D16 key set, the drop, the diagram without a slice entry, and the default-answer plant actually fail if those paths are skipped). Within cap: `build.ts` 2/6, `catalogue.ts` 8/25, `add.ts` 82/85, `add-ability.ts` 52/90, `maker-build.test.ts` 4/5. Extras: `ability-panel.ts`, `units.ts`, `home.ts` (`g:` routing), `app.css`, `save.ts`, `src/project/slice-of.ts`, the re-export, `dev.ts`, the catalogue symlink, the maker-law plant. No play-stage edit. No new dependency.

## Next step
- None from this go-line. Suggested chips, Start from a role inside + Add ability, and Browse all stay out.

## Open carry
- The Empty template still throws `play: army` at `tools/play-stage/project.ts:33-34`. Left as it was. Not introduced here.
