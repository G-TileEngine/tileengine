# Step 10a postmerge + rebuild record review: PASS / QA OK

## Postmerge
`qa-postmerge.sh c3e056ff 8ed982f4`: RESULT PASS.
- Merge c3e056ff, tree 4f29428c, as predicted.
- Parents are 751994a7 and 8ed982f4; parent 2 is the picked tip.
- Author and committer are both noreply.
- The src/tests/tools diff equals merge-base..tip.
- The merge differs from the tip only by main-only commits.
- Pins 5/5, green 1146/0, smoke 0 failed.
- One warning: main moved one commit past the merge, to docs commit 0673be7e (my r1 review).

## Rebuild record
/workspace/share/step-10a-rebuild/docs/rebuild/step-10a.md (648 lines, sha256 39ddf205) and README row 26 (README sha256 60da9a51): QA OK.
- The sha256 for all 18 files in table (b) matches the merge. The count matches too: `git diff --shortstat 751994a7 c3e056ff` gives 18 files, 82 insertions and 25 deletions (107).
- The guide (blob 35bebede, sha256 40ef961f, 119 lines), the HB (blob 789d716b, sha256 981877dd) and V (sha256 237ea971) all match.
- The trees cited for 31f4c0c4, 751994a7, ffe56f93 and 0673be7e match.
- Appendix: each of the 17 edited-file blocks equals `git diff -U3 751994a7 c3e056ff -- <file>` byte for byte, and carries-10a.test.ts (new) is reproduced in full and matches.
- README: compared with main 0673be7e, the only change is the added row 26.
- Attribution: no CoS, EA, DSK or builder choice is labelled as a CEO ruling. The only CEO mention is that a republish needs his own typed OK.
