# QA review: rebuild record step-04a (draft)

**Verdict: NOT OK. Two one-line cite fixes. Everything else checks out: blobs, appendix, facts, commands and non-blockers.**

Record `/workspace/share/rebuild-04a/docs/rebuild/step-04a.md`: 1180 lines, hash-object `cd8370cf`, sha256 `9dae3fce`. Checked against merge `02efdd04` (tree `6326d309`, parents `544087f4` / `f5dcd732`), guide blob `35cc37db`, HB1 `99d1d55c`, HB2 `999bd57d`, QA1 `498fbb09`, QA2 `88a1d18d`, V1 `45feb27d` (203 lines), V2 `04f4a270` (225 lines).

## Must-fix
1. **L84** cites "checklist L25". G7 is `docs/qa/handback-checklist.md` **L26**, at `402699d5`, `98529e35` and `02efdd04` alike. BUILD_GUIDE L123 is right.
   **Fix:** `G7 (checklist L25; BUILD_GUIDE L123)` → `G7 (checklist L26; BUILD_GUIDE L123)`.
   (QA1:8 on main has the same kind of slip: it says "checklist L22; BUILD_GUIDE L114", and the correct lines are L26 and L123. The record should not copy it. A follow-up QA doc can note the correction.)
2. **L68** presents `tools/maker/test-launch.ts:13` as `export const backScreen = (from) => …`. The real line has types: `export const backScreen = (from: string | null): "home" | "trash" | "project" | "stage" => from === "home" || from === "trash" || from === "stage" ? from : "project";`.
   **Fix:** quote the real line exactly, or write "`backScreen` (types elided) returns `from` for home/trash/stage, else `"project"`".

## Checks (all PASS)
- **Blob table (L146-161):** all 14 blob ids and line counts match `git ls-tree` at `02efdd04`. The set equals `git diff --name-only 402699d5 f5dcd732 -- . ':!handback/**'`, which has no docs files.
- **Appendix:** a script compared all 20 blocks byte for byte. The 8 full new files and the 6 "as merged" blocks equal `git show 02efdd04:<path>`. The 6 diff blocks equal `git diff 402699d5 02efdd04 -- <path>`.
- **Code cites (L58-78, L82):** each was checked at `02efdd04` and matches. This includes `project.ts:8`, `app.css:41-43`, `stage.ts:20-23,36-47,40,48-50,55-63,61,76-86,87-90,92-113,96-97,101-110,117-160`, `home.ts:30,44-49,47,56-64,76,97`, `test-launch.ts:13,22`, `sheet.ts:3-5,13-20`, `paint.ts:4-15,16-28,29-35`, `drops.ts:5,21-36,25-33`, `read-project.ts:2,106-108`, `stage-editor.test.ts:22-57`, `placement-dropped.test.ts:11-27`, `maker-law.test.ts:25,32-34` and smoke `:26,30-37,46-47`. The one exception is the L68 quote (fix 2).
- **Guide, HB, QA and V cites:** they check out. Guide: L14, L17, L102, L113, L116, L118, L125-139, L141, L143-151, L166-181, L223. HB2: 3, 23-30, 32, 36-38, 40, 57-61, 63, 65. HB1: 53. QA1: 3, 8, 15, 21, 27-31. QA2: 3, 5, 7-13, 15 (15 lines). V1: 16-20. V2: 16-27 and §2/4/5/7/10. `looks.ts:46` is the water/wall-block choice.
- **Facts:** r1 gate 386 + 15 = 401 (NOT OK), r2 `marks()` fix at `stage.ts:40` for 385 + 15 = 400, 1053/0, stamp `c2359142b9af` (r1 `fdb19d446efe`), tree `6326d309`, merged 2026-11-19 18:22 UTC (+0000, which is UK time now), golden `90dde42a`, S0 `d528795e`. Main is still `02efdd04`, and the 4 docs files added after the base are 5325 insertions. No CEO attribution appears anywhere in the record.
- **Rebuild commands (L104-128), run on a fresh worktree at `02efdd04`, all reproduce:** green exit 0 with 1053/0. Both shortstats give 13 files, 385+/15-; `':!docs/**'` is needed on the merge and is correctly explained. The golden and S0 shas match. `git diff --exit-code 402699d5 HEAD -- golden/play-stage/s0` is clean. TAP gives `ok 1030 … seed 24301`. The build exits 0 with `c2359142b9af/` in both `maker/` and `play-stage/`. The s4a smoke gives 16 ok and SMOKE PASS. Every `git diff` here compares two commits; none falls into the working-tree-vs-index trap. `git hash-object <path>` on L144 is a correct working-file check.
- **Non-blockers (L134-138):** items 1-4 match QA1:28-31; item 4 is correctly updated to 161 lines at the merge. Item 5 matches QA2:15. L140's older step 2/3 carries are uncited but consistent with the step-02/03 reviews; adding a cite would be nice but isn't required.
