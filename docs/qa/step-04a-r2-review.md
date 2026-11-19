# QA recheck: step-04a-stage-paint r2

**Verdict: OK TO OPEN PR.** r1's only must-fix (line gate 401) is fixed. The gate is now 385 + 15 = 400.

Branch `step/step-04a-stage-paint-r2-chatA`. Tip `f5dcd732` (tree `ba6b2cb8`), code head `fc1f7b2a` (tree `58abb5fa`), parent r1 tip `24cd2fd0`, base `402699d5`. All shas match. Checked in a fresh worktree under `/tmp/q`, removed after use.

1. **The r1..r2 diff is only the marks() merge: PASS.** The `':!handback/**'` diff is `tools/maker/stage.ts` +1/-2 at L40. `const out: Mark[] = [];` and `const team = chosen(files, stage);` become `const out: Mark[] = [], team = chosen(files, stage);`. It is the same values and the same order, so behaviour is identical. No new default (Law 12) and still one job; stage.ts is 161 lines. No change under `tests/` or `handoff/` (smoke still 48 lines).
2. **Gate: PASS.** Guide L166 command plus `':!handback/**'` gives 13 files, 385+/15- = **400** at both the code head and HEAD. The plain L166 command picks up the r1 handback folder, which is now inside base..code-head (450+/15- at the code head, 515+/15- at HEAD). Excluding `handback/**` is the accepted measure from r1 and earlier steps.
3. **Tests: PASS.** `npm ci && npm run green` exit 0. 1053/1053, 0 fail, 0 skipped, 0 todo. `placementDropped: warns, skips in memory, writes nothing back` passes.
4. **Smokes: PASS.** s4a: 2 of 2 runs SMOKE PASS, 16 ok (8 at 390, 8 at 360). S0: sha `d528795e` unedited, TOUCH SMOKE PASS 14/14.
5. **Build, play-stage, golden: PASS.** `node tools/maker/build.ts` exit 0. The stamp is now `c2359142b9af`, as HANDBACK L40 says; it changed because stage.ts changed. No `tools/play-stage` or `tests/tools/golden` diff vs base. Golden sha256 is `90dde42a`, and the seed 24301 parity test passes.
6. **HANDBACK r2: PASS.** L32 gives the command with `':!handback/**'` and "385 insertions + 15 deletions = 400". L54 says "line gate 385 insertions + 15 deletions = 400". Both match git. L3 cites the code head, tree and r2 branch. The shots point at the r1 PNGs, which is valid because the UI didn't change.
7. **Merge tree: PASS.** `git merge-tree --write-tree 544087f4 f5dcd732` is clean and gives **`6326d309`**, as CoS predicted. Its diff vs the branch tree `ba6b2cb8` is docs only: `docs/rebuild/step-03b.md`, `docs/qa/step-03b-review.md`, `docs/qa/rebuild-step-03b-review.md`, `docs/qa/step-04a-review.md`.

Non-blockers are unchanged from `step-04a-review.md` (498fbb09). Also, the r1 handback folder stays on the branch next to r2; it breaks nothing.
