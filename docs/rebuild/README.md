# docs/rebuild: how each step was actually built

## What this folder is for

A brand-new AI (or a new chat with no history) can point at this repo, start at `baseline.md`, and follow the files here in order. Doing so recreates the engine exactly as it was merged on `main`: the same files, the same code, the same test count, and every bug fix found along the way, already applied.

The rebuild doesn't start from an empty repo. Before the maker steps, the engine already had about 7,300 lines of engine code in `src/` (19,378 lines across `src/`, `tools/`, `tests/` and `scripts/`). `baseline.md` names that commit, lists every file in it, and shows how to check it. Each step file then starts from where the previous one ended.

The step briefs in `docs/maker/steps/` say what each step had to build *before* it was built. They stay as they were. The files here are the record of what happened *after*.

## Order

| # | File | Step brief | Starts on | Ends on |
|---|---|---|---|---|
| 0 | `baseline.md` | none | `1b834c31` (tree `12f833ed`), 1014 tests | same |
| 1 | `step-00.md` S0 touch play | `docs/maker/steps/step-00-play-input.md` | `1b834c31` | PR #76, merge `9a9ca90e`, 1023 tests |
| 2 | `step-01a.md` S1a project reader | `docs/maker/steps/step-01-project-format.md` §1a | `f137ca26` (main after S0, with the ui-shell lint ignore `8a737c5f` and the step 1 brief) | PR #77, merge `aa158fda`, 1034 tests |
| 3 | `step-01b.md` S1b play stage loads the project | `docs/maker/steps/step-01-project-format.md` §1b | `aa158fda` | PR #78, merge `57af7135`, 1036 tests; smoke refreeze `9fc49890` |
| 4 | `step-02.md` Home, save and load | `docs/maker/steps/step-02-home-save-load.md` | `772f7aa2` (smoke-refreeze `9fc49890` plus one docs-only commit) | PR #79, merge `34fda674`, 1039 tests |
| 5 | `step-02b.md` play-stage carries A and B | `docs/maker/steps/step-02b-play-stage-carries.md` | `34fda674` | PR #80, merge `fdf29002`, 1041 tests |
| 6 | `step-03.md` Test plays the project | `docs/maker/steps/step-03-test.md` | `fdf29002` | PR #81, merge `b8f2b480`, 1049 tests |
| 7 | `step-03b.md` slice r29 | `docs/maker/steps/step-03b-slice-r29.md` | `fdb7ad56` (main after the step 3 r2b QA review) | PR #82, merge `402699d5`, 1051 tests |
| 8 | `step-04a.md` stage editor and terrain painting | `docs/maker/steps/step-04-stage-editor.md` §4a | `402699d5` | PR #83, merge `02efdd04`, 1053 tests |
| 9 | `step-00b.md` sides from data | `docs/maker/steps/step-00b-sides-from-data.md` | `02efdd04` (the 4a merge; 00b was built after 4a) | PR #84, merge `d62f87bc`, 1060 tests |
| 10 | `step-04b.md` stage place | `docs/maker/steps/step-04-stage-editor.md` §4b | `d62f87bc` | PR #85, merge `a85ae665`, 1063 tests |
| 11 | `step-04c.md` stages and maps | `docs/maker/steps/step-04-stage-editor.md` §4c | `a85ae665` | PR #86, merge `9bbd115a`, 1065 tests |
| 12 | `step-05a.md` units list and editor | `docs/maker/steps/step-05-units.md` §5a | `37f42de3` (04 guide L166 erratum after the 4c merge) | PR #87, merge `b8c1084e`, 1070 tests |
| 13 | `step-05b.md` abilities | `docs/maker/steps/step-05-units.md` §5b | `0dc2c588` (5a r2 QA recheck on main) | PR #88, merge `c66760b7`, 1074 tests |
| 14 | `step-05c.md` + Add ability | `docs/maker/steps/step-05-units.md` §5c | `88a6ac93` | PR #89, merge `5a2c8e79`, 1082 tests |
| 15 | `step-06a.md` win rules, Rules panel, On your team | `docs/maker/steps/step-06-levels-win-rules.md` §6a | `ae968eb0` | PR #90, merge `23b5755f`, 1093 tests |
| 16 | `step-06b.md` levels, Level curve editor, XP strip | `docs/maker/steps/step-06-levels-win-rules.md` §6b | `0ac31c87` | PR #91, merge `be8ce821`, 1102 tests |
| 17 | `step-06c.md` tactics checkpoint, Empty to a win | `docs/maker/steps/step-06-levels-win-rules.md` §6c | `68a67a56` | PR #92, merge `be4f47e1`, 1105 tests |
| 18 | `step-06d.md` phone baseline page | `docs/maker/steps/step-06d-baseline-page.md` | `cbe0dc8a` | PR #93, merge `aa2ef7e3`, 1108 tests |
| 19 | `step-07.md` stage links and the two-floor shop | `docs/maker/steps/step-07-stage-links.md` | `33538c89` | PR #94, merge `24ab0250`, 1114 tests |

Follow them strictly in order (rebuild order, not numeric: step 00b starts on the 4a merge, so it sits after `step-04a.md`). Between steps, main also gained docs-only commits; a step's start commit is always the one named in its file.

## How each step file is laid out

Each step file stands alone and links to its original brief. It has the same parts:

- (a) start base and merge commit, PR and test count
- (b) every file added or changed, one line each
- (c) the key code explained, plus the git commands for the full diff
- (d) what went wrong, in order, and the fix
- (e) "do it right first time": the rules that stop those failures repeating
- (f) rebuild check: the commands that prove the result matches
- Blob check: the exact git blob id every shipped file must have at the merge
- Appendix: the full code as merged. New files in full; edited files as the exact diff from the step's base, then in full

Facts are cited by commit sha or `file:line` at the commit named.

## Keeping it current

Each step's file is written right after that step merges and passes QA's post-merge check, and before the next step's go-line goes out. A step isn't finished until its rebuild file is on `main`. When a new record lands, add a row to the Order table in this file.

## Rules for every step (from the briefs and QA reviews)

- Work on a branch `step/<step-id>-r<N>-chatA` from the named base. Never commit to main, never force-push, never delete a branch.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). The last commit adds only `handback/<step-id>/r<N>/HANDBACK.md`.
- Gate: `npm ci && npm run green` exits 0 at floor + N (at the baseline and in S0, only the known ui-shell lint fails; see `baseline.md` (d)). `npm test` alone isn't enough.
- 400 changed lines or fewer per run, counted the way the brief says.
- After any play-stage change, run the S0 touch smoke unchanged and paste its result.
- Never print, log, commit or store a token. The push command reads it from an environment variable that must hold the real value, not the placeholder text (see `step-01a.md` (d) 6).
