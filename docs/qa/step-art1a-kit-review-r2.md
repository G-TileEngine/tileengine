# QA: step-art1a-bake-core kit r2 delta check

Reviewer: QA & Build Guard. Date: 2026-11-27 (London). This answers the r1 review in docs/qa/step-art1a-kit-review.md (sha256 90060235…b6ec).

| Item | sha256 | Notes |
|---|---|---|
| Guide r2 | a3faaa3ce1bc18fddc834bcddce8b975678bd15d38b08f0b4e283d7ac429ff6f | 182 lines |
| Paste | c97bbfc096a9eb466e0b814e1e7e192b753156e8136bf55ad401e7eff53cbcfe | |
| Kit SHA256SUMS | 90207be2b0fbd3e642239539786812632f08ee8e72bf448ec521232f8a28757d | 117 entries |
| Top-level SHA256SUMS | 060a11977596416b12495febe9296ef0b68108273dcd50e28366e12792e2e20b | |
| Trial patch | d009b8af412fd0cea7bf2646d60bf4e3a553266503eba7beb1f2415c6c167584 | trial tree c029016e |
| Plan delta | 5e3de6f166b21dcd4b51750b6f26e382a8bedd51879b189bb5b7b2983e37cb9a | result 5d1836de, 459 lines |

**Verdict: OK TO SEND.** One hygiene step comes before CoS pushes; see Notes.

## QA's own run
The run was on a fresh worktree of fea3098b with the r2 trial patch applied.
- **Tree:** c029016e, as stated. Numstat is +387/−0 in 9 files. bake.ts is 46 (cap 47) and the test is 125 (cap 125).
- **Kit:** both sum files pass. The kit has 121 files and 5,970,450 bytes once the `*.r1` copies are excluded, which matches Ruling 12. The test and palette.json are byte-identical to the kit.
- **Green:** 1194 pass, 0 fail. check:law is OK.
- **tsc:** only the 3 base errors.
- **Plants:** 24/24 caught (P24 is the tile fallback), and the tree is clean afterwards.
- **Bake:** `bake.ts /tmp/b 32 48` prints the same two pinned lines as r1. With `64`, `abc` or `" 48"`, it exits 1 with `art-bake: tile must be 32 or 48 ("…")` and writes no folder.

## r1 items
- **M1:** fixed and checked. The code, Ruling 8 (L44), the plant, the test (spawnSync on 64, with a non-zero exit and the message on stderr), the anchors, the acceptance list and the paste all agree.
- **W1:** fixed. Ruling 11 and paste L8 now cover a braceless `for (…) oneStatement;`. That clears the 4 trial lines.
- **W2:** fixed. ref-art1a.py now makes its png-dir. With a nested folder that didn't exist, its output equals expected/ref-art1a.json byte for byte.
- **Ruling 7:** now cites QA's haze check correctly.
- **Concept sheets:** Open question 1 now records QA's view and leaves the call to CoS with the CEO.
- **Plan delta:**
  - It applies on 8b6e9386 and gives 5d1836de. L109 and L113 are unchanged.
  - The only changes from r1 are the 387 size and the L152 wording QA suggested.
  - UX owns the lines.

## Notes
- **The 2–8 ramp bound in QA's r1 carry was wrong. QA withdraws it.** EA notes that r6b has 1-step `fl_*` ramps and a 9-step `leaf` ramp. ART1b validates against the palette's real contract, which UX and DSK settle. The other two carries stand: `rgb()` rejects anything that isn't `#rrggbb`, and sprite.ts L57 drops the black fallback.
- **Push hygiene:** the box kit folder also holds 4 `*.r1` files (SHA256SUMS.r1, plants-art1a.py.r1, ref/ref-art1a.py.r1 and tests/tools/art1a-bake.test.ts.r1). PUSH-LIST L19 says not to push them, but a whole-folder push would carry them into the public repo. EA should move them out of `handoff/` before CoS pushes, or CoS should push from the push list only. Check afterwards that the pushed folder has 121 files.
