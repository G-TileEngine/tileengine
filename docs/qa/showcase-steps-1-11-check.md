# QA check: steps 1-11 showcase project (pre-APK)

2026-11-26 23:5x London, QA & Build Guard. Inputs:
- Main 98325f54f836a50187bae00240c5a0f405fd3b24 (tree b0e0fd7e), on b7acc899.
- data/showcase/steps-1-11.tileproj/ (28 files) and data/showcase/README.md (4ccebb9a).
- EA's helper check-and-pack.mjs (83ccd0c2), run from /workspace/share/s11/showcase/.

**Verdict: OK TO BUILD the APK from data/showcase/steps-1-11.tileproj on 98325f54.**

## What I checked (fresh worktree at 98325f54, npm ci)
- Scope:
  - 4c6d1c40 to b7acc899 touches only docs, handoff/dsk-rulings and data/staging.
  - b7acc899 to 98325f54 touches only data/showcase/ (29 files).
- Hashes: all 29 files match the push list 72ba955f and EA's SHA256SUMS 8d556a83.
  - project.json is 0c692726: formatVersion 6, catalogueRev 30, name "Showcase steps 1-11".
  - The project's file tree hashes to 9d0c1923.
- Nothing reads data/showcase: `git grep` over src, tools, tests, scripts, package.json and handoff/steps is empty.
- Green at 98325f54: 1170 pass, 0 fail, the same as the base.
- check-and-pack on 98325f54:
  - readProject ok with 0 rows (0 hard), assetRows 0, Test gate allowed.
  - All 3 stages open: Village, Wolf den and Siege.
  - All 4 links open: door (autosave), stairs, door and gate.
  - buildGame ok, 1043097 bytes.
- The zip:
  - My zip's sha256 is 7600a41f, built with commit 98325f54. EA's showcase-game.zip (6506a1f7) differs, so it was built with another commit string. Build the APK from a fresh zip of 98325f54, not from EA's share copy or EA's TileEngine-11bb0a50baab APK.
  - 137 files, and build.json names 98325f54.
  - project/files.js holds the showcase (Village, Wolf den, Siege), and the picture asset is inside.
  - No dev.js, no window.__, and no tools/maker or src/editor content.
- Boot: my own probe, touch at 390×844 and 360×844.
  - No page or console errors, no off-origin request, no HTTP status of 400 or more.
  - The HUD shows "YOUR TURN … Level 0 · 0/3 XP … End turn".
  - The background picture loads and paints: 17 colours, more than 12k green pixel samples on the board. This is not just blocks.

## Not checked by me (phone checks)
README rows 2–14 (combat, effects, talk, XP and level-ups, travel and party carry, stage rules) are play-through checks I did not run in the browser. My check covers the static proof: every stage and link opens in the play stage, and the zip boots and draws.

## Gaps (known, from the README; for CoS and EA)
1. **Weighted and waves pools:** the Test gate lets such a stage through, but the play stage then refuses it with "play: stage" (`tools/play-stage/project.ts` L66 passes `picks: 0, waveUnits: 0`). That is a real gate and play mismatch for any project using those pools. It needs a builder step and a roadmap row; nothing schedules one yet. The showcase doesn't use these pools, so this doesn't block it.
2. Autosave and Continue work only in the maker's Test. The exported game and APK have no save.
3. Budgets are absent because 11c1 isn't merged.
4. The maker has no .tileproj import.
