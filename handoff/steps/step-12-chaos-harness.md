# step-12-chaos-harness: the chaos harness (a match through the player driver only, QA checks after every step, one failure record, one-call replay)

Step id: step-12-chaos-harness          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `1ff51d984744c254321d4014afc045ce77a761a2` on `main` (step-11-player-driver r1 merged, PR #16); the diff is always `1ff51d9..<head>`
Branch: `step/step-12-chaos-harness-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-12-chaos-harness-r<N>.bundle 1ff51d984744c254321d4014afc045ce77a761a2..step/step-12-chaos-harness-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-12-chaos-harness/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-11-player-driver (`createPlayer`, `Seat`, `onStep`, `PlayerStep`), step-09-sim-harness (`snapshot`, `SimSnapshot`, `replay`), step-09b-match-drivers (`runMatch`, `VictoryRule`, the test AI and rule in `tests/sim/ai.ts`), step-09c-input-sim-script (`Intent`), step-01-state-tables (`xGo`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 5, 6, 10, 12, M4, M6, M7; §3 (the `src/sim/` row); `docs/chaos-player-outline.md` §2, §4, §5, §6, §8 (attached; sha256 `ef384d2a…`); `docs/qa/chaos-player-invariants.md` section (a) (attached; sha256 `13f93c68…`)
Kit: kit-2, 2026-11-11. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 170/0) on Node 24.22.1 on top of `main` `1ff51d9`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is new. `main` `1ff51d9` is green with it (Architect check, 166/0; `npm run sim` 48/2 and 22/28, unchanged by this step).
Carries: no Change Notice. `src/sim` already may import `src/state`, `src/core`, `src/rules` and `src/runtime/input`, and nothing imports sim; `.dependency-cruiser.cjs` (`dcf61c61…`), `package.json` and BUILD_GUIDE are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give the chaos player its referee. `runChaos(input, opts)` plays one seeded match **through the step-11 player driver only**: every side is seated, the old `ai` hook throws if it is ever asked, and every input comes from the caller's `IntentHook`. After every step (`onStep`) it runs a list of promises (the QA (a) checks that are cheap, deterministic and checkable on match state today, plus any the caller adds). On the first broken promise it stops the match and returns **one failure record** in the `docs/chaos-player-outline.md` §4 shape (seed, ruleset, options, the full move list, engine build, Node version, step index, invariant, first divergent snapshot key, expected vs actual, snapshot hash). `replayChaos(input, record, tools)` feeds that move list back through the same door in **one call** and gives the identical failure; a passing run replays to the identical result. A short report-only smoke on the two official boards runs inside `npm run green`.

This is step B of `docs/chaos-player-outline.md` §7 (A = `step-11-player-driver`, merged at `1ff51d9`; C = generators plus the simple shrink).

Rulings in this step (CEO 2026-11-10 and 2026-11-11, via Chief Of Staff; Engine Architect 2026-11-11):
- **Where it lives: `src/sim/chaos.ts` (product code, no Change Notice).** The record format and the checks are reused by step C and later by the dev-side exploit hunter (outline §9), so they are not test-only. `src/sim` may already import everything the harness needs, nothing imports sim, and it has no `node:` imports. `src/runtime/input` may not import sim or state, so it cannot host it.
- **Online play is just another driver (CEO standing rule).** The harness only builds players (`createPlayer`) and seats; it never calls `submit`, `feedIntent`, `moveTo` or the log. Nothing in `src/core`, `src/state`, `src/rules`, `src/runtime`, `player.ts` or `driver-phase.ts` is edited.
- **One clock (law 1):** the harness never steps or advances the clock; time moves only inside `runMatch` as in step 11. No `Date`, `performance.now`, timers or `Math.random`.
- **The hash and the build are the caller's (law 12):** `hash` is a caller function (tests pass sha256 from `node:crypto`; `src/` has no `node:` imports), and `engineSha` and `node` are required caller inputs (outline §4; research takeaway 3). `src` has no git access.
- **No auto-retry (outline §5):** one `runMatch` per run, no loop, no second attempt. A replay that differs from its record is a determinism bug against (a)4/(a)5, never a retry or a quarantine.
- **Report-only (CEO Q6/Q7; gate in outline §6):** the smoke test never asserts that a run is clean; a found failure is printed with `t.diagnostic` and must replay identically. The three mechanics tests pin the harness itself on the merged engine, like any unit test.
- **Promises are a list, not hardcoded (law 12; outline §9):** `CHAOS_CHECKS` is exported data; the caller passes the list it wants (no default set in `src/`), the record keeps the ids, and each later system adds its own checks.
- **BTF defaults only (CEO Q9), the two official boards and the reach-far-row end rule (CEO Q5).** The run plays no fx; the caller's `presets` bag (in tests `{ fxOptions: BTF_FX_PRESET }`) is copied into the record as-is so §4's option list is on file. No new `FxOptions` keys.
- **Rejects are a pass, but listed (CEO Q3):** the result lists the step index of every reported reject; a reject is a failure only if it changed something ((a)9).

## Files to create or change
- create `src/sim/chaos.ts`: `CHAOS_CHECKS`, `runChaos`, `replayChaos` (≤ 124 lines)
- change `src/sim/types.ts`: append the quoted block; no other line changes (≤ 48 changed lines)
- change `src/sim/index.ts`: the quoted file (≤ 7 changed lines)
- create `tests/sim/chaos.test.ts` (≤ 100 lines)

Size: ≤ 280 changed lines in total, counting insertions + deletions; the per-file caps above add up to 279 (prototype: 257 insertions, 1 deletion = 258). No new fixtures. If you pass ~265, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 01: `xGo`. From step 09/09b/11: `SimInput`, `SimWorld`, `SimSnapshot`, `snapshot`, `replay`, `runMatch`, `VictoryRule`, `MatchResult`, `IntentHook`, `PlayerStep`, `Player`, `Seat`, `createPlayer`. From step 09c: `Intent`. From core-types: `SideId`, `Sq`. From `src/rules/turns/fuse.ts`: `FuseSetting`. Import these; never retype them.
```ts
// src/sim/types.ts — append at the end of the file (the imports it needs are already there)
/** Chaos harness (step 12): the seven snapshot keys, one recorded input, and a promise checked after every step. */
export type SnapshotKey = keyof SimSnapshot;
export type ChaosMove = { readonly call: number; readonly side: SideId; readonly tick: number; readonly intent: Intent; readonly aim: Sq | null };
/** `prev` = after the last step; `before` / `fed` = just before / after the feed; `after` = after landing. */
export type ChaosView = { readonly step: PlayerStep; readonly prev: SimSnapshot; readonly before: SimSnapshot; readonly fed: SimSnapshot; readonly after: SimSnapshot; readonly world: SimWorld };
export type ChaosFinding = { readonly key: SnapshotKey; readonly expected: unknown; readonly actual: unknown };
export type ChaosCheck = { readonly id: string; readonly run: (view: ChaosView) => ChaosFinding | null };
/** Caller inputs, no defaults: the end rule, the promises, the hash (sha256 is the caller's), the build. */
export type ChaosTools = { readonly victory: VictoryRule; readonly checks: readonly ChaosCheck[]; readonly hash: (text: string) => string; readonly engineSha: string; readonly node: string };
export type ChaosSettings = {
  readonly sides: readonly SideId[];
  readonly fuse: FuseSetting;
  readonly maxRounds: number;
  readonly maxSimMs: number;
  readonly moveMs: number | null;
  readonly idPrefix: string;
  /** The caller's JSON settings for the run (e.g. the BTF FxOptions preset), copied into the record as-is. */
  readonly presets: Readonly<Record<string, unknown>>;
};
export type ChaosOptions = ChaosTools & ChaosSettings & { readonly ruleset: string | null; readonly intents: IntentHook };
/** Plain JSON: enough to replay the run without the original process (outline §4). */
export type ChaosRun = {
  readonly seed: number;
  readonly ruleset: string | null;
  readonly options: ChaosSettings & { readonly checks: readonly string[] };
  readonly moves: readonly ChaosMove[];
  readonly engineSha: string;
  readonly node: string;
  readonly engineVersion: string;
  readonly projectHash: string;
};
export type ChaosRecord = ChaosRun & {
  readonly stepIndex: number;
  readonly invariant: string;
  readonly firstDivergentSnapshotKey: SnapshotKey;
  readonly expected: unknown;
  readonly actual: unknown;
  readonly tick: number;
  readonly clockMs: number;
  readonly snapshotHash: string;
};
export type ChaosResult = { readonly outcome: MatchResult["outcome"] | "failed"; readonly run: ChaosRun; readonly failure: ChaosRecord | null; readonly hashes: readonly string[]; readonly rejects: readonly number[] };
```
```ts
// src/sim/index.ts — the whole file
export type { AiHook, Budget, ChaosCheck, ChaosFinding, ChaosMove, ChaosOptions, ChaosRecord, ChaosResult, ChaosRun, ChaosSettings, ChaosTools, ChaosView, IntentHook, IntentInput, MatchOptions, MatchResult, Player, PlayerOptions, PlayerReject, PlayerStep, Seat, SimInput, SimSnapshot, SimWorld, SnapshotKey, TickOptions, VictoryRule } from "./types.ts";
export { createWorld } from "./world.ts";
export { submit } from "./actions.ts";
export { advance, replay, replayTicks, restore, snapshot } from "./run.ts";
export { runMatch } from "./driver-phase.ts";
export { runTicks } from "./driver-tick.ts";
export { feedIntent, intentEvent } from "./intents.ts";
export { createPlayer } from "./player.ts";
export { CHAOS_CHECKS, replayChaos, runChaos } from "./chaos.ts";
```
```ts
// src/sim/chaos.ts — exported declarations
export const CHAOS_CHECKS: readonly ChaosCheck[];
export function runChaos(input: SimInput, opts: ChaosOptions): ChaosResult;
export function replayChaos(input: SimInput, run: ChaosRun, tools: ChaosTools): ChaosResult;
```
`createPlayer`, `runMatch`, `snapshot` and `replay` are unchanged; `src/sim/{actions,intents,run,world,driver-phase,driver-tick,player}.ts` are unchanged.

Behaviour (exact; each line has a test):
1. **Build inputs:** `runChaos` and `replayChaos` throw `RangeError` when `engineSha` or `node` is `""`.
2. **One door, every side seated:** `runChaos` calls `createWorld(input)` once, builds one `createPlayer(world, { side, moveMs, nextId })` per entry of `sides` (one shared `nextId` giving `${idPrefix}1`, `${idPrefix}2`, …), and calls `runMatch` **once** with every side seated, the caller's `victory`, `fuse`, `maxRounds`, `maxSimMs`, and an `ai` that throws `Error("chaos: the ai hook was asked")`. Each seat's hook passes the driver's `(world, side, budget)` to `opts.intents` unchanged. The harness never submits, steps the clock or writes phases.
3. **The move list:** every `feed` appends `{ call, side, tick, intent, aim }` to `run.moves`: `call` is the 0-based count of hook calls across all seats (a stall that returns `[]` still counts), `tick` is the `PlayerStep`'s tick, `intent` a JSON copy, `aim` a fresh `{ c, r }` or `null`. `run` keys are in the quoted order; `run.seed` is `world.seed`; `run.options` is `{ sides, fuse, maxRounds, maxSimMs, moveMs, idPrefix, presets (a JSON copy), checks: <the check ids in order> }`; `engineVersion` and `projectHash` come from `input`.
4. **After every step (`onStep`):** take `after = snapshot(world)`; push `hash(JSON.stringify(after))` to `hashes`; if the step is a reject, push its move index to `rejects`; then run `opts.checks` in order on `{ step, prev, before, fed, after, world }` (`before` / `fed` are snapshots taken just before and just after the feed; `prev` is the previous step's `after`, or the snapshot right after `createWorld` for the first step). The first non-null finding becomes the record and ends the match (the harness leaves `runMatch` by throwing and catches only its own stop; any other error propagates). Otherwise `prev = after`.
5. **`CHAOS_CHECKS`, in this order** (ids are the QA (a) rows; `expected` / `actual` are the values named):
   - `(a)5` one clock: every one of `before`, `fed`, `after` has an integer `clockMs` equal to `tick × world.clock.stepMs` (else key `clockMs`, expected `tick × stepMs`, actual `clockMs`), and `prev.tick ≤ before.tick = fed.tick ≤ after.tick` (else key `tick`).
   - `(a)12` sequenced log, one door: with `n` = 1 for a step with an action and 0 otherwise, `[before, fed, after].logSeq` equals `[prev.logSeq, prev.logSeq + n, prev.logSeq + n]` (key `logSeq`, both arrays).
   - `(a)9` rejects and no-ops: `units` and `occupancy` are unchanged from `prev` to `before` (nothing moves between steps); a reject changes none of `units`, `occupancy`, `logSeq`, `phases` from `before` to `after`; an accepted step without an action changes neither `units` nor `occupancy`; a move step changes no unit except its actor. The key is the first differing one, with `before`'s (or `prev`'s) value as expected.
   - `(a)6` phases: an accepted step's `fed.phases` equals `{ ...before.phases, battle: xGo(step.from, step.event) }` (key `phases`).
   - `(a)2` grid: every living unit is `inBounds` and on an open cell (key `units`, expected `[]`, actual the offending units).
   - `(a)1` one occupancy table: the sorted `"<cell index>:<id>"` pairs of `after.occupancy` equal those of the living units (key `occupancy`, both lists).
6. **End-of-run determinism `(a)4`:** when no check failed, `replay(input, world.log, tick)` with the live phases copied must give the live snapshot; otherwise the record has invariant `"(a)4"`, `stepIndex` = `moves.length`, the first differing of the seven keys, expected the replayed value and actual the live one.
7. **The result and the record:** `outcome` is `"failed"` when there is a record, else `runMatch`'s outcome; `failure` is the record or `null`. The record is `{ ...run (moves up to and including the failing step), stepIndex, invariant, firstDivergentSnapshotKey, expected, actual, tick, clockMs, snapshotHash }` in that key order; `tick` / `clockMs` are those of the failing snapshot and `snapshotHash` is `hash(JSON.stringify(<that snapshot>))`, so for a step failure it equals `hashes.at(-1)`.
8. **Replay in one call, no retry:** `replayChaos` throws `Error` in this order: `chaos: record is for <engineSha> on Node <node>` when the tools' build differs; `chaos: checks differ from the record` when the tools' check ids differ from `run.options.checks`; `chaos: project differs from the record` when `engineVersion` or `projectHash` differs; `chaos: world seed <seed> is not the record seed <seed>` when the world (built with `hostSeed: run.seed`) has another seed. It then plays exactly as `runChaos` with `run.options`, `run.ruleset` and the tools, but hook call `n` returns the recorded moves with `call === n`, in order, as `{ intent, aim }`; a recorded move for another side throws `chaos: replay diverged at call <n>`. A record replays to a deep-equal `failure`; a passing run (or its JSON) replays to a deep-equal result.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/sim/chaos.test.ts`. Common options in `chaos.test.ts`: `tools = { victory: reachFarRow, checks: CHAOS_CHECKS, hash: sha256-hex, engineSha: "1ff51d984744c254321d4014afc045ce77a761a2", node: "v24.22.1" }`; `opts = { ...tools, ruleset: "reachFarRow", sides: ["player", "wolves"], fuse: 60000, maxRounds: 40, maxSimMs: 600000, moveMs: 200, idPrefix: "m", presets: { fxOptions: BTF_FX_PRESET } }`. The **planted script** (test-only) answers the `player` side's first call with `SelectUnit knight#1`, `TargetCell (0,7)`, `Cancel`, `SelectUnit knight#1`, `TargetCell (0,6)`, and `[]` otherwise. The **planted promise** `"planted:knight-stays-low"` fails with key `units`, expected `"knight#1 on row 7 or 8"` and actual the knight's cell once the knight stands above row 7.
- `tests/sim/chaos.test.ts`
  - "a clean run goes only through the player driver, checks every step and replays identically from its JSON": `stage-fixed`, `seedless(input(stage, 3))`, intents `asIntents(forward(3))`: outcome `win`, `failure` null, 76 moves and 76 hashes, no rejects, `run.seed` 3; `Object.keys(run)` and `run.options.checks` (`(a)5, (a)12, (a)9, (a)6, (a)2, (a)1`) as quoted; the first move deep-equals `{ call: 0, side: "player", tick: 0, intent: { type: "SelectUnit", unitId: "knight#1" }, aim: null }`; `replayChaos(src, JSON round-trip of run, tools)` deep-equals the result. Replay with another `engineSha` or `node`, with `CHAOS_CHECKS.slice(1)`, or with `projectHash: "other"` throws the Behaviour 8 messages; `runChaos` with `engineSha: ""` or `node: ""` throws `RangeError`. A hook that returns `[]` on its first call and then the same `asIntents(forward(3))` path records the first move with `call: 1` (a stall that returns `[]` still counts), and `replayChaos` of that run's JSON deep-equals the result.
  - "a broken promise stops the match with one record in the outline §4 shape; the record replays the same failure; a change outside the door fails the end replay (a)4": `input("stage-fixed")` (stage seed `0x5eed`), `fuse: 1000`, checks `[...CHAOS_CHECKS, promise]`, the planted script: outcome `failed`; the record's keys are in Behaviour 7's order; seed 24301, `stepIndex` 4, 5 moves at ticks `[0, 0, 20, 20, 20]`, invariant `planted:knight-stays-low`, key `units`, actual `{ c: 0, r: 6 }`, tick 40, `clockMs` 400; `rejects` is `[2]` (the `Cancel` from `idle` is `illegal`); `snapshotHash` is `hashes.at(-1)`; `options.presets` is the JSON of `{ fxOptions: BTF_FX_PRESET }`. Replaying the record's JSON gives a deep-equal failure, twice; a record with `seed: 7` throws `chaos: world seed 24301 is not the record seed 7`. The same script with `CHAOS_CHECKS` only and `maxRounds: 1` has no failure; with a hook that also moves `wolf#3` to (2,1) through `world.units.moveTo` on the `wolves` side's first call (a second door, after the last step), the result is `failed` with invariant `(a)4`, `stepIndex` 5, key `units`, and replaying that run gives no failure (the fault was never in the moves).
  - "each QA (a) check passes a clean step and flags its planted fault with the key it names": every view of the planted script run (`fuse: 1000`, `maxRounds: 1`, captured by a spy check) passes all six checks. On copies of the move step (index 1) and the reject step (index 2): `after.clockMs + 1` → `(a)5` `clockMs`; `fed` one tick (10 ms) late → `(a)5` `tick`; `fed` and `after` `logSeq` 2 → `(a)12` `logSeq`; `before.logSeq` 1 → `(a)12` `logSeq`; the reject's `after.phases` `{ battle: "moving" }` → `(a)9` `phases`; `archer#2` moved to column 2 in the move step's `after`, or in its `before` → `(a)9` `units` (both); the move step's `fed.phases` `{ battle: "idle" }` → `(a)6` `phases`; `knight#1` at column −1 in `after` → `(a)2` `units`; the knight's occupancy entry two cells over → `(a)1` `occupancy`.
  - "chaos smoke, report-only (CEO Q6/Q7): both official boards, seeds 1-50, BTF defaults; a failure is printed and must replay, never asserted away": `stage-fixed` (`player, wolves`) and `stage-weighted` (`player, rival`), seeds 1–50 on `seedless(input(stage, seed))`, intents `asIntents(forward(seed))`, `node: process.version`. Per run it asserts only `hashes.length === run.moves.length` and, for a failure, that `replayChaos` of its JSON gives a deep-equal failure; it prints one `t.diagnostic` per failure (the record JSON) and one per board: `chaos smoke <stage> seeds 1-50: runs 50 failed <n> steps <n> rejects <n>` (prototype: 0 failed, 3120 and 5542 steps, 0 rejects). It never asserts that a run is clean.

## How a planted bug is caught (for QA; prototype `2ab00fd`; r1 `9a23fde` adds only the stall test; reverted after each)
| Plant (one line) | Record from the smoke (every one of the 100 runs) | Smoke test | Tests that fail (of 170) |
|---|---|---|---|
| `units.ts` `moveTo` keeps the old cell (`take` dropped) | `(a)1`, `stepIndex` 1, key `occupancy`, tick 20 | passes (report-only), each record replays identically | 10: the three chaos mechanics tests + 7 existing (incl. both 50-seed byte tests and `moveTo is atomic…`) |
| `log.ts` `lastSeq` skips (0, 2, 3, …) | `(a)12`, `stepIndex` 1, key `logSeq`, expected `[0,1,1]`, actual `[0,2,2]` | passes, records replay | 9: the three mechanics tests + 6 existing (incl. `seq is the 1-based append order…`) |
| `driver-phase.ts` `land` one tick short | `(a)9`, `stepIndex` 3, key `units` (the late move lands during the next unit's move) | passes, records replay | 7: the clean-run and planted-promise tests + 5 existing (incl. both 50-seed byte tests) |

Harness plants each fail a named test: drop the `(a)1` check (clean-run and check tests), skip the build check in replay (clean-run), feed every recorded move on call 0 (clean-run), turn off the reject check (check test), skip the end-of-run replay (planted-promise test).

## Example
```ts
const result = runChaos(input, {
  victory: reachFarRow, ruleset: "reachFarRow", checks: [...CHAOS_CHECKS, ...myPromises], hash: sha256, engineSha: gitHead, node: process.version,
  sides: ["player", "rival"], fuse: presetFuseMs, maxRounds: 40, maxSimMs: 600000, moveMs: presetMoveMs, idPrefix: "m", presets: { fxOptions: BTF_FX_PRESET },
  intents: myIntentSource,                                   // step C: the generators; an online peer later
});
if (result.failure !== null) save(JSON.stringify(result.failure)); // one file; later: replayChaos(input, JSON.parse(file), tools)
```

## How later steps use this (context only; do not build)
- Chaos step C: the generators are an `IntentHook` on their own `streamSeed(seed, <name>)` stream (legal, illegal and odd intents; gestures through `createGestureMapper`, recording pointer samples); the simple shrink drops moves from a record and keeps a shorter list only if `replayChaos` gives the same `invariant` and `firstDivergentSnapshotKey`.
- A `chaos:replay <file>` command and a checked-in failure-records folder (each record tied to its fix step, CEO Q8) need `scripts/` and `package.json` and come with their own step. The switch to blocking waits for 25 clean runs in a row (outline §6).
- The dev-side exploit hunter (outline §9) feeds forged and replayed intents through the same `runChaos`, with its own checks.

## Decisions note: what to name
- How you take the `before` / `fed` snapshots around the feed (the prototype wraps each player's `feed`), and how you stop `runMatch` on the first finding and tell your stop from a real error.
- How you count hook calls and pick a call's moves on replay.
- The exact `RangeError` message for Behaviour 1.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). Intent only: BTF's batch sim (`scripts/sim-50.mjs`) prints counts but cannot replay one failing match; here every failure is one replayable record. Not repeated: `towerTourney.ts:515`'s global `Math.random` patch.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/fx/**`, `src/btf-adapters/**`, `src/runtime/**`, `src/index.ts`, `src/sim/{actions,intents,run,world,driver-phase,driver-tick,player}.ts`.
- `tests/fixtures/**`, `tests/sim/{ai,input,seats}.ts`, and every existing test.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 170. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing). The smoke test prints the two `chaos smoke … seeds 1-50: runs 50 failed 0 …` diagnostics.
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628` and `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (unchanged).
- [ ] `npm run sim` prints exactly the base's two lines: `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- [ ] One clock: `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/sim src/runtime` prints nothing; `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim src/runtime` prints exactly two lines, both in `src/sim/world.ts`; `rg -n --pcre2 '\breplayTicks\b|\badvance\b|clock\.(step|after|advance)\b' src/sim/chaos.ts` prints nothing.
- [ ] One door: `rg -n --pcre2 '\bsubmit\b|\.append\(|\bfeedIntent\b|\.moveTo\(|\.place\(|\.push\(\s*\{\s*code' src/sim/chaos.ts` prints nothing; `rg -n --pcre2 '\bcreatePlayer\(' src/sim/chaos.ts` and `rg -n --pcre2 '\brunMatch\(' src/sim/chaos.ts` each print exactly one line; `rg -n --pcre2 'ai: \(\) => \{ throw new Error\(' src/sim/chaos.ts` prints exactly one line.
- [ ] No retry: `rg -n --pcre2 '\bplay\(' src/sim/chaos.ts` prints exactly three lines (if you name the shared runner differently, name it in Decisions and give the equivalent count: one definition, one call from each of `runChaos` and `replayChaos`).
- [ ] `rg -n --pcre2 '^export (function (runChaos|replayChaos)\b|const CHAOS_CHECKS\b)' src/sim/chaos.ts` prints exactly three lines; `rg -n --pcre2 '\{ id: "\(a\)(1|2|5|6|9|12)", run:' src/sim/chaos.ts` prints exactly six lines (or name your equivalent layout in Decisions).
- [ ] No numbers: `rg -n --pcre2 '(?<![\w.)])(?!(?:0|1)\b(?![.\w]))(?:0[xX][0-9a-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?|\.\d+)' src/sim/chaos.ts` prints nothing (this form also catches `10_000`, `.5`, `0x190` and `4e2`).
- [ ] The hash is the caller's: `rg -n --pcre2 'createHash|\bsubtle\b|\bcrypto\.|\bprocess\.' src` prints nothing; `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/sim src/runtime` prints nothing.
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/sim src/runtime` prints nothing, and `rg -n --pcre2 "[\"'](player|rival|neutral|wolves)[\"']" src/sim` prints nothing (sides are inputs).
- [ ] `rg -n --pcre2 'phases(\.\w+|\[[^\]]*\])\s*=(?!=)|phases\.battle\s*\?\?' src` prints nothing; `rg -n --pcre2 "from ['\"][^'\"]*/sim/" src --glob '!src/sim/**'` prints nothing; `rg -n --pcre2 "from ['\"][^'\"]*/(fx|btf-adapters)/" src/sim` prints nothing.
- [ ] Report-only: `rg -n --pcre2 '\bt\.diagnostic\(' tests/sim/chaos.test.ts` prints exactly two lines, both in the smoke test; `rg -n --pcre2 '\bMath\.random\b|\bDate\.now\b|\bnew Date\b' tests/sim` prints nothing.
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/fx src/btf-adapters src/runtime src/index.ts src/sim/actions.ts src/sim/intents.ts src/sim/run.ts src/sim/world.ts src/sim/driver-tick.ts src/sim/driver-phase.ts src/sim/player.ts scripts package.json package-lock.json eslint.config.mjs tsconfig.json .dependency-cruiser.cjs BUILD_GUIDE.md docs tests/fixtures tests/sim/ai.ts tests/sim/input.ts tests/sim/seats.ts tests/sim/player.test.ts tests/sim/match.test.ts tests/sim/intents.test.ts tests/sim/replay.test.ts tests/sim/world.test.ts tests/sim/actions.test.ts tests/sim/script.test.ts tests/core tests/runtime tests/fx tests/state tests/project tests/rules tests/btf-adapters tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 280 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the four files in "Files to create or change" (`A` for `src/sim/chaos.ts`, `tests/sim/chaos.test.ts`; `M` for the other two; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-12-chaos-harness/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- QA (a) rows not checked per step yet: **(a)3** pipes (only `tile` moves exist; the greps stay the gate), **(a)7** HP/shield (no such fields), **(a)8 / (a)15 / (a)16** fx order, 10b timeline and 10c look (the match plays no fx, and `src/sim` may not import `src/fx`; they need an fx-side chaos entry), **(a)10** gestures (step C, through the touch mapper), **(a)11** no hidden defaults and **(a)14** build law (static: greps, lint and depcruise), **(a)13** RNG (covered for now by the `(a)4` end-of-run replay, which compares `rngState`). Strict-one-per-cell occupancy is not a separate check.
- Input generation, gesture pointer samples in `moves`, the named generator stream and the simple shrink (step C).
- A `chaos:replay` CLI, writing record files, the checked-in known-failures folder and its format, nightly runs, and the switch from report-only to blocking (later steps; outline §6).
- Per-step hashes inside the record (they are in the result's `hashes`; a record stays one snapshot hash).

## Out of scope
- Real DOM / pointer wiring, networking, online peers, saves and imports, rewards or currency events (the dev-side hunter's later slices).
- Any victory rule, attack, effect or move-range rule in `src/`.
