# Hand-back step-07-events-log r1
Step file: handoff/steps/step-07-events-log.md
Base commit: fb9de465cb2b149dd73d015f915e220098c1b249     Head commit: 03b0ac8843c1d66b56c3789ab1995487450b95e5     Branch: step/step-07-events-log-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/core/events/bus.ts
A	src/core/events/index.ts
A	src/core/events/types.ts
A	src/core/log/index.ts
A	src/core/log/log.ts
A	src/core/log/types.ts
A	tests/core/bus.test.ts
A	tests/core/log.test.ts
A	tests/core/replay.test.ts

## Green
npm test: 96/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- RangeError messages the step left unnamed: a core-name collision or a duplicate mode type is "event type"; emit or on of an unregistered type is "unregistered event"; a tick that is not an integer ≥ 0, or is earlier than the previous tick, is "tick". Equal ticks are allowed.
- parseLog never throws. Errors, in this order: "not JSON"; "missing header or entries" (checked before the version); "unsupported log formatVersion <v>" (version 2 is exactly "unsupported log formatVersion 2"); "bad header"; "bad entry". A missing formatVersion uses the unsupported message, not "bad header".
- createLog copies the header and does not re-check it or the action body; append checks only the tick. parseLog requires seed to be any integer (negatives allowed), durationMs null or an integer ≥ 0, and ticks integers ≥ 0. turns is any number or null, including fractions and negatives. Aim c and r are numbers, not required to be integers. A non-integer durationMs passed to createLog will not parse back.
- Rebuild drops unknown JSON keys and writes the quoted key order: header seed, formatVersion, engineVersion, projectHash; entry seq, tick, action; action id, kind, actor, target, durationMs, turns, effects, then via; aim pipe, unitId, fallbackAt or pipe, at, edge; square c, r; via presentation, ref. Absent fallbackAt, edge and via.ref are omitted. effects is copied on pack.
- registry.mode is required by the type and is not stored. history() and entries() return shallow copies of the arrays. Delivery snapshots the listener list: an unsubscribe during delivery is skipped, and a subscribe during delivery does not see the current event. An onError listener that throws is swallowed and not reported again. If onAppend throws, the entry is already stored.
- core does not import src/index.ts; the tests pass ENGINE_VERSION into the header. Diff is 398 insertions, 0 deletions, the nine files in the list and no others.
- Drive already had step-07-events-log-r1.bundle and HAND-BACK-step-07-events-log-r1.md, uploaded in another chat. This chat uploads step-07-events-log-r1-chatB.bundle and HAND-BACK-step-07-r1-chatB.md. Those other files were not moved, renamed, overwritten or deleted.

## Kit files used
- handoff/steps/step-07-events-log.md (origin/main) 36e662493ba9fa112af38f884771a77c0b2d042df91f010476b3fed9417c7326
- The copy on base fb9de46 is 81af2addf5c47bb2ec9cdc5d54467c0c3894a3371a502a8b5736ff14be2a466f (published base lines only). The implementation follows origin/main.
- BUILD_GUIDE.md (base fb9de46, same bytes as origin/main) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20
- handoff/HAND-BACK.md (base fb9de46, same bytes as origin/main) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
- No Change Notice with this step.
