# Hand-back step-10-fx-order r1
Step file: handoff/steps/step-10-fx-order.md
Base commit: a499d98b7413c233ee743428630f286f64b03c61     Head commit: a1ebb26a65bf61d69cbd470fef1b0477b6ab1a44     Branch: step/step-10-fx-order-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.dependency-cruiser.cjs
A	src/btf-adapters/src/fx-preset.ts
A	src/btf-adapters/src/index.ts
A	src/btf-adapters/src/lane-labels.ts
A	src/fx/order/index.ts
A	src/fx/order/options.ts
A	src/fx/order/read.ts
A	src/fx/order/timeline.ts
A	src/fx/order/types.ts
A	tests/btf-adapters/lane-labels.test.ts
A	tests/fx/options.test.ts
A	tests/fx/read.test.ts
A	tests/fx/timeline.test.ts
M	tests/runtime/input/gestures.test.ts

## Green
npm test: 144/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Notice messages (codes are the step's): fxBadBlock "Effect order block is not usable."; a clamped step "A step length was clamped."; a clamped connect "Connect was clamped."; a filled step "A step with no length was filled in."; a filled connect "A missing connect was filled in."; fxOverCap "Steps past the cap are kept and not played."; fxNotNumber "The hit amount is not a number."; fxOptionUnknown "Unknown effect-order option."; fxOptionInvalid "Effect-order option value is not allowed."; fxDocDiffers "This value follows a design doc, not current play." The fxOptionsNotObject message is the one the step quotes.
- readFxOptions walks Object.entries (own enumerable string keys, insertion order). A known key is Object.hasOwn on FX_OPTION_VALUES. The taken value is the allowed-list item that === the answer, so the option union is assigned without a cast. A non-plain json (null, array, primitive) returns the same base reference.
- minConnect 0.95 with the preset maxConnect 1 is inside 0 ≤ min ≤ max ≤ 1 and does not throw. The test that the step lists as minConnect 0.95 throws pairs it with maxConnect 0.5 (min > max). The other bad limits are single-field spreads of BTF_FX_READ_LIMITS: minStepMs 0, fillStepMs 100, fillStepMs 3001, maxConnect 2, minConnect NaN.
- A missing connect is 0.42 only when the last playing step's kind is "reel"; inactive steps are not consulted. An in-range connect is left as given (no notice). planFx on an empty step list, which the reader never returns, has no hit and endMs 0. Cue ties keep push order (each step, then the hit) via the original index.
- Lane ids use the step's formula, not a chosen default: 6 columns, 3 rows, id = c×3+r+1, column-major. At-0 cues call onCue immediately in plan order and are not passed to clock.after, because after(0) would wait one step.
- Diff is 345 insertions and 0 deletions (345 changed lines) across the fourteen named files: twelve added, .dependency-cruiser.cjs and tests/runtime/input/gestures.test.ts modified (3 insertions, 0 deletions). Under 390 and under ~370. No extra file. CN-007 is the one depcruise line; sha256 dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628. src/runtime/input and BUILD_GUIDE.md were not edited.
- Drive names step-10-fx-order-r1.bundle and HAND-BACK-step-10-fx-order-r1.md were already taken, so this chat uploads step-10-fx-order-r1-chatB.bundle and HAND-BACK-step-10-fx-order-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 10b can turn §A rules 3 and 8–18 into cue data on this same plan, and let pierce_hit_timing, chain_order and reel_knock act on those cues. Not built here.

## Kit files used
- handoff/steps/step-10-fx-order.md (latest main) 9e2ff1690b4e1e33259c104106db5588ca6186d8b491c4fc5e1d41390431771d
- handoff/change-notices/CN-007-fx-layer.md (latest main) e99d05095522ada5446f50b1dffd8259e1c7699a6e89c8da41002e35f849e984
- docs/effect-order-from-docs.md (latest main) f9312b8369aea1cd8df498a800f6db9397dd26c00d94cba4d69a83da420788e5
- BUILD_GUIDE.md (latest main; §3 is the CN-007 text; not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base a499d98) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
