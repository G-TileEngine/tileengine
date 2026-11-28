# QA: F2a2a menu kit r1 handback (PR #117). Verdict: OK TO MERGE

QA & Build Guard, 2026-11-28 03:05 London.

- PR https://github.com/G-TileEngine/tileengine/pull/117, branch step/step-f2a2a-menu-kit-r1-chatA
- Base fa401c88 (main, unmoved). Code head 8458307c (tree 66355177). Tip 995dcc9d (tree e8f9f255).
- **Expected merge tree onto fa401c88: e8f9f255b4c9dce08b2ff0895992d3432ce9b3e5** (`git merge-tree --write-tree`)
- Floor after merge: 1203. No pin.

## Checks (QA's own, on the tip)
- Product files are byte-identical to QA's kit trial 3e430273 (tree 5687d21b). Outside docs/, handoff/ and handback/, the diff against it is empty.
- 4 files, 129 counted lines, all at cap: test 65, app.css 14, game-menu.ts 44, icons.ts 6.
- Tip adds only handback/step-f2a2a-menu-kit/r1/ (6 files). No token, IMEI or serial patterns found.
- Guide c8d29a83 and shipped test 22bb52ea match. Kit `sha256sum -c` OK.
- npm ci && npm run green: 1203/0. tools tsc: only the 3 base errors (page.ts L101; home.ts L93 ×2).
- plants-f2a2a.py: 16/16, tree clean after.
- Smokes: QA ran all 25 PASS at 390/360 on the identical product tree during the F2a2b r2 trial (F2a2a plus r2 on top) and during the F2a2a kit review. Not re-run here.
- Rule 8 clean (reviewed at kit stage; bytes unchanged). Nothing imports game-menu.ts except its test.
- HANDBACK lists two helper reviews and its own smoke run.

## Carry
- sectionSheet's type also allows none, menu and switch (kit non-blocker, unchanged).
- The F2a2b r2 patch 1c165c9a applies on e8f9f255 (CoS: tree 7618bcfc). After the merge, QA's postmerge confirms the base for the F2a2b go.
