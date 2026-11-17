# Hand-back step-p1-5-enemy-turn r2
Step file: handoff/steps/step-p1-5-enemy-turn.md (sha256 697e35efdc3eab190abccad9e945d407959dd6367f17dfade6fd14ad78a56fde)
Base commit: 69fad867881553efc2d3515dd288a47b97690d4e     Head commit: a214b928f8c30faad18778b1af5a6ce405690551     Tree: 21263f58ee7a395703dd547b31acbb111b608241     Branch: step/step-p1-5-enemy-turn-r2-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/btf-adapters/src/btf-defaults/turns.ts
M	src/btf-adapters/src/index.ts
A	src/rules/turns/action-budget.ts
A	src/rules/turns/bot-ability-priority.ts
M	src/sim/chaos.ts
M	src/sim/exploit.ts
M	src/sim/index.ts
A	tests/parity/action-budget.parity.test.ts
A	tests/rules/bot-p15.test.ts
A	tests/rules/bot-qa-p15.test.ts

## Green
npm test: 957/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci: exit 0 (135 packages). npm run green: exit 0. npm test: 957 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. duration_ms 54618.796547. deps 146 modules / 462 deps. check:state OK (src). check:law OK (src).

## Shipped tests (sha256, unchanged)
93cb77a6ac03f8815d6a214a06da3e46cc0ce18e40c3fbbfbd0b59c6884985f0  tests/parity/action-budget.parity.test.ts
6fdc45dbfa5101753c67d0a25dbf24b36c16217157819ab8a8513081986fb961  tests/rules/bot-p15.test.ts
2c04c0a3e0350149cd3d1e26960beef1f91b874ad8cd403dc7638ce19320050f  tests/rules/bot-qa-p15.test.ts

## Helpers & self-review (required)
- Helper bot (spell before basic before a BFS step, stepReach 2, neutrals not foes, local kill tracking, Object.hasOwn on abilities and stats, no sim import from rules): launched and still running with no report, then stopped. The same list was read against the shipped tests after they passed, including the 200-seed soak. No defect.
- Self-review: Acceptance done — npm ci exit 0; npm run green exit 0; 957/0/0/0 (duration_ms 54618.796547); typecheck, lint, deps, check:state, check:law exit 0. P1-4 is on the base (line-shot, BattleSetup.abilities, inOrthogonalReach, reachOf) and the shipped imports match, so the step was not stopped. The 200-seed soak ends and the second run of each seed matches. Caps: turns defaults 4/6, btf index 1/2, action-budget 12/20, bot 114/130, chaos 2/4, exploit 5/8, sim index 2/4, parity 11/11, bot-p15 120/130, qa pin 35/35; total 306 ≤ 400. Three shipped files byte-identical to the kit (QA pin 2c04c0a3…). No Math.random in the bot. No core, catalogue, or migration edits. No painter-proto or ui-shell. The bot is in src/rules/turns and does not import src/sim. Cites are towerChess.ts:92. G1 done, G2 done, G3 done (no phase writes outside the existing driver), G4 done, G5 done, G6 done (only the step's 10 files), G7 done, G8 done, G9 the lines below, G10 this file.

## Decisions & deviations (5–10 lines)
- Base is 69fad867881553efc2d3515dd288a47b97690d4e (P1-4 merged, 948 tests). The paste's floor 937 is the authoring floor. This main is 948, so the floor used here is 948 + 9 = 957. The run is 957/0. The diff is that base to the head.
- 306 changed lines (304 insertions, 2 deletions). Every file is under its cap. No file outside the step's list. No new dependency.
- ACTION_BUDGET.actions_per_turn defaults to 2. A value that is not an integer ≥ 1 is unsupported. The bot uses that count, default 2, and stepReach default 2. It does not read the match budget argument.
- A spell already in orthogonal reach is chosen before a basic, and a basic before a step. Among candidates the order is path length, then lowest HP, then earlier placement. Foes are a different side that is not neutral, so the crate is ignored and the player-side merchant can be hunted. HP and the cell are updated on the local book, so a killing first shot is not followed by a shot at the body.
- shotRow and stats use Object.hasOwn. A constructor unit id is not a spell row and does not throw. The step is an orthogonal BFS of at most stepReach, and it does not land on the foe. No RNG.
- acceptedCheck allows ability or interact only when the before snapshot has rules, the actor is living and on the side, the aim is a unit, and durationMs is null. A move off the board is still refused. Off-rules worlds still require a move. SNAPSHOT_KEYS already listed rules; divergentSnapshotKey is that first differing key, exported next to it.

## Next step (optional proposal)
- P1-6 can add the player door for choosing line-shot. Mana spend and contest AI stay later.
