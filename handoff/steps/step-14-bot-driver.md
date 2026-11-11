# step-14-bot-driver: the test bot sends 09c intents through the player driver; the action hook is deprecated, kept for parity

Step id: step-14-bot-driver          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `dbbc5f4142887c9e64e09db6ae228a60cf4b02cd` on `main` (step-13-chaos-generators r1 merged, PR #18); the diff is always `dbbc5f4..<head>`
Branch: `step/step-14-bot-driver-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-14-bot-driver-r<N>.bundle dbbc5f4142887c9e64e09db6ae228a60cf4b02cd..step/step-14-bot-driver-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-14-bot-driver/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-11-player-driver (`createPlayer`, `Seat`, `IntentHook`, seats in `runMatch`; `asIntents`, `counter` in `tests/sim/seats.ts`), step-09b-match-drivers (`runMatch`, `AiHook`, the test AI `forward` and `reachFarRow` in `tests/sim/ai.ts`), step-09c-input-sim-script (`Intent`, `npm run sim`, `scripts/sim.ts`, CN-006), step-12-chaos-harness and step-13-chaos-generators (their tests now use the bot)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 10, 12, M6, M7; §3 (the `src/sim/` and `scripts/` rows); §7; `handoff/steps/step-11-player-driver.md` Behaviour 2 and 6 (the reject reasons, the seated turn)
Kit: kit-2, 2026-11-11. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 181/0) on Node 24.22.1 on top of `main` `dbbc5f4`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `main` `dbbc5f4` is green with it (Architect check, 176/0; `npm run sim` 48/2 and 22/28, unchanged by this step).
Carries: no Change Notice. `scripts/sim.ts` is a tools file (CN-006: may import `src/sim` and `tests/`); BUILD_GUIDE §7 makes only `scripts/check-state.sh` CN-only, and this step names `scripts/sim.ts` in its file list. M6 still reads true (the bot is a `(world, side, budget)` hook with no phase parameter and emits the same events and commands as a player; `AiHook` stays for `runTicks` and for unseated sides). `.dependency-cruiser.cjs` (`dcf61c61…`), `package.json`, BUILD_GUIDE and STATES are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give the test bot the same one door as touch, chaos and a later online peer. `bot(seed)` is the test bot as an `IntentHook`: the same choices as the old action hook `forward(seed)` (same `"ai"` stream, same draws, same cells), answered as 09c intents (`SelectUnit`, then `TargetCell`), never as actions. `seatAll(world, sides, intents, moveMs)` seats every side through `createPlayer` with one shared id source, and `npm run sim` now plays every match that way with **no `ai` at all**; its two lines stay byte for byte. `MatchOptions.ai` becomes optional and deprecated: `runMatch` throws `RangeError` when a side has neither a seat nor the hook, so nothing on the bot path can fall back to it. The chaos tests use `bot(seed)` instead of `asIntents(forward(seed))`. The parity test the CEO asked for (old hook vs driver) stays and gets stronger: per seed it compares outcome, events, log, history and the final snapshot.

This is the follow-up the CEO set after chaos steps A–C (ruling 2026-11-11: "the test bot will eventually send intents through the step 11 driver, and the direct action hook will be retired; keep the parity test until then").

Rulings in this step (CEO 2026-11-11, via Chief Of Staff; Engine Architect 2026-11-11):
- **Keep the old hook deprecated, with parity; do not remove it yet (Architect).** Removing `AiHook` now would (1) strand `runTicks`, the tick driver for idle RPG and tower defence, which has no seats until tick-mode tables exist; (2) change M6's wording in BUILD_GUIDE (a Change Notice) and rewrite the step-09b tests that test the hook path itself; (3) end the parity test the CEO asked to keep. So in this step the bot stops using the hook, `npm run sim` and the chaos tests stop using it, `ai` becomes optional and `@deprecated`, and the parity test runs the real bot against the old hook on all 100 seeds. The hook, `forward`, `asIntents` and the parity tests go together in one later step, with the CN, once `runTicks` can take seats; this step's first test (the pinned histories with no `ai`) then becomes the only pin.
- **Online play is just another driver (CEO standing rule).** The door does not learn who is playing: `src/sim/player.ts` is unchanged, `src/core`, `src/state`, `src/rules`, `src/runtime` and the chaos files are unchanged, and the only `driver-phase.ts` change is about the deprecated hook. A test plays a match whose seats are fed only from intents that went through `JSON.stringify` / `JSON.parse` (what a peer would send) and gets the same per-step snapshot hashes, log and history as the bot that produced them.
- **The bot is test code (law 4).** Choosing a cell is a game rule; the bot stays in `tests/sim/ai.ts` next to `forward`, sharing one private chooser so the two cannot drift. `src/` gains no bot, no move time and no id scheme. The move time `200` and ids `m1, m2, …` stay test values (`seatAll`'s id source; `scripts/sim.ts`'s `botMoveMs`, named as a test value like `btfPresetTurnFuseMs`).
- **Rejects are a pass, but reported (CEO Q3).** The bot itself is never rejected on the two boards (asserted), and a forged input placed in front of its batch is listed as a reject and changes nothing else. Every `PlayerReject` reason is reached in one test, including the two the public API cannot reach today (a selected unit that turns foreign or dies before the tap), through a read-only `units` view in the test.
- **Same histories, byte for byte:** `npm run sim` prints exactly the base's two lines; the chaos smokes print exactly the base's four lines.

## Files to create or change
- change `src/sim/types.ts`: the `ai` line of `MatchOptions` only, as quoted (≤ 7 changed lines)
- change `src/sim/driver-phase.ts`: the no-seat-no-ai `RangeError` and the deprecated-hook call, as in Behaviour 2 (≤ 12 changed lines)
- change `tests/sim/ai.ts`: one private chooser `picker`, `forward` on top of it (same signature, same output), new `bot` (≤ 38 changed lines)
- change `tests/sim/seats.ts`: new `seatAll`; `asIntents` and `counter` unchanged (≤ 12 changed lines)
- change `scripts/sim.ts`: bot seats instead of `ai: forward(seed)` (≤ 12 changed lines)
- change `tests/sim/chaos.test.ts` and `tests/sim/chaos-gen.test.ts`: `asIntents(forward(n))` → `bot(n)` and the imports; nothing else (≤ 14 and ≤ 16 changed lines)
- create `tests/sim/bot.test.ts` (≤ 110 lines)

Size: ≤ 200 changed lines in total, counting insertions + deletions; the per-file caps above add up to 221 (prototype: 155 insertions, 25 deletions = 180). No new fixtures. If you pass ~190, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 09b/11: `AiHook`, `IntentHook`, `IntentInput`, `MatchOptions`, `Seat`, `SimWorld`, `createPlayer`, `runMatch`. From core-types: `SideId`, `Sq`. Import these; never retype them.
```ts
// src/sim/types.ts — MatchOptions: the ai line becomes (nothing else in the file changes; TickOptions keeps `readonly ai: AiHook;`)
  /** @deprecated Step 14: the M6 action hook, kept only for unseated sides (the step-09b tests and the parity test) until a ruling retires it. Bots send intents through `seats`. Required unless every side is seated. */
  readonly ai?: AiHook;
```
```ts
// src/sim/driver-phase.ts — the new RangeError (exact message), checked after "runMatch: bad seats" and before BATTLE_READY
throw new RangeError("runMatch: every side needs a seat or the ai");
```
```ts
// tests/sim/ai.ts — exported declarations (forward's signature is unchanged; picker is private)
export function forward(seed: number, durationMs = 200): AiHook;
export function bot(seed: number): IntentHook;
// tests/sim/seats.ts — new export
export function seatAll(world: SimWorld, sides: readonly SideId[], intents: IntentHook, moveMs: number | null): Seat[];
```
```ts
// scripts/sim.ts — the runMatch call becomes
const result = runMatch(world, { sides: [...sides], victory: reachFarRow, fuse, maxRounds: 40, maxSimMs: 600000, seats: seatAll(world, sides, bot(seed), botMoveMs) });
```
`createPlayer`, `PlayerStep`, `PlayerReject`, `Seat`, `IntentHook`, `runTicks`, `TickOptions` and `src/sim/index.ts` are unchanged; `src/sim/{actions,intents,run,world,driver-tick,player,chaos,chaos-gen,shrink,index}.ts` are unchanged.

Behaviour (exact; each line has a test):
1. **`ai` is optional:** a `MatchOptions` without `ai` type-checks. `runTicks` still requires its `ai`.
2. **runMatch:** after the existing option and seat checks, `RangeError("runMatch: every side needs a seat or the ai")` when `ai` is missing and some side in `sides` has no seat. An unseated side's turn asks `opts.ai` exactly as at the base (same events, submit order and timing); a seated side's turn never reads `opts.ai` (step 11 Behaviour 6, unchanged). With every side seated, `ai` may be absent. Name in Decisions how you reach the hook without a non-null assertion (the prototype calls `(opts.ai ?? noAi)(world, side, …)` with a private `noAi` that throws `Error`, unreachable after the check).
3. **One chooser, two faces:** `picker(seed)` holds `createRng(streamSeed(seed, "ai"))` and, for a unit id, returns the cell `forward` chose at the base (`undefined` for an unknown unit, with no draw; else exactly two `rng.next()` draws, then ahead / sideways order, first in-bounds open empty cell, or `undefined`). `forward(seed, durationMs)` maps each chosen cell to `move(\`m${n}\`, id, c, r, durationMs)` as before. `bot(seed)` maps each chosen cell, in budget order, to `[{ intent: { type: "SelectUnit", unitId: id } }, { intent: { type: "TargetCell", at: { c, r } } }]` (fresh `{ c, r }`, no `aim`) and skips a unit with no cell. One `bot(seed)` is shared by every seat of a match (one stream, as `forward(seed)` was shared by every side).
4. **`seatAll(world, sides, intents, moveMs)`:** one `counter("m")` for the whole match, then one seat per side in `sides` order: `{ player: createPlayer(world, { side, moveMs, nextId }), intents }` (no `onStep`).
5. **`npm run sim`:** every side seated by `seatAll(world, sides, bot(seed), botMoveMs)` with `botMoveMs = 200` (a named test value in `scripts/sim.ts`), no `ai` key; output unchanged.
6. **Chaos tests:** every `asIntents(forward(n))` in `tests/sim/chaos.test.ts` and `tests/sim/chaos-gen.test.ts` becomes `bot(n)`; every count, hash and diagnostic they assert stays as at the base.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/sim/bot.test.ts`. Common: `base = { victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000 }`; `boards` = `stage-fixed` (`player, wolves`, 48/2, `afc89d56…`) and `stage-weighted` (`player, rival`, 22/28, `b8007292…`), the full pins as in step 11; `botMatch(stage, sides, seed, intents = bot(seed))` = `seedless(input(stage, seed))`, `seatAll(world, sides, intents, 200)`, `runMatch` with **no `ai`**, and every seat's `history()`.
- `tests/sim/bot.test.ts`
  - "the test bot plays only through the player driver: no ai, the pinned 50-seed histories, no rejects, every logged move is a player step": both boards, seeds 1–50, `botMatch`. Outcome counts and `sha256(JSON.stringify(histories))` equal the pins. Per match, the ids of every step's action, in numeric order, are exactly `m1 … m<log.lastSeq()>` (no move reached the log except through a player), and every step has `reject` null and intent type `SelectUnit` or `TargetCell`.
  - "parity (CEO: kept until the old hook is removed): the deprecated action hook and the bot through seats give the same outcome, events, log and history on every seed": both boards, seeds 1–50: `runMatch(..., ai: forward(seed))` with no seats against `botMatch`; `[result, log.toJSON(), bus.history(), snapshot(world)]` deep-equal.
  - "the bot answers only with SelectUnit / TargetCell pairs for the units in its budget; a forged input in front of its batch is a reported reject and changes nothing else": on `seedless(input("stage-fixed", 3))`, `bot(3)` for `player` with units `knight#1, archer#2, merchant#6` gives exactly `SelectUnit knight#1, TargetCell (0,7), SelectUnit archer#2, TargetCell (1,7), SelectUnit merchant#6, TargetCell (4,3)`; for `["ghost#9"]` it gives `[]`. A hook that puts `SelectUnit wolf#3` and `Confirm` with aim `(0,7)` in front of the player's first batch gives the same `result`, log and history as plain `bot(3)`, and its rejects are exactly `[SelectUnit, notOwn]`, `[Confirm, noEvent]`.
  - "every reject reason is reached and changes nothing, including a selected unit that turns foreign or dies before the tap; a side with no seat and no ai throws": a `stage-fixed` world seen through a `units` view whose `get` can overlay `{ alive: false }` or `{ side: "wolves" }` on one unit (read-only; nothing is written to the world), phases `idle`. In order: `Confirm` → `noEvent`; `Cancel` → `illegal`; `SelectUnit wolf#3` → `notOwn`; `SelectUnit knight#1` while dead → `noUnit`; `SelectUnit knight#1` → accepted; `TargetCell (6,8)` → `offGrid`; knight now foreign, `TargetCell (0,7)` → `notOwn`; knight now dead, `TargetCell (0,7)` → `noUnit`; `Cancel` → accepted; phases `targeting`, `Confirm` aim (0,7) → `noAction`. Each reject has no action and leaves `units`, `occupancy`, `logSeq` and `phases` unchanged; the set of reasons equals the keys of a `Record<PlayerReject, true>` listing all six (so a new reason fails to compile until it is tested); `log.lastSeq()` 0 and ten history entries. Then `runMatch` with no `ai` and only a `player` seat throws `RangeError` with the exact message; no `ai` and no seats throws `RangeError`; both sides seated with `bot(1)` and no `ai` plays to `win` on `input("stage-fixed")`.
  - "online is just another driver: seats fed only from intents sent as JSON (as a peer would) give the same per-step snapshot hashes, log and history; nothing in src/ knows": `seedless(input("stage-weighted", 5))`, both sides seated with a shared `counter("m")`, `moveMs` 200, `onStep` pushing `sha256(JSON.stringify(snapshot(w)))`. Run 1: one `bot(5)`, each hook answer also pushed as `JSON.stringify(answer)` onto a wire list. Run 2: the hook returns `JSON.parse(wire[i++])`. More than 50 hashes, every wire entry used, and `{ result, hashes, log, history }` deep-equal.
- `tests/sim/chaos.test.ts`, `tests/sim/chaos-gen.test.ts`: only the swap in Behaviour 6. Their smokes still print `chaos smoke stage-fixed seeds 1-50: runs 50 failed 0 steps 3120 rejects 0`, `… stage-weighted …: runs 50 failed 0 steps 5542 rejects 0`, `chaos gen smoke stage-fixed seeds 1-20: runs 20 failed 0 steps 1730 rejects 278 shrunk 0->0` and `… stage-weighted …: runs 20 failed 0 steps 3154 rejects 563 shrunk 0->0`.

## How a planted bug is caught (for QA; prototype `6fceeff`; reverted after each)
| Plant (one edit) | Tests that fail (of 181), by name |
|---|---|
| bot also submits one move itself on its first call | this step's pinned-histories ("every logged move is a player step"), parity and online tests; step 12's clean run and smoke; step 13's kinds test and generator smoke; the sim report test |
| bot on another stream / skips its first unit / sends `TargetCell` before `SelectUnit` | the pinned-histories, parity and pairs tests, the sim report test, step 12's clean run, step 13's generator test (plus step 13's shrink for the last two, and the reject-reasons test and step 13's kinds for the order swap) |
| bot adds an `aim` to its tap | the pairs test; step 13's kinds and shrink tests |
| `forward` alone on another stream | parity; step 11's 50-seed test |
| `seatAll`: one id source per side / `moveMs` dropped / first side only | parity and the pinned-histories test (plus the sim report test for the last two; plus the pairs and reject-reasons tests for the last) |
| driver asks `ai` for a seated side when one is given | step 11's 50-seed, gesture and onStep tests; step 12 and 13 tests (their `ai` throws) |
| no-seat-no-ai `RangeError` removed / replaced by a silent stall | the reject-reasons test |
| the check written with `||` (refuses a side without a seat even when `ai` is given) | the pinned-histories, parity, pairs, reject-reasons and online tests; the sim report test; the step-09b match, fuse and snapshot tests |
| a rejected step's event appended | the pairs (forged-input) test |
| a seat asked twice per turn | pinned histories, parity, pairs, sim report; step 11's 50-seed and gesture tests; step 12's clean run, broken-promise and checks tests; step 13's generator and shrink tests |
| `onStep` skipped after a reject | step 12's broken-promise and checks tests; step 13's generator, kinds, shrink and smoke |
| each `PlayerReject` branch in `player.ts` disabled or renamed (eight plants: `noEvent`→`illegal`, no `illegal`, dead select, foreign select, no `noAction`, dead tap, foreign tap, off-grid tap) | the reject-reasons test every time (dead select and foreign tap are caught **only** by it), plus step 11's reject test for six of them |

All 24 test plants fail at least one named test. Two bypasses give the same histories by design, so no test can see them; the greps catch them: `scripts/sim.ts` back on `ai: forward(seed)` (or `ai` plus seats) and a chaos test back on `asIntents(forward(…))`. Grep plants (14/14 caught): those three, the bot building an action, a third intent type, the bot with its own chooser, `ai` required again, a who-plays word in the door, a side literal, a second `opts.ai` read, the reject list cut, the parity test dropped, `player.ts` edited, an extra file.

## Example
```ts
const world = createWorld(input);
const seats = seatAll(world, ["player", "rival"], bot(seed), 200);          // tests and tools only: the bot is test code
runMatch(world, { sides: ["player", "rival"], victory, fuse, maxRounds, maxSimMs, seats }); // no ai: every move is an intent through a player
// online later: the same seats, with intents = the peer's queue; devices compare sha256(JSON.stringify(snapshot(world))) per step in onStep
```

## How later steps use this (context only; do not build)
- **Retiring the hook (one later step, with a Change Notice to M6):** after tick-mode tables give `runTicks` seats, remove `MatchOptions.ai`, `AiHook`, `forward`, `asIntents`, step 11's and this step's parity tests, and move the step-09b match tests onto seats; this step's pinned-histories test is then the only pin.
- The online driver: a seat whose `IntentHook` reads a peer's queue, with `onStep` comparing per-step snapshot hashes (the online test here is the shape).
- The dev-side exploit hunter feeds forged and replayed intents through the same seats; the `xp-levels` pick-of-three and the tap menu (Move, Attack, Ability, Item, Wait) arrive as new intents through this door, so the bot learns them without a new path.

## Decisions note: what to name
- How `runMatch` reaches the deprecated hook without a non-null assertion, and why the fallback is unreachable.
- How `forward` and `bot` share the chooser, and how you kept `forward`'s output byte-identical.
- How the reject-reasons test reaches the two reasons the public API cannot (the read-only `units` view), and that it writes nothing to the world.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). Intent only: BTF's `BUILD_LAW.md` rule 10, "an online action isn't done until its type is in the SEAT set" (one door for every seat), and its batch sim `scripts/sim-50.mjs`, whose bot calls game functions directly; here the batch bot uses the same door a player and a peer use.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/fx/**`, `src/btf-adapters/**`, `src/runtime/**`, `src/index.ts`, `src/sim/{actions,intents,run,world,driver-tick,player,chaos,chaos-gen,shrink,index}.ts`.
- `tests/fixtures/**`, `tests/sim/input.ts`, and every existing test except the two chaos files named above (in particular `tests/sim/player.test.ts`, which keeps step 11's parity test, `tests/sim/match.test.ts` and `tests/sim/script.test.ts`).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 181. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing). The chaos smokes print exactly the four lines in "Tests".
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628` and `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (unchanged).
- [ ] `npm run sim` prints exactly the base's two lines: `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- [ ] The bot never bypasses the door: `awk '/^export function bot\(/,/^}/' tests/sim/ai.ts | rg -n --pcre2 '\bmove\b|kind:|\bsubmit\b|durationMs|\bfeedIntent\b|\bcreatePlayer\b|\brunMatch\b|\.moveTo\(|\.append\(|\.place\(|\.remove\(|phases|\bnextId\b'` prints nothing; the same `awk` piped to `rg -o --pcre2 'type: "[A-Za-z]+"' | sort -u` prints exactly `type: "SelectUnit"` and `type: "TargetCell"`; `rg -n --pcre2 'const pick = picker\(seed\);' tests/sim/ai.ts` prints exactly two lines.
- [ ] No hook on the bot path: `rg -n --pcre2 '\bai\s*:|\bforward\b|\basIntents\b|\bsubmit\b' scripts/sim.ts` prints nothing and `rg -n --pcre2 'seats: seatAll\(world, sides, bot\(seed\), botMoveMs\)' scripts/sim.ts` exactly one line; `rg -n --pcre2 '\basIntents\b|\bforward\(' tests/sim/chaos.test.ts tests/sim/chaos-gen.test.ts` prints nothing; `rg -n --pcre2 '\bai: forward\(' tests/sim/bot.test.ts` exactly one line (parity) and `rg -n --pcre2 'asIntents\(forward\(' tests/sim/player.test.ts` exactly two (step 11, kept).
- [ ] The deprecated hook: `rg -n --pcre2 '^  readonly ai\?: AiHook;$' src/sim/types.ts`, `rg -n --pcre2 '^  /\*\* @deprecated Step 14: ' src/sim/types.ts` and `rg -n --pcre2 '^  readonly ai: AiHook;$' src/sim/types.ts` (TickOptions) each print exactly one line; `rg -n --pcre2 'throw new RangeError\("runMatch: every side needs a seat or the ai"\)' src/sim/driver-phase.ts` one line; `rg -o --pcre2 '\bopts\.ai\b' src/sim/driver-phase.ts` exactly two matches (the check and the one call); `rg -n --pcre2 '\bsubmit\(' src/sim/driver-phase.ts` exactly two lines (as at the base).
- [ ] The door is blind to who plays: `rg -n -i --pcre2 '\b(bot|online|peer|remote|human|touch|chaos|network)\b' src/sim/driver-phase.ts src/sim/player.ts` prints nothing; `rg -n --pcre2 'Record<PlayerReject, true> = \{ noEvent: true, illegal: true, noUnit: true, notOwn: true, offGrid: true, noAction: true \}' tests/sim/bot.test.ts` prints exactly one line.
- [ ] Report-only stays: `rg -n --pcre2 '\bt\.diagnostic\(' tests/sim/bot.test.ts` prints nothing; `tests/sim/chaos.test.ts` and `tests/sim/chaos-gen.test.ts` each still two.
- [ ] The step 11–13 law greps still print nothing: `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/sim src/runtime`; `rg -n --pcre2 'createHash|\bsubtle\b|\bcrypto\.|\bprocess\.' src`; `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/sim src/runtime`; `rg -n --pcre2 "[\"'](player|rival|neutral|wolves)[\"']" src/sim`; `rg -n --pcre2 'phases(\.\w+|\[[^\]]*\])\s*=(?!=)|phases\.battle\s*\?\?' src`; `rg -n --pcre2 "from ['\"][^'\"]*/sim/" src --glob '!src/sim/**'`; `rg -n --pcre2 "from ['\"][^'\"]*/(fx|btf-adapters)/" src/sim`; `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/sim src/runtime`; `rg -n --pcre2 '\bMath\.random\b|\bDate\.now\b|\bnew Date\b' tests/sim scripts`. And `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim src/runtime` prints exactly two lines, both in `src/sim/world.ts`.
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/fx src/btf-adapters src/runtime src/index.ts src/sim/actions.ts src/sim/intents.ts src/sim/run.ts src/sim/world.ts src/sim/driver-tick.ts src/sim/player.ts src/sim/chaos.ts src/sim/chaos-gen.ts src/sim/shrink.ts src/sim/index.ts scripts/check-state.sh scripts/check-law.sh package.json package-lock.json eslint.config.mjs tsconfig.json .dependency-cruiser.cjs BUILD_GUIDE.md docs tests/fixtures tests/sim/input.ts tests/sim/player.test.ts tests/sim/match.test.ts tests/sim/intents.test.ts tests/sim/replay.test.ts tests/sim/world.test.ts tests/sim/actions.test.ts tests/sim/script.test.ts tests/core tests/runtime tests/fx tests/state tests/project tests/rules tests/btf-adapters tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 200 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the eight files in "Files to create or change" (`A` for `tests/sim/bot.test.ts`; `M` for `scripts/sim.ts`, `src/sim/driver-phase.ts`, `src/sim/types.ts`, `tests/sim/ai.ts`, `tests/sim/seats.ts`, `tests/sim/chaos.test.ts`, `tests/sim/chaos-gen.test.ts`; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-14-bot-driver/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- **Removing the action hook** (`MatchOptions.ai`, `AiHook`, `forward`, `asIntents`, both parity tests) and M6's new wording: one later step with a Change Notice, after `runTicks` has seats (tick-mode tables first). Until then the hook is deprecated and the bot path cannot reach it.
- Seats in `runTicks`; moving the step-09b match, replay and fuse tests onto seats (they test the hook path itself).
- Dropping the throwing `ai` that `src/sim/chaos.ts` still passes (now optional; the file stays at its merged 124 lines and the throw is an equal guard).
- A product bot in `src/` (a game AI is rules, law 4; it comes with abilities and the tap menu and sends intents the same way), and a `CONFIRM_TARGET` action for the bot (M9).
- The stale outline §7 line QA noted at step 13 (the Architect fixes the outline outside this step).

## Out of scope
- Networking, online peers, lobbies, saves and imports, rewards or currency events.
- Any victory rule, attack, effect, move-range rule or HP check in `src/`.
