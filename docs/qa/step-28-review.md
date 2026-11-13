# Step 28 review: Canvas2D backend + chunk cache (r1, FULL)

**Verdict: NOT OK.** Gates are green and EA's plants all pass. Four fixes are needed: three are small code fixes and one is a test gap. One of them, F-4, needs an EA ruling before Build changes anything.

- Input: /tmp/r28 → copied to /workspace/qa-runs/step-28-review/proto (/tmp not touched). Bundle sha256 c848c87b… matches, `git bundle verify` OK.
- Ref **refs/cmp/s28-proto-r1** = 858dda6, one commit on parent 6ccd014 (= origin/main).
- `git merge-tree --write-tree 6ccd014 858dda6` merges clean. Tree **663e031f025bfce22b9fde83ed78ff2bf1d0c2bb** (same as the head tree).
- Kit hashes checked: step-28 file 5a7c8238 (145 lines), README 9a41bc1b, spine 59dcec06.

## Numbers
| Check | Result |
|---|---|
| Diff | 7 files, 265 lines. Added (4): canvas2d.ts 87/91, chunk-plan.ts 34/38, canvas2d.test.ts 91/95, fake-canvas.ts 46/50. Changed (3): draw-list.ts 61/65 (+1/−1), render/index.ts 7/11 (+1), render-core.test.ts 125/129 (+3/−1). Everything is under its cap. |
| tsc | 0 |
| Serial green | 534 pass / 0 fail / 0 skipped / 0 todo, run twice. Includes 5 "(step 28)" tests. Full green exit 0. |
| Pins | core-types 61fad786, package.json 1e5dd82c, depcruise 45a3dbaa, check-law 4d7bbf48, lock d7f64a09: all unchanged |
| Sims / smokes | 48/2 afc89d56 and 22/28 b8007292 unchanged. All 20 smokes identical to the base run. |
| EA plants (s28) | 25/25 caught |
| Step 27 plants (B set) re-run on s28 | 22/22 caught |
| QA extra plants | 11 behaviour plants: 4 caught, 7 missed (2 of the misses matter, see F-3). 20 fence probes: 15 caught by a test or a gate, 7 not caught by anything (see (d)). |
| Build law | Only the backend file touches the canvas. No CN, no tsconfig change. `src/index.ts` unchanged. |

Tools and logs are in /workspace/qa-runs/step-28-review/: tools/extra28.py, qa-probes/probes.ts, extra.log, plants28.log, plants27.log, serial1.log, serial2.log.

## EA's questions

### (a) Memory budget
- **Today it is a count:** `maxChunks = 384` (canvas2d.ts:19). The kit's "384 × 256 KB = 96 MB" only holds for 16-px tiles. A chunk is (16·tileW)²·4 bytes:

  | tileW | Bytes per chunk | 384 chunks |
  |---|---|---|
  | 16 | 256 KiB | 96 MiB |
  | 32 | 1 MiB | 384 MiB |
  | 64 (Mobile default tileSize) | 4 MiB | **1.5 GiB** |

  At 32 or 64 px that is an OOM on iOS long before step 34 tunes anything.
- **Visible working set, measured** on a big phone (1290×2796 device px, s = 1, the worst zoom-out, one ground layer):

  | tileW | Chunks (measured) | MiB (measured) | Worst-case offset | MiB (worst) |
  |---|---|---|---|---|
  | 16 | 72 | 18 | 84 | 21 |
  | 32 | 18 | 18 | ~24 | ~24 |
  | 64 | 8 | 32 | 12 | 48 |

  The bound is (⌈W/cw⌉+1)(⌈H/ch⌉+1)·cw·ch·4, with cw = 16·tileW. Two chunked layers at 64 px come to about 96 MiB just for what is on screen.
- **The thrash repro is real.** With maxChunks = 4 and 6 chunks visible, an identical frame rebuilds 6 chunks every frame, forever. The pixels stay right but it burns CPU and battery. Cold builds are not counted against the rebuilds budget either (:52).
- **QA recommendation: switch to a byte budget in this step.**
  - Count the real `w·h·4` of each chunk canvas, so edge chunks count as smaller.
  - Default 32 MiB, which matches EA's lean.
  - Only OK together with a pin rule: **never evict a chunk used in the current frame.** The budget then only limits off-screen retention and cannot thrash. A visible set over the budget overshoots and reports it (e.g. `stats.bytes`).
  - When evicting, set the canvas to width = height = 0 (this frees iOS canvas memory at once).
  - Step 34 tunes the number on devices and decides whether chunks should be sized in art px (about 256 px) instead of 16 cells. That is an ARCH call, and it would cap the visible set at about 20 MiB per layer whatever the tile size.
- **Tests:**
  - A fake `makeCanvas` that tallies bytes, run at tileW 16 and 64. After eviction the tally is ≤ budget unless every chunk is pinned.
  - Visible set bigger than the budget: identical repeated frames do 0 builds after the first.
  - Pan away: off-screen chunks are evicted, oldest first, down to the budget.
  - Evicted canvases end up at 0×0.
  - This replaces the 384 count. The kit (:38, :141) defers byte sizing to step 34, so this needs EA's ruling. See F-4.

### (b) Can stale or mixed chunks be visible?

| Case | Result |
|---|---|
| Map switch (rev bump, every tile changes) | Stale old-map pixels show for 2 frames (64512 px wrong, then 21504, then correct). `busy()` is true the whole time. This is the kit's intended behaviour. |
| Tile edit | Only the edited chunk rebuilds (test K5 holds). |
| Anim tile → static | The first frame has a **hole**: 512 px at the clear colour, because the stale chunk has nothing in that cell and the live path no longer draws it. Correct 2 frames later. This goes against the "no holes" intent. Nit N-1. |
| Same sheet id, new image (art re-import) + rev bump | **Stale forever** (204800 px wrong after 3 frames). The signature only holds the sheet id and the tiles. See F-2. |
| `world()` with a new rev mid-frame | The frame mixes A and B. This is host contract: carry to step 29 (call `world()` before `chunkedList`, never between begin and end). |
| LRU evicts a visible chunk | It is rebuilt cold the same frame, so stale pixels are never shown. It thrashes, see (a). |

### (c) Context lost / restored
- While lost: 0 draws, including when lost twice in a row (E6 plant caught).
- Restored: cache cleared and `pending` set, then a full cold rebuild with correct pixels and `busy()` false afterwards (E7 plant caught).
- Lost again before the rebuild finishes: that frame reports `busy()` false. The next restore sets `pending` again and ends correct.
- Not covered:
  - The listeners are never removed and there is no `dispose()`. Carry to step 29.
  - Cleared canvases are not set to 0×0 (N-3).
  - The cold rebuild after a restore has no limit, so expect a one-frame spike (N-2).
  - `fillRect` while lost and `endFrame` without a matching begin are guarded, but no test pins either (E8 and E1 missed; harmless today).

### (d) The fence
| Probe | Caught by |
|---|---|
| Canvas word in render/ or core; render imports canvas | Purity test + depcruise |
| Core imports canvas | eslint + depcruise |
| Step 27 evasions inside canvas2d.ts: a `"//"` string hiding an import, a template `import()`, a type import from core, an import past `index.ts` into render/fit, `globalThis` | Canvas fence test (all caught) |
| `window`, `document`, `self`, `new OffscreenCanvas`, `createImageBitmap` | tsc only (no DOM lib) |
| `queueMicrotask` | eslint + check-law |
| **Not caught:** `navigator`, `process.hrtime`, `setImmediate`, `eval`, `new Function`, `Intl` | Nothing |
| **Not caught:** a second file `src/runtime/canvas/helper.ts` that imports core and returns `globalThis` | Nothing (the test only checks canvas2d.ts's imports, and depcruise has no rule for runtime/canvas) |

Everything the kit's rule actually names (:72, :86) is covered. The gaps are beyond the kit, so this is hardening, N-4.

## Extra checks
| Check | Result |
|---|---|
| Smoothing after a resize | Reset every beginFrame (:71). Tested; plants caught. Chunk canvases (:40) are not pinned by a test (E4 missed). Harmless: they are 1:1 blits. |
| Clip covers the letterbox | Clip is `rect(padX, padY, artW·s, artH·s)` (:74). Tested; the clear fill and off-by-one plants are caught. |
| gco restored if a draw throws | **No.** If a draw throws, gco stays "lighter" for the rest of that frame (reset by the next beginFrame at :72). A throw in a flipped draw is worse: it leaves an extra save on the stack plus the flipped transform. `present()` (dirty.ts:12–15) has no `finally`, so `endFrame` is skipped too. The next frame is wrong by 9728 px. See F-1. |
| Pixel equality of the chunk plan | Real (rasterizes both lists). QA probes at DPR 2.625/s3 (1024×2216), 2.75/s3 (1073×2321) and 3/s4 (1170×2532): all equal. The shipped test only uses toy sizes (N-5). |
| Idle frame does zero draws | The backend has no idle logic. It relies on the host gating on `needsDraw(...) \|\| r.busy()` (kit :72). **But `chunkedList`'s `dueMs` is untested:** dropping it (E5) passes everything, and then animated tiles never wake the host. See F-3. |
| Off-size tile skip | `chunkable` needs fw = tileW and fh = tileH (chunk-plan.ts:10). Matches kit :35 and the DSK carry. **Untested:** chunking off-size layers anyway (E11) passes everything. See F-3. The K1 clip-to-cell rule stays a DSK carry. |
| Drift | None vs the kit. draw-list.ts:58 maps the glow band to "add" (kit :32). The widening test was added. |

## Fixes (r2)
- **F-1: draw state survives a throwing draw** (canvas2d.ts:74–85).
  - In `beginFrame`, before the clear: `if (open) { ctx.restore(); open = false; }`.
  - At :80, wrap the flip in `try { … } finally { ctx.restore(); }`.
  - At :79/:82, put the `lighter` → `source-over` switch in a `try/finally`.
  - Repro: an image whose `drawImage` throws once on a flipped unit. Catch around `present`, then render the same scene again: 9728 px are wrong today, 0 after the fix.
  - Add a test.
- **F-2: image identity in the chunk signature** (canvas2d.ts:28–34, :47, :62).
  - Store the `img` reference in `Chunk`.
  - In `world()` on a rev change, also mark a chunk stale when `opts.images(sheet.id) !== chunk.img`.
  - Repro: same sheet id, a new image object, then a rev bump: 204800 px stay wrong forever.
  - Add a test.
- **F-3: test gaps**, both missed by every test today.
  - (i) `chunkedList.dueMs` equals `buildDrawList`'s `dueMs` for a map with animated tiles (E5: `dueMs = Math.min(…)` at chunk-plan.ts:16 → `void list.dueMs`).
  - (ii) An off-size layer (fw ≠ tileW) is not chunked and still matches pixel for pixel (E11: `chunkable` at :10 → `true`).
- **F-4 (EA ruling first): byte budget plus pinning the current frame's working set,** replacing the 384 count (canvas2d.ts:19, :54–55).
  - Details and tests in (a).
  - Repro: tileW 64 gives 384 × 4 MiB = 1.5 GiB. maxChunks 4 with 6 visible rebuilds 6 every frame.
  - If EA keeps step 34 as the owner, ship at least the pin rule and the 0×0 on evict now, and record "count is wrong at tileW > 16" as a blocking carry for step 29's first device run.

## Nits
- N-1: Anim → static leaves a one-frame hole (512 px). Fix: rebuild at once any stale chunk whose static set grew, or draw it live while deferred.
- N-2: Cold builds are not budgeted (:52), so expect spikes after a restore or a long pan.
- N-3: The LRU loop at :55 scans the whole map with no `break`. Evicted or cleared canvases are not zeroed.
- N-4: Fence hardening.
  - Add `navigator|process|setImmediate|eval|Function|Intl|window|document|self` to the backend's banned list at canvas2d.test.ts:136.
  - Check the imports of every file under src/runtime/canvas.
  - Add a depcruise rule at the next pin CN.
- N-5: Add one real DPR size (e.g. 1073×2321 at s3) to the pixel-equality test.
- N-6: `world()` recomputes the signature of every cached chunk on each rev (:62): a step 34 performance item.
- N-7: A missing image gives `busy()` false and caches nothing, so it is blank until something else forces a redraw.
- N-8: E1 (unconditional restore in `endFrame`) and E3 (LRU off by one) are not pinned by tests.

## Carries
- **Step 29 (host):**
  - Call `world()` before `chunkedList` and never mid-frame.
  - Bump rev on image load and on any world change (N-7).
  - Gate frames on `needsDraw || busy()`.
  - Add a `dispose()` that removes the listeners.
  - Wrap `present` in try/finally, or accept F-1 as the guard.
- **DSK:** the K1 clip of off-size tiles to the cell, `ms[]` padding vs the fps fallback, and fps ≤ 0.
- **Step 34:** memory tuning on devices; chunk size in art px (ARCH).
- **Next pin CN:** depcruise rules for render ↔ canvas.

---

## r2 (LEAN recheck): **OK TO SEND**

- Inputs: the bundle and EA's scripts were copied to /workspace/qa-runs/step-28-review/r2/. /tmp was not modified.
- Bundle sha256 2dff2c74… matches, and `git bundle verify` is OK. Head 8b67eb5 → parent 858dda6 (r1) → 6ccd014 (main).
- Ref **refs/cmp/s28-proto-r2** = 8b67eb5.
- `git merge-tree --write-tree 6ccd014 8b67eb5` is clean. Tree **fa5b72d970216bad423148b8ddea312747006f6e** (= the head tree).
- Kit hashes match: step-28 1d6fe235, README 182b2d56, spine 5ecce522.

| Check | Result |
|---|---|
| Size | 8 files (4 A, 4 M), 335 lines (+331/−4), ≤ 400. Every file is within its kit cap: canvas2d.ts 109/113, chunk-plan.ts 34/38, dirty.ts 17/21, draw-list.ts 61/65, index.ts 7/11, fake-canvas.ts 47/51, canvas2d.test.ts 133/137, render-core.test.ts 125/129. The r1..r2 diff is 4 files, +140/−74. |
| tsc / green | tsc 0. Serial run twice: 537/0, 0 skipped, 0 todo. `npm run green` exit 0. |
| Pins | All 5 unchanged. No CN. |
| Sim / smokes | Sim matches the base byte for byte. All 20 smoke lines are identical. |
| EA plants | 33/33. The step 27 B set is 22/22. |
| QA mutations (EA's port) | 26 caught by a test, 3 caught only by a gate (F10, F11, F17), 2 not caught (E4, E9; both kit carries). |
| r2 tests run on r1's code | 5 tests fail (throw, tile/image, budget, lost, chunk plan). The new tests have teeth. |

**EA's port of my mutations is faithful.** Diffed against tools/extra28.py, only the anchor strings changed (E1, E6, E7, E10 and the import line), and E3 was retargeted from the r1 count to the byte check. Every intent is unchanged, and the runner, tests and gates are identical. My original script, run as-is on r2, gives the same results for every plant whose anchor still matches (E2, E4, E5, E8, E9, E11, F1–F11). It stops at F12 because the import line changed.

**Kit drift:** none in the code. Line 195 miscounts the mutations: it says 24 caught by a test and 5 by gates only, but F1 and F2 are now caught by the fence test too, so the real split is 26 + 3 (nit).

### QA's r1 probes re-run on r2 (qa/probes.ts in the extra copy; option names mapped)
| Probe | r1 | r2 |
|---|---|---|
| Throw in a flipped draw: wrong px next frame | 9728 | **0** |
| Composite op after a throw in an `add` draw | lighter | source-over |
| Image swap under the same sheet id: wrong px | 204800 | **0** |
| Map switch: wrong px, frame by frame | 64512, 21504, 0 | **0, 0, 0** (busy() true, true, then false) |
| Anim tile turns static: clear-colour px in the first frame | 512 | 0 |
| `world()` called mid-frame | mixes old and new maps | no mix |
| Small budget (1 MiB), 6 chunks visible: builds per frame | 6, 6, 6, 6 | 2, 2, 2, 0 (no thrash) |
| Lost / restored | — | 0 draws while lost. Right pixels after a restore, still busy while it rebuilds 2 chunks per frame. |
| DPR 2.625, 2.75, 3 at phone sizes | equal | equal |

### Budget tests: QA plants (tools in r2/budget-plants.py)
| Plant | Result |
|---|---|
| Count-based eviction (×2) | caught |
| Pinned chunk evicted (no `used` check) | caught |
| Pin stamp not refreshed on a hit | caught |
| Evicted canvases not zeroed | caught |
| Restore clears the cache without zeroing | caught by the lost test |
| Bytes assume 16-px tiles | caught |
| Bytes ignore smaller edge chunks | caught |
| 32e6 instead of 32 MiB | caught |
| Skip pinned and `continue` | not caught. Equivalent mutant: recency order puts every pinned chunk at the end, so this is not a gap. |
| An old stale canvas replaced at canvas2d.ts:63 is not zeroed | **not caught** (N-r2-1) |

### Other checks
- **The tile-by-tile fallback matches the per-tile path.** With `buildsPerFrame: 0`, and with the default of 2 (mixed), 0 px differ at:
  - 640×320 s1;
  - 301×203 s2 with a camera offset;
  - 1024×2216 s3, 1073×2321 s3 and 1170×2532 s4, all with roofs, a flipped unit and glow on top.
- **An idle frame does 0 draws.** In a host-loop probe (kit :116 gating, 600 ticks of 16 ms):
  - a static map presents 3 times (the first frame plus 2 busy frames while chunks build), then never again;
  - a water map presents 50 times (every 200 ms, as `dueMs` says).
- **busy() can stay true forever.** With a permanently missing sheet, the same loop presents **600/600 times**, about 60 fps with no end:
  - a missing chunk sheet: 0 draws per frame, but the frame setup and clear still run;
  - a missing sprite sheet: the whole scene is redrawn every frame (3978 draw calls).

  This is a real battery bug for a 404 or a renamed asset. It is not a blocker for step 28: step 28 has no image loader, and the kit already hands the throttle decision to step 29 (:42, :239). **Step 29 must** do one of these:
  - on a load error, map the sheet to a placeholder image, so `images(id)` is never undefined for good, and bump rev;
  - or stop asking for frames while images are missing (e.g. a backoff, or only redraw on a load event).

  Test to add in step 29: a sheet whose load fails is drawn 0 times per second once it has settled.

### Fixes
None for r2.

### Nits
- N-r2-1: Add an assertion that the old stale canvas replaced at canvas2d.ts:63 becomes 0×0. The plant `drop` → `stats.bytes -= …; cache.delete` passes every test today.
- N-r2-2: Kit :195 should say 26 caught by a test and 3 by gates only.
- E4 and E9 stay as carries, as the kit says (both harmless).

### Carries
- **Step 29:**
  - Fix the missing-image busy-loop (above).
  - Call `world()` before `chunkedList`.
  - Bump rev on image load.
  - Gate frames on `needsDraw || busy()`.
  - Add a `dispose()` that removes the listeners.
- **Step 34:** device memory tuning, the signature cost per rev (N-6), and chunk size in art px (ARCH).
- **DSK:** the K1 clip of off-size tiles to the cell, `ms[]` padding, and fps ≤ 0.
- **Next pin CN:** depcruise rules for render ↔ canvas.
