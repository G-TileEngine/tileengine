# Hand-back step-33b3-particles-outline r1
Step file: handoff/steps/step-33b3-particles-outline.md (on origin/main at 43e8c31; not committed on this branch)
Step file sha256: d27db8612dab4e52db32bc1ec88333708bbee42b6a3d3ad14faa58ce9898238d
Base commit: d5b36b5ff3755011c4de2f5410d7133193cdae75     Head commit: e0c4f7bfb3e32cd51afe25150869f701e77fb000     Branch: step/step-33b3-particles-outline-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/canvas/canvas2d.ts
M	src/runtime/render/chunk-plan.ts
M	src/runtime/render/dirty.ts
M	src/runtime/render/draw-list.ts
M	src/runtime/render/fx-light.ts
M	src/runtime/render/fx-live.ts
A	src/runtime/render/fx-look.ts
A	src/runtime/render/fx-particles.ts
M	src/runtime/render/fx-player.ts
M	src/runtime/render/index.ts
M	src/runtime/render/types.ts
M	src/runtime/scene/world-scene.ts
M	src/types/core-types.ts
A	tests/perf/fx-particles-budget.ts
M	tests/runtime/render/render-core.test.ts
A	tests/runtime/scene/fx-particles-qa.test.ts
A	tests/runtime/scene/fx-particles.test.ts
M	tests/smoke.test.ts

## Green
npm test: 672/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`node tests/perf/fx-particles-budget.ts` (alone, exit 0): fx-particles budget (limit 4 ms p95 every lap): lap 1 p50 0.75 p95 3.80 max 6.52 ms (187 frames); lap 2 p50 0.51 p95 3.20 max 9.39 ms (187 frames); lap 3 p50 0.48 p95 0.74 max 5.19 ms (188 frames); counts 132/36/90/1

The suite's budget pin at t=600 is still [131, 36, 96, 2]. The alone-run counts are the last frame of the 3-lap clock, not that pin.

## Shipped tests (sha256, unchanged)
2893173f15a2be3eebc2b488d4b7f017db88aebb9329a627fb94787f90e0fd86  tests/runtime/scene/fx-particles.test.ts
819bcd57befa1dc139e96939c96cf1bf98e60343bf8b87bf00cc3d7ad24c1238  tests/runtime/scene/fx-particles-qa.test.ts
832795683181b2c2d6b6bb352dd4c7d53e5edf63135eb4011a8976f78eb97295  tests/perf/fx-particles-budget.ts
bbbac8c707674b3e9b5df2e9bdad6de7429f47f18798dacec49002417695d890  tests/runtime/render/render-core.test.ts
f114708f5e5929c900669ba232bb7d627e5c642f88323fd77cf3e2758c9f1d56  tests/smoke.test.ts
d6d0869644f3c9876aa1101d8a7248f8b5a18b3beabcb0b191c9c42fec88a366  src/types/core-types.ts

## Helpers & self-review (required)
- Helper "Review 33b-3 rulings vs code": read the render and scene files against the rulings. It found two gaps. (1) The 300 cut lives inside one `buildDrawList`, and `chunkedList` calls it once for standing and once for overlays and dots, so a standing image is not inside the overlay cut. Left as logged seam 27 (the cut is per draw-list build; chunked passes are separate lists). The shipped draw-list test and the QA "newest rects" test both pass. (2) `blend: "add"` set `op: "add"` only on overlays, so a unit-layer piece skipped the outline but still drew normal. Fixed: `Standing` gained `op`, and the standing push uses `st.op ?? "normal"`.
- Self-review: Acceptance — green 672/0/0/0 and the four checks exit 0: done. Five shipped files byte-identical to the kit shas: done. Perf script alone exits 0 with every lap p95 ≤ 4 ms: done. `src/types/core-types.ts` is the kit copy `d6d08696…`: done. Existing tests, including the 33b-2 light tests, still pass; sim files were not edited, and the smoke sim pin in the suite passed: done. File caps hold (fx-look 54/55, fx-particles 32/32, fx-live 114/122, draw-list 80/94, fx-light 56/58, types 36/41, fx-player 107/111, index 20/24, dirty 21/25, chunk-plan 38/42, world-scene 125/126, canvas2d 151/155; tests inside their caps): done. Changed lines outside CN-018 are 426, with the 400–500 reason below: done. Import fences hold (`fx-particles.ts` is `./frames.ts` plus a type from core-types; `fx-look.ts` is a type from `./bakes.ts` and `./fx-light.ts`; `world-scene.ts` is render index plus notice; `canvas2d.ts` is render index): done. With no particle, outline, scale, angle or hit-white fields the earlier tests pass, and those frames add no dots and no look ids: done. Nothing reads `LiveOut.holds`: done. Every ruling's pinning test passes: done. Hand-back is this folder: done.
- QA checklist: G1 done (672 pass, 0 fail/skip/todo, shipped shas match). G2 done (tsc exit 0, no new ignore or any). G3 done (no phase writes; state files untouched). G4 done for the quoted exports; the extra `Standing.op` is the deviation named below. G5 done (do-not-touch paths absent from the diff; core-types is the allowed verbatim copy). G6 done (no file outside the step list). G7 done (426 outside CN-018, reason written, every file under its cap). G8 done (check:law and check:state exit 0; one clock unchanged). G9 done (decisions below match the diff). G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- Particle seed is `hash32(mapSeed, effect id, step index, 0)`, then `hash32(seed, "dot", i, 0)`. Reach is `8 + (h % 17)` art px (8–24). Burst eases out with `1-(1-u)^2`. Attract and spiral-in close with `min(1, u * pull/1000)`; spiral-in adds one turn (`close * 2π`). Rise goes up on that radius and ignores pull, as burst does. Age is the effect's warped draw time minus the step start, so hit-stop freezes the dots.
- The pool drops oldest-born first (birth is the step start); a tie drops the earlier effect, then the earlier step, then the earlier index. After the cut, dots draw in effect order. Pieces take the 60/120 budget first; particles use what is left. A piece cut by that budget still keeps its light. The 300 cut drops the newest rects inside one `buildDrawList`. Chunked standing and overlay passes stay separate lists (seam 27).
- Look tags, in order, are the turn (`r<k>` or lite `n<k>`), then `hw:<arg>`, then `ol#rrggbb`, joined by `|`. Bucket 0 draws the source. Rounding is `Math.round` of `deg / (360/n)`. Outline colour is the ramp's first step (darkest), else `#000000`. `hex()` reads only `#rrggbb`, so a bad colour outlines white (seam 30).
- Deviation: `Standing` gained `readonly op?: DrawOp`. The quoted additions were only `look` and `scale`; `Overlay` already had `op`. A unit-layer `blend: "add"` now sets that op, and the standing pass draws it. Outline is still skipped for `add` on both layers. Absent op stays `"normal"`.
- Law 13: the pool is rebuilt every frame and kept nowhere. `capCounts` runs per effect. Generated bakes share Canvas2D's one 16 MB LRU with the light canvases; a bake drawn this frame is not dropped. Notices go through the link's deduped list (≤ 1024). No new map grows with frames. No export name matches a tint mode.
- Size: 426 changed lines outside CN-018 (+372/−54) in 16 files. Over 400 because the shipped QA test (27) and the perf script (27) are counted; product code is +175/−53 = 228, under 400. CN-018 (core-types verbatim, smoke pin +1/−1) is separate. The proto was 423; the extra lines are the standing `op`.
- Defaults used as ruled: `pixel_scale` rounds with `Math.round`, then clamps to 1–6; `"match-sprite"` and absent are 1; a non-number is 1 and flagged. `hit_white_ms` of 0 is off and not flagged; anything else outside 40–200, including a negative or a non-number, is off or clamped and flagged. A particle field that is not a number plays as its default and is flagged. Fade (0.5, then 0.25) runs only on the last two steps of a ramp of 3 or more. Size is 3, then 2, then 1 on strict thirds of the life.

## Next step (optional proposal)
- Seams 24–30 stay open: the cue player, hit-white that outlasts its pieces, lights at the unscaled centre, looks skipped on squash and motion atlases, and 3-digit outline colours. Particles still do not read jitter, spread or picture.
