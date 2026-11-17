# Hand-back step-p1-2-battle r2
Step file: handoff/steps/step-p1-2-battle.md (sha256 86bf53d9b7eb04dd9f7b47ae6f18a5bc1ccd0c348db3457c3958c2836729dc68)
Base commit: 01dfe82a48e851c435d0b9282c76d54aa33771e2     Head commit: 79e4f83e5101f20a1eb91534b6d23760484e69a5     Branch: step/step-p1-2-battle-r2-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/btf-adapters/src/btf-defaults/battle.ts
M	src/btf-adapters/src/index.ts
A	src/rules/battle/battle.ts
A	src/rules/battle/damage.ts
A	src/rules/battle/index.ts
A	src/rules/battle/roster.ts
A	src/rules/battle/win.ts
M	src/sim/actions.ts
M	src/sim/chaos.ts
M	src/sim/run.ts
M	src/sim/types.ts
M	src/sim/world.ts
A	tests/parity/battle.parity.test.ts
A	tests/rules/battle-qa-build.test.ts
A	tests/rules/battle-qa-r2.test.ts
A	tests/rules/battle-qa.test.ts
A	tests/rules/battle.test.ts

## Green
npm test: 904/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

```
# tests 904
# pass 904
# fail 0
# cancelled 0
# skipped 0
# todo 0
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
```

Chaos (rules off): stage-fixed steps 3120 rejects 0; stage-weighted steps 5542 rejects 0. deps: 133 modules, 432 dependencies. Diff vs the base, excluding handback: 372 insertions, 5 deletions (377 changed lines).

## Shipped tests (sha256, unchanged)
bd772d36e40f2cbeb7ec16e51366a4c113adc662402a23d3ee8ec90a7098fa1b  tests/rules/battle.test.ts
0fe7165521f77e4c6fd2ff3ef4a4f2d7e9b180327f927220e4e74d8c6774452c  tests/rules/battle-qa.test.ts
200f0b566b3cdd52ac82bee26a50c48d839a63d3429307d287388fad47000540  tests/parity/battle.parity.test.ts
c12984d2f8e604a4e35ef87d8c6f6eed0c141edd07c99beae0653934ba2b4a78  tests/rules/battle-qa-r2.test.ts
f87589706c6d16adab944cd383f9b0d19f804b3d67fac64456c35716db91a359  tests/rules/battle-qa-build.test.ts

## Helpers & self-review (required)
- Helper: review the `of` lookup and the snapshot-key comment. Asked to confirm prototype names fall through to base, an own key still wins, the comment says nine to match chaos `KEYS`, and the five shipped tests are untouched vs `32dd1a7a`. It re-ran those tests. Result: PASS.
- Self-review: M1 done (`Object.hasOwn` before the index read; `?? cfg.base` only covers the unchecked index type). The "eight snapshot keys" comment now says nine. QA pin `battle-qa-build.test.ts` is byte-identical; the other four shipped tests were not edited. `git diff 32dd1a7a` is only those two lines. Floor 904/0 done. Line cap 377 ≤ 385 done. No other `cfg.stats[id]` lookup remains.

## Decisions & deviations (5–10 lines)
- This branch starts at QA's pin `32dd1a7a` (r1 tip `a187785c` plus `tests/rules/battle-qa-build.test.ts`). It was not a force-push of r1.
- `of` is `Object.hasOwn(cfg.stats, id) ? cfg.stats[id] : cfg.base`, then `?? cfg.base` so a missing index under `noUncheckedIndexedAccess` is still `UnitStats`. An own key, including an own `"constructor"`, is used. A prototype key is not.
- The step-12 comment in `src/sim/types.ts` now says nine snapshot keys, matching chaos `KEYS` (the ninth is `"rules"`).
- The five shipped tests are byte-identical to the pin. Diff vs base `01dfe82a`, excluding handback, is 377 changed lines.

## Next step (optional proposal)
- None. The must-fix was the own-key lookup.
