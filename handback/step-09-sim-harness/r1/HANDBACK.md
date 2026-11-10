# Hand-back step-09-sim-harness r1
Step file: handoff/steps/step-09-sim-harness.md
Base commit: 193900d463ed58a3e9a2c079c277821ca6013a04     Head commit: 741130726b283e182ecc219f68d6d66ddc3a8cfd     Branch: step/step-09-sim-harness-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/sim/actions.ts
A	src/sim/index.ts
A	src/sim/run.ts
A	src/sim/types.ts
A	src/sim/world.ts
A	tests/sim/actions.test.ts
A	tests/sim/input.ts
A	tests/sim/replay.test.ts
A	tests/sim/world.test.ts

## Green
npm test: 117/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Snapshot copies each UnitState in this order: id, unitId, side, a fresh at {c, r}, offset (null stays null; an object becomes a fresh {dx, dy}), facing, alive. Occupancy is [index, the occupantsAt copy] for every non-empty cell from index 0 through cols*rows-1. world.notices is a new array: grid notices, then placement notices, then unit notices, so occupancyUnsupported stays with the units.
- Notice messages the step left unnamed: moveFailed is "move failed", and at is a fresh {c, r} of the tile, not the action's object. actionUnsupported is "action unsupported" and has no at. wait returns before either notice, whatever its target is. A move whose target is null or a unit aim is actionUnsupported. A tile aim that also carries an edge is still a move.
- RangeError text: replayTicks throws "replayTicks: n must be an integer >= 0"; advance throws "advance: ms must be an integer >= 0 and a multiple of stepMs". A world seed that is not the log header seed throws Error("seed <world.seed>"). Reader failures and the mapRef error use the strings the step names. occupancy and terrain are passed to createUnits only when those fields are present.
- The move() helper types durationMs as number | null, default 200, so a move can be applied immediately. The wait/fail test needs that null. Instance ids, side defaults and placement order are unchanged from steps 04 and 08. world.rng is createRng(streamSeed(seed, "match")); v1 actions do not draw it.
- Diff is 294 insertions and 0 deletions, the nine new files, under 360 and under ~340. No extra files. No Change Notice. .dependency-cruiser.cjs is untouched.
- Drive names step-09-sim-harness-r1.bundle and HAND-BACK-step-09-sim-harness-r1.md were free, so this chat uploads those. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- The next harness step can add the phase and tick drivers, proposeActions(world, side, budget) with no phase parameter, and phases on SimSnapshot, on top of submit and advance. Not built here.

## Kit files used
- handoff/steps/step-09-sim-harness.md (latest main) d8d333a8751bc8d90a07443503d4f85218d73f8d6da87961e848901980569b31
- BUILD_GUIDE.md (latest main, same bytes as base 193900d) 7917a0e192619dbaea1c36c4a76d32f7e90f679c62af4b0c67db28700539b918
- handoff/HAND-BACK.md (base 193900d) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
- No Change Notice with this step.
