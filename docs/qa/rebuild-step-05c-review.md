# QA review: rebuild record step-05c

**Verdict: NOT OK.** Three line fixes, all text-only. The appendix, blob table, facts, cites otherwise, traps and the Law 12 r1→r2 story are correct.

Record: `/workspace/share/step-05c-rebuild/docs/rebuild/step-05c.md`, 1637 lines, sha256 `f5e13077…`, hash-object `13b7ecc08568c086daee2c01c4437271784ce9de` (checked). Merge `5a2c8e79`: tree `4db8eb34`, parents `88a6ac93` and `e2e0463d`, committed 2026-11-21 17:32 (UK time). `origin/main` is `80eedada` (it adds only `docs/qa/step-05c-review.md` and `docs/qa/step-05c-r2-recheck.md`).

## Must-fix
1. **L20 and L168, stamp.** Change `c68159634c00` to `b059a41693b0`. `node tools/maker/build.ts` at r2 code head `f308d135` and at merge `5a2c8e79` both write `b059a41693b0` (maker sources are identical). The same command at the 5b merge still writes the recorded `d813576e8f59`.
2. **L106, QA cite.** Change `(QA2:6-7, V2)` to `(V2:25)`. QA2:6-7 is the must-fix write-up and the plant, not the helpers. V2 L25 (check 8) is the line that says helpers HB2:118-119 came back CLEAN.
3. **L45, HB cite.** Change `(HB2:129-130)` to `(HB2:128-130)`. The 36×16 cell size is at HB2:128; L129-130 are the goal-card / `app.css` extra notes.

Recheck only those lines.

## The three 04b/04c traps
- **(a) Commit before diffing: OK.** L124 says to write the 19 product files, then `git add -A && git commit -m rebuild` on a rebuild branch, before any `88a6ac93..HEAD` diff.
- **(b) Final equality against the merge: OK.** L172 says `git diff 5a2c8e79 HEAD --` over the 19 product paths must be empty, and the blob table is at `5a2c8e79`.
- **(c) G7 cite: OK.** L19 and L120 name `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123 (insertions plus deletions), and guide L94-95.

## Checked OK
- **Appendix (scripted):** all 28 blocks match the merge byte for byte. That is 10 full new files (including the `catalogue.json` symlink target) against `git show 5a2c8e79:<path>`, and 9 diff + 9 full blocks for the edited files against `git diff 88a6ac93 5a2c8e79` and `git show 5a2c8e79:<path>`.
- **Blob table (L190-208):** all 19 blob ids and line counts match `5a2c8e79`. `tools/maker/catalogue.json` is mode `120000`, blob `5b0e3a42`, target `../../behaviour-library/behaviours.json`. The set equals `git diff --name-only 88a6ac93 e2e0463d` without `handback/` and `docs/`. Product and test blobs also match r2 code head `f308d135` (tree `1d613bb6`).
- **Facts:** these all match my reviews and the repo:
  - 1082/0 and N=8; r1 was 1081, N=7. Floor 1074 → 1082.
  - G7 355+38=393 at the r2 code head, the r2 tip, and the merge (first parent is the base, so `':!docs/**'` does not change the count). r1 was 341+38=379. Without the excludes the merge is 25 files, 592+38 (the 17 counted files, the smoke, `setup.ability.json`, and the six hand-back files).
  - Trees `192f86a7` / `0d4ac39c` / `1d613bb6` / `4db8eb34`. Predicted merge tree onto `88a6ac93` is `4db8eb34`.
  - r1 tip `f75e5386` / code head `cb1b0ff8` was NOT OK (QA1 `1c7e556e`, 44 lines): at `cb1b0ff8`, `unit-diagram.ts:12` `played()` caught every `Error` from `playDocsOf` and returned `null`, and `diagramCells` at `:29` drew `grid(null)`. r2 tip `e2e0463d` / code head `f308d135` was OK TO MERGE (QA2 `1f88ffec`, 13 lines). Product fix vs r1 is the four named files, 26+/12−; the tip vs the r2 code head is HANDBACK.md only, 16+/13−. No force-push: parent of `f308d135` is `f75e5386`.
  - Pins unchanged: S0 `d528795e` (blob `1f50845a`), golden `90dde42a`, parity seed 24301. s5c smoke 86 lines, unedited vs r1. s5b and s5a unedited vs the base.
  - HB1 `c4c3bc7a` (133 lines) and HB2 `0bc1a93a` (136 lines). V1 sha256 `d2ec2024…` (37 lines). V2 sha256 `90eec871…` (34 lines). Guide r3b `2e2673e8` (sha256 `ce4ec011…`, 267 lines) on the merge, main, the base and the tip.
  - Postmerge line at L17 is the required PASS wording, including main `80eedada` adding only the two QA reviews.
- **Cites:** every other `(doc:line)` I checked points at the line that says it, including HANDBACK (HB1/HB2), QA1/QA2, guide L20, L33-37, L35, L36, L37, L94-95, L137, L187, L198-244, L205, L207, L213-221, L223, L225, L228-230, L234, L235-242, L243, L259, checklist L26/L67, `BUILD_GUIDE.md` L123, and the code range ends at `5a2c8e79` (`catalogue.ts` 7 / 8, `build.ts` 9, `maker-build.test.ts` 25-26, `add.ts` 7-9 / 19-27 / 23-24 / 28-34 / 35-41 / 40 / 43-51 / 52-60 / 65-75 / 76-82, `slice-of.ts` 1, `save.ts` 19, `add-ability.ts` 15-19 / 17 / 20-30 / 28 / 31-37 / 34 / 36 / 42 / 46, `ability-panel.ts` 39 / 51 / 81, `units.ts` 126-132, `unit-diagram.ts` 13-17 / 33-39 / 40 / 42, `range.ts` 4-7, the eight named tests at `add-ability.test.ts` 26 / 42 / 55 / 64 / 74 / 80 / 85 / 94-99, smoke L16-17 / L36 / L43 / L71 / L81, `project.ts` 33-34, `rooms.ts` 41, `drops.ts` 43, `resize.ts` 37). The four quoted blocks (catalogue import, `played`, `diagramHtml`, `play: army`) match the merge bytes. Range ends of the cited functions include the closing braces.
- **Attribution:** the record never labels a CoS, UX or builder choice as a CEO ruling. "Chief of Staff" appears as the verify-report source. The Empty `play: army` line is cited as guide L259 (an EA item under Rulings needed).
- **Carries into later steps:** match the guide and QA1:29-35 / QA1:42. Empty still throws `play: army` at `project.ts:33-34` until a `unit-roster` setup exists; the diagram now shows that reason instead of a blank grid. No named test for the P < B “bigger update” path; `missing goal goes to Other` does not drive `addable()`. The 4a/4b/4c/5a/5b carries remain open.
- **Shape:** follows `docs/rebuild/step-05b.md` (sections (a)–(f), non-blockers, blob table, appendix of new-full / edited-diff+full).
