# QA recheck: step-03-test r2 harness touch-up

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch`. I used a fresh `/tmp/q` worktree and removed it afterwards. No GitHub writes.
- **Commits:** tip `e9e5327d` (tree `055a910a`), code head `87508786` (tree `6cfc43f4`), previous tip `806e5825`.
- **Scope of this check:** only the 2 must-fixes in `docs/qa/step-03-r2-review.md`.

## Verdict: OK TO OPEN PR

## Must-fixes
1. **s3 smoke check 3 race: PASS.**
   - `806e5825..e9e5327d` touches only three files: `handback/step-03-test/r2/03-play-back.png`, `r2/HANDBACK.md` and `handoff/steps/tests/s3-test/touch-smoke.mjs`. No product files.
   - The code head `87508786` changes only the smoke, 1+/1−. L52 now starts with `await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 });` on the same line, and the file is still **129** lines.
   - Under `/usr/bin/google-chrome` the s3 smoke gave **12 of 12 PASS**, 18/18 ok each time (390 and 360) with no FAIL. Before the fix it failed 3 of 17 runs.
2. **Shot 03: PASS.** `r2/03-play-back.png` is 390×844. Back to maker and Recentre are visible in the top bar, the turn banner has cleared (only the "YOUR TURN" label shows), and no maker Test shows through.

## Gates
- **Green:** `npm ci && npm run green` exit 0, **1049/0**, 0 skipped.
- **S0 smoke:** sha256 `d528795e…` is unchanged. 14/14 ok, `TOUCH SMOKE PASS`.
- **Merge:** `git merge-tree --write-tree origin/main e9e5327d` against main `ff65f9452d7ebbdaf3c3d018eb0df6930e89e8b6` (tree `d232216f`) is clean, tree **`422e62aba489568c9c7df39c75cec3436657a5ae`**. `docs/` equals main's docs, including the CEO law/roadmap commits after `21e630e1`.

## Non-blockers
- These still stand from r1/r2: the r1 handback folder on the branch, and the earlier carries.
