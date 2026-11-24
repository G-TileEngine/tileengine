# QA review: step 8a r2 (PR #96)

Verdict: **OK TO MERGE.** This is the one rework round after the r1 review (docs/qa/step-08a-r1-review.md, sha256 03a1ebaa). All three must-fixes are closed and the full floor holds.

- Branch: step/step-08a-autosave-links-r2-chatA
- Tip: c1219f71357b3df07e49845fe03581ebe59e3754 (handback only, adds handback/step-08a-autosave-links/r2/HANDBACK.md)
- Code head: 4f662831aa36258c0a2b51103f77b40d21f060bd (tree f1664e09)
- Base: 9f7f7e52; fix diff a9ccade3..4f662831 touches only links.ts, test-launch.ts, home.ts (+9/-6); tests unchanged since r1.
- Trial merge onto main 5034dd7a: clean, tree 219640068d7f51562741a3c66f519f495f1d90a7. Merge with --expect-tree 219640068d7f51562741a3c66f519f495f1d90a7.

## Must-fixes from r1

1. **Arrival BFS cost: closed.** links.ts L15 now skips any neighbour `free` refuses before queueing it, so the flood stays inside free cells; N E S W order kept and test 2 passes unchanged. My repro (fresh process each run, 3 runs): A 0.1-0.2 ms (r1: 309 ms), B 4.1-4.5 ms, C 1.0 ms, same spawns as r1. The B first-shot cost is cold `arriveIn` start, not the walk: with C run first, C takes 4.5 ms and B then takes 1.0 ms. The step 7 budget is a warm median under 4 ms (test 8 drops 5 warmups); my green printed test 8 median 0.89 ms.
2. **test-launch.ts cap dodge: closed.** L4-L8 are one import per line; numstat 13/6 = 19 against cap 19, no joins. The second isObj is gone (inline `rec` in `resumed`).
3. **Banner label: closed.** home.ts L79 names "the stage it was going to", "the stage it came from", or unitId, on the same line, no new lines. home.ts 21 against cap 28; test 9 passes.

## Floor (my runs, fresh worktree at the tip, npm ci)

- npm run green exit 0, pass 1122, fail 0; one-parser and baseline-page tests unedited.
- tsc: the 3 base errors only (effect-designer page.ts L101, home.ts L85 x2).
- Count 29 files, +294/-62 = 356/400. links.ts 17/21, test-launch 19/19, home 21/28; every other file as r1.
- s8 smoke SMOKE PASS (16 ok); S0 touch smoke sha d528795e, TOUCH SMOKE PASS (14 ok); export audit PASS (maker play tree 142).
- HANDBACK r2 has the Code head label and discloses the cold-start figures. No raw test log for this step.

## Non-blockers and carries

- tests/tools/autosave-links.test.ts L1-L7 join imports (from r1, untouched in r2). It is not a cap dodge: split, the file is about 102 against cap 103. House-style note for the next step that touches the file; not worth a second rework round, which the process doesn't allow anyway.
- Carry for EA (from r1, still open): when free cells are fewer than the party, extra members drop with no notice (repro D: party comes back with the hero only). For 8b planning.
- r1 non-blockers stand (levels.ts L64 narrowing, project.ts L102 null grid, double slot read in writeAutosave, resumeNotes at openId's rev).

Next: postmerge on CoS's merge sha, then the docs/rebuild/step-08a record review.
