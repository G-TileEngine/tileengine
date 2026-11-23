# QA review: rebuild record docs/rebuild/step-07.md

QA & Build Guard, 2026-11-23 GMT. Record r1: /workspace/share/step-07-rebuild/docs/rebuild/step-07.md, 1071 lines, sha256 b9822dac. Product checked at merge 24ab0250.

**Verdict: NOT OK, with one must-fix.**

1. **L190, count cite.** The count line must cite the gate rule, as the 6d record does at L160. After "Count insertions plus deletions", add "(checklist L26, BUILD_GUIDE.md L123)".

Checked and OK:
- **Blob table:** all 19 rows match `git ls-tree` blob ids and line counts at 24ab0250.
- **Appendix:** all 19 blocks byte-match. The 4 new files match `git show 24ab0250:<path>`, and the 15 edits match `git diff 33538c89 24ab0250 -- <path>`.
- **Start commit:** the start is the pre-merge base 33538c89 (L182, L195), not 771b98ae or 24ab0250.
- **(f):** the write-then-commit paragraph is present (L195).
- **Product cites:** match.ts:80, project.ts:94 and :102, page.ts:60, stage-links.test.ts:46 and :56-57, session links.ts:8-10, units.ts:41, world.ts:59, board.ts L95 and raf-driver dispose() L97-101 (src/runtime/host/raf-driver.ts).
- **HB cites:** 3, 32, 49, 64, 97-108, 120 and 124-131.
- **V cites:** 3, 5, 6, 20-23 and 27-29 (V is 55 lines, sha256 8995d3fd).
- **QA cites:** 5, 7, 8-13 and 16-19 (QA is 19 lines, sha256 b1ce4442).
- **Carries:** the four carries are recorded with correct homes. No CoS, EA, DSK or builder choice is labelled a CEO ruling.
