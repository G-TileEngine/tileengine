# Hand-back step-p1-2-battle r1
Step file: handoff/steps/step-p1-2-battle.md (sha256 86bf53d9b7eb04dd9f7b47ae6f18a5bc1ccd0c348db3457c3958c2836729dc68)
Base commit: 01dfe82a48e851c435d0b9282c76d54aa33771e2     Head commit: d82b56003cc6151018863437ea13489cee59e9f7     Branch: step/step-p1-2-battle-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/btf-adapters/src/btf-defaults/battle.ts
M	src/btf-adapters/src/index.ts
A	src/rules/battle/battle.ts
A	src/rules/battle/damage.ts
A	src/rules/battle/index.ts
A	src/rules/battle/roster.ts
A	src/rules/battle/win.ts
M	src/sim/actions.ts
M	src/sim/chaos.ts
M	src/sim/run.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/parity/battle.parity.test.ts
A	tests/rules/battle-qa-r2.test.ts
A	tests/rules/battle-qa.test.ts
A	tests/rules/battle.test.ts

## Green
npm test: 903/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

```
# tests 903
# pass 903
# fail 0
# cancelled 0
# skipped 0
# todo 0
smoke: 0 failed
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.32 p95 0.61 ms; lap 2 p50 0.25 p95 0.43 ms; lap 3 p50 0.23 p95 0.46 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.41 p95 0.72 ms; lap 2 p50 0.39 p95 0.59 ms; lap 3 p50 0.39 p95 0.60 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.41 p95 2.61 ms; lap 2 p50 1.29 p95 1.84 ms; lap 3 p50 1.28 p95 1.84 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.78 p95 2.46 ms; lap 2 p50 1.80 p95 2.38 ms; lap 3 p50 1.78 p95 2.40 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.04 p95 1.31 ms; lap 2 p50 1.02 p95 1.31 ms; lap 3 p50 1.03 p95 1.27 ms; counts 27/373/0
```

Chaos (rules off, histories unchanged): stage-fixed steps 3120 rejects 0; stage-weighted steps 5542 rejects 0. deps: 133 modules, 432 dependencies.

## Shipped tests (sha256, unchanged)
bd772d36e40f2cbeb7ec16e51366a4c113adc662402a23d3ee8ec90a7098fa1b  tests/rules/battle.test.ts
0fe7165521f77e4c6fd2ff3ef4a4f2d7e9b180327f927220e4e74d8c6774452c  tests/rules/battle-qa.test.ts
200f0b566b3cdd52ac82bee26a50c48d839a63d3429307d287388fad47000540  tests/parity/battle.parity.test.ts
c12984d2f8e604a4e35ef87d8c6f6eed0c141edd07c99beae0653934ba2b4a78  tests/rules/battle-qa-r2.test.ts

## Helpers & self-review (required)
- Helper 1: review `src/rules/battle/` and `BTF_BATTLE_DEFAULTS` against rulings 1–7 and 9 (install, refusals, death order, wipe, bad setup). It re-ran the 21 shipped tests. Result: PASS. Residuals it named, none of which fail a shipped test: a dead aim with an in-bounds fallback damages the occupant (QA S2, carried to P1-3); an unknown id does not retarget; `hit` is emitted before `remove`, and `unit.died` after; non-whole knobs report `unit_hp` first; HP is stored only for units present at `createBattle`.
- Helper 2: review the sim hook (`types.ts`, `world.ts`, `actions.ts`, `run.ts`, `chaos.ts`) against ruling 8 and the snapshot compare. Result: PASS. It checked that dropping `rules` and adding it back keeps key order, and that `turn` is restored before the compare. Residuals: no chaos run sets `rules` (carried to P1-5); `stillOf` does not watch `rules`; a non-plain `rules` value fails the input plain-gate before `createBattle`.
- Self-review: Acceptance — green 903/0 done; smoke/sim/stress lines done (stress C lap-1 p95 missed twice under load, then passed alone with the counts above); pin diff empty done; forbidden dirs empty and only the named sim/btf files changed done; no new import of P1-1 move files done; four shipped tests byte-identical done; per-file caps and 359 changed lines done; no Math.random/Date/timers/Card/Deck, no `hp`/`damage` in the new sim lines, cites use `towerChess.ts`/`towerStrike.ts` done; branch, CN-028 push, last-commit hand-back done. QA G1–G10 done.

## Decisions & deviations (5–10 lines)
- CoS set this build's base to main `01dfe82a` (the kit tip). The step file still prints `6cd8fa25`, that commit's parent. The diff and the 359-line count are against `01dfe82a`, so the kit's 707 doc lines are not in the diff. Delivery is the CN-028 branch push, not a bundle.
- BTF numbers sit in the KnobSpecs and again in `BTF_BATTLE_DEFAULTS`, because rules cannot import adapters. The parity test asserts they match. `layerNotApplied` message is exactly `L5 difficulty.damage`, appended after B1's notes, `out` unchanged. A present `damage` key other than `1` warns once (including `0`); exactly `1` or a missing key does not.
- `hit refused (<reason>)` is the refusal message. Roster `unsupported` details use U+2265 and are not pinned. Whole numbers outside the slider are kept with B1's `outOfRange`; only `createBattle` rejects hp below 1 or atk below 0. Extra keys on a stats entry are dropped; only `hp` and `atk` are kept.
- The HP map is one number per unit already placed at `createBattle`, bounded by the unit cap, not per frame. A unit placed later is absent from `state()`, and a hit treats that missing HP as 0. This step does not spawn units. `atk` 0 never removes. Actor is checked before the aim. An in-bounds fallback on a dead aim hits that occupant (QA S2, P1-3).
- deps 133/432 matches the kit. `CHROME_PATH` is the sandbox browser only. Plant scripts are not in the tree, so they were not re-run. The step-12 comment "eight snapshot keys" in `types.ts` was left as written; chaos `KEYS` now ends with `"rules"`.

## Next step (optional proposal)
- P1-3 can filter `targetsFor` and refuse `interact` as `interactRefused` with a reason, and decide whether a dead aim keeps `fallbackAt`.
