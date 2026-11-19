# QA handback review: step-03-test r1

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch`. I used fresh `/tmp/q` worktrees and removed them afterwards. No GitHub writes.
- **Branch:** `step/step-03-test-r1-chatA`.
- **Commits:** tip `1ecea83dc15635d937b8b75ffad1bd48da0b3b3d` (tree `a2d1c123`), code head `24650f3d` (tree `1d2023e7`), base `fdf29002` (the PR #80 merge).
- **Guide:** step-03 r9 on main `517b4d4d` (blob `58c77102`, sha256 `0b858555…`).
- **CoS report:** `/workspace/share/step03-verify/report.md` was read and its key claims re-run.

## Verdict: NOT OK (one r2, must-fixes 1–5 below)

## Re-run
- **Green at the tip:** `npm ci && npm run green` exit 0, **1047/0** (tests 1047, fail 0, cancelled 0, skipped 0, todo 0). Floor 1041 + **N = 6**. check:state and check:law OK.
- **Line gate** (L86's command): 14 files, 232 + 32 = **264** ≤ 400. The s3 smoke script is **117** lines ≤ 130.
- **Stamp:** `node tools/maker/build.ts` gives **`6c319159a313`**, with `play-stage/6c319159a313/index.html` beside the maker.
- **S0 smoke:** sha256 `d528795e…` is unchanged. It prints **7 ok at 390 and 7 at 360**, then PASS, under `/usr/bin/google-chrome`.
- **s3 smoke under google-chrome:** **FAIL (1)**. 15 of 16 lines are ok. `7 buttons @390` fails with a 404 in `errs`.
- **Merge result:** `git merge-tree --write-tree origin/main(517b4d4d) 1ecea83d` is clean, tree **`7ccc03f3`**. `docs/` equals main's docs (step-03 blob `58c77102`). Green on that tree is **1047/0**. S0 gives 14/14 and PASS. s3 gives the same single favicon FAIL.

## Ruling: the s3 smoke favicon 404
- The smoke fails on any console error or page error, not only on 404s. `touch-smoke.mjs` L27 pushes every `console` error, and L104 fails `7 buttons` when `errs` is not empty. S0 has the same rule (L26/L100). That strictness is right, so keep it.
- The 404 is `/favicon.ico`. google-chrome requests it on the first page, and `tools/maker/index.html` names no icon.
- I tested the product fix in a scratch copy: adding `<link rel="icon" href="data:,">` to `tools/maker/index.html` L4. The s3 smoke then printed **16 ok and PASS, twice**. The maker-law, maker-build and project-home tests still pass.
- This fix is in scope, because index.html is step 2/3 maker product. Do **not** add a favicon exemption to the smoke.

## Ruling: the Empty-template Test blocker (CoS), plus a second blocker found live
I reproduced it live at 390×844 on a release build.
- **(A) The maker is never actually hidden.**
  - `tools/maker/app.css` L1 sets `.app { … display: flex }`, which overrides the `hidden` attribute. Measured on `#app`: `hidden=true` but `display: flex`.
  - During Demo Test, the maker's Test button stays live under the board at y 768–824. The builder's own `03-play-back.png` shows it.
  - Tapping it mid-match started a **second match**: 2 `#board`, 2 Back buttons and 2 drivers. That breaks one clock/rAF and no dead buttons.
  - After Back, an orphan `#board` stayed on the page.
  - With `.app[hidden] { display: none; }` added in a scratch copy, the round trip was clean: 1 board, Back left 0 boards, 0 console errors.
- **(B) CoS's case, confirmed once (A) is fixed.**
  - Setup: Empty template, Create, Test. `testGate` allows it and `enterPlay` hides the maker. Then `docsToInput` throws `play: seed`.
  - The banner paints on the hidden maker, and the user sees a blank canvas with no Back.
  - The URL is left at `?project=…&stage=stage_01JDEM…03`, so a reload repeats it.
  - Without (A) fixed, the user sees only the raw text "play: seed".
- **Law 12 finding.** To let `openProject(Empty)` return looks for the L87 test, the builder replaced `throw "play: army"` with `hp0/atk0 = 1` when the unit-roster is missing (`tools/play-stage/project.ts` L33–34). That is a silent default and must go. It is also outside L48's "No other change".
- **Choice between the two options: (b), not (a).**
  - Against (a): the Empty template has no roster, no units and a 1×1 map. A seed alone would not make it playable, and templates are not in the r9 file table (step 2 owns them).
  - For (b): it fits L68 (a sheet in words, Test stays closed), L79 (show the failure) and no dead buttons.
  - Use `docsToInput` itself as the readiness check, so the gate can never disagree with it.

## Must-fix for r2 (complete list)
1. `tools/maker/app.css` L1: add the line `.app[hidden] { display: none; }` after it. In `handoff/steps/tests/s3-test/touch-smoke.mjs` check 8, also assert that while in play, `document.elementFromPoint` at the maker Test box is not the maker's Test button.
2. `tools/maker/index.html` L4: add `<link rel="icon" href="data:,">` before `<title>`. The smoke stays strict.
3. `tools/play-stage/project.ts`:
   - L33–34: restore base L33 (`if (army === undefined) throw new Error("play: army");`) and drop both `army === undefined ? 1 :` defaults.
   - `openProject` (L58–62): build `docs`, then call `docsToInput(docs)` as the readiness probe inside one `try`. Return `{ docs, error }` on success, or `{ docs: null, error: e.message }` on a throw. Never return a silent fallback.
4. Launch order and wording:
   - **Sentences:** `src/editor/project/test-gate.ts` gets `"play: seed"` → "Stage 1 has no seed yet, so it can't be played" and `"play: army"` → "This project has no unit roster yet, so it can't be played". `tools/maker/test-launch.ts` L22 maps `opened.error` through them, so they show in the Can't-play-yet sheet, not the banner.
   - **test-launch.ts L23:** call `input.start` first. If it throws, return `fail([sentence])`. Call `showUrl` only after `start` returns.
   - **`tools/maker/home.ts` L42–44 `enterPlay`:** append the canvas, run `startMatch`, and set `root.hidden = true` only after it returns. On a throw, remove the canvas and rethrow.
5. Tests (N becomes 8, floor 1041 + 8 = **1049**):
   - **R-E1 test** (`tests/tools/play-stage-source.test.ts` L31–33): with fix 3, Empty can't open. Assert zero canopy and braziers on `openProject` of the saved Demo template (`data/templates/demo.tileproj`, a non-bundled project). Also assert `openProject(Empty)` gives `docs: null` and `play: army`. This is QA's reading of L87's intent ("openProject never adds DEMO_LOOKS"). UX should align L87's wording in the next docs pass.
   - **New test `test-launch: Empty stays in the maker`:** `launchTest` on the Empty template returns ok false with the roster sentence, and `start` is never called.
   - **New test `test-launch: start throws, maker stays`:** a `start` that throws `play: seed` gives ok false with the seed sentence and no URL push.
   - **s3 smoke:** add `9 empty blocked @390/@360`. Steps: New, Empty, Create, Test. Assert `#app` is displayed, there is no `#board`, the sheet shows the sentence, and Test is still present. Stay at or under 130 lines.
   - **Screenshots:** retake `03-play-back.png` (the current one shows the maker's Test under the board) and the other three shots at r2. Paste google-chrome PASS lines for both smokes.

## Other checks: pass
- **Done-when:** L86 passes (gates, line count). L87 is met only through the Law 12 default, so it is covered by fix 5. L88 passes. L89 fails at r1 (fixes 1–2). L91 passes (Demo round trip and Back land on "My game" with the URL cleared). L92 fails on 03 (fix 5). L93 passes: four 390×844 shots are present.
- **Carries:**
  - L33: `RECIPES` is frozen and its only use is the read in `recipeOf`.
  - L48 R-E1: `DEMO_LOOKS` is only in `openBundled`. The smoke shows 0 canopy and 0 braziers on a Demo-template Test.
  - `?project=` with a missing id shows "Can't open: no project …" with Back to maker, 0 boards and no fixture (live).
  - The OPFS refusal still shows the typed sentence with no buttons (live). The DOM-level OPFS test is not owned by r9, so it stays an open carry.
- **Build law:**
  - Still one rAF: the counts are unchanged in every file.
  - UNIT/TILE are untouched.
  - The only Law 12 finding is fix 3.
  - Law 13: nothing grows.
  - No game rules were added to engine or maker.
  - One parser: the P2 scan is unchanged, and the new maker scan allows 1 `JSON.parse`, in `project-files.ts`.
  - No `tools/play-stage` file imports maker.
  - Targets: Back to maker 114×48, recentre 48×48, menu 48×48, end 72×48, Test 56 tall.
  - P1/P3 and maker-law are intact, and only additive.
  - Parity 24301 is unchanged.
  - `.row` is dropped, and Test is enabled with the primary style.
- **Export audit** (release `6c319159a313`): neither bundle has `__play`, `__docs`, `dev-only` or `DEV =`. The play-stage bundle has no `tools/maker` or `src/editor` files.
- **HANDBACK folder:** `handback/step-03-test/r1/` uses the full step id.

## Non-blockers
1. The maker bundle ships `fixtures/demo.tileproj` (16 files). They come in through `project.ts`'s static imports for `openBundled`. They can't be reached: the maker never calls `openBundled`, and the plant guards that. Carry: move the bundled demo into its own play-stage module in a later step.
2. The step 2 carries stay open: the Effect Designer code in the maker bundle, and the OPFS DOM test.
3. On the missing-project screen, Back goes Home but leaves `?project=` in the URL, so a reload shows the error again. Clearing the query is a good idea.
4. `test-launch.ts` runs `readProject` twice (the gate, then `openProject`). It is the same single parser, so this is acceptable.
5. These are accepted: the HANDBACK's "PR: opened by Chief Of Staff" boilerplate, guide L7 still saying TBD, and the per-file cap overruns, which are explained.
