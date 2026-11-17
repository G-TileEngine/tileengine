# Hand-back step-p1-1-walk r1
Step file: handoff/steps/step-p1-1-walk.md (sha256 39a9bbaca9cc6e2f2d4eb3ec722c1b63766d9ae76b19d7842d3bdc1e4d5ca630)
Base commit: 16fabf3d63f098ffd528a636f17e65279a07dacf     Head commit: 3134cc75dfdf13eec22c873cc87efe5e4982bf95     Branch: step/step-p1-1-walk-r1-chatA     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/btf-adapters/src/btf-defaults/move.ts
M	src/btf-adapters/src/index.ts
A	src/rules/move/index.ts
A	src/rules/move/path.ts
A	src/rules/move/step-pattern.ts
A	src/rules/move/targets.ts
M	src/sim/player.ts
M	src/sim/types.ts
A	tests/parity/step-pattern.parity.test.ts
A	tests/rules/move-qa.test.ts
A	tests/rules/move.test.ts
M	tests/sim/bot.test.ts

## Green
npm test: 882/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

npm ci exit 0. deps: no dependency violations (127 modules, 408 dependencies cruised). check:state OK (src). check:law OK (src).

smoke: 0 failed
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress A counts 27/0/0 (p95 under 4 ms)
stress B counts 113/0/0
stress C counts 181/0/0
stress E counts 181/0/0
stress L counts 27/373/0 (p95 under 2 ms)
chaos smoke stage-fixed seeds 1-50: runs 50 failed 0 steps 3120 rejects 0
chaos smoke stage-weighted seeds 1-50: runs 50 failed 0 steps 5542 rejects 0

## Shipped tests (sha256, unchanged)
cc00772294e092881392a0637eeee68e95e4d170617fadf37842b81a16dd5d4b  tests/rules/move.test.ts
82520ebc565b98373410811811a762859feccca1516613688e79c1cd551dbd4a  tests/sim/bot.test.ts
4d5c90e70c23ccfc47fadfd010372458f734768228062e30edc31e2830ac87d7  tests/parity/step-pattern.parity.test.ts
37b8584ceb0f9e12ee122fc855612ad5b331af708c8e08ef28050d73ee9c010c  tests/rules/move-qa.test.ts

## Helpers & self-review (required)
- Helper 1 (player hook): asked to check the player.ts / types.ts hook against rulings 8–9 (opt-in step, notReachable, path only on an accepted walk, durationMs = moveMs × path.length, no log-shape change) → PASS, no change.
- Helper 2 (walk rules): asked to check step-pattern, path and targets against rulings 1–6 (reach, clamp, straight rays, bodies block, dead walker, inBounds before index) → PASS. One residual it named was real: the StepRule and the notes array were frozen, the stepClamped notice object was not. Fixed in the head commit by freezing the notice. Other residuals it named are unpinned, not bugs: message text is the ruling string and no test asserts it; non-whole max_step is unsupported inside install but no shipped test calls it (non-finite never reaches install; the slider door emits invalidValue); the other six pattern ids are unlisted by tests; no test puts a living unit across a wall (targetsFor uses grid.step); same-cell occupant order relies on a stable sort and strict1 never stacks two living units; a dead id still sitting in occupantsAt is untested because Units.remove drops occupancy; non-integer reach is not rejected by walks (callers only pass integers from StepRule); path.slice() is shallow so prefixes of one ray share Sq objects.
- Self-review: Acceptance — green 882/0 none cancelled/skipped/todo, typecheck/lint/deps/check:state/check:law exit 0: done; smoke, sim and stress print the pinned lines: done; pin files empty diff: done; forbidden dirs empty, sim only player.ts and types.ts, btf only the new move.ts and one index export: done; four shipped tests byte-identical: done; dead unit and off-board alias aims pinned by move-qa: done; per-file caps held (step-pattern 20/30, path 35/35, targets 26/26, index 3/4, player 7+3=10/12, types 4+2=6/11, btf move 6/18, btf index +1/2, bot.test 1+1=2/2) and 253+6=259 ≤ 300: done; no Math.random, Date, timers, Card/Deck, and check:law OK: done; branch, bundle and this last-commit HANDBACK: done.
- Self-review: QA G1 done (hashes match; plant scripts p1-1-plants.py are not in the tree, so they were not re-run — the shipped tests are the pins); G2 done (882/0, floor 882); G3 done (typecheck, lint, deps, check:state, check:law exit 0); G4 done (STEP_PATTERN, walks, reachCells, walkTo, targetsFor and the PlayerOptions/PlayerStep/PlayerReject additions match the quoted interfaces); G5 done (no forbidden dirs, no pin files); G6 done (chaos 3120/0 and 5542/0, histories unchanged because step is opt-in); G7 done (259 changed lines, stat.txt); G8 done (check:law OK, cites are towerChess.ts:<line>); G9 done (decisions below name every default); G10 done (this section).

## Decisions & deviations (5–10 lines)
- BTF numbers are written twice, once in step-pattern (pattern default orthogonal-1, max_step default 2) and once as data in BTF_MOVE_DEFAULTS {pattern:"orthogonal-1", max_step:2, bodies_block:true}. Rules cannot import btf-adapters (depcruise rules-below-runtime). The parity test asserts the knob defaults equal that object.
- stepClamped message is exactly "step-pattern.pattern <p> reaches <n>, max_step <m>". It lives only on StepRule.notes, never on the Installed notes (the test asserts cut.notes.length === 0). The notice object, the notes array and the StepRule are all frozen.
- The max_step unsupported detail is "<value> is not a whole number ≥ 1" (U+2265). No test pins that string. A slider value above its max is a B1 outOfRange warning and is still used when it is a whole number ≥ 1.
- walkTo checks grid.inBounds(to) before grid.index, so (6,6) and (-6,8) return null instead of aliasing an on-board cell. Each map entry is its own array (path.slice()); the start cell is excluded; a ray stops before any living body, own team included.
- Depcruise reports 127 modules and 408 dependencies. The kit text said proto 124/395 against an older base; this Base is later, so the higher count is that base plus the new modules. Exit 0 is the gate. Law 13: walks builds one Map per call, at most 8 cells (4 rays × ≤ 2), and drops it on return. Nothing is retained.
- CHROME_PATH=/opt/pw-browsers/chromium-1255/chrome-linux64/chrome is the smoke environment only; /usr/bin/google-chrome is not on this machine and no code changed for it. No comment says S2 or P1 S1. The G1 plant scripts are not in the tree, so they were not re-run.

## Next step (optional proposal)
- P1-2 should remove a unit that reaches 0 HP in the same step. walks and targetsFor test alive, not HP, so a 0-HP body still on the cell would block a walk and show up as a target.
