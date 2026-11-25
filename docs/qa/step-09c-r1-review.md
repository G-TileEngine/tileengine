# Step 09c r1 review (link markers): OK TO MERGE

PR #102, branch step/step-09c-link-markers-r1-chatA, product base 21763070 (main now df771fef, docs only).
Tip a1bc6883 (tree 74ec909f). Code head 838a17bd (tree 0278a961). Expected merge tree onto df771fef: 8669ef89 (git merge-tree, checked).

## Checks (QA re-ran on a fresh worktree at the tip)
- npm ci && npm run green: 1142/1142, 0 fail (floor 1142). tools tsc: only the 3 base errors (effect-designer page.ts:101, maker home.ts:88 x2).
- Count: 3 files, +86 -1 = 87/400; only board.ts, tests/tools/link-markers.test.ts and the new s9c smoke changed. No existing test or smoke edited.
- Smokes, all PASS: s9c 8814 6 ok (390 stairs 1152 light px, floor 0; 360 stairs 648); s9b 14, s9 12, s8c 8 (solo), s8 16, s6d 14, S0 touch-smoke 14. The s9c smoke uses waitForFunction only and taps by touchscreen at 390 and 360.
- Export audit (s8-audit.mjs): AUDIT PASS.
- Mutations, each fails the named test: 9b-only board.ts; marks drawn under reach (first instead of last); a new idle overlays array every frame (memo break).
- Build law: no new rAF, timer or loop; no empty catch; nothing in src/**; play stage still doesn't import tools/maker. Marker cache holds at most 4 entries (bounded). Unknown link types draw the generic diamond (Object.hasOwn guard), so no silent missing marker. Targeting with nothing selected still shows the aim squares (base behaviour kept), with marks on top.
- HANDBACK: Code head and tip by sha, counts in Green, no raw log committed, no CEO attribution.

## Non-blockers (carry)
1. linkPx indexes SHAPE with a plain lookup, so pixelsOf("play:link-constructor") returns an empty 16x16 instead of undefined. Not reachable from data (marks use Object.hasOwn); use Object.hasOwn in linkPx on the next touch.
2. HANDBACK PR line predates the PR; a helper was still running at handback (CoS note).
3. Light px below the trial's 1440/810 because the shipped stairs shape has fewer cream px; the gate (stairs > 20) holds.
4. Carries from 9b remain open (levels.ts L64, match.ts:80, writeBytes abort, upload arrayBuffer memory, raf dpr guard).
