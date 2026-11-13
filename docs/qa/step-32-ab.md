# Step 32 A/B: chatB vs chatB2 (animated-world extras)

**QA, 2026-11-13, Europe/London.** Kit `aacbb82c` (r35); base `6e117f0`; main `ecf18d9`.

- Inputs were copied first to `tileengine-repo/qa-runs/step-32-ab/` (`chatB/`, `chatB2/`, `ab-summary.txt`). I modified nothing in share, `/tmp` or `scratch-ea`.
- New refs only: `refs/cmp/s32qa-b`, `refs/cmp/s32qa-b2` and `refs/cmp/s32qa-fix`.
- No GitHub or Drive actions.
- Naming: **A = chatB** and **B = chatB2**, as in CoS's `ab-summary.txt`.

## chatB (A)

### CoS numbers: all confirmed
- **Bundle:** `ebc1df93`, verifies. Head `1e07319` (tree `3e50f8e0`), parent code `8a22ec5` (tree `35c51969`), parent `6e117f0`.
- **Size:** 10 product files, +386/−14 (400 lines, at the window ceiling), plus 6 handback files only.
- **Merge-tree onto `ecf18d9`:** tip `f7c599eb`, code `d1477dc9`, both clean.
- **Build and tests:** `tsc` 0. Serial `node --test` 586/0. `npm run green` exits 0 at 586/0.
- **Sim and smokes:** the sim's two lines are byte-identical to the base. Smoke and pin lines are identical to the s32 proto r3 (heap line excluded).
- **Pins unchanged:** `61fad786`, `1e5dd82c`, `45a3dbaa`, `4d7bbf48`, `d7f64a09`. `src/runtime/host`, `src/core`, `src/types` and `scripts` are untouched.
- **Caps:** bakes 76/78, water 33/50, canopy **23/23**, motion **71/71**, index 13/17, light 80/84, canvas2d **134/134**, extras 62/65, motion.test 48/49, light-canvas 32/34.

### Law and rulings
- **Clock and pipes:** one clock and rAF (`raf-driver` unchanged). Render code has no DOM, wall time or random calls. Only the kit's 10 files change.
- **Darkness:** `rgba(3,8,26,k/32)` in both the offscreen pair and `lightOps`. At the cap it is 23/32 = 0.71875 ≤ 0.72 (probe alpha 0.7176).
- **CEO s32 rulings hold:** no `leafy` tag; river 1 px per 0.2 s; sway 400 ms poses at 45 px/s; foam on by default; see-through canopy is a map flag, default off.

### r1–r3 rechecks (my r3 probes rerun on this build)
- **Light pair:** 2 draws a frame. Moving torch: 120 builds and 2 canvases over 120 frames, 0 sized after dispose. Bytes 57,600 at res 8 and 230,400 at res 4. A failed attempt leaves 0×0 canvases, and a reused pair that loses its context drops its plan key.
- **NaN wash:** 1 plan and 1 build for a NaN wash.
- **Foam:** edge gaps 0/1392. With matched foamPx, the band misses 0/1000 pixels. The default distance with foamPx 4 misses 213/1000 (host carry: pass the same foamPx). No valid combination repeats a frame.
- **Shore settings:**
  - `shore: null` = on with no notice.
  - `true`, `[]`, 3 and "yes" give `shore`, with defaults.
  - Each bad field gives its own notice; `ms` 50–1000 and `{ms: 400}` takes effect.
  - No usable ramp gives `ramps.water` and the shore is off.
- **Interpretations:** a bad whole value with no ramp gives both notices, and field-level `{ms: null}` warns (both from my open notes N-r3-1/2). `pickMotion(asset, null)` = no motion (tile null = none), which fits the kit's "null = no motion".
- **ANIM_HINT:** present.

### Findings
- **B-1 (must-fix): an animated cell with no motion warns.**
  - What happens: `bakeMotion` checks `ctx.animated` before `m === null`.
  - Repro: `bakeMotion(img, null, {animated: true})` gives `["motionInvalid"]` with the "set anim: null" message.
  - Why it matters: every styled water slot with a derived clip, and every clipped sprite, would get a false warning that tells the maker to kill its animation. The format (§13 "Motion on styled water…") and the proto warn only when motion is present. chatB2 is correct here.
  - Fix: swap the two lines (0 net lines).
- **B-2 (kit N-5 deviation; fix in the patch): a missing light context sets `missing` every frame, not once per plan.**
  - Repro: with an offscreen `getContext` that returns null, `lights()` the same plan for 5 frames. `busy()` and `stats.missing` stay true for all 5; on the proto and chatB2, only the first frame is true.
  - The build's own test asserts `missing` is still true on the retry frame.
  - Impact is small: `raf-driver` does not force redraws while `missing`. But it breaks the kit text and leaves the telemetry stuck.
  - Fix: `if (lightMiss === plan) return;` (0 lines).
- **Test gaps:** the trunk rows are pinned only with a single trunk colour, so a swaying trunk passes. Scroll direction is pinned only at step = w/2. The sway default ms and the offscreen darkness colour are not pinned (details under Plants).

### Perf and memory
- **Memos:** `createLighting` and `createSeeThrough` keep a single previous entry. 3,600 frames of churn (moving torch, NaN washes, canopy cuts) under `--expose-gc` grew the heap by 9 KiB, with 2 canvases total and stable bytes. Bounded.
- **Timings:** shoreDistance takes 24–28 ms on the probe map (shoreFrames 12 ms). A moving torch costs about 15 ms a frame on the fake canvas (the same as the proto; step 34 carry).
- **Over-cap motion:** returns in 1 ms, because the cap is checked before baking.

## chatB2 (B)

### CoS numbers: all confirmed
- **Bundle:** `98b96efe`, verifies. Tip `f92600f` (tree `dc008f00`), code `f1353e3` (tree `d1937e1e`), parent `6e117f0`.
- **Size:** 10 product files, +372/−12 (384 lines), plus 6 handback files.
- **Merge-tree onto `ecf18d9`:** tip `b65791de`, code `e0011d0e`, both clean.
- **Build and tests:** `tsc` 0. Serial 586/0. Green exits 0.
- **Sim and smokes:** identical to the base. Same pins and fences as chatB.
- **Caps:** bakes 67/78, water 39/50, canopy 16/23, motion 68/71, index 13/17, light 80/84, canvas2d 130/134, extras **65/65**, motion.test **49/49**, light-canvas 33/34.

### Law, rulings and rechecks
- **Same as chatB:** law and rulings hold, with darkness `rgba(3,8,26,k/32)` under the cap. The r1–r3 probes match: 2 draws, no canvas growth, NaN gives 1 plan, shore null and per-field handling, ANIM_HINT. With no ramp, a bad whole value gives only `ramps.water`.
- **Light pair:** one pair for the whole life of the renderer, resized in place, so no new canvases at all.
- **Missing context:** `missing` is marked once per plan, as the kit says.
- **Animated cell:** an animated cell with null motion gives no notice (correct).

### Findings
- **B2-1 (must-fix): over-cap motion bakes every frame before it is rejected.**
  - What happens: `bakeMotion` checks `MOTION_CAP` after `flatMap`-baking cycle × scroll × sway.
  - Repro: `bakeMotion(img W×W, {cycle: 8 colours, scroll: {step: 1}, sway: {trunkFrom: W}})` gives `motionTooLarge` as it should, but:

    | W | Time | Peak RSS |
    |---|---|---|
    | 64 | 0.9 s | 111 MiB |
    | 128 | 2.2 s | 339 MiB |

  - chatB and the proto return in 1 ms at about 75 MiB. One mistyped asset can stall loading or exhaust memory on a phone, which defeats the cap's purpose.
- **Slower shoreDistance:** 66–70 ms, against 24–28 ms on chatB (a per-pixel closure walk). It runs at load time, so this is not blocking.
- **Test gaps (the tests have no line room):**
  - deep water painted (D6) and the 1-px foam floor (R13), as CoS found;
  - the noise seed;
  - far-water cap;
  - transparent pixels in the cycle, and a cycle that always steps by one;
  - trunk sway;
  - offscreen darkness colour;
  - the sway and scroll default ms.

## Plants (`qa-runs/step-32-ab/tools/ab32-plants.py`, 63 plants, per-build anchors, every anchor unique on both builds)
- **What they cover:**
  - my r3 set ported: R1–R24 and K1–K10 (R1 and R24 are adapted to the rewrites);
  - the key EA plants: D1–D4, D6–D8, D10, D11 and F2;
  - my own plants for the s32 rules: colour cycle, scroll, sway, wave, canopy, offscreen pair, darkness colour and cap, default timings, motionTooLarge, glow blit, lost and dispose.
- **Catch rates:**

  | Build | Caught | Misses |
  |---|---|---|
  | chatB | **58/63** | E-D11 (equivalent on chatB: the chamfer never exceeds cap×3), O1 scroll direction, O4 trunk sways, O11 offscreen darkness colour, O15 sway default |
  | chatB2 | **53/63** | R13, E-D6, E-D2 seed, E-D11 far-water cap (real here), O2, O3, O4, O11, O15, O16 |
  | chatB + `s32qa-fix` | **62/62 non-equivalent** (61 caught by the script plus R11 re-anchored and caught; E-D11 is equivalent) | none |

- **F2 (NaN replan):** both builds catch it in N-4 only. The patch adds a repeated NaN `plan()` to N-3.
- **Official r3 harness:** as CoS reports, 18 of 96 needles exist on chatB and 20 on chatB2; I did not rerun it.

## Pick: **chatB (A)**, with must-fix `s32qa-fix`
- **Product:** both have one must-fix. chatB's (B-1, a false warning) and its kit deviation (B-2) are 0-line fixes. chatB2's B2-1 is a load-time stall and memory blow-up from authored data, a worse failure. chatB's shoreDistance is also about 2.5× faster. chatB2's single reused light pair is tidier, but both meet the 2-draw and no-growth bar, with bounded memos and no law issues.
- **Tests:** chatB catches 58/63 against 53/63. It already pins deep water and the 1-px foam floor by colour. It has test line room (65/49/34 caps against 62/48/32); chatB2's test files are full.
- **Patchability:** chatB's src files are at cap, but its fixes are in-place, so the patch fits every cap.

### Patch `qa-runs/step-32-ab/s32qa-fix.patch`
- **Identity:** sha256 `4109368e`; the same file is saved as `s32qa-fix-b.patch`. Commit `974c0b3a3ccd192d51de409afde57b1face1a6f9`, tree `d243a520`, parent `1e07319`. Ref `refs/cmp/s32qa-fix`, patch-id `1aa3a68a`.
- **Merge-tree onto origin/main `ecf18d9`:** `6c5c1567`, clean.
- **Size:** +9/−6 in 5 files. Caps after: motion 71/71, canvas2d 134/134, light-canvas 33/34, motion.test 49/49, extras 63/65.
- **src (2 lines in place):**
  - B-1: check `m === null` before `ctx.animated`;
  - B-2: `if (lightMiss === plan) return;`.
- **tests:**
  - an animated cell with null motion → no notices (fails on chatB as delivered);
  - the retry frame has `missing` false and `busy()` false (fails as delivered);
  - offscreen fill colours are exactly `rgba(3,8,26,0.71875)` and `rgba(255,176,72,0.1875)` (CEO darkness at the cap);
  - N-3 calls `plan()` 3 more times with a NaN wash and gets the same plan;
  - trunk rows are unchanged in every pose, with distinct trunk colours;
  - step-1 scroll runs downstream;
  - sway default is 400 ms and scroll default is 200 ms (CEO 18:04).
- **Results:** `tsc` 0, green exits 0 at 586/0, and smokes are identical. The new pins hold on chatB's src, and only the B-1 and B-2 asserts fail without the src lines.
- **Note:** the product diff with the fix is 403 lines (+389/−14). The 150–400 window binds the builder's delivery (400). The QA fix sits on top, as in s31.

### Carries (unchanged)
- **s33 host:** same foamPx for distance and frames; chunked shore bake; dedup the warnings; a finite clock; validate the dig window.
- **s34:** the light repaint, the plan scan, and a view-bounded plan.
- **DSK (r35 confirmation):** field-level `null` in `shore`, and the bad-whole-value plus no-ramp notice set (the two builds differ; both are defensible).
