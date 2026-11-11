# Hand-back step-17-memory-guard r1
Step file: handoff/steps/step-17-memory-guard.md
Base commit: 04dd7fbde045f5897bc65946efc428fd99a30b96     Head commit: 3d471090b36cce99c5e6098b33b97373170e7b0e     Branch: step/step-17-memory-guard-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/core/clock/types.ts
M	src/core/events/bus.ts
M	src/core/events/index.ts
M	src/core/events/types.ts
M	src/sim/actions.ts
A	src/sim/dispose.ts
M	src/sim/driver-phase.ts
M	src/sim/driver-tick.ts
M	src/sim/index.ts
M	src/sim/player.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/core/dispose.test.ts
M	tests/sim/bot.test.ts
A	tests/sim/dispose.test.ts
A	tests/sim/gc.test.ts

## Green
npm test: 205/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Dispose lives on the clock and the bus, because each owns its lists. `disposeWorld` marks the world in `const done = new WeakSet<SimWorld>()` and then calls `world.clock.dispose()` and `world.bus.dispose()`. The set is not a `SimWorld` field, so a snapshot is unchanged and the mark does not keep the world alive. The log, units, grid, notices, phases and rng are not cleared.
- `feed` checks `isDisposed` after the phase is read and before the shape guard. It returns `reject: "disposed"` with `intent ?? null` and `aim ?? null`, and does not push that step onto `history()`. `submit` returns before the log. `runMatch` throws `Error("runMatch: world is disposed")` and `runTicks` throws `Error("runTicks: world is disposed")` as their first statement. Driving a closed world is a programmer error; feed and submit do not throw.
- `DEFAULT_BUS_LIMITS` is `{ history: 1024 }`, about 5× the 187-record match measured at the base. `createBus` reads `limits.history` once, first, and throws `RangeError("createBus: history must be an integer >= 0")` otherwise. It pushes the record, drops the oldest until at most `history` remain, then runs listeners. `seq` is never reused. A cap of 0 keeps no records. The command log is not touched. `createWorld` passes `input.busLimits`, and `undefined` still selects the parameter default.
- After dispose, `after` still checks `ms` and returns a `SimTimer` with the next id and the same due formula, and does not store the callback. Later `onTick`, `onRender`, `onError`, `on`, `onAny` and `onError` return an unsubscribe that does nothing. A second dispose returns at once. A registered emit then records nothing and does not advance `seq`. An unregistered type still throws `RangeError`.
- The GC test turns `gc` on with `v8.setFlagsFromString("--expose-gc")` and `vm.runInNewContext("gc")` at the top of `tests/sim/gc.test.ts` only. The world is created inside a helper, so the test function does not retain it. The host keeps the clock and the bus, with listeners before dispose, subscriptions after, and one 200 ms move timer. Collection is at most 10 rounds of one `setImmediate` then `gc()`. The twin that is not disposed is the leak check. It passed 30/30 alone and 32/32 as eight processes at a time, four waves.
- Diff is 225 insertions and 10 deletions (235 changed lines) on the 17 named files, under 270 and under ~265. No Change Notice. `npm test` is 205/0/0/0 from a clean checkout of `3d47109` (`npm ci && npm run green`). `npm run sim` and the ten smoke lines are unchanged. The heap line is report-only; this machine printed about `+0.53` to `+0.57` MiB, which is not pinned.
- The names `step-17-memory-guard-r1-chatB.bundle` and `HAND-BACK-step-17-memory-guard-r1-chatB.md` were already on Drive (another delivery, head `b3e1c37`). This chat uploads `step-17-memory-guard-r1-chatB2.bundle` and `HAND-BACK-step-17-memory-guard-r1-chatB2.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 18 can run card-free levels back to back and read a disposed world's log and outcome. The host frame driver is still later. Not built here.

## Kit files used
- handoff/steps/step-17-memory-guard.md (user-supplied sha256) b079075caf8e43a316560226fe59f91fc6973ac1e28e337db9c1ad5c383e8a19
- BUILD_GUIDE.md (base 04dd7fb; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 04dd7fb) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
