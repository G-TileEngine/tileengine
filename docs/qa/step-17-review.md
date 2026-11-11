# Step 17 lean review (memory guard: dispose safe twice, capped bus history with the match log kept whole, blocking freed-world GC test, report-only heap smoke)

**Date:** 2026-11-11 23:32 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-17-memory-guard.md` sha256 `cdd0cdeae28ff56bdf3f5445582d42a36cf9f0b338c11ae0ed074fea2e7ba4d8` (162 lines)
**Backup of this sha:** `/workspace/qa-runs/s17-review/step-17-cdd0cdea.md`
**Base:** `04dd7fbde045f5897bc65946efc428fd99a30b96` — confirmed `origin/main` (PR #21 merge of step 16; parents `045c3c6` and `ffed78f`, as EA described). Clone was fetch-only and left at local `045c3c6` (`behind 3`); working tree not checked out or edited.
**CN:** none, as claimed. `Clock` / `EventBus` / `PlayerReject` are not in a pinned file; `package.json` stays `1e5dd82c…` (GC is turned on from inside `tests/sim/gc.test.ts` via `v8.setFlagsFromString` and `vm.runInNewContext`). Pins hold: core-types `f00c722c…`, depcruise `dcf61c61…`, lock `d7f64a09…` identical to Base. GUIDE sha256 `c27e1292…` (unchanged).
**Kit docs:** README sha256 `a2ea6a9320a2d55ff6e85584895cf5682856fc919f61d584bbf887b249818f6a`; core-spine sha256 `5ec15c5a70d4c7fa134476c3c16163233f3132887b7753a3946fae0cc45fc1eb`; outline sha256 `53879de5a3c4927b537907220b3063bc2c455030dd8f0ca6b82de5f3e78c9d7d` (found under `/workspace/tileengine/`, not yet on `origin/main`). Status lines correctly pin Base `04dd7fb`. Small kit-doc nits below.
**Prototype:** already at `/workspace/qa-runs/s17-review/proto` (HEAD `eab2d175faaff866e02619cd0ff4bf3b597754d7`, two commits on `04dd7fb`, first `101a72b`). Greps / plants scripts were already copied there; a plants runner was retargeted off `/tmp` (`s17-plants-run.sh` calls `s17-greps.sh`). `/tmp` was not edited.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

## Result

**OK TO SEND** on sha `cdd0cdea…` (162 lines). Green is **205/0**, sim is unchanged, G7 is 217+/15− = **232** of 270, pins hold, greps **49/49**, plants **24/24** test and **13/13** grep (including a planted leak and a no-op `gc`). The four chaos and six exploit lines are byte-identical to the base / the step-16 pins. The heap smoke is format-checked only. L83 holds: no new RNG draws in the src diff. No CN miss, no build-law miss, no scope creep (exactly the 17 named files; DNT empty). Mobile relevance is explicit (a phone playing level after level, before card-free levelling).

The GC test is deterministic enough to gate green (CEO Q6): **30/30** alone, **32/32** with eight runs at once, **10/10** full `npm test` (205/0 each). It fails on a planted leak and on a no-op `gc` (plants M1–M6, G1). The heap line’s numbers vary (this run: deltas −0.15 to +0.28 MiB over 30 solo runs) and correctly never fail green.

Rulings (a), (b) and (c) are adopted. (b) does not conflict with the step-16 door rule.

Kit-doc nits to bump on send (not step-file fixes): README’s step-17 “Lines” cell is **270** (the G7 cap) rather than **162**; Verification still stops at step 16 and should add proto `eab2d17`, 205/0, 232 of 270; spine’s step-17 size is “—” rather than **~232**. The outline’s cap sentence was updated, and a new §10 (online-play MUST items) was added — more than “one line”, but not a send-block.

---

## Kit-doc nits (bump on send)

1. **README table, step-17 row, Lines column:** 162 (the step file), not 270.
2. **README Verification:** add step 17 on proto `eab2d17` on `04dd7fb`, 205/0, `npm run sim` and the ten existing smoke lines unchanged, 232 of 270, GC 30/30 + 32/32 + 10/10, plants 24/24 + 13/13.
3. **core-spine step-17 size:** ~232 (not “—”). The 2026-11-10 update blurb still says 00–15 merged at `adce774` / step 16 written; the current header is already right.
4. **Outline:** the stale “An event-bus history cap is not in this scope” line is now “… (it is step 17, memory guard)”. EA also added a new §10 (CEO Q2 online-play MUST items). Useful capture, not a hold; just more than the claimed one line. The step file still says this outline edit is “after merge”; doing the cap sentence now in the kit docs is fine.

Residual, not a send-block: EA’s “at least 4 lines of slack per file” is off by one on `src/core/events/index.ts` (2/5, slack 3). Every file is within its cap.

---

## 1. Shas / line counts / Base / kit — PASS

| Check | Result |
|---|---|
| Step sha / lines | `cdd0cdea…`, **162** lines, matches EA |
| Base / merge | `04dd7fb` is `origin/main` (PR #21, parents `045c3c6` + `ffed78f`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to Base |
| CN | none, as claimed (`package.json` untouched; `gc` only in the test) |
| Kit shas | README `a2ea6a93…`, core-spine `5ec15c5a…`, outline `53879de5…`, as claimed |

---

## 2. Prototype `eab2d17` — PASS (green, caps, greps, plants)

On the existing copy `qa-runs/s17-review/proto`, Node v24.22.1. `node_modules` came with the copy; lock matches Base. Greps were run as `<script> <dir> 04dd7fb`.

| Check | Result |
|---|---|
| `npm run green` | exit 0; **205/0/0/0**; tsc / lint / deps (67 modules, 202 deps) / check:state / check:law OK. Log: `qa-runs/s17-review/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes | gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592, docs 581/1419 and 607/1393 findings 0 — **byte-identical** to the step-16 / base pins |
| Heap smoke | one line, format-asserted only: `heap smoke stage-weighted matches 30 run+disposed: before <a> MiB after <b> MiB delta <±c> MiB`. First green: `10.12` / `10.38` / `+0.26`. Never a number gate |
| G7 `04dd7fb..HEAD` excl. handback/lock | **17 files, 217+/15− = 232** ≤ 270. name-status is exactly the 17 kit files (`A` for the four created). DNT empty. Per-file caps all hold; tightest after `events/index` 2/5 is clock 11/16, bus 23/28, gc.test 56/60, core dispose test 53/58, sim dispose test 38/44, dispose.ts 15/20 |
| Interface quotes | `dispose()` on Clock and EventBus, `BusLimits`, `DEFAULT_BUS_LIMITS = { history: 1024 }` plus its comment, the `createBus` third parameter, `SimInput.busLimits?` after `stageLimits`, eight-reason `PlayerReject` including `"disposed"`, `disposeWorld` / `isDisposed` over one `WeakSet<SimWorld>` |
| Greps | **49/49 ALL OK** (saved `s17-greps.sh`, base `04dd7fb`; structure and names, not wording, as claimed) |
| Kit plants | **24/24** test plants fail a named test; **13/13** grep plants caught. Includes G1 (no-op `gc` fails the GC test) and the leak plants (clock/bus/world skipping dispose). Tree restored clean at `eab2d17` |
| Build law | one clock / no `Date` / `Math.random` / rAF in the src diff; no `WeakRef` / `memoryUsage` / `gc()` / `node:v8` / `node:vm` in `src`; UNIT/TILE pipes only; door words stay out of `player.ts` / `driver-phase.ts` / `dispose.ts`; one `submit(` in `player.ts` |
| Draw order (L83) | **holds.** The step file says “this step adds no random draw.” The src diff adds no `rng` / `streamSeed` / `.next(` / `Math.random` calls. Dispose is only in the new tests; existing smokes and sim are unchanged |

---

## 3. GC test — reliable enough to gate green (Q6)

The blocking test (Behaviour 7) awaits up to 10 rounds of `setImmediate` + `gc()`, asserts a disposed world *is* collected while the host still holds its clock, bus, late listeners and one pending move, and asserts the same scenario *without* dispose is *not* collected. The heap smoke (Behaviour 8) is a separate, report-only test in the same file.

| Run | Result |
|---|---|
| Alone | **30/30** (matches EA) |
| Eight at once, four waves | **32/32** (matches EA) |
| Full `npm test` | **10/10**, each **205/0** (matches EA) |
| Planted leak / no-op `gc` | both fail the named GC test (M1–M6, G1) |

No flake in this review. The 10-round cap has headroom in practice (no timeout-style failure under parallel load). Timing and heap *numbers* are not used as a gate: only WeakRef cleared / not cleared is asserted, and the heap line is format-only. That is the right split under CEO Q6 (green checks only what is reliable). Making the heap smoke a gate would be a hold; it is correctly deferred.

Log: `qa-runs/s17-review/gc-flakes.log`.

---

## 4. Rulings — adopt (a), (b), (c); no conflict with the door

**(a) `DEFAULT_BUS_LIMITS` lives in core as an engine setting, like `DEFAULT_STEP_MS`. Adopt.** It is defined and documented in `src/core/events/bus.ts` (`{ history: 1024 }`) and exported from `src/core/events/index.ts`. `DEFAULT_STEP_MS` already lives in `src/core/clock/clock.ts`. Neither is a game rule; makers override the bus cap through `SimInput.busLimits` or `createBus`’s third argument. One `1024` in `src`, only in that bus file.

**(b) Driving a disposed world with `runMatch` / `runTicks` throws a named `Error`; `feed` refuses with `disposed`; `submit` is a no-op. Adopt.** Exact texts: `Error("runMatch: world is disposed")`, `Error("runTicks: world is disposed")`. `feed` reads the phase, then `isDisposed`, then the shape guard, and returns reject `"disposed"` without pushing into `history()`. `submit` returns at once (no log, no move, no timer).

**No conflict with the step-16 door rule.** A malformed *wire* on a live world is still a named `"malformed"` reject, never a throw. The `runMatch` / `runTicks` throws are host-API misuse (driving a closed world, law 10), and they fire before any phase write or clock step. They never fire on a wire shape. A feed after dispose is also a reject (`disposed` wins if both would apply), not a throw, and is not kept in history.

**(c) The command log and results stay readable after dispose. Adopt.** `disposeWorld` only marks the `WeakSet` and calls `clock.dispose()` / `bus.dispose()`. The log, units, grid, notices, phases and rng are not cleared; the disposeWorld test pins `[snapshot, log.toJSON(), notices]` unchanged. `src/core/log` is untouched.

---

## 5. Bus cap at the boundary — PASS

`createBus` reads `limits.history` first, throws `RangeError("createBus: history must be an integer >= 0")` unless it is an integer ≥ 0, pushes then trims oldest so at most `history` remain, *before* listeners run. `seq` keeps counting.

Independent check against a default-capped bus:

| Emits | Length | First seq | Last seq |
|---|---|---|---|
| 1023 | 1023 | 1 | 1023 |
| **1024** | **1024** (all kept) | 1 | 1024 |
| **1025** | **1024** (drops seq 1) | 2 | 1025 |
| 1030 | 1024 | 7 | 1030 |

Matches the kit test (1030 emits → length 1024, first seq 7). Cap 0 keeps no records while listeners still hear events. The command log is never capped.

Official `npm run sim` matches (both boards, seeds 1–50) have a max bus history of **148** (stage-weighted seed 20), well under 1024. EA’s “largest 187” was not independently recovered on those sim matches (a cap unit test that fills a default bus to 1024 is not a match). 1024 is still several times the official-sim max and leaves the pinned sim / smoke lines unchanged. Not a hold.

---

## 6. Scope, law, docs, mobile

Scope is the 17 named files only. No creep into `src/core/log`, rng, project, fx, runtime, or the hunter. Build-law greps are clean. The Goal correctly ties this step to **mobile memory** (level after level on a phone, before step 18 levelling), which is a plus.

No invariants edit was asked in this review. The step file notes QA may later add memory ids and `disposed` to (a)9.

---

## Residuals (not send-blocks)

- `src/core/events/index.ts` has 3 lines of slack (2/5), not 4.
- EA’s 187-record “longest match” figure was not reproduced on official sim seeds (max 148 there).
- Kit-doc nits in the section above.
- Heap numbers are machine-dependent, as disclosed; keep them report-only.
