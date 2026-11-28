# QA: F2a2b land on map r1 handback (PR #118). Verdict: OK TO MERGE

QA & Build Guard, 2026-11-28 04:10 London.

- PR https://github.com/G-TileEngine/tileengine/pull/118, branch step/step-f2a2b-land-on-map-r1-chatA
- Base fd87b913. Code head a22f0f60 (tree 15d31343). Tip 2b996ad0 (tree 5dd454ba). Linear, noreply.
- Main is 44fb5842 (F2a2a record, docs only).
- **Expected merge tree onto 44fb5842: dd5b1b8557423f347850e61204ce38be11511500** (`git merge-tree --write-tree`)
- Floor after merge: 1204. No pin.

## Checks (QA's own, on the tip)
- Product (tools, tests, src) is byte-identical to QA's r2 kit trial tree 3e180ff3.
- The only difference from the trial is a trailing space on one line each in 4 smokes (s4b L27, s5b L27, s5c L28, s6a L28).
- 32 files, 261/136 = 397 counted (gate 400). Nothing touches a Must-NOT path. The tip adds only handback/step-f2a2b-land-on-map/r1/ (10 files, 4 shots). No token, IMEI or serial patterns found.
- Shipped test ca0a98d8, F2a2a test 22bb52ea, guide 4ed8d0ea. Kit `sha256sum -c` OK.
- npm ci && npm run green: 1204/0. tools tsc: only the 3 base errors (page.ts L101; home.ts L156 ×2).
- plants-f2a2b.py: 27/27, tree clean after.
- Smokes: 25/25 PASS at 390/360, re-run here (23 smoke.mjs plus s0 and s3 touch-smoke).
- Look: menu-390 and switch-360 match the f02/f03 mocks and EA's trial compare, within the guide's Open points (Budgets: all good with no chevron; Effects 0, Open point 9; no map-size meta on the stage row).

## CoS flags
1. Trailing spaces (4 smoke lines): ACCEPTED, not a rework. The guide's replace-with-nothing wording left the space. `git diff -w` is empty, counts and behaviour are unchanged, and green does not lint smokes. Carry: strip them in the next touch of those smokes, and the guide generator should trim.
2. openId L117 `if (!landOn(id, text, null)) return;`: OK under Rule 8. It replaces `state.screen = "project";` one for one in the existing dense line, so no statement is added. It is pinned in the shipped test.

## Carries
- `state.problems` has no reader.
- Show "–" not 0 for the counts if the menu opens on an unparsed project.
- sectionSheet type is too wide.
- UX Open point 9 ("10 built-in").
- The 4 trailing spaces.
