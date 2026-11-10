# step-04-units-occupancy: units, one occupancy table with a policy (strict1), forced movement, reach

Step id: step-04-units-occupancy          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `<base: main's SHA after step-03-grid-edges was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-04-units-occupancy-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-04-units-occupancy-r<N>.bundle <base>..step/step-04-units-occupancy-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: in the repo, on that branch: `handback/step-04-units-occupancy/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-03-grid-edges
Read first: BUILD_GUIDE.md §2 laws 3, 4, 10, M3, M4; §4
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182c…`; since CN-004 (step 02) the repo holds `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, add-only: every type quoted here is unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/unit`: units placed from DSK's `ResolvedPlacement`, each with an instance id, side, one logic cell, an optional draw-only offset (M3), facing and `alive`. There is **one occupancy table** keyed by cell. Who may share a cell is the project's **occupancy policy** (core-types r14 `OccupancyPolicy` = `"strict1" | "softStack" | "laneSlots"`, MAY-MOVE; MODES-v2 B3); v1 implements only `strict1` (one living unit per cell) through a small `OccupancyRule` interface, and warns `occupancyUnsupported` for the other two. Units move atomically (`moveTo`: the M4 action layer calls it at the end of a move's duration, never mid-path), are pushed by forced movement (`push`, stopped by walls, closed cells and bodies), and are removed from occupancy by `remove` (called by rules; the core has no kill or damage logic). Two hook callbacks report every move end and every stopped push, so step 07 can emit the DSK events `landedOn` and `pushBlocked`. `reach` lists the cells a unit can end a move on.

Rulings in this step (2026-11-09):
- **No unit may occupy a cell that is not open** (core-types CORE INVARIANT). Placement on a closed cell is **skipped with a notice** (`placeClosed`); `moveTo` a closed cell fails with `closed`; a push stops before it (`wall-block`). This holds under every occupancy policy.
- **Edge walls always stop forced movement** (`edge`; the map border too). Grid step 03 answers this; `push` adds the body check (`unit`).
- **`landedOn` on any move end, never mid-path:** placement (`place`), `moveTo` (`move` or `warp`), and a push that moved ≥ 1 cell (`forced`). A push that moved 0 cells emits no landedOn. A `moveTo` to the unit's own cell is a no-op with no hook call.
- **`pushBlocked {unit, blocker, cellsRemaining}`** when a push stops early, with `blocker` `"wall-block" | "edge" | "unit"` — **only when `terrain.push_into_walls` is on** (core-types r14, "slams into walls"). Off (the default): the push still stops short on the last open cell, with no `pushBlocked`. Order when both happen: `pushBlocked` first (the bump), then `landedOn` (the unit comes to rest).
- Placing on a cell the policy refuses (STRICT1: already occupied) is skipped with `placeOccupied`. Off the map: `placeOffMap`. The skipped placement does not consume an instance number.
- `facing` comes only from the placement (`null` = no facing, never inferred from side); `neutral` is a valid side.

## Files to create or change
- create `src/core/unit/types.ts` — the quoted types (≤ 80 lines)
- create `src/core/unit/units.ts` — `STRICT1`, `createUnits` (≤ 130 lines)
- create `src/core/unit/reach.ts` — `reach` (≤ 30 lines)
- create `src/core/unit/index.ts` — re-exports (≤ 5 lines)
- create `tests/core/units.test.ts` (≤ 160 lines), `tests/core/push.test.ts` (≤ 100 lines), `tests/core/reach.test.ts` (≤ 80 lines)

Size: ≤ 400 changed lines of src + tests in total (prototype: 190 src). If your tests push past 400, trim test helpers first and say so in the Decisions note.

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**, DSK r14): `ResolvedPlacement` (RUNTIME), `SideId` (STABLE), `Sq` (STABLE), `UnitId` (STABLE: the one unit-document-id alias; `UnitState.unitId` uses it, never a local alias; instance ids like `"knight#1"` stay plain strings), `Facing` (MAY-MOVE: only stored and returned here), `OccupancyPolicy` (MAY-MOVE), `CoreTerrainKnobs` (`push_into_walls` STABLE), and `CoreEventMap` (MAY-MOVE; the two hook vocabularies are **derived** from it, never retyped). From step 03: `Grid`, `Dir`, `Notice`.
```ts
// src/core/unit/types.ts
import type { CoreEventMap, CoreTerrainKnobs, Facing, OccupancyPolicy, ResolvedPlacement, SideId, Sq, UnitId } from "../../types/core-types.ts";
import type { Dir } from "../grid/types.ts";
import type { Notice } from "../notice.ts";

/** Sub-cell draw offset in tile fractions (M3). Never changes occupancy. */
export type Offset = { readonly dx: number; readonly dy: number };

export type UnitState = {
  readonly id: string;          // instance id: `${unitId}#${n}`, n = 1, 2, … in placement order
  readonly unitId: UnitId;     // DSK's unit document id (units/<id>.json)
  readonly side: SideId;
  readonly at: Sq;
  readonly offset: Offset | null;
  readonly facing: Facing | null;
  readonly alive: boolean;
};

/** From DSK's CoreEventMap (core-types.ts); never redefined here. */
export type LandCause = CoreEventMap["landedOn"]["cause"];
export type PushBlocker = CoreEventMap["pushBlocked"]["blocker"];

export type UnitHooks = {
  readonly landed?: (unit: string, cell: Sq, cause: LandCause) => void;
  readonly pushBlocked?: (unit: string, blocker: PushBlocker, cellsRemaining: number) => void;
};

export type PlaceResult = { readonly ok: true; readonly id: string } | { readonly ok: false; readonly notice: Notice };
export type MoveFail = "unknownUnit" | "notAlive" | "outOfBounds" | "closed" | "occupied";
export type MoveResult = { readonly ok: true; readonly at: Sq } | { readonly ok: false; readonly reason: MoveFail };
export type PushResult = {
  readonly moved: number;
  readonly at: Sq;
  readonly blocker: PushBlocker | null;
  readonly cellsRemaining: number;
};

/** How an occupancy policy (core-types `OccupancyPolicy`, MODES-v2 B3) decides who may share a cell.
 *  v1 implements strict1 only. Independent of any rule, no unit ever stands on a cell that is not open. */
export interface OccupancyRule {
  readonly id: OccupancyPolicy;
  canHold(unit: UnitState, occupants: readonly UnitState[]): boolean;
}

export type UnitsOptions = {
  readonly hooks?: UnitHooks;
  readonly occupancy?: OccupancyPolicy;                                   // default "strict1"
  readonly terrain?: Pick<CoreTerrainKnobs, "push_into_walls">;          // default { push_into_walls: false }
};

export interface Units {
  readonly occupancy: OccupancyPolicy;
  readonly notices: readonly Notice[];
  place(p: ResolvedPlacement): PlaceResult;
  get(id: string): UnitState | undefined;
  all(): readonly UnitState[];
  occupantAt(at: Sq): string | undefined;
  occupantsAt(at: Sq): readonly string[];
  moveTo(id: string, to: Sq, cause?: "move" | "warp"): MoveResult;
  push(id: string, dir: Dir, cells: number): PushResult;
  setOffset(id: string, offset: Offset | null): boolean;
  setFacing(id: string, facing: Facing | null): boolean;
  remove(id: string): boolean;
}

/** Who a moving unit may pass through. It may never END on an occupied cell. */
export type PassThrough = "none" | "allies" | "all";
```
```ts
// src/core/unit/units.ts
export const STRICT1: OccupancyRule;     // { id: "strict1", canHold: (_unit, occupants) => occupants.length === 0 }
export function createUnits(grid: Grid, opts?: UnitsOptions): Units;

// src/core/unit/reach.ts
export function reach(grid: Grid, units: Units, id: string, maxSteps: number, pass?: PassThrough): readonly Sq[];
```
Behaviour (exact; each line has a test):
1. **Instance ids** are `${unitId}#${n}`, `n` = 1, 2, … counting successful placements in this store. `all()` returns living and removed units in placement order.
2. **place(p):** checks in order: off map → `placeOffMap`; not open → `placeClosed`; policy refuses → `placeOccupied`. Each failure pushes the notice to `notices` and returns `{ ok: false, notice }`; nothing else changes. Success: `offset: null`, `facing: p.facing`, `alive: true`, the id is appended to the cell's occupant list, hook `landed(id, at, "place")`.
3. **The one occupancy table** maps cell index → living ids in arrival order. `occupantsAt(at)` returns a copy; `occupantAt(at)` the first or `undefined`. Off the map: empty / `undefined`. Removed units are never in it.
4. **Policy.** `opts.occupancy` defaults to `"strict1"`; `"softStack"` or `"laneSlots"` push one notice `occupancyUnsupported` at creation and run `strict1`; `units.occupancy` reports the policy actually used. Before any unit enters a cell (place, move, each push step), `STRICT1.canHold(unit, others)` is asked with the other living occupants of that cell; `false` refuses. The open-cell invariant is checked first and does not depend on the policy.
5. **moveTo(id, to, cause = "move"):** failures in order: `unknownUnit`, `notAlive`, `outOfBounds`, (same cell → `{ ok: true, at }` with no hook), `closed`, `occupied` (policy refused). Success updates occupancy atomically (leave the old cell, enter the new one; no residue) and calls `landed(id, to, cause)` once. It does **not** check paths or walls between: the caller validates with `reach` (warp is a teleport by design).
6. **push(id, dir, cells):** `cells` not an integer ≥ 1, or unit unknown or not alive → `{ moved: 0, at: <current or {c:-1,r:-1}>, blocker: null, cellsRemaining: 0 }` and no hooks. Otherwise step one cell at a time: `grid.canForceInto(at, dir)` fails → stop with its blocker; the policy refuses the next cell → stop with `"unit"`; else move one cell. Occupancy changes once, at the end. `cellsRemaining = cells − moved`. Hooks: `pushBlocked` if stopped early **and** `opts.terrain.push_into_walls` is true, then `landed(..., "forced")` if `moved ≥ 1`.
7. **setOffset / setFacing** return false for unknown or removed units; an offset never changes occupancy or `at` (M3).
8. **remove(id)** sets `alive: false`, clears the offset, and takes the id out of occupancy in the same call; returns false if unknown or already removed. No hook (rules emit their own events).
9. **reach(grid, units, id, maxSteps, pass = "allies"):** cells the living unit can **end** a move on: `grid.reachable` from its cell with `isBlocked` = another living occupant that blocks passage (`"none"`: everyone; `"allies"`: units of another side; `"all"`: nobody), then drop cells that hold another living unit. Includes its own cell. Removed or unknown unit → `[]`.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/units.test.ts tests/core/push.test.ts tests/core/reach.test.ts`.
- `tests/core/units.test.ts`
  - "place: ids, facing, side": two placements of `unitId "knight"` get `knight#1`, `knight#2`; facing `null` stays `null`, `"E"` stays `"E"`; side `"neutral"` accepted.
  - "no unit may occupy a closed cell": placing on `wall-block`, `water` or a `blocks: true` object → `{ ok: false }` with `placeClosed`; `occupantsAt` stays empty; the next success is still `#1`.
  - "strict1 refuses a second unit": `placeOccupied`; `units.occupancy === "strict1"`; no notice at creation.
  - "softStack and laneSlots warn and run strict1": each gives exactly one `occupancyUnsupported` notice, `units.occupancy === "strict1"`, and a second unit on a taken cell is refused.
  - "moveTo is atomic and reports landedOn once": occupancy moves with no residue; `landed` called once with cause `move`; `warp` passes `warp`; same cell → ok, no hook; `closed`, `occupied`, `outOfBounds`, `notAlive`, `unknownUnit` each returned in the right case.
  - "offset never changes occupancy (M3)": `setOffset({dx: 0.5, dy: 0})` keeps `occupantAt(at)` and leaves the next cell empty; `setOffset(null)` restores.
  - "remove frees the cell the same call": `occupantAt` is `undefined` right after; `get(id).alive === false`; the cell can be entered again; second `remove` returns false.
- `tests/core/push.test.ts` (map 5×1: floor ×4 then `wall-block`, edge `{c:0, r:0, side:"e"}`; units created with `terrain: { push_into_walls: true }` unless a test says otherwise)
  - "push stops before a wall-block": unit at `(1,0)` pushed `e` 5 → `{ moved: 2, at: (3,0), blocker: "wall-block", cellsRemaining: 3 }`.
  - "edge walls always stop forced movement": pushed back `w` 9 → `{ moved: 2, at: (1,0), blocker: "edge", cellsRemaining: 7 }`; the border stops it too.
  - "a body stops a push": with a unit at `(3,0)`, push from `(1,0)` `e` 3 → `moved 1`, `blocker "unit"`.
  - "hook order and causes": the recorded hook log is exactly `["L a#1 1 place", "B a#1 wall-block 3", "L a#1 3 forced", "B a#1 edge 7", "L a#1 1 forced"]` for the first two pushes; a push blocked at once logs only `B`, never `L`.
  - "push_into_walls off: same stop, no pushBlocked": with the knob false (or absent), the same two pushes end at the same cells and the log has only `L` entries.
  - "bad push input is a no-op": `cells` 0, −1, 1.5 → moved 0, no hooks.
- `tests/core/reach.test.ts`
  - "reach respects walls, closed cells and maxSteps".
  - "allies pass, enemies block, nobody ends on a body": with an ally and a rival on a 5×5 floor, `"allies"` passes the ally but not the rival; neither occupied cell is in the result; `"none"` and `"all"` differ as specified.

## BTF intent (read-only; a rewrite, nothing copied)
`chess/game/stage/target.ts:9` `LiveUnit {id, cell, alive}`, `:144-153` `occupantAt`; `chess/game/stage/tile.ts:39-50` `bodyCell` (walk offset → M3 offset); `chess/game/towerChess.ts:414-415` `moveSquares` ("the landing tile must be empty; a body on the way stops that line"). Not reused: `towerChess.ts:103-121` `Piece` (hp/maxHp/energy), `stage/occupy.ts:7` plant slots.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- `src/core/grid/**`, `src/core/notice.ts`, `src/core/clock/**`, `src/state/**`, `src/rules/**`.
- No event bus here: hooks are plain callbacks (step 07 wires them).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 61. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'new Map<number' src/core` shows exactly one occupancy table (in `units.ts`).
- [ ] `rg -n -i 'kill|damage|hp|phase' src/core` prints nothing.
- [ ] `rg -n '"move" \| "forced"|"wall-block" \| "edge"' src/core/unit` prints nothing (vocabularies derived from core-types `CoreEventMap`).
- [ ] `rg -n 'softStack|laneSlots' src/core` prints nothing (future policies are not built; the names come only from core-types).
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-04-units-occupancy/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Implementing `softStack` (TD creeps) and `laneSlots` (idle lanes); reading `project.settings.occupancy` from the project (the reader, step 08, passes it in; occupancy is **project-wide in v1**, and a stage value is the reader's `occupancyStageValueIgnored` notice, never a per-stage override).
- Lanes and `enteredLane` (core-types r14 event): a later lanes step.
- Stats, HP, death, lethal landing (`kills_on_landing` is rules-side on `landedOn`), push damage.
- Action durations and the event bus (step 07), footprints > 1×1, move costs, jumping.
