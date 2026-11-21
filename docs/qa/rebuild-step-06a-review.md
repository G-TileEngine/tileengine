# QA review: rebuild record step-06a

**Verdict: NOT OK.** Four line fixes, all text-only. The appendix, blob table, stamp, G7 counts, named tests, traps and attribution are otherwise correct.

Record: `/workspace/share/step-06a-rebuild/docs/rebuild/step-06a.md`, 6504 lines, sha256 `b84504616797d723d22baa35bbffe4a326f2873e17f998662b5d298b68d95881`, hash-object `842bef65dbae747c9cd24e299b715614e1880222` (checked). Merge `23b5755f691a0f18aaad7c373242f081423d2419`: tree `2c08b39140d60e1f0626561ade40dce361f6fbcb`, parents `1b358d04` + `c1500bb4`, committed 2026-11-21 23:04 (UK time). `origin/main` is `0ac31c878e99790447eaa59989e2c26d2cd7d199` (it adds only `docs/qa/step-06a-review.md`). Postmerge already PASSED (1093/0, pins 5/5, smoke 0 failed).

## Must-fix
1. **L15, postmerge line.** Change `QA postmerge: pending.` to `QA postmerge: Postmerge PASS (QA): merge 23b5755f, 1093/0, pins 5/5, smoke 0 failed.`
2. **L92, range end.** Change `` `tests/editor/add-ability.test.ts:94-101` `` to `` `tests/editor/add-ability.test.ts:94-102` ``. The test `the Empty template gives that visible reason line` closes at `:102` (`});`); `:101` is the last `assert.throws` line.
3. **L92, range end.** Change `` `tests/editor/rules.test.ts:93-101` `` to `` `tests/editor/rules.test.ts:93-102` ``. The test `old empty project gets the plain sentence` closes at `:102` (`});`); `:101` is the last `assert.throws` line.
4. **L184, HB cite.** Change `HB:51 is a Playwright headless shell (HeadlessChrome/156.0.8078.4).` to `HB:51 is a Playwright headless shell.` HB:51 names the headless-shell path and does not give that UA string; QA:74 already covers the Chrome re-run.

Recheck only those lines.

## The three 04b/04c traps
- **(a) Commit before diffing: OK.** L124 says to write the product files to match the blob table, then `git add -A && git commit -m rebuild` on a rebuild branch, before measuring.
- **(b) Final equality against the merge: OK.** L178 says `git diff 23b5755f HEAD --` over the 26 product paths plus unchanged `src/editor/unit/units.ts` must be empty, and the blob table is at `23b5755f`.
- **(c) G7 cite: OK.** L17 and L120 name `docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123 (insertions plus deletions), and guide L82.

## Checked OK
- **Appendix (scripted):** all 44 blocks match merge `23b5755f` byte for byte. That is 8 full new files against `git show 23b5755f:<path>`, and 18 diff + 18 full blocks for the edited files against `git diff ae968eb0 23b5755f` (as the appendix header says) and `git show 23b5755f:<path>`. The three quoted body blocks (`match.ts:21`, `setTeam` at `team.ts:12-18`, `play: army` at `project.ts:41-42`) also match the merge.
- **Blob table (L195-220):** all 26 blob ids and line counts match `23b5755f`, and the same blobs are on code head `bda2ea6c`.
- **Stamp:** `node tools/maker/build.ts` in a real `npm ci` worktree writes **`4eb4ed272938`** at merge `23b5755f` and at code head `bda2ea6c` (maker and play-stage stamps).
- **Facts:** these all match my review, the verify report and the repo:
  - 1093/0 and N=11. The eleven named test titles are present at the merge (five plus the three Empty tests in `rules.test.ts`, `on your team writes the loadout` at `units.test.ts:45`, `canUpdate refuses drifted knobs` at `add-ability.test.ts:103`, `addable keeps goal-less primaries` at `:114`). Floor 1082 → 1093.
  - G7 21 files, 362+30=392 at the code head, the tip, and the merge against first parent `1b358d04`. Against the product base `ae968eb0` at the merge: 22 files, 365+31, the extra file being `handoff/dsk-rulings/2026-11-17-phase1.md` (3+/1−). Without the excludes, at the code head: 26 files, 2355+37.
  - Trees `8e2a63d8` / `d6dd2f40` / `2c08b391`. Predicted merge tree onto `1b358d04` is `2c08b391`.
  - r1 tip `c1500bb4` / code head `bda2ea6c` was OK TO MERGE (QA `2903cda2`, 79 lines, on main `0ac31c87`). HB `ab5e63c0` (175 lines). V sha256 `5bd18645…`, hash-object `c40a62b2`, 37 lines. Guide r2 `c846699d` (sha256 `a8060239…`, 248 lines) on the merge, main, the base, the tip and the code head.
  - Pins unchanged: S0 `d528795e` (blob `1f50845a`), golden `90dde42a`, parity seed 24301. s6a smoke 76 lines.
- **Other ranges:** `rule-of.ts:1-11`, `winOf` at `project.ts:30-35`, `setTeam` at `team.ts:12-18`, `on your team writes the loadout` at `units.test.ts:45-56`, and the one-line cites (`stage.ts:146`, `units.ts:102`, `newUnit` at `units.ts:6`, `emptyBoard` at `test-gate.ts:19`, `test-launch.ts:25`, `diagramHtml` at `unit-diagram.ts:43`, `playLine` at `test-gate.ts:16`, `play: army` at `project.ts:41-42`, `home.ts:96`, `wired.ts:7`, `load.ts:22`, `match.ts:21-22`, `stage.ts:154` / `:220`, `project.json:11, 18-20`) each end on the full construct. The remaining numbered HB/QA/V cites I checked (QA:3, 7-18, 8, 10, 14-18, 20, 23, 25, 28, 73-76, 74, 75, 76, 78-79; HB:3, 4, 36-45, 46, 47, 51, 53-137, 146-155, 152-155, 161, 166, 167, 169, 171, 172; V item 10 at V:26, merge tree at V:37) point at the line that says the claim.
- **Attribution:** the record never labels a CoS, UX, EA, DSK or builder choice as a CEO ruling. "Chief Of Staff" appears as the verify-report source and in the quoted HB:3 PR line. D25 and D26 are cited as DSK rulings, not CEO rulings.
- **Carries into later steps:** match QA:73-76. Chrome/Node note; 4a/4b/4c carries still open; the Empty `play: army` throw remains at `project.ts:41-42` as the old-project guard (D26); D22 effect ids and the `catalogue.ts` regen are not this step.
