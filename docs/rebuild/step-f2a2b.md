# Rebuild record: step F2a2b, land on the map (opening a game lands on the stage editor; ☰ and the stage switcher are wired from F2a2a's `game-menu.ts`; the project page is deleted; Budgets and Build game move into ☰)

Original brief: [`docs/maker/steps/step-f2a2b-land-on-map.md`](../maker/steps/step-f2a2b-land-on-map.md) on the merge (kit r2, blob `a2925a71`, sha256 `4ed8d0ea3a044da6906a6b111d85e8bbd5a5b4bbf38c9f794725712c6aa78407`, 492 lines). Step id L3 (Revision: r2, one rework round after QA's r1 kit review); Base L5; Branch L6; Delivery L7; Hand-back L8; Depends on L9–L16 (F2a2a merged, plan L71/L86/L87, step-f1 L207–L212, step-f2a1, style-spec L71/L73/L76/L77, UX 00:22 and EA 01:37); Read first L17; Kit L18; F1 plants P20 and P24 stay dead L19; Carries L20 (`state.problems` has no reader after r2's travel fix); Goal L24–L25; Placement card L27–L33; Rulings L35 (4 Budgets and Build mounted as they are L36; 6 Landing L37; 7 Leaving and saving L38; 8 Back from Test L39; 9 Paint L40; L42 says rulings 1–3 and 5 are F2a2a's; 10 r2 Law 12 L45; 11 r2 Rule 8 L46; 12 r2 ☰ counts L47; 13 r2 Continue L48); Files L50 (stage.ts and test-launch.ts L51; project.ts deleted L56; units.ts and effects.ts L57; home.ts L78; Tests rebased L311; Smoke lines L328; Earlier kit pins L410); Caps L415–L451; Kit and plants L453–L456 (1 test, 27 plants; P17–P27 this slice, of which P23–P27 were added in r2); Acceptance L458–L465; Must NOT L467–L468; Open points L470–L479 (1–9); Places that change if UX re-rules the eyebrow L481–L486; EA trial record L488; Hand-back sections L491. Count command L415 (against the go-line base). The counted total is **397** lines, 32 files, each file at its trial count (L419–L451). The hard gate is **400**.

Kit (pushed before the go in `fd87b913`, the same commit as the base): `handoff/steps/tests/step-f2a2b-land-on-map/`, exactly 3 files, no `*.r0` copies; its `SHA256SUMS` (blob `ecedd184`, sha256 `2e431ece65c3d404ffc79a54a5a02234a3d590c8189f71cb26e4b0f507f7cf8b`, 2 entries) covers the other two. It holds the shipped test `tests/tools/f2a2-land-on-map.test.ts` (sha256 `ca0a98d8288f376adb11f20568172d9afa48254e236f5082c559e4bb6c5474ba`, 29 lines, 1 title) and `plants-f2a2b.py` (blob `bc0696ab`, sha256 `ef88541101045b8e9adb4cc1bbf8c48655a7d5a7e83e227f3a9a8e75f5edcee0`, 48 lines, 27 plants). The kit is **r2**: one rework round after QA's r1 kit review (QK1, `docs/qa/step-f2a2-kit-review.md`, sha256 `851c88d6…`), which listed three must-fixes (Law 12, a lost travel error; a Rule 8 slip in the `stage:` block; the Effects "10 built-in" mock difference). QK2 (`docs/qa/step-f2a2b-r2-kit-review.md`) cleared all three (the third by listing it as Open point 9 for UX). Box only, never pushed: the go-line paste `/workspace/share/f2a2b/step-f2a2b-paste-final.md` (sha256 `25f0c334a3c82b1f4e489a79b8d78dd7a5ca28529736950bebbf13ac098de565`, 12 lines; L1 is exactly `export GH_BUILDER_TOKEN=<PASTE TOKEN HERE>`, L2 the helper-agents line; the original 11-line paste `/workspace/share/f2a2/step-f2a2b-paste.md` is sha256 `c2ccfa257a3182e6070ee1739b2bef985c5996bc877f27f9e4ffd87086986baf`); the trial `f2a2b-trial.patch` (sha256 `1c165c9a401d725ef7940502f888a72065233d067dd7134957c6d2547705a8c1`; `git am` on the F2a2a trial tree gives `3e180ff3`; `git am` on the go-line base `fd87b913` gives tree `332189a0`). `SPLIT.md` is also box only, at `/workspace/share/f2a2/SPLIT.md` (see (d)): the plan was not edited in this kit push.

This is **F2a2b**, the second half of plan L71's F2a2 after an EA split (2026-11-28 01:37 London). Plan L71 on the merge is still the unsplit F2a2 row ("Land on the map", 340–390 plus about 10); UX has not updated the plan. The CEO 03:53 order line is unchanged at L86. L87 is the earlier 27 Nov F2a → F2a1 + F2a2 proposal note, not this F2a2a / F2a2b split. F2a2 as one step was 485 counted lines, which breaks the 400 cap, so EA ran it as F2a2a then F2a2b (`SPLIT.md`). F2a2a shipped the six icons, the sheet CSS and `tools/maker/game-menu.ts` with no caller except the shipped test ([`docs/rebuild/step-f2a2a.md`](step-f2a2a.md)). This step wires that module in, lands opening a game on the stage editor, deletes `tools/maker/project.ts`, moves Budgets (with F2a1's icon) and Build game into ☰, and rebases 4 tests and 21 smokes. The tool bar's icons stay with F4. F1 kit plants **P20 and P24 stay dead** (guide L19). Nothing changes in saved data, the format, play, export or `map.tile`. With this merge the F2a2 split is complete as built; the plan row is not yet updated.

Sources: PR #118 (one branch, one builder round; https://github.com/G-TileEngine/tileengine/pull/118).
- Branch: `step/step-f2a2b-land-on-map-r1-chatA` (code head `a22f0f60`, tip `2b996ad0`; no force-push).
- Hand-back, on the merge: `handback/step-f2a2b-land-on-map/r1/HANDBACK.md` (HB1, blob `accb5ce7`, 158 lines, sha256 `31f62984856cc1cf7e82fdb3f80c45e2ac3feee07b3c3d32d49f3dfd107ad4af`). The same folder also has `changed-files.txt`, `checks-output.txt`, `stat.txt`, `test-output.txt`, `typecheck-output.txt`, and the Look shots `menu-390.png`, `menu-360.png`, `switch-390.png`, `switch-360.png`.
- CoS verify (box): `/workspace/share/step-f2a2b-verify/pr-body.md` (V1, sha256 `3fbc6d37d48efe772d9ec39b2eb45bec15bc0527f8c89ba74376b9b14ff15d20`): READY FOR PR, with two flags (the four trailing spaces; the openId L117 Rule 8 note). CoS did not re-run the 25 smokes.
- QA docs:
  - Kit r1, pushed with the F2a2a kit in `fa401c88`: `docs/qa/step-f2a2-kit-review.md` (QK1, blob `5ee362be`, 23 lines, sha256 `851c88d65385064cf55480a4f3ff82d5a9e0f18d03fdc91b467448bc66ec66f3`). **F2a2b r1: must-fixes (3)** (QK1 L12–L16). Not a builder verdict; the kit was reworked as r2 before the go.
  - Kit r2, pushed with the kit in `fd87b913`: `docs/qa/step-f2a2b-r2-kit-review.md` (QK2, blob `d8c32cd5`, 33 lines, sha256 `330e8f45c66ee985ad1293ca7fc8d419fb278a8e7618364af0a6f2da0d36cc24`): **OK TO SEND**. All three r1 must-fixes CLEARED (QK2 L17–L20). Non-blockers in L22–L30 (see carries).
  - `docs/qa/step-f2a2b-build.md` on `11e95c1e` (QA1, blob `e5f49382`, 30 lines, sha256 `a44aed61cd177a22748af65f9f2cd9eb0e05c48bd466e1a34a1f084a3a7a08de`): **OK TO MERGE**, expected tree `dd5b1b85`, floor 1204, no pin. Smokes re-run here, 25/25 PASS (QA1 L18). Two CoS flags accepted (QA1 L21–L23; see (d)).

Line cites use HB1, V1, QK1, QK2 and QA1. Product line cites are at merge `79fb46f6` (tree `dd5b1b85`) unless said otherwise. After-merge docs (QA1) are cited at `11e95c1e`. Guide file-edit line numbers that name `ce848f57` or the F2a2a trial (L50, L37's `openId` L56) are base numbers; the merge numbers are given in (c).

## (a) Start and finish

| | Value |
|---|---|
| Kit | `fd87b91301f2b0eb6e890126d155ffa7919ad7bc`, 03:03 (UK time, 28 Nov), tree `2dd2ec3c`, on `1a6d16a4` (the F2a2a merge): the r2 guide, the 3-file kit folder, QK2, and QA's F2a2a build doc. No plan edit. QK2 **OK TO SEND**. Test-neutral: `npm test` collects `tests/**/*.test.ts` only; the kit folder is not collected. Floor on this tree **1203** |
| Base | The same commit `fd87b913`. The guide names the F2a2a merge as Base (L5) and does not hard-code a sha; CoS filled `1a6d16a4` in an earlier paste and then told the builder to branch from `fd87b913` (docs and handoff only on the merge). HB1 L150 records the move. Floor **1203** tests, 1203 + 1 = **1204** after this step. Main then moved again, by the F2a2a record `44fb5842` (docs only, 03:16), before the merge |
| r1 commits | `a22f0f606f03a8158b1996696ce8ab3339ef4ba1` feat(maker): step F2a2b land on the map (r1 code head, tree `15d31343981a7d8571ec0576130270cd2e50080c`, 2026-11-28 03:33 UK time), then `2b996ad0eaeb09a9bf1d5ef9571fa441f5fb2879` docs(handback): step F2a2b land on the map r1 (tree `5dd454ba2c37148a77d1945d6c8c5f450ad23d44`, 03:34; 10 files under `handback/step-f2a2b-land-on-map/r1/`, including 4 Look shots). Linear on the base, noreply author and committer |
| r1 verdict | Green **1204/0**; tools tsc only the 3 base errors (page.ts L101; home.ts L156 ×2); plants 27/27, tree clean after; 32 files, **397 / 397**, every file on its trial cap; shipped test sha256 `ca0a98d8…` byte-identical to the kit; kit `sha256sum -c` passes (HB1, V1, QK2, QA1). HANDBACK reports all 25 smokes PASS solo at 390 and 360, first pass (s11b on 8820); CoS did not re-run them. QA1 re-ran them, 25/25 PASS (QA1 L18). Look shots in the hand-back; differences from f02/f03 are the listed Open points (QA1 L19, HB1 § Look). CoS V1: READY FOR PR, two flags (see (d)). PR #118 opened 03:56 UK time. QA1 **OK TO MERGE**, expected tree `dd5b1b85`, floor 1204, no pin; both flags accepted |
| Merge | PR #118 (opened 03:56, merged 04:04), merge commit `79fb46f66054b6a16abcf8e97425ea3bd5d5526e`, 2026-11-28 04:04 (UK time). Tree `dd5b1b8557423f347850e61204ce38be11511500` (the tree CoS and QA expected). First parent `44fb584235a05e4ac4a70ddc75d29cdb23b658b7`, second parent `2b996ad0eaeb09a9bf1d5ef9571fa441f5fb2879`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #118: Step F2a2b: land on the map (game menu wired, project page removed)`. `merge-pr.sh --expect-tree dd5b1b85`: npm test on the merge **1204 pass / 0 fail** |
| After the merge | `11e95c1e621e8d43c84eb101e5cfca663b44f541` (04:04, tree `02c117fe`) adds only `docs/qa/step-f2a2b-build.md` (QA1) |
| Postmerge | CoS did not run `qa-postmerge.sh` when this record was written. QA's merge review is QA1; a separate postmerge result is not in the repo |
| Tests | 1203 + N=1 (the one shipped test in `tests/tools/f2a2-land-on-map.test.ts`) = **1204 pass / 0 fail**. The floor after this merge is **1204** |

## (b) Files

From `git diff --name-status fd87b913..79fb46f6 -- . ':!handback/**' ':!docs/**'`, which is the same product set as against the merge's first parent `44fb5842`. Line counts are `git diff --numstat` against first parent `44fb5842` (and against the go-line base `fd87b913`; both give 261 / 136). Caps are the guide's Caps table (L419–L451), equal to the trial counts.

| File | Status | ins / del | cap | Counted? |
|---|---|---|---|---|
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | M | 9 / 9 | 18 | yes. **18**, on cap |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | M | 4 / 4 | 8 | yes. **8**, on cap |
| `handoff/steps/tests/s11a-export-mvp/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s11b-debug-apk/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | M | 5 / 5 | 10 | yes. **10**, on cap |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | M | 6 / 6 | 12 | yes. **12**, on cap |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | M | 2 / 2 | 4 | yes. **4**, on cap |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | M | 7 / 7 | 14 | yes. **14**, on cap |
| `handoff/steps/tests/s5a-units/smoke.mjs` | M | 5 / 5 | 10 | yes. **10**, on cap |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | M | 5 / 5 | 10 | yes. **10**, on cap |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | M | 5 / 5 | 10 | yes. **10**, on cap |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | M | 4 / 4 | 8 | yes. **8**, on cap |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | M | 6 / 7 | 13 | yes. **13**, on cap |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | M | 4 / 4 | 8 | yes. **8**, on cap |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | M | 5 / 5 | 10 | yes. **10**, on cap |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | M | 4 / 4 | 8 | yes. **8**, on cap |
| `tests/editor/project-home.test.ts` | M | 2 / 2 | 4 | yes. **4**, on cap |
| `tests/tools/export-11a.test.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tests/tools/f1-look-kit.test.ts` | M | 5 / 7 | 12 | yes. **12**, on cap |
| `tests/tools/f2a2-land-on-map.test.ts` | A | 29 / 0 | 29 | yes. **29**, on cap (sha256 `ca0a98d8288f376adb11f20568172d9afa48254e236f5082c559e4bb6c5474ba`) |
| `tests/tools/play-stage-source.test.ts` | M | 3 / 3 | 6 | yes. **6**, on cap |
| `tools/maker/effects.ts` | M | 7 / 0 | 7 | yes. **7**, on cap |
| `tools/maker/home.ts` | M | 127 / 31 | 158 | yes. **158**, on cap |
| `tools/maker/project.ts` | D | 0 / 11 | 11 | yes. **11**, on cap |
| `tools/maker/stage.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/test-launch.ts` | M | 1 / 1 | 2 | yes. **2**, on cap |
| `tools/maker/units.ts` | M | 7 / 0 | 7 | yes. **7**, on cap |
| **Total** | 32 files | 261 / 136 | 397 | **397** |

What the merge does not touch:
- Nothing under `src/**`, `tools/play-stage`, `tools/export`, `tools/apk`, `tools/art-bake`, `tools/maker/game-menu.ts`, `tools/maker/icons.ts`, `tools/maker/app.css`, `data/`, `fixtures/`, the root `package.json` or `package-lock.json`, `docs/maker/**`, `ui-shell`, or the F1, ART1a, F2a1, F2a2a or F2a2b kit folders (V1, QK2, QA1). `painter-proto`, named in the guide's Must NOT (L468), does not exist in the repo.
- No new dependency, no committed PNG in the product tree (the Look shots live only under `handback/`), no saved-data or format change, no `map.tile` or tile-size setting change, no other eyebrow or header change, no tool-bar icons (F4), no "last stage" memory (F2b).
- No existing test or smoke changed except the four rebased tests (guide L311) and the 21 smoke files in the Caps table. s0, s6d, s8c and s9c are untouched (guide L328). F2a1's and F2a2a's shipped tests are unchanged (guide L410–L412).

The official count at the code head against the go-line base `fd87b913`, or at the merge against first parent `44fb5842`, is **32 files changed, 261 insertions(+), 136 deletions(-)** = **397**, under the hard gate of 400. Every file is on its trial cap (HB1 § Size, V1, QA1).

## (c) Key code and git commands

**Ruling 4, Budgets and Build mounted as they are.** `menuSheet` (`tools/maker/home.ts` L60–L70) passes `budgetsRow(state.files)` and `buildButton(building)` into `gameMenu` (L64) between Levels & XP and Save. The rows are restyled flat by F2a2a's CSS. No chevron is added (open point 1, L471); the Budgets summary still reads "Budgets: all good" on a fresh demo.

**Ruling 6, Landing.** New `landOn` (L72–L85) picks `stage ?? the first of stageRows(files)`, binds it, closes the menu and sets the screen to `"stage"`. If there are no stages it sets `"missing"` and the banner "This game has no stages, so it can't open." (L75–L78; plant P24). `openId` at L117 calls `if (!landOn(id, text, null)) return;` in place of `state.screen = "project";` (QA1 L23: one for one, no statement added; pinned in the shipped test at L21). `fromUrl` also lands through `landOn` (L167).

**Ruling 7, Leaving and saving.** ☰ → My games runs `leaveGame()` (L86–L97). Opening a ☰ row other than Units, Effects or Levels saves the stage first (`menuAct`, L98–L111). `saveNow` (L112–L115) is the Save row.

**Ruling 8, Back from Test.** `tools/maker/test-launch.ts` L21: `backScreen` maps `"home"` and `"trash"` to themselves and everything else to `"stage"` (`"project"` no longer exists). The stage error state's Back (`stage.ts` L142) is still `s:back` with F2a1's icon, untouched (guide L52).

**Ruling 9, Paint.** The stage branch draws the stage, then the menu sheet (only when no build sheet and no unit page is open), then the child sheets. The stage bar (`stage.ts` L150) is now a ☰ icon button (`data-act="m:menu"`) and a switch button with the down icon (`data-act="m:switch"`).

**Ruling 10, r2 Law 12 (QK1 must-fix 1, QK2 L18 CLEARED).** `enterPlay`'s `travel` at L127: when a link arrival fails, `state.banner = got.error` (was `state.problems = [got.error]`). After this step nothing renders `state.problems`, and `backScreen` always returns `"stage"` on that path, so the old assignment dropped the error. Pinned in the shipped test at L25; plant P23.

**Ruling 11, r2 Rule 8 (QK1 must-fix 2, QK2 L19 CLEARED).** The `stage:` handler is a braced block, one statement per line, with `menuSet("none")` on its own line (L228).

**Ruling 12, r2 ☰ counts (QK2 L23 Fixed).** `unitCount` (`tools/maker/units.ts` L91–L97) and `effectCount` (`tools/maker/effects.ts` L30–L35) use the same `shown` / `effectRows` lists the sheets draw (plant P27). `menuSheet` L64 passes those counts into `gameMenu`. If `bagOf` is null they return 0 (see carries).

**Ruling 13, r2 Continue (QK2 L24 Fixed).** `beginTest` (L135–L139) calls `menuSet("none")` only when `menuView() === "menu"` (plant P26).

`tools/maker/project.ts` is deleted (`git rm`; 11 lines; guide L56). The shipped test pins that the file is gone (test L16).

**Shipped test:** the one title in `tests/tools/f2a2-land-on-map.test.ts` (29/29, verbatim, sha256 `ca0a98d8…`): the stage bar opens ☰ and the switcher, the project page is gone, Back returns to the stage; also pins `landOn` in `openId`, the no-stages banner, and the travel `state.banner = got.error` write.

```
# Full product diff against the merge's first parent (product-identical to the go-line base):
#
#   git diff 44fb5842 79fb46f6 -- . ':!handback/**' ':!docs/**'
#   (the 32 files in (b); same as git diff fd87b913 79fb46f6 -- . ':!handback/**' ':!docs/**')
#
# The hand-back (not in the 397):
#   git show 79fb46f6:handback/step-f2a2b-land-on-map/r1/HANDBACK.md
#
# Product gate. Official command at the code head against the go-line base, or at
# the merge against first parent 44fb5842:
#
#   git diff --shortstat fd87b913..HEAD -- . ':!handback/**' ':!package-lock.json'
#   32 files changed, 261 insertions(+), 136 deletions(-)
#
# Named tests (npm test 1204/0, floor 1203 + N=1): the one "F2a2 land on the map …"
# title of tests/tools/f2a2-land-on-map.test.ts.
#
# tools tsc (npx tsc --noEmit -p tools/tsconfig.json): only effect-designer
# page.ts L101 (TS18047) and maker home.ts L156 (×2, TS7053; L93 before this
# step, moved by the added lines, guide L460).
#
# Plants: handoff/steps/tests/step-f2a2b-land-on-map/plants-f2a2b.py (ef885411),
# 27/27 caught at the code head (HB1, V1, QK2, QA1), tree clean after.
# P1–P16 are F2a2a's and still run; P17–P27 are this slice, of which P23–P27
# were added in r2 (guide L456).
#
# Smokes: 21 files edited, s0/s6d/s8c/s9c unchanged. All 25 solo at 390 and 360,
# required (guide L462). HANDBACK reports first-pass PASS, ok counts matching
# the guide, s11b on 8820. CoS did not re-run them at verify. QA1 re-ran them,
# 25/25 PASS (QA1 L18). Export audit not required (no play, export or build file).
```

## (d) What went wrong, in order, and the fix

1. **No builder must-fix.** One builder round, no rework. QK2 **OK TO SEND**; QA1 **OK TO MERGE**.

2. **The kit itself was r2.** QK1 (L12–L16) was not OK TO SEND for F2a2b r1: (1) Law 12, a lost travel error; (2) a Rule 8 slip (`menuSet("none")` added inside the dense `stage:` line); (3) the Effects meta "10 built-in" vs the count, not then listed under Open points. EA and CoS reworked the kit. QK2 cleared (1) and (2) in the code (L18–L19) and cleared (3) by listing it as Open point 9 for UX (L20; guide L479). The builder ran against that r2 kit.

3. **The go-line base moved, then main moved again.** The guide names the F2a2a merge as Base (L5). CoS pushed the r2 kit (and QA's F2a2a build doc) to `fd87b913` (docs and handoff only on `1a6d16a4`) and told the builder to branch from `fd87b913` (HB1 L150). The F2a2a rebuild record then landed at `44fb5842` (docs only) before the merge, so the merge's first parent is `44fb5842`, not `fd87b913`. Product trees and counted lines are the same against both. No product difference.

4. **The code-head tree is not the EA trial tree on this base (CoS flag 1; QA1 L22 ACCEPTED, not a rework).** `git am` of `f2a2b-trial.patch` on `fd87b913` gives tree `332189a0`. The code head is `15d31343`. The only differences are four smoke lines, each one trailing space: `s4b-stage-place/smoke.mjs` L27, `s5b-abilities/smoke.mjs` L27, `s5c-add-ability/smoke.mjs` L28 and `s6a-win-rules/smoke.mjs` L28 end with `await press(page, "Create"); ` (a trailing space). The guide's Smoke lines for those four files (L360, L373, L378, L379) say to replace `await press(page, "Demo stage");` with nothing, which leaves the space before that phrase; the trial trimmed it. `git diff -w` is empty; counts and behaviour are unchanged; `git diff --check` flags the four lines. Product (tools, tests, src) is byte-identical to QA's r2 kit trial tree `3e180ff3` (QA1 L12–L13). Carry: strip the spaces in the next touch of those smokes, and the guide generator should trim (QA1 L22).

5. **openId L117 Rule 8 note (CoS flag 2; QA1 L23 OK under Rule 8).** `if (!landOn(id, text, null)) return;` sits inside the existing dense `openId` line. It replaces `state.screen = "project";` one for one, so no statement is added. It is in the guide's fence, matches the trial, and is pinned in the shipped test (L21).

6. **Plan L71 is still the unsplit F2a2 row.** UX has not updated the plan. The F2a2a / F2a2b split is the EA ruling of 01:37 London, recorded in box-only `SPLIT.md`. Do not treat L87 as this split.

## (e) Do it right first time

- Cite line numbers at the merge named in the record. Guide file-edit lines that name an older tree (`openId` L56, `stage.ts` L150 on `ce848f57`) are base numbers; give the merge numbers next to them (`openId` L117, `stage.ts` L150 is still L150 on this merge; `home.ts` tsc errors move from L93 to L156).
- When a kit is reworked before the go, record the r1 must-fixes and the r2 clearances in the kit history, and say the builder ran one clean round against r2.
- A "replace with nothing" smoke edit can leave a trailing space. The generator should trim; `git diff --check` should be part of the hand-back scan.
- Editing a dense line is allowed only when it adds no statement (QA1 L23; QK2 L32). Putting a new call on its own line, and reformatting the block, is the Rule 8 fix (Ruling 11).
- When main moves by docs-only commits after the go-line base, name the go-line base, the merge's first parent, and both trial trees if they differ only by docs/handoff — or, as here, if the product matches the trial except for an accepted whitespace carry.
- A plan row that has been split still reads as the old step until UX edits it. The F2a2 split is complete as built; L71 is not yet an F2a2a / F2a2b pair.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only QA1 at 11e95c1e):
#   git diff 79fb46f6 HEAD -- <the 32 files in (b)>
#   (empty)
#
# Product gate at the merge against first parent 44fb5842 (same as against fd87b913):
#   git diff --shortstat 44fb5842..79fb46f6 -- . ':!handback/**' ':!package-lock.json' ':!docs/**'
#   32 files changed, 261 insertions(+), 136 deletions(-)
#
# Green: npm ci && npm run green → 1204 pass / 0 fail.
# tools tsc: only the 3 base errors (page.ts L101; home.ts L156 ×2).
# Kit: cd handoff/steps/tests/step-f2a2b-land-on-map && sha256sum -c SHA256SUMS → OK.
# Shipped test: sha256sum tests/tools/f2a2-land-on-map.test.ts → ca0a98d8….
# Plants: python3 handoff/steps/tests/step-f2a2b-land-on-map/plants-f2a2b.py → 27/27 caught, tree clean.
# Smokes: all 25 solo at 390 and 360; only the 21 listed files differ from the base.
# Must-NOT: game-menu.ts, icons.ts and app.css are unchanged; project.ts is absent.
```

## QA non-blockers carried forward

- **UX Open point 9, Effects meta "10 built-in" vs the count** (guide L479; QK2 L20 CLEARED as listed for UX; QA1 L29). The ☰ row shows `effectCount` / `effectRows`, which is 0 on a fresh demo. The menu still renders `String(host.effects)` in F2a2a's `game-menu.ts` L30, which this step must not edit. A later touch can change that phrase.
- **`state.problems` has no reader** (guide L20; QK2 L27; QA1 L26). After r2's travel fix the field is still written (`leaveGame` L93 still clears it; `out()` in `enterPlay` L126 still clears it) and nothing renders it. Remove it in a later step.
- **Show "–" not 0 if the menu opens on an unparsed project** (QK2 L30; QA1 L27). `unitCount` / `effectCount` return 0 when `bagOf` is null (units.ts L93–L94, effects.ts L32–L33). The sheets draw nothing then, and the parse error surfaces through the open path, but if the menu ever shows in that state the meta should be "–".
- **`sectionSheet` type** (carried from F2a2a; QK1 L10, QA1 L28): `sectionSheet(name: MenuView)` also accepts `"none"`, `"menu"` and `"switch"`. A narrower type in a later touch.
- **Four trailing spaces** (QA1 L22, L30): strip `s4b-stage-place/smoke.mjs` L27, `s5b-abilities/smoke.mjs` L27, `s5c-add-ability/smoke.mjs` L28 and `s6a-win-rules/smoke.mjs` L28 on the next touch of those smokes. The guide generator should trim a "replace with nothing" edit.
- **Open points 1–8** still listed for QA/UX (guide L471–L478), including Budgets wording "Budgets: all good" and no chevron on Budgets/Build (L471, Ruling 4), no map-size meta on the stage row (L473), landing on the first stage (L474, F2b adds the last stage edited), and the stage bar's second row until F4 (L477).
- **To F2b:** `+ Add ability`'s plus icon (UX 16:45; `docs/rebuild/step-f2a1.md`). Landing on the last stage edited (open point 4, L474).
- **To F3b:** pictures in thumbnails and chips; the terrain chip's swatch or picture (`docs/rebuild/step-f1.md`).
- **To F4:** the § 7 `.chips` wrap row; the tool-bar icons; the unit page's 72×72 thumb; the stage bar's second row (open point 7, L477).
- **To ART1b:** the manifest hash order; `rgb()` `#rrggbb` only; drop both `?? [0, 0, 0]` black fallbacks in `sprite.ts`. On main the lines are L59 and L75 (see `docs/rebuild/step-art1a.md` and `docs/rebuild/step-f2a1.md`).
- **F1 kit plants P20 and P24 stay dead** (guide L19). The F1 kit folder was not edited and stays as history.
- **Unchanged:** the F0c, 11a, 11a2, 11b and 11c1 carries stand (`docs/rebuild/step-f1.md`).
- **Closed here:** wiring `game-menu.ts` into the maker; landing on the first stage; deleting `tools/maker/project.ts`; moving Budgets and Build game into ☰; `backScreen` no longer names `"project"`; the travel error going to `state.banner`; `unitCount` / `effectCount`; the four rebased tests and 21 smoke edits; the F2a2 split as built (plan L71 not yet updated); the fifth F2a bullet in step-f1.md L212 as far as ☰, the switcher, close, chevrons, the picked check and the one eyebrow (the tool bar stays with F4).

## Blob check

Each file must have exactly this git blob id at `79fb46f6`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `handoff/steps/tests/s10b-effect-data/smoke.mjs` | `fc32cb54e90fc547164eb44e11e24c8566339ef7` | 47 |
| `handoff/steps/tests/s10c-effect-editor/smoke.mjs` | `03704c7764c0d8b508d581df2c5cca6c5bafafb5` | 56 |
| `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` | `439992dbf01a6fa44153335f09699f7b82ebb05c` | 68 |
| `handoff/steps/tests/s11a-export-mvp/smoke.mjs` | `bc0999ef4eb71fb526be96ff4ffa557dcd204438` | 58 |
| `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` | `621b3b6a7db2cf696f80b238baf79b1d69cb650c` | 59 |
| `handoff/steps/tests/s11b-debug-apk/smoke.mjs` | `7e5ec5664435468f5a8259d2d340ab73b7f9ebbf` | 52 |
| `handoff/steps/tests/s11c1-budgets/smoke.mjs` | `356c847744ccaafcc15a6290ac80d45211aec947` | 49 |
| `handoff/steps/tests/s3-test/touch-smoke.mjs` | `6795e193592293c367df85010276085ecd113641` | 129 |
| `handoff/steps/tests/s4a-stage-paint/smoke.mjs` | `703f5080c1474bf666b275470666daad47a86dca` | 48 |
| `handoff/steps/tests/s4b-stage-place/smoke.mjs` | `2de0b06a4553cb39d01ca91545e54cde4c6fd477` | 51 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | `9a87dd6b81560ec52c7729cfaa508608214570b8` | 75 |
| `handoff/steps/tests/s5a-units/smoke.mjs` | `bb95b241a0da0b6f57e2931ee61385bade5302ce` | 74 |
| `handoff/steps/tests/s5b-abilities/smoke.mjs` | `24e1aba72fdb5d699055133d02c84d9238d07099` | 84 |
| `handoff/steps/tests/s5c-add-ability/smoke.mjs` | `88613a6146d962470e4878935a2daea44db458b2` | 86 |
| `handoff/steps/tests/s6a-win-rules/smoke.mjs` | `587b47b418dd13342873613c14e835210f90ca8d` | 76 |
| `handoff/steps/tests/s6b-levels/smoke.mjs` | `6ac00fe994e0e85f2755f21f75a74c3381ce754c` | 93 |
| `handoff/steps/tests/s6c-checkpoint/smoke.mjs` | `3742254b784984cc1970df07e4db9cac2954fc8d` | 118 |
| `handoff/steps/tests/s7-stage-links/smoke.mjs` | `eee855b89843c87ea5fa64c0105daad5e34c7a0d` | 47 |
| `handoff/steps/tests/s8-autosave-links/smoke.mjs` | `4e8e6f2a128165eab2fb89f73c8bfe608500e0ad` | 44 |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | `66763b64f47256d748206f12fb71ff423b4a4dba` | 47 |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | `ad61358da51121b21303f4b08ff873d49b53d13d` | 67 |
| `tests/editor/project-home.test.ts` | `c0e70a40de2342b682ba8d984835596e98a03e63` | 46 |
| `tests/tools/export-11a.test.ts` | `1087e5e44a2e38fb3f3612d0604eed897b947490` | 130 |
| `tests/tools/f1-look-kit.test.ts` | `63cbb685be09bfd37d94a327f784955e27178751` | 147 |
| `tests/tools/f2a2-land-on-map.test.ts` | `c24ea90bbc4852d0ae78f99fce07f213ebc42e7c` | 29 |
| `tests/tools/play-stage-source.test.ts` | `f3f66ece7e5e93b78636fa8d1a740e111dca2294` | 93 |
| `tools/maker/effects.ts` | `f39f177d748a2a5730d9f37948e40f82e4756c0d` | 98 |
| `tools/maker/home.ts` | `77bc1ab15c559084ed1e49dbc2042e52e44b9ccc` | 324 |
| `tools/maker/project.ts` (deleted; blob at `44fb5842`) | `461d1bab8a0754946381e50447821c02dcd759cf` | 0 (was 11) |
| `tools/maker/stage.ts` | `a68ef4328d1239374ecbc8d84133c308ce1cf439` | 276 |
| `tools/maker/test-launch.ts` | `23dbbad1c7b2183c97ae9357f0ead1600ffcc50d` | 54 |
| `tools/maker/units.ts` | `673a1d54426f64bd2d47877248a2ca918636e523` | 191 |

## Appendix: full code as merged (step F2a2b, PR #118)

New files are `git show 79fb46f6:<path>` in full. Edited and deleted files are `git diff 44fb5842 79fb46f6 -- <path>`, which is the same product diff as against the go-line base `fd87b913`.

### `handoff/steps/tests/s10b-effect-data/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s10b-effect-data/smoke.mjs b/handoff/steps/tests/s10b-effect-data/smoke.mjs
index 8f6567d..fc32cb5 100644
--- a/handoff/steps/tests/s10b-effect-data/smoke.mjs
+++ b/handoff/steps/tests/s10b-effect-data/smoke.mjs
@@ -24,7 +24,7 @@ try {
     const setAnswer = (value) => page.evaluate(async (value) => { const id = JSON.parse(window.__read()["project.json"]).project.id, rel = "setups/setup_01JDAT00000000000000000005.json", root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const handle = await dir.getFileHandle(leaf), raw = JSON.parse(await (await handle.getFile()).text()); raw.answers.effect = { source: "user", value, rev: 1 }; const text = JSON.stringify(raw); const w = await handle.createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, value);
     const drop = () => page.evaluate(() => { delete window.__play; delete window.__docs; delete window.__fx; });
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await step("1 new", async () => { await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); });
+    await step("1 new", async () => { await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); });
     await step("2 saved", async () => {
       await put(`effects/${FRESH}.json`, doc(FRESH)); await put(`effects/${LEGACY}.json`, doc(LEGACY)); await put(`effects/.deleted/${GONE}.json`, doc(GONE)); await put("effects/talk.json", JSON.stringify({ kind: "behaviour-setup", formatVersion: 3, id: "setup_01JDB10B00000000000000000C", rev: 1, behaviourId: "talk", catalogue: { rev: 30 } }));
       await setAnswer(FRESH); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs !== undefined && window.__fx !== undefined, null, { timeout: 15000 });
```

### `handoff/steps/tests/s10c-effect-editor/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s10c-effect-editor/smoke.mjs b/handoff/steps/tests/s10c-effect-editor/smoke.mjs
index 4f43452..03704c7 100644
--- a/handoff/steps/tests/s10c-effect-editor/smoke.mjs
+++ b/handoff/steps/tests/s10c-effect-editor/smoke.mjs
@@ -21,7 +21,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu"); await tap(page, "m:effects");
     let id = "";
     await step("1 empty", async () => { await page.waitForFunction(() => document.body.innerText.includes("Effects") && !document.body.innerText.includes("Not used yet") && document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 }); });
     await step("2 new shake", async () => {
@@ -31,23 +31,23 @@ try {
       if (!ID.test(id)) throw new Error(id || "no id");
     });
     await step("3 row and test", async () => {
-      await tap(page, "e:close"); await page.waitForFunction((archer) => document.querySelector('[data-sheet="effect"]') === null && document.querySelector(".scrim") === null && document.querySelector(`[data-act="u:open:${archer}"]`) !== null, ARCHER, { timeout: 15000 });
-      await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 });
+      await tap(page, "e:close"); await tap(page, "m:close"); await tap(page, "m:menu"); await tap(page, "m:units"); await page.waitForFunction((archer) => document.querySelector('[data-sheet="effect"]') === null && document.querySelector(`[data-act="u:open:${archer}"]`) !== null, ARCHER, { timeout: 15000 });
+      await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 });
       await tap(page, `a:open:${LINE}`);
-      await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:fx:none"]') !== null && document.querySelector('[data-act="a:shut"]') !== null, id, { timeout: 15000 });
-      await tap(page, `a:fx:${id}`); await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true" && document.querySelector(".scrim") === null, id, { timeout: 15000 });
+      await page.waitForFunction((id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:fx:none"]') !== null && document.querySelector('[data-act="a:shut"]') !== null, id, { timeout: 15000 });
+      await tap(page, `a:fx:${id}`); await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true" && document.querySelectorAll(".scrim").length < 2, id, { timeout: 15000 });
       await page.evaluate(() => new Promise((resolve) => { const root = document.querySelector("#app"), obs = new MutationObserver(() => { obs.disconnect(); resolve(true); }); if (root !== null) obs.observe(root, { childList: true }); const b = document.createElement("button"); b.setAttribute("data-act", "a:fx:effect_01JDB10C00000000000000000Y"); document.body.appendChild(b); b.dispatchEvent(new MouseEvent("click", { bubbles: true })); b.remove(); }));
-      await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector('[data-act="a:shut"]') !== null && document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", id, { timeout: 15000 });
-      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
+      await page.waitForFunction((id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector('[data-act="a:shut"]') !== null && document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", id, { timeout: 15000 });
+      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
       await tap(page, `a:test:${LINE}`);
       await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id && window.__fx?.values(id)?.values?.shake === 2, { id, archer: ARCHER }, { timeout: 15000 });
     });
     await step("4 dup delete undo", async () => {
       await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 });
       if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
-      await tap(page, `e:menu:${id}`); await tap(page, "e:dup"); await page.waitForFunction(() => document.body.innerText.includes("Effect 1 copy"), null, { timeout: 15000 }); await tap(page, "e:none");
+      await tap(page, "m:close"); await tap(page, "m:menu"); await tap(page, "m:effects"); await tap(page, `e:menu:${id}`); await tap(page, "e:dup"); await page.waitForFunction(() => document.body.innerText.includes("Effect 1 copy"), null, { timeout: 15000 }); await tap(page, "e:none");
       await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] === undefined && files[`effects/.deleted/${id}.json`] !== undefined && setup.answers.effect.value === "none"; }, id, { timeout: 15000 });
-      await tap(page, "undo"); await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] !== undefined && files[`effects/.deleted/${id}.json`] === undefined && setup.answers.effect.value === id && Object.values(files).some((text) => { try { return JSON.parse(text).name === "Effect 1 copy"; } catch { return false; } }); }, id, { timeout: 15000 });
+      await tap(page, "m:close"); await tap(page, "undo"); await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] !== undefined && files[`effects/.deleted/${id}.json`] === undefined && setup.answers.effect.value === id && Object.values(files).some((text) => { try { return JSON.parse(text).name === "Effect 1 copy"; } catch { return false; } }); }, id, { timeout: 15000 });
     });
     await ctx.close();
   };
```

### `handoff/steps/tests/s10d-builtin-effects/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s10d-builtin-effects/smoke.mjs b/handoff/steps/tests/s10d-builtin-effects/smoke.mjs
index b13d358..439992d 100644
--- a/handoff/steps/tests/s10d-builtin-effects/smoke.mjs
+++ b/handoff/steps/tests/s10d-builtin-effects/smoke.mjs
@@ -14,14 +14,14 @@ const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/
 const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", HOLY = "btf-holy-blade";
 const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
 const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
-const openLine = async (page) => { await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:shut"]') !== null, HOLY, { timeout: 15000 }); };
+const openLine = async (page) => { await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelectorAll(".scrim").length < 2 && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:shut"]') !== null, HOLY, { timeout: 15000 }); };
 try {
   const run = async (width) => {
     const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu"); await tap(page, "m:units");
     await step("1 builtins", async () => {
       await openLine(page);
       const got = await page.evaluate(() => ({ btf: document.querySelectorAll('[data-act^="a:fx:btf-"]').length, te: document.querySelector('[data-act^="a:fx:te-"]') !== null, head: document.body.innerText.includes("Built-in") }));
@@ -34,11 +34,11 @@ try {
       await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
       await tap(page, "u:back");
       await page.waitForFunction(() => document.querySelector('[data-act="undo"]') !== null, null, { timeout: 15000 });
-      await tap(page, "undo");
+      await tap(page, "m:close"); await tap(page, "undo");
       await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]), slice = JSON.parse(files["catalogue/slice.json"]); return setup.answers?.effect?.value !== id && !slice.behaviours.some((row) => row.id === "effect"); }, HOLY, { timeout: 15000 });
     });
     await step("3 test", async () => {
-      await openLine(page);
+      await tap(page, "m:menu"); await tap(page, "m:units"); await openLine(page);
       await tap(page, `a:fx:${HOLY}`);
       await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", HOLY, { timeout: 15000 });
       await tap(page, "a:shut");
```

### `handoff/steps/tests/s11a-export-mvp/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s11a-export-mvp/smoke.mjs b/handoff/steps/tests/s11a-export-mvp/smoke.mjs
index 36df817..bc0999e 100644
--- a/handoff/steps/tests/s11a-export-mvp/smoke.mjs
+++ b/handoff/steps/tests/s11a-export-mvp/smoke.mjs
@@ -22,7 +22,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu");
     let id = "", gp = null;
     await step("1 zip", async () => {
       await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
```

### `handoff/steps/tests/s11a2-ready-sheet/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s11a2-ready-sheet/smoke.mjs b/handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
index e684981..621b3b6 100644
--- a/handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
+++ b/handoff/steps/tests/s11a2-ready-sheet/smoke.mjs
@@ -22,7 +22,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu");
     let id = "";
     await step("1 ready", async () => {
       await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
```

### `handoff/steps/tests/s11b-debug-apk/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s11b-debug-apk/smoke.mjs b/handoff/steps/tests/s11b-debug-apk/smoke.mjs
index 633cb1f..7e5ec56 100644
--- a/handoff/steps/tests/s11b-debug-apk/smoke.mjs
+++ b/handoff/steps/tests/s11b-debug-apk/smoke.mjs
@@ -21,7 +21,7 @@ try {
     const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
-    await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu");
     let gp = null;
     await step("1 zip", async () => {
       await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
```

### `handoff/steps/tests/s11c1-budgets/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s11c1-budgets/smoke.mjs b/handoff/steps/tests/s11c1-budgets/smoke.mjs
index 9345030..356c847 100644
--- a/handoff/steps/tests/s11c1-budgets/smoke.mjs
+++ b/handoff/steps/tests/s11c1-budgets/smoke.mjs
@@ -23,7 +23,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`), scale: "css" }); };
-    await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu");
     await step("1 all good", async () => {
       await page.waitForFunction(() => document.querySelector('[data-act="budgets"]')?.textContent?.includes("Budgets: all good"), null, { timeout: 15000 });
       const pos = await page.evaluate(() => document.querySelector("[data-budgets]")?.nextElementSibling?.getAttribute("data-act") ?? ""); if (pos !== "build") throw new Error(pos || "no row"); await tap(page, "budgets");
@@ -36,11 +36,11 @@ try {
       await page.waitForFunction(() => { const u = document.querySelector('[data-budget="units"]')?.textContent ?? "", a = document.querySelector('[data-budget="activeAi"]')?.textContent ?? "", e = document.querySelector('[data-budget="effects"]')?.textContent ?? ""; return u.includes("7 of 9 · near limit") && a.includes("2 of 1 · over limit") && e.includes("0 of 12") && !e.includes("·") && document.querySelectorAll('meter[aria-hidden="true"]').length === 4; }, null, { timeout: 15000 }); await shot("02-budgets-expanded");
     });
     await step("3 gate", async () => {
-      await page.evaluate(() => { delete window.__play; }); await tap(page, "test");
-      await page.waitForFunction((line) => document.body.innerText.includes("Can't play yet") && document.body.innerText.includes(line) && window.__play === undefined, LINE, { timeout: 15000 }); const h = await page.evaluate(() => document.querySelector(".project .sheet")?.getBoundingClientRect().height ?? 0); if (!(h > 0)) throw new Error(`sheet ${h}`); await shot("03-gate-budget");
-      await tap(page, "fix"); await page.waitForFunction(() => !document.body.innerText.includes("Can't play yet"), null, { timeout: 15000 }); await tap(page, "build");
+      await page.evaluate(() => { delete window.__play; }); await tap(page, "m:close"); await tap(page, "s:test");
+      await page.waitForFunction((line) => (document.querySelector(".banner")?.textContent ?? "").includes(line) && window.__play === undefined, LINE, { timeout: 15000 }); await shot("03-gate-budget");
+      await tap(page, "dismiss"); await page.waitForFunction((line) => !document.body.innerText.includes(line), LINE, { timeout: 15000 }); await tap(page, "m:menu"); await tap(page, "build");
       await page.waitForFunction((line) => document.body.innerText.includes(line) && document.querySelector('[data-sheet="build"]') === null && document.querySelector('[data-act="build"]')?.getAttribute("aria-busy") !== "true", LINE, { timeout: 15000 });
-      await putBudgets(page, NEAR); await tap(page, "fix"); await page.evaluate(() => { delete window.__play; }); await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
+      await putBudgets(page, NEAR); await tap(page, "m:close"); await tap(page, "dismiss"); await page.evaluate(() => { delete window.__play; }); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
     });
     await ctx.close();
   };
```

### `handoff/steps/tests/s3-test/touch-smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s3-test/touch-smoke.mjs b/handoff/steps/tests/s3-test/touch-smoke.mjs
index eeb55b2..6795e19 100644
--- a/handoff/steps/tests/s3-test/touch-smoke.mjs
+++ b/handoff/steps/tests/s3-test/touch-smoke.mjs
@@ -28,7 +28,7 @@ try {
     page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
-    const testAt = await page.locator("[data-act=test]").boundingBox(); if (testAt === null) throw new Error("no test");
+    const testAt = await page.locator('[data-act="s:test"]').boundingBox(); if (testAt === null) throw new Error("no test");
     await press(page, "Test");
     await page.waitForFunction(() => location.search.includes("project=") && window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
     const opened = await page.evaluate(() => { const p = window.__docs.manifest.project, q = new URLSearchParams(location.search); return { id: p.id, name: p.name, query: q.get("project"), canopy: window.__docs.looks.canopy.length, braziers: window.__docs.looks.braziers.length }; });
@@ -106,19 +106,19 @@ try {
       const small = hud.filter((b) => b.w < 44 || b.h < 44); if (small.length > 0 || !hud.some((b) => b.id === "recentre") || errs.length > 0 || ext.length > 0) throw new Error(JSON.stringify({ small, recentre: hud.some((b) => b.id === "recentre"), errs, ext }));
     });
     await step("8 back to maker", 5000, async () => {
-      const live = await page.evaluate((b) => { const n = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return n instanceof Element && n.closest("[data-act=test]") !== null; }, testAt);
+      const live = await page.evaluate((b) => { const n = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return n instanceof Element && n.closest('[data-act="s:test"]') !== null; }, testAt);
       if (live) throw new Error("test still live");
       const back = await page.locator("#back-maker").boundingBox(); if (back === null || back.width < 48 || back.height < 48) throw new Error("no back");
       await page.touchscreen.tap(back.x + back.width / 2, back.y + back.height / 2);
-      await page.waitForFunction(() => document.querySelector("[data-act=test]") !== null && !location.search.includes("project="));
-      const name = await page.locator("h1").innerText(); if (name !== "My game") throw new Error(name);
+      await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null && !location.search.includes("project="));
+      const name = await page.locator("h1").innerText(); if (name !== "Demo stage") throw new Error(name);
     });
     await step("9 empty blocked", 15000, async () => {
-      await press(page, "Back"); await press(page, "New project");
+      await press(page, "Game menu"); await press(page, "My games"); await press(page, "New project");
       const empty = page.getByRole("button", { name: "Empty", exact: true }); await empty.waitFor({ timeout: 15000 }); const box = await empty.boundingBox(); if (box === null) throw new Error("empty");
       await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(80);
       await press(page, "Continue"); await press(page, "Create"); await press(page, "Test");
-      const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]") !== null }));
+      const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".banner")?.textContent ?? "", test: document.querySelector('[data-act="s:test"]') !== null }));
       if (got.app === "none" || got.board || !got.text.includes("Place a unit on this stage to test it") || !got.test) throw new Error(JSON.stringify(got));
     });
     await ctx.close();
```

### `handoff/steps/tests/s4a-stage-paint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4a-stage-paint/smoke.mjs b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
index d1602f9..703f508 100644
--- a/handoff/steps/tests/s4a-stage-paint/smoke.mjs
+++ b/handoff/steps/tests/s4a-stage-paint/smoke.mjs
@@ -21,7 +21,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await page.waitForSelector(".cell");
     await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
     await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
     await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
@@ -40,7 +40,7 @@ try {
       await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await settle(page, () => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); const all = await page.evaluate(() => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); if (!all) throw new Error("not floor");
       await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "water"); if (await tile(page, 0, 0) !== "water") throw new Error("undo lost water");
     });
-    await step("8 reload", async () => { await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await press(page, "Demo stage"); const a = await tile(page, 0, 0); if (a !== "water") throw new Error(String(a)); });
+    await step("8 reload", async () => { await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); const a = await tile(page, 0, 0); if (a !== "water") throw new Error(String(a)); });
     await ctx.close();
   };
   await run(390); await run(360);
```

### `handoff/steps/tests/s4b-stage-place/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4b-stage-place/smoke.mjs b/handoff/steps/tests/s4b-stage-place/smoke.mjs
index a001bdb..2de0b06 100644
--- a/handoff/steps/tests/s4b-stage-place/smoke.mjs
+++ b/handoff/steps/tests/s4b-stage-place/smoke.mjs
@@ -24,7 +24,7 @@ try {
     const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
     await step("1 add here", async () => { await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); const got = await page.evaluate(() => { const buttons = [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()); const choice = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent.trim()); const small = [...document.querySelectorAll(".sheet button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { buttons, choice, small: small.length }; }); if (got.choice.join("|") !== "Floor|Water|Wall block" || !got.buttons.includes("Your team start") || !got.buttons.includes("NPC") || !got.buttons.includes("Enemy") || got.small !== 0) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
     await step("2 what", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:place:npc"); await tap(page, "s:unit:unit_01JDAN00000000000000000003"); await waitLabel(page, 2, 8, "NPC", true); const rows = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()).filter((t) => t !== "Close")); if (rows.join("|") !== "Just stand here|Talk" || rows.some((t) => /Hostile|Wander|Seller|Quest/.test(t))) throw new Error(rows.join("|")); });
     await step("3 talk", async () => { await tap(page, "s:talk-open"); const input = page.locator("[data-talk]"); await input.fill("x".repeat(max + 3)); const n = await input.evaluate((el) => [...el.value].length); if (n !== max) throw new Error(`len ${n}`); await input.fill("Smoke hello"); await tap(page, "s:talk-save"); await page.waitForFunction(() => { const n = document.querySelector('[data-act="s:cell:2,8"]'); return ((n && n.getAttribute("aria-label")) || "").includes("NPC") && document.querySelector("[data-talk]") === null; }, null, { timeout: 15000 }); const who = await label(page, 2, 8); if (!String(who).includes("NPC")) throw new Error(String(who)); });
```

### `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4c-stages-maps/smoke.mjs b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
index 86a1c23..9a87dd6 100644
--- a/handoff/steps/tests/s4c-stages-maps/smoke.mjs
+++ b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
@@ -28,7 +28,7 @@ try {
     const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     const nudge = async (axis, from, to) => { const dir = to < from ? -1 : 1, label = axis === "c" ? "Columns" : "Rows"; for (let n = from; n !== to; n += dir) { await tap(page, `r:step:${axis}:${dir}`); await waitText(page, `${label} ${n + dir}`); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Demo stage"); await tap(page, "m:switch");
     await step("1 add", async () => {
       await shot("01-project"); await open("r:add", "r:new"); await shot("02-add"); await tap(page, "r:new");
       await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1 && new URLSearchParams(location.search).get("stage") !== null, null, { timeout: 15000 });
@@ -36,17 +36,17 @@ try {
       const text = await page.evaluate(() => document.body.innerText); if (!text.includes("Stage 2") || id === "") throw new Error(text);
     });
     await step("2 rename", async () => {
-      await tap(page, "s:back"); await waitText(page, "Maps"); await open(`r:menu:stage:${id}`, "r:rename"); await open("r:rename", "r:save-name"); await shot("03-rename");
+      await tap(page, "m:switch"); await waitText(page, "Maps"); await open(`r:menu:stage:${id}`, "r:rename"); await open("r:rename", "r:save-name"); await shot("03-rename");
       await page.locator("[data-room]").fill("Upstairs"); await tap(page, "r:save-name");
       await page.waitForFunction((id) => document.body.innerText.includes("Upstairs") && new URLSearchParams(location.search).get("stage") === id, id, { timeout: 15000 });
     });
     await step("3 resize", async () => {
       await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await waitText(page, "Columns 6"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
-      await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await press(page, "Demo stage");
-      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
+      await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await tap(page, `stage:${DEMO}`);
+      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "m:switch"); await waitText(page, "Maps");
       await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
-      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await press(page, "Demo stage");
-      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
+      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await tap(page, `stage:${DEMO}`);
+      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "m:switch"); await waitText(page, "Maps");
     });
     await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
     await step("5 test", async () => {
@@ -58,7 +58,7 @@ try {
       await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 });
     });
     await step("6 undo", async () => {
-      await tap(page, "s:back"); await waitText(page, "Upstairs"); await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
+      await tap(page, "m:switch"); await waitText(page, "Upstairs"); await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
       await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
       await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) !== null, id, { timeout: 15000 });
     });
```

### `handoff/steps/tests/s5a-units/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s5a-units/smoke.mjs b/handoff/steps/tests/s5a-units/smoke.mjs
index 1471d48..bb95b24 100644
--- a/handoff/steps/tests/s5a-units/smoke.mjs
+++ b/handoff/steps/tests/s5a-units/smoke.mjs
@@ -27,7 +27,7 @@ try {
     const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     const setHp = async (n) => { await page.locator('[data-knob="unit_hp"]').evaluate((el, n) => { el.value = String(n); el.dispatchEvent(new Event("input", { bubbles: true })); }, n); await page.waitForFunction((n) => document.querySelector('[data-val="unit_hp"]')?.textContent === String(n), n, { timeout: 15000 }); };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Units");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu"); await tap(page, "m:units"); await waitText(page, "Units");
     await step("1 units", async () => {
       await page.evaluate(() => { const h = [...document.querySelectorAll("h2")].find((n) => n.textContent === "Units"); h?.scrollIntoView({ block: "start" }); });
       const text = await page.evaluate(() => document.body.innerText); if (NAMES.some((name) => !text.includes(name)) || !text.includes("Add unit")) throw new Error(text);
@@ -36,13 +36,13 @@ try {
     await step("2 add", async () => {
       await open("u:add", "u:create"); await page.locator("[data-unit]").waitFor({ timeout: 15000 }); await shot("02-name");
       await page.locator("[data-unit]").fill("Scout"); await tap(page, "u:create");
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Start from a role"), null, { timeout: 15000 });
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout") && document.body.innerText.includes("Start from a role"), null, { timeout: 15000 });
       await shot("03-editor"); sheetTiny.push(...await big());
       await tap(page, "u:back"); await waitText(page, "Add unit");
       scout = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((act) => act.startsWith("u:open:") && (document.querySelector(`[data-act="${act}"]`)?.textContent ?? "").includes("Scout")) ?? "");
       if (!scout.startsWith("u:open:unit_")) throw new Error(scout || "no scout");
       await tap(page, scout);
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout", null, { timeout: 15000 });
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout"), null, { timeout: 15000 });
     });
     await step("3 role", async () => {
       await open("u:role", "u:apply:btf-warrior"); await waitText(page, "Warrior (BTF)"); await shot("04-roles");
@@ -63,8 +63,8 @@ try {
       await open(`u:menu:${KNIGHT}`, "u:delete"); await tap(page, "u:delete"); await waitText(page, "Used in your team list. Remove it there first."); await tap(page, "u:close");
     });
     await step("7 reload", async () => {
-      await page.reload({ waitUntil: "load" }); await waitText(page, "My game"); await press(page, "My game"); await waitText(page, "Units"); await tap(page, scout);
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Same as army") && document.querySelector('[data-val="unit_hp"]')?.textContent === "9", null, { timeout: 15000 });
+      await page.reload({ waitUntil: "load" }); await waitText(page, "My game"); await press(page, "My game"); await tap(page, "m:menu"); await tap(page, "m:units"); await waitText(page, "Units"); await tap(page, scout);
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Scout") && document.body.innerText.includes("Same as army") && document.querySelector('[data-val="unit_hp"]')?.textContent === "9", null, { timeout: 15000 });
     });
     check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
     await ctx.close();
```

### `handoff/steps/tests/s5b-abilities/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s5b-abilities/smoke.mjs b/handoff/steps/tests/s5b-abilities/smoke.mjs
index 792db34..24e1aba 100644
--- a/handoff/steps/tests/s5b-abilities/smoke.mjs
+++ b/handoff/steps/tests/s5b-abilities/smoke.mjs
@@ -24,7 +24,7 @@ try {
     const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
     await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
     await step("1 sheet", async () => {
       await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Archer · Your team", null, { timeout: 15000 });
@@ -65,14 +65,14 @@ try {
       await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector('[data-act="s:edit"]') !== null, null, { timeout: 15000 });
       await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="a:test"]') !== null, null, { timeout: 15000 });
       await tap(page, "a:test"); await page.waitForFunction((id) => { const play = window.__play, unit = play?.world.units.get(play.selected); return unit?.unitId === id && unit.side === play.sides.me; }, ARCHER, { timeout: 15000 });
-      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
+      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="m:menu"]') !== null, null, { timeout: 15000 });
     });
     await step("7 nowhere", async () => {
       if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
-      await page.waitForFunction(() => document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
-      await tap(page, "s:back"); await waitText(page, "Add unit"); await tap(page, "u:add");
+      await page.waitForFunction(() => document.querySelector('[data-act="m:menu"]') !== null, null, { timeout: 15000 });
+      await tap(page, "m:menu"); await tap(page, "m:units"); await waitText(page, "Add unit"); await tap(page, "u:add");
       await page.waitForFunction(() => document.querySelector("[data-unit]") !== null, null, { timeout: 15000 }); await page.locator("[data-unit]").fill("Spare"); await tap(page, "u:create");
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Spare" && document.body.innerText.includes("Place this unit on a stage to test it."), null, { timeout: 15000 });
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Spare") && document.body.innerText.includes("Place this unit on a stage to test it."), null, { timeout: 15000 });
       const shown = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].some((el) => { const act = el.getAttribute("data-act") ?? ""; return act === "a:test" || act.startsWith("a:test:") || act === "s:try"; }));
       if (shown) throw new Error("test shown");
     });
```

### `handoff/steps/tests/s5c-add-ability/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s5c-add-ability/smoke.mjs b/handoff/steps/tests/s5c-add-ability/smoke.mjs
index 89c91f0..88613a6 100644
--- a/handoff/steps/tests/s5c-add-ability/smoke.mjs
+++ b/handoff/steps/tests/s5c-add-ability/smoke.mjs
@@ -25,7 +25,7 @@ try {
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
     const lineAct = () => page.evaluate(() => [...document.querySelectorAll("[data-add]")].find((el) => (el.getAttribute("data-add") ?? "").includes("Line Shot"))?.getAttribute("data-act") ?? "");
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
     await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
     await tap(page, "s:cell:0,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Knight · Your team", null, { timeout: 15000 });
     await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="g:open"]') !== null, null, { timeout: 15000 });
```

### `handoff/steps/tests/s6a-win-rules/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6a-win-rules/smoke.mjs b/handoff/steps/tests/s6a-win-rules/smoke.mjs
index 70b1773..587b47b 100644
--- a/handoff/steps/tests/s6a-win-rules/smoke.mjs
+++ b/handoff/steps/tests/s6a-win-rules/smoke.mjs
@@ -25,7 +25,7 @@ try {
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
     const wiped = () => page.evaluate(() => window.__docs?.win?.wipe);
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
     await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
     await step("1 rules on", async () => {
       await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("Default rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On", null, { timeout: 15000 });
@@ -34,7 +34,7 @@ try {
     await step("2 rules off", async () => {
       await tap(page, "k:toggle:wipe_wins"); await waitText(page, "With this off, nobody wins: Test plays until you leave."); await shot("02-rules-off"); tiny.push(...await big());
       if (width === 360) { await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover("[data-sheet=rules] .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
-      await tap(page, "r:close"); await tap(page, "s:back"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
+      await tap(page, "r:close"); await tap(page, "m:switch"); await tap(page, "stage:stage_01JDAS00000000000000000001"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
       await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("This stage's rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 });
     });
     await step("3 test off", async () => {
@@ -55,15 +55,15 @@ try {
       tiny.push(...await big()); if (width === 360) { await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover(".scrim .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
     });
     await step("5 empty hero", async () => {
-      await tap(page, "u:back"); await tap(page, "s:back"); await press(page, "Back"); await press(page, "New project"); await press(page, "Empty", true); await press(page, "Continue"); await press(page, "Create");
-      await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await tap(page, "u:create");
+      await tap(page, "u:back"); await tap(page, "m:menu"); await tap(page, "m:games"); await press(page, "New project"); await press(page, "Empty", true); await press(page, "Continue"); await press(page, "Create");
+      await tap(page, "m:menu"); await tap(page, "m:units"); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await tap(page, "u:create");
       await page.waitForFunction(() => document.querySelector('[data-knob="unit_hp"]')?.value === "9" && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
       await tap(page, "u:role"); await waitText(page, "Warrior (BTF)"); tiny.push(...await big()); await tap(page, "u:close");
       await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("03-on-your-team"); tiny.push(...await big());
       await tap(page, "t:team"); await page.waitForFunction(() => { const files = window.__read(), gear = JSON.parse(files["project.json"]).project.loadout, id = gear.roster.at(-1); return gear.roster.length === 1 && gear.size === 1 && typeof id === "string" && String(files[`units/${id}.json`] ?? "").includes("Hero"); }, null, { timeout: 15000 });
     });
     await step("6 empty board", async () => {
-      await tap(page, "u:back"); await press(page, "Blank"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
+      await tap(page, "u:back"); await tap(page, "m:close"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
       await tap(page, "s:test"); await waitText(page, "Place a unit on this stage to test it.");
       const board = await page.evaluate(() => document.querySelector("#board") !== null || document.querySelector("#app")?.hidden === true); if (board) throw new Error("board");
       await shot("04-empty-board");
```

### `handoff/steps/tests/s6b-levels/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6b-levels/smoke.mjs b/handoff/steps/tests/s6b-levels/smoke.mjs
index 7b721ce..6ac00fe 100644
--- a/handoff/steps/tests/s6b-levels/smoke.mjs
+++ b/handoff/steps/tests/s6b-levels/smoke.mjs
@@ -30,7 +30,7 @@ try {
     const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
     const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
+    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu"); await tap(page, "m:levels");
     await step("1 levels off then on", async () => {
       await page.locator('[data-act="l:on"]').scrollIntoViewIfNeeded(); await waitText(page, "Levels: Off"); await shot("01-levels-off");
       await tap(page, "l:on"); await waitText(page, "Levels: 9 · 112 XP to the top"); await quiet(page); await page.locator('[data-act="l:open"]').scrollIntoViewIfNeeded(); await shot("02-levels-on");
@@ -77,11 +77,11 @@ try {
     });
     await step("6 turn off", async () => {
       await quiet(page); await tap(page, "l:off"); await page.waitForFunction(() => document.body.innerText.includes("Levels: Off") && document.querySelector("[data-sheet=levels]") === null, null, { timeout: 15000 });
-      await quiet(page); await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined && window.__driver.stats.draws > 0 && document.querySelector("#xp")?.textContent === "" && getComputedStyle(document.querySelector("#xp")).display === "none", null, { timeout: 15000 });
+      await quiet(page); await tap(page, "m:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined && window.__driver.stats.draws > 0 && document.querySelector("#xp")?.textContent === "" && getComputedStyle(document.querySelector("#xp")).display === "none", null, { timeout: 15000 });
     });
     await step("7 reload", async () => {
-      await press(page, "Back to maker"); await page.waitForFunction(() => document.body.innerText.includes("Levels: Off"), null, { timeout: 15000 });
-      await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game");
+      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
+      await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await tap(page, "m:menu"); await tap(page, "m:levels");
       await waitText(page, "Levels: Off"); await tap(page, "l:on"); await quiet(page); await tap(page, "l:open");
       await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3 && ["17 XP", "11 XP", "13 XP"].every((t, i) => document.querySelector(`[data-val="row-${i}"]`)?.textContent === t), null, { timeout: 15000 });
     });
```

### `handoff/steps/tests/s6c-checkpoint/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s6c-checkpoint/smoke.mjs b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
index 1fa2da9..3742254 100644
--- a/handoff/steps/tests/s6c-checkpoint/smoke.mjs
+++ b/handoff/steps/tests/s6c-checkpoint/smoke.mjs
@@ -13,7 +13,6 @@ const out = join(root, "handback/step-06c-checkpoint/r1"); mkdirSync(out, { recu
 let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
 const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
 const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
-const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
 const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
 const quiet = (page) => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
 const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
@@ -29,7 +28,7 @@ try {
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await step("1 new empty", async () => {
       await tap(page, "new"); await tap(page, "tpl:empty"); await tap(page, "toname"); await page.locator("[data-name]").fill("Skirmish"); await tap(page, "create");
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Skirmish" && document.body.innerText.includes("Blank"), null, { timeout: 15000 });
+      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Blank", null, { timeout: 15000 }); await tap(page, "m:switch");
     });
     await step("2 resize 6x6", async () => {
       const menu = await page.evaluate(() => document.querySelector('[data-act^="r:menu:map:"]')?.getAttribute("data-act") ?? ""); if (menu === "") throw new Error("map");
@@ -37,7 +36,7 @@ try {
       for (let i = 0; i < 5; i += 1) { await tap(page, "r:step:c:1"); await tap(page, "r:step:r:1"); }
       await page.waitForFunction(() => document.body.innerText.includes("Columns 6") && document.body.innerText.includes("Rows 6"), null, { timeout: 15000 });
       await tap(page, "r:apply"); await page.waitForFunction(() => document.querySelector('[data-act="r:apply"]') === null && document.body.innerText.includes("6 × 6"), null, { timeout: 15000 }); await quiet(page);
-      await press(page, "Blank", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36 && document.body.innerText.includes("No enemies: free roam.") && document.body.innerText.includes("No player side: Test never reaches an outcome."), null, { timeout: 15000 });
+      await tap(page, "m:close"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36 && document.body.innerText.includes("No enemies: free roam.") && document.body.innerText.includes("No player side: Test never reaches an outcome."), null, { timeout: 15000 });
       await shot("02-stage");
     });
     await step("3 wall gap", async () => {
@@ -49,9 +48,9 @@ try {
       await shot("03-walls");
     });
     await step("4 hero", async () => {
-      await tap(page, "s:back"); await page.waitForFunction(() => document.querySelector('[data-act="u:add"]') !== null, null, { timeout: 15000 });
+      await tap(page, "m:menu"); await tap(page, "m:units"); await page.waitForFunction(() => document.querySelector('[data-act="u:add"]') !== null, null, { timeout: 15000 });
       await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await see(); await tap(page, "u:create");
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Hero", null, { timeout: 15000 });
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Hero"), null, { timeout: 15000 });
       await slide(page, '[data-knob="unit_hp"]', "20"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "20", null, { timeout: 15000 }); await quiet(page);
       await slide(page, '[data-knob="unit_atk"]', "5"); await page.waitForFunction(() => document.querySelector('[data-val="unit_atk"]')?.textContent === "2", null, { timeout: 15000 }); await quiet(page);
       await see(); await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 }); await quiet(page);
@@ -65,12 +64,12 @@ try {
     });
     await step("5 raider", async () => {
       await tap(page, "u:back"); await quiet(page); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Raider"); await see(); await tap(page, "u:create");
-      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Raider", null, { timeout: 15000 });
+      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Raider"), null, { timeout: 15000 });
       await slide(page, '[data-knob="unit_hp"]', "2"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "2" && document.querySelector('[data-act="u:reset:unit_hp"]') !== null && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
       await see(); await shot("05-raider"); await tap(page, "u:back"); await quiet(page);
     });
     await step("6 place", async () => {
-      await press(page, "Blank", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36, null, { timeout: 15000 });
+      await tap(page, "m:close"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36, null, { timeout: 15000 });
       await tap(page, "s:cell:0,0"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:place:spawn"); await quiet(page);
       await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("aria-label") ?? "").includes("Hero"), null, { timeout: 15000 });
       await tap(page, "s:cell:5,5"); await tap(page, "s:place:enemy"); await page.waitForFunction(() => [...document.querySelectorAll(".sheet h2")].some((n) => n.textContent === "Pick a unit"), null, { timeout: 15000 }); await see();
```

### `handoff/steps/tests/s7-stage-links/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s7-stage-links/smoke.mjs b/handoff/steps/tests/s7-stage-links/smoke.mjs
index 313c836..eee855b 100644
--- a/handoff/steps/tests/s7-stage-links/smoke.mjs
+++ b/handoff/steps/tests/s7-stage-links/smoke.mjs
@@ -29,12 +29,12 @@ try {
     const landed = (tos, at) => page.waitForFunction(({ tos, at }) => { const m = window.__play, links = window.__docs === undefined ? null : window.__docs.links; if (m === undefined || m.walk !== null || links === null) return false; const got = links.map((l) => l.to); return got.length === tos.length && got.every((id, i) => id === tos[i]) && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === at.c && u.at.r === at.r); }, { tos, at }, { timeout: 15000 });
     const counts = {}; let up = "";
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await step("1 new", async () => { await tap(page, "new"); await tap(page, "toname"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
+    await step("1 new", async () => { await tap(page, "new"); await tap(page, "toname"); await tap(page, "create"); await tap(page, "m:switch"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
     await step("2 upstairs", async () => { await tap(page, "r:add"); await see(); await tap(page, `r:use:${MAP}`); await page.waitForFunction((demo) => document.querySelectorAll(".cell").length === 54 && new URLSearchParams(location.search).get("stage") !== null && new URLSearchParams(location.search).get("stage") !== demo, DEMO, { timeout: 15000 }); up = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? ""); if (up === "") throw new Error("stage"); });
     await step("3 stairs down", async () => { await tap(page, "s:cell:2,7"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:link:stairs"); await waitText(page, "Stairs goes to"); await see(); await shot("01-goes-to"); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await waitText(page, "Remove link"); await see(); await shot("02-placed-link"); await tap(page, "s:close"); });
-    await step("4 stairs up", async () => { await tap(page, "s:back"); await press(page, "Demo stage", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:link:stairs"); await waitText(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await waitText(page, "Remove link"); await see(); await tap(page, "s:close"); });
-    await step("5 refuse delete", async () => { await tap(page, "s:back"); await tap(page, `r:menu:stage:${up}`); await tap(page, "r:delete"); await waitText(page, "A link on Demo stage leads here. Remove it first."); await see(); await shot("03-refusal"); await tap(page, "r:close"); });
-    await step("6 go up", async () => { counts.maker = await page.evaluate(() => window.__resizeN); await press(page, "Demo stage", true); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); counts.play = await page.evaluate(() => window.__resizeN); await go({ c: 0, r: 8 }, { c: 0, r: 7 }); await landed([DEMO], { c: 2, r: 7 }); counts.up = await page.evaluate(() => window.__resizeN); await shot("04-upstairs"); });
+    await step("4 stairs up", async () => { await tap(page, "m:switch"); await press(page, "Demo stage", true); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:link:stairs"); await waitText(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await waitText(page, "Remove link"); await see(); await tap(page, "s:close"); });
+    await step("5 refuse delete", async () => { await tap(page, "m:switch"); await tap(page, `r:menu:stage:${up}`); await tap(page, "r:delete"); await waitText(page, "A link on Demo stage leads here. Remove it first."); await see(); await shot("03-refusal"); await tap(page, "r:close"); });
+    await step("6 go up", async () => { counts.maker = await page.evaluate(() => window.__resizeN); await tap(page, "m:close"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); counts.play = await page.evaluate(() => window.__resizeN); await go({ c: 0, r: 8 }, { c: 0, r: 7 }); await landed([DEMO], { c: 2, r: 7 }); counts.up = await page.evaluate(() => window.__resizeN); await shot("04-upstairs"); });
     await step("7 go down", async () => { await go({ c: 2, r: 7 }, { c: 2, r: 8 }); await hero({ c: 2, r: 8 }); await page.evaluate(() => window.__play.endTurn()); await page.waitForFunction(() => { const m = window.__play; return m.walk === null && m.world.phases.battle === "idle" && m.side === m.sides.me; }, null, { timeout: 15000 }); await go({ c: 2, r: 8 }, { c: 2, r: 7 }); await landed([up], { c: 0, r: 7 }); counts.down = await page.evaluate(() => window.__resizeN); await shot("05-back-down"); });
     await step("8 back to maker", async () => { await press(page, "Back to maker", true); await page.waitForFunction(() => document.querySelector("#board") === null && document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); counts.back = await page.evaluate(() => window.__resizeN); });
     const flat = JSON.stringify(counts), want = JSON.stringify({ maker: 0, play: 1, up: 1, down: 1, back: 0 });
```

### `handoff/steps/tests/s8-autosave-links/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s8-autosave-links/smoke.mjs b/handoff/steps/tests/s8-autosave-links/smoke.mjs
index c7404b2..4e8e6f2 100644
--- a/handoff/steps/tests/s8-autosave-links/smoke.mjs
+++ b/handoff/steps/tests/s8-autosave-links/smoke.mjs
@@ -29,13 +29,13 @@ try {
     const quiet = () => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
     let up = "";
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
-    await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
+    await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await tap(page, "m:switch"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); });
     await step("2 upstairs", async () => { await tap(page, "r:add"); await sheet(page, "Add stage"); await see(); await tap(page, `r:use:${MAP}`); await page.waitForFunction((demo) => document.querySelectorAll(".cell").length === 54 && new URLSearchParams(location.search).get("stage") !== null && new URLSearchParams(location.search).get("stage") !== demo, DEMO, { timeout: 15000 }); up = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? ""); if (up === "") throw new Error("stage"); });
     await step("3 stairs down, autosave on", async () => { await tap(page, "s:cell:3,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:3,7"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${DEMO}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:2,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); await tap(page, "s:cell:2,7"); await page.waitForFunction(() => document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 }); await see(); await tap(page, "s:autosave"); await page.waitForFunction(() => document.querySelector('[data-seg="s:autosave"] [aria-pressed="true"]')?.textContent === "On" && document.body.innerText.includes("Autosave here"), null, { timeout: 15000 }); await see(); await shot("01-autosave-on"); await tap(page, "s:close"); });
-    await step("4 game starts upstairs, stairs up", async () => { await tap(page, "s:back"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelector(".sheet") === null, null, { timeout: 15000 }); await quiet(); await tap(page, `stage:${DEMO}`); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); });
-    await step("5 start can't be deleted", async () => { await tap(page, "s:back"); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:delete"); await waitText(page, "The game starts here. Pick another start first."); await see(); await shot("02-start-refusal"); await tap(page, "r:close"); });
-    await step("6 test starts upstairs, stairs autosave", async () => { await quiet(); await tap(page, "test"); await page.waitForFunction((id) => window.__play !== undefined && window.__docs?.stage?.id === id, up, { timeout: 15000 }); await go({ c: 3, r: 7 }, { c: 2, r: 7 }); await page.waitForFunction((id) => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === id && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, DEMO, { timeout: 15000 }); await shot("03-downstairs"); });
-    await step("7 continue", async () => { await press(page, "Back to maker", true); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await see(); await page.evaluate(() => { delete window.__play; delete window.__docs; }); await tap(page, "continue"); await page.waitForFunction(() => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === "stage_01JDAS00000000000000000001" && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, null, { timeout: 15000 }); await shot("04-continue"); });
+    await step("4 game starts upstairs, stairs up", async () => { await tap(page, "m:switch"); await page.waitForFunction(() => [...document.querySelectorAll("h2")].some((h) => h.textContent === "Stages"), null, { timeout: 15000 }); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:start"); await page.waitForFunction(() => document.querySelectorAll(".sheet").length < 2, null, { timeout: 15000 }); await quiet(); await tap(page, `stage:${DEMO}`); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54 && (document.querySelector("h1")?.textContent ?? "").includes("Demo stage"), null, { timeout: 15000 }); await tap(page, "s:cell:0,7"); await sheet(page, "Add here"); await see(); await tap(page, "s:link:stairs"); await sheet(page, "Stairs goes to"); await see(); await tap(page, `s:to:${up}`); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,7"]')?.getAttribute("aria-label") ?? "").endsWith(", Stairs"), null, { timeout: 15000 }); });
+    await step("5 start can't be deleted", async () => { await tap(page, "m:switch"); await tap(page, `r:menu:stage:${up}`); await waitText(page, "Game starts here"); await see(); await tap(page, "r:delete"); await waitText(page, "The game starts here. Pick another start first."); await see(); await shot("02-start-refusal"); await tap(page, "r:close"); });
+    await step("6 test starts upstairs, stairs autosave", async () => { await quiet(); await tap(page, `stage:${up}`); await tap(page, "s:test"); await page.waitForFunction((id) => window.__play !== undefined && window.__docs?.stage?.id === id, up, { timeout: 15000 }); await go({ c: 3, r: 7 }, { c: 2, r: 7 }); await page.waitForFunction((id) => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === id && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, DEMO, { timeout: 15000 }); await shot("03-downstairs"); });
+    await step("7 continue", async () => { await press(page, "Back to maker", true); await tap(page, "m:menu"); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await see(); await page.evaluate(() => { delete window.__play; delete window.__docs; }); await tap(page, "continue"); await page.waitForFunction(() => { const m = window.__play; return m !== undefined && m.walk === null && window.__docs?.stage?.id === "stage_01JDAS00000000000000000001" && m.world.units.all().some((u) => u.alive && u.side === m.sides.me && u.at.c === 0 && u.at.r === 7); }, null, { timeout: 15000 }); await shot("04-continue"); });
     check(`8 targets @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 && errs.length === 0 ? "ok" : [...new Set(tiny)].concat(errs).join(" | "));
     await ctx.close();
   };
```

### `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s9-art-backgrounds/smoke.mjs b/handoff/steps/tests/s9-art-backgrounds/smoke.mjs
index 4d63f78..66763b6 100644
--- a/handoff/steps/tests/s9-art-backgrounds/smoke.mjs
+++ b/handoff/steps/tests/s9-art-backgrounds/smoke.mjs
@@ -27,7 +27,7 @@ try {
     let id = "";
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); id = await idOf(); if (id === "") throw new Error("id"); });
-    await step("2 no background", async () => { await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined && document.querySelector("#board") instanceof HTMLCanvasElement && document.querySelector("#board").width > 0, null, { timeout: 15000 }); const px = await pixels(); if (px === null || px.mag !== 0 || px.cyan !== 0) throw new Error(JSON.stringify(px)); await shot("01-plain"); });
+    await step("2 no background", async () => { await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined && document.querySelector("#board") instanceof HTMLCanvasElement && document.querySelector("#board").width > 0, null, { timeout: 15000 }); const px = await pixels(); if (px === null || px.mag !== 0 || px.cyan !== 0) throw new Error(JSON.stringify(px)); await shot("01-plain"); });
     await step("3 painted", async () => {
       const art = await page.evaluate(async ({ id, map }) => { const c = new OffscreenCanvas(96, 144), g = c.getContext("2d"); if (g === null) throw new Error("2d"); g.fillStyle = "#ff00ff"; g.fillRect(0, 0, 48, 144); g.fillStyle = "#00ffff"; g.fillRect(48, 0, 48, 144); const bytes = new Uint8Array(await (await c.convertToBlob({ type: "image/png" })).arrayBuffer()); const hex = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16); const asset = `asset_${hex}`; const root = await navigator.storage.getDirectory(); const put = async (path, data) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(data); await w.close(); }; const read = async (path) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); }; const pre = `tileengine/projects/${id}/`; const project = JSON.parse(await read(`${pre}project.json`)), doc = JSON.parse(await read(`${pre}${map}`)); project.project.assets[asset] = { name: "Split", ext: "png", origin: { kind: "upload", fileName: "split.png" }, kind: "background" }; doc.background = { layers: [{ assetId: asset, depth: 1, repeat: "none" }] }; await put(`${pre}project.json`, JSON.stringify(project)); await put(`${pre}${map}`, JSON.stringify(doc)); await put(`${pre}assets/${asset}.png`, bytes); return asset; }, { id, map: MAP });
       await open(page, id); await page.waitForFunction(() => { const tiles = window.__play?.scene?.().layers?.[0]?.tiles; return Array.isArray(tiles) && tiles.some((t) => t === null); }, null, { timeout: 15000 }); await page.waitForFunction(() => { window.__n = (window.__n ?? 0) + 1; return window.__n > 3; }, null, { timeout: 15000 });
```

### `handoff/steps/tests/s9b-art-upload/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s9b-art-upload/smoke.mjs b/handoff/steps/tests/s9b-art-upload/smoke.mjs
index fed5324..ad61358 100644
--- a/handoff/steps/tests/s9b-art-upload/smoke.mjs
+++ b/handoff/steps/tests/s9b-art-upload/smoke.mjs
@@ -29,7 +29,7 @@ try {
     await page.goto(`${origin}/maker/`, { waitUntil: "load" });
     await step("1 new", async () => { await tap(page, "new"); await waitText(page, "Pick a start"); await tap(page, "toname"); await waitText(page, "Name it"); await tap(page, "create"); await waitText(page, "Demo stage"); id = await page.evaluate(async () => { const projects = await (await (await navigator.storage.getDirectory()).getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_")) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); return ids[0]; }); });
     await step("2 upload", async () => {
-      await tap(page, `stage:${STAGE}`); await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await undo(true); await tap(page, "b:open"); await waitText(page, "No background yet.");
+      await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await undo(true); await tap(page, "b:open"); await waitText(page, "No background yet.");
       const buf = await page.evaluate(async () => { const c = new OffscreenCanvas(96, 144), g = c.getContext("2d"); if (g === null) throw new Error("2d"); g.fillStyle = "#ff00ff"; g.fillRect(0, 0, 48, 144); g.fillStyle = "#00ffff"; g.fillRect(48, 0, 48, 144); return [...new Uint8Array(await (await c.convertToBlob({ type: "image/png" })).arrayBuffer())]; });
       await page.locator("[data-art]").setInputFiles({ name: "split.png", mimeType: "image/png", buffer: Buffer.from(buf) }); await waitText(page, "Layer 1 · split");
       const info = await page.evaluate(async ({ id, map, fs }) => { const disk = await (eval(fs))(id), pre = `tileengine/projects/${id}/`, names = await disk.names(`${pre}assets`), project = JSON.parse(await disk.text(`${pre}project.json`)), doc = JSON.parse(await disk.text(`${pre}${map}`)); const asset = Object.keys(project.project.assets)[0]; return { names, asset, ext: project.project.assets[asset].ext, fileName: project.project.assets[asset].origin.fileName, layer: doc.background.layers[0].assetId }; }, { id, map: MAP, fs: fsOf() });
@@ -52,14 +52,14 @@ try {
       const box = await page.locator("#noteX").boundingBox(); if (box === null || box.width < 44 || box.height < 44) throw new Error(JSON.stringify(box)); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
       for (let n = 0; n < 5; n += 1) await page.waitForFunction(() => { window.__h = (window.__h ?? 0) + 1; return window.__h > 5 && document.querySelector("#note")?.style.display === "none"; }, null, { timeout: 15000 }); await shot("05-note"); });
     await step("6 duplicate", async () => {
-      await tapSel(page, "#back-maker"); await waitText(page, "Demo stage"); await tap(page, "back"); await waitText(page, "New project"); await tap(page, `menu:${id}`); await tap(page, "duplicate"); await page.waitForFunction(() => document.querySelectorAll("[data-act^='menu:']").length === 2, null, { timeout: 15000 });
+      await tapSel(page, "#back-maker"); await waitText(page, "Demo stage"); await tap(page, "m:menu"); await tap(page, "m:games"); await waitText(page, "New project"); await tap(page, `menu:${id}`); await tap(page, "duplicate"); await page.waitForFunction(() => document.querySelectorAll("[data-act^='menu:']").length === 2, null, { timeout: 15000 });
       const same = await page.evaluate(async ({ id, fs }) => { const disk = await (eval(fs))(id), root = await navigator.storage.getDirectory(), projects = await (await root.getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_") && name !== id) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); const mine = (await disk.names(`tileengine/projects/${id}/assets`)).join(), copy = (await disk.names(`tileengine/projects/${ids[0]}/assets`)).join(); if (mine !== copy || mine.split(",").length !== 2) throw new Error(`${mine} != ${copy}`); return mine; }, { id, fs: fsOf() }); if (same === "") throw new Error("empty"); });
     await step("7 continue", async () => {
       await page.evaluate(async ({ id, stage, unit, fs }) => { const disk = await (eval(fs))(id), text = await disk.text(`tileengine/projects/${id}/project.json`), rev = JSON.parse(text).project.rev; const save = { kind: "session-save", formatVersion: 1, header: { projectHash: `rev:${rev}`, engineVersion: "0.0.0", projectId: id, savedAt: "2026-11-25T00:00:00.000Z" }, from: stage, to: stage, party: { side: "player", members: [{ unitId: unit, hp: 20 }], bar: null } }; await disk.put(`tileengine/saves/${id}/autosave.json`, JSON.stringify(save)); }, { id, stage: STAGE, unit: UNIT, fs: fsOf() });
-      await tap(page, `open:${id}`); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await tap(page, `stage:${STAGE}`); await tap(page, "b:open"); await waitText(page, "Layer 1");
+      await tap(page, `open:${id}`); await tap(page, "m:menu"); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await tap(page, "m:close"); await tap(page, "b:open"); await waitText(page, "Layer 1");
       const rev = await page.evaluate(async ({ id, fs }) => JSON.parse(await (await (eval(fs))(id)).text(`tileengine/projects/${id}/project.json`)).project.rev, { id, fs: fsOf() });
       await tap(page, "b:del:0"); await page.waitForFunction(async ({ id, fs, rev }) => JSON.parse(await (await (eval(fs))(id)).text(`tileengine/projects/${id}/project.json`)).project.rev === rev + 1 && !document.body.innerText.includes("Layer 2"), { id, fs: fsOf(), rev }, { timeout: 15000 });
-      await tap(page, "b:close"); await page.waitForFunction(() => document.querySelector('[data-act="b:close"]') === null, null, { timeout: 15000 }); await tap(page, "s:back"); await tap(page, "continue"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); await tapSel(page, "#back-maker"); await waitText(page, "Continued. Since the save: the project changed"); await shot("07-continue"); });
+      await tap(page, "b:close"); await page.waitForFunction(() => document.querySelector('[data-act="b:close"]') === null, null, { timeout: 15000 }); await tap(page, "m:menu"); await tap(page, "continue"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); await tapSel(page, "#back-maker"); await waitText(page, "Continued. Since the save: the project changed"); await shot("07-continue"); });
     await ctx.close();
   };
   await run(390); await run(360);
```

### `tests/editor/project-home.test.ts` (edited)

```diff
diff --git a/tests/editor/project-home.test.ts b/tests/editor/project-home.test.ts
index a47b3cf..c0e70a4 100644
--- a/tests/editor/project-home.test.ts
+++ b/tests/editor/project-home.test.ts
@@ -7,7 +7,7 @@ import { checkName, copyName, duplicate, prefix, projectId, renameTo, restorePla
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { readProject } from "../../src/project/load/index.ts";
 import { parseProject } from "../../tools/maker/project-files.ts";
-import { projectScreen } from "../../tools/maker/project.ts";
+import { gameMenu } from "../../tools/maker/game-menu.ts";
 import { commitWrites, memoryStore, movePrefix, readTree } from "../../tools/maker/store.ts";
 const root = fileURLToPath(new URL("../..", import.meta.url)), NOW = "2026-11-19T00:00:00.000Z";
 const DOC = /^(?:project\.json|catalogue\/slice\.json|(?:maps\/map|stages\/stage|units\/unit|setups\/setup)_[0-9A-HJKMNP-TV-Z]{26}\.json)$/;
@@ -42,5 +42,5 @@ test("names, ids, templates, save, rename, duplicate, trash, stale, corrupt, gre
   const trash = memoryStore(); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const kept = await readTree(trash, prefix(idA));
   await movePrefix(trash, prefix(idA), prefix(idA, true)); await movePrefix(trash, prefix(idA, true), prefix(idA)); assert.deepEqual(await readTree(trash, prefix(idA)), kept);
   await movePrefix(trash, prefix(idA), prefix(idA, true)); for (const w of asWrites(made)) await trash.write(`${prefix(idA)}${w.path}`, w.text); const restored = restorePlan(idA, true, kept, idB, NOW, ["My game"]); assert.notEqual(restored.id, idA); assert.equal(proj(restored.files).copiedFrom?.projectId, idA); assert.deepEqual(restorePlan(idA, false, kept, idB, NOW, []).files, kept);
-  const html = projectScreen({ name: "My game", stages: 1, dirty: true, readOnly: false, banner: null, problems: [] }); assert.match(html, /<button type="button" class="btn primary" data-act="test"><svg class="ico"[^>]*>.*?<\/svg>Test<\/button>/); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
+  const html = gameMenu({ name: "My game", stages: 1, units: 0, effects: 0, budgets: "", build: "", dirty: true, readOnly: false, resume: false }); assert.match(html, /<button type="button" class="list-row" data-act="save"><svg class="ico"[^>]*>.*?<\/svg><span class="grow">Save<\/span><span class="meta">Unsaved<\/span>/); assert.equal(html.includes("btn primary"), false); assert.equal(html.includes("--soon"), false); assert.equal(/onclick|addEventListener/.test(html), false);
 });
```

### `tests/tools/export-11a.test.ts` (edited)

```diff
diff --git a/tests/tools/export-11a.test.ts b/tests/tools/export-11a.test.ts
index 92f5c00..1087e5e 100644
--- a/tests/tools/export-11a.test.ts
+++ b/tests/tools/export-11a.test.ts
@@ -100,7 +100,7 @@ test("11a buildGame: a saved project goes through the Test gate into a zip of th
   assert.throws(() => playBase("http://127.0.0.1/play/ab/home.js"), /Can't build: \/maker\//);
   assert.equal(playBase("http://127.0.0.1/maker/abc123def456/tools/maker/home.js"), "http://127.0.0.1/play-stage/abc123def456/");
   const home = readFileSync("tools/maker/home.ts", "utf8");
-  assert.equal(/if \(state\.dirty\) await saveCurrent\(\);\n {2}if \(state\.dirty\) return;/.test(home) && /built = \{ mode: "error", reason: e instanceof Error \? e\.message : "Can't build" \}/.test(home), true);
+  assert.equal(/if \(!await saveStage\(\)\) \{\n {4}paint\(\);\n {4}return;\n {2}\}\n {2}const id = state\.current;/.test(home) && /built = \{ mode: "error", reason: e instanceof Error \? e\.message : "Can't build" \}/.test(home), true);
 });
 test("11a play boot: Build game straight after opening ships each saved document byte for byte (a raw U+2028 and a v4 map included, nothing from notes/), and the zip's module plays the same as Test (old docs read up in memory by load/migrate.js, DSK E7)", async () => {
   const text = demo();
```

### `tests/tools/f1-look-kit.test.ts` (edited)

```diff
diff --git a/tests/tools/f1-look-kit.test.ts b/tests/tools/f1-look-kit.test.ts
index 1026130..63cbb68 100644
--- a/tests/tools/f1-look-kit.test.ts
+++ b/tests/tools/f1-look-kit.test.ts
@@ -6,7 +6,7 @@ import { fileURLToPath } from "node:url";
 import { prefix, storedRev } from "../../src/editor/project/home.ts";
 import { buildSheet } from "../../tools/maker/build-sheet.ts";
 import { ICON_NAMES, icon } from "../../tools/maker/icons.ts";
-import { projectScreen } from "../../tools/maker/project.ts";
+import { gameMenu, stageSwitcher } from "../../tools/maker/game-menu.ts";
 import { parseProject } from "../../tools/maker/project-files.ts";
 import { bindStage, stageClick, stageScreen, type Host } from "../../tools/maker/stage.ts";
 import { askSheet, goesSheet, placeButtons, talkSheet, unitButtons, unitPicker } from "../../tools/maker/stage-sheets.ts";
@@ -59,14 +59,14 @@ test("F1 button roles: every maker button names its role (btn primary, ghost, da
   assert.ok([["home.ts", "new", "New project"], ["units.ts", "u:add", "Add unit"], ["effects.ts", "e:new", "New effect"]].every(([name, act, words]) => sources.find((file) => file.name === name)?.text.includes(`<button type="button" class="btn ghost stage-row" data-act="${act}">\${icon("plus")}${words}</button>`)));
 });
 
-test("F1 button order: at most one primary per screen and per sheet; Test is the stage's and the project page's primary", async () => {
+test("F1 button order: at most one primary per screen and per sheet; Test is the stage's primary, and the game menu and stage switcher have none", async () => {
   const { host, io } = await demo("f1order");
   const stage = stageScreen(STAGE, host);
   assert.match(stage, /class="btn primary" data-act="s:test"/);
   const cell = await stageClick("s:cell:0,0", STAGE, host, io);
   const view = await stageClick("s:view", STAGE, host, io);
-  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: true, readOnly: false, banner: null, problems: [] });
-  assert.match(project, /class="btn primary" data-act="test"/);
+  const project = gameMenu({ name: "My game", stages: 1, units: 1, effects: 0, budgets: "", build: "", dirty: true, readOnly: false, resume: true }) + stageSwitcher([{ id: STAGE, name: "Stage 1" }], STAGE, false, "");
+  assert.ok(primaries(project).every((n) => n === 0));
   const sheets = [placeButtons([{ id: "npc", label: "NPC" }, { id: "foe", label: "Enemy" }]), goesSheet("Stairs", [{ id: "s2", name: "Two" }]), unitPicker([{ id: "u", name: "Scout" }]), askSheet("Scout"), talkSheet("Scout", 80, "Hi"), unitButtons(true, true), buildSheet({ mode: "ready", file: "g.zip", share: true }), buildSheet({ mode: "error", reason: "x" })];
   for (const html of [stage, stageScreen(STAGE, cell), stageScreen(STAGE, view), project, ...sheets]) assert.ok(primaries(html).every((n) => n <= 1), html);
   assert.equal(primaries(unitButtons(true, true))[0], 0);
@@ -127,9 +127,7 @@ test("F1 icons: one maker file of 24 px line icons (stroke currentColor, fill on
   assert.equal(/[⋯▶]/.test(all), false);
 });
 
-test("F1 card thumbnails: game rows, stage rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {
-  const project = projectScreen({ name: "My game", stages: 1, rows: [{ id: STAGE, name: "Stage 1" }], dirty: false, readOnly: false, banner: null, problems: [] });
-  assert.match(project, /<div class="card"><span class="thumb"><svg class="ico"/);
+test("F1 card thumbnails: game rows, maps, units, effects and levels cards lead with a 48 px thumb", () => {
   for (const [name, kind] of [["home.ts", "stages"], ["rooms.ts", "grid"], ["units.ts", "units"], ["effects.ts", "effects"], ["levels.ts", "levels"]]) assert.ok(sources.find((file) => file.name === name)?.text.includes(`class="card">\${thumb("${kind}")}`), name);
   assert.match(rule(".thumb"), /width: 48px; height: 48px; border-radius: 8px;.*background: var\(--surface-2\); border: 1px solid var\(--line\); color: var\(--muted\);/);
 });
```

### `tests/tools/f2a2-land-on-map.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { backScreen } from "../../tools/maker/test-launch.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const read = (rel: string): string => readFileSync(join(root, rel), "utf8");
const maker = readdirSync(join(root, "tools/maker")).filter((name) => name.endsWith(".ts")).map((name) => read(`tools/maker/${name}`));

test("F2a2 land on the map: the stage bar opens ☰ and the switcher, the project page is gone, Back returns to the stage", () => {
  const stage = read("tools/maker/stage.ts");
  assert.ok(stage.includes('<button type="button" class="btn icon bare" data-act="m:menu" aria-label="Game menu">${icon("menu")}</button><h1><button type="button" class="switch" data-act="m:switch"><span>${esc(name)}</span>${dot}${icon("down")}</button></h1>'));
  assert.equal(stage.split('data-act="s:back"').length - 1, 1);
  assert.equal(existsSync(join(root, "tools/maker/project.ts")), false);
  assert.equal(maker.some((text) => text.includes("projectScreen")), false);
  const home = read("tools/maker/home.ts");
  assert.ok(home.includes("budgets: budgetsRow(state.files), build: buildButton(building)"));
  assert.ok(home.includes("units: unitCount(state.files), effects: effectCount(state.files)"));
  assert.ok(home.includes("if (!landOn(id, text, null)) return;"));
  assert.ok(home.includes("const menu = built === null && edit === \"\" ? menuSheet(state.stageId) : \"\";"));
  assert.ok(home.includes('state.banner = "This game has no stages, so it can\'t open."'));
  assert.ok(home.includes("const next = hit.stageId ?? (gone ? stageRows(state.files)[0]?.id ?? null : null);"));
  assert.ok(home.includes("if (got.docs === null) { out(); state.banner = got.error; paint(); return; }"));
  assert.ok(home.includes("if (menuView() === \"menu\") {\n    menuSet(\"none\");\n  }"));
  assert.equal(home.includes('| "project" |'), false);
  assert.deepEqual([null, "home", "trash", "stage", "project"].map(backScreen), ["stage", "home", "trash", "stage", "stage"]);
});
```

### `tests/tools/play-stage-source.test.ts` (edited)

```diff
diff --git a/tests/tools/play-stage-source.test.ts b/tests/tools/play-stage-source.test.ts
index 17c7bb6..f3f66ec 100644
--- a/tests/tools/play-stage-source.test.ts
+++ b/tests/tools/play-stage-source.test.ts
@@ -10,7 +10,7 @@ import { installOne } from "../../src/rules/behaviours/index.ts";
 import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
 import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
 import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
-import { projectScreen } from "../../tools/maker/project.ts";
+import { stageScreen } from "../../tools/maker/stage.ts";
 import { memoryStore } from "../../tools/maker/store.ts";
 import { launchTest, openSaved } from "../../tools/maker/test-launch.ts";
 import { docsToInput } from "../../tools/play-stage/load.ts";
@@ -66,8 +66,8 @@ test("test-launch: save fails, no launch", async () => {
   const got = await launchTest({ store, id, stored, next, rev: storedRev(readJson("data/templates/demo.tileproj")), from: "project", now: NOW, start() { started = true; } });
   assert.equal(started, false); assert.equal(got.ok, false); if (got.ok) return;
   assert.match(got.lines[0] ?? "", /Couldn't save/); assert.equal(store.files.get(`${prefix(id)}project.json`), stored["project.json"]);
-  const html = projectScreen({ name: "Demo", stages: 1, dirty: true, readOnly: false, banner: got.lines[0] ?? null, problems: [] });
-  assert.match(html, /Couldn(?:'|&#39;)t save/); assert.match(html, /data-act="test"/); assert.equal(html.includes("openBundled"), false);
+  const html = stageScreen("stage_01JDAS00000000000000000001", { files: stored, rev: storedRev(readJson("data/templates/demo.tileproj")), readOnly: false, banner: got.lines[0] ?? null, dirty: true });
+  assert.match(html, /Couldn(?:'|&#39;)t save/); assert.match(html, /data-act="s:test"/); assert.equal(html.includes("openBundled"), false);
 });
 test("an unreadable project shows the error and does not launch the demo", async () => {
   const store = memoryStore(); await store.write(`${prefix("bad")}project.json`, "{");
```

### `tools/maker/effects.ts` (edited)

```diff
diff --git a/tools/maker/effects.ts b/tools/maker/effects.ts
index be0d10f..f39f177 100644
--- a/tools/maker/effects.ts
+++ b/tools/maker/effects.ts
@@ -27,6 +27,13 @@ export function effectsSection(files: DocText, readOnly: boolean): string {
   const add = readOnly ? "" : `<button type="button" class="btn ghost stage-row" data-act="e:new">${icon("plus")}New effect</button>`;
   return `<h2>Effects</h2>${rows}${add}`;
 }
+export function effectCount(files: DocText): number {
+  const bag = bagOf(files);
+  if (bag === null) {
+    return 0;
+  }
+  return effectRows(bag).length;
+}
 export function effectsSheet(files: DocText, readOnly: boolean): string {
   if (mode === "closed" || readOnly) return "";
   const bag = bagOf(files); if (bag === null) return "";
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 0ceea31..77bc1ab 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -2,18 +2,18 @@ import { aimKind } from "../../src/editor/unit/panel.ts";
 import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
-import { projectScreen } from "./project.ts";
+import { gameMenu, menuSet, menuView, sectionSheet, stageSwitcher } from "./game-menu.ts";
 import { buildButton, buildSheet, type BuildSheet, type BuildView } from "./build-sheet.ts";
 import { icon, thumb } from "./icons.ts";
 import { budgetsRow, budgetsTap } from "./budgets.ts";
 import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
-import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
+import { bindUnits, openUnit, rememberUnit, unitClick, unitCount, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { addFind, rememberAbility } from "./add-ability.ts";
 import { DEV } from "./dev.ts"; // dev-only
 import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
-import { effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
+import { effectCount, effectsAct, effectsSection, effectsSheet, fxOpen } from "./effects.ts";
 import { bindStage, dropUndo, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
@@ -26,7 +26,7 @@ import { keptLine, readAutosave, writeAutosave } from "./session.ts";
 const OPFS = "This browser can't save projects here. Open the app from its web address.";
 const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
+type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
 let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null, building: BuildView = "idle";
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
@@ -41,20 +41,80 @@ function sheet(): string {
   return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn primary" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? `${icon("save")}Save name` : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
 }
 function paint(): void {
-  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn ghost" data-act="undo">Undo</button></div>`;
+  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast${unitEditing() || rulesOpen() || levelsOpen() || fxOpen() || menuView() !== "none" ? " above" : ""}" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn ghost" data-act="undo">Undo</button></div>`;
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn primary" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn ghost" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${budgetsRow(state.files)}${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "stage" && state.current !== null && state.stageId !== null) {
+    const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : "";
+    const child = roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly) + buildSheet(built);
+    const menu = built === null && edit === "" ? menuSheet(state.stageId) : "";
+    root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + menu + child + artSheet(state.files, state.stageId, state.readOnly) + edit + toast;
+    return;
+  }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">${icon("back")}Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
   root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="btn ghost stage-row" data-act="new">${icon("plus")}New project</button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
+function menuSheet(stageId: string): string {
+  const shown = menuView();
+  if (shown === "menu") {
+    const row = state.rows.find((item) => item.id === state.current);
+    return gameMenu({ name: row?.name ?? "Game", stages: stageRows(state.files).length, units: unitCount(state.files), effects: effectCount(state.files), budgets: budgetsRow(state.files), build: buildButton(building), dirty: state.dirty, readOnly: state.readOnly, resume: resume !== null });
+  }
+  if (shown === "switch") return stageSwitcher(stageRows(state.files), stageId, state.readOnly, roomTail(state.files, state.readOnly));
+  if (shown === "units") return sectionSheet(shown, unitTail(state.files, state.readOnly));
+  if (shown === "effects") return sectionSheet(shown, effectsSection(state.files, state.readOnly));
+  if (shown === "levels") return sectionSheet(shown, levelsSection(state.files, state.readOnly));
+  return "";
+}
+function landOn(id: string, files: DocText, stage: string | null): boolean {
+  const first = stage ?? stageRows(files)[0]?.id ?? null;
+  if (first === null) {
+    state.screen = "missing";
+    state.banner = "This game has no stages, so it can't open.";
+    paint();
+    return false;
+  }
+  state.stageId = first;
+  bindStage(first, id);
+  menuSet("none");
+  state.screen = "stage";
+  return true;
+}
+async function leaveGame(): Promise<void> {
+  rulesShut();
+  hideArt();
+  menuSet("none");
+  forgetBuild();
+  state.screen = "home";
+  state.banner = null;
+  state.problems = [];
+  history.pushState(null, "", location.pathname);
+  await refresh();
+  paint();
+}
+async function menuAct(which: string): Promise<void> {
+  if (which === "close") {
+    menuSet("none");
+    paint();
+    return;
+  }
+  if (which !== "units" && which !== "effects" && which !== "levels" && !await saveStage()) {
+    paint();
+    return;
+  }
+  if (which === "games") return leaveGame();
+  menuSet(which);
+  paint();
+}
+async function saveNow(): Promise<void> {
+  await saveStage();
+  paint();
+}
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
-async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; if (!landOn(id, text, null)) return; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
 async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), from = prefix(state.menu), bins: { path: string; bytes: Uint8Array }[] = []; for (const name of await store.list(`${from}assets/`)) { const blob = await store.readBlob(`${from}assets/${name}`); if (blob !== null) bins.push({ path: `assets/${name}`, bytes: new Uint8Array(await blob.arrayBuffer()) }); } const got = await commitWrites(store, prefix(id), [...bins, ...asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))]); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
@@ -64,7 +124,7 @@ function saveTrip(link: LinkEvent, party: SessionParty): void { if (store === nu
 function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
   const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
-  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
+  const travel = next === undefined ? undefined : (link: LinkEvent, party: SessionParty): void => { const got = next(docs, link, party); if (got.docs === null) { out(); state.banner = got.error; paint(); return; } if (link.autosave) saveTrip(link, party); canvas.remove(); document.querySelector("#hud")?.remove(); enterPlay(got.docs, scroll, undefined, next); };
   try { startMatch(docs, out, aim, travel); root.hidden = true; } catch (e) { canvas.remove(); throw e; }
 }
 async function saveStage(): Promise<boolean> {
@@ -74,6 +134,9 @@ async function saveStage(): Promise<boolean> {
 }
 async function beginTest(aim?: AimAt & { readonly stageId?: string }, held?: SessionSave): Promise<void> {
   if (store === null || state.current === null) return;
+  if (menuView() === "menu") {
+    menuSet("none");
+  }
   const stageId = aim?.stageId ?? (state.screen === "stage" ? state.stageId : null);
   if (stageId !== null && state.screen === "stage" && !await saveStage()) { paint(); return; }
   const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
@@ -101,34 +164,34 @@ async function fromUrl(): Promise<void> {
   const text = await readTree(store, prefix(id)), aim = unit === null ? undefined : aimAt(text, unit, ability);
   const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), ...(aim === undefined ? {} : { aim }), start: (docs, at, next) => enterPlay(docs, 0, at, next) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
-  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
-  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
+  if (!landOn(id, got.files, stage)) return;
+  state.current = id; state.files = got.files; state.rev = got.rev; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id); bindUnits(id);
 }
 async function run(act: string): Promise<void> {
-  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && (act.startsWith("r:") || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
+  if (state.stageId !== null && store !== null && state.current !== null && ((state.screen === "stage" && ((act.startsWith("r:") && (act === "r:open" || rulesOpen())) || (rulesOpen() && !unitEditing() && act.startsWith("k:")))) || (act === "undo" && state.undo === "rule"))) {
     const hit = await rulesAct(act === "undo" ? "r:undo" : act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "rule"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
   }
   const unitUndo = act === "undo" && state.undo === "unit";
-  if (((act.startsWith("l:") && state.screen === "project") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
+  if (((act.startsWith("l:") && state.screen === "stage") || (act === "undo" && state.undo === "level")) && store !== null && state.current !== null) {
     const hit = await levelsAct(act === "undo" ? "l:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "level"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
   }
-  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "project") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
+  if ((((act.startsWith("e:") || (fxOpen() && act.startsWith("k:"))) && state.screen === "stage") || (act === "undo" && state.undo === "effect")) && store !== null && state.current !== null) {
     const hit = await effectsAct(act === "undo" ? "e:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project") paint(); }, 6000); }
+    if (hit.toast !== undefined) { window.clearTimeout(timer); state.toast = hit.toast; state.undo = hit.toast === null ? null : "effect"; if (hit.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     paint(); return;
   }
-  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && (state.screen === "project" || state.screen === "stage") && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("g:") || act.startsWith("u:") || act.startsWith("a:") || act.startsWith("k:") || act.startsWith("t:") || unitUndo) && state.screen === "stage" && store !== null && state.current !== null && templates !== null) {
     const hadBanner = state.banner !== null;
     const hit = await unitClick(unitUndo ? "u:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage" || (state.screen === "project" && !unitEditing())) paint(); }, 6000); }
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "unit"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
     if (hit.play !== undefined) return beginTest({ unitId: hit.play.unitId, stageId: hit.play.stageId, ...(hit.play.abilityId === undefined ? {} : { abilityId: hit.play.abilityId }), ...(hit.play.aim === undefined ? {} : { aim: hit.play.aim }) });
     if (act.startsWith("u:stat:") && hit.banner === null && !hadBanner && typeof hit.shown === "string") {
       const key = act.split(":")[2] ?? "", span = /^[A-Za-z0-9_-]+$/.test(key) ? document.querySelector(`[data-val="${key}"]`) : null;
@@ -139,14 +202,43 @@ async function run(act: string): Promise<void> {
     }
     paint(); return;
   }
-  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
+  if ((act.startsWith("r:") || (act === "undo" && state.undo === "room")) && state.screen === "stage" && store !== null && state.current !== null && templates !== null) {
     const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
     state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
-    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "project" && !unitEditing()) paint(); }, 6000); }
-    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
-    paint(); return;
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; state.undo = state.toast === null ? null : "room"; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; state.undo = null; if (state.screen === "stage") paint(); }, 6000); }
+    const gone = !stageRows(state.files).some((row) => row.id === state.stageId);
+    const next = hit.stageId ?? (gone ? stageRows(state.files)[0]?.id ?? null : null);
+    if (next !== null) {
+      state.stageId = next;
+      bindStage(next, state.current);
+      history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(next)}&from=stage`);
+    }
+    if (hit.stageId !== null) {
+      menuSet("none");
+    }
+    paint();
+    return;
+  }
+  if (act.startsWith("m:") && state.screen === "stage") return menuAct(act.slice(2));
+  if (act.startsWith("stage:") && state.screen === "stage" && !await saveStage()) {
+    paint();
+    return;
+  }
+  if (act.startsWith("stage:")) {
+    menuSet("none");
+    rulesShut();
+    state.stageId = act.slice(6);
+    bindStage(state.stageId, state.current ?? "");
+    state.screen = "stage";
+    if (!state.readOnly) {
+      state.banner = null;
+    }
+    if (state.current !== null) {
+      history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`);
+    }
+    paint();
+    return;
   }
-  if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
   if ((act === "b:open" || act === "b:close" || act.startsWith("b:del:")) && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
     if (act === "b:close") hideArt(); else if (act === "b:open") { showArt(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } else if (!state.readOnly) { if (!await saveStage()) setArtNote(state.banner ?? "Couldn't save."); else { const got = await dropLayer(store, state.current, state.files, state.rev, state.stageId, Number(act.slice(6)), nowIso()); if (!got.ok) setArtNote(got.line); else { state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } } }
     paint(); return;
@@ -156,7 +248,9 @@ async function run(act: string): Promise<void> {
     state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
     if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
     if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
-    if (out.leave) { rulesShut(); hideArt(); state.screen = "project"; } paint(); return;
+    if (out.leave) return leaveGame();
+    paint();
+    return;
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
@@ -165,7 +259,7 @@ async function run(act: string): Promise<void> {
   if (act === "build:share") return shareBuild();
   if (act === "build:done") return closeBuild();
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
-  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
+  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveNow(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
 }
 let built: BuildSheet = null;
 let builtFile: File | null = null;
@@ -175,14 +269,16 @@ function download(file: File): void {
 }
 async function buildNow(): Promise<void> {
   if (store === null || state.current === null) return;
-  if (state.dirty) await saveCurrent();
-  if (state.dirty) return;
+  if (!await saveStage()) {
+    paint();
+    return;
+  }
   const id = state.current;
   built = null;
   building = "busy"; state.problems = []; paint();
   try {
     const got = await buildGame(store, id, async (path) => { const res = await fetch(new URL(path, playBase(import.meta.url))); if (!res.ok) throw new Error(`Can't build: ${path}`); return res.text(); });
-    if (!got.ok) { state.problems = got.lines; building = "idle"; paint(); return; }
+    if (!got.ok) { state.banner = got.lines.join(" "); building = "idle"; paint(); return; }
     builtFile = new File([got.bytes as BlobPart], `${id}-game.zip`, { type: "application/zip" });
     download(builtFile);
     built = { mode: "ready", file: builtFile.name, share: navigator.canShare?.({ files: [builtFile] }) === true };
@@ -223,6 +319,6 @@ document.addEventListener("pointerdown", (ev) => { const node = ev.target instan
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
 document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(fxOpen() ? `e:set:${key}:${node.value}` : key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("change", (ev) => { const node = ev.target; if (node instanceof HTMLInputElement && node.hasAttribute("data-fxname")) { go(`e:name:${node.value}`); return; } if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
-document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
+document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
 void boot();
```

### `tools/maker/project.ts` (deleted)

```diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
deleted file mode 100644
index 461d1ba..0000000
--- a/tools/maker/project.ts
+++ /dev/null
@@ -1,11 +0,0 @@
-import { icon, thumb } from "./icons.ts";
-const amp = String.fromCharCode(38);
-const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string; readonly units?: string; readonly levels?: string }): string {
-  const reason = "Made with a newer TileEngine. Open only.";
-  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">${icon("save")}Save</button>` : `<button type="button" class="btn ghost" data-act="save">${icon("save")}Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
-  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
-  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
-  const rows = (input.rows ?? []).map((row) => `<div class="card">${thumb("stages")}<button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">${icon("more")}</button>`}</div>`).join("");
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">${icon("back")}Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}${input.units ?? ""}${input.levels ?? ""}<div class="test-wrap"><button type="button" class="btn primary" data-act="test">${icon("play")}Test</button></div></div>`;
-}
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index 476ee29..a68ef43 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -147,7 +147,7 @@ export function stageScreen(stageId: string, host: Host): string {
   const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
   const start = host.readOnly ? "" : `<button type="button" class="btn danger" data-act="s:fresh">Start new</button>`;
-  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">${icon("back")}Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">${icon("grid")}View</button><button type="button" class="btn ghost" data-act="b:open">${icon("image")}Background</button><button type="button" class="btn ghost" data-act="r:open">${icon("rules")}Rules</button>${start}<button type="button" class="btn primary" data-act="s:test">${icon("play")}Test</button></header>`;
+  const bar = `<header class="topbar wrap"><button type="button" class="btn icon bare" data-act="m:menu" aria-label="Game menu">${icon("menu")}</button><h1><button type="button" class="switch" data-act="m:switch"><span>${esc(name)}</span>${dot}${icon("down")}</button></h1><button type="button" class="btn ghost" data-act="s:view">${icon("grid")}View</button><button type="button" class="btn ghost" data-act="b:open">${icon("image")}Background</button><button type="button" class="btn ghost" data-act="r:open">${icon("rules")}Rules</button>${start}<button type="button" class="btn primary" data-act="s:test">${icon("play")}Test</button></header>`;
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
   const names = stageRows(host.files), linked = mark === null && cell !== null ? linkOn(got.stage, cell.c, cell.r) : null, linkType = linked !== null && (linked["type"] === "stairs" || linked["type"] === "door" || linked["type"] === "gate") ? linked["type"] : null;
   const rows = sheetRows(got.slice, mark !== null);
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index f7cf916..23dbbad 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -18,7 +18,7 @@ export type Next = (from: PlayReady, link: LinkEvent, party: SessionParty) => {
 export type Launch = { readonly ok: true; readonly files: DocText; readonly rev: number; readonly notes?: readonly Notice[] } | { readonly ok: false; readonly lines: readonly string[]; readonly files: DocText; readonly rev: number };
 type Start = (docs: PlayReady, aim?: AimAt, next?: Next) => void;
 export type LaunchBag = { readonly store: MakerStore; readonly id: string; readonly from: string; readonly stageId?: string; readonly aim?: AimAt; readonly start: Start; readonly resume?: SessionSave };
-export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";
+export const backScreen = (from: string | null): "home" | "trash" | "stage" => from === "home" || from === "trash" ? from : "stage";
 const fail = (lines: readonly string[], files: DocText, rev: number): Launch => ({ ok: false, lines, files, rev });
 const stageOf = (docs: PlayReady): string => { const stage = docs.stage; return typeof stage === "object" && stage !== null && "id" in stage && typeof stage.id === "string" ? stage.id : ""; };
 const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void => { const loc = globalThis as { history?: { pushState(state: null, title: string, url: string): void } }; const unit = aim?.unitId === undefined ? "" : `&unit=${encodeURIComponent(aim.unitId)}`; const ability = aim?.abilityId === undefined ? "" : `&ability=${encodeURIComponent(aim.abilityId)}`; loc.history?.pushState(null, "", `?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(stage)}&from=${encodeURIComponent(from)}${unit}${ability}`); };
```

### `tools/maker/units.ts` (edited)

```diff
diff --git a/tools/maker/units.ts b/tools/maker/units.ts
index 897f117..673a1d5 100644
--- a/tools/maker/units.ts
+++ b/tools/maker/units.ts
@@ -88,6 +88,13 @@ export function unitTail(files: DocText, readOnly: boolean): string {
   const add = readOnly ? "" : `<button type="button" class="btn ghost stage-row" data-act="u:add">${icon("plus")}Add unit</button>`;
   return `<h2>Units</h2>${cards}${add}`;
 }
+export function unitCount(files: DocText): number {
+  const bag = bagOf(files);
+  if (bag === null) {
+    return 0;
+  }
+  return shown(bag, sess.hidden).length;
+}
 function sheet(): string {
   const close = `<button type="button" class="btn ghost" data-act="u:close">Close</button>`;
   if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}${close}</div></div>`;
```
