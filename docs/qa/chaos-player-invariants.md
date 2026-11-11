# Chaos player — invariants and probes (prep for EA)

**Date:** 2026-11-10 16:14 Europe/London (GMT)  
**Author:** QA & Build Guard  
**Updated:** 2026-11-11 (QA): added (a)15–16 for the merged 10b and 10c behaviour; step 10 pointer moved from build A `0879f1a` to the merged `816a734`. Same day, later: (a)9 extended for the step-11 player driver (rejects vs a submitted-but-failed move, verified on proto `6f673a7`); new placeholder (e) for dev-side security invariants (CEO 2026-11-11). Same day, later: section (e) filled with adopted (e)1–(e)9 from the step-15 kit review (proto `3099a16`, kit `0e79c0f3`); later surfaces stay listed as topics.
**Purpose:** facts EA can use when drafting a later “chaos player” step: a seeded headless AI that plays through the normal intents, tries odd and illegal inputs, checks invariants after every action, and logs seed + move list on every failure so the run can be replayed.  
**Sources (facts only):** the step reviews and handbacks under `docs/qa/` and `docs/qa/handbacks/`, plus the tests those reports already ran on the accepted trees. No new behaviour was invented here. Anything not already checked is labelled **Suggestion**.

Pinned snapshot keys (step 09b, still current after 09c / 10):  
`tick, clockMs, rngState, units, occupancy, phases, logSeq`  
in that order on the object and on `JSON.stringify`. Restore copies `{ ...snap.phases }`, then compares `JSON.stringify`.

Current missing-`phases.battle` rule (step 09c, preferred over the 09b-B fallback):  
`feedIntent` throws `Error("feedIntent: battle phase missing")`; `runMatch` throws `Error("runMatch: battle phase missing")`. No `"play.loading"` fallback.

---

## (a) Invariants QA has already checked

Each row is a property that was independently verified in a step review, a build handback, or a compare. “How to check” is the check already used, not a new API.

| # | Invariant | Source step | How to check in code |
|---|---|---|---|
| 1 | Exactly one occupancy table. Occupancy is a `Map<number, string[]>` of living instance ids in arrival order. `remove` clears offset and drops the id in the same call. Failed `place` does not consume an id. | 04 | Acceptance grep `rg -n 'new Map<number' src/core/unit` = exactly one hit (in `units.ts`). After `place` / `moveTo` / `remove` / `push`, every living unit’s cell is in the map and every id in the map is living (`occupantAt` / `get`). `remove` then `occupantAt` is empty at that cell. |
| 2 | Grid in-bounds and walls. A wall blocks both ways. `canStep` must honour `hasWall` (both builds of 03 failed a plant that ignored it). | 03 | After any move, `inBounds` holds for every unit `at`. A one-way wall write is illegal; the duplicate-form test and the `canStep` plant are the existing probes. |
| 3 | UNIT and TILE are the only pipes. No third pipe / blink. `CONFIRM_TARGET` / `TAP_MOVE_CELL` use `pipe: "tile"`. Pipes read logic cells only (`get().at`, `occupantAt`), never `offset` (M3). `resolveAim` never uses `edge` for the hit test. `resolveContext(null)` returns `{ caster, aim: null, resolution: null }` and does not touch `units` or `grid`. | 06, 07, 09c | `AimKind` / logged aims are only `"unit"` and `"tile"`. Grep `src/` for a third pipe name. `resolveAim` / `livingAt`: an id is a hit only if still alive. Off-map `fallbackAt` must miss `dead` and must not read the cell. |
| 4 | Replay is deterministic: same seed and the same log give the same snapshot. Restore is tick replay, then (from 09b) a shallow phases copy, then `JSON.stringify` equality. | 09, 09b | `Object.keys(snapshot(world))` and the JSON-round-trip key order are exactly the seven keys above. `JSON.parse(JSON.stringify(snap))` deep-equals `snap`. A snap with reordered top-level keys throws `/does not match/` on restore. Mid-move restore rebuilds the in-flight timer; a further `advance` lands on both worlds. 50-seed histories replay 50/50 (see (b)). |
| 5 | One clock, integer milliseconds, no second time source. `createWorld` owns exactly one `createClock()` (defaults, `stepMs` 10). Headless time moves only by `clock.step()`. `src/sim` never calls `clock.advance`. `src/fx` never creates, advances, or steps a clock; `playFx` only uses `clock.after` (and fires immediately when `at === 0`). No `Date` / `performance.now` / `requestAnimationFrame` / `setTimeout` / `setInterval` / `Math.random` in `src/fx`, `src/sim`, `src/runtime/input`, or `src/btf-adapters`. Seconds become whole ms once, in the fx reader (`Math.round`). | 02, 09, 09c, 10 | G1 / G8 greps = 0. `playFx` on a 10 ms clock: a cue at 0 fires now; a cue at 300 fires at clock 300. A `Math.floor` plant on seconds→ms fails the `0.2505` case (see (b)). |
| 6 | Turn / phase legality. Live match writes replace `world.phases` whole (`world.phases = { ...world.phases, battle: xGo(...) }`). `runTicks` never writes `world.phases`. `xGo` with no legal row returns `from` (the phase stays). `feedIntent` replaces `world.phases` whole and submits no action. | 01, 09b, 09c | After a rejected edge, `phases.battle` is unchanged. After a legal `xGo`, the next value is the table’s `to`. `runTicks` on a fixture leaves the phases object untouched. Hard errors: `advance` / `replayTicks` reject non-multiples and non-integers as `RangeError` (see (b)). |
| 7 | HP and shield bounds. **Not an implemented invariant.** Through step 10, game-rule fields (`hp`, `maxhp`, `mana`, `cost`, `damage`, `deck`, `cards`, `stats`) are required to be **absent** from `src/sim`, `src/fx`, `src/project`, and `src/core` (Law 4 / M9). QA has only run the absence greps; there is no HP/shield clamp to check yet. | 08, 09, 09b, 09c, 10 | `rg -n -i --pcre2 '\b(hp\|maxhp\|mana\|cost\|damage\|deck\|cards?\|stats?)\b' src/sim` (and the sibling greps on `src/fx`, `src/project`, `src/core`) = 0. **Suggestion:** add bounds checks in the chaos player only once a rules step introduces those fields. |
| 8 | Fx cue order and monotonic times. `planFx` / `readFxOrder` emit step cues in list order, then a hit on the last step at `connect × ms`. `endMs` is the last step’s end and is `≥` the hit time. Seconds and connect×ms use JS `Math.round` (half-up). Clamps and fills emit the named codes (`fxStepClamped`, `fxFilled`, `fxConnectClamped`, `fxStepDropped`, …). | 10 | Compare the cue list and `endMs` to the fixtures in (b). Times are non-decreasing; hit time ≤ `endMs`. Codes, not message text, are the pinned part (message wording was left to Decisions; the merged build `816a734` (PR #13) uses short fixed sentences such as `A step length was clamped.`). |
| 9 | Rejected or no-op intents do not move units or append a sim action. `BoxSelect` returns null, never throws, and leaves `{ battle: "idle" }`. Confirm without a non-null aim is null. `wait` ignores its target, raises no notice, and still logs. A `move` whose target is `null`, a unit aim, or an edge aim is `actionUnsupported` and does not move the actor. A failed tile `move` is `moveFailed` with `at` equal to the target cell (fresh object, not an alias of the action’s `at`). **Step 11 player driver (CEO Q3; verified on proto `6f673a7`):** a reported reject (`noEvent` / `illegal` / `noUnit` / `notOwn` / `offGrid` / `noAction`) leaves `JSON.stringify` of the snapshot’s `units`, occupancy, `logSeq` and `phases` unchanged and appends no sim action (`log.lastSeq()` stays 0 in the named reject sequence; no `moveFailed` notice). A move to a blocked or taken cell is **not** a driver reject: it **is** submitted (`reject: null`, one log entry, `logSeq + 1`). `moveTo` then refuses it with a `moveFailed` notice (fresh `at`) plus that one log entry, and `units` and occupancy stay unchanged. Named fixture: knight at (0,8) taps (1,8), taken by `archer#2`; last notice `moveFailed`, `log.lastSeq()` 1, knight still on (0,8); occupancy JSON is identical before and after. Phase does become `moving` because `feedIntent` accepted the tap. | 09, 09c, 11 | After a 09/09c no-op: `log.lastSeq()` / `log.toJSON()` / unit positions as specified in the case. **Fact, not the stronger claim:** `feedIntent(SelectUnit)` then `feedIntent(TargetCell)` moves phases to `{ battle: "moving" }` but does **not** change `log.lastSeq()`, `log.toJSON()`, or unit positions. That is not whole-world byte-identity, because `phases` is written. A rejected `xGo` edge leaves the phase string unchanged. After a step-11 **driver reject:** `JSON.stringify` of `units` + occupancy + `logSeq` + `phases` is unchanged and the step has no action. After a submitted-but-failed tap-move: `logSeq` is +1, last notice is `moveFailed`, and `JSON.stringify` of `units` and occupancy is unchanged. **Suggestion:** the chaos player can snapshot those keys before and after every `PlayerStep`, and treat a reject with a log or occupancy change as a failure. |
| 10 | Gesture ownership and once-only mode. The first pointer owns the gesture. Mode is decided once: `held = (ms − downMs) ≥ holdMs` wins over `far`; `far` is distance `> tapMaxPx²`. Later samples do not flip a drag into a box. A second `down` from the same owner, with no intervening `up`, is unspecified in the step; accepted build `45fa5c7` **ignores** it. | 09c | The L102 and boundary cases in (b). Cancel of the owner yields `[]`. `up` without `down` yields `[]`. |
| 11 | Options and thresholds have no hidden defaults in `src/`. `GestureOptions` and match limits / side order / tick interval are caller inputs. `FuseSetting` is `"off"` or a positive integer ms; `startFuse` throws `RangeError` on non-integer or `≤ 0`. `60000` appears in tests (and the sim CLI preset) only. | 02, 09b, 09c | Call sites pass the values. An omitted key is omitted, not sent as `undefined` (`exactOptionalPropertyTypes`). |
| 12 | Log is append-only and sequenced. `logEvents` emits `{ type: "actionLogged", seq, kind, durationMs }` with no `via`. `submit` appends first, then applies now or via `clock.after`. | 07, 09 | After any action, `logSeq` is monotonic. `toJSON` key order is the quoted order (step 07 fork class). |
| 13 | Deterministic RNG. The same seed plus the same calls produce the same `rngState` in the snapshot. Stage seed `0x5eed`; host seed 7 when the stage has none. Seed-mismatch on replay is a hard error (accepted text: `replay: world seed <world.seed> is not the log seed <header.seed>`). | 05, 09, 09b | Compare `rngState` (and the full snapshot) across two runs of the same seed and log. |
| 14 | Layering / build law (always-on, not match state). Nothing outside `src/sim` imports sim. `src/fx` imports only `./` or `../../(types\|core)/` (CN-007 `fx-imports-only-types-core`). Core / state / project / types do not import `fx`. `btf-adapters` uses `import type` from `src/fx` only. No copied BTF / chess tree, no `vendor/`. The holy-sword free-landing-tile rule is 10b, not 10 (`obstacles_block_leap` is an option key only). core-types pin `f00c722c…` is read-only. | 06–10, CN-004, CN-007 | The scoped greps and `npm run deps`. A planted `src/fx` → `src/state` import must fail `fx-imports-only-types-core`. |
| 15 | Step 10b effect timeline and landing (merged PR #14, build `9b91b2b`, code `03904c5`). BTF defaults: `pierce_flight: "fixed_total"` with `BTF_FX_FLIGHT = { totalMs: 400, msPerTile: null }` (in `src/btf-adapters`, never a literal in `src/fx`), and `impact_burst: "per_body"`. Pierce flight **starts** at step 10's `hitAt`; strike times are cumulative `Math.round(total × i / n)` (half-up), near to far by Chebyshev distance. Impact is its own `{ kind: "impact", at, body }` cue: one per body under `per_body`, one on the first strike under `once_at_contact`; one body or `body: null` gives one impact either way. `endMs` is the max of the plan and the latest cue. Equal times keep strike before impact. `pickLanding` takes the nearest accepted neighbour (Manhattan tie-break, `"eight"` or `"four"`), returns `null` when all are rejected, and leaves seams to the caller's `canLand` (a seam cuts off only an orthogonal neighbour; a diagonal is never walled off). | 10b | Named fixtures in (b) of the 10b reports: N=3 at `hitAt` 250 gives 383 / 517 / 650; `per_tile` 90 ms gives 340 / 430 / 520; impacts `x 350, y 450, z 650` vs once `x 350`; N2 target (2,2), sword (0,2), `"eight"` gives (1,2), and rejecting only (1,2) gives (1,1). **Suggested chaos checks:** strike and impact times non-decreasing and ≤ `endMs`; impact count equals body count under `per_body` and is 1 under `once_at_contact`; a landing tile is in-bounds, accepted by `canLand`, and never the target cell. A `Math.floor` or banker's-round plant must fail the 250/4 → 63 case. **BTF defaults only** in the first cut (CEO). |
| 16 | Step 10c look (merged PR #15, build `22775d4`, code `01831e6`). Look is seeded and repeatable: the same order and seed give the same `planLook` / `lookAt` / `copyAt` output every play (no `Math.random`; `unit()` is `x % 1`, plus one when negative). `easeAt` ramps are pinned (`"out"` at 0.5 is 0.75; linear 0.5). `startMs = step start + Math.round(lag × step.ms)` (half-up). Copies appear only on a volley; count clamps 2…`maxTaps`; copies arrive together at raw 1. Release is `"split"` only on a later carry step, otherwise `"together"`. Clamped `delay === 1`: `u` is 0 before the lag and 1 at or past it, never `NaN`; `raw === 1` gives `u === 1`. A playing step with no `styles` slot throws `RangeError("planLook: style missing")`. Tunables live in `BTF_FX_LOOK` (`src/btf-adapters`); no new `FxOptions` keys. Look never changes the sim. | 10c | Named §A9 / §A12 tests: ease mid-step, null channel holds, startMs 400 after a 0.4 s orbit, identical-twice copies, half-up startMs 1 (`delay 0.001`; floor gives 0), fillCount 6, clamp 9 → 8. **Suggested chaos checks:** two plays of the same seed are `JSON.stringify`-equal; every `u` is finite and in [0, 1]; copy count is in 2…`maxTaps`; the seven-key `SimSnapshot` is identical with and without look calls. Plants: `Math.random` in `unit()`, a wrong `"out"` ease, and `Math.floor` on `startMs` each fail one named test. |

---

## (b) Probe cases already used (exact inputs and expected results)

### Step 09c — gesture edges (accepted behaviour is build `45fa5c7`)

Thresholds have no defaults in `src/`; tests pass `cellPx`, `tapMaxPx`, and `holdMs`. Mode is decided once.

| Case | Input (as used in the named tests / QA probes) | Expected |
|---|---|---|
| L102 long drag past `holdMs` stays a drag | Far move at 100 ms, `up` at 600 ms | `[SelectUnit, TargetCell (0,7)]`. The mode is decided once; later samples do not flip a drag into a box. |
| L102 empty-start drag | `(2,3) → (3,3)` at 200 ms, start cell empty | `[]` |
| Second `down` from the same pointer (`45fa5c7`) | A far second-down at 50 ms, then `up` back on the start cell at 80 ms, no intervening `up` | Ignored. Still a tap: `[SelectUnit]`. (Build `43fb5e3` treated the second down as a sample and emitted `[SelectUnit, SelectUnit]`. Prefer `45fa5c7`. The step text does not name this case.) |
| Hold boundary, exact `holdMs` | 500 ms on a cell (`holdMs` = 500) | one-cell `BoxSelect` |
| Hold boundary, just under | 499 ms on an empty cell | still a `TargetCell` tap |
| Distance equal to `tapMaxPx` | movement = `tapMaxPx` (not greater) | not far; stays a tap |
| Distance just over `tapMaxPx` | movement > `tapMaxPx` | far (drag) |
| First pointer owns the gesture | a second pointer while the owner’s gesture is open | the owner keeps it |
| Cancel of the owner | cancel while open | `[]` |
| `up` without `down` | up from a pointer that never went down | `[]` |
| Confirm without aim | `Confirm` and `aim` is null | mapper / `intentEvent` yields null; Confirm needs a non-null aim |
| `BoxSelect` | a completed box | no-op; `{ battle: "idle" }`; no throw |
| `feedIntent` does not submit | `SelectUnit` then `TargetCell` | phases become `{ battle: "moving" }`; `log.lastSeq()`, `log.toJSON()`, and unit positions are unchanged. Event cells are a fresh `{ c, r }` (mutating the caller’s cell does not change the event). |
| Missing `phases.battle` | `feedIntent` / `runMatch` on a world with no `battle` key | throws `feedIntent: battle phase missing` / `runMatch: battle phase missing`. No fallback. |
| RangeError — options | `cellPx` ≤ 0, or `tapMaxPx` < 0, or `holdMs` not an integer > 0 | `RangeError`. Message text was left to Decisions (`45fa5c7` uses split strings; tests assert the class only). |
| RangeError — time | mapper `ms` not an integer `≥ 0`, or time going back | `RangeError` |
| RangeError — `report` | `n` not an integer `≥ 1` | `RangeError("report: n must be an integer >= 1")` |

### Step 09 / 09b — harness, restore, 50-seed driver

| Case | Input | Expected |
|---|---|---|
| Snapshot keys (09, then 09b) | `snapshot(world)` and `JSON.stringify` | keys in order `tick, clockMs, rngState, units, occupancy, logSeq` (09); 09b inserts `phases` between `occupancy` and `logSeq`. |
| Restore key order | a snap whose top-level keys are reordered | throws `/does not match/` |
| `wait` | `target: null`, or a legal tile target | does nothing, no notice, still logs |
| Non-tile `move` | target `null`, or a unit aim, or an edge aim | `actionUnsupported`; actor does not move |
| Failed tile `move` | a blocked / illegal tile | `moveFailed` with `at` equal to the target cell (fresh object) |
| Duration 0 / 200 | `advance` after a move of duration `0` or `200` (`stepMs` 10) | duration 0 lands on the next tick; 200 lands on tick +20 |
| Live script history ticks | the official demo log | distinct ticks exactly `[0, 15, 20, 40, 41, 45]` |
| `advance` / `replayTicks` hard errors | `5`, `-10`, `1.5`, `NaN` | `RangeError`. `advance(1000)` runs 100 steps. |
| Stage / host seed | stage seed `0x5eed`; a stage with no seed | host seed is 7 when the stage has none |
| Missing `phases.battle` (09b only, superseded) | 09b build A threw `runMatch: battle phase missing`; 09b build B (the PR that landed) fell back to `xGo` from `"play.loading"` | **09c replaced this** with the throw (no fallback). Chaos-player drafts should use the 09c rule. |
| 50-seed driver (`VictoryRule` + test AI, official `npm run sim`) | seeds of the pinned run, two boards | 6×9 **48/2**, rounds 4–10, history `afc89d56…`, replay **50/50**; 12×12 **22/28**, rounds 11–18, history `b8007292…`, replay **50/50**. No draws, no timeouts. |
| Fuse | `"off"` or a positive integer; invalid `0` | `startFuse` throws `invalidValue: 0`. One `FUSE_EXPIRE` after the turn (callback is a flag). 60000 is tests / CLI preset only. |
| Stalled side | a side that returns an empty action list | polled once per step (`replayTicks(world, 1)`) until the fuse or `maxSimMs` fires. |

### Step 10 — fx clamps, fills, and the half-up pin

Limits are caller inputs on `FxReadLimits` / `BTF_FX_READ_LIMITS`. `minStepMs` 200 (0.20 s) is **PROVISIONAL**. Fill 480 ms (0.48 s) and connect 0.02–1 are CEO-approved defaults (2026-11-10), still inputs. Doc-stated values stay in `FX_FORMAT`.

| Case | Input | Expected |
|---|---|---|
| L176 back-to-back steps | seconds `[0.3, 0.5, 0.6]`, connect `0.92` | cues step 0 @0, step 1 @300, step 2 @800, hit @1352; `endMs` 1400 |
| Reel connect | `[0.48]` at connect `0.42` | hit @202 (`0.42 × 480 = 201.6` → 202); `endMs` 480 |
| Connect 1, one second | `[1]` at connect `1` | hit @1000; `endMs` 1000 |
| Half-up seconds→ms (kit `9e2ff169`) | `[0.2505]` at connect `1` (above `minStepMs` 200, so no clamp) | cues step 0 @0, hit @251; `endMs` 251. (`0.2505 × 1000 = 250.5`; `Math.round` → 251. `Math.floor` and banker's round both give 250 — a floor plant must fail this test.) |
| `minStepMs` 200 | a frame shorter than 200 ms (e.g. 0.05 s / 50 ms) | `fxStepClamped`; the step becomes 200 ms |
| `maxMs` 3000 | a frame longer than 3000 ms | clamped to 3000 (`fxStepClamped`) |
| `maxSteps` 6 | eight frames | first six kept; extras dropped (`fxStepDropped`); hit stays on the last kept step |
| Connect below the floor | `connect: 0` | becomes `0.02`; `fxConnectClamped` |
| Connect above the ceiling | `connect` > 1 | clamped to 1; `fxConnectClamped` |
| Missing connect (filled / skill) | omit `connect` | default **0.92** (passing it in the §A1/§A4 fixtures avoids an extra `fxFilled`) |
| Missing connect (reel) | reel path, omit `connect` | **0.42** |
| Fill when frames are missing | empty / missing frames under the fill rule | fill 480 ms (`fxFilled`) |
| `playFx` on a 10 ms clock | a plan with a cue at 0, a step at 300, a hit at 550 | `[step,0,0]` fires immediately; then `[step,300,300]`, `[hit,550,550]` (`clock.after(0)` would wait a tick — accepted builds fire at 0 now) |

### Number-grep misses (step 10 Acceptance L225, kit `9e2ff169`)

The tightened pcre2 is:

```text
(?<![\w.])(?!(?:0|1|2)(?:\.0)?\b(?![.\d]))(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|0[xX][0-9A-Fa-f]+)\b
```

Expectation on a correct `src/fx`: **exactly four lines**, all in `src/fx/order/read.ts`, the four numeric `FX_FORMAT` lines.

| Literal | On the `9e2ff169` regex (checked outside the tree) |
|---|---|
| `1e3` | **hit** (Finding 2 fixed this miss) |
| `0x10` | **hit** (Finding 2 fixed this miss) |
| `2.5` | **hit** |
| `1.0` / `0` / `1` / `2` / `2.0` | **no hit** (the negative lookahead; Finding 2 also stopped the `1.0` false-hit) |
| `10_000` | **still a miss** (the `_` is a word character, so `\b` does not fire after `10`) |
| `.5` | **still a miss** (a leading-dot decimal; the lookbehind `(?<![\w.])` rejects the `5` after `.`, and the main alternative requires a leading digit) |

These last two are residuals of Finding 2 as shipped, not a miss against the approved kit. A chaos-player or later Acceptance pass that cares about hidden literals should treat `10_000` and `.5` as still-open plants.

---

## (c) Suggested illegal and odd inputs

**Suggestion** — none of the rows below is a named test today. They are candidates for the chaos player once it exists. Skip or defer any input whose type does not yet exist in the engine (in particular deck / hand / HP).

| Suggestion | Why it is interesting | Related fact already on file |
|---|---|---|
| Out-of-bounds tile (`c` / `r` negative, or `≥ cols` / `≥ rows`, or a huge integer) | `inBounds` / `moveTo` / `aimTile` should miss or `moveFailed`, never throw past the documented `RangeError` sites, never write occupancy off-map | 03 `inBounds`; 06 off-map TILE / `fallbackAt`; 09 failed tile move |
| Acting off-turn / in the wrong `phases.battle` | `xGo` should return `from`; units and occupancy stay put | 01 / 09c `xGo` no-row; `feedIntent` still writes phases only through `xGo` |
| A dead unit acting (`alive: false`, or an id after `remove`) | `livingAt` / `get` should miss; no occupancy write for the dead id | 04 `remove`; 06 “id is a hit only if still alive” |
| A double `submit` of the same action, or `submit` twice without a tick | log seq must still be monotonic; the second apply must not move a unit twice through a one-step rule, or must be rejected consistently | 07 append-only; 09 `submit` appends first |
| `NaN` or `Infinity` in numbers (`durationMs`, `connect`, frame `seconds`, seed, `cellPx`, `ms`, limits) | documented sites throw `RangeError` (`advance` already rejects `NaN`; `startFuse` rejects non-integers). Other sites are unspecified | 09 `advance`/`replayTicks`; 09c mapper / `report`; 10 clamps assume finite numbers |
| An empty deck or hand | **no such state in the engine yet** (absence greps, Law 4). Defer until a rules step adds cards | 08–10 absence greps |
| Max-length inputs (very long frame lists, very long logs, a huge roster, a max-int seed) | `maxSteps` 6 already drops extra fx frames; a huge log should still restore by tick replay or fail loudly | 10 `maxSteps`; 09 restore |
| Interleaved pointers (two downs, owner cancel then other up, pointer id reuse after `up`, overlapping `ms`) | first pointer owns; cancel of the owner is `[]`; a second down from the *same* owner is ignored in `45fa5c7` | 09c ownership / cancel / `45fa5c7` second-down |
| Time going back, or a non-integer `ms`, on the mapper or on `advance` | already a `RangeError` at the documented sites; useful as a chaos injection | 09c / 09 RangeErrors |
| Reordered snapshot keys, or a mutated `at` alias, fed to `restore` | must throw `/does not match/`; notices must not alias the action’s `at` | 09 restore; 09 `moveFailed.at` |
| `connect: 0`, omitted connect, `seconds: 0.2505`, eight frames, `minStepMs` / `maxMs` breaches, scientific / hex / separator literals in fixtures | already pinned in (b); worth re-running inside a seeded match, not only in unit tests | 10 |

---

## (d) Suggested failure-log format

**Suggestion.** When an invariant fails, write one record that is enough to replay the run without the original process. Minimum fields, matching what the CEO asked for:

```text
{
  "seed": <number>,
  "ruleset": <id or null>,
  "options": { ... },
  "moves": [ /* chronological intent / action list, including illegal ones */ ],
  "invariant": "<id from section (a), or a new id>",
  "firstDivergentSnapshotKey": "tick" | "clockMs" | "rngState" | "units" | "occupancy" | "phases" | "logSeq"
}
```

Notes, also **Suggestion**:

- `options` should include the `GestureOptions`, `FxReadLimits`, fuse, victory rule, and any `readFxOptions` overrides used in the run, so a replay does not silently pick different inputs.
- `moves` should record pointer id, cell, and `ms` for 09c intents, and the action / aim for 09 `submit`.
- `firstDivergentSnapshotKey` is the first of the seven pinned keys whose value differs from a replay of the same `seed` + `moves` (or from the pre-action snapshot, for a reject-should-be-identical check). Compare via `JSON.stringify` on that key, in the 09b key order.
- Also store the expected vs actual value of that key, the tick / `clockMs` at failure, and a hash of the full snapshot. Those are not required by the brief but make a replay bisect shorter.
- Replaying a failure must use the same Node major (the accepted trees record **v24.22.1**) because step 10’s half-up rule is JS `Math.round`.

---

---

## (e) Security invariants (dev-side chaos player, CEO 2026-11-11: matters most)

Slice 1 of the dev-side exploit hunter (step 15, kit `0e79c0f3`, proto `3099a16` on base `08274d7`) implements (e)1–(e)9 on the only attack surfaces the engine has today: hostile JSON-text intents through the one door, and tampered official project documents through the step-08 readers. QA adopted the proposed ids below. Wording is the kit's, with the status and backing made explicit.

**Backing rule (CEO, outline §6 / Q7):** a promise (invariant) only goes in when BTF's tested behaviour backs it; report-only until 25 clean runs in a row; every block is vetted by QA's rerun first. (e)1, (e)4, (e)5, and (e)7, plus the "refusal is a hard error" half of (e)6, are backed by already-merged TileEngine tests (steps 08, 11, 12, 14). **(e)2, (e)3, (e)8, (e)9 rest on the CEO wording of this slice** as quoted in the step ("never throws uncaught", "never yields polluted prototypes", "never hangs: caps on size and depth"). Those four are **target promises**, not currently held on `main` `08274d7` (real bugs B1–B4, independently reproduced; this step reports them and does not fix them). They stay report-only; each block is vetted before it may count against the gate. QA did not find those three quoted phrases outside the kit in the repo docs; the CEO topics and the backing / report-only rule are in outline §9 and §6.

| # | Invariant | Status / backing | How to check |
|---|---|---|---|
| (e)1 | An accepted step is a plain copy: `SELECT_UNIT` of the seat's own living unit; a move by an own living unit, `pipe: "tile"`, a whole in-bounds cell, the seat's `moveMs`; event and action are plain data (finite numbers, standard prototypes, no own `__proto__`). | **Adopt as written.** Backed by step 11 Behaviour 2 and step 14's every-reject test. Implemented as `acceptedCheck` (id `"(e)1"`). | `acceptedCheck` on accepted steps only; the branch-by-branch test; a reject is not a finding here. |
| (e)2 | No wire input throws out of the driver / `runMatch`. A `JSON.parse` of hostile text is fed through the one door; a malformed input must be a named reject, not a `TypeError`. | **Adopt as a target promise; report-only.** CEO wording ("never throws uncaught"); not held today (**B1**, five `TypeError` messages). Fix step proposed (`step-16-door-guard`). | `runExploit` maps a throw out of `runChaos` to `{ invariant: "(e)2", detail: "<name>: <message>" }`, outcome `"failed"`. Known-bug test pins the five messages; all-kinds smoke reports them. |
| (e)3 | No prototype pollution: `Object.prototype` and `Array.prototype` own names are unchanged (`protoNames()`). | **Adopt as a target promise; report-only.** CEO wording ("never yields polluted prototypes"). The hunter plants and detects a change; `main` has no current pollution on the official path (map palette `__proto__` is silently dropped — observation, not a promise break). | Hook halt and end-of-run compare in `runExploit`; `checkDoc` compares `protoNames()` taken **before** tampering. |
| (e)4 | No desync: the recorded wire, replayed on a fresh world, gives the same per-step snapshot hashes (what two devices compare). | **Adopt as written.** Backed by step 14's JSON-fed seat and the standing rule that online is just another driver. | `runExploit` twins the recorded wire; a hash mismatch is `"(e)4"`. `replayExploit` serves the recorded text. |
| (e)5 | A rejected hostile input changes nothing: the reused `(a)9`, `(a)12`, `(a)6`, `(a)5`, `(a)2`, `(a)1`, and the end-of-run `(a)4`. No new check code. | **Adopt as written** (a pointer, not a new src id). Backed by the step-12 harness. `runExploit` still runs `CHAOS_CHECKS`. | Existing (a) checks on every `runChaos` step; kinds test: "no reject changes the world". |
| (e)6 | No reader (or `resolvePlacements` on an accepted stage) throws on a tampered document. | **Adopt as a target promise; report-only** for throws. The "readers refuse a bad document instead of hanging" half is backed by step 08; **B2** (`String(json.kind)` on `{toString:1,valueOf:1}`) is a real throw on all three readers and `createWorld`. | `checkDoc` returns `"(e)6"` with the throw text; the B2 case is pinned. |
| (e)7 | A refusal names a key: the tampered top-level key or another key of the document; `kind` → `wrong kind …`; `formatVersion` → `needsMigration` or `bad field formatVersion`; the whole document → `not an object` / `wrong kind …`. | **Adopt as written.** Backed by step 08's "missing or malformed required field is a hard error naming the top-level key" and "a bad document is a hard error". | `checkDoc` `named()`; a refusal that names no such key is `"(e)7"` with the `ReadResult` as detail. |
| (e)8 | An accepted document is plain JSON (same `plainDeep` test as (e)1: finite numbers, standard prototypes, no own `__proto__`). | **Adopt as a target promise; report-only.** CEO wording / plain data. Not held today (**B4**: a weighted `weight` of `1e400` is accepted as `Infinity`; a JSON round trip becomes `null` and is refused). | `checkDoc` after a successful read: `plainDeep(doc)` and `plainDeep(notices)`. |
| (e)9 | Bounded: no caller-named count key (`DocCaps.countKeys`; tests use `picks`, `count`) is above the caller's cap, and `resolvePlacements` asks the picker at most that many times. Depth is a **generator** cap on hostile values, not an engine-facing promise. | **Adopt with that depth clarification; report-only** as an engine bound. CEO wording ("never hangs: caps on size and depth"). Not held today (**B3**: `picks` and waves `count` are uncapped `isInt` fields; `resolvePlacements` loops that many times when the pool does not exhaust). Caps are caller inputs (law 11); `src/` holds no cap literal. | `checkDoc` walks count keys then budgets the picker; `"(e)9"` is `key <k> above <max>` or `picks above <max>`. |

**Later topics** (CEO outline §9; not this slice — no such engine surface yet; keep them so they are not lost):

- Tampered saves and imports
- Replayed purchase or reward events
- Currency dupes
- Asset-pack sandbox escapes
- Later: online cheat and fingerprint spoofing (waits for the online driver add-on)
- Tampered logs or snapshots fed to `restore` (with the save slice)

Forged or malformed intents, and out-of-range / junk / replayed batches, are in slice 1 as (e)1–(e)5. Out-of-turn intents, dead units, shrinking exploit records, and non-JSON wire text are deferred (the door has no turn; nothing dies yet; a run already stops at the first finding; non-JSON is the online add-on's parser).

**Game-side player promises** (also outline §9; still TBD as checks, not this step): an achievement unlocks exactly once with the exact gold; a button fires its one action with no side effects; an asset pack loads every file every time against a fake store that can fail, time out, or deliver half a file. Each new system ships its own chaos promises.

## Pointers for EA (not a brief)

The accepted trees to target, when the step is written, are: step 09c gesture behaviour of `45fa5c7`, the 09b seven-key snapshot and 50-seed counts, step 10 kit `9e2ff169` as merged in build `816a734` (PR #13; review `docs/qa/handbacks/step-10-B-816a734.md` and `step-10-r1.md`), step 10b as merged in `9b91b2b` (PR #14; `step-10b-r1.md`), and step 10c as merged in `22775d4` (PR #15, merge commit `e9d4820`; `step-10c-r1.md`). Do not treat HP/shield or deck as in-scope until their steps exist. The 10b landing rule and 10c look are now covered by (a)15–16. Step 11’s player-driver reject vs submitted-but-failed move is covered by the (a)9 extension (proto `6f673a7`; kit review `docs/qa/step-11-review.md`).
Step 15’s adopted (e)1–(e)9 and the B1–B4 repros are in `docs/qa/step-15-review.md` (kit `0e79c0f3`, proto `3099a16`).
