# P1-5 enemy turn, ChatA r2 (PR #68) — build review

QA & Build Guard, 2026-11-17 14:15 GMT. Evidence: `docs/qa/qa-runs/p1/p1-5/build/`. Fetch-only; no `refs/cmp/*` writes were needed. No GitHub/Drive writes.

**Verdict: OK TO MERGE.** Expected merge tree (FF, main == base `69fad867`) **`08dd00be721618ab100353ebf934d347b67e58ec`**. Postmerge floor **957**. No pin.

- Tip `1596d232` (tree `08dd00be`), code `a214b928`, base `69fad867` (= origin/main). Both commits author+committer `G-TileEngine@users.noreply.github.com`. HANDBACK last.
- Diff vs base excluding handback: 10 files, +304/−2 = **306** (cap 400). Per-file caps hold (`bot-ability-priority.ts` 114/130, `action-budget.ts` 12/20, `exploit.ts` 5/8). File list matches the kit. Do-not-touch trees unchanged. Three shipped tests are byte-identical to the r2 kit and proto `2db004f6`, including QA pin `bot-qa-p15` sha256 `2c04c0a3…`.
- HANDBACK §0.6 is present and not thin (helper on spell-before-basic-before-BFS, stepReach, neutrals, local kill tracking, Object.hasOwn, no sim import from rules: launched, no report, then stopped; the same checks done in-chat; G1–G10 / Acceptance self-review). Flag only: the helper itself did not return a report.
- Code vs proto `2db004f6` / `9e7ef202` is a ChatA rewrite. `shotRow` and `stats` use `Object.hasOwn`. Orthogonal BFS is capped at `stepReach` 2, with local HP/cell tracking and no RNG. `acceptedCheck` allows ability/interact when rules are on, the actor is living and on the side, the aim is a unit, and `durationMs` is null; off-rules worlds still require move. `SNAPSHOT_KEYS` / `divergentSnapshotKey` are exported. Inherited `constructor` / `__proto__` probes do not throw and are not spell rows; an own `constructor` row is used (`probes.log`). Actions use UNIT and TILE only.
- Plants adapted to ChatA wording: kit **15/15** (`plants-adapted.log`). QA extras **4/5** (`plants-qa-extra.log`): q01 step hop over cap, q02 hook ignores side, q03 farthest-foe rank, and q05 random action ids are CAUGHT. q04 (hop onto the occupied foe cell) is MISSED — shipped tests never set a 2-step gap with basics out of reach; a crafted probe lands on the foe only when planted. The implementation still uses `cells.length - 1` and a blocked set. Not a must-fix.
- Gates (`pgrep` clear in a separate step before the run): tip vs `--main` `69fad867`, floor 957: tests **957/0**, typecheck/lint/deps (146/462)/state/law/smoke PASS, `RESULT PASS` (`gates-tip.log`). Sim SAME (`afc89d56`, `b8007292`). Stress SAME, complete, no p95 flake.
- `wipeRule` treats `sides[0]` as ours. Callers: `tests/rules/battle.test.ts` and the new `tests/rules/bot-p15.test.ts` soak both pass `["player", "wolves"]` (player first). No `src/` caller besides the export. Consistent; doc-only comment still owed by EA.

Report-only: `ACTION_BUDGET` knob max is 99 not proto 4; `ACTION_BUDGET_KNOBS` is not re-exported; placement ties use `units.all()` order, not proto grid r/c/id. None of these is a must-fix.
