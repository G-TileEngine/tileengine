# step-21-hard-limits: hard limits on what one match record can do (H2a). A finite default budget for the door copy (so a huge lying array is refused at once), the CEO-accepted match caps (log entries, ticks, action duration, text length, notices per match) as a maker-changeable `MatchLimits` object with engine ceilings and a BTF preset, uint32 seeds, `replay` / `restore` refusing an over-cap tick before any replay work, the linear ability draw (same draws), and the last option objects read once

Step id: step-21-hard-limits          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `5fefa6f18c8e48d51f8216438d8e1d9163fdb9d0` (the step 20 merge, PR #26, build A). The diff is always `<base>..<head>`.
Branch: `step/step-21-hard-limits-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-21-hard-limits-r<N>.bundle <base>..step/step-21-hard-limits-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-21-hard-limits/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-07 (`createLog`, `parseLog`), step-02 (`createClock`), step-09c (`createGestureMapper`), step-05 (`createUnits`, `place`), step-17-memory-guard (`BusLimits` / `DEFAULT_BUS_LIMITS`, the pattern copied here), step-18 / 19 (`createLevels`, the offer draw), step-20-every-door (`plainCopy`, `readAction`, `actionRefused`, the copy-then-check doors)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 10, 12, M4, M7 and §3 (layers); `handoff/steps/step-20-every-door.md` Behaviour 1–3, 7 and "Not in this step" (the H2 carries); `src/core/events/types.ts` (`BusLimits`); `src/paint/recipe` (`SpriteRecipeLimits`, the same shape); `src/core/plain.ts`, `src/core/log/log.ts`, `src/sim/actions.ts`, `src/sim/run.ts`, `src/sim/world.ts` (as at the base)
Kit: kit-2, 2026-11-12. Engine Architect. Hardening step H2, first half (H2a). Cap numbers CEO-accepted 2026-11-12 (`h2-caps-ACCEPTED-2026-11-12`, Architect's copy sha `ac826d36…`). The interfaces below were prototyped and run green (`npm run green`, 492/0) on Node 24.22.1 on top of the step 20 prototype `h1-r` `eb4d16a` (prototype branch `h2`, head `411bf98`), then rebased onto the merged build A `5fefa6f` (prototype branch `h2-r`, head `6e76f05`, one code commit, resolved onto A's own code); a fresh clone of `h2-r` runs green 492/0. `npm run sim` 48/2 and 22/28 and all 20 smoke lines are byte-identical to `5fefa6f`. Build A differs from the proto in wording only at these doors: `plainCopy` walks with `walk(v, depth, { n }, seen)` and returns `NOT_PLAIN` (no throw); `restore` checks the snapshot then calls `replay`, so the cap check sits in `replay` (there is no shared `play`); `readAction`'s copy is named `copy`.
Carries: **no Change Notice.** No pinned file changes: `core-types.ts` (`f00c722c…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), BUILD_GUIDE, STATES and every state table are unchanged. The limits are one new file in the existing `src/core` layer (`src/core/limits.ts`, no imports) and the BTF preset one new file in the existing `src/btf-adapters/src` folder (btf-adapters may already import core); no new folder, no new dependency rule. Carries in (landed here), from step 20 "Not in this step" (H2) and QA's step-20 review: a finite default node budget (QA: `submit(liar(1e9))` must be refused fast); the whole-document depth and node caps; the replay-length cap; huge finite arrays; `units.place` keeping the caller's cell; `createGestureMapper` / `createClock` options not copied. Carried on to **step 22 (H2b)**: see "Not in this step". The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Put a hard, named ceiling on what one match record (an action, a log, a replay request) can make the engine do, so a hostile or broken record is refused fast instead of burning time or memory. At the base: `plainCopy`'s default budget is `Infinity`, so a proxy with `length` 1e9 and every index own is walked item by item (QA's step-20 carry); `createWorld` copies documents at any depth; the command log has no length cap, an action may last 1e9 ms and carry a 10 MB string; a seed of 2³² + 24,301 plays the same game as 24,301; a forged snapshot whose tick, `clockMs` and `logSeq` agree replays for minutes; `world.notices` grows without end; the level draw is quadratic (`includes` on two growing lists); `createClock`, `createGestureMapper` and `units.place` keep the caller's objects. After this step: (1) every door copies within a finite budget; (2) the CEO-accepted match caps live in one `MatchLimits` object (maker-changeable up to an engine ceiling, same shape as `BusLimits` / `SpriteRecipeLimits`) and are enforced at `createLog` / `append` / `parseLog` / `submit` / `createWorld` / `replay` / `restore`; (3) the draw is linear with **the same draws**.

Rulings in this step (Engine Architect, 2026-11-12):
- **The command log is now capped.** Step 17's comment "the match log is never capped" is replaced: a world's log holds at most `limits.entries` (BTF 2,048) entries, each at a tick ≤ `limits.ticks` (BTF 131,072). Past the entries cap `submit` refuses with `logFull`; past the tick cap with its own notice `timeLimit` (`logFull` is for entries only). The log itself throws `RangeError` (a direct caller's bug, as at the base for a bad tick).
- **Caps are numbers in one object, not code.** `MatchLimits` = `{ entries, ticks, durationMs, text, notices }`. A maker passes `SimInput.limits`; absent = `DEFAULT_MATCH_LIMITS` (the accepted BTF values); every field must be a whole number from 1 to its `MATCH_CEILINGS` value, else `createWorld` throws a named `RangeError` before anything is built. BTF's values are `BTF_MATCH_LIMITS` in `src/btf-adapters` (equal to the defaults today).
- **Finite door budgets.** `plainCopy`'s default `nodes` is `PLAIN_NODES` = 1,048,576 (2²⁰, the largest accepted ceiling) and whole inputs are copied at depth `PLAIN_DEPTH` = 32 (was `Infinity`). An array whose integer `length` is above the values left is refused at its length (step 20's check), so a huge finite array, real or a lying proxy, costs nothing.
- **Seeds are uint32.** A log header seed (and so `hostSeed`) must be an integer 0…4,294,967,295; anything else is refused (`createLog` RangeError; `parseLog` "bad header"). Other whole numbers in documents (int32) are step 22's.
- **Refused before replay work.** `replay` / `restore` refuse an `untilTick` (or snapshot tick) above `limits.ticks`, or a log longer than `limits.entries`, before the first tick is run.
- **Notices per match.** A world keeps at most `limits.notices` notices, then exactly one more line `{ code: "noticesCapped", message: "and N more" }` whose N counts every later notice. Per-file (per-read) notice caps are step 22's.
- **Draw order unchanged.** See "Draw order".
- **The door budgets are engine constants, not maker caps** (Architect ruling, 2026-11-12). `PLAIN_NODES` (2²⁰ values) and `PLAIN_DEPTH` (32 levels) are fixed engine safety limits for the door copy. They are not in `MatchLimits`, a maker cannot change them, and they are not BTF numbers.
- **The engine refuses moves; it does not end the match.** Running out of ticks only makes `submit` refuse with `timeLimit`. Ending a match at the time limit (a draw, a loss, a timeout screen) is a game rule, so it stays out of core and belongs to the rules or the game's adapter.
- **BTF keeps its own copy.** `BTF_MATCH_LIMITS` stays a separate object in `src/btf-adapters`, even while it equals the engine defaults, so BTF can change its numbers without touching core.
- **The notices ceiling is 2³¹ − 1.** The accepted table gives no ceiling for notices per match; the engine ceiling is 2,147,483,647, like ticks and duration.
- **Every other number is the CEO's.** Only the accepted numbers and the engine constants above appear. If a fixture or test needs another number, stop and ask.

## Files to create or change
- create `src/core/limits.ts`: `MatchLimits`, `MATCH_CEILINGS`, `DEFAULT_MATCH_LIMITS`, `SEED_MAX`, `INT_MAX`, `PLAIN_NODES`, `PLAIN_DEPTH`, `withinCeilings`; no imports (≤ 25 changed lines)
- create `src/btf-adapters/src/match-limits.ts`: `BTF_MATCH_LIMITS` (≤ 8); change `src/btf-adapters/src/index.ts`: export it (≤ 5)
- change `src/core/plain.ts`: default `nodes = PLAIN_NODES` (≤ 7)
- change `src/core/log/log.ts`: `readAction(v, limits?)` duration and text caps; `createLog(header, onAppend?, limits?)` header check and the entries / tick caps in `append`; `parseLog(json, limits?)` (≤ 34)
- change `src/core/events/types.ts`: the `BusLimits` comment only (≤ 6)
- change `src/core/clock/clock.ts`: options read once (≤ 8); `src/runtime/input/gestures.ts`: options and board read once (≤ 7); `src/core/unit/units.ts`: `place` keeps a frozen copy of its cell (≤ 6)
- change `src/rules/levels/levels.ts`: the linear draw (≤ 8)
- change `src/sim/types.ts`: `SimInput.limits?`, `SimWorld.limits` (≤ 10); `src/sim/world.ts`: `note`, caps checked, depth `PLAIN_DEPTH` (≤ 26); `src/sim/actions.ts`: `logFull`, `timeLimit`, notices through `note`, `readAction(copy, world.limits)` (≤ 21); `src/sim/run.ts`: depth `PLAIN_DEPTH`, the replay cap (≤ 9)
- create `tests/sim/hard-limits.test.ts` (≤ 112)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 292 (prototype `411bf98` on `eb4d16a`: 232 changed lines in 15 files, each file 4 under its cap; rebased `h2-r` `6e76f05` on `5fefa6f`: 226 changed lines, each file within its cap). No new fixtures; no existing test changes. If you pass ~265, say so in Decisions. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
From earlier steps: `plainCopy`, `NOT_PLAIN`, `readAction`, `Action`, `LogHeader`, `CommandLog`, `createLog`, `parseLog`, `SimInput`, `SimWorld`, `Notice`, `createWorld`, `submit`, `replay`, `restore`, `createClock`, `ClockOptions`, `createGestureMapper`, `GestureOptions`, `GestureBoard`, `createUnits`, `createLevels`. Import these; do not redefine.
```ts
// src/core/limits.ts (new; no imports)
export type MatchLimits = { readonly entries: number; readonly ticks: number; readonly durationMs: number; readonly text: number; readonly notices: number };
export const MATCH_CEILINGS: MatchLimits;        // frozen { entries: 1048576, ticks: 2147483647, durationMs: 2147483647, text: 1024, notices: 2147483647 }
export const DEFAULT_MATCH_LIMITS: MatchLimits;  // frozen { entries: 2048, ticks: 131072, durationMs: 16384, text: 128, notices: 2048 }
export const SEED_MAX = 4294967295, INT_MAX = 2147483647;
export const PLAIN_NODES = 1048576, PLAIN_DEPTH = 32;
export function withinCeilings(limits: unknown): limits is MatchLimits;  // every MATCH_CEILINGS key: an integer from 1 to its ceiling
// src/btf-adapters/src/match-limits.ts (exported from src/btf-adapters/src/index.ts)
export const BTF_MATCH_LIMITS: MatchLimits;      // frozen; the accepted BTF values (equal to DEFAULT_MATCH_LIMITS)
// changed signatures (the new parameter is optional; absent = DEFAULT_MATCH_LIMITS)
export function plainCopy(value: unknown, depth: number, nodes = PLAIN_NODES): unknown;
export function readAction(v: unknown, limits?: MatchLimits): Action | null;
export function createLog(header: LogHeader, onAppend?: (entry: LogEntry) => void, limits?: MatchLimits): CommandLog;
export function parseLog(json: string, limits?: MatchLimits): ParseResult;
// src/sim/types.ts
SimInput: readonly limits?: MatchLimits;   SimWorld: readonly limits: MatchLimits;
// new notices
{ code: "logFull", message: "log full" }       // the log holds limits.entries entries
{ code: "timeLimit", message: "time limit" }   // the clock is past limits.ticks
{ code: "noticesCapped", message: "and N more" }   // N a whole number ≥ 1
// error texts (exact)
RangeError("createLog: seed must be a uint32 and header text short")
RangeError("append: log full")
RangeError("tick")                                                          // unchanged text, now also for a tick above limits.ticks
RangeError("createWorld: limits must be whole numbers from 1 to their ceilings")
Error("replay: tick or log over the limits")                                 // replay and restore
{ ok: false, error: "too many entries" } / "bad header" / "bad entry"        // parseLog
```
No other signature changes. `createClock(opts?)`, `createGestureMapper(opts, board)` and `units.place(p)` keep their base types (a parameter may be renamed).

Behaviour (exact; each line has a test):
1. **The default budget (QA's step-20 carry).** `plainCopy(v, depth)` with no `nodes` copies at most 1,048,576 values. A lying proxy with `length` 1e9 (every index own) is `NOT_PLAIN` with **no item read**; `new Array(2²⁰ + 1).fill(0)` is `NOT_PLAIN`, `new Array(2²⁰ − 1)` copies. `submit` of a move whose `effects` is that proxy gives `actionRefused`, logs nothing, and returns at once; `createWorld` with it in `chosen` throws `Error("createWorld: input is not plain data")` at once. Step 20's length check stays: with an explicit `nodes` of `Infinity`, a lying `length` of −1, 1.5, NaN or `Infinity` is still `NOT_PLAIN` with no item read.
2. **The document depth cap.** `createWorld`, `replay` and `restore` copy their input with `plainCopy(input, PLAIN_DEPTH)`; a value nested 40 deep inside the input is `Error("createWorld: input is not plain data")`. Every fixture, every existing test and the sim fit (green and sim unchanged).
3. **The action door.** `readAction(v, limits)` also returns `null` when `durationMs` > `limits.durationMs` (16,384 ms = ok, 16,385 = null) or **any** string in the copied action (id, kind, actor, target fields, effects, `via`) is longer than `limits.text` (128 = ok, 129 = null).
4. **The log.** `createLog` refuses a header whose seed is not an integer 0…4,294,967,295 or whose `engineVersion` / `projectHash` is longer than `limits.text`. `append(tick, a)`: a tick above `limits.ticks` → `RangeError("tick")`; a log already holding `limits.entries` → `RangeError("append: log full")`; the action is read with `readAction(a, limits)`. `parseLog(json, limits)`: bad header seed or text → `"bad header"`; `entries.length > limits.entries` → `"too many entries"` **before any entry is read**; an entry tick above `limits.ticks` → `"bad entry"`. The engine's own log still reads back byte-identical.
5. **`submit` says `logFull` or `timeLimit`.** After the copy and `readAction(copy, world.limits)`, and before the refusal check, in this order: if the log already holds `limits.entries` entries, push `logFull` and return; else if the clock's tick is above `limits.ticks`, push `timeLimit` and return. Either way: not logged, no throw, the world unchanged, and the match is not ended (a game rule). An action at exactly tick `limits.ticks` is logged. A slow (16,385 ms) or long-text action is `actionRefused` as in step 20.
6. **`replay` and `restore` stop at the caps.** `replay` (which `restore` calls after its tick / clock / `logSeq` check) throws `Error("replay: tick or log over the limits")` when `untilTick` is not an integer ≥ 0, is above `world.limits.ticks`, or the log has more than `limits.entries` entries, **before any tick runs**. `replay(src, log, 131073)` and `restore(src, log, { …snap, tick: 2³¹ − 1, clockMs: (2³¹ − 1) × 10 })` (consistent but forged) are refused in well under a second; a normal `restore` still matches its snapshot.
7. **`createWorld` checks the caps.** `limits = input.limits ?? DEFAULT_MATCH_LIMITS`; `withinCeilings(limits)` false (0, a ceiling + 1, 1.5, NaN, a missing key) → `RangeError("createWorld: limits must be whole numbers from 1 to their ceilings")` before anything is built. `MATCH_CEILINGS` themselves are accepted. `hostSeed` 2³² or −1 → `RangeError("createLog: seed …")`. The log is made with the world's limits; `world.limits` is the copied object.
8. **Notices per match.** Every notice a world adds (the create-time grid / placement / unit notices, `actionRefused`, `unlockFailed`, `moveFailed`, `actionUnsupported`, `logFull`, `timeLimit`) goes through one helper: while fewer than `limits.notices`, push; after that, the single line at index `limits.notices` is `{ code: "noticesCapped", message: "and N more" }` with N counting every notice not kept. Cap 3, ten refused moves: 4 lines, the last `"and 7 more"`.
9. **The linear draw.** `createLevels`' offer builds its candidates with a `Set` seeded from the abilities the unit has: same candidates, same order, same `rng.int` calls as the base (see "Draw order"). A 40,000-id pool offers 8 in well under 500 ms.
10. **Options read once.** `createClock(opts)` reads `opts` with `plainCopy(opts, 1)` (a throwing getter or proxy reads as no options: the defaults, no throw); `createGestureMapper(opts, board)` copies `opts` with `plainCopy(opts, 1)` and reads `board.cols` / `rows` / `unitAt` once (an edit of `opts.cellPx` after the mapper is made changes nothing); `units.place(p)` stores `cellOf(p.at)` (frozen; a later edit of the caller's cell moves nothing; a non-cell is placed nowhere: `ok: false`).

## Draw order (exact)
**Unchanged. No draw is added, removed or moved.** The level offer (step 18/19) draws as follows, before and after: (1) `cands` = the bar's pool for the unit's key, in pool order, skipping every id the unit already has and every repeat (first one wins); (2) if `cands.length ≤ offerSize`, the offer is `cands` (no draw); (3) else for `i = 0 … offerSize − 1`: `j = i + rng.int(cands.length − i)`, swap `cands[i]` and `cands[j]`; the offer is `cands.slice(0, offerSize)`. Only step (1) changes: `seen = new Set(have)`, and each pool id not in `seen` is added to `seen` and pushed. `cands` is element-for-element the base's list, so the `rng.int` arguments and results are identical. The test compares 20 seeds against the base draw written out in the test; the sim and every smoke line are unchanged. No other step-21 change draws.

## Tests that prove it is done
Run: `npm test`. Common helpers in `tests/sim/hard-limits.test.ts` (yours to write; the names are not checked): a lying array proxy run in a child process killed after 5 s (as step 20's), `capped(over)` = `{ ...DEFAULT_MATCH_LIMITS, ...over }`, a header, `long(n)`.
- `tests/sim/hard-limits.test.ts` (new):
  - "the door budget (step 21)…": in the child process, `plainCopy(liar(1e9), 3)` is `NOT_PLAIN`, `submit` with it as `effects` gives `actionRefused` and `lastSeq` 0, `createWorld` with it as `chosen` names its Error, and no item was read; with `nodes` `Infinity` a lying length of −1, 1.5, NaN and `Infinity` is each `NOT_PLAIN` with no item read (the length check alone); a 40-deep nest in `terrain` is refused; 2²⁰ + 1 items refused, 2²⁰ − 1 copied.
  - "the log caps (step 21)…": seeds −1, 2³², 1.5 refused and 2³² − 1 kept; a 129-char `projectHash` refused; 16,384 / 16,385 ms; 129-char actor, effect and `via.ref` refused, 128 kept; `append` past `ticks` and `entries`; `parseLog` "too many entries", "bad entry" (tick over), "bad header" (seed 2³²); the log reads back.
  - "submit says logFull (step 21)…": cap 2 entries, three moves: `lastSeq` 2, last notice `logFull`; slow and long-id actions `actionRefused`.
  - "submit says timeLimit (step 21)…": a 30-tick cap; a move at tick 30 is logged; at tick 31 the next move gives `{ code: "timeLimit", message: "time limit" }` (not `logFull`) and `lastSeq` stays 1.
  - "replay and restore stop at the tick cap (step 21)…": as Behaviour 6, the three refusals together in < 1500 ms; a bad `limits` on `replay` names the RangeError; a good `restore` matches.
  - "notices per match (step 21)…": as Behaviour 8.
  - "createWorld checks the caps (step 21)…": as Behaviour 7; `BTF_MATCH_LIMITS` deep-equals `DEFAULT_MATCH_LIMITS`; all three objects frozen.
  - "the linear draw (step 21)…": 20 seeds equal to the base draw; the 40,000-id pool.
  - "options are read once (step 21)…": a clock `stepMs` getter (20, then 5) read once and a throwing getter gives the default 10; a gesture tap after `opts.cellPx` is edited still maps by 64 px; `place` then edit the cell: the unit stays, its cell frozen; a NaN cell is `ok: false`.
- Unchanged (byte-identical): every existing test file; `npm run sim` prints the base's two lines; the four chaos, two exploit-docs, four exploit, six levels and four exploit-levels smoke lines are as at the base. Green ≥ 492.

## How a planted bug is caught (for QA; prototype `4ab3557` on `eb4d16a`, rerun on `h2-r` `6e76f05`; reverted after each; `/tmp/h2-plants.sh`, A-anchored form `/tmp/h2r-plants-A.sh`)
Each plant is an **intent**; the script holds the prototype's example patch. On the build, QA adapts the patch text to that build's code (same intent, same expected failing tests). A "plant text not found" line means "adapt it", not "passed"; "EQUIVALENT" is never counted as caught.
| Plant (one intent) | Tests that fail, by title prefix |
|---|---|
| B1 the default budget back to `Infinity` (QA carry) / B2 whole inputs copied at any depth / B3 the copy trusts an array's length (step 20's L1, kept alive by the `nodes: Infinity` probe) | the door budget |
| L1 no `durationMs` cap / L2 no text cap in `readAction` | the log caps, submit says logFull |
| L3 `append` without the entries cap / L4 without the tick cap / L5 `parseLog` without the count check / L6 without the entry tick cap | the log caps |
| L7 any seed accepted (2³² aliases 0) | the log caps, createWorld checks |
| S1 `submit` without `logFull` (the log throws instead) | submit says logFull |
| S3 `submit` without `timeLimit` (the log throws instead) / S4 running out of ticks says `logFull` (one notice for both caps) | submit says timeLimit |
| S2 `replay` / `restore` without the cap (replays to the forged tick) | replay and restore stop |
| N1 notices uncapped | notices per match |
| C1 `createWorld` skips the ceilings / C2 BTF's preset drifts | createWorld checks |
| D1 the quadratic draw back (slow) / D2 the candidates in another order (draws move) | the linear draw |
| O1 the clock reads its options live / O2 the gesture mapper does / O3 `place` keeps the caller's cell | options are read once |

All 22 test plants fail their named tests (`/tmp/h2-plants.log`). **Grep plants** (`/tmp/h2-grep-plants.sh` on a throwaway clone): 27 plants, one per grep family, each turns its grep in `/tmp/h2-greps.sh` (30 greps: files, size and caps, pins, untouched paths, values, the nine test titles, eight behaviour probes, one type, importers, the limits passed at the doors, layers and laws, sim) to FAIL: 27/27. **Step 20's plants** (`/tmp/h1-plants-r.sh`, F2 / F3 / F5 patch text adapted to this code: `/tmp/h2-h1plants-adapted.sh`): 33/33 still caught. L1 (no integer check on an array's `length`) is now named to "the door budget (step 21)": with the finite default budget a `length` of `Infinity` also fails the "above the values left" check, so only the explicit `nodes: Infinity` probe shows the length check alone. Keep both checks. **On `h2-r` (build A):** test plants 22/22 (`/tmp/h2r-plants-A.sh`: B2, B3, L1, L2, L6 re-anchored to A's text), grep plants 27/27 (`/tmp/h2r-grep-plants-A.sh`: H11, H12, H14c re-anchored), greps 30/30, step 20's plants re-anchored to A (`/tmp/h2r-h1plants-A.sh`, from `/tmp/s20-plants-A.sh`; X1 is QA's no-copy re-anchor: the hook reads the live gen) 32/33: D4 (no node check on plain objects) is equivalent because no test copies a wide plain object under a small budget (a test gap, carried to step 23 / H2c; A's code refuses it).

## Example
```ts
const world = createWorld({ ...input, limits: { ...DEFAULT_MATCH_LIMITS, entries: 2 } });
submit(world, a1); submit(world, a2); submit(world, a3);   // third: { code: "logFull", message: "log full" }; lastSeq 2; nothing thrown
// past limits.ticks (131,072 by default) a move gives { code: "timeLimit", message: "time limit" } instead; the match goes on until a rule ends it
replay(input, world.log, 131073);                          // Error("replay: tick or log over the limits"), before any tick runs
parseLog(text, { ...DEFAULT_MATCH_LIMITS, entries: 1 });  // { ok: false, error: "too many entries" }, no entry read
createLog({ seed: 2 ** 32, formatVersion: 1, engineVersion: "0", projectHash: "h" }); // RangeError("createLog: seed must be a uint32 and header text short")
plainCopy(liar(1e9), 3) === NOT_PLAIN;                     // true at once, no item read (the default budget is 2^20 values)
```

## How later steps use this (context only; do not build)
- **Step 22 (H2b)** adds the document caps (map, stage, levels, recipe) in the same shape (`StageLimits`, `LevelLimits`, `SpriteRecipeLimits` totals) at the same doors, the per-file notice cap (256) with the same `noticesCapped` line, and the int32 range for document numbers.
- **H3** checks `projectHash` / `engineVersion` at `replay` / `restore` within these text caps; **H4** shrinks the clock pile-up that the 16,384 ms cap bounds today.

## Decisions note: what to name
- Where each cap is checked, in what order (`submit`: copy, read, caps, refusal), and why `logFull` comes before the refusal check.
- How `play` refuses before any tick runs, and how you showed it (time of a forged far tick).
- How the notice helper counts "and N more", and that every notice path goes through it.
- How `submit` picks `logFull` (entries) or `timeLimit` (ticks), and the order of the two checks.
- How you showed the draw did not move (the 20-seed comparison, sim, smokes).
- Any door you found that still copies at `Infinity` or reads a live option, with where it should go.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/project/**`, `src/paint/**`, `src/state/**`, `src/fx/**`, `src/rules/turns/**`, `src/rules/levels/{types,index}.ts`, `src/index.ts`, `src/btf-adapters/src/sprite/**`; in `src/core` everything but the files in the list (and the new `limits.ts`); in `src/runtime` everything but `input/gestures.ts`; `src/sim/{player,exploit,chaos,chaos-gen,intents,shrink,exploit-docs,dispose,driver-phase,driver-tick,index}.ts`.
- `tests/**` except the new `tests/sim/hard-limits.test.ts`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 492; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos, two exploit-docs, four exploit, six levels and four exploit-levels smoke lines are as at the base.
- [ ] Pins: `core-types.ts` `f00c722c…`, `package.json` `1e5dd82c…`, `.dependency-cruiser.cjs` `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`; `npm run deps` reports no violations.
- [ ] Behaviour probes (QA runs them on the working tree): Behaviour 1–10 as written, the lying length under a kill timer (a hang is a FAIL); the exact values of the three limits objects; the refusals by their exact texts.
- [ ] Boundaries: one `MatchLimits` type (`rg -n 'export type MatchLimits' src` is one line, in `src/core/limits.ts`); `src/core/limits.ts` imports nothing; the importers of `core/limits.ts` are only `plain.ts`, `log/log.ts`, `sim/{types,world,run}.ts` and `btf-adapters/src/match-limits.ts`; `readAction` gets the world's limits at `submit` and the log's at `append`; no `includes(` in the levels draw; no new folder under `src`.
- [ ] Laws hold: no wall time, timers, `crypto`, `process.` or `node:` imports in `src`; no rules words in `src/core`; no `Math.random` in `src`; nothing imports sim from outside sim.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 15 files of the file list (`A` for the three created, `M` for the rest); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-21-hard-limits/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target steps
- **Step 22 (H2b, document caps):** map width / height 64 × 64 (ceiling 256), objects 1,024, edges 16,384, footprint 8 × 8; the three 144 lists (spawns, neutrals, fixed enemies), waves 256, turn-0 units 144; levels 64, pool 128, offer 8, pools 256 (`createLevels`); notices per file / read 256 then one `noticesCapped`; every document string ≤ 128 and every document whole number int32 (rev, catalogueRev, counts, weights, XP); the stage seed range; recipe totals (runs, points, frame overrides 32,768 each), the 2 MiB recipe document, `stored` cut exactly like `doc`; `readStage` reading its `StageLimits` object live; SE-01 verify C1 (a notice nit: `side < 32` with a non-number `size.w`), C2 (the assert doc keeps every field), C3 (`read.ts`'s literal `fv < 1` should use `SPRITE_RECIPE_FORMAT`).
- **H3 / H4** as named in step 20 (a direct project-reader call on a live hostile object, save integrity, `units.get` live record, `setOffset`, `feedIntent`, the clock's per-tick timer scan). The drivers (`runTicks`, `runMatch`) still advance the clock past `limits.ticks`; only `submit` refuses (`timeLimit`). Ending a match at the time limit is a game rule and is not an engine step (rules or the game's adapter).
- Editing `docs/qa/**` (QA) or `docs/chaos-player-outline.md` (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, saves; any change to the command log format, the snapshot shape, the state tables or the gesture intents; any cap number not in the accepted table.
