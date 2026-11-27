# QA: F1 postmerge and rebuild record review

Reviewer: QA & Build Guard. Date: 2026-11-27.

**Postmerge: PASS. Record: OK** (r2, after one round of three fixes).

## Postmerge

I ran `qa-postmerge.sh b6c3da0e e173f394 --qa-tree b4c8168f --floor 1188`. Main was `d901b075` at the time.

What passed:
- The merge is `b6c3da0e` (PR #114). Its tree is `b4c8168f`, the expected tree from the r2 review.
- Parents are `bf07a227` and `e173f394`. Parent 2 is the picked tip.
- Author and committer are both noreply.
- The diff of src, tests and tools from the merge base to the tip equals the diff from parent 1 to the merge.
- Merge versus tip shows nothing besides the 2 QA docs that are only on main (`bf07a227`).
- Pins: 5/5 unchanged.
- npm test: **1188/0**, which is the new floor.
- Smokes: 0 failed.

The one warning was that main moved 1 commit. That commit is `d901b075`, which adds only `docs/qa/step-f1-r2-review.md` (sha256 `cb0cd581`, 32 lines, as sent).

## Rebuild record

r1 (`step-f1.md` `771c08ad`, 1210 lines) was NOT OK TO PUSH, with three factual fixes:
1. The eight smokes in the trial were 12+ 12−, not 13+ 13−, per `git apply --numstat` of `f1-trial.patch`. The guide's Size row overcounts: its rows sum to 293+/86−, not the 292/85 it states.
2. F-b attribution. V1 named the read-only Save, which QA1 found present in r1. CoS's r2 hand-off note, not V1, said the trial had the levels thumb, and QA2 checked the trial patch.
3. The postmerge row was missing QA's own run.

r2 is `step-f1.md`, sha256 `af2213b9d09e1a20684c88599385bb5e94c03d6ea6241c98a551b28e4f5995b2`, 1211 lines. Its diff against r1 is the three fixes plus one new Guide drift line in (d), and nothing else. The README is unchanged: `f2cebe56`, 80 lines, with row 35 as the only change against main. The push list `f12b3399` matches both files, and the tree holds only those two.

Checked against git:
- All 27 blob ids and line counts in the blob table are correct at `b6c3da0e`.
- All 27 appendix sections are byte-equal to `git show` (new files) or `git diff bf07a227 b6c3da0e` (edited files).
- The (b) numstat equals the merge. Against the trial's numstat, only icons.ts (24→22) and widgets.ts (9+→8+) differ.
- The official count is 27 files, +289/−85, so **374**.
- These blob, sha256 and line-count values match: the guide (`7db91427`, `9d7ecff2`, 201), the shipped test (`28be62ac`, `83ef2acf`, 149), the plants (`806f5fd2`, `2f23d56c`, 48), QK1–QK3b, QA1, GL, QA2, HB1 (`e2020f64`, `c01286fa`) and HB2 (`7f57083a`, `1fc785d6`).
- The paste is `3ac35cd7`, 10 lines, and V1 is `c9a9a88e`.
- Trees and UK times match: 04dadacf 16:54 (`15abc6fd`), bf07a227 18:48 (`9d5f2e12`), d901b075 20:01 (`b7bb006e`). 04dadacf's parent is `e0455199`.
- The base tsc error at home.ts L92 is the same line as L93 at the merge.
- The (f) commands hold at the merge:
  - tokens.css is unchanged.
  - There is no bare `class="btn"` and no ⋯ or ▶ in tools/maker *.ts.
  - icons.ts L2–L17 equal GL L5–L20.
- The GL note is accurate: the pushed go-line has no token line and no helper-agents line.
- 0 token patterns.
