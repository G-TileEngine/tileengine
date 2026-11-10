# step-07-events-log: core events with a mode registry, M4 actions and the command log

Step id: step-07-events-log          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `<base: main's SHA after step-06-pipes was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-07-events-log-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-07-events-log-r<N>.bundle <base>..step/step-07-events-log-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-07-events-log/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-02-clock, step-04-units-occupancy, step-05-rng, step-06-pipes
Read first: BUILD_GUIDE.md §2 law 5, M4, M9; §4 (command-log header)
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182c…`; since CN-004 (step 02) the repo holds `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, add-only: every type quoted here is unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/events` and `src/core/log`. The **event bus** is synchronous and ordered, stamps every record with the clock's tick and a sequence number, isolates throwing listeners, and keeps a history. Its vocabulary is **extensible**: the core events are always there, and a mode registers its own typed event map when it creates the bus (MODES-v2: the core owns spawn/wave scheduling, `landedOn`, `pushBlocked`; modes own BUILD-, UPGRADE-, WAVE_CLEARED-, STAGE_CLEARED-style events). The **command log** is append-only: every player or AI action is an M4 action object (data with a duration) logged with its tick, under the header `{seed, formatVersion, engineVersion, projectHash}`, and round-trips through JSON byte for byte. Two small adapters wire step 04's unit hooks and the log's append callback onto the bus. Replay determinism is shown here at unit level and end-to-end in step 09.

Rulings in this step:
- **Core event list (2026-11-09):** the core events are DSK's `CoreEventMap` in `src/types/core-types.ts` (**confirmed**, r14, MAY-MOVE): import it with `EventUnion` and `ModeEventMap`; never retype them. `landedOn {unit, cell, cause: "move" | "forced" | "warp" | "place"}` fires on any move end, never mid-path; `pushBlocked {unit, blocker: "wall-block" | "edge" | "unit", cellsRemaining}` fires when a forced move stops early with `push_into_walls` on; `enteredLane {unit, lane}` is in the map (r14) — its **type** is registered here, its emission comes with a later lanes step. `actionLogged {seq: LogSeq, kind: ActionKind, durationMs: number | null}` is DSK's too (**confirmed** in r14 / rev 15, marked PROPOSED / MAY-MOVE there): once per command-log entry; `durationMs: null` = measured in turns. `EngineEventMap` is exactly `CoreEventMap`; this step adds no core event of its own. These are event types only: there is **no kill, damage or HP logic** in core; rules listen and decide.
- **Mode registry (MODES-v2):** `createBus<M>(clock, { mode, types })`. The type parameter defaults to DSK's augmentable `ModeEventMap` (in core only the optional-`never` placeholder; modes add entries by declaration merging), so the compile-time map and the runtime registry describe the same events. A mode type that collides with a core type, or a duplicate, throws `RangeError` at creation. Emitting or subscribing to an unregistered type throws `RangeError` (a programming error).
- **Log sequence (DSK `LogSeq`):** each entry's `seq` is its 1-based append position (1, 2, 3 …). A save's `logSeq` is the `seq` of the last applied entry, and **0 means none applied**; `lastSeq()` returns 0 for an empty log. `Action.kind` is DSK's `ActionKind` (`"move" | "ability" | "wait"` plus any string).
- **No target = no pipe:** `Action.target` is `Aim | null` (step 06). There is no `"none"` pipe.
- **Header:** `formatVersion` is the **command-log format version**, `1` (Architect ruling; the project's own versions are pinned by `projectHash`). `engineVersion` comes from `src/index.ts`'s `ENGINE_VERSION`, passed in by the caller (core may not import `src/index.ts`). `projectHash` is an input string (core has no crypto). `seed` is the match seed (integer).
- **Integer ms (CN-001):** `durationMs` is an integer ≥ 0 or `null`; ticks are integers.
- **M9:** `via` (which presentation submitted the action) is logged and never read by core.

## Files to create or change
- create `src/core/events/types.ts` — quoted (≤ 45 lines)
- create `src/core/events/bus.ts` — `createBus`, `unitEvents`, `logEvents` (≤ 80 lines)
- create `src/core/events/index.ts` — re-exports (≤ 5 lines)
- create `src/core/log/types.ts` — quoted (≤ 40 lines)
- create `src/core/log/log.ts` — `createLog`, `parseLog` (≤ 75 lines)
- create `src/core/log/index.ts` — re-exports (≤ 5 lines)
- create `tests/core/bus.test.ts` (≤ 90 lines), `tests/core/log.test.ts` (≤ 110 lines), `tests/core/replay.test.ts` (≤ 60 lines)

Size: ≤ 400 changed lines in total (prototype: 210 src). This is the tightest step: keep tests table-driven.

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**, DSK r14 / rev 15, MAY-MOVE): `CoreEventMap` (incl. `actionLogged`), `EventUnion`, `ModeEventMap` (only an optional-`never` placeholder `"mode.none"`, which `EventUnion` drops), `LogSeq`, `ActionKind`:
```ts
/** Command kind, mirroring step-07's `Action.kind` (core-spine-slices step-07 outline): built-ins plus open strings. MAY-MOVE. */
export type ActionKind = "move" | "ability" | "wait" | (string & {});

/** Command-log sequence number: an integer >= 1, the 1-based position of an entry in the command log (append order).
 *  The save document's `logSeq` (project-format §6.9) is the LogSeq of the last applied entry, with 0 meaning none applied. */
export type LogSeq = number;
// in CoreEventMap:
  readonly actionLogged: { readonly seq: LogSeq; readonly kind: ActionKind;
                           readonly durationMs: number | null };                           // PROPOSED, MAY-MOVE: once per command-log entry (step 07);
                                                                                           //   durationMs mirrors Action.durationMs (null = measured in turns)
``` From step 02: `Clock`. From step 04: `UnitHooks`. From step 06: `Aim`.
```ts
// src/core/events/types.ts
import type { CoreEventMap, EventUnion, ModeEventMap } from "../../types/core-types.ts";

/** Core events = DSK's CoreEventMap (landedOn, pushBlocked, enteredLane, actionLogged; MAY-MOVE). Step 07 adds none of its own. */
export type EngineEventMap = CoreEventMap;
export type EngineEvent = EventUnion<EngineEventMap>;
export const ENGINE_EVENT_TYPES = ["landedOn", "pushBlocked", "enteredLane", "actionLogged"] as const satisfies readonly (keyof EngineEventMap)[];

/** A mode's own events (MODES-v2): type name → payload. Registered at bus creation; never core names.
 *  Default = DSK's augmentable ModeEventMap (only the optional-never placeholder "mode.none" in core; EventUnion drops it). */
export type EventMap<M> = { readonly [K in keyof M]?: object };
export type ModeEventType<M> = EventUnion<M>["type"];
export type NoModeEvents = ModeEventMap;
export type BusEvent<M extends EventMap<M>> = EngineEvent | EventUnion<M>;
export type EventRegistry<M extends EventMap<M>> = { readonly mode: string; readonly types: readonly ModeEventType<M>[] };

export type BusRecord<M extends EventMap<M> = NoModeEvents> = { readonly seq: number; readonly tick: number; readonly event: BusEvent<M> };

export interface EventBus<M extends EventMap<M> = NoModeEvents> {
  emit(event: BusEvent<M>): void;
  on<K extends BusEvent<M>["type"]>(type: K, fn: (event: Extract<BusEvent<M>, { readonly type: K }>, rec: BusRecord<M>) => void): () => void;
  onAny(fn: (rec: BusRecord<M>) => void): () => void;
  onError(fn: (err: unknown) => void): () => void;
  isRegistered(type: string): boolean;
  history(): readonly BusRecord<M>[];
}
```
```ts
// src/core/events/bus.ts
export function createBus<M extends EventMap = NoModeEvents>(clock: Clock, registry?: EventRegistry<M>): EventBus<M>;
export function unitEvents<M extends EventMap>(bus: EventBus<M>): UnitHooks;
export function logEvents<M extends EventMap>(bus: EventBus<M>): (entry: LogEntry) => void;
```
```ts
// src/core/log/types.ts
import type { ActionKind, LogSeq } from "../../types/core-types.ts";
import type { Aim } from "../targeting/types.ts";

/** M4: an action is data with a duration. The log stores it; core never executes it.
 *  `target: null` = no target: no pipe; the resolve context gets the caster (actor) only. */
export type ActionTarget = Aim | null;
export type Action = {
  readonly id: string;
  readonly kind: ActionKind;
  readonly actor: string;
  readonly target: ActionTarget;
  readonly durationMs: number | null;
  readonly turns: number | null;
  readonly effects: readonly string[];
  readonly via?: { readonly presentation: string; readonly ref?: string };
};

export const LOG_FORMAT_VERSION = 1;
export type LogHeader = {
  readonly seed: number;
  readonly formatVersion: typeof LOG_FORMAT_VERSION;
  readonly engineVersion: string;
  readonly projectHash: string;
};
/** seq = DSK LogSeq: 1-based append position. A save's logSeq is the last applied seq; 0 = none applied. */
export type LogEntry = { readonly seq: LogSeq; readonly tick: number; readonly action: Action };

export interface CommandLog {
  readonly header: LogHeader;
  append(tick: number, action: Action): void;
  entries(): readonly LogEntry[];
  /** LogSeq of the last entry; 0 when the log is empty (the save convention). */
  lastSeq(): LogSeq;
  toJSON(): string;
}
export type ParseResult = { readonly ok: true; readonly log: CommandLog } | { readonly ok: false; readonly error: string };
```
```ts
// src/core/log/log.ts
export function createLog(header: LogHeader, onAppend?: (entry: LogEntry) => void): CommandLog;
export function parseLog(json: string): ParseResult;
```
Behaviour (exact; each line has a test):
1. **emit:** unregistered type → `RangeError`. Else build `{ seq: ++seq, tick: clock.tick(), event }`, append to history, call the listeners of that type in subscription order, then every `onAny` listener. Re-entrant `emit` from a listener is allowed and gets the next `seq` (depth-first).
2. **on(type):** unregistered type → `RangeError`. The listener receives the narrowed event and the record. Every subscribe returns an unsubscribe; unsubscribing during delivery is safe.
3. **Errors:** a throwing listener is reported to each `onError` listener; the others still run.
4. **history()** returns a copy, oldest first. `isRegistered(type)` is true for the four engine types (`landedOn`, `pushBlocked`, `enteredLane`, `actionLogged`) and the registered mode types.
5. **unitEvents(bus)** returns hooks that emit `{ type: "landedOn", unit, cell, cause }` and `{ type: "pushBlocked", unit, blocker, cellsRemaining }`; use as `createUnits(grid, { hooks: unitEvents(bus) })`.
6. **createLog:** `append(tick, action)` throws `RangeError` if `tick` is not an integer ≥ 0 or is earlier than the last entry's tick (equal is fine). Then it stores `{ seq: <count + 1>, tick, action }` and calls `onAppend`. `lastSeq()` = number of entries (0 when empty). There is no remove, edit or undo API ("the log is not the undo").
7. **toJSON()** = `JSON.stringify({ header, entries })` with keys in the quoted order. `parseLog(log.toJSON()).log.toJSON()` is byte-identical.
8. **parseLog** never throws. It returns `{ ok: false, error }` for: not JSON (`"not JSON"`); missing header or entries; `formatVersion` ≠ 1 (`"unsupported log formatVersion <v>"`); a bad header field; an entry that is not `{seq, tick, action}` with a valid action, or whose `seq` is not its 1-based position (validated by a type guard: id/kind/actor strings, `target` null or a valid UNIT/TILE aim with optional `edge` in N/E/S/W, `durationMs`/`turns` number or null, `effects` string array, optional `via.presentation` string); ticks going backwards. No `as` casts to `Action`.
9. **logEvents(bus)** emits DSK's `{ type: "actionLogged", seq, kind, durationMs }` per appended entry (no `via`, no actor).

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/bus.test.ts tests/core/log.test.ts tests/core/replay.test.ts`.
- `tests/core/bus.test.ts`
  - "events are ordered and stamped": after `clock.advance(30)`, three emits get `seq` 1, 2, 3 and `tick` 3; listener order is subscription order, `onAny` last.
  - "a throwing listener is isolated": reported via `onError`; the next listener still runs.
  - "unit hooks emit the DSK core events": units created with `{ hooks: unitEvents(bus), terrain: { push_into_walls: true } }` on the step-04 push map: place + push `e` 5 gives history types `["landedOn", "pushBlocked", "landedOn"]` with causes `place`, `forced` and `blocker: "wall-block"`, `cellsRemaining: 3`.
  - "mode registry: typed mode events": `createBus<{ WAVE_CLEARED: { readonly wave: number } }>(clock, { mode: "td", types: ["WAVE_CLEARED"] })` delivers `{ type: "WAVE_CLEARED", wave: 2 }` to `on("WAVE_CLEARED")` with `e.wave === 2`; core events still work on the same bus.
  - "registry collisions and unregistered types throw": registering `"landedOn"` or the same type twice → `RangeError`; on a bus with no registry, emitting `"WAVE_CLEARED"` (cast through `never` in the test only) → `RangeError`; `isRegistered` answers correctly.
- `tests/core/log.test.ts`
  - "header carries seed, formatVersion 1, engineVersion and projectHash": `engineVersion` equals `ENGINE_VERSION` imported from `src/index.ts` in the test.
  - "an action is data with a duration (M4)": `{ kind: "move", durationMs: 200, target: aimTile(...) }` is stored unchanged.
  - "round trip is byte-identical": a log with a UNIT aim, a TILE aim with `edge: "S"`, a `null` target and a `via` round-trips through `parseLog` to the same string.
  - "parseLog never throws on bad input": each case in Behaviour 8 returns `ok: false` with the stated error (`"unsupported log formatVersion 2"` exactly for version 2).
  - "seq is the 1-based append order; 0 = none": empty log `lastSeq() === 0`; after three appends the seqs are 1, 2, 3 and `lastSeq() === 3`; JSON with an entry's `seq` changed returns `ok: false`.
  - "actionLogged carries seq, kind, durationMs": with `logEvents(bus)`, appending a `wait` with `durationMs: null` emits exactly `{ type: "actionLogged", seq: 1, kind: "wait", durationMs: null }`.
  - "append-only, ticks never go backwards": no remove/edit/undo keys on the log object; `append(4)` after `append(5)` throws `RangeError`; equal ticks are fine.
  - "via is logged and never read by core (M9)": the stored entry keeps `via` unchanged; the `actionLogged` event carries no `via`.
- `tests/core/replay.test.ts`
  - "replaying a log reproduces the event history": a test-local `apply(action)` maps `kind "move"` to `units.moveTo` and `kind "push"` to `units.push`; run 6 actions live with a bus, then on fresh grid/units/bus `parseLog(log.toJSON())` and apply the entries: the two bus histories deep-equal (`seq`, `tick`, events).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- `src/core/unit/**` (hooks are wired from outside via `unitEvents`), `src/core/targeting/**`, `src/core/grid/**`, `src/core/rng/**`, `src/core/clock/**`, `src/state/**`, `src/rules/**`, `src/index.ts`.
- No kill, damage, HP or lethal-landing handling anywhere in core: rules listen to `landedOn` / `pushBlocked` later.
- No mode event names (WAVE_*, BUILD_*, STAGE_*, UPGRADE_*) in `src/` (they live in tests only, as registry examples).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 95. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'readonly cause: "move"|cellsRemaining: number' src/core` prints nothing (DSK's `CoreEventMap` is imported, not retyped).
- [ ] `rg -n -i 'kill|damage|hp\b|card' src/core` prints nothing.
- [ ] `rg -n 'WAVE_|BUILD_|STAGE_|UPGRADE_' src` prints nothing.
- [ ] `rg -n 'as unknown as|as Action' src/core/log` prints nothing.
- [ ] `rg -n 'type LogSeq|type ActionKind|actionLogged: \{' src/core` prints nothing (DSK's types are imported).
- [ ] `node --test tests/core/replay.test.ts` passes.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-07-events-log/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## BTF intent (read-only; a rewrite of the same idea)
`src/engine/log.ts:3-9` `Command`, `:13-21` `writeCommand`, `:23-25` `readLog`; `chess/game/towerLog.ts:11-22` `noteLine`/`noteSq`. Not repeated: string `"col,rank"` coordinates, the `card` field, a counter called `seed`.

## Out of scope
- Executing actions over their `durationMs` (step 09 harness), undo, networking, persistence of the log.
- `SimSnapshot`, `replayTicks(n)` and headless `advance(ms)` (step 09); offline catch-up (host-supplied elapsed ms, capped; future).
- Mode event maps themselves (idle, tower defence): registered by those modes later.
