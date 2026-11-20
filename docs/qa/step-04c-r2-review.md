# QA review: Step 4c r2 (rework round)

**Verdict: OK TO OPEN PR.** All 3 must-fixes from `step-04c-review.md` pass. The product and test code is the same as in r1.

Branch `step/step-04c-stages-maps-r2-chatA`, tip `43e146d9` (tree `2f2af33c`), code head `faa74a07` (tree `d140607f`). It is linear on the r1 tip `4c2f4cb8`, base `a85ae665`.

## Scope
- `git diff 73ac4720 faa74a07` changes only `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (+16/-12, now 73 lines) and brings in the r1 handback folder. From code head to tip, the only changes are the r2 `HANDBACK.md` and 6 shots. No product or test blob changed.

## Must-fixes
1. **PASS: ok lines pasted.** HB:36-54 pastes 16 ok lines and `SMOKE PASS`: checks 1-7 plus the new `8 targets`, at 390 and 360. This is byte-equal to the output of my own solo run 1.
2. **PASS: over-cap files named.** HB:82 is the requested line, word for word: "`src/editor/stage/resize.ts` is 63 lines against a 60 cap (...). `src/project/load/read-project.ts` is 4+/4- against a 3 cap (...). Total 394 ≤ 400."
3. **PASS: check 8 measures the open sheets.**
   - `open()` taps, waits for a mark element in the opened sheet, then runs `big()`. `drop()` runs `big()` with the `will go` list open.
   - Together they cover Add (`r:add`), every `r:menu:*`, Rename, Resize (steppers and Apply) and the drop list.
   - `check("8 targets @<width>")` prints at 390 and 360.
   - **Bite test** (worktree only, not committed): I gave `r:new` a 30 px height and the smoke failed with `FAIL 8 targets @390: r:new 358x30` and `@360: r:new 328x30`, exit 1. I did the same to `r:apply` and it failed the same way, at check 8 only. r1's end-of-step `big()` could not have caught either one.
   - The smoke has no `waitForTimeout`.

## Numbers (my own runs on a fresh worktree at the tip)
- `npm ci && npm run green` exits 0: 1065 tests, 1065 pass, 0 fail, 0 skipped. HB:21 states only `npm test` for this round, but I ran the full green.
- **G7:** a85ae665..code head and ..HEAD both give 9 files, **382+12=394**.
- **Smokes** (`/usr/bin/google-chrome`):
  - s4c solo 2/2 SMOKE PASS (16 ok each).
  - s4c under 8 CPU-burn loops 2/2 pass.
  - s4a 16 ok, s4b 16 ok.
  - S0 `d528795e` (unedited) 14/14.
- Golden is still `90dde42a`.
- **Merge tree:** onto `origin/main` `a98f1b79` it is clean and gives **`c72568ca`**, as predicted. The only difference from the branch tree is main's 5 docs (the 4b record and QA docs, and `step-04c-review.md`).

## Non-blockers
- All r1 non-blockers still stand: seed copy (for CoS/UX to confirm), raw format names in the drop list and rows, the unreachable `drops.ts` fallback, session-only map delete, and the 4a/4b carries.
- HB:34 still gives Chrome as `/usr/local/bin`. I re-ran with `/usr/bin`.
