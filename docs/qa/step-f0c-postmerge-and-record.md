# QA: F0c postmerge and rebuild record review

Reviewer: QA & Build Guard. Date: 2026-11-27.

**Postmerge: PASS** (with the authorised pin move). **Record: OK.**

## Postmerge

I ran `qa-postmerge.sh bde1e737 c3468f44`. Main was `f6ceb21e` at the time.

What passed:
- The tree is `f93056ea`, the expected tree from the r1 review.
- Parent 2 is the picked tip.
- Author and committer are both noreply.
- The diff of src, tests and tools from the merge base to the tip equals the diff from parent 1 to the merge.
- Merge versus tip shows only the handoff files plus main's own commits.
- npm test: **1180/0**, which is the new floor.
- Smokes: 0 failed.

The script printed `RESULT FAIL` on one line, `pins: core-types.ts 897d51db != pin 439f403d`. That move is authorised:
- It is F0c Ruling 1, and guide L95–L96 names this exact sha change.
- `git apply data/staging/cn-budgets/cn-budgets.diff` on `664f8303` gives `897d51db`, the same as the merge.
- `tests/smoke.test.ts` pins `897d51db`.
- The script's pin is stale. The script is CoS's, so CoS should move the pin to `897d51db…` before the next postmerge.

The docs-only commits after the merge also check out:
- `5cbba0e5` and `f6ceb21e` touch only `docs/`.
- My 5 QA docs on main match my local hashes.
- The roadmap is `580e0420` and STATES is `cd380b74`.

## Rebuild record

The record is `step-f0c.md` (`60478caf`, 639 lines). The README is `93899bed`: 79 lines, with row 34 as the only change. The push list matches both, and `src/` equals `tree/`.

Checked:
- All 12 Files-list sha256 values match the merge.
- The numstat matches the merge.
- The official count is 12 files, +167/−19, so **186**. That holds both at the code head against `49db9f47` and at the merge against `664f8303`.
- The caps sum to 191 (7+2+5+4+4+3+28+4+4+6+3+121). The trial was 187.
- The guide is blob `bf6434e4`, sha256 `6c2e5a63`, 165 lines.
- The test is `87097007`. Core-types is `897d51db`. QK1 is `abd2a839` / `c0839f65`, 47 lines.
- `3fe48a8d` holds the guide, the plants and the shipped test, and it comes after `49db9f47`.
- The commit times all match git: 10:06, 10:20, 10:21, 14:01, 14:27, 14:28 and 14:52.
- The CEO quote "11c1 finishes and merges, then F0c" (03:53) matches the guide on main.
- The phone check is labelled as relayed through CoS.

Note, not blocking: the record has no postmerge line. If CoS wants one, add "QA postmerge PASS, 1180/0; the core-types pin moved by Ruling 1".
