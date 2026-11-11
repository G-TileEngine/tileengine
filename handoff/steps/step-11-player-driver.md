# step-11-player-driver: the player driver (intents in, submit out), seats in the phase driver, a per-step hook

Step id: step-11-player-driver          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `e9d48204668a58af1944e0b21909c2627a5ef2c7` on `main` (step-10c-fx-look r1 merged, PR #15); the diff is always `e9d4820..<head>`
Branch: `step/step-11-player-driver-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-11-player-driver-r<N>.bundle e9d48204668a58af1944e0b21909c2627a5ef2c7..step/step-11-player-driver-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-11-player-driver/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-01-state-tables (`xGo`, `TABLES`, `mergeTables`, `Phase`, `Event`), step-09-sim-harness (`submit`, `snapshot`, `replay`), step-09b-match-drivers (`runMatch`, the test AI and rule in `tests/sim/ai.ts`), step-09c-input-sim-script (`Intent`, `createGestureMapper`, `intentEvent`, `feedIntent`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 5, 10, 12, M4, M6, M7; §3 (the `src/sim/` and `src/runtime/input/` rows); §5 (state rule); `docs/STATES.md` §3.3, §3.4 and rule 8
Kit: kit-2, 2026-11-11. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 166/0) on Node 24.22.1 on top of `main` `e9d4820`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is new or is `MatchOptions` with one optional field. `main` `e9d4820` is green with it (Architect check, 161/0; `npm run sim` 48/2 and 22/28, unchanged by this step).
Carries: no Change Notice. `src/sim` already may import `src/state` and `src/runtime/input`, and nothing imports sim; `.dependency-cruiser.cjs` (`dcf61c61…`) and BUILD_GUIDE are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give every move one door. `createPlayer(world, opts)` is the **player driver**: it takes a 09c `Intent` (plus an optional aim), maps it to the tactics `Event` with step 09c's `intentEvent`, checks it against the state tables, moves `world.phases` through step 09c's `feedIntent`, and, when the event is an accepted `TAP_MOVE_CELL`, builds one M4 move `Action` and `submit`s it. Anything it refuses is a **reported reject**: a `PlayerStep` with a reason, and no change to units, occupancy, the log, notices or phases. `runMatch` gains **seats**: a seated side is played through its player, from an `IntentHook` that returns intents (a touch host, a bot, the chaos player, later an online peer), and lands each move on the one clock with the same events an AI move gets. An optional `onStep` runs after every input (moves landed), so a later harness can check invariants and hash a snapshot after every step. The test AI expressed as intents through seats gives the 50-seed histories byte for byte.

This is step A of `docs/chaos-player-outline.md` §7 (CEO Q1: a player driver before chaos; chaos never submits moves the way the test AI does).

Rulings in this step (CEO 2026-11-10 and 2026-11-11, via Chief Of Staff; Engine Architect 2026-11-11):
- **Online play is just another driver (CEO standing rule, 11 Nov).** The rules core never knows who is playing. Every move arrives as an intent through a driver; a future online peer is an `IntentHook` on a seat. Nothing in `src/core`, `src/state`, `src/rules` or the bot code may need editing for it. The player never reads who is behind the hook.
- **No game rules (law 4):** the player checks only what the engine already owns: a table edge exists, the unit exists, is alive and is on the seat's side, the cell is on the grid. Whether a cell can be entered is still the core's call when the move lands (`moveTo`: `closed` / `occupied` → `moveFailed` notice). No move range, cost or stats.
- **User options, not hardcoded rules (law 12):** the seated side, the move duration and the action id source are `PlayerOptions` with **no defaults** in `src/`. Test values (200 ms, ids `m1`, `m2`, …) live in tests only.
- **One clock, integer ms:** the player never steps, advances or reads ahead on the clock; landing is the phase driver's (`replayTicks`), exactly as in step 09b. `moveMs` is `null` or an integer ≥ 0.
- **State rule (§5):** phases move only through `feedIntent` (which uses `xGo`) and the driver's `mark`; `world.phases` is replaced whole.
- **Same events for every player (STATES rule 8):** a seated move and an AI move give the same event sequence (`SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, WAIT, UNIT_DONE`). The AI path of `runMatch` keeps its exact events and submit order.
- **Rejects are a pass, but reported (CEO Q3):** the player never throws on a bad intent; it returns the reason. It throws only on a programming error (a missing battle phase, a bad `moveMs`) and `runMatch` on bad seats.
- **BTF defaults only (CEO Q9):** no new option keys; `FxOptions` untouched.

## Files to create or change
- change `src/sim/types.ts`: add `Sq` to the core-types import, import `Intent`, add `seats` to `MatchOptions`, append the quoted block (≤ 38 changed lines)
- create `src/sim/player.ts`: `createPlayer` (≤ 58 lines)
- change `src/sim/driver-phase.ts`: seat validation, the seated turn, one shared landing helper for AI and seated moves (≤ 52 changed lines)
- change `src/sim/index.ts`: the quoted file (≤ 7 changed lines)
- create `tests/sim/seats.ts`: test-only `asIntents`, `counter` (not a `*.test.ts`; ≤ 18 lines)
- create `tests/sim/player.test.ts` (≤ 120 lines)

Size: ≤ 294 changed lines in total, counting insertions + deletions; the per-file caps above add up to 293 (prototype: 244 insertions, 14 deletions = 258). No new fixtures. If you pass ~270, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 01: `Phase`, `Event`, `TABLES`, `mergeTables`. From step 07: `Action`. From step 09/09b: `SimWorld`, `Budget`, `MatchOptions`, `submit`, `runMatch`. From step 09c: `Intent`, `intentEvent`, `feedIntent`. From core-types: `SideId`, `Sq`. Import these; never retype them.
```ts
// src/sim/types.ts — MatchOptions gains one optional field, after maxSimMs
  /** Sides played through the player driver (intents in, submit out); `ai` is not asked for a seated side. */
  readonly seats?: readonly Seat[];
```
```ts
// src/sim/types.ts — append at the end of the file
/** The one door: every move arrives as an intent (touch, bot, chaos player, a later online peer). */
export type IntentInput = { readonly intent: Intent; readonly aim?: Sq | null };
export type IntentHook = (world: SimWorld, side: SideId, budget: Budget) => readonly IntentInput[];
/** Caller inputs, no defaults: the seated side, the move duration (null = instant) and the action id source. */
export type PlayerOptions = { readonly side: SideId; readonly moveMs: number | null; readonly nextId: () => string };
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction";
export type PlayerStep = {
  readonly intent: Intent;
  readonly aim: Sq | null;
  readonly tick: number;
  readonly from: Phase;
  readonly event: Event | null;
  readonly action: Action | null;
  readonly reject: PlayerReject | null;
};
export type Player = {
  readonly side: SideId;
  feed(intent: Intent, aim?: Sq | null): PlayerStep;
  history(): readonly PlayerStep[];
};
export type Seat = {
  readonly player: Player;
  readonly intents: IntentHook;
  /** Called after each input is fed and, for a move, landed: invariant checks and per-step snapshot hashes hang here. */
  readonly onStep?: (step: PlayerStep, world: SimWorld) => void;
};
```
```ts
// src/sim/index.ts — the whole file
export type { AiHook, Budget, IntentHook, IntentInput, MatchOptions, MatchResult, Player, PlayerOptions, PlayerReject, PlayerStep, Seat, SimInput, SimSnapshot, SimWorld, TickOptions, VictoryRule } from "./types.ts";
export { createWorld } from "./world.ts";
export { submit } from "./actions.ts";
export { advance, replay, replayTicks, restore, snapshot } from "./run.ts";
export { runMatch } from "./driver-phase.ts";
export { runTicks } from "./driver-tick.ts";
export { feedIntent, intentEvent } from "./intents.ts";
export { createPlayer } from "./player.ts";
```
```ts
// src/sim/player.ts — exported declaration
export function createPlayer(world: SimWorld, opts: PlayerOptions): Player;
```
`runMatch`'s and `runTicks`' signatures are unchanged; `src/runtime/input`, `src/sim/intents.ts` and `src/sim/actions.ts` are unchanged.

Behaviour (exact; each line has a test):
1. **Options:** `createPlayer` throws `RangeError` unless `moveMs` is `null` or an integer ≥ 0. `nextId` is called once per built action and never otherwise.
2. **feed, in this order:** `from = world.phases.battle` (missing → `Error("player: battle phase missing")`); `event = intentEvent(from, intent, aim ?? null)`. Reject reasons, first match wins: `event` is `null` → `"noEvent"`; no state-table row for `from` and `event.type` (look it up in `mergeTables(TABLES)`, built once; never retype a table) → `"illegal"`; `SELECT_UNIT` of an unknown or dead unit → `"noUnit"`, of a unit on another side → `"notOwn"`; `CONFIRM_TARGET` → `"noAction"` (no intent chooses an action yet; M9 is later); `TAP_MOVE_CELL` with no selected unit, or a selected unit that is now unknown or dead → `"noUnit"`, on another side → `"notOwn"`, a cell outside `world.grid.inBounds` → `"offGrid"`.
3. **Accepted:** `feedIntent(world, intent, aim)` moves the phase (the 09c path). The selection becomes `unitId` on `SELECT_UNIT` and is cleared on every other accepted event (`CANCEL`, `TAP_MOVE_CELL`). On `TAP_MOVE_CELL` the player builds `{ id: nextId(), kind: "move", actor: <selected>, target: { pipe: "tile", at: <fresh { c, r }> }, durationMs: moveMs, turns: null, effects: [] }` and `submit`s it (one log entry). The player never touches the clock. The core still decides the cell when the move lands: a closed or taken cell gives step 09's `moveFailed` notice, the unit stays, and the action stays in the log (a real, replayable command).
4. **Rejected:** nothing changes: units, occupancy, `logSeq`, notices, phases and the selection are as before.
5. **The step record:** every `feed` returns and appends `{ intent, aim: aim ?? null, tick: clock.tick() after the feed, from, event, action, reject }`; `event` is the mapped event even when the intent is rejected (`null` only for `"noEvent"`), `action` is non-null only for an accepted tap-move. `history()` returns a copy, in feed order.
6. **Seats in runMatch:** before `BATTLE_READY`, `runMatch` throws `RangeError` unless every seat's `player.side` is in `sides` and no side is seated twice. In a seated side's turn the driver asks `seat.intents(world, side, { kind: "side", units })` (same budget as the AI) and never `opts.ai`. An empty list is a stall exactly as in step 09b (`replayTicks(world, 1)`, ask again). Otherwise each input, in order, while the fuse has not fired and `now() < maxSimMs`: `player.feed(intent, aim)`; an accepted event is appended to `events` (the phase was already moved by the player; do not apply it twice); if the step has an action, land it with the **same helper the AI move uses**: `replayTicks(ceil(ms / stepMs))` with `ms = durationMs === null ? 0 : max(durationMs, stepMs)`, `MOVE_DONE`, then, unless the fuse fired, `WAIT` and `UNIT_DONE { next: "idle" }`; then `seat.onStep?.(step, world)` (also after a reject). Then `END_TURN` / `FUSE_EXPIRE` and `SIDE_END` as before.
7. **Unseated sides and runTicks are unchanged:** the AI path gives the same events, submit order and timing as at the base (`npm run sim` prints the same two lines). `runTicks` takes no seats (tick-mode tables come later).

## Tests that prove it is done
Run: `npm test`, or `node --test tests/sim/*.test.ts`. Common options in `player.test.ts`: `base = { sides: ["player", "wolves"], ai: () => [], victory: () => null, fuse: 60000, maxRounds: 40, maxSimMs: 600000 }`; seated players use `moveMs: 200` and, when every side is seated, one shared `nextId = counter("m")`.
- `tests/sim/seats.ts` (test-only; `src/` must not contain this logic):
  - `asIntents(ai: AiHook): IntentHook`: calls the hook and turns each tile `move` into `[{ intent: SelectUnit actor }, { intent: TargetCell at }]` (fresh `{ c, r }`); other actions are dropped.
  - `counter(prefix): () => string`: `${prefix}1`, `${prefix}2`, …
- `tests/sim/player.test.ts`
  - "the test AI as intents through the player driver gives the same 50-seed histories, byte for byte": for `stage-fixed` (`player, wolves`) and `stage-weighted` (`player, rival`), seeds 1–50 on `seedless(input(stage, seed))`, every side seated with `asIntents(forward(seed))`, `victory: reachFarRow`, and an `ai` that throws if it is ever asked. Outcome counts and `sha256(JSON.stringify(histories))` are exactly `48/2 afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `22/28 b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c` (the step-09c `npm run sim` pins).
  - "rejects are reported, add no event and change no unit, occupancy, log or phase (CEO Q3)": a stage-fixed world in `idle`, a `player` seat. In order, `(intent → from, reject)`: `BoxSelect` → idle, `noEvent`; `Confirm` → idle, `noEvent`; `TargetCell (0,7)` → idle, `noEvent`; `SelectUnit wolf#3` → idle, `notOwn`; `SelectUnit ghost#9` → idle, `noUnit`; `SelectUnit knight#1` → idle, accepted; `TargetCell (-1,7)` → unitSelected, `offGrid`; `TargetCell (6,0)` → unitSelected, `offGrid`; `Cancel` → unitSelected, accepted; `Cancel` → idle, `illegal`. Every reject leaves `JSON.stringify` of the snapshot's `units`, `occupancy`, `logSeq` and `phases` unchanged, and no step has an action. With phases set to `targeting`, `TargetCell (0,7)` and `Confirm` with aim `(0,7)` are `noAction`; with `moving`, `SelectUnit knight#1` is `illegal`. `history()` lists the thirteen rejects/accepts in order; `log.lastSeq()` is 0 and there is no `moveFailed` notice. Then, on a fresh player with `phases = { battle: "unitSelected" }` and no `SelectUnit` through that player, `TargetCell (0,7)` is `noUnit` (event `TAP_MOVE_CELL`), leaves `JSON.stringify` of `units`, `occupancy`, `logSeq` and `phases` unchanged, and has no action; after `SelectUnit knight#1` (from `idle`) then `world.units.remove("knight#1")`, `TargetCell (0,7)` is likewise `noUnit` with nothing changed. (The thirteen-entry `history()` above is the first player's only.)
  - "a tap-move submits one move with the caller's id and ms; the core still decides blocked cells": `SelectUnit knight#1`, `TargetCell (0,7)` with `nextId = counter("k")` → the step's action deep-equals `{ id: "k1", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: 200, turns: null, effects: [] }`, its event is `TAP_MOVE_CELL`, phase `moving`, `log.lastSeq()` 1; after 20 clock steps the knight stands on (0,7). With `moveMs: null`, `TargetCell (1,8)` (taken by `archer#2`) submits a `durationMs: null` move, the last notice is `moveFailed`, `log.lastSeq()` 1, and the knight is still on (0,8). `moveMs: 1.5` throws `RangeError`; `feed` on a world with `phases = {}` throws `/player: battle phase missing/`.
  - "touch gestures reach submit through the same door; events match the AI turn (CEO Q2, STATES rule 8)": a `player`-only match (`fuse: 1000`, victory `draw`) whose seat hook, on its first call only, runs pointer samples through `createGestureMapper({ cellPx: 64, tapMaxPx: 10, holdMs: 500 }, …)`. Tap-tap (0,8) at 0–90 ms then (0,7) at 400–480 ms, and a drag (0,8) → (0,7) with a move at 80 ms and up at 200 ms, each give events exactly `BATTLE_READY, DEPLOY_DONE, ROUND_BEGIN, SIDE_BEGIN, SELECT_UNIT, TAP_MOVE_CELL, MOVE_DONE, WAIT, UNIT_DONE, END_TURN, SIDE_END, CHECK_END`, the knight on (0,7) and `log.lastSeq()` 1.
  - "onStep runs after every input (moves landed); per-step snapshots repeat and the log replays; bad seats throw": stage-fixed, both sides seated with `asIntents(forward(3))`, `victory: reachFarRow`; `onStep` records `JSON.stringify(snapshot(world))` per step. More than 20 steps, none rejected, the count equals the players' `history()` lengths summed; a second run gives the identical list; `replay(src, parsed log, tick())` gives a deep-equal `bus.history()`. The same seat twice, or a `player` seat with `sides: ["wolves"]`, throws `RangeError`.

## Example
```ts
const world = createWorld(input);
const nextId = idSource();                                 // the project's id scheme; online: the peer's ids
const touch = createPlayer(world, { side: "player", moveMs: presetMoveMs, nextId });
const result = runMatch(world, {
  sides: ["player", "rival"], ai: rivalAi, victory: myRule, fuse: presetFuseMs, maxRounds: 200, maxSimMs: 3_600_000,
  seats: [{ player: touch, intents: fromTouchQueue, onStep: (step, w) => checks(step, snapshot(w)) }],
});
for (const s of touch.history()) if (s.reject !== null) report.push(s); // CEO Q3: a reject is a pass, but listed
```

## How later steps use this (context only; do not build)
- Chaos step B (harness): one seat per side; `onStep` runs the QA invariants after every action and may hash `JSON.stringify(snapshot(world))` (sha256 is the caller's; `src/sim` has no `node:` imports). The failure record's `moves` are the `PlayerStep`s (`intent`, `aim`, `tick`), plus pointer samples for gesture runs.
- Chaos step C (generators): an `IntentHook` on its own `streamSeed(seed, <name>)` stream (legal, illegal and odd intents; gestures through `createGestureMapper`). Forged and replayed intents for the dev-side exploit hunter enter through the same door.
- An online peer is an `IntentHook` on a seat; the action menu step (M9, `CHOOSE_ACTION`) turns `CONFIRM_TARGET` into a submitted action; tick-mode seats come with tick-mode tables; the player moves out of `src/sim` with the intent mapper when a runtime layer that may import `src/state` exists (a later Change Notice).

## Decisions note: what to name
- The exact `RangeError` messages.
- How you hold the selection and look up table edges.
- How the AI move and the seated move share the landing helper, and how you keep the AI path's events and submit order byte-identical.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). Intent only: BTF's `BUILD_LAW.md` rule 10, "an online action isn't done until its type is in the SEAT set" (one door for every seat; summarised in `docs/core-spine-slices.md` §1.2). Not repeated: BTF's DOM-bound input handlers and any direct state write from input.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/fx/**`, `src/btf-adapters/**`, `src/runtime/**`, `src/index.ts`, `src/sim/{actions,intents,run,world,driver-tick}.ts`.
- `tests/fixtures/**`, `tests/sim/ai.ts`, `tests/sim/input.ts`, `tests/smoke.test.ts`, `tests/gates.test.ts`, and every existing test.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 166. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628` and `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (unchanged).
- [ ] `npm run sim` prints exactly the base's two lines: `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/sim src/runtime` prints nothing, and `rg -n --pcre2 '\bMath\.random\b|\bDate\.now\b|\bnew Date\b' tests/sim` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim src/runtime` prints exactly two lines, both in `src/sim/world.ts`; `rg -n --pcre2 '\breplayTicks\b|\badvance\b|clock\.(step|after|advance)\b' src/sim/player.ts` prints nothing (the player never moves time).
- [ ] One door: `rg -n --pcre2 '\bsubmit\(' src/sim/player.ts` prints exactly one line; `rg -n --pcre2 '\bsubmit\(' src/sim/driver-phase.ts` prints exactly two lines (the AI path's, as at the base; the seated path never submits); `rg -n 'kind: "' src/sim/player.ts` prints exactly one line (the move); `rg -n 'export function createPlayer' src/sim/player.ts` prints exactly one line.
- [ ] `rg -n --pcre2 '(?<![\w.])(?!0\b|1\b)\d+(\.\d+)?\b' src/sim/player.ts` prints nothing (no default ms or id).
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/sim src/runtime` prints nothing, and `rg -n --pcre2 "[\"'](player|rival|neutral|wolves)[\"']" src/sim` prints nothing (sides are inputs).
- [ ] `rg -n --pcre2 'phases(\.\w+|\[[^\]]*\])\s*=(?!=)|phases\.battle\s*\?\?' src` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/sim/" src --glob '!src/sim/**'` prints nothing; `rg -n --pcre2 "from ['\"][^'\"]*/(fx|btf-adapters)/" src/sim` prints nothing; `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/sim src/runtime` prints nothing.
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/fx src/btf-adapters src/runtime src/index.ts src/sim/actions.ts src/sim/intents.ts src/sim/run.ts src/sim/world.ts src/sim/driver-tick.ts scripts package.json package-lock.json eslint.config.mjs tsconfig.json .dependency-cruiser.cjs tests/fixtures tests/sim/ai.ts tests/sim/input.ts tests/sim/match.test.ts tests/sim/intents.test.ts tests/sim/replay.test.ts tests/sim/world.test.ts tests/sim/actions.test.ts tests/sim/script.test.ts tests/runtime tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 294 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the six files in "Files to create or change" (`A` for `src/sim/player.ts`, `tests/sim/seats.ts`, `tests/sim/player.test.ts`; `M` for the other three; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-11-player-driver/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- `CONFIRM_TARGET` → a submitted action: needs the action menu (`CHOOSE_ACTION`, M9). Until then it is the reported reject `noAction`.
- Seats in `runTicks` (tick-mode tables first); restoring a seat's selection mid-turn from a snapshot (the selection is driver state, like the fuse and turn position in step 09b).
- Moving the test AI and `npm run sim` onto seats. The first test proves the two paths give the same histories; retiring the action-returning `AiHook` path would change M6's wording and needs its own ruling.
- A per-step hash inside `src/` (`onStep` is the hook; sha256 stays the caller's), the chaos harness, generators, shrink and failure records (chaos steps B and C).

## Out of scope
- Real DOM / pointer wiring (`src/runtime/host/`), camera (M5), overlays and pause, haptics.
- Networking, online peers, saves and imports, rewards or currency events.
- Any victory rule, attack, effect or move-range rule in `src/`.
