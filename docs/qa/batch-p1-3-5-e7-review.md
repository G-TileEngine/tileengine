# QA batch review: P1-3, P1-4, P1-5 (E7 held for r2)

Lean pass (CEO 03:48). One verdict per step. Pins only for real must-fixes (G1: a miss that breaks a stated rule). Every new id-keyed lookup was checked for the P1-2 ChatA own-key bug (`obj[id]` on a plain object). E7 held for r2.

## P1-3 range/interact — NOT OK

**Verdict: NOT OK** until the QA pin is in the kit (M1). The code already matches the rulings; the shipped tests miss three of them.
- **Bundle:** `step-p1-3-proto-r1.bundle` sha 1b5abdd2 ✓, verify OK, needs 2a8b1e7c (P1-2 proto rebased on origin/main 82326beb).
- **Head:** f2c186d3, tree 67df8a8f ✓, parent 2a8b1e7c. One commit. Author and committer are G-TileEngine noreply.
- **Tests vs kit:** all seven files are byte-identical (battle-p13 f2560e45, basic-attack.parity 0b49b463, battle.parity 40eb7a50, battle-qa-r2 7630bd6f, battle-qa 203b0c92, battle.test 8efde251, xgo.accepts 26a703c7).
- **Doc and paste:** doc d3fb3bbb (89 lines) and paste f1e0e8db (91). The body from `## Goal` on is identical (e2a2ba3b).
- **Earlier QA pins:** battle-qa and battle-qa-r2 only add `reach: 99` and `standBy`, so the original hits still fire under orthogonal reach. Intent is kept: bad setup, atk 0, overkill, the frozen D7 list, and actor-before-aim. xgo 38/34 → 40/35 matches the new `CHOOSE_ACTION` edge from `unitSelected`. Interact was dropped from the P1-2 "still unsupported" test because this step implements it.
- **Size:** 390 changed lines (+361/−29: src 150, tests 240), within the 400 cap. After M1 the step is **417**, so raise the cap to **≤ 420** (400–500 needs a reason: the 27-line pin). Floor becomes that main's count + 13 = **916**.
- **Gates** (pgrep clear before launch; `--floor 915 --main 2a8b1e7c`): 915/0, tsc/lint/deps 137/447, state and law PASS, smoke SAME, sim SAME (afc89d56 / b8007292), stress SAME (`27/0/0 113/0/0 181/0/0 181/0/0 27/373/0`).
- **Plants:** EA 20/20, including p18 (allyTarget before outOfReach, already covered by the merchant-far row). QA set 0/6 missed: unfrozen or reordered `HIT_FILTER_REASONS`, interact allowed on the player-side merchant, `targetsFor` listing that merchant, and a special-case `reachOf("constructor")`.
- **Rulings in the code:** interact only when `side === "neutral"`; `inOrthogonalReach` has no body check; allyTarget is checked before outOfReach; `CONFIRM_TARGET` builds `aimUnit(occ.id)` with no `fallbackAt`. `createBattle` stores stats in a Map. `reachOf` still does `reach?.[unitId]`, but the integer guard makes a prototype key fall back to 1 (accidentally safe).
- **Law:** one clock, UNIT/TILE pipes, BTF defaults are frozen numbers plus `towerStrike.ts:<line>` cites (no chess tree). No `Math.random` or rAF in the new src. Each file is within its cap.
- **HANDBACK §0.6:** the step doc does not name the helper rule or require `§ Helpers & self-review`. P1-1 and earlier steps did; HAND-BACK.md still requires it.
- **Must (M1):** ship `tests/rules/battle-qa-p13.test.ts` byte-identical to the pin (27 lines, sha256 f4c554d4, blob 03c3286d). It checks that `HIT_FILTER_REASONS` is frozen as `outOfReach`, `allyTarget`; that an adjacent `merchant#6` is `foeTarget`; and that a reach-2 shot through a body still hits. Pin `refs/cmp/p1-3-qa-fix-a` = 9c05e03f on f2c186d3 (tree 47dceb31, noreply). Bundle `/workspace/share/step-p1-3-qa-fix-a.bundle` sha256 608de101, verify OK. Update the floor, the size table and the cap.
- **Should:** `reachOf` should use `Object.hasOwn` or a Map, like stats. Restore the working-style / §0.6 helper paragraph in the step doc. The first outOfReach test title claims a walk-and-hit that the body never does.

## P1-4 line-shot — NOT OK

**Verdict: NOT OK** (M1). A line-shot whose actor has document id `constructor`, `__proto__` or `toString` throws `find is not a function`.
- **Bundle:** `step-p1-4-proto-r1.bundle` sha 1a2b242f ✓, verify OK, needs f2c186d3. **Head** 3088c5db, tree 23955699 ✓, parent f2c186d3. Noreply.
- **Kit:** doc 06be9e68 (86 lines) and paste 6f39845e (88), body identical from `## Goal` (d84fd8e0). Five tests byte-identical (line-shot.parity 671b62fa, unit-setup ec813811, battle-p14 c2e5966b, battle.test 575ffc36, behaviours.test 8bfaffc1).
- **Size:** 344 (+323/−21), under 400. After M1 the step is **371**. Floor becomes that main's count + 11 = **926**.
- **Gates** (pgrep clear; `--floor 925 --main f2c186d3`): 925/0, tsc/lint/deps 142/459, state and law PASS, smoke SAME, sim SAME (same hashes as P1-3). **stress DIFF** on the first run (C p95 13 ms > 4 ms) and on the one allowed re-run (E p95 5.7 ms); both aborted before L. Info only — the step does not change the budget. Logs: `cmp/batch-review/gates/p1-4-gates-run1` and `run2`.
- **Plants:** EA 20/20 (L5 note through `installSetups`, UTF-16 vs code-point labels, shallow `plainCopy`, `__proto__` leak in overrides, int-list, catalogue-less setup). The own-key throw is not in that set and is missed by every shipped test. A probe with `unitId` `constructor` / `__proto__` / `toString` confirmed the TypeError; `prototype` is safe because it is not on `Object.prototype` as a value.
- **Rulings held:** L5 `difficulty.damage` stays one `layerNotApplied` warning through `installDamage` and `installSetups` (QA R2); real layering is not implemented. `catalogue.ts` is untouched, rev 26, table hash pinned to the literal `3b16c673…`. A raw int-list on today's picker-typed `thresholds` is `invalidValue`; `nums()` already accepts arrays so a later regen will not empty them.
- **Bug:** `abilities?.[by.unitId] ?? []` then `.find`. A missing key hits `Object.prototype` (`constructor` and `toString` are functions; `__proto__` is an object). `plainCopy` already skips those three keys (core policy, out of this step), so a custom row for those ids can never arrive; the lookup must still fall back to default reach 3 / damage 2, not throw. `readStageOverrides` and `readUnit` already skip `__proto__`. `abilityTableFor` uses a Map for setups; `overrides?.[id]` is wrapped in `isRecord`.
- **Law:** BTF spell defaults are data plus `towerChessSpells.ts:<line>` cites, no chess tree, no extra clock, no game rules in `src/core`. Each file is within its cap.
- **HANDBACK §0.6:** same gap as P1-3 (the step doc does not name the helper rule).
- **Must (M1):** ship the pin byte-identical: one-line `Object.hasOwn` lookup in `src/rules/battle/battle.ts`, plus `tests/rules/battle-qa-p14.test.ts` (25 lines, sha256 5f5043c4, blob bbd40e21). Three prototype-key unit ids fire a default line-shot (amount 2, `hitClass: "spell"`, no throw). Pin `refs/cmp/p1-4-qa-fix-a` = 679dc1e4 on 3088c5db (tree 9247ccea, 27 changed lines, noreply). Bundle `/workspace/share/step-p1-4-qa-fix-a.bundle` sha256 ad7b301f, verify OK. Floor 926. Tests on the pin already pass.
- **Should:** restore §0.6 helper wording in the step doc. Report: a unit document id of `constructor` / `__proto__` / `prototype` can never carry its own abilities row, because `plainCopy` strips those keys.

## P1-5 enemy turn — NOT OK

**Verdict: NOT OK** (M1). The same abilities lookup is copied into `shotRow`; one prototype-key unit on the side crashes the whole bot turn. Stated tie-breaks have no test that would catch a swap.
- **Bundle:** `step-p1-5-proto-r1.bundle` sha 9db6b3ff ✓, verify OK, needs 3088c5db. **Head** 5d8f4c78, tree dfad4886 ✓, parent 3088c5db. Noreply.
- **Kit:** doc e2ea9089 (75 lines) and paste 737e9823 (77), body identical from `## Goal` (829e7e4c). Both tests byte-identical (action-budget.parity 93cb77a6, bot-p15 6fdc45db).
- **Size:** 277 (+275/−2), under 400. After M1 the step is **314**. Floor becomes that main's count + 9 = **934**.
- **Gates** (pgrep clear; `--floor 933 --main 3088c5db`): 933/0, tsc/lint/deps 145/467, state and law PASS, smoke SAME, sim SAME (same hashes), stress SAME.
- **Plants:** EA 15/15 (budget 2, spell then basic then step, neutrals not foes, kill tracking, `acceptedCheck`, `"rules"` on `SNAPSHOT_KEYS`). QA tie-break plants 0/3 missed: prefer higher HP, later placement, or a longer path — none fail `bot-p15`. The shipped "ties" test only checks that two calls match (no RNG) and that a step is length ≤ 2.
- **Carries, closed (not re-carried):** `acceptedCheck` allows a legal `ability` or `interact` when `snapshot.rules` is present, and still requires `move` when rules are off (the exploit.ts:75 carry from P1-1/P1-2). Chaos `"rules"` is in `SNAPSHOT_KEYS`, and `divergentSnapshotKey` names a rules-only snapshot diff. Both have plants and tests.
- **Rulings in the code:** `actions_per_turn` 2 (BTF `CHESS_MOVES`, towerChess.ts:92). Order is a spell already in reach, then a basic, then an orthogonal BFS step with cap 2. Ties are path length, then lowest HP, then placement. No RNG. Neutrals are not foes; the player-side merchant is. A probe confirmed the tie order once the cub is in the stage at create time (a unit placed later is missing from the HP map and shows as hp 0). `setup?.stats[id]?.hp` is the same own-key class, but `?.hp` falls back to `base` (accidentally safe).
- **Law:** the bot lives in `src/rules/turns/`; `src/sim` only changes the exploit and chaos hook seams. No RNG, no chess tree, no extra clock. Each file is within its cap.
- **HANDBACK §0.6:** same gap as P1-3.
- **Must (M1):** ship the pin byte-identical: `shotRow` uses `Object.hasOwn`, plus `tests/rules/bot-qa-p15.test.ts` (35 lines, sha256 2c04c0a3, blob fe5748cf). A `constructor` unit on the side does not throw; ties prefer lower HP at equal length, a closer foe over a weaker farther one, and earlier placement at equal HP. Pin `refs/cmp/p1-5-qa-fix-a` = 057a2853 on 5d8f4c78 (tree 3dd58578, 37 changed lines, noreply). Bundle `/workspace/share/step-p1-5-qa-fix-a.bundle` sha256 063206a5, verify OK. Floor 934. Tests on the pin already pass.
- **Should:** give `setup.stats` the same `hasOwn` or Map treatment. Restore §0.6 helper wording in the step doc.

## E7

E7 held for r2. No verdict in this pass.

Evidence: `/workspace/cmp/batch-review/` (plants, pins, probes, gate logs).
