# step-03-grid-edges: {c,r} grid, tile types, edge walls and blocking objects

Step id: step-03-grid-edges          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `<base: main's SHA after step-02-clock was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-03-grid-edges-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-03-grid-edges-r<N>.bundle <base>..step/step-03-grid-edges-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: in the repo, on that branch: `handback/step-03-grid-edges/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-00-skeleton (independent of 01–02 in code; ordered after them)
Read first: BUILD_GUIDE.md §2 laws 2, 10, M8; §4 (types: one source)
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3`. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/grid`: a read-only grid built from a `CoreMap` (DSK core-types) and the stage's resolved `CoreTileType[]`. It answers bounds, row-major index ↔ cell, the tile type of a cell, whether a cell is open, edge walls, one-step adjacency, whether **forced movement** may enter the next cell (and if not, why), and a breadth-first reach. Everything that is not fatal becomes a `Notice` (warn, don't block). Any `cols × rows` works (M8); tile pixel size is a runtime setting (default 64) and never appears in core.

Rulings in this step (2026-11-09; also in core-types.ts comments):
- **Edge walls always stop forced movement**, both ways, for everyone. No knob crosses an edge wall. The map border counts as an edge (`blocker: "edge"`).
- **No unit may occupy a cell that is not open** (core-types CORE INVARIANT). A cell is open iff its tile type is `open: true` **and** no map object with `blocks: true` stands on it. Forced movement may enter a cell only if it is open **and** its tile type has `push_can_enter: true`; otherwise `blocker: "wall-block"` (this covers `wall-block`, `water` and any non-enterable tile). `terrain.push_into_walls` is **not** read by the grid: it can never make a closed cell enterable (core-types r14: it only decides whether the stop emits `pushBlocked`, step 04).
- `settings.wrapEdges: true` is ignored in v1 with the notice `wrapEdgesIgnored`; adjacency never wraps.
- Footprints are 1×1 only; a non-1×1 object footprint plays 1×1 with `footprintIgnored`.
- **Paths and lanes (MODES-v2; core-types r14, MAY-MOVE):** `map.paths` (hand-placed TD waypoints) and `map.logic.lanes` exist in the types; the v1 grid **ignores both** (no notice). A future `src/core/path` will read this grid through `inBounds`, `index`, `canStep` and `reachable` for TD auto-pathing with the fixed tie-break order N, E, S, W — the same order as `DIRS`, so keep `DIRS` exactly `n, e, s, w`. Do not build paths or lanes now, and add nothing that assumes one-unit-per-cell or tactics-only movement into the grid.

## Files to create or change
- create `src/core/notice.ts` — `Notice` (≤ 10 lines)
- create `src/core/grid/types.ts` — the quoted types (≤ 40 lines)
- create `src/core/grid/grid.ts` — `createGrid` (≤ 140 lines)
- create `src/core/grid/index.ts` — re-exports (≤ 5 lines)
- create `tests/core/grid.test.ts` (≤ 150 lines), `tests/core/edges.test.ts` (≤ 120 lines)
- create `tests/fixtures/maps/grid-4x3.json` and `tests/fixtures/maps/grid-6x9.json` — small `CoreMap` fixtures (data only)

Size: ≤ 400 changed lines in total excluding the two JSON fixtures (prototype: 125 src).

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**, DSK; import, never redefine): `CoreMap` (STABLE), `CoreMapLogic` (STABLE), `CoreEdge` (STABLE), `CoreMapObject` (`footprint` is MAY-MOVE: read it in one place only), `CoreTileType` (STABLE), `Sq` (STABLE). Coordinates: `c` grows right, `r` grows **down**; `index = r × cols + c`.
```ts
// src/core/notice.ts
import type { Sq } from "../types/core-types.ts";

/** A warning, never an exception (BUILD_GUIDE §2 law 10). `code` is stable; `message` is for people. */
export type Notice = { readonly code: string; readonly message: string; readonly at?: Sq };
```
```ts
// src/core/grid/types.ts
import type { CoreTileType, Sq } from "../../types/core-types.ts";
import type { Notice } from "../notice.ts";

export type Dir = "n" | "e" | "s" | "w";
export const DIRS: readonly Dir[] = ["n", "e", "s", "w"];
export type GridOptions = { readonly wrapEdges?: boolean };

/** Why forced movement can't enter the next cell. 'edge' = an edge wall or the map border. */
export type ForceBlock = "edge" | "wall-block";
export type ForceCheck = { readonly ok: true } | { readonly ok: false; readonly blocker: ForceBlock };

export interface Grid {
  readonly cols: number;
  readonly rows: number;
  readonly notices: readonly Notice[];
  inBounds(at: Sq): boolean;
  index(at: Sq): number;
  sqAt(index: number): Sq;
  tileTypeAt(at: Sq): CoreTileType;
  isOpen(at: Sq): boolean;
  hasWall(at: Sq, dir: Dir): boolean;
  step(at: Sq, dir: Dir): Sq | null;
  canStep(at: Sq, dir: Dir): boolean;
  canForceInto(at: Sq, dir: Dir): ForceCheck;
  neighbours(at: Sq): readonly Sq[];
  reachable(from: Sq, maxSteps: number, isBlocked?: (at: Sq) => boolean): ReadonlyMap<number, number>;
}
```
```ts
// src/core/grid/grid.ts
export function createGrid(map: CoreMap, tileTypes: readonly CoreTileType[], opts?: GridOptions): Grid;
```
Behaviour (exact; each line has a test):
1. **Hard errors only:** `cols` or `rows` not an integer ≥ 1 → `RangeError` (the game cannot run). Version checks are the reader's job (step 08), not the grid's.
2. **Tile types.** `terrain[i]` → `palette[String(terrain[i])]` → the tile type with that id. A missing palette key or unknown id runs as `floor` with notice `unknownTerrain` (with `at`). A terrain array of the wrong length warns `terrainLength`; missing cells run as `floor`. If `tileTypes` has no `floor`, use `{ id: "floor", open: true, push_can_enter: true }` and warn `floorMissing`.
3. **Edges.** Each `CoreEdge` blocks the shared side of two cells both ways: `{c, r, side: "e"}` is the same wall as `{c: c+1, r, side: "w"}`, and `s` of `(c, r)` = `n` of `(c, r+1)`. Accept any form; a duplicate counts once (no notice). An edge whose cell is off the map is skipped with `edgeOffMap`. A border edge (e.g. `n` of row 0) is kept; it changes nothing because the border already blocks.
4. **Objects.** An object off the map is skipped with `objectOffMap`. `blocks: true` closes its cell. Default `blocks` is false.
5. **Queries.** `isOpen(at)` is false off the map. `hasWall(at, dir)` is false off the map. `step(at, dir)` returns the neighbour or `null` off the map. `canStep(at, dir)` = neighbour exists, no wall between, neighbour open. `neighbours(at)` = the `canStep` neighbours in `DIRS` order n, e, s, w.
6. **canForceInto(at, dir):** `{ ok: false, blocker: "edge" }` if the neighbour is off the map or a wall is between; else `{ ok: false, blocker: "wall-block" }` if the neighbour is not open or its type has `push_can_enter: false`; else `{ ok: true }`. It does not look at units (step 04 does).
7. **reachable(from, maxSteps, isBlocked?):** breadth-first over `neighbours`, returns `cell index → steps` including `from` at 0; a cell for which `isBlocked` returns true is not entered (and not expanded). Off-map `from` → empty map. Deterministic: expansion order follows `DIRS`.
8. `notices` is filled once at creation, in the order the cases are met (palette pass, then edges, then objects).

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/grid.test.ts tests/core/edges.test.ts`.
- `tests/core/grid.test.ts`
  - "any size builds (M8)": 1×1, 6×9 and 12×12 maps build; `cols`/`rows` echo the map; `rg -n '\b(6|9|64)\b' src/core/grid` prints nothing.
  - "index and sqAt round-trip row-major": for every cell of 6×9, `sqAt(index(at))` equals `at` and `index({c: 2, r: 4}) === 26`.
  - "bad dimensions throw": `cols: 0`, `rows: 1.5` → `RangeError`.
  - "unknown palette key or id runs as floor with a notice": `isOpen` true, `tileTypeAt(...).id === "floor"`, notice code `unknownTerrain` with `at`.
  - "terrain length mismatch and missing floor warn": codes `terrainLength`, `floorMissing`.
  - "closed tiles and blocking objects are not open": `wall-block` and `water` cells are not open; a `blocks: true` object closes a floor cell; `blocks` absent leaves it open.
  - "wrapEdges is ignored with a notice": `opts.wrapEdges: true` → notice `wrapEdgesIgnored`; `step({c: 0, r: 0}, "w") === null`.
  - "non-1×1 footprint plays 1×1": notice `footprintIgnored`; only the anchor cell is closed.
  - "reachable respects walls, closed cells, maxSteps and isBlocked": on `grid-4x3.json` (quoted below) from `(0,0)`: `maxSteps 9` gives exactly 4 cells; `isBlocked` on `(0,1)` gives 1 cell.
- `tests/core/edges.test.ts`
  - "a wall blocks both ways": `{c: 2, r: 4, side: "n"}` blocks `(2,3)↔(2,4)` in both directions; `canStep` false both ways; `hasWall((2,3), "s")` true.
  - "every stored form is the same wall, counted once": `{2,3,"s"}` + `{2,4,"n"}` together behave like one wall; no notice.
  - "off-map edge is skipped with a notice": `{c: 9, r: 0, side: "n"}` on a 4-wide map → `edgeOffMap`.
  - "edge walls always stop forced movement": `canForceInto` across any wall → `{ ok: false, blocker: "edge" }`; at the border → `"edge"`.
  - "closed or non-enterable tiles stop forced movement as wall-block": into `wall-block`, `water` and a `blocks: true` object → `"wall-block"`; into an open tile with `push_can_enter: false` → `"wall-block"`; into floor → `{ ok: true }`.

Fixture `tests/fixtures/maps/grid-4x3.json` (exact): `cols 4, rows 3`, terrain `[0,0,0,0, 0,1,0,0, 0,0,2,0]`, palette `{"0":"floor","1":"wall-block","2":"water"}`, edges `[{"c":0,"r":0,"side":"e"}]`, `kind "map"`, `formatVersion 5`, `id "grid-4x3"`, `rev 1`. Tile types in tests: `floor {open: true, push_can_enter: true}`, `wall-block {open: false, push_can_enter: false}`, `water {open: false, push_can_enter: false}` (CONFIRMED values, core-types).

## Decisions note: what to name
- Notice codes you emit (exactly these seven: `unknownTerrain`, `terrainLength`, `floorMissing`, `edgeOffMap`, `objectOffMap`, `footprintIgnored`, `wrapEdgesIgnored`, with no notice for a duplicate wall) and their message wording.
- That `tileTypeAt` off the map returns the floor type with no notice (fixed here; callers check `inBounds` first).
- How you store walls (e.g. a 4-bit mask per cell) and objects; the BFS order.
- That the grid ignores `map.paths` and `map.logic.lanes` in v1 (MAY-MOVE fields for later steps).

## Example (grid-4x3.json)
```
     c=0   c=1   c=2   c=3
r=0  .  |  .     .     .        "|" = the edge wall {c:0, r:0, side:"e"}
r=1  .     W     .     .        W = wall-block (closed, not enterable)
r=2  .     .     ~     .        ~ = water (closed, not enterable)
```
`reachable((0,0), 9)` = {(0,0):0, (0,1):1, (0,2):2, (1,2):3} (4 cells): the wall cuts `(0,0)→(1,0)`, `W` and `~` are closed, so the right side is unreachable. `canForceInto((1,0), "w")` = `edge`; `canForceInto((1,0), "s")` = `wall-block`; `canForceInto((0,0), "n")` = `edge` (border).

## BTF intent (read-only; a rewrite, nothing copied)
Edge storage with an opposite canonical side: `chess/game/towerTerrain.ts:58` `EarthEdge`, `:60-69` `EarthSeam`, `:176-178` `seamKey`, `:181-189` `seamsOn`; bounds `chess/game/towerChess.ts:410-412` `inBoard`. Not repeated: `src/engine/square.ts:13` `COLS = 6` and its module-level board state.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- `src/state/**`, `src/core/clock/**`, `src/rules/**`.
- No `src/core/path/**` (future module).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 46. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'type Sq\b|type CoreEdge\b|type CoreTileType\b' src/core` prints nothing (types imported, not redefined).
- [ ] `rg -n -i 'phase|hp|damage|cost' src/core` prints nothing.
- [ ] `rg -n 'push_into_walls' src/core/grid` prints nothing (knob not read by the grid).
- [ ] Every non-fatal case in Behaviour 2–4 yields a notice with the exact code (tests above).
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-03-grid-edges/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Units and occupancy (step 04); move costs by terrain; line of sight and shots (`wall_blocks_los/shots` are rules knobs).
- Map-level `paths[]`, cell flags (`buildable`, `spawn`, `exit`) and `src/core/path` (future, MODES-v2 B2); wrap adjacency.
- Wall looks, visual layers, multi-cell footprints, tile pixel size.
