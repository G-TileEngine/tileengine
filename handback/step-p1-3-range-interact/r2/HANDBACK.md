# Hand-back step-p1-3-range-interact r2
Step file: handoff/steps/step-p1-3-range-interact.md (sha256 0cfb566da4ba77ff7659c6bffd223f96333d6844338335f1375e6a43d2a67bc4)
Base commit: 9ac26da821d8f5e71a108cdbc578c5c8a38f2037     Head commit: d574a1267d56d841e8e09b4a78a5096432276206     Tree: f072236d1a07f34b690fb34ea9ebe52edaae3057     Branch: step/step-p1-3-range-interact-r2-chatA     PR: opened by Chief Of Staff from the branch
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
A	tests/rules/battle-qa-p13.test.ts
M	tests/rules/battle-qa-r2.test.ts
M	tests/rules/battle-qa.test.ts
M	tests/rules/battle.test.ts
M	tests/state/xgo.accepts.test.ts

## Green
npm test: 935/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm test: 935 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 98262.209599. deps 138 modules / 446 deps. check:state OK (src). check:law OK (src).

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

## Helpers & self-review (required)
- Helper battle (review of battle.ts, range.ts, interact.ts, targets.ts, basic-attack.ts, the defaults, against orthogonal reach, ally-before-range, frozen filter lists, free interact, merchant as foeTarget, no body block, targetsFor, own-key stats): launched and still running with no report after five minutes, then stopped. The same list was checked here against the shipped tests. No defect. 13 new tests and the adjusted P1-2 pins pass, including the constructor unit at reach 1 and a body standing in the ray.
- Helper player (review of player.ts, types.ts, and the input table: ChooseAction from unitSelected, confirm with no fallbackAt, confirm without a choice still noAction, ChooseAbility's local pending not writing the action choice): launched and still running with no report after five minutes, then stopped. The same path was read after tests/sim/player.test.ts and the ChooseAction test passed. No defect. The action target is `{ pipe: "unit", unitId }` only.
- Self-review: Acceptance done — npm ci exit 0; npm test 935/0/0/0 (duration_ms 98262.209599); typecheck, lint, deps, check:state, check:law exit 0. P1-2 is on the base (createBattle, BattleSetup, HIT_REFUSED_REASONS, installDamage, own-key stats) and the shipped imports match, so the step was not stopped. Caps: defaults 2/6, basic-attack 11/20, battle.ts 40/40, index 6/8, interact 6/10, range 16/18, targets 17/30, player 28/50, types 4/6, table 2/4, shipped and fixture tests at or under their caps; total 401 ≤ 420. Nine shipped files byte-identical to the kit (QA pin f4c554d4…). No Math.random, Date, or timers in the new rules; no core, behaviours, levels, turns, or migration edits; no painter-proto or ui-shell; cites are towerStrike.ts line numbers. QA checklist G1 done (13 new tests by name, shipped sha256s equal, plants described in the step are the cases those tests assert), G2 done (tsc and eslint exit 0, no ts-ignore, no any), G3 done (no phase writes; the only transition is xGo), G4 done (BASIC_ATTACK, reachOf, inOrthogonalReach, targetsFor, HIT_FILTER_REASONS, INTERACT_REFUSED_REASONS, ChooseAction on DoorIntent), G5 done (do-not-touch paths absent), G6 done (only the step's 19 files), G7 done (401, battle.ts on its cap, none over), G8 done (deps 138/446, check:state and check:law exit 0), G9 done (decisions below), G10 done (the lines above).

## Decisions & deviations (5–10 lines)
- Base is 9ac26da821d8f5e71a108cdbc578c5c8a38f2037 (P1-2 and E6 merged, 922 tests), the commit the chat named. The step file's authoring base was 75df464 and its floor 917. Floor here is 922 + 13 = 935, and the run is 935/0. The diff is that base to the head.
- 401 changed lines (src 132, tests 269). battle.ts is 40, on its cap, because the interact branch is one line. Every other file is under its cap. No file outside the step's list. No new dependency. Pins are unchanged.
- BattleSetup.reach is optional. taken() copies own keys when reach is a record and throws the existing "createBattle: bad setup" when it is present and not a record. A value that is not an integer ≥ 1 is kept and reachOf returns 1. Missing table or a key that is not own is 1.
- A basic target is a living unit whose side is neither the actor's nor "neutral". An interact target is a living neutral at Manhattan 1. notAdjacent is checked before foeTarget, so a far non-neutral is notAdjacent and an adjacent non-neutral (merchant#6) is foeTarget. No cell between the actor and the target is tested.
- ChooseAction is a DoorIntent handled in player.ts. intents.ts is not in the file list, so the phase move is xGo in the player, next "targeting", from unitSelected or actMenu. Confirm reads the occupant of the tapped cell and submits a unit aim with no fallbackAt. Confirm with no pending choice is still noAction. basic and interact both ask for a target.
- BTF defaults add basic_reach 1 and class_reach warrior 1, archer 2, mage 2, cleric 1 (towerStrike.ts:79-83). The BASIC_ATTACK knob id is "reach", a per-unit slider, default 1. 0 is unsupported and the install result is null. The six D7 hit reasons are unchanged; the filter pair is outOfReach then allyTarget, checked ally first.
- Nothing is cached. targetsFor builds one list per call. The player keeps one selected id and one pending action ("basic" or "interact"), replaced, not appended. Open items stay as the step left them: no body block, the merchant is not interactable, and there is no talk text knob.

## Next step (optional proposal)
- P1-4 can take spells (ability with effects). Interact stays free and still does not read a text knob.
