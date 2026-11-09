# step-01-state-tables: shared + tactics flow + tactics input tables, and xGo

Step id: step-01-state-tables          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (private; never push to `main`)
Base commit: `<base: main's SHA after step-00-skeleton was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-01-state-tables-r<N>`, created from the base. Never commit to `main`. Finish with a PR to `main`.
Hand-back location: in the repo, on that branch: `handback/step-01-state-tables/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-00-skeleton
Read first: BUILD_GUIDE.md §2 (M2), §5; `docs/STATES.md` §2, §3, §4, §6 (all binding for this step)
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3`. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Implement the battle state machine from `docs/STATES.md` as data plus one pure function. After this step the repo has the **shared** table (targeting, resolving, victoryCheck, result and the overlay rows), the **tactics flow** table and the **tactics input** table, merged into one index, and `xGo(from, event)` — the only transition in the engine. A rejected edge returns `from` unchanged and never throws. There is no driver, no overlay-stack holder and no mode table yet; the `sets` column is documentation for later drivers. This pins the event vocabulary that the clock (fuse), the log and the sim harness use later. The AI uses these same events (STATES §3).

Rulings in this step:
- **Untargeted actions (2026-11-09):** an ability with no target skips `targeting`: `actMenu --CHOOSE_ACTION--> resolving`. `CHOOSE_ACTION` is one row with a pick-list, so the key `(actMenu, CHOOSE_ACTION)` stays unique; the event carries `next: "targeting" | "resolving"` (STATES §3.3, §4).
- **FUSE_EXPIRE** is only an event type here. Its timer is built in step 02 on the one clock (integer sim ms, CN-001); never wall time.
- `play.running` (the shared tick mode for idle / TD, MODES-v2) is **not** in the `Phase` union yet. It arrives by Change Notice with the first tick mode. Do not add it.

## Files to create or change
- delete `src/state/.gitkeep`
- create `src/state/types.ts` — the types of STATES §4, verbatim, plus `ALL_PHASES` and `ALL_EVENT_TYPES` (≤ 80 lines)
- create `src/state/shared.table.ts` — `SHARED_TABLE` (≤ 30 lines)
- create `src/state/tactics.flow.table.ts` — `TACTICS_FLOW_TABLE` (≤ 30 lines)
- create `src/state/tactics.input.table.ts` — `TACTICS_INPUT_TABLE` (≤ 30 lines)
- create `src/state/xgo.ts` — `mergeTables`, `TABLES`, `xGo` (≤ 60 lines)
- create `src/state/index.ts` — re-exports only (≤ 10 lines)
- create `tests/state/helpers.ts` — `sample(type, next?)` builds one valid `Event` per type (not a test file; ≤ 30 lines)
- create the five test files named under "Tests" (≤ 70 lines each)

Size: ≤ 400 changed lines in total (prototype: 150 src + ~220 tests).

## Interfaces to match (quoted exactly)
Quoted verbatim from `docs/STATES.md` §4 (QA G4 diffs your file against STATES §4 after whitespace normalisation). `Sq` is imported from `src/types/core-types.ts` (**confirmed**, DSK, STABLE); nothing else here comes from core-types.
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

/** Every phase and every event type, once. tests/state/tables.coverage.test.ts proves both lists are exhaustive. */
export const ALL_PHASES = [
  "play.loading", "play.result", "targeting", "resolving", "victoryCheck",
  "overlay.none", "overlay.pause", "overlay.settings", "overlay.saveLoad",
  "deploy", "roundStart", "sideStart", "unitDone", "sideEnd", "roundEnd",
  "idle", "unitSelected", "moving", "actMenu",
] as const satisfies readonly Phase[];

export const ALL_EVENT_TYPES = [
  "BATTLE_READY", "DEPLOY_DONE", "ROUND_BEGIN", "SIDE_BEGIN", "SELECT_UNIT", "CANCEL", "TAP_MOVE_CELL", "MOVE_DONE",
  "UNDO_MOVE", "CHOOSE_ACTION", "CONFIRM_TARGET", "WAIT", "RESOLVE_DONE", "CHECK_NONE", "CHECK_END", "UNIT_DONE",
  "END_TURN", "FUSE_EXPIRE", "SIDE_END", "ROUND_END", "OPEN_PAUSE", "OPEN_SETTINGS", "OPEN_SAVELOAD", "CLOSE",
] as const satisfies readonly EventType[];
```
```ts
// src/state/shared.table.ts, tactics.flow.table.ts, tactics.input.table.ts
export const SHARED_TABLE: Table;          // id "shared"
export const TACTICS_FLOW_TABLE: Table;    // id "tactics.flow"
export const TACTICS_INPUT_TABLE: Table;   // id "tactics.input"

// src/state/xgo.ts
export function mergeTables(tables: readonly Table[]): ReadonlyMap<string, Row>;   // key `${from}|${event}`; a duplicate key throws Error("duplicate state edge <from>|<event> in table <id>")
export const TABLES: readonly Table[];     // [SHARED_TABLE, TACTICS_FLOW_TABLE, TACTICS_INPUT_TABLE], frozen
export function xGo(from: Phase, event: Event): Phase
```
`xGo` rules (exact):
1. Look up the row for `(from, event.type)` in the index built once from `TABLES` at module load.
2. No row → return `from`.
3. `row.to` is a string → return it.
4. `row.to` is an array (pick-list) → if the event has `next` and `row.to` includes it, return `next`; otherwise return `from`.
5. Never throws, never reads anything but its arguments and the index. No logging.

Rows: transcribe STATES §2 (overlay rows) and §3.1–§3.3 one row per table line; `from` arrays in the order STATES lists them; `sets` tags may be short identifiers (they are ignored by `xGo`). The `CHOOSE_ACTION` row is `{ from: ["actMenu"], event: "CHOOSE_ACTION", to: ["targeting", "resolving"], ... }`.

`ALL_PHASES` / `ALL_EVENT_TYPES` use `as const satisfies readonly Phase[]` (no `as Phase` cast: `check:state` fails on it). Exhaustiveness is proven in `tables.coverage.test.ts` with a `Record<Phase, true>` literal.

## Tests that prove it is done
Run all: `npm test`. Run one file: `node --test tests/state/<file>.test.ts`. Names are binding (STATES §6).
- `tests/state/xgo.accepts.test.ts`
  - "every row of every table is accepted": for each table, row, `from` and (pick-lists) each allowed `next`, `xGo(from, sample(row.event, to)) === to`; asserts exactly 38 (from, event, to) edges were checked (34 keys).
  - "CHOOSE_ACTION with next resolving skips targeting": `xGo("actMenu", { type: "CHOOSE_ACTION", actionId: "rally", next: "resolving" }) === "resolving"`; with `next: "targeting"` → `"targeting"`.
- `tests/state/xgo.rejected-noop.test.ts`
  - "no row → xGo returns from": every `Phase × EventType` pair with no row returns `from` (assert > 300 pairs checked) and never throws.
  - "illegal next on a pick-list row → from": `UNIT_DONE` with `next: "roundEnd"`, `CHECK_NONE` with `next: "idle"`, `CHOOSE_ACTION` with `next: "moving"` each return `from` (build the bad payloads in a typed helper that widens through `unknown`, not `as Phase`).
- `tests/state/tables.merge.test.ts`
  - "the three tables merge with no duplicate key": `mergeTables(TABLES).size` equals the sum of `row.from.length` over all rows.
  - "a duplicate (from, event) throws": adding `{ id: "dup", rows: [{ from: ["actMenu"], event: "WAIT", to: "idle" }] }` throws `/duplicate state edge actMenu\|WAIT in table dup/`.
- `tests/state/tables.coverage.test.ts`
  - "ALL_PHASES and ALL_EVENT_TYPES are exhaustive": keys of a `Record<Phase, true>` literal and a `Record<EventType, true>` literal equal the two lists (sorted).
  - "every phase is reachable": BFS over the index from `play.loading` and `overlay.none` reaches all 19 phases.
  - "only play.result is terminal": every phase except `play.result` has at least one outgoing row.
- `tests/state/tactics.script.test.ts`
  - "scripted battle reaches play.result": fold one event list through `xGo` (keep the result as `const next = xGo(s.phase, e)` and a new snapshot `{ ...s, phase: next }`): BATTLE_READY, DEPLOY_DONE, ROUND_BEGIN, SIDE_BEGIN, SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, CHOOSE_ACTION(next targeting), CONFIRM_TARGET(tile), RESOLVE_DONE, CHECK_NONE(unitDone), UNIT_DONE(idle), SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, CHOOSE_ACTION(next resolving), RESOLVE_DONE, CHECK_NONE(unitDone), UNIT_DONE(sideEnd), SIDE_END, CHECK_NONE(sideStart), SIDE_BEGIN (rival side: same events, "AI"), SELECT_UNIT, FUSE_EXPIRE, SIDE_END, CHECK_NONE(roundEnd), ROUND_END, ROUND_BEGIN, SIDE_BEGIN, END_TURN, SIDE_END, CHECK_END(win). Assert the phase after each event (one expected list) and that the last is `play.result`.
  - "overlay rows push and pop": `overlay.none` → OPEN_PAUSE → `overlay.pause` → OPEN_SETTINGS → `overlay.settings` → CLOSE → `overlay.none`; OPEN_PAUSE from `overlay.pause` is a no-op.

## BTF intent (read-only notes; no BTF code is adapted)
Rewrite from intent: turn hand-off `chess/game/towerChess.ts:572` `handOff`, tick `:697`, `:1190` `yourTurn`, tap flow `:1304`; fuse `chess/game/towerChessClock.ts:109-122`, which reads `Date.now` at `:112` — the reason `FUSE_EXPIRE` must come from the sim clock.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- `src/core/**` (M2: this step must not touch core; `src/core/.gitkeep` stays).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 18. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'phase' src/core` prints nothing (M2).
- [ ] `node --test tests/state/xgo.rejected-noop.test.ts` passes and checks > 300 pairs.
- [ ] `rg -n 'import' src/state | rg -v 'core-types.ts|\./'` prints nothing (state imports only local files and core-types).
- [ ] `npm run check:state` prints no `REVIEW` lines outside `src/state/xgo.ts` and `src/state/types.ts`.
- [ ] `src/state/types.ts` matches STATES §4 for every quoted type (QA G4).
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-01-state-tables/r<N>/` complete per HAND-BACK.md; PR from `step/step-01-state-tables-r<N>` to `main` open; nothing committed to `main`.

## Out of scope
- The engine-mode table (boot/title/wizard/editor/preview/play/render), the overlay-stack holder, any driver that performs `sets`.
- The fuse timer (step 02), turn and side bookkeeping, the AI.
- Menu-RPG and RTS tables (**parked** by the CEO), idle-RPG and tower-defence tables (PROPOSED notes in STATES §5 only), `play.running`.
- Any import from `src/core`, `src/rules` or a later layer.
