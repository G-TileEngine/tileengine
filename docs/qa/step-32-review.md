# Step 32 review: animated-world extras (proto from EA)

## r1 — target c827f9f (tree d082812f) on main 6e117f0 (tree bf758d8f)

**Verdict: NOT OK.** The behaviour is mostly right. Bakes are pure and deterministic, the darkness colour and the 0.72 cap hold, N-4 holds, and there is no chunk storm. But the N-3 light canvas has a real lifecycle bug (F-1), N-4 and N-3 interact badly (F-2), and the foam line breaks in about 1 in 10 shoreline pixels (F-3). Both new test files also miss most of the N-3 and shore-distance rules. The QA qfix is small (src +7/−5, tests +11/−3), keeps every cap and green, and turns the verdict to OK. **EA can fold it in as is.**

QA qfix: commit **4e43b645** (tree **5753319f**), one commit on c827f9f, saved as `refs/cmp/s32-qfix-r1` in `tileengine-repo`. Patch `qa-runs/step-32-review/s32-qfix-r1.patch`, sha256 46abc0aa…. Merge-tree onto 6e117f0 is 5753319f, clean.

Inputs were copied first: `/tmp/r32-kit` → `qa-runs/step-32-review/kit/`, and the scratch-ea files (`r32.bundle`, `s32-plants.py`, `s32-plants-result.txt`, `kit-backup-r32/`) → `ea/`. The update docs went to `docs-r32/` (project-format r32 67413cac, profile-format r13 3cc1b0ae, core-types 61fad786, CN-012 d295b13d, CN-013 17f5e56f). Ref: `refs/cmp/s32-proto-r1` = c827f9f (new ref; nothing overwritten).

### EA's claims, checked
| Claim | Result |
|---|---|
| bundle 44d3a083…, verifies, one commit on 6e117f0 | ✓ |
| kit step-32 ed9ede41 / README ae7ea764 / spine 4e19304e | ✓ (the kit-backup draft copies match) |
| 581/0, all gates green | ✓ tsc 0; serial 581/0 ×2; `npm run green` exit 0 (base: 573/0) |
| sims, 20 smokes, pins unchanged | ✓ sims byte-identical. Smoke lines identical (the heap-smoke MiB line wobbles by 0.01 in concurrent runs on any tree and is identical run alone). Nothing in the do-not-touch list changed (0 diff lines) |
| 246 lines (+237/−9) in 8 files, sizes as listed | ✓ bakes 78/82, water 42/46, canopy 19/23, index 12/16, light 80/80, canvas2d 125/129, animated-extras.test 56/60, light-canvas.test 16/20 |
| every new test fails on the base | ✓ but trivially: on the base, animated-extras fails at import (missing exports), and light-canvas fails on `r.lights` not being a function |
| clean merge-tree onto 6e117f0 | ✓ d082812f (fast-forward) |
| EA plants 32/32 | ✓ 32/32 (my run of `s32-plants.py`) |
| purity / build law | ✓ new files import only `./types.ts`, `./frames.ts` and `./bakes.ts`; no Date, Math.random, performance, DOM or globals; `check:law` OK; no `phase` |

### Probes (tools in `qa-runs/step-32-review/tools/qa/`)
- **N-3, phone view 844×390, 4 torches, night.** Exactly 2 main draws a frame (120 in 60 frames) at res 8 and res 4, against 773 / 1597 fills when drawn directly. A static plan builds once. Resize and DPR 3 reuse the pair: they are plan-space, scaled at the blit by `res × s`, with smoothing off. Context loss: 0 draws. Restore: rebuilt once.
- **Darkness and cap.** Fill `rgba(3,8,26,n/32)` ✓ (CEO ruling intact, still pinned by the step 31 test). The max step is 23/32, which stores as alpha 183/255 = 0.7176 ≤ 0.72 after the offscreen blit. Glow is `lighter` on top: it adds at most (48,33,14) at level 6 and never changes the darkness alpha, so the cap is unaffected. The add/normal split is keyed on the `rgba(3,8,26,` prefix (see Nits).
- **N-4.** `darkness(NaN,0)` = 0, `(1,NaN)` = 19, `(1,∞)` = 19, `(NaN,1)` = 23. A NaN-wash plan emits no ops; a NaN-dim plan emits darkness only.
- **Determinism.** Baking twice gives byte-identical frames, and the input is untouched. `waveOffsetMs` 0/45/72/450 px → 0/600/0/1200 ms. Bakes are load-time and take no clock. Playback stays on the one frame player (clips), so there is no drift source.
- **Water and chunks.** An animated tile off screen gives `dueMs` null (no wake); on screen, 208. It stays out of chunks (step 30 behaviour).
- **Canopy (48×24 map, the whole above layer canopy).** Off returns the same scene, and toggling works. Standing still: 0 rebuilds after the first 12 chunks. Walking one cell every 4 frames: 1 chunk rebuild per cell step (2 when crossing a chunk edge), never capped. That is not a storm.
- **Shore (240×160 lake with an island, 8 seeds).** 298 of 2816 shoreline water pixels (10.6%) never get foam in any frame (F-3). Against true Euclidean distance the chamfer is within 1.17 px outside the noise band. An all-water map caps at 32. Land on the map edge is fine. A short `land` array reads as water (Nits).
- **Sway.** A fully opaque block never moves, because the frame edge is not treated as transparent (Nits).
- **Perf, phone map 60×30 at 16 px (Node).** `shoreDistance` on 960×480 takes 91 ms and `shoreFrames` 12 ms; the 4 frames hold 7.4 MB. One tree's sway+scroll+cycle bake takes 0.5 ms. Light: the plan takes 0.26 / 0.99 ms (res 8 / 4), and the whole-map `lightOps` for a rebuild takes 1.0 / 3.3 ms (792 / 1648 offscreen fills).

### QA plants (`tools/qa32-plants.py`, own tests): 5/16 on the proto
Caught: Q6 black darkness, Q7 darkness marked add, Q12 off still copies, Q13 rebuild keyed on size, Q14 NaN dim keeps glow.
**Missed:** Q1 the blit ignores `fit.s`, Q2 the blit ignores the camera, Q3 the pair is not reset on restore, Q4 lights draw while the context is lost (mid-frame), Q5 blit with smoothing on, Q8 the canopy cut wraps a row when the unit is off the map, Q9 a forward-only chamfer pass, Q10 diagonal cost 3, Q11 the cap is ignored, Q16 the y scroll runs upstream. Q15 (leaves land on the trunk) is equivalent: the sway loop never moves down. The light test only ever uses s = 1, camera (0,0), and no loss. The shore test has land only on the left, so a one-pass, no-diagonal distance map still passes.

### Findings
- **F-1 (must-fix): the N-3 light canvases are re-allocated on every plan change and never released.** `lights()` calls `makeCanvas` twice for each new plan and drops the old pair without zeroing it. It does not zero on dispose or restore either, and none of it is counted in `stats.bytes`. A moving torch (a new lights array every frame, as a host with a torch-bearer must pass) makes 2 canvases a frame. Repro (`probe32.ts` N3): 120 frames give 240 canvases, all 240 still sized after `dispose()`. On iOS, canvases that are not shrunk to 0 are released late and count against the canvas memory limit. Fix: reuse the pair when `plan.w × plan.h` is unchanged (setting `width` clears it), and shrink the old pair to 0 on replace, restore and dispose. After the qfix: 2 canvases in total, 0 left after dispose.
- **F-2 (must-fix): a NaN wash or dim rebuilds the plan and the light canvas every frame.** The plan memo compares `prev.wash === wash`, and NaN never equals itself. So the N-4 case (no glow) costs a full plan, a full-map `lightOps` and an offscreen repaint every frame: 30 frames give 30 plans and 30 builds. Fix: `Object.is` for wash and dim (an in-place change; light.ts stays 80/80). After the qfix: 1 plan, 1 build.
- **F-3 (must-fix): the foam line has gaps.** The noise adds 0–2 px everywhere, so a water pixel touching land (true distance 1) can read 3 and fall outside `FOAM_PX` 2 in every frame: 10.6% of shoreline pixels over 8 seeds. That contradicts the goal of "a 2-px foam line round every cove". Fix: no noise while the base distance is ≤ `FOAM_PX` (noise is still 0–2 beyond it, so ruling 6's test still holds). After the qfix: 0 gaps.
- **F-4 (must-fix, tests): the N-3 and shore rules are untested** (Q1–Q5, Q8–Q11, Q16 above).

### Qfix (4e43b645): 5 files +18/−8, every file within its cap
- `canvas2d.ts` 125 → 128/129: `free()` shrinks and drops the pair, and runs on restore and dispose; the pair is reused when the size is unchanged.
- `light.ts` 80/80: `Object.is` in the memo, changed in place.
- `water.ts` 42/42: no noise inside the foam band, changed in place.
- `light-canvas.test.ts` 16 → 20/20: the pair is reused (2 canvases); the s = 2 blit rect with camera (16,8) and smoothing off is checked; no draw after a mid-frame context loss; restore rebuilds and zeroes the old pair; a NaN wash builds once; a size change zeroes the replaced pair; dispose zeroes everything.
- `animated-extras.test.ts` 56 → 59/60: y scroll direction on a 1×4 strip; a 21×21 single-land-pixel map (both passes, chamfer 3-4) plus the cap; foam on every shoreline pixel for seeds 1–6; an off-map unit cuts nothing.
- **Results.** tsc 0, 581/0 (serial too), green exit 0, sims identical, smoke lines identical. EA plants 32/32 (D1 re-anchored to the new noise line, `tools/s32-plants-qfix.py`). QA plants 14/16 + 6/6: Q3 is re-run on the new anchor and caught; Q15 is equivalent; F1a/F1b/F1c/F2/F3 are planted back and all caught. On proto src, the qfix tests fail 2 of 8 (N-3, shore), so they are not vacuous.

### N-3 answer (EA question 8)
**Yes, two light draws a frame close N-3's draw-budget problem. Keep two canvases**, because merging darkness and glow into one would lose the additive glow. Main-canvas light draws are 2 whatever the op count (1597 → 2 on the phone view).
What N-3 does not remove is the repaint cost when the plan changes. A moving light rebuilds every frame: about 1.0 / 3.3 ms of `lightOps` plus 792 / 1648 offscreen fills (res 8 / 4), and it repaints the whole map, not the view. With F-1 fixed this is bounded, and it is a perf item for step 34: repaint only the moved lights' boxes, or cull the repaint to the view plus a margin.

### Nits
- N-1: `swayFrames` doesn't count the frame edge as transparent for its distance (kit ruling 3 says "or the frame edge"). It treats only pixels exactly on x = 0, y = 0 or x = w−1 as loose, and only if they are reachable from transparency. A fully opaque sprite never sways, and a pixel 1 px in from the edge with edge 2 stays stiff. Fix: seed the BFS from the out-of-frame border.
- N-2: the light canvases are not counted in `stats.bytes` or the budget (2 × plan.w × plan.h × 4; about 230 KB at res 4 on the phone map, 8 MB on a 256×256 map).
- N-3: the add mark is keyed on the darkness colour string (`ink.startsWith("rgba(3,8,26,")`). It is fragile if the darkness colour ever changes, though Q6/Q7 show it is pinned today. Prefer marking by which `paint` pass emitted the op.
- N-4: `shoreDistance` doesn't check `land.length === w*h`; a short array silently reads as water.
- N-5: with a null context, `lights()` sets `missing` and retries `makeCanvas` every frame.
- N-6: `waveOffsetMs` clamps a negative x to 0, while the kit formula is silent for x < 0. Harmless.

### Carries
- Step 34 (perf): light repaint on plan change (above), and the step 31 plan's full-map scan.
- Host (s33): turning frames into images, `swayClip`, `waveOffsetMs` wiring, `Canvas2D.lights` after `present`, canopy flag, shore re-bake around edits. **Shore memory**: a whole-map RGBA bake is 4 × W × H × 4 bytes (7.4 MB on the phone map, about 268 MB on a 256×256-tile map). CN-013 now makes foam the default for every water map, so the host must bake shore by chunk (the kit already notes chunked shore) before big maps load.
- Canopy: one chunk rebuild per unit cell step under the canopy is fine for now. A live cut overlay is the later option.

### Format r32 / CN-012 / CN-013: what the next round must deliver (does not affect this verdict)
These are naming and format gaps the CNs cover, so I did not fail r1 on them.
1. Rename `bake` to `motion`, and update the kit text: Carries, the CN-012/CN-013 pointers, and the `cn-drafts/` names. Also remove `display.seeThroughCanopy` (it is now per-map `seeThroughCanopy`, maker only) and the "leafy default".
2. **The 64-frame product cap and `motionTooLarge`.** The proto has no combined bake; each part bakes on its own. The round needs a combiner (or a check) that skips motion when the product of `cycle × scroll × sway` frame counts would pass 64.
3. **`motionInvalid`.** A bad or out-of-range value skips that part. Ranges: cycle 2–8 steps and ms 50–1000; scroll step ≥ 1, dividing the size, ms 50–1000; sway trunkFrom ≥ 0, edge 1–4, ms 100–1000. A colour list on a styled asset or an index ramp on an unstyled one is also invalid. Clip wins: motion is ignored when a clip plays. The proto's bakes already return `[img]` for bad ramps and steps, but nothing warns and `edge` has no range.
4. **The ramp index form** `{name, steps}`: resolve against the style's `ramps[name]` (dark to light) in the host or loader. `cycleFrames` takes colours, which is fine as long as that mapping exists.
5. **Per-part `ms`.** `swayClip` hard-codes 400 (`SWAY_POSE_MS`). Cycle (default 150) and scroll (default 200) have no clip builder. The round needs the ms per part.
6. **`reduce_motion` draws frame 0** (profile-format r13 §3.3): not in the proto. It needs a hook in the frame player or host.
7. **`objects[].motion`** override (`null` = off, absent = inherit), replaced whole.
8. **Shore params.** `FOAM_PX`, `SHALLOW_PX` and `WAVE_GAP` are module constants; the format makes `foamPx` 1–4, `shallowPx` 2–12, `waveGap` 4–16 and `frames` 2–8 per style, so `shoreFrames` (and the F-3 foam-band guard) must take them as arguments. Shore is on by default under `liquidEdge: "foam"` and off with `shore: false`; other liquid edges never get it. The colours come from the water ramp (lightest, then 1 and 2 steps from light; a ramp with fewer than 3 steps clamps).
9. Kit open questions 1, 4 and 5 are now answered (no leafy tag with per-plant `objects[].motion`; foam on by default; canopy per-map for makers only). The kit should record them.

**Agreement between the CNs and format r32:** the fields, ranges, defaults, warnings and the core-types sha (61fad786, unchanged; no proto change to it) match between CN-012/CN-013 and project-format r32 (§6.2 row, §6.4, the §13 warnings, the §16 sketch). profile-format stays r13 and §3.3 has `reduce_motion`. Gaps and ambiguities:
- A. **"Clip wins" is ambiguous.** "If a clip is playing" is a runtime state, but `motionInvalid` is a once-per-asset load warning. It should say "has a clip": `tileProps[i].anim`, or the style's water `anim` not null (format §6.2.x: under a style, the water slot takes `anim.frames`, so motion on water only works with `anim: null`). Neither CN states that water rule directly. It is also unclear whether one animated tile in a tileset voids motion for the whole asset or only that tile.
- B. **Product timing is unspecified.** The cap counts a product of frame counts, but the parts have different `ms` (150 / 200 / 400). One clip can't play a product grid at three rates unless it is baked on a common timeline. The format should say how combined parts are timed (common timeline, LCM, or separate layered clips); the cap may then need to count timeline frames.
- C. **`reduce_motion` and the shore.** CN-012 freezes "every motion part". It doesn't say whether shore foam and wave frames (CN-013) and painted water `anim` also freeze. These need a ruling.
- D. **Shore param combinations.** `waveGap` 4 with `frames` 8 gives a wave step of 0.5 px, so rounding repeats poses. The format allows it; it should either require `frames ≤ waveGap` or accept the repeats.
- E. **Stale pointer.** The project-format r32 changelog still says "Filed as `staging/CN-motion-format.md` (EA will number CN-012)" and the same for CN-013, while both are now numbered in `handoff/change-notices/`. Docs only.
- F. Neither CN says whether transparent pixels with a ramp colour must stay unchanged. Kit ruling 1 does, and the proto does it. Worth one line in CN-012.

## r2 — target 3e0a4c4b (tree e1a13788), on QA qfix 4e43b645

**Verdict: NOT OK (tests only).** The behaviour is right: every item on the r1 next-round list that r33 covers is delivered and matches format r34 and the refiled CN-013. My r1 fixes are intact and every r1 nit is fixed. But 5 of my 24 r2 plants on real rules go uncaught by r2's own tests, and the kit's acceptance says QA plants are caught. The QA r2 qfix is **tests only** (+6/−1 in 3 test files, all within cap) and catches all five. **Fold it in and r2 is OK to send.** The three r34 rulings are listed as known gaps for r3 below, not as findings.

QA r2 qfix: commit **5cc03149** (tree **1488849e**), one commit on 3e0a4c4b. Patch `qa-runs/step-32-review/r2/s32-qfix-r2.patch`, sha256 85afe581…. Merge-tree onto 6e117f0 is 1488849e, clean. As instructed, no ref was added for it; the only new ref is `refs/cmp/s32-proto-r2` = 3e0a4c4b.

Inputs were copied to `qa-runs/step-32-review/r2/` first:
- `ea/`: `r32-r2.bundle` 70a655a8, `s32-plants-r2.py` fc910335, the result file, and `kit-backup-r32` as of 18:23.
- `kit/`: step-32 2372cc8c, README e0f30e27, spine 743785aa.
- `docs/`: project-format r33 d11aa573 (DSK's staging copy) and r34 0644c4a8 (live), CN-012 16674615, CN-013 refiled 8be75c03 (the c5a0fdd3 copy is kept too), profile-format r13 3cc1b0ae.

### Claims
| Claim | Result |
|---|---|
| bundle 70a655a8, verifies, `6e117f0..r32` | ✓ |
| parent = QA qfix 4e43b64, unchanged | ✓ the parent is the same commit object 4e43b645 (tree 5753319f); patch-id fe0274e2 matches |
| 586/0, sims, smokes, pins | ✓ tsc 0; serial 586/0 ×2; green exit 0; sims byte-identical; smoke lines identical; nothing in the do-not-touch list changed |
| 384 lines (+372/−12) in 10 files; r2 alone +152/−30 | ✓ both |
| caps | ✓ canvas2d 130/132, bakes 74/82, water 46/46, canopy 19/23, motion 67/71, index 13/16, light 80/84, animated-extras 59/63, motion.test 44/48, light-canvas 28/32 |
| EA plants 76/76, all failing on the base | ✓ 76/76; "76/76 plant tests fail on the merge base 6e117f0" |
| merge-tree onto 6e117f0 | ✓ e1a13788 |
| purity | ✓ motion.ts imports only `./bakes.ts` and `./water.ts`; no Date, random, performance, DOM or `phase`; `check:law` OK |

### The r1 next-round list, checked against r34 and CN-012/CN-013 (`tools/probe32r2.ts`)
- **Motion naming:** ✓ `motion`, `bakeMotion`, `pickMotion`, `motionCell`, `MOTION_CAP`. `swayClip` and `SWAY_POSE_MS` are gone (ms is now per part).
- **Combined atlas and per-part ms:** ✓ cycle 3 × scroll 16 = 48 frames. Across 676 times from −5 s to 20 s, the atlas cell equals an independent `scroll(cycle(img)[c])[s]` with c on 150 ms and s on 200 ms: **0 mismatches**. The three-part case (2×2×4) against independent composition: 0 mismatches. Exactly 64 bakes; 80 gives `motionTooLarge`, `[img]`, no parts. Frame 0 is the input object.
- **motionInvalid ranges:** ✓ every bound in CN-012:
  - sway: edge 0/5/1.5 ✗, 1/4 ✓; trunkFrom −1 ✗, 0 ✓; ms 99/1001 ✗, 100 ✓.
  - cycle: ms 49 ✗, 50/1000 ✓; 1 or 9 colours ✗, 8 ✓; `#abc` ✗; upper-case hex ✓; a case-only repeat ✗; a literal list on a styled asset ✗; index form on an unstyled asset ✗; index out of range, negative, fractional, repeated or naming a missing ramp ✗.
  - scroll: step 0/3/32 ✗, 16 ✓ (one frame); axis "z" ✗; ms 49 ✗.
  - A bad part next to a good one: the good part bakes and `motionInvalid` is returned.
- **Clip-wins per cell:** ✓ `ctx.animated` gives `[img]` + `motionInvalid` (the host decides per drawn cell, per CN-012 r33).
- **Ramp index form:** ✓ resolved against `ramps[name]`, dark to light.
- **reduce_motion:** ✓ `motionCell(…, reduce)` is 0 for any t, including a shore part. Shore frame 0 keeps the full `foamPx` line (CN-013: the static foam line stays visible).
- **`objects[].motion`:** ✓ `pickMotion`: placement `null` gives none; absent inherits; tile over asset; a null tile inherits the asset.
- **Shore:** ✓ on by default under `foam` (absent = foam), off for `shore: false` and other edges. Colours: lightest, then 1 and 2 from light; a ramp of 1 or 2 steps clamps to the lightest. `waveGap` 6 or `frames` 3 against 8 gives `shoreInvalid` and both default; 12/3 passes. Waves move `waveGap/frames` whole px toward land.
- **seeThroughCanopy:** ✓ `createSeeThrough()(scene, map.seeThroughCanopy)`; absent gives off.
- **Never cycle:** ✓ a transparent pixel with a ramp RGB and an off-ramp pixel are unchanged in every atlas frame.
- **Determinism:** ✓ baking twice is byte-identical, the meta and image are never mutated, and everything is on the one clock (`motionCell(t)`).

### r1 fixes and nits
- **F-1:** a moving torch makes 2 canvases in total and 0 remain after dispose. **F-2:** a NaN wash gives 1 plan and 1 build. **F-3:** 0 of 2816 shoreline pixels lack foam. All intact (r1 `probe32.ts`, unchanged numbers).
- **N-3 still holds:** 2 main draws a frame at 844×390 with 4 torches. Loss gives 0 draws; restore rebuilds and zeroes the old pair; DPR 3 resize has no rebuild.
- **Darkness `rgba(3,8,26,0.71875)` and cap:** alpha 183/255 = 0.7176 ≤ 0.72; additive glow at most (48,33,14). ✓
- **N-1 sway border:** fixed. A fully opaque 6×6 block now moves 26/21/26 px per pose (it was 0/0/0).
- **N-2 budget:** fixed. `stats.bytes` = plan.w×plan.h×8 (57,600 at res 8, 230,400 at res 4), unchanged on reuse, 0 after dispose.
- **N-3 glow tag by pass:** fixed (a glow colour equal to the darkness RGB is still tagged add).
- **N-4 land length:** fixed (RangeError).
- **N-5 no-context retry:** fixed. It retries only on a new plan or after free; 3 frames make 2 canvases, not 6.
- **N-6:** negative x now uses true modulo.
- Canopy chunks are unchanged (1 rebuild per cell step); offscreen water doesn't wake the loop.
- Perf: a 960×480 shore takes 89 ms + 11 ms; one tree's bakes 0.76 ms.

### QA plants on r2 (`r2/tools/qa32r2-plants.py`): 18/24 on r2's own tests
Plus my r1 sets: 12/16 with Q3, Q7 and Q13 N/A because their code was rewritten (Q15 is equivalent), and the qfix set 5/5 with F3 re-anchored.
**Missed:**
- **R10** `noCtx` not reset by `free()`: after a context restore, a plan whose context was missing is never retried.
- **R12** `shoreDistance` ignores its `foamPx` argument: noise inside a foamPx 3–4 band brings the F-3 gaps back.
- **R13** the 1-px foam floor is removed: foamPx 1 foam vanishes on odd frames.
- **R14** sway border seeded only left/right: CN-012 says the whole frame border.
- **R5** a 3-digit `#abc` is accepted as a colour.
- **R6** `shore: null` treated as off. Not pinned on purpose: what a whole bad value does belongs to r3 (see the r3 gaps).

### Findings
- **F-5 (must-fix, tests): five rules have no test** (R5, R10, R12, R13, R14 above).
  Repro: `python3 r2/tools/qa32r2-plants.py <r2 clone>` gives 18/24.
  The behaviour itself is correct; only the pins are missing.

### Qfix r2 (5cc03149): tests only, +6/−1
- `light-canvas.test.ts` 28 → 30/32: a no-context plan is not retried by frames but is retried after `contextrestored`.
- `motion.test.ts` 44 → 45/48: `#abc` gives `motionInvalid`; foamPx 1 keeps foam on frame 1.
- `animated-extras.test.ts` 59 → 61/63: with `shoreDistance(…, foamPx 4)`, x 2–5 read exactly 1–4 (no noise in the band) for 3 seeds; a fully opaque 6×6 block with edge 1 moves its bottom row up (pose 1) and its top row right (pose 3).
- **Results:** tsc and lint clean, 586/0 (serial too), green exit 0, sims and smokes identical, EA plants 76/76 (all still failing on the base), QA r2 plants **23/24** (only R6, left to r3), and noise in the foam band is caught.

### EA's interpretations
1. **An animated cell with motion warns `motionInvalid`.** Sound. r33 decides it per drawn cell, and r34 (2) keeps the warning. r3 owes the message text "set `anim: null`" (see the r3 gaps). The host must dedup to once per asset (kit host carry).
2. **Bad shore fields go in a `badFields` list.** It was reasonable under r33's unnamed paint-style warning, but **r34 (3) supersedes it**: `shoreInvalid` once per bad field, naming the field. That is an r3 gap.
3. **A ramp under 3 steps uses the lightest; no water ramp means no shore.** The first part is sound and matches CN-013. The second is defensible but silent: a `foam` style with no water ramp, or one bad hex, quietly loses the default-on foam. Ask DSK whether that should warn `shoreInvalid` (field `ramps.water`). Keep the behaviour.
4. **Foam is at least 1 px.** Sound. Without it, foamPx 1 would vanish on odd frames, which contradicts "the static foam line stays visible". Now pinned by the qfix.
5. **`SHORE_MS` is a 250 ms code constant.** **Superseded by r34 (1):** `shore.ms` is an int 50–1000, default 250, and `SHORE_MS` becomes that default. r3 gap.
6. **Atlas order is cycle, then scroll, then sway.** Sound. It is deterministic, `motionCell` agrees (0 mismatches), and the order is runtime-only and never stored. Sway is computed on each scrolled frame, which costs load time only (0.76 ms per tree).
7. **A wrong-length land array throws RangeError.** Sound as a guard against a programming error. No render-path code calls `shoreDistance` (it is only exported); it runs at load. The one live-frame risk is the s33 host re-baking shore around a dig. That would run inside `o.view()`, which the raf-driver already wraps in try/catch (it counts `errors` and backs off 1 s), so it can't kill the loop. Carry: the host should validate the window before calling.
8. **Light-canvas memory can't be evicted.** Sound: it is the live frame's darkness, so evicting it would force a rebuild every frame. Its size, 8 B per sample, comes out of the chunk budget: 230 KB on the phone map, about 8 MB on a 256×256-tile map at res 4 (a quarter of the 32 MB default). Note it in the kit; step 34's view-bounded plan would cap it.
9. **A missing context is retried only on a new plan or after `free()`.** Sound (now pinned for restore). Two small nits:
   - (a) A failed attempt leaves its 2 freshly made canvases sized (they are never zeroed).
   - (b) If the reused pair's own context is missing, `lit = keep` holds a pair that was **already cleared** by the `width` reset, with the old plan still recorded. If the host shows that old plan again, it blits an empty pair, so there is no darkness until the plan changes.
   The fix for both is to zero the new pair on failure and set `lit = null` when keep was cleared. This only happens when an offscreen context is lost; it is not must-fix.

### Known gaps for r3 (r34 rulings; not findings)
1. `shore.ms` (int 50–1000, default 250 = `SHORE_MS`): add it to `ShoreOpts` and to `shoreSettings`' range checks (the probe shows `{ms: 400}` is ignored silently today), and use it for the shore part's ms.
2. The `motionInvalid` message on derived-clip water tells the maker to set `anim: null`.
3. `shoreInvalid` once per bad field, naming the field. This replaces `badFields`; the plan's `notices` need to carry field names. While at it, decide what a **bad whole value** does. Today `shore: null` and `shore: []` are silently on with the defaults, `true` and `"yes"` give `badFields: ["shore"]`, and r34 rules only on fields of the object form.

### r34 / CN gaps and ambiguities
- **A. CN-012 still says "Docs: project-format r33 (d11aa573)".** The r34 motion rule (the derived-clip warning and its `anim: null` message) appears only in CN-013's Warnings. CN-012 should be refiled pointing at r34 and should carry that motion rule itself.
- **B. CN-013's "no pose repeats" is not true for every valid combination.** 14 of 72 valid (waveGap, frames, shallowPx) combinations bake identical frames. Example: waveGap 5, frames 5, shallowPx 2 gives 4 distinct of 5. This happens because rings are drawn only where `d ≤ 2·shallowPx`, so with a small `shallowPx` some frames have no ring. It is harmless visually. Either drop the claim or add a rule (for example `waveGap ≤ 2·shallowPx`).
- **C. A whole-value `shore` that is neither `false` nor an object** (`null`, `true`, an array, a string) is not ruled. r3 needs one answer: `shoreInvalid` naming "shore", then on with the defaults or off.
- **D. No usable water ramp:** the format says colours come from the water ramp and doesn't say what happens without one. r2 turns the shore off silently. Should it warn?
- **E. One check is clean:** the r34 changelog, the §6.2 `shore` row, the §13 rows (`motionInvalid` r33 restated, the r33/r34 `shoreInvalid` row) and the §16 sketch (`shore.ms?`, the Motion types) agree with the refiled CN-013 (8be75c03) and with CN-012 on ranges, defaults, clip-wins per cell, `reduce_motion` (shore included), "never cycle" and the sway frame border. core-types stays 61fad786 and profile-format stays r13 (§3.3 `reduce_motion`).

### Carries
- Step 34: the light repaint on plan change and the full-map plan scan (unchanged from r1); a view-bounded plan would also cap the light canvas share of the budget.
- Host (s33):
  - pass the same `foamPx` to `shoreDistance` and `shoreFrames` (passing the default distance with foamPx 4 frames leaves 172/1000 band pixels without foam in my probe);
  - chunked shore bakes (memory, as in r1);
  - dedup the motion warnings per asset;
  - feed `motionCell` a finite clock (`motionCell(NaN)` returns NaN, which indexes no frame);
  - validate the window before a dig re-bake.
- Nits 9(a) and 9(b) above.

## r3 recheck (kit-3, r3 `fd1150ac`): OK TO SEND

### Inputs
- I copied EA's files to `qa-runs/step-32-review/r3/` (`ea/`, `kit/`, `docs/`). I touched nothing in `/tmp/r32-kit`, `scratch-ea` or `share`. The source shas match after the run.
- **Bundle:** `r32-r3.bundle` 66794a29 verifies, and its head is `refs/heads/r32` = `fd1150ac`. I added one ref, `refs/cmp/s32-proto-r3`.
- **Commit:** tree `c1b94556`. Its parent is `5cc0314920c73b1f…`, which is my qfix-r2 object byte for byte (tree `1488849e`, same author and time line).
- **Diff size:** r3 alone is +35/−34 in 6 files. Against `6e117f0` it is +378/−12 in 10 files, so 390 lines.
- **Base:** no re-base. `git merge-tree --write-tree 6e117f0 fd1150ac` gives `c1b94556`, which is clean.
- **Pins:** `package.json`, the lock, depcruise, `check-law.sh` and `src/core` are unchanged.
- **Kit-3** (step 549b24a8, README 5465e87d, spine a10723de) has everything asked for:
  - it cites r34 `0644c4a8`, CN-012 `16674615` and CN-013 `8be75c03`, and says r35 is pending;
  - it has the chunk-budget note (item 15);
  - it lists my s33 host carries and s34 carries, plus the r34/CN gaps A and B for DSK.

### Claims rerun
- **Build and tests:** `tsc` 0. Serial `node --test` passed twice with 586/0. `npm run green` exits 0 with 586/0.
- **Sims and smokes:** sims are identical to r2. The smoke and pin lines are identical to qfix-r2, except the heap line, which wobbles under concurrency.
- **Caps:** every row matches the kit-3 table, at the stated count:
  - canvas2d 130/134
  - bakes 74/78
  - water 46/50
  - canopy 19/23
  - motion 68/71
  - index 13/17
  - light 80/84
  - extras.test 61/65
  - motion.test 45/49
  - light-canvas.test 30/34
- **Cap changes vs kit-2:** the kit's "Caps are the qfix-r2 counts + 4" rule explains every row. Six caps went up: canvas2d 132→134, water 46→50, index 16→17, extras 63→65, motion.test 48→49, light-canvas 32→34. One went down: bakes 82→78. Canopy, motion and light are unchanged.
  - None of these is a silent raise, because the rule is stated. But the rows no longer show the old cap the way kit-2 did, and "no re-base this round" is loose wording, since the headroom was reset.
  - **Nit:** the next kit should annotate each changed cap (was → now). No code line needed the raise: every r3 count is at or below the kit-2 cap.
- **EA plants:** `s32-plants-r3.py` (6ab52707) catches 96/96. All 96 named tests fail on `6e117f0`. Per plant, the result matches EA's `s32-plants-r3-result.txt`.
- **QA plants:** I re-anchored my 24 r2 plants to r3 (R6 now plants `shore: null` → off; R18 has the hint anchor) and added K1–K10 for the r3 rules. All 34/34 are caught (`r3/tools/qa32r3-plants.py`, `r3/qaplants-r3.log`).
  - K1–K10 plant: `ms` upper bound 2000, hint dropped, array read as an object, ramp warning dropped, only the first bad field warned, failed canvases left sized, reused pair keeps its plan key, `shore.ms` not passed to the part, a bad whole value silent, no ramp leaves the shore on.

### r3 closes (probe `r3/tools/probe32r3.ts`)
- **`shore.ms`:**
  - 50 and 1000 are accepted.
  - 49, 1001, 2.5, "400" and null each warn `ms` and fall back to 250. `SHORE_MS` = `SHORE_DEFAULTS.ms` = 250.
  - `{ms: 400}` reaches `opts.ms` and `part.ms`. `motionCell` steps at 400 ms: cells 0,0,1,1,2,3,0 at t = 0, 399, 400, 799, 800, 1599, 1600. Reduce gives 0.
- **`ANIM_HINT`:** an animated cell returns `notices ["motionInvalid"]` with the message "…set anim: null to use motion". Other motionInvalid cases carry no message. This matches what r35 says CN-012 now states.
- **Per-field `shoreInvalid`:**
  - `{foamPx:0, shallowPx:99, frames:9, waveGap:3, ms:5}` gives five notices in field order, each naming its field and range.
  - waveGap not a multiple gives one `waveGap` notice, and both fields use their defaults.
  - `badFields` is gone from the type and the code.
- **r35 rulings:**
  - `shore: null` behaves like absent: on, defaults, no notice.
  - `true`, `[]`, `3` and `"yes"` each give one `shore` notice and keep the defaults.
  - No ramp, an empty ramp, or a ramp with a bad entry each give one `ramps.water` notice ("no water ramp: the shore is off"), and the shore is off.
  - `shore: false` and `liquidEdge: "ice"` stay off silently, even with no ramp.
- **Nit 9(a):** a failed fresh attempt leaves 0 sized canvases, and the test pins it.
- **Nit 9(b):** a live pair for plan A, then plan B (same size) with the context lost, gives 0 draws and 0 bytes. Both canvases go to 0 and the plan key is dropped. Back to A, it repaints: builds 1→2, two draws, 230,400 bytes. The test pins this too, including my qfix-r2 restore retry.

### Regressions
- **r1 and r2 fixes:** the r1/r2 probes match r2:
  - atlas 0 bad cells;
  - ranges and pick unchanged;
  - sway block 0/26/21/26;
  - light bytes 57,600 at res 8 and 230,400 at res 4, with noCtx not retried, 0 leaked and 0 after dispose.
- **Darkness:** `rgba(3,8,26,…)` with cap alpha 0.7176 (183/255).
- **Draws:** 2 draws a frame (120 per 60 frames).
- **Determinism and purity:** determinism true with the input untouched. No `Math.random`, `Date.now`, `performance.now` or DOM use in motion, bakes, water or canopy.
- **Tests kept:** all my qfix-r2 tests are still there (the noCtx restore retry, the foamPx band, the 1-px foam floor, the sway top/bottom border, 3-digit hex), and R5/R10/R12–R14 are caught.

### Docs
- **r35 exists:** live `data/project-format.md` r35 is `ce7e9f53`, "ACCEPTED pending the EA's confirmation of the DSK rulings". Its (c) entry matches r3 exactly: null = absent; true, array, number and string → `shore`; no usable ramp → once per body, off; the "no pose repeats" claim is replaced.
- **Staging CNs:** the staging copies `data/staging/CN-motion-format.md` (6a10fc48) and `CN-shore-canopy-format.md` (b4f812f6) cite r35 and close gaps A and B.
- **Handoff CNs:** these are still the r34-era bodies (16674615, 8be75c03). That is correct while r35 is pending, so kit-3's citations are right for now.
- **Merge-time carry:** once r35 is confirmed, refile both CNs and re-cite r35 and the new CN shas in the merged step file.

### Notes (not blocking; for DSK at r35 confirmation)
- **N-r3-1:** a field-level `null` inside the object (`{ms: null}`) warns that field, while a whole `shore: null` and a clip `ms: null` (r30) read as absent. That is consistent with "null = absent" only at the whole-value level. DSK should say whether a field null also means absent.
- **N-r3-2:** a bad whole value with no water ramp (`{shore: 3}`, no ramp) warns only `ramps.water`, because the shore is off. That is reasonable, but the maker learns about the second problem only after adding a ramp.
- **N-r3-3:** the cap-annotation nit above.

### Verdict
**OK TO SEND.** No qfix needed. The carries are unchanged from r2: s33 host items and s34 perf items, both as listed in kit-3. Nits 9(a) and 9(b) are closed.
