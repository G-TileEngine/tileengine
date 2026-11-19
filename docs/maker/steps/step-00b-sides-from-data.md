# Step 00b: sides from data (S0b, TP-4)

r1, 2026-11-19, Engine Architect. First draft. Docs only. It's written to the same cold-builder standard as step 03b. Source rulings: EA R-E3 (free roam) and R-E5 (neutral, and colour by side), as quoted in `docs/maker/steps/step-04-stage-editor.md` r6 (Rules 13, the 4b **Prerequisite: S0b** paragraph, and the no-enemy info row). One builder run, gates on. **This is a play-stage step. It has no maker screen.** All measured numbers below come from a trial run of this step (see Measured).

**Why "00b":** this is the S0b follow-up to step 0's play stage (`step-00-play-input.md`), and step 4 r6 already calls it S0b. The name `04b` is taken by 4b, and `00b` sorts next to the step it extends.

Step id: `step-00b-sides-from-data`. Revision: r1 for the first run, r2, r3 … for rework rounds.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `3bd3e5db` (`3bd3e5d docs(maker): step 03b slice r29 … + step 04 stage editor r6`), or the latest main when CoS sends the go-line. CoS names the exact sha in the go-line.
**Test floor:** **1036 + 7 = 1043** on `3bd3e5db` (measured: `npm test` gives 1036 pass, 0 fail). If CoS gives a later base, the floor is that base's count + 7, and CoS gives the number. N = 7 (the named tests below); state it in the hand-back.
**Needs:** steps 0, 1a and 1b (all on `3bd3e5db`). It needs no maker code. **Blocks:** step 4b.
**Go-line position:** after **4a**, before **4b**. 4a edits `tools/play-stage/looks.ts` (ground frames, around line 46), and this step edits the same file (unit frames, lines 38–41). So CoS sends this go-line on the 4a merge to avoid a rebase. If 4a slips, this step may run on `3bd3e5db`, but both steps edit `tools/play-stage/looks.ts` (4a the ground frames around lines 35/46/49, this step `dressPx` at lines 38–41), so whichever merges second must rebase `looks.ts`. 4b waits on this step, 4a and 03b (step 4, Go-line order item 3).

## Delivery
Same shape as step 0 (`docs/maker/steps/step-00-play-input.md`, Delivery) and `handoff/HAND-BACK.md`.
- Branch: `step/step-00b-sides-from-data-r<N>-chatA`, from the base above. Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/step-00b-sides-from-data/r<N>/HANDBACK.md`, with the files and sections that `handoff/HAND-BACK.md` lists, plus § Sides, § Parity and § Smoke.
- Gate: `npm ci && npm run green` exits 0 at the floor above. `npm run green` runs `npm test`, typecheck, lint, deps, `check:state` (`scripts/check-state.sh`) and `check:law` (`scripts/check-law.sh`). `npm test` alone is not enough.
- **Touch smoke.** This step changes play-stage input and drawing, so the smoke below must print `TOUCH SMOKE PASS` at 390 and at 360 CSS px. Paste the ok lines in HANDBACK.md § Smoke.
  1. The S0 smoke, unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. **Required.** It is frozen at sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (107 lines; git blob `1f50845a`; last changed in `9fc4989`). Check that sha before you run it. It finds units by **sprite id** (`starter:hero-sword`, `starter:enemy-wolf`, `starter:hero-staff`, `starter:npc-villager`), so Rules 6 keeps those ids.
  2. **Only if step 3 is already on the base** (the file `handoff/steps/tests/s3-test/touch-smoke.mjs` exists): step 3's `?project=` smoke, unchanged: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798`.
  3. **Only if 4a is already on the base**: 4a's smoke, unchanged (`handoff/steps/tests/s4a-stage-paint/smoke.mjs`, the command in step 4).
- Push once, that branch only, through the one-shot credential helper that `handoff/HAND-BACK.md` gives (it reads `GH_BUILDER_TOKEN` from the shell; keep the single quotes).
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- **No token in any output.** Never print, echo, log, commit or store the token, including in `.git/config`. No token value may appear in any file, log, screenshot or message. If it ever does, say so in the hand-back.
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha, the test counts, the smoke PASS lines, the parity line (see Done when) and the line count.

## Goal
In plain words: the play stage only knows two teams today, "player" and "wolves". It is hard-coded. A stage whose enemies are called anything else gets no enemy turns, and a stage with no enemies ends at once as a "win". Unit colours come from a fixed list per unit type, so a Villager is always yellow even when the stage makes it an enemy. After this step the play stage takes its teams from the stage file. Every enemy side gets its turn. A stage with only your team is **free roam**: it never ends, and End Turn comes straight back to you. Each unit is coloured by its side: blue for yours, red for any enemy and yellow for neutral. The demo plays exactly as before. This is what 4b needs to place enemies and NPCs.

## Read first
1. `docs/maker/data/project-format.md` §6.5: `stage.sides?: {loadout?, enemyPool?, neutrals?}` defaults `player` / `rival` / `neutral`, the per-neutral `side?`, and `neutral` is **reserved**.
2. `docs/maker/steps/step-04-stage-editor.md` r6: Rules 13 (R-E5), the 4b **Prerequisite: S0b** paragraph and the no-enemy info row (R-E3).
3. Code, names and lines checked on main `3bd3e5db`:
   - `tools/play-stage/match.ts`: `SIDES = ["player", "wolves"]` (line 15) and `type Side` (16); `wipeRule(win.out, SIDES)` (25); `side: Side = "player"` (26); `finish` (38–48: `?? "player"`, `=== "player"` at 47); `pump` (`"wolves"` ×3 at 67); `play.landed` (`"wolves"` at 80); `endTurn` (`"player"` at 113; `"wolves"` at 117); `recentreTarget` (`"player"` at 123); `view` (`"player"` at 136); `ready` (`"player"` at 152); `play.feed` (`"player"` at 155).
   - `tools/play-stage/board.ts`: `createPlayer(world, { side: "player", … })` (73); `play.bot` = `botAbilityPriority(…)` (74); `pixelsOf` reads `TEAM[recipe.team]` (45); the scene's unit sprites (132: sprite id = `recipeOf(u.unitId).id`, asset per sprite id through `worn`).
   - `tools/play-stage/looks.ts`: `animId` (12), `unitAsset` (28), `dressPx` reads `TEAM[recipe.team]` (39–40).
   - `tools/play-stage/load.ts`: `TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a }` (6), `Recipe.team` (7), `fallback` (8), `RECIPES` `team` per row (10–16).
   - `tools/play-stage/hud.ts`: `view.side === "player"` (25 and 28).
   - `src/rules/battle/win.ts` `wipeRule` (17–29): it counts `sides[0]` against every other side **in the list**. A side not in the list (so `neutral`) is never counted. With a one-item list it returns `"win"` as soon as it is asked, so free roam must not call it (Rules 2).
   - `src/project/read/placements.ts` `resolvePlacements` (17–45): spawns get `stage.sides?.loadout ?? "player"` (23), the enemy pool `stage.sides?.enemyPool ?? "rival"` (27), and neutrals `e.side ?? stage.sides?.neutrals ?? "neutral"` (43). **`neutrals[].side` is already honoured here.** No change.
   - `src/rules/battle/targets.ts` line 10, `battle.ts` line 60 and `bot-ability-priority.ts` line 18 (`foeOf`) already treat side `"neutral"` as never a foe. No change.
   - `src/rules/turns/action-budget.ts`: one `actions_per_turn` (default 2) per match. `play.bot(world, side)` uses it for any side. There is **no** wolves-only budget.
   - The demo stage (`fixtures/demo.tileproj/stages/stage_01JDAS…0001.json`): `sides: {enemyPool: "wolves"}`. The Merchant is a neutral entry with `side: "player"`. It is a player-side unit today and stays one.
4. Tests that pin today's behaviour and must pass **unedited**: `tests/tools/play-stage-p17.test.ts` ("End turn runs the bot; Restart restores the demo; wiping the wolves is a win"), `tests/tools/touch-play.test.ts`, `tests/tools/play-stage.test.ts` (`pixels("starter:hero-sword")` at line 45), `tests/tools/play-stage-looks.test.ts` (`pixels(animId("starter:hero-sword"))` at line 57; `pixels("play:anim:constructor")` is undefined at line 53), and `tests/tools/play-stage-parity.test.ts` "(a) parity: seed 24301 bot versus bot equals the 1a golden" (golden `tests/tools/golden/demo-parity.json`, sha256 `90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839`).

## Rules (EA rulings)
1. **Sides come from the stage (R-E3).** A new pure helper `sidesOf(stage, units)` in `tools/play-stage/sides.ts` returns `{me, order, contest}`:
   - `me` is the player side: `stage.sides.loadout` when it is a string, else `"player"`. Read it with `Object.hasOwn` guards. No `JSON.parse`, `formatVersion` or `kind ===` (the P2 test scans `tools/play-stage`).
   - `order` is `[me, …every other side that has a unit at start]`, in placement order (`world.units.all()`, which is spawns, then pool, then neutrals), each once, **skipping `"neutral"`**.
   - `contest` is true only when **two or more** non-neutral sides have a unit at start.
   `createPlay` computes it once from `body.stage` and `world.units.all()`, and exposes it as `play.sides`. Sides never change during a match in this step.
2. **Free roam (R-E3).** When `contest` is false, the match never asks `wipeRule`: the wipe check is skipped at End Turn and after an ability. There is no outcome, and End Turn walks `finish` with a one-item `order` (`roundEnd` → `ROUND_BEGIN` → back to `me`). That already works once the wipe is skipped. Measured: no other change to `finish` is needed.
3. **No hard-coded side in `match.ts`.** Every `"wolves"` goes, and every `"player"` becomes `me`. `SIDES` becomes `play.sides.order`, and `type Side` becomes `string`. Every side after `me` is a bot side, run in `order`, each with `play.bot(play.world, side)` and the same `actions_per_turn` budget. In `pump` and `landed`, `side === "wolves"` becomes `side !== me`. In `endTurn`, run the bot for the side `finish` lands on when it isn't `me`. `board.ts` passes `side: play.sides.me` to `createPlayer`. `view()` adds `mine: side === me`, and `hud.ts` uses `view.mine` in place of `view.side === "player"` (both lines; colours unchanged).
4. **Neutral (R-E5).** A unit whose resolved side is `"neutral"` can't be targeted, doesn't act and isn't counted for a wipe. The rules already do this (Read first 3), and Rules 1 keeps `neutral` out of `order`. A `neutrals[]` entry **with** a `side` plays on that side. That's already resolved by `placements.ts`, and this step makes it real by giving every side its turn. **No Hostile toggle here.** It ships in 4b and writes `side` on the entry (step 4 Rules 13).
5. **Colour by side (R-E5).** `paintOf(side, me)` returns `"player"` when `side === me`, `"neutral"` when `side === "neutral"`, and `"enemy"` otherwise. `TEAM` becomes `{ player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a }`: same hex values, `wolves` renamed `enemy`. No new art. **Nothing reads `RECIPES[…].team` any more:** remove the `team` field from `Recipe`, `fallback` and the 7 rows. Names and ids stay.
6. **Sprite ids stay stable.** The frozen smoke and the existing tests find units by sprite id = recipe id, so:
   - Each unit's sheet is `animId(\`${recipeId}@${paint}\`)` (recipe ids have no `@`). `dressPx` splits at the last `@`, and paints only a known `RECIPES` id with an own `TEAM` key (`Object.hasOwn`). A plain `play:anim:<recipeId>` with no `@` paints neutral. `play:anim:constructor` stays `undefined`.
   - The scene sprite id is the recipe id for the **first** paint seen for that recipe in placement order. A unit of the same recipe in a different paint gets `<recipeId>@<paint>`. Build this once in `createPlay` as a `Map` from unit instance id to `{sprite, asset}`; it replaces `worn`.
   - `pixelsOf`'s plain recipe-id bake (board line 45) has no side, so it bakes `TEAM.neutral`.
7. Game rules stay out of `src/core` and `src/sim`. This step changes **no** file under `src/`.

## Build
| File | Job | Cap |
|---|---|---|
| `tools/play-stage/sides.ts` | new, pure: `NEUTRAL`, `type Paint`, `sidesOf` (Rules 1), `paintOf` (Rules 5) | 25 |
| `tools/play-stage/match.ts` edit | Rules 2 and 3: `SIDES`/`me`/`contest`; the guarded `wiped`; every `"wolves"` and `"player"` literal; `mine` in `view()` | 35 |
| `tools/play-stage/board.ts` edit | `sides` on `play`; `createPlayer` side; the paint map and scene sprites (Rules 6); line 45 neutral | 20 |
| `tools/play-stage/looks.ts` edit | `dressPx` by `@paint` (Rules 6) | 10 |
| `tools/play-stage/load.ts` edit | `TEAM` rename; drop `Recipe.team` and the 8 `team` values | 22 |
| `tools/play-stage/hud.ts` edit | `mine` in `HudView`; 2 lines use it | 8 |
| `tests/tools/play-stage-sides.test.ts` | new: the 7 named tests below | 110 |

**Hard gate: 400 counted lines** (insertions plus deletions in `git diff --numstat <base>..HEAD`, `handback/**` excluded). The caps sum to **230**. The trial used **155** (121 + / 34 −).

Named tests, all in `tests/tools/play-stage-sides.test.ts`. Build stage variants as `createMatch({ ...demoDocs(), stage: edited structuredClone(stage) }, 20)` with `demoDocs` and `U` from `tests/tools/demo-fixture.ts`. No new fixture file. **Each test must fail on the base** (checked on the trial: 7 of 7 fail on `3bd3e5db`).
1. **`sides: the demo builds [player, wolves] from data, wolves act on End Turn, and the turn returns`**: given the bundled demo, `play.sides.order` is `["player","wolves"]` and `contest` is true; after End Turn and the walks land, a Wolf has a log entry, the side is `player` and there's no outcome.
2. **`sides: an enemy pool on the default side 'rival' gets enemy turns and can be wiped for a win`**: given the demo with `sides` deleted (the pool resolves to `rival`), the order is `["player","rival"]`, and End Turn gives a Wolf a log entry and returns to `player`. With every Wolf removed, the next End Turn is a `win`.
3. **`sides: a stage with one side at start is free roam: no outcome, End Turn returns to the player`**: given `enemyPool: {mode: "fixed", entries: []}`, the order is `["player"]` and `contest` is false. Three End Turns in a row each leave `outcome === null`, side `player` and phase `idle`.
4. **`sides: a neutral placed with side = the enemy side ('rival') acts and is targetable`**: given `sides` deleted and the Villager's neutral entry with `side: "rival"`, and the Wolves removed, the Villager moved next to the Knight is in `targetsFor(…, "basic")`, and after End Turn the Villager has a log entry.
5. **`sides: a neutral with no side is never targeted, never acts and is not counted for the wipe`**: given the demo, the Villager next to the Knight is not a basic target, and `neutral` is not in `order`. With the Wolves removed, End Turn is a `win` while the Villager lives, and the Villager has no log entry.
6. **`sides: unit colour comes from side, not the recipe`**: given the demo, the first pixel of Knight, Wolf, Villager and Merchant (side `player`) is `TEAM.player`, `TEAM.enemy`, `TEAM.neutral` and `TEAM.player`. A Villager on the enemy side (one placed as a neutral with `side: "wolves"`, and one in the pool) is `TEAM.enemy`. An extra Wolf placed as a no-side neutral is `TEAM.neutral` while the pool Wolves stay `TEAM.enemy`.
7. **`sides: no play-stage file names the wolves or reads a recipe team`**: given every `tools/play-stage/*.ts`, no file matches `/wolves/` or `/\.team\b/`.

## Must NOT
- **No new framework, starter template or app scaffold** (for example TanStack Start, a sandbox preview server, borrowed visual themes). Build only inside the repo's existing stack, files and test gates, starting from the base above. No other theme or visual system.
- No change under `src/`: no edit to `wipeRule`, `resolvePlacements`, `targetsFor`, the bot or the action budget.
- No edit to any existing test, golden, fixture or file under `handoff/steps/tests/`. If an existing test fails, stop and report.
- No Hostile control, no maker change, no `side` written into any document (that's 4b).
- No new colour value and no new art. No change to `RECIPES` names or ids.
- No `JSON.parse`, `formatVersion` or `kind ===` in `tools/play-stage` (P2, `tests/project/load/one-parser.test.ts`, allowlist stays empty).
- No plain-object lookup by a document key without `Object.hasOwn` (or use a `Map`).
- **No empty `catch` and no silent default (Law 12).** `me` defaulting to `"player"` is the format's own default (§6.5), not a silent one.
- Offline, no new dependencies. Don't touch `tools/host-example/` (it has its own `["player","wolves"]` at line 17; out of scope).

## Done when
- **Gates:** `npm ci && npm run green` exits 0 at **1043** or more on `3bd3e5db` (or the later base's count + 7). That includes `scripts/check-law.sh` and `scripts/check-state.sh`. **Line count:** 400 or fewer by the rule above. Quote `git diff --shortstat <base>..HEAD -- . ':!handback/**'`.
- **P2 untouched:** "P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===" passes with no edit to `one-parser.test.ts`.
- **Parity:** § Parity pastes (1) the `✔ (a) parity: seed 24301 bot versus bot equals the 1a golden` line, (2) `sha256sum tests/tools/golden/demo-parity.json` on base and tip (both `90dde42a…`), and (3) an empty `git diff --stat <base>..HEAD -- tests/tools/golden/`.
- **Sides:** § Sides pastes the 7 named tests' ✔ lines, and a line saying each one failed on the base before the change.
- **Smoke:** § Smoke pastes `sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs` (`d528795e…`) and the 14 ok lines plus `TOUCH SMOKE PASS` (7 steps at 390, 7 at 360). The step 3 and 4a smokes are pasted too, if they're on the base.
- **Not the builder's gate:** CoS checks on a phone after merge that the demo looks and plays the same.

## Measured (trial run, 2026-11-19)
The trial applied exactly the Build above to a `/tmp` clone of `3bd3e5db`. Nothing was pushed or committed.
- `npm run green` exits 0, and `npm test` gives **1043 pass, 0 fail** (1036 + 7). Parity (a) passes, and the golden is unchanged (`90dde42a…`). No existing test was edited.
- The 7 named tests on the base without the change: **0 pass, 7 fail**.
- S0 smoke (`d528795e…`): 7/7 ok at 390 and 7/7 at 360, then `TOUCH SMOKE PASS`.
- Counted lines: `7 files changed, 121 insertions(+), 34 deletions(-)` (test 67, sides 16, match +12/−13, load +10/−10, board +9/−6, looks +4/−2, hud +3/−3).

## Rulings needed
None open.
- **Carried, not this step:** `stage.sides.neutrals` set to a side other than `"neutral"` makes all no-side neutrals a real side. They then act as a bot side, or join `me`. That follows the data (§6.5). 4b's editor never writes it.
- **Carried, not this step:** `scripts/sim.ts:15` still has `["player","wolves"]` in its stage-fixed report. Don't edit it: `tests/sim/script.test.ts` pins its output. `tools/host-example/match-picture.ts:17` also keeps its own `["player","wolves"]`; it is a hand-run host example, not runtime, and stays as is.
- **Carried, not this step:** a unit whose recipe is unknown (`starter:unknown-*`) has no frame on base, and still has none here. That's a later art step.
