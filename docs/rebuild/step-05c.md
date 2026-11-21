# Rebuild record: step 5c, + Add ability

Original brief: [`docs/maker/steps/step-05-units.md`](../maker/steps/step-05-units.md) on the merge (r3b, blob `2e2673e8`, sha256 `ce4ec0112291f60dbc332e3ff15290edc5a9dda9bd1680958381ae0612457d7e`, 267 lines): the 5c sections (L198-244), the count command (L94-95), Delivery (L33-37), Law 12 (L137), and the Empty `play: army` ruling (L259). The same blob is on current main, the base and the tip. Do [`step-05b.md`](step-05b.md) first; this step needs 5b merged and catalogue rev 30 on main (guide L20). This file records exactly what shipped.

Sources: PR #89 and branch `step/step-05c-add-ability-r1-chatA` (r1 tip `f75e5386`, r1 code head `cb1b0ff8`; r2 tip `e2e0463d`, r2 code head `f308d135`); `handback/step-05c-add-ability/r1/HANDBACK.md` at `f75e5386` (HB1, blob `c4c3bc7a`, 133 lines) and at `e2e0463d` / the merge (HB2, blob `0bc1a93a`, 136 lines, same path; no r2 folder, HB2:2); Chief Of Staff verify reports `/workspace/share/step-05c-verify/report.md` (V1, sha256 `d2ec20242aceb059721ed2508a1ab4437256394cacee61234bf9b36aacb9e588`, 37 lines) and `/workspace/share/step-05c-verify/report-r2.md` (V2, sha256 `90eec871d9e7e4e05995a630939058cb6dd3233bf5f686dd5e460564fa88b70b`, 34 lines). `docs/qa/step-05c-review.md` (QA1, git hash-object `1c7e556e`, 44 lines, on main `80eedada`): **NOT OK**, one must-fix (Law 12 in `tools/maker/unit-diagram.ts`; QA1:3, QA1:40). `docs/qa/step-05c-r2-recheck.md` (QA2, git hash-object `1f88ffec`, 13 lines, on main `80eedada`): **OK TO MERGE** (QA2:13). Line numbers are at the commit named. Code line cites are at merge `5a2c8e79` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `88a6ac931100ce13cc0c460f921d9734ddb554c9`, catalogue rev 30 + demo re-cut + QA review, which is still `origin/main` at the merge. Floor **1074** tests (guide L234: 5b's final count + N; header L19 was TBD). After this merge the floor is **1082** |
| r1 commits | `7893dc6a` feat: add an ability from the bundled catalogue, `cb1b0ff8` fix: diagram before-pass keeps a missing behaviour in the slice (r1 code head, tree `192f86a7`, V1), `f75e5386` docs(handback): step-05c-add-ability r1 (tree `0d4ac39c`, V1). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour and gates passed (1081/0, G7 379, s5c / s5b / s5a smokes). QA **NOT OK** (QA1:3). One must-fix, Law 12 (guide L137): at r1 code head `cb1b0ff8`, `tools/maker/unit-diagram.ts:12` `played()` caught every `Error` from `playDocsOf` and returned `null`, and `diagramCells` at `:29` drew `grid(null)`, an unmarked grid (QA1:40). That hid real faults as well as the known Empty `play: army` throw. r2 was required to show a visible reason line and not draw the grid, add a named Empty test, and update HB1:125. Non-blockers (QA1:29-35, QA1:42) are recorded below |
| r2 commits | two fast-forward commits on the same branch `step/step-05c-add-ability-r1-chatA`, parent of the first is the r1 tip `f75e5386` (no force-push or rebase; V2): `f308d135` fix: show the engine reason when a diagram cannot play (r2 code head, tree `1d613bb6`), `e2e0463d` docs(handback): step-05c-add-ability r1 (tree `4db8eb34`). The product fix is `unit-diagram.ts`, `ability-panel.ts`, `add-ability.ts` and `add-ability.test.ts` (26+/12− vs r1). The tip vs the r2 code head is HANDBACK.md only (16+/13−) |
| r2 verdict | QA **OK TO MERGE** (QA2:13). The must-fix is fixed (QA2:6): `diagramOf` returns a `{reason}` view; `diagramHtml` shows `<p class="sub" data-diagram="off">` and draws no grid; a non-Error or empty message is rethrown; the named test `the Empty template gives that visible reason line` is at `tests/editor/add-ability.test.ts:94-99`. HB2:128 and HB2:130 were updated. Green 1082/0, G7 393, smokes pass (QA2:8-10, V2) |
| Merge | PR #89 "Step 5c: + Add ability", merge commit `5a2c8e793e15cc8a7d900caeaaf9bea12f19c1d7`, 2026-11-21 17:32 (UK time). Tree `4db8eb34b49657c8a79c445a4fb1481eb9c3d12b` (the same tree CoS and QA predicted against `88a6ac93`; V2, QA2:11). First parent `88a6ac93` (the base), second parent `e2e0463d` |
| After the merge | main is `80eedada932b3e16a99b17659655b921a362b293`, which adds `docs/qa/step-05c-review.md` and `docs/qa/step-05c-r2-recheck.md`. QA postmerge PASS on merge 5a2c8e79 (PR #89): parent2 = e2e0463d, noreply ok, src/tests/tools diff equality ok, pins 5/5 unchanged, npm 1082/0, smoke 0 failed; main 80eedada adds only docs/qa/step-05c-review.md and docs/qa/step-05c-r2-recheck.md. |
| Tests | 1074 + N=8 (`rev case same: add re-cuts the slice`, `rev case older: offer first, no rev-B entry`, `rev case newer: add is off`, `remove doesn't prune`, `missing goal goes to Other`, `only wired primaries are offered`, `diagram comes from the engine`, `the Empty template gives that visible reason line`) = **1082 pass / 0 fail**. Floor after this merge is **1082** (HB2:30-38, V2, QA2:8). r1 was 1074 + N=7 = 1081 |
| Size | Accepted measure, `git diff --shortstat 88a6ac93..f308d135 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5c-add-ability/**'`, is 17 files, **355 insertions + 38 deletions = 393** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L94-95, L223, L234; QA2:9, V2, HB2:39). The 321 figure at guide L223 is the sum of file caps, not a second gate (QA1:15). The same shortstat holds at the r2 tip `e2e0463d` and at the merge (the first parent is the base, so no extra docs landed on the merge commit). r1 was 17 files, 341+38=379. Without the excludes, the merge shortstat is 25 files, 592 insertions and 38 deletions (the 17 counted files, the smoke, `setup.ability.json`, and the six hand-back files). The s5c smoke is 86 lines, under its own cap of 130 (guide L221, L36; HB2:40), and is unedited vs r1 |
| Stamp | `node tools/maker/build.ts` writes stamp `b059a41693b0` at the r2 code head and at the merge (same maker sources) |
| Smoke | No `tools/play-stage/` file changed, so S0 is not required (guide L35, L243). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s5c smoke prints `SMOKE PASS` once, after checks 1–8 (including `8 targets`) at 390 and at 360, under google-chrome on port 8804, and also passes under eight CPU-burn loops; the s5b smoke does the same as 5b on port 8803, and s5a on 8802 (guide L35, L225, L243; HB2:48-64, 69-85, 90-106; V2; QA2:10). s5b and s5a are unedited vs the base |

## (b) Files

From `git diff --name-status 88a6ac93..e2e0463d -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the base (r2 values, which is what merged). The same 19 product files (17 counted, plus the smoke and the data skeleton) are on the merge tree `4db8eb34`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `tools/maker/build.ts` | edited | 2 (1+/1−, cap 6) | Maker walk ships `behaviour-library/behaviours.json` as `tools/maker/catalogue.json.js` under the maker stamp only (guide L213) |
| `tools/maker/catalogue.ts` | new | 8 (cap 25) | Import the bundled catalogue; `revCase(P, B)` → `same` / `older` / `newer` (guide L214) |
| `tools/maker/catalogue.json` | new (symlink) | 1 | Extra: git symlink to `../../behaviour-library/behaviours.json` (HB2:126, HB2:130) |
| `src/editor/unit/add.ts` | new | 82 (cap 85) | Pure: `addable`, `byGoal`, `addAbility`, `canUpdate`, `updateProject` (guide L215) |
| `data/templates/setup.ability.json` | new | 15 (data) | Setup skeleton. Uncounted (`':!data/templates/**'`; guide L216) |
| `tools/maker/add-ability.ts` | new | 52 (cap 90) | + Add ability sheet: goal cards, card list with search, the offer and the newer-project note (guide L217) |
| `tools/maker/unit-diagram.ts` | new | 42 (cap 30) | Diagram through `playDocsOf` + `inOrthogonalReach`; r2 reason line when the engine cannot play (guide L218). Over the file cap; named in HB2:130 |
| `tests/editor/add-ability.test.ts` | new | 99 (cap 80) | The eight named tests (guide L219, L235-242). Over the file cap; named in HB2:130 |
| `tests/tools/maker-build.test.ts` | edited | 4 (3+/1−, cap 5) | Maker output has the catalogue; the play-stage build output does not (guide L220; L25-26) |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | new | 86 (cap 130) | Browser smoke, own cap, outside the 400 (guide L221, L36). Measures check 8 with + Add ability, a goal's card list and the update offer |
| `src/project/slice-of.ts` | new | 24 | Extra: `sliceOf` / `sliceDoc` moved here because src cannot import tools (HB2:125, HB2:130) |
| `tools/project/slice-of.ts` | edited | 20 (1+/19−) | Extra: re-exports `sliceDoc`, `sliceOf` and `CatalogueDoc` from `src/project/slice-of.ts` (HB2:125, HB2:130) |
| `src/editor/project/save.ts` | edited | 2 (1+/1−) | Extra: `planSave` writes `catalogue/slice.json` unchanged (HB2:125, HB2:130) |
| `tools/maker/ability-panel.ts` | edited | 8 (6+/2−) | Extra: mounts `addChrome`, uses `diagramHtml(diagramOf(...))` in the open panel, × does not prune the slice (HB2:130) |
| `tools/maker/units.ts` | edited | 26 (17+/9−) | Extra: routes `g:` to `addClick` and save (HB2:130) |
| `tools/maker/home.ts` | edited | 9 (6+/3−) | Extra: `g:` routing (HB2:130) |
| `tools/maker/app.css` | edited | 9 (7+/2−) | Extra: goal/card and 36×16 reach-grid styles (HB2:128-130) |
| `tools/maker/dev.ts` | new | 2 | Extra: dev-only `DEV` flag (HB2:130) |
| `tests/editor/maker-law.test.ts` | edited | 3 | Extra: plant for a `goal` literal next to a behaviour id, and `group` in the add code (guide L228; HB2:130) |

No other product file. Nothing under `tests/tools/golden/`, `behaviour-library/**`, `tools/play-stage/`, `package.json` or `package-lock.json`. Path and Dirt stay hidden. No Suggested chip, no role row, no “Browse all” inside + Add ability (guide L230; QA1:24).

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest are `tools/maker/units.ts` at 180, `tools/maker/home.ts` at 144, `tools/maker/ability-panel.ts` at 88 and `src/editor/unit/add.ts` at 82.

## (c) Key code and git commands

`tools/maker/catalogue.ts` imports the bundled catalogue as JSON, with no `JSON.parse`:

```ts
import raw from "./catalogue.json" with { type: "json" };
```

`BUNDLED` is `asCatalogue(raw)` (`catalogue.ts:7`). `revCase` is `catalogue.ts:8`. `tools/maker/catalogue.json` is a git symlink to `../../behaviour-library/behaviours.json`. The maker build special-cases that path and reads `behaviour-library/behaviours.json`, shipping it as `export default …` in `tools/maker/catalogue.json.js` under the maker stamp only (`build.ts:9`). `tests/tools/maker-build.test.ts:25-26` asserts the maker output has that file and the play-stage output has neither `catalogue.json.js` nor `behaviours.json`. Zero changes under `behaviour-library/**`. No `tools/play-stage` file changed, and play-stage does not import maker or the catalogue (guide L229, L187).

`src/editor/unit/add.ts` is the pure add helper. `addable` (`add.ts:19-27`) keeps bundled entries that are in `WIRED`, have `"primary"` in `composable_as`, and are not already on the unit; a missing or unknown `goal` is stored as `""` (`add.ts:23-24`) and later lands in Other. `byGoal` (`add.ts:28-34`) walks the seven goals, then Other last, and omits empty bins. `addCase` (`add.ts:35-41`) is `same` / `newer` / `older`; older uses `OFFER` when `canUpdate` is true, otherwise `BIGGER` (`add.ts:7-9, 40`). `canUpdate` (`add.ts:43-51`) compares knob id, type, default, options, min, max, step and `max_len`. `addAbility` (`add.ts:65-75`) refuses when the rev case is not `same` or the behaviour is already on the unit (`missing`); on success the new setup has `{source:"default"}` answers (`answersOf`, `add.ts:52-60`), the slice is `sliceOf(bundled, used + new)`, and the setup file is added. `updateProject` (`add.ts:76-82`) recuts at B and sets `catalogueRev` and each setup's `catalogue.rev`. `sliceOf` / `sliceDoc` live in `src/project/slice-of.ts`; `tools/project/slice-of.ts:1` re-exports them. `planSave` returns `catalogue/slice.json` text unchanged (`save.ts:19`).

`tools/maker/add-ability.ts` paints the sheets. `addChrome` (`add-ability.ts:31-37`) shows the newer-project note and no + Add ability when P > B (`add-ability.ts:34`); otherwise the `+ Add ability` button (`add-ability.ts:36`), mounted under the list at `tools/maker/ability-panel.ts:51`. P < B opens the offer first (`add-ability.ts:15-19, 42`): Update / Not now, or Close only when `canUpdate` is false. Goal cards and a goal's card list are `add-ability.ts:20-30`, with the search hint “Tap a card to add it with defaults” and `diagramHtml(diagramOf(...))` on each card (`add-ability.ts:28`). Adding without Update is refused (`add-ability.ts:46`). `tools/maker/units.ts:126-132` routes `g:` to `addClick` and save. × is still detach only (`ability-panel.ts:81`) and does not rewrite the slice.

The r2 diagram is `tools/maker/unit-diagram.ts`. `played` (`unit-diagram.ts:13-17`) is:

```ts
function played(files: ProjectFiles): Played {
  const load = readProject(files);
  if (!load.ok || load.project === null) { const text = load.report.map((row) => [row.code, row.path, row.detail].filter((part) => part !== undefined).join(" ")).join("\n"); if (text === "") throw new Error("play: project"); return { reason: text }; }
  try { return { docs: playDocsOf(load.project) }; } catch (e) { if (!(e instanceof Error) || e.message === "") throw e; return { reason: e.message }; }
}
```

`diagramOf` (`unit-diagram.ts:33-39`) returns that `{reason}` and does not build a grid; only a successful play returns `{ cells: grid(reach) }`. Reach is still a 7×7 from `{c:3,r:3}` through `inOrthogonalReach` (`src/rules/battle/range.ts:4-7`), computed when drawn (guide L207). `diagramHtml` (`unit-diagram.ts:42`) is:

```ts
export function diagramHtml(view: DiagramView): string { return "reason" in view ? `<p class="sub" data-diagram="off">${esc(view.reason)}</p>` : `<div class="reach-grid" role="img" aria-label="Reach">${view.cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
```

The open panel uses the same `diagramHtml(diagramOf(...))` (`ability-panel.ts:39`). `diagramCells` (`unit-diagram.ts:40`) throws the reason, so a test that wants cells cannot pass on a failed play.

The eight named tests are `tests/editor/add-ability.test.ts:26`, `:42`, `:55`, `:64`, `:74`, `:80`, `:85` and `:94-99` (`the Empty template gives that visible reason line`): HTML includes `play: army` and `data-diagram="off"`, does not include `reach-grid`, and `diagramCells` throws `play: army`.

The Empty template still has no `unit-roster` setup, so `playDocsOf` still throws at `tools/play-stage/project.ts:33-34`:

```ts
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
```

That is the 5a/5b carry and guide L259. It is left in place and restated at HB2:128 and in § Open carry (HB2:135-136).

The s5c smoke (`handoff/steps/tests/s5c-add-ability/smoke.mjs`, 86 lines) has no `waitForTimeout`. `tap()` and `press()` (L16-17) use `locator.waitFor` only, the same as the frozen smokes. Every other wait is `page.waitForFunction`. Check 8 (`8 targets @${width}`, L81) collects under-48 px targets via `big()` while the goal sheet (L36), a goal's card list (L43) and the update offer (L71) are open (guide L37, L225; HB2:46). The reason line is not on the demo path, so the diagram checks still see `.reach-grid span.on` (HB2:46).

## (d) What went wrong, in order, and the fix

**r1.** The product shipped and green was 1081/0. The official gate was 341 + 38 = 379. Solo, CPU-burn and a third s5c smoke passed, as did s5b and s5a, including check 8 with the new sheets open. Every over-cap file and every extra file is named in HB1:127. The r1 tip holds only `HANDBACK.md` and the five screenshots. HB1:3 is “PR: none yet from the branch.”

A diagram before-pass bug was found and fixed before the r1 code head, not after: if the behaviour was missing from the slice, `playDocsOf` threw and the grid was blank; `cb1b0ff8` recuts a temporary slice on both draws (HB1:116-117). That fix is in the r1 code head.

QA **NOT OK** (QA1:3). Must-fix (QA1:40), Law 12 (guide L137): at `cb1b0ff8`, `played()` in `tools/maker/unit-diagram.ts:12` caught every `Error` from `playDocsOf` and returned `null`, and `diagramCells` at `:29` drew `grid(null)`. That is a silent default. It hid real faults as well as the Empty `play: army` throw. r2 had to show a visible reason line (for example `play: army`), not draw the grid, add one named Empty test, and update HB1:125, while keeping the count under 400.

**r2.** `f308d135` replaces that catch with a `{reason}` view (`unit-diagram.ts:13-17, 33-39, 42`). The panel and the + Add ability cards call `diagramHtml(diagramOf(...))`. A non-Error or an empty message is rethrown; an empty `readProject` report throws `play: project` rather than a blank line. The new test is `add-ability.test.ts:94-99`. Green is 1082/0. The official gate is 355 + 38 = 393. HB2:128 describes the reason line; HB2:130 names `unit-diagram.ts` 42/30 and `add-ability.test.ts` 99/80. The r2 tip updates only the note at the r1 path. Helpers HB2:118-119 came back CLEAN (V2:25).

QA **OK TO MERGE** (QA2:13). The merge tree is `4db8eb34`, as predicted (QA2:11, V2).

## (e) Do it right first time

- Start from the catalogue-rev-30-on-main commit `88a6ac93`. The floor at the start of 5c is 1074 + N; this merge leaves the floor at 1082.
- Put the add model in `src/editor/unit/add.ts` and the + Add ability UI in `tools/maker/add-ability.ts`. Import the bundled catalogue as JSON (`with { type: "json" }`); do not `JSON.parse` it in maker code. Ship it under the maker stamp only; the play-stage and APK builds must not contain it. Do not edit `behaviour-library/**`. Do not import `tools/maker` or `src/editor` into `tools/play-stage`. Do not edit the S0 kit.
- No Suggested chip, no role row, no “Browse all” inside + Add ability. No id-to-goal table and no `group` list in the add code. No prune on ×. No mock Test results, no reach cache.
- Do not swallow `playDocsOf` failures (Law 12, guide L137). An unplayable project must show a visible reason line (the thrown message, for example `play: army`) in `<p class="sub" data-diagram="off">` and must not draw the reach grid. A non-Error or an empty message is rethrown. Add a named test that the Empty template gives that line, not an unmarked grid.
- Leave the Empty `play: army` throw at `tools/play-stage/project.ts:33-34` until the empty template grows a `unit-roster` setup or the adapter gets a default (guide L259). Restate that carry in the hand-back.
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L95). Here that is `unit-diagram.ts` (42 vs 30) and `add-ability.test.ts` (99 vs 80). Extra files must also be named.
- A smoke that claims “every target is 48 px” must measure + Add ability, a goal's card list and the update offer **while they are open**, and must print a `8 targets @<width>` line at 390 and at 360. New waits are `waitForFunction`, not `waitForTimeout`. S0 is required only if a play-stage file changed; leave its sha256 `d528795e…`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A CPU-burn note can follow the paste. The tip commit should hold `HANDBACK.md` and the screenshots, not raw test logs.
- Measure with the step-05 count command (guide L94-95), with `':!handoff/steps/tests/s5c-add-ability/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 393 is the accepted number. The smoke's own cap is 130. On a merge whose first parent is not the base, also exclude `':!docs/**'`.

## (f) Rebuild check

From a clean tree at `88a6ac93`, write the 19 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:

```bash
# Product gate. The first parent of the merge is the base, so the official
# command at the r2 code head, the r2 tip and the merge is the same number.
# (After the merge, main 80eedada adds only the two QA reviews; those are
# not this step. On a rebuild branch that does not touch docs, ':!docs/**'
# does not change the count.)
git diff --shortstat 88a6ac93..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5c-add-ability/**' ':!docs/**'
#   17 files changed, 355 insertions(+), 38 deletions(-)

git diff --shortstat 88a6ac93..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**' ':!behaviour-library/**' ':!handoff/steps/tests/s5c-add-ability/**'   # at the r2 code head, r2 tip, or merge
#   17 files changed, 355 insertions(+), 38 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat 88a6ac93..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

git diff --stat 88a6ac93..HEAD -- behaviour-library/ tools/play-stage/   # empty

npm ci && npm run green   # 1082 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ rev case same: add re-cuts the slice
#   ✔ rev case older: offer first, no rev-B entry
#   ✔ rev case newer: add is off
#   ✔ remove doesn't prune
#   ✔ missing goal goes to Other
#   ✔ only wired primaries are offered
#   ✔ diagram comes from the engine
#   ✔ the Empty template gives that visible reason line

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804
#   ok 1-8 (including 8 targets) @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5b-abilities/smoke.mjs . 8803
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s5a-units/smoke.mjs . 8802
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s5c smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s5c-add-ability/smoke.mjs` is 86.
# `node tools/maker/build.ts` writes stamp b059a41693b0.
# S0 is not required (no play-stage change).
```

Against the merge tree: on your rebuild branch, `git diff 5a2c8e79 HEAD -- src/editor/unit/add.ts src/project/slice-of.ts src/editor/project/save.ts tools/maker/catalogue.ts tools/maker/catalogue.json tools/maker/add-ability.ts tools/maker/unit-diagram.ts tools/maker/dev.ts tools/maker/build.ts tools/maker/ability-panel.ts tools/maker/units.ts tools/maker/home.ts tools/maker/app.css tools/project/slice-of.ts tests/editor/add-ability.test.ts tests/tools/maker-build.test.ts tests/editor/maker-law.test.ts data/templates/setup.ability.json handoff/steps/tests/s5c-add-ability/smoke.mjs` must be empty. The blob table below lists the exact git blob id each file must have at `5a2c8e79`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id (mode 120000 for `tools/maker/catalogue.json`). The product and test blobs (everything except the hand-back) must also match r2 code head `f308d135`.

## QA non-blockers carried forward

From QA1:29-35 and QA1:42. None of these blocked the PR after r2. They should be carried into a later step where relevant.

1. **No named test for the P < B “bigger update” path.** A plant making `canUpdate` always return true still left the named tests green (QA1:32). Product `canUpdate` does compare knob id, type, default, options, min, max, step and `max_len` (`add.ts:43-51`). The `BIGGER` sentence and Close-only sheet are in the code (`add.ts:8, 40`; `add-ability.ts:17`). Guide L205; Rulings needed 4.
2. **`missing goal goes to Other` does not drive `addable()`.** A plant that skipped empty or unknown goals in `addable` still left all named tests green (QA1:31). Product `addable` does include those rows (`add.ts:23-24`) and `byGoal` is locked (omitting the Other bin fails the named test). Not a product fail.
3. **Empty `play: army`.** Correctly left in place at `tools/play-stage/project.ts:33-34` (guide L259). Units made on an Empty project cannot be Tested, and the diagram now shows `play: army` instead of a blank grid. Restated at HB2:128 and in § Open carry (HB2:135-136). Carry it forward until the empty template grows a `unit-roster` setup or the adapter gets a default.
4. **Chrome / Node.** HB2:44 is a Playwright headless shell (HeadlessChrome/156.0.8078.4). QA re-ran with `/usr/bin/google-chrome` 156.0.8078.47. HB2:5 is Node v22.23.3; `.nvmrc` pins 24 (QA1:34). `npm ci` was not re-run on the hand-back pass (HB2:30); the lockfile matched the `node_modules` used.
5. The 4a/4b/4c/5a/5b carries are still open, including uncapped stage undo (`src/editor/stage/undo.ts`), the maker-law plant dir with no `try/finally`, the talk skeleton `createdAt`, session-only unused delete, and Path and Dirt hidden (QA1:35). `who()` still maps any other list to “Enemy” (`tools/maker/rooms.ts:41`). `usedBy` still walks live stages only. The `mapAt[id] ??` fallback in `src/project/load/drops.ts:43` and the `resizeMap` 0 defaults at `src/editor/stage/resize.ts:37` were not edited.

## Blob check

Each file must have exactly this git blob id at `5a2c8e79`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>` (for the symlink, `git ls-tree` must show mode `120000` and blob `5b0e3a42`).

| File | git blob id | lines |
|---|---|---|
| `src/editor/unit/add.ts` | `36e9506c287337f750d7dd30a3bb901ec54a2dbd` | 82 |
| `src/project/slice-of.ts` | `2288aac05d90ebc823f934a7efb01466aba21617` | 24 |
| `src/editor/project/save.ts` | `0b5a1224266815a155866e2f9e7c3062d4eae692` | 36 |
| `tools/maker/catalogue.ts` | `1c52b93eca2f6ce733478f49292a18f14c01fa62` | 8 |
| `tools/maker/catalogue.json` | `5b0e3a42184767b850a66c1e3c78454e5a2eae7c` | symlink |
| `tools/maker/add-ability.ts` | `f2c12de98dbedd81116b45662916f8a208b314c5` | 52 |
| `tools/maker/unit-diagram.ts` | `49f0e9356348f509f4cf67e9992bb721f72c449d` | 42 |
| `tools/maker/dev.ts` | `44cdffde422e677e1f6cf2aa5283453aa342ed4b` | 2 |
| `tools/maker/build.ts` | `f57cc558065ebea9ad7b6794273aa4de9f0eb04f` | 36 |
| `tools/maker/ability-panel.ts` | `ec1c6c4876dc7dd5fd4808ea734deedf6511fa40` | 88 |
| `tools/maker/units.ts` | `2d4555760eca8889e08a15aea420bce22009fd58` | 180 |
| `tools/maker/home.ts` | `5b23aee9c50003b360be52379eab714a0112418e` | 144 |
| `tools/maker/app.css` | `df3460bf8120a17f80f2dc7b1aa4721f6ee860e6` | 56 |
| `tools/project/slice-of.ts` | `36420c02f4e4bc888a8085fce63b17ebce1b7014` | 1 |
| `tests/editor/add-ability.test.ts` | `6419b42238c757478ed25bfd0f8689f45e756f19` | 99 |
| `tests/tools/maker-build.test.ts` | `8f9ff9632077b27017d5fccecb7d9489ba2add6c` | 37 |
| `tests/editor/maker-law.test.ts` | `0a5ec3c8c08179339b704634d37c2731ae3453cd` | 39 |
| `data/templates/setup.ability.json` | `de1997715e1840a4702bb6a926ca68950362aed1` | 15 |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | `89c91f005d52c52c54a9c9dce85c2eb8976e2bce` | 86 |

## Appendix: full code as merged (step 5c, PR #89)

New files are given in full. Edited files are given as the exact diff from `88a6ac93` to `5a2c8e79`, then in full as merged. Copy them byte for byte; the blob table checks you did. Product, tests, the smoke and `data/templates/setup.ability.json` are identical to r2 code head `f308d135`. `tools/maker/catalogue.json` is a git symlink (mode 120000) to `../../behaviour-library/behaviours.json`. The hand-back is the r2 file at the tip (same path as r1).

### `src/editor/unit/add.ts` (new)

```ts
import { sliceDoc, sliceOf, type CatalogueDoc } from "../../project/slice-of.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const ORDER = ["move", "attack", "defend", "support", "spells", "status", "ai"];
const TITLE: Readonly<Record<string, string>> = { move: "Move", attack: "Attack", defend: "Defend", support: "Support", spells: "Spells", status: "Status", ai: "AI" };
export const OFFER = "New abilities are available. Update this project to use them?";
export const BIGGER = "This project needs a bigger update than the maker can do yet.";
export const NEWER = "This project was made with a newer TileEngine. Update the app to add abilities.";
export const OTHER = "Other abilities";
export type AddEntry = { readonly id: string; readonly name: string; readonly summary: string; readonly goal: string }; export type GoalBin = { readonly title: string; readonly goal: string; readonly cards: readonly AddEntry[] };
export type AddCase = { readonly mode: "same" } | { readonly mode: "older"; readonly text: string; readonly update: boolean } | { readonly mode: "newer"; readonly text: string };
const behaviours = (doc: Obj): Obj[] => list(doc["behaviours"]).filter(isObj);
const knobsOf = (row: Obj): Obj[] => list(row["knobs"]).filter(isObj);
const revNum = (v: unknown): number => (typeof v === "number" && Number.isInteger(v) ? v : -1);
export function projectRev(files: Obj): number { const root = files["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null; return revNum(project?.["catalogueRev"]); }
export function catalogueRev(doc: Obj): number { return revNum(doc["catalogue_rev"]); }
function held(files: Obj, unit: Obj): Set<string> { const ids = new Set<string>(); for (const sid of list(unit["setupIds"])) { const setup = typeof sid === "string" ? files[`setups/${sid}.json`] : undefined; if (isObj(setup) && typeof setup["behaviourId"] === "string") ids.add(setup["behaviourId"]); } return ids; }
export function addable(bundled: Obj, wired: Readonly<Record<string, readonly string[]>>, unit: Obj, files: Obj): readonly AddEntry[] {
  const have = held(files, unit), out: AddEntry[] = [];
  for (const row of behaviours(bundled)) {
    const id = row["id"]; if (typeof id !== "string" || wired[id] === undefined || !list(row["composable_as"]).includes("primary") || have.has(id)) continue;
    const goal = typeof row["goal"] === "string" ? row["goal"] : "";
    out.push({ id, name: typeof row["name"] === "string" ? row["name"] : id, summary: typeof row["summary"] === "string" ? row["summary"] : "", goal });
  }
  return out;
}
export function byGoal(cards: readonly AddEntry[]): readonly GoalBin[] {
  const known = new Set(ORDER), bins: GoalBin[] = [];
  for (const goal of ORDER) { const mine = cards.filter((card) => card.goal === goal); if (mine.length > 0) bins.push({ title: TITLE[goal] ?? goal, goal, cards: mine }); }
  const rest = cards.filter((card) => !known.has(card.goal));
  if (rest.length > 0) bins.push({ title: OTHER, goal: "", cards: rest });
  return bins;
}
export function addCase(files: Obj, bundled: Obj): AddCase {
  const p = projectRev(files), b = catalogueRev(bundled);
  if (p === b) return { mode: "same" };
  if (p > b) return { mode: "newer", text: NEWER };
  const update = canUpdate(isObj(files["catalogue/slice.json"]) ? files["catalogue/slice.json"] : {}, bundled);
  return { mode: "older", text: update ? OFFER : BIGGER, update };
}
const sig = (knob: Obj): string => JSON.stringify({ id: knob["id"], type: knob["type"], d: Object.hasOwn(knob, "default") ? knob["default"] : null, o: knob["options"] ?? null, min: knob["min"] ?? null, max: knob["max"] ?? null, step: knob["step"] ?? null, max_len: knob["max_len"] ?? null });
export function canUpdate(slice: Obj, bundled: Obj): boolean {
  const live = new Map(behaviours(bundled).map((row) => [String(row["id"]), row]));
  for (const row of behaviours(slice)) {
    const next = live.get(String(row["id"])); if (next === undefined) return false;
    const a = knobsOf(row), b = knobsOf(next); if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) { const left = a[i], right = b[i]; if (left === undefined || right === undefined || sig(left) !== sig(right)) return false; }
  }
  return true;
}
function answersOf(row: Obj): Obj {
  const answers: Obj = {};
  for (const knob of knobsOf(row)) {
    if (typeof knob["id"] !== "string" || !Object.hasOwn(knob, "default")) continue;
    const reason = knob["no_default_reason"]; if (typeof reason === "string" && reason !== "") continue;
    answers[knob["id"]] = { source: "default" };
  }
  return answers;
}
function usedIds(slice: Obj): string[] { return behaviours(slice).flatMap((row) => typeof row["id"] === "string" ? [row["id"]] : []); }
function copyBag(files: Obj): Record<string, Obj> { const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(files)) if (isObj(doc)) bag[path] = doc; return bag; }
export type Added = { readonly mode: "added"; readonly bag: Record<string, Obj>; readonly slice: string };
export type AddStop = { readonly mode: "older" | "newer" | "missing" };
export function addAbility(files: Obj, skel: Obj, unitId: string, setupId: string, behaviourId: string, bundled: CatalogueDoc): Added | AddStop {
  const gate = addCase(files, bundled); if (gate.mode !== "same") return { mode: gate.mode === "newer" ? "newer" : "older" };
  const unit = files[`units/${unitId}.json`], slice = files["catalogue/slice.json"]; if (!isObj(unit) || !isObj(slice)) return { mode: "missing" };
  const row = behaviours(bundled).find((item) => item["id"] === behaviourId); if (row === undefined || held(files, unit).has(behaviourId)) return { mode: "missing" };
  const next = structuredClone(skel), catalogue = isObj(next["catalogue"]) ? { ...next["catalogue"] } : {};
  next["id"] = setupId; next["name"] = typeof row["name"] === "string" ? row["name"] : behaviourId; next["behaviourId"] = behaviourId; catalogue["rev"] = catalogueRev(bundled); next["catalogue"] = catalogue; next["answers"] = answersOf(row);
  const ids = [...list(unit["setupIds"]).filter((id) => typeof id === "string"), setupId], used = [...usedIds(slice), behaviourId];
  const cut = sliceOf(bundled, used), bag = copyBag(files), sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return { mode: "missing" };
  bag[`units/${unitId}.json`] = { ...unit, setupIds: ids }; bag[`setups/${setupId}.json`] = next; bag["catalogue/slice.json"] = sliced;
  return { mode: "added", slice: cut, bag };
}
export function updateProject(files: Obj, bundled: CatalogueDoc): { readonly bag: Record<string, Obj>; readonly slice: string } | null {
  const slice = files["catalogue/slice.json"], root = files["project.json"]; if (!isObj(slice) || !isObj(root) || !isObj(root["project"]) || !canUpdate(slice, bundled)) return null;
  const rev = catalogueRev(bundled), used = usedIds(slice), cut = sliceOf(bundled, used), bag = copyBag(files), sliced = sliceDoc(bundled, used); if (!isObj(sliced)) return null;
  bag["project.json"] = { ...root, project: { ...root["project"], catalogueRev: rev } }; bag["catalogue/slice.json"] = sliced;
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc) && isObj(doc["catalogue"])) bag[path] = { ...doc, catalogue: { ...doc["catalogue"], rev } };
  return { bag, slice: cut };
}
```

### `src/project/slice-of.ts` (new)

```ts
const DROP = new Set(["sources", "variants", "used_by", "conflicts", "needs_reverify", "default_source", "item_cites", "item_sources"]);

function copy(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(copy);
  if (typeof v !== "object" || v === null) return v;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(v)) { if (!DROP.has(key)) out[key] = copy((v as Record<string, unknown>)[key]); }
  return out;
}

export type CatalogueDoc = { readonly schema_version: number; readonly catalogue_rev: number; readonly gates: unknown; readonly behaviours: readonly Record<string, unknown>[] };

/** Pure slice object: catalogue order, ids only, dropped info keys removed. */
export function sliceDoc(catalogue: CatalogueDoc, ids: readonly string[]): Record<string, unknown> {
  const want = new Set(ids);
  const behaviours = catalogue.behaviours.filter((b) => want.has(String(b["id"]))).map(copy);
  const doc: Record<string, unknown> = { kind: "catalogue-slice", formatVersion: 1, schema_version: catalogue.schema_version, catalogue_rev: catalogue.catalogue_rev, gates: catalogue.gates, behaviours };
  return doc;
}

/** `JSON.stringify(sliceDoc(...), null, 2) + "\\n"`. */
export function sliceOf(catalogue: CatalogueDoc, ids: readonly string[]): string {
  return `${JSON.stringify(sliceDoc(catalogue, ids), null, 2)}\n`;
}
```

### `tools/maker/catalogue.ts` (new)

```ts
import raw from "./catalogue.json" with { type: "json" };
import type { CatalogueDoc } from "../project/slice-of.ts";
function asCatalogue(value: unknown): CatalogueDoc {
  if (typeof value !== "object" || value === null || !("behaviours" in value) || !("catalogue_rev" in value)) throw new Error("maker: catalogue");
  return value as CatalogueDoc;
}
export const BUNDLED: CatalogueDoc = asCatalogue(raw);
export function revCase(p: number, b: number): "same" | "older" | "newer" { return p === b ? "same" : p < b ? "older" : "newer"; }
```

### `tools/maker/catalogue.json` (new (git symlink))

```json
../../behaviour-library/behaviours.json```

### `tools/maker/add-ability.ts` (new)

```ts
import { addAbility, addCase, addable, byGoal, updateProject, type AddCase } from "../../src/editor/unit/add.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED } from "./catalogue.ts";
import { diagramHtml, diagramOf } from "./unit-diagram.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
let skel: Obj | null = null, view: "off" | "goals" | "cards" | "offer" = "off", picked = 0, query = "";
export function rememberAbility(doc: unknown): void { if (!isObj(doc)) throw new Error("Can't open: templates"); skel = doc; }
export function addShut(): void { view = "off"; query = ""; }
export function addFind(text: string): void { query = text; }
export type AddHit = { readonly keep: true } | { readonly bag: Record<string, Obj>; readonly slice: string; readonly toast: string; readonly open?: string };
const binsOf = (bag: Obj, unit: Obj) => byGoal(addable(BUNDLED, WIRED, unit, bag));
function offer(gate: AddCase): string {
  if (gate.mode !== "older") return "";
  const act = gate.update ? `<button type="button" class="btn" data-act="g:update">Update</button><button type="button" class="btn ghost" data-act="g:close">Not now</button>` : `<button type="button" class="btn ghost" data-act="g:close">Close</button>`;
  return `<div class="scrim" data-sheet="offer"><div class="sheet" role="dialog"><h2>Browse by goal</h2><p>${esc(gate.text)}</p>${act}</div></div>`;
}
function goals(bag: Obj, unit: Obj): string {
  const bins = binsOf(bag, unit);
  const cards = bins.map((bin, i) => `<button type="button" class="card" data-act="g:bin:${i}" data-goal="${esc(bin.title)}"><span class="grow"><span class="name">${esc(bin.title)}</span><span class="sub">${bin.cards.length}</span></span></button>`).join("");
  return `<div class="scrim" data-sheet="goals"><div class="sheet" role="dialog"><h2>Browse by goal</h2>${cards}<button type="button" class="btn ghost" data-act="g:close">Close</button></div></div>`;
}
function cards(bag: Obj, unit: Obj): string {
  const bin = binsOf(bag, unit)[picked]; if (bin === undefined) return goals(bag, unit);
  const id = typeof unit["id"] === "string" ? unit["id"] : "", q = query.toLowerCase();
  const rows = bin.cards.filter((card) => q === "" || `${card.name} ${card.summary}`.toLowerCase().includes(q)).map((card) => `<button type="button" class="card ability-add" data-act="g:add:${esc(card.id)}" data-add="${esc(`${card.name} ${card.summary}`)}">${diagramHtml(diagramOf(bag, id, card.id, null))}<span class="name">${esc(card.name)}</span><span class="sub">${esc(card.summary)}</span></button>`).join("");
  return `<div class="scrim" data-sheet="cards"><div class="sheet" role="dialog"><h2>${esc(bin.title)}</h2><input class="name-field" data-find value="${esc(query)}" aria-label="Tap a card to add it with defaults"><p class="hint">Tap a card to add it with defaults</p>${rows}<button type="button" class="btn ghost" data-act="g:back">Back</button></div></div>`;
}
export function addChrome(bag: Obj, unit: Obj, readOnly: boolean): string {
  if (readOnly || !isObj(bag["project.json"])) return "";
  const gate = addCase(bag, BUNDLED);
  if (gate.mode === "newer") return `<p class="hint">${esc(gate.text)}</p>`;
  const sheet = view === "offer" ? offer(gate) : view === "goals" ? goals(bag, unit) : view === "cards" ? cards(bag, unit) : "";
  return `<button type="button" class="btn" data-act="g:open">+ Add ability</button>${sheet}`;
}
export function addClick(act: string, bag: Obj, unitId: string, setupId: string): AddHit {
  const gate = addCase(bag, BUNDLED);
  if (act === "g:close" || act === "g:back" && view === "goals") { addShut(); return { keep: true }; }
  if (act === "g:back") { view = "goals"; return { keep: true }; }
  if (act === "g:open") { view = gate.mode === "older" ? "offer" : "goals"; return { keep: true }; }
  if (act.startsWith("g:bin:")) { picked = Number(act.slice(6)); view = "cards"; return { keep: true }; }
  if (act === "g:update") { const next = updateProject(bag, BUNDLED); if (next === null) return { keep: true }; view = "off"; return { bag: next.bag, slice: next.slice, toast: "Changed · Undo" }; }
  if (act.startsWith("g:add:")) {
    if (skel === null || gate.mode !== "same") return { keep: true };
    const got = addAbility(bag, skel, unitId, setupId, act.slice(6), BUNDLED);
    if (got.mode !== "added") return { keep: true };
    view = "off"; return { bag: got.bag, slice: got.slice, toast: "Changed · Undo", open: setupId };
  }
  return { keep: true };
}
```

### `tools/maker/unit-diagram.ts` (new)

```ts
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { sliceDoc } from "../project/slice-of.ts";
import { playDocsOf } from "../play-stage/project.ts";
import { BUNDLED } from "./catalogue.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
export type ReachCell = { readonly c: number; readonly r: number; readonly on: boolean };
const grid = (reach: number | null): readonly ReachCell[] => Array.from({ length: 49 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return { c, r, on: reach !== null && inOrthogonalReach({ c: 3, r: 3 }, { c, r }, reach) }; });
function shell(files: ProjectFiles): Obj | null { for (const [path, doc] of Object.entries(files)) if (path.startsWith("setups/") && isObj(doc)) return structuredClone(doc); return null; }
type Played = { readonly docs: ReturnType<typeof playDocsOf> } | { readonly reason: string };
function played(files: ProjectFiles): Played {
  const load = readProject(files);
  if (!load.ok || load.project === null) { const text = load.report.map((row) => [row.code, row.path, row.detail].filter((part) => part !== undefined).join(" ")).join("\n"); if (text === "") throw new Error("play: project"); return { reason: text }; }
  try { return { docs: playDocsOf(load.project) }; } catch (e) { if (!(e instanceof Error) || e.message === "") throw e; return { reason: e.message }; }
}
function withSlice(bag: Record<string, unknown>, behaviourId: string): void {
  const slice = bag["catalogue/slice.json"]; if (!isObj(slice) || list(slice["behaviours"]).some((row) => isObj(row) && row["id"] === behaviourId)) return;
  const ids = list(slice["behaviours"]).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
  const cut = sliceDoc(BUNDLED, [...ids, behaviourId]); if (isObj(cut)) bag["catalogue/slice.json"] = cut;
}
function withCandidate(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null, on: boolean): ProjectFiles {
  const bag: Record<string, unknown> = structuredClone(files), path = `units/${unitId}.json`, unit = bag[path]; if (!isObj(unit)) return bag;
  const drop = new Set<string>(); for (const sid of list(unit["setupIds"])) { const setup = typeof sid === "string" ? bag[`setups/${sid}.json`] : undefined; if (typeof sid === "string" && isObj(setup) && setup["behaviourId"] === behaviourId) drop.add(sid); }
  const ids = list(unit["setupIds"]).filter((id) => typeof id === "string" && !drop.has(id)); if (!on) { bag[path] = { ...unit, setupIds: ids }; withSlice(bag, behaviourId); return bag; }
  const base = shell(files); if (base === null) return bag;
  const id = "setup_diagram", catalogue = isObj(base["catalogue"]) ? { ...base["catalogue"] } : {}, empty: Obj = {};
  catalogue["rev"] = 0; base["id"] = id; base["behaviourId"] = behaviourId; base["answers"] = answers === null ? empty : answers; base["catalogue"] = catalogue;
  bag[`setups/${id}.json`] = base; bag[path] = { ...unit, setupIds: [...ids, id] }; withSlice(bag, behaviourId); return bag;
}
export type DiagramView = { readonly cells: readonly ReachCell[] } | { readonly reason: string };
export function diagramOf(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): DiagramView {
  const before = played(withCandidate(files, unitId, behaviourId, null, false)), after = played(withCandidate(files, unitId, behaviourId, answers, true));
  if ("reason" in before) return before; if ("reason" in after) return after;
  const a0 = before.docs.rules.abilities?.[unitId]?.length ?? 0, a1 = after.docs.rules.abilities?.[unitId]?.length ?? 0, grew = a1 > a0 ? after.docs.rules.abilities?.[unitId]?.[a1 - 1]?.reach : undefined;
  const r0 = before.docs.rules.reach?.[unitId], r1 = after.docs.rules.reach?.[unitId], reach = typeof grew === "number" ? grew : r1 !== r0 && typeof r1 === "number" ? r1 : null;
  return { cells: grid(reach) };
}
export function diagramCells(files: ProjectFiles, unitId: string, behaviourId: string, answers: Obj | null): readonly ReachCell[] { const view = diagramOf(files, unitId, behaviourId, answers); if ("reason" in view) throw new Error(view.reason); return view.cells; }
const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function diagramHtml(view: DiagramView): string { return "reason" in view ? `<p class="sub" data-diagram="off">${esc(view.reason)}</p>` : `<div class="reach-grid" role="img" aria-label="Reach">${view.cells.map((cell) => `<span${cell.on ? ' class="on"' : ""}>${cell.on ? "reach" : ""}</span>`).join("")}</div>`; }
```

### `tools/maker/dev.ts` (new)

```ts
/** Release builds set this false by deleting every dev-only line. */
export const DEV = true;
```

### `tests/editor/add-ability.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { addAbility, addCase, addable, byGoal, updateProject, type AddEntry } from "../../src/editor/unit/add.ts";
import { detach } from "../../src/editor/unit/panel.ts";
import { readProject } from "../../src/project/load/index.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { BUNDLED, revCase } from "../../tools/maker/catalogue.ts";
import { addChrome } from "../../tools/maker/add-ability.ts";
import { abilityAct } from "../../tools/maker/ability-panel.ts";
import { diagramCells, diagramHtml, diagramOf } from "../../tools/maker/unit-diagram.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { openProject, playDocsOf } from "../../tools/play-stage/project.ts";
import { sliceOf } from "../../tools/project/slice-of.ts";
const root = fileURLToPath(new URL("../..", import.meta.url)), KNIGHT = "unit_01JDAN00000000000000000001", ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", SID = "setup_01JDADD0000000000000000001";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const walk = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, go = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) go(path, next); else out[next] = readFileSync(path, "utf8"); } }; go(join(root, rel), ""); return out; };
const demo = (): Obj => { const parsed = parseProject(walk("fixtures/demo.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return {}; const bag: Obj = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const skel = (): Obj => { const doc = JSON.parse(readFileSync(join(root, "data/templates/setup.ability.json"), "utf8")) as unknown; assert.ok(isObj(doc)); return doc; };
const idsOf = (slice: Obj): string[] => (Array.isArray(slice["behaviours"]) ? slice["behaviours"] : []).flatMap((row) => isObj(row) && typeof row["id"] === "string" ? [row["id"]] : []);
const B = BUNDLED.catalogue_rev;
test("rev case same: add re-cuts the slice", () => {
  assert.equal(revCase(B, B), "same");
  const bag = demo(), slice = bag["catalogue/slice.json"], unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(slice) && isObj(unit) && Array.isArray(slice["behaviours"])); if (!isObj(slice) || !isObj(unit) || !Array.isArray(slice["behaviours"])) return;
  slice["behaviours"] = slice["behaviours"].filter((row) => !(isObj(row) && row["id"] === "line-shot"));
  const used = idsOf(slice); assert.equal(used.includes("line-shot"), false);
  const got = addAbility(bag, skel(), KNIGHT, SID, "line-shot", BUNDLED); assert.equal(got.mode, "added"); if (got.mode !== "added") return;
  assert.equal(got.slice, sliceOf(BUNDLED, [...used, "line-shot"])); assert.match(got.slice, /"id": "line-shot"/);
  const again = addAbility(got.bag, skel(), KNIGHT, `${SID}x`, "line-shot", BUNDLED); assert.equal(again.mode, "missing");
  const setup = got.bag[`setups/${SID}.json`]; assert.ok(isObj(setup) && isObj(setup["answers"])); if (!isObj(setup) || !isObj(setup["answers"])) return;
  const want = BUNDLED.behaviours.find((row) => row["id"] === "line-shot")?.["knobs"];
  const keys = (Array.isArray(want) ? want : []).flatMap((knob) => isObj(knob) && typeof knob["id"] === "string" && Object.hasOwn(knob, "default") && !(typeof knob["no_default_reason"] === "string" && knob["no_default_reason"] !== "") ? [knob["id"]] : []);
  assert.deepEqual(Object.keys(setup["answers"]).sort(), [...keys].sort());
  for (const key of keys) assert.deepEqual(setup["answers"][key], { source: "default" });
  const load = readProject(got.bag); assert.equal(load.ok, true); assert.deepEqual([...load.report], []); assert.equal(load.project !== null, true); if (load.project === null) return;
  assert.equal(playDocsOf(load.project).rules.abilities?.[KNIGHT]?.[0]?.reach, 3);
});
test("rev case older: offer first, no rev-B entry", () => {
  assert.equal(revCase(B - 1, B), "older");
  const bag = demo(), rootDoc = bag["project.json"]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B - 1 };
  const before = JSON.stringify(bag["catalogue/slice.json"]), gate = addCase(bag, BUNDLED);
  assert.equal(gate.mode, "older"); if (gate.mode !== "older") return; assert.equal(gate.text, "New abilities are available. Update this project to use them?"); assert.equal(gate.update, true);
  const refused = addAbility(bag, skel(), KNIGHT, SID, "line-shot", BUNDLED); assert.equal(refused.mode, "older"); assert.equal(JSON.stringify(bag["catalogue/slice.json"]), before);
  const wrote = updateProject(bag, BUNDLED); assert.ok(wrote !== null); if (wrote === null) return;
  const project = wrote.bag["project.json"]; assert.ok(isObj(project) && isObj(project["project"])); if (!isObj(project) || !isObj(project["project"])) return;
  assert.equal(project["project"]["catalogueRev"], B);
  for (const [path, doc] of Object.entries(wrote.bag)) if (path.startsWith("setups/") && isObj(doc) && isObj(doc["catalogue"])) assert.equal(doc["catalogue"]["rev"], B);
  const load = readProject(wrote.bag); assert.deepEqual([...load.report], []);
});
test("rev case newer: add is off", () => {
  assert.equal(revCase(B + 1, B), "newer");
  const bag = demo(), rootDoc = bag["project.json"], unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(rootDoc) && isObj(rootDoc["project"]) && isObj(unit)); if (!isObj(rootDoc) || !isObj(rootDoc["project"]) || !isObj(unit)) return;
  rootDoc["project"] = { ...rootDoc["project"], catalogueRev: B + 1 };
  const gate = addCase(bag, BUNDLED); assert.equal(gate.mode, "newer"); if (gate.mode !== "newer") return;
  assert.equal(gate.text, "This project was made with a newer TileEngine. Update the app to add abilities.");
  const html = addChrome(bag, unit, false); assert.equal(html.includes("+ Add ability"), false); assert.equal(html.includes(gate.text), true); assert.equal(html.includes("g:add:"), false);
  const opened = openProject(bag); assert.equal(opened.docs !== null, true);
});
test("remove doesn't prune", () => {
  const bag = demo(), slice = bag["catalogue/slice.json"], unit = bag[`units/${ARCHER}.json`]; assert.ok(isObj(slice) && isObj(unit)); if (!isObj(slice) || !isObj(unit)) return;
  const before = JSON.stringify(slice), dropped = detach(unit, LINE), files: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(bag)) if (isObj(doc)) files[path] = doc;
  const hit = abilityAct(`a:drop:${LINE}`, files, ARCHER);
  assert.equal(Array.isArray(dropped["setupIds"]) && dropped["setupIds"].includes(LINE), false);
  assert.equal(JSON.stringify(slice), before); assert.match(before, /line-shot/);
  assert.equal("bag" in hit, true); if (!("bag" in hit)) return;
  assert.equal(JSON.stringify(hit.bag["catalogue/slice.json"]), before); assert.equal(hit.bag[`setups/${LINE}.json`], files[`setups/${LINE}.json`]);
});
test("missing goal goes to Other", () => {
  const cards: AddEntry[] = [{ id: "basic-attack", name: "Basic", summary: "hit", goal: "attack" }, { id: "bare", name: "Bare", summary: "none", goal: "" }, { id: "flyer", name: "Flyer", summary: "air", goal: "flying" }];
  const bins = byGoal(cards); assert.equal(bins.at(-1)?.title, "Other abilities"); assert.equal(bins[0]?.title, "Attack");
  assert.deepEqual(bins.at(-1)?.cards.map((card) => card.id), ["bare", "flyer"]); assert.equal(bins.length, 2);
  const load = readProject(demo()); assert.deepEqual([...load.report], []);
});
test("only wired primaries are offered", () => {
  const bag = demo(), unit = bag[`units/${KNIGHT}.json`]; assert.ok(isObj(unit)); if (!isObj(unit)) return;
  const cards = addable(BUNDLED, WIRED, unit, bag); assert.deepEqual(cards.map((card) => card.id).sort(), ["basic-attack", "line-shot"]);
  assert.equal(cards.every((card) => WIRED[card.id] !== undefined), true);
});
test("diagram comes from the engine", () => {
  const bag = demo(), on = (reach: number): string[] => { const cells: string[] = []; for (let r = 0; r < 7; r += 1) for (let c = 0; c < 7; c += 1) if (inOrthogonalReach({ c: 3, r: 3 }, { c, r }, reach)) cells.push(`${c},${r}`); return cells; };
  const mark = (answers: Obj | null): string[] => diagramCells(bag, KNIGHT, "line-shot", answers).filter((cell) => cell.on).map((cell) => `${cell.c},${cell.r}`);
  assert.deepEqual(mark(null), on(3)); assert.deepEqual(mark({ range: { source: "user", value: 2, rev: 1 } }), on(2)); assert.notDeepEqual(mark(null), mark({ range: { source: "user", value: 2, rev: 1 } }));
  const bare = demo(), live = bare["catalogue/slice.json"]; if (!isObj(live) || !Array.isArray(live["behaviours"])) return;
  live["behaviours"] = live["behaviours"].filter((row) => !(isObj(row) && row["id"] === "line-shot"));
  const held = bare[`setups/${LINE}.json`]; if (isObj(held)) held["answers"] = { range: { source: "default" }, damage: { source: "default" } };
  assert.deepEqual(diagramCells(bare, KNIGHT, "line-shot", null).filter((cell) => cell.on).map((cell) => `${cell.c},${cell.r}`), on(3));
});
test("the Empty template gives that visible reason line", () => {
  const parsed = parseProject(walk("data/templates/empty.tileproj")); assert.equal(parsed.ok, true); if (!parsed.ok) return;
  const html = diagramHtml(diagramOf(parsed.files, "unit_missing", "line-shot", null));
  assert.equal(html.includes("play: army"), true); assert.equal(html.includes("reach-grid"), false); assert.equal(html.includes("data-diagram=\"off\""), true);
  assert.throws(() => diagramCells(parsed.files, "unit_missing", "line-shot", null), (e: unknown) => e instanceof Error && e.message === "play: army");
});
```

### `data/templates/setup.ability.json` (new)

```json
{
  "kind": "behaviour-setup",
  "formatVersion": 3,
  "id": "setup_00000000000000000000000000",
  "rev": 0,
  "name": "Ability",
  "behaviourId": "ability",
  "catalogue": { "rev": 0 },
  "createdAt": "2026-11-19T00:00:00Z",
  "updatedAt": "2026-11-19T00:00:00Z",
  "copiedFrom": null,
  "answers": {},
  "orphans": {},
  "history": { "cap": 200, "baseSeq": 0, "ops": [] }
}
```

### `handoff/steps/tests/s5c-add-ability/smoke.mjs` (new)

```js
// Step 5c + Add ability. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8804"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5c-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const KNIGHT = "unit_01JDAN00000000000000000001";
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
    const lineAct = () => page.evaluate(() => [...document.querySelectorAll("[data-add]")].find((el) => (el.getAttribute("data-add") ?? "").includes("Line Shot"))?.getAttribute("data-act") ?? "");
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await tap(page, "s:cell:0,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Knight · Your team", null, { timeout: 15000 });
    await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="g:open"]') !== null, null, { timeout: 15000 });
    await step("1 goals", async () => {
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 });
      const titles = await page.evaluate(() => [...document.querySelectorAll("[data-goal]")].map((el) => el.getAttribute("data-goal")));
      const other = titles.indexOf("Other abilities"); if (!titles.includes("Attack") || (other !== -1 && other !== titles.length - 1)) throw new Error(titles.join("|"));
      await shot("01-goals"); tiny.push(...await big());
    });
    await step("2 diagrams", async () => {
      const act = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); await tap(page, act);
      await page.waitForFunction(() => document.body.innerText.includes("Tap a card to add it with defaults") && document.querySelectorAll(".reach-grid span.on").length > 0, null, { timeout: 15000 });
      const grids = await page.evaluate(() => [...document.querySelectorAll("[data-add]")].map((el) => el.querySelectorAll(".reach-grid span.on").length));
      if (grids.length < 1 || grids.some((n) => n < 1)) throw new Error(grids.join("|"));
      await shot("02-cards"); tiny.push(...await big());
    });
    await step("3 add", async () => {
      const act = await lineAct(); if (act === "") throw new Error("no line shot"); await tap(page, act);
      await page.waitForFunction(() => document.querySelector('[data-knob="range"]') !== null && document.querySelector('[data-act="s:cell:0,8"] .star')?.textContent === "✦1", null, { timeout: 15000 });
      await page.locator(".reach-grid").scrollIntoViewIfNeeded(); await shot("03-panel");
    });
    await step("4 test aim", async () => {
      await tap(page, "a:shut"); await page.waitForFunction(() => document.querySelector('[data-act^="a:test:setup_"]') !== null, null, { timeout: 15000 });
      const act = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((item) => item.startsWith("a:test:setup_")) ?? "");
      await tap(page, act); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
      const live = await page.evaluate(() => { const play = window.__play, unit = play.world.units.get(play.selected); return { id: unit?.unitId, side: unit?.side, me: play.sides.me, aim: play.aimKind, phase: play.world.phases.battle }; });
      if (live.id !== KNIGHT || live.side !== live.me || live.aim !== "spell" || live.phase !== "targeting") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act^="a:drop:setup_"]') !== null, null, { timeout: 15000 });
    });
    await step("5 again", async () => {
      const drop = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((item) => item.startsWith("a:drop:setup_")) ?? "");
      const before = await page.evaluate(() => window.__read()["catalogue/slice.json"]);
      await tap(page, drop); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:0,8"] .star') === null, null, { timeout: 15000 });
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-goal="Attack"]') !== null, null, { timeout: 15000 });
      const act = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); await tap(page, act);
      await page.waitForFunction(() => [...document.querySelectorAll("[data-add]")].some((el) => (el.getAttribute("data-add") ?? "").includes("Line Shot")), null, { timeout: 15000 });
      const kept = await page.evaluate((text) => { const files = window.__read(); return files["catalogue/slice.json"] === text && Object.entries(files).some(([path, body]) => path.startsWith("setups/") && body.includes("line-shot")); }, before);
      if (!kept) throw new Error("pruned"); await tap(page, "g:back"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 }); await tap(page, "g:close");
    });
    await step("6 offer", async () => {
      await page.evaluate((d) => { const proj = JSON.parse(window.__read()["project.json"]); proj.project.catalogueRev += d; window.__write("project.json", JSON.stringify(proj)); }, -1);
      await tap(page, "g:open"); await waitText(page, "New abilities are available. Update this project to use them?");
      await shot("04-offer"); tiny.push(...await big()); await tap(page, "g:update");
      await page.waitForFunction(() => document.querySelector('[data-sheet="offer"]') === null && document.querySelector('[data-act="g:open"]') !== null, null, { timeout: 15000 });
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-goal="Attack"]') !== null, null, { timeout: 15000 });
    });
    await step("7 newer", async () => {
      await page.evaluate((d) => { const proj = JSON.parse(window.__read()["project.json"]); proj.project.catalogueRev += d; window.__write("project.json", JSON.stringify(proj)); }, 1);
      await waitText(page, "This project was made with a newer TileEngine. Update the app to add abilities.");
      const shown = await page.evaluate(() => document.querySelector('[data-act="g:open"]') !== null); if (shown) throw new Error("add shown");
      await shot("05-newer");
    });
    check(`8 targets @${width}`, tiny.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `tools/maker/build.ts` (edited)

```diff
diff --git a/tools/maker/build.ts b/tools/maker/build.ts
index 92e0953..f57cc55 100644
--- a/tools/maker/build.ts
+++ b/tools/maker/build.ts
@@ -6,7 +6,7 @@ import { ROOT, build as playBuild, refuse, release, sha, toJs } from "../play-st
 const ENTRY = "tools/maker/home.ts";
 const collect = (root: string, dev: boolean): Map<string, string> => {
   const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
-  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
+  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel === "tools/maker/catalogue.json" ? "behaviour-library/behaviours.json" : rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
   const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
   walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
 };
```

Full file as merged:

```ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, build as playBuild, refuse, release, sha, toJs } from "../play-stage/build.ts";
const ENTRY = "tools/maker/home.ts";
const collect = (root: string, dev: boolean): Map<string, string> => {
  const bag = new Map<string, string>(), seen = new Set<string>(), temps: string[] = [];
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel === "tools/maker/catalogue.json" ? "behaviour-library/behaviours.json" : rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
  const walkDir = (dir: string, rel: string): void => { for (const name of readdirSync(dir).sort()) { const path = join(dir, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(path).isDirectory()) walkDir(path, next); else { const key = `templates/${next}`; bag.set(key, readFileSync(path, "utf8")); temps.push(key); } } };
  walk(ENTRY); bag.set("tokens.css", readFileSync(join(root, "tools/maker/tokens.css"), "utf8")); bag.set("app.css", readFileSync(join(root, "tools/maker/app.css"), "utf8")); walkDir(join(root, "data/templates"), ""); bag.set("templates/files.json", `${JSON.stringify({ files: temps }, null, 2)}\n`); return bag;
};
/** `<out>/maker/index.html` is the only unstamped file. The stamp is 12 hex chars of the sorted path+sha list. */
export function build(out: string, commit: string, root: string = ROOT, dev = false): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bag = collect(root, dev), names = [...bag.keys()].sort(), stamp = sha(names.map((name) => `${name} ${sha(bag.get(name) ?? "")}`).join("\n")).slice(0, 12);
  const maker = join(out, "maker"), dir = join(maker, stamp);
  if (existsSync(dir) && names.some((name) => !existsSync(join(dir, name)) || readFileSync(join(dir, name), "utf8") !== (bag.get(name) ?? ""))) throw new Error(`build: maker/${stamp} already exists with different files`);
  mkdirSync(dir, { recursive: true });
  for (const name of names) { const dest = join(dir, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, bag.get(name) ?? ""); }
  const html = readFileSync(join(root, "tools/maker/index.html"), "utf8").replaceAll("__STAMP__", stamp);
  writeFileSync(join(maker, "index.html"), html);
  for (const name of readdirSync(maker)) if (name !== stamp && name !== "index.html") rmSync(join(maker, name), { recursive: true });
  const playRoot = join(out, "play-stage"); playBuild(join(playRoot, stamp), commit, root, dev);
  for (const name of readdirSync(playRoot)) if (name !== stamp) rmSync(join(playRoot, name), { recursive: true });
  const files: Record<string, string> = { "maker/index.html": sha(html) }; for (const name of names) files[`maker/${stamp}/${name}`] = sha(bag.get(name) ?? "");
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files }, null, 2)}\n`;
  writeFileSync(join(out, "build.json"), body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3];
  if (out === undefined) { console.error("usage: node tools/maker/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT })), why = refuse(head, asked, dirty);
  if (why !== null) { console.error(why); process.exit(1); }
  build(out, asked ?? head);
}
```

### `tools/maker/ability-panel.ts` (edited)

```diff
diff --git a/tools/maker/ability-panel.ts b/tools/maker/ability-panel.ts
index fb5a81a..ec1c6c4 100644
--- a/tools/maker/ability-panel.ts
+++ b/tools/maker/ability-panel.ts
@@ -1,5 +1,7 @@
 import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
 import { WIRED } from "../../src/rules/behaviours/wired.ts";
+import { addChrome } from "./add-ability.ts";
+import { diagramHtml, diagramOf } from "./unit-diagram.ts";
 import { knobWidget, type KnobSpec } from "./widgets.ts";
 type Obj = Record<string, unknown>;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
@@ -8,6 +10,7 @@ const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 let openId = "";
 export function abilityShut(): void { openId = ""; }
+export function abilityOpen(id: string): void { openId = id; }
 export type AbilityPlay = { readonly unitId: string; readonly abilityId?: string; readonly aim?: "basic" | "spell"; readonly stageId: string };
 export type AbilityEdit = { readonly keep: true } | { readonly play: AbilityPlay } | { readonly bag: Record<string, Obj>; readonly toast: string };
 const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label, type: knob.type, ...(knob.min === undefined ? {} : { min: knob.min }), ...(knob.max === undefined ? {} : { max: knob.max }), ...(knob.step === undefined ? {} : { step: knob.step }), ...(knob.max_len === undefined ? {} : { max_len: knob.max_len }), ...(knob.options === undefined ? {} : { options: knob.options }), ...(knob.builtin === undefined ? {} : { builtin: knob.builtin }) });
@@ -33,7 +36,8 @@ export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boole
   const open = bag[`setups/${openId}.json`];
   if (openId !== "" && isObj(open) && typeof open["behaviourId"] === "string") {
     const model = panelOf(slice, WIRED, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : {});
-    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${rowsOf(bag, unit, slice, openId)}`;
+    const marks = diagramHtml(diagramOf(bag, id, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : null));
+    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${marks}${rowsOf(bag, unit, slice, openId)}`;
   }
   const cards = ids.flatMap((sid) => {
     const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return [];
@@ -44,7 +48,7 @@ export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boole
     return [`<div class="card" data-role="card"><button type="button" class="grow card-hit" data-act="a:open:${esc(sid)}"><span class="name">${esc(model.name)}</span></button>${test}${drop}</div>`];
   }).join("");
   const whole = placed === null ? `<p>Place this unit on a stage to test it.</p>` : `<button type="button" class="btn" data-act="a:test">▶ Test</button>`;
-  return `<h2>Abilities</h2>${cards}${whole}`;
+  return `<h2>Abilities</h2>${cards}${addChrome(bag, unit, readOnly)}${whole}`;
 }
 function clamp(knob: PanelKnob, value: number): number {
   const min = knob.min ?? value, max = knob.max ?? value, step = knob.step !== undefined && knob.step > 0 ? knob.step : 1;
```

Full file as merged:

```ts
import { aimKind, detach, panelOf, resetAnswer, setAnswer, stageFor, type PanelKnob, type PanelModel } from "../../src/editor/unit/panel.ts";
import { WIRED } from "../../src/rules/behaviours/wired.ts";
import { addChrome } from "./add-ability.ts";
import { diagramHtml, diagramOf } from "./unit-diagram.ts";
import { knobWidget, type KnobSpec } from "./widgets.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
let openId = "";
export function abilityShut(): void { openId = ""; }
export function abilityOpen(id: string): void { openId = id; }
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
    const marks = diagramHtml(diagramOf(bag, id, open["behaviourId"], isObj(open["answers"]) ? open["answers"] : null));
    return `<h2>Abilities</h2><button type="button" class="btn ghost" data-act="a:shut">Back</button><h2>${esc(model.name)}</h2>${panelHtml(model)}${marks}${rowsOf(bag, unit, slice, openId)}`;
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
  return `<h2>Abilities</h2>${cards}${addChrome(bag, unit, readOnly)}${whole}`;
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

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index 2ca96d7..2d45557 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -1,4 +1,5 @@
-import { abilityAct, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
+import { abilityAct, abilityOpen, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
+import { addClick, addShut } from "./add-ability.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { prefix, ulid } from "../../src/editor/project/home.ts";
 import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown, unitNameError } from "../../src/editor/unit/units.ts";
@@ -22,13 +23,14 @@ export function rememberUnit(doc: unknown): void { if (!isObj(doc)) throw new Er
 export function bindUnits(id: string): void { if (sess.project !== id) sess = blank(id); }
 export function unitLine(value: string): void { sess.name = value; }
 export function unitEditing(): boolean { return sess.mode === "edit" || sess.mode === "rename" || sess.mode === "role"; }
-export function openUnit(id: string): void { abilityShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
+export function openUnit(id: string): void { abilityShut(); addShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
 function bagOf(files: DocText): Record<string, Obj> | null {
   const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
   for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
 }
-function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
-  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
+function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice = ""): DocText {
+  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
+  if (slice !== "") next["catalogue/slice.json"] = slice; return next;
 }
 async function commit(io: UnitIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
   const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
@@ -63,9 +65,9 @@ function specOf(knob: Obj): KnobSpec | null {
 }
 function ownNum(unit: Obj, key: string): number | null { const stats = isObj(unit["stats"]) ? unit["stats"] : null, bag = stats === null ? undefined : stats[key]; return isObj(bag) && typeof bag["value"] === "number" ? bag["value"] : null; }
 const kept = (host: Host): UnitHit => ({ files: host.files, rev: host.rev, banner: null, dirty: host.dirty });
-async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<UnitHit> {
+async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string, slice = ""): Promise<UnitHit> {
   const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
-  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
+  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
   if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true }; }
   return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, toast };
 }
@@ -118,11 +120,17 @@ function clamp(knob: Obj, value: number): number {
 }
 export async function unitClick(act: string, host: Host, io: UnitIo): Promise<UnitHit> {
   if (act === "u:close") { sess.mode = sess.mode === "rename" || sess.mode === "role" ? "edit" : null; sess.hint = ""; sess.lines = []; return kept(host); }
-  if (act === "u:back") { sess.mode = null; sess.hint = ""; return kept(host); }
+  if (act === "u:back") { sess.mode = null; sess.hint = ""; addShut(); return kept(host); }
   if (act === "u:undo") return undo(io, host);
   if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
-  if (act.startsWith("a:") || act.startsWith("k:")) {
+  if (act.startsWith("a:") || act.startsWith("k:") || act.startsWith("g:")) {
     const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
+    if (act.startsWith("g:")) {
+      const id = act.startsWith("g:add:") ? `setup_${ulid(Date.parse(io.now), io.bytes())}` : "";
+      const hit = addClick(act, live, sess.unit, id);
+      if ("bag" in hit) { if (hit.open !== undefined) abilityOpen(hit.open); return save(io, host, live, hit.bag, hit.toast, hit.slice); }
+      return kept(host);
+    }
     const hit = abilityAct(act, live, sess.unit);
     if ("play" in hit) return { ...kept(host), play: hit.play };
     if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
@@ -131,7 +139,7 @@ export async function unitClick(act: string, host: Host, io: UnitIo): Promise<Un
   if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
   if (act === "u:role") { sess.mode = "role"; return kept(host); }
   if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
-  if (act.startsWith("u:open:")) { abilityShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
+  if (act.startsWith("u:open:")) { abilityShut(); addShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
   if (act.startsWith("u:menu:")) { const bag = bagOf(host.files), id = act.slice(7), hit = bag === null ? null : unitDoc(bag, id); sess.unit = id; sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit"; sess.mode = "menu"; return kept(host); }
   const bag = bagOf(host.files); if (bag === null) return { ...kept(host), banner: "Can't open this project" };
   if (act === "u:create" || act === "u:save-name") {
```

Full file as merged:

```ts
import { abilityAct, abilityOpen, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
import { addClick, addShut } from "./add-ability.ts";
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
export function openUnit(id: string): void { abilityShut(); addShut(); sess.unit = id; sess.mode = "edit"; sess.hint = ""; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice = ""): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc);
  if (slice !== "") next["catalogue/slice.json"] = slice; return next;
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
async function save(io: UnitIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string, slice = ""): Promise<UnitHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after, slice));
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
  if (act === "u:back") { sess.mode = null; sess.hint = ""; addShut(); return kept(host); }
  if (act === "u:undo") return undo(io, host);
  if (host.readOnly) return { ...kept(host), banner: "Made with a newer TileEngine. Open only." };
  if (act.startsWith("a:") || act.startsWith("k:") || act.startsWith("g:")) {
    const live = bagOf(host.files); if (live === null) return { ...kept(host), banner: "Can't open this project" };
    if (act.startsWith("g:")) {
      const id = act.startsWith("g:add:") ? `setup_${ulid(Date.parse(io.now), io.bytes())}` : "";
      const hit = addClick(act, live, sess.unit, id);
      if ("bag" in hit) { if (hit.open !== undefined) abilityOpen(hit.open); return save(io, host, live, hit.bag, hit.toast, hit.slice); }
      return kept(host);
    }
    const hit = abilityAct(act, live, sess.unit);
    if ("play" in hit) return { ...kept(host), play: hit.play };
    if ("bag" in hit) return save(io, host, live, hit.bag, hit.toast);
    return kept(host);
  }
  if (act === "u:add") { sess.mode = "add"; sess.name = "New unit"; sess.hint = ""; return kept(host); }
  if (act === "u:role") { sess.mode = "role"; return kept(host); }
  if (act === "u:rename") { const bag = bagOf(host.files), hit = bag === null ? null : unitDoc(bag, sess.unit); sess.name = hit !== null && typeof hit.doc["name"] === "string" ? hit.doc["name"] : ""; sess.hint = ""; sess.mode = "rename"; return kept(host); }
  if (act.startsWith("u:open:")) { abilityShut(); addShut(); sess.unit = act.slice(7); sess.mode = "edit"; sess.hint = ""; return kept(host); }
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
index 7bad671..5b23aee 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -5,6 +5,8 @@ import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
 import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
+import { addFind, rememberAbility } from "./add-ability.ts";
+import { DEV } from "./dev.ts"; // dev-only
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type PlayReady } from "./test-launch.ts";
@@ -88,7 +90,7 @@ async function fromUrl(): Promise<void> {
 }
 async function run(act: string): Promise<void> {
   const unitUndo = act === "undo" && state.undo === "unit";
-  if ((act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
@@ -128,7 +130,7 @@ async function boot(): Promise<void> {
   try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
   try {
     const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
-    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
+    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
     templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
@@ -136,6 +138,7 @@ document.addEventListener("click", (ev) => { const node = ev.target instanceof E
 let held: { act: string; t: number } | null = null;
 document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
+if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
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
import { addFind, rememberAbility } from "./add-ability.ts";
import { DEV } from "./dev.ts"; // dev-only
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
  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
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
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.ability.json")) { const parsed = parseProject({ "setups/setup.ability.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberAbility(parsed.files["setups/setup.ability.json"]); continue; } if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } if (path.endsWith("/unit.json") && !path.includes(".tileproj/")) { const parsed = parseProject({ "units/unit.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberUnit(parsed.files["units/unit.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) go(node.getAttribute("data-act") ?? ""); });
let held: { act: string; t: number } | null = null;
document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
void boot();
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index 7aa3d37..df3460b 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -23,7 +23,7 @@
 .scrim { position: fixed; inset: 0; z-index: 5; background: var(--scrim); display: flex; align-items: flex-end; justify-content: center; }
 .sheet { width: min(390px, 100%); max-height: 85vh; overflow: auto; background: var(--surface); color: var(--ink); border-radius: 16px 16px 12px 12px; box-shadow: var(--sheet-shadow); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
 .sheet h2, .project h2 { margin: 0; font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; }
-input.name-field { min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
+input.name-field { width: 100%; box-sizing: border-box; min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
 .test-wrap { margin-top: auto; padding-top: 24px; }
 .test-wrap .btn { width: 100%; min-height: 56px; }
 .dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
@@ -43,9 +43,14 @@ input.name-field { min-height: 48px; border: 2px solid var(--line); border-radiu
 .grid.off .cell { border-color: transparent; } .cell.on { outline: 3px solid var(--accent); outline-offset: -3px; } .t-floor { background: var(--surface); } .t-water { background: var(--accent-soft); } .t-wall { background: var(--line); } .t-other { background: var(--surface-2); }
 .cell .who, .cell .pill { font-size: 10px; font-weight: 800; } .pill { border: 1px solid var(--line); border-radius: 999px; background: var(--surface); color: var(--ink); padding: 1px 3px; }
 .cell .star { position: absolute; top: 0; left: 1px; font-size: 10px; font-weight: 800; line-height: 1.2; color: var(--ink); background: var(--surface); }
-.ability, .ability summary { min-height: 48px; max-width: 100%; display: block; }
+.ability { max-width: 100%; }
+.ability summary { min-height: 48px; max-width: 100%; display: block; }
 details.ability:not([open]) > :not(summary) { display: none; }
 .toast.above { top: 16px; bottom: auto; z-index: 6; }
 .dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
 .chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
 input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
+.reach-grid { display: grid; grid-template-columns: repeat(7, 36px); grid-template-rows: repeat(7, 16px); gap: 2px; width: 264px; height: 124px; flex: none; align-self: flex-start; }
+.reach-grid span { width: 36px; height: 16px; min-height: 16px; overflow: hidden; border-radius: 3px; background: var(--surface-2); color: var(--ink); font-size: 8px; line-height: 16px; text-align: center; }
+.reach-grid span.on { background: var(--accent-soft); color: var(--ink); }
+button.card.ability-add { flex-direction: column; align-items: flex-start; }
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
input.name-field { width: 100%; box-sizing: border-box; min-height: 48px; border: 2px solid var(--line); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--ink); }
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
.ability { max-width: 100%; }
.ability summary { min-height: 48px; max-width: 100%; display: block; }
details.ability:not([open]) > :not(summary) { display: none; }
.toast.above { top: 16px; bottom: auto; z-index: 6; }
.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
.chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
.reach-grid { display: grid; grid-template-columns: repeat(7, 36px); grid-template-rows: repeat(7, 16px); gap: 2px; width: 264px; height: 124px; flex: none; align-self: flex-start; }
.reach-grid span { width: 36px; height: 16px; min-height: 16px; overflow: hidden; border-radius: 3px; background: var(--surface-2); color: var(--ink); font-size: 8px; line-height: 16px; text-align: center; }
.reach-grid span.on { background: var(--accent-soft); color: var(--ink); }
button.card.ability-add { flex-direction: column; align-items: flex-start; }
```

### `src/editor/project/save.ts` (edited)

```diff
diff --git a/src/editor/project/save.ts b/src/editor/project/save.ts
index 5dee8f8..0b5a122 100644
--- a/src/editor/project/save.ts
+++ b/src/editor/project/save.ts
@@ -16,7 +16,7 @@ export function planSave(stored: DocText, next: DocText, expectedRev: number, no
   if (changed.length === 0) return { ok: true, writes: [] };
   const render = (path: string, manifestDoc: boolean): string => {
     const text = (manifestDoc ? next[path] ?? stored[path] : next[path]) ?? "";
-    if (!manifestDoc && !DOC.test(path) && path !== "catalogue/slice.json") return text;
+    if (path === "catalogue/slice.json" || (!manifestDoc && !DOC.test(path))) return text;
     let doc: unknown; try { doc = JSON.parse(text) as unknown; } catch { throw new Error(path); }
     if (!isObj(doc)) throw new Error(path);
     if (manifestDoc && isObj(doc["project"])) { doc["project"]["rev"] = rev + 1; doc["project"]["updatedAt"] = now; } else { if (typeof doc["rev"] === "number") doc["rev"] += 1; doc["updatedAt"] = now; }
```

Full file as merged:

```ts
import { versionRows } from "../../project/load/migrate.ts";
import type { ProjectFiles, ReportRow } from "../../project/load/types.ts";
export type DocText = Readonly<Record<string, string>>;
export type SavePlan = { readonly ok: true; readonly writes: readonly { readonly path: string; readonly text: string }[] } | { readonly ok: false; readonly error: "staleRev" | "readOnly" | "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly ReportRow[] };
const MSG = { staleRev: "This project changed somewhere else. Reopen it to see the latest.", readOnly: "Made with a newer TileEngine. Open only." } as const;
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const DOC = /^(?:maps|stages|units|setups)\/[^/]+\.json$/;
const fail = (error: "staleRev" | "readOnly" | "writeFailed", path: string, message: string): SavePlan => ({ ok: false, error, path, message, rows: [{ code: error, severity: "hard", path, detail: message }] });
export function planSave(stored: DocText, next: DocText, expectedRev: number, now: string): SavePlan {
  const parsed: Record<string, unknown> = {};
  for (const [path, text] of Object.entries(stored)) { if (!path.endsWith(".json")) continue; try { parsed[path] = JSON.parse(text) as unknown; } catch { return fail("writeFailed", path, `Can't open: ${path} invalid JSON`); } }
  const root = parsed["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : null, rev = project !== null && typeof project["rev"] === "number" ? project["rev"] : null;
  if (rev !== expectedRev) return fail("staleRev", "project.json", MSG.staleRev);
  if (versionRows(parsed as ProjectFiles).some((row) => row.code === "formatNewer")) return fail("readOnly", "project.json", MSG.readOnly);
  const changed = [...new Set([...Object.keys(stored), ...Object.keys(next)])].filter((path) => (stored[path] ?? null) !== (next[path] ?? null));
  if (changed.length === 0) return { ok: true, writes: [] };
  const render = (path: string, manifestDoc: boolean): string => {
    const text = (manifestDoc ? next[path] ?? stored[path] : next[path]) ?? "";
    if (path === "catalogue/slice.json" || (!manifestDoc && !DOC.test(path))) return text;
    let doc: unknown; try { doc = JSON.parse(text) as unknown; } catch { throw new Error(path); }
    if (!isObj(doc)) throw new Error(path);
    if (manifestDoc && isObj(doc["project"])) { doc["project"]["rev"] = rev + 1; doc["project"]["updatedAt"] = now; } else { if (typeof doc["rev"] === "number") doc["rev"] += 1; doc["updatedAt"] = now; }
    return JSON.stringify(doc);
  };
  try {
    const writes = changed.filter((path) => path !== "project.json" && path !== "catalogue/slice.json").sort().map((path) => ({ path, text: render(path, false) }));
    if (changed.includes("catalogue/slice.json")) writes.push({ path: "catalogue/slice.json", text: render("catalogue/slice.json", false) });
    writes.push({ path: "project.json", text: render("project.json", true) });
    return { ok: true, writes };
  } catch (e) { const path = e instanceof Error ? e.message : "project.json"; return fail("writeFailed", path, `Couldn't save ${path}. Your phone may be full. Your last save is safe.`); }
}
export function asWrites(files: DocText): { readonly path: string; readonly text: string }[] {
  const writes = Object.entries(files).filter(([path]) => path !== "project.json").sort(([a], [b]) => (a < b ? -1 : 1)).map(([path, text]) => ({ path, text })), project = files["project.json"];
  if (project !== undefined) writes.push({ path: "project.json", text: project });
  return writes;
}
```

### `tools/project/slice-of.ts` (edited)

```diff
diff --git a/tools/project/slice-of.ts b/tools/project/slice-of.ts
index 016afa9..36420c0 100644
--- a/tools/project/slice-of.ts
+++ b/tools/project/slice-of.ts
@@ -1,19 +1 @@
-const DROP = new Set(["sources", "variants", "used_by", "conflicts", "needs_reverify", "default_source", "item_cites", "item_sources"]);
-
-function copy(v: unknown): unknown {
-  if (Array.isArray(v)) return v.map(copy);
-  if (typeof v !== "object" || v === null) return v;
-  const out: Record<string, unknown> = {};
-  for (const key of Object.keys(v)) { if (!DROP.has(key)) out[key] = copy((v as Record<string, unknown>)[key]); }
-  return out;
-}
-
-export type CatalogueDoc = { readonly schema_version: number; readonly catalogue_rev: number; readonly gates: unknown; readonly behaviours: readonly Record<string, unknown>[] };
-
-/** Pure slice: catalogue order, ids only, dropped info keys removed. `JSON.stringify(., null, 2) + "\\n"`. */
-export function sliceOf(catalogue: CatalogueDoc, ids: readonly string[]): string {
-  const want = new Set(ids);
-  const behaviours = catalogue.behaviours.filter((b) => want.has(String(b["id"]))).map(copy);
-  const slice = { kind: "catalogue-slice", formatVersion: 1, schema_version: catalogue.schema_version, catalogue_rev: catalogue.catalogue_rev, gates: catalogue.gates, behaviours };
-  return `${JSON.stringify(slice, null, 2)}\n`;
-}
+export { sliceDoc, sliceOf, type CatalogueDoc } from "../../src/project/slice-of.ts";
```

Full file as merged:

```ts
export { sliceDoc, sliceOf, type CatalogueDoc } from "../../src/project/slice-of.ts";
```

### `tests/tools/maker-build.test.ts` (edited)

```diff
diff --git a/tests/tools/maker-build.test.ts b/tests/tools/maker-build.test.ts
index c5c961e..8f9ff96 100644
--- a/tests/tools/maker-build.test.ts
+++ b/tests/tools/maker-build.test.ts
@@ -22,7 +22,9 @@ test("maker build stamps, refuses a collision, drops stale folders, and audits t
   const temps = walk(join(maker, stamp, "templates")).map((path) => relative(join(maker, stamp), path).replaceAll("\\", "/")).filter((path) => path !== "templates/files.json").sort();
   assert.deepEqual([...listed.files].sort(), temps);
   for (const file of walk(join(maker, stamp))) { const rel = relative(join(maker, stamp), file).replaceAll("\\", "/"), text = readFileSync(file, "utf8"); assert.equal(rel.endsWith(".ts") || rel.endsWith(".map") || rel.includes("ui-shell") || rel.endsWith("dev.js"), false); if (/\.(js|css|html)$/.test(rel)) assert.equal(/\/\/ dev-only|\bDEV\b|sourceMappingURL|window\.__/.test(text), false); if (rel.endsWith(".js")) for (const spec of text.matchAll(/(?:from|import)\s+"(\.[^"]+)"/g)) assert.equal(statSync(join(dirname(file), spec[1] ?? "")).isFile(), true); }
-  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data", "fixtures"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
+  assert.equal(statSync(join(maker, stamp, "tools/maker/catalogue.json.js")).isFile(), true);
+  assert.equal(walk(join(out, "play-stage")).some((path) => path.endsWith("catalogue.json.js") || path.includes("behaviours.json")), false);
+  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data", "fixtures", "behaviour-library"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
   const proj = join(src, "data/templates/empty.tileproj/project.json"); writeFileSync(proj, readFileSync(proj, "utf8") + "\n");
   const out3 = mkdtempSync(join(tmpdir(), "maker-")); build(out3, SHA, src); const next = readdirSync(join(out3, "maker")).find((name) => name !== "index.html");
   assert.notEqual(next, stamp); writeFileSync(join(maker, stamp, "tokens.css"), "changed"); assert.throws(() => build(out, SHA), /different files/);
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/maker/build.ts";
import { openSaved } from "../../tools/maker/test-launch.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { ROOT } from "../../tools/play-stage/build.ts";
const SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const walk = (dir: string): string[] => readdirSync(dir).flatMap((name) => { const path = join(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; });
test("maker build stamps, refuses a collision, drops stale folders, and audits the output", async () => {
  const out = mkdtempSync(join(tmpdir(), "maker-")), out2 = mkdtempSync(join(tmpdir(), "maker-"));
  build(out, SHA); build(out2, SHA);
  const maker = join(out, "maker"), stamp = readdirSync(maker).find((name) => name !== "index.html") ?? "";
  assert.equal(readdirSync(maker).filter((name) => name !== "index.html").length, 1); assert.match(stamp, /^[0-9a-f]{12}$/);
  assert.equal(readdirSync(join(out2, "maker")).find((name) => name !== "index.html"), stamp); assert.equal(statSync(join(out, "build.json")).isFile(), true);
  const html = readFileSync(join(maker, "index.html"), "utf8");
  for (const meta of ["no-cache, no-store, must-revalidate", 'Pragma" content="no-cache"', 'Expires" content="0"']) assert.ok(html.includes(meta));
  for (const ref of html.matchAll(/(?:src|href)="(\.\/[^"]+)"/g)) assert.equal(statSync(join(maker, ref[1] ?? "")).isFile(), true);
  const listed = JSON.parse(readFileSync(join(maker, stamp, "templates/files.json"), "utf8")) as { files: string[] };
  const temps = walk(join(maker, stamp, "templates")).map((path) => relative(join(maker, stamp), path).replaceAll("\\", "/")).filter((path) => path !== "templates/files.json").sort();
  assert.deepEqual([...listed.files].sort(), temps);
  for (const file of walk(join(maker, stamp))) { const rel = relative(join(maker, stamp), file).replaceAll("\\", "/"), text = readFileSync(file, "utf8"); assert.equal(rel.endsWith(".ts") || rel.endsWith(".map") || rel.includes("ui-shell") || rel.endsWith("dev.js"), false); if (/\.(js|css|html)$/.test(rel)) assert.equal(/\/\/ dev-only|\bDEV\b|sourceMappingURL|window\.__/.test(text), false); if (rel.endsWith(".js")) for (const spec of text.matchAll(/(?:from|import)\s+"(\.[^"]+)"/g)) assert.equal(statSync(join(dirname(file), spec[1] ?? "")).isFile(), true); }
  assert.equal(statSync(join(maker, stamp, "tools/maker/catalogue.json.js")).isFile(), true);
  assert.equal(walk(join(out, "play-stage")).some((path) => path.endsWith("catalogue.json.js") || path.includes("behaviours.json")), false);
  const src = mkdtempSync(join(tmpdir(), "maker-src-")); for (const dir of ["src", "tools", "data", "fixtures", "behaviour-library"]) cpSync(join(ROOT, dir), join(src, dir), { recursive: true });
  const proj = join(src, "data/templates/empty.tileproj/project.json"); writeFileSync(proj, readFileSync(proj, "utf8") + "\n");
  const out3 = mkdtempSync(join(tmpdir(), "maker-")); build(out3, SHA, src); const next = readdirSync(join(out3, "maker")).find((name) => name !== "index.html");
  assert.notEqual(next, stamp); writeFileSync(join(maker, stamp, "tokens.css"), "changed"); assert.throws(() => build(out, SHA), /different files/);
  build(out, SHA, src); assert.deepEqual(readdirSync(maker).filter((name) => name !== "index.html"), [next]);
  assert.match(readFileSync(join(ROOT, "tools/maker/home.ts"), "utf8"), /This browser can't save projects here\. Open the app from its web address\./);
  assert.equal(statSync(join(out, "play-stage", next ?? "", "index.html")).isFile(), true);
  let started = false; const missing = await openSaved({ store: memoryStore(), id: "missing", from: "project", start() { started = true; } });
  assert.equal(started, false); assert.equal(missing.ok, false); if (!missing.ok) assert.match(missing.lines.join("\n"), /no project missing/);
  for (const dir of [out, out2, out3, src]) rmSync(dir, { recursive: true });
});
```

### `tests/editor/maker-law.test.ts` (edited)

```diff
diff --git a/tests/editor/maker-law.test.ts b/tests/editor/maker-law.test.ts
index 79db562..0a5ec3c 100644
--- a/tests/editor/maker-law.test.ts
+++ b/tests/editor/maker-law.test.ts
@@ -30,6 +30,9 @@ test("maker law holds, tokens match, and each plant fails", () => {
   assert.match(css, /button, input \{ font: inherit; \}/);
   const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
   assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
+  const addPlant = (text: string): string[] => text.split("\n").flatMap((line, i) => { const goal = /["'](?:move|attack|defend|support|spells|status|ai)["']/.test(line), ident = /["'][a-z0-9]+(?:-[a-z0-9]+)+["']/.test(line); return [/["']group["']/.test(line) ? `${i + 1} group` : "", goal && ident ? `${i + 1} goal-id` : ""].filter((hit) => hit !== ""); });
+  for (const rel of ["src/editor/unit/add.ts", "tools/maker/add-ability.ts"]) assert.deepEqual(addPlant(readFileSync(join(root, rel), "utf8")), [], rel);
+  assert.deepEqual(addPlant('const x = { "line-shot": "attack" };\nconst y = "group";\n'), ["1 goal-id", "2 group"]);
   const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
   for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
   rmSync(dir, { recursive: true });
```

Full file as merged:

```ts
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../..", import.meta.url));
const files = (dir: string): string[] => statSync(dir).isDirectory() ? readdirSync(dir).flatMap((name) => files(join(dir, name))) : [dir];
export function lawHits(dir: string): string[] {
  const hits: string[] = [], colour = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|@import\b|@font-face\b|font-family\s*:/, empty = /catch(?:\s*\([^)]*\))?\s*\{(?:\s*\/\*[\s\S]*?\*\/|\s*\/\/[^\n]*)?\s*\}/;
  for (const path of files(dir)) {
    if (!/\.(ts|css|html)$/.test(path)) continue;
    const skip = path.endsWith("tokens.css"), ts = path.endsWith(".ts");
    readFileSync(path, "utf8").split("\n").forEach((line, i) => {
      const at = `${path}:${i + 1}`;
      if (!skip && colour.test(line)) hits.push(`${at} colour`); if (ts && (/"kind"\s*:\s*"tile-project"/.test(line) || /"kind"\s*:\s*"map"/.test(line))) hits.push(`${at} kind`);
      if (ts && (path.includes(`${sep}stage${sep}`) || path.includes(`${sep}unit${sep}`)) && (/\bformatVersion\b/.test(line) || /["']?\bkind["']?\s*:/.test(line))) hits.push(`${at} doc`);
      if (ts && /(?:from|import)\s+["'][^"']*data\/templates/.test(line)) hits.push(`${at} template`); if (ts && (empty.test(line) || /\?\?\s*\{\s*\}/.test(line) || /\|\|\s*\{\s*\}/.test(line))) hits.push(`${at} silent`);
      if (line.includes("ui-shell/") || /\b(?:ensureProjectV3|emptyManifest|StageLive|window\.__set)\b/.test(line)) hits.push(`${at} shell`);
    });
  }
  return hits;
}
const LIGHT = ["--bg: #f4f5f7", "--surface: #ffffff", "--surface-2: #f8f9fb", "--ink: #12141a", "--muted: #5c6578", "--line: #d8dde8", "--accent: #2f5bff", "--accent-ink: #ffffff", "--accent-soft: #e8edff", "--danger: #b42318", "--danger-soft: #fef3f2", "--warn: #93370d", "--warn-soft: #fffaeb", "--warn-line: #fedf89", "--ok: #1d6b3a", "--ok-soft: #ecfdf3", "--soon: #98a2b3", "--focus: #1a3fd4", "--seg-line: #7a8394", "--shadow: 0 8px 24px rgba(18,20,26,.08)", "--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)", "--hero-ink: #fff", "--scrim: rgba(15,23,42,.45)", "--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)", "--danger-line: #fecdca", "--soon-ink: #fff", "--frame-bg: #0e1118", "--frame-shadow: 0 20px 60px rgba(0,0,0,.45)"];
const DARK = ["--bg: #0f1218", "--surface: #1a1f2a", "--surface-2: #151a23", "--ink: #e8ecf5", "--muted: #9aa3b5", "--line: #2c3444", "--accent: #6b8cff", "--accent-ink: #0b1020", "--accent-soft: #1e2a4a", "--danger: #ff8a7a", "--danger-soft: #3a1c1a", "--warn: #f5c26b", "--warn-soft: #3a2e14", "--warn-line: #6b5420", "--ok: #7bd99a", "--ok-soft: #14301f", "--soon: #6b7385", "--focus: #8aa4ff", "--seg-line: #8a92a3", "--shadow: 0 8px 24px rgba(0,0,0,.45)"];
test("maker law holds, tokens match, and each plant fails", () => {
  assert.deepEqual(lawHits(join(root, "src/editor/project")), []); assert.deepEqual(lawHits(join(root, "tools/maker")), []); assert.deepEqual(lawHits(join(root, "src/editor/stage")), []); assert.deepEqual(lawHits(join(root, "src/editor/unit")), []);
  const css = readFileSync(join(root, "tools/maker/tokens.css"), "utf8"), darkAt = css.indexOf('html[data-theme="dark"]'), mediaAt = css.indexOf("@media (prefers-color-scheme: dark)"), bodyAt = css.indexOf("\nbody");
  for (const token of LIGHT) assert.ok(css.slice(0, darkAt).includes(token), token);
  for (const token of DARK) assert.ok(css.slice(darkAt, mediaAt).includes(token) && css.slice(mediaAt, bodyAt).includes(token), token);
  assert.match(css, /button, input \{ font: inherit; \}/);
  const fallback = ["tools/maker/test-launch.ts", "tools/play-stage/page.ts"].map((rel) => readFileSync(join(root, rel), "utf8")).join("\n"), plant = /\?\? DEMO|\?\? openBundled\(|\|\| openBundled\(/;
  assert.equal(plant.test(fallback), false); assert.equal(plant.test("return docs ?? openBundled(files)"), true);
  const addPlant = (text: string): string[] => text.split("\n").flatMap((line, i) => { const goal = /["'](?:move|attack|defend|support|spells|status|ai)["']/.test(line), ident = /["'][a-z0-9]+(?:-[a-z0-9]+)+["']/.test(line); return [/["']group["']/.test(line) ? `${i + 1} group` : "", goal && ident ? `${i + 1} goal-id` : ""].filter((hit) => hit !== ""); });
  for (const rel of ["src/editor/unit/add.ts", "tools/maker/add-ability.ts"]) assert.deepEqual(addPlant(readFileSync(join(root, rel), "utf8")), [], rel);
  assert.deepEqual(addPlant('const x = { "line-shot": "attack" };\nconst y = "group";\n'), ["1 goal-id", "2 group"]);
  const dir = mkdtempSync(join(root, "src/editor/stage/law-"));
  for (const [name, text] of [["colour.ts", "export const x = '#fff';\n"], ["kind.ts", "export const a = { \"kind\": \"tile-project\" }; export const b = { \"kind\": \"map\" };\n"], ["doc.ts", "export const v = \"formatVersion\";\n"], ["unquoted.ts", "export const d = { kind: \"behaviour-setup\" };\n"], ["silent.ts", "export function x(): void { try { throw new Error('x'); } catch { /* no */ } }\n"]] as const) { writeFileSync(join(dir, name), text); assert.ok(lawHits(dir).some((hit) => hit.includes(name)), name); rmSync(join(dir, name)); }
  rmSync(dir, { recursive: true });
});
```
