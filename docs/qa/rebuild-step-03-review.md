# QA review: rebuild record step 03

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch` (origin/main `fdb7ad56`).
- **Record:** `docs/rebuild/step-03.md`, hash-object `98afad8a`, 1397 lines.
- **Checked against:** merge `b8f2b480` (tree `422e62ab`).

## Verdict: OK (no must-fixes)

## (a) Blob table
- **Blobs:** 16 of 16 blob ids and line counts match `git ls-tree` at `b8f2b480`.
- **File set:** exactly the product files in `fdf29002..e9e5327d` (with `handback/` excluded). None are missing and none are extra.
- **BUILD_GUIDE.md:** it is in `git diff fdf29002 b8f2b480` only through main's `fc5b3cb` (CEO laws 14–20 + roadmap r15). It is not in the step's diff, so leaving it out is correct.
- **Lines column:** the (b) table's Lines column equals `git diff --numstat` for all 16 files.

## (b) Appendix, scripted
- **Full blocks:** 16 of 16 equal `git show b8f2b480:<path>` byte for byte.
- **Diff blocks:** 12 of 12 equal `git diff fdf29002 b8f2b480 -- <path>`.

## (c) Cites
- **Code cites:** each one at `b8f2b480` holds the claimed text, including:
  - `project.ts:8/7`, `home.ts:42-47/52/54`, `test-launch.ts:16-24/33-39`
  - `app.css:1-2`, `page.ts:13/56/59-60`, `play-stage/project.ts:31/33-34/55/58-70`
  - `test-gate.ts:11-12/16`, `index.html:4`, `build.ts:24-25`
  - smoke `:31/49-52/106/108-110/114/116-122/129`
  - the test-file lines
- **QA cites:** I read every QA1/QA2/QA3 cite on main. QA1 is blob `dbe5df6b` (sha256 `e44de7a8`). QA2 is `8f0899c2` (sha256 `d1dbd5e1`). QA3 is `d2fe0674` (sha256 `b56e8b0a`). The line counts are 88/52/22, as stated. Each cite points at a non-blank line that supports its claim.
- **Guide cites:** guide L8/14/48/55/86/87/93 are correct at blob `58c77102`, which is the same on `21e630e1` and at the merge.
- **Optional range nits (not mismatches):** these ranges stop short of each block's closing `});`. The claimed text is inside each range.
  - L77 `test-gate.test.ts:7-16`: the test runs to :22.
  - L77 `:60-68`: the test runs to :71.
  - L79 check 8 `:108-114`: the check ends at :115.
  - L79 check 9 `:116-122`: the check ends at :123.

## (d) Facts
- **Base, floor and tests:** base `fdf29002`, floor 1041, N=8, 1049/0.
- **Commits and trees:**
  - r1 `24650f3d`/`1ecea83d` (trees `1d2023e7`/`a2d1c123`)
  - r2 `ca9d603a`/`806e5825` (`d0f7a15e`/`ed70eae0`)
  - r2b `87508786`/`e9e5327d` (`6cfc43f4`/`055a910a`)
- **Merge:** PR #81 `b8f2b480`, 14:59 UK. Parents are `ff65f945` and `e9e5327d`, and the tree is `422e62ab`.
- **After the merge:** main `fdb7ad56` adds only the r2b review.
- **Gates:** 299 = 266 + 33, the smoke is 129 lines, stamp `4d2ee9e86927`, S0 `d528795e` with 14/14, and s3 18/18 with 12 of 12 runs passing after r2b.
- **r1/r2/r2b fixes:** the r1/r2/r2b bug-and-fix story in (d) 1–7 matches QA1–QA3 and git.
- **Shape:** the same as `step-02b.md`.
