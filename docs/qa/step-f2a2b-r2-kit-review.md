# QA: F2a2b r2 kit re-review (land on map). Verdict: OK TO SEND

QA & Build Guard, 2026-11-28 London. The one rework round after the r1 review (step-f2a2-kit-review.md 851c88d6).

## Inputs (sha256 checked)
- top SHA256SUMS 94bd8008 (128 entries, all OK); kit SHA256SUMS 2e431ece (sha256sum -c OK)
- guide step-f2a2b-land-on-map.md 4ed8d0ea; paste c2ccfa25; test ca0a98d8 (cmp with tests/tools OK)
- plants-f2a2b.py ef885411; f2a2b-trial.patch 1c165c9a; PUSH-LIST-f2a2b.md b674893c; SPLIT.md 857b8701
- F2a2a is unchanged: guide c8d29a83, paste 8bb3b29e, patch b6c9007a, kit SUMS 3913bad9
- main is fa401c88: ce848f57 plus the F2a2a docs commit only (no code)

## Trial (QA's own)
- F2a2a commit 3e430273 (tree 5687d21b), then `git am` of r2 patch: tree **3e180ff3**, matches EA. Counted 397 (cap 400).
- green 1204/0, check:law OK. tsc has only the 3 base errors (page.ts L101; home.ts L156 ×2).
- plants 27/27 caught. Smokes 25/25 PASS (23 smoke.mjs runs plus s0 and s3 touch-smoke, at 390 and 360).

## Must-fixes from r1
1. Law 12: travel now sets `state.banner = got.error` (L127), pinned in the test, plant P23. CLEARED.
2. Rule 8: the `stage:` block is fully braced, one statement per line. CLEARED.
3. Mock difference: Effects "10 built-in" is listed as Open point 9 for UX; game-menu.ts belongs to F2a2a. CLEARED (UX rules on the copy later).

## r1 non-blockers
- The counts now use `unitCount`/`effectCount`, the same `shown(bag, sess.hidden)`/`effectRows(bag)` lists the sheets draw (P27). Fixed.
- Continue clears only the "menu" view (P26). Fixed.
- No-stages screen and deleted-current-stage pins added (P24, P25). Fixed.
- SPLIT.md names corrected. Fixed.
- `state.problems` has no reader: carried in the guide. Accepted.

## New, non-blocking
- `unitCount`/`effectCount` return 0 when the project doesn't parse. That matches the sheets, which draw nothing then, and the parse error surfaces through the open path. Not a silent default, but if the menu ever shows on an unparsed project, show "–" instead of 0.

New r2 lines are Rule 8 clean. The travel edit sits inside an existing dense line and adds no statement.
F2a2b's base is the F2a2a merge, so push it only after the F2a2a postmerge passes.
