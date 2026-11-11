# Hand-back step-13-chaos-generators r1
Step file: handoff/steps/step-13-chaos-generators.md
Base commit: 9dad92a589ec53d71aa1564916a43dcd439e883d     Head commit: 874eb1c27d39cd1c810bfcadb3934d295036a2ef     Branch: step/step-13-chaos-generators-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/sim/chaos-gen.ts
M	src/sim/index.ts
A	src/sim/shrink.ts
M	src/sim/types.ts
A	tests/sim/chaos-gen.test.ts

## Green
npm test: 176/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- RangeError text is "chaos-gen: stream must be a non-empty name other than match or pool", "chaos-gen: mix keys must be exactly the nine kinds", "chaos-gen: every weight must be finite and >= 0, and not all zero", "chaos-gen: burst must be an integer >= 1", and "chaos-gen: gestures are required when the gesture weight is above zero". A bad GestureOptions throws that mapper's own RangeError. A missing kind after a good mix throws Error("chaos-gen: kind"), which the weight check already rules out.
- The hook stores one { world, rng } on the first call, after the settings check. A later call with another world throws Error("chaos-gen: one generator per run"). Settings run on every call. When gestures is not null that check calls createGestureMapper once, on a 1 by 1 board. The stream is createRng(streamSeed(world.seed, gen.stream)). world.rng is never read.
- Taken cells are in bounds, row then column, and are closed or already occupied, including the selected unit's own cell. Foreign ids are the living units of every other side, in units.all() order, then the unknown id. Draws follow the written order; a cell() inside an argument is drawn before that pick. gestureRecipes uses the step's p(), so the x offset defaults to 0. runChaosGen copies the caller's presets and then sets chaosGen.
- shrinkChaos replays the input record first. An empty kept list is not a try. tries += 1 once per runChaos. A candidate is kept only when the failure has the input record's invariant and firstDivergentSnapshotKey. Chunk size starts at ceil(n / 2), written as n / (1 + 1) because these files may use only the digits 0 and 1. After a keep, size becomes min(size, ceil(new n / 2)) and the next pass starts at 0. After a miss, size 1 stops; otherwise size becomes ceil(size / 2). serve gives the next kept call's group only to that side. The result is replayed and must JSON-equal the shrunk record.
- The smoke keeps legal at 6 even when seed % 9 is 0. The step sets legal apart from "every other kind", and that is what prints the prototype lines (1730/278 and 3154/563). Seeds 9 and 18 therefore drop no index kind. Even seeds still set gesture to 0, and gestures is null on even seeds and the 09c thresholds on odd seeds.
- No Change Notice. src/sim/chaos.ts stays 124 lines and was not edited. BUILD_GUIDE.md, .dependency-cruiser.cjs, and src/types/core-types.ts were not edited. Diff is 214 insertions and 2 deletions (216 changed lines) on the five named files.
- Drive already had step-13-chaos-generators-r1.bundle and HAND-BACK-step-13-chaos-generators-r1.md, which this chat did not upload. This chat uploads step-13-chaos-generators-r1-chatB.bundle and HAND-BACK-step-13-chaos-generators-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- A chaos:replay command and a checked-in failure-records folder can sit on these two functions. Not built here.

## Kit files used
- handoff/steps/step-13-chaos-generators.md (user-supplied sha256) 3ec1317fd5135ae7643eb8adcb0c398263f53b5ff1dccdacc95add81402755ee
- BUILD_GUIDE.md (base 9dad92a; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 9dad92a) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
