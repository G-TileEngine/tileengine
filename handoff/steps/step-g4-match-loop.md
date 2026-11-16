# step-g4-match-loop: Clock.skip runs at most 8 h per call and hands back the rest; a live turn holder holds the fuse, defers saves, saves the undo cell and the fuse; overlays are never saved; flow and strict1 pins (post-34 polish plan, slice G4; no CN; no format change)

Step id: step-g4-match-loop          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`e9b8056b`** (`e9b8056b16d2afffb9a096f72e47ad559f230472`, tree `26b0ff81`, main: the D3 host-guide follow-up on the P1 merge `f128bc5a`; P1 carried G4b's door gaps, including the ticking guard). Branch: `step/step-g4-match-loop-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-g4-match-loop-r<N>.bundle e9b8056b..step/step-g4-match-loop-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-g4-match-loop/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: P1 (G4b door gaps) and D3, merged (main `e9b8056b`). Independent of G1 and G2b: no file overlaps theirs. No format change, no CN.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers: the helper rule; HANDBACK needs § Helpers & self-review), §2 (engine law), §6 (green), §7; `docs/STATES.md` §2–§3; this file (it carries everything needed from EA's plan, Modes' rulings and QA items 32/35).
Kit: kit-1 r1 (guide-3), 2026-11-15. Engine Architect. Proto `/tmp/g4` branch `g4`, head `fe4d9b2e` (`fe4d9b2efaccab447d7250f914e57252384b5b97`, tree `cb38439b`, parent `e9b8056b`, G-TileEngine noreply): 12 files, +358/−13 = 371 changed lines (src 97, tests 274); green 725/0 (703 + 22); EA plants 45/45 (`sg4-plants.py`); on the Base the R1 tests fail, the save-continue file fails to load, and the R3, R4-table and R9 pins pass (they pin Base behaviour; their plants are the proof). Bundle backup `/workspace/scratch-ea/kit-backup-g4/`.
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Make the tactics match loop solid before the modes build on it. Today `Clock.skip(ms)` runs every tick that `ms` is worth, with no limit (QA item 32: with a tick subscriber, `skip(MAX_SAFE_INTEGER)` never returns), and it drops the sub-tick remainder. A live host also has no shared way to hold a fuse that fires mid-move, to wait to save until the board is settled, or to keep UNDO_MOVE working across save and load. After this step, skip runs at most a capped amount of sim time per call and hands back the rest with a notice. An opt-in turn holder (`createTurn`) does the Modes flow, and saves carry its small state. The overlay, CLOSE and strict1 behaviour Modes asked for is pinned. `runMatch`, `runTicks`, the player and the chaos tools are not changed: sims and snapshots without a turn holder stay byte-equal.

## Rulings

- G6 (merge time, QA A/B): a held MOVE_DONE must write sideEnd even when no `onFuse` is passed (build B broke this in cc9e63e2, then fixed it). QA's `tests/sim/save-continue-qa.test.ts` (f7ec0ebe, 22 lines) pins it; adopted, floor raised to 726.
All rulings are EA (this kit) on the post-34 plan v2 (items 32, 34, 35, 36), Modes' rulings (`post34-consolidation.md`, Modes 06:07) and QA `docs/qa/post34-answers.md` row 11. Every one is pinned. Engine law (BUILD_GUIDE §2): the skip cap is a clock setting; offline estimates (offlineMode) are the modes layer's job and phone chunking is the host's; no game rule enters `src/core`.
1. **Skip cap** (item 32): `ClockOptions.maxSkipMs`: an integer 1–86400000 (24 h). Anything else (absent, 0, negative, fractional, a string, null, over 24 h) gives the default 28800000 (8 h); out-of-range values are not clamped. The `maxSkipMs` getter reads it. `skip(ms)` returns `SkipResult = { remainderMs, notice? }`. The cap is sim time: the host ms one call may use are `max(1, floor(max(1, floor(maxSkipMs / stepMs)) · stepQ / scaleQ))` (stepQ = 4·stepMs, scaleQ = 4·timeScale). That rounds down, so a call never runs more than `floor(maxSkipMs / stepMs)` ticks beyond the kept quarter-ms remainder. A cap under one step still runs one step, so a remainder chain always gets through. `remainderMs` = `ms` − used (host ms). When it is above 0 the result has `notice: { code: "skipCapped", message: JSON {"capMs","remainderMs"} }`; otherwise there is no `notice` key. With timeScale 0 the call uses all of `ms` (no ticks, remainder 0). While paused, or inside a tick (P1's guard reports it), skip runs nothing and returns `{ remainderMs: 0 }` (time is dropped, as with paused `advance`). The quarter-ms remainder is kept in `accQ` as in `advance`, so `skip(a)` + `advance(b)` lands where `advance(a + b)` would (for `b ≤ maxFrameMs`), and a chain of remainders ends exactly where one uncapped skip ends. Render subscribers get the host ms that ran (`ms − remainderMs`; step 30's "not clamped to maxFrameMs" stands). World clocks keep the default (no `SimInput` field). `raf-driver`'s `catchUp`/stall path drops the remainder (not changed; see Not in this step). Pinned by the seven "G4 R1" titles and the moved pin below.
2. **Overlays are host state** (save matrix): `snapshot()` writes `phases` without any key whose value starts with `overlay.`. So a save made with saveLoad or settings open (the host's overlay stack, STATES §2) holds only `battle`, and a load lands with no overlay: the host's stack starts at `overlay.none`. Clock pause is not saved either (a loaded clock runs). Other extra keys are still saved, and load still refuses them (`saveSnapshotPhasesInvalid`, as on the Base). Pinned by: "G4 R2 overlays are host state: an open saveLoad or settings overlay is not saved, and load lands in overlay.none with the clock running".
3. **CLOSE** (item 36, Modes): CLOSE from `overlay.pause`, from settings or saveLoad opened via pause, and from either opened directly lands in `overlay.none`. There is no back-stack (a later option, needing a CN to the table). OPEN_* from settings or saveLoad is a no-op. No code: the shared table already does this. STATES §2's "pause → settings → back to pause" line predates this ruling (doc carry to D3). Pinned by: "G4 R3 CLOSE from pause, from settings or saveLoad opened via pause, and from either opened directly lands in overlay.none (no back-stack)".
4. **Held fuse** (item 36, Modes): `createTurn(world, { fuse, onFuse? })` (`src/sim/turn.ts`) is the live host's battle step. `turn.go(event)` applies a battle event with `xGo` and returns the new phase; a rejected event (no row, or a pick not in the list) changes nothing. The holder starts the fuse at `SIDE_BEGIN` (`startFuse`, so `"off"` or an integer > 0; anything else is a RangeError at `createTurn`). A `FUSE_EXPIRE` (from the fuse or sent by the host) that the phase does not take is **held** (`pendingFuse`). That covers `moving`, `resolving`, `unitDone` and `victoryCheck`, but not `sideEnd` or `play.result`, where the side is already over and it is ignored. The hold is checked after every accepted event, including MOVE_DONE and RESOLVE_DONE, and is delivered at the first phase that takes it. MOVE_DONE therefore goes straight to `sideEnd`. After RESOLVE_DONE the victory check runs first (a win still wins): UNIT_DONE to `idle` delivers it, while UNIT_DONE to `sideEnd`, CHECK_END and SIDE_BEGIN drop it. Entering `sideEnd` or `play.result` cancels the fuse. `onFuse(phase)` is told when the fuse lands (never while held). Pinned by: "G4 R4 fuse during moving is held and lands at MOVE_DONE (straight to sideEnd); with no fuse MOVE_DONE goes to actMenu", "G4 R4 fuse during resolving waits through the victory check: UNIT_DONE to idle delivers it, to sideEnd or CHECK_END drops it", and the table pin "G4 R4 the tables: FUSE_EXPIRE is taken only in idle, unitSelected, actMenu and targeting (moving and resolving ignore it, so the turn holds it); MOVE_DONE and RESOLVE_DONE leave only moving and resolving".
5. **Undo cell** (save matrix, Modes "the undo cell is saved"): the holder keeps `TurnState = { sel, undo, fuseDueMs }` on `world.turn` (plain JSON). `SELECT_UNIT` sets `sel`; `CANCEL` to `idle` clears it, and CANCEL from targeting keeps it. An accepted `TAP_MOVE_CELL` records `undo = { unitId: sel, at: <its cell now> }`, so the host calls `go(TAP_MOVE_CELL)` before it submits the move. `undo` survives MOVE_DONE and is cleared when `actMenu` is left by any event. For UNDO_MOVE the host reads `turn.undo`, submits the move back (an instant move, logged like any move; whether undo is offered is the mode's option, STATES rule 5), then calls `go(UNDO_MOVE)`, which lands in `unitSelected` with the same unit selected. `snapshot()` writes `turn` only when `world.turn` exists (only `createTurn` sets it), so every other snapshot is unchanged. `restore()` rebuilds `turn` from the save by shape (`sel` string or null; `undo` with `unitId` and `at`; `fuseDueMs` an integer or null). The final snapshot compare then refuses anything tampered (`restore: snapshot does not match the log`). The mismatch opt-in load (replay) drops `turn`, as it drops phases. Pinned by: "G4 R5 UNDO_MOVE after load: the undo cell is saved, the move back lands, and UNDO_MOVE goes to unitSelected with the same unit" and "G4 R5 saves carry turn only once a turn exists, and a tampered turn is refused".
6. **Deferred save** (save matrix, Modes): `turn.save(meta, done)` saves now (`done(saveMatch(world, meta))`, returns true) when the board is settled, meaning the phase is not `moving` or `resolving` and no fuse is held. Otherwise it queues and returns false, and the queue runs in ask order (each with its own meta) right after the event that settles the board, with the board as it stands then. Bad meta or a non-function `done` is a RangeError at once. `dispose()` cancels the fuse and drops queued saves. `saveMatch` itself is unchanged (a host that calls it directly gets what it asked for). Pinned by: "G4 R6 a save asked during moving or resolving waits for the next settled state; settled saves run at once; asks keep their order".
7. **Fuse after load** (save matrix, Modes): `fuseDueMs` is the running fuse's due sim ms (null with none or `"off"`). A `createTurn` on a loaded world re-arms it with `after(fuseDueMs − now)`, so it fires on the same tick as unbroken play. Pinned by: "G4 R7 a running fuse fires at the same sim ms after load (fuse 30000 and 1235), saved in actMenu or idle".
8. **Save, load, continue = unbroken play** (item 34): per step and per tick, snapshots after load-and-continue equal unbroken play. That holds for the phase driver (the turn holder: both stages, levels on and off, fuse 60000 and 1230, saves asked mid-move and so deferred) and for the tick driver (moves with durations in flight across the save, both stages, levels on). No code beyond Rulings 2 and 4–7. Pinned by: "G4 R8 save, load, continue equals unbroken play at every step and tick (phase driver: both stages, levels on and off, fuse 60000 and 1230)" and "G4 R8 save, load, continue equals unbroken play with moves in flight (tick driver: both stages, levels on)".
9. **strict1** (item 35, Modes): no code. A dead unit frees its cell in the same call (place, move, push and reach; through `submit` in the same tick). Move, place and push onto a living unit fail as `occupied`, `placeOccupied` and blocker `unit`, ally or rival alike (Modes' "fails `occupied`" names these three as they are). PassThrough `allies` (the default) passes allies, `none` stops at them and `all` passes rivals, and no unit ever ends on a living unit (`reach` lists the mover's own cell). An unknown policy (any non-`strict1` value, a non-string too) runs strict1 with one `occupancyUnsupported` notice, and `strict1` or absent gives none. Pinned by the four "G4 R9" titles.

## Files to create or change (and nothing else)
Size: at most 400 changed lines in total. The proto changes 371 lines (+358/−13) in 12 files:

| File | Base → proto lines / cap (changed lines) | Rulings |
|---|---|---|
| `src/core/clock/clock.ts` | 151 → 158 / 24 | 1 |
| `src/core/clock/types.ts` | 31 → 37 / 12 | 1 |
| `src/core/clock/index.ts` | export `SkipResult` / 2 | 1 |
| `src/sim/turn.ts` | 0 → 50 / 60 | 4–7 |
| `src/sim/run.ts` | 130 → 132 / 8 | 2, 5 |
| `src/sim/types.ts` | 188 → 193 / 8 | 5 |
| `src/sim/index.ts` | export `createTurn` and its types / 4 | 4–7 |
| `tests/core/clock-skip.test.ts` | 0 → 65 (shipped) | 1 |
| `tests/sim/save-continue.test.ts` | 0 → 138 (shipped) | 2, 4–8 |
| `tests/sim/save-continue-qa.test.ts` | 0 → 22 (G6-adopted from QA A/B) | 4 |
| `tests/state/flow-pins.test.ts` | 0 → 25 (shipped) | 3, 4 |
| `tests/core/strict1.test.ts` | 0 → 45 (shipped) | 9 |
| `tests/runtime/host/raf-driver.test.ts` | 2 lines (shipped; Ruling 1 pin move) | 1 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// src/core/clock/types.ts
export type ClockOptions = { …the Base's fields…; readonly maxSkipMs?: number };
export type SkipResult = { readonly remainderMs: number; readonly notice?: Notice };
export interface Clock { …; skip(ms: number): SkipResult; readonly maxSkipMs: number; … }
// src/sim/types.ts
export type SimWorld = { …the Base's fields…; turn?: TurnState };
export type TurnState = { readonly sel: string | null; readonly undo: { readonly unitId: string; readonly at: Sq } | null; readonly fuseDueMs: number | null };
export type SimSnapshot = { …the Base's fields…; readonly turn?: TurnState };
// src/sim/turn.ts
export type TurnOptions = { readonly fuse: FuseSetting; readonly onFuse?: (to: Phase) => void };
export type SaveMeta = { readonly projectId: string; readonly savedAt: string };
export type Turn = { go(e: Event): Phase; save(meta: SaveMeta, done: (text: string) => void): boolean; readonly undo: TurnState["undo"]; readonly pendingFuse: boolean; readonly settled: boolean; dispose(): void };
export function createTurn(world: SimWorld, opts: TurnOptions): Turn { … }
```
Notice text (exact): `skipCapped` with message `{"capMs":<cap>,"remainderMs":<rest>}`. Errors (exact): `createTurn: fuse must be off or an integer > 0`; `turn.save: projectId and savedAt must be strings and done a function`; `turn: battle phase missing`.

## Smoke lines
None move. Sims (stage-fixed 48/2 `afc89d56…`, stage-weighted 22/28 `b8007292…`) identical; the 21 smoke lines match the Base byte for byte except the heap line (report-only). `node tools/pixel-suite/smoke.ts`: 0 failed. The stress rigs and light raster (`s34a-equal.ts`) give the Base's output.

## Existing tests changed by ruling (and only these)
This file is shipped whole (copy it; do not hand-edit):
- Ruling 1, `tests/runtime/host/raf-driver.test.ts` (step 29): line 123 title "…and jumps big gaps fast (step 29)" → "…and jumps big gaps fast up to the skip cap (step 29; G4 R1)". Line 134 `createClock()`, `after(5e8)`, `skip(1e9)`, `at 5e8`, `now 1e9` → `createClock({ maxSkipMs: 86_400_000 })`, `after(5e7)`, `skip(1e8)`, `at 5e7`, `now 86_400_000` (the fast jump is still timed under 250 ms), with a comment naming the old values.
No other shipped pin changes (`door-gaps` row 11 and every save pin stay).

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-g4-match-loop/`) | Copy to | sha256 |
|---|---|---|
| `tests/core/clock-skip.test.ts` | `tests/core/clock-skip.test.ts` | `2ad0ca348728fff41176d4b965ebe6506ccafdef42f0c06a00e3bf0e3e7b083f` |
| `tests/sim/save-continue.test.ts` | `tests/sim/save-continue.test.ts` | `7ea68e6c3ff12c18550c3a302e90794139d8f783baa877d64f0510c3e1f0b01f` |
| `tests/sim/save-continue-qa.test.ts` | `tests/sim/save-continue-qa.test.ts` | `f7ec0ebeea079bdd858ba6b08c64578c3085d020cdee7f67c504b2b35369868e` |
| `tests/state/flow-pins.test.ts` | `tests/state/flow-pins.test.ts` | `612003ab7a5f0e75a0ee4d74f6d455ada43dd8257a31795740fe667d3df7762a` |
| `tests/core/strict1.test.ts` | `tests/core/strict1.test.ts` | `47e5d4b6dc3f0b5c7ad95e9db4b453070c5456906e173222282d8a77f31bada1` |
| `tests/runtime/host/raf-driver.test.ts` | `tests/runtime/host/raf-driver.test.ts` (replaces it) | `bd68c9edb9482c02435cb3bd4860d07ae10454d34369fe02c60a479e3c3ad28c` |

Titles (exact; 22 new):
- clock-skip: "G4 R1 skip cap: 8 h of sim per call by default; the remainder comes back with a skipCapped notice, an uncapped call has none" (30 h drains 22/14/6/0 h; exactly 8 h has no notice, 8 h + 10 ms has one); "G4 R1 skip cap setting: an integer 1 to 86400000 is the cap; anything else gives the 8 h default"; "G4 R1 skip cap is sim time: timeScale 2 and 0.5 convert the cap and give the remainder back in host ms"; "G4 R1 skip keeps the sub-tick remainder: skip then advance lands where advance alone would, at timeScale 1 and 1.5"; "G4 R1 a capped skip loses no time: the chain of remainders ends where one big skip ends, sub-ms parts kept" (four step/scale/cap mixes, one with rounding down: 3 ms steps, ×1.75, cap 1000 → 332 ticks, 4430 ms back); "G4 R1 a capped skip: render gets the host ms it ran (alpha at most 1); paused or inside a tick runs nothing and returns 0"; "G4 R1 the cap holds on the per-tick path (a tick subscriber) and timers fire in order through a capped skip".
- save-continue: "G4 R4 fuse during moving is held and lands at MOVE_DONE (straight to sideEnd); with no fuse MOVE_DONE goes to actMenu" (fuse 1230 lands at its exact ms; also held in unitDone; rejected events change nothing; a fuse after side end is ignored); "G4 R4 fuse during resolving waits through the victory check: UNIT_DONE to idle delivers it, to sideEnd or CHECK_END drops it"; "G4 R6 a save asked during moving or resolving waits for the next settled state; settled saves run at once; asks keep their order"; "G4 R5 UNDO_MOVE after load: the undo cell is saved, the move back lands, and UNDO_MOVE goes to unitSelected with the same unit"; "G4 R5 saves carry turn only once a turn exists, and a tampered turn is refused"; "G4 R7 a running fuse fires at the same sim ms after load (fuse 30000 and 1235), saved in actMenu or idle"; "G4 R2 overlays are host state: an open saveLoad or settings overlay is not saved, and load lands in overlay.none with the clock running"; "G4 R8 save, load, continue equals unbroken play at every step and tick (phase driver: both stages, levels on and off, fuse 60000 and 1230)"; "G4 R8 save, load, continue equals unbroken play with moves in flight (tick driver: both stages, levels on)".
- flow-pins: "G4 R3 CLOSE from pause, from settings or saveLoad opened via pause, and from either opened directly lands in overlay.none (no back-stack)"; "G4 R4 the tables: FUSE_EXPIRE is taken only in idle, unitSelected, actMenu and targeting (moving and resolving ignore it, so the turn holds it); MOVE_DONE and RESOLVE_DONE leave only moving and resolving".
- strict1: "G4 R9 strict1: a dead unit frees its cell the same tick for place, move, push and reach"; "G4 R9 strict1: move, place and push onto a living unit fail (occupied, placeOccupied, blocker unit), ally or rival alike"; "G4 R9 strict1 PassThrough: allies (default) pass through allies but never end on one; none stops at allies; all passes rivals but never ends on them"; "G4 R9 strict1: an unknown occupancy policy runs strict1 with one occupancyUnsupported notice; strict1 or none given gives no notice".
(You may add tests. The hand-back lists the five shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/sg4-plants.py <clone> <base clone>` (result `kit-backup-g4/sg4-plants-result.txt`) runs the whole `node --test` suite per plant and matches **full test titles**. Each plant is a small source edit chosen to hit both branches, non-default values, an order of operations or a one-sided branch:
- C1–C12 skip: default 24 h; 24 h itself refused; over 24 h clamped instead of defaulted; cap in host ms; sub-tick remainder dropped; carried quarters ignored; host ms rounded up (one tick over); a notice on every call; render gets the whole ms; paused hands the ms back; a cap under one step runs no tick; timeScale 0 hands everything back.
- T1–T26 turn and saves: a fuse the phase does not take is dropped; held only in moving/resolving; held after the side ended; delivered only at MOVE_DONE; side end keeps a held fuse; onFuse told while held; the delivered fuse not told; END_TURN leaves the fuse running; a loaded fuse restarts at full length or is not re-armed; undo is the tapped cell, kept after actMenu, cleared at MOVE_DONE; CANCEL keeps or always clears the selection; rejected events still book-keep; snapshot always writes turn; restore drops turn or takes it on trust; overlay filter by key name, or keeping only battle; saves flushed while a fuse is held, dropped, reversed, always deferred, kept after dispose.
- S1–S2 tables: CLOSE from settings back to pause; FUSE_EXPIRE taken in moving. U1–U5 strict1: a dead unit keeps its cell; push ignores units; reach ends on an ally; `none` treated as `allies`; a non-string policy gives no notice.
Expected: **45/45 caught. On the Base the seven R1 tests fail and the save-continue file fails to load; R3, the R4 table pin and R9 pass there (Base behaviour; S1–S2 and U1–U5 are the proof).**

## Decisions note: what to name
- Why the cap is sim time but the remainder is host ms, why the host-ms budget rounds down, and why a cap under one step still runs a step.
- Why paused or in-tick skip returns 0 rather than `ms` (matches paused `advance`).
- Why the turn holder is opt-in and leaves `runMatch`, `runTicks`, the player and chaos untouched (sims and their snapshot hashes).
- Why a held fuse is delivered at the first phase that takes it instead of adding table rows (tables are Modes'; STATES rule 5).
- Why the host submits the move back for UNDO_MOVE (game action in the log; undo is a mode option).
- Why a held fuse counts as unsettled for saves, and why overlay keys are dropped by value.

## Do not touch
`src/types/core-types.ts`; `src/state/**`; `src/core/**` except `src/core/clock/**`; `src/rules/**`; `src/runtime/**`; `src/sim/**` except `turn.ts`, `run.ts`, `types.ts`, `index.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `eslint.config.*`; `BUILD_GUIDE.md`; `STATES.md` and `docs/STATES.md`; `scripts/check-state.sh`; `tools/**`; every existing test file except `raf-driver.test.ts` shipped above; `locked/`; `data/*.md`; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 726 tests passing (703 + the 22 new + QA's guard test) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:law and check:state each exit 0.
- [ ] The five shipped files are byte-identical to the sha256s above.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; the 21 smoke lines match the Base (heap line report-only); every pin other than the one listed move unchanged; `git diff e9b8056b --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/rules src/runtime tools` is empty.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`; `node tests/perf/stress-budget.ts` prints the Base's counts (27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0) and stress L p95 under 2 ms.
- [ ] `skip(30 h)` on a default clock returns 79200000 with the `skipCapped` notice at now 28800000 (pinned).
- [ ] Each file within its cap; at most 400 changed lines in total (the proto is 371).
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- **raf-driver remainder** (host): `catchUp`/stall still drops what the cap hands back; a tab back after more than 8 h loses the rest. Offline catch-up is the modes layer's (offlineMode estimate) and phone chunking the host's: D3 host-guide line.
- **STATES §2 "back to pause"**: superseded by Ruling 3; doc fix to D3 (the back-stack stays a later option).
- **actMenu END_TURN**: doc only (Modes), D3.
- **The overlay stack holder and mode table** (STATES §1–§2): later steps; this step only keeps overlays out of saves.

## Out of scope
Game rules. Format changes (the `turn` snapshot key is optional and written only by the opt-in holder; `SAVE_FORMAT` stays 1). New table rows or events. Offline estimates. Any change in `runMatch`, `runTicks`, the player, chaos, `raf-driver` or the render files.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/share/g4/push-sha256.txt` (6 files):
- `handoff/steps/step-g4-match-loop.md` (this file)
- the five shipped files under `handoff/steps/tests/step-g4-match-loop/` (table above)

## Rulings (no open questions)
- EA ruling (item 32 words): cap range and fallback, remainder unit (host ms), rounding down, one-step minimum, notice code and message, paused/in-tick 0, timeScale 0.
- EA ruling (Modes inputs): the held fuse is delivered at the first phase that takes it (covers RESOLVE_DONE without new rows); settled = not moving/resolving and no held fuse; undo cell recorded at TAP_MOVE_CELL and cleared on leaving actMenu; the host submits the move back.
- EA ruling (save format): `turn` is an optional snapshot key, written only by `createTurn`; overlay-valued phase keys are never written; no `SAVE_FORMAT` bump (old saves have no `turn` and load as before).
- EA ruling (strict1 words): Modes' "fails occupied" is `occupied` (move), `placeOccupied` (place) and blocker `unit` (push), as on the Base.
- EA ruling (scope): no overlap with G1/G2b files; one existing pin moves (raf-driver step 29).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 726 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The five shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the sim lines, the stress lines and the `smoke: 0 failed` line.
- The bundle is `<Base e9b8056b>..step/step-g4-match-loop-r<N>` and passes `git bundle verify`. Each file stays within its cap, and the total (insertions + deletions) is at most 400 changed lines (the proto is 371). Every pin other than the one listed move unchanged.

## Delivery
On branch `step/step-g4-match-loop-r<N>` (base `e9b8056b`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-g4-match-loop-r<N>.bundle e9b8056b..step/step-g4-match-loop-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-g4-match-loop-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-g4-match-loop/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, its § Helpers & self-review must list each helper and what it reviewed plus your self-review, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
