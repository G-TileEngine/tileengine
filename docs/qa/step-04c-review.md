# QA review: Step 4c r1 (stages and maps)

**Verdict: NOT OK. 3 must-fixes, all in HANDBACK and the smoke harness.** The product code needs no change.

Branch `step/step-04c-stages-maps-r1-chatA`, tip `4c2f4cb8` (tree `0695ed7f`), code head `73ac4720` (tree `cde99f9d`), base `a85ae665`. Guide: `docs/maker/steps/step-04-stage-editor.md` r6, blob `35cc37db` (the same on main, the base and the tip), 4c at L270-363. CoS report `d3354f9d` was used as a pointer only.

## Must-fix
1. **§ Smoke must paste the ok lines.** Guide L35: "it must print `SMOKE PASS` at 390 and at 360 CSS px. Paste the ok lines in § Smoke." HB:34 says "Checks 1–7 were ok at 390 and at 360 each time" instead. Fix: in HB § Smoke, paste the 14 s4c `ok` lines and `SMOKE PASS` from one solo run, then keep the 3-run and CPU-burn note.
2. **Name every file over its cap.** L319 makes caps "guidance only, the same rule as 4a", and the 4a rule at L141 says "A file may go over its cap if the total stays within 400; the hand-back says which file and why." HB:53 and HB:62 name only `tools/maker/rooms.ts` (136 vs 60). Also over their caps (insertions+deletions): `src/editor/stage/resize.ts` 63 vs 60, and `src/project/load/read-project.ts` 8 vs 3 (4+/4-: the import line, the `mapAt` declaration, `mapAt[id] = path`, and the push). Fix: add one line to HB § Decisions, for example: "`src/editor/stage/resize.ts` is 63 lines against a 60 cap (crop, floor key and three placement lists in one pure pass). `src/project/load/read-project.ts` is 4+/4- against a 3 cap (the `mapAt` path map the D21 row needs). Total 394 ≤ 400."
3. **Smoke check 8 does not measure the new sheets.** Guide L329, check 8: "Every target is at least 48 × 48 CSS px." The smoke runs `big()` only once, at the end of each `step()` (smoke L24-25). By then every new 4c sheet has closed: the Add stage question, the ⋯ menus, Rename, the Resize steppers and Apply, and the drop list with Resize anyway. So none of them is ever measured, and no check 8 line is printed. I probed every tap with a temporary copy of the smoke (not committed): every visible button and input was 48 px or more at 390 and 360, so the product passes. Fix: in `handoff/steps/tests/s4c-stages-maps/smoke.mjs`, call `big()` after each sheet opens (after `r:add`, each `r:menu:*`, `r:rename`, `r:resize`, and the `will go` list). Collect the result and print it as `8 targets @<width>`. Stay within the 130-line cap.

## Numbers (my own runs on a fresh worktree at the tip)
- `npm ci && npm run green` exits 0: 1065 tests, 1065 pass, 0 fail, 0 skipped. N=2: `stages and maps` and `mapEntryDropped: warns, skips in memory, writes nothing back`. Parity seed 24301 passes.
- **Mutation checks:**
  - Without the `mapEntryDrops` call in `read-project.ts`, the named test fails.
  - Lanes filled with 7 instead of 0, and `cols` left unset in `resizeMap`, each make `stage-rooms` fail.
- **G7:** the guide L340 command ("as in 4a", L166, with the s4c smoke dir) plus `':!handback/**'` gives 9 files, **382+12=394**, at both the code head and HEAD. The excludes match the guide exactly. No file under `data/templates/`, `fixtures/` or `tokens.css` changed, so nothing is hidden from the count. Per file: 63, 49, 14, 8, 77, 23, 18, 6, 136.
- **Smokes** (`/usr/bin/google-chrome`):
  - s4c (69 lines, no `waitForTimeout`): solo 2/2 SMOKE PASS (7 ok at 390 and 360); under 8 CPU-burn loops 3/3 pass.
  - s4a 16 ok, s4b 16 ok.
  - S0 `d528795e` (unedited) 14/14.
- **No-diff checks:** nothing changed in `tools/play-stage/`, golden `90dde42a`, `fixtures/`, `data/`, `package*.json` or `maker-law.test.ts`. `tools/maker/stage.ts` and `stage-place.test.ts` are unedited, so the `stage.ts:31` pin still matches.
- **Build:** `node tools/maker/build.ts` exits 0 with stamp `1a7f52d22e14`. The export audit is clean: no editor code in `play-stage/`.
- **Merge tree:** onto `origin/main` `c0e0a718` it is clean and gives **`0e430316`**, as predicted. The only difference from the branch tree is main's 4 docs (the 4b record and QA docs).

## Checked OK
- **Rules 1-8 and the model tests:** rename touches `name` only. `deleteMap` is refused through `refsTo`, which names the stages. The last stage is refused with "A game needs at least one stage". Delete removes the stage from `project.stages`, and from `excludedStages` only if that array exists; no file is removed. Resize keeps the top-left corner, and new cells get Floor, `null` and lanes `0`. It writes one D17 row per dropped placement and one D21 row per dropped edge, and a map shared by two stages drops entries in both. The named D21 test covers all 3 guide points (row, `edgeOffMap` at 99,1, in-map edge still blocks; files deep-equal the clone).
- **Step 7 carry:** `refsTo` (`src/editor/stage/rooms.ts:10-18`) walks `project.stages` only and compares `mapRef`. Orphan stage files are ignored (HB:57). HB:57 and HB:66 name the step 7 carry (C3a/C3b). No link field is written.
- **Laws:** no `kind`/`formatVersion` literal (the stage-rooms scan uses the r2 regex). There is no new empty catch, rAF or interval. The 6 s toast `setTimeout` follows step 2's pattern. One undo snapshot means bounded memory (HB:59). No play-stage edit. Every `r:*` act has a branch, so there are no dead buttons. The 6 shots show the screens the guide lists (L357).

## Non-blockers
- **Seed copy (HB:49, HB:56; `rooms.ts:19-30`):** `addStage` copies the first listed stage's numeric seed. Rule 6 (L290) lists only the ids, `mapRef` and names. But the Empty template has no seed, and Done-when L355 says Test must play a new stage. The deviation is documented and explicit in data, so I accept it. CoS/UX should confirm, or have Empty ship a seed.
- **Raw codes in the UI (`tools/maker/rooms.ts:42-44`):** the drop list says "playerSpawns 0 at 0,8 will go", and after confirm the rows say "placementDropped playerSpawns 0 outsideMap". These are format names, not words a user knows. This is a UX wording carry, since the guide doesn't word it.
- **Unreachable fallbacks and zero defaults:**
  - The `mapAt[id] ?? \`maps/${id}.json\`` fallback in `drops.ts` is unreachable from `read-project.ts`.
  - `resizeMap` falls back to `cols`/`rows` 0 when they are missing.

  Both are format-invalid cases only.
- **Map delete is session-only:** a deleted map comes back after a reload, because files stay (Rule 8) and the Maps list is one row per file (HB:58).
- **HANDBACK nits:** HB:3 still has the "PR: opened by Chief Of Staff" boilerplate. HB:33 Chrome is `/usr/local/bin`; I re-ran with `/usr/bin`.
- **4a/4b carries still open:** `chosen()` duplicate, uncapped stage undo, the plant without `try/finally`, the talk `createdAt`, and the line-number pin.
