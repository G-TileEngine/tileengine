# step-09-sim-harness: headless world, M4 action execution, SimSnapshot, replayTicks / advance, replay

Step id: step-09-sim-harness          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `193900d` on `main` (step-08-project-reader r1 build A merged, PR #9); the diff is always `193900d..<head>`
Branch: `step/step-09-sim-harness-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-09-sim-harness-r<N>.bundle 193900d..step/step-09-sim-harness-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-09-sim-harness/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-02-clock, step-03-grid-edges, step-04-units-occupancy, step-05-rng, step-07-events-log, step-08-project-reader (all imported; none changed)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 5, 10, 12, M1, M4; §3 (the `src/sim/` row); §4; §6
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 117/0) on Node 24.22.1 on top of `main` `193900d`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `193900d` is green with it (Architect check, 108/0).
Carries: no Change Notice. `.dependency-cruiser.cjs` already has `nothing-imports-sim` and lets `src/sim` import core, state, project, rules and types (checked by planted imports on the prototype). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/sim`: the headless harness that turns parsed project documents into a running world with no DOM and no host driver. `createWorld` reads the manifest, map and stage (step 08), builds the grid, units, bus and command log, picks the seed and places the match-start units. `submit` logs an M4 action and applies it on the one clock at the end of its `durationMs`. `advance(ms)` and `replayTicks(n)` run the clock headless. `snapshot` gives a plain-JSON `SimSnapshot`. `replay` and `restore` rebuild a world from the command log by deterministic tick replay. This step proves the spine end to end: the same seed and commands give the same world, with or without a frame driver.

Rulings in this step (2026-11-10):
- **Layers:** `src/sim/**` may import `src/core`, `src/state`, `src/project`, `src/rules`, `src/types`; nothing outside `src/sim` imports it (BUILD_GUIDE §3; `npm run deps` rule `nothing-imports-sim`). `.dependency-cruiser.cjs` is not changed.
- **One clock, integer ms:** the world owns exactly one `createClock()`; sim time is that clock's integer ms. `src/sim` never calls `clock.advance` (that is the host-frame path with the `maxFrameMs` clamp); headless time moves only by `clock.step()`. No `Math.random`, `Date`, `performance.now`, `setTimeout`, `setInterval`, `queueMicrotask` or `requestAnimationFrame` in `src/sim`.
- **Randomness:** the seed is `stageSeed(stage) ?? input.hostSeed`, written to the log header. Placements use `createRng(streamSeed(seed, "pool"))`; `world.rng` is the separate `streamSeed(seed, "match")` stream (unused by v1 actions; snapshotted).
- **No game rules:** no HP, mana, cost, damage, deck, card or stats fields or logic. v1 executes only `move` (TILE target) and `wait`; any other kind is logged and gives an `actionUnsupported` notice (rules come later).
- **Hard vs soft (law 10):** a reader failure or a `stage.mapRef` that is not `map.id` throws an `Error` (the match cannot run). Grid, placement and unit notices, a failed move and an unsupported kind are `notices`, never throws.
- **Restore is deterministic tick replay** (the CEO's default option): in-flight actions are pending clock timers, not data, so `restore` rebuilds the world by replaying the log to `snap.tick` and then requires an identical snapshot. The `estimated: true` option and `phases` in the snapshot are out of scope until the phase driver exists.

## Files to create or change
- create `src/sim/types.ts`: the quoted types, verbatim (≤ 50 lines)
- create `src/sim/world.ts`: `createWorld` (≤ 48 lines)
- create `src/sim/actions.ts`: `submit` and a private `apply` (≤ 30 lines)
- create `src/sim/run.ts`: `replayTicks`, `advance`, `snapshot`, `replay`, `restore` (≤ 62 lines)
- create `src/sim/index.ts`: re-exports; the value exports are exactly the seven quoted values (≤ 8 lines)
- create `tests/sim/input.ts`: the shared test input and a `move` action helper (not a `*.test.ts`; ≤ 22 lines)
- create `tests/sim/world.test.ts` (≤ 44 lines), `tests/sim/actions.test.ts` (≤ 38 lines), `tests/sim/replay.test.ts` (≤ 52 lines)

Size: ≤ 360 changed lines in total, counting insertions + deletions; the per-file caps above add up to 354 (prototype: 279). No new fixtures: reuse step 08's `tests/fixtures/project/*.json`. If you pass ~340, say so in Decisions.

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**): `CoreTileType`, `CoreTerrainKnobs`, `UnitId`. From earlier steps (import; never retype): `Clock` (02), `Grid` (03), `Units`, `UnitState` (04), `Rng`, `RngState`, `createRng`, `streamSeed` (05), `EventBus`, `createBus`, `unitEvents`, `logEvents`, `CommandLog`, `Action`, `createLog`, `LOG_FORMAT_VERSION` (07), `readManifest`, `readMap`, `readStage`, `stageSeed`, `resolvePlacements`, `ReadResult` (08), `Notice` (`src/core/notice.ts`).
```ts
// src/sim/types.ts — the whole file
import type { CoreTileType, CoreTerrainKnobs, UnitId } from "../types/core-types.ts";
import type { Clock } from "../core/clock/index.ts";
import type { Grid } from "../core/grid/index.ts";
import type { Units, UnitState } from "../core/unit/index.ts";
import type { EventBus } from "../core/events/index.ts";
import type { CommandLog } from "../core/log/index.ts";
import type { Rng, RngState } from "../core/rng/index.ts";
import type { Notice } from "../core/notice.ts";

/** Parsed JSON documents plus the host's choices. The sim never reads files, wall time or a random source. */
export type SimInput = {
  readonly manifest: unknown;
  readonly map: unknown;
  readonly stage: unknown;
  readonly tiles: readonly CoreTileType[];
  readonly terrain?: Pick<CoreTerrainKnobs, "push_into_walls">;
  readonly chosen: readonly UnitId[];
  readonly hostSeed: number;
  readonly engineVersion: string;
  readonly projectHash: string;
};

export type SimWorld = {
  readonly seed: number;
  readonly clock: Clock;
  readonly grid: Grid;
  readonly units: Units;
  readonly bus: EventBus;
  readonly log: CommandLog;
  readonly rng: Rng;
  readonly notices: Notice[];
};

/** Plain JSON. In-flight actions (pending clock timers) are not in it: restore() replays the log to rebuild them. */
export type SimSnapshot = {
  readonly tick: number;
  readonly clockMs: number;
  readonly rngState: RngState;
  readonly units: readonly UnitState[];
  readonly occupancy: readonly (readonly [number, readonly string[]])[];
  readonly logSeq: number;
};
```
```ts
// src/sim/world.ts, actions.ts, run.ts — exported declarations
export function createWorld(input: SimInput): SimWorld;
export function submit(world: SimWorld, action: Action): void;
export function replayTicks(world: SimWorld, n: number): void;
export function advance(world: SimWorld, ms: number): void;
export function snapshot(world: SimWorld): SimSnapshot;
export function replay(input: SimInput, log: CommandLog, untilTick: number): SimWorld;
export function restore(input: SimInput, log: CommandLog, snap: SimSnapshot): SimWorld;
```
`index.ts` re-exports the types `SimInput`, `SimSnapshot`, `SimWorld` and exactly these values: `createWorld`, `submit`, `replayTicks`, `advance`, `snapshot`, `replay`, `restore`. With `exactOptionalPropertyTypes`, pass `occupancy` / `terrain` to `createUnits` only when present (omit, never `undefined`).

Behaviour (exact; each line has a test):
1. **createWorld** order: `readManifest`, `readMap`, `readStage` (a failure throws `Error("<doc>: <error>")`, or `Error("<doc>: needs migration from <found>")`, with `<doc>` = `manifest` / `map` / `stage`); `stage.mapRef !== map.id` throws an `Error` whose message contains `mapRef <stage.mapRef>`; `seed = stageSeed(stage) ?? input.hostSeed`; one `createClock()` (defaults); `createBus(clock)`; `createGrid(map, input.tiles, { wrapEdges: settings.wrapEdges })`; `createUnits(grid, { hooks: unitEvents(bus), occupancy?: settings.occupancy, terrain?: input.terrain })`; `createLog({ seed, formatVersion: LOG_FORMAT_VERSION, engineVersion, projectHash }, logEvents(bus))`; `resolvePlacements(stage, map, input.chosen, (w) => pool.weighted(w))` on `pool = createRng(streamSeed(seed, "pool"))`; `units.place` for each placement in order; `rng = createRng(streamSeed(seed, "match"))`. `world.notices` = grid notices, then placement notices, then unit notices, in that order. Nothing runs on the clock: tick 0.
2. **submit:** `log.append(clock.tick(), action)` first (so `actionLogged` fires at the submit tick), then: `durationMs === null` (turn-measured) → apply now; otherwise `clock.after(durationMs, apply)` (step 02: fires after `max(durationMs, stepMs)`, so `0` lands on the next tick and `200` on tick +20).
3. **apply:** `wait` → nothing (the target is ignored; `ActionTarget` is `Aim | null`). `move` with a `tile` target → `units.moveTo(actor, target.at, "move")`; `ok: false` → notice `moveFailed` (`at` = the target cell). Any other kind, or a `move` whose target is not a `tile` (including `null` or a unit aim), → notice `actionUnsupported`. Occupancy therefore changes only when the action lands (M4).
4. **replayTicks(n):** `n` must be an integer ≥ 0, else `RangeError`; calls `clock.step()` `n` times.
5. **advance(ms):** `ms` must be an integer ≥ 0 and a multiple of `clock.stepMs`, else `RangeError` (no remainder is carried, so 0 ms of sim time is ever lost); then `replayTicks(ms / stepMs)`. Never clamped: `advance(w, 1000)` runs 100 steps.
6. **snapshot:** `tick`, `clockMs = clock.now()`, `rngState = world.rng.state()`, `units` = `units.all()` (dead ones too) copied field by field (fresh `at` / `offset` objects), `occupancy` = `[index, occupantsAt(cell)]` for every non-empty cell in index order, `logSeq = log.lastSeq()`. `JSON.parse(JSON.stringify(snap))` deep-equals `snap`. Build the object with keys in the quoted order (`tick`, `clockMs`, `rngState`, `units`, `occupancy`, `logSeq`) so `JSON.stringify` (used by `restore`, and by the restore test's `JSON.parse(JSON.stringify(snapshot(…)))`) is stable.
7. **replay(input, log, untilTick):** `createWorld({ ...input, hostSeed: log.header.seed })`; a world seed ≠ the header seed throws. For each entry with `tick ≤ untilTick`: `replayTicks` up to its tick, then `submit(world, entry.action)`; finally `replayTicks` up to `untilTick`.
8. **restore(input, log, snap):** `replay(input, log, snap.tick)`, then the new world's snapshot must equal `snap` (compare `JSON.stringify`), else throw `Error("restore: snapshot does not match the log")`.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/sim/*.test.ts`. Tests load fixtures with `readFileSync` + `JSON.parse` (in `tests/sim/input.ts` only).
- `tests/sim/input.ts`: `input(stage: "stage-fixed" | "stage-weighted", hostSeed = 7): SimInput` (map `map-6x9` for stage-fixed, `map-12x12` for stage-weighted; chosen `["knight", "archer"]`; `engineVersion "0.0.0"`, `projectHash "test"`), a minimal inline manifest (`tile-project` v6, `settings: { wrapEdges: false }`) and tiles `floor` (open) and `wall-block` (closed); `move(id, actor, c, r, durationMs = 200): Action` (`kind "move"`, a `tile` target, `turns: null`, `effects: []`).
- `tests/sim/world.test.ts`
  - "a world loads the step-08 fixtures and places every unit at tick 0": stage-fixed → `seed` and `log.header.seed` `0x5eed`; units `[id, side, c, r]` exactly `knight#1 player 0 8`, `archer#2 player 1 8`, `wolf#3 wolves 2 0`, `wolf#4 wolves 3 0`, `crate#5 neutral 3 4`, `merchant#6 player 4 4`; history is six `landedOn` at tick 0; notices `[]`.
  - "the host seed is used when the stage has none; picks use the pool stream": stage-weighted, host seed 7 → `seed` 7; unit ids in order equal `resolvePlacements` run by hand on `createRng(streamSeed(7, "pool"))`; notice codes exactly `["footprintIgnored", …that run's codes]` (grid first).
  - "a bad document is a hard error": `mapRef: 3` → throws `/stage: bad field mapRef/`; map `formatVersion 4` → `/map: needs migration from 4/`; stage-fixed with the 12×12 map → `/mapRef map-6x9/`.
- `tests/sim/actions.test.ts`
  - "a move changes occupancy only at the end of its durationMs (M4)": `knight#1` to `(0,7)`, 200 ms; after `advance(190)` `(0,8)` still holds it; after `advance(10)` `(0,7)` does; the history after the six placements is `[[0, "actionLogged"], [20, "landedOn"]]`.
  - "wait does nothing; a failed move and an unknown kind are notices, still logged": a `wait` with `target: null` and `durationMs: null`, then a move onto `archer#2`'s cell and `kind: "ability"`, all `durationMs: null` → notice codes exactly `["moveFailed", "actionUnsupported"]`; `log.lastSeq()` 3; the knight is still at `(0,8)`.
  - "advance takes integer ms in whole steps and is not clamped like a host frame": `5`, `-10`, `1.5`, `NaN` → `RangeError`; `advance(1000)` → `now()` 1000, `tick()` 100.
- `tests/sim/replay.test.ts`: a script `live(world, drive = advance)`: submit `a1` (knight → (0,7), 200 ms), drive 150; `a2` (archer → (1,6), 300 ms), drive 250; `a3` (knight → (0,6), 0 ms), drive 400. A frame driver `frames(world, ms)` calls `world.clock.advance(Math.min(16, end - now()))` until `now()` reaches `end`.
  - "replaying a log reproduces the event history at non-zero ticks" (the step-07 replay port): after `live` on stage-fixed, the distinct history ticks in order are exactly `[0, 15, 20, 40, 41, 45]`; `parseLog(log.toJSON())` → `replay(input, parsed.log, tick())` gives a deep-equal `bus.history()` and an identical `log.toJSON()`.
  - "same seed and commands give the same snapshot, with or without a frame driver": stage-weighted, `live` with `advance` vs `live` with `frames` → equal `snapshot` and equal `bus.history()`.
  - "snapshot → restore → replayTicks(n) equals n ticks straight": stage-fixed; `snap` = `JSON.parse(JSON.stringify(snapshot(straight)))`; `restore` gives a world whose snapshot equals `snap`; then `replayTicks(37)` on both → equal snapshots; `restore` with `logSeq: 99` throws `/does not match/`.

## Example
```ts
const input: SimInput = { manifest, map, stage, tiles, chosen: ["knight", "archer"], hostSeed, engineVersion: ENGINE_VERSION, projectHash };
const world = createWorld(input);            // parsed JSON from the host; hostSeed is used only if the stage has no seed
submit(world, { id: "a1", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: 200, turns: null, effects: [] });
advance(world, 200);                         // 20 steps; the knight lands on tick 20
const snap = snapshot(world);                // plain JSON: save it with log.toJSON()
const parsed = parseLog(world.log.toJSON());  // step 07
if (parsed.ok) restore(input, parsed.log, snap);  // replays the log to snap.tick, then checks it equals snap
```

## How later steps use this (context only; do not build)
- Phase and tick drivers over the tactics tables (`xGo`), the AI hook `proposeActions(world, side, budget)` with no `phase` parameter (M6), input intents incl. `BoxSelect` (M7), the turn fuse (`FUSE_EXPIRE` at the preset's ms), a test-only victory rule with 50-seed matches, a `sim` script, and `phases` in `SimSnapshot`: the next harness step, on top of `submit` / `advance`.
- Attacks through the pipes and the effect order (step 10 and rules) replace `actionUnsupported` for their kinds.
- The host driver (`src/runtime/host/raf-driver.ts`) calls `clock.advance(frameMs)`; the harness never does.

## Decisions note: what to name
- How you copy `UnitState` in `snapshot` (fields, `offset` null vs object).
- The exact notice messages for `moveFailed` and `actionUnsupported`.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). Intent only: `scripts/sim-50.mjs:1-30` (batch-sim report), `chess/game/towerTourney.ts:62-63` fixed `DT` / `MAX_TICKS`. Not repeated: `scripts/node-game.mjs:4-18` browser shims, `towerTourney.ts:515` global `Math.random` patch.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `tsconfig.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change (the `sim` script comes with the drivers).
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**` (read the step-08 fixtures; add none).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's files: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/index.ts`, and every existing test.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 116. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; both exit 0.
- [ ] `sha256sum .dependency-cruiser.cjs` prints `9037bacef0aa7ff33abff96d308fe137ef1c7d4baa6795af070c3b68d7bd3e81` (unchanged), and `npm run deps` reports no violations.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\.now\b|\bnew Date\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/sim` prints nothing (one clock, seeded only).
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim` prints exactly two lines, both in `src/sim/world.ts`: the import and the one `createClock()` call (one clock; no host-frame path).
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/sim` prints nothing (no game rules).
- [ ] `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile" src/sim` prints nothing (the host passes parsed JSON).
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/sim/" src --glob '!src/sim/**'` prints nothing (nothing imports sim).
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/index.ts .dependency-cruiser.cjs package.json tests/fixtures` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 360 changed lines (insertions + deletions); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the nine files in "Files to create or change", all `A` (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-09-sim-harness/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Phase / tick drivers, the AI hook, input intents, the turn fuse, victory and 50-seed matches, the `sim` script, `phases` in the snapshot (next harness step).
- Attacks, effects, abilities and any game rule; the `estimated: true` offline estimate; offline catch-up caps (host + project setting).
- Saves and persistence (the host stores `log.toJSON()` and the snapshot), rendering, networking.
