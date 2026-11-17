Build step-p1-1-walk r1 (kit r1) from the step file `handoff/steps/step-p1-1-walk.md` on main (sha256 `04181b6c67d6b2ec0b371f6cd7d0c3c1529b67ba9b65bee96fa8e5ae9790860d`); it wins over this paste.

Base commit: `16fabf3d63f098ffd528a636f17e65279a07dacf` (main after the B1 merge `9ebb9413`, PR #60, tree `ccb7f0ed`, plus QA docs; Base floor **874/0**); if B1 is not on main when you start, **stop and report**. Branch: `step/step-p1-1-walk-r1-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, no A/B.
Delivery (CN-003): `git bundle create step-p1-1-walk-r1-chatA.bundle <Base>..step/step-p1-1-walk-r1-chatA`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. Never push to `main`, another branch or a tag; never force-push, delete a branch, or open, merge or close a PR. Your hand-back message quotes the branch name, the full 40-char tip sha, the Base sha, the bundle name and `pass N fail 0` (proto floor 859; on the Base, Base floor + 8 = 882).
It switches to CN-028 git branches once the CEO's push token and ruleset exist.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

Shipped files (copy byte-identical from `handoff/steps/tests/step-p1-1-walk/` to the same paths at the repo root): `tests/rules/move.test.ts` (new, 6 tests), `tests/sim/bot.test.ts` (one line changed by ruling), `tests/parity/step-pattern.parity.test.ts` (new, 1 test) and `tests/rules/move-qa.test.ts` (new, 1 test, QA pin). Floor: green at least 859 passing on the proto, 0 failing; on the Base, at least Base floor + 8 = 882.

Kit: kit-1 **r1**, 2026-11-17. Engine Architect. Proto `/tmp/p1-1` branch `p1-1-r6`, head **`e121b9ae`** (`e121b9aeb49e20ebfd72f00ad85b151a17824ab0`, tree `763b9fe6`) on proto base `1d2f9e88` (B1 r8 merged into main `ade38faa`). 12 files, +259/−6 = **265 changed lines** (src 113, tests 152). Green **859/0**. EA plants **26/26**. QA review sha256 `e8be982f51982538854ab5f90918a4dec4bc95308d6cdc4b76b6bef788c92535`. Bundle `/workspace/share/step-p1-1-proto-r6.bundle` (sha256 `b0b7da6b…`).

## Goal
Today a player move is one jump to any in-bounds cell (only `inBounds` is checked) and nothing says who a unit can tap. After this step (rules logic in `src/rules/move/`, testable in Node):
1. **`step-pattern` reads its settings:** `pattern` sets reach and `max_step` is a ceiling; with the defaults a unit moves 1 tile; a clamp emits `stepClamped`.
2. **A walk has a path:** each walk is a straight ray, so a reachable cell has exactly one path; the player step carries its cells for the scene to walk.
3. **Out of reach is refused:** a tapped cell beyond the reach, off the four rays (e.g. an L cell), behind a wall or behind any unit (own team included), or on a taken cell is refused `notReachable` and changes nothing.
4. **Who can I tap:** `targetsFor` lists the living units orthogonally next to a unit, resolved through the UNIT pipe, in a fixed order. It stays in this step: it is the UNIT-pipe adjacency list P1-3 builds on. No HP and no rules effect (P1-2 / P1-3).
5. **Dead units and off-board aims (QA pin M1):** a dead (removed) unit cannot walk (`walks` is empty, `reachCells` is `[]`); `walkTo` returns `null` for an off-board cell, including an aim that would alias an on-board index (e.g. (6,6) or (-6,8)); `targetsFor` returns `[]` for a dead unit.

## Rulings (r1)
1. **Place.** New folder `src/rules/move/`: `step-pattern.ts`, `path.ts`, `targets.ts`, `index.ts`. They import only `src/types`, `src/core` (grid, unit, targeting, notice) and `src/rules/behaviours` (types). No game rule enters `src/core`; `src/sim` changes only `player.ts` and `types.ts` as below. New `src/btf-adapters/src/btf-defaults/move.ts` holds the proven BTF numbers as data (`pattern` orthogonal-1, `max_step` 2, `bodies_block` true) with `towerChess.ts` file:line cites (`:399-407` `empty()`, `:415-509` `moveSquares`, `:424` `ray()`; checked read-only against `/workspace/g-tile-engine`, no git, no copied code). Depcruise `rules-below-runtime` and `adapters-only-from-runtime-editor` forbid `src/rules` from importing `src/btf-adapters`, so the numbers stay in `step-pattern` and `tests/parity/step-pattern.parity.test.ts` asserts they equal `BTF_MOVE_DEFAULTS` and that default reach equals BTF's straight-ray squares with bodies blocking.
2. **`step-pattern` knobs (Librarian ruling 01:00), local KnobSpec `STEP_PATTERN_KNOBS`, frozen, this order:**
   - `pattern`: picker, default `"orthogonal-1"` (BTF warrior), options = the 9 rev-26 values in catalogue order (`orthogonal-1`, `orthogonal-2`, `king-1`, `forward2-back1-side2`, `ns1-diag2`, `ns2-ew1`, `orth1-diag2`, `king-2`, `diag-2`), so a catalogue value is never a hard `invalidValue`. Only `orthogonal-1` (reach 1) and `orthogonal-2` (reach 2) are played. `pattern` sets reach.
   - `max_step`: slider 1–2, step 1, default 2: the project-wide ceiling. When it cuts the pattern, `notes` holds one `stepClamped` warning and the stored values are kept.
   - The other rev-26 knobs (`bodies_block_long_step`, `barriers_block_step`, `can_jump`, `ability_group`, `effect`) are left out; an answer for one warns `unknownKnob` (B1).
3. **`STEP_PATTERN` install** (frozen `BehaviourDef<StepRule | null>`, id `step-pattern`): reads both knobs. Any other pattern → `k.unsupported("pattern", <value>)` and `null`. A `max_step` that is not a whole number ≥ 1 → `k.unsupported("max_step", …)` and `null`. Else `reach = min(pattern reach, max_step)`; if the pattern reaches further than `max_step`, `notes` holds one warning `{ code: "stepClamped", message: "step-pattern.pattern <p> reaches <n>, max_step <m>" }` and the stored values are kept as they are. Result frozen `{ reach, notes }`. Defaults → `{ reach: 1, notes: [] }`.
4. **Straight walks (EA rulings 01:06 and 01:12).** `walks(grid, units, id, reach)`: for each of n, e, s, w, step from the unit for up to `reach` steps; **no turning** (`orthogonal-2` = "Up to two steps straight (no turn)", rev 28, and BTF). A ray stops at a wall edge or a closed tile (`grid.canStep` false, or off the map), and **before any living unit, own team included: BTF default, any body blocks** (EA ruling 01:12 per the Librarian's BTF check: towerChess.ts:399-407 `empty()` and :424 `moveSquares`; rev 28 `bodies_block_long_step` = true). There is no pass-through; a blocked first cell gives that direction nothing. Result: `Map<end cell index, path>`, the path being the cells along the ray **start excluded** (length = steps). A dead or unknown walker gets an empty map. There is no `pathTo` and no BFS: each reachable cell has exactly one straight path, so no tie order is needed.
5. **`reachCells(grid, units, id, reach)`**: the walks' end cells, **sorted by row then column**.
6. **`walkTo(grid, units, id, reach, to)`**: the path of the walk ending at `to`, or `null` when `to` is off the map or no walk ends there (out of reach, an L cell, behind a wall or any unit, or a taken cell). **Decision 3:** the walk functions and `targetsFor` take `grid` and `units` explicitly (no world object in rules).
7. **`targetsFor(grid, units, id)`** (decision 3: takes grid and units): for each of n, e, s, w next to the unit, each occupant other than the unit itself is resolved with `resolveAim(aimUnit(o), units, grid)`; a hit gives `{ id, unitId, side, at }`. Sorted **by row then column** (a cell's occupants in `occupantsAt` order). Dead or unknown unit → `[]`. **Decision 6:** no team, npc-kind or atk filter (the engine has no atk or npc kind; P1-3 owns attack/talk rules and the bridge filters by `side`/`unitId`), and walls between adjacent cells are ignored. **`targetsFor` stays** in this step: it is the UNIT-pipe adjacency list P1-3 builds on.
8. **Player driver (`src/sim/player.ts`, `src/sim/types.ts`).**
   - `PlayerOptions.step?: StepRule` (**decision 1:** opt-in). Absent = the old one-jump move with no reach check, so chaos runs and the pinned 50-seed histories are unchanged.
   - With `step`, a `TAP_MOVE_CELL` that passed the existing checks runs `walkTo(…, step.reach, at)`; `null` → reject **`notReachable`** (new `PlayerReject` member), no event fed, no action, nothing changed (like every other reject).
   - **Decision 2:** the path rides on the step, not the Action: `PlayerStep.path?: readonly Sq[]`, set only on an accepted walked move. The logged Action keeps its shape (no log-format change); replay recomputes nothing because the move's target is in the log.
   - **Decision 4:** with `step`, `moveMs` is per tile walked: `durationMs = moveMs × path.length` (null stays null). MOVE_DONE is unchanged: the driver marks it after the move's duration, i.e. after the walk.
   - Exactly the diff below; nothing else in `src/sim`.
9. **Decision (catalogue):** the local KnobSpec mirrors rev 26 = rev 28 for these two knobs. Regenerating the engine slice from rev 28 is **not** done here: it is not a trivial swap (`gen-catalogue.py` would also move xp-levels and terrain off rev 26, and the rev 27 xp-levels change needs the install rewrite, a Phase 4 B1 carry), so it is a carry (§ Not in this step). Do not edit `catalogue.ts`.

## Open questions (r1: all resolved)
- Bodies on the line: **closed**, EA ruling 01:12: any body blocks, own team included (BTF default; ruling 4). The earlier own-team pass-through ruling is withdrawn.
- `orthogonal-2` turning: **closed**, EA ruling 01:06: straight only, no turning (ruling 4).

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/rules/move/step-pattern.ts` | new: `STEP_PATTERN_KNOBS`, `StepRule`, `STEP_PATTERN` (rulings 2–3) | 26 | 30 |
| `src/rules/move/path.ts` | new: `walks`, `reachCells`, `walkTo` (rulings 4–6) | 30 | 35 |
| `src/rules/move/targets.ts` | new: `TapTarget`, `targetsFor` (ruling 7) | 22 | 26 |
| `src/rules/move/index.ts` | new: exports | 3 | 4 |
| `src/sim/player.ts` | the `notReachable` check, the per-tile duration and `path` on the step (ruling 8) | 10 | 12 |
| `src/sim/types.ts` | `PlayerOptions.step`, `notReachable`, `PlayerStep.path` (ruling 8) | 9 | 11 |
| `src/btf-adapters/src/btf-defaults/move.ts` | new: `BTF_MOVE_DEFAULTS` (ruling 1) | 12 | 18 |
| `src/btf-adapters/src/index.ts` | one export of `BTF_MOVE_DEFAULTS` | 1 | 2 |
| `tests/rules/move.test.ts` | new, shipped (6 tests), byte-identical | 78 | 78 |
| `tests/sim/bot.test.ts` | shipped, byte-identical (one line, § Existing tests changed) | 2 | 2 |
| `tests/parity/step-pattern.parity.test.ts` | new, shipped (1 test), byte-identical | 55 | 55 |
| `tests/rules/move-qa.test.ts` | new, shipped (1 test), byte-identical (QA pin M1) | 17 | 17 |
Total ≤ 300 changed lines (proto **265**: src 113, tests 152; the Phase 1 budget for P1-1 is ~330).
Comments (QA R1): the builder's comments must not say `S2` or `P1 S1`; write `P1-3` and `P1-1`. (The proto still has those stale badges in `src/rules/move/targets.ts` and `src/sim/types.ts`; the builder writes its own code.)

## Interfaces to match (quoted exactly; bodies elided)
```ts
// step-pattern.ts
export const STEP_PATTERN_KNOBS: readonly KnobSpec[];   // [pattern, max_step], frozen
export type StepRule = { readonly reach: number; readonly notes: readonly Notice[] };
export const STEP_PATTERN: BehaviourDef<StepRule | null>;
// path.ts
export function walks(grid: Grid, units: Units, id: string, reach: number): Map<number, Sq[]>;
export function reachCells(grid: Grid, units: Units, id: string, reach: number): Sq[];
export function walkTo(grid: Grid, units: Units, id: string, reach: number, to: Sq): Sq[] | null;
// targets.ts
export type TapTarget = { readonly id: string; readonly unitId: string; readonly side: SideId; readonly at: Sq };
export function targetsFor(grid: Grid, units: Units, id: string): TapTarget[];
// index.ts
export { STEP_PATTERN, STEP_PATTERN_KNOBS, type StepRule } from "./step-pattern.ts";
export { reachCells, walkTo, walks } from "./path.ts";
export { targetsFor, type TapTarget } from "./targets.ts";
// btf-defaults/move.ts
export const BTF_MOVE_DEFAULTS: { readonly pattern: "orthogonal-1"; readonly max_step: 2; readonly bodies_block: true };
// sim/types.ts
export type PlayerOptions = { readonly side: SideId; readonly moveMs: number | null; readonly nextId: () => string; readonly step?: StepRule };
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction" | "malformed" | "disposed" | "noOffer" | "badPick" | "notReachable";
// PlayerStep gains:  readonly path?: readonly Sq[];
```
`src/sim/player.ts` (inside `feed`, replacing the one `const reject = rejectOf(…)` line and the action and step lines):
```ts
const first = rejectOf(world, opts, from, event, selected);
const path = first === null && event?.type === "TAP_MOVE_CELL" && selected !== null && opts.step !== undefined ? walkTo(world.grid, world.units, selected, opts.step.reach, event.at) : undefined;
const reject = path === null ? "notReachable" : first;
// in the TAP_MOVE_CELL branch:
const ms = !path || opts.moveMs === null ? opts.moveMs : opts.moveMs * path.length;   // durationMs: ms
// the step:
const step: PlayerStep = { intent, aim: aim ?? null, tick: world.clock.tick(), from, event, action, reject, ...(action !== null && path ? { path } : {}) };
```

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0; chaos smoke 3120/0 and 5542/0. (`stress-budget.ts` also asserts wall-clock p95 budgets; under box load it can stop early on "L: p95 over 2 ms" on the Base too. Re-run it; it is not a regression.)

## Existing tests changed by ruling (and only these)
`tests/sim/bot.test.ts` L84 ("every reject reason is reached…"): `const listed: Record<PlayerReject, true>` → `const listed: Record<Exclude<PlayerReject, "notReachable">, true>`. That test drives a player without `step`, so `notReachable` cannot be reached there; it is reached in `tests/rules/move.test.ts` test 5. Ship the whole file byte-identical.

## Tests that prove it is done (8 new; ship all four files byte-identical)
| Shipped file (under `handoff/steps/tests/step-p1-1-walk/`) | Copy to | sha256 |
|---|---|---|
| `tests/rules/move.test.ts` | same path | `cc00772294e092881392a0637eeee68e95e4d170617fadf37842b81a16dd5d4b` |
| `tests/sim/bot.test.ts` | same path | `82520ebc565b98373410811811a762859feccca1516613688e79c1cd551dbd4a` |
| `tests/parity/step-pattern.parity.test.ts` | same path | `4d5c90e70c23ccfc47fadfd010372458f734768228062e30edc31e2830ac87d7` |
| `tests/rules/move-qa.test.ts` | same path | `37b8584ceb0f9e12ee122fc855612ad5b331af708c8e08ef28050d73ee9c010c` |

1. "straight walks n,e,s,w, start excluded: a teammate blocks like any body; an L cell is not in reach; sorted by row then column"
2. "a ray stops at a wall edge and before any unit (teammate or not); a blocked first cell stops the ray" (also: a removed unit no longer blocks)
3. "targetsFor: living units orthogonally next to the unit through the UNIT pipe, with id and side, sorted by row then column"
4. "step-pattern: default reach 1; orthogonal-2 reaches 2; max_step clamps it with stepClamped and keeps the stored value; other patterns are unsupported"
5. "a player move under step-pattern: reach comes from the B1 layers, a far cell is refused notReachable and changes nothing, the step carries the path"
6. "walked moves replay deterministically"
7. "defaults match BTF move numbers, and default reach equals BTF straight-ray squares with bodies blocking"
8. "QA P1-1: a removed walker walks nowhere and taps no one; off-board aims that share a cell index are refused"

## How a planted bug is caught (EA plants 26/26, `p1-1-plants.py` + list `p1-1-plants-list.py`; run by `proto-check.sh --plants` / `qa-plants.sh`)
Walks: walls ignored, ray one short, ray one long, a teammate let through, bodies let through but not stopped on (the withdrawn pass-through rule), no body blocking, a shared path array, start in the path, rays n and e only (1–9). ("Dead bodies block" is an equivalent mutant: `units.remove` takes the body off its cell.) Reach list: unsorted, column-first (10–11). Targets: unsorted, west skipped, dead kept (typecheck), wrong side (12–15). step-pattern: default orthogonal-2, orthogonal-2 reaching 1, max_step default 1, no clamp, silent clamp, unknown pattern not reported (16–21). Player: no `notReachable`, `step` ignored, reach off by one, `moveMs` not per tile, no `path` on the step (22–26). Every plant fails `tests/rules/move.test.ts`. The parity test pins the knob defaults against `BTF_MOVE_DEFAULTS` and the BTF-shaped boards (not in the plant list).

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 859 passing** (proto: 851 + 6 + 1 + 1; on the Base, at least Base floor + 8 = 882) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto: 859/0; deps 124 modules / 395 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts`, `npm run -s sim` and `node tests/perf/stress-budget.ts` print the § Smoke lines.
- [ ] `git diff <Base> --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty (pins `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`). If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff <Base> --stat -- src/core src/runtime src/fx src/editor src/project src/state src/rules/behaviours src/rules/levels src/rules/turns` is empty; in `src/sim` only `player.ts` and `types.ts` change; in `src/btf-adapters` only `src/btf-adapters/src/btf-defaults/move.ts` (new) and the one export in `src/btf-adapters/src/index.ts` change.
- [ ] All four shipped test files are byte-identical to the sha256s above.
- [ ] A dead (removed) unit cannot walk (`walks` empty, `reachCells` `[]`); `walkTo` returns `null` for an off-board cell (including aims that alias an on-board index); `targetsFor` returns `[]` for a dead unit. (Pinned by `tests/rules/move-qa.test.ts`.)
- [ ] Each file within its cap; ≤ 300 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no game words (`hp`, `damage`, …) in `src/core`. No `g-tile-engine` or `towerchess` path in `src/` (`check:law` `no-btf-path`; cites use `towerChess.ts:<line>`).
- [ ] Branch name, CN-003 bundle + Drive upload, and last-commit HANDBACK.md per § Delivery; hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
Proto: 851 → **859**: 851 (proto base after the local B1 merge) + 6 (`tests/rules/move.test.ts`) + 1 (`tests/parity/step-pattern.parity.test.ts`) + 1 (`tests/rules/move-qa.test.ts`). On the Base, **Base floor + 8 = 882**. `tests/sim/bot.test.ts` keeps its test count. Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
No per-frame code. A walk check is 4 rays of ≤ 2 steps (≤ 8 cells), once per tap; `targetsFor` reads 4 cells.

## Not in this step (carries, with their target step)
- **Librarian (Phase 1 catalogue freeze):** add `step-pattern` to the generated slice and regenerate `catalogue.ts`; then `STEP_PATTERN_KNOBS` is replaced by the generated table (same values). Regenerate the slice from rev 28 (`phase1_freeze` [step-pattern, talk, xp-levels, terrain]) together with the xp-levels rev 27 install rewrite. The other step-pattern knobs (`bodies_block_long_step`, `barriers_block_step`, `can_jump`, `ability_group`, `effect`) stay out until a step plays them; P1-1 hard-codes the rev 28 defaults `bodies_block_long_step` = true and barriers stopping a step.
- The other 7 patterns (`king-1`, … `diag-2`) and BTF's remaining per-class rays (towerChess.ts:415-509) → Phase 4 (reported `knobUnsupported` until then).
- Attack and talk (HP, atk, `hit`, `unit.died`, `unit.interacted`, talk text, the team/npc/atk filters on `targetsFor`) → **P1-2 / P1-3**. `targetsFor` as the adjacency list is already in this step. **Carry for P1-2:** a unit that reaches 0 HP must be `remove`d in the same step. Otherwise `walks` and `targetsFor` (which test `alive`, not HP) would treat a 0-HP body as a blocker or a target.
- Wiring `step` and `targetsFor` into the play page (P1-6) / host. A host-built `StepRule`'s `notes` (`stepClamped`) are shown by the host; P1-1 only returns them.
- Bots and chaos with `step` set (they keep the one-jump move) → P1-5 / Phase 3/4. **S1:** `src/sim/exploit.ts:75` flags any move whose `durationMs` is not exactly `moveMs`. Walked moves take `moveMs` per tile, so a multi-tile walk is flagged once chaos or exploit checks run with `step`. Fix that check in this P1-5 carry.

## Out of scope
UI, the play page, the editor, any format, log or catalogue change, HP or any rules effect, bots.

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/types/core-types.ts`, `src/rules/behaviours` (B1, incl. the generated `catalogue.ts`), every pin file, every `src/sim` file except `player.ts` and `types.ts`, every `src/btf-adapters` file except `src/btf-adapters/src/btf-defaults/move.ts` and the one export in `src/btf-adapters/src/index.ts`.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least the Base floor + 8 = 882 passing and 0 failing** (proto 859/0). Paste the summary line, the smoke line and the sim and stress lines into HANDBACK.md.
- All four shipped test files are **byte-identical** to the sha256s above.
- The branch starts at the Base; ≤ 300 changed lines; every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).
- The bundle is `<Base>..step/step-p1-1-walk-r<N>-chatA` and passes `git bundle verify`.

## Delivery
On branch `step/step-p1-1-walk-r<N>-chatA` (from the Base), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer); `handback/step-p1-1-walk/r<N>/HANDBACK.md` is the last commit. Run `git bundle create step-p1-1-walk-r<N>-chatA.bundle <Base>..step/step-p1-1-walk-r<N>-chatA`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub. A rework after a REJECT is a new branch `-r<N+1>-chatA` from the `r<N>` head.
