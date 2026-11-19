# QA review: step-00b-sides-from-data r1

**Verdict: OK TO OPEN PR.** No must-fixes.

Branch `step/step-00b-sides-from-data-r1-chatA`. Tip `87f67eae` (tree `901f9d7a`). Code head `aeb9a623` (tree `ae649638`). Base `02efdd04`. Guide `docs/maker/steps/step-00b-sides-from-data.md` r1, the same on main and the branch (115 lines). CoS report `2dc0c51a` was used only as a pointer. Fresh worktrees under `/tmp/q`, removed after use.

## Gates
- **G1 tests:** `npm ci && npm run green` exit 0. 1060/1060, 0 fail, 0 skipped, 0 todo (floor 1053 + N=7). Typecheck, lint, deps, check:state and check:law are OK.
  - The 7 test names match guide L77-83 character for character. The guide gives names and specs, not a verbatim file or sha, so there is no sha to check; the specs are met (read against L77-83).
  - On the base, the test file alone gives **0 pass / 7 fail**, which matches HB L29.
  - **Mutations:** `sides.ts` `contest: present.length >= 1` fails only test 3 (free roam). `paintOf` with the neutral branch dropped fails only test 6 (colour). Both reverted afterwards.
  - P2 `one-parser` passes unedited.
- **G5 do-not-touch: PASS.** The diff is 6 `tools/play-stage/*.ts` files, one new test and the handback. Nothing under `src/`, `tests/tools/golden`, `handoff/` (smokes), `tools/host-example`, `scripts`, `fixtures` or `data`. No existing test was modified.
- **G7: PASS.** Guide L99 `git diff --shortstat 02efdd04..HEAD -- . ':!handback/**'` gives 7 files, 130+/37- = **167** ≤ 400, the same at the code head and the tip. Per-file numstat matches HB L114 and every file is within its cap (match 15/17 vs 35, board 8/5 vs 20, load 10/10 vs 22, looks 3/2 vs 10, hud 3/3 vs 8, sides 12 vs 25, test 79 vs 110).

## Laws and behaviour
- **No hard-coded sides:** no `"player"` or `wolves` remains in `match.ts` or `board.ts`; test 7 also scans for `wolves` and `.team`. `SIDES` and `type Side` are gone. `me`, `order` and `contest` come from `play.sides`. The wipe check runs only when `contest` is true (`wiped?.(…) ?? null`). Bots run `play.bot(world, side)` for every side after `me`.
- **sides.ts** (12 lines) is pure. It uses `Object.hasOwn` guards, and `me` defaults to `"player"`, which is the format's own default (§6.5; guide L93), not a silent one. No empty catch and no new rAF in the diff. No `src/` change, so engine, UNIT/TILE pipes and Law 13 (`src/runtime`) are untouched. §3 I: every touched file is ≤ 171 lines, and `sides.ts` holds the job the guide gives it (L66).
- **hud** uses `view.mine` for the banner and End-turn colour. `view()` sets `mine: side === me`.
- **Sprite ids are stable:** the scene sprite is the recipe id for the first paint of each recipe, and `<recipe>@<paint>` after that. The S0 smoke, which finds units by sprite id, passes. `dressPx` splits at the last `@`, needs a known recipe and an own `TEAM` key, and paints neutral when there is no `@`.
- **Parity:** seed 24301 passes. Golden `90dde42a` is unchanged and has no diff.
- **Smokes** under `/usr/bin/google-chrome`: S0 (sha `d528795e`, unedited) passed 2/2 runs, 7 ok at 390 and 7 at 360. s3 passed 2/2 runs with 18 ok. s4a passed 2/2 runs with 16 ok.
- **Build** exits 0 (stamp `aea638c4c7f6`). **Export audit:** compared with the base build, the play-stage release changes only `build.json`, the 5 edited `tools/play-stage/*.js` files and the new `sides.js`. No editor/maker code and no dev globals. The maker adds only `sides.js`.

## CoS notes and HANDBACK drift
- **Guide L42 path:** it lists `bot-ability-priority.ts` after `src/rules/battle/…`, implying `rules/battle/`. The real file is `src/rules/turns/bot-ability-priority.ts`, and L18 (`foeOf`) is right. CoS's report quotes this as "`src/rules/ai/`", which the guide does not say. It is a guide typo, a docs-only non-blocker, and changes no code.
- **`match.ts:136` / `board.ts:132` `recipeIn` tails:** both lines already call `recipeIn(body.recipes, …)` at base `02efdd04` (from step 02b, carry A). The guide cites them as `recipeOf` because it was checked on `3bd3e5db`. This step keeps `match.ts:136` as is apart from `"player"` → `me`, and replaces `board.ts:132`'s `worn` lookup with the guide's paint map (Rules 6). **Not creep:** no new `recipeIn` behaviour, it is just the current helper.
- **HANDBACK** matches git: shas, 1060/0, 130 + 37 = 167, numstat and caps, parity, smoke lines and the base-fail line. HB L118 says the second helper review had not returned; the self-review covers it.

## Non-blockers
1. The hud colour switch (`view.mine`) has no test. A mutation back to `view.side === "player"` still passes green, because the hud is DOM-only and the guide asks for no test. A cheap hud test would pin it in 4b.
2. A stage whose only starting side is not `me` gets `contest` false, so it has no outcome and that side plays forever. That follows the data (Rules 1-2). 4b's no-enemy info row should cover the case.
3. Fix the guide L42 path (`src/rules/turns/bot-ability-priority.ts`) in the next guide revision.

## Merge tree
`git merge-tree --write-tree 461596eb 87f67eae` is clean and gives **`84968a8d`**, as CoS predicted. Its diff vs the branch tree `901f9d7a` is docs only (`docs/rebuild/step-04a.md`, `docs/qa/step-04a-r2-review.md`, `docs/qa/rebuild-step-04a-review.md`).
