# Rebuild record: step 5b, abilities on a unit

Original brief: [`docs/maker/steps/step-05-units.md`](../maker/steps/step-05-units.md) on the merge (r3b, blob `2e2673e8`, sha256 `ce4ec0112291f60dbc332e3ff15290edc5a9dda9bd1680958381ae0612457d7e`, 267 lines): the 5b sections (L152-194), carry (c) (L87), the Empty `play: army` ruling (L259), the count command (L94-95) and Delivery (L33-37). The same blob is on current main, the base and the tip. Do [`step-05a.md`](step-05a.md) first; this step needs 5a merged (guide L20). This file records exactly what shipped.

Sources: PR #88 and branch `step/step-05b-abilities-r1-chatA` (r1 tip `4041779c`, r1 code head `4e58c390`); `handback/step-05b-abilities/r1/HANDBACK.md` at `4041779c` / the merge (HB, blob `ab8805af`, 190 lines); Chief Of Staff verify report `/workspace/share/step-05b-verify/report.md` (V1, sha256 `691aa9eb644cf7a9bc60e34a8c94b78dd994a601e2805fa9618c7da78dca2061`, 40 lines). `docs/qa/step-05b-review.md` (QA, git hash-object `7de831f5`, 34 lines, on main `cb7f812a`): **OK TO MERGE**, no must-fix (QA:3). Line numbers are at the commit named. Code line cites are at merge `c66760b7` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `0dc2c58839131c48e5b30d9d0a3a61ff419f0072`, the 5a r2 QA recheck on main after the 5a merge (PR #87). Floor **1070** tests (guide L190: 5a's final count + N; header L19 was TBD) |
| r1 commits | `4e58c390` feat(maker): abilities on a unit (code head, tree `537c3227`, HB:3), `4041779c` docs(handback): step-05b-abilities r1 (tree `88be3dbb`, V1). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour passed (1074/0, G7 394, smokes including S0). QA **OK TO MERGE** (QA:3). No must-fix. Non-blockers (QA:28-34) are recorded below: the Empty `play: army` throw is still at `project.ts:33-34` and was not restated in the hand-back; HB:168 overclaims shots 02 and 03 (Line Shot, Test, Range/Damage are below the fold); the stage-editor toast at 360 overlaps only the scrimmed topbar; the occupied sheet keeps “A unit stands here” because frozen s4a check 4 requires it (HB:181); every file over its cap is named (HB:185-186) |
| Merge | PR #88 "Step 5b: abilities (r1)", merge commit `c66760b7f3849e0de19401bfbc4aaeaaf1d0b5f8`, 2026-11-20 17:59 (UK time). Tree `09012d41fb6af39af17407d0f1c6c2c1c996974c` (the same tree CoS and QA predicted against `bfcf5504`; V1, QA:21). First parent `bfcf5504e389c5e0688dbfbe8f0b1fe04608b3fa` (the step-05a rebuild record and its QA review, docs-only after `0dc2c588`), second parent `4041779c` |
| After the merge | main is `cb7f812aa96515bc59ba0e5d009227b37fa690d4`, which adds `docs/qa/step-05b-review.md`. QA postmerge PASS on merge c66760b7 (PR #88): parent2 = 4041779c, noreply ok, src/tests/tools diff equality ok, pins 5/5 unchanged, npm 1074/0, smoke 0 failed; main cb7f812a adds only docs/qa/step-05b-review.md. |
| Tests | 1070 + N=4 (`wired list matches the play adapter`, `panel layout: 18 knobs, 7 questions, 5 in one, at 360`, `unknown knob type is read-only`, `ability panel`) = **1074 pass / 0 fail** (HB:28-36, V1, QA:8) |
| Size | Accepted measure, `git diff --shortstat 0dc2c588..4e58c390 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5b-abilities/**'`, is 17 files, **350 insertions + 44 deletions = 394** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L94-95, L179, L190; QA:15, V1, HB:37). The 379 figure at guide L179 is the sum of file caps, not a second gate (QA:15). The same shortstat holds at the r1 tip `4041779c` and, with `':!docs/**'` also excluded, at the merge. On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added two docs files after the base, 1497 insertions, which are not this step. Without that exclusion the merge shortstat is 19 files, 1847 insertions and 44 deletions. The s5b smoke is 84 lines, under its own cap of 130 (guide L177, L36; HB:38) |
| Stamp | `node tools/maker/build.ts` writes stamp `d813576e8f59` at the code head and at the merge (same maker sources) |
| Smoke | `tools/play-stage/page.ts` and `project.ts` changed, so S0 is required (guide L35, L173). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s5b smoke prints `SMOKE PASS` once, after checks 1–8 (including `8 targets`) at 390 and at 360, under google-chrome on port 8803; S0 prints `TOUCH SMOKE PASS` on port 8797; the s5a smoke does the same as 5a on port 8802, s4c on 8801, s4b on 8800, and s4a on 8799 (guide L35, L181, L193; HB:47-63, 69-83, 89-165; V1; QA:16-19). s5a, s4c (still sha256 `d885c3e8…`), s4b, s4a and S0 are unedited vs the base (HB:41, QA:19) |

## (b) Files

From `git diff --name-status 0dc2c588..4041779c -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the base (r1 values, which is what merged). The same 18 product files are on the merge tree `09012d41`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/rules/behaviours/wired.ts` | new | 7 (cap 13) | EA list: `WIRED: Readonly<Record<string, readonly string[]>>`, the knobs `playDocsOf` reads today (guide L165) |
| `src/rules/behaviours/index.ts` | edited | 1 | Extra: re-exports `WIRED` (guide L165; HB:186) |
| `tests/rules/wired.test.ts` | new | 36 (cap 40) | Named test `wired list matches the play adapter` (guide L166, L191) |
| `src/editor/unit/panel.ts` | new | 54 (cap 70) | Pure: `panelOf`, `setAnswer`, `resetAnswer`, `detach`, `badge`, `stageFor`, `aimKind` (guide L167) |
| `tools/maker/ability-panel.ts` | new | 84 (cap 85) | Ability list (Test, ×, ▶ Test, the “Place this unit…” line) and the `<details>` panel with 5a widgets (guide L168) |
| `tools/maker/stage.ts` | edited | 30 (19+/11−, cap 25) | Unit sheet title and buttons, tap/hold, ✦N on cells; rename `docAt`'s `kind` to `folder` (guide L169). Over the file cap; named in HB:186 |
| `tools/maker/stage-sheets.ts` | edited | 2 (1+/1−, cap 4) | `unitButtons` gets Edit and Test (guide L170) |
| `tests/editor/stage-place.test.ts` | edited | 2 (1+/1−, cap 1) | L53 expects `[]` (carry c; guide L171). Over the file cap; named in HB:185 |
| `tools/maker/test-launch.ts` | edited | 11 (6+/5−, cap 10) | Pass `unit` and `ability` through `LaunchBag` to the start function and the URL (guide L172). Over the file cap; named in HB:185-186 |
| `tools/play-stage/page.ts` | edited | 24 (22+/2−, cap 15 for `page.ts` / `board.ts`) | Start options `{unitId?, abilityId?, aim?}`: select the first live player unit and open the aim, or centre on it (guide L173). `board.ts` is 0. Over the file cap; named in HB:186 |
| `tools/play-stage/project.ts` | edited | 2 (1+/1−, cap 1) | L42 matches the slice option `"orth-only-1"` (guide L174). Over the file cap; named in HB:185 |
| `tests/editor/ability-panel.test.ts` | new | 42 (cap 60) | Model test `ability panel` and named test `unknown knob type is read-only` (guide L175, L191-192) |
| `tests/tools/ability-panel-layout.test.ts` + `tests/fixtures/maker/big-ability.json` | new | 22 (21+1, cap 55) | Named test `panel layout: 18 knobs, 7 questions, 5 in one, at 360` (guide L176, L191) |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | new | 84 (cap 130) | Browser smoke, own cap, outside the 400 (guide L177, L36). Measures check 8 with the unit sheet, the list and an open panel |
| `tools/maker/home.ts` | edited | 49 (33+/16−) | Extra: the click router, hold (500 ms), the 6 s toast, and hiding the project toast while the unit editor is open (HB:186) |
| `tools/maker/units.ts` | edited | 22 (16+/6−) | Extra: mounts `abilityView` in the unit editor (HB:186) |
| `tools/maker/app.css` | edited | 6 (5+/1−) | Extra: `.toast.above`, `details.ability:not([open])` and the ✦N star (HB:186-187) |

No other product file. Nothing under `tests/tools/golden/`, `data/templates/`, `tools/play-stage/board.ts`, `package.json` or `package-lock.json`. Path and Dirt stay hidden. No + Add ability, no goal table, no catalogue read (guide L185; QA:24).

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest edited files are `tools/maker/stage.ts` at 263 lines, `tools/maker/units.ts` at 172 and `tools/maker/home.ts` at 141.

## (c) Key code and git commands

`src/rules/behaviours/wired.ts` is the EA list. Ids only, no rules. `src/rules/behaviours/index.ts:6` re-exports it:

```ts
/** Knob ids `playDocsOf` reads. Ids only, no rules. */
export const WIRED: Readonly<Record<string, readonly string[]>> = {
  "unit-roster": ["unit_hp", "unit_atk"],
  "basic-attack": ["reach_mode", "custom_ns", "custom_ew"],
  "line-shot": ["range", "damage"],
  talk: ["line"],
};
```

The named test `wired list matches the play adapter` is `tests/rules/wired.test.ts:15-36`.

`src/editor/unit/panel.ts` is the pure panel helper. `badge` (`panel.ts:10`) counts `setupIds`. `detach` (`panel.ts:11`) replaces only that id and keeps the setup file. `setAnswer` (`panel.ts:12`) writes `{source:"default"}` with no `value` when the value equals the default, otherwise `{source:"user", value, rev: 1}`. `resetAnswer` (`panel.ts:13`) writes `{source:"default"}`. `panelOf` (`panel.ts:22-40`) walks `menu_order`, keeps only knobs in `wired[behaviourId]`, honours `depends_on`, omits empty sections, and marks a rider, scaler or trigger as a `row`, never a `card`. `stageFor` (`panel.ts:41-54`) returns the first live stage in `project.stages` order where the unit takes part (loadout, NPCs or enemy pool), or `null`. `aimKind` (`panel.ts:9`) is `"basic"` for `basic-attack` and `"spell"` for `line-shot`.

`tools/maker/ability-panel.ts` `abilityView` (`ability-panel.ts:29-48`) paints the Abilities list. Each primary row has Test and × (`ability-panel.ts:42-44`). Below the list: ▶ Test, or “Place this unit on a stage to test it.” and no Test when `stageFor` is null (`ability-panel.ts:46`). There is no + Add ability. The open panel is `<details>` sections from `panelOf`, with 5a widgets. `tools/maker/units.ts:99` mounts that view in the 5a unit editor, which is how 5b adds Test there (5a had left it off).

`tools/maker/stage-sheets.ts:7` is the unit-sheet buttons:

```ts
export const unitButtons = (npc: boolean, test: boolean): string => `<button type="button" class="btn" data-act="s:edit">Edit</button><button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${test ? `<button type="button" class="btn" data-act="s:try">Test</button>` : ""}${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
```

The sheet title is `"<Name> · <Your team | NPC | Enemy>"` at `tools/maker/stage.ts:151`. The occupied block at `stage.ts:149` still starts with “A unit stands here”, then those buttons; Test is included only when `stageFor` is non-null. `marks` calls `badge(doc)` at `stage.ts:45`. A cell with N ≥ 1 attached setups draws `<span class="star">✦${mark.n}</span>` at `stage.ts:102-103`. Hold is 500 ms from pointer timestamps, with no timer, in `tools/maker/home.ts:136-138`: `pointerdown` on an `s:cell:` records the act and `timeStamp`; `pointerup` on the same act fires `go(act)` when the delta is ≥ 500. A short tap still uses click (`home.ts:135`). The two events share the one action gate (HB:182).

Carry (c). 5b edits `stage.ts`, so it retires the 5a `kind` pin (guide L87). `tools/maker/stage.ts:32` is:

```ts
function docAt(files: ProjectFiles, folder: string, id: string): { readonly path: string; readonly doc: Obj } | null {
```

and `tests/editor/stage-place.test.ts:53` is `assert.deepEqual(hits, []);` (QA:20).

Test launch. `LaunchBag` carries `aim?: AimAt` (`tools/maker/test-launch.ts:13`). `showUrl` (`test-launch.ts:17`) appends `&unit=` and `&ability=` when set. `play` calls `input.start(opened.docs, input.aim)` at `test-launch.ts:25`. On the play stage, `StartAim` and `startMatch` are `tools/play-stage/page.ts:14-15`. If `aim.unitId` is set, the first live player unit with that id is selected and, when `aim.aim` is `"basic"` or `"spell"`, the matching aim is opened; otherwise the camera centres on the unit (`page.ts:57-74`). If `choose` returns no target, Test still enters targeting and fills orthogonal cells at that reach (HB:184). `board.ts` was not edited. `tools/play-stage` does not import maker or editor (guide L187).

`tools/play-stage/project.ts:42` now matches the slice option `"orth-only-1"` (was `"one-tile-straight"`; guide L174). The Empty template still has no `unit-roster` setup, so `playDocsOf` still throws at `project.ts:33-34`:

```ts
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
```

That is the 5a carry and guide L259: units made on Empty cannot be Tested until the empty template grows an army setup or the adapter gets a default. The hand-back does not restate it (QA:29).

Toast. On the project screen the Undo toast is omitted while `unitEditing()` (`home.ts:35`), as in 5a, so Back stays tappable. On the stage the toast is shown, and it gets class `toast above` only while the unit editor is open (`home.ts:30`, L34). `.toast.above` is `top: 16px; bottom: auto; z-index: 6` (`app.css:48`); a plain `.toast` has no z-index, so a project sheet (s4c Cancel) stays above it (HB:174, HB:183). At 360×844 QA measured the toast at 16,16 328×76; it overlaps only the stage topbar (`s:back`, `s:view`, `s:fresh`, `s:test`), which already sits behind the scrim (z-index 5) and is not a target while the editor is open (QA:31).

The four named / model tests are `tests/rules/wired.test.ts:15-36`, `tests/tools/ability-panel-layout.test.ts:10-21` (7 `<details>`, first open, knobs in `knob_ids` order, no fixed or max height on `.ability` rules in `app.css`), `tests/editor/ability-panel.test.ts:18-38` (`ability panel`) and L39-42 (`unknown knob type is read-only`).

The s5b smoke (`handoff/steps/tests/s5b-abilities/smoke.mjs`, 84 lines) has no `waitForTimeout`. `tap()` and `press()` (L16-17) use `locator.waitFor` only, the same as the frozen smokes. Every other wait is `page.waitForFunction`. Check 8 (`8 targets @${width}`, L79) collects under-48 px buttons/inputs via `big()` while the unit sheet (L33), the ability list (L39) and an open panel (L48) are open (guide L37, L181; HB:65). Inherited s4a/s4b short `waitForTimeout`s, and S0's frozen ones, are unchanged.

## (d) What went wrong, in order, and the fix

**r1.** The product shipped and green was 1074/0. The official gate was 350 + 44 = 394. Solo and CPU-burn s5b smokes passed, as did S0, s5a, s4c, s4b and s4a, including check 8 with the new sheets open. Every over-cap file and every extra file is named in HB:185-186. The tip holds only `HANDBACK.md` and the four screenshots. HB:3 is “PR: none yet from the branch.”

QA **OK TO MERGE** (QA:3). No must-fix, no second round. The non-blockers in QA:28-34 did not require a product, test or hand-back change before the PR; they are recorded below so a later step can carry them. The merge tree is `09012d41`, as predicted (QA:21, V1).

A late CSS and smoke-wait pass happened before the code head was committed, not after: `z-index: 6` moved from `.toast` onto `.toast.above` after s4c failed with Cancel covered, and the Spare name wait became `waitForFunction` (HB:28, HB:173-175). The committed code head already includes both fixes. The layout test was re-run after the CSS edit (HB:28).

## (e) Do it right first time

- Start from the 5a-on-main commit `0dc2c588`. The floor is 1070 + 4 = 1074.
- Put the panel model in `src/editor/unit/panel.ts` and the list / panel UI in `tools/maker/ability-panel.ts`. Do not write a `kind` or `formatVersion` literal. × is detach only. No + Add ability, no goal table, no catalogue read, no mock Test results, no reach or badge cache. No `tools/maker` or `src/editor` import into `tools/play-stage`. Do not edit the S0 kit or `board.ts` unless the start-options work has to go there.
- Rename `docAt`'s `kind` parameter to `folder` and change `stage-place.test.ts` L53 to expect `[]` (guide L87). Leave Test off the unit editor only in 5a; 5b must add the unit sheet, the ability list, the panel and Test / ▶ Test.
- Leave the Empty `play: army` throw at `tools/play-stage/project.ts:33-34` until the empty template grows a `unit-roster` setup or the adapter gets a default (guide L259). Restate that carry in the hand-back.
- Match `project.ts` L42 to the slice option `"orth-only-1"`.
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L95). Here that is `stage.ts` (30 vs 25), `test-launch.ts` (11 vs 10), `page.ts` (24 vs 15, `board.ts` 0), `project.ts` (2 vs 1) and `stage-place.test.ts` (2 vs 1). Extra files (`home.ts`, `units.ts`, `app.css`, `index.ts`) must also be named.
- A smoke that claims “every target is 48 px” must measure the unit sheet, the ability list and an open panel **while they are open**, and must print a `8 targets @<width>` line at 390 and at 360. After a save, wait with `waitForFunction`, not `waitForTimeout`. Because play-stage changed, also run the frozen S0 touch smoke on port 8797 and leave its sha256 `d528795e…`.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke (guide L35). A 3-run or CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the screenshots, not raw test logs. Screenshot captions should not claim controls that are below the fold in the committed frames (QA:32).
- Keep “A unit stands here” on the occupied sheet for as long as frozen s4a check 4 (`s4a-stage-paint/smoke.mjs:28`) requires that sentence (HB:181). Hide the project-screen toast while the unit editor is open (as in 5a). Put `z-index: 6` only on `.toast.above`, so a project sheet stays tappable.
- Measure with the step-05 count command (guide L94-95), with `':!handoff/steps/tests/s5b-abilities/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 394 is the accepted number. The smoke's own cap is 130. On a merge, also exclude `':!docs/**'`.

## (f) Rebuild check

From a clean tree at `0dc2c588`, write the 18 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:

```bash
# Product gate. On the merge also exclude docs/**, because main added the
# step-05a rebuild record and its QA review after 0dc2c588; those are not
# this step. The branch itself did not touch docs, so the same command
# without ':!docs/**' at the code head is the QA measure and is also
# 350 + 44 = 394.
git diff --shortstat 0dc2c588..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5b-abilities/**' ':!docs/**'
#   17 files changed, 350 insertions(+), 44 deletions(-)

git diff --shortstat 0dc2c588..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5b-abilities/**'   # at the code head or r1 tip
#   17 files changed, 350 insertions(+), 44 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat 0dc2c588..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

sha256sum handoff/steps/tests/s4c-stages-maps/smoke.mjs
#   d885c3e8f895c3c67635d48defb5edeb38039e3429c93e497640b3b55aa7e5ab

npm ci && npm run green   # 1074 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ wired list matches the play adapter
#   ✔ panel layout: 18 knobs, 7 questions, 5 in one, at 360
#   ✔ unknown knob type is read-only
#   ✔ ability panel

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5b-abilities/smoke.mjs . 8803
#   ok 1-8 (including 8 targets) @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5a-units/smoke.mjs . 8802
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
#   ok 1-7 and 8 targets @390, ok 1-7 and 8 targets @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s5b smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s5b-abilities/smoke.mjs` is 84.
# `node tools/maker/build.ts` writes stamp d813576e8f59.
```

Against the merge tree: on your rebuild branch, `git diff c66760b7 HEAD -- src/rules/behaviours/wired.ts src/rules/behaviours/index.ts src/editor/unit/panel.ts tools/maker/ability-panel.ts tools/maker/stage.ts tools/maker/stage-sheets.ts tools/maker/test-launch.ts tools/maker/units.ts tools/maker/home.ts tools/maker/app.css tools/play-stage/page.ts tools/play-stage/project.ts tests/rules/wired.test.ts tests/editor/ability-panel.test.ts tests/editor/stage-place.test.ts tests/tools/ability-panel-layout.test.ts tests/fixtures/maker/big-ability.json handoff/steps/tests/s5b-abilities/smoke.mjs` must be empty. The blob table below lists the exact git blob id each file must have at `c66760b7`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. The product and test blobs (everything except the hand-back) must also match r1 code head `4e58c390`.

## QA non-blockers carried forward

From QA:28-34. None of these blocked the PR. They should be carried into 5c or a later data step where relevant.

1. **Empty `play: army`.** Correctly left in place at `tools/play-stage/project.ts:33-34` (guide L259). Units made on an Empty project cannot be Tested until the empty template grows a `unit-roster` setup or the adapter gets a default. HB § Next step names only 5c (+ Add ability, after catalogue rev 30 is on main; HB:189-190). Not a product fail; 5a's hand-back had restated this carry (QA:29). Carry it to the next step.
2. **HB:168 overclaims shots 02 and 03.** The caption says shot 02 shows both abilities, Test, × and ▶ Test, and shot 03 shows Range and Damage. Those controls are below the fold in the committed 390×844 frames. The smoke and checks 2 / 3 cover them. Screenshots are not the builder's gate (guide L194; QA:26, QA:32). Qualify the captions; no product change.
3. **Toast at 360.** The project editor hides the toast while it is open (`home.ts:35`). On the stage, while the unit editor is open, the toast is `.toast.above` (`home.ts:30`, L34; `app.css:48`). At 360×844 the toast is 16,16 328×76. It overlaps only the stage topbar (`s:back`, `s:view`, `s:fresh`, `s:test`), which already sits behind the scrim (z-index 5) and is not a target while the editor is open. `u:back` and the sheet controls are below it and unobstructed. The toast's own Undo is 48 px (QA:31).
4. **Occupied sheet** still says “A unit stands here” (`stage.ts:149`). Frozen s4a check 4 requires that sentence (`handoff/steps/tests/s4a-stage-paint/smoke.mjs:28`). Named at HB:181. Paint rows under the block are unchanged. Edit / Move / Delete / Test and an NPC's “What do they do?” are `.btn` (QA:30).
5. **Named overruns**, guidance only (guide L95): `tools/maker/stage.ts` is 30 vs 25; `tools/maker/test-launch.ts` is 11 vs 10; `tools/play-stage/page.ts` is 24 vs 15 (`board.ts` 0); `tools/play-stage/project.ts` is 2 vs 1; `tests/editor/stage-place.test.ts` is 2 vs 1. The total is 394 ≤ 400. r1 names all five, plus the extras `home.ts` 49, `units.ts` 22, `app.css` 6 and `index.ts` 1 (HB:185-186; QA:15).
6. **Chrome / Node.** HB:42 is a Playwright headless shell (HeadlessChrome/156.0.8078.4). QA re-ran with `/usr/bin/google-chrome` 156.0.8078.47. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (QA's box was v24.22.1). `npm ci` was not re-run on the hand-back pass (HB:28); the lockfile matched the `node_modules` used (QA:33).
7. The 4a/4b/4c/5a carries are still open except the 5a `stage.ts:31` pin, which 5b was required to retire: `chosen()` is now at `tools/maker/stage.ts:36-42`, uncapped stage undo (`src/editor/stage/undo.ts`), the maker-law plant dir with no `try/finally`, the talk skeleton `createdAt`, session-only unused delete, and Path and Dirt hidden (QA:34). `who()` still maps any other list to “Enemy” (`tools/maker/rooms.ts:41`). `usedBy` still walks live stages only. The `mapAt[id] ??` fallback in `src/project/load/drops.ts:43` and the `resizeMap` 0 defaults at `src/editor/stage/resize.ts:37` were not edited.

## Blob check

Each file must have exactly this git blob id at `c66760b7`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/rules/behaviours/wired.ts` | `4b9935931335ca7ef561ccff8d3c4d20a508851c` | 7 |
| `src/rules/behaviours/index.ts` | `131981ea7a3e25bff9a5cf2fed7525eb5e27507d` | 6 |
| `src/editor/unit/panel.ts` | `9e72cdc6cb3fda90d9789e8655039018d9fa0a53` | 54 |
| `tools/maker/ability-panel.ts` | `fb5a81a0611360f3e772bde0a5775a31840f1dfa` | 84 |
| `tools/maker/stage.ts` | `6b3d2f17c1814c82e9d264fe20e924fd97d791a4` | 263 |
| `tools/maker/stage-sheets.ts` | `be80af86fec73738e2c8f3aa11e77e702a53d69d` | 8 |
| `tools/maker/test-launch.ts` | `bacdd3d5263e80781d89a6839af0c204211b2f0f` | 42 |
| `tools/maker/units.ts` | `2ca96d762c2916824de1eda7b773c3801b1fdea5` | 172 |
| `tools/maker/home.ts` | `7bad67111b1bcbbe1dd18d89e113e4c9b1b827bf` | 141 |
| `tools/maker/app.css` | `7aa3d37532d3c4dbeba4d218c11e5d8c385461ac` | 51 |
| `tools/play-stage/page.ts` | `64dacdf9220c6e4dc35ed789508b670ee3e63b98` | 80 |
| `tools/play-stage/project.ts` | `1e7b33bc62714055c1cb490930d7eaf5f61191a5` | 72 |
| `tests/rules/wired.test.ts` | `2555f21ae517b5e287d0867d9da81a4c4e832103` | 36 |
| `tests/editor/ability-panel.test.ts` | `90e0ab422260507221b988c5ccf5c283edb71c07` | 42 |
| `tests/editor/stage-place.test.ts` | `e78ccce2b33aa475600fd556f18d5923b9055e1e` | 73 |
| `tests/tools/ability-panel-layout.test.ts` | `f071e796f841c7ba193707ae08384dc81c5cfcb2` | 21 |
| `tests/fixtures/maker/big-ability.json` | `780dabb16c446c588b7567eb31f62de83f5ea67b` | 1 |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | `e4aa5477c616e04a8a061fba0f7d5254197c59fb` | 84 |

## Appendix: full code as merged (step 5b, PR #88)

New files are given in full. Edited files are given as the exact diff from `0dc2c588` to `c66760b7`, then in full as merged. Copy them byte for byte; the blob table checks you did. Product, tests and smokes are identical to r1 code head `4e58c390`. The hand-back is the r1 file at the tip.

### `src/rules/behaviours/wired.ts` (new)

```ts
/** Knob ids `playDocsOf` reads. Ids only, no rules. */
export const WIRED: Readonly<Record<string, readonly string[]>> = {
  "unit-roster": ["unit_hp", "unit_atk"],
  "basic-attack": ["reach_mode", "custom_ns", "custom_ew"],
  "line-shot": ["range", "damage"],
  talk: ["line"],
};
```

### `src/editor/unit/panel.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type PanelRole = "card" | "row" | "off";
export type PanelOpt = string | { readonly value: string; readonly label: string };
export type PanelKnob = { readonly id: string; readonly label: string; readonly type: string; readonly value: unknown; readonly def: unknown; readonly min?: number; readonly max?: number; readonly step?: number; readonly max_len?: number; readonly options?: readonly PanelOpt[]; readonly builtin?: readonly string[] };
export type PanelSection = { readonly question: string; readonly knobs: readonly PanelKnob[]; readonly open: boolean };
export type PanelModel = { readonly role: PanelRole; readonly name: string; readonly sections: readonly PanelSection[] };
export const aimKind = (id: string): "basic" | "spell" | undefined => id === "basic-attack" ? "basic" : id === "line-shot" ? "spell" : undefined;
export const badge = (unit: Obj): number => list(unit["setupIds"]).filter((id) => typeof id === "string").length;
export const detach = (unit: Obj, setupId: string): Obj => ({ ...unit, setupIds: list(unit["setupIds"]).filter((id) => id !== setupId) });
export const setAnswer = (answers: Obj, id: string, value: unknown, def: unknown): Obj => ({ ...answers, [id]: Object.is(value, def) ? { source: "default" } : { source: "user", value, rev: 1 } });
export const resetAnswer = (answers: Obj, id: string): Obj => ({ ...answers, [id]: { source: "default" } });
const readValue = (answers: Obj, id: string, fallback: unknown): unknown => { const row = answers[id]; return isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value") ? row["value"] : fallback; };
function knobOf(knob: Obj, answers: Obj): PanelKnob | null {
  if (typeof knob["id"] !== "string" || typeof knob["label"] !== "string" || typeof knob["type"] !== "string") return null;
  const options: PanelOpt[] = [];
  if (Array.isArray(knob["options"])) for (const item of knob["options"]) { if (typeof item === "string") options.push(item); else if (isObj(item) && typeof item["value"] === "string" && typeof item["label"] === "string") options.push({ value: item["value"], label: item["label"] }); }
  const ref = knob["ref"], built = isObj(ref) && Array.isArray(ref["builtin"]) ? ref["builtin"].filter((item): item is string => typeof item === "string") : undefined;
  return { id: knob["id"], label: knob["label"], type: knob["type"], value: readValue(answers, knob["id"], knob["default"]), def: knob["default"], ...(typeof knob["min"] === "number" ? { min: knob["min"] } : {}), ...(typeof knob["max"] === "number" ? { max: knob["max"] } : {}), ...(typeof knob["step"] === "number" ? { step: knob["step"] } : {}), ...(typeof knob["max_len"] === "number" ? { max_len: knob["max_len"] } : {}), ...(Array.isArray(knob["options"]) ? { options } : {}), ...(built === undefined ? {} : { builtin: built }) };
}
export function panelOf(slice: Obj, wired: Readonly<Record<string, readonly string[]>>, behaviourId: string, answers: Obj): PanelModel {
  const hit = list(slice["behaviours"]).find((row) => isObj(row) && row["id"] === behaviourId), row = isObj(hit) ? hit : null;
  if (row === null) return { role: "off", name: behaviourId, sections: [] };
  const allow = new Set(wired[behaviourId] ?? []), byId = new Map<string, Obj>();
  for (const knob of list(row["knobs"])) if (isObj(knob) && typeof knob["id"] === "string") byId.set(knob["id"], knob);
  const sections: PanelSection[] = [];
  for (const block of list(row["menu_order"])) {
    if (!isObj(block) || typeof block["question"] !== "string") continue;
    const knobs: PanelKnob[] = [];
    for (const key of list(block["knob_ids"])) {
      if (typeof key !== "string" || !allow.has(key)) continue;
      const spec = byId.get(key); if (spec === undefined || (list(spec["depends_on"]).length > 0 && !(isObj(spec["active_when"]) && typeof spec["active_when"]["knob"] === "string" && readValue(answers, spec["active_when"]["knob"], byId.get(spec["active_when"]["knob"])?.["default"]) === spec["active_when"]["eq"]))) continue;
      const view = knobOf(spec, answers); if (view !== null) knobs.push(view);
    }
    if (knobs.length > 0) sections.push({ question: block["question"], knobs, open: sections.length === 0 });
  }
  const comp = list(row["composable_as"]), role: PanelRole = comp.includes("primary") ? "card" : comp.includes("rider") || comp.includes("scaler") || comp.includes("trigger") ? "row" : "off";
  return { role, name: typeof row["name"] === "string" ? row["name"] : behaviourId, sections };
}
export function stageFor(files: Readonly<Record<string, unknown>>, unitId: string): string | null {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear0 = isObj(project["loadout"]) ? project["loadout"] : {};
  for (const id of list(project["stages"])) {
    if (typeof id !== "string") continue;
    let stage: Obj | null = null;
    for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === id) stage = doc;
    if (stage === null) continue;
    const gear = isObj(stage["loadout"]) ? stage["loadout"] : gear0;
    if ([...list(gear["required"]), ...list(gear["roster"])].includes(unitId)) return id;
    if (list(stage["neutrals"]).some((n) => isObj(n) && n["unitId"] === unitId)) return id;
    const pool = stage["enemyPool"]; if (isObj(pool) && list(pool["entries"]).some((entry) => isObj(entry) && entry["unitId"] === unitId)) return id;
  }
  return null;
}
```

### `tools/maker/ability-panel.ts` (new)

```ts
import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
let openId = "";
export function abilityShut(): void { openId = ""; }
export type AbilityPlay = { readonly unitId: string; readonly abilityId?: string; readonly aim?: "basic" | "spell"; readonly stageId: string };
export type AbilityEdit = { readonly keep: true } | { readonly play: AbilityPlay } | { readonly bag: Record<string, Obj>; readonly toast: string };
const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label, type: knob.type, ...(knob.min === undefined ? {} : { min: knob.min }), ...(knob.max === undefined ? {} : { max: knob.max }), ...(knob.step === undefined ? {} : { step: knob.step }), ...(knob.max_len === undefined ? {} : { max_len: knob.max_len }), ...(knob.options === undefined ? {} : { options: knob.options }), ...(knob.builtin === undefined ? {} : { builtin: knob.builtin }) });
export function panelHtml(model: PanelModel): string {
  const body = model.sections.map((section) => `<details class="ability"${section.open ? " open" : ""}><summary>${esc(section.question)}</summary>${section.knobs.map((knob) => `${knobWidget(specOf(knob), knob.value)}<button type="button" class="btn ghost" data-act="a:reset:${esc(knob.id)}">Reset to default</button>`).join("")}</details>`).join("");
  return `<div class="ability">${body}</div>`;
}
function rowsOf(bag: Record<string, Obj>, unit: Obj, slice: Obj, skip: string): string {
  let html = "";
  for (const sid of list(unit["setupIds"])) {
    if (typeof sid !== "string" || sid === skip) continue;
    const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") continue;
    const model = panelOf(slice, WIRED, setup["behaviourId"], isObj(setup["answers"]) ? setup["answers"] : {});
    if (model.role !== "row") continue;
    html += `<p class="row" data-role="row">${esc(model.name)}</p>${panelHtml(model)}`;
  }
  return html;
}
export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boolean): string {
  const slice = bag["catalogue/slice.json"]; if (!isObj(slice)) return "";
  const id = typeof unit["id"] === "string" ? unit["id"] : "", placed = stageFor(bag, id), ids = list(unit["setupIds"]).filter((item): item is string => typeof item === "string");
  if (openId !== "" && !ids.includes(openId)) openId = "";
  const open = bag[`setups/${openId}.json`];
  if (openId !== "" && isObj(open) && typeof open["behaviourId"] === "string") {
    const model = panelOf(slice, WIRED, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {});
    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${rowsOf(bag, unit, slice, openId)}`;
  }
  const cards = ids.flatMap((sid) => {
    const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return [];
    const model = panelOf(slice, WIRED, setup["behaviourId"], isObj(setup["answers"]) ? setup["answers"] : {});
    if (model.role !== "card") return [];
    const test = placed === null ? "" : `<button type="button" class="btn" data-act="a:test:${esc(sid)}">Test</button>`;
    const drop = readOnly ? "" : `<button type="button" class="btn" data-act="a:drop:${esc(sid)}" aria-label="Remove ${esc(model.name)}">×</button>`;
    return [`<div class="card" data-role="card"><button type="button" class="grow card-hit" data-act="a:open:${esc(sid)}"><span class="name">${esc(model.name)}</span></button>${test}${drop}</div>`];
  }).join("");
  const whole = placed === null ? `<p>Place this unit on a stage to test it.</p>` : `<button type="button" class="btn" data-act="a:test">▶ Test</button>`;
  return `<h2>Abilities</h2>${cards}${whole}`;
}
function clamp(knob: PanelKnob, value: number): number {
  const min = knob.min ?? value, max = knob.max ?? value, step = knob.step !== undefined && knob.step > 0 ? knob.step : 1;
  return Math.min(max, Math.max(min, Math.round((value - min) / step) * step + min));
}
function writeKnob(bag: Record<string, Obj>, key: string, raw: unknown, reset: boolean): AbilityEdit {
  const setup = bag[`setups/${openId}.json`], slice = bag["catalogue/slice.json"];
  if (!isObj(setup) || !isObj(slice) || typeof setup["behaviourId"] !== "string") return { keep: true };
  const answers = isObj(setup["answers"]) ? setup["answers"] : {};
  const knob = panelOf(slice, WIRED, setup["behaviourId"], answers).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key);
  if (knob === undefined) return { keep: true };
  const value = knob.type === "slider" && typeof raw === "string" ? clamp(knob, Number(raw)) : knob.type === "toggle" ? raw === true : raw;
  if (knob.type === "slider" && typeof value === "number" && !Number.isFinite(value)) return { keep: true };
  const next = reset ? resetAnswer(answers, key) : setAnswer(answers, key, value, knob.def);
  return { bag: { ...bag, [`setups/${openId}.json`]: { ...setup, answers: next } }, toast: "Changed · Undo" };
}
export function abilityAct(act: string, bag: Record<string, Obj>, unitId: string): AbilityEdit {
  const path = `units/${unitId}.json`, unit = bag[path];
  if (!isObj(unit)) return { keep: true };
  if (act === "a:shut") { openId = ""; return { keep: true }; }
  if (act.startsWith("a:open:")) { openId = act.slice(7); return { keep: true }; }
  if (act === "a:test" || act.startsWith("a:test:")) {
    const stageId = stageFor(bag, unitId); if (stageId === null) return { keep: true };
    const abilityId = act === "a:test" ? undefined : act.slice(7);
    const setup = abilityId === undefined ? undefined : bag[`setups/${abilityId}.json`];
    const behaviour = isObj(setup) && typeof setup["behaviourId"] === "string" ? setup["behaviourId"] : "";
    const aim = aimKind(behaviour);
    return { play: { unitId, stageId, ...(abilityId === undefined ? {} : { abilityId }), ...(aim === undefined ? {} : { aim }) } };
  }
  if (act.startsWith("a:drop:")) { const id = act.slice(7); if (openId === id) openId = ""; return { bag: { ...bag, [path]: detach(unit, id) }, toast: "Changed · Undo" }; }
  if (act.startsWith("a:reset:")) return writeKnob(bag, act.slice(8), undefined, true);
  const cut = (head: string): [string, string] => { const rest = act.slice(head.length), at = rest.indexOf(":"); return [rest.slice(0, at), rest.slice(at + 1)]; };
  if (act.startsWith("a:set:")) { const [key, value] = cut("a:set:"); return writeKnob(bag, key ?? "", value, false); }
  if (act.startsWith("k:pick:") || act.startsWith("k:colour:")) { const [key, value] = cut(act.startsWith("k:pick:") ? "k:pick:" : "k:colour:"); return writeKnob(bag, key ?? "", value, false); }
  if (act.startsWith("k:toggle:")) { const key = act.slice(9), setup = bag[`setups/${openId}.json`], slice = bag["catalogue/slice.json"]; const answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {}; const behaviour = isObj(setup) && typeof setup["behaviourId"] === "string" ? setup["behaviourId"] : ""; const knob = isObj(slice) ? panelOf(slice, WIRED, behaviour, answers).sections.flatMap((section) => [...section.knobs]).find((item) => item.id === key) : undefined; return writeKnob(bag, key, knob?.value !== true, false); }
  return { keep: true };
}
```

### `tests/rules/wired.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { readProject } from "../../src/project/load/index.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const opt = (item: unknown): string => typeof item === "string" ? item : isObj(item) && typeof item["value"] === "string" ? item["value"] : "";
test("wired list matches the play adapter", () => {
  const parsed = parseProject(walk("fixtures/demo.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const load = readProject(parsed.files), project = load.project; assert.equal(project !== null, true); if (project === null) return;
  const behaviours = project.slice["behaviours"]; if (!Array.isArray(behaviours)) return;
  const base = playDocsOf(project), setups = project.setups;
  for (const beh of behaviours) {
    if (!isObj(beh) || typeof beh["id"] !== "string" || !Object.hasOwn(WIRED, beh["id"]) || !Array.isArray(beh["knobs"])) continue;
    const id = beh["id"], wired = new Set(WIRED[id] ?? []), owned = Object.entries(setups).filter(([, setup]) => setup["behaviourId"] === id);
    assert.equal(owned.length, 1, id); const hit = owned[0]; if (hit === undefined) continue; const [sid, setup] = hit;
    for (const knob of beh["knobs"]) {
      if (!isObj(knob) || typeof knob["id"] !== "string") continue;
      const key = knob["id"], answers = isObj(setup["answers"]) ? structuredClone(setup["answers"]) as Obj : {}, row = answers[key], cur = isObj(row) && Object.hasOwn(row, "value") ? row["value"] : knob["default"];
      const picked = knob["type"] === "picker" && Array.isArray(knob["options"]) ? knob["options"].map(opt).find((item) => item !== "" && item !== cur) : undefined;
      const value = key === "reach_mode" ? "orth-only-1" : knob["type"] === "slider" ? (cur === knob["max"] ? knob["min"] : knob["max"]) : knob["type"] === "toggle" ? cur !== true : picked !== undefined ? picked : typeof cur === "string" ? `${cur} x` : "x";
      if (wired.has(key) && isObj(knob["active_when"]) && typeof knob["active_when"]["knob"] === "string") answers[knob["active_when"]["knob"]] = { source: "user", value: knob["active_when"]["eq"], rev: 1 };
      answers[key] = { source: "user", value, rev: 1 };
      const next = playDocsOf({ ...project, setups: { ...setups, [sid]: { ...setup, answers } } });
      if (wired.has(key)) assert.notDeepEqual(next, base, `${id}.${key}`); else assert.deepEqual(next, base, `${id}.${key}`);
      if (key === "reach_mode") { let owner = ""; for (const [unit, doc] of Object.entries(project.units)) if (isObj(doc) && Array.isArray(doc["setupIds"]) && doc["setupIds"].some((item: unknown) => item === sid)) owner = unit; assert.equal(next.rules.reach?.[owner], 1); }
    }
  }
});
```

### `tests/editor/ability-panel.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { badge, detach, panelOf, resetAnswer, setAnswer, stageFor } from "../../src/editor/unit/panel.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { abilityAct, abilityShut, abilityView, panelHtml } from "../../tools/maker/ability-panel.ts";
import { openUnit, unitEditing } from "../../tools/maker/units.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { readProject } from "../../src/project/load/index.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const idsOf = (slice: Obj, id: string, answers: Obj): string[] => panelOf(slice, WIRED, id, answers).sections.flatMap((section) => section.knobs.map((knob) => knob.id));
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
test("ability panel", () => {
  openUnit(ARCHER); assert.equal(unitEditing(), true);
  const parsed = parseProject(walk("fixtures/demo.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const load = readProject(parsed.files), project = load.project; assert.equal(project !== null, true); if (project === null) return;
  const slice = project.slice, bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc;
  assert.deepEqual(idsOf(slice, "line-shot", {}), ["range", "damage"]);
  assert.equal(idsOf(slice, "basic-attack", {}).some((id) => id === "custom_ns" || id === "custom_ew"), false);
  const live = { reach_mode: { source: "user", value: "custom-cross", rev: 1 } }; assert.equal(idsOf(slice, "basic-attack", live).includes("custom_ns") && idsOf(slice, "basic-attack", live).includes("custom_ew"), true);
  const cleared = setAnswer({ range: { source: "user", value: 4, rev: 1 } }, "range", 3, 3); assert.deepEqual(cleared["range"], { source: "default" }); assert.equal(isObj(cleared["range"]) && Object.hasOwn(cleared["range"], "value"), false);
  assert.deepEqual(resetAnswer(cleared, "range")["range"], { source: "default" });
  const unit = bag[`units/${ARCHER}.json`]; assert.ok(isObj(unit)); if (!isObj(unit)) return;
  const dropped = detach(unit, LINE); assert.equal(badge(unit), 2); assert.equal(badge(dropped), 1); assert.equal(Array.isArray(dropped["setupIds"]) && dropped["setupIds"].includes(LINE), false); assert.ok(bag[`setups/${LINE}.json`] !== undefined);
  assert.equal(panelOf(slice, WIRED, "adjacency-synergy", {}).role, "row");
  const rowId = "setup_row", rowBag = { ...bag, [`setups/${rowId}.json`]: { id: rowId, behaviourId: "adjacency-synergy", answers: {} }, [`units/${ARCHER}.json`]: { ...unit, setupIds: [...(Array.isArray(unit["setupIds"]) ? unit["setupIds"] : []), rowId] } };
  abilityShut(); abilityAct(`a:open:${LINE}`, rowBag, ARCHER); const html = abilityView(rowBag, rowBag[`units/${ARCHER}.json`] ?? {}, false);
  assert.match(html, /data-role="row"/); assert.equal(html.includes('class="card"'), false); assert.equal(html.includes('class="row"'), true);
  const setup = project.setups[LINE], answers = setAnswer(isObj(setup?.["answers"]) ? setup["answers"] as Obj : {}, "range", 4, 3);
  const played = playDocsOf({ ...project, setups: { ...project.setups, [LINE]: { ...setup, answers } } }); assert.equal(played.rules.abilities?.[ARCHER]?.[0]?.reach, 4);
  assert.equal(stageFor(bag, ARCHER) !== null, true); assert.equal(stageFor(bag, "unit_missing"), null);
  abilityShut(); const lonely = abilityView(bag, { id: "unit_missing", setupIds: [] }, false); assert.match(lonely, /Place this unit on a stage to test it\./); assert.equal(lonely.includes("a:test"), false);
});
test("unknown knob type is read-only", () => {
  const html = panelHtml({ role: "card", name: "Odd", sections: [{ question: "Q", knobs: [{ id: "z", label: "Odd", type: "matrix", value: 1, def: 1 }], open: true }] });
  assert.equal(html.includes("Not editable here"), true);
});
```

### `tests/tools/ability-panel-layout.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { panelOf } from "../../src/editor/unit/panel.ts";
import { panelHtml } from "../../tools/maker/ability-panel.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
type Obj = Record<string, unknown>;
test("panel layout: 18 knobs, 7 questions, 5 in one, at 360", () => {
  const doc = JSON.parse(readFileSync(join(root, "tests/fixtures/maker/big-ability.json"), "utf8")) as Obj;
  const ids = Array.isArray(doc["knobs"]) ? doc["knobs"].flatMap((knob) => typeof knob === "object" && knob !== null && "id" in knob && typeof knob.id === "string" ? [knob.id] : []) : [];
  const model = panelOf({ behaviours: [doc] }, { big: ids }, "big", {}), html = panelHtml(model), order = model.sections.flatMap((section) => section.knobs.map((knob) => knob.id));
  assert.equal(model.sections.length, 7); assert.equal(model.sections[0]?.open, true); assert.equal(model.sections[0]?.knobs.length, 5);
  assert.equal(model.sections.some((section) => section.knobs.length === 5), true); assert.deepEqual(order, ids);
  assert.equal((html.match(/<details/g) ?? []).length, 7); assert.equal(html.startsWith('<div class="ability"><details class="ability" open>'), true);
  assert.equal(ids.every((id, i) => i === 0 || html.indexOf(`data-knob="${id}"`) > html.indexOf(`data-knob="${ids[i - 1] ?? id}"`)), true);
  const css = readFileSync(join(root, "tools/maker/app.css"), "utf8");
  for (const rule of css.split("}")) if (rule.includes(".ability")) assert.equal(/position\s*:\s*fixed|max-height/.test(rule), false, rule);
  assert.match(css, /\.ability[^{]*\{[^}]*max-width:\s*100%/); assert.equal(html.includes("width:"), false);
});
```

### `tests/fixtures/maker/big-ability.json` (new)

```json
{"id":"big","name":"Big ability","composable_as":["primary"],"knobs":[{"id":"k1","label":"K1","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k2","label":"K2","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k3","label":"K3","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k4","label":"K4","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k5","label":"K5","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k6","label":"K6","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k7","label":"K7","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k8","label":"K8","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k9","label":"K9","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k10","label":"K10","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k11","label":"K11","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k12","label":"K12","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k13","label":"K13","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k14","label":"K14","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k15","label":"K15","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k16","label":"K16","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k17","label":"K17","type":"slider","default":1,"min":1,"max":4,"step":1},{"id":"k18","label":"K18","type":"slider","default":1,"min":1,"max":4,"step":1}],"menu_order":[{"question":"Q1","knob_ids":["k1","k2","k3","k4","k5"]},{"question":"Q2","knob_ids":["k6","k7","k8"]},{"question":"Q3","knob_ids":["k9","k10"]},{"question":"Q4","knob_ids":["k11","k12"]},{"question":"Q5","knob_ids":["k13","k14"]},{"question":"Q6","knob_ids":["k15","k16"]},{"question":"Q7","knob_ids":["k17","k18"]}]}
```

### `handoff/steps/tests/s5b-abilities/smoke.mjs` (new)

```js
// Step 5b abilities. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5b-abilities/smoke.mjs . 8803
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8803"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5b-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005";
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await step("1 sheet", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Archer · Your team", null, { timeout: 15000 });
      const got = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent));
      if (["Edit", "Move", "Delete", "Test"].some((name) => !got.includes(name))) throw new Error(got.join("|"));
      await shot("01-unit-sheet"); tiny.push(...await big());
    });
    await step("2 list", async () => {
      await tap(page, "s:edit"); await page.waitForFunction(() => document.body.innerText.includes("Basic Attack (reach and damage)") && document.body.innerText.includes("Line Shot (stops on first hit)"), null, { timeout: 15000 });
      const got = await page.evaluate((line) => { const card = document.querySelector(`[data-act="a:open:${line}"]`)?.closest(".card"); const acts = [...(card?.querySelectorAll("[data-act]") ?? [])].map((el) => el.getAttribute("data-act")); return { acts, star: document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent }; }, LINE);
      if (!got.acts.includes(`a:test:${LINE}`) || !got.acts.some((act) => act?.startsWith("a:drop:")) || got.star !== "✦2") throw new Error(JSON.stringify(got));
      await shot("02-ability-list"); tiny.push(...await big());
    });
    await step("3 range", async () => {
      await tap(page, `a:open:${LINE}`);
      await page.waitForFunction(() => [...document.querySelectorAll(".ability summary")].map((n) => n.textContent).join("|") === "Which directions, and how far?|How much damage, and what kind of hit?", null, { timeout: 15000 });
      const knobs = await page.evaluate(() => [...document.querySelectorAll(".ability [data-knob]")].map((el) => el.getAttribute("data-knob")));
      if (knobs.join("|") !== "range|damage") throw new Error(knobs.join("|"));
      await page.locator('.ability [data-knob="range"]').evaluate((el) => { el.value = "4"; el.dispatchEvent(new Event("input", { bubbles: true })); });
      await page.waitForFunction(() => document.querySelector('.ability [data-val="range"]')?.textContent === "4", null, { timeout: 15000 });
      await shot("03-ability-panel"); tiny.push(...await big());
      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:open:${LINE}`); await page.waitForFunction(() => document.querySelector('.ability [data-val="range"]')?.textContent === "4", null, { timeout: 15000 });
      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
    });
    await step("4 test aim", async () => {
      await tap(page, `a:test:${LINE}`); await page.waitForFunction(() => window.__play !== undefined && window.__docs !== undefined, null, { timeout: 15000 });
      const live = await page.evaluate((id) => { const play = window.__play, unit = play.world.units.get(play.selected), aims = play.aims, reach = window.__docs.rules.abilities?.[id]?.[0]?.reach; return { id: unit?.unitId, side: unit?.side, me: play.sides.me, aim: play.aimKind, phase: play.world.phases.battle, reach, line: !!unit && aims.length > 0 && aims.every((c) => c.c === unit.at.c || c.r === unit.at.r), north: !!unit && aims.some((c) => c.c === unit.at.c && c.r === unit.at.r - reach) }; }, ARCHER);
      if (live.id !== ARCHER || live.side !== live.me || live.aim !== "spell" || live.phase !== "targeting" || live.reach !== 4 || !live.line || !live.north) throw new Error(JSON.stringify(live));
      await shot("04-test-start"); await press(page, "Back to maker");
      await page.waitForFunction((line) => document.querySelector(`[data-act="a:drop:${line}"]`) !== null, LINE, { timeout: 15000 });
    });
    await step("5 undo", async () => {
      await tap(page, `a:drop:${LINE}`); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent === "✦1", null, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent === "✦2", null, { timeout: 15000 });
    });
    await step("6 whole", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector('[data-act="s:edit"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="a:test"]') !== null, null, { timeout: 15000 });
      await tap(page, "a:test"); await page.waitForFunction((id) => { const play = window.__play, unit = play?.world.units.get(play.selected); return unit?.unitId === id && unit.side === play.sides.me; }, ARCHER, { timeout: 15000 });
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
    });
    await step("7 nowhere", async () => {
      if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
      await page.waitForFunction(() => document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:back"); await waitText(page, "+ Add unit"); await tap(page, "u:add");
      await page.waitForFunction(() => document.querySelector("[data-unit]") !== null, null, { timeout: 15000 }); await page.locator("[data-unit]").fill("Spare"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Spare" && document.body.innerText.includes("Place this unit on a stage to test it."), null, { timeout: 15000 });
      const shown = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].some((el) => { const act = el.getAttribute("data-act") ?? ""; return act === "a:test" || act.startsWith("a:test:") || act === "s:try"; }));
      if (shown) throw new Error("test shown");
    });
    check(`8 targets @${width}`, tiny.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `src/rules/behaviours/index.ts` (edited)

```diff
diff --git a/src/rules/behaviours/index.ts b/src/rules/behaviours/index.ts
index 748c34b..131981e 100644
--- a/src/rules/behaviours/index.ts
+++ b/src/rules/behaviours/index.ts
@@ -3,3 +3,4 @@ export { CATALOGUE, GATE_DEFAULTS, TERRAIN_KNOBS, TILE_TYPES, XP_LEVELS_KNOBS }
 export { createRegistry, installOne, installSetups, outOf, resolveKnob } from "./registry.ts";
 export { XP_LEVELS } from "./xp-levels.ts";
 export { TERRAIN, type TerrainOut } from "./terrain.ts";
+export { WIRED } from "./wired.ts";
```

Full file as merged:

```ts
export type { BehaviourDef, Installed, KnobReader, KnobSpec, KnobUnsupported, Layer, Registry, Resolved, SetupIn, SetupLayers } from "./types.ts";
export { CATALOGUE, GATE_DEFAULTS, TERRAIN_KNOBS, TILE_TYPES, XP_LEVELS_KNOBS } from "./catalogue.ts";
export { createRegistry, installOne, installSetups, outOf, resolveKnob } from "./registry.ts";
export { XP_LEVELS } from "./xp-levels.ts";
export { TERRAIN, type TerrainOut } from "./terrain.ts";
export { WIRED } from "./wired.ts";
```

### `tests/editor/stage-place.test.ts` (edited)

```diff
diff --git a/tests/editor/stage-place.test.ts b/tests/editor/stage-place.test.ts
index a15c1fd..e78ccce 100644
--- a/tests/editor/stage-place.test.ts
+++ b/tests/editor/stage-place.test.ts
@@ -50,7 +50,7 @@ test("place rows, moves, talk and start new", async () => {
   const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
   const srcFiles = ["src/editor/stage/talk.ts", "src/editor/stage/place.ts", "src/editor/stage/paint.ts", "tools/maker/stage.ts", "tools/maker/stage-sheets.ts"];
   const hits = srcFiles.flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}: ${line.trim()}`] : [])));
-  assert.deepEqual(hits, ["tools/maker/stage.ts:31: function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {"]);
+  assert.deepEqual(hits, []);
   const text = readDir("fixtures/demo.tileproj"), parsed = parseProject(text); assert.equal(parsed.ok, true); if (!parsed.ok) return;
   const bare = structuredClone(parsed.files[MAP]) as Obj; bare["playerSpawns"] = []; bare["neutrals"] = []; bare["enemyPool"] = { mode: "fixed", entries: [] };
   bindStage(STAGE, "none"); const quiet = stageScreen(STAGE, { files: { ...text, [MAP]: JSON.stringify(bare) }, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false });
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev, ulid } from "../../src/editor/project/home.ts";
import { startNew } from "../../src/editor/stage/paint.ts";
import { addEnemy, addNeutral, addSpawn, attachTalk, hasEnemies, hasPlayer, infoText, moveEntry, placeRows, refuse, removeEntry, standHere } from "../../src/editor/stage/place.ts";
import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
import { readProject } from "../../src/project/load/index.ts";
import { readSetup } from "../../src/project/read/setups.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, rememberTalk, stageClick, stageLine, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), STAGE = "stage_01JDAS00000000000000000001", MAP = "stages/stage_01JDAS00000000000000000001.json", NOW = "2026-11-19T00:00:00.000Z", CLERIC = "unit_01JDAN00000000000000000003";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const readDir = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } }; walk(join(root, rel), ""); return out; };
const rest = (doc: Obj, key: string): Obj => Object.fromEntries(Object.entries(doc).filter(([k]) => k !== key));
const skeleton = (): Obj => { const parsed = parseProject({ "setups/setup.talk.json": readFileSync(join(root, "data/templates/setup.talk.json"), "utf8") }); if (!parsed.ok) throw new Error(parsed.message); const doc = parsed.files["setups/setup.talk.json"]; if (!isObj(doc)) throw new Error("skeleton"); return doc; };
test("talk skeleton loads", () => { assert.equal(readSetup(skeleton()).ok, true); });
test("talk limit: slice matches format", () => {
  const said = readFileSync(join(root, "docs/maker/data/project-format.md"), "utf8").match(/`line` \(text, max (\d+) code points\)/);
  const slice = JSON.parse(readFileSync(join(root, "fixtures/demo.tileproj/catalogue/slice.json"), "utf8")) as Obj;
  let max: number | null = null;
  for (const b of list(slice["behaviours"])) if (b["id"] === "talk") for (const knob of list(b["knobs"])) if (knob["id"] === "line" && typeof knob["max_len"] === "number") max = knob["max_len"];
  assert.equal(max, said === null ? null : Number(said[1])); assert.equal(talkLimit(slice), max);
});
test("place rows, moves, talk and start new", async () => {
  const stage: Obj = { history: { cap: 1, ops: [] }, name: "A", playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] } };
  const spawned = addSpawn(stage, { c: 1, r: 2 }); assert.deepEqual(spawned["playerSpawns"], [{ c: 1, r: 2 }]); assert.deepEqual(rest(spawned, "playerSpawns"), rest(stage, "playerSpawns"));
  const npc = addNeutral(stage, "unit_a", { c: 2, r: 2 }); assert.deepEqual(npc["neutrals"], [{ unitId: "unit_a", at: { c: 2, r: 2 } }]); assert.deepEqual(rest(npc, "neutrals"), rest(stage, "neutrals"));
  const foe = addEnemy(stage, "unit_b", { c: 3, r: 2 }); assert.ok(foe !== null); if (foe === null) return;
  assert.deepEqual((foe["enemyPool"] as Obj)["entries"], [{ unitId: "unit_b", at: { c: 3, r: 2 } }]); assert.deepEqual(rest(foe, "enemyPool"), rest(stage, "enemyPool"));
  assert.equal(addEnemy({ enemyPool: { mode: "wave", entries: [] } }, "unit_b", { c: 0, r: 0 }), null);
  assert.deepEqual(placeRows(stage).map((row) => row.label), ["Your team start", "NPC", "Enemy"]); assert.equal(placeRows({ enemyPool: { mode: "wave" } }).some((row) => row.id === "enemy"), false);
  assert.equal(refuse("closed", "Water"), "Water blocks units"); assert.equal(refuse("occupied", "Floor"), "A unit stands here"); assert.equal(refuse(null, "Floor"), null);
  const moved = moveEntry(npc, { list: "npc", index: 0 }, { c: 4, r: 1 }); assert.deepEqual(list(moved["neutrals"])[0]?.["at"], { c: 4, r: 1 }); assert.deepEqual(rest(moved, "neutrals"), rest(npc, "neutrals"));
  const dropped = removeEntry(npc, { list: "npc", index: 0 }); assert.deepEqual(dropped["neutrals"], []); assert.deepEqual(rest(dropped, "neutrals"), rest(npc, "neutrals"));
  const fresh = startNew({ cols: 1, logic: { terrain: [1], palette: {} } }, foe); assert.deepEqual(fresh.stage["playerSpawns"], stage["playerSpawns"]); assert.deepEqual(fresh.stage["neutrals"], []); assert.deepEqual((fresh.stage["enemyPool"] as Obj)["entries"], []); assert.equal(hasEnemies(fresh.stage), false);
  const linked = attachTalk(npc, 0, "setup_x"), stood = standHere(linked, 0); assert.deepEqual(list(linked["neutrals"])[0]?.["setupIds"], ["setup_x"]); assert.equal(Object.hasOwn(list(stood["neutrals"])[0] ?? {}, "setupIds"), false);
  assert.equal(hasPlayer({ playerSpawns: [], neutrals: [] }, 0), false);
  assert.deepEqual(infoText({ playerSpawns: [], neutrals: [], enemyPool: { mode: "fixed", entries: [] } }, 0), ["No enemies: free roam.", "No player side: Test never reaches an outcome."]);
  const knobs = talkKnobs({ behaviours: [{ id: "talk", knobs: [{ id: "line", default: "Hi" }, { id: "effect", default: "none" }, { id: "skip", no_default_reason: "later" }] }] });
  assert.deepEqual([...knobs], [{ id: "line", use: "user" }, { id: "effect", use: "default" }]);
  const made = fillTalk(skeleton(), "setup_01JDAT00000000000000000099", "Cleric", 29, "Hello", knobs), answers = made["answers"];
  assert.ok(isObj(answers)); if (!isObj(answers)) return; assert.deepEqual(answers["line"], { source: "user", value: "Hello" }); assert.deepEqual(answers["effect"], { source: "default" }); assert.equal(Object.hasOwn(answers, "value") || Object.hasOwn(answers, "skip"), false);
  const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
  const srcFiles = ["src/editor/stage/talk.ts", "src/editor/stage/place.ts", "src/editor/stage/paint.ts", "tools/maker/stage.ts", "tools/maker/stage-sheets.ts"];
  const hits = srcFiles.flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}: ${line.trim()}`] : [])));
  assert.deepEqual(hits, []);
  const text = readDir("fixtures/demo.tileproj"), parsed = parseProject(text); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const bare = structuredClone(parsed.files[MAP]) as Obj; bare["playerSpawns"] = []; bare["neutrals"] = []; bare["enemyPool"] = { mode: "fixed", entries: [] };
  bindStage(STAGE, "none"); const quiet = stageScreen(STAGE, { files: { ...text, [MAP]: JSON.stringify(bare) }, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false });
  assert.match(quiet, /No player side: Test never reaches an outcome\./); assert.match(quiet, /No enemies: free roam\./);
  rememberTalk(skeleton()); const id = "project_01JDAP00000000000000000001", io = { store: memoryStore(), id, now: NOW, bytes: () => new Uint8Array(16).fill(1) };
  for (const [path, body] of Object.entries(text)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id); const host: Host = { files: text, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false };
  const open = await stageClick("s:cell:2,8", STAGE, host, io); assert.match(stageScreen(STAGE, open), /Your team start/); assert.match(stageScreen(STAGE, open), />Floor</);
  const ask = await stageClick("s:unit:" + CLERIC, STAGE, await stageClick("s:place:npc", STAGE, open, io), io); assert.match(stageScreen(STAGE, ask), /Just stand here/); assert.equal(stageScreen(STAGE, ask).includes("Hostile"), false);
  const limit = talkLimit(parsed.files["catalogue/slice.json"] as Obj); assert.ok(limit !== null); if (limit === null) return;
  const talking = await stageClick("s:talk-open", STAGE, ask, io); assert.equal([...stageLine(`${"x".repeat(limit)}yy`, limit)].length, limit); stageLine("Smoke hello", limit);
  const saved = await stageClick("s:talk-save", STAGE, talking, io); assert.equal(saved.banner, null);
  const back = parseProject(saved.files); assert.equal(back.ok, true); if (!back.ok) return;
  const load = readProject(back.files); assert.equal(load.ok && load.report.length === 0 && load.project !== null, true); if (load.project === null) return;
  assert.equal(playDocsOf(load.project).talk[`talk-${CLERIC}`], "Smoke hello");
  const setupId = `setup_${ulid(Date.parse(NOW), new Uint8Array(16).fill(1))}`, setup = back.files[`setups/${setupId}.json`]; assert.ok(isObj(setup)); if (!isObj(setup)) return; assert.equal(readSetup(setup).ok, true);
  const cleared = await stageClick("s:stand", STAGE, await stageClick("s:ask", STAGE, await stageClick("s:cell:2,8", STAGE, saved, io), io), io);
  const after = parseProject(cleared.files); assert.equal(after.ok, true); if (!after.ok) return; assert.ok(after.files[`setups/${setupId}.json`] !== undefined);
  const stageDoc = after.files[MAP]; assert.ok(isObj(stageDoc)); if (!isObj(stageDoc)) return; assert.equal(list(stageDoc["neutrals"]).some((entry) => entry["unitId"] === CLERIC && Object.hasOwn(entry, "setupIds")), false);
});
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 2a130f3..6b3d2f1 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -1,3 +1,4 @@
+import { badge, stageFor } from "../../src/editor/unit/panel.ts";
 import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
@@ -11,10 +12,10 @@ import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker }
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 type Obj = Record<string, unknown>;
 type Cell = { readonly c: number; readonly r: number };
-type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number };
+type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number; readonly id: string; readonly n: number };
 type Spot = { list: PlaceList; index: number; name: string };
 export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
-export type StageOut = Host & { readonly leave: boolean; readonly test: boolean };
+export type StageOut = Host & { readonly leave: boolean; readonly test: boolean; readonly unitId?: string; readonly stageId?: string };
 export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes?: () => Uint8Array };
 export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
@@ -28,8 +29,8 @@ export function bindStage(id: string, project: string): void { if (sess.id !== i
 export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
 export function stageLine(value: string, max: number): string { const next = Number.isInteger(max) && max >= 0 ? [...value].slice(0, max).join("") : value; sess.line = next; return next; }
 function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
-function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
-  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${kind}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
+function docAt(files: ProjectFiles, folder: string, id: string): { readonly path: string; readonly doc: Obj } | null {
+  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${folder}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
   return null;
 }
 function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
@@ -40,13 +41,13 @@ function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
   return out.slice(0, cap);
 }
 function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
-  const names = new Map<string, string>();
-  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit");
-  const face = (id: string | undefined): { letter: string; name: string } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name }; };
+  const names = new Map<string, string>(), counts = new Map<string, number>();
+  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") { names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit"); counts.set(doc["id"], badge(doc)); }
+  const face = (id: string | undefined): { letter: string; name: string; id: string; n: number } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name, id: id ?? "", n: id === undefined ? 0 : counts.get(id) ?? 0 }; };
   const out: Mark[] = [], team = chosen(files, stage);
-  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i }); });
+  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i, id: who.id, n: who.n }); });
   const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Enemy"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Enemy" : "NPC"; };
-  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index }); };
+  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index, id: who.id, n: who.n }); };
   list(stage["neutrals"]).forEach((entry, i) => put(entry, false, "npc", i));
   const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry, i) => put(entry, true, "enemy", i));
   return out;
@@ -98,7 +99,8 @@ function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | nu
     const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
     const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
     const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
-    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}</button>`;
+    const star = mark !== null && mark.n >= 1 ? `<span class="star">✦${mark.n}</span>` : "";
+    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}${star}</button>`;
   }
   return `${html}</div>`;
 }
@@ -144,7 +146,7 @@ export function stageScreen(stageId: string, host: Host): string {
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
   const rows = sheetRows(got.slice, mark !== null);
   const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC")}`;
+  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
   const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
   const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
   const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
@@ -248,6 +250,12 @@ export async function stageClick(act: string, stageId: string, host: Host, io: I
     return commitStage(io, host, attachTalk(got.stage, index, id), got.stage, { [`setups/${id}.json`]: fillTalk(skeleton, id, name, rev, line, talkKnobs(got.slice)) });
   }
   if (act === "s:ask") { const mark = here(); if (mark === null || mark.list !== "npc") return kept(host); sess.ask = mark.index; sess.sheet = null; sess.talking = false; sess.line = lineOf(got.parsed, got.stage, mark.index); return kept(host); }
+  if (act === "s:edit" || act === "s:try") {
+    const mark = here(); if (mark === null || mark.id === "") return kept(host);
+    if (act === "s:edit") { sess.sheet = null; return { ...kept(host), unitId: mark.id }; }
+    const found = stageFor(got.parsed, mark.id); if (found === null) return kept(host);
+    sess.sheet = null; return { ...host, leave: false, test: true, unitId: mark.id, stageId: found };
+  }
   if (act === "s:move") { const mark = here(); if (mark === null) return kept(host); sess.moving = { list: mark.list, index: mark.index, name: mark.name }; sess.sheet = null; sess.note = null; return kept(host); }
   if (act === "s:move-cancel") { sess.moving = null; sess.note = null; return kept(host); }
   if (act === "s:delete") { const mark = here(); if (mark === null) return kept(host); sess.sheet = null; return commitStage(io, host, removeEntry(got.stage, mark), got.stage); }
```

Full file as merged:

```ts
import { badge, stageFor } from "../../src/editor/unit/panel.ts";
import { prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { paintCells, startNew } from "../../src/editor/stage/paint.ts";
import { addEnemy, addNeutral, addSpawn, attachTalk, infoText, moveEntry, placeRows, refuse, removeEntry, standHere, type PlaceList } from "../../src/editor/stage/place.ts";
import { closedType, sheetRows, typeLabel, type SheetRow } from "../../src/editor/stage/sheet.ts";
import { fillTalk, talkKnobs, talkLimit } from "../../src/editor/stage/talk.ts";
import { canUndo, pop, push } from "../../src/editor/stage/undo.ts";
import type { ProjectFiles } from "../../src/project/load/types.ts";
import { parseProject } from "./project-files.ts";
import { askSheet, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number; readonly id: string; readonly n: number };
type Spot = { list: PlaceList; index: number; name: string };
export type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly banner: string | null; readonly dirty: boolean };
export type StageOut = Host & { readonly leave: boolean; readonly test: boolean; readonly unitId?: string; readonly stageId?: string };
export type Io = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes?: () => Uint8Array };
export type Saved = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly dirty: boolean } | { readonly ok: false; readonly error: "writeFailed" | "staleRev" | "readOnly"; readonly message: string; readonly files: DocText; readonly rev: number; readonly dirty: true };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type Sess = { id: string; project: string; draft: Obj | null; path: string | null; stagePath: string | null; painting: string | null; label: string; stack: unknown[]; gridOn: boolean; sheet: Cell | null; view: boolean; confirm: boolean; note: string | null; sel: Cell | null; moving: Spot | null; pick: PlaceList | null; ask: number | null; talking: boolean; line: string };
const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "" });
let sess: Sess = blank("", ""), skeleton: Obj | null = null;
export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
export function stageLine(value: string, max: number): string { const next = Number.isInteger(max) && max >= 0 ? [...value].slice(0, max).join("") : value; sess.line = next; return next; }
function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
function docAt(files: ProjectFiles, folder: string, id: string): { readonly path: string; readonly doc: Obj } | null {
  for (const [path, doc] of Object.entries(files)) if (path.startsWith(`${folder}/`) && isObj(doc) && doc["id"] === id) return { path, doc };
  return null;
}
function chosen(files: ProjectFiles, stage: Obj): readonly string[] {
  const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
  const ids = [...list(gear["required"]), ...list(gear["roster"])].filter((id): id is string => typeof id === "string"), out: string[] = [];
  for (const id of ids) if (!out.includes(id)) out.push(id);
  const cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : out.length, list(stage["playerSpawns"]).length);
  return out.slice(0, cap);
}
function marks(files: ProjectFiles, stage: Obj): readonly Mark[] {
  const names = new Map<string, string>(), counts = new Map<string, number>();
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") { names.set(doc["id"], typeof doc["name"] === "string" ? doc["name"] : "Unit"); counts.set(doc["id"], badge(doc)); }
  const face = (id: string | undefined): { letter: string; name: string; id: string; n: number } => { const name = id === undefined ? "Unit" : names.get(id) ?? "Unit"; return { letter: name.slice(0, 1), name, id: id ?? "", n: id === undefined ? 0 : counts.get(id) ?? 0 }; };
  const out: Mark[] = [], team = chosen(files, stage);
  list(stage["playerSpawns"]).forEach((entry, i) => { if (!isObj(entry) || typeof entry["c"] !== "number" || typeof entry["r"] !== "number") return; const who = face(team[i]); out.push({ c: entry["c"], r: entry["r"], letter: who.letter, pill: "You", name: who.name, list: "spawn", index: i, id: who.id, n: who.n }); });
  const pill = (entry: Obj, foe: boolean): string => { if (foe) return "Enemy"; const side = entry["side"]; return side === "player" ? "You" : typeof side === "string" && side !== "" && side !== "neutral" ? "Enemy" : "NPC"; };
  const put = (entry: unknown, foe: boolean, listName: PlaceList, index: number): void => { if (!isObj(entry) || !isObj(entry["at"]) || typeof entry["at"]["c"] !== "number" || typeof entry["at"]["r"] !== "number") return; const who = face(typeof entry["unitId"] === "string" ? entry["unitId"] : undefined); out.push({ c: entry["at"]["c"], r: entry["at"]["r"], letter: who.letter, pill: pill(entry, foe), name: who.name, list: listName, index, id: who.id, n: who.n }); };
  list(stage["neutrals"]).forEach((entry, i) => put(entry, false, "npc", i));
  const pool = stage["enemyPool"]; if (isObj(pool) && pool["mode"] === "fixed") list(pool["entries"]).forEach((entry, i) => put(entry, true, "enemy", i));
  return out;
}
function tileId(map: Obj, c: number, r: number): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * cols + c], id = typeof value === "number" ? palette[String(value)] : undefined;
  return typeof id === "string" ? id : "floor";
}
function live(files: DocText): Obj | null {
  if (sess.draft !== null) return sess.draft; if (sess.path === null) return null; const parsed = parseProject(files); if (!parsed.ok) return null; const doc = parsed.files[sess.path]; return isObj(doc) ? structuredClone(doc) as Obj : null;
}
async function writeMap(io: Io, files: DocText, rev: number, map: Obj): Promise<Saved> {
  if (sess.path === null) return { ok: false, error: "writeFailed", message: "Can't open this stage", files, rev, dirty: true };
  const next = { ...files, [sess.path]: JSON.stringify(map) }, plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  const same = sess.draft === map; if (same) { sess.draft = null; sess.painting = null; sess.label = ""; sess.note = null; }
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: !same };
}
async function writeParts(io: Io, files: DocText, rev: number, parts: Readonly<Record<string, Obj>>): Promise<Saved> {
  const next = { ...files }; for (const [path, doc] of Object.entries(parts)) next[path] = JSON.stringify(doc);
  const plan = planSave(files, next, rev, io.now);
  if (!plan.ok) return { ok: false, error: plan.error, message: plan.message, files, rev, dirty: true };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes);
  if (!wrote.ok) return { ok: false, error: "writeFailed", message: wrote.message, files, rev, dirty: true };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev, dirty: false };
}
async function saveDocs(io: Io, host: Host, parts: Readonly<Record<string, Obj>>): Promise<StageOut> {
  const saved = await writeParts(io, host.files, host.rev, parts);
  return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: false, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
}
export async function stageCommit(io: Io, files: DocText, rev: number): Promise<Saved> {
  return sess.draft === null ? { ok: true, files, rev, dirty: false } : writeMap(io, files, rev, sess.draft);
}
function bundle(files: DocText, stageId: string): { readonly parsed: ProjectFiles; readonly stage: Obj; readonly map: Obj; readonly slice: Obj } | { readonly error: string } {
  const parsed = parseProject(files); if (!parsed.ok) return { error: parsed.message };
  const stage = docAt(parsed.files, "stages", stageId); if (stage === null) return { error: "Can't open this stage" };
  const ref = stage.doc["mapRef"]; if (typeof ref !== "string") return { error: "Can't open this stage" };
  const map = docAt(parsed.files, "maps", ref); if (map === null) return { error: "Can't open this map" };
  const slice = parsed.files["catalogue/slice.json"]; if (!isObj(slice)) return { error: "Can't open: catalogue/slice.json" };
  sess.path = map.path; sess.stagePath = stage.path; return { parsed: parsed.files, stage: stage.doc, map: sess.draft ?? (structuredClone(map.doc) as Obj), slice };
}
function tone(id: string): string { return id === "floor" || id === "water" ? id : id === "wall-block" ? "wall" : "other"; }
function cellsHtml(map: Obj, slice: Obj, placed: readonly Mark[], sel: Cell | null): string {
  const cols = typeof map["cols"] === "number" ? map["cols"] : 0, rows = typeof map["rows"] === "number" ? map["rows"] : 0;
  let html = `<div class="grid${sess.gridOn ? "" : " off"}" style="grid-template-columns:repeat(${cols},48px)">`;
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const id = tileId(map, c, r), label = typeLabel(slice, id), mark = placed.find((item) => item.c === c && item.r === r) ?? null;
    const text = mark !== null || label.length > 5 ? label.slice(0, 1) : label, on = sel !== null && sel.c === c && sel.r === r ? " on" : "";
    const who = mark === null ? "" : `<span class="who">${esc(mark.letter)}</span><span class="pill">${esc(mark.pill)}</span>`;
    const star = mark !== null && mark.n >= 1 ? `<span class="star">✦${mark.n}</span>` : "";
    html += `<button type="button" class="cell t-${tone(id)}${on}" data-act="s:cell:${c},${r}" data-tile="${esc(id)}" aria-label="${esc(label)}${mark === null ? "" : `, ${mark.name}, ${mark.pill}`}"><span>${esc(text)}</span>${who}${star}</button>`;
  }
  return `${html}</div>`;
}
export function stageRows(files: DocText): { readonly id: string; readonly name: string }[] {
  const parsed = parseProject(files); if (!parsed.ok) return [];
  const root = parsed.files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {};
  return list(project["stages"]).flatMap((id) => { if (typeof id !== "string") return []; const stage = docAt(parsed.files, "stages", id); return stage === null ? [] : [{ id, name: typeof stage.doc["name"] === "string" ? stage.doc["name"] : id }]; });
}
function unitChoices(files: ProjectFiles): { readonly id: string; readonly name: string }[] {
  const out: { id: string; name: string }[] = [];
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("units/") && isObj(doc) && typeof doc["id"] === "string") out.push({ id: doc["id"], name: typeof doc["name"] === "string" ? doc["name"] : "Unit" });
  return out;
}
function lineOf(files: ProjectFiles, stage: Obj, index: number): string {
  const entry = list(stage["neutrals"])[index]; if (!isObj(entry)) return "";
  for (const id of list(entry["setupIds"])) if (typeof id === "string") for (const [path, doc] of Object.entries(files)) {
    if (!path.startsWith("setups/") || !isObj(doc) || doc["id"] !== id || !isObj(doc["answers"])) continue;
    const line = doc["answers"]["line"]; if (isObj(line) && typeof line["value"] === "string") return line["value"];
  }
  return "";
}
function askName(files: ProjectFiles, stage: Obj, index: number): string {
  const entry = list(stage["neutrals"])[index], id = isObj(entry) && typeof entry["unitId"] === "string" ? entry["unitId"] : "";
  return unitChoices(files).find((unit) => unit.id === id)?.name ?? "Unit";
}
const teamOf = (pill: string): string => pill === "You" ? "Your team" : pill === "Enemy" ? "Enemy" : "NPC";
async function commitStage(io: Io, host: Host, stage: Obj, prior: Obj, extra: Readonly<Record<string, Obj>> = {}): Promise<StageOut> {
  if (sess.stagePath === null) return { ...host, banner: "Can't open this stage", leave: false, test: false };
  const prev = sess.stack; sess.stack = push(prev, { stage: structuredClone(prior) });
  const out = await saveDocs(io, host, { [sess.stagePath]: stage, ...extra }); if (out.banner !== null) sess.stack = prev; return out;
}
export function stageScreen(stageId: string, host: Host): string {
  const got = bundle(host.files, stageId);
  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
  const name = typeof got.stage["name"] === "string" ? got.stage["name"] : "Stage", placed = marks(got.parsed, got.stage);
  let users = 0; for (const [path, doc] of Object.entries(got.parsed)) if (path.startsWith("stages/") && isObj(doc) && doc["mapRef"] === got.stage["mapRef"]) users += 1;
  const note = users > 1 ? `<p class="sub">This map is used by ${users} stages. Painting changes all of them.</p>` : "";
  const code = host.banner !== null && host.banner.startsWith("Couldn't save") ? "writeFailed" : host.banner !== null && host.banner.startsWith("This project changed") ? "staleRev" : "";
  const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
  const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
  const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
  const rows = sheetRows(got.slice, mark !== null);
  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
  const stood = mark === null ? "" : `<p>A unit stands here</p>${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
  const place = mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
  const title = mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
  const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
  const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
  const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
  const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
  const noted = sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`;
  const painting = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>`;
  const chip = `${painting}${sess.moving === null ? "" : moveChip(sess.moving.name)}${noted}`;
  const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
  const info = infoText(got.stage, chosen(got.parsed, got.stage).length).map((line) => `<p class="sub">${esc(line)}</p>`).join("");
  const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
  const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
  const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, placed, sess.sel)}</div>${dock}${sheet}${pick}${ask}${view}${confirm}`;
}
function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
  if (act === "s:back") { if (host.readOnly || sess.draft === null) return { ...host, leave: true, test: false }; const saved = await writeMap(io, host.files, host.rev, sess.draft); return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: host.readOnly ? host.banner : null, leave: true, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false }; }
  if (act === "s:test") return { ...host, leave: false, test: true };
  if (act === "s:close") { sess.sheet = null; sess.view = false; sess.confirm = false; sess.pick = null; sess.ask = null; sess.talking = false; return kept(host); }
  if (act === "s:view") { sess.view = true; sess.sheet = null; sess.confirm = false; return kept(host); }
  if (act === "s:grid") { sess.gridOn = !sess.gridOn; return kept(host); }
  if (host.readOnly) return kept(host);
  const got = bundle(host.files, stageId); if ("error" in got) return { ...host, banner: got.error, leave: false, test: false };
  const placed = marks(got.parsed, got.stage);
  if (act === "s:fresh") { sess.confirm = true; sess.sheet = null; sess.view = false; return kept(host); }
  if (act === "s:undo") {
    const item = pop(sess.stack); if (item === null) return kept(host);
    sess.stack = item.rest; sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.pick = null; sess.ask = null; sess.talking = false;
    const snap = item.snap;
    if (isObj(snap) && typeof snap["cols"] === "number") {
      sess.draft = snap; const saved = await writeMap(io, host.files, host.rev, snap);
      if (!saved.ok) return { ...host, dirty: true, banner: saved.message, leave: false, test: false };
      return { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false };
    }
    if (!isObj(snap)) return kept(host);
    const map = isObj(snap["map"]) ? snap["map"] : null, stage = isObj(snap["stage"]) ? snap["stage"] : null, parts: Record<string, Obj> = {};
    if (map !== null && sess.path !== null) parts[sess.path] = map;
    if (stage !== null && sess.stagePath !== null) parts[sess.stagePath] = stage;
    if (Object.keys(parts).length === 0) return kept(host);
    sess.draft = null; return saveDocs(io, host, parts);
  }
  if (act === "s:fresh-go") {
    const map = live(host.files); if (map === null || sess.path === null || sess.stagePath === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    const fresh = startNew(map, got.stage);
    sess.stack = push(sess.stack, { map: structuredClone(map), stage: structuredClone(got.stage) });
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.moving = null; sess.draft = null; sess.pick = null; sess.ask = null; sess.talking = false;
    return saveDocs(io, host, { [sess.path]: fresh.map, [sess.stagePath]: fresh.stage });
  }
  if (act === "s:done") {
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    sess.painting = null; sess.label = ""; sess.sheet = null; sess.confirm = false; sess.note = null; sess.draft = map;
    const saved = await writeMap(io, host.files, host.rev, map);
    return saved.ok ? { ...host, files: saved.files, rev: saved.rev, dirty: saved.dirty, banner: null, leave: false, test: false } : { ...host, dirty: true, banner: saved.message, leave: false, test: false };
  }
  if (act.startsWith("s:cell:")) {
    const [cs, rs] = act.slice(7).split(","), c = Number(cs), r = Number(rs);
    if (!Number.isInteger(c) || !Number.isInteger(r)) return kept(host);
    const cell = { c, r };
    if (sess.moving !== null) {
      const id = tileId(got.map, c, r), why = refuse(placed.some((item) => same(item, cell)) ? "occupied" : closedType(got.slice, id) ? "closed" : null, typeLabel(got.slice, id));
      if (why !== null) { sess.note = why; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const next = moveEntry(got.stage, sess.moving, cell); sess.moving = null; sess.note = null; sess.sheet = null;
      return commitStage(io, host, next, got.stage);
    }
    if (sess.painting !== null) {
      const busy = placed.some((item) => same(item, cell));
      if (busy && closedType(got.slice, sess.painting)) { sess.note = "A unit stands here"; sess.sel = cell; return { ...kept(host), dirty: true }; }
      const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
      sess.draft = paintCells(map, [cell], sess.painting); sess.note = null; sess.sel = cell; sess.sheet = null;
      return { ...host, dirty: true, leave: false, test: false };
    }
    sess.sheet = cell; sess.sel = cell; sess.view = false; sess.confirm = false; return kept(host);
  }
  if (act.startsWith("s:type:")) {
    const id = act.slice(7), rows = sheetRows(got.slice, sess.sheet !== null && placed.some((item) => sess.sheet !== null && same(item, sess.sheet))), row = rows.find((item) => item.id === id);
    if (row === undefined || sess.sheet === null) return kept(host);
    const map = live(host.files); if (map === null) return { ...host, banner: "Can't open this map", leave: false, test: false };
    if (sess.painting === null) sess.stack = push(sess.stack, structuredClone(map) as Obj);
    sess.painting = row.id; sess.label = row.label; sess.draft = paintCells(map, [sess.sheet], row.id); sess.note = null; sess.sel = sess.sheet; sess.sheet = null;
    return { ...host, dirty: true, leave: false, test: false };
  }
  const here = (): Mark | null => sess.sheet === null ? null : placed.find((item) => sess.sheet !== null && same(item, sess.sheet)) ?? null;
  if (act === "s:place:spawn" && sess.sheet !== null) { const at = sess.sheet; sess.sheet = null; return commitStage(io, host, addSpawn(got.stage, at), got.stage); }
  if (act === "s:place:npc" || act === "s:place:enemy") { if (sess.sheet === null) return kept(host); sess.pick = act.endsWith("enemy") ? "enemy" : "npc"; return kept(host); }
  if (act.startsWith("s:unit:") && sess.pick !== null && sess.sheet !== null) {
    const id = act.slice(7), at = sess.sheet;
    if (sess.pick === "enemy") { const next = addEnemy(got.stage, id, at); if (next === null) return kept(host); sess.pick = null; sess.sheet = null; return commitStage(io, host, next, got.stage); }
    const index = list(got.stage["neutrals"]).length; sess.pick = null; sess.sheet = null; sess.ask = index; sess.talking = false; sess.line = "";
    return commitStage(io, host, addNeutral(got.stage, id, at), got.stage);
  }
  if (act === "s:stand" && sess.ask !== null) { const index = sess.ask; sess.ask = null; sess.talking = false; return commitStage(io, host, standHere(got.stage, index), got.stage); }
  if (act === "s:talk-open" && sess.ask !== null) { sess.talking = true; sess.line = lineOf(got.parsed, got.stage, sess.ask); return kept(host); }
  if (act === "s:talk-save" && sess.ask !== null) {
    if (skeleton === null || io.bytes === undefined) return { ...host, banner: "Can't open: setup.talk.json", leave: false, test: false };
    const rev = got.slice["catalogue_rev"]; if (typeof rev !== "number") return { ...host, banner: "Can't open: catalogue/slice.json", leave: false, test: false };
    const index = sess.ask, id = `setup_${ulid(Date.parse(io.now), io.bytes())}`, name = askName(got.parsed, got.stage, index), line = sess.line;
    sess.ask = null; sess.talking = false; sess.line = "";
    return commitStage(io, host, attachTalk(got.stage, index, id), got.stage, { [`setups/${id}.json`]: fillTalk(skeleton, id, name, rev, line, talkKnobs(got.slice)) });
  }
  if (act === "s:ask") { const mark = here(); if (mark === null || mark.list !== "npc") return kept(host); sess.ask = mark.index; sess.sheet = null; sess.talking = false; sess.line = lineOf(got.parsed, got.stage, mark.index); return kept(host); }
  if (act === "s:edit" || act === "s:try") {
    const mark = here(); if (mark === null || mark.id === "") return kept(host);
    if (act === "s:edit") { sess.sheet = null; return { ...kept(host), unitId: mark.id }; }
    const found = stageFor(got.parsed, mark.id); if (found === null) return kept(host);
    sess.sheet = null; return { ...host, leave: false, test: true, unitId: mark.id, stageId: found };
  }
  if (act === "s:move") { const mark = here(); if (mark === null) return kept(host); sess.moving = { list: mark.list, index: mark.index, name: mark.name }; sess.sheet = null; sess.note = null; return kept(host); }
  if (act === "s:move-cancel") { sess.moving = null; sess.note = null; return kept(host); }
  if (act === "s:delete") { const mark = here(); if (mark === null) return kept(host); sess.sheet = null; return commitStage(io, host, removeEntry(got.stage, mark), got.stage); }
  return kept(host);
}
```

### `tools/maker/stage-sheets.ts` (edited)

```diff
diff --git a/tools/maker/stage-sheets.ts b/tools/maker/stage-sheets.ts
index a71f93f..be80af8 100644
--- a/tools/maker/stage-sheets.ts
+++ b/tools/maker/stage-sheets.ts
@@ -4,5 +4,5 @@ export const placeButtons = (rows: readonly { readonly id: string; readonly labe
 export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
 export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn" data-act="s:stand">Just stand here</button><button type="button" class="btn" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
 export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn" data-act="s:talk-save">Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
-export const unitButtons = (npc: boolean): string => `<button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
+export const unitButtons = (npc: boolean, test: boolean): string => `<button type="button" class="btn" data-act="s:edit">Edit</button><button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${test ? `<button type="button" class="btn" data-act="s:try">Test</button>` : ""}${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
 export const moveChip = (name: string): string => `<div class="chip" role="status"><span>Moving ${esc(name)} · Tap a tile</span><button type="button" class="btn" data-act="s:move-cancel">Cancel</button></div>`;
```

Full file as merged:

```ts
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export const placeButtons = (rows: readonly { readonly id: string; readonly label: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:place:${esc(row.id)}">${esc(row.label)}</button>`).join("");
export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn" data-act="s:stand">Just stand here</button><button type="button" class="btn" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn" data-act="s:talk-save">Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
export const unitButtons = (npc: boolean, test: boolean): string => `<button type="button" class="btn" data-act="s:edit">Edit</button><button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${test ? `<button type="button" class="btn" data-act="s:try">Test</button>` : ""}${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
export const moveChip = (name: string): string => `<div class="chip" role="status"><span>Moving ${esc(name)} · Tap a tile</span><button type="button" class="btn" data-act="s:move-cancel">Cancel</button></div>`;
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index 18e5be9..bacdd3d 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -7,13 +7,14 @@ import { openProject, type PlayOut } from "../play-stage/project.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 export type PlayReady = PlayOut & { readonly looks: Looks };
+export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
 export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
-type Start = (docs: PlayReady) => void;
-export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly start: Start };
+type Start = (docs: PlayReady, aim?: AimAt) => void;
+export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
 export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
 const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
 const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
-const showUrl = (id: string, stage: string, from: string): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}`); };
+const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
 function play(input: LaunchBag, text: DocText): Launch {
   const parsed = parseProject(text);
   if (!parsed.ok) return fail([parsed.message], text, 0);
@@ -21,8 +22,8 @@ function play(input: LaunchBag, text: DocText): Launch {
   if (!gate.allowed) return fail(gate.lines, text, rev);
   const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
-  try { input.start(opened.docs); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
-  showUrl(input.id, stageOf(opened.docs), input.from); return { ok: true, files: text, rev };
+  try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
+  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
 }
 /** Read a saved folder and start its stage. No demo fallback. */
 export async function openSaved(input: LaunchBag): Promise<Launch> {
```

Full file as merged:

```ts
import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { testGate, playLine } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { Looks } from "../play-stage/load.ts";
import { openProject, type PlayOut } from "../play-stage/project.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
export type PlayReady = PlayOut & { readonly looks: Looks };
export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
type Start = (docs: PlayReady, aim?: AimAt) => void;
export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start };
export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
function play(input: LaunchBag, text: DocText): Launch {
  const parsed = parseProject(text);
  if (!parsed.ok) return fail([parsed.message], text, 0);
  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
  if (!gate.allowed) return fail(gate.lines, text, rev);
  const opened = input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId);
  if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
  try { input.start(opened.docs, input.aim); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
  showUrl(input.id, stageOf(opened.docs), input.from, input.aim); return { ok: true, files: text, rev };
}
/** Read a saved folder and start its stage. No demo fallback. */
export async function openSaved(input: LaunchBag): Promise<Launch> {
  const text = await readTree(input.store, prefix(input.id));
  if (Object.keys(text).length === 0) return fail([`Can't open: no project ${input.id}`], text, 0);
  return play(input, text);
}
/** Save first. A failed save does not start a match. */
export async function launchTest(input: LaunchBag & { readonly stored: DocText; readonly next: DocText; readonly rev: number; readonly now: string }): Promise<Launch> {
  const plan = planSave(input.stored, input.next, input.rev, input.now);
  if (!plan.ok) return fail([plan.message], input.stored, input.rev);
  const wrote = await commitWrites(input.store, prefix(input.id), plan.writes);
  if (!wrote.ok) return fail([wrote.message], input.stored, input.rev);
  const text = await readTree(input.store, prefix(input.id));
  return play(input, text);
}
```

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index dd00c3a..2ca96d7 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -1,3 +1,4 @@
+import { abilityAct, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { prefix, ulid } from "../../src/editor/project/home.ts";
 import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
@@ -9,7 +10,7 @@ type DocText = Readonly<Record<string, string>>;
 type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
 type Sess = { project: string; mode: "add" | "rename" | "role" | "menu" | "note" | "edit" | null; unit: string; name: string; hint: string; lines: string[]; hidden: string[]; stack: Snap[] };
 type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
-export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string };
+export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string; readonly play?: AbilityPlay };
 export type UnitIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
@@ -21,6 +22,7 @@ export function rememberUnit(doc: unknown): void { if (!isObj(doc)) throw new Er
 export function bindUnits(id: string): void { if (sess.project !== id) sess = blank(id); }
 export function unitLine(value: string): void { sess.name = value; }
 export function unitEditing(): boolean { return sess.mode === "edit" || sess.mode === "rename" || sess.mode === "role"; }
+export function openUnit(id: string): void { abilityShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
 function bagOf(files: DocText): Record<string, Obj> | null {
   const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
   for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
@@ -33,7 +35,7 @@ async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText):
   const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
   return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
 }
-function roster(bag: Record<string, Obj>): { readonly knobs: Obj[]; readonly presets: unknown[]; readonly army: Obj | null } {
+function roster(bag: Record<string, Obj>): { readonly knobs: readonly Obj[]; readonly presets: readonly unknown[]; readonly army: Obj | null } {
   const slice = bag["catalogue/slice.json"], behaviours = isObj(slice) ? list(slice["behaviours"]) : [], beh = behaviours.find((b) => isObj(b) && b["id"] === "unit-roster");
   const knobs = isObj(beh) ? list(beh["knobs"]).filter(isObj) : [], presets = isObj(beh) ? list(beh["presets"]) : [];
   const army = Object.values(bag).find((doc) => doc["behaviourId"] === "unit-roster");
@@ -49,8 +51,8 @@ function rolesOf(knobs: readonly Obj[], presets: readonly unknown[]): { readonly
   const per = perKeys(knobs), out: { id: string; label: string; overrides: Record<string, number> }[] = [];
   for (const item of presets) {
     if (!isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string" || !isObj(item["overrides"])) continue;
-    const keys = Object.keys(item["overrides"]); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof item["overrides"][key] !== "number")) continue;
-    const overrides: Record<string, number> = {}; for (const key of keys) { const n = item["overrides"][key]; if (typeof n === "number") overrides[key] = n; }
+    const over = item["overrides"], keys = Object.keys(over); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof over[key] !== "number")) continue;
+    const overrides: Record<string, number> = {}; for (const key of keys) { const n = over[key]; if (typeof n === "number") overrides[key] = n; }
     out.push({ id: item["id"], label: item["label"], overrides });
   }
   return out;
@@ -94,11 +96,12 @@ export function unitPage(files: DocText, readOnly: boolean, banner: string | nul
   const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
   const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
   const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
+  const abilities = abilityView(bag, hit.doc, readOnly);
   const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
   const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
   const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
   const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
 }
 async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
   const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
@@ -118,10 +121,17 @@ export async function unitClick(act: string, host: Host, io: UnitIo): Promise<Un
   if (act === "u:back") { sess.mode = null; sess.hint = ""; return kept(host); }
   if (act === "u:undo") return undo(io, host);
   if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
+  if (act.startsWith("a:") || act.startsWith("k:")) {
+    const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
+    const hit = abilityAct(act, live, sess.unit);
+    if ("play" in hit) return { ...kept(host), play: hit.play };
+    if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
+    return kept(host);
+  }
   if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
   if (act === "u:role") { sess.mode = "role"; return kept(host); }
   if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
-  if (act.startsWith("u:open:")) { sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
+  if (act.startsWith("u:open:")) { abilityShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
   if (act.startsWith("u:menu:")) { const bag = bagOf(host.files), id = act.slice(7), hit = bag === null ? null : unitDoc(bag, id); sess.unit = id; sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit"; sess.mode = "menu"; return kept(host); }
   const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
   if (act === "u:create" || act === "u:save-name") {
```

Full file as merged:

```ts
import { abilityAct, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { prefix, ulid } from "../../src/editor/project/home.ts";
import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
type DocText = Readonly<Record<string, string>>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "rename" | "role" | "menu" | "note" | "edit" | null; unit: string; name: string; hint: string; lines: string[]; hidden: string[]; stack: Snap[] };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
export type UnitHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly toast?: string | null; readonly shown?: string; readonly play?: AbilityPlay };
export type UnitIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, unit: "", name: "", hint: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank(""), skel: Obj | null = null;
export function rememberUnit(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function bindUnits(id: string): void { if (sess.project !== id) sess = blank(id); }
export function unitLine(value: string): void { sess.name = value; }
export function unitEditing(): boolean { return sess.mode === "edit" || sess.mode === "rename" || sess.mode === "role"; }
export function openUnit(id: string): void { abilityShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
}
async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
function roster(bag: Record<string, Obj>): { readonly knobs: readonly Obj[]; readonly presets: readonly unknown[]; readonly army: Obj | null } {
  const slice = bag["catalogue/slice.json"], behaviours = isObj(slice) ? list(slice["behaviours"]) : [], beh = behaviours.find((b) => isObj(b) && b["id"] === "unit-roster");
  const knobs = isObj(beh) ? list(beh["knobs"]).filter(isObj) : [], presets = isObj(beh) ? list(beh["presets"]) : [];
  const army = Object.values(bag).find((doc) => doc["behaviourId"] === "unit-roster");
  return { knobs, presets, army: isObj(army) ? army : null };
}
function armyNum(army: Obj | null, knob: Obj): number | null {
  const key = typeof knob["id"] === "string" ? knob["id"] : "", answers = army !== null && isObj(army["answers"]) ? army["answers"] : null, row = answers === null ? undefined : answers[key];
  if (isObj(row) && row["source"] !== "default" && typeof row["value"] === "number") return row["value"];
  return typeof knob["default"] === "number" ? knob["default"] : null;
}
function perKeys(knobs: readonly Obj[]): Set<string> { return new Set(knobs.filter((k) => k["per_unit"] === true && typeof k["id"] === "string").map((k) => String(k["id"]))); }
function rolesOf(knobs: readonly Obj[], presets: readonly unknown[]): { readonly id: string; readonly label: string; readonly overrides: Record<string, number> }[] {
  const per = perKeys(knobs), out: { id: string; label: string; overrides: Record<string, number> }[] = [];
  for (const item of presets) {
    if (!isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string" || !isObj(item["overrides"])) continue;
    const over = item["overrides"], keys = Object.keys(over); if (keys.length === 0 || keys.some((key) => !per.has(key) || typeof over[key] !== "number")) continue;
    const overrides: Record<string, number> = {}; for (const key of keys) { const n = over[key]; if (typeof n === "number") overrides[key] = n; }
    out.push({ id: item["id"], label: item["label"], overrides });
  }
  return out;
}
function specOf(knob: Obj): KnobSpec | null {
  if (typeof knob["id"] !== "string" || typeof knob["label"] !== "string" || typeof knob["type"] !== "string") return null;
  return { id: knob["id"], label: knob["label"], type: knob["type"], ...(typeof knob["min"] === "number" ? { min: knob["min"] } : {}), ...(typeof knob["max"] === "number" ? { max: knob["max"] } : {}), ...(typeof knob["step"] === "number" ? { step: knob["step"] } : {}) };
}
function ownNum(unit: Obj, key: string): number | null { const stats = isObj(unit["stats"]) ? unit["stats"] : null, bag = stats === null ? undefined : stats[key]; return isObj(bag) && typeof bag["value"] === "number" ? bag["value"] : null; }
const kept = (host: Host): UnitHit => ({ files: host.files, rev: host.rev, banner: null, dirty: host.dirty });
async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<UnitHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast };
}
function unitDoc(bag: Record<string, Obj>, id: string): { readonly path: string; readonly doc: Obj } | null {
  const path = `units/${id}.json`, doc = bag[path]; return isObj(doc) ? { path, doc } : null;
}
function statBlock(unit: Obj, knob: Obj, army: Obj | null): string {
  const spec = specOf(knob); if (spec === null || spec.type !== "slider") return "";
  const own = ownNum(unit, spec.id), armyValue = armyNum(army, knob), shownValue = own ?? armyValue; if (shownValue === null) return "";
  const reset = own === null ? `<p class="sub">Same as army</p>` : `<button type="button" class="btn ghost" data-act="u:reset:${esc(spec.id)}">Reset</button>`;
  return `${knobWidget({ ...spec, min: spec.min ?? null, max: spec.max ?? null, step: spec.step ?? null }, shownValue)}${reset}`;
}
export function unitTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const cards = shown(bag, sess.hidden).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="u:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="u:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="u:add"><span class="grow"><span class="name">+ Add unit</span></span></button>`;
  return `<h2>Units</h2>${cards}${add}`;
}
function sheet(): string {
  const close = `<button type="button" class="btn ghost" data-act="u:close">Close</button>`;
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}${close}</div></div>`;
  if (sess.mode === "add" || sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${sess.mode === "add" ? "Unit name" : "Rename"}</h2><input class="name-field" data-unit value="${esc(sess.name)}" aria-label="Unit name"><p class="hint">${esc(sess.hint || "1-40 characters")}</p><button type="button" class="btn" data-act="${sess.mode === "add" ? "u:create" : "u:save-name"}">${sess.mode === "add" ? "Add" : "Save"}</button>${close}</div></div>`;
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Unit")}</h2><button type="button" class="btn danger" data-act="u:delete">Delete</button>${close}</div></div>`;
  return "";
}
export function unitSheet(): string { return sess.mode === "add" || sess.mode === "menu" || sess.mode === "note" ? sheet() : ""; }
export function unitPage(files: DocText, readOnly: boolean, banner: string | null): string {
  const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
  const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
  const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
  const abilities = abilityView(bag, hit.doc, readOnly);
  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
  const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
}
async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
  const next: Record<string, string> = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
  sess.hidden = [...snap.hidden];
  for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("units/") && path.endsWith(".json")) sess.hidden.push(path.slice("units/".length, -".json".length));
  sess.mode = null; sess.lines = []; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast: null };
}
function clamp(knob: Obj, value: number): number {
  const min = typeof knob["min"] === "number" ? knob["min"] : value, max = typeof knob["max"] === "number" ? knob["max"] : value, step = typeof knob["step"] === "number" && knob["step"] > 0 ? knob["step"] : 1;
  const snapped = Math.round((value - min) / step) * step + min; return Math.min(max, Math.max(min, snapped));
}
export async function unitClick(act: string, host: Host, io: UnitIo): Promise<UnitHit> {
  if (act === "u:close") { sess.mode = sess.mode === "rename" || sess.mode === "role" ? "edit" : null; sess.hint = ""; sess.lines = []; return kept(host); }
  if (act === "u:back") { sess.mode = null; sess.hint = ""; return kept(host); }
  if (act === "u:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  if (act.startsWith("a:") || act.startsWith("k:")) {
    const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
    const hit = abilityAct(act, live, sess.unit);
    if ("play" in hit) return { ...kept(host), play: hit.play };
    if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
    return kept(host);
  }
  if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
  if (act === "u:role") { sess.mode = "role"; return kept(host); }
  if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
  if (act.startsWith("u:open:")) { abilityShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
  if (act.startsWith("u:menu:")) { const bag = bagOf(host.files), id = act.slice(7), hit = bag === null ? null : unitDoc(bag, id); sess.unit = id; sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit"; sess.mode = "menu"; return kept(host); }
  const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
  if (act === "u:create" || act === "u:save-name") {
    const err = unitNameError(sess.name); if (err !== null) { sess.hint = err; return kept(host); }
    const name = sess.name.trim();
    if (act === "u:create") {
      if (skel === null) return { ...kept(host), banner: "Can't open: templates" };
      const id = `unit_${ulid(Date.parse(io.now), io.bytes())}`, doc = newUnit(skel, id, name);
      const hit = await save(io, host, bag, { ...bag, [`units/${id}.json`]: doc }, "Changed · Undo"); if (hit.banner !== null) return hit;
      sess.mode = "edit"; sess.unit = id; sess.hint = ""; return hit;
    }
    const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: renameUnit(cur.doc, name) }, "Changed · Undo"); if (hit.banner === null) { sess.mode = "edit"; sess.hint = ""; }
    return hit;
  }
  if (act === "u:delete") {
    const got = deleteUnit(bag, sess.unit); if (!got.ok) { sess.mode = "note"; sess.lines = [...got.reasons]; return kept(host); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.unit]; sess.mode = null; sess.lines = [];
    return { ...kept(host), toast: "Deleted · Undo" };
  }
  const cur = unitDoc(bag, sess.unit); if (cur === null) return { ...kept(host), banner: "Can't open this" };
  const { knobs, presets } = roster(bag);
  if (act.startsWith("u:apply:")) {
    const role = rolesOf(knobs, presets).find((item) => item.id === act.slice(8)); if (role === undefined) return kept(host);
    const hit = await save(io, host, bag, { ...bag, [cur.path]: applyRole(cur.doc, role.overrides, perKeys(knobs)) }, "Changed · Undo"); if (hit.banner === null) sess.mode = "edit"; return hit;
  }
  if (act.startsWith("u:reset:")) {
    const hit = await save(io, host, bag, { ...bag, [cur.path]: resetStat(cur.doc, act.slice(8)) }, "Changed · Undo"); return hit;
  }
  if (act.startsWith("u:stat:")) {
    const parts = act.split(":"), key = parts[2] ?? "", value = Number(parts.slice(3).join(":")), knob = knobs.find((item) => item["id"] === key);
    if (knob === undefined || !Number.isFinite(value) || knob["per_unit"] !== true) return kept(host);
    const next = clamp(knob, value); if (ownNum(cur.doc, key) === next) return { ...kept(host), shown: String(next) };
    const hit = await save(io, host, bag, { ...bag, [cur.path]: setStat(cur.doc, key, next) }, "Changed · Undo");
    return hit.banner === null ? { ...hit, shown: String(next) } : hit;
  }
  return kept(host);
}
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 33f794b..7bad671 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -1,12 +1,13 @@
+import { aimKind } from "../../src/editor/unit/panel.ts";
 import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
-import { bindUnits, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
+import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
-import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
+import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
@@ -26,11 +27,11 @@ function sheet(): string {
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
+  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
   if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet()) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
@@ -45,10 +46,10 @@ async function rename(): Promise<void> { if (store === null || state.menu === nu
 async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
 async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
-function enterPlay(docs: PlayReady, scroll: number): void {
+function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
   try {
-    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
+    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; }, aim);
     root.hidden = true;
   } catch (e) { canvas.remove(); throw e; }
 }
@@ -57,32 +58,42 @@ async function saveStage(): Promise<boolean> {
   const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
   state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
 }
-async function beginTest(): Promise<void> {
+async function beginTest(aim?: AimAt & { readonly stageId?: string }): Promise<void> {
   if (store === null || state.current === null) return;
-  const stageId = state.screen === "stage" ? state.stageId : null;
-  if (stageId !== null && !await saveStage()) { paint(); return; }
+  const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
+  if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
   const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
-  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
+  const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
+  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at) => enterPlay(docs, scroll, at) });
   state.files = got.files; state.rev = got.rev;
   if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
   state.dirty = false; state.problems = [];
 }
+function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
+  if (ability === null) return { unitId: unit };
+  const parsed = parseProject(text); let behaviour = "";
+  if (parsed.ok) for (const [path, doc] of Object.entries(parsed.files)) if (path.startsWith("setups/") && typeof doc === "object" && doc !== null && !Array.isArray(doc) && "id" in doc && doc["id"] === ability && typeof doc["behaviourId"] === "string") behaviour = doc["behaviourId"];
+  const aim = aimKind(behaviour);
+  return { unitId: unit, abilityId: ability, ...(aim === undefined ? {} : { aim }) };
+}
 async function fromUrl(): Promise<void> {
   const params = new URLSearchParams(location.search), id = params.get("project");
   if (id === null || store === null) return;
-  const stage = params.get("stage"), from = params.get("from") ?? "project";
-  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
+  const stage = params.get("stage"), from = params.get("from") ?? "project", unit = params.get("unit"), ability = params.get("ability");
+  const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
+  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at) => enterPlay(docs, 0, at) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
   if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
   state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
 }
 async function run(act: string): Promise<void> {
   const unitUndo = act === "undo" && state.undo === "unit";
-  if ((act.startsWith("u:") || unitUndo) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
+    if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
     if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
       const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
       if (span !== null) span.textContent = hit.shown;
@@ -102,7 +113,10 @@ async function run(act: string): Promise<void> {
   if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
   if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
     const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
-    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
+    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
+    if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
+    if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
+    if (out.leave) state.screen = "project"; paint(); return;
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
@@ -119,6 +133,9 @@ async function boot(): Promise<void> {
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
 document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(`u:stat:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+let held: { act: string; t: number } | null = null;
+document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
+document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 void boot();
```

Full file as merged:

```ts
import { aimKind } from "../../src/editor/unit/panel.ts";
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve();
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
const go = (act: string): void => { gate = gate.then(() => run(act)).catch(fail); };
const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
function sheet(): string {
  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
  if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
  if (state.screen !== "name" && state.screen !== "rename") return "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
}
function paint(): void {
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly), units: unitTail(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet()) + (unitEditing() ? "" : toast); return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); bindUnits(id); paint(); }
async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; }, aim);
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(aim?: AimAt & { readonly stageId?: string }): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
  if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const launched = aim?.unitId === undefined ? undefined : { ...(aim.abilityId === undefined ? { unitId: aim.unitId } : { unitId: aim.unitId, abilityId: aim.abilityId }), ...(aim.aim === undefined ? {} : { aim: aim.aim }) };
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), now: nowIso(), start: (docs, at) => enterPlay(docs, scroll, at) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
  if (ability === null) return { unitId: unit };
  const parsed = parseProject(text); let behaviour = "";
  if (parsed.ok) for (const [path, doc] of Object.entries(parsed.files)) if (path.startsWith("setups/") && typeof doc === "object" && doc !== null && !Array.isArray(doc) && "id" in doc && doc["id"] === ability && typeof doc["behaviourId"] === "string") behaviour = doc["behaviourId"];
  const aim = aimKind(behaviour);
  return { unitId: unit, abilityId: ability, ...(aim === undefined ? {} : { aim }) };
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project", unit = params.get("unit"), ability = params.get("ability");
  const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at) => enterPlay(docs, 0, at) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
}
async function run(act: string): Promise<void> {
  const unitUndo = act === "undo" && state.undo === "unit";
  if ((act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
    const hadBanner = state.banner !== null;
    const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
    if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
    if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
      const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
      if (span !== null) span.textContent = hit.shown;
      const sib = span?.nextElementSibling;
      if (sib instanceof HTMLElement && sib.tagName === "P" && sib.textContent === "Same as army") { const btn = document.createElement("button"); btn.type = "button"; btn.className = "btn ghost"; btn.setAttribute("data-act", `u:reset:${key}`); btn.textContent = "Reset"; sib.replaceWith(btn); }
      return;
    }
    paint(); return;
  }
  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
    const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
    paint(); return;
  }
  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
    if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
    if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
    if (out.leave) state.screen = "project"; paint(); return;
  }
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
let held: { act: string; t: number } | null = null;
document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
void boot();
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index ce0a2d1..7aa3d37 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -39,9 +39,13 @@ input.name-field { min-height: 48px; border: 2px solid var(--line); border-radiu
   .app { border-radius: 0; height: 100dvh; }
 }
 .topbar.wrap { flex-wrap: wrap; } .topbar.wrap h1 { flex: 1 1 auto; min-width: 8.5rem; max-width: 100%; } .stage-row { width: 100%; min-height: 48px; flex: none; } .grid { display: grid; width: max-content; }
-.cell { box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
+.cell { position: relative; box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
 .grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
 .cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
+.cell .star { position: absolute; top: 0; left: 1px; font-size: 10px; font-weight: 800; line-height: 1.2; color: var(--ink); background: var(--surface); }
+.ability, .ability summary { min-height: 48px; max-width: 100%; display: block; }
+details.ability:not([open]) > :not(summary) { display: none; }
+.toast.above { top: 16px; bottom: auto; z-index: 6; }
 .dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
 .chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
 input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
```

Full file as merged:

```css
.app { height: 100dvh; min-height: 100dvh; background: var(--bg); color: var(--ink); display: flex; flex-direction: column; }
.app[hidden] { display: none; }
.topbar { min-height: var(--header-h); display: flex; align-items: center; gap: 8px; padding: 10px 16px 8px; background: var(--surface); border-bottom: 1px solid var(--line); }
.topbar h1 { flex: 1; margin: 0; font-size: 1.05rem; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.body { flex: 1; min-height: 0; overflow: auto; padding: 16px 16px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 12px; }
.card, .choice { display: flex; align-items: center; gap: 10px; min-height: 72px; padding: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); text-align: left; color: var(--ink); }
.card-hit { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; flex: 1; min-height: 48px; background: transparent; color: var(--ink); border: 0; box-shadow: none; padding: 0; text-align: left; }
.card.new, .choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }
.card .grow, .choice { flex: 1; }
.card .grow { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.name { font-weight: 700; font-size: 16px; }
.sub, .hint { margin: 0; color: var(--muted); font-size: 0.82rem; line-height: 1.4; }
.btn { min-height: 48px; min-width: 48px; border-radius: 14px; border: 2px solid transparent; padding: 0 14px; font-weight: 700; background: var(--accent); color: var(--accent-ink); }
.btn.ghost { background: var(--surface); border-color: var(--line); color: var(--ink); }
.btn.soon, .btn:disabled { background: var(--soon); color: var(--soon-ink); border-color: transparent; }
.btn.danger { background: var(--danger-soft); color: var(--danger); border-color: var(--danger-line); }
.btn.icon { width: 48px; padding: 0; background: var(--surface); border-color: var(--line); color: var(--ink); }
.badge { display: inline-flex; padding: 3px 9px; border-radius: 999px; border: 1.5px solid var(--warn-line); background: var(--warn-soft); color: var(--warn); font-size: 0.78rem; font-weight: 800; }
.banner { margin: 0; padding: 12px; border-radius: var(--radius); background: var(--warn-soft); border: 1px solid var(--warn-line); color: var(--warn); font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.banner.bad { background: var(--danger-soft); border-color: var(--danger-line); color: var(--danger); }
.toast { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-radius: 14px; background: var(--ink); color: var(--bg); font-weight: 650; }
.toast .btn { background: transparent; color: var(--bg); border-color: transparent; }
.scrim { position: fixed; inset: 0; z-index: 5; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
.sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
.test-wrap { margin-top: auto; padding-top: 24px; }
.test-wrap .btn { width: 100%; min-height: 56px; }
.dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
.project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
.project .sheet p { margin: 0; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
@media (min-width: 421px) {
  body { min-height: 100dvh; display: grid; place-items: center; }
  .app { width: 390px; height: 844px; min-height: 0; border-radius: 28px; overflow: hidden; box-shadow: var(--frame-shadow); }
  .toast { position: absolute; }
}
@media (max-width: 420px) {
  .app { border-radius: 0; height: 100dvh; }
}
.topbar.wrap { flex-wrap: wrap; } .topbar.wrap h1 { flex: 1 1 auto; min-width: 8.5rem; max-width: 100%; } .stage-row { width: 100%; min-height: 48px; flex: none; } .grid { display: grid; width: max-content; }
.cell { position: relative; box-sizing: border-box; width: 48px; height: 48px; min-width: 48px; min-height: 48px; padding: 2px; border: 1px solid var(--line); color: var(--ink); font-size: 11px; font-weight: 700; line-height: 1.1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
.cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
.cell .star { position: absolute; top: 0; left: 1px; font-size: 10px; font-weight: 800; line-height: 1.2; color: var(--ink); background: var(--surface); }
.ability, .ability summary { min-height: 48px; max-width: 100%; display: block; }
details.ability:not([open]) > :not(summary) { display: none; }
.toast.above { top: 16px; bottom: auto; z-index: 6; }
.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
.chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 7b5c4bb..64dacdf 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -1,16 +1,18 @@
 import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
 import { createLighting, fitView } from "../../src/runtime/render/index.ts";
 import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
+import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
 import { boardBox, fit, TILE } from "./board.ts";
 import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
 import { createHud } from "./hud.ts";
 import { litPlan, picturesOf, sourceOf } from "./looks.ts";
-import { createMatch } from "./match.ts";
+import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
 import { openBundled } from "./project.ts";
 import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
-export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void): void {
+export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
+export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim): void {
 const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
 const match = createMatch(docs);
@@ -52,6 +54,24 @@ for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lo
 const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
 place(); addEventListener("resize", () => { place(); seated = false; });
 seat();
+if (aim?.unitId !== undefined) {
+  const mine = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId && u.side === match.sides.me);
+  if (mine === undefined) {
+    const body = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId);
+    if (body !== undefined) { const b = band(), shown = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, body.at, shown, 0, TILE, 0); clamp(cam, shown, match.world.grid.cols, match.world.grid.rows); }
+  } else {
+    match.feed({ type: "SelectUnit", unitId: mine.id });
+    if (aim.aim === "basic" || aim.aim === "spell") {
+      const kind = aim.aim;
+      if (match.choose(kind) !== null) match.intend({ type: "ChooseAction", actionId: kind, unitId: mine.id });
+      const table = kind === "spell" ? docs.rules.abilities?.[mine.unitId]?.[0]?.reach : docs.rules.reach?.[mine.unitId];
+      const reach = typeof table === "number" && Number.isInteger(table) && table >= 1 ? table : kind === "spell" ? DEFAULT_SPELL_REACH : match.step.reach;
+      const cells: { c: number; r: number }[] = [];
+      for (let r = 0; r < match.world.grid.rows; r += 1) for (let c = 0; c < match.world.grid.cols; c += 1) if (inOrthogonalReach(mine.at, { c, r }, reach)) cells.push({ c, r });
+      match.aims = cells; match.aimKind = kind;
+    }
+  }
+}
 if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
 if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
 driver.start();
```

Full file as merged:

```ts
import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim): void {
const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch(docs);
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => { if (back !== undefined) { driver.dispose(); back(); } else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
if (aim?.unitId !== undefined) {
  const mine = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId && u.side === match.sides.me);
  if (mine === undefined) {
    const body = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId);
    if (body !== undefined) { const b = band(), shown = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, body.at, shown, 0, TILE, 0); clamp(cam, shown, match.world.grid.cols, match.world.grid.rows); }
  } else {
    match.feed({ type: "SelectUnit", unitId: mine.id });
    if (aim.aim === "basic" || aim.aim === "spell") {
      const kind = aim.aim;
      if (match.choose(kind) !== null) match.intend({ type: "ChooseAction", actionId: kind, unitId: mine.id });
      const table = kind === "spell" ? docs.rules.abilities?.[mine.unitId]?.[0]?.reach : docs.rules.reach?.[mine.unitId];
      const reach = typeof table === "number" && Number.isInteger(table) && table >= 1 ? table : kind === "spell" ? DEFAULT_SPELL_REACH : match.step.reach;
      const cells: { c: number; r: number }[] = [];
      for (let r = 0; r < match.world.grid.rows; r += 1) for (let c = 0; c < match.world.grid.cols; c += 1) if (inOrthogonalReach(mine.at, { c, r }, reach)) cells.push({ c, r });
      match.aims = cells; match.aimKind = kind;
    }
  }
}
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { driver.dispose(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
driver.start();
}
const bootCanvas = document.querySelector("#board");
if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 0703ead..1e7b33b 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -39,7 +39,7 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
     stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
     for (const sid of strs(unit["setupIds"])) {
       const setup = store.setups[sid]; if (setup === undefined) continue;
-      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "one-tile-straight" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
+      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
       if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
     }
   }
```

Full file as merged:

```ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
import { DEMO_LOOKS } from "./looks.ts";
import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json" with { type: "json" }; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json" with { type: "json" }; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json" with { type: "json" };
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json" with { type: "json" }; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json" with { type: "json" }; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json" with { type: "json" }; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json" with { type: "json" }; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json" with { type: "json" };
type Obj = Record<string, unknown>;
export type PlayOut = PlayDocs & { readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[]; readonly names: Readonly<Record<string, string>>; readonly talk: Readonly<Record<string, string>> };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v: unknown): readonly string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const must = (v: number | undefined, why: string): number => { if (v === undefined) throw new Error(why); return v; };
function knob(setup: Obj, cat: Obj, behaviour: string, key: string): unknown {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = (): ProjectFiles => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk: Record<string, string> = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
}
export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
  try {
    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
    const looks: Looks = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
    docsToInput(docs);
    return { docs, error };
  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
}
export function openBundled(): ReturnType<typeof openProject> {
  const got = openProject(bundledFiles());
  if (got.docs === null) return got;
  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
}
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
```
