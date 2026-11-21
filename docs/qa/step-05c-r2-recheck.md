# QA recheck: Step 5c r2 (Law 12 must-fix)

Date: 2026-11-21 (Europe/London). Reviewer: QA & Build Guard. First review: step-05c-review.md (1c7e556e).
Tip e2e0463d (tree 4db8eb34), code head f308d135 (parent f75e5386, no force-push), base main 88a6ac93.

- **Must-fix 1: fixed.** `tools/maker/unit-diagram.ts` now returns a `{reason}` view. When `readProject` fails it gives the load report text, and when `playDocsOf` throws it gives the message. A non-Error or empty message is rethrown. `diagramHtml` shows `<p class="sub" data-diagram="off">` (escaped) and draws no grid. HB:128 and HB:130 updated.
- **Plant:** forcing an unmarked grid on a reason makes `the Empty template gives that visible reason line` fail. Restored afterwards.
- npm test on a clean install: 1082/0/0/0 (floor 1081+1).
- G7 guide command (L94-95, s5c dir): 17 files, 355+38=393 (400 or fewer). Over-cap files named at HB:130.
- Smokes at the tip: s5c 8804, s5b 8803 and s5a 8802 all SMOKE PASS. There is no play-stage or behaviour-library diff, so S0 is not required.
- `git merge-tree --write-tree origin/main e2e0463d` gives 4db8eb34.

Verdict: **OK TO MERGE.**
