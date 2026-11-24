# QA review: rebuild record step 9a

**Verdict: QA OK** for `docs/rebuild/step-09a.md` (903 lines, sha256 `f51aeaf5…01f3`) and `docs/rebuild/README.md` (67 lines, sha256 `a69a210e…eb46`). QA, 2026-11-24 (UK time).

- README: the only change against main `02a0a9c5` is the new Order row 22 (step-09a.md, guide, base `6e9d624f`, PR #99, merge `ab64d4fb`, 1134 tests).
- Counts re-run: 289 (18 files, +261/-28) at the merge against `acdbf3f1`; 21 files / 378 / 28 at the merge against `6e9d624f`; 22 files / 424 / 28 at `02a0a9c5` against `6e9d624f`; 289 with `:!docs/**`. All match the record.
- Floor: guide L9 is 1125 + 9 = 1134, matching the record's (a) table.
- Smoke shas: s9 `7f8c6b19` at `f1fe4d14`; s8 `0de37442` (44 lines on base) and S0 `d528795e` unchanged.
- Blob check table: all 18 blob ids and line counts match `ab64d4fb`.
- Appendix: all 18 blocks are byte-identical to `git show ab64d4fb:<path>` (new) or `git diff 6e9d624f ab64d4fb -- <path>` (edited). The 18 files are exactly the product diff.
- Cites: every QA:n cite matches `docs/qa/step-09a-r1-review.md` on main. HB cites checked (32–52, 35–39, 52, 54–69, 109, 129, 139) match the HANDBACK at `ab64d4fb`.
- Non-blocking: L57 cites QA:13 for the nine named tests. QA:13 gives only 1134/0. V and guide L82–94 already carry the names, so no change is needed.
