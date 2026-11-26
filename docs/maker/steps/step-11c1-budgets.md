# Step 11c1: budgets as project data, checked by the reader, blocking Test and Build game over a hard limit

r2, 2026-11-26, Engine Architect (r1 → r2: DSK's E10a corrections and CN-029 type shapes, UX's two row changes and 11c2 carries; roadmap step 11c, first slice: MS-08 budgets). One builder run (ChatA) and one QA review, with gates on. Every number below comes from a trial run on main `4c6d1c40` (see Measured). Rulings from the CoS chat are labelled **EA ruling**, DSK's **DSK to EA**, UX's **UX to EA**; CEO rulings are marked CEO. The phone-like Test, the frame-time overlay, auto-lite and the stage chip and its sheet are **11c2** (EA ruling 1).

Step id: `step-11c1-budgets`. Guide revision r2; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main **`4c6d1c409aa556d8f3c8f5bcd3f7a0fa668b6317`** (`docs(rebuild): step 11b record, README row 32, QA box APK check`), docs-only on the **11b merge `71bc22dba88eb608b7f065f88d246af89314b321`** (PR #110). Green on the base: **1170 pass, 0 fail** (fresh clone, `npm ci`). If main has moved by the go, CoS re-checks that it is docs-only on `4c6d1c40` and that the trial patch applies.
**Authority:**
- **CEO ruling 2026-11-19 14:42** (roadmap `docs/maker/roadmap.md` at `4c6d1c40`, sha256 `5c210ecdfcab402a24b2bd176a069cd923b34960df490b73a95471959d885684`, L86, MS-08): the maker shows unit, active-AI, effect and stage-size budgets, each with a hard limit and a warning; the early export uses the same caps as the full export. BUILD_GUIDE §2.2 law 17: a hard error blocks Test and export.
- **DSK to EA, 2026-11-26 (rev. 23:05):** `handoff/dsk-rulings/2026-11-26-step11c.md` (sha256 `e997db7299ca56d56c81462a0ec0e48b34277b5a954b549f31dfcbce8ad89daa`, 47 lines; CoS pushes it with this guide) **E8** (fields; the `budgetInvalid` pointer `project.json#/project/settings/budgets/<key>`), **E9** (rows; the exception to C4 and §10), **E10** (counting), **E10a** (counting where E10 was silent: weighted and waves pools, effects, `overrides.setups`), **E11** (the Phone-like flag, 11c2). **CN-029**, staged byte-exact in `data/staging/cn-budgets/`: `cn-budgets.diff` (sha256 `227a933377d7a8fa449b98428fa63cce8fee3f7a5e8d101ea975985a433efdb4`) against core-types `439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5` (main's core-types at `4c6d1c40`, checked), giving `core-types.staged.ts` (`897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f`). It lands after 11c1 merges, not in 11c1 (Rule 1).
- **UX to EA, 2026-11-26 22:15:** `/workspace/share/s11/ux-11c-ruling.md` (sha256 `96162870819f7072000e831271cad944384de1fcf251a5d801eb26622dee3ebe`), the 11c1 parts quoted in Rules 4–5. **UX to EA, 23:05** (CoS chat): EA ruling 8, the toast overlap, the badge and plain numbers accepted; the meter `aria-hidden="true"` and a near/over word suffix on each row (Rule 5); three carries to 11c2 (Carries).
- **CEO ruling 2026-11-26 23:12 London** (via CoS): budget strictness option A, tuned for an ordinary phone (S21 Ultra); the values in Budget values.
- EA plan `/workspace/share/s11/s11c-plan.md` (sha256 `14fcefd1…`): numbers and sources.
**Test floor:** **1170 + 5 = 1175** (named tests 1–5, one new file).
**Needs:** nothing beyond the base. **Blocks:** 11c2 (it bases on the 11c1 merge).
**Smoke:** new **s11c1**, port **8823**, `r1` (6 ok: 3 steps at 390 and 360). Free on the base (8822 is s11a2, 8820/8821 s11b). Counted in the 400. Smokes after 11c1: **25**.

## Where 11c1 sits
- **On the base** nothing counts units, AI, effects or map size, and nothing blocks on size or count (project-format C4, §10).
- **11c1:** `project.json` gains **`settings.budgets`** (DSK E8). The project reader counts each stage (E10) and reports **`budgetNear`** (warning) and **`budgetOver`** (hard) rows (E9). Test and Build game already block on hard rows through one `testGate`, so an over-limit stage blocks both with UX's line, in Test's existing gate sheet; the step-36 full export will read the same report, so the early and full exports share the caps. The project screen gets UX's **Budgets** row. New projects get budgets from the template data; old projects have none and nothing is checked (E10).
- **11c2:** the stage top-bar chip and 'Budgets for this stage' sheet (with UX's warning line), the Phone-like Test switch (E11), the 390×844 frame, the frame-time pill and auto-lite.

## Budget values (CEO ruling 2026-11-26 23:12: option A)
The only place the numbers live is template data, the same four lines in `data/templates/demo.tileproj/project.json`, `data/templates/empty.tileproj/project.json` and `fixtures/demo.tileproj/project.json` (the fixture must stay byte-equal to the demo template: `tests/editor/project-home.test.ts` L22). The CEO picked **option A, tuned for an ordinary phone (the S21 Ultra)** (CEO ruling 2026-11-26 23:12 London, via CoS): units 40/80, enemy AI 12/24, effects 8/12, stage 128×128 / 256×256 tiles (16384/65536). Sources in the EA plan §2:
```json
        "units": { "warn": 40, "limit": 80 },
        "activeAi": { "warn": 12, "limit": 24 },
        "effects": { "warn": 8, "limit": 12 },
        "stageTiles": { "warn": 16384, "limit": 65536 }
```
These are final; nothing to fill in at the go. (Any later change is a one-line edit per budget in the three files plus smoke step 1's expected row text; no code or test change.)

## Delivery
Same as the 11a2 Delivery (`step-11a2-ready-sheet.md`), with this step id.
- Branch **`step/step-11c1-budgets-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-11c1-budgets/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 25 smokes and the mutations), § Export audit (Done when) and § Shots (the three 390×844 smoke shots, listed by name; commit them under `handback/step-11c1-budgets/r1/`). Label the **Code head** apart from the docs-only **tip**, and give both shas; quote the tip sha and the test counts. Don't commit a raw test log.
- **§ Helpers & self-review lists EVERY helper agent, script and one-off command file used**, one line each; "None" if none.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN` (not in chat, logs or files), and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no branch delete, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- **Budgets are data.** A project can say, in `settings.budgets`, how many units, AI-controlled units, distinct effects and map tiles one stage may have, each with a warning and a hard limit. The engine only compares the numbers it reads; nothing is hard-coded in code.
- **The reader checks them.** Near a limit is a warning; over it is a hard row that blocks Test and Build game, with UX's plain line naming the stage and the fix. The project still opens, edits and saves (E9: not an H code).
- **The maker shows them** in one Budgets row on the project screen.
**Not in 11c1:** the stage chip and sheet, the warning line, the Phone-like Test, the frame or the pill, auto-lite (11c2); writing budgets into old projects or any budget editing screen (a later step, E10); the core-types copy (Rule 1).

## Read first (lines checked on the base `4c6d1c40`)
1. `src/project/load/read-project.ts` L2 (the `drops.ts` import), L121 (`const hard = rows.some(…)`), L122 (`const store: ProjectStore = …`), L123 (`return { ok: !hard, …, report: sort(rows) }`). `src/project/load/index.ts` L1–3; `types.ts` L4 (`ReportRow = { code, severity, path, detail? }`).
2. `src/editor/project/test-gate.ts` L16 (`sentence`), L24–28 (`testGate`: hard rows block, warnings don't). Callers: `tools/maker/test-launch.ts` L3 and L31 (one dense line; the `gate = testGate([...load.report, ...rows], load.readOnly)` part), `tools/maker/export.ts` L2 and L28.
3. `tools/maker/home.ts` L6 (the `build-sheet` import), L47 (the project screen; its `tail:` starts `` `${buildButton(building)}``, which sits after the stage rows and before the rest), L161 (`if (act.startsWith("open:")) forgetBuild();`, the first of 11a2's own-line act lines). `tools/maker/project.ts` L7 (Test's gate sheet: "Can't play yet", Fix, and the lines in a `.sheet`).
4. `tools/maker/app.css` L5 (`.body` is a scrolling flex column), L30–31 (`.project .sheet`).
5. Sides and loadout as play reads them: `tools/play-stage/sides.ts` L4–11 (`sidesOf`), `tools/play-stage/project.ts` L27–33 (`knob`: a `"default"` answer reads the catalogue default) and L92 (`min(loadout size, start tiles)`). project-format §6.5 (L1040–1120: `sides?`, `loadout` override, `EnemyPool` modes).
6. Laws in tests: `tests/editor/maker-law.test.ts` (no `?? {}` under `src/editor/project` or `tools/maker`), `tests/project/load/one-parser.test.ts` (no `JSON.parse` in `src/project/load` or `tools/maker` outside `project-files.ts`), `tests/editor/project-home.test.ts` L22–23 (the demo template equals the fixture; both templates read with an empty report).
7. The three `project.json` files above: L12–13 (`"settings": {` / `"wrapEdges": false`).

## Rules
1. **Types (core-types route, EA ruling 2).** `src/types/core-types.ts` and its pin are **not touched**. `src/project/load/budgets.ts` declares CN-029's three types locally, byte-equal to the staged diff's type text: `export type BudgetKey = "units" | "activeAi" | "effects" | "stageTiles";`, `export type BudgetLimit = { readonly warn: number; readonly limit: number };` and `export type ProjectBudgets = Partial<Readonly<Record<BudgetKey, BudgetLimit>>>;`, under a comment saying they become one import from core-types when CN-029 lands. `limitsOf` returns a `ProjectBudgets` (built with `Object.fromEntries`, never mutated), so the later swap is a pure import. The settings type change stays in the CN: the reader reads `unknown` JSON.
2. **The check (`src/project/load/budgets.ts`, new; DSK E8–E10).**
   - `limitsOf`: `project.settings.budgets` absent → no rows, nothing checked; not an object → one `budgetInvalid` warning at `project.json#/project/settings/budgets` (detail `JSON.stringify(value)`); per key in `units, activeAi, effects, stageTiles`: absent → not checked; an entry that isn't `{warn: int ≥ 1, limit: int ≥ warn}` → `budgetInvalid` warning at `project.json#/project/settings/budgets/<key>`, detail the stored value as JSON, not checked (no repair, no rounding). Unknown keys: ignored, no row.
   - `countOf` (per stage, E10): `gear = stage.loadout` if an object, else `project.loadout`; sides `me = sides.loadout ?? "player"`, pool side `sides.enemyPool ?? "rival"`, neutral side `neutrals[i].side ?? sides.neutrals ?? "neutral"`; AI means a side that is neither `me` nor `"neutral"`. **units** = `min(gear.size, playerSpawns.length)` + pool placements (`fixed`: every entry; `weighted`: `min(picks, spawns.length)`, and also at most `entries.length` when `allowRepeats` is `false` (E10a); `waves`: the **largest single wave**, the max over `waves[]` of the sum of its entries' `count` (E10a)) + every `neutrals[]` object. **activeAi** = the pool placements if the pool side is AI, plus the neutrals whose side is AI.
   - **effects** = the number of **distinct** resolved effect ids over the setups of the counted bodies' units (the loadout roster when the team is non-zero, the pool's units when it places any: every fixed or weighted entry, every entry of every wave; every neutral's unit; E10a) plus every `neutrals[].setupIds`: the answer play uses (`effect.value` when `source` isn't `"default"`, else the catalogue default of that behaviour's `effect` knob, as `tools/play-stage/project.ts` `knob`), then E4: `"none"` or not a string → not counted; an `effects/` doc id → that id; else drop a `builtin:effect/` prefix and count it only if the slice's `effect` presets have it. Rules (`project.rules`, `stage.rules`) and `stage.overrides.setups` are not read (E10a: a known limit).
   - **stageTiles** = `cols × rows` of the stage's `mapRef` map, with `w`, `h`; no map → not counted (the brokenRef row already says why).
   - `export function budgetUse(store): BudgetUse[]` (one entry per stage per checked budget: `stageId, budget, used, warn, limit`, and `w, h` for stageTiles) and `export function budgetRows(store): ReportRow[]`: the `budgetInvalid` rows plus, for each use with `used ≥ warn`, **`budgetOver`** (`hard`) when `used > limit`, else **`budgetNear`** (`warning`); `path` `stages/<stageId>.json#`; `detail` `JSON.stringify({budget, used, limit})`, with `w, h` after `limit` for stageTiles.
   - Only `./types.ts` is imported. No game words, no defaults, no writes. The file ships in the play tree (the reader imports it); the runtime never reads budgets (E8).
3. **Wiring the reader (`read-project.ts`, `index.ts`).** One new import line (`budgetRows`), and one new line **after L122** (after `hard` and the store exist): `rows.push(...budgetRows(store));` with a trailing comment that `budgetOver` blocks only through `testGate`, never `ok` (E9). So `ok`, `openProject`, the unit diagram and the export's play boot are unchanged by budgets. `index.ts` gains one line: `export { budgetUse, type BudgetKey, type BudgetUse } from "./budgets.ts";`.
4. **The gate's lines (`src/editor/project/test-gate.ts`; UX copy verbatim).** `budgetLine(budget, stage, used, limit, w, h)`, exported:
   - units: `{Stage}: {used} units. The limit is {limit}. Remove some units.`
   - activeAi: `{Stage}: {used} units take AI turns. The limit is {limit}. Remove some or put them on your team.`
   - effects: `{Stage}: {used} effects. The limit is {limit}. Remove some effects.`
   - stageTiles: `{Stage} is {w} × {h} tiles. The limit is {limit} tiles. Make the map smaller.`
   - anything else: `Can't play: budgetOver <budget>`.
   `overLine(row, names)` reads the row's detail with one regex (no `JSON.parse`), and the stage id from `stages/<id>.json#`. `export function stageNames(load)`: stage id → `name` (the id when a stage has none; no `?? {}`). `testGate` gains a third parameter `names: Readonly<Record<string, string>> = {}` and maps `budgetOver` rows through `overLine`, all others through `sentence` as before. In `test-launch.ts` L31 and `export.ts` L28, only `testGate([...load.report, ...rows], load.readOnly)` becomes `testGate([...load.report, ...rows], load.readOnly, stageNames(load))`, plus `stageNames` in each import. Numbers are plain integers (`65536`), as UX wrote them.
5. **The Budgets row (`tools/maker/budgets.ts`, new; `home.ts`).** UX: "a project-screen Budgets row after the stages and before Build game. Collapsed shows one summary line; tapping opens four rows: label, '{used} of {limit}', a thin bar."
   - Summary, over all stages (each budget's busiest stage): `Budgets: {n} over the limit` if any budget is over, else `Budgets: {n} near the limit` if any is near, else `Budgets: all good`.
   - Labels `Units`, `Active AI`, `Effects`, `Stage size`; rows `<p class="budget" data-budget="<key>">` with `<span>{label}</span> <span>{used} of {limit}{state}</span>` and a native `<meter>` (min 0, max `max(used, limit)`, `low = warn − 0.5`, `high = limit + 0.5`, `optimum = 0`, **`aria-hidden="true"`**: the words carry the meaning, UX 23:05) so below warn is the good band, warn to limit the middle band and over the limit the bad band, with no new CSS (EA ruling 4).
   - `{state}` (UX 23:05): ` · over limit` when `used > limit`, else ` · near limit` when `used ≥ warn`, else nothing. So `Units 7 of 9 · near limit`, `Active AI 2 of 1 · over limit`, `Effects 0 of 12`.
   - The row is a `<div class="budgets" data-budgets>` holding a `<button class="btn ghost stage-row" data-act="budgets" aria-expanded>` (Build game's 48 px style, EA ruling 8); it is `""` when no budget is checked (EA ruling 5). `budgetsTap(paint)` flips a module `let open` and paints.
   - `home.ts`: one import line; L47's `tail:` becomes `` `${budgetsRow(state.files)}${buildButton(building)}…`` (the only edit inside an existing line); one new act line just before L161: `if (act === "budgets") return budgetsTap(paint);`.
6. **Test's gate sheet stays visible (`tools/maker/app.css`, one new line, EA ruling 6).** Append `.project .sheet { flex-shrink: 0; }` after L31. On the base, the gate sheet's lines shrink to 0 px tall on a project screen longer than the viewport (the demo at 390×844), so "Can't play yet" shows with no reason; the budget block lines need that sheet.
7. **Templates and fixture.** The three `project.json` files: `"wrapEdges": false` gains a comma and the `"budgets"` object follows with the four lines above (one line per budget). Nothing else in `data/` or `fixtures/`.
8. **Layers and style.** Nothing in `src/core`, `src/sim`, `src/runtime`, `src/rules`, `src/types`, `tools/play-stage`, `tools/export`, `tools/apk` or the format docs. **One statement per line in all new code (src/, tools/ and tests/), including new code in dense files: new functions, lets and act lines each get their own lines; never pack a new statement onto an existing line.** The only edits inside existing dense lines are the ones Rules 4–5 name (L31's `testGate(…)` call in `test-launch.ts`, L47's `tail:` in `home.ts`). New smokes keep the s10c smoke layout. Any join or pack to fit a cap is NOT OK.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `src/project/load/budgets.ts` | new: local types, `limitsOf`, `countOf`, effects, `budgetUse`, `budgetRows` (Rules 1–2) | 112 [102] |
| `src/project/load/read-project.ts`, `index.ts` | one import, one push line; one export line (Rule 3) | 4 [3] |
| `src/editor/project/test-gate.ts` | `budgetLine`, `overLine`, `stageNames`, `testGate`'s `names` (Rule 4) | 32 [26+ 3−] |
| `tools/maker/test-launch.ts`, `export.ts` | import and `stageNames(load)` (Rule 4) | 4 + 4 [2+ 2− each] |
| `tools/maker/budgets.ts` | new: the Budgets row (Rule 5) | 42 [39] |
| `tools/maker/home.ts` | import, L47's `tail:`, one act line (Rule 5) | 6 [3+ 1−] |
| `tools/maker/app.css` | one new line (Rule 6) | 1 [1] |
| three `project.json` (2 templates, 1 fixture) | the budgets object (Rule 7) | 8 each [7+ 1− each] |
| `tests/project/budgets-11c1.test.ts` | new, named tests 1–5 | 135 [129] |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | new smoke (port 8823) | 60 [54] |
| **Total** | caps sum to 424 | **400 [393]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'` (added + removed). Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap. (The 18 Nov Q9 template/fixture exemption is not used: the JSON lines are counted.)

## Named tests (`tests/project/budgets-11c1.test.ts`)
1. `11c1 budgets: DSK E10 counts the stored start state: team min(loadout size, start tiles), enemy pool placements (weighted capped by spawns and, without repeats, entries; waves by the largest wave), every neutral; AI by the effective sides; distinct resolved effects (wave units too); map cols x rows` (the demo template: units 7, activeAi 2, effects 0, stageTiles 54; reassigned sides; a stage loadout of size 1; a weighted pool of picks 5 on 3 spawns with 1 entry: 3, and 1 with `allowRepeats: false`; a waves pool of waves 4 and 2 + 3: 5 in units and activeAi; effect ids: a bare id and its alias count once, an alias on its own preset counts, an unresolved id and a `"default"` answer don't; a size-0 loadout, so the Archer's setups count only through the wave; a 300 × 2 map).
2. `11c1 budgets: budgetNear when warn <= used <= limit, budgetOver (hard) above and replacing near, at stages/<id>.json# with detail {budget, used, limit[, w, h]}; ok stays true` (exact rows; used = limit is near; under warn gives nothing).
3. `11c1 budgets: absent means no rows; a partial object checks only its keys; a broken entry is one budgetInvalid warning and isn't checked; unknown keys are ignored; nothing is written` (warn 0, limit < warn, warn 1.5, an unknown key, and `budgets: 5`; the input is unchanged).
4. `11c1 gate: budgetOver blocks Test and Build game with UX's line named by the stage; budgetNear never blocks` (the four UX lines; `testGate` with `stageNames`; `launchTest` refuses without starting; `buildGame` refuses before fetching any play file).
5. `11c1 maker: the Budgets row after the stages in UX's words: one summary line, and on tap the four rows with used of limit, a near or over suffix and an aria-hidden meter` (all good, 1 over, 1 near, the four rows in order with `· near limit` / `· over limit` / none, four `aria-hidden` meters, no row without budgets).

## Smoke (`handoff/steps/tests/s11c1-budgets/smoke.mjs`, port 8823, r1)
Dev maker build on 8823. Touch, at 390 and 360. Edits are written to OPFS and `__write`, as s10b does. Steps: **1** a new demo project: the Budgets row sits just before Build game and reads `Budgets: all good`; tap: four rows `Units 7 of 80`, `Active AI 2 of 24`, `Effects 0 of 12`, `Stage size 54 of 65536`, each with a meter; tap closes. **2** budgets units 7/9 and activeAi 1/1: `Budgets: 1 over the limit` (shot `01-budgets-collapsed`); tap: rows show `7 of 9 · near limit` and `2 of 1 · over limit`, Effects has no suffix, four `aria-hidden` meters (shot `02-budgets-expanded`). **3** **Test**: "Can't play yet" and Test's gate sheet with "Demo stage: 2 units take AI turns. The limit is 1. Remove some or put them on your team.", the sheet taller than 0 px, no match (shot `03-gate-budget`); **Build game**: the same line, no download; budgets back to units 7/9 only (near): **Test** starts the match. 6 ok. Shots at 390 only, into `handback/step-11c1-budgets/r1/`.
Then run every smoke solo, unedited (**25**): the 24 in the 11b guide (S0 8797 … s11a2 8822, s11b 8820 r1) and **s11c1 8823 r1 (6)**. All print SMOKE PASS. Restore tracked files after each run (`git checkout -- handback` and remove untracked shots; keep a copy of the three s11c1 shots for the handback first). If s3 step 9 or s8c steps 1–3 miss (known flakes), re-run that smoke solo once and record both runs. s6a steps 5–6 at 390 are not a flake: they fail when the Budgets button is taller than Build game (EA ruling 8).

## Must NOT
- No edits outside the Build table. Nothing in `src/core`, `src/sim`, `src/runtime`, `src/rules`, `src/types/core-types.ts`, `tests/smoke.test.ts`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/maker/stage.ts`, the format docs, `painter-proto` or `ui-shell`. No edit to any existing test or smoke.
- No budget number in code: the limits live only in the three `project.json` files (and in tests and the smoke as test data). No engine default when `budgets` is absent; no migration; no writing budgets on save; no repair or rounding of a bad entry.
- `budgetOver` never changes `readProject().ok`, `readOnly` or what the project screen allows; the editor never stops anyone adding (UX).
- No UI words beyond UX's (the summary lines, the four labels, '{used} of {limit}', ' · near limit', ' · over limit', the four block lines). No stage chip, no new sheet, no new CSS beyond Rule 6's line, no colour.
- No `JSON.parse` in `src/project/load` or `tools/maker` (beyond `project-files.ts`), no `?? {}` under `src/editor/project` or `tools/maker`, no packing (Rule 8).
- Never push main, a tag or gh-pages; no force-push; no branch or tag delete; no PR actions. `GH_BUILDER_TOKEN` never in chat, logs, files or `.git/config`.

## Done when
- Green exits 0 at the floor (**1175**). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101; maker `home.ts` ×2, now at **L92** because of the new import line).
- All 25 smokes PASS with the counts above; the three shots are in the handback.
- **Export audit, self-run from the repo** (write it as a `/tmp` script and list it in § Helpers): build three trees with the repo's own builders, each into a fresh temp dir with commit `"0".repeat(40)`: `tools/play-stage/build.ts` `build(out, commit, root, false)` (all files), `tools/baseline/build.ts` `build(out, commit, root)` (all files), and `tools/maker/build.ts` `build(out, commit, root, false)` (only paths that start with `play/` or contain `play-stage`). No file name matching `/tools\/maker|src\/editor|catalogue\.json\.js$|behaviours\.json/` and no content matching `/tools\/maker|src\/editor|tileengine\/saves|session-save/`. Expect **0 hits** and **136 / 150 / 150** files (the base has 135 / 149 / 149; 11c1 adds `src/project/load/budgets.ts`, which the reader imports).
- HANDBACK § Smoke records the mutations below; § Helpers lists every helper and script.

## Measured (trial runs, 2026-11-26, fresh `/tmp` clone of GitHub main with `npm ci`, never pushed)
- **Base** `4c6d1c40`: green **1170 pass, 0 fail**; main had not moved (re-checked at 23:1x London: tip `4c6d1c4`, core-types sha256 `439f403d…`); audit 135 / 149 / 149.
- **Trial r2** (commit `0ff533248f5daf57765ce527628d26761758deca` on `4c6d1c40`, tree `2111bb7c…`; r1's `83c2f1b9` amended): green **1175 pass, 0 fail**; tsc: only the 3 base errors. Count **393** (382+ 11−): test 129, `budgets.ts` (load) 102, smoke 54, `tools/maker/budgets.ts` 39, `test-gate.ts` 26+ 3−, three `project.json` 7+ 1− each, `home.ts` 3+ 1−, `test-launch.ts` and `export.ts` 2+ 2− each, `read-project.ts` 2, `index.ts` 1, `app.css` 1.
- **s11c1 solo:** 6 ok, PASS; shots at 390×844: `01-budgets-collapsed`, `02-budgets-expanded` (with the suffixes), `03-gate-budget`.
- **Smokes, all solo (25, unedited, on `0ff53324`):** S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6 ok: all SMOKE PASS, no re-runs. (r1 history: with a 72 px `choice` button s6a failed steps 5–6 at 390, EA ruling 8.)
- **Export audit:** 136 / 150 / 150 files, 0 hits, PASS.
- **Base finding:** Test's gate lines measure 0 px tall on the demo's project screen at 390×844 on the base (a seed error, same sheet); with Rule 6's line they show (22 px for one line).
- **Mutations** (one at a time on `0ff53324`; test file + s11c1 smoke where marked), record the same in § Smoke. All 28 caught:
  - C1 `budgetOver` before `hard` (flips `ok`): test 2. C2 over never hard: tests 2–4, smoke 3. C3 near starts above warn, C4 over at the limit: test 2.
  - Counting, test 1: C5 team ignores the loadout size, C6 neutrals ignore `sides.neutrals`, C7 effects counted per setup, C8 alias prefix kept, C9 a `"default"` answer read as its stored value, C12 weighted picks not capped by spawns, C13 waves counted as 0 (r1's reading), C20 AI ignores the loadout side, **C21** `allowRepeats: false` ignored, **C22** waves summed over all waves, **C23** only the first wave counted, **C24** wave units left out of effects, **C25** waves left out of activeAi.
  - C10 a broken entry skipped silently, C11 warn 0 accepted: test 3.
  - C14 the gate uses the generic sentence, C15 Test drops the stage names: test 4, smoke 3. C16 Build game drops the stage names: test 4.
  - C17 the row never opens: test 5, smoke 1–2. C18 near counted as over: test 5, smoke 2. C19 Rule 6's CSS line removed: smoke 3. **C26** near rows lose the suffix, **C27** over rows say near, **C28** meter not `aria-hidden`: test 5, smoke 2.
- **Trial patch** `s11c1-trial.patch` (588 lines, `git format-patch`, screenshots excluded) passes `git apply --check` on a fresh clone of main `4c6d1c40`.
- Helpers used: `allsmoke-11c1.sh` (the 25 smokes solo), `mutate-11c1.py` (C1–C28), `self-audit.mjs` (the audit, per the Done when spec).

## Carries
**Closed here:** CEO MS-08 budgets (data, check, gate, project row); DSK E8–E10 and E10a; UX 11c1 parts (Budgets row, block lines, gate sheet) and UX's 23:05 row changes; the base's zero-height gate sheet (Rule 6).
**Still open, not 11c1 scope:**
- **11c2:** the stage chip and 'Budgets for this stage' sheet with UX's warning line ('{Budget} is near the limit ({used} of {limit}). Phones may slow down.'); the Phone-like Test (E11 `projects?: Record<id, {phoneTest?: boolean}>` in editor prefs); the 390×844 frame, pill and auto-lite; the stage-chip handback shot.
- **11c2, from UX 23:05:** (1) while the toast shows, the project list keeps bottom padding equal to the toast's height (the toast does not move); (2) the Budgets bar uses the warn and error tokens; (3) optional: Budgets and Build game move below '+ Add stage'.
- **CN-029** (EA ruling 2): staged by DSK (`data/staging/cn-budgets/`), applied after 11c1 merges by the next step's branch, which also swaps budgets.ts's three local type lines for one `import type` from core-types (a pure import: same names, same readonly shapes).
- **Known limit (DSK E10a):** `stage.overrides.setups` are not read when counting effects; listed in project-format r42.
- **CoS phone check:** a stage at the hard limits on the S21, p95 recorded in docs/qa.
- **Later step:** budget editing, and writing budgets into old projects (E10); roadmap L132 (step 36) to say the full export reads the same budget report.
- 11a/11a2/11b carries stand unchanged.

## EA rulings in this guide
1. **Split** as planned (EA plan §4): 11c1 is the data, check, gate and project row; the stage chip and sheet moved to 11c2 to keep 11c1 under 400 with margin (the trial with the chip counted 461).
2. **Core-types route: local types until CN-029.** DSK's batch is "for the EA to issue as a CN after the current step merges. Do not land on main directly", and core-types is a verbatim DSK copy changed only by DSK's staged diff (BUILD_GUIDE L58; steps 7 and 8 carried theirs byte for byte). So 11c1 declares CN-029's three types locally in DSK's readonly shapes and leaves core-types (`439f403d` on main, checked) and its pin alone; CN-029 (staged byte-exact by DSK) lands after 11c1 merges, on the next step's branch, with a −3/+1 swap in `budgets.ts`.
3. **`budgetInvalid` pointer** `project.json#/project/settings/budgets/<key>`: **confirmed by DSK** (E8 rev. 23:05).
4. **Native `<meter>`** for UX's thin bar, `aria-hidden` (UX 23:05): no new CSS or colour in 11c1; the browser's bands until 11c2 applies the warn and error tokens (Carries).
5. **No checked budget, no row** (old projects, E10): UX gave no copy for that case.
6. **Rule 6's CSS line** fixes a base bug the budget block depends on.
7. **Counting where E10 was silent: now DSK E10a.** DSK corrected two r1 readings (weighted pools also capped at `entries.length` without repeats; waves count the largest single wave, not 0) and confirmed the rest (effects over every unit that can appear, the non-object `budgets` row, `overrides.setups` not read). Test 1 and mutations C13, C21–C25 cover the corrections.
8. **The Budgets button uses Build game's style** (`btn ghost stage-row`, 48 px), not a 72 px `choice` card: with the card, the new empty project's **+ Add unit** moved under the "Changed · Undo" toast at 390×844 and the unedited s6a smoke failed steps 5–6 at 390. With the 48 px button s6a passes; **+ Add unit** (y 693–765) still overlaps the toast (top 752) by 13 px. **Accepted by UX** (23:05), with the bottom-padding fix carried to 11c2.

## Questions
None open. DSK and UX answered at 23:05; the CEO picked option A at 23:12 (Budget values above).
