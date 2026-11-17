# QA build review: step-p1-2-battle ChatA r1 (PR #62), LEAN, one pass

**Verdict: REWORK (1 must-fix).**
Everything else passes: identity, gates, all plants (once re-needled), build law, size and drift. The one bug is a prototype-key lookup in `battle.ts:33` that the r3 proto doesn't have.
Evidence: `qa-runs/p1/p1-2/build/`.

## Identity
- **Branch:** `step/step-p1-2-battle-r1-chatA`. Tip a187785c, tree c95254dd. Code commit d82b5600. PR #62 is OPEN with head = tip, and GitHub reports it MERGEABLE.
- **Commits:** 2, both G-TileEngine noreply (author and committer). Base 01dfe82a is an ancestor of the tip and is on main.
- **Shipped tests:** battle bd772d36, battle-qa 0fe71655, battle-qa-r2 c12984d2 and parity 200f0b56 are byte-identical to the kit. Kit push list 7386006b checks 7/7 OK.
- **Pins and locked dirs:** the diff of package*, depcruise, check-law, core-types, core, runtime, fx, editor, project, state, paint, behaviours, levels, turns, move, handoff and docs is **empty**.
- **HANDBACK §0.6 present:** Helper 1 (rules) and Helper 2 (sim hook), each with residuals, plus a self-review and a deviations section.

## Gates (pgrep clear in a separate step)
| ref | tests | tsc/lint/deps/state/law | smoke/sim/stress |
|---|---|---|---|
| tip a187785c floor 903, `--main 01dfe82a` | 903/0 (main 882) | PASS, deps 133/432 (= kit) | SAME / afc89d56, b8007292 SAME / SAME |
- **Trial merge:** `git merge-tree origin/main(82326beb) tip` = **74a93013** = CoS's tree. 01dfe82a..82326beb has no src/tests/package changes, so its src and tests equal the gated tip. Counted as verified; not re-gated in LEAN mode.

## Plants (G1)
- **As-is:** EA 37/60, QA r1 2/17, QA D7 9/23. Every miss was `needle count 0`, because ChatA rewrote the code. None was a test gap.
- **Re-needled with the same intent** (`qa-p1-2-build-plants.py`, 49 plants covering every missed EA/QA intent): **49/49 caught.** No G1 must-fix.

## Src vs r3 proto (b964b7bf / 849caa73; same tests)
- **Same behaviour:**
  - Refusal order and reasons. The aimMissed/deadTarget test was rewritten over the target and fallback, but its outcome matches resolveAim in all 4 miss cases.
  - `next = cur > atk ? cur - atk : 0` (the HP floor).
  - The death guard `&& atk > 0`, which is redundant since a living unit has hp ≥ 1.
  - Remove happens before `unit.died`. installDamage, wipeRule, the world.ts bus types and run.ts are unchanged.
- **Cosmetic:** JSDoc comments dropped, `as const` moved per field in BTF defaults (still frozen data with cites), and `install` written as named functions.
- **state():** uses `flatMap`, which skips units without an HP entry; the proto used `?? 0`. Every unit is placed before `createBattle` (world.ts:59 then :62), so this is equivalent today. HANDBACK documents it.
- **DIVERGENCE (must-fix):** setup stats moved from a `Map` to a plain object, and `of = (id) => cfg.stats[id] ?? cfg.base` (line 33) also finds inherited keys. A unit document id that is an `Object.prototype` key (`constructor`, for example) gets `hp`/`atk` = undefined. Probe `build-probe.ts`:
  - That unit is dropped from `state()`.
  - Its hit emits `amount: undefined` and leaves its target at `hp: 0` without removing it: a 0-HP ghost, which the P1-1 carry rule forbids.
  - A single hit on it kills it.
  - The r3 proto gives 9/1 and correct hits. Nothing in src restricts unit document ids, so this is reachable from project data.

## Build law, size, drift
- **Law:** the added src has no Math.random, Date, timers, rAF or editor code. The hook aims through `resolveAim` only. BTF defaults are data only.
- **Size:** src +147/−4 and tests +208, so 355 adds + 4 deletions = 359, against the 385 cap ✓. The builder's 359 is the add+delete count.
- **Doc drift:** none, beyond the HANDBACK note that the step file prints Base 6cd8fa25 while CoS set it to 01dfe82a (the kit tip, which is docs-only on top). Accepted.

## CN-028 (first git handback)
- **Branch:** `step/<id>-r1-chatA` as CN-028 requires. HANDBACK quotes the tip, Base and counts; delivery was a branch push, no bundle. CoS opened the PR.
- **Pusher:** GTileEngineHelpers, per the brief. This is the builder token's username in the CN-028 credential helper, while commits carry the G-TileEngine noreply identity. GitHub's PR author shows G-TileEngine. I did not verify the push actor itself: the events API returned nothing.
- **Rework branch:** ruleset 27424039 forbids force-push on `step/**`, so the rework must be pushed as a new branch, `step/step-p1-2-battle-r2-chatA`.

## Must-fix (rework r2)
- **M1:** make the setup stats lookup own-key only. Either keep a `Map`, as in r3, or use `Object.hasOwn(cfg.stats, id) ? cfg.stats[id] : cfg.base`. Ship the QA pin `tests/rules/battle-qa-build.test.ts`:
  - 16 lines, sha f8758970…a359. It fails on a187785c and passes with the one-line fix and on the r3 proto.
  - Ref `refs/cmp/p1-2-build-qa-pin` = 32dd1a7a. Bundle `/workspace/share/step-p1-2-build-qa-pin.bundle`, sha 53fe7f52…db21.
  - Effects: floor 904, size about 376 (within the cap of 385).

## Report-only
- R1: HANDBACK says stress C lap-1 p95 missed twice under load and then passed alone. My gates were SAME.
- R2: the step-12 comment "eight snapshot keys" in types.ts is stale.
- Carries are unchanged: S2 fallback → P1-3, chaos `rules` → P1-5, wipeRule wiring → P1-6.

## Postmerge (after the r2 fix)
- r1 as-is would have merged to tree 74a93013 at floor 903.
- r2 needs a new merge-tree on main. The expected floor is **904**: main 882 + 22 (21 kit tests + 1 pin).
