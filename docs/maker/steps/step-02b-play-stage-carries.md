# Step 02b: Play-stage carries A and B

r2, 2026-11-19, Editor & UX Designer. r2 applies QA's optional note in `docs/qa/step-02-r7-02b-review.md` and the CoS order call: L10 now fixes the order with step 3. r1, 2026-11-19, Editor & UX Designer. New guide. QA's handback review of step 2 (`docs/qa/step-02-handback-review.md`, r1 tip `477e021e`, must-fix 1b) and the CoS ruling moved QA carries A and B out of step 2, because step 2 went over the 400-line gate. The carry text below is step 2 guide r6 (sha256 `13167721…`, lines 76–77) word for word. One builder run, 400 lines or fewer including tests, gates on.

Step id: `step-02b-play-stage-carries`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at the merge of step 2 (`step/step-02-home-save-load-r<N>-chatA`). The merge sha is **TBD** (CoS supplies it when step 2 merges). Don't start before step 2 merges.
**Test floor:** step 2's merged test count + N. Expected **1039 + N** (1036 after 1b, plus step 2's 3); CoS gives the real number with the base sha. N is the number of tests this run adds (2 in the step 2 r1 work: one per carry); state it in the hand-back.
**Needs:** steps 0, 1a, 1b and 2 merged. After 1b the play stage loads a project through `readProject`, then `playDocsOf` / `openProject` / `openBundled()` in `tools/play-stage/project.ts`.
**Order with step 3:** 02b first, right after step 2 merges; step 3 bases on 02b's merge. Both edit `tools/play-stage/project.ts`.

## Delivery
Same shape as step 0 (`docs/maker/steps/step-00-play-input.md`, Delivery) and `handoff/HAND-BACK.md`.
- Branch: `step/step-02b-play-stage-carries-r<N>-chatA`, from the base above. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-02b-play-stage-carries/r<N>/HANDBACK.md` (with the files and sections `handoff/HAND-BACK.md` lists, plus § Smoke). Put the `ℹ tests/pass/fail/…` summary lines in § Green; commit no raw test log.
- Gate: `npm ci && npm run green` exits 0 at the floor above. `npm run green` runs `npm test`, typecheck, lint, deps, `check:state` (`scripts/check-state.sh`) and `check:law` (`scripts/check-law.sh`). `npm test` alone is not enough.
- **S0 touch smoke.** This run edits play-stage files, so run the S0 smoke unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. It must print `TOUCH SMOKE PASS` at 390 and at 360 CSS px (7 ok lines at each width). Paste the ok lines in HANDBACK.md § Smoke. The smoke is frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`; check that sha before you run it. It finds units by scene sprite id (`starter:hero-sword` and so on), so carry A must not change any unit's sprite id. Do not edit the frozen kit under `handoff/steps/tests/`.
- Push once, that branch only, through the one-shot credential helper that `handoff/HAND-BACK.md` gives (it reads `GH_BUILDER_TOKEN` from the shell; keep the single quotes).
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- **No token in any output.** Never print, echo, log, commit or store the token, including in `.git/config`. No token value may appear in any file, log, screenshot or message. If it ever does, say so in the hand-back.
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha, the test counts and the smoke PASS lines.

## Goal
Two small play-stage fixes that QA asked for, with their tests. No maker screen changes, no new behaviour for the player. (1) One project load can no longer change the next one, because the play stage stops writing unit-id aliases into the shared `RECIPES` map. (2) A project whose JSON holds U+2028 or U+2029 still builds into `.json.js` files that import correctly.

## Read first
1. `docs/qa/step-02-handback-review.md` (must-fix 1b, Carry checks A and B, non-blocking carry 8).
2. `docs/maker/steps/step-02-home-save-load.md` r7 (the step this follows; its r6, lines 76–77, is where the carry text comes from).
3. `docs/maker/data/s1-project-load.md` §6 (reader) and `docs/maker/data/project-format.md` §2 (folder layout).
4. Code to change: `tools/play-stage/project.ts` (`playDocsOf`, `bundledDocs`), `tools/play-stage/load.ts` (`RECIPES`, `recipeOf`, `PlayDocs`), `tools/play-stage/board.ts` (`createPlay`, unit sprites), `tools/play-stage/match.ts` (`createMatch`, talk and HUD names), `tools/play-stage/build.ts` (`build()`, the `.json.js` writer).
5. Tests to keep green: `tests/tools/play-stage.test.ts` (`project.json.js` equals `export default ` plus the raw file), `tests/tools/play-stage-parity.test.ts`, `tests/tools/touch-play.test.ts`, `tests/project/load/one-parser.test.ts` (plant P2).
6. The S0 smoke: `handoff/steps/tests/s0-play-input/touch-smoke.mjs`.
7. `docs/maker/style-spec.md` (the only visual system; this step adds no UI, so nothing here may change a colour, font or layout).

## The carries (step 2 guide r6, lines 76–77, unchanged)
- **Carry A: no shared recipe map.** Today `playDocsOf` in `tools/play-stage/project.ts` writes fixture unit ids into the module-level `RECIPES` map from `tools/play-stage/load.ts` (`RECIPES[id] = hit`). So one load changes the next load. Fix: `playDocsOf` builds a new recipe map for each load (a copy of `RECIPES` plus that project's unit-id aliases) and returns it with the docs. `match.ts` and `board.ts` look units up in that per-load map, not in the module map. `RECIPES` is never written after module load; freeze it. **Test:** snapshot `RECIPES`, call `playDocsOf` on the demo and then on a second project whose units have other ids; `RECIPES` is deep-equal to the snapshot, and the second load's map has none of the first load's aliases.
- **Carry B: U+2028 and U+2029 in `.json.js`.** `build()` in `tools/play-stage/build.ts` writes each JSON file as `export default ` plus the raw text, without escaping U+2028 (line separator) or U+2029 (paragraph separator). Fix: replace each raw U+2028 with the six characters `\u2028` and each raw U+2029 with `\u2029` in the emitted text (in valid JSON they can only appear inside strings, so this is safe). Do not parse the JSON (plant P2 still bans `JSON.parse` in `tools/play-stage/*.ts`). Rejecting such a project with a typed visible error is also allowed, if the hand-back says so. **Test, either way:** build a temp root whose JSON has both characters inside a string. With escaping: the emitted `.json.js` has no raw U+2028 or U+2029, and importing it gives the original string. With rejecting: the build throws a typed error that names the file. The existing `tests/tools/play-stage.test.ts` check that `project.json.js` equals `export default ` plus the raw file still passes, because the fixture has neither character.
- **QA non-blocking carry 8 (from the step 2 handback review):** make `PlayDocs.recipes` required, so `recipeIn(undefined, id)` can't silently give "Unknown". Anything that builds `PlayDocs` passes a map (`playDocsOf` already does).

## Build
The step 2 r1 work (`477e021e`, base `772f7aa2`) already did these edits, and QA passed them there (Carry checks A and B). You may use it as a reference, but build from the base above and recheck every line. Counted lines below are that work's real `git diff --numstat` (added + removed).

| File | Job | r1 counted | Cap |
|---|---|---|---|
| `tools/play-stage/load.ts` edit | Freeze `RECIPES` (`Readonly<…>` plus `Object.freeze`). Add `recipeIn(map, id)`: the recipe for `id` from a given per-load map, or the existing `fallback(id)`. Add `recipes` to `PlayDocs`, required (carry 8). | 6 (3+/3−) | 8 |
| `tools/play-stage/project.ts` edit | `playDocsOf` builds `recipes` as a copy of `RECIPES` plus this project's unit-id aliases, never writes `RECIPES`, and returns `recipes` with the docs. | 6 (3+/3−) | 8 |
| `tools/play-stage/board.ts` edit | Unit sprites look up `recipeIn(body.recipes, u.unitId)`, not `recipeOf`. | 4 (2+/2−) | 5 |
| `tools/play-stage/match.ts` edit | Talk names and the HUD unit name look up `recipeIn(body.recipes, …)`, not `recipeOf`. | 6 (3+/3−) | 8 |
| `tools/play-stage/build.ts` edit | Carry B: in `build()`'s `walk`, the `.json.js` text replaces each raw U+2028 with `\u2028` and each raw U+2029 with `\u2029`. No `JSON.parse`. | 2 (1+/1−) | 3 |
| `tests/tools/touch-play.test.ts` edit | Its `idOf` / `wolfTo` helpers found units by `recipeOf(u.unitId).name`. After carry A the demo's unit-id aliases live only in the per-load map, so look names up in `bundledDocs().recipes` instead. No other change to the test. | 7 (4+/3−) | 8 |
| `tests/tools/play-stage-carries.test.ts` | new: one test per carry (Done when). | 28 | 30 |

**Hard gate: 400 counted lines.** The caps sum to 70 and are guidance; a file may go over its cap if the total stays within 400, and the hand-back says which file and why. The r1 work was 59 counted lines (44+/15−).

## Must NOT
- **No other theme or visual system.** Use only the tokens, type, spacing, radii and components in `docs/maker/style-spec.md`: no template theme, no CSS framework, no web or icon fonts, no new colours. This step changes no UI.
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from the base above.
- No `JSON.parse`, `formatVersion` or `kind ===` in `tools/play-stage/*.ts` (plant P2 in `tests/project/load/one-parser.test.ts` stays unchanged and green).
- No second adapter: `playDocsOf` stays the one place that turns documents into play docs.
- Nothing module-level is written after module load: no `RECIPES[id] = …`, no other shared map filled per load.
- **No empty `catch` and no silent default (Law 12).** A missing recipe still gives the existing named `fallback(id)`; nothing else defaults quietly.
- No change to any unit's sprite id, rules, stats or the match's behaviour. The parity tests and the S0 smoke prove it.
- No maker edits (`tools/maker/**`, `src/editor/**`) and no template or fixture edits.
- Don't touch the frozen kit copies under `handoff/steps/tests/`.
- Offline, no new dependencies.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 with the test count at **step 2's merged count + N** or more (N stated in the hand-back). That includes `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** `git diff --shortstat <base>..HEAD -- . ':!handback/**'` is 400 or fewer.
- **Carry A test (`play-stage-carries.test.ts`):** snapshot `RECIPES`, call `playDocsOf` on the demo and then on a second project whose units have other ids; `RECIPES` is deep-equal to the snapshot, the first load has at least one alias, the second load's map has none of the first load's aliases, and the second load's own unit resolves by name.
- **Carry B test (`play-stage-carries.test.ts`):** build a temp root whose JSON has both characters inside a string. With escaping: the emitted `.json.js` has no raw U+2028 or U+2029, it does contain `\u2028` and `\u2029`, and importing it gives the original string. With rejecting instead: the build throws a typed error that names the file, and the hand-back says so.
- **Unchanged behaviour:** `tests/tools/play-stage.test.ts` (`project.json.js` equals `export default ` plus the raw file), `tests/tools/play-stage-parity.test.ts` and every other existing test pass with no edit, apart from the `touch-play.test.ts` helper edit above.
- **S0 touch smoke:** `TOUCH SMOKE PASS` at 390 and 360, smoke sha `d528795e…` checked, ok lines pasted in § Smoke.

## Prototype lessons
- A module-level map that each load writes into is shared state between loads. Each load builds its own map and passes it down.
- The play stage reads JSON as JavaScript (`export default …`). A JSON string can hold U+2028/U+2029, which some JS parsers treat as line ends, so escape them where the text is emitted, without parsing it.
