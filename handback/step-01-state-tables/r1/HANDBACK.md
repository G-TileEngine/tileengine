# Hand-back step-01-state-tables r1
Step file: handoff/steps/step-01-state-tables.md
Base commit: 6b10de48d568c5266247c05f1c63f0abbaa8d1c9     Head commit: 6dc7ac22cd11dc088c972ef9b24ce04033bdd997     Branch: step/step-01-state-tables-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	.nvmrc
M	scripts/check-law.sh
D	src/state/.gitkeep
A	src/state/index.ts
A	src/state/shared.table.ts
A	src/state/tactics.flow.table.ts
A	src/state/tactics.input.table.ts
A	src/state/types.ts
A	src/state/xgo.ts
A	tests/fixtures/law-bad/rules/card-id.ts
A	tests/state/helpers.ts
A	tests/state/tables.coverage.test.ts
A	tests/state/tables.merge.test.ts
A	tests/state/tactics.script.test.ts
A	tests/state/xgo.accepts.test.ts
A	tests/state/xgo.rejected-noop.test.ts

## Green
npm test: 18/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Branched from 6b10de4, not from later main 9679b88. The step file on main was read (sha256 7b6f6c64…) and was not edited.
- `sets` tags, where STATES gives a driver note: target, outcome, side, round, turnEffects+fuse, spent, sel+moveCells, sel, path, cell, action. An empty sets cell omits the property. xGo does not read them.
- `sample` payloads: unitId "u", actionId "rally", tile Sq {c:0, r:0}, outcome "win". An omitted or unrecognised next falls back to the first legal pick: targeting, unitDone, or idle.
- The script starts at play.loading. The rival side is the listed SELECT_UNIT then FUSE_EXPIRE, not a second copy of the player events.
- TABLES is [shared, tactics.flow, tactics.input], frozen with Object.freeze. The index is a private Map built once by mergeTables at load and not written after that.
- .nvmrc is the single line 24 plus a trailing newline. engines.node is unchanged (>=22.18.0).
- CN-002: only the no-card-types regex in scripts/check-law.sh changed. card-id.ts is the notice's two lines. Diff excluding lock and handback is 397 insertions and 1 deletion.

## Next step (optional proposal)
- step-02-clock: the one sim-ms clock and FUSE_EXPIRE's timer, from handoff/steps/step-02-clock.md. FUSE_EXPIRE stays an event only until that step.
