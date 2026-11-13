# Hand-back step-32-animated-extras r1
Step file: handoff/steps/step-32-animated-extras.md
Kit file sha256: aacbb82c35b62034e2a67b14a347a4fd8bab5d85d5133de14ac4837435977dda
Base commit: 6e117f02ea669296d796580c871a93702abd298b     Head commit: 8a22ec58585bbcc7957ba04326e30399f9e83a99     Branch: step/step-32-animated-extras-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/canvas/canvas2d.ts
A	src/runtime/render/bakes.ts
A	src/runtime/render/canopy.ts
M	src/runtime/render/index.ts
M	src/runtime/render/light.ts
A	src/runtime/render/motion.ts
A	src/runtime/render/water.ts
A	tests/runtime/canvas/light-canvas.test.ts
A	tests/runtime/render/animated-extras.test.ts
A	tests/runtime/render/motion.test.ts

## Green
npm test: 586/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Chamfer 3-4 is stored as `round(units / 3)`, capped at `max` (default 32). Water starts at `cap * 3`. Both passes run. Seeded noise is a 4 px bilinear hash of `% 3`, rounded to 0..2, seed default 0, and is added only when the base distance is past `foamPx` and under the cap.
- The cell above a unit is `r − 1` (row grows down). An off-map unit still cuts an on-map neighbour; there is no wrap. Objects do not cut. Absent or false returns the same scene object. The cut is memoised by scene identity and the flag.
- Cycle, scroll and sway frame 0 are the input object. The atlas is cycle, then scroll, then sway, cell `((c · nScroll + s) · nSway + w)`. A moved leaf is stamped onto a full copy, row-major, later pixels overwrite, so the still sprite never opens a hole. The frame border counts as transparent on all four sides.
- `pickMotion` takes a placement that is not `undefined` (so `null` wins), else a tile that is not `undefined`, else the asset. A bad `ms` skips that whole part. An animated cell returns before any other check, with `ANIM_HINT`. `waveOffsetMs` uses true modulo; a non-finite value, `loopMs ≤ 0` or `pxPerS ≤ 0` returns 0. `WIND_PX_PER_S` is 45.
- Shore hex is exactly six digits, case-insensitive, so `#abc` is invalid. Foam is the lightest water step, wave one step darker, shallow two; under three steps all three are the lightest. `{ms: null}` inside `shore` warns on field `ms` (N-r3-1). A bad whole value with no water ramp emits both notices and then turns the shore off (N-r3-2, left open).
- Glow is the second blit, always `lighter`, not chosen by colour. Offscreen fills use the same `rgba` strings as `lightOps`. A non-finite wash or dim counts as 0 and lights nothing; the plan memo uses `Object.is`. The pair is `plan.w × plan.h`, reused when the size matches, `w · h · 8` bytes, never evicted, and shrunk to 0 when replaced, on restore, on dispose, and when the 2D context is missing. A miss marks that plan once and drops the plan key.
- The step file is the supplied kit and is not in this tree. Diff vs `6e117f0` is 10 files, 386 insertions and 14 deletions (400 changed lines). Caps: bakes 76/78, water 33/50, canopy 23/23, motion 71/71, index 13/17, light 80/84, canvas2d 134/134, animated-extras.test 62/65, motion.test 48/49, light-canvas.test 32/34. `npm run sim` prints the base's two lines. Pins unchanged (`61fad786`, `1e5dd82c`, `45a3dbaa`, `4d7bbf48`, `d7f64a09`). `main` was not committed to.

## Next step (optional proposal)
- The host loader (step 33) should read the motion, shore and canopy fields, pass the same `foamPx` into `shoreDistance` and `shoreFrames`, bake the shore per chunk, and call `Canvas2D.lights` after `present`. Step 34 should repaint only the dirty box and bound the plan to the view.
