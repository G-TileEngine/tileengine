# Rebuild record: step 11c1, budgets as project data (checked by the reader, blocking Test and Build game over a hard limit)

Original brief: [`docs/maker/steps/step-11c1-budgets.md`](../maker/steps/step-11c1-budgets.md) on the merge (r2, blob `1f64052c`, sha256 `d876765fab4fcdabe691f74421076541e5e0a13ab02f5f501b572e865dcf6215`, 164 lines). Base L7; Authority L8; Test floor L14; Smoke L16; Where 11c1 sits L18; Budget values L23; Delivery L33; Goal L41; Read first L48; Rules L57; Build table L84; Named tests L101; Smoke L108; Must NOT L112; Done when L120; Measured L126; Carries L142; EA rulings L153; Questions L163. Count command L99; hard per-file caps L87–96; hard gate 400 at L97 (caps sum 424; trial 393). Go-line paste `docs/maker/steps/step-11c1-paste.md` (blob `10579ecc`, sha256 `485749e54474f7d578c57a366a68b54b29c4fec0b6e02c7eaf038fc97523ba90`, 12 lines). DSK rulings `handoff/dsk-rulings/2026-11-26-step11c.md` (blob `aa9453a6`, sha256 `e997db7299ca56d56c81462a0ec0e48b34277b5a954b549f31dfcbce8ad89daa`, 47 lines): E8–E10 and E10a (E11 is 11c2). CN-029 staged byte-exact in `data/staging/cn-budgets/` (`cn-budgets.diff` blob `f1a17b11`, sha256 `227a9333…`), **not applied** here (EA ruling 2).

This is **11c1**, roadmap step 11c's first slice: CEO **MS-08** budgets (CEO ruling 2026-11-19 14:42, roadmap L86) as project data. `settings.budgets` lives in the two templates and the fixture with **option A**, tuned for an ordinary phone, the S21 Ultra (CEO ruling 2026-11-26 23:12 London, via CoS): units 40/80, activeAi 12/24, effects 8/12, stageTiles 16384/65536. The reader counts each stage (DSK E10/E10a) and writes `budgetNear` (warning), `budgetOver` (hard) and `budgetInvalid` (warning) rows after `hard`, so `ok` and `readOnly` never change (E9). `testGate` blocks Test and Build game on `budgetOver` with UX's four lines, named by the stage. The project screen gets one **Budgets** row (UX 22:15 and 23:05). One CSS line fixes the base's zero-height gate sheet. It is not the stage chip or sheet, the warning line, Phone-like Test, the frame, the pill or auto-lite (11c2), budget editing, writing budgets into old projects, or the core-types copy. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #111 (r1, closed as superseded) and PR #112 (r2, merged).
- Branches: `step/step-11c1-budgets-r1-chatA` (r1 code head `c57e9bf2`, r1 tip `9976ac6b`) and `step/step-11c1-budgets-r2-chatA` (r2 code head `537479d4`, r2 tip `8819ce1c`, a fast-forward of the r1 tip).
- Hand-backs on the merge:
  - `handback/step-11c1-budgets/r1/HANDBACK.md` (HB1, blob `bc600992`, 139 lines, sha256 `dc9a5bec915c47d4f27a36931fdeccc8b973f08070b1216c594bb7185dd677f6`).
  - `handback/step-11c1-budgets/r2/HANDBACK.md` (HB2, blob `2140f4ba`, 113 lines, sha256 `777bd8976027ad9eb1a8132ffdbbf079193e75082c16d4b1ac952839f63ab742`).
  - Three 390×844 shots each in `r1/` and `r2/`. They are blob-identical across rounds: `01-budgets-collapsed` `e9e377b0`, `02-budgets-expanded` `6723fa0f`, `03-gate-budget` `6095cea8`.
- CoS verify reports:
  - r1 `/workspace/share/step-11c1-verify/report.md` (V1, sha256 `c3be3484deac93252ae2de1af364fee307ef24e5b6aa23d2bb45db94b0023d44`): PASS on every claim, with 8 concerns for QA.
  - r2 `/workspace/share/step-11c1-r2-verify/report.md` (V2, sha256 `0e90dc7d2e31429d7f6dbaed8e9ee3db0a4801596ec6455e4886555d761f6681`): PASS, with 3 notes.
- QA docs on main:
  - Pre-go: `docs/qa/step-11c1-r2-pre-go.md` (blob `ea2d33a6`, 48 lines, sha256 `f0474f68…`) and `docs/qa/step-11c1-r2-paste-recheck.md` (blob `c192a768`, 10 lines, sha256 `5db3014a…`).
  - `docs/qa/step-11c1-r1-review.md` on `c1baf1db` (QA1, blob `bdea2d55`, 52 lines, sha256 `c805565e1b5c019cb5eec398d49031da4207542729354205c1f6729ec90d496e`): **REWORK r2**, test file only.
  - `docs/qa/step-11c1-r2-review.md` on `b736cd97` (QA2, blob `3bc58e71`, sha256 `46218ad225f4ec65de019d7782adebd36a8968cfeaa7959f0d638fd04d2daa99`): **OK TO MERGE**, expected tree `73b77617`.

Line cites use HB1, HB2, V1, V2, QA1 and QA2. Product line cites are at merge `f784e678` (tree `73b77617`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `b7acc899fbf6f90cb0e43b21633d20c3bdf06ac2`, 2026-11-26 23:30 (UK time), tree `b2919270`. It is the guide's base `4c6d1c40` (the 11b record, README row 32 and QA's box APK check, docs-only on the 11b merge `71bc22db`) plus one commit: this guide r2, the paste, the DSK step11c rulings, QA's pre-go docs and `data/staging/cn-budgets/` (staged, not applied). The paste required those to be pushed before the go. Floor **1175** tests (guide L14: 1170 + N=5). The r2 guide was trialled on `4c6d1c40` (trial commit `0ff53324`, patch `/workspace/share/s11/s11c1-trial.patch`, sha256 `2e913edca664e871f5a88647351cd56f4487c783d8b6c50ee61b4c343dd8ae8e`, 393 counted lines, green 1175/0) |
| Main moves during the build | Six commits landed on main after the base: `98325f5` (`data/showcase`, 29 files, not read by tests), `76a0e02` and `4206abf` (QA showcase checks), `ac39c69` (overhaul plan r6), `e675790` (DSK F3 art ruling), `59306e31` (F0 style spec r2). None touches a Build-table file. V1 found merge green unaffected (1175/0 on the r1 merge preview). Then `c1baf1db` (QA1) |
| Main at merge | `c1baf1db1bae434454479a29b72f3c65111f25cc`, 2026-11-27 08:33 (UK time), tree `3f99e465`. This is the merge's first parent. Official 11c1 product against it, and against the base, is **400** (14 Build-table files, +390/−10) |
| r1 commits | On `step/step-11c1-budgets-r1-chatA`: `c57e9bf23c6fbde936d0771ce257e216e2e1babf` feat(maker): step 11c1 budgets as project data (r1 code head, tree `5a9ba777b4220b9ebaa3350d6a652146dabf571a`, 2026-11-27 05:35 UK time), then `9976ac6b9a6e2ae59fe7d9fc831f0dfc3f328ab8` docs(handback): step 11c1 budgets r1 (tree `a6b82860d84f10094e595ef6e9ced5ed9608d8e1`, 05:38). Linear on the base, no merges. Author and committer on both are `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Green **1175/0** (code head, tip and merge preview). Official product **400** (14 files, +390/−10), every cap kept, five files on cap. tools tsc only the 3 base errors (`home.ts` now at L92). All 25 smokes PASS (HB1, V1, QA1). s11c1 8823 r1: 6 ok. Export audit 136/150/150. CoS verify PASS (V1) with concerns: 400/400, the L109 comma probe, dense lines, and the import re-sort. CoS opened PR #111 (2026-11-27 08:24 UK time); its predicted tree onto `59306e31` was `a84b4edd`. QA1 **REWORK r2** (test file only): Rule 8 packs, C20 not really caught, and the import order. PR #111 was closed at 09:37 with "Superseded by #112 (ChatA r2, QA rework)". The r1 branch is kept |
| r2 commits | On `step/step-11c1-budgets-r2-chatA`, as new commits on the r1 tip: `537479d4280916093346d9e7a5315d00025679ce` test(maker): step 11c1 r2 unpack the budget tests (r2 code head, tree `af8ea0ee292edf5c206ff4cbd1ce202ddffbf57b`, 08:57), then `8819ce1cf7551f30f496543032d5b8dffcf22bae` docs(handback): step 11c1 budgets r2 (tree `135cdbeccaa052f13d4470adf26c8c2f196990b8`, 08:58). A fast-forward with no rebase or force-push, noreply author and committer. From the r1 code head to the r2 code head, only `tests/project/budgets-11c1.test.ts` (43/43) and the `tools/maker/test-launch.ts` L3 import (1/1) change |
| r2 verdict | Green **1175/0** (code head, tip and merge preview; CoS and QA). Official product **400** (14 files, +390/−10), the test at 133/135. tools tsc only the 3 base errors. All 25 smokes PASS (HB2: s3 step 9 at 390 missed once, 17 ok, and passed on its solo re-run with 18 ok; V2 and QA2: no flake). Audit 136/150/150. C20 re-proven by CoS (V2: activeAi 4 vs 3) and QA (QA2). CoS verify PASS (V2). Predicted merge tree onto `c1baf1db`: `73b77617` (V2, QA2). QA2 **OK TO MERGE** |
| Merge | PR #112 (opened 09:37, merged 09:44), merge commit `f784e678634a7606687ac3d4c422c1768e2d5353`, 2026-11-27 09:44 (UK time). Tree `73b7761725911705acc7dada60eb09d160855e3d` (the tree CoS and QA predicted). First parent `c1baf1db1bae434454479a29b72f3c65111f25cc`, second parent `8819ce1cf7551f30f496543032d5b8dffcf22bae`. Author and committer are `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #112: Step 11c1: budgets as project data (ChatA r2)`. Green on the merge: **1175 pass / 0 fail** |
| After the merge | main is `b736cd972ab934d6281419c6c1d7d0509663f738`, 2026-11-27 09:44 (UK time), tree `6e6a7a04`. It adds only `docs/qa/step-11c1-r2-review.md` (sha256 `46218ad2`, blob `3bc58e71`) |
| Tests | 1170 + N=5 (named tests 1–5 in `tests/project/budgets-11c1.test.ts`) = **1175 pass / 0 fail**. The floor after this merge is **1175** (HB2, V2, QA2) |

## (b) Files

From `git diff --name-status c1baf1db..f784e678 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` against the merge's first parent, which is the same as against the base `b7acc899` for these files. The new s11c1 smoke is counted in the 400, and so are the three JSON files (the 18 Nov Q9 exemption is not used).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/project/load/budgets.ts` | A | 112 / 0 | 112 (L87) | yes. **112**, on cap (sha256 `e943cdc432fcd3b246bdebd56b2d1b39b63a50941fa03e216f21d09e76c769c8`) |
| `src/project/load/read-project.ts` | M | 2 / 0 | 4 with index.ts (L88) | yes. **2** (sha256 `f962ce3a434514ba5e5183b1763b24f3c07ec6b287b5caf1f0c9cdc63781bce0`) |
| `src/project/load/index.ts` | M | 1 / 0 | (L88) | yes. **1**, so 3/4 together (sha256 `3132f31073ba3f0456aff96ee2117b33813d51b0c036b75b355bbf0a5e4a1a09`) |
| `src/editor/project/test-gate.ts` | M | 25 / 2 | 32 (L89) | yes. **27** (sha256 `2ae59c3b7d7240831df4db77a52c0128d1a71e2b9e2cae82ee705b51fe7a4773`) |
| `tools/maker/test-launch.ts` | M | 2 / 2 | 4 (L90) | yes. **4**, on cap (sha256 `1bdc041407c6eeff3738190f1eaf9ade005e22a8526c4860818ab8674aa7f90d`) |
| `tools/maker/export.ts` | M | 2 / 2 | 4 (L90) | yes. **4**, on cap (sha256 `3dd681a42cf2a191ec016e717356d6dc28ffd292db06d1a865b0b1e728c3a541`) |
| `tools/maker/budgets.ts` | A | 39 / 0 | 42 (L91) | yes. **39** (sha256 `7d95046b802dddd42ac790177f941bc7a2907b11a8b5d18b875951f95dc387d8`) |
| `tools/maker/home.ts` | M | 3 / 1 | 6 (L92) | yes. **4** (sha256 `299836ac52d38412d02564d465f8edacdbd25be4297f979eb58a1010e8ac69b1`) |
| `tools/maker/app.css` | M | 1 / 0 | 1 (L93) | yes. **1**, on cap (sha256 `96230cf128d390578c2d6166c7e46201936cd7b18951fc54f14dc397c61ae801`) |
| `data/templates/demo.tileproj/project.json` | M | 7 / 1 | 8 (L94) | yes. **8**, on cap (sha256 `170809fb84a97999f98c293e14553b5a02b4659219d9fa734e6934fde7ab2a33`) |
| `data/templates/empty.tileproj/project.json` | M | 7 / 1 | 8 (L94) | yes. **8**, on cap (sha256 `3e50903cbfc850aad143b4fd29791776c08b1017fec6e3e282929870da186ee6`) |
| `fixtures/demo.tileproj/project.json` | M | 7 / 1 | 8 (L94) | yes. **8**, on cap (sha256 `170809fb…`, byte-equal to the demo template, blob `44a2845d`) |
| `tests/project/budgets-11c1.test.ts` | A | 133 / 0 | 135 (L95) | yes. **133** (sha256 `99d0d3767ff22f73346605d9bc592fdcb81d1580115fe5be7a22e2397a0c5cf3`) |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | A | 49 / 0 | 60 (L96) | yes. **49** (sha256 `e8ca15c2d6ece002e69ff1deb74e18af083832c1d768dff91685193a628c78a9`) |

What the merge does not touch:
- Nothing under `src/core`, `src/sim`, `src/runtime`, `src/rules` or `src/types` (including `core-types.ts` and its pin).
- Nothing in `tools/play-stage`, `tools/export`, `tools/apk`, `tools/maker/stage.ts`, `tests/smoke.test.ts`, the format docs, painter-proto or ui-shell.
- No existing test or smoke edited.
- No package or lock change, no budget number in `src/` or `tools/`, no new `JSON.parse` or `?? {}`.

The official count at the r1 or r2 code head against the base, or at the merge against first parent `c1baf1db`, is **14 files changed, 390 insertions(+), 10 deletions(-)** = 400. That is on the hard gate, not over; caps sum 424 is not a second gate.

The r2 trial counted 393. It had the same 14 files, and five of them are byte-identical to ChatA's: the three `project.json` files, `app.css`, `index.ts`, `export.ts` and `home.ts` (V1). ChatA's code is its own: load `budgets.ts` 112 vs the trial's 102, the test 133 vs 129, the smoke 49 vs 54.

## (c) Key code and git commands

**Types (Rule 1, EA ruling 2).** `src/project/load/budgets.ts` declares CN-029's `BudgetKey`, `BudgetLimit` and `ProjectBudgets` locally, under a comment saying they become one import from core-types when CN-029 lands. `BudgetKey` and `ProjectBudgets` are byte-equal to the staged type lines. `BudgetLimit` is the guide's quoted text: the staged line also carries a trailing `// int, 1 ≤ warn ≤ limit` comment, and the trial dropped it too (V1).

**Check (Rule 2, DSK E8–E10/E10a).**
- `limitsOf` reads `budgets`:
  - absent: no rows.
  - not an object: one `budgetInvalid` warning at `project.json#/project/settings/budgets`.
  - an entry that isn't `{warn: int ≥ 1, limit: int ≥ warn}`: a `budgetInvalid` warning at `…/budgets/<key>`, detail the stored JSON, and that key isn't checked.
  - unknown keys: ignored.
  - It builds the limits with `Object.fromEntries`.
- `placed` counts the pool:
  - `fixed`: every entry.
  - `weighted`: `min(picks, spawns)`, and also `entries` when `allowRepeats` is false.
  - `waves`: the largest single wave.
- The team is `min(gear.size, playerSpawns)`. Sides come from `sides.loadout ?? "player"`, `sides.enemyPool ?? "rival"` and `sides.neutrals ?? "neutral"`; AI is any side that is neither `me` nor `"neutral"`.
- `fx` resolves an effect answer the way play does (`knob`), then E4 (`"none"` is not counted, an `effects/` doc id counts as itself, a `builtin:effect/` alias counts only if it's a slice preset).
- `effectCount` takes the distinct ids over the counted bodies' setups plus neutral `setupIds`.
- stageTiles is `cols × rows` with `w`, `h`.
- `budgetUse` returns one entry per stage per checked budget.
- `budgetRows` turns each use with `used ≥ warn` into `budgetOver` (hard) above the limit, else `budgetNear`, at `stages/<id>.json#`, detail `{budget, used, limit[, w, h]}`.

**Reader (Rule 3).** `read-project.ts` imports `budgetRows` and runs `rows.push(...budgetRows(store)); // budgetOver blocks only through testGate, never ok (E9)` after `const hard` and `const store` (L124). `index.ts` exports `budgetUse`, `BudgetKey` and `BudgetUse`.

**Gate (Rule 4).** `test-gate.ts` adds:
- `budgetLine` with UX's four lines verbatim, plus `Can't play: budgetOver <budget>` for anything else.
- `overLine`, which reads the detail with one regex (no `JSON.parse`) and the stage id from the path.
- `stageNames`: stage id → `name`, or the id when there's no name.
- `testGate(report, readOnly, names = {})`, which maps `budgetOver` rows through `overLine`.

`test-launch.ts` L31 and `export.ts` L28 pass `stageNames(load)`. In r2 the `test-launch.ts` import is back in its base order with `stageNames` added at the end (QA1 must-fix 3).

**Budgets row (Rule 5).** `tools/maker/budgets.ts`:
- The summary takes each budget's busiest stage and reads `Budgets: {n} over the limit`, `… near the limit` or `all good`.
- The four rows are `Units`, `Active AI`, `Effects` and `Stage size`, each `{used} of {limit}` with ` · over limit` or ` · near limit`, and a native `<meter>` (`low = warn − 0.5`, `high = limit + 0.5`, `optimum = 0`, `aria-hidden="true"`).
- The button is `btn ghost stage-row` (Build game's 48 px style, EA ruling 8), with `aria-expanded`.
- There's no row when no budget is checked.
- A module `let open` flips in `budgetsTap(paint)`.

`home.ts` gets one import, `${budgetsRow(state.files)}` at the start of L48's `tail:`, and `if (act === "budgets") return budgetsTap(paint);` before the `open:` line.

**CSS (Rule 6).** `.project .sheet { flex-shrink: 0; }` after L31. On the base, Test's gate lines measured 0 px tall on the demo's project screen at 390×844.

**Named tests** 1–5 in `tests/project/budgets-11c1.test.ts` (133/135), with titles exactly as the guide L102–106.

**Smoke** `handoff/steps/tests/s11c1-budgets/smoke.mjs`, port 8823 r1, dev maker, s10c layout. At 390 and 360:
1. All good, then the four rows.
2. 1 over, with the near and over suffixes and four `aria-hidden` meters.
3. Test and Build game blocked with the active-AI line, the sheet taller than 0 px, then near only: Test starts.

6 ok.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff c1baf1db f784e678 -- \
#     src/project/load/budgets.ts src/project/load/read-project.ts src/project/load/index.ts \
#     src/editor/project/test-gate.ts tools/maker/test-launch.ts tools/maker/export.ts \
#     tools/maker/budgets.ts tools/maker/home.ts tools/maker/app.css \
#     data/templates/demo.tileproj/project.json data/templates/empty.tileproj/project.json \
#     fixtures/demo.tileproj/project.json \
#     tests/project/budgets-11c1.test.ts handoff/steps/tests/s11c1-budgets/smoke.mjs
#
# The hand-backs and shots (not in the 400):
#   git show f784e678:handback/step-11c1-budgets/r1/HANDBACK.md
#   git show f784e678:handback/step-11c1-budgets/r2/HANDBACK.md
#
# r2 rework only:
#   git diff c57e9bf2 537479d4 -- tests tools   (budgets-11c1.test.ts 43/43, test-launch.ts 1/1)
#
# Product gate. Official command at either code head against the base
# b7acc899, or at the merge against first parent c1baf1db:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   14 files changed, 390 insertions(+), 10 deletions(-)
#
# At f784e678 against b7acc899 the same command also lists main's own
# commits after the base (data/showcase, docs, QA1); add
# ':!docs/**' ':!data/showcase/**' ':!handoff/dsk-rulings/**' to get 400 again.
# Trial r2 (0ff53324) was 382 + 11 = 393.
#
# Named tests (npm test 1175/0, floor 1170 + N=5):
#   ✔ 11c1 budgets: DSK E10 counts the stored start state: …
#   ✔ 11c1 budgets: budgetNear when warn <= used <= limit, …
#   ✔ 11c1 budgets: absent means no rows; …
#   ✔ 11c1 gate: budgetOver blocks Test and Build game …
#   ✔ 11c1 maker: the Budgets row after the stages in UX's words: …
#
# tools tsc: only effect-designer page.ts L101 and maker home.ts L92 (×2; the new import moved L91).
#
# Smokes: all 25 solo at the guide counts:
#   S0 (8797) 14, s3 (8798) 18, s4a (8799) 16, s4b (8800) 16, s4c (8801) 16,
#   s5a (8802) 16, s5b (8803) 16, s5c (8804) 16, s6a (8805) 18, s6b (8806) 16,
#   s6c (8807) 18, s6d (8808) 14, s7 (8809) 20, s8 (8810 r1) 16, s9 (8811 r1) 12,
#   s8c (8812 r1) 8, s9b (8813 r1) 14, s9c (8814 r1) 6, s10b (8815 r1) 8,
#   s10c (8816 r1) 8, s10d (8817 r1) 8, s11a (8818 r1) 6, s11a2 (8822 r1) 6,
#   s11b (8820/8821 r1) 6, s11c1 (8823 r1) 6 (3 @390, 3 @360).
# HB2: s3 step 9 at 390 missed once (17 ok), solo re-run 18 ok. CoS (V1, V2)
# and QA (QA1, QA2) ran all 25 solo with no flake. They ran s11b on 8840/8841,
# because another process on the box held 8820.
# HB1: the builder's first pass of nine smokes exited for a missing CHROME and was rerun.
#
# Mutations, builder (HB1, HB2; each restored from an in-memory snapshot):
#   C1 budgetOver before hard, C3 near above warn, C4 over at the limit → test 2;
#   C2 over never hard → tests 2–4, smoke 3;
#   test 1 (counting): C5 team ignores loadout size, C6 neutrals ignore sides.neutrals,
#     C7 effects per setup, C8 alias prefix kept, C9 "default" answer read as stored,
#     C12 weighted not capped by spawns, C13 waves as 0, C20 AI ignores the loadout
#     side, C21 allowRepeats false ignored, C22 waves summed, C23 only first wave,
#     C24 wave units out of effects, C25 waves out of activeAi;
#   C10 broken entry skipped, C11 warn 0 accepted → test 3;
#   C14 generic sentence → test 4, smoke 3; C15 Test drops names, C16 Build game drops names → test 4;
#   C17 budgetsTap doesn't flip open → test 5, smoke 1–2 (retargeted from the home.ts act line);
#   C18 near as over, C26 near loses suffix, C27 over says near, C28 meter not aria-hidden → test 5, smoke 2;
#   C19 Rule 6's CSS line removed → smoke 3 (sheet height 0 at 390 and 360).
#   In r1, C20 was planted on the pool side. In r2 it is QA's plant `const me = "player"`,
#   which fails test 1 with activeAi 4 instead of 3 (HB2; CoS reran it, V2).
# QA's own plants, 34 in all (C plants, Q1 and extra load and gate plants):
#   r1 at c57e9bf2: 28 of 34 caught (QA2's correction; QA1 said 30 of 34, but its
#   caught list was right). Survived: C20 (the sides were "player", the fallback),
#   plus the five carries below.
#   r2 at 537479d4: 29 of 34 caught (C20 now caught); the five carries still survive.
#
# Export audit: builder self-run (/tmp/self-audit.mjs, three builders) and s8-audit.mjs both
# 136 / 150 / 150, 0 hits, AUDIT PASS (11c1 adds src/project/load/budgets.ts to the play tree).
```

## (d) What went wrong, in order, and the fix

**Guide r1 → r2, before any build.**
- DSK corrected two r1 counting readings (E10a): weighted pools are also capped by `entries` without repeats, and waves count the largest single wave, not 0.
- DSK gave CN-029's readonly type shapes, kept local until CN-029 lands (EA ruling 2).
- UX's 23:05 row changes: the suffixes and the `aria-hidden` meter.
- The Budgets button moved from a 72 px `choice` card to Build game's 48 px style after the card broke s6a steps 5–6 at 390 (EA ruling 8).
- The CEO picked option A at 23:12.

**r1: L109 comma probe and other Rule 8 packs (QA1 must-fix 1).** The guide says one statement per line in new tests, and "any join or pack to fit a cap is NOT OK". r1's test packed lines:
- L12 packed 6 const bindings (SID, STAGE, MAP, AT, PID, NOW).
- L13 packed 5 (S1–S5).
- L32 packed 2 (docs, store).
- L109's Build-game probe was a comma expression, `() => (fetched = true, Promise.resolve(""))`. It was added after ChatA's own helper flagged an earlier two-statement form (HB1 § Helpers). This is the same shape as 11a's `zip.ts` comma join, which was accepted only as "not a precedent".

Unpacked, the file would have gone past both the 135 test cap and the 400 total. CoS flagged L109 and the 400/400 total in V1. QA ruled 400/400 OK as long as nothing is packed.

r2 gives every binding its own line (L12–L22, L42–L43). The probe is now `const get = mock.fn(() => Promise.resolve(""))` with `get.mock.callCount() === 0` (L107–L109). Setup was trimmed to keep the file at 133:
- `isObj` folded into `bag`.
- `uses` folded into `counts`.
- The save write folded into `if (!(…).ok) throw`.
- `kept()` takes a setter, builds the bag and returns it, so test 2 now also proves nothing is written.

QA2 ruled the folds OK (each is still one statement per line; folding a helper away isn't joining statements). The `uses` fold isn't listed in HB2 § Decisions, which QA noted only.

**r1: C20 was not really caught (QA1 must-fix 2).** Test 1 set `sides.loadout: "player"`, which is the fallback, so QA's plant `const me = "player"` (the AI ignores the loadout side) passed every test. HB1 listed C20 as caught, with a pool-side plant. r2 sets loadout and enemyPool to `"heroes"` (L50): the demo merchant stays on side `"player"` and becomes AI, so activeAi is 3. The plant now gives 4 and fails test 1.

**r1: the import re-sort (QA1 must-fix 3).** r1 re-sorted `test-launch.ts` L3's import alphabetically as well as adding `stageNames` (V1). It's cosmetic, but it was drift beyond the guide's "plus `stageNames` in each import". r2 restores `testGate, playLine, emptyBoard, stageNames`.

**The r1 plant count.** QA1 said its plants caught 30 of 34. QA2 corrected this to **28 of 34** (the caught list in QA1 was right; the pushed doc is left as it is). r2: 29 of 34.

**Other notes.**
- QA ruled the dense one-statement lines in `src/` and `tools/` OK under Rule 8 as written: the for/if/else-if in maker `budgets.ts`, `fx`'s chain, and activeAi repeating its side expression.
- QA also accepted the one-line brace-body arrows in the test for this step (`setBudgets`, `effectBehaviour`, `answer`, the two `start` callbacks; QA2 ruling 2). For later guides, QA suggests EA words Rule 8 so that a body containing a statement takes its own lines.
- The builder ran green on Node v22 (`.nvmrc` says 24), and CoS on v24.22.1; both pass.

## (e) Do it right first time

- The work is only in the 14 Build-table files. Nothing in `src/core`, `src/sim`, `src/runtime`, `src/rules`, `src/types/core-types.ts`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/maker/stage.ts`, `tests/smoke.test.ts`, the format docs, painter-proto or ui-shell. No edit to any existing test or smoke.
- One binding and one statement per line in **all** new code, tests included. No multi-binding `const` or `let`, and no comma expression, anywhere: 11a's `zip.ts` join is not a precedent. A probe that must record a call uses `mock.fn` and `callCount()`.
- When the total sits on the gate, trim honestly: fold helpers into single expressions or reshape a test helper, never pack statements. Declare every fold in § Decisions.
- A plant for "X ignores Y" needs a test value of Y that differs from the fallback. Don't set a side to the default name and call the fallback plant caught.
- Change an existing import only by adding the new name. Don't re-sort it.
- Push `budgetRows` after `hard`. The numbers live only in the three `project.json` files, and the fixture stays byte-equal to the demo template. No default, no migration, no write on save.
- Restore mutation runs from snapshots, list the plant script in § Helpers, and keep it on the box for QA.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the QA r2 review):
#   git diff f784e678 HEAD -- <the 14 files in (c)>
#   (empty)
#
# Product gate at the merge against first parent c1baf1db:
#   git diff --shortstat c1baf1db..f784e678 -- . ':!handback/**' ':!node_modules'
#   14 files changed, 390 insertions(+), 10 deletions(-)
#
# Green: npm ci && npm run green → 1175 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L92 ×2).
# Smokes: all 25 solo at the guide counts (the 24 in step-11b.md plus s11c1 6).
# Export audit: 136 / 150 / 150, AUDIT PASS.
# Fixture: git rev-parse HEAD:fixtures/demo.tileproj/project.json equals
#   HEAD:data/templates/demo.tileproj/project.json (44a2845d).
```

## QA non-blockers carried forward

- **For 11c2 or the next test touch.** These are QA plants no test catches yet (QA1, QA2):
  - Neutral `setupIds` dropped.
  - A pool on the neutral side still counted as AI.
  - `"none"` counted as an effect.
  - The summary picking the first stage instead of the busiest.
  - Roster `required` dropped. The code matches play (`project.ts` L84), but nothing tests it.
- **Code carries:**
  - The module-wide `let open` in maker `budgets.ts`: one flag for every project screen, with no per-project memory.
  - `budgetsRow` re-parses and re-reads the whole project (`parseProject` + `readProject`) on every project-screen repaint. Time the project screen on the S21 (CoS phone check, with a stage at the hard limits; record p95 in docs/qa).
  - Meter spacing: the meter sits flush against the "x of y" text (V1 shots). No CSS was allowed in 11c1; 11c2 applies the warn and error tokens to the bar.
- **Guide carries (L144–151):**
  - The 11c2 stage chip, the "Budgets for this stage" sheet and UX's warning line.
  - The Phone-like Test (E11), the 390×844 frame, the pill and auto-lite.
  - UX's toast padding (the + Add unit overlap at 390, accepted at 23:05) and the optional move of Budgets and Build game below "+ Add stage".
  - **CN-029** applies on the next step's branch, with the −3/+1 `import type` swap in `budgets.ts`.
  - `stage.overrides.setups` are not read when counting effects (DSK E10a known limit).
  - Budget editing and writing budgets into old projects are for a later step (E10).
  - Roadmap L132 (step 36): the full export reads the same budget report.
- **Process carries:**
  - QA2 suggests EA words Rule 8 in later guides so a brace body that contains a statement takes its own lines.
  - The `uses` fold isn't declared in HB2 § Decisions (noted only).
  - Port 8820 was held by another process on the box during both verifies.
- **Old carries:** the 11a, 11a2 and 11b carries stand. These include the CEO phone check of the download and Share sheet, the WebView 98+ floor, the CLI branch of `tools/apk` untested (M14, M15), `setup-sdk.sh` not re-runnable, and `platform-tools` unversioned.
- **Closed here:**
  - CEO MS-08 budgets (data, check, gate, project row).
  - DSK E8–E10 and E10a.
  - UX's 11c1 parts and UX's 23:05 row changes.
  - The base's zero-height gate sheet (Rule 6).
  - QA1 must-fixes 1–3.

## Blob check

Each file must have exactly this git blob id at `f784e678`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/project/load/budgets.ts` | `6d86efce54ff601577df14d71eafd85e164050fe` | 112 |
| `src/project/load/read-project.ts` | `d130e9e8dc47a9b968ccd6d11901646d7a587d7d` | 126 |
| `src/project/load/index.ts` | `3b73bc9d290f5b02e62e18ecfe0ceb21f2293af7` | 4 |
| `src/editor/project/test-gate.ts` | `247a94f65afec1b5184e3360e6583d1c4bbe911a` | 51 |
| `tools/maker/test-launch.ts` | `42b07a310683d6f664abf925336c79c3d42884e5` | 54 |
| `tools/maker/export.ts` | `5c5a922057529ad8ba1d815cf15d1ff7f7e48cf4` | 47 |
| `tools/maker/budgets.ts` | `84ae4e5716881cab6fdf58934cd88f882da7b998` | 39 |
| `tools/maker/home.ts` | `a4dd506fbe1555c2f5fc09c275ba41f785c4cd10` | 227 |
| `tools/maker/app.css` | `8098e69beb5d645a6f2ed72791e3816f01ebddbf` | 58 |
| `data/templates/demo.tileproj/project.json` | `44a2845da250e949173bb9ca7ebf72c04eba773e` | 54 |
| `data/templates/empty.tileproj/project.json` | `8c322e0d87e975b8664b8eddd141a75e29068784` | 33 |
| `fixtures/demo.tileproj/project.json` | `44a2845da250e949173bb9ca7ebf72c04eba773e` | 54 |
| `tests/project/budgets-11c1.test.ts` | `dcc0e1c031afc7f1fa6b81015826de07aa38a0de` | 133 |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | `934503095e6917cbac7bf19beb0702a35090309f` | 49 |

## Appendix: full code as merged (step 11c1, PR #112)

New files are `git show f784e678:<path>` in full. Edited files are `git diff c1baf1db f784e678 -- <path>`, which is the same as against the base `b7acc899`.

### `src/project/load/budgets.ts` (new)

```ts
import type { ProjectStore, ReportRow } from "./types.ts";
/** Local copies of CN-029's three types. They become one import from core-types when CN-029 lands. */
export type BudgetKey = "units" | "activeAi" | "effects" | "stageTiles";
export type BudgetLimit = { readonly warn: number; readonly limit: number };
export type ProjectBudgets = Partial<Readonly<Record<BudgetKey, BudgetLimit>>>;
export type BudgetUse = { readonly stageId: string; readonly budget: BudgetKey; readonly used: number; readonly warn: number; readonly limit: number; readonly w?: number; readonly h?: number };
const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const objs = (v: unknown): readonly Obj[] => list(v).filter(isObj);
const bad = (path: string, value: unknown): ReportRow => ({ code: "budgetInvalid", severity: "warning", path, detail: JSON.stringify(value) });
const whole = (v: unknown, min: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= min;
function limitsOf(project: Obj): { readonly limits: ProjectBudgets; readonly rows: readonly ReportRow[] } {
  const settings = isObj(project["settings"]) ? project["settings"] : undefined;
  if (settings === undefined || !Object.hasOwn(settings, "budgets")) return { limits: {}, rows: [] };
  const value = settings["budgets"];
  if (!isObj(value)) return { limits: {}, rows: [bad("project.json#/project/settings/budgets", value)] };
  const rows: ReportRow[] = [];
  const pairs: [BudgetKey, BudgetLimit][] = [];
  for (const key of KEYS) {
    if (!Object.hasOwn(value, key)) continue;
    const entry = value[key];
    const warn = isObj(entry) ? entry["warn"] : undefined;
    const limit = isObj(entry) ? entry["limit"] : undefined;
    if (!whole(warn, 1) || !whole(limit, warn)) rows.push(bad(`project.json#/project/settings/budgets/${key}`, entry));
    else pairs.push([key, { warn, limit }]);
  }
  return { limits: Object.fromEntries(pairs), rows };
}
function placed(pool: Obj): number {
  if (pool["mode"] === "fixed") return objs(pool["entries"]).length;
  if (pool["mode"] === "weighted") return Math.min(typeof pool["picks"] === "number" ? pool["picks"] : 0, list(pool["spawns"]).length, pool["allowRepeats"] === false ? list(pool["entries"]).length : Number.POSITIVE_INFINITY);
  if (pool["mode"] !== "waves") return 0;
  let best = 0;
  for (const wave of objs(pool["waves"])) {
    let sum = 0;
    for (const entry of objs(wave["entries"])) if (typeof entry["count"] === "number") sum += entry["count"];
    if (sum > best) best = sum;
  }
  return best;
}
function fx(setup: Obj, store: ProjectStore): string | null {
  const slice = isObj(store.slice) ? store.slice : {};
  const hit = isObj(setup["answers"]) ? setup["answers"]["effect"] : undefined;
  const direct = isObj(hit) && hit["source"] !== "default" && Object.hasOwn(hit, "value");
  let value: unknown = direct && isObj(hit) ? hit["value"] : undefined;
  if (!direct) for (const item of objs(slice["behaviours"])) if (item["id"] === setup["behaviourId"]) for (const spec of objs(item["knobs"])) if (spec["id"] === "effect" && value === undefined) value = spec["default"];
  if (typeof value !== "string" || value === "none") return null;
  if (Object.hasOwn(store.effects, value)) return value;
  const id = value.startsWith("builtin:effect/") ? value.slice("builtin:effect/".length) : value;
  for (const item of objs(slice["behaviours"])) if (item["id"] === "effect") for (const preset of objs(item["presets"])) if (preset["id"] === id) return id;
  return null;
}
function effectCount(store: ProjectStore, stage: Obj, gear: Obj, team: number, pool: Obj, n: number): number {
  const units = new Set<string>();
  const add = (id: unknown): void => { if (typeof id === "string") units.add(id); };
  if (team > 0) for (const id of [...list(gear["roster"]), ...list(gear["required"])]) add(id);
  if (n > 0 && (pool["mode"] === "fixed" || pool["mode"] === "weighted")) for (const entry of objs(pool["entries"])) add(entry["unitId"]);
  if (n > 0 && pool["mode"] === "waves") for (const wave of objs(pool["waves"])) for (const entry of objs(wave["entries"])) add(entry["unitId"]);
  const neutrals = objs(stage["neutrals"]);
  for (const neutral of neutrals) add(neutral["unitId"]);
  const setups = new Set<string>();
  for (const id of units) for (const sid of list(store.units[id]?.["setupIds"])) if (typeof sid === "string") setups.add(sid);
  for (const neutral of neutrals) for (const sid of list(neutral["setupIds"])) if (typeof sid === "string") setups.add(sid);
  const found = new Set<string>();
  for (const sid of setups) {
    const setup = store.setups[sid];
    const id = setup === undefined ? null : fx(setup, store);
    if (id !== null) found.add(id);
  }
  return found.size;
}
export function budgetUse(store: ProjectStore): BudgetUse[] {
  const project = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const { limits } = limitsOf(project);
  const out: BudgetUse[] = [];
  for (const [stageId, stage] of Object.entries(store.stages)) {
    const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
    const team = Math.min(typeof gear["size"] === "number" ? gear["size"] : 0, list(stage["playerSpawns"]).length);
    const sides = isObj(stage["sides"]) ? stage["sides"] : {};
    const me = typeof sides["loadout"] === "string" ? sides["loadout"] : "player";
    const poolSide = typeof sides["enemyPool"] === "string" ? sides["enemyPool"] : "rival";
    const neutralSide = typeof sides["neutrals"] === "string" ? sides["neutrals"] : "neutral";
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    const n = placed(pool);
    const neutrals = objs(stage["neutrals"]);
    let activeAi = poolSide !== me && poolSide !== "neutral" ? n : 0;
    for (const neutral of neutrals) if ((typeof neutral["side"] === "string" ? neutral["side"] : neutralSide) !== me && (typeof neutral["side"] === "string" ? neutral["side"] : neutralSide) !== "neutral") activeAi += 1;
    const units = team + n + neutrals.length;
    const effects = effectCount(store, stage, gear, team, pool, n);
    const map = typeof stage["mapRef"] === "string" ? store.maps[stage["mapRef"]] : undefined;
    const w = map !== undefined && typeof map["cols"] === "number" ? map["cols"] : undefined;
    const h = map !== undefined && typeof map["rows"] === "number" ? map["rows"] : undefined;
    for (const key of KEYS) {
      const lim = limits[key];
      if (lim === undefined || (key === "stageTiles" && (w === undefined || h === undefined))) continue;
      if (key === "stageTiles" && w !== undefined && h !== undefined) out.push({ stageId, budget: key, used: w * h, warn: lim.warn, limit: lim.limit, w, h });
      if (key !== "stageTiles") out.push({ stageId, budget: key, used: key === "units" ? units : key === "activeAi" ? activeAi : effects, warn: lim.warn, limit: lim.limit });
    }
  }
  return out;
}
export function budgetRows(store: ProjectStore): ReportRow[] {
  const rows: ReportRow[] = [...limitsOf(isObj(store.manifest["project"]) ? store.manifest["project"] : {}).rows];
  for (const use of budgetUse(store)) {
    if (use.used < use.warn) continue;
    const over = use.used > use.limit;
    rows.push({ code: over ? "budgetOver" : "budgetNear", severity: over ? "hard" : "warning", path: `stages/${use.stageId}.json#`, detail: use.w === undefined || use.h === undefined ? JSON.stringify({ budget: use.budget, used: use.used, limit: use.limit }) : JSON.stringify({ budget: use.budget, used: use.used, limit: use.limit, w: use.w, h: use.h }) });
  }
  return rows;
}
```

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index 6d2e2fe..d130e9e 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -1,5 +1,6 @@
 import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
 import { mapEntryDrops, placementDrops } from "./drops.ts";
+import { budgetRows } from "./budgets.ts";
 import { migrateProject, versionRows } from "./migrate.ts";
 import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";
 
@@ -120,5 +121,6 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
   const hard = rows.some((r) => r.severity === "hard");
   const store: ProjectStore = { manifest, slice, maps, stages, units, setups, effects, unknownFiles };
+  rows.push(...budgetRows(store)); // budgetOver blocks only through testGate, never ok (E9)
   return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
 }
```

### `src/project/load/index.ts` (edited)

```diff
diff --git a/src/project/load/index.ts b/src/project/load/index.ts
index 6097004..3b73bc9 100644
--- a/src/project/load/index.ts
+++ b/src/project/load/index.ts
@@ -1,3 +1,4 @@
 export type { BehaviourSetup, CatalogueSlice, GameMap, ProjectFiles, ProjectLoad, ProjectManifest, ProjectStore, ReportRow, Severity, Stage, Unit } from "./types.ts";
 export { migrateProject } from "./migrate.ts";
 export { readProject } from "./read-project.ts";
+export { budgetUse, type BudgetKey, type BudgetUse } from "./budgets.ts";
```

### `src/editor/project/test-gate.ts` (edited)

```diff
diff --git a/src/editor/project/test-gate.ts b/src/editor/project/test-gate.ts
index ec76113..247a94f 100644
--- a/src/editor/project/test-gate.ts
+++ b/src/editor/project/test-gate.ts
@@ -20,9 +20,32 @@ const placed = (v: unknown): number => (Array.isArray(v) ? v.filter((row) => typ
 /** No team unit on a start tile, no NPC and no enemy. One side only still plays. */
 export const emptyBoard = (docs: { readonly stage: unknown; readonly chosen?: readonly string[] }): boolean => { const stage = docs.stage; if (typeof stage !== "object" || stage === null) return true; const doc = stage as Record<string, unknown>, pool = doc["enemyPool"]; return Math.min(docs.chosen?.length ?? 0, placed(doc["playerSpawns"])) === 0 && placed(doc["neutrals"]) === 0 && placed(typeof pool === "object" && pool !== null ? (pool as Record<string, unknown>)["entries"] : undefined) === 0; };
 export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
+export function budgetLine(budget: string, stage: string, used: number, limit: number, w?: number, h?: number): string {
+  if (budget === "units") return `${stage}: ${used} units. The limit is ${limit}. Remove some units.`;
+  if (budget === "activeAi") return `${stage}: ${used} units take AI turns. The limit is ${limit}. Remove some or put them on your team.`;
+  if (budget === "effects") return `${stage}: ${used} effects. The limit is ${limit}. Remove some effects.`;
+  if (budget === "stageTiles") return `${stage} is ${w} × ${h} tiles. The limit is ${limit} tiles. Make the map smaller.`;
+  return `Can't play: budgetOver ${budget}`;
+}
+const OVER = /"budget":"([^"]+)","used":(\d+),"limit":(\d+)(?:,\"w\":(\d+),\"h\":(\d+))?/;
+export function overLine(row: ReportRow, names: Readonly<Record<string, string>>): string {
+  const found = /^stages\/([^/]+)\.json#$/.exec(row.path);
+  const id = found?.[1] ?? "";
+  const stage = names[id] ?? id;
+  const hit = OVER.exec(row.detail ?? "");
+  if (hit === null) return "Can't play: budgetOver";
+  return budgetLine(hit[1] ?? "", stage, Number(hit[2]), Number(hit[3]), hit[4] === undefined ? undefined : Number(hit[4]), hit[5] === undefined ? undefined : Number(hit[5]));
+}
+export function stageNames(load: { readonly project: { readonly stages: Readonly<Record<string, Readonly<Record<string, unknown>>>> } | null }): Readonly<Record<string, string>> {
+  const names: Record<string, string> = {};
+  const stages = load.project === null ? undefined : load.project.stages;
+  if (stages === undefined) return names;
+  for (const [id, stage] of Object.entries(stages)) names[id] = typeof stage["name"] === "string" ? stage["name"] : id;
+  return names;
+}
 /** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
-export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
-  const lines = report.filter((row) => row.severity === "hard").map(sentence);
+export function testGate(report: readonly ReportRow[], readOnly: boolean, names: Readonly<Record<string, string>> = {}): TestGate {
+  const lines = report.filter((row) => row.severity === "hard").map((row) => (row.code === "budgetOver" ? overLine(row, names) : sentence(row)));
   if (!readOnly && lines.length === 0) return { allowed: true };
   return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
 }
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index 01b478a..42b07a3 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -1,6 +1,6 @@
 import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
-import { testGate, playLine, emptyBoard } from "../../src/editor/project/test-gate.ts";
+import { testGate, playLine, emptyBoard, stageNames } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { startOf } from "../../src/editor/stage/rooms.ts";
 import { settleSession } from "../../src/project/read/session.ts";
@@ -28,7 +28,7 @@ function resumed(files: Parameters<typeof openProject>[0], save: SessionSave): {
 async function play(input: LaunchBag, text: DocText): Promise<Launch> {
   const parsed = parseProject(text);
   if (!parsed.ok) return fail([parsed.message], text, 0);
-  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly), rev = storedRev(parsed.files);
+  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load)), rev = storedRev(parsed.files);
   if (!gate.allowed) return fail(gate.lines, text, rev);
   const opened = input.resume === undefined ? (input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId)) : resumed(parsed.files, input.resume);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
```

### `tools/maker/export.ts` (edited)

```diff
diff --git a/tools/maker/export.ts b/tools/maker/export.ts
index 0a92377..5c5a922 100644
--- a/tools/maker/export.ts
+++ b/tools/maker/export.ts
@@ -1,5 +1,5 @@
 import { prefix } from "../../src/editor/project/home.ts";
-import { emptyBoard, playLine, testGate } from "../../src/editor/project/test-gate.ts";
+import { emptyBoard, playLine, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { gameZip } from "../export/game.ts";
 import { openProject } from "../play-stage/project.ts";
@@ -25,7 +25,7 @@ export async function buildGame(store: MakerStore, id: string, get: (path: strin
   if (!parsed.ok) return { ok: false, lines: [parsed.message] };
   const load = readProject(parsed.files);
   const rows = await assetRows(store, prefix(id), parsed.files);
-  const gate = testGate([...load.report, ...rows], load.readOnly);
+  const gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load));
   if (!gate.allowed) return { ok: false, lines: gate.lines };
   const opened = openProject(parsed.files);
   if (opened.docs === null) return { ok: false, lines: [playLine(opened.error)] };
```

### `tools/maker/budgets.ts` (new)

```ts
import { budgetUse, readProject, type BudgetKey, type BudgetUse } from "../../src/project/load/index.ts";
import { parseProject } from "./project-files.ts";
const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
const LABEL: Readonly<Record<BudgetKey, string>> = { units: "Units", activeAi: "Active AI", effects: "Effects", stageTiles: "Stage size" };
let open = false;
export function budgetsTap(paint: () => void): void {
  open = !open;
  paint();
}
function picked(files: Readonly<Record<string, string>>): BudgetUse[] {
  const parsed = parseProject(files);
  if (!parsed.ok) return [];
  const load = readProject(parsed.files);
  if (load.project === null) return [];
  const all = budgetUse(load.project);
  const rows: BudgetUse[] = [];
  for (const key of KEYS) {
    let best: BudgetUse | undefined;
    for (const use of all) if (use.budget === key && (best === undefined || use.used > best.used)) best = use;
    if (best !== undefined) rows.push(best);
  }
  return rows;
}
function rowHtml(use: BudgetUse): string {
  const mark = use.used > use.limit ? " · over limit" : use.used >= use.warn ? " · near limit" : "";
  const max = Math.max(use.used, use.limit);
  const meter = `<meter min="0" max="${max}" low="${use.warn - 0.5}" high="${use.limit + 0.5}" optimum="0" value="${use.used}" aria-hidden="true"></meter>`;
  return `<p class="budget" data-budget="${use.budget}"><span>${LABEL[use.budget]}</span> <span>${use.used} of ${use.limit}${mark}</span>${meter}</p>`;
}
export function budgetsRow(files: Readonly<Record<string, string>>): string {
  const rows = picked(files);
  if (rows.length === 0) return "";
  let over = 0;
  let near = 0;
  for (const use of rows) if (use.used > use.limit) over += 1; else if (use.used >= use.warn) near += 1;
  const summary = over > 0 ? `Budgets: ${over} over the limit` : near > 0 ? `Budgets: ${near} near the limit` : "Budgets: all good";
  const body = open ? rows.map(rowHtml).join("") : "";
  return `<div class="budgets" data-budgets><button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="${open ? "true" : "false"}">${summary}</button>${body}</div>`;
}
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 4a5cb58..a4dd506 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -4,6 +4,7 @@ import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
+import { budgetsRow, budgetsTap } from "./budgets.ts";
 import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
 import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
@@ -44,7 +45,7 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${budgetsRow(state.files)}${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -158,6 +159,7 @@ async function run(act: string): Promise<void> {
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
+  if (act === "budgets") return budgetsTap(paint);
   if (act.startsWith("open:")) forgetBuild();
   if (act === "build:share") return shareBuild();
   if (act === "build:done") return closeBuild();
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index a88dd5c..8098e69 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -29,6 +29,7 @@ input.name-field { width: 100%; box-sizing: border-box; min-height: 48px; border
 .dot { display: inline-block; width: 8px; height: 8px; margin-left: 6px; border-radius: 999px; background: var(--accent); }
 .project .sheet { position: static; width: auto; max-height: none; box-shadow: none; padding: 0; border-radius: 0; background: transparent; }
 .project .sheet p { margin: 0; }
+.project .sheet { flex-shrink: 0; }
 :focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
 @media (min-width: 421px) {
   body { min-height: 100dvh; display: grid; place-items: center; }
```

### `data/templates/demo.tileproj/project.json` (edited)

```diff
diff --git a/data/templates/demo.tileproj/project.json b/data/templates/demo.tileproj/project.json
index 3061fc3..44a2845 100644
--- a/data/templates/demo.tileproj/project.json
+++ b/data/templates/demo.tileproj/project.json
@@ -10,7 +10,13 @@
     "copiedFrom": null,
     "catalogueRev": 30,
     "settings": {
-      "wrapEdges": false
+      "wrapEdges": false,
+      "budgets": {
+        "units": { "warn": 40, "limit": 80 },
+        "activeAi": { "warn": 12, "limit": 24 },
+        "effects": { "warn": 8, "limit": 12 },
+        "stageTiles": { "warn": 16384, "limit": 65536 }
+      }
     },
     "difficulty": {
       "hp": 1,
```

### `data/templates/empty.tileproj/project.json` (edited)

```diff
diff --git a/data/templates/empty.tileproj/project.json b/data/templates/empty.tileproj/project.json
index 950fb1d..8c322e0 100644
--- a/data/templates/empty.tileproj/project.json
+++ b/data/templates/empty.tileproj/project.json
@@ -10,7 +10,13 @@
     "copiedFrom": null,
     "catalogueRev": 30,
     "settings": {
-      "wrapEdges": false
+      "wrapEdges": false,
+      "budgets": {
+        "units": { "warn": 40, "limit": 80 },
+        "activeAi": { "warn": 12, "limit": 24 },
+        "effects": { "warn": 8, "limit": 12 },
+        "stageTiles": { "warn": 16384, "limit": 65536 }
+      }
     },
     "stages": [
       "stage_01JDEM00000000000000000003"
```

### `fixtures/demo.tileproj/project.json` (edited)

```diff
diff --git a/fixtures/demo.tileproj/project.json b/fixtures/demo.tileproj/project.json
index 3061fc3..44a2845 100644
--- a/fixtures/demo.tileproj/project.json
+++ b/fixtures/demo.tileproj/project.json
@@ -10,7 +10,13 @@
     "copiedFrom": null,
     "catalogueRev": 30,
     "settings": {
-      "wrapEdges": false
+      "wrapEdges": false,
+      "budgets": {
+        "units": { "warn": 40, "limit": 80 },
+        "activeAi": { "warn": 12, "limit": 24 },
+        "effects": { "warn": 8, "limit": 12 },
+        "stageTiles": { "warn": 16384, "limit": 65536 }
+      }
     },
     "difficulty": {
       "hp": 1,
```

### `tests/project/budgets-11c1.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { prefix } from "../../src/editor/project/home.ts";
import { asWrites } from "../../src/editor/project/save.ts";
import { stageNames, testGate } from "../../src/editor/project/test-gate.ts";
import { budgetUse, readProject } from "../../src/project/load/index.ts";
import { budgetsRow, budgetsTap } from "../../tools/maker/budgets.ts";
import { buildGame } from "../../tools/maker/export.ts";
import { commitWrites, memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const SID = "stage_01JDAS00000000000000000001";
const STAGE = `stages/${SID}.json`;
const MAP = "maps/map_01JDAM00000000000000000001.json";
const AT = `stages/${SID}.json#`;
const PID = "project_01JDAP00000000000000000001";
const NOW = "2026-11-26T12:00:00.000Z";
const S1 = "setup_01JDAT00000000000000000001";
const S2 = "setup_01JDAT00000000000000000002";
const S3 = "setup_01JDAT00000000000000000003";
const S4 = "setup_01JDAT00000000000000000004";
const S5 = "setup_01JDAT00000000000000000005";
type Obj = Record<string, unknown>;
const bag = (): Record<string, Obj> => Object.fromEntries(Object.entries(loadFixture()).flatMap(([k, v]) => (typeof v === "object" && v !== null && !Array.isArray(v) ? [[k, structuredClone(v) as Obj]] : [])));
const project = (files: Record<string, Obj>): Obj => (files["project.json"] as Obj)["project"] as Obj;
const stageOf = (files: Record<string, Obj>): Obj => files[STAGE] as Obj;
const setBudgets = (files: Record<string, Obj>, value: unknown): void => { (project(files)["settings"] as Obj)["budgets"] = value; };
const effectBehaviour = (files: Record<string, Obj>): void => { ((files["catalogue/slice.json"] as Obj)["behaviours"] as Obj[]).push({ id: "effect", presets: [{ id: "spark" }, { id: "glow" }, { id: "boom" }] }); };
const answer = (files: Record<string, Obj>, id: string, source: string, value: string): void => { ((files[`setups/${id}.json`] as Obj)["answers"] as Obj)["effect"] = { source, value }; };
const counts = (files: Record<string, Obj>): string => budgetUse(readProject(files).project as Exclude<ReturnType<typeof readProject>["project"], null>).map((row) => `${row.budget}:${row.used}${row.w === undefined ? "" : `:${String(row.w)}x${String(row.h)}`}`).join(" ");
const text = (files: Record<string, Obj>): Record<string, string> => Object.fromEntries(Object.entries(files).map(([k, v]) => [k, JSON.stringify(v)]));
const flat = (files: Record<string, Obj>): string[] => readProject(files).report.filter((row) => row.code.startsWith("budget")).map((row) => `${row.code}|${row.severity}|${row.path}|${row.detail ?? ""}`);
function kept(set: (files: Record<string, Obj>) => void, expect: readonly string[]): Record<string, Obj> {
  const files = bag();
  set(files);
  const snap = structuredClone(files);
  assert.deepEqual(flat(files), expect);
  assert.deepEqual(files, snap);
  return files;
}
async function save(files: Record<string, Obj>): Promise<{ store: MakerStore; docs: Record<string, string> }> {
  const docs = text(files);
  const store = memoryStore();
  if (!(await commitWrites(store, prefix(PID), asWrites(docs))).ok) throw new Error("save");
  return { store, docs };
}
test("11c1 budgets: DSK E10 counts the stored start state: team min(loadout size, start tiles), enemy pool placements (weighted capped by spawns and, without repeats, entries; waves by the largest wave), every neutral; AI by the effective sides; distinct resolved effects (wave units too); map cols x rows", () => {
  const files = bag();
  assert.equal(counts(files), "units:7 activeAi:2 effects:0 stageTiles:54:6x9");
  stageOf(files)["sides"] = { loadout: "heroes", enemyPool: "heroes", neutrals: "wolves" };
  assert.equal(counts(files), "units:7 activeAi:3 effects:0 stageTiles:54:6x9");
  stageOf(files)["loadout"] = { size: 1, roster: [U.knight], required: [U.knight] };
  assert.equal(counts(files), "units:6 activeAi:3 effects:0 stageTiles:54:6x9");
  const pool = bag();
  stageOf(pool)["neutrals"] = [];
  stageOf(pool)["playerSpawns"] = [];
  stageOf(pool)["loadout"] = { size: 0, roster: [U.archer], required: [] };
  stageOf(pool)["enemyPool"] = { mode: "weighted", picks: 5, allowRepeats: true, entries: [{ unitId: U.wolf, weight: 1 }], spawns: [{ c: 0, r: 0 }, { c: 1, r: 0 }, { c: 2, r: 0 }] };
  assert.equal(counts(pool), "units:3 activeAi:3 effects:0 stageTiles:54:6x9");
  (stageOf(pool)["enemyPool"] as Obj)["allowRepeats"] = false;
  assert.equal(counts(pool), "units:1 activeAi:1 effects:0 stageTiles:54:6x9");
  stageOf(pool)["enemyPool"] = { mode: "waves", waves: [{ entries: [{ unitId: U.archer, count: 4 }] }, { entries: [{ unitId: U.wolf, count: 2 }, { unitId: U.archer, count: 3 }] }] };
  (pool[`units/${U.wolf}.json`] as Obj)["setupIds"] = [S1, S2, S3];
  effectBehaviour(pool);
  answer(pool, S5, "user", "spark");
  answer(pool, S4, "user", "builtin:effect/spark");
  answer(pool, S1, "user", "builtin:effect/glow");
  answer(pool, S2, "user", "nope");
  answer(pool, S3, "default", "boom");
  (pool[MAP] as Obj)["cols"] = 300;
  (pool[MAP] as Obj)["rows"] = 2;
  assert.equal(counts(pool), "units:5 activeAi:5 effects:2 stageTiles:600:300x2");
});
test("11c1 budgets: budgetNear when warn <= used <= limit, budgetOver (hard) above and replacing near, at stages/<id>.json# with detail {budget, used, limit[, w, h]}; ok stays true", () => {
  const files = kept((doc) => setBudgets(doc, { units: { warn: 7, limit: 7 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 1, limit: 12 }, stageTiles: { warn: 54, limit: 54 } }), [
    `budgetNear|warning|${AT}|${JSON.stringify({ budget: "units", used: 7, limit: 7 })}`,
    `budgetNear|warning|${AT}|${JSON.stringify({ budget: "stageTiles", used: 54, limit: 54, w: 6, h: 9 })}`,
    `budgetOver|hard|${AT}|${JSON.stringify({ budget: "activeAi", used: 2, limit: 1 })}`,
  ]);
  assert.equal(readProject(files).ok && readProject(files).readOnly === false, true);
});
test("11c1 budgets: absent means no rows; a partial object checks only its keys; a broken entry is one budgetInvalid warning and isn't checked; unknown keys are ignored; nothing is written", () => {
  kept((files) => delete (project(files)["settings"] as Obj)["budgets"], []);
  kept((files) => setBudgets(files, { units: { warn: 1, limit: 1 }, extra: { warn: 1, limit: 1 } }), [`budgetOver|hard|${AT}|${JSON.stringify({ budget: "units", used: 7, limit: 1 })}`]);
  kept((files) => setBudgets(files, { units: { warn: 0, limit: 1 }, activeAi: { warn: 5, limit: 4 }, effects: { warn: 1.5, limit: 2 }, stageTiles: { warn: 1, limit: 1 }, extra: 1 }), [
    `budgetInvalid|warning|project.json#/project/settings/budgets/activeAi|${JSON.stringify({ warn: 5, limit: 4 })}`,
    `budgetInvalid|warning|project.json#/project/settings/budgets/effects|${JSON.stringify({ warn: 1.5, limit: 2 })}`,
    `budgetInvalid|warning|project.json#/project/settings/budgets/units|${JSON.stringify({ warn: 0, limit: 1 })}`,
    `budgetOver|hard|${AT}|${JSON.stringify({ budget: "stageTiles", used: 54, limit: 1, w: 6, h: 9 })}`,
  ]);
  kept((files) => setBudgets(files, 5), ["budgetInvalid|warning|project.json#/project/settings/budgets|5"]);
});
test("11c1 gate: budgetOver blocks Test and Build game with UX's line named by the stage; budgetNear never blocks", async () => {
  const over = bag();
  effectBehaviour(over);
  answer(over, S4, "user", "spark");
  answer(over, S5, "user", "glow");
  setBudgets(over, { units: { warn: 1, limit: 6 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 1, limit: 1 }, stageTiles: { warn: 1, limit: 50 } });
  const load = readProject(over);
  const want = ["Demo stage: 7 units. The limit is 6. Remove some units.", "Demo stage: 2 units take AI turns. The limit is 1. Remove some or put them on your team.", "Demo stage: 2 effects. The limit is 1. Remove some effects.", "Demo stage is 6 \u00d7 9 tiles. The limit is 50 tiles. Make the map smaller."];
  const gate = testGate(load.report, load.readOnly, stageNames(load));
  assert.deepEqual(gate.allowed ? [] : [...gate.lines], want);
  let started = false;
  const saved = await save(over);
  const launched = await launchTest({ store: saved.store, id: PID, from: "project", start: () => { started = true; }, stored: saved.docs, next: saved.docs, rev: 1, now: NOW });
  assert.deepEqual(launched.ok || started ? [] : [...launched.lines], want);
  const get = mock.fn(() => Promise.resolve(""));
  const built = await buildGame(saved.store, PID, get);
  assert.equal(get.mock.callCount(), 0);
  assert.deepEqual(built.ok ? [] : [...built.lines], want);
  const near = bag();
  setBudgets(near, { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  const nearSave = await save(near);
  let began = false;
  const played = await launchTest({ store: nearSave.store, id: PID, from: "project", start: () => { began = true; }, stored: nearSave.docs, next: nearSave.docs, rev: 1, now: NOW });
  assert.equal(began && played.ok, true);
});
test("11c1 maker: the Budgets row after the stages in UX's words: one summary line, and on tap the four rows with used of limit, a near or over suffix and an aria-hidden meter", () => {
  const files = bag();
  const view = (): string => budgetsRow(text(files));
  assert.equal(view().includes("Budgets: all good") && view().includes("btn ghost stage-row") && !view().includes('data-budget="'), true);
  budgetsTap(() => undefined);
  const open = view();
  assert.equal(open.includes('aria-expanded="true"') && ["Units</span> <span>7 of 80</span>", "Active AI</span> <span>2 of 24</span>", "Effects</span> <span>0 of 12</span>", "Stage size</span> <span>54 of 65536</span>"].every((bit) => open.includes(bit)) && !open.includes("\u00b7") && open.split('aria-hidden="true"').length === 5, true);
  assert.ok(open.indexOf('data-budget="units"') < open.indexOf('data-budget="activeAi"') && open.indexOf('data-budget="activeAi"') < open.indexOf('data-budget="effects"') && open.indexOf('data-budget="effects"') < open.indexOf('data-budget="stageTiles"'));
  setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  assert.equal(view().includes("Budgets: 1 over the limit") && view().includes("7 of 9 \u00b7 near limit") && view().includes("2 of 1 \u00b7 over limit") && view().includes("0 of 12</span>") && view().split('aria-hidden="true"').length === 5, true);
  setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
  assert.equal(view().includes("Budgets: 1 near the limit"), true);
  const clear = bag();
  delete (project(clear)["settings"] as Obj)["budgets"];
  assert.equal(budgetsRow(text(clear)), "");
});
```

### `handoff/steps/tests/s11c1-budgets/smoke.mjs` (new)

```js
// Step 11c1 budgets. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11c1-budgets/smoke.mjs . 8823 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8823", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11c1-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-11c1-budgets/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const LINE = "Demo stage: 2 units take AI turns. The limit is 1. Remove some or put them on your team.";
const OVER = { units: { warn: 7, limit: 9 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } }, NEAR = { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } };
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const putBudgets = (page, budgets) => page.evaluate(async (budgets) => { const id = JSON.parse(window.__read()["project.json"]).project.id, rel = "project.json", root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const handle = await dir.getFileHandle(leaf), raw = JSON.parse(await (await handle.getFile()).text()); raw.project.settings.budgets = budgets; const text = JSON.stringify(raw); const w = await handle.createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, budgets);
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`), scale: "css" }); };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    await step("1 all good", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="budgets"]')?.textContent?.includes("Budgets: all good"), null, { timeout: 15000 });
      const pos = await page.evaluate(() => document.querySelector("[data-budgets]")?.nextElementSibling?.getAttribute("data-act") ?? ""); if (pos !== "build") throw new Error(pos || "no row"); await tap(page, "budgets");
      const got = await page.waitForFunction(() => { const rows = [...document.querySelectorAll("p.budget")].map((p) => `${p.textContent}|${p.querySelector("meter")?.getAttribute("aria-hidden")}`); return rows.length === 4 ? rows : null; }, null, { timeout: 15000 }); const rows = await got.jsonValue();
      if (JSON.stringify(rows) !== JSON.stringify(["Units 7 of 80|true", "Active AI 2 of 24|true", "Effects 0 of 12|true", "Stage size 54 of 65536|true"])) throw new Error(JSON.stringify(rows));
      await tap(page, "budgets"); await page.waitForFunction(() => document.querySelector("p.budget") === null && document.querySelector('[data-act="budgets"]')?.getAttribute("aria-expanded") === "false", null, { timeout: 15000 });
    });
    await step("2 over", async () => {
      await putBudgets(page, OVER); await page.waitForFunction(() => document.querySelector('[data-act="budgets"]')?.textContent === "Budgets: 1 over the limit", null, { timeout: 15000 }); await shot("01-budgets-collapsed"); await tap(page, "budgets");
      await page.waitForFunction(() => { const u = document.querySelector('[data-budget="units"]')?.textContent ?? "", a = document.querySelector('[data-budget="activeAi"]')?.textContent ?? "", e = document.querySelector('[data-budget="effects"]')?.textContent ?? ""; return u.includes("7 of 9 · near limit") && a.includes("2 of 1 · over limit") && e.includes("0 of 12") && !e.includes("·") && document.querySelectorAll('meter[aria-hidden="true"]').length === 4; }, null, { timeout: 15000 }); await shot("02-budgets-expanded");
    });
    await step("3 gate", async () => {
      await page.evaluate(() => { delete window.__play; }); await tap(page, "test");
      await page.waitForFunction((line) => document.body.innerText.includes("Can't play yet") && document.body.innerText.includes(line) && window.__play === undefined, LINE, { timeout: 15000 }); const h = await page.evaluate(() => document.querySelector(".project .sheet")?.getBoundingClientRect().height ?? 0); if (!(h > 0)) throw new Error(`sheet ${h}`); await shot("03-gate-budget");
      await tap(page, "fix"); await page.waitForFunction(() => !document.body.innerText.includes("Can't play yet"), null, { timeout: 15000 }); await tap(page, "build");
      await page.waitForFunction((line) => document.body.innerText.includes(line) && document.querySelector('[data-sheet="build"]') === null && document.querySelector('[data-act="build"]')?.getAttribute("aria-busy") !== "true", LINE, { timeout: 15000 });
      await putBudgets(page, NEAR); await tap(page, "fix"); await page.evaluate(() => { delete window.__play; }); await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
