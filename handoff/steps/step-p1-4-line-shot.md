# step-p1-4-line-shot: Phase 1 P1-4 "Own units + one spell" (foundation-plan-phased.md §3). `readUnit` / `readSetup` (own types, not pinned onto CoreUnit/CoreStage), additive stage `overrides`, ability table layered L0–L3, `line-shot` (range 3, damage 2; mana ignored until Phase 4), B1 S1 table-hash pin, label length in Unicode code points, and the L5 `difficulty.damage` warning kept (real L5 is Phase 4) so `installSetups` no longer skips it (QA R2).

Step id: step-p1-4-line-shot          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: current main when you start (at kit authoring, `origin/main` is `75df464243426061340d27372e1e97b485843ded`, runnable count **904** with P1-2 already merged). **P1-3 must already be merged on that main** (and therefore P1-2 too). Floor = that main's test count + 11. If P1-3 is not on main, or if P1-3's APIs on main differ from what the shipped tests import, **stop and report**. At kit authoring the P1-3 proto on this main is 917/0, so the authoring floor is **928**. Branch: `step/step-p1-4-line-shot-r<N>-chatA`, created from the Base. Never commit to `main`. The diff is always `<Base>..<head>`. One builder chat (ChatA), one QA pass, plus a rework round only if QA finds must-fixes; no A/B.
Hand-back location: `handback/step-p1-4-line-shot/r<N>/HANDBACK.md`. Quote this step file's sha256 in full in it.
Depends on: P1-3 (orthogonal reach, side filters, `inOrthogonalReach`, own-key `reachOf`) and B1 (`installOne`, `installSetups`, catalogue rev 26).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
After P1-3, the only attack is a basic hit for the attacker's `atk`, unit documents have no setup/ability table, list labels are counted in UTF-16, and `installSetups` skipped the L5 damage warning (QA R2). After this step:
1. **Line-shot.** One spell: reach 3, damage 2 (BTF fireball `spellReach` towerChessSpells.ts:215-221; usual damage 2 at towerChessSpells.ts:95 and towerContest.ts:42). `mana_cost` is read and ignored until Phase 4 (towerChessHand.ts:30 `SPELL_COST = 2`). An `ability` with `effects: ["line-shot"]` deals the spell's damage (not `atk`), `hitClass: "spell"`, and uses the spell's reach. Unknown effects stay `actionUnsupported`. The abilities lookup uses `Object.hasOwn` (not a prototype-key read).
2. **Ability table.** `abilityTableFor` resolves `{key, group: "basic"|"spells", reach, damage, effectRef}` as L0 catalogue → L1 setup answers → L2 stage overrides (additive, keyed by setup id) → L3 unit stats.
3. **Readers.** `readUnit` is the unit v2 subset `{sprite, setupIds, stats}` as its own type (not pinned onto `CoreUnit`). `readSetup` is behaviour-setup v3 identity plus answers. `readStageOverrides` reads additive `overrides` and stays off `CoreStage`; `readStage` still loads a stage that carries them.
4. **B1 carries.** Label length is `[...s].length` (DSK code points). The catalogue table hash is pinned to the literal `3b16c673b0afb3b3bae0fcac1909af1980168b30c7b1734595065e26f4a40eae` (B1 S1; a self-consistent restamp must not pass). `DAMAGE_RESOLUTION.afterInstall` keeps the L5 `layerNotApplied` warning (`L5 difficulty.damage`) when `difficulty.damage` is not 1, including through `installSetups` (QA R2). Real L5 damage layering stays Phase 4 — do not replace the warning.
5. **Catalogue / rev 27.** Catalogue stays **rev 26** (do not hand-edit `catalogue.ts`). `xp-levels` still reads legacy comma-string `thresholds`. An int-list at a layer is `invalidValue` until a Librarian regen types the knob; the install's `nums()` already accepts arrays so a later regen will not empty thresholds (open ruling).

## Rulings made
- L5 `difficulty.damage` stays a warning through P1-4; real layering is Phase 4 (plan + this brief).
- Catalogue is not regenerated (rev 26 hash pin stays). Rev 27 types wait on the Librarian.
- `BattleSetup.abilities` is copied at `plainCopy` depth 4 so a row of reach/damage/effectRef survives. `plainCopy` strips `constructor` / `__proto__` / `toString` keys, so a prototype-key unit id fires the default line-shot (reach 3, damage 2, `hitClass: "spell"`) and must not throw. The lookup still uses `Object.hasOwn`.
- Stage `overrides` are a sidecar (`readStageOverrides`), not a CoreStage field.

## Open questions
- Librarian: freeze a Phase 1 catalogue rev and regenerate (rev 27 install rewrite: `xp-levels.bar`, int-list `thresholds`, level-set arrays, `legacyConverted` notice)? The pin and comma-string path hold until then.
- Should a raw int-list on today's picker-typed `thresholds` already convert with a notice, or stay invalid (the default used here)?

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/btf-adapters/src/btf-defaults/spells.ts` | new: `BTF_SPELL_DEFAULTS` | 9 | 12 |
| `src/btf-adapters/src/index.ts` | export `BTF_SPELL_DEFAULTS` | 1 | 2 |
| `src/project/read/index.ts` | export readers | 2 | 4 |
| `src/project/read/setups.ts` | new: `readSetup`, `readStageOverrides` | 35 | 40 |
| `src/project/read/unit.ts` | new: `readUnit` | 38 | 44 |
| `src/rules/battle/abilities.ts` | new: `abilityTableFor` | 34 | 40 |
| `src/rules/battle/battle.ts` | line-shot branch; own-key abilities lookup; `plainCopy` depth 4 | 15 | 22 |
| `src/rules/battle/damage.ts` | `afterInstall` L5 warning; comment that Phase 4 does real L5 | 14 | 20 |
| `src/rules/battle/index.ts` | exports | 2 | 4 |
| `src/rules/battle/line-shot.ts` | new: `LINE_SHOT` | 20 | 24 |
| `src/rules/behaviours/registry.ts` | code-point labels; `afterInstall` on both install paths | 6 | 8 |
| `src/rules/behaviours/types.ts` | `afterInstall`; `difficulty.damage` on `InstallCtx` | 4 | 6 |
| `src/rules/behaviours/xp-levels.ts` | `nums()` accepts int arrays as well as comma strings | 2 | 4 |
| `tests/parity/line-shot.parity.test.ts` | new, shipped, byte-identical | 16 | 16 |
| `tests/project/unit-setup.test.ts` | new, shipped, byte-identical | 45 | 48 |
| `tests/rules/battle-p14.test.ts` | new, shipped, byte-identical | 89 | 95 |
| `tests/rules/battle-qa-p14.test.ts` | new, shipped, byte-identical (QA pin M1) | 25 | 25 |
| `tests/rules/battle.test.ts` | L5 title says the warning stays | 2 | 4 |
| `tests/rules/behaviours.test.ts` | S1 hash pin; 48 code-point label with an emoji | 6 | 10 |
Total ≤ 400 changed lines (proto **365**: src 182, tests 183). Hard cap 400.

## Tests that prove it is done (11 new; ship all six files byte-identical)
Copy byte-identical from `handoff/steps/tests/step-p1-4-line-shot/` to the same paths at the repo root. New: `tests/rules/battle-p14.test.ts` (7), `tests/parity/line-shot.parity.test.ts` (1), `tests/project/unit-setup.test.ts` (2), and `tests/rules/battle-qa-p14.test.ts` (1, QA pin; sha256 `5f5043c48203d8464cc2a07e9a7785eca86c2e27b43b318960b69a1d7c6b2de8`). N = 11. The two B1/P1-2 test files only pin the hash, code-point labels, and the L5 wording.

## How a planted bug is caught
EA plants 20/20 (`p1-4-plants.py`). A default reach of 4 or damage of 1, skipped L3/L2 layers, line-shot using `atk` or basic reach, UTF-16 label length, a skipped L5 note on the invalidValue path or through `installSetups`, a shallow `plainCopy` of abilities, or a `__proto__` leak in overrides each fail a shipped test.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 928 tests passing** (main's count at Base + 11, once P1-3 is on that main) and none failing. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto on the stack: 928/0.)
- [ ] If P1-3 is not on main, or if P1-3's APIs on main differ from what the shipped tests import, **stop and report**.
- [ ] Catalogue `rev` stays 26; `CATALOGUE.table` equals the literal pin. Do not hand-edit `catalogue.ts`.
- [ ] L5 `difficulty.damage` still warns and plays as 1; do not implement real L5 layering.
- [ ] Each file within its cap; ≤ 400 changed lines in total (365 in the proto). Hard cap 400.
- [ ] All six shipped test files are byte-identical to the kit copies.
- [ ] Never touch `painter-proto/` or `ui-shell/`. No game rules in `src/core`. Cites use `towerChessSpells.ts:<line>` (no `g-tile-engine` path in `src/`).

## Floor
`npm run green` is at least **928** tests passing (main's count at Base + 11, once P1-3 is on that main: 904 + 13 + 11). If main's count at Base (with P1-3 already merged) is C, the floor is C + 11.

## Not in this step
- Real L5 `difficulty.damage` layering → Phase 4.
- Catalogue rev 27 regen / `legacyConverted` → Librarian + a later B1 carry.
- Mana spend, cooldowns, a player door for choosing the spell → later / P1-6.
- Bots, action-budget, 200-seed soak → P1-5.

## Out of scope
painter-proto, ui-shell, GitHub push, core-types pin moves.

## Do not touch
`painter-proto/`, `ui-shell/`, `src/core`, `src/types/core-types.ts`, `src/rules/behaviours/catalogue.ts` (read only; do not regenerate), `src/sim/migrations`, every pin file except the listed B1 test pins and the shipped QA pin `battle-qa-p14.test.ts`. Do not run git in `/workspace/tileengine`, `/workspace/tileengine-repo`, `/workspace/g-tile-engine`, or their worktrees.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 928 tests passing** and 0 failing (main's count at Base + 11). Paste the summary line into HANDBACK.md.
- All six shipped test files are **byte-identical** to the kit copies.
- The branch starts at the Base (P1-3 already on main). ≤ 400 changed lines. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-p1-4-line-shot-r<N>-chatA` (base = current main when you start; P1-3 must already be on that main), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-p1-4-line-shot-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, and `pass N fail 0`.
