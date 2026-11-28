# QA review: F2a1 carries r1 (ChatA, PR #116)

Verdict: **OK TO MERGE**. Expected merge tree onto main 77a64648: **24a5304d5b2d32f57975fffdf94900129ba514d7**. Floor 1198, no pin.

- PR https://github.com/G-TileEngine/tileengine/pull/116, branch step/step-f2a1-carries-r1-chatA, base 77a64648 (main, unmoved).
- Code head 10a0ca8a, tree 81ddf7ee. That is byte-equal to the EA trial patch 37fb90d6 applied with git am on 77a64648 (QA rebuilt it: 81ddf7ee). So the kit-review checks on the trial code all carry over (docs/qa/step-f2a1-kit-review.md 76200182): cites, caps, Rule 8, re-pins, and smokes s6a/s6c/s11c1/s5a/s6b/s4c at 390 and 360.
- Tip 4d4c68b6 (tree 24a5304d) adds only handback/step-f2a1-carries/r1/ (6 files). git merge-tree onto 77a64648 gives 24a5304d.
- On the tip in a fresh worktree: npm ci, then green 1198/1198/0. Kit sha256sum -c passes. Plants 12/12 with the tree clean after. 0 token patterns in handback/.
- Pushed docs on 77a64648 match the kit: guide 3a0fbc4e, plan ef212329, QA kit review 76200182.
- HANDBACK uses Node v22.23.3, which is inside engines >=22.18.0.

Flags (not blocking):
1. HANDBACK's Rule 8 section says "the diff adds no new statement" and that Rulings 1 and 3–7 are all substitutions inside existing lines. That isn't exact: Ruling 4 adds two new lines (the budgets.ts import and the icons.ts member), and the shipped test is new code. All of them are one statement per line, so Rule 8 holds; only the wording is loose.
2. The kit-review carries stand. Guide L131's sprite.ts L55/L71 are L59/L75 on main, and the ART1b guide cites those. The F2a1 record notes that F1 plants P20/P24 stop applying.
