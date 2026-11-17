# step-p1-3-range-interact: Phase 1 P1-3 "Range, side filters, interact, and ChooseAction" (foundation-plan-phased.md §3). Orthogonal reach (BTF `inBasicRange`, not diagonal), `allyTarget` / `outOfReach` after the frozen D7 six, free interact on adjacent neutrals (`unit.interacted`, `interactRefused` + reason), `targetsFor`, and the player `ChooseAction` path aiming without `fallbackAt` (QA P1-2 S2).

Step id: step-p1-3-range-interact          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `75df464243426061340d27372e1e97b485843ded`; P1-2 is already merged at `1775d83ad3eaa4f25b0ddc55403d9f62169cbcec`, then the QA P1-2 build reviews; runnable count **904**). **P1-2 must already be merged on that main** before you start. Floor = that main's test count + 13 = **917**. If P1-2 is not on main, or if P1-2's APIs on main differ from what the shipped tests import, **stop and report**. Branch: `step/step-p1-3-range-interact-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-3-range-interact/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: P1-2 (`world.rules`, `createBattle`, frozen `HIT_REFUSED_REASONS`, `installDamage` L5 warning, own-key `stats` lookup).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-2, a hit has no range or side filter (a far or allied unit can be hit), `interact` is `actionUnsupported`, and the player path cannot choose attack or talk. After this step (rules in `src/rules/battle/`, player door in `src/sim`):
1. **Orthogonal reach.** A basic attack hits a living foe on the same row or column at Manhattan 1..reach, not diagonal (BTF `inBasicRange` with `diagonal = false`, towerStrike.ts:103-109). Default reach 1 (warrior); per-unit 2 for archer and mage (`basicReach`, towerStrike.ts:79-83). `reachOf` uses `Object.hasOwn` (or a Map), not a prototype-key lookup, and falls back to 1 when the table is missing, the key is not own, or a value is not an integer ≥ 1. No intervening-body block in Phase 1 (open ruling).
2. **Side filter.** A same-side unit is `hitRefused` with reason `allyTarget`, even when out of reach (`allyTarget` is checked before `outOfReach`). The frozen D7 list `HIT_REFUSED_REASONS` is unchanged; `HIT_FILTER_REASONS` is the new frozen pair `outOfReach`, `allyTarget`.
3. **Interact.** Kind `interact` is free (no HP change, no action cost). It emits `unit.interacted` {by, target} only when the target is `side === "neutral"` and orthogonally adjacent (reach 1). Frozen `INTERACT_REFUSED_REASONS` (the six actor/aim reasons plus `notAdjacent`, `foeTarget`); the notice code is `interactRefused` with `reason` (DSK D7 `<action>Refused`). Merchant `#6` is side `player`, so not interactable until a later talk setup (open ruling). No `talk.line` / `text` knob in this step (B1 `KnobType` has no `text`; open ruling).
4. **`targetsFor`.** Legal HUD targets, living units only, no `fallbackAt`. Basic = foes in reach; interact = adjacent neutrals.
5. **Player path (S2).** `ChooseAction` {actionId: `"basic"`|`"interact"`} is a door intent; `CHOOSE_ACTION` is accepted from `unitSelected` and `actMenu`. `CONFIRM_TARGET` builds `aimUnit(id)` with no `fallbackAt`. A dead id is `deadTarget`. A raw aim with `fallbackAt` still hits the occupant (core pipe; tested).

## Rulings made (safest defaults; open items listed below)
- Interact targets only `side === "neutral"` (not the player-side merchant).
- No intervening-body block on basic rays in P1.
- `allyTarget` before `outOfReach`.
- `CHOOSE_ACTION` is also accepted from `unitSelected` (attack/talk without walking first).
- Talk `text` knob / `talk.line` deferred (needs a catalogue `text` type).
- S2: player aims have no `fallbackAt`; raw `fallbackAt` still hits the occupant.
- The merged P1-2 own-key pin `tests/rules/battle-qa-build.test.ts` put both units on side `player` at the same cell, which this step refuses as `allyTarget` (and the same tile is not in reach). The shipped fixture keeps the own-key assertion (constructor gets base 9/1, wolf 2→1) but places them as foes one tile apart. P1-2's public API (`createBattle`, `BattleSetup`, `HIT_REFUSED_REASONS`, `installDamage`, own-key `stats`) matched what the tests import.

## Open questions (defaults above; parent will batch)
- Should an intervening body block a basic ray in Phase 1, or wait for later LOS?
- Is the player-side merchant interactable in P1, or only `neutral`?
- When does the catalogue grow a `text` knob type / `talk.line` (DSK D2/D5)?
- UX answers file on the box is sha256 `7f938011254554cf8a32b6622e0e71cb6e914ddcdd38ace0d757a9c10d8c8894` at `/workspace/share/foundation/ux-p1-answers.md`; the brief cited `f932c4a5`. Content matched the plan's UX summary. Which hash is canonical?

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/btf-adapters/src/btf-defaults/battle.ts` | `basic_reach`, `class_reach` | 2 | 6 |
| `src/rules/battle/basic-attack.ts` | new: `BASIC_ATTACK`, default reach 1, per-unit | 16 | 20 |
| `src/rules/battle/battle.ts` | filters, interact branch, `HIT_FILTER_REASONS`, `unit.interacted` (on main's `taken()` / own-key `stats`) | 33 | 40 |
| `src/rules/battle/index.ts` | re-exports | 6 | 8 |
| `src/rules/battle/interact.ts` | new: `INTERACT_REFUSED_REASONS`, `interactRefused` | 7 | 10 |
| `src/rules/battle/range.ts` | new: `inOrthogonalReach`, `reachOf` (`Object.hasOwn`) | 14 | 18 |
| `src/rules/battle/targets.ts` | new: `targetsFor` | 25 | 30 |
| `src/sim/player.ts` | `ChooseAction`, confirm without `fallbackAt` | 43 | 50 |
| `src/sim/types.ts` | `ChooseAction` on `DoorIntent` | 2 | 6 |
| `src/state/tactics.input.table.ts` | `CHOOSE_ACTION` from `unitSelected` and `actMenu` | 2 | 4 |
| `tests/parity/basic-attack.parity.test.ts` | new, shipped, byte-identical | 18 | 18 |
| `tests/parity/battle.parity.test.ts` | stand next to a foe; do not hit an ally | 9 | 12 |
| `tests/rules/battle-p13.test.ts` | new, shipped, byte-identical (outOfReach title matches the body) | 167 | 170 |
| `tests/rules/battle-qa-build.test.ts` | P1-2 constructor pin fixture: foes at reach 1 | 2 | 6 |
| `tests/rules/battle-qa-p13.test.ts` | new, shipped, byte-identical (QA pin M1) | 27 | 27 |
| `tests/rules/battle-qa-r2.test.ts` | reach 99 so D7 pin still hits | 2 | 4 |
| `tests/rules/battle-qa.test.ts` | `standBy` + reach | 12 | 16 |
| `tests/rules/battle.test.ts` | logged moves in snapshot replay; `standBy` for off-axis fixtures | 28 | 34 |
| `tests/state/xgo.accepts.test.ts` | 40 edges / 35 keys | 4 | 6 |
Total ≤ 420 changed lines (proto **419**: src 150, tests 269). Hard cap 420 (the 27-line QA pin plus the P1-2 constructor-pin fixture).

## Tests that prove it is done (13 new; ship all nine files byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-3-range-interact/` to the same paths at the repo root. New: 11 tests in `tests/rules/battle-p13.test.ts`, 1 in `tests/parity/basic-attack.parity.test.ts`, and 1 in `tests/rules/battle-qa-p13.test.ts` (QA pin; sha256 `f4c554d43f1cfc07625f9b790c3725b2f4d895ab8e981011921c45ff0481a210`). N = 13. The other six files only adjust fixtures so P1-2 pins still hold under orthogonal reach and `allyTarget` (including the constructor own-key pin).
SHA256s are in the kit tree and must match the proto.

## How a planted bug is caught
EA plants 20/20 (`p1-3-plants.py`). A diagonal counted as in reach, a default reach of 2, a skipped side or range check, interact on a foe, a player aim with `fallbackAt`, dead units in `targetsFor`, or `interactRefused` emitted as `hitRefused` each fail a shipped test.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 917 tests passing** (main's count at Base + 13, once P1-2 is on that main) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on `75df464243426061340d27372e1e97b485843ded`: 917/0.)
- [ ] If P1-2 is not on main, or if P1-2's APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Each file within its cap; ≤ 420 changed lines in total (419 in the proto). Hard cap 420.
- [ ] All nine shipped test files are byte-identical to the kit copies.
- [ ] No `Math.random` or wall time in the new rules; no game rules in `src/core`; in `src/sim` only the player/types hook seams change. Never touch `painter-proto/` or `ui-shell/`. Cites use `towerStrike.ts:<line>` (no `g-tile-engine` path in `src/`).

## Floor
`npm run green` is at least **917** tests passing (main's count at Base + 13, once P1-2 is on that main: 904 + 13). If main's count at Base (with P1-2 already merged) is C, the floor is C + 13. Kit tests under `handoff/` are not run on main until merge.

## Not in this step
- `talk.line` / a `text` knob type → later (catalogue). The host can still listen for `unit.interacted`.
- Intervening-body block / LOS → later.
- Spells (`ability` with `effects`) → P1-4.
- L5 `difficulty.damage` real layering → Phase 4 (the P1-2 warning stays).
- Bots, action-budget, exploit legal ability/interact → P1-5.

## Out of scope
Catalogue regen, mana, cooldowns, play-page HUD, painter-proto, ui-shell, GitHub push.

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/types/core-types.ts`, `src/rules/behaviours` (incl. `catalogue.ts`), `src/rules/levels`, `src/rules/turns`, `src/sim/migrations`, every pin file except the listed `battle-qa-build.test.ts` fixture update and the shipped QA pin `battle-qa-p13.test.ts`. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 917 tests passing** and 0 failing (main's count at Base + 13). Paste the summary line into HANDBACK.md.
- All nine shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (P1-2 already on main). ≤ 420 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-3-range-interact-r<N>-chatA` (base = current main when you start; P1-2 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-3-range-interact-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, and `pass N fail 0`.
