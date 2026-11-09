# TileEngine — STATES (mode, play, overlay and battle state tables)

Owner: Engine Architect. Status: **v1.1, 2026-11-09 (Europe/London, UTC+0)** (kit-2: CEO mode order, CN-001 integer ms, untargeted `CHOOSE_ACTION`, PROPOSED idle/TD notes). The mode list, the play sub-states, the overlay list and the grid-tactics phase list are **settled** (not PROPOSED). Event names marked *(EA name)* are the Architect's naming and may be renamed by Change Notice before the step that implements them.

**Credit:** the mode list, overlays-as-a-stack, play sub-states, the tactics flow (events, from/to, "sets"), the flow/input split, the shared table and the (now parked) RPG/RTS notes all come from **Modes Designer** (`/workspace/tileengine-modes/STATES-input-for-architect.md`, 2026-11-09; constraints M1–M9 from `MODES-v1.md`). The idle-RPG and tower-defence notes in §5 use Modes Designer's final event names from `/workspace/tileengine-modes/STATES-idle-td-events.md` and the hooks of `MODES-v2.md` (2026-11-09).

**Mode order (CEO, 2026-11-09, via CoS):** grid tactics first, then idle RPG, then tower defence. Menu turn RPG and RTS are **parked**. This document turns that input into exact types and tables and adds the engine rules (one clock, xGo, no-op on rejected edges).

Implemented by: `step-01-state-tables` (shared table + tactics flow + tactics input + `xGo` + the rejected-edge no-op test). The mode table and the overlay stack holder are later steps; they are specified here so step 01 does not block them.

## 0. Rules (engine law; also in BUILD_GUIDE.md)
1. **Tables live only in `src/state/<name>.table.ts`.** Step 01 creates `shared.table.ts`, `tactics.flow.table.ts`, `tactics.input.table.ts`.
2. **The only transition is** `export function xGo(from: Phase, event: Event): Phase` in `src/state/xgo.ts`. It is pure: no clock, no RNG, no I/O, no mutation, no globals other than the frozen merged table.
3. **A rejected edge is a no-op.** If no row matches `(from, event.type)`, or the row's destination is a pick-list and the event's `next` is not in it, `xGo` returns `from` unchanged. It never throws for a rejected edge.
4. **No phase writes anywhere.** Nothing in `src/` assigns to a variable or property named `phase` (QA G3 grep, `npm run check:state`). The sanctioned way to keep a result is an immutable snapshot: `const next = xGo(s.phase, e)` and then `{ ...s, phase: next }` (an object literal key, which the grep does not match). No `as Phase` casts and no second transition function.
5. **Options never live in xGo.** An optional edge (UNDO_MOVE, FUSE_EXPIRE) has a row; whether the event is ever emitted is decided by the emitter from project options. xGo has no option parameter.
6. **Every timer comes from the one engine clock, never wall time.** Sim time is **integer milliseconds** (CN-001). `FUSE_EXPIRE`, tower defence's `BUILD_TIMER_EXPIRE` and every other timer are sim-ms timers on `core/clock` (paused by pause/overlays, scaled by game speed, stopped by stage jump). **Game speed x1/x2/x3** is a clock option (`timeScale`): more fixed steps per host frame, never a different step size; it is not an event. The full ban list (timers, `Date`, `performance.now`, and `requestAnimationFrame` outside `src/runtime/host/raf-driver.ts`) is BUILD_GUIDE law 1 and `check:law`; that list is authoritative.
7. **The turn fuse is an option: `off` or a length in integer sim ms (`FuseMs` > 0, CN-001).** Any value is legal (user-adjustable, CEO 2026-11-09); 30000 and 60000 are suggested values. The default is preset/project data, never core: the BTF preset uses **60000** (CEO 2026-11-09); the tactics sample uses `off` (Modes Designer, MODES-v1 toggles). The fuse starts at `SIDE_BEGIN` and is cancelled when the side reaches `sideEnd`.
8. **The AI emits the same events as a player.** There is no AI-only or player-only event. The AI hook (`proposeActions`, M6) returns actions; a driver turns them into the same `Event`s.
9. **No phase logic in core (M2).** `src/core/**` never imports `src/state/**` and contains no `phase` identifier. Tables are above core; rules and runtime drive them.
10. **Merged table, unique keys.** `xGo` reads one frozen index built from all implemented tables at module load. A duplicate `(from, event.type)` key across tables throws at load (a test proves the tables merge cleanly).

## 1. Engine modes (top-level machine)
| Mode | What it is | In an exported game? |
|---|---|---|
| `boot` | asset load and project open | yes |
| `title` | editor: project picker / recent games. Exported game: the game's own title screen | yes |
| `wizard` | new-project wizard | no (editor only) |
| `editor` | the editor, including the Stage/Level Designer | no |
| `preview` | the runtime with the dev overlay (§1.2 of ARCHITECTURE §4) | no |
| `play` | the game running; sub-states below | yes |
| `render` | Render pipeline running | no |

Mode transitions *(EA names; implemented in a later step, `step-NN-mode-table`)*:

| event | from | to |
|---|---|---|
| `TITLE` | boot | title |
| `NEW_PROJECT` | title | wizard |
| `WIZARD_DONE` | wizard | editor |
| `WIZARD_CANCEL` | wizard | title |
| `OPEN_PROJECT` | title | editor |
| `CLOSE_PROJECT` | editor | title |
| `START_PREVIEW` | editor | preview |
| `STOP_PREVIEW` | preview | editor |
| `START_RENDER` | editor | render |
| `RENDER_DONE` | render | editor |
| `START_PLAY` | title | play |
| `EXIT_PLAY` | play | title |

The exported game's audit (ARCHITECTURE §2) checks that `wizard`, `editor`, `preview`, `render` code is absent; the mode table rows for them are data only.

### 1.1 `play` sub-states
`play.loading` → `play.running` → `play.result` (`outcome` = `win` | `lose` | `draw`; BTF now allows draws).
- In **grid tactics**, "running" is the whole tactics battle machine (§3): `BATTLE_READY` goes from `play.loading` straight to `deploy`, and `CHECK_END` goes to `play.result`. Any tactics phase counts as running (`isRunning(phase)` is a lookup, not a stored phase).
- `play.running` is the **shared tick mode**: the stored phase for any tick-driven mode (idle RPG's `running`, tower defence's `waveRunning` run on it; MODES-v2). It joins the `Phase` union by Change Notice with the first tick mode; step 01 does not add it.
- From `play.result`: `RETRY` → `play.loading`, `EXIT_PLAY` (mode table) → `title` *(EA names, later step)*.
- Preview runs the same play machine inside `preview`.

## 2. Overlays: a stacked table, not modes
Pause, settings and save/load sit **over** `editor`, `preview` and `play`. They are a stack, so pause → settings → back to pause works.

| event | from | to |
|---|---|---|
| `OPEN_PAUSE` | overlay.none | overlay.pause |
| `OPEN_SETTINGS` | overlay.none, overlay.pause | overlay.settings |
| `OPEN_SAVELOAD` | overlay.none, overlay.pause | overlay.saveLoad |
| `CLOSE` | overlay.pause, overlay.settings, overlay.saveLoad | overlay.none |

Stack semantics (holder implemented in a later step, rows implemented in step 01 as part of the shared table):
- The stack's bottom is always `overlay.none`. On an event, `next = xGo(top, e)`. An `OPEN_*` that changes the phase **pushes** `next`; a `CLOSE` that returns `overlay.none` **pops** the top. Anything else is a no-op.
- While the stack is not empty in `preview` or `play`: the sim clock is paused (`clock.pause()`), so the fuse and every timer stop; battle events from input are not delivered. The AI does not run.
- Which modes may open which overlay is the mode table's job (e.g. `OPEN_SAVELOAD` in `play` only if the project enables player saves).

## 3. Grid tactics battle machine
Split into **tactics.flow** (turn structure: rounds, sides, end of unit and side) and **tactics.input** (one unit's command sub-flow), plus the **shared** table that every mode extends (`targeting`, `resolving`, `victoryCheck`, `play.result`, overlays). `*` = auto event, fired by the system (the AI side uses the same table and the same events).

### 3.1 Shared table (`src/state/shared.table.ts`)
| event | from | to | sets (done by the driver, not xGo) |
|---|---|---|---|
| `CONFIRM_TARGET` | targeting | resolving | target |
| `RESOLVE_DONE*` | resolving | victoryCheck | |
| `CHECK_END*` | victoryCheck | play.result | outcome = win / lose / draw |
| overlay rows | §2 | §2 | |

### 3.2 Tactics flow (`src/state/tactics.flow.table.ts`)
| event | from | to | sets |
|---|---|---|---|
| `BATTLE_READY` | play.loading | deploy | side = player |
| `DEPLOY_DONE` | deploy | roundStart | round = 1 |
| `ROUND_BEGIN*` | roundStart | sideStart | side = first |
| `SIDE_BEGIN*` | sideStart | idle | start-of-turn effects; fuse starts (if on) |
| `UNIT_DONE*` | unitDone | idle \| sideEnd (`next`) | unit.spent; `idle` if the side has units left |
| `END_TURN` | idle, unitSelected | sideEnd | |
| `FUSE_EXPIRE` (option: `FuseMs` integer ms, e.g. 30000 / 60000, or off) | idle, unitSelected, actMenu, targeting | sideEnd | |
| `SIDE_END*` | sideEnd | victoryCheck | end-of-turn effects; side = next |
| `CHECK_NONE*` | victoryCheck | unitDone \| sideStart \| roundEnd (`next`) | `unitDone` after a resolve; after `sideEnd`: `sideStart` if another side is due this round, else `roundEnd` |
| `ROUND_END*` | roundEnd | roundStart | round++ |

### 3.3 Tactics input (`src/state/tactics.input.table.ts`)
| event | from | to | sets |
|---|---|---|---|
| `SELECT_UNIT` | idle, unitSelected | unitSelected | sel = unit, show move cells |
| `CANCEL` | unitSelected | idle | sel = null |
| `TAP_MOVE_CELL` | unitSelected | moving | path |
| `MOVE_DONE*` | moving | actMenu | |
| `UNDO_MOVE` (option) | actMenu | unitSelected | restore cell |
| `CHOOSE_ACTION` | actMenu | targeting \| resolving (`next`) | action; `targeting` + show shape when the action has a target; `resolving` when it has none (no pipe; resolve gets the caster only; ruling 2026-11-09) |
| `CANCEL` | targeting | actMenu | |
| `WAIT` | actMenu | unitDone | |

`CANCEL` appears twice with different `from`, so the keys stay unique. `CHOOSE_ACTION` is one row with a pick-list (`next`), so the untargeted edge `actMenu → resolving` (ruling 2026-11-09: an ability with no target skips `targeting`) keeps the key unique too. A `MOVE_DONE` comes from the end of the move action's `durationMs` on the one clock (M4), never from a wall-clock timeout.

### 3.4 Input intents (M7) → events
The input layer emits intents, never raw DOM: `SelectUnit` → `SELECT_UNIT`, `TargetCell` → `TAP_MOVE_CELL` (in `unitSelected`) or `CONFIRM_TARGET` (in `targeting`), `Confirm` → `CONFIRM_TARGET`, `Cancel` → `CANCEL`, `BoxSelect` → no tactics event (reserved for RTS; must not crash). Tap-tap and drag-to-target produce identical events.

## 4. Exact types (quoted verbatim by step 01; QA G4 diffs these)
```ts
// src/state/types.ts
import type { Sq } from "../types/core-types.ts";

export type Phase =
  | "play.loading" | "play.result"
  | "targeting" | "resolving" | "victoryCheck"
  | "overlay.none" | "overlay.pause" | "overlay.settings" | "overlay.saveLoad"
  | "deploy" | "roundStart" | "sideStart" | "unitDone" | "sideEnd" | "roundEnd"
  | "idle" | "unitSelected" | "moving" | "actMenu";

export type Outcome = "win" | "lose" | "draw";

export type TargetRef =
  | { readonly pipe: "unit"; readonly unitId: string }
  | { readonly pipe: "tile"; readonly at: Sq };

export type Event =
  | { readonly type: "BATTLE_READY" }
  | { readonly type: "DEPLOY_DONE" }
  | { readonly type: "ROUND_BEGIN" }
  | { readonly type: "SIDE_BEGIN" }
  | { readonly type: "SELECT_UNIT"; readonly unitId: string }
  | { readonly type: "CANCEL" }
  | { readonly type: "TAP_MOVE_CELL"; readonly at: Sq }
  | { readonly type: "MOVE_DONE" }
  | { readonly type: "UNDO_MOVE" }
  | { readonly type: "CHOOSE_ACTION"; readonly actionId: string; readonly next: "targeting" | "resolving" }
  | { readonly type: "CONFIRM_TARGET"; readonly target: TargetRef }
  | { readonly type: "WAIT" }
  | { readonly type: "RESOLVE_DONE" }
  | { readonly type: "CHECK_NONE"; readonly next: "unitDone" | "sideStart" | "roundEnd" }
  | { readonly type: "CHECK_END"; readonly outcome: Outcome }
  | { readonly type: "UNIT_DONE"; readonly next: "idle" | "sideEnd" }
  | { readonly type: "END_TURN" }
  | { readonly type: "FUSE_EXPIRE" }
  | { readonly type: "SIDE_END" }
  | { readonly type: "ROUND_END" }
  | { readonly type: "OPEN_PAUSE" }
  | { readonly type: "OPEN_SETTINGS" }
  | { readonly type: "OPEN_SAVELOAD" }
  | { readonly type: "CLOSE" };

export type EventType = Event["type"];

export type Row = {
  readonly from: readonly Phase[];
  readonly event: EventType;
  readonly to: Phase | readonly Phase[];   // array = pick-list; the event's `next` must be in it
  readonly sets?: readonly string[];      // documentation tags for the driver; xGo ignores them
};

export type Table = { readonly id: string; readonly rows: readonly Row[] };
```
```ts
// src/state/xgo.ts
export function xGo(from: Phase, event: Event): Phase
```
Notes:
- `Event` here is the **state-machine input**. It shadows the DOM/Node global `Event` type, so it is always imported explicitly from `src/state/types.ts`. The core event bus (step 07) uses a different name, `CoreEvent`.
- Pick-list rows read only `event.next`; `CHECK_END` routes by its row (`play.result`) and carries `outcome` for the driver.
- `Phase` and `Event` grow by Change Notice when the mode table, `play.running` (RTS) or RPG phases land.

## 5. Later modes (notes only; nothing here is implemented in v1 steps)
Order: **idle RPG**, then **tower defence**. Menu RPG and RTS are **parked**. Table names follow `<mode>.<name>.table.ts`; mode phases are **prefixed** (`idle.*`, `td.*`) so the merged index never collides with tactics keys (MODES-v2 B8). Mode-only events are registered on the core bus by the mode (step 07's registry); spawn/wave scheduling events, `landedOn` and `pushBlocked` are core-owned. `*` = auto event.

### 5.1 Idle RPG — PROPOSED (Modes Designer, `STATES-idle-td-events.md`)
Phases: `idle.running` (stored as the shared tick mode `play.running`), `idle.offlineCatchup`. Overlay: `upgradeMenu` (an overlay that does **not** pause the sim by default; option `pauseSim`, default off).
| event | from | to | sets |
|---|---|---|---|
| `BATTLE_READY` | play.loading | running | stage = saved or 1 |
| `RESUME_ELAPSED` | play.loading, running | offlineCatchup | elapsedMs = min(host ms, project cap) |
| `CATCHUP_DONE*` | offlineCatchup | running | catchupSummary (rewards popup) |
| `SUSPEND` | running | running | host backgrounded; write `SimSnapshot` (no phase change) |
| `STAGE_CLEARED*` | running | running | stage++ |
| `PARTY_WIPED*` | running | running | stage −= retreatSteps (option, default 1) |
| `BOSS_CHALLENGE` | running | running | bossAttempt = true |
| `PRESTIGE` (option) | running | play.loading | reset with prestige currency |
| `OPEN_UPGRADES` / `CLOSE_UPGRADES` | overlay push / pop over running | — | `pauseSim` option (default off) |
| `BUY_UPGRADE` | upgradeMenu overlay | — | no phase change |
Offline catch-up: the host supplies the elapsed ms (capped by a project setting); core never reads wall time. Two user options (CEO, 2026-11-09): deterministic tick replay from a `SimSnapshot` with the same seeded RNG (`replayTicks(n)` / `advance(ms)`, step 09; the default, used by tests), or a faster seeded rules-layer estimate marked `estimated` (excluded from replay-equality tests).

### 5.2 Tower defence — PROPOSED (Modes Designer, `STATES-idle-td-events.md`)
Phases: `td.build`, `td.waveRunning` (on the shared tick mode), `td.waveCleared`; `victoryCheck` and `play.result` are the shared ones.
| event | from | to | sets |
|---|---|---|---|
| `BATTLE_READY` | play.loading | build | wave = 1, lives, gold |
| `PLACE_TOWER` / `SELL_TOWER` / `UPGRADE_TOWER` | build (+ waveRunning if option `allowBuildDuringWave`, default on) | same | tower ops |
| `START_WAVE` | build | waveRunning | spawner armed |
| `BUILD_TIMER_EXPIRE` (option) | build | waveRunning | sim-ms timer on the one clock |
| `WAVE_SPAWN_DONE*` | waveRunning | waveRunning | spawner idle |
| `ENEMY_LEAKED*` | waveRunning | waveRunning | lives−− |
| `LIVES_ZERO*` | waveRunning | victoryCheck | outcome = lose |
| `WAVE_CLEARED*` | waveRunning | victoryCheck | rewards |
| `CHECK_NONE*` | victoryCheck | waveCleared | |
| `CHECK_END*` | victoryCheck | play.result | win on final wave cleared, lose on lives 0 |
| `NEXT_WAVE` | waveCleared | build (or waveRunning if option `autoStart`) | wave++ |
Paths are ordered cell lists: hand-placed waypoints (`map.paths`, core-types r14 MAY-MOVE) or auto-pathing spawn → exit by a future `core/path` (tie-break N, E, S, W; recomputed when towers block; warning if no path); spawns are scheduled clock events; creeps use a future `softStack` occupancy policy. Speed x1/x2/x3 is the clock option, not an event.

### 5.3 Parked (CEO, 2026-11-09): menu turn RPG and RTS
Kept for reference only; not scheduled.
- **Menu RPG (parked):** drop `deploy`, `moving` and `UNDO_MOVE`; `sideStart`/`idle` become `queueNext` → `actorTurn`; `INTERRUPT` for ultimates; formation replaces deploy; an action-value queue on the same clock (M1).
- **RTS (parked):** no flow table; ticks on `play.running`; per-unit order tables; input `none`, `selected`, `boxSelecting`, `ordering`. BoxSelect stays a no-op intent in tactics (M7).
- **Shared across all modes:** targeting, resolving, victoryCheck, result, overlays — kept in the shared table so mode tables extend it. A phase-name collision is a Change Notice, never a silent override.

## 6. Tests step 01 must ship (names are binding)
- `tests/state/xgo.accepts.test.ts` — every row of every table: for each `from`, the right event yields `to` (pick-lists: each allowed `next`); plus "CHOOSE_ACTION with next resolving skips targeting" (untargeted action, ruling 2026-11-09).
- `tests/state/xgo.rejected-noop.test.ts` — for every `Phase` × every `EventType` with no row, `xGo(from, e) === from`; a pick-list row with an illegal `next` returns `from`; xGo never throws.
- `tests/state/tables.merge.test.ts` — the three tables merge with no duplicate `(from, event)` key; a synthetic duplicate throws.
- `tests/state/tables.coverage.test.ts` — every `Phase` is reachable from `play.loading` or `overlay.none`, and every non-terminal tactics phase has an exit (only `play.result` is terminal here).
- `tests/state/tactics.script.test.ts` — a scripted battle: player selects, moves, attacks, resolve, check none, unit done, end turn, rival side (same events, "AI"), fuse expire, check end → `play.result`.
