# Step 28 A/B: Canvas2D backend + chunk cache (LEAN)

**Pick: A (chatB2, code 754bdce, tip 98867d5).** Both builds pass everything EA asked for, and their pixels match the proto r2 (8b67eb5) everywhere I checked. They split on context loss:
- **B** keeps `busy()` true for as long as the context is lost, so a `needsDraw || busy()` host spins at about 60 fps for the whole loss (600 of 600 ticks). If `contextrestored` never fires, it spins forever.
- **A** only spins in a corner case: restored, then lost again before the next frame.
- **Proto** does neither (0 in both cases).

On top of that:
- B throws if a chunk canvas has no 2d context. A degrades instead.
- B's own tests have unbounded settle loops: a regression hangs the suite instead of failing it.

Work was done in /workspace/qa-runs/step-28-ab/. The bundles were copied there, and nothing in /tmp or share was modified.

## Numbers
| | A (chatB2) | B (chatB) |
|---|---|---|
| Ref | refs/cmp/s28qa-a = 98867d5 (code 754bdce) | refs/cmp/s28qa-b = 342aa99 (code 990a337) |
| Bundle | sha256 d7fa4c09…, verify OK | sha256 4e79a40f…, verify OK |
| Base | code parent 6ccd014; tip adds only handback/ | same |
| Tip tree / code tree | db4d12e454229458e310d9d18711a3fc31cf1933 / 9888b22580c5cd597e51f65f606fe933cc15e4f1 | 4ec2b0101e26924487c18260b30ba59d7921b7a5 / 90cc774f8e8bbaac7448bc29da81c0c6d94e2db0 |
| merge-tree onto origin/main 330c479 | clean, **d6fca546fb9a69e273dafa2dfb7a0d011ac3a3e0** | clean, **3c5a2d1d41b9bfc5b96b872994fdcaae1b22536a** |
| Product diff | 8 files (4 A, 4 M), 335 lines (+331/−4) | 8 files, 310 lines (+306/−4) |
| Lines vs cap | canvas2d 109/113, chunk-plan 38/38, dirty 17/21, draw-list 61/65, index 7/11, fake-canvas 44/51, canvas2d.test 132/137, render-core.test 125/129 | canvas2d 90, chunk-plan 32, dirty 16, draw-list 61, index 7, fake-canvas 46, canvas2d.test 131, render-core.test 125 |
| tsc / serial run ×2 / green | 0 / 537/0 ×2 / exit 0 | 0 / 537/0 ×2 / exit 0 |
| Pins, sims, 20 smokes | unchanged / 48/2 afc89d56, 22/28 b8007292 / identical | same |
| getContext / OffscreenCanvas | only in canvas2d.ts | only in canvas2d.ts |
| Proto r2 tests overlaid | 537/0 | 537/0 |
| Plants on overlaid tests: EA's 33 / step 27 B set / QA extras (35) | 33/33 / 22/22 / 29 caught, 6 not caught (same 6 as proto: Q3c, E4, E9, and F10, F11, F17 which only gates catch) | same |
| Same plants on the build's own tests | 64 of 68 caught by a test or gate. Not caught: R3 (missing image → busy), Q3c, and E4 and E9 (kit carries). | Same. In addition, K6 makes B's own test **hang**: `settle`/`retile` loop `for (…; busy(); rev++)` with no cap. |

## Kit blob
3ccf5d55 is **not** the git blob of the kit you approved.
- The approved kit (sha256 1d6fe235) is EA's backup `s28-backup-r2/step-28-pre-nit.md`, git blob **b1763d95**.
- 3ccf5d55 is the blob of the kit now on main 330c479 (sha256 **5f55b314**). This is the file in /workspace/tileengine/handoff/steps, edited 02:46.
- `diff` shows that 5f55b314 = 1d6fe235 plus three text-only edits:
  - line 195: the mutation count corrected to QA's 26 + 3;
  - two new lines in the step 29 carries: QA's MUST FIX (a missing sheet keeps busy() looping) and the canvas2d.ts:63 0×0 nit.
- No interface, test or cap changed, so it is the same build spec. Both builds' reports cite 3ccf5d55 / 5f55b314.
- Unlike step 27's ef6e0b18/dd9e1036, these are not two hashes of the same bytes. Ask EA/CoS to confirm the 02:46 edit was intended. It only touches docs.

## r1 fixes, as implemented
| Fix | A | B |
|---|---|---|
| F-1 draw state after a throwing draw | `beginFrame` closes an open frame; flip and lighter in try/finally; `present` uses finally (dirty.ts byte-identical to the proto). Probe: 0 px. | Same logic; dirty.ts reflowed (+2/−2). Probe: 0 px. |
| F-2 image identity + columns in the signature | yes; probe 0 px | yes; probe 0 px |
| F-3 dueMs parity, off-size layer | tested, E5/E11 caught | tested, E5/E11 caught |
| F-4 byte budget | w·h·4, 32 MiB default, `budgetBytes` option, pins chunks drawn this frame, overshoot in stats.bytes, zeroes on evict/restore/replace. LRU is an array (indexOf/find). | Same rules; LRU is a Map (as in the proto) |
| Repros (flip throw, image swap, map switch, anim → static, mid-frame `world()`) | all 0 px | all 0 px |
| Fallback = per-tile path at 640×320, 301×203 and 3 phone DPRs | 0 px | 0 px |
| Idle / water host loop (600 ticks) | 3 / 50 draws (same as proto) | 3 / 50 |
| Small budget thrash | 2, 2, 2, 0 | 2, 2, 2, 0 |

## Differences from proto r2
- **canvas2d.ts**
  - A: an array LRU; `world()` drops entries whose layer has gone (the proto marks them stale); a failed `getContext` on a chunk canvas sets `missing` (busy). Behaviour otherwise matches.
  - B: 90 lines, a Map LRU, an inline `live()` fallback; **a failed chunk-canvas `getContext` throws** (no picture after that draw while it persists, e.g. iOS canvas memory pressure). **`busy()` includes `lost`.**
- **Lost-context host loop** (tools/lostloop.ts): draws over 600 ticks after a loss.

  | | A | B | Proto |
  |---|---|---|---|
  | Lost only | 0 | **600** | 0 |
  | Restored, then lost before a frame | **600** | **600** | 1 |

  Kit :60 only asks for busy() true after `contextrestored`, so both drift from it. B's drift is the common path; A's is an edge.
- **chunk-plan.ts**
  - A: scans every chunk of the map and culls each one (O(map chunks) per frame, cheap). **Chunks with no static tile are not emitted** (fewer blits, no empty canvases). Pixels are identical, but this departs from the kit's "one blit per visible chunk" (nit). Doc comments were dropped.
  - B: the same all-chunks scan, and it does emit empty chunks.
- **dirty.ts:** A is byte-identical to the proto; B only reflows it.
- **draw-list.ts:** both byte-identical to the proto. **index.ts:** export order only.
- **Scope creep:** none. Exactly 8 product files, plus handback/.

## The s29 must-fix and the :63 nit
- **Missing sheet busy-loop:** unchanged in both. 600/600 ticks; a missing sprite sheet costs 3978 draw calls, the same as the proto. Neither build's own tests pin missing-image busy (R3 not caught).
- **Assert that a replaced stale canvas ends 0×0 (proto :63):** absent in both. Both zero it in code (A `drop`, B `zero(prev.canvas)`), but no test catches its removal (Q3c).

## Must-fix for A (r2 or s29; not a merge blocker)
- In `endFrame` (canvas2d.ts:106), let `hold` clear even while lost. Better: don't report `hold` while `lost`, e.g. `busy: () => !lost && (hold || missing || capped)`.
- Repro: frames, then `contextrestored`, then `contextlost`. A `needsDraw || busy()` host then presents 600 of 600 ticks with 0 draws. The proto presents 1.
- If it isn't fixed in r2, fold it into the step 29 busy-throttle must-fix.

## Nits (A)
- Chunk-plan skips empty chunks (kit wording).
- Array LRU uses O(n) find/indexOf per chunk draw.
- Doc comments dropped in chunk-plan.
- Own tests miss R3 and Q3c.

## Carries
- **Step 29:** the missing-sheet busy-loop MUST FIX (both builds); the busy-while-lost edge above; `world()` before `chunkedList`; bump rev on image load; `dispose()`.
- **Kit-3 / EA:** confirm the 02:46 text-only kit edit (1d6fe235 → 5f55b314); the :63 0×0 assert.
- **Step 34, DSK and the next pin CN:** unchanged from docs/qa/step-28-review.md.
