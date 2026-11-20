# QA review: rebuild record step-05a

**Verdict: OK.** The appendix, blob table, facts, cites, traps and 5b carries are correct. No line fixes.

Record: `/workspace/share/rebuild-step-05a/docs/rebuild/step-05a.md`, 1468 lines, sha256 `37ca2be0…`, hash-object `861fd8da6e66e08334634003a06acde6cb38890f` (checked). Merge `b8c1084e`: tree `f902afa3`, parents `9e921760` and `6eca1f52`, committed 2026-11-20 15:27 (UK time). `origin/main` is `0dc2c588` (it adds only `docs/qa/step-05a-r2-recheck.md`).

## The three 04b/04c traps
- **(a) Commit before diffing: OK.** L129 says to write the 15 product files, then `git add -A && git commit -m rebuild` on a rebuild branch, before any `37f42de3..HEAD` diff.
- **(b) Final equality against the merge: OK.** L176 says `git diff b8c1084e HEAD --` over the 15 product paths must be empty, and the blob table is at `b8c1084e`.
- **(c) G7 cite: OK.** L19 and L126 name `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123 (insertions plus deletions), and guide L94-95.

## Checked OK
- **Appendix (scripted):** all 23 blocks match the merge byte for byte. That is 15 full files against `git show b8c1084e:<path>`, and 8 diff blocks against `git diff 37f42de3 b8c1084e`.
- **Blob table (L198-214):** all 15 blob ids and line counts match `b8c1084e`. The set equals `git diff --name-only 37f42de3 6eca1f52` without `handback/` and `docs/`. Product and test blobs also match r1 code head `aeedd130` (tree `f7f224a6`).
- **Facts:** these all match my reviews and the repo:
  - 1070/0 and N=5.
  - G7 338+20=358 at the code head, the r1 tip, the r2 tip, and (with `':!docs/**'`) the merge. Without that exclusion the merge is 22 files, 409+21. First parent added ten docs files, 71+1.
  - Trees `f7f224a6` / `f69b943e` / `212657a3` / `f902afa3`. Predicted merge tree onto `9e921760` is `f902afa3`.
  - r1 tip `266a35df` was NOT OK (QA1 `3a7f88d5`, 42 lines). r2 tip `6eca1f52` was OK TO MERGE (QA2 `14723f42`, 11 lines). r2 is HANDBACK 4+/4− plus the five raw logs deleted (6536).
  - The s4c edit is L27 and L48 only, `ea0d674f…` → `d885c3e8…` (blob `70f45c02`).
  - Pins unchanged: S0 `d528795e` (blob `1f50845a`), golden `90dde42a`, parity seed 24301. Stamp `1a9756512a29`. s5a smoke 74 lines, s4c 73.
  - HB1 `dc94b3d5` (156 lines) and HB2 `5b049da4` (156 lines). V1 sha256 `0bb61177…` (39 lines). Guide r3b `2e2673e8` (sha256 `ce4ec011…`, 267 lines); the base and the 5a branch still had r2 `015ef02b`, which differs only at L249.
  - Postmerge PASS: parent2 = tip, pins 5/5, 1070/0, smoke 0 failed. Main moved one docs/qa commit to `0dc2c588`.
- **Cites:** every `(doc:line)` I checked points at the line that says it, including HANDBACK (HB1/HB2), QA1/QA2, guide L20, L33-37, L35-36, L74-85, L94-95, L99-148, L103-125, L127, L129, L137 and L141-145, checklist L26/L67, `BUILD_GUIDE.md` L123, and the code range ends at `b8c1084e` (`units.ts` 6-37, `widgets.ts` 5-27, maker `units.ts` 48-57 / 73-84 / 93-111 / 116-162 / 140-144, `home.ts` 20 / 34 / 80-94 / 85-92 / 117 / 122, `rooms.ts` 41-46 and 86, `project.ts` 3/9, `app.css` 47, `stage.ts` 31 and 35-41, `stage-place.test.ts` 53, and the named test and s5a smoke lines as written). The three quoted blocks (`usedBy`, `who`/`say`, `docAt`) match the merge bytes. Range ends include the closing braces.
- **Attribution:** the record never labels a CoS, UX or builder choice as a CEO ruling. "Chief of Staff" appears as the verify-report source and as the quoted r1 PR boilerplate.
- **Carries into 5b:** match the guide and HB2:156. Test stays off the unit editor until 5b adds the unit sheet, the ability list and the panel; Empty still throws `play: army` until a `unit-roster` setup; the s4c after hash `d885c3e8…` is the 5b/5c/post-merge reference (guide L85); the 4a/4b/4c carries, including the unmoved `stage.ts:31` pin, remain open.
- **Shape:** follows `docs/rebuild/step-04c.md` (sections (a)–(f), non-blockers, blob table, appendix of new-full / edited-diff+full). `step-02.md` is the same skeleton with a larger appendix.

Note: L17 records postmerge PASS and that main moved to `0dc2c588`, but does not say the script's "1 warning (main moved 1 docs commit)". Not a fix; those facts are already in that cell.
