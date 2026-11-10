# Hand-back step-08-project-reader r1
Step file: handoff/steps/step-08-project-reader.md
Base commit: 12ae9065afb2062ad6fac154ee056637d9fc27fc     Head commit: 087a74945cf02d5d7594bb0c3c4bc11068f0477c     Branch: step/step-08-project-reader-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.dependency-cruiser.cjs
A	src/project/read/guard.ts
A	src/project/read/index.ts
A	src/project/read/manifest.ts
A	src/project/read/map.ts
A	src/project/read/placements.ts
A	src/project/read/stage.ts
A	tests/fixtures/project/map-12x12.json
A	tests/fixtures/project/map-6x9.json
A	tests/fixtures/project/stage-fixed.json
A	tests/fixtures/project/stage-weighted.json
A	tests/project/guard.test.ts
A	tests/project/map.test.ts
A	tests/project/placements.test.ts
A	tests/project/stage.test.ts

## Green
npm test: 108/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Field order, first failing top-level key: the version guard runs first (not an object, wrong kind, bad field formatVersion, then needsMigration). readMap then checks id, rev, cols, rows, logic, objects. readStage then checks id, rev, mapRef, playerSpawns, neutrals, seed, sides, enemyPool, loadout, rules. Any failure inside the manifest project object (id, rev, catalogueRev, settings.wrapEdges, settings.occupancy, stages, rules, loadout) is "bad field project".
- Narrowing is isObj, isInt, isStr and strs in guard.ts. Those helpers are imported by the sibling readers and are not re-exported from index.ts. A plain object is a non-null non-array object. No casts onto core types.
- Integers: rev and catalogueRev ≥ 0; cols and rows ≥ 1; seed any integer, including negatives, or null (absent is omitted, null is kept); terrain ints ≥ 0 with length cols*rows; cells any integer; footprint w and h ≥ 1; picks ≥ 0; wave turn any integer, and only turn === 0 is placed; count ≥ 0; loadout size ≥ 0. Weight is any number and is stored as written; a non-finite or ≤ 0 weight becomes 0 only when resolvePlacements builds the picker list. Absent optional fields are omitted. A side value is any string. An empty sides object is kept when the key is present. Facing is the placement's facing ?? null, never taken from the side. Side defaults are loadout "player", enemy pool "rival", neutrals "neutral".
- Notice messages, which the tests do not pin: notPlaced is "not placed" (one per group when chosen units or turn-0 pool units outnumber slots; fixed entries never emit it; an off-map cell consumes that slot and does not also emit notPlaced); spawnOffMap is "spawn off the map" with at set to that cell; poolExhausted is "pool exhausted" (one notice; a non-integer, negative, out-of-range or zero-weight picker index stops the picks). pick receives a copy of the current weights. allowRepeats false sets that index to 0 after a successful pick. On-map is only 0 ≤ c < cols and 0 ≤ r < rows. readMap, readStage and readManifest return notices: []. stageSeed returns the number when seed is a number, otherwise null. The input JSON is never mutated.
- Diff excluding the four fixtures is 378 insertions and 1 deletion (379 changed lines; over ~370, under 400). The only depcruise change is the CN-005 line. No extra source files. The step text omitted kind, formatVersion and rev on map-12x12.json and stage-weighted.json; both are filled like the sibling fixture: the current kind and formatVersion, rev 1.
- Drive names step-08-project-reader-r1.bundle and HAND-BACK-step-08-project-reader-r1.md were free, so this chat uploads those. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 09 harness: read the manifest, map and stage; createGrid with settings.wrapEdges; log stageSeed(stage) ?? the host seed; resolvePlacements with the pool stream streamSeed(seed, "pool"); place each unit with units.place. Not built here.

## Kit files used
- handoff/steps/step-08-project-reader.md (latest main) 2ec13a5abb97eee0e588f2f68dd27e16caab99c716ff52b1ab46752c91b0220c
- handoff/change-notices/CN-005-project-reads-notice.md (latest main) 6cc667753fcd5e24d8b8ba12f0b9b3488a10488cc5cfe8c75fc8b14ebd50077a
- BUILD_GUIDE.md (latest main, not committed; §3 L51 is the CN-005 notice import) 7917a0e192619dbaea1c36c4a76d32f7e90f679c62af4b0c67db28700539b918
- BUILD_GUIDE.md on base 12ae906 is 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20 and was left untouched.
- handoff/HAND-BACK.md (base 12ae906) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
