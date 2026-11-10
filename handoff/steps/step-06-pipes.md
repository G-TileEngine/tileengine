# step-06-pipes: UNIT and TILE: the only targeting pipes

Step id: step-06-pipes          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `<base: main's SHA after step-05-rng was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-06-pipes-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-06-pipes-r<N>.bundle <base>..step/step-06-pipes-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: in the repo, on that branch: `handback/step-06-pipes/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-04-units-occupancy (also step-03 for `Grid`)
Read first: BUILD_GUIDE.md §2 law 3, M9
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182c…`; since CN-004 (step 02) the repo holds `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, add-only: every type quoted here is unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/targeting`: the two targeting pipes and the live roster. **UNIT** follows a living body: on arrival it hits the target wherever it now stands, and a dead target is never hit at its old cell. **TILE** fixes a cell at cast: on arrival a living occupant of that cell is hit and an empty cell misses; it never retargets. Everything that can hit goes through one of these two, including real-valued effect points, which are rounded to a cell (`toCell`). Edge targets (wall placement and similar) are TILE plus an edge side. An action with no target has **no pipe**: its resolve context carries the caster only. There is no third pipe, no "blink" flag and no extra target mode.

Rulings in this step (2026-11-09):
- **Still only UNIT and TILE.** `Aim["pipe"]` is exactly `"unit" | "tile"`; a test proves no third pipe exists (type-level and in the export list).
- **No target = no pipe:** `resolveContext(caster, null, …)` returns `{ caster, aim: null, resolution: null }` and reads nothing else. (The state table's `CHOOSE_ACTION` with `next: "resolving"` from step 01 is the matching edge.)
- **Edge targets = TILE + edge side** `"N" | "E" | "S" | "W"` (N = toward r−1, E = c+1, S = r+1, W = c−1, the same sides as `CoreEdge`'s `n/e/s/w`). The hit test on arrival is the cell's, exactly like TILE; the edge is carried for the behaviour that uses it.
- **Gale-style fallback is still UNIT:** `fallbackAt` is used only if the target id is dead; then the living occupant of that cell is hit, else a miss.

## Files to create or change
- create `src/core/targeting/types.ts` — the quoted types (≤ 30 lines)
- create `src/core/targeting/pipes.ts` — the six functions (≤ 70 lines)
- create `src/core/targeting/index.ts` — re-exports; the value exports are exactly the six functions (≤ 5 lines)
- create `tests/core/pipes.test.ts` (≤ 200 lines)

Size: ≤ 300 changed lines in total (prototype: 60 src).

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**, DSK): `Sq`, `SideId` (STABLE). From step 03: `Grid`. From step 04: `Units`. Note: `UnitAim.unitId` and `Resolution.unitId` hold a unit **instance** id (`UnitState.id`, e.g. `"knight#1"`), not DSK's `UnitId` (a unit document id); keep them `string`.
```ts
// src/core/targeting/types.ts
import type { Sq } from "../../types/core-types.ts";

/** UNIT pipe: follows a living body. `fallbackAt` (Gale-style) is still UNIT: used only when the id is dead. */
export type UnitAim = { readonly pipe: "unit"; readonly unitId: string; readonly fallbackAt?: Sq };
/** Edge of a cell for edge targets (ruling 2026-11-09): N = r-1, E = c+1, S = r+1, W = c-1 (CoreEdge's n/e/s/w). */
export type EdgeSide = "N" | "E" | "S" | "W";
/** TILE pipe: a cell fixed at cast, optionally one of its edges. Never retargets. */
export type TileAim = { readonly pipe: "tile"; readonly at: Sq; readonly edge?: EdgeSide };
export type Aim = UnitAim | TileAim;

export type Resolution =
  | { readonly hit: true; readonly unitId: string; readonly at: Sq }
  | { readonly hit: false; readonly reason: "dead" | "empty" | "offMap" };

export type RosterEntry = { readonly id: string; readonly at: Sq };

/** What a resolve step gets. No target = no pipe: `aim` and `resolution` are null and only the caster is passed. */
export type ResolveContext = { readonly caster: string; readonly aim: Aim | null; readonly resolution: Resolution | null };
```
```ts
// src/core/targeting/pipes.ts
export function aimUnit(unitId: string, fallbackAt?: Sq): UnitAim;
export function aimTile(at: Sq, edge?: EdgeSide): TileAim;
export function resolveAim(aim: Aim, units: Units, grid: Grid): Resolution;
export function resolveContext(caster: string, aim: Aim | null, units: Units, grid: Grid): ResolveContext;
export function roster(units: Units, side?: SideId): readonly RosterEntry[];
export function toCell(point: { readonly c: number; readonly r: number }): Sq;
```
`src/core/targeting/index.ts` re-exports the types with `export type *` and exactly these six values. With `exactOptionalPropertyTypes`, an absent `fallbackAt` / `edge` is omitted from the object, never set to `undefined`.

Behaviour (exact; each line has a test):
1. **resolveAim TILE:** cell off the map → `{ hit: false, reason: "offMap" }`; cell has a living occupant → `{ hit: true, unitId: <occupantAt>, at }`; else `{ hit: false, reason: "empty" }`. A unit that has left the cell is not followed. The `edge` does not change the hit test.
2. **resolveAim UNIT:** target alive → `{ hit: true, unitId, at: <its current cell> }`; target dead or unknown and no `fallbackAt` → `{ hit: false, reason: "dead" }`; dead with `fallbackAt` → off map: `offMap`; living occupant there: hit it; empty: `{ hit: false, reason: "dead" }`.
3. Pipes read logic cells only (`units.get(...).at`, `occupantAt`), never offsets or drawn positions (M3).
4. **resolveContext:** `aim === null` → `{ caster, aim: null, resolution: null }` without touching `units` or `grid`; else `{ caster, aim, resolution: resolveAim(aim, units, grid) }`.
5. **roster(units, side?):** living units only, in placement order, as `{ id, at }`; a unit removed this tick is already absent; optional side filter.
6. **toCell:** half-up per axis: `{ c: Math.floor(c + 0.5), r: Math.floor(r + 0.5) }`; `{2.5, -0.5}` → `{3, 0}`; `{1.49, 3.5}` → `{1, 4}`.
7. All functions are pure apart from reading `units` / `grid`; nothing is cached between calls.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/pipes.test.ts`. Use a 5×5 floor grid from step 03 and units from step 04.
- "no third pipe exists": a compile-time check `type Eq<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false; const exact: Eq<Aim["pipe"], "unit" | "tile"> = true;` and `Object.keys(await import("../../src/core/targeting/index.ts")).sort()` equals `["aimTile", "aimUnit", "resolveAim", "resolveContext", "roster", "toCell"]`.
- "UNIT follows the body": aim at a unit, `moveTo` it elsewhere, resolve → hit at the new cell.
- "UNIT never hits a dead target's old cell": `remove` the target, put another unit on its old cell, resolve without `fallbackAt` → `{ hit: false, reason: "dead" }`.
- "TILE hits whoever stands there on arrival": occupant at cast moves away and another unit arrives → the arriving unit is hit; empty on arrival → `empty`; off map → `offMap`.
- "TILE never retargets": the original occupant moving one cell is not hit.
- "edge target is TILE + side": `aimTile({c: 2, r: 2}, "N")` is `{ pipe: "tile", at: {c: 2, r: 2}, edge: "N" }`; it resolves exactly like `aimTile({c: 2, r: 2})`; `aimTile(at)` has no `edge` key.
- "Gale fallback is UNIT": living id wins over `fallbackAt`; dead id + someone on the stored cell → that unit; dead id + empty cell → `dead`.
- "no target: the context gets the caster only": `resolveContext("knight#1", null, units, grid)` deep-equals `{ caster: "knight#1", aim: null, resolution: null }`; passing throwing proxies for `units` and `grid` still works (they are not read).
- "roster lists the living only, same tick": after `remove`, the id is absent; side filter works for `"player"`, `"rival"`, `"neutral"`.
- "toCell rounds half-up per axis": the three examples above plus `{-1.5, 0.5}` → `{-1, 1}`.

## Truth table (what `resolveAim` returns on arrival)
| aim | target / cell state on arrival | result |
|---|---|---|
| UNIT `u` | `u` alive, anywhere | hit `u` at its current cell |
| UNIT `u` | `u` dead or unknown, no `fallbackAt` | miss `dead` |
| UNIT `u` + `fallbackAt p` | `u` alive | hit `u` (fallback ignored) |
| UNIT `u` + `fallbackAt p` | `u` dead, `p` holds living `v` | hit `v` at `p` |
| UNIT `u` + `fallbackAt p` | `u` dead, `p` empty | miss `dead` |
| UNIT `u` + `fallbackAt p` | `u` dead, `p` off map | miss `offMap` |
| TILE `p` (± edge) | `p` holds living `v` | hit `v` at `p` |
| TILE `p` (± edge) | `p` empty (even if the cast-time occupant is alive elsewhere) | miss `empty` |
| TILE `p` (± edge) | `p` off map | miss `offMap` |
| no target (`null`) | — | no resolution; context = caster only |

Under a future multi-occupant policy (`softStack`), TILE hits `occupantAt(p)`, the first arrival; multi-hit is a behaviour choice, not a pipe.

## Example
```ts
const ctx = resolveContext("archer#1", aimTile({ c: 3, r: 1 }, "E"), units, grid);
// → { caster: "archer#1", aim: { pipe: "tile", at: { c: 3, r: 1 }, edge: "E" }, resolution: { hit: false, reason: "empty" } }
const heal = resolveContext("cleric#1", null, units, grid);
// → { caster: "cleric#1", aim: null, resolution: null }   (no target: no pipe)
```

## How later steps use this (context only; do not build)
- Step 07: an M4 action stores `target: Aim | null`; the log round-trips both pipes, the edge side and `null`.
- Step 09: the harness resolves each logged action with `resolveContext` after its `durationMs` on the one clock.
- Behaviours (later, outside core): shapes expand one aim into many cells, then each cell is resolved as TILE.
- Menu or cards (M9): the same ability through either presentation produces the same aim; only `via` differs.
- Tower defence (future): a tower shot is a UNIT aim at the nearest creep; idle auto-cast uses the same two pipes.

## Decisions note: what to name
- How the export-list test imports the module (dynamic `import()` or a namespace import).
- That `resolveAim` returns `dead` (not `empty`) for a dead UNIT whose fallback cell is empty, as the table says.
- Any helper you added and kept private.

## BTF intent (read-only; a rewrite from `docs/COMBAT_TARGET.md`)
Live lists: `chess/game/stage/target.ts:92` `refreshLive`; `:139-142` `unitCell`; `:144-153` `occupantAt`. Not adapted: `target.ts:1-6` imports heroes, chapter and the wolf pack. COMBAT_TARGET rules kept: UNIT L10–12, TILE L17–20, Gale L49, roster L31.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- **Ability composition is out of the core spine:** `ability = primary + modifiers[]` (shapes such as cone, bar or line; chaining; modifiers) is the behaviours layer. Do not add shape, modifier, legality or ability types, files or fields here or anywhere under `src/core`.
- `src/core/unit/**`, `src/core/grid/**`, `src/core/rng/**`, `src/core/clock/**`, `src/state/**` (step 01's `TargetRef` stays as it is; it is structurally a subset of `Aim`).
- No presentation words: `hand`, `deck`, `card`, `menu` never appear in core (M9).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 81. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'pipe: "' src/core | rg -v '"unit"|"tile"'` prints nothing (no third pipe value anywhere).
- [ ] `rg -n -i 'modifier|primary|shape|cone|blink' src/core` prints nothing.
- [ ] `rg -n 'offset' src/core/targeting` prints nothing (pipes never read draw positions).
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-06-pipes/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Shapes, area patterns, legality filters, range checks: behaviours / rules layers.
- Line of sight and shots, status effects, HUD face hits.
- Logging an aim (step 07 stores `Aim | null` inside the M4 action).
