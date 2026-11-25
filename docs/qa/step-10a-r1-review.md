# Step 10a r1 review (carries before the engine path)

- PR: https://github.com/G-TileEngine/tileengine/pull/103, branch step/step-10a-carries-r1-chatA.
- Base: 31f4c0c4.
- Code head: ffe56f93 (tree 3e5521a2).
- Tip: 8ed982f4 (tree 9dc243db). The tip adds HANDBACK.md only.
- Both commits are by G-TileEngine (noreply address).

**Verdict: OK TO MERGE.** The expected merge tree onto main 751994a7 is **4f29428cf0ba674881c306fdbce4977c31b30909**. I checked it with git merge-tree, and it matches CoS's.

## QA re-run (code head, fresh worktree)
- npm ci, then green exits 0 with **1146 pass, 0 fail**. That meets the floor of 1146.
- tsc on tools shows the 3 base errors.
- Count: 18 files, 82 lines added and 25 removed (107 of 400). Every file is within its cap, and all files are in the Build table. src/rules/levels/levels.ts is in the table under Rule 7.
- All 18 smokes pass solo at the guide's counts: S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6.
- The s8 audit passes (133 / 147 / 146).
- s4c mutation (base smoke restored): step 5 times out at 390 and 360. This matches the handback.
- Named-test mutations (base file restored):
  - save.ts fails the D22 ids test.
  - store.ts fails the writeBytes test.
  - board.ts and project.ts each fail the tidies test.
  - art.ts makes the whole file fail, because uploadBytes is missing.

## Law notes
- levels.ts: the loop now trusts its rows through `as readonly LevelStart[]`. This is safe, because the `badStart` check at L37 validates every field of every row and throws first. The old in-loop skip was dead code.
- art.ts uploadBytes reads 64 KiB first, and reads the whole file only for a fitting or damaged-head picture. The upload byte cap is still an open carry.
- The handback has the Code head label, gives the tip apart from it, and commits no raw log.

## Postmerge
Run qa-postmerge.sh with the 2-parent merge and tip 8ed982f4. Expect tree 4f29428c and green 1146.
