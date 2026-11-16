# Hand-back step-g4-match-loop r1
Step file: handoff/steps/step-g4-match-loop.md (sha256 2be50002483070b46e63bb8f62835b303068f0d75a83649b5c29e4040acb78cd)
Base commit: e9b8056b16d2afffb9a096f72e47ad559f230472     Head commit: fb0c9454c9347031dd6c2fcc7d38db497a4fbf80     Branch: step/step-g4-match-loop-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/core/clock/index.ts
M	src/core/clock/types.ts
M	src/sim/index.ts
M	src/sim/run.ts
A	src/sim/turn.ts
M	src/sim/types.ts
A	tests/core/clock-skip.test.ts
A	tests/core/strict1.test.ts
M	tests/runtime/host/raf-driver.test.ts
A	tests/sim/save-continue.test.ts
A	tests/state/flow-pins.test.ts

## Green
npm test: 725/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` then `npm test` exited 0. Summary from test-output.txt: tests 725, pass 725, fail 0, cancelled 0, skipped 0, todo 0. typecheck, lint, deps, check:state and check:law each exited 0. depcruise: 107 modules, 343 dependencies, no violations.

`npm run -s sim`:
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
`node tools/pixel-suite/smoke.ts` printed `smoke: 0 failed`.

`node tests/perf/stress-budget.ts` (exit 0). Counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. Stress L p95 under 2 ms:
```
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.33 p95 0.61 ms; lap 2 p50 0.23 p95 0.40 ms; lap 3 p50 0.23 p95 0.45 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.45 p95 0.85 ms; lap 2 p50 0.40 p95 0.70 ms; lap 3 p50 0.39 p95 0.70 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.83 p95 2.40 ms; lap 2 p50 1.14 p95 1.78 ms; lap 3 p50 1.12 p95 1.60 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.59 p95 2.10 ms; lap 2 p50 1.59 p95 2.14 ms; lap 3 p50 1.59 p95 2.11 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.14 p95 1.44 ms; lap 2 p50 1.13 p95 1.39 ms; lap 3 p50 1.15 p95 1.43 ms; counts 27/373/0
```

## Shipped tests (sha256, unchanged)
2ad0ca348728fff41176d4b965ebe6506ccafdef42f0c06a00e3bf0e3e7b083f  tests/core/clock-skip.test.ts
7ea68e6c3ff12c18550c3a302e90794139d8f783baa877d64f0510c3e1f0b01f  tests/sim/save-continue.test.ts
612003ab7a5f0e75a0ee4d74f6d455ada43dd8257a31795740fe667d3df7762a  tests/state/flow-pins.test.ts
47e5d4b6dc3f0b5c7ad95e9db4b453070c5456906e173222282d8a77f31bada1  tests/core/strict1.test.ts
bd68c9edb9482c02435cb3bd4860d07ae10454d34369fe02c60a479e3c3ad28c  tests/runtime/host/raf-driver.test.ts

## Helpers & self-review (required)
- Helper "Review clock skip cap": rulings 1–10 on `src/core/clock/clock.ts`, `types.ts` and `index.ts`, plus the skip tests. PASS, no bugs. Cap kept only for an integer 1–86400000, else 28800000 (not clamped). Budget formula matches, including scale 0 and a cap under one step. Notice text and the absent key match. `accQ` keeps the quarter-ms leftover. Render gets the used host ms. Paused and in-tick return `{ remainderMs: 0 }` and the in-tick error is still reported. Fast path still jumps. Changed lines 18/9/2, caps 24/12/2. No `phase` identifier in core.
- Helper "Review turn holder rulings": rulings 4–7 on `src/sim/turn.ts` against the state tables, then `node --test tests/sim/save-continue.test.ts` (9/9). PASS, no file:line bugs. Fuse starts at SIDE_BEGIN via `startFuse`. A fuse the phase does not take is held, except sideEnd and play.result. MOVE_DONE with a hold writes sideEnd. UNIT_DONE to idle delivers; UNIT_DONE to sideEnd, CHECK_END and SIDE_BEGIN drop it and do not call onFuse. Undo is the cell at TAP_MOVE_CELL, kept through MOVE_DONE, cleared on leaving actMenu. Saves queue until settled and keep ask order. dispose cancels the timer, clears a hold and drops the queue. A loaded `fuseDueMs` is re-armed with `after(due - now)`. 57 lines, cap 60. No `as Phase`.
- Helper "Cross-check scope caps hashes": working-tree paths, sha256, caps, Ruling 2, Ruling 9, do-not-touch, cycles. PASS. Only the 12 allowed paths. All five sha256s match. Changed lines +366/−13 = 379 (≤ 400). Each file is inside its cap. `asTurn` rebuilds by shape and a bad turn fails the existing snapshot compare. Overlay values starting with `overlay.` are dropped; other extra keys stay. `turn` is written only when `world.turn` exists. Mismatch load uses `replay` and drops turn. No occupancy file changed. No `as any`, no `@ts-ignore`, no turn↔run cycle. Do-not-touch diff is empty.
- Self-review: Acceptance — `npm ci && npm test` 725/0/0/0, and typecheck, lint, deps, check:state, check:law each exit 0, done. Five shipped files byte-identical, done. Sims are the two lines above; `git diff e9b8056b --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/rules src/runtime tools` is empty, done. Pixel smoke `smoke: 0 failed`; stress counts match and L p95 is under 2 ms, done. `skip(30 h)` on a default clock is pinned by the first G4 R1 test (remainder 79200000, notice skipCapped, now 28800000), done. File caps and 379 changed lines, done. Every ruling's pinning test passed, done. This hand-back is the last commit, done.
- Self-review QA G1–G10: G1 done (725/0, no skip/only/todo, shipped sha256s equal; the plant script is not on this machine). G2 done (typecheck exit 0; the `as string` / `as number` in `asTurn` follow a shape check, not `as any`; no ts-ignore; tsconfig untouched). G3 done (`check:state` OK; phase writes are `battle: <xGo result>`). G4 done (SkipResult, Clock.skip, maxSkipMs, TurnState, Turn, TurnOptions, SaveMeta, createTurn match the quotes). G5 done (do-not-touch paths absent). G6 done (only the step's 12 files, plus this hand-back folder). G7 done (379 lines, every file at or under its cap). G8 done (lint, deps, law; no new rAF; sim does not import runtime beyond what the Base already did). G9 done (decisions below). G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- The skip cap is sim time. `maxSkipMs` is kept only when it is an integer from 1 to 86400000; anything else is 28800000, not a clamp. One call may use `max(1, floor(max(1, floor(maxSkipMs / stepMs)) * stepQ / scaleQ))` host ms, rounded down. `timeScale` 0 uses all of `ms` and runs no ticks. A cap under one step still budgets one step.
- `remainderMs` is the host ms not used. The `skipCapped` notice is present only when that is above 0, and its message is `{"capMs":<maxSkipMs>,"remainderMs":<rest>}` with no spaces. Paused, or inside a tick, returns `{ remainderMs: 0 }` and drops the time, same as a paused `advance`. The quarter-ms leftover stays in `accQ`.
- `createTurn` is opt-in. `runMatch`, `runTicks`, the player and chaos are unchanged, so a world with no `turn` snapshots as before. No `SimInput` field for the cap; world clocks keep 8 h.
- A held `FUSE_EXPIRE` is delivered by a second `xGo` at the first phase that takes it, so `MOVE_DONE` can land in `sideEnd` in that same call. `SIDE_BEGIN`, and arriving in `sideEnd` or `play.result`, drop the hold and do not call `onFuse`. `onFuse` runs only when the fuse lands, after the phase is written.
- `TAP_MOVE_CELL` records the selected unit's cell at that call. The host still submits the move, and the move back for `UNDO_MOVE`. Undo is cleared when `actMenu` is left, including when a delivered fuse passes through `actMenu` in the same `go`.
- Settled means the phase is not `moving` or `resolving` and no fuse is held. Queued saves run in ask order after that event, on the board as it stands then. `dispose` cancels the timer, clears a held fuse, and drops the queue.
- `snapshot` drops phase values that start with `overlay.` and writes `turn` only when `world.turn` exists. `restore` rebuilds `turn` by shape (exact keys); a bad shape fails the existing snapshot compare, with no new error string. A loaded fuse is re-armed with `after(fuseDueMs − now)` and `fuseDueMs` is that timer's `dueMs`. `asTurn` uses `as string` / `as number` only after those checks. No new cache. Changed lines +366/−13 = 379.

## Next step (optional proposal)
- `raf-driver` `catchUp` still drops the remainder a capped `skip` hands back. Offline catch-up stays with the modes layer, and phone chunking with the host.
