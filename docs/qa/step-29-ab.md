# Step 29 A/B: host frame driver (lean)

2026-11-13. Both builds compared against `refs/cmp/s29-proto-r3` (187ae98, base 4d9d872). Work dir: `/workspace/qa-runs/step-29-ab/` (share files copied to `share/` first; /tmp, share and scratch-ea untouched). New refs: `refs/cmp/s29qa-a` → c3ca386, `refs/cmp/s29qa-b` → 24b4389.

**Pick: A (chatB)**, with a 2-line test fix (below) before merge.

## origin/main and kit
- origin/main = **57aa42c** "kit: step 29 frame driver (host loop) + QA reviews", one commit on 4d9d872. It touches 5 files, all non-src: the step-29 kit (8b0b7ec5, blob 99fa346), README (d140fb87), spine (34b1949c), `docs/qa/step-28-ab.md` and `docs/qa/step-29-review.md` (incl. r3 section). 0 changes under src/tests/scripts/package.json.
- Kit: neither bundle carries the kit (both branch from 4d9d872, which predates it). B quotes blob 99fa346 / sha256 8b0b7ec5. A quotes nothing, but its code is kit-3: the once-per-1000 ms `view()` retry and the test cap of 153 exist only in 8b0b7ec5 (kit-2 8713c98d lacks the retry; kit-1 had test cap 143 and A's test is 146). The only kit on main is 8b0b7ec5, so **A was built from 8b0b7ec5**.

## Numbers

| | Proto r3 | A (chatB) | B (chatB2) |
|---|---|---|---|
| Code / tip | 187ae98 | b9528a5 / c3ca386 | 7fe19ad / 24b4389 |
| Base | 4d9d872 | 4d9d872 | 4d9d872 |
| Tree (tip) | 7c7d7e50 | a3f73cf9 | f2762e97 |
| merge-tree onto 57aa42c | 02e298d7 | **8506a845** (matches CoS) | **bfe8ee8f** (matches CoS) |
| Size (+/−) | 278 (+270/−8) | 272 (+263/−9) | 237 (+220/−17) |
| raf-driver.ts /92 | 90 | 86 | 71 |
| clock.ts /142 | 138 | 142 (at cap) | 141 |
| canvas2d.ts /116 | 112 | 111 | 112 |
| raf-driver.test.ts /153 | 153 | 146 | 110 |
| types.ts, fake-canvas, canvas2d.test | 31/46/132 | same | same (fake-canvas reordered) |
| tsc / tests ×2 / green | 0 / 548/0 | 0 / 548/0 ×2 / exit 0 | 0 / 548/0 ×2 / exit 0 |
| Pins (61fad786, 1e5dd82c, 45a3dbaa, 4d7bbf48, d7f64a09) | ok | unchanged | unchanged |
| Sim (48/2 afc89d56, 22/28 b8007292) / 20 smokes | ok | byte-same / same | byte-same / same |
| Official r3 tests overlaid | 548/0 | 548/0, tsc 0 | 548/0, tsc 0 |
| EA plants 47 vs r3 tests | 47/47 | **47/47** | **47/47** |
| EA plants 47 vs own tests | — | 45/47 (H11, H17 miss) | 46/47 (H17 miss) |
| Step-28 plants (on s29) | 60 caught / 1 other / 7 missed | same 60/1/7 | same 60/1/7 |
| fence29.py + r2 evasions | baseline | identical to r3 | identical to r3 |
| r1–r3 probes | baseline | identical except 2 (below) | identical except backwards-ts (below) |
| R3-N1 (clear backoff on success) | no | **yes** | no |

Plants were run with anchors adapted per build (`tools/ab29-plants.py`, same intent as EA's r3 plants; step-28 plants via `tools/s28-plants-tolerant.py` with anchor substitutions only). Both sets of misses are the carries we already know about (AST-level fence, E4/E9 etc.).

Build law, both: `requestAnimationFrame` appears only in `src/runtime/host/raf-driver.ts`, reached through the injected `env`. There is no Date/performance/window/globalThis/timer in host or clock. `Clock.skip` is in `src/core/clock/types.ts` (pinned core-types untouched). Imports are only clock index, canvas2d and render index. No scope creep: same 7 files as the proto plus the usual `handback/` folder.

## Behaviour vs proto r3
- **Busy/back-off, F-1, Q1:** same rules in both. Probes A, B, C, D, E, G, N match r3. A sets `capped` only when the deferred chunk's image is loaded, so capped + missing settles with 2 draws in 3 s instead of r3's 3 (r3 does one useless redraw). Builds and pixels are the same (0 wrong). Fine. B moves `missing`/`capped` onto `stats` directly (set mid-frame, same values at frame end; more churn in canvas2d, no behaviour change in probes).
- **Retry gate (F-4):** both recover from your repro in 1.1 s with no rev bump or touch, and do 1 call/s when always throwing (60/30/144 Hz), with 0 draws and busy false. Throw then dispose, throw while hidden or lost, rev change while broken, and a hidden 60 s jump all match r3.
  - A also clears the backoff on success (R3-N1), so a backwards timestamp after recovery doesn't block a healthy view (60/s; r3 and B give 0 for a second).
  - **B, backwards timestamp:** B doesn't clamp the frame delta, so a timestamp step backwards calls `clock.advance(negative)`. That throws a RangeError out of the rAF callback on every frame until ts catches up (299 uncaught throws for −5 s, 2 for −50 ms). A and r3 clamp to 0. rAF timestamps are monotonic in browsers, so this is theoretical, but an uncaught throw per frame is worse than r3's stall.
- **stallMs:** 100 in both. Gap probes (J, 150/200 ms within one tick) and skip drift/replay match r3.
- **Dispose / hidden / cap:** match r3 (probes E, H, I; picky observer and OffscreenCanvas fallback both tested).
  - Both: a `visibilitychange` to visible before `start()` starts the loop, because there is no `live` flag; r3 doesn't do this. Nit.
- **Clock.skip:** same tick and timer results in both. Two differences:
  - Both render with `dtMs = ms` after a skip (60000 after `skip(60000)`), where r3 renders 0 and `advance` clamps to 100. No consumer reads `dtMs` today. Carry: decide this before a UI consumer appears.
  - A's skip RangeError message says "advance: dtMs…" (copy-paste). Nit.

## B's 43-line-shorter test: the claim checked
B's 110-line test has all 11 titles and the kit's specific cases (picky observer, 1.1 s recover, 3–4 calls in 3 s, F-1 restore, Q1, three fence evasions, timeScale/pause/1e9 speed). Against EA's 47 plants it catches 46, one more than A's 146-line test (45). So the claim mostly holds. The gap that both share: **the "hidden … does not replay the gap" test hides before any frame has run**, so there is no last timestamp to replay, and a regression (H17) passes. A's dispose test also checks the rAF queue only after running frames (H11 passes).

## Must-fix for the pick (A), test-only
Patch `a-fix-tests.patch` (2 lines, test stays 146/153). With it, own tests catch 47/47 and the file still gives 11/0 and tsc 0:
- the hidden test: `box.driver.start(); box.run(0.5, 60); const t = box.clock.now(); box.hide();`
- the dispose test: `assert.equal(box.queued(), 0);` right after the two `dispose()` calls, before `box.run(1, 60)`.

## Nits (A)
- A visibilitychange before `start()` starts the loop (no `live` flag); B has the same nit.
- The skip RangeError text says "advance".
- `frac` isn't reset on hide (sub-ms, harmless).
- clock.ts is at its 142 cap.

## Why A
- It has R3-N1.
- It never throws out of rAF on a bad timestamp, where B throws once per frame.
- It's closest to the proto: r3 tests and plants pass, probes are identical except two cases where it's better.
- Its canvas2d diff is small (7 lines vs B's 28).

B is leaner and its own tests are slightly stronger, but its backwards-timestamp throw and missing R3-N1 tip it.

## Carries
Unchanged: AST-level host fence rule (next pin CN), skip upper bound and optional lossless remainder (s34), Q3/Q4 to the host shell. New: render `dtMs` after `skip` (ms vs 0) — pick one before a UI consumer reads it.
