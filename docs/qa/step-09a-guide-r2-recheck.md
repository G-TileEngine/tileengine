# QA recheck: step 09a guide r2 (EA)

Verdict: **OK. Go-line ready.** The r1 must-fix is resolved, and D29 is folded in correctly.

Kit: guide `step-09-art-backgrounds.md` (sha256 0de2c56f, 145 lines), paste `step-09-paste.md` (b1b7af4a), trial `s9-trial.patch` (c03df133). Base 8ab22996 (the D29 commit; docs-only over 236ad423).

## Trial, rerun by QA in a fresh worktree at 8ab22996 with `npm ci`
- The patch applies cleanly. Green exit 0, **1134 pass / 0 fail**. `tsc -p tools/tsconfig.json` shows only the 3 base errors.
- Count: 18 files, +309/-26 = **335**. Every per-file row matches the build table and is under its cap (caps sum to 396, hard gate 400).
- No diff under src/core, src/sim, src/types, src/rules, data, fixtures, behaviour-library, painter-proto or ui-shell. No existing test is edited. No new rAF, timer or loop.
- Tests 1-9 are present, named as the guide lists them.
- s9 on 8811: 12 ok, SMOKE PASS. Step 5 refuses Test and names the file (H4). Step 6 shows the note, draws 47 floor cells and counts failed 1, at both 390 and 360. s8: SMOKE PASS. S0 (d528795e): TOUCH SMOKE PASS. s8-audit: AUDIT PASS.

## r1 must-fix (Law 12)
Resolved. In page.ts, a null `art()` and a `createImageBitmap` rejection each throw a plain-words message. That message goes into the #note row and adds 1 to `stats.failed`. The catch rethrows, so it is not empty. `bare()` runs only when at least one layer drew, so the floor is never blank. The floor rule is EA's ruling.

## Non-blocking
- page.ts names its outer layer list `shown`, and the frame callback's `const shown = fitView(...)` hides that name. It works as written, but a builder may rename either one, inside the cap.
- The play-stage "missing" branch has no test of its own. It shares one handler with the won't-decode case, which step 6 covers. No test hook is needed for 9a.
- Main is now fe445cf (roadmap docs only). Base 8ab22996 stays valid.
- The 9b pixel cap (L134) and the queue-catch sentence (L57) are in.
