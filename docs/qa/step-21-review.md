# Step 21 lean review (H2a hard limits: finite door budget, MatchLimits, logFull / timeLimit)

**Date:** 2026-11-12 15:28 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-21-hard-limits.md` sha256 `5153054da856bd53ccdfe2f0d62cfe8d195532f8b75eb2c30e672415d87d371e` (174 lines). Copy at `/workspace/tileengine-repo/qa-runs/s21-review/step-21.md` is byte-identical.
**README / spine:** `e3a158e3170a7a983b46f7009a99aa3c2dae46574c7af7da0fb83c5a304146a9` / `d67c823ca213f68644e3c48d168035f93228fea70ce391220147635d3b955bf0`. Step 20 is unchanged at `e6e9c8ca`.
**Prototype:** one commit `411bf98a3fb1aa73a2fd8d256b803f593d1ac5b0` on `eb4d16a`, copied to `/workspace/tileengine-repo/qa-runs/s21-review/proto`. `/tmp` was not edited. `refs/cmp/*`, GitHub and Drive were not touched.
**Scripts (copied):** greps `de571456…`, grep-plants `328c2f1a…`, plants `65c6437d…`, h1-plants-adapted `870888dd…`. Grep-plants were retargeted at the review copies (`work/h2-grep-plants.local.sh`), not `/tmp`. Accepted caps `h2-caps-ACCEPTED-2026-11-12` `ac826d36…`.
**CN:** none, as claimed. Pins identical to `eb4d16a`: core-types `f00c722c…`, package.json `1e5dd82c…`, depcruise `45a3dbaa…`, check-law `4d7bbf48…`, lock `d7f64a09…`.

## Result

**OK TO SEND (pending rebase)** on proto `411bf98` / step `5153054d…` (174 lines). No holds. The step-20 merge is the release base; this early review is on `eb4d16a`. After the merge: rebase, retarget G1–G3 / plants, delta recheck.

Green **492/0**, tsc / lint / deps / check:law clean. G7 **232** of 292 in **15** files, each file exactly 4 under its cap. Greps **30/30**, grep-plants **27/27**, plants **22/22**, h1-plants-adapted **33/33**. The 20 smoke lines are byte-identical to `eb4d16a`. `npm run sim` prints the base lines (`48/2` `afc89d56…`, `22/28` `b8007292…`).

## Design checks

1. **Finite door budget.** `plainCopy(v, depth)` defaults to `PLAIN_NODES = 2^20`; whole inputs use `PLAIN_DEPTH = 32`. Re-ran the r2 liars (`length` 1e9, `2**32`, 1e7, every index own) at default budgets. Refused with `seen = 0` and no item walk, in well under 5 ms, at: `plainCopy`, `readAction`, `append`, `createWorld`, `submit` (`actionRefused`, `lastSeq` 0), `replay`, `restore`, `moveTo`, `createClock`, `createLevels`, `createGestureMapper` (opts and sample), and `chaosIntents`. `createLog` has no array copy of the header; a liar in a header string field is `RangeError` with `seen = 0`. `parseLog` is JSON text only (the entries-length check is on the parsed array). `clock.after` is not a copy door: a liar `ms` is the step-20 inert id-0 timer, `seen = 0`. Official test plus H2 plant B3 / h1-adapted **L1**: an explicit `nodes = Infinity` still refuses lying lengths `-1`, `1.5`, `NaN`, `Infinity` with `seen = 0`. A *finite* 1e9 liar with `nodes = Infinity` still hangs (killed at 2 s) — expected; the new default budget is what stops that path. Honest `plainCopy(new Array(2^20 − 1).fill(1), 1)` copied in **60 ms**, heap **16 → 45 MB**, RSS **106 MB** on this box; `2^20 + 1` is `NOT_PLAIN`. Official fixtures nest to depth **6**. A chain of 31 containers under `terrain` is accepted; 32 is `createWorld: input is not plain data`. Legit project data is nowhere near the cap.

2. **MatchLimits.** Ceilings and defaults match the step. Enforced at `createWorld` / `submit` / `readAction` / `createLog` / `append` / `parseLog` / `replay` / `restore`. `BTF_MATCH_LIMITS` is a separate frozen object, deep-equal to `DEFAULT_MATCH_LIMITS`, not the same reference; mutation throws, the default is unchanged. `withinCeilings`: at the ceiling yes; ceiling+1, 0, `NaN`, negatives, `1.5`, `-0`, a missing key no; `2048.0` yes. `createWorld` copies input first, so a getter/proxy limits object is snapshotted (or `input is not plain data` if it throws). A forged restore tick of **1e8** (consistent `clockMs`) is refused in **0.2–0.8 ms** (`Error: replay: tick or log over the limits`) — was 4.6 s. `2^31 − 1` and `replay(..., 131073)` likewise, before any tick runs (`start()` still builds a world; no `clock.step` loop).

3. **`logFull` before `timeLimit`.** With both caps exceeded (`entries: 1`, tick 6 > `ticks: 5`), `submit` pushes `logFull`, logs nothing (`lastSeq` stays 1), does not throw, and does not end the match (`phases` stay `{ battle: "play.loading" }`; the clock still steps). A later `submit` is still `logFull`. With only the tick cap exceeded: `timeLimit`, `lastSeq` 0. An action at exactly `limits.ticks` is logged (official test).

4. **Seeds are uint32, refused not normalised.** `createLog` / `parseLog` / seedless `createWorld` refuse `2^32`, `2^32 + 24301`, `-1`, `1.5`, `NaN` (`RangeError` / `"bad header"`). `0` and `2^32 − 1` are kept. Official boards carry a stage seed, so a bad `hostSeed` on a seeded stage is ignored — the step's test uses `seedless`. Sims and smokes unchanged.

5. **Notices.** Cap 3 and ten refused moves: 4 lines, last `{ code: "noticesCapped", message: "and 7 more" }`. A further notice still updates that one line (`and 8 more`), never a second `noticesCapped`. The same after `replay` / `restore` (notices are not in the snapshot; they are rebuilt through `note`).

6. **Draw order.** Code matches the step: `seen = new Set(have)`, first-wins push, then the same `i + rng.int(cands.length − i)` swaps. The test compares 20 seeds to the base draw written out in the test. Sim and every smoke line unchanged. No other step-21 change draws.

7. **Timed tests.** Official file 5× idle + 5× `taskset -c 0` with a busy loop on the same core, all 9/0. Isolated timings of the same work:

   | work | idle | load (worst) | limit | 2× flag | margin (load worst) |
   |---|---:|---:|---:|---:|---|
   | 40,000-id draw (official test / isolated) | 20–26 / 13–26 ms | 43 / 41 ms | 500 ms | 250 ms | ~12× |
   | three cap refusals (official / isolated) | 3–6 / 0.9–1.3 ms | 11 / 5.3 ms | 1500 ms | 750 ms | ~130× |

   No run came within 2× of its threshold. Not flagged flaky. (They are still wall time; counting work would be more robust on a slow phone, but the margins here are large.)

8. **Build law, scope, carries, H2b.** `limits.ts` has no imports. No new folder, no CN, no pin or existing-test edits, no project/reader touch. Clock / gesture / `place` options-read-once carry landed. Drivers still advance past `limits.ticks`; only `submit` refuses `timeLimit` (named deferral). **H2b / depcruise:** no CN if document caps stay on `StageLimits` (and sibling project-layer / BTF objects), with `createLevels` caps in rules. Today's layer gate already forbids `src/project` from importing `core/limits.ts` or `core/plain.ts` (only `core/notice.ts`). Do not import those into project for H2b. Sharing `withinCeilings` or `PLAIN_*` with the readers would be a layer-gate change and would want a CN; I would not do it — keep document caps out of core, same pattern as `BTF_MATCH_LIMITS`.

9. **Doc vs code.** README and spine match the step. Plants heading cites proto `4ab3557`; the size line and the actual head are `411bf98` (typography, not a hold). Behaviour 7 says `world.limits` is "the copied object"; when `limits` is omitted it is the frozen `DEFAULT_MATCH_LIMITS` singleton. No other drift that matters.

## Residuals (not holds)

- Honest 2^20-value copy is acceptable on this desktop (~60 ms, +28 MB heap) but is the worst-case door walk; real documents should stay far below this (H2b caps).
- `readAction` / `createLog` / `parseLog` use a caller-supplied `limits` live (not copied). A flipping getter can change `durationMs` / text / caps between reads. The `createWorld` path stores a frozen copy, so `submit` is safe.
- `withinCeilings` on a throwing proxy throws instead of returning false; `createWorld` only calls it on an already-copied object.
- `createLog` reads `header.seed` three times in `headerOk` and does not copy the header. A getter can flip mid-check. After `createWorld` the header is already plain.
- Seed `-0` is accepted and stored as `-0` (JSON would normalise to `0`).
- An explicit `nodes = Infinity` still hangs a finite 1e9 liar (L1 only covers non-integer lengths). The default budget is the fix for that path.

## Key numbers

- Green 492/0; tsc, lint, deps, check:law clean; duration ~3.2 s.
- G7 232 / 292, 15 files, each 4 under cap.
- Greps 30/30, grep-plants 27/27, plants 22/22, h1-adapted 33/33 (L1 bites through `nodes = Infinity`).
- 20 smokes byte-identical to `eb4d16a`; sim `afc89d56…` / `b8007292…`.
- Restore tick 1e8: 0.2–0.8 ms (was 4.6 s). Draw / cap timing margins ~12× / ~130× under 1-core load.
- Door liars: `seen = 0`, typically < 1 ms (first `submit` includes `createWorld`, ~4 ms).

## Copied shas (`qa-runs/s21-review/`)

- proto `411bf98a3fb1aa73a2fd8d256b803f593d1ac5b0` (on `eb4d16a`)
- step-21 `5153054d…` (174 lines), README `e3a158e3…`, spine `d67c823c…`, step-20 still `e6e9c8ca…`
- greps `de571456…`, grep-plants `328c2f1a…`, plants `65c6437d…`, h1-plants-adapted `870888dd…`
- accepted caps `ac826d36…`
- work logs / probes: `work/probes.log`, `work/probes2.log`, `work/timing.mjs`, greps / plants / grep-plants / sim / proto-green logs

---

## Rebase recheck 6e76f05

**Date:** 2026-11-12 16:48 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Prototype:** one commit `6e76f055af1d2b2297699909b4bec056cf384419` on `5fefa6f18c8e48d51f8216438d8e1d9163fdb9d0` (step 20 merge, PR #26, build A). `origin/main` was fetched (gh, G-TileEngine); local `main` left at `7f695c0`. New ref `refs/cmp/s21r-6e76f05` only. Work copy: `/workspace/tileengine-repo/qa-runs/s21-review/rebase/` (no overwrites of `s21-review/proto` or `work`). `/tmp` was not used as a workdir; `/tmp/h2-proto` is still on `h2b-r`.
**Kit (verified, copied):** step-21 `41d3aed8…` (Base `5fefa6f`; was `5153054d…`), `handoff/README.md` `9adc2236…`, spine `docs/core-spine-slices.md` `db09a77d…`, `handoff/BUILD_GUIDE.md` `27a12d2f…` unchanged. No CN.

### Result

**OK TO SEND** on proto `6e76f05` / step `41d3aed8…`. No holds. The pending rebase from the early review is closed.

Green **492/0** in 3.15 s; tsc / lint / deps / check:state / check:law clean. G7 **226** in **15** files, each within its cap (cap sum 292). The 20 smoke lines and both sim lines are byte-identical to `5fefa6f` (`48/2` `afc89d56…`, `22/28` `b8007292…`). Pins unchanged (`f00c722c` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48` / `d7f64a09`). Greps **30/30**, grep-plants **27/27**, plants **22/22**, h1plants-A **32/33** (D4 equivalent).

### Patch vs `411bf98`

The two patches touch the same 15 files. Nine are identical (`limits.ts`, `match-limits.ts`, btf `index.ts`, `clock.ts`, `events/types.ts`, `units.ts`, `gestures.ts`, `sim/types.ts`, `hard-limits.test.ts`). The six that differ (`plain.ts`, `log.ts`, `levels.ts`, `actions.ts`, `run.ts`, `world.ts`) are typography from resolving onto build A's code (`walk` / `NOT_PLAIN` instead of `throw STOP`; `copy` not `own`; `src` not `live`; `restore` calls `replay` instead of a shared `play`). Every H2a guard is present:

- Default budget `PLAIN_NODES = 2^20`, `plainCopy(..., nodes = PLAIN_NODES)`; length still `Number.isInteger(n) && n >= 0 && n <= left.n`.
- `createWorld` / `replay` copy at `PLAIN_DEPTH` (32); `withinCeilings` before anything is built.
- `readAction` enforces `durationMs` and text; `createLog` / `append` / `parseLog` enforce uint32 seeds, entries and ticks (count check before the parse loop).
- `submit`: `logFull` (entries) before `timeLimit` (ticks); the match is not ended.
- **`replay` checks the cap before any tick** (`untilTick > world.limits.ticks || log.lastSeq() > world.limits.entries` sits after `createWorld` and before the entry loop). **`restore` reaches it through `replay`** after the snapshot/clock/`logSeq` checks. A forged tick **1e8** (consistent `clockMs`) is `Error: replay: tick or log over the limits` in **0.3–0.8 ms** idle (load worst 7.3 ms; was 4.6 s before the cap). `2^31−1` and `replay(..., 131073)` likewise.

### Probes and timing

Default-budget liars (`1e9`, `2**32`, `1e7`) at every door: `seen = 0`, typically < 1 ms (first `createWorld` ~5 ms). `submit` is `actionRefused`, `lastSeq` 0. L1 through `nodes = Infinity` still refuses `-1` / `1.5` / `NaN` / `Infinity` with `seen = 0`; a finite 1e9 liar at `Infinity` still hangs (killed at 2 s). Honest `2^20−1` copy 90 ms, heap 16→45 MB; `2^20+1` is `NOT_PLAIN`. Official fixtures nest to depth 6; a 32-deep nest under `terrain` is `input is not plain data`. MatchLimits / BTF / `logFull` before `timeLimit` / uint32 seeds / one `noticesCapped` line: same as the early review (including `-0` stored as `-0`, live `readAction`/`createLog` limits, and official boards ignoring a bad `hostSeed`).

Official hard-limits tests: 5× idle + 5× `taskset -c 0` with a busy loop on the same core, all 2/0. Isolated timings of the same work:

| work | idle | load (worst) | limit | 2× flag | margin (load worst) |
|---|---:|---:|---:|---:|---|
| 40,000-id draw (official / isolated) | 27–64 / 32–59 ms | 66 / 42 ms | 500 ms | 250 ms | ~7.5× / ~12× |
| three cap refusals (official / isolated) | 8–21 / 1.0–1.4 ms | 22 / 1.3 ms | 1500 ms | 750 ms | ~68× / ~1100× |

No run came within 2× of its threshold. Restore tick 1e8 isolated: 0.3–3.3 ms idle, 7.3 ms load worst.

### D4 and the s20 verify note

h1plants-A miss **D4** (no node budget) is **equivalent**: dropping the early `left.n` refusal does not fail the door-copy test, because that test only exercises the budget through an array, where `n > left.n` still refuses. Independently, a wide object `{k0…k9}` under `nodes = 5` is `NOT_PLAIN`, and a 3-level nest under `nodes = 3` is `NOT_PLAIN`. Product is right; this is a missing object-budget test, carried to step 23.

`/tmp/s20-verify-report.txt` (copy `b84301d1…`) was skimmed: merge verify of `5fefa6f` is PASS 9/9 (483/0, sim and 20 smokes unchanged, pins hold). It already recorded D4 as a test gap, not a behaviour hole, and listed H2a carries (default budget, depth 32, options-read-once) that this rebase lands.

### Residuals (not holds)

Same as the early review, still not holds: honest 2^20 copy cost; live `limits` on direct `readAction` / `createLog` / `parseLog`; `withinCeilings` on a throwing proxy throws; `createLog` header triple-read; seed `-0` stored as `-0`; explicit `nodes = Infinity` hangs a finite 1e9 liar. Plus D4's missing object-budget test (step 23). Restore still compares `clockMs` to a fresh default `stepMs` (s20 C5, H4).

### Key numbers

- Green 492/0; tsc, lint, deps, check:state, check:law clean; 3.15 s.
- G7 226 / 292, 15 files, each within cap. Src: limits 21/25, log 28/34, world 18/26, actions 17/21, run 5/9, plain 3/7, others 4 under.
- Greps 30/30, grep-plants 27/27, plants 22/22, h1plants-A 32/33 (D4 equivalent).
- 20 smokes byte-identical to `5fefa6f`; sim `afc89d56…` / `b8007292…`.
- Restore tick 1e8: 0.3–0.8 ms typical, load worst 7.3 ms, via `replay`'s cap. Draw / cap margins ~7.5× / ~68× (official, 1-core load).

### Copied shas (`qa-runs/s21-review/rebase/`)

- proto `6e76f055af1d2b2297699909b4bec056cf384419` (on `5fefa6f18c8e…`)
- step-21 `41d3aed8…`, handoff README `9adc2236…`, spine `db09a77d…`, BUILD_GUIDE `27a12d2f…`
- greps `de571456…`, h2r-grep-plants-A `284d2427…`, h2r-plants-A `6e09ed00…`, h2r-h1plants-A `70ec03c7…`
- s20-verify-report `b84301d1…`
- logs: `green.log`, `sim.log`, `probes.log`, `d4-probe.log`, `timing.log`, `timing-isolated.log`, greps / plants / grep-plants / h1plants logs
