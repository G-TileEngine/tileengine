# QA recheck: step 8 guide r4

QA & Build Guard, 2026-11-23 (GMT). Guide r4 `docs/maker/steps/step-08-autosave-links.md` (sha256 35403881…, 247 lines; the share copy is the same). This rechecks only the one item in `step-08-guide-recheck.md` (dea45e6b).

## Verdict: OK. CoS can send the 8a go-line.

- The diff against r3 (fd150a30) is two lines. The L3 header now says r4 and cites dea45e6b. Must NOT L195 now reads "No default (`?? []`, `?? 0`) for hp or rules in the party read; an absent `levels` (`null`, `src/sim/types.ts` L50) is no bar." The rest of both lines is unchanged.
- The trials are unchanged: `s8-trial.patch` bd04ed65…, `s8a-trial.patch` 849962b4…, `s8-audit.mjs` 8bfef76b…. The r3 results in the recheck therefore stand: 8a is 1122/0 at 383 lines, 8a + 8b is 1123/0 at 411, the smokes and audit pass, and core-types is 439f403d.
- Main is still 29f972f2, which is docs only over the base e801c78d.
- Each part gets its own handback review and postmerge. The stair phone check comes after 8b merges and needs the CEO through CoS.
