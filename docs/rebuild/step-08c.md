# Rebuild record: step 8c, baseline walk draws units

Original brief: [`docs/maker/steps/step-08c-baseline-walk.md`](../maker/steps/step-08c-baseline-walk.md) on the merge (r1, blob `d231b171`, sha256 `484f4546b6b619223cfaad6e9d333f7f01296eba6e538fb90be7ebf598b3da30`, 69 lines). Delivery L11; Root cause L19; Rules L27; Build L32; Named tests L42; Smoke L45; Must NOT L53; Done when L58; Measured L62; Carries / Questions L68. Count command L40; hard per-file caps L35–38; hard gate 400 at L37 (trial 23). This is the fix for QA finding [`docs/qa/baseline-08b-shop-no-unit.md`](../qa/baseline-08b-shop-no-unit.md) (sha256 `79452cc2d2d4aaa166e9abfb64780f36ae86d8d9743a281f5503ed3f2d5d96d9`, 29 lines, blob `aafad2c0`): on `baseline-08b/?scene=shop` no unit was drawn, so "stage changes" stayed 0; the 06c skirmish baseline had the same cause. The guide's own base was `67832b08`; **Go-line order** (guide L7) is that 8c is pasted after 9a merges. The go-line named main `02a0a9c5` and floor **1135**. The guide is unchanged from the product base through the merge; current main adds only the 8c r1 QA review.

Sources: PR #100 and branch `step/step-08c-baseline-walk-r1-chatA` (r1 tip `7149df90`, r1 code head `96a50e04`); `handback/step-08c-baseline-walk/r1/HANDBACK.md` at `7149df90` and on the merge (HB, blob `bd0ee3df`, 130 lines, sha256 `453541ce873e19119f78e63341b4892575359183cdae68af8eaef09ab1b56a05`); CoS verify report `/workspace/share/step-08c-r1-verify/report.md` (V, 44 lines, sha256 `622244a190a5b9d66e0bc504e0e66067198abcf562b565d4a527378e7106f487`, hash-object `837d639897dae000dba449bc6caf1994a336acd0`). `docs/qa/step-08c-r1-review.md` on main `dde07b67` (QA, blob `6ae85df2`, 33 lines, sha256 `1ad0e9df2c466c78c4f37f72a259b25a6f831a2b86113f601d64c6401acb0baf`): **OK TO MERGE**, no must-fix, no rework round. Line cites use HB, V and QA. Product line cites are at merge `cd48ebdc` (tree `562b452f`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `02a0a9c560366777549f395cf97003500d238b1d`, 2026-11-24 21:21 (UK time). Floor **1135** tests (guide L8–9: 9a's final count + N=1). After this merge the floor is **1135**. The go-line was sent 21:22 UK time on this base, after 9a postmerge PASS. The guide's own base was `67832b08` (docs-only over D29 `8ab22996`); the product count against `67832b08` is not the official 8c number, because that range also includes 9a |
| r1 commits | on `step/step-08c-baseline-walk-r1-chatA`: `96a50e04a19ad152c9349f3992d70bf19abbb62c` Step 8c: dress a unit with no starter recipe so the baseline can walk (code head, tree `af2f75249bd797dfa48e396f4f0b2588a5367e4c`, 2026-11-24 21:49 UK time), `7149df9017879debd47b36dd6dffecc63148fb2e` docs(handback): step 8c baseline walk r1 (tree `6c96f3c4f74624fc953cdb2d85b848fa5b537585`, 2026-11-24 21:51 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (130 lines). The s8c (and s6d/s8) shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB, V, QA:5) |
| r1 verdict | Product green was 1135/0 and the official count was 22, with every cap kept (HB:15–19, V, QA:12). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA:3). Predicted merge tree onto main `5aba5ef7` was `562b452f` (V, QA:3, QA:19). PR #100 "Step 8c: baseline walk draws units (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA:27, V, HB:3) |
| Merge | PR #100, merge commit `cd48ebdcdbcbf547548c55625e0aec7dbb984bba`, 2026-11-24 22:16 (UK time). Tree `562b452f3285936524c1baf17d8236e13bf424d0` (the same tree CoS and QA predicted against main `5aba5ef7`; V, QA:3, QA:19). First parent `5aba5ef77bcc8fa0efd4748afafab266e0517063` (the 9a rebuild record and its QA review, docs-only on the product base), second parent `7149df90`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Diff vs the r1 tip is only the three 9a rebuild docs already on that first parent. `npm test` on the merge was **1135 pass / 0 fail** |
| After the merge | main is `dde07b67033691601be0b2f0c5ed9ad583e1459e`, 2026-11-24 22:16 (UK time), tree `fbabd23a9da75d66b25798b5328bb5773bf350c1`, which adds only `docs/qa/step-08c-r1-review.md` (33 insertions, sha256 `1ad0e9df`, hash-object `6ae85df2`). QA postmerge on `cd48ebdc` (tree `562b452f`) **PASSED** (pins 5/5, 1135/0). At 22:18 UK time the CEO typed in QA's chat: "OK publish baseline-08b from main dde07b67". CoS republished `baseline-08b/` only, from that main, as gh-pages `c4d11b440782cb9fb64063ed4365fad2eba13eaf` (22:21 UK time, parent `89eb1b8f`, tree `366138de`, noreply). `device-page/` and `baseline-06c/` were left untouched. Live https://g-tileengine.github.io/tileengine/baseline-08b/?scene=shop returns 200; `build.json` names `dde07b67`; 146/146 staged sha256s match; `looks.js` sha256 `2597cafb…` (was `c2a7db04…`) contains `starter:unknown-`. A device-scale-1 check on the live shop page: hero 4096 px @390 / 2304 px @360, hook false, Hero 20/20, stage changes 1. Pages build of `c4d11b44` is `built`. QA's post-publish walk check at device scale 1, then the phone reruns, are still outstanding (QA:33, guide L17, HB:130) |
| Tests | 1134 + N=1 (named test 1 in `tests/tools/baseline-walk.test.ts`) = **1135 pass / 0 fail**. Floor after this merge is **1135** (HB:16, V, QA:14) |

## (b) Files

From `git diff --name-status 02a0a9c5..96a50e04 -- . ':!handback/**' ':!node_modules' ':!handoff/steps/tests/s8c-baseline-walk/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 8c measure). The same product files are on the merge tree `562b452f`. The 9a rebuild docs on the merge are from first parent `5aba5ef7`, not from this branch. The r1 review doc landed on main `dde07b67` after the merge and is **not** in the official 400. The new s8c smoke is listed here because it shipped, but it is **outside** the official count (guide L9, L38, L40).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/play-stage/looks.ts` | M | 1 / 1 | 4 (L35) | yes. 2 |
| `tests/tools/baseline-walk.test.ts` | A | 20 / 0 | 40 (L36) | yes. 20 (sha256 `cc0496db201a01e659d5154be15d7fcabc946716ed4e69ed37634372f1764ca7`) |
| `handoff/steps/tests/s8c-baseline-walk/smoke.mjs` | A | 45 / 0 | 60 (L38) | **no.** 45, outside the 400 (sha256 `5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967`) |

No diff under `src/**`, `tools/baseline/**`, `data/`, `fixtures/`, `tools/painter-proto/` or `tools/ui-shell/`. No existing test or smoke was edited. s8 (`0de37442…`, 44 lines), S0 (`d528795e…`) and s6d (`e371ec7b…`) are unedited. Official G7, at `96a50e04` against `02a0a9c5`, and at the merge against first parent `5aba5ef7`, is **2 files changed, 21 insertions(+), 1 deletion(-)** = 22 ≤ 44 (gate 400). Every per-file cap is kept. The trial on `67832b08` was 2 files, 22+/1− = 23 (the test was measured at 21; the shipped test is 20). Without the smoke exclude the shortstat is 3 files +66/−1; that is not the official 8c product gate. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

Step 8c is a one-line fix in the shared play-stage look table, so the baseline shop and skirmish draw a unit that has no starter recipe (guide L19–24, Rules L27–30). The baseline page (`tools/baseline/page.ts`) already calls `startMatch`; nothing in `tools/baseline/` changes. Units are drawn from sheet ids `play:anim:<recipeId>@<side>` (`board.ts` L79 picks `recipeIn(body.recipes, unitId).id`). A unit whose id has no recipe gets the loader's fallback `starter:unknown-<unitId>` (`load.ts` L10). Before this step, `dressPx` (`looks.ts` L40) returned pixels only when `recipeId` was one of the starter `RECIPES`, so Hero and Raider on both baseline scenes had no pixels. Maker projects place starter units, which is why Test looked fine. Touch is cell-based and does not depend on drawing; the bug was the missing picture.

**`dressPx` (Rules).** `looks.ts:40` now also accepts a recipe id that `startsWith("starter:unknown-")`, then paints via `animPx` in the unit's team colour (`TEAM.player` / `TEAM.enemy` / `TEAM.neutral`). A sheet id that names neither a starter recipe nor a `starter:unknown-` id, or a paint that is not a `TEAM` key, still returns `undefined`. Nothing in `src/` or `tools/baseline/` changed. No new rAF, timer or loop; no change to the camera or driver (Q1, guide L25, L68–69). Headless device scale 3 is not phone-faithful and is not fixed here; the smoke runs at device scale 1, like every existing smoke.

**9a overlap.** 8c and 9a share one file, `tools/play-stage/looks.ts`. 8c changes `dressPx` at L40; 9a already changed `dress()` at L45–47 (the `bare` param). Both apply without conflict, in either order (guide L65). The trial merge onto current main (which already had 9a) was clean (V, QA:19).

The one new named test, in `tests/tools/baseline-walk.test.ts`, one import per line, DOM-free (guide L43, V, QA:13):

```ts
test("step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe", () => {
```

It runs at `:6`. For `openShop()` and `openCheckpoint()`: `createMatch(docs).scene()` has units; each unit's `assets[sprite].sheet.id` starts `play:anim:starter:unknown-` and `match.pixels(id).w === 32`. Plus `dressPx("play:anim:starter:unknown-x@player").w === 32`, and `undefined` for `play:anim:starter:nope@player` and `play:anim:starter:unknown-x@nobody`. It fails on the product base (guide L43, QA:23) and passes with the fix.

s8c (`handoff/steps/tests/s8c-baseline-walk/smoke.mjs`, sha256 `5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967`, 45 lines, port 8812) is `smoke.mjs . 8812 r1`: 8 ok lines and `SMOKE PASS` (HB:32–40, V, QA:16). It builds the release baseline (no `window.__play`) and finds the hero from the box of blue-dominant pixels (the lit `TEAM.player` fill). Per width, at device scale 1: shop hero (4096 px @390 / 2304 px @360, hook false); shop select Hero 20/20; shop walk stage changes 1 (worst ms in 3 frames after a swap); skirmish hero drawn and selected. Shots go to `handback/step-08c-baseline-walk/r1/` and must not be committed. On base it fails all 8 (guide L51). s6d stays `e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d`, unedited, rerun on 8808: 14 ok and `SMOKE PASS` (frame timings may vary slightly by machine; all 14 steps passed). s8 stays `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited, rerun as `smoke.mjs . 8810 r1 scratch-s8c-regress`: 16 ok and `SMOKE PASS`. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (V, QA:17): 14 ok and `TOUCH SMOKE PASS`.

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly: **132 / 146 / 132**, empty hit list, no `window.__play` in the play-stage or baseline release, `AUDIT PASS` (V, QA:18). `s8-audit.mjs` also reports `AUDIT PASS`; its loose maker-play count is 144 (the same known filter as 8a/8b/9a). No audit script was committed. The published `baseline-08b/` tree has 146 files (145 listed in `build.json` plus `build.json`); the extra file vs the earlier 42cc84b4 publish is 9a's `tools/play-stage/backdrop.js`.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:85` twice). No new error (HB:120, V, QA:15). Leave them.

The official count command (guide L40, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is 5aba5ef7, the 9a
# rebuild record and its QA review, not the product base 02a0a9c5.
# Official command at the r1 code head or r1 tip against 02a0a9c5,
# or at the merge against 5aba5ef7:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules' \
#     ':!handoff/steps/tests/s8c-baseline-walk/**'
#   2 files changed, 21 insertions(+), 1 deletion(-)
#
# The same 22 at the merge against 5aba5ef7. At the merge against
# 02a0a9c5, the official command also counts the three 9a rebuild
# docs already on the first parent (5 files, 937 insertions, 1
# deletion). Those files are not this step. Adding ':!docs/**' at
# the merge against 02a0a9c5 gives the official 22.
# At dde07b67 (current main, which also adds the r1 review) against
# 5aba5ef7, the official command without ':!docs/**' is 3 files,
# 54 insertions, 1 deletion. Adding ':!docs/**' again gives 22.
#
# Without the smoke exclude, at 96a50e04 against 02a0a9c5: 3 files,
# 66 insertions, 1 deletion. That is not the official 8c product gate.
# Trial on 67832b08 was 2 files, 22 insertions, 1 deletion = 23.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#   (unedited; 44 lines; already on main)
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#   (unedited)
#
# s8c handoff/steps/tests/s8c-baseline-walk/smoke.mjs sha256
#   5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967
#
# Named tests (npm test 1135/0, floor 1134 + N=1):
#   ✔ step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe
#
# Smokes under google-chrome, at 390 and 360 CSS px, device scale 1:
#   s8c (8812 r1):
#     ok 1 shop hero @390: 4096px hook false ok
#     ok 2 shop select @390: Hero 20/20 ok
#     ok 3 shop walk @390: stage changes 1 | worst ms in 3 frames after a swap …
#     ok 4 skirmish @390: 4096px Hero 20/20 ok
#     (same four at @360, 2304px), then SMOKE PASS
#   s6d (8808):
#     7 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1 scratch-s8c-regress):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 132 / 146 / 132, empty hit list.
```

## (d) What went wrong, in order, and the fix

**Before this step.** The 8b baseline was published from main `42cc84b4` as gh-pages `89eb1b8f` for the stair phone check. On `?scene=shop` no unit was drawn, so a stair walk was not possible (finding `docs/qa/baseline-08b-shop-no-unit.md`). The cause is the `dressPx` guard, not the baseline page. 8c is the fix; it was pasted after 9a merged.

**r1.** The one-line `dressPx` change, the named test and the new smoke shipped in one feat commit and green was 1135/0. The official gate was 22, with every per-file cap kept (`looks.ts` 2/4, test 20/40, smoke 45/60 outside the count). s8c passed 8 ok (stage changes 1 at 390 and 360), s6d passed 14 ok, s8 passed 16 ok and S0 passed 14 ok. The export audit was clean on a direct count. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `5aba5ef7` was `562b452f`.

QA **OK TO MERGE**, no must-fix, no rework round (QA:3). Mutation check: revert `looks.ts` to the base and the new test fails (0/1) and s8c fails; restored, both pass (QA:23).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V, QA:27). PR #100 was opened later, then merged.

## (e) Do it right first time

- The fix is in `tools/play-stage/looks.ts` only, shared by Test and the baseline: a thin reuse, nothing copied. Do not edit `src/**`, `tools/baseline/**`, data, fixtures, painter-proto or ui-shell. Do not edit an existing test or smoke. Leave s6d, s8 and S0 unedited. The only new test is `tests/tools/baseline-walk.test.ts`; the only new smoke is s8c.
- A fallback unit is dressed like any other unit: its team colour on the shared anim strip. A sheet id that names neither a starter recipe nor a `starter:unknown-` id, or an unknown side, still returns `undefined`.
- Do not add a second rAF, timer or loop. Do not change the camera or driver (the headless scale-3 question is Q1, not this step). Do not put a dev hook in the release build. The builder never publishes gh-pages.
- Measure with the count command (guide L40): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules' ':!handoff/steps/tests/s8c-baseline-walk/**'`. Count insertions plus deletions. **22** is the accepted number for this step (the trial was 23). The s8c smoke is outside that count (cap 60). On a merge whose first parent is not the product base, measure against that first parent (or at the code head against `02a0a9c5`), and do not treat first-parent or later QA docs as 8c lines. Do not treat 3 files +66/−1 (smoke included) as the official gate.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6d rewrites the tracked `handback/step-06d-baseline-page/r1/01-baseline.png` locally; restore it, do not commit it (QA:28).
- After the merge, republish `baseline-08b/` only after the CEO's typed OK in QA's chat naming the build. Then QA's post-publish walk check at device scale 1 (stage changes 1 or more), then the phone runs.
- Do not treat the open 8b/9a carries, or a later raf-driver dpr guard, as 8c fixes.

## (f) Rebuild check

From a clean tree at `02a0a9c560366777549f395cf97003500d238b1d` (the product base; the merge's first parent is `5aba5ef7`, which already has the 9a rebuild docs), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step.

```
# Product equality vs the merge (current main adds only the r1 QA review;
# the 9a rebuild docs are already on the merge from the first parent):
#   git diff cd48ebdc HEAD -- tools/play-stage/looks.ts \
#     tests/tools/baseline-walk.test.ts \
#     handoff/steps/tests/s8c-baseline-walk/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 02a0a9c5, or at the merge against first parent 5aba5ef7:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules' \
#     ':!handoff/steps/tests/s8c-baseline-walk/**'
#   2 files changed, 21 insertions(+), 1 deletion(-)
#
# The same 22 at the merge against 5aba5ef7. At the merge against
# 02a0a9c5, the official command also counts the three 9a rebuild
# docs (5 files, 937 insertions, 1 deletion). Those files are not this
# step. Adding ':!docs/**' at the merge against 02a0a9c5 gives 22.
# At dde07b67 (current main, which also adds the r1 review) against
# 5aba5ef7 without ':!docs/**': 3 files, 54 insertions, 1 deletion.
# Adding ':!docs/**' again gives 22.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#
# s8c handoff/steps/tests/s8c-baseline-walk/smoke.mjs sha256
#   5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967
#
# Named tests (npm test 1135/0, floor 1134 + N=1):
#   ✔ step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe
#
# Smokes under google-chrome, at 390 and 360 CSS px, device scale 1:
#   s8c (8812 r1):
#     4 ok lines @390 and @360, then SMOKE PASS
#   s6d (8808):
#     7 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1 scratch-s8c-regress):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 132 / 146 / 132, empty hit list.
```

## QA non-blockers carried forward

- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #100 existed (QA:27, V, HB:3).
- **s6d dirties a tracked png locally.** Running the s6d smoke rewrites `handback/step-06d-baseline-page/r1/01-baseline.png`. Restore it after a local run; do not commit it (QA:28).
- **Post-publish walk at device scale 1.** Headless Chrome at device scale 3 is not phone-faithful (it reports a css-sized device-pixel box, so the board draws 3× too big; guide L25, L68–69, Q1). The s8c smoke and the live check after `c4d11b44` ran at device scale 1 and saw stage changes 1. QA's post-publish walk on the live page, then the phone reruns, are still outstanding (QA:33). A later raf-driver guard (ignore `exact` when it is more than 2 px off `css × dpr`) is out of 8c scope (HB:130).
- The readout still says "baseline 06c" (known drift; QA:29).
- **Still open, not 8c scope:** a benched member rejoins only at the next link with room; the walled-off-pocket spill; `project.ts` L102 null grid; `levels.ts` L64 narrowing; the note row has no close button; `notPlaced` is not listed in `project-format.md`; 9a leftovers (`page.ts` never calls `bmp.close()`, the in-play "missing" branch has no test of its own, `board.scene()` identity / looks+board 10/15); the 9b upload work.

## Blob check

Each file must have exactly this git blob id at `cd48ebdc`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/play-stage/looks.ts` | `148132b5b0a50a0e9fdda0d7bb5307291cf437b2` | 62 |
| `tests/tools/baseline-walk.test.ts` | `c0b079067301b63e0998e8d5ce0e17562dab6fee` | 20 |
| `handoff/steps/tests/s8c-baseline-walk/smoke.mjs` | `b2091254939f0d0132cd2626e48fa3107ee241f8` | 45 |

## Appendix: full code as merged (step 8c, PR #100)

New files are `git show cd48ebdc:<path>` in full. Edited files are `git diff 02a0a9c5 cd48ebdc -- <path>`.

### `tools/play-stage/looks.ts` (edited)

```diff
diff --git a/tools/play-stage/looks.ts b/tools/play-stage/looks.ts
index 096d5aa..148132b 100644
--- a/tools/play-stage/looks.ts
+++ b/tools/play-stage/looks.ts
@@ -37,7 +37,7 @@ export function dressPx(id: string): Pixels | undefined {
   if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
   if (!id.startsWith("play:anim:")) return undefined;
   const body = id.slice("play:anim:".length), cut = body.lastIndexOf("@"), recipeId = cut < 0 ? body : body.slice(0, cut), paint = cut < 0 ? "neutral" : body.slice(cut + 1);
-  if (!Object.values(RECIPES).some((row) => row.id === recipeId) || !Object.hasOwn(TEAM, paint)) return undefined;
+  if (!(Object.values(RECIPES).some((row) => row.id === recipeId) || recipeId.startsWith("starter:unknown-")) || !Object.hasOwn(TEAM, paint)) return undefined;
   return animPx(paint === "player" ? TEAM.player : paint === "enemy" ? TEAM.enemy : TEAM.neutral);
 }
 type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { readonly c: number; readonly r: number }): { readonly id: string } };
```

### `tests/tools/baseline-walk.test.ts` (new)

```
import assert from "node:assert/strict";
import { test } from "node:test";
import { openCheckpoint, openShop } from "../../tools/baseline/checkpoint.ts";
import { dressPx } from "../../tools/play-stage/looks.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
test("step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe", () => {
  for (const opened of [openShop(), openCheckpoint()]) {
    if (opened.docs === null) throw new Error(opened.error);
    const match = createMatch(opened.docs), scene = match.scene();
    assert.ok(scene.units.length > 0);
    for (const unit of scene.units) {
      const id = scene.assets[unit.sprite]?.sheet.id;
      assert.equal(typeof id === "string" && id.startsWith("play:anim:starter:unknown-"), true);
      assert.equal(id === undefined ? undefined : match.pixels(id)?.w, 32);
    }
  }
  assert.equal(dressPx("play:anim:starter:unknown-x@player")?.w, 32);
  assert.equal(dressPx("play:anim:starter:nope@player"), undefined);
  assert.equal(dressPx("play:anim:starter:unknown-x@nobody"), undefined);
});
```

### `handoff/steps/tests/s8c-baseline-walk/smoke.mjs` (new)

```
// Step 08c baseline walk. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8812", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s8c-smoke-")); build(www, "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-08c-baseline-walk/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const heroFn = () => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const w = canvas.width, h = canvas.height, data = g.getImageData(0, 0, w, h).data; let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0, i = 0; y < h; y += 1) for (let x = 0; x < w; x += 1, i += 4) { const r = data[i] ?? 0, gr = data[i + 1] ?? 0, b = data[i + 2] ?? 0; if (b > r + 40 && b > gr + 20 && gr > r + 20 && b > 100 && r < 80) { n += 1; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } } if (n === 0 || x1 - x0 !== y1 - y0) return null; const rect = canvas.getBoundingClientRect(), bw = x1 - x0 + 1, sx = rect.width / w, sy = rect.height / h; return { n, cx: rect.left + (x0 + bw / 2) * sx, cy: rect.top + (y0 + (y1 - y0 + 1) / 2) * sy, cell: bw * sx, hook: Object.hasOwn(window, "__play") }; };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, name) }); };
    const quiet = () => errs.join(" | ") || "ok";
    await page.goto(`${origin}/?scene=shop`, { waitUntil: "load" });
    const hero = await page.waitForFunction(heroFn, null, { timeout: 15000 }).then(() => page.evaluate(heroFn));
    check(`1 shop hero @${width}`, hero !== null && hero.n > 0 && hero.hook === false && errs.length === 0, hero === null ? quiet() : `${hero.n}px hook ${hero.hook} ${quiet()}`);
    await shot("01-shop.png");
    if (hero !== null) {
      await page.touchscreen.tap(hero.cx, hero.cy);
      const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e));
      check(`2 shop select @${width}`, plate === "Hero 20/20" && errs.length === 0, `${plate} ${quiet()}`);
      await shot("02-selected.png");
      await page.touchscreen.tap(hero.cx + hero.cell, hero.cy); await page.touchscreen.tap(hero.cx + hero.cell, hero.cy);
      const walked = await page.waitForFunction(() => { const t = document.querySelector("#read")?.textContent ?? ""; if (t.startsWith("DONE")) return false; const m = /worst ms in 3 frames after a swap (\d+(?:\.\d+)?)/.exec(t); return t.includes("stage changes 1") && m !== null && Number(m[1]) > 0; }, null, { timeout: 10000 }).then(() => true).catch(() => false);
      const read = await page.locator("#read").innerText();
      check(`3 shop walk @${width}`, walked && !read.startsWith("DONE") && errs.length === 0, `${read.split("\n").slice(-2).join(" | ")} ${quiet()}`);
      await shot("03-walked.png");
    } else check(`2 shop select @${width}`, false, "no hero"); if (hero === null) check(`3 shop walk @${width}`, false, "no hero");
    await page.goto(`${origin}/`, { waitUntil: "load" });
    const foe = await page.waitForFunction(heroFn, null, { timeout: 15000 }).then(() => page.evaluate(heroFn)).catch(() => null);
    if (foe !== null) { await page.touchscreen.tap(foe.cx, foe.cy); const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e)); check(`4 skirmish @${width}`, foe.n > 0 && foe.hook === false && plate === "Hero 20/20" && errs.length === 0, `${foe.n}px ${plate} ${quiet()}`); await shot("04-skirmish.png"); }
    else check(`4 skirmish @${width}`, false, quiet());
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```
