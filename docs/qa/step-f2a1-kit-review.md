# QA review: F2a1 kit r1 (EA, 27 Nov 2026)

Verdict: **OK TO SEND** (no must-fix). Reviewer: QA & Build Guard.

## What was reviewed
- Box folder /workspace/share/f2a/: top SHA256SUMS 18aaf30a passes; kit SHA256SUMS 8715682d passes.
- Guide step-f2a1-carries.md 3a0fbc4e (140 lines), test a86157f7 (88), plants-f2a1.py a39479a6 (31), paste d5f3db74 (11), PUSH-LIST.md 183c1966, PLAN-DELTA.patch 263f8934, PLAN-LINES.md 54683c3f, trial patch 37fb90d6.

## Checks run (fresh worktrees under /tmp/q)
| Check | Result |
|---|---|
| Trial patch on 8791cecc | applies; tree d202af4bd5199c4c3f781cae32d26a6b1a7b73c1 (matches EA) |
| Trial patch on main 6ac84b5d (docs-only move: 3 paths under docs/rebuild and docs/qa) | git am applies; tree 324bd637f4d8d298ce84b7e1898e5f95ba75cb48 |
| Shipped test in the trial | byte-identical to the kit copy |
| npm run green | 1198 / 1198 / 0 (floor 1198) |
| tsc -p tools/tsconfig.json | 3 errors = base 3 |
| Shipped test on base 8791cecc | 0 pass / 4 fail (each test is red before the step) |
| plants-f2a1.py | 12/12 caught; tree unchanged after the run |
| Counted lines | 124 (+107/-17) in 12 files; each file at its guide cap |
| Hunk lines vs guide cites | widgets L10, app.css L8, budgets L4 import + L39, icons after L17, levels L24, stage L142, units L108, s6a L54/60/62, s6c L57/62/63/69, budgets test L124/127, f1 test L94/105: all match |
| Rule 8 | new test file one statement per line (braceless single-statement if/for per the standing ruling); smoke and test edits are in-place swaps inside existing lines, no statement added |
| Smokes on the trial (Chrome, playwright-core from /workspace/pw-tools) | s6a 18 ok, s6c 18 ok (both cover 390 and 360), s11c1 6 ok, s5a 16 ok, s6b 16 ok, s4c 16 ok; 0 FAIL |
| Trial shots vs UX f02 mock (docs/maker/shots/f02-game-menu.png) | Budgets icon is the same stacked-cylinder drawing as the mock; rename pencil leads the name button |
| PLAN-DELTA on plan 97cbf0ba (unchanged on 6ac84b5d) | applies; gives ef212329, 461 lines; edits L67, L70 (to two rows) and adds one line after L85; the CEO 03:53 order line L85 is untouched |
| Paste | L1 token placeholder only, L2 helper line, no token; covers a docs-only main move |
| PUSH-LIST | 4 files (guide + kit 3); *.r0 copies, paste, trial, plan files and shots are box-only |

## Re-pins EA asked about
- **Ruling 5 (budgets-11c1 L124/L127):** the old pin counted every `aria-hidden="true"` (4 meters, split length 5); the new Budgets icon SVG adds a fifth hidden node. Counting exactly `<meter …aria-hidden="true"></meter>` = 4 keeps the original intent (four decorative meters) and is stricter on meter markup. The total of 5 hidden nodes is pinned in the shipped test (open row). Accepted.
- **Ruling 7 (f1-look-kit L94/L105):** L94 is the same full-string pin with only the On option's label changed. L105's regex now needs the colon form for both options, so it is stricter (the old `(: Off)?` also matched the bare label). Accepted. F1 kit plants P20/P24 no longer apply after F2a1; the F1 folder stays as history, which is fine, and the F2a1 record should say so.

## Nits (not blocking; no re-roll needed)
1. Guide L131 cites ART1b's `?? [0, 0, 0]` at sprite.ts "L55 and L71". Those are the ART1a r1-tip numbers; on main they are L59/L75. Fix if the guide is re-rolled for any other reason; otherwise the ART1b guide must cite L59/L75 on main.
2. The *.r0 copies (PUSH-LIST.md.r0, SHA256SUMS.r0, step-f2a1-paste.md.r0) in /workspace/share/f2a/ are outside the push list; delete or move them so no one pushes the wrong copy.
3. The plan split (F2a to F2a1 + F2a2) is EA's proposal; UX owns the plan and CoS adopts it. Correctly labelled as a proposal, not a CEO ruling.

## For the go
Main has moved docs-only to 6ac84b5d; the trial applies there (tree 324bd637). Floor 1198, no pin, plants 12/12.
