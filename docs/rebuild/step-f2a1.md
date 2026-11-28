# Rebuild record: step F2a1, the F1 carries (every framed-pill toggle's On option is `{label}: On`, matching Off; `app.css` drops the dead `.card.new`; the Budgets row leads with UX's budgets icon; the stage error Back, the unit-page rename button and the read-only levels card get the icon or thumb F1 named)

Original brief: [`docs/maker/steps/step-f2a1-carries.md`](../maker/steps/step-f2a1-carries.md) on the merge (kit r1, blob `75d945a1`, sha256 `3a0fbc4e628bf85136669fe84c517086600cbab52ed4bc381c3b048894ba155f`, 140 lines). Step id L3; Base L5; Branch L6; Delivery L7; Hand-back L8; Depends on L9; Read first L16; Kit L17; Carries L18; Goal L22; Placement card L30; Rulings L38 (1 the On label, 2 the 7 smoke lines, 3 dead CSS, 4 the Budgets icon, 5 the budgets test re-pin, 6 F-b's three placements, 7 the F1 test edits, 8 Rule 8); Files L48 (table L50–L63); Size L67; Smoke lines L71; Existing tests changed L74; Shipped tests L78 (four titles); Plants L86; Plant anchors L89; Example L99; Decisions note L102; QA checklist L106; Do not touch L113; Acceptance L117; Not in this step L127; Out of scope L134; Open questions L138. Count command L67 (QA's G7). The hard gate is **124** counted lines, 12 files, each file at its trial count (L63, L65).

Kit (pushed before the go in `77a64648`, the same commit as the base): `handoff/steps/tests/step-f2a1-carries/`, exactly 3 files, no `*.r0` copies; its `SHA256SUMS` (blob `71dc2840`, sha256 `8715682d02c2c62e706e81afa27c246197f687d9646382ebd9548858c2a0713d`, 2 entries) covers the other two. It holds the shipped test `tests/tools/f2a1-carries.test.ts` (sha256 `a86157f71502edef041511d399aa96c77099e199dbf6823e3f46889eaea93eff`, 88 lines, 4 titles) and `plants-f2a1.py` (blob `c9fbf17a`, sha256 `a39479a632527ad6310766321223f86c840b8fed234047bef22f1b421795cadc`, 31 lines, 12 plants). Box only, never pushed: the go-line paste `/workspace/share/f2a/step-f2a1-paste.md` (sha256 `d5f3db7431d8b3c90c63f93ffa8453c426c3fd6f8f9f0bfd61ca0f2825c18489`, 11 lines; L1 is exactly `export GH_BUILDER_TOKEN=<PASTE TOKEN HERE>`, L2 the helper-agents line); the trial `f2a1-trial.patch` (sha256 `37fb90d6701303bc65d9161b35ce2e4f81157e187c9e102e05c030a76b19d183`, 304 lines; trial commit `37493459` on `8791cecc`, tree `d202af4b`; `git am` on the go-line base `77a64648` gives tree `81ddf7ee`); EA's look-check shots `/workspace/share/f2a/trial-shots/` (not pushed). `PLAN-DELTA.patch` (sha256 `263f8934…`) and `PLAN-LINES.md` were also box only; the resulting plan (sha256 `ef212329…`, 461 lines) was pushed with the kit.

This is **F2a1**, the first half of the maker overhaul plan's F2a after an EA split (plan L70 on the merge, the F2a1 row; F2a2 is L71; the CEO 03:53 order line is unchanged at L86, and the split note is at L87, labelled a proposal). F1 left five small items for F2a ([`docs/rebuild/step-f1.md`](step-f1.md) L207–L212, sha256 `af2213b9…`). This step clears the four that don't need the new layout (guide L18, L23–L27): every framed-pill toggle's On option is announced as `{label}: On`, matching Off; `app.css` drops the dead `.card.new` selector; the Budgets row's button leads with UX's budgets icon; the stage error screen's Back, the unit page's rename button and the read-only/newer levels card get the icon or thumb F1 named (F-b). The fifth F2a bullet in L207–L212 (eyebrow headers and the icons for ☰, the stage switcher, the tool bar, close and chevrons) stays with F2a2, along with the Budgets row's move into ☰. Nothing changes in a handler, saved data, the format, layout, play or `map.tile`.

Sources: PR #116 (one branch, one round; https://github.com/G-TileEngine/tileengine/pull/116).
- Branch: `step/step-f2a1-carries-r1-chatA` (code head `10a0ca8a`, tip `4d4c68b6`; no force-push).
- Hand-back, on the merge: `handback/step-f2a1-carries/r1/HANDBACK.md` (HB1, blob `050cb26f`, 110 lines, sha256 `5be12f3af57fde8c5c2404f7ac373aef002a60f6381e2ac484f95214145a5b5c`). The same folder also has `changed-files.txt`, `checks-output.txt`, `stat.txt`, `test-output.txt` and `typecheck-output.txt`. No shots (EA's trial shots stayed on the box).
- CoS verify report (box): `/workspace/share/step-f2a1-verify/report.md` (V1, sha256 `101290ec1fcac15c09b1ef23b907c5668df25acf78efec55a122d37d4e440018`): READY FOR PR; CoS did not re-run the 25 smokes.
- QA docs on main:
  - Kit, pushed with the kit in `77a64648`: `docs/qa/step-f2a1-kit-review.md` (QK1, blob `a9d6a1b4`, 38 lines, sha256 `762001823a4d2b3a1aa9f75a66c40c6d0ab039bd857b512473cedced343ad8e5`): **OK TO SEND**, no must-fix. Three nits, none blocking (see (d)).
  - `docs/qa/step-f2a1-review.md` on `68bc4b57` (QA1, blob `b61739d8`, 14 lines, sha256 `dd6ec1d9fee8c54bdfc95c74c61812149de225e696bfa053f046aaa884ef94b6`): **OK TO MERGE**, expected tree `24a5304d`. Two non-blocking flags (see (d) and the carries).

Line cites use HB1, V1, QK1 and QA1. Product line cites are at merge `1ae71d48` (tree `24a5304d`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Kit and plan | `77a64648db3595d3205ee47b4bf53fe4c89734a7`, 22:39 (UK time, 27 Nov), tree `247e2c07`, on `6ac84b5d` (the ART1a record): the guide, the 3-file kit folder, QK1, and the plan's F2a split (plan sha256 `ef212329…`, 461 lines, blob `4fe15b9b`; edits L67 and L70, adds the proposal note after the order line). QK1 **OK TO SEND**, no must-fix. Test-neutral: `npm test` collects `tests/**/*.test.ts` only; CoS's clean-clone `node --test "tests/**/*.test.ts"` on that tree gave 1194/0 |
| Base | The same commit `77a64648`. The guide names `8791cecc` as its trial base (L5); main moved by the ART1a record (`6ac84b5d`, docs only) and this kit-and-plan commit (docs and handoff only) before the go. CoS confirmed the trial patch applies on `77a64648` (tree `81ddf7ee`). Floor **1194** tests, 1194 + 4 = **1198** after this step |
| r1 commits | `10a0ca8aad7acb1ad63319572dd9d7e274ddcff3` feat(maker): step F2a1 carries (r1 code head, tree `81ddf7ee8206a0f3e6ec43d8ed474abfaade102a` = the EA trial tree on this base, 2026-11-27 23:14 UK time), then `4d4c68b60ae4c05b77e8f86f870b232249d3bf14` docs(handback): step F2a1 carries r1 (tree `24a5304d5b2d32f57975fffdf94900129ba514d7`, 23:16; 6 files under `handback/step-f2a1-carries/r1/`). Linear on the base, noreply author and committer |
| r1 verdict | Green **1198/0**; tools tsc only the 3 base errors; plants 12/12, tree clean after; 12 files, **124 / 124**, every file on its trial cap; shipped test sha256 `a86157f7…` byte-identical to the kit; kit `sha256sum -c` passes; Rule 8 scan clean (HB1, V1). HANDBACK reports all 25 smokes PASS solo at 390 and 360, first pass (s11b on 8820); CoS did not re-run them. CoS V1: READY FOR PR. PR #116 opened 00:06 UK time (28 Nov). QA1 **OK TO MERGE**, expected tree `24a5304d`, floor 1198, no pin |
| Merge | PR #116 (opened 00:06, merged 00:10), merge commit `1ae71d48a525ccf420ed1572fa5b4d1aa377db50`, 2026-11-28 00:10 (UK time). Tree `24a5304d5b2d32f57975fffdf94900129ba514d7` (the tree CoS and QA expected). First parent `77a64648db3595d3205ee47b4bf53fe4c89734a7`, second parent `4d4c68b60ae4c05b77e8f86f870b232249d3bf14`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #116: Step F2a1: F1 carries (aria On labels, budgets icon, F-b icons)`. `merge-pr.sh --expect-tree 24a5304d`: npm test on the merge **1198 pass / 0 fail** |
| After the merge | `68bc4b57c10faec382db7a26b2f35fd2dbb906a8` (00:10, tree `037ca600`) adds only `docs/qa/step-f2a1-review.md` (QA1) |
| Postmerge | CoS did not run `qa-postmerge.sh` when this record was written. QA's own postmerge result is not in the repo |
| Tests | 1194 + N=4 (the four shipped tests in `tests/tools/f2a1-carries.test.ts`) = **1198 pass / 0 fail**. The floor after this merge is **1198** |

## (b) Files

From `git diff --name-status 77a64648..1ae71d48 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` against the merge's first parent, which is also the base `77a64648`. Caps are the guide's Files table (L50–L63), equal to the trial counts.

| File | Status | ins / del | cap | Counted? |
|---|---|---|---|---|
| `tools/maker/widgets.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/app.css` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/icons.ts` | M | 1 / 0 | 1 | yes. **1**, on cap |
| `tools/maker/budgets.ts` | M | 2 / 1 | 3 | yes. **3**, on cap |
| `tools/maker/stage.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/units.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/levels.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | M | 3 / 3 | 6 | yes. **6**, on cap |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | M | 4 / 4 | 8 | yes. **8**, on cap |
| `tests/project/budgets-11c1.test.ts` | M | 2 / 2 | 4 | yes. **4**, on cap |
| `tests/tools/f1-look-kit.test.ts` | M | 2 / 2 | 4 | yes. **4**, on cap |
| `tests/tools/f2a1-carries.test.ts` | A | 88 / 0 | 88 | yes. **88**, on cap (sha256 `a86157f71502edef041511d399aa96c77099e199dbf6823e3f46889eaea93eff`) |
| **Total** | 12 files | 107 / 17 | 124 | **124** |

What the merge does not touch:
- Nothing under `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `tools/maker/home.ts`, `tools/maker/project.ts`, `data/`, `fixtures/`, the root `package.json` or `package-lock.json`, `docs/maker/**`, `ui-shell`, or the F1, ART1a or F2a1 kit folders (V1, QK1, QA1). `painter-proto`, named in the guide's Do not touch (L113), does not exist in the repo.
- No new dependency, no committed PNG, no handler or saved-data change, no `map.tile` or tile-size setting change.
- No existing test or smoke changed except the four re-pins in Ruling 5 and Ruling 7 and the seven selector strings in Ruling 2. s6a and s6c differ only in those seven `[aria-label="On your team"]` → `[aria-label="On your team: On"]` substitutions.

The official count at the code head against the base, or at the merge against first parent `77a64648`, is **12 files changed, 107 insertions(+), 17 deletions(-)** = **124**, at the limit of 124 (the hard gate). Every file is on its trial cap (HB1 § Size, V1).

## (c) Key code and git commands

**Ruling 1, the On label.** `tools/maker/widgets.ts` L10, in `seg()`: the On option's name becomes `` `${label}: On` ``; Off keeps `` `${label}: Off` ``. Nothing else in `seg()` changes: exactly one option pressed, only the unset option carries `data-act`, the visible words stay "Off" and "On". Every call site (knob toggles, Grid lines, Autosave here, On your team) gets it through `seg()`.

**Ruling 2, the 7 smoke lines.** Each `[aria-label="On your team"]` in `handoff/steps/tests/s6a-win-rules/smoke.mjs` L54, L60, L62 and `handoff/steps/tests/s6c-checkpoint/smoke.mjs` L57, L62, L63, L69 becomes `[aria-label="On your team: On"]`. Nothing else in those files changes. The toggles are still tapped by their act.

**Ruling 3, dead CSS.** `tools/maker/app.css` L8 `.card.new, .choice[aria-pressed="true"] {` becomes `.choice[aria-pressed="true"] {` with its body unchanged. No markup has used `card new` since F1.

**Ruling 4, the Budgets icon.** `tools/maker/icons.ts` gains one entry after `resize`, UX's drawing from shot `f02`, stroke only, no fill. `tools/maker/budgets.ts` imports `icon` and the row button becomes `` …>${icon("budgets")}${summary}</button> ``. The icon is `aria-hidden`, so the button's accessible name stays the summary. The Budgets row stays where 11c1 put it; F2a2 moves it, icon and all, into ☰.

**Ruling 5, the budgets test re-pin.** `tests/project/budgets-11c1.test.ts` L124 and L127 no longer count every `aria-hidden="true"` (the icon is a fifth hidden node). Each count is now hidden meters by name: `(….match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length === 4`. The shipped test also pins the total of 5 hidden nodes on the open row. QK1 accepted the re-pin.

**Ruling 6, F-b's three placements.** (a) the stage error state (`stage.ts` L142) gets `${icon("back")}` before `Back`, as the normal stage bar already does; (b) the unit page's rename button (`units.ts` L108) gets `${icon("edit")}` before the name; (c) the read-only/newer levels card (`levels.ts` L24) gets `${thumb("levels")}` inside the card, as the Off, older and normal cards already do. The icons are `aria-hidden`; no button's name or text changes.

**Ruling 7, the F1 test edits.** `tests/tools/f1-look-kit.test.ts` L94: the On option's `aria-label="Wipe wins"` becomes `aria-label="Wipe wins: On"`. L105: `aria-label="Grid lines(: Off)?"` becomes `aria-label="Grid lines: (Off|On)"`. Nothing else in that file changes. The F1 kit folder is not edited. QK1 accepted the re-pin and noted that F1 kit plants P20 and P24 no longer apply after this step; the F1 folder stays as history.

**Ruling 8.** One statement per line in all new code; no chained control headers. Type-literal members separated by `;` are not statements. The edits inside existing dense lines (Rulings 1, 3–7) are the only changes in those lines.

**Shipped tests:** the four titles in `tests/tools/f2a1-carries.test.ts` (88/88, verbatim, sha256 `a86157f7…`): the On label and the 7 smoke selectors; no `.card.new`; the Budgets icon, 4 hidden meters and 5 hidden nodes; F-b's three placements.

```
# Full product diff against the merge's first parent (also the base):
#
#   git diff 77a64648 1ae71d48 -- . ':!handback/**' ':!docs/**'
#   (the 12 files in (b))
#
# The hand-back (not in the 124):
#   git show 1ae71d48:handback/step-f2a1-carries/r1/HANDBACK.md
#
# Product gate. Official command at the code head against the base, or at
# the merge against first parent 77a64648:
#
#   git diff --shortstat 77a64648..HEAD -- . ':!handback/**' ':!package-lock.json'
#   12 files changed, 107 insertions(+), 17 deletions(-)
#
# Named tests (npm test 1198/0, floor 1194 + N=4): the four "F2a1 …" titles of
# tests/tools/f2a1-carries.test.ts.
#
# tools tsc (npx tsc --noEmit -p tools/tsconfig.json): only effect-designer
# page.ts L101 (TS18047) and maker home.ts L93 (×2, TS7053).
#
# Plants: handoff/steps/tests/step-f2a1-carries/plants-f2a1.py (a39479a6),
# 12/12 caught at the code head (HB1, V1, QA1), tree clean after:
# P1–P12 as guide L89 (the On option's bare or Off label; a smoke still on the
# old selector; .card.new back; the Budgets row without its icon, or with the
# icon after the words, or a different or filled drawing; the stage error Back
# without the icon; the rename button without the edit icon; the read-only
# levels card without its thumb; the picked .choice rule loses its ring).
#
# Smokes: all 25 solo at 390 and 360, required (guide L71). Only s6a and s6c
# edited, by ruling. HANDBACK reports first-pass PASS, ok counts matching the
# guide, s11b on 8820. CoS did not re-run them at verify. Export audit not
# required (no play, export or build file).
```

## (d) What went wrong, in order, and the fix

**No must-fix, one round.** QK1 was OK TO SEND with no must-fix. QA1 was OK TO MERGE on r1. The code-head tree equals the EA trial tree `81ddf7ee` on the go-line base, so the kit-review checks on the trial code all carry over (QA1).

**The paste after main moved.** The guide and paste name base `8791cecc`. Before the go, main moved by the ART1a record (`6ac84b5d`, docs only) and the kit-and-plan push (`77a64648`, docs and handoff only). CoS confirmed the trial patch applies on `77a64648` (tree `81ddf7ee`) before the go. The builder branched from `77a64648` (HB1 § Decisions).

**QK1 nits, none blocking (QK1).**
- Guide L131 (Not in this step, ART1b) cites `sprite.ts` "L55 and L71". Those are the ART1a r1-tip numbers; on main, and at this merge, they are **L59 and L75**. QK1: fix if the guide is re-rolled; otherwise the ART1b guide must cite L59/L75. Carried forward.
- The `*.r0` copies in `/workspace/share/f2a/` were already gone when CoS pushed the kit; they were never on the push list.
- The F2a split is EA's proposal; UX owns the plan and CoS adopts it. Correctly labelled as a proposal on plan L87, not a CEO ruling.

**Re-pins QK1 accepted.** Ruling 5's meter-by-name count is stricter on meter markup and keeps the original intent (four decorative meters); the shipped test pins the fifth hidden node. Ruling 7's L94 is the same full-string pin with only the On label changed; L105's regex now needs the colon form for both options, so it is stricter. F1 kit plants P20/P24 no longer apply after this step; the F1 folder stays as history (QK1, guide L7 / Ruling 7).

**QA1 flag 1, HANDBACK Rule 8 wording (not blocking).** HANDBACK's Rule 8 section says "the diff adds no new statement" and that Rulings 1 and 3–7 are all substitutions inside existing lines. That isn't exact: Ruling 4 adds two new lines (the `budgets.ts` import and the `icons.ts` member), and the shipped test is new code. All of them are one statement per line, so Rule 8 holds; only the wording is loose (QA1). CoS's V1 scan of added lines found 0 chained control headers.

**Other notes.**
- The builder ran Node v22.23.3 (`.nvmrc` 24; root engines ≥ 22.18.0), which QA1 accepted. CoS's green ran on 24.22.1.
- Guide L128 still names F2a2 as "plan L70". That was the pre-split F2a row. On the plan pushed in the same commit as the guide, F2a1 is L70 and F2a2 is L71. The ART1a-style cite in this record uses the plan as merged.

## (e) Do it right first time

- A hand-back's Rule 8 section should name new lines and a new test file, not only the in-place substitutions. "No new statement packed onto an existing line" is the rule; a new import, a new type-literal member and a verbatim shipped test are new lines, and they still have to pass one-statement-per-line.
- When a later step cites a line number that a previous rework moved, cite the line on current main (ART1a r2 moved `sprite.ts`'s `?? [0, 0, 0]` from L55/L71 to L59/L75) and say so.
- A kit folder that a later step re-pins stays as history; say which of its plants no longer apply (here F1 P20/P24) rather than editing the old kit.
- A default path or a CLI fallback was not in this step; the ART1a lessons stand.
- When main moves before the go, confirm the move is docs/handoff only and that the trial patch still applies; branch from the new main.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only docs: QA1):
#   git diff 1ae71d48 HEAD -- <the 12 files in (b)>
#   (empty)
#
# Product gate at the merge against first parent 77a64648:
#   git diff --shortstat 77a64648..1ae71d48 -- . ':!handback/**' ':!package-lock.json' ':!docs/**'
#   12 files changed, 107 insertions(+), 17 deletions(-)
#
# Green: npm ci && npm run green → 1198 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L93 ×2).
# Kit: cd handoff/steps/tests/step-f2a1-carries && sha256sum -c SHA256SUMS → OK.
# Shipped test: sha256sum tests/tools/f2a1-carries.test.ts → a86157f7….
# Plants: python3 handoff/steps/tests/step-f2a1-carries/plants-f2a1.py → 12/12 caught, tree clean.
# Smokes: all 25 solo at 390 and 360; only s6a and s6c differ, and only in the 7 selectors.
```

## QA non-blockers carried forward

- **To F2a2** (guide L128, plan L71 and L87): opening a game on the stage editor; the ☰ game menu and stage switcher sheets; the project page deleted; Budgets (with this step's icon) and Build game moved into ☰; 14 smokes and 2 tests rebased. Also the fifth F2a bullet in step-f1.md L207–L212: eyebrow section headers (UX 15:4x) and the icons for ☰, the stage switcher, close, chevrons and the picked check. UX still lists which existing headers become eyebrows before F2a2's kit (guide Open question 2).
- **To F2b:** `+ Add ability`'s plus icon (UX 16:45; guide L129; step-f1.md).
- **To F3b:** pictures in thumbnails and chips; the terrain chip's swatch or picture (step-f1.md).
- **To F4:** the § 7 `.chips` wrap row; the tool-bar icons; the unit page's 72×72 thumb (guide L130; step-f1.md).
- **To ART1b** (guide L131, QK1 nit 1, QA1 flag 2): the manifest hash order; `rgb()` `#rrggbb` only; drop both `?? [0, 0, 0]` black fallbacks in `sprite.ts`. The guide's L131 cites L55 and L71 (the ART1a r1-tip numbers); **on main they are L59 and L75**, and the ART1b guide must cite L59/L75. The ramp bound is still the palette contract UX and DSK settle (see `docs/rebuild/step-art1a.md`).
- **F1 kit plants P20 and P24 stop applying** after this step (QK1, guide Ruling 7). The F1 kit folder `handoff/steps/tests/step-f1-look-kit/` was not edited and stays as history.
- **Unchanged:** the F0c, 11a, 11a2, 11b and 11c1 carries stand (`docs/rebuild/step-f1.md`).
- **Open for UX:** the F2a split and the F2a2 row are EA's proposal, already adopted on the plan as a proposal (plan L87, QK1 nit 3); F2a2's kit sizes that row with a trial (guide Open question 1).
- **Process:** the builder's Node is v22 (`.nvmrc` 24).
- **Closed here:** the four F2a carries in step-f1.md L207–L212 that this step took (the On label, `.card.new`, the Budgets icon, F-b's three placements); plan F2a1 (L70); QK1's re-pins.

## Blob check

Each file must have exactly this git blob id at `1ae71d48`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/maker/widgets.ts` | `186cd6c9493c57ffe7a5b427379c0bb99562e605` | 31 |
| `tools/maker/app.css` | `bc1f0b2626388009b16a2a823e7ee784c4df58ed` | 74 |
| `tools/maker/icons.ts` | `0bbe4f540864191454158ed04e419881ebc0e98b` | 23 |
| `tools/maker/budgets.ts` | `e2a828adc7a511126cf52824bcf2f1332101dcfe` | 41 |
| `tools/maker/stage.ts` | `476ee2954c1f6db6dea62ca9a9ce6f543dca5aac` | 276 |
| `tools/maker/units.ts` | `897f11720f50986f280b02323aff26eb330b85e3` | 184 |
| `tools/maker/levels.ts` | `68d028e1054e6c7249441a3fefbed5ec34b9642d` | 75 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | `70b17737cb8eb19d5f395b409492faa9ec1c7ae1` | 76 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | `1fa2da9197fc567e4eff38805812b13aac460221` | 119 |
| `tests/project/budgets-11c1.test.ts` | `669b26f9f42e9c3ba3ccd2e27e2bc7db6dca220c` | 133 |
| `tests/tools/f1-look-kit.test.ts` | `1026130a9f822d38c8c8e1a7d9335868f6683cf8` | 149 |
| `tests/tools/f2a1-carries.test.ts` | `67b8a8a789579033b9c18e1d005108c6da731df8` | 88 |

## Appendix: full code as merged (step F2a1, PR #116)

New files are `git show 1ae71d48:<path>` in full. Edited files are `git diff 77a64648 1ae71d48 -- <path>`, which is the same as against the base `77a64648`.

### `tools/maker/widgets.ts` (edited)

```diff
diff --git a/tools/maker/widgets.ts b/tools/maker/widgets.ts
index a72190e..186cd6c 100644
--- a/tools/maker/widgets.ts
+++ b/tools/maker/widgets.ts
@@ -7,7 +7,7 @@ const optOf = (item: KnobOpt): { readonly value: string; readonly label: string
 const num = (v: number | null | undefined): string => (typeof v === "number" ? String(v) : "");
 export function seg(label: string, on: boolean, act: string): string {
   const opt = (word: string, set: boolean, name: string): string => `<button type="button" class="seg-opt" aria-pressed="${set ? "true" : "false"}" aria-label="${name}"${set ? "" : ` data-act="${act}"`}><span>${word}</span></button>`;
-  return `<div class="seg-row"><span class="seg-label">${label}</span><span class="seg" role="group" data-seg="${act}">${opt("Off", !on, `${label}: Off`)}${opt("On", on, label)}</span></div>`;
+  return `<div class="seg-row"><span class="seg-label">${label}</span><span class="seg" role="group" data-seg="${act}">${opt("Off", !on, `${label}: Off`)}${opt("On", on, `${label}: On`)}</span></div>`;
 }
 export function knobWidget(spec: KnobSpec, value: unknown): string {
   const id = esc(spec.id), label = esc(spec.label);
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index a20e477..bc1f0b2 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -5,7 +5,7 @@
 .body { flex: 1; min-height: 0; overflow: auto; padding: 16px 16px calc(20px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 12px; }
 .card, .choice { display: flex; align-items: center; gap: 10px; min-height: 72px; padding: 12px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); text-align: left; color: var(--ink); }
 .card-hit { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; flex: 1; min-height: 48px; background: transparent; color: var(--ink); border: 0; box-shadow: none; padding: 0; text-align: left; }
-.card.new, .choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }
+.choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }
 .card .grow, .choice { flex: 1; }
 .card .grow { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
 .name { font-weight: 700; font-size: 16px; }
```

### `tools/maker/icons.ts` (edited)

```diff
diff --git a/tools/maker/icons.ts b/tools/maker/icons.ts
index 9fc4a6b..0bbe4f5 100644
--- a/tools/maker/icons.ts
+++ b/tools/maker/icons.ts
@@ -15,6 +15,7 @@ const PATHS = {
   edit: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
   plus: `<path d="M12 5v14M5 12h14"/>`,
   resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
+  budgets: `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`,
 } as const;
 export type IconName = keyof typeof PATHS;
 export const ICON_NAMES = Object.keys(PATHS) as readonly IconName[];
```

### `tools/maker/budgets.ts` (edited)

```diff
diff --git a/tools/maker/budgets.ts b/tools/maker/budgets.ts
index 8ed93f7..e2a828a 100644
--- a/tools/maker/budgets.ts
+++ b/tools/maker/budgets.ts
@@ -1,6 +1,7 @@
 import { budgetUse, readProject, type BudgetUse } from "../../src/project/load/index.ts";
 import type { BudgetKey } from "../../src/types/core-types.ts";
 import { parseProject } from "./project-files.ts";
+import { icon } from "./icons.ts";
 const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
 const LABEL: Readonly<Record<BudgetKey, string>> = { units: "Units", activeAi: "Active AI", effects: "Effects", stageTiles: "Stage size" };
 let open = false;
@@ -36,5 +37,5 @@ export function budgetsRow(files: Readonly<Record<string, string>>): string {
   for (const use of rows) if (use.used > use.limit) over += 1; else if (use.used >= use.warn) near += 1;
   const summary = over > 0 ? `Budgets: ${over} over the limit` : near > 0 ? `Budgets: ${near} near the limit` : "Budgets: all good";
   const body = open ? rows.map(rowHtml).join("") : "";
-  return `<div class="budgets" data-budgets><button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="${open ? "true" : "false"}">${summary}</button>${body}</div>`;
+  return `<div class="budgets" data-budgets><button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="${open ? "true" : "false"}">${icon("budgets")}${summary}</button>${body}</div>`;
 }
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 4132a93..476ee29 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -139,7 +139,7 @@ async function commitStage(io: Io, host: Host, stage: Obj, prior: Obj, extra: Re
 }
 export function stageScreen(stageId: string, host: Host): string {
   const got = bundle(host.files, stageId);
-  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
+  if ("error" in got) return `<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>Stage</h1></header><div class="body"><p class="banner bad" role="alert">${esc(got.error)}</p></div>`;
   const name = typeof got.stage["name"] === "string" ? got.stage["name"] : "Stage", placed = marks(got.parsed, got.stage);
   let users = 0; for (const [path, doc] of Object.entries(got.parsed)) if (path.startsWith("stages/") && isObj(doc) && doc["mapRef"] === got.stage["mapRef"]) users += 1;
   const note = users > 1 ? `<p class="sub">This map is used by ${users} stages. Painting changes all of them.</p>` : "";
```

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index 2a12cd1..897f117 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -105,7 +105,7 @@ export function unitPage(files: DocText, readOnly: boolean, banner: string | nul
   const roleBtn = readOnly || roles.length === 0 ? "" : `<button type="button" class="btn ghost" data-act="u:role">Start from a role</button>`;
   const roleSheet = sess.mode !== "role" ? "" : `<div class="scrim"><div class="sheet" role="dialog"><h2>Start from a role</h2>${roles.map((role) => `<button type="button" class="btn ghost" data-act="u:apply:${esc(role.id)}">${esc(role.label)}</button>`).join("")}<button type="button" class="btn ghost" data-act="u:close">Close</button></div></div>`;
   const note = banner === null ? "" : `<p class="banner bad" role="alert">${esc(banner)}</p>`;
-  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${esc(name)}</button>`;
+  const rename = readOnly ? "" : `<p class="sub">Name</p><button type="button" class="btn ghost" data-act="u:rename">${icon("edit")}${esc(name)}</button>`;
   return `<header class="topbar"><button type="button" class="btn ghost" data-act="u:back">${icon("back")}Back</button><h1>${esc(name)}</h1></header><div class="body">${note}${rename}${roleBtn}${stats}${team}${abilities}</div>${sess.mode === "rename" ? sheet() : ""}${roleSheet}`;
 }
 async function undo(io: UnitIo, host: Host): Promise<UnitHit> {
```

### `tools/maker/levels.ts` (edited)

```diff
diff --git a/tools/maker/levels.ts b/tools/maker/levels.ts
index dd29fac..68d028e 100644
--- a/tools/maker/levels.ts
+++ b/tools/maker/levels.ts
@@ -21,7 +21,7 @@ const slider = (id: string, label: string, value: number, min: number, max: numb
 export function levelsSection(files: DocText, readOnly: boolean): string {
   const bag = bagOf(files); if (bag === null) return "";
   const gate = addCase(bag, BUNDLED), head = `<h2>Levels</h2>`;
-  if (readOnly || gate.mode === "newer") return `${head}<div class="card"><p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p></div>`;
+  if (readOnly || gate.mode === "newer") return `${head}<div class="card">${thumb("levels")}<p>${esc(gate.mode === "newer" ? gate.text : "Made with a newer TileEngine. Open only.")}</p></div>`;
   if (gate.mode === "older") return `${head}<div class="card">${thumb("levels")}<p>${esc(gate.text)}</p>${gate.update ? `<button type="button" class="btn ghost" data-act="l:update">Update</button>` : ""}</div>`;
   const view = curveOf(bag); if (view === null) return `${head}<div class="card">${thumb("levels")}<span class="name">Levels: Off</span><button type="button" class="btn ghost" data-act="l:on">Turn on levels</button></div>`;
   return `${head}<div class="card">${thumb("levels")}<button type="button" class="grow card-hit" data-act="l:open"><span class="name">Levels: ${view.n} · ${view.total} XP to the top</span></button></div>`;
```

### `handoff/steps/tests/s6a-win-rules/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6a-win-rules/smoke.mjs b/handoff/steps/tests/s6a-win-rules/smoke.mjs
index 729f7e3..70b1773 100644
--- a/handoff/steps/tests/s6a-win-rules/smoke.mjs
+++ b/handoff/steps/tests/s6a-win-rules/smoke.mjs
@@ -51,15 +51,15 @@ try {
       await shot("05-occupied"); tiny.push(...await big());
     });
     await step("8 editor", async () => {
-      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team"]') !== null, null, { timeout: 15000 });
+      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team: On"]') !== null, null, { timeout: 15000 });
       tiny.push(...await big()); if (width === 360) { await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover(".scrim .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
     });
     await step("5 empty hero", async () => {
       await tap(page, "u:back"); await tap(page, "s:back"); await press(page, "Back"); await press(page, "New project"); await press(page, "Empty", true); await press(page, "Continue"); await press(page, "Create");
       await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await tap(page, "u:create");
-      await page.waitForFunction(() => document.querySelector('[data-knob="unit_hp"]')?.value === "9" && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
+      await page.waitForFunction(() => document.querySelector('[data-knob="unit_hp"]')?.value === "9" && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
       await tap(page, "u:role"); await waitText(page, "Warrior (BTF)"); tiny.push(...await big()); await tap(page, "u:close");
-      await page.locator('[aria-label="On your team"]').scrollIntoViewIfNeeded(); await shot("03-on-your-team"); tiny.push(...await big());
+      await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("03-on-your-team"); tiny.push(...await big());
       await tap(page, "t:team"); await page.waitForFunction(() => { const files = window.__read(), gear = JSON.parse(files["project.json"]).project.loadout, id = gear.roster.at(-1); return gear.roster.length === 1 && gear.size === 1 && typeof id === "string" && String(files[`units/${id}.json`] ?? "").includes("Hero"); }, null, { timeout: 15000 });
     });
     await step("6 empty board", async () => {
```

### `handoff/steps/tests/s6c-checkpoint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6c-checkpoint/smoke.mjs b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
index 7017813..1fa2da9 100644
--- a/handoff/steps/tests/s6c-checkpoint/smoke.mjs
+++ b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
@@ -54,19 +54,19 @@ try {
       await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Hero", null, { timeout: 15000 });
       await slide(page, '[data-knob="unit_hp"]', "20"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "20", null, { timeout: 15000 }); await quiet(page);
       await slide(page, '[data-knob="unit_atk"]', "5"); await page.waitForFunction(() => document.querySelector('[data-val="unit_atk"]')?.textContent === "2", null, { timeout: 15000 }); await quiet(page);
-      await see(); await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 }); await quiet(page);
+      await see(); await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 }); await quiet(page);
       await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 }); await see();
       const bin = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); if (bin === "") throw new Error("bin"); await tap(page, bin);
       await page.waitForFunction(() => document.querySelector('[data-sheet="cards"]') !== null, null, { timeout: 15000 }); await see(); await tap(page, "g:add:line-shot");
       await page.waitForFunction(() => document.querySelector('[data-act="a:shut"]') !== null && document.querySelector('[data-knob="range"]')?.value === "3" && document.querySelector('[data-knob="damage"]')?.value === "2", null, { timeout: 15000 }); await see();
-      await tap(page, "a:shut"); await page.waitForFunction(() => document.body.innerText.includes("Line Shot") && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
-      await page.locator('[aria-label="On your team"]').scrollIntoViewIfNeeded(); await shot("04-hero");
+      await tap(page, "a:shut"); await page.waitForFunction(() => document.body.innerText.includes("Line Shot") && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
+      await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("04-hero");
       await page.locator('[data-role="card"]').last().scrollIntoViewIfNeeded(); await shot("04b-ability");
     });
     await step("5 raider", async () => {
       await tap(page, "u:back"); await quiet(page); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Raider"); await see(); await tap(page, "u:create");
       await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Raider", null, { timeout: 15000 });
-      await slide(page, '[data-knob="unit_hp"]', "2"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "2" && document.querySelector('[data-act="u:reset:unit_hp"]') !== null && document.querySelector('[aria-label="On your team"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
+      await slide(page, '[data-knob="unit_hp"]', "2"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "2" && document.querySelector('[data-act="u:reset:unit_hp"]') !== null && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
       await see(); await shot("05-raider"); await tap(page, "u:back"); await quiet(page);
     });
     await step("6 place", async () => {
```

### `tests/project/budgets-11c1.test.ts` (edited)

```diff
diff --git a/tests/project/budgets-11c1.test.ts b/tests/project/budgets-11c1.test.ts
index dcc0e1c..669b26f 100644
--- a/tests/project/budgets-11c1.test.ts
+++ b/tests/project/budgets-11c1.test.ts
@@ -121,10 +121,10 @@ test("11c1 maker: the Budgets row after the stages in UX's words: one summary li
   assert.equal(view().includes("Budgets: all good") && view().includes("btn ghost stage-row") && !view().includes('data-budget="'), true);
   budgetsTap(() => undefined);
   const open = view();
-  assert.equal(open.includes('aria-expanded="true"') && ["Units</span> <span>7 of 80</span>", "Active AI</span> <span>2 of 24</span>", "Effects</span> <span>0 of 12</span>", "Stage size</span> <span>54 of 65536</span>"].every((bit) => open.includes(bit)) && !open.includes("\u00b7") && open.split('aria-hidden="true"').length === 5, true);
+  assert.equal(open.includes('aria-expanded="true"') && ["Units</span> <span>7 of 80</span>", "Active AI</span> <span>2 of 24</span>", "Effects</span> <span>0 of 12</span>", "Stage size</span> <span>54 of 65536</span>"].every((bit) => open.includes(bit)) && !open.includes("\u00b7") && (open.match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length === 4, true);
   assert.ok(open.indexOf('data-budget="units"') < open.indexOf('data-budget="activeAi"') && open.indexOf('data-budget="activeAi"') < open.indexOf('data-budget="effects"') && open.indexOf('data-budget="effects"') < open.indexOf('data-budget="stageTiles"'));
   setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
-  assert.equal(view().includes("Budgets: 1 over the limit") && view().includes("7 of 9 \u00b7 near limit") && view().includes("2 of 1 \u00b7 over limit") && view().includes("0 of 12</span>") && view().split('aria-hidden="true"').length === 5, true);
+  assert.equal(view().includes("Budgets: 1 over the limit") && view().includes("7 of 9 \u00b7 near limit") && view().includes("2 of 1 \u00b7 over limit") && view().includes("0 of 12</span>") && (view().match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length === 4, true);
   setBudgets(files, { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } });
   assert.equal(view().includes("Budgets: 1 near the limit"), true);
   const clear = bag();
```

### `tests/tools/f1-look-kit.test.ts` (edited)

```diff
diff --git a/tests/tools/f1-look-kit.test.ts b/tests/tools/f1-look-kit.test.ts
index 28be62a..1026130 100644
--- a/tests/tools/f1-look-kit.test.ts
+++ b/tests/tools/f1-look-kit.test.ts
@@ -91,7 +91,7 @@ test("F1 pickers: every aria-pressed button is a .pick chip or a framed-pill tog
 
 test("F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autosave here, On your team) is a two-option § 5 framed pill: the label as text outside the frame, then Off and On, exactly one pressed; only the option that isn't set carries the act; 40 px frame, 48 px options, 30 px accent pill", async () => {
   const off = knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, false);
-  assert.equal(off, '<div class="seg-row"><span class="seg-label">Wipe wins</span><span class="seg" role="group" data-seg="k:toggle:wipe"><button type="button" class="seg-opt" aria-pressed="true" aria-label="Wipe wins: Off"><span>Off</span></button><button type="button" class="seg-opt" aria-pressed="false" aria-label="Wipe wins" data-act="k:toggle:wipe"><span>On</span></button></span></div>');
+  assert.equal(off, '<div class="seg-row"><span class="seg-label">Wipe wins</span><span class="seg" role="group" data-seg="k:toggle:wipe"><button type="button" class="seg-opt" aria-pressed="true" aria-label="Wipe wins: Off"><span>Off</span></button><button type="button" class="seg-opt" aria-pressed="false" aria-label="Wipe wins: On" data-act="k:toggle:wipe"><span>On</span></button></span></div>');
   const { host, io } = await demo("f1seg");
   const view = await stageClick("s:view", STAGE, host, io);
   const before = stageScreen(STAGE, view);
@@ -102,7 +102,7 @@ test("F1 toggles: every on/off toggle (rules and knob toggles, Grid lines, Autos
     assert.deepEqual([options.length, options.filter((tag) => tag.includes('aria-pressed="true"')).length], [2, 1]);
     assert.ok(options.every((tag) => tag.includes('aria-pressed="true"') !== tag.includes('data-act="s:grid"')));
   }
-  assert.notEqual(before.match(/aria-pressed="true" aria-label="Grid lines(: Off)?"/)?.[0], after.match(/aria-pressed="true" aria-label="Grid lines(: Off)?"/)?.[0]);
+  assert.notEqual(before.match(/aria-pressed="true" aria-label="Grid lines: (Off|On)"/)?.[0], after.match(/aria-pressed="true" aria-label="Grid lines: (Off|On)"/)?.[0]);
   const code = sources.map(({ text }) => text).join("\n");
   assert.ok(['seg("Autosave here", ', 'seg("Grid lines", ', 'seg("On your team", ', 'seg(label, value === true, '].every((call) => code.includes(call)));
   assert.match(rule(".seg"), /height: 40px;.*border: 1px solid var\(--seg-line\); border-radius: 12px; background: var\(--surface\);/);
```

### `tests/tools/f2a1-carries.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix, storedRev } from "../../src/editor/project/home.ts";
import { budgetsRow, budgetsTap } from "../../tools/maker/budgets.ts";
import { ICON_NAMES, icon, thumb } from "../../tools/maker/icons.ts";
import { levelsSection } from "../../tools/maker/levels.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { bindUnits, openUnit, unitPage } from "../../tools/maker/units.ts";
import { knobWidget, seg } from "../../tools/maker/widgets.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const STAGE = "stage_01JDAS00000000000000000001";
const ARCHER = "unit_01JDAN00000000000000000002";
const NOW = "2026-11-27T00:00:00.000Z";
const BUDGETS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>';
const css = readFileSync(join(root, "tools/maker/app.css"), "utf8");
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
const DEMO = readDir("fixtures/demo.tileproj");
const labels = (html: string): string[][] => [...html.matchAll(/class="seg-opt" aria-pressed="(true|false)" aria-label="([^"]*)"/g)].map((hit) => [hit[1] ?? "", hit[2] ?? ""]);
async function demo(id: string): Promise<{ host: Host; io: { store: ReturnType<typeof memoryStore>; id: string; now: string } }> {
  const parsed = parseProject(DEMO);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) throw new Error("demo");
  const io = { store: memoryStore(), id, now: NOW };
  for (const [path, body] of Object.entries(DEMO)) await io.store.write(`${prefix(id)}${path}`, body);
  bindStage(STAGE, id);
  return { host: { files: DEMO, rev: storedRev(parsed.files), readOnly: false, banner: null, dirty: false }, io };
}

test('F2a1 toggles: the On option\'s aria-label is "{label}: On", matching Off\'s "{label}: Off" (UX 16:45), on every framed-pill toggle, and the 7 smoke lines read the new label', async () => {
  assert.deepEqual(labels(knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, false)), [["true", "Wipe wins: Off"], ["false", "Wipe wins: On"]]);
  assert.deepEqual(labels(knobWidget({ id: "wipe", label: "Wipe wins", type: "toggle" }, true)), [["false", "Wipe wins: Off"], ["true", "Wipe wins: On"]]);
  assert.deepEqual(labels(seg("On your team", true, "t:team")), [["false", "On your team: Off"], ["true", "On your team: On"]]);
  const { host, io } = await demo("f2a1seg");
  const view = stageScreen(STAGE, await stageClick("s:view", STAGE, host, io));
  assert.deepEqual(labels(view).map(([, name]) => name), ["Grid lines: Off", "Grid lines: On"]);
  const smokes = ["s6a-win-rules", "s6c-checkpoint"].map((name) => readFileSync(join(root, "handoff/steps/tests", name, "smoke.mjs"), "utf8"));
  assert.deepEqual(smokes.map((text) => text.split('[aria-label="On your team: On"]').length - 1), [3, 4]);
  assert.equal(smokes.some((text) => text.includes('[aria-label="On your team"]')), false);
});

test("F2a1 dead CSS: app.css has no .card.new (no markup uses it since F1); the picked .choice rule stays as it was", () => {
  assert.equal(css.includes(".card.new"), false);
  const picked = css.split("\n").filter((line) => line.startsWith('.choice[aria-pressed="true"] {'));
  assert.deepEqual(picked, ['.choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }']);
});

test("F2a1 Budgets icon: UX's budgets line icon (shot f02) leads the Budgets row's button; the button's words, its act and the four aria-hidden meters are unchanged", () => {
  assert.equal(icon("budgets"), BUDGETS);
  assert.ok(ICON_NAMES.includes("budgets"));
  const shut = budgetsRow(DEMO);
  assert.ok(shut.includes(`<button type="button" class="btn ghost stage-row" data-act="budgets" aria-expanded="false">${BUDGETS}Budgets: all good</button>`));
  budgetsTap(() => undefined);
  const open = budgetsRow(DEMO);
  budgetsTap(() => undefined);
  assert.equal((open.match(/<meter [^>]*aria-hidden="true"><\/meter>/g) ?? []).length, 4);
  assert.equal(open.split('aria-hidden="true"').length - 1, 5);
  assert.ok(open.includes(`aria-expanded="true">${BUDGETS}Budgets: all good</button>`));
});

test("F2a1 placements (F1 carry F-b): the stage error state's Back has the back icon, the unit page's rename button has the edit icon, and the read-only levels card has the levels thumb", async () => {
  const { host } = await demo("f2a1fb");
  const broken = stageScreen("stage_01JDAS0000000000000000NONE", host);
  assert.ok(broken.startsWith(`<header class="topbar"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>Stage</h1></header>`));
  bindUnits("f2a1fb");
  openUnit(ARCHER);
  assert.match(unitPage(DEMO, false, null), new RegExp(`data-act="u:rename">${icon("edit").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]+</button>`));
  assert.equal(unitPage(DEMO, true, null).includes('data-act="u:rename"'), false);
  assert.ok(levelsSection(DEMO, true).includes(`<div class="card">${thumb("levels")}<p>Made with a newer TileEngine. Open only.</p></div>`));
  assert.ok(levelsSection(DEMO, false).includes(`<div class="card">${thumb("levels")}`));
});
```
