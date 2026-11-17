# QA delta review: step-p1-2-battle proto r2 + kit r2 (D7 + QA pin)

**Verdict: OK TO SEND once the r2 QA pin is in the kit (M1).**
- D7 is correct, and the r1 pin and wording landed as asked.
- G1 found 4 misses in 23 D7 plants: D7 precedence and the frozen reason list are not tested.
- The pin `refs/cmp/p1-2-r2-qa-fix-a` (19 lines) closes all 4. Evidence: `qa-runs/p1/p1-2/r2/`. r1 review: `step-p1-2-review.md` (6cf7772e, on main dc381e99).

## Identity and kit
- **Bundle:** `step-p1-2-proto-r2.bundle` sha 98904b7c ✓, verify OK, needs 5cb385ba.
- **Head:** 00b32eda, tree 3021e07a ✓. Chain: r1 ×4 (2600bd54) → D7 cec82523 → pin 00b32eda. All commits are G-TileEngine noreply (author and committer).
- **Tests:** `battle-qa.test.ts` 0fe71655 is byte-identical to QA 87e4e3ac. Shipped battle bd772d36, battle-qa 0fe71655 and parity 200f0b56 equal the kit copies.
- **Doc and paste:** doc 74af0dac (223 lines) and paste a6fb0ca5 (212 lines) have the same body from `## Goal` on (e03c12e8). Push list cb009434 checks 5/5 OK (`-c` in tree/ and in the kit). Expect-base is 5cb385ba.
- **Push dependency:** the kit cites the QA r1 review (6cf7772e) and DSK D7 (58cf837c). Both are now on main **dc381e99** (docs only over 5cb385ba; hashes match), so the dependency is met. The Base 5cb385ba stays valid.
- **Size:** r2 = 363 changed lines (+359/−4: src 170+4, tests 189). Raising the cap 320 → 370 is **justified**. D7 adds +20 src and +28 tests, M1 adds +37 tests, and src stays lean at 174. The r2 pin brings it to **382**, so the cap needs to be **≤ 385** (still under the 400 hard line).

## Gates (pgrep before each; one p95 re-run)
| ref | tests | tsc/lint/deps/state/law | smoke/sim/stress vs 5cb385ba |
|---|---|---|---|
| 00b32eda floor 894 | 894/0 | PASS, deps 128/415 (= kit) | SAME / SAME / SAME on the re-run |
| pin 849caa73 floor 895 | 895/0 | PASS | SAME / SAME / SAME |
- **Re-run:** run 1 showed stress DIFF because **main's** stress B hit p95 4.48 ms > 4 ms, a flake. The re-run gave SAME (`gates-r2.log`, then `gates-r2b.log`).
- **Sim hashes:** afc89d56 and b8007292 are unchanged.
- **Process slip:** the pin run started at the same moment as a pgrep that showed another worker's gates on 3ecbcaed. Both runs passed and stress stayed SAME, so no result is in doubt.

## Plants (G1)
- **EA:** 60/60 caught. **QA r1 set:** 17/17 caught on r2.
- **QA D7 set** (`qa-p1-2-r2-plants.py`, 23 plants): **19/23 on r2, 23/23 with the pin.**
  - Caught: every reason mislabel (d01–d08), the reason detail and message (d09–d10), and the reason list order (d14). Also every installDamage plant: no note, duplicate note, note when damage is 1, note with no damage key, note order, `out` changed, wrong code, note sent to unsupported (l01–l08).
  - Missed: d11 notUnitAim before the actor checks, d12 deadActor after the aim, d13 deadActor after notUnitAim, d15 `HIT_REFUSED_REASONS` not frozen. Each table row has exactly one fault, so precedence is never exercised. Ruling 5 says "checked in this order" and "(frozen)".
  - **Precedence the pin can't test:** aimMissed, selfTarget and deadTarget can't happen together, so their order can't be observed. The actor-before-aim order is the only order that can be seen.
- **Pin:** `refs/cmp/p1-2-r2-qa-fix-a` = 849caa73 on 00b32eda.
  - Adds `tests/rules/battle-qa-r2.test.ts` (19 lines, sha c12984d2, 1 test). The test has 5 cases with two faults each, and checks that the reason list is frozen.
  - Bundle `/workspace/share/step-p1-2-r2-qa-fix-a.bundle`, sha256 0e6e0e47…22f03, verify OK.
  - Kit effect: floor Base + 21 = 895, plus the push list, the size table and the cap ≤ 385.

## D7 and B1 checks
- **Order:** the reasons are checked in the ruled order: unknownActor, deadActor, notUnitAim, aimMissed, selfTarget, deadTarget. The 8-row table plus the every-reason-has-a-row test ✓.
- **Probe** (`p1-2-r2-probe.ts`, 5/5):
  - A dead target with an empty in-map fallback gives `deadTarget`.
  - A self aim with an off-map fallback gives `selfTarget`.
  - After a kill, with P1-1 r6, nothing targets the dead unit.
  - installDamage is pure, gives one note per install, and its notes are frozen.
- **B1 untouched:** `git diff 5cb385ba -- src/rules/behaviours` is empty. B1's `installOne` adds no note for damage. `installSetups` is used nowhere in src outside behaviours/.
- **P1-1 r6 on r2:** applies cleanly; 902/0, tsc, lint, check:law and deps 133/430 all OK.
- **Wording:** S1 and S2 are in ruling 5 (S2 also in the P1-3 carry line), and R1–R4 plus exploit.ts:75 are in ruling 10 ✓.

## Findings
- **Must (M1):** ship `battle-qa-r2.test.ts` byte-identical to the pin (sha c12984d2…). Set the floor to Base + 21 = 895, the cap to ≤ 385 (382 total), and update the push list.
- **Should (S1):** the ruling 5 table separator `|---|---|` has no indent, unlike the header and rows, so the table renders badly inside the list. Indent it 5 spaces.
- **Report:**
  - R1: installDamage warns for any `damage` that isn't exactly 1, including NaN or an own `undefined`. That is fine for a warning.
  - R2: the L5 note only appears through `installDamage`. Any future caller that uses B1 `installSetups` for damage-resolution will skip it; P1-4 owns this.
