# Hand-back step-20-every-door r1
Step file: handoff/steps/step-20-every-door.md
Base commit: ad627d0d5254f9d919527477b76c1e132519610b     Head commit: 51c74dcc434c11a9db1fb4f8f93b789e2315e0eb     Branch: step/step-20-every-door-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/core/log/index.ts
M	src/core/log/log.ts
A	src/core/plain.ts
M	src/core/unit/units.ts
M	src/rules/levels/levels.ts
M	src/runtime/input/gestures.ts
M	src/sim/actions.ts
M	src/sim/chaos-gen.ts
M	src/sim/run.ts
M	src/sim/world.ts
M	tests/core/clock.test.ts
M	tests/core/dispose.test.ts
A	tests/sim/every-door.test.ts
M	tests/sim/exploit-levels.test.ts
M	tests/sim/levels.test.ts

## Green
npm test: 483/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Each door reads the caller once, through `plainCopy`, then checks and uses only that frozen copy. Depths: `submit` / `readAction` / `append` use 3 (action, target, cell); `moveTo` uses `cellOf` (depth 1); `createLevels` uses 3 (setup, rules and pools, then the arrays); `createWorld` and `replay` use `Infinity`; `restore` uses 5; the gesture mapper uses 1; chaos-gen uses 2 when the hook is made. A flip getter's read count is 1 in the door-copy, log, unlock and `createLevels` tests. `clock.after` does not copy: `ms` and `cb` are not documents, and a bad pair is the RangeError below.
- `plainCopy` never throws. It counts every value, including the container, toward `nodes` (default `Infinity`). An array `length` is read once and must be an integer >= 0 and no greater than the values still left, before any item is read, so `nodes` 3 refuses `[1, 2, 3]` and 4 accepts it, and a lying `Infinity` or `1e9` length is `NOT_PLAIN` with no item read. A hole, a cycle, a throwing getter or trap, a revoked proxy, a bigint, a `Map`, a `Date`, a class instance, or a nest past `depth` or the stack is `NOT_PLAIN`. `-0` becomes `0`. `NaN` and `Infinity` are kept for the door's own check. Object keys `__proto__`, `constructor` and `prototype` are left out, and so is a key whose one read is `undefined`, a function or a symbol (`toJSON` is never called). An array slot that is a function or a symbol is stored as `undefined`, so it is not a hole. The copy's prototype is `Object.prototype`.
- `submit` gives `unlockFailed` only when the copy is a record whose `kind` is `"unlock"` and `readAction` says it is not an action, and it does not log it. If the copy is `NOT_PLAIN`, `kind` is not read and the notice is `actionRefused`. A hole in `effects` fails the copy, so it is `actionRefused` (step-19 residual 1), not `unlockFailed`. A well-formed unlock with `[]`, `[""]` or two ids is logged, then `apply` refuses it; `""` is still refused before `choose`. `apply` and a timed callback both close over the frozen copy that was logged, so an edit after `submit` lands as logged and `replay` matches. Step 19's `idsOf` re-read is gone.
- `restore` copies the snapshot first. Before any replay it requires `tick` an integer >= 0, `clockMs === tick * stepMs`, and `logSeq` equal to the number of log entries with `tick` <= that tick. `stepMs` is `createClock().stepMs` with no options, the same clock `createWorld` builds (10 today); `createWorld` takes no clock option, and the check has to run before the replay loop. A tick of `1e9` that does not match is refused at once. A snapshot whose tick, `clockMs` and `logSeq` all agree can still replay to that tick. That cap is H2's.
- No draw was added, removed or moved. chaos-gen still builds its rng on the hook's first call from `streamSeed(world.seed, copy.stream)`. `createLevels` draws from the copied pools in the same order. The sixteen base lines, the four exploit-levels lines and `npm run sim` (`48/2 afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `22/28 b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`) did not move. `mix` edited after `chaosIntents` returns changes no draw. The run record still holds the caller's `gen`.
- Carry C1: the tampered-log test forges its six unlocks on a bar whose offer is open in the clean replay, and on the first id of that offer, so reading the first of two ids fails it. Carry C2: `(e)1` is handed an `after` whose offers are cleared, so reading the offer from `after` fails it. `src/sim/actions.ts` ends with a newline.
- Not covered here, on purpose: a direct `readStage` / `readMap` / `readManifest` / `resolvePlacements` on a live object (H3, it needs `src/project` to import `src/core/plain.ts`); `units.place` still keeps the caller's cell; `units.get` returns the live record; `setOffset` keeps the caller's offset; `feedIntent` still reads the live intent after the step-16 guard (any action it builds then goes through `submit`); `createGestureMapper(opts)` and `createClock(opts)` do not copy their options; `packAction` still stores an unfrozen pack and `entries()` is a shallow slice (H3). A huge finite dense array is still walked until `nodes` runs out, and whole documents use `Infinity`.
- Diff is 268 insertions and 36 deletions (304 changed lines) on the 16 named files, under 400. No Change Notice. `main` was not committed to. The branch starts at `ad627d0`, not at the kit commit. This chat uploads `step-20-every-door-r1-chatB.bundle` and `HAND-BACK-step-20-every-door-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- H2 should pass finite `depth` and `nodes` into this same copy, and refuse a long but self-consistent forged snapshot before replay. A direct project-reader copy still needs the H3 Change Notice.

## Kit files used
- handoff/steps/step-20-every-door.md (on origin/main; not in this tree) e6e9c8ca582282d3cd6e1c82e768481d01025e6840568977b6b0dc630a2268b0
- BUILD_GUIDE.md (base ad627d0; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base ad627d0) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
