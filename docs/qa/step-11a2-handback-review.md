# QA review: step 11a2 handback (r4 guide, ChatA r1)
Reviewer: QA & Build Guard, 2026-11-26 (London). PR #108, branch `step/step-11a2-ready-sheet-r1-chatA`. Tip `826b9f78571e4b3126dd635a828af6d28accd505` (tree `3dd9e217`), docs-only HANDBACK. Code head `b7f6e5007b7c28f6de6b07e5e1399f26a22c8c1a` (tree `28e1aafb`). Base `1b34e541`. Guide `docs/maker/steps/step-11a2-ready-sheet.md` r4 (10e409e0, 143 lines). CoS verify report sha256 `10887838…a8a0`.

**Verdict: OK TO MERGE.** Expected merge tree onto main `761f36a7`: `3b5e217256ae4883f1640a9c4bcfa60b1aef4351` (my `git merge-tree` matches CoS's). Floor 1167.

## What I ran (my own worktree on the tip, clean `npm ci`)
- Green exit 0, 1167 pass, 0 fail. Tools tsc: only the 3 base errors (effect-designer page.ts L101, home.ts L91 twice).
- All 23 smokes solo, each exit 0 at the guide counts (s11a2 6 ok at 8822, s11a 6 ok at 8818). No flake this run (s3 and s8c passed first time). Export audit (`s8-audit`) PASS 135/149/149.
- Count 127+ 15− = 142/400, only the 6 Build-table files: build-sheet.ts 9/14, home.ts 33+ 6− = 39/40, game.ts 9+ 7− = 16/20, export-11a.test.ts 2+ 2− = 4/4, sheet-11a2.test.ts 15/20, smoke 59/60. Tip adds only the HANDBACK. Commits as G-TileEngine; no token in the tree.
- New lines in home.ts, build-sheet.ts and the sheet test are one statement per line; no join or pack. export-11a.test.ts changes only L61's name and L103's regex.
- My mutations on the code head (s11a2 on a spare port, plus the sheet and 11a tests):
  - M31 `built = null;` removed: caught (smoke 2 fails at 390 and 360). The r3 must-fix is pinned.
  - M16 Share always shown: caught (test 1, smoke 1–3).
  - M24 AbortError not ignored: caught (smoke 3, both widths).
  - M25 refused share swallowed: caught (smoke 3, both widths).
  - Restored tree: s11a2 SMOKE PASS.
- 11b r3 patch (`s11b-trial-r3.patch`, b5e44f3b) passes `git apply --check` on the expected merge tree `3b5e2172`.

## The points CoS asked me to check
- **M26 and M27 survive by design** under EA ruling 6, which I accepted in the r3 review. Still accepted.
- **M30 survives as an equivalent mutant.** With `raw` undefined, the commit regex fails and the same `Can't build: build.json` throws. Accepted.
- **build-sheet.ts reset by an earlier mutate draft.** The committed file matches Rule 1 (BuildSheet, literal-entity `esc`, shared `sheet()`, Share only when `share` is true), named tests 1–2 pass on it, and my mutations above were run on the committed code, not ChatA's. No gap left.

## Differences from EA's trial (no fail)
ChatA wrote its own code, so the code head is not byte-identical to the r4 trial. Behaviour matches the rules:
- The smoke delays or 404s `build.json` in its own server (`hold`) instead of the trial's routing. It still checks the sheet is gone and Building… is disabled within 1 s of Try again, which is what catches M31.
- The smoke's `tap` looks inside an open scrim first, because Try again and Build game share `data-act="build"`. Declared in § Decisions.
- `shareBuild` adds `if (navigator.share === undefined) throw new Error("Couldn't share your game.");` inside the `try`, so a missing share opens the error sheet with EA ruling 5's fallback line. Not in Rule 2, but declared, not silent (Law 12 holds) and within the cap. Nit only: Share is shown only when `canShare` is true, so this line is unreachable in practice and untested.

## Carries (none blocks the merge)
1. The CEO phone check should include one real download in Chrome on Android (11a carry 3) and one real Share sheet, which headless runs can't show.
2. Open from 11a: `gameZip`'s regex second read of `build.json` (step 36); the save-fail stop pinned only by a source regex.
3. Open from 11b r2: `zipCommit`'s "names no commit" throw is untested.
4. s8c "no hero" @390 flake seen in earlier full runs; not seen here.

## Helpers
None. Review, the 23-smoke run, the audit and the mutations were done by me in `/workspace/q-11a2hb` and `/workspace/q-11a2m`.
