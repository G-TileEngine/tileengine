# Hand-back step-g2b-effect-pieces r1
Step file: handoff/steps/step-g2b-effect-pieces.md (sha256 3f1a0a9c013cef9c3fdebff37708260109987cfd60d7971941e0d087737f9e7c)
Base commit: cbb326efba97a9833becd168ca1b72ddaca8b245     Head commit: 8d1af4a16eedf8f6b43909940f359408d1142413     Branch: step/step-g2b-effect-pieces-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/runtime/render/draw-list.ts
M	src/runtime/render/fx-live.ts
M	src/runtime/render/fx-particles.ts
M	src/runtime/render/fx-player.ts
M	src/runtime/render/types.ts
M	src/runtime/scene/world-scene.ts
A	tests/runtime/render/effect-pieces.test.ts
M	tests/runtime/scene/fx-particles-qa.test.ts
M	tests/runtime/scene/perf-34a.test.ts

## Green
npm test: 719/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` exited 0 and did not change the lock. `npm run green` on the final tree exited 0. Summary from test-output.txt: tests 719, pass 719, fail 0, cancelled 0, skipped 0, todo 0. depcruise: 106 modules, 334 dependencies, no violations.

## Shipped tests (sha256, unchanged)
64b3a0d5c632329a16f0de5b2601c4a12842f93e86f3bf8f54ee6960534bed8c  tests/runtime/render/effect-pieces.test.ts
89bf5711364cdb7d5fc0fb3f5b4bddadc9ed2586bb227b9cb625a5753d8d4a09  tests/runtime/scene/fx-particles-qa.test.ts
f828a3a5a1fe2ec1b10971820d633497a79475472f7217ad50fc2559f455743c  tests/runtime/scene/perf-34a.test.ts

## Sims, smoke, pixel suite, budgets
`npm run sim` matched the Base (worktree at cbb326ef), byte for byte:
```
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```
The 21 smoke lines the suite asserts passed inside the 719. Heap line is report-only.

`node tools/pixel-suite/smoke.ts` printed `smoke: 0 failed`. `node tools/pixel-suite/run.ts` printed the Base's lines (diff against a cbb326ef worktree was only the node warning's pid): `chromium L2 frame 1 equals L1 1:150x98:04b5748d`, frame 2 `2:150x98:6865666d`, frame 3 `3:150x98:846e2223`, then `pixel suite: 0 failed; skipped (not installed): firefox, webkit`.

`node tests/perf/fx-particles-budget.ts` alone, every lap under 4 ms, counts `132/36/90/1`:
```
fx-particles budget (limit 4 ms p95 every lap): lap 1 p50 0.82 p95 2.99 max 6.57 ms (187 frames); lap 2 p50 0.55 p95 2.70 max 7.60 ms (187 frames); lap 3 p50 0.52 p95 0.86 max 3.42 ms (188 frames); counts 132/36/90/1
```
`node tests/perf/stress-budget.ts` exited 0. Stress L, every lap under 2 ms, counts 27/373/0. Full lines:
```
stress A ({"size":64,"water":false,"moving":0,"effects":0}): lap 1 p50 0.33 p95 0.59 ms; lap 2 p50 0.25 p95 0.45 ms; lap 3 p50 0.23 p95 0.47 ms; counts 27/0/0
stress B ({"size":64,"water":true,"moving":20,"effects":0}): lap 1 p50 0.45 p95 0.79 ms; lap 2 p50 0.40 p95 0.68 ms; lap 3 p50 0.38 p95 0.62 ms; counts 113/0/0
stress C ({"size":64,"water":true,"moving":20,"effects":100}): lap 1 p50 1.29 p95 2.34 ms; lap 2 p50 1.25 p95 1.77 ms; lap 3 p50 1.24 p95 1.70 ms; counts 181/0/0
stress E ({"size":128,"water":true,"moving":20,"effects":100}): lap 1 p50 1.73 p95 2.37 ms; lap 2 p50 1.73 p95 2.41 ms; lap 3 p50 1.73 p95 2.38 ms; counts 181/0/0
stress L ({"size":128,"water":false,"moving":0,"effects":0,"res":4}): lap 1 p50 1.07 p95 1.42 ms; lap 2 p50 1.05 p95 1.42 ms; lap 3 p50 1.06 p95 1.42 ms; counts 27/373/0
```

## Helpers & self-review (required)
- Helper "Review G2b rulings vs code": read the step rulings and the uncommitted src against items 10, 11, 13, 14, 15a and seam 33, plus the quoted signatures. PASS on all six. `pixScale` keeps the Base's round-and-clamp for numbers and matches `"1"`–`"6"` exactly; `Standing.op` is set only for `blend: "add"`; particles stay on `mid()`; spread bytes are the low-to-high bytes of `hash32(seed, "spread", i, 0)`; a squashed unit keeps its look and the link bakes `~sq` through `squashed()` before `frames`; the dead `ui` band maps to `flash`. Residuals, not ruling breaks: a late dot still ends at `life` (so it never plays past the life); jitter lives inside `dot.x` and so is multiplied by `pixel_scale` with the path; `SPREAD` is not re-exported from the render barrel (index.ts is not in the file list); the light uses sheet `fw`/`fh`, not a `lookBox` inset, which matches the written centre formula.
- Helper "Run G2b tests and probes": ran `effect-pieces`, `fx-particles`, `fx-particles-qa` and `perf-34a` (13 pass, 0 fail), then probed from `/tmp` without writing the repo. `particleRead({})` is the old five-key object; `jitter: 0` omits the key; `jitter: -1` and `jitter: "0.5"` flag and omit; `size_spread: 0.6000001` clamps to 0.6 and flags. Absent, `null`, `"match-sprite"`, `"1"` and number `1` add no scale and no note, and a steady light stays at `(24, 28)`. 4032 `particleAt` cases with `tileW` 16 matched the call that omits it, including reduce and age === life. Lite count 1 stays 1 (`ceil`, not floor). It also noted the two intended draw-list moves: lite plays `ceil(n/2)`, and a squashed hit-white unit changes the picture (rig C's shipped hash).
- Helper "Check G2b scope, caps, hashes": PASS on the nine-file list, the three sha256s, and changed-line caps (fx-live 9/24, fx-particles 20/30, fx-player 2/4, draw-list 2/8, types 2/4, world-scene 4/8; total 116). It found that the first `litAt` formula, while equal to `mid()` in algebra, could differ by 1 ulp for a non-dyadic `norm` anchor at k = 1. Fixed before the commit: when k is 1, `litAt` returns `mid()`. Re-ran `npm run green` after that fix (719/0).
- Self-review: Acceptance — green 719/0/0/0 and typecheck, lint, deps, check:law, check:state exit 0: done. Three shipped files byte-identical to the step sha256s: done. Sims match the Base; the suite's smoke pins passed inside the 719; `git diff cbb326ef --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state src/core src/sim tools tests/perf` empty: done. smoke.ts `smoke: 0 failed`; run.ts lines are the Base's: done. fx-particles budget p95 2.99/2.70/0.86 ms, counts 132/36/90/1: done. Stress counts A 27/0/0, B 113/0/0, C 181/0/0, E 181/0/0, L 27/373/0, L p95 1.42/1.42/1.42 ms: done. Changed lines 116 (cap 400); each file under its changed-line cap: done. Each ruling's pin in `effect-pieces.test.ts` passed, and the two moved pins (qa Ruling 10, rig C) passed: done. This hand-back is the branch's last commit: done. QA G1–G10: G1 shipped hashes and 719/0, plants script not on this machine (`/workspace/scratch-ea` absent); G2 tsc 0, no new ignore or any; G3 check:state OK, no state edits; G4 quoted signatures match (`Standing.op`, `FxPiece` spread fields, `ParticleRead`, `SPREAD`, `particleRead`, `particleAt` `tileW = 0`); G5 do-not-touch diff empty; G6 only the step's 9 files plus this required hand-back; G7 116 lines, every file under its stated cap (the step's own proto is 114, so the under-150 flag is the step's size, not a trim); G8 check:law OK; G9 decisions below match the diff; G10 acceptance lines above: done.

## Decisions & deviations (5–10 lines)
- A number still takes the Base's read: round, then clamp to 1–6, and warn when that changed it (`3.2` plays 3, `0` and `7` play 1 and 6). A string plays 1–6 only when it matches `^[1-6]$` exactly, so `"3.0"`, `" 3"` and `"7"` warn and play 1. Absent, `null` and `"match-sprite"` all play 1 and are not rewritten into each other.
- When k is 1, `litAt` returns `mid()` so the light is the same bits as G1, including a fractional `norm` anchor. When k is above 1 the light is the unscaled top-left plus `anchor + (fw/2 − ax, fh/2 − ay) · k`, which is where the art grows. Particle emitters stay on `mid()`: dots are not scaled art.
- Spread `u` is that byte divided by 255. Byte 0 is the low byte of `hash32(seed, "spread", i, 0)` (start), then x, y and size. A non-number plays 0; a value outside 0–0.8, 0–0.75 or 0–0.6 is clamped; both are flagged under the field name. The key is omitted at 0, so `particleRead({})` is unchanged. `start_spread` only delays the visible age; the bag's born time stays `start + p.at`, so pool order and ties do not move. Lite plays `ceil(count / 2)` after the per-effect cap.
- `world-scene.ts` is here because the scene used to drop the look on a squash, and the link bakes the whitened picture. `lookPixels` reads a `~sq` id through `squashed()` before the frame source. The draw list gives a look to a squashed sprite. A motion-atlas sprite still skips looks: looks are only on units, and units have no motion, so swaying scenery is unchanged.
- The unreachable `ui` dot band maps to `flash` (`DrawLayer` has no `ui`, and `placeStep` never emits it). No new cache: a spread is a hash of the existing seed, and nothing retained grows with frames. Changed lines are 116. The step's proto is 114, which is why this sits under the guide's 150 flag; the cap is 400. No file outside the step list, and no new dependency. `handback/` is this hand-back, not a product change.

## Next step (optional proposal)
- Item 14's `picture` on particles is still unread (G2). Outline on swaying scenery stays the D split (item 15b). Light colours `#rgb` and the strip-warning flood stay carried from G1.
