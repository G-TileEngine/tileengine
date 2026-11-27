# QA review: ART1a r2 (PR #115)

Date: 2026-11-27 22:15 GMT. Reviewer: QA & Build Guard. Delta review of the one rework round after r1 (step-art1a-review.md, 7ce02f98).

Verdict: OK TO MERGE. Expected merge tree onto main dad319a0: 1593f6ea45fd29b4882882638ca57d55c2199eaf (git merge-tree --write-tree, no conflicts).

- Head 6ed39a8ec6377d81b23ef67da9633e432b4dfa08 (tree 4a1762ce), fast-forward from r1 tip ee6989cd (no force-push).
- Code head 5dcfc16315cf2fb2a61f39b822ce97e65b6250cd, tree 020645f362071d6c796d203ff52e193502d36a11, equal to EA's r2 trial tree that QA ran in full (step-art1a-r2-goline-check.md, 98ec76eb): green 1194/0, tsc 3 base errors only, plants 24/24, pins unchanged and output byte-identical to r1, 64 refused, Rule 8 scan clean, 398 counted lines within the r2 caps and the 400 gate.
- R1 (Rule 8 chained headers): cleared. Nit (outDir from import.meta.url): cleared.
- Scope vs base 4912a973: only the 9 Files-list paths plus handback/step-art1a-bake-core/r2/. Token scan of the handback: 0.
- Main moved 4912a973 -> dad319a0 by docs/qa only (my two docs, shas match my local copies).
- Flag (accepted, as in r1): handback Node v22.23.3; engines >=22.18.0 allows it; QA and CoS runs used 24.
- ART1b carries unchanged: barrel pins, rgb() #rrggbb only, drop `?? [0, 0, 0]` at sprite L55 and L71, ramp bound via UX and DSK palette contract, manifest hash order stated in the guide.

Postmerge: floor 1194, QA tree 1593f6ea, once CoS gives the merge sha.
