# QA review: rebuild record step-06d

**Verdict: NOT OK.** Five line fixes, all text-only. The appendix, blob table, counts, named tests, L15 postmerge line, floor/smoke cites, attribution and publish gate are otherwise correct.

Record: `/workspace/share/step-06d-record/docs/rebuild/step-06d.md`, 429 lines, sha256 `5c1b135855a0c4380d70c4f4c2a9c7b3bbfcc3aadd139fae9df667fe4178dc39`, hash-object `e6d44c8948648c895a8339cf06535ef0c70842ed` (checked; starts `5c1b1358`). Merge `aa2ef7e3ca463a9e1c72899910dd76990dafcd38`: tree `06864daf38b2dadd649d55b696b7a81729545089`, parents `cbe0dc8a` + `849c09f2`, committed 2026-11-22 20:35 (UK time). `origin/main` is `9a5c12205b79e61573cfa3a20e1940cdf350616f` (it adds only `docs/qa/step-06d-review.md`). Postmerge already PASSED at L15 (1108/0, pins 5/5, smoke ok). HB blob `72d2242b` (121 lines). V sha256 `8495ba8e…`, hash-object `502fdfad`, 59 lines. QA sha256 `3d26fb9b…`, hash-object `a3996263`, 55 lines, on main `9a5c1220`. Guide r2 blob `76319620`, sha256 `04bc1e26…`, 111 lines.

## Must-fix
1. **L151, start commit.** Change ``Start from the step-06d-review-on-main commit `9a5c1220`, or from later main if it is still docs-only on that commit.`` to ``Start from the 6d product base `cbe0dc8a`, or from later main if it is still docs-only on that commit. Do not start from `9a5c1220` or `aa2ef7e3`, which already have the 6d merge.`` A rebuild of 6d has to start from the product base (or from docs-only main at merge time), not from a commit that already contains the step.

2. **(f), trap (a) — commit before measuring.** After the `## (f) Rebuild check` heading and before the fence that now starts at L165, insert: ``From a clean tree at `cbe0dc8a0ccbffb1df1f68520cf6aa6cae13f30b` (main at the merge, which is also the product base), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure against `cbe0dc8a` as below.`` The current (f) jumps straight to `git diff aa2ef7e3 HEAD` / `git diff --shortstat <base>..HEAD`, which do not see uncommitted files.

3. **L160, trap (c) — G7 cite.** Change ``Count insertions plus deletions.`` to ``Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123).`` Guide L65 is already named in that bullet. The record otherwise never cites those two sources. On the merge and on `9a5c1220`, checklist L26 is G7 in `docs/qa/handback-checklist.md`, and `BUILD_GUIDE.md` L123 is the size-and-caps rule.

4. **L52, range ends.** Change `` `readout.ts:1,15-17` `` to `` `readout.ts:1,15-18` ``, and `` `readout.ts:9-10` `` to `` `readout.ts:9-11` ``. `readout()` closes at `:18` (`}`); `:17` is the `return`. `canvasMbOf` closes at `:11`; `:10` is the body and `return`.

5. **L54, L156 and L208, dpr carry.** The display-only reading is right (QA:27), but the carry is incomplete: the same fallback is already in the unedited play-stage at `tools/play-stage/page.ts:22` (`const dpr = (): number => devicePixelRatio || 1`). State that match, and say not to "fix" the baseline line in isolation.
   - L54, after "It is not a silent substitute for heap or GC.", add: ``The same fallback is already in the unedited play-stage at `tools/play-stage/page.ts:22` (`const dpr = (): number => devicePixelRatio || 1`).``
   - L156, change ``Do not treat it as a product default for heap or GC.`` to ``It matches the existing `tools/play-stage/page.ts:22`. Do not treat it as a product default for heap or GC, and do not "fix" it in isolation.``
   - L208, after "Not a silent fallback for heap or GC, and not a must-fix (QA:27).", add: ``The same `devicePixelRatio || 1` is already in `tools/play-stage/page.ts:22`. Do not edit either line to drop it.``

Recheck only those lines.

## The three 04b/04c traps
- **(a) Commit before diffing: must-fix 2.** (f) currently has no write-then-commit instruction.
- **(b) Final equality against the merge: OK.** L166–169 say `git diff aa2ef7e3 HEAD --` over the product paths must be empty, and the blob table is at `aa2ef7e3`.
- **(c) G7 cite: must-fix 3.** L160 and the official command already name guide L65 and “insertions plus deletions”, but not checklist L26 or `BUILD_GUIDE.md` L123 (repo-root file).

## Checked OK
- **Appendix (scripted):** all seven new-file sections match merge `aa2ef7e3` byte for byte against `git show aa2ef7e3:<path>` (`checkpoint.ts` 14, `readout.ts` 18, `page.ts` 19, `index.html` 7, `build.ts` 28, `baseline-page.test.ts` 38, `smoke.mjs` 38). The pre-appendix quotations (failed-open / host-rAF wrap, the `devicePixelRatio || 1` line, the three named tests, and the `waitForFunction`) also match the merge.
- **Blob table (L222–228):** all seven blob ids and line counts match `aa2ef7e3`, and the same blobs are on code head `b5667b30`.
- **Facts:** these all match my review, the verify report and the repo:
  - 1108/0 and N=3. The three named tests are present at the merge and close on their last line (`baseline-page.test.ts:14-20`, `:21-29`, `:30-38`). Floor 1105 → 1108. S0 sha256 `d528795e` is unchanged on the base, the code head, the tip and the merge. Lockfile blob `85b42f99` is unchanged.
  - Official G7 at the merge, the code head and the tip against `cbe0dc8a`: 7 files, 162 insertions. Every per-file cap is kept (`build.ts` 28/28). Against `c829fcb7` without `':!docs/**'`: 10 files, 318 insertions, as L113–116 and L179–182 say; adding `':!docs/**'` gives the official 162.
  - Trees `413afef0` / `06864daf` / `06864daf` (tip tree equals the merge tree). Predicted merge tree onto `cbe0dc8a` is `06864daf`. Tip vs code is 2 files, 121 insertions (`HANDBACK.md` and `01-baseline.png`).
  - Build on the clean code head: 140 files, 661374 bytes; `build.json` sha256 `f8eb6586c6f1fef51d37c7454319b2f7dfab489ac649eb95bbf9cdce128af243` on Node 22.23.3 (HB:96, V:22, QA:12). A Node 24 rebuild changes only the `node` field.
  - r1 tip `849c09f2` / code head `b5667b30` was OK TO MERGE (QA `3d26fb9b`, 55 lines, on main `9a5c1220`). Guide r2 `76319620` (sha256 `04bc1e26…`, 111 lines) on the merge, main, the base, the tip and the code head.
  - Dates: base `cbe0dc8a` 2026-11-22 16:34, code head 17:10, tip 17:12, merge 20:35, QA-on-main 20:36 (UK time).
  - **L15** already records the postmerge pass: merge `aa2ef7e3` (tree `06864daf`), second parent tip `849c09f2`, 1108/0, pins 5/5, smoke ok, main `9a5c1220`.
- **Floor and smoke cites (the 6c traps, not repeated here).** L16 `(HB:19, V:21, QA:9)` is right: HB:19 is `N = 3. Floor 1105 + 3 = 1108`. L13 `s6d ×3 (one under CPU load; V:23, HB:40-92)` is right: the ×3 is in V:23 and HB:40–92 (CPU, idle, idle). QA:11 is two idle runs and an explicit note that QA did not repeat the loaded run, and is not cited for the ×3.
- **Other ranges and HB/QA/V cites I checked** (QA:3, 5, 9, 10, 11, 12, 13, 14, 18, 20, 21, 22, 27, 45–51, 47, 48, 49, 50, 51, 53–55; HB:3, 4, 16, 19, 20, 34, 37, 38, 39, 40–92, 96, 99, 101, 107, 112, 115, 117, 121; V:5, 7, 11, 18, 20, 21, 22, 23, 30, 31, 33, 37) point at the line that says the claim. Version/UA claims are sourced: HB:38 is the Playwright headless-shell path (L209 correctly says not a UA string); HB:4 is Node v22.23.3; Chrome `156.0.8078.47` is attributed to QA and CoS (QA:11, QA:47, V:23, V:30), not to HB.
- **16 unused demo fixture packs:** described correctly at L60, L155 and L207. `tools/play-stage/project.ts:11-14` has the 16 `fixtures/demo.tileproj` JSON imports; the release ships 16 `.json.js` copies that this page never uses; do not edit `project.ts` to drop them. That matches guide L104, HB:117 and QA:20.
- **Attribution and publish.** The record never labels a CoS, UX, EA or builder choice as a CEO ruling. Overlay colours and padding stay builder-named at HB:112. Publishing `baseline-06c/` is gated on the CEO's SEND via CoS (L161, L214; guide L19, L97; HB:121; QA:22) and is not claimed done.
