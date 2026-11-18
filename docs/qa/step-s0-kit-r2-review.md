# QA kit review: s0-play-input r2 (browser gate)

QA & Build Guard, 2026-11-18, Europe/London. Read-only. Kit `/workspace/tileengine/handoff/steps/s0-play-input.md` sha256 `0cef5880a32753fe0ff4e6503c9fe5960d0481efa0d2c203de9c486036e4e59f` (matches the expected hash). MS-00 unchanged, sha256 `e4e59a7a4f41b0cb9e30d456786d9c53571f9c557e5d86e0fd5c0795d3b5c2a2`. Base `501057027cc27321b631c40ed3ef7d5552ac792a`. Prior review: `docs/qa/step-s0-kit-review.md` sha256 `644ac2c51eb405c5753957fdcb2df5dabf987dd1752544c33cd66b3b25366536` (not edited). The 7th file is specified, not present in the tree; the builder is to write it. No edits to the kit, the spec, `handoff/`, or `/workspace/share`.

## Verdict: NOT OK TO SEND

One must-fix. r1 must-fix 1 (trusted events through `page.ts`, camera panned, 390 and 360, backing-store scale) is otherwise met. The test 5 clamp flag and the TP-4 carry are cleared as claimed.

### Must-fix

1. **The browser gate does not cover the full play sequence.** The specified `touch-smoke.mjs` does pinch, pan left, `moveTo` a knight+wolf (not a player walk), trusted-tap select, `#attack` + tap wolf, `#end`, and a 44 px / `#recentre` check, at 390 and 360. It never taps a reach cell to **move**, never taps `#talk` so a **Talk panel** opens, and never performs a **second action** (unit switch or move-then-act). Those remain only in the `createTouch` unit tests, which do not go through `page.ts` handlers or HUD buttons. Extend the smoke with a trusted-touch walk, Talk (panel visible, then Close), and a second action, still at both widths. Raise the 70-line smoke cap if needed; keep the seven-file total at or under 400.

### (1) Trusted events, sequence, fail on base

As specified, taps are `page.touchscreen.tap` and pinch/pan are CDP `Input.dispatchTouchEvent`; a capture-phase probe on `#board` requires `isTrusted === true`. Dev hooks are read/place only. Mapping is `k = canvas.width / rect.width` (never `devicePixelRatio`). That is real input through `page.ts` handlers.

The official file is not in the tree. A faithful temp copy (`/tmp/q/s0-touch-smoke-r2-on-base.mjs`) was run read-only against `/tmp/q/te-50105702` at `50105702` with `playwright-core@1.59.1` and `/usr/bin/google-chrome`. It **fails on the base**, as required. At 390: pinch grew `cam.s` 12→18 and `cam.y` hit 34; a 120 CSS px left drag grew `cam.x` by **120** (base pans in CSS px and does not clamp; kit expects `120·k/cam.s`, and headless `k` was 1, so 6.67) to `x ≈ 126`, past the map; a trusted tap then did not select the knight (`selected` null, no `pointerup` on the probe — the tap was off-canvas); `#attack` then timed out (button not shown with no selection). 360 was not reached after that stop. `TOUCH SMOKE FAIL`. The kit treats a timeout as a stop, so the builder's smoke would also go red on this base.

### (2) Pan direction is clamp-allowed at base

Yes, for the post-fix camera. A bottom-left pinch to `zoomAt`'s cap `ceil(6·dpr) = 18` against seated fit 12 (390) or 11 (360) gives art 65×110 (390) or 60×110 (360) inside the 96×144 map. `cam.y` clamps to `mapH − artH = 34`; `cam.x` starts near 0 (simulated 0.31). A 120 CSS px **left** drag is `+120·3/18 = +20` art px; the clamp maximum is 31 (390) or 36 (360), so +20 is allowed and `cam.y` stays 34. After the pan, `hit()` lands on the archer (1,8), on screen; the old cam-less maths lands on (0,6). This was simulated on the base modules (`zoomAt` + `clamp`) at both widths. Test 5's "exactly 20" and the smoke's `120·k/cam.s` agree when `k = 3`; in headless Chrome `k` is often 1 (P1-9 already noted this), which is why the smoke must use `k`, not `dpr`.

### (3) Floor 1023

Yes. Base `npm test` is 1014. N is 9 new unit tests in `tests/tools/touch-play.test.ts` (old test 10 became the smoke). Floor = 1014 + 9 = **1023**. The smoke is outside `npm test` and is correctly not counted; it is a separate handback gate (`TOUCH SMOKE PASS`).

### (4) Line cap

Yes, as written: 75+35+8+85+25+100+70 = **398** ≤ 400. The five tool caps shrink by 22 vs r1 to make room for the smoke. Flag: 70 lines is tight for a two-width Playwright gate with CDP pinch/pan (the P1-9 smoke is 117 lines; must-fix 1 may need a larger smoke cap).

### (5) Other r2 changes vs the r1 review

They hold up.

- **X4** now uses backing-store `kx/ky` (`canvas.width/rect.width`, `canvas.height/rect.height`) in `hit()` and pan, with `band()` falling back to `clientWidth·dpr` only before the first frame. `TouchBox` dropped `dpr` for `kx`/`ky`. This is the right fix for the r1 / P1-9 `k` vs `devicePixelRatio` gap (confirmed: the base run saw `k = 1` under emulated @3x).
- **Test 5** now names a clamp-allowed **left** drag, `cam.s === 18`, `cam.y === 34`, `cam.x` +20. The r1 vacuity flag is cleared (see (2)).
- **N 10→9.** Test 10's source grep is replaced by the smoke. `"constructor"` / `"__proto__"` safety moved into test 9.
- **Plant** added: using `devicePixelRatio` or dropping `cam` from the page box fails the browser gate at both widths (step 4).
- **TP-4** is carried as **S0b**, with the `match.ts:14,65,77,99` cites and the note that no `src/` change is needed, plus the side-wide `actionsPerTurn = 2` observation. This matches the r1 flag.
- Recentre is now `#recentre` (needed for the 44 px check).
- Header still says `Revision: r1` while the kit line is r2; the branch is still `step/s0-play-input-r1-chatA`. Cosmetic only.

### (6) Handback paste so QA can rerun

Yes. Acceptance requires `touch-smoke.mjs` to print `TOUCH SMOKE PASS` with every step's ok line at 390 and 360, **pasted in HANDBACK.md § Smoke**. The run command is fixed: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. "Who runs it" says the paste is required, and that CoS and QA rerun it at verify; a FAIL, a timeout, or no Chrome is a stop. Delivery also names § Smoke on the HANDBACK commit.

### Flags (not must-fixes)

- Smoke cap 70 is optimistic (see (4)).
- The official `touch-smoke.mjs` is not in the tree yet; fail-on-base was shown with a temp copy.
- Header `Revision: r1` vs kit r2.
- Existing r1 flags that still stand: Talk portrait not in R5/R7; `done` is a play-stage `Set`, not the engine budget; no dedicated post-walk `tickCam` unit test (the smoke pans, then `moveTo`, rather than walking and following).

Evidence: `/tmp/q/s0-touch-smoke-r2-on-base.mjs` against `/tmp/q/te-50105702`; test 5 simulated on the base `zoomAt`/`clamp` at 390 and 360.
