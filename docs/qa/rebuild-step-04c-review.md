# QA review: rebuild record step-04c

**Verdict: NOT OK. 1 must-fix (trap b) plus 5 small line fixes, all text-only.** The appendix, blob table, facts and rebuild results are correct.

Record: `/workspace/share/rebuild-step-04c/docs/rebuild/step-04c.md`, 1121 lines, sha256 `e51b280b…`, hash-object `a014dddeb723c7b1330fa7c4d5d7ce4de9a875ed` (checked). Merge `9bbd115a`: tree `c72568ca`, parents `a98f1b79` and `43e146d9`, committed 2026-11-20 02:48 (UK time). `origin/main` is `a6538ee1` (it adds only `docs/qa/step-04c-r2-review.md`).

## The three 04b traps
- **(a) Commit before diffing: OK.** L136 says to write the 10 files, then `git add -A && git commit -m rebuild` on a rebuild branch, before any `a85ae665..HEAD` diff.
- **(b) Final equality against the merge: FAIL.** L174 says "`git diff a85ae665 HEAD -- <10 paths>` must be empty". On my committed rebuild that prints 10 files, 455 insertions, 12 deletions. **Fix:** at L174, change `git diff a85ae665 HEAD --` to `git diff 9bbd115a HEAD --`, keeping the same paths. I ran it, and it is empty. It is also empty for the whole tree outside `docs/` and `handback/`.
- **(c) G7 cite: OK.** L19 names `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123 (insertions plus deletions), and guide L340 "as in 4a" L166 with the s4c smoke dir. L131 repeats this.

## Small line fixes
1. **L62, range ends.** Change `` (`rooms.ts:28-35`) `` to `` (`rooms.ts:28-36`) ``, and `` (`rooms.ts:37-38`) `` to `` (`rooms.ts:37-39`) ``. The closing braces of `addStage` and `renameDoc` are at L36 and L39.
2. **L60, range end.** Change `` `deleteStage` (`rooms.ts:40-45`) `` to `` `deleteStage` (`rooms.ts:40-46`) `` (the closing brace is at L46).
3. **L80, range end.** Change `` `tools/maker/rooms.ts:41-44` `` to `` `tools/maker/rooms.ts:41-45` ``. The quoted `say` block has 5 lines, and its `}` is at L45.
4. **L92, range end.** Change `` (`rooms.ts:92-134`) `` to `` (`rooms.ts:92-136`) ``. `roomClick` ends with `return kept(host, null);` at L135 and `}` at L136.
5. **L17, add the postmerge result.** The record does not mention it. Append to the "After the merge" cell: "Postmerge (`cos-tools/qa-postmerge.sh 9bbd115a 43e146d9`): RESULT PASS, tree `c72568ca`, parent2 = tip, pins 5/5, green 1065/0, smoke 0 failed, 1 warning (main moved 1 docs commit)." I ran it, and that is its exact result.

Note: L178 says the list is "From QA1:32-41", but item 5 at L184 (file caps) was QA1 must-fix 2 (QA1:9), not a non-blocker. Optional fix: begin L184 with "(Was QA1 must-fix 2, fixed in r2.)".

## Checked OK
- **Appendix (scripted):** all 14 blocks match the merge byte for byte. That is 10 full files against `git show 9bbd115a:<path>`, and 4 diff blocks (`drops.ts`, `read-project.ts`, `project.ts`, `home.ts`) against `git diff a85ae665 9bbd115a`.
- **Blob table (L192-203):** all 10 blob ids and line counts match `9bbd115a`. The set equals `git diff --name-only a85ae665 43e146d9` without `handback/`.
- **Rebuild, run per L136-171 with L174 corrected:**
  - base plus the 10 blobs, committed, gives 9 files, 382+12=394, both with and without `':!docs/**'`.
  - `npm run green` gives 1065/0, including the 3 named lines.
  - Golden is `90dde42a`, and the golden dir has no diff. S0 is `d528795e`. The smoke is 73 lines.
  - Smokes: s4c on port 8801 gave 16 ok, including `8 targets` at both widths; s4a on 8799 gave 16 ok; s4b on 8800 gave 16 ok. s4c under 8 CPU-burn loops passed.
  - Maker build stamp is `1a7f52d22e14`. Product and test blobs equal r1 code head `73ac4720`.
- **Facts:** these all match my reviews and the repo:
  - 1065/0 and N=2.
  - G7 394, the same at r1 and r2.
  - Smoke 69 lines in r1 and 73 in r2.
  - Trees `cde99f9d`/`0695ed7f`/`d140607f`/`2f2af33c`/`c72568ca`. Merge trees `0e430316` (r1) and `c72568ca` (r2).
  - Main without the `docs` exclusion: 14 files, 1774+12.
  - HB1 `f0f772bb` (66 lines) and HB2 `0f477754` (86 lines). V1 `d3354f9d` (42 lines) and V2 `ace10fb6` (34 lines).
  - QA1 `85172115` (41 lines) and QA2 `e73a04c3` (33 lines).
- **Cites:** every other code cite matches `9bbd115a`, including the range ends I checked:
  - `rooms.ts` 10-18, 19-27, 30, 47-49.
  - `resize.ts` 14-19, 36-63, 37, 59.
  - `drops.ts` 38-51, 43.
  - `read-project.ts` 2/82/92/108.
  - `home.ts` 77-78, `project.ts:8`, `stage.ts:31`, `stage-place.test.ts:53`, `stage-rooms.test.ts` 19-21, `map-entry-dropped.test.ts` 11-23.
  - `smoke.mjs` 15-18, 26, 27, 33, 39, 44, 47, 51, 59, 64, 66, 68.

  The guide cites at `35cc37db` (L8, 17, 18, 35, 36, 141, 166, 284, 290, 308-317, 319, 321, 329, 334, 340-355, 362, 372), checklist L26/L67, QA1 and QA2 all point at the right text. The quotes are exact, with types kept.
- **Attribution:** the record never mentions the CEO. The seed copy is a "CoS/UX confirm" carry, and the must-fixes and rulings are credited to QA.
