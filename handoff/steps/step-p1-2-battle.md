# step-p1-2-battle: Phase 1 P1-2 "Battle state + the rules hook" (foundation-plan-phased.md r3). An optional `world.rules` hook (like `world.levels`) takes the sim's `ability` and `interact` actions; `unit-roster` gives each unit instance HP and attack, `damage-resolution` is a plain subtract, a unit at 0 HP dies and leaves the board in the same step, `win-condition` wipe is a `VictoryRule`, and the rules state rides in an optional `snapshot.rules` (match-save stays v1). Pure rules code in `src/rules/battle/` plus a small sim hook and BTF battle defaults as data; no core, format, log, save-format or catalogue change.

Step id: step-p1-2-battle          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: `6cd8fa25734bbe70a1063bc4f58f86a17a5f5513` (current main: P1-1 Walk merged as `7dde2f22`, PR #61, then the QA P1-1 build review `6cd8fa25`; also holds B1 `9ebb9413`, PR #60, and the B1 merged doc + foundation STATUS `5cb385ba`. Base floor **882/0** = main's count). P1-1 is on main, so the builder stacks this step's `BTF_BATTLE_DEFAULTS` export in `src/btf-adapters/src/index.ts` next to P1-1's `BTF_MOVE_DEFAULTS` (append battle after move). Branch: `step/step-p1-2-battle-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. If B1 is not on main when you start (`src/rules/behaviours/registry.ts` with `installOne` is missing), **stop and report**. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Delivery (CN-003): `git bundle create step-p1-2-battle-r<N>-chatA.bundle <Base>..step/step-p1-2-battle-r<N>-chatA`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
It switches to CN-028 git branches once the builder token exists.
Hand-back location: `handback/step-p1-2-battle/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: B1 (merged): `src/rules/behaviours` (`BehaviourDef`, `KnobSpec`, `installOne`, L3/L4 per-unit layers, L5 HP); step-04 `core/unit` (`Units`, `remove` at `units.ts:86`); step-06 `core/targeting` (`resolveAim`); step-07 `core/events` (mode events); step-09 `sim/world.ts`, `sim/actions.ts`, `sim/run.ts` (`snapshot`, `restore`); step-18 `rules/levels` (the `world.levels` pattern); step-24 match-save v1. P1-1 is on main (merge `7dde2f22`); this step still must not import its files (`src/rules/move/`, `btf-defaults/move.ts`) — only stack the `index.ts` export next to P1-1's.
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green); `handoff/steps/step-b1-behaviour-runtime.md` (behaviours, knobs, layers, L5); `foundation-plan-phased.md` r3 P1-2; `handoff/dsk-rulings/2026-11-17-phase1.md` D1 and D7 (sha256 `58cf837c…`; D1: `snapshot.rules`, no CN, compare only when present; D7: `hitRefused` with a `reason`, L5 damage warns until P1-4); `docs/qa/step-p1-2-review.md` (sha256 `6cf7772e…`, QA's r1 review); `docs/qa/step-p1-2-r2-review.md` (sha256 `7f0db06d…`, QA's r2 review); `handoff/steps/step-p1-1-walk.md` § Not in this step (the 0-HP removal carry).
Kit: kit-1 **r3**, 2026-11-17 (r2 + QA r2 review: pin M1 `battle-qa-r2.test.ts`, wording S1 table indent, report-only R1–R2). Engine Architect. Proto `/tmp/p1-2` branch `p1-2-r3-on-main`, head **`b964b7bf`** (`b964b7bf791bf55ac11935318e056c48aefb2dc5`, tree `377c752f`), 7 commits replayed onto main `6cd8fa25` (the same 7 as `p1-2-r3` `849caa73` / tree `df7b14e5` on `5cb385ba`): r1's 4, D7 `553c0b7`, QA's r1 pin, and QA's r2 pin `b964b7bf` adopted byte-identical. Rebase had the expected one-line conflict in `src/btf-adapters/src/index.ts`; both exports were kept (P1-1 `BTF_MOVE_DEFAULTS` then P1-2 `BTF_BATTLE_DEFAULTS`). `src/sim/types.ts` merged cleanly (Battle import after `fuse`, P1-1 `StepRule` after `levels`). G-TileEngine noreply author and committer. 16 files, +378/−4 = **382 changed lines** (src 174, tests 208) vs `6cd8fa25`. Green **903/0** (main's count + 21: 882 + 16 battle tests + 3 QA r1 pin tests + 1 parity + 1 QA r2 pin test). The pre-rebase proto `p1-2-r3` is **895/0** on `5cb385ba`. EA plants **60/60** (`p1-2-plants.py` + list `p1-2-plants-list.py`), QA r1 plants **17/17** (`qa-p1-2-plants.py`). Bundle backup `/workspace/share/step-p1-2-proto-r3-on-main.bundle` (sha256 `bd1f47fe…`; also `step-p1-2-proto-r3.bundle` of `p1-2-r3` on `5cb385ba`, `adfbc1bf…`; r2: `step-p1-2-proto-r2.bundle`, `98904b7c…`; r1: `step-p1-2-proto-r1.bundle`, `da74d264…`).
Carries: see § Not in this step. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change, no log or save format change, no CN, no migration, no catalogue edit.** Five new rules files, `src/btf-adapters/src/btf-defaults/battle.ts`, one export in `src/btf-adapters/src/index.ts`, and five small `src/sim` edits; deps **133 / 432** on `6cd8fa25` + this step (on `5cb385ba` it was 122 / 391 → 128 / 415); the depcruise config is unchanged and passes (rules import only core, types, state and rules, never btf-adapters, so the numbers stay in the KnobSpecs and the parity test asserts they equal `BTF_BATTLE_DEFAULTS`; sim imports rules).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Prerequisites (status at kit r3 time; EA checked, not assumed)
- **CEO 01:31 (via CoS):** the 9-step Phase 1 in `foundation-plan-phased.md` r3, built engine-native: every rule is a behaviour that reads B1's settings; BTF supplies proven numbers and defaults only, never copied code. **CEO ~01:33:** one builder (ChatA) and one QA review per step, plus a rework round if QA finds must-fixes.
- **B1 merged** on main (merge `9ebb9413`, still present at `6cd8fa25`); this step installs its three behaviours through B1's `installOne`. If B1 is not on main when you start, **stop and report**.
- **P1-1 merged** on main `7dde2f22` (PR #61); the QA P1-1 build review is `6cd8fa25`. The builder starts from that main and stacks the battle export next to P1-1's move export.
- **Catalogue rev 28** (`behaviours.json` sha256 `e182b094…`): `unit-roster` has `unit_hp` (slider 1–21, default 9, per unit) and `unit_atk` (slider 0–2, default 1, per unit); `damage-resolution` has `hit_class` (basic | spell | arrow, default basic); `win-condition` has `wipe_wins` (default true) and `mutual_wipe` (draw | last-actor-loses, default draw). None of the three is in `phase1_freeze` or B1's generated slice (`catalogue.ts`, rev 26), so, as in P1-1, P1-2 carries local KnobSpecs and does not edit `catalogue.ts` (carry for the Librarian).
- **DSK D1** (`handoff/dsk-rulings/2026-11-17-phase1.md`): `snapshot.rules` optional, HP and alive per instance, match-save v1, no CN; old saves rebuild it by replay; the snapshot check compares `rules` only when present.
- **DSK D7** (same file, sha256 `58cf837c…`): `hitRefused` is OK as one code with the cause in a `reason` detail (`unknownActor | deadActor | notUnitAim | aimMissed | selfTarget | deadTarget`); later actions follow the same pattern, `<action>Refused` + `reason` (P1-3: `interactRefused`). L5 `difficulty.damage` may wait for P1-4 only if it warns: a resolved difficulty with `damage ≠ 1` emits `layerNotApplied` (detail `L5 difficulty.damage`). No CN, no format change (notices are not saved).
- **QA r1 review** (`docs/qa/step-p1-2-review.md`, sha256 `6cf7772e…`): M1 = ship QA's pin `tests/rules/battle-qa.test.ts` byte-identical (adopted in r2); S1–S2 wording and R1–R4 report-only items are in rulings 5 and 10 and § Not in this step. Decision 1 answered: OK.
- **QA r2 review** (`docs/qa/step-p1-2-r2-review.md`, sha256 `7f0db06d…`): M1 = ship QA's pin `tests/rules/battle-qa-r2.test.ts` byte-identical (adopted in r3; D7 actor-before-aim precedence and the frozen reason list); S1 = indent the ruling 5 table separator; R1–R2 report-only (installDamage may warn for NaN or undefined, which is fine; a raw `installSetups` caller would skip the L5 note — P1-4).

## Goal
Today the sim notes `actionUnsupported` for every `ability` and `interact` action, units have no HP or attack, and nothing ends a match by a wipe. After this step (rules logic in `src/rules/battle/`, testable in Node):
1. **`world.rules` hook (opt-in, like `world.levels`):** `SimInput.rules?: BattleSetup` builds `world.rules`; the sim hands every `ability` and `interact` action to it. Without it both stay `actionUnsupported`, the bus registers nothing new and snapshots are byte-identical to today.
2. **`unit-roster` reads its settings:** `unit_hp` (default 9) and `unit_atk` (default 1) per unit document through B1's layers (L3/L4 per unit, L5 HP); BTF's per-class numbers (warrior 9/1, archer 6/2, mage 6/2, cleric 5/1) are L3 values.
3. **A hit is a plain subtract:** an `ability` with no effects and a UNIT aim takes the attacker's `atk` off the target's HP (floor 0) and emits `hit`; `damage-resolution`'s `hit_class` rides on the event. No guards or shields yet.
4. **Death in the same step (QA's P1-1 carry):** at 0 HP the unit is `remove`d at once (`alive: false`, off its cell, via `units.ts:86`) and `unit.died` is emitted, so a walk or `targetsFor` never sees a dead body.
5. **`win-condition` wipe as a `VictoryRule`:** from `sides[0]`'s view, a side with no living unit loses; both wiped is a draw (or, under `last-actor-loses`, the side that just acted loses); neutral units never count.
6. **`snapshot.rules`:** HP and alive per unit instance, only when `world.rules` is set. Match-save stays v1 (no CN, no migration); a saved snapshot without `rules` is rebuilt by replay and checked without it (DSK D1).

## Rulings (r2)
1. **Place.** New folder `src/rules/battle/`: `roster.ts`, `damage.ts`, `win.ts`, `battle.ts`, `index.ts`. They import only `src/types`, `src/core` (events, grid, log, notice, plain, targeting, unit), `src/state` (the `Outcome` type) and `src/rules/behaviours` (types). No game rule enters `src/core` or `src/sim`: the sim only delegates and stores the state the hook gives it. New `src/btf-adapters/src/btf-defaults/battle.ts` holds the proven BTF numbers as data with file:line cites (towerChess.ts:92 HP; towerChess.ts:926-937 opening `ad`; towerStrike.ts:33-35 class damage, :214-219 cleric 1; towerStrike.ts:515 `Math.max(0, hp - dmg)`, :518 death at `hp <= 0`; towerChess.ts:1745-1752 `judgeBoard()`), checked read-only, no git, no copied code. Depcruise `rules-below-runtime` forbids `src/rules` → `src/btf-adapters`, so the numbers stay in the KnobSpecs and `tests/parity/battle.parity.test.ts` asserts they equal `BTF_BATTLE_DEFAULTS`. This step must not depend on P1-1's files (`src/rules/move/`, `btf-defaults/move.ts`), which are now on main: do not import them; only stack the `index.ts` export next to P1-1's.
2. **Local KnobSpecs (catalogue rev 28 values; the generated slice has none of these three, as with `step-pattern` in P1-1), frozen, in this order:**
   - `UNIT_ROSTER_KNOBS`: `unit_hp` slider 1–21 step 1, default 9, `perUnit`, `l5: "hp"`; `unit_atk` slider 0–2 step 1, default 1, `perUnit`. The other roster knobs (`board_cols`, `board_rows`, `piece_count`, `opening_row`, `clip_cues`, `team_colour`) are left out; an answer for one warns `unknownKnob` (B1).
   - `DAMAGE_RESOLUTION_KNOBS`: `hit_class` picker `basic` | `spell` | `arrow`, default `basic`. `zero_damage_pops_guard` and `allow_reorder` are left out (no guards yet).
   - `WIN_CONDITION_KNOBS`: `wipe_wins` toggle, default true; `mutual_wipe` picker `draw` | `last-actor-loses`, default `draw`. The clock, tiebreak and count knobs are left out.
3. **Installs.** `UNIT_ROSTER` (`BehaviourDef<UnitStats | null>`, id `unit-roster`): `unit_hp` not a whole number ≥ 1 → `k.unsupported("unit_hp", "<v> is not a whole number ≥ 1")`, `null`; `unit_atk` not a whole number ≥ 0 → `k.unsupported("unit_atk", "<v> is not a whole number ≥ 0")`, `null`; else frozen `{ hp, atk }`. `DAMAGE_RESOLUTION` (`BehaviourDef<DamageRule>`): frozen `{ hitClass }`. The host installs it with **`installDamage(layers, ctx?)`** (`damage.ts`, DSK D7): B1's `installOne(DAMAGE_RESOLUTION, layers, ctx)`, and when `ctx.difficulty` has its own `damage` key whose value is not `1`, the result is re-frozen with one `{ code: "layerNotApplied", message: "L5 difficulty.damage" }` appended after B1's notes (once per install; `out` unchanged, so damage plays as ×1). `DamageCtx` = `InstallCtx` whose `difficulty` may carry `damage`; B1 (`src/rules/behaviours`) is not edited and does not read `damage`. `WIN_CONDITION` (`BehaviourDef<WinRule>`): frozen `{ wipe, mutual }`. The host installs `unit-roster` once with no unit layer (`base`) and once per unit document with its L3/L4 layers (`stats[unitId]`), and passes the plain `BattleSetup` as `SimInput.rules` (like `LevelRules` from `xp-levels`).
4. **`createBattle(setup, units, grid, emit)`** (`battle.ts`): `plainCopy`s the setup; a `base` or `stats` entry that is not `{ hp: whole ≥ 1, atk: whole ≥ 0 }`, a `stats` that is not a record or an unknown `hitClass` → `RangeError("createBattle: bad setup")`. HP starts at `stats[unit.unitId] ?? base` for every unit placed at world creation.
5. **`act(action)`:** returns `null` when done, or a `Notice` the sim notes (nothing changed):
   - `kind !== "ability"` (e.g. `interact`, P1-3) or `effects.length > 0` (spells, P1-4) → `{ code: "actionUnsupported", message: "action unsupported" }`.
   - Else a refusal is one code with the cause in `reason` (DSK D7; `HitRefused` = `Notice & { code: "hitRefused"; reason }`, message `hit refused (<reason>)`), checked in this order:
     | `reason` | when |
     |---|---|
     | `unknownActor` | `units.get(actor)` is undefined |
     | `deadActor` | the actor is not alive |
     | `notUnitAim` | `target` is null or a TILE aim |
     | `aimMissed` | `resolveAim` misses and the aimed id is unknown, or the fallback spot is off the map |
     | `selfTarget` | the resolved unit is the actor |
     | `deadTarget` | `resolveAim` misses with `dead` and the aimed unit exists but is dead (no living unit at its fallback spot) |
     `HIT_REFUSED_REASONS` lists the six in this order (frozen). The pattern for later actions is `<action>Refused` with a `reason` (P1-3: `interactRefused`).
   - **Fallback aims (QA S2, carry to P1-3):** a UNIT aim with `fallbackAt` on a dead target hits whoever stands on the fallback spot (core UNIT-pipe semantics, step-06); P1-3 builds aims without a fallback or decides that deliberately.
   - Else `amount = atk of the actor's unit document`, `hp = max(0, hp − amount)`, emit `hit { unit, by, amount, hp, hitClass }`; at 0, `units.remove(target)` then emit `unit.died { unit, by }`. **QA S1:** a `hit` listener at a kill sees `hp: 0` while the body is still alive on its cell (`remove` and `unit.died` follow in the same step); react to deaths on `unit.died`, never on `hit.hp === 0`. `amount` is always the actor's `atk` (an overkill reports `atk`, `hp` floors at 0); `atk` 0 is a hit of amount 0 that never kills.
   - **Decision 1:** no range, side or adjacency check here: P1-3 picks targets through `targetsFor` and owns those filters. The hook trusts the logged action like `move` does.
6. **`state()`** → `{ units: [{ id, hp, alive }] }` in `units.all()` order (dead units stay, `hp: 0, alive: false`). Whole numbers ≥ 0 only (§6.9 number rules; `max(0, …)` never gives −0).
7. **`wipeRule(win, sides)`** (`win.ts`) returns a function structurally assignable to the sim's `VictoryRule` (rules may not import `src/sim`): `wipe` false → always `null`; count living units whose side is in `sides` (`sides[0]` = ours, the rest = theirs); both > 0 → `null`; both 0 → `"draw"`, or under `last-actor-loses` `"lose"` when `at.side === sides[0]` else `"win"`; else ours 0 → `"lose"`, theirs 0 → `"win"`.
8. **Sim (only these five files):**
   - `types.ts`: `SimInput.rules?: BattleSetup`; `SimWorld.rules: Battle | null`; `SimSnapshot.rules?: BattleState`.
   - `world.ts`: `createBattle` after the placements (like `createLevels`). The bus registry is unchanged without rules; with rules it is `{ mode: "battle", types: [level types if levels, "hit", "unit.died"] }`.
   - `actions.ts`: in `apply`, before the final `actionUnsupported`: `ability`/`interact` with `world.rules` set → `act`, note a returned notice.
   - `run.ts`: `snapshot` adds `rules` last, only with `world.rules`; `restore` compares `rules` only when the saved snapshot has the key (**decision 2**, DSK D1).
   - `chaos.ts`: `"rules"` joins the chaos `KEYS` (replay-vs-live compare) so a later chaos run with rules checks it.
9. **Events:** `hit` and `unit.died` are mode events (augmenting `ModeEventMap` in `battle.ts`, like `level.reached`). No core event, log or format change.
10. **QA report-only (recorded, no change):** R1 knob values out of range are kept with B1's `outOfRange` note, not clamped; only `createBattle` bounds them (hp ≥ 1, atk ≥ 0). R2 a save without `rules` loads and HP is rebuilt by replay (decision 2). R3 `wipeRule` is wired into no driver until P1-6. R4 carries: chaos `rules` key (and its plant) → P1-5; target, range and side filters and `interact` → P1-3; `exploit.ts:75` → P1-5 (from P1-1).

## Open questions (answered for r2)
- **QA:** decision 1 (no range/side check in the hook until P1-3): **OK** (QA r1 review §7.1).
- **DSK:** `hitRefused`: **OK, with a `reason` detail** (D7.1, ruling 5).
- **DSK:** L5 `difficulty.damage`: **P1-4, with a `layerNotApplied` warning meanwhile** (D7.2, ruling 3).

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/rules/battle/battle.ts` | new: `BATTLE_EVENTS`, `BattleSetup`, `BattleState`, `HIT_REFUSED_REASONS`, `HitRefusedReason`, `HitRefused`, `Battle`, `createBattle`, the event types (rulings 4–6, 9) | 56 | 60 |
| `src/rules/battle/roster.ts` | new: `UNIT_ROSTER_KNOBS`, `UnitStats`, `UNIT_ROSTER` (rulings 2–3) | 22 | 26 |
| `src/rules/battle/damage.ts` | new: `HIT_CLASSES`, `HitClass`, `DAMAGE_RESOLUTION_KNOBS`, `DamageRule`, `DAMAGE_RESOLUTION`, `DamageCtx`, `installDamage` (ruling 3) | 24 | 26 |
| `src/rules/battle/win.ts` | new: `WIN_CONDITION_KNOBS`, `WinRule`, `WIN_CONDITION`, `wipeRule` (ruling 7) | 28 | 32 |
| `src/rules/battle/index.ts` | new: exports | 4 | 5 |
| `src/sim/types.ts` | `SimInput.rules`, `SimWorld.rules`, `SimSnapshot.rules` (ruling 8) | 6 | 8 |
| `src/sim/world.ts` | the bus registry and `createBattle` (ruling 8) | 7 | 9 |
| `src/sim/actions.ts` | delegate `ability`/`interact` (ruling 8) | 1 | 2 |
| `src/sim/run.ts` | `snapshot.rules`; `restore` compares it only when present (ruling 8) | 4 | 5 |
| `src/sim/chaos.ts` | `"rules"` in `KEYS` | 2 | 2 |
| `src/btf-adapters/src/btf-defaults/battle.ts` | new: `BTF_BATTLE_DEFAULTS` (ruling 1) | 19 | 22 |
| `src/btf-adapters/src/index.ts` | one export of `BTF_BATTLE_DEFAULTS`, appended as the last line | 1 | 2 |
| `tests/rules/battle.test.ts` | new, shipped (16 tests), byte-identical | 129 | 129 |
| `tests/rules/battle-qa.test.ts` | new, shipped (3 tests, QA pin `87e4e3ac`), byte-identical | 37 | 37 |
| `tests/parity/battle.parity.test.ts` | new, shipped (1 test), byte-identical | 23 | 23 |
| `tests/rules/battle-qa-r2.test.ts` | new, shipped (1 test, QA r2 pin `849caa73`), byte-identical | 19 | 19 |
Total ≤ 385 changed lines (proto **382**: src 174, tests 208). Over the usual 320 because r2 adds DSK D7 (+20 src: six refusal reasons and the L5 warning; +28 tests: one table row per reason and the warning test), QA's r1 M1 pin (+37 tests), and QA's r2 M1 pin (+19 tests); src alone is 174. Still under the 400 hard line.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// roster.ts
export const UNIT_ROSTER_KNOBS: readonly KnobSpec[];   // [unit_hp, unit_atk], frozen
export type UnitStats = { readonly hp: number; readonly atk: number };
export const UNIT_ROSTER: BehaviourDef<UnitStats | null>;
// damage.ts
export const HIT_CLASSES: readonly ["basic", "spell", "arrow"];   // frozen
export type HitClass = (typeof HIT_CLASSES)[number];
export const DAMAGE_RESOLUTION_KNOBS: readonly KnobSpec[];   // [hit_class], frozen
export type DamageRule = { readonly hitClass: HitClass };
export const DAMAGE_RESOLUTION: BehaviourDef<DamageRule>;
export type DamageCtx = InstallCtx & { readonly difficulty?: { readonly hp: number; readonly damage?: number } };
export function installDamage(layers: SetupLayers, ctx?: DamageCtx): Installed<DamageRule>;   // + one layerNotApplied when difficulty.damage ≠ 1
// win.ts
export const WIN_CONDITION_KNOBS: readonly KnobSpec[];   // [wipe_wins, mutual_wipe], frozen
export type WinRule = { readonly wipe: boolean; readonly mutual: "draw" | "last-actor-loses" };
export const WIN_CONDITION: BehaviourDef<WinRule>;
export function wipeRule(win: WinRule, sides: readonly SideId[]): (world: { readonly units: Units }, at: { readonly round: number; readonly side: SideId }) => Outcome | null;
// battle.ts
export const BATTLE_EVENTS: EventRegistry<NoModeEvents>;   // { mode: "battle", types: ["hit", "unit.died"] }
export type BattleSetup = { readonly base: UnitStats; readonly stats: Readonly<Record<string, UnitStats>>; readonly hitClass: HitClass };
export type BattleState = { readonly units: readonly { readonly id: string; readonly hp: number; readonly alive: boolean }[] };
export const HIT_REFUSED_REASONS: readonly ["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget"];   // frozen
export type HitRefusedReason = (typeof HIT_REFUSED_REASONS)[number];
export type HitRefused = Notice & { readonly code: "hitRefused"; readonly reason: HitRefusedReason };
export interface Battle { act(action: Action): Notice | null; state(): BattleState }
export function createBattle(setup: BattleSetup, units: Units, grid: Grid, emit: (event: BusEvent<NoModeEvents>) => void): Battle;
// ModeEventMap gains:
//   hit: { readonly unit: string; readonly by: string; readonly amount: number; readonly hp: number; readonly hitClass: HitClass };
//   "unit.died": { readonly unit: string; readonly by: string };
// index.ts
export { BATTLE_EVENTS, HIT_REFUSED_REASONS, createBattle, type Battle, type HitRefused, type HitRefusedReason, type BattleSetup, type BattleState } from "./battle.ts";
export { DAMAGE_RESOLUTION, DAMAGE_RESOLUTION_KNOBS, HIT_CLASSES, installDamage, type DamageCtx, type DamageRule, type HitClass } from "./damage.ts";
export { UNIT_ROSTER, UNIT_ROSTER_KNOBS, type UnitStats } from "./roster.ts";
export { WIN_CONDITION, WIN_CONDITION_KNOBS, wipeRule, type WinRule } from "./win.ts";
// btf-defaults/battle.ts
export const BTF_BATTLE_DEFAULTS: { unit_hp: 9; unit_atk: 1; classes: { warrior: { hp: 9; atk: 1 }; archer: { hp: 6; atk: 2 }; mage: { hp: 6; atk: 2 }; cleric: { hp: 5; atk: 1 } }; wipe_wins: true; mutual_wipe: "draw" };   // readonly, frozen
// sim/types.ts
// SimInput gains:     readonly rules?: BattleSetup;
// SimWorld gains:     readonly rules: Battle | null;
// SimSnapshot gains:  readonly rules?: BattleState;   (last key)
```
`src/sim/actions.ts` (in `apply`, the line before the final `note(world, { code: "actionUnsupported", … })`):
```ts
if ((action.kind === "ability" || action.kind === "interact") && world.rules !== null) { const no = world.rules.act(action); if (no !== null) note(world, no); return; }
```
`src/sim/run.ts` (`snapshot`, after the `turn` line; `restore`, replacing the last compare):
```ts
...(world.rules === null ? {} : { rules: world.rules.state() }),
const { rules, ...rest } = snapshot(world), mine = Object.hasOwn(shot, "rules") ? { ...rest, rules } : rest;
if (JSON.stringify(mine) !== JSON.stringify(shot)) throw new Error("restore: snapshot does not match the log");
```

## Smoke lines
Unchanged (the rules are opt-in): `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. (`stress-budget.ts` also asserts wall-clock p95 budgets; under box load it can stop early on "L: p95 over 2 ms" on the Base too. Re-run it; it is not a regression.)

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done (21 new; ship all four files byte-identical)
| Shipped file (under `handoff/steps/tests/step-p1-2-battle/`) | Copy to | sha256 |
|---|---|---|
| `tests/rules/battle.test.ts` | same path | `bd772d36e40f2cbeb7ec16e51366a4c113adc662402a23d3ee8ec90a7098fa1b` |
| `tests/rules/battle-qa.test.ts` | same path | `0fe7165521f77e4c6fd2ff3ef4a4f2d7e9b180327f927220e4e74d8c6774452c` |
| `tests/parity/battle.parity.test.ts` | same path | `200f0b566b3cdd52ac82bee26a50c48d839a63d3429307d287388fad47000540` |
| `tests/rules/battle-qa-r2.test.ts` | same path | `c12984d2f8e604a4e35ef87d8c6f6eed0c141edd07c99beae0653934ba2b4a78` |

`tests/rules/battle.test.ts` (16):
1. "unit-roster: defaults 9/1, L3 sets a unit document's stats, L5 scales HP only; a bad value is unsupported"
2. "damage-resolution and win-condition read their knobs through B1"
3. "without world.rules, ability and interact stay actionUnsupported and nothing changes; no rules key, no hit event"
4. "a hit through the UNIT pipe subtracts the attacker's atk; at 0 HP the unit dies and its body leaves the board in the same step" (also: with levels and rules both on, all four mode events are registered)
5–12. "hitRefused (DSK D7) b1…b8: reason <reason>, one code, nothing changes": one table-driven test per row, b1 `unknownActor`, b2 `deadActor`, b3–b4 `notUnitAim` (tile aim, no target), b5–b6 `aimMissed` (unknown id, fallback off the map), b7 `selfTarget`, b8 `deadTarget`
13. "refused: every D7 reason has a row; effects (spells, P1-4) and interact (P1-3) stay actionUnsupported; nothing changes"
14. "L5 difficulty.damage is P1-4: installDamage warns layerNotApplied once per install when it is not 1, and plays as 1"
15. "win-condition wipe as a VictoryRule from sides[0]'s view: win, lose, draw or last actor loses; neutral never counts; off plays on"
16. "snapshot.rules: replay and restore rebuild it, a save without it still loads (match-save v1), a wrong HP is refused"

`tests/rules/battle-qa.test.ts` (3, QA pin, byte-identical to `87e4e3ac`):
17. "qa: a bad setup is refused, never skipped (step rule 4)"
18. "qa: atk 0 is a hit of amount 0 that never kills; overkill reports amount = atk, hp 0"
19. "qa: snapshot adds rules as the last key, after turn"

`tests/parity/battle.parity.test.ts` (1):
20. "defaults match BTF battle numbers; per-class L3 stats install as BTF's; a 2-atk archer takes a 9-HP warrior down in 5 plain hits"

`tests/rules/battle-qa-r2.test.ts` (1, QA r2 pin, byte-identical to `849caa73`):
21. "qa: hitRefused checks the actor before the aim (D7 order); the reason list is frozen"

## How a planted bug is caught (EA plants 60/60, `p1-2-plants.py` + list `p1-2-plants-list.py`; QA r1 plants 17/17, `qa-p1-2-plants.py`; run by `proto-check.sh --plants` / `qa-plants.sh`)
Hook: per-unit stats ignored, no subtract, the target's atk subtracted, HP below 0 kept, no death at 0, body not removed (the P1-1 carry), no `unit.died`, no `hit`, hit class not carried, self hit, dead attacker, tile aim taken, spell effects taken, interact taken as a hit, state alive always true, state HP from the setup (1–16). Roster: `unit_hp` default 8, `unit_atk` default 2, either knob not per unit, no L5, fractional HP or negative atk accepted (17–23). Damage: `hit_class` default spell, answer ignored (24–25). Win: `wipe_wins` default false, `mutual_wipe` default last-actor-loses, wipe off still ends, neutral or dead counted, mutual always draw, last actor wins, sides swapped (26–33). Sim: hook ignored, refusal not noted, hook never built, level events dropped under rules, no `rules` in the snapshot, an old save without `rules` refused, `rules` never compared (34–40). D7 reasons (r2): each reason reported as another (unknownActor, deadActor, notUnitAim, aimMissed, deadTarget, selfTarget), an unknown target id or an off-map fallback taken as `deadTarget`, the reason left out of the message, a constant reason, one code per reason, a reason missing from `HIT_REFUSED_REASONS` (41–52). L5 warning (r2): never warns, warns at damage 1, warns without a `damage` key, warns twice, replaces B1's notes, wrong detail, wrong code, `out` changed (53–60). QA's 17 (q01–q17: atk 0, bad setups, died-before-remove, died twice, state order, overkill amount, HP per instance, attacker removed, rules key without the hook, rules not last, negative HP, dead units dropped) all fail the shipped tests with the pin. Each plant fails `tests/rules/battle.test.ts`, `tests/rules/battle-qa.test.ts`, `tests/rules/battle-qa-r2.test.ts` or `tests/parity/battle.parity.test.ts` (none is caught by typecheck alone). QA's r2 D7 set (d01–d15, l01–l08) is closed by the r2 pin: d11–d13 (actor-before-aim precedence with two faults at once) and d15 (`HIT_REFUSED_REASONS` frozen). The `"rules"` chaos key is not planted: no chaos run sets `rules` until P1-5.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 903 passing** (main's count + 21; 882 + 21 on `6cd8fa25`) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto r3-on-main on `6cd8fa25`: 903/0; deps 133 / 432; `check:law OK (src)`. Pre-rebase proto r3 on `5cb385ba`: 895/0.)
- [ ] `node tools/pixel-suite/smoke.ts`, `npm run -s sim` and `node tests/perf/stress-budget.ts` print the § Smoke lines.
- [ ] `git diff <Base> --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty (pins `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`). If a core-types, format or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff <Base> --stat -- src/core src/runtime src/fx src/editor src/project src/state src/paint src/rules/behaviours src/rules/levels src/rules/turns` is empty; in `src/sim` only `types.ts`, `world.ts`, `actions.ts`, `run.ts` and `chaos.ts` change; in `src/btf-adapters` only `src/btf-adapters/src/btf-defaults/battle.ts` (new) and the one export in `src/btf-adapters/src/index.ts` change; `src/sim/migrations` is untouched (match-save stays v1).
- [ ] No file of P1-1 (`src/rules/move/`, `src/btf-adapters/src/btf-defaults/move.ts`, `tests/rules/move*.test.ts`) is created, read or imported.
- [ ] All four shipped test files are byte-identical to the sha256s above.
- [ ] Each file within its cap; ≤ 385 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no game words (`hp`, `damage`, …) in `src/core`, and none in the `src/sim` lines this step adds. No `g-tile-engine` or `towerchess` path in `src/` (`check:law` `no-btf-path`; cites use `towerChess.ts:<line>`).
- [ ] Branch name, CN-003 bundle + Drive upload, and last-commit HANDBACK.md per § Delivery; hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
Proto r3: **main's count + 21** = **903** at `6cd8fa25` (882 + 16 (`tests/rules/battle.test.ts`) + 3 (`tests/rules/battle-qa.test.ts`, QA r1 pin) + 1 (`tests/parity/battle.parity.test.ts`) + 1 (`tests/rules/battle-qa-r2.test.ts`, QA r2 pin)). The same +21 was 895 on `5cb385ba` (874 + 21) before P1-1 merged. If main moves again, the Base floor is main's count and the target is that + 21. Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
No per-frame code. A hit is one `resolveAim` and two map writes, once per action; `state()` walks the units once per snapshot (≤ the unit cap).

## Not in this step (carries, with their target step)
- **Librarian (Phase 1 catalogue freeze):** add `unit-roster`, `damage-resolution` and `win-condition` to `phase1_freeze` and the generated slice, then replace `UNIT_ROSTER_KNOBS`, `DAMAGE_RESOLUTION_KNOBS` and `WIN_CONDITION_KNOBS` with the generated tables (same values). The catalogue's `unit_hp` has no L5 marker; P1-2 sets `l5: "hp"` locally (B1 ruling 6).
- Picking a target (adjacency through `targetsFor`, side filter) and talk on `interact` (`unit.interacted`, the `text` knob) → **P1-3**. Until then the hook refuses `interact` with `actionUnsupported`.
- Spells (an `ability` with `effects`) → **P1-4**.
- L5 `difficulty.damage` (damage dealt × the stage difficulty) → **P1-4**. Until then `installDamage` emits one `layerNotApplied` warning (`L5 difficulty.damage`) per install when it is not 1, and damage plays as ×1 (DSK D7).
- `interact` refusals → **P1-3** as `interactRefused` with a `reason` (the D7 `<action>Refused` pattern).
- A `fallbackAt` aim on a dead target lands on whoever stands at the fallback spot (QA S2) → **P1-3** decides (aims without a fallback, or deliberately with one).
- Guards, shields, `cannot die` and the on-death triggers of `damage-resolution`; the clock, tiebreak and count knobs of `win-condition` → Phase 4.
- A host helper that installs `unit-roster` for every unit document and builds `BattleSetup`; wiring `wipeRule` into the play page → **P1-6** (host).
- Bots and chaos with `rules` set → **P1-5**.
- **P1-1 is on main:** `src/btf-adapters/src/index.ts` already ends with P1-1's `BTF_MOVE_DEFAULTS` export; this step appends `BTF_BATTLE_DEFAULTS` after it (one-line rebase conflict; keep both). `src/sim/types.ts` adds the Battle import after `fuse` (P1-1's `StepRule` import stays after `levels`) and the three `rules` fields. Floor arithmetic is § Floor (main's count + 21). Proto `p1-2-r3-on-main` on `6cd8fa25` is 903/0; after a kill neither `targetsFor` sees the body nor is its cell blocked for a walk (checked on r2+P1-1 at 902/0, and P1-1 is now the Base).

## Out of scope
UI, the play page, the editor, any format, log, save-format or catalogue change, a CN, a save migration, bots.

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/types/core-types.ts`, `src/rules/behaviours` (B1, incl. the generated `catalogue.ts`), `src/rules/levels`, `src/rules/turns`, every pin file, `src/sim/migrations`, every `src/sim` file except `types.ts`, `world.ts`, `actions.ts`, `run.ts` and `chaos.ts`, every `src/btf-adapters` file except `src/btf-adapters/src/btf-defaults/battle.ts` and the one export in `src/btf-adapters/src/index.ts`.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least main's count + 21 = 903 passing and 0 failing** (proto 903/0 on `6cd8fa25`). Paste the summary line, the smoke line and the sim and stress lines into HANDBACK.md.
- All four shipped test files are **byte-identical** to the sha256s above.
- The branch starts at the Base; ≤ 385 changed lines; every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).
- The bundle is `<Base>..step/step-p1-2-battle-r<N>-chatA` and passes `git bundle verify`.

## Delivery
On branch `step/step-p1-2-battle-r<N>-chatA` (from the Base), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer); `handback/step-p1-2-battle/r<N>/HANDBACK.md` is the last commit. Run `git bundle create step-p1-2-battle-r<N>-chatA.bundle <Base>..step/step-p1-2-battle-r<N>-chatA`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub. A rework after a REJECT is a new branch `-r<N+1>-chatA` from the `r<N>` head.
