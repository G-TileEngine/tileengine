# QA recheck: step 8b stair baseline r2 (PR #98)

Verdict: **OK TO MERGE**, expect tree aacaa18e2d0e8e3b3d05f6764c74a34bae68702d onto main 5d2b30c9.

Tip 5b6e7b52 (tree 990d24d4), code head 38ee278c (tree 1e1bc50e), base ecd22d80. Recheck of step-08b-r1-review.md (4a4dc5aa).

- r1 tip dca1d1e6 to r2 tip: `tools/baseline/page.ts` +2/-2 and the new r2 HANDBACK only.
- Must-fix 1 closed: `travel` calls `arriveIn` first; on null docs it sets `read.textContent = got.error` and returns before the swap mark and the `#board`/`#hud` removal. Then it swaps and calls `startMatch`.
- Trailing newline restored.
- Fresh worktree with `npm ci`: green exit 0, 1125 pass / 0 fail; tsc shows only the 3 base errors.
- Count against ecd22d80: 8 files +65/-27 = 92, caps kept.
- HANDBACK r2 has the Code head label; no raw log or shots committed.
- `git merge-tree --write-tree origin/main 5b6e7b52` = aacaa18e (clean).

Next: postmerge on CoS's merge sha, then the docs/rebuild/step-08b record review. The stair phone check goes to the CEO through CoS after the merge.
