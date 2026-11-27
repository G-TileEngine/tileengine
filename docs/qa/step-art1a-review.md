# QA: step-art1a-bake-core r1 review (PR #115)

Reviewer: QA & Build Guard. Date: 2026-11-27 (London).

| Item | sha | Tree |
|---|---|---|
| Head | ee6989cd | 7ed3f9d3 |
| Code head | 9bd9b5ad | cc4c6b1f |
| Base | main 4912a973 | |

The diff is 15 files: 9 product files and 6 handback files.

**Verdict: NOT OK TO MERGE.** There is 1 must-fix. This is the one rework round (r2).

## QA's own run
The run was on a fresh worktree of ee6989cd.
- **Merge:** `git merge-tree` onto 4912a973 gives 7ed3f9d3.
- **Green:** 1194 pass, 0 fail. check:law is OK.
- **tsc:** only the 3 base errors.
- **Size:** 386 counted lines.
- **Kit:** the shipped test and palette.json are byte-identical to the kit, and the kit folder is untouched.
- **Scope:** no file outside the Files list. No Math.random, Date, performance, rAF, src import or dependency.
- **Bake:**
  - `bake.ts /tmp/b 32 48` prints both pinned lines (99ef690d…cc88 and 97047142…5984).
  - With 64 it exits 1 with the message and writes no folder.
- **Plants:** 24/24 caught, and the tree is clean afterwards.
- **Tokens:** 0 found in handback, tools or the test.

## Must-fix
**R1. Rule 8: chained control headers on one line.** Ruling 11 (QA r1 W1) clears a braceless `for (…) oneStatement;`, meaning one loop header followed by one simple statement. Chaining headers is not that form. Paste L8 also says "don't add or drop braces to move a line count", and these lines drop the outer loop's braces. The kit trial kept these loops split.

| File | Line | What it chains |
|---|---|---|
| sprite.ts | L23 | `for (…) for (…) {` |
| sprite.ts | L36 | `for (…) for (…) {` |
| bake.ts | L27 | `for (…) for (…) {` (CoS's flag said L26) |
| recipes/crate.ts | L41 | `for (…) for (…) put(…);` |
| recipes/crate.ts | L42 | `for (…) for (…) put(…);` |
| recipes/crate.ts | L43 | `if (…) for (…) put(…);`, 200+ characters (not in CoS's list) |

**Fix:** one control header per line, each with its own braced body. The innermost `for (…) oneStatement;` may stay braceless.

**Caps:** splitting all six costs about 12 lines: sprite 79/76, crate 51/46, bake 48/47, total about 398 against 393. That's over the file caps and the limit, but under the 400 gate. EA decides with CoS between two routes, and QA accepts either if the result is ≤400 and Rule 8 clean:
- EA re-states the r2 caps.
- The builder wins lines back with clean code, for example one map for the sel-out mix, as in the trial.

## Rulings on CoS's flags
- **(2) Manifest `hash`: accepted.** It's the real sha256 of each sprite's RGBA bytes in RECIPES order then tile order, and it's declared in § Decisions. Ruling 10's quoted text described the field. EA should define the order in the ART1b guide before ART2 reads it.
- **(3) Node 22.23.3: accepted.** The root engines field allows ≥22.18.0, and QA's and CoS's greens are on 24.22.1. It doesn't affect the merge.

## Nits and carries
- **Nit (do it in r2 if lines allow):** bake.ts L39's default out dir `"tools/art-bake/out"` depends on the cwd. Run from anywhere other than the repo root, it writes a folder that isn't gitignored. Resolving it from `import.meta.url` (as the trial did) fixes that.
- **Carry to ART1b (law 12):** sprite.ts L71 adds a second `?? [0, 0, 0]` black fallback (an out-of-range step in colourise). The first is at L55 (formerly L57). It joins the existing ART1b carry.
- **Helpers:** the § Helpers line is present. The helper passed Rule 8 and missed R1.
