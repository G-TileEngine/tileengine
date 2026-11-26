# Step 10d guide and paste review (kit r1)

Verdict: **OK TO SEND after one wording fix** (guide L62 and paste L9). Everything else checks out.

- Hashes match: guide 2aaf757b (112 lines), paste a3e41653 (12 lines), trial patch 45f1fc75 (353 lines). Base main 08d5b2dc = origin/main.
- Trial on a fresh 08d5b2dc worktree: applies cleanly; counted 10 files 200+ 13- = 213/400; every file's count matches its bracket and is under its cap (caps sum 286).
- My run: green 1160/0 (floor 1157 + 3), tsc 3 base errors, all 21 smokes PASS solo (s10d 8 ok at 8817 r1), AUDIT PASS.
- Mutations spot-checked as the guide claims: swap without `table.has` fails 10b test 5 and 10d test 3; gate dropped in `withFx` fails test 2; base `fx.ts` fails 10b test 5 and test 3; clean 9/9.
- Read-first line refs checked on the base (read-project L56/L67, project.ts L52/L64, fx.ts L15/L39/L47, board L95, load L23, add.ts L35, slice-of L14, catalogue.ts L7, ability-panel L75, home L45, fx-doc L10): all land.
- Layers: play-stage imports only `src/project`; no new rAF, timer or loop; Must NOT is clean in the trial.
- Attribution: EA rulings and DSK-to-EA labelled; nothing is called a CEO ruling. Helper-list carry from 10c is in (guide L22, paste L6).

## Fix (must, before send)
- Guide L62 and paste L9 say "one statement per line in new code", but the trial's new smoke `s10d-builtin-effects/smoke.mjs` has 24 lines with several statements (the s10c smoke style; s10c has 20). Split to one statement per line, it would go over its 70 cap (53 now). As written the builder either copies the trial and breaks the rule, or follows the rule and goes over the cap: the same fight as 10c. Say which applies. Suggested wording: "one statement per line in new src/ and tests/ code; the new smoke keeps the s10c smoke layout, as in the trial." No other change, trial unchanged.

## Notes (no change needed)
- The two touched pre-existing lines that already held several statements (`fxRow` in ability-panel, the `createPlayFx` call in board.ts) only gain an argument. That's fine.
