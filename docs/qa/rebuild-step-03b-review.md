# QA review: rebuild record step 03b

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch` (origin/main `402699d5`).
- **Record:** `/workspace/share/rebuild-03b/docs/rebuild/step-03b.md`, sha256 `68d446d2…`, hash-object `26857140500ca3bf7b2d802d55c3eba250c82f37`, 5174 lines.
- **Checked against:** merge `402699d5` (tree `0598d3fe`).

## Verdict: NOT OK (3 line fixes; all code, blobs and numbers match)

## Must-fixes
1. **L101: the rebuild command does not prove the twin.** In a checkout, `git diff --exit-code fixtures/demo.tileproj data/templates/demo.tileproj` compares the work tree with the index for those two paths. It is empty on any clean checkout, even when the two trees differ. Replace it with `diff -r fixtures/demo.tileproj data/templates/demo.tileproj`, keeping the comment `#   empty (the two trees are byte-identical)`.
2. **L5 and L122: the QA review is left out.** QA's review is `docs/qa/step-03b-review.md` (hash-object `9dac9e1a`). Its verdict is OK TO OPEN PR, and it gives the G7 accept ruling at L21–48.
   - **L5:** replace "There is no `docs/qa/step-03b-review.md` on main at this merge; QA accepted … (the ruling item was recorded at V:100, V:106, V:115, V:125)" with "`docs/qa/step-03b-review.md` (QA, blob `9dac9e1a`): OK TO OPEN PR; G7 ruling accepts `':!data/templates/**'` (QA:21-48); the ruling item is at V:100, V:106, V:115, V:125".
   - **L122:** replace "None are recorded in a QA review doc on this merge." with QA:66–68:
     1. Add `':!data/templates/**'` to guide L122 in the next docs pass.
     2. The `/workspace/share` guide copy is stale; cite main's.
     3. The HANDBACK "PR: opened by Chief Of Staff" boilerplate is accepted.
3. **L64: the cite misses the second knob.** "guide L55-56" covers only `adjacency-synergy.bonus`. `barrier-line.length` is at L57. Change it to "guide L55-57".

## (a) Blob table: PASS
- **Blobs:** 17 of 17 rows match `git ls-tree` at `402699d5` (ids and line counts).
- **File set:** the set equals the step's product files in `fdb7ad56..f45288d9` without `handback/` (3 code + 7 fixture + 7 template files).
- **Twins:** each template twin blob equals its fixture blob, for `slice.json`, `project.json` and setups 1–5.

## (b) Appendix, scripted: PASS
- **Full blocks:** 10 of 10 equal `git show 402699d5:<path>` byte for byte, including the 4,170-line slice (sha256 `8547ed0a`). The templates are shown once, as twins, as L149 says.
- **Diff blocks:** 8 of 8 equal `git diff fdb7ad56 402699d5 -- <path>`. The slice is given in full only, as stated.

## (c) Cites: PASS except fix 3
- **V cites:** V:3, 23, 27-28, 55-57, 64, 88, 94, 96, 100, 106, 115, 123, 125, 145, 149, 151, 153, 185 and 187 support their claims (V sha256 `61955f07`, 217 lines).
- **HB cites:** HB:3, 26-27, 35, 36, 39, 59-61, 63, 77-120, 126, 129-131 and 133 support their claims (blob `5227ec8b`, 137 lines).
- **Guide cites** (blob `d66e28a0`): L3, 7, 8, 14, 16-18, 34, 37, 42-45, 59, 61, 62, 65, 87-97, 92, 104, 108, 122, 123, 124, 128 and 132 hold the claimed text.
- **Code cites:**
  - `project.json:11` is `catalogueRev` 29.
  - `demo-slice-pin.test.ts:6-8` holds the hashing test.
  - `picker-options.test.ts:6/:8-14/:13` hold the test lines.
  - `read-project.ts:61` and `registry.ts:42` hold the picker checks.
  - `project-home.test.ts:21-22` holds the twin assertion.
- **`af9af6c0` has `data/staging` only:** true.

## (d) Facts: PASS
- **Base and tests:** base `fdb7ad56`, floor 1049, N=2, 1051/0.
- **Commits:** `ffa43f40` (tree `0b174cc9`) and `f45288d9` (tree `908c541e`).
- **Merge:** PR #82, 16:18 UK, parents `992e7d87`/`f45288d9`, tree `0598d3fe`. Main is still the merge.
- **Slice and parity:** slice rev 29 `8547ed0a`; `ok 1028` parity; golden `90dde42a`.
- **Counts:**
  - Accepted gate: 3 files, 25+/1− (26 lines).
  - L122 as written: 3764+/182− (3901+/182− at the tip).
  - Fixtures: 3739+/181−.
  - Trial: 26+/1−.
- **Stamp and smokes:** stamp `ab2063a60e79`; S0 14/14 and s3 18/18 PASS at 390 and 360.
- **Re-answers:** the 5 user answers and 7 defaults match QA's review and the diff.
- **Shape:** the same as `step-03.md`.
