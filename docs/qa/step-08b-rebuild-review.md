# QA review: rebuild record step 8b

Verdict: **OK TO PUSH.**

Files reviewed (CoS draft, /tmp/rebuild8b): `docs/rebuild/step-08b.md` (sha256 92393cc7, blob 4d671eb6, 472 lines) and `docs/rebuild/README.md` (sha256 e054e9b9, blob 7e3a8682, 66 lines).

- README: the only change from main is Order row 21 (step-08b.md, base ecd22d80, PR #98, merge 42cc84b4, 1125 tests).
- Appendix: all 8 "(edited)" fences are contained in `git diff ecd22d80 42cc84b4 -- <path>` (script check, 0 bad).
- Blob table: all 8 rows match `git rev-parse 42cc84b4:<path>` and the line counts.
- Count: `git diff --shortstat ecd22d80 5b6e7b52 -- . ':!handback/**'` and `git diff --shortstat 5d2b30c9 42cc84b4 -- . ':!handback/**' ':!docs/**'` are both 8 files +65/-27 = 92, as the record says. The per-file rows add up to that, and the page.ts note (r1 8/6, r2 7/5 after the newline) is right.
- Shas, trees, parents and the floor (1122 at the base, 1125 after the merge) match git.
- Attribution: the spill and bench rule is credited to EA, not to the CEO. No public or gh-pages claim is made on the CEO's behalf.
