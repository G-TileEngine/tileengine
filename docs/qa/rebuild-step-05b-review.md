# QA review: rebuild record step-05b

**Verdict: NOT OK.** Four line fixes, all text-only. The appendix, blob table, facts, cites otherwise, traps and 5c carries are correct.

Record: `/workspace/share/rebuild-step-05b/docs/rebuild/step-05b.md`, 2025 lines, sha256 `ae5baac5…`, hash-object `0b4af0183b6854a4ba91f1f37209ea5b5ec0e8ff` (checked). Merge `c66760b7`: tree `09012d41`, parents `bfcf5504` and `4041779c`, committed 2026-11-20 17:59 (UK time). `origin/main` is `cb7f812a` (it adds only `docs/qa/step-05b-review.md`).

## Must-fix
1. **L15, postmerge placeholder.** Replace `RESULT _to be filled by QA_.` with: `QA postmerge PASS on merge c66760b7 (PR #88): parent2 = 4041779c, noreply ok, src/tests/tools diff equality ok, pins 5/5 unchanged, npm 1074/0, smoke 0 failed; main cb7f812a adds only docs/qa/step-05b-review.md.`
2. **L65, range end.** Change `` `stageFor` (`panel.ts:41-53`) `` to `` `stageFor` (`panel.ts:41-54`) ``. The closing brace is at L54.
3. **L67, range end.** Change `` `abilityView` (`ability-panel.ts:29-47`) `` to `` `abilityView` (`ability-panel.ts:29-48`) ``. The closing brace is at L48.
4. **L98.** Change “The five named / model tests” to “The four named / model tests”. N=4; the four cites already listed are the four tests.

Recheck only those four lines.

## The three 04b/04c traps
- **(a) Commit before diffing: OK.** L125 says to write the 18 product files, then `git add -A && git commit -m rebuild` on a rebuild branch, before any `0dc2c588..HEAD` diff.
- **(b) Final equality against the merge: OK.** L175 says `git diff c66760b7 HEAD --` over the 18 product paths must be empty, and the blob table is at `c66760b7`.
- **(c) G7 cite: OK.** L17 and L121 name `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123 (insertions plus deletions), and guide L94-95.

## Checked OK
- **Appendix (scripted):** all 28 blocks match the merge byte for byte. That is 18 full files against `git show c66760b7:<path>`, and 10 diff blocks against `git diff 0dc2c588 c66760b7`.
- **Blob table (L195-212):** all 18 blob ids and line counts match `c66760b7`. The set equals `git diff --name-only 0dc2c588 4041779c` without `handback/` and `docs/`. Product and test blobs also match r1 code head `4e58c390` (tree `537c3227`).
- **Facts:** these all match my reviews and the repo:
  - 1074/0 and N=4.
  - G7 350+44=394 at the code head, the r1 tip, and (with `':!docs/**'`) the merge. Without that exclusion the merge is 19 files, 1847+44. First parent added two docs files, 1497 insertions.
  - Trees `537c3227` / `88be3dbb` / `09012d41`. Predicted merge tree onto `bfcf5504` is `09012d41`.
  - r1 tip `4041779c` was OK TO MERGE (QA `7de831f5`, 34 lines). No second round.
  - Pins unchanged: S0 `d528795e` (blob `1f50845a`), golden `90dde42a`, parity seed 24301, s4c sha `d885c3e8…`. Stamp `d813576e8f59`. s5b smoke 84 lines.
  - HB `ab8805af` (190 lines). V1 sha256 `691aa9eb…` (40 lines). Guide r3b `2e2673e8` (sha256 `ce4ec011…`, 267 lines) on the merge, main, the base and the tip.
  - Postmerge PASS: parent2 = tip, pins 5/5, 1074/0, smoke 0 failed. Main moved one docs/qa commit to `cb7f812a`.
- **Cites:** every other `(doc:line)` I checked points at the line that says it, including HANDBACK, QA, guide L20, L33-37, L35-36, L87, L94-95, L152-194, L165-177, L179, L181, L185, L187, L190-194, L259, checklist L26/L67, `BUILD_GUIDE.md` L123, and the code range ends at `c66760b7` (`wired.ts` full, `index.ts` 6, `panel.ts` 9-13 / 22-40, `ability-panel.ts` 42-44 / 46, `units.ts` 99, `stage-sheets.ts` 7, `stage.ts` 32 / 36-42 / 45 / 102-103 / 149 / 151, `home.ts` 30 / 34 / 35 / 135 / 136-138, `test-launch.ts` 13 / 17 / 25, `page.ts` 14-15 / 57-74, `project.ts` 33-34 / 42, `app.css` 48, `wired.test.ts` 15-36, layout test 10-21, `ability-panel.test.ts` 18-38 / 39-42, `stage-place.test.ts` 53, and the named s5b smoke lines as written). The four quoted blocks (`WIRED`, `unitButtons`, `docAt`, `play: army`) match the merge bytes. `page.ts:57-74` includes the closing brace.
- **Attribution:** the record never labels a CoS, UX or builder choice as a CEO ruling. "Chief of Staff" appears as the verify-report source. The Empty `play: army` line is cited as guide L259.
- **Carries into 5c:** match the guide and QA:28-34. Empty still throws `play: army` at `project.ts:33-34` until a `unit-roster` setup exists; HB § Next step names only 5c; shot 02/03 captions overclaim controls below the fold; the occupied sheet keeps “A unit stands here” for frozen s4a check 4; the 4a/4b/4c carries, other than the retired `stage.ts:31` pin, remain open.
- **Shape:** follows `docs/rebuild/step-05a.md` (sections (a)–(f), non-blockers, blob table, appendix of new-full / edited-diff+full).
