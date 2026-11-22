# Step 6d guide r2 — QA recheck

Guide: /workspace/share/s6d/step-06d-baseline-page.md r2, 111 lines, sha256 04bc1e26…61d0. Trial patch 75ca79ba. Prior review: docs/qa/step-06d-guide-review.md (27c5a8ee), two must-fixes.

1. One clock — done (L32, L49, L59). On c829fcb7, play-stage page.ts L28 builds env as `(cb) => requestAnimationFrame(cb)` (global looked up at call time), and raf-driver.ts L55/L66/L93 are the only rAF callers. The trial now has no own loop: patch L164/L170 keep `host` and wrap `window.requestAnimationFrame` before startMatch, cited to device-page/page.ts L43. There is no play-stage edit. Lock after DONE; play continues.
2. home.ts cite — done (L42). tools/maker/home.ts L54 is `document.body.append(canvas)`; the guide keeps prepend and gives the reason.

Other changed lines (L3 rev, L65 page cap row, L102-103 count 152 / smoke) are consistent with the r2 trial.

Verdict: **OK**. Builder go-line may be issued. Publish of baseline-06c/ still needs the CEO's typed OK.
