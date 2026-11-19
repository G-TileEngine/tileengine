# QA handback review: step-02b-play-stage-carries r1

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch`.

- **Branch:** `step/step-02b-play-stage-carries-r1-chatA`.
- **Commits:** tip `ad86194fb67ef0cf563d0d833fed2049205e848d` (tree `3464e06e`), code head `1df36efc` (tree `aa5bdf92`), base `34fda674` (the step 2 merge, PR #79).
- **Guide:** main's step-02b r2 (sha256 `c6bcd1d4…`, blob `a25a44ff`).
- **CoS report:** `/workspace/share/step02b-verify/report.md` (sha256 `4121cfc2…`) was read, then rechecked.
- **Housekeeping:** fresh `/tmp/q` worktrees were used and then removed. No GitHub writes.

## Verdict: OK TO OPEN PR

## Re-run (fresh worktree at ad86194f)
- `npm ci && npm run green`: exit 0, **1041/0/0/0** (floor 1039 + N=2). Typecheck, lint, deps, check:state and check:law all OK.
- **Smoke:** sha256 `d528795e…` (unchanged). **7 ok lines at 390 and 7 at 360**, then `TOUCH SMOKE PASS`.
- **Line gate:** `git diff --shortstat 34fda674..ad86194f -- . ':!handback/**'` gives 7 files, **45 + 15 = 60**. That's under the 400 limit and the 70-line cap sum. Every file is under its cap: load 4/3 (cap 8), project 3/3 (8), board 2/2 (5), match 3/3 (8), build 1/1 (3), touch-play 4/3 (8), carries test 28 (30).
- **Why 60, not the guide's 59:** in `load.ts`, r1 had `}); export const recipeIn = …` on a single line. r2 ends the `RECIPES` freeze with `});` and puts `recipeIn` on its own line. That's needed for carry 8, because `recipeIn` now takes a required map, with no `| undefined` and no `map !== undefined` check. So load.ts is 4+/3− instead of 3+/3−. The other four play-stage files are byte-equal to r1 `477e021e`.
- **Scope:** the diff touches only `tools/play-stage/{board,build,load,match,project}.ts`, `tests/tools/touch-play.test.ts`, the new `tests/tools/play-stage-carries.test.ts` and `handback/step-02b/r1/HANDBACK.md`. These have no diff: `src/`, `scripts/`, `fixtures/`, `tests/project/` (P1/P2/P3), `tests/editor/` (maker-law), templates, package/config files, the kit and docs.

## Carries
- **Carry A and carry B:** guide L36–37 are byte-equal to step-02 r6 L76–77. The code matches r1's carry diff.
  - `RECIPES` is `Readonly` and `Object.freeze`d.
  - `playDocsOf` copies it per load and writes aliases only to the copy.
  - board and match read `recipeIn(body.recipes, …)`.
  - The only remaining `RECIPES[…]` is the read in `recipeOf`, so nothing writes `RECIPES`.
  - `build()` escapes U+2028/2029 with no `JSON.parse` (P2).
- **Carry 8:** `PlayDocs.recipes` is required, and `recipeIn(map, id)` doesn't accept `undefined`. The tests drop their `?.`/`undefined` guards, and the carry A test adds `Object.isFrozen(RECIPES)`.
- **Mutation check** (`node --test` on the carries test):
  - Baseline: both tests pass.
  - Unfreezing `RECIPES` and writing aliases into it from `playDocsOf`: **carry A fails**.
  - Removing only the freeze: **carry A fails**.
  - Emitting the raw text (no escape): **carry B fails**.
  - The worktree was restored after each mutation.
- **Build law:** there's still one `requestAnimationFrame` in play-stage (same count as base). Nothing added is a `catch`, a silent default, game-specific engine code or ui-shell code. Missing ids still go through the existing named `fallback(id)`. Parity data is untouched (`tests/tools/golden`, the 24301 fixtures and tests have no diff).

## Merge result
`git merge-tree --write-tree origin/main ad86194f` (main `10308bba`, two docs-only commits after `34fda674`) gives **`b0eed0b8`**, clean. Against main, it adds only the 8 branch paths. It keeps main's docs: step-02b `a25a44ff`, step-03 `58c77102` and the roadmap `2c9adc09` are all unchanged. On `b0eed0b8`, green is **1041/0**, and the smoke prints **14/14 ok** with PASS.

## Non-blocker rulings
1. **The HANDBACK is at `handback/step-02b/r1/`, but guide L15 asks for `handback/step-02b-play-stage-carries/r<N>/`: accepted.** It's not product and not in the gate, and the HANDBACK names the full step id, base, code head and tree. Carry: from Step 3 on, the folder must use the full step id.
2. **"PR: opened by Chief Of Staff from the branch": accepted.** S1b and step 2 use the same wording.
3. **Guide L7 still says the step 2 sha is TBD: accepted.** The guide wrote it before the merge, and HANDBACK names base `34fda674`, the PR #79 merge, which the branch is built on. It's optional to pin `34fda674` in L7 in a later docs pass; it doesn't block this PR.
