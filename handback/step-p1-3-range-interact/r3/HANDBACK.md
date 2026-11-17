# Hand-back step-p1-3-range-interact r3
Step file: handoff/steps/step-p1-3-range-interact.md (sha256 0cfb566da4ba77ff7659c6bffd223f96333d6844338335f1375e6a43d2a67bc4)
Base commit: 9ac26da821d8f5e71a108cdbc578c5c8a38f2037     Head commit: 51e4b8c49bdf587375aef0b3a17c28b29d7da39f     Tree: 17b9c58e4f1d14be79b5ed0199b8fda2b83b7443     Branch: step/step-p1-3-range-interact-r3-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/btf-defaults/battle.ts
A	src/rules/battle/basic-attack.ts
M	src/rules/battle/battle.ts
M	src/rules/battle/index.ts
A	src/rules/battle/interact.ts
A	src/rules/battle/range.ts
A	src/rules/battle/targets.ts
M	src/sim/player.ts
M	src/sim/types.ts
M	src/state/tactics.input.table.ts
A	tests/parity/basic-attack.parity.test.ts
M	tests/parity/battle.parity.test.ts
A	tests/rules/battle-p13.test.ts
M	tests/rules/battle-qa-build.test.ts
A	tests/rules/battle-qa-p13-build.test.ts
A	tests/rules/battle-qa-p13.test.ts
M	tests/rules/battle-qa-r2.test.ts
M	tests/rules/battle-qa.test.ts
M	tests/rules/battle.test.ts
M	tests/state/xgo.accepts.test.ts

## Green
npm test: 937/0/0/0    typecheck: exit 0    lint: exit 1    deps: exit 0    check:state: exit 0    check:law: exit 0
npm test: 937 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 53358.969979. deps 138 modules / 446 deps. check:state OK (src). check:law OK (src).
Lint fails on one line, the QA pin only: tests/rules/battle-qa-p13-build.test.ts:12 (`knight#1`!, `@typescript-eslint/no-non-null-assertion`). That file is byte-identical to the pin (sha256 d9ed0c61…) and was not edited. `eslint src` exits 0.

## Shipped tests (sha256, unchanged)
0b49b463e2826f3d755dac9b11f7605ce5dc686975c305c90a14c8fab181a028  tests/parity/basic-attack.parity.test.ts
40eb7a5048a38a87d0a28d92f7c1cce575cc7ea95723fcd6eff27992af897247  tests/parity/battle.parity.test.ts
9c803c8229ec104560b8bbdf090f1b3f56000e7b7724876de3b9099e97f247b9  tests/rules/battle-p13.test.ts
9d367f32198b46b4fbc2db210187bda8de0ad2437560da20990f81e1a1b1fd88  tests/rules/battle-qa-build.test.ts
f4c554d43f1cfc07625f9b790c3725b2f4d895ab8e981011921c45ff0481a210  tests/rules/battle-qa-p13.test.ts
7630bd6fddfb8599870261c90fe42ea733da906d6b805909756545e63693e390  tests/rules/battle-qa-r2.test.ts
203b0c92c8df84bceb171ac3a653dde95259369d928e5065838f9491a70d032e  tests/rules/battle-qa.test.ts
8efde251783e6e207f600367d3d889597036315332b3c1db15947664991f658c  tests/rules/battle.test.ts
26a703c7c21a0147dedbd7e46cdb976f50f0c71cb5559d9ea298900c936f5c10  tests/state/xgo.accepts.test.ts
d9ed0c619612123dee94c184591d0f35ee6a0b6ca9d2cf989893f6553f0e4e58  tests/rules/battle-qa-p13-build.test.ts

## Helpers & self-review (required)
- Helper selection: reviewed the success-path branches in src/sim/player.ts (keep `selected` on TAP_MOVE_CELL and CANCEL, CANCEL clears `pending`, SELECT_UNIT writes `selected`, any other success clears `selected`, reject does not reach the lines, confirm with no pending stays noAction, confirm still submits a unit aim with no fallbackAt). Found no defect. The committed line is those same three branches on one line.
- Self-review: M1 done — SelectUnit knight#1, TargetCell one north, MOVE_DONE, ChooseAction basic with no unitId is not noUnit; Cancel then ChooseAction interact with no unitId also succeeds (the pin). M2 done — no code change; reachOf still ignores inherited constructor/__proto__ and honors an own constructor key. Acceptance: npm test 937/0/0/0 (floor 937); typecheck, deps, check:state, check:law exit 0; lint exit 1 only on the untouched pin. Caps: defaults 2/6, basic-attack 10/20, battle.ts 40/40, index 6/8, interact 5/10, range 8/18, targets 12/30, player 26/50, types 4/6, table 2/4, shipped fixtures at or under their caps; the pin is 35; total 419 ≤ 420. Nine shipped files byte-identical to the kit. No Math.random, Date, or timers added. No core, behaviours, levels, turns, or migration edits. G1 done (pin plus the 13 step tests; shipped sha256s equal). G2 typecheck done; eslint clean on src, not on the pin's `!`. G3 done (only xGo moves the phase). G4 done. G5 done. G6 the extra file is the QA pin, required byte-identical. G7 done (419). G8 deps/state/law done. G9 the lines below. G10 this file.

## Decisions & deviations (5–10 lines)
- Started at the QA pin dd05740e738ff0b9032bd07edc1867cdc9e65c52 (r2 tip 902ef754 plus the pin). Base stays 9ac26da821d8f5e71a108cdbc578c5c8a38f2037. The diff is that base to this head.
- M1, src/sim/player.ts: a successful TAP_MOVE_CELL or CANCEL does not clear `selected`. CANCEL sets `pending` to null. SELECT_UNIT still sets `selected`. Any other successful event, including CONFIRM_TARGET, still clears `selected`. A reject does not touch either. Confirm with no pending choice is still noAction. Confirm still submits `{ pipe: "unit", unitId }` and no fallbackAt.
- M2 needed no code change. reachOf already uses Object.hasOwn and returns 1 for a missing table, a key that is not own, or a value that is not an integer ≥ 1. The pin covers the constructor and __proto__ cases.
- The pin tests/rules/battle-qa-p13-build.test.ts is byte-identical (sha256 d9ed0c619612123dee94c184591d0f35ee6a0b6ca9d2cf989893f6553f0e4e58). It is the one extra file. It is also the only lint error (`!` on knight#1). It was left as shipped.
- 419 changed lines (381 insertions, 38 deletions), under the 420 cap. The pin is 35 of those. range.ts, targets.ts, basic-attack.ts, interact.ts, and the player door were tightened to the same behavior so the pin still fits. Every listed file is at or under its own cap. battle.ts is still 40. No new dependency. Nothing is cached.

## Next step (optional proposal)
- Drop the non-null assertion in the build pin if lint must be exit 0 without editing a byte-identical file. P1-4 can take spells; interact stays free.
