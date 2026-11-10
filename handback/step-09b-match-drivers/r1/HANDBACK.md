# Hand-back step-09b-match-drivers r1
Step file: handoff/steps/step-09b-match-drivers.md
Base commit: 92e4e96c76f209ed2eb3629fd52e07c517de51d6     Head commit: c3387e40d6e68273214c713259e41d4dfa71e69d     Branch: step/step-09b-match-drivers-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/sim/driver-phase.ts
A	src/sim/driver-tick.ts
M	src/sim/index.ts
M	src/sim/run.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/sim/ai.ts
A	tests/sim/match.test.ts
M	tests/sim/replay.test.ts
M	tests/sim/world.test.ts

## Green
npm test: 123/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- SimSnapshot keys, in order, are tick, clockMs, rngState, units, occupancy, phases, logSeq. snapshot copies phases with a shallow spread. restore replays to snap.tick, sets world.phases to a fresh copy of snap.phases, then keeps the step-09 JSON.stringify check.
- RangeError text: runMatch throws "runMatch: maxRounds must be an integer >= 1" and "runMatch: maxSimMs must be an integer >= 0". runTicks throws "runTicks: everyMs must be a positive integer multiple of stepMs" and "runTicks: maxSimMs must be an integer >= 0".
- busyUntil is a map from unit id to the clock.now() taken at the start of that tick-driver round, plus max(durationMs, stepMs), or plus 0 when durationMs is null. A unit with no entry is idle (treated as 0). A later action for the same actor in the same ask replaces the earlier busyUntil. Submit does not move time, so every side in the round shares that now.
- If phases.battle is absent, the phase mark calls xGo from "play.loading". createWorld always sets battle to play.loading, so this is only a missing-key fallback. The helper is a const arrow named mark, not a function named go. world.phases is replaced whole.
- Fifty seeds matched the prototype note: stage-fixed 48 win / 2 lose over rounds 4–10; stage-weighted 22 win / 28 lose over rounds 11–18. No draws and no timeouts. The test does not assert those counts.
- Notice messages are unchanged from step 09. Diff is 259 insertions and 8 deletions (267 changed lines), the ten named files, under 320. No extra file. No Change Notice.
- Drive names step-09b-match-drivers-r1.bundle and HAND-BACK-step-09b-match-drivers-r1.md were already taken, so this chat uploads step-09b-match-drivers-r1-chatB.bundle and HAND-BACK-step-09b-match-drivers-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- step-09c can map input intents (SelectUnit, TargetCell, Confirm, Cancel, BoxSelect) onto these events and add the sim script that prints the outcome and a history hash. Not built here.

## Kit files used
- handoff/steps/step-09b-match-drivers.md (latest main) c1894419f3a10d34388fd694ba8936979f5cd8d603ad218f904285bebc3f96e4
- BUILD_GUIDE.md (latest main, same bytes as base 92e4e96) 7917a0e192619dbaea1c36c4a76d32f7e90f679c62af4b0c67db28700539b918
- handoff/HAND-BACK.md (base 92e4e96) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
- No Change Notice with this step.
