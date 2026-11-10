# Hand-back step-04-units-occupancy r1
Step file: handoff/steps/step-04-units-occupancy.md
Base commit: 3e93c30d1e0a08c4b4d6536833302bdbea0cae79     Head commit: 5a924349f5f9849fd74479eee3ab344a1d1380b7     Branch: step/step-04-units-occupancy-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/core/unit/index.ts
A	src/core/unit/reach.ts
A	src/core/unit/types.ts
A	src/core/unit/units.ts
A	tests/core/push.test.ts
A	tests/core/reach.test.ts
A	tests/core/units.test.ts
## Green
npm test: 62/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Notice messages: placeOffMap "off map", placeClosed "closed cell", placeOccupied "cell taken", each with at set to the cell. occupancyUnsupported is "occupancy unsupported" and has no at. Any occupancy other than "strict1" warns once at creation and still runs strict1, so the other policy names are not written under src/core. units.occupancy is always "strict1", the policy actually used.
- Instance ids use one store-wide counter of successful placements, in placement order. The second success is #2 even when the unitId differs. A refused place does not increment. canHold on place sees a draft whose id is still empty; the number is written only after the policy accepts.
- The one occupancy table is a Map from cell index to living ids in arrival order. Unit records live in a Map keyed by string, plus an array for all(). occupantsAt returns a shallow copy; occupantAt is the first id, or undefined off the map. remove clears the offset, sets alive false, and drops the id in the same call. No hook.
- Facing is taken only from the placement and is never inferred. setFacing stores the value it is given. An offset never changes at. The grid's inBounds requires integer c and r, so a fractional cell is off the map (placeOffMap) or outOfBounds.
- Push asks canForceInto first, then STRICT1 on the other living occupants of the next cell. The blocker is the grid's blocker, or "unit". Occupancy is written once, at the end. cellsRemaining is cells minus moved. An unknown id returns at {-1,-1}. A non-integer cells below 1, or a removed unit, returns the current cell with moved 0, cellsRemaining 0, and no hooks. pushBlocked runs only when push_into_walls is true and the push stopped early, then landed with cause forced only if moved is at least 1.
- moveTo does not look at walls or paths. Same cell is ok and calls no hook, and that check is before closed and occupied. reach defaults pass to allies. isBlocked skips the mover: none blocks every other living unit, allies blocks another side, all blocks nobody. Cells that hold another living unit are then dropped, so the mover's own cell stays. Result order follows grid.reachable. maxSteps is not validated. Unknown or removed returns an empty list.
- Diff excluding the lockfile and handback is 399 insertions and 0 deletions: under 400 and past the ~360 watch point. Some test asserts share a line so the seven files stay inside that cap. units.ts is 84 lines and reach.ts is 24.

## Kit files used
- handoff/steps/step-04-units-occupancy.md (origin/main) c708a62e9d32b1a9b6d3bac328c77d808d56ea4941e9493c0ab602d002e67bb6
- BUILD_GUIDE.md (base 3e93c30, same bytes as origin/main) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20
- handoff/HAND-BACK.md (base 3e93c30, same bytes as origin/main) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777

## Next step (optional proposal)
- step-05-rng, from handoff/steps/step-05-rng.md on main. This step does not roll dice or emit the event bus.
