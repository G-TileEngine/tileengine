# QA pre-go review: step 11c1 (budgets) guide r2

2026-11-26 23:4x London, QA & Build Guard. Inputs, from /workspace/share/s11/:
- Guide step-11c1-budgets.md r2, d876765f, 164 lines.
- Paste step-11c1-paste.md, 39090ac2.
- Trial patch s11c1-trial.patch, 2e913edc, 588 lines.

**Verdict: OK TO SEND after one paste edit (P1 below). The guide and the trial pass as they are.**

## What I re-ran myself (fresh worktree on main 4c6d1c40, which has not moved)
- `git apply --check` and `git am` both clean. Tree 2111bb7c, which matches the guide's trial tree.
- Count 393/400 (382+ 11−, 14 files). Every per-file number matches the Build table brackets, and each file is under its cap.
- Green: exit 0, 1175 pass and 0 fail. tsc shows only the 3 base errors: page.ts L101 and home.ts L92 ×2.
- 24 smokes solo with my own runner, all PASS with the guide's counts. s11c1 solo on 8823 gave 6 ok, SMOKE PASS.
- I looked at my own three 390×844 shots. Row 02 shows `Units 7 of 9 · near limit` and `Active AI 2 of 1 · over limit`. Effects and Stage size have no suffix. Shot 03 shows the gate sheet with UX's activeAi line, and it is taller than 0 px.
- Export audit: 136/150/150 files, AUDIT PASS.
- EA's C1–C28, re-run on my worktree: 28/28 caught.
- My own extra mutations, all caught:
  - Q1, the Budgets row moved after Build game: caught only by smoke step 1 at 390 and 360; test 5 passes.
  - Q2, a non-object `budgets` gives no row: test 3.
  - Q3, neutrals not counted in units: tests.
  - Q4, budgetNear made hard: tests.
  - Q5, stage names ignored: test 4.
  - Q6, stageTiles w and h dropped: tests.
- Hashes I checked:
  - DSK rulings doc e997db72, 47 lines.
  - cn-budgets.diff 227a9333, staged result 897d51db, and its base copy 439f403d.
  - core-types on main is 439f403d and the trial leaves it untouched.
  - UX ruling 96162870.
  - roadmap at 4c6d1c40 is 5c210ecd.
- The three local type lines in budgets.ts match CN-029's type text. Only CN-029's trailing `// int, 1 ≤ warn ≤ limit` comment differs, which is fine.
- The fixture is byte-equal to the demo template. All three files carry option A's four lines: units 40/80, activeAi 12/24, effects 8/12, stageTiles 16384/65536.

## Build law
- One clock: no new timers or animation-frame callbacks. Pipes: the reader and the gate only, nothing in core, sim, runtime or rules. Own entry and pack: no new dependency or pin.
- Scope matches the Build table. Law 12: the absent-budgets path gives no rows and no default, and a broken entry gives a `budgetInvalid` warning. Law 13: nothing grows over time.
- One statement per line in the new src, tools and tests code. The smoke keeps the s10c layout. The dense-line edits are only the two the guide names (test-launch L31 and home L47).
- The smoke waits with waitForFunction only, and every tap is a touch tap. The new button reuses Build game's 48 px style.

## Must-fix before the go
- **P1, paste.** The handback line asks for "the guide's mutations C1–C20", but the guide's Measured and Done when list C1–C28 (r2 added C21–C28). Change it to C1–C28 so the builder records all 28.

## Carries (not blocking, for 11c2 or later)
1. Test 5 doesn't pin the row's place before Build game. Only the smoke does (Q1).
2. `budgetsRow` runs parseProject and readProject again on every paint of the project screen. The base already parses several times per paint, so this is one more full read. The CoS S21 phone check at the hard limits should time the project screen too.
3. The `let open` state in tools/maker/budgets.ts is module-wide, so the row stays open when you open another project.
4. `testGate`'s `names = {}` parameter default is only reached by old tests: both production callers pass `stageNames(load)`. The guide allows it so existing tests stay unedited.
5. The CEO's option A ruling (23:12) is relayed by CoS and correctly labelled "via CoS". I have not seen it myself.
