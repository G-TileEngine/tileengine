# QA review: step 10b effect data r1 (PR #104, ChatA)

Verdict: **OK TO MERGE.** Expected merge tree onto main 12b31b1f: `ea5d968b9cfffe6dec3cadc59474accae50529a0` (QA `git merge-tree` matches CoS).

- Base 0673be7e, code head 66aabd54 (tree f209da26), tip 7435eb15 (tree 568a1e84). Tip minus code head = HANDBACK.md only. Code head label present.
- Built against the r2 guide (8a5ecad2…, 112 lines). The branch's copy of the guide is r1, but the merge tree keeps r2 (sha256 8a5ecad2… in ea5d968b).
- 11 files, +134/−20 = 154 lines. Every Build-table cap is kept.
- Run on the code head: green 1152/0 (floor 1152); tools tsc gives only the 3 base errors; all 19 smokes pass solo (S0 14, s3 18, s4a–s5c 16 each, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8 at 390 and 360). No s3 or s8c flake. The s8 export audit passes.
- Mutation: changing `!builtins.has(bare)` to always push fails effects-slot tests 5 and 6 only (DSK r42 built-in and alias rows are pinned).
- s10b smoke uses waitForFunction only (no waitForTimeout). No empty catch in the changed files.
- Compared with the guide's trial patch: same behaviour. Differences are builder choices, not CEO rulings: read-project also runs `readSetup` on effect docs (extra validation, green); `pickFx` reads the answer through `knob()` (a default can only be a built-in id, which never matches `store.effects`, so no false pick); asset-check starts `let docs = files` but the catch returns, so no silent fallback.

Nits (no rework): HANDBACK says the PR was opened by CoS "from the branch" before it existed; the asset-check `let docs = files` initialiser is dead and could be a bare declaration in a later touch.

Next: postmerge with floor 1152 and the 19 smokes. 10c floor = this merge's count + 5.
