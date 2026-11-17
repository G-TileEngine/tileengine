# QA review: step-p1-2-battle proto r1 + kit (one pass)

**Verdict: OK TO SEND once the QA pin is in the kit.** The proto is sound. Every behaviour I probed matches the step file. G1 found 10 misses among my 17 plants. The pin `refs/cmp/p1-2-qa-fix-a` (37 lines, one test file) closes all 10. Evidence is in `docs/qa/qa-runs/p1/p1-2/`.

## 1. Identity
- Proto bundle `step-p1-2-proto-r1.bundle` sha da74d264 ✓. Head 861062e2, tree c4bfd7c3, needs 531d58ad.
- Replay on main: bundle 1d2c9004, head **2600bd54**, tree 18869f86, needs 5cb385ba (= origin/main, the expect-base).
- Commit chains: 96c7df3→c6d1322→c082c56→861062e and cabf1ee→c47faf9→ff5d763→2600bd5. Author and committer are G-TileEngine noreply on all of them.
- src/ and tests/ are identical between the two bases (same diff, same ls-tree). 14 files: src 154 lines, tests 124, total 278 (cap ≤320). Pins diff is empty.
- `battle.test.ts` (7f9be6ad) and `battle.parity.test.ts` (200f0b56) are byte-identical to the kit.
- Doc (a7a392f6, 190 lines) and paste (9416515b, 181 lines) have the same body from `## Goal` on (e469a9d5).
- Push list `push-sha256.txt` 0bab4da7: `-c` gives 4/4 OK in the kit and in tree/.

## 2. Gates (sequential; pgrep clean before each; no p95 re-run needed)
| ref | tests | tsc/lint/deps/state/law | smoke/sim/stress vs 5cb385ba |
|---|---|---|---|
| 2600bd54 floor 882 | 882/0 PASS | PASS, deps 128/413 (doc: 122/391 → 128/413 ✓) | SAME / SAME / SAME |
| pin 87e4e3ac floor 885 | 885/0 PASS | PASS, deps 128/413 | SAME / SAME / SAME |

- Sim hashes stage-fixed afc89d56 and stage-weighted b8007292 are unchanged. Stress is unchanged.
- The ℹ lines in main.test.log and ref.test.log differ only in the test count (874 → 882), so chaos and replay are unchanged.
- The ED-E6 worker ran gates on 021903a0 between my two runs. I waited for it each time.

## 3. Plants (G1)
- EA `p1-2-plants.py`: **40/40 caught** (`plants-ea.log`).
- QA `qa-p1-2-plants.py`, 17 risk plants: **7/17 caught on r1** (`plants-qa.log`) and **17/17 with the pin** (`plants-qa-pin.log`).
- Missed on r1. Each one breaks a rule the step file states, with no test behind it:
  - q01: atk 0 still kills. q02: atk 0 is refused and emits no hit. (Rule 4. `unit_atk` 0 is a legal slider value, 0–2.)
  - q03–q07: a bad setup gets through. Cases: atk 1.5/NaN/Infinity, hp 0, hp Infinity, an unknown hitClass, or a bad `stats` entry skipped instead of throwing. (Rule 4 says `RangeError("createBattle: bad setup")`, but no test calls createBattle with bad input.)
  - q08: `unit.died` is emitted before `remove`. (Rule 4 says "remove then emit". It is observable: bus listeners are synchronous.)
  - q11: on overkill, `hit.amount` reports the damage dealt instead of the atk. (Rule 4 says amount = atk.)
  - q15: `snapshot.rules` is not the last key, so `turn` comes after it. (Types block: "(last key)". This changes the saved-text key order.)
- Caught on r1: q09 died twice, q10 state order, q12 HP per instance, q13 attacker removed, q14 rules key without the hook, q16 negative HP, q17 dead units dropped.
- **Pin** `refs/cmp/p1-2-qa-fix-a` = 87e4e3ac (on 2600bd54, G-TileEngine noreply). It adds `tests/rules/battle-qa.test.ts`, 37 lines, 3 tests:
  - bad setup refused (6 cases)
  - atk 0 plus overkill amount, with a died-listener check
  - rules key after turn
- Bundle `/workspace/share/step-p1-2-qa-fix-a.bundle`, sha256 `56730b9df97123f4bb2403d0a10c25843ee8ae7fb6e5f194db4bd0bdcc2b0ce3`. Verify OK. It needs 2600bd54.
- Kit effect: tests 8 → 11, so the floor is Base + 11 = 885. Add the file to the push list and the size table.

## 4. Probes (`p1-2-probes.ts`, on 2600bd54 + P1-1 r6): 19 pass, 0 fail, plus 6 info
- **Kill in the same step:**
  - Overkill (atk 2 on hp 1) gives hp 0 and amount 2, then `hit` and one `unit.died`.
  - The died-listener sees `alive:false` with the cell empty.
  - A second hit is `hitRefused`, with no second died event.
  - Replay rebuilds units and rules.
- **No ghosts (with P1-1 r6):** `targetsFor` from every living unit leaves out the dead one, and a living unit can `walkTo` onto the dead unit's cell.
- **atk 0:** gives `hit {amount 0, hp 9}`, no death, no notice.
- **NaN, Infinity, 1.5, −1 and 0 stats, and hitClass "laser":** all give `RangeError: createBattle: bad setup`.
- **Refusals:** unknown target → `hitRefused`. `interact` with rules → `actionUnsupported`, no change. A same-side hit is allowed, as decision 1 says.
- **Save and restore:** `saveMatch` with rules keeps formatVersion 1. A `rules` key on a world without rules is refused on restore. Wipe gives the same answer on repeated calls, and the driver stops at the first non-null result (driver-phase.ts:33), so it fires once.
- Info R1/R2: `unit_hp` 50 and `unit_atk` 5 are kept with an `outOfRange` note and are not clamped. This is B1 policy. L5 ×3 on 21 gives 63.
- Info K3/F1: see the findings.

## 5. P1-1 r6 on top
- `git diff 1d2f9e88 refs/cmp/p1-1-r6 | git apply --index` on 2600bd54 applies cleanly (12 files, +259/−6). This confirms doc line 175.
- Results: **890/0**, tsc OK, lint OK (with the qa/ probe dir excluded), check:law OK, deps 133/428 with no violations. Walk and targetsFor after a kill: K5/K6 pass.

## 6. Build law, drift, HANDBACK
- **One clock / rAF:** the added src has no Math.random, Date, timers or rAF.
- **Pipes:** the hook aims only through `resolveAim` (the UNIT pipe). Tile aims are refused.
- **Data only:** `btf-defaults/battle.ts` is frozen data plus cites, with no functions or logic.
- **No editor code** in src. The sim lines add no game words except one doc comment.
- **Layering:** rules/battle imports core, state and behaviours types only, and wipeRule avoids importing src/sim.
- **Law 13:** the HP map is bounded by the roster.
- **Drift:** none found. Rules 4–7, decisions 1–2, the bus types and run.ts match the code.
- **HANDBACK §0.6:** the step file requires § Helpers & self-review (line 14, "REJECT without it") and checklist line 160 ✓.

## 7. EA rulings
1. **Decision 1:** the doc documents it as not enforced (lines 43 and 170). No test, src comment or doc line claims a range, side or adjacency check. Probe D1 confirms that a same-side hit is accepted. **QA answer to line 55: OK for r1.** P1-3 owns the filter.
2. **The chaos `rules` key** (doc lines 149 and 174) has no plant. **Carry to P1-5**: plant it once a chaos run sets rules.

## 8. Findings
**Must-fix (kit):** M1. Ship the QA pin file and set the floor to Base + 11. Also update the size table (tests 124 → 161, total 315, within ≤320) and the push list.

**Should-fix (doc wording, no code):**
- S1. A `hit` listener at a kill sees hp 0 while the body is still `alive` on its cell. `remove` and `unit.died` come right after, in the same emit chain (K3). Add one line: "react to deaths on `unit.died`, not on `hit.hp === 0`".
- S2. A `fallbackAt` aim on a dead target lands on whatever is standing at the fallback spot. In F1 it killed wolf#4. This is core UNIT pipe semantics. Add one line saying so, so that P1-3 builds aims without a fallback, or decides deliberately.

**Report only:**
- R1. Knob values out of range are kept with an `outOfRange` note (B1 policy). Bounds are enforced only by `createBattle` (hp ≥ 1, atk ≥ 0).
- R2. Restore ignores a missing `rules` key, so old saves load and HP is rebuilt by replay (decision 2, as designed).
- R3. `wipeRule` is not wired into any driver yet (P1-6 carry, documented).
- R4. Carries: chaos `rules` → P1-5; target filters and `interact` → P1-3; exploit.ts:75 → P1-5 (from P1-1).

## 9. Evidence (`qa-runs/p1/p1-2/`)
- Gates: `gates-1.log` and `gates-1-logs/`, `gates-pin.log`.
- Plants: `plants-ea.log`, `plants-qa.log`, `plants-qa-pin.log`, with their logs dirs, and `qa-p1-2-plants.py`.
- Probes and overlay: `p1-2-probes.ts`, `p1-1-overlay.log`.
- Pin: `battle-qa.test.ts`.
