# QA review: step F1 look kit r2 (PR #114)

Verdict: **OK TO MERGE.** This is the one rework round; M1 is cleared and nothing new is found.

## What was reviewed
- Branch `step/step-f1-look-kit-r2-chatA`; PR #114 head `e173f394e943b795f3ba53cc2dfd258112cd1896` (tree `f1809c4c9970bdcac441551f75a46fca61169d07`).
- Code head `f4f952d755ff62a2336bb6e645dc0550a75e211c`, tree `b9676b64899b3cbe727d9e69032472ed73309415` = the tree named in docs/qa/step-f1-r2-go-line.md.
- Base `04dadacf`. Main `bf07a227` (04dadacf + the two QA docs, sha256 823a5e62… and c357e58f…, both as written).
- Expected merge tree onto `bf07a227`: `b4c8168f46aeed54229c385d0a01dbf75b07e3a9` (git merge-tree, re-run by QA). Merge with `--expect-tree b4c8168f`.

## Checks (QA's own run on e173f394)
- M1: `git diff d0689c2c f4f952d7` is tools/maker/icons.ts only, 16+/16-. Lines 2-17 are byte-equal to the 16 UX lines in the go-line. Nothing else changed.
- npm run green: exit 0, 1188 pass / 0 fail.
- tools tsc: only the 3 base errors (effect-designer page.ts L101, maker home.ts L93 x2).
- Plants: 29/29 caught. Tree clean afterwards.
- Shipped test tests/tools/f1-look-kit.test.ts: sha256 83ef2acf…, unchanged. Guide 9d7ecff2 unchanged.
- Smokes: all 25 PASS in one sequential run (ok counts equal HANDBACK § Smoke). s8c, flaky in sequence at r1, passed this time.
- Export audit: 136/150/150, AUDIT PASS.
- Counted lines vs base: 289+85 = 374 (cap 380).
- Hygiene: no bare `class="btn"`, no ⋯ or ▶ in tools/maker; 0 token patterns in handback/.
- Tip adds only handback/step-f1-look-kit/r2/ (26 files). HANDBACK labels the code head and tree in § Green, lists § Helpers & self-review, and carries no raw logs in the body.
- Shots: (a)-(g) present at 390x844 and 360x844, (g) in both states. f01 and f04 copies are byte-equal to docs/maker/shots. Rules is now a flag, units one person, Build game a down arrow into a tray, View a 3x3 grid, Test a play triangle, matching UX's f01.

## Note on CoS's F-b remark
CoS said the trial had the read-only/newer levels-card thumb. QA checked /workspace/share/f1/f1-trial.patch (r3): the trial's `readOnly || gate.mode === "newer"` card is unchanged context with no thumb. The trial adds thumbs only to the Off and normal levels cards. So HANDBACK § Decisions and QA r1 F-b are right: the trial lacks all three. (r1/r2 also puts a thumb on the "older" card, which the trial didn't; harmless.) All three carry to F2a either way.

## Carries (unchanged from QA r1)
- F2a: On aria-label `{label}: On`; dead `.card.new` (app.css L8); the Budgets icon; F-b's three placements. HANDBACK § Next step omits `.card.new`; it stays on QA's list.
- F2b: `+ Add ability` plus icon.

## Next
Post-merge check on the merge sha.
