# Hand-back step-16-door-guard r1
Step file: handoff/steps/step-16-door-guard.md
Base commit: adce77478e54ae4b38274e5f38f3ef3588e9c0c1     Head commit: 31c081f3a0d89e6d88a42da57e8dc0c6d764bb06     Branch: step/step-16-door-guard-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/index.ts
A	src/btf-adapters/src/stage-limits.ts
M	src/project/read/guard.ts
M	src/project/read/index.ts
M	src/project/read/map.ts
M	src/project/read/stage.ts
M	src/sim/driver-phase.ts
M	src/sim/exploit-docs.ts
M	src/sim/player.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/project/door-guard.test.ts
M	tests/project/guard.test.ts
M	tests/project/placements.test.ts
M	tests/project/stage.test.ts
M	tests/sim/bot.test.ts
A	tests/sim/door-guard.test.ts
M	tests/sim/exploit-docs.test.ts
M	tests/sim/exploit.test.ts
M	tests/sim/input.ts
M	tests/sim/world.test.ts

## Green
npm test: 198/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- `malformed` is exactly three shapes, the reads that threw: the fed intent is not a non-array object; the aim is present (not `undefined` or `null`) and not a non-array object; or `intent.type === "TargetCell"` and `intent.at` is not a non-array object. A value that can be read keeps its old reason. A numeric or unknown type stays `noEvent`, an `at` object with a non-integer or out-of-range field stays `offGrid`, and an array `unitId` stays `noUnit`.
- The driver never reads `input.intent` or `input.aim`. It copies the input into `shaped` when the input is a non-null object (an array counts) and otherwise uses `{}`, then feeds `shaped.intent` and `shaped.aim`. The recorded intent is `intent ?? null`, and the aim the same, so a missing value is JSON null and `runChaos` can record and replay it. The step stays typed `Intent` by a cast, so `chaos.ts` is not widened.
- `StageLimits` is required. There is no default and no cap number in `src/project` or `src/sim`. Over a cap is refused, not clamped, as `bad field enemyPool`, the top-level key every nested stage error already names. Limits that are not integers ≥ 0 throw `RangeError` before the document is read. BTF's `{ picks: 144, waveUnits: 144 }` lives only in `src/btf-adapters`.
- A palette value that is not a string is still `bad field logic`, including an own `__proto__` key. Only a string `__proto__` is dropped, with the one notice, on both success returns. Accepting a non-string `__proto__` would move the docs pins (hunt 158/342, stage-fixed 590/1410, stage-weighted 612/1388). The step's pins keep those refusals. The every-reject test casts `at: null` through `unknown`, because `as Intent` is not a type overlap under `tsc`.
- No Change Notice. The seventh `PlayerReject` lives only in `src/sim/types.ts`. Diff is 169 insertions and 50 deletions (219 changed lines) on the 21 named files, under 235. `main` was not committed to.
- `step-16-door-guard-r1-chatB.bundle` and `HAND-BACK-step-16-door-guard-r1-chatB.md` were already on Drive and this chat did not upload them, so they were left untouched. This chat uploads `step-16-door-guard-r1-chatB2.bundle` and `HAND-BACK-step-16-door-guard-r1-chatB2.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 17 is the memory guard (clean dispose safe to call twice, an event-bus history cap with the match log kept, a freed-world GC test, a report-only heap-growth smoke). Not built here. QA can start the 25-clean-runs count on the six pinned lines.

## Kit files used
- handoff/steps/step-16-door-guard.md (user-supplied sha256; not in this tree) e3f400764eeb835caf5a156abc21ca662a3f43c5b5ae00706f10f00e7486a7b7
- BUILD_GUIDE.md (base adce774; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base adce774) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
