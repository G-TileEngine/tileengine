# QA review: Step 5a r1 (units)

**Verdict: NOT OK. 1 must-fix, in HANDBACK only.** The product, tests and smokes need no change.

Branch `step/step-05a-units-r1-chatA`, tip `266a35dfe644cdf7a65d51904f8716b6fcc3dfc4` (tree `f69b943e`), code head `aeedd130eafd738e9e65c0cae02040bc9081a67b` (tree `f7f224a6`), base `37f42de3`. Guide: `docs/maker/steps/step-05-units.md` on main (blob `2e2673e8`, r3b); the branch still has r2 (`015ef02b`). The only guide difference is L249 (docs-only stand-in shots). 5a is L99–148; count command L94–95. CoS report `0bb61177` was used as a pointer only.

## Must-fix
1. **Name every file over its cap.** Guide L95: "the hand-back names every file over its cap and why." Caps are guidance; the hard gate is 400. HB:153 names `tools/maker/units.ts` (162 vs 90), `tests/editor/stage-rooms.test.ts` (11 vs 10) and `tools/maker/rooms.ts` (5+/4- vs 8), plus the extra `home.ts` and `app.css`. It does not name `tests/editor/maker-law.test.ts`, which is 2 insertions and 2 deletions (L16, the stage-or-unit doc scan; L26, the `lawHits(…/src/editor/unit)` assert) = **4 against a cap of 3**. Same class as the unnamed 4c r1 overruns. HB:146 also says "the three over-cap files named."

   Fix: in HB:153, after the `rooms.ts` sentence and before "Extra files:", insert: "`tests/editor/maker-law.test.ts` is 2 insertions and 2 deletions against a 3 cap (the stage-or-unit doc scan at L16, and the `lawHits(…/src/editor/unit)` assert at L26)." In HB:146, change "the three over-cap files named" to "the four over-cap files named."

## Numbers (my own runs on a fresh worktree at the tip)
- `npm test` exits 0: **1070** pass, 0 fail, 0 skipped, 0 todo. Floor 1065 + N=5. Named tests present: `unit skeleton loads`, `empty template stage has a seed` (24301), `units`, `knob widgets`, `resize rows use plain words`. Parity seed 24301 passes. Tip vs code head is `handback/step-05a-units/r1/` only, so the same counts hold at the code head.
- `typecheck`, `lint`, `deps`, `check:state` and `check:law` each exit 0.
- **Mutation checks** (reverted; worktree left clean):
  - Empty-template seed set to 0: `empty template stage has a seed` fails.
  - `say()` restored to the old format names: `resize rows use plain words` fails (`mapEntryDropped`).
  - `applyRole` writes every override, ignoring `perUnitKeys`: `units` fails (`board_cols`).
  - `resetStat` is a no-op: `units` fails (Health stays 12, army inherit is 9).
- **G7:** the guide L94–95 command (with `s5a-units`) gives 12 files, **338+20=358**, at both the code head and HEAD. Per file (insertions+deletions vs cap): `units.ts` (src) 37/60, `widgets.ts` 27/80, `units.ts` (maker) 162/90, `project.ts` 4/10, `rooms.ts` 9/8, s4c smoke 4/2 (the allowed L27/L48 replace; named deliberate at HB:124 and HB:152, not as an overrun), `units.test.ts` 43/55, `knob-widgets.test.ts` 18/40, `stage-rooms.test.ts` 11/10, `maker-law.test.ts` **4/3**, plus extras `home.ts` 38 and `app.css` 1. Without the excludes: 15 files, 430+20. s5a smoke is 74 lines (cap 130, uncounted).
- **Smokes** (`/usr/bin/google-chrome` 156.0.8078.47, port 8802 / 8801 / 8800 / 8799):
  - s5a: solo 2/2 SMOKE PASS (checks 1–8 ok at 390 and 360); under 8 CPU-burn loops 1/1 pass. Ok lines are byte-equal to HB:42–58. Check 8 collects with the name sheet, the editor, the role sheet and the Wolf delete refusal open (guide L129 minimum is the editor and the role sheet).
  - s4c, s4b and s4a: each 8/8 at 390 and 360, SMOKE PASS. Ok lines are byte-equal to HB:63–119.
  - S0 not run: no `tools/play-stage/` change. `touch-smoke.mjs` is still sha256 `d528795e`.
- **s4c edit:** vs base (and `a6538ee1`) sha256 `ea0d674f…` → `d885c3e8…`. `git diff` changes only L27 (`"will be removed"`) and L48 (`"was outside the map and was removed"`). s5a and the edited s4c have no `waitForTimeout`.
- **Pins:** golden `90dde42a` unchanged. Empty template stage ships `"seed": 24301`. `tools/maker/stage.ts:31` is unedited (blob `2a130f3e`); the stage-place pin still matches.
- **Merge tree:** onto `origin/main` `8304a5a2` it is clean and gives **`c9d80e3f7f6dc6fc75bd1511cf7df8ee168b3c30`**, as predicted. Its diff vs the branch tree is exactly main's nine docs/shots files since the base.

## Checked OK
- **5a behaviour:** Units section under Maps; + Add unit copies `data/templates/unit.json`; rename changes `name` only; roles come from the slice and write only `per_unit` keys; Health/Attack show "Same as army" when the key is absent, Reset removes it, and a stat edit reaches `playDocsOf(...).rules.stats`; used-unit delete is refused with both guide lines; unused-unit delete hides the card and leaves the file; one Undo snapshot. The unit editor has no Test button (5b). No `kind` / `formatVersion` literal in the 5a TypeScript (`unit.json` is data). No Look control, no `sprite` write, no `tools/play-stage/` change, no 5b/5c UI.
- **Carry (b):** `who()` / `say()` at `tools/maker/rooms.ts:41–45` match the guide L80–85 strings. The named wording test covers every banned raw name and the listed sentences.
- **Laws:** no new rAF or interval. The 6 s toast `setTimeout` follows step 2's pattern. Slider saves are gated one at a time (HB:150). No empty catch in the new files. `lawHits` is clean on `src/editor/unit` and `tools/maker`. Colour chips use style tokens only. No new dependency. No file over ~500 lines (largest new file is `tools/maker/units.ts` at 162). No CEO / CoS / UX choice is labelled a CEO ruling.
- **Shots:** five 390×844 light screenshots, as named: Units (the seven demo units; + Add unit is below the fold in `01-units.png` but is in the smoke and in `02-name.png`), the name sheet, the editor (Health 9 / Attack 1, Same as army, no Test), the four role chips, and the Wolf refusal.

## Non-blockers
- **Tip also adds five engine-kit `.txt` files** under `handback/step-05a-units/r1/` (`changed-files.txt`, `checks-output.txt`, `stat.txt`, `typecheck-output.txt`, and a 6473-line `test-output.txt`). Delivery names `HANDBACK.md` and the screenshots. Accepted 4a–4c handbacks shipped only those. Step 2 / 2b Delivery says "commit no raw test log." `handoff/HAND-BACK.md` still lists the `.txt` files; later maker practice does not. No token strings in them. **Should-fix:** drop the five `.txt` files from the tip commit. Product files are unchanged after the code head, which holds.
- **HB:121** "Waits are `waitForFunction` only" is true of s5a and the s4c edit, but slightly loose: s4a still has `waitForTimeout(120)` in `tap()` (L14), and both s4a and s4b still have `waitForTimeout(80)` in `press()` (s4a L16, s4b L17), unchanged from earlier steps. **Should-fix:** qualify that sentence.
- **HB:3** still has the "PR: opened by Chief of Staff" boilerplate (`handoff/HAND-BACK.md` L25 wording). No PR yet. Same nit as 4c.
- **Chrome / Node:** HB:38 is Chrome 158.0.8127.36 at `/usr/local/bin/google-chrome`; I re-ran with `/usr/bin/google-chrome` 156. HB:4 is Node v22.23.3; `.nvmrc` pins 24 (this box is v24.22.1).
- **`who()` fallback:** any list other than `playerSpawns` or `neutrals` reads "Enemy" (HB:151). Format-invalid only for a new list.
- **`usedBy` walks live stages only** (`project.stages`), the same as 4c `refsTo`. Delete of an unused unit remains session-only (the file stays), which the guide asks.
- **4a/4b/4c carries left standing:** `chosen()` at `stage.ts:35–41`, uncapped `undo.ts`, the maker-law plant with no `try/finally`, talk `createdAt`, and the `stage.ts:31` pin (unmoved, as 5a requires).
