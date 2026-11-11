# step-17-memory-guard: a finished match lets go of its memory: a dispose that is safe to call twice, a capped event-bus history (the match log stays whole), a freed-world GC test that blocks, a report-only heap smoke

Step id: step-17-memory-guard          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `04dd7fbde045f5897bc65946efc428fd99a30b96` (`04dd7fb`, the step-16-door-guard merge on `main`, PR #21; verified by the Engine Architect 2026-11-11: green 198/0, sim unchanged, all ten smoke lines as pinned). The diff is always `<base>..<head>`.
Branch: `step/step-17-memory-guard-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-17-memory-guard-r<N>.bundle <base>..step/step-17-memory-guard-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-17-memory-guard/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-02-clock (`createClock`, `Clock`, `SimTimer`), step-07-events-log (`createBus`, `EventBus`, `BusRecord`, `createLog`), step-09/09b (`createWorld`, `SimInput`, `SimWorld`, `submit`, `snapshot`, `replay`, `runMatch`, `runTicks`), step-11-player-driver (`createPlayer`, `PlayerReject`, `PlayerStep`), step-14-bot-driver (the every-reject test), step-16-door-guard (`stageLimits`: the pattern for limits passed through `SimInput`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 5, 6, 8, 10, 12, M1, M6; §3 (the `src/core/` and `src/sim/` rows: core imports nothing above it, nothing imports sim); `handoff/steps/step-16-door-guard.md` Behaviour 1 and "How later steps use this"; `docs/qa/chaos-player-invariants.md` (a)9
Kit: kit-2, 2026-11-11. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 205/0) on Node 24.22.1 on top of the step-16 merge `04dd7fb` (prototype `eab2d17`), against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `npm run sim` 48/2 and 22/28, the four chaos smoke lines and the six pinned exploit smoke lines are unchanged by this step. The GC test passed 30 of 30 runs alone, 32 of 32 with eight runs at once, and 10 of 10 full `npm test` runs.
Carries: **no Change Notice.** `Clock` and `EventBus` live in `src/core/clock/types.ts` and `src/core/events/types.ts`, not in a pinned file; each gains one method (`dispose`), and `createBus` gains an optional third parameter, as step 16 widened `readStage`. `PlayerReject` gains an eighth reason (no pinned file lists the reasons; step 16 Carries). `src/sim` gains one file in an existing layer. `package.json` stays pinned: the GC test turns on `gc` from inside itself (no `--expose-gc` in any script). `.dependency-cruiser.cjs` (`dcf61c61…`), `package.json` (`1e5dd82c…`), BUILD_GUIDE and STATES are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
When a match or a level is over, the engine must let go of it, so a phone can play level after level without running out of memory (CEO 2026-11-11: the memory guard comes before card-free levelling). Today nothing ends a world: the clock keeps its timers and subscribers, the bus keeps every listener, and the bus keeps every event it ever sent. If the host keeps the clock or the bus (a frame driver, a UI), anything subscribed to them keeps the whole finished world alive. After this step: (1) **`disposeWorld(world)`** ends a finished match or level: the clock drops its timers and subscribers, the bus drops its listeners and history, and later feeds, submits and drivers are refused cleanly (no crash). Calling it again does nothing. (2) The bus's **history is a rolling window**, capped by a maker-changeable `BusLimits` (engine default 1024 records); the **command log**, the record used for replay, determinism and snapshot hashes, is **never capped**. (3) A **GC test** proves a disposed world really is freed while the host still holds its clock and bus, and that the same world is **not** freed without dispose. It fails green if the world leaks (blocking). (4) A **heap smoke** runs 30 matches, disposes each, and prints heap used before and after. It is report-only: it prints one line and never fails green on its numbers.

Rulings in this step (CEO 2026-11-11, via Chief Of Staff; Engine Architect 2026-11-11; the 1024 default and readable-after-dispose confirmed by the CEO directly, 2026-11-11 23:28):
- **Dispose is per object, then per world.** `Clock.dispose()` and `EventBus.dispose()` live in core (each owns its own lists); `disposeWorld` in `src/sim` calls both. The disposed mark is a module-private `WeakSet<SimWorld>` in `src/sim/dispose.ts`, so `SimWorld`, `SimSnapshot` and every snapshot stay as they are, and the mark itself never keeps a world alive.
- **Dispose keeps the results readable.** The command log, units, grid, notices, phases and rng are not cleared: the host may save `world.log.toJSON()` or read the outcome after disposing. The world is freed when the host drops its own reference to it; dispose makes sure the clock and bus no longer hold it.
- **"Refused cleanly" means:** a feed returns a step with reject `disposed` and changes nothing (not kept in `history()`, so a closed world gains no new state); `submit` does nothing; `runMatch` / `runTicks` throw a named `Error` before touching the world (driving a closed world is a programmer error, law 10). Nothing else throws. `replay` / `restore` build a new world and are unaffected.
- **Cap value (law 12):** `DEFAULT_BUS_LIMITS = { history: 1024 }`. The longest BTF match measured at the base (every test, smoke and `npm run sim` match) sends 187 bus records, so 1024 is about 5× that, and 1024 small records is well under a megabyte on a phone. It is an engine setting like the clock's `DEFAULT_STEP_MS` (core already holds that kind of default), not a game rule. Makers change it through `SimInput.busLimits` or `createBus`'s third argument. Because no match reaches the cap, the sim's history hash and every pinned line stay byte-identical.
- **The GC test turns on `gc` itself:** `v8.setFlagsFromString("--expose-gc")`, then `vm.runInNewContext("gc")`, at the top of `tests/sim/gc.test.ts` only (each test file runs in its own process under `node --test`). `package.json` is pinned; never add `--expose-gc`, `NODE_OPTIONS` or a child process.

## Files to create or change
- change `src/core/clock/types.ts`: `dispose()` on `Clock` (≤ 6 changed lines); `src/core/clock/clock.ts`: the disposed flag, `dispose`, `after` / `listen` after dispose (≤ 16)
- change `src/core/events/types.ts`: `BusLimits`, `dispose()` on `EventBus` (≤ 8); `src/core/events/bus.ts`: `DEFAULT_BUS_LIMITS`, the `limits` parameter, the cap, `dispose` (≤ 28); `src/core/events/index.ts`: export `DEFAULT_BUS_LIMITS` (≤ 6)
- create `src/sim/dispose.ts`: `disposeWorld`, `isDisposed` (≤ 20)
- change `src/sim/player.ts`: the `disposed` refusal in `feed` (≤ 12); `src/sim/actions.ts`: `submit` does nothing on a disposed world (≤ 6); `src/sim/driver-phase.ts` and `src/sim/driver-tick.ts`: the named refusal (≤ 6 each)
- change `src/sim/types.ts`: `SimInput.busLimits`, `"disposed"` in `PlayerReject`, one type import (≤ 10); `src/sim/world.ts`: pass `input.busLimits` to `createBus` (≤ 6); `src/sim/index.ts`: export the two functions (≤ 5)
- create `tests/core/dispose.test.ts` (≤ 58), `tests/sim/dispose.test.ts` (≤ 44), `tests/sim/gc.test.ts` (≤ 60)
- change `tests/sim/bot.test.ts`: the every-reject test reaches `disposed` (≤ 9)

Size: ≤ 270 changed lines in total, counting insertions + deletions; the per-file caps above add up to 306 (prototype `eab2d17` on `04dd7fb`: 217 insertions, 15 deletions = 232). No new fixtures. If you pass ~265, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 02: `Clock`, `SimTimer`, `Unsubscribe`. From step 07: `EventBus`, `BusRecord`, `EventRegistry`, `CommandLog`. From step 09/09b/11: `SimInput`, `SimWorld`, `PlayerReject`, `submit`, `runMatch`, `runTicks`. Import these; never retype them.
```ts
// src/core/clock/types.ts — Clock gains a last member:
  /** Step 17: cancels and drops every timer and subscriber; later `after` / `on…` store nothing. Time still counts. Safe to call twice. */
  dispose(): void;
// src/core/events/types.ts
/** Rolling bus history size (step 17): the newest `history` records are kept; 0 keeps none. The match log is never capped. */
export type BusLimits = { readonly history: number };
// EventBus gains a last member:
  /** Step 17: drops every listener and the history; later emits record and call nothing, later subscriptions store nothing. Safe to call twice. */
  dispose(): void;
// src/core/events/bus.ts
/** Engine default (step 17): about 5x the longest BTF match measured (187 records), small enough for a phone. Makers pass their own. */
export const DEFAULT_BUS_LIMITS: BusLimits = { history: 1024 };
export function createBus<M extends EventMap<M> = NoModeEvents>(clock: Clock, registry?: EventRegistry<M>, limits: BusLimits = DEFAULT_BUS_LIMITS): EventBus<M>;
// src/core/events/index.ts — the bus line becomes
export { DEFAULT_BUS_LIMITS, createBus, logEvents, unitEvents } from "./bus.ts";
// src/sim/types.ts — SimInput gains, after `stageLimits`:
  /** The bus's rolling history size (step 17); absent = core's `DEFAULT_BUS_LIMITS`. The command log is never capped. */
  readonly busLimits?: BusLimits;
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction" | "malformed" | "disposed";
// src/sim/dispose.ts (module-private: const done = new WeakSet<SimWorld>();)
/** Ends a finished match or level (step 17): … Safe to call twice. */
export function disposeWorld(world: SimWorld): void;
/** True once `disposeWorld` ran; `feed` then refuses with `disposed` and `submit` does nothing. */
export function isDisposed(world: SimWorld): boolean;
// src/sim/index.ts — appended after the createWorld line
export { disposeWorld, isDisposed } from "./dispose.ts";
```
`src/core/log/**`, `src/core/{grid,unit,rng,targeting}/**`, `src/sim/{run,intents,chaos,chaos-gen,shrink,exploit,exploit-docs}.ts`, `src/project/**`, `src/fx/**`, `src/runtime/**`, `src/rules/**`, `src/btf-adapters/**` and `tests/fixtures/**` are unchanged.

Behaviour (exact; each line has a test):
1. **Bus cap:** `createBus` reads `limits.history` once, first, and throws `RangeError("createBus: history must be an integer >= 0")` unless it is an integer ≥ 0. Each emit pushes its record and then trims the oldest so that at most `history` remain, before any listener runs. `seq` keeps counting (it is never reused), `history()` returns a copy, oldest first, and `0` keeps no records while listeners still hear every event. An omitted `limits` is `DEFAULT_BUS_LIMITS`. `createWorld` passes `input.busLimits` (absent means the default).
2. **Bus dispose:** empties every per-type list, the `onAny` and `onError` lists and the history. A dispose from inside a listener stops the rest of that emit. Afterwards, `emit` of a registered type does nothing (no record, no `seq`, no listener); an unregistered type still throws `RangeError`. `on` / `onAny` / `onError` store nothing and return an unsubscribe that does nothing. `history()` is `[]` and `isRegistered` is unchanged. A second call does nothing.
3. **Clock dispose:** marks every pending timer dead and empties the timer, tick, render and error lists. A dispose from inside a timer stops the later timers of that tick. Afterwards, `after(ms, cb)` checks `ms` as before and returns a `SimTimer` whose `cb` is never stored or run; `onTick` / `onRender` / `onError` store nothing and return an unsubscribe that does nothing; `advance` / `step` still count time (`tick()`, `now()`). A second call does nothing.
4. **`disposeWorld(world)`:** the first call marks the world and calls `world.clock.dispose()` and `world.bus.dispose()`; later calls return at once. Nothing else changes: `snapshot(world)`, `world.log.toJSON()` and `world.notices` read the same just before and just after.
5. **Refused after dispose:** `player.feed(intent, aim)` checks `isDisposed(world)` after reading the phase and before the shape guard, and returns `{ intent: intent ?? null, aim: aim ?? null, tick, from, event: null, action: null, reject: "disposed" }` without keeping it in `history()` and without changing anything. `submit(world, action)` returns at once (no log entry, no move, no timer). `runMatch` throws `Error("runMatch: world is disposed")` and `runTicks` throws `Error("runTicks: world is disposed")` before any phase write or clock step. The world reads the same after all four.
6. **The match log stays whole:** `CommandLog` is not touched. For any `busLimits`, a match gives the same result, `log.toJSON()`, snapshots and per-step hashes, because the bus history is in none of them; the capped bus history equals the last `history` records of an uncapped one; replaying the log rebuilds the same units.
7. **Freed world (GC, blocking):** the host keeps the world's clock and bus, adds listeners that capture the world on both (some before dispose, some after), and leaves one move timer pending. After `disposeWorld`, a `WeakRef` to the world is cleared within 10 rounds of (await one `setImmediate`, `gc()`). The same scenario without dispose is **not** cleared after the same 10 rounds. This is the test's own leak check: it proves the test can see a leak. Both asserts fail green.
8. **Heap smoke (report-only):** one forced collection, `process.memoryUsage().heapUsed`, then 30 stage-weighted bot matches (seeds 1–30), each created, run and disposed, then another forced collection and a second read. It prints exactly one line, `heap smoke stage-weighted matches 30 run+disposed: before <a> MiB after <b> MiB delta <±c> MiB` (MiB with two decimals; the delta has an explicit `+` or `-`), and asserts only that the line matches that format, never a number. Its numbers depend on the machine and are not pinned (prototype: delta between −0.24 and +0.30 MiB over 30 runs).

## Tests that prove it is done
Run: `npm test`. Common: the bot match as in `scripts/sim.ts` (`seedless(input(stage, seed))`, `seatAll(world, sides, bot(seed), 200)`, `reachFarRow`, fuse 60000, maxRounds 40, maxSimMs 600000). Test titles start with the quoted words (QA's plants find tests by them); the rest of each title is yours.
Draw order: **this step adds no random draw.** The engine code makes the same draws in the same order: the bus cap is never reached by any existing match (largest 187 < 1024), and dispose is called only by the new tests. The new tests draw only through the existing `bot(seed)` and pool streams, and pin nothing that depends on draws. If a sim or smoke line moves, look at the cap (a record trimmed too early) or a dispose that leaked into a match path, not at the draws.
- `tests/core/dispose.test.ts`
  - "bus history cap (step 17)…": cap 3, 5 emits → the sizes after each emit are `[1, 2, 3, 3, 3]` and the seqs are `[3, 4, 5]`; cap 0 → `[]` while an `onAny` listener still hears the event; no limits, 1030 emits → `DEFAULT_BUS_LIMITS` is `{ history: 1024 }`, the length is 1024 and the first seq is 7; `-1`, `1.5`, `NaN`, `Infinity` → the `RangeError` above.
  - "bus dispose (step 17)…": a per-type listener that disposes from inside an emit stops the later listener and the `onAny`, and its throw reaches no `onError`; after a second dispose, new `onAny` / `on` subscriptions are never called, history stays `[]`, and an unregistered emit still throws `RangeError`.
  - "clock dispose (step 17)…": a timer that disposes from inside tick 1 stops the other timer, the tick, render and error subscribers, and an `after` made inside it; after a second dispose, a new `after` and `onTick` never run; `advance(100)` + `step()` still reach tick 12.
- `tests/sim/dispose.test.ts`
  - "disposeWorld (step 17)…": after a stage-weighted bot match (seed 3), `isDisposed` is false, then dispose twice; a feed gives `["disposed", null, null]` for reject, event and action, and history length 0; two submits (instant and 200 ms) do nothing; `runMatch` and `runTicks` throw their named errors; the fingerprint `[snapshot, log.toJSON(), notices]` is unchanged and `bus.history()` is `[]`.
  - "the match log is kept for the whole match…": seeds 1–3, `busLimits { history: 8 }` vs none: the same result, `log.toJSON()` and `snapshot`; the tiny bus history equals the full one's last 8; the full history is below 1024 and the log has more than 8 entries; replaying the tiny world's log gives the same units.
- `tests/sim/gc.test.ts`: "a finished, disposed world is collected…" (Behaviour 7, plus: the kept clock still answers `tick()`, the kept bus's history is `[]` and the twin's is not) and "heap smoke (step 17, report-only)…" (Behaviour 8, one `t.diagnostic(line)`).
- `tests/sim/bot.test.ts` "every reject reason is reached…": after the `malformed` feed, `disposeWorld(world)` and a `SelectUnit` feed → `disposed`; `listed` has eight reasons; the history is still 11.
- Unchanged: `npm run sim` prints the base's two lines; the four chaos smoke lines and the six pinned exploit smoke lines are as at the base (step 16 "Tests").

## How a planted bug is caught (for QA; prototype `eab2d17` on `04dd7fb`; reverted after each; `/tmp/s17-plants.sh` on the Architect's box)
Each plant is an **intent**; the script holds the prototype's example patch. On the build, QA adapts the patch text to that build's code (same intent, same expected failing tests). A "plant text not found" line means "adapt it", not "passed".
| Plant (one edit; intent) | Tests that fail (of 205), by title prefix |
|---|---|
| clock dispose keeps render subscribers / drops timers' flag but keeps the timers / a clock subscription after dispose is stored / `disposeWorld` skips the clock | GC (+ clock dispose for the first) |
| bus dispose keeps `onAny` listeners / keeps per-type lists (forgets only the map) / a bus subscription after dispose is stored / `disposeWorld` skips the bus | GC + bus dispose / bus dispose / GC / GC + disposeWorld |
| a second dispose throws (world / bus / clock) | disposeWorld / bus dispose / clock dispose |
| a feed after dispose not refused / a refused feed kept in history | disposeWorld + every-reject (both) |
| `submit` after dispose still logs / `runMatch` or `runTicks` drives a disposed world / the bus records after dispose | disposeWorld / disposeWorld / bus dispose |
| no bus cap / the cap keeps one record too few / default 1024 changed / non-integer limits accepted | bus history cap (+ match log for the first) |
| `createWorld` ignores `busLimits` / the command log capped too | match log (+ 14 other replay and log tests for the second) |
| the GC test's `gc` is a no-op (no forced collection) | GC (the disposed world is not freed: the test fails, it does not pass by accident) |

All 24 test plants fail at least one named test. Grep plants (13/13 caught by Acceptance): `--expose-gc` in `package.json`; the heap smoke asserts a heap number; the heap line not printed; a `WeakRef` in `src`; a bus cap literal in `src/sim`; the command log trimmed; the GC flag passed through `execArgv`; a driver skips the disposed check; an extra file; `core-types.ts` touched; a `phase` word in core; a timer in `src`; a dispose call outside `src/sim/dispose.ts`.

## Example
```ts
const world = createWorld({ ...input, busLimits: { history: 256 } }); // a maker's own window; omit for 1024
const result = runMatch(world, opts);
save(world.log.toJSON());          // the whole match log, never capped
disposeWorld(world); disposeWorld(world);   // the second call does nothing
player.feed(intent).reject;        // "disposed": nothing changes
```

## How later steps use this (context only; do not build)
- The host's frame driver (`src/runtime/host/raf-driver.ts`, later) calls `disposeWorld` between levels and stops advancing that clock; level select keeps no finished world.
- Step 18 (card-free levelling) runs levels back to back on top of this; its level-up screens read the disposed world's results, which dispose keeps.
- The online add-on's queue and the FX timeline (`playFx` returns its own unsubscribe) will hang their cleanup on the same dispose; the heap smoke stays report-only (its numbers are machine-dependent).
- QA may add memory ids to `docs/qa/chaos-player-invariants.md` and the `disposed` reason to (a)9's list (QA-owned).

## Decisions note: what to name
- Why dispose lives on the clock and the bus (each owns its lists), why the disposed mark is a `WeakSet` and not a `SimWorld` field, and why the log, units and notices survive dispose.
- Why later feeds are refused but not kept in history, and why the drivers throw (programmer error) while feed and submit do not.
- Why the default cap is 1024 (law 12), why trimming happens before listeners run, and why the command log is never capped.
- How the GC test stays deterministic (await, then `gc()`, up to 10 rounds; the not-disposed twin as its own leak check) and how you checked it is stable (how many runs).
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). The Architect did not open the BTF trees for this step; no BTF code, value or file is used. Intent only: BTF `BUILD_LAW.md` rule 10's one door is unchanged (a closed world is refused at the same door).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/log/**`, `src/core/{grid,unit,rng,targeting}/**`, `src/core/notice.ts`, `src/state/**`, `src/rules/**`, `src/fx/**`, `src/runtime/**`, `src/project/**`, `src/btf-adapters/**`, `src/index.ts`, `src/sim/{run,intents,chaos,chaos-gen,shrink,exploit,exploit-docs}.ts`.
- `tests/fixtures/**` and every test and helper not in the file list (`tests/sim/{ai,seats,input}.ts` included).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 205; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos smoke lines and the six exploit smoke lines are as at the base; the heap line matches the format in Behaviour 8.
- [ ] `npm run check:state` / `check:law` print OK; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts package.json` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628`, `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`.
- [ ] Names: `dispose(): void;` once each in `src/core/clock/types.ts` and `src/core/events/types.ts`; `BusLimits` as quoted; `DEFAULT_BUS_LIMITS` is `{ history: 1024 }` and exported from `src/core/events/index.ts`; `createBus`'s third parameter is `limits`; `readonly busLimits?: BusLimits;` in `SimInput`; `world.ts` passes `input.busLimits` to `createBus`; `src/sim/dispose.ts` exports `disposeWorld(world: SimWorld): void` and `isDisposed(world: SimWorld): boolean` over one `new WeakSet<SimWorld>`; `src/sim/index.ts` exports both; `PlayerReject` has eight reasons and includes `"disposed"`; the three error texts appear once each.
- [ ] One value, one place: `rg -l '\b1024\b' src` lists only `src/core/events/bus.ts`; `rg -n --pcre2 'history\s*:\s*\d' src/sim src/project src/btf-adapters` nothing.
- [ ] Log whole: `git diff <base>..<head> -- src/core/log` is empty; `rg -n --pcre2 '\b(splice|shift)\(|\.length\s*=' src/core/log` nothing.
- [ ] Dispose reaches both and lives in one place: `src/sim/dispose.ts` calls `world.clock.dispose()` and `world.bus.dispose()` once each; `rg -l '\.dispose\(\)' src/sim src/project src/runtime src/fx src/rules src/btf-adapters` lists only `src/sim/dispose.ts`; `rg -l '\bisDisposed\(' src/sim` lists exactly `actions.ts`, `dispose.ts`, `driver-phase.ts`, `driver-tick.ts`, `player.ts`.
- [ ] GC from inside the test only: `rg -l 'setFlagsFromString|runInNewContext' tests src` lists only `tests/sim/gc.test.ts`; `rg -n --pcre2 'expose[-_]gc' tests src package.json scripts` one line; `tests/sim/gc.test.ts` has a `new WeakRef(` and no `execArgv|NODE_OPTIONS|spawn|fork(`.
- [ ] Heap smoke report-only: `rg -l memoryUsage tests src` lists only `tests/sim/gc.test.ts`; one `t.diagnostic(` in it; `rg -n --pcre2 'assert(\.\w+)?\(\s*[^/;]*\b(heapUsed|memoryUsage|before|after|delta|growth)\b' tests/sim/gc.test.ts` nothing.
- [ ] Laws hold: no `WeakRef|FinalizationRegistry|memoryUsage|setFlagsFromString|runInNewContext|node:v8|node:vm|gc()` in `src`; the step 11–16 law greps still print nothing (one clock incl. `setImmediate`, no host crypto/process, no `node:` imports or I/O in `src`, no rules or `phase` words in core, no side literals in `src/sim`, phases written whole, nothing imports sim, core imports nothing above it, the door words stay out of `driver-phase.ts`, `player.ts`, `dispose.ts`); one `submit(` in `player.ts`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 17 files of the file list (`A` for the four created, `M` for the rest); `git diff --stat` ≤ 270 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-17-memory-guard/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- The host frame driver and a multi-level session object (runtime, later); disposing `Player` objects or capping a player's `history()` (it lives for one match, like the log); freeing units, grid or rng arrays (the host drops the world).
- Making the heap smoke a gate, or pinning its numbers (machine-dependent; report-only by CEO ruling). Long soak runs (outline: soak tiers, later).
- FX timeline cleanup (`playFx` already returns its unsubscribe), chaos and exploit record files, `chaos:replay`.
- Editing `docs/qa/chaos-player-invariants.md` (QA) or `docs/chaos-player-outline.md` (its line "An event-bus history cap is not in this scope" is for the Architect to update after merge).

## Out of scope
- Any game rule, levelling (step 18), networking, lobbies, saves, any change to the command log or snapshots.
