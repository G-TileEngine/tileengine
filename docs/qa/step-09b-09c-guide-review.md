# QA guide review: step 09b r2 (art upload) and step 09c r1 (link markers)

QA, 2026-11-24 23:20 (UK time). The guides are on the box and not committed. Shas checked: 9b guide 1cd3ec43 (120 lines), paste c7e8799e, patch b0acc887 (519 lines); 9c guide b38c88c9 (90 lines), paste 9da2dec8, patch c4f13ee5 (100 lines).

## 9b r2: GUIDE OK
I reran it on my own worktree at main 2a6146ae, applying the 9b patch, with a real `npm ci`:
- Count: 11 files, +271/-33 = 304 (cap 391).
- Green: 1141/0. Tools tsc shows only the 3 base errors (page.ts:101, home.ts:88 twice).
- Smokes: s9b 14 ok at 390 and 360. s9, s8c, s8, S0 and s6d all pass. AUDIT PASS.
- Mutation: making `dropUndo` a no-op fails s9b.
- Code read:
  - `addPicture` sniffs the type, then checks the size, before it hashes or writes anything.
  - The bytes and planSave's writes go in one commitWrites.
  - `loadLayer` checks the size before decoding.
  - Rulings are labelled EA rulings, never CEO rulings.

## 9c r1: GUIDE OK
I reran it on top of 9b:
- Count: 3 files, +61/-1 = 62 (cap 95).
- Green: 1142/0.
- Smokes: s9c 6 ok (stairs cell 1440/810 light px against 0 on the floor). s9b, s9, s8c, s6d and S0 all pass. AUDIT PASS.
- Mutation: with the 9b-only board.ts, the named test fails 0/1.
- `marks` is built once per match and is the same array every frame when nothing is selected, so the memo holds. No edits in src/, match.ts or hud.ts.

## Non-blockers
- 9c § Baseline republish says QA's walk check runs "on a phone at 360 width". QA's post-publish check is headless at device scale 1, and only the CEO's phones are real devices. A wording fix is suggested for the next revision; it is not required.
- 9c base: pin main after 9b merges, as the guide says.
