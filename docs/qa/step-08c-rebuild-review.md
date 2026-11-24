# QA review: rebuild record step 8c

**Verdict: QA OK** for `docs/rebuild/step-08c.md` (299 lines, sha256 `75995d48…13bf`) and `docs/rebuild/README.md` (68 lines, sha256 `5f6cbc5b…c7`). QA, 2026-11-24 (UK time).

- README: the only change against main `dde07b67` is the new Order row 23.
- Counts re-run: 22 (2 files, +21/-1) at 96a50e04 against 02a0a9c5; 5 / 937 / 1 at the merge against 02a0a9c5; 3 / 54 / 1 at dde07b67 against 5aba5ef7; 3 / 66 / 1 without the smoke exclude. All match.
- Blob check: 3 of 3 blob ids and line counts match `cd48ebdc`. Appendix: 3 of 3 blocks are byte-identical to the merge. The files are exactly the product diff.
- QA cites match `docs/qa/step-08c-r1-review.md` on main.
- Non-blocking: L15 and L128 say QA's post-publish walk check is still outstanding. It has since PASSED (`docs/qa/baseline-08b-republish-postpublish.md`). An update is optional.
