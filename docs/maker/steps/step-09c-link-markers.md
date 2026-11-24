# Step 09c: link markers on the play board (render, play stage)

r1, 2026-11-24, Engine Architect (finding from the CEO's phone runs via QA/CoS; EA ruling 22:47). One builder run (ChatA) and one QA review, with gates on. This is a **small render-only step**: the play-stage board draws a marker on every stage link cell (stairs, door, gate), so a player can see where a link is before a unit lands on it. Every number below comes from a trial run on `0436fd50` + the 9b r2 trial patch (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, not CEO rulings.

Step id: `step-09c-link-markers`. Guide revision r1; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** **main after 9b merges**, to be pinned then (CoS names the sha and its count in the go-line). The trial ran on `0436fd50069def3705a4fea244e37ecfd83f0aee` with `/workspace/share/s9b/s9b-trial.patch` (9b r2, sha256 `b0acc887…`) applied. If 9b's merged code differs from that trial in `tools/play-stage/board.ts`, re-check the line numbers in Read first before you start.
**Finding:** stage links have no visual on the board. The renderer never draws them, and `match.ts` only checks `linkAt` after a unit lands (L81). Repro: `fixtures/shop-stairs`, Hero at c0,r4, stairs at c1,r4: the stairs cell looks like plain floor. Not a regression from 8c (it was never drawn).
**Test floor:** **9b floor 1141 + 1 = 1142** (or the pinned main's count + 1). N = 1 (named test 1).
**Needs:** 9b (merged). **Blocks:** nothing; it improves the baseline walk (8c).
**Smoke:** new, `handoff/steps/tests/s9c-link-markers/smoke.mjs`, port **8814**. It is counted in the 400, with its own cap.

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-09c-link-markers-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-09c-link-markers/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas. Don't commit a raw test log or the smoke's shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- On the play board, every cell that holds a stage link shows a small marker, read from the stage's own link data (`links`). Stairs look like steps, a door like a door, a gate like bars; any other kind gets a plain diamond.
- The marker sits **above** the floor and the backgrounds and **below** the units, and it stays on while a unit is selected (it draws over the blue reach squares). It is readable at 360 px wide.
- **Render only** (EA ruling): no rule change, no new format fields, nothing in `src/core` or `src/sim`, and the play stage still never imports `tools/maker`.

**Not in 9c:** the optional info row "Stairs to <stage name>" for a tapped link cell (left out: a tap on an empty cell is a move target today, so naming it needs a new tap path in `match.ts`/`hud.ts`; see Carries); starter-frame art for markers (none exist yet; the shapes are procedural); markers in the maker's stage editor; any change to how or when a link fires.

## Read first (lines checked on the trial base, `0436fd50` + 9b r2)
1. EA ruling (2026-11-24, 22:47), quoted in § EA ruling below.
2. Link data: `CoreLink = {type: "stairs" | "door" | "gate", at: {c, r}, to}`; `tools/play-stage/project.ts` L80 (`links: core.doc.links ?? []`), so `PlayDocs.links` reaches the board as `body.links`. `fixtures/shop-stairs` stage 1: `[{"type":"stairs","at":{"c":1,"r":4},"to":"stage_01JDES00000000000000000002"}]`.
3. Board: `tools/play-stage/board.ts` L38 (`pixelsOf`, the procedural sheets), L79 (`let looks = dress(…)`), L133–136 (`scene()`, the `overlays` line: reach, path and aim squares are `fxGround` overlays).
4. Draw order: `src/runtime/render/draw-list.ts` L56 and L65–66: `fxGround` overlays paint after ground and backdrop and before standing units. No `src/` change is needed.
5. `tools/play-stage/match.ts` L81 (`landed` → `linkAt`): read only; not edited.
6. Test pattern: `tests/tools/play-stage-looks.test.ts` L1–13 (`createSceneLink(sourceOf(…))`, `chunkedList(…).cmds`); `tools/baseline/checkpoint.ts` L22 (`openShop()`). Smoke pattern: `handoff/steps/tests/s8c-baseline-walk/smoke.mjs` (release baseline build, `?scene=shop`, the hero blob).

## Rules
1. **Marker sheets.** In `board.ts`, before `pixelsOf`: a `SHAPE` record with one 16 × 16 shape per kind (`stairs`, `door`, `gate`, and `link` for the generic diamond) and `linkPx(kind)`. Lit pixels are cream (248, 244, 230); pixels touching a lit pixel are a dark edge (16, 20, 28); the rest is transparent, so the floor or picture shows through. `pixelsOf` starts with `if (id.startsWith("play:link-")) return linkPx(id.slice(10));`, so an unknown `play:link-*` id gives `undefined`.
2. **One marker per link.** After `let looks = dress(…)`: `marks` = one `fxGround` overlay per entry in `body.links`, sheet `play:link-<type>` when `SHAPE` has that type, else `play:link-link`, at `x = c * TILE, y = r * TILE`. It is built once per match (a stage change starts a new match, so it is never stale).
3. **Above the squares, below the units.** The `overlays` line becomes: `marks` alone when nothing is selected and there is no aim (the same array every frame, so `world-scene`'s memo holds), else reach + path (when selected), then aim, then `marks`. The draw list sorts by band and keeps order inside a band, so the marker draws on top of the reach, path and aim squares and under every unit.
4. **Render only.** No edit to `match.ts`, `levels.ts`, `hud.ts`, `page.ts`, any `src/**` file, data, fixtures or the format. `tools/play-stage` never imports `tools/maker`. No new rAF, timer or loop.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `tools/play-stage/board.ts` | `SHAPE`, `linkPx`, `pixelsOf` hook, `marks`, the `overlays` line (Rules 1–3) | 20 [10+ 1−] |
| `tests/tools/link-markers.test.ts` | new, named test 1 | 30 [19] |
| `handoff/steps/tests/s9c-link-markers/smoke.mjs` | new smoke | 45 [32] |
| **Total** | caps sum to 95; target under 120 | **400 hard gate [62]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named test (`tests/tools/link-markers.test.ts`, one import per line)
1. `step 9c link markers: the shop's stairs at c1,r4 draw a marker above the floor and below the units, and it stays on while a unit is selected`: `openShop()` docs → `createMatch` → `createSceneLink(sourceOf(…))` → `chunkedList(…).cmds`; exactly one cmd with sheet `play:link-stairs`, band `fxGround`, at c1,r4. After `SelectUnit` on the hero (reach not empty), the last overlay is still the marker and the draw list still has it. `pixelsOf` gives a picture with more than 20 and fewer than 256 opaque pixels for `stairs`, and opaque pixels for `door`, `gate` and `link`; `play:link-nope` is `undefined`.

## Smoke (`node handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1`)
Builds the release baseline (`tools/baseline/build.ts`, as s8c does; no dev hooks, so it checks canvas pixels), opens `?scene=shop` on 390×844 and 360×844, mobile and touch. It uses `waitForFunction` only, with no `waitForTimeout`.
1. **the hero is drawn at c0,r4**: the hero blob gives the cell size and the hero cell.
2. **the stairs cell c1,r4 shows a marker; a plain floor cell c3,r4 doesn't**: light pixels (r, g and b all > 120) in the cell one to the right of the hero > 20; in the cell three to the right, 0.
3. **the marker stays on while the hero is selected**: tap the hero → the plate shows HP → the stairs cell still has > 20 light pixels.
Expect 6 ok and SMOKE PASS. Shots go to `handback/step-09c-link-markers/r1/` and are not committed.

## Must NOT
- No edits outside the three files in the Build table: none to `src/**`, data, fixtures, the format, behaviour-library, painter-proto, ui-shell, `match.ts`, `levels.ts`, `hud.ts`, `page.ts` or `tools/maker/**`; no edit to an existing test or smoke.
- No rule change, no new format field, no new rAF, timer or loop; no gh-pages push or publish.

## Done when
- Green exits 0 at **1142** or more (or the pinned main's count + 1). `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101, maker `home.ts` ×2 at L88).
- s9c: 6 ok, SMOKE PASS. s9b on 8813 (14 ok), s9 on 8811 (12 ok), s8 on 8810 (16 ok, file sha `0de37442…`), s8c on 8812 (8 ok), s6d on 8808 (14 ok), S0 on 8797 (sha `d528795e…`, 14 ok), all unedited, all PASS. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.

## Measured (trial run, 2026-11-24, a `/tmp` worktree at `0436fd50` + 9b r2 trial, never committed or pushed)
- 9b r2 state: green exit 0, **1141 pass, 0 fail**.
- Trial: green exit 0, **1142 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count over 9b r2: 3 files, **61+ 1− (62)**, per the table.
- s9c: **6 ok, SMOKE PASS** at 390 (64 px cells: stairs 1440 light px, floor 0) and 360 (48 px cells: 810, 0). s9b 14 ok, s9 12 ok, s8 16 ok, s8c 8 ok, s6d 14 ok, S0 14 ok, all PASS; AUDIT PASS.
- Mutation: with the 9b-only `board.ts`, the named test fails (no marker cmd) and smoke steps 2 and 3 fail at both widths ("stairs 0 floor 0").
- Trial patch: `/workspace/share/s9c/s9c-trial.patch` (sha256 `c4f13ee5c02547e9fb152a392670c7bde81994a05d94087ef1c816d8bd76f1d3`, 100 lines, 3 files, a diff over 9b r2; it excludes `handback/`). On a fresh `0436fd50` worktree with the 9b r2 patch applied, it applies cleanly, green gives 1142/0 and s9c passes.

## Baseline republish (baseline-08b)
- No new page and no baseline source change: the baseline build uses the play stage's board, so a rebuild of the existing baseline page from the 9c merge shows the markers on `?scene=shop` (and on every link in the walk).
- Needs: CoS asks the CEO; publish only on the CEO's typed OK via CoS (the builder never publishes or pushes gh-pages); then QA's post-publish walk check on a phone at 360 width: the stairs at c1,r4 show before the hero moves, and the walk downstairs still works.

## Carries
**Closed here:** the link-visibility finding (CEO phone runs, via QA/CoS).
**Still open, not 9c scope:**
- Optional info row "Stairs to <stage name>" for a tapped link cell (EA ruling: optional; left out, as it needs a tap path in `match.ts`/`hud.ts`).
- Starter-frame art for link markers, when the starter set has frames for them; the maker's stage editor showing markers.
- From 9b: `levels.ts` L64 unreachable narrowing; `match.ts:80` `landed('')`; the DSK K6 slice-on-import note.

## EA ruling (2026-11-24, 22:47)
The play-stage board draws a marker on every link cell, read from the stage's link data. No new format fields; the link kind picks the look (stairs, door, gate, or a generic marker). The marker sits above the floor and backgrounds and below units: plain readable shapes, or starter frames if they exist, visible at 360 width. Render only: no rule change, nothing in src/core or src/sim, no tools/maker import in the play stage. Optional: a tapped link cell's info row names it ("Stairs to <stage name>") if cheap; otherwise leave it out.
