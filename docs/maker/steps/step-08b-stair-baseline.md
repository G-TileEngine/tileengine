# Step 08b: the stair phone check and no silent party drop

r2, 2026-11-24, Engine Architect (r1 + QA review `docs/qa/step-08b-guide-review.md` b87a2f48: attribution only). One builder run (ChatA) and one QA review, with gates on. It is the second half of step 8 (the split ruled in `step-08-autosave-links.md` r4 L5–10). This file replaces that guide's 8b rows for the builder, rebased onto the merged 8a code. It adds the EA ruling on QA's 8a carry (repro B) and QA's import-style nit. Every number below comes from a trial run on `10ca0b0a` (see Measured).

Step id: `step-08b-stair-baseline`. Revision: r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `10ca0b0ab587f0ebd7effde3db3f704e921123c5` (`10ca0b0 QA: step 8a r2 review (OK TO MERGE, PR #96)`, 2026-11-24 08:51 London). It is docs only over the 8a merge `a0c1dad28e8608318a8e67188d2150f0aa333bde` (tree `219640068d7f51562741a3c66f519f495f1d90a7`): it adds `docs/qa/step-08a-r2-review.md`, 31 lines. Checked on `origin/main` in a fresh `/tmp` clone. If CoS names a later main in the go-line, use that main and its test count.
**Test floor:** **1122 + 3 = 1125.** The base measures 1122 pass, 0 fail (`npm ci && npm run green` in a fresh `/tmp` clone of `10ca0b0a`, exit 0). N = 3 (named tests 6, 10, 11 below).
**Needs:** step 8a (merged, `a0c1dad2`). **Blocks:** the stair phone check (CoS, after merge); step 14 reuses the party carry.
**Smoke:** no new smoke. Rerun 8a's `handoff/steps/tests/s8-autosave-links/smoke.mjs` (sha256 `0de37442…`, port **8810**, unedited) with 8b's handback folder, plus S0 and the export audit (Done when).

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-08b-stair-baseline-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-08b-stair-baseline/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green, § Smoke and § Export audit. Label the **Code head** apart from the docs-only **tip**. Don't commit a raw test log or the smoke's shots (8a's four shots are already on main).
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS. **The builder never publishes the baseline page**; CoS serves it for the phone check.

## Goal
In plain words:
- **The phone check.** The baseline page gets a second scene, `?scene=shop`: two floors joined by stairs, with two more readout rows (how many stage changes, and the worst frame in the 3 frames after each one).
- **No party member is lost at a link** (EA ruling on QA's 8a carry, repro B). If a member doesn't fit at the arrival cell or the spawns, it goes to the nearest free walkable cell on the stage. Only if the stage has no free walkable cell at all does it stay off the board, and even then it stays in the party with its hp, so the next autosave still has it. The play stage shows one notice row when that happens. The link is never refused (that would trap the player).

**Not in 8b:** pre-warming the next stage (roadmap L83: only if the phone check misses); a way to bring an off-board member onto the board mid-stage (it rejoins at the next link with room); any save-shape change.

## Read first (lines checked on `10ca0b0a`)
1. `docs/maker/steps/step-08-autosave-links.md` r4 (sha256 `354038813c96a21af5814398082eacc3f2b0ded12d7357ebc906ea0ec70b41ee`): L111–115 Rules 7 (the phone check), L166 test 6, L204–208 the 8b Done when. This file supersedes those rows for the builder.
2. QA: `docs/qa/step-08a-r1-review.md` L73 (repro B, the party drop) and L29–60 (the repro script, case B); `docs/qa/step-08a-r2-review.md` L27–29 (the import nit, the open carry, the standing non-blockers).
3. Merged 8a code:
   - `src/rules/session/links.ts` L7–17 `arrival()`: base cells (back link, then spawns), then a N E S W flood **through `free` cells only** (L15, QA 8a r1 must-fix 1), so a free cell walled off from the arrival cell is never found.
   - `tools/play-stage/project.ts` L96–108 `arriveIn`: L104 `free` and `arrival(…, party.members.length, free)`; L107 `chosen` = every member, but only `next.length` spawns exist, so members past that are never placed.
   - `src/project/read/placements.ts` L21–25: chosen past the spawns are skipped with the existing notice **`notPlaced`** (L25), which already reaches `world.notices` (`src/sim/world.ts` L58–64). Nothing shows it.
   - `tools/play-stage/match.ts` L122 `party()` reads only units on the board, so an unplaced member is gone from the party and from the next autosave. L130–144 `view()`.
   - `tools/play-stage/hud.ts` L3–8 `HudView`, L11 `css`, L13 the DOM, L26–38 `render`. `tools/play-stage/load.ts` L23 `PlayDocs`.
   - `src/core/grid/grid.ts` L49 `inBounds` (on `Grid`, L89).
   - `src/rules/session/party.ts` `partyOf` / `carryInto` (unchanged; `carryInto` keys hp by every member, so an off-board member's hp carries).
4. Baseline: `tools/baseline/page.ts` L18 `startMatch(opened.docs)`; `readout.ts` L1, L15–17; `checkpoint.ts` L18–22 `shopFiles()` / `openShop()` (merged in 8a); `fixtures/shop-stairs/` (merged in 8a; shared map 6 × 6, both stages spawn 0,4, stairs 1,4); `tests/tools/baseline-page.test.ts` L11 `BAD`; `docs/qa/baseline-06c-phones.md` (sha256 `37b95e53…`) L31, the pass rules.
5. `tests/tools/autosave-links.test.ts` L1–7: 18 imports joined on 7 lines (QA nit).
6. D28 (`handoff/dsk-rulings/2026-11-17-phase1.md` L76): `party.members` = living units, each `unitId` once, hp ≥ 1. An off-board member is alive, so the shape already holds it. **No format change.**

## Rules
1. **Stair phone check** (`tools/baseline/`; data only, no game rule; as r4 Rules 7):
   - `page.ts`: `?scene=shop` opens `openShop()` and passes a `travel` that records the swap at the current gap index, rebuilds `#board` and `#hud`, and calls `startMatch(arriveIn(shopFiles(), from, to, party).docs, …, travel)`. The default scene still calls `startMatch(opened.docs)`; the host-rAF wrapper is untouched (2 `requestAnimationFrame` hits).
   - `readout.ts`: optional `swaps` and `scene`. With `swaps`, two rows follow the GC line: `stage changes N` and `worst ms in 3 frames after a swap X` (the max of the 3 gaps from each swap index). The title shows the scene (`Shop stairs (?scene=shop)`); every other line is unchanged, and the post-swap gaps stay in the p50/p95/max/dropped/over-50 counts.
2. **Never drop a party member silently, never refuse the link** (EA ruling):
   - **Spill** (`links.ts`, the rule's home): `arrival(…, size, free, inside = free)`. The fill floods N E S W from the first arrival cell through every cell `inside` accepts and takes the ones `free` accepts, in the same order as today's fill. With no `inside` it is 8a's function (test 2 and its expected cells pass unedited). The 512 guard stays.
   - `project.ts` `arriveIn`: passes `inside = (sq) => grid !== null && grid.inBounds(sq)`, so the flood is bounded by the map (its cost is the map's cell count, not 512; a null grid floods nothing). `bench = party.members.slice(next.length)`: the members still without a cell, which only happens when the stage has no free walkable cell left. `chosen` stays every member, so `resolvePlacements` raises the existing `notPlaced` notice for them. The docs carry `bench` when it is not empty.
   - `load.ts`: `PlayDocs.bench?: readonly {unitId, hp}[]` (play-stage docs only; not a file format).
   - `match.ts` `party()`: the on-board party from `partyOf`, then each `bench` member not already in it, in order, with its carried hp. So `match.party()` and the autosave keep it. `view()` adds `note`: `Not placed: N of your team had no free cell. They stay with the party.` when `bench` is not empty, else `null`.
   - `hud.ts`: `HudView.note: string | null`; one `<div id="note" role="status">` after `#top`, styled at the **end** of `css` (absolute, under the top bar, hidden by default). Don't put it inside the `#top` rule: `play-stage-p19.test.ts` reads `#top{…top:0;height:${HUD_TOP}px;}` with a regex. `render` shows or hides it.
   - **No new notice code, no new report code, no save-shape change.** `notPlaced` is reused. If the build seems to need either, stop and report to EA (DSK owns formats).
3. **House style** (QA 8a r2 nit): `tests/tools/autosave-links.test.ts` L1–7 become one import per line (18 lines, plus the `readout` import for test 6). Don't join lines anywhere to fit a cap.
4. Game rules stay out of `src/core` and `src/sim` (no edit there). One clock: no new rAF, timer or loop. UNIT and TILE stay the only targeting pipes. The play stage never imports `tools/maker`. No `JSON.parse`, `formatVersion` or `kind ===` text in `tools/baseline/` or `tools/play-stage/`. `Object.hasOwn` or `Map` for keyed lookups. Don't touch `tools/painter-proto/` or `tools/ui-shell/`. No new dependency; works offline.

## Build (caps are counted lines, insertions + deletions)
| File | Job | Trial | Cap |
|---|---|---|---|
| `src/rules/session/links.ts` | `inside` flood, doc line (Rules 2) | 6 | 8 |
| `tools/play-stage/project.ts` | `inside`, `bench` (Rules 2) | 4 | 5 |
| `tools/play-stage/load.ts` | `PlayDocs.bench?` (Rules 2) | 2 | 2 |
| `tools/play-stage/match.ts` | `party()` keeps `bench`, `view().note` (Rules 2) | 6 | 8 |
| `tools/play-stage/hud.ts` | the note row (Rules 2) | 7 | 9 |
| `tools/baseline/page.ts` | `?scene=shop`, travel, swap marks (Rules 1) | 15 | 18 |
| `tools/baseline/readout.ts` | the two rows, scene title (Rules 1) | 5 | 6 |
| `tests/tools/autosave-links.test.ts` | imports split (Rules 3), tests 6, 10, 11 and their `nook` helper | 44 | 50 |

**Count command:** `git diff --shortstat <base>..HEAD -- . ':!handback/**'`.
- Hard gate: **400**. The caps sum to **106**, and the trial used **89** (8 files, 63 +, 26 −).
- Going over any one cap is stop-and-report, not a quiet overrun. Lines are long, in house style; don't wrap or split lines to dodge a cap, and don't join lines to fit one.

## Named tests (all in `tests/tools/autosave-links.test.ts`; DOM-free imports only)
Fixture: `shopFiles()` (S1, S2, hero `H`, raider `R`). `nook(open)` = the shop with the shared 6 × 6 map open only at the listed cell indices (index = r × 6 + c) and a fixed raider enemy on S2's stairs 1,4.
6. **`step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame`**: `openShop()` opens with no error and no contest; the two stairs entries point at each other; the readout with `swaps [2, 5]` over `[16,16,40,61,16,16,30]` ends `stage changes 2` / `… after a swap 61.0`, still counts the 61 in `over 50 ms 1 of 7`; without `swaps` there are no extra rows.
10. **`step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip`**: `nook([24, 25, 29])` (0,4, 1,4 and a walled-off 5,4), party H 20 + R 2 from S1: H on 0,4, R on **5,4** (8a's flood never reached it), `match.party().members` equals the carried members, `view().note` is null; `writeAutosave` then `readAutosave` gives both members back.
11. **`step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row`**: `nook([24, 25])`, same party: R is not on the board, `docs.bench` is `[{R, 2}]`, `match.party().members` still has R with hp 2, `world.notices` has `notPlaced`, `view().note` starts `Not placed: 1 of your team had no free cell`; the autosave round-trip keeps R.

8a's nine named tests and step 7's six must still pass unedited, test 2's expected cells included. Only the import lines of the test file move.

## Smoke and audit
- `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s8-autosave-links/smoke.mjs . 8810 r1 step-08b-stair-baseline`: 16 ok lines (8 at 390, 8 at 360) and `SMOKE PASS`. The shots go to `handback/step-08b-stair-baseline/r1/`; don't commit them.
- S0: `handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`, frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`: 14 ok lines and `TOUCH SMOKE PASS` (the HUD changes).
- Export audit: a release `tools/play-stage/build.ts` build, the baseline build and the maker build's `play-stage/` tree contain no `tools/maker`, `src/editor`, `tileengine/saves` or `session-save` text and no `catalogue.json.js` / `behaviours.json` file (the trial's script: `/workspace/share/s8/s8-audit.mjs <worktree>`, sha256 `8bfef76b…`). Paste the command and the empty hit list.

## Must NOT
- No edit to `src/core`, `src/sim`, `src/types`, `data/`, `fixtures/`, `behaviour-library/`, `tools/maker/`, `tools/painter-proto/` or `tools/ui-shell/`. No edit to an existing test or smoke except the import lines of `tests/tools/autosave-links.test.ts`.
- No new notice, report or refusal code; no formatVersion bump; no save-shape change. No refused link. No silent party drop: a member is placed, spilled, or kept on the bench with the note.
- No game words ("shop", "home") in `src/` or `tools/play-stage/`. No second rAF, timer or loop. No pre-warming. No baseline publish or gh-pages push by the builder.

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1125** or more, with `one-parser.test.ts`, `baseline-page.test.ts` and `play-stage-p19.test.ts` unedited. `npx tsc --noEmit -p tools/tsconfig.json` adds no error (the base has 3: `tools/effect-designer/page.ts` L101 and `tools/maker/home.ts` L85 ×2; leave them). Quote the count command; the total must be 400 or less with every cap kept.
- **§ Green:** the `ℹ tests / pass / fail` lines and the ✔ lines of tests 6, 10 and 11.
- **§ Smoke:** s8, 16 ok lines and `SMOKE PASS`. S0, 14 ok lines and `TOUCH SMOKE PASS`. **§ Export audit:** the command and the empty hit list.
- **Not the builder's gate: the stair phone check, after 8b merges.** CoS serves the baseline build at `?scene=shop` on the S21 Ultra and the Red Magic 9 Pro; the CEO walks the stairs (tap the hero on 0,4, then the stairs on 1,4; on the other floor, step off and back) at least 10 times, and CoS reads the DONE readout. It passes on `docs/qa/baseline-06c-phones.md` L31: p95 at or under 16.7 ms, no dropped frame, **no frame over 50 ms, counting every frame after a swap** (so `worst ms in 3 frames after a swap` ≤ 50 and `stage changes` ≥ 10), and no heap growth the new content doesn't explain. If it misses, pre-warm per roadmap L83 (adjacent stages only, discardable) in a follow-up.

## Measured (trial run, 2026-11-24, r1)
A fresh `/tmp` clone at **`10ca0b0a`**, never committed or pushed. The patch is `/workspace/share/s8b/s8b-trial.patch` (sha256 `177f370ed1c32ac842cbc17550f5a8164554137217a154ebf738c52025300e68`, 213 lines; it excludes `handback/`) and applies cleanly to `10ca0b0a`.
- Base: `npm run green` exit 0, **1122 pass, 0 fail**, depcruise clean (176 modules, 500 dependencies).
- With the trial: green exit 0, **1125 pass, 0 fail**, depcruise clean, check:law OK, eslint clean; tsc shows only the 3 base errors.
- Count: 8 files, **63 +, 26 −** (89), per the table.
- s8 smoke on 8810 with the 8b folder: 16 ok, `SMOKE PASS`. S0 on 8797 (sha checked): 14 ok, `TOUCH SMOKE PASS`. Export audit: no hits (131 / 145 / 142 files), `AUDIT PASS`.
- Baseline `?scene=shop`, headless Chrome at 390, 2 runs: `stage changes 1`, `worst ms in 3 frames after a swap 16.7`, p95 16.7–16.8, max 33.3–33.4, 0 over 50 ms, no page error. Box numbers, not the phone gate.

## Carries
**Closed here:** QA 8a r1 L73 / r2 L28 (party drop, repro B), by Rules 2 and tests 10–11. QA 8a r2 L27 (joined imports), by Rules 3.
**Still open (QA 8a r2 L29, not 8b scope):** `levels.ts` L64 narrowing; `project.ts` L102 null grid; the double slot read in `writeAutosave`; resume notes at `openId`'s rev; overlapping autosaves (the maker's `gate` would serialize them).
**New from 8b:**
- A benched member rejoins the board only at the next link with room; there is no in-stage way to bring it on.
- `notPlaced` is a code in `src/project/read/placements.ts` only and isn't listed in `project-format.md`. 8b reuses it unchanged. DSK may list it when the notice table is next edited (no action in 8b).
- The note row has no close button; it stays for the stage.

## DSK questions
None. The D28 `party.members` shape holds an off-board member (alive, unique `unitId`, hp ≥ 1), and `notPlaced` is an existing code.
