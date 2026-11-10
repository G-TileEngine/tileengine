# step-09b-match-drivers: phase and tick drivers, AI hook (M6), turn fuse, pluggable victory, phases in the snapshot

Step id: step-09b-match-drivers          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `92e4e96` on `main` (step-09-sim-harness r1 build A merged, PR #10); the diff is always `92e4e96..<head>`
Branch: `step/step-09b-match-drivers-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-09b-match-drivers-r<N>.bundle 92e4e96..step/step-09b-match-drivers-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-09b-match-drivers/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-01-state-tables (`xGo`, `Phase`, `Event`, `Outcome`), step-02-clock (`startFuse`, `FuseSetting`), step-09-sim-harness (`src/sim`, extended here)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 5, 10, 12, M1, M2, M4, M6; §3 (the `src/sim/` row); §5 (state rule); `docs/STATES.md` §3.2, §3.3 and rules 5–8
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 123/0) on Node 24.22.1 on top of `main` `92e4e96`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `92e4e96` is green with it (Architect check, 117/0).
Carries: no Change Notice. `.dependency-cruiser.cjs` already lets `src/sim` import state and rules and forbids anything importing sim (checked by planted imports on the prototype). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Make the step-09 world play a whole match headless. `runMatch` is the **phase driver**: it walks the tactics tables with `xGo` (rounds, sides, one unit at a time), asks the **AI hook** `proposeActions(world, side, budget)` for each side's actions (M6: no phase parameter), turns each move into the same `Event`s a player would cause, runs the move on the one clock until it lands (M4), runs the **turn fuse** on that clock, and asks a **pluggable victory rule** after every side. `runTicks` is the **tick driver**: the same hook is asked every `everyMs` of sim time for its idle units, with no turns (M1). The battle phase is kept in `world.phases` and is now part of `SimSnapshot`. Fifty seeds on each fixture map end in `win` / `lose` / `draw`, and each log replays to the same history.

Rulings in this step (2026-11-10):
- **No game rules in sim (law 4):** the end of a match is decided only by the caller's `VictoryRule`; the sim has no HP, knock-out, damage or stats logic. `Outcome` is read from `sides[0]`'s point of view. The test rule (reach the far row) lives in `tests/sim/ai.ts`, never in `src/`.
- **User options, not hardcoded rules (CEO):** side order (`sides`), the fuse (`"off"` or any integer ms > 0), round and time limits, and the tick interval are inputs with **no defaults** in `src/sim` (law 12). The BTF preset's turn timer is **60000 ms** and user-adjustable: that value is preset data, so it appears in tests only. No side name (`player`, `rival`, …) is written in `src/sim`.
- **One clock, integer ms:** the fuse is `startFuse` (step 02) on `world.clock`; drivers move time only through `replayTicks` / `advance` (step 09), never `clock.advance`, never a second clock. `maxSimMs`, `everyMs` and fuse lengths are integers.
- **State rule (§5):** the phase moves only by `xGo`; the driver replaces `world.phases` whole (`world.phases = { ...world.phases, battle: next }`), never writes a key. `SimWorld.phases` is the one non-readonly field.
- **AI = player events (STATES rule 8):** every side, AI-driven or not, gets the same `Event` sequence; there is no AI-only event. The hook returns step-07 `Action`s; the drivers submit them with step 09's `submit`, so the command log stays the single source for replay.
- **Phases are driver state, not log data:** `restore` replays the log (step 09) and takes `phases` from the snapshot; everything else is still checked against the replay.
- **Layers:** unchanged. `src/sim` may import core, state, project, rules, types; nothing imports sim.

## Files to create or change
- change `src/sim/types.ts`: becomes exactly the quoted file (≤ 42 changed lines)
- change `src/sim/world.ts`: `phases: { battle: "play.loading" }` in the returned world (≤ 6 changed lines)
- change `src/sim/run.ts`: `phases` in `snapshot`, `restore` takes them, the clearer seed-mismatch message (≤ 8 changed lines)
- change `src/sim/index.ts`: the new type and value exports (≤ 8 changed lines)
- create `src/sim/driver-phase.ts`: `runMatch` (≤ 72 lines)
- create `src/sim/driver-tick.ts`: `runTicks` (≤ 34 lines)
- create `tests/sim/ai.ts`: test-only AI `forward(seed)`, victory rule `reachFarRow`, `seedless(input)` (not a `*.test.ts`; ≤ 32 lines)
- create `tests/sim/match.test.ts` (≤ 92 lines)
- change `tests/sim/world.test.ts`: the host-seed test uses the real `map.doc` (≤ 11 changed lines)
- change `tests/sim/replay.test.ts`: one seed-mismatch assertion (≤ 5 changed lines)

Size: ≤ 320 changed lines in total, counting insertions + deletions; the per-file caps above add up to 310 (prototype: 258). No new fixtures. If you pass ~300, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 01 (`src/state`): `Phase`, `Event`, `Outcome`, `xGo`. From step 02 (`src/rules/turns/fuse.ts`): `FuseSetting`, `startFuse`. From core-types: `SideId`. From step 07: `Action`. Import these; never retype them.
```ts
// src/sim/types.ts — the whole file
import type { CoreTileType, CoreTerrainKnobs, SideId, UnitId } from "../types/core-types.ts";
import type { Clock } from "../core/clock/index.ts";
import type { Grid } from "../core/grid/index.ts";
import type { Units, UnitState } from "../core/unit/index.ts";
import type { EventBus } from "../core/events/index.ts";
import type { Action, CommandLog } from "../core/log/index.ts";
import type { Rng, RngState } from "../core/rng/index.ts";
import type { Notice } from "../core/notice.ts";
import type { Event, Outcome, Phase } from "../state/index.ts";
import type { FuseSetting } from "../rules/turns/fuse.ts";

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
  /** Driver state, replaced whole (never written per key): `{ battle }` from step 09b. Not in the log. */
  phases: Readonly<Record<string, Phase>>;
};

/** Plain JSON. In-flight actions (pending clock timers) are not in it: restore() replays the log to rebuild them. */
export type SimSnapshot = {
  readonly tick: number;
  readonly clockMs: number;
  readonly rngState: RngState;
  readonly units: readonly UnitState[];
  readonly occupancy: readonly (readonly [number, readonly string[]])[];
  readonly phases: Readonly<Record<string, Phase>>;
  readonly logSeq: number;
};

/** M6: the AI is a hook with no phase parameter; it returns the same actions a player would submit. */
export type Budget = { readonly kind: "side" | "unit"; readonly units: readonly string[] };
export type AiHook = (world: SimWorld, side: SideId, budget: Budget) => readonly Action[];
/** Pluggable end rule (the sim holds no game rules): `Outcome` is from `sides[0]`'s view; null = play on. */
export type VictoryRule = (world: SimWorld, at: { readonly round: number; readonly side: SideId }) => Outcome | null;

export type MatchOptions = {
  readonly sides: readonly SideId[];
  readonly ai: AiHook;
  readonly victory: VictoryRule;
  readonly fuse: FuseSetting;
  readonly maxRounds: number;
  readonly maxSimMs: number;
};
/** Tick driver: the AI is asked every `everyMs` (a whole number of steps; e.g. 100) for its idle units. */
export type TickOptions = {
  readonly sides: readonly SideId[];
  readonly ai: AiHook;
  readonly victory: VictoryRule;
  readonly everyMs: number;
  readonly maxSimMs: number;
};
export type MatchResult = {
  readonly outcome: Outcome | "timeout";
  readonly rounds: number;
  readonly events: readonly Event[];
};
```
```ts
// src/sim/driver-phase.ts, src/sim/driver-tick.ts — exported declarations
export function runMatch(world: SimWorld, opts: MatchOptions): MatchResult;
export function runTicks(world: SimWorld, opts: TickOptions): MatchResult;
```
`index.ts` re-exports the types `AiHook`, `Budget`, `MatchOptions`, `MatchResult`, `SimInput`, `SimSnapshot`, `SimWorld`, `TickOptions`, `VictoryRule` and exactly these values: `createWorld`, `submit`, `replayTicks`, `advance`, `snapshot`, `replay`, `restore`, `runMatch`, `runTicks`.

Behaviour (exact; each line has a test):
1. **world / snapshot / restore:** `createWorld` returns `phases: { battle: "play.loading" }`. `snapshot` adds `phases: { ...world.phases }` between `occupancy` and `logSeq`, so the keys are exactly `tick, clockMs, rngState, units, occupancy, phases, logSeq`. `restore` runs `replay(input, log, snap.tick)`, sets `world.phases = { ...snap.phases }`, then compares `JSON.stringify` as before. `replay`'s seed mismatch throws `Error("replay: world seed <world.seed> is not the log seed <header.seed>")`.
2. **runMatch limits:** `maxRounds` must be an integer ≥ 1 and `maxSimMs` an integer ≥ 0, else `RangeError`. `go(e)` appends `e` to `events` and sets `world.phases = { ...world.phases, battle: xGo(battle, e) }` (a rejected event stays in `events` and leaves the phase).
3. **runMatch sequence:** `BATTLE_READY`, `DEPLOY_DONE`; then, while there is no outcome, `rounds < maxRounds` and `clock.now() < maxSimMs`: `rounds += 1`, `ROUND_BEGIN`, and for each `side` of `sides` in order a **turn**, then `victory(world, { round, side })`. An outcome → `CHECK_END { outcome }` and stop. Otherwise `CHECK_NONE` with `next: "sideStart"` if another side follows this round, else `"roundEnd"`, and stop the round early if `now() ≥ maxSimMs`. After the sides, `ROUND_END` only when the phase is `roundEnd`. Result: `{ outcome: outcome ?? "timeout", rounds, events }`.
4. **turn:** `SIDE_BEGIN`; clear `expired`; `fuse = startFuse(clock, opts.fuse, () => { expired = true })`. Loop while `!expired` and `now() < maxSimMs`: `units` = ids of `units.all()` that are alive and on `side`, in that order; `actions = ai(world, side, { kind: "side", units })`. An empty array means the side is stalled: `replayTicks(world, 1)` and ask again. Otherwise run each action in order while `!expired` and `now() < maxSimMs`, then leave the loop. Then `fuse?.cancel()`, `FUSE_EXPIRE` if `expired` else `END_TURN`, then `SIDE_END`.
5. **an action in a turn:** a `move` with a `tile` target → `SELECT_UNIT { unitId: actor }`, `TAP_MOVE_CELL { at }` (a fresh `{ c, r }`), `submit`, then `replayTicks(ceil(ms / stepMs))` with `ms = durationMs === null ? 0 : max(durationMs, stepMs)` (so the move has landed), `MOVE_DONE`; then, unless the fuse fired, `WAIT` and `UNIT_DONE { next: "idle" }`. Any other action is only `submit`ted (logged; step 09 decides its effect), with no tactics event.
6. **runTicks:** `everyMs` must be a positive integer multiple of `stepMs` and `maxSimMs` an integer ≥ 0, else `RangeError`. While there is no outcome and `now() < maxSimMs`: `rounds += 1`; for each side in order: `units` = alive units of the side whose last order has landed (`busyUntil ≤ now`; `busyUntil` = submit time + `max(durationMs, stepMs)`, or + 0 for `null`), `ai(world, side, { kind: "unit", units })`, `submit` each action, then `victory(world, { round, side })`; an outcome stops. With no outcome, `advance(world, everyMs)`. Result `events` is `[{ type: "CHECK_END", outcome }]`, or `[]` on timeout. The tick driver never touches `world.phases` (tick modes get their own tables later).
7. Both drivers change the world only through `submit`, so `replay(input, parsedLog, tick())` reproduces `bus.history()` exactly.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/sim/*.test.ts`. Common options in `match.test.ts`: `base = { sides: ["player", "wolves"], ai: () => [], victory: () => null, fuse: 60000, maxRounds: 40, maxSimMs: 600000 }`.
- `tests/sim/ai.ts` (test-only; `src/` must not contain this logic):
  - `forward(seed, durationMs = 200): AiHook`, on its own stream `createRng(streamSeed(seed, "ai"))`: for each budget unit, step one cell toward the far row (`player` up, every other side down); per unit draw `side1` (`next() < 0.5 ? -1 : 1`), then with `next() < 1/3` try the sideways cells first. The cells, in order, are ahead, `c + side1`, `c - side1`; take the first that is in bounds, open and empty, else no action. Ids `m1`, `m2`, …
  - `reachFarRow: VictoryRule`: among living non-`neutral` units, a `player` unit on row 0 → `win`, any other side on the last row → `lose`, both → `draw`, else `null`.
  - `seedless(input)`: the same input with `stage.seed: null` (so the host seed is used).
- `tests/sim/match.test.ts`
  - "the phase driver gives every side the same events; the AI hook gets side and budget only (M6)": stage-fixed; the mock AI returns one 200 ms move (`knight#1` → (0,7) for `player`, `wolf#3` → (2,1) for `wolves`); victory `draw` after the `wolves` side. Event types are exactly `BATTLE_READY, DEPLOY_DONE, ROUND_BEGIN`, then the turn `SIDE_BEGIN, SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, WAIT, UNIT_DONE, END_TURN, SIDE_END`, then `CHECK_NONE`, the same turn again, then `CHECK_END`. Result `draw`, 1 round, `phases` `{ battle: "play.result" }`, `now()` 400. Hook calls exactly `["player", { kind: "side", units: ["knight#1", "archer#2", "merchant#6"] }]`, `["wolves", { kind: "side", units: ["wolf#3", "wolf#4"] }]`.
  - "the turn fuse ends a stalled side at exactly its ms, also mid-move; the length is the user's": with a stalled AI and victory `lose`, fuse `60000` (BTF preset) and `30000`: events after the first three are exactly `SIDE_BEGIN, FUSE_EXPIRE, SIDE_END, CHECK_END` and `now()` equals the fuse. With fuse `1000` and an AI returning a 3000 ms move then a second move: the events from the fifth on are `SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, FUSE_EXPIRE, SIDE_END, CHECK_END`; `now()` 3000; `log.lastSeq()` 1 (the second move is never submitted).
  - "with the fuse off a stalled side runs to maxSimMs and the match is a timeout": fuse `"off"`, `maxSimMs` 5000 → `timeout`, `now()` 5000, no `FUSE_EXPIRE`; `maxSimMs: 1.5` → `RangeError`.
  - "50 seeds on 6x9 and 12x12 each end in win, lose or draw, and each log replays to the same history": seeds 1–50 on `seedless(input("stage-fixed", seed))` with sides `player, wolves` and on `seedless(input("stage-weighted", seed))` with sides `player, rival`; `ai: forward(seed)`, `victory: reachFarRow`; no outcome is `timeout`; `replay(src, parseLog(log.toJSON()).log, tick())` gives a deep-equal `bus.history()`. (Prototype: 6×9 48 win / 2 lose over rounds 4–10; 12×12 22 win / 28 lose over rounds 11–18.)
  - "the snapshot carries phases; restore takes them from the snapshot and checks the rest": a fresh world's `phases` is `{ battle: "play.loading" }`; after a `forward(3)` / `reachFarRow` match, `Object.keys` of the JSON round-tripped snapshot are the seven keys in order, `restore` gives a deep-equal snapshot, and `phases.battle` is `play.result`.
  - "the tick driver asks the same hook every everyMs for idle units only, and replays (M1, M6)": stage-fixed, sides `["player"]`, `everyMs` 100, `maxSimMs` 5000; the hook moves `knight#1` one row up (200 ms) whenever it is idle; victory `win` once the knight stands on row 5. Result `win`, 7 rounds, `now()` 600, `events` `[{ type: "CHECK_END", outcome: "win" }]`. The first three calls are `[0, "player", "unit", 3]`, `[100, "player", "unit", 2]`, `[200, "player", "unit", 3]` (time, side, budget kind, unit count). The log replays to the same history; `everyMs: 15` → `RangeError`.
- `tests/sim/world.test.ts`: the host-seed test reads the map with `readMap` and passes `map.doc` (not `{ cols, rows }`) to `resolvePlacements` (port from build B; assertions unchanged).
- `tests/sim/replay.test.ts`: in the restore test, replaying a log from `createWorld(input("stage-weighted"))` (seed 7) with `input("stage-fixed")` throws `/replay: world seed 24301 is not the log seed 7/`.

## Example
```ts
const world = createWorld(input);                       // step 09
const result = runMatch(world, {
  sides: ["player", "rival"], ai: myAi, victory: myRule, // the project's rule, not the sim's
  fuse: presetFuseMs,                                    // e.g. 60000 from the BTF preset; "off" or any integer ms
  maxRounds: 200, maxSimMs: 3_600_000,
});
// result.outcome: "win" | "lose" | "draw" | "timeout"; world.log replays it; snapshot(world).phases.battle === "play.result"
```

## How later steps use this (context only; do not build)
- step-09c (input and tooling): input intents `SelectUnit | TargetCell | Confirm | Cancel | BoxSelect` mapped to these events (STATES §3.4; tap-tap and drag identical; `BoxSelect` a no-op that never throws), and the `sim` script that prints the outcome and a history hash.
- Rules (step 10 and later) give attacks and effects; a project's victory rule (e.g. "a side with no living units loses") is a `VictoryRule` above core.
- The host driver (`src/runtime/host/raf-driver.ts`) will call the same hook from frames; overlays pause the clock (STATES §2), so the fuse stops with it.

## Decisions note: what to name
- The seven `SimSnapshot` keys, in order (port from build B's habit).
- The exact `RangeError` messages.
- Anything you chose that the file doesn't state (law 12), e.g. how you track `busyUntil`.
- Notice messages are unchanged from step 09; do not reword them.

## BTF intent (read-only)
None (rewrite). Intent only: `scripts/sim-50.mjs:1-30` (batch report over many seeds), `chess/game/towerTourney.ts:62-63` fixed step and tick cap. Not repeated: `towerTourney.ts:515` global `Math.random` patch, `scripts/node-game.mjs:4-18` browser shims.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `tsconfig.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change (the `sim` script is step 09c's).
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's files except the six named above: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/index.ts`, `src/sim/actions.ts`, `tests/sim/input.ts`, `tests/sim/actions.test.ts`, and every other existing test.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 122. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; both exit 0.
- [ ] `sha256sum .dependency-cruiser.cjs` prints `9037bacef0aa7ff33abff96d308fe137ef1c7d4baa6795af070c3b68d7bd3e81` (unchanged), and `npm run deps` reports no violations.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\.now\b|\bnew Date\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/sim` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim` prints exactly two lines, both in `src/sim/world.ts` (one clock; no host-frame path).
- [ ] `rg -n --pcre2 '\bstartFuse\b|\b(30000|60000)\b' src/sim` prints exactly two lines, both in `src/sim/driver-phase.ts`: the import and the one `startFuse(` call (one fuse source; no fuse default in sim).
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/sim` prints nothing (no game rules).
- [ ] `rg -n --pcre2 "[\"'](player|rival|neutral|wolves)[\"']" src/sim` prints nothing (sides are inputs).
- [ ] `rg -n --pcre2 'phases(\.\w+|\[[^\]]*\])\s*=(?!=)' src` prints nothing (phases replaced whole, never written per key).
- [ ] `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile" src/sim` and `rg -n --pcre2 "from ['\"][^'\"]*/sim/" src --glob '!src/sim/**'` print nothing.
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/index.ts src/sim/actions.ts tests/sim/input.ts tests/sim/actions.test.ts .dependency-cruiser.cjs package.json tests/fixtures` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 320 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the ten files in "Files to create or change" (`A` for the four created, `M` for the six changed; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-09b-match-drivers/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Input intents and gesture mappers, `BoxSelect`, the `sim` npm script (step 09c).
- Attacks, effects, knock-outs, any victory rule in `src/`; resuming a driver mid-turn from a restored snapshot (the fuse timer and turn position are driver state); overlays and pause during a match.
- The `estimated: true` offline estimate, offline catch-up, saves, rendering, networking.
