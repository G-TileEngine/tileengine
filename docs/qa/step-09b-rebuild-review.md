# QA: step 9b postmerge and rebuild record review

## Postmerge: PASS
`bash /workspace/cos-tools/qa-postmerge.sh a1d01698 d0c537e5` gives RESULT PASS:
- merge `a1d0169878faa2a7df78e5672c3d6c1b918a9cd1`, tree `15c69cc6` (the predicted tree)
- parent 2 is the picked tip; author and committer are noreply
- the src/tests/tools diff matches the tip; pins 5/5 unchanged
- green 1141/0; smoke 0 failed

The one warning is that main moved by 1 commit. That commit is `21763070`, which adds only `docs/qa/step-09b-r1-review.md` (48 lines, sha256 `4a24738b`).

The script needs the merge commit. Run on `21763070` itself, it fails with "expected 2 parents, got 1", because that commit is a docs-only child, not the merge.

## Rebuild record: QA OK
Files reviewed:
- `/workspace/share/step-09b-rebuild/docs/rebuild/step-09b.md`: 870 lines, sha256 `ca4db395…`
- `README.md`: sha256 `73cbaefe…`. It adds only row 24 against main.

| Check | Result |
|---|---|
| Blob table | 11/11 blob ids and line counts match `a1d01698` |
| sha256 claims | all match: picture, art, test, s9b, and the 5 unedited smokes S0, s8, s8c, s9 and s6d |
| Appendix | new files match in full: picture, art, test, smoke. Edited files match `git diff 8572cd05 a1d01698` at `-U3`: backdrop, page, board, hud, store, home, stage |
| Code line cites | all match `a1d01698`: picture.ts 1–2 and 30; art.ts 26–29, 40, 43, 55 and 64; home.ts 55, 140 and 169; stage.ts 31; store.ts 2, 9 and 20–23; backdrop.ts 20–30; page.ts 61; board.ts 122 and 132–139; tests 36, 42, 56, 65, 81, 94 and L88 |
| QA cites | all match `docs/qa/step-09b-r1-review.md`. QA:3, 7, 8, 14, 15, 17, 18, 19, 20, 23–28, 35, 36, 40, 41, 42, 43 and 44 are each on topic |
| HB cites | L3, L25–29, L38–54, L80 and L83 match the HANDBACK |
| Attribution | Q1 and Q2 are labelled EA rulings. No builder, CoS or QA choice is called a CEO ruling |
| README row 24 | the base, PR #101, merge `a1d01698` and 1141 tests match the facts above |

Non-blockers: none.
