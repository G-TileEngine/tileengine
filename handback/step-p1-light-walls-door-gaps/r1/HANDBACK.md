# Hand-back step-p1-light-walls-door-gaps r1
Step file: handoff/steps/step-p1-light-walls-door-gaps.md (kit sha256 d65a55224c5b4ef48b05613f3ceb7e31a97fe292490508baa76753b5222c66a0)
Base commit: d867161c9e5e0ae3829cba172e8a8bb4ac6d432a     Head commit: 591e5d3346728e24fc1173a2ae841c16382e7c7b     Branch: step/step-p1-light-walls-door-gaps-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/clock/clock.ts
M	src/core/log/log.ts
M	src/runtime/render/index.ts
M	src/runtime/render/visibility.ts
M	src/sim/actions.ts
M	src/sim/run.ts
A	tests/runtime/render/light-walls.test.ts
A	tests/sim/door-gaps.test.ts

## Green
npm test: 702/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` then `npm test`, `npm run typecheck`, `npm run lint`, `npm run deps`, `npm run check:state` and `npm run check:law` each exited 0. Summary from test-output.txt: tests 702, pass 702, fail 0, cancelled 0, skipped 0, todo 0. depcruise: 106 modules, 335 dependencies, no violations.

## Shipped tests (sha256, unchanged)
7fc41d977f7b95a07b847fe1122db6d88c61d855475a0b83575d5d20529c7b6f  tests/runtime/render/light-walls.test.ts
6f23cb22440d0b50bfb5e146d001b033c6c5382c4c5965e5817ceaf8bc2147ce  tests/sim/door-gaps.test.ts

## Sims and stress L
`npm run sim`:
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
The 20 pinned smoke lines are the ones the suite asserts (chaos, chaos-gen, exploit, exploit-docs 516/1484 and 547/1453, exploit-levels, levels). They passed inside the 702. The heap line is report-only; this run printed `delta +0.50 MiB`.

`node tests/perf/stress-budget.ts` (quiet, exit 0). Stress L, every lap under 2 ms:
```
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.13 p95 1.92 ms; lap 2 p50 1.15 p95 1.84 ms; lap 3 p50 1.08 p95 1.69 ms; counts 27/373/0
```
An earlier run while the review helpers were still working had L lap 2 at p95 2.50 ms (laps 1 and 3 were 1.61 and 1.58) and failed the assert. That was this 2-vCPU box, not a limit change. The quiet run above is the one that exited 0. Counts stay 27/373/0. `tests/runtime/perf-34b.test.ts` was not edited and passed in the 702.

## Helpers & self-review (required)
- Helper "Review light-wall ray and cache": rulings 1–4, `visibility.ts`, the `wallsFrom` export, and that `light.ts` is unchanged. PASS. The ray runs after the octant cast, only on cells already marked, inside the radius box. A corner blocks only when both ways round it are walled. Absent `lightWalls` skips the loop. The cache key adds the walls-list id and still clears at 256. visibility 31 changed lines (cap 40), index 2 (cap 2).
- Helper "Review door-gap refusal rulings": rulings 5–10 against `clock.ts`, `log.ts`, `actions.ts`, `run.ts` and the shipped door test. PASS, 6/6. The effects cap is one token in `tooLong` after the plain copy. The second `isDisposed` returns with no note. `after` keeps the old message and allows `INT_MAX`. The tick guard covers timers and tick subscribers in `runTick` and on `skip`'s fast path, with `try/finally`, and leaves render outside. `loadSave` maps only the phases error. `logRows` reads `entries()` once and refuses a 1e9 length before looping. `replay`'s signature is unchanged. Caps: clock 32/40, log 2/4, actions 1/6, run 32/40. No `phase` identifier in `src/core`.
- Helper "Cross-check P1 files caps pins": paths, sha256, pins, caps, rAF, imports. PASS. Eight paths only. Both shipped sha256s match. Pins match. Changed lines +193/−22 = 215. `requestAnimationFrame` in `src/` only in `raf-driver.ts`. Nothing under `src/` imports `tools/`. No `.only` / `.skip` / `.todo`.
- Self-review: Acceptance — green 702/0 done; both shipped files byte-identical done; sims are the two lines above and the pinned smoke lines passed, heap line report-only done; `git diff d867161c --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state tools` is empty done; each file inside its cap and 215 changed lines done; perf-34b unchanged and passing, stress L under 2 ms done; QA's post-34 probes are QA's, not this build's done (not run here); every ruling's pinning test passed (the 10 titles) done; this hand-back is the last commit done.
- Self-review QA G1–G10: G1 done (702/0, no skip/only/todo, shipped sha256s equal; `/workspace/scratch-ea` is not on this machine so `sp1-plants.py` was not run). G2 done (typecheck exit 0, no ts-ignore, no `any`, tsconfig untouched). G3 done (`check:state` OK). G4 done (`Blockers`, `wallsFrom`, and `SaveRefusal` match the quotes; `replay`, `restore`, `loadSave` and the clock, log and actions exports are unchanged). G5 done (do-not-touch paths absent from the diff; `light.ts` untouched). G6 done (only the step's 8 files). G7 done (215 lines, every file at or under its cap). G8 done (lint, deps, law; no new rAF; render does not import core). G9 done (decisions below). G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- The ray runs after the shadowcast, only on cells the cast already marked, inside the box one radius out from the light cell. No `lightWalls` skips that loop, so the mask and the light walks stay the Base. An all-zero list is walked and clears nothing.
- The line is centre to centre, compared in integers. A corner blocks only when both ways round it are walled, so light goes round a short wall's end. An edge is walled if either cell has the bit (n 1, e 2, s 4, w 8).
- `wallsFrom` takes `{ cols, rows, hasWall }` because render does not import core. The host passes `lightWalls: wallsFrom(grid)`; absent stays no walls. The existing sight cache still clears at 256 and now includes the walls list's object id in the key. No new cache.
- The effects cap is `a.effects.length > n` inside `tooLong`, and `n` is `limits.text` (128). No new limit field. The plain copy still runs first (the ~93 MB carry is not fixed). A world disposed during that copy returns with no note, same as the first `isDisposed` line.
- `after` adds `ms > INT_MAX` (`2147483647`) to the old check and keeps the old RangeError text. `INT_MAX` itself still arms a timer.
- `ticking` wraps timers and then tick subscribers, in `runTick` and on `skip`'s fast path, in `try/finally`. `step`, `advance` and `skip` report `RangeError("<name>: called inside a tick; ignored")` through `onError` and return. Render is outside the guard.
- `restore` reads `entries()` once. The length must be an integer from 0 to `MATCH_CEILINGS.entries` (1e9 is refused before the loop). Each row must be a record with an integer `tick` and a record `action`. Any throw becomes `restore: the log is not plain data`. `replayList` replays that copy. `replay(input, log, untilTick)` is unchanged.
- Phase keys must equal the replayed world's, and each value must be in `ALL_PHASES`. `loadSave` maps only that error to `saveSnapshotPhasesInvalid`; other restore errors still throw. That code is a runtime result, not saved data. Law 13: nothing new is kept across frames. Changed lines +193/−22 = 215. `/workspace/scratch-ea` is not here, so the plant script was not run.

## Next step (optional proposal)
- D3: tell hosts to pass `lightWalls: wallsFrom(grid)`, and note that a log entry's `tick` / `action` getters are read once and not deep-copied.
