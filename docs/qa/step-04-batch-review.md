# QA review: maker step 4 batch (stage editor guide r2, step 3 r8, DSK rulings)

QA & Build Guard, 2026-11-19, Europe/London. Read-only. No edits to the guides or any other bot's files, and no GitHub writes. Repo `/workspace/tileengine-repo`: `git fetch -q origin`. `origin/main` is still **`772f7aa27e0e27333ef54bf9dd68641a952b959c`** (`docs(maker): step guides 0-3 cold-builder revision…`, 00:08 Europe/London). That commit is docs-only on top of `9fc49890` (S0 smoke refreeze). Floor is still **1036**. Step 2 and step 3 have not merged. The local checkout of this clone is detached at `82326beb` (ED-E6 kit, not main); all line checks below are against `origin/main` = `772f7aa2`.

Share copies in `/workspace/share/maker-spec/` are byte-identical to `/workspace/tileengine/docs/maker/steps/` for the two guides. This doc is local for CoS to push.

Checked (sha256, lines; all match the request):

| File | Rev | Lines | sha256 |
|---|---|---:|---|
| `/workspace/share/maker-spec/step-04-stage-editor.md` | r2 | 344 | `006d3f96f951e2d7bc5b336d62196342a37133024e8f5ae5394fd1d757668cf8` |
| `/workspace/share/maker-spec/step-03-test.md` | r8 | 98 | `12e750b85d970d765c406ede33101daddea2363bbd58afd710e88c6b0fbc19e1` |
| `handoff/dsk-rulings/2026-11-17-phase1.md` (as sent) | D10–D16 | 61 | `e977c798d1f3dcade8b108f25ff1ce1cdb18d8d7ac003bde3df2fb2202400cda` |

The DSK path `/workspace/tileengine/handoff/dsk-rulings/2026-11-17-phase1.md` matched `e977c798` (61 lines) at the start of this review. At 00:29 Europe/London the same path was updated to **65 lines**, sha256 `3a5da9cdedf1545636376fc15e4357a9c9cd4d9c61d3ce90f857740d5038f237`, adding a citation map, **D17** (`placementDropped`) and **D18** (the demo fixture slice is not the true rev 28/29 catalogue). `origin/main` still has the older 51-line file (`5b0fcb6c`). The two guides did not change. Fixes 3 and 4 below fold the new DSK lines in, because that is the file CoS would now push with this batch.

EA R-E1 to R-E5 and the 4c conditions were verified against Engine Architect's ruling text (asked on `772f7aa2`, for draft `79c92d85`). EA's source states **three** 4c conditions, plus that 4c is what lets the two-floor shop exist. There is no fourth EA condition. DSK R-D1 to R-D7 in the 61-line file match D10–D16 in the transcript.

## Verdicts

| File | Verdict |
|---|---|
| step-04-stage-editor.md r2 (`006d3f96`) | **NOT OK** |
| step-03-test.md r8 (`12e750b8`) | **OK** |
| DSK `2026-11-17-phase1.md` D10–D16 (`e977c798`) | **OK** as sent (faithful to the 19 Nov rulings). The live path is now `3a5da9cd`; do not push it with the guide still saying TBD. |
| Build stamp / 400 gate / shots naming | **OK** (shots copy is a push action) |

Overall: not ready to push until the numbered fixes land. Recheck just those.

## Must-fixes (step-04 r2)

1. **`step-04-stage-editor.md:176`.** The What do they do? sheet says `NPCs are friendly.` That contradicts EA R-E5, which says an NPC with no `side` plays **NEUTRAL**, not friendly: it can't be targeted, it doesn't act, and it isn't counted for a wipe. **Change the line** to that wording (or drop the "friendly" claim). Hostile stays out.

2. **`step-04-stage-editor.md:256–261`.** The heading is "EA 4c conditions, plus the shared Rules", but rules 1–5 mix EA's three conditions with UX's own four choices, and those choices are not labelled. They are consistent with the format docs and with DSK (none of them contradict a DSK ruling; 1–40 names matches step 2's project-name rule; format §6.4 already warns above 256×256 and requires `cols*rows` array length). They are not EA or CEO rulings. **Change:** keep EA's three conditions as EA's, in EA's words: (1) rename changes the label only, never the stage or map id; (2) deleting a stage or map that a link targets is refused with a row (4c's `refsTo` covers `mapRef` until step 9); (3) a resize that cuts off a link cell or a placement warns and drops it with a row, the same as R-E4. Keep the two-floor shop sentence where it already is (L8, L248). Then label each of these as **UX choice (Editor & UX Designer, not an EA or CEO ruling):** the last stage can't be deleted; names are 1–40 code points after trimming; new stages and maps copy the Empty template; a resize keeps the top-left corner and fills new cells with Floor (`null` in `layers[].tiles`).

3. **`step-04-stage-editor.md:179`, `:211`, `:235` (talk `max_len`).** Confirmed on `772f7aa2`: project-format L1053, gaps.md §34, and `behaviour-library/behaviours.json` (catalogue_rev 29) all say **140**. The demo fixture `fixtures/demo.tileproj/catalogue/slice.json` is `catalogue_rev` 28 but `talk.line` is **`max_len` 128** and `default` `""`. DSK D18 (live file) says this fixture is not the true rev 28 catalogue (~40 other diffs) and must not be hand-patched on the 128 alone. L179 currently states the limit is **140**, then "read from the slice, never a number in code." The 4b smoke and the "limit equals the slice's `max_len`" test would pass at 128. **Change:** do not hard-code 128 or 140 in code or in the smoke. Say the format and DSK R-D5/D14 are 140, the code always reads `max_len` from the project's slice, and add a named test that the demo slice's `talk.line` `max_len` equals the format's 140. **Name D18 as a 4b go-line blocker:** a prior builder step (not folded into 4b's 400) swaps in the real slice (`data/staging/slice-r28/slice.rev29.json` per the D18 update, or the path DSK confirms), re-answers the demo setups and units as `source:"user"` where play differs from the default, maps the two missing knobs, and keeps the Step 1 parity test green.

4. **`step-04-stage-editor.md:64` and `:259` (row code TBD).** The live DSK file now names the code **`placementDropped`** (D17): a warning, never hard, with `{stageId, list: "playerSpawns" \| "neutrals" \| "enemyPool", index, unitId?, sq, reason: "closedCell" \| "outsideMap"}`. The reader skips the placement in memory and never writes it back; the editor writes the drop only on a confirmed resize, one row per entry. **Replace both TBD mentions** with that name and shape. At L259 also say that a dropped placement's talk setup stays on disk (DSK R-D2 / D11), not hard-deleted. Edges and lanes that fall outside the new size (L260) are not in D17's payload; either reuse a visible warning row and note that DSK has not named a code for them, or get a code before the 4c go-line.

## Go-line blockers

These do not by themselves make the docs NOT OK once the fixes above are in, but no go-line goes out until they are filled.

**Every run:** CoS supplies the base sha and the numeric floor (formula is already in the header).

**Step 3 (already in the guide, still TBD):** base = step 2 merge sha; floor = step 2's final count + N. Step 2 has not merged. Current main floor is 1036.

**4a:** steps 2 and 3 merged; base = step 3 merge sha; floor = step 3's final count + N. R-E1 must already be in step 3 (r8 has it); if not, it is the first lines of 4a and the S0 smoke runs. D17's `placementDropped` must be in the guide (fix 4) before 4a if that run adds the reader warning.

**4b:** 4a merged **and S0b merged**. S0b guide is TBD (Engine Architect owns it: sides from `stage.sides`, skip wipe when only one side is present, colour by side). D18 fixture-slice swap (fix 3) must have landed, with the agreement test green. Path and Dirt only if 4a left them out and they fit.

**4c:** 4b merged; base = 4b merge sha; floor = 4b's final count + N. The link-field shape for `refsTo` stays TBD until step 9 (C3a/C3b). 4c may ship with `mapRef` only, if the hand-back names the step 9 carry. If DSK does not name an edges/lanes drop code, that carry is also in the hand-back (fix 4).

## Checks

| # | Check | Result |
|---|---|---|
| 1 | No button before it works (4a/4b/4c) | **Pass.** Wired controls ship in the same run. Unwired options (Building, Lair, Lava, Wander, Seller, Quest giver, Hostile) are left out, not greyed. Enemy is shown only when `enemyPool.mode` is `"fixed"`. Undo is a named disabled control ("Nothing to undo") when the session stack is empty. Start new sits beside View and ships working in 4a. The last-stage Delete refuses with a stated reason; it is not a dead button. |
| 2 | 400 counted lines per run, shortstat, smoke caps | **Pass.** Hard gate 400 per run, caps are guidance (4a 330, 4b 290 / 320 with Path and Dirt, 4c 335). Shortstat is `git diff --shortstat <base>..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4<run>/**'`. Each smoke has its own 130-line cap and is excluded. |
| 3 | Cold-builder readiness | **Pass, with the TBDs listed as go-line blockers.** Concrete paths, commands, plants, Done-when, S0 smoke `d528795e` at 390/360, per-run smokes at 390/360, 48 px targets (style-spec; 44 px is not a maker-UI floor), Law 12, maker authors data only, no ui-shell code, no game rules in `src/` (editor model in `src/editor/stage/` only), P2 scans stay as they are. `match.ts` on `772f7aa2` has `SIDES` at 15 and `"wolves"` at 67, 80 and 117, as the guide cites. `project.ts:61` still attaches `DEMO_LOOKS` in `openProject`. `looks.ts` 35 / 46 / 49 match. Note (not a must-fix): `openBundled` is currently `openProject(bundledFiles())`, so r8 must attach `DEMO_LOOKS` in `openBundled` itself and not leave it as a passthrough. |
| 4 | UX flags | **(1)** Values confirmed; fix 3. **(2)** Line numbers confirmed. **(3)** TBDs listed above as go-line blockers, not docs OK, except the row-code and slice items which the live DSK file has now answered and the guide must fold in (fixes 3–4). **(4)** The four UX choices are consistent with the format and with DSK, but they are not labelled (fix 2). Resize is a visible warning then a confirm-and-drop with a row, not a silent drop (L259, L269, L301). |
| 5 | step-03 r8 vs r7 (`c1aa1118`, 97 lines, on main) | **OK.** Diff is only R-E1: header, `project.ts` job (cap 5→10) moves `looks: DEMO_LOOKS` from `openProject` (line 61) into `openBundled` and returns `{ canopy: [], braziers: [] }` from `openProject`, guidance caps 290→295, and a named Done-when test that a non-demo (Empty) project has zero canopy and zero braziers while `openBundled()` still draws the demo's. 400 hard gate, P2 scans, and smoke sha `d528795e` are unchanged. |
| 6 | Six reference shots | **Named correctly; source exists; dest is a push action.** The guide names all six under **Shots** (L70–73): `68-tile-tap-menu.png`, `65o2-painting-river-chip.png`, `65c-grid-lines-off.png`, `65i0-npc-picker.png`, `65i-npc-placed-what-do-they-do.png`, `68-unit-tap-edit-basic-light.png`. They are in `/workspace/tileengine/ui-shell/screenshots/` under those names, and not yet in `docs/maker/shots/` or `/workspace/share`. 4c reuses step 2's `24-project-settings.png` and `18-undo-toast.png`, which are already on main. CoS copies the six into `docs/maker/shots/` in the push batch, unchanged. |

## Rulings carried (after the fixes)

- **R-E1:** already in step 3 r8; 4a does it only if step 3 merged without it. Test is the zero-canopy / zero-braziers check. **Faithful.**
- **R-E2:** Floor, Water, Wall; Path and Dirt only with a looks frame table, in 4a if they fit, else 4b, else hidden; no Lava before a hazard step after stealth. **Faithful.**
- **R-E3:** 4b depends on S0b; info row "No enemies: free roam."; not a hard row. **Faithful.**
- **R-E4:** editor hides closed types on a cell with a unit and will not place or move onto a closed cell; reader warning + skip. Code name must become `placementDropped` (fix 4). **Faithful pending that.**
- **R-E5:** no `side` written; Hostile stays out, with or after S0b. L176 must stop saying "friendly" (fix 1). **Faithful pending that.**
- **4c conditions:** all three plus the two-floor shop are in the guide; labelling is fix 2.
- **R-D1–R-D7 / D10–D16:** skeleton, orphans, session undo and the history gap, session grid lines, 140 from the slice, paint in place with a note, default-source knobs. **Faithful.** The live file now also confirms the citation map (R-D1 = D10 … R-D7 = D16).

## r3 recheck (2026-11-19, Europe/London)

`git fetch -q origin`: `origin/main` is now **`af9af6c0be38df30fdf3fe4c351b8a624e2003eb`** (`docs(rebuild): baseline + step 0/1a/1b rebuild records`, 00:36 Europe/London). Diff vs `772f7aa2` is docs/rebuild only. Floor is still **1036**. Share hashes and line counts all match the request. The live DSK file is still `3a5da9cd` (65 lines). r2 of step-04 was overwritten in share; this recheck covers the four r2 must-fixes, the new Go-line order, a key-line pass against the r2 review, and the new files.

| File | Verdict |
|---|---|
| step-04-stage-editor.md r3 (`276bb51f`, 359 lines) | **OK** |
| step-03b-slice-r29.md r1 (`450fd8b9`, 125 lines) | **NOT OK** |
| roadmap.md r11 (`659e8242`, 208 lines) | **OK** |
| DSK rulings `3a5da9cd` | **Consistent** with both guides once 03b's pin lands |
| Six shots | **Present** at `/workspace/tileengine/ui-shell/screenshots/` under the six names the guide cites (L79–80) |

### step-04 r3 — the four fixes and Go-line order

All four r2 must-fixes are in, with the exact wording asked for:
1. L183: "NPCs are neutral: no one can attack them, and they don't act." (EA R-E5). No "friendly".
2. L265–274: EA's three conditions are labelled as EA's; the four UX choices (last stage, 1–40 names, Empty template, top-left Floor resize) are labelled "UX choices (Editor & UX Designer, not EA conditions)".
3. No 128 or 140 appears as a limit. The field and the smoke read `max_len` from the slice. Named test `talk limit: slice matches format` (L243) compares the format sentence to the demo slice and writes neither number. D18 is a 4b go-line blocker (L26, L18, L243), via step 03b-slice-r29.
4. L71 and L268 replace the TBD with D17 `placementDropped` (warning, never hard; the stated payload). A dropped placement's talk setup stays on disk (D11). Edges and lanes stay on the confirm sheet with no new code until DSK names one (L337).

**Go-line order (L22–27) matches:** each run names its own base and floor (TBD until CoS supplies them); Step 3 waits on the step 2 merge; 4a waits on 2+3; 4b waits on 4a, S0b and the D18 slice swap; 4c may ship `mapRef`-only `refsTo` if the hand-back names the step 9 carry. Nothing else of substance regressed. The 4b guidance cap rose 290→300 because the parity test was added to `stage-place.test.ts` (85→95). Shots, 400-line gates, shortstat exclusions, Law 12 and P2 rules are unchanged.

### step-03b r1 — must-fixes

Claims against main `af9af6c0` hold: `read-project.ts:61` uses `options.includes(value)`; `registry.ts:42` already accepts `{value,label}` or a plain string; rev 29 picker options in `behaviours.json` (`bba8c252`) and `data/staging/slice-r28/slice.rev29.json` (`8547ed0a`) are `{value,label}`; the demo fixture on main still uses plain strings, so the three named answers (`shortcut`, `reach_mode`, `caster_class`) would hard-error. D18 is followed (swap, don't patch; re-answer legal old defaults as `user`; drop `barrier-line.length`; map `bonus` → `per_neighbour` + `mode`; keep parity; talk `max_len` 140 in the rev 29 slice). The reader fix is in `src/project/load/read-project.ts`, not under `fixtures/`. Law 12 holds if the one-line fix is the registry.ts:42 check: listed `{value,label}` or string options pass, unlisted and non-string values stay `invalidValue`, no silent default, no empty `catch`. The new test requires an unlisted `shortcut` to be exactly one hard `invalidValue` and to fail without the fix. S0 smoke `d528795e` at 390/360 is required. P1/P2/P3 (`tests/project/load/law12.test.ts`, `one-parser.test.ts`, `version-reject.test.ts`) are covered by `npm run green` but are not named; add a Done-when line that they stay green and that the reader fix introduces no `JSON.parse`, `formatVersion` or `kind ===` (P2 scans this file).

1. **Fixtures exclusion (must-fix).** Excluding `fixtures/**` (+14/−1 counted; slice JSON about +3.7k raw) is acceptable **only** with a standing test *outside* `fixtures/` that a later hand-edit cannot satisfy. Today's "fixture clean, and slice-of is byte-equal" test rebuilds a catalogue *from the fixture slice* and checks round-trip idempotency, so a hand-edit still passes. `slice-of.ts` on main is the claimed generator (sha `46f42e33`), and `slice.rev29.json` is a real extract from `behaviours.json` rev 29, but **neither file is in the git repo**. **Change L36, L90 and L114–116:** commit the catalogue (`bba8c252`) or a frozen extract (for example `data/` or `tools/project/slice.rev29.json`, not under `fixtures/`), and add a named test outside `fixtures/` that `fixtures/demo.tileproj/catalogue/slice.json` is byte-equal to `sliceOf(that committed source, IDS)` or to sha256 `8547ed0aeb7357d37ca96cdaba51dc046a1b260443027d9dae180f18fd98dab3`. The builder must not hand-edit the slice. Until that pin exists, do not exclude `fixtures/**` from the 400 gate.

2. **`step-03b-slice-r29.md:3, :7–:9, :114`.** Base and floor are still TBD on a step 3 merge, and L3 still cites main `772f7aa2`. This work is a fixture swap plus one reader line; the trial already ran on that code at **1037/0**. Current main is `af9af6c0`, floor still 1036. **Change:** set **Base commit** to `af9af6c0` (or later if main moves) and **Test floor** to **1036 + N** (trial N = 1). Drop the hard need for steps 2 and 3. The S0 smoke is required. Step 3's `?project=` smoke runs only if that smoke is already on the base; otherwise § Smoke says so. 03b is a 4b blocker and should not wait on the unbuilt maker.

### roadmap r11

Diff vs r10 (`f36574ef` on main) is the revision line plus the six Librarian rows only (demo extras / rev 30; tool-swing; 35c vendor; C4a walk knobs; C6a noise; C6b objective-walker and `lossPct`). The wording matches the Librarian's 19 Nov answers. **OK.**

### Open DSK questions (neither blocks)

- `unit-roster.team_colour` (default `null`, no `no_default_reason`): does **not** block step-03b or step-04. 03b may leave the demo answer as `source: "default"`; 4b does not write unit-roster.
- Re-answer legal old values as `user`, illegal fake-slice values take the rev 29 default: does **not** block step-03b or step-04. 03b already implements that split and may go ahead unless DSK later says otherwise.

## delta recheck (2026-11-19, Europe/London)

`git fetch -q origin`: `origin/main` is still **`af9af6c0`**, floor **1036**. Share hashes and line counts match: step-03b r3 `dcc2bfc2` (136 lines); step-04 r6 `ca38abbf` (384 lines); roadmap r11 `659e8242`; rulings **`24cba61e`** (68 lines) at `/workspace/tileengine/handoff/dsk-rulings/2026-11-17-phase1.md`, superseding `d94f683c` (same 65 lines of D10–D20; only D21 changed). D21 is now edges only: `mapEntryDropped {mapId, field: "edges", index, reason: "outsideMap"}`; `logic.lanes` is a per-cell `int[]` and is cropped like terrain (new cells `0`, no rows).

| File | Verdict |
|---|---|
| step-03b-slice-r29.md r3 (`dcc2bfc2`) | **OK** |
| step-04-stage-editor.md r6 (`ca38abbf`) | **NOT OK** (one leftover line) |
| roadmap.md r11 (`659e8242`) | **OK** (unchanged since the r3 recheck) |
| DSK rulings `24cba61e` | **OK** — D19–D21 as cited below |

### step-03b r3 — the two fixes, D19/D20, picker tests

Both r2 must-fixes are in. (1) `tests/project/demo-slice-pin.test.ts` (L94, cap 12, measured +10) sits outside `fixtures/` and asserts sha256 `8547ed0a…` of the fixture bytes, so a hand-edit fails (the old byte-equal test still passes; checked on the trial with `max_len` 141). Fixtures exclusion is therefore acceptable, and the pin test counts toward the 400. (2) Base is `af9af6c0` (or later main at the go-line), floor **1036 + N**, no wait on step 3. The S0 smoke `d528795e` is required at 390 and 360; the step 3 smoke only if that file is already on the base.

D19 and D20 match the live `24cba61e` text (identical to `d94f683c` for those two). Rule 8: no `noDefault` check in `src/project/` today (confirmed on `af9af6c0`); 03b adds none; whoever later adds `noDefault` must add the `nullable: true` exemption. `team_colour` stays `{source:"default"}`. D20: the 5 legal values become `user`; the 7 illegal ones take the rev 29 default; `clip_cues` stays default because nothing in `src/` or `tools/` reads it (confirmed). Parity must stay green unchanged: if it fails, stop and do not regenerate the golden. Done when requires the ✔ line, the golden sha `90dde42a…` equal on base and tip (confirmed on `af9af6c0`, and the test is at lines 16/23), and an empty `git diff --stat` on `tests/tools/golden/`. The picker test covers a listed value (demo loads clean) plus four rejects: unlisted string, `3`, `true`, and `{value:"all-menu"}`, each exactly one hard `invalidValue`. That matches Law 12 and `registry.ts:42` (the `typeof value !== "string"` test stays). Counted size is **+26/−1** over 3 files (reader +1/−1, picker +15, pin +10), within 400. The header still cites `d94f683c`; D19/D20 are unchanged in `24cba61e`, so this is not a must-fix.

### step-04 r6 vs r3, and the r5→r6 delta

r5 was overwritten in share; r6 was checked from the claimed r5→r6 edits plus the D17/D21 rows and caps. The r6-only edits are as claimed: the doc cites `24cba61e`; 4c Rule 3 (L285) and Rule 7 (L291) make `field: "edges"` only, crop lanes with `0`, and give no lane row; the `resize.ts` row (L309) lists edges to drop and lanes to crop; 4c Rulings needed is **None open**, with the step 9 `refsTo` link-shape item relabelled as a carry (L362). Caps are 4a **380** (370 without conditional R-E1), 4b **300**, 4c **378**, each ≤ 400. D17 is in 4a (`drops.ts` `placementDrops` cap 30, `read-project.ts` call cap 5, named test cap 35). D21 is in 4c (edges only, cap 20+3, test cap 30). The **Reader side on main** claims (L77–85) hold on `af9af6c0` (same code as `772f7aa2`): `resolvePlacements` / `place` already skip off-map and closed cells; `grid.ts:53–55` already skip off-map edges; `logic.lanes` is a per-cell `int[]`; `readProject` does not yet emit these rows. The four earlier r3 fixes are intact (neutral NPC copy; UX 4c choices labelled; no hard-coded 128/140, with the slice-vs-format test; `placementDropped` plus talk setups left on disk; Go-line order unchanged).

1. **`step-04-stage-editor.md:347`.** The 4c Done-when resize bullet still says every edge **and lane** gets a D21 `mapEntryDropped` row. That contradicts Rule 3, L349, and D21 as amended. **Change** the bullet so only edges get a D21 row (`field: "edges"`); lanes stay `cols*rows` with `0` in new cells and give no row, as L349 already says.

One niggle, not a must-fix: L8 still says "About 330 counted lines" and then "About 375", while the 4c cap is 378.

Overall: 03b r3, roadmap r11 and rulings `24cba61e` can go; hold the step-04 push until L347 is fixed. Recheck just that line.
