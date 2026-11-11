# Hand-back step-12-chaos-harness r1
Step file: handoff/steps/step-12-chaos-harness.md
Base commit: 1ff51d984744c254321d4014afc045ce77a761a2     Head commit: a23a5d5dab4fb5d76afad8431768c9249465335b     Branch: step/step-12-chaos-harness-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/sim/chaos.ts
M	src/sim/index.ts
M	src/sim/types.ts
A	tests/sim/chaos.test.ts

## Green
npm test: 170/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- RangeError text is "chaos: engineSha and node are required" when engineSha or node is "". Replay errors, in order, are "chaos: record is for <record engineSha> on Node <record node>", "chaos: checks differ from the record", "chaos: project differs from the record", and "chaos: world seed <world.seed> is not the record seed <run.seed>". A move for another side throws "chaos: replay diverged at call <n>".
- before and fed are snapshots taken by wrapping each player's feed. after is the snapshot in onStep, after landing. prev starts as the snapshot right after createWorld. The first broken check throws one Error instance ("chaos: stop"); runMatch is caught only when that same object comes back. Any other error propagates. There is no second runMatch.
- Hook calls share one counter, incremented even when the list is empty. Each move stores that call, the step tick, a JSON copy of the intent, and a fresh aim or null. Replay call n returns the recorded moves with that call, in order.
- (a)5 reports clockMs first (expected tick times stepMs). A tick-order miss uses the first broken bound: prev against before, else before against fed, else fed against after. (a)9 uses prev for the gap and before otherwise, and the first of the keys it names. (a)1 expected is the living-unit list and actual is the occupancy list. (a)6 runs only on an accepted step.
- (a)4 replays the log to the live tick, copies the live phases onto that world, then compares tick, clockMs, rngState, units, occupancy, phases, logSeq with JSON.stringify. Expected is the replayed value and actual is live. stepIndex is moves.length. The shared runner is named play (one definition, one call from runChaos, one from replayChaos).
- Checks read the step snapshots. world is used only for grid geometry and stepMs. CHAOS_CHECKS is not applied unless the caller passes it. presets are a JSON copy. nextId is idPrefix plus 1, 2, … No new FxOptions key. No Change Notice. BUILD_GUIDE.md, .dependency-cruiser.cjs, and src/types/core-types.ts were not edited.
- Diff is 267 insertions and 1 deletion (268 changed lines) on the four named files. That is past ~265 and under 280. chaos.ts is 124 lines and chaos.test.ts is 98.
- Drive already had step-12-chaos-harness-r1.bundle and HAND-BACK-step-12-chaos-harness-r1.md, which this chat did not upload. This chat uploads step-12-chaos-harness-r1-chatB.bundle and HAND-BACK-step-12-chaos-harness-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Chaos step C can put generators on an IntentHook and shrink a record by dropping moves while replayChaos keeps the same invariant and key. Not built here.

## Kit files used
- handoff/steps/step-12-chaos-harness.md (user-supplied sha256) c32bbc0a256571a4cd46f669f0120c3edd8fd1033bba0612eb9c446e04b68b45
- BUILD_GUIDE.md (base 1ff51d9; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 1ff51d9) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
