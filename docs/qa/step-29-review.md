# Step 29 review: host frame driver (r1, FULL)

**Verdict: NOT OK.** The gates are green, EA's 34 plants all pass, and every pin, sim and smoke is unchanged. Three fixes are needed: two are one-line code fixes and one is a test fix. Q1 (expose `stats.capped`) is folded into F-1 and verified. With all three applied on a copy, the suite is still 548/0, tsc is 0, and every probe below comes out correct.

- Inputs: everything was copied to /workspace/qa-runs/step-29-review/. /tmp and scratch-ea were not modified.
- Bundle sha256 76b1f114… matches, `git bundle verify` is OK. Head 6df65b1, one commit on 4d9d872 (= origin/main; base tree d6fca546).
- Ref **refs/cmp/s29-proto-r1** = 6df65b1.
- `git merge-tree --write-tree origin/main 6df65b1` is clean. Tree **a35e0525a4c934d3c70660e58fe88c3d94e809ed** (= the head tree).
- Kit hashes match: step-29 aaedff78, README 15163cd4, spine da2a585b. Plants script ee1bec46.

## Numbers
| Check | Result |
|---|---|
| Diff | 7 files, 262 lines (+254/−8), exactly the kit's 7 files. raf-driver.ts 88/92, clock.ts 138/142, clock types.ts 31/35, canvas2d.ts 112/116, fake-canvas.ts 46/50, canvas2d.test.ts 132/136, raf-driver.test.ts 139/143. Everything is within cap. |
| tsc / tests / green | tsc 0. Serial run twice: 548/0, 0 skipped, 0 todo. `npm run green` exit 0. 11 driver tests with the kit's titles. |
| Pins | All 5 unchanged. No CN. `Clock.skip` is in clock/types.ts, not core-types. `src/index.ts` unchanged. |
| Sim / smokes | Both sim lines identical. All 20 smoke lines identical. |
| EA plants | 34/34 caught by their named tests |
| Step 28 regression plants (build A set on s29) | 60 caught by canvas/render tests; R3 and Q3c are now caught by the driver tests. Still not caught: E4 and E9 (carries). F10, F11 and F17 are caught only by gates, as before. K2 is still caught only by the dueMs test (carry). |
| Build law | `requestAnimationFrame` / `cancelAnimationFrame` appear only in raf-driver.ts, and only as `env` members (tsc fails on a bare global). One clock: the driver advances the injected clock from the rAF timestamp and names no wall time. Core never sees rAF. No scope creep. |

## (1) Busy / back-off behaviour (qa/probes29.ts in the extra copy; 60 Hz unless noted)
| Probe | Result |
|---|---|
| A sheet that never settles | 0 draws in the 3rd second, `busy()` true, `stats.missing` true. rAF still calls back 60 times a second (cheap early return; N-3). |
| Late load | `load` called once per id (2). rev +1. **Exactly 1 draw**, then 0. 0 px wrong. |
| 40 failing sheets | 41 loads, 40 failed, 0 draws in the 3rd second |
| **Q1: capped builds + a missing sheet** (limit 1, camera across a chunk edge) | Stalls today: 1 build, and **1 draw in 3 s** while the second chunk stays capped. Pixels stay right (tile-by-tile fallback, 0 px wrong), but each later dirty frame pays the fallback, and a pan builds only 1 more. With `stats.capped` (F-1b), the builds finish (2), then it settles to 0. **Recommend Q1 = yes.** |
| Restore, then lose | 0 draws ✓ |
| contextlost during back-off | 0 draws while lost ✓. **Then `contextrestored`: 0 draws, and the canvas stays blank.** With the canvas cleared to simulate the browser, 15360/15360 px stay black for good on a static scene. See **F-1**. With no missing sheet, a restore redraws once with 0 px wrong. |
| Lost with one water tile | 5 no-op presents a second while lost (needsDraw fires every 200 ms). Harmless (N-4). |
| Dispose mid-load, dispose twice, load after dispose, `start()` after dispose | No rev bump, rAF queue empty, 0 draws, 0 canvas listeners, 0 document listeners. `stats.failed` still counts a rejection after dispose (N-5). |
| A sheet that fails, then a new image under the same id | Impossible by design: a failed id is never asked again (Q3: the host shell's call). The only way back is a new driver (carry). |
| Hidden / shown | rAF cancelled (empty queue). Clock +0 across a 60 s hidden gap. First shown frame +0, then +1000 ms a second ✓ |
| Panning, draws a second | 60/90/120/144 Hz uncapped: 60/90/120/144. With `capFps: 60`: 60, **45**, 60, **48** (N-1). |
| Static scene | 1 draw, then 0 a second (test). Water: 5 a second at 60 and 120 Hz (test). |
| Host returns a new scene object every frame | 60 draws a second (rev bumps every frame). Carry to step 30: keep the scene identity stable. |
| `view()` throws every frame | 60 throws a second; the loop survives (rAF is requested first). Host's problem (N-6). |
| **Jank frame, sim ms lost** (gap + 1 frame) | 50 ms: 0. **150 ms: 67 lost. 200 ms: 117 lost.** 250+: 0 (goes through `skip`). Gaps between the 100 ms `advance` clamp and `stallMs` 250 drop up to 150 ms of sim time. See **F-2**. |
| `Clock.skip` | 2000 ms skip = 20 × `advance(100)`: same `now`, timers fire at the same `now` (40, 1200). timeScale 0.5 with 1001 ms gives 500 (the half tick is dropped; the accumulator is untouched, as specced). Paused: no-op. 1.5 throws RangeError. A tick subscriber added mid-skip runs per tick (96 ticks) ✓ |

## (2) The fence change
The DOM-walk allowance is `/src\/runtime\/(canvas\/canvas2d|host\/raf-driver)\.ts$/`, matched on the full path, not the basename. `src/runtime/canvas/raf-driver.ts` with DOM words is caught. The render purity fence and the canvas folder fence are unchanged.

Bypass probes (fence29.py; tests + tsc/eslint/depcruise/check-law):

| Probe | Caught by |
|---|---|
| Driver: globalThis, setImmediate, process.hrtime, template `import()`, Date.now, import past the clock index, a second file in host/, a `window` alias | Host folder test (Date.now: eslint and check-law too) |
| Driver: a bare global rAF; Temporal | tsc only |
| Core / render / canvas imports host | eslint+depcruise / render fence+depcruise / canvas fence+depcruise |
| Input file: `(globalThis as …).requestAnimationFrame` | check-law only |
| Lookalike `src/platform/runtime/host/raf-driver.ts` with a bare rAF | tsc and eslint. **check-law's glob `!**/runtime/host/raf-driver.ts` exempts it** (N-7). |
| **Driver: `"//"` string hides `globalThis`** (H2) | **Nothing** (F-3) |
| **Driver: `"//"` string hides `import "../input/index.ts"`** (H3, beats the import pin) | **Nothing** (F-3) |
| **Driver: `new Intl.DateTimeFormat().format()`** (H4, wall date) | **Nothing** (F-3) |
| Input file: `globalThis["request" + "AnimationFrame"]`; the same at the lookalike path | Nothing. A grep can't see it; carry to the next pin CN (ban `globalThis`/`self`/`window` outside the two owners). |
| Input file: setImmediate / process.hrtime | Nothing (already a kit carry for the next pin CN) |
| Nested `src/x/src/runtime/host/raf-driver.ts` with DOM words | Nothing: the allowance regex has no root anchor (N-8, contrived) |

## Step 28 carries
- Done:
  - `world()` runs before `chunkedList` (raf-driver.ts:71–72).
  - rev on image load (:39).
  - `dispose()` on the backend and the driver.
  - busy-while-lost (canvas2d.ts:76).
  - The `:63` 0×0 assert (the Q3c plant is now caught by "world() runs before the plan …").
  - The missing-sheet must-fix (settles to 0).
- **Not done:** K2, the water tile under an `above` hole. The kit moves it to step 30/31 (EA's s28 verify report agrees).

## Fixes (r2)
- **F-1: a restore while a sheet is missing never redraws** (canvas2d.ts:62 `onRestored`, raf-driver.ts:70).
  - `stats.missing` is left over from the last frame, so the driver ignores `hold`, and the cleared canvas stays black until something else is dirty.
  - Fix: `stats.missing = false` in `onRestored`.
  - Repro: a sheet that never loads; settle; `contextlost`; clear the canvas; `contextrestored`; 1 s gives 0 draws, 15360/15360 px black. With the fix: 1 draw, then 0.
  - **F-1b (Q1, verified with it):**
    - In `endFrame`, set `stats.capped = capped` (+ the stats type).
    - In the driver gate: `!(backend.busy() && (!backend.stats.missing || backend.stats.capped))`.
    - Capped chunks then finish building while a sheet is missing, and it still settles to 0.
  - Test: add both cases to "busy() is false while lost …" and "a sheet that never loads …".
- **F-2: jank frames of 101–250 ms lose sim time** (raf-driver.ts:62).
  - `advance` clamps at 100 ms, while `skip` only starts above `stallMs` (250).
  - Fix: skip above the clamp (default `stallMs` 100, or `whole > 100 || whole > stallMs`).
  - Repro: settle, jump 200 ms, run 1 frame: the clock moves 100 ms instead of 216. With the fix: 0 lost. The suite still passes.
  - Test: add a 150 ms gap to "a rAF pile-up …".
- **F-3: harden the host fence** (raf-driver.test.ts:136–138).
  - Use the string-aware `comments()` strip from the canvas fence instead of the naive regex.
  - Add `Intl|Temporal|require|global` to the banned list.
  - Allow backticks in the import regex.
  - Repro: H2, H3 and H4 in fence29.py all pass green today.

The F-1, F-1b and F-2 patch was applied to a copy (`qfix/`, 6+/6−): 548/0, tsc 0, and all probes correct (probes29-qfix.json).

## Nits
- N-1: `capFps: 60` gives 45 fps at 90 Hz and 48 at 144 Hz. A deadline that accumulates (`next += 1000/cap`) would give 60. Kit text says "at most".
- N-2: The allowance regex and check-law's glob are suffix matches (N-7, N-8). Anchor them to `src/` at the next pin CN.
- N-3: rAF keeps calling back at the panel rate while idle. Each callback is cheap, but the loop could stop on idle and restart on touch, load, visibility or busy (step 34).
- N-4: No-op presents while lost when the scene has animation.
- N-5: `stats.failed` still counts after dispose.
- N-6: A throwing `view()` throws every frame. Consider counting the errors in `stats`.
- N-7 / N-8: See (2).
- `sheets` never evicts, and a failed id is pinned for the driver's life. A project switch needs a new driver (document it for the host shell).

## Carries
- **Host shell:**
  - `DebugPort` (Q4).
  - Retry of failed sheets (Q3; no engine API today; a `forget(id)` if ever needed).
  - A real loader (`createImageBitmap`).
  - Dispose the driver on a project switch.
- **Step 30:** a stable scene object per world revision (a new object every frame means 60 draws a second); K2 (the water tile under an `above` hole).
- **Step 34:** the `skip` upper bound (Q2); idle rAF stop; the cap deadline (N-1); `budgetBytes` and `buildsPerFrame` on devices.
- **Next pin CN:**
  - depcruise rules for render, canvas and host;
  - `setImmediate` / `process` and `globalThis` / `self` / `window` bans outside the two DOM owners;
  - anchor check-law's raf-driver glob.
- **L2 Playwright gate:** as the kit says. **DSK:** unchanged.

---

## r2 (LEAN recheck): **NOT OK** (one fix: F-4, a freeze introduced by the N-6 change)

- Inputs: everything was copied to /workspace/qa-runs/step-29-review/r2/. /tmp and scratch-ea were not modified.
- Bundle sha256 c1b22189… matches, `git bundle verify` is OK. Head 4487e82 → 6df65b1 → 4d9d872 (= origin/main).
- Ref **refs/cmp/s29-proto-r2** = 4487e82.
- `git merge-tree --write-tree origin/main 4487e82` is clean. Tree **0c96dcd5df6a1e9a2b63a9fb77a57b2ef7f5687a** (= the head tree).
- Kit hashes match: step-29 8713c98d, README 5baa32f4, spine 18a72e49. Plants script 0f3e9eaa.

| Check | Result |
|---|---|
| Size | 7 files, 274 lines (+266/−8). raf-driver.ts 90/92, raf-driver.test.ts 149/153, the rest unchanged from r1, all within cap. The cap re-base is in kit-2 (:90, :102, :104) and applies only to raf-driver.test.ts. |
| Scope of r1..r2 | 4 files, +28/−16: canvas2d.ts, raf-driver.ts, canvas2d.test.ts (the allowance line only), raf-driver.test.ts. In scope. |
| tsc / tests / green | tsc 0. Serial run twice: 548/0, 0 skipped, 0 todo. `npm run green` exit 0. |
| Pins / sim / smokes | All unchanged. 20/20 smokes identical. |
| EA plants | 45/45 caught by their named tests |
| QA r1 probes | Every r1 finding is fixed (below). The other r1 results are unchanged. |
| fence29.py | H2, H3, H4 and H18 are now caught by tests. H11 (Temporal) is caught by the test as well as tsc. Still not caught (all outside host, next pin CN): H13, H16, H23, H24. |

### Fixes from r1, re-checked
- **F-1:** a restore while a sheet is missing gives 1 draw, then 0. Black px after restore: 0/15360 (r1: 15360/15360).
- **Q1:** capped builds + a missing sheet build both chunks (2), then settle to 0. 0 px wrong.
- **F-2:** default `stallMs` is 100. A 150 ms gap moves the clock 143 of 150 ms, and 200 ms moves 193 of 200 ms. Each loses less than one 10 ms tick (r1 lost 67 and 117 ms).
- **F-3:**
  - The host test now uses the string-aware strip.
  - `Intl|Temporal|require|global|globalThis` are banned, backticks are allowed in the import check, and QA's three evasions are pinned in the test.
  - The canvas allowance is now an exact full-path match (`join(root, …)`) for the two files.
- **N-5:** a rejection after dispose leaves `stats.failed` at 0 ✓

### F-2 ruling (EA asked): skip drops the sub-tick remainder
- **Drift is real but bounded.** Each stall loses `ms mod stepMs` (< 10 ms). Over 100 one-frame stalls:
  - 105 ms gaps lose 167 ms;
  - 155 ms gaps lose 167 ms;
  - 199 ms gaps lose 567 ms;
  - 100 s with no jank loses 0.

  It does add up over repeated jank, at about 0.2–0.6 % of the stalled time. That is still far better than r1's clamp (100+ ms lost per stall).
- **Determinism and replay are not affected.** The same gap sequence run twice gives an identical tick count, `now()` and timer ticks (60, 600, 34 both times). Sim results depend only on the tick sequence. `skip` is a pure function of `ms` and clock state.
- **Recommendation: accept as specced.** An optional lossless version adds the remainder to the accumulator (`accQ += (ms·scaleQ) mod stepQ`), but that goes against the "accumulator untouched" rule. Leave it for step 34 if device tests show audio/sim drift.

### Fix (r2 → r3)
- **F-4: one throw from `view()` freezes the screen until `rev` changes** (raf-driver.ts, `if (broken === stats.rev) return;`).
  - After a single transient throw, `view()` is not called again until a sheet load or `touch()`.
  - A new scene object can't bump `rev` either, because `view()` is never called to return it.
  - So pans, animations and resizes all stop.
  - Repro (qa/probes29.ts `R2_viewThrowsOnce`): a panning view with one water tile draws 60 a second; `view()` throws once; the next 2 s draw **0** (`stats.errors` 1); `touch()` brings it back to 60.
  - Fix: keep the count, but retry on a timer instead of waiting for a `rev` change. For example, remember the rAF `ts` of the throw and call `view()` again after ~1000 ms, or on any `rev` change, whichever comes first. A view that keeps throwing then costs 1 throw a second; a transient one recovers within 1 s.
  - Change the R2-N6a plant and the N-6 test to pin "retried at most once a second, and recovers without a `rev` bump".

### New evasions (fence-r2.py, all appended to raf-driver.ts)
| Probe | Caught by |
|---|---|
| Template whose body looks like a comment | Host test ✓ |
| `D\u0061te.now()` | eslint only |
| **`globalTh\u0069s`** (unicode escape) | **Nothing** |
| **A regex literal `/\/\//` hides the rest of the line: `globalThis`** | **Nothing** |
| **The same, hiding `import "../input/index.ts"`** (beats the import pin) | **Nothing** |
| `env["glob"+"alThis"]`, `Object["s"+"elf"]`, `({}).constructor.constructor("return this")()` | Nothing (no grep can see these) |

Not blocking: a grep fence is a lint aid. The robust close is AST-level:
- the depcruise host rule (next pin CN) for imports;
- eslint `no-restricted-globals` for `globalThis`/`self`/`window` outside the two owners (eslint decodes `\u` escapes).

Or, within the test cap, walk `ts.createSourceFile` (typescript is already a devDependency) for imports and identifiers. Recommended for r3, optional.

### Nits
- N-1 (cap 45 fps at 90 Hz, 48 at 144 Hz) is now a step 34 carry in the kit. OK.

### Carries
- Unchanged from r1, plus:
  - **next pin CN:** an AST-level host import rule and globals ban (the R1, R3 and R8 evasions above);
  - **step 34:** the optional lossless skip remainder.

## r3 (lean recheck, 2026-11-13)

**Verdict: OK TO SEND.**

r3 = 187ae98, one commit on r2 4487e82. New ref `refs/cmp/s29-proto-r3` → 187ae98, tree 7c7d7e50. Work dir: `/workspace/qa-runs/step-29-review/r3/`.

| Check | Result |
|---|---|
| Hashes | bundle bafe8860 (verifies, head r3 187ae98), kit step-29 8b0b7ec5, README d140fb87, spine 34b1949c. All match |
| Chain | 4d9d872 → 6df65b1 → 4487e82 → 187ae98 |
| merge-tree onto origin/main (4d9d872) | clean, **7c7d7e50868387f61d5f2236958e2b21e15046fd** (same as the r3 tree) |
| r2..r3 diff | raf-driver.ts +3/-3, raf-driver.test.ts +5/-1. Only those 2 files; nothing out of scope |
| tsc / tests | tsc 0; serial 548/0 twice; `npm run green` exit 0 |
| Pins | core-types 61fad786, package.json 1e5dd82c, depcruise 45a3dbaa, check-law 4d7bbf48, lock d7f64a09. Unchanged |
| Sims / smokes | sim output byte-identical to baseline (48/2 afc89d56, 22/28 b8007292); 20 smokes same |
| Caps | 278 lines (+270/-8) in 7 files; raf-driver.ts 90/92, raf-driver.test.ts 153/153 (at cap, no new re-base; the kit text matches); the other files unchanged |
| Plants | s29-plants-r3.py 47/47 caught by named tests, including R3-F4 (waits for a rev change) and R3-F4b (once-a-second retry ignores rev). Tree clean afterwards |
| Fence regressions | fence29.py and the r2 evasion set give the same results as r2: the same misses (H13/H16/H23/H24, R1/R3/R4/R5/R7/R8) are already in the AST-rule carry; nothing new got through |
| r1/r2 probes | every key identical to r2 except R2_viewThrowsOnce, which now recovers (the second second after the throw has 59 draws instead of 0) |

**F-4 check** (gate: `broken === rev && ts - brokeAt < 1000`):
- F-4 repro (panning plus water, one throw, no rev bump or touch): 0 draws for 1.0 s, back to 6 per 100 ms in the 11th tenth (**recovers within 1.1 s**), then 60/s. errors 1, rev Δ0.
- Always-throwing view: **1 call/s** at 60, 30 and 144 Hz (10 calls in 10 s each). 0 draws, 0 chunk builds, busy false, canvas never presented. The rAF loop keeps ticking at the display rate, the same as the normal idle loop. That is not a busy loop.
- Huge jump after a hidden tab: there are no frames and no view calls while hidden. On return the 60 s jump clears the gate, so the first visible frame retries and draws, then 60/s.
- Throw while hidden: impossible (no frames while hidden). After returning, the first throw follows the normal 1 s retry (recovered in 0.9 s here).
- Throw then dispose: 0 calls, 0 frames, empty queue, 0 canvas listeners, 0 document listeners.
- Throw while the context is lost: counted, retried after 1 s, then draws resume at the water rate. busy stays false. Restore draws the full frame (0 blank px).
- Rev change while broken (late sheet load): retried on the very next frame (1 call, 1 draw).
- rAF timestamp going backwards: a −50 ms step only lengthens the wait by 50 ms. A −5 s step freezes for 6.1 s. A −3 s step **after a successful recovery** blocks a healthy view, because `broken` is never cleared on success (0 draws for that 1 s). This is only theoretical, because rAF timestamps are monotonic within a document. See R3-N1.

**Nits (none block):**
- **R3-N1:** a successful `view()` doesn't clear `broken`, so a timestamp that goes backwards can re-block a healthy view. Fix with no line cost: `try { v = o.view(); broken = Number.NaN; } catch`. Checked on a scratch copy (`r3/nitfix`): still 90 lines, tsc 0, raf-driver tests 11/0, and the backwards-after-recovery case draws 60/s. Optional: treat `ts < brokeAt` as expired too.
- **R3-N2:** the test file is at 153/153, so the next change there needs a re-base or a trim.

**Carries:** unchanged from r2 (next pin CN: AST-level host import rule and globals ban; step 34: the optional lossless skip remainder and the Q2 skip upper bound; Q3/Q4 → host shell).
