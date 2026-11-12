# Hand-back step-21-hard-limits r1
Step file: handoff/steps/step-21-hard-limits.md
Base commit: 5fefa6f18c8e48d51f8216438d8e1d9163fdb9d0     Head commit: a5301db22d22d5728d958e94934d70db94065bc8     Branch: step/step-21-hard-limits-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/index.ts
A	src/btf-adapters/src/match-limits.ts
M	src/core/clock/clock.ts
M	src/core/events/types.ts
A	src/core/limits.ts
M	src/core/log/log.ts
M	src/core/plain.ts
M	src/core/unit/units.ts
M	src/rules/levels/levels.ts
M	src/runtime/input/gestures.ts
M	src/sim/actions.ts
M	src/sim/run.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/sim/hard-limits.test.ts
## Green
npm test: 492/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Caps are checked in this order. `submit` copies the action, then `readAction(copy, world.limits)`. If the log already holds `limits.entries` entries it pushes `logFull` and returns; else if the clock tick is above `limits.ticks` it pushes `timeLimit` and returns; only then does the step-20 refusal run. `logFull` is first so a full log never reaches `append` (that throws) and a bad action on a full log is still `logFull`. Entries are checked before ticks, so running out of ticks alone says `timeLimit`, and a full log at a late tick says `logFull`. A tick equal to `limits.ticks` is logged. The match is not ended.
- `replay` refuses before any tick, after `createWorld` and the seed check: `untilTick` must be an integer >= 0 and no greater than `world.limits.ticks`, and `lastSeq()` must be no greater than `limits.entries`, or it throws `Error("replay: tick or log over the limits")`. `lastSeq()` is the entry count, so a long log is not copied just to measure it. `restore` still checks tick, `clockMs` and `logSeq` first, so an inconsistent snapshot of tick `1e9` still says it does not match the log; a consistent forged tick of 2³¹ − 1 then dies in `replay` before the loop. Those refusals returned in a few milliseconds, under 1,500.
- Every notice a world keeps goes through `note` in `src/sim/world.ts`. While the list is shorter than `limits.notices`, the notice is pushed. After that, one line sits at index `limits.notices`: `{ code: "noticesCapped", message: "and N more" }`. N is kept on a `WeakMap` keyed by that array, because the length stays at the cap plus one and cannot carry the count. Create-time grid, placement and unit notices go through it, and so do `actionRefused`, `unlockFailed`, `moveFailed`, `actionUnsupported`, `logFull` and `timeLimit`. Cap 3 and ten refused moves: 4 lines, the last `"and 7 more"`.
- `plainCopy`'s default `nodes` is `PLAIN_NODES` (1,048,576). `createWorld` and `replay` copy the input at `PLAIN_DEPTH` (32). An array whose integer length is above the values left is still refused before any item is read, including when `nodes` is passed as `Infinity`. `restore` copies the snapshot at depth 5, as in step 20, and copies the input by calling `replay`. `clock.after` still does not copy `ms` and `cb`.
- The offer builds candidates with `seen = new Set(have)` and pushes each pool id that is not already in the set, first one wins, pool order unchanged. The `rng.int` loop is the same partial shuffle. Twenty seeds match that base draw, written out in the test. No other change in this step draws. `npm run sim` is `48/2 afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `22/28 b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`. The smoke lines did not move.
- `createWorld` checks `withinCeilings` immediately after the plain copy and before any document is read. Absent `limits` means `DEFAULT_MATCH_LIMITS`. `world.limits` is that copied object, or the frozen default. `BTF_MATCH_LIMITS` is its own frozen copy of the same numbers. `createLog` throws the seed `RangeError` and does not re-check ceilings; `createWorld` already did, and a direct caller passes a `MatchLimits`. `parseLog` returns `"too many entries"` from `entries.length` before any entry is read, and `"bad header"` for a seed or header text outside the caps, so it does not throw that `RangeError`.
- `createClock` copies `opts` at depth 1. If that copy is not a record (a throwing getter or a proxy), the clock uses the defaults and does not throw. `createGestureMapper` copies `opts` the same way and reads `board.cols`, `rows` and `unitAt` once. Gesture options have no defaults, so a copy that is not a record is still checked on the caller's object. `units.place` stores `cellOf(p.at)`. A non-cell is `ok: false` with a `placeOffMap` notice that has no `at`, because there is no cell to name. Editing the caller's cell afterwards moves nothing.
- Still read live, on purpose, not in this step's file list: `setOffset` keeps the caller's offset, and `feedIntent` still reads the live intent after the step-16 guard. The drivers still advance the clock past `limits.ticks`; only `submit` says `timeLimit`. `INT_MAX` is exported as specified and unused until step 22. The diff is 190 insertions and 25 deletions (215 changed lines) on the 15 named files, under 400. No Change Notice. `main` was not committed to. The branch starts at `5fefa6f`, not at the kit commit. This chat uploads `step-21-hard-limits-r1-chatB.bundle` and `HAND-BACK-step-21-hard-limits-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 22 (H2b) should put the document caps (map, stage, levels, recipe) and the per-file notice cap on these same doors, and apply `INT_MAX` to document whole numbers.

## Kit files used
- handoff/steps/step-21-hard-limits.md (on origin/main; not in this tree) 41d3aed8bbbb00d21f177bfc1734ba57a6c83536b26c12bfb703ef92852ef789
- BUILD_GUIDE.md (base 5fefa6f; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 5fefa6f) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
