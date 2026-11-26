# Step 10c r1 review (PR #105, chatA)

Verdict: **REWORK (one small fix), then OK TO MERGE.** Everything else passes.

- Guide r2 5702669d, base 76fd7502. Code head 2d2e4064 (tree db1f30e3), tip a496ebe6 (tree 0df4f965). Expected merge tree onto main 0a29cc18: ce0f2836 (matches CoS).
- My run on the code head: green 1157/0 (floor 1157), tsc 3 base errors, all 20 smokes PASS solo (s10c 8 ok at 8816 r1), export audit PASS.
- Mutations (guide L92): pointer cut to the doc path fails test 4; `a:fx:` `effectRows` check removed fails test 5; base `read-project.ts` fails test 4. Clean run 5/5.
- Must NOT: no waitForTimeout, no empty catch, no new clock or rAF, no window.__ outside the smoke, noreply author on every commit, no raw logs or shots, Code head labelled apart from the tip.
- 10b nit carried: dead `let docs = files` removed from asset-check.ts (1+ 1-), Law 12 test still passes.
- Count: 8 files 327/400 (314+ 13-).

## The cap call
- `tools/maker/effects.ts`: accepted as is (90/90). The `(p) => \`${p}1\`` id function is inlined at three writer calls. That is a helper inline, the same mint levels.ts uses, not two statements on one line. No change needed.
- `tests/editor/effects-10c.test.ts`: not accepted. `type Obj` + `isObj` and `steps` + `hist` are two statements per line, joined to fit the cap. The guide (L65) forbids joining to fit a cap. Fix: split them back to one statement per line, test file 92. That needs EA to raise this file's cap 90 to 92 (total 329/400, still under the hard gate). Nothing else changes; this is the one rework round.
- After the split I check: file 92, green 1157/0, tests 1 to 5 pass, and the new merge tree.
