# QA review: catalogue rev 30 + demo re-cut (box-only, for step 5c)

QA & Build Guard, 2026-11-20. Read-only; no reviewed file edited; all runs in `/tmp/q` copies (TMPDIR=/tmp/q).

## Verdict: NOT OK (one push blocker; catalogue content OK)
The catalogue and the re-cut data are correct. As staged, the re-cut is red: `npm test` fails 1 of 1065 (the r29 slice pin), and the fix is a `tests/` edit that must ship with it.

## Findings
1. **Blocker: `tests/project/demo-slice-pin.test.ts` L5–L8 pin r29.** On the re-cut, `npm test` gives 1064 pass and 1 fail. The only failure is `demo slice pin: … rev 29 slice` (actual `fe646b92…`, expected `8547ed0a…`). `npm test` failing stops the green chain, so I ran the remaining gates separately; typecheck, lint, deps, check:state and check:law all exit 0. Fix in the same push, named in the PR as a deliberate re-pin (3 lines; the diff is then not json-only):
   - L5: `// sliceOf(behaviours.json 583f7e21, IDS)`
   - L6: `test("demo slice pin: catalogue/slice.json is the rev 30 slice, byte for byte", () => {`
   - L8: expected hash `fe646b927da86b05722ddb9272170a2ec0a62c8e44e94bcb0fa7371381ed7b3f`
2. **Should-fix (Librarian): `behaviour-library/_src/validate.py` L428 and L430 crash on a non-string goal.** A plant of `goal: ["move"]` throws `TypeError: unhashable type: 'list'`. It still fails closed (rc 1) but prints no message. Fix:
   - L428: `if not (isinstance(b.get("goal"), str) and b["goal"] in GOAL_ENUM):`
   - L430: `elif "goal" in b and not (isinstance(b["goal"], str) and b["goal"] in GOAL_ENUM):`
3. **Push scope (CoS).** The step 5 guide on main `cf699bba` L95 says "Only `.json` goes under … `behaviour-library/**`". Push only `behaviour-library/behaviours.json`. `_src/` (82 files, 13,395 lines of `.py`), `_audit/` and the `.md` files stay box-only. Otherwise the G7 exclude `':!behaviour-library/**'` would hide build logic.
4. **Doc gap: clip_cues.** In setup 03, `clip_cues` is `{source:"user", value:false, rev:1}`, the shape D20 prescribes (DSK L67) and the same shape as `piece_count`. But D20 makes it conditional ("if `clip_cues` true shows cues the old demo didn't"), and no code reads `clip_cues` today (0 hits in src/tools/tests at `a6538ee`). So the edit is pre-emptive. It is harmless (golden unchanged), but its reason isn't recorded anywhere. Add to gaps §36 (or the push note): "Re-cut: `clip_cues` answered `{source:"user", value:false}` per DSK D20's exception, pre-emptively: no renderer reads it yet, so the demo keeps the old no-cue look when one does."
5. **alias_of fit: data only, no code reads it.** `alias_of` has 0 hits in src/tools/tests. Today the alias behaviour is carried by code that already exists: the adapter never reads `damage`, and `src/project/load/read-project.ts` L57 warns `layerNotApplied` → `unit_atk` (hard-coded for basic-attack). The step 5 `wired.ts` list leaves out `basic-attack.damage`, so the 5b/5c panel hides it. Showing "= unit attack" as a link to Attack, or making L57 generic over `alias_of`, would need 5c code. Nothing in 5c's guide needs it now. The readers accept the new fields: the fixture loads with an empty report.

## Verified
- **`behaviours.json`:**
  - sha256 `583f7e21…` and catalogue_rev 30 match.
  - My own counts: 65 behaviours, 570 knobs, 363 menu steps (`menu_order`), 36 bans (`banned_combos`), 40 presets. They equal validate.py's own counts.
- **D23 goal assignment:**
  - D23 is DSK L71 on main, sha256 `bd423f8f`.
  - All 40 primaries have `goal`, split move 3 / attack 12 / defend 2 / support 7 / status 7 / spells 7 / ai 2. The other 25 have none.
  - The enum `move|attack|defend|support|spells|status|ai` equals D23 and the step 5 guide `cf699bba` L67 (card titles in that order, then Other abilities; absent or unknown goes to Other, never hidden, no report row).
- **Goal validation plants (temp copies):** each failed with ERRORS 1.
  - Goal dropped from `heal`.
  - Goal added to `terrain`.
  - `teleport` goal set to `"Move"`, and separately to `null`.
- **SCHEMA Rev 30 table (L389–403) vs `behaviours.json`:** the id→goal table (40 ids) is equal. Ambiguous picks are in SCHEMA L403 and gaps §36 items 1–6: barrier-payoff, summon-unit, sword-lifecycle, objective-contest, reach-extension, and the brief's ai examples, which are not primaries.
- **EA S1 Q5:** the source is `docs/maker/data/s1-project-load.md` L555 on main (also L403 and step-01 guide L163): "`unit_atk` is the only source … mark it `= unit attack`". `basic-attack.damage` has `alias_of: "unit-roster.unit_atk"`, label `Damage = unit attack`, default 1. Type, min/max/step and rev 1 are unchanged. It matches.
- **Librarian checks rerun:**
  - validate: 0/0/0 on the live file and on rev22–29.
  - Dry rebuild (copy, `BL_OUT=/tmp/q/bl`) is byte-identical for `behaviours.json`, `CATALOGUE.md`, `README.md`, `catalogue_state.json` and `changes.json`.
  - breaktest30: 0 failures. breaktest29: 0 failures (runs on the rev29 backup).
- **Re-cut data:**
  - Template and fixture both declare `catalogueRev` 30.
  - Hashes match in both: slice `fe646b92`, project `61d38880`, setups `ddcfde9f`/`61e2f175`/`7611a3d8`/`63d1e61e`/`7fc9d6b4`.
  - Staging `slice.rev30.json` equals the template slice.
  - `sliceOf(live behaviours.json, the 8 demo ids)` reproduces `fe646b92` byte for byte.
  - The slice diff is only rev 30, the damage label, description and `alias_of`, and `goal` on the 3 demo primaries (basic-attack and line-shot attack, barrier-line defend).
  - Setup diffs: `catalogue.rev` 29→30, plus clip_cues in 03.
- **Parity:**
  - `(a) parity: seed 24301 … equals the 1a golden` passes, as does `Test on the demo template matches the parity golden`.
  - `tests/tools/golden/demo-parity.json` sha256 is `90dde42a`, untouched.
  - `fixture clean, and slice-of is byte-equal` passes.
- **Diff vs `a6538ee`:** 14 files, all `.json`, 38 insertions and 26 deletions. Nothing under src/tools/tests. Main has since moved to `37f42de` with docs-only commits, so there is no overlap.
