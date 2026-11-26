# QA review: step 10d r1 (built-in effects), PR #106

QA & Build Guard, 2026-11-26. Verdict: **OK TO MERGE**. No must-fixes.

- PR: https://github.com/G-TileEngine/tileengine/pull/106, branch `step/step-10d-builtin-effects-r1-chatA`.
- Tip `07f12d8d878c7af6ce62be321728ec578e0afc39` (tree `ed4a2bf3ee9007ccea3749005ae4425d4995ac5b`, docs only: HANDBACK.md sha256 `055c96efc5ee1f4c4c09e67badb6df667a12d67ac9b8456e3490dd35dd231146`).
- Code head `d0230b29fa28b1635b9104128bc4a579f5e1d54a`; its parent is the paste commit `de22e8af` (already on main). Base `ef25669a`.
- Guide: `docs/maker/steps/step-10d-builtin-effects.md` r2 (sha256 `96e9e894…6d2d46e0b`, 112 lines).
- Expected merge tree onto main `de22e8af`: `git merge-tree --write-tree origin/main 07f12d8d` gives **`ed4a2bf3ee9007ccea3749005ae4425d4995ac5b`** (same as the tip tree: the branch already contains main).

## Run (fresh worktree at the tip, `npm ci`)
- Green: exit 0, **1160 pass, 0 fail** (floor 1160).
- tools tsc: 3 errors (the 3 base errors).
- All 21 smokes solo, first run, on the guide ports: S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, **s10d 8**. Tree clean after the run.
- Export audit (`/workspace/share/s8/s8-audit.mjs`): **AUDIT PASS**, 134 / 148 / 147.

## Size and caps
- Code commit: 10 Build-table files, 252+ 12− = 264 / 400. With the 12-line paste (already on main) the shortstat over `ef25669a` is 276.
- Per file (cap): builtin-fx.ts 23 (24), builtins.ts 34 (40), ability-panel.ts 24+ 2− (26, on cap), project.ts 12+ 4− (24), fx.ts 10+ 2− (14), load.ts 1+ 1− (2), board.ts 1+ 1− (2), effects-slot.test.ts 2+ 2− (4), effects-10d.test.ts 77 (80), s10d smoke 68 (70).
- One statement per line in new src/ and tests/ code: kept. The cast loop in fx.ts is unjoined. No wraps, splits or joins to fit a cap. The smoke keeps the s10c layout (exempt per guide L62).

## Rules and law
- Rules 1–6 match the guide. A saved id still wins; a built-in sets `fxOf` to the bare id and adds `fxBuiltins`; the cast swaps only when the table has the ref (stock otherwise, format L1713); writers write bare ids; alias reads as pressed and is never rewritten.
- Layers: nothing in `src/core`, `src/sim`, `src/rules`, `tools/effect-designer`, fixtures, catalogue, behaviour-library or format docs. The only new play-stage import is `src/project/builtin-fx.ts`. No `te-*` in the row. No CSS, no new rAF, timer or loop. No new effect documents, no drawing code.
- Smoke s10d uses `waitForFunction`/`waitFor` only (no timeouts or sleeps).
- No token, raw log or smoke shot committed.

## Mutations (QA's own, in a second worktree on the code head)
- Swap without `table.has` → 10b test 5 and 10d test 3 fail.
- Catalogue-rev gate dropped in `withFx` → 10d test 2 fails.
- `builtinFx` returns empty values (defaults and overrides dropped) → 10d tests 1 and 3 fail.
- `aria-pressed` by bare id only (alias not matched) → 10d test 2 fails.
The builder's recorded mutations (guide L88 list) are all present in § Smoke.

## HANDBACK
- Code head labelled apart from the docs-only tip, both shas given. § Helpers lists f5e7a87d, be284aae, a9e95058 and the three `/tmp` scripts.

## Notes (not must-fixes)
1. HANDBACK § Export audit says `/workspace/share/s8/s8-audit.mjs` "is not on disk"; it is on disk now (box refresh). The builder ran an equivalent check; QA ran the real script above (PASS, same counts). Wording drift only.
2. `a:fx:` now returns `{ keep: true }` when the open setup's `behaviourId` is not a string, before the 10c none/saved write. Not reachable from the UI (the row needs that id), and recorded in Decisions. Carry for the next touch of `ability-panel.ts` if it ever needs that path.
3. HANDBACK § Green: the builder's first green run died at test 685 and was re-run; QA's green completed at 1160/0.
4. DSK questions 1–3 in the guide stay open (not 10d scope).
