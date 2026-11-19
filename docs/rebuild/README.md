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

Follow them strictly in order. Between steps, main also gained docs-only commits; a step's start commit is always the one named in its file.

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

Each step's file is written right after that step merges and passes QA's post-merge check, and before the next step's go-line goes out. A step isn't finished until its rebuild file is on `main`.

## Rules for every step (from the briefs and QA reviews)

- Work on a branch `step/<step-id>-r<N>-chatA` from the named base. Never commit to main, never force-push, never delete a branch.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). The last commit adds only `handback/<step-id>/r<N>/HANDBACK.md`.
- Gate: `npm ci && npm run green` exits 0 at floor + N (at the baseline and in S0, only the known ui-shell lint fails; see `baseline.md` (d)). `npm test` alone isn't enough.
- 400 changed lines or fewer per run, counted the way the brief says.
- After any play-stage change, run the S0 touch smoke unchanged and paste its result.
- Never print, log, commit or store a token. The push command reads it from an environment variable that must hold the real value, not the placeholder text (see `step-01a.md` (d) 6).
