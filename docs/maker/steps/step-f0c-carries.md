# step-f0c-carries: CN-029 and the pools gate (maker overhaul plan F0c; EA-3; CEO 27 Nov 03:53 "11c1 finishes and merges, then F0c")

Step id: step-f0c-carries          Revision: r2 (kit r1 → r2: QA kit review `docs/qa/step-f0c-kit-review.md`, sha256 `c0839f65…`, must-fixes 1–4 and design notes; UX confirmed the gate line)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only — see Delivery)
Base commit: main **`49db9f47f83e54443c188f9a9354381df2f866f6`** (QA's F0c kit r1 review), docs-only on **`b2cb571f`** (11c1 rebuild record and README row 33), docs-only on **`b736cd97`** (QA 11c1 r2 review), which is docs-only on the **11c1 merge `f784e678`** (PR #112, ChatA r2). Checked from a fresh `/tmp` clone: `b736cd97..49db9f47` touches only `docs/rebuild/README.md`, `docs/rebuild/step-11c1.md` and `docs/qa/step-f0c-kit-review.md`; green on `b736cd97` **1175 pass, 0 fail**, all checks OK. If main has moved by the go, CoS re-checks that it is docs-only on `49db9f47` and that the trial patch applies.
Branch: step/step-f0c-carries-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through a one-shot credential helper (CN-028 § Token; keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-f0c-carries-r1-chatA` (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-f0c-carries/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- 11c1 (merged, `f784e678`): `src/project/load/budgets.ts`, `src/editor/project/test-gate.ts` (`testGate`'s `names`, `stageNames`).
- CN-029, staged byte-exact by DSK in `data/staging/cn-budgets/`: `cn-budgets.diff` sha256 `227a9333…` (`227a933377d7a8fa449b98428fa63cce8fee3f7a5e8d101ea975985a433efdb4`) against core-types `439f403d…` (main's core-types on the base, checked), giving `core-types.staged.ts` `897d51db…` (`897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f`). It applies cleanly on the base (checked: `git apply --check`, result byte-equal to `core-types.staged.ts`).
- Format: tile-project 6, stage 2 (no bump).
Read first: BUILD_GUIDE.md §2.2 law 17, §6, §7; `docs/maker/steps/step-11c1-budgets.md` Rule 1, Carries and EA ruling 2; `docs/qa/step-11c1-r2-review.md` (sha256 `46218ad2…`) § Carries; `docs/qa/step-f0c-kit-review.md` (sha256 `c0839f65…`, the r1 kit review); `docs/maker/ux/maker-overhaul-plan.md` (sha256 `350e5afe…`) L68, L99, EA-3 L243–L249.
Kit: r2, 2026-11-27. Trial commit `085e295556b5790fe6579e4b1b95bef44ffac45c` on `49db9f47` (tree `2475f873…`), green **1180 pass, 0 fail**, plants 13/13 caught; trial patch `f0c-trial.patch` (sha256 `40269c17…`) passes `git apply --check` on a fresh clone of `49db9f47`. Export audit (11c1 Done when spec): **136 / 150 / 150** files, 0 hits, the same on base and trial. Smokes on the trial: all 25 PASS, solo, unedited (s11b on port 8840; s0 14, s3 18, s4a–s5c 16 each, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b–s10d 8 each, s11a 6, s11a2 6, s11b 6, s11c1 6 ok), no re-runs. Not run: the no-screen shots (the builder takes them).
Carries: CN-029 lands here (DSK's staged diff, byte for byte); the core-types pin in `tests/smoke.test.ts` moves `439f403d…` → `897d51db…`. No other pin moves.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Two carries close before the overhaul's screen work starts.
- **CN-029.** DSK's staged budget types land in `src/types/core-types.ts`: `BudgetKey`, `BudgetLimit`, `ProjectBudgets`, and `CoreProject.settings.budgets?`. 11c1's three local copies in `src/project/load/budgets.ts` go, and its call sites import the types from core-types (EA ruling 2 of 11c1).
- **The pools gate.** Today play reads every stage with `{ picks: 0, waveUnits: 0 }` (`tools/play-stage/project.ts` L66 and L113). So a stage with a weighted or waves enemy pool passes `readProject`, the Test gate and Build game, then fails in play with "play: stage". After this step, Test and Build game refuse such a stage with one plain line that names it, and the gate and play read stages with the same caps. Playing weighted pools and waves is engine work and waits behind F6 (plan L100).

## Where step-f0c-carries sits (placement card)
1. Lives at: No screen.
2. Changes or replaces: None.
3. Seen at once: None.
4. Data path: written by `data/staging/cn-budgets/cn-budgets.diff` → `src/types/core-types.ts` L223–L228 (types) and L242 (`settings.budgets?`) · read by `src/project/load/budgets.ts` L2 (import) and `tools/maker/budgets.ts` L2; the pool caps are `PLAY_LIMITS` in `src/project/load/read-project.ts` L11, read by Test/play at `tools/play-stage/project.ts` L66 and L113, by the sim through `tools/play-stage/load.ts` L28 (`docsToInput`'s `stageLimits`, read by `src/sim/world.ts` L34–L36 and L57) and by the gate at `src/editor/project/test-gate.ts` `poolLines` (called from `tools/maker/test-launch.ts` L31 and `tools/maker/export.ts` L28) · demo or showcase data that uses it: none (the demo template's pool is `fixed`; budgets data unchanged from 11c1).
5. Usable on landing: None.
6. No-screen proof: 390×844 shots of the demo template's map and Test on the base commit and on this step must be pixel-equal; the handback includes both pairs and the comparison result. Tests prove the data path in line 4.

The one visible change is a new sentence in Test's existing gate sheet ("Can't play yet"), and only for a project that holds a weighted or waves pool. The maker can't make one (`tools/maker/stage.ts` L55 places fixed pools only), so it shows only for a hand-edited or imported project.

## Rulings
1. **CN-029, byte for byte** (DSK, staged 2026-11-26; 11c1 EA ruling 2: "lands after 11c1 merges, on the next step's branch"): `git apply data/staging/cn-budgets/cn-budgets.diff`; the result is sha256 `897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f`, byte-equal to `data/staging/cn-budgets/core-types.staged.ts`. Move the pin in `tests/smoke.test.ts` L14 to it. Pinned by: "f0c CN-029: core-types is DSK's staged copy byte for byte, settings.budgets is a ProjectBudgets, and the reader's budget rows still use it" and "smoke: core-types.ts is the pinned DSK copy".
2. **The type swap is a pure import** (11c1 EA ruling 2): `budgets.ts` loses its comment line and three type lines and gains `import type { BudgetKey, BudgetLimit, ProjectBudgets } from "../../types/core-types.ts";`. `BudgetUse` stays in `budgets.ts`. `src/project/load/index.ts` stops re-exporting `BudgetKey`; `tools/maker/budgets.ts` imports it from core-types. No other code changes in either file. Pinned by: test 1 and `npm run typecheck`.
3. **One cap pair for play and the gate** (EA-3, plan L246–L249: "the gate half only"): `export const PLAY_LIMITS = { picks: 0, waveUnits: 0 } as const;` in `read-project.ts`, with a doc comment that play places fixed enemy lists only. `LIMITS` becomes `export const` (value unchanged: picks 8, waveUnits 16). Both are exported from `src/project/load/index.ts`. `tools/play-stage/project.ts` L66 and L113 read stages with `PLAY_LIMITS`, and `tools/play-stage/load.ts` L28 passes `stageLimits: PLAY_LIMITS` to the sim (QA must-fix 1: the engine's own cap). `world.ts` L57 reads `stageLimits.notices`, which stays absent as on the base, because `StageLimits` makes the doc limits optional. No literal caps remain in `tools/play-stage`. Pinned by: "f0c gate: the pools proof: for every pool shape the gate's pool lines are empty exactly when play opens the stage" and "f0c play: the engine reads stages with PLAY_LIMITS too: docsToInput hands them to the sim, which refuses a weighted or waves stage, and arriving into one fails the same way openProject does".
4. **What the gate refuses** (EA-3): a stage that `readStage(stage, LIMITS)` passes and `readStage(stage, PLAY_LIMITS)` fails. That is a weighted pool with `picks` ≥ 1 or a waves pool with any wave of ≥ 1 unit. A weighted pool with `picks: 0` and a waves pool with no units still pass, because play opens them. A stage the reader already rejects gets its hard row and no pool line. **Scope:** the gate refuses the whole project when any stage has such a pool, while `openProject` refuses only the stage it opens. That is correct, because a stage link can reach any stage and `arriveIn` then fails mid-game; but "exactly what play refuses" holds per stage only (QA kit review, design notes). Pinned by: test 3 (7 pool shapes), test 4 and test 5 (`arriveIn`).
5. **The line** (EA wording, plain words per plan L68; **confirmed by UX** as drafted, 2026-11-27, via CoS): `{Stage}: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.` `{Stage}` is the stage's `name`, or its id when it has none (`stageNames`, 11c1). One line per refused stage, in `Object.entries` order, after the hard rows' lines. Pinned by: "f0c gate: a weighted or waves pool that play refuses blocks Test and Build game with one line naming the stage; the reader still passes it" and test 4.
6. **Not a report row** (EA): the pool check isn't a `ReportRow` and invents no format code; `readProject().ok`, `readOnly` and the report are unchanged. It enters `testGate` as a new fourth parameter `more: readonly string[] = []`, appended to the hard lines. So no DSK ruling is needed. Pinned by: test 2 (`load.ok` stays true).
7. **Rule 8, worded per QA's 11c1 r2 note** (QA r2 review L29): one statement per line in all new code; **any body that holds a statement takes its own lines** (no `{ return x; }` or `{ x(); }` on the line that opens the block, arrows included, and no unbraced `if (…) throw …;` or `if (…) return …;`; a callback that only records a call is a `mock.fn()`). Never pack a new statement onto an existing line. The only edits inside existing dense lines are the ones Files names.

## Files to create or change
- change `src/types/core-types.ts` (≤ 7; DSK's diff only, `git apply`, never typed by hand)
- change `tests/smoke.test.ts` (≤ 1+ 1−; the pin, Ruling 1)
- change `src/project/load/budgets.ts` (≤ 1+ 4−; Ruling 2)
- change `src/project/load/index.ts` (≤ 2+ 2−; drop `type BudgetKey` from L4, add `LIMITS, PLAY_LIMITS` to L3)
- change `src/project/load/read-project.ts` (≤ 3+ 1−; Ruling 3)
- change `tools/maker/budgets.ts` (≤ 2+ 1−; L1 loses `type BudgetKey`, a new L2 imports it from core-types)
- change `src/editor/project/test-gate.ts` (≤ 26+ 2−; two imports, `poolLine`, `poolLines`, `testGate`'s `more`; Rulings 4–6)
- change `tools/maker/test-launch.ts` and `tools/maker/export.ts` (≤ 2+ 2− each; the import and `poolLines(load)` as `testGate`'s fourth argument)
- change `tools/play-stage/project.ts` (≤ 3+ 3−; the import on L2 and `PLAY_LIMITS` at L66 and L113)
- change `tools/play-stage/load.ts` (≤ 2+ 1−; one import line after L5, and `stageLimits: PLAY_LIMITS` in L27, which becomes L28; Ruling 3)
- create `tests/project/f0c-carries.test.ts` (the shipped file, verbatim)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

Size: 150–400 changed lines. The trial changes **187** lines (+168/−19) in 12 files (count: `git add -N . && git diff --numstat <base> -- . ':!handback/**' ':!package-lock.json'`, QA's G7):

| File | Trial / cap |
|---|---|
| `src/types/core-types.ts` | 7+ / 7 (DSK's diff, exact) |
| `tests/smoke.test.ts` | 1+ 1− / 2 |
| `src/project/load/budgets.ts` | 1+ 4− / 5 |
| `src/project/load/index.ts` | 2+ 2− / 4 |
| `src/project/load/read-project.ts` | 3+ 1− / 4 |
| `tools/maker/budgets.ts` | 2+ 1− / 3 |
| `src/editor/project/test-gate.ts` | 22+ 2− / 28 |
| `tools/maker/test-launch.ts` | 2+ 2− / 4 |
| `tools/maker/export.ts` | 2+ 2− / 4 |
| `tools/play-stage/project.ts` | 3+ 3− / 6 |
| `tools/play-stage/load.ts` | 2+ 1− / 3 |
| `tests/project/f0c-carries.test.ts` | 121+ / 121 (shipped, verbatim) |
| **Total** | **187 / 400** |

Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Interfaces to match (quoted exactly)
```ts
// src/project/load/read-project.ts
export const LIMITS = { picks: 8, waveUnits: 16 } as const;
export const PLAY_LIMITS = { picks: 0, waveUnits: 0 } as const;
// src/project/load/index.ts
export { LIMITS, PLAY_LIMITS, readProject } from "./read-project.ts";
export { budgetUse, type BudgetUse } from "./budgets.ts";
// src/editor/project/test-gate.ts
export const poolLine = (stage: string): string => `${stage}: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.`;
export function poolLines(load: { readonly project: { readonly stages: Readonly<Record<string, Readonly<Record<string, unknown>>>> } | null }): readonly string[];
export function testGate(report: readonly ReportRow[], readOnly: boolean, names: Readonly<Record<string, string>> = {}, more: readonly string[] = []): TestGate;
```
From `src/types/core-types.ts` (import, don't redefine): `BudgetKey`, `BudgetLimit`, `ProjectBudgets`. No file outside core-types declares any of the three.

## Smoke lines
No smoke is added or edited. All smokes stay unedited and PASS (the 25 in the 11c1 guide, ports as listed there). The demo template's pool is fixed, so no smoke reaches the new line. Sims and their pins don't move.

## Existing tests changed by ruling (and only these)
- `tests/smoke.test.ts`: "smoke: core-types.ts is the pinned DSK copy": the sha moves `439f403d…` → `897d51db…` (Ruling 1). Nothing else in that file.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a weakened, renamed or deleted one is a REJECT unless "Existing tests changed by ruling" names it; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-f0c-carries/`) | Copy to | sha256 |
|---|---|---|
| `tests/project/f0c-carries.test.ts` | `tests/project/f0c-carries.test.ts` | `870970073f2d0f538e57ea10e132fd4d92eeb620355e730ec2af6c7c00e30479` |
Titles they hold (exact):
- "f0c CN-029: core-types is DSK's staged copy byte for byte, settings.budgets is a ProjectBudgets, and the reader's budget rows still use it": core-types bytes equal `core-types.staged.ts`; a `ProjectBudgets` value types as `CoreProject["settings"]["budgets"]`; a units 7/9 budget still gives `units:7` and one `budgetNear` warning.
- "f0c gate: a weighted or waves pool that play refuses blocks Test and Build game with one line naming the stage; the reader still passes it": weighted picks 2 and waves of 3 units; `load.ok` true; `poolLines`, `testGate`, `launchTest` (its `start` mock is never called) and `buildGame` (fetches no play file) all give the one line.
- "f0c gate: the pools proof: for every pool shape the gate's pool lines are empty exactly when play opens the stage": fixed, weighted picks 0/1/8, waves 0/1/16 units; `openProject` opens exactly the shapes with no pool line, and the others fail with "play: stage".
- "f0c gate: pool lines come after the hard rows' lines, one per refused stage, named by the stage (the id when it has no name); a stage the reader already rejects adds none": three stages (named, unnamed, picks 9 over the reader's cap); `poolLines({ project: null })` is empty.
- "f0c play: the engine reads stages with PLAY_LIMITS too: docsToInput hands them to the sim, which refuses a weighted or waves stage, and arriving into one fails the same way openProject does": `docsToInput(docs).input.stageLimits` equals `PLAY_LIMITS`; `createWorld` throws `stage: …` for weighted picks 2 and waves of 3; `arriveIn(files, null, stage, party)` gives docs `null` and the same error as `openProject` ("play: stage").
(You may add tests. The hand-back lists each shipped file's sha256, unchanged.) Floor: **1175 + 5 = 1180**.

## How a planted bug is caught (for QA)
`handoff/steps/tests/step-f0c-carries/plants-f0c.py` (sha256 `39f67d7b00f6f2b27d1d0e76d8bf6afb52c243b8de0acf5e0cb193a834ab730f`), run from the repo root on a clean F0c tree: **13/13 caught** in the trial: P1 Test drops pool lines, P2 Build game drops them, P3 play keeps its own caps (L66), P4 no reader check, P5 pool lines before hard lines, P6 stage id instead of name, P7 `PLAY_LIMITS` drift, P8 CN-029 not applied; r2 adds P9 `load.ts` widened to 8/16 (QA must-fix 1), P10 both `readStage` caps in `project.ts` (L66 and L113) widened to 8/16, P11 `arriveIn` skips its own stage check, P12 `.concat(more)` dropped (QA), P13 `break` after the first refused stage (QA).
- **L113 on its own (QA must-fix 2):** widening only `arriveIn`'s cap is an equivalent mutant. Every `arriveIn` path ends in `openProject(…, toId)`, which reads the same stage again at L66, so the result (docs `null`, "play: stage") can't differ. Test 5 pins the observable part (arriving fails exactly as `openProject` does); P10 and P11 cover L113 together with L66. Pinning L113 alone would need a behaviour change in `arriveIn`, which is out of scope. The shipped test file fails on the base (no `poolLines` export). The script asserts each anchor occurs once; if a builder's text differs, QA adapts the anchor and records it.

## Example
A creator imports a project whose "Cave" stage has `enemyPool: { mode: "weighted", picks: 2, … }`. On the base, the gate passes it, then play throws and Test and Build game show only the raw text "play: stage". After F0c, Test shows "Can't play yet" with "Cave: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.", and Build game refuses with the same line before it fetches any play file. Turning the pool into a fixed list makes both work.

## Decisions note: what to name
- `PLAY_LIMITS` value and why it lives next to `LIMITS` (one source for play and the gate).
- The order of gate lines: hard rows (as 11c1), then pool lines in stage order.
- The gate's scope: project-wide, while `openProject` refuses only the stage it opens (Ruling 4); "exactly what play refuses" holds per stage.
- That `poolLines` runs `readStage` twice per stage: a bounded, per-tap cost with no cache (BUILD_GUIDE law 13: nothing retained).
- Reserved words: none new. No game words in `src/core` or `src/sim` (nothing there changes).

## Do not touch
- `src/core`, `src/sim`, `src/runtime`, `src/rules`, `src/project/read`, the format docs, `data/` (including `data/staging/`, which stays as staged), `fixtures/`, `tools/maker/stage.ts`, `tools/maker/home.ts`, `tools/export`, `tools/apk`, any smoke, `painter-proto`, `ui-shell`; plus BUILD_GUIDE §7's never-edit list.
- `src/types/core-types.ts` beyond DSK's diff.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least **1180** tests passing (green = BUILD_GUIDE §6).
- [ ] `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101; maker `home.ts` L92 ×2).
- [ ] The shipped test file is byte-identical to its listed sha256.
- [ ] `src/types/core-types.ts` sha256 is `897d51db…`; the smoke pin says the same; `data/staging/cn-budgets/` unchanged.
- [ ] `rg -n "type (BudgetKey|BudgetLimit|ProjectBudgets) =" src tools` finds core-types only.
- [ ] `rg -n "picks: 0" tools/play-stage` finds nothing (checked on the r2 trial: no hits).
- [ ] Each file within its cap; at most 400 counted lines (trial 187).
- [ ] Rule 8 (Ruling 7): no new statement packed onto a line; every new block body on its own lines.
- [ ] All smokes unedited and PASS; the no-screen proof's two pixel-equal pairs (map, Test) at 390×844 are in the handback with the comparison result.
- [ ] Export audit as in the 11c1 guide's Done when: **136 / 150 / 150** files (unchanged from the base), 0 hits.
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above.

## Not in this step (carries, with their target step)
QA's 11c1 r2 carries stay with **11c2** (on hold behind F6, plan L100); F0c doesn't pull any of them in:
- Neutral `setupIds` dropped: no test catches it yet (11c2).
- A pool on the neutral side still counted as AI (11c2).
- `"none"` counted as an effect (11c2).
- The Budgets summary picking the first stage instead of the busiest (11c2).
- Roster `required` dropped (matches play, `project.ts` L84; 11c2).
- The module-wide `let open` in `tools/maker/budgets.ts` (11c2).
- The re-parse on every repaint: timed on the S21 as the **CEO's phone check** (relayed via CoS), with 11c2.
- Meter spacing and the warn and error tokens (11c2).
Other carries:
- Playing weighted pools and waves: engine work, after F6, with its own placement card (plan L100, L249).
- **After F6 (UX, 2026-11-27):** the maker can't convert a weighted or waves pool (`src/editor/stage/place.ts` L41: `addEnemy` returns `null` unless the mode is `fixed`), so Test's gate sheet later gets a "Use a fixed list" button for this line.
- **11c2 (UX, 2026-11-27): the 11a2 ready sheet body.** The body in `tools/maker/build-sheet.ts` L13, which ends "A phone app version comes in a later update.", becomes UX's text: "Saved to Downloads as {file}. This is a web game: upload the zip to a game site like itch.io, and anyone can play it in a browser." The pins in `tests/tools/sheet-11a2.test.ts`, `docs/maker/steps/step-11a2-ready-sheet.md` and `docs/rebuild/step-11a2.md` move with it. The title and the Share button stay; no unzip steps.
- The 11c1 Carries list (stage chip, Phone-like Test, etc.) stands unchanged.

## Out of scope
- Any play support for weighted or waves pools; any maker UI for pool modes.
- Any budget edit screen or migration; any formatVersion bump.
- Removing `data/staging/cn-budgets/` (DSK's call; steps 7 and 8 left their staging folders in place).

## Open questions
1. ~~**UX:** confirm Ruling 5's line.~~ **Resolved:** UX confirmed it as drafted (2026-11-27, via CoS).
2. **DSK:** none needed. CN-029 applied cleanly on the base with no difference from the staged result, and the pool check adds no report code. (If DSK wants the pool refusal as a report row instead, that's a format change for a later step.)
