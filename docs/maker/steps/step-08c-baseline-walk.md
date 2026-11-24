# Step 08c: baseline walk (a visible, tappable unit on the baseline page)

r1, 2026-11-24, Engine Architect. One builder run (ChatA) and one QA review, gates on. Fixes QA finding `docs/qa/baseline-08b-shop-no-unit.md` (sha256 `79452cc2…`, 29 lines, on main `67832b08`): on `baseline-08b/?scene=shop` no unit is drawn, so "stage changes" stays 0. The 06c skirmish baseline has the same cause. Every number below comes from a trial run (see Measured).

Step id: `step-08c-baseline-walk`. Revision: r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `67832b083f82694766dd609b5e3bd99bdad4c3e0` (docs only over `8ab22996`). **Go-line order:** 8c is pasted **after 9a merges**; use that main and its count (see Floor).
**Test floor:** base count **+ 1** (named test 1). Measured: 1125 → **1126** on `67832b08`; 1134 → **1135** on `67832b08` + the 9a trial patch.
**Smoke:** new, `handoff/steps/tests/s8c-baseline-walk/smoke.mjs`, port **8812** (outside the 400).

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-08c-baseline-walk-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-08c-baseline-walk/r1/HANDBACK.md`** (sections per `handoff/HAND-BACK.md`, plus § Green, § Smoke, § Export audit). Label the **Code head** apart from the docs-only **tip**. Don't commit a raw log or the smoke's shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`; keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR.
- **After the merge:** the baseline page is republished only after **CoS has the CEO's typed OK**; then **QA runs its post-publish walk check**; then the phone runs. The builder never publishes. Nothing public without CEO SEND via CoS.

## Root cause (found by trial, before any fix)
- The baseline page (`tools/baseline/page.ts`, 21 lines) already uses the play stage's own path: it calls `startMatch` from `tools/play-stage/page.ts`, so draw and touch wiring are the same code as Test. Nothing in the baseline page itself is wrong.
- Units are drawn from sheet ids `play:anim:<recipeId>@<side>` (`board.ts` L79 picks `recipeIn(body.recipes, unitId).id`). A unit whose id has no recipe gets the loader's fallback recipe `starter:unknown-<unitId>` (`load.ts` L10).
- `dressPx` (`looks.ts` L40 on base) returns pixels only when `recipeId` is one of the starter `RECIPES`. The old fallback bake in `pixelsOf` (`board.ts` L47) checks for an id **starting** with `starter:unknown-`, so it never sees the `play:anim:` id. Result: no pixels, and the driver draws nothing for that sheet.
- Both baseline scenes (`tools/baseline/checkpoint.ts`: Hero and Raider) use units with no starter recipe, so neither scene draws a unit. Maker projects place starter units, which is why Test looked fine.
- Touch is cell-based and doesn't depend on drawing. At device scale 1 on base, a tap on the hero's (invisible) cell already selects it and the walk gives stage changes 1. The bug is the missing picture.
- **Headless device scale 3 is not phone-faithful** (QA's repro used it). Headless Chrome reports `devicePixelContentBoxSize` 390 for a 390 css canvas with `devicePixelRatio` 3. The driver sizes the backing from that (`raf-driver.ts` L59 observer, L80 → `fit.ts` L4), while `page.ts` L26 seats the scale from `clientWidth × dpr`, so the board draws 3× too big and the hero is off-screen. A real phone reports device pixels, and the CEO's "two long blocks of squares" is the 6-wide wall row at the right scale. 8c does not change this; the smoke runs at device scale 1, like every existing smoke (see Questions).

## Rules
- The fix is in `tools/play-stage/looks.ts` only (shared by Test and the baseline: a thin reuse, nothing copied). Nothing in `src/` changes; nothing game-specific goes into src/core or src/sim.
- A fallback unit is dressed like any other unit: its team colour (`TEAM.player` / `TEAM.enemy` / `TEAM.neutral`) on the shared anim strip. A sheet id that names neither a starter recipe nor a `starter:unknown-` id, or an unknown side, still returns `undefined`.
- No edit to `tools/baseline/*`, the readout, the camera, the driver, an existing test or an existing smoke.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `tools/play-stage/looks.ts` | L40: also accept `recipeId.startsWith("starter:unknown-")` | 4 [1+1−] |
| `tests/tools/baseline-walk.test.ts` | new, named test 1 | 40 [21] |
| **Counted total** | | **44 [23], hard gate 400** |
| `handoff/steps/tests/s8c-baseline-walk/smoke.mjs` | new smoke, outside the 400 | 60 [36] |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules' ':!handoff/steps/tests/s8c-baseline-walk/**'`. Over any cap = stop and report. Don't wrap, split or join lines to fit a cap.

## Named tests
1. `step 8c baseline: every unit on both baseline scenes has pixels for the sheet it draws with, including a unit whose name matches no starter recipe`. For `openShop()` and `openCheckpoint()`: `createMatch(docs).scene()` has units; each unit's `assets[sprite].sheet.id` starts `play:anim:starter:unknown-` and `match.pixels(id).w === 32`. Plus `dressPx("play:anim:starter:unknown-x@player").w === 32`, and `undefined` for `play:anim:starter:nope@player` and `play:anim:starter:unknown-x@nobody`. **Fails on base** (checked), passes with the fix.

## Smoke (`node handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1`)
It builds the release baseline (`tools/baseline/build.ts`, which strips dev hooks) into a temp dir and serves it on 8812. Viewports 390×844 and 360×844, device scale 1, mobile + touch. The release build has no `window.__play`, so the hero is found from the canvas: the box of blue-dominant pixels (the lit `TEAM.player` fill). Per width:
1. shop: the hero is drawn (pixel count > 0).
2. shop: a tap on it selects it; the plate reads `Hero 20/20`.
3. shop: two taps one cell right (onto the stairs at (1,4)), then `page.waitForFunction` until `#read` doesn't start with DONE, has `stage changes 1`, and `worst ms in 3 frames after a swap` is > 0.
4. skirmish (no `?scene`): the hero is drawn and a tap selects it.
No page errors. Expect 8 ok and SMOKE PASS. Shots go to `handback/step-08c-baseline-walk/r1/` (not committed). **On base it fails all 8** (checked).

## Must NOT
- No edit to src/**, tools/baseline/**, data, fixtures, painter-proto or ui-shell; no edit to an existing test or smoke.
- No dev hook in the release build; no new rAF, timer or loop; no change to the camera or driver (dpr question below).
- No gh-pages push, no publish, no republish of the baseline.

## Done when
- Green exits 0 at the floor; `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101, `home.ts` L85 ×2).
- s8c smoke: 8 ok, SMOKE PASS. s6d baseline smoke on 8808 (14 ok), s8 smoke on 8810 (16 ok), S0 touch smoke on 8797 (sha `d528795e…`, 14 ok), all unedited. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.

## Measured (trial, `/tmp` worktrees, nothing committed)
- On `67832b08`: counted 2 files, 22+ 1− (23); with the smoke, 3 files, 58+ 1−. Green exit 0, 1126/1126. Tools tsc: 3 base errors. s8c smoke 8/8 at 390 and 360 (390: hero 4096 px, `Hero 20/20`, stage changes 1, worst 16.7 ms; 360: 2304 px, same). s6d 14 ok, s8 16 ok, S0 14 ok, audit PASS.
- On `67832b08` + 9a trial patch `s9-trial.patch` (`c03df133`), then the 8c patch: both apply cleanly in either order. Green exit 0, 1135/1135. s8c smoke 8/8, s9 smoke PASS.
- **9a overlap:** one shared file, `tools/play-stage/looks.ts`. 8c changes L40 (`dressPx`); 9a changes L45–47 (`dress()`: the `bare` param and the nullable tile list; its hunk context starts at L42, so the context lines touch 8c's hunk). git applies both without conflict, in either order.
- Trial patch: `/workspace/share/s8c/s8c-trial.patch` (sha256 `93b04bcf…`, 82 lines).

## Carries / Questions
- Q1 (EA → CoS/QA): QA's post-publish walk check should run at device scale 1, or on a real phone. At headless scale 3 the board draws 3× too big because Chrome's emulation reports a css-sized device-pixel box (see Root cause). Is that acceptable? If not, a small guard in `src/runtime/host/raf-driver.ts` (ignore `exact` when it is more than 2 px off `css × dpr`) could be its own step. It is not in the 9a patch, and it was not trialled.
