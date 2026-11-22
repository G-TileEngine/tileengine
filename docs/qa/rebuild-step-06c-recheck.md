# Rebuild record step-06c r2 — QA recheck

Record: /workspace/share/step-06c-record/docs/rebuild/step-06c.md, r2, 477 lines, sha256 64d77069d58458571ac4b210a66636dae4f377f3ecb1c904dc5f9fec79bc4d74.
Prior review: docs/qa/rebuild-step-06c-review.md (b000509c), six fixes.

| # | Fix | r2 line | Result |
|---|---|---|---|
| 1 | Floor cite (HB:14, V:21, QA:8) | L16 | done |
| 2 | s6c ×3 cite (V:23, HB:31) | L13 | done |
| 3 | checkpoint.test.ts:36-55 | L33 | done |
| 4 | Start from 68a67a56 / c89e39b6, not dd731459 | L144 | done |
| 5 | Write-then-commit paragraph before the (f) fence | L157 | done |
| 6 | Count cite (checklist L26, BUILD_GUIDE.md L123) | L152 | done |

The remaining dd731459 mentions (L5, L15) are correct post-merge references.

Verdict: **OK**. Push together with docs/qa/rebuild-step-06c-review.md.
