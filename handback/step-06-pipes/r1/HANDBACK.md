# Hand-back step-06-pipes r1
Step file: handoff/steps/step-06-pipes.md
Base commit: bf383fe0b53db5c7c0fdbc105ed8fa3cba689345     Head commit: 63bd941dc888eaee6eaeaead9d25482980977f17     Branch: step/step-06-pipes-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/core/targeting/index.ts
A	src/core/targeting/pipes.ts
A	src/core/targeting/types.ts
A	tests/core/pipes.test.ts

## Green
npm test: 82/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The export-list test uses dynamic import() of index.ts, then Object.keys().sort(). A compile-time Eq<Aim["pipe"], "unit" | "tile"> is asserted true. There is no namespace import.
- A dead UNIT whose fallback cell is empty returns reason dead, not empty, as the table says. An off-map fallback returns offMap. A living id is hit at its current cell and fallbackAt is ignored.
- fallbackAt is used only when get(id) returns a body with alive false. An unknown id returns dead and the fallback cell is not read, even if that cell is occupied or off the map. The truth table lists unknown only on the no-fallback row.
- Private helper livingAt: occupantAt's id is a hit only if that id is still alive. A TILE miss is then empty; a UNIT fallback miss is dead. resolveAim does not read the edge. aimUnit and aimTile omit fallbackAt and edge when the argument is absent, never undefined.
- No module cache. These functions do not throw and do not emit a Notice. src/index.ts is unchanged because it is not in the file list. Diff is 209 insertions, 0 deletions, four files.
- Drive already had step-06-pipes-r1.bundle, uploaded in another chat. This chat uploads step-06-pipes-r1-chatB.bundle and HAND-BACK-step-06-r1-chatB.md. Those other files were not moved, renamed, overwritten or deleted.

## Kit files used
- handoff/steps/step-06-pipes.md (origin/main) 4d07810444822dc28426a5e21c16bf59c52b9f7ce2cd591f5c3e8088bc0579bc
- The copy on base bf383fe is e47a5e99699578aa8103c6ed0c541d69d0bce13f7ddfd3d2f52fec9fbb772bb2 (published base lines only). The implementation follows origin/main.
- BUILD_GUIDE.md (base bf383fe, same bytes as origin/main) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20
- handoff/HAND-BACK.md (base bf383fe, same bytes as origin/main) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
- No Change Notice with this step.

## Next step (optional proposal)
- step-07-events-log, from handoff/steps/step-07-events-log.md on main. This step does not log an aim.
