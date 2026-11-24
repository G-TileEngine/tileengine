# QA review: rebuild record step-08a (draft)

Draft: /workspace/share/rb8a/docs/rebuild/step-08a.md (sha256 79ec3a84, 1316 lines) and README.md (sha256 91f8aca4, 65 lines). Checked against main 10ca0b0a and merge a0c1dad2.

Verdict: **NOT OK, one wording fix in two places.** Everything else matches.

## Fix

The record labels the base and the head the wrong way round in L143–145 and in L235–236. It says "Against 10ca0b0a (current main) ... without ':!docs/**': 31 files, 408 insertions, 62 deletions". That number is the official command with HEAD at 10ca0b0a and the base at 9f7f7e52: `git diff --shortstat 9f7f7e52..10ca0b0a -- . ':!handback/**' ':!handoff/steps/tests/s8-autosave-links/**'` gives 31 files, +408/-62. Measured against 10ca0b0a as the base, the result would be empty. The fix is to write "At 10ca0b0a (current main) against 9f7f7e52" in both places.

## What matches

- The 30 appendix blocks (new files whole, edited files as diffs from 9f7f7e52 to a0c1dad2) match the merge byte for byte.
- The 30 blob-check rows match the git blob ids and line counts at a0c1dad2.
- The counts are right: 9f7f7e52..a0c1dad2 is 30 files, +377/-62; 5034dd7a..a0c1dad2 is 29 files, +294/-62, which is 356; the per-file numstat and caps in section (b) are right.
- The cites QA1 and QA2 land on the right lines: QA1:3, 8–9, 16–21, 19, 20, 24, 28–39, 33–35, 56–59, 63–70, 72–73, 75–80, 83 and QA2:3, 8, 9, 11–23, 13, 14, 15, 19, 20, 21, 22, 27, 28, 29. The spot-checked HB1:3, 42, 69 and HB2:4, 20–21, 42, 102 are right too.
- README differs from main only by the new Order row 20, and that row is correct.
- Attribution is clean: no choice by a bot is labelled as a CEO ruling.

Recheck: I read only L143–145 and L235–236 and the new sha.
