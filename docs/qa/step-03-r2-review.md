# QA recheck: step-03-test r2

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch`. I used fresh `/tmp/q` worktrees and removed them afterwards. No GitHub writes.
- **Commits:** tip `806e5825` (tree `ed70eae0`), code head `ca9d603a` (tree `d0f7a15e`), base `fdf29002`.
- **Scope of this check:** the 5 must-fixes in `docs/qa/step-03-review.md` (e44de7a8) plus the gates.

## Verdict: NOT OK (2 small must-fixes, both in the smoke script or a screenshot; no product change)
All 5 product fixes pass, and green and the merge pass. Two gate items fail:
- The new s3 smoke check 3 is flaky.
- Shot 03 does not show Back to maker.

## Must-fixes 1–5
1. **PASS.**
   - `tools/maker/app.css` L2 is `.app[hidden] { display: none; }`.
   - s3 `touch-smoke.mjs` L31 records the Test box. L109–110 fail check 8 if `elementFromPoint` there is still `[data-act=test]`.
   - Live: `#app` is `display:none` during play and Back to maker is the top-left element. Back leaves 0 boards, the URL is cleared, and the heading is "My game".
2. **PASS.** `tools/maker/index.html` L4 has `<link rel="icon" href="data:,">` before `<title>`. 0 console errors live.
3. **PASS.**
   - `tools/play-stage/project.ts` L33–34 are byte-equal to base `fdf29002` L33–34 (`throw new Error("play: army")`). No hp/atk defaults are left.
   - `openProject` L59–65 has one `try` with the `docsToInput(docs)` probe (L63). The catch returns `{ docs: null, error: e.message }` and rethrows anything that is not an Error.
4. **PASS.**
   - **Sentences:** `src/editor/project/test-gate.ts` L11–12 hold the seed and army sentences. `playLine` is at L16.
   - **`tools/maker/test-launch.ts`:** L22 sends an open failure through `playLine` to the sheet. L23 calls `start` inside a try. L24 calls `showUrl` only after `start` returns.
   - **`tools/maker/home.ts`:** L43 appends the canvas, L45 calls `startMatch` inside the L44 `try`, and L46 sets `root.hidden = true` after it returns. L47 removes the canvas and rethrows on a throw.
   - **Live Empty Test:** the maker is still shown, there are 0 boards and the URL is unchanged. The sheet reads "This project has no unit roster yet, so it can't be played".
5. **PASS, except the 03 shot.**
   - **Tests:** `tests/tools/play-stage-source.test.ts` L31: the saved Demo has 0 canopy and 0 braziers, and `openProject(Empty)` gives `docs: null` with error `play: army`. L41 is `test-launch: Empty stays in the maker` and L49 is `test-launch: start throws, maker stays`, which also checks no URL push.
   - **s3 smoke:** `9 empty blocked` is ok at 390 and 360. The script is 129 lines.
   - **Shots 01/02/04:** byte-identical to r1. They are still valid, because r2 does not change how those screens render (`project.ts` and the sheet are untouched). A fresh 390 render differs only in font antialiasing.
   - **Shot 03 FAILS:** `r2/03-play-back.png` was taken while the "YOUR TURN" banner covered the top bar. Back to maker and Recentre are hidden, which contradicts HANDBACK L84 and guide L93. A live shot 2.5 s after Test shows Back to maker 114×48 at x 8.

## Gates
- **Green at the tip:** **1049/0**, 0 skipped, 0 cancelled, 0 todo (N = 8). Typecheck, lint, deps, check:state and check:law all exit 0.
- **Line gate (guide L86):** 266 + 33 = **299** ≤ 400. Counting the s3 smoke as well gives 395 + 33 = 428, but L55 gives the smoke its own 130 cap, and it is 129.
- **tokens.css:** unchanged since base, so it holds tokens only.
- **Stamp:** `node tools/maker/build.ts` gives **`4d2ee9e86927`** for maker and play-stage.
- **S0 smoke:** sha256 `d528795e…` is unedited. 14/14 ok and PASS on 7 of 7 runs under `/usr/bin/google-chrome`.
- **s3 smoke FAILS as a stable gate.**
  - `FAIL 3 attack @390: no attack` (the `#attack` box is null) on **3 of 17** r2 runs. Every other line, including 8 and 9, was always ok.
  - It is caused by the r2 smoke, not the product. r1 product with the favicon and CSS fixes passed 20 of 20 runs with the r1 smoke, but failed check 3 on 2 of 12 with the r2 smoke.
  - It is a race on the action button after the extra pre-Test step (the turn banner, see shot 03). In a scratch copy, waiting for `#attack` before reading its box gave **0 of 16** fails.
- **Parity, plants and carries:** seed 24301 parity is unchanged. P1/P2/P3, `play-stage-carries` (A, B and 8), `load.ts`, `build.ts`, `board.ts` and `match.ts` have no diff vs base. The only r1 addition there is the one-parser maker scan.
- **Scope and Law 12:** r2 touches only the fix files (and adds no new empty catch or silent default). Both new catches rethrow anything that is not an Error and return the message visibly.
- **Merge onto origin/main `21e630e1`:** clean, tree **`862ee3593f6547c8730526dc70ef6a858f7a08ef`**, and `docs/` equals main's. Green on it is 1049/0. S0 passes, and s3 passed 3 of 3 runs with 18/18.

## Must-fix for r3 (smoke script and one shot only)
1. `handoff/steps/tests/s3-test/touch-smoke.mjs` L52: before `const btn = await page.locator("#attack").boundingBox();`, add `await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 });` on the same line. The script stays at 129 lines. Then paste PASS lines from at least 3 runs.
2. Retake `handback/step-03-test/r<N>/03-play-back.png` after the turn banner clears, so Back to maker shows in the top bar.

## Non-blockers
- `handback/step-03-test/r1/` is still on the branch. It is harmless (not product, outside the gate).
- The r1 non-blockers still stand.
