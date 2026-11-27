# Rebuild record: step F1, the look kit (button roles and one primary, line icons, picker chips, framed-pill toggles, card thumbnails, the floating Undo chip)

Original brief: [`docs/maker/steps/step-f1-look-kit.md`](../maker/steps/step-f1-look-kit.md) on the merge (kit r3b, blob `7db91427`, sha256 `9d7ecff25ed21e5b0cddbf5117ae1e584341ca6ed41f7565c11ee85661e3227c`, 201 lines). Base L5; Delivery L7; Depends on L9; Read first L14; Kit L15; Goal L20; Placement card L30; Rulings L38 (1 roles, 2 one primary, 3 danger, 4 picker chips, 4b framed-pill toggles, 5 icons, 6 thumbs, 7 Undo chip, 8 Rule 8, 9 no map look, 10 New project's sub line); Files L74; Size L87 (table L89–L107); Interfaces L111 (`PATHS` L119); Smoke lines L121; Existing tests changed L131; Shipped tests L135; Plants L152; Do not touch L167; Acceptance L172; Not in this step L185; Out of scope L196; Open questions L200. Count command L87 (QA's G7); hard gate 400, F1's own limit **380** (L107, L178; over it the Undo chip moves to F4); per-file caps are the trial's counts (caps sum 379; trial 377). Go-line paste `/workspace/share/f1/step-f1-paste.md` (box only; sha256 `3ac35cd7e9049280718a8e0a8f919c927d2c2e36ca3797f8ebed55b96be775e1`, 10 lines; L1 the token placeholder). Shipped test `handoff/steps/tests/step-f1-look-kit/tests/tools/f1-look-kit.test.ts` (blob `28be62ac`, sha256 `83ef2acf241e6c1aa9117b19d778cea27745a9219e259817735faeec50df45f5`, 149 lines, 8 titles) and plants `handoff/steps/tests/step-f1-look-kit/plants-f1.py` (blob `806f5fd2`, sha256 `2f23d56c076a066f29556426c96bd789a36fedc82416ddd0bd1f8f3a67fad2ef`, 48 lines, 29 plants). The kit trial `f1-trial.patch` (sha256 `c0ea4042…`, trial commit `8ac4e693`, tree `4ccddd3f`) stayed on the box and was never pushed; see (d).

This is **F1**, the maker overhaul plan's look kit (`docs/maker/ux/maker-overhaul-plan.md` L69 and L83, size watch L276; order L82, CEO 03:53: F0c → F1 → ART1a), built from `docs/maker/style-spec.md` r2 § 5 and § 7 with UX's rulings of 2026-11-27 15:4x, 16:09 and 16:45. Every maker button names its role, and each screen or sheet has at most one primary (Test on the stage editor and the project page). Delete-type buttons are danger. A new `tools/maker/icons.ts` holds UX's 16 line icons. Pickers become `.pick` chips with `aria-pressed` and a picked ring. Every on/off toggle becomes a two-option § 5 framed pill built by `seg()`. Cards get 48 px icon thumbnails, and the floating Undo chip replaces the "Nothing to undo" bar. It is not a layout move (F2a, F2b, F4), the map's look (F3a, F3b) or any art, and no handler, saved data or format changes.

Sources: PR #114 (r2, merged). The r1 branch was never opened as a PR (QA reviewed it from the branch).
- Branches: `step/step-f1-look-kit-r1-chatA` (r1 code head `d0689c2c`, r1 tip `d56647be`; kept, not merged) and `step/step-f1-look-kit-r2-chatA` (r2 code head `f4f952d7`, r2 tip `e173f394`; a new branch from the base with the r1 code commit cherry-picked and amended).
- Hand-backs:
  - `handback/step-f1-look-kit/r1/HANDBACK.md` on the r1 branch only, not on main (HB1, blob `e2020f64`, 87 lines, sha256 `c01286fac3e1b590f84a88e00b8c6de2f21656f76128949e676c9b507ccc6a5e`).
  - `handback/step-f1-look-kit/r2/HANDBACK.md` on the merge (HB2, blob `7f57083a`, 126 lines, sha256 `1fc785d6a6bca27ba7f7254c806f31323129dc268c70381ab26e9308bcb4ab33`), with 20 shots: (a)–(g) at 390×844 and 360×844, (g) Grid lines On and Off, plus copies of `f01-stage-editor.png` and `f04-paint.png`.
- CoS verify reports: r1 `/workspace/share/step-f1-verify/report.md` (V1, sha256 `c9a9a88edc342fbdf866a46cb8545e05201c1a6667183db897d4da671fb0d983`): every listed check PASS, guide L119 FAIL (icons), so no PR. r2 `/workspace/share/step-f1-r2-verify/pr-body.md` (V2, PR #114's body): PASS.
- QA docs on main:
  - Kit, pushed with the kit in `04dadacf`: `docs/qa/step-f1-kit-review.md` (QK1, blob `fcc7dd06`, 55 lines, sha256 `61af49836084647ad320b294cbe2df8f3e689b5828a2dd9c0870921890148f3c`): **NOT OK TO SEND**, 2 must-fixes. `docs/qa/step-f1-kit-r2-recheck.md` (QK2, blob `f2784982`, 67 lines, sha256 `98167d73a67ce3153c37ab4cc5b48e0320685eda1532e360f30121775a50b099`): OK TO SEND for r2 only. `docs/qa/step-f1-kit-r3-recheck.md` (QK3, blob `684225c3`, 57 lines, sha256 `d4be12de8cb4ba0035841cae70e1580cb17e4a2a10801a1c8437c052454fbf3b`): OK TO SEND r3. `docs/qa/step-f1-kit-r3b-check.md` (QK3b, blob `5f5da11d`, 36 lines, sha256 `75f8add7c330c43512944a79d0c2cbe5ec6e98140bf7dd9ceaae08519f86069d`): OK TO SEND r3b.
  - `docs/qa/step-f1-handback-review.md` on `bf07a227` (QA1, blob `f07f6e81`, 52 lines, sha256 `823a5e62f75fe0b0f9cf18899287c42be6c2b2dde401d36c21e83d8e9ad170f5`): **NOT OK**, one r2 must-fix (M1 icons). With it, `docs/qa/step-f1-r2-go-line.md` (GL, blob `c7560dfc`, 23 lines, sha256 `c357e58fab9f193e742df7d7b4f957099a009aa38e784324e6fbbdbe443b47f2`).
  - `docs/qa/step-f1-r2-review.md` on `d901b075` (QA2, blob `4d288e5f`, 32 lines, sha256 `cb0cd58154d067fbb8d85758c71c2061780959d0715d4f4cafaf79fcbb089293`): **OK TO MERGE**, expected tree `b4c8168f`.

Line cites use HB1, HB2, V1, V2, QK1–QK3b, QA1, GL and QA2. Product line cites are at merge `b6c3da0e` (tree `b4c8168f`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `04dadacfc40d81d17b21df8f96ef1e11f9d2dbaa`, 2026-11-27 16:54 (UK time), tree `15abc6fd`. The kit push: the r3b guide, the shipped test and plants under `handoff/steps/tests/step-f1-look-kit/`, and QK1–QK3b (7 new files, docs and handoff only), on `e0455199` (the F0c record), which is docs-only on the F0c merge `bde1e737`. The guide names `e0455199` as its trial base (L5); `04dadacf` changes no `tools/` or `src/` file against it (QA1). Floor **1188** tests (1180 + N=8). The kit r3 trial `8ac4e693` on `e0455199` (tree `4ccddd3f`; r3b is guide-only on r3, QK3b) counted 377 (27 files, +292/−85), green 1188/0, plants 29/29, all 25 smokes PASS, audit 136/150/150 (guide L15, QK3) |
| Kit rounds | r1 (QK1, NOT OK TO SEND: the Undo chip's 48 px hit area unpinned; the dropped Budgets icon unrecorded), r2 (QK2, OK for r2 only: 339 lines, 23 plants), r3 (QK3, after UX's 16:09 rulings: two-option framed pills, and plus ghost rows for New project, + Add unit and + New effect; 377 lines, 29 plants), r3b (QK3b, guide only: UX 16:45, the On aria-label and `+ Add ability` icon carried) |
| r1 commits | On `step/step-f1-look-kit-r1-chatA`: `d0689c2c92d32cca0b7ef339633d7b08f814d874` feat(maker): step F1 look kit (r1 code head, tree `567d755a7c79f0a4fd8a614f68e63e06a578c195`, 2026-11-27 18:18 UK time), then `d56647be73c034ef426fddf2cfe852212655e8a8` docs(handback): step F1 look kit r1 (tree `1c79d23d42af57c83614b4bb2960bda38c9125a2`, 18:20; 26 files under `handback/step-f1-look-kit/r1/`). Linear on the base, noreply author and committer |
| r1 verdict | Green **1188/0**; tools tsc only the 3 base errors (`home.ts` now L93); plants 29/29; all 25 smokes PASS solo (HB1, V1; QA1: s8c failed once in a sequential run and passed solo twice); audit 136/150/150; 27 files, **374** (+289/−85), every cap held. CoS verify (V1): every listed check PASS, but guide L119 FAIL: all 16 `PATHS` values differ from the trial's, so CoS opened no PR. QA1 **NOT OK**, one r2 must-fix (M1) |
| r1 review push | `bf07a227056c82b13d1e7119e13d928104beca94`, 18:48 (UK time), tree `9d5f2e12`: QA1 and GL only (2 files) |
| r2 commits | On `step/step-f1-look-kit-r2-chatA`, from the base: `f4f952d755ff62a2336bb6e645dc0550a75e211c` feat(maker): step F1 look kit (r2 code head, tree `b9676b64899b3cbe727d9e69032472ed73309415`, the tree GL names; author date 18:18 kept from the cherry-pick), then `e173f394e943b795f3ba53cc2dfd258112cd1896` docs(handback): step F1 look kit r2 (tree `f1809c4c9970bdcac441551f75a46fca61169d07`, 19:13; 26 files under `handback/step-f1-look-kit/r2/`). From `d0689c2c` to `f4f952d7` only `tools/maker/icons.ts` L2–L17 change (16+/16−), byte-equal to GL's 16 lines |
| r2 verdict | Green **1188/0**; tools tsc only the 3 base errors; plants 29/29; shipped test unchanged; all 25 smokes PASS solo (HB2, V2; QA2 in one sequential run); audit 136/150/150; still **374**. CoS opened PR #114 (2026-11-27 19:53 UK time) and predicted the merge tree onto `bf07a227` as `b4c8168f`. QA2 **OK TO MERGE** |
| Merge | PR #114 (opened 19:53, merged 20:01), merge commit `b6c3da0ecc1b113a97e57f3365411d09caf260ac`, 2026-11-27 20:01 (UK time). Tree `b4c8168f46aeed54229c385d0a01dbf75b07e3a9` (the tree CoS and QA predicted). First parent `bf07a227056c82b13d1e7119e13d928104beca94`, second parent `e173f394e943b795f3ba53cc2dfd258112cd1896`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #114: Step F1: look kit (ChatA r2)`. Green on the merge: **1188 pass / 0 fail** |
| After the merge | `d901b07534014addc282b693cc3afd183331fced` (20:01, tree `b7bb006e`) adds only `docs/qa/step-f1-r2-review.md` (QA2) |
| Postmerge | CoS ran `qa-postmerge.sh b6c3da0e e173f394 --qa-tree b4c8168f --floor 1188`: **PASS** (parent 2 = the picked tip; noreply; the PR's src/tests/tools diff equals parent 1..merge; the tree matches QA's; 5/5 pins unchanged; green 1188/0; smoke 0 failed; one warning, main moved by the QA2 push). QA's own run of `qa-postmerge.sh b6c3da0e e173f394 --qa-tree b4c8168f --floor 1188`: **PASS** with the same results and one warning (main moved 1 commit, `d901b075`) |
| Tests | 1180 + N=8 (the eight shipped tests in `tests/tools/f1-look-kit.test.ts`) = **1188 pass / 0 fail**. The floor after this merge is **1188** |

## (b) Files

From `git diff --name-status bf07a227..b6c3da0e -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` against the merge's first parent, which is the same as against the base `04dadacf` for these files. Caps are the guide's Size table (L89–L107).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/maker/icons.ts` | A | 22 / 0 | 24 (trial 24+) | yes. **22**, under cap |
| `tools/maker/app.css` | M | 17 / 1 | 18 (trial 17+ 1−) | yes. **18**, on cap |
| `tools/maker/stage.ts` | M | 14 / 10 | 24 (trial 14+ 10−) | yes. **24**, on cap |
| `tools/maker/stage-sheets.ts` | M | 8 / 7 | 15 (trial 8+ 7−) | yes. **15**, on cap |
| `tools/maker/home.ts` | M | 9 / 8 | 17 (trial 9+ 8−) | yes. **17**, on cap |
| `tools/maker/rooms.ts` | M | 9 / 8 | 17 (trial 9+ 8−) | yes. **17**, on cap |
| `tools/maker/units.ts` | M | 9 / 8 | 17 (trial 9+ 8−) | yes. **17**, on cap |
| `tools/maker/widgets.ts` | M | 8 / 4 | 13 (trial 9+ 4−) | yes. **12**, under cap |
| `tools/maker/ability-panel.ts` | M | 7 / 6 | 13 (trial 7+ 6−) | yes. **13**, on cap |
| `tools/maker/effects.ts` | M | 5 / 4 | 9 (trial 5+ 4−) | yes. **9**, on cap |
| `tools/maker/levels.ts` | M | 5 / 4 | 9 (trial 5+ 4−) | yes. **9**, on cap |
| `tools/maker/project.ts` | M | 4 / 3 | 7 (trial 4+ 3−) | yes. **7**, on cap |
| `tools/maker/build-sheet.ts` | M | 4 / 3 | 7 (trial 4+ 3−) | yes. **7**, on cap |
| `tools/maker/add-ability.ts` | M | 2 / 2 | 4 (trial 2+ 2−) | yes. **4**, on cap |
| `tools/maker/art.ts` | M | 2 / 2 | 4 (trial 2+ 2−) | yes. **4**, on cap |
| `tools/maker/rules-panel.ts` | M | 1 / 1 | 2 (trial 1+ 1−) | yes. **2**, on cap |
| `tests/editor/project-home.test.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tests/editor/stage-editor.test.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | M | 2 / 2 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **4** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | M | 1 / 1 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **2** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s5a-units/smoke.mjs` | M | 2 / 2 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **4** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | M | 1 / 1 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **2** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | M | 3 / 3 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **6** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | M | 1 / 1 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **2** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | M | 1 / 1 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **2** (the eight: 12+ 12− = 24) |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | M | 1 / 1 | 26 for the eight (trial 12+ 12−; guide Size row says 13+ 13−) | yes. **2** (the eight: 12+ 12− = 24) |
| `tests/tools/f1-look-kit.test.ts` | A | 149 / 0 | 149 (shipped, verbatim) | yes. **149**, on cap (sha256 `83ef2acf241e6c1aa9117b19d778cea27745a9219e259817735faeec50df45f5`) |
| **Total** | 27 files | 289 / 85 | 380 (F1's limit; hard gate 400; trial 377) | **374** |

What the merge does not touch:
- Nothing under `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `.gitignore`, `data/` or `fixtures/` (QA1).
- `tools/maker/tokens.css` untouched; `app.css` changes only by dropping `.undo { width: 100%; }` from L51 and appending L59–L74. No `cells.css`. No `.cell`, `.choice`, `.card` or `.chip` rule changes (Ruling 9).
- `docs/maker/style-spec.md`, `docs/maker/shots/`, painter-proto and ui-shell untouched.
- No new dependency, icon font, emoji or image file outside `handback/`.
- Existing tests changed only on the two named lines (`tests/editor/project-home.test.ts` L45, `tests/editor/stage-editor.test.ts` L57); smokes changed only on the named lines in eight smokes (guide L121–L130).

The official count at either code head against the base, or at the merge against first parent `bf07a227`, is **27 files changed, 289 insertions(+), 85 deletions(-)** = 374, under F1's 380 and the hard gate of 400.

The trial counted 377 (+292/−85) in the same 27 files (`git apply --numstat /workspace/share/f1/f1-trial.patch`). r1's eight smokes equal the trial's, 12+ 12− (s4a 2/2, s4b 1/1, s5a 2/2, s5b 1/1, s6a 3/3, s6c 1/1, s8 1/1, s9b 1/1). The guide's Size row overcounts them as 13+ 13−: s8's two named replacements share one line, L34, in the trial too (HB1 § Smoke L47), and the Size table's rows sum to 293+/86−, not the stated 292/85. The 377 → 374 difference is only `tools/maker/icons.ts` (22 against the trial's 24, −2) and `tools/maker/widgets.ts` (8+ 4− against the trial's 9+ 4−, −1) (HB1 § Decisions L83); every other file equals the trial's numstat.

## (c) Key code and git commands

**Roles and one primary (Rulings 1–3).** Every maker `btn` carries one of `primary`, `ghost`, `danger` or `icon`. `primary` is a marker only; no `.btn.primary` CSS. `rg -n 'class="btn"' tools/maker` finds nothing. The primaries follow Ruling 2's table: Test on the stage editor (`s:test`) and the project page (`test`, with the play icon). Delete, Remove, Remove link, the ability row's × and Start new are `btn danger`. + Add stage, New project, + Add unit and + New effect are `btn ghost stage-row` rows with the plus icon and no "+" character; "+ Add ability" keeps its "+", since smokes press those words (guide L164; its plus icon is carried to F2b).

**Icons (Ruling 5).** `tools/maker/icons.ts` (22 lines, no imports): `const PATHS = { … } as const;` with the 16 entries at L2–L17 in the guide's order (play, undo, more, back, save, build, rules, image, grid, units, stages, effects, levels, edit, plus, resize), then the four exported lines quoted in guide L113–L117: `IconName`, `ICON_NAMES`, `icon(name)` returning `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">…</svg>`, and `thumb(name)` = `<span class="thumb">${icon(name)}</span>`. The values are UX's drawings from the trial, byte for byte, in backtick quotes (GL; only play and more's three circles carry `fill="currentColor"`). `rg -n '[⋯▶]' tools/maker --glob '*.ts'` finds nothing.

**Picker chips (Ruling 4).** The knob picker, ref built-ins and colour in `widgets.ts`, the ability's effect choices and the stage tile sheet's terrains are `class="pick"` with `aria-pressed`; the current terrain is pressed. The colour chip shows a 28 px `.sw` swatch. CSS `.pick`, `.pick[aria-pressed="true"]` (the picked ring), `.pick:has(.sw)` and `.sw` at app.css L59–L62.

**Framed-pill toggles (Ruling 4b).** `widgets.ts` gains `export function seg(label: string, on: boolean, act: string): string` (L8–L11): `const opt` and `return`, one statement each. It renders `<div class="seg-row"><span class="seg-label">{label}</span><span class="seg" role="group" data-seg="{act}">{Off}{On}</span></div>`. Exactly one option is pressed, and only the option that isn't set carries `data-act`, so the handlers, saved data and undo are unchanged. The On option's `aria-label` is the label itself, and Off's is `{label}: Off`. The call sites are the knob toggle (`widgets.ts`), Grid lines and Autosave here (`stage.ts`) and On your team (`units.ts`). CSS `.seg-row`, `.seg`, `.seg-opt`, `.seg-opt > span` and the pressed fill at app.css L70–L74.

**Thumbnails (Ruling 6).** `thumb(…)` is first in the card for My games rows and project stage rows (stages), maps (grid), units, effects and the levels card. `.thumb` at app.css L66.

**Undo chip (Ruling 7).** The dock's Undo / "Nothing to undo" button goes; the dock renders only with a status chip or note. `stage.ts` adds `const goes`, `const over` (the stage's own sheets joined) and `const undo`, which is `<div class="float"><button type="button" class="undo-chip" data-act="s:undo"><span>${icon("undo")}Undo</span></button></div>` only when not read-only, `over` is `""` and `canUndo(sess.stack)`. CSS `.float` and `.undo-chip` (48 px hit area: `min-height: 48px; padding: 4px`, `z-index: 4` under `.scrim`) and the 40 px `.undo-chip > span` pill at app.css L67–L69. The shipped test pins the whole `.undo-chip` rule; no smoke measures it (QK2).

**Shipped tests:** 1–8 in `tests/tools/f1-look-kit.test.ts` (149/149, verbatim), titles as guide L141–L148.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff bf07a227 b6c3da0e -- . ':!handback/**' ':!docs/**'
#   (the 27 files in (b))
#
# The hand-back and shots (not in the 400):
#   git show b6c3da0e:handback/step-f1-look-kit/r2/HANDBACK.md
#   git show d56647be:handback/step-f1-look-kit/r1/HANDBACK.md   (r1 branch only)
#
# r2 rework only:
#   git diff d0689c2c f4f952d7   (tools/maker/icons.ts 16/16, L2–L17)
#
# Product gate. Official command at either code head against the base 04dadacf,
# or at the merge against first parent bf07a227:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   27 files changed, 289 insertions(+), 85 deletions(-)
#
# At b6c3da0e against 04dadacf the same command also lists QA1 and GL
# (docs/qa); add ':!docs/**' to get 374 again. Trial r3 (8ac4e693) was 292 + 85 = 377.
#
# Named tests (npm test 1188/0, floor 1180 + N=8): the eight "F1 …" titles of
# tests/tools/f1-look-kit.test.ts (button order, danger, pickers, toggles, icons,
# thumbs, the Undo chip and its 48 px rule).
#
# tools tsc: only effect-designer page.ts L101 (TS18047) and maker home.ts L93
# (×2, TS7053; L92 on the base, moved by the icons import).
#
# Smokes: all 25 solo at 390 and 360, at the guide counts:
#   S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16,
#   s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8,
#   s10d 8, s11a 6, s11a2 6, s11b (8840) 6, s11c1 6.
# Eight edited by ruling (guide L121–L130): s4a L26/L28 and s4b L28 (.choice → .pick);
#   s9b L27 (no Undo button when there is nothing to undo); s5a L33/L41 and s5b L73
#   ("+ Add unit" → "Add unit"); s6a L31/L38/L45 and s6c L81 (state read from the
#   pressed seg option); s8 L34 (both replacements on one line).
# HB1: s6d, s8c and s9c first failed with ENOENT because s6c rewrites the tracked
#   checkpoint project; after restoring handback/ they passed solo. HB2 restored
#   handback/ after every smoke. QA1: s8c failed once in sequence, then passed solo
#   twice. CoS (V1, V2) ran all 25 solo with no failure; s11b on 8840.
#
# Plants: handoff/steps/tests/step-f1-look-kit/plants-f1.py (2f23d56c), 29/29 caught
# at both code heads (HB1, HB2, V1, V2, QA1, QA2), tree clean after: P1–P29 as guide
# L153 (primaries, bare btn, chips and the ring, swatches, danger, play and ⋯,
# a filled icon, thumbs, the Undo chip's conditions and 48 px area, chip padding,
# the toggles' two options, press state and act, the plus rows).
#
# Export audit: builder self-run (/tmp/f1-audit.mjs) and s8-audit.mjs both
# 136 / 150 / 150, 0 hits, AUDIT PASS (unchanged; F1 touches no play file).
```

## (d) What went wrong, in order, and the fix

**Kit r1 → r3b, before any build.**
- **The Undo chip's 48 px hit area wasn't pinned (QK1 must-fix 1).** QA planted `.undo-chip { min-height: 0; padding: 0; }`, and green, the shipped test and the S0, s3, s4a, s4b and s9b smokes all still passed. From r2 the test pins the whole `.undo-chip` rule (QK2: test L140, `rule()` asserts each rule appears once), with plants P16 (an override appended) and P17 (the button shrunk in place). Ruling 7 and the Smoke lines (L125) now say the shipped test pins the chip and no smoke measures it (QK2).
- **The Budgets icon was dropped without a record (QK1 must-fix 2).** Its `aria-hidden` SVG broke `tests/project/budgets-11c1.test.ts` L124, which counts exactly four `aria-hidden="true"` meters. The guide now carries it to F2a (L186).
- **UX's 16:09 rulings (r3).** A framed pill with one option reads as a selected chip, so every toggle became the two-option `seg()`, and New project, + Add unit and + New effect became plus ghost rows. 29 plants, 377 lines, each file exactly at its cap (QK3).
- **UX's 16:45 rulings (r3b, guide only).** The On aria-label `{label}: On` would need 7 smoke edits (377 + 14 = 391 > 380), so it went to F2a; `+ Add ability`'s plus icon went to F2b (QK3b).

**r1: the icon paths weren't UX's (QA1 M1).** Ruling 5 says "UX's drawings verbatim", and L119 says the values are "UX's paths as in the trial patch, byte for byte". All 16 of r1's values differed. It showed in the shots: Rules a document instead of UX's flag, units two people instead of one, build a wrench instead of a down arrow into a tray, levels bars instead of a star, grid four squares instead of a 3×3 grid (QA1). **The cause was a kit gap, not a builder miss:** UX's paths existed only in the box-only `f1-trial.patch`, and the repo at `04dadacf` held none of them (only undo's prefix and edit's path, which the shipped test pins). ChatA flagged it in HB1 § Decisions L83. The shipped test and plants pass either set, so nothing caught it. CoS's verify caught it (V1) and opened no PR. QA1 put the 16 lines in the r2 go-line (GL); r2 cherry-picked `d0689c2c` onto the base and replaced only `icons.ts` L2–L17. The code tree `b9676b64` is the one QA predicted.

**r1 flags QA accepted (QA1).**
- **F-a.** `stage.ts`'s `group` moves the null check into `mine.length === 0 || cell === null ? ""` and drops `cell !== null &&` from `aria-pressed`. `group` is only called inside the sheet built when `cell !== null`, so there is no runtime change; QA ruled it a type-narrowing form of the named terrain-chip edit. Accepted.
- **F-b.** Three placements that Rulings 5 and 6 name are missing: the stage error-state Back icon (`stage.ts` L142), the `u:rename` edit icon, and the read-only/newer levels card thumb. The trial lacks all three, so the file caps can't fit them. Carried to F2a. CoS's V1 named a fourth (read-only Save); QA1 found it present in r1. CoS's r2 hand-off note said the trial had the levels-card thumb; QA2 checked f1-trial.patch: the trial adds thumbs only to the Off and normal levels cards.
- **F-c.** r1 adds the save icon on every sheet Save, which the trial didn't; "save on Save" (Ruling 5) makes r1 the closer reading. Accepted.
- **F-d.** Import order only (`units.ts`, `home.ts`). Accepted.
- **F-e.** HB1 § Green had the counts but not the code head; r2's § Green gives the code head and tree, and says the tip (which can't hold its own sha) is quoted in the hand-back message.

**The r2 go-line file.** `docs/qa/step-f1-r2-go-line.md` (GL, as pushed) has no line 1 token placeholder (`export GH_BUILDER_TOKEN=<PASTE TOKEN HERE>`) and no "Use all your helper agents, take your time, never rush, and self-review before hand-back." line. CoS flagged both before the go; CoS reports adding them to the message sent to ChatA. The repo file is unchanged.

**Other notes.**
- QA1's sequential run saw s8c fail once ("no hero") and pass solo twice; ChatA's first pass saw s6d, s8c and s9c fail after s6c rewrote the tracked checkpoint project. The guide asks for solo PASS, which held every time.
- Guide drift: the Size table (L89–L107) gives the eight smokes 13+ 13− and its rows sum to 293+/86−, but the trial patch has 12+ 12− in the smokes and 292+/85− in all; the caps and the 380 limit are unaffected.
- The builder ran Node v22.23.3 (HB1 L4, HB2 L4; `.nvmrc` says 24).

## (e) Do it right first time

- **A kit puts every byte-for-byte artifact in the repo or in the go-line, never only on the box.** If the guide says "as in the trial patch", the bytes must be in the guide, the shipped test or a pushed kit file. Here UX's 16 paths lived only in `/workspace/share/f1/f1-trial.patch`, which the builder couldn't see.
- A shipped test that pins only part of a byte-exact artifact (undo's prefix, edit's path) can't catch the rest; pin the whole thing or quote it in the guide.
- A go-line file needs line 1 `export GH_BUILDER_TOKEN=<PASTE TOKEN HERE>` and the helper-agents line, like every paste; check both before the go.
- The work is only in the 27 Files-list files; tokens.css and app.css's base lines stay byte for byte; no new words on any button except Off and On.
- Rule 8: one statement per line in all new code; the only edits inside existing dense lines are the class swaps, icon and thumb insertions, `seg(…)` calls and `aria-pressed` additions the guide names.
- Stay inside each file cap; at the cap, leave a placement out and name it in § Decisions rather than packing.
- Restore tracked `handback/` after each smoke (s6c rewrites the checkpoint project).

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only docs: QA2):
#   git diff b6c3da0e HEAD -- <the 27 files in (b)>
#   (empty)
#
# Product gate at the merge against first parent bf07a227:
#   git diff --shortstat bf07a227..b6c3da0e -- . ':!handback/**' ':!node_modules'
#   27 files changed, 289 insertions(+), 85 deletions(-)
#
# Green: npm ci && npm run green → 1188 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L93 ×2).
# Smokes: all 25 solo at 390 and 360 at the counts in (c), restoring handback/ after each.
# Export audit: 136 / 150 / 150, AUDIT PASS.
# Plants: python3 handoff/steps/tests/step-f1-look-kit/plants-f1.py → 29/29 caught.
# Look kit: rg -n 'class="btn"' tools/maker → nothing; rg -n '[⋯▶]' tools/maker --glob '*.ts' → nothing;
#   git diff 04dadacf HEAD -- tools/maker/tokens.css → empty;
#   git show HEAD:tools/maker/icons.ts | sed -n 2,17p equals docs/qa/step-f1-r2-go-line.md L5–L20.
```

## QA non-blockers carried forward

- **To F2a** (guide L185–L194, QK3, QK3b, QA1, QA2):
  - The On option's aria-label becomes `{label}: On` to match Off's (UX 16:45), with a pin in the toggles test and a plant; 7 smoke edits (s6a L54/L60/L62, s6c L57/L62/L63/L69).
  - The dead `.card.new` in `app.css` L8 (no markup uses `card new` any more). HB2 § Next step omits it; it stays on QA's list.
  - The Budgets icon, with the ☰ game menu's Budgets row (re-pins `tests/project/budgets-11c1.test.ts` L124 by ruling).
  - F-b's three placements: the stage error-state Back icon (`stage.ts` L142), the `u:rename` edit icon, the read-only/newer levels card thumb.
  - Eyebrow headers (UX 15:4x); icons for ☰, the stage switcher, the tool bar, close and chevrons as they ship (F2a, F4).
- **To F2b:** `+ Add ability` gets the plus icon (UX 16:45).
- **To F4:** the § 7 `.chips` wrap row (chips stay full width in today's sheets until F4's tool sheets; UX 15:4x); the unit page's 72×72 big thumb (shot `f08`).
- **To F3b:** pictures in thumbnails and chips; the terrain chip's swatch or picture.
- **Unchanged:** the 11a2 ready-sheet body rides with 11c2 after F6; QA's 11c1 carries stay with 11c2; the F0c, 11a, 11a2 and 11b carries stand.
- **Process:** the builder's Node is v22 (`.nvmrc` 24); port 8820 held by another process on the box (s11b on 8840).
- **Closed here:** plan F1 (style-spec r2 § 5 and § 7: roles, one primary, danger, icons, picker chips, framed-pill toggles, thumbnails, the Undo chip), QK1 must-fixes 1–2, QA1 M1.

## Blob check

Each file must have exactly this git blob id at `b6c3da0e`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/maker/icons.ts` | `9fc4a6b1f5ec3685b8d3c4ccc04095b53cd7994c` | 22 |
| `tools/maker/app.css` | `a20e4779e71f6dc9da603b12ee277d0d5203ff71` | 74 |
| `tools/maker/stage.ts` | `4132a9394182c920d7f5bc7d3d8eb6e1d82a86ac` | 276 |
| `tools/maker/stage-sheets.ts` | `5cd7771a3382c1080d6d58e5cb8134bdf927abdd` | 12 |
| `tools/maker/home.ts` | `0ceea31b37e01e6d66fac72ce9cfd6d7e0691aa8` | 228 |
| `tools/maker/rooms.ts` | `40fd1bac3fa1862a444a2cb5a0af93eaff62d6a2` | 139 |
| `tools/maker/units.ts` | `2a12cd17294c50482e981e1c6cde1b06d2e73325` | 184 |
| `tools/maker/widgets.ts` | `a72190e1a79628678ed907ed981dfae153ae22fa` | 31 |
| `tools/maker/ability-panel.ts` | `23bb8d533d507e976692bd661fab8c656c0fd707` | 114 |
| `tools/maker/effects.ts` | `be0d10f836f8cfe17a4263a97cee0f42622185bd` | 91 |
| `tools/maker/levels.ts` | `dd29facae87f683a0f9028aac913b80dcf33ef48` | 75 |
| `tools/maker/project.ts` | `461d1bab8a0754946381e50447821c02dcd759cf` | 11 |
| `tools/maker/build-sheet.ts` | `2960b2ad8a24e906d4b818c9dee679d1d116c67f` | 15 |
| `tools/maker/add-ability.ts` | `4027dad2ce667f0acccad60f637936f680c4ea82` | 52 |
| `tools/maker/art.ts` | `e56b755d1422d978535766458d88939cf947c68a` | 75 |
| `tools/maker/rules-panel.ts` | `f06430e04b96f058cf0fa7d875f91aa0ed56366c` | 87 |
| `tests/editor/project-home.test.ts` | `a47b3cfc07a997087733d0bbf8eec17714d321f8` | 46 |
| `tests/editor/stage-editor.test.ts` | `9c56fd5f584c92241b5c61aa8cc65f231a13ab2a` | 58 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | `d1602f930e81ccb74f797f30793c03dd6aa1fc5c` | 48 |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | `a001bdbe938e8c97a9152cee834efcd6d63200fc` | 51 |
| `handoff/steps/tests/s5a-units/smoke.mjs` | `1471d485c604e77545a0e88bc0aafbfec5355b77` | 74 |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | `792db34389ee942c8fa09711ea956acf342586e0` | 84 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | `729f7e33d659176a34362b48bb41bb4f1829124b` | 76 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | `70178135e3615c8029125d5232716e33a8ab538e` | 119 |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | `c7404b27a689b64e0fcbe9fb67cb2c863209fbfe` | 44 |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | `fed5324cbdd4ac38545da6ce10395d03cbbdff96` | 67 |
| `tests/tools/f1-look-kit.test.ts` | `28be62acd8d7f9e02f20691f22ba83e6e3689733` | 149 |

## Appendix: full code as merged (step F1, PR #114)

New files are `git show b6c3da0e:<path>` in full. Edited files are `git diff bf07a227 b6c3da0e -- <path>`, which is the same as against the base `04dadacf`.

### `tools/maker/icons.ts` (new)

```ts
const PATHS = {
  play: `<path d="M8 5l11 7-11 7z" fill="currentColor"/>`,
  undo: `<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>`,
  more: `<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>`,
  back: `<path d="M15 6l-6 6 6 6"/>`,
  save: `<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>`,
  build: `<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>`,
  rules: `<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>`,
  image: `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>`,
  grid: `<path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16"/>`,
  units: `<circle cx="12" cy="7" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  stages: `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>`,
  effects: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>`,
  levels: `<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>`,
  edit: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
} as const;
export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as readonly IconName[];
export const icon = (name: IconName): string => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name]}</svg>`;
export const thumb = (name: IconName): string => `<span class="thumb">${icon(name)}</span>`;
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index 8098e69..a20e477 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -48,7 +48,7 @@ input.name-field { width: 100%; box-sizing: border-box; min-height: 48px; border
 .ability summary { min-height: 48px; max-width: 100%; display: block; }
 details.ability:not([open]) > :not(summary) { display: none; }
 .toast.above { top: 16px; bottom: auto; z-index: 6; }
-.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); } .undo { width: 100%; }
+.dock { display: flex; flex-direction: column; gap: 8px; padding: 8px 16px calc(8px + env(safe-area-inset-bottom)); background: var(--surface); border-top: 1px solid var(--line); }
 .chip { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 48px; padding: 6px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--ink); font-size: 0.78rem; font-weight: 600; }
 input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px; min-height: 48px; min-width: 48px; accent-color: var(--accent); }
 .reach-grid { display: grid; grid-template-columns: repeat(7, 36px); grid-template-rows: repeat(7, 16px); gap: 2px; width: 264px; height: 124px; flex: none; align-self: flex-start; }
@@ -56,3 +56,19 @@ input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px;
 .reach-grid span.on { background: var(--accent-soft); color: var(--ink); }
 button.card.ability-add { flex-direction: column; align-items: flex-start; }
 .spin { width: 18px; height: 18px; margin-right: 8px; border: 2px solid var(--line); border-top-color: var(--ink); border-radius: 999px; display: inline-block; vertical-align: middle; animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
+.pick { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 14px; border-radius: 999px; border: 2px solid var(--line); background: var(--surface); color: var(--ink); font-weight: 700; font-size: 0.9rem; }
+.pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }
+.pick:has(.sw) { padding: 0 14px 0 8px; }
+.sw { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--line); flex: none; }
+.ico { width: 24px; height: 24px; flex: none; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; vertical-align: middle; }
+.btn > .ico { margin: -2px 6px 0 -2px; }
+.btn.icon > .ico { margin: 0; }
+.thumb { box-sizing: border-box; width: 48px; height: 48px; border-radius: 8px; flex: none; display: grid; place-items: center; background: var(--surface-2); border: 1px solid var(--line); color: var(--muted); }
+.float { position: relative; height: 0; }
+.undo-chip { position: absolute; z-index: 4; left: 12px; bottom: calc(8px + env(safe-area-inset-bottom)); min-height: 48px; padding: 4px; border: 0; background: transparent; }
+.undo-chip > span { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); font-weight: 700; color: var(--ink); }
+.seg-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; }
+.seg { display: inline-flex; align-items: center; flex: none; height: 40px; box-sizing: border-box; border: 1px solid var(--seg-line); border-radius: 12px; background: var(--surface); }
+.seg-opt { min-height: 48px; margin: -5px 0; padding: 0; border: 0; background: transparent; color: var(--ink); font-weight: 700; }
+.seg-opt > span { display: inline-flex; align-items: center; height: 30px; margin: 0 4px; padding: 0 12px; border-radius: 8px; }
+.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index e4347d3..4132a93 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -12,6 +12,8 @@ import { parseProject } from "./project-files.ts";
 import { rulesSheet } from "./rules-panel.ts";
 import { askSheet, goesSheet, LINK_LABEL, moveChip, placeButtons, talkSheet, unitButtons, unitPicker } from "./stage-sheets.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
+import { icon } from "./icons.ts";
+import { seg } from "./widgets.ts";
 type Obj = Record<string, unknown>;
 type Cell = { readonly c: number; readonly r: number };
 type Mark = { readonly c: number; readonly r: number; readonly letter: string; readonly pill: string; readonly name: string; readonly list: PlaceList; readonly index: number; readonly id: string; readonly n: number };
@@ -144,30 +146,32 @@ export function stageScreen(stageId: string, host: Host): string {
   const code = host.banner !== null && host.banner.startsWith("Couldn't save") ? "writeFailed" : host.banner !== null && host.banner.startsWith("This project changed") ? "staleRev" : "";
   const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
-  const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
-  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="b:open">Background</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
+  const start = host.readOnly ? "" : `<button type="button" class="btn danger" data-act="s:fresh">Start new</button>`;
+  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">${icon("grid")}View</button><button type="button" class="btn ghost" data-act="b:open">${icon("image")}Background</button><button type="button" class="btn ghost" data-act="r:open">${icon("rules")}Rules</button>${start}<button type="button" class="btn primary" data-act="s:test">${icon("play")}Test</button></header>`;
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
   const names = stageRows(host.files), linked = mark === null && cell !== null ? linkOn(got.stage, cell.c, cell.r) : null, linkType = linked !== null && (linked["type"] === "stairs" || linked["type"] === "door" || linked["type"] === "gate") ? linked["type"] : null;
   const rows = sheetRows(got.slice, mark !== null);
-  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="choice" data-act="s:type:${esc(row.id)}">${esc(row.label)}</button>`).join("")}`; };
-  const stood = linkType !== null ? `<button type="button" class="btn" data-act="s:autosave" aria-pressed="${linked?.["autosave"] === true ? "true" : "false"}">Autosave here: ${linked?.["autosave"] === true ? "On" : "Off"}</button><button type="button" class="btn" data-act="s:unlink">Remove link</button>` : mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
+  const group = (title: SheetRow["group"]): string => { const mine = rows.filter((row) => row.group === title); return mine.length === 0 || cell === null ? "" : `<p class="sub">${title}</p>${mine.map((row) => `<button type="button" class="pick" data-act="s:type:${esc(row.id)}" aria-pressed="${tileId(got.map, cell.c, cell.r) === row.id ? "true" : "false"}">${esc(row.label)}</button>`).join("")}`; };
+  const stood = linkType !== null ? `${seg("Autosave here", linked?.["autosave"] === true, "s:autosave")}<button type="button" class="btn danger" data-act="s:unlink">Remove link</button>` : mark === null ? "" : `${unitButtons(mark.pill === "NPC", mark.id !== "" && stageFor(got.parsed, mark.id) !== null)}`;
   const place = linkType === null && mark === null && cell !== null && !closedType(got.slice, tileId(got.map, cell.c, cell.r)) ? placeButtons(placeRows(got.stage)) : "";
-  const linkBtns = place !== "" && names.some((row) => row.id !== stageId) ? `<p class="sub">Link</p>${(["stairs", "door", "gate"] as const).map((type) => `<button type="button" class="btn" data-act="s:link:${type}">${LINK_LABEL[type]}</button>`).join("")}` : "";
+  const linkBtns = place !== "" && names.some((row) => row.id !== stageId) ? `<p class="sub">Link</p>${(["stairs", "door", "gate"] as const).map((type) => `<button type="button" class="btn ghost" data-act="s:link:${type}">${LINK_LABEL[type]}</button>`).join("")}` : "";
   const title = linkType !== null ? `${esc(LINK_LABEL[linkType])} to ${esc(typeof linked?.["to"] === "string" ? names.find((row) => row.id === linked["to"])?.name ?? "Stage" : "")}` : mark === null ? "Add here" : `${esc(mark.name)} · ${esc(teamOf(mark.pill))}`;
   const where = mark === null && cell !== null ? `<p class="sub">Tile ${cell.c},${cell.r}</p>` : "";
   const sheet = host.readOnly || cell === null ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>${title}</h2>${where}${stood}${place}${linkBtns}${group("Ground")}${group("Terrain")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
-  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2><button type="button" class="choice" data-act="s:grid">Grid lines: ${sess.gridOn ? "On" : "Off"}</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
+  const view = sess.view ? `<div class="scrim"><div class="sheet" role="dialog"><h2>View</h2>${seg("Grid lines", sess.gridOn, "s:grid")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>` : "";
   const confirm = !host.readOnly && sess.confirm ? `<div class="scrim"><div class="sheet" role="dialog"><h2>Start new</h2><p>Every tile goes back to Floor, and every NPC and enemy is removed. Your team's start tiles stay. You can Undo this.</p><button type="button" class="btn danger" data-act="s:fresh-go">Start new</button><button type="button" class="btn ghost" data-act="s:close">Cancel</button></div></div>` : "";
-  const undo = host.readOnly ? "" : `<button type="button" class="btn ghost undo" data-act="s:undo"${canUndo(sess.stack) ? "" : " disabled"}>${canUndo(sess.stack) ? "Undo" : "Nothing to undo"}</button>`;
   const noted = sess.note === null ? "" : `<p class="sub">${esc(sess.note)}</p>`;
-  const painting = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn" data-act="s:done">Done</button></div>`;
+  const painting = sess.painting === null ? "" : `<div class="chip" role="status"><span>Painting ${esc(sess.label)} · Tap more tiles</span><button type="button" class="btn ghost" data-act="s:done">Done</button></div>`;
   const chip = `${painting}${sess.moving === null ? "" : moveChip(sess.moving.name)}${noted}`;
-  const dock = undo === "" && chip === "" ? "" : `<div class="dock">${undo}${chip}</div>`;
+  const dock = chip === "" ? "" : `<div class="dock">${chip}</div>`;
   const info = infoText(got.stage, chosen(got.parsed, got.stage).length).map((line) => `<p class="sub">${esc(line)}</p>`).join("");
   const who = sess.ask === null ? "" : askName(got.parsed, got.stage, sess.ask);
   const ask = sess.ask === null ? "" : sess.talking ? talkSheet(who, talkLimit(got.slice), sess.line) : askSheet(who);
   const pick = sess.pick === null ? "" : unitPicker(unitChoices(got.parsed));
-  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, got.stage, placed, sess.sel)}</div>${dock}${sheet}${sess.link === null ? "" : goesSheet(LINK_LABEL[sess.link], names.filter((row) => row.id !== stageId))}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
+  const goes = sess.link === null ? "" : goesSheet(LINK_LABEL[sess.link], names.filter((row) => row.id !== stageId));
+  const over = `${sheet}${goes}${pick}${ask}${view}${confirm}${rulesSheet(host.files, stageId, host.readOnly)}`;
+  const undo = host.readOnly || over !== "" || !canUndo(sess.stack) ? "" : `<div class="float"><button type="button" class="undo-chip" data-act="s:undo"><span>${icon("undo")}Undo</span></button></div>`;
+  return `${bar}<div class="body stage">${banner}${info}${note}${cellsHtml(got.map, got.slice, got.stage, placed, sess.sel)}</div>${undo}${dock}${over}`;
 }
 function kept(host: Host): StageOut { return { ...host, leave: false, test: false }; }
 export async function stageClick(act: string, stageId: string, host: Host, io: Io): Promise<StageOut> {
```

### `tools/maker/stage-sheets.ts` (edited)

```diff
diff --git a/tools/maker/stage-sheets.ts b/tools/maker/stage-sheets.ts
index 99e7990..5cd7771 100644
--- a/tools/maker/stage-sheets.ts
+++ b/tools/maker/stage-sheets.ts
@@ -1,11 +1,12 @@
+import { icon } from "./icons.ts";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export const placeButtons = (rows: readonly { readonly id: string; readonly label: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:place:${esc(row.id)}">${esc(row.label)}</button>`).join("");
+export const placeButtons = (rows: readonly { readonly id: string; readonly label: string }[]): string => rows.map((row) => `<button type="button" class="btn ghost" data-act="s:place:${esc(row.id)}">${esc(row.label)}</button>`).join("");
 export const LINK_LABEL = { stairs: "Stairs", door: "Door", gate: "Gate" } as const;
-export const linkRows = (rows: readonly { readonly id: string; readonly name: string }[]): string => rows.map((row) => `<button type="button" class="btn" data-act="s:to:${esc(row.id)}">${esc(row.name)}</button>`).join("");
+export const linkRows = (rows: readonly { readonly id: string; readonly name: string }[]): string => rows.map((row) => `<button type="button" class="btn ghost" data-act="s:to:${esc(row.id)}">${esc(row.name)}</button>`).join("");
 export const goesSheet = (label: string, rows: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(label)} goes to</h2>${linkRows(rows)}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
-export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
-export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn" data-act="s:stand">Just stand here</button><button type="button" class="btn" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
-export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn" data-act="s:talk-save">Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
-export const unitButtons = (npc: boolean, test: boolean): string => `<button type="button" class="btn" data-act="s:edit">Edit</button><button type="button" class="btn" data-act="s:move">Move</button><button type="button" class="btn" data-act="s:delete">Delete</button>${test ? `<button type="button" class="btn" data-act="s:try">Test</button>` : ""}${npc ? `<button type="button" class="btn" data-act="s:ask">What do they do?</button>` : ""}`;
-export const moveChip = (name: string): string => `<div class="chip" role="status"><span>Moving ${esc(name)} · Tap a tile</span><button type="button" class="btn" data-act="s:move-cancel">Cancel</button></div>`;
+export const unitPicker = (units: readonly { readonly id: string; readonly name: string }[]): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a unit</h2>${units.map((unit) => `<button type="button" class="btn ghost" data-act="s:unit:${esc(unit.id)}">${esc(unit.name)}</button>`).join("")}<button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
+export const askSheet = (name: string): string => `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><button type="button" class="btn ghost" data-act="s:stand">Just stand here</button><button type="button" class="btn ghost" data-act="s:talk-open">Talk</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`;
+export const talkSheet = (name: string, max: number | null, line: string): string => { const cap = max === null ? "" : ` maxlength="${max}" data-max="${max}"`; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(name)} placed: What do they do?</h2><p>NPCs are neutral: no one can attack them, and they don't act.</p><input class="name-field" data-talk${cap} value="${esc(line)}" aria-label="Talk line"><button type="button" class="btn primary" data-act="s:talk-save">${icon("save")}Save</button><button type="button" class="btn ghost" data-act="s:close">Close</button></div></div>`; };
+export const unitButtons = (npc: boolean, test: boolean): string => `<button type="button" class="btn ghost" data-act="s:edit">${icon("edit")}Edit</button><button type="button" class="btn ghost" data-act="s:move">Move</button><button type="button" class="btn danger" data-act="s:delete">Delete</button>${test ? `<button type="button" class="btn ghost" data-act="s:try">${icon("play")}Test</button>` : ""}${npc ? `<button type="button" class="btn ghost" data-act="s:ask">What do they do?</button>` : ""}`;
+export const moveChip = (name: string): string => `<div class="chip" role="status"><span>Moving ${esc(name)} · Tap a tile</span><button type="button" class="btn ghost" data-act="s:move-cancel">Cancel</button></div>`;
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index a4dd506..0ceea31 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -4,6 +4,7 @@ import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
 import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
+import { icon, thumb } from "./icons.ts";
 import { budgetsRow, budgetsTap } from "./budgets.ts";
 import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
@@ -32,24 +33,24 @@ const app = (): HTMLElement => { const node = document.querySelector("#app"); if
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
 const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
 const go = (act: string): void => { gate = gate.then(() => run(act)).catch(fail); };
-const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
+const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card">${thumb("stages")}<${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">${icon("more")}</button></article>`; };
 function sheet(): string {
-  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
+  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn primary" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
   if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
   if (state.screen !== "name" && state.screen !== "rename") return "";
-  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
+  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn primary" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? `${icon("save")}Save name` : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn ghost" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
-  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
+  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn primary" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${budgetsRow(state.files)}${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn ghost" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${budgetsRow(state.files)}${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
-  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
-  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
+  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">${icon("back")}Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
+  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="btn ghost stage-row" data-act="new">${icon("plus")}New project</button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
 async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
```

### `tools/maker/rooms.ts` (edited)

```diff
diff --git a/tools/maker/rooms.ts b/tools/maker/rooms.ts
index e40e740..40fd1ba 100644
--- a/tools/maker/rooms.ts
+++ b/tools/maker/rooms.ts
@@ -4,6 +4,7 @@ import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc, setStart }
 import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
+import { icon, thumb } from "./icons.ts";
 type Obj = Record<string, unknown>;
 type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
 type Sess = { project: string; mode: "add" | "menu" | "rename" | "resize" | "ask" | "note" | null; which: "stage" | "map"; target: string; cols: number; rows: number; name: string; lines: string[]; hidden: string[]; stack: Snap[] };
@@ -54,10 +55,10 @@ export function roomTail(files: DocText, readOnly: boolean): string {
   const bag = bagOf(files); if (bag === null) return "";
   const maps = docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"]))).map(({ doc }) => {
     const id = String(doc["id"]), name = typeof doc["name"] === "string" ? doc["name"] : "Map", used = refsTo(bag, id).length;
-    const menu = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:map:${esc(id)}" aria-label="Menu ${esc(name)}">⋯</button>`;
-    return `<div class="card"><div class="grow"><span class="name">${esc(name)}</span><span class="sub">${esc(String(doc["cols"]))} × ${esc(String(doc["rows"]))} · Used by ${used} ${used === 1 ? "stage" : "stages"}</span></div>${menu}</div>`;
+    const menu = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:map:${esc(id)}" aria-label="Menu ${esc(name)}">${icon("more")}</button>`;
+    return `<div class="card">${thumb("grid")}<div class="grow"><span class="name">${esc(name)}</span><span class="sub">${esc(String(doc["cols"]))} × ${esc(String(doc["rows"]))} · Used by ${used} ${used === 1 ? "stage" : "stages"}</span></div>${menu}</div>`;
   }).join("");
-  const add = readOnly ? "" : `<button type="button" class="card new" data-act="r:add"><span class="grow"><span class="name">+ Add stage</span></span></button>`;
+  const add = readOnly ? "" : `<button type="button" class="btn ghost stage-row" data-act="r:add">${icon("plus")}Add stage</button>`;
   const lines = sess.mode === null ? sess.lines.map((line) => `<p class="sub">${esc(line)}</p>`).join("") : "";
   return `${add}<h2>Maps</h2>${maps}${lines}`;
 }
@@ -68,14 +69,14 @@ export function roomSheet(files: DocText): string {
   if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2><p>${esc(sess.lines[0] ?? "")}</p>${close}</div></div>`;
   if (sess.mode === "add") {
     const maps = bag === null ? [] : docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"])));
-    const uses = maps.map(({ doc }) => `<button type="button" class="btn" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
-    return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn" data-act="r:new">New map</button>${uses}${close}</div></div>`;
+    const uses = maps.map(({ doc }) => `<button type="button" class="btn ghost" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
+    return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn ghost" data-act="r:new">New map</button>${uses}${close}</div></div>`;
   }
-  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "stage" ? `<button type="button" class="btn" data-act="r:start">Game starts here</button>` : `<button type="button" class="btn" data-act="r:resize">Resize</button>`}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
-  if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn" data-act="r:save-name">Save</button>${close}</div></div>`;
+  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn ghost" data-act="r:rename">${icon("edit")}Rename</button>${sess.which === "stage" ? `<button type="button" class="btn ghost" data-act="r:start">Game starts here</button>` : `<button type="button" class="btn ghost" data-act="r:resize">${icon("resize")}Resize</button>`}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
+  if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn primary" data-act="r:save-name">${icon("save")}Save</button>${close}</div></div>`;
   if (sess.mode === "ask") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}<button type="button" class="btn danger" data-act="r:anyway">Resize anyway</button><button type="button" class="btn ghost" data-act="r:close">Cancel</button></div></div>`;
   const big = sess.cols > 256 || sess.rows > 256 ? `<p>Big maps may stutter on phones</p>` : "";
-  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2><p>Columns ${sess.cols}</p><button type="button" class="btn" data-act="r:step:c:-1" aria-label="Fewer columns">−</button><button type="button" class="btn" data-act="r:step:c:1" aria-label="More columns">+</button><p>Rows ${sess.rows}</p><button type="button" class="btn" data-act="r:step:r:-1" aria-label="Fewer rows">−</button><button type="button" class="btn" data-act="r:step:r:1" aria-label="More rows">+</button>${big}<button type="button" class="btn" data-act="r:apply">Apply</button>${close}</div></div>`;
+  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2><p>Columns ${sess.cols}</p><button type="button" class="btn ghost" data-act="r:step:c:-1" aria-label="Fewer columns">−</button><button type="button" class="btn ghost" data-act="r:step:c:1" aria-label="More columns">+</button><p>Rows ${sess.rows}</p><button type="button" class="btn ghost" data-act="r:step:r:-1" aria-label="Fewer rows">−</button><button type="button" class="btn ghost" data-act="r:step:r:1" aria-label="More rows">+</button>${big}<button type="button" class="btn primary" data-act="r:apply">Apply</button>${close}</div></div>`;
 }
 function titleOf(files: DocText): string {
   const bag = bagOf(files), path = bag === null ? null : pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target), doc = path === null || bag === null ? null : bag[path];
```

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index bd7142a..2a12cd1 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -1,4 +1,5 @@
 import { abilityAct, abilityOpen, abilityShut, abilityView, type AbilityPlay } from "./ability-panel.ts";
+import { icon, thumb } from "./icons.ts";
 import { addClick, addShut } from "./add-ability.ts";
 import { planSave } from "../../src/editor/project/save.ts";
 import { prefix, ulid } from "../../src/editor/project/home.ts";
@@ -6,7 +7,7 @@ import { applyRole, deleteUnit, newUnit, renameUnit, resetStat, setStat, shown,
 import { onTeam, setTeam } from "../../src/editor/unit/team.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
-import { knobWidget, type KnobSpec } from "./widgets.ts";
+import { knobWidget, seg, type KnobSpec } from "./widgets.ts";
 type Obj = Record<string, unknown>;
 type DocText = Readonly<Record<string, string>>;
 type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
@@ -83,14 +84,14 @@ function statBlock(unit: Obj, knob: Obj, army: Obj | null): string {
 }
 export function unitTail(files: DocText, readOnly: boolean): string {
   const bag = bagOf(files); if (bag === null) return "";
-  const cards = shown(bag, sess.hidden).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="u:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="u:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
-  const add = readOnly ? "" : `<button type="button" class="card new" data-act="u:add"><span class="grow"><span class="name">+ Add unit</span></span></button>`;
+  const cards = shown(bag, sess.hidden).map((row) => `<div class="card">${thumb("units")}<button type="button" class="grow card-hit" data-act="u:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="u:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">${icon("more")}</button>`}</div>`).join("");
+  const add = readOnly ? "" : `<button type="button" class="btn ghost stage-row" data-act="u:add">${icon("plus")}Add unit</button>`;
   return `<h2>Units</h2>${cards}${add}`;
 }
 function sheet(): string {
   const close = `<button type="button" class="btn ghost" data-act="u:close">Close</button>`;
   if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}${close}</div></div>`;
-  if (sess.mode === "add" || sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${sess.mode === "add" ? "Unit name" : "Rename"}</h2><input class="name-field" data-unit value="${esc(sess.name)}" aria-label="Unit name"><p class="hint">${esc(sess.hint || "1-40 characters")}</p><button type="button" class="btn" data-act="${sess.mode === "add" ? "u:create" : "u:save-name"}">${sess.mode === "add" ? "Add" : "Save"}</button>${close}</div></div>`;
+  if (sess.mode === "add" || sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${sess.mode === "add" ? "Unit name" : "Rename"}</h2><input class="name-field" data-unit value="${esc(sess.name)}" aria-label="Unit name"><p class="hint">${esc(sess.hint || "1-40 characters")}</p><button type="button" class="btn primary" data-act="${sess.mode === "add" ? "u:create" : "u:save-name"}">${sess.mode === "add" ? "Add" : `${icon("save")}Save`}</button>${close}</div></div>`;
   if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Unit")}</h2><button type="button" class="btn danger" data-act="u:delete">Delete</button>${close}</div></div>`;
   return "";
 }
@@ -99,13 +100,13 @@ export function unitPage(files: DocText, readOnly: boolean, banner: string | nul
   const bag = bagOf(files), hit = bag === null ? null : unitDoc(bag, sess.unit); if (bag === null || hit === null) return "";
   const { knobs, presets, army } = roster(bag), roles = rolesOf(knobs, presets), name = typeof hit.doc["name"] === "string" ? hit.doc["name"] : "Unit";
   const stats = knobs.filter((knob) => knob["per_unit"] === true && knob["type"] === "slider").map((knob) => statBlock(hit.doc, knob, army)).join("");
-  const team = readOnly ? "" : `<button type="button" class="btn" data-act="t:team" aria-pressed="${onTeam(bag, sess.unit) ? "true" : "false"}" aria-label="On your team">On your team</button><p class="sub">Starts on your team's start tiles, in this order.</p>`;
+  const team = readOnly ? "" : `${seg("On your team", onTeam(bag, sess.unit), "t:team")}<p class="sub">Starts on your team's start tiles, in this order.</p>`;
   const abilities = abilityView(bag, hit.doc, readOnly);
-  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn" data-act="u:role">Start from a role</button>`;
-  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
+  const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn ghost" data-act="u:role">Start from a role</button>`;
+  const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn ghost" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
   const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
   const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${team}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">${icon("back")}Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${team}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
 }
 async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
   const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host), toast: null };
```

### `tools/maker/widgets.ts` (edited)

```diff
diff --git a/tools/maker/widgets.ts b/tools/maker/widgets.ts
index e135f5f..a72190e 100644
--- a/tools/maker/widgets.ts
+++ b/tools/maker/widgets.ts
@@ -5,23 +5,27 @@ export type KnobSpec = { readonly id: string; readonly label: string; readonly t
 const PALETTE = ["--accent", "--ink", "--danger", "--ok", "--warn"] as const;
 const optOf = (item: KnobOpt): { readonly value: string; readonly label: string } => (typeof item === "string" ? { value: item, label: item } : item);
 const num = (v: number | null | undefined): string => (typeof v === "number" ? String(v) : "");
+export function seg(label: string, on: boolean, act: string): string {
+  const opt = (word: string, set: boolean, name: string): string => `<button type="button" class="seg-opt" aria-pressed="${set ? "true" : "false"}" aria-label="${name}"${set ? "" : ` data-act="${act}"`}><span>${word}</span></button>`;
+  return `<div class="seg-row"><span class="seg-label">${label}</span><span class="seg" role="group" data-seg="${act}">${opt("Off", !on, `${label}: Off`)}${opt("On", on, label)}</span></div>`;
+}
 export function knobWidget(spec: KnobSpec, value: unknown): string {
   const id = esc(spec.id), label = esc(spec.label);
   if (spec.type === "slider") {
     const cur = typeof value === "number" ? String(value) : num(spec.min);
     return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="knob" type="range" min="${esc(num(spec.min))}" max="${esc(num(spec.max))}" step="${esc(num(spec.step) || "1")}" value="${esc(cur)}" data-knob="${id}" aria-label="${label}"><span class="sub" data-val="${id}">${esc(cur)}</span>`;
   }
-  if (spec.type === "picker") return `<p class="sub">${label}</p>${(spec.options ?? []).map(optOf).map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o.value)}" aria-pressed="${value === o.value ? "true" : "false"}">${esc(o.label)}</button>`).join("")}`;
-  if (spec.type === "toggle") return `<button type="button" class="btn" data-act="k:toggle:${id}" aria-pressed="${value === true ? "true" : "false"}" aria-label="${label}">${label}</button>`;
+  if (spec.type === "picker") return `<p class="sub">${label}</p>${(spec.options ?? []).map(optOf).map((o) => `<button type="button" class="pick" data-act="k:pick:${id}:${esc(o.value)}" aria-pressed="${value === o.value ? "true" : "false"}">${esc(o.label)}</button>`).join("")}`;
+  if (spec.type === "toggle") return seg(label, value === true, `k:toggle:${id}`);
   if (spec.type === "ref") {
     const builtins = spec.builtin ?? [];
-    return builtins.length === 0 ? `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}" aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">` : `<p class="sub">${label}</p>${builtins.map((o) => `<button type="button" class="btn" data-act="k:pick:${id}:${esc(o)}" aria-pressed="${value === o ? "true" : "false"}">${esc(o)}</button>`).join("")}`;
+    return builtins.length === 0 ? `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}" aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">` : `<p class="sub">${label}</p>${builtins.map((o) => `<button type="button" class="pick" data-act="k:pick:${id}:${esc(o)}" aria-pressed="${value === o ? "true" : "false"}">${esc(o)}</button>`).join("")}`;
   }
   if (spec.type === "list") {
     const items = Array.isArray(value) ? value.flatMap((item) => (typeof item === "object" && item !== null && "label" in item && typeof item.label === "string" ? [item.label] : [])) : [];
     return `<p class="sub">${label}</p>${items.map((item) => `<p class="sub">${esc(item)}</p>`).join("")}<input class="name-field" data-knob="${id}" aria-label="${label}" value="">`;
   }
   if (spec.type === "text") return `<label class="sub" for="k-${id}">${label}</label><input id="k-${id}" class="name-field" data-knob="${id}"${typeof spec.max_len === "number" ? ` data-max="${spec.max_len}"` : ""} aria-label="${label}" value="${esc(typeof value === "string" ? value : "")}">`;
-  if (spec.type === "colour") return `<p class="sub">${label}</p>${PALETTE.map((token) => `<button type="button" class="btn" data-act="k:colour:${id}:${token}" aria-label="${label} ${token}" aria-pressed="${value === token ? "true" : "false"}" style="background:var(${token});color:var(--ink)">${esc(token)}</button>`).join("")}`;
+  if (spec.type === "colour") return `<p class="sub">${label}</p>${PALETTE.map((token) => `<button type="button" class="pick" data-act="k:colour:${id}:${token}" aria-label="${label} ${token}" aria-pressed="${value === token ? "true" : "false"}"><span class="sw" style="background:var(${token})"></span>${esc(token)}</button>`).join("")}`;
   return `<p class="sub">${label}</p><p>Not editable here</p>`;
 }
```

### `tools/maker/ability-panel.ts` (edited)

```diff
diff --git a/tools/maker/ability-panel.ts b/tools/maker/ability-panel.ts
index 3744668..23bb8d5 100644
--- a/tools/maker/ability-panel.ts
+++ b/tools/maker/ability-panel.ts
@@ -6,6 +6,7 @@ import { WIRED } from "../../src/rules/behaviours/wired.ts";
 import { addChrome } from "./add-ability.ts";
 import { diagramHtml, diagramOf } from "./unit-diagram.ts";
 import { knobWidget, type KnobSpec } from "./widgets.ts";
+import { icon } from "./icons.ts";
 type Obj = Record<string, unknown>;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
 const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
@@ -35,10 +36,10 @@ function rowsOf(bag: Record<string, Obj>, unit: Obj, slice: Obj, skip: string):
 const fxRow = (bag: Record<string, Obj>, behaviourId: string, answers: Obj): string => {
   if (aimKind(behaviourId) === undefined) return "";
   const cur = isObj(answers["effect"]) && answers["effect"]["source"] !== "default" && typeof answers["effect"]["value"] === "string" ? answers["effect"]["value"] : "none";
-  const saved = effectRows(bag).map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("");
+  const saved = effectRows(bag).map((row) => `<button type="button" class="pick" data-act="a:fx:${esc(row.id)}" aria-pressed="${cur === row.id}">${esc(row.name)}</button>`).join("");
   const built = builtinRows(bag, BUNDLED, behaviourId);
-  const extra = built.length === 0 ? "" : `<p class="row">Built-in</p>${built.map((row) => `<button type="button" class="choice" data-act="a:fx:${esc(row.id)}" aria-pressed="${isBuiltin(cur, row.id)}">${esc(row.name)}</button>`).join("")}`;
-  return `<p class="row">Effect</p><button type="button" class="choice" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${saved}${extra}`;
+  const extra = built.length === 0 ? "" : `<p class="row">Built-in</p>${built.map((row) => `<button type="button" class="pick" data-act="a:fx:${esc(row.id)}" aria-pressed="${isBuiltin(cur, row.id)}">${esc(row.name)}</button>`).join("")}`;
+  return `<p class="row">Effect</p><button type="button" class="pick" data-act="a:fx:none" aria-pressed="${cur === "none"}">None</button>${saved}${extra}`;
 };
 export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boolean): string {
   const slice = bag["catalogue/slice.json"]; if (!isObj(slice)) return "";
@@ -54,11 +55,11 @@ export function abilityView(bag: Record<string, Obj>, unit: Obj, readOnly: boole
     const setup = bag[`setups/${sid}.json`]; if (!isObj(setup) || typeof setup["behaviourId"] !== "string") return [];
     const model = panelOf(slice, WIRED, setup["behaviourId"], isObj(setup["answers"]) ? setup["answers"] : {});
     if (model.role !== "card") return [];
-    const test = placed === null ? "" : `<button type="button" class="btn" data-act="a:test:${esc(sid)}">Test</button>`;
-    const drop = readOnly ? "" : `<button type="button" class="btn" data-act="a:drop:${esc(sid)}" aria-label="Remove ${esc(model.name)}">×</button>`;
+    const test = placed === null ? "" : `<button type="button" class="btn ghost" data-act="a:test:${esc(sid)}">${icon("play")}Test</button>`;
+    const drop = readOnly ? "" : `<button type="button" class="btn danger" data-act="a:drop:${esc(sid)}" aria-label="Remove ${esc(model.name)}">×</button>`;
     return [`<div class="card" data-role="card"><button type="button" class="grow card-hit" data-act="a:open:${esc(sid)}"><span class="name">${esc(model.name)}</span></button>${test}${drop}</div>`];
   }).join("");
-  const whole = placed === null ? `<p>Place this unit on a stage to test it.</p>` : `<button type="button" class="btn" data-act="a:test">▶ Test</button>`;
+  const whole = placed === null ? `<p>Place this unit on a stage to test it.</p>` : `<button type="button" class="btn primary" data-act="a:test">${icon("play")}Test</button>`;
   return `<h2>Abilities</h2>${cards}${addChrome(bag, unit, readOnly)}${whole}`;
 }
 function clamp(knob: PanelKnob, value: number): number {
```

### `tools/maker/effects.ts` (edited)

```diff
diff --git a/tools/maker/effects.ts b/tools/maker/effects.ts
index 5fedbe6..be0d10f 100644
--- a/tools/maker/effects.ts
+++ b/tools/maker/effects.ts
@@ -6,6 +6,7 @@ import { BUNDLED } from "./catalogue.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
 import { knobWidget, type KnobSpec } from "./widgets.ts";
+import { icon, thumb } from "./icons.ts";
 type Obj = Record<string, unknown>;
 type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
 export type EffectsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
@@ -22,19 +23,19 @@ const specOf = (knob: PanelKnob): KnobSpec => ({ id: knob.id, label: knob.label,
 const useLine = (n: number): string => (n === 0 ? "Not used yet" : n === 1 ? "1 ability uses this" : `${n} abilities use this`);
 export function effectsSection(files: DocText, readOnly: boolean): string {
   const bag = bagOf(files); if (bag === null) return "";
-  const rows = effectRows(bag).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="e:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span><span class="sub">${useLine(row.used)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="e:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
-  const add = readOnly ? "" : `<button type="button" class="card new" data-act="e:new"><span class="grow"><span class="name">+ New effect</span></span></button>`;
+  const rows = effectRows(bag).map((row) => `<div class="card">${thumb("effects")}<button type="button" class="grow card-hit" data-act="e:open:${esc(row.id)}"><span class="name">${esc(row.name)}</span><span class="sub">${useLine(row.used)}</span></button>${readOnly ? "" : `<button type="button" class="btn icon" data-act="e:menu:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">${icon("more")}</button>`}</div>`).join("");
+  const add = readOnly ? "" : `<button type="button" class="btn ghost stage-row" data-act="e:new">${icon("plus")}New effect</button>`;
   return `<h2>Effects</h2>${rows}${add}`;
 }
 export function effectsSheet(files: DocText, readOnly: boolean): string {
   if (mode === "closed" || readOnly) return "";
   const bag = bagOf(files); if (bag === null) return "";
   const row = effectRows(bag).find((item) => item.id === openId), name = row?.name ?? "Effect";
-  if (mode === "menu") { const used = row?.used ?? 0, warn = used === 0 ? "" : `<p>${used === 1 ? "1 ability uses" : `${used} abilities use`} this; they'll show None</p>`, none = used === 0 ? "" : `<button type="button" class="btn danger" data-act="e:none">Delete and switch ${used} to None</button>`; return `<div class="scrim" data-sheet="effects"><div class="sheet" role="dialog"><h2>${esc(name)}</h2>${warn}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn danger" data-act="e:delete">Delete</button>${none}<button type="button" class="btn ghost" data-act="e:close">Close</button></div></div>`; }
+  if (mode === "menu") { const used = row?.used ?? 0, warn = used === 0 ? "" : `<p>${used === 1 ? "1 ability uses" : `${used} abilities use`} this; they'll show None</p>`, none = used === 0 ? "" : `<button type="button" class="btn danger" data-act="e:none">Delete and switch ${used} to None</button>`; return `<div class="scrim" data-sheet="effects"><div class="sheet" role="dialog"><h2>${esc(name)}</h2>${warn}<button type="button" class="btn ghost" data-act="e:dup">Duplicate</button><button type="button" class="btn danger" data-act="e:delete">Delete</button>${none}<button type="button" class="btn ghost" data-act="e:close">Close</button></div></div>`; }
   let doc: Obj | null = null; for (const [path, item] of Object.entries(bag)) if (path.startsWith("effects/") && !path.slice("effects/".length).includes("/") && item["id"] === openId) doc = item;
   const answers = doc !== null && isObj(doc["answers"]) ? doc["answers"] : {}, knobs = panelOf(BUNDLED, { effect: FX_KNOBS }, "effect", answers).sections.flatMap((section) => [...section.knobs]);
   const body = knobs.map((knob) => `${knobWidget(specOf(knob), knob.value)}<button type="button" class="btn ghost" data-act="e:reset:${esc(knob.id)}">Reset to default</button>`).join("");
-  return `<div class="scrim" data-sheet="effect"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="e:close">Back</button><h1>${esc(name)}</h1></header><input class="name-field" data-fxname value="${esc(name)}" aria-label="Effect name">${body}<button type="button" class="btn" data-act="e:dup">Duplicate</button><button type="button" class="btn" data-act="test">▶ Test</button></div></div>`;
+  return `<div class="scrim" data-sheet="effect"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="e:close">Back</button><h1>${esc(name)}</h1></header><input class="name-field" data-fxname value="${esc(name)}" aria-label="Effect name">${body}<button type="button" class="btn ghost" data-act="e:dup">Duplicate</button><button type="button" class="btn primary" data-act="test">${icon("play")}Test</button></div></div>`;
 }
 function applyBag(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
   const next: Record<string, string> = {};
```

### `tools/maker/levels.ts` (edited)

```diff
diff --git a/tools/maker/levels.ts b/tools/maker/levels.ts
index 4b169cf..dd29fac 100644
--- a/tools/maker/levels.ts
+++ b/tools/maker/levels.ts
@@ -5,6 +5,7 @@ import { addCase, updateProject } from "../../src/editor/unit/add.ts";
 import { BUNDLED } from "./catalogue.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
+import { icon, thumb } from "./icons.ts";
 type Obj = Record<string, unknown>;
 type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
 export type LevelsHit = Host & { readonly banner: string | null; readonly toast?: string | null };
@@ -21,15 +22,15 @@ export function levelsSection(files: DocText, readOnly: boolean): string {
   const bag = bagOf(files); if (bag === null) return "";
   const gate = addCase(bag, BUNDLED), head = `<h2>Levels</h2>`;
   if (readOnly || gate.mode === "newer") return `${head}<div class="card"><p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p></div>`;
-  if (gate.mode === "older") return `${head}<div class="card"><p>${esc(gate.text)}</p>${gate.update ? `<button type="button" class="btn" data-act="l:update">Update</button>` : ""}</div>`;
-  const view = curveOf(bag); if (view === null) return `${head}<div class="card"><span class="name">Levels: Off</span><button type="button" class="btn" data-act="l:on">Turn on levels</button></div>`;
-  return `${head}<div class="card"><button type="button" class="grow card-hit" data-act="l:open"><span class="name">Levels: ${view.n} · ${view.total} XP to the top</span></button></div>`;
+  if (gate.mode === "older") return `${head}<div class="card">${thumb("levels")}<p>${esc(gate.text)}</p>${gate.update ? `<button type="button" class="btn ghost" data-act="l:update">Update</button>` : ""}</div>`;
+  const view = curveOf(bag); if (view === null) return `${head}<div class="card">${thumb("levels")}<span class="name">Levels: Off</span><button type="button" class="btn ghost" data-act="l:on">Turn on levels</button></div>`;
+  return `${head}<div class="card">${thumb("levels")}<button type="button" class="grow card-hit" data-act="l:open"><span class="name">Levels: ${view.n} · ${view.total} XP to the top</span></button></div>`;
 }
 export function levelsSheet(files: DocText, readOnly: boolean): string {
   if (!open || readOnly) return "";
   const bag = bagOf(files), view = bag === null ? null : curveOf(bag); if (view === null) return "";
   const rows = view.rows.map((value, i) => `<div data-row="${i}"><label class="sub" for="k-row-${i}">Level ${i + 1}</label><input id="k-row-${i}" class="knob" type="range" min="${view.rowMin}" max="${view.rowMax}" step="1" value="${value}" data-lvl="row-${i}" aria-label="Level ${i + 1}"><span class="sub" data-val="row-${i}">${value} XP</span></div>`).join("");
-  return `<div class="scrim" data-sheet="levels"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="l:close">Back</button><h1>Levels</h1></header>${slider("levels", view.levelLabel, view.n, view.levelMin, view.levelMax)}<h2>XP to reach each level</h2>${rows}<button type="button" class="btn ghost" data-act="l:reset">Reset curve</button>${slider("xp_move", view.moveLabel, view.move, view.moveMin, view.moveMax)}<button type="button" class="btn" data-act="test">▶ Test</button><button type="button" class="btn ghost" data-act="l:off">Turn off levels</button></div></div>`;
+  return `<div class="scrim" data-sheet="levels"><div class="sheet" role="dialog"><header class="topbar"><button type="button" class="btn ghost" data-act="l:close">Back</button><h1>Levels</h1></header>${slider("levels", view.levelLabel, view.n, view.levelMin, view.levelMax)}<h2>XP to reach each level</h2>${rows}<button type="button" class="btn ghost" data-act="l:reset">Reset curve</button>${slider("xp_move", view.moveLabel, view.move, view.moveMin, view.moveMax)}<button type="button" class="btn primary" data-act="test">${icon("play")}Test</button><button type="button" class="btn ghost" data-act="l:off">Turn off levels</button></div></div>`;
 }
 const keptHost = (host: Host): LevelsHit => ({ ...host, banner: null });
 const texts = (stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>, slice: string): DocText => { const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); if (slice !== "") next["catalogue/slice.json"] = slice; return next; };
```

### `tools/maker/project.ts` (edited)

```diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index 434ea22..461d1ba 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,10 +1,11 @@
+import { icon, thumb } from "./icons.ts";
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string; readonly levels?: string }): string {
   const reason = "Made with a newer TileEngine. Open only.";
-  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
+  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">${icon("save")}Save</button>` : `<button type="button" class="btn ghost" data-act="save">${icon("save")}Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
-  const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}${input.levels ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
+  const rows = (input.rows ?? []).map((row) => `<div class="card">${thumb("stages")}<button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">${icon("more")}</button>`}</div>`).join("");
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">${icon("back")}Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}${input.levels ?? ""}<div class="test-wrap"><button type="button" class="btn primary" data-act="test">${icon("play")}Test</button></div></div>`;
 }
```

### `tools/maker/build-sheet.ts` (edited)

```diff
diff --git a/tools/maker/build-sheet.ts b/tools/maker/build-sheet.ts
index f466444..2960b2a 100644
--- a/tools/maker/build-sheet.ts
+++ b/tools/maker/build-sheet.ts
@@ -1,14 +1,15 @@
+import { icon } from "./icons.ts";
 export type BuildView = "idle" | "busy";
 export function buildButton(view: BuildView): string {
   if (view === "busy") return `<button type="button" class="btn ghost stage-row" data-act="build" disabled aria-busy="true"><span class="spin"></span>Building…</button>`;
-  return `<button type="button" class="btn ghost stage-row" data-act="build">Build game</button>`;
+  return `<button type="button" class="btn ghost stage-row" data-act="build">${icon("build")}Build game</button>`;
 }
 export type BuildSheet = { readonly mode: "ready"; readonly file: string; readonly share: boolean } | { readonly mode: "error"; readonly reason: string } | null;
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === "&" ? "&amp;" : ch === "<" ? "&lt;" : ch === ">" ? "&gt;" : ch === '"' ? "&quot;" : "&#39;");
 const sheet = (title: string, body: string, buttons: string): string => `<div class="scrim" data-sheet="build"><div class="sheet" role="dialog"><h2>${title}</h2><p>${body}</p>${buttons}<button type="button" class="btn ghost" data-act="build:done">Done</button></div></div>`;
 export function buildSheet(view: BuildSheet): string {
   if (view === null) return "";
-  if (view.mode === "error") return sheet("Couldn't build your game", esc(view.reason), `<button type="button" class="btn" data-act="build">Try again</button>`);
-  const share = view.share ? `<button type="button" class="btn" data-act="build:share">Share</button>` : "";
+  if (view.mode === "error") return sheet("Couldn't build your game", esc(view.reason), `<button type="button" class="btn primary" data-act="build">Try again</button>`);
+  const share = view.share ? `<button type="button" class="btn primary" data-act="build:share">Share</button>` : "";
   return sheet("Your game is ready", `Saved to Downloads as ${esc(view.file)}. This is a web build: put it on any website host that takes HTML games, and anyone can play it in a browser. A phone app version comes in a later update.`, share);
 }
```

### `tools/maker/add-ability.ts` (edited)

```diff
diff --git a/tools/maker/add-ability.ts b/tools/maker/add-ability.ts
index f2c12de..4027dad 100644
--- a/tools/maker/add-ability.ts
+++ b/tools/maker/add-ability.ts
@@ -14,7 +14,7 @@ export type AddHit = { readonly keep: true } | { readonly bag: Record<string, Ob
 const binsOf = (bag: Obj, unit: Obj) => byGoal(addable(BUNDLED, WIRED, unit, bag));
 function offer(gate: AddCase): string {
   if (gate.mode !== "older") return "";
-  const act = gate.update ? `<button type="button" class="btn" data-act="g:update">Update</button><button type="button" class="btn ghost" data-act="g:close">Not now</button>` : `<button type="button" class="btn ghost" data-act="g:close">Close</button>`;
+  const act = gate.update ? `<button type="button" class="btn primary" data-act="g:update">Update</button><button type="button" class="btn ghost" data-act="g:close">Not now</button>` : `<button type="button" class="btn ghost" data-act="g:close">Close</button>`;
   return `<div class="scrim" data-sheet="offer"><div class="sheet" role="dialog"><h2>Browse by goal</h2><p>${esc(gate.text)}</p>${act}</div></div>`;
 }
 function goals(bag: Obj, unit: Obj): string {
@@ -33,7 +33,7 @@ export function addChrome(bag: Obj, unit: Obj, readOnly: boolean): string {
   const gate = addCase(bag, BUNDLED);
   if (gate.mode === "newer") return `<p class="hint">${esc(gate.text)}</p>`;
   const sheet = view === "offer" ? offer(gate) : view === "goals" ? goals(bag, unit) : view === "cards" ? cards(bag, unit) : "";
-  return `<button type="button" class="btn" data-act="g:open">+ Add ability</button>${sheet}`;
+  return `<button type="button" class="btn ghost" data-act="g:open">+ Add ability</button>${sheet}`;
 }
 export function addClick(act: string, bag: Obj, unitId: string, setupId: string): AddHit {
   const gate = addCase(bag, BUNDLED);
```

### `tools/maker/art.ts` (edited)

```diff
diff --git a/tools/maker/art.ts b/tools/maker/art.ts
index fdd7a9f..e56b755 100644
--- a/tools/maker/art.ts
+++ b/tools/maker/art.ts
@@ -69,7 +69,7 @@ const layerName = (root: Record<string, unknown>, assetId: string): string => {
 export function artSheet(files: DocText, stageId: string, readOnly: boolean): string {
   if (!shown) return "";
   const parsed = parseProject(files), found = parsed.ok ? locate(parsed.files, stageId) : null, layers = found === null ? [] : layersOf(found.map);
-  const rows = layers.length === 0 ? `<p>No background yet.</p>` : layers.map((layer, i) => `<p>Layer ${i + 1} · ${esc(found === null || typeof layer["assetId"] !== "string" ? "Picture" : layerName(found.root, layer["assetId"]))}${readOnly ? "" : ` <button type="button" class="btn ghost" data-act="b:del:${i}">Remove</button>`}</p>`).join("");
-  const add = readOnly ? "" : `<label class="btn">Add picture<input type="file" data-art accept="image/png,image/jpeg,image/webp"></label>`;
+  const rows = layers.length === 0 ? `<p>No background yet.</p>` : layers.map((layer, i) => `<p>Layer ${i + 1} · ${esc(found === null || typeof layer["assetId"] !== "string" ? "Picture" : layerName(found.root, layer["assetId"]))}${readOnly ? "" : ` <button type="button" class="btn danger" data-act="b:del:${i}">Remove</button>`}</p>`).join("");
+  const add = readOnly ? "" : `<label class="btn primary">Add picture<input type="file" data-art accept="image/png,image/jpeg,image/webp"></label>`;
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>Background</h2>${note === null ? "" : `<p>${esc(note)}</p>`}${rows}${lines.map((line) => `<p>${esc(line)}</p>`).join("")}${add}<button type="button" class="btn ghost" data-act="b:close">Close</button></div></div>`;
 }
```

### `tools/maker/rules-panel.ts` (edited)

```diff
diff --git a/tools/maker/rules-panel.ts b/tools/maker/rules-panel.ts
index 886fee2..f06430e 100644
--- a/tools/maker/rules-panel.ts
+++ b/tools/maker/rules-panel.ts
@@ -41,7 +41,7 @@ export function rulesHtml(bag: Record<string, Obj>, stageId: string, readOnly: b
   const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
   const head = `<div class="scrim" data-sheet="rules"><div class="sheet" role="dialog"><h2>Rules · ${esc(name)}</h2>`;
   if (gate.mode === "newer" || readOnly) return `${head}<p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p>${close}</div></div>`;
-  if (gate.mode === "older") { const act = gate.update ? `<button type="button" class="btn" data-act="r:update">Update</button><button type="button" class="btn ghost" data-act="r:close">Not now</button>` : close; return `${head}<p>${esc(gate.text)}</p>${act}</div></div>`; }
+  if (gate.mode === "older") { const act = gate.update ? `<button type="button" class="btn primary" data-act="r:update">Update</button><button type="button" class="btn ghost" data-act="r:close">Not now</button>` : close; return `${head}<p>${esc(gate.text)}</p>${act}</div></div>`; }
   const hit = sourceOf(bag, stageId, "win-condition"), setup = hit.setupId === "" ? undefined : bag[`setups/${hit.setupId}.json`];
   const answers = isObj(setup) && isObj(setup["answers"]) ? setup["answers"] : {};
   const knob = panelOf(viewSlice(bag), WIRED, "win-condition", answers).sections.flatMap((section) => [...section.knobs])[0];
```

### `tests/editor/project-home.test.ts` (edited)

```diff
diff --git a/tests/editor/project-home.test.ts b/tests/editor/project-home.test.ts
index 8fc2aa7..a47b3cf 100644
--- a/tests/editor/project-home.test.ts
+++ b/tests/editor/project-home.test.ts
@@ -42,5 +42,5 @@ test("names, ids, templates, save, rename, duplicate, trash, stale, corrupt, gre
   const trash = memoryStore(); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const kept = await readTree(trash, prefix(idA));
   await movePrefix(trash, prefix(idA), prefix(idA, true)); await movePrefix(trash, prefix(idA, true), prefix(idA)); assert.deepEqual(await readTree(trash, prefix(idA)), kept);
   await movePrefix(trash, prefix(idA), prefix(idA, true)); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const restored = restorePlan(idA, true, kept, idB, NOW, ["My game"]); assert.notEqual(restored.id, idA); assert.equal(proj(restored.files).copiedFrom?.projectId, idA); assert.deepEqual(restorePlan(idA, false, kept, idB, NOW, []).files, kept);
-  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn" data-act="test">Test<\/button>/); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
+  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn primary" data-act="test"><svg class="ico"[^>]*>.*?<\/svg>Test<\/button>/); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
 });
```

### `tests/editor/stage-editor.test.ts` (edited)

```diff
diff --git a/tests/editor/stage-editor.test.ts b/tests/editor/stage-editor.test.ts
index d7d9240..9c56fd5 100644
--- a/tests/editor/stage-editor.test.ts
+++ b/tests/editor/stage-editor.test.ts
@@ -54,5 +54,5 @@ test("stage editor paints, clears, lists rows, undoes and keeps a failed save",
   io.store.failOn(`${prefix(id)}${MAP}.tmp`); const failed = await stageClick("s:done", STAGE, pick, io);
   assert.equal(failed.dirty, true); assert.match(failed.banner ?? "", /Couldn't save/); assert.equal(io.store.files.get(`${prefix(id)}${MAP}`), text[MAP]); assert.equal(io.store.files.get(`${prefix(id)}project.json`), text["project.json"]);
   const html = stageScreen(STAGE, failed); assert.match(html, /data-error="writeFailed"/); assert.match(html, /data-tile="water"/); assert.match(html, /class="dot"/); assert.match(html, />Undo</);
-  bindStage(STAGE, "other"); assert.match(stageScreen(STAGE, host), /Nothing to undo/);
+  bindStage(STAGE, "other"); assert.doesNotMatch(stageScreen(STAGE, host), /undo-chip/);
 });
```

### `handoff/steps/tests/s4a-stage-paint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4a-stage-paint/smoke.mjs b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
index b089d6d..d1602f9 100644
--- a/handoff/steps/tests/s4a-stage-paint/smoke.mjs
+++ b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
@@ -23,9 +23,9 @@ try {
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
     await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
-    await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
+    await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
     await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
-    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent), note: (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
+    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent), note: (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
     await step("5 undo", async () => { await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "floor"); const a = await tile(page, 0, 0), b = await tile(page, 1, 0); if (a !== "floor" || b !== "floor") throw new Error(`${a} ${b}`); });
     await step("6 test", async () => {
       await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); await tap(page, "s:test");
```

### `handoff/steps/tests/s4b-stage-place/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4b-stage-place/smoke.mjs b/handoff/steps/tests/s4b-stage-place/smoke.mjs
index 8210a2b..a001bdb 100644
--- a/handoff/steps/tests/s4b-stage-place/smoke.mjs
+++ b/handoff/steps/tests/s4b-stage-place/smoke.mjs
@@ -25,7 +25,7 @@ try {
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
-    await step("1 add here", async () => { await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); const got = await page.evaluate(() => { const buttons = [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()); const choice = [...document.querySelectorAll(".sheet .choice")].map((b) => b.textContent.trim()); const small = [...document.querySelectorAll(".sheet button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { buttons, choice, small: small.length }; }); if (got.choice.join("|") !== "Floor|Water|Wall block" || !got.buttons.includes("Your team start") || !got.buttons.includes("NPC") || !got.buttons.includes("Enemy") || got.small !== 0) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
+    await step("1 add here", async () => { await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); const got = await page.evaluate(() => { const buttons = [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()); const choice = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent.trim()); const small = [...document.querySelectorAll(".sheet button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { buttons, choice, small: small.length }; }); if (got.choice.join("|") !== "Floor|Water|Wall block" || !got.buttons.includes("Your team start") || !got.buttons.includes("NPC") || !got.buttons.includes("Enemy") || got.small !== 0) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
     await step("2 what", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:place:npc"); await tap(page, "s:unit:unit_01JDAN00000000000000000003"); await waitLabel(page, 2, 8, "NPC", true); const rows = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()).filter((t) => t !== "Close")); if (rows.join("|") !== "Just stand here|Talk" || rows.some((t) => /Hostile|Wander|Seller|Quest/.test(t))) throw new Error(rows.join("|")); });
     await step("3 talk", async () => { await tap(page, "s:talk-open"); const input = page.locator("[data-talk]"); await input.fill("x".repeat(max + 3)); const n = await input.evaluate((el) => [...el.value].length); if (n !== max) throw new Error(`len ${n}`); await input.fill("Smoke hello"); await tap(page, "s:talk-save"); await page.waitForFunction(() => { const n = document.querySelector('[data-act="s:cell:2,8"]'); return ((n && n.getAttribute("aria-label")) || "").includes("NPC") && document.querySelector("[data-talk]") === null; }, null, { timeout: 15000 }); const who = await label(page, 2, 8); if (!String(who).includes("NPC")) throw new Error(String(who)); });
     await step("4 enemy", async () => { await tap(page, "s:cell:4,0"); await tap(page, "s:place:enemy"); await tap(page, "s:unit:unit_01JDAN00000000000000000004"); await waitLabel(page, 4, 0, "Enemy", true); const who = await label(page, 4, 0); if (!String(who).includes("Enemy")) throw new Error(String(who)); });
```

### `handoff/steps/tests/s5a-units/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s5a-units/smoke.mjs b/handoff/steps/tests/s5a-units/smoke.mjs
index 486c5d1..1471d48 100644
--- a/handoff/steps/tests/s5a-units/smoke.mjs
+++ b/handoff/steps/tests/s5a-units/smoke.mjs
@@ -30,7 +30,7 @@ try {
     await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Units");
     await step("1 units", async () => {
       await page.evaluate(() => { const h = [...document.querySelectorAll("h2")].find((n) => n.textContent === "Units"); h?.scrollIntoView({ block: "start" }); });
-      const text = await page.evaluate(() => document.body.innerText); if (NAMES.some((name) => !text.includes(name)) || !text.includes("+ Add unit")) throw new Error(text);
+      const text = await page.evaluate(() => document.body.innerText); if (NAMES.some((name) => !text.includes(name)) || !text.includes("Add unit")) throw new Error(text);
       await shot("01-units"); sheetTiny.push(...await big());
     });
     await step("2 add", async () => {
@@ -38,7 +38,7 @@ try {
       await page.locator("[data-unit]").fill("Scout"); await tap(page, "u:create");
       await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Start from a role"), null, { timeout: 15000 });
       await shot("03-editor"); sheetTiny.push(...await big());
-      await tap(page, "u:back"); await waitText(page, "+ Add unit");
+      await tap(page, "u:back"); await waitText(page, "Add unit");
       scout = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((act) => act.startsWith("u:open:") && (document.querySelector(`[data-act="${act}"]`)?.textContent ?? "").includes("Scout")) ?? "");
       if (!scout.startsWith("u:open:unit_")) throw new Error(scout || "no scout");
       await tap(page, scout);
```

### `handoff/steps/tests/s5b-abilities/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s5b-abilities/smoke.mjs b/handoff/steps/tests/s5b-abilities/smoke.mjs
index e4aa547..792db34 100644
--- a/handoff/steps/tests/s5b-abilities/smoke.mjs
+++ b/handoff/steps/tests/s5b-abilities/smoke.mjs
@@ -70,7 +70,7 @@ try {
     await step("7 nowhere", async () => {
       if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
       await page.waitForFunction(() => document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
-      await tap(page, "s:back"); await waitText(page, "+ Add unit"); await tap(page, "u:add");
+      await tap(page, "s:back"); await waitText(page, "Add unit"); await tap(page, "u:add");
       await page.waitForFunction(() => document.querySelector("[data-unit]") !== null, null, { timeout: 15000 }); await page.locator("[data-unit]").fill("Spare"); await tap(page, "u:create");
       await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Spare" && document.body.innerText.includes("Place this unit on a stage to test it."), null, { timeout: 15000 });
       const shown = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].some((el) => { const act = el.getAttribute("data-act") ?? ""; return act === "a:test" || act.startsWith("a:test:") || act === "s:try"; }));
```

### `handoff/steps/tests/s6a-win-rules/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6a-win-rules/smoke.mjs b/handoff/steps/tests/s6a-win-rules/smoke.mjs
index 11c0639..729f7e3 100644
--- a/handoff/steps/tests/s6a-win-rules/smoke.mjs
+++ b/handoff/steps/tests/s6a-win-rules/smoke.mjs
@@ -28,21 +28,21 @@ try {
     await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
     await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
     await step("1 rules on", async () => {
-      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("Default rule") && document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
+      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("Default rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On", null, { timeout: 15000 });
       await shot("01-rules-on"); tiny.push(...await big());
     });
     await step("2 rules off", async () => {
       await tap(page, "k:toggle:wipe_wins"); await waitText(page, "With this off, nobody wins: Test plays until you leave."); await shot("02-rules-off"); tiny.push(...await big());
       if (width === 360) { await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover("[data-sheet=rules] .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
       await tap(page, "r:close"); await tap(page, "s:back"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
-      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("This stage's rule") && document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
+      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("This stage's rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 });
     });
     await step("3 test off", async () => {
       await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === false, null, { timeout: 15000 });
       await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="r:open"]') !== null, null, { timeout: 15000 });
     });
     await step("4 reset", async () => {
-      await tap(page, "r:open"); await tap(page, "r:reset"); await page.waitForFunction(() => document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
+      await tap(page, "r:open"); await tap(page, "r:reset"); await page.waitForFunction(() => document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On", null, { timeout: 15000 });
       await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === true, null, { timeout: 15000 }); if (await wiped() !== true) throw new Error("wipe");
       await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"]') !== null, null, { timeout: 15000 });
     });
```

### `handoff/steps/tests/s6c-checkpoint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6c-checkpoint/smoke.mjs b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
index 56afa62..7017813 100644
--- a/handoff/steps/tests/s6c-checkpoint/smoke.mjs
+++ b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
@@ -78,7 +78,7 @@ try {
       await tap(page, foe); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:5,5"]')?.getAttribute("aria-label") ?? "").includes("Raider"), null, { timeout: 15000 }); await shot("06-placed");
     });
     await step("7 rules on", async () => {
-      await tap(page, "r:open"); await page.waitForFunction(() => document.querySelector('[data-act="k:toggle:wipe_wins"]')?.getAttribute("aria-pressed") === "true" && document.body.innerText.includes("Win by defeating every enemy") && document.body.innerText.includes("Default rule"), null, { timeout: 15000 });
+      await tap(page, "r:open"); await page.waitForFunction(() => document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On" && document.body.innerText.includes("Win by defeating every enemy") && document.body.innerText.includes("Default rule"), null, { timeout: 15000 });
       await see(); await shot("07-rules"); await tap(page, "r:close"); await page.waitForFunction(() => document.querySelector('[data-sheet="rules"]') === null, null, { timeout: 15000 });
     });
     await step("8 victory", async () => {
```

### `handoff/steps/tests/s8-autosave-links/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s8-autosave-links/smoke.mjs b/handoff/steps/tests/s8-autosave-links/smoke.mjs
index 010481d..c7404b2 100644
--- a/handoff/steps/tests/s8-autosave-links/smoke.mjs
+++ b/handoff/steps/tests/s8-autosave-links/smoke.mjs
@@ -31,7 +31,7 @@ try {
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
     await step("2 upstairs", async () => { await tap(page, "r:add"); await sheet(page, "Add stage"); await see(); await tap(page, `r:use:${MAP}`); await page.waitForFunction((demo) => document.querySelectorAll(".cell").length === 54 && new URLSearchParams(location.search).get("stage") !== null && new URLSearchParams(location.search).get("stage") !== demo, DEMO, { timeout: 15000 }); up = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? ""); if (up === "") throw new Error("stage"); });
-    await step("3 stairs down, autosave on", async () => { await tap(page, "s:cell:3,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:3,7"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await waitText(page, "Autosave here: Off"); await see(); await tap(page, "s:autosave"); await page.waitForFunction(() => document.querySelector('[data-act="s:autosave"]')?.getAttribute("aria-pressed") === "true" && (document.querySelector('[data-act="s:autosave"]')?.textContent ?? "").includes("Autosave here: On"), null, { timeout: 15000 }); await see(); await shot("01-autosave-on"); await tap(page, "s:close"); });
+    await step("3 stairs down, autosave on", async () => { await tap(page, "s:cell:3,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:3,7"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await page.waitForFunction(() => document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 }); await see(); await tap(page, "s:autosave"); await page.waitForFunction(() => document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "On" && document.body.innerText.includes("Autosave here"), null, { timeout: 15000 }); await see(); await shot("01-autosave-on"); await tap(page, "s:close"); });
     await step("4 game starts upstairs, stairs up", async () => { await tap(page, "s:back"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelector(".sheet") === null, null, { timeout: 15000 }); await quiet(); await tap(page, `stage:${DEMO}`); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); });
     await step("5 start can't be deleted", async () => { await tap(page, "s:back"); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:delete"); await waitText(page, "The game starts here. Pick another start first."); await see(); await shot("02-start-refusal"); await tap(page, "r:close"); });
     await step("6 test starts upstairs, stairs autosave", async () => { await quiet(); await tap(page, "test"); await page.waitForFunction((id) => window.__play !== undefined && window.__docs?.stage?.id === id, up, { timeout: 15000 }); await go({ c: 3, r: 7 }, { c: 2, r: 7 }); await page.waitForFunction((id) => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === id && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, DEMO, { timeout: 15000 }); await shot("03-downstairs"); });
```

### `handoff/steps/tests/s9b-art-upload/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s9b-art-upload/smoke.mjs b/handoff/steps/tests/s9b-art-upload/smoke.mjs
index c149d3c..fed5324 100644
--- a/handoff/steps/tests/s9b-art-upload/smoke.mjs
+++ b/handoff/steps/tests/s9b-art-upload/smoke.mjs
@@ -24,7 +24,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
     const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 400)).catch(() => ""); check(`${name} @${width}`, false, `${String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 500)} || ${text}`); } };
-    const undo = (on) => page.waitForFunction((on) => { const b = document.querySelector('[data-act="s:undo"]'); return b instanceof HTMLButtonElement && b.disabled !== on && b.textContent === (on ? "Undo" : "Nothing to undo"); }, on, { timeout: 15000 });
+    const undo = (on) => page.waitForFunction((on) => { const b = document.querySelector('[data-act="s:undo"]'); return on ? b instanceof HTMLButtonElement && b.textContent === "Undo" : b === null; }, on, { timeout: 15000 });
     let id = "";
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await step("1 new", async () => { await tap(page, "new"); await waitText(page, "Pick a start"); await tap(page, "toname"); await waitText(page, "Name it"); await tap(page, "create"); await waitText(page, "Demo stage"); id = await page.evaluate(async () => { const projects = await (await (await navigator.storage.getDirectory()).getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_")) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); return ids[0]; }); });
```

### `tests/tools/f1-look-kit.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { buildSheet } from "../../tools/maker/build-sheet.ts";
import { ICON_NAMES, icon } from "../../tools/maker/icons.ts";
import { projectScreen } from "../../tools/maker/project.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { askSheet, goesSheet, placeButtons, talkSheet, unitButtons, unitPicker } from "../../tools/maker/stage-sheets.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { knobWidget } from "../../tools/maker/widgets.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const MAKER = join(root, "tools/maker");
const STAGE = "stage_01JDAS00000000000000000001";
const NOW = "2026-11-27T00:00:00.000Z";
const sources = readdirSync(MAKER).filter((name) => name.endsWith(".ts")).map((name) => ({ name, text: readFileSync(join(MAKER, name), "utf8") }));
const css = readFileSync(join(MAKER, "app.css"), "utf8");
const tags = (text: string): string[] => text.match(/<(?:button|label)\b[^>]*>/g) ?? [];
const rule = (selector: string): string => {
  const hits = css.split("\n").filter((line) => line.startsWith(`${selector} {`));
  assert.equal(hits.length, 1, `${selector} is set once`);
  return hits[0] ?? "";
};
const readDir = (rel: string): Record<string, string> => {
  const out: Record<string, string> = {};
  const walk = (at: string, base: string): void => {
    for (const name of readdirSync(at)) {
      const path = join(at, name);
      const next = base === "" ? name : `${base}/${name}`;
      if (statSync(path).isDirectory()) walk(path, next);
      else out[next] = readFileSync(path, "utf8");
    }
  };
  walk(join(root, rel), "");
  return out;
};
const primaries = (html: string): number[] => html.split('class="scrim"').map((part) => part.split('class="btn primary').length - 1);
async function demo(id: string): Promise<{ host: Host; io: { store: ReturnType<typeof memoryStore>; id: string; now: string } }> {
  const text = readDir("fixtures/demo.tileproj");
  const parsed = parseProject(text);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) throw new Error("demo");
  const io = { store: memoryStore(), id, now: NOW };
  for (const [path, body] of Object.entries(text)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id);
  return { host: { files: text, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false }, io };
}

test("F1 button roles: every maker button names its role (btn primary, ghost, danger or icon) or is a pick chip; no bare class=\"btn\" is left; + Add stage, New project, + Add unit and + New effect are ghost rows with the plus icon, so the selected look only means selected", () => {
  const bare = sources.flatMap(({ name, text }) => tags(text).filter((tag) => /class="btn(?:"| (?!primary|ghost|danger|icon)[^"]*")/.test(tag)).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(bare, []);
  const rooms = sources.find((file) => file.name === "rooms.ts")?.text ?? "";
  assert.ok(rooms.includes('<button type="button" class="btn ghost stage-row" data-act="r:add">${icon("plus")}Add stage</button>'));
  assert.equal(/class="card new"/.test(sources.map(({ text }) => text).join("\n")), false);
  assert.ok([["home.ts", "new", "New project"], ["units.ts", "u:add", "Add unit"], ["effects.ts", "e:new", "New effect"]].every(([name, act, words]) => sources.find((file) => file.name === name)?.text.includes(`<button type="button" class="btn ghost stage-row" data-act="${act}">\${icon("plus")}${words}</button>`)));
});

test("F1 button order: at most one primary per screen and per sheet; Test is the stage's and the project page's primary", async () => {
  const { host, io } = await demo("f1order");
  const stage = stageScreen(STAGE, host);
  assert.match(stage, /class="btn primary" data-act="s:test"/);
  const cell = await stageClick("s:cell:0,0", STAGE, host, io);
  const view = await stageClick("s:view", STAGE, host, io);
  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: true, readOnly: false, banner: null, problems: [] });
  assert.match(project, /class="btn primary" data-act="test"/);
  const sheets = [placeButtons([{ id: "npc", label: "NPC" }, { id: "foe", label: "Enemy" }]), goesSheet("Stairs", [{ id: "s2", name: "Two" }]), unitPicker([{ id: "u", name: "Scout" }]), askSheet("Scout"), talkSheet("Scout", 80, "Hi"), unitButtons(true, true), buildSheet({ mode: "ready", file: "g.zip", share: true }), buildSheet({ mode: "error", reason: "x" })];
  for (const html of [stage, stageScreen(STAGE, cell), stageScreen(STAGE, view), project, ...sheets]) assert.ok(primaries(html).every((n) => n <= 1), html);
  assert.equal(primaries(unitButtons(true, true))[0], 0);
  assert.ok(sources.every(({ text }) => text.split("\n").every((line) => line.split('class="btn primary').length <= 2)));
});

test("F1 pickers: every aria-pressed button is a .pick chip or a framed-pill toggle (the new-game wizard's .choice cards aside); a chip is 48 px, centres its label, pads 14 px each side without a swatch and draws the picked ring of style-spec § 7", async () => {
  const loose = sources.flatMap(({ name, text }) => tags(text).filter((tag) => tag.includes("aria-pressed") && !tag.includes('class="pick"') && !tag.includes('class="seg-opt"') && !(name === "home.ts" && tag.includes('class="choice"'))).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(loose, []);
  assert.match(rule(".pick"), /justify-content: center;.*min-height: 48px; padding: 0 14px; border-radius: 999px;.*border: 2px solid var\(--line\);.*background: var\(--surface\);/);
  assert.equal(rule(".pick:has(.sw)"), ".pick:has(.sw) { padding: 0 14px 0 8px; }");
  assert.equal(rule('.pick[aria-pressed="true"]'), '.pick[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }');
  const pick = knobWidget({ id: "aim", label: "Aim", type: "picker", options: ["self", "foe"] }, "foe");
  assert.match(pick, /class="pick" data-act="k:pick:aim:foe" aria-pressed="true"/);
  const colour = knobWidget({ id: "tint", label: "Tint", type: "colour" }, "--danger");
  assert.match(colour, /class="pick"[^>]*aria-pressed="true"><span class="sw" style="background:var\(--danger\)"><\/span>/);
  const { host, io } = await demo("f1pick");
  const cell = await stageClick("s:cell:0,0", STAGE, host, io);
  assert.match(stageScreen(STAGE, cell), /class="pick" data-act="s:type:floor" aria-pressed="true"/);
  assert.match(stageScreen(STAGE, cell), /class="pick" data-act="s:type:water" aria-pressed="false"/);
});

test("F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autosave here, On your team) is a two-option § 5 framed pill: the label as text outside the frame, then Off and On, exactly one pressed; only the option that isn't set carries the act; 40 px frame, 48 px options, 30 px accent pill", async () => {
  const off = knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, false);
  assert.equal(off, '<div class="seg-row"><span class="seg-label">Wipe wins</span><span class="seg" role="group" data-seg="k:toggle:wipe"><button type="button" class="seg-opt" aria-pressed="true" aria-label="Wipe wins: Off"><span>Off</span></button><button type="button" class="seg-opt" aria-pressed="false" aria-label="Wipe wins" data-act="k:toggle:wipe"><span>On</span></button></span></div>');
  const { host, io } = await demo("f1seg");
  const view = await stageClick("s:view", STAGE, host, io);
  const before = stageScreen(STAGE, view);
  const after = stageScreen(STAGE, await stageClick("s:grid", STAGE, view, io));
  for (const html of [before, after]) {
    const frame = html.match(/<span class="seg-label">Grid lines<\/span><span class="seg" role="group" data-seg="s:grid">(.*?)<\/span><\/div>/)?.[1] ?? "";
    const options = frame.match(/<button [^>]*>/g) ?? [];
    assert.deepEqual([options.length, options.filter((tag) => tag.includes('aria-pressed="true"')).length], [2, 1]);
    assert.ok(options.every((tag) => tag.includes('aria-pressed="true"') !== tag.includes('data-act="s:grid"')));
  }
  assert.notEqual(before.match(/aria-pressed="true" aria-label="Grid lines(: Off)?"/)?.[0], after.match(/aria-pressed="true" aria-label="Grid lines(: Off)?"/)?.[0]);
  const code = sources.map(({ text }) => text).join("\n");
  assert.ok(['seg("Autosave here", ', 'seg("Grid lines", ', 'seg("On your team", ', 'seg(label, value === true, '].every((call) => code.includes(call)));
  assert.match(rule(".seg"), /height: 40px;.*border: 1px solid var\(--seg-line\); border-radius: 12px; background: var\(--surface\);/);
  assert.match(rule(".seg-opt"), /min-height: 48px; margin: -5px 0;.*background: transparent;/);
  assert.match(rule(".seg-opt > span"), /height: 30px; margin: 0 4px;.*border-radius: 8px;/);
  assert.equal(rule('.seg-opt[aria-pressed="true"] > span'), '.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }');
});

test("F1 danger: Delete, Remove, Remove link and Start new are always btn danger", () => {
  const soft = sources.flatMap(({ name, text }) => tags(text).filter((tag) => /data-act="[^"]*(?:delete|:del:|:drop:|unlink|fresh)/.test(tag) && !tag.includes("btn danger")).map((tag) => `${name}: ${tag}`));
  assert.deepEqual(soft, []);
  assert.match(unitButtons(false, false), /class="btn danger" data-act="s:delete">Delete</);
});

test("F1 icons: one maker file of 24 px line icons (stroke currentColor, fill only on play and more); Test buttons lead with play and ⋯ menus are the more icon", () => {
  assert.ok(ICON_NAMES.length >= 16);
  for (const name of ICON_NAMES) assert.match(icon(name), /^<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">.+<\/svg>$/);
  assert.deepEqual(ICON_NAMES.filter((name) => icon(name).includes("fill=")), ["play", "more"]);
  assert.match(rule(".ico"), /width: 24px; height: 24px;.*stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;/);
  const all = sources.map(({ text }) => text).join("\n");
  assert.equal(all.split("Test</button>").length, all.split('${icon("play")}Test</button>').length);
  assert.equal(/[⋯▶]/.test(all), false);
});

test("F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {
  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: false, readOnly: false, banner: null, problems: [] });
  assert.match(project, /<div class="card"><span class="thumb"><svg class="ico"/);
  for (const [name, kind] of [["home.ts", "stages"], ["rooms.ts", "grid"], ["units.ts", "units"], ["effects.ts", "effects"], ["levels.ts", "levels"]]) assert.ok(sources.find((file) => file.name === name)?.text.includes(`class="card">\${thumb("${kind}")}`), name);
  assert.match(rule(".thumb"), /width: 48px; height: 48px; border-radius: 8px;.*background: var\(--surface-2\); border: 1px solid var\(--line\); color: var\(--muted\);/);
});

test("F1 Undo chip: no Nothing to undo bar; after a paint the chip floats with the undo icon and Undo, and it hides while a sheet is open; its button is the 48 px hit area, under the scrim, with the pill 12 px above the stage body's bottom edge plus the safe area", async () => {
  const { host, io } = await demo("f1undo");
  const fresh = stageScreen(STAGE, host);
  assert.equal(fresh.includes("undo-chip") || fresh.includes("Nothing to undo"), false);
  const open = await stageClick("s:cell:0,0", STAGE, host, io);
  const pick = await stageClick("s:type:water", STAGE, open, io);
  const done = await stageClick("s:done", STAGE, pick, io);
  assert.match(stageScreen(STAGE, done), /<div class="float"><button type="button" class="undo-chip" data-act="s:undo"><span><svg class="ico"[^>]*><path d="M9 14L4 9l5-5"\/>.*?<\/svg>Undo<\/span><\/button><\/div>/);
  const again = await stageClick("s:cell:1,1", STAGE, done, io);
  assert.equal(stageScreen(STAGE, again).includes("undo-chip"), false);
  assert.equal(rule(".undo-chip"), ".undo-chip { position: absolute; z-index: 4; left: 12px; bottom: calc(8px + env(safe-area-inset-bottom)); min-height: 48px; padding: 4px; border: 0; background: transparent; }");
  assert.match(rule(".undo-chip > span"), /min-height: 40px;.*border-radius: 999px; background: var\(--surface\); border: 1px solid var\(--line\); box-shadow: var\(--shadow\);/);
});
```
