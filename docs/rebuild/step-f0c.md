# Rebuild record: step F0c, carries (CN-029 lands in core-types, and the pools gate: Test and Build game refuse a stage play can't open)

Original brief: [`docs/maker/steps/step-f0c-carries.md`](../maker/steps/step-f0c-carries.md) on the merge (kit r2, blob `bf6434e4`, sha256 `6c2e5a6328e163c6021a5165b2c552293d019c8731c1318a0f1a0a878fde56e7`, 165 lines). Base L5; Delivery L7; Depends on L9; Kit L14; Carries L15; Goal L19; Placement card L24; Rulings L34 (1 CN-029, 2 budgets.ts swap, 3 one cap pair, 4 what the gate refuses, 5 the line, 6 not a report row, 7 Rule 8); Files L43; Size L57 (table L59–L73); Interfaces L77; Smoke lines L92; Existing tests changed L95; Shipped tests L98; Plants L111–L113; Example L115; Decisions note L118; Do not touch L125; Acceptance L129; Carries L142; Out of scope L158; Open questions L163. Count command L57 (QA's G7); hard gate 400 (L136); per-file caps in the Size table (caps sum 191; trial 187). Go-line paste `/workspace/share/f0c/step-f0c-paste.md` (box only, not in the repo; sha256 `493ebd43ee4e86c69fe13d5c6125a5ed7285bb680d3e205f0f842c33221a9fd9`, 10 lines). Shipped test `handoff/steps/tests/step-f0c-carries/tests/project/f0c-carries.test.ts` (blob `df4b9a11`, sha256 `870970073f2d…0479`, 121 lines) and plants `handoff/steps/tests/step-f0c-carries/plants-f0c.py` (blob `59ebaac7`, sha256 `39f67d7b00f6f2b27d1d0e76d8bf6afb52c243b8de0acf5e0cb193a834ab730f`, 34 lines). CN-029 staged by DSK in `data/staging/cn-budgets/` (`cn-budgets.diff` blob `f1a17b11`, sha256 `227a9333…`; `core-types.staged.ts` blob `04c152c4`, sha256 `897d51db…`), **applied** here and left in place (Out of scope L161).

This is **F0c**, the maker overhaul plan's carries step before the screen work (EA-3, plan L243–L249; CEO 2026-11-27 03:53 "11c1 finishes and merges, then F0c"). It closes two carries. **CN-029:** DSK's three budget types (`BudgetKey`, `BudgetLimit`, `ProjectBudgets`) and `CoreProject.settings.budgets?` land in `src/types/core-types.ts` byte for byte, 11c1's three local copies in `src/project/load/budgets.ts` go, and the smoke pin moves `439f403d…` → `897d51db…` (11c1 EA ruling 2). **The pools gate:** play read every stage with a literal `{ picks: 0, waveUnits: 0 }`, so a weighted or waves enemy pool passed the reader, Test's gate and Build game, then failed in play with "play: stage". Now one `PLAY_LIMITS` pair beside `LIMITS` in `read-project.ts` is read by play (`project.ts` L66, L113), by the sim (`load.ts` L28 `stageLimits`) and by the gate's new `poolLines`, and Test and Build game refuse such a stage with one plain line naming it. It is not playing weighted pools or waves (engine work after F6), not any maker UI for pool modes, not a report row or format code, and none of QA's 11c1 carries (they stay with 11c2). There is no screen change for the demo: the no-screen proof is two byte-equal 390×844 pairs.

Sources: PR #113 (r1, merged). One round, no rework.
- Branch: `step/step-f0c-carries-r1-chatA` (code head `97dab703`, tip `c3468f44`), pushed once.
- Hand-back on the merge: `handback/step-f0c-carries/r1/HANDBACK.md` (HB, blob `a96b383e`, 110 lines, sha256 `ec385e48f6724f544ca20d92c4b273467d632e579f00fe6f76863b3798eccecb`), plus the no-screen pairs `base-map.png` = `step-map.png` (blob `9a09613b`, sha256 `87747d4d…`) and `base-test.png` = `step-test.png` (blob `45e31a9f`, sha256 `a6828db8…`), all 390×844.
- CoS verify report: `/workspace/share/step-f0c-verify/report.md` (V, sha256 `0118a158a935cdc9bce56abb1d45ea2b8dc752553ff4f11b3d6d9b9a3fb5035f`; the same text is PR #113's body): PASS on every claim, with 3 minor notes.
- QA docs on main:
  - Kit: `docs/qa/step-f0c-kit-review.md` on `49db9f47` (QK1, blob `abd2a839`, 47 lines, sha256 `c0839f656d40299217816505934804ed34e79f2fa231bf338d6d769da256fd2a`): **NOT OK TO SEND, kit rework r2**, must-fixes 1–4. `docs/qa/step-f0c-kit-r2-review.md` on `215bc7b3` (QK2, blob `b1efed7e`, 38 lines, sha256 `358c96803253b25e60469f719a6656c46decf40e3f3d969e74b01542f8eb2534`): **OK TO SEND** after the L112 plants-hash fix.
  - `docs/qa/step-f0c-r1-review.md` on `5cbba0e5` (QA1, blob `87ebaa99`, 42 lines, sha256 `9085de3e6f4a7ef2426714000cde2a3cce2773686fed6ead9147fe57e2049e83`): **OK TO MERGE**, expected tree `f93056ea`, no rework.

Line cites use HB, V, QK1, QK2 and QA1. Product line cites are at merge `bde1e737` (tree `f93056ea`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `49db9f47f83e54443c188f9a9354381df2f866f6`, 2026-11-27 10:06 (UK time), tree `7f9536ed`. QA's F0c kit r1 review (QK1), docs-only on `b2cb571f` (11c1 rebuild record and README row 33), docs-only on `b736cd97` (QA 11c1 r2 review), docs-only on the 11c1 merge `f784e678` (guide L5). Floor **1180** tests (1175 + N=5). The kit r2 was trialled on `49db9f47` (trial commit `085e2955`, tree `2475f873`, patch `/workspace/share/f0c/f0c-trial.patch`, sha256 `40269c17…`, 187 counted lines, green 1180/0, plants 13/13, all 25 smokes PASS, audit 136/150/150; guide L14) |
| Main moves during the build | Three commits landed after the base, all docs or handoff: `215bc7b3` (QK2, 10:20), `3fe48a8d` (the kit r2: the guide, the shipped test and plants under `handoff/steps/tests/step-f0c-carries/`, 10:21) and `664f8303` (no-APK rulings: `docs/maker/roadmap.md` and `docs/maker/ux/maker-overhaul-plan.md`, 14:01). The guide and shipped files reached main after the base; the builder copied them from the kit. None touches a Files-list file (V) |
| Main at merge | `664f8303feaa42f535d3f54fa0dbeeea80dcbaa2`, 2026-11-27 14:01 (UK time), tree `7e7fe1cf`. This is the merge's first parent. Official F0c product against it, and against the base, is **186** (12 Files-list files, +167/−19) |
| r1 commits | On `step/step-f0c-carries-r1-chatA`: `97dab703753457376058474b24348c32971eb39d` feat(maker): step F0c land CN-029 and the pools gate (code head, tree `4a212c4d10bbb727bd08d5fd81e82eb392223c4a`, 2026-11-27 14:27 UK time), then `c3468f4451170a61d0ef8e4d0058df02c6e6d78c` docs(handback): step F0c carries r1 (tree `80ea9fd62939da27d2a346dd5569c78594eb7be1`, 14:28; 5 files, +110, `handback/step-f0c-carries/r1/` only). Linear on the base, no merges. Author and committer on both are `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Green **1180/0** (HB, V, QA1). Official product **186** (12 files, +167/−19), every cap kept. tools tsc only the 3 base errors. All 25 smokes PASS, unedited (HB, V, QA1). Plants 13/13 (HB, V, QA1). Export audit 136/150/150. No-screen pairs byte-equal. CoS verify PASS (V); CoS opened PR #113 (2026-11-27 14:44 UK time) and predicted the merge tree onto `664f8303` as `f93056ea`. QA1 **OK TO MERGE** at 14:51 |
| Merge | PR #113 (opened 14:44, merged 14:52), merge commit `bde1e7371d25160bd8a030b961c9792c1f1e0819`, 2026-11-27 14:52 (UK time). Tree `f93056ea345b0918dbf53009f9c612b32ae7867b` (the tree CoS and QA predicted). First parent `664f8303feaa42f535d3f54fa0dbeeea80dcbaa2`, second parent `c3468f4451170a61d0ef8e4d0058df02c6e6d78c`. Author and committer are `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #113: Step F0c: carries (ChatA r1)`. Green on the merge: **1180 pass / 0 fail** |
| After the merge | `5cbba0e5f3d0395d7c1ce3cefa0d7dcced393f95` (14:53, tree `7360ee24`) adds only `docs/qa/step-f0c-r1-review.md` (QA1). `f6ceb21ef5d74de5f813677604606acf2fe50b1e` (14:53, tree `74c18354`) adds the boot-splash planning docs (`docs/maker/roadmap.md`, `docs/STATES.md` and four `docs/qa/boot-splash-docs-*.md`), docs only. `e0cce27ca68d13771801e18a319e7cd38c863d16` (14:59, tree `2f5682b2`) adds the camera panel planning docs (`docs/maker/roadmap.md` sha256 `372c9988…`, `docs/qa/camera-panel-docs-review.md` `1a066dcc…` and `docs/qa/camera-panel-docs-r3-recheck.md` `d3442a71…`), docs only |
| Postmerge | QA postmerge on `bde1e737`: **PASS**, 1180 pass / 0 fail (the new floor). The core-types pin moves `439f403d` → `897d51db` by Ruling 1 (guide L95–L96; `tests/smoke.test.ts` pins it). QA doc `docs/qa/step-f0c-postmerge-and-record.md` (blob `07d26ba8`, 47 lines, sha256 `856a5938fd1ec5ed36e21d714fbeb69c1b9cc5d322f9bbade9ac3f598f617da0`), pushed with this record |
| Tests | 1175 + N=5 (the five shipped tests in `tests/project/f0c-carries.test.ts`) = **1180 pass / 0 fail**. The floor after this merge is **1180** (HB, V, QA1) |

## (b) Files

From `git diff --name-status 664f8303..bde1e737 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` against the merge's first parent, which is the same as against the base `49db9f47` for these files. Caps are the guide's Size table (L59–L73).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/types/core-types.ts` | M | 7 / 0 | 7 (DSK's diff) | yes. **7**, on cap (sha256 `897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f`) |
| `tests/smoke.test.ts` | M | 1 / 1 | 2 | yes. **2**, on cap (sha256 `04b4fba49e46fa8e862c91552d64058ca0ed47dad14d4daa126cec21483b8684`) |
| `src/project/load/budgets.ts` | M | 1 / 4 | 5 | yes. **5**, on cap (sha256 `969725fcd42085f0a4b7698e10ddeab1ec526e6735b553a66c8dea21242d0d34`) |
| `src/project/load/index.ts` | M | 2 / 2 | 4 | yes. **4**, on cap (sha256 `04a69ba537abd66c731fab6855c797b9182bf085b610ef1532c6822f6f2d7966`) |
| `src/project/load/read-project.ts` | M | 3 / 1 | 4 | yes. **4**, on cap (sha256 `78adf4d1fd2437d91a0096dca849fec587e0bb47c18095149fb1f7b592f91e02`) |
| `tools/maker/budgets.ts` | M | 2 / 1 | 3 | yes. **3**, on cap (sha256 `fe1133322ffa72cd14625d7a66629d20a8ce1d45a492f18bfc117a9e17bc1f48`) |
| `src/editor/project/test-gate.ts` | M | 21 / 2 | 28 (≤ 26+ 2−) | yes. **23** (sha256 `599881a2c833765d79cd7c57e580090e8b884203550b4be8793cdc252c0bc3b2`) |
| `tools/maker/test-launch.ts` | M | 2 / 2 | 4 | yes. **4**, on cap (sha256 `7bd68761b37bdfb90bc9abee09bbb92bb8231627258112677d5ed46495476899`) |
| `tools/maker/export.ts` | M | 2 / 2 | 4 | yes. **4**, on cap (sha256 `fa2c2dc2434a16806fe9d64ab8658df3ba3cafc995199c170753a3170e89ec70`) |
| `tools/play-stage/project.ts` | M | 3 / 3 | 6 | yes. **6**, on cap (sha256 `13c8c84015ecc29007dd2adb0d7ac6a2d4f160688362a93fb440c6b59474762e`) |
| `tools/play-stage/load.ts` | M | 2 / 1 | 3 | yes. **3**, on cap (sha256 `8a7475d7e769a1bc0b36680e66293153dbfe155a753fd18df4dc7ec0fe07d155`) |
| `tests/project/f0c-carries.test.ts` | A | 121 / 0 | 121 (shipped, verbatim) | yes. **121**, on cap (sha256 `870970073f2d0f538e57ea10e132fd4d92eeb620355e730ec2af6c7c00e30479`) |

What the merge does not touch:
- Nothing under `src/core`, `src/sim`, `src/runtime`, `src/rules` or `src/project/read`. `src/types/core-types.ts` changes only by DSK's diff.
- Nothing in `data/` (including `data/staging/cn-budgets/`, left as staged) or `fixtures/`; `git diff --quiet 49db9f47 bde1e737 -- data fixtures` is clean.
- Nothing in `tools/maker/stage.ts`, `tools/maker/home.ts`, `tools/export`, `tools/apk`, the format docs, painter-proto or ui-shell.
- No smoke added or edited. The only existing test changed is the core-types pin in `tests/smoke.test.ts` (guide L95–L96).
- No package or lock change, no new report code, no formatVersion bump.

The official count at the code head against the base, or at the merge against first parent `664f8303`, is **12 files changed, 167 insertions(+), 19 deletions(-)** = 186, under the hard gate of 400.

The trial counted 187 (+168/−19) in the same 12 files. The one-line difference is `test-gate.ts`: 21+ 2− against the trial's 22+ 2− (HB § Decisions). QA1 diffed the code head against the trial tree `2475f873`: only `test-gate.ts` and `read-project.ts` differ. `poolLines` makes `lines` first and calls `stageNames` after the early return, with no `poolLines` doc comment, and the `PLAY_LIMITS` doc comment is shortened to "Play places fixed enemy lists only." The other ten files match the trial.

## (c) Key code and git commands

**CN-029 (Ruling 1).** `git apply data/staging/cn-budgets/cn-budgets.diff`, never typed by hand. It adds 7 lines to `src/types/core-types.ts`: a two-line doc comment and the three types at L224–L228 (`BudgetLimit` keeps its `// int, 1 ≤ warn ≤ limit` comment), one blank line, and `readonly budgets?: ProjectBudgets;` at L242 inside `CoreProject.settings`. The file is sha256 `897d51db…`, blob `04c152c4`, the same blob as `data/staging/cn-budgets/core-types.staged.ts`. `tests/smoke.test.ts` L14's pin moves `439f403d…` → `897d51db…`.

**The type swap (Ruling 2).** `src/project/load/budgets.ts` loses the 11c1 comment and the three local types (−4) and gets one line: `import type { BudgetKey, BudgetLimit, ProjectBudgets } from "../../types/core-types.ts";` at L2. `index.ts` L4 drops `type BudgetKey`. `tools/maker/budgets.ts` L1 drops `type BudgetKey` and a new L2 imports it from core-types. `rg -n "type (BudgetKey|BudgetLimit|ProjectBudgets) =" src tools` finds core-types only.

**One cap pair (Ruling 3).** `read-project.ts`:
- L9: `export const LIMITS = { picks: 8, waveUnits: 16 } as const;` (was `const`, value unchanged).
- L10: `/** Play places fixed enemy lists only. */`
- L11: `export const PLAY_LIMITS = { picks: 0, waveUnits: 0 } as const;`

`index.ts` L3 is `export { LIMITS, PLAY_LIMITS, readProject } from "./read-project.ts";`. Play reads the pair in three places:
- `tools/play-stage/project.ts` L2 imports it; L66 (`openProject`) and L113 (`arriveIn`) call `readStage(stage, PLAY_LIMITS)`.
- `tools/play-stage/load.ts` L6 imports it (after L5); L28's `docsToInput` passes `stageLimits: PLAY_LIMITS` to the sim (QK1 must-fix 1: the engine's own cap, read by `src/sim/world.ts` L34–L36). `world.ts` L57 reads `stageLimits.notices`, which stays absent, as on the base.
- `rg -n "picks: 0" tools/play-stage` finds nothing.

**The gate (Rulings 4–6).** `src/editor/project/test-gate.ts` adds two imports (`LIMITS, PLAY_LIMITS` from the load index and `readStage` from `src/project/read`) and:
- `poolLine(stage)`: `{Stage}: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.` (EA wording, confirmed by UX).
- `poolLines(load)`: empty when `load.project` is `null`; otherwise, for each stored stage in `Object.entries` order, one line when `readStage(stage, LIMITS).ok` and not `readStage(stage, PLAY_LIMITS).ok`, named through `stageNames` (`names[id] ?? id`). So a weighted pool with picks ≥ 1, or a waves pool with any wave of ≥ 1 unit, is refused; picks 0 and empty waves pass, because play opens them; a stage the reader already rejects gets its hard row and no pool line.
- `testGate(report, readOnly, names = {}, more = [])`: the hard-row lines, then `.concat(more)`.

The pool check is not a `ReportRow`: `readProject().ok`, `readOnly` and the report are unchanged. `tools/maker/test-launch.ts` L31 and `tools/maker/export.ts` L28 pass `poolLines(load)` as the fourth argument. The import adds `poolLines` only: at the end in `test-launch.ts` L3 (its base order kept), and in alphabetical place in `export.ts` L2 (that import was already sorted). The gate is project-wide while `openProject` refuses only the stage it opens; "exactly what play refuses" holds per stage (Ruling 4, HB § Decisions).

**Shipped tests** 1–5 in `tests/project/f0c-carries.test.ts` (121/121, verbatim), titles exactly as the guide L104–L108.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff 664f8303 bde1e737 -- \
#     src/types/core-types.ts tests/smoke.test.ts \
#     src/project/load/budgets.ts src/project/load/index.ts src/project/load/read-project.ts \
#     tools/maker/budgets.ts src/editor/project/test-gate.ts \
#     tools/maker/test-launch.ts tools/maker/export.ts \
#     tools/play-stage/project.ts tools/play-stage/load.ts \
#     tests/project/f0c-carries.test.ts
#
# The hand-back and shots (not in the 400):
#   git show bde1e737:handback/step-f0c-carries/r1/HANDBACK.md
#
# Product gate. Official command at the code head against the base 49db9f47,
# or at the merge against first parent 664f8303:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   12 files changed, 167 insertions(+), 19 deletions(-)
#
# At bde1e737 against 49db9f47 the same command also lists main's own commits
# after the base (QK2, the kit r2, the no-APK docs); add
# ':!docs/**' ':!handoff/steps/tests/step-f0c-carries/**' to get 186 again.
# Trial r2 (085e2955) was 168 + 19 = 187.
#
# Named tests (npm test 1180/0, floor 1175 + N=5):
#   ✔ f0c CN-029: core-types is DSK's staged copy byte for byte, …
#   ✔ f0c gate: a weighted or waves pool that play refuses blocks Test and Build game …
#   ✔ f0c gate: the pools proof: for every pool shape the gate's pool lines are empty …
#   ✔ f0c gate: pool lines come after the hard rows' lines, one per refused stage, …
#   ✔ f0c play: the engine reads stages with PLAY_LIMITS too: …
#
# tools tsc: only effect-designer page.ts L101 (TS18047) and maker home.ts L92 (×2, TS7053).
#
# Smokes: all 25 solo, unedited, at the guide counts:
#   S0 (8797) 14, s3 (8798) 18, s4a (8799) 16, s4b (8800) 16, s4c (8801) 16,
#   s5a (8802) 16, s5b (8803) 16, s5c (8804) 16, s6a (8805) 18, s6b (8806) 16,
#   s6c (8807) 18, s6d (8808) 14, s7 (8809) 20, s8 (8810 r1) 16, s9 (8811 r1) 12,
#   s8c (8812 r1) 8, s9b (8813 r1) 14, s9c (8814 r1) 6, s10b (8815 r1) 8,
#   s10c (8816 r1) 8, s10d (8817 r1) 8, s11a (8818 r1) 6, s11a2 (8822 r1) 6,
#   s11b (8840 r1) 6, s11c1 (8823 scratch) 6.
# HB: s3 passed on its first run (no flake, no re-run); s11b on 8840 because another
# process on the box held 8820. CoS (V) and QA (QA1) ran all 25 too: all PASS.
#
# Plants: handoff/steps/tests/step-f0c-carries/plants-f0c.py (39f67d7b), 13/13 caught
# at the code head (HB, V, QA1), tree clean after:
#   P1 Test drops pool lines, P2 Build game drops them, P3 play keeps its own caps (L66),
#   P4 no reader check, P5 pool lines before hard lines, P6 stage id instead of name,
#   P7 PLAY_LIMITS drift, P8 CN-029 not applied, P9 load.ts widened to 8/16,
#   P10 both project.ts caps (L66, L113) widened, P11 arriveIn skips its stage check,
#   P12 .concat(more) dropped, P13 break after the first refused stage.
#
# Export audit: builder self-run (/tmp/self-audit.mjs, three builders) and s8-audit.mjs both
# 136 / 150 / 150, 0 hits, AUDIT PASS (unchanged from the base).
#
# No-screen proof: 390×844, deviceScaleFactor 1, the demo template's map and Test on a
# base worktree and on the code head: base-map = step-map (87747d4d), base-test =
# step-test (a6828db8), BYTE_EQUAL (HB; CoS checked the bytes and viewed them, V).
```

## (d) What went wrong, in order, and the fix

**Kit r1 → r2, before any build (QK1, NOT OK TO SEND).**
- **The acceptance grep failed on the trial, and one play cap was missed (must-fix 1).** `rg -n "picks: 0" tools/play-stage` found `tools/play-stage/load.ts` L27, `stageLimits: { picks: 0, waveUnits: 0 }` in `docsToInput`: the engine's own cap, which the sim reads (`world.ts` L34–L36). QA's plant widening it to 8/16 passed every test, so "one cap pair" wasn't true yet. r2 adds `load.ts` to Files (≤ 2+ 1−), passing `stageLimits: PLAY_LIMITS`, plus a test-5 assertion and plant P9.
- **`arriveIn`'s cap (`project.ts` L113) wasn't pinned (must-fix 2).** r2's test 5 pins the observable part: arriving into a weighted or waves stage gives docs `null` and the same "play: stage" as `openProject`. Widening L113 alone is an equivalent mutant: every `arriveIn` path ends in `openProject(…, toId)`, which reads the same stage again at L66 (guide L113; QK2 re-read `arriveIn` and confirmed). P10 and P11 cover L113 together with L66.
- **The shipped test broke the new Rule 8 (must-fix 3).** L60 had `start: () => { started = true; }`. r2 uses `const start = mock.fn()` with `start.mock.callCount()` 0, and drops `let started`. The test was re-hashed (98 → 121 lines, `150c96d7` → `87097007`).
- **Paste wording (must-fix 4).** The tsc line named only maker `home.ts` L92. r2 names the 3 base errors.
- **Design notes (QK1).** Ruling 4 now names the scope: project-wide, while "exactly what play refuses" holds per stage. UX confirmed Ruling 5's line before the go.
- **One text fix before the push (QK2).** Guide L112 cited the r1 plants hash `88ca5665…`; the pushed guide cites the r2 script `39f67d7b…`.

**r1: no must-fix.** QA1 found nothing to rework. Its notes, none blocking:
- The `poolLines` doc comment that the trial had was dropped, and that isn't listed in HB § Decisions (minor hand-back drift).
- `names[id] ?? id` is redundant, because `stageNames` already falls back to the id. Leave it.
- The builder ran green on Node v22.23.3 (`.nvmrc` says 24); CoS and QA on v24.22.1; all pass.
- The paste and guide cite only the r1 kit review (QK1); QK2 is on main too.

## (e) Do it right first time

- The work is only in the 12 Files-list files. Nothing in `src/core`, `src/sim`, `src/runtime`, `src/rules`, `src/project/read`, `data/` (including `data/staging/`), `fixtures/`, `tools/maker/stage.ts`, `tools/maker/home.ts`, `tools/export`, `tools/apk`, the format docs, painter-proto or ui-shell. No smoke edited; the only existing test changed is the core-types pin.
- Land a staged CN with `git apply` of DSK's diff, never by hand, and check the result is byte-equal to the staged copy before moving the pin.
- When a constant is lifted into one source, grep every consumer for the old literal, the engine's input included (`load.ts`'s `stageLimits`), and pin each with a test and a plant.
- A plant that is an equivalent mutant (L113 alone) is named as such in the guide, and its observable part is pinned instead.
- Rule 8 in all new code, tests included: any body that holds a statement takes its own lines (no `{ x(); }` on the opening line, no unbraced `if (…) return …;`); a callback that only records a call is a `mock.fn()`. Edit existing dense lines only where Files names the edit.
- Change an existing import only by adding the new name, keeping its order.
- List every dropped comment or reshape against the trial in § Decisions.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only docs: QA1, the boot-splash docs,
# the camera panel docs e0cce27 and the QA postmerge doc):
#   git diff bde1e737 HEAD -- <the 12 files in (c)>
#   (empty)
#
# Product gate at the merge against first parent 664f8303:
#   git diff --shortstat 664f8303..bde1e737 -- . ':!handback/**' ':!node_modules'
#   12 files changed, 167 insertions(+), 19 deletions(-)
#
# Green: npm ci && npm run green → 1180 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L92 ×2).
# Smokes: all 25 solo, unedited, at the guide counts (the 25 in step-11c1.md).
# Export audit: 136 / 150 / 150, AUDIT PASS.
# Plants: python3 handoff/steps/tests/step-f0c-carries/plants-f0c.py → 13/13 caught.
# CN-029: git rev-parse HEAD:src/types/core-types.ts equals
#   HEAD:data/staging/cn-budgets/core-types.staged.ts (04c152c4);
#   rg -n "picks: 0" tools/play-stage → nothing.
```

## QA non-blockers carried forward

- **QA's 11c1 carries stay with 11c2** (on hold behind F6, plan L100; guide L142–L156). F0c pulls none in:
  - Neutral `setupIds` dropped (no test catches it yet).
  - A pool on the neutral side still counted as AI.
  - `"none"` counted as an effect.
  - The Budgets summary picking the first stage instead of the busiest.
  - Roster `required` dropped (matches play, `project.ts` L84).
  - The module-wide `let open` in `tools/maker/budgets.ts`.
  - The re-parse on every project-screen repaint: timed on the S21 as the CEO's phone check (relayed via CoS), with 11c2.
  - Meter spacing and the warn and error tokens.
- **Guide carries:**
  - Playing weighted pools and waves is engine work after F6, with its own placement card (plan L100, L249).
  - After F6 (UX, 2026-11-27): the maker can't convert a weighted or waves pool (`src/editor/stage/place.ts` L41), so Test's gate sheet later gets a "Use a fixed list" button for this line.
  - 11c2 (UX, 2026-11-27): the 11a2 ready-sheet body in `tools/maker/build-sheet.ts` L13 becomes UX's itch.io text; the pins in `tests/tools/sheet-11a2.test.ts`, `docs/maker/steps/step-11a2-ready-sheet.md` and `docs/rebuild/step-11a2.md` move with it.
  - `data/staging/cn-budgets/` stays in place (DSK's call to remove; Out of scope L161).
  - The 11c1 Carries list (stage chip, Phone-like Test, etc.) stands.
- **Code notes (QA1):** `names[id] ?? id` in `poolLines` is redundant; leave it. `poolLines` runs `readStage` twice per stage on each Test or Build tap, with no cache (bounded; BUILD_GUIDE law 13).
- **Process carries:**
  - The dropped `poolLines` doc comment isn't declared in HB § Decisions (noted only).
  - The paste and guide cite only the r1 kit review; QK2 is on main.
  - The builder's Node is v22; `.nvmrc` pins 24.
  - Port 8820 was held by another process on the box (s11b ran on 8840).
- **Old carries:** the 11a, 11a2, 11b and 11c1 carries stand, including the CEO phone check of the download and Share sheet, the WebView 98+ floor, the CLI branch of `tools/apk` untested (M14, M15), `setup-sdk.sh` not re-runnable and `platform-tools` unversioned.
- **Closed here:**
  - CN-029 (DSK E8 types in core-types; 11c1 EA ruling 2).
  - The play/gate cap split: one `PLAY_LIMITS` for `openProject`, `arriveIn`, the sim and the gate (EA-3, gate half).
  - QK1 must-fixes 1–4 and QK2's L112 hash fix.

## Blob check

Each file must have exactly this git blob id at `bde1e737`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/types/core-types.ts` | `04c152c4f479f918dcf02f5d9664b5a13a9b567d` | 425 |
| `tests/smoke.test.ts` | `0857b9204fa7d700e2af909a91848c273662d637` | 15 |
| `src/project/load/budgets.ts` | `38634da769427ae9cb88b2eacf1edbdbd328a923` | 109 |
| `src/project/load/index.ts` | `34ac7c338641f2d51de127a53e64e33a72c85428` | 4 |
| `src/project/load/read-project.ts` | `dd7683b3284d989bfc651cf72a943adc2769d56c` | 128 |
| `tools/maker/budgets.ts` | `8ed93f720fa689c8a0a5282aa86685e10accc01e` | 40 |
| `src/editor/project/test-gate.ts` | `b1f1b372eb8a1eaebe23dc93184b05d08d7f916a` | 70 |
| `tools/maker/test-launch.ts` | `f7cf9162c5af66586b4b6fc75e4d3dbe372a2daa` | 54 |
| `tools/maker/export.ts` | `c22e479395b16a334c766a32a885ef8e13281066` | 47 |
| `tools/play-stage/project.ts` | `1a830b4f930a2c3b17cd4d29e65bf081d779aa95` | 123 |
| `tools/play-stage/load.ts` | `6e5e105cfa4842ea0d71d1db6d8d53e156509899` | 29 |
| `tests/project/f0c-carries.test.ts` | `df4b9a11439126f4d413260ed7bb2ea67b411965` | 121 |

## Appendix: full code as merged (step F0c, PR #113)

New files are `git show bde1e737:<path>` in full. Edited files are `git diff 664f8303 bde1e737 -- <path>`, which is the same as against the base `49db9f47`.

### `src/types/core-types.ts` (edited)

```diff
diff --git a/src/types/core-types.ts b/src/types/core-types.ts
index e75b158..04c152c 100644
--- a/src/types/core-types.ts
+++ b/src/types/core-types.ts
@@ -221,6 +221,12 @@ export type CoreDeck = VersionGuard<"deck"> & {
  *  (TD); laneSlots = formation slots per lane (idle). MAY-MOVE. */
 export type OccupancyPolicy = "strict1" | "softStack" | "laneSlots";
 
+/** Per-stage budgets (DSK E8, step 11c, CN-029). Read only by the project reader's report (budgetNear / budgetOver);
+ *  the runtime, sim and core never read them. An absent key is not checked. MAY-MOVE. */
+export type BudgetKey = "units" | "activeAi" | "effects" | "stageTiles";
+export type BudgetLimit = { readonly warn: number; readonly limit: number };   // int, 1 ≤ warn ≤ limit
+export type ProjectBudgets = Partial<Readonly<Record<BudgetKey, BudgetLimit>>>;
+
 export type CoreProject = {
   readonly id: string;                                  // STABLE
   readonly rev: number;                                 // STABLE
@@ -233,6 +239,7 @@ export type CoreProject = {
                                                         //   values are kept inactive with occupancyStageValueIgnored)
     readonly wrapEdges: boolean;                        // MAY-MOVE: v1 core IGNORES it (warning wrapEdgesIgnored when true);
                                                         //   future: none | x | y | both, plus LOS and pathing across the seam
+    readonly budgets?: ProjectBudgets;                  // MAY-MOVE (DSK E8, CN-029): absent = nothing checked; no engine default
   };
   readonly stages: ReadonlyArray<string>;               // STABLE: stage ids, in order
   readonly rules: ReadonlyArray<string>;                // STABLE: project-wide setup ids (≤ 1 per behaviour)
```

### `tests/smoke.test.ts` (edited)

```diff
diff --git a/tests/smoke.test.ts b/tests/smoke.test.ts
index c629998..0857b92 100644
--- a/tests/smoke.test.ts
+++ b/tests/smoke.test.ts
@@ -11,5 +11,5 @@ test("smoke: engine root exports name and version", () => {
 
 test("smoke: core-types.ts is the pinned DSK copy", () => {
   const sha = createHash("sha256").update(readFileSync("src/types/core-types.ts")).digest("hex");
-  assert.equal(sha, "439f403d03b8c61ff679a51939c5834fc898f3b32c0c9ee6de7f59d3b5f247b5");
+  assert.equal(sha, "897d51dbb6cd40565bde772bd3167da7a4fb9771f7b8edac201bcb358d2f552f");
 });
```

### `src/project/load/budgets.ts` (edited)

```diff
diff --git a/src/project/load/budgets.ts b/src/project/load/budgets.ts
index 6d86efc..38634da 100644
--- a/src/project/load/budgets.ts
+++ b/src/project/load/budgets.ts
@@ -1,8 +1,5 @@
 import type { ProjectStore, ReportRow } from "./types.ts";
-/** Local copies of CN-029's three types. They become one import from core-types when CN-029 lands. */
-export type BudgetKey = "units" | "activeAi" | "effects" | "stageTiles";
-export type BudgetLimit = { readonly warn: number; readonly limit: number };
-export type ProjectBudgets = Partial<Readonly<Record<BudgetKey, BudgetLimit>>>;
+import type { BudgetKey, BudgetLimit, ProjectBudgets } from "../../types/core-types.ts";
 export type BudgetUse = { readonly stageId: string; readonly budget: BudgetKey; readonly used: number; readonly warn: number; readonly limit: number; readonly w?: number; readonly h?: number };
 const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
 type Obj = Record<string, unknown>;
```

### `src/project/load/index.ts` (edited)

```diff
diff --git a/src/project/load/index.ts b/src/project/load/index.ts
index 3b73bc9..34ac7c3 100644
--- a/src/project/load/index.ts
+++ b/src/project/load/index.ts
@@ -1,4 +1,4 @@
 export type { BehaviourSetup, CatalogueSlice, GameMap, ProjectFiles, ProjectLoad, ProjectManifest, ProjectStore, ReportRow, Severity, Stage, Unit } from "./types.ts";
 export { migrateProject } from "./migrate.ts";
-export { readProject } from "./read-project.ts";
-export { budgetUse, type BudgetKey, type BudgetUse } from "./budgets.ts";
+export { LIMITS, PLAY_LIMITS, readProject } from "./read-project.ts";
+export { budgetUse, type BudgetUse } from "./budgets.ts";
```

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index d130e9e..dd7683b 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -6,7 +6,9 @@ import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectS
 
 type Obj = Record<string, unknown>;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
-const LIMITS = { picks: 8, waveUnits: 16 } as const;
+export const LIMITS = { picks: 8, waveUnits: 16 } as const;
+/** Play places fixed enemy lists only. */
+export const PLAY_LIMITS = { picks: 0, waveUnits: 0 } as const;
 const row = (code: string, severity: Severity, path: string, detail?: string): ReportRow => (detail === undefined ? { code, severity, path } : { code, severity, path, detail });
 const sort = (rows: readonly ReportRow[]): ReportRow[] => [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
 const idOf = (doc: Obj): string | null => (typeof doc["id"] === "string" ? doc["id"] : null);
```

### `tools/maker/budgets.ts` (edited)

```diff
diff --git a/tools/maker/budgets.ts b/tools/maker/budgets.ts
index 84ae4e5..8ed93f7 100644
--- a/tools/maker/budgets.ts
+++ b/tools/maker/budgets.ts
@@ -1,4 +1,5 @@
-import { budgetUse, readProject, type BudgetKey, type BudgetUse } from "../../src/project/load/index.ts";
+import { budgetUse, readProject, type BudgetUse } from "../../src/project/load/index.ts";
+import type { BudgetKey } from "../../src/types/core-types.ts";
 import { parseProject } from "./project-files.ts";
 const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
 const LABEL: Readonly<Record<BudgetKey, string>> = { units: "Units", activeAi: "Active AI", effects: "Effects", stageTiles: "Stage size" };
```

### `src/editor/project/test-gate.ts` (edited)

```diff
diff --git a/src/editor/project/test-gate.ts b/src/editor/project/test-gate.ts
index 247a94f..b1f1b37 100644
--- a/src/editor/project/test-gate.ts
+++ b/src/editor/project/test-gate.ts
@@ -1,4 +1,6 @@
 import type { ReportRow } from "../../project/load/types.ts";
+import { LIMITS, PLAY_LIMITS } from "../../project/load/index.ts";
+import { readStage } from "../../project/read/index.ts";
 
 /** Hard codes from S1 §8, one sentence each. Warnings are not in this table. */
 const SAY: Readonly<Record<string, string>> = {
@@ -43,9 +45,26 @@ export function stageNames(load: { readonly project: { readonly stages: Readonly
   for (const [id, stage] of Object.entries(stages)) names[id] = typeof stage["name"] === "string" ? stage["name"] : id;
   return names;
 }
+export const poolLine = (stage: string): string => `${stage}: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.`;
+export function poolLines(load: { readonly project: { readonly stages: Readonly<Record<string, Readonly<Record<string, unknown>>>> } | null }): readonly string[] {
+  const lines: string[] = [];
+  const stages = load.project === null ? undefined : load.project.stages;
+  if (stages === undefined) {
+    return lines;
+  }
+  const names = stageNames(load);
+  for (const [id, stage] of Object.entries(stages)) {
+    const readerOk = readStage(stage, LIMITS).ok;
+    const playOk = readStage(stage, PLAY_LIMITS).ok;
+    if (readerOk && !playOk) {
+      lines.push(poolLine(names[id] ?? id));
+    }
+  }
+  return lines;
+}
 /** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
-export function testGate(report: readonly ReportRow[], readOnly: boolean, names: Readonly<Record<string, string>> = {}): TestGate {
-  const lines = report.filter((row) => row.severity === "hard").map((row) => (row.code === "budgetOver" ? overLine(row, names) : sentence(row)));
+export function testGate(report: readonly ReportRow[], readOnly: boolean, names: Readonly<Record<string, string>> = {}, more: readonly string[] = []): TestGate {
+  const lines = report.filter((row) => row.severity === "hard").map((row) => (row.code === "budgetOver" ? overLine(row, names) : sentence(row))).concat(more);
   if (!readOnly && lines.length === 0) return { allowed: true };
   return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
 }
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index 42b07a3..f7cf916 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -1,6 +1,6 @@
 import { prefix, storedRev, type DocText } from "../../src/editor/project/home.ts";
 import { planSave } from "../../src/editor/project/save.ts";
-import { testGate, playLine, emptyBoard, stageNames } from "../../src/editor/project/test-gate.ts";
+import { testGate, playLine, emptyBoard, stageNames, poolLines } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { startOf } from "../../src/editor/stage/rooms.ts";
 import { settleSession } from "../../src/project/read/session.ts";
@@ -28,7 +28,7 @@ function resumed(files: Parameters<typeof openProject>[0], save: SessionSave): {
 async function play(input: LaunchBag, text: DocText): Promise<Launch> {
   const parsed = parseProject(text);
   if (!parsed.ok) return fail([parsed.message], text, 0);
-  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load)), rev = storedRev(parsed.files);
+  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load), poolLines(load)), rev = storedRev(parsed.files);
   if (!gate.allowed) return fail(gate.lines, text, rev);
   const opened = input.resume === undefined ? (input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId)) : resumed(parsed.files, input.resume);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
```

### `tools/maker/export.ts` (edited)

```diff
diff --git a/tools/maker/export.ts b/tools/maker/export.ts
index 5c5a922..c22e479 100644
--- a/tools/maker/export.ts
+++ b/tools/maker/export.ts
@@ -1,5 +1,5 @@
 import { prefix } from "../../src/editor/project/home.ts";
-import { emptyBoard, playLine, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
+import { emptyBoard, playLine, poolLines, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { gameZip } from "../export/game.ts";
 import { openProject } from "../play-stage/project.ts";
@@ -25,7 +25,7 @@ export async function buildGame(store: MakerStore, id: string, get: (path: strin
   if (!parsed.ok) return { ok: false, lines: [parsed.message] };
   const load = readProject(parsed.files);
   const rows = await assetRows(store, prefix(id), parsed.files);
-  const gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load));
+  const gate = testGate([...load.report, ...rows], load.readOnly, stageNames(load), poolLines(load));
   if (!gate.allowed) return { ok: false, lines: gate.lines };
   const opened = openProject(parsed.files);
   if (opened.docs === null) return { ok: false, lines: [playLine(opened.error)] };
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index c5caa38..1a830b4 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -1,5 +1,5 @@
 import { builtinFx } from "../../src/project/builtin-fx.ts";
-import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
+import { PLAY_LIMITS, readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
 import { readMap, readStage } from "../../src/project/read/index.ts";
 import { createGrid } from "../../src/core/grid/index.ts";
 import { arrival } from "../../src/rules/session/links.ts";
@@ -63,7 +63,7 @@ function pickFx(store: ProjectStore, id: string, setup: Obj, fxOf: Record<string
 export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {}, sess = isObj(root["session"]) ? root["session"] : null, start = sess !== null && typeof sess["start"] === "string" ? sess["start"] : undefined;
   const stage = store.stages[stageId ?? start ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
-  const core = readStage(stage, { picks: 0, waveUnits: 0 }); if (!core.ok) throw new Error("play: stage");
+  const core = readStage(stage, PLAY_LIMITS); if (!core.ok) throw new Error("play: stage");
   const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
   const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
   const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
@@ -110,7 +110,7 @@ export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"
 export function arriveIn(files: ProjectFiles, fromId: string | null, toId: string, party: SessionParty): ReturnType<typeof openProject> {
   if (fromId === "") throw new Error("play: stage id");
   let path = ""; for (const [key, doc] of Object.entries(files)) if (key.startsWith("stages/") && isObj(doc) && doc["id"] === toId) path = key;
-  const stage = path === "" ? undefined : files[path], read = stage === undefined ? null : readStage(stage, { picks: 0, waveUnits: 0 });
+  const stage = path === "" ? undefined : files[path], read = stage === undefined ? null : readStage(stage, PLAY_LIMITS);
   if (read === null || !read.ok) return openProject(files, toId);
   let mapDoc: unknown; for (const [key, doc] of Object.entries(files)) if (key.startsWith("maps/") && isObj(doc) && doc["id"] === read.doc.mapRef) mapDoc = doc;
   const map = mapDoc === undefined ? null : readMap(mapDoc), tiles = installOne(TERRAIN, {}).out?.tiles, grid = map !== null && map.ok && tiles !== undefined ? createGrid(map.doc, tiles) : null;
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 24bdee6..6e5e105 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -3,6 +3,7 @@ import type { WinRule } from "../../src/rules/battle/win.ts";
 import type { LevelSetup } from "../../src/rules/levels/index.ts";
 import type { SimInput } from "../../src/sim/types.ts";
 import type { CoreLink, CoreTileType } from "../../src/types/core-types.ts";
+import { PLAY_LIMITS } from "../../src/project/load/index.ts";
 
 export const TILE = 16;
 export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
@@ -24,5 +25,5 @@ export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; read
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
-  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
+  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: PLAY_LIMITS, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
 }
```

### `tests/project/f0c-carries.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { prefix } from "../../src/editor/project/home.ts";
import { asWrites } from "../../src/editor/project/save.ts";
import { poolLine, poolLines, stageNames, testGate } from "../../src/editor/project/test-gate.ts";
import { budgetUse, PLAY_LIMITS, readProject } from "../../src/project/load/index.ts";
import { createWorld } from "../../src/sim/index.ts";
import type { BudgetKey, CoreProject, ProjectBudgets } from "../../src/types/core-types.ts";
import { buildGame } from "../../tools/maker/export.ts";
import { commitWrites, memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { launchTest } from "../../tools/maker/test-launch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
import { loadFixture, U } from "../tools/demo-fixture.ts";
const SID = "stage_01JDAS00000000000000000001";
const STAGE = `stages/${SID}.json`;
const PID = "project_01JDAP00000000000000000001";
const NOW = "2026-11-27T12:00:00.000Z";
const SPAWNS = [{ c: 2, r: 0 }, { c: 3, r: 0 }];
type Obj = Record<string, unknown>;
const bag = (): Record<string, Obj> => Object.fromEntries(Object.entries(loadFixture()).flatMap(([k, v]) => (typeof v === "object" && v !== null && !Array.isArray(v) ? [[k, structuredClone(v) as Obj]] : [])));
const text = (files: Record<string, Obj>): Record<string, string> => Object.fromEntries(Object.entries(files).map(([k, v]) => [k, JSON.stringify(v)]));
function withPool(pool: unknown): Record<string, Obj> {
  const files = bag();
  (files[STAGE] as Obj)["enemyPool"] = pool;
  return files;
}
const weighted = (picks: number): Obj => ({ mode: "weighted", picks, allowRepeats: true, spawns: SPAWNS, entries: [{ unitId: U.wolf, weight: 1 }] });
const waves = (count: number): Obj => ({ mode: "waves", spawns: SPAWNS, waves: [{ turn: 2, entries: [{ unitId: U.wolf, count }] }] });
const fixed = (): Obj => ({ mode: "fixed", entries: [{ unitId: U.wolf, at: { c: 2, r: 0 } }] });
async function save(files: Record<string, Obj>): Promise<{ store: MakerStore; docs: Record<string, string> }> {
  const docs = text(files);
  const store = memoryStore();
  const wrote = await commitWrites(store, prefix(PID), asWrites(docs));
  if (!wrote.ok) {
    throw new Error("save");
  }
  return { store, docs };
}
test("f0c CN-029: core-types is DSK's staged copy byte for byte, settings.budgets is a ProjectBudgets, and the reader's budget rows still use it", () => {
  const staged = readFileSync("data/staging/cn-budgets/core-types.staged.ts");
  assert.deepEqual(readFileSync("src/types/core-types.ts"), staged);
  const limits: ProjectBudgets = { units: { warn: 7, limit: 9 } };
  const settings: CoreProject["settings"]["budgets"] = limits;
  const keys: BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
  assert.deepEqual(Object.keys(settings ?? {}), keys.slice(0, 1));
  const files = bag();
  ((files["project.json"] as Obj)["project"] as Obj)["settings"] = { wrapEdges: false, budgets: limits };
  const load = readProject(files);
  assert.deepEqual(budgetUse(load.project as Exclude<typeof load.project, null>).map((row) => `${row.budget}:${row.used}`), ["units:7"]);
  assert.deepEqual(load.report.filter((row) => row.code.startsWith("budget")).map((row) => `${row.code}|${row.severity}`), ["budgetNear|warning"]);
});
test("f0c gate: a weighted or waves pool that play refuses blocks Test and Build game with one line naming the stage; the reader still passes it", async () => {
  for (const pool of [weighted(2), waves(3)]) {
    const files = withPool(pool);
    const load = readProject(files);
    assert.equal(load.ok, true);
    const want = ["Demo stage: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list."];
    assert.deepEqual(poolLines(load), want);
    const gate = testGate(load.report, load.readOnly, stageNames(load), poolLines(load));
    assert.deepEqual(gate.allowed ? [] : [...gate.lines], want);
    const start = mock.fn();
    const saved = await save(files);
    const launched = await launchTest({ store: saved.store, id: PID, from: "project", start, stored: saved.docs, next: saved.docs, rev: 1, now: NOW });
    assert.equal(start.mock.callCount(), 0);
    assert.deepEqual(launched.ok ? [] : [...launched.lines], want);
    const get = mock.fn(() => Promise.resolve(""));
    const built = await buildGame(saved.store, PID, get);
    assert.equal(get.mock.callCount(), 0);
    assert.deepEqual(built.ok ? [] : [...built.lines], want);
  }
});
test("f0c gate: the pools proof: for every pool shape the gate's pool lines are empty exactly when play opens the stage", () => {
  const shapes: readonly [string, Obj, boolean][] = [["fixed", fixed(), true], ["weighted picks 0", weighted(0), true], ["weighted picks 1", weighted(1), false], ["weighted picks 8", weighted(8), false], ["waves 0 units", waves(0), true], ["waves 1 unit", waves(1), false], ["waves 16 units", waves(16), false]];
  for (const [name, pool, plays] of shapes) {
    const files = withPool(pool);
    const load = readProject(files);
    assert.equal(load.ok, true, name);
    const opened = openProject(files);
    assert.equal(opened.docs !== null, plays, name);
    assert.equal(poolLines(load).length === 0, plays, name);
    assert.equal(opened.docs === null ? opened.error : "", plays ? "" : "play: stage", name);
  }
});
test("f0c gate: pool lines come after the hard rows' lines, one per refused stage, named by the stage (the id when it has no name); a stage the reader already rejects adds none", () => {
  const files = withPool(weighted(2));
  const second = structuredClone(files[STAGE] as Obj);
  second["id"] = "stage_01JDAS00000000000000000002";
  delete second["name"];
  files["stages/stage_01JDAS00000000000000000002.json"] = second;
  const broken = structuredClone(second);
  broken["id"] = "stage_01JDAS00000000000000000003";
  broken["enemyPool"] = weighted(9);
  files["stages/stage_01JDAS00000000000000000003.json"] = broken;
  const load = readProject(files);
  assert.deepEqual(poolLines(load), [poolLine("Demo stage"), poolLine("stage_01JDAS00000000000000000002")]);
  const gate = testGate(load.report, load.readOnly, stageNames(load), poolLines(load));
  const lines = gate.allowed ? [] : [...gate.lines];
  assert.deepEqual(lines.slice(-2), poolLines(load));
  assert.equal(lines.length > 2, true);
  assert.deepEqual(poolLines({ project: null }), []);
});
test("f0c play: the engine reads stages with PLAY_LIMITS too: docsToInput hands them to the sim, which refuses a weighted or waves stage, and arriving into one fails the same way openProject does", () => {
  const files = bag();
  const opened = openProject(files);
  if (opened.docs === null) {
    throw new Error(opened.error);
  }
  const docs = opened.docs;
  assert.deepEqual(docsToInput(docs).input.stageLimits, PLAY_LIMITS);
  const party = { side: "player", members: docs.chosen.map((unitId) => ({ unitId, hp: 10 })), bar: null };
  for (const pool of [weighted(2), waves(3)]) {
    const stage = { ...(files[STAGE] as Obj), enemyPool: pool };
    assert.throws(() => createWorld(docsToInput({ ...docs, stage }).input), { message: /^stage: / });
    const into = withPool(pool);
    const arrived = arriveIn(into, null, SID, party);
    assert.deepEqual([arrived.docs, arrived.error], [null, openProject(into).error]);
    assert.equal(arrived.error, "play: stage");
  }
});
```
