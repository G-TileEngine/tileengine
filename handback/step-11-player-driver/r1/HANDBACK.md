# Hand-back step-11-player-driver r1
Step file: handoff/steps/step-11-player-driver.md
Base commit: e9d48204668a58af1944e0b21909c2627a5ef2c7     Head commit: 214471acde15f0fd29ca7db30df9524f9fddc25a     Branch: step/step-11-player-driver-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/sim/driver-phase.ts
M	src/sim/index.ts
A	src/sim/player.ts
M	src/sim/types.ts
A	tests/sim/player.test.ts
A	tests/sim/seats.ts

## Green
npm test: 166/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- RangeError texts are "createPlayer: moveMs must be null or an integer >= 0" and "runMatch: bad seats". A missing battle phase throws Error "player: battle phase missing". runMatch checks seats before BATTLE_READY.
- Selection is a closure string or null on the player, not in the snapshot. An accepted SELECT_UNIT stores unitId. Every other accepted event clears it. A reject leaves the selection, units, occupancy, the log, notices and phases alone.
- Edges are mergeTables(TABLES) once. The key is from|event.type. The player does not retype a table. nextId runs only while building an accepted tap-move.
- AI and seated moves share land(): ms is 0 when durationMs is null, otherwise max(durationMs, stepMs); replayTicks(ceil(ms/stepMs)); MOVE_DONE; then WAIT and UNIT_DONE {next:"idle"} unless the fuse fired. submit stays on the AI path only (two calls). A seated accepted event is pushed, not marked again.
- An empty intent list stalls with replayTicks(1) and asks again. A non-empty batch ends the turn the way an AI batch does, so one gesture pass is END_TURN. onStep runs after every input, after landing when the step has an action. Unseated sides still call ai.
- No side, moveMs or id default in src/. No new FxOptions key. No Change Notice. BUILD_GUIDE.md, .dependency-cruiser.cjs and src/types/core-types.ts were not edited.
- Diff is 254 insertions and 13 deletions (267 changed lines) on the six named files. player.ts is 53 lines, player.test.ts is 120, seats.ts is 13. Under 294 and under ~270.
- Drive already had step-11-player-driver-r1.bundle and HAND-BACK-step-11-player-driver-r1.md, which this chat did not upload. This chat uploads step-11-player-driver-r1-chatB.bundle and HAND-BACK-step-11-player-driver-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Chaos step B can seat both sides and hash snapshot(world) from onStep after every input. Not built here.

## Kit files used
- handoff/steps/step-11-player-driver.md (GitHub main, not in this branch) 1fe7b415ec397bd8d8a8e809677af57588b9dd97e8618d54c7a531e7b7806bfd
- BUILD_GUIDE.md (base e9d4820; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base e9d4820) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
