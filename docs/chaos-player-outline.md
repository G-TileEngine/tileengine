# Chaos player — outline

**Owner:** Engine Architect, with QA & Build Guard
**Status:** OUTLINE 2026-11-11 (CEO answers Q1–9 in §8; gating answer, two chaos players and the online-driver rule folded in, §6, §9, §1)
**Base:** main `e9d48204668a58af1944e0b21909c2627a5ef2c7` (`e9d4820`)
**Research done (11 Nov):** `docs/research/chaos-player-research-ceo.md` (plain-words note), `docs/research/chaos-player-research-ea.md`, `docs/qa/chaos-player-research-qa.md`. Step A kit: `handoff/steps/step-11-player-driver.md`. This file is a one-page starter, not a step kit.

## 1. Scope

A seeded headless match, driven only through the step-09c intents and the step-09b drivers. Intents are `SelectUnit`, `TargetCell`, `Confirm`, `Cancel`, `BoxSelect`, mapped with `feedIntent` / `intentEvent`; gesture edges go through `createGestureMapper` and `PointerSample`. Drivers are `runMatch` and `runTicks`, plus `submit`, `snapshot`, `restore`, `replay`, `advance` and `replayTicks`.

Holds: no renderer; no direct state writes (phases replaced whole with `xGo`; units move only through `submit`); no game rules in the core (a `VictoryRule` is the caller's); one clock; integer ms. `feedIntent` submits no action (09c Behaviour 7). **CEO Q1:** chaos waits for a **player driver** that turns intents (`TAP_MOVE_CELL` / `CONFIRM_TARGET`) into `submit`. That driver is its own step, slotted **before** the chaos steps. Chaos never submits moves the way the test AI does. **CEO Q2:** gesture cases go through the touch mapper (`createGestureMapper`); other runs may feed the five intents directly.

**Standing rule (CEO, 11 Nov): online play is just another match driver.** The rules core never knows who is playing. Every move (human touch, bot, chaos player, later an online peer) arrives as a 09c intent through the one player driver: intents in, `submit` out. No rules, bot or offline code may need editing to add an online driver; a per-step snapshot hash must be possible from the driver's output (step A's `onStep`).

**Later steps** (the CEO wants these eventually; not this first cut): coverage-guided exploration; option-matrix sweeps (**CEO Q9:** first cut runs BTF defaults only, no 10b/10c non-default options) (full `FxOptions`, including stored keys that do not yet change the match); soak tiers up to 24 h; adversarial search; shrinking beyond a simple form. HP / shield / deck / hand checks wait for a rules step (QA invariant 7). An event-bus history cap is not in this scope.

## 2. Invariants

Taken from `docs/qa/chaos-player-invariants.md` section (a). Check after every action, except **(a)7** (not implemented yet). Probe cases already pinned in section (b) are the first checks, not new behaviour. Section (c) suggestions feed the generators below.

- **(a)1** Exactly one occupancy table; living ids only, in arrival order; failed `place` does not consume an id.
- **(a)2** Grid in-bounds and walls. A wall blocks both ways. `canStep` honours `hasWall`.
- **(a)3** UNIT and TILE are the only pipes. Pipes read logic cells (`get().at`, `occupantAt`), never `offset`. `resolveAim` never uses `edge` for the hit test.
- **(a)4** Replay is deterministic: same seed and the same log give the same `SimSnapshot`. Keys in order: `tick, clockMs, rngState, units, occupancy, phases, logSeq`. Restore is tick replay, then a shallow phases copy, then `JSON.stringify` equality.
- **(a)5** One clock, integer milliseconds, no second time source. Headless time moves only by `clock.step()`. No `Date` / `performance.now` / rAF / `setTimeout` / `setInterval` / `Math.random` in `src/fx`, `src/sim`, `src/runtime/input`, `src/btf-adapters`; `src/fx` never creates or steps a clock (G1/G8 = 0). The chaos player must not break this law either.
- **(a)6** Turn / phase legality. Live writes replace `world.phases` whole. `runTicks` never writes phases. `xGo` with no legal row returns `from`.
- **(a)7** HP and shield bounds — **deferred** until a rules step adds those fields.
- **(a)8** Fx cue order and monotonic times (`planFx` / `readFxOrder`; `endMs` ≥ hit time; seconds and connect×ms use `Math.round`).
- **(a)15** 10b timeline and landing at BTF defaults: `fixed_total` 400 ms with `per_body` impact, plus `pickLanding` (QA invariants doc `014485dd`).
- **(a)16** 10c look: seeded and repeatable, `u` always finite in [0,1], delay=1 gives u=0 and never NaN, sim untouched (QA invariants doc `014485dd`).
- **(a)9** Rejected or no-op intents do not move units or append a sim action (`BoxSelect` is a no-op; Confirm without aim is null; a bad `move` is `actionUnsupported` or `moveFailed`).
- **(a)10** Gesture ownership and once-only mode. The first pointer owns the gesture. `held` wins over `far`. A second `down` from the same owner is ignored (accepted build `45fa5c7`).
- **(a)11** Options and thresholds have no hidden defaults in `src/` (`GestureOptions`, fuse, side order and tick interval are caller inputs).
- **(a)12** Log is append-only and sequenced (`logSeq` is monotonic).
- **(a)13** Deterministic RNG: the same seed plus the same calls produce the same `rngState`. Seed-mismatch on replay is a hard error.
- **(a)14** Layering / build law (always-on, not match state): `src/fx` imports only types and core; nothing outside `src/sim` imports sim; no copied BTF tree.

## 3. Input generation

All generation is seeded. The generator uses a named stream via the existing `streamSeed(seed, name)` (then `createRng`), separate from the match RNG and from the test AI stream `streamSeed(seed, "ai")`. The `name` string is TBD in design.

- **Legal random moves:** pick a living unit and an in-bounds, open, empty neighbour (the same kind of step the test AI `forward` already makes), expressed as 09c intents and landed only through the player driver (§1, CEO Q1).
- **Illegal intents** (expected rejected or no-op; **CEO Q3:** a correct reject, or a throw the docs already name, is a **pass**, but each one is listed in the run report): `BoxSelect`; `Confirm` with `aim` null; `TargetCell` / `move` with target `null`, a unit aim, or an edge aim (`actionUnsupported`); a blocked tile (`moveFailed`); acting off-turn or in the wrong `phases.battle` (`xGo` returns `from`); a dead unit, or an id after `remove`; a double `submit` of the same action. After a reject, units, occupancy and `logSeq` are unchanged (phases may still change; see (a)9).
- **Odd inputs:** the 09c gesture edges in section (b) (hold at exact `holdMs` and just under; distance equal to `tapMaxPx` vs just over; first-pointer ownership; cancel of the owner; `up` without `down`; second `down` from the same owner; empty-start drag; a long drag past `holdMs`); out-of-grid cells (`c` / `r` negative or `≥ cols` / `≥ rows`); repeats; spam at the fuse edge (an action at `startFuse` expiry, mid-move, and a stalled side that returns `[]`). Also the documented `RangeError` sites (`cellPx` ≤ 0, time going back, non-integer `ms`, `advance` / `replayTicks` of `5` / `-10` / `1.5` / `NaN`, `startFuse` of `0`). Deck, hand and HP inputs are deferred (no such state yet).

## 4. Failure log format

One record, enough to replay without the original process. Compare snapshot keys with `JSON.stringify`, in the 09b key order. Values below are illustrative; the exact option bag and move encoding are TBD in design.

example shape:

```json
{
  "seed": 7,
  "ruleset": null,
  "options": { "fxOptions": "<full FxOptions>", "gestureOptions": { "cellPx": 64, "tapMaxPx": 10, "holdMs": 500 }, "fuse": 60000, "sides": ["player", "wolves"], "maxRounds": 40, "maxSimMs": 600000 },
  "moves": [{ "type": "SelectUnit", "unitId": "knight#1" }, { "type": "TargetCell", "at": { "c": 0, "r": 7 } }],
  "stepIndex": 1,
  "invariant": "(a)9",
  "firstDivergentSnapshotKey": "occupancy",
  "snapshotHash": "<sha256 of JSON.stringify of the full SimSnapshot>",
  "engineSha": "e9d48204668a58af1944e0b21909c2627a5ef2c7"
}
```

Required fields include `invariant` (the QA (a) id, or a new id), `ruleset` (an id or `null`), and `snapshotHash` (sha256 of `JSON.stringify` of the full seven-key `SimSnapshot`). `options` must include the full `FxOptions` plus the project options used in the run: `GestureOptions`, `FxReadLimits`, `FuseSetting`, the input fields of `MatchOptions` / `TickOptions` (`sides`, `maxRounds`, `maxSimMs`, `everyMs`), and any `readFxOptions` overrides (`FxLookTune` if the run touches look). `moves` is chronological, including illegal ones, with pointer `id`, cell and `ms` for 09c gesture samples, and the action / aim for `submit`. `stepIndex` is the index in `moves` of the first failing step. `firstDivergentSnapshotKey` is the first of `tick | clockMs | rngState | units | occupancy | phases | logSeq` that differs, or the key the violated invariant names. Also record expected vs actual of that key, `tick` / `clockMs` at failure, `engineVersion` and `projectHash` from `SimInput`, and Node 24.22.1 (step 10's half-up rule is JS `Math.round`). `engineSha` and the Node version are **required**: a move list replays the same failure only on the same engine build. The other extras are TBD in design.

## 5. Replay

Re-create the world with the logged seed and options, feed the logged `moves` back through the same path (`createGestureMapper` / `feedIntent` / `submit` / `runMatch` / `runTicks`, as recorded), and get a deterministic, identical failure: the same invariant, the same `firstDivergentSnapshotKey`, and the same `JSON.stringify` of that key. Use the same Node major (24.22.1). **CEO Q4:** a simple shrink is enough for the first cut: drop moves from the list while the same failure (same invariant and same `firstDivergentSnapshotKey`) still reproduces. Fuller shrinking is a later step.

**No auto-retry.** Chaos runs never retry. A run that passes sometimes and fails sometimes is a determinism bug against (a)4/(a)5, never a retry or a quarantine.

## 6. Run tiers

Placeholder only; numbers are TBD in design. No tier auto-retries (see §5). Later blocking phase: only a new failure bucket (invariant plus `firstDivergentSnapshotKey`) blocks; known old-step failures sit in a checked-in failure-records folder, each tied to its fix step (CEO Q8). Not in the first cut.

- **Smoke:** a short seeded batch inside `npm run green`. **CEO Q6:** green-check runs only for now.
- **Nightly:** not in the first cut (CEO Q6). Added once smoke cost is known; soak up to 24 h is a later step.

**CEO Q7:** chaos results are **report-only** at first (never fail the job); they block merges later. **Gate (CEO, 11 Nov):** report-only until **25 clean runs in a row with no false alarms** (CEO range 20–30; Engine Architect picked 25; tunable later); then chaos may block merges. Every blocking failure is vetted first: QA reruns the replay file and rules real bug vs bad promise; Grok Build confirms by fixing the bug or correcting the promise. A promise (invariant) only goes in when BTF's tested behaviour backs it. **CEO Q8:** a bug found in an already-merged step gets its **own fix step**; QA files the failure record and replay either way.

Boards and counts may start from the official 50-seed fixtures (`stage-fixed` 6×9 history `afc89d56…`, `stage-weighted` 12×12 history `b8007292…`) and the test hook `forward` / `reachFarRow` in `tests/sim/ai.ts`. **CEO Q5:** yes, the first step reuses those two official boards and the reach-far-row end rule.

## 7. Size

The usual cap is 400 changed lines per step. This is likely **three steps**: the player driver first (CEO Q1), then the two chaos steps (a fourth if one would blow the cap). Step A is `step-11-player-driver`; B and C ids follow when written. Base for the first kit is `e9d4820`.

0. **Player driver** (`step-11-player-driver`) — intents become `submit` through `createPlayer`; seats in `runMatch`; `onStep` after every input; `CONFIRM_TARGET` waits for the action menu (M9); its own step before chaos (CEO Q1).
1. **Harness** — runner, invariant checks after every action, failure log, replay of a logged move list, smoke wired into green.
2. **Generators** — the named `streamSeed` stream, legal / illegal / odd input generation (including 09c gesture edges through the touch mapper), simple shrink. No nightly tier yet (CEO Q6).

## 8. CEO answers (2026-11-10, via Chief Of Staff)

1. **Player driver first.** Wait for a player driver that turns intents into `submit`; it is its own step before chaos. No submitting moves the way the test AI does.
2. **Gestures.** Gesture cases go through the touch mapper; direct intents are fine in other runs.
3. **Rejects.** A correct reject or a documented throw is a pass, but it is listed in the report.
4. **Shrink.** The simple shrink is enough for the first step.
5. **Boards.** Reuse the two official test boards and the reach-far-row end rule.
6. **Run tiers.** Short green-check runs only for now; no nightly yet.
7. **Merge gate.** Report-only at first; chaos failures block merges later.
8. **Old bugs.** A bug found in an already-merged step gets its own fix step.
9. **Options.** BTF defaults only for now; no 10b/10c non-default options.

## 9. Two chaos players

- **Game-side** (this plan, steps A–C): plays the game badly on purpose and checks the engine promises (§2). Later it also checks system promises, for example: an achievement unlocks exactly once with the exact gold; a button fires its one action with no side effects; an asset pack loads every file every time against a fake store that can fail, time out or deliver half a file. Each new system ships its own chaos promises.
- **Dev-side security and exploit hunter** (CEO: the most important dev-side part): tampered saves and imports, forged intents, out-of-range or malformed input, duplicate or replayed purchase and reward events, currency dupes, asset-pack sandbox escapes; later cheating online peers and fingerprint spoofing.
- **Where it enters:** after steps A–C. Forged and replayed intents can be fuzzed through the player driver as soon as harness B exists. Its first own slice comes once the first save/import format and the first reward/currency events exist. The online-peer part waits for the online driver add-on.
