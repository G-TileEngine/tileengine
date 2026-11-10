# Hand-back step-10c-fx-look r1
Step file: handoff/steps/step-10c-fx-look.md
Base commit: 1565a0f40722ef9fe8d181d5641bee2acb682e70     Head commit: 01831e682a67713b932bae932e2fedbd506f1d1e     Branch: step/step-10c-fx-look-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/fx-preset.ts
M	src/btf-adapters/src/index.ts
M	src/fx/order/index.ts
A	src/fx/order/look.ts
M	src/fx/order/read.ts
M	src/fx/order/types.ts
A	tests/fx/look.test.ts

## Green
npm test: 161/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- fxFilled for a row or spin whose count is not an integer says "A copy count was filled in." fxClamped says "A copy count was clamped.", "A copy spread was clamped.", "A look scale was clamped.", "A look glow was clamped.", or "A look fade was clamped." Per playing step the order is count fill, count clamp, then spread, scale, glow, fade. One notice per group even when both ramp ends move or all three spread fields move.
- Spread jitter, delay and size clamp to [0, their max], the same floor as clamp(delay, 0, delayMax). A spread over its max is one notice even on a step that does not apply spread. The carried count starts at 1. A playing step with no style throws RangeError "planLook: style missing"; the reader always pairs styles with steps.
- The copy-hash fraction is x % 1, plus one when that is negative. No Math.floor. Lane 0 is dc, 1 is dr, 2 is lag, and tune.scaleLane is size. Jitter 0 stores +0, not minus zero.
- When the clamped delay is 1, local u is 1 if raw is past the lag or raw is at least 1, otherwise 0. That is the limit of (raw - lag) / (1 - delay), so raw 1 still finishes at 1, including a unit of 1. Delay 0 returns raw unclamped, as specified.
- The §A11 orbit is 0.4 s so the lock-on straight starts at 400 ms. Release is the stored value only when the index is past the first step and the style carries; otherwise it is together. Split does not change startMs.
- planLook does not read order.raw. Loop and speed are ignored. endMs is the sum of the playing steps' ms. No new FxOptions key. No Change Notice. BUILD_GUIDE.md and .dependency-cruiser.cjs were not edited.
- Diff is 355 insertions and 6 deletions (361 changed lines) on the seven named files. look.ts is 117 lines and look.test.ts is 115. Under 382. No extra file.
- Drive already had step-10c-fx-look-r1.bundle and HAND-BACK-step-10c-fx-look-r1.md, which this chat did not upload. This chat uploads step-10c-fx-look-r1-chatB.bundle and HAND-BACK-step-10c-fx-look-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- The FX painter can draw from planLook, lookAt and copyAt on the render phase of the same clock, including the split curve and the colour mix. Not built here.

## Kit files used
- handoff/steps/step-10c-fx-look.md (latest main) 5c5038e7d40b0a1df2b950b55a10bb413c9640af54bd72446fd527ee2bbce31d
- docs/effect-order-from-docs.md (base 1565a0f) f9312b8369aea1cd8df498a800f6db9397dd26c00d94cba4d69a83da420788e5
- BUILD_GUIDE.md (base 1565a0f; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base 1565a0f) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
