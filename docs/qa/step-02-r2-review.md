# QA handback review: step-02-home-save-load r2 (the rework round)

QA & Build Guard, 2026-11-19, Europe/London. Read-only. Branch `step/step-02-home-save-load-r1-chatA`: tip `46fd3346209710c15065bd3feeba8bfb4c7745a5` (tree `328d6199`), code head `d797b8b9` (tree `4a934890`), base `772f7aa2`. Spec: step-02 **r8** on main `b999f6e6` (blob `7df0f328`). The r1 review `docs/qa/step-02-handback-review.md` is already on main, so this is a separate file. CoS's r2 section of `/workspace/share/step02-verify/report.md` was read and rechecked. Fresh `/tmp/q` worktrees were removed. No GitHub writes.

## Verdict: OK TO OPEN PR

All three r1 must-fixes are done. Every gate and law check passes on the tip and on the merge result.

## Re-run (fresh worktree at 46fd3346)
- `npm ci && npm run green`: exit 0, **1039/0/0/0** (1036 + N=3). Typecheck, lint, deps, check:state and check:law all OK.
- Smoke sha256 is `d528795e…` (unchanged). **7 ok lines at 390 and 7 at 360**, then `TOUCH SMOKE PASS`.
- Build stamp **`701bc957035c`**. `index.html` links `./701bc957035c/tokens.css`, then `./701bc957035c/app.css`, then `tools/maker/home.js`, all on L6, plus the 3 no-cache metas. `build.ts` L11 adds `bag.set("app.css", …)` right after the tokens line.
- Export audit on the output: no `.ts`, `.map` or `dev.js`. No hits for `// dev-only`, `\bDEV\b`, `sourceMappingURL`, `window.__`, `ui-shell` or `fixtures/`, and no raw U+2028/2029.
- **Line gate**, using r8 L109's command (`':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handback/**'`): **12 files, 377 insertions, 0 deletions = 377 ≤ 400**. `app.css` is counted at 39 lines. Templates hold only `.json`.
- `tokens.css` is byte-equal to r1 L1–L80: the token block, the body font stack and `font: inherit`. `app.css` is byte-equal to r1 L81–L119 and contains no colour literals, `font-family` or `@import`.
- Scope vs base: `tools/play-stage/`, `touch-play.test.ts`, `play-stage-carries.test.ts`, `package*.json`, `tsconfig.json`, `scripts/`, `handoff/` and `docs/` have **no diff**. `test-output.txt` was deleted in r2 and is absent from the tip tree. HANDBACK § Green carries the `# tests 1039 …` summary.
- Live check in Chrome at 390×844, light theme:
  - Empty state, New → Demo → name and the blank-name message all work. Reload keeps the project, and Duplicate ("My game copy"), Rename, Delete with the toast, Trash and Restore all work. A corrupt `project.json` shows "Can't open: …" with no open button.
  - With OPFS missing or refused, the app shows the typed error sentence and no buttons.
  - The **only disabled control is Test** (y 768–824, `--soon`), and tapping it does nothing. Every control is ≥ 48×48.
  - My shots match the handback's r1 PNGs in layout. The pixel differences are only font antialiasing (`system-ui` resolves to a different font on this box).

## Merge result
`git merge-tree --write-tree origin/main 46fd3346` gives **`16b91d1b`**, clean (CoS's tree matches). Against main, the merge only adds step-2 paths (maker, templates, 3 tests, `handback/step-02…`). It keeps main's docs, not the branch's: step-02 is r8 `7df0f328` (not the branch's r6 `25c0ee1a`), step-03 is `58c77102` (not `eca581a1`), step-02b `a25a44ff` is present, and the roadmap is main's `2c9adc09`. Green on `16b91d1b` is **1039/0** (exit 0), and the smoke prints **14/14 ok** with PASS. A PR merge commit is fine; no rebase is needed.

## Non-blocker rulings
1. **The unused `.row` / `.row .btn` rules kept (app.css L29–30): accepted.** r8 L61 asks for them to be dropped, but keeping them costs 2 counted lines (377 vs 375) and breaks no gate or law. Carry: drop them in the next maker-touching step (Step 3).
2. **HANDBACK under `r1/` with an "r1" title: accepted.** CoS kept the `-r1-chatA` branch for the rework, and the folder matches the branch. HANDBACK.md cites code head `d797b8b9`, base, 1039, 377 and stamp `701bc957035c`, and records the QA rework (L77). The r1 hand-back stays readable at `477e021e`. Carry: from Step 3 on, a rework gets an `r<N>` folder and title, as HAND-BACK.md says.
3. **The r6 guide blob on the branch: accepted.** The branch never touches `docs/`, so the merge takes main's r8 (above), and nothing stale lands.
4. **Note:** a PR merge commit puts `477e021e` (and its 6298-line `test-output.txt` blob) into main's history but not into its tree. The repo is private, so this is harmless. If CoS wants the log out of history too, use a squash merge.

## Carries still open (from the r1 review, unchanged)
These are non-blocking carries 1–7 and 9–11. They include the Effect Designer code inside the maker bundle, the OPFS test that only greps the source, the doubled "Undo" in the toast, `saveCurrent` not re-reading `project.json` from disk, and the template routing that silently defaults to Empty. Carry 8 now belongs to step 02b.
