# step-18-card-free-levelling: landed moves fill an XP bar (one per side, or one per unit, by rule), the bar levels up on a threshold table passed in, is offered a seeded pick of up to N abilities at the offer levels, and unlocks the one chosen through the one door

Step id: step-18-card-free-levelling          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `573ae0cd2d43b7c30613a1182f2ee53e09d51ab7` (`573ae0c`, the step-17-memory-guard merge on `main`, PR #22; verified by the Engine Architect 2026-11-12: green 205/0, sim unchanged, all ten smoke lines as pinned). The diff is always `<base>..<head>`.
Branch: `step/step-18-card-free-levelling-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-18-card-free-levelling-r<N>.bundle <base>..step/step-18-card-free-levelling-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-18-card-free-levelling/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-05-rng (`createRng`, `streamSeed`, `Rng.int`), step-07-events-log (`createBus`, `EventRegistry`, `BusEvent`, `ModeEventMap` augmentation), step-09/09b (`createWorld`, `SimInput`, `SimWorld`, `SimSnapshot`, `snapshot`, `replay`, `restore`, `runMatch`, `submit`), step-11-player-driver (`createPlayer`, `PlayerReject`, `PlayerStep`), step-12 (`CHAOS_CHECKS`, `runChaos`, `replayChaos`), step-14-bot-driver (the every-reject test), step-16-door-guard (`BTF_STAGE_LIMITS`: the pattern for BTF data in `src/btf-adapters`), step-17-memory-guard (`disposeWorld`, the `disposed` refusal, the GC test)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 6, 7, 9, 10, 12, M4, M7, M9; §3 (the `src/rules/`, `src/sim/`, `src/btf-adapters/` rows: rules may import core, state, fx, types; nothing imports sim; adapters are data); `src/types/core-types.ts` `ModeEventMap` (augmentable, "Empty in core"); `handoff/steps/step-16-door-guard.md` Behaviour 1; `handoff/steps/step-17-memory-guard.md` Behaviour 5 and 7; `docs/qa/chaos-player-invariants.md` (a)4, (a)9, (a)12
Kit: kit-2, 2026-11-12. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 214/0) on Node 24.22.1 on top of the step-17 merge `573ae0c` (prototype `34e0979`; a fresh clone of the prototype runs green), against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `npm run sim` 48/2 and 22/28, the four chaos smoke lines and the six exploit smoke lines are unchanged by this step (levelling is off unless a match opts in).
Carries: **no Change Notice.** No pinned file changes: `core-types.ts` is unchanged (the two level events are added by **declaration merging** into its augmentable `ModeEventMap`, from `src/rules/levels/types.ts`, the documented mode path; core stays "empty"); `.dependency-cruiser.cjs` (`dcf61c61…`), `package.json` (`1e5dd82c…`), BUILD_GUIDE, STATES and every state table are unchanged (the pick is not a state-machine event and writes no phase). The pick intent `ChooseAbility` lives in `src/sim/types.ts` (no BUILD_GUIDE Change Notice: Engine Architect ruling below) as part of the door's input (`DoorIntent = Intent | ChooseAbility`); `src/runtime/input`'s `Intent` (M7's five gesture intents) is unchanged. `PlayerReject` gains two reasons (no pinned file lists them; step 16 Carries). `src/rules` gains one folder in an existing layer; `src/btf-adapters` gains one data file importing a `src/rules` type (allowed, as `stage-limits.ts` imports a `src/project/read` type). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give TileEngine the card-free levelling foundation (CEO 2026-11-10/11/12): when a bar reaches a level, its owner is offered a pick of abilities and unlocks the one it chooses, at BTF's tested levels and XP thresholds. A rules field picks who owns a bar: the whole side (`bar: "side"`, BTF's way and the BTF preset) or each unit (`bar: "unit"`). The card version (a card-hand add-on) and other levelling variants come later. After this step: (1) **`createLevels(setup, rng, emit)`** in `src/rules/levels/` keeps, per bar, its XP, level, banked XP, pending offer and unlocked abilities. Every number is **data passed in** (`LevelRules`: bar owner, thresholds, offer levels, offer size, XP per move; `AbilityPools`: abilities per side id, or per unit document). (2) **A landed move pays XP** (`rules.xp.move`) to the mover's bar: its side's bar under "side", its own under "unit". It is the only XP source in this step, because the engine has no attacks or kills yet. (3) Reaching an **offer level** draws an offer of up to `offerSize` abilities from the bar's pool, from its **own rng stream** (`"levels"`), in the exact draw order below. (4) **`ChooseAbility`** goes in through the one door (`createPlayer().feed`). It is refused with a named reason, or becomes one instant **`unlock` action** in the command log, so replay, restore and determinism hold. (5) Levelling is **off unless `SimInput.levels` is set**: no XP, no draws, no events, and snapshots are byte-identical to the base. When on, the snapshot gains a `levels` key that round-trips through `restore`. (6) BTF's numbers are the preset **`BTF_LEVEL_RULES`** in `src/btf-adapters`. (7) A small step-17 test fix: the GC test also holds a render subscriber from before dispose.

Rulings in this step (CEO 2026-11-10/11 via Chief Of Staff; CEO directly, 2026-11-12; Engine Architect 2026-11-12):
- **BTF's tested numbers (CEO 2026-11-10: "use BTF's tested system as is"; code wins over the doc).** The thresholds are `17, 11, 13, 11, 13, 14, 11, 11, 11` and the top level is 9. A move is 1 XP. Abilities are offered at levels `1, 3, 4, 6, 7, 9`, three per offer. Levels 2, 5 and 8 are BTF's ahead/behind sheets, a different variant that comes later. In this step they raise the level and offer nothing. Sources are in "BTF intent" below.
- **CEO directly, 2026-11-12 (Q1): both bar modes, by a rules field.** `LevelRules.bar` is `"side"` or `"unit"`. With `"side"`, the whole side shares one XP bar and one level, and every landed move of any of its units adds XP to it. With `"unit"`, each unit instance keeps its own bar. `BTF_LEVEL_RULES` uses `"side"`; `"unit"` stays as the alternative, and both are tested.
- **CEO directly, 2026-11-12 (Q2):** levels 2, 5 and 8 give nothing for now (the level rises; no offer).
- **CEO directly, 2026-11-12 (Q3):** XP comes from landed moves only, 1 XP each (BTF preset `xp.move: 1`).
- **Who gets the offer and the unlock under the side bar (Engine Architect, following BTF):** the **side** owns everything. BTF keeps one `xp` / `level` for the player (`towerXp.ts:20-21`) and one `PvpBar` per side (`:800-806`); every own step fills it (`TowerScreen.tsx:530`), and a side's kills fill that side's bar (`notePvpKill(side)`, `:879-906`). The offer is drawn from the side's own deck (`TowerScreen.tsx:206-215`, `liveKinds("you")`; `MATCH_LEVELS.md:18` "from your own deck"), and the chosen card goes to the side's hand, not to a piece (`scripts/seat-board.ts:372-374`: `acceptPvpDraft("angel", kind)`, then `returnToHand("angel", kind)`). So under `"side"`: the bar id is the side id; pools are keyed by side id; the offer is the side's; any seat of that side picks for it (`ChooseAbility.unitId` is not read, and `noUnit` / `notOwn` do not apply); the logged `unlock` action's `actor` is the side id; the ability joins the side's one `abilities` list, which every unit of the side shares. A foe seat has no offer of its own → `noOffer`; it can never pick the other side's offer.
- **No BUILD_GUIDE Change Notice for `ChooseAbility` (Engine Architect, 2026-11-12).** It is a sim-door intent (`DoorIntent` in `src/sim/types.ts`), not a runtime gesture: M7's five gesture intents in `src/runtime/input` are unchanged, so no pinned file or BUILD_GUIDE list changes.
- **The rules layer holds the mechanism; data holds every number.** `src/rules/levels/` names no value. It has no default and never reads `src/btf-adapters`. `src/sim` wires it to the world. The BTF preset is data in `src/btf-adapters` (law 4, law 11), like `BTF_STAGE_LIMITS`.
- **Smallest honest XP source: a landed move.** It is BTF's first listed source (`TowerScreen.tsx:530`, `towerXp.ts:1`, `MATCH_LEVELS.md:9`), and the only action that lands in the engine today. XP is paid to the mover's bar (`levels.barOf(unit)`) in `apply` after `moveTo` succeeds, so a failed move pays nothing and replaying the log pays the same XP at the same tick. Kills (2 / 5) and basic attacks (1) join `LevelRules.xp` when those actions exist (later steps).
- **The pick is an intent; the unlock is an action.** `{ type: "ChooseAbility", index, unitId? }` goes in through `feed`, the same door for touch, bot, chaos or a later online peer. The door stays blind to who plays. An accepted pick submits `{ kind: "unlock", actor, target: null, durationMs: null, turns: null, effects: [ability] }` (M4: data, instant). The ability *id*, not the index, is logged, so a log reads on its own. `apply` unlocks it only if it is in that bar's pending offer (the `actor` is the bar id); otherwise it pushes the notice `unlockFailed` (law 10: warn, don't block). The pick has no state-table event, writes no phase and is not "landed" by the driver.
- **XP waits while an offer is open (BTF `towerXp.ts:112-114`, `:886-889`).** XP gained while a bar's offer is pending is banked. After the pick, the banked XP is paid at once and may open the next offer. At the top level, leftover and banked XP are dropped (BTF `:128-130`, `:900-902`). The match does not pause for a pick; BTF's "the fight waits while a card is being chosen" is a presentation rule for the host.
- **Level events are mode events.** `level.reached` and `level.unlocked` are added to core-types' augmentable `ModeEventMap` by declaration merging, and registered on the bus (`LEVEL_EVENTS`) only when levelling is on. The world's bus is unchanged when it is off.
- **Disposed worlds refuse the pick (step 17).** `feed`'s `disposed` check comes before any reading of the pick.

## Files to create or change
- create `src/rules/levels/types.ts`: `LevelRules`, `AbilityPools`, `LevelSetup`, `LevelBar`, `LevelsState`, `Levels`, the `ModeEventMap` augmentation (≤ 34 changed lines); `src/rules/levels/levels.ts`: `LEVEL_EVENTS`, `createLevels` (≤ 70); `src/rules/levels/index.ts` (≤ 6)
- create `src/btf-adapters/src/levels.ts`: `BTF_LEVEL_RULES` (≤ 10); change `src/btf-adapters/src/index.ts` (≤ 5)
- change `src/sim/types.ts`: `SimInput.levels`, `SimWorld.levels`, `SimSnapshot.levels`, `ChooseAbility`, `DoorIntent` (in `IntentInput`, `PlayerStep`, `Player.feed`, `ChaosMove`), two reasons, one type import (≤ 26)
- change `src/sim/world.ts`: the registry and `createLevels` (≤ 10); `src/sim/actions.ts`: XP to the mover's bar on a landed move, the `unlock` action (≤ 10); `src/sim/player.ts`: the pick at the door (≤ 22); `src/sim/run.ts`: the `levels` snapshot key (≤ 5); `src/sim/chaos.ts`: `"levels"` in the (a)4 key list (≤ 6); `src/sim/driver-phase.ts`: land only a step with an event (≤ 6); `src/sim/index.ts`: export the two types (≤ 6)
- create `tests/rules/levels.test.ts` (≤ 76) and `tests/sim/levels.test.ts` (≤ 106)
- change `tests/sim/bot.test.ts`: the every-reject test reaches `noOffer` and `badPick` (≤ 22); `tests/sim/gc.test.ts`: a render subscriber before dispose (≤ 6)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 426 (prototype `34e0979` on `573ae0c`: 345 changed lines). No new fixtures. If you pass ~390, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 05: `Rng`, `RngState`, `createRng`, `streamSeed`. From step 07: `BusEvent`, `EventRegistry`, `NoModeEvents`. From step 09/09b/11/12/17: `SimInput`, `SimWorld`, `SimSnapshot`, `Intent`, `IntentInput`, `PlayerReject`, `PlayerStep`, `Player`, `ChaosMove`, `submit`, `isDisposed`. Import these; never retype them.
```ts
// src/rules/levels/types.ts
/** Levelling data (step 18), the maker's choice; no defaults. `bar`: who owns an XP bar (one per side, or one per unit). `thresholds[i]` is the XP
 *  to go from level i to i + 1 (the top level is `thresholds.length`); `offerLevels` open an offer of up to `offerSize` abilities; `xp.move` is paid when a move lands. */
export type LevelRules = { readonly bar: "side" | "unit"; readonly thresholds: readonly number[]; readonly offerLevels: readonly number[]; readonly offerSize: number; readonly xp: { readonly move: number } };
/** The abilities a bar may unlock, in the maker's order: by side id when `bar` is "side", by unit document id (`UnitState.unitId`) when "unit". */
export type AbilityPools = Readonly<Record<string, readonly string[]>>;
export type LevelSetup = { readonly rules: LevelRules; readonly pools: AbilityPools };
/** One bar (`id`: the side id or the unit instance id); `offer` is the pending pick (null = none), `banked` the XP held while it waits. */
export type LevelBar = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
export type LevelsState = { readonly rngState: RngState; readonly bars: readonly LevelBar[] };
export interface Levels {
  readonly rules: LevelRules;
  barOf(unit: { readonly id: string; readonly unitId: string; readonly side: string }): { readonly id: string; readonly pool: string };
  gain(id: string, pool: string, amount: number): void;
  offer(id: string): readonly string[] | null;
  choose(id: string, ability: string): boolean;
  state(): LevelsState;
}
declare module "../../types/core-types.ts" {
  interface ModeEventMap {
    readonly "level.reached": { readonly unit: string; readonly level: number; readonly offer: readonly string[] };
    readonly "level.unlocked": { readonly unit: string; readonly ability: string };
  }
}
// src/rules/levels/levels.ts
export const LEVEL_EVENTS: EventRegistry<NoModeEvents> = { mode: "levels", types: ["level.reached", "level.unlocked"] };
export function createLevels(setup: LevelSetup, rng: Rng, emit: (event: BusEvent<NoModeEvents>) => void): Levels;
// src/rules/levels/index.ts
export type { AbilityPools, LevelBar, LevelRules, LevelSetup, Levels, LevelsState } from "./types.ts";
export { LEVEL_EVENTS, createLevels } from "./levels.ts";
// src/btf-adapters/src/levels.ts
/** BTF's tested levelling (CEO 2026-11-10/12): one bar per side, towerXp.ts XP_AT and LEVEL_CAP 9, a move is 1 XP,
 *  ability offers at levels 1, 3, 4, 6, 7 and 9 (2, 5 and 8 give nothing for now), three per offer. */
export const BTF_LEVEL_RULES: LevelRules = { bar: "side", thresholds: [17, 11, 13, 11, 13, 14, 11, 11, 11], offerLevels: [1, 3, 4, 6, 7, 9], offerSize: 3, xp: { move: 1 } };
// src/btf-adapters/src/index.ts — appended
export { BTF_LEVEL_RULES } from "./levels.ts";
// src/sim/types.ts — SimInput gains, after `busLimits`:
  /** Levelling with a pick of abilities (step 18): absent = off (no XP, no offers, no draws, snapshots as before). */
  readonly levels?: LevelSetup;
// SimWorld gains, after `notices`:   readonly levels: Levels | null;
// SimSnapshot gains a last member:  readonly levels?: LevelsState;
/** Step 18: the level pick, fed through the same door; `index` points into the bar's pending offer. `unitId` names the bar under
 *  `bar: "unit"`; under "side" the bar is the seat's own side and `unitId` is not read. */
export type ChooseAbility = { readonly type: "ChooseAbility"; readonly index: number; readonly unitId?: string };
export type DoorIntent = Intent | ChooseAbility;
// IntentInput.intent, PlayerStep.intent, Player.feed's first parameter and ChaosMove.intent become DoorIntent.
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction" | "malformed" | "disposed" | "noOffer" | "badPick";
// src/sim/index.ts — ChooseAbility and DoorIntent join the type export list.
```
Write your own comments in your own words, except the three quoted on `LevelRules`, `ChooseAbility` and `BTF_LEVEL_RULES`. `src/core/**`, `src/state/**`, `src/runtime/**`, `src/project/**`, `src/fx/**`, `src/rules/turns/**`, `src/sim/{intents,chaos-gen,shrink,exploit,exploit-docs,dispose,driver-tick}.ts` and `tests/fixtures/**` are unchanged.

Behaviour (exact; each line has a test):
1. **Rules are checked once, first:** `createLevels` throws `RangeError("createLevels: bad rules or pools")` unless `bar` is `"side"` or `"unit"`, `thresholds` is non-empty with every entry an integer ≥ 1, every `offerLevels` entry is an integer in `1..thresholds.length`, `offerSize` is an integer ≥ 1, `xp.move` is an integer ≥ 0, and every pool is an array of strings. Never clamped. `gain` with an `amount` that is not an integer ≥ 0 throws `RangeError("levels: amount must be an integer >= 0")`.
2. **Bars:** `barOf(unit)` is `{ id: unit.side, pool: unit.side }` under `"side"` and `{ id: unit.id, pool: unit.unitId }` under `"unit"`. A bar is created at `{ xp 0, level 0, banked 0, offer null, abilities [] }` by its first `gain(id, pool, …)` (also `gain(…, 0)`), keeping the `pool` key given then. `state().bars` lists bars in creation order; events carry the bar id as `unit`. `offer(id)` is a copy of the pending offer, or `null` (also for an unknown id). `state()` returns plain JSON copies, `rngState` included.
3. **Paying XP (`gain`, and the banked XP after a pick):** with `top = thresholds.length` and `left = amount`, repeat while `left > 0` and `level < top`: if an offer is pending, add `left` to `banked` and stop. Otherwise `take = min(thresholds[level] − xp, left)`, `xp += take`, `left −= take`. If `xp` is still below `thresholds[level]`, stop. Otherwise set `xp = 0`, `level += 1`, open the offer (Behaviour 4) and emit `{ type: "level.reached", unit: id, level, offer }` (`offer` is `[]` when none opened). After the loop, if `level ≥ top`, set `banked = 0`. XP left over at the top level is dropped.
4. **Opening an offer:** from the bar's pool (`pools[pool]`), only when the new level is in `offerLevels`; otherwise the offer is `[]` and no draw is made. The offer is drawn as in "Draw order". If it has at least one ability it becomes the pending offer; if it is empty (no pool, an empty pool, or every ability already unlocked), nothing is pending.
5. **`choose(id, ability)`:** returns `false` and changes nothing (no event, no draw) unless the bar `id` has a pending offer that includes `ability`. Otherwise it appends `ability` to `abilities`, clears the offer, emits `{ type: "level.unlocked", unit: id, ability }`, sets `banked = 0` and pays the old banked amount as in Behaviour 3. Then it returns `true`.
6. **The world:** `createWorld` with `input.levels` set creates the bus with `LEVEL_EVENTS` as its registry and `levels = createLevels(input.levels, createRng(streamSeed(seed, "levels")), (e) => bus.emit(e))`. Without it, the bus gets no registry and `levels` is `null`. No other rng is created or drawn. `snapshot` adds `levels: world.levels.state()` as its last key only when `world.levels !== null`, so a levelling-off snapshot is byte-identical to the base.
7. **XP on a landed move:** in `apply`, after a successful `moveTo`, when `world.levels !== null`: with `unit = world.units.get(action.actor)` and `bar = world.levels.barOf(unit)`: `world.levels.gain(bar.id, bar.pool, world.levels.rules.xp.move)`. Under `"side"` every landed move of any of the side's units fills the one side bar. A failed move (`moveFailed`) pays nothing. No other action pays XP.
8. **The `unlock` action:** in `apply`, an action with `kind: "unlock"` and `target: null` calls `world.levels.choose(action.actor, action.effects[0])` (`actor` is the bar id: a side id or a unit id). If levelling is off or `choose` returns `false`, it pushes the notice `{ code: "unlockFailed", message: "unlock failed" }` and nothing else changes.
9. **The pick at the door:** `feed` keeps its order: phase read, `disposed`, `malformed`. Then, for `intent.type === "ChooseAbility"`, the bar is the seat's side (`opts.side`) when `world.levels.rules.bar === "side"`, and `unitId` is not read; otherwise the unit `world.units.get(intent.unitId ?? "")`. It decides the first matching reason in this order: (not "side" only) the unit is missing or dead → `noUnit`; (not "side" only) it is not this seat's side → `notOwn`; levelling is off or the bar has no pending offer → `noOffer`; `index` is not an integer in `0..offer.length − 1` → `badPick`. A refused pick records `{ intent, aim: null, tick, from, event: null, action: null, reject }`, is kept in `history()` and changes nothing. An accepted pick submits `{ id: opts.nextId(), kind: "unlock", actor: <the bar id>, target: null, durationMs: null, turns: null, effects: [offer[index]] }` and records it with `event: null` and `reject: null`. The phase and `selected` are unchanged either way. No other intent changes behaviour.
10. **The driver lands only moves:** `runMatch` calls its landing (`MOVE_DONE`, `WAIT`, `UNIT_DONE`) only for a step that has both an action and an event, so a pick adds no phase event to `MatchResult.events` and no tick.
11. **Replay and chaos:** `replay` / `restore` rebuild the same `levels` from the log, with no new code. The chaos end-of-run (a)4 check compares `levels` too (`"levels"` is the eighth key in its list; `undefined` on both sides when off).

## Draw order (exact; any pinned line below must be reproducible from this section alone)
- **Levelling off (every existing test, smoke and `npm run sim` match):** no draw is added anywhere. `createWorld` creates no `"levels"` rng, the `"match"` and `"pool"` streams are untouched, and the bus history is identical, so every base line stays byte-identical.
- **Levelling on:** offers draw only from `R = createRng(streamSeed(world.seed, "levels"))`, created once in `createWorld` after placement. Nothing else uses `R`. Per opened offer, with `key` the bar's pool key (the side id under `"side"`, the unit document id under `"unit"`) and `pool = Object.hasOwn(pools, key) ? pools[key] : []` (an inherited key such as `constructor` is no pool):
  ```
  cands = []                                   // pool order, first copy kept
  for a in pool: if a not in bar.abilities and a not in cands: cands.push(a)
  if cands.length <= offerSize: offer = cands  // NO draw (this covers pools of 0)
  else:
    for i in 0 .. offerSize-1:                 // exactly offerSize draws
      j = i + R.int(cands.length - i)          // R.int(n) = floor(R.next() * n)
      swap cands[i], cands[j]
    offer = cands[0 .. offerSize-1]            // the order shown is the drawn order
  ```
  Levels that are not offer levels draw nothing; a pick (`choose`) draws nothing by itself. Banked XP paid after a pick can open the next offer, which draws then. Example: seed 1, `offerSize` 3, pool `guard, charge, rally, cleave, ward` → `rally, charge, guard` and exactly three `next()` calls.
- **The levels smoke (below)** also draws through the existing streams, unchanged: placement (`"pool"`, as at the base) and the test bot `bot(seed)` (`"ai"`, two `next()` per unit asked, as at the base). The smoke's bot asks `picky(seed)`: under `"side"`, if its side's bar has a pending offer it first sends `{ type: "ChooseAbility", index: 0 }`; under `"unit"`, for each own unit with a pending offer, in budget order, `{ type: "ChooseAbility", unitId, index: 0 }` (no draw either way); then the `bot(seed)` inputs for the same budget. Under `"side"` the side's offers open in the order its moves land, so the same draws come in the same order on replay.

## Tests that prove it is done
Run: `npm test`. Common: `input()` and the bot match as in `scripts/sim.ts` (`seedless(input(stage, seed))`, `seatAll(world, sides, …, 200)`, `reachFarRow`, fuse 60000, maxRounds 40, maxSimMs 600000). `POOLS = { knight: ["guard", "charge", "rally", "cleave", "ward"], archer: ["volley", "snipe"], wolf: ["howl", "bite", "pounce", "maul"], player: ["guard", "charge", "rally", "cleave", "volley", "snipe"], wolves: ["howl", "bite", "pounce", "maul"], rival: ["howl", "screech"] }` (test data: unit-document keys for `"unit"`, side keys for `"side"`; no `bat` pool). `UNIT = { ...BTF_LEVEL_RULES, bar: "unit" }`. `QUICK = { bar: "unit", thresholds: [3, 4, 5, 6], offerLevels: [1, 2, 4], offerSize: 3, xp: { move: 2 } }` (test-only, so short matches reach per-unit offers; 2 XP a move so a hard-coded 1 is caught). Test titles start with the quoted words (QA's plants find tests by them); the rest of each title is yours.
- `tests/rules/levels.test.ts` (levels made with `createRng(streamSeed(seed, "levels"))` and an `emit` that records events)
  - "levels gain (step 18)…": `BTF_LEVEL_RULES` deep-equals the quoted value. `barOf({ id: "knight#1", unitId: "knight", side: "player" })` is `{ id: "player", pool: "player" }` under `BTF_LEVEL_RULES` and `{ id: "knight#1", pool: "knight" }` under `{ ...BTF_LEVEL_RULES, bar: "unit" }`. With the latter and pool knight = `POOLS.knight`: gain 16 → `{ xp 16, level 0, banked 0, offer null, abilities [] }`. Gain 1 → level 1, the offer is the Draw-order offer for seed 1, and one `level.reached` event. Gain 30 → banked 30. `choose(…, "nope")` → `false`, nothing changes. Choosing `offer[1]` → `true`; after it: level 3, xp 0, banked 6, abilities `[offer[1]]`, and 4 events in total (`level.unlocked`, `level.reached` 2 with offer `[]`, `level.reached` 3 with a three-ability offer that excludes the unlocked one). A wolf with no pool: gain 111 → level 8, xp 10; then gain 50 and gain 1 → level 9, xp 0, banked 0.
  - "offer draw order (step 18)…": rules `{ bar "unit", thresholds [1, 1, 1], offerLevels [1, 2, 3], offerSize 3, xp { move: 1 } }`. For seeds 1–3 the offer equals an independent re-implementation of the pseudo-code, and `rngState` equals a fresh stream after exactly 3 `next()` calls. Seed 1 is pinned: `["rally", "charge", "guard"]`. Pool archer `volley, snipe, volley` → `["volley", "snipe"]`. After `snipe` is unlocked → `["volley"]`. After `volley` → nothing pending, plus a level-3 event with `[]`. Unit docs `bat` (no pool) and `constructor` (inherited key) → `null`. `rngState` is unchanged throughout (no draw).
  - "createLevels refuses bad rules (step 18)…": bar `"team"`; thresholds `[]`, `[17, 0]` and `[1.5]`; offerLevels `[10]` and `[0]`; offerSize 0; xp.move −1 → the RangeError text. A pool that is not an array → `RangeError`. `gain(…, 1.5)` → the amount RangeError text.
- `tests/sim/levels.test.ts`
  - "levelling is off unless the match opts in (step 18)…": `levels` is `null`; no `levels` key in the snapshot; `level.reached` not registered. With levels on, both level events are registered and the snapshot's `levels.bars` is `[]`.
  - "levels smoke (step 18)…": for rules `btf-side` = `BTF_LEVEL_RULES`, `btf-unit` = `UNIT` and `quick-unit` = `QUICK`, stages stage-fixed (`player`, `wolves`) and stage-weighted (`player`, `rival`), seeds 1–20, `picky(seed)` seated on both sides. Per match: the number of `MOVE_DONE` in `result.events` equals the number of `move` entries in the log; bus history below 1024; `replay(src, log, tick)` gives the same `levels`; `restore(src, log, snapshot)` gives the same snapshot. `reached` counts `level.reached` events, `offers` the ones with a non-empty offer, `unlocked` the `level.unlocked` events, and `history` is the sha256 of `JSON.stringify` of the 20 bus histories (as `scripts/sim.ts`). Each line goes out through `t.diagnostic(line)`, and the six are pinned with one `assert.deepEqual`. The `btf-side` lines are real BTF levelling on the side bar (the 17-XP first level is reached in 18 of 20 stage-fixed matches); `btf-unit` shows the same numbers per unit rarely reach a level in these short matches:
    - `levels smoke btf-side stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 18 offers 17 unlocked 13 history 6b91cebadee3a4bfc960daecb92a6b51b673139250cbde83f5767b8cfda5fc53`
    - `levels smoke btf-side stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 64 offers 40 unlocked 40 history 3a58d03a4ee6980e394fe76d6343ca8bd5617151df6d099119c688a2f2592a64`
    - `levels smoke btf-unit stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 0 offers 0 unlocked 0 history f09905f4472d21fa7c0b7726eef350b9d9ba07704f44fcc0e5cf127b1d78d9af`
    - `levels smoke btf-unit stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 8 offers 6 unlocked 3 history 885c1a7b242dc260ea640021230ea04e0cd85322178ff3862eccdb49b851bd44`
    - `levels smoke quick-unit stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 283 offers 167 unlocked 151 history 5a8d757fd935d9b95e1b589b8b4a5c672bfcaaf2cba0f914314715eff53f448d`
    - `levels smoke quick-unit stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 320 offers 160 unlocked 160 history ac883a9882f1a8c8315c666be603a697603aa466134a5e2f88be9503e03bcd30`
  - "the chaos checks hold with levelling on…": stage-weighted seeds 1–5, once with `QUICK` and once with `BTF_LEVEL_RULES` (side bar), `runChaos` with `CHAOS_CHECKS` and `picky(seed)` → failure `null`; `replayChaos` of the JSON-copied run deep-equals the result.
  - "a pick through the door (step 18)…": stage-fixed with levels on (`UNIT`), phase `idle`, `levels.gain("knight#1", "knight", 17)`. A `ChooseAbility` with index 1 gives reject `null`, event `null`, the quoted `unlock` action (`id` `m1`, `effects [offer[1]]`), and phase `idle`. abilities `[offer[1]]`, `lastSeq` 1, one `level.unlocked` record. `replay(src, log, 0)` ends its notices with `unlockFailed` (that log's pick had no offer in replay).
  - "the side bar (step 18)…": stage-fixed with `BTF_LEVEL_RULES`, phase `idle`. The player seat moves `knight#1` to (0, 7), then `archer#2` to (1, 7): the snapshot's `levels.bars` is exactly `[{ id: "player", xp: 2, level 0, banked 0, offer null, abilities [] }]` (two units, one bar). `levels.gain("player", "player", 15)` opens a 3-ability offer. The wolves seat's `{ ChooseAbility, index 0 }` → `noOffer`; the player's index 3 → `badPick`. The player's `{ ChooseAbility, unitId: "wolf#3", index: 2 }` (a foe's unit id, not read) → reject `null`, action `actor` `"player"`, `effects [offer[2]]`; the player's offer is then `null` and the side's `abilities` are `[offer[2]]`.
  - "a disposed levelling world refuses the pick…" (`UNIT`): after `disposeWorld`, a valid pick gives `disposed`, action `null`, the offer is kept and `lastSeq` is 0.
- `tests/sim/bot.test.ts` "every reject reason is reached…": the world is made with levels on (`{ ...BTF_LEVEL_RULES, bar: "unit" }`, pool knight `["guard", "ward"]`) and `levels.gain("knight#1", "knight", 17)` before `kept`. The fingerprint also holds `snapshot(world).levels`. After the `malformed` feed, it feeds `ChooseAbility` for `archer#2` (no offer) → `noOffer`, `wolf#3` → `notOwn`, `ghost#9` → `noUnit`, and `knight#1` with index 2 and 0.5 → `badPick` (twice). Then the step-17 `disposed`. `listed` has ten reasons; history 16.
- `tests/sim/gc.test.ts` (step-17 build-B fix): `arm` also adds `clock.onRender(pin)` **before** dispose, next to `onTick`. Before this, a planted "clock dispose keeps render subscribers" leak passed the GC test (QA evidence `/tmp/s17v-plants-B.log`, M1). Now the GC test fails on it.
- Unchanged (byte-identical): `npm run sim` prints the base's two lines; the four chaos smoke lines and the six exploit smoke lines are as at the base (step 16 "Tests").

## How a planted bug is caught (for QA; prototype `34e0979` on `573ae0c`; reverted after each; `/tmp/s18-plants.sh` on the Architect's box)
Each plant is an **intent**; the script holds the prototype's example patch. On the build, QA adapts the patch text to that build's code (same intent, same expected failing tests). A "plant text not found" line means "adapt it", not "passed".
| Plant (one edit; intent) | Tests that fail (of 214), by title prefix |
|---|---|
| a landed move pays no XP (+ side bar) / a failed move pays XP too / the move pays 1 whatever `xp.move` says / offers drawn from the match rng | levels smoke |
| XP during an offer is lost, not banked / banked XP not paid after the pick / every level opens an offer / no top-level cap / `choose` accepts an ability not offered | levels gain |
| draw `j` over the whole list / a draw although the pool fits / an unlocked ability offered again / pool duplicates offered / an inherited key read as a pool | offer draw order (+ levels smoke, levels gain for the first; levels gain for the third) |
| bad rules accepted | createLevels refuses bad rules |
| no level registry / levelling always on / the snapshot drops `levels` / the snapshot always has a `levels` key | levelling is off (+ smoke, chaos, door for the first; door for the third) |
| a foreign unit's pick accepted / index off by one / fractional index accepted / a refused pick not kept in history | every reject |
| the pick read before the disposed check / the pick a timed action / a replayed no-offer pick silent / the driver lands a pick like a move | disposed / door / door / levels smoke |
| BTF thresholds changed (doc curve) / BTF offer levels include 2, 5, 8 | levels gain |
| the side bar ignored (every bar a unit bar) | levels gain, side bar, levels smoke |
| the side bar draws from the unit document's pool | levels smoke |
| a side pick reads `unitId` (a foe's unit id names the foe's bar) | side bar |
| the unit checks (`noUnit`) run under side too | side bar, levels smoke |
| an unknown `bar` value accepted | createLevels refuses bad rules |
| the BTF preset uses the unit bar | levels gain, levels smoke |
| clock dispose keeps render subscribers (step-17 build-B miss) | GC (and clock dispose, as before) |

All 36 test plants fail at least one named test (`/tmp/s18-plants.log`: 36/36). Grep plants (caught by Acceptance): `ChooseAbility` added to the runtime `Intent` (M7); `gain(…, 1)` instead of `rules.xp.move`; `actions.ts` paying `action.actor` without `levels.barOf`; the `bar` field dropped from `LevelRules`; `Math.random` in the draw; an extra file; `core-types.ts` touched; the driver names the pick kind; the snapshot key unconditional; the match stream used for offers; a state-table row added; the GC fix reverted; `"levels"` dropped from the chaos keys; the mechanism copied into `src/core`; `src/sim` importing `btf-adapters`; a `phase` word in `src/rules/levels`.

## Example
```ts
const world = createWorld({ ...input, levels: { rules: BTF_LEVEL_RULES, pools: project.abilityPools } }); // omit `levels` = off
// … the player side's 17th landed move (any of its units): bus "level.reached" { unit: "player", level: 1, offer: [a, b, c] } (three of pools.player, drawn as in "Draw order")
player.feed({ type: "ChooseAbility", index: 0 });  // logs { kind: "unlock", actor: "player", effects: [a] }
world.levels?.state();   // { rngState, bars: [{ id: "player", xp: 0, level: 1, banked: 0, offer: null, abilities: [a] }, …] }
// with rules { ...BTF_LEVEL_RULES, bar: "unit" } and pools by unit document: one bar per unit, picked with { type: "ChooseAbility", unitId: "knight#1", index: 0 }
```

## How later steps use this (context only; do not build)
- The unit action menu (Move / Attack / Ability / Item / Wait, outline) lists `abilities` of the unit's bar (`levels.barOf(unit)`: the side's under "side") from `levels.state()` as its unlocked abilities; casting one is a later `ability` action (M9: menu and cards submit the same payload).
- The card-hand add-on gives the same offer as cards (`level_card_offer_levels`, same thresholds and levels); it reads `level.reached` and submits the same `unlock`. Other variants (ahead/behind sheets at 2, 5 and 8, PvP-kill levels, bot unit-pair unlocks at 3, 6 and 9) are new data or new rules modules on the same counter.
- Kills and basic attacks add `LevelRules.xp` keys when those actions land (behaviour-library `xp_kill_unit` 5, `xp_kill_summon` 2, `xp_basic` 1).
- QA may add the levels invariants (picks only from the pending offer; levels round-trip) to `docs/qa/chaos-player-invariants.md`, and `noOffer` / `badPick` to (a)9's list (QA-owned). The exploit hunter may add a hostile-pick kind later; the existing generators send no pick, so their pinned lines stay.

## Decisions note: what to name
- Why the mechanism lives in `src/rules/levels` (not core, not sim), and why the events are mode events added by declaration merging.
- Why a landed move is the only XP source and why XP is paid in `apply` (replay pays the same).
- Why the pick is an intent at the one door but is logged as an `unlock` action carrying the ability id, why it has no state-table event and no landing, and why a bad logged unlock is a notice.
- How `bar` is read in one place (`barOf`, and the door's side check), what the side owns under `"side"` (bar, offer, pick, unlock; `unitId` not read), and how your tests cover both modes.
- How off stays byte-identical (no rng, no registry, no snapshot key) and how you checked it (the ten base lines plus `npm run sim`).
- The draw order, as you built it, and how your test re-derives it.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
Values only; the code is a rewrite (BTF's offers come from `Math.random`: `chess/game/towerRun.ts:746-754` `shuffle`, `:672-677` `draftLevelCards` → `shuffle(pool).slice(0, 3)`; TileEngine draws from its seeded `"levels"` stream instead).
- Thresholds and top level: `chess/game/towerXp.ts:11` `XP_AT = [17, 11, 13, 11, 13, 14, 11, 11, 11]`, `:16` `LEVEL_CAP = 9`, `:13-15` `xpNeed`. The doc `docs/MATCH_LEVELS.md:5` says 13, 10, 11, 12, 13, …, which is out of date; code wins (CoS v1 rule 2026-11-10; behaviour-library `gaps.md:29-31`).
- XP per move: `towerXp.ts:1` ("A move is one point"), `:106`; `components/game/TowerScreen.tsx:530` (`noteFightXp()` after one own step); `MATCH_LEVELS.md:9`.
- Banking while a choice is open and the top-level drop: `towerXp.ts:107-134` (`noteFightXp`), `:231-251` (`closeFightXp`), and the server bar `:879-906` (`notePvpKill`), `:930-945` (`drainPvp`). The server pick is accepted only if it was offered: `:954-961` (`acceptPvpDraft`). An empty draft opens nothing: `:922-926`.
- Offer levels and size: `MATCH_LEVELS.md:18-23` (three cards at levels 1, 3, 4, 6, 7, 9) and `:29-31` (2, 5 and 8 are the ahead/behind sheet); `towerXp.ts:920-921` (`tideOffer` else `draftLevelCards`); `towerRun.ts:676` (`slice(0, 3)`). The behaviour library's card-free form is `xp-levels.ability_unlock_levels` 1, 3, 4, 6, 7, 9 and `unlock_pick_count` 3 (CEO 2026-11-10; `CATALOGUE.md:454-455`).
- The side bar (`BTF_LEVEL_RULES.bar: "side"`): `towerXp.ts:20-21` (one `xp` / `level` for the player), `:800-806` (one `PvpBar` per side), `:879-906` (`notePvpKill(side)` fills that side's bar); `TowerScreen.tsx:530` (every own step); the offer from the side's own deck `TowerScreen.tsx:206-215` (`liveKinds("you")`), `MATCH_LEVELS.md:18`; the pick to the side's hand `scripts/seat-board.ts:372-374` (`acceptPvpDraft("angel", kind)`, `returnToHand("angel", kind)`).
- Contrast only, not scope: Portal pays talent points for kills, spent between runs (`/workspace/portal/src/portal/STAGES.md:19`). That is meta-progression, not in-match levelling.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/runtime/**`, `src/project/**`, `src/fx/**`, `src/rules/turns/**`, `src/index.ts`, `src/btf-adapters/src/{fx-preset,lane-labels,stage-limits}.ts`, `src/sim/{intents,chaos-gen,shrink,exploit,exploit-docs,dispose,driver-tick}.ts`.
- `tests/fixtures/**` and every test and helper not in the file list (`tests/sim/{ai,seats,input}.ts` included).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 214; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos smoke lines and the six exploit smoke lines are as at the base; the six levels smoke lines are as in "Tests".
- [ ] `npm run check:state` / `check:law` print OK; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts package.json` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628`, `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`; `git diff <base>..<head> -- BUILD_GUIDE.md docs src/state src/core src/runtime src/project src/fx scripts` is empty.
- [ ] Names: the `LevelRules` (with `bar: "side" | "unit"` first), `LevelSetup`, `ChooseAbility` and `BTF_LEVEL_RULES` lines as quoted; `createLevels(setup: LevelSetup, rng: Rng, emit: …)`; the two `level.*` keys inside one `declare module "../../types/core-types.ts"`; `readonly levels?: LevelSetup;`, `readonly levels: Levels | null;` and `readonly levels?: LevelsState;` once each in `src/sim/types.ts`; `PlayerReject` has ten reasons ending `"noOffer" | "badPick"`; `world.ts` uses `streamSeed(seed, "levels")` and `createBus(clock, input.levels === undefined ? undefined : LEVEL_EVENTS, input.busLimits)`; `actions.ts` pays `levels.gain(bar.id, bar.pool, world.levels.rules.xp.move)` with `bar` from one `levels.barOf(`; `levels.ts` reads `rules.bar === "side" ?` once (in `barOf`); `player.ts` submits `kind: "unlock"`; `chaos.ts`'s key list ends `"logSeq", "levels"`.
- [ ] Numbers are data: `rg -n --pcre2 '\b17\s*,\s*11\b|offerSize\s*[:=]\s*\d|thresholds\s*[:=]\s*\[|offerLevels\s*[:=]\s*\[|move\s*:\s*\d|\b(top|cap)\s*=\s*\d' src/rules/levels src/sim` nothing; `rg -l BTF_LEVEL_RULES src` lists only the two `src/btf-adapters/src` files; `rg -n --pcre2 "from ['\"][^'\"]*/btf-adapters/" src/sim src/rules` nothing.
- [ ] One rng: `rg -n --pcre2 '\bMath\.random\b|createRng|streamSeed' src/rules/levels` nothing; one `rng.int(` (and no other `rng.` draw) in `src/rules/levels/levels.ts`.
- [ ] The door: `rg -l ChooseAbility src` lists exactly `src/sim/index.ts`, `src/sim/player.ts`, `src/sim/types.ts` (none in `src/runtime`); `rg -n 'ChooseAbility|unlock|levels' src/sim/driver-phase.ts src/sim/driver-tick.ts` nothing; two `submit(` in `player.ts` (the move and the pick); `rg -n -i --pcre2 '\b(bot|online|peer|remote|human|touch|chaos|network|exploit|hostile|wire)\b' src/sim/driver-phase.ts src/sim/player.ts src/rules/levels` nothing.
- [ ] Off means off: the snapshot key is spread only when `world.levels !== null` (`...(world.levels === null ? {} : { levels: … })` in `run.ts`).
- [ ] GC fix: two `clock.onRender(` in `tests/sim/gc.test.ts` (one before dispose).
- [ ] Laws hold: no `Date|performance.now|setTimeout|setInterval|setImmediate|queueMicrotask|requestAnimationFrame`, `createHash|crypto.|process.` or `node:` imports in `src`; no rules words (`hp|maxhp|mana|cost|damage|deck|cards?|stats?|gold|currency|reward`) in `src/sim`, `src/runtime`, `src/rules/levels`, `src/btf-adapters/src/levels.ts`; no side literals in `src/sim` or `src/rules`; no `phase` word in `src/rules/levels`; nothing imports sim.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 17 files of the file list (`A` for the six created, `M` for the rest); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-18-card-free-levelling/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- What an unlocked ability *does* (casting, targets, menu entries), the card-hand form, the ahead/behind sheets at 2, 5 and 8, PvP-kill levels, bot unit-pair unlocks, XP for kills, basic attacks, contests or portals.
- Pausing the match while a pick is open, pick timers, auto-picks (the host's or a later rule's choice). Carrying levels between levels or matches (save/session, later).
- Reading pools or level rules from project documents (the reader and DSK's catalogue ids: later); a hostile-pick exploit kind; editing `docs/qa/chaos-player-invariants.md` (QA) or the outline (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, saves; any change to the command log format, the state tables or the gesture intents.
