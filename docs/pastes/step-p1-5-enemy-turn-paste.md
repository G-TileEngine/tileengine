Build step-p1-5-enemy-turn r2 from the step file `handoff/steps/step-p1-5-enemy-turn.md` (sha256 `697e35efdc3eab190abccad9e945d407959dd6367f17dfade6fd14ad78a56fde`); it wins over this paste.

Base commit: current main when you start (at kit authoring, `origin/main` is `75df464243426061340d27372e1e97b485843ded`; P1-2 merged at `1775d83ad3eaa4f25b0ddc55403d9f62169cbcec`, runnable count **904**). Floor = that main's count + 9 (authoring floor **937**). If a required earlier step is missing or its APIs on main differ from what the shipped tests import, **stop and report**. Branch: `step/step-p1-5-enemy-turn-r2-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

Shipped files (copy byte-identical from `handoff/steps/tests/step-p1-5-enemy-turn/` to the same paths at the repo root): `tests/parity/action-budget.parity.test.ts`, `tests/rules/bot-p15.test.ts`, `tests/rules/bot-qa-p15.test.ts`. Floor: green at least main's count + 9 = 937 passing on a main that already holds the earlier steps, 0 failing (proto 937/0).

Kit: kit-1 **r2**, 2026-11-17. Engine Architect. Proto `/tmp/p1-r2` branch `p1-5-r2`, head `2db004f6f3b36edc1cd41dc5182366aaa6ef912b`, tree `9191701c5ce1a90017a0411f74b5a8675e74425b`, parent `bb975418842826b5d1d3f132c6d341edbbd1ef42`. 10 files, +311/−2 = **313 changed lines** (src 147, tests 166). Green **937/0**. N = 9. Hard cap 400.

## Goal
After P1-4, unseated sides have no product bot, `acceptedCheck` only accepts `kind === "move"`, and there is no `actions_per_turn` knob. After this step:
1. **Action budget.** `ACTION_BUDGET.actions_per_turn` defaults to 2 (BTF `CHESS_MOVES`, towerChess.ts:92). This step ships that knob only.
2. **Bot.** `botAbilityPriority` is an `AiHook`-shaped function (rules code, not in `src/core` / `src/sim` beyond the hook type). It loops over the side's 2 actions (not per unit). A spell already in reach is played before a basic and before a step (Modes A1; ENEMY_AI.md). Else it steps toward the nearest foe by orthogonal BFS, capped at `stepReach` 2. Ties: path length → lowest HP → placement. No RNG. Neutrals are not foes (player-side merchant is). Local HP/position tracking so a killing first action is not followed by a shot at the body. `shotRow` and `setup.stats` lookups use `Object.hasOwn` (or a Map), not a prototype-key read.
3. **Exploit.** `acceptedCheck` (`exploit.ts`) allows a legal `ability` or `interact` when `snapshot.rules` is present (rules on), the actor is living and on the side, the target is a unit aim, and `durationMs` is null. Off-rules worlds still require `move`.
4. **Chaos rules plant.** `SNAPSHOT_KEYS` already includes `"rules"`; `divergentSnapshotKey` is exported so a rules-only snapshot diff is named `"rules"`.
5. **Soak.** Bot-vs-bot, 200 seeds, every run ends (not `timeout`); a second run of the same seed has an equal snapshot hash.

## Rulings made
- Pathing is orthogonal BFS with cap 2 (Modes proposed `max_step` 2). BTF uses rays. Open: stay on BFS or switch to `walks()` rays later.
- Foes are `side !== self && side !== "neutral"` (merchant is a player unit and can be hunted).
- The hook returns up to `actionsPerTurn` actions in one call (the match driver asks once per side turn); it tracks HP and cells locally so the second action sees the first.
- `botAbilityPriority` takes `setup?: BattleSetup` in opts (the world hook is `Battle`, not the setup document).
- Own-key lookups: `shotRow` uses `Object.hasOwn` on `setup.abilities`; HP/atk reads use `Object.hasOwn` on `setup.stats`.

## Open questions
- Confirm BFS vs BTF rays for the bot step, and whether `stepReach` should follow the unit's installed `step-pattern` (default orthogonal-1, cap 2) instead of a fixed 2.
- Should the player-side merchant count as a foe for the bot, or only sides listed in the match?

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/btf-adapters/src/btf-defaults/turns.ts` | new: `BTF_TURN_DEFAULTS` | 4 | 6 |
| `src/btf-adapters/src/index.ts` | export `BTF_TURN_DEFAULTS` | 1 | 2 |
| `src/rules/turns/action-budget.ts` | new: `ACTION_BUDGET` | 16 | 20 |
| `src/rules/turns/bot-ability-priority.ts` | new: `botAbilityPriority` (own-key `shotRow` and `stats`) | 117 | 130 |
| `src/sim/chaos.ts` | export `SNAPSHOT_KEYS`, `divergentSnapshotKey` | 2 | 4 |
| `src/sim/exploit.ts` | `acceptedCheck` allows ability/interact when rules are on | 5 | 8 |
| `src/sim/index.ts` | re-export the chaos keys | 2 | 4 |
| `tests/parity/action-budget.parity.test.ts` | new, shipped, byte-identical | 11 | 11 |
| `tests/rules/bot-p15.test.ts` | new, shipped, byte-identical (incl. 200-seed soak) | 120 | 130 |
| `tests/rules/bot-qa-p15.test.ts` | new, shipped, byte-identical (QA pin M1) | 35 | 35 |
Total ≤ 400 changed lines (proto **313**: src 147, tests 166). Hard cap 400.

## Tests that prove it is done (9 new; ship all three files byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-5-enemy-turn/` to the same paths at the repo root. `tests/rules/bot-p15.test.ts` (7 tests, including the 200-seed soak), `tests/parity/action-budget.parity.test.ts` (1), and `tests/rules/bot-qa-p15.test.ts` (1, QA pin; sha256 `2c04c0a3e0350149cd3d1e26960beef1f91b874ad8cd403dc7638ce19320050f`). N = 9.

## How a planted bug is caught
EA plants 15/15 (`p1-5-plants.py`). A default budget of 3, a bot that prefers a basic or a step over a spell already in reach, treating neutrals as foes, not tracking a kill locally, `acceptedCheck` still requiring `move`, dropping `"rules"` from `SNAPSHOT_KEYS`, or a default `stepReach` of 99 each fail a shipped test.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 937 tests passing** (main's count at Base + 9, once P1-4 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the stack: 937/0.)
- [ ] If P1-4 is not on main, or if P1-4's APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] The 200-seed soak all end; same-seed replay hashes match.
- [ ] Each file within its cap; ≤ 400 changed lines in total (313 in the proto). Hard cap 400.
- [ ] All three shipped test files are byte-identical to the kit copies.
- [ ] Never touch `painter-proto/` or `ui-shell/`. The bot lives in `src/rules/turns/`, not in `src/core`. `src/sim` only changes the exploit/chaos hook seams. Cites use `towerChess.ts:<line>` (no `g-tile-engine` path in `src/`).

## Floor
`npm run green` is at least **937** tests passing (main's count at Base + 9, once P1-4 is on that main: 904 + 13 + 11 + 9). If main's count at Base (with P1-4 already merged) is C, the floor is C + 9.

## Not in this step
- Mana spend, card hand, flask logic, contest AI → later.
- Player door for choosing line-shot → P1-6.
- Seated-bot intents wrapper (the hook already returns `Action`s for `runMatch` `ai`).

## Out of scope
painter-proto, ui-shell, GitHub push, core-types.

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts`, `src/sim/migrations`, every pin file except the shipped QA pin `bot-qa-p15.test.ts`. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 937 tests passing** and 0 failing (main's count at Base + 9). Paste the summary line into HANDBACK.md.
- All three shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (P1-4 already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-5-enemy-turn-r<N>-chatA` (base = current main when you start; P1-4 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-5-enemy-turn-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, and `pass N fail 0`.
