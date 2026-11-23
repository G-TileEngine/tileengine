# QA review: Step 7 stage links r1 (ChatA)

QA & Build Guard, 2026-11-23 GMT. PR #94. Tip d1de6952 (tree 4cb2f241), code head 11928259 (tree 4cc920af), base 33538c89. Guide r4 07ed93ed (on the base).

**Verdict: OK TO MERGE. The expected merge tree is 4cb2f241.**

- **Merge:** `git merge-tree --write-tree origin/main d1de6952` gives 4cb2f241, the same tree as the tip. It has two commits: the code head and the handback docs.
- **Green:** real `npm ci && npm run green` at the tip gives 1114 pass / 0 fail, which is the floor of 1114.
- **s7 smoke (port 8809):** 10/10 at 390 and 10/10 at 360. Check 9 counts the resize listeners as {maker 0, play 1, up 1, down 1, back 0} at both widths, so Law 13 holds. The smoke has no waitForTimeout or setTimeout.
- **S0 touch smoke (d528795e):** 7/7 at each width, TOUCH SMOKE PASS.
- **Count:** 18 files, +226/-39, for 265 of 400. Every file is within its guide cap; at the cap are core-types 7/7, smoke.test 2/2, load 4/4 and tests 105/105. The smoke is 47/90, outside the 400.
- **CN:** core-types.ts sha256 is fd27de06, as the guide and D27 expect. The pin change in tests/smoke.test.ts is the only edit to existing tests.
- **Build law:** no new rAF, setTimeout or loop. The links data flows through readStage and session/links. There are no chess trees, no JSON.parse, and no maker or editor imports in the play stage. HANDBACK has a 'Code head' label, and no raw test log is committed.
- **Law 12:** `links ?? []` is the ruled behaviour for an absent field (D27). The `?? "Stage"` fallbacks are display-only names.

Non-blocking notes (carries):
1. match.ts landed(): when the stage has no string id, `linkEvent(hit, ...)` passes `""` as the from id, and then arrival falls back to playerSpawns. This can't happen after readStage validates the stage, but a later tidy step should make it throw instead of defaulting.
2. These are CoS's nits: the test-2 median is repeated in the self-review, and the median timing differs between boxes (0.763 ms on Node 24 against the builder's 1.189 ms on Node 22). Both are well under the 4 ms limit.
3. These are the guide cite nits: the raf-driver dispose() range is L97-101, and board.ts L83-90 stops short of its brace.
