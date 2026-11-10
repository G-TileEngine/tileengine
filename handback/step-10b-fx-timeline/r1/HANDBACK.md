# Hand-back step-10b-fx-timeline r1
Step file: handoff/steps/step-10b-fx-timeline.md
Base commit: 2052df82ec483d08868319fa4d86c319dbae4d73     Head commit: 03904c577283fe0ff6938aa4aad078759e313bd9     Branch: step/step-10b-fx-timeline-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/fx-preset.ts
M	src/btf-adapters/src/index.ts
A	src/fx/order/effect.ts
M	src/fx/order/index.ts
A	src/fx/order/landing.ts
M	src/fx/order/options.ts
M	src/fx/order/read.ts
M	src/fx/order/types.ts
A	tests/fx/effect.test.ts
A	tests/fx/landing.test.ts
M	tests/fx/options.test.ts

## Green
npm test: 157/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The tap-cap notice (code fxOverCap) says "Taps past the cap are dropped and not played."
- Single and yank keep only bodies[0]. Bounce keeps tap order, drops taps past FX_FORMAT.maxTaps with that one notice, then drops a repeated id. Pierce and chain sort by max(|Δc|, |Δr|) from the caster, ties by input order, then the first id wins. A pierce distance that is not an integer in 1…flightTiles throws with the other bad shots.
- Cue ties keep build order: spawn, planFx's cues, layer cues by step, then strike, impact, pull, knock for each body. endMs is the larger of planFx's endMs and the latest cue at. An order with no steps (the reader never returns one) leaves hitAt at 0.
- A missing layerDelay entry is absent, the same as null. pickLanding walks column offset −1, 0, 1 and, inside that, row offset −1, 0, 1, skips the target, and for "four" skips corners. canLand runs once per candidate. The free tile with the smallest |Δc|+|Δr| from the piece wins; a tie keeps the first.
- planEffect reads only pierce_hit_timing, pierce_flight, impact_burst and reel_knock. It does not read order.raw or the single-value options. pickLanding does not read landing_across_seam. A flight length that fails the integer check throws before any cue; it is not filled in.
- Diff is 317 insertions and 4 deletions (321 changed lines) on the eleven named files. Under 355, and under ~335. No extra file. .dependency-cruiser.cjs and BUILD_GUIDE.md were not edited. npm run sim printed the base's two lines, unchanged.
- Drive names step-10b-fx-timeline-r1.bundle and HAND-BACK-step-10b-fx-timeline-r1.md were free, so this chat uploads those. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 10c can take look ramps, release and copies once their ease curves and spreads are inputs to the painter. Not built here.

## Kit files used
- handoff/steps/step-10b-fx-timeline.md (latest main) 09507b776ae95ec8ff99ccd4f8f341c068521a98a3135d3becb9e0b25d280a12
- docs/effect-order-from-docs.md (latest main) f9312b8369aea1cd8df498a800f6db9397dd26c00d94cba4d69a83da420788e5
- BUILD_GUIDE.md (latest main; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 2052df8) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
